
const express = require("express");
const Campaign = require("../models/campaign.js");
const authUser = require("../middleware/authUser.js");
const adminRole = require("../middleware/adminAuth.js");


const fs = require("fs");
const multer = require('multer');

const helpers = require('./helpers');
const path = require('path');

const router = express.Router();

// ENDPOINT to GET all campaigns
router.get("/allcampaigns",  (req, res) => {

 Campaign.find().exec(function (err, result){
      if(!err){    //if the query was successful
            res.status(200);
            res.send(result);
            console.log(result);
      }else{           //something went wrong with the connection
          res.status(500);
          res.send(err);
          console.log(err);
      }
    });
});


// ENDPOINT to GET a campaign by id
router.get("/campid/:campaignid", authUser, (req, res) => {

 //had an error because was not using _id 
  Campaign.findById(req.params.campaignid) 
  .exec(function(err, result) {
  //Campaign.find({_id:req.params.campaignid}, function(err, result) {
    if (!err) { // if the query was successful
      res.status(200).send(result);
        console.log("looking: " + req.params.campaignid);
       console.log(result);
    } else { // something went wrong
      res.status(400).send(err);
    }
  })

});


// ENDPOINT to GET campaigns by zipcode
router.get("/campzipcode/:zipCode", authUser, (req, res) => {


Campaign.find({zipCode:req.params.zipCode}, function(err, result) {
    if (!err) { // if the query was successful
      res.status(200).send(result);
        console.log("looking: "+ req.params.zipCode);
       console.log(result);
    } else { // something went wrong
      res.status(400).send(err);
    }
  })
});

// ENDPOINT to GET campaigns by username
router.get("/mycampaigns/:user", authUser, (req, res) => {


  Campaign.find({user:req.params.user}, function(err, result) {
    if (!err) { // if the query was successful
      res.status(200).send(result);
        console.log("looking: "+ req.params.user);
       console.log(result);
    } else { // something went wrong
      res.status(400).send(err);
    }
  })
});


// ENDPOINT to GET campaigns by category/type
router.get("/campaigntype/:type", (req, res) => {

Campaign.find({type:req.params.type}, function(err, result) {
    if (!err) { // if the query was successful
      res.status(200).send(result);
        console.log("looking: "+ req.params.type);
       console.log(result);
    } else { // something went wrong
      res.status(400).send(err);
    }
  })

});

// ENDPOINT to UPDATE campaign by id (Authentication(jwt) middleware)
router.put("/:campaignid", authUser, (req, res) => {

  Campaign.findByIdAndUpdate(
    req.params.campaignid, // the id of the document we want to update
    req.body, // The object that contains the changes
    {
      new: true, // return the updated object
      runValidators: true // make sure the updates are validated
    },
    function(err, result) {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err);
      }
    });

})


// ENDPOINT to DELETE campaign by id (Authentication(jwt) middleware)
 router.delete("/:id",  authUser, (req, res) => {

      Campaign.findByIdAndDelete(
       req.params.id,
        function(err, result) {
                  if (!err) {
              res.status(200).send(result);
           } else {
                    res.status(400).send(err);
            }
          })
  });



// ENDPOINT to POST/CREATE  a new campaign  (Authentication(jwt) middleware)
router.post("/campaign",  authUser,  (req, res) => {

    let newCapaign = new Campaign(req.body);

   console.log("At campaign creation.  The image path is: " + req.body.img);

     //manually validate the campaign  object against the schema
     let valError = newCapaign.validateSync();

    if(!valError)
    {
      newCapaign.save(function(err, result) {
      if(!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err);
      }
    });
     }else {    //**Not sure if to send since Angular already handles this. **schema validation errors detected. Send custom schema field error messages back to  client

                   if(valError.name== "ValidationError"){   //name of error
                        var errMessage= ""; //to concatenate custom messages in case there is more than one.  
                           //Grab the custom error message(s) per err object properties
                            for (var e in valError.errors)
                             {
                                  errMessage += valError.errors[e].message; //using the predefined custom message set in schema for required fields.
                             }
                             res.status(400);
                                res.send(errMessage); //now send my customized message
                            }           
            }
});


//https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// ENDPOINT to POST/upload campaign image (Authentication(jwt) middleware)
router.post('/upload',  authUser,  (req, res) => {

  console.log("entre");
 

    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');


    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
         console.log(req.file);
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
          res.status(200);
          res.send(req.file.path);

         console.log(req.file.path);
      //  res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" //width="500"><hr /><a href="./">Upload another image</a>`);
    });
});

module.exports = router;

