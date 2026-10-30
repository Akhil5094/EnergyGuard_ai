from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.schemas import UserCreate, UserResponse
from backend.app.core.security import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already registered")

    new_user = User(
        id=f"usr-{uuid.uuid4().hex[:8]}",
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    # Demo bypass for development evaluation
    if not user and "energyguard.ai" in creds.email:
        token = create_access_token({"sub": creds.email, "role": "owner"})
        return {"access_token": token, "token_type": "bearer", "role": "owner", "name": "Factory Owner"}

    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name}

@router.get("/me")
def get_current_user():
    return {
        "id": "usr-001",
        "name": "Rajesh Sharma",
        "email": "factory.owner@energyguard.ai",
        "role": "owner",
        "factory_id": "fac-001"
    }
