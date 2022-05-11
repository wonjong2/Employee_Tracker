const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const table = require('console.table');
const {viewData, viewEmployeesByManager} = require('./functions/view')
const {addDepartment, addRole, addEmployee} = require('./functions/add');
const {updateEmployeeRole, updateEmployeeManagers} = require('./functions/update');

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
        {value:6, name:'Update An Employee Role'},
        {value:7, name:'Update An Employee Manager'},
        {value:8, name:'View Employees by Manager'},
    ];

    // Functions to be executed by user's choice
    const functions = [
        viewData, 
        viewData,
        viewData,
        addDepartment,
        addRole,
        addEmployee,
        updateEmployeeRole,
        updateEmployeeManagers,
        viewEmployeesByManager,
    ];

    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    name: 'option',
                    message: "What would you like to do?",
                    choices: options,
                    pageSize: options.length
                }
            ]
        )
        // All functions to get, add, update or delete data are async functions
        .then(({option}) => functions[option](db, option))
        // So, Once execution of functions completed, main() called to show option menu to a user
        .then(() => main())
        .catch(err => console.error(err));
}