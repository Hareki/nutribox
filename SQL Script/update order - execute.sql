USE [nutribox]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[usp_CustomerOrder_UpdateStatus]
		@CustomerOrderId = 'B2EBB5F1-ACC6-49B0-AD9B-4913B83E12FC'

SELECT	'Return Value' = @return_value

GO
