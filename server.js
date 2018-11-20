
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require("./app/routes/auth-routes");
const keys = require('./config/keys');
const cookieSession = require('cookie-session');

const app = express();
const router = express.Router();

const mongoose = require("mongoose");

// Setup express server
const PORT = process.env.PORT || 3001;

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }
// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


var db = process.env.MONGODB_URI || "mongodb://localhost/gigmaker";

app.use(cookieSession({
  maxAge: 24 * 60 * 60 *1000,
  keys:[keys.session.cookieKey]
}));

//initialize passport

app.use(passport.initialize());
app.use(passport.session());

//routes

// project routes
require("./app/routes/project")(router);
// user routes

require("./app/routes/users")(router);
app.use(router);

//auth routes

app.use('/api/auth', authRoutes);

// Define API routes here



// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


app.listen(PORT, function () {
  mongoose.connect(db, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Mongodb connection succesful!");
    }

  });

  console.log("App running on port " + PORT + "!");
});

module.exports = app // for testing

/* for parsing application/x-www-form-urlencoded ~*/
// app.use(cors())
// app.use(passport.initialize())
// app.use(compression())
// app.use(helmet())
// app.use(express.static('public'))
// app.use(require('./app/routes'))
// app.listen(app.get('port'))

// // Init MongoDB
// initMongo()