const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { UserModel } = require("../model/model");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

/* --------------               This file is auth for login and forgot password endpoints,
  -                             but also common endpoints for manager and gardener                      ------------- */

/* login authorization used from file /routes/noAuthRoutes in endpoint /login
using the email and password which needs to be provided by the user,
it logs in the user if the log in credentials matches inside the database.
Passwords validity gets checked by mongoose middleware before user gets logged in.
password gets compared in hashed form to the hashed password stored in the db. 
If everything went well this sends the user info to the file /noAuthController endpoint  /login 
*/
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        /* using the method written in model.js to validate that
        password match even while hashed */
        const validate = await user.isValidPassword(password);

        // if passwords do not match, send warning message
        if (!validate) {
          return done(null, false, {
            message: "Entred information is not correctt",
          });
        }

        // if both password and email is good, then return user
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

/* check if authorized by checking token */

// Some parts are taken from the last lecture in fullstack in folder jwt-modified2
const opstVerify = {};
opstVerify.secretOrKey = "supersecret";
opstVerify.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
passport.use(
  "jwt-checkAuth",
  new JWTstrategy(opstVerify, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  })
);
