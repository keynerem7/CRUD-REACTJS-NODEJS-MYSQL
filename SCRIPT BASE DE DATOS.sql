CREATE DATABASE techdev;
USE techdev;
CREATE TABLE empleados
(
	id int auto_increment primary key,
    nombre varchar(100) not null,
    edad int not null,
    pais varchar(100) not null,
    cargo varchar(100) not null,
    anios int not null,
    created_at timestamp default current_timestamp
);