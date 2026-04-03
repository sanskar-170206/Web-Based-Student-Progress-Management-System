let currentAttendanceRecords = [];
let currentView = 'mark';

function pageInit() {
    renderAttendancePage();
}

function renderAttendancePage() {
    const container = document.getElementById('main-content');
    if (!container) return;
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">Attendance</h1>
                <p class="page-subtitle">Track daily student attendance</p>
            </div>
        </div>
        <div class="tab-bar">
            <button class="tab-btn ${currentView === 'mark' ? 'active' : ''}" onclick="switchAttView('mark')">Mark Attendance</button>
            <button class="tab-btn ${currentView === 'history' ? 'active' : ''}" onclick="switchAttView('history')">History</button>
            <button class="tab-btn ${currentView === 'summary' ? 'active' : ''}" onclick="switchAttView('summary')">Student Summary</button>
        </div>
        <div id="attendance-content">${getAttendanceViewHTML()}</div>`;
}

function switchAttView(view) {
    currentView = view;
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('attendance-content').innerHTML = getAttendanceViewHTML();
}

function getAttendanceViewHTML() {
    if (currentView === 'mark') return getMarkAttendanceHTML();
    if (currentView === 'history') return getHistoryHTML();
    return getSummaryHTML();
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
                <button class="btn btn-primary" onclick="saveAttendance()">Save Attendance</button>
            </div>
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

    const record = {
        id: existingIdx >= 0 ? attendance[existingIdx].id : generateId(),
        date, classFilter,
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
