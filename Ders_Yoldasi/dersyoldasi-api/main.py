from datetime import datetime, timedelta
import jwt
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

SECRET_KEY = "dersyoldasi-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

bearer_scheme = HTTPBearer(bearerFormat="JWT")

app = FastAPI(title="DersYoldasi API", version="0.2.0", swagger_ui_parameters={"persistAuthorization": True})

# CORS ayarları (Frontend erişimi için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK VERİTABANI ---
users_db = [
    {"id": "user_1", "email": "ogrenci@ornek.com", "password": "123456", "full_name": "Demo Öğrenci"},
    {"id": "admin", "email": "admin", "password": "1234", "full_name": "Yönetici"},
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

class AuthLogin(BaseModel):
    username: str
    password: str

# --- JWT HELPER FONKSİYONLARI ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")


# --- ENDPOINT'LER ---
@app.get("/")
async def root():
    return {"mesaj": "DersYoldasi API çalışıyor!"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    if any(u["email"] == user.email for u in users_db):
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")

    new_user = {
        "id": str(uuid4()),
        "email": user.email,
        "password": user.password,
        "full_name": user.full_name,
    }
    users_db.append(new_user)
    return {"mesaj": "Kayıt başarılı", "user_id": new_user["id"]}

@app.post("/login", status_code=status.HTTP_200_OK)
async def login(user_creds: UserLogin):
    user = next(
        (u for u in users_db if u["email"] == user_creds.email and u["password"] == user_creds.password),
        None,
    )

    if user:
        token_payload = {"sub": user["id"], "email": user["email"], "full_name": user["full_name"]}
        token = create_access_token(token_payload)
        return {
            "mesaj": "Giriş başarılı",
            "token": token,
            "user_id": user["id"],
            "full_name": user["full_name"],
        }
    raise HTTPException(status_code=401, detail="Hatalı e-posta veya şifre")

@app.post("/auth/login", status_code=status.HTTP_200_OK)
async def auth_login(credentials: AuthLogin):
    if credentials.username == "admin" and credentials.password == "1234":
        token_payload = {"sub": credentials.username}
        token = create_access_token(token_payload, expires_delta=timedelta(minutes=10))
        return {"access_token": token, "token_type": "bearer", "expires_in_minutes": 10}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Geçersiz kullanıcı adı veya şifre")

@app.get("/courses", response_model=List[Course])
async def get_courses():
    return courses_db  # Simülasyon: Tüm kursları döndürür

@app.post("/courses", response_model=Course, status_code=201)
async def create_course(course: CourseCreate):
    new_course = Course(id=str(uuid4()), user_id="demo_user", **course.model_dump())
    courses_db.append(new_course)
    return new_course

@app.get("/api/protected")
async def protected_route(payload: dict = Depends(verify_token)):
    return {"message": "Token gecerli", "user": payload}
