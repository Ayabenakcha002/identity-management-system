from django.db import models
from django.core.validators import MinLengthValidator, EmailValidator, RegexValidator
from django.utils import timezone


class Person(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("inactive", "Inactive"),
        ("archived", "Archived"),
    ]
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ]

    unique_id = models.CharField(max_length=20, unique=True, verbose_name="Unique ID")
    first_name = models.CharField(max_length=50, validators=[MinLengthValidator(2)])
    last_name = models.CharField(max_length=50, validators=[MinLengthValidator(2)])
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=100)
    nationality = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    personal_email = models.EmailField(unique=True, validators=[EmailValidator()])
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(r"^\d+$", message="Phone number must contain only digits.")
        ],
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Meta:
    indexes = [
        models.Index(fields=["unique_id"]),
        models.Index(fields=["first_name", "last_name"]),
        models.Index(fields=["status"]),
    ]


def __str__(self):
    return f"{self.unique_id} - {self.first_name} {self.last_name}"


class Student(models.Model):
    STUDENT_STATUS_CHOICES = [
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("graduated", "Graduated"),
        ("expelled", "Expelled"),
    ]
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    national_id_number = models.CharField(max_length=50, blank=True)
    highschool_diploma = models.JSONField(
        blank=True, null=True
    )  # يخزن {type, year, honors}
    major = models.CharField(max_length=100)
    entry_year = models.PositiveIntegerField()
    student_status = models.CharField(
        max_length=20, choices=STUDENT_STATUS_CHOICES, default="active"
    )
    faculty = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    group = models.CharField(max_length=50, blank=True)
    scholarship = models.BooleanField(default=False)


def __str__(self):
    return f"Student: {self.person.unique_id}"


class Faculty(models.Model):
    RANK_CHOICES = [
        ("professor", "Professor"),
        ("associate", "Associate Professor"),
        ("assistant", "Assistant Professor"),
        ("lecturer", "Lecturer"),
        ("instructor", "Instructor"),
    ]
    EMPLOYMENT_CATEGORY_CHOICES = [
        ("tenured", "Tenured"),
        ("adjunct", "Adjunct/Part-time"),
        ("visiting", "Visiting Researcher"),
    ]
    CONTRACT_TYPE_CHOICES = [
        ("permanent", "Permanent"),
        ("temporary", "Temporary"),
        ("hourly", "Hourly"),
    ]
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    rank = models.CharField(max_length=20, choices=RANK_CHOICES)
    employment_category = models.CharField(
        max_length=20, choices=EMPLOYMENT_CATEGORY_CHOICES
    )
    appointment_start_date = models.DateField()
    primary_department = models.CharField(max_length=100)
    secondary_departments = models.TextField(
        blank=True, help_text="Comma separated departments"
    )
    office = models.CharField(max_length=100, blank=True)
    phd_institution = models.CharField(max_length=200, blank=True)
    research_areas = models.TextField(blank=True)
    habilitation = models.BooleanField(default=False)
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE_CHOICES)
    contract_start_date = models.DateField()
    contract_end_date = models.DateField(blank=True, null=True)
    teaching_hours = models.PositiveIntegerField(default=0)


def __str__(self):
    return f"Faculty: {self.person.unique_id}"


class Staff(models.Model):
    GRADE_CHOICES = [
        ("1", "Grade 1"),
        ("2", "Grade 2"),
        ("3", "Grade 3"),
    ]
    person = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True)
    assigned_department = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    grade = models.CharField(max_length=10, choices=GRADE_CHOICES)
    entry_date = models.DateField()


def __str__(self):
    return f"Staff: {self.person.unique_id}"


class StatusHistory(models.Model):
    person = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="status_history"
    )
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_at = models.DateTimeField(default=timezone.now)
    reason = models.TextField(blank=True)


class Meta:
    ordering = ["-changed_at"]


def __str__(self):
    return f"{self.person.unique_id}: {self.old_status} -> {self.new_status} at {self.changed_at}"


class IdentityLink(models.Model):
    RELATIONSHIP_CHOICES = [
        ("was_student", "Was student"),
        ("same_person", "Same person"),
    ]
    person = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="links_from"
    )
    linked_person = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="links_to"
    )
    relationship_type = models.CharField(
        max_length=20, choices=RELATIONSHIP_CHOICES, default="was_student"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Meta:
    unique_together = ("person", "linked_person")


def __str__(self):
    return f"{self.person.unique_id} linked to {self.linked_person.unique_id} ({self.relationship_type})"
