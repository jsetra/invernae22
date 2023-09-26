const mongoose = require ("mongoose");

const invernadero2Schema = new mongoose.Schema({
  temperaturai1: {
    type: Number,
  },
  humedadi1: {
    type: Number,
  },
  co2i1: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
},
  {
    versionKey: false,     
  }
  );
module.exports = mongoose.model('invernadero2', invernadero2Schema)