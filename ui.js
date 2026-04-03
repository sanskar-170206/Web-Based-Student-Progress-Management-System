const SVG_ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    students: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    attendance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>',
    marks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
};

function renderShell(activePage) {
    const session = getSession();
    if (!session || !session.loggedIn) return;

    const initials = session.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const role = session.role;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html', roles: ['Admin', 'SuperAdmin', 'Student'] },
        { id: 'admin', label: 'Admin Panel', icon: 'user', href: 'admin.html', roles: ['SuperAdmin'] },
        { id: 'students', label: 'Students', icon: 'students', href: 'students.html', roles: ['Admin', 'SuperAdmin'] },
        { id: 'attendance', label: 'Attendance', icon: 'attendance', href: 'attendance.html', roles: ['Admin', 'SuperAdmin'] },
        { id: 'marks', label: 'Marks', icon: 'marks', href: 'marks.html', roles: ['Admin', 'SuperAdmin'] },
        { id: 'reports', label: 'Reports', icon: 'reports', href: 'reports.html', roles: ['Admin', 'SuperAdmin', 'Student'] },
        { id: 'analytics', label: 'Analytics', icon: 'analytics', href: 'analytics.html', roles: ['Admin', 'SuperAdmin'] },
        { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html', roles: ['Admin', 'SuperAdmin'] }
    ];

    const visibleNav = navItems.filter(n => n.roles.includes(role));

    const headerHTML = `
    <header class="app-header" id="app-header">
        <div class="header-left">
            <button class="hamburger-btn" id="hamburger-btn" onclick="toggleSidebar()">${SVG_ICONS.menu}</button>
            <div class="header-logo">
                <img src="../assets/upay_logo.png" alt="Logo" class="shell-logo-img">
                <span class="logo-text">UPAY NGO, Nagpur</span>
            </div>
        </div>
        <div class="header-right">
            <button class="header-icon-btn" title="Notifications">${SVG_ICONS.bell}<span class="notif-dot"></span></button>
            <div class="header-user">
                <div class="avatar-circle">${initials}</div>
                <span class="header-username">${session.name || session.username}</span>
                <span class="header-role-badge">${role === 'SuperAdmin' ? 'System Admin' : (role === 'Admin' ? 'Teacher' : role)}</span>
            </div>
            <button class="btn-logout" onclick="handleLogout()" title="Logout">${SVG_ICONS.logout}<span>Logout</span></button>
        </div>
    </header>`;

    const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="../assets/upay_logo.png" alt="Logo" class="shell-logo-img">
            <span class="sidebar-title">UPAY NGO, Nagpur</span>
        </div>
        <nav class="sidebar-nav">
            ${visibleNav.map(n => `
                <a href="${n.href}" class="nav-item ${activePage === n.id ? 'active' : ''}" id="nav-${n.id}">
                    <span class="nav-icon">${SVG_ICONS[n.icon]}</span>
                    <span class="nav-label">${n.label}</span>
                </a>
            `).join('')}
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-footer-text">© 2025 UPAY NGO, Nagpur</div>
        </div>
    </aside>`;

    const mainContent = document.getElementById('main-content');
    const existingContent = mainContent ? mainContent.innerHTML : '';

    document.body.innerHTML = headerHTML + sidebarHTML +
        `<main class="main-content" id="main-content">${existingContent}</main>`;

    if (typeof pageInit === 'function') setTimeout(pageInit, 0);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
}

function handleLogout() {
    clearSession();
    window.location.href = '../login.html';
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function openModal(title, contentHTML, width) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal" style="${width ? 'max-width:' + width : ''}">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close-btn" onclick="closeModal()">${SVG_ICONS.close}</button>
            </div>
            <div class="modal-body">${contentHTML}</div>
        </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 200);
    }
}

function showConfirm(message, onConfirm) {
    const html = `
        <p style="margin-bottom:24px;color:var(--text-secondary);font-size:0.95rem;">${message}</p>
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger-solid" id="confirm-yes-btn">Yes, Delete</button>
        </div>`;
    openModal('Confirm Action', html);
    setTimeout(() => {
        const btn = document.getElementById('confirm-yes-btn');
        if (btn) btn.onclick = () => { closeModal(); onConfirm(); };
    }, 50);
}

function gradeBadge(grade) {
    const colors = { 'A+': 'success', 'A': 'success', 'B+': 'primary', 'B': 'primary', 'C': 'warning', 'D': 'warning', 'F': 'danger' };
    return `<span class="badge badge-${colors[grade] || 'primary'}">${grade}</span>`;
}

function getStudentName(studentId) {
    const students = getData(KEYS.STUDENTS);
    const s = students.find(st => st.id === studentId);
    return s ? s.name : 'Unknown';
}

function getStudentById(studentId) {
    const students = getData(KEYS.STUDENTS);
    return students.find(st => st.id === studentId) || null;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function exportToCSV(filename, headers, rows) {
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}`, 'success');
}

function exportStudentsCSV() {
    const students = getData(KEYS.STUDENTS);
    const headers = ['Name', 'Roll No', 'Class', 'Section', 'Gender', 'Parent Contact', 'Email', 'Created'];
    const rows = students.map(s => [s.name, s.rollNo, s.class, s.section, s.gender, s.parentContact || '', s.email || '', s.createdAt]);
    exportToCSV('edutrack_students.csv', headers, rows);
}

function exportMarksCSV() {
    const marks = getData(KEYS.MARKS);
    const students = getData(KEYS.STUDENTS);
    const headers = ['Student Name', 'Roll No', 'Exam', 'Subjects', 'Total', 'Percentage', 'Grade'];
    const rows = marks.map(m => {
        const s = students.find(st => st.id === m.studentId);
        const subjectStr = m.entries.map(e => `${e.subject}:${e.obtained}/${e.maxMarks}`).join('; ');
        return [s ? s.name : 'Unknown', s ? s.rollNo : '', m.exam, subjectStr, m.total, m.percentage + '%', m.grade];
    });
    exportToCSV('edutrack_marks.csv', headers, rows);
}

function exportAttendanceCSV() {
    const attendance = getData(KEYS.ATTENDANCE);
    const students = getData(KEYS.STUDENTS);
    const headers = ['Date', 'Class', 'Student Name', 'Roll No', 'Status'];
    const rows = [];
    attendance.forEach(a => {
        a.records.forEach(r => {
            const s = students.find(st => st.id === r.studentId);
            rows.push([a.date, a.classFilter, s ? s.name : 'Unknown', s ? s.rollNo : '', r.status]);
        });
    });
    exportToCSV('edutrack_attendance.csv', headers, rows);
}

function backupData() {
    const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        students: getData(KEYS.STUDENTS),
        marks: getData(KEYS.MARKS),
        attendance: getData(KEYS.ATTENDANCE),
        activity: getData(KEYS.ACTIVITY)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edutrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully', 'success');
    logActivity('Data backup created');
}

function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!data.students || !data.marks) {
                    showToast('Invalid backup file format', 'error');
                    return;
                }
                showConfirm(
                    `This will <strong>replace all current data</strong> with the backup from <strong>${formatDate(data.exportedAt)}</strong>.<br>Students: ${data.students.length}, Marks: ${data.marks.length} entries.<br><br>This cannot be undone!`,
                    () => {
                        setData(KEYS.STUDENTS, data.students);
                        setData(KEYS.MARKS, data.marks);
                        setData(KEYS.ATTENDANCE, data.attendance || []);
                        setData(KEYS.ACTIVITY, data.activity || []);
                        logActivity('Data restored from backup');
                        showToast('Data restored successfully! Reloading...', 'success');
                        setTimeout(() => location.reload(), 1500);
                    }
                );
            } catch (err) {
                showToast('Failed to parse backup file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAllData() {
    showConfirm(
        'This will <strong>delete ALL data</strong> including students, marks, attendance, and activity logs.<br><br>Are you absolutely sure?',
        () => {
            Object.values(KEYS).forEach(key => localStorage.removeItem(key));
            showToast('All data cleared. Reloading with fresh seed data...', 'info');
            logActivity('All data was reset');
            setTimeout(() => location.reload(), 1500);
        }
    );
}
