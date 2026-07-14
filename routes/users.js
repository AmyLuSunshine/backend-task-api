const express = require("express");
// const validator = require("validator");

const usersRouter = express.Router();
const { User } = require("../models");

//GET one user by email, otherwise GET all users
//part 5------------------------------------------------------------------------------------------------
/* Add GET / that returns all users unless an email is passed 
in the query string (?email=...), in which case return just that one user. */
usersRouter.get("/", async (req, res) => {
  try {
    //1. get the email from query string

    const queryEmail = req.query.email; // const { email} = req.query;
    console.log("QUERY EMAIL", queryEmail);
    // Validate format using a standard regular expression
    // const realEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //2. find one user by email, and return the one user
    // if (validator.isEmail(queryEmail)) {
    if (queryEmail) {
      console.log("validate email");
      // if (realEmail.test(queryEmail)) {
      //Sequelize
      const user = await User.findOne({
        //findOne returns the first matching row, or null if there's no match.
        where: { email: queryEmail },
        attributes: { exclude: ["password"] },
      });
      console.log(user);

      if (!user) {
        // null
        return res.status(400).json({ error: "No user with that email" });
      }

      //3. return/send the user
      return res.status(200).json(user, "USER: ");
    } else {
      //return all users and send them

      //1. find all users, don't find password
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, //sequelize attributes
      });

      if (!users) {
        return res.status(404).json("Users not found");
      }

      return res.status(200).json(users, "invalid email, finding all users");
    }
  } catch (error) {
    return res.status(404);
  }
});

//GET one user by id
usersRouter.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

//CREATE a user
usersRouter.post("/", async (req, res) => {
  const reqUser = req.body;
  console.log(reqUser);
  const user = await User.create(reqUser);
  console.log("creATE", reqUser);
  if (!user) return res.status(400).json({ error: "Failed to create user" });
  res.status(201).json(user);
});

//UPDATE a user by id
usersRouter.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = User.findByPk(id); //find the user
  const newUserReqBody = req.body;
  await user.update(newUserReqBody); // update the user
  res.status(200).json(user);
});

//UPDATE a user by email
usersRouter.patch("/:email", async (req, res) => {
  const email = req.params.email;
  if (email) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(400).json("no user found");
    res.status(200).json(user);
  }
});

//DELETE a user by id
usersRouter.delete("/:id", async (req, res) => {
  const user = await User.findByPk(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  await user.destroy();
  res.sendStatus(204);
});

//DELETE a user by email
usersRouter.delete("/:email", async (req, res) => {
  const email = req.params.email;
  if (email) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.sendStatus(204);
  }
});

module.exports = usersRouter;

/* 
validated email -> 1 user
.....unvalidated email: no email, wrong email, nothing - > all user

whole databeae = all users = 1 user

*/
