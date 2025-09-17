# The Home Office Kit - 3-Tier E-Commerce Application

This is a complete, functional, 3-tier e-commerce web application built with Angular, Express.js, and MySQL.

## Running with Docker (Recommended)

With Docker and Docker Compose, you can run the entire application with a single command.

1.  **Prerequisites:**
    *   [Docker](https://docs.docker.com/get-docker/) installed.
    *   [Docker Compose](https://docs.docker.com/compose/install/) installed.

2.  **Run the Application:**
    *   You can use the `.env` file in the `backend` directory to configure your application. If you don't, the application will use default values.
    *   Open a terminal in the project root directory (the one containing the `docker-compose.yml` file).
    *   Run the following command:
        ```bash
        docker-compose up -d --build
        ```

    *   **Important First-Time Setup:** The database starts empty. You must first go to the website and **Register** a new user account before you can log in or place orders.

3.  **Access the Application:**
    *   This will build the images for the frontend and backend, start the containers, and set up the database.

3.  **Access the Application:**
    *   **Website:** Open your browser and navigate to `http://localhost`.
    *   **Backend API:** The API is available at `http://localhost:3000`.
    *   **Database:** The MySQL database is exposed on port `3307`.

4.  **Stopping the Application:**
    *   To stop the running containers, execute:
        ```bash
        docker-compose down
        ```

## Project Concept

A minimalist website named "The Home Office Kit" that sells curated, themed boxes for home office setups. The application includes user registration/login, a working shopping cart, and a secure admin panel for product management.

## Tech Stack

*   **Presentation Tier (Frontend):** Angular
*   **Application Tier (Backend):** Express.js
*   **Data Tier (Database):** MySQL

## Features

*   User registration and login
*   JWT-based authentication
*   Admin panel for product management (add/remove products)
*   Shopping cart with persistent state (localStorage)
*   Lazy-loaded admin module
*   Minimalist design
*   Automatic database table creation on startup.

## Setup and Installation Guide

### 1. Database Setup

1.  Ensure you have MySQL installed and running on your machine.
2.  Log in to your MySQL server and create the database:
    ```sql
    CREATE DATABASE pc_parts;
    ```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```
3.  Open the `.env` file and update the following variables with your credentials:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=pc_parts

    JWT_SECRET=a_very_strong_and_secret_key

    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=a_secure_password
    ```
4.  Install the backend dependencies:
    ```bash
    npm install
    ```
5.  Start the backend server:
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:3000`.

### 3. Frontend Setup For the Page

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    npm start
    ```
4.  Open your browser and navigate to `http://localhost:4200` to see the application.

## API Documentation

### Public Routes

*   `GET /api/products`: Retrieve a list of all product kits.
*   `GET /api/products/:id`: Retrieve a single product kit.

### Authentication Routes

*   `POST /api/auth/register`: Create a new user.
*   `POST /api/auth/login`: Authenticate a standard user and return a JWT.
*   `POST /api/auth/admin/login`: Authenticate the admin and return a JWT with admin privileges.

### Protected Admin Routes

*These routes require a valid admin JWT in the `Authorization` header (`Bearer <token>`).*

*   `POST /api/products`: Add a new product to the database.
*   `DELETE /api/products/:id`: Remove a product from the database.
 a new product to the database.
*   `DELETE /api/products/:id`: Remove a product from the database.
