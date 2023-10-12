# Xây dựng hệ thống quản lý mua bán thực phẩm tươi sống và nhu yếu phẩm

## Overview

The Fresh Food and Essentials Retail Management System (FFERMS) bridges the gap between online sales and offline inventory, focusing on delivering fresh food items and daily essentials to customers. It provides a comprehensive suite of tools to manage product availability, facilitate online shopping, and ensure that inventory matches sales demands.

## Features

### 1. **Product Management**
- **Categories**: Categorize products for easy management and retrieval.
- **Product Images**: Associate multiple images with each product.
- **Availability & Shelf Life**: Monitor available stock and expiration dates of perishable items.

### 2. **Order Management**
- **Import Orders**: Record and manage products procured from suppliers. Details such as import date, expiration date, and quantity are meticulously logged.
- **Customer Orders**: Track and oversee customer orders. Detailed insights into payment methods, delivery specifics, and estimated delivery windows are provided.
- **Automatic Export Order Generation**: Upon customer checkout, the system auto-generates export orders based on the products' impending expiration dates.
- **Instant Order Completion**: Certain in-store purchases can be directly marked as "Completed", bypassing other statuses.

### 3. **Online Shopping Experience**
- Efficient cart system allows customers to select products.
- During checkout, `customer_order_item` records form based on cart content.
- Post successful checkout, corresponding cart items are deleted.

### 4. **Warehouse Operations**
- Warehouse personnel, under guidance from the Warehouse Manager, ensure product deliveries to Shippers.
- Staff details are maintained in the system, obviating the need for them to log in.

### 5. **Review & Feedback Mechanism**
- Customers can post reviews for their purchases.
- Designated employees can address and respond to these reviews.

### 6. **Store & Operational Data**
- Store-centric details, like email, contact, and address, are recorded.
- Working hours for the store are logged. Orders placed outside these hours prevent customers from completing their checkout.
- Vital store details are shown on the application's footer for user convenience.

### 7. **Accounts & Security**
- Comprehensive account management with features like verification, password resetting, and more.
- Separate account associations exist for employees and customers, but Warehouse Staff are exempt from this provision.

### 8. **Miscellaneous Features**
- Supplier data management, recording essential details like name, contact, and address.
- Customers have the flexibility to maintain multiple addresses.
- Employee management includes role allocations and associated privileges.

## Getting Started

### Docker Compose

docker compose --env-file .env.local up -d