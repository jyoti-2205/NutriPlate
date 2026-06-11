-- Health Aware Food System - MySQL Schema
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS health_aware_db;
USE health_aware_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  cholesterol DECIMAL(5,2),
  sugar DECIMAL(5,2),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cholesterol DECIMAL(5,2) NOT NULL,
  image VARCHAR(10) DEFAULT '🍽️',
  category ENUM('Safe', 'Risky') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
