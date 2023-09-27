console.log("userAPI");
const express = require("express");

const {databaseConnection} = require("./connectionDB.js"); // Import your database connection object

const usersRouter= express.Router();


// Middleware to parse JSON request bodies
// app.use(express.json());





//GET request to fetch all users
// usersRouter.get("/api/users", (req, res) => {
//   console.log("1");
//   databaseConnection.query(
//     "SELECT * FROM users",
//     (error, results) => {
//       if (error) {
//         res.status(500).json({ error: "An error occurred while fetching users." });
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });

// POST request to fetch a user by username
// usersRouter.post("/api/users/:username",async (req, res) => {
//   console.log("2");
//   const username = req.params.username;
//   const query = "SELECT * FROM users WHERE username = ?";

//   let results;
//   try{
//     results=await databaseConnection.query(query, [username]) 
//   }catch(e){
//     res.status(400).send(JSON.stringify("something went wrong,plese try again"));
//     return;
//   }
//       if (results.length === 0) {
//         res.status(404).json({ message: "User not found." });
//       } else {
//         res.json(results[0]);
//       }
//     }
//  );


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

// POST request to create a new user
// usersRouter.post("/api/users", (req, res) => {
//   console.log("7");
//   const { username, name, userRank } = req.body;
//   const query = "INSERT INTO users (username, name, userRank) VALUES (?, ?, ?)";

//   databaseConnection.query(
//     query,
//     [username, name, userRank],
//     (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ error: "An error occurred while creating a user." });
//       } else {
//         res.json({
//           message: "User created successfully.",
//           userId: results.insertId,
//         });
//       }
//     }
//   );
// });














usersRouter.post('/api/users/login', async (req, res) => {
  console.log("yes");
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
  
    // Query to get the user's ID based on the username
    const getIdQuery = `SELECT id FROM users WHERE username = ?`;

    let results1;
    
    try{
      results1 = await databaseConnection.query(getIdQuery, [username]);
      console.log(results1);
    }catch(e){
      res.status(400).send(JSON.stringify("Server error"));
       return; 
    }
  
    
  
      if (results1.length === 0) {
        return res.status(401).json({ message: 'Username not found' });
      }
      

      const userId = results1[0][0].id;
      console.log(userId);
  
      // Query to get the user's password based on the ID
      const getPasswordQuery = `SELECT password FROM passwords WHERE userID = ?`;

      let results2;
      
      
    try{
      results2 = await databaseConnection.query(getPasswordQuery, [userId]);
      console.log(results2);
    }catch(e){
      res.status(400).send(JSON.stringify("Server error"));
      console.log("results");
       return; 
    }
  
      
  
        if (results2.length === 0) {
          return res.status(500).json({ message: 'User password not found' });
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
            return res.status(500).json({ message: 'User name not found' });
         }

        const userName = nameResults[0][0].name;
        console.log(userName);

  
        if (userPassword === password) {
          // Password is correct
          return res.json({ success: true, message: 'Login successful' });
        } else {
          // Password is incorrect
          return res.status(401).json({ message: 'Incorrect password' });
        }
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
