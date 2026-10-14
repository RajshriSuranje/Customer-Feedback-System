# Customer Feedback System
A full-stack web application that allows users to submit feedback and administrators to manage user feedback through a web interface.

## Technologies Used
**Frontend**
- React.js
- JavaScript
- HTML and CSS

**Backend**
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA

**Database**
- MySQL

## Features
- User registration and login
- JWT-based authentication
- Role-based access for users and administrators
- Submit and manage customer feedback
- REST API integration between frontend and backend
- Database persistence using MySQL

## Project Structure
```text
Customer-Feedback-System/
├── Feedback-1/       # Spring Boot backend
├── feedback-ui/      # React frontend
└── README.md
```

## Getting Started

### Prerequisites
- Java and Maven
- Node.js and npm
- MySQL
- Git

### Backend Setup
1. Create a MySQL database named `feedback1`.
2. Configure the database URL, username, and password using your local environment variables.
3. Open the `Feedback-1` folder.
4. Run the Spring Boot application using your IDE or Maven.

### Frontend Setup
1. Open a terminal in the `feedback-ui` folder.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Purpose

This project demonstrates full-stack application development, REST API integration, authentication, authorization, and database connectivity using Java and React.
