-- =====================================================
-- BASE DE DATOS PARA BARBERÍA - MVP
-- 8 TABLAS EN 3FN
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS barberia_mvp;
USE barberia_mvp;

-- Eliminar tablas si existen (orden inverso por FK)
DROP TABLE IF EXISTS Bitacora_Comisiones;
DROP TABLE IF EXISTS Historial_Estetico;
DROP TABLE IF EXISTS Citas;
DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Servicios;
DROP TABLE IF EXISTS BarberProfiles;
DROP TABLE IF EXISTS Clientes;
DROP TABLE IF EXISTS Usuarios;

-- =====================================================
-- TABLA 1: Usuarios
-- =====================================================
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'BARBER', 'CLIENT') NOT NULL
);

-- =====================================================
-- TABLA 2: Clientes
-- =====================================================
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- =====================================================
-- TABLA 3: BarberProfiles
-- =====================================================
CREATE TABLE BarberProfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    estado ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    porcentaje_comision DECIMAL(3,2) DEFAULT 0.40,
    FOREIGN KEY (userId) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA 4: Servicios
-- =====================================================
CREATE TABLE Servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    duracion_minutos INT NOT NULL
);

-- =====================================================
-- TABLA 5: Citas
-- =====================================================
CREATE TABLE Citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    estado ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    clienteId INT NOT NULL,
    barberId INT NOT NULL,
    servicioId INT NOT NULL,
    FOREIGN KEY (clienteId) REFERENCES Clientes(id),
    FOREIGN KEY (barberId) REFERENCES BarberProfiles(id),
    FOREIGN KEY (servicioId) REFERENCES Servicios(id)
);

-- =====================================================
-- TABLA 6: Historial_Estetico
-- =====================================================
CREATE TABLE Historial_Estetico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL,
    barberId INT NOT NULL,
    notas_corte TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clienteId) REFERENCES Clientes(id),
    FOREIGN KEY (barberId) REFERENCES BarberProfiles(id)
);

-- =====================================================
-- TABLA 7: Productos
-- =====================================================
CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad_stock INT DEFAULT 0,
    alerta_stock_minimo INT DEFAULT 5
);

-- =====================================================
-- TABLA 8: Bitacora_Comisiones
-- =====================================================
CREATE TABLE Bitacora_Comisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citaId INT NOT NULL,
    barberId INT NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    fecha_calculo DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citaId) REFERENCES Citas(id),
    FOREIGN KEY (barberId) REFERENCES BarberProfiles(id)
);

