# HRM (Human Resource Management) Application

A complete **Human Resource Management System** built with **Vanilla JavaScript** for the frontend and **PHP + MySQL** for the backend, following **MVC architecture** and **OOP principles**.

---

## 🎯 Project Overview

This project demonstrates advanced web development skills combining:
- **Frontend**: Pure JavaScript (ES6+), HTML5, CSS3 - No frameworks!
- **Backend**: PHP 8+ with OOP, MVC pattern, PDO for database operations
- **Database**: MySQL with normalized schema design
- **Architecture**: RESTful API design pattern

---

## 🚀 Features

### Core Modules (Frontend & Backend)

1. **Authentication System** 👤
   - User registration with password hashing
   - Secure login/logout with session management
   - Role-based access control (Admin, Manager, Employee)

2. **Employee Management** 📋
   - Complete CRUD operations
   - Advanced search and filtering
   - Employee statistics and reporting

3. **Department Management** 🏢
   - Department creation and management
   - Employee count tracking

4. **Position Management** 💼
   - Job position definitions
   - Salary range configuration

5. **Salary Management** 💰
   - Monthly salary records
   - Bonus and deduction tracking
   - Automatic total calculation
   - Salary statistics and reports

6. **Attendance Tracking** ⏰
   - Daily check-in/check-out
   - Attendance status (Present, Absent, Late, On Leave)
   - Monthly attendance summaries

7. **Leave Management** 📅
   - Leave request submission
   - Approval workflow
   - Leave type tracking (Annual, Sick, Personal, etc.)
   - Leave balance reporting

8. **Performance Reviews** ⭐
   - Performance evaluation system
   - Rating system (0-5 scale)
   - Review history tracking
   - Average rating calculations

---

## 📁 Project Structure

```
quản lý hrm/
├── backend/
│   ├── config/
│   │   └── Database.php          # Database connection (Singleton pattern)
│   ├── models/
│   │   ├── BaseModel.php         # Abstract base model with common CRUD
│   │   ├── UserModel.php         # Authentication & user management
│   │   ├── EmployeeModel.php     # Employee operations
│   │   ├── DepartmentModel.php   # Department operations
│   │   ├── PositionModel.php     # Position operations
│   │   ├── SalaryModel.php       # Salary calculations
│   │   ├── AttendanceModel.php   # Attendance tracking
│   │   ├── LeaveModel.php        # Leave management
│   │   └── PerformanceModel.php  # Performance reviews
│   ├── controllers/
│   │   ├── AuthController.php
│   │   ├── EmployeeController.php
│   │   ├── DepartmentController.php
│   │   ├── PositionController.php
│   │   ├── SalaryController.php
│   │   ├── AttendanceController.php
│   │   ├── LeaveController.php
│   │   └── PerformanceController.php
│   ├── api.php                   # Main API router
│   └── init.sql                  # Database initialization script
├── *.js                          # Frontend JavaScript modules
├── index.html                    # Main HTML file
├── sitai.css                     # Stylesheet
└── README.md                     # This file
```

---

## 🛠️ Setup Instructions

### Prerequisites

- **PHP 8.0+** installed
- **MySQL 5.7+** or **MariaDB 10.3+**
- **Web Server**: XAMPP, WAMP, MAMP, or Apache/Nginx
- Modern web browser (Chrome, Firefox, Edge)

### Step 1: Database Setup

1. **Start your MySQL server** (via XAMPP/WAMP control panel)

2. **Create the database and import schema**:

   ```bash
   # Option 1: Using MySQL command line
   mysql -u root -p < backend/init.sql
   
   # Option 2: Using phpMyAdmin
   # - Open phpMyAdmin
   # - Create new database 'hrm_db'
   # - Import backend/init.sql file
   ```

3. **Configure database credentials**:
   
   Open `backend/config/Database.php` and update:
   ```php
   private const DB_HOST = 'localhost';
   private const DB_NAME = 'hrm_db';
   private const DB_USER = 'root';      // Your MySQL username
   private const DB_PASS = '';          // Your MySQL password
   ```

### Step 2: Web Server Setup

#### Using XAMPP/WAMP:

1. Copy project folder to `htdocs` (XAMPP) or `www` (WAMP)
2. Start Apache server
3. Access: `http://localhost/quản lý hrm/`

#### Using PHP Built-in Server:

```bash
# Navigate to project directory
cd "d:\html\quản lý hrm"

# Start PHP server
php -S localhost:8000

# Access: http://localhost:8000
```

### Step 3: Testing the Application

1. **Open your browser** and navigate to the application URL
2. **Register a new account** or use default credentials:
   - Username: `admin`
   - Password: `admin123`

3. **Explore all modules** through the sidebar navigation

---

## 🔌 API Documentation

### Base URL
```
http://localhost/quản lý hrm/backend/api.php
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login user |
| POST | `/register` | Register new user |
| POST | `/logout` | Logout current user |
| GET | `/auth/check` | Check authentication status |
| GET | `/auth/user` | Get current user info |

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees |
| GET | `/employees/{id}` | Get employee by ID |
| POST | `/employees` | Create new employee |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Delete employee |
| GET | `/employees/search` | Search employees |
| GET | `/employees/statistics` | Get employee statistics |

### Department Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | Get all departments |
| GET | `/departments/{id}` | Get department by ID |
| POST | `/departments` | Create department |
| PUT | `/departments/{id}` | Update department |
| DELETE | `/departments/{id}` | Delete department |

### Position Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/positions` | Get all positions |
| GET | `/positions/{id}` | Get position by ID |
| POST | `/positions` | Create position |
| PUT | `/positions/{id}` | Update position |
| DELETE | `/positions/{id}` | Delete position |

### Salary Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salaries` | Get current month salaries |
| GET | `/salaries/period?month=X&year=Y` | Get salaries by period |
| GET | `/salaries/employee/{id}` | Get employee salary history |
| GET | `/salaries/statistics` | Get salary statistics |
| POST | `/salaries` | Create salary record |
| PUT | `/salaries/{id}` | Update salary record |

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Get today's attendance |
| GET | `/attendance/employee/{id}` | Get employee attendance |
| GET | `/attendance/summary/{id}?month=X&year=Y` | Get attendance summary |
| POST | `/attendance` | Record attendance |
| PUT | `/attendance/{id}` | Update attendance |

### Leave Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaves` | Get all leave requests |
| GET | `/leaves/pending` | Get pending requests |
| GET | `/leaves/employee/{id}` | Get employee leaves |
| POST | `/leaves` | Submit leave request |
| POST | `/leaves/approve/{id}` | Approve leave request |
| POST | `/leaves/reject/{id}` | Reject leave request |

### Performance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/performance` | Get all reviews |
| GET | `/performance/employee/{id}` | Get employee reviews |
| GET | `/performance/rating/{id}` | Get average rating |
| POST | `/performance` | Create review |
| PUT | `/performance/{id}` | Update review |

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

- ✅ **Password Hashing**: BCrypt algorithm for secure password storage
- ✅ **SQL Injection Prevention**: PDO prepared statements
- ✅ **Session Management**: PHP sessions for authentication
- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **CORS Configuration**: Configurable cross-origin requests
- ✅ **Error Handling**: Comprehensive error logging

---

## 🎨 Key Technical Highlights

### Frontend (JavaScript)
- **ES6+ Features**: Arrow functions, template literals, destructuring, modules
- **Async/Await**: For API calls using Fetch API
- **Closures**: For state management
- **Higher-Order Functions**: For data filtering and transformation
- **DOM Manipulation**: Dynamic UI rendering
- **Modular Architecture**: Separate modules for each feature

### Backend (PHP)
- **OOP Principles**: Encapsulation, inheritance, abstraction, polymorphism
- **Design Patterns**: Singleton (Database), MVC, Repository pattern
- **PDO**: For secure database operations
- **Namespaces**: For code organization
- **Type Hinting**: For type safety
- **Error Handling**: Try-catch blocks and logging

### Database Design
- **Normalized Schema**: 3NF normalization
- **Foreign Keys**: Referential integrity
- **Indexes**: For query optimization
- **Views**: For complex queries
- **Triggers**: For automatic calculations

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Solution: Check Database.php credentials and ensure MySQL is running
```

**2. CORS Error in Browser**
```
Solution: Ensure backend/api.php has proper CORS headers (already included)
```

**3. Session Not Working**
```
Solution: Check if session_start() is called and cookies are enabled
```

**4. API Returns 404**
```
Solution: Check .htaccess file and mod_rewrite is enabled in Apache
```

**5. Password Hash Not Working**
```
Solution: Ensure PHP version is 7.0+ for password_hash() function
```

---

## 📝 License

This project is created for educational purposes as part of an HRM application assignment.

---

## 👨‍💻 Author

Built with ❤️ using Vanilla JavaScript and PHP

---

## 🎓 Assignment Completion Checklist

- ✅ **12+ Frontend Modules** (JavaScript ES6+)
- ✅ **12+ Backend Modules** (PHP OOP + MVC)
- ✅ **RESTful API** with proper HTTP methods
- ✅ **MySQL Database** with normalized schema
- ✅ **Authentication System** with session management
- ✅ **CRUD Operations** for all entities
- ✅ **Async/Await** for API calls
- ✅ **Class & Module System** (import/export)
- ✅ **Closures & Higher-Order Functions**
- ✅ **DOM Manipulation** for dynamic UI
- ✅ **Responsive Design** with CSS
- ✅ **Error Handling** on both frontend and backend
- ✅ **Input Validation** on both sides
- ✅ **Security Best Practices** implemented
- ✅ **Code Documentation** with comments
- ✅ **MVC Pattern** strictly followed
- ✅ **OOP Principles** applied throughout

---

## 🚀 Next Steps

1. **Test all features** thoroughly
2. **Customize** the UI/UX as needed
3. **Add more features** like reports, charts, notifications
4. **Deploy** to a production server
5. **Implement** additional security measures for production

---

**Happy Coding! 🎉**
