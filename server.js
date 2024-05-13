//imports
const express = require('express');
const inquirer = require('inquirer');
const Employees = require('./api/employees')

//variables
var employeesInstance  = new Employees();
const app = express();
const PORT = process.env.PORT || 3001;

//main function
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
          await employeesInstance.get_all_departments(init);
          break;
        case 'view all roles':
          await employeesInstance.view_all_roles(init);
          break;
        case 'view all employees':
          employeesInstance.view_all_employees(init);
          break;
        case 'add a department':
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is the name of the department?',
              name: 'departmentName',
            },
          ]).then((data) => {
            employeesInstance.add_department(init, data.departmentName)
          });
          break;
        case 'add a role':
          let allDepartments = await employeesInstance.get_departments()
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
            employeesInstance.add_role(init, data.roleName, data.salary, data.department)
          });
          break;
        case 'add an employee':
          let allRoles = await employeesInstance.get_roles()
          let allemployees = await employeesInstance.get_employees()
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
            employeesInstance.add_employee(init, data.firstName, data.lastName, data.role, data.manager)
          });
          break;
        case 'update an employee role':
          let roles = await employeesInstance.get_roles()
          let employees = await employeesInstance.get_employees()
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
            employeesInstance.update_employee_role(init, data.employee, data.role)
          });
          break;
      }}        
  );
}

//Connect to the database
employeesInstance.connect();

//Run main
init();

app.listen(PORT, () => {
  console.log('')
});



