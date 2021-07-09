myApp.controller("campaignsHomeController", function($scope, sharingData, $http){
           
 //Run this code when the page loads    
  //Run this code when the page loads to check weather a user has already signed in to the site or not and if
   //not (no JWT present then take user to sign in page.) Handles user opening account on multiple browser tabs.      
  $scope.load = () => {     

      //defne items for html select drop down and set the first one as selected    
       $scope.names = ["All", "Medical Emergencies", "Animal & Pets", "Funerals", "Non-Profit"];
       $scope.selectedName = $scope.names[0];
       //by default display all available campaigns     
       getAllCampaigns();
  }
      
  function getAllCampaigns(){
          //Client calling GET All campaigns ENDPOINT 
           $http.get("/api/campaign/allcampaigns")
          .then(function(result) { // call was a success (status of 2xx)
              $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
          }).catch(function(result) { // call failed (4xx, 5xx)
              alert(JSON.stringify(result.data));
          });
   }
       
  //function for donate button event
   $scope.donate= function (campaingID){
    
     sharingData.campaignid = campaingID;

     if(sharingData.username){
           
             window.location = "#!/campaigndonation";    
       }else{
               sharingData.directdonation =true;
               window.location = "#!/signin"; 
       }
   }

   //function for donate button event
   $scope.changetype = function(selectedType){

      if(selectedType=="All"){
         
          getAllCampaigns();

      }else{
       //Client calling GET campaign by type ENDPOINT passing type(category)
          $http.get("/api/campaign/campaigntype/"+ selectedType)
         .then(function(result) { // call was a success (status of 2xx)
              $scope.campaigns = result.data; // load the result data (array of task objects) into the Model
          }).catch(function(result) { // call failed (4xx, 5xx)
              alert(JSON.stringify(result.data));
          });
     }
   }

}) 