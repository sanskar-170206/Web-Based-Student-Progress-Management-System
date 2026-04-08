function pageInit() {
    renderStaffPage();
}

function renderStaffPage() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const session = getSession();
    const isSAdmin = session && session.role === 'SuperAdmin';

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">Staff Management</h1>
                <p class="page-subtitle">Manage NGO staff members and records</p>
            </div>
            ${isSAdmin ? `
            <div class="header-actions">
                <button class="btn btn-primary" onclick="openAddStaffModal()">
                    ${SVG_ICONS.plus} <span>Add Staff</span>
                </button>
            </div>` : ''}
        </div>
        <div id="staff-content-area"></div>`;
    
    renderStaffList();
}

function renderStaffList() {
    const area = document.getElementById('staff-content-area');
    if (!area) return;

    const session = getSession();
    const isSAdmin = session && session.role === 'SuperAdmin';
    let staff = getData(KEYS.STAFF);

    // If regular staff, filter to show only themselves
    if (!isSAdmin && session.staffId) {
        staff = staff.filter(s => s.id === session.staffId);
    } else if (!isSAdmin && !session.staffId) {
        // Fallback for hardcoded admin users in USERS table who aren't in STAFF table
        staff = [];
    }

    if (staff.length === 0) {
        area.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${SVG_ICONS.user}</div>
                <h3>No staff records accessible</h3>
                <p>${isSAdmin ? 'Register your first staff member to get started.' : 'Your staff record was not found or you have limited access.'}</p>
                ${isSAdmin ? `<button class="btn btn-primary" onclick="openAddStaffModal()">${SVG_ICONS.plus} Add Staff</button>` : ''}
            </div>`;
        return;
    }

    area.innerHTML = `
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th><th>Name</th><th>Designation</th><th>Contact</th><th>Email</th><th>Joining Date</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${staff.map((s, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><div class="student-name-cell"><div class="avatar-sm">${s.profilePic ? `<img src="${s.profilePic}" alt="Profile" class="avatar-img-round">` : s.name.charAt(0)}</div>${s.name}</div></td>
                            <td><span class="badge badge-info">${s.designation}</span></td>
                            <td>${s.contact}</td>
                            <td>${s.email || '-'}</td>
                            <td>${formatDate(s.joiningDate)}</td>
                            <td class="actions-cell">
                                <button class="btn-icon btn-icon-edit" onclick="openEditStaffModal('${s.id}')" title="Edit Profile">${SVG_ICONS.edit}</button>
                                ${isSAdmin ? `<button class="btn-icon btn-icon-delete" onclick="deleteStaff('${s.id}', '${s.name}')" title="Delete">${SVG_ICONS.trash}</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
}

function getStaffFormHTML(staff = null) {
    const isEdit = !!staff;
    return `
        <form id="staff-form" onsubmit="saveStaff(event, ${isEdit ? `'${staff.id}'` : 'null'})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" id="stf-name" value="${isEdit ? staff.name : ''}" required placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label>Designation <span class="required">*</span></label>
                    <input type="text" id="stf-designation" value="${isEdit ? staff.designation : ''}" required placeholder="e.g. Coordinator, Teacher">
                </div>
                <div class="form-group">
                    <label>Contact Number <span class="required">*</span></label>
                    <input type="tel" id="stf-contact" value="${isEdit ? staff.contact : ''}" required placeholder="10-digit number" pattern="[0-9]{10}">
                </div>
                <div class="form-group">
                    <label>Joining Date <span class="required">*</span></label>
                    <input type="date" id="stf-joinDate" value="${isEdit ? staff.joiningDate : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label>Email Address <span class="required">*</span></label>
                    <input type="email" id="stf-email" value="${isEdit ? (staff.email || '') : ''}" required placeholder="staff@gmail.com" pattern=".*(@gmail\.com|@\.in)" title="Please enter a valid @gmail.com or @.in address">
                </div>
                <div class="form-group">
                    <label>Username <span class="required">*</span></label>
                    <input type="text" id="stf-username" value="${isEdit ? (staff.username || '') : ''}" required placeholder="Set login username">
                </div>
                <div class="form-group">
                    <label>Login Password <span class="required">*</span></label>
                    <input type="text" id="stf-password" value="${isEdit ? (staff.password || '') : ''}" required placeholder="Set password" minlength="8" maxlength="12">
                    <small style="color:var(--text-muted); font-size:0.7rem">8-12 chars: A-Z, a-z, 0-9, special char</small>
                </div>
                <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: var(--bg-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border)">
                    <div class="avatar-sm" id="stf-avatar-preview" style="width: 50px; height: 50px; font-size: 1.1rem; border: 2px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center">
                        ${isEdit && staff.profilePic ? `<img src="${staff.profilePic}" alt="Profile" class="avatar-img-round">` : (isEdit ? staff.name.charAt(0) : '?')}
                    </div>
                    <div style="flex:1">
                        <label style="margin:0; font-size:0.8rem">Profile Picture</label>
                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('stf-pic-input').click()" style="margin-top:4px; padding: 4px 8px; font-size: 0.75rem">Choose Image</button>
                    </div>
                    <input type="file" id="stf-pic-input" style="display: none" accept="image/*" onchange="handleStaffFormPic(this)">
                    <input type="hidden" id="stf-profilePic" value="${isEdit && staff.profilePic ? staff.profilePic : ''}">
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Add'} Staff</button>
            </div>
        </form>`;
}

function openAddStaffModal() {
    openModal('Add New Staff Member', getStaffFormHTML());
}

function openEditStaffModal(id) {
    const staff = getData(KEYS.STAFF);
    const member = staff.find(s => s.id === id);
    if (!member) return;
    openModal('Edit Staff Member', getStaffFormHTML(member));
}

function saveStaff(e, id) {
    e.preventDefault();
    const name = document.getElementById('stf-name').value.trim();
    const designation = document.getElementById('stf-designation').value.trim();
    const contact = document.getElementById('stf-contact').value.trim();
    const joiningDate = document.getElementById('stf-joinDate').value;
    const email = document.getElementById('stf-email').value.trim();
    const username = document.getElementById('stf-username').value.trim();
    const password = document.getElementById('stf-password').value.trim();
    if (email && !email.toLowerCase().endsWith('@gmail.com') && !email.toLowerCase().endsWith('@.in')) {
        showToast('Only @gmail.com or @.in email addresses are allowed', 'error');
        return;
    }

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!pwRegex.test(password)) {
        showToast('Password must be 8-12 characters and include uppercase, lowercase, number, and special character.', 'error');
        return;
    }
    const profilePic = document.getElementById('stf-profilePic').value;

    const staff = getData(KEYS.STAFF);
    if (id) {
        const idx = staff.findIndex(s => s.id === id);
        if (idx >= 0) staff[idx] = { ...staff[idx], name, designation, contact, joiningDate, email, username, password, profilePic };
    } else {
        staff.push({ id: generateId(), name, designation, contact, joiningDate, email, username, password, profilePic, createdAt: new Date().toISOString() });
    }
    setData(KEYS.STAFF, staff);
    closeModal();
    showToast('Staff records updated', 'success');
    renderStaffList();
}

function deleteStaff(id, name) {
    showConfirm(`Delete staff member <strong>${name}</strong>?`, () => {
        let staff = getData(KEYS.STAFF);
        staff = staff.filter(s => s.id !== id);
        setData(KEYS.STAFF, staff);
        renderStaffList();
    });
}

function handleStaffFormPic(input) {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
        showToast('Image size should be less than 1MB', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('stf-profilePic').value = base64;
        document.getElementById('stf-avatar-preview').innerHTML = `<img src="${base64}" alt="Profile" class="avatar-img-round">`;
    };
    reader.readAsDataURL(file);
}
