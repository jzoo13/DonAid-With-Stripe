myApp.controller("campaignDonationController", function($scope, $http,  sharingData ){
 
       //Run this code when the page loads      
      $scope.load = () => { 

        
       //Client calling GET by campaign id ENDPOINT passing campaign id
           $http.get("/api/campaign/campid/" + sharingData.campaignid,
           { // Request header
                  headers: { "x-authtoken": localStorage.getItem("jwt") }
           })
           .then(function(result) { // call was a success (status of 2xx)

                 $scope.value = result.data;
   
            }).catch(function(result) { // call failed (4xx, 5xx)
                if(result.status==401){
                   
                if(result.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                       sharingData.email= undefined;
                       sharingData.username = undefined;
                       sharingData.signbuttonText = "Log In";
                          window.location = "#!/signin"; 
                 } 
                }else{
                          alert(JSON.stringify(result.data));
                } 
            });
      }



            $scope.cancel = function(){
                window.location = "#!/campaignhome";   
            }
           
          //Pending piece  to ensure the Stripe donation intend has been fulfiled and not cancelled/voided.
          //Will work on that next per Stripe return code.
           $scope.callStripe = function(){

             // new sofar Goal
             var newDonationAmt =   $scope.value.sofarGoal + $scope.donationAmount;

              var updateCampaign = {
                 //per donation, will call end point per campaignid and will only update the sofarGoal property, creating a campaign object
                 //to be passed to ENDPOINT
                  sofarGoal:newDonationAmt
              }

                      $http.put("/api/campaign/" +  sharingData.campaignid,  updateCampaign,
                        { // Request header
                            headers: { "x-authtoken": localStorage.getItem("jwt") }
                        })
                      .then(function(result) { // call was a success (status of 2xx)

                        // Do nothing, we will then go to stripe per below flow

                      }).catch(function(result) { // call failed (4xx, 5xx)
                        
                           alert(JSON.stringify(result.data));
                        
                            if(result.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                                sharingData.email= undefined;
                                sharingData.username = undefined;
                                sharingData.signbuttonText = "Log In";
                                    window.location = "#!/signin";  //take user to sign in page
                            } 
                      });  


                   // Create an instance of the Stripe object with your publishable API key
                    var stripe = Stripe("pk_test_51IwKxxCPDHCt0gFzB0jnylOM0LCu9tuc1EMqD3yKAFU3ne3mU1ICuCzdv1xHBUKaojY3NxXb4jRzDevY3E7E2ArE00x2tq3u0k");
         
                      fetch("/create-checkout-session", {
                        method: "POST",
                           headers: {
                                'Content-Type': 'application/json'
                      },
                        body:JSON.stringify({amount: $scope.donationAmount}),
                      })
                        .then(function (response) {
                        return response.json();
                        
                        })
                        .then(function (session) {
                             //success redirection to Stripe
                            return stripe.redirectToCheckout({ sessionId: session.id });

                        })
                        .then(function (result) {
                          alert("No Redirect");
                          // If redirectToCheckout fails due to a browser or network
                          // error, you should display the localized error message to your
                          // customer using error.message.
                          if (result.error) {
                            alert(result.error.message);
                          }
                        })
                        .catch(function (error) {
                          console.error("Error:", error);
                        });
          }

});