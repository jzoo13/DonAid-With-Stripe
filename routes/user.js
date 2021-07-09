const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authUser = require("../middleware/authUser.js");
const adminRole = require("../middleware/adminAuth.js");

const router = express.Router();



// ENDPONT POST  for getting all users 
router.get("/allusers",  authUser, adminRole, (req, res) => {

 console.log("all usrs");
 User.find().exec(function (err, result){
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


// ENDPONT DELETE for removing a user by user id
 router.delete("/:id",  authUser, adminRole, (req, res) => {

      User.findByIdAndDelete(
       req.params.id,
        function(err, result) {
                  if (!err) {
              res.status(200).send(result);
           } else {
                    res.status(400).send(err);
            }
          })
  });


// ENDPOINT POST  for user log in/sign in
router.post("/login", (req, res)=>{

    console.log("entre");

    //make sure the client sent a username and password
    if(req.body.email && req.body.password){

      //search for username (email) sent by client
      User.findOne({email:req.body.email}, (err, result)=>{

          // error when attempting MongoDB operation so return error response
          if(err)
          {
              res.status(400);
              res.send(err.message);
          }
          //no errors connecting and checking againt DB, but it returned an empty obj (username (email) not found)  Therefore return error response
          else if(!result){
 
             res.status(400);
             res.send("Invalid email username or password!");

          }else{ //the username (email) was indeed found

            //compare the user password with the hash password in DB
            if(bcrypt.compareSync(req.body.password, result.password)){

                    //result contains the returning entire user object //debugging
                    var userObjectReturned = JSON.stringify(result);
                    console.log(userObjectReturned);

                    //create new object to be used for JWT web token with payload and secret key
                    var payload = {
                      _id : result.id,
                      username : result.email,
                      role: result.role
                    }
                  
                    // Generate a JSON Web Token with payload and secret key
                    const privateKey = "d0nat3";
                    var token = jwt.sign(payload, privateKey);

                    //this is the new user object that will be sent along with the response which now includes the jwt token
                    var  userInfo = {
                                  _id:result.id,
                                  firstName:result.firstName,
                                  email: result.email,
                                  role:result.role,
                                  jwt:token 
                    }
                    res.status(200);
                    res.send(userInfo);
                    //console.log(JSON.stringify(userInfo));

            }else{  //the password provided does not match with the one in DB
                    res.status(400);
                    res.send("Invalid email username or password!");
            }

          }
      });
      
    }else{ //either user name or password or both were not provided by client
       res.status(400);
       res.response("Email and password cannot be blank!");
    }
});
  

// ENDPOINT POST for user registration
router.post("/register", (req, res)=>{

      //search for the email that was sent by client
      User.findOne({email:req.body.email}, (err, result)=>{
       
       // error when attempting MongoDB operation so return error response
       if(err)
       {
           res.status(400);
           res.send(err.message);
       }
       //no errors connecting and checking againt DB, but it returned an empty obj (email not found)  Therefore attempt to add the new user
       else if(!result)
       {
          //create a new user object based on what was sent by the client
          var newUser = new User(req.body);

          //manually validate the new user object against the schema
          let valError = newUser.validateSync();

          if(!valError){
              //use bcrypt to generate a hash password for new user
              newUser.password = bcrypt.hashSync(newUser.password, 10);
               
                //saving the account in DB 
                newUser.save( (err, result)=>{

                  if(err){ // error when attempting MongoDB operation so return error response
                       res.status(400);
                       res.send(err);   
   
                  }else{
                        res.status(201); //new user creation success
                        res.send(result);
                        console.log(result) //display new user to console
                       
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
     //if we got here it means no error connecting with DB but the user was found, returned a valid object
     }else{
          res.status(400);
          res.send("An account with this email username already exists!");  
      }
      });
});

module.exports = router;
