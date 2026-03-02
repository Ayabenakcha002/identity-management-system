<<<<<<< HEAD
from datetime import datetime
from .models import Person

def generate_unique_id(person_type, person_instance=None):
    """
    Generate a unique identifier for a person based on their type and current year.

    IMPORTANT RULE:
    - The identifier NEVER changes once assigned.
    - If the person changes status (e.g., student → faculty),
      they keep their old unique_id.
    - A new ID is generated ONLY if the person has no ID yet.
    """

    # -------------------------------------------------------
    # 1️⃣  PROTECTION: If person already has an ID, return it
    # -------------------------------------------------------
    if person_instance and person_instance.unique_id:
        # The ID already exists → do NOT regenerate
        return person_instance.unique_id

    # -------------------------------------------------------
    # 2️⃣  Get current year
    # -------------------------------------------------------
    current_year = datetime.now().year

    # -------------------------------------------------------
    # 3️⃣  Mapping of person types to their respective prefixes
    # -------------------------------------------------------
    prefix_map = {
        'student': 'STU',
        'phd': 'PHD',
        'faculty': 'FAC',
        'staff': 'STF',
        'temporary': 'TMP',
    }

    # Default prefix = EXT (External)
    prefix = prefix_map.get(person_type.lower(), 'EXT')

    # -------------------------------------------------------
    # 4️⃣  Find last created person THIS YEAR with same prefix
    # -------------------------------------------------------
    last_person = Person.objects.filter(
        unique_id__startswith=f"{prefix}{current_year}"
    ).order_by('unique_id').last()

    # -------------------------------------------------------
    # 5️⃣  Extract and increment last number
    # -------------------------------------------------------
    if last_person:
        # Take last 5 digits and increment
        last_number = int(last_person.unique_id[-5:])
        new_number = last_number + 1
    else:
        # If none exist → start from 00001
        new_number = 1

    # -------------------------------------------------------
    # 6️⃣  Format final ID
    # Format: PREFIX + YEAR + 5-digit zero padded number
    # Example: STU202600001
    # -------------------------------------------------------
    return f"{prefix}{current_year}{new_number:05d}"

=======
from datetime import datetime
from .models import Person

def generate_unique_id(person_type, person_instance=None):
    """
    Generate a unique identifier for a person based on their type and current year.

    IMPORTANT RULE:
    - The identifier NEVER changes once assigned.
    - If the person changes status (e.g., student → faculty),
      they keep their old unique_id.
    - A new ID is generated ONLY if the person has no ID yet.
    """

    # -------------------------------------------------------
    # 1️⃣  PROTECTION: If person already has an ID, return it
    # -------------------------------------------------------
    if person_instance and person_instance.unique_id:
        # The ID already exists → do NOT regenerate
        return person_instance.unique_id

    # -------------------------------------------------------
    # 2️⃣  Get current year
    # -------------------------------------------------------
    current_year = datetime.now().year

    # -------------------------------------------------------
    # 3️⃣  Mapping of person types to their respective prefixes
    # -------------------------------------------------------
    prefix_map = {
        'student': 'STU',
        'phd': 'PHD',
        'faculty': 'FAC',
        'staff': 'STF',
        'temporary': 'TMP',
    }

    # Default prefix = EXT (External)
    prefix = prefix_map.get(person_type.lower(), 'EXT')

    # -------------------------------------------------------
    # 4️⃣  Find last created person THIS YEAR with same prefix
    # -------------------------------------------------------
    last_person = Person.objects.filter(
        unique_id__startswith=f"{prefix}{current_year}"
    ).order_by('unique_id').last()

    # -------------------------------------------------------
    # 5️⃣  Extract and increment last number
    # -------------------------------------------------------
    if last_person:
        # Take last 5 digits and increment
        last_number = int(last_person.unique_id[-5:])
        new_number = last_number + 1
    else:
        # If none exist → start from 00001
        new_number = 1

    # -------------------------------------------------------
    # 6️⃣  Format final ID
    # Format: PREFIX + YEAR + 5-digit zero padded number
    # Example: STU202600001
    # -------------------------------------------------------
    return f"{prefix}{current_year}{new_number:05d}"

>>>>>>> 95cb936 (Add frontend-identity folder)
