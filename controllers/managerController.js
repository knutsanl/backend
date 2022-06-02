const jwt = require("jsonwebtoken");
const { UserModel, PlantModel } = require("../model/model");

exports.seeOtherProfiles = (req, res) => {
  let userIDparameter = req.params.userID;

  // if query parameter is present, find by name
  if (userIDparameter) {
    UserModel.findOne({ userID: userIDparameter })
      .select("email fullName role place userID")
      .then((user) => {
        // if no user is found show error msg
        if (!user) {
          res.status(404).json({
            message: "No users found",
          });
        }
        // if user is found then show it and a confirmation msg
        else {
          res.status(200).json({
            message: "Here is the user you were looking for",
            user: user,
          });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
        throw new Error(
          "Error is caused in managerController - seeotherprofiles"
        );
      });
  }
  // if no parameter is entered then find all users in db
  else {
    UserModel.find({})
      .select("email fullName role place userID")

      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

exports.createProfile = async (req, res, next) => {
  try {
    const { userID, email, password, fullName, place, role } = req.body;

    // creating user in db
    const user = await UserModel.create({
      email,
      userID,
      password,
      fullName,
      role,
      place,
    });
    // send the user back to callback
    res.status(200).json({
      message: "user successfully created",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "user with that id already exists",
    });
  }
};

exports.deleteOtherProfiles = (req, res) => {
  // using url parameter
  let userToDelete = req.params.userID;

  // if no ID is present , then show a 400 error
  if (!userToDelete) {
    res.status(401).json("You need to enter a userID");
  }
  // else find the user with that email and delete it
  else {
    UserModel.findOneAndDelete({ userID: userToDelete })
      .select("email fullName role userID")
      .then((user) => {
        res.status(200).json({
          message: `user ${user.fullName} role: ${user.role} with email : ${user.email} is now deleted`,
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

exports.updateOtherProfile = (req, res) => {
  // emails are unique, find the user with email
  // destructuring the body and putting it into a object variable
  let bodyparams = ({ userID, email, fullName, role, place } = req.body);

  // for å bruke url parameter istedet
  let userIDparameter = req.params.userID;

  /* awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
     this removes the properties that has undefined or null as a value from the body bodyparams. also i tweaked it
     so it removes properties that are aimed at changing the password so that wont happen */

  for (let prop in bodyparams)
    if (!bodyparams[prop] || prop == "password") delete bodyparams[prop];

  // if no email is present , then show a 400 error
  if (!userIDparameter) {
    res.status(400).json("You need to enter a user ID");
  } else {
    UserModel.findOneAndUpdate({ userID: userIDparameter }, bodyparams)
      .select("-password")
      .then((user) => {
        // if user found show user that got updated and confirmation msg
        res.status(200).json({
          message: `user ${user.fullName} with email : ${email} is now updated`,
          user: user,
        });
      })
      .catch((error) => {
        res.status(404).json({ message: "no user with that userID" });
      });
  }
};

//---------------------- PLANT RELATED CONTROLLER  ------------------

exports.createPlant = async (req, res, next) => {
  try {
    // create a object with all the required parameters.
    const bodyparams = ({
      plantID,
      plantName,
      wateringInterval,
      location,
      fertilizerType,
      fertilizationInterval,
      plantLink,
      plantAbout,
    } = req.body);
    console.log(bodyparams);

    // creating plant in db, Stored in variable to easier use in response after creation
    const plant = await PlantModel.create({
      plantID,
      plantName,
      wateringInterval,
      location,
      fertilizerType,
      fertilizationInterval,
      plantLink,
      plantAbout,
    });

    console.log(plant);
    res.status(200).json({
      message: "plant successfully created, here is the newly added plant",
      plant: plant,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message:
        "Please fill in all the required info and check that the plantID does not already exists.",
    });
  }
};

exports.deletePlant = (req, res) => {
  // plantID are unique so we used them
  // using query parameter
  let plantToFind = req.query.plantID;

  // using url parameter
  let plantIDParameter = req.params.plantID;

  // using the body
  //let { plantID } = req.body;

  // if no plantID is present , then show a 400 error
  if (!plantIDParameter) {
    res.status(400).json("You need to enter a plantID");
  }
  // else find the plant with that plantID and delete it
  else {
    PlantModel.findOneAndDelete({ plantID: plantIDParameter })
      .then((plant) => {
        // if no plant was found then send error msg
        if (plant == null) {
          res.status(404).json({
            message: "no plant was found, deletion aborted",
          });
        }
        // else delete the found plant
        else {
          res.status(200).json({
            message: `plant ${plant.plantName} with plantID : ${plant.plantID} is now deleted. Here is the deleted plant`,
            plant: plant,
          });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

exports.updatePlant = (req, res) => {
  // plantID are unique, find the user with plantID
  // destructuring the body and putting it into a object variable
  let bodyparams = ({
    plantID,
    plantName,
    lastTimeWatered,
    needsWaterBefore,
    wateringInterval,
    wateredToday,
    whoWatered,
    location,
    fertilizerType,
    lastTimeFertilized,
    needsFertilizationBefore,
    fertilizationInterval,
    plantLink,
    plantAbout,
  } = req.body);
  console.log(bodyparams);

  // for å bruke url parameter istedet
  let plantIDParameter = req.params.plantID;

  /* awesome oneliner found at https://stackoverflow.com/questions/53551390/mongodb-query-update-specific-field-if-value-is-not-null
     this removes the properties that has undefined or null as a value from the body bodyparams. 
    */
  for (let prop in bodyparams) if (!bodyparams[prop]) delete bodyparams[prop];

  // if no plantID is present , then show a 400 error
  if (!plantIDParameter) {
    res.status(400).json("You need to enter a plantID");
  } else {
    PlantModel.findOneAndUpdate({ plantID: plantIDParameter }, bodyparams)
      .then((plant) => {
        console.log(plant);
        // if plant found show plant that got updated and confirmation message
        res.status(200).json({
          message: `plant ${plant.plantName} with id : ${plant.plantID} is now updated`,
          plant: plant,
        });
      })
      .catch((error) => {
        res.status(404).json({ message: "no plant with that id" });
      });
  }
};
