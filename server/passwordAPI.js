
const express = require("express");
const databaseConnection = require("./index.js"); // Import your database connection object

const passwordRouter = express.Router();





// POST request to add a password for a user
passwordRouter.post("/api/passwords", (req, res) => {
  const { userID, password } = req.body;
  const query = "INSERT INTO passwords (userID, password) VALUES (?, ?)";

  databaseConnection.query(query, [userID, password], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while adding a password." });
    } else {
      res.json({
        message: "Password added successfully.",
        passwordId: results.insertId,
      });
    }
  });
});

// PUT request to update a user's password
passwordRouter.put("/api/passwords/:userId", (req, res) => {
  const userId = req.params.userId;
  const { password } = req.body;
  const query = "UPDATE passwords SET password = ? WHERE userID = ?";

  databaseConnection.query(query, [password, userId], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the password." });
    } else {
      res.json({ message: "Password updated successfully." });
    }
  });
});

// DELETE request to delete a user's password
passwordRouter.delete("/api/passwords/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "DELETE FROM passwords WHERE userID = ?";

  databaseConnection.query(query, [userId], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the password." });
    } else {
      res.json({ message: "Password deleted successfully." });
    }
  });
});

module.exports = passwordRouter;
