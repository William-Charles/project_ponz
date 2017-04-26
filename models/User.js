const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const bluebird = require("bluebird");
mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  fname: { type: String },
  lname: { type: String },
  points: { type: Number },
  passwordHash: { type: String },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
