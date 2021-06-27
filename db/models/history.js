const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  
  Name:{
    type:String
  },
  UserId: {
    type: String,
  },
  Meal:{
      type:String,
      required:true,
  },
  Address:{
      type:String,
      required:true
  },
  Date:{
    type:String
  },
  Time:{
    type:String
  },
  Cost:{
    type:Number
  }
});

module.exports = mongoose.model("History", UserSchema);