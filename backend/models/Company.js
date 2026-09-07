const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  package: {
    type: Number,
    required: true,
  },
  eligibility: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Company", companySchema);