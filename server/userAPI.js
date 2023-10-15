const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const usersRouter = express.Router();



///POST///
usersRouter.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  // Query to get the user's ID based on the username
  const getIdQuery = `SELECT id FROM users WHERE username = ?`;

  let results1;

  try {
    results1 = await databaseConnection.query(getIdQuery, [username]);
  } catch (e) {
    res.status(400).send(JSON.stringify("Server error"));
    return;
  }

  if (results1.length === 0) {
    return res.status(401).json({ message: "Username not found" });
  }

  const userId = results1[0][0].id;
  console.log(userId);

  // Query to get the user's password based on the ID
  const getPasswordQuery = `SELECT password FROM passwords WHERE userID = ?`;

  let results2;

  try {
    results2 = await databaseConnection.query(getPasswordQuery, [userId]);
    console.log(results2);
  } catch (e) {
    res.status(400).send(JSON.stringify("Server error"));
    return;
  }

  if (results2.length === 0) {
    return res.status(500).json({ message: "User password not found" });
  }

  const userPassword = results2[0][0].password;
  console.log(userPassword);

  const getNameQuery = `SELECT name FROM users WHERE id = ?`;

  let nameResults;

  try {
    nameResults = await databaseConnection.query(getNameQuery, [userId]);
    console.log(nameResults);
  } catch (e) {
    res.status(400).send(JSON.stringify("Server error"));
    console.log("results");
    return;
  }

  if (nameResults.length === 0) {
    return res.status(500).json({ message: "User name not found" });
  }

  const userName = nameResults[0][0].name;

  if (userPassword === password) {
    // Password is correct

    res.json(username);
  } else {
    // Password is incorrect

    return res.status(401).json({ message: "Incorrect password" });
  }
});

usersRouter.post("/api/users", async (req, res) => {
  const user = {
    name: req.body.name,
    username: req.body.username,
    userRank: req.body.userRank,
  };
  const postUserQuery = `INSERT INTO users (name, username, userRank ) VALUES (?, ?, ?)`;
  let result;
  console.log(user);
  try {
    result = await databaseConnection.query(postUserQuery, [
      user.name,
      user.username,
      user.userRank,
    ]);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("Server error"));
    return;
  }
  res.json(user);
});



///GET///
usersRouter.get("/api/users/:username", async (req, res) => {
  let username = req.params.username;

  const getUserQuery = "SELECT * FROM users WHERE username = ?";
  let result;

  try {
    result = await databaseConnection.query(getUserQuery, [username]);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result[0]);
});


usersRouter.get("/api/users", async (req, res) => {
  

  const getUserQuery = "SELECT * FROM users ";
  let result;

  try {
    result = await databaseConnection.query(getUserQuery);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result);
});

usersRouter.get("/api/users/:userRank", async (req, res) => {
  let userRank = req.params.userRank;
  

  const getUserQuery = "SELECT * FROM users WHERE userRank = ? ";
  let result;

  try {
    result = await databaseConnection.query(getUserQuery, [userRank]);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result);
});





///PUT///
usersRouter.put("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, username ,userRank } = req.body;

  let sql = `UPDATE users SET`;
  const values = [];

  if (name !== undefined) {
    sql += ` name = ?,`;
    values.push(name);
  }

  if (username !== undefined) {
    sql += ` username = ?,`;
    values.push(username);
  }
  if (userRank !== undefined) {
    sql += ` userRank = ?,`;
    values.push(userRank);
  }
  // Remove the trailing comma from the SQL statement
  sql = sql.slice(0, -1);

  sql += ` WHERE ID = ?`;
  values.push(id);

  // Execute the SQL update query
  try {
    await databaseConnection.query(sql, values);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  // Fetch the updated user data after the update
  const getUserQuery = "SELECT * FROM users WHERE ID = ?";
  let result;

  try {
    result = await databaseConnection.query(getUserQuery, [id]);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result[0]);

});

///DELETE/// 
usersRouter.delete("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  

  const deletPassQuery = "DELETE FROM passwords WHERE userID = ? ";
  let deletePassResult;

  try {
    deletePassResult = await databaseConnection.query(deletPassQuery, [id]);
    console.log(deletePassResult);
  } catch (e) {
    res.status(400).send(JSON.stringify("error 1"));
    return;
  }
  const deletCamAccQuery = "DELETE FROM cameraAccess WHERE userID  = ? ";
  let deleteCamAccResult;

  try {
    deleteCamAccResult = await databaseConnection.query(deletCamAccQuery, [id]);
    console.log(deleteCamAccResult);
  } catch (e) {
    res.status(400).send(JSON.stringify("error 2"));
    return;
  }
  const getUserQuery = "SELECT * FROM users WHERE ID = ? ";
  let deleteUser;
  let selectResults;

  try {
    selectResults = await databaseConnection.query(getUserQuery, [id]);
    console.log(selectResults);
  } catch (e) {
    res.status(400).send(JSON.stringify("error 3"));
    return;
  }
  deleteUser= selectResults[0];
  console.log(deleteUser);

  const deletUserQuery = "DELETE FROM users WHERE ID = ? ";
  let deleteUserResult;
  try {
    deleteUserResult = await databaseConnection.query(deletUserQuery, [id]);
    
  } catch (e) {
    res.status(400).send(JSON.stringify("error 4"));
    return;
  }
  
  res.json(deleteUser);


});



module.exports = usersRouter;
