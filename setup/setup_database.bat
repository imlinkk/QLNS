@echo off
echo ========================================
echo HRM Database Setup - Alternative Method
echo ========================================
echo.

echo Stopping MySQL...
C:\xampp\mysql_stop.bat
timeout /t 3

echo.
echo Starting MySQL in safe mode...
start "MySQL Safe Mode" C:\xampp\mysql\bin\mysqld.exe --skip-grant-tables --skip-networking

timeout /t 5

echo.
echo Resetting root password...
C:\xampp\mysql\bin\mysql.exe -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

echo.
echo Stopping safe mode MySQL...
taskkill /F /IM mysqld.exe

timeout /t 3

echo.
echo Starting MySQL normally...
C:\xampp\mysql_start.bat

timeout /t 3

echo.
echo Installing HRM database...
C:\xampp\mysql\bin\mysql.exe -u root -e "source d:/html/quản lý hrm/backend/init.sql"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now access: http://localhost/quản lý hrm/
echo Login: admin / admin123
echo.
pause
