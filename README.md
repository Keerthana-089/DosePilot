# 💊 DosePilot

<div align="center">

### Smart medicine management for healthier living.

A full-stack healthcare web application designed to help users manage medications efficiently with reminders, dose tracking, stock monitoring, adherence analytics, and family healthcare support.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript)
![Java](https://img.shields.io/badge/Java-Backend-ED8B00?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/SpringBoot-API-6DB33F?style=for-the-badge&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)

🔗 Link: https://dosepilot-health-hub.c-keerthana089.workers.dev/

</div>

---

## 📌 Overview

DosePilot is a modern full-stack healthcare platform built to simplify medication management for individuals and families.

Managing medicines manually can lead to missed doses, low stock issues, and poor adherence. DosePilot solves this by offering an intuitive dashboard, smart reminders, medication tracking, stock alerts, and caregiver support in a polished healthcare-focused interface.

This project demonstrates full-stack development by integrating a professional React frontend with a scalable Java Spring Boot backend.

---

## ✨ Features

### 🔐 Authentication & Security
- User Registration
- Secure Login / Logout
- JWT Authentication
- Protected Routes
- Forgot Password
- Reset Password
- Session Management

### 💊 Medicine Management
- Add medicines
- Edit medicine details
- Delete medicines
- View complete medication information
- Search medicines
- Filter medications
- Sort medicines
- Medicine image upload support

### ⏰ Smart Reminder System
- Scheduled medication reminders
- Daily reminder timeline
- Upcoming reminder list
- Mark dose as taken
- Mark dose as skipped
- Snooze reminders
- Missed dose tracking

### 📦 Stock Management
- Track medicine inventory
- Auto stock deduction
- Low stock warnings
- Refill threshold alerts
- Medicine consumption tracking

### 📊 Dashboard Analytics
- Today's medications
- Weekly adherence tracking
- Monthly summaries
- Missed dose analytics
- Health overview cards
- Activity timeline
- Medication consistency insights

### 👨‍👩‍👧 Family / Caregiver Mode
- Add family member profiles
- Manage dependent medications
- Parent/child medication tracking
- Separate medication schedules

### 🔔 Notification Center
- Reminder notifications
- Low stock alerts
- Missed medication warnings
- System notifications

### 📜 Dose History
- Daily logs
- Weekly reports
- Monthly medication history
- Adherence reports
- Dose status monitoring

### ⚙️ Profile & Settings
- User profile management
- Notification preferences
- Health preferences
- Password updates
- Privacy settings

---

## 🛠 Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios

### Backend
- Java 
- Spring Boot
- Spring Data JPA
- Maven

### Database
- MySQL

### Tools
- Git
- GitHub
- Postman
- Swagger/OpenAPI
- VS Code

---

## 🏗 System Architecture

```bash
Frontend (React + TypeScript)
        ↓
 REST API Communication
        ↓
Backend (Java Spring Boot)
        ↓
 MySQL Database
```

---

## 📂 Project Structure

```bash
DosePilot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.tsx
│   │
│   └── public/
│
├── backend/
│   ├── src/main/java/com/dosepilot/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   ├── config/
│   │   ├── scheduler/
│   │   ├── exception/
│   │   └── DosepilotApplication.java
│   │
│   └── src/main/resources/
│       └── application.properties
│
└── README.md
```

---

## 🔌 Core Modules

- Authentication Service
- Medicine Management Service
- Reminder Scheduling Service
- Stock Management Service
- Notification Service
- Family Management Service
- Dose Logging Service
- Analytics Service

---

## ⚙️ Installation

### Clone Repository
```bash
git clone https://github.com/your-username/dosepilot.git
cd dosepilot
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```bash
http://localhost:5173
```

### Backend Setup

Create database:
```sql
CREATE DATABASE dosepilot_db;
```

Configure `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dosepilot_db
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your-secret-key
jwt.expiration=86400000
```

Run backend:
```bash
cd backend
mvn spring-boot:run
```

Backend runs on:
```bash
http://localhost:8080
```

---


## 💡 Learning Outcomes

This project demonstrates:

- Full-stack application development
- REST API design
- Authentication & authorization
- Backend security implementation
- Database schema design
- Frontend-backend integration
- State management
- Scheduler implementation

---

## 👩‍💻 Author

**Keerthana C**

---
