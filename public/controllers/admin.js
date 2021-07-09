myApp.controller("adminController", function($scope, $http){


 // Regex to check valid user
  let emailRegEx = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

  //Run this code when the page loads      
   $scope.load = () => { 

      $scope.names = ["All", "Medical Emergencies", "Animal & Pets", "Funerals", "Non-Profit"];
      $scope.campaignflag = false;
      $scope.userflag = false;
   }
 
    //Function for search button event
    $scope.search = function( searchselection){

         $scope.previewflag = false; 
         
        if(searchselection=="Zipcode"){
       
           //test zipcode input for validity
           if(isNaN($scope.searchEntry) || $scope.searchEntry.length > 5 || $scope.searchEntry.length < 5  ){
              alert("Please enter a valid Zip code!!");
           }
           else{    //Client call to ENDPOINT for retriving a campaign by zip code   
                  $http.get("/api/campaign/campzipcode/" +  $scope.searchEntry,
                  { // Request header
                    headers: { "x-authtoken": localStorage.getItem("jwt") }
                  })
                .then(function(result) { // call was a success (status of 2xx)
                        $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
                    //   alert(JSON.stringify($scope.campaigns));
                        $scope.totalResults = $scope.campaigns.length;

                        $scope.campaignflag = true; 
                        $scope.userflag  = false; 
                    }).catch(function(result) { // call failed (4xx, 5xx)
                      
                        alert(JSON.stringify(result.data));
                    });
           }


          }else if(searchselection=="Campaign id"){
             //Client call to ENDPOINT for retriving a campaign by ID
            $http.get("/api/campaign/campid/" +  $scope.searchEntry,
              { // Request header
                  headers: { "x-authtoken": localStorage.getItem("jwt") }
              })

              .then(function(result) { // call was a success (status of 2xx)

                 //findById ENDPOINT does not return an array instead returns a single objects
                 //therefore creating the $scope as array and pushing ther returning object
                  $scope.campaigns = new Array();
                  $scope.campaigns.push(result.data);
            
                   //   alert(JSON.stringify($scope.campaigns));
                    $scope.totalResults = $scope.campaigns.length;

                      $scope.campaignflag = true; 
                      $scope.userflag  = false; 
                  }).catch(function(result) { // call failed (4xx, 5xx)
                      alert(JSON.stringify(result.data));
                  });
      
        }else if(searchselection=="Username"){

            if(emailRegEx.test($scope.searchEntry))
            {
                 //Client calls GET ENDPOINT to retrieve all campaigns created by username
                        $http.get("/api/campaign/mycampaigns/"+ $scope.searchEntry,
                          { // Request header
                            headers: { "x-authtoken": localStorage.getItem("jwt") }
                        })
                        .then(function(result) { // call was a success (status of 2xx)
                          
                            $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
                            $scope.totalResults = $scope.campaigns.length;
                            $scope.campaignflag = true; 
                            $scope.userflag  = false; 
                        }).catch(function(result) { // call failed (4xx, 5xx)
                            
                            alert(JSON.stringify(result.data.message));
                        });
            }
             else{
                 alert("Please enter a valid email username!");
          
             }
          }else {
                 alert($scope.searchEntry + "  "+searchselection);
          }
       }

     //Function for campaign catergories drop down menu
     $scope.changetype = function(selectedType){

       $scope.previewflag = false; 

     if(selectedType=="All"){
         
          //Client calls GET ENDPOINT to retrieve all campaigns
           $http.get("/api/campaign/allcampaigns")
          .then(function(result) { // call was a success (status of 2xx)
               $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
               $scope.totalResults = $scope.campaigns.length;
               $scope.userflag  = false; 
               $scope.campaignflag = true; 
          }).catch(function(result) { // call failed (4xx, 5xx)
               alert(JSON.stringify(result.data));
          });

     }else{
          //Client calls GET ENDPOINT to retrieve campaigns by selected category
          $http.get("/api/campaign/campaigntype/"+ selectedType)
         .then(function(result) { // call was a success (status of 2xx)
               $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
               $scope.totalResults = $scope.campaigns.length;
               $scope.userflag  = false; 
               $scope.campaignflag = true; 
          }).catch(function(result) { // call failed (4xx, 5xx)
               alert(JSON.stringify(result.data));
          });
     }
   }

     
   //Client call to retrieve all users to the admin        
    $scope.getUsers = function(){

              //Client calls GET ENDPOINT to retrieve all campaigns created by user
              $http.get("/api/user/allusers",
                { // Request header
                  headers: { "x-authtoken": localStorage.getItem("jwt") }
              })
              .then(function(result) { // call was a success (status of 2xx)
             
                    $scope.users= result.data; // load the result data (array of task objects) into the Model
                    $scope.totalResults = $scope.users.length;
                    $scope.campaignflag = false; 
                    $scope.userflag  = true; 
              }).catch(function(result) { // call failed (4xx, 5xx)
                   alert(JSON.stringify(result));
              });
     }
          

   //Function to call getby ID ENDPOINT and show the returned object in separate html UI
    $scope.view= function (campaingID){

      //alert("/api/campaign/campid/" + campaingID);
         //Client calls GET ENDPOINT to retrieve campaign by id
        $http.get("/api/campaign/campid/" + campaingID,
         { // Request header
                  headers: { "x-authtoken": localStorage.getItem("jwt") }
         })
         .then(function(result) { // call was a success (status of 2xx)
             
              //FindByID returns an object so since separate UI for this no need to create array
              $scope.value = result.data; 
              $scope.previewflag = true; 
              $scope.campaignflag = false; 
              $scope.userflag  = false; 
   
         }).catch(function(result) { // call failed (4xx, 5xx)
               alert(JSON.stringify(result.data));
             // alert("falla");
        });
      }

      $scope.reload= function (){
                $scope.previewflag = false; 
                $scope.campaignflag = true;
      }


      //passing index of my table list which has angular js binding along with campaing id to find the to be
      //deleted object in Array of campaigns objects. AngularJS binding handles the DOM element removal
      $scope.deleteCampaign = function($index, campaingID){ 
        
                 //Client calls DELETE ENDPOINT to delete a campaign by id
                $http.delete("/api/campaign/"+ campaingID,
                 { // Request header
                    headers: { "x-authtoken": localStorage.getItem("jwt") }
                })
                .then(function(result) {
                  
                   //sincce it got deleted on DB now remove if from users array
                    $scope.campaigns.splice($index,1);  

                    $scope.previewflag = false; 
                    $scope.flagtable = true;
                  }).catch(function(result) {
                     alert(JSON.stringify(result.data));
                  });    
      }

      //passing index of my table list which has angular js binding along with user id to find the to be
      //deleted object in Array of user objects. AngularJS binding handles the DOM element removal
        $scope.deleteUser = function($index, userID){
              //Client calls DELETE ENDPOINT to delete a user by username/email
              $http.delete("/api/user/"+ userID,
                { // Request header
                  headers: { "x-authtoken": localStorage.getItem("jwt") }
              })
              .then(function(result) {

                //sincce it got deleted on DB now remove if from users array
                $scope.users.splice($index,1); 
                }).catch(function(result) {
                   alert(JSON.stringify(result.data));
                }); 
        }  
})