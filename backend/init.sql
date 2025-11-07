-- =====================================================
-- HRM Database Initialization Script
-- Required: MySQL 5.7+ (MySQL 8.0+ recommended for CHECK constraints)
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS linh_hrm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linh_hrm;
-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Positions table
CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    min_salary DECIMAL(15, 2) DEFAULT 0,
    max_salary DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    department_id INT NOT NULL,
    position_id INT NOT NULL,
    salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    hire_date DATE NOT NULL,
    birth_date DATE,
    address TEXT,
    status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT,
    INDEX idx_name (name),
    INDEX idx_department (department_id),
    INDEX idx_position (position_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for department manager
ALTER TABLE departments
    ADD FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Salaries table (for salary history and bonuses/deductions)
CREATE TABLE salaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    bonus DECIMAL(15, 2) DEFAULT 0,
    deduction DECIMAL(15, 2) DEFAULT 0,
    total_salary DECIMAL(15, 2) GENERATED ALWAYS AS (base_salary + bonus - deduction) STORED,
    month INT NOT NULL,
    year INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_period (year, month),
    UNIQUE KEY uk_employee_period (employee_id, year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('present', 'absent', 'late', 'half_day', 'on_leave') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_date (date),
    INDEX idx_status (status),
    UNIQUE KEY uk_employee_date (employee_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leaves table
CREATE TABLE leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type ENUM('annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INT NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Reviews table
CREATE TABLE performance_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    strengths TEXT,
    weaknesses TEXT,
    goals TEXT,
    comments TEXT,
    status ENUM('draft', 'submitted', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_employee (employee_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_period (review_period_start, review_period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@hrm.com', 'Administrator', 'admin'),
('manager1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager@hrm.com', 'John Manager', 'manager');

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('IT Department', 'Information Technology'),
('HR Department', 'Human Resources'),
('Finance', 'Finance and Accounting'),
('Marketing', 'Marketing and Sales');

-- Insert sample positions
INSERT INTO positions (title, description, min_salary, max_salary) VALUES
('Manager', 'Department Manager', 20000000, 40000000),
('Senior Developer', 'Senior Software Developer', 15000000, 30000000),
('Developer', 'Software Developer', 10000000, 20000000),
('HR Specialist', 'Human Resources Specialist', 8000000, 15000000),
('Accountant', 'Financial Accountant', 9000000, 18000000);

-- Insert sample employees
INSERT INTO employees (name, email, phone, department_id, position_id, salary, hire_date, birth_date, status) VALUES
('John Doe', 'john.doe@company.com', '0123456789', 1, 1, 25000000, '2023-01-01', '1990-05-15', 'active'),
('Jane Smith', 'jane.smith@company.com', '0987654321', 1, 2, 18000000, '2023-02-01', '1992-08-20', 'active'),
('Alice Johnson', 'alice.j@company.com', '0123987654', 2, 1, 22000000, '2023-03-01', '1988-12-10', 'active'),
('Bob Brown', 'bob.brown@company.com', '0987123456', 2, 4, 12000000, '2023-04-01', '1995-03-25', 'active'),
('Charlie Davis', 'charlie.d@company.com', '0123456987', 1, 2, 16000000, '2023-05-01', '1993-07-30', 'active');

-- Insert sample attendance records (for current month)
INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES
(1, CURDATE(), '08:00:00', '17:00:00', 'present'),
(2, CURDATE(), '08:15:00', '17:30:00', 'present'),
(3, CURDATE(), '08:30:00', '17:00:00', 'late'),
(4, CURDATE(), '08:00:00', '17:00:00', 'present'),
(5, CURDATE(), '08:00:00', '17:00:00', 'present');

-- Insert sample salary records (for current month)
INSERT INTO salaries (employee_id, base_salary, bonus, deduction, month, year) VALUES
(1, 25000000, 2000000, 0, MONTH(CURDATE()), YEAR(CURDATE())),
(2, 18000000, 1000000, 0, MONTH(CURDATE()), YEAR(CURDATE())),
(3, 22000000, 1500000, 0, MONTH(CURDATE()), YEAR(CURDATE())),
(4, 12000000, 500000, 0, MONTH(CURDATE()), YEAR(CURDATE())),
(5, 16000000, 800000, 0, MONTH(CURDATE()), YEAR(CURDATE()));

-- Insert sample leave requests
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) VALUES
(1, 'annual', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 9 DAY), 3, 'Family vacation', 'approved'),
(2, 'sick', CURDATE(), CURDATE(), 1, 'Medical appointment', 'pending');

-- Insert sample performance reviews
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period_start, review_period_end, rating, strengths, weaknesses, goals, status) VALUES
(1, 2, DATE_SUB(CURDATE(), INTERVAL 6 MONTH), CURDATE(), 4.5, 'Excellent leadership skills, Strong technical knowledge', 'Could improve time management', 'Lead new project development', 'completed'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 6 MONTH), CURDATE(), 4.0, 'Good coding skills, Team player', 'Needs more initiative', 'Take on more responsibility', 'completed');

-- Create views for common queries

-- Employee details view
CREATE OR REPLACE VIEW employee_details AS
SELECT 
    e.id,
    e.name,
    e.email,
    e.phone,
    d.name AS department_name,
    p.title AS position_title,
    e.salary,
    e.hire_date,
    e.birth_date,
    e.status,
    TIMESTAMPDIFF(YEAR, e.hire_date, CURDATE()) AS years_of_service
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id;

-- Monthly salary summary view
CREATE OR REPLACE VIEW monthly_salary_summary AS
SELECT 
    e.id AS employee_id,
    e.name AS employee_name,
    s.month,
    s.year,
    s.base_salary,
    s.bonus,
    s.deduction,
    s.total_salary
FROM employees e
LEFT JOIN salaries s ON e.id = s.employee_id
WHERE e.status = 'active';

-- Attendance summary view
CREATE OR REPLACE VIEW attendance_summary AS
SELECT 
    e.id AS employee_id,
    e.name AS employee_name,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_days,
    COUNT(CASE WHEN a.status = 'on_leave' THEN 1 END) AS leave_days,
    YEAR(a.date) AS year,
    MONTH(a.date) AS month
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id
GROUP BY e.id, YEAR(a.date), MONTH(a.date);

-- Grant privileges (adjust as needed)
-- GRANT ALL PRIVILEGES ON hrm_db.* TO 'hrm_user'@'localhost' IDENTIFIED BY 'hrm_password';
-- FLUSH PRIVILEGES;

-- Display summary
SELECT 'Database initialization completed successfully!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_departments FROM departments;
SELECT COUNT(*) AS total_positions FROM positions;
SELECT COUNT(*) AS total_employees FROM employees;
SELECT COUNT(*) AS total_attendance_records FROM attendance;
SELECT COUNT(*) AS total_salary_records FROM salaries;
