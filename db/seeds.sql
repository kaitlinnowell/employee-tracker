INSERT INTO departments (name)
VALUES ('Sales'),
        ('Engineering'),
        ('Legal'),
        ('Finance');

INSERT INTO roles (title, salary, department)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 4),
        ('Accountant', 125000, 4),
        ('Legal Team Lead', 250000, 3),
        ('Lawyer', 190000, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, null),
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3, null),
        ('Kevin', 'Tupic', 4, 3),
        ('Kunal', 'Singh', 5, null),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7, null),
        ('Tom', 'Allen', 8, 7);