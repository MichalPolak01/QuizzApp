from django.contrib import admin

from .models import Quiz
# Register your models here.
# class UserAdmin(UserAdmin):
#     model = User
#     list_display = ("id", "username", "email")
#     search_fields = ("id", "username", "email")


admin.site.register(Quiz)