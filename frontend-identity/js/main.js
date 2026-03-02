// Base URL for API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Page elements
const mainContent = document.getElementById('main-content');
const navHome = document.getElementById('nav-home');
const navCreate = document.getElementById('nav-create');
const navSearch = document.getElementById('nav-search');

// Load home page on startup
document.addEventListener('DOMContentLoaded', () => {
    showHome();
});

// Navigation links
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
});

navCreate.addEventListener('click', (e) => {
    e.preventDefault();
    showCreateForm();
});

navSearch.addEventListener('click', (e) => {
    e.preventDefault();
    showSearchPage();
});

// Display home page with quick stats
function showHome() {
    mainContent.innerHTML = `
    <div class="row">
        <div class="col-md-12">
            <h2>Welcome to Identity Management System</h2>
            <p>Use the navigation above to create, search and manage identities.</p>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-4">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <h5 class="card-title">Students</h5>
                    <p class="card-text display-6" id="stat-students">-</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-white bg-success">
                <div class="card-body">
                    <h5 class="card-title">Faculty</h5>
                    <p class="card-text display-6" id="stat-faculty">-</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-white bg-info">
                <div class="card-body">
                    <h5 class="card-title">Staff</h5>
                    <p class="card-text display-6" id="stat-staff">-</p>
                </div>
            </div>
        </div>
    </div>
    `;
    loadStatistics();
}

// Load statistics from API
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/persons/`);
        const persons = await response.json();

        let students = 0, faculty = 0, staff = 0;
        persons.forEach(p => {
            if (p.student) students++;
            if (p.faculty) faculty++;
            if (p.staff) staff++;
        });

        document.getElementById('stat-students').textContent = students;
        document.getElementById('stat-faculty').textContent = faculty;
        document.getElementById('stat-staff').textContent = staff;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Display form to create new identity
function showCreateForm() {
    mainContent.innerHTML = `
    <div class="card">
        <div class="card-header">Create New Identity</div>
        <div class="card-body">
            <form id="create-form">
                <div class="mb-3">
                    <label for="person-type" class="form-label">Person Type</label>
                    <select class="form-select" id="person-type" required>
                        <option value="">Select type...</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
                <div id="type-fields"></div>
                <button type="submit" class="btn btn-primary">Create Identity</button>
            </form>
            <div id="create-result" class="mt-3"></div>
        </div>
    </div>
    `;

    document.getElementById('person-type').addEventListener('change', function() {
        loadTypeFields(this.value);
    });

    document.getElementById('create-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitCreateForm();
    });
}

// Load fields specific to person type
function loadTypeFields(type) {
    const container = document.getElementById('type-fields');
    let html = '';

    // Common fields
    html = `
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="first-name" class="form-label">First Name</label>
            <input type="text" class="form-control" id="first-name" required minlength="2">
        </div>
        <div class="col-md-6 mb-3">
            <label for="last-name" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="last-name" required minlength="2">
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="dob" class="form-label">Date of Birth</label>
            <input type="date" class="form-control" id="dob" required>
        </div>
        <div class="col-md-6 mb-3">
            <label for="place-of-birth" class="form-label">Place of Birth</label>
            <input type="text" class="form-control" id="place-of-birth" required>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="nationality" class="form-label">Nationality</label>
            <input type="text" class="form-control" id="nationality" required>
        </div>
        <div class="col-md-6 mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select class="form-select" id="gender" required>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required>
        </div>
        <div class="col-md-6 mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input type="tel" class="form-control" id="phone" required pattern="\\d*">
        </div>
    </div>
    `;

    // Fields by type
    if (type === 'student') {
        html += `
        <h5 class="mt-3">Student Details</h5>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="national-id" class="form-label">National ID Number</label>
                <input type="text" class="form-control" id="national-id">
            </div>
            <div class="col-md-6 mb-3">
                <label for="major" class="form-label">Major</label>
                <input type="text" class="form-control" id="major" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="entry-year" class="form-label">Entry Year</label>
                <input type="number" class="form-control" id="entry-year" required min="2000" max="2100">
            </div>
            <div class="col-md-6 mb-3">
                <label for="student-status" class="form-label">Student Status</label>
                <select class="form-select" id="student-status" required>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                    <option value="expelled">Expelled</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="faculty" class="form-label">Faculty</label>
                <input type="text" class="form-control" id="faculty" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="department" class="form-label">Department</label>
                <input type="text" class="form-control" id="department" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="group" class="form-label">Group</label>
                <input type="text" class="form-control" id="group">
            </div>
            <div class="col-md-6 mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="scholarship">
                    <label class="form-check-label" for="scholarship">Scholarship</label>
                </div>
            </div>
        </div>
        `;
    } else if (type === 'faculty') {
        html += `<h5 class="mt-3">Faculty Details</h5> ...`; // abbreviated here
    } else if (type === 'staff') {
        html += `<h5 class="mt-3">Staff Details</h5> ...`; // abbreviated here
    }

    container.innerHTML = html;
}

// Submit create form to API
async function submitCreateForm() {
    const type = document.getElementById('person-type').value;
    if (!type) return;

    const personData = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        date_of_birth: document.getElementById('dob').value,
        place_of_birth: document.getElementById('place-of-birth').value,
        nationality: document.getElementById('nationality').value,
        gender: document.getElementById('gender').value,
        personal_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        status: 'pending',
    };

    let specificData = {};
    if (type === 'student') {
        specificData = { /* student fields */ };
    } else if (type === 'faculty') {
        specificData = { /* faculty fields */ };
    } else if (type === 'staff') {
        specificData = { /* staff fields */ };
    }

    const payload = {
        person_type: type,
        ...personData,
        [`${type}_data`]: specificData,
    };

    const resultDiv = document.getElementById('create-result');
    resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/persons/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
            <div class="alert alert-success">
                Identity created successfully! Unique ID: <strong>${data.unique_id}</strong>
            </div>`;
            document.getElementById('create-form').reset();
            loadTypeFields('');
        } else {
            let errorMsg = 'Error: ';
            if (typeof data === 'object') {
                errorMsg += Object.values(data).flat().join(', ');
            } else {
                errorMsg += data;
            }
            resultDiv.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Network error: ${error.message}</div>`;
    }
}

// Other functions: showSearchPage, performSearch, viewPerson, changeStatus, editPerson
// (keep the same structure, only remove Arabic comments)