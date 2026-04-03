function checkAuth() {
    const session = getSession();
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html') || path.endsWith('/');
    const isIndexPage = path.endsWith('index.html') || path.endsWith('/');

    if (!session || !session.loggedIn) {
        if (!isLoginPage && !isIndexPage) {
            window.location.href = '../login.html';
        }
        return false;
    }
    return true;
}

function attemptAdminLogin(username, password, expectedRole = 'Admin') {
    const users = getData(KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password && u.role === expectedRole);
    if (user) {
        setSession({ username: user.username, role: user.role, name: user.name, loggedIn: true });
        return true;
    }
    return false;
}

function attemptStudentLogin(cls, section, rollNo, password) {
    const students = getData(KEYS.STUDENTS);
    const student = students.find(s =>
        s.class == cls && s.section === section && s.rollNo.toLowerCase() === rollNo.toLowerCase() && s.password === password
    );
    if (student) {
        setSession({
            username: student.name,
            role: 'Student',
            loggedIn: true,
            studentId: student.id,
            studentRollNo: student.rollNo,
            studentClass: student.class,
            studentSection: student.section
        });
        return true;
    }
    return false;
}

function getStudentSession() {
    const session = getSession();
    if (session && session.role === 'Student') {
        return { studentId: session.studentId, studentRollNo: session.studentRollNo };
    }
    return null;
}

function isAdmin() {
    const session = getSession();
    return session && (session.role === 'Admin' || session.role === 'SuperAdmin');
}

function isSuperAdmin() {
    const session = getSession();
    return session && session.role === 'SuperAdmin';
}

function isStudent() {
    const session = getSession();
    return session && session.role === 'Student';
}

function initPage(pageName) {
    if (!checkAuth()) return;
    renderShell(pageName);
}
