const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'p@ssw0rd',
  database: 'employees_db',
});

function init() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
    },
  ]).then(async (data) => {
      switch(data.action) {
        case 'view all departments':
          pool.query('SELECT * FROM departments', function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              init();
            }
          });
          break;
        case 'view all roles':
          pool.query('SELECT roles.id, title, departments.name, salary FROM roles JOIN departments ON department = departments.id', function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              init();
            }
          });
          break;
        case 'view all employees':
          pool.query("SELECT employees.id, employees.first_name, employees.last_name, title, departments.name, salary, CASE WHEN e.id IS NULL THEN 'null' ELSE CONCAT(e.first_name, ' ', e.last_name) END AS manager  FROM employees JOIN roles ON role_id = roles.id JOIN departments ON department = departments.id LEFT JOIN employees e ON employees.manager_id = e.id;", function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              init();
            }
          });
          break;
        case 'add a department':
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is the name of the department?',
              name: 'departmentName',
            },
          ]).then((data) => {
            pool.query(`INSERT INTO departments (name) VALUES ($1)`, [data.departmentName], function (err, result) {
              if (err) {
                console.error('Error executing query:', err);
              } else {
                console.log(`Added ${data.departmentName} to the database`);
                init();
              }
            })
          });
          break;
          case 'add a role':
            let allDepartments = await get_departments()
            inquirer.prompt([
              {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'roleName',
              },
              {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
              },
              {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'department',
                choices: allDepartments,
              },
            ]).then((data) => {
              pool.query(`INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`, [data.roleName, data.salary, data.department], function (err, result) {
                if (err) {
                  console.error('Error executing query:', err);
                } else {
                  console.log(`Added ${data.roleName} to the database`);
                  init();
                }
              })
            });
            break;
          case 'add an employee':
            let allRoles = await get_roles()
            let allemployees = await get_employees()
            inquirer.prompt([
              {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName',
              },
              {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName',
              },
              {
                type: 'list',
                message: "what is the employee's role?",
                name: 'role',
                choices: allRoles,
              },
              {
                type: 'list',
                message: "what is the employee's manager?",
                name: 'manager',
                choices: allemployees,
              },
            ]).then((data) => {
              pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [data.firstName, data.lastName, data.role, data.manager], function (err, result) {
                if (err) {
                  console.error('Error executing query:', err);
                } else {
                  console.log(`Added ${data.firstName} ${data.lastName} to the database`);
                  init();
                }
              })
            });
            break;
            case 'update an employee role':
              let roles = await get_roles()
              let employees = await get_employees()
              inquirer.prompt([
                {
                  type: 'list',
                  message: "Which employee's role do you want to update?",
                  name: 'employee',
                  choices: employees,
                },
                {
                  type: 'list',
                  message: "Which role do you want to assign the selected employee?",
                  name: 'role',
                  choices: roles,
                }
              ]).then((data) => {
                pool.query(`UPDATE employees SET role_id = $2 WHERE id = $1`, [data.employee, data.role], function (err, result) {
                  if (err) {
                    console.error('Error executing query:', err);
                  } else {
                    console.log(`Updated employee role`);
                    init();
                  }
                })
              });
              break;
      }}        
  );
}

pool.connect();

init();

app.listen(PORT, () => {
});

async function get_departments() {
  try {
    const result = await pool.query('SELECT name, id FROM departments');
    const rows = result.rows;
    const values = rows.map(({id, name}) => ({
      name: name,
      value: id
    }));
    // const values = rows.map(row => row.name);
    return values;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err; // Re-throw the error to be caught by the caller
  }
}

async function get_roles() {
  try {
    const result = await pool.query('SELECT title, id FROM roles');
    const rows = result.rows;
    const values = rows.map(({id, title}) => ({
      name: title,
      value: id
    }));
    // const values = rows.map(row => row.name);
    return values;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err; // Re-throw the error to be caught by the caller
  }
}

async function get_employees() {
  try {
    const result = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees`);
    const rows = result.rows;
    const values = rows.map(({id, name}) => ({
      name: name,
      value: id
    }));
    // const values = rows.map(row => row.name);
    return values;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err; // Re-throw the error to be caught by the caller
  }
}