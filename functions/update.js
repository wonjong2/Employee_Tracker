const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const table = require('console.table');

const updateEmployeeRole = async (db) => {
    let roleList = [];
    let employeeList = [];
    try {
        // Create the roleList with data from the role table, it will be used as a 'choices' in inquirer.prompt
        roleList = await db.query(`SELECT id AS value, title AS name FROM role`);
        roleList = roleList[0];
        // Create the employeeList with data from the employee table, it will be used as a 'choices' in inquirer.prompt
        employeeList = await db.query(`SELECT id AS value, first_name AS name, last_name FROM employee`);
        employeeList = employeeList[0];
        employeeList.forEach((employee) => employee.name = employee.name + ' ' + employee.last_name);

        const {id, role_id} = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: `Which employee's role do you want to update?`,
                choices: employeeList,
                pageSize: employeeList.length,
            },
            {
                type: 'list',
                name: 'role_id',
                message: `Which role do you want to assign the selected employee?`,
                choices: roleList,
                pageSize: roleList.length,
            },
        ]);

        const result = await db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, id]);
        console.log(`Updated employee's role`);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {updateEmployeeRole};