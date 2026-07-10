//One Sequelize instance, exported once, imported everywhere.
// That is your one connection.

//import Sequelize class from the sequelize package
const { Sequelize } = require("sequelize");

//create one new Sequelize instance
const db = new Sequelize(
  // connection string points at database
  "postgres://postgres:Luyangmei123@localhost:5432/task_api",
  // "postgres://user:password@localhost:5432/task_api" // 5432 - database itself
  { logging: false },
  //tells the database engine to stop printing its behind-the-scenes work to your terminal.
  //By default, Sequelize is incredibly noisy.Every time it interacts with your PostgreSQL database
  //it prints the exact raw SQL query it ran directly into your console.
);

module.exports = db;

/* database GUI (Postico / Beekeeper / pgAdmin) can see tables.
Table has a UserId column that Sequelize added */
