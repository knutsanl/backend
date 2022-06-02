const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { UserModel } = require("../model/model");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const opstVerify = {};
opstVerify.secretOrKey = "supersecret";
opstVerify.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();

// signup (createUser) authorization used in the endpoint /signup from routes.js
passport.use(
  "jwt-MANAGER",
  new JWTstrategy(opstVerify, async (token, done) => {
    try {
      // check user role, if manager return user and authorize action
      if (token.user.role === "manager") {
        return done(null, token.user);
      }

      // if not then dont authorize
      else {
        return done(null, false);
      }
    } catch (error) {
      //error if no auth token is present
      return done(error);
    }
  })
);
