const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name_ml: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model("Branch", branchSchema);
