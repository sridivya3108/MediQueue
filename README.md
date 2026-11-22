# 🏥 MediQueue
### Smart Hospital Queue Management System

**A modern healthcare appointment and queue management platform designed to simplify hospital visits, reduce waiting-time uncertainty, and improve the experience of patients and healthcare professionals.**

MediQueue combines a responsive web interface, appointment management, queue tracking, and a role-based portal architecture to create a more organized digital healthcare experience.

---

## 🌟 Project Overview

Traditional hospital queue systems often involve long waiting periods, manual appointment handling, and limited visibility into consultation schedules.

**MediQueue** aims to address these challenges through a centralized platform where patients can book appointments, monitor queue information, and interact with a modern healthcare interface.

The project is being developed with three dedicated portals:

- **Patient Portal** – Patient registration, login, appointment booking, and queue visibility.
- **Doctor Portal** – Planned interface for managing consultations and patient queues.
- **Administrator Portal** – Planned interface for overseeing hospital operations, appointments, and doctors.

## ✨ Key Features

### 👤 Patient Portal
- Modern patient registration and sign-in interface.
- Backend endpoints for patient authentication.
- Password hashing and JWT-based authentication.
- Doctor selection and appointment booking functionality.
- Queue number generation and estimated waiting-time calculation.
- Patient-specific appointment retrieval.

### 👨‍⚕️ Doctor Portal — Planned
- Doctor dashboard and consultation management.
- View scheduled appointments.
- Manage patient queue status.
- Update consultation progress.

### 🛡️ Administrator Portal — Planned
- Centralized hospital management dashboard.
- Doctor and appointment administration.
- Queue monitoring and operational insights.
- Hospital activity summaries.

### 🤖 AI & Smart Features — In Development
- AI-assisted waiting-time prediction.
- Interactive healthcare chatbot.
- Smart queue updates and appointment notifications.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| UI Icons | Lucide React |
| Backend | Python, FastAPI |
| Database | MongoDB |
| Authentication | JWT, Argon2 Password Hashing |
| API Documentation | Swagger UI / OpenAPI |
| Version Control | GitHub |

## 🏗️ System Architecture

```text
                 MediQueue
                     |
              React Frontend
                     |
          -----------------------
          |          |          |
       Patient     Doctor     Admin
       Portal      Portal     Portal
          |          |          |
          -----------------------
                     |
                FastAPI
                     |
                  MongoDB
```

**Development status:** The patient interface and backend APIs are under active development. Full role-specific access control and the doctor/administrator workflows are not yet complete.

## 📁 Recommended Project Structure

```text
MediQueue/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── PatientAuth.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── backend/
│   └── main.py
├── .gitignore
└── README.md
```

*Note: This is the intended project organization. The GitHub repository may require file restructuring after the initial browser upload.*

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are available:

- Node.js and npm
- Python 3.11 or later
- MongoDB Community Server

### 1. Clone the Repository

```bash
git clone https://github.com/sridivya3108/MediQueue.git
cd MediQueue
```

### 2. Start the Frontend

From the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend is typically available at:

`http://localhost:5173`

### 3. Start the Backend

Open a separate terminal:

```bash
cd backend
python -m pip install fastapi "uvicorn[standard]" pymongo "pwdlib[argon2]" PyJWT
```

Configure a private JWT secret using the environment variable `MEDIQUEUE_JWT_SECRET`.

For Windows PowerShell:

```powershell
$env:MEDIQUEUE_JWT_SECRET = python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Then start the server:

```bash
python -m uvicorn main:app --reload
```

The backend should be available at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

**Note:** MongoDB must be running locally. The current backend uses `mongodb://localhost:27017`. Authentication and database connectivity require additional testing before production deployment.

## 🔌 Backend API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API health message |
| POST | `/auth/register` | Register a patient |
| POST | `/auth/login` | Authenticate a patient |
| GET | `/auth/me` | Retrieve patient profile |
| GET | `/doctors` | List available doctors |
| POST | `/book` | Book an appointment |
| GET | `/appointments` | Retrieve authenticated patient's appointments |

Protected endpoints require a valid bearer token.

## 📈 Future Enhancements

- Complete doctor and administrator authentication.
- Role-based authorization and dashboards.
- Machine-learning-based waiting-time estimation.
- Queue position updates and notifications.
- Appointment cancellation and rescheduling.
- Improved queue numbering and consultation scheduling.
- AI-powered patient assistance.
- Analytics and reporting dashboards.
- Cloud deployment and production security improvements.

## 🎯 Project Objectives

MediQueue is designed to:

1. Simplify hospital appointment scheduling.
2. Improve transparency in patient waiting times.
3. Reduce manual queue-management effort.
4. Provide an accessible and responsive healthcare interface.
5. Support future AI-driven hospital workflow optimization.

## 📌 Project Status

**Status: Under Active Development**

The project currently includes the landing page, patient authentication interface, appointment dashboard foundations, and FastAPI backend implementation.

Database integration, complete authentication flows, and dedicated doctor and administrator portals are being developed and tested.

This is an educational software project and is not intended for real patient or clinical data in its current state.

---

## 👩‍💻 Author

**Sri Divya**

GitHub: [@sridivya3108](https://github.com/sridivya3108)

---

### ⭐ Support

If you find this project interesting, consider giving the repository a star!

**MediQueue — Making Hospital Visits Smarter, Simpler, and More Organized.**
