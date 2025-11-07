# Quick Setup Guide

## Windows (XAMPP)

### 1. Install XAMPP
Download from: https://www.apachefriends.org/

### 2. Setup Project
1. Copy `quản lý hrm` folder to `C:\xampp\htdocs\`
2. Start Apache and MySQL from XAMPP Control Panel

### 3. Import Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create database `hrm_db`
3. Import `backend/init.sql`
4. Or run: `mysql -u root < "C:\xampp\htdocs\quản lý hrm\backend\init.sql"`

### 4. Configure Database
Edit `backend/config/Database.php`:
```php
private const DB_USER = 'root';
private const DB_PASS = '';  // Empty for XAMPP
```

### 5. Access Application
URL: `http://localhost/quản lý hrm/`

---

## Alternative: PHP Built-in Server

### 1. Navigate to Project
```cmd
cd "d:\html\quản lý hrm"
```

### 2. Import Database
```cmd
mysql -u root -p hrm_db < backend/init.sql
```

### 3. Start PHP Server
```cmd
php -S localhost:8000
```

### 4. Access Application
URL: `http://localhost:8000/`

---

## Test Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Manager Account:**
- Username: `manager1`
- Password: `admin123`

---

## Verify Installation

### 1. Test Database Connection
Visit: `http://localhost/quản lý hrm/backend/api.php/auth/check`

Should return:
```json
{
    "success": true,
    "authenticated": false
}
```

### 2. Test Login
Visit application and login with admin credentials

### 3. Check All Modules
Navigate through all sidebar menu items to ensure they work

---

## Troubleshooting

### Error: "Database connection failed"
- ✅ Ensure MySQL is running
- ✅ Check database credentials in `Database.php`
- ✅ Verify database `hrm_db` exists

### Error: "404 Not Found"
- ✅ Check Apache is running
- ✅ Verify project is in correct directory
- ✅ Check `.htaccess` file exists in backend folder

### Error: "CORS policy"
- ✅ Ensure backend/api.php has CORS headers (already included)
- ✅ Use same protocol (http) for frontend and backend

### Error: "Session not working"
- ✅ Check cookies are enabled in browser
- ✅ Clear browser cache and cookies
- ✅ Restart PHP/Apache server

---

## Development Tips

### 1. Enable Error Display (Development Only)
In `backend/api.php`, ensure:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### 2. Check PHP Error Log
XAMPP: `C:\xampp\php\logs\php_error_log`

### 3. Check MySQL Queries
Add this to models for debugging:
```php
error_log($sql);  // Before executing query
```

### 4. Test API with Postman
Download Postman and test endpoints directly

### 5. Browser Console
Press F12 to check JavaScript errors

---

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all modules (Auth, Employees, Departments, etc.)
3. ✅ Read API documentation in README.md
4. ✅ Study the code structure (MVC pattern)
5. ✅ Try adding new features
6. ✅ Deploy to production server (optional)

---

**Need Help?**
Check the full README.md for detailed documentation.

Good luck with your HRM application! 🚀
