  myApp.controller('campaignsController', function($scope,  $http, sharingData) {
    
     $scope.status = undefined;

     //defne items for html select drop down and set the first one as selected
     $scope.names = ["Medical Emergencies", "Animal & Pets", "Funerals", "Non-Profit"];
     $scope.selectedName = $scope.names[0];


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
    }


    $scope.add = function() {

       var picFile = document.getElementById('file').files[0],
        r = new FileReader();

        if(picFile){
          
                   r.onloadend = function(e) {
                  var data = e.target.result;
                  var sendData = new FormData();
                  sendData.append('profile_pic',picFile)

                  //client calling POST to send the binary image via $http to save in local server
                      $http({
                        method: 'POST',
                        url: '/api/campaign/upload',
                        data: sendData,
                        "headers": 
                              {'Content-Type': undefined,
                               'x-authtoken': localStorage.getItem('jwt')
                              }
                      }).then(function(result) {
                
                            //upon a successful image upload, then now call the endpoint to submit the new campaign in MongoDB 
                            createCampaign(result.data);
                
                        }, function(error) {
                            alert(JSON.stringify(error.data));
                            //  alert(error.status);
                             if(error.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                                    sharingData.email= undefined;
                                    sharingData.username = undefined;
                                    sharingData.signbuttonText = "Log In";
                                      window.location = "#!/signin"; 
                               }
                  });     
                } 
                r.readAsBinaryString(picFile);
        }
        else{

          //no image submitted for upload, just call the endpoint to submit the new campaign in MongoDB 
              createCampaign(false);
        }
   }


  function createCampaign(path) {
     //  $("#myselect:selected").text(); // The text content of the selected option
         //alert($scope.selectedName);
              var newCampaign = {

                campaignName: $scope.campaignName,
                campaignDescription: $scope.campaignDescription,
                zipCode: $scope.zipCode,
                campaignGoal:$scope.fundGoal,
                user:sharingData.email,  //obtain as shared data from log in controller (passed sharingData as parameter to controller)
                img:path,
                creationDate: new Date(),
                type:$scope.selectedName
              }
        
              //Client calling POST campaign ENDPOINT passing campaign object created from user input
              $http.post("/api/campaign/campaign", 
               newCampaign,
              { // Request header
                     headers: { "x-authtoken": localStorage.getItem("jwt") }
              })  
              .then(function(response){
                 alert("campaign added successful" );
                 //upon a succcessful campaign creation, take the user to the campaings home page   
                  window.location = "#!/";          
              })
              .catch((response)=>{
                 alert(JSON.stringify(response.data));
                
                  if(response.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                       sharingData.email= undefined;
                       sharingData.username = undefined;
                       sharingData.signbuttonText = "Log In";
                        window.location = "#!/signin"; 
                  }
              })
    }
      
      //https://www.codexworld.com/file-type-extension-validation-javascript/
       //attaching "change" event to the file upload button to ensure proper pic photo extension was selected
      $("#file").on("change", fileValidation);

    function fileValidation(){

     var fileInput = document.getElementById('file');
     var filePath = fileInput.value;
     var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
     
     if(!allowedExtensions.exec(filePath)){

       // alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
        $("#status").text("Invalid photo file selected. Only .jpeg/.jpg/.png/.gif file extensions accepted!");
        $("#status").show();
        fileInput.value = '';
             // document.getElementById('imagePreview').innerHTML='';
              $("#imagePreview").text("");
              $("#imagePreview").hide();
        return false;
     
     }else{
        $("#status").hide();
        //Image preview
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                // $("#imagePreview").text("<img src="\""" +e.target.result+"\""/>");
             document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'"/>';
            };
            reader.readAsDataURL(fileInput.files[0]);
              $("#imagePreview").show();
        }
     }
  }

     //user cancelled the operation so taking back to my campaigns page
      $scope.cancel = function(){
         window.location = "#!/mycampaigns"; 
      }     
});


