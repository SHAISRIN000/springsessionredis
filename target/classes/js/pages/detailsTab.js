jQuery(document).ready(function() {
	
	//destroy selectBox drop down plugin?
	//$("SELECT").selectBoxIt('destroy');
/*	
	var tabindex = 1;  
	$('input,select').each(function() {   
		if (this.type != "hidden") {        
			var $input = $(this);  
			$input.attr("tabindex", tabindex);
			tabindex++; 
		}   
	});*/
	
	//START- Fix for Defect# 50907 - Changing certain rate bearing fields in AI does allow to re-rate 
	var currentmotorclubmemdate = $("#motorClubMembershipDate").val();
	var currentOEDate = $('#priorCarrierPolicyEfftDate').val();	
	//END- Fix for Defect# 50907 - Changing certain rate bearing fields in AI does allow to re-rate 
	//getCoCorpId again from the latest info after leaving the ClientTab
	//and store to a local variable
	if(!isEndorsement() && $('#salesProgramOverrideInd').val() != 'Yes' && $('#sourceOfBusinessCode').val() == 'EXIST_AGY' ){
		if($('#stateCd').val() =='MA'){
    		performSalesProgramSearch('salesProgramCode', true);
    	}
	}else if($('#salesProgramOverrideInd').val() == 'Yes' && $('#stateCd').val() =='MA'){
		if($('#salesProgramCodeId').val() == 'BK_ROLL'){
			$('#salesProgramCode').find('option[value=RN_ACC_REV]').remove();
			$('#salesProgramCode').find('option[value=PREF_BK_RL]').remove();
			$('#salesProgramCode').trigger("chosen:updated");
		}else if($('#salesProgramCodeId').val() == 'RN_ACC_REV'){
			$('#salesProgramCode').find('option[value=BK_ROLL]').remove();
			$('#salesProgramCode').find('option[value=PREF_BK_RL]').remove();
			$('#salesProgramCode').trigger("chosen:updated");
		}else if($('#salesProgramCodeId').val() == 'PREF_BK_RL'){
			$('#salesProgramCode').find('option[value=BK_ROLL]').remove();
			$('#salesProgramCode').find('option[value=RN_ACC_REV]').remove();
			$('#salesProgramCode').prop('disabled',true);
			$('#salesProgramCode').trigger("chosen:updated");
		}
	}
	
	if($('#salesProgramCodeId').val().length < 1){
		$('.salesProgramCodeInfo').addClass('hidden');
	}else {
		$('.salesProgramCodeInfo').removeClass('hidden');
	}
	
	$(".clsmMaskedValue").bind({'keydown' :function(event){
		clearMaskedValue(this, event);
	}});
	
	$('.maskAccountNum').each(function(){
		if(this.id=='mask_futurePayBankRoutingNumber' && this.value==''){
			$(this).val($('#futurePayBankRoutingNumber').val());
		}
		else if(this.id=='mask_futurePayBankAccountNumber' && this.value==''){
			$(this).val($('#futurePayBankAccountNumber').val());
		}
		else if(this.id=='mask_confirmBankAccountNumber' && this.value==''){
			$(this).val($('#confirmBankAccountNumber').val());
		}
		//recurring payment changes
		else if(this.id=='mask_recurrCardNumber' && this.value==''){
			$(this).val($('#recurrCardNumber').val());
		}
	});
	
	//recurring payment changes
	$('.maskDate').each(function(){
		if(this.id=='mask_recurrCardExpDt' && this.value==''){
			$(this).val($('#recurrCardExpDt').val());
		}
	});
	
	$("#paymentMethodCd1").each(function () {
		$(this).data("previous-value", $(this).val());
    });

	var endBubbleForm_cancelPendingStatus = $("#cancelPendingStatus").val();
	var prevSelectedPaymentMethod = $('#paymentMethodCd1').val();
	
	var polTerm = $('#termDuration').val();
	var pSourceCd= $("#policySourceCd").val();
	initialFormLoadProcessing();
	
	$(document).on("change", "#paymentMethodCd1", function(){
		if (endBubbleForm_cancelPendingStatus == "Yes"){
			var originalValue = $('#paymentMethodCd1').data('previous-value');
			$('#paymentMethodCd1').prop('disabled', true);
			$('#paymentMethodCd1').val(originalValue).trigger("chosen:updated");
			$('#downPaymentMethodCd').prop('disabled', true).trigger("chosen:updated");
			
			var minimumPayemntDue = $('#minimumPayemntDue').val();
			
			if(minimumPayemntDue =='0.00'){
				$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
			} else {
			    $('input#minimumPayemntDue').val(minimumPayemntDue);
			    
				//EN DT UC# 3.0, 4.0
				//if a policy is in the cancel pending state.
				$('#minimumDueValue').text(minimumPayemntDue);
				$('#cancelPendingFlagModal').css("z-index","99999").modal('show');
			}
		}else{
			var currentlySelectedPaymentMethod = $('#paymentMethodCd1').val();
			paymentMethodChanged(prevSelectedPaymentMethod, currentlySelectedPaymentMethod);
			var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
			var  existVal = $("#existingPaymentMethodCd").val();
			if(isShowPendingEFTMessage == 'Yes' && prevSelectedPaymentMethod == 'EDB' && existVal == 'EDB'){
				//show mesg, but already handled in paymentMethodChanged, so leaving it blank if clean happens later
			}else{
				prevSelectedPaymentMethod = currentlySelectedPaymentMethod;	
			}
			
		}
		
		if($('#paymentMethodCd1').val() != 'EDB') {
			$("#downPaymentMethodCd option[value='EQ']").remove();	
		} else {
			if($('#existingPayPlanCD').val() =='EQ') {
				$('#downPaymentMethodCd option:first').after('<option value="EQ">Grandfathered EQ</option>').trigger('chosen:updated');									
			}	
		}
	
		triggerValueChange($('#downPaymentMethodCd'));
		
		var prePaymentPlan = $('#downPaymentMethodCd').val().replace('PP_','');
		var prepaymentMethodCd = $('#existingPaymentMethodCd').val();
		var policyEffDate = $('#policyEffDt').val();
		//var dateArray = policyEffDate.split("/");var day = dateArray[1];
		var day = parseInt($('#paymentWithDrawalDayEFT').val());
		if ((prepaymentMethodCd == $('#paymentMethodCd1').val()) 
				&& ($('#existingPayPlanCD').val().indexOf(prePaymentPlan) >-1)) {
			$('#paymentWithDrawalDay').val($('#existingWithdrawalDay').val()).trigger("chosen:updated");
		}
		else {
			//day =  day.replace(/^0/,""); 
			if (day > 28) {day =1;} 
			if ((day != $('#paymentWithDrawalDay').val())) {
				$('#paymentWithDrawalDay').val(day).trigger("chosen:updated");
				$('#showPaymentDueChange').modal();
				return;
			}
		}
	
	});
	
	var endBubbleForm_cancelPendingStatus = $("#cancelPendingStatus").val();
	if (endBubbleForm_cancelPendingStatus == "Yes"){
		//$('#paymentMethodCd1').prop('disabled', true).trigger("chosen:updated");
		var pMethod= $("#paymentMethodCd1").val();
		if (pMethod == 'EDB'){
			$("#futurePayBankAccountTypeCd").attr("disabled", true).trigger("chosen:updated");
			$("#mask_confirmBankAccountNumber").attr("disabled", true);
			$("#mask_futurePayBankAccountNumber").attr("disabled", true);
			$("#mask_futurePayBankRoutingNumber").attr("disabled", true);
			//$("#paymentWithDrawalDay").attr("disabled", true);
			setInputFieldAsDiabled($("#paymentWithDrawalDay"));
		}else if (pMethod == 'ACC'){
			$("#mask_recurrCardNumber").attr("disabled", true);
			$("#mask_recurrCardExpDt").attr("disabled", true);
			$("#recurrZipCode").attr("disabled", true);
		}
	}

	
//	var selectedPaymentPlan = $('#selectedPaymentPlan').val();
//	$("#downPaymentMethodCd").val(selectedPaymentPlan);
	
	var prevSelected = $('#downPaymentMethodCd').val();
	var isPaymentPlanChanged = false;
	
	//Added newly : 
	$("#downPaymentMethodCd").each(function () {
		$(this).data("previous-value", $(this).val());
		$(this).data("original-value", $(this).val());
    });
	
	$(document).on('click', ".closePayDayChanged", function() {
		
		var originalValue = $('#downPaymentMethodCd').data('original-value');
		var curPayMethod = $('#paymentMethodCd1').val();
		if($("#existingPaymentMethodCd").val() == 'EDB') {
			if(curPayMethod == 'EDB' && originalValue == 'EQ'){
				$('#downPaymentMethodCd').data("original-value", $('#downPaymentMethodCd').val());
			    $('#showSignEFT').modal();				
				return;				
			}	
		}
		else {
			if(($("#existingPaymentMethodCd").val() == 'PPR') && (curPayMethod == 'EDB')) {
			    $('#showSignEFT').modal();				
				return;		
			}
		}
		
		
		return false;
    });
	
	$("#downPaymentMethodCd").change(function(event){
		
		var originalValue = $('#downPaymentMethodCd').data('previous-value');
		
		//var currentlySelected = $('#downPaymentMethodCd').val();
		
		//downPaymentMethodCdChanged(originalValue);
		var allow = isDownPaymentChangeAllowed() ;
				
		//this should Update the original value..
		if(allow == false) {
			$('#downPaymentMethodCd').prop('disabled', true);
			$('#downPaymentMethodCd').val(originalValue).trigger("chosen:updated");
			$('#paymentMethodCd1').prop('disabled', true).trigger("chosen:updated");
		}
		
		//var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
		//if($("#existingPaymentMethodCd").val() == 'EDB') {
			//if(isShowPendingEFTMessage == 'Yes'){
				//$('#downPaymentMethodCd').val(originalValue).trigger("chosen:updated");
				//$('#showPendingEFT').modal();				
				//return;
		//	}
		//}
		
		
		var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
	    var curPayMethod = $('#paymentMethodCd1').val();
		if($("#existingPaymentMethodCd").val() == 'EDB') {
			if(curPayMethod == 'EDB'){
			    if(isShowPendingEFTMessage == 'Yes'){
			    	$('#downPaymentMethodCd').val(originalValue).trigger("chosen:updated");
					$('#showPendingEFT').modal();				
					return;
				}
			}	
		}
		
		
		var prePaymentPlan = $('#downPaymentMethodCd').val().replace('PP_','');
		var prepaymentMethodCd = $('#existingPaymentMethodCd').val();
		var policyEffDate = $('#policyEffDt').val();
		var dateArray = policyEffDate.split("/");var day = dateArray[1];
		
		if ((prepaymentMethodCd == $('#paymentMethodCd1').val()) 
				&& ($('#existingPayPlanCD').val().indexOf(prePaymentPlan) >-1)) {
			$('#paymentWithDrawalDay').val($('#existingWithdrawalDay').val()).trigger("chosen:updated");
			$('#downPaymentMethodCd').data("original-value", $('#downPaymentMethodCd').val());
		}
		else {
			day =  day.replace(/^0/,""); 
			if (day > 28) {day =1;} 
			if ((day != $('#paymentWithDrawalDay').val())) {
				$('#paymentWithDrawalDay').val(day).trigger("chosen:updated");
				$('#showPaymentDueChange').modal();
				return;
			} else {
				var originalValue = $('#downPaymentMethodCd').data('original-value');
				var curPayMethod = $('#paymentMethodCd1').val();
				if($("#existingPaymentMethodCd").val() == 'EDB') {
					if(curPayMethod == 'EDB' && originalValue == 'EQ'){
						$('#downPaymentMethodCd').data("original-value", $('#downPaymentMethodCd').val());
					    $('#showSignEFT').modal();				
						return;				
					}	
				}
				return false;
			}
		}
	});
	
	
	/*if(isPaymentPlanChanged){
		var endBubbleForm_cancelPendingStatus = $("#cancelPendingStatus").val();
		if(true){
			//change the dropdown selected value back to the previously selected.
			$("#downPaymentMethodCd").val(currentlySelectedVlaue).prop('selected',false);
			$("#downPaymentMethodCd").val(prevSelected).prop('selected',true);
		}
	}*/

	
	$("#mask_futurePayBankRoutingNumber").change(function(){
		mask_futurePayBankRoutingNumberChanged();
	});
	
	$("#mask_futurePayBankAccountNumber").change(function(){
		mask_futurePayBankAccountNumberChanged();
	});
	
	$("#mask_confirmBankAccountNumber").change(function(){
		mask_confirmBankAccountNumberChanged();
	});
	

	var pageAlertDivName= 'formTop';
	$('#' + pageAlertDivName).append($('#completeApplicationAlert'));
	$('#completeApplicationAlert').show();
	
	showOrHidePrefillLink();
	
	//ctrl+a -17  65/97
	 errorMessages = jQuery.parseJSON($("#errorMessages").val());
	
	$('#motorClubMembershipDate').inputmask("mm/dd/yyyy");
	$('.clsEffDate').datepicker({
		showOn: "button",buttonImage: "/aiui/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
		
	});
	
	/* Leave space for fixed Complete "so & so" application message */
	if($('#completeApplicationAlert').length == 1) {
		$('#mainContent').css('padding-top', '20px');
	}
	
	$("#activeCurrentPolicyInfo").change(function(){
		hideShowCurrentPolicy();
	});
	
	$("#numYrsContinuousCoverage").change(function() {
		hideOrShowNumYearsInsuredWithCurrentCarrier();
	});

	$("#numYrsInsuredWithCurrentCarrier").change(function() {
		hideOrShowInsuredWithCurrentAgentMoreThan36MosInfo();
	});
	
	$("#noCurrentAutoPolicyReasonCode").change(function() { 		
		hideShowCarrierName();
	});
	
	$("#priorCarrierName").change(function() {	
		hideShowOriginalEffectiveDate();
		//hideShowHomeInsPolicyPurchase_RTC(); //if prior carrier name is changed and if home insurance policy is selected then hide or display checkbox buyHomeInsWithin12MthsInd.
		validateRenewalAccount();
		performSalesProgramSearch('salesProgramCode', true);
	});
	
	$('#salesProgramCode').change(function(event, result) {
		validateSalesProgram();
		validateRenewalAccount();
	});
	
	$('#paymentMethodCd1').bind(getValidationEvent(), function(event, result){		
		validatePaymentMethodCd1(this);
	});
	
	$('#downPaymentMethodCd').bind(getValidationEvent(), function(event, result){		
		validateDownPaymentMethodCd(this);
	});
	
	$('#futurePayBankAccountTypeCd1').bind(getValidationEvent(), function(event, result){	
		showMesgWhenEFTInfoChanged();
		validateFuturePayBankAccountTypeCd1(this);
	});
	
	$("#mask_futurePayBankRoutingNumber").bind({'keyup keydown keypress': function(e) {}});
	$('#mask_futurePayBankRoutingNumber').bind(getValidationEvent(), function(event, result){	
		//showMesgWhenEFTInfoChanged();
		var futurePayBankRoutingNumber = $(this).val();
		var strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';

		if(futurePayBankRoutingNumber.substr(0, 5) == "*****"){ // TODO: replace this temporary fix for 07/07/2014 only.
			futurePayBankRoutingNumber = $('#futurePayBankRoutingNumber').val();
		}		
		
		if (futurePayBankRoutingNumber.length == 0) {
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			//validate('', $(this), 'Yes', 'futurePayBankRoutingNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		else if (futurePayBankRoutingNumber.length < 9 ){
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else if(!$.isNumeric(futurePayBankRoutingNumber)){
			var errorMessageID = 'numeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; 
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		else{
			//validateBindFieldInput_added(this); $('#futurePayBankAccountNumber').val().length != 0 &&
			clearInLineRowError("mask_futurePayBankRoutingNumber", "mask_futurePayBankRoutingNumber", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
			var errorFlag = validateRoutingnumber(futurePayBankRoutingNumber);
			if(!errorFlag){
				var errorMessageID = 'InvalidNumber';
				errorMessageID = strErrorTag + '.' + errorMessageID;
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			}
		}
			
	});
	
	$("#mask_futurePayBankAccountNumber").bind({'keyup keydown keypress': function(e) {}}); //fmtNumber(this,e);
	$('#mask_futurePayBankAccountNumber').bind(getValidationEvent(), function(event, result){		
		//showMesgWhenEFTInfoChanged();
		var futurePayBankAccountNumber = $(this).val();
		var defaultBankAccNumber = $(this).prop("defaultValue");
		
		if(defaultBankAccNumber != futurePayBankAccountNumber){
			$('#isFabVal').val('No');
		}
		
		if(futurePayBankAccountNumber.substr(0, 5) == "*****"){ // TODO: replace this temporary fix for 07/07/2014 only.
			futurePayBankAccountNumber = $('#futurePayBankAccountNumber').val();
		}		
		
		if (futurePayBankAccountNumber.length == 0) {
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			//validate('', strId, 'Yes', 'futurePayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		} else if(futurePayBankAccountNumber.length <= 4 ){
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		} else if('No' == $('#isFabVal').val() && !$.isNumeric(futurePayBankAccountNumber)){
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		else{
			clearInLineRowError("mask_futurePayBankAccountNumber", "mask_futurePayBankAccountNumber", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
			//validateBindFieldInput_added(this);
			if ($('#confirmBankAccountNumber').val().length != 0){
				if (futurePayBankAccountNumber !=$('#confirmBankAccountNumber').val()) {
					var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
					var errorMessageID = 'match';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					var strId = "mask_confirmBankAccountNumber"; 
					showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				}
			}
		}
	});

	$("#mask_confirmBankAccountNumber").bind({'keyup keydown keypress': function(e) {}});//fmtNumber(this,e);
	//$('#mask_confirmBankAccountNumber').bind(getValidationEvent(), function(event, result){
	$('#mask_confirmBankAccountNumber').bind('blur validateInput', function(event, result){	
		//showMesgWhenEFTInfoChanged();
		var confirmBankAccountNumber = $(this).val();
		var defaultBankAccConfirmNumber = $(this).prop("defaultValue");
		
		if(defaultBankAccConfirmNumber != confirmBankAccountNumber){
			$('#isFabVal').val('No');
		}
		
		if(confirmBankAccountNumber.substr(0, 5) == "*****"){ // TODO: replace this temporary fix for 07/07/2014 only.
			confirmBankAccountNumber = $('#confirmBankAccountNumber').val();
		}		
		
		if (confirmBankAccountNumber.length == 0 || confirmBankAccountNumber==null) {
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			//validate('', strId, 'Yes', 'confirmBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		else if (confirmBankAccountNumber.length <= 4 ){
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else if('No' == $('#isFabVal').val() && !$.isNumeric(confirmBankAccountNumber)){
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		else{
			clearInLineRowError("mask_confirmBankAccountNumber", "mask_confirmBankAccountNumber", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
			//validateBindFieldInput_added(this);
			if ($('#futurePayBankAccountNumber').val().length != 0){
				if (confirmBankAccountNumber !=$('#futurePayBankAccountNumber').val()) {
					var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
					var errorMessageID = 'match';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					var strId = this.id; 
					showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				}
			}
		}
	});

	/** Recurring Payment changes **/
	$("#mask_recurrCardNumber").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);updateCardNumberLength(this,e);}});	
	$("#mask_recurrCardExpDt").bind({'keyup keydown keypress': function(e) {fmtDate(this,e);}});
	
	$(".clsZipPlusFour ,.clsZip").bind({'keyup keypress': function(event) {
		//	var key = event.which || event.keyCode; 
			if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
	        var regex = new RegExp(/[^0-9]/g);
	        var containsNonNumeric = this.value.match(regex);
	        if (containsNonNumeric)
	            this.value = this.value.replace(regex, '');
		}});
	
	$("#payrollDeductGroupNumber").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);}});
	
	$("#sourceOfBusinessCode").change(function(){
		hideShowSourceOfBusiness();
	});

		
	$("#residenceInsInd").change(function(){
		hideShowResidence();
	});

	$("#residenceInsTypeCd").change(function(e){
		hideShowInsuranceCarrier();
		handleRentersEligibiityInsurancePolicy(this.value,e);
	});
	
	$("#buyHomeInsWithin12MthsInd").change(function(){
		hideShowFuturePolicyPurchase();
	});
	
	$("#residenceInsInd").change(function(){
		$('#residenceInsCode').val( $("#residenceInsInd").val() );
		hideShowHomeInsPolicyPurchase_RIC();
	});
	
	$("#residenceInsTypeCd").change(function(){
		$('#residenceInsTypeCode').val( $("#residenceInsTypeCd").val() );
		hideShowHomeInsPolicyPurchase_RTC();
		//checkRentersEligibility();
	});
	
	$("#insuranceCarrier").change(function(e){
		$('#insuranceCarrierCode').val( $("#insuranceCarrier").val() );
		hideShowHomeInsPolicyPurchase_Carrier();
		handleRentersEligibiityInsuranceCarrier(this.value,e);
	});

	$("#motorClubInd").change(function(){
		//Fix for Defect# 39793 - rating- motorclub was unchecked/then checked reeceived messaging do not need to re-rate- Focus Testing
		resetPremiumForAll();
		
		hideShowMotorClub();
	      
	});	
	
	
	//START- Fix for Defect# 50907 - Changing certain rate bearing fields in AI does allow to re-rate 
	$('#motorClubMembershipDate').bind("blur", function(){						
			if(this.value != currentmotorclubmemdate){				
				resetPremiumForAll();
				currentmotorclubmemdate = this.value;				
			}		
	});
	$('#priorCarrierPolicyEfftDate').bind("blur", function(){
		if(this.value != currentOEDate){				
			resetPremiumForAll();
			currentOEDate = this.value;				
		}		
    });
	
	$("#priorCarrierPolicyTerm").change(function(){
		var salesProgram = $('#salesProgramCodeId').val();
		if (salesProgram == 'PREF_BK_RL') {
			resetPremiumForAll();
		}
	});	
	
	$("#priorCarrierPremiumAmount").change(function(){
		var salesProgram = $('#salesProgramCodeId').val();
		if (salesProgram == 'PREF_BK_RL') {
			resetPremiumForAll();
		}
	});	
	//END - Fix for Defect# 50907 -Changing certain rate bearing fields in AI does allow to re-rate
	
	
	hideShowFields();	
	

	$('#priorCarrier_BILimits_Yes').change(function(){
		$('#priorCarrier_BILimits_hidden').val($(this).val());
	});
	
	
	$('#fixDiscalimerSelection').click(function(){
		$('#eligibilityErrorsModal').modal('hide');
		
	});
	
	$('select.clsAffinity').change(function(){		
        resetPremium( $('#ratedInd').val(),$('#premAmt').val());
	});
	
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
	    }
	 
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
		 

	//Mask Account fields
/*		 
	$(".maskAccountNum").bind({
		blur: function() {
			  var elm = this.id;
			  var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			  maskAccountNum(this,hdnField);
*/			  	
			  /* if (elm =="mask_cardNumber"){
				   	if ($.trim(this.value) != "") {
				  		clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
				  	}
			  	else {
			  		var strErrorTag = 'cardNumber.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			  	}
			   }	*/
/*			}	
	});	
*/
		 
	//Mask Account fields
	$(".maskAccountNum").bind({
		blur: function() {
			  var elm = this.id;
			  var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			  maskAccountNum(this,hdnField);
			  $("#"+elm).addClass("masked");
			  if(elm == "mask_futurePayBankRoutingNumber" || elm == "mask_downPayBankRoutingtNumber")	{
				  //validateRoutingnumber(this);
			  }
			   if (elm =="mask_cardNumber"){
				   	if ($.trim(this.value) != "") {
				   		clearInLineRowError (elm,elm,fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
				  	}
			  	else {
			  		var strErrorTag = 'cardNumber.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			  	}
			   }	
			   
			   //Recurring card changes
			   if (elm =="mask_recurrCardNumber"){
				   	if ($.trim(this.value) != "") {
				  		clearInLineRowError (elm,elm,fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
				  	}
			  	else {
			  		var strErrorTag = 'mask_recurrCardNumber.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			   }			  
			   clearRecurringFields(elm);
			}	
			   $("#"+elm).removeClass('preRequired');
		}
	});	
	
	//recurring card changes
	$(".maskDate").bind({
		blur: function() {
			var elm = this.id;
			var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			var elmVal = this.value;
				
			//TD#74920 - Credit Card Expiration Date - Formatting error
				//Recurring Card changes
				if (elm =="mask_recurrCardExpDt"){
	
					if ($.trim(this.value) != "") {
						clearInLineRowError (elm,elm,fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
					}
					else {
						var strErrorTag = 'mask_recurrCardExpDt.browser.inLine';
						var errorMessageID = 'required';
						errorMessageID = strErrorTag + '.' + errorMessageID;
						showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
					}					
					clearRecurringFields(elm);
				}	
	

											if (elmVal.length <= 7 && elmVal.length > 1) {

												var cardExpirationArray = elmVal.split('/');
												
												var cardExpiration = '';

												for (var i = 0; i < cardExpirationArray.length; i++) {
													if (i == 0) {
														var month = cardExpirationArray[0];
														
														if (1 == month.length) {
															month = "0" + month;
															cardExpiration = month+ '/';
														}else{
														cardExpiration = month+ '/';
														
														   if (2 > month.length) {
															   var strErrorTag = 'mask_recurrCardExpDt.browser.inLine';
																var errorMessageID = 'format';
																errorMessageID = strErrorTag+ '.'+ errorMessageID;
																showClearInLineErrorMsgsWithMap(
																		elm,
																		errorMessageID,
																		fieldIdToModelErrorRow['defaultSingle'],
																		-1,
																		errorMessages,
																		addDeleteCallback);
			}
														}
													}
													if (i == 1) {
														var year = cardExpirationArray[1];
														
														if (4 == year.length) {
															cardExpiration = cardExpiration + year;
															
															if (cardExpiration.length == 7 && elm =="mask_recurrCardExpDt") {
																elmVal = cardExpiration;
																$('#mask_recurrCardExpDt').val(elmVal);
																maskDate(this,hdnField);
													
															}
															
														} else {
															var strErrorTag = 'mask_recurrCardExpDt.browser.inLine';
															var errorMessageID = 'format';
															errorMessageID = strErrorTag+ '.'+ errorMessageID;
															showClearInLineErrorMsgsWithMap(
																	elm,
																	errorMessageID,
																	fieldIdToModelErrorRow['defaultSingle'],
																	-1,
																	errorMessages,
																	addDeleteCallback);
														}
													}
												}

											}
		
			$("#"+elm).removeClass('preRequired');
		}
	});	
	
	
	$("#recurrZipCode").bind({
		blur: function() {
		var elm = "recurrZipCode";
	   	if ($("#recurrZipCode").val() != "") {	   		
	   		//alert($('#' + hdnField).val().length);
	   		if($("#recurrZipCode").val().length != 5 && $("#recurrZipCode").val().length != 9){
	   			var strErrorTag = 'recurrZipCode.browser.inLine';
				var errorMessageID = 'mustbefiveornine';
				errorMessageID = strErrorTag + '.' + errorMessageID;
				//alert(errorMessageID);
				showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	   		}else{
	   			clearInLineRowError (elm,elm,fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	   		}
	  	}
  	else {
  		var strErrorTag = 'recurrZipCode.browser.inLine';
		var errorMessageID = 'required';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
  	}
	   	$("#"+elm).removeClass('preRequired');
	   	clearRecurringFields(elm);
	}	
	
	});

	
	$('#activeCurrentPolicyInfo').bind(getValidationEvent(), function(event, result){validateActiveCurrentPolicyInfo(this);});
	$('#numYrsContinuousCoverage').bind(getValidationEvent(), function(event, result){validatenumYrsContinuousCoverage(this);});
	$('#numYrsInsuredWithCurrentCarrier').bind(getValidationEvent(), function(event, result){validatenumYrsInsuredWithCurrentCarrier(this);});
	$('#insuredWithCurrentAgent36MthsFlag').bind(getValidationEvent(), function(event, result){validateinsuredWithCurrentAgent36MthsFlag(this);});
	$('#noCurrentAutoPolicyReasonCode').bind(getValidationEvent(), function(event, result){validateNoCurrentAutoPolicyReasonCode(this);});
	$('#priorCarrierName').bind(getValidationEvent(), function(event, result){
		validatePriorCarrierName(this);
		validateRenewalAccount();
		});
	$('#priorCarrier_BILimits_Yes').bind(getValidationEvent(), function(event, result){validatePriorCarrierBILimitsYes(this);});
    

	$("#priorCarrierPolicyEfftDate").bind({'keyup': function(e) {fmtDateClient(this,e);}});
	$('#priorCarrierPolicyEfftDate').bind(getValidationEvent(), function(event, result){validatePriorCarrierPolicyEfftDate(this);});	
	
	//60755 - Removed the Required entry of Prior Premium when Prior term is selected (top priority ne/nj)
	//$('#priorCarrierPolicyTerm').bind(getValidationEvent(), function(event, result){validatePriorCarrierPolicyTerm(this);});
	//$('#priorCarrierPremiumAmount').bind(getValidationEvent(), function(event, result){validatePriorCarrierPremiumAmount(this);});
	
	
	$('#residenceInsInd').bind(getValidationEvent(), function(event, result){validateResidenceInsInd(this);});
	$('#residenceInsTypeCd').bind(getValidationEvent(), function(event, result){validateResidenceInsTypeCd(this);});
	$('#insuranceCarrier').bind(getValidationEvent(), function(event, result){validateInsuranceCarrier(this);});
	$('#futureHomeInsType').bind(getValidationEvent(), function(event, result){validateFutureHomeInsType(this);});
	$('#eDocumentsInd').bind(getValidationEvent(), function(event, result){validateEDocumentsInd(this);});
	$('#motorClubName').bind(getValidationEvent(), function(event, result){validateMotorClubName(this);});
	
	$("#motorClubMembershipDate").bind({'keyup': function(e) {fmtDateClient(this,e);}});
	$('#motorClubMembershipDate').bind(getValidationEvent(), function(event, result){validateMotorClubMembershipDate(this);});
	
	$('#rentersEndEligReviewResult').bind(getValidationEvent(), function(event, result){validateAgentReviw(this);});
	
	//40582-details- comapnion info section - not triggering re-rate when anything is checked in that section- focus testing
	$('#chkBoxComm,#chkBoxAuto,#chkBoxPcat,#buyHomeInsWithin12MthsInd,#policyCancelledWithin24MthInd').change(function(e){
		resetRateButton();
	});
	
	// Life Discount
	$('#pruLifePolicyNum').bind("blur", function(event, result){validatePruLifePolicyNumber(this);});
	
	$(".clsNumberInput").bind({'keyup keypress': function(event) {
		var key = event.which || event.keyCode; 
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);     
        if (containsNonNumeric)
            this.value = this.value.replace(regex, '');
	}});
	
	
	/*** tjmcd - tab-specific nav move ***/
	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
		handleSubmit(event);
	});
	
	
	handleDefaultbuyHomeInsWithin12MthsInd();
	
	handleDefaultbuyHomeInsWithin12MthsIndForMobileHome();
	//TD 34113
	handleResidenceInsIndNoSelect();
	
	//48854 - 2.1 Focus Testing Details Tab Promise to Purchase Question hide /s how not working
	hideShowHomeInsPolicyPurchase_Carrier();
	
	//set focus on to first field	
	if ( $('#showPrefillWindow').val() == 'true' ) {
		$("#spanSelAllAgentData").focus();
	} else { 
		//setFocus('activeCurrentPolicyInfo');
	}
	
	if ( checkPrefillItemsAdded() ) {
		 // display fix now fix later if returns from prefill
		 showPrefillAddedItemsEdits();
	 } 
	
	//validateSalesProgram();
	
	showReorderErrorPopups(); 
	
	// Alert:please keep the below statement as last statement.
	// please include your code above this one
	disableOrEnableElementsForReadonlyQuote();
	
/*	if($('#salesProgramCodeId').val().length !=0){
		$('#salesProgramCode').val($('#salesProgramCodeId').val()).trigger('chosen:updated');
		$('#salesProgramCode').prop('disabled',true).trigger("chosen:updated");
	}*/
	
	
	if(pSourceCd =='ENDORSEMENT'){
		var payMethod = $('#paymentMethodCd1').val();
		if(payMethod=='PPR'){		
			if(polTerm == '12'){
								
					$('#downPaymentMethodCd > option').each(function(){				
					    if (this.value == 'PP_12PAY') {			    	
					    	$("#downPaymentMethodCd option[value='PP_12PAY']").remove();
					    	triggerValueChange($('#downPaymentMethodCd'));			    	
					    }				    
					});						
					
			}else if (polTerm == '6'){
					$('#downPaymentMethodCd > option').each(function(){
					    if (this.value == 'PP_6PAY') {			    	
					    	$("#downPaymentMethodCd option[value='PP_6PAY']").remove();
					    	triggerValueChange($('#downPaymentMethodCd'));			    	
					    }							    
					});					
			}
		}
	}
	
	//SP 2015-04-03 Added to show UBI Flag in readonly mode
	if (isEndorsement()) {
		//CT UBI requirement
		if($('#stateCd').val() =='CT'){
			if($('#priorUbiProgramInd').val() == 'Yes'){
				$('#ubiProgramInd').prop('disabled', true).trigger("chosen:updated");
			}else{
				$("#ubiProgramInd option[value='']").remove();
				$("#ubiProgramInd").trigger("chosen:updated");
			}
		}else if ($('#ubiProgramInd').length){
			$('#ubiProgramInd').prop('disabled', true).trigger("chosen:updated");
		}
	} 
	
	hideOrShowNumYearsInsuredWithCurrentCarrier();
	hideOrShowInsuredWithCurrentAgentMoreThan36MosInfo();
	
	//What kind of requirement is this? On click of membership number?
	//What if memebrship is already validated, it is enabling the button again
	//Uncomment if this is really a requirement
	/*$('#aarpMembershipNumber').click(function(){
		$('#validateAARP').removeAttr('disabled');
	});*/
	
	$('#aarpMembershipNumber').bind("blur", function(){
		checkIfAARPNumberChanged(this.value);
	});
	
	//TD 54294 - validate AARP only if not empty
	$('#validateAARP').bind("click", function(){
		if($('#aarpMembershipNumber').val() == ""){
			msg = "AARP membership number is required.";
			$('#aarpValidationMessageID').html(msg).css('color', 'red').addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
			$('#validateAARP').removeAttr('disabled');
			$('#aarpValidationMessageID').show();
		}else{
			checkIfValidAARPMember();
		}
	});
	
	
	//SPORT_ENT
	$('.sprtPkgClass').each(function(){						
	    var elmId = $(this).attr('id');
	    var elmVal = $(this).val()||'';
	    if('Yes' === elmVal){
	    	$('#'+elmId).attr('checked',true);
	    }else{
	    	$('#'+elmId).attr('checked',false);
	    }
	});					
	
	$('.sprtPkgClass').change(function(e){
		var sprtPkg = $(this).attr('id');
		if($('#'+sprtPkg).attr('checked')){
			$('#'+sprtPkg).val('Yes');
		}
		if(!$('#'+sprtPkg).attr('checked')){
			$('#'+sprtPkg).val('No');
		}
	});
	
	// when page first loads, we will show/hide AARP info based on Affinity Group selected
	if($('#stateCd').val() =='MA'){
		var affGroupCD = $('#affinityCD').val();
		//53909 - aarp membership field should not appear on details page in Quote flow
		if(affGroupCD=='MA1' && isApplicationOrEndorsement()){
			$(".aarpMembershipNumberInfo").show();
			if($('#aarpMembershipNumber').val()!=""){
				setAARPMessage($('#aarpMembershipStatus').val());
			}
			//TD 54062 - Details tab of application does not show AARP link when membership card validated
			$('#aarpWebsiteLink').show();
		}else{
			$('#affinityAARPValidationMessageID').hide();
			$(".aarpMembershipNumberInfo").hide();
		}
	}
/*	
	//TD 54110 - App Layer - AARP section not functioning properly, showing membership # validated when no number entered
	var aarpMembershipNumber = $('#aarpMembershipNumber').val();
	if($('#affinityCD').val()=='MA1' && isEndorsement() && aarpMembershipNumber == ""){
		msg = "AARP Member Number is required.";
		$('#aarpValidationMessageID').html(msg).css('color', 'red').addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
		$('#validateAARP').removeAttr('disabled');
	}*/

	
	$('#affinityCD').bind("change", function(){
		if($('#stateCd').val() =='MA'){
			if(isApplicationOrEndorsement() && $('#affinityCD').val() !='MA1'){
				//hide validateAARP button, AARP hyperlink and membership no
				$(".aarpMembershipNumberInfo").hide();
				$("#aarpMembershipNumber_Error").hide();
				$('#validateAARP').hide();
				$('#aarpWebsiteLink').hide();
				$('#aarpValidationMessageID').html('');
				$('#aarpMembershipStatus').val('');
			} 
			//53909 - aarp membership field should not appear on details page in Quote flow
			if($('#affinityCD').val()=='MA1' && isApplicationOrEndorsement()){
				if($('#isMotorCycleAvailable').val()=='Yes'){
					if(isEndorsement()){
						$('#affinityAARPValidationMessageID').html('AARP affinity is not available on policies that include a motorcycle.');
					}else{
						$('#affinityAARPValidationMessageID').html('AARP affinity is not available on quotes that include a motorcycle.');
					}
					$('#affinityAARPValidationMessageID').css('color', 'red');
					$('#affinityAARPValidationMessageID').show();
					$('#affinityCD').val('');
				}else{
					$(".aarpMembershipNumberInfo").show();
					$('#validateAARP').show();
					$('#aarpMembershipNumber').removeClass("inlineError");
					//TD 54062 - Details tab of application does not show AARP link when membership card validated
					$('#aarpWebsiteLink').show();
				}
			}else{
				$('#affinityAARPValidationMessageID').hide();
				$(".aarpMembershipNumberInfo").hide();
				$("#aarpMembershipNumber").val('');
				$('#aarpMembershipStatus').val('');
				$("#aarpMembershipNumber_Error").hide();
			}
			//TD 53917
			var transDate = new Date($('#tranEffDt').val());
			var newAffinityCD = $('#affinityCD').val();
			var oldAffinityCD = $('#affinityCd').val();
			if(isEndorsement() && (Date.parse(transDate) < Date.parse(newDateWithoutTime()))){
				if(newAffinityCD == 'None'){
					//make affinity dd read only
					$('#affinityCD').attr('readonly', 'true');
				} else if(newAffinityCD !=oldAffinityCD){
					//display inline error message
					var strErrorTag = 'affinityCD.server.inLine';
					var errorMessageID = 'agentAffinityChangedBackdated';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					var strId = this.id; //$(this).attr('id');
					//$('#'+strId).val("");
					//alert("Must display the error message now = Adding or changing an affinity selection cannot be processed as a backdated endorsement.");
					showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				}
			}
		}
	});
	
	// AARP Popup Window
	$('#applyAARP').click(function(){
		//var affinityCD = $('#affinityCDId').val();
		//56670 - Sales program disappers on apply AARP
		$('#salesProgramCode').prop('disabled',false).trigger("chosen:updated");
		$('#affinityCD').val('MA1').trigger("chosen:updated");
		//$('#affinityCD').val(affinityCD);
		$('#showAARPMembership').hide();
	});
	
	$('#removeAARP').click(function(){
		$('#affinityCD').val('None').trigger("chosen:updated");
		//$('#affinityCD').val('None');
		if($('#aarpFishingCallStatus').val() == 'Active'){
			//54005 - Sales program disappears when I rate. On removeAARP this value was getting lost.
			$('#salesProgramCode').prop('disabled',false).trigger("chosen:updated");
			aarpCleanData();
		}		
		$('#showAARPMembership').hide();
	});
	
	if($('#stateCd').val() =='MA'){
		populateAARPPopupMsg();
	}
	
	if($('#aarpFishingCall').val() == 'Active'){			
		populateAARPPopupMsg();
	}
	
	$('#aarpModalCloseId').click(function(){		
		$('#affinityCD').val('MA1').trigger("chosen:updated");
		aarpCleanData();
		$('#showAARPMembership').hide();
	});
	
	if(isEndorsement() && $('#affinityCD').val() =='MA1'){	
		$('#aarpMembershipNumberInfo').attr('readonly', 'true');
		//$('#aarpMembershipNumberInfo').prop('readonly', 'true');
	} 
	
	if(isEndorsement() && $('#affinityCD').val() !='MA1'){	
		$('#validateAARP').removeAttr('disabled');
		$('#aarpWebsiteLink').show();
	} 
	
	var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitDetails").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/details';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	// Tejas - remove the Grandfathered Affiinity groups for NB Always.
	// 3.7.2 New Affinity Group- NJ997- Applies to PAL IA Only 
	if(!isEndorsement()) {
			$("#affinityCD option[value='NJ998']").remove();
			$("#affinityCD option[value='NJ999']").remove();
			$("#affinityCD option[value='NJ997']").remove();
			triggerValueChange($('#affinityCD'));
	}
	
	if(isEndorsement()) { 
		if($('#existingAffinityCD').val() !='NJ998' && $('#existingAffinityCD').val() !='NJ999' && $('#existingAffinityCD').val() !='NJ997'){
			$("#affinityCD option[value='NJ998']").remove();
			$("#affinityCD option[value='NJ999']").remove();
			$("#affinityCD option[value='NJ997']").remove();
		}
		if($('#existingAffinityCD').val() =='NJ998'){
			$("#affinityCD option[value='NJ999']").remove();
			$("#affinityCD option[value='NJ997']").remove();
		}
		if($('#existingAffinityCD').val() =='NJ999'){
			$("#affinityCD option[value='NJ998']").remove();
			$("#affinityCD option[value='NJ997']").remove();
		}
		if($('#existingAffinityCD').val() =='NJ997'){
			$("#affinityCD option[value='NJ998']").remove();
			$("#affinityCD option[value='NJ999']").remove();
		}
		
		triggerValueChange($('#affinityCD'));
		
		if($('#existingPayPlanCD').val() =='EQ' && $('#paymentMethodCd1').val() == 'EDB') {
			if($('#existingPayPlanCD').val() == $('#downPaymentMethodCD').val()) {				
				$('#downPaymentMethodCd option:first').after('<option value="EQ" selected>Grandfathered EQ</option>').trigger('chosen:updated');
				$('#downPaymentMethodCd').data("original-value", "EQ");
			} else {				
				$('#downPaymentMethodCd option:first').after('<option value="EQ">Grandfathered EQ</option>').trigger('chosen:updated');
			}
		}
	}
	
	// Renters
	var rentersCovgSelected = $('#rentersCvgFlag').val();
	if(isValidValue(rentersCovgSelected) && 'Yes' == rentersCovgSelected && isApplicationOrEndorsement() && !isEndorsement()){
		$('.rentersEligibilityUnit').removeClass('hidden');
	}else{
		$('.rentersEligibilityUnit').addClass('hidden');
		$('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
		var divElm = $('#rentersEndEligReviewResult').attr('id');
		showClearInLineErrorMsgsWithMap(divElm, '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
	
	$(document).on("change","#rentersEndEligReviewResult", function(event){
		if('OMCA' == this.value){
				$('#agentReviewRenterRemove').modal();	
		}else{
			$('#agentRemovesRentersEndorsement').val('');
		}
	});
	
	$(document).on("click", ".agentRemovesRenter", function(event){
		$('#agentRemovesRentersEndorsement').val('Yes');
	});
	
	$(document).on("click", ".rentDismiss,.rentCancel", function(event){
		$('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
		var errorMessageID = 'rentersEndEligReviewResult.browser.inLine.required';
		var divElm = $('#rentersEndEligReviewResult').attr('id');
		showClearInLineErrorMsgsWithMap(divElm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	});
	
	$(document).on("click", ".rentOkContinue", function(event){
		 $('.rentersEligibilityUnit').addClass('hidden');
		 $('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
		 var ratedIndicator =  $('#ratedInd').val();
		 var originalPremAmt = $('#premAmt').val();
	   	 resetPremium(ratedIndicator,originalPremAmt);
	});
	
	// Life Discount
	if(isApplicationOrEndorsement() && $('#isLifeDiscountEnabled').val() == 'true'){
		showHideLifeDiscount();
		$('#chkBoxPruLife').click(function(){
			showHideLifeDiscount();
});
	}
});

function newDateWithoutTime(){
	var currentDate = new Date();	
	currentDate.setHours(00);
	currentDate.setMinutes(00);
	currentDate.setSeconds(00);
	return currentDate;
}

/* validate AARP */
function checkIfValidAARPMember(){
	var aarpNo = $('#aarpMembershipNumber').val();	
	var policyKeyId = $('#policyKeyId').val();
	var mode = "NB";
	if (isEndorsement()) {			
		policyKeyId = $('#policyNum').val();
		mode = "EN";
	}		
	var message;
	blockUser();
	$('#aarpMembershipNumber').removeClass("inlineError");
	$('#pageAlertMessage').hide();
	$.ajax({	        
        url: '/aiui/aarp/validate',
        type: "GET",
        data: "policyKey=" + policyKeyId + "&aarpNumber=" + aarpNo + "&mode=" + mode,
        cache: false,
        success: function(response, textStatus, jqXHR){	 
        	message=response;	        	
        },
        error: function(jqXHR, textStatus, errorThrown){
        	
        },
        complete: function(){	   
        	$.unblockUI();
        	setAARPMessage(message);
        }		
	});
}


//Renters 
function handleRentersEligibiityInsurancePolicy(val,event){
	var rentersCovgSelected = $('#rentersCvgFlag').val();
	if(isValidValue(rentersCovgSelected) && 'Yes' == rentersCovgSelected && !isEndorsement()){
		if(isValidValue(val) && val != 'RENTER'){
			$('#removeRentersEnd').modal();
			if(isApplicationOrEndorsement() && !isEndorsement()){
			$('.rentersEligibilityUnit').addClass('hidden');
			$('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
			$('#rentersCvgFlagExisting').val('No');
			var divElm = $('#rentersEndEligReviewResult').attr('id');
			showClearInLineErrorMsgsWithMap(divElm, '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);

			}
		}else{
			if(isApplicationOrEndorsement() && !isEndorsement()){
				$('#rentersCvgFlagExisting').val('Yes');
				$('.rentersEligibilityUnit').removeClass('hidden');
			}
		}
	}
}

function updateCardNumberLength(elm,e) {
	
	if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))) {
		var elmNumber = elm.value;
		var re = /\D/g;
		elmNumber = elmNumber.replace(re,"");
		if (elmNumber.length == 2) {
			if ( elmNumber.charAt(0)== '3' && (elmNumber.charAt(1) == '4' || elmNumber.charAt(1) == '7')) {
				$(elm).prop('maxLength', 15);
			} else {
				$(elm).prop('maxLength', 16);
			}
		} 
	}
}

function handleRentersEligibiityInsuranceCarrier(val,event){
	var rentersCovgSelected = $('#rentersCvgFlag').val();
	if(isValidValue(rentersCovgSelected) && 'Yes' == rentersCovgSelected && !isEndorsement()){
		var plymouthRockCarrier = ['BH','BHC','HP','MWAC','PAL','PRAC'];
		var residenceInsTypeCd = $('#residenceInsTypeCd').val();//- RENTER
		if(isValidValue(residenceInsTypeCd) && 'RENTER' == residenceInsTypeCd && isValidValue(val) && 
				$.inArray($.trim(val.toUpperCase()),plymouthRockCarrier) != -1){
			$('#removeRentersEnd').modal();
			if(isApplicationOrEndorsement() && !isEndorsement()){
				$('#rentersCvgFlagExisting').val('No');
				$('.rentersEligibilityUnit').addClass('hidden');
				$('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
				var divElm = $('#rentersEndEligReviewResult').attr('id');
				showClearInLineErrorMsgsWithMap(divElm, '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			}
		}else{
			if(isValidValue(residenceInsTypeCd) && 'RENTER' == residenceInsTypeCd && isApplicationOrEndorsement() && !isEndorsement()){
				$('#rentersCvgFlagExisting').val('Yes');
				$('.rentersEligibilityUnit').removeClass('hidden');
			}
		}
	}
}




function isRentersEligibilityQuestionAddressed(){
	var agentReviewedEligibility = $('#rentersEndEligReviewResult').val();
	if(isApplicationOrEndorsement() && !isEndorsement() && 'OMCA' == agentReviewedEligibility){
		return false;
	}
	return true;
}


// var rentPopTarget;
/*** tjmcd - tab-specific nav move ***/
function handleSubmit(event) {
	if (isEndorsement()) {
		checkRentersEligibility(event);
		
		//TD 71181 fix - for cancellation pending we disable this, so enabling this back during submit
		$("#mask_recurrCardNumber").attr("disabled", false);
		$("#mask_recurrCardExpDt").attr("disabled", false);
		$("#recurrZipCode").attr("disabled", false);
	}

	if(isApplicationOrEndorsement() && !isEndorsement()){
		var rentersCovgSelected = $('#rentersCvgFlag').val();
		if(isValidValue(rentersCovgSelected) && 'Yes' == rentersCovgSelected){
			var rentersUpdatedCvgFlag = $('#rentersCvgFlagExisting').val();
			$('#rentersCvgFlag').val(rentersUpdatedCvgFlag);
		}
	}
	
	$('#salesProgramCode').prop('disabled',false).trigger("chosen:updated");
	//SP 2015-04-04 - Added to enable the value so it is propogated normally on submit (as it is diabled on endorsement flow)
	if($('#ubiProgramInd').length){
		$('#ubiProgramInd').prop('disabled', false).trigger("chosen:updated");	
	}	
	
	if(isEndorsement()){ 
		$("#paymentMethodCd1").attr("disabled", false).trigger("chosen:updated");;
		$("#downPaymentMethodCd").attr("disabled", false).trigger("chosen:updated");;
	}
	
	var selectedAffinityText = $.trim($('#affinityCD option:selected').text());	
	
	$('#affinityShortName').val($.trim(selectedAffinityText.substring(0,10)));
	
	//App Form Motor club date log error clean up
	checkInvalidDateFormats("#motorClubMembershipDate");
	
	if(isApplication() && !isEndorsement()){ 
		processDetailsElibilityQuestions(event); 
	} 

	// Life Discount
	if(isApplicationOrEndorsement() && $('#isLifeDiscountEnabled').val() == 'true'){
		checkLifeDiscountField();
}
}


//window.onload=initialFormLoadProcessing;
var errorMessages;
var errorMessageID;

/*** tjmcd - tab-specific nav move
function stopNextOnDetails(errMsgId){
	$('#message1').addClass('hidden');
	$('#message2').addClass('hidden');
	$('#message3').addClass('hidden');
	$('#message4').addClass('hidden');
	$('#message5').addClass('hidden');
	
	$('#'+errMsgId+'').removeClass('hidden');
	$('#myErrModal').modal();
}
**/

var fieldIdToModelErrorRow_added = 
{"defaultSingle":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "defaultMulti":"",
 "pageErrorData.address1":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "zipZip4":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>",
 "cityState":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>"};

//Use Case 3.3.5 
function validateRenewalAccount(){

	var srcBusiness = $('#sourceOfBusinessCode').val() ;
	var salesProgCd = $('#salesProgramCode').val();
	var priorCarrier = $('#priorCarrierName').val();
	var notEligibleCarrier = ['MT_WASH','PRAC','HP','PAL', 'TEACH'];
	//Sales program available only for Existing Agency Customer
	if(srcBusiness !=null && srcBusiness !=undefined && srcBusiness== 'EXIST_AGY'){
	if(priorCarrier !=null && priorCarrier !=undefined && priorCarrier !='' && salesProgCd !=null && salesProgCd !==undefined && (salesProgCd == 'RN_ACC_REV'
		|| salesProgCd == 'PREF_BK_RL' || salesProgCd == 'BK_ROLL' )){
		var notExist = $.inArray(priorCarrier,notEligibleCarrier);
		if(notExist == -1){
			clearInLineRowError("priorCarrierName", "priorCarrierName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		}
		else{
			var priorCarrier = $('#priorCarrierName').attr('id');
			var errorMessageID = 'priorCarrierName.browser.inLine.PC_NAME_INELIGIBLE_RENEWAL';
			//57980
			var priorCarrName = $("#"+priorCarrier+" option:selected").text();
			var mp = {"ABC":priorCarrName};
			showClearInLineErrorMsgsWithMap(priorCarrier, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,mp);
	}
	}
	else
	{
		//	clearInLineRowError("priorCarrierName", "priorCarrierName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}
}

function getDefaultCarrier(){
	var channelCd = $('#channelCd').val();
	var stateCd = $('#stateCd').val();
	if(stateCd.toUpperCase() == 'NJ'){
		if(channelCd.toUpperCase() == 'DIRECT' || channelCd.toUpperCase() == 'CAPTIVE'){
			return 'HP';
		}
		if(channelCd.toUpperCase() == 'IA'){
			return 'PAL';
		}
	}
}


function showMesgWhenEFTInfoChanged(){
	var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
	if($("#existingPaymentMethodCd").val() == 'EDB') {
		if(isShowPendingEFTMessage == 'Yes' ){
			$('#showTwoDaysPriorDueDate').modal();
			return;
		}else{
			$('#showSignEFT').modal();
			return;
		}
	}
}
function initialFormLoadProcessing() {
	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
	
	$("#EDB").hide();
	$("#PDT").hide();
	$("#ACC").hide();
	
	var pMethod= $("#paymentMethodCd1").val();
	var pSourceCd= $("#policySourceCd").val();
	var endorsementUserAction= $("#endorsementUserAction").val();
	var isPayrollDeductPlan = $("#isPayrollDeductPlan").val();
	var isPremiumFinancingPlan = $("#isPremiumFinancingPlan").val();
	var isPayPlanWithoutDiscount = $("#isPayPlanWithoutDiscount").val();
	
	//47415-Prime 2.0 Endts - Details Tab - EN ERROR TC 513, 514, 515 & 516 - Able to rate policy with various missing EFT banking info
	if (pSourceCd == "ENDORSEMENT") {
		//	if (endorsementUserAction != "UpdatePaymentPlan"){
		//		$("#paymentMethodCd").attr("disabled", true);
		//	}
			if (pMethod == 'PPR'){
				$("#ACC").hide();
				$("#EDB").hide();
				$("#PDT").hide();
				//$("#paymentWithDrawalDay").val("");
				$('#futurePayBankAccountTypeCd1').val("").trigger("chosen:updated");
				$("#mask_confirmBankAccountNumber").val("");
				$("#mask_futurePayBankAccountNumber").val("");
				$("#mask_futurePayBankRoutingNumber").val("");
				$("#futurePayBankRoutingNumber").val("");
				$("#futurePayBankAccountNumber").val("");
				$("#confirmBankAccountNumber").val("");
	//			if (endorsementUserAction != "UpdatePaymentPlan"){
				$("#payrollDeductGroupNumber").attr("disabled", true);
				$("#employeeId").attr("disabled", true);
				//recurring payment changes
				$("#mask_recurrCardNumber").val("");
				$("#mask_recurrCardExpDt").val("");
				$("#recurrCardNumber").val("");
				$("#recurrCardExpDt").val("");
				$("#recurrZipCode").val("");
				$("#downPaymentMethodCd option[value='PP_5REC']").remove();	
				$("#downPaymentMethodCd option[value='PP_10REC']").remove();	
				triggerValueChange($('#downPaymentMethodCd'));
			}
			//recurring payment plan changes
			else if (pMethod == 'ACC'){
				$("#ACC").show();
				$("#EDB").hide();
				$("#PDT").hide();
				$("#downPaymentMethodCd").attr("disabled", true);	
				triggerValueChange($('#downPaymentMethodCd'));
			}
			else if (pMethod == 'EDB'){
				$("#EDB").show();
				$("#ACC").hide();
				$("#PDT").hide();
				$("#payrollDeductGroupNumber").val(null);
				$("#employeeId").val(null);		
				//recurring payment changes
				$("#downPaymentMethodCd option[value='PP_5REC']").remove();	
				$("#downPaymentMethodCd option[value='PP_10REC']").remove();	
				triggerValueChange($('#downPaymentMethodCd'));
				setInputFieldAsDiabled($("#paymentWithDrawalDay"));
			};
			var paymentMethodCdElem = $('#paymentMethodCd1');
			if (isPayPlanWithoutDiscount =='Y'){
				paymentMethodCdElem.prop('disabled',true);
				paymentMethodCdElem.trigger("chosen:updated");
    			$('#downPaymentMethodCd').prop('disabled',true);
			};
			if (isPayrollDeductPlan =='Y'){
				$("#ACC").hide();
				$("#EDB").hide();
				$("#PDT").show();
    			emptySelect(paymentMethodCdElem);
    			paymentMethodCdElem.append('<option value="PP_PAYDED">Payroll deduct</option>');
    			paymentMethodCdElem.val('PP_PAYDED');
    			paymentMethodCdElem.prop('disabled',true);
    			paymentMethodCdElem.trigger("chosen:updated");
    		//	$('#payrollDeductGroupNumber').prop('disabled',true);
    		//	$('#employeeId').prop('disabled',true);
			};
			
			if (isPremiumFinancingPlan =='Y'){ 
				$("#ACC").hide();
				$("#EDB").hide();
				$("#PDT").hide();
    			emptySelect(paymentMethodCdElem);
    			paymentMethodCdElem.append('<option value="PP_PREMFIN">Premium Financing</option>');
    			paymentMethodCdElem.val('PP_PREMFIN');
    			paymentMethodCdElem.prop('disabled',true);
    			paymentMethodCdElem.trigger("chosen:updated");   			
    			
			};
	}

}

function mask_futurePayBankRoutingNumberChanged(){
	//EN DT UC# 7.0
//	if ((pOldMethod == 'PPR') && (pMethod == 'EDB')) {
		//check if the following is true: Assuming there are 2 or less days from the payment due date, the user can process the change.
		var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
		var curPayMethod = $('#paymentMethodCd1').val();
		if($("#existingPaymentMethodCd").val() == 'EDB') {
			if(curPayMethod == 'EDB'){
				if(isShowPendingEFTMessage == 'Yes'){
					$('#showTwoDaysPriorDueDate').modal();
					return;
				} else {
					$('#showSignEFT').modal();
				}
			}	
		}
//	}
}

function mask_futurePayBankAccountNumberChanged(){
		//EN DT UC# 7.0
//	if ((pOldMethod == 'PPR') && (pMethod == 'EDB')) {
		//check if the following is true: Assuming there are 2 or less days from the payment due date, the user can process the change.
	    var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
	    var curPayMethod = $('#paymentMethodCd1').val();
		if($("#existingPaymentMethodCd").val() == 'EDB') {
			if(curPayMethod == 'EDB'){
			    if(isShowPendingEFTMessage == 'Yes'){
					$('#showTwoDaysPriorDueDate').modal();
					return;
				} else {
					$('#showSignEFT').modal();
				}
			}	
		}
//	}
}

function mask_confirmBankAccountNumberChanged(){
	//EN DT UC# 7.0
//	if ((pOldMethod == 'PPR') && (pMethod == 'EDB')) {
		//check if the following is true: Assuming there are 2 or less days from the payment due date, the user can process the change.
//		var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
//		var curPayMethod = $('#paymentMethodCd1').val();
//		if($("#existingPaymentMethodCd").val() == 'EDB') {
//			if(curPayMethod == 'EDB'){
//			    if(isShowPendingEFTMessage == 'Yes'){
//					$('#showTwoDaysPriorDueDate').modal();
//					return;
//				} else {
//					$('#showSignEFT').modal();
//				}
//			}	
//		}
//	}
}

function downPaymentMethodCdChanged(prevValue){
	
	   // var currentlySelectedVlaue = $("#downPaymentMethodCd").val();
		var minimumPayemntDue = $('#minimumPayemntDue').val();
		if(minimumPayemntDue =='0.00'){
			$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
		}
	    $('input#minimumPayemntDue').val(minimumPayemntDue);
	    
		//EN DT UC# 3.0, 4.0
		//if a policy is in the cancel pending state.
		var endBubbleForm_cancelPendingStatus = $("#cancelPendingStatus").val();
		if(true){
			$('#minimumDueValue').text(minimumPayemntDue);
			$('#cancelPendingFlagModal').css("z-index","99999").modal('show');

			//change the dropdown selected value back to the previously selected.
			//$("#downPaymentMethodCd").val(prevValue);
//			$("#downPaymentMethodCd").val(currentlySelectedVlaue).prop('selected',false);
//			$("#downPaymentMethodCd").val(prevValue).prop('selected',true);
			return;
		}
		
		//if a FAB account is not created.
		var fabAccountNumber = $("#accountNumber").val();
		if(fabAccountNumber == null || $.trim(fabAccountNumber) == ''){
			$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');

			//change the dropdown selected value back to the previously selected.
			//$("#downPaymentMethodCd").filter(function() {
			//    return $(this).val() == prevValue; 
			//}).prop('selected', true);
			return;
		}
		
		var fabStatusValue = $("#statusValue").val();
		if(fabStatusValue != null && $.trim(fabStatusValue) == 'System Error'){
			$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
			return;
		}
	
		//if the pay plan is Payroll Deduct plan.
		var isPayrollDeductPlan = $("#isPayrollDeductPlan").val();
		if(isPayrollDeductPlan == 'Y'){
			$('#payRollDeductModal').css("z-index","99999").modal('show');
			
			//change the dropdonw selected value back to the previously selected.
			//$("#downPaymentMethodCd").filter(function() {
			//    return $(this).val() == prevValue; 
			//}).prop('selected', true);
			return;
		}
	
	//EN DT UC# 6.0
	// Change the Billing Method or Payment Plan from EFT to Paper and the payment due date is within 2 days from the date of endorsement.
	//var pmtDueDay = $("#pmtDueDay").val();
//	var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
//	var curPayMethod = $('#paymentMethodCd1').val();
//	if($("#existingPaymentMethodCd").val() == 'EDB') {
//		if(curPayMethod == 'EDB'){
//			if(isShowPendingEFTMessage == 'Yes' ){
//				/*$("#downPaymentMethodCd").filter(function() {
//				    return $(this).val() == prevValue; 
//				}).prop('selected', true);*/
//				
//				$('#showTwoDaysPriorDueDate').modal();
//				return;
//			}else{
//				$('#showSignEFT').modal();
//				return;
//			}
//		}	
//	}	
}

function isDownPaymentChangeAllowed(){
	
	   // var currentlySelectedVlaue = $("#downPaymentMethodCd").val();
		var minimumPayemntDue = $('#minimumPayemntDue').val();
	    $('input#minimumPayemntDue').val(minimumPayemntDue);
	    
		//EN DT UC# 3.0, 4.0
		//if a policy is in the cancel pending state.
		var endBubbleForm_cancelPendingStatus = $("#cancelPendingStatus").val();
		
		if(endBubbleForm_cancelPendingStatus == 'Yes'){
			$('#minimumDueValue').text(minimumPayemntDue);
			$('#cancelPendingFlagModal').css("z-index","99999").modal('show');

			return false;
		}
		
		//if a FAB account is not created.
		var fabAccountNumber = $("#accountNumber").val();
		if(fabAccountNumber == null || $.trim(fabAccountNumber) == ''){
			$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
			return true;
		}
		
		var fabStatusValue = $("#statusValue").val();
		if(fabStatusValue != null && $.trim(fabStatusValue) == 'System Error'){
			$('#fabAccountNotCreatedModal').css("z-index","99999").modal('show');
			return false;
		}
		
	
		//if the pay plan is Payroll Deduct plan.
		var isPayrollDeductPlan = $("#isPayrollDeductPlan").val();
		if(isPayrollDeductPlan == 'Y'){
			$('#payRollDeductModal').css("z-index","99999").modal('show');
			return true;
		}
	
	//EN DT UC# 6.0
	// Change the Billing Method or Payment Plan from EFT to Paper and the payment due date is within 2 days from the date of endorsement.
	//var pmtDueDay = $("#pmtDueDay").val();
		
//		var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
//		var curPayMethod = $('#paymentMethodCd1').val();
//		if($("#existingPaymentMethodCd").val() == 'EDB') {
//			if(curPayMethod == 'EDB'){
//				if(isShowPendingEFTMessage == 'Yes' ){
//					/*$("#downPaymentMethodCd").filter(function() {
//					    return $(this).val() == prevValue; 
//					}).prop('selected', true);*/
//					
//					$('#showTwoDaysPriorDueDate').modal();
//					return true;
//				}else{
//					$('#showSignEFT').modal();
//					return true;
//				}
//			}	
//		}
		
		return true;
}

/**
 * TD#64707 Agent was able to change the withdrawal day on an EFT policy.
 * Mark the input field as readonly. 
 * This function would be helpful when the field should be disabled but the field value should be part of form submit.  
 * 
 * @param $field input field selector
 * @param value value of the readonly field
 */
function setInputFieldAsDiabled($field, value){
	
	//Set the value only if it's not disabled or null
	if(undefined !== value && null !== value ){
		$field.val(value);
	}
	// Mark the field as readonly
	$field.attr("readonly", true);
	$field.css('background-color' , '#DEDEDE');
	
}
function paymentMethodChanged(pOldMethod, pMethod){
	//$("#EDB").hide();
	$("#PDT").hide();
	$("#ACC").hide();
	
	var paymentWithDrawalDayEFT = $('#paymentWithDrawalDayEFT').val();
	var paymentWithDrawalDayPaper = $('#paymentWithDrawalDayPaper').val();
	var polTerm = $('#termDuration').val();
	
	//Recurring Payment change
	if ((pOldMethod == 'ACC') && (pMethod != 'ACC')) {
		$('#downPaymentMethodCd').val('');
	}
	
	if (pMethod == 'EDB'){

		//EN DT UC# 6.0
		$("#EDB").show();
		$("#mask_futurePayBankRoutingNumber").addClass('preRequired');
		$("#mask_futurePayBankAccountNumber").addClass('preRequired');
		$("#mask_confirmBankAccountNumber").addClass('preRequired');
		$("#futurePayBankAccountTypeCd1").addClass('preRequired').trigger('chosen:styleUpdated');
		
		//Recurring payment change
		$("#downPaymentMethodCd").attr("disabled", false);
		setInputFieldAsDiabled($("#paymentWithDrawalDay"),paymentWithDrawalDayEFT);
		$("#downPaymentMethodCd option[value='PP_5REC']").remove();	
		$("#downPaymentMethodCd option[value='PP_10REC']").remove();	
		triggerValueChange($('#downPaymentMethodCd'));
		
		if ((pOldMethod == 'PPR') && (pMethod == 'EDB')) {
		//$('#paymentWithDrawalDay').val(paymentWithDrawalDayEFT);
			//$("#paymentWithDrawalDay").attr("disabled", true);
			setInputFieldAsDiabled($("#paymentWithDrawalDay"),paymentWithDrawalDayEFT);
			
			if(polTerm == '12'){				
				var payplanFound = 'No';					
				$('#downPaymentMethodCd > option').each(function(){						
				    if (this.value == 'PP_12PAY') {
				    	payplanFound = 'Yes';
				    }			  					    
				});					
				
				if(payplanFound == 'No'){						
					$('#downPaymentMethodCd').append('<option value="PP_12PAY">12 PAY</option>');
					triggerValueChange($('#downPaymentMethodCd'));
				}
			
			}else if(polTerm == '6'){				
				var payplanFound = 'No';					
				$('#downPaymentMethodCd > option').each(function(){						
				    if (this.value == 'PP_6PAY') {
				    	payplanFound = 'Yes';
				    }			  					    
				});					
				
				if(payplanFound == 'No'){						
					$('#downPaymentMethodCd').append('<option value="PP_6PAY">6 PAY</option>');
					triggerValueChange($('#downPaymentMethodCd'));
				}
			
			}

			$('#showSignEFT').modal();
		}
		
		$("#PDT").hide();
		$("#payrollDeductGroupNumber").val(null);
		$("#employeeId").val(null);
		
		//recurring payment changes
		$("#mask_recurrCardNumber").val("");
		$("#mask_recurrCardExpDt").val("");
		$("#recurrCardNumber").val("");
		$("#recurrCardExpDt").val("");
		$("#recurrZipCode").val("");
	}
	//Recurring Payment changes
	else if (pMethod == 'ACC'){
		$("#ACC").show();		
		$("#PDT").hide();
		$("#EDB").hide();
		$("#downPaymentMethodCd").attr("disabled", false);
		$("#mask_recurrCardNumber").addClass('preRequired');
		$("#mask_recurrCardExpDt").addClass('preRequired');
		$("#recurrZipCode").addClass('preRequired');
		
		if(polTerm == '12'){				
			var payplanFound = 'No';					
			$('#downPaymentMethodCd > option').each(function(){						
			    if (this.value == 'PP_10REC') {
			    	$('#downPaymentMethodCd').val('PP_10REC');
			    	payplanFound = 'Yes';
			    }			  					    
			});					
			
			if(payplanFound == 'No'){						
				$('#downPaymentMethodCd').append('<option value="PP_10REC" selected>10 Pay - Automatic Credit Card only</option>');
				
			}
		
		}else if(polTerm == '6'){				
			var payplanFound = 'No';					
			$('#downPaymentMethodCd > option').each(function(){						
			    if (this.value == 'PP_5REC') {
			    	$('#downPaymentMethodCd').val('PP_5REC');
			    	payplanFound = 'Yes';
			    }			  					    
			});					
			
			if(payplanFound == 'No'){						
				$('#downPaymentMethodCd').append('<option value="PP_5REC" selected>5 Pay - Automatic Credit Card only</option>');
			}
		
		}
		clearInLineRowError("downPaymentMethodCd", "downPaymentMethodCd", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("mask_recurrCardNumber", "mask_recurrCardNumber", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("mask_recurrCardExpDt", "mask_recurrCardExpDt", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("recurrZipCode", "recurrZipCode", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		triggerValueChange($('#downPaymentMethodCd'));
		$("#downPaymentMethodCd").attr("disabled", true);		
		
		$('#certifyPaymentInd_ACC').attr('checked',false);
		
	}
	else if (pMethod == 'PPR'){
		
		//Recurring payment change
		$("#downPaymentMethodCd").attr("disabled", false);
		$("#downPaymentMethodCd option[value='PP_5REC']").remove();	
		$("#downPaymentMethodCd option[value='PP_10REC']").remove();	
		triggerValueChange($('#downPaymentMethodCd'));
		
		// Change the Billing Method or Payment Plan from EFT to Paper and the payment due date is within 2 days from the date of endorsement.
		var isShowPendingEFTMessage = $('#isShowPendingEFTMessage').val();
		if($("#existingPaymentMethodCd").val() == 'EDB') {
			if(isShowPendingEFTMessage == 'Yes'){
				$("#paymentMethodCd1").filter(function() {
				    return $(this).val() == pOldMethod; 
				}).prop('selected', true);
				$('#paymentMethodCd1').val(pOldMethod).trigger("chosen:updated");
				$('#showPendingEFT').modal();				
				return;
			}
		}
		
		if(polTerm == '12'){
			$('#downPaymentMethodCd > option').each(function(){						
			    if (this.value == 'PP_12PAY') {
			    	$("#downPaymentMethodCd option[value='PP_12PAY']").remove();
			    	triggerValueChange($('#downPaymentMethodCd'));
			    }			  
			    
			});						
			
		}else if(polTerm == '6'){
			$('#downPaymentMethodCd > option').each(function(){						
			    if (this.value == 'PP_6PAY') {
			    	$("#downPaymentMethodCd option[value='PP_6PAY']").remove();
			    	triggerValueChange($('#downPaymentMethodCd'));
			    }			  
			    
			});						
			
		}
		
		$("#EDB").hide();
		//$("#paymentWithDrawalDay").val("");
		$('#paymentWithDrawalDay').val(paymentWithDrawalDayPaper);
		$('#futurePayBankAccountTypeCd1').val("").trigger("chosen:updated");
		$("#mask_confirmBankAccountNumber").val("");
		$("#mask_futurePayBankAccountNumber").val("");
		$("#mask_futurePayBankRoutingNumber").val("");
		$("#futurePayBankRoutingNumber").val("");
		$("#futurePayBankAccountNumber").val("");
		$("#confirmBankAccountNumber").val("");
		//recurring payment changes
		$("#mask_recurrCardNumber").val("");
		$("#mask_recurrCardExpDt").val("");
		$("#recurrCardNumber").val("");
		$("#recurrCardExpDt").val("");
		$("#recurrZipCode").val("");

	};	
	
}


function validateActiveCurrentPolicyInfo(activeCurrentPolicyInfo){
	validate('',activeCurrentPolicyInfo, 'Yes', 'activeCurrentPolicyInfo.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');	
	
	
	if ($("#activeCurrentPolicyInfo").val() == ""){ 
		clearInLineRowError("numYrsContinuousCoverage", "numYrsContinuousCoverage", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("noCurrentAutoPolicyReasonCode", "noCurrentAutoPolicyReasonCode", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("priorCarrierName", "priorCarrierName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("priorCarrier_BILimits_Yes", "priorCarrier_BILimits_Yes", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	else if ($("#activeCurrentPolicyInfo").val() == "No"){ 		
		if (($("#noCurrentAutoPolicyReasonCode").val() == "") || ($("#noCurrentAutoPolicyReasonCode").val() != "0_31DAYS")){ 
			clearInLineRowError("numYrsContinuousCoverage", "numYrsContinuousCoverage", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
			clearInLineRowError("priorCarrierName", "priorCarrierName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
			clearInLineRowError("priorCarrier_BILimits_Yes", "priorCarrier_BILimits_Yes", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		}
	}
	else if ($("#activeCurrentPolicyInfo").val() == "Yes"){ 
		clearInLineRowError("noCurrentAutoPolicyReasonCode", "noCurrentAutoPolicyReasonCode", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}

}


function validatenumYrsContinuousCoverage(numYrsContinuousCoverage){
	validate('',numYrsContinuousCoverage, 'Yes', 'numYrsContinuousCoverage.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatenumYrsInsuredWithCurrentCarrier(numYrsInsuredWithCurrentCarrier){
	validate('',numYrsInsuredWithCurrentCarrier, 'Yes', 'numYrsInsuredWithCurrentCarrier.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateinsuredWithCurrentAgent36MthsFlag(insuredWithCurrentAgent36MthsFlag){
	validate('',insuredWithCurrentAgent36MthsFlag, 'Yes', 'insuredWithCurrentAgent36MthsFlag.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateNoCurrentAutoPolicyReasonCode(noCurrentAutoPolicyReasonCode){
	validate('',noCurrentAutoPolicyReasonCode, 'Yes', 'noCurrentAutoPolicyReasonCode.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	if (($("#noCurrentAutoPolicyReasonCode").val() == "") || ($("#noCurrentAutoPolicyReasonCode").val() != "0_31DAYS")){ 
		$('#priorCarrierName').val('').trigger('chosen:updated');
		$('#priorCarrier_BILimits_Yes').val('').trigger('chosen:updated');
		clearInLineRowError("priorCarrierName", "priorCarrierName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("priorCarrier_BILimits_Yes", "priorCarrier_BILimits_Yes", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}

}
//TD 34189 fixing
function validatePriorCarrierName(priorCarrierName){
	/*if (!( ($('#priorCarrierName').val() == 'MT_WASH' || 
            $('#priorCarrierName').val() == 'PRAC'    ||
            $('#priorCarrierName').val() == 'HP'      ||
            $('#priorCarrierName').val() == 'PAL'))){           
     clearInLineRowError("priorCarrierPolicyEfftDate", "priorCarrierPolicyEfftDate", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}else{
		validate('',document.getElementById('priorCarrierPolicyEfftDate'), 'Yes', 'priorCarrierPolicyEfftDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}	*/	
	
//	var srcBusiness = $('#sourceOfBusinessCode').val() ;
//	if(srcBusiness == 'EXIST_SPIN'){
		validate('',priorCarrierName, 'Yes', 'priorCarrierName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
//	}else{
//		 clearInLineRowError("priorCarrierPolicyEfftDate", "priorCarrierPolicyEfftDate", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
//	}
	
}

function validatePriorCarrierBILimitsYes(priorCarrier_BILimits_Yes){
	validate('',priorCarrier_BILimits_Yes, 'Yes', 'priorCarrier_BILimits_Yes.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}


function validatePriorCarrierPolicyTerm(priorCarrierPolicyTerm){	
	if ($("#priorCarrierPremiumAmount").val() != ""){ 
		validate('',priorCarrierPolicyTerm, 'Yes', 'priorCarrierPolicyTerm.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}
	//TD 54749
	if($("#priorCarrierPolicyTerm").val().length == 0){
		clearInLineRowError("priorCarrierPremiumAmount", "priorCarrierPremiumAmount", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	if (($("#priorCarrierPremiumAmount").val() == "") && ($("#priorCarrierPolicyTerm").val() == "")){ 
		clearInLineRowError("priorCarrierPolicyTerm", "priorCarrierPolicyTerm", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("priorCarrierPremiumAmount", "priorCarrierPremiumAmount", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}

function validatePriorCarrierPremiumAmount(priorCarrierPremiumAmount){
	if ($("#priorCarrierPolicyTerm").val() != ""){ 
		validate('',priorCarrierPremiumAmount, 'Yes', 'priorCarrierPremiumAmount.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}
	if ($("#priorCarrierPremiumAmount").val() == '0'){ 
		validateTermPremium('',priorCarrierPremiumAmount, 'Yes', 'priorCarrierPremiumAmountZero.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}
	if (($("#priorCarrierPremiumAmount").val() == "") && ($("#priorCarrierPolicyTerm").val() == "")){ 
		clearInLineRowError("priorCarrierPolicyTerm", "priorCarrierPolicyTerm", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("priorCarrierPremiumAmount", "priorCarrierPremiumAmount", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	
}

function validatePriorCarrierPolicyEfftDate(priorCarrierPolicyEfftDate){	
	validateDate('',priorCarrierPolicyEfftDate,'Yes', 'priorCarrierPolicyEfftDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');	
}


function validateResidenceInsInd(residenceInsInd){
	validate('',residenceInsInd, 'Yes', 'residenceInsInd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	
	if ($("#residenceInsInd").val() == ""){ 
		clearInLineRowError("residenceInsTypeCd", "residenceInsTypeCd", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("insuranceCarrier", "insuranceCarrier", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	
}

function validatePaymentMethodCd1(paymentMethodCd1){
	validate('',paymentMethodCd1, 'Yes', 'paymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	
	if ($("#paymentMethodCd1").val() != ""){ 
		clearInLineRowError("paymentMethodCd1", "paymentMethodCd1", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}


function validateDownPaymentMethodCd(downPaymentMethodCd){
	if ($("#statusValue").val() != "System Error"){
		validate('',downPaymentMethodCd, 'Yes', 'downPaymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
		if ($("#downPaymentMethodCd").val() != ""){ 
			clearInLineRowError("downPaymentMethodCd", "downPaymentMethodCd", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		}
	} 
}


function validateFuturePayBankAccountTypeCd1(downPaymentMethodCd){
	validate('',downPaymentMethodCd, 'Yes', 'futurePayBankAccountTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	$("#futurePayBankAccountTypeCd1").removeClass('preRequired').trigger('chosen:styleUpdated');
	if ($("#futurePayBankAccountTypeCd1").val() != ""){ 
		clearInLineRowError("futurePayBankAccountTypeCd1", "futurePayBankAccountTypeCd1", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}

function validateResidenceInsTypeCd(residenceInsTypeCd){
	validate('',residenceInsTypeCd, 'Yes', 'residenceInsTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	if ($("#residenceInsTypeCd").val() == ""){ 
		clearInLineRowError("insuranceCarrier", "insuranceCarrier", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}

function validateInsuranceCarrier(insuranceCarrier){
	validate('',insuranceCarrier, 'Yes', 'insuranceCarrier.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateFutureHomeInsType(futureHomeInsType){
	validate('',futureHomeInsType, 'Yes', 'futureHomeInsType.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateEDocumentsInd(eDocumentsInd){
	validate('',eDocumentsInd, 'Yes', 'eDocumentsInd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateMotorClubName(motorClubName){
	validate('',motorClubName, 'Yes', 'motorClubName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateMotorClubMembershipDate(motorClubMembershipDate){
	validateMCSDate('',motorClubMembershipDate, 'Yes', 'motorClubMembershipDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

// Life Discount
function validatePruLifePolicyNumber(pruLifePolicyNum){
	validate('',pruLifePolicyNum, 'Yes', 'pruLifePolicyNum.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateMCSDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	errorMessageID = isValidMembershipDate(elementId, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
}

function validateAgentReviw(rentersAgentReview){
	var rentId = rentersAgentReview.id;
	var rentVal = $('#'+rentId).val();
	var errorMessageID = '';
	if(!isValidValue(rentVal)){
		errorMessageID = 'rentersEndEligReviewResult.browser.inLine'; 
	}
	validate('',rentersAgentReview, 'Yes', errorMessageID, fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateTermPremium(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
	//errorMessageID = isValid($(elementId).val(), strRequired);
	errorMessageID = 'required';
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	else{
		errorMessageID = '';
	}	
	
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
}



function isValidMembershipDate(elementId, strRequired){
	var strVal = $(elementId).val();
	var msg = '';
	if (strRequired == 'Yes'){
		if ((strVal == null) || (strVal == "")){
			msg = 'required';
		}
		else{
			msg=checkMotorClubMembershipValidRange(elementId);
		}
	}
	else{
		msg ='';
	}
	return msg;
}

//birth date validation
function checkMotorClubMembershipValidRange(elementId){
	var strMsg = '';
	var dateString = $(elementId).val();
	if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
	{
		return 'Invalid';
	}
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10); //1998

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
    // Check the range of the day
    if(day > 0 && day <= monthLength[month - 1]){
    	//return ''
    }
    else{
    		return 'Invalid';
    }
    
    var myDate = new Date(dateString);
    var today = new Date();
    var policyEffDate = $('#policyEffDt').val();
    
    var myPolicyEffDate = new Date(policyEffDate);
    
    if (myDate  > today) {
    	return 'FutureDate';
    }
    
   if ( (myPolicyEffDate-myDate)/(1000*60*60*24) < 60 ) {
	   return 'MCSDateInvalid';
   }
   
   if (myDate.getFullYear() < 1900){
	   return 'PastDate';
   }
    
   return ''; 
 }


function validateDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	errorMessageID = isValidDate(elementId, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
}


function isValidDate(elementId, strRequired){
	var strVal = $(elementId).val();
	var msg = '';
	if (strRequired == 'Yes'){
		if ((strVal == null) || (strVal == "")){
			msg = 'required';
		}
		else{
			msg = checkDateValidity(elementId);
		}
	}
	else{
		msg ='';
	}
	
	return msg;
}


function isGreaterThanPolicyEffectiveDate(someDate){
	 var policyEffDate = $('#policyEffDt').val();
	 var pol_eff_dt = policyEffDate.split('/');
	 var month_pol_eff_date = parseInt(pol_eff_dt[0]);
	 var day_pol_eff_date = parseInt(pol_eff_dt[1]);
	 var year_pol_eff_date = parseInt(pol_eff_dt[2]);
	 
	 var some_dt = someDate.split('/');
	 var month_some_dt = parseInt(some_dt[0]);
	 var day_some_dt = parseInt(some_dt[1]);
	 var year_some_dt = parseInt(some_dt[2]);
	 
	 if(year_some_dt > year_pol_eff_date){
		 return true;
	 }
	 else if(year_some_dt == year_pol_eff_date && month_some_dt> month_pol_eff_date){
		 return true;
	 }
	 else if(year_some_dt == year_pol_eff_date && month_some_dt == month_pol_eff_date && day_some_dt>day_pol_eff_date){
		 return true;
	 }
	 
	 return false;
}


function checkDateValidity(elementId){
	var strEffDate = $(elementId).val();
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;	
	if (!validformat.test(strEffDate))
	{	
		$(elementId).val("");
		return 'Invalid'; 
	}
	else
	{
		var monthfield=strEffDate.split("/")[0];var dayfield=strEffDate.split("/")[1];var yearfield=strEffDate.split("/")[2];
		var dayobj = new Date(yearfield, monthfield-1, dayfield);
		
		var idVal = $(elementId).attr('id');
		if(idVal == 'priorCarrierPolicyEfftDate' || idVal=='motorClubMembershipDate'){
		if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
		{
			$(elementId).val("");
			return 'Invalid';	
			
		}
		
		if(isGreaterThanPolicyEffectiveDate(strEffDate))
		{
			return 'ORIG_EFFT_DATE_LessThan_POLICY_EFFT_DATE';
		}
		else
			{
				return '';
			}
		/*
		var currentDate = new XDate().toString('MM/dd/yyyy');
		var currentDay = currentDate.split("/")[1];var currentMonth = currentDate.split("/")[0];var currentYear = currentDate.split("/")[2];
		if(parseInt(yearfield,10)>parseInt(currentYear,10))
		{	
			return '';
		}
		
		if(parseInt(monthfield,10)>parseInt(currentMonth,10))
		{
			return '';
		}
		
		if(parseInt(dayfield,10)>parseInt(currentDay,10))
		{
			return '';
		}
		*/
	}
	return '';
	}
}


var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>"
	};



function validate(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
		errorMessageID = isValid($(elementId).val(), strRequired);
		//check for prior carrier SRC_BUSINESS = SPIN_OFF
		var elementName = $(elementId).attr('id');
		
		var srcBusiness = $('#sourceOfBusinessCode').val() ;
		if(elementName =='activeCurrentPolicyInfo' && srcBusiness == 'EXIST_SPIN'){
			var activepolicy = $('#activeCurrentPolicyInfo').val();
			if(activepolicy=='No'){
				errorMessageID = 'ACTIVEPOLICY_SHD_NOT_BE_NO_FOR_SPINOFF'; 
			}
		}
		/*if(elementName ==='priorCarrierName' && srcBusiness == 'EXIST_SPIN' && errorMessageID=='required'){
			errorMessageID = 'PC_NAME_SHD_BE_PR_COMP'; 
		}*/
		
		if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}		
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
}

function isValid(strVal, strRequired){
	if (strRequired == 'Yes') 
	{
		if ((strVal == null) || (strVal == ""))
		{
			return 'required';
		}
		else if (strVal.length > 1)
		{
			var regex = /^[A-Za-z0-9_'& ]{1,30}$/;
	
			if(regex.test(strVal))
			{ 
				return '';
			}
			else 
			{ 
				return 'InvalidLength';
			}
		}
		else
		{
			return '';
		}
	}
	else{
		return '';
	}
}


var addDeleteCallback = function(row, addIt) {
}


function validateRequiredAndNotNull(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
		errorMessageID = isRequiredAndNotEmpty($(elementId).val(), strRequired);
		if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}
		
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
	}

function hideShowFields(){

	hideShowCurrentPolicy();
	hideShowSourceOfBusiness();
	hideShowResidence();
	hideShowInsuranceCarrier();
	hideShowMotorClub();
	hideShowFuturePolicyPurchase();
}

function hideShowFuturePolicyPurchase(){
	if($('#buyHomeInsWithin12MthsInd').attr('checked')){
			$('.clsFutureHomeInsTypeCode').removeClass('hidden');
			$('.clsFutureHomeInsTypeText').removeClass('hidden');
	}else{
			$('.clsFutureHomeInsTypeCode').addClass('hidden');
			$('.clsFutureHomeInsTypeText').addClass('hidden');
			triggerValueChange($('#futureHomeInsType').val(''));
			//clear any error messages under futureHomeInsType has
			clearInLineRowError("futureHomeInsType", "futureHomeInsType", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}	
}

function hideShowCarrierName() {
	if( $('#activeCurrentPolicyInfo').val() == 'No' && $('#noCurrentAutoPolicyReasonCode').val() == '0_31DAYS'){
		$('.clsPriorCarrierName').removeClass('hidden');
		$('.clsCurrentCarrier').removeClass('hidden');
	 }else{
		 	$('.clsPriorCarrierName').addClass('hidden');
			$('.clsCurrentCarrier').addClass('hidden');
			//after hiding clear the the values
			$('#priorCarrierName').val("").trigger('chosen:updated');
			$('#priorCarrier_BILimits_Yes').val("").trigger('chosen:updated');	
			$('#priorCarrier_BILimits_hidden').val("");		
	 }
  }
 
function hideShowOriginalEffectiveDate() {
	//48203
	var priorCarrier = $('#priorCarrierName').val();
	var salesProgram = $('#salesProgramCodeId').val();
	var ourCompanies = ['MT_WASH','PRAC','HP','PAL','TEACH'];
			var exist = $.inArray(priorCarrier,ourCompanies);
		if(exist >= 0){
			$('.clspriorCarrirePolicyEfftDate').removeClass('hidden');
			
			var priorCarrierPolicyEfftDate = $('#priorCarrierPolicyEfftDate').attr('id');
			var errorMessageID = 'priorCarrierPolicyEfftDate.browser.inLine.required';
			if($('#priorCarrierPolicyEfftDate').val().length < 9 && $('#firstTimeThru').val() != 'true'){
				showClearInLineErrorMsgsWithMap(priorCarrierPolicyEfftDate, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			}
		}
		else{
			$('.clspriorCarrirePolicyEfftDate').addClass('hidden');
			if (salesProgram != 'PREF_BK_RL') {
				$('#priorCarrierPolicyEfftDate').val("");
				//START- Fix for Defect# 50907 - Changing certain rate bearing fields in AI does allow to re-rate 
				currentOEDate = "";				
				//END- Fix for Defect# 50907 - Changing certain rate bearing fields in AI does allow to re-rate 
			}			
			$('#priorCarrierPolicyEfftDate').addClass('preRequired');
			clearInLineRowError("priorCarrierPolicyEfftDate", "priorCarrierPolicyEfftDate", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
/*	var srcBusiness = $('#sourceOfBusinessCode').val() ;
	
	if(srcBusiness == 'EXIST_SPIN'){
		$('.clspriorCarrirePolicyEfftDate').removeClass('hidden');
	}else{
		$('.clspriorCarrirePolicyEfftDate').addClass('hidden');
		$('#priorCarrierPolicyEfftDate').val('');
	}*/	
	
	
}

/*function hideShowHomeInsPolicyPurchase() {	
	alert( $('#residenceInsCode').val() );
	alert( $('#residenceInsTypeCode').val() );
	alert( $('#insuranceCarrierCode').val() );
	
	
	if(  ( $('#residenceInsCode').val() == 'No'  || 
		  $('#residenceInsTypeCode').val() == 'MOBILE_H' ) ||
			( ( $('#insuranceCarrierCode').val() != 'MT_WASH') &&
			  ( $('#insuranceCarrierCode').val() != 'PRAC' )   &&
			  ( $('#insuranceCarrierCode').val() != 'HP' )     &&
			  ( $('#insuranceCarrierCode').val() != 'TEACH')   &&
			  ( $('#insuranceCarrierCode').val() != 'PAL' )
			)
	  ) {
		  $('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
	   } else {
		 $('.clsBuyHomeInsWithin12Mths').addClass('hidden');
	   }
  }*/

//Hide/Show : will buy checkbox

function hideShowHomeInsPolicyPurchase_Carrier() {
	if(( $('#insuranceCarrierCode').val() != 'MT_WASH' ) &&
	   ( $('#insuranceCarrierCode').val() != 'PRAC' ) &&
	   ( $('#insuranceCarrierCode').val() != 'HP' ) &&
	   ( $('#insuranceCarrierCode').val() != 'TEACH' ) && 
	   ( $('#insuranceCarrierCode').val() != 'PAL' ) &&
	   ( $('#insuranceCarrierCode').val() != 'BH' ) &&
	   ( $('#insuranceCarrierCode').val() != 'MWAC' )
			
	  ) {
		   $('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
	   } else {
			     //$('.clsBuyHomeInsWithin12Mths').addClass('hidden');
		   	    $('#buyHomeInsWithin12MthsInd').attr('checked', false);
		   		hideBuyHomeRelatedFields();
	          }
  }
 
 function hideShowHomeInsPolicyPurchase_RIC() {
	  if($('#residenceInsCode').val() == 'No') {	
			 $('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
		} else {
				 //$('.clsBuyHomeInsWithin12Mths').addClass('hidden');
				$('#buyHomeInsWithin12MthsInd').attr('checked', false);
				hideBuyHomeRelatedFields();
		       }
}
 
 function hideShowHomeInsPolicyPurchase_RTC() {	 
	 if( $('#priorCarrierName').val() != 'PRAC' && ($('#residenceInsTypeCode').val() == 'HOME' || 
				$('#residenceInsTypeCode').val() == 'CONDO' || $('#residenceInsTypeCode').val() == 'RENTER')
				|| $('#residenceInsTypeCode').val() == 'MOBILE_H' ) {//added this line for MOBILE_H TD 34109
			  $('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
		   }
		else {
			 //$('.clsBuyHomeInsWithin12Mths').addClass('hidden');
			$('#buyHomeInsWithin12MthsInd').attr('checked', false);	
			hideBuyHomeRelatedFields();
		   }
}
 
 
// End Hide/Show : will buy checkbox

function hideOrShowNumYearsInsuredWithCurrentCarrier() {
	if(!isEndorsement()) {
	//52231 - Insured with current agent 36 months or more? is not displaying when How long have you been continuously insured with your current carrier?-= less thaan 36 months 
	//51897 - "How long have you been continuously insured with your current carrier?" should only display if  "How long have you been continuously Insured?" = "36 mos. or more".  
		if ($('#numYrsContinuousCoverage').val() == 'GT36MOS') {
			$('.numYearsInsuredWithCurrentCarrierInfo').removeClass('hidden');
		} else {
			$('.numYearsInsuredWithCurrentCarrierInfo').addClass('hidden');
			$('.insuredWithCurrentAgentMoreThan36MosInfo').addClass('hidden');
			$('#numYrsInsuredWithCurrentCarrier').val('').trigger('chosen:updated');
			$('#insuredWithCurrentAgent36MthsFlag').val('').trigger('chosen:updated');
			showClearInLineErrorMsgsWithMap('numYrsInsuredWithCurrentCarrier', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			showClearInLineErrorMsgsWithMap('insuredWithCurrentAgent36MthsFlag', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}	
	}	 	
} 

function hideOrShowInsuredWithCurrentAgentMoreThan36MosInfo() {
	if(!isEndorsement()) {
		if ($('#numYrsInsuredWithCurrentCarrier').val() == '3YRSLESS' || $('#numYrsInsuredWithCurrentCarrier').val() == 'LT36MOS') {			
			$('.insuredWithCurrentAgentMoreThan36MosInfo').removeClass('hidden');
		} else {
			$('.insuredWithCurrentAgentMoreThan36MosInfo').addClass('hidden');
			$('#insuredWithCurrentAgent36MthsFlag').val('').trigger('chosen:updated');
			showClearInLineErrorMsgsWithMap('insuredWithCurrentAgent36MthsFlag', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}	
	}
}
 
function hideShowCurrentPolicy(){	
	if($('#activeCurrentPolicyInfo').val() == 'Yes'){
		$('.activeCurrentPolicyInfo').removeClass('hidden');
		$('.clsCurrentCarrier').removeClass('hidden');
		$('.clsPriorCarrierName').removeClass('hidden');
		$('.nonActiveCurrentPolicyInfo').addClass('hidden');
		//$('.clspriorCarrirePolicyEfftDate').removeClass('hidden');
		//57544 - priorCarrierBILimits is set as N/A when comes from prefill
		if ($('#priorCarrier_BILimits_hidden').val() == 'N/A'){
			$('#priorCarrier_BILimits_hidden').val(($('#priorCarrier_BILimits_Yes').val()));
		}
		
				
		$('#noCurrentAutoPolicyReasonCode').val('').trigger('chosen:updated');
		$('#priorCarrierDiv_BILimits_Yes').removeClass('hidden');
	
		var priorCarrierName = $('#priorCarrierName').val();
		if(priorCarrierName ==null || priorCarrierName == '' || typeof priorCarrierName == undefined){
			//3.1.14 -- Default carrier name field to Plymouth Rock is state = CT & NH
			if($('#sourceOfBusinessCode').val() == 'EXIST_SPIN' && validforNonMA($('#stateCd').val()) && $('#firstTimeThru').val() == 'true'){
				var defaultCarrier = "PRAC";
				$('#priorCarrierName').removeClass('required');
				$('#priorCarrierName').removeClass('inlineError');
				$('#priorCarrierName').removeClass('preRequired');
				$('#priorCarrierName').trigger('chosen:styleUpdated');
				$('#priorCarrierName').val(defaultCarrier).trigger('chosen:updated');
			}
		}
	
		//34189- 01/31 DETAILS - Current Carrier does not default when Source of Business is Spinoff - DTTC 185
		//Default only while landing on the page or when prior carrier not selected
		
		//moved defaulting to SP update. There is an hard edit which should stop user from moving past details.
		var priorCarrierName = $('#priorCarrierName').val();
		if(priorCarrierName ==null || priorCarrierName == '' || typeof priorCarrierName == undefined){/*
			var srcBusiness = $('#sourceOfBusinessCode').val() ;
			if(srcBusiness == 'EXIST_SPIN'){
				var defaultCarrier = getDefaultCarrier();
				//TD 43846
				$('#priorCarrierName').removeClass('required');				
				$('#priorCarrierName').removeClass('inlineError');
				$('#priorCarrierName').removeClass('preRequired');
				$('#priorCarrierName').trigger('chosen:styleUpdated');
				$('#priorCarrierName').val(defaultCarrier).trigger('chosen:updated');
			}
		*/}
	}else {
		//when No this should always be reset to --select --
		//34189- 01/31 DETAILS - Current Carrier does not default when Source of Business is Spinoff - DTTC 185
		//TD 41321 - checking the priorCarrierName- if there is already selected on- not defaulting
		if($('#priorCarrierName').val() != null){
			if($('#priorCarrierName').val().length ==0){
				$('#priorCarrierName').val('').trigger('chosen:updated');
			}
		}
		
		$('#numYrsContinuousCoverage').val('').trigger('chosen:updated');
		
		$('.activeCurrentPolicyInfo').addClass('hidden');
		$('.numYearsInsuredWithCurrentCarrierInfo').addClass('hidden');
		$('#numYrsInsuredWithCurrentCarrier').val('').trigger('chosen:updated');
		$('.insuredWithCurrentAgentMoreThan36MosInfo').addClass('hidden');		
		$('#insuredWithCurrentAgent36MthsFlag').val('').trigger('chosen:updated');
		
		if($('#activeCurrentPolicyInfo').val() == 'No' && $('#noCurrentAutoPolicyReasonCode').val() != '0_31DAYS'){
			$('#priorCarrierName').val('').trigger('chosen:updated');
			$('.clsPriorCarrierName').addClass('hidden');
		}		
		
		$('.clsCurrentCarrier').addClass('hidden');
		
		if($('#activeCurrentPolicyInfo').val() == 'No') {
			$('.nonActiveCurrentPolicyInfo').removeClass('hidden');	
		}
		else {
			$('.nonActiveCurrentPolicyInfo').addClass('hidden');		
		}
			
		//$('#priorCarrierPolicyTerm').val('').trigger('chosen:updated');
		//$('#priorCarrierPremiumAmount').val('');
		//$('#priorCarrierBILimits').val('None').trigger(changeSelectBoxIt);
		//57544 - priorCarrierBILimits is set as N/A when comes from prefill
		if ($('#priorCarrier_BILimits_hidden').val() == 'N/A'){
			$('#priorCarrier_BILimits_hidden').val(($('#priorCarrier_BILimits_Yes').val()));
		}
		
		if($('#activeCurrentPolicyInfo').val() == 'No' && $('#noCurrentAutoPolicyReasonCode').val() != '0_31DAYS'){
			$('#priorCarrier_BILimits_Yes').val('').trigger('chosen:updated');
			$('#priorCarrierDiv_BILimits_Yes').removeClass('hidden');
		}
		
		//$('.priorCarrierPolicyTermInfo').addClass('hidden');
		//$('#priorCarrierPolicyTerm').val('').trigger('chosen:updated');
		$('#numYrsContinuousCoverage').val('').trigger('chosen:updated');
		
		//the below should be commented as mapping should take care during rate.
		//$('#priorCarrier_BILimits_hidden').val('NONE');
		//what this errorMessageId doing?
		//errorMessageID = '';
		//clear all the error rows when No is selected
		if($('#activeCurrentPolicyInfo').val() != 'Yes') {
			var errorMessageID = '';
			var strId = $('#priorCarrierPolicyTerm').attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			var strId = $('#priorCarrierPolicyEfftDate').attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			strId = $('#priorCarrierPremiumAmount').attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			}
		hideShowCarrierName();
	}	
	 
	 //$('.clsBuyHomeInsWithin12Mths').addClass('hidden');
	//48854 - 2.1 Focus Testing Details Tab Promise to Purchase Question hide /s how not working
	// hideBuyHomeRelatedFields();
	hideShowOriginalEffectiveDate();
	//validateSalesProgram();
	var salesProgram = $('#salesProgramCodeId').val();
	if(salesProgram == undefined || salesProgram =='' || salesProgram != 'PREF_BK_RL'){
		$('.priorCarrierPolicyTermInfo').removeClass('hidden');
		$('.priorCarrierPremiumAmtInfo').removeClass('hidden');
	}else{
		$('.priorCarrierPolicyTermInfo').addClass('hidden');
		$('.priorCarrierPremiumAmtInfo').addClass('hidden');
	}
	//51687 Client tab -Preferred Book Roll Current Term Premium  not flooding to details tab
	//As per MA requirements, premium should show up even for preferred book roll
	if($('#activeCurrentPolicyInfo').val()=='Yes' && $('#stateCd').val() =='MA'){
		$('.priorCarrierPolicyTermInfo').removeClass('hidden');
		$('.priorCarrierPremiumAmtInfo').removeClass('hidden');
	}
}

//TD 34109
function hideBuyHomeRelatedFields(){
	$('.clsBuyHomeInsWithin12Mths').addClass('hidden');
	 $('.clsFutureHomeInsTypeText').addClass('hidden');
	 $('.clsFutureHomeInsTypeCode').addClass('hidden');
	//48854 - 2.1 Focus Testing Details Tab Promise to Purchase Question hide /s how not working
	 clearInLineRowError("futureHomeInsType", "futureHomeInsType", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
}

//TD 34109
function handleDefaultbuyHomeInsWithin12MthsInd(){
	if($('#residenceInsInd').val() == 'Yes' &&  
	  ( $('#residenceInsTypeCd').val() == HOMEOWNERS_CD ||
		$('#residenceInsTypeCd').val() == CONDO_CD ||		
		$('#residenceInsTypeCd').val() == RENTERS_CD ) &&
		(
		   ( $('#insuranceCarrierCode').val() != 'MT_WASH' ) &&
		   ( $('#insuranceCarrierCode').val() != 'PRAC' ) &&
		   ( $('#insuranceCarrierCode').val() != 'HP' ) &&
		   ( $('#insuranceCarrierCode').val() != 'TEACH' ) && 
		   ( $('#insuranceCarrierCode').val() != 'PAL' ) &&
		   ( $('#insuranceCarrierCode').val() != 'BH' ) &&
		   ( $('#insuranceCarrierCode').val() != 'MWAC' )
		)
	
	){
		$('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
	} 
}

//TD 34109
function handleDefaultbuyHomeInsWithin12MthsIndForMobileHome(){
	if( $('#residenceInsTypeCd').val() == 'MOBILE_H' ) 
	{
		$('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
		$('#insuranceCarrierInfo').addClass('hidden');
		clearInLineRowError("insuranceCarrier", "insuranceCarrier", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	} 
	
	if(( $('#insuranceCarrierCode').val() == 'MT_WASH' ) ||
	   ( $('#insuranceCarrierCode').val() == 'PRAC' ) ||
	   ( $('#insuranceCarrierCode').val() == 'HP' ) ||
	   ( $('#insuranceCarrierCode').val() == 'TEACH' ) || 
	   ( $('#insuranceCarrierCode').val() == 'PAL' ) ||
	   ( $('#insuranceCarrierCode').val() == 'BH' ) ||
	   ( $('#insuranceCarrierCode').val() == 'MWAC' ))
	{
		 $('.clsFutureHomeInsTypeText').addClass('hidden');
		 $('.clsFutureHomeInsTypeCode').addClass('hidden');
		//48854 - 2.1 Focus Testing Details Tab Promise to Purchase Question hide /s how not working
		// hide error row when this field is hidden
		 clearInLineRowError("futureHomeInsType", "futureHomeInsType", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		
	}
}

function showHideLifeDiscount(){
	if($('#chkBoxPruLife').attr('checked')){
		$('tr#pruLifePolicyNumberRow').removeClass("hidden");
	}else{
		$('tr#pruLifePolicyNumberRow').addClass("hidden");
	}
}

function checkLifeDiscountField(){
	if(!$('#chkBoxPruLife').attr('checked')){
		$('#pruLifePolicyNum').val();
	}
}

function resetRateButton(){
	var isRated =  $('#ratedInd').val();
	var originalPremAmt = $('#premAmt').val();
	resetPremium(isRated,originalPremAmt);
}

//TD 34113
function handleResidenceInsIndNoSelect(){
	if( $('#residenceInsInd').val() == 'No' ){
		var errorMessageID = '';
		$('.clsBuyHomeInsWithin12Mths').removeClass('hidden');
		if($('#buyHomeInsWithin12MthsInd').attr('checked') && $('#firstTimeThru').val() == 'true'){
			$('#futureHomeInsType').addClass('preRequired');
		}
		if($('#buyHomeInsWithin12MthsInd').attr('checked') && ($('#futureHomeInsType').val() !=null && 
															  $('#futureHomeInsType').val().length == 0 )){
			errorMessageID = 'futureHomeInsType.browser.inLine.required';
		}
		var strId = $('#futureHomeInsType').attr('id');
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}

function hideShowSourceOfBusiness(){
	
	if($('#sourceOfBusinessCode').val() == 'EXIST_AGY'){
		$('.salesProgramCodeInfo').removeClass('hidden');
	}else{
		$('.salesProgramCodeInfo').addClass('hidden');
		//$('#salesProgramCode').val('').trigger(changeSelectBoxIt);
		/*$('#salesProgramCodeDisplay').each(function(){
			this.outerHTML =  "<span></span>";
		})*/
	}	
}

function hideShowResidence(){
	
	if($('#residenceInsInd').val() == 'Yes'){
		$('#residenceInsTypeCdInfo').removeClass('hidden');
		//$('#buyHomeInsWithin12Mths').addClass('hidden');
	}else{
		$('#insuranceCarrierInfo').addClass('hidden');
		$('#residenceInsTypeCdInfo').addClass('hidden');
		$('#residenceInsTypeCd').val('').trigger('chosen:updated');
		$('#insuranceCarrier').val('').trigger('chosen:updated');
		//$('#buyHomeInsWithin12Mths').removeClass('hidden');
		// clear error row for insurence carrier once it's hidden
		clearInLineRowError("insuranceCarrier", "insuranceCarrier", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("residenceInsTypeCd", "residenceInsTypeCd", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
  }

function hideShowInsuranceCarrier() {

	if($('#residenceInsTypeCd').val() == HOMEOWNERS_CD ||
	   $('#residenceInsTypeCd').val() == CONDO_CD ||		
	   $('#residenceInsTypeCd').val() == RENTERS_CD)
	{
		$('#insuranceCarrierInfo').removeClass('hidden');
	}else{
		$('#insuranceCarrier').val('').trigger('chosen:updated');		
		$('#insuranceCarrierInfo').addClass('hidden');	
		// clear error row for insurence carrier once it's hidden
		clearInLineRowError("insuranceCarrier", "insuranceCarrier", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}	
}
//insuranceCarrierInfo
function hideShowMotorClub(){

	if($('#motorClubInd').is(':checked') && isApplicationOrEndorsement()){
		// only show if checked and in Application mode (1 == 1)
		$('.motorClubInfo').removeClass('hidden');
	}else{
		$('.motorClubInfo').addClass('hidden');
		$('#motorClubName').val('').trigger('chosen:updated');
		$('#motorClubMembershipDate').val('');
		clearInLineRowError("motorClubMembershipDate", "motorClubMembershipDate", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError("motorClubName", "motorClubName", fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
}

function validatePolicyEffDate(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
	errorMessageID = isValidPolicyEffDate(elementId, strRequired);
	if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
		if(errorMessageID==''){ return true;}else{return false;}
}



function isValidPolicyEffDate(elementId, strRequired){
	var strVal = $(elementId).val();
	var msg = '';
	if (strRequired == 'Yes'){
		if ((strVal == null) || (strVal == "")){
			msg = 'required';
		}
		else{
			msg = checkEffectivePolicyDateValidity(elementId);
		}
	}
	else{
		msg ='';
	}
	
	return msg;
}

function fmtDate(elm,e) { 
	if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))){
		var elmNumber = elm.value;
		var re = /[^\d\/]+/g;

		elmNumber = elmNumber.replace(re,"");
		if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112) 
		{

		} 
		else{
			if(elmNumber.length >= 2){

			}
			$(elm).val(elmNumber);
		}
	}
}

function fmtNumber(elm,e) { 
	var elmNumber = elm.value;
	var re = /\D/g;
	if((elmNumber != "") && (elmNumber.substr(elmNumber.length-4,4) != "****")){
		elmNumber = elmNumber.replace(re,"");
		
		$(elm).val(elmNumber);
	}
}


function fmtDateClient(elm,e) { 
	
	var effDate = elm.value;
	var dateId = elm.id;
	var re = /\D/g;
	var ctrlPressed = false;
	
	if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
	if(e.keyCode == 65 || e.keyCode ==97){
		if(ctrlPressed){
			ctrlPressed=false;
			return;
		}
	}
	if(e.keyCode == 46 || 
    e.keyCode == 8 || 
    e.keyCode == 37 || 
    e.keyCode == 39 || 
    e.keyCode == 13 || 
    e.keyCode == 9 ||
    e.keyCode == 17 ||
    e.keyCode == 65) 
    //|| e.keyCode ==97)//TD 40208 
    {
		if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
		if(ctrlPressed){
			if(e.keyCode == 65 || e.keyCode ==97){
				ctrlPressed=false;
			}
		}
		
	} 
	else{
		ctrlPressed=false;
	if(effDate.length < 11) {

		var  splitDash = effDate.split("/");
		if(splitDash.length==3 && splitDash[0].length<=2 && splitDash[1].length<=2 && splitDash[2].length<=4){
			var start = $(elm).prop("selectionStart");
			var pos = $(elm).getCursorPosition();
			$(elm).val(effDate).caretTo(pos);
	}
		else{
		effDate = effDate.replace("/","").replace(re,"");
		 if(effDate.length >= 2 ){
			if(effDate.substr(2,1) != "/") {
				effDate = effDate.substr(0,2) + "/" + effDate.substr(2);
			}
		}
	
		if(effDate.length >=5){
			if(effDate.substr(5,1) != "/") {
					effDate = effDate.substr(0,5) + "/" + effDate.substr(5);
				
			}
		}
		var start = $('#'+dateId).prop("selectionStart");
	    var pos = $('#'+dateId).getCursorPosition();
	    if(effDate.length ==3 || effDate.length ==6){
	    	pos=pos+1;
	    }
	    $('#'+dateId).val(effDate).caretTo(pos);
	}
	}
	}
}

function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var n = strId.lastIndexOf('_');
    var lastIndx = strId.substring(n + 1);
   
    return lastIndx;
}


function  clearMaskedValue(strElm, e) {
	if(strElm != ""){
		//clear for backspace and delete
		if (e.keyCode == 8 || e.keyCode == 46)
		{
			$(strElm).val("");
			if ((strElm.id.search("mask_") >=0)){
				//clear hidden value also.
				$("#"+strElm.name).val("");	
				//$("#"+strElm.id).removeClass("masked");
			}			
		}
	}
}

/*
function  clearMaskedValue(strElm, e) {
	if((strElm != "") && ($("#"+strElm.id).hasClass("masked"))){
		//clear for backspace and delete
		if (e.keyCode == 8 || e.keyCode == 46)
		{
			$(strElm).val("");
			if ((strElm.id.search("mask_") >=0)){
				//clear hidden value also.
				$("#"+strElm.name).val("");	
				$("#"+strElm.id).removeClass("masked");
			}			
		}
	}
}
*/

function validateRoutingnumber(futurePayBankRoutingNumber){
	/*var flag = true;
	var strErrorTag;
	var s;
	if(selectedElement.id == "mask_futurePayBankRoutingNumber"){
		s = $("#futurePayBankRoutingNumber").val();
		strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';
		}
		else{
			s = $("#downPayBankRoutingtNumber").val();
			strErrorTag = 'downPayBankRoutingtNumber.browser.inLine';
			}*/
		var i, n, t = futurePayBankRoutingNumber;//$('#futurePayBankRoutingNumber').val();
		//t = "";

	/*	for (i = 0; i < s.length; i++) {
			c = parseInt(s.charAt(i), 10);
			if (c >= 0 && c <= 9)
				t = t + c;
		}*/
		n = 0;
		for (i = 0; i < t.length; i += 3) {
			n += parseInt(t.charAt(i),10) * 3
			+  parseInt(t.charAt(i + 1), 10) * 7
			+  parseInt(t.charAt(i + 2), 10);
		}
		/*if (t.length != 9)
		{
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			flag = false;
		}*/
		if (n != 0 && n % 10 == 0){
			return true;
		}
		else
		{
			/*var errorMessageID = 'InvalidNumber';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			if(selectedElement.id == "mask_futurePayBankRoutingNumber")
				$("#futurePayBankRoutingNumber").val('');
			else
				$("#downPayBankRoutingtNumber").val('');
			flag = false;*/
			return false;
		}
		
}

function isBindName(dataType, strVal, strRequired){
	
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
		if (isBindValidName(strVal) == false)
		  return 'InvalidName'; 
	}
	
	return '';
}

function validateSelectedValue_added(name, strRequired, strErrorTag, strErrorRow, index, errorMessageJSON, addDeleteCallback,dataType){
	var errorMessage = '';
	var strfieldvalue;
	strfieldvalue = $(name).val();

	if(strfieldvalue == ""){
		errorMessageID = "required";
	}

	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	showClearInLineErrorMsgsBind(name,name.id, errorMessageID, strErrorRow, index);

}

function validateNameInBindColumn_added(name, strRequired, strErrorTag, strErrorRow, index, errorMessageJSON, addDeleteCallback,dataType){
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
		
	errorMessageID = isBindName(dataType, strfieldvalue, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	showClearInLineErrorMsgsBind(name,name.id, errorMessageID, strErrorRow, index);
}

function showClearInLineErrorMsgsBind_added(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgsBind(name,strElementID, strErrorMsgID, strErrorRow);
}

function showClearInLineErrorRowMsgsBind_added(name,strElementID, strErrorMsgID, strErrorRow){
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
		clearInLineRowErrorBind(strRowName,strElementID, strErrorRow);
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

function clearInLineRowErrorBind_added(rowName,strElementID, strErrorRow){
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

function validateBindFieldInput_added(selectedElement) {
	if (selectedElement.id == "address1")
		validateNameInBindColumn(selectedElement, 'Yes', 'address1.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");	
	else if (selectedElement.id == "address2")
		validateNameInBindColumn(selectedElement, 'No', 'address2.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "zip")
		validateNameInBindColumn(selectedElement, 'Yes', 'zip.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "paymentMethodCd1")
		validateSelectedValue(selectedElement, 'Yes', 'paymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "paymentMethodCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "futurePayBankAccountTypeCd1")
		validateSelectedValue(selectedElement, 'Yes', 'paymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "downPaymentMethodCd")
		validateSelectedValue(selectedElement, 'Yes', 'downPaymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "mask_futurePayBankRoutingNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankRoutingNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_futurePayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_confirmBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'confirmBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "futurePayBankAccountTypeCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankAccountTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "payrollDeductGroupNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'payrollDeductGroupNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "employeeId")
		validateNameInBindColumn(selectedElement, 'Yes', 'employeeId.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "mask_downPayBankRoutingtNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankRoutingtNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_downPayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_confirmDownPayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'confirmDownPayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "downPayBankAccountTypeCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankAccountTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "agentBankName")
		validateNameInBindColumn(selectedElement, 'Yes', 'agentBankName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if(selectedElement.id == "mask_cardCvv")
		validateNameInBindColumn(selectedElement, 'Yes', 'cardCvv.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if(selectedElement.id == "mask_cardNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'cardNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if(selectedElement.id == "mask_cardExpDt")
		validateNameInBindColumn(selectedElement, 'Yes', 'mask_cardExpDt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"date");
	else if(selectedElement.id == "paymentAmount_DC")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_DC.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	else if(selectedElement.id == "paymentAmount_EWC")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_EWC.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	else if(selectedElement.id == "paymentAmount_EWA")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_EWA.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	
}

function validateSalesProgram(){
	var salesProgram = $('#salesProgramCodeId').val();
	var srcOfBusiness = $('#sourceOfBusinessCode').val();
	//48432 --2.1 Focus Testing Details Current Policy Term & Current Policy Premium-Re-opened
	// Sales program default happens from client no chnages from detail make sure it's defaulted correctly from client
	// if undefined or empty or null or Not equal to PREF_BK_RL show Term and Premium amt
	if(salesProgram == undefined || salesProgram =='' || salesProgram != 'PREF_BK_RL'){
		$('.priorCarrierPolicyTermInfo').removeClass('hidden');
		$('.priorCarrierPremiumAmtInfo').removeClass('hidden');
		var activeCurrentPolInfo = $('#activeCurrentPolicyInfo').val();
		if(activeCurrentPolInfo != 'Yes'){
			$('#priorCarrierPolicyTerm').val('').trigger('chosen:updated');
			$('#priorCarrierPremiumAmount').val('');
			$('.priorCarrierPolicyTermInfo').addClass('hidden');
			$('.priorCarrierPremiumAmtInfo').addClass('hidden');
		}
	}
	else{
		//$('#priorCarrierPolicyTerm').val('').trigger('chosen:updated');
		//$('#priorCarrierPremiumAmount').val('');
		$('.priorCarrierPolicyTermInfo').addClass('hidden');
		$('.priorCarrierPremiumAmtInfo').addClass('hidden');
	}
}

function performSalesProgramSearch(selectBoxId, firstTime) {
	var lookupData = {};
	var srcBusiness = $('#sourceOfBusinessCode').val() ;

	if(($('#' +selectBoxId).val() != 'PREF_BK_RL' && $('#salesProgramOverrideInd').val() != 'Yes' && srcBusiness == 'EXIST_AGY') || firstTime == 'override')
	{
				
		var adrPriorCarrier = $('#priorCarrierName option:selected').text();  

		lookupData.agency_Heir_Id = $('#producerHierId').val();
		lookupData.co_Corp_Id = $('#coCorpId').val();
		lookupData.priorCarrier = adrPriorCarrier;
		lookupData.polEfftDate = $('#policyEffectiveDate').val();
		lookupData.stateCd = $('#stateCd').val();
		var jsonData = JSON.stringify(lookupData);


		blockUser();
		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			url: "/aiui/client/adrSalesProgram",
			type: "post",
			dataType: 'json',
			data : jsonData,
			timeout: 3000,
			// callback handler that will be called on success
			success: function(response, textStatus, jqXHR){
				if (response != null){
					$('.salesProgramCodeInfo').removeClass('hidden'); 
					populateSalesProgram(selectBoxId,response);
				}
				else {
					if(selectBoxId = 'salesProgramCode'){
						if($('#stateCd').val() =='MA'){
							$('#salesProgramCode').find('option[value=BK_ROLL]').remove();
							$('#salesProgramCode').find('option[value=RN_ACC_REV]').remove();
							$('#salesProgramCode').find('option[value=PREF_BK_RL]').remove();
							$('#salesProgramCode').prop('disabled',true).val('IND_POL_TR').trigger("chosen:updated");
						}else{
							$('#salesProgramCode').prop('disabled',true).val('IND_POL_TR').trigger("chosen:updated");
						}
					}
				}
			},
			// callback handler that will be called on error
			error: function(jqXHR, textStatus, errorThrown){
				//initializeADRData(null,textStatus);
			},
			complete: function(){
				$.unblockUI();
			}
		});
	}
}

function populateSalesProgram(selectBoxId,response){	
	$('#pref_Book_Ind').val('No');
	if(selectBoxId = 'salesProgramCode'){
		$('#salesProgramCode option').filter(function() { 
			return ($(this).text() == response.name);
		}).prop('selected', true).trigger("chosen:updated");
	}
	if(response.name == 'Preferred Book Roll' && $('#noPrefBookRole').val() == 'true'){
		$('#salesProgramCode').prop('disabled',true).val('IND_POL_TR').trigger("chosen:updated");
	}
	if($('#stateCd').val() =='MA'){
		$('#salesProgramCode').prop('disabled',false);
		$('#salesProgramCode').find('option[value=BK_ROLL]').remove();
		$('#salesProgramCode').find('option[value=RN_ACC_REV]').remove();
		$('#salesProgramCode').find('option[value=PREF_BK_RL]').remove();
		$('#salesProgramAgentDefault').val('IND_POL_TR');
		//remove non access dropdown items for MA agents with Sales Program Agent roles
		//checking for indexOf holds true in case of Preferred Book Roll also 
		if(response.name.indexOf("Book Roll") >=0 && response.name.indexOf("Book Roll") != 10){
			$('#salesProgramCode').append('<option value="BK_ROLL">Book Roll</option>');	
			$('#salesProgramAgentDefault').val('BK_ROLL');			
			$('#salesProgramCode').val('BK_ROLL');
		}else if(response.name.indexOf("Renewal Account Review") >=0){
			$('#salesProgramCode').append('<option value="RN_ACC_REV">Renewal Account Review</option>');	
			$('#salesProgramAgentDefault').val('RN_ACC_REV');	
			$('#salesProgramCode').val('RN_ACC_REV');
		}else if(response.name.indexOf("Preferred Book Roll") >=0 && $('#noPrefBookRole').val() == 'false'){
			$('#salesProgramCode').append('<option value="PREF_BK_RL">Preferred Book Roll</option>');	
			$('#salesProgramAgentDefault').val('PREF_BK_RL');	
			$('#salesProgramCode').val('PREF_BK_RL');
		}else{
			$('#salesProgramAgentDefault').val('IND_POL_TR');
			$('#salesProgramCode').prop('disabled',true);
		}
		$('#salesProgramCode').prop('disabled',true);
		$('#salesProgramCode').trigger('chosen:updated');
		
		
	}
	validateSalesProgram();
}


function populateAARPPopupMsg(){
	var message = $('#aarpFishingCallStatus').val();
	var aarpMsg = "";

	if(message == "Active"){	
		aarpMsg = "We have discovered your insured is eligible for the AARP group.";
	}else if(message == "Expired"){
		aarpMsg = "The customer has an expired AARP membership. You may proceed with an AARP quote but an active AARP membership must be provided prior to issuance.";
	}
	
	if(aarpMsg != ""){
		$('#aarpMsg').html(aarpMsg);
		$('#showAARPMembership').show();
		//$("#showAARPMembership").modal('show');
	}
}

function aarpCleanData(){	
	var policyKeyId = $('#policyKeyId').val();
	$.ajax({
        url: '/aiui/aarp/resetAARPData',
        type: "POST",
        data: "policyKey=" + policyKeyId,
        cache: false,
        success: function(response, textStatus, jqXHR){
        },
        error: function(jqXHR, textStatus, errorThrown){	        	
        },
        complete: function(){
        }		
	});
}

function checkIfAARPNumberChanged(newMemberNumber){
	var currentMemberNumber = $('#aarpMembershipNumber_Current').val();
	if(currentMemberNumber != ""){
		if($.trim(newMemberNumber.toUpperCase()) != $.trim(currentMemberNumber.toUpperCase())){
			// user changed AARP membership number, need to reset status
			$('#aarpValidationMessageID').html('');
			$('#aarpMembershipStatus').val('');
		}
	}
}

function setAARPMessage(message){
	if(message == '0'){
		$('#aarpValidationMessageID').html('Membership number validated');
		$('#aarpValidationMessageID').css('color', 'green');
		$('#validateAARP').attr('disabled', 'true');
		$('#aarpWebsiteLink').hide();
		$("#aarpMembershipNumber_Error").hide();
	} else if((message == 'NF') || (message == '4')){
		$('#aarpValidationMessageID').html('AARP Member Number is not valid.  Please enter a valid number or remove AARP as the affinity.');
		$('#aarpValidationMessageID').css('color', 'red');
		$('#aarpWebsiteLink').show();
		$("#aarpMembershipNumber_Error").hide();
	} else if(message == '5'){
		$('#aarpValidationMessageID').html('AARP membership is recently expired. The customer must have an active AARP'+ 
				' membership to obtain this discount. The customer may renew his membership using the link provided or remove AARP as the affinity.');
		$('#aarpValidationMessageID').css('color', 'red');
		$('#aarpWebsiteLink').show();
		$("#aarpMembershipNumber_Error").hide();
	} else if(message.toUpperCase() == 'ERROR'){
		$('#aarpValidationMessageID').html('We are unable to validate client membership at this time.'+
				' Please try again at a later time and if the issue persists, contact us at 866-353-6292.');
		$('#aarpValidationMessageID').css('color', 'red');
		$('#aarpWebsiteLink').show();
		$("#aarpMembershipNumber_Error").hide();
	}
	$('#aarpMembershipStatus').val(message);
	$('#aarpValidationMessageID').show();	
	
}

function checkRentersEligibility(event) {
	
	if ($('#rentEndrQualInd').val() == "Yes" && $('#residenceInsTypeCd')) {
		
		if ($('#residenceInsInd').val() == 'Yes' && ($('#residenceInsTypeCd').val() != 'RENTER' || isPlymouthGroupCompany())) {
			event.stopPropagation();
			$( "#continueChanges").unbind( "click" );
			$("#continueChanges").click(function(){
				$('#showRentersEndorsement').modal('hide');
				$("#rentEndrQualInd").val("No");
				nextTab('details',event.targetTag);
			});
			$("#undoChanges").unbind( "click" );
			$("#undoChanges").click(function(eventClick){
				$('#showRentersEndorsement').modal('hide');
				resetOriginalValues();
				if (typeof eventClick === 'undefined') {eventClick = jQuery.Event( "click");}
				eventClick.preventDefault ? eventClick.preventDefault() : eventClick.returnValue = false;
			});
			$('#showRentersEndorsement').modal();
		} 
	}
}

function resetOriginalValues() {
	
	currResInsIndVal = $('#residenceInsInd').val();
	originalResInsIndVal = $('#residenceInsInd').data('OriginalValue');
	if (currResInsIndVal != originalResInsIndVal) {
		$('#residenceInsInd').val(originalResInsIndVal);	
		$('#residenceInsInd').trigger("chosen:updated");	
		hideShowResidence();
	}
	
	currResInsTypeVal = $('#residenceInsTypeCd').val();
	originalResInsTypeVal = $('#residenceInsTypeCd').data('OriginalValue');
	if (currResInsTypeVal != originalResInsTypeVal) {
		$('#residenceInsTypeCd').val(originalResInsTypeVal);
		$('#residenceInsTypeCd').trigger("chosen:updated");
	}
	
	currInsCarrierVal = $('#insuranceCarrier').val();
	originalInsCarrierVal = $('#insuranceCarrier').data('OriginalValue');
	if (currInsCarrierVal != originalInsCarrierVal) {
		$('#insuranceCarrier').val(originalInsCarrierVal);
		$('#insuranceCarrierCode').val( $("#insuranceCarrier").val() );
		$('#insuranceCarrier').trigger("chosen:updated");
	}
	
}

function isPlymouthGroupCompany() {
	
	if(( $('#insuranceCarrierCode').val() != 'MT_WASH' ) &&
	   ( $('#insuranceCarrierCode').val() != 'PRAC' ) &&
	   ( $('#insuranceCarrierCode').val() != 'HP' ) &&
	   ( $('#insuranceCarrierCode').val() != 'TEACH' ) && 
	   ( $('#insuranceCarrierCode').val() != 'PAL' ) &&
	   ( $('#insuranceCarrierCode').val() != 'BH' ) &&
	   ( $('#insuranceCarrierCode').val() != 'MWAC' )) {
		return false;
	} else {
		return true;
	}
}

function clearRecurringFields(elm){	
	
	var origRecurrCardNumber = $('#origRecurrCardNumber').val().replaceAll('*','');
	var recurrCardExpDt = $('#recurrCardExpDt').val().replaceAll('*','');
	var recurrZipCode = $('#recurrZipCode').val().replaceAll('*','');	
	var maskrecurrCardNumber = $('#recurrCardNumber').val().replaceAll('*','');

	if(recurrCardExpDt == "" && recurrZipCode == ""){
		$('#mask_recurrCardExpDt').val("");
		$('#recurrZipCode').val("");
		$('#certifyPaymentInd_ACC').attr('checked',false);
	}
	
	if(elm != 'mask_recurrCardNumber'){
		if(origRecurrCardNumber==maskrecurrCardNumber && origRecurrCardNumber.length == 4){
			$('#mask_recurrCardNumber').val("");
		}
	}
}
