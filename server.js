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
                viewData('department');
                break;
            case 1:
                viewData('role');
                break;
            case 2:
                viewData('employee');
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

const viewData = async (whichData) => {
    let data = {};

    try {
        console.log(whichData);
        data = await db.query(`SELECT * FROM ${whichData}`);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }

    console.table(data[0]);
    main();
}