 $(document).ready(function(){
	 
 $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };
 
 $.caretTo = function (el, index) {
	 if (el.createTextRange) {
	 var range = el.createTextRange();
	 range.move("character", index);
	 range.select();
	 } else if (el.selectionStart != null) {
	 el.focus();
	 el.setSelectionRange(index, index);
	 }
	 };
	  
	 // Set caret to a particular index
	 $.fn.caretTo = function (index, offset) {
	 return this.queue(function (next) {
	 if (isNaN(index)) {
	 var i = $(this).val().indexOf(index);
	 if (offset === true) {
	 i += index.length;
	 } else if (offset) {
	 i += offset;
	 }
	 $.caretTo(this, i);
	 } else {
	 $.caretTo(this, index);
	 }
	 next();
	 });
	 };
	  
	 // Set caret to beginning of an element
	 $.fn.caretToStart = function () {
	 return this.caretTo(0);
	 };
	  
	 // Set caret to the end of an element
	 $.fn.caretToEnd = function () {
	 return this.queue(function (next) {
	 $.caretTo(this, $(this).val().length);
	 next();
	 });
	 };
		 
   if($("#cancelPolicyWithMailingLinkId").val() !='YES'){
	    $("#contactDetails").css("display","none");
    }else {
    	$("#showMailingDetailsHidden").val($("#cancelPolicyWithMailingLinkId").val());
    	$("#contactDetails").css("display","block");
   }
	 
  $("#clickToChange").click(function(){
      if ($("#clickToChange").is(":checked"))
      {
    	  $("#clickToChange").val("YES");
          $("#contactDetails").css("display","block");
      }
      else
      {
          $("#contactDetails").css("display","none");
      }
  });

$('#otherNewInsuranceCarrierName').bind('blur', function(event, result){ validateCancelPolicyFieldInput(this);});

$('#address1').bind(getValidationEvent(), function(event, result){ validateCancelPolicyFieldInput(this);});

$(".clsAddr1,.clsAddr2").bind({'keypress': function(e) {fmtAddress(this,e);}});

$('#address2').bind(getValidationEvent(), function(event, result){validateCancelPolicyFieldInput(this);});

//$('#Freeform_cityName').blur(function(){validateCityNameInput(this);});

$(".clsZip").bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric)
            this.value = this.value.replace(regex, '');
	}});

$('#zip').blur(function(){
	validateCancelPolicyFieldInput(this);
});

$('#emailId').bind(getValidationEvent(), function(event, result){validateEmail(this);});   
 
$('#homePhoneNo').bind(getValidationEvent(),function(event, result){validatePhoneNumber(this);});
$("#homePhoneNo").bind({'keyup keydown keypress': function(e) {fmtPhone(this,e);}});

$('#cellPhoneNo').bind(getValidationEvent(),function(event, result){validatePhoneNumber(this);});
$("#cellPhoneNo").bind({'keyup keydown keypress': function(e) {fmtPhone(this,e);}});

//$(".clsZipPlusFour ,.clsZip").bind({'keyup keypress': function(event) {


	
$('#zip').bind(getValidationEvent(), function(event, result){
	var emailRegex = new RegExp(/(^\d{5}$)/);
	var zip = $(this).val();
	var valid1 = emailRegex.test(zip);
	if (!valid1){
		var strErrorTag = 'zip.browser.inLine';
		var errorMessageID = 'required';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		var strId = $(this).attr('id');
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);		
	}
	else{
		var valid2 = validateZip(this);
	}	
});

setFocus('cancellationReasonSelect');
/*
$("#newInsuranceDetails").css("display","none");
$('#otherNewInsuranceDetails').css("display","none");

$('#cancellationReasonSelect').change(function(event){
	var cancelReason = $('#cancellationReasonSelect').val();
	if(showNewInsuranceCarrierSelect()){
		$('#newInsuranceDetails').css("display","block");
	}else{
		$('#newInsuranceDetails').css("display","none");
	}
});

$('#newInsuranceDetails').change(function(event){
	if($('#newInsuranceCarrierSelect').val() =='OTHER'){
		$('#otherNewInsuranceDetails').css("display","block");
	}else{
		$('#otherNewInsuranceDetails').css("display","none");
	}
}); */

});

function showNewInsuranceCarrierSelect(){
	var cancelReason = $('#cancellationReasonSelect').val();
	if(cancelReason =='AGT_REPL' || cancelReason =='CUST_REPL' || cancelReason =='INSURED'){
		return true;
	}else{
		return false;
	}
}

function canCelPolicy() {
	// Validate Cancel Reason
	if($('#cancellationReasonSelect').val() == '' || $('#cancellationReasonSelect').val() == 'none') {
		alert('Please select a Cancel Reason');
		return false;
	}
	
	/*if(showNewInsuranceCarrierSelect()){
		if($('#newInsuranceCarrierSelect').val() == '' || $('#newInsuranceCarrierSelect').val() == 'none') {
			alert('Please select a New Insurance Carrier');
			return false;
		}
		if($('#newInsuranceCarrierSelect').val() == 'OTHER'){
			if($('#otherNewInsuranceCarrierName').val().length == 0){
				alert('New Insurance Carrier Name is required.');
				$('#otherNewInsuranceCarrierName').focus()
				return false;
			}
		} 
	}*/
	
	
	
	if($('#cancellationReasonSelect').val() == '' || $('#cancellationReasonSelect').val() == 'none') {
		alert('Please select a Cancel Reason');
		return false;
	}
	if($('#clickToChange:checked').length == 1) {
		// Validate other fields
		if($.trim($('#address1').val()) == '') {
			alert('Please enter Address 1');
			return false;
		}
		if($.trim($('#zip').val()) == '') {
			alert('Please enter a Zip');
			return false;
		}
		if($.trim($('#city').val()) == '') {
			alert('Please enter a City');
			return false;
		}
		if($.trim($('#addrstateCd').val()) == '') {
			alert('Please select a State');
			return false;
		}
		if($.trim($('#zip').val()).length != 5 && $.trim($('#zip').val()).length != 10) {
			alert('Please enter a valid Zip');
			return false;
		}
		var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
		var emailAddress = $.trim($('#emailId').val());
		if(emailAddress != '' && !emailRegex.test(emailAddress)) {
			alert('Please enter a valid email');
			return false;
		}
	}
	
	showLoadingMsg();
    $.ajax({
          type: "POST",  
          url: "/aiui/endorsement/policy/cancel",         
          data: $("#cancelEndPolicyForm").serialize(),
          success: function(response){
        	$("#policyNumberId").html($("#polNumber").val());	            	                         
        	$("#cancellationStatusId").html(response.messageCode);
        	$("#cancelConfirmModalDialog").modal('show');  
        	if(response.messageDescription == "SUCCESS"){
        		$('#cancelPolicy').attr('disabled', 'true');
        		$("#cancelEndPolicyForm :input:not([type=hidden])").prop("disabled", true);
        		$('select').prop('disabled', true).trigger('chosen:updated');
        	}	            	
          },
  		complete: function(){
  			$.unblockUI();  
  		}
  	});          
  	 
    return false;          
     } 
    
    function returnToLandingPage() {    	
    	var prefix = "/aiui";
    	var nextPath = $("#nextPath").val();
    	document.forms[0].method = "GET";
        document.forms[0].action = prefix+nextPath;
        document.forms[0].submit();
     }    
    
 
	 

 function validatePhoneNumber(phoneNumber){
		var errorMessageID = '';
		var phoneId = phoneNumber.id;
		var phoneNumberValue = $('#'+phoneId).val();
		
		//var workPhoneNumberValue = $('#workPhoneNum').val();
		var cellPhoneNumberValue = $('#homePhoneNum').val();
		var homePhoneNumberValue = $('#cellPhone').val();
		
		if(phoneNumberValue == null || phoneNumberValue == "" || phoneNumberValue =='Optional' || /[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/.test(phoneNumberValue)){
			showClearInLineErrorMsgsWithMap(phoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else
		{
			$('#'+phoneId).val("");	
			errorMessageID =phoneId+'.browser.inLine.Invalid';
			showClearInLineErrorMsgsWithMap(phoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
//		if((homePhoneNumberValue != "") ||  ( cellPhoneNumberValue != "")) {
//			showClearInLineErrorMsgsWithMap("workPhoneNum", errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
//		}
	}

function fmtPhone(elm,e) {
	var phone = elm.value;
	var phoneId = elm.id;
	var re = /\D/g;
	if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112){
		
	} else{
		if(phone.length < 13) {
			var  splitDash = phone.split("-");
			
			if(splitDash.length==3 && splitDash[0].length<=3 && splitDash[1].length<=3 && splitDash[2].length<=4){
				var pos = $(elm).getCursorPosition();
				$(elm).val(phone).caretTo(pos);
			}else{
				phone = phone.replace("-","").replace(re,"");
				if(phone.length >= 3){
					if(phone.substr(3,1) != "-") {
						phone = phone.substr(0,3) + "-" + phone.substr(3);
					}
				}
				if(phone.length >=7){
					if(phone.substr(7,1) != "-") {
						phone = phone.substr(0,7) + "-" + phone.substr(7);
					}
				}
			    var pos = $('#'+phoneId).getCursorPosition();
			    if(phone.length ==4 || phone.length ==8){
			    	pos=pos+1;
			    }
			    $('#'+phoneId).val(phone).caretTo(pos);
				}
			}
		}
  }


function validateCancelPolicyFieldInput(selectedElement) {
	if (selectedElement.id == "otherNewInsuranceCarrierName"){
		validateNameInCP(selectedElement, 'Yes', 'otherNewInsuranceCarrierName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	}else if (selectedElement.id == "address1"){
		validateNameInCP(selectedElement, 'Yes', 'address1.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	} else if (selectedElement.id == "address2"){
		validateNameInCP(selectedElement, 'No', 'address2.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	} else if (selectedElement.id == "zip"){
		validateNameInCP(selectedElement, 'Yes', 'zip.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");		
	}
}

function validateNameInCP(name, strRequired, strErrorTag, strErrorRow, index, errorMessageJSON, addDeleteCallback,dataType){
	var errorMessage = '';
	var strfieldvalue;
		
	
	if (($(name).val() !="") && (name.id.search("mask_") >=0)){
		strfieldvalue = $("#"+name.name).val();	
		if (strfieldvalue == "") {
			strfieldvalue=$(name).val();
		}
	}
	else{
		strfieldvalue = $(name).val();
	}
		
	
	errorMessageID = checkName(dataType, strfieldvalue, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsCancelPolicy(name,name.id, errorMessageID, strErrorRow, index);
}

function checkName(dataType, strVal, strRequired){
	if (strRequired == 'Yes') {
		if ((strVal == null) || (strVal == "")){
			return 'required';
		}
	}
		
	if (strVal.length > 40){
		return 'InvalidLength';
	}
	if (dataType == "number" ) {	
		if (isValidNumerics(strVal) == false)
			return 'InvalidNumber'; 
	}
	if (dataType == "decimal" ) {
		var pattern=/^\d+(?:\.\d{2})?$/;
		if(pattern.test(strVal) == false)
			return 'InvalidNumber'; 
	}
	else if (dataType == "date" ) {
		if (isValidDate(strVal) == false)
			  return 'InvalidDate'; 
	}
	else  {
		if (checkValidName(strVal) == false)
		  return 'InvalidName'; 
	}
	
	return '';
}

function checkValidName(strName){
	charIndxPos = strName.search("[^A-Za-z0-9.' ]");
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
	
}

//function fmtNumber(elm,e) { 
//	var elmNumber = elm.value;
//	var re = /\D/g;
//	if((elmNumber != "") && ( (elmNumber.substr(elmNumber.length-4,elmNumber.length) != "*****") ||(elmNumber.substr(elmNumber.length,-3) != "***") || (elmNumber != "***")/*|| (elmNumber.substr(elmNumber.length-4,4) != "****") || (elmNumber.substr(elmNumber.length-3,3) != "***")*/)){
//		elmNumber = elmNumber.replace(re,"");
//		
//		$(elm).val(elmNumber);
//	}
//}

function validateEmail(addressEmailID){
	isValidEmail('',addressEmailID,'No','emailId.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], -1);
}
	
function fmtAddress(address,e){	
	var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 8) return true;
    var keynum;
    var keychar;
    
    //[,.#\\/A-Za-z0-9\\s'&-]
    var charcheck = /[\\\/,.#a-zA-Z0-9-'& ]/;
    
    if (window.event) // IE
    {
        keynum = e.keyCode;
    }
    else {
       
    	if (e.which) // Netscape/Firefox/Opera
        {
            keynum = e.which;
        }
        else 
        	return true;
    }
    keychar = String.fromCharCode(keynum);
    if( charcheck.test(keychar))
    	{
    		return true;
    	}
   else
    	{
    		e.preventDefault();    	
   	}
 }	

function validateCityNameInput(cityName) {
	validateNameInColumn(cityName, 'Yes', 'cityName.browser.inLine', fieldIdToModelErrorRow['cityState'], -1);	
	var strID = cityName.id;
	if($('#'+strID).val()!=""){
		$('#cityName').removeClass('required');
		$('#cityName').removeClass('inlineError');
		$('#cityName').removeClass('preRequired');
		//$('#cityName').val(cityName).trigger('chosen:updated').trigger('chosen:styleUpdated');
		if( $('#addressCity').length )
		{
			$('#addressCity').val('');
			$('Freeform_cityName').val('');
			$('#addressCity').val($('#cityName').val());
		}
	}
}


function isValidEmail(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/i);
	var emailAddress = $(elementId).val();
	var errorMessageID = '';
	if(emailAddress==null || emailAddress =='' || emailAddress == 'Optional'){ 
		 errorMessageID = '';
	}
	else
	{
		var valid = emailRegex.test(emailAddress);
		if (!valid)
		{
			errorMessageID = 'InvalidEmailId';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			//$('#'+elementId.id).val("");
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	showClearInLineErrorMsgsCancelPolicy('',elementId.id, errorMessageID, strErrorRow, index);
}

function validateAddressLine1(addressLine1) {
	return validateName(addressLine1, 'clsAddressLine1', 'Yes','aiui.aiForm.addressLine1', $('#messages').val(), strErrorRow);	
}

function validateAddressLine2(addressLine2) {
	return validateName(addressLine2, 'clsAddressLine2', 'Yes','aiui.aiForm.addressLine2', $('#messages').val(), strErrorRow);	
}


function showClearInLineErrorMsgsCancelPolicy(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgsCancelPOlicy(name,strElementID, strErrorMsgID, strErrorRow);
}

function showClearInLineErrorRowMsgsCancelPOlicy(name,strElementID, strErrorMsgID, strErrorRow){
	var isAppRow = false;
	var isPri = false;
	
	var strRowName = strElementID;
	if(isAppRow){
	 strRowName = name;
	}
	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	//sample calling code
	var strErrorMsg = '';
	if (strErrorRow.length == 0){
		// if no error row return
		return;
	}
	if (strErrorMsgID.length == 0){
		//clear this message
		//if this is the last error message -> remove error row
		clearInLineRowErrorCancelPolicy(strRowName,strElementID, strErrorRow);
		return;
	}
	
	//get the error message to be displayed
	strErrorMsg = getMessage(strErrorMsgID);
	if(strErrorMsg.length == 0){
		// if no error message -> return;
		return;
	}
	
	$('#' + jq(strElementID)).each(function(){
		var dataRow = '';
		
				
				dataRow = $(this).parents("tr").first();   
				var errorRowExists = false;
				$('#' + strRowName  + '_Error').each(function(){
					errorRowExists = true;
				});
				if (errorRowExists == false) {
					strErrorRow = strErrorRow.replace('sampleErrorRow', strRowName + '_Error');
					strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
					$(strErrorRow).insertAfter(dataRow);  //msg below
				}
				var strErrorColSelector = strRowName + '_Error_Col';
				$('#' + strErrorColSelector).empty();
				$('#' + strErrorColSelector).append(strErrorMsg);
				$('#' + strErrorColSelector).addClass('inlineErrorMsg');
				// put red outline around existing col				
				$('#' + strElementID).addClass('inlineError');				
				// refresh it if it is selectbox
				if ($('#' + strElementID).is('select:not(select[multiple])')) {					
					$('#' + strElementID).trigger('chosen:styleUpdated');
				}				
	});
}


function clearInLineRowErrorCancelPolicy(rowName,strElementID, strErrorRow){
	var strRowName = rowName;
	var errorRow = null;
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	
	if (errorRow == null || errorRow.length == 0 ) {
		return ;
	}
	// remove error row
	errorRow.remove();
	$('#' + strElementID).removeClass('inlineError');	
	
	if ($('#' + strElementID).is('select:not(select[multiple])')) {
		 $('#' + strElementID).trigger('chosen:styleUpdated');
	}
}

/** Prompt Exit Logic **/
function showExitPromptCP(action, blnAgencyProfile, event){	
	var blnShowExitPrompt = exitPromptRequired(blnAgencyProfile);
	var policySourceCd = $('#policySourceCd').val();
	
	if (typeof event === 'undefined') {event = jQuery.Event( "click");}

	if(blnShowExitPrompt){
		$('.modal').hide(); 
		event.preventDefault();	   
		$(document).on("click", "#exitPrompt", function(fnctCall){		
			$('#exitPromptModal').modal('hide');
			showLoadingMsg();
			if (policySourceCd == 'ENDORSEMENT') {
				//make call to delete pending amendment - only for prime end
				deletePendingAmendment(action);
			}else{
				callGlobalHeaderAction(action);
			}
			//callGlobalHeaderAction(action);
		});
		
		$(document).on("click", "#saveExitPrompt", function(){
			$('#exitPromptModal').modal('hide');
			saveNBPage(action);
		});
		
		// show prompt
		$("#exitPrompt").removeClass("hidden");
		$('#exitPromptModal').modal('show');
		return;
	}else{
		callGlobalHeaderAction(action);
	}
}


function deletePendingAmendment(action){
	// set URL and get parameters from policy
	// build query string
	var strURL = "/aiui/endorsement/delete/amendment";
	var polNumber;
	
	if(document.cancelEndPolicyForm){
		polNumber = document.cancelEndPolicyForm.policyNumber.value;
	}else{
		polNumber = document.aiForm.policyNumber.value;
	}
	strURL = addRequestParam(strURL, "policyNumber", polNumber);
	
	$.ajax({
		url: strURL,
		type:'POST',
		data: $("#aiForm").serialize(),
		dataType: 'json',

		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		success: function(data){
			//alert("success");
		},
		error: function(xhr, status, error){
			//alert("error is " + error);
		},
		complete: function(){
			// complete we want to redirect user to chosen action
			callGlobalHeaderAction(action);
		}
	});
}

var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>",
		"applicants":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col_PRI\"></td><td class=\"fieldColError\" id=\"Error_Col_SEC\"></td><td></td></tr>",
		"zipZip4":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>",
		"cityState":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>"
};



var errorMessageJSON = 
{
"address1.server.pageAlert.required":"Address1 is required",
"address1.server.inLine.required":"Required entry",
"address1.server.popUp.required":"Required entry",
"address1.browser.inLine.required":"Required entry",
"address1.browser.inLine.InvalidAddress":"Required entry",
"address1.browser.inLine.InvalidPMBAddress":"The PMB (Private Mailbox) is not accepted.  Please enter the residence address",
"address1.browser.inLine.InvalidLength":"Address has Invalid Length",
"address1.browser.inLine.InvalidName":"Please enter valid Address",
"address2.browser.inLine.InvalidLength":"Address has Invalid Length",
"address2.browser.inLine.InvalidName":"Please enter valid Address",
"zip.server.pageAlert.required":"Zip code is required",
"zip.server.inLine.required":"Required entry",
"zip.server.popUp.required":"Required entry",
"zip.browser.inLine.required":"Required entry",
"zip.browser.inLine.InvalidName":"Zip is invalid",
"zip.browser.inLine.InvalidZip":"The zip code entered must match the city and state entered",
"cityName.server.pageAlert.required":"City is required",
"cityName.server.inLine.required":"Required entry",
"cityName.server.popUp.required":"Required entry",
"cityName.browser.inLine.required":"Required entry",
"addrstateCd.server.pageAlert.required":"Required entry",
"addrstateCd.server.inLine.required":"Required entry",
"addrstateCd.server.popUp.required":"Required entry",
"addrstateCd.browser.inLine.required":"Required entry", 
"emailId.server.pageAlert.required":"Required entry",
"emailId.server.inLine.required":"Required entry",
"emailId.server.popUp.required":"Required entry",
"emailId.browser.inLine.required":"Required entry",
"emailId.browser.inLine.InvalidEmailId":"Invalid email address format",
"otherNewInsuranceCarrierName.browser.inLine.required":"Required entry"
}
