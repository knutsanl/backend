const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local files
const managerController = require("../controllers/managerController");

// --------- USER PROFILES RELATED ROUTES ------

// read single or all other profiles while autorized, response is other user(s)
router.get("/profiles/:userID?", managerController.seeOtherProfiles);

// create a user, response is user created
router.post("/createProfile", managerController.createProfile);

// delete a single user while if authorized as manager , response is the deleted user
router.delete(
  "/profiles/:userID?/delete",
  managerController.deleteOtherProfiles
);

// modify a users data, response is the user with the previous data
router.patch("/profiles/:userID?/update", managerController.updateOtherProfile);

// --------- PLANT RELATED ROUTES ------

// update plant information
router.patch("/plants/:plantID?/update", managerController.updatePlant);

// create a new plant
router.post("/createPlant", managerController.createPlant);

// delete a existing plant
router.delete("/plants/:plantID?/delete", managerController.deletePlant);

module.exports = router;
