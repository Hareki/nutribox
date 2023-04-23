USE nutribox
GO

CREATE VIEW vw_ProductsWithUnexpiredOrdersAndImages
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
    LEFT JOIN
    (
        SELECT p.id,
               (
                   SELECT po.*
                   FROM product_orders po
                   WHERE po.product_id = p.id
                         AND po.expiration_date > GETDATE()
				   ORDER BY created_at DESC
                   FOR JSON PATH
               ) AS product_orders
        FROM products p
    ) AS pojson
        ON p.id = pojson.id
    LEFT JOIN
    (
        SELECT p.id,
               (
                   SELECT pi.image_url
                   FROM product_images pi
                   WHERE pi.product_id = p.id
				   ORDER BY created_at DESC
                   FOR JSON PATH
               ) AS image_urls
        FROM products p
    ) AS pijson
        ON p.id = pijson.id;
GO

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

CREATE VIEW vw_AccountsWithTotalOrdersAndFullName
AS
SELECT a.*,
       COALESCE(COUNT(co.account_id), 0) AS total_orders,
       a.last_name + ' ' + a.first_name AS full_name
FROM accounts AS a
    LEFT JOIN customer_orders AS co
        ON a.id = co.account_id
GROUP BY a.id,
         a.role_id,
         a.first_name,
         a.last_name,
         a.avatar_url,
         a.phone,
         a.email,
         a.verified,
         a.password,
         a.birthday,
         a.created_at;
GO

CREATE VIEW vw_ProductsWithTotalSold
AS
SELECT p.*,
       SUM(coi.quantity) AS total_sold
FROM customer_order_items coi
    JOIN customer_orders co
        ON coi.customer_order_id = co.id
    JOIN products p
        ON coi.product_id = p.id
WHERE co.status_id = '83B6EFB9-2A3E-464A-B31A-866F3A0D9274'
GROUP BY p.id,
         p.category_id,
         p.default_supplier_id,
         p.name,
         p.available,
         p.import_price,
         p.retail_price,
         p.shelf_life,
         p.description,
         p.created_at;
GO

CREATE VIEW vw_ProductsWithUnexpiredRemainingInStock
AS
SELECT p.*,
       SUM(   CASE
                  WHEN po.expiration_date > GETDATE() THEN
                      po.remaining_quantity
                  ELSE
                      0
              END
          ) AS total_unexpired_remaining_stock
FROM products p
    INNER JOIN product_orders po
        ON p.id = po.product_id
WHERE po.expiration_date > GETDATE()
GROUP BY p.id,
         p.category_id,
         p.default_supplier_id,
         p.name,
         p.available,
         p.import_price,
         p.retail_price,
         p.shelf_life,
         p.description,
         p.created_at;
GO

--- new ----

CREATE VIEW vw_CdsUpeProductsWithImages
AS
SELECT p.*,
       (
         SELECT pc.*
         FROM product_categories pc
         WHERE pc.id = p.category_id
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
       ) AS category,
       (
         SELECT s.*
         FROM suppliers s
         WHERE s.id = p.default_supplier_id
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
       ) AS default_supplier,
       upe.image_urls,
       upe.product_orders
FROM products p
INNER JOIN vw_ProductsWithUnexpiredOrdersAndImages upe
ON p.id = upe.id;
GO
