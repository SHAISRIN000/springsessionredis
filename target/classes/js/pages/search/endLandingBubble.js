jQuery(document).ready(function() {
	/* Date picker changes : START*/
	$('#endCanEffectiveDateId').datepicker({
		showOn: "button",buttonImage: calendarImage,buttonImageOnly:true,buttonText : 'Open calendar',
        onClose: function() {
			var effDt = this;
			setTimeout(function () {
				if($(effDt).val().length == 0){
					$(effDt).addClass('watermark');
				}else{
					$(effDt).removeClass('watermark');
				}
		    }, 100);
		}
	});
	/* Date picker changes : END*/	
	
	$('#endBubbleForm [id="endCanEffectiveDateId"]').bind(validModalEvent, function(event, result){
		var effDate = this;
		setTimeout(function () {
			validateEndtDate(effDate);
	    }, 100);
	});
	
	$('#endLandingLossRadioButtonYesId').click(function(){
		$("#endLBRadioButtonResponseText").text('');
		if($('#endBubbleForm_outOfSequenceInd').val() == 'Yes' && $('#ossBackDatedFlag').val() == 'No') {
			var todaysDateForEndr = new Date();
			todaysDateForEndr.setHours(0,0,0,0);//effectiveDateForEndr starts at midnight
			var effectiveDateForEndr = new Date($('#endCanEffectiveDateId').val());

			if ( effectiveDateForEndr <  todaysDateForEndr) {
				$('#endLBRadioButtonLabel').html('<label class="newQuoteLabel">Have any losses occurred between the effective date chosen and the current date?</label>');
				//$('#endLandingLossRadioButtonYesId').prop('checked', false);
				$('#endLandingLossRadioButtonYesId').attr("checked", false);
				$('#endLandingLossRadioButtonNoId').attr("checked", false);
				$('#endLBRadioButtonId').show();
				$('#submitEndBubble').attr('disabled', 'true');
				$("#ossBackDatedFlag").val("Yes");				
			} else {
				$('#endLBDisplayTextForYesRadioButtonId').hide();
				$('#submitEndBubble').removeAttr('disabled');
				$("#oosSecondTime").val("Yes");
			}
		} else if($('#endBubbleForm_backDatedInd').val() == 'Yes') {
			$('#endLBRadioButtonResponseText').text("The effective date of the transaction is in the past and you have indicated that losses have occurred." +
					" Please choose an effective date after the date of loss or contact Customer Care for assistance.");
			$('#endLBDisplayTextForYesRadioButtonId').show();
			$('#submitEndBubble').attr('disabled', 'true');
		} else if($('#ossBackDatedFlag').val() == 'Yes'){
			$('#endLBRadioButtonResponseText').text("The effective date of the transaction is in the past and you have indicated that losses have occurred." +
			" Please choose an effective date after the date of loss or contact Customer Care for assistance.");
			$('#endLBDisplayTextForYesRadioButtonId').show();
			$('#submitEndBubble').attr('disabled', 'true');
		}
	});
	
	
	$('#endLandingLossRadioButtonNoId').click(function(){		
		if($('#endBubbleForm_outOfSequenceInd').val() == 'Yes' && $('#ossBackDatedFlag').val() == 'No') {
			$('#endLBRadioButtonResponseText').text("The effective date of the transaction will cause an " +
					"Out Of Sequence transaction and you have indicated that you do not want to continue. " +
					"Please chose an effective date after the last transaction date");
			$('#endLBDisplayTextForYesRadioButtonId').show();
			$('#submitEndBubble').attr('disabled', 'true');
		} else if($('#endBubbleForm_backDatedInd').val() == 'Yes') {
			$('#endLBDisplayTextForYesRadioButtonId').hide();
			$('#submitEndBubble').removeAttr('disabled');
			$("#backDatedSecondTime").val("Yes");				
		} else if($('#ossBackDatedFlag').val() == 'Yes'){
			$('#endLBDisplayTextForYesRadioButtonId').hide();
			$('#submitEndBubble').removeAttr('disabled');
			$("#oosSecondTime").val("Yes");
		}
	});
	
	$(document).on("click", "#submitEndBubble", function(e){
		var txnEffDate = $('#endCanEffectiveDateId').val();
		
		//if(txnEffDate.length == 0){
		if(txnEffDate == 'mm/dd/yyyy'){	
			$("#endBubbleDialogBody #inValidDateErrorModalText").text('Please enter a valid effective date in mm/dd/yyyy format.');
			return;	
		}
		fireEndBubbleRules();
		//showMegaMenuPopover(e);
	});
	
	$(document).click(function(){
		//check if mega menu if visible, if it is hide.
		var popoverData = $('#submitEndBubble').data('popover');
		if (popoverData != undefined) {
			$('#submitEndBubble').popover('hide');
			popoverData.closeOnClick = true;
		}
	});
	
	/*Reset EffectiveDateId & status after changing the term*/
	$( "#policyTermsId" ).change(function() {
		var data = new EndorsementTermKey($(this).val());
		updateLandingBubbleData(null, data.policyStatus, null, data.term);
	});
	 
	$("#endCanEffectiveDateId" ).click(function() {	
	    $('#endLBRadioButtonId').hide();     
		$('#endLBDisplayTextForYesRadioButtonId').hide();
		$("#endBubbleDialogBody #inValidDateErrorModalText").text('');
		$('#submitEndBubble').removeAttr('disabled');		
	});
	 
	/*Fire validation rules on change of effective date*/
	$("#endCanEffectiveDateId" ).change(function() {
		var policyStatusId = $("#policyStatusId").val();
		resetLandingBubble();
		document.actionForm.txnEffDate.value = $("#endCanEffectiveDateId").val();
		var transactionEffectiveDate = $('#endCanEffectiveDateId').val();		
		var data = new EndorsementTermKey($("#policyTermsId").val());
		var effectiveDate = data.effectiveDate;
		var expirationDate = data.expirationDate;
		var transTime = new Date(transactionEffectiveDate).getTime();
		var expirationTime = new Date(expirationDate).getTime();
		if(validateDate(transactionEffectiveDate)){
			if(policyStatusId == "Incomplete"){
				$("#endBubbleDialogBody #inValidDateErrorModalText").text('This Policy is Inactive.');
				$('#submitEndBubble').attr('disabled', 'true');
			} else if(expirationTime == transTime){
				$("#endBubbleDialogBody #inValidDateErrorModalText").text('An endorsement cannot be processed with an effective date which is the same as on the expiration date of the current policy. Please choose an effective date that occurs prior to the policy expiration date or contact Customer Care for assistance.');
				$('#submitEndBubble').attr('disabled', 'true');
			} else if(checkTransactionEffectiveDateRange(transactionEffectiveDate, effectiveDate, expirationDate)){
				$(this).closest("tr").css({color: "black"});
				fireEndBubbleRules();
				//$('#submitEndBubble').removeAttr('disabled');
			} else {
				$("#endBubbleDialogBody #inValidDateErrorModalText").text('The Effective date must occur within the selected policy term selected. Please adjust the effective date or select a different policy term.');
				$('#submitEndBubble').attr('disabled', 'true');				
			}			
		} else{
			$("#endBubbleDialogBody #inValidDateErrorModalText").text('Please enter a valid effective date in mm/dd/yyyy format.');
			$('#submitEndBubble').attr('disabled', 'true');
		}
	});	
	
//	$("#endCanEffectiveDateId" ).blur(function() {
//		var transactionEffectiveDate = $('#endCanEffectiveDateId').val();
//		if(transactionEffectiveDate == "mm/dd/yyyy"){
//			$("#endBubbleDialogBody #inValidDateErrorModalText").text('Please enter a valid effective date in mm/dd/yyyy format.');
//			$('#submitEndBubble').attr('disabled', 'true');
//		}
//	});
	
	$("#endCanEffectiveDateId").keydown(function(e) {
		$("#endBubbleDialogBody #inValidDateErrorModalText").text('');
		if(e.keyCode == 13 || e.keyCode == 9) {
			$('#endCloseModalLink').focus();
			$("#endCanEffectiveDateId").trigger('change');
			e.preventDefault();
		}
	});
	$(".closeOutOfRangeEffDateModal").click(function() {		
		$("#effectiveDateIsOutsideRangeWarningModal").close();
	});
	
	$(".closeInvalidDateModal").click(function() {		
		$("#inValidDateErrorModal").close();
	});
	
	$(".closeEndUnderConstruction").click(function() {		
		$("#endUnderConstructionInfoModal").modal('hide'); 
	});
	
});

function fireEndBubbleRules() {
	var oosSecondTime = $('#oosSecondTime').val();
	var backDatedSecondTime = $('#backDatedSecondTime').val();
	resetLandingBubble();

	var url = document.actionForm.endBubbleValidationURL.value;
	var key = $('#policyTermsId').val().replaceAll("&","%38"); // this is for Active & Renewed issue
	var txnEffDate = $('#endCanEffectiveDateId').val();

	//this is for blocking the endorsement bubble during service call
	$('#endBubbleDialog').block({			
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});

	$.ajax({
		type: "POST",  
		url: url, 
		cache: false,
		data: "key=" + key + "&txnEffDate=" + txnEffDate,
		success: function(response){
			//TD#73841:START Endorsements are allowed to be backdated past 30 day limit
			/*
			 * Response from the bubble is a XML document and accessing it like JS Object wouldn't work as intended 
			 */
			var $response = $(response.documentElement);
			$("#endBubbleForm_outOfSequenceInd").val($response.find('outOfSequenceInd').text());
			$("#endBubbleForm_driverCountExceedInd").val($response.find('driverCountExceedInd').text());
			$("#endBubbleForm_backDatedInd").val($response.find('backDatedInd').text());
			$("#endBubbleForm_mrbStatusPendingInd").val($response.find('mrbStatusPendingInd').text());
			$("#endBubbleForm_unidentifiedDriverExists").val($response.find('unidentifiedDriverExists').text());
			$("#endBubbleForm_cancelPendingStatus").val($response.find('cancelPendingStatus').text());
			$("#endBubbleForm_currentPolicyStatus").val($response.find('currentPolicyStatus').text());
			$("#endBubbleForm_hasAntiqueVehicles").val($response.find('hasAntiqueVehicles').text());
			$("#endBubbleForm_mrbTransactionPending").val($response.find('mrbTransactionPending').text());
			//If value is empty string/null/undefined then trim would return empty string else the content
			var message = $.trim($response.find('message').text());
			if($response.find('backDatedInd').text() == 'Yes' && backDatedSecondTime =='No') {
				$('#endLBRadioButtonLabel').html('<label class="newQuoteLabel">Have any losses occurred between the effective date chosen and the current date?</label>');
				$('#endLandingLossRadioButtonYesId').attr("checked", false);
				$('#endLandingLossRadioButtonNoId').attr("checked", false);
				$('#endLBRadioButtonId').show();				
				$('#submitEndBubble').attr('disabled', 'true');
			} else if($response.find('outOfSequenceInd').text() == 'Yes' && oosSecondTime =='No') {
				$('#endLBRadioButtonLabel').html('<label class="newQuoteLabel">'+ message +'</label>');	
				$('#endLandingLossRadioButtonYesId').attr("checked", false);
				$('#endLandingLossRadioButtonNoId').attr("checked", false);
				$('#endLBRadioButtonId').show();				
				$('#submitEndBubble').attr('disabled', 'true');
			} else if(message !=='' && (oosSecondTime =='No' && backDatedSecondTime =='No')) {
				$('#inValidDateErrorModalText').html(message);
				$('#submitEndBubble').attr('disabled', 'true');
			} else if(message !=='' && $response.find('outOfSequenceInd').text() != 'Yes') {
				$('#inValidDateErrorModalText').html(message);
				$('#submitEndBubble').attr('disabled', 'true');
			} else {
				//$('#submitEndBubble').removeAttr('disabled');
				showMegaMenuPopover();

			}
			//TD#73841:END
		}, 
		complete: function(){
			// enable for user action
			$('#endBubbleDialog').unblock();
		}
	});          
	return false;
}

function showErrorMessage(errMsg) {
	$('#inValidDateErrorModalText').html(errMsg);
}

function submitEndorsementActionRequest(action) {
	var url = document.actionForm.endActionURL.value;   
//	$("#cancelPolicyWithMailAddressChange").val('Yes');
	if(url != '') {
		
		if(action == 'UpdatePaymentPlan'){
			//if a policy is in the cancel pending state.
			var endBubbleForm_cancelPendingStatus = $("#endBubbleForm_cancelPendingStatus").val();
			//TODO: remove the line below after the test phase.
			//endBubbleForm_cancelPendingStatus = 'Y';
			if(endBubbleForm_cancelPendingStatus == 'Yes'){
				var minimumPayemntDue = $('input#minimumPayemntDue').val();				
				if(minimumPayemntDue =='0.00'){
					$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
				}
				$('#minimumDueValue').text(minimumPayemntDue);
				$('#cancelPendingFlagModal').css("z-index","99999").modal('show');
				//close popover.
				var popoverData = $('#submitEndBubble').data('popover');
				if (popoverData != undefined) {
					$('#submitEndBubble').popover('hide');
					popoverData.closeOnClick = true;
				}
				return;
			}
			
			//if a FAB account is not created.
			var fabAccountNumber = $("#accountNumber").val();
			if(fabAccountNumber == null || $.trim(fabAccountNumber) == ''){
				$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
				//close popover.
				var popoverData = $('#submitEndBubble').data('popover');
				if (popoverData != undefined) {
					$('#submitEndBubble').popover('hide');
					popoverData.closeOnClick = true;
				}
				return;
			}

			//if the pay plan is Payroll Deduct plan.
			var isPayrollDeductPlan = $("#isPayrollDeductPlan").val();
			if(isPayrollDeductPlan == 'Y'){
				$('#payRollDeductModal').css("z-index","99999").modal('show');
				//close popover.
				var popoverData = $('#submitEndBubble').data('popover');
				if (popoverData != undefined) {
					$('#submitEndBubble').popover('hide');
					popoverData.closeOnClick = true;
				}
				return;
			}
		}

		showLoadingMessage();
		var data = new EndorsementTermKey($("#policyTermsId").val()); 
		
		// if PA or NY Home policy, change URL
		if(isPAHomePolicy(data) || isNYHomePolicy(data)){
			url = document.actionForm.endActionHomeURL.value;
		}
		
		
		else if(action == 'AgentRequest' || action =='CustomerRequest' ||action =='RenewalNotTaken'
			|| action =='RewriteNewPolicy' || action =='UnderwritingReasons' || action =='AllOther'
				||action =='ConditionProperty'){
			url = document.actionForm.endActionhomeCancelURL.value;
		}
		
		
		document.actionForm.txnEffDate.value = $("#endCanEffectiveDateId").val();
		document.actionForm.userAction.value = action;
		document.actionForm.policyNumber.value = data.policyNumber;
		document.actionForm.policyStatus.value = data.policyStatus;
		document.actionForm.term.value = data.term;
		document.actionForm.company.value = data.company;
		document.actionForm.uwCompanyCd.value = data.company;
		document.actionForm.state.value = data.state;
		document.actionForm.lob.value = data.lob;
		document.actionForm.fromDate.value = data.effectiveDate;
		document.actionForm.toDate.value = data.expirationDate;
		document.actionForm.action = url;
		document.actionForm.requestSource.value = "EndorsementBubble";
		document.actionForm.method="POST";
		
		document.actionForm.submit();
	}
}

function isPAHomePolicy(searchRecord){
	if(searchRecord.state == 'PA' && searchRecord.lob == 'HO'){
		return true;
	}else{
		return false;
	}
	
}

function isNYHomePolicy(searchRecord){
	if(searchRecord.state == 'NY' && searchRecord.lob == 'HO'){
		return true;
	}else{
		return false;
	}
	
}

function showLoadingMessage(){
	var loadingImage = "../../aiui/resources/images/loading_icon.gif";		
	$.blockUI({ 
		message: "<img src='" + loadingImage + "'/><br/>Loading...",
		css: { width: '100px', padding: '5px 2px', margin:'0 120px', "z-index": 9999},
		overlayCSS: { "z-index": 9999 }
	});		
}

function EndorsementTermKey(key) {
	var data = key.split(",");
	/*EFF-DATE,EXP-DATE,POLICY-NUMBER,TERM,STATUS,COMPANY,LOB,STATE*/
	this.effectiveDate = data[0];
	this.expirationDate =  data[1];
	this.policyNumber =  data[2];
	this.term =  data[3];
	this.policyStatus = data[4];
	this.company =  data[5];
	this.lob =  data[6];
	this.state =  data[7];
}

function updateLandingBubbleData(firstInsured, policyStatus, policyTerms, term) {
	
	//Insured name
	if(firstInsured != null) {
		$("#namedInsuredDataId").html(firstInsured);
	}
	
	// Policy Status
	if(policyStatus != null) {
		$("#policyStatusLabelId").html("Policy Status: &nbsp;<span style='font-weight: normal;'>"+ policyStatus +"</span>");
		$("#policyStatusId").val(policyStatus);
	}
	
	if(policyTerms != null) {
		// Set Policy Terms
		$("#policyTermsId").empty();
			
		$.each(policyTerms, function(key, value) {
			$("#policyTermsId").append('<option value="' + key + '">' + value + '</option>');
			if( key.indexOf(","+ term +",") > 0) {
				$("#policyTermsId").val(key);
			}
		});
	} else if(policyTerms == '') {
		$("#policyTermsId").empty();
	}
	
	// Transaction effective date
	var effDt = $("#endCanEffectiveDateId");
	if(effDt.val().length == 0){
		var dateLabel = "mm/dd/yyyy";
		$(effDt).val(dateLabel).addClass('watermark');
	}
	
	// Date picker 
	$("#policyTermsId").trigger('chosen:updated'); 
}

function resetLandingBubble() {
	//Empty all the error/warn/info div's before opening bubble
	
	$('#endLBRadioButtonId').hide();     
	$('#endLBDisplayTextForYesRadioButtonId').hide();
	$("#endBubbleDialogBody #inValidDateErrorModalText").text('');
	
	$("#endLBRadioButtonResponseText").text('');
	$("#endLBRadioButtonLabel").text('');	
	
//	$('#submitEndBubble').attr('disabled', 'true');
	$('#submitEndBubble').removeAttr('disabled');
	
	$("#endBubbleForm_outOfSequenceInd").val('No');
	$("#endBubbleForm_driverCountExceedInd").val('No');
	$("#endBubbleForm_backDatedInd").val('No');
	$("#endBubbleForm_mrbStatusPendingInd").val('No');
	$("#endBubbleForm_unidentifiedDriverExists").val('No');
	$("#endBubbleForm_cancelPendingStatus").val('No');
	$("#endBubbleForm_currentPolicyStatus").val('No');
	$("#endBubbleForm_hasAntiqueVehicles").val('No');
	$("#endBubbleForm_mrbTransactionPending").val('No');
	$("#ossBackDatedFlag").val("No");
	$("#oosSecondTime").val("No");	
	$("#backDatedSecondTime").val("No");
	
	//check if mega menu if visible, if it is hide.
	var popoverData = $('#submitEndBubble').data('popover');
	if (popoverData != undefined) {
		$('#submitEndBubble').popover('hide');
		popoverData.closeOnClick = true;
	}
}

function showEndorsementLandingBubble(policyNumber, term, company, state) {
	if (typeof company === 'undefined') {company = "";}
	if (typeof state === 'undefined') {state = "";}

	resetLandingBubble();

	// reset endorsement effective date field
	var dateLabel = "mm/dd/yyyy";
	$('#endCanEffectiveDateId').val(dateLabel).addClass('watermark');
	
	var url = document.actionForm.endBubbleURL.value;
	var FORM_CSRF_TOKEN = document.actionForm.FORM_CSRF_TOKEN.value;

	url = url.replace("{policyNumber}", policyNumber); 
	url = url.replace("{term}", term); 
	url = addRequestParam(url, "company", company);
	url = addRequestParam(url, "state", state);
	url = addRequestParam(url, "FORM_CSRF_TOKEN", FORM_CSRF_TOKEN);
	url = addRequestParam(url, "_uid", new Date().getTime());

	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json',
		},
		url : url,
		type : 'GET',
		cache: false,
		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},

		success : function(data) {
			//alert (data);
			if(data !=null || data !=undefined) {
				var strJSON = JSON.stringify(data).replaceAll("[", "").replaceAll("]", "");
				if(strJSON.length > 0){
					// First Insured & Second Insured (if any)
					var firstInsured = formatApplicantName(capitalizeFirstChar(data.firstName1), 
							capitalizeFirstChar(data.lastName1), capitalizeFirstChar(data.middleName1), " ");
					
					updateLandingBubbleData(firstInsured, data.policyStatus, data.policyTerms, data.term);
					updateAccountNumber(data.accountNumber);
					updateMinimumPayemntDue(data.minimumPayemntDue);
					updateIsPayrollDeductPlan(data.isPayrollDeductPlan);
					updatePolicyForm(data.policyForm);
				    
				}
			}
		},

		error : function(data) {
			$("#endBubbleDialogBody").html("ERROR:"+ data);
		},

		complete : function() {
			$.unblockUI();
			$("#endBubbleDialog").modal('show');
		}

	});
	
}

function formatApplicantName(firstName, lastName, middleName, separator) {
	var name = firstName;
	if(middleName){
		name = name + separator + middleName;
	}
	return  name + separator + lastName;
}

function showMegaMenuPopover(e){
	var megaMenuId;
	var data = new EndorsementTermKey($("#policyTermsId").val()); 
	//console.log("data is " + JSON.stringify(data));
	
	if($("#endBubbleForm_currentPolicyStatus").val() =='Cancel'){
		$("#cancelPolicyLinkId").attr("disabled","disabled") ;
		$("#cancelPolicyWithMailingAddLinkId").attr("disabled","disabled") ;
	}
	//
	
	
	if(isPAHomePolicy(data) || isNYHomePolicy(data)){
		megaMenuId = 'megaMenuDialogHome';
	}else{
		megaMenuId = 'megaMenuDialog';
	}
	
    if($('input#endBubbleForm_policyForm').val() == 'HO4'){
		
		$("#megaMenuDialogRenters").show();
		$("#megaMenuDialogOwners").hide();
	}else if($('input#endBubbleForm_policyForm').val() == 'HO3' || $('input#endBubbleForm_policyForm').val() == 'HO6'){
		$("#megaMenuDialogOwners").show();
		$("#megaMenuDialogRenters").hide();
	}
	
	// generates endorsement mega menu popover
	$('#submitEndBubble').popover({ 
		html: true,
		title: '',
		content: function() {
			return $('#' + megaMenuId).html();
		}
	});
  
	$("#submitEndBubble").data('popover').tip().css("z-index", 1060);
	$('#submitEndBubble').popover('show');
	
	//e.stopPropagation();
}

function checkTransactionEffectiveDateRange(transactionEffectiveDate, effectiveDate, expiryDate) {	
	var transTime = new Date(transactionEffectiveDate).getTime();
	var effectiveTime = new Date(effectiveDate).getTime();
	var expirationTime = new Date(expiryDate).getTime();
	
	if((transTime == effectiveTime || transTime > effectiveTime) &&
			(transTime < expirationTime)){
		return true;
	}
	else{
		return false;
	}
}

function validateDate(transactionEffectiveDate) {	
	var currVal = transactionEffectiveDate;
    if(currVal == '')
        return false;    
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern);    
    if (dtArray == null) 
        return false;    
    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[1];
    dtDay= dtArray[3];
    dtYear = dtArray[5];        
    
    if (dtMonth < 1 || dtMonth > 12) 
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
                return false;
    }
    
    return true;
}

function updateMinimumPayemntDue(minimumPayemntDue){
	if(minimumPayemntDue != null) {
		$('input#minimumPayemntDue').val(minimumPayemntDue);
	}
}

function updateAccountNumber(accountNumber){
	if(accountNumber != null) {
		$('input#accountNumber').val(accountNumber);		
	}
}

function updateIsPayrollDeductPlan(isPayrollDeductPlan){
	if(isPayrollDeductPlan != null) {
		$('input#isPayrollDeductPlan').val(isPayrollDeductPlan);
	}
}

function updatePolicyForm(policyForm){
	if(policyForm != null) {
	$('input#endBubbleForm_policyForm').val(policyForm);
	}
}

//TD 37735 
function validateEndtDate(effDate){
	validateEndtEffDate (effDate, "endtEffDateCol");
}

function validateEndtEffDate(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidEndtEffDate('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRowAdSearch[rowType], '');
}


function isValidEndtEffDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var name = $(elementId).val();
	var errorMessageID = '';
	
	if(name==null || name == 'Optional'){ 
		 errorMessageID = '';
	} else {
		if(!isValidPolicyEffectiveDate(name, elementId)){
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}
	}
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}


function isValidPolicyEffectiveDate(dt, elm){
	if(dt == "") {
		return false;
	}else{
		// value entered remove watermark
		$(elm).removeClass("watermark");
	}
	
	var dtDate = new Date(dt);
	var valid = true;
	
	if(dtDate == "Invalid Date") valid=false;
	if(!isValidDatDateFormat(dt)) valid=false;
	if(dtDate.toDateString() == "NaN") valid=false;
	if(dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100) valid=false;
	
	return valid;
}

function isValidDatDateFormat(dateString){
	// First check for the pattern
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;
	if (!validformat.test(dateString)){  
		$("#endBubbleDialogBody #inValidDateErrorModalText").text('Please enter a valid effective date in mm/dd/yyyy format.');
		$('#submitEndBubble').attr('disabled', 'true');	
		return false;
	}
    
	// Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);
    
    // Check the ranges of month and year
    if(year < 1900 || year > 2100 || month == 0 || month > 12){
    	return false;
    }      
    
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
   
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
    
};

function showClearInlineErrorMsgsWindow(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgs(name,strElementID, strErrorMsgID, strErrorRow);
}

/**TD 47017 vmaddiwar - This variables are already declared in globalSearch.js, overriding those causing other issues so commented from here.
 * Additional fields related endtEffDateCol have been shifted to globalsearch.js. 
 */
/*var fieldIdToModelErrorRowAdSearch = {		
		"endtEffDateCol":"endBubbleForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"endtEffectiveDate_error\"></td></tr>"
};

var errorMessageJSON = {		
		"endtEffectiveDate.browser.inLine.InvalidDate":"Please enter a valid policy effective date in mm/dd/yyyy format."		
};*/