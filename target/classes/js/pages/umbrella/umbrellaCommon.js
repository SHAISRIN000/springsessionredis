jQuery(document).ready(function() {	
});

function makeReadOnly() {
	if ($('#readOnlyMode').val() == 'Yes' ) {
		$("#umbrellaForm :input:not([type=hidden])").prop("disabled", true);
		$('#umbrellaForm select').prop('disabled', true).trigger('chosen:updated');
		$('.clsPolEffDate').datepicker("disable");
		$("#umbrellaForm :button").prop("disabled", true);
		$("#rateButton").children().prop('disabled',true);
	}
}

function submitForm() {
	if(!wasPremiumChanged()){
		$('#samePremium').modal('show');
		return;
	}
	
	blockUserForRating();
	var event = jQuery.Event(getSubmitEvent());
	$('#umbrellaForm').trigger(event);
	if (event.isPropagationStopped()) { logToDb("umbrellaCommon.js: 343 - Inside evet.isPropagationStopped() in submitForm()"); 
		$.unblockUI();
	} else {
		checkPreSubmit();
		clearOptionalValues();
		enableFields();
		document.umbrellaForm.action = '/aiui/umbrella';
		document.umbrellaForm.method = 'POST';
		document.umbrellaForm.submit();
	}
}

function wasPremiumChanged(){
	var isRated =  $('#ratedInd').val();
	var premAffected = $('#wasPremiumChanged').val();
	var premAmt = $('#premAmt').val();
	
	if(isRated == "Yes" && premAffected == "No" && premAmt != "" && premAmt != "0.0000"){
		return false;
	}else{
		return true;
	}
}

function checkRateButtonDisplay(){
	var isRated =  $('#ratedInd').val();
	var premAmt = $('#premAmt').val();
	var priorPremAmt = $('#priorRatedPremAmt').val();
	
	if(isRated == "Yes" && (premAmt == "" || premAmt == "0.0000" ) && priorPremAmt != ""){
		$('#premamt_no_change').hide();
		$('#premamt_change').show();
		$('.priorPremAmt').text('$' + priorPremAmt.substring(0,  priorPremAmt.indexOf(".")));
	}else if(!wasPremiumChanged()){
		$('#premamt_no_change').show();
		$('#premamt_change').hide();
	}
}

//check rating edit messages
function showRatingEditsUmbrella(){
	var polStarError = '';
	var pageErrorInfoSel = $('#' + jq('pageErrorInfo'));
	var blnPremChange = false;
	var currentTab =  $('#currentTab').val();
	
	if (pageErrorInfoSel == null || pageErrorInfoSel.length == 0) {
	   //no error data, leave!
	   return;
	}
	 
	var pageErrorInfoJSON = pageErrorInfoSel.val(); 
	if (pageErrorInfoJSON == null || pageErrorInfoJSON == '' || pageErrorInfoJSON == '[]'){
		//no error data, leave!
		 return;	  
	}
	
	$('#ratingErrorDialog').modal('hide');
	$('#ratingInfoDialog').modal('hide');
	pageErrorInfoJSON = escapeDoubleQuotes(pageErrorInfoJSON);
	var pageErrorInfos = jQuery.parseJSON(pageErrorInfoJSON);
	if (pageErrorInfos[0].fieldID.substring(0, 8) == 'POLSTAR_' || pageErrorInfos[0].fieldID.substring(0, 7) == 'RERATE_'){
		polStarError = 'Yes';
		if(pageErrorInfos[0].fieldID.substring(0, 7) == 'RERATE_' && currentTab=='umbrellafinish'){
			blnPremChange = true;
		}
	}
	
	if(polStarError == 'Yes'){
		// check edit message to determine what we display
		var fieldId = pageErrorInfos[0].fieldID + '.server.pageAlert';
		//fieldId =  fieldId.replace('.server.pageAlert', '')
		var messageMap = jQuery.parseJSON($("#errorMessages").val());
		var errMessage = "";
		$.each(messageMap, function(errId,errMsg) {
			if(errId == fieldId){
		    	errMessage = errMsg;
		    	return false;
		    }
		});
		
		if(errMessage != ""){
			if(blnPremChange){
				$('#pageAlertMessage').html("");
				$('#pageAlertMessage').hide();
				$('#ratingInfoDialogBody').html(errMessage);
				$('#ratingInfoDialog').modal('show');
			}else{
				$('#pageAlertMessage').html(errMessage);
				$('#ratingErrorDialogBody').html(errMessage);
				$('#ratingErrorDialog').modal('show');
			}
		}
	}	
}

/**
 * only called when date entered is partial and we know we still will be sending to server for validation
 * and DateTime binding going to fail anyways
 */
function checkPreSubmit(){
	var dateLabel = "mm/dd/yyyy";
	$('.clsPolEffDate').each(function(){
		clearWatermarkValue(this, dateLabel);
	});
}

function enableFields(){
	// enable policy state, branch, agency and producer files
	$('select.clsPolicyStateCd').prop('disabled',false).trigger("chosen:updated");
	$('select.clsBranch').prop('disabled',false).trigger("chosen:updated");
	$('select.clsAgency').prop('disabled',false).trigger("chosen:updated");
	$('#policyProducerInput').prop('disabled',false).trigger("chosen:updated");
	$('#privatePassengerQty').prop('disabled',false).trigger("chosen:updated");
	$('#policyTerm').prop('disabled',false).trigger("chosen:updated");
}

function setupTabs() {
	var isRated =  $('#ratedInd').val();
	var premAmt = $('#premAmt').val();
	
	
	if (isRated == 'Yes') { 
		//&& (premAmt != "0.0000" && premAmt != "") {
		if (!isUmbrellaQuoteSubmitted()) {
			$("#umbrellafinish").removeClass('disabledTab');
			if(premAmt != "" && premAmt != "0.0000"){
				$("#nextButton").show();
				$("#rateButtonQuote").hide();
			}else{
				$("#nextButton").hide();
				$("#rateButtonQuote").show();
			}
			var strState = $('select.clsPolicyStateCd').val();
			if (premAmt != "0.0000" && premAmt != "" && strState =='NJ' ) {
				$("#pliga").show();
			}
			$('#' + mainContentDivName).attr("style", "margin-top: 160px;");
		} else {
			$('#umbrellafinish').off('click');
			$("#submitText").show();
			$('#' + mainContentDivName).attr("style", "margin-top: 180px;");
		}
	} else {
		$('#umbrellafinish').off('click');
	}
	var currentTab =  $('#currentTab').val();
	if (currentTab == 'umbrellafinish') {
		$("#umbrellafinish").addClass('activeTab');
		$('#umbrellafinish').off('click');
	}else {
		$("#umbrellaQuote").addClass('activeTab');
		$("#umbrellaQuote").off('click');
	}
	
}


