let currentAttendanceRecords = [];
let currentStaffAttendanceRecords = [];
let currentView = 'mark';
let currentCategory = 'student'; // 'student' or 'staff'

function pageInit() {
    renderAttendancePage();
}

function renderAttendancePage() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">Attendance</h1>
                <p class="page-subtitle">Track daily attendance for students and staff</p>
            </div>
            <div class="category-switcher tab-bar" style="margin-bottom: 0; border-bottom: none">
                <button class="tab-btn ${currentCategory === 'student' ? 'active' : ''}" onclick="switchCategory('student')">Student Attendance</button>
                <button class="tab-btn ${currentCategory === 'staff' ? 'active' : ''}" onclick="switchCategory('staff')">Staff/Teacher Attendance</button>
            </div>
        </div>
        <div class="tab-bar">
            <button class="tab-btn ${currentView === 'mark' ? 'active' : ''}" onclick="switchAttView('mark')">Mark Attendance</button>
            <button class="tab-btn ${currentView === 'history' ? 'active' : ''}" onclick="switchAttView('history')">History</button>
            <button class="tab-btn ${currentView === 'summary' ? 'active' : ''}" onclick="switchAttView('summary')">${currentCategory === 'student' ? 'Student' : 'Staff'} Summary</button>
        </div>
        <div id="attendance-content">${getAttendanceViewHTML()}</div>`;

    if (currentView === 'summary') setTimeout(renderSummaryChart, 0);
}

function switchCategory(cat) {
    currentCategory = cat;
    currentView = 'mark';
    renderAttendancePage();
}

function switchAttView(view) {
    currentView = view;
    renderAttendancePage();
}

function getAttendanceViewHTML() {
    if (currentCategory === 'student') {
        if (currentView === 'mark') return getMarkAttendanceHTML();
        if (currentView === 'history') return getHistoryHTML();
        return getSummaryHTML();
    } else {
        if (currentView === 'mark') return getMarkStaffAttendanceHTML();
        if (currentView === 'history') return getStaffHistoryHTML();
        return getStaffSummaryHTML();
    }
}

function getMarkAttendanceHTML() {
    const today = new Date().toISOString().split('T')[0];
    const students = getData(KEYS.STUDENTS);
    const classes = [...new Set(students.map(s => s.class))].sort((a, b) => a - b);

    return `
        <div class="attendance-controls card">
            <div class="controls-row">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="att-date" value="${today}">
                </div>
                <div class="form-group">
                    <label>Class</label>
                    <select id="att-class">
                        <option value="">Select Class</option>
                        ${classes.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Section</label>
                    <select id="att-section">
                        <option value="">Select Section</option>
                        ${['A', 'B', 'C', 'D', 'E'].map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <button class="btn btn-primary" onclick="loadAttendanceStudents()">Load Students</button>
            </div>
        </div>
        <div id="attendance-table-area"></div>`;
}

function loadAttendanceStudents() {
    const date = document.getElementById('att-date').value;
    const cls = document.getElementById('att-class').value;
    const section = document.getElementById('att-section').value;

    if (!date || !cls || !section) {
        showToast('Please select date, class, and section', 'warning');
        return;
    }

    const students = getData(KEYS.STUDENTS).filter(s => s.class === cls && s.section === section);
    if (students.length === 0) {
        showToast('No students found for the selected class/section', 'warning');
        return;
    }

    // Check for existing attendance record
    const attendance = getData(KEYS.ATTENDANCE);
    const classFilter = `${cls}-${section}`;
    const existing = attendance.find(a => a.date === date && a.classFilter === classFilter);

    currentAttendanceRecords = students.map(s => {
        const existingRecord = existing ? existing.records.find(r => r.studentId === s.id) : null;
        return {
            studentId: s.id,
            name: s.name,
            rollNo: s.rollNo,
            status: existingRecord ? existingRecord.status : 'Present'
        };
    });

    renderAttendanceTable();
}

function renderAttendanceTable() {
    const area = document.getElementById('attendance-table-area');
    const presentCount = currentAttendanceRecords.filter(r => r.status === 'Present').length;
    const total = currentAttendanceRecords.length;

    area.innerHTML = `
        <div class="attendance-actions">
            <div class="att-stats">
                <span class="att-stat present">Present: ${presentCount}</span>
                <span class="att-stat absent">Absent: ${total - presentCount}</span>
                <span class="att-stat total">Total: ${total}</span>
            </div>
            <div class="att-bulk-actions">
                <button class="btn btn-sm btn-success" onclick="markAll('Present')">Mark All Present</button>
                <button class="btn btn-sm btn-danger-outline" onclick="markAll('Absent')">Mark All Absent</button>
                <button class="btn btn-secondary" onclick="captureStudentGPS()">${SVG_ICONS.location || '📍'} GPS</button>
                <button class="btn btn-secondary" onclick="captureBiometric('student')">👆 Biometric</button>
                <button class="btn btn-primary" onclick="saveAttendance()">Save Attendance</button>
            </div>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted)">
            <div id="student-gps-status"></div>
            <div id="student-bio-status"></div>
        </div>
        <table class="data-table">
            <thead><tr><th>#</th><th>Student Name</th><th>Roll No</th><th>Status</th></tr></thead>
            <tbody>
                ${currentAttendanceRecords.map((r, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td><div class="student-name-cell"><div class="avatar-sm">${r.name.charAt(0)}</div>${r.name}</div></td>
                        <td><code>${r.rollNo}</code></td>
                        <td>
                            <button class="status-toggle ${r.status === 'Present' ? 'status-present' : 'status-absent'}"
                                onclick="toggleStatus(${i})">
                                ${r.status}
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

function toggleStatus(index) {
    currentAttendanceRecords[index].status = currentAttendanceRecords[index].status === 'Present' ? 'Absent' : 'Present';
    renderAttendanceTable();
}

function markAll(status) {
    currentAttendanceRecords.forEach(r => r.status = status);
    renderAttendanceTable();
}

function saveAttendance() {
    const date = document.getElementById('att-date').value;
    const cls = document.getElementById('att-class').value;
    const section = document.getElementById('att-section').value;
    const classFilter = `${cls}-${section}`;

    const attendance = getData(KEYS.ATTENDANCE);
    const existingIdx = attendance.findIndex(a => a.date === date && a.classFilter === classFilter);

    const location = document.getElementById('student-gps-status').dataset.coords || null;
    const biometricVerified = document.getElementById('student-bio-status').dataset.verified === 'true';

    const record = {
        id: existingIdx >= 0 ? attendance[existingIdx].id : generateId(),
        date, classFilter, location, biometricVerified,
        records: currentAttendanceRecords.map(r => ({ studentId: r.studentId, status: r.status }))
    };

    if (existingIdx >= 0) {
        attendance[existingIdx] = record;
    } else {
        attendance.push(record);
    }

    setData(KEYS.ATTENDANCE, attendance);
    const presentCount = currentAttendanceRecords.filter(r => r.status === 'Present').length;
    showToast(`Attendance saved: ${presentCount}/${currentAttendanceRecords.length} present`, 'success');
    logActivity(`Attendance recorded for Class ${classFilter} on ${date}`);
}

function getHistoryHTML() {
    const attendance = getData(KEYS.ATTENDANCE);
    const students = getData(KEYS.STUDENTS);

    // Group by date
    const byDate = {};
    attendance.forEach(a => {
        if (!byDate[a.date]) byDate[a.date] = [];
        byDate[a.date].push(a);
    });

    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">${SVG_ICONS.attendance}</div><h3>No attendance records</h3><p>Start by marking attendance.</p></div>`;
    }

    return `
        <div class="history-list">
            ${sortedDates.map(date => {
        const records = byDate[date];
        return records.map(record => {
            const present = record.records.filter(r => r.status === 'Present').length;
            const total = record.records.length;
            const pct = total > 0 ? Math.round((present / total) * 100) : 0;
            return `
                        <div class="accordion-item card">
                            <div class="accordion-header" onclick="toggleAccordion(this)">
                                <div class="acc-info">
                                    <strong>${formatDate(date)}</strong>
                                    <span class="badge badge-info">Class ${record.classFilter}</span>
                                </div>
                                <div class="acc-stats">
                                    <span>${present} / ${total} Present</span>
                                    <div class="progress-bar-mini"><div class="progress-fill" style="width:${pct}%;background:${pct >= 75 ? 'var(--accent-success)' : pct >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'}"></div></div>
                                    <span>${pct}%</span>
                                    <span class="acc-arrow">▼</span>
                                </div>
                            </div>
                            <div class="accordion-body" style="display:none;">
                                <table class="data-table compact">
                                    <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Status</th></tr></thead>
                                    <tbody>
                                        ${record.records.map((r, i) => {
                const st = students.find(s => s.id === r.studentId);
                return `<tr>
                                                <td>${i + 1}</td>
                                                <td>${st ? st.name : 'Unknown'}</td>
                                                <td><code>${st ? st.rollNo : '-'}</code></td>
                                                <td><span class="status-pill ${r.status === 'Present' ? 'status-present' : 'status-absent'}">${r.status}</span></td>
                                            </tr>`;
            }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>`;
        }).join('');
    }).join('')}
        </div>`;
}

function toggleAccordion(header) {
    const body = header.nextElementSibling;
    const arrow = header.querySelector('.acc-arrow');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    arrow.textContent = isOpen ? '▼' : '▲';
}

function getSummaryHTML() {
    const students = getData(KEYS.STUDENTS);
    const attendance = getData(KEYS.ATTENDANCE);

    const summary = students.map(s => {
        let totalDays = 0, presentDays = 0;
        attendance.forEach(a => {
            const record = a.records.find(r => r.studentId === s.id);
            if (record) {
                totalDays++;
                if (record.status === 'Present') presentDays++;
            }
        });
        const pct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        return { ...s, totalDays, presentDays, absentDays: totalDays - presentDays, attendancePct: pct };
    }).sort((a, b) => b.attendancePct - a.attendancePct);

    if (summary.length === 0) {
        return `<div class="empty-state"><div class="empty-icon">${SVG_ICONS.students}</div><h3>No students found</h3></div>`;
    }

    return `
        <div class="card" style="margin-bottom: 24px;">
            <h3>Attendance Trends (Last 7 Days)</h3>
            <div class="chart-container" style="height: 300px;"><canvas id="attendanceBarChart"></canvas></div>
        </div>
        <table class="data-table">
            <thead><tr><th>Student Name</th><th>Class</th><th>Total Days</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr></thead>
            <tbody>
                ${summary.map(s => `
                    <tr>
                        <td><div class="student-name-cell"><div class="avatar-sm">${s.name.charAt(0)}</div>${s.name}</div></td>
                        <td>${s.class}-${s.section}</td>
                        <td>${s.totalDays}</td>
                        <td><span class="text-success">${s.presentDays}</span></td>
                        <td><span class="text-danger">${s.absentDays}</span></td>
                        <td>
                            <div class="pct-cell">
                                <div class="progress-bar-mini"><div class="progress-fill" style="width:${s.attendancePct}%;background:${s.attendancePct >= 75 ? 'var(--accent-success)' : s.attendancePct >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'}"></div></div>
                                <span class="${s.attendancePct >= 75 ? 'text-success' : s.attendancePct >= 50 ? 'text-warning' : 'text-danger'}">${s.attendancePct}%</span>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

// --- STAFF ATTENDANCE ---

function getMarkStaffAttendanceHTML() {
    const today = new Date().toISOString().split('T')[0];
    return `
        <div class="attendance-controls card">
            <div class="controls-row">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="staff-att-date" value="${today}">
                </div>
                <button class="btn btn-primary" onclick="loadStaffForAttendance()">Load Staff</button>
            </div>
        </div>
        <div id="staff-att-table-area"></div>`;
}

function loadStaffForAttendance() {
    const date = document.getElementById('staff-att-date').value;
    const staff = getData(KEYS.STAFF);
    const allAtt = getData(KEYS.STAFF_ATTENDANCE);
    const existing = allAtt.find(a => a.date === date);

    currentStaffAttendanceRecords = staff.map(s => {
        const entry = existing ? existing.records.find(r => r.staffId === s.id) : null;
        return {
            staffId: s.id,
            name: s.name,
            designation: s.designation,
            status: entry ? entry.status : 'Present',
            location: entry ? entry.location : null
        };
    });

    renderStaffAttendanceTable();
}

function renderStaffAttendanceTable() {
    const area = document.getElementById('staff-att-table-area');
    if (!area) return;

    area.innerHTML = `
        <div class="card">
            <div class="attendance-actions" style="margin-bottom: 16px;">
                <div class="att-bulk-actions">
                    <button class="btn btn-sm btn-success" onclick="markAllStaff('Present')">All Present</button>
                    <button class="btn btn-sm btn-danger-outline" onclick="markAllStaff('Absent')">All Absent</button>
                </div>
                <div style="display:flex; gap:12px">
                    <button class="btn btn-secondary" onclick="captureStaffGPS()">${SVG_ICONS.location || '📍'} GPS</button>
                    <button class="btn btn-secondary" onclick="captureBiometric('staff')">👆 Biometric</button>
                    <button class="btn btn-primary" onclick="saveStaffAttendance()">Save Attendance</button>
                </div>
            </div>
            <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted)">
                <div id="staff-gps-status"></div>
                <div id="staff-bio-status"></div>
            </div>
            <table class="data-table">
                <thead><tr><th>#</th><th>Staff Name</th><th>Designation</th><th>Status</th><th>Location</th></tr></thead>
                <tbody>
                    ${currentStaffAttendanceRecords.map((r, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><strong>${r.name}</strong></td>
                            <td>${r.designation}</td>
                            <td>
                                <button class="status-toggle ${r.status === 'Present' ? 'status-present' : 'status-absent'}"
                                    onclick="toggleStaffStatus(${i})">
                                    ${r.status}
                                </button>
                            </td>
                            <td>${r.location ? `<span class="text-success">${SVG_ICONS.location} Captured</span>` : '<span class="text-muted">No GPS</span>'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
}

function toggleStaffStatus(idx) {
    currentStaffAttendanceRecords[idx].status = currentStaffAttendanceRecords[idx].status === 'Present' ? 'Absent' : 'Present';
    renderStaffAttendanceTable();
}

function markAllStaff(status) {
    currentStaffAttendanceRecords.forEach(r => r.status = status);
    renderStaffAttendanceTable();
}

function captureStaffGPS() {
    const statusDiv = document.getElementById('staff-gps-status');
    if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
    statusDiv.innerHTML = 'Fetching GPS...';
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const loc = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
            currentStaffAttendanceRecords.forEach(r => { if (r.status === 'Present') r.location = loc; });
            statusDiv.innerHTML = `<span class="text-success">Location Captured: ${loc}</span>`;
            showToast('GPS Captured', 'success');
            renderStaffAttendanceTable();
        },
        (err) => { showToast('GPS Failed', 'error'); statusDiv.innerHTML = 'Location capture failed'; }
    );
}

function saveStaffAttendance() {
    const date = document.getElementById('staff-att-date').value;
    const biometricVerified = document.getElementById('staff-bio-status') && document.getElementById('staff-bio-status').dataset.verified === 'true';
    const allAtt = getData(KEYS.STAFF_ATTENDANCE);
    const existingIdx = allAtt.findIndex(a => a.date === date);
    const record = { date, biometricVerified, records: currentStaffAttendanceRecords.map(r => ({ staffId: r.staffId, status: r.status, location: r.location })) };
    if (existingIdx >= 0) allAtt[existingIdx] = record;
    else allAtt.push(record);
    setData(KEYS.STAFF_ATTENDANCE, allAtt);
    showToast('Staff attendance saved', 'success');
    logActivity(`Staff attendance recorded for ${date}`);
}

function getStaffHistoryHTML() {
    const attendance = getData(KEYS.STAFF_ATTENDANCE);
    const staff = getData(KEYS.STAFF);
    const sortedDates = [...new Set(attendance.map(a => a.date))].sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) return `<div class="empty-state"><h3>No staff attendance history</h3></div>`;

    return `<div class="history-list">${sortedDates.map(date => {
        const record = attendance.find(a => a.date === date);
        const present = record.records.filter(r => r.status === 'Present').length;
        const total = record.records.length;
        return `
            <div class="accordion-item card">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <div class="acc-info"><strong>${formatDate(date)}</strong></div>
                    <div class="acc-stats">
                        <span>${present} / ${total} Present</span>
                        <span class="acc-arrow">▼</span>
                    </div>
                </div>
                <div class="accordion-body" style="display:none;">
                    <table class="data-table compact">
                        <thead><tr><th>Name</th><th>Status</th><th>Location</th></tr></thead>
                        <tbody>
                            ${record.records.map(r => {
                                const s = staff.find(st => st.id === r.staffId);
                                return `<tr><td>${s ? s.name : 'Unknown'}</td><td><span class="status-pill ${r.status === 'Present' ? 'status-present' : 'status-absent'}">${r.status}</span></td><td>${r.location || '-'}</td></tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
    }).join('')}</div>`;
}

function getStaffSummaryHTML() {
    const staff = getData(KEYS.STAFF);
    const attendance = getData(KEYS.STAFF_ATTENDANCE);
    const summary = staff.map(s => {
        let total = 0, present = 0;
        attendance.forEach(a => {
            const r = a.records.find(rec => rec.staffId === s.id);
            if (r) { total++; if (r.status === 'Present') present++; }
        });
        const pct = total > 0 ? Math.round((present/total)*100) : 0;
        return { ...s, total, present, absent: total-present, pct };
    }).sort((a,b) => b.pct - a.pct);

    if (summary.length === 0) return `<div class="empty-state"><h3>No staff members found</h3></div>`;

    return `
        <div class="card" style="margin-bottom: 24px;">
            <h3>Teacher Attendance Trends (Last 7 Days)</h3>
            <div class="chart-container" style="height: 300px;"><canvas id="attendanceBarChart"></canvas></div>
        </div>
        <table class="data-table">
            <thead><tr><th>Staff Name</th><th>Designation</th><th>Total Days</th><th>Present</th><th>Absent</th><th>Overall %</th></tr></thead>
            <tbody>
                ${summary.map(s => `
                    <tr>
                        <td><strong>${s.name}</strong></td>
                        <td>${s.designation}</td>
                        <td>${s.total}</td>
                        <td class="text-success">${s.present}</td>
                        <td class="text-danger">${s.absent}</td>
                        <td>
                            <div class="pct-cell">
                                <div class="progress-bar-mini"><div class="progress-fill" style="width:${s.pct}%;background:${s.pct >= 75 ? 'var(--accent-success)' : s.pct >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'}"></div></div>
                                <span class="${s.pct >= 75 ? 'text-success' : s.pct >= 50 ? 'text-warning' : 'text-danger'}">${s.pct}%</span>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

// --- UTILS ---

function toggleAccordion(header) {
    const body = header.nextElementSibling;
    const arrow = header.querySelector('.acc-arrow');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    arrow.textContent = isOpen ? '▼' : '▲';
}

function captureStudentGPS() {
    const statusDiv = document.getElementById('student-gps-status');
    if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
    statusDiv.innerHTML = 'Capturing location...';
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
            statusDiv.innerHTML = `<span class="text-success">${SVG_ICONS.location || '📍'} Location captured: ${coords}</span>`;
            statusDiv.dataset.coords = coords;
            showToast('GPS Captured', 'success');
        },
        (err) => { showToast('GPS Failed', 'error'); statusDiv.innerHTML = '<span class="text-danger">Location capture failed</span>'; }
    );
}

async function captureBiometric(type) {
    const statusDivId = type === 'student' ? 'student-bio-status' : 'staff-bio-status';
    const statusDiv = document.getElementById(statusDivId);
    
    if (!window.PublicKeyCredential) {
        // Fallback mock if WebAuthn is completely unsupported
        setTimeout(() => {
            statusDiv.innerHTML = '<span class="text-success">👆 Biometric Verified (Mock)</span>';
            statusDiv.dataset.verified = "true";
            showToast('Biometric logic accepted (Mocked)', 'success');
        }, 1000);
        return;
    }

    try {
        statusDiv.innerHTML = 'Waiting for fingerprint/face ID...';
        showToast('Please authenticate using biometric sensor', 'info');
        // Challenge native platform authenticator
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        
        await navigator.credentials.create({
            publicKey: {
                challenge: challenge,
                rp: { name: "UPAY NGO System" },
                user: { id: new Uint8Array(16), name: "admin", displayName: "Administrator" },
                pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
                timeout: 60000,
                authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" }
            }
        });
        
        statusDiv.innerHTML = `<span class="text-success" style="font-weight: 600;">👆 Biometric Verified Successfully</span>`;
        statusDiv.dataset.verified = "true";
        showToast('Biometric authentication passed!', 'success');
    } catch(e) {
        statusDiv.innerHTML = `<span class="text-danger">Biometric Failed/Cancelled</span>`;
        statusDiv.dataset.verified = "false";
        showToast('Biometric authentication failed or cancelled.', 'error');
    }
}

function renderSummaryChart() {
    const ctx = document.getElementById('attendanceBarChart');
    if (!ctx) return;
    const attendance = currentCategory === 'student' ? getData(KEYS.ATTENDANCE) : getData(KEYS.STAFF_ATTENDANCE);
    const last7Days = [...new Set(attendance.map(a => a.date))].sort().slice(-7);
    const dayLabels = last7Days.map(d => formatDate(d));
    const dayData = last7Days.map(date => {
        const records = attendance.filter(a => a.date === date);
        let total = 0, present = 0;
        records.forEach(r => {
            const list = r.records || [];
            total += list.length;
            present += list.filter(rec => rec.status === 'Present').length;
        });
        return total > 0 ? Math.round((present / total) * 100) : 0;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayLabels,
            datasets: [{
                label: 'Attendance Rate (%)',
                data: dayData,
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: '#30363D' }, ticks: { color: '#8B949E' } },
                x: { grid: { display: false }, ticks: { color: '#8B949E' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
