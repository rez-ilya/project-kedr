from users.models import CustomUser
from django.db.models import  Q
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model



class CustomAuthBackend(ModelBackend):
    supports_object_permissions = True
    supports_anonymous_users = False
    supports_inactive_users = False


    def get_user(self, user_id):
        userModel = get_user_model()
        try:
            return CustomUser.objects.get(pk=user_id)
        except userModel.DoesNotExist:
            return  None

    def authenticate(self, request, username=None, email=None, phone_number=None, password=None, **kwargs):
        userModel = get_user_model()
        try:
            # Проверяем по email или телефону
            if email:
                user = userModel.objects.get(email=email)
            elif phone_number:
                user = userModel.objects.get(phone_number=phone_number)
            else:
                return None
        except userModel.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None