const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dashboardRoutes = express.Router();
const PORT = 4000;

//The model for Dashboard
let Dash = require("./dash.model");

app.use(cors());
app.use(bodyParser.json());

//Establishing the connection with mongodb through mongoose
mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// the route for adding the informations about the doctors in DB
dashboardRoutes.route("/add/:id").post(function(req, res) {
  var d = new Date();
  let dash = new Dash({
    medid: req.params.id,
    date: d
  });
  dash
    .save()
    .then(dash => {
      res.status(200).json({ dash: "dash added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new object failed");
    });
});

//Testing end point to see the Data in DB
dashboardRoutes.route("/list").get(async function(req, res) {
  let i;
  i = await Dash.find({ hour: 10 });
  console.log("count " + i);
  Dash.find(function(err, dashes) {
    if (err) {
      console.log(err);
    } else {
      res.json(dashes);
    }
  });
});

//find the number of vistor for a spesfic doctor each month of this year
dashboardRoutes.route("/month/:id").get(async function(req, res) {
  let i = [];
  let D = new Date();
  let Y = new Date();
  let Data = [];
  Data = await Dash.find()
    .where("medid")
    .equals(req.params.id);
  for (var j = 0; j < 13; j++) {
    i[j] = 0;
    Data.forEach(element => {
      D = new Date(element.date);
      if (j === D.getMonth() && D.getFullYear() === Y.getFullYear()) {
        i[j]++;
      }
    });
  }
  res.json(i);
});

//comparing the number of the visitors between the last two month
dashboardRoutes.route("/twomonth/:id").get(async function(req, res) {
  let Data = [];
  Data = await Dash.find()
    .where("medid")
    .equals(req.params.id);

  let d = new Date();
  let thismonth = d.getMonth();
  let lastmonth = d.getMonth() - 1;
  let Y = new Date();
  if (lastmonth < 0) {
    lastmonth = 11;
  }
  let i = [];
  let j = [];
  let n = 0;
  for (var k = 0; k < 6; k++) {
    i[k] = 0;
    j[k] = 0;
    Data.forEach(element => {
      DD = new Date(element.date);
      console.log(DD.getUTCDate());
      if (
        thismonth === DD.getMonth() &&
        DD.getFullYear() === Y.getFullYear() &&
        DD.getUTCDate() >= n &&
        DD.getUTCDate() <= n + 5
      ) {
        i[k]++;
      }

      if (
        lastmonth === DD.getMonth() &&
        DD.getFullYear() === Y.getFullYear() &&
        DD.getUTCDate() >= n &&
        DD.getUTCDate() <= n + 5
      ) {
        j[k]++;
      }
    });
    n = n + 6;
  }

  res.json([i, j]);
});
//geting the statstic of the visitors for the current day around the 24 hours
dashboardRoutes.route("/heur/:id").get(async function(req, res) {
  var d = new Date();
  var thismonth = d.getMonth();
  var thisday = d.getUTCDate();
  var thisyear = d.getFullYear();

  let i = [];
  let n = 0;
  let Data = [];
  Data = await Dash.find()
    .where("medid")
    .equals(req.params.id);
  for (var k = 0; k < 7; k++) {
    i[k] = 0;
    Data.forEach(element => {
      DD = new Date(element.date);
      if (
        thismonth === DD.getMonth() &&
        DD.getFullYear() === thisyear &&
        DD.getUTCDate() === thisday &&
        DD.getHours() >= n &&
        DD.getHours() <= n + 3
      ) {
        i[k]++;
      }
    });
    n = n + 4;
  }

  res.json(i);
});

//geting the top 3 doctors
dashboardRoutes.route("/top3").get(async function(req, res) {
  var top;
  Dash.aggregate(
    [
      {
        $group: {
          _id: "$medid", //$region is the column name in collection
          count: { $sum: 1 }
        }
      }
    ],
    function(err, result) {
      if (err) {
        next(err);
      } else {
        result.sort(function(a, b) {
          return a.count < b.count;
        });
        let names = [];
        let values = [];
        if (result[0]) {
          names[0] = "Med ID = " + result[0]._id;
          values[0] = result[0].count;
        }
        if (result[1]) {
          names[1] = "Med ID = " + result[1]._id;
          values[1] = result[1].count;
        }
        if (result[2]) {
          names[2] = "Med ID = " + result[2]._id;
          values[2] = result[2].count;
        }
        res.json([names, values]);
      }
    }
  );
});

//admin route
//find the number of vistor for a spesfic doctor each month of this year
dashboardRoutes.route("/month").get(async function(req, res) {
  let i = [];
  let D = new Date();
  let Y = new Date();
  let Data = [];
  Data = await Dash.find();
  for (var j = 0; j < 13; j++) {
    i[j] = 0;
    Data.forEach(element => {
      D = new Date(element.date);
      if (j === D.getMonth() && D.getFullYear() === Y.getFullYear()) {
        i[j]++;
      }
    });
  }
  res.json(i);
});

//comparing the number of the visitors between the last two month
dashboardRoutes.route("/twomonth").get(async function(req, res) {
  let Data = [];
  Data = await Dash.find();
  let d = new Date();
  let thismonth = d.getMonth();
  let lastmonth = d.getMonth() - 1;
  let Y = new Date();
  if (lastmonth < 0) {
    lastmonth = 11;
  }
  let i = [];
  let j = [];
  let n = 0;
  for (var k = 0; k < 6; k++) {
    i[k] = 0;
    j[k] = 0;
    Data.forEach(element => {
      DD = new Date(element.date);
      console.log(DD.getUTCDate());
      if (
        thismonth === DD.getMonth() &&
        DD.getFullYear() === Y.getFullYear() &&
        DD.getUTCDate() >= n &&
        DD.getUTCDate() <= n + 5
      ) {
        i[k]++;
      }

      if (
        lastmonth === DD.getMonth() &&
        DD.getFullYear() === Y.getFullYear() &&
        DD.getUTCDate() >= n &&
        DD.getUTCDate() <= n + 5
      ) {
        j[k]++;
      }
    });
    n = n + 6;
  }

  res.json([i, j]);
});
//geting the statstic of the visitors for the current day around the 24 hours
dashboardRoutes.route("/heur").get(async function(req, res) {
  var d = new Date();
  var thismonth = d.getMonth();
  var thisday = d.getUTCDate();
  var thisyear = d.getFullYear();

  let i = [];
  let n = 0;
  let Data = [];
  Data = await Dash.find();
  for (var k = 0; k < 7; k++) {
    i[k] = 0;
    Data.forEach(element => {
      DD = new Date(element.date);
      if (
        thismonth === DD.getMonth() &&
        DD.getFullYear() === thisyear &&
        DD.getUTCDate() === thisday &&
        DD.getHours() >= n &&
        DD.getHours() <= n + 3
      ) {
        i[k]++;
      }
    });
    n = n + 4;
  }

  res.json(i);
});

app.use("/dashboard", dashboardRoutes);
app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
