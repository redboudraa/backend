const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Dash = new Schema({
  medid: {
    type: String
  },
  date: {
    type: Date
  },
  extra: {}
});

module.exports = mongoose.model("Dash", Dash);
