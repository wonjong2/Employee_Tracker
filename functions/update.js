const inquirer = require('inquirer');

const updateEmployeeRole = async (db) => {
    try {
        // Create the roleList with data from the role table, it will be used as a 'choices' in inquirer.prompt
        let [roleList] = await db.query(`SELECT id AS value, title AS name FROM role`);
        // Create the employeeList with data from the employee table, it will be used as a 'choices' in inquirer.prompt
        let [employeeList] = await db.query(`SELECT id AS value, first_name AS name, last_name FROM employee`);
        employeeList.forEach((employee) => employee.name = `${employee.name} ${employee.last_name}`);

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

        await db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, id]);
        console.log(`Updated employee's role`);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const updateEmployeeManagers = async (db) => {
    try {
        // Create the employeeList with data from the employee table, it will be used as a 'choices' in inquirer.prompt
        let [employeeList] = await db.query(`SELECT id AS value, first_name AS name, last_name FROM employee`);
        employeeList.forEach((employee) => employee.name = `${employee.name} ${employee.last_name}`);
        // Create the managerList with data from the employee table, it will be used as a 'choices' in inquirer.prompt
        let managerList = [{value:null, name:'None'}].concat(employeeList);

        const {id, manager_id} = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: `Which employee's manager do you want to update?`,
                choices: employeeList,
                pageSize: employeeList.length,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: `Who is the manager of the selected employee?`,
                choices: managerList,
                pageSize: managerList.length,
            },
        ]);

        await db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [manager_id, id]);
        console.log(`Updated employee's manager`);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {updateEmployeeRole, updateEmployeeManagers};