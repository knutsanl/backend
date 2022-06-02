const express = require("express");
const passport = require("passport");
const router = express.Router();

// local files
const gardenerController = require("../controllers/gardenerController");

// See your own profile, auth checks that the user is either a manager or a gardener
router.get(
  "/profile",
  passport.authenticate("jwt-GARDENER", { session: false }),
  gardenerController.seeOwnProfile
);

// modify your own profile, response is the user with the previous data
router.patch(
  "/profile/update",
  passport.authenticate("jwt-GARDENER", { session: false }),
  gardenerController.updateYourOwnUser
);

// task Related

router.patch("/plants/:plantID?/water", gardenerController.taskWater);

router.patch("/plants/:plantID?/fertilize", gardenerController.taskFertilize);

module.exports = router;
