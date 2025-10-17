// salaryModule.js
import * as EmployeeDb from './employeeDbModule.js';

export function calculateNetSalary(employee) {
    return employee.salary + employee.bonus - employee.deduction;
}

export function generatePayrollReport() {
    return EmployeeDb.getAllEmployees().map(emp => ({
        ...emp,
        netSalary: calculateNetSalary(emp)
    }));
}

// Higher-order for updating salary
const updateField = (field) => (id, value) => {
    const updates = { [field]: parseFloat(value) };
    EmployeeDb.updateEmployee(id, updates);
};

export const updateBonus = updateField('bonus');
export const updateDeduction = updateField('deduction');

export function render(content) {
    const report = generatePayrollReport();

    content.innerHTML = `
        <h2>Quản lý Lương</h2>
        <table>
            <thead><tr><th>ID</th><th>Tên</th><th>Lương cơ bản</th><th>Bonus</th><th>Deduction</th><th>Lương ròng</th><th>Cập nhật Bonus</th><th>Cập nhật Deduction</th></tr></thead>
            <tbody>${report.map(emp => `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.salary}</td>
                    <td>${emp.bonus}</td>
                    <td>${emp.deduction}</td>
                    <td>${emp.netSalary}</td>
                    <td><input type="number" data-id="${emp.id}" class="bonus-input" placeholder="Bonus mới"></td>
                    <td><input type="number" data-id="${emp.id}" class="deduct-input" placeholder="Deduction mới"></td>
                </tr>`).join('')}
            </tbody>
        </table>
        <button id="update-salaries">Cập nhật</button>
    `;

    document.getElementById('update-salaries').addEventListener('click', () => {
        document.querySelectorAll('.bonus-input').forEach(input => {
            const value = input.value;
            if (value) updateBonus(parseInt(input.dataset.id), value);
        });
        document.querySelectorAll('.deduct-input').forEach(input => {
            const value = input.value;
            if (value) updateDeduction(parseInt(input.dataset.id), value);
        });
        alert('Cập nhật thành công');
        render(content);
    });
}