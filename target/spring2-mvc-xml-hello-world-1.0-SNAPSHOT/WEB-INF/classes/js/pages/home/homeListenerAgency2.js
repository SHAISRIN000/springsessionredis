function homeIFrameLoadCheck() {
	var currentTab = $("#homeA6CurrentTab").val();
	if (currentTab != '') {
		return false;
	} else {
		return true;
	}
}

function isHomePolicy(){
	//already in home quote. is user open my QUotes to open other condition in showExitPrompt()
	// shouldn't execute
	if($('.homePrimeFrame').length <= 0){
		return false;
	}else{
		return true;
	}
}
jQuery(document).ready(function() {
	//CrossSell
	$("#returnAutoPA").click(function () {
		//Return to Auto quote
		//Do not show save and exit pop up
		callGlobalHeaderAction($('#returnAutoUrl').val());
		
	});
});


function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
  }

bindEvent(window, 'message', function (e) {
    
    //console.log(e.data);
    var sourceData;
    if(e.data && e.data.indexOf('request') != -1){
    	  sourceData = JSON.parse(e.data).request;
    	  //Hiding Need Help Button from other Home pages
    	    if(sourceData && sourceData['from'] == 'agency6'){
    	    	if(sourceData['action'] == 'homeRentersQuote'){
      	    		showHelpButton();
      	    	} else {
      	    		hideHelpButton();
      	    	}

    			if(sourceData['action'] == 'updatePremium'){
    				updatePremium(sourceData);
    			}else if(sourceData['action'] == 'clearPremium'){
    				$("#homeEndRefreshIcon").show();
    				$("#homePremAmt-reRate").hide();
    			}else if(sourceData['action'] == 'redirectToLanding'){
    				goToRequestPage(sourceData);
    			}else if(sourceData['action'] == 'disableRateBox'){
    				disableRateBox();
    			}else if(sourceData['action'] == 'enableRateBox'){
    				enableRateBox();
    			}else if(sourceData['action'] == 'updateCurrentTab'){
    				updateCurrentTab(sourceData['currentTab']);
    			}else if(sourceData['action'] == 'redirectToAuto'){
    				$('#returnAutoUrl').val(sourceData['url']);
    			}else if(sourceData['action'] == 'updateCancelBox'){
    				updateCancelBox(sourceData);
    			}
    			
    		}

    }
  
});

var navigateAction;
var policyWrapper;		

		function updatePremium(sourceData){
			policyWrapper = sourceData.policy;
			if(sourceData.policy.applicants['PRIMARY_INSURED'].firstName){
				$("#applicant_first_name").html(sourceData.policy.applicants['PRIMARY_INSURED'].firstName);
				$("#applicant_last_name").html(sourceData.policy.applicants['PRIMARY_INSURED'].lastName);
			}
			
			//Added Fullstory script to customize user session based on policynumber/quotenumber
			FS.setUserVars({
				 "quoteNumber_str" : sourceData.policy.homePolicy.policyNumber,
				 "policyNumber_str" : sourceData.policy.homePolicy.policyNumber
			});
			
			$("#policy_number").html(sourceData.policy.homePolicy.policyNumber);
			$("#effective_date").html(sourceData.policy.homePolicy.policyEffDt.substring(0,10));
			
			$("#homePremAmt").html("$"+sourceData.policy.premium[0].premAmt);
			$("#homePolicyKey").html(sourceData.policy.homePolicy.policyKey);
			$("#homeCompanyCd").html(sourceData.policy.homePolicy.companyCd);
			$("#isHomeEndorsement").text(sourceData.policy.homePolicy.isEndorsement);
   	 		
			//If HO3 Quote display Commission Code
			if(sourceData.policy.homePolicy.policyForm === 'HO3' ){
				$(".commissionCode-div").show();
				var commissionCode = sourceData.policy.homePropertyDetails.commissionCode ? sourceData.policy.homePropertyDetails.commissionCode : "-";
				$(".commissionCode-div").html("Commission Code: " + commissionCode);
			}
			
			//Hide Rate/Premium btn in Endorsement and show different button to allow rerate
			if(sourceData.policy.homePolicy.isEndorsement){
				//Hide rate button that will display in NB
				$("#rateButton").hide();
				//shoe endorsement rate button
				$('#premamt_change').show();
				$(".premAmt").html("$"+sourceData.policy.homePolicy.existingPremAmt);
				$(".commissionCode-div").hide();
				//if rerated then display premiu instead of refresh icon
				if(sourceData.policy.homePolicy.ratedInd == 'Yes'){
					$("#homeEndRefreshIcon").hide();
					$("#homePremAmt-reRate").show();
					$("#homePremAmt-reRate").html("$"+sourceData.policy.premium[0].premAmt);
				}else{
					$("#homeEndRefreshIcon").show();
					$("#homePremAmt-reRate").hide();
				}
				//show Exit link
				$("#ExitHomeEndorsement").show();
			}else{
				$("#rateButtonEnd").hide();
				
				if (sourceData.policy.homePolicy.transactionStatusCd == 'Issued'  ) {
					$(".rateSecLine").hide();
				}
			}
		}
		
		function updateCancelBox(sourceData) {
			$("#rateButton").hide();
			$("#ExitHomeEndorsement").show();
			$("#policy_number").html(sourceData['policyNumber']);
			$("#effective_date").html(sourceData['transEffDate']);
			$("#homePolicyKey").html('0');
			$("#isHomeEndorsement").text("true");
			$("#rentersHomeFormslink").hide();
		}
		
		function rateHomeEnd(){
			var homePrimeFrame = document.getElementsByClassName("homePrimeFrame")[0].contentWindow;
			 var target_origin = $("#homeDomain").val();
			 var data = {
					 	  'from' : 'agency2',
					 	  'action' : 'rateEnd'
					 	}
			 homePrimeFrame.postMessage( {'request': data}, target_origin );
		}
		
		function clicktoBind(){
			var homePrimeFrame = document.getElementsByClassName("homePrimeFrame")[0].contentWindow;
			 var target_origin = $("#homeDomain").val();
			 var currentTab =  $("#homeA6CurrentTab").val();
			 var data = {
					 	  'from' : 'agency2',
					 	  'action' : 'clicktoBind',
					 	  'currentTab' : currentTab
					 	}
			 homePrimeFrame.postMessage( {'request': data}, target_origin );
		}
		
		function exitHomeEndorsement(){
			var homePrimeFrame = document.getElementsByClassName("homePrimeFrame")[0].contentWindow;
			 var target_origin = $("#homeDomain").val();
			 navigateAction = redirectLandingPage;
			 var data = {
					 	  'from' : 'agency2',
					 	  'action' : 'exitEndorsement',
					 	  'toURL': serializeFunction(redirectLandingPage)
					 	}
			 homePrimeFrame.postMessage( {'request': data}, target_origin );
		}
		
		function disableRateBox(){
			$('.homedisbleEnable').prop('disabled', true);
			$('.homedisbleEnable').attr('disabled', true);
			$('#homePremAmt').html("");
		}
		
		function enableRateBox(){
			$('.homedisbleEnable').prop('disabled', false);
			$('.homedisbleEnable').attr('disabled', false);
		}
		
		function showExitWindowHomeNB(action, blnAgencyProfile, companyCode, event, blnShowExitPrompt){
			// Hide all modal and popover windows
			$('.modal').hide();
			$('.popover').hide();
			var homePrimeFrame = document.getElementsByClassName("homePrimeFrame")[0].contentWindow;
			 var target_origin = $("#homeDomain").val();
			 var toURL = "";
			 if(typeof(action) == "function") {
				 toURL = serializeFunction(action);
				 navigateAction = action;
			 }else{
				 toURL = action;
			 }
			 var data = {
					 	  'from' : 'agency2',
					 	  'action' : 'exitWindowNB',
					 	  'blnAgencyProfile' : blnAgencyProfile,
					 	  'companyCode' : companyCode,
					 	  'blnShowExitPrompt' : blnShowExitPrompt,
					 	  'toURL' : toURL
					 	}
			 homePrimeFrame.postMessage( {'request': data}, target_origin );
		}
		
		function hideHelpButton(){
			$('#needHelpButton').hide(); //hide button
		}
		
		function showHelpButton(){
			$('#needHelpButton').show(); //show button
		}
		
		function updateCurrentTab(currentTab){
			$("#homeA6CurrentTab").val(currentTab);
			if(currentTab === 'homeRentersBind'){
				$(".hoRateBox-NavText").html('Click to issue');
			}else {
				$(".hoRateBox-NavText").html('Click to bind');
			}
		}
		
		function goToRequestPage(sourceData){
			
			var toStringAction = sourceData['url'];
			
			if(toStringAction.indexOf('function') == -1 ){
				callGlobalHeaderAction(sourceData['url']);
			}else{
				callGlobalHeaderAction(navigateAction);
			}
		}
		
		function serializeFunction(f) {
		    return encodeURI(f.toString());
		}