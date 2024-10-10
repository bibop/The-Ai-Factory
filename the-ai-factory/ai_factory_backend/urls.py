from django.contrib import admin
from django.urls import path, include
# Import views from the users app, not ai_factory_backend
from users import views, csrf

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),  # Include the URLs from the users app
]