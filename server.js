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

const options = [
    'View All Departments',
    'View All Roles',
    'View All Employees',
    'Add A Department',
    'Add A Role',
    'Add An Employee',
    'Update An Employee Role'
];

function main() {
    inquirer.prompt(
        [
            {
                type: 'rawlist',
                name: 'option',
                message: "What would you like to do?",
                choices: options,
                pageSize: 7
            }
        ]
    )
    .then(({option}) => {
        switch(options.indexOf(option)) {
            case 0:
                viewDepartment();
                break;
            case 1:
                viewRole();
                break;
            case 2:
                viewEmployee();
                break;
            case 3:
                // function1();
                break;
            case 4:
                // function1();
                break;
            case 5:
                // function1();
                break;
            case 6:
                // function1();
                break;
        }
    })
    .catch(err => console.error(err));
}

const viewDepartment = async () => {
    let data = {};
    try {
        data = await db.query(`SELECT * FROM department`);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
    console.table(data[0]);
    main();
}

const viewRole = async () => {
    let data = {};
    try {
        data = await db.query(
        `SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON department.id = role.department_id`
        );
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
    console.table(data[0]);
    main();
}

const viewEmployee = async () => {
    let data = {};
    try {
        data = await db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`
        );
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
    
    console.log(data[0]);
    data[0].forEach((employee) => {
        if(!employee.manager) {
            return;
        }
        employee.manager = data[0][employee.manager-1].first_name + ' ' + data[0][employee.manager-1].last_name;
        return;
    });

    console.table(data[0]);
    main();
}