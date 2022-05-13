const inquirer = require('inquirer');

const Delete = {
    DEPARTMENT: "department",
    ROLE: "role",
    EMPLOYEE: "employee",
}

const deleteData = async (db, select) => {
    const queries = {
        [Delete.DEPARTMENT]: `SELECT id AS value, name FROM department`,
        [Delete.ROLE]: `SELECT id AS value, title AS name FROM role`,
        [Delete.EMPLOYEE]: `SELECT id AS value, first_name AS name, last_name FROM employee`
    };

    try {
        // Create the deptList with data from the department table, it will be used as a 'choices' in inquirer.prompt
        let data = await db.query(queries[select]);
        data = data[0];

        if(select === Delete.EMPLOYEE){
            data.forEach((employee) => {
                employee.name = `${employee.name} ${employee.last_name}`;
            });
        }

        const {id} = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: 'What do you want to delete?',
                        choices: data,
                        pageSize: data.length
                    }
                ]);

        console.log(id);
        await db.query(`DELETE FROM ${select} WHERE id = ?`, id);
        console.log(`Deleted the selected ${select} from the database`);
        return;
    }
    catch {
        console.error(`Error in Reading DB`);
        return;
    }
}

module.exports = {Delete, deleteData};