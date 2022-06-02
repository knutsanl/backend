// dette er bare for å vise forksjellige planter
const express = require("express");
const passport = require("passport");
const router = express.Router();


// Local files
const plantController = require('../controllers/plantController');


//see all plants, response is all plants
router.get("/", 
 plantController.seeAllPlants);

// find single plant 
router.get(
  "/:plantID?", 
  plantController.seeSinglePlant
);

module.exports = router;
