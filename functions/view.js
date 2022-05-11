const mysql = require('mysql2/promise');
const table = require('console.table');

const viewData = async (db, select) => {
    const queries = [
        `SELECT * 
        FROM department`,
        `SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON department.id = role.department_id`,
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`
    ];

    let data = {};
    try {
        // Read all date from the department table
        data = await db.query(queries[select]);

        // Put the manager's name instead of mananger_id into employee.manager to display it
        if(select === 2){
            data[0].forEach((employee) => {
                if(!employee.manager) {
                    return;
                }
                employee.manager = data[0][employee.manager-1].first_name + ' ' + data[0][employee.manager-1].last_name;
                return;
            });
        }
        console.table(data[0]);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const viewEmployeesByManager = async (db) => {
    // let managerList = [];
    try {
        let employeeList = await db.query(`SELECT id, first_name, last_name FROM employee`);
        //employeeList = employeeList[0];
        let sortedEmployeeList = await db.query(`SELECT manager_id AS manager, id, first_name, last_name FROM employee ORDER BY manager`);
        sortedEmployeeList = sortedEmployeeList[0];

        sortedEmployeeList.forEach((employee) => {
            if(!employee.manager) {
                return;
            }
            employee.manager = employeeList[0][employee.manager-1].first_name + ' ' + employeeList[0][employee.manager-1].last_name;
            return;
        });

        console.table(sortedEmployeeList);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {viewData, viewEmployeesByManager};