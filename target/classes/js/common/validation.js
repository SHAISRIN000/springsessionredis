// Validation functions
jQuery(document).ready(function() {
	logToDb("validation.js: 2 - Entering jQuery(document).ready function"); // TODO Add Ajax call here.
	// lastInputLeft is the ID of the field in which the last input will be recorded
	$('div[id="mainContent"]').on ("blur", ":input", function(){	
		recordLastInput(this, 'lastInputLeft');
	});
	// if a selection is made -> validate last input and this drop down
	$('div[id="mainContent"]').on ("change", "select", function(){
		var strFieldValue = $('#' + jq('lastInputLeft')).val();
		//commented below if and included not empty condition to make it work.
		//if(strFieldValue != this.id){
		if(strFieldValue != '' && strFieldValue != this.id){
			validateLastInput('lastInputLeft');
		}else{
			recordLastInput(this, 'lastInputLeft');
			validateLastInput('lastInputLeft');
		}
	});
	
	// refresh wrapper for dropdown
    // $(this).trigger(changeSelectBoxIt);

	$('div[id="mainContent"]').on ("change", "input:checkbox", function(){
		validateLastInputIfNotThis('lastInputLeft', this);
		recordLastInput(this, 'lastInputLeft');
		validateLastInput('lastInputLeft');
	});
	// validate lastinputleft when anything on mainContent is clicked
	$('div[id|="mainContent"]').on ("click", function(){  
		validateLastInput('lastInputLeft');
	});
	
	// validate lastinputleft when any input gets focus
	//  this is needed for tabbing
	$('div[id="mainContent"]').on ("focus", ":input", function(){  
		validateLastInput('lastInputLeft');
	});
	
	var pageErrorInfoSel1 = $('#' + jq('pageErrorInfo'));
	
	/*
	 * 	var pageErrorInfoJSON = pageErrorInfoSel.val(); 
	if (pageErrorInfoJSON == null || pageErrorInfoJSON == ''){
	  	//no error data, leave!
	   	return;	  
	}
	        
	 */
    //Test First time thru value to determine required / page alert presentation
    var processErrorInfoSel = $('#processErrorInfo').val();
    var pageErrorInfoSel = $('#pageErrorInfo').val();
    var uwMessageInfoSel = $('#uwMessageInfo').val();
    
	if(isEndorsement()){
		var wasPremiumAffected = $('#defaultZeroedPremium').val();
		if(wasPremiumAffected != null && wasPremiumAffected != '') {
			uwMessageInfoSel = '';
			disableFormsLink();
		}
	}
   
    // third party service fail and we need to continue with the process for first time through
    var tpServiceFail = $('#tpServiceFail').val();
    var thirdPartyErrorInfoSel = $('#thirdPartyPageErrorInfo').val();
   // alert('tpServieFail = '+tpServiceFail+'thirdPartyErrorInfoSel ='+thirdPartyErrorInfoSel);
    //var type = $.type(pageErrorInfoSel);
    //var isEmpty = $.isEmptyObject(pageErrorInfoSel);
	
    
    //FIXME:SSIRIGINEEDI Tempwork to bypass firsttimeThru validation for Vehicle Tab to adapt the changes related to selectboxit plugin removal and adding
    //new plugin.
    //As a first go, this is applied to Vehicles Page and will be applied to other pages/tabs progressively.
    if($('#firstTimeThru').val() == 'true'){
	    //only do this the first time a page is displayed
    	var currentTabName;
    	if (isUmbrellaQuote()) {
    		currentTabName = document.umbrellaForm.currentTab.value;
    		if(pageErrorInfoSel != null && pageErrorInfoSel != 'null' && pageErrorInfoSel.length > 0 && pageErrorInfoSel != '[]'){
				showPageAlerts();
			}
    	}else if(isHomeQuote()){
    		currentTabName = document.homeForm.currentTab.value;
    		if(currentTabName == 'homeRentersBind' && pageErrorInfoSel != null && pageErrorInfoSel != 'null' && pageErrorInfoSel.length > 0 && pageErrorInfoSel != '[]'){
				showPageAlerts();
			}
    		
    	}else {
    		currentTabName = document.aiForm.currentTab.value;
    	}
    	if (currentTabName == 'drivers' || currentTabName == VEHICLESTABNAME || currentTabName == 'coverages' || currentTabName == 'application' ){
    		//this new applyFirstTimeThruStyle function code is inside enhanced-Validation.js and is modified to cater the needs as per the new plugin for preRequired styles(yellow Color).
    		//Once this code is supported across all tabs move that to validation.js , subsequently remove the references to the existing firstTimeThru function.
    		applyFirstTimeThruStyle('' , $('#firstTimeThru').val());
    		if(tpServiceFail !=undefined && tpServiceFail !=null && tpServiceFail.indexOf('Yes')!=-1){
    	    	if(thirdPartyErrorInfoSel != null && thirdPartyErrorInfoSel != 'null' && thirdPartyErrorInfoSel.length > 0 && thirdPartyErrorInfoSel != '[]'){
    	    		showThirdPartyAlerts(thirdPartyErrorInfoSel);
    	    	}
    	    	
    	    	
    	    }
    	
    	} else {
    		firstTimeThru('');
    		if(tpServiceFail !=undefined && tpServiceFail !=null && tpServiceFail.indexOf('Yes')!=-1){
    	    	if(thirdPartyErrorInfoSel != null && thirdPartyErrorInfoSel != 'null' && thirdPartyErrorInfoSel.length > 0 && thirdPartyErrorInfoSel != '[]'){
    	    		showThirdPartyAlerts(thirdPartyErrorInfoSel);
    	    	}
    	    	
    	    	
    	    }
    	}
    }	
	//second time thru: call common validation code to show various edits	   
    	
    else if (processErrorInfoSel != null && processErrorInfoSel != 'null' && processErrorInfoSel.length > 0) {    	
    	//TD 43669
    	if($('#readOnlyMode').val() != 'Yes'){
    		 
    		 var processErrorInfoSelJSON = jQuery.parseJSON(processErrorInfoSel); 
    		 var strMesg = '';
    		 var isServiceErr = 'No';
    		 var convertedToIssueMode = isEndorsement() && $('#convertedToIssueMode').val() == 'true';
    		 var driverPermit = $('#policyHasDriverPermit').val();
    		 var rentersIneligible = $('#policyHasInvalidRenters').val(); 
    		 for (var i = 0; i < processErrorInfoSelJSON.length; i++){
    				if(processErrorInfoSelJSON[i].process == 'serviceDown' ){
    					
    					strMesg = processErrorInfoSelJSON[i].tabName;
    					isServiceErr = 'Yes';
    					break;
    				}
    			}
    		if(isServiceErr == 'Yes'){
    			showServiceProcessErrors(strMesg);
    		}
    		//vmaddiwar - TD 46557 fix - Convert to Issue - incorrect pop up when button is hit
    		else if (convertedToIssueMode){
    			showConvertToIssueWarning(processErrorInfoSel);
    		}
    		else if(driverPermit == 'Y'){
   			 $('#policyHasPermit').modal('show');
   		}
    		else if(rentersIneligible == 'Y'){
    			$('#policyInvalidRentersDialog').modal('show');
    		}
    		else{
    			showProcessEdits(processErrorInfoSel);	
    			if(pageErrorInfoSel != null && pageErrorInfoSel != 'null' && pageErrorInfoSel.length > 0 && pageErrorInfoSel != '[]'){
    				showPageAlerts();
    			}
    			
    		}	
    		
    	}
    }
    //09/05/2014 Changing order. Page alerts (if any) should display first
    else if(pageErrorInfoSel != null && pageErrorInfoSel != 'null' && pageErrorInfoSel.length > 0 && pageErrorInfoSel != '[]'){
    	showPageAlerts();
    }else if(uwMessageInfoSel != null && uwMessageInfoSel != 'null' && uwMessageInfoSel.length > 0){
    	showUWMessageInfo(uwMessageInfoSel);
    }
    
    //call third party service errors
    if(tpServiceFail !=undefined && tpServiceFail !=null && tpServiceFail.indexOf('Yes')!=-1){
    	if(thirdPartyErrorInfoSel != null && thirdPartyErrorInfoSel != 'null' && thirdPartyErrorInfoSel.length > 0 && thirdPartyErrorInfoSel != '[]'){
    		showThirdPartyAlerts(thirdPartyErrorInfoSel);
    	}
    }

    
    //Bind launch of Page Alert modal window 
    $('#openErrorModal').click(function(e){
    	$("#editsModal").trigger(showErrorDetailsPopup);
	});

      
    
    //FIX:The below code is not picking certain non required fields that are supposed to be considered for Re Rate Trigger to work.
    //One of them is the Alternate Garage Checkbox indicator on Vehicles Page. Updated the Selector to pick Alternate Garage Checkbox element.
    
    $('.requiredForEndorsement').change(function(event){
    	var ratedIndicator =  $('#ratedInd').val();
    	if(isEndorsement()) {    	
			var originalPremAmt = $('#premAmt').val();
    		resetPremium(ratedIndicator,originalPremAmt);
    		resetCrnFlag();
		}    	
    });
    
    //add sports package selection for premium
    $('.required , .altGaragingInd, .clsResetPremium, .sprtPkgPremReset').change(function(event){
		if (!isHomeQuote()) {
			var ratedIndicator =  $('#ratedInd').val();
    		if(isEndorsement()) {
    			var originalPremAmt = $('#premAmt').val();
        		resetPremium(ratedIndicator,originalPremAmt);
        		resetCrnFlag();
    		} else {
    			var currTab = $('#currentTab').val();
    			if(currTab !='bind' && ratedIndicator !=null && ratedIndicator != undefined && ratedIndicator == 'Yes')	{
    				var originalPremAmt = $('#premAmt').val();
    				resetPremium(ratedIndicator,originalPremAmt);
    				resetCrnFlag();
    			}
    		}
		}
    		
    });
    
}); 

function resetPremiumForAll(){
	
	var ratedIndicator =  $('#ratedInd').val();
	var originalPremAmt = $('#premAmt').val();
	resetPremium(ratedIndicator,originalPremAmt); 
	resetCrnFlag();
}

Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
  
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
     
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
     
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }  
        }
     
        return result;
    };
})();

function firstTimeThru(strSelector){
	 var optional = 'Optional';
	 var strSel = '';
	 
	 if (strSelector.length > 0){
		 strSel = strSelector;
	 }
	 
	   // watermark empty, optional fields   
	   $('.optional'+strSel).each(function(){
		   if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		    		$(this).val(optional).addClass('watermark');
		  		}
		   }
	   });
	   //if blur and no value inside, set watermark text and class again.
	 	$('.optional'+strSel).blur(function(){
	  		if ($(this).val()!=null && $(this).val().length == 0){
	    		$(this).val(optional).addClass('watermark');
			}
	 	});
		//if focus and text is optional, set it to empty and remove the watermark class
		$('.optional'+strSel).focus(function(){
	  		if ($(this).val() == optional){
	    		$(this).val('').removeClass('watermark');
			}
		});
		// end watermark optional fields
		
		// required fields
		$('.required'+strSel).each(function(){
			addRemovePreRequired(this, 'load');
	    });
	 	
		//if focus, blur or change to any required field, remove the yellow background
		$('.required'+strSel).blur(function(){
			$(this).removeClass('preRequired');
			if($(this).is('select')){				
				$(this).trigger(getDropdownPluginEvent(this));
			}
		});
	
		$('.required'+strSel).change(function(){
			$(this).removeClass('preRequired');
			if($(this).is('select')){				
				$(this).trigger(getDropdownPluginEvent(this));
			}
		});
		
		$('.required'+strSel).focus(function(){
	    	$(this).removeClass('preRequired');
	 	});
		//End: only do this the first time a page is displayed
		
}

//SSIRIGINEEDI: After migration merge with above firstTimeThru method>
function applyFirstTimeThruStyle(selector , passOnFirstTime){

	//START: only do this the first time a page is displayed/ every time a new column is added. 
	
	if(passOnFirstTime == 'true') {
		
	   var optional = 'Optional';
	   var strSel = '';
	 
	   if (selector.length > 0){
		 strSel = selector;
		 
	   }
	 
	   //FIXME: the below is not an issue but multiple handlers are being assigned to elements and it progressively impacts
	   // the speed of the element interaction. Do we need blur and focus ?( an onChange would help us achieve what is needed) .
	   
	    // watermark empty, optional fields   
	   $('.optional', selector).each(function(){
		   if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		    		$(this).val(optional).addClass('watermark');
		  		}
		   }
	   });
	   //if blur and no value inside, set watermark text and class again.
	 	$('.optional', selector).blur(function(){
	 		if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		    		$(this).val(optional).addClass('watermark');
				}
	 		}
	 	});
		//if focus and text is optional, set it to empty and remove the watermark class
		$('.optional', selector).focus(function(){
	  		if ($(this).val() == optional){
	    		$(this).val('').removeClass('watermark');
			}
		});
		// end watermark optional fields
		
		// required fields
		//DON't apply the selector multiple times to assign functions. Select the elements in one go and then apply all event handling functions.
		$('input.required', selector).each( function(){
			togglePreRequiredStyle($(this));	
	    }).blur( function () {
	    	$(this).removeClass('preRequired');
			//togglePreRequiredStyle($(this));
		}).focus( function () {
	        $(this).removeClass('preRequired');
		});
		
		//Handle the select boxes specifically.
		//the only native event Chosen triggers on the original select field is 'change'. so focus and blur is out of question.
		//Can add prototype functions to the plugin itself to achieve this. TBD.
		
		// will need to remove preRequired on blur and focus - JG
		$('select.required', selector).each( function() {
			if(null != $(this).val() &&  $(this).val().length == 0 && !$(this).hasClass("inlineError")) {
				$(this).addClass('preRequired').trigger('chosen:styleUpdated');
			} else {
				$(this).removeClass('preRequired').trigger('chosen:styleUpdated');
			}
		}).change(function () {
			$(this).removeClass('preRequired').trigger('chosen:styleUpdated');
		});
	}
}

function togglePreRequiredStyle(element) {
	if (null != element.val() &&  element.val().length == 0 && !element.hasClass("inlineError")) {
		element.addClass('preRequired');
	} else {
		element.removeClass('preRequired');
	}
}

function escapeDoubleQuotes(pageErrorInfoJSON){
	if(pageErrorInfoJSON==null || typeof pageErrorInfoJSON != "string"){
		return pageErrorInfoJSON;
	}
	
	//The below code re-constructs the JSON error from scratch by escaping all unwanted double quotes.
	//Need some more testing before finalizing this.
	/*var pageErrors = pageErrorInfoJSON.split('},');
	if(pageErrors==null || pageErrors.length==0){
		return pageErrorInfoJSON;
	}
	var pageErrorInfoJSONNew='';
	for(var errorCounter=0;errorCounter<pageErrors.length;errorCounter++){
		var jsonParses = pageErrorInfoJSON.split('},')[errorCounter].replace(/[[{]/g,'').replace(/[}]]/g,'').split(',');
		for(var jsonParseCount=0;jsonParseCount<jsonParses.length;jsonParseCount++){
			var jsonInners = jsonParses[jsonParseCount].split(':');
			for(var jsonInnerCounter=0;jsonInnerCounter<jsonInners.length;jsonInnerCounter++){
				var jsonErrMsgField = jsonInners[jsonInnerCounter];
				if(jsonErrMsgField.substring(0,1) == '"'){
					jsonErrMsgField = '"'+jsonErrMsgField.substring(1,jsonErrMsgField.length-1).replace(/"/g,'\\"')+'"';
				}
				pageErrorInfoJSONNew = pageErrorInfoJSONNew+jsonErrMsgField;
				if(jsonInnerCounter!=jsonInners.length-1){
					pageErrorInfoJSONNew = pageErrorInfoJSONNew+':';
				}
			}
			if(jsonParseCount!=jsonParses.length-1){
				pageErrorInfoJSONNew = pageErrorInfoJSONNew+',';
			}			
		}
		if(errorCounter!=pageErrors.length-1){
			pageErrorInfoJSONNew = pageErrorInfoJSONNew+'},{';
		}
	}
	pageErrorInfoJSONNew='[{'+pageErrorInfoJSONNew+'}]';
	return pageErrorInfoJSONNew;*/
	//TODO: Migrate to above commented code after testing
	return pageErrorInfoJSON.replace(/"/g,'\\"').replace(/&apos;/g,'\'')
			.replace(/[{:,}]+\\"/g,'$&"').replace(/\\""/g,'"')
			.replace(/\\"[{:,}]+/g,'"$&').replace(/"\\"/g,'"');
}

function disableFormsLink(){
	$("#formsLink").removeAttr("href");
	$('#formsLink').unbind('click');
	$('#formsLink').attr("disabled", "disabled");
}

function updatePriorPremium(){ logToDb("validation.js: 366 - Entering updatePriorPremium()"); // TODO Add Ajax call here.
	//alert("originalPremAmt="+originalPremAmt);
	var ratedIndicator = $('#ratedInd').val();
	var originalPremAmt = $('#premAmt').val();
	var currTab = $('#currentTab').val();
	
		
	if(currTab !='bind' && ratedIndicator !=null && ratedIndicator != undefined && ratedIndicator == 'Yes' && originalPremAmt != '0'){		
		var polKey =  $('#policyKey').val();
		//$("#rate").text("$0");
		//$('#prem_Amount').text(originalPremAmt);
		
		//alert("originalPremAmt="+originalPremAmt);
		//alert("polKey="+polKey);
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	           },
	        url: "/aiui/rate/resetPremAmt/dbupdate",
	        type: "post",
	        dataType: 'json',
	        data : JSON.stringify({ "originalPremAmt":originalPremAmt, "policyKey":polKey}),
	        timeout: 2500,
	        async:false,
	        success: function(response, textStatus){	logToDb("validation.js: 390 - In success handler of call /aiui/rate/resetPremAmt/dbupdate in updatePriorPremium()");
	        	        
	        var reponseStatus = JSON.stringify(response);	           
	       
	        var responseObject = eval('(' + reponseStatus + ')');
	        for (i in responseObject)
	        {
	           var updateStatus = responseObject[i]["status"];	           
	           if(updateStatus != 'noupdate'){		        	
	        		$('#defaultZeroedPremium').val("0.00");
		    		$('#premamt_no_change').hide();
		    		$('#premamt_change').show();
		    		//Comparater Advance Quote Override requirement
		    		  if($('#stateCd').val()=="MA"){
		    			  $('#advancedQuoteOverrideFlag').val('No');
		    			  //ajax call to set advancedAuoteOverrideFlag to NO.
		    			  resetMaxLevelDiscount();
		    		  }
	        	}	     
	        }
		       
	          	
	        },
	        // callback handler that will be called on error
	        error: function(textStatus, errorThrown){ logToDb("validation.js: 398 - In error handler of call /aiui/rate/resetPremAmt/dbupdate in updatePriorPremium() with status = " + textStatus + " and error message = " + errorThrown); // TODO Add Ajax call here.
		
	        },
	        complete: function(){
        	
        }
    });	
	}
}

//reset ADVANCE_QUOTE_OVERRIDE flag to NO. 
function resetMaxLevelDiscount(){
	var polKey =  $('#policyKey').val();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
        url: "/aiui/policies/resetMaxLevelDiscount",
        type: "post",
        dataType: 'json',
        timeout: 2500,
        async:false,
        data : JSON.stringify({"policyKey":polKey}),
        success: function(response, textStatus, jqXHR){ 
        	logToDb("summaryTab.js:  - In success handler of call /aiui/policies/resetMaxLevelDiscount in resetMaxLevelDiscount()");
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ 
        	logToDb("summaryTab.js:  - In success handler of call /aiui/policies/resetMaxLevelDiscount in resetMaxLevelDiscount() with status = " + textStatus + " and error message = " + errorThrown);  	
        },
        complete: function(){
        	
        }
    });
	return;
}

//hide crn link as user keys in data making rate inactive.
function resetCrnFlag(){
	var $crnLinkShow = $('#showCrnLink');
		$('#crnLinkHolder').hide();
	var crnLinkShow = $crnLinkShow.val() || 'NO';
	if( crnLinkShow === 'YES') {
		$crnLinkShow.val("NO");
		$('#pageAlertMessage').hide();
		$('#mainContent').css('padding-top', '0px');
		var consumerReportIndicator = $('#consumerReportIndicator').val();
		$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
        url: "/aiui/rate/resetCrnDisplayFlag",
        type: "post",
        dataType: 'json',
        data : JSON.stringify({ "consumerReportIndicator":consumerReportIndicator}),
        timeout: 2500,
        async:false,
        success: function(response, textStatus, jqXHR){ logToDb("validation.js: 484 - In success handler of call /aiui/rate/resetCrnDisplayFlag in resetCrnFlag()");
        	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ logToDb("validation.js: 488 - In error handler of call /aiui/rate/resetCrnDisplayFlag in resetCrnFlag() with status = " + textStatus + " and error message = " + errorThrown);  // TODO Add Ajax call here.
	
        },
        complete: function(){
        	
        }
    });
	}
	return;
}


function resetPremium(ratedIndicator,originalPremAmt){logToDb("validation.js: 408 - Entering resetPremium(" + ratedIndicator + ", " + originalPremAmt + ")"); // TODO Add Ajax call here.
	//If premium is already reset, do not make ajax call again
	var wasPremiumAffected = $('#defaultZeroedPremium').val();
	if(wasPremiumAffected != null && wasPremiumAffected != '') {
		return ;
	}
	
	var currTab = $('#currentTab').val();
	if(isEndorsement()) {
		$('#premAmt').val(0);
		$('#defaultZeroedPremium').val("0.00");
		
		//show refresh icon on reset premium
		$('#premamt_no_change').hide();
		$('#premamt_change').show();
		
		disableFormsLink();
	    
	    if( $('div#formTop').find('div.uwAlert').length>0){
	    	$('#pageAlertMessage').hide();
	    }
	    
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	           },
	        url: "/aiui/rate/resetPremAmt",
	        type: "post",
	        dataType: 'json',
	        data : JSON.stringify({ "originalPremAmt":originalPremAmt}),
	        timeout: 2500,
	        async:false,
	        success: function(response, textStatus, jqXHR){ logToDb("validation.js: 424 - In success handler of call /aiui/rate/resetPremAmt in resetPremium()");
	        	originalPremAmt = response.originalPremAmt;
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){ logToDb("validation.js: 428 - In error handler of call /aiui/rate/resetPremAmt in resetPremium() with status = " + textStatus + " and error message = " + errorThrown);  // TODO Add Ajax call here.
		
	        },
	        complete: function(){
	        	
	        }
	    });
		return;
	}
	
	//alert("originalPremAmt="+originalPremAmt);
	if(currTab !='bind' && ratedIndicator !=null && ratedIndicator != undefined && ratedIndicator == 'Yes' && originalPremAmt != '0'){

		$('#defaultZeroedPremium').val("0.00");
		$('#premamt_no_change').hide();
		$('#premamt_change').show();
		var polKey =  $('#policyKey').val();
		//$("#rate").text("$0");
		//$('#prem_Amount').text(originalPremAmt);
		
		//alert("originalPremAmt="+originalPremAmt);
		//alert("polKey="+polKey);
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	           },
	        url: "/aiui/rate/resetPremAmt",
	        type: "post",
	        dataType: 'json',
	        data : JSON.stringify({ "originalPremAmt":originalPremAmt}),
	        timeout: 2500,
	        success: function(response, textStatus, jqXHR){ logToDb("validation.js: 459 - In success handler of call /aiui/rate/resetPremAmt in resetPremium()");
	       	
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){ logToDb("validation.js: 463 - In error handler of call /aiui/rate/resetPremAmt in resetPremium() with status = " + textStatus + " and error message = " + errorThrown); // TODO Add Ajax call here.
		
	        },
	        complete: function(){
	        	
	        }
	    });	
	}
	//51972 - individual coverage premiums not reset to $0 when change made to quote
	$('.clsPremiumAmtDisplay').text('');
	// hide forms link
	disableFormsLink();
	//alert("priorRatedPremAmt="+priorRatedPremAmt);
    logToDb("validation.js: 476 - Exiting resetPremium(" + ratedIndicator + ", " + originalPremAmt + ")"); //alert("originalPremAmt="+originalPremAmt); // TODO Add Ajax call here.
}


//This function is to revert Premium on cancel button
function revertPremium(){ logToDb("validation.js: 481 - Entering revertPremium()"); // TODO Add Ajax call here.
	
/*	$('#defaultZeroedPremium').val("0.00");
	$('#premamt_no_change').hide();
	$('#premamt_change').show();
	var polKey =  $('#policyKey').val();*/
	var originalPremAmt = $('#premAmt').val();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
        url: "/aiui/rate/revertPremium",
        type: "post",
        dataType: 'json',
        data : JSON.stringify({ "originalPremAmt":originalPremAmt}),
        timeout: 2500,
        async:false,
        success: function(response, textStatus, jqXHR){ logToDb("validation.js: 499 - In success handler of call /aiui/rate/revertPremium in revertPremium()");
       	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ logToDb("validation.js: 503 - In error handler of call /aiui/rate/revertPremium in revertPremium() with status = " + textStatus + " and error message = " + errorThrown); // TODO Add Ajax call here.
	
        },
        complete: function(){
        	
        }
    });	logToDb("validation.js: 509 - Exiting revertPremium()"); // TODO Add Ajax call here.


}

function getValidationEvent() {
	return 'validateInput';
}

// functions called to manage the Page alerts
var pageAlertDivName= 'formTop';
var mainContentDivName= 'mainContent';
var editsModalDivName= 'aiTemplate';
var strStandardInLineMsg = "See Page Alert";

var uwMsgType;

function showUWMessageInfo(uwMessageInfoSel){

	var uwMessageInfoSelJSON = jQuery.parseJSON(uwMessageInfoSel); 
	var uwMessageType = uwMessageInfoSelJSON[0].type;
	//remove this after
	//uwMessageType='DONOTBIND';
	uwMsgType = uwMessageType;
	//var uwMessage = '';

	//Page Alert messages
	var acceptMessage = $('#uwDecisionDesc').val();
	if ( isEndorsement() ) {
		acceptMessage = 'Successful';
	}
	
	var declineMessage = $('#uwDecisionDesc').val();
	var holdMessage = $('#uwDecisionDesc').val();
	var holdMessageENDR = 'Upon submission, the endorsement will be referred for underwriter review for the following reason(s):';
	var modelSingleSoftAlertMsg = '<div id = "pageAlertMessage" class="aiAlert TYPEALERT">PAGEALERTTEXT</div>';
	var modelMultiAlertMsg = '<div id = "pageAlertMessage" class="aiAlert TYPEALERT">PAGEALERTTEXT<BR>To view reasons, please click <span id="openErrorModal" class="link">view details</span>.</div>';
	var pageAlertMsg = '';

	// Modal windows
	// No modal window for Accept
	//Decline Boilerplate
	var modelUWModalMsgDeclinePre =  '<div id="editsModal" class="errorDetailsPopup draggable resizable modal" tabindex="-1">';
	var modelUWModalMsgDeclineTop = $('#uwDecisionDesc').val();
	var modelUWModalMsgReasons = '';
	//Hold Boilerplate
	var modelUWModalMsgHoldPre = '<div id="editsModal" class="errorDetailsPopup draggable resizable modal" tabindex="-1">';
	var modelUWModalMsgHoldTop = $('#uwDecisionDesc').val();
	var modelUWModalMsgHoldTopENDR = 'Upon submission, the endorsement will be referred for the underwriter review for the following reason(s):';
	var modelUWModalMsgHoldBotton = '<b>Please enter any additional information for the underwriter in the "Notes".  If applicable.</b>';
	var modalMsg = '';
	
	var modelUWModalMsg = '<div class="resizePush" style="height: auto !important">';
	modelUWModalMsg = modelUWModalMsg + '<div class="ERRORTYPEModal">';   //warning Modal !!!!!  errorModal
	modelUWModalMsg = modelUWModalMsg + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelUWModalMsg = modelUWModalMsg + '<div class="alertModalHeader dragHandle" style="margin-bottom: 0;">';
	modelUWModalMsg = modelUWModalMsg + '<b>PAGEALERTTEXTTOP</b>';
	modelUWModalMsg = modelUWModalMsg + '</div>';
	modelUWModalMsg = modelUWModalMsg + '<div class="ERRORTYPEModalBody" style="margin-top: 28px;">'; //warningModalBody !!!!!  errorModalBody
    modelUWModalMsg = modelUWModalMsg + '<ul class="ERRORMESSAGELIST">';
    modelUWModalMsg = modelUWModalMsg + 'PAGEALERTUWMESSAGE';
    modelUWModalMsg = modelUWModalMsg + '</ul>';
    modelUWModalMsg = modelUWModalMsg + '<div class="alertModalHeader" style="margin-bottom: 0;">'
    modelUWModalMsg = modelUWModalMsg + 'PAGEALERTTEXTBOTTOM';
    modelUWModalMsg = modelUWModalMsg + '</div>';  
    modelUWModalMsg = modelUWModalMsg + '</div>'; 
    modelUWModalMsg = modelUWModalMsg + '<div class="errorMsgFooter dragHandle">';
    modelUWModalMsg = modelUWModalMsg + '<a href="#" class="closeModal">Close</a>';
    modelUWModalMsg = modelUWModalMsg + '</div>';
    
	if (uwMessageType!='' && (uwMessageType.toUpperCase() == 'ACCEPT' || uwMessageType.toUpperCase() == 'REFER')){
		pageAlertMsg = modelSingleSoftAlertMsg.replace ('TYPEALERT', 'successAlert uwAlert');
		pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', acceptMessage);
	}else if (uwMessageType!='' && uwMessageType.toUpperCase() == 'DECLINE'){
		pageAlertMsg = modelMultiAlertMsg.replace ('TYPEALERT', 'hardAlert uwAlert');
		pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', declineMessage);
		modalMsg = modelUWModalMsgDeclinePre + modelUWModalMsg;
		modalMsg = modalMsg.replace(/ERRORTYPE/g, 'error');		
		modalMsg = modalMsg.replace('PAGEALERTTEXTTOP', modelUWModalMsgDeclineTop);
		modalMsg = modalMsg.replace('ERRORMESSAGELIST', 'hardErrorMsgList');
		modalMsg = modalMsg.replace('PAGEALERTUWMESSAGE', getUWMessages(uwMessageInfoSelJSON));
		modalMsg = modalMsg.replace('PAGEALERTTEXTBOTTOM', '');
	}else if (uwMessageType!='' && uwMessageType.toUpperCase() == 'HOLD'){
		pageAlertMsg = modelMultiAlertMsg.replace ('TYPEALERT', 'softAlert uwAlert');
		if ( isEndorsement() ) {
			pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', holdMessageENDR);	
		} else {
			pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', holdMessage);	
		}					
		modalMsg = modelUWModalMsgHoldPre + modelUWModalMsg;
		modalMsg = modalMsg.replace(/ERRORTYPE/g, 'warning');
		if ( isEndorsement() ) {
			modalMsg = modalMsg.replace('PAGEALERTTEXTTOP', modelUWModalMsgHoldTopENDR);
		} else {
			modalMsg = modalMsg.replace('PAGEALERTTEXTTOP', modelUWModalMsgHoldTop);	
		}
		
		modalMsg = modalMsg.replace('ERRORMESSAGELIST', 'softErrorMsgList');
		modalMsg = modalMsg.replace('PAGEALERTUWMESSAGE', getUWMessages(uwMessageInfoSelJSON));
		modalMsg = modalMsg.replace('PAGEALERTTEXTBOTTOM', modelUWModalMsgHoldBotton);		
	}else if (uwMessageType!='' && uwMessageType.toUpperCase() == 'DONOTBIND'){
		pageAlertMsg = modelMultiAlertMsg.replace ('TYPEALERT', 'softAlert uwAlert');
		if ( isEndorsement() ) {
			pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', holdMessageENDR);	
		} else {
			//Remove it later
			//holdMessage = 'Test parent message from UW Remove it later'
			pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', holdMessage);	
		}					
		modalMsg = modelUWModalMsgHoldPre + modelUWModalMsg;
		modalMsg = modalMsg.replace(/ERRORTYPE/g, 'warning');
		if ( isEndorsement() ) {
			modalMsg = modalMsg.replace('PAGEALERTTEXTTOP', modelUWModalMsgHoldTopENDR);
		} else {
			modalMsg = modalMsg.replace('PAGEALERTTEXTTOP', modelUWModalMsgHoldTop);	
		}
		
		modalMsg = modalMsg.replace('ERRORMESSAGELIST', 'softErrorMsgList');
		modalMsg = modalMsg.replace('PAGEALERTUWMESSAGE', getUWMessages(uwMessageInfoSelJSON));
		modalMsg = modalMsg.replace('PAGEALERTTEXTBOTTOM', "");		
		
	}else{
		pageAlertMsg = modelSingleSoftAlertMsg.replace ('TYPEALERT', 'hardAlert uwAlert');
		pageAlertMsg = pageAlertMsg.replace ('PAGEALERTTEXT', 'Unknown message type, please notify ....:' + uwMessageType);			
	}
	
	$('#' + pageAlertDivName).append(pageAlertMsg);
	var thisTab = document.aiForm.currentTab.value;
	if (thisTab == DRIVERSTABNAME || thisTab == VEHICLESTABNAME || thisTab == COVERAGESTABNAME){
	//if($('.slidingFrame').length > 0){
		$('#' + pageAlertDivName).attr("style", "padding: 15px 0 10px 20px;");
		$('#' + mainContentDivName).attr("style", "margin-top: 143px;");		
	} else if (thisTab == CLIENTTABNAME || thisTab == ACCIDENTSVIOLATIONSTABNAME || thisTab == DETAILSTABNAME 
			|| thisTab == SUMMARYTABNAME) {
		$('#' + pageAlertDivName).attr("style", "padding: 20px 0 0px 20px; height: 50px;");
		$('#' + mainContentDivName).attr("style", "margin-top: 216px;");
	}  else if (thisTab == BINDTAB) {
		$('#' + pageAlertDivName).attr("style", "padding: 20px 0 0px 20px; height: 50px;");
		$('#' + mainContentDivName).attr("style", "margin-top: 216px !important;");
	}else{
		$('#' + pageAlertDivName).attr("style", "padding: 15px 0 0px 30px;");
		$('#' + mainContentDivName).attr("style", "margin-top: 186;");
	}
	// allow room for page Alert
	$('#pageAlertMessage').show();

	if(modalMsg.length > 1){
		$('#' + editsModalDivName).append(modalMsg);		
	}
 }

function getUWMessages(uwMessageInfoSelJSON){
//function builds uwMessages list
	var strUWMessage = '';
	
	if(uwMessageInfoSelJSON.length == 1){
		// no message send default
		if (uwMessageInfoSelJSON[0].type == 'HOLD'){
			strUWMessage = '<li class="errorMsg">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Additional information may be required for rating or policy issuance.</li>'				
		}else if (uwMessageInfoSelJSON[0].type == 'DECLINE'){
			strUWMessage = '<li class="errorMsg">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The risk is outside of our underwriting guidelines</li>'
		}
	}else{
		// send message from server starting in the second line
		for (var i = 1; i < uwMessageInfoSelJSON.length; i++){
			strUWMessage = strUWMessage + '<li class="errorMsg">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + uwMessageInfoSelJSON[i].message + '</li>' 
		}
		
	}
	return strUWMessage;	
}

function showProcessEdits(processErrorInfoSel){
	
	var modelProcessMsgPre = '<div id="processEditMessage" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="resizePush">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="errorModal">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalHeader dragHandle">';
	modelProcessMsgPre = modelProcessMsgPre + '<b>ERROR!</b>';
	modelProcessMsgPre = modelProcessMsgPre + '</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalBody">';
    var modelProcessMsg = '';
    var modelProcessMsgPost = '</div>';  
    modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '<div class="modal-footer dragHandle">';
	
	var strTab = getLeftMostTab(processErrorInfoSel);
	$('#tabWithErrors').val(strTab);
	//modelProcessMsgPost = modelProcessMsgPost + '<input type="button" onclick="javascript:nextTab (document.aiForm.currentTab.value, \'' + strTab + '\');" value="Fix Now" class="aiBtn primaryBtn closeModal"/>';
	//modelProcessMsgPost = modelProcessMsgPost + '<input type="button" onclick="javascript:fixNowForRating( \'' + strTab + '\');" value="Fix Now" class="aiBtn primaryBtn closeModal"/>';
	modelProcessMsgPost = modelProcessMsgPost + '<input type="button" onclick="fixErrorsNow();" value="Fix Now" class="aiBtn primaryBtn closeModal"/>';
	
	//removed onclick="fixLaterForRating();" ad fix later should not reload, simply closing popup

	//04/18/2014 - Defect 44382 - Adding back onclick="fixLaterForRating();" Page reload should happen for FIX LATER to show inline error messages. 
	//			If this onClick is to be removed, corresponding changes have to be made to the "validation framework" to show inline messages by default.
	//07/24 - Removed onClick="fixLaterForRating" because now we are showing errros even when popup is there
	modelProcessMsgPost = modelProcessMsgPost + '<input type="button" value="Fix Later" class="aiBtn secondaryBtn closeModal"/>';
	
	modelProcessMsgPost = modelProcessMsgPost + '<a href="#" class="closeModal" data-dismiss="modal">Close</a>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>'; 
	
    modelProcessMsg = 'Before rating all errors must be fixed, tabs with exclamations have errors needing fixes.';
    
	$('#' + editsModalDivName).append(modelProcessMsgPre + modelProcessMsg  + modelProcessMsgPost);		
	$("#processEditMessage").trigger(showErrorPopup);

}

function showConvertToIssueWarning(processErrorInfoSel){
	
	var modelProcessMsgPre = '<div id="processEditMessage" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="resizePush">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="warningModal">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalHeader dragHandle">';
	modelProcessMsgPre = modelProcessMsgPre + '<b>WARNING!</b>';
	modelProcessMsgPre = modelProcessMsgPre + '</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalBody">';
    var modelProcessMsg = '';
    var modelProcessMsgPost = '</div>';  
    modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '<div class="modal-footer dragHandle">';
	
	var strTab = getLeftMostTab(processErrorInfoSel);
	$('#tabWithErrors').val(strTab);
	modelProcessMsgPost = modelProcessMsgPost + '<input type="button" onclick="fixErrorsNow();" value="Fix Now" class="aiBtn primaryBtn closeModal"/>';
	modelProcessMsgPost = modelProcessMsgPost + '<input type="button" value="Fix Later" class="aiBtn secondaryBtn closeModal"/>';
	
	modelProcessMsgPost = modelProcessMsgPost + '<a href="#" class="closeModal" data-dismiss="modal">Close</a>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>'; 
	
    modelProcessMsg = 'This Endorsement has changed from "Quote" to "Endorse". Tabs with Red Exclamation Points(!) need immediate attention.';
    
	$('#' + editsModalDivName).append(modelProcessMsgPre + modelProcessMsg  + modelProcessMsgPost);		
	$("#processEditMessage").trigger(showErrorPopup);

}




function showServiceProcessErrors(strErrMesg){
	
	var modelProcessMsgPre = '<div id="processErrorMessage" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="resizePush">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="errorModal">';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalHeader dragHandle">';
	modelProcessMsgPre = modelProcessMsgPre + '<b>ERROR!</b>';
	modelProcessMsgPre = modelProcessMsgPre + '</div>';
	modelProcessMsgPre = modelProcessMsgPre + '<div class="alertModalBody">';
    var modelProcessMsg = '';
    var modelProcessMsgPost = '</div>';  
    modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '<div class="modal-footer dragHandle">';	
	modelProcessMsgPost = modelProcessMsgPost + '<input type="button" value="OK" class="aiBtn primaryBtn closeModal"/>';		
	modelProcessMsgPost = modelProcessMsgPost + '<a href="#" class="closeModal" data-dismiss="modal">Close</a>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>';
	modelProcessMsgPost = modelProcessMsgPost + '</div>'; 
	
    modelProcessMsg = strErrMesg;
    
	$('#' + editsModalDivName).append(modelProcessMsgPre + modelProcessMsg  + modelProcessMsgPost);		
	$("#processErrorMessage").trigger(showErrorPopup);

}

function getLeftMostTab(processErrorInfoSel){ logToDb("validation.js: 675 - Entering getLeftMostTab(" + processErrorInfoSel + ")"); // TODO Add Ajax call here.
 var strTab = '';
 var processErrorInfoSelJSON = jQuery.parseJSON(processErrorInfoSel); 
 
	for (var i = 0; i < processErrorInfoSelJSON.length; i++){
		if(numTabValue(processErrorInfoSelJSON[i].tabName) < numTabValue(strTab)){
			strTab = processErrorInfoSelJSON[i].tabName;
		}
	} 	logToDb("validation.js: 683 - Exiting getLeftMostTab(" + processErrorInfoSel + ")");   // TODO Add Ajax call here.
	return strTab;
}

function numTabValue(strTabName){
	
	if (strTabName == CLIENTTABNAME){
		return CLIENTTABNUMBER;
	}else if (strTabName == DRIVERSTABNAME){
		return DRIVERSTABNUMBER;
	}else if (strTabName == VEHICLESTABNAME){
		return VEHICLESTABNUMBER;
	}else if (strTabName == ACCIDENTSVIOLATIONSTABNAME){
		return ACCIDENTSVIOLATIONSTABNUMBER;
	}else if (strTabName == DETAILSTABNAME){
		return DETAILSTABNUMBER;
	}else if (strTabName == COVERAGESTABNAME){
		return COVERAGESTABNUMBER;
	}else if (strTabName == SUMMARYTABNAME){
		return SUMMARYTABNUMBER;
	}
	return 99;
}

function showPageAlerts(){
	var messageMap;
	var fieldIdMap;
	
	if($("#errorMessages").val()){
		messageMap = JSON.parse($("#errorMessages").val());	
	}
	if($("#errorFields").val()){
		fieldIdMap = JSON.parse($("#errorFields").val());	
	}
	var errorRowMap = {};
	$(".errorRow").each(function() {
		errorRowMap[this.id] = $(this).outerHTML();
	});
	
	var haveMessages = messageMap != null && Object.keys(messageMap).length > 0;
	var haveFields = fieldIdMap != null && Object.keys(fieldIdMap).length > 0;
	var haveRows = errorRowMap != null && Object.keys(errorRowMap).length > 0;
	
	if(! haveMessages && typeof errorMessageJSON != 'undefined') {
		messageMap = errorMessageJSON;
		haveMessages = true;
	}
	if(! haveFields && typeof fieldIds != 'undefined') {
		fieldIdMap = fieldIds;
		haveFields = true;
	}
	
	if(! haveRows && typeof fieldIdToModelErrorRow != 'undefined') {
		errorRowMap = fieldIdToModelErrorRow;
		haveRows = true;
	}
	
	var polStarError = '';
	var pageErrorInfoSel = $('#' + jq('pageErrorInfo'));	
	var pageErrorInfoJSON = pageErrorInfoSel.val(); 
	pageErrorInfoJSON = escapeDoubleQuotes(pageErrorInfoJSON);
	var pageErrorInfos = jQuery.parseJSON(pageErrorInfoJSON);
	if (pageErrorInfos[0].fieldID.substring(0, 8) == 'POLSTAR_'){
		polStarError = 'Yes';
	}
		
	if (haveMessages && haveFields && haveRows) {
		showPageAlertsWithMap(messageMap, fieldIdMap, errorRowMap);
	}else if (polStarError == 'Yes') {
		showPageAlertsWithMap(messageMap, fieldIdMap, errorRowMap);
	}
}

function showPageAlertsWithMap(messageMap, fieldIdMap, errorRowMap){
		
	var modelSingleHardAlertMsg = '<div id = "pageAlertMessage" class="aiAlert hardAlert">The following error must be fixed prior to proceeding.<BR>ALERTMSG</div>';
	var modelSingleSoftAlertMsg = '<div id = "pageAlertMessage" class="aiAlert softAlert">ALERTMSG</div>';
	var modelMultiAlertMsg = '<div id = "pageAlertMessage" class="aiAlert TYPEALERT">Errors exist on this page that require attention prior to leaving this page.  See below.  There are multiple messages, please click <a href="#" id="openErrorModal">VIEW DETAILS</a> for error descriptions.</div>';

	
	//For third party services we do not need any other text on pageAlert except the message for hard edits
	//third party services messages begin with tp_svc_fail this should be one error with the message for the service failed
	var modelServiceFailureAlertMsg = '<div id = "pageAlertMessage" class="aiAlert hardAlert">ALERTMSG</div>';
	
	//Polstar Override Message for Agents
	
	var modelPolStarAlertMsg = '<div class="aiAlert softAlert">';
	modelPolStarAlertMsg = modelPolStarAlertMsg + '<b>An error has occurred.</b>  ';
	modelPolStarAlertMsg = modelPolStarAlertMsg + 'Our system is currently experiencing difficulties rating this policy. Please contact your underwriter for assistance.<br/>';
	modelPolStarAlertMsg = modelPolStarAlertMsg + '</div>';

	//Page Alert HTML
	var modelMultiAlertModalMsgPre = '<div id="editsModal" class="errorDetailsPopup draggable resizable modal" tabindex="-1">';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + '<div class="resizePush">';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + '<div class="errorDetailsPopupHeader dragHandle">';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + '<button type="button" class="closeModal close">x</button>';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + 'The following are page edits/errors on this page.';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + '</div>';
	modelMultiAlertModalMsgPre = modelMultiAlertModalMsgPre + '<div class="errorDetailsPopupBody">';
	
	var modelHardMultiAlertModalMsgPre = '<div class="errorMsgSection">';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<div class="errorMsgHeader dragHandle">';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<div class="errorIcon"></div>';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<div class="errorMsgHeaderText">';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<b>ERROR!</b>';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '</div></div>';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<div class="errorMsgBody">';
	modelHardMultiAlertModalMsgPre = modelHardMultiAlertModalMsgPre + '<ul class="hardErrorMsgDetails">';
	
	var modelSoftMultiAlertModalMsgPre = '<div class="errorMsgSection">';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<div class="errorMsgHeader dragHandle">';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<div class="warningIcon"></div>';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<div class="errorMsgHeaderText">';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<b>WARNING!</b>';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '</div></div>';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<div class="errorMsgBody">';
	modelSoftMultiAlertModalMsgPre = modelSoftMultiAlertModalMsgPre + '<ul class="softErrorMsgDetails">';

	var modelMultiAlertModalMsgFixNow = '<li class="errorMsg">ALERTMSG <a onclick="closeSetFocus(\'FIELDID\')">Fix Now</a></li>';
	var modelMultiAlertModalMsg = '<li class="errorMsg">ALERTMSG</li>';
	
	var modelMultiAlertModalSectionPost = '</ul></div></div>';
		
	var modelMultiAlertModalPost = '</div></div>';
	modelMultiAlertModalPost = modelMultiAlertModalPost + '<div class="errorMsgFooter dragHandle">';
	modelMultiAlertModalPost = modelMultiAlertModalPost + '<a href="#" class="closeModal">Close</a>';
	modelMultiAlertModalPost = modelMultiAlertModalPost + '</div></div>';
	
	//Service error Pop Up Modal- Start
	var modelServiceFaailurePopUpMsgPre = '<div id="popupModal" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="resizePush">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="LC-ERROR-WARNINGModal">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="alertModalHeader dragHandle">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<b>ERROR-WARNING!</b>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '</div>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="LC-ERROR-WARNINGModalBody">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<ul class="HARDSOFTErrorMsgList">';
	//Service error Pop Up Modal- End
	
	
	//Popup Page Alert
	var modelPopUpMsgPre = '<div id="popupModal" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelPopUpMsgPre = modelPopUpMsgPre + '<div class="resizePush">';
	modelPopUpMsgPre = modelPopUpMsgPre + '<div class="LC-ERROR-WARNINGModal">';
	modelPopUpMsgPre = modelPopUpMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelPopUpMsgPre = modelPopUpMsgPre + '<div class="alertModalHeader dragHandle">';
	modelPopUpMsgPre = modelPopUpMsgPre + '<b>ERROR-WARNING!</b> The following errors must be fixed.';
	modelPopUpMsgPre = modelPopUpMsgPre + '</div>';
	modelPopUpMsgPre = modelPopUpMsgPre + '<div class="LC-ERROR-WARNINGModalBody">';
	modelPopUpMsgPre = modelPopUpMsgPre + '<ul class="HARDSOFTErrorMsgList">';
	
	var modelPopUpMsgRow = '<li class="errorMsg">POPUPMSG</li>';

	var modelPopUpMsgPost = '</ul>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '<div class="modal-footer dragHandle">';
	
	var modelPopUpMsgFixNow = '<input type="button" onclick="closeSetFocus(\'FIXNOWFIELDID\');" value="Fix Now" class="aiBtn primaryBtn closeModal"/>';
	var modelPopUpMsgFixLater = '<input type="button" onclick="fixLater();" value="Fix Later" class="aiBtn secondaryBtn"/>';
	var modelPopUpMsgLast = '<a href="#" class="closeModal" data-dismiss="modal">Close</a>';
	modelPopUpMsgLast = modelPopUpMsgLast + '</div>';
	modelPopUpMsgLast = modelPopUpMsgLast + '</div>'; 

	var firstPopUpFieldID = '';
	var hardPopUpMessage = '';
	var softPopUpMessage = '';
	var hardPopUp = false;
	var softPopUp = false;
	
	var strErrorRow = '';

	var pageErrorInfoSel = $('#' + jq('pageErrorInfo'));

    if (pageErrorInfoSel == null || pageErrorInfoSel.length == 0) {
    	//no error data, leave!
    	return;
    }
          
	var pageErrorInfoJSON = pageErrorInfoSel.val(); 
	if (pageErrorInfoJSON == null || pageErrorInfoJSON == '' || pageErrorInfoJSON == '[]'){
	  	//no error data, leave!
	   	return;	  
	}
	pageErrorInfoJSON = escapeDoubleQuotes(pageErrorInfoJSON);
	var pageErrorInfos = jQuery.parseJSON(pageErrorInfoJSON);
	//clear any previous alerts
	//removeAllPageAlerts();

	var category = 'soft';  //there is at least one error
	var intRowCount = 0;
	var pageMessage = '';
	var strErrorMsgID = '';
	var pageAlertMsg = '';
	var fieldId = '';
	var fieldIdWithIndex = '';
	var popUpFieldId = '';
	var showPageDetails = ''; 
	var lastFieldId = '';
	var lastIndex = '';
	var lastMessageCode = '';
	var blnDupMsg = false;
	var softModalMsgs = '';
	var hardModalMsgs = '';
	var polStarError = '';
	
	//if (pageErrorInfos[0].fieldID == 'POLSTAR_SERVICE_ERROR' || pageErrorInfos[0].fieldID == 'POLSTAR_EDIT_ERROR'  || pageErrorInfos[0].fieldID == 'POLSTAR_RESPONSE_PROCESSING_ERROR'){
	
	if (pageErrorInfos[0].fieldID.substring(0, 8) == 'POLSTAR_'){
		polStarError = 'Yes'
	}else{
		polStarError = 'No'
	}
	if (polStarError == 'Yes' && $('#userType').val() == 'A' && pageErrorInfos[0].fieldID != 'POLSTAR_EDIT_ERROR'){
		//Polstar Error Msg for agents		
		// but, show POLSTAR Edit errors -> they are human readable messages
		pageAlertMsg = modelPolStarAlertMsg;
		showPageDetails = 'No';
	}else{
		//Routine error handling
		//select modal message
		pageMessage = getMessageWithMap(fieldId + '.server.pageAlert.' + pageErrorInfos[0].messageCode, messageMap, pageErrorInfos[0].replaceContentMap);
		if (pageErrorInfos.length == 1 && pageMessage.length <= 100){
			showPageDetails = 'No';
			// single error message and message fits on one line
			if(pageErrorInfos[0].category == 'hard'){
				pageAlertMsg = modelSingleHardAlertMsg;
			}else{
				pageAlertMsg = modelSingleSoftAlertMsg;			
			}
		}else{
			//multiple error messages or message too long
			if(pageErrorInfos.length > 0){
				showPageDetails = 'Yes';
				pageAlertMsg = modelMultiAlertMsg;
			}
		}
		
		for (var i = 0; i < pageErrorInfos.length; i++){
			var strHardErrorMessage;
			intRowCount++;
			//pageAlertMsg = modelAlertMsgPost.replace('##', intRowCount + ". ");
			if (lastFieldId == pageErrorInfos[i].fieldID && 
				lastIndex == pageErrorInfos[i].index &&
			    lastMessageCode == pageErrorInfos[i].messageCode){
				//skip dups for Page Alert and PopUp
				// but show for inLine
				blnDupMsg = true;
			}else{
				blnDupMsg = false;
				lastFieldId = pageErrorInfos[i].fieldID;
				lastIndex = pageErrorInfos[i].index;
				lastMessageCode = pageErrorInfos[i].messageCode;
			}
			
			//get id of element on page
			fieldId = getFieldIdWithMap (pageErrorInfos[i].fieldID, fieldIdMap);
			if(fieldId.indexOf("primary_insured")!=-1 || fieldId.indexOf("secondary_insured")!=-1){
				fieldIdWithIndex = fieldId;
			}
			else{
				fieldIdWithIndex = getFieldIdWithIndex(fieldId, pageErrorInfos[i].index);	
			}
			//get inline message
			strErrorMsgID = fieldId + '.server.inLine.' + pageErrorInfos[i].messageCode;
			var pageIndex = pageErrorInfos[i].index;
			strErrorRow = getErrorRowWithMap(pageErrorInfos[i], errorRowMap);
			if(fieldId.indexOf("acc_") == -1 && fieldId.indexOf("vio_") == -1){
				if (pageIndex == null || pageIndex < 0){
					if(fieldId.indexOf("primary_insured")!=-1 || fieldId.indexOf("secondary_insured")!=-1){
						showClearInLineErrorMsgsWithMap(fieldId, strErrorMsgID, strErrorRow,'app', messageMap, null, pageErrorInfos[i].replaceContentMap);
					}
					else{
							showClearInLineErrorMsgsWithMap(fieldId, strErrorMsgID, strErrorRow,
							-1, messageMap, null, pageErrorInfos[i].replaceContentMap);
					}
				}else{
					showClearInLineErrorMsgsWithMap(fieldIdWithIndex, strErrorMsgID, strErrorRow,
							pageErrorInfos[i].index, messageMap, null, pageErrorInfos[i].replaceContentMap);
				}
			}

			//skip the rest of this for if a duplicate
			if (blnDupMsg){
				continue;
			}

			if(fieldId.indexOf("acc_") != -1 || fieldId.indexOf("vio_") != -1){
				var fieldIdArray = fieldId.split('_');
				fieldId = fieldIdArray[0] + '_' + fieldIdArray[fieldIdArray.length - 1];   
			}
			
			
			if (fieldId.length  == 0){
				//If no fieldId, just show the messagecode
				pageMessage = pageErrorInfos[i].messageCode;
			}else{
				//get page alert message
				pageMessage = getMessageWithMap(fieldId + '.server.pageAlert.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap);	
				pageMessage = formatErrorMsgForDisplay(pageErrorInfos[i].index, pageMessage, pageErrorInfos[i].messageCode);
			}
			
			// This is a message, that can be used for messages that has to be deleted,
			// but the control needs a red rim, refer driverTab-enhanced.js 
			// function deleteUnwantedInlineErrors
			if(pageMessage == "To be found and deleted from client js"){
				continue;
			}
			
			//Fix for 52619 - License number & license number masked issue -- special case
			if(pageErrorInfos[i].fieldID == 'driver.licenseNumber' && $('#'+fieldIdWithIndex).is(":hidden")){
				//check if the field is masked or unmasked and se the focusField
				fieldIdWithIndex = 'maskLicNum_' + pageErrorInfos[i].index;
			}
			
			var focusFieldIdWithIndex = fieldIdWithIndex;
			if (focusFieldIdWithIndex.length == 0){
				focusFieldIdWithIndex = 'NotFound';
			} 
			if (showPageDetails == 'Yes'){
				if (pageErrorInfos[i].category == 'hard'){
					//build the modal hard and soft msgs separately
					if (fieldId.length  == 0 || polStarError == 'Yes'){
						//no field id to set focus if len=0 or this is a P* error message
						hardModalMsgs = hardModalMsgs + modelMultiAlertModalMsg;
					}else{
								hardModalMsgs = hardModalMsgs + modelMultiAlertModalMsgFixNow;
								hardModalMsgs = hardModalMsgs.replace(/FIELDID/g, focusFieldIdWithIndex);
					}
					hardModalMsgs = hardModalMsgs.replace('ALERTMSG', pageMessage);
				}else{
					//build the modal hard and soft msgs separately				
					if (fieldId.length  == 0 || polStarError == 'Yes'){
						//no field id to set focus if len=0 or this is a P* error message						
						softModalMsgs = softModalMsgs + modelMultiAlertModalMsg;
					}else{

							softModalMsgs = softModalMsgs + modelMultiAlertModalMsgFixNow;
							softModalMsgs = softModalMsgs.replace(/FIELDID/g, focusFieldIdWithIndex);
					}
					softModalMsgs = softModalMsgs.replace('ALERTMSG', pageMessage);
				}
			}else{
				// just one error
				if (fieldId.length  == 0){
				}else{
					pageAlertMsg = pageAlertMsg
					pageAlertMsg = pageAlertMsg.replace(/FIELDID/g, focusFieldIdWithIndex);
				}
				pageAlertMsg = pageAlertMsg.replace('ALERTMSG', pageMessage);
			}
			
			//Build popUp message
			popUpFieldId = getFieldIdWithMap (pageErrorInfos[i].fieldID, fieldIdMap);
			if(popUpFieldId.indexOf("acc_") != -1 || popUpFieldId.indexOf("vio_") != -1){
				var fieldIdArray = popUpFieldId.split('_');
				popUpFieldId = fieldIdArray[0] + '_' + fieldIdArray[fieldIdArray.length - 1];   
			}
			
			popUpFieldIdWithIndex = getFieldIdWithIndex(fieldId, pageErrorInfos[i].index);
			if(pageErrorInfos[i].category == 'hard'){
				category = 'hard';
				if(pageErrorInfos[i].popUp == true){
					hardPopUp = true;
					if (hardPopUpMessage.length > 0){
						hardPopUpMessage = hardPopUpMessage + '</BR>';
					}
					strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
					strHardErrorMessage = formatErrorMsgForDisplay(pageErrorInfos[i].index, strHardErrorMessage, pageErrorInfos[i].messageCode);
					hardPopUpMessage = hardPopUpMessage + strHardErrorMessage;
					if (firstPopUpFieldID.length == 0){
						firstPopUpFieldID = popUpFieldIdWithIndex;
					}
				}
			}else if (pageErrorInfos[i].category == 'soft'){
				if(pageErrorInfos[i].popUp == true){
					softPopUp = true;
					if (softPopUpMessage.length > 0){
						softPopUpMessage = softPopUpMessage + '</BR>';
					}
					softPopUpMessage = softPopUpMessage +  modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
					// and add to hard popup in case the popup become hard overall
					if (hardPopUpMessage.length > 0){
						hardPopUpMessage = hardPopUpMessage + '</BR>';
					}
					strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
					strHardErrorMessage = formatErrorMsgForDisplay(pageErrorInfos[i].index, strHardErrorMessage, pageErrorInfos[i].messageCode);
					hardPopUpMessage = hardPopUpMessage + strHardErrorMessage;
					if (firstPopUpFieldID.length == 0){
						firstPopUpFieldID = popUpFieldIdWithIndex;
					}
				}
			}
		}
	}

		
	
	//Build Page Alerts and Flyout (for more than 1 error msg)
	if(showPageDetails == 'Yes'){
		var editsModalMsg = modelMultiAlertModalMsgPre;
		if (hardModalMsgs.length > 0){
			// hard alerts exist-> page alert is hard
			pageAlertMsg = pageAlertMsg.replace(/TYPEALERT/g,'hardAlert');
			//prepare hard part of modal window
			editsModalMsg = editsModalMsg + modelHardMultiAlertModalMsgPre;
			editsModalMsg = editsModalMsg + hardModalMsgs;		
			editsModalMsg = editsModalMsg + modelMultiAlertModalSectionPost;
		}else{
			// no hard alerts -> page alert is soft only 
			pageAlertMsg = pageAlertMsg.replace(/TYPEALERT/g,'softAlert');			
		}
		if (softModalMsgs.length > 0){
			//prepare soft part of modal window			
			editsModalMsg = editsModalMsg + modelSoftMultiAlertModalMsgPre;
			editsModalMsg = editsModalMsg + softModalMsgs;		
			editsModalMsg = editsModalMsg + modelMultiAlertModalSectionPost;
		}
		editsModalMsg = editsModalMsg + modelMultiAlertModalPost;
	}
	
	
	
	$('#' + pageAlertDivName).append(pageAlertMsg);
	
	//format page alert <div> wrapper
	//see if page has fixed header
	if (!isUmbrellaQuote() && !isHomeQuote()) {
	var thisTab = document.aiForm.currentTab.value;
	if (pageErrorInfos.length > 0){
		if (thisTab == DRIVERSTABNAME || thisTab == VEHICLESTABNAME || thisTab == COVERAGESTABNAME){
		//if($('.slidingFrame').length > 0){
			//multicolumn top right bottom left
			$('#' + pageAlertDivName).attr("style", "padding: 15px 0 10px 20px;");
			$('#' + mainContentDivName).attr("style", "margin-top: 143px;");
			if (thisTab == DRIVERSTABNAME){
				// additional style changes for drivers tab when displaying page alerts
				$('.driverPageHeader').attr("style", "margin-top: -43px;");
				$('.rowHeaderAndSlidingFrameParentDiv').attr("style", "margin-top: 25px;");
			}
		} else if (thisTab == CLIENTTABNAME || thisTab == ACCIDENTSVIOLATIONSTABNAME || thisTab == DETAILSTABNAME 
					|| thisTab == SUMMARYTABNAME) {
			$('#' + pageAlertDivName).attr("style", "padding: 20px 0 0px 20px; height: 50px;");
			$('#' + mainContentDivName).attr("style", "margin-top: 216px;");
		}  else if (thisTab == BINDTAB) {
			$('#' + pageAlertDivName).attr("style", "padding: 20px 0 0px 20px; height: 50px;");
			$('#' + mainContentDivName).attr("style", "margin-top: 216px !important;");
		} else{
			$('#' + pageAlertDivName).attr("style", "padding: 15px 0 0px 20px;");
			$('#' + mainContentDivName).attr("style", "margin-top: 186px;");
		}
	}
	} else {
		if (pageErrorInfos.length > 0){
			$('#' + pageAlertDivName).attr("style", "padding: 20px 0 0px 20px; height: 50px;");
			//$('#' + mainContentDivName).attr("style", "margin-top: 216px;");
			//$('#nextButton').attr("style", "margin-top: 40px;");
			if(isHomeQuote()){
				var homeTab = document.homeForm.currentTab.value;
				if(homeTab == 'homeRentersBind'){ 
					$('#' + mainContentDivName).attr("style", "margin-top: 200px !important;");
				} else if (homeTab == 'homeRentersQuote') {
					$('#' + mainContentDivName).attr("style", "margin-top: 210px !important;");
				}
			}else{
				$('#mainContentTable').attr("style", "margin-top: 80px;");
			}
		}
	}
	
	
	// allow room for page Alert
	$('#pageAlertMessage').show();

	if(showPageDetails == 'Yes'){
		$('#' + editsModalDivName).append(editsModalMsg);		
	}

	var popUpMessage = '';
	if(hardPopUp == true){
		popUpMessage = modelPopUpMsgPre + hardPopUpMessage + modelPopUpMsgPost; 
		popUpMessage = popUpMessage.replace(/LC-ERROR-WARNING/g, 'error');
		popUpMessage = popUpMessage.replace(/ERROR-WARNING/g, 'ERROR');
		popUpMessage = popUpMessage.replace(/HARDSOFT/g, 'hard');
		popUpMessage = popUpMessage + modelPopUpMsgFixNow.replace('FIXNOWFIELDID', firstPopUpFieldID);
		popUpMessage = popUpMessage + modelPopUpMsgLast;
	}else if(	(softPopUp == true) 
			/*&& 
				!(	
					(thisTab == DRIVERSTABNAME) && 
					($('#' + thisTab + '_tabErrorStatus').val() != 'conditionNotInitialized')
				 )*/
			){
		popUpMessage = modelPopUpMsgPre + hardPopUpMessage + modelPopUpMsgPost; 
		popUpMessage = popUpMessage.replace(/LC-ERROR-WARNING/g, 'warning');
		popUpMessage = popUpMessage.replace(/ERROR-WARNING/g, 'WARNING');
		popUpMessage = popUpMessage.replace(/HARDSOFT/g, 'soft');
		popUpMessage = popUpMessage + modelPopUpMsgFixNow.replace('FIXNOWFIELDID', firstPopUpFieldID);
		popUpMessage = popUpMessage + modelPopUpMsgFixLater;
		popUpMessage = popUpMessage + modelPopUpMsgLast;
	}
	var showErrorPopupAlert = $('#showErrorPopup').val();
	if (hardModalMsgs.length > 0 && softPopUp == true){
		// if hard errors exist -> do not show a soft popup
		showErrorPopupAlert = 'false';
	}
	if(popUpMessage.length > 0 && showErrorPopupAlert != 'false'){
		$('#' + jq(editsModalDivName)).append(popUpMessage);
		$("#popupModal").trigger(showErrorPopup);
	}
}



function showThirdPartyAlerts(thirdPartyInfoError){
	
	var pageErrorInfos = jQuery.parseJSON(thirdPartyInfoError); 
//	alert('pageErrorInfos = '+pageErrorInfos);
	var modelServiceFaailurePopUpMsgPre = '<div id="popupModal" class="alertModal modal draggable resizable" data-backdrop="static" tabindex="-1">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="resizePush">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="LC-ERROR-WARNINGModal">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="closeModal close" data-dismiss="modal">x</div>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="alertModalHeader dragHandle">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<b>ERROR-WARNING!</b>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '</div>';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<div class="LC-ERROR-WARNINGModalBody">';
	modelServiceFaailurePopUpMsgPre = modelServiceFaailurePopUpMsgPre + '<ul class="HARDSOFTErrorMsgList">';
	//Service error Pop Up Modal- End
	
	var modelPopUpMsgRow = '<li class="errorMsg">POPUPMSG</li>';
	
	var modelPopUpMsgPost = '</ul>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '</div>';
	modelPopUpMsgPost = modelPopUpMsgPost + '<div class="modal-footer dragHandle">';
	
	var modelPopUpMsgLast = '';

	var mvrDownMessageFlag = false;
	if($('#mvrErrorCd').val() != null && $('#mvrErrorCd').val()!='' && $('#mvrErrorDesc').val()!=null && $('#mvrErrorDesc').val()!=""){
		mvrDownMessageFlag = true;
	}
	
	if(mvrDownMessageFlag){
		modelPopUpMsgLast = modelPopUpMsgLast + '<button class="aiBtn primaryBtn closeModal fixDriverLic" type="button" onclick="return false;">Fix Now</button>';
		modelPopUpMsgLast = modelPopUpMsgLast + '&nbsp;&nbsp;<button class="aiBtn secondaryBtn closeModal" type="button" onclick="return false;">Fix Later</button>';
	}else if($('#clueDown').val() || $('#mvrDown').val()){		
		modelPopUpMsgLast = modelPopUpMsgLast + '<button class="aiBtn primaryBtn closeModal" type="button" onclick="return false;">OK</button>';
	}
	modelPopUpMsgLast = modelPopUpMsgLast + '<a href="#" class="closeModal" data-dismiss="modal">Close</a>';
	modelPopUpMsgLast = modelPopUpMsgLast + '</div>';
	modelPopUpMsgLast = modelPopUpMsgLast + '</div>'; 
	
	var fieldId = '';
	var fieldIdWithIndex = '';
	var popUpFieldId = '';
	var hardPopUp= false;
	var softPopUp= false;
	var popUpFieldIdWithIndex = '';
	var firstPopUpFieldID = '';
	var hardPopUpMessage = '';
	var softPopUpMessage = '';
	var strErrorRow = '';
	var messageMap = jQuery.parseJSON($("#errorMessages").val());
	var fieldIdMap = jQuery.parseJSON($("#errorFields").val());

	for (var i = 0; i < pageErrorInfos.length; i++){
		var strHardErrorMessage;
		popUpFieldId = getFieldIdWithMap (pageErrorInfos[i].fieldID, fieldIdMap);
		popUpFieldIdWithIndex = getFieldIdWithIndex(fieldId, pageErrorInfos[i].index);
			//category = 'hard';
			if(pageErrorInfos[i].category == 'hard'){
			if(pageErrorInfos[i].popUp == true){
				hardPopUp = true;
				if (hardPopUpMessage.length > 0){
					hardPopUpMessage = hardPopUpMessage + '</BR>';
				}
				strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
				strHardErrorMessage = formatErrorMsgForDisplay(pageErrorInfos[i].index, strHardErrorMessage, pageErrorInfos[i].messageCode);
				hardPopUpMessage = hardPopUpMessage + strHardErrorMessage;
				if (firstPopUpFieldID.length == 0){
					firstPopUpFieldID = popUpFieldIdWithIndex;
				}
			}
			}
		else if (pageErrorInfos[i].category == 'soft'){
			if(pageErrorInfos[i].popUp == true){
				softPopUp = true;
				if (softPopUpMessage.length > 0){
					softPopUpMessage = softPopUpMessage + '</BR>';
				}
				//softPopUpMessage = softPopUpMessage +  modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
				// and add to hard popup in case the popup become hard overall
				if (hardPopUpMessage.length > 0){
					hardPopUpMessage = hardPopUpMessage + '</BR>';
				}
				if(mvrDownMessageFlag){
					if(isEndorsement()){
						var errorDesc = ($('#mvrErrorDesc').val().split('%%%'))[0];
						if($('#mvrErrorCd').val().toLowerCase()=='vendor_down'){
							errorDesc = '';
						}						
						strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG','One or more drivers may have incorrect information. ' + ((errorDesc != null && $.trim(errorDesc) != 'null') ? errorDesc : ''));						
					} else{
						strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG','Driver #' + ($('#mvrErrorDesc').val().split('%%%'))[1] + ' has incorrect information. ' + ($('#mvrErrorDesc').val().split('%%%'))[0] + '.');	
					}
				} else{
					strHardErrorMessage = modelPopUpMsgRow.replace('POPUPMSG', getMessageWithMap (popUpFieldId + '.server.popUp.' + pageErrorInfos[i].messageCode, messageMap, pageErrorInfos[i].replaceContentMap));
				}
				strHardErrorMessage = formatErrorMsgForDisplay(pageErrorInfos[i].index, strHardErrorMessage, pageErrorInfos[i].messageCode);
				softPopUpMessage = softPopUpMessage + strHardErrorMessage;
				if (firstPopUpFieldID.length == 0){
					firstPopUpFieldID = popUpFieldIdWithIndex;
				}
			}
		}
}
	

	var popUpMessage = '';
	if(hardPopUp == true){
			popUpMessage = modelServiceFaailurePopUpMsgPre + hardPopUpMessage + modelPopUpMsgPost; 
			popUpMessage = popUpMessage.replace(/LC-ERROR-WARNING/g, 'error');
			popUpMessage = popUpMessage.replace(/ERROR-WARNING/g, 'ERROR');
			popUpMessage = popUpMessage.replace(/HARDSOFT/g, 'hard');
			popUpMessage = popUpMessage + modelPopUpMsgLast;
	}else if(softPopUp == true){
			popUpMessage = modelServiceFaailurePopUpMsgPre + softPopUpMessage + modelPopUpMsgPost; 
			popUpMessage = popUpMessage.replace(/LC-ERROR-WARNING/g, 'warning');
			if(mvrDownMessageFlag){
				popUpMessage = popUpMessage.replace(/ERROR-WARNING/g, 'WARNING - ' + 'Order unsuccessful due to '
													+ $('#mvrErrorCd').val().replaceAll('_',' '));
			} else{
				popUpMessage = popUpMessage.replace(/ERROR-WARNING/g, 'WARNING');
			}
			popUpMessage = popUpMessage.replace(/HARDSOFT/g, 'soft');
			popUpMessage = popUpMessage + modelPopUpMsgLast;
	}
	
	//alert('popUpMessage length = '+popUpMessage.length);
	if(popUpMessage.length > 0 ){
		$('#' + jq(editsModalDivName)).append(popUpMessage);
		$("#popupModal").trigger(showErrorPopup);
	}
}

/*function setFocus(fieldId){
	
	if (document.getElementById(fieldId + "SelectBoxItContainer")){
		//it selectboxit exisits -> set focus on it	
		$("span#" + fieldId + "SelectBoxIt").focus();
	} else{
		//set focus on regular id
		if(document.getElementById(fieldId)){
			document.getElementById(fieldId).focus();
		}
	}
 
}*/
//TD#71488 clicking on selection button causin prefill tab to jump to top
function setFocus(fieldId, tabName) {
	// window.scrollTo(0,0); 
	
	 var hiddenOffset = 400;
	 var elementFocusOffsetTop ;
		
	 var element = $('#'+ fieldId);
	 
	 $('.chosen-container-active').each(function ()  {
		$(this).removeClass("chosen-container-active");
	 });
	 
	 if(element.is('select:not(select[multiple])')){		
		 $('#'+ fieldId +'_chosen').addClass("chosen-container-active");
		 element.trigger("chosen:activate");
		 $('#'+ fieldId +'_chosen a').focus(); // Focus the anchor element | We focus to the a element now after tabbing changes
		 elementFocusOffsetTop = $('#'+ fieldId +'_chosen').offset().top;
	 } else {
		 // regular input fields.
		 if(document.getElementById(fieldId)){
			 element.focus();
			 elementFocusOffsetTop = $('#'+ fieldId).offset().top;
		 }
	 }
	 
	 //console.log("elementFocusOffsetTop:"+elementFocusOffsetTop);
	 //console.log("Net Offset for Element receiveing Focus :"+(elementFocusOffsetTop-hiddenOffset));
	 
	 if(elementFocusOffsetTop != undefined && tabName==undefined ) {
		 $(window).scrollTop(elementFocusOffsetTop-hiddenOffset);
	 }
	 
}

function closeSetFocus(fieldId){
	//$('#popupModal').modal('hide');
	
	if (!isUmbrellaQuote() && !isHomeQuote())  {
	var thisTab = document.aiForm.currentTab.value;
	if (thisTab == DRIVERSTABNAME ){
		slideToShowError(fieldId, "#firstDriver", "#driverCount", DRIVERS_PER_PAGE, "#leftScrollBtn", "#rightScrollBtn");		
	}else if( thisTab == VEHICLESTABNAME) {
		slideToShowError(fieldId, "#firstVehicle", "#vehicleCount", VEHICLES_PER_PAGE, "#leftVehicleScrollBtn", "#rightVehicleScrollBtn");		
	}else if (thisTab == COVERAGESTABNAME){
		slideToShowError(fieldId, "#firstCoverage", "#coverageCount", COVERAGES_PER_PAGE, "#leftScrollBtn", "#rightScrollBtn");
	}	
	}
	setFocus(fieldId);
}

function slideToShowError(fieldId, firstColumnSel, columnCountSel, perPage, leftButtonSel, rightButtonSel){
	
	var intNumCol = fieldIdToCol(fieldId);
	var firstColumn = parseInt($(firstColumnSel).val());
	var columnCount = parseInt($(columnCountSel).val());
	var lastColumn = Math.min(columnCount, (firstColumn + (perPage - 1)));
	// check to see which way to scroll
	if (intNumCol < firstColumn){
		do {
			$(leftButtonSel).trigger("click");
			firstColumn = parseInt($(firstColumnSel).val());
		} while (intNumCol < firstColumn)
	
	}else if(intNumCol > lastColumn){
		do {
			$(rightButtonSel).trigger("click");
			firstColumn = parseInt($(firstColumnSel).val());
			lastColumn = Math.min(columnCount, (firstColumn + (perPage - 1)));
		} while (intNumCol > lastColumn)

	}else{
		//column already showing
	}

	return;
}

function fieldIdToCol(fieldId){
	
	var intStart = parseInt(fieldId.lastIndexOf("_")) + 1;
	var intEnd = fieldId.length - 1;
	var intNumCol = fieldId.substr(intStart, intEnd);
	intNumCol = parseInt(intNumCol) + 1;
	
	return intNumCol;
}

function fixLater() {
	
	document.aiForm.forcePersist.value = 'true';
	nextTab(document.aiForm.currentTab.value, document.aiForm.nextTab.value);
}
/*
function fixLaterForRating() {
	nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
}

function fixNowForRating(tabWithErrors){
	//If user is already on the tab with erros, do not load the page again
	if(tabWithErrors==document.aiForm.currentTab.value){
		return;
	}
	nextTab(document.aiForm.currentTab.value, tabWithErrors);
}
*/

//preddy - Validation framework updated 07/25
//1) Page and inline errors will be shown on page load even the first time. Previously these errors used to show only when user clicked on FIX NOW or FIX LATER
//2) Clicking FIX LATER no longer needs to load the page
//3) Clicking FIX NOW will take user to the page with error. If user is already on the page, page load doesn;t occur again
function fixErrorsNow(){
	//If user is already on the tab with erros, do not load the page again
	var tabWithErrors = $('#tabWithErrors').val();
	if(tabWithErrors=='' || tabWithErrors==null || tabWithErrors==document.aiForm.currentTab.value){
		return;
	}
	nextTab(document.aiForm.currentTab.value, tabWithErrors);
}

function getFieldIdWithIndex (fieldId, pageIndex){
	
	var fieldIdWithIndex = fieldId;
	if (fieldIdWithIndex.length > 0){

		if (pageIndex == null || pageIndex < 0){
//		if (pageIndex == null || pageIndex == '' || parseInt(pageIndex) < 0){
		}else{
			// means columns of data, append column indicator
			var intColumn = pageIndex;
			strSuffex = '_' + intColumn.toString();
			fieldIdWithIndex = fieldIdWithIndex + strSuffex;
		}
	}
	
	return fieldIdWithIndex;
	
}

function addClassHidden(strSelector){
	
	$(strSelector).addClass('hidden');
	
}
function removeClassHidden(strSelector){
	
	$(strSelector).removeClass('hidden');
	
}

//function removePageAlert(fieldId){
 
//	$('#' + jq(fieldId + '_error')).remove();	
//	var intNumberOfErrors = addSequenceNumbers();
//}


//function removeAllPageAlerts(fieldId){	 
//	$('.pageAlertSequence').remove();	
//}

//function addSequenceNumbers(){
//	var rowNum = 0;
//	$('.pageAlertSequence').each(function(){
//		rowNum++;
//		this.textContent = rowNum + '.';
//	});
//	setPageAlertHeight(rowNum);
//}

function setErrorFocus(fieldId){
	
	$('#' + jq(fieldId)).focus();
	
}

function jq(myid) {
	var strWork;
    
	strWork =  myid.replace(/(:|\.)/g,'\\$1');
    return strWork;
}


function getPopUpMessage(strFieldId, strCategory){
	
	return strCategory + ' PopUpMessage for:' +  strFieldId;
	
}
//END functions called to manage the Page alerts

function recordLastInput(validatingInput, field) {
	$('#' + jq(field)).val(validatingInput.id);
}

function clearLastInput(field){
	$('#' + jq(field)).val("");	
}

var blnTriggerEdits = true;
function validateLastInput(field) {

	//if (blnTriggerEdits){
		var strFieldValue = $('#' + jq(field)).val();
		if (strFieldValue != null && strFieldValue != '') {
			var result = '';
			$('#' + jq(strFieldValue)).trigger(getValidationEvent(), result);
		}
		//clear last input
		clearLastInput('lastInputLeft');
	//}
}

function validateLastInputIfNotThis(field, thisOne){

	//if (blnTriggerEdits){
		var strFieldValue = $('#' + jq(field)).val();
		if (strFieldValue != thisOne.id){
			if (strFieldValue != null && strFieldValue != '') {
				var result = '';
				$('#' + jq(strFieldValue)).trigger(getValidationEvent(), result);
			}
		}
		//clear last input
		clearLastInput('lastInputLeft');
	//}
}

/*
function clearInLineErrorMsgs(strElementID, strClassName){
	//1. Remove error line with this strElementID as a prefix
	//2. remove the inlineError class
	//
	//clearInLineError('emailAddress');		
		
	var strErrorID = strElementID;
	if (strClassName != null && strClassName != '') {
		strErrorID = strClassName;
	}
	
	// Determine the number of errors on this row in all tables on the page
	var iErrorCount = 0;
	$('.' + jq(strErrorID + '_ErrorText')).each(function(){
		var strText = $.trim($(this).text());
		// See if this column currently has an error
		if (strText != null && strText.length) {
			// See if this column contains the field that's being cleared
			var table = $(this).parent().parent().parent();
			var columnElement = $('#' + strElementID, $(table));
			if (columnElement == null || columnElement.length == 0) {
				// If not. this row has another error
				iErrorCount++;
			} else {
				// If so, clear the old error
				$(this).text('\xA0');				
				// Remove the border color for this element
				$(columnElement).removeClass('inlineError');
			}
		}
	});
	
	// If there were no errors on this row, remove the entire row in all tables
	if (iErrorCount == 0) {
		$('.' + jq(strErrorID + '_Error')).each(function(){
			$(this).remove();
		});
	}		
}
*/

function showClearInLineErrorMsgs(strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
			columnIndex, errorMessageJSON, null);
}

function showClearInLineErrorMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
		columnIndex, messageMap, addDeleteCallback, replaceContentMap){
	
	if (columnIndex == null || columnIndex < 0){
		showClearInLineErrorRowMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
				messageMap, addDeleteCallback, replaceContentMap);
	}else{
		showClearInLineColumnErrorMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
				columnIndex, messageMap, addDeleteCallback, replaceContentMap);	
	}
}

function showClearInLineErrorRowMsgs(strElementID, strErrorMsgID, strErrorRow){
	showClearInLineErrorRowMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
			errorMessageJSON, null, "");
}

function showClearInLineErrorRowMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
		messageMap, addDeleteCallback, replaceContentMap){
	
	// This function will insert a message in a <TR> below the <TD> that has the problem.
	// and set the error class for strElementID
	
	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	
	//sample calling code
	//
	//
	var strErrorMsg = '';
	if (typeof(strErrorRow) != "undefined" && strErrorRow.length == 0){
		// if no error row return
		return;
	}
	
	//failsafe sometimes the strErrorRow is null
	if(typeof(strErrorRow) == 'undefined'){
		strErrorRow ="<tr id=\"sampleErrorRow\" class=\"errorRow fieldRowError\"><td class=\"fieldColError fieldCol\" id=\"Error_Col\"></td></tr>" ;
	}
	// TJMcD - moved this here for use in the clear call
	//name of row
	var strRowName = strElementID;

	if (strErrorMsgID.length == 0){
		//clear this message
		//if this is the last error message -> remove error row
		clearInLineRowError(strElementID, strRowName, strErrorRow, '', -1, addDeleteCallback);
		return;
	}
	
	//get the error message to be displayed
	if (strErrorMsgID == "adressSelected.browser.inLine.InvalidFullAddress" || strErrorMsgID == "pri_priorAdd.browser.inLine.invalid" ) {
		strErrorMsg = "Please have commas only after the street and  after the city.<img id=\"addressFormatMsg\" alt=\"help_Icon\" src=\"/aiui/resources/images/helpIconHome.png\">";
	}
	else {
	strErrorMsg = getMessageWithMap(strErrorMsgID, messageMap, replaceContentMap);
	}
	//strErrorMsg = getMessageWithMap(strErrorMsgID, messageMap, replaceContentMap);
	if(strErrorMsg == strErrorMsgID){
		// if no error message -> show default
		strErrorMsg = strStandardInLineMsg;
	}
	
	/** TJMcD - moved this above for use in the clear call
	//name of row
	var strRowName = strElementID;
	**/
	
//	if ($('#' + strElementID + 'SelectBoxItContainer').length){
		// append SelectBoxItContainer
//		strElementID = strElementID + 'SelectBoxItContainer';
//	}
	processErrorRow(strElementID, strErrorRow, -1, strRowName, strErrorMsg, addDeleteCallback);
}

/*function clearInLineRowError(strElementID, strRowName, strErrorRow,
		strColumnId, columnIndex, addDeleteCallback){

	//name of row
	var errorRow = null;
	var strErrorColId = '';
	
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		//strElementID = strErrorColId;  
		
	}
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	//see if error row already exists
	if (errorRow == null || errorRow.length == 0 ) {
		//no error row, nothing to remove, so just return
		return ;
	}
	
	// remove red outline around existing col
	$('#' + strElementID).removeClass('inlineError');
	// also check for selectBoxIt naming convention and remove red outline
	$('#' + strElementID + 'SelectBoxIt').removeClass('inlineError');
	if($.type(columnIndex) === "number"){	
	var removeRow = columnIndex < 0;
	if (! removeRow) {
		$('#' + strColumnId).empty();
		//note:do not change below condition to keep empty error row.
		removeRow = $('.errorCol:not(:empty)', errorRow).length == 0;
	}
	
	if (removeRow) {
		// invoke the callback if one is specified
		// Invoke BEFORE the row is removed, so that it can be referred to in context
		if (addDeleteCallback != null) {
			addDeleteCallback(errorRow, false);
		}

		// remove error row
		errorRow.remove();
	}
	}
	if($.type(columnIndex) === "string")
	{
		var removeRow = parseErrorRow(strRowName,strErrorColId);
		if(removeRow){
			errorRow.remove();
		}
		else{
				$('#' + strErrorColId).text('');
			}
	}
}*/

//Replaced the above method after migration.
function clearInLineRowError(strElementID, strRowName, strErrorRow,
		strColumnId, columnIndex, addDeleteCallback){

	//name of row
	var errorRow = null;
	var strErrorColId = '';
	
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		//strElementID = strErrorColId;  
		
	}
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	//see if error row already exists
	if (errorRow == null || errorRow.length == 0 ) {
		//no error row, nothing to remove, so just return
		return ;
	}
	
	// remove red outline around existing col
	$('#' + strElementID).removeClass('inlineError');
	// also check for selectBoxIt naming convention and remove red outline
	//$('#' + strElementID + 'SelectBoxIt').removeClass('inlineError');
	//Remove the chosen container error red outline
	$('#' + strElementID+'_chosen a').removeClass('inlineError');
	if($('#ddcl-' + strElementID).length>0){
		$('#ddcl-' + strElementID).removeClass('inlineError');
	}
	
	if($.type(columnIndex) === "number"){	
	var removeRow = columnIndex < 0;
	var removeErrorSpan = false;
	
	if (! removeRow) {
		//FIXME: this empty() is removing the error row.
		$('#' + strColumnId).empty();
		//note:do not change below condition to keep empty error row.
		removeRow = $('.errorCol:not(:empty)', errorRow).length == 0;
		//above condition is not holding good.. revisit.
		removeErrorSpan = ($('.errorCol:not(:empty)', errorRow).length - $('.errorCol', errorRow).find('span').length) == 0;
	}
	
	if (removeRow || removeErrorSpan) {
		// invoke the callback if one is specified
		// Invoke BEFORE the row is removed, so that it can be referred to in context
		if (addDeleteCallback != null) {
			addDeleteCallback(errorRow, false);
		}

		// remove error row
		errorRow.remove();
	  }
	}
	if($.type(columnIndex) === "string")
	{
		var removeRow = parseErrorRow(strRowName,strErrorColId);
		if(removeRow){
			errorRow.remove();
		}
		else{
				$('#' + strErrorColId).text('');
			}
	}
	
	//TODO: When the errors are cleared completely for the Entire row, then we have remove the remove the extra <tr> created under
	//the row label. This will allow the row header label to align with with row inputs.
	
}

function showClearInLineColumnErrorMsgs(strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineColumnErrorMsgsWithMap(strElementID, strErrorMsgID, strErrorRow,
			columnIndex, errorMessageJSON, null);
}

function showClearInLineColumnErrorMsgsWithMap(strElementID, strErrorMsgID,
		strErrorRow, columnIndex, messageMap, addDeleteCallback, replaceContentMap){
	// This function will insert a message in a <TR> below the <TD> that has the problem.
	// and set the error class for strElementID
	
	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	
	//sample calling code
	//
	//
	
	var strErrorMsg = '';
	
	if (strErrorRow == null){
		// if no error row return
		return;
	}
	if (strErrorRow.length == 0){
		// if no error row return
		return;
	}
	
	// TJMcD - moved this here for use in the clear call
	//name of row without index, remove _ and suffix
	var strRowName = strElementID.replace("_" + columnIndex.toString(), "");
	//name of col in error row to get error msg
	var strErrorColId = strRowName + '_Error_Col_' + columnIndex;

	if (strErrorMsgID.length == 0){
		//clear this message
		//if this is the last error message -> remove error row
		var stateCd;
		if (!isUmbrellaQuote()) {
		stateCd = $('#stateCd').val();
		} else {
			if(isUmbrellaQuote()){
				stateCd = $('#policyInfoStateCd').val();
			}else{
				stateCd = $('#homeStateCd').val();
			}
		}
		//dont clear error row for vehicle lookup button for MA -53688
		//PA_AUTO - added PA state
		if(stateCd == 'PA' || stateCd == 'NJ' || stateCd == 'NH' || stateCd == 'CT' || (stateCd=='MA' && strElementID.indexOf('vehicleLookup') == -1)){
			clearInLineRowError(strElementID, strRowName, strErrorRow,
					strErrorColId, columnIndex, addDeleteCallback);
		}
		return;
	}
	
	//get the error message to be displayed
	strErrorMsg = getMessageWithMap(strErrorMsgID, messageMap, replaceContentMap);
	strErrorMsg = formatErrorMsgForDisplay(columnIndex, strErrorMsg, strErrorMsgID);
	if(strErrorMsg == strErrorMsgID){
		// if no error message -> use generic
		strErrorMsg = strStandardInLineMsg;
	}
		
//	if ($('#' + strElementID + 'SelectBoxItContainer').length){
		// append SelectBoxItContainer
//		strElementID = strElementID + 'SelectBoxItContainer';
//	}
	
	/** TJMcD - moved this above for use in the clear call
	//name of row without index, remove _ and suffix
	var strRowName = strElementID.replace("_" + columnIndex.toString(), "");
	**/
	
	processErrorRow(strElementID, strErrorRow, columnIndex, strRowName, strErrorMsg, addDeleteCallback);
}

function clearInLineColumnError(strElementID, strErrorRow, columnIndex){
	
	//name of row without index, remove _ and suffix
	var strRowName = strElementID.replace("_" + columnIndex.toString(), "");
	var errorRow = null;
	var strText = '';
	
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	//see if error row already exists
	if (errorRow == null || errorRow.length == 0 ) {
		//no error row, nothing to remove, so just return
		return ;
	}
	//name of col in error row to get error msg
	var strErrorColSelector = strRowName + '_Error_Col_' + columnIndex;
	// clear error message from this column
	$('#' + strErrorColSelector).empty();
	// remove red outline
	$('#' + strElementID).removeClass('inlineError');
	// check to see if any other columns have errors
	var strAllErrorColSelector = strRowName + '_Error_Col_';
	$('td[id^="' + strAllErrorColSelector + '"]').each(function(){
		strText = $.trim(this.innerHTML);
		strText = strText.replace ("\n", "");
		if(strText.length > 0){
			//something present -> leave column
			return false;
		}
	});
	if (strText.length == 0){
		// nothing present -> remove entire row
		errorRow.remove();
	}
	
}

/*function processErrorRow(strElementID, strErrorRow, columnIndex, strRowName, strErrorMsg, addDeleteCallback) {
	
	//alert('process error row strErrorRow ='+strErrorRow+'columIndex ='+columnIndex+'strRowName='+strRowName+'strElementID='+strElementID);
	var strErrorColId = strRowName + '_Error_Col';
	//if ($.type(columnIndex) == "number" && columnIndex >= 0) {
	//	strErrorColId += '_' + columnIndex;
	//}
	
	var isApp = false;
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		isApp=true;
	}else{
		if($.type(columnIndex) === "number" && columnIndex==-1){}
		else{
				strErrorColId += '_' + columnIndex;
		}
		
	}
	$('#' + jq(strElementID)).each(function(){
		//point to the TR containing the TD with error data	
		var dataRow = $(this).parents("tr").first();
		//see if error row already exists

		var addErrorRow = $('#' + strRowName  + '_Error').length == 0;
		if (addErrorRow) {
			//Error row does not exist, so insert it
			// make a unique id
			var strTempErrorRow = strErrorRow;			
			strErrorRow = strErrorRow.replace(/id="([^"]*)"/, 'id="' + strRowName + '_Error"');
			if (strTempErrorRow == strErrorRow){
				//replace failed look for an id without "s aroubnd it
				strErrorRow = strErrorRow.replace(/id=([^ ]*) /, 'id="' + strRowName + '_Error" ');
			}
	
			//Global replace of generic Ids with specific Ids
			
			if(isApp)
			{
				strErrorRow = processAppRows(strErrorRow,strElementID,strRowName);
			}
			else{
				strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
			}
			$(strErrorRow).removeClass('hidden').insertAfter(dataRow);  //msg below
			
		}
		// add error message to td in error row		
		$('#' + strErrorColId)
			.empty()
			.append(strErrorMsg)
			.addClass('inlineErrorMsg');
		// put red outline around existing col
		$('#' + strElementID).addClass('inlineError');
		
		// refresh it if it is selectbox
		if ($('#' + strElementID).is('select:not(select[multiple])')) {
			$('#' + strElementID).trigger("changeSelectBoxIt");
		}
		
		// invoke the callback if one is specified
		// Do this AFTER the text is set so the error row height is correct
		if (addErrorRow && addDeleteCallback != null) {
			addDeleteCallback(dataRow.next(), true);
		}
	});
}*/

//Replaced the above processErrorRow method after migration.
function processErrorRow(strElementID, strErrorRow, columnIndex, strRowName, strErrorMsg, addDeleteCallback) {
	
	//alert('process error row strErrorRow ='+strErrorRow+'columIndex ='+columnIndex+'strRowName='+strRowName+'strElementID='+strElementID);
	var strErrorColId = strRowName + '_Error_Col';
	//if ($.type(columnIndex) == "number" && columnIndex >= 0) {
	//	strErrorColId += '_' + columnIndex;
	//}
	
	var isApp = false;
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		isApp=true;
	}else{
		if($.type(columnIndex) === "number" && columnIndex==-1){}
		else{
				strErrorColId += '_' + columnIndex;
		}
		
	}
	$('#' + jq(strElementID)).each(function(){
		//point to the TR containing the TD with error data	
		var dataRow = $(this).parents("tr").first();
		//see if error row already exists

		var addErrorRow = $('#' + strRowName  + '_Error').length == 0;
		if (addErrorRow) {
			//Error row does not exist, so insert it
			// make a unique id
			var strTempErrorRow = strErrorRow;			
			strErrorRow = strErrorRow.replace(/id="([^"]*)"/, 'id="' + strRowName + '_Error"');
			if (strTempErrorRow == strErrorRow){
				//replace failed look for an id without "s aroubnd it
				strErrorRow = strErrorRow.replace(/id=([^ ]*) /, 'id="' + strRowName + '_Error" ');
			}
	
			//Global replace of generic Ids with specific Ids
			
			if(isApp)
			{
				strErrorRow = processAppRows(strErrorRow,strElementID,strRowName);
			}
			else{
				strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
			}
			var garagingAddressTableError = false;
			if(isApplicationOrEndorsement()){
				var errorRowId = $(strErrorRow).attr('id');
				if(errorRowId.indexOf("garaging") != -1){
					garagingAddressTableError = true;
					var $parentRow = null;
					if(errorRowId.match("^garagingAddressData_")){
						$parentRow = dataRow;
					}else{
						$parentRow = $(dataRow).closest('table').parent().parent();
					}
					$(strErrorRow).removeClass('hidden').insertAfter($parentRow); 
				}
			}
			if(!garagingAddressTableError){
				$(strErrorRow).removeClass('hidden').insertAfter(dataRow);  //msg below
			}
			
		}

		// add error message to td in error row		
		$('#' + strErrorColId)
			.empty()
			.append(strErrorMsg)
			.addClass('inlineErrorMsg');
		// put red outline around existing col
		$('#' + strElementID).addClass('inlineError');
		
		if ($('#' + strElementID).is('select:not(select[multiple])')) {
			// make sure yellow fill is gone for dropdowns
			$('#' + strElementID).addClass('inlineError').removeClass('preRequired').trigger('chosen:styleUpdated');
		}
		
		//By this time the chosen dropdown is not created yet. hence create it ?
		//Just apply class to the element and it is taken care when the page loads and chosen is applied.
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
			
		//	$('#' + strElementID+'_chosen a').addClass('inlineError');
		//}
		
		// refresh it if it is selectbox
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
		//	$('#' + strElementID).trigger("changeSelectBoxIt");
		//}
				
		// invoke the callback if one is specified
		// Do this AFTER the text is set so the error row height is correct
		if (addErrorRow && addDeleteCallback != null) {
			addDeleteCallback(dataRow.next(), true);
		}
	});
}

function getErrorRow(pageErrorInfoItem){
	return getErrorRowWithMap(pageErrorInfoItem, fieldIdToModelErrorRow);
}

function getErrorRowWithMap(pageErrorInfoItem, errorRowMap){
	var strWork = "";
	strWork = errorRowMap[pageErrorInfoItem.fieldID];
	 
	if (strWork == null || strWork.length == 0 || strWork ==undefined){
		strWork = errorRowMap[getPreFix(pageErrorInfoItem.fieldID)];
		if (strWork == null || strWork.length == 0 || strWork ==undefined){
			if(pageErrorInfoItem.index == -1){
				if(pageErrorInfoItem.fieldID.indexOf("primary_insured")!=-1 || pageErrorInfoItem.fieldID.indexOf("secondary_insured")!=-1)
				{
					strWork = errorRowMap.applicants;
				}
				else if(pageErrorInfoItem.fieldID.indexOf("zip")!=-1 || pageErrorInfoItem.fieldID.indexOf("cityName")!=-1 || pageErrorInfoItem.fieldID.indexOf("mailingCityName")!=-1
						|| pageErrorInfoItem.fieldID.indexOf("mailingZip")!=-1)
				{
					strWork = errorRowMap.zipZip4;
				} else if(pageErrorInfoItem.fieldID.indexOf("ResidenceType")!=-1 || pageErrorInfoItem.fieldID.indexOf("PropertyType")!=-1)
				{
					strWork = errorRowMap.residenceType;
				}
				else
				{
					strWork = errorRowMap.defaultSingle;
				}
			}else{
				strWork = errorRowMap.defaultMulti;
			}
		}
	}
	
	return strWork;
}

function getPreFix(strName){
	var strWork;
	var intIndex = strName.indexOf('.');
	if (intIndex > 0){
		strWork = strName.substring(0, intIndex);
	}
	return strWork;
}

/** tjmcd - Is this still needed ?
function getErrorFieldId(strErrorMsgID, strFieldId){
	
	var messages = jQuery.parseJSON(strMessages);
	
	// if no match is found, just return the original ID
	if (messages == null || messages.length == 0) {
		return strErrorMsgID;
	} else {
		var message = messages[strFieldId];
		
		// if no match is found, just return the original ID
		if (message == null || message.length == 0) {
			message = strErrorMsgID;
		}
		
		return message;
	}
}
**/

//validation functions
function validateNameInColumn(name, strRequired, strErrorTag, strErrorRow, index){
	validateNameInColumnWithMap(name, strRequired, strErrorTag, strErrorRow,
			index, errorMessageJSON, null);
}

function validateNameInColumnWithMap(name, strRequired, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback){
	var errorMessage = '';
	
	errorMessageID = isName($(name).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(name.id, errorMessageID, strErrorRow, index,
			messageMap, addDeleteCallback);
	
}

function validateName(name, strRequired, strErrorTag, strErrorRow, index) {
	validateNameWithMap(name, strRequired, strErrorTag, strErrorRow,
			index, errorMessageJSON, null);
}

function validateNameWithMap(name, strRequired, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	errorMessageID = isName($(name).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(name.id, errorMessageID, strErrorRow,
			index, nessageMap, addDeleteCallback);
}

function validateSSN(ssn, strRequired, strErrorTag, strErrorRow, index) {
	validateSSNWithMap(ssn, strRequired, strErrorTag, strErrorRow,
			index, errorMessageJSON, null);
}

function validateSSNWithMap(ssn, strRequired, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	errorMessageID = isSSN($(ssn).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgs(name.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
}

function validateDate(date, strRequired, strErrorTag, strErrorRow, index) {
	validateDateWithMap(date, strRequired, strErrorTag, strErrorRow,
			index, errorMessageJSON, null);
}

function validateDateWithMap(date, strRequired, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	errorMessageID = isDate($(date).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(name.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
}

function validateYear(year, strRequired, strErrorTag, strErrorRow, index) {
	validateYearWithMap(year, strRequired, strErrorTag, strErrorRow,
			columnIndex, errorMessageJSON, null);
}

function validateYearWithMap(year, strRequired, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	var errorMessageID = isYear($(year).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(year.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);

}

function validateMakeOrModelWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	var errorMessageID = '';
	if (isEmpty($(field).val())){
		errorMessageID = strErrorTag + '.required';
	}else{
		errorMessageID = '';
	}
	
	var strElement = field.id;
	if(field.id.indexOf("dd_") == 0 || field.id.indexOf("ff_") == 0) {
		//removed comment for vehicleTab - if it is not dd_model_error_col_4 or ff_model then the error will be just model_error_col 
		strElement = field.id.substring(3,field.id.length);
	}
	showClearInLineErrorMsgsWithMap(strElement, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
	
	if(isEndorsement()){
		showRemoveErrorMakeModel(strElement, field.id);
	}
}


function validateRequiredWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	var errorMessageID = '';
	if (isEmpty($(field).val())){
		errorMessageID = strErrorTag + '.required';
	}else{
		errorMessageID = '';
	}
	
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);

}

//Fix for defect 40740 - Vehicles Application - VIN edits incorrect for misc vehicles ï¿½ FOCUS
function validateRequiredVINWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback, typeVal,old) {
	
	var errorMessageID = '';
	if (isEmpty($(field).val())){
		
		if(isQuote()) {
			errorMessageID = strErrorTag + '.required';
		}
		
		if(isApplication()) {
			errorMessageID = strErrorTag + '.appVinRequired';	
		}
		
		if(!isQuote()){
			if(typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD || typeVal == ANTIQUE_CD){
				if(old){
					errorMessageID = strErrorTag + '.appRequires17EndOld';
				}else{
					errorMessageID = strErrorTag + '.appRequires17End';	
				}
			} else if(isEndorsement() && !isQuote() && (typeVal == TRAILER_W_LIVING_FAC_CD || typeVal == UTILITY_TRAILERS_CD || typeVal == TRAILER_CAPS_CD) ) {
				errorMessageID = strErrorTag + '.appRequires17EndOld';
			} else {
				errorMessageID = strErrorTag + '.appVinRequired';
			}
		}
		
	} else {
		if ($(field).val().length < 10 && isQuote()) {
			errorMessageID = strErrorTag + '.required';
		} 
		else if ($(field).val().length < 17 && !isQuote() && (typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD || typeVal == ANTIQUE_CD)) {
			errorMessageID = strErrorTag + '.appRequires17End';
		} 
		else {
			if($(field).val().length == 17){
				var last7digit = $(field).val().substring(11,$(field).val().length);
				if(/^(.)\1+$/.test(last7digit) && isApplication()){
					errorMessageID = strErrorTag + '.appRequires17';
					
				}else{
					errorMessageID = '';
				}
		}
		}
	}
	
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
}

function isName(strVal, strRequired){
	
	// alert('strVal = '+strVal);
	
	
	if (strRequired == 'Yes' && isEmpty(strVal)) {
		return 'required';
	}
		
	if (strVal.length > 20){
		return 'InvalidLength';
	}
	
	if(isValidName(strVal) == false) 
	{ 
	   return 'InvalidName'; 
	}
	
	return '';
}

function isValidName(strName){
	
	return true;
	
}

function isSSN(strVal, strRequired){
	if (strRequired == 'Yes') {
		if ((strVal == null) || (strVal == "")){
			return 'required';
		}
	}
	if (strVal.length > 11){
		return 'InvalidLength';
	}
	if(isValidSSN(strVal) == false){ 
	   return 'InvalidSSN'; 
	}
	return '';
}

function isDate(strVal, strRequired){
	if (strRequired == 'Yes') {
		if ((strVal == null) || (strVal == "")){
			return 'required';
		}
	}
	/** tjmcd - SharedUtilities and this code are using 2 different date formars.
	 * Pick a common one
	if (strVal.length > 10){
	 */
	if (strVal.length > 28){
		return 'InvalidLength';
	}
	
	return '';
}

function isYear(strVal, strRequired){
	if (strRequired == 'Yes') {
		if ((strVal == null) || (strVal == "")){
			return 'required';
		}
	}
	if (strVal != null && strVal.length > 0) {
		if (! isNumber(strVal)){
			return 'NotANumber';
		}
	}
	return '';
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkInvalidDateFormats(strElm){
// If not a valid date format, clean value to empty
	if ($(strElm).val() != ''){
		//case when
		var isPri = false;
		var isSec = false;
		//52898 -- The birth_date is failing for ENDR
		if(strElm.indexOf('primary_insured_birth_date') !=-1){
			isPri = true;
		}
		if(strElm.indexOf('secondary_insured_birth_date') !=-1){
			isSec = true;
		}
		if(isValidDateFormat(strElm) == false){
			$(strElm).val('');
		}
		if(isPri){
			$('#primary_insured_birth_date_orig').val($(strElm).val());
		}
		if(isSec){
			$('#secondary_insured_birth_date_orig').val($(strElm).val());
		}
	}
}

function isValidDateFormat(strElm) {
	var strDate = $(strElm).val();
	return isValidDateVal(strDate);
}	

function isValidDateVal(strDate){
	var check = true;
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    
    if (strDate == '') {
    	 return check;
    }
    
    if( re.test(strDate)) {
        var adata = strDate.split('/');
        var mm = parseInt(adata[0],10);
        var dd = parseInt(adata[1],10);
        var yyyy = parseInt(adata[2],10);
        var xdata = new Date(yyyy,mm-1,dd);
        if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
            check = true;
        else
            check = false;
    } 
    else {
        check = false;
    }
    
    return check;   
   
}

function validSSN(elm){
	var ssn = $.trim(elm.value);
	if (ssn.length == 9) {
		ssn = ssn.substring(0,3) + '-' + ssn.substring(3,5) + '-' + ssn.substring(5,9);
	}
	var matchArr = ssn.match(/^(\d{3})-?\d{2}-?\d{4}$/);
	var numDashes = ssn.split('-').length - 1;
	var errMsg = "";
	
	if((ssn == "") || (ssn.substr(6,5) == "-****")||((isEndorsement() && ssn.substr(5,4) == "****" ))) {return false;}
	else {
		
		if(!/^(\d{3})-?\d{2}-?\d{4}$/.test(ssn)){
			errMsg = 'SSN is Invalid regEx';
		}
		if (numDashes == 1) 
			errMsg = 'SSN must be 9 digits';
		else if (ssn.substr(0,1) == 9)
			errMsg = 'SSN cannot begin with a 9';	
		else if ((ssn.substr(4,1) == 0 ) &&  (ssn.substr(5,1) == 0 ))
			errMsg = 'Positions 4 and 5 cannot be 00 in SSN.';
		else if ((ssn.substring(0,1) == ssn.substring(1,2)) && (ssn.substring(1,2) == ssn.substring(2,3)) && (ssn.substring(2,3) == ssn.substring(4,5)) && (ssn.substring(4,5) == ssn.substring(5,6)) && (ssn.substring(5,6) == ssn.substring(7,8)) && (ssn.substring(7,8) == ssn.substring(8,9))  && (ssn.substring(8,9) == ssn.substring(9,10))  && (ssn.substring(9,10) == ssn.substring(10,11)) )
			errMsg = 'SSN cannot consist of equal numbers';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)) 
			errMsg = 'Reverse sequential series of numbers are not valid in SSN';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)) 
			errMsg = 'Sequential series of numbers are not valid in SSN';	
		
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if (errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == -1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == 1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		if(errMsg != ""){return false;}
		else {return true;}
	}
}

function validDOB(elm)
{
	var dob = $.trim(elm.value);
	
	if((dob == "") || (dob.substr(0,6) == "**/**/")) {return false;}
	else {
		// run validation here
		return true;
	}
}

function validLicNum(elm)
{
	var licNum = $.trim(elm.value);
	
	if((licNum == "") || (licNum.substr(licNum.length,-4) == "****")) {return false;}
	else {
		// run validation here
		return true;
	}
}

function validFinancialInfo(elm)
{
	var finInfo = $.trim(elm.value);
	
	if((finInfo == "") || (finInfo.substr(finInfo.length,-4) == "****")) {return false;}
	else {
		// run validation here
		return true;
	}
}

//formatting functions
function fmtSSN(elm,e) { 
	// check for valid characters before formatting
	var ssn = elm.value;
  var re = /\D/g;
 
   //do this for copy paste scenario ctrl+v
  if(e.ctrlKey && (e.which == 86 || e.which==118)){
	if(ssn!=null && ssn!= undefined && ssn.length>1) {
		ssn = ssn.replace(re,"");
	};
}
  		   
  if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112) 
	{
	  if(e.keyCode == 8 || e.keyCode == 46){
		  if(ssn!=null && ssn!= undefined && ssn.length>6 && ssn.indexOf("*")!=-1){
			  ssn = ssn.substr(0,7);
			  $(elm).val(ssn);
		  }
	  }
		 
	} 
  else{
  if(ssn.length < 11) {
		ssn = ssn.replace("-","").replace(re,"");
		
		if(ssn.length >= 3){
			if(ssn.substr(3,1) != "-" && (!isEndorsement())) {
				ssn = ssn.substr(0,3) + "-" + ssn.substr(3);
			}
		}
	
		if(ssn.length >=6){
			if(ssn.substr(6,1) != "-" && (!isEndorsement())) {
				ssn = ssn.substr(0,6) + "-" + ssn.substr(6);
			}
		}
		
		$(elm).val(ssn);
	}

  else {
  	// ssn's already masked
  	// if user tries to delete any chars, force them to re-enter ssn
  	if((ssn.substr(6,5) == "-****") && (e.keyCode == 8))
  		$(elm).val("");
  }
  }
}

function getMessage(strMsgID){

	return getMessageWithMap(strMsgID, errorMessageJSON, "");
	
}

function getMessageWithMap(strMsgID, messageMap, replaceContentMap){

	if (messageMap == null || Object.keys(messageMap).length == 0){
		return '';
	}
	
	
	var strWork = messageMap[strMsgID];
	
	if (strWork == null){
		strWork = '';
	}
	if (strWork.length == 0){
		strWork = strMsgID;
	}
	// TODO Tejas Process replaces here
	for (var key in replaceContentMap) {		
		if(replaceContentMap.hasOwnProperty(key)) {				
			if (strWork.indexOf(key, 0) != -1) {
				strWork = strWork.replace(key, replaceContentMap[key]);		 
			}				
		}
	}
	
	return strWork;
	
}

function getFieldId(strObjectName){

	return getFieldIdWithMap(strObjectName, fieldIds);
	
}

function getFieldIdWithMap(strObjectName, fieldIdMap){

	if (fieldIdMap == null || Object.keys(fieldIdMap).length == 0){
		return '';
	}
	var strWork = fieldIdMap[strObjectName];
	if (strWork == null){
		strWork = strObjectName;
	}
	return strWork;
	
}

function clearWatermarkValue(watermark, watermarkText){
	if (watermark.value == watermarkText){
		watermark.value = '';
	}
}

function clearOptionalValues(){
	var optional = 'Optional';
	$('.watermark').each(function(){
		clearWatermarkValue(this, optional);
	});	
}

function clearDateFormatValues(){
	var dateLabel = "mm/dd/yyyy";
	$('.clsPolEffDate').each(function(){
		clearWatermarkValue(this, dateLabel);
	});	
}

//This function is used for those field which are not required by default but are required conditionally.
function addRemovePreRequired(obj, actn){
	//actn load means we should not add preRequired on bind, only on page load it shud get called
	if(actn=='load' && $('#firstTimeThru').val() == 'true' && $(obj).val() != null && $(obj).val().length == 0){		
		$(obj).addClass('preRequired');
	}else{
		$(obj).removeClass('preRequired');
	}
	if($(obj).is('select')){
		$(obj).trigger(getDropdownPluginEvent(obj));
	}
}

function addPreRequiredStyle(element){
	if (null != element.val() &&  element.val().length == 0 && !element.hasClass("inlineError")) {
		element.addClass('preRequired');
		if(element.is('select')){
			element.trigger(getDropdownPluginEvent(element));
		}else{
			element.bind("blur focus",function() {
				$(element).removeClass('preRequired');
			});
		}	
	}else{
		removePreRequiredStyle(element);
	}
}

function removePreRequiredStyle(element){
	if(element.is('select')){
		element.removeClass('preRequired');
		element.trigger(getDropdownPluginEvent(element));
	}else{
		element.removeClass('preRequired');
	}
}

function formatErrorMsgForDisplay(columnIndex, errorMsg, messageCode){
	// function formats error messages based on page
	var currentTabName;
	if (isUmbrellaQuote()) {
		currentTabName = document.umbrellaForm.currentTab.value;
	} else if(isHomeQuote()) {
		currentTabName = document.homeForm.currentTab.value;
	}else {
		currentTabName = document.aiForm.currentTab.value;
	}
	
	// Excluded Driver Message - Vehicles
	if(currentTabName == VEHICLESTABNAME && messageCode.indexOf("principalIsExcluded")!=-1){
		var id = "#principalOperatorId_" + columnIndex;
		var princOp = $.trim($(id + " option:selected").text());
		if(princOp.indexOf(",") != -1){
			var name = princOp.split(",");
			var lname = name[0];
			var fname = name[1];
			errorMsg = errorMsg.replaceAll("(insert name)", fname + " " + lname);
		} 
	}

	return errorMsg;
}

/*function removePreReqIfValueEntered(){
	// when page loads again if required field has value and/or it is displaying the inlineError class,
	// that field should not have yellow prerequired fill
	if($('#firstTimeThru').val() != 'true'){
		$('.required').each(function(){
			var elm = this;
	  		if(($(elm).val() != null && $(elm).val().length != 0) || ($(elm).hasClass("inlineError"))) {
	  			$(elm).removeClass('preRequired');
	  			if($(elm).is('select')){
	  				$(elm).trigger(getDropdownPluginEvent(elm));
	    		}
			}
	 	});
	}
}
*/

function getDropdownPluginEvent(elm){
	
	return "chosen:styleUpdated";
}

function showRemoveErrorMakeModel(element, fieldId){
	if($('#' + element).hasClass('inlineError')){
		if(fieldId.indexOf("dd_") == 0){
			$('#' + fieldId).addClass('inlineError').removeClass('preRequired').trigger('chosen:styleUpdated');
		}else if(fieldId.indexOf("ff_") == 0){
			$('#' + fieldId).addClass('inlineError').removeClass('preRequired');
		}
	}else{
		if(fieldId.indexOf("dd_") == 0){
			$('#' + fieldId).removeClass('inlineError').trigger('chosen:styleUpdated');
		}else if(fieldId.indexOf("ff_") == 0){
			$('#' + fieldId).removeClass('inlineError');
		}
	}
}

function isUmbrellaQuote() {
	if ($('#isUmbrellaQuote').val() == 'true') {
		return true;
	}else {
		return false;
	}
}

function isUmbrellaQuoteSubmitted() {
	if (isUmbrellaQuote() ) {
		var transactionStatus = $('#transactionStatusCd').val();
		if (transactionStatus == TransactionStatusEnum.IN_REVIEW) {
			return true;
		} else return false;
	}
}

function isHomeQuote() {
	if ($('#isHomeQuote').val() == 'true') {
		return true;
	}else {
		return false;
	}
}

function processSuccessRow(strElementID, strErrorRow, columnIndex, strRowName, strErrorMsg, addDeleteCallback) {
	
	//alert('process error row strErrorRow ='+strErrorRow+'columIndex ='+columnIndex+'strRowName='+strRowName+'strElementID='+strElementID);
	var strErrorColId = strRowName + '_Error_Col';
	//if ($.type(columnIndex) == "number" && columnIndex >= 0) {
	//	strErrorColId += '_' + columnIndex;
	//}
	
	var isApp = false;
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		isApp=true;
	}else{
		if($.type(columnIndex) === "number" && columnIndex==-1){}
		else{
				strErrorColId += '_' + columnIndex;
		}
		
	}
	$('#' + jq(strElementID)).each(function(){
		//point to the TR containing the TD with error data	
		var dataRow = $(this).parents("tr").first();
		//see if error row already exists

		var addErrorRow = $('#' + strRowName  + '_Error').length == 0;
		if (addErrorRow) {
			//Error row does not exist, so insert it
			// make a unique id
			var strTempErrorRow = strErrorRow;			
			strErrorRow = strErrorRow.replace(/id="([^"]*)"/, 'id="' + strRowName + '_Error"');
			if (strTempErrorRow == strErrorRow){
				//replace failed look for an id without "s aroubnd it
				strErrorRow = strErrorRow.replace(/id=([^ ]*) /, 'id="' + strRowName + '_Error" ');
			}
	
			//Global replace of generic Ids with specific Ids
			
			if(isApp)
			{
				strErrorRow = processAppRows(strErrorRow,strElementID,strRowName);
			}
			else{
				strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
			}
			var garagingAddressTableError = false;
			if(!isUmbrellaQuote() && isApplicationOrEndorsement() && !isHomeQuote()){
				var errorRowId = $(strErrorRow).attr('id');
				if(errorRowId.indexOf("garaging") != -1){
					garagingAddressTableError = true;
					var $parentRow = null;
					if(errorRowId.match("^garagingAddressData_")){
						$parentRow = dataRow;
					}else{
						$parentRow = $(dataRow).closest('table').parent().parent();
					}
					$(strErrorRow).removeClass('hidden').insertAfter($parentRow); 
				}
			}
			if(!garagingAddressTableError){
				$(strErrorRow).removeClass('hidden').insertAfter(dataRow);  //msg below
			}
			
		}

		// add error message to td in error row		
		$('#' + strErrorColId)
			.empty()
			.append(strErrorMsg)
			.addClass('inlineSuccessMsg');
		// put red outline around existing col
		$('#' + strElementID).addClass('inlineSuccess');
		
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
			// make sure yellow fill is gone for dropdowns
			//$('#' + strElementID).addClass('inlineError').removeClass('preRequired').trigger('chosen:styleUpdated');
		//}
		
		//By this time the chosen dropdown is not created yet. hence create it ?
		//Just apply class to the element and it is taken care when the page loads and chosen is applied.
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
			
		//	$('#' + strElementID+'_chosen a').addClass('inlineError');
		//}
		
		// refresh it if it is selectbox
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
		//	$('#' + strElementID).trigger("changeSelectBoxIt");
		//}
				
		// invoke the callback if one is specified
		// Do this AFTER the text is set so the error row height is correct
		if (addErrorRow && addDeleteCallback != null) {
			addDeleteCallback(dataRow.next(), true);
		}
	});
}

function submitBtnClickDoNotBindResponse(){
	$('#doNotBindErrorModal').modal('show'); 
}
