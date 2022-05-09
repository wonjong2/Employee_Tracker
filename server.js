const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Ajtwlssha123!',
        database: 'employee_db'
    }
)

if(!db) {
    console.log('Connected to the employee_db database');
}

const options = [
    'View All Departments',
    'View All Roles',
    'View All Employees',
    'Add A Department',
    'Add A Role',
    'Add An Employee',
    'Update An Employee Role'
];

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
            // function1();
            break;
        case 1:
            // function1();
            break;
        case 2:
            // function1();
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