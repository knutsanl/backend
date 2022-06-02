const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { UserModel } = require("../model/model");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const opstVerify = {};
opstVerify.secretOrKey = "supersecret";
opstVerify.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();

passport.use(
  "jwt-GARDENER",
  new JWTstrategy(opstVerify, async (token, done) => {
    try {
      // check user role, if gardener return user and authorize action
      if (token.user.role === "gardener" || token.user.role === "manager") {
        return done(null, token.user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      done(error);
    }
  })
);
