# 💊 DosePilot

<div align="center">

### Smart medicine management for healthier living.

A full-stack healthcare web application designed to help users manage medications efficiently with reminders, dose tracking, stock monitoring, adherence analytics, and family healthcare support.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript)
![Java](https://img.shields.io/badge/Java-Backend-ED8B00?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/SpringBoot-API-6DB33F?style=for-the-badge&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)

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
- shadcn/ui
- React Router
- React Query
- Axios

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database
- MySQL

### Tools
- Git
- GitHub
- Postman
- Swagger/OpenAPI
- IntelliJ IDEA
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

## 🚀 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Medicines
```http
GET /api/medicines
POST /api/medicines
GET /api/medicines/{id}
PUT /api/medicines/{id}
DELETE /api/medicines/{id}
```

### Reminders
```http
GET /api/reminders
POST /api/reminders
PUT /api/reminders/{id}
DELETE /api/reminders/{id}
```

### Dose Tracking
```http
POST /api/dose/taken
POST /api/dose/skipped
GET /api/dose/history
```

### Notifications
```http
GET /api/notifications
PUT /api/notifications/read
```

### Family Management
```http
GET /api/family
POST /api/family
PUT /api/family/{id}
DELETE /api/family/{id}
```

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

## 📸 Screenshots

Add screenshots here after project completion:

```md
![Landing Page](assets/landing-page.png)
![Dashboard](assets/dashboard.png)
![Medicine Management](assets/medicines.png)
![Reminder System](assets/reminders.png)
```

---

## 🎯 Future Enhancements

- Email reminder notifications
- SMS alerts
- Push notifications
- OCR prescription scanner
- AI medicine recommendations
- Doctor integration
- Health report export (PDF)
- Cloud deployment
- Admin dashboard
- Multi-language support

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
- Scalable architecture design

---

## 🌍 Use Cases

DosePilot helps:

- Individuals managing daily medications
- Elderly healthcare support
- Families managing medicine schedules
- Caregivers monitoring dependents
- Improving medication adherence

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---

## 👩‍💻 Author

**Keerthana C**

---
