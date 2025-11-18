from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI(title="DersYoldaşı API", version="0.2.0")

# CORS İzinleri (Frontend'den erişim için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK VERİTABANI ---
users_db = [
    {"id": "user_1", "email": "ogrenci@ornek.com", "password": "123456", "full_name": "Demo Öğrenci"}
]
courses_db = []
goals_db = []

# --- MODELLER ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Course(CourseCreate):
    id: str
    user_id: str

# --- ENDPOINT'LER ---

@app.get("/")
async def root():
    return {"mesaj": "DersYoldaşı API çalışıyor!"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    if any(u['email'] == user.email for u in users_db):
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")
    
    new_user = {
        "id": str(uuid4()),
        "email": user.email,
        "password": user.password,
        "full_name": user.full_name
    }
    users_db.append(new_user)
    return {"mesaj": "Kayıt başarılı", "user_id": new_user["id"]}

@app.post("/login", status_code=status.HTTP_200_OK)
async def login(user_creds: UserLogin):
    user = next((u for u in users_db if u['email'] == user_creds.email and u['password'] == user_creds.password), None)
    
    if user:
        return {
            "mesaj": "Giriş başarılı",
            "token": f"fake-jwt-token-{user['id']}",
            "user_id": user['id'],
            "full_name": user['full_name']
        }
    raise HTTPException(status_code=401, detail="Hatalı e-posta veya şifre")

@app.get("/courses", response_model=List[Course])
async def get_courses():
    return courses_db # Simülasyon: Tüm kursları döndürür

@app.post("/courses", response_model=Course, status_code=201)
async def create_course(course: CourseCreate):
    new_course = Course(id=str(uuid4()), user_id="demo_user", **course.model_dump())
    courses_db.append(new_course)
    return new_course