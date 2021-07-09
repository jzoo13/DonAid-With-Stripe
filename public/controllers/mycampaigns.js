 myApp.controller("MyCampaignsController", function($scope, $http, sharingData ){

  //Run this code when the page loads    
  //Run this code when the page loads to check weather a user has already signed in to the site or not and if
   //not (no JWT present then take user to sign in page.) Handles user opening account on multiple browser tabs.    
   $scope.load = () => {  

          if(!localStorage.getItem("jwt") && !localStorage.getItem("uemail"))
          {
                sharingData.email= undefined;
                sharingData.username = undefined;
                sharingData.signbuttonText = "Log In";
                 window.location = "#!/signin"; 
          }
          else{

                //Client calling GET mycampaigns ENDPOINT passing user email
                  $http.get("/api/campaign/mycampaigns/" + sharingData.email,
                  { // Request header
                      headers: { "x-authtoken": localStorage.getItem("jwt") }
                  }).then(function(result) { // call was a success (status of 2xx)
                      
                        $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
                  
                    }).catch(function(result) { // call failed (4xx, 5xx)
                        alert(JSON.stringify(result.data));
                        if(result.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                            sharingData.email= undefined;
                            sharingData.username = undefined;
                            sharingData.signbuttonText = "Log In";
                              window.location = "#!/signin"; 
                         } 
                    });
          }
   }

       //calling update campaign html page/controller
        $scope.edit = function(campaignid){
            sharingData.campaignid = campaignid;
            window.location = "#!/updatecampaign";  
        }
});