const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const table = require('console.table');
let db = {};

mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Ajtwlssha123!',
        database: 'employee_db'
    }
)
.then((conn) => {
    db = conn;
    main();
})
.catch(err => console.error(err));

function main() {
    const options = [
        {value:0, name:'View All Departments'},
        {value:1, name:'View All Roles'},
        {value:2, name:'View All Employees'},
        {value:3, name:'Add A Department'},
        {value:4, name:'Add A Role'},
        {value:5, name:'Add An Employee'},
        {value:6, name:'Update An Employee Role'}
    ];

    // Functions to be executed by user's choice
    const functions = [
        viewData, 
        viewData,
        viewData,
        addDepartment,
        addRole,
        addEmployee,
        updateEmployeeRole
    ];

    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    name: 'option',
                    message: "What would you like to do?",
                    choices: options,
                    pageSize: 7
                }
            ]
        )
        .then(({option}) => functions[option](option))
        .catch(err => console.error(err));
}

const viewData = async (select) => {
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
        main();
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const addDepartment = async() => {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?',
                }
            ]
        )
        .then(async ({name}) => {
            const result = await db.query(`INSERT INTO department(name) VALUES('${name}')`);
            console.log(`Added ${name} to the database`);
            main();
        })
        .catch((err) => console.log(err));
};

const addRole = async() => {
    let deptList = [];
    try {
        // Create the deptList with data from the department table, it will be used as a 'choices' in inquirer.prompt
        deptList = await db.query(`SELECT id AS value, name FROM department`);
        deptList = deptList[0];
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }

    inquirer
        .prompt(
            [
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
            ]
        )
        .then(async ({title, salary, department_id}) => {
            const result = await db.query(`INSERT INTO role(title, salary, department_id) VALUES('${title}', ${salary}, ${department_id})`);
            console.log(`Added ${title} to the database`);
            main();
        })
        .catch((err) => console.log(err));
};

const addEmployee = async () => {
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
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }

    inquirer
        .prompt(
            [
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
                }
            ]
        )
        .then(async ({first_name, last_name, role_id, manager_id}) => {
            const result = await db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${first_name}', '${last_name}', ${role_id}, ${manager_id})`);
            console.log(`Added ${first_name} ${last_name} to the database`);
            main();
        })
        .catch((err) => console.log(err));
}

const updateEmployeeRole = async () => {
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
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }

    inquirer
        .prompt(
            [
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
            ]
        )
        .then(async ({id, role_id}) => {
            const result = await db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [role_id, id]);
            console.log(`Updated employee's role`);
            main();
        })
        .catch((err) => console.log(err));
}