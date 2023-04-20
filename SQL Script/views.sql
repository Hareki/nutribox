USE nutribox
GO

CREATE VIEW vw_UpeProductsWithImages
AS
SELECT p.id,
	p.name,
	p.category_id,
	p.import_price,
	p.retail_price,
	p.available,
	p.description,
	p.created_at,
	ISNULL(pijson.image_urls, '[]') AS image_urls,
	ISNULL(pojson.product_orders, '[]') AS product_orders
FROM products p
LEFT JOIN (
	SELECT p.id,
		(
			SELECT po.*
			FROM product_orders po
			WHERE po.product_id = p.id
				AND po.expiration_date > GETDATE()
			FOR JSON PATH
			) AS product_orders
	FROM products p
	) AS pojson ON p.id = pojson.id
LEFT JOIN (
	SELECT p.id,
		(
			SELECT pi.image_url
			FROM product_images pi
			WHERE pi.product_id = p.id
			FOR JSON PATH
			) AS image_urls
	FROM products p
	) AS pijson ON p.id = pijson.id;
GO

--CREATE VIEW vw_AccountsWithPopulatedCartItems
--AS
--SELECT a.*,
--       (
--           SELECT ci.id,
--                  ci.account_id,
--                  ci.quantity,
--                  ci.created_at,
--                  (
--                      SELECT up.*
--                      FROM vw_UpeProductsWithImages up
--                      WHERE ci.product_id = up.id
--                      FOR JSON PATH,
--                          WITHOUT_ARRAY_WRAPPER
--                  ) AS product_id
--           FROM cart_items ci
--           WHERE ci.account_id = a.id
--           FOR JSON PATH
--       ) AS cart_items
--FROM accounts a;
CREATE VIEW vw_StoresWithStoreHours
AS
SELECT stores.id,
	stores.phone,
	stores.email,
	stores.province_code,
	stores.district_code,
	stores.ward_code,
	stores.street_address,
	stores.created_at,
	(
		SELECT sh.id,
			sh.day_of_week,
			sh.open_time,
			sh.close_time,
			sh.created_at
		FROM store_hours sh
		WHERE sh.store_id = stores.id
		FOR JSON PATH
		) AS store_hours
FROM stores;
GO

CREATE VIEW vw_CustomerOrdersWithItems
AS
SELECT co.*,
	(
		SELECT coi.product_id,
			coi.quantity,
			coi.unit_import_price,
			coi.unit_retail_price,
			coi.created_at
		FROM customer_order_items coi
		WHERE coi.customer_order_id = co.id
		FOR JSON PATH
		) AS items
FROM customer_orders co;
GO

CREATE VIEW vw_AccountsWithTotalOrdersAndFullName AS
	SELECT a.*,
	       COALESCE(COUNT(co.account_id), 0) AS total_orders,
	       a.last_name + ' ' + a.first_name AS full_name
	FROM accounts AS a
	LEFT JOIN customer_orders AS co
	ON a.id = co.account_id
	GROUP BY a.id, a.role_id, a.first_name, a.last_name, a.avatar_url, a.phone, a.email, a.verified, a.password, a.birthday, a.created_at;
