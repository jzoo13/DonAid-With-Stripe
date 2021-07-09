myApp.controller("updatecampaignController", function($scope, $http,  $rootScope, sharingData){
  
   $scope.names = ["Medical Emergencies", "Animal & Pets", "Funerals", "Non-Profit"];
   $scope.selectedName = $scope.names[0];
    
         $http.get("/api/campaign/campid/" +  sharingData.campaignid,
          { // Request header
               headers: { "x-authtoken": localStorage.getItem("jwt") }
          })
         .then(function(result) { // call was a success (status of 2xx)
            // alert(JSON.stringify(result));
                $scope.title = result.data.campaignName;   
                $scope.campaignDescription = result.data.campaignDescription;  
                $scope.zipCode = result.data.zipCode;  
                $scope.fundGoal = result.data.campaignGoal;  
                $scope.image = result.data.img;  
                $scope.selectedName = result.data.type;  
                document.getElementById('imagePreview').innerHTML = '<img src="'+ $scope.image +'"/>';
             
            }).catch(function(result) { // call failed (4xx, 5xx)
              alert(JSON.stringify(result.data));
         
            });
 
   $scope.updateCampaign = function() {
       
      var picFile = document.getElementById('file').files[0],
        r = new FileReader();

        if(picFile ){
          
                   r.onloadend = function(e) {
                  var data = e.target.result;
                  var sendData = new FormData();
                  sendData.append('profile_pic',picFile)

                   $http.post("/api/campaign/upload", sendData,
                    { // Request header
                     headers: { 
                                'Content-Type': undefined,
                                'x-authtoken': localStorage.getItem('jwt')
                               }
                      }).then(function(result) {
                           
                            //upon a successful image upload, then now call the endpoint to submit the new campaign in MongoDB 
                            updateCampaign(result.data);
                
                        }, function(error) {
                            alert(error.data);
                  });     
                } 
                r.readAsBinaryString(picFile);
        }
        else if($scope.image != false){
      
          updateCampaign($scope.image);
          //no image submitted for upload, just call the endpoint to submit the new campaign in MongoDB 
        }
        else{
               updateCampaign(false);
        }
   }


      function updateCampaign(path){

         var updateCampaign = {

            campaignName: $scope.title,
            campaignDescription: $scope.campaignDescription,
            zipCode: $scope.zipCode,
            campaignGoal:$scope.fundGoal,
            img:path,
            type:$scope.selectedName
        }

         $http.put("/api/campaign/" +  sharingData.campaignid,  updateCampaign,
           { // Request header
               headers: { "x-authtoken": localStorage.getItem("jwt") }
           })
         .then(function(result) { // call was a success (status of 2xx)

               window.location = "#!/mycampaigns"; 

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


      $scope.deleteCampaign = function(){

           $http.delete("/api/campaign/"+ sharingData.campaignid,
             { // Request header
               headers: { "x-authtoken": localStorage.getItem("jwt") }
           })
          .then(function(result) {

           window.location = "#!/mycampaigns"; 
            }).catch(function(result) {
              alert(JSON.stringify(result.data));

                if(result.status==401){ //if due to invalid token then send user to sign in page/could be multiple tabs open and user signed out in one
                       sharingData.email= undefined;
                       sharingData.username = undefined;
                       sharingData.signbuttonText = "Log In";
                          window.location = "#!/signin"; 
                 } 

            }); 
      }

      //user cancelled the operation so taking back to my campaigns page
      $scope.cancel = function(){
          window.location = "#!/mycampaigns"; 
      }

       $scope.changetype = function(selectedType){
          $scope.selectedName= selectedType;
      }

       //https://www.codexworld.com/file-type-extension-validation-javascript/
       //attaching "change" event to the file upload button to ensure proper pic photo extension was selected
       //Since no No binding support for File Upload control in Angular JS, using jquery instead
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
              $scope.image ="false";
        return false;
     
     }else{
         
        $("#status").hide();
        //Image preview
        if (fileInput.files && fileInput.files[0]) {
          
           // alert($scope.image);
            var reader = new FileReader();
            reader.onload = function(e) {
                // $("#imagePreview").text("<img src="\""" +e.target.result+"\""/>");
             document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'"/>';
            };
            reader.readAsDataURL(fileInput.files[0]);
              $("#imagePreview").show();
        }
        return true;
     }
  }         
});



