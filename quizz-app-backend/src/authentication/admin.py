from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


class UserAdmin(UserAdmin):
    model = User
    list_display = ("id", "username", "email")
    search_fields = ("id", "username", "email")


admin.site.register(User, UserAdmin)