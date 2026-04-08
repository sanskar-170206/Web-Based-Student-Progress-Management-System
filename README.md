<div align="center">

# 🎓 UPAY NGO Student Progress Management System

**A modern, intuitive, and feature-rich system for managing student progress, marks, attendance, and analytics.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](#)

</div>

---

## 🌟 Overview

The **UPAY NGO Student Progress Management System** is a cutting-edge web application tailored to streamline academic administration. Designed with a clean, fast, and visually appealing user interface, it provides separate, secure portals for **Students**, **Staff**, and **Administrators**. From tracking attendance to in-depth academic analytics, this system is the all-in-one hub for educational progression tracking.

## ✨ Key Features

### 🔐 Secure Multi-Role Authentication
- Seamless login for **Students**, **Staff**, and **Super Admins**.
- Interactive UI with password toggle, intuitive error handling, and robust local storage persistence.

### 📊 Dynamic Dashboards & Analytics
- Immersive data visualization to track academic progress.
- Class-specific analytics that update dynamically in real-time.
- Top-performer tables and visual progress trackers.

### 👥 Comprehensive User Management
- **Student Portal:** Students can view their personal report cards, attendance records, and performance metrics securely.
- **Staff Control:** Teachers can input marks, mark attendance, and generate reports.
- **Admin Privileges:** Full control over global settings, system logs, staff assignments, and database management.

### 🎨 Premium UI/UX Design
- **Glassmorphism & Micro-animations**: A fluid experience that feels responsive and alive.
- **Responsive Layout**: Perfectly formatted for Desktops, Tablets, and Mobile screens.
- **Profile Picture Uploads**: Customized avatar support persisting via Base64 in LocalStorage.

---

## 🛠 Technology Stack

This project takes a pure, highly-optimized approach to client-side web development without relying heavily on heavy backend frameworks, ensuring blazing fast load times and straightforward deployment.

| Technology | Usage |
| :--- | :--- |
| **HTML5** | Semantic structure and accessible markup. |
| **CSS3** | Vanilla CSS using CSS variables, Flexbox/Grid, and modern gradient aesthetics. |
| **JavaScript** | Core application logic, DOM manipulation, authentication, and routing. |
| **LocalStorage** | Persistent, robust on-device database mimicking backend interactions. |
| **Google Fonts** | Utilizing 'Poppins' and 'Inter' for premium typography. |

---

## 📂 Project Structure

```text
📁 CEP Project/
│
├── 📄 index.html        # Entry point redirect
├── 📄 login.html        # Multi-role authentication interface
├── 📄 dashboard.html    # Main operational dashboard
├── 📄 analytics.html    # Data visualization panel
├── 📄 students.html     # Student list & profiles
├── 📄 staff.html        # Teacher / Staff directory
├── 📄 attendance.html   # Attendance marking portal
├── 📄 marks.html        # Grading & marks entry
├── 📄 reports.html      # Generated report cards
├── 📄 activities.html   # Extracurricular & NGO activity log
├── 📄 settings.html     # System and user settings
│
├── 📁 js/               # JavaScript logic controllers
│   ├── app.js           # Core functions
│   ├── storage.js       # LocalStorage interaction database
│   ├── ui.js            # UI/UX interactions
│   └── ...              # Other respective scripts (staff.js, etc.)
│
├── 📁 css/              # External stylesheets
│
└── 📁 assets/           # Images, icons, and illustrations
```

---

## 🚀 Getting Started

No complex server setups or database provisioning required! To experience the system locally:

1. **Clone or Download** the project repository.
2. **Open the directory** in your favorite file explorer or IDE (e.g., VS Code).
3. **Launch the app**:
   - Double click `login.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).
   - *Alternatively*, run it via a local development server like VS Code's "Live Server" extension for the best experience.

### 🔑 Test Credentials (Example)
*(Update these with actual logic if required)*
* **Admin:** admin / [your_admin_password]
* **Staff:** username / [your_password]
* **Student:** Select Class & Section + Rollno / [your_password]

---

## 📸 Screenshots
*(Insert your own application screenshots here via standard markdown image syntax: `![Caption](path)`)*

<div align="center">
  <table>
    <tr>
      <td><img src="https://via.placeholder.com/400x250.png?text=Login+Portal" alt="Login Portal"></td>
      <td><img src="https://via.placeholder.com/400x250.png?text=Admin+Dashboard" alt="Dashboard"></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/400x250.png?text=Analytics+View" alt="Analytics"></td>
      <td><img src="https://via.placeholder.com/400x250.png?text=Student+Reports" alt="Reports"></td>
    </tr>
  </table>
</div>

---

<div align="center">
  <i>Developed with ❤️ for <b>UPAY NGO, Nagpur</b>, to empower education and streamline student progress tracking!</i>
  <br><br>
  <b>© 2026 Academic Management System</b>
</div>
