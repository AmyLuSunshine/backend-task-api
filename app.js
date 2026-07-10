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

const tasksRouter = require("./routes/tasks");
// mount the router
app.use("/api/tasks", tasksRouter);
//telling Express:
// "Take every route inside tasksRouter, and glue '/api/tasks' to the front of it."

// get route
//user makes a GET request to the root URL ("/")
app.get("/", (req, res) => {
  //save time,to see if database is working when turn on server and click localhost:3000
  res.redirect("/api/tasks");
});

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
  // send back a JS object{}, { status: "ok" } a made up property name
});

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
//call the function
startApp();
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
