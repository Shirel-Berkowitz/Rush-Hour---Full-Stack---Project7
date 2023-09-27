console.log("cameraAPI");
const express = require("express");

const databaseConnection = require("./index.js"); // Import your database connection object

const cameraRouter = express.Router();



// GET request to fetch all cameras
cameraRouter.get("/cameras", (req, res) => {
  databaseConnection.query("SELECT * FROM cameras", (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching cameras." });
    } else {
      res.json(results);
    }
  });
});

// GET request to fetch a camera by ID
cameraRouter.get("/cameras/:id", (req, res) => {
  const cameraId = req.params.id;
  const query = "SELECT * FROM cameras WHERE ID = ?";

  databaseConnection.query(query, [cameraId], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching the camera." });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: "Camera not found." });
      } else {
        res.json(results[0]);
      }
    }
  });
});

// POST request to create a new camera
cameraRouter.post("/cameras", (req, res) => {
  const { location, junction, video } = req.body;
  const query =
    "INSERT INTO cameras (location, junction, video) VALUES (?, ?, ?)";

  databaseConnection.query(
    query,
    [location, junction, video],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .json({ error: "An error occurred while creating a camera." });
      } else {
        res.json({
          message: "Camera created successfully.",
          cameraId: results.insertId,
        });
      }
    }
  );
});

// PUT request to update camera details
cameraRouter.put("/cameras/:id", (req, res) => {
  const cameraId = req.params.id;
  const { location, junction, video } = req.body;
  const query =
    "UPDATE cameras SET location = ?, junction = ?, video = ? WHERE ID = ?";

  databaseConnection.query(
    query,
    [location, junction, video, cameraId],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .json({ error: "An error occurred while updating the camera." });
      } else {
        res.json({ message: "Camera updated successfully." });
      }
    }
  );
});

// DELETE request to delete a camera
cameraRouter.delete("/cameras/:id", (req, res) => {
  const cameraId = req.params.id;
  const query = "DELETE FROM cameras WHERE ID = ?";

  databaseConnection.query(query, [cameraId], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the camera." });
    } else {
      res.json({ message: "Camera deleted successfully." });
    }
  });
});

module.exports = cameraRouter;



