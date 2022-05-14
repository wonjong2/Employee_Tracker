const Views = {
    DEPARTMENTS: "department",
    ROLES: "role",
    EMPLOYEE: "employee",
}

const viewData = async (db, select) => {
    const queries = {
        [Views.DEPARTMENTS]: `SELECT * 
        FROM department
        ORDER BY id`,
        [Views.ROLES]: `SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON department.id = role.department_id
        ORDER BY role.id`,
        [Views.EMPLOYEES]: `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY employee.id`
    };

    // let data = {};
    try {
        // Read all date from the department table
        let [data] = await db.query(queries[select]);

        // Put the manager's name instead of mananger_id into employee.manager to display it
        if(select === Views.EMPLOYEES){
            data.forEach((employee) => {
                if(!employee.manager) {
                    return;
                }
                const manager = data[employee.manager-1];
                employee.manager = `${manager.first_name} ${manager.last_name}`;
            });
        }
        console.table(data);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const viewEmployeesByManager = async (db) => {
    try {
        let [employeeList] = await db.query(`SELECT id, first_name, last_name FROM employee`);
        // Sort employee lists ordered by manager_id
        let [sortedEmployeeList] = await db.query(`SELECT manager_id AS manager, id, first_name, last_name FROM employee ORDER BY manager`);

        // Replace manager_id with manager's name
        sortedEmployeeList.forEach((employee) => {
            if(!employee.manager) {
                return;
            }
            const manager = employeeList[employee.manager-1];
            employee.manager = `${manager.first_name} ${manager.last_name}`;
            return;
        });

        console.table(sortedEmployeeList);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const viewEmployeesByDept = async (db) => {
    try {
        let [employeeList] = await db.query(`SELECT department.name AS department, employee.id, employee.first_name, employee.last_name 
        FROM employee
        JOIN role ON role.id = employee.role_id
        JOIN department ON department.id = role.department_id
        ORDER BY department`);

        console.table(employeeList);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

const viewUtilizedBudget = async (db) => {
    try {
        let [budgetList] = await db.query(`SELECT SUM(role.salary) AS Total_Utilized_Budget, department.name AS department 
        FROM employee
        JOIN role ON role.id = employee.role_id
        JOIN department ON department.id = role.department_id
        GROUP BY department.name`);

        console.table(budgetList);
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }    
}

module.exports = {Views, viewData, viewEmployeesByManager, viewEmployeesByDept, viewUtilizedBudget};