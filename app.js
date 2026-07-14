//(mount the router + redirect the home route)
/* res.redirect("/api/tasks") tells the client 
"go make a fresh request over there instead." 
Here it's a convenience. In Week 7 it's the backbone of auth: 
"not logged in → res.redirect('/login')." Same one line. */

const express = require("express"); // require express
const app = express(); //create the app, an express server variable (name)
app.use(express.json()); //app can read JSON request bodies

const PORT = 3000;

// nonono // const db = require("./db");
// import db, only getting the raw, blank connection to PostgreSQL
const { db } = require("./models");

//A middleware function is a function with the shape (req, res, next).
//logs the method and URL， just a simple function myFun()
async function loggerMiddleware(req, res, next) {
  await console.log(req.method, req.originalUrl);
  next();
  //Forgetting next(),will hang the request forever — nothing after it ever runs.
}
//Register the middleware with app.use(logger) above your routes.
app.use(loggerMiddleware); // call the function
//app.use(fn) runs on every request registered after it — order matters.

// (add the mount)
const tasksRouter = require("./routes/tasks");
const usersRouter = require("./routes/users");

// mount the router
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
//telling Express:
// "Take every route inside tasksRouter, and glue '/api/tasks' to the front of it."

//404 CATCH ALL, runs only when no route above it matched.
//No path, runs after all routes.
app.use((req, res) => {
  return res.sendStatus(404).json({ error: "Not found" });
});

// get route
//user makes a GET request to the root URL ("/")
app.get("/", (req, res) => {
  //save time,to see if database is working when turn on server and click localhost:3000
  res.redirect("/api/tasks");
});

/* app.get("/health", (req, res) => {
  res.send({ status: "ok" });
  // send back a JS object{}, { status: "ok" } a made up property name
});
 */
//call db sync before server listens, so tables get created
// so no request can arrive before the table is ready.
//-------------------------------------------------
async function startApp() {
  //wait for the database
  await db.sync();

  //Start the express app, tell the app to listen on port 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
// //call the function
// startApp();
//----------------------------------------------------
/* 
//classic Promise chain .then()
//=== does the exact same thing: it waits for the database to finish syncing 
// before turning the server on.
db.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
 */

/* db.sync() reads your models and reshapes the tables to match. 
Handy for learning — but it can silently drop a column, 
and sync({ force: true }) deletes all data. 
Never point { force: true } at real data. */

// sync() vs. migrations

//Central error handler. At the very bottom of app.js
// (after the 404 catch-all), add an error-handling middleware
//  — the one with four parameters (err, req, res, next).
// Error-handling middleware: FOUR params, and it lives LAST
app.use((err, req, res, next) => {
  // const errorMessages = err.map((er) => er.message); // ?
  // console.log(errorMessages);

  console.error(err);
  return res.status(500).json({ error: "Something went wrong" });
});
//Four parameters and the error handler must be last.
//it's reached by calling next(err) from a catch.

//call the function
startApp();
