// username: webprosjekt , password:webprosjekt
// sad yoloooo toast

// mongo compass link : mongodb+srv://webprosjekt:webprosjekt@webprosjekt.x1hud.mongodb.net/test

// packages and frameworks
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();
const port = 4000;
const cors = require("cors");

// local files
require("./auth/auth");
require("./auth/managerAuth");
require("./auth/gardenerAuth");

const gardenerRoutes = require("./routes/gardenerRoutes");
const managerRoutes = require("./routes/managerRoutes");
const noAuthRoutes = require("./routes/noAuthRoutes");
const plantRoutes = require("./routes/plantRoutes");

const { Passport } = require("passport");

app.use(cors());
app.use(express.json());

// ------------- NO AUTH NEEDED ENDPOINTS -----------
app.use("/", noAuthRoutes);
app.use("/plants", plantRoutes);

// ------- AUTH NEEDED ENDPOINTS --------------

app.use(
  "/",
  passport.authenticate("jwt-GARDENER", { session: false }),
  gardenerRoutes
);
app.use(
  "/",
  passport.authenticate("jwt-MANAGER", { session: false }),
  managerRoutes
);

const dbURI = "mongodb://localhost:27017/webprosjekt";
// DATABASE
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

// Handle errors.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

db.on("error", () => {
  "Error connecting to the database!";
});
db.on("open", () => {
  console.log("We have connection to the database");
});
app.listen(port, () =>
  console.log(`Express server listening on port ${port}...`)
);
