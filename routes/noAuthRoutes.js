// packages
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// local files
const noAuthController = require("../controllers/noAuthController");

const router = express.Router();

/* -------------------- Here is the sign in related routes --------*/

// logs a user in if the log in credentials match the db data
router.post("/login", noAuthController.login);

/* forgot password part 1/2. (Wanted to use the next() function)
 Check if email exist and if secret question is answered correctly.
 Also needs a newpassword to replace the old one as a query parameter.
 if all info is valid then go to part 2 */
router.patch("/forgotPassword", noAuthController.forgotPasswordPart1);

/*forgot password part 2/2.
  change user password with the query parameter entered */
router.patch("/forgotPassword", noAuthController.forgotPasswordPart2);

module.exports = router;
