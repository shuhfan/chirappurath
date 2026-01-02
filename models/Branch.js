const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name_ml: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Branch", branchSchema);
