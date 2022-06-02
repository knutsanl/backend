const passport = require("passport");

const jwt = require("jsonwebtoken");

// local files
const { UserModel } = require("../model/model");

/* ! taken from lecutre (17.03) in fullstack !
authenticates user with the local strategy
response is the user that matches the log in information provided (email & password)
and the token to use to get auth to other routes that needs it.
*/
exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      /* if error occured or user parameter is not true then
        run next callback with the infomation from here */
      if (err || !user) {
        return next(info);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // if no error create the body and token which will be used as responses
        const body = {
          _id: user._id,
          userID: user.userID,
          email: user.email,
          role: user.role,
          password: user.password,
          fullName: user.fullName,
          place: user.place,
        };
        const token = jwt.sign({ user: body }, "supersecret");

        return res.status(200).json({ body, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.forgotPasswordPart1 = (req, res, next) => {
  // filter
  let emailToFind = req.query.email;

  let newPassword = req.query.newPassword;

  // secret question to answer. This is like a real world example of adding a secret question when you register
  let secretQuestion = req.query.secretQuestion;

  // if no email is present , then show a 400 error
  if (!emailToFind) {
    res.status(400).json("You need to enter a emaiil");
  }
  // if no newpassword is present , then show a 400 error
  else if (!newPassword) {
    res.status(400).json("You need to enter a newPassword");
  } else {
    /* if everything needed is present, find the email of the user 
    that you are looking for*/
    UserModel.findOne({ email: emailToFind }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        /* if the secretquestion is answered with the users secretQuestion
        then run the next part of the endpoint */

        // if no user was found then send error msg
        if (result == null) {
          res
            .status(404)
            .json({ message: "User with that email was not found" });
        } else {
          /* if answering the secret question correctly then go to next part 
            of request*/
          if (secretQuestion == result.secretQuestion) {
            next();
          } else {
            res.status(401).json({
              message: "the secret answer is wrong",
            });
          }
        }
      }
    });
  }
};

exports.forgotPasswordPart2 = async (req, res) => {
  console.log("inside update forgot password route");

  // emails are unique, find the user with email
  let emailToFind = req.query.email;

  // new password to replace the old one
  let newPassword = req.query.newPassword;

  await UserModel.findOneAndUpdate(
    { email: emailToFind },
    { password: newPassword }
  )
    .select("email name surname role place status")

    .then((user) => {
      res.status(200).json({
        message: `Here is the user linked to that email. User ${user.name} with email : ${emailToFind} now has updated the password to ${newPassword}`,
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log("here is the erros");
    });
};
