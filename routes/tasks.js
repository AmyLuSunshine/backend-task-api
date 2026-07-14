/* express.Router() groups one resource's routes in one file. 
Mounting with app.use("/api/tasks", ...) 
adds the /api/tasks prefix — the router file itself doesn't repeat it. */
const express = require("express");
//Create an express.Router()
const tasksRouter = express.Router();
const { Task } = require("../models");
const { Op } = require("sequelize"); //Sequelize provides several operators.

function requireTitle(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "title is required" });
    // control flow: return prevents the handler
    // from falling through after already responded.
  }
  next();
}

// Add five routes on the router
// Every route sends exactly one response.

//get all tasks: get()
tasksRouter.get("/", async (req, res, next) => {
  try {
    const { search, status, minPriority } = req.query; //obj
    //console.log(req.query, search);
    /*    //Conditional Object Spreading
    const where = {
      ...(search && { title: { [Op.iLike]: `%${search}` } }),
      ...(status && { status }),
      ...(minPriority && { priority: { [Op.gte]: Number(minPriority) } }),
    }; */

    /* 
    //The where claus is used to filter the query.
    //There are lots of operators to use for the where clause, available as Symbols from Op.

    Build up a where object, adding a condition only for the filters that were actually passed:
      exact match for status → where.status = status
      "contains" for search → Op.iLike with %value%
      "greater than or equal" for minPriority → Op.gte 
*/

    /* 
    starting with an empty object (const where = {};)
    and using if statements, 
    filters are only added to the query if they actually exist in the request.
    */
    const where = {};

    // status: { [Op.in]: [$`{ status }`] },
    // where clause has the database data, then compare it with the req.query from user UI？
    //Sequelize looks at the KEYS of where{} object to know which database columns to filter.
    //where object {key : value} pair
    // Keys must match Database Model - model defines columns like title and priority
    // Value is from the request.query

    //Op.in — matches any value in a list, e.g. { [Op.in]: ["todo", "doing"] }
    if (status) {
      where.status = status; // exact match, where.key = req.uery
    }

    //Op.iLike (or Op.like) — text contains, with % as the wildcard. iLike ignores case.
    //For Op.iLike, need the % wildcards to find matches anywhere inside the text (e.g., `%${search}%`).
    // Without them, it acts exactly like an exact match.
    // Tasks: title priority status
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` }; // contains, case-insensitive
    }

    //Always Number() a query value before a numeric comparison — req.query values are always strings.
    //Op.gte / Op.lte — greater/less than or equal (numbers, dates)
    if (minPriority) {
      where.priority = { [Op.gte]: Number(minPriority) };
    }

    // findAll() returns every row in the table as an array of model instances.
    const tasks = await Task.findAll({ where });
    // Send a JSON response
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(404);
    /* Notice the return before each early res.status(404) 
    — without it, the code keeps running and you crash with "headers already sent." */
  }
});

// It's the server-side cousin of React Router's * route:
// one runs on the server, the other in the browser.

// get one task by id (use findByPk)
tasksRouter.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByPk(Number(req.params.id)); //params are always strings — convert to Number
    /* findByPk finds a row by its primary key (the id), 
    and returns null (never undefined) when there's no match. */
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
    // return res.status(404);
  }
});

// create a task from req.body - post()
//  findByPk() looks up a single row by its primary key.
// It returns null (not undefined) when nothing matches — always check before responding.

// add the requireTitle-middleware as extra argument, before the async handler
//The route look like “path, middleware, handler”.
tasksRouter.post("/", requireTitle, async (req, res, next) => {
  try {
    const userRequest = req.body; // it's just request body

    if (!userRequest) {
      return res.status(400).json("request-body checking error");
    }
    //Sequelize validation, Task.create(...) handle model validation
    // it throws an error, execution jump to catch error
    const newTask = await Task.create(userRequest); //tell module to create info
    res.status(201).json(newTask); //response the user
  } catch (error) {
    //catch sequelize validation error
    console.log("POST CATCH ERROR SECTION", error);
    if (error.name === "SequelizeValidationError") {
      // Map through the array of errors to compile a clean list of messages
      //const messages = error.errors.map((err) => err.messag);
      // return res.status(400).json({ error: messages });
      console.log(error);
      return res.status(400).json({ error: error.errors[0].message });
    }
    next(error); // anything else, like server error
    // hand anything unexpected to the central error handler
  }
});

// update a task
tasksRouter.patch("/:id", async (req, res, next) => {
  try {
    //1.get the new Task from request body
    //2.find the task to be updated
    const newTask = req.body;

    const id = Number(req.params.id); //params are always strings — convert to Number
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    //3.update the task with new Task
    await task.update(newTask);
    res.status(200).json(task);
  } catch (error) {
    // return res.status(404);
    next(error);
  }
});

tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    //1.get id from req.params
    //2.findById
    //3.destroy
    const id = Number(req.params.id);
    const deleteTask = await Task.findByPk(id);

    if (!deleteTask) {
      res.status(404).json({ error: "Task not found" });
      // json({JavaScript - key, value pair})
      // JS: {error: "Task not found"}
      // JSON:  {"error": "Task not found"}
    }

    await deleteTask.destroy(); // filter() is for front end, express stuff

    //res.status(204).send();
    res.sendStatus(204); // status 204 need the send
  } catch (error) {
    // return res.status(404);
    next(error);
  }
});

module.exports = tasksRouter;
