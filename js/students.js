function pageInit() {
    renderStudentsPage();
}

function renderStudentsPage() {
    const container = document.getElementById('main-content');
    if (!container) return;
    const students = getData(KEYS.STUDENTS);
    const classes = [...new Set(students.map(s => s.class))].sort((a, b) => a - b);
    const sections = [...new Set(students.map(s => s.section))].sort();

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">Students</h1>
                <p class="page-subtitle">Manage student records</p>
            </div>
            <button class="btn btn-primary" onclick="openAddStudentModal()">
                ${SVG_ICONS.plus} <span>Add Student</span>
            </button>
        </div>
        <div class="filters-bar">
            <div class="search-box">
                <span class="search-icon">${SVG_ICONS.search}</span>
                <input type="text" id="student-search" placeholder="Search by name or roll number..." oninput="filterStudents()">
            </div>
            <select id="filter-class" onchange="filterStudents()">
                <option value="">All Classes</option>
                ${classes.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
            </select>
            <select id="filter-section" onchange="filterStudents()">
                <option value="">All Sections</option>
                ${sections.map(s => `<option value="${s}">Section ${s}</option>`).join('')}
            </select>
        </div>
        <div class="student-count" id="student-count">Showing ${students.length} of ${students.length} students</div>
        <div class="table-wrapper" id="students-table-wrapper">
            ${renderStudentsTable(students)}
        </div>`;
}

function renderStudentsTable(students) {
    if (students.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">${SVG_ICONS.students}</div>
                <h3>No students yet</h3>
                <p>Add your first student to get started!</p>
                <button class="btn btn-primary" onclick="openAddStudentModal()">${SVG_ICONS.plus} Add Student</button>
            </div>`;
    }
    return `
        <table class="data-table" id="students-table">
            <thead>
                <tr>
                    <th>#</th><th>Name</th><th>Roll No</th><th>Class</th><th>Section</th><th>Gender</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map((s, i) => `
                    <tr onclick="viewStudentReport('${s.id}')" class="clickable-row">
                        <td>${i + 1}</td>
                        <td><div class="student-name-cell"><div class="avatar-sm">${s.profilePic ? `<img src="${s.profilePic}" alt="Profile" class="avatar-img-round">` : s.name.charAt(0)}</div>${s.name}</div></td>
                        <td><code>${s.rollNo}</code></td>
                        <td>${s.class}</td>
                        <td>${s.section}</td>
                        <td>${s.gender}</td>
                        <td class="actions-cell" onclick="event.stopPropagation()">
                            <button class="btn-icon btn-icon-edit" onclick="openEditStudentModal('${s.id}')" title="Edit">${SVG_ICONS.edit}</button>
                            <button class="btn-icon btn-icon-delete" onclick="deleteStudent('${s.id}', '${s.name}')" title="Delete">${SVG_ICONS.trash}</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

function filterStudents() {
    const query = document.getElementById('student-search').value.toLowerCase();
    const classFilter = document.getElementById('filter-class').value;
    const sectionFilter = document.getElementById('filter-section').value;
    const allStudents = getData(KEYS.STUDENTS);

    const filtered = allStudents.filter(s => {
        const matchesSearch = !query || s.name.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query);
        const matchesClass = !classFilter || s.class === classFilter;
        const matchesSection = !sectionFilter || s.section === sectionFilter;
        return matchesSearch && matchesClass && matchesSection;
    });

    document.getElementById('students-table-wrapper').innerHTML = renderStudentsTable(filtered);
    document.getElementById('student-count').textContent = `Showing ${filtered.length} of ${allStudents.length} students`;
}

function getStudentFormHTML(student = null) {
    const isEdit = !!student;
    return `
        <form id="student-form" onsubmit="saveStudent(event, ${isEdit ? `'${student.id}'` : 'null'})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="sf-name" value="${isEdit ? student.name : ''}" required placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label>Roll Number <span class="required">*</span></label>
                    <input type="text" id="sf-rollno" value="${isEdit ? student.rollNo : ''}" required placeholder="e.g. STU009">
                </div>
                <div class="form-group">
                    <label>Class <span class="required">*</span></label>
                    <select id="sf-class" required>
                        <option value="">Select Class</option>
                        ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${isEdit && student.class == (i + 1) ? 'selected' : ''}>Class ${i + 1}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Section <span class="required">*</span></label>
                    <select id="sf-section" required>
                        <option value="">Select Section</option>
                        ${['A', 'B', 'C', 'D', 'E'].map(s => `<option value="${s}" ${isEdit && student.section === s ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Gender <span class="required">*</span></label>
                    <select id="sf-gender" required>
                        <option value="">Select Gender</option>
                        ${['Male', 'Female', 'Other'].map(g => `<option value="${g}" ${isEdit && student.gender === g ? 'selected' : ''}>${g}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Parent Contact <span class="required">*</span></label>
                    <input type="tel" id="sf-contact" value="${isEdit ? (student.parentContact || '') : ''}" required placeholder="Phone number (10 digits)" pattern="[0-9]{10,15}">
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" id="sf-email" value="${isEdit ? (student.email || '') : ''}" required placeholder="student@gmail.com" pattern=".*(@gmail\.com|@\.in)" title="Please enter a valid @gmail.com or @.in address">
                </div>
                <div class="form-group">
                    <label>Login Password <span class="required">*</span></label>
                    <input type="text" id="sf-password" value="${isEdit ? (student.password || '') : ''}" required placeholder="Set password for student login">
                </div>
                <div class="form-group">
                    <label>Blood Group <span class="required">*</span></label>
                    <select id="sf-bloodGroup" required>
                        <option value="">Select Blood Group</option>
                        ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => `<option value="${bg}" ${isEdit && student.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Emergency Contact <span class="required">*</span></label>
                    <input type="tel" id="sf-emergency" value="${isEdit ? (student.emergencyContact || '') : ''}" required placeholder="Emergency phone" pattern="[0-9]{10,15}">
                </div>
                <div class="form-group full-width" style="display: flex; align-items: center; gap: 20px; background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 8px;">
                    <div class="profile-setup-mini" style="position:relative">
                        <div class="avatar-sm" id="sf-avatar-preview" style="width: 60px; height: 60px; font-size: 1.2rem; border: 2px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center">
                            ${isEdit && student.profilePic ? `<img src="${student.profilePic}" alt="Profile" class="avatar-img-round">` : (isEdit ? student.name.charAt(0) : '?')}
                        </div>
                        <input type="file" id="sf-pic-input" style="display: none" accept="image/*" onchange="handleStudentFormPic(this)">
                        <button type="button" class="btn-logout" style="position: absolute; bottom: -5px; right: -5px; padding: 4px; border-radius: 50%; width: 22px; height: 22px; justify-content: center" onclick="document.getElementById('sf-pic-input').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 12px; height: 12px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </button>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 0.9rem">${isEdit ? 'Update Student Picture' : 'Add Student Picture'}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted)">Recommended: Square image, max 1MB</div>
                    </div>
                    <input type="hidden" id="sf-profilePic" value="${isEdit && student.profilePic ? student.profilePic : ''}">
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Add'} Student</button>
            </div>
        </form>`;
}

function openAddStudentModal() {
    openModal('Add New Student', getStudentFormHTML());
}

function openEditStudentModal(id) {
    const students = getData(KEYS.STUDENTS);
    const student = students.find(s => s.id === id);
    if (!student) return;
    openModal('Edit Student', getStudentFormHTML(student));
}

function saveStudent(event, editId) {
    event.preventDefault();
    const name = document.getElementById('sf-name').value.trim();
    const rollNo = document.getElementById('sf-rollno').value.trim();
    const cls = document.getElementById('sf-class').value;
    const section = document.getElementById('sf-section').value;
    const gender = document.getElementById('sf-gender').value;
    const parentContact = document.getElementById('sf-contact').value.trim();
    const email = document.getElementById('sf-email').value.trim();
    const password = document.getElementById('sf-password').value.trim();
    const bloodGroup = document.getElementById('sf-bloodGroup').value;
    const emergencyContact = document.getElementById('sf-emergency').value.trim();
    const profilePic = document.getElementById('sf-profilePic').value;

    if (!name || !rollNo || !cls || !section || !gender || !parentContact || !email || !password || !bloodGroup || !emergencyContact) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (!email.toLowerCase().endsWith('@gmail.com') && !email.toLowerCase().endsWith('@.in')) {
        showToast('Only @gmail.com or @.in email addresses are allowed', 'error');
        return;
    }

    const students = getData(KEYS.STUDENTS);

    // Check for duplicate roll number
    const dup = students.find(s => s.rollNo === rollNo && s.id !== editId);
    if (dup) {
        showToast('Roll number already exists!', 'error');
        return;
    }

    if (editId) {
        const idx = students.findIndex(s => s.id === editId);
        if (idx >= 0) {
            students[idx] = { ...students[idx], name, rollNo, class: cls, section, gender, parentContact, email, password, bloodGroup, emergencyContact, profilePic };
            showToast(`Student "${name}" updated successfully`, 'success');
            logActivity(`Student "${name}" (${rollNo}) updated`);
        }
    } else {
        students.push({
            id: generateId(), name, rollNo, class: cls, section, gender,
            parentContact, email, password, bloodGroup, emergencyContact, profilePic, createdAt: new Date().toISOString()
        });
        showToast(`Student "${name}" added successfully`, 'success');
        logActivity(`Student "${name}" added to Class ${cls}-${section}`);
    }

    setData(KEYS.STUDENTS, students);
    closeModal();
    renderStudentsPage();
}

function deleteStudent(id, name) {
    showConfirm(`Are you sure you want to delete <strong>${name}</strong>? This will also remove their marks and attendance records.`, () => {
        let students = getData(KEYS.STUDENTS);
        students = students.filter(s => s.id !== id);
        setData(KEYS.STUDENTS, students);
        let marks = getData(KEYS.MARKS);
        marks = marks.filter(m => m.studentId !== id);
        setData(KEYS.MARKS, marks);

        let attendance = getData(KEYS.ATTENDANCE);
        attendance = attendance.map(a => ({
            ...a, records: a.records.filter(r => r.studentId !== id)
        }));
        setData(KEYS.ATTENDANCE, attendance);

        showToast(`Student "${name}" deleted`, 'success');
        logActivity(`Student "${name}" deleted`);
        renderStudentsPage();
    });
}

function handleStudentFormPic(input) {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
        showToast('Image size should be less than 1MB', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('sf-profilePic').value = base64;
        document.getElementById('sf-avatar-preview').innerHTML = `<img src="${base64}" alt="Profile" class="avatar-img-round">`;
    };
    reader.readAsDataURL(file);
}

function viewStudentReport(studentId) {
    window.location.href = 'reports.html?student=' + studentId;
}
