

const mongoose = require("mongoose");


var dbCconnectionURL = "mongodb+srv://cs157:cs157@cs157.upp2h.mongodb.net/Donatepp?retryWrites=true&w=majority";

//Connect to MongoDB
const conn = mongoose.connect(
  
 dbCconnectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB...");
    }
  }
);

module.exports = conn;
