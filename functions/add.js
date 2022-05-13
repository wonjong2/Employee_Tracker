const inquirer = require('inquirer');

const addDepartment = async(db) => {
    try {
        const {name} = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is the name of the department?',
                    }
                ]);

        const result = await db.query(`INSERT INTO department(name) VALUES('${name}')`);
        console.log(`Added ${name} to the database`);
        return;
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const addRole = async(db) => {
    let deptList = [];
    try {
        // Create the deptList with data from the department table, it will be used as a 'choices' in inquirer.prompt
        deptList = await db.query(`SELECT id AS value, name FROM department`);
        deptList = deptList[0];

        const {title, salary, department_id} = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does the role belong to?',
                choices: deptList,
                pageSize: deptList.length,
            }
        ]);
        const result = await db.query(`INSERT INTO role(title, salary, department_id) VALUES('${title}', ${salary}, ${department_id})`);
        console.log(`Added ${title} to the database`);
        return;
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const addEmployee = async (db) => {
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
        // Add 'None' option to the top of the employeeList
        employeeList.unshift({value:null, name: 'None'});

        const {first_name, last_name, role_id, manager_id} = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `What is the employee's first name?`,
            },
            {
                type: 'input',
                name: 'last_name',
                message: `What is the employee's last name?`,
            },
            {
                type: 'list',
                name: 'role_id',
                message: `What is the employee's role?`,
                choices: roleList,
                pageSize: roleList.length,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: `Who is the employee's manager?`,
                choices: employeeList,
                pageSize: employeeList.length,
            }]
        )

        const result = await db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${first_name}', '${last_name}', ${role_id}, ${manager_id})`);
        console.log(`Added ${first_name} ${last_name} to the database`);
        return;
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {addDepartment, addRole, addEmployee};