create database ECommerceDb
use ECommerceDb
--drop database ECommerceDb
--select @@SERVERNAME
--use master
select * from Users
--truncate table Users

select * from Roles
select * from Addresses
select * from UserRoles
delete from Addresses
select * from Categories






delete from Users where Id = 8


update Users set Balance = 100000 where Id = 4

select * from Products
select * from ProductImages
select * from ProductVariants


update ProductImages set ImageUrl = 'https://images.unsplash.com/photo-1722439667098-f32094e3b1d4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' where Id = 1


select * from Carts
Select * from CartItems

select * from Orders
Select * from OrderItems
select * from OrderStatusHistories


select * from Invoices
select * from InvoiceLineItems


--DELETE FROM InvoiceLineItems;
--DELETE FROM Invoices;
