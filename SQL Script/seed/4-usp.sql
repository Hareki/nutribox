USE nutribox
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchWithProductOrdersByPage
    @PageSize INT,
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
        SET @NextPageNumber = -1;

    SELECT *
    FROM vw_ProductsWithUnexpiredOrdersAndImages p
    WHERE p.available = 1
    ORDER BY p.created_at DESC OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE usp_Product_FetchWithProductOrdersById @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM vw_ProductsWithUnexpiredOrdersAndImages p
    WHERE p.id = @Id
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchHotWithProductOrders @Limit INT
AS
BEGIN
    WITH ProductSales
    AS (SELECT up.*,
               COALESCE(SUM(coi.quantity), 0) AS TotalQuantitySold
        FROM vw_ProductsWithUnexpiredOrdersAndImages up
            LEFT JOIN customer_order_items coi
                ON up.id = coi.product_id
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
    SELECT TOP (@Limit)
        ps.*
    FROM ProductSales ps
    WHERE ps.available = 1
    ORDER BY ps.TotalQuantitySold DESC,
             ps.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchNewWithProductOrders @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        up.*
    FROM vw_ProductsWithUnexpiredOrdersAndImages up
    WHERE up.available = 1
    ORDER BY up.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchRelatedWithProductOrders
    @Limit INT,
    @CategoryId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT TOP (@Limit)
        up.*
    FROM vw_ProductsWithUnexpiredOrdersAndImages up
    WHERE up.category_id = @CategoryId
          AND up.available = 1
          AND up.id <> @ProductId
    ORDER BY up.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchWithProductOrdersByNameKeyword
    @Limit INT,
    @Keyword NVARCHAR(255)
AS
BEGIN
    SELECT TOP (@Limit)
        up.*
    FROM vw_ProductsWithUnexpiredOrdersAndImages up
    WHERE up.name COLLATE Latin1_General_100_CI_AI_SC_UTF8 LIKE N'%' + @Keyword + N'%'
          AND up.available = 1
    ORDER BY up.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchAllNames
AS
BEGIN
    SELECT name
    FROM products p
    ORDER BY p.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_ProductCategories_FetchAll
AS
BEGIN
    SELECT *
    FROM product_categories pc
    ORDER BY pc.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Products_FetchWithProductOrdersByCategoryId
    @CategoryId UNIQUEIDENTIFIER,
    @CategoryName NVARCHAR(100) OUTPUT
AS
BEGIN
    -- Get the category name
    SELECT @CategoryName = name
    FROM product_categories
    WHERE id = @CategoryId;

    -- Fetch products from vw_ProductsWithUnexpiredOrdersAndImages
    SELECT up.*
    FROM vw_ProductsWithUnexpiredOrdersAndImages up
    WHERE up.category_id = @CategoryId
          AND up.available = 1
    ORDER BY up.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_CartItems_FetchPopulatedByAccountId @AccountId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT ci.id,
           ci.account_id,
           ci.quantity,
           ci.created_at,
           (
               SELECT up.*
               FROM vw_ProductsWithUnexpiredOrdersAndImages up
               WHERE ci.product_id = up.id
               FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
           ) AS product
    FROM cart_items ci
    WHERE ci.account_id = @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_CartItem_CreateUpdateDeleteOne
    @AccountId UNIQUEIDENTIFIER,
    @ProductId UNIQUEIDENTIFIER,
    @Quantity INT
AS
BEGIN
    -- Check if the cart item exists
    IF EXISTS
    (
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
            DELETE FROM cart_items
            WHERE account_id = @AccountId
                  AND product_id = @ProductId;
        END
    END
    -- Insert a new cart item if it doesn't exist and the quantity is greater than 0
    ELSE IF @Quantity > 0
    BEGIN
        INSERT INTO cart_items
        (
            product_id,
            account_id,
            quantity
        )
        VALUES
        (@ProductId, @AccountId, @Quantity);
    END
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_CreateOne
    @RoleId UNIQUEIDENTIFIER,
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
    INSERT INTO accounts
    (
        id,
        role_id,
        first_name,
        last_name,
        phone,
        email,
        birthday,
        password
    )
    VALUES
    (@NewAccountId, @RoleId, @FirstName, @LastName, @Phone, @Email, @Birthday, @Password);

    -- Select the inserted account
    SELECT *
    FROM accounts
    WHERE id = @NewAccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Store_FetchWithStoreHoursById @StoreId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM vw_StoresWithStoreHours
    WHERE id = @StoreId;
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrder_FetchById @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM customer_orders
    WHERE id = @Id;
END;
GO

CREATE OR ALTER PROCEDURE usp_Checkout
    @account_id UNIQUEIDENTIFIER,
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
    DECLARE @cartItems TABLE
    (
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
        JOIN products p
            ON p.id = ci.product_id

    -- 3. Insert the customer_orders record
    DECLARE @customer_order_id UNIQUEIDENTIFIER = NEWID();

    SET @customer_order_id_output = @customer_order_id

    INSERT INTO customer_orders
    (
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
    VALUES
    (   @customer_order_id,
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

    DECLARE cartItemsCursor CURSOR FOR
    SELECT id,
           product_id,
           quantity
    FROM @cartItems;

    DECLARE @cart_item_id UNIQUEIDENTIFIER,
            @product_id UNIQUEIDENTIFIER,
            @quantity INT;

    OPEN cartItemsCursor;

    FETCH NEXT FROM cartItemsCursor
    INTO @cart_item_id,
         @product_id,
         @quantity;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @customer_order_item_id = NEWID();

        INSERT INTO customer_order_items
        (
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

        DECLARE productOrdersCursor CURSOR FOR
        SELECT id,
               remaining_quantity
        FROM product_orders
        WHERE product_id = @product_id
              AND remaining_quantity > 0
              AND expiration_date > GETDATE()
        ORDER BY expiration_date;

        OPEN productOrdersCursor;

        FETCH NEXT FROM productOrdersCursor
        INTO @product_order_id,
             @quantity;

        WHILE @@FETCH_STATUS = 0 AND @exported_quantity > 0
        BEGIN
            IF @quantity <= @exported_quantity
            BEGIN
                -- Decrease the remaining quantity
                UPDATE product_orders
                SET remaining_quantity = 0
                WHERE id = @product_order_id;

                -- 6. Insert export_history records
                INSERT INTO export_history
                (
                    id,
                    product_order_id,
                    customer_order_item_id,
                    quantity
                )
                VALUES
                (NEWID(), @product_order_id, @customer_order_item_id, @quantity);

                SET @exported_quantity = @exported_quantity - @quantity;
            END
            ELSE
            BEGIN
                -- Decrease the remaining quantity
                UPDATE product_orders
                SET remaining_quantity = remaining_quantity - @exported_quantity
                WHERE id = @product_order_id;

                -- 6. Insert export_history records
                INSERT INTO export_history
                (
                    id,
                    product_order_id,
                    customer_order_item_id,
                    quantity
                )
                VALUES
                (NEWID(), @product_order_id, @customer_order_item_id, @exported_quantity);

                SET @exported_quantity = 0;
            END

            FETCH NEXT FROM productOrdersCursor
            INTO @product_order_id,
                 @quantity;
        END

        CLOSE productOrdersCursor;

        DEALLOCATE productOrdersCursor;

        FETCH NEXT FROM cartItemsCursor
        INTO @cart_item_id,
             @product_id,
             @quantity;
    END

    CLOSE cartItemsCursor;

    DEALLOCATE cartItemsCursor;

    -- 7. Remove the selected cart_items records
    DELETE FROM cart_items
    WHERE id IN (
                    SELECT id FROM @cartItems
                );

    COMMIT TRANSACTION;
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchOrderStatusCountByAccountId
    @AccountId UNIQUEIDENTIFIER,
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

CREATE OR ALTER PROCEDURE usp_Statistics_FetchAddressCountByAccountId
    @AccountId UNIQUEIDENTIFIER,
    @Count INT OUTPUT
AS
BEGIN
    SELECT @Count = COUNT(*)
    FROM account_addresses
    WHERE account_id = @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_FetchPasswordById
    @AccountId UNIQUEIDENTIFIER,
    @Password NVARCHAR(500) OUTPUT
AS
BEGIN
    SELECT @Password = COALESCE(password, '')
    FROM accounts
    WHERE id = @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_FetchAccountById @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM accounts
    WHERE id = @Id;
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_UpdateOne
    @AccountId UNIQUEIDENTIFIER,
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

CREATE OR ALTER PROCEDURE usp_CustomerOrders_FetchByPageAndAccountId
    @AccountId UNIQUEIDENTIFIER,
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
                              WHEN @PageNumber < @TotalPages THEN
                                  @PageNumber + 1
                              ELSE
                                  NULL
                          END;

    -- Fetch the orders by page and account ID using OFFSET and FETCH NEXT
    SELECT *
    FROM customer_orders
    WHERE account_id = @AccountId
    ORDER BY created_at DESC OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrder_FetchWithItemsById @CustomerOrderId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM vw_CustomerOrdersWithItems
    WHERE id = @CustomerOrderId
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrder_CancelOne @CustomerOrderId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @CancelledId UNIQUEIDENTIFIER = 'AD8B7716-CB32-4D4B-98B2-3EA4367B9CD5';
    DECLARE @PendingId UNIQUEIDENTIFIER = '57379784-B3F7-4717-9155-25ED93EEF78D';
    DECLARE @CurrentStatusId UNIQUEIDENTIFIER;

    SET XACT_ABORT ON;

    -- Get the current status_id of the customer order
    SELECT @CurrentStatusId = status_id
    FROM customer_orders
    WHERE id = @CustomerOrderId;

    -- If the current status_id is not 'Pending', raise an error and exit
    IF @CurrentStatusId <> @PendingId
    BEGIN
        RAISERROR('Cannot cancel the order. The order is not in Pending status.', 16, 1);

        RETURN;
    END

    BEGIN TRANSACTION;

    -- 1. Set the status_id field of the customer_orders record to 'Cancelled' status
    UPDATE customer_orders
    SET status_id = @CancelledId
    WHERE id = @CustomerOrderId;

    -- 2. Revert the remaining_quantity in product_orders based on export_history records
    DECLARE @product_order_id UNIQUEIDENTIFIER;
    DECLARE @customer_order_item_id UNIQUEIDENTIFIER;
    DECLARE @exported_quantity INT;

    DECLARE exportHistoryCursor CURSOR FOR
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

    FETCH NEXT FROM exportHistoryCursor
    INTO @product_order_id,
         @customer_order_item_id,
         @exported_quantity;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Increase the remaining_quantity in product_orders
        UPDATE product_orders
        SET remaining_quantity = remaining_quantity + @exported_quantity
        WHERE id = @product_order_id;

        FETCH NEXT FROM exportHistoryCursor
        INTO @product_order_id,
             @customer_order_item_id,
             @exported_quantity;
    END

    CLOSE exportHistoryCursor;

    DEALLOCATE exportHistoryCursor;

    COMMIT TRANSACTION;

    SELECT *
    FROM vw_CustomerOrdersWithItems
    WHERE id = @CustomerOrderId
END;
GO

CREATE OR ALTER PROCEDURE usp_Accounts_FetchAddressesById @AccountId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM account_addresses
    WHERE account_id = @AccountId
    ORDER BY created_at DESC
END;
GO

CREATE OR ALTER PROCEDURE usp_AccountAddress_UpdateOne
    @Id UNIQUEIDENTIFIER,
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

    EXEC usp_Accounts_FetchAddressesById @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_AccountAddress_CreateOne
    @AccountId UNIQUEIDENTIFIER,
    @ProvinceCode INT,
    @DistrictCode INT,
    @WardCode INT,
    @StreetAddress NVARCHAR(500),
    @Title NVARCHAR(100),
    @IsDefault BIT
AS
BEGIN
    INSERT INTO account_addresses
    (
        account_id,
        province_code,
        district_code,
        ward_code,
        street_address,
        title,
        is_default
    )
    VALUES
    (@AccountId, @ProvinceCode, @DistrictCode, @WardCode, @StreetAddress, @Title, @IsDefault);

    EXEC usp_Accounts_FetchAddressesById @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_AccountAddress_DeleteOne
    @Id UNIQUEIDENTIFIER,
    @AccountId UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM account_addresses
    WHERE id = @Id
          AND account_id = @AccountId;

    EXEC usp_Accounts_FetchAddressesById @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_AccountAddresses_UpdateDefault
    @AccountId UNIQUEIDENTIFIER,
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

    EXEC usp_Accounts_FetchAddressesById @AccountId;
END;
GO

CREATE OR ALTER PROCEDURE usp_VerificationToken_CreateOne
    @AccountEmail NVARCHAR(255),
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
        RAISERROR('No account found with the provided email address.', 16, 1);

        RETURN;
    END

    -- Insert a row into verification_token with an expiration_date 1 hour after created_at
    INSERT INTO verification_tokens
    (
        account_id,
        token,
        expiration_date
    )
    VALUES
    (@AccountId, @Token, DATEADD(HOUR, 1, GETDATE()));
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_FetchByVerificationToken @Token NVARCHAR(100)
AS
BEGIN
    -- Check if the token exists and is not expired
    IF EXISTS
    (
        SELECT 1
        FROM verification_tokens
        WHERE token = @Token
              AND expiration_date > GETDATE()
              AND used = 0
    )
    BEGIN
        -- Check if the token is the latest
        IF EXISTS
        (
            SELECT 1
            FROM verification_tokens VT1
            WHERE VT1.token = @Token
                  AND NOT EXISTS
            (
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
                INNER JOIN verification_tokens VT
                    ON A.id = VT.account_id
            WHERE VT.token = @Token;
        END
    END;
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_VerifyOne
    @Token NVARCHAR(100),
    @FoundAccount BIT OUTPUT
AS
BEGIN
    DECLARE @AccountId UNIQUEIDENTIFIER;

    -- Create a temporary table to store the account information
    CREATE TABLE #AccountInfo
    (
        id UNIQUEIDENTIFIER PRIMARY KEY
            DEFAULT NEWID(),
        role_id UNIQUEIDENTIFIER NOT NULL,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        avatar_url NVARCHAR(500),
        phone NVARCHAR(50)
            UNIQUE NOT NULL,
        email NVARCHAR(100)
            UNIQUE NOT NULL,
        verified BIT NOT NULL
            DEFAULT 0,
        password NVARCHAR(500) NOT NULL,
        birthday DATETIME2 NOT NULL,
        created_at DATETIME2 NOT NULL
            DEFAULT GETDATE(),
    );

    -- Fetch the associated account using the @Token
    INSERT INTO #AccountInfo
    EXEC usp_Account_FetchByVerificationToken @Token;

    -- Check if an account was found
    IF EXISTS (SELECT * FROM #AccountInfo)
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

CREATE OR ALTER PROCEDURE usp_Account_FetchByEmail @Email NVARCHAR(100)
AS
BEGIN
    SELECT *
    FROM accounts
    WHERE email = @Email
END;
GO

CREATE OR ALTER PROCEDURE usp_ForgotPasswordToken_CreateOne
    @AccountEmail NVARCHAR(255),
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
        RAISERROR('No account found with the provided email address.', 16, 1);

        RETURN;
    END

    -- Insert a row into forgot_password_tokens with an expiration_date 1 hour after created_at
    INSERT INTO forgot_password_tokens
    (
        account_id,
        token,
        expiration_date
    )
    VALUES
    (@AccountId, @Token, DATEADD(HOUR, 1, GETDATE()));
END;
GO

CREATE OR ALTER PROCEDURE usp_Account_FetchByForgotPasswordToken @Token NVARCHAR(100)
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
    IF EXISTS
    (
        SELECT 1
        FROM forgot_password_tokens
        WHERE account_id = @AccountId
              AND expiration_date > GETDATE()
              AND used = 0
              AND created_at >
              (
                  SELECT created_at FROM forgot_password_tokens WHERE token = @Token
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

CREATE OR ALTER PROCEDURE usp_Account_ResetPassword
    @Token NVARCHAR(100),
    @NewPassword NVARCHAR(255)
AS
BEGIN
    DECLARE @AccountId UNIQUEIDENTIFIER;

    -- Create a temporary table to store the account information
    CREATE TABLE #AccountInfo
    (
        id UNIQUEIDENTIFIER PRIMARY KEY
            DEFAULT NEWID(),
        role_id UNIQUEIDENTIFIER NOT NULL,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        avatar_url NVARCHAR(500),
        phone NVARCHAR(50)
            UNIQUE NOT NULL,
        email NVARCHAR(100)
            UNIQUE NOT NULL,
        verified BIT NOT NULL
            DEFAULT 0,
        password NVARCHAR(500) NOT NULL,
        birthday DATETIME2 NOT NULL,
        created_at DATETIME2 NOT NULL
            DEFAULT GETDATE(),
    );

    -- Fetch the associated account using the @Token
    INSERT INTO #AccountInfo
    EXEC usp_Account_FetchByForgotPasswordToken @Token;

    -- Check if an account was found
    IF NOT EXISTS (SELECT * FROM #AccountInfo)
    BEGIN
        RAISERROR('Invalid or expired token provided.', 16, 1);

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

CREATE OR ALTER PROCEDURE usp_Accounts_FetchWithTotalOrdersByFullNameKeyword
    @Keyword NVARCHAR(200),
    @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        *
    FROM vw_AccountsWithTotalOrdersAndFullName
    WHERE full_name LIKE N'%' + @Keyword + N'%'
    ORDER BY created_at DESC
END;
GO

CREATE OR ALTER PROCEDURE usp_Accounts_FetchWithTotalOrdersByPage
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
                              WHEN @PageNumber < @TotalPages THEN
                                  @PageNumber + 1
                              ELSE
                                  NULL
                          END;

    SELECT *
    FROM vw_AccountsWithTotalOrdersAndFullName
    ORDER BY created_at DESC OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrders_FetchByPage
    @PageSize INT,
    @PageNumber INT,
    @TotalRecords INT OUTPUT,
    @TotalPages INT OUTPUT,
    @NextPageNumber INT OUTPUT
AS
BEGIN
    SELECT @TotalRecords = COUNT(*)
    FROM customer_orders

    SET @TotalPages = CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize);
    SET @NextPageNumber = CASE
                              WHEN @PageNumber < @TotalPages THEN
                                  @PageNumber + 1
                              ELSE
                                  NULL
                          END;

    SELECT *
    FROM customer_orders
    ORDER BY created_at DESC OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrders_FetchByIdKeyword
    @Keyword NVARCHAR(200),
    @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        *
    FROM customer_orders
    WHERE id LIKE N'%' + @Keyword + N'%'
    ORDER BY created_at DESC
END;
GO

CREATE OR ALTER PROCEDURE usp_CustomerOrder_UpdateStatus @CustomerOrderId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @PendingId UNIQUEIDENTIFIER = '57379784-B3F7-4717-9155-25ED93EEF78D';
    DECLARE @ProcessingId UNIQUEIDENTIFIER = 'F2E5678D-19E0-4BE0-BB0D-FDC20E0989D4';
    DECLARE @DeliveringId UNIQUEIDENTIFIER = '741AB523-D545-4C8A-97C8-0231802CF0F3';
    DECLARE @DeliveredId UNIQUEIDENTIFIER = '83B6EFB9-2A3E-464A-B31A-866F3A0D9274';
    DECLARE @CancelledId UNIQUEIDENTIFIER = 'AD8B7716-CB32-4D4B-98B2-3EA4367B9CD5';
    DECLARE @CurrentStatusId UNIQUEIDENTIFIER;
    DECLARE @NextStatusId UNIQUEIDENTIFIER;

    -- Get the current status_id of the customer order
    SELECT @CurrentStatusId = status_id
    FROM customer_orders
    WHERE id = @CustomerOrderId;

    -- Determine the next status_id based on the current status_id
    SET @NextStatusId = (CASE
                             WHEN @CurrentStatusId = @PendingId THEN
                                 @ProcessingId
                             WHEN @CurrentStatusId = @ProcessingId THEN
                                 @DeliveringId
                             WHEN @CurrentStatusId = @DeliveringId THEN
                                 @DeliveredId
                             ELSE
                                 NULL
                         END
                        );

    -- If the next status_id is NULL or the current status_id is either 'Giao thành công' or 'Đã huỷ đơn', raise an error
    IF (@NextStatusId IS NULL)
       OR (@CurrentStatusId IN ( @DeliveredId, @CancelledId ))
    BEGIN
        RAISERROR('Cannot update the order status. The order is either completed or cancelled.', 16, 1);

        RETURN;
    END

    -- Update the customer order's status_id to the next status_id
    UPDATE customer_orders
    SET status_id = @NextStatusId
    WHERE id = @CustomerOrderId;

    SELECT *
    FROM customer_orders
    WHERE id = @CustomerOrderId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Supplier_FetchById @SupplierId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM suppliers
    WHERE id = @SupplierId
    ORDER BY created_at DESC
END;
GO

CREATE OR ALTER PROCEDURE usp_Supplier_UpdateOne
    @SupplierId UNIQUEIDENTIFIER,
    @Name NVARCHAR(100) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @Email NVARCHAR(100) = NULL,
    @ProvinceCode INT = NULL,
    @DistrictCode INT = NULL,
    @WardCode INT = NULL,
    @StreetAddress NVARCHAR(500) = NULL
AS
BEGIN
    UPDATE suppliers
    SET name = COALESCE(@Name, name),
        phone = COALESCE(@Phone, phone),
        email = COALESCE(@Email, email),
        province_code = COALESCE(@ProvinceCode, province_code),
        district_code = COALESCE(@DistrictCode, district_code),
        ward_code = COALESCE(@WardCode, ward_code),
        street_address = COALESCE(@StreetAddress, street_address)
    WHERE id = @SupplierId;

    SELECT *
    FROM suppliers
    WHERE id = @SupplierId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Suppliers_FetchByPage
    @PageSize INT,
    @PageNumber INT,
    @TotalRecords INT OUTPUT,
    @TotalPages INT OUTPUT,
    @NextPageNumber INT OUTPUT
AS
BEGIN
    SELECT @TotalRecords = COUNT(*)
    FROM suppliers

    SET @TotalPages = CEILING(CAST(@TotalRecords AS FLOAT) / @PageSize);
    SET @NextPageNumber = CASE
                              WHEN @PageNumber < @TotalPages THEN
                                  @PageNumber + 1
                              ELSE
                                  NULL
                          END;

    SELECT *
    FROM suppliers
    ORDER BY created_at DESC OFFSET (@PageNumber - 1) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE usp_Supplier_CreateOne
    @Name NVARCHAR(100) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @Email NVARCHAR(100) = NULL,
    @ProvinceCode INT = NULL,
    @DistrictCode INT = NULL,
    @WardCode INT = NULL,
    @StreetAddress NVARCHAR(500) = NULL
AS
BEGIN
    DECLARE @NewSupplierId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO suppliers
    (
        id,
        name,
        phone,
        email,
        province_code,
        district_code,
        ward_code,
        street_address
    )
    VALUES
    (@NewSupplierId, @Name, @Phone, @Email, @ProvinceCode, @DistrictCode, @WardCode, @StreetAddress);

    -- Select the inserted account
    SELECT *
    FROM suppliers
    WHERE id = @NewSupplierId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Suppliers_FetchByNameKeyword
    @Keyword NVARCHAR(200),
    @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        *
    FROM suppliers
    WHERE name LIKE N'%' + @Keyword + N'%'
    ORDER BY created_at DESC
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchProfitAndOrderNumber
AS
BEGIN
    DECLARE @DeliveredStatusId UNIQUEIDENTIFIER = '83B6EFB9-2A3E-464A-B31A-866F3A0D9274';

    WITH TodayStats
    AS (SELECT SUM(   CASE
                          WHEN co.status_id = @DeliveredStatusId THEN
                              co.profit
                          ELSE
                              0
                      END
                  ) AS today_profit,
               COUNT(*) AS today_order_number
        FROM customer_orders co
        WHERE CAST(co.created_at AS DATE) = CAST(GETDATE() AS DATE)
       ),
         PrevMonthStats
    AS (SELECT SUM(   CASE
                          WHEN co.status_id = @DeliveredStatusId THEN
                              co.profit
                          ELSE
                              0
                      END
                  ) AS prev_month_profit,
               COUNT(*) AS prev_month_order_number
        FROM customer_orders co
        WHERE YEAR(co.created_at) = YEAR(DATEADD(MONTH, -1, GETDATE()))
              AND MONTH(co.created_at) = MONTH(DATEADD(MONTH, -1, GETDATE()))
       ),
         ThisMonthStats
    AS (SELECT SUM(   CASE
                          WHEN co.status_id = @DeliveredStatusId THEN
                              co.profit
                          ELSE
                              0
                      END
                  ) AS this_month_profit,
               COUNT(*) AS this_month_order_number
        FROM customer_orders co
        WHERE YEAR(co.created_at) = YEAR(GETDATE())
              AND MONTH(co.created_at) = MONTH(GETDATE())
       )
    SELECT COALESCE(ts.today_profit, 0) AS today_profit,
           COALESCE(ts.today_order_number, 0) AS today_order_number,
           COALESCE(pms.prev_month_profit, 0) AS prev_month_profit,
           COALESCE(pms.prev_month_order_number, 0) AS prev_month_order_number,
           COALESCE(tms.this_month_profit, 0) AS this_month_profit,
           COALESCE(tms.this_month_order_number, 0) AS this_month_order_number
    FROM TodayStats ts
        CROSS JOIN PrevMonthStats pms
        CROSS JOIN ThisMonthStats tms;
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchMostSoldProducts
AS
BEGIN
    DECLARE @TotalSoldOfAllProducts INT = (
                                              SELECT SUM(total_sold) FROM vw_ProductsWithTotalSold
                                          );

    SELECT
        (
            SELECT *
            FROM products
            WHERE id = p.id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS product,
        total_sold,
        @TotalSoldOfAllProducts AS total_sold_of_all_products
    FROM vw_ProductsWithTotalSold p
    WHERE total_sold =
    (
        SELECT MAX(total_sold) FROM vw_ProductsWithTotalSold
    );
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchLeastSoldProducts
AS
BEGIN
    DECLARE @TotalSoldOfAllProducts INT = (
                                              SELECT SUM(total_sold) FROM vw_ProductsWithTotalSold
                                          );

    SELECT
        (
            SELECT *
            FROM products
            WHERE id = p.id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS product,
        total_sold,
        @TotalSoldOfAllProducts AS total_sold_of_all_products
    FROM vw_ProductsWithTotalSold p
    WHERE total_sold =
    (
        SELECT MIN(total_sold) FROM vw_ProductsWithTotalSold
    );
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchMonthlyProfits
AS
BEGIN
    WITH CurrentYearMonths
    AS (SELECT n.Number AS month
        FROM
        (
            VALUES
                (1),
                (2),
                (3),
                (4),
                (5),
                (6),
                (7),
                (8),
                (9),
                (10),
                (11),
                (12)
        ) n (Number)
       ),
         MonthlyProfits
    AS (SELECT MONTH(co.created_at) AS month,
               SUM(co.profit) AS profit
        FROM customer_orders co
        WHERE co.status_id = '83B6EFB9-2A3E-464A-B31A-866F3A0D9274'
              AND YEAR(co.created_at) = YEAR(GETDATE())
        GROUP BY MONTH(co.created_at)
       )
    SELECT cym.month,
           COALESCE(mp.profit, 0) AS profit
    FROM CurrentYearMonths cym
        LEFT JOIN MonthlyProfits mp
            ON cym.month = mp.month
    ORDER BY cym.month;
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchMostRecentOrders @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        *
    FROM customer_orders
    ORDER BY created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Statistics_FetchLeastInStockProducts @Limit INT
AS
BEGIN
    SELECT TOP (@Limit)
        *
    FROM vw_ProductsWithUnexpiredRemainingInStock
    ORDER BY total_unexpired_remaining_stock ASC;
END;
GO

CREATE OR ALTER PROCEDURE usp_Store_UpdateContactInfo
    @StoreId UNIQUEIDENTIFIER,
    @Phone NVARCHAR(100) = NULL,
    @Email NVARCHAR(100) = NULL,
    @ProvinceCode INT = NULL,
    @DistrictCode INT = NULL,
    @WardCode INT = NULL,
    @StreetAddress NVARCHAR(500) = NULL
AS
BEGIN
    UPDATE stores
    SET phone = COALESCE(@Phone, phone),
        email = COALESCE(@Email, phone),
        province_code = COALESCE(@ProvinceCode, phone),
        district_code = COALESCE(@DistrictCode, phone),
        ward_code = COALESCE(@WardCode, phone),
        street_address = COALESCE(@StreetAddress, phone)
    WHERE id = @StoreId;

    SELECT *
    FROM stores
    WHERE id = @StoreId;
END;
GO

CREATE OR ALTER PROCEDURE usp_Store_UpdateStoreHours @StoreHoursRecords StoreHoursRecordsType READONLY
AS
BEGIN
    UPDATE sh
    SET sh.open_time = r.open_time,
        sh.close_time = r.close_time
    FROM store_hours sh
        INNER JOIN @StoreHoursRecords r
            ON sh.id = r.id;
END;

--- new ----

