require('console.table');
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const {Views, viewData, viewEmployeesByManager} = require('./functions/view')
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
        {value:(db) => viewData(db, Views.DEPARTMENTS), name:'View All Departments'},
        {value:(db) => viewData(db, Views.ROLES), name:'View All Roles'},
        {value:(db) => viewData(db, Views.EMPLOYEES), name:'View All Employees'},
        {value:addDepartment, name:'Add A Department'},
        {value:addRole, name:'Add A Role'},
        {value:addEmployee, name:'Add An Employee'},
        {value:updateEmployeeRole, name:'Update An Employee Role'},
        {value:updateEmployeeManagers, name:'Update An Employee Manager'},
        {value:viewEmployeesByManager, name:'View Employees by Manager'},
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
        .then(({option}) => option(db))
        // So, Once execution of functions completed, main() called to show option menu to a user
        .then(() => main())
        .catch(err => console.error(err));
}