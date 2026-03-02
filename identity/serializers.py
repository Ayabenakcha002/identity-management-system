from rest_framework import serializers
from datetime import date
from .models import Person, Student, Faculty, Staff, StatusHistory, IdentityLink
from .utils import generate_unique_id


# ============================================================
# 🔐 IDENTITY LIFE CYCLE RULES
# ============================================================

# Allowed transitions between statuses
ALLOWED_STATUS_TRANSITIONS = {
    'pending': ['active'],                  # After verification
    'active': ['suspended', 'inactive'],    # Admin decision OR end of affiliation
    'suspended': ['active'],                # After resolution
    'inactive': ['archived'],               # After 5 years
    'archived': []                          # Final state (no transitions allowed)
}


# ============================================================
# 🧍 PERSON SERIALIZER
# ============================================================

class PersonSerializer(serializers.ModelSerializer):
    """
    Main serializer for Person model.
    Handles:
    - Field validations
    - Age validation (for students)
    - Unique ID generation
    - Creation of related role (Student/Faculty/Staff)
    - Automatic first status (Pending)
    """

    # Nested role-specific data (write only)
    student_data = serializers.JSONField(write_only=True, required=False)
    faculty_data = serializers.JSONField(write_only=True, required=False)
    staff_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Person
        fields = '__all__'
        read_only_fields = ['unique_id', 'created_at', 'updated_at']


    # ========================================================
    # 🔎 FIELD VALIDATIONS
    # ========================================================

    def validate_first_name(self, value):
        """First name must be at least 2 characters."""
        if len(value) < 2:
            raise serializers.ValidationError(
                "First name must be at least 2 characters."
            )
        return value

    def validate_last_name(self, value):
        """Last name must be at least 2 characters."""
        if len(value) < 2:
            raise serializers.ValidationError(
                "Last name must be at least 2 characters."
            )
        return value

    def validate_phone(self, value):
        """Phone number must contain digits only."""
        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits."
            )
        return value

    def validate_date_of_birth(self, value):
        """Date of birth cannot be in the future."""
        if value > date.today():
            raise serializers.ValidationError(
                "Date of birth cannot be in the future."
            )
        return value

    def validate_personal_email(self, value):
        """Ensure personal email is unique."""
        if Person.objects.filter(personal_email=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )
        return value


    # ========================================================
    # 🔎 OBJECT-LEVEL VALIDATION
    # ========================================================

    def validate(self, attrs):
        """
        Global validation:
        - Students must be at least 16 years old
        """
        request = self.context.get('request')
        person_type = request.data.get('person_type') if request else None

        if person_type == 'student':
            dob = attrs.get('date_of_birth')
            if dob:
                age = (date.today() - dob).days // 365
                if age < 16:
                    raise serializers.ValidationError(
                        "Student must be at least 16 years old."
                    )

        return attrs


    # ========================================================
    # 🏗 CREATE METHOD
    # ========================================================

    def create(self, validated_data):
        """
        Creates:
        1️⃣ Person
        2️⃣ Related role (Student / Faculty / Staff)
        3️⃣ Initial StatusHistory record (Pending)
        """

        # Extract nested role data
        student_data = validated_data.pop('student_data', None)
        faculty_data = validated_data.pop('faculty_data', None)
        staff_data = validated_data.pop('staff_data', None)

        # Get person type from request
        request = self.context.get('request')
        person_type = request.data.get('person_type') if request else 'student'

        # Generate unique ID before saving
        validated_data['unique_id'] = generate_unique_id(person_type)

        # Force first status to be Pending
        validated_data['status'] = Person.STATUS_PENDING

        # Create base Person
        person = Person.objects.create(**validated_data)

        # Create role-specific record
        if person_type == 'student' and student_data:
            Student.objects.create(person=person, **student_data)

        elif person_type == 'faculty' and faculty_data:
            Faculty.objects.create(person=person, **faculty_data)

        elif person_type == 'staff' and staff_data:
            Staff.objects.create(person=person, **staff_data)

        # Create first status history automatically
        StatusHistory.objects.create(
            person=person,
            status=Person.STATUS_PENDING
        )

        return person


# ============================================================
# 🎓 STUDENT SERIALIZER
# ============================================================

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student model.
    Includes nested Person (read-only).
    """
    person = PersonSerializer(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'


# ============================================================
# 👨‍🏫 FACULTY SERIALIZER
# ============================================================

class FacultySerializer(serializers.ModelSerializer):
    """
    Serializer for Faculty model.
    Includes nested Person (read-only).
    """
    person = PersonSerializer(read_only=True)

    class Meta:
        model = Faculty
        fields = '__all__'


# ============================================================
# 🧑‍💼 STAFF SERIALIZER
# ============================================================

class StaffSerializer(serializers.ModelSerializer):
    """
    Serializer for Staff model.
    Includes nested Person (read-only).
    """
    person = PersonSerializer(read_only=True)

    class Meta:
        model = Staff
        fields = '__all__'


# ============================================================
# 🔄 STATUS HISTORY SERIALIZER
# ============================================================

class StatusHistorySerializer(serializers.ModelSerializer):
    """
    Controls status transitions according to lifecycle rules.
    Prevents invalid transitions.
    Updates Person current status automatically.
    """

    def validate(self, attrs):
        """
        Validate that the transition is allowed.
        """
        person = attrs.get('person')
        new_status = attrs.get('status')

        if not person:
            raise serializers.ValidationError("Person is required.")

        current_status = person.status
        allowed_next = ALLOWED_STATUS_TRANSITIONS.get(current_status, [])

        if new_status not in allowed_next:
            raise serializers.ValidationError(
                f"Transition from '{current_status}' "
                f"to '{new_status}' is not allowed."
            )

        return attrs

    def create(self, validated_data):
        """
        When a new StatusHistory is created:
        - Update Person.status automatically
        """
        person = validated_data['person']
        new_status = validated_data['status']

        # Update main Person status
        person.status = new_status
        person.save()

        return super().create(validated_data)

    class Meta:
        model = StatusHistory
        fields = '__all__'


# ============================================================
# 🔗 IDENTITY LINK SERIALIZER
# ============================================================

class IdentityLinkSerializer(serializers.ModelSerializer):
    """
    Serializer for historical identity links between persons.
    """

    class Meta:
        model = IdentityLink
        fields = '__all__'