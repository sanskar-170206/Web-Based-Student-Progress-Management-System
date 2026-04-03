function pageInit() {
    if (!isSuperAdmin()) {
        showToast('Access denied: System Admin only.', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }
    renderAdminPage();
}

function renderAdminPage() {
    const container = document.getElementById('main-content');
    if (!container) return;
    
    const users = getData(KEYS.USERS);
    const teachersOnly = users.filter(u => u.role === 'Admin');
    const students = getData(KEYS.STUDENTS);
    const logs = getData(KEYS.ACTIVITY).slice(0, 15);

    container.innerHTML = `
        <div class="page-header fade-in-up delay-100">
            <div>
                <h1 class="page-title">Admin Panel</h1>
                <p class="page-subtitle">System Administration & Access Management</p>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="btn btn-secondary pulse-on-hover" onclick="openQuickStudentModal()">
                    ${SVG_ICONS.user} <span>Add Student</span>
                </button>
                <button class="btn btn-primary pulse-on-hover" onclick="openAddTeacherModal()">
                    ${SVG_ICONS.plus} <span>Add Teacher</span>
                </button>
            </div>
        </div>
        
        <div class="stats-grid mb-20 fade-in-up delay-200">
            <div class="stat-card blue hover-lift">
                <div class="stat-icon">${SVG_ICONS.award}</div>
                <div class="stat-label">Registered Teachers</div>
                <div class="stat-value counter-animate">${teachersOnly.length}</div>
            </div>
            <div class="stat-card green hover-lift">
                <div class="stat-icon">${SVG_ICONS.students}</div>
                <div class="stat-label">Total Students</div>
                <div class="stat-value counter-animate">${students.length}</div>
            </div>
            <div class="stat-card amber hover-lift">
                <div class="stat-icon">${SVG_ICONS.analytics}</div>
                <div class="stat-label">System Logs</div>
                <div class="stat-value counter-animate">${getData(KEYS.ACTIVITY).length}</div>
            </div>
            <div class="stat-card purple hover-lift">
                <div class="stat-icon">${SVG_ICONS.settings}</div>
                <div class="stat-label">System State</div>
                <div class="stat-value" style="font-size:1.2rem;margin-top:12px;">Active</div>
            </div>
        </div>

        <div class="reports-layout fade-in-up delay-300">
            <div class="card hover-lift" style="max-height: 550px; overflow-y: auto;">
                <h3 class="section-title">Teacher Directory</h3>
                ${renderTeachersTable(users)}
            </div>
            
            <div class="card hover-lift" style="max-height: 550px; overflow-y: auto; display: flex; flex-direction: column;">
                <h3 class="section-title">Recent System Activity</h3>
                <ul class="activity-list" style="flex:1;">
                    ${logs.map(log => `
                        <li class="activity-item">
                            <div class="activity-dot"></div>
                            <div class="activity-msg">${log.message}</div>
                            <div class="activity-time">${formatDateTime(log.timestamp)}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderTeachersTable(users) {
    if (users.length === 0) {
        return `<p style="color:var(--text-muted); padding: 10px;text-align:center;" class="bounce-in">No teachers registered yet.</p>`;
    }
    return `
        <table class="data-table compact">
            <thead>
                <tr><th>Name</th><th>Username</th><th>Email</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
                ${users.map(u => `
                    <tr class="table-row-hover">
                        <td>
                            <div class="student-name-cell">
                                <div class="avatar-sm glow">${u.name.charAt(0)}</div>
                                <div>
                                    ${u.name}
                                    ${u.role === 'SuperAdmin' ? '<span class="badge badge-primary" style="margin-left:8px;font-size:0.6rem;padding:2px 6px">System Admin</span>' : ''}
                                </div>
                            </div>
                        </td>
                        <td><code>${u.username}</code></td>
                        <td>${u.email || '<span style="color:var(--text-muted)">N/A</span>'}</td>
                        <td style="font-size:0.8rem;color:var(--text-muted)">${formatDate(u.createdAt)}</td>
                        <td class="actions-cell">
                             <button class="btn-icon btn-icon-edit" onclick="openEditTeacherModal('${u.id}')" title="Edit Profile">${SVG_ICONS.edit}</button>
                             ${u.role !== 'SuperAdmin' ? `<button class="btn-icon btn-icon-delete" onclick="deleteTeacher('${u.id}', '${u.name}')" title="Delete">${SVG_ICONS.trash}</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getTeacherFormHTML(teacher = null) {
    const isEdit = !!teacher;
    return `
        <form id="teacher-form" onsubmit="saveTeacher(event, ${isEdit ? `'${teacher.id}'` : 'null'})">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="tf-name" value="${isEdit ? teacher.name : ''}" required placeholder="Name of Teacher">
                </div>
                <div class="form-group full-width">
                    <label>Email Address <span class="required">*</span></label>
                    <input type="email" id="tf-email" value="${isEdit ? (teacher.email || '') : ''}" required placeholder="teacher@gmail.com" pattern=".*@gmail\.com" title="Please enter a valid @gmail.com address">
                </div>
                <div class="form-group full-width">
                    <label>Username <span class="required">*</span></label>
                    <input type="text" id="tf-username" value="${isEdit ? teacher.username : ''}" required placeholder="e.g. jdoe_math">
                </div>
                <div class="form-group full-width">
                    <label>Password <span class="required">*</span></label>
                    <input type="text" id="tf-password" value="${isEdit ? teacher.password : ''}" required placeholder="Enter secure password">
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Add'} Teacher</button>
            </div>
        </form>
    `;
}

function openAddTeacherModal() {
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    openModal('Register New Teacher', getTeacherFormHTML());
}

function openEditTeacherModal(id) {
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    const users = getData(KEYS.USERS);
    const user = users.find(u => u.id === id);
    if(user) openModal('Edit Teacher Profile', getTeacherFormHTML(user));
}

function isStrongPassword(pw) {
    return (
        pw.length >= 8 &&
        /[A-Z]/.test(pw) &&       // at least one uppercase
        /[a-z]/.test(pw) &&       // at least one lowercase
        /[0-9]/.test(pw) &&       // at least one digit
        /[^A-Za-z0-9]/.test(pw)   // at least one special character
    );
}

function saveTeacher(event, editId) {
    event.preventDefault();
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    
    const name = document.getElementById('tf-name').value.trim();
    const email = document.getElementById('tf-email').value.trim();
    const username = document.getElementById('tf-username').value.trim();
    const password = document.getElementById('tf-password').value.trim();
    
    if(!name || !email || !username || !password) {
        showToast('All fields required', 'error'); return;
    }

    if (!isStrongPassword(password)) {
        showToast('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.', 'error');
        return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
        showToast('Only @gmail.com email addresses are allowed', 'error'); return;
    }
    
    let users = getData(KEYS.USERS);
    
    if(editId) {
        const existing = users.find(u => u.username === username && u.id !== editId);
        if(existing) { showToast('Username already exists in system', 'error'); return; }

        const idx = users.findIndex(u => u.id === editId);
        if(idx >= 0) {
            users[idx] = { ...users[idx], name, email, username, password }; 
            showToast('Profile updated', 'success');
            logActivity('Profile updated: ' + name);
        }
    } else {
        const existing = users.find(u => u.username === username);
        if(existing) {
            showToast('Username already exists in system', 'error'); return;
        }
        users.push({
            id: generateId(),
            name,
            email,
            username,
            password,
            role: 'Admin', // Maps to Teacher in auth system
            createdAt: new Date().toISOString()
        });
        showToast('New teacher registered successfully', 'success');
        logActivity('System Admin registered new teacher: ' + name);
    }
    
    setData(KEYS.USERS, users);
    closeModal();
    renderAdminPage();
}

function deleteTeacher(id, name) {
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    showConfirm('Are you sure you want to revoke system access for teacher <strong>' + name + '</strong>?', () => {
        let users = getData(KEYS.USERS);
        users = users.filter(u => u.id !== id);
        setData(KEYS.USERS, users);
        showToast('Teacher deactivated', 'success');
        logActivity('Teacher access revoked: ' + name);
        renderAdminPage();
    });
}

function openQuickStudentModal() {
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    const formHtml = `
        <form id="student-form" onsubmit="saveQuickStudent(event)">
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="sf-name" required placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label>Roll Number <span class="required">*</span></label>
                    <input type="text" id="sf-rollno" required placeholder="e.g. STU009">
                </div>
                <div class="form-group">
                    <label>Class <span class="required">*</span></label>
                    <select id="sf-class" required>
                        <option value="">Select Class</option>
                        ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">Class ${i + 1}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Section <span class="required">*</span></label>
                    <select id="sf-section" required>
                        <option value="">Select Section</option>
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Gender <span class="required">*</span></label>
                    <select id="sf-gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Parent Contact <span class="required">*</span></label>
                    <input type="tel" id="sf-contact" required placeholder="Phone number (10 digits)" pattern="[0-9]{10,15}">
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" id="sf-email" required placeholder="student@gmail.com" pattern=".*@gmail\.com" title="Please enter a valid @gmail.com address">
                </div>
                <div class="form-group">
                    <label>Password <span class="required">*</span></label>
                    <input type="text" id="sf-password" required placeholder="Set student password">
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Student Quickly</button>
            </div>
        </form>`;
    openModal('Quick Add Student', formHtml);
}

function saveQuickStudent(event) {
    event.preventDefault();
    if (!isSuperAdmin()) { showToast('Security Exception: Unauthorized', 'error'); return; }
    const name = document.getElementById('sf-name').value.trim();
    const rollNo = document.getElementById('sf-rollno').value.trim();
    const cls = document.getElementById('sf-class').value;
    const section = document.getElementById('sf-section').value;
    const gender = document.getElementById('sf-gender').value;
    const parentContact = document.getElementById('sf-contact').value.trim();
    const email = document.getElementById('sf-email').value.trim();
    const password = document.getElementById('sf-password').value.trim();

    if (!name || !rollNo || !cls || !section || !gender || !parentContact || !email || !password) {
        showToast('Please fill all required fields', 'error'); return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
        showToast('Only @gmail.com email addresses are allowed', 'error'); return;
    }

    const students = getData(KEYS.STUDENTS);
    const dup = students.find(s => s.rollNo === rollNo);
    if (dup) {
        showToast('Roll number already exists!', 'error'); return;
    }

    students.push({
        id: generateId(), name, rollNo, class: cls, section, gender,
        parentContact, email, password, createdAt: new Date().toISOString()
    });
    
    setData(KEYS.STUDENTS, students);
    showToast(`Student "${name}" added successfully`, 'success');
    logActivity(`System Admin quickly added Student "${name}" (${rollNo})`);
    closeModal();
    renderAdminPage();
}

initPage('admin');
