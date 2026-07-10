const { db, User, Task } = require("./models");

async function seed() {
  //{ force: true } belongs only in a seed script, never in app.js.
  // In app.js it would wipe the database every time the server restarts.
  await db.sync({ force: true });
  // wipe + rebuild — only ever in a seed script

  const ny = await User.create({
    name: "ny",
    email: "ny@gmail.com",
    password: "12345678",
  });

  //Task.create({ ..., UserId: alex.id }) is how a task gets attached to a user
  //  — the foreign key is just a column you set.
  await Task.create({
    title: "eat",
    priority: 2,
    status: "done",
    UserId: ny.id,
  });

  //create a few tasks that belong to that user (pass the user's id).
  await Task.create({
    title: "code",
    status: "todo",
    UserId: ny.id,
  });

  await Task.create({
    title: "sleep",
    priority: 3,
    status: "todo",
    UserId: ny.id,
  });

  console.log("Seeded!");
  await db.close();
}

// nononononono , it's a seed script, you run it ,other than export it. //no -module.exports = seed;
seed(); // you run the seed function, it goes to the database
/* 
Every Sequelize call is async — await it, or you get a Promise instead of data.
*/
