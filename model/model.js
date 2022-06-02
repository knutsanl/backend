const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// USE MONGOOSE AUTO INCREMENT FOR ID TO AUTOMATICLY BE INCREMENTE ON NEW CREATIONS

const UserSchema = new Schema({
  userID: {
    type: Number,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["gardener", "manager"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  place: {
    type: String,
  },
});

const PlantSchema = new Schema({
  plantID: {
    type: Number,
    required: true,
    unique: true,
  },
  plantName: {
    type: String,
    required: true,
  },
  lastTimeWatered: {
    type: Date,
    //  required: true,
  },
  needsWaterBefore: {
    type: Date,
    // required: true,
  },
  wateringInterval: {
    type: Number,
    required: true,
  },
  wateredToday: {
    type: Boolean,
    required: true,
    default: false,
  },
  whoWatered: {
    type: String,
  },
  location: {
    type: String,
    required: true,
    default: "Mustad",
  },
  fertilizerType: {
    type: String,
    required: true,
  },
  lastTimeFertilized: {
    type: Date,
    // required: true,
  },
  needsFertilizationBefore: {
    type: Date,
    // required: true,
  },
  fertilizationInterval: {
    type: Number,
    required: true,
  },
  plantLink: {
    type: String,
    required: true,
  },
  plantAbout: {
    type: String,
    required: true,
  },
});

// These two functions (middlewares) below are from fullstack Lectures
// hash password after saving user to db
UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// compare hashed passwords
UserSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

const UserModel = mongoose.model("users", UserSchema);
const PlantModel = mongoose.model("plants", PlantSchema);

module.exports = { UserModel, PlantModel };
