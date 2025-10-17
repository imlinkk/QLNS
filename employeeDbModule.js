// employeeDbModule.js
let employees = [];

export function init() {
    if (!localStorage.getItem('employees')) {
        employees = [
            { id: 1, name: 'John Doe', departmentId: 1, positionId: 1, salary: 5000, hireDate: '2023-01-01', bonus: 0, deduction: 0 },
            { id: 2, name: 'Jane Smith', departmentId: 1, positionId: 2, salary: 6000, hireDate: '2023-02-01', bonus: 0, deduction: 0 },
            // Add 3 more sample employees
            { id: 3, name: 'Alice Johnson', departmentId: 2, positionId: 1, salary: 5500, hireDate: '2023-03-01', bonus: 0, deduction: 0 },
            { id: 4, name: 'Bob Brown', departmentId: 2, positionId: 3, salary: 7000, hireDate: '2023-04-01', bonus: 0, deduction: 0 },
            { id: 5, name: 'Charlie Davis', departmentId: 1, positionId: 2, salary: 6500, hireDate: '2023-05-01', bonus: 0, deduction: 0 }
        ];
        saveEmployees();
    } else {
        employees = JSON.parse(localStorage.getItem('employees'));
    }
}

export function getAllEmployees() {
    return [...employees];
}

export function getEmployeeById(id) {
    return employees.find(e => e.id === id);
}

export function addEmployee(employee) {
    const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) : 0;
    employee.id = maxId + 1;
    employees.push(employee);
    saveEmployees();
}

export function updateEmployee(id, updates) {
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updates };
        saveEmployees();
    }
}

export function deleteEmployee(id) {
    employees = employees.filter(e => e.id !== id);
    saveEmployees();
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Higher-order function example
export const filterEmployees = (predicate) => (emps = getAllEmployees()) => emps.filter(predicate);

export const sortEmployees = (comparator) => (emps = getAllEmployees()) => [...emps].sort(comparator);