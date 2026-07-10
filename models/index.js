// app can grab all the models from here in one place
const db = require("./../db"); // or just ('../db')
const User = require("./User");
const Task = require("./Task");

//declare association
User.hasMany(Task);
// pass the user's id, when create Task
Task.belongsTo(User);

//export object of models
module.exports = { db, User, Task };

/* 
The UserId foreign key appears automatically 
because you declared the association before db.sync() ran. 
Declare associations first, sync second. 
*/
