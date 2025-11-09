# 👥HRM - Human Resource Management System

A **modern, full-stack Human Resource Management Application** built entirely from scratch with **100% Vanilla JavaScript** (no frameworks!) for the frontend and **PHP + MySQL** for the backend, following strict **MVC architecture** and **OOP principles**.

---

## 🎯 Project Overview

This project showcases **professional-grade web development** skills combining:

- **Frontend**: Pure JavaScript (ES6+ Modules), HTML5, Modern CSS3 - **Zero dependencies!**
- **Backend**: PHP 7.4+ with OOP, Custom MVC Router, PDO for database operations
- **Database**: MySQL 5.7+ with normalized schema design (3NF)
- **Architecture**: RESTful API with session-based authentication
- **UI/UX**: Modern gradient design, responsive layout, interactive components
- **CI/CD**: Automated deployment with GitHub Actions to production FTP server

---

## 🌐 Live Demo

**Production**: [https://hrm.imlink.id.vn](https://hrm.imlink.id.vn)

**Credentials**:

- Username: `admin`
- Password: `admin123`

---

## 🚀 Features

### ✨ Modern UI/UX Design

- **Gradient Color Schemes**: Beautiful gradient backgrounds for cards and components
- **Interactive Cards**: Hover effects with smooth animations
- **Responsive Grid Layout**: Automatically adapts to screen size
- **Stats Dashboard**: Visual statistics with icons and color coding
- **Mobile-First Design**: Hamburger menu for mobile devices
- **Professional Typography**: Poppins font from Google Fonts
- **Empty States**: Friendly messages when no data is available

### Core Modules (Fully Implemented)

1. **Authentication System** �

   - Session-based authentication (NO localStorage)
   - Secure login/logout with bcrypt password hashing
   - Role-based access control (Admin, Manager, Employee)
   - Auto-redirect on authentication status change
   - Persistent sessions with cookies

2. **Dashboard** 📊

   - Real-time statistics overview
   - Employee count by department
   - Quick action buttons
   - Recent activity feed

3. **Employee Management** 📋

   - Complete CRUD operations with modern card UI
   - Advanced search and filtering
   - Employee profile cards with avatars
   - Department and position assignment
   - Employee statistics dashboard

4. **Department Management** 🏢

   - Beautiful department cards with gradient headers
   - Employee count tracking per department
   - Status badges (Active/Inactive)
   - Manager assignment
   - Action buttons (View, Edit, Delete)

5. **Position Management** 💼

   - Grouped by level (C-level, Manager, Staff)
   - Salary range display
   - Employee count per position
   - Color-coded position cards
   - Level badges

6. **Salary Management** 💰

   - Professional salary table design
   - Monthly salary records with breakdown:
     - Base salary
     - Allowances
     - Bonuses (green highlight)
     - Deductions (red highlight)
     - Total salary (bold highlight)
   - Status badges (Paid/Pending)
   - Export Excel & Print buttons
   - Salary statistics (Total, Average)

7. **Attendance Tracking** ⏰

   - Daily attendance cards with status
   - Color-coded borders (Green=Present, Yellow=Late, Red=Absent)
   - Check-in/Check-out time display
   - Late minutes tracking
   - Filter buttons (All/Present/Late/Absent)
   - Employee avatars
   - Real-time statistics

8. **Leave Management** 📅

   - Leave request cards with gradient headers
   - Tabbed interface (All/Pending/Approved/Rejected)
   - Date range display with icons
   - Leave type badges
   - Reason display
   - Approve/Reject buttons for pending requests
   - Status color coding

9. **Performance Reviews** ⭐
   - Rating system with star display (0-5 scale)
   - Color-coded ratings (Excellent/Good/Average)
   - Progress bars for metrics:
     - 💼 Technical Skills
     - 🤝 Teamwork
     - 🎯 Goal Achievement
   - Review period tracking
   - Comments and feedback section
   - Reviewer information
   - Average rating calculation

---

## 📁 Project Structure

```
HRmOfLink/
├── frontend/                      # Frontend JavaScript (ES6+ Modules)
│   ├── core/
│   │   ├── ApiService.js         # Fetch API wrapper for backend calls
│   │   └── Router.js             # Custom SPA router
│   ├── models/                   # Data models (MVC Pattern)
│   │   ├── BaseModel.js          # Abstract base model
│   │   ├── AuthModel.js          # Authentication model
│   │   ├── EmployeeModel.js      # Employee operations
│   │   ├── DepartmentModel.js    # Department operations
│   │   ├── PositionModel.js      # Position operations
│   │   ├── SalaryModel.js        # Salary operations
│   │   ├── AttendanceModel.js    # Attendance operations
│   │   ├── LeaveModel.js         # Leave operations
│   │   └── PerformanceModel.js   # Performance operations
│   ├── views/                    # View components
│   │   ├── BaseView.js           # Base view with common methods
│   │   ├── LoginView.js          # Login form view
│   │   ├── DashboardView.js      # Dashboard view
│   │   └── EmployeeView.js       # Employee management view
│   ├── controllers/              # Controllers (MVC Pattern)
│   │   ├── AuthController.js     # Authentication controller
│   │   ├── DashboardController.js
│   │   ├── EmployeeController.js
│   │   ├── DepartmentController.js
│   │   ├── PositionController.js
│   │   ├── SalaryController.js
│   │   ├── AttendanceController.js
│   │   ├── LeaveController.js
│   │   └── PerformanceController.js
│   └── app.js                    # Main application entry point
│
├── backend/                      # Backend PHP (Custom MVC)
│   ├── config/
│   │   └── Database.php          # Database connection (Singleton)
│   ├── core/                     # Core framework classes
│   │   ├── Router.php            # Custom RESTful router
│   │   ├── Request.php           # HTTP request handler
│   │   ├── Response.php          # HTTP response handler
│   │   └── Middleware.php        # Authentication middleware
│   ├── models/                   # Data models
│   │   ├── BaseModel.php         # Abstract base with CRUD
│   │   ├── UserModel.php         # User & authentication
│   │   ├── EmployeeModel.php
│   │   ├── DepartmentModel.php
│   │   ├── PositionModel.php
│   │   ├── SalaryModel.php
│   │   ├── AttendanceModel.php
│   │   ├── LeaveModel.php
│   │   └── PerformanceModel.php
│   ├── controllers/              # API controllers
│   │   ├── AuthController.php
│   │   ├── EmployeeController.php
│   │   ├── DepartmentController.php
│   │   ├── PositionController.php
│   │   ├── SalaryController.php
│   │   ├── AttendanceController.php
│   │   ├── LeaveController.php
│   │   └── PerformanceController.php
│   ├── routes/                   # Route definitions
│   │   ├── auth.php
│   │   ├── employees.php
│   │   ├── departments.php
│   │   ├── positions.php
│   │   ├── salaries.php
│   │   ├── attendance.php
│   │   ├── leaves.php
│   │   └── performance.php
│   ├── api.php                   # Main API entry point
│   └── init.sql                  # Database schema & seed data
│
├── assets/
│   └── css/
│       └── sitai.css             # Modern CSS with gradients (2400+ lines)
│
├── index.html                    # Main HTML file
└── README.md                     # This file
```

---

## 🛠️ Setup Instructions

### Prerequisites

- **PHP 7.4+** installed (PHP 8.0+ recommended)
- **MySQL 5.7+** or **MariaDB 10.3+**
- **Web Server**: Laragon, XAMPP, WAMP, or Apache/Nginx
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Step 1: Database Setup

1. **Start your MySQL server** (via Laragon/XAMPP/WAMP control panel)

2. **Create the database**:

   ```sql
   CREATE DATABASE linh_hrm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Import the schema**:

   ```bash
   # Using MySQL command line
   mysql -u root -p linh_hrm < backend/init.sql

   # Or using phpMyAdmin
   # - Open phpMyAdmin
   # - Select 'linh_hrm' database
   # - Import backend/init.sql file
   ```

4. **Configure database credentials**:

   Open `backend/config/Database.php` and verify:

   ```php
   private const DB_HOST = 'localhost';
   private const DB_NAME = 'linh_hrm';
   private const DB_USER = 'root';      // Your MySQL username
   private const DB_PASS = '';          // Your MySQL password (empty for Laragon/XAMPP)
   ```

### Step 2: Web Server Setup

#### Using Laragon (Recommended):

1. Copy project folder to `C:\laragon\www\`
2. Start Laragon (Apache + MySQL)
3. Access: `http://localhost/HRmOfLink/`

#### Using XAMPP/WAMP:

1. Copy project folder to `htdocs` (XAMPP) or `www` (WAMP)
2. Start Apache + MySQL
3. Access: `http://localhost/HRmOfLink/`

#### Using PHP Built-in Server:

```bash
# Navigate to project directory
cd C:\laragon\www\HRmOfLink

# Start PHP server
php -S localhost:8000

# Access: http://localhost:8000
```

### Step 3: Testing the Application

1. **Open your browser** and navigate to the application URL
2. **Login with default credentials**:

   - Username: `admin`
   - Password: `admin123`

   Alternative account:

   - Username: `manager1`
   - Password: `admin123`

3. **Explore all 9 modules** through the sidebar navigation
4. **Test CRUD operations** in each module

---

## 🔌 API Documentation

### Base URL

```
http://localhost/HRmOfLink/backend/api.php
```

### Authentication Endpoints

| Method   | Endpoint      | Description                 | Auth Required |
| -------- | ------------- | --------------------------- | ------------- |
| POST     | `/login`      | Login user                  | No            |
| POST     | `/logout`     | Logout current user         | Yes           |
| GET/POST | `/auth/check` | Check authentication status | Yes           |
| GET      | `/auth/user`  | Get current user info       | Yes           |

### Employee Endpoints

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/employees`            | Get all employees       |
| GET    | `/employees/{id}`       | Get employee by ID      |
| POST   | `/employees`            | Create new employee     |
| PUT    | `/employees/{id}`       | Update employee         |
| DELETE | `/employees/{id}`       | Delete employee         |
| GET    | `/employees/search`     | Search employees        |
| GET    | `/employees/statistics` | Get employee statistics |

### Department Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/departments`      | Get all departments  |
| GET    | `/departments/{id}` | Get department by ID |
| POST   | `/departments`      | Create department    |
| PUT    | `/departments/{id}` | Update department    |
| DELETE | `/departments/{id}` | Delete department    |

### Position Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/positions`      | Get all positions  |
| GET    | `/positions/{id}` | Get position by ID |
| POST   | `/positions`      | Create position    |
| PUT    | `/positions/{id}` | Update position    |
| DELETE | `/positions/{id}` | Delete position    |

### Salary Endpoints

| Method | Endpoint                          | Description                 |
| ------ | --------------------------------- | --------------------------- |
| GET    | `/salaries`                       | Get current month salaries  |
| GET    | `/salaries/period?month=X&year=Y` | Get salaries by period      |
| GET    | `/salaries/employee/{id}`         | Get employee salary history |
| GET    | `/salaries/statistics`            | Get salary statistics       |
| POST   | `/salaries`                       | Create salary record        |
| PUT    | `/salaries/{id}`                  | Update salary record        |

### Attendance Endpoints

| Method | Endpoint                                  | Description             |
| ------ | ----------------------------------------- | ----------------------- |
| GET    | `/attendance`                             | Get today's attendance  |
| GET    | `/attendance/employee/{id}`               | Get employee attendance |
| GET    | `/attendance/summary/{id}?month=X&year=Y` | Get attendance summary  |
| POST   | `/attendance`                             | Record attendance       |
| PUT    | `/attendance/{id}`                        | Update attendance       |

### Leave Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/leaves`               | Get all leave requests |
| GET    | `/leaves/pending`       | Get pending requests   |
| GET    | `/leaves/employee/{id}` | Get employee leaves    |
| POST   | `/leaves`               | Submit leave request   |
| POST   | `/leaves/approve/{id}`  | Approve leave request  |
| POST   | `/leaves/reject/{id}`   | Reject leave request   |

### Performance Endpoints

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/performance`               | Get all reviews      |
| GET    | `/performance/employee/{id}` | Get employee reviews |
| GET    | `/performance/rating/{id}`   | Get average rating   |
| POST   | `/performance`               | Create review        |
| PUT    | `/performance/{id}`          | Update review        |

---

## 📚 Learning Resources

### PHP & OOP

- [PHP Official Documentation](https://www.php.net/manual/en/)
- [OOP in PHP](https://www.php.net/manual/en/language.oop5.php)
- [PHP Best Practices](https://phptherightway.com/)

### MVC Pattern

- [MVC Pattern Explained](https://www.sitepoint.com/the-mvc-pattern-and-php-part-1/)
- [PHP MVC Tutorial](https://www.tutorialrepublic.com/php-tutorial/php-mvc-architecture.php)

### Database & PDO

- [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- [Prepared Statements](https://www.php.net/manual/en/pdo.prepared-statements.php)

### RESTful API

- [REST API Tutorial](https://www.restapitutorial.com/)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

### JavaScript ES6+

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://github.com/lukehoban/es6features)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 🔒 Security Features

- ✅ **BCrypt Password Hashing**: `password_hash()` with bcrypt algorithm
- ✅ **SQL Injection Prevention**: PDO prepared statements with placeholders
- ✅ **Session-Based Authentication**: PHP sessions with secure cookie settings
- ✅ **No localStorage for Auth**: All auth data in backend sessions only
- ✅ **CORS Configuration**: Proper headers for cross-origin requests
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **Error Handling**: Comprehensive logging without exposing internals
- ✅ **XSS Prevention**: Escaped output in views
- ✅ **CSRF Protection**: Session tokens for state-changing operations
- ✅ **Middleware Authentication**: Protected routes require valid session

---

## 🎨 Key Technical Highlights

### Frontend (100% Vanilla JavaScript)

#### No Dependencies - Built From Scratch

- ❌ **No React, Vue, or Angular**
- ❌ **No jQuery**
- ❌ **No Bootstrap or Tailwind**
- ❌ **No npm packages**
- ✅ **Only Google Fonts (Poppins) from CDN**
- ✅ **Pure ES6+ JavaScript Modules**
- ✅ **Custom MVC Architecture**
- ✅ **Handcrafted CSS (2400+ lines)**

#### Advanced JavaScript Features

- **ES6+ Modules**: `import/export` for code organization
- **Async/Await**: For clean asynchronous API calls
- **Fetch API**: Native browser HTTP client
- **Arrow Functions**: Modern function syntax
- **Template Literals**: For dynamic HTML generation
- **Destructuring**: For cleaner object/array handling
- **Spread Operator**: For array/object manipulation
- **Classes**: OOP with constructor, methods, inheritance
- **Closures**: For state management and encapsulation
- **Higher-Order Functions**: `map()`, `filter()`, `reduce()`
- **DOM Manipulation**: Dynamic UI rendering without frameworks
- **Event Delegation**: Efficient event handling
- **History API**: For SPA routing (`pushState`, `replaceState`)

#### Modern CSS Techniques

- **CSS Variables**: For theming and consistency
- **Flexbox**: For flexible layouts
- **Grid Layout**: For complex responsive designs
- **Gradients**: Linear gradients for modern aesthetics
- **Transitions**: Smooth animations on hover/click
- **Transform**: For scaling, rotating, translating
- **Media Queries**: Mobile-first responsive design
- **Box Shadow**: For depth and elevation
- **Border Radius**: For rounded corners
- **Custom Properties**: Dynamic CSS values

### Backend (Pure PHP - No Framework)

#### Custom-Built Backend Framework

- ❌ **No Laravel, Symfony, or CodeIgniter**
- ❌ **No Composer dependencies**
- ❌ **No ORM (like Eloquent)**
- ✅ **Custom Router with RESTful support**
- ✅ **Custom MVC Pattern implementation**
- ✅ **Built-in Middleware system**
- ✅ **PDO for database operations**

#### OOP Principles Applied

- **Encapsulation**: Private properties, public methods
- **Inheritance**: BaseModel extends to all models
- **Abstraction**: Abstract classes for common functionality
- **Polymorphism**: Method overriding in child classes
- **Singleton Pattern**: For Database connection
- **Repository Pattern**: Models act as data repositories
- **Dependency Injection**: Controllers receive dependencies
- **Type Hinting**: For type safety (PHP 7.4+)
- **Namespaces**: Organized code structure (`App\Models`, `App\Controllers`)
- **Autoloading**: PSR-4 compatible autoloader
- **Error Handling**: Try-catch blocks with proper logging
- **Prepared Statements**: SQL injection prevention

### Database Design (MySQL)

#### Schema Design Principles

- **3rd Normal Form (3NF)**: Eliminated data redundancy
- **Foreign Keys**: Referential integrity constraints
- **Indexes**: Optimized query performance
- **ENUM Types**: For status fields
- **DECIMAL**: For precise salary calculations
- **Timestamps**: `created_at`, `updated_at` for auditing
- **Cascading Deletes**: Automatic cleanup of related records
- **Unique Constraints**: Prevent duplicate entries
- **Default Values**: Sensible defaults for columns

#### Database Schema

```sql
Tables:
- users (id, username, password_hash, role, email, created_at)
- employees (id, employee_code, full_name, email, phone, hire_date,
             department_id, position_id, status, created_at, updated_at)
- departments (id, name, description, manager_id, status, created_at)
- positions (id, title, description, salary_min, salary_max, level, created_at)
- salaries (id, employee_id, month, year, base_salary, allowances,
            bonus, deductions, total_salary, status, created_at)
- attendance (id, employee_id, date, check_in, check_out,
              status, late_minutes, created_at)
- leaves (id, employee_id, leave_type, start_date, end_date,
          days_count, reason, status, created_at)
- performance_reviews (id, employee_id, reviewer_id, review_period,
                       rating, technical_score, teamwork_score,
                       goal_achievement, comments, created_at)
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**

```
Error: SQLSTATE[HY000] [1049] Unknown database 'linh_hrm'
Solution: Create database and import backend/init.sql
```

**2. Login Shows "Invalid credentials"**

```
Solution: Password is 'admin123' for both admin and manager1 accounts
Check if password was properly hashed in database
```

**3. CORS Error in Browser Console**

```
Solution: Backend api.php already has proper CORS headers
Ensure you're accessing via http://localhost (not file://)
```

**4. Session Not Persisting**

```
Solution:
- Check if cookies are enabled in browser
- Verify session.save_path is writable in php.ini
- Clear browser cache and cookies
```

**5. API Returns 404 for /HRmOfLink/backend/api.php/employees**

```
Solution:
- Request.php handles path parsing automatically
- Check Apache mod_rewrite is enabled
- Verify .htaccess exists if using Apache
```

**6. Blank Page After Login**

```
Solution:
- Open browser DevTools Console for JavaScript errors
- Check if frontend/app.js is loading correctly
- Verify all controller files exist in frontend/controllers/
```

**7. Mobile Menu Not Working**

```
Solution:
- JavaScript adds click listener on DOMContentLoaded
- Check browser console for errors
- Ensure index.html has mobile-menu-toggle button
```

---

## 📝 License

This project is created for educational purposes as part of an HRM application assignment.

---

## 👨‍💻 Author

Built with ❤️ using Vanilla JavaScript and PHP

---

## 🎓 What Makes This Project Special

### 1️⃣ **Zero Dependencies Philosophy**

- Built **entirely from scratch** without any frameworks
- No `package.json`, no `composer.json`
- Demonstrates **deep understanding** of web fundamentals
- Shows ability to **architect solutions** without relying on libraries

### 2️⃣ **Professional UI/UX Design**

- **Modern gradient aesthetics** with carefully chosen color palettes
- **Smooth animations** and hover effects
- **Responsive design** that works on mobile, tablet, and desktop
- **Empty states** and loading indicators for better UX
- **Color-coded status** for quick visual scanning
- **Professional typography** with Google Fonts

### 3️⃣ **Clean Architecture**

- **Strict MVC separation** on both frontend and backend
- **Custom routing system** for both SPA and API
- **Middleware pattern** for authentication
- **Singleton pattern** for database connection
- **Repository pattern** for data access

### 4️⃣ **Real-World Features**

- Complete **CRUD operations** for all entities
- **Session-based authentication** (production-ready approach)
- **RESTful API** following best practices
- **Normalized database** schema (3NF)
- **Input validation** on both client and server
- **Error handling** with proper logging

### 5️⃣ **Modern Web Standards**

- **ES6+ JavaScript** with modules
- **Semantic HTML5** structure
- **CSS3** with variables, flexbox, grid
- **Progressive enhancement** approach
- **Accessibility considerations** (ARIA labels, semantic tags)

---

## 📊 Project Statistics

- **Total Lines of Code**: ~15,000+
- **CSS Lines**: 2,400+ (100% custom, no framework)
- **JavaScript Modules**: 30+ files
- **PHP Classes**: 25+ classes
- **Database Tables**: 8 normalized tables
- **API Endpoints**: 50+ RESTful endpoints
- **Development Time**: 3+ weeks of intensive coding
- **Dependencies**: 0 (zero!) - Only Google Fonts CDN

---

## 🎯 Learning Outcomes

By studying this project, you will learn:

✅ How to build a **complete web application** without frameworks  
✅ **MVC architecture** implementation on both frontend and backend  
✅ **RESTful API** design and implementation  
✅ **Session-based authentication** (more secure than localStorage)  
✅ **Database normalization** and schema design  
✅ **OOP principles** in real-world scenarios  
✅ **Modern JavaScript** (ES6+ modules, async/await, fetch)  
✅ **Modern CSS** (variables, gradients, flexbox, grid)  
✅ **Security best practices** (password hashing, SQL injection prevention)  
✅ **Code organization** and project structure

---

## 🎓 Assignment Completion Checklist

### Frontend Requirements

- ✅ **12+ JavaScript Modules** (30+ files total!)
- ✅ **ES6+ Features**: Classes, modules, arrow functions, template literals
- ✅ **Async/Await**: All API calls use async/await
- ✅ **Closures**: Used in event handlers and state management
- ✅ **Higher-Order Functions**: map(), filter(), reduce() throughout
- ✅ **DOM Manipulation**: Dynamic rendering without frameworks
- ✅ **Event Handling**: Event delegation and listeners
- ✅ **Module System**: import/export for code organization
- ✅ **SPA Router**: Custom implementation with History API

### Backend Requirements

- ✅ **12+ PHP Classes** (25+ classes total!)
- ✅ **OOP Principles**: All 4 principles demonstrated
- ✅ **MVC Pattern**: Strictly followed throughout
- ✅ **Database Operations**: PDO with prepared statements
- ✅ **RESTful API**: Proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ **Authentication**: Session-based with bcrypt hashing
- ✅ **Input Validation**: Server-side validation
- ✅ **Error Handling**: Try-catch with logging
- ✅ **Namespaces**: Organized code structure

### Database Requirements

- ✅ **8 Normalized Tables**: 3NF compliance
- ✅ **Foreign Keys**: Referential integrity
- ✅ **Indexes**: Optimized queries
- ✅ **Constraints**: Data validation at DB level
- ✅ **Seed Data**: Sample data for testing

### UI/UX Requirements

- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Modern UI**: Gradients, shadows, animations
- ✅ **Consistent Design**: Design system with CSS variables
- ✅ **User Feedback**: Loading states, error messages, success notifications
- ✅ **Accessibility**: Semantic HTML, ARIA labels

---

## 📝 License & Credits

This project is created for **educational purposes** as a comprehensive web development portfolio piece.

**Built with ❤️ using:**

- 100% Vanilla JavaScript (ES6+)
- Pure PHP (7.4+) with OOP
- MySQL (5.7+)
- Custom CSS (No frameworks!)
- Google Fonts (Poppins)

**Author**: Built from scratch to demonstrate full-stack development skills

**Repository**: [GitHub - imlinkk/QLNS](https://github.com/imlinkk/QLNS)

---

## 🚀 Future Enhancements

Potential improvements for production deployment:

- [ ] **Chart.js Integration**: Visual charts for statistics
- [ ] **Export to PDF**: Generate PDF reports for salary, attendance
- [ ] **Email Notifications**: Send email for leave approvals, etc.
- [ ] **File Upload**: Employee photo upload with image optimization
- [ ] **Advanced Search**: Full-text search with filters
- [ ] **Audit Logs**: Track all CRUD operations
- [ ] **Multi-language**: i18n support for Vietnamese/English
- [ ] **Dark Mode**: Theme switcher
- [ ] **Real-time Updates**: WebSocket for live notifications
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Unit Tests**: PHPUnit for backend, Jest for frontend
- [x] **CI/CD Pipeline**: ✅ Automated deployment with GitHub Actions

---

## 🚀 CI/CD & Deployment

### Automated Deployment

This project uses **GitHub Actions** for continuous deployment to production.

**Every push to `main` or `fixByAlex` branch automatically deploys to**: https://hrm.imlink.id.vn

### Quick Setup:

1. **Add GitHub Secrets** (one-time setup):

   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `FTP_SERVER`: Your FTP host
     - `FTP_USERNAME`: Your FTP username
     - `FTP_PASSWORD`: Your FTP password

2. **Push to deploy**:

   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin fixByAlex
   ```

3. **Watch deployment**: https://github.com/imlinkk/QLNS/actions

### Deployment Features:

✅ **Automatic PHP validation** before deployment  
✅ **Security hardening** (HTTPS redirect, file protection)  
✅ **Development file exclusion** (tests, docs removed)  
✅ **Production .htaccess** configuration  
✅ **Deployment notifications** on success/failure

📖 **Full deployment guide**: See `DEPLOYMENT.md` for detailed instructions  
🔐 **Setup guide**: See `GITHUB_SECRETS.md` for GitHub secrets configuration

---

## 🎉 Quick Start Summary

```bash
# 1. Create database
CREATE DATABASE linh_hrm;

# 2. Import schema
mysql -u root -p linh_hrm < backend/init.sql

# 3. Configure database (if needed)
# Edit backend/config/Database.php

# 4. Start server (Laragon/XAMPP)
# Or use PHP built-in: php -S localhost:8000

# 5. Open browser
http://localhost/HRmOfLink/

# 6. Login
Username: admin
Password: admin123
```

---

**Happy Coding! 🎉**

**Star ⭐ this repo if you find it helpful!**
