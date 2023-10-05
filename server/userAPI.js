const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const usersRouter = express.Router();

// Middleware to parse JSON request bodies
// app.use(express.json());

// GET request to fetch a user by ID
// usersRouter.get("/api/users/:id", (req, res) => {
//   console.log("3");
//   const userId = req.params.id;
//   const query = "SELECT * FROM users WHERE ID = ?";

//   databaseConnection.query(query, [userId], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: "An error occurred while fetching the user." });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ error: "User not found." });
//       } else {
//         res.json(results[0]);
//       }
//     }
//   });
// });

// GET request to fetch a user's name by ID
// usersRouter.get("/api/users/:id/name", (req, res) => {
//   const userId = req.params.id;
//   console.log("4");
//   const query = "SELECT name FROM users WHERE ID = ?";

//   databaseConnection.query(query, [userId], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: "An error occurred while fetching the user's name." });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ error: "User not found." });
//       } else {
//         res.json(results[0].name);
//       }
//     }
//   });
// });

// usersRouter.get("/api/users/:username/name", (req, res) => {
//   console.log("5");
//   const userId = req.params.id;
//   const query = "SELECT name FROM users WHERE username = ?";

//   databaseConnection.query(query, [username], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: "An error occurred while fetching the user's name." });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ error: "User not found." });
//       } else {
//         res.json(results[0].name);
//       }
//     }
//   });
// });
// GET request to fetch passwords by username
// usersRouter.get("/api/users/:username/password", (req, res) => {
//   console.log("6");
//   const username = req.params.username;

//   // First, find the user ID based on the username
//   const userIdQuery = "SELECT id FROM users WHERE username = ?";
//   databaseConnection.query(userIdQuery, [username], (userIdError, userIdResults) => {
//     if (userIdError) {
//       res.status(500).json({ error: "An error occurred while fetching user ID." });
//     } else {
//       if (userIdResults.length === 0) {
//         res.status(404).json({ message: "User not found." });
//       } else {
//         const userId = userIdResults[0].id;

//         // Now that we have the user ID, fetch passwords based on that ID
//         const passwordQuery = "SELECT password FROM passwords WHERE userID = ?";
//         databaseConnection.query(passwordQuery, [userId], (passwordError, passwordResults) => {
//           if (passwordError) {
//             res.status(500).json({ error: "An error occurred while fetching passwords." });
//           } else {
//             if (passwordResults.length === 0) {
//               res.status(404).json({ message: "Passwords not found for the user." });
//             } else {
//               res.json(passwordResults);
//             }
//           }
//         });
//       }
//     }
//   });

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
  console.log("a");
  const user = {
    name: req.body.name,
    username: req.body.username,
    userRank: req.body.userRank,
  };
  const getUserQuery = `INSERT INTO users (name, username, userRank ) VALUES (?, ?, ?)`;
  let result;
  console.log("b");
  console.log(user);
  try {
    result = await databaseConnection.query(getUserQuery, [
      user.name,
      user.username,
      user.userRank,
    ]);
    console.log("c");
    console.log("result");
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("Server error"));
    console.log("d");
    return;
  }
  //res.status(200);
  res.json(user);
});

usersRouter.post("/api/users/:username/password", async (req, res) => {
  const password = {
    username: req.params.username,
    password: req.body.password,
  };
  const getUserQuery =
    "INSERT INTO passwords (username, password) VALUES (?, ?)";
  let result;

  try {
    result = await databaseConnection.query(getUserQuery, [
      password.username,
      password.password,
    ]);
    console.log("result");
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }
  //res.status(200);
  res.json(password);
});

///GET///
usersRouter.get("/api/users/login/:username", async (req, res) => {
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

// PUT request to update user details
// usersRouter.put("/api/users/:id", (req, res) => {
//   console.log("8");
//     const userId = req.params.id;
//     const { username, name, userRank } = req.body;
//     const query =
//       "UPDATE users SET username = ?, name = ?, userRank = ? WHERE ID = ?";

//     databaseConnection.query(
//       query,
//       [username, name, userRank, userId],
//       (error, results) => {
//         if (error) {
//           res
//             .status(500)
//             .json({ error: "An error occurred while updating the user." });
//         } else {
//           res.json({ message: "User updated successfully." });
//         }
//       }
//     );
//   });

// DELETE request to delete a user
// usersRouter.delete("/api/users/:id", (req, res) => {
//   console.log("9");
//   const userId = req.params.id;
//   const query = "DELETE FROM users WHERE ID = ?";

//   databaseConnection.query(query, [userId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while deleting the user." });
//     } else {
//       res.json({ message: "User deleted successfully." });
//     }
//   });
// });

module.exports = usersRouter;
