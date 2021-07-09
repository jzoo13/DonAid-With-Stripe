const mongoose = require("mongoose");

let emailRegEx = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

const userSchema = new mongoose.Schema({

firstName:{
       type: String, 
       minLength:2,
       required:[true, "Name is a required.\n"]
},
lastName:{
       type: String, 
       minLength:1,
       required:[true, "Last Name is a required.\n"]
},
email:{ 
       type: String, 
        required: [true, "\nEmail is required."],
        index:true,
        collation: { 
           locale: 'en', 
           strength: 2 
        },
        match: [emailRegEx, "The email address you entered is invalid!!\n"]  //to show custom error message
},
password:{
       type:String,
       minLength:[6,"Password must be at least 6 characters in lenght.\n"],  //to show custom error message
       required: [true, "Password is a required.\n"]
},

role: {
      type:String,
      required:true,
      default: "user",
      enum: ["user", "admin"]
 },
memberSinceDate: {
           type: Date,
           default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
