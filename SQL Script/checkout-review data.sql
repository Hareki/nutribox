/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[product_id]
      ,[account_id]
      ,[quantity]
      ,[created_at]
  FROM [nutribox].[dbo].[cart_items]


  /****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[product_id]
      ,[supplier_id]
      ,[import_quantity]
      ,[remaining_quantity]
      ,[import_date]
      ,[expiration_date]
      ,[unit_import_price]
      ,[created_at]
  FROM [nutribox].[dbo].[product_orders]


  /****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[status_id]
      ,[account_id]
      ,[phone]
      ,[province_code]
      ,[district_code]
      ,[ward_code]
      ,[street_address]
      ,[delivered_on]
      ,[estimated_distance]
      ,[estimated_delivery_time]
      ,[total]
      ,[note]
      ,[profit]
      ,[paid]
      ,[created_at]
  FROM [nutribox].[dbo].[customer_orders]


  /****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[customer_order_id]
      ,[product_id]
      ,[quantity]
      ,[unit_import_price]
      ,[unit_retail_price]
      ,[created_at]
  FROM [nutribox].[dbo].[customer_order_items]

  /****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[product_order_id]
      ,[customer_order_item_id]
      ,[quantity]
      ,[created_at]
  FROM [nutribox].[dbo].[export_history]