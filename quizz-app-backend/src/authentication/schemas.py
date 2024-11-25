from ninja import Schema
from pydantic import EmailStr, Field, field_validator
from typing import Optional
import re


class RegisterSchema(Schema):
    username: str = Field(min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str

    @field_validator("password")
    def validate_password(cls, value):       
        return validate_password(value)


class LoginSchema(Schema):
    email: EmailStr
    password: str


class UserUpdateSchema(Schema):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class UserDetailSchema(Schema):
    id: int
    username: str
    email: EmailStr


class ChangePasswordSchema(Schema):
    old_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    def validate_new_password(cls, value):
        return validate_password(value)


# Validators
def validate_password(value):       
    if not re.search(r'[A-Z]', value):
        raise ValueError("Password must contain at least one uppercase letter.")
    
    if not re.search(r'[a-z]', value):
        raise ValueError("Password must contain at least one lowercase letter.")
    
    if not re.search(r'[0-9]', value):
        raise ValueError("Password must contain at least one digit.")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        raise ValueError("Password must contain at least one special character.")
    
    return value