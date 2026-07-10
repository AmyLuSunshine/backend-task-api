/* express.Router() groups one resource's routes in one file. 
Mounting with app.use("/api/tasks", ...) 
adds the /api/tasks prefix — the router file itself doesn't repeat it. */
const express = require("express");
//Create an express.Router()
const tasksRouter = express.Router();
const { Task } = require("../models");

// Add five routes on the router
// Every route sends exactly one response.

//get all tasks: get()
tasksRouter.get("/", async (req, res) => {
  try {
    // findAll() returns every row in the table as an array of model instances.
    const tasks = await Task.findAll();
    // Send a JSON response
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(404);
    /* Notice the return before each early res.status(404) 
    — without it, the code keeps running and you crash with "headers already sent." */
  }
});

// get one task by id (use findByPk)
tasksRouter.get("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(Number(req.params.id)); //params are always strings — convert to Number
    /* findByPk finds a row by its primary key (the id), 
    and returns null (never undefined) when there's no match. */
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    return res.status(404);
  }
});

// create a task from req.body - post()
//  findByPk() looks up a single row by its primary key.
// It returns null (not undefined) when nothing matches — always check before responding.
tasksRouter.post("/", async (req, res) => {
  try {
    const userRequest = req.body; // it's just request body
    if (!userRequest) {
      res.status(404);
    }
    const newTask = await Task.create(userRequest); //tell module to create info
    res.status(201).json(newTask); //response the user
  } catch (error) {
    return res.status(404);
  }
});

// update a task
tasksRouter.patch("/:id", async (req, res) => {
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
    return res.status(404);
  }
});

tasksRouter.delete("/:id", async (req, res) => {
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
    return res.status(404);
  }
});

module.exports = tasksRouter;


