
const mysql = require("mysql2");
const express = require("express");
const secret = require("./password.json");

const usersRouter =require('./userAPI.js')
const passwordRouter = require('./passwordAPI.js');
const cameraRouter = require('./cameraAPI.js');
const cameraAccessRouter = require('./cameraAccessAPI.js');



const app = express();
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
    next();
});
app.use(express.json());

app.use('/userAPI',usersRouter);
app.use('/passwordAPI', passwordRouter);
app.use('/cameraAPI', cameraRouter);
app.use('/cameraAccessAPI', cameraAccessRouter);





// Add CORS middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });



const port = 3000;

app.get("/", async (req, res) => {
  res.send("");
});


  app.listen(port, () => {
    console.log(`Server running at localhost:${port}/`);
  });






