from django.contrib import admin

from .models import Task, DateRecord

admin.site.register(Task)

admin.site.register(DateRecord)