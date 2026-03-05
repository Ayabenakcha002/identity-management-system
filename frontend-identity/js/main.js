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

    // Type-specific fields
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
                 <option value="pending" selected>Pending</option>
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
        html += `
        <h5 class="mt-3">Faculty Details</h5>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="rank" class="form-label">Rank</label>
                <select class="form-select" id="rank" required>
                    <option value="professor">Professor</option>
                    <option value="associate">Associate Professor</option>
                    <option value="assistant">Assistant Professor</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="instructor">Instructor</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="employment-category" class="form-label">Employment Category</label>
                <select class="form-select" id="employment-category" required>
                    <option value="tenured">Tenured</option>
                    <option value="adjunct">Adjunct/Part-time</option>
                    <option value="visiting">Visiting Researcher</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="appointment-start" class="form-label">Appointment Start Date</label>
                <input type="date" class="form-control" id="appointment-start" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="primary-dept" class="form-label">Primary Department</label>
                <input type="text" class="form-control" id="primary-dept" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mb-3">
                <label for="secondary-depts" class="form-label">Secondary Departments (comma separated)</label>
                <input type="text" class="form-control" id="secondary-depts">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="office" class="form-label">Office (building/floor/room)</label>
                <input type="text" class="form-control" id="office">
            </div>
            <div class="col-md-6 mb-3">
                <label for="phd-institution" class="form-label">PhD Institution</label>
                <input type="text" class="form-control" id="phd-institution">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mb-3">
                <label for="research-areas" class="form-label">Research Areas</label>
                <textarea class="form-control" id="research-areas" rows="2"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="habilitation">
                    <label class="form-check-label" for="habilitation">Habilitation to Supervise Research</label>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="contract-type" class="form-label">Contract Type</label>
                <select class="form-select" id="contract-type" required>
                    <option value="permanent">Permanent</option>
                    <option value="temporary">Temporary</option>
                    <option value="hourly">Hourly</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="contract-start" class="form-label">Contract Start Date</label>
                <input type="date" class="form-control" id="contract-start" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="contract-end" class="form-label">Contract End Date</label>
                <input type="date" class="form-control" id="contract-end">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="teaching-hours" class="form-label">Teaching Hours</label>
                <input type="number" class="form-control" id="teaching-hours" min="0" value="0">
            </div>
        </div>
        `;
    } else if (type === 'staff') {
        html += `
        <h5 class="mt-3">Staff Details</h5>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="assigned-dept" class="form-label">Assigned Department</label>
                <input type="text" class="form-control" id="assigned-dept" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="job-title" class="form-label">Job Title</label>
                <input type="text" class="form-control" id="job-title" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="grade" class="form-label">Grade</label>
                <select class="form-select" id="grade" required>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="entry-date" class="form-label">Entry Date</label>
                <input type="date" class="form-control" id="entry-date" required>
            </div>
        </div>
        `;
    }

    container.innerHTML = html;
}
// Submit form to API
async function submitCreateForm() {
    const type = document.getElementById('person-type').value;
    if (!type) return;

    // Common data
    const personData = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        date_of_birth: document.getElementById('dob').value,
        place_of_birth: document.getElementById('place-of-birth').value,
        nationality: document.getElementById('nationality').value,
        gender: document.getElementById('gender').value,
        personal_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        status: 'pending'
    };

    // Type-specific data
    let specificData = {};
    if (type === 'student') {
        specificData = {
            national_id_number: document.getElementById('national-id')?.value || '',
            major: document.getElementById('major')?.value,
            entry_year: parseInt(document.getElementById('entry-year')?.value),
            student_status: document.getElementById('student-status')?.value,
            faculty: document.getElementById('faculty')?.value,
            department: document.getElementById('department')?.value,
            group: document.getElementById('group')?.value || '',
            scholarship: document.getElementById('scholarship')?.checked || false
        };
    } else if (type === 'faculty') {
        specificData = {
            rank: document.getElementById('rank')?.value,
            employment_category: document.getElementById('employment-category')?.value,
            appointment_start_date: document.getElementById('appointment-start')?.value,
            primary_department: document.getElementById('primary-dept')?.value,
            secondary_departments: document.getElementById('secondary-depts')?.value,
            office: document.getElementById('office')?.value || '',
            phd_institution: document.getElementById('phd-institution')?.value || '',
            research_areas: document.getElementById('research-areas')?.value || '',
            habilitation: document.getElementById('habilitation')?.checked || false,
            contract_type: document.getElementById('contract-type')?.value,
            contract_start_date: document.getElementById('contract-start')?.value,
            contract_end_date: document.getElementById('contract-end')?.value || null,
            teaching_hours: parseInt(document.getElementById('teaching-hours')?.value) || 0
        };
    } else if (type === 'staff') {
        specificData = {
            assigned_department: document.getElementById('assigned-dept')?.value,
            job_title: document.getElementById('job-title')?.value,
            grade: document.getElementById('grade')?.value,
            entry_date: document.getElementById('entry-date')?.value
        };
    }

    // Prepare payload
    const payload = {
        person_type: type,
        ...personData,
        [`${type}_data`]: specificData
    };

    const resultDiv = document.getElementById('create-result');
    resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/persons/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `<div class="alert alert-success">
                Identity created successfully! Unique ID: <strong>${data.unique_id}</strong>
            </div>`;
            document.getElementById('create-form').reset();
            loadTypeFields('');
        } else {
            let errorMsg = 'Error: ';
            if (typeof data === 'object') errorMsg += Object.values(data).flat().join(', ');
            else errorMsg += data;
            resultDiv.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Network error: ${error.message}</div>`;
    }
}

// Display search page
function showSearchPage() {
    mainContent.innerHTML = `
    <div class="card">
        <div class="card-header">Search Identities</div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-8">
                    <input type="text" class="form-control" id="search-query" placeholder="Search by name, email, ID...">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-primary w-100" id="search-btn">Search</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-3">
                    <select class="form-select" id="filter-type">
                        <option value="">All Types</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filter-status">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control" id="filter-year" placeholder="Entry year">
                </div>
                <div class="col-md-3">
                    <button class="btn btn-secondary w-100" id="clear-filters">Clear</button>
                </div>
            </div>
        </div>
    </div>
    <div id="search-results" class="mt-3"></div>
    `;

    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('search-query').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Perform search
async function performSearch() {
    const query = document.getElementById('search-query').value;
    const type = document.getElementById('filter-type').value;
    const status = document.getElementById('filter-status').value;
    const year = document.getElementById('filter-year').value;

    let url = `${API_BASE_URL}/persons/search/?q=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    if (status) url += `&status=${status}`;
    if (year) url += `&year=${year}`;

    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

    try {
        const response = await fetch(url);
        const persons = await response.json();

        if (persons.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-info">No results found.</div>';
            return;
        }

        let tableHtml = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Type</th><th>Status</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
        `;

        persons.forEach(p => {
            let typeLabel = p.student ? 'Student' : p.faculty ? 'Faculty' : p.staff ? 'Staff' : 'Person';
            tableHtml += `
                <tr>
                    <td>${p.unique_id}</td>
                    <td>${p.first_name} ${p.last_name}</td>
                    <td>${p.personal_email}</td>
                    <td>${typeLabel}</td>
                    <td><span class="badge bg-${getStatusBadgeColor(p.status)}">${p.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info view-btn" data-id="${p.id}">View</button>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${p.id}">Edit</button>
                        <button class="btn btn-sm btn-secondary status-btn" data-id="${p.id}">Change Status</button>
                    </td>
                </tr>
            `;
        });

        tableHtml += '</tbody></table>';
        resultsDiv.innerHTML = tableHtml;

        document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => viewPerson(btn.dataset.id)));
        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => editPerson(btn.dataset.id)));
        document.querySelectorAll('.status-btn').forEach(btn => btn.addEventListener('click', () => changeStatus(btn.dataset.id)));

    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

// Map status to badge color
function getStatusBadgeColor(status) {
    switch(status) {
        case 'pending': return 'warning';
        case 'active': return 'success';
        case 'suspended': return 'danger';
        case 'inactive': return 'secondary';
        case 'archived': return 'dark';
        default: return 'primary';
    }
}

// Clear filters and search again
function clearFilters() {
    document.getElementById('search-query').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-year').value = '';
    performSearch();
}

// View person details
async function viewPerson(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/persons/${id}/`);
        const person = await response.json();

        let details = `
        <div class="card">
            <div class="card-header">Person Details: ${person.unique_id}</div>
            <div class="card-body">
                <p><strong>Name:</strong> ${person.first_name} ${person.last_name}</p>
                <p><strong>Date of Birth:</strong> ${person.date_of_birth}</p>
                <p><strong>Place of Birth:</strong> ${person.place_of_birth}</p>
                <p><strong>Nationality:</strong> ${person.nationality}</p>
                <p><strong>Gender:</strong> ${person.gender}</p>
                <p><strong>Email:</strong> ${person.personal_email}</p>
                <p><strong>Phone:</strong> ${person.phone}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusBadgeColor(person.status)}">${person.status}</span></p>
                <p><strong>Created At:</strong> ${person.created_at}</p>
                <p><strong>Updated At:</strong> ${person.updated_at}</p>
            </div>
        </div>
        `;

        if (person.student) {
            const s = person.student;
            details += `
            <div class="card mt-3">
                <div class="card-header">Student Details</div>
                <div class="card-body">
                    <p><strong>National ID:</strong> ${s.national_id_number || 'N/A'}</p>
                    <p><strong>Major:</strong> ${s.major}</p>
                    <p><strong>Entry Year:</strong> ${s.entry_year}</p>
                    <p><strong>Status:</strong> ${s.student_status}</p>
                    <p><strong>Faculty:</strong> ${s.faculty}</p>
                    <p><strong>Department:</strong> ${s.department}</p>
                    <p><strong>Group:</strong> ${s.group || 'N/A'}</p>
                    <p><strong>Scholarship:</strong> ${s.scholarship ? 'Yes' : 'No'}</p>
                </div>
            </div>
            `;
        } else if (person.faculty) {
            const f = person.faculty;
            details += `
            <div class="card mt-3">
                <div class="card-header">Faculty Details</div>
                <div class="card-body">
                    <p><strong>Rank:</strong> ${f.rank}</p>
                    <p><strong>Employment Category:</strong> ${f.employment_category}</p>
                    <p><strong>Appointment Start:</strong> ${f.appointment_start_date}</p>
                    <p><strong>Primary Department:</strong> ${f.primary_department}</p>
                    <p><strong>Secondary Departments:</strong> ${f.secondary_departments || 'N/A'}</p>
                    <p><strong>Office:</strong> ${f.office || 'N/A'}</p>
                    <p><strong>PhD Institution:</strong> ${f.phd_institution || 'N/A'}</p>
                    <p><strong>Research Areas:</strong> ${f.research_areas || 'N/A'}</p>
                    <p><strong>Habilitation:</strong> ${f.habilitation ? 'Yes' : 'No'}</p>
                    <p><strong>Contract Type:</strong> ${f.contract_type}</p>
                    <p><strong>Contract Start:</strong> ${f.contract_start_date}</p>
                    <p><strong>Contract End:</strong> ${f.contract_end_date || 'N/A'}</p>
                    <p><strong>Teaching Hours:</strong> ${f.teaching_hours}</p>
                </div>
            </div>
            `;
        } else if (person.staff) {
            const s = person.staff;
            details += `
            <div class="card mt-3">
                <div class="card-header">Staff Details</div>
                <div class="card-body">
                    <p><strong>Assigned Department:</strong> ${s.assigned_department}</p>
                    <p><strong>Job Title:</strong> ${s.job_title}</p>
                    <p><strong>Grade:</strong> ${s.grade}</p>
                    <p><strong>Entry Date:</strong> ${s.entry_date}</p>
                </div>
            </div>
            `;
        }

        mainContent.innerHTML = details + '<button class="btn btn-secondary mt-3" onclick="showSearchPage()">Back to Search</button>';
    } catch (error) {
        alert('Error loading details: ' + error.message);
    }
}

// Change status
async function changeStatus(id) {
    const newStatus = prompt('Enter new status (pending, active, suspended, inactive, archived):');
    if (!newStatus) return;

    const reason = prompt('Enter reason (optional):') || '';

    try {
        const response = await fetch(`${API_BASE_URL}/persons/${id}/change-status/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, reason })
        });

        if (response.ok) {
            alert('Status updated successfully');
            performSearch();
        } else {
            const error = await response.json();
            alert('Error: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

// Edit person (simplified placeholder)
function editPerson(id) {
    alert('Edit functionality - to be implemented.');
}
