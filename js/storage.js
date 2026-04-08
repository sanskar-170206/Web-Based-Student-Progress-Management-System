const KEYS = {
    SESSION: 'edutrack_session',
    STUDENTS: 'edutrack_students',
    MARKS: 'edutrack_marks',
    ATTENDANCE: 'edutrack_attendance',
    ACTIVITY: 'edutrack_activity_log',
    USERS: 'edutrack_users',
    STAFF: 'edutrack_staff',
    STAFF_ATTENDANCE: 'edutrack_staff_attendance',
    ACTIVITIES: 'edutrack_activities'
};

function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading localStorage:', e);
        return [];
    }
}

function setData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
}

function getSession() {
    try {
        const s = localStorage.getItem(KEYS.SESSION);
        return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
}

function setSession(session) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(KEYS.SESSION);
}

function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function logActivity(message) {
    const log = getData(KEYS.ACTIVITY);
    log.unshift({ message, timestamp: new Date().toISOString() });
    if (log.length > 50) log.length = 50;
    setData(KEYS.ACTIVITY, log);
}

function calcGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
}

function seedData() {
    if (localStorage.getItem('upay_initialized') === 'dummy_seeded_v7') return;
    
    const dummyStudents = [];
    const dummyMarks = [];
    const dummyAttendance = [];
    const dummyStaff = [];
    const dummyStaffAttendance = [];
    const dummyActivities = [];

    const dummyUsers = [
        { id: generateId(), username: 'admin', password: 'Upay@2025Ngp', email: 'admin@upay.org', role: 'SuperAdmin', name: 'System Administrator', createdAt: new Date().toISOString() }
    ];

    setData(KEYS.USERS, dummyUsers);
    setData(KEYS.STUDENTS, dummyStudents);
    setData(KEYS.MARKS, dummyMarks);
    setData(KEYS.ATTENDANCE, dummyAttendance);
    setData(KEYS.STAFF, dummyStaff);
    setData(KEYS.STAFF_ATTENDANCE, dummyStaffAttendance);
    setData(KEYS.ACTIVITIES, dummyActivities);
    setData(KEYS.ACTIVITY, [
        { message: 'System initialized with clean database.', timestamp: new Date().toISOString() },
        { message: 'UPAY NGO Portal active.', timestamp: new Date().toISOString() }
    ]);
    
    localStorage.setItem('upay_initialized', 'dummy_seeded_v7');
}

seedData();
