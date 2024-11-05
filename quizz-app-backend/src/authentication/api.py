from ninja_extra import Router
from django.contrib.auth.hashers import make_password, check_password

from .schemas import UserDetailSchema, RegisterSchema
from quizz_app.schemas import MessageSchema
from .models import User

router = Router()

@router.post("/register", response= {201: UserDetailSchema, 400: MessageSchema})
def register(request, payload: RegisterSchema):
    try:
        if User.objects.filter(email=payload.email).exists():
            return 400, {"message": "Email is already registered."}
        
        if User.objects.filter(username=payload.username).exists():
            return 400, {"message": "Username is already registered."}

        user_data = payload.dict()

        user_data['password'] = make_password(user_data['password'])

        user = User.objects.create(**user_data)

        return 201, user
    except Exception as e:
        return 500, {"message": "An unexpected error occurred."}