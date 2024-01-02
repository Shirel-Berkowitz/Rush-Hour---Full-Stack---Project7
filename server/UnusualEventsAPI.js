const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const unusualEventsRouter = express.Router();

//////GET//////

unusualEventsRouter.get("/api/unusualevents", async (req, res) => {
  

    const getUEventsQuery = "SELECT * FROM unusualevents ";
    let result;
  
    try {
      result = await databaseConnection.query(getUEventsQuery);
      console.log(result);
      if (!result.length) {
        
        res.status(404).json({ error: "Unusual events not found" });
      } else {
        
        res.json(result);
      }
    } catch (e) {
      res.status(500).json({ error: "Error executing the query" });
      return;
    }
  
  });


  unusualEventsRouter.get("/api/unusualevents/:eventName", async (req, res) => {
    let eventName = req.params.eventName;
    console.log(eventName);
  
    const getUEventsQuery = "SELECT * FROM unusualevents WHERE eventName = ?";
    let result;
  
    try {
      result = await databaseConnection.query(getUEventsQuery, [eventName]);
      console.log(result);
      console.log("result");
      console.log(result[0].length);
  
      if ( !result[0].length ) {
        res.status(404).json({ error: "unusual events not found" });
        
      } else {
        
        
        res.json(result[0]);
      }
    } catch (e) {
      
      res.status(500).json({ error: "Error executing the query" });
    }
  });

  //////DELETE////

  unusualEventsRouter.delete("/api/unusualevents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
  
    
    const getUEventQuery = "SELECT * FROM unusualevents WHERE eventID = ? ";
    let deleteEvent;
    let selectResults;
  
    try {
      selectResults = await databaseConnection.query(getUEventQuery, [id]);
      console.log(selectResults);
    } catch (e) {
      res.status(400).send(JSON.stringify("error "));
      return;
    }
    deleteEvent= selectResults[0];
    console.log(deleteEvent);
  
    const deletEventQuery = "DELETE FROM unusualevents WHERE eventID = ? ";
    let deleteEventResult;
    try {
      deleteEventResult = await databaseConnection.query(deletEventQuery, [id]);
      
    } catch (e) {
      res.status(400).send(JSON.stringify("error "));
      return;
    }
    
    res.json(deleteEvent);
  
  
  });


  ///PUT///
  unusualEventsRouter.put("/api/unusualevents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    const { eventName, eventType, eventDate, eventVideo } = req.body;
  
    
    // Fetch the current username from the database
    const getCurrentEventnameQuery = "SELECT eventName FROM unusualevents WHERE eventID = ?";
    let currentEventname;
    try {
      currentEventname = await databaseConnection.query(getCurrentEventnameQuery, [id]);
    } catch (e) {
      res.status(500).send(JSON.stringify("Server error"));
      return;
    }
    console.log(currentEventname[0][0].eventName);
    console.log(eventName);
  
    if (currentEventname[0][0].eventName !== eventName){
      const checkEventnameQuery = "SELECT eventID FROM unusualevents WHERE eventName = ?";
      let eventnameExists;
      try {
        eventnameExists = await databaseConnection.query(checkEventnameQuery, [eventName]);
        console.log(eventnameExists[0].length);
        if (eventnameExists[0].length) {
          res.status(400).send(JSON.stringify("EventName already exists in the system, please choose another eventName"));
          return;
        }
      } catch (e) {
        res.status(500).send(JSON.stringify("Server error"));
        return;
      }
    }
   
  
    let sql = `UPDATE unusualevents SET`;
    const values = [];
  
    if (eventName !== undefined) {
      sql += ` eventName = ?,`;
      values.push(eventName);
    }
  
    if (eventType !== undefined) {
      sql += ` eventType = ?,`;
      values.push(eventType);
    }
    
    if (eventDate !== undefined) {
      sql += ` eventDate = ?,`;
      values.push(eventDate);
    }

    if (eventVideo !== undefined) {
        sql += ` eventVideo = ?,`;
        values.push(eventVideo);
      }
    // Remove the trailing comma from the SQL statement
    sql = sql.slice(0, -1);
  
    sql += ` WHERE eventID = ?`;
    values.push(id);
  
    // Execute the SQL update query
    try {
      await databaseConnection.query(sql, values);
    } catch (e) {
      res.status(400).send(JSON.stringify("error 1"));
      return;
    }
  
    // Fetch the updated user data after the update
    const getEventQuery = "SELECT * FROM unusualevents WHERE eventID = ?";
    let result;
  
    try {
      result = await databaseConnection.query(getEventQuery, [id]);
      console.log(result);
    } catch (e) {
      res.status(400).send(JSON.stringify("error 2"));
      return;
    }
  
    res.json(result[0]);
  });



  /////POST/////

  unusualEventsRouter.post("/api/unusualevents", async (req, res) => {
    const eventName = req.body.eventName;
    const eventType = req.body.eventType;
    const eventDate = req.body.eventDate;
    const eventVideo = req.body.eventVideo;
  
    if (!eventName || !eventType || !eventDate || !eventVideo) {
      res.status(400).send(JSON.stringify("Please fill in all required fields"));
      return;
    }
  
    // בדיקה אם הוידיאו כבר קיים במערכת
    const checkEventQuery = "SELECT * FROM unusualevents WHERE eventVideo = ?";
    let EventExists;
    try {
        EventExists = await databaseConnection.query(checkEventQuery, [eventVideo]);
      if (EventExists[0].length) {
        res.status(400).send(JSON.stringify("Video already exists in the system, please choose another video"));
        return;
      }
    } catch (e) {
      res.status(500).send(JSON.stringify("Server error"));
      return;
    }
  
    const postEventQuery = "INSERT INTO unusualevents (eventName, eventType, eventDate, eventVideo) VALUES (?, ?, ?, ?)";
    let result;
    try {
      result = await databaseConnection.query(postEventQuery, [eventName, eventType, eventDate, eventVideo]);
      const newEventId = result[0].insertId;
      const newEvent = { eventID: newEventId, eventName, eventType, eventDate, eventVideo };
      res.json(newEvent);
    } catch (e) {
      res.status(500).send(JSON.stringify("Server error"));
      return;
    }
  });
  
  
  
  
  
  

























module.exports = unusualEventsRouter;