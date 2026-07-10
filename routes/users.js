const express = require("express");
const validator = require("validator");

const userRouter = express.Router();
const { User } = require("../models");
//part 5------------------------------------------------------------------------------------------------
/* Add GET / that returns all users unless an email is passed 
in the query string (?email=...), in which case return just that one user. */
userRouter.get("/", async (req, res) => {
  try {
    //1. get the email from query string
    const reqQuery = req.query();
    const queryEmail = req.query.email; // const { email} = req.query;
    // Validate format using a standard regular expression
    // const realEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //2. find one user by email, and return the one user
    if (validator.isEmail(queryEmail)) {
      // if (realEmail.test(queryEmail)) {
      //Sequelize
      const user = await userRouter.findOne({
        where: { email: reqQuery },
        attributes: { exclude: ["password"] },
      });
    } else {
      //return all users and send them

      //1. find all users, don't find password
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, //sequelize attributes
      });

      if (!users) {
        return res.status(404).send("Users not found");
      }

      res.status(200).json(users, "Invalid email format, finding all users");
    }
  } catch (error) {
    return res.status(404);
  }
});

module.exports = userRouter;
