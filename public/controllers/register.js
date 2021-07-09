myApp.controller("registerController", function($scope, $http,sharingData){

  $scope.newUser = function(){
 
    var newUser = {

        firstName: $scope.newUserFirstname.toLowerCase(),
        lastName: $scope.newUserLastname.toLowerCase(),
        email: $scope.newUserEmail.toLowerCase(),
        password: $scope.newUserPassword
      }
     
        //Client calling POST registration ENDPOINT created from user input
         $http.post("/api/user/register", newUser)  
      
        .then(function(response){
          alert("user registered successful" );

         //Force user to sign in/authenticate by taking user back to signin page so a jwt token can be created.  Standard practice
          window.location = "#!/signin";                
        })
        .catch((response)=>{
              $scope.status = response.data;
        })
  } 
})