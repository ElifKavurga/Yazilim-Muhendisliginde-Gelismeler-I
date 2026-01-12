from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI(title="DersYoldaşı API", version="0.2.0")

# CORS İzinleri
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK VERİTABANI ---
# Demo kullanıcısını varsayılan olarak ekleyelim
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

class GoalCreate(BaseModel):
    course_id: str
    title: str
    target_hours: float

class Goal(GoalCreate):
    id: str
    is_completed: bool = False

# --- ENDPOINT'LER ---

@app.get("/")
async def root():
    return {"mesaj": "DersYoldaşı API çalışıyor!"}

# 1. KAYIT OL (YENİ!)
@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    # E-posta kontrolü
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

# 2. GİRİŞ YAP (GÜNCELLENDİ)
@app.post("/login", status_code=status.HTTP_200_OK)
async def login(user_creds: UserLogin):
    # Kullanıcıyı bul
    user = next((u for u in users_db if u['email'] == user_creds.email and u['password'] == user_creds.password), None)
    
    if user:
        return {
            "mesaj": "Giriş başarılı",
            "token": f"fake-jwt-token-{user['id']}",
            "user_id": user['id'],
            "full_name": user['full_name'] # İsim bilgisini de dönüyoruz artık
        }
    raise HTTPException(status_code=401, detail="Hatalı e-posta veya şifre")

# 3. DERS ve HEDEF İŞLEMLERİ (AYNI KALDI)
@app.get("/courses", response_model=List[Course])
async def get_courses():
    return courses_db

@app.post("/courses", response_model=Course, status_code=201)
async def create_course(course: CourseCreate):
    # Not: Gerçek uygulamada user_id'yi token'dan almalıyız.
    # Şimdilik basitlik için sabit veya header'dan gelen bir ID varsayıyoruz.
    new_course = Course(id=str(uuid4()), user_id="demo_user", **course.dict())
    courses_db.append(new_course)
    return new_course

@app.delete("/courses/{course_id}", status_code=204)
async def delete_course(course_id: str):
    for i, c in enumerate(courses_db):
        if c.id == course_id:
            del courses_db[i]
            global goals_db
            goals_db = [g for g in goals_db if g.course_id != course_id]
            return
    raise HTTPException(status_code=404, detail="Ders bulunamadı")

@app.get("/goals", response_model=List[Goal])
async def get_goals(course_id: Optional[str] = None):
    if course_id: return [g for g in goals_db if g.course_id == course_id]
    return goals_db

@app.post("/goals", response_model=Goal, status_code=201)
async def create_goal(goal: GoalCreate):
    if not any(c.id == goal.course_id for c in courses_db):
         raise HTTPException(status_code=404, detail="Ders bulunamadı")
    new_goal = Goal(id=str(uuid4()), **goal.dict())
    goals_db.append(new_goal)
    return new_goal

@app.delete("/goals/{goal_id}", status_code=204)
async def delete_goal(goal_id: str):
    for i, g in enumerate(goals_db):
        if g.id == goal_id:
            del goals_db[i]
            return
    raise HTTPException(status_code=404, detail="Hedef bulunamadı")

#Çalıştırmak için uvicorn main:app --reload

#Swagger için http://127.0.0.1:8000/docs

