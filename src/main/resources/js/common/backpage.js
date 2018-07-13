/**
 * vmaddiwar - This Page is called if User hit back button
 */
jQuery(document).ready(function() {
	bajb_backdetect.OnBack = function(e)
	 {
		//alert($('#transactionStatusCd').val());
		alert('This policy is Issued. You cannot go back.');		
		blockUser();
		window.location.href='/aiui/back/backPage/'+ encodeURI(document.aiForm.policyKey.value);
		e.preventDefault();
		//return false;
	 };
});


function closeWindows() {
    var browserName = navigator.appName;
    var browserVer = parseInt(navigator.appVersion);
    //alert(browserName + " : "+browserVer);

    //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";
    if(browserName == "Microsoft Internet Explorer"){
        var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;  
        if (ie7)
        {  
          //This method is required to close a window without any prompt for IE7 & greater versions.
          window.open('','_parent','');
          window.close();
        }
       else
        {
          //This method is required to close a window without any prompt for IE6
          this.focus();
          self.opener = this;
          self.close();
        }
   }else{  
       //For NON-IE Browsers except Firefox which doesnt support Auto Close
       try{
           this.focus();
           self.opener = this;
           self.close();
       }
       catch(e){

       }

       try{
          // window.open('','_self','');
         // window.close();
    	   open(location, '_self');
    	   window.close();
       }
       catch(e){

       }
   }
}