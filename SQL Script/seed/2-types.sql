USE [nutribox]
GO

CREATE TYPE StoreHoursRecordsType AS TABLE
(
    id uniqueidentifier PRIMARY KEY,
    store_id uniqueidentifier NOT NULL,
    day_of_week nvarchar(10) NOT NULL,
    open_time time NOT NULL,
    close_time time NOT NULL
);
