
const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const cameraAccessRouter = express.Router();



// GET request to fetch camera access for a user
cameraAccessRouter.get("/api/cameraAccess/:userID", async (req, res) => {
  let userId = parseInt(req.params.userID);

  const getCameraQuery = "SELECT cameraID FROM cameraAccess WHERE userID = ?";
  let result;
  let cameraIDs;

  try {
    result = await databaseConnection.query(getCameraQuery, [userId]);
    console.log(result);
    console.log(result[0]);
    // cameraIDs = result.map((row) => row.cameraID);
    // console.log("cameraIDs");
    // console.log(cameraIDs);
    
  } catch (error) {
    console.error("Error fetching camera access:", error);
    res.status(400).send(JSON.stringify("An error occurred while fetching camera access"));
    
  }
  res.json(result[0]);
});


// cameraAccessRouter.get("/api/cameraAccess/:cameraID", async (req, res) => {
//   let cameraID = req.params.cameraID;
//   console.log(userId);

//   const getCameraQuery = "SELECT * FROM cameras WHERE ID = ?";
//   let result;
//   console.log("a");

//   try {
//     console.log("b");
//     result = await databaseConnection.query(getCameraQuery, [cameraID]);
    
       
//    } catch (e) {
//       res.status(400).send(JSON.stringify("An error occurred while fetching camera access"));
//       return;
//     }
    
//     res.json(result);
    
// });


 


// POST request to grant camera access to a user
// cameraAccessRouter.post("/cameraAccess/:userId/:cameraId", (req, res) => {
//   const userId = req.params.userId;
//   const cameraId = req.params.cameraId;
//   const query = "INSERT INTO cameraAccess (userID, cameraID) VALUES (?, ?)";

//   databaseConnection.query(query, [userId, cameraId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while granting camera access." });
//     } else {
//       res.json({ message: "Camera access granted successfully." });
//     }
//   });
// });

// DELETE request to revoke camera access from a user
// cameraAccessRouter.delete("/cameraAccess/:userId/:cameraId", (req, res) => {
//   const userId = req.params.userId;
//   const cameraId = req.params.cameraId;
//   const query = "DELETE FROM cameraAccess WHERE userID = ? AND cameraID = ?";

//   databaseConnection.query(query, [userId, cameraId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while revoking camera access." });
//     } else {
//       res.json({ message: "Camera access revoked successfully." });
//     }
//   });
// });

module.exports = cameraAccessRouter;

