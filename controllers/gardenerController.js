const jwt = require("jsonwebtoken");

const { UserModel, PlantModel } = require("../model/model");

// --------------- USER RELATED ENDPOINTS ---------------

//response is your own user
exports.seeOwnProfile = (req, res) => {
  UserModel.findOne({ email: req.user.email })
    .select("-password")
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "No user found",
        });
      } else {
        res.status(200).json({
          message: "Here is your user",
          user: user,
          token: jwt.sign({}, "supersecret"),
        });
      }
    });
};

/* Uses token to find the user and uses information from that to gather search parameterer for the db query 
Response is the user and a confirmation message*/
exports.updateYourOwnUser = (req, res) => {
  // destructuring the body and putting it into a object variable
  let bodyparams = ({ fullName, role, password, place } = req.body);

  // awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
  // this removes the properties that has undefined or null as a value from the body bodyparams
  for (let prop in bodyparams)
    if (!bodyparams[prop] || prop == "email") delete bodyparams[prop];

  // if no user was found , then show a 400 error
  if (!req.user) {
    res.status(400).json("no user was found");
  }

  // else find user with that email and update info
  else {
    UserModel.findOneAndUpdate({ email: req.user.email }, bodyparams)
      .then((user) => {
        // if user found show user that got updated and confirmation msg
        res.status(200).json({
          message: `user ${user.fullName} with email : ${req.user.email} is now updated`,
          user: user,
          // token: req.query.secret_token,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "no user with that email" });
      });
  }
};

// --------------- PLANT RELATED ENDPOINTS ---------------

exports.taskWater = (req, res) => {
  // plantID are unique, find the user with plantID
  // destructuring the body and putting it into a object variable
  //let { plantID, wateredToday = true, lastTimeWatered } = req.body;
  let { lastTimeWatered } = req.body;
  console.log(lastTimeWatered);

  // for å bruke url parameter istedet
  let plantIDParameter = req.params.plantID;

  /* awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
   this removes the properties that has undefined or null as a value from the body bodyparams. 
  */
  //for (let prop in bodyparams) if (!bodyparams[prop]) delete bodyparams[prop];

  // if no plantID is present , then show a 400 error
  if (!plantIDParameter) {
    res.status(400).json("You need to enter a plantID");
  } else {
    PlantModel.findOneAndUpdate(
      { plantID: plantIDParameter },
      { lastTimeWatered: lastTimeWatered }
    )
      .then((plant) => {
        console.log(plant);
        // if plant found show plant that got updated and confirmation message
        res.status(200).json({
          message: `plant ${plant.plantName} with id : ${plant.plantID} is now watered`,
          plant: plant,
        });
      })
      .catch((error) => {
        res.status(404).json({ message: "no plant with that id" });
      });
  }
};

exports.taskFertilize = (req, res) => {
  // plantID are unique, find the user with plantID
  // destructuring the body and putting it into a object variable
  //let { plantID, wateredToday = true, lastTimeWatered } = req.body;
  let { lastTimeFertilized } = req.body;
  console.log(lastTimeFertilized);

  // for å bruke url parameter istedet
  let plantIDParameter = req.params.plantID;

  /* awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
   this removes the properties that has undefined or null as a value from the body bodyparams. 
  */
  //for (let prop in bodyparams) if (!bodyparams[prop]) delete bodyparams[prop];

  // if no plantID is present , then show a 400 error
  if (!plantIDParameter) {
    res.status(400).json("You need to enter a plantID");
  } else {
    PlantModel.findOneAndUpdate(
      { plantID: plantIDParameter },
      { lastTimeFertilized: lastTimeFertilized }
    )
      .then((plant) => {
        console.log(plant);
        // if plant found show plant that got updated and confirmation message
        res.status(200).json({
          message: `plant ${plant.plantName} with id : ${plant.plantID} is now fertilized`,
          plant: plant,
        });
      })
      .catch((error) => {
        res.status(404).json({ message: "no plant with that id" });
      });
  }
};
