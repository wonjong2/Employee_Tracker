const mysql = require('mysql2/promise');
// const inquirer = require('inquirer');
const table = require('console.table');
// const {main} = require('./main');

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
        // main();
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}


module.exports = {viewData};