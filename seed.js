const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

const DEPARTMENTS = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Product'];
const STATUSES = ['Active', 'On Leave', 'Terminated'];


function generateEmployees(count = 100) {
  const employees = [];

  for (let i = 1; i <= count; i++) {
    const department = faker.helpers.arrayElement(DEPARTMENTS);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = faker.internet.displayName({ firstName, lastName })
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const joinDate = faker.date.past({ years: 5 }).toISOString().split('T')[0];
    const birthDate = faker.date.between({ from: '2000-01-01', to: Date.now() });
    employees.push({
      id: faker.number.int({ min: 1, max: 999 }),
      firstName,
      lastName,
      userName,
      email,
      birthDate: birthDate.toISOString().split('T')[0],
      basicSalary: faker.number.int({ min: 4000, max: 15000 }),
      status: faker.helpers.arrayElement(STATUSES),
      group: department,
      description: joinDate,
    });
  }

  return { employees };
}

const dbPath = path.join(__dirname, 'db.json');
const employeesData = generateEmployees(100);
const data = {
  employees: employeesData.employees,
  users: [
    {
      "id": 1,
      "username": "admin",
      "password": "password"
    },
    {
      "id": 2,
      "username": "user",
      "password": "password"
    }
  ]
};
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('✅ Success: db.json generated with 100 fake employees!');
