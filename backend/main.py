
import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from pwdlib import PasswordHash

app = FastAPI(title="MediQueue Hospital API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(
    "mongodb://localhost:27017",
    serverSelectionTimeoutMS=3000
)

db = client["smart_hospital"]
appointments = db["appointments"]
patients = db["patients"]

password_hash = PasswordHash.recommended()
security = HTTPBearer()

JWT_SECRET = os.getenv("MEDIQUEUE_JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "MEDIQUEUE_JWT_SECRET is missing. "
        "Set it before starting the backend."
    )

JWT_ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 8

doctors = [
    {"id": 1, "name": "Dr. Sharma", "department": "General", "avg_time": 10},
    {"id": 2, "name": "Dr. Priya", "department": "Cardiology", "avg_time": 15},
    {"id": 3, "name": "Dr. Kumar", "department": "Neurology", "avg_time": 20},
]


class PatientRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: str
    password: str = Field(min_length=8, max_length=128)
    age: int = Field(ge=1, le=120)
    gender: str
    phone: str


class PatientLogin(BaseModel):
    email: str
    password: str


class Booking(BaseModel):
    patient_name: str
    doctor_id: int


def normalize_email(email):
    email = email.strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Invalid email address")
    return email


def create_token(patient):
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(patient["_id"]),
        "role": "patient",
        "iat": now,
        "exp": now + timedelta(hours=TOKEN_EXPIRY_HOURS),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )


def current_patient(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("role") != "patient":
            raise ValueError("Invalid role")

        patient_id = payload.get("sub")

        if not ObjectId.is_valid(patient_id):
            raise ValueError("Invalid patient ID")

        patient = patients.find_one({
            "_id": ObjectId(patient_id)
        })

        if not patient:
            raise ValueError("Patient not found")

        return patient

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired login. Please sign in again."
        )


@app.get("/")
def home():
    return {"message": "MediQueue API is running"}


@app.post("/auth/register", status_code=201)
def register_patient(data: PatientRegister):
    email = normalize_email(data.email)

    if not data.full_name.strip():
        raise HTTPException(400, "Full name is required")

    if not data.phone.isdigit() or len(data.phone) != 10:
        raise HTTPException(400, "Enter a valid 10-digit phone number")

    if data.gender not in [
        "Female", "Male", "Other", "Prefer not to say"
    ]:
        raise HTTPException(400, "Invalid gender selection")

    if patients.find_one({"email": email}):
        raise HTTPException(409, "Email is already registered")

    patient = {
        "full_name": data.full_name.strip(),
        "email": email,
        "password_hash": password_hash.hash(data.password),
        "age": data.age,
        "gender": data.gender,
        "phone": data.phone,
        "created_at": datetime.now(timezone.utc),
    }

    try:
        patients.insert_one(patient)
    except DuplicateKeyError:
        raise HTTPException(409, "Email is already registered")

    return {
        "message": "Account created successfully. Please sign in."
    }


@app.post("/auth/login")
def login_patient(data: PatientLogin):
    email = normalize_email(data.email)
    patient = patients.find_one({"email": email})

    if not patient or not password_hash.verify(
        data.password, patient["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    return {
        "access_token": create_token(patient),
        "token_type": "bearer",
        "patient": {
            "id": str(patient["_id"]),
            "full_name": patient["full_name"],
            "email": patient["email"],
        },
    }


@app.get("/auth/me")
def get_my_profile(patient=Depends(current_patient)):
    return {
        "id": str(patient["_id"]),
        "full_name": patient["full_name"],
        "email": patient["email"],
        "age": patient["age"],
        "gender": patient["gender"],
        "phone": patient["phone"],
    }


@app.get("/doctors")
def get_doctors():
    return doctors


@app.post("/book")
def book_appointment(
    booking: Booking,
    patient=Depends(current_patient)
):
    doctor = next(
        (d for d in doctors if d["id"] == booking.doctor_id),
        None
    )

    if not doctor:
        raise HTTPException(404, "Doctor not found")

    existing = appointments.count_documents({
        "doctor_id": booking.doctor_id
    })

    queue_number = existing + 1
    waiting_time = existing * doctor["avg_time"]

    record = {
        "patient_id": str(patient["_id"]),
        "patient_name": patient["full_name"],
        "doctor_id": booking.doctor_id,
        "doctor_name": doctor["name"],
        "queue_number": queue_number,
        "waiting_time": waiting_time,
        "status": "Booked",
        "created_at": datetime.now(timezone.utc),
    }

    result = appointments.insert_one(record)

    return {
        "appointment_id": str(result.inserted_id),
        "patient_name": patient["full_name"],
        "doctor_name": doctor["name"],
        "queue_number": queue_number,
        "estimated_wait_minutes": waiting_time,
    }


@app.get("/appointments")
def get_appointments(patient=Depends(current_patient)):
    records = appointments.find(
        {"patient_id": str(patient["_id"])},
        {"_id": 0}
    ).sort("created_at", -1)

    return list(records)
