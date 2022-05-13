const Views = {
    DEPARTMENTS: "departments",
    ROLES: "roles",
    EMPLOYEES: "employee",
}

const viewData = async (db, select) => {
    const queries = {
        [Views.DEPARTMENTS]: `SELECT * 
        FROM department`,
        [Views.ROLES]: `SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON department.id = role.department_id`,
        [Views.EMPLOYEES]: `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`
    };

    let data = {};
    try {
        // Read all date from the department table
        data = await db.query(queries[select]);

        // Put the manager's name instead of mananger_id into employee.manager to display it
        if(select === Views.EMPLOYEES){
            data[0].forEach((employee) => {
                if(!employee.manager) {
                    return;
                }
                employee.manager = data[0][employee.manager-1].first_name + ' ' + data[0][employee.manager-1].last_name;
                return;
            });
        }
        console.table(data[0]);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const viewEmployeesByManager = async (db) => {
    try {
        let employeeList = await db.query(`SELECT id, first_name, last_name FROM employee`);
        // Sort employee lists ordered by manager_id
        let sortedEmployeeList = await db.query(`SELECT manager_id AS manager, id, first_name, last_name FROM employee ORDER BY manager`);
        sortedEmployeeList = sortedEmployeeList[0];

        // Replace manager_id with manager's name
        sortedEmployeeList.forEach((employee) => {
            if(!employee.manager) {
                return;
            }
            employee.manager = employeeList[0][employee.manager-1].first_name + ' ' + employeeList[0][employee.manager-1].last_name;
            return;
        });

        console.table(sortedEmployeeList);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {Views, viewData, viewEmployeesByManager};