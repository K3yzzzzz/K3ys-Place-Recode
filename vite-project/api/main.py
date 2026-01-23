from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import sqlite3
import jwt
import time
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# --- Load .env ---
load_dotenv()

SITE_CODE = os.getenv("SITE_CODE")
SECRET_KEY = os.getenv("SECRET_KEY")
DB_PATH = os.getenv("DB_PATH", "users.db")
PORT = int(os.getenv("PORT", 8000))
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", 3600))
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database ---
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")
conn.commit()

# --- FastAPI app ---
app = FastAPI()

# Allow CORS (for your frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class SignupData(BaseModel):
    email: EmailStr
    password: str

class LoginData(BaseModel):
    email: EmailStr
    password: str
    code: str

# --- Helpers ---
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_token(email: str):
    payload = {"email": email, "exp": time.time() + ACCESS_TOKEN_EXPIRE_SECONDS}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# --- Routes ---
@app.post("/signup")
def signup(data: SignupData):
    hashed_pw = hash_password(data.password)
    try:
        cur.execute("INSERT INTO users (email, password) VALUES (?, ?)", (data.email, hashed_pw))
        conn.commit()
        return {"message": "User created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")


@app.post("/login")
def login(data: LoginData):
    # Check site code
    if data.code != SITE_CODE:
        raise HTTPException(status_code=403, detail="Invalid site code")

    cur.execute("SELECT password FROM users WHERE email = ?", (data.email,))
    row = cur.fetchone()
    if not row or not verify_password(data.password, row[0]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(data.email)
    return {"token": token}
