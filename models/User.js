//Validation lives on the model.
const { DataTypes } = require("sequelize"); // destructing
const db = require("../db");

const User = db.define(
  //model name
  "User",
  //model attributes
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    }, // add validate: the name can't be empty
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    }, // add validation: must be real email
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8, 100] },
    }, // add validation: pwd at least 8 char
    // setup validations and constraints for models in Sequelize
  },
);

module.exports = User;
