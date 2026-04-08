let activityView = 'feed';

function pageInit() {
    renderActivitiesPage();
}

function renderActivitiesPage() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">NGO Activities</h1>
                <p class="page-subtitle">Track events, activities, and live locations</p>
            </div>
            ${isSuperAdmin() ? `
            <div class="header-actions">
                <button class="btn btn-primary" onclick="openAddActivityModal()">
                    ${SVG_ICONS.plus} <span>Add Activity/Event</span>
                </button>
            </div>` : ''}
        </div>
        <div class="tab-bar">
            <button class="tab-btn ${activityView === 'feed' ? 'active' : ''}" onclick="switchActivityView('feed')">Activity Feed</button>
            <button class="tab-btn ${activityView === 'map' ? 'active' : ''}" onclick="switchActivityView('map')">Live Tracking</button>
        </div>
        <div id="activities-content-area"></div>`;
    
    renderActivityContent();
}

function switchActivityView(view) {
    activityView = view;
    renderActivitiesPage();
}

function renderActivityContent() {
    const area = document.getElementById('activities-content-area');
    if (!area) return;

    if (activityView === 'feed') {
        renderActivityFeed(area);
    } else {
        renderLiveTracking(area);
    }
}

function renderActivityFeed(container) {
    const activities = getData(KEYS.ACTIVITIES);
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${SVG_ICONS.activities}</div>
                <h3>No activities recorded yet</h3>
                <p>Post updates about NGO events and daily activities.</p>
                ${isSuperAdmin() ? `<button class="btn btn-primary" onclick="openAddActivityModal()">${SVG_ICONS.plus} Add Activity</button>` : ''}
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="activity-feed">
            ${activities.sort((a, b) => new Date(b.date) - new Date(a.date)).map(act => `
                <div class="card activity-card" style="margin-bottom: 20px;">
                    <div class="activity-header" style="display:flex; justify-content:space-between; margin-bottom: 12px;">
                        <div>
                            <h3 style="margin:0">${act.title}</h3>
                            <span class="text-muted" style="font-size: 0.85rem">${formatDate(act.date)} • ${act.type}</span>
                        </div>
                        <div class="activity-badges">
                            ${act.audienceCount ? `<span class="badge badge-primary">Audience: ${act.audienceCount}</span>` : ''}
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); line-height: 1.5;">${act.description}</p>
                    ${act.location ? `
                        <div style="margin-top: 12px; font-size: 0.85rem; color: var(--accent-primary); display: flex; align-items: center; gap: 4px;">
                            ${SVG_ICONS.location} <span>${act.locationName || act.location}</span>
                        </div>
                    ` : ''}
                    ${isSuperAdmin() ? `
                    <div style="margin-top: 16px; display:flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="openEditActivityModal('${act.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger-outline" onclick="deleteActivity('${act.id}')">Delete</button>
                    </div>` : ''}
                </div>
            `).join('')}
        </div>`;
}

function getActivityFormHTML(activity = null) {
    const isEdit = !!activity;
    const today = new Date().toISOString().split('T')[0];
    
    return `
        <form id="activity-form" onsubmit="saveActivity(event, ${isEdit ? `'${activity.id}'` : 'null'})">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Activity Title <span class="required">*</span></label>
                    <input type="text" id="act-title" value="${isEdit ? activity.title : ''}" required placeholder="e.g. Health Camp, Food Distribution">
                </div>
                <div class="form-group">
                    <label>Type <span class="required">*</span></label>
                    <select id="act-type" required>
                        <option value="Event" ${isEdit && activity.type === 'Event' ? 'selected' : ''}>Event</option>
                        <option value="Daily Activity" ${isEdit && activity.type === 'Daily Activity' ? 'selected' : ''}>Daily Activity</option>
                        <option value="Workshop" ${isEdit && activity.type === 'Workshop' ? 'selected' : ''}>Workshop</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date <span class="required">*</span></label>
                    <input type="date" id="act-date" value="${isEdit ? activity.date : today}" required>
                </div>
                <div class="form-group">
                    <label>Audience / Participants <span class="required">*</span></label>
                    <input type="number" id="act-audience" value="${isEdit ? activity.audienceCount : ''}" required placeholder="Number of people">
                </div>
                <div class="form-group full-width">
                    <label>Description <span class="required">*</span></label>
                    <textarea id="act-desc" required placeholder="Describe the activity..." style="min-height: 100px; width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; background: var(--input-bg); color: var(--text-main); font-family: inherit;">${isEdit ? activity.description : ''}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Location (Current GPS)</label>
                    <div style="display:flex; gap:12px">
                        <input type="text" id="act-location" value="${isEdit ? (activity.location || '') : ''}" placeholder="GPS Coordinates" readonly style="flex:1">
                        <button type="button" class="btn btn-secondary" onclick="captureActivityGPS()">Get Location</button>
                    </div>
                    <input type="text" id="act-locationName" value="${isEdit ? (activity.locationName || '') : ''}" placeholder="Location Name (Optional)" style="margin-top: 8px;">
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Post'} Activity</button>
            </div>
        </form>`;
}

function captureActivityGPS() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported', 'error');
        return;
    }
    showToast('Fetching location...', 'info');
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            document.getElementById('act-location').value = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
            showToast('Location captured!', 'success');
        },
        (err) => showToast('Failed to get location: ' + err.message, 'error')
    );
}

function openAddActivityModal() {
    openModal('Post Activity/Event', getActivityFormHTML());
}

function openEditActivityModal(id) {
    const activities = getData(KEYS.ACTIVITIES);
    const act = activities.find(a => a.id === id);
    if (act) openModal('Edit Activity', getActivityFormHTML(act));
}

function saveActivity(e, id) {
    e.preventDefault();
    const title = document.getElementById('act-title').value;
    const type = document.getElementById('act-type').value;
    const date = document.getElementById('act-date').value;
    const audienceCount = document.getElementById('act-audience').value;
    const description = document.getElementById('act-desc').value;
    const location = document.getElementById('act-location').value;
    const locationName = document.getElementById('act-locationName').value;

    const activities = getData(KEYS.ACTIVITIES);
    if (id) {
        const idx = activities.findIndex(a => a.id === id);
        if (idx >= 0) activities[idx] = { ...activities[idx], title, type, date, audienceCount, description, location, locationName };
    } else {
        activities.push({ id: generateId(), title, type, date, audienceCount, description, location, locationName, createdAt: new Date().toISOString() });
    }
    
    setData(KEYS.ACTIVITIES, activities);
    closeModal();
    showToast('Activity record saved', 'success');
    renderActivityContent();
}

function deleteActivity(id) {
    showConfirm('Delete this activity record?', () => {
        let activities = getData(KEYS.ACTIVITIES);
        activities = activities.filter(a => a.id !== id);
        setData(KEYS.ACTIVITIES, activities);
        renderActivityContent();
    });
}

function renderLiveTracking(container) {
    const activitiesWithLoc = getData(KEYS.ACTIVITIES).filter(a => a.location);
    
    container.innerHTML = `
        <div class="card" style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-card); border: 2px dashed var(--border);">
            <div style="font-size: 3rem; margin-bottom: 20px;">${SVG_ICONS.map}</div>
            <h3 style="margin-bottom: 12px;">Live Activity Map</h3>
            <p class="text-secondary" style="max-width: 400px; text-align: center; margin-bottom: 24px;">This view shows the live GPS locations of ongoing NGO activities and events in Nagpur.</p>
            
            <div class="location-list" style="width: 100%; max-width: 600px;">
                <h4 style="margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border)">Active Locations (${activitiesWithLoc.length})</h4>
                ${activitiesWithLoc.map(a => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px; background: var(--bg-body); border-radius: 8px; margin-bottom: 10px;">
                        <div>
                            <div style="font-weight:600">${a.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted)">${a.locationName || 'GPS Location'} (${a.location})</div>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="window.open('https://www.google.com/maps?q=${a.location}', '_blank')">View on Google Maps</button>
                    </div>
                `).join('')}
                ${activitiesWithLoc.length === 0 ? '<div class="text-muted" style="text-align:center">No location-tagged activities yet.</div>' : ''}
            </div>
        </div>`;
}
