USE nutribox
GO

CREATE PROCEDURE usp_FetchUpeProductsByPage @PageSize INT,
	@PageNumber INT,
	@TotalRecords INT OUTPUT,
	@NextPageNumber INT OUTPUT
AS
BEGIN
	SELECT @TotalRecords = COUNT(*)
	FROM products;

	IF @TotalRecords > @PageSize * @PageNumber
		SET @NextPageNumber = @PageNumber + 1;
	ELSE
		SET @NextPageNumber = - 1;

	SELECT *
	FROM vw_UpeProductsWithImages p
	WHERE p.available = 1
	ORDER BY p.created_at DESC OFFSET(@PageNumber - 1) * @PageSize ROWS

	FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-------------------
CREATE PROCEDURE usp_FetchUpeProductById @Id UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM vw_UpeProductsWithImages p
	WHERE p.id = @Id
END;
GO

-------------------
CREATE PROCEDURE usp_FetchHotUpeProducts @Limit INT
AS
BEGIN
	WITH ProductSales
	AS (
		SELECT up.*,
			COALESCE(SUM(coi.quantity), 0) AS TotalQuantitySold
		FROM vw_UpeProductsWithImages up
		LEFT JOIN customer_order_items coi ON up.id = coi.product_id
		GROUP BY up.id,
			up.name,
			up.category_id,
			up.import_price,
			up.retail_price,
			up.available,
			up.description,
			up.created_at,
			up.image_urls,
			up.product_orders
		)
	SELECT TOP (@Limit) ps.*
	FROM ProductSales ps
	WHERE ps.available = 1
	ORDER BY ps.TotalQuantitySold DESC,
		ps.created_at DESC;
END;
GO

-------------------
CREATE PROCEDURE usp_FetchNewUpeProducts @Limit INT
AS
BEGIN
	SELECT TOP (@Limit) up.*
	FROM vw_UpeProductsWithImages up
	WHERE up.available = 1
	ORDER BY up.created_at DESC;
END;
GO

-------------------
CREATE PROCEDURE usp_FetchRelatedUpeProducts @Limit INT,
	@CategoryId UNIQUEIDENTIFIER,
	@ProductId UNIQUEIDENTIFIER
AS
BEGIN
	SELECT TOP (@Limit) up.*
	FROM vw_UpeProductsWithImages up
	WHERE up.category_id = @CategoryId
		AND up.available = 1
		AND up.id <> @ProductId
	ORDER BY up.created_at DESC;
END;
GO

-------------------
CREATE PROCEDURE usp_FetchUpeProductsByKeyword @Limit INT,
	@Keyword NVARCHAR(255)
AS
BEGIN
	SELECT TOP (@Limit) up.*
	FROM vw_UpeProductsWithImages up
	WHERE up.name COLLATE Latin1_General_100_CI_AI_SC_UTF8 LIKE N'%' + @Keyword + N'%'
		AND up.available = 1
	ORDER BY up.created_at DESC;
END;
GO

CREATE PROCEDURE usp_FetchAllProductNames
AS
BEGIN
	SELECT name
	FROM products p
	ORDER BY p.created_at DESC;
END;
GO

CREATE PROCEDURE usp_FetchAllProductCategories
AS
BEGIN
	SELECT *
	FROM product_categories pc
	ORDER BY pc.created_at DESC;
END;
GO

CREATE PROCEDURE usp_FetchUpeProductsByCategoryId @CategoryId UNIQUEIDENTIFIER,
	@CategoryName NVARCHAR(100) OUTPUT
AS
BEGIN
	-- Get the category name
	SELECT @CategoryName = name
	FROM product_categories
	WHERE id = @CategoryId;

	-- Fetch products from vw_UpeProductsWithImages
	SELECT up.*
	FROM vw_UpeProductsWithImages up
	WHERE up.category_id = @CategoryId
		AND up.available = 1
	ORDER BY up.created_at DESC;
END;
GO

CREATE PROCEDURE usp_FetchPopulatedCartItemsByAccountId @AccountId UNIQUEIDENTIFIER
AS
BEGIN
	SELECT ci.id,
		ci.account_id,
		ci.quantity,
		ci.created_at,
		(
			SELECT up.*
			FROM vw_UpeProductsWithImages up
			WHERE ci.product_id = up.id
			FOR JSON PATH,
				WITHOUT_ARRAY_WRAPPER
			) AS product_id
	FROM cart_items ci
	WHERE ci.account_id = @AccountId;
END;
GO

CREATE PROCEDURE usp_UpdateCartItems @AccountId UNIQUEIDENTIFIER,
	@ProductId UNIQUEIDENTIFIER,
	@Quantity INT
AS
BEGIN
	-- Check if the cart item exists
	IF EXISTS (
			SELECT 1
			FROM cart_items
			WHERE account_id = @AccountId
				AND product_id = @ProductId
			)
	BEGIN
		-- Update the cart item quantity or delete the cart item if the quantity is 0
		IF @Quantity > 0
		BEGIN
			UPDATE cart_items
			SET quantity = @Quantity
			WHERE account_id = @AccountId
				AND product_id = @ProductId;
		END
		ELSE
		BEGIN
			DELETE
			FROM cart_items
			WHERE account_id = @AccountId
				AND product_id = @ProductId;
		END
	END
			-- Insert a new cart item if it doesn't exist and the quantity is greater than 0
	ELSE IF @Quantity > 0
	BEGIN
		INSERT INTO cart_items (
			product_id,
			account_id,
			quantity
			)
		VALUES (
			@ProductId,
			@AccountId,
			@Quantity
			);
	END
END;
GO

CREATE PROCEDURE usp_CreateAccount @RoleId UNIQUEIDENTIFIER,
	@FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
	@Phone NVARCHAR(50),
	@Email NVARCHAR(100),
	@Birthday DATETIME2,
	@Password NVARCHAR(500)
AS
BEGIN
	DECLARE @NewAccountId UNIQUEIDENTIFIER = NEWID();

	-- Insert the new account
	INSERT INTO accounts (
		id,
		role_id,
		first_name,
		last_name,
		phone,
		email,
		birthday,
		password
		)
	VALUES (
		@NewAccountId,
		@RoleId,
		@FirstName,
		@LastName,
		@Phone,
		@Email,
		@Birthday,
		@Password
		);

	-- Select the inserted account
	SELECT *
	FROM accounts
	WHERE id = @NewAccountId;
END;
GO

CREATE PROCEDURE usp_FetchStoreWithStoreHoursById @StoreId UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM vw_StoresWithStoreHours
	WHERE id = @StoreId;
END;
GO

------------
CREATE PROCEDURE usp_FetchCustomerOrderById @Id UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM customer_orders
	WHERE id = @Id;
END;
GO

--------------------------------------------------------------
CREATE PROCEDURE usp_Checkout @account_id UNIQUEIDENTIFIER,
	@phone NVARCHAR(50),
	@province_code INT,
	@district_code INT,
	@ward_code INT,
	@street_address NVARCHAR(500),
	@estimated_distance INT,
	@estimated_delivery_time DATETIME2,
	@note NVARCHAR(500),
	@paid BIT,
	@customer_order_id_output UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
	SET XACT_ABORT ON;

	BEGIN TRANSACTION;

	-- 1. Select the cart_items records for the account_id
	DECLARE @cartItems TABLE (
		id UNIQUEIDENTIFIER,
		product_id UNIQUEIDENTIFIER,
		account_id UNIQUEIDENTIFIER,
		quantity INT
		);

	INSERT INTO @cartItems
	SELECT id,
		product_id,
		account_id,
		quantity
	FROM cart_items
	WHERE account_id = @account_id;

	-- 2. Calculate the profit
	DECLARE @profit INT;
	DECLARE @total INT;

	SELECT @profit = SUM(ci.quantity * (p.retail_price - p.import_price)),
		@total = SUM(ci.quantity * p.retail_price)
	FROM @cartItems ci
	JOIN products p ON p.id = ci.product_id

	-- 3. Insert the customer_orders record
	DECLARE @customer_order_id UNIQUEIDENTIFIER = NEWID();

	SET @customer_order_id_output = @customer_order_id

	INSERT INTO customer_orders (
		id,
		status_id,
		account_id,
		phone,
		province_code,
		district_code,
		ward_code,
		street_address,
		estimated_distance,
		estimated_delivery_time,
		total,
		note,
		profit,
		paid
		)
	VALUES (
		@customer_order_id,
		'57379784-B3F7-4717-9155-25ED93EEF78D', -- Pending status ID
		@account_id,
		@phone,
		@province_code,
		@district_code,
		@ward_code,
		@street_address,
		@estimated_distance,
		@estimated_delivery_time,
		@total,
		@note,
		@profit,
		@paid
		);

	-- 4. Insert customer_order_items records
	DECLARE @customer_order_item_id UNIQUEIDENTIFIER;

	DECLARE cartItemsCursor CURSOR
	FOR
	SELECT id,
		product_id,
		quantity
	FROM @cartItems;

	DECLARE @cart_item_id UNIQUEIDENTIFIER,
		@product_id UNIQUEIDENTIFIER,
		@quantity INT;

	OPEN cartItemsCursor;

	FETCH NEXT
	FROM cartItemsCursor
	INTO @cart_item_id,
		@product_id,
		@quantity;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @customer_order_item_id = NEWID();

		INSERT INTO customer_order_items (
			id,
			customer_order_id,
			product_id,
			quantity,
			unit_import_price,
			unit_retail_price
			)
		SELECT @customer_order_item_id,
			@customer_order_id,
			@product_id,
			@quantity,
			p.import_price,
			p.retail_price
		FROM products p
		WHERE p.id = @product_id;

		-- 5. Decrease the remaining_quantity in product_orders
		DECLARE @exported_quantity INT = @quantity;
		DECLARE @product_order_id UNIQUEIDENTIFIER;

		DECLARE productOrdersCursor CURSOR
		FOR
		SELECT id,
			remaining_quantity
		FROM product_orders
		WHERE product_id = @product_id
			AND remaining_quantity > 0
			AND expiration_date > GETDATE()
		ORDER BY expiration_date;

		OPEN productOrdersCursor;

		FETCH NEXT
		FROM productOrdersCursor
		INTO @product_order_id,
			@quantity;

		WHILE @@FETCH_STATUS = 0
			AND @exported_quantity > 0
		BEGIN
			IF @quantity <= @exported_quantity
			BEGIN
				-- Decrease the remaining quantity
				UPDATE product_orders
				SET remaining_quantity = 0
				WHERE id = @product_order_id;

				-- 6. Insert export_history records
				INSERT INTO export_history (
					id,
					product_order_id,
					customer_order_item_id,
					quantity
					)
				VALUES (
					NEWID(),
					@product_order_id,
					@customer_order_item_id,
					@quantity
					);

				SET @exported_quantity = @exported_quantity - @quantity;
			END
			ELSE
			BEGIN
				-- Decrease the remaining quantity
				UPDATE product_orders
				SET remaining_quantity = remaining_quantity - @exported_quantity
				WHERE id = @product_order_id;

				-- 6. Insert export_history records
				INSERT INTO export_history (
					id,
					product_order_id,
					customer_order_item_id,
					quantity
					)
				VALUES (
					NEWID(),
					@product_order_id,
					@customer_order_item_id,
					@exported_quantity
					);

				SET @exported_quantity = 0;
			END

			FETCH NEXT
			FROM productOrdersCursor
			INTO @product_order_id,
				@quantity;
		END

		CLOSE productOrdersCursor;

		DEALLOCATE productOrdersCursor;

		FETCH NEXT
		FROM cartItemsCursor
		INTO @cart_item_id,
			@product_id,
			@quantity;
	END

	CLOSE cartItemsCursor;

	DEALLOCATE cartItemsCursor;

	-- 7. Remove the selected cart_items records
	DELETE
	FROM cart_items
	WHERE id IN (
			SELECT id
			FROM @cartItems
			);

	COMMIT TRANSACTION;
END;
GO

CREATE PROCEDURE usp_FetchOrderStatusCountByAccountId @AccountId UNIQUEIDENTIFIER,
	@Total INT OUTPUT,
	@Pending INT OUTPUT,
	@Processing INT OUTPUT,
	@Delivering INT OUTPUT,
	@Delivered INT OUTPUT
AS
BEGIN
	-- Count all orders for the given account
	SELECT @Total = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId;

	-- Count pending orders for the given account
	SELECT @Pending = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId
		AND status_id = '57379784-B3F7-4717-9155-25ED93EEF78D';

	-- Count processing orders for the given account
	SELECT @Processing = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId
		AND status_id = 'F2E5678D-19E0-4BE0-BB0D-FDC20E0989D4';

	-- Count delivering orders for the given account
	SELECT @Delivering = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId
		AND status_id = '741AB523-D545-4C8A-97C8-0231802CF0F3';

	-- Count delivered orders for the given account
	SELECT @Delivered = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId
		AND status_id = '83B6EFB9-2A3E-464A-B31A-866F3A0D9274';
END;
GO

CREATE PROCEDURE usp_FetchAddressCountByAccountId @AccountId UNIQUEIDENTIFIER,
	@Count INT OUTPUT
AS
BEGIN
	SELECT @Count = COUNT(*)
	FROM account_addresses
	WHERE account_id = @AccountId;
END;
GO

CREATE PROCEDURE usp_FetchPasswordByAccountId @AccountId UNIQUEIDENTIFIER,
	@Password NVARCHAR(500) OUTPUT
AS
BEGIN
	SELECT @Password = COALESCE(password, '')
	FROM accounts
	WHERE id = @AccountId;
END;
GO

CREATE PROCEDURE usp_FetchAccountById @Id UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM accounts
	WHERE id = @Id;
END;
GO

CREATE PROCEDURE usp_UpdateAccount @AccountId UNIQUEIDENTIFIER,
	@FirstName NVARCHAR(100) = NULL,
	@LastName NVARCHAR(100) = NULL,
	@Phone NVARCHAR(50) = NULL,
	@Birthday DATETIME2 = NULL,
	@AvatarUrl NVARCHAR(500) = NULL,
	@Password NVARCHAR(500) = NULL
AS
BEGIN
	UPDATE accounts
	SET first_name = COALESCE(@FirstName, first_name),
		last_name = COALESCE(@LastName, last_name),
		phone = COALESCE(@Phone, phone),
		birthday = COALESCE(@Birthday, birthday),
		avatar_url = COALESCE(@AvatarUrl, avatar_url),
		password = COALESCE(@Password, password)
	WHERE id = @AccountId;

	SELECT *
	FROM accounts
	WHERE id = @AccountId;
END;
GO

CREATE PROCEDURE usp_FetchCustomerOrdersByPageAndAccountId @AccountId UNIQUEIDENTIFIER,
	@PageSize INT,
	@PageNumber INT,
	@TotalRecords INT OUTPUT,
	@TotalPages INT OUTPUT,
	@NextPageNumber INT OUTPUT
AS
BEGIN
	-- Calculate the total number of records
	SELECT @TotalRecords = COUNT(*)
	FROM customer_orders
	WHERE account_id = @AccountId;

	-- Calculate the total number of pages
	SET @TotalPages = CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize);
	-- Calculate the next page number
	SET @NextPageNumber = CASE 
			WHEN @PageNumber < @TotalPages
				THEN @PageNumber + 1
			ELSE NULL
			END;

	-- Fetch the orders by page and account ID using OFFSET and FETCH NEXT
	SELECT *
	FROM customer_orders
	WHERE account_id = @AccountId
	ORDER BY created_at DESC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END;
GO


CREATE PROCEDURE usp_FetchCustomerOrderDetailById @CustomerOrderId UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM vw_CustomerOrdersWithItems
	WHERE id = @CustomerOrderId
END;
GO

CREATE PROCEDURE usp_CancelOrder @CustomerOrderId UNIQUEIDENTIFIER
AS
BEGIN
	SET XACT_ABORT ON;

	BEGIN TRANSACTION;

	-- 1. Set the status_id field of the customer_orders record to 'Cancelled' status
	UPDATE customer_orders
	SET status_id = 'AD8B7716-CB32-4D4B-98B2-3EA4367B9CD5'
	WHERE id = @CustomerOrderId;

	-- 2. Revert the remaining_quantity in product_orders based on export_history records
	DECLARE @product_order_id UNIQUEIDENTIFIER;
	DECLARE @customer_order_item_id UNIQUEIDENTIFIER;
	DECLARE @exported_quantity INT;

	DECLARE exportHistoryCursor CURSOR
	FOR
	SELECT product_order_id,
		customer_order_item_id,
		quantity
	FROM export_history
	WHERE customer_order_item_id IN (
			SELECT id
			FROM customer_order_items
			WHERE customer_order_id = @CustomerOrderId
			);

	OPEN exportHistoryCursor;

	FETCH NEXT
	FROM exportHistoryCursor
	INTO @product_order_id,
		@customer_order_item_id,
		@exported_quantity;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		-- Increase the remaining_quantity in product_orders
		UPDATE product_orders
		SET remaining_quantity = remaining_quantity + @exported_quantity
		WHERE id = @product_order_id;

		FETCH NEXT
		FROM exportHistoryCursor
		INTO @product_order_id,
			@customer_order_item_id,
			@exported_quantity;
	END

	CLOSE exportHistoryCursor;

	DEALLOCATE exportHistoryCursor;

	COMMIT TRANSACTION;
END;
GO

CREATE PROCEDURE usp_FetchAccountAddressesById @AccountId UNIQUEIDENTIFIER
AS
BEGIN
	SELECT *
	FROM account_addresses
	WHERE account_id = @AccountId
	ORDER BY created_at DESC
END;
GO

CREATE PROCEDURE usp_UpdateAccountAddress @Id UNIQUEIDENTIFIER,
	@AccountId UNIQUEIDENTIFIER,
	@ProvinceCode INT = NULL,
	@DistrictCode INT = NULL,
	@WardCode INT = NULL,
	@StreetAddress NVARCHAR(500) = NULL,
	@Title NVARCHAR(100) = NULL,
	@IsDefault BIT = NULL
AS
BEGIN
	UPDATE account_addresses
	SET province_code = COALESCE(@ProvinceCode, province_code),
		district_code = COALESCE(@DistrictCode, district_code),
		ward_code = COALESCE(@WardCode, ward_code),
		street_address = COALESCE(@StreetAddress, street_address),
		title = COALESCE(@Title, title),
		is_default = COALESCE(@IsDefault, is_default)
	WHERE id = @Id
		AND account_id = @AccountId;

	EXEC usp_FetchAccountAddressesById @AccountId;
END;
GO

CREATE PROCEDURE usp_CreateAccountAddress @AccountId UNIQUEIDENTIFIER,
	@ProvinceCode INT,
	@DistrictCode INT,
	@WardCode INT,
	@StreetAddress NVARCHAR(500),
	@Title NVARCHAR(100),
	@IsDefault BIT
AS
BEGIN
	INSERT INTO account_addresses (
		account_id,
		province_code,
		district_code,
		ward_code,
		street_address,
		title,
		is_default
		)
	VALUES (
		@AccountId,
		@ProvinceCode,
		@DistrictCode,
		@WardCode,
		@StreetAddress,
		@Title,
		@IsDefault
		);

	EXEC usp_FetchAccountAddressesById @AccountId;
END;
GO

CREATE PROCEDURE usp_DeleteAccountAddress @Id UNIQUEIDENTIFIER,
	@AccountId UNIQUEIDENTIFIER
AS
BEGIN
	DELETE
	FROM account_addresses
	WHERE id = @Id
		AND account_id = @AccountId;

	EXEC usp_FetchAccountAddressesById @AccountId;
END;
GO

CREATE PROCEDURE usp_UpdateDefaultAccountAddress @AccountId UNIQUEIDENTIFIER,
	@Id UNIQUEIDENTIFIER
AS
BEGIN
	UPDATE account_addresses
	SET is_default = 0
	WHERE account_id = @AccountId;

	UPDATE account_addresses
	SET is_default = 1
	WHERE account_id = @AccountId
		AND id = @Id;

	EXEC usp_FetchAccountAddressesById @AccountId;
END;
GO

CREATE PROCEDURE usp_CreateVerificationToken @AccountEmail NVARCHAR(255),
	@Token NVARCHAR(100)
AS
BEGIN
	DECLARE @AccountId UNIQUEIDENTIFIER;

	-- Find the associated account based on @AccountEmail
	SELECT @AccountId = id
	FROM accounts
	WHERE email = @AccountEmail;

	-- Check if an account was found
	IF @AccountId IS NULL
	BEGIN
		RAISERROR (
				'No account found with the provided email address.',
				16,
				1
				);

		RETURN;
	END

	-- Insert a row into verification_token with an expiration_date 1 hour after created_at
	INSERT INTO verification_tokens (
		account_id,
		token,
		expiration_date
		)
	VALUES (
		@AccountId,
		@Token,
		DATEADD(HOUR, 1, GETDATE())
		);
END;
GO

CREATE PROCEDURE usp_FetchAccountByVerificationToken @Token NVARCHAR(100)
AS
BEGIN
	-- Check if the token exists and is not expired
	IF EXISTS (
			SELECT 1
			FROM verification_tokens
			WHERE token = @Token
				AND expiration_date > GETDATE()
				AND used = 0
			)
	BEGIN
		-- Check if the token is the latest
		IF EXISTS (
				SELECT 1
				FROM verification_tokens VT1
				WHERE VT1.token = @Token
					AND NOT EXISTS (
						SELECT 1
						FROM verification_tokens VT2
						WHERE VT2.account_id = VT1.account_id
							AND VT2.created_at > VT1.created_at
						)
				)
		BEGIN
			-- Return the account information
			SELECT A.*
			FROM accounts A
			INNER JOIN verification_tokens VT ON A.id = VT.account_id
			WHERE VT.token = @Token;
		END
	END;
END;
GO

CREATE PROCEDURE usp_VerifyAccount @Token NVARCHAR(100),
	@FoundAccount BIT OUTPUT
AS
BEGIN
	DECLARE @AccountId UNIQUEIDENTIFIER;

	-- Create a temporary table to store the account information
	CREATE TABLE #AccountInfo (
		id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		role_id UNIQUEIDENTIFIER NOT NULL,
		first_name NVARCHAR(100) NOT NULL,
		last_name NVARCHAR(100) NOT NULL,
		avatar_url NVARCHAR(500),
		phone NVARCHAR(50) UNIQUE NOT NULL,
		email NVARCHAR(100) UNIQUE NOT NULL,
		verified BIT NOT NULL DEFAULT 0,
		password NVARCHAR(500) NOT NULL,
		birthday DATETIME2 NOT NULL,
		created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
		);

	-- Fetch the associated account using the @Token
	INSERT INTO #AccountInfo
	EXEC usp_FetchAccountByVerificationToken @Token;

	-- Check if an account was found
	IF EXISTS (
			SELECT *
			FROM #AccountInfo
			)
	BEGIN
		-- Get the account ID from the temporary table
		SELECT @AccountId = id
		FROM #AccountInfo;

		-- Update the account's verified status
		UPDATE accounts
		SET verified = 1
		WHERE id = @AccountId;

		-- Update the token's used status
		UPDATE verification_tokens
		SET used = 1
		WHERE token = @Token;

		SET @FoundAccount = 1;
	END
	ELSE
		SET @FoundAccount = 0;

	-- Drop the temporary table
	DROP TABLE #AccountInfo;
END;
GO

CREATE PROCEDURE usp_FetchAccountByEmail @Email NVARCHAR(100)
AS
BEGIN
	SELECT *
	FROM accounts
	WHERE email = @Email
END;
GO

CREATE PROCEDURE usp_CreateForgotPasswordToken @AccountEmail NVARCHAR(255),
	@Token NVARCHAR(100)
AS
BEGIN
	DECLARE @AccountId UNIQUEIDENTIFIER;

	-- Find the associated account based on @AccountEmail
	SELECT @AccountId = id
	FROM accounts
	WHERE email = @AccountEmail;

	-- Check if an account was found
	IF @AccountId IS NULL
	BEGIN
		RAISERROR (
				'No account found with the provided email address.',
				16,
				1
				);

		RETURN;
	END

	-- Insert a row into forgot_password_tokens with an expiration_date 1 hour after created_at
	INSERT INTO forgot_password_tokens (
		account_id,
		token,
		expiration_date
		)
	VALUES (
		@AccountId,
		@Token,
		DATEADD(HOUR, 1, GETDATE())
		);
END;
GO

CREATE PROCEDURE usp_FetchAccountByForgotPasswordToken @Token NVARCHAR(100)
AS
BEGIN
	DECLARE @AccountId UNIQUEIDENTIFIER;

	-- Find the associated account based on @Token
	SELECT @AccountId = account_id
	FROM forgot_password_tokens
	WHERE token = @Token
		AND used = 0
		AND expiration_date > GETDATE();

	-- Check if the token is the latest for the associated account
	IF EXISTS (
			SELECT 1
			FROM forgot_password_tokens
			WHERE account_id = @AccountId
				AND expiration_date > GETDATE()
				AND used = 0
				AND created_at > (
					SELECT created_at
					FROM forgot_password_tokens
					WHERE token = @Token
					)
			)
	BEGIN
		SET @AccountId = NULL;
	END

	-- Return the account information if a valid token was found
	IF @AccountId IS NOT NULL
	BEGIN
		SELECT *
		FROM accounts
		WHERE id = @AccountId;
	END
END;
GO

CREATE PROCEDURE usp_ResetPassword @Token NVARCHAR(100),
	@NewPassword NVARCHAR(255)
AS
BEGIN
	DECLARE @AccountId UNIQUEIDENTIFIER;

	-- Create a temporary table to store the account information
	CREATE TABLE #AccountInfo (
		id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
		role_id UNIQUEIDENTIFIER NOT NULL,
		first_name NVARCHAR(100) NOT NULL,
		last_name NVARCHAR(100) NOT NULL,
		avatar_url NVARCHAR(500),
		phone NVARCHAR(50) UNIQUE NOT NULL,
		email NVARCHAR(100) UNIQUE NOT NULL,
		verified BIT NOT NULL DEFAULT 0,
		password NVARCHAR(500) NOT NULL,
		birthday DATETIME2 NOT NULL,
		created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
		);

	-- Fetch the associated account using the @Token
	INSERT INTO #AccountInfo
	EXEC usp_FetchAccountByForgotPasswordToken @Token;

	-- Check if an account was found
	IF NOT EXISTS (
			SELECT *
			FROM #AccountInfo
			)
	BEGIN
		RAISERROR (
				'Invalid or expired token provided.',
				16,
				1
				);

		RETURN;
	END

	-- Get the account ID from the temporary table
	SELECT @AccountId = id
	FROM #AccountInfo;

	-- Update the password for the account and set the token as used
	BEGIN TRANSACTION;

	UPDATE accounts
	SET password = @NewPassword
	WHERE id = @AccountId;

	UPDATE forgot_password_tokens
	SET used = 1
	WHERE token = @Token;

	COMMIT TRANSACTION;

	-- Drop the temporary table
	DROP TABLE #AccountInfo;
END;
GO

CREATE PROCEDURE usp_FetchAccountsWithTotalOrdersByPage
	@PageSize INT,
	@PageNumber INT,
	@TotalRecords INT OUTPUT,
	@TotalPages INT OUTPUT,
	@NextPageNumber INT OUTPUT
AS
BEGIN

	SELECT @TotalRecords = COUNT(*)
	FROM vw_AccountsWithTotalOrdersAndFullName

	SET @TotalPages = CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize);

	SET @NextPageNumber = CASE 
			WHEN @PageNumber < @TotalPages
				THEN @PageNumber + 1
			ELSE NULL
			END;

	-- Modified query to use vw_AccountsWithTotalOrders view
	SELECT *
	FROM vw_AccountsWithTotalOrdersAndFullName
	ORDER BY created_at DESC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE PROCEDURE usp_FetchAccountsWithTotalOrdersByFullNameKeyword
	@Keyword NVARCHAR(200),
	@Limit INT
AS
BEGIN
	-- Use the vw_AccountsWithTotalOrdersAndFullName view to fetch accounts with full_name partially matching the @Keyword, case insensitive
	SELECT Top (@Limit) *
	FROM vw_AccountsWithTotalOrdersAndFullName
	WHERE full_name LIKE N'%' + @Keyword + N'%'
	ORDER BY created_at DESC 
END;
GO

