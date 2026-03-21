from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

def create_token(username: str) -> tuple:
    """Create JWT token and return (token, expiry_datetime)"""
    expires = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    payload = {
        "sub": username,
        "exp": expires,
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, expires

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency that verifies JWT token and returns username"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Authenticate and return JWT token"""
    if request.username != settings.ADMIN_USERNAME or request.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    token, expires = create_token(request.username)
    
    return TokenResponse(
        access_token=token,
        expires_in=settings.JWT_EXPIRY_HOURS * 3600,
        user={
            "username": request.username,
            "role": "admin",
            "name": "AlumAI Admin"
        }
    )

@router.get("/me")
async def get_current_user(username: str = Depends(verify_token)):
    """Verify token and return user info"""
    return {
        "username": username,
        "role": "admin",
        "name": "AlumAI Admin"
    }