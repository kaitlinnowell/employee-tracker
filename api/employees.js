const { Pool } = require('pg');

//represents the database for employees
class employees {
    constructor() {
        this.pool = new Pool({
            host: 'localhost',
            user: 'postgres',
            password: 'p@ssw0rd',
            database: 'employees_db',
          });
    }

    get_all_employees(callback) {
        this.pool.query('SELECT * FROM departments', function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
        })
    }

    async get_roles() {
        try {
          const result = await this.pool.query('SELECT title, id FROM roles');
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
      
    async get_employees() {
    try {
        const result = await this.pool.query(`SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees`);
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

    async get_departments() {
    try {
        const result = await this.pool.query('SELECT name, id FROM departments');
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

    view_all_roles(callback){
        this.pool.query('SELECT roles.id, title, departments.name, salary FROM roles JOIN departments ON department = departments.id', function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          });
    }

    view_all_employees(callback){
        this.pool.query("SELECT employees.id, employees.first_name, employees.last_name, title, departments.name, salary, CASE WHEN e.id IS NULL THEN 'null' ELSE CONCAT(e.first_name, ' ', e.last_name) END AS manager  FROM employees JOIN roles ON role_id = roles.id JOIN departments ON department = departments.id LEFT JOIN employees e ON employees.manager_id = e.id;", function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              const rows = result.rows;
              console.table(rows);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          });
    }

    add_department(callback, department){
        this.pool.query(`INSERT INTO departments (name) VALUES ($1)`, [department], function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              console.log(`Added ${department} to the database`);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          })
    }

    add_role(callback, roleName, salary, department){
        this.pool.query(`INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`, [roleName, salary, department], function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              console.log(`Added ${roleName} to the database`);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          })
    }

    add_employee(callback, firstName, lastName, role, manager){
        this.pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [firstName, lastName, role, manager], function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              console.log(`Added ${firstName} ${lastName} to the database`);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          })
    }

    update_employee_role(callback, employee, role){
        this.pool.query(`UPDATE employees SET role_id = $2 WHERE id = $1`, [employee, role], function (err, result) {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              console.log(`Updated employee role`);
              if (callback) {
                callback(); // Call the callback function if provided
            }
            }
          })
    }

    connect() {
        this.pool.connect();
    }
}

module.exports = employees;

