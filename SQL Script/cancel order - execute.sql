USE [nutribox]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[usp_CancelOrder]
		--- change the id everytime reseting the database!
		@CustomerOrderId = '277B4FC6-35A8-4E8D-8B24-1DD1FCDC4A74'

SELECT	'Return Value' = @return_value

GO
