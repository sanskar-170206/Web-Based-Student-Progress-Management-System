function pageInit() {
    renderMarksPage();
}

function renderMarksPage() {
    const container = document.getElementById('main-content');
    if (!container) return;
    const marks = getData(KEYS.MARKS);
    const students = getData(KEYS.STUDENTS);

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">Marks Entry</h1>
                <p class="page-subtitle">Manage student examination marks</p>
            </div>
            <button class="btn btn-primary" onclick="openAddMarksModal()">
                ${SVG_ICONS.plus} <span>Add Marks</span>
            </button>
        </div>
        <div class="filters-bar">
            <div class="search-box">
                <span class="search-icon">${SVG_ICONS.search}</span>
                <input type="text" id="marks-search" placeholder="Search by student name..." oninput="filterMarks()">
            </div>
            <select id="filter-exam" onchange="filterMarks()">
                <option value="">All Exams</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final">Final</option>
                <option value="Unit Test">Unit Test</option>
            </select>
        </div>
        <div class="table-wrapper" id="marks-table-wrapper">
            ${renderMarksTable(marks, students)}
        </div>`;
}

function renderMarksTable(marks, students) {
    if (marks.length === 0) {
        return `<div class="empty-state">
            <div class="empty-icon">${SVG_ICONS.marks}</div>
            <h3>No marks entries yet</h3>
            <p>Add marks for students to see them here.</p>
            <button class="btn btn-primary" onclick="openAddMarksModal()">${SVG_ICONS.plus} Add Marks</button>
        </div>`;
    }
    return `
        <table class="data-table">
            <thead>
                <tr><th>Student Name</th><th>Roll No</th><th>Exam</th><th>Total</th><th>Percentage</th><th>Grade</th><th>Actions</th></tr>
            </thead>
            <tbody>
                ${marks.map(m => {
        const student = students.find(s => s.id === m.studentId);
        if (!student) return '';
        return `<tr>
                        <td><div class="student-name-cell"><div class="avatar-sm">${student.name.charAt(0)}</div>${student.name}</div></td>
                        <td><code>${student.rollNo}</code></td>
                        <td><span class="badge badge-info">${m.exam}</span></td>
                        <td><code>${m.total} / ${m.entries.reduce((s, e) => s + e.maxMarks, 0)}</code></td>
                        <td><strong>${m.percentage}%</strong></td>
                        <td>${gradeBadge(m.grade)}</td>
                        <td class="actions-cell">
                            <button class="btn-icon btn-icon-edit" onclick="openEditMarksModal('${m.id}')" title="Edit">${SVG_ICONS.edit}</button>
                            <button class="btn-icon btn-icon-delete" onclick="deleteMarks('${m.id}')" title="Delete">${SVG_ICONS.trash}</button>
                        </td>
                    </tr>`;
    }).join('')}
            </tbody>
        </table>`;
}

function filterMarks() {
    const query = document.getElementById('marks-search').value.toLowerCase();
    const examFilter = document.getElementById('filter-exam').value;
    const allMarks = getData(KEYS.MARKS);
    const students = getData(KEYS.STUDENTS);

    const filtered = allMarks.filter(m => {
        const student = students.find(s => s.id === m.studentId);
        if (!student) return false;
        const matchesSearch = !query || student.name.toLowerCase().includes(query) || student.rollNo.toLowerCase().includes(query);
        const matchesExam = !examFilter || m.exam === examFilter;
        return matchesSearch && matchesExam;
    });

    document.getElementById('marks-table-wrapper').innerHTML = renderMarksTable(filtered, students);
}

function getMarksFormHTML(existing = null) {
    const students = getData(KEYS.STUDENTS);
    const isEdit = !!existing;
    const defaultSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
    const entries = isEdit ? existing.entries : defaultSubjects.map(s => ({ subject: s, maxMarks: 100, obtained: '' }));

    return `
        <form id="marks-form" onsubmit="saveMarks(event, ${isEdit ? `'${existing.id}'` : 'null'})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Student <span class="required">*</span></label>
                    <select id="mf-student" required ${isEdit ? 'disabled' : ''}>
                        <option value="">Select Student</option>
                        ${students.map(s => `<option value="${s.id}" ${isEdit && existing.studentId === s.id ? 'selected' : ''}>${s.name} (${s.rollNo})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Exam Type <span class="required">*</span></label>
                    <select id="mf-exam" required>
                        <option value="">Select Exam</option>
                        ${['Mid-Term', 'Final', 'Unit Test'].map(e => `<option value="${e}" ${isEdit && existing.exam === e ? 'selected' : ''}>${e}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="subjects-section">
                <div class="subjects-header">
                    <h4>Subjects</h4>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="addSubjectRow()">+ Add Subject</button>
                </div>
                <div class="subjects-table-header">
                    <span>Subject Name</span><span>Max Marks</span><span>Obtained</span><span></span>
                </div>
                <div id="subject-rows">
                    ${entries.map((e, i) => subjectRowHTML(i, e)).join('')}
                </div>
            </div>
            <div class="calc-panel" id="calc-panel">
                <div class="calc-item"><span class="calc-label">Total</span><span class="calc-value" id="calc-total">0 / 0</span></div>
                <div class="calc-item calc-highlight"><span class="calc-label">Percentage</span><span class="calc-value calc-big" id="calc-percentage">0%</span></div>
                <div class="calc-item"><span class="calc-label">Grade</span><span id="calc-grade">${gradeBadge('-')}</span></div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Save'} Marks</button>
            </div>
        </form>`;
}

let subjectCounter = 5;

function subjectRowHTML(index, entry = { subject: '', maxMarks: 100, obtained: '' }) {
    return `
        <div class="subject-row" id="subject-row-${index}">
            <input type="text" class="subject-name" value="${entry.subject}" placeholder="Subject name" required>
            <input type="number" class="subject-max" value="${entry.maxMarks}" min="1" placeholder="Max" oninput="recalcMarks()" required>
            <input type="number" class="subject-obtained" value="${entry.obtained}" min="0" placeholder="Obtained" oninput="recalcMarks()" required>
            <button type="button" class="btn-icon btn-icon-delete" onclick="removeSubjectRow(${index})" title="Remove">${SVG_ICONS.trash}</button>
        </div>`;
}

function addSubjectRow() {
    const container = document.getElementById('subject-rows');
    const div = document.createElement('div');
    div.innerHTML = subjectRowHTML(subjectCounter++);
    container.appendChild(div.firstElementChild);
}

function removeSubjectRow(index) {
    const rows = document.querySelectorAll('.subject-row');
    if (rows.length <= 1) {
        showToast('At least one subject is required', 'warning');
        return;
    }
    const row = document.getElementById(`subject-row-${index}`);
    if (row) { row.remove(); recalcMarks(); }
}

function recalcMarks() {
    const rows = document.querySelectorAll('.subject-row');
    let totalObtained = 0, totalMax = 0;
    let valid = true;

    rows.forEach(row => {
        const max = parseInt(row.querySelector('.subject-max').value) || 0;
        const obt = parseInt(row.querySelector('.subject-obtained').value) || 0;
        const obtInput = row.querySelector('.subject-obtained');

        if (obt > max && max > 0) {
            obtInput.classList.add('input-error');
            valid = false;
        } else {
            obtInput.classList.remove('input-error');
        }
        totalMax += max;
        totalObtained += obt;
    });

    const pct = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    const grade = calcGrade(pct);

    document.getElementById('calc-total').textContent = `${totalObtained} / ${totalMax}`;
    document.getElementById('calc-percentage').textContent = `${pct}%`;
    document.getElementById('calc-grade').innerHTML = gradeBadge(grade);
}

function openAddMarksModal() {
    subjectCounter = 5;
    openModal('Add Marks', getMarksFormHTML(), '700px');
    setTimeout(recalcMarks, 50);
}

function openEditMarksModal(id) {
    const marks = getData(KEYS.MARKS);
    const m = marks.find(mk => mk.id === id);
    if (!m) return;
    subjectCounter = m.entries.length;
    openModal('Edit Marks', getMarksFormHTML(m), '700px');
    setTimeout(recalcMarks, 50);
}

function saveMarks(event, editId) {
    event.preventDefault();
    const studentId = document.getElementById('mf-student').value || (editId ? getData(KEYS.MARKS).find(m => m.id === editId)?.studentId : '');
    const exam = document.getElementById('mf-exam').value;

    if (!studentId || !exam) {
        showToast('Please select student and exam type', 'error');
        return;
    }

    const rows = document.querySelectorAll('.subject-row');
    const entries = [];
    let hasError = false;

    rows.forEach(row => {
        const subject = row.querySelector('.subject-name').value.trim();
        const maxMarks = parseInt(row.querySelector('.subject-max').value) || 0;
        const obtained = parseInt(row.querySelector('.subject-obtained').value) || 0;

        if (!subject) { hasError = true; return; }
        if (obtained > maxMarks) { hasError = true; return; }
        entries.push({ subject, maxMarks, obtained });
    });

    if (hasError || entries.length === 0) {
        showToast('Please fix errors in subject entries', 'error');
        return;
    }

    const total = entries.reduce((s, e) => s + e.obtained, 0);
    const maxTotal = entries.reduce((s, e) => s + e.maxMarks, 0);
    const percentage = parseFloat(((total / maxTotal) * 100).toFixed(1));
    const grade = calcGrade(percentage);

    const marks = getData(KEYS.MARKS);

    if (editId) {
        const idx = marks.findIndex(m => m.id === editId);
        if (idx >= 0) {
            marks[idx] = { ...marks[idx], exam, entries, total, percentage, grade };
        }
        showToast('Marks updated successfully', 'success');
        logActivity(`Marks updated for ${getStudentName(studentId)} (${exam})`);
    } else {
        marks.push({
            id: generateId(), studentId, exam, entries, total, percentage, grade,
            createdAt: new Date().toISOString()
        });
        showToast('Marks saved successfully', 'success');
        logActivity(`${exam} marks added for ${getStudentName(studentId)}`);
    }

    setData(KEYS.MARKS, marks);
    closeModal();
    renderMarksPage();
}

function deleteMarks(id) {
    const marks = getData(KEYS.MARKS);
    const m = marks.find(mk => mk.id === id);
    const name = m ? getStudentName(m.studentId) : 'Unknown';

    showConfirm(`Delete marks entry for <strong>${name}</strong>?`, () => {
        const updated = marks.filter(mk => mk.id !== id);
        setData(KEYS.MARKS, updated);
        showToast('Marks entry deleted', 'success');
        logActivity(`Marks deleted for ${name}`);
        renderMarksPage();
    });
}
