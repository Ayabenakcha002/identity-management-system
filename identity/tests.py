from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils import timezone
from datetime import date
from .models import Person, Student, Faculty, Staff, StatusHistory, IdentityLink


class PersonModelTest(TestCase):

    def setUp(self):

        self.person = Person.objects.create(
            unique_id="STU202600001",
            first_name="Ahmed",
            last_name="Benali",
            date_of_birth=date(2000, 5, 15),
            place_of_birth="Algiers",
            nationality="Algerian",
            gender="M",
            personal_email="ahmed.benali@example.com",
            phone="0555123456",
            status="pending",
        )

    def test_create_person(self):

        self.assertEqual(Person.objects.count(), 1)
        self.assertEqual(self.person.first_name, "Ahmed")
        self.assertEqual(self.person.personal_email, "ahmed.benali@example.com")

    def test_unique_email_constraint(self):

        with self.assertRaises(IntegrityError):
            Person.objects.create(
                unique_id="STU202600002",
                first_name="Mohamed",
                last_name="Salah",
                date_of_birth=date(2001, 3, 10),
                place_of_birth="Oran",
                nationality="Algerian",
                gender="M",
                personal_email="ahmed.benali@example.com",
                phone="0666123456",
                status="pending",
            )

    def test_first_name_min_length(self):

        person = Person(
            unique_id="STU202600003",
            first_name="A",
            last_name="Khelifi",
            date_of_birth=date(2002, 7, 20),
            place_of_birth="Constantine",
            nationality="Algerian",
            gender="F",
            personal_email="a.khelifi@example.com",
            phone="0777123456",
            status="pending",
        )

        with self.assertRaises(ValidationError):
            person.full_clean()

    def test_phone_digits_only(self):

        person = Person(
            unique_id="STU202600004",
            first_name="Sami",
            last_name="Mansouri",
            date_of_birth=date(2000, 1, 1),
            place_of_birth="Annaba",
            nationality="Algerian",
            gender="M",
            personal_email="sami.m@example.com",
            phone="0555-123-456",
            status="pending",
        )

        with self.assertRaises(ValidationError):
            person.full_clean()


class StudentModelTest(TestCase):

    def setUp(self):
        self.person = Person.objects.create(
            unique_id="STU202600005",
            first_name="Nadia",
            last_name="Bensalem",
            date_of_birth=date(2002, 8, 12),
            place_of_birth="Blida",
            nationality="Algerian",
            gender="F",
            personal_email="nadia.b@example.com",
            phone="0666123789",
            status="active",
        )

    def test_create_student(self):

        student = Student.objects.create(
            person=self.person,
            national_id_number="123456789",
            highschool_diploma={"type": "Bac", "year": 2020, "honors": "Good"},
            major="Computer Science",
            entry_year=2020,
            student_status="active",
            faculty="Science",
            department="CS",
            group="A",
            scholarship=True,
        )
        self.assertEqual(student.person.first_name, "Nadia")
        self.assertEqual(student.major, "Computer Science")
        self.assertTrue(student.scholarship)

    def test_one_to_one_relation(self):

        Student.objects.create(
            person=self.person,
            national_id_number="123456789",
            major="CS",
            entry_year=2020,
            student_status="active",
            faculty="Science",
            department="CS",
        )

        with self.assertRaises(IntegrityError):
            Student.objects.create(
                person=self.person,
                national_id_number="987654321",
                major="Math",
                entry_year=2021,
                student_status="active",
                faculty="Science",
                department="Math",
            )


class StatusHistoryTest(TestCase):

    def setUp(self):
        self.person = Person.objects.create(
            unique_id="STU202600006",
            first_name="Karim",
            last_name="Dahmani",
            date_of_birth=date(1999, 4, 22),
            place_of_birth="Tizi Ouzou",
            nationality="Algerian",
            gender="M",
            personal_email="karim.d@example.com",
            phone="0777123987",
            status="pending",
        )

    def test_status_history_creation(self):

        history = StatusHistory.objects.create(
            person=self.person,
            old_status="pending",
            new_status="active",
            reason="Verification completed",
        )
        self.assertEqual(history.person, self.person)
        self.assertEqual(history.old_status, "pending")
        self.assertEqual(history.new_status, "active")
        self.assertIsNotNone(history.changed_at)
