const { PlantModel } = require("../model/model");

exports.seeSinglePlant = (req, res) => {
  let plantIDParameter = req.params.plantID;

  let plantQuery = req.query.plantID;
  let { plantID } = req.body;

  // if necessary data is provided, find by id
  if (plantIDParameter) {
    PlantModel.findOne({ plantID: plantIDParameter })
      .then((plant) => {
        // if no plant is found show error msg
        if (plant.length == 0) {
          res.status(404).json({
            message: "No plant with that id exists",
          });
        }
        // if plant is found then show it and a confirmation msg
        else {
          res.status(200).json({
            message: "Here is the plant you were looking for",
            plant: plant,
          });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
        throw new Error("Error is caused in PlantController");
      });
  }
  // if no parameter is entered then find all plant in db
  else {
    res.status(400).json({
      message: "Please specify the plant id",
    });
  }
};

exports.seeAllPlants = (req, res) => {
  PlantModel.find({})
    .then((plant) => {
      res.status(200).json(plant);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
