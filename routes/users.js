const express = require("express");
const validator = require("validator");

const usersRouter = express.Router();
const { User } = require("../models");
//part 5------------------------------------------------------------------------------------------------
/* Add GET / that returns all users unless an email is passed 
in the query string (?email=...), in which case return just that one user. */
usersRouter.get("/", async (req, res) => {
  try {
    //1. get the email from query string
    const reqQuery = req.query;
    const queryEmail = req.query.email; // const { email} = req.query;
    console.log(queryEmail);
    // Validate format using a standard regular expression
    // const realEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //2. find one user by email, and return the one user
    if (validator.isEmail(queryEmail)) {
      console.log("validate email");
      // if (realEmail.test(queryEmail)) {
      //Sequelize
      const user = await User.findOne({
        where: { email: queryEmail },
        attributes: { exclude: ["password"] },
      });
      console.log(user);
      //3. return/send the user
      res.status(200).json(user);
    } else {
      //return all users and send them

      //1. find all users, don't find password
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, //sequelize attributes
      });

      if (!users) {
        return res.status(404).send("Users not found");
      }

      res.status(200).json(users, "invalid email, finding all users");
    }
  } catch (error) {
    return res.status(404);
  }
});

module.exports = usersRouter;

/* 
validated email -> 1 user
.....unvalidated email: no email, wrong email, nothing - > all user

whole databeae = all users = 1 user

*/
