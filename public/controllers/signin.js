myApp.controller("signinController", function($scope, sharingData, $http){

   //user sign in event
    $scope.userSignIn = function(){

     var registeredUser = {

          email: $scope.userName.toLowerCase(),
          password: $scope.userPassword
      }

           //Client calling POST rlog in ENDPOINT passing user object created from user input
           $http.post("/api/user/login", registeredUser)  
      
          .then(function(response){   // call was a success (status of 2xx)
          
                 localStorage.setItem("jwt", response.data.jwt);
                 
                sharingData.signbuttonText = "Log Out";
                sharingData.username = response.data.firstName;
                sharingData.email = response.data.email;
                localStorage.setItem("uemail",  sharingData.email);
                localStorage.setItem("uname",  sharingData.username);
               
                if(response.data.role=="admin"){
                      window.location = "#!/admin"; 
                }
        
                  //upon a succcessful sign in, take the user to the campaings home page  
                  //or create campaign or donation page depending on where the user originated  
                 else if(sharingData.directcampaigncreation == true){
                      sharingData.directcampaigncreation = false;
                      window.location = "#!/campaign"; 
                  }else if( sharingData.directdonation == true){
                       sharingData.directdonation = false;
                          window.location = "#!/campaigndonation"; 
                  }
                  else{
                      window.location = "#!/campaignhome";    
                  }
                  
             })
              .catch((response)=>{
               $scope.status = response.data;
            })
  }
})