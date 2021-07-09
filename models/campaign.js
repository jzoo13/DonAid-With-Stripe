const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({

      campaignName:{
            type: String, 
            minLength:2,
            required:[true, "Campaign Name is required.\n"]
      },
      campaignDescription:{
            type: String, 
            minLength:1,
            required:[true, "Campaign Description is required.\n"]
      },
      zipCode:{
              type: Number,
              minLength:5,
              maxLength:5,
              required:[true, "Zip code is required.\n"]
      },
      img: { 
          type: String,
           default: "none"
       },
      campaignGoal: { 
            type: Number, 
           default: 0,
            required:[true, "Campaign goal is  required.\n"]
      },
      sofarGoal: { 
           type: Number, 
           default: 0,
           required:[true, "Campaign collected so far goal is required.\n"]
      },
       user: { 
           type: String,
           default: "creator@yahoo.com",
           required:[true, "Email of user who created the campaign is required.\n"]
      },
      creationDate: {
           type: Date,
           default: Date.now
      },
        type: {
           type: String,
           default: "other"
      }
});

const Campaign = new mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
