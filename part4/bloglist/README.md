# Bloglist Backend Application

This project is part of the Full Stack Open course.

It implements a RESTful Blog API built with Node.js, Express and MongoDB.  
The application includes JWT-based authentication, authorization checks and a comprehensive test suite.

## 🚀 Features

- Create, read, update and delete blogs
- JWT-based authentication
- Ownership validation (only the creator can modify/delete a blog)
- Proper HTTP status handling (200, 201, 204, 400, 401, 403, 404)
- Password hashing with bcrypt
- Fully tested with Node test runner and Supertest

## 🧪 Testing

The project includes:

- Helper function tests (pure functions)
- Blog API integration tests
- User API tests

You can run test using:
```bash
npm run test
```

## 🛠️ Technologies Used

- Node.js
- Express
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcrypt
- Supertest

## 📂 Project Structure

controllers/
models/
middleware/
tests/
utils/

## 📌 What This Project Demonstrates

- Secure backend API design
- Middleware-based authentication
- Integration testing
- Clean project structuring

## Install and Run

Install npm:
```bash
npm install
```

Run this project:
```bash
npm run dev
```