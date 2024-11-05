from ninja_extra import Router
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from ninja_jwt.tokens import RefreshToken
import traceback

from .schemas import UserDetailSchema, RegisterSchema, LoginSchema, UserUpdateSchema, ChangePasswordSchema
from quizz_app.schemas import MessageSchema
from .models import User
import helpers

router = Router()

@router.post("/register", response= {201: UserDetailSchema, 400: MessageSchema, 500: MessageSchema})
def register(request, payload: RegisterSchema):
    try:
        if User.objects.filter(email=payload.email).exists():
            return 400, {"message": "Email is already registered."}
        
        if User.objects.filter(username=payload.username).exists():
            return 400, {"message": "Username is already registered."}
    
        if payload.password != payload.confirm_password:
            return 400, {"message": "Passwords do not match."}

        user_data = payload.dict()

        user_data.pop("confirm_password", None)
        user_data['password'] = make_password(user_data['password'])

        user = User.objects.create(**user_data)

        return 201, user
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}
    

@router.post("/login", response={200: dict, 401: MessageSchema, 500: MessageSchema})
def login(request, payload: LoginSchema):
    try:
        user = authenticate(request, email=payload.email, password=payload.password)
        
        if user is None:
            return 401, {"message": "Invalid email or password"}

        user.update_last_login()
        refresh = RefreshToken.for_user(user)
        
        return 200, {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
        }
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error occurred."}
    

@router.get("/user", response={200: UserDetailSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_user(request):
    try:
        user = request.user

        return 200, user
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}
    

@router.patch("/user", response={200: UserDetailSchema, 400: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def update_user(request, payload: UserUpdateSchema):
    try:
        user = request.user

        if payload.email and User.objects.filter(email=payload.email).exclude(id=user.id).exists():
            return 400, {"message": "Email is already taken."}
        
        if payload.username and User.objects.filter(username=payload.username).exclude(id=user.id).exists():
            return 400, {"message": "Username is already taken."}

        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(user, attr, value)

        user.save()

        return 200, user
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}
    

@router.post("/change-password", response={200: MessageSchema, 400: MessageSchema}, auth=helpers.auth_required)
def change_password(request, payload: ChangePasswordSchema):
    try:
        user = request.user
        if not check_password(payload.old_password, user.password):
            return 400, {"message": "Old password incorrect."}
        
        if payload.new_password != payload.confirm_password:
            return 400, {"message": "New passwords do not match."}
        
        user.password = make_password(payload.new_password)
        user.save()

        return 200, {"message": "Password changed successfully."}
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}