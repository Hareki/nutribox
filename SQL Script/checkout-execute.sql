USE [nutribox]
GO

DECLARE @estimated_time datetime2 = GETDATE(),
@customer_order_id_output uniqueidentifier


DECLARE	@return_value int

EXEC	@return_value = [dbo].[usp_Checkout]
		@account_id = 'B849550E-3AEB-4411-A4E8-B1399305B8B5',
		@phone = N'033-833-1111',
		@province_code = 79,
		@district_code = 79,
		@ward_code = 79,
		@street_address = N'asd',
		@estimated_distance = 12,
		@estimated_delivery_time = @estimated_time,
		@note = N'note',
		@paid = 0,
		@customer_order_id_output = @customer_order_id_output OUTPUT

SELECT	'Return Value' = @return_value

GO
