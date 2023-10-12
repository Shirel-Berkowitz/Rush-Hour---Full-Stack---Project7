
const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const cameraRouter = express.Router();


///GET///
cameraRouter.get("/api/camera/:ID", async (req, res) => {
  let cameraID = parseInt(req.params.ID);

  const getCameraQuery = "SELECT * FROM cameras WHERE ID = ?";
  let result;
  
  try {
    result = await databaseConnection.query(getCameraQuery, [cameraID]);
    console.log(result);
    //console.log(result[0]);
    
  } catch (error) {
    console.error("Error fetching camera access:", error);
    res.status(400).send(JSON.stringify("An error occurred while fetching camera access"));
    
  }
  res.json(result);
});



// GET request to fetch all cameras
//api/camera/${camera.cameraID}
// cameraRouter.get("/cameras", (req, res) => {
//   databaseConnection.query("SELECT * FROM cameras", (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while fetching cameras." });
//     } else {
//       res.json(results);
//     }
//   });
// });

// GET request to fetch a camera by ID
// cameraRouter.get("/cameras/:id", (req, res) => {
//   const cameraId = req.params.id;
//   const query = "SELECT * FROM cameras WHERE ID = ?";

//   databaseConnection.query(query, [cameraId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while fetching the camera." });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ message: "Camera not found." });
//       } else {
//         res.json(results[0]);
//       }
//     }
//   });
// });

// cameraRouter.get("/api/cameraAccess/:cameraID", async (req, res) => {
//   let cameraID = req.params.cameraID;
//   console.log(cameraID);

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

// POST request to create a new camera
// cameraRouter.post("/cameras", (req, res) => {
//   const { location, junction, video } = req.body;
//   const query =
//     "INSERT INTO cameras (location, junction, video) VALUES (?, ?, ?)";

//   databaseConnection.query(
//     query,
//     [location, junction, video],
//     (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ error: "An error occurred while creating a camera." });
//       } else {
//         res.json({
//           message: "Camera created successfully.",
//           cameraId: results.insertId,
//         });
//       }
//     }
//   );
// });

// PUT request to update camera details
// cameraRouter.put("/cameras/:id", (req, res) => {
//   const cameraId = req.params.id;
//   const { location, junction, video } = req.body;
//   const query =
//     "UPDATE cameras SET location = ?, junction = ?, video = ? WHERE ID = ?";

//   databaseConnection.query(
//     query,
//     [location, junction, video, cameraId],
//     (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ error: "An error occurred while updating the camera." });
//       } else {
//         res.json({ message: "Camera updated successfully." });
//       }
//     }
//   );
// });

// DELETE request to delete a camera
// cameraRouter.delete("/cameras/:id", (req, res) => {
//   const cameraId = req.params.id;
//   const query = "DELETE FROM cameras WHERE ID = ?";

//   databaseConnection.query(query, [cameraId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while deleting the camera." });
//     } else {
//       res.json({ message: "Camera deleted successfully." });
//     }
//   });
// });

module.exports = cameraRouter;



