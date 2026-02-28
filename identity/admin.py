from django.contrib import admin
from .models import Person, Student, Faculty, Staff, StatusHistory, IdentityLink


admin.site.register(Person)
admin.site.register(Student)
admin.site.register(Faculty)
admin.site.register(Staff)
admin.site.register(StatusHistory)
admin.site.register(IdentityLink)


