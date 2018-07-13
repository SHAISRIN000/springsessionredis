jQuery(document).ready(function() {
	
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
	
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	$('#completeApplicationAlert').hide();
	//creating another page will not identify the context path appropriately
	var ctxP = $('#ctxPath').val();
	var imgPath = window.location.protocol + "//" + window.location.host+ctxP;
	
	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
		handleSubmit(event);
	});
	
	//Disable rate button	
	$("#rate").addClass("disabled");
	$("#rate_temp").addClass("disabled");
	
	// Client-related functionality
	lookupEligibilityGroups();
	if ($('#eligibilityInd').val()) {
		restoreEligibility($('#eligibilityInd').val(), $('#clientInstitutionId').val());
	}
	// Driver-related functionality
	setupDriverScrolling();
	setupDriverCheckboxes();

	// Vehicle-related functionality
	setupVehicleScrolling();
	
	// Coverage-related functionality
	setupCoverageScrolling();
	setupFloodingFields('.floodInput');
	
	$('.clsMembershipDate').inputmask("mm/dd/yyyy");
	$('.clsMembershipDate').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
	});
	
	$('.clsDefnsDrvngCoursDt').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
	});
	
	$('.clsDrvrImprovCoursDt').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
	});
	
	//TD 47091 - first 10 positions of vin on App Layer must be protected
	/*$(".vinInput").bind({'mouseup keyup' : function(even){
		var lastIndex = getIndexOfElementId(this);
		if($('#tempVin_'+lastIndex).val()!=''&& 
				$('#tempVin_'+lastIndex).val().substring(0,10) != $(this).val().substring(0,10)){
			if($(this).val().length>9 ){
				$(this).val($('#tempVin_'+lastIndex).val());
				$(this).css("color","black");
			}
			else{
				$(this).val($('#tempVin_'+lastIndex).val().substring(0,10));
			}
		}
		$('#tempVin_'+lastIndex).val($(this).val());
		return true;
	}});*/

	//55261-
	$(".vinInput").bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^a-zA-Z0-9&]/g);
        var containsNonAlphaNumeric = this.value.match(regex);
        if (containsNonAlphaNumeric) {
        	this.value = this.value.replace(regex, '');
        }

	}});
	
	var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitApplication").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/application';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	//52044 - Vin Field in Application Layer not Protected on Successful RMV call
	$(".vinInput").each(function(){
		var state = $('#policyStateCd').val();
		if(state == 'MA'){
			var vinId = $(this).attr('id');
			if(vinId != null && vinId != undefined && vinId.length>0){
			var vinIdArr = vinId.split('_');
			var index = vinIdArr[1];
			if(index !=null && index != undefined && index.length>0){
				var rmvLookup = $('#rmvLookupInd_'+index).val();
				var dataSrcCd = $('#dataSourceCd_'+index).val();
				//TD 55973 fix - VIN is locked in App for unregistered Vehicle
				var unregisteredVehicleInd =  $('#unregisteredVehicleInd_'+index).val();
				if(unregisteredVehicleInd != 'Yes' && (rmvLookup == 'Yes' || dataSrcCd == 'RMV')){
				$(this).prop('disabled', true);
			}
			}
		}
		}
	});

	$('.altTownsExt').each(function(){
		var garageTownId = $(this).attr('id');
		var pos = garageTownId.split('_');
		var state = $('#garagingState_'+pos[1]).val();
		if(state!='MA' && isValidValue(state) && isValidValue(stateMap[state])){
			$('#garagingAddressData_'+pos[1]+' .garagingAddressSelected .gaTitle' ).text(stateMap[state]);
		}
	});
	
	// Add Vehicle rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#vehicleRowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addVehicleErrorRow(this, headerBody, false);
	});
	
	//TD 54860
	if ($("#stateCd").val() != STATE_NJ) {		
		showOrHideDrvrTableRow('defensiveDrvrCourseDt_Row', 'hide');
	}

	//PA_AUTO
	if ($("#stateCd").val() != STATE_PA) {		
		showOrHideDrvrTableRow('drvrImprvCourseDt_Row', 'hide');
	}
	
	$('input.clsDefDriverCourseChkBox').each(function() {		
		showOrHideDefDriverCourseDt(this, 'load');
	});
	
	//PA_AUTO
	$('input.clsDrvrImprovCourseChkBox').each(function() {
		showOrHideDriverImprovCourseDt(this, 'load');
	});
	
	// Add Driver rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#driverRowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addDriverErrorRow(this, headerBody, false);
	});
	
	// Add Coverages rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#coverageRowHeaderTable  > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addCoveragesErrorRow(this, headerBody, false);
	});
	
	// Add Detals rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#detailsRowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addDetailsErrorRow(this, headerBody, false);
	});
	
	// Add Client rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#clientRowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addClientErrorRow(this, headerBody, false);
	});
	
	//TD 54860
	if ($(".clsDefDriverCourseChkBox:checked").length == 0) {		
		$('.defenseDrvrCourse_Row').addClass('hidden');		
	}
	
	//PA_AUTO
	if ($(".clsDrvrImprovCourseChkBox:checked").length == 0) {		
		$('.drvrImprovCourse_Row').addClass('hidden');		
	}
	
	bindApplicationColumns();
	
	if($('#stateCd').val() == 'NJ'){
		showHideHealthCareProvider('#PRINC_PIP_0', 'load');	
	}
	showHideMotorInfo($('#motorClubInd'), 'load');
	showHideDetailDiscountInfo($('#motorClubInd'),$('#affinityCD'));
	
	// Align the row heights in the row header tables and the main content tables
	alignRows();
	
	//SetTabbingIndex
	
	setTabIndexForAllSections('pageLoad');	
	
	setupTabbingBehaviorDriver();
	
	setupTabbingBehaviorVehicle();
	
	//clearColumnInLineError("#"+fieldId);
/*	var index = getIndexOfElementId("#"+fieldId);
	var strRowName = fieldId.replace("_" + index, "");
	showClearInLineErrorMsgsWithMap(fieldId, '', strRowName+'.browser.inLine',
			index*1, errorMessages, addRemoveVehicleRow);*/
	
	$('#insurableInterestDlg').modal('hide');
	validateInsurableInterest('policyWrapper.');
/*	$('#saveIIAndNew').click(function(){
		var vehIndex = $('#iiVehIndex').val();
		var vehicleleased = $('#vehicleLeasedInd_' + vehIndex).val();
		var typeCd = $("#iiTypeCd").val(); 
		
		var isError = validateFinancialInterest($("#iiZip").val(), $("#iiAddress1").val(), $("#iiCity").val())
		if(isError){
			return;
		}
		
		if(vehicleleased == 'Yes' && typeCd != 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("For leased vehicle, please select 'Leasing Company'");
			 return;
		}else {
			$('div#interestErrormessage').empty();
			saveInsurableInterest(false, true,'policyWrapper.');
		}
	});
	$('#saveIIAndClose').click(function(){
		var vehIndex = $('#iiVehIndex').val();
		var vehicleleased = $('#vehicleLeasedInd_' + vehIndex).val();
		var typeCd =  $("#iiTypeCd").val(); 
		
		var isError = validateFinancialInterest($("#iiZip").val(), $("#iiAddress1").val(), $("#iiCity").val())
		if(isError){
			return;
		}
		
		if(vehicleleased == 'Yes' && typeCd != 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("For leased vehicle, please select 'Leasing Company'");
			 return;
		}else {
			$('div#interestErrormessage').empty();
			saveInsurableInterest(true, false,'policyWrapper.');
		}
		
	});*/
	$('#cancelII').click(function(){
		$('div#interestErrormessage').empty();
		$('div#nameErrormessage').empty();
		$('div#zipErrormessage').empty();
		$('div#addressErrormessage').empty();
		$('div#cityErrormessage').empty();
		$('div#stateErrormessage').empty();
		cancelInsurableInterest();
	});
	$("#leftIIScrollBtn").click(function(){
		scrollIILeft('poicyWrapper.');
	});
	$("#rightIIScrollBtn").click(function(){
		scrollIIRight('poicyWrapper.');
	});
	/*$("#deleteInsurableInterest").click(function(){
		deleteInsurableInterest('application');
	});*/
	
	$("#deleteInsurableInterest").click(function(){
		
		$("#delVehIndex").text($("#iiVehicleId").text());
		$("#delTitleType").text($("#iiTypeCd option:selected").text());
		$("#delTitleName").text($("#iiName1").val());		
		$("#deleteInsurableInterestDlg").modal('show');
	});
	
	$("#deleteInsurableInterestDlg #deleteYes").click(function(){
		deleteInsurableInterest('application');
		$("#deleteInsurableInterestDlg").modal('hide');
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);	
		return;
	});
	
	$("#deleteInsurableInterestDlg #cancelDelete").click(function(){
		$("#deleteInsurableInterestDlg").modal('hide');
		return;
	});
	
	$(".expandCollapseRows").click(function(){
		expandCollapseRows(this.id);
	});

	$(".eligibilityRadio").click(function(){
		expandEligibilityDropdown(this.id);
	});

	$("#clientEligibilityGroupId").change(function () {
		updateEligibilty();
		validateTeachersEligiblityGroup();
	});
	
	$("#clientDistrictTownId").change(function () {
		updateDistrict();
		validateTeachersEligiblityDistrict();
	});

	$("#clientInstitutionNameId").change(function () {
		updateInstitution();
		validateTeachersEligiblityInstitution();
    });
	
	$("#clientEligibilityGroupId").blur(function () {
		validateTeachersEligiblityGroup();
	});

	$("#clientDistrictTownId").blur(function () {
		validateTeachersEligiblityDistrict();
	});

	$("#clientInstitutionNameId").blur(function () {
		validateTeachersEligiblityInstitution();
    });
	
	$(".vehicleLeasedInd").change(function () {
		var lastIndex = getIndexOfElementId(this);
		if($('#ncrCovVeh_'+lastIndex).val()=='Yes' && this.value=='Yes'){
			$('#ncrCovModal').modal('show');	
		}
	});
	
	$('#saveGAAndClose').click(function(){
		saveGaragingAddress(true, false,'policyWrapper.');
	});
	
	$('#cancelGA').click(function(){
		cancelGaragingAddress();
	});
	
	$('#saveErorDlgAndClose').click(function(){
		enableHiddenVars();
		//App Form Motor club date log error clean up
		checkInvalidDateFormats("#motorClubMembershipDate_0");
		$('#errorConfirmDlg').modal('hide');
		blockUser();
		document.aiForm.action = '/aiui/application/saveOnlyApplication/summary?forceSave=true';
		document.aiForm.method="POST";
		document.aiForm.submit();	
	});
	
	$("#savePolicy").click(function(){                       
		//App Form Motor club date log error clean up
		checkInvalidDateFormats("#motorClubMembershipDate_0");
		blockUser();
		document.aiForm.action = '/aiui/application/saveOnlyApplication/application';
		document.aiForm.method="POST";
		document.aiForm.submit();	
	 });
	
	$('#continue').click(function(){
		enableHiddenVars();
		//App Form Motor club date log error clean up
		checkInvalidDateFormats("#motorClubMembershipDate_0");
		if(processAppTeacherElibilityQuestions('', 'continue') && processAppDetailsElibilityQuestions('', 'continue')){
			document.aiForm.rateFlagInd.value = 'Yes';
			updatePriorPremium();
			checkErrorsAndSave();	
		}
	});
	
	$('#cancelErrorDlg').click(function(){
		$('#errorConfirmDlg').modal('hide');
		$.unblockUI();
		setFocusToErrorElement();
	});
	
	$('#cancelApplication').click(function(){
		$('#cancelApplicationModal').modal('show');
	});
	
	$(document).on("click", "#cancelYesApp", function(){
		enableHiddenVars();
		//App Form Motor club date log error clean up
		checkInvalidDateFormats("#motorClubMembershipDate_0");
		$('#cancelApplicationModal').modal('hide');		
		blockUser();		
		revertPremium();
		document.aiForm.policyKeyNum.value = document.aiForm.policyKey.value; 
		document.aiForm.action = '/aiui/application/redirectToSummary/' + encodeURI(document.aiForm.policyKey.value);
		document.aiForm.method="POST";
		document.aiForm.submit();	
	});
	
	$('#saveApplication').click(function(){
		enableHiddenVars();
		//App Form Motor club date log error clean up
		checkInvalidDateFormats("#motorClubMembershipDate_0");
		//TD: 56118 fix
		var state = $('#policyStateCd').val();
		if(state == 'MA'){
			if(($('#affinityCd').val() != "") && ($('#affinityCD').val() == "")) {
				$('#affinityCD').append('<option value="'+ $('#affinityCd').val() +'">Select</option>');
				$('#affinityCD').val($('#affinityCd').val());
			}
		}
		
		if(processAppTeacherElibilityQuestions('', 'save') && processAppDetailsElibilityQuestions('', 'save')){
			blockUser();
			updatePriorPremium();
			document.aiForm.action = '/aiui/application/saveOnlyApplication/summary?forceSave=true';
			document.aiForm.method="POST";
			document.aiForm.submit();	
		}
	});
	
	var driverCount = parseInt($('#driverCount').val());
	if (driverCount > 3) {
		$('#driverScrollPanel').removeClass('hidden');
	} else {
		$('#driverScrollPanel').addClass('hidden');
	}
	
	var vehicleCount = parseInt($('#vehicleCount').val());
	if (vehicleCount > 3) {
		$('#vehicleScrollPanel,#coverageScrollPanel').removeClass('hidden');
	} else {
		$('#vehicleScrollPanel,#coverageScrollPanel').addClass('hidden');
	}
	
	//hide tabs always for application layer
	$('#tabPanel').hide();
	
	//Show Error confirm dlg if error exist
	if($('#hasApplicationErrors').val() == 'Yes'){
		$('#errorConfirmDlg').modal('show');
	}
	
	//do not use hidden for select elements (chosen plugin)
	//setFocus($('#mainContentTable select.tabOrder:not(:disabled,:radio),input.tabOrder:not(:disabled,:radio,:hidden)')[0].id);
	if ($('.eligibilityRadio:checked').attr('id') === 'eligibilityYes') {
		setFocus($('#clientRowHeaderTable select.tabOrder:not(:disabled)')[0].id);
	} else{
		setFocus($('#driverMainContentTable input.tabOrder:not(:disabled)')[0].id);
	}
	
	validateTeachersEligiblityGroup();
	//validateTeachersEligiblityDistrict();
	//validateTeachersEligiblityInstitution();
	
	
	// when page first loads, we will show/hide AARP info based on Affinity Group selected
	if($('#stateCd').val() =='MA'){
		
		/*TD: 56118 fix*/
		if(($('#affinityCd').val() != "") && ($('#affinityCD').val() == "")) {
			showClearInLineErrorMsgsWithMap($('#affinityCD').attr('id'), 'affinityCD.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultSingle'],
					-1, errorMessages, addRemoveDetailsRow);
		}

		if($('#affinityCD').val()=="MA1"){
			showHideAARPFields();
		}else{
			$('.aarpMembershipNumberInfo').addClass('hidden');
			$('#aarpMembershipNumber').val('');
			$('#aarpMembershipStatus').val('');
			$('#aarpValidationMessageID').html("");
			$("#aarpMembershipNumber_Error").hide();
		}
	}

	// Display AARP service message when page loads if needed
	var aarpMemberStatus = $('#aarpMembershipStatus').val();
	var aarpMembershipNumber = $('#aarpMembershipNumber').val();
	
	//TD 54110 - App Layer - AARP section not functioning properly, showing membership # validated when no number entered
	if(aarpMembershipNumber == ""){
		msg = "AARP membership number is required.";
		$('#aarpValidationMessageID').html(msg).addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
		$('#validateAARP').removeAttr('disabled');
	}
	else if(aarpMemberStatus != "" && aarpMemberStatus != undefined){
		displayAARPSvcMessage(aarpMemberStatus);
	}
	
	// Affinity Group Dropdown
	$('#affinityCD').bind("change", function(){
		if($('#stateCd').val() =='MA'){
			
			validateAffinityCode(this);

			if($('#affinityCD').val()=="MA1"){
				showHideAARPFields();
			}else{
				$('.aarpMembershipNumberInfo').addClass('hidden');
				$('#aarpMembershipNumber').val('');
				$('#aarpMembershipStatus').val('');
				$('#aarpValidationMessageID').html("");
				$("#aarpMembershipNumber_Error").hide();
			}
		}
	});
	
	$('#aarpMembershipNumber').click(function(){
		$('#validateAARP').removeAttr('disabled');
	});
	
	$('#aarpMembershipNumber').bind("blur", function(){
		checkIfAARPNumberChanged(this.value);
	});
	
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
	
	$('.clsLicenseNumber').each(function() {
		var id = $(this).attr('id');
		var drvIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var isRMV = $('#driverLicNum_dataSourceCd_'+drvIndex).val();
		if(isRMV.toUpperCase() == 'YES'){
			$('#licenseState_'+drvIndex).attr('disabled', true);
			$('#licenseNumber_'+drvIndex).attr('disabled', true);
			$("#licenseState_").trigger('chosen:updated');
		}
		showOrHideAccPrevCrseChkBoxes(this);
	});
	
	//58539
	$('.vehicleLeasedInd').each(function() {
		if(!isValidValue($(this).val())){
			var id = $(this).attr('id');
			if(isValidValue(id)){
				var vehicleIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				$('#vehicleLeasedInd_'+vehicleIndex).val("No").trigger("chosen:updated");
		    	removePreRequiredStyle($('#vehicleLeasedInd_'+vehicleIndex));
			}
		}
	});
	
	$(document).on("blur change", ".clsAccdntPrevCourseDt",function(event,result){
		validateAccidentPrvntCourseDt(this);		
	});	
	
	//Readonly mode checking should be the last since you
	//dont want any other methods modifiying any elemets
	if ( $('#readOnlyMode').val() == 'Yes' ) {
		$("#continue").addClass('hrefdisable');
		$("#saveApplication").addClass('hrefdisable');
		$("#cancelApplication").addClass('hrefdisable');
		$("#applicationDDeleteLinkId").addClass('hrefdisable');
		$("#applicationVDeleteLinkId").addClass('hrefdisable');
		$('select').prop('disabled', true);
		//$('select').trigger("changeSelectBoxIt");	
		$('select').prop('disabled', true).trigger('chosen:updated');
		$("#deleteInsurableInterest").addClass('hrefdisable');
		$("#saveIIAndNew").addClass('hrefdisable');
		$("#saveIIAndClose").addClass('hrefdisable');
		$('#vehicleMainContentTable input').addClass('hrefdisable');
		$('#eligibilityMainContentTable input').addClass('hrefdisable');		
		$('.inlineErrorMsg').addClass('hidden');
		$('#driverMainContentTable input').addClass('hrefdisable');
		$('#iiName1').addClass('hrefdisable');
		$('#iiName2').addClass('hrefdisable');
		$('#iiAddress1').addClass('hrefdisable');
		$('#iiAddress2').addClass('hrefdisable');
		$('#iiZip').addClass('hrefdisable');
		$('#iiCity').addClass('hrefdisable');
		$('#iiFid').addClass('hrefdisable');
		$('#iiLoanNumber').addClass('hrefdisable');				
	}
	
	//Renters
	$(document).on("change", "#rentersEndEligReviewResult",function(event){
		if('OMCA' == this.value){
				$('#agentReviewRenterRemove').modal();	
		}else{
			$('#agentRemovesRentersEndorsement').val('');
		}
	});
	
	$(document).on("click", ".agentRemovesRenter", function(event){
		$('#agentRemovesRentersEndorsement').val('Yes');
	});
	
	$(document).on("click",".rentDismiss,.rentCancel", function(event){
		$('#rentersEndEligReviewResult').val('').trigger("chosen:updated");
		var errorMessageID = 'rentersEndEligReviewResult.browser.inLine.required';
		var divElm = $('#rentersEndEligReviewResult').attr('id');
		showClearInLineErrorMsgsWithMap(divElm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	});
	
	showOrHideYubiChkBoxes();
	
	// Life Discount
	$('#pruLifePolicyNum_0').bind("blur", function(event, result){validatePruLifePolicyNumber();});
	
	if($('#isLifeDiscountEnabled').val() == 'true'){
		showOrHideLifeDiscount();
		$('#chkBoxPruLife').click(function(){
			showOrHideLifeDiscount();
		});
	}
	initialFormLoadProcessing();
	//********** No code allowed beyond this line. 
});

function setFocusToErrorElement(){
	var errorElements = $('.inlineError');
	var firstErrorElement = null;
	var focusOn = null;
	if(errorElements && errorElements.length > 0) {
		firstErrorElement = errorElements.not('.disabled').first();
		focusOn = firstErrorElement.attr('id');			
	}
	//slide to right based on the current sliding table in context	
	if(firstErrorElement != null) {
		if($("#driverMainContentTable").has(firstErrorElement).length > 0 ) {
			//45858 -  Clicked Continue w/ Errors on Drivers 4/5 and Veh #5 - and AI Froze.
			slideToShowError(focusOn, "#firstDriver", "#driverCount", DRIVERS_PER_PAGE, "#leftDriverScrollBtn", "#rightDriverScrollBtn");	
		} else if ( $("#vehicleMainContentTable").has(firstErrorElement).length > 0 ) {
			slideToShowError(focusOn, "#firstVehicle", "#vehicleCount", VEHICLES_PER_PAGE, "#leftVehicleScrollBtn", "#rightVehicleScrollBtn");	
		} else {
			//nothing...
		}
		
		//AFter necessary Sliding set the focus.
		setFocus(focusOn);
	}
	return false;
}

var SCROLL_PANEL = '#scrollPanel';
var errorMessages;
//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

function bindApplicationColumns() {
	bindColumn('multiTable', null, null);
}

function bindColumn(tableClass, columnSelector, sAction) {
	var selector = '.' + tableClass;
	var columnPrefix = '';	
	if (columnSelector != null) {
		selector += ' > tbody > tr';
		if (columnSelector == 'last-child') {
			columnPrefix = ' td:' + columnSelector + ' ';
		}
		else {
			columnPrefix = ' > td:' + columnSelector + ' ';
		}
	}
	
	$('input.clsDriverStatus').each(function() {		
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideDriverImproveCourseChkBoxes(this);		//PA_AUTO
		showOrHideAccPrevCrseChkBoxes(this);
	});
	
	if ($(".clsDefDriverCourseChkBox:checked").length == 0) {		
		$('.defenseDrvrCourse_Row').addClass('hidden');		
	}
	
	//PA_AUTO
	if ($(".clsDrvrImprovCourseChkBox:checked").length == 0) {		
		$('.drvrImprovCourse_Row').addClass('hidden');		
	}
	
	$(columnPrefix + 'input.clsDefDriverCourseChkBox', selector).change(function(){
		showOrHideDefDriverCourseDt(this, 'change');
    });
	
	//PA_AUTO
	$(columnPrefix + 'input.clsDrvrImprovCourseChkBox', selector).change(function(){
		showOrHideDriverImprovCourseDt(this, 'change');
    });
	
	$('select.clsOtherCarrierSelect').each(function() {		
		showOrHideOtherCarrier(this, 'load');
	}).change(function () {		
		showOrHideOtherCarrier(this, 'change');	
	});
	
	showHidePreInspectionDesc();

	$(columnPrefix + 'input.clsAccPrevCourseChkBox', selector).change(function(){
		showOrHideAccPrevCourseDt(this);
		// validation not required here....just show/hide date field
		//var lastIndex = getIndexOfElementId(this);
		//validateAccidentPrvntCourseDt(('#accidentPrvntCourseDt_') + lastIndex);	
    });

	
	$('input.clsAccPrevCourseChkBox').each(function() {		
		showOrHideAccPrevCourseDt(this);
	});
	
	//set default value for snowplow as No
	$('select.snowplowEquipInd').each(function() {
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		var snowPlowEquiped = $('#snowplowEquipInd_' + vehIndex).val();
		
		if($('#firstTimeThru').val() == 'true' && $(this).val() == ''){
			$(this).val("No");
			//special case so removing from here, else common.js is used
			addRemovePreRequired(this, 'load');
			//$(this).removeClass("preRequired");			
			triggerChangeEvent($(this));
		}
		
		if(vehicleType != PRIVATE_PASSENGER_CD){
			showHideChosenContainer('snowplowEquipInd_' + vehIndex, false); 
			if(snowPlowEquiped == '' || null == snowPlowEquiped){
				$('#snowplowEquipInd_Error_Col_'+vehIndex).addClass('hidden');
			}	
		}else{
			if(snowPlowEquiped == '' || null == snowPlowEquiped){
				$('#snowplowEquipInd_Error_Col_'+vehIndex).removeClass('hidden');
			}	
		}
		
	});
	
	//TNC Requirements
	//set default value for TNC as No
	$('select.vehicleTncUseInd').each(function() {
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		var vehicleTncUseInd = $('#vehicleTncUseInd_' + vehIndex).val();
		
		if($('#firstTimeThru').val() == 'true' && $(this).val() == ''){
			if($('#stateCd').val() !='NJ' && $('#stateCd').val() !='PA') {
				$(this).val("No");
			}
			
			//special case so removing from here, else common.js is used
			addRemovePreRequired(this, 'load');
			triggerChangeEvent($(this));
		}
		
		if(vehicleType != PRIVATE_PASSENGER_CD){
			showHideChosenContainer('vehicleTncUseInd_' + vehIndex, false); 
			if(vehicleTncUseInd == '' || null == vehicleTncUseInd){
			}	
		}else{
			if(vehicleTncUseInd == '' || null == vehicleTncUseInd){
				if($('#stateCd').val() !='NJ' && $('#stateCd').val() !='PA') {
					$(this).val("No");
				}
				
				$('#vehicleTncUseInd_Error_Col_'+vehIndex).removeClass('hidden');
				triggerChangeEvent($(this));
			}	
		}		
	});
	
	$('select.vehicleTncCompanyCd').each(function() {
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		var vehicleTncUseInd = $('#vehicleTncUseInd_' + vehIndex).val();
		
		if(vehicleType != PRIVATE_PASSENGER_CD || vehicleTncUseInd != 'Yes'){
			showHideChosenContainer('vehicleTncCompanyCd_' + vehIndex, false); 
		}else{
			if(vehicleTncUseInd == 'Yes' && vehicleType == PRIVATE_PASSENGER_CD){
				$('#vehicleTncCompanyCd_Error_Col_'+vehIndex).removeClass('hidden');
			}	
		}		
	});
	
	$('select.vehicleTncUsageLevel').each(function() {
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		var vehicleTncUseInd = $('#vehicleTncUseInd_' + vehIndex).val();
		
		if(vehicleType != PRIVATE_PASSENGER_CD || vehicleTncUseInd != 'Yes'){
			showHideChosenContainer('vehicleTncUsageLevel_' + vehIndex, false); 
		}else{
			if(vehicleTncUseInd == 'Yes' && vehicleType == PRIVATE_PASSENGER_CD){
				$('#vehicleTncUsageLevel_Error_Col_'+vehIndex).removeClass('hidden');
			}	
		}		
	});
	
	$('select.vehicleTncDriverName').each(function() {
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		var vehicleTncUseInd = $('#vehicleTncUseInd_' + vehIndex).val();
		
		if(vehicleType != PRIVATE_PASSENGER_CD || vehicleTncUseInd != 'Yes'){
			showHideChosenContainer('vehicleTncDriverName_' + vehIndex, false); 
		}else{
			if(vehicleTncUseInd == 'Yes' && vehicleType == PRIVATE_PASSENGER_CD){
				$('#vehicleTncDriverName_Error_Col_'+vehIndex).removeClass('hidden');
			}	
		}		
	});
	
	showOrHideRowVehicleTncCompanyCd();
	showOrHideRowVehicleTncUsageLevel();
	showOrHideRowVehicleTncDriverName();
	
	$('select.vehicleTncUseInd').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType = $('#vehTypeCd_' + vehicleIndex).val();
		if($('#vehicleTncUseInd_'+vehicleIndex).val() == 'Yes'){
			//As per recent CC this message not required
			/*showClearInLineErrorMsgsWithMap(this.id, 'vehicleTncUseInd.browser.inLine.minlimits',  $('#defaultVehicleMulti').outerHTML(),
					vehicleIndex, errorMessages, addRemoveVehicleRow);*/
			showHideField('vehicleTncCompanyCd', vehicleIndex,	vehicleType == PRIVATE_PASSENGER_CD);				
			showHideField('vehicleTncUsageLevel', vehicleIndex,	vehicleType == PRIVATE_PASSENGER_CD);	
			showHideField('vehicleTncDriverName', vehicleIndex,	vehicleType == PRIVATE_PASSENGER_CD);				
		}else{			
			$('#vehicleTncCompanyCd_' + vehicleIndex).val('').trigger('chosen:updated');
			$('#vehicleTncUsageLevel_' + vehicleIndex).val('').trigger('chosen:updated');
			$('#vehicleTncDriverName_' + vehicleIndex).val('').trigger('chosen:updated');
			showHideField('vehicleTncCompanyCd', vehicleIndex,	false);	
			showHideField('vehicleTncUsageLevel', vehicleIndex,	false);	
			showHideField('vehicleTncDriverName', vehicleIndex,	false);	
			
			checkUniqueTNC(this);
		}
		showOrHideRowVehicleTncCompanyCd();
		showOrHideRowVehicleTncUsageLevel();
		showOrHideRowVehicleTncDriverName();
	});
	
	if ($('#yubiEnabled').val() == 'true') {
		$('select.vehicleTncDriverName').bind('change',function(event) {
			handleVehicleTncDriverNameChange(this);
		});
	}
	
	
	$(columnPrefix + 'select.clsDriverStatus', selector).change(function(){
		showOrHideOtherCarrier(this, 'change');	
    });
	
	$(columnPrefix + '.clsDeleteDriver', selector).on("click", function(){
		deleteDriver(this);
	});
	
	$(columnPrefix + '.clsDeleteVehicle', selector).click(function(){
		deleteVehicle(this);
	});
	
	$(columnPrefix + '.altGaragingInd', selector).each(function() {
		if($('#stateCd').val() == 'MA'){
			if(isValidValue($(this).attr('id'))){
			var vehIndex  = $(this).attr('id').substring('altGaragingInd_'.length);
			var typeVal = $("#vehTypeCd_" + vehIndex).val();
			setUpAlternatingGarageIndicator(this,typeVal,vehIndex,false,true);
			}
		}else{
			showHideGaragingAddress(this);
		}
	}).click(function() {
		if($('#stateCd').val() == 'MA'){
			if(isValidValue($(this).attr('id'))){
			var vehIndex  = $(this).attr('id').substring('altGaragingInd_'.length);
			var typeVal = $("#vehTypeCd_" + vehIndex).val();
			setUpAlternatingGarageIndicator(this,typeVal,vehIndex,false,true);
			}
		}else{
			showHideGaragingAddress(this);
		}
	});
	
	if($('#stateCd').val() == 'NJ'){
		var cols = '.multiTable';
		$('select[id^=PRINC_PIP]').change(function(){
			showHideHealthCareProvider(this, 'change');
		});
		
		$('select.clsPRINC_PIP_HCPNAMELimit',cols).on('change',function(event, result){
			showHideHealthCareProvider(this, 'change');			
		});
		
		if($('#nj_HCProviderEffdt').val() == 'true'){
			$('select.clsPRINC_PIP_HCPNAMELimit').each(function() {
				
				var id = $(this).attr('id');
				var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				var vehicleType = $('#vehTypeCd_' + vehIndex).val();
				var PRINC_PIP = $('#PRINC_PIP_HCPNAME_' + vehIndex).val();
					showHideChosenContainer('PRINC_PIP_HCPNAME_' + vehIndex, true); 
					if(PRINC_PIP == '' || null == PRINC_PIP){
						triggerChangeEvent($(this));
						$('#PRINC_PIP_HCPNAME_Error_Col_'+vehIndex).removeClass('hidden');
											
					}else{
						$('#PRINC_PIP_HCPNAME_Error_Col_'+vehIndex).addClass('hidden');
					}
			});			
		}
		
	}
	
	$(".healthCareProviderName").blur(function(){
		$("#healthCareProviderName").val($(this).val());
	});
	
	$('.clsPRINC_PIP_HCPNAMELimit','.multiTable').on('change',function(event, result){
		syncAllProvider(this);
		validateHCPDD(this);		
	});
	
	$(document).on("click", ".closeinEligible_PIPModal", function(){
		var modalID = this.parentElement.parentElement.id;
		var n = (modalID).lastIndexOf('_');
		var fullorMedical = modalID.substring(n+1,n.length);
		
		var newSelection='';
		if(fullorMedical == "Full"){
			newSelection='Primary Full PIP';
		}else{
			newSelection='Primary Medical Expense Only';
		}
		
		$('#'+modalID).modal('hide');
		changePIPProvider(newSelection);
	});
	$(document).on("click", ".closeinEligible_Sec_MedicalExpModal, .closeinEligible_Sec_PIPModal", function(){
		var modalID = this.parentElement.parentElement.id;
		var n = (modalID).lastIndexOf('_');
		var fullorMedical = modalID.substring(n+1,n.length);
		var newSelection='';		
		if(fullorMedical == "Full"){
			newSelection='Primary Full PIP';
		}else{
			newSelection='Primary Medical Expense Only';
		}
		
		var hideHealthcarePName= true;
		$('#'+modalID).modal('hide');
		changePIPProvider(newSelection);
	});
	
	$('.healthCareProviderName','.multiTable').on('change',function(event, result){
		var isEligible;
		var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
		if(nj_HCProviderEffdt == 'true'){
			isEligible = validateHealthCProviderName(this);	
			
			if(!isEligible){
				var PIPStr = "#PRINC_PIP_0";
				var PIPDDValue = $(PIPStr).val();
				var isMedical = PIPDDValue.includes("Medical");
				if(isMedical){					
					$('#inEligiblePIP_Med').modal('show');
				}else{					
					$('#inEligiblePIP_Full').modal('show');
				}
				
			}else{
				syncAllProvider(this);
			}
		}		
		
	});
	$('.healthCareProviderName').bind({
		'keypress': function(event){
			validateHCProviderChars(this,event);
	},
	'paste':function(event){
		var element = this;
		setTimeout(function () {
			var enteredName = element.value;
			var formattedName = enteredName.replace(/[^A-Za-z ]/g, "");
			$('#'+element.id).val(formattedName);
			validateHCProviderChars(this,event);
		}, 100);
		
	}}
	);
	
	$(".healthCareProviderNumber").blur(function(){
		$("#healthCareProviderNumber").val($(this).val());
	});
	
	$(document).on('click', '.editInsurableInterest', function() 
			{
		editInsurableInterest(this.id);
		});
	
	if($('#stateCd').val() != 'MA'){
		$(".clsFloodLiab").change(function(){
			floodLiab(this);
			// clear premiums when coverages change
            //clearPremium();
		});
	}	
	
	$('#motorClubInd').click(function(){
		showHideMotorInfo($('#motorClubInd'), 'click');
	});
	
	$('#fixAppDiscalimerSelection').click(function(){		  
		$('#appEligibilityErrorsModal').modal('hide');		
	});

	//58276
	$('input.vinInput').on('change blur', function(event, result){
		validateVin(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	//UW Tier - Lien Category, clear vin on change
	$('input.vinInput').on('change', function(event, result){		
		if(!isEndorsement()){
			$('#polLienCatCode').val('');
		}
	});
	
	
//	$(columnPrefix + 'input.vinInput', selector).bind(getValidationEvent(), function(event, result) {	
//		console.log('VALIDATE VIN');
//		result.errorCount += validateVin(this, getColumnIndexNoHeader($(this).parent()));
//	});
	
	// license number
	$(columnPrefix + '.clsLicenseNumber', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateLicenseNumber(this, getColumnIndexNoHeader($(this).parent()), 'bind');
	});
	
	$(columnPrefix + '.clsMaskedLicNum', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateMaskedLicenseNumber(this, getColumnIndexNoHeader($(this).parent()), 'bind');
	});
	
	$('input.clsLicenseNumber').each(function() {		
		validateLicenseNumber(this, getColumnIndexNoHeader($(this).parent()), 'load');
	});
	
	$(columnPrefix + 'input.clsLicenseNumber, input.clsMaskedLicNum', selector).keypress(function(event){
		acceptLicenseCharsOnly(event);
    });
	
	$(columnPrefix + 'input.clsMaskedLicNum', selector).blur(function(event){
		maskThirdPartyElementData(this, event, '4');
	});
	
	// license state
	$(columnPrefix + 'select.clsLicenseState', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateLicenseState(this, getColumnIndexNoHeader($(this).parent()));									
	});
	
	//driver status required
	$(columnPrefix + 'select.clsDriverStatus', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateDriverStatusRequired(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	// driver status valid
	$(columnPrefix + 'select.clsDriverStatus', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateLicAndDriverStatuses(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	// other carrier
	$(columnPrefix + 'select.clsOtherCarrierSelect', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateOtherPolicyCarrName(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	// occupation
	$(columnPrefix + 'select.clsOccupation', selector).bind(getValidationEvent(), function(event, result) {
		var policyState = $("#stateCd").val(); // $("#policyStateCd").val(); should this be used TODO
		if (policyState != 'MA') {
			result.errorCount += validateOccupation(this, getColumnIndexNoHeader($(this).parent()));	
		}												
	});
	
	// yubi
	if ($('#yubiEnabled').val() == 'true') {
		validatePhoneNumber();
	}
	
	//Vehicle TNC Use
	$(columnPrefix + 'select.vehicleTncUseInd', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateVehicleTncUseInd(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	$(columnPrefix + 'select.vehicleTncCompanyCd', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateVehicleTncCompanyCd(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	$(columnPrefix + 'select.vehicleTncUsageLevel', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateVehicleTncUsageLevel(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	if (($('#stateCd').val() != 'NJ' && $('#stateCd').val() != 'PA') || $('#yubiEnabled').val() != 'true') {
	$(columnPrefix + 'select.vehicleTncDriverName', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateVehicleTncDriverName(this, getColumnIndexNoHeader($(this).parent()));										
	});
	}
	
	//pre inspection
	$(columnPrefix + 'select.preInspectionRequiredDesc', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validatePreInspection(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	//snow plow
	$(columnPrefix + 'select.snowplowEquipInd', selector).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateSnowPlow(this, getColumnIndexNoHeader($(this).parent()));										
	});
	
	//defensive driving course date
	$(columnPrefix + 'input.clsDefnsDrvngCoursDt', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'defensiveDriverCourseDt.browser.inLine';			
		result.errorCount += validateDefenseDrvngCrseDate(this, getColumnIndexNoHeader($(this).parent()), 'bind');
	});	
	
	//driver improvement course date driverImprovCourseDt
	$(columnPrefix + 'input.clsDrvrImprovCoursDt', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'driverImprovCourseDt.browser.inLine';			
		result.errorCount += validateDrvrImprovCrseDate(this, getColumnIndexNoHeader($(this).parent()), 'bind');
	});	
	
	// HC Provider Name
	$(columnPrefix + 'input.healthCareProviderName', selector).bind(getValidationEvent(), function(event, result) {	
		var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
		if(nj_HCProviderEffdt == 'true'){
			var thisId = event.currentTarget.id;
			var nextId;
			var n = thisId.lastIndexOf("_");
			var stub = thisId.substring(0, n+1);
			//select the id, of Type as _0,_1
			var idIndex = thisId.substring(n+1,n.length);
			var cols = '.multiTable';
			
			$('input[id^=' + stub + ']',cols).each(function() {
				if($(this).hasClass("healthCareProviderName")){
					nextId = this.id;
					
					if(nextId != thisId){
						n = nextId.lastIndexOf("_");
						stub = nextId.substring(0, n+1);
						idIndex = nextId.substring(n+1,n.length);
						result.errorCount += validateHCProviderName(this, getColumnIndexNoHeader($(this).parent()));
					}
				}
			});
		}
		
		result.errorCount += validateHCProviderName(this, getColumnIndexNoHeader($(this).parent()));	
		if(nj_HCProviderEffdt == 'true'){
			var healthCareProviderName_Error_Count =  $('#healthCareProviderName_Error_Col_0').length;
			if (healthCareProviderName_Error_Count > 0 ){
				$('#hcProviderName').css("padding-bottom", "24px");
				$('#HC_Provider_id').css("padding-bottom", "0px");
				$('#HC_Provider_id').css("padding-top", "0px");
			}else{
				$('#hcProviderName').css("padding-bottom", "8px");
				$('#HC_Provider_id').css("padding-bottom", "10px");
				$('#HC_Provider_id').css("padding-top", "10px");
			}
		}
		
	});	
	
	$(columnPrefix + 'select.clsPRINC_PIP_HCPNAMELimit', selector).bind(getValidationEvent(), function(event, result) {
		var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
		if(nj_HCProviderEffdt == 'true'){
			var thisId = event.currentTarget.id;
			var nextId;
			var n = thisId.lastIndexOf("_");
			var stub = thisId.substring(0, n+1);
			//select the id, of Type as _0,_1
			var idIndex = thisId.substring(n+1,n.length);
			var cols = '.multiTable';
			
			$('select[id^=' + stub + ']',cols).each(function() {
				if($(this).hasClass("clsPRINC_PIP_HCPNAMELimit")){
					nextId = this.id;
					
					if(nextId != thisId){
						n = nextId.lastIndexOf("_");
						stub = nextId.substring(0, n+1);
						idIndex = nextId.substring(n+1,n.length);
						result.errorCount += validateHCProviderDD(this, getColumnIndexNoHeader($(this).parent()));
						
					}
				}
			});
		}		
		result.errorCount += validateHCProviderDD(this, getColumnIndexNoHeader($(this).parent()));		
	});
	
	// HC Provider Number
	$(columnPrefix + 'input.healthCareProviderNumber', selector).bind(getValidationEvent(), function(event, result) {	
		var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
		if(nj_HCProviderEffdt == 'true'){
			var thisId = event.currentTarget.id;
			var nextId;
			var n = thisId.lastIndexOf("_");
			var stub = thisId.substring(0, n+1);
			//select the id, of Type as _0,_1
			var idIndex = thisId.substring(n+1,n.length);
			var cols = '.multiTable';
			
			$('input[id^=' + stub + ']',cols).each(function() {
				if($(this).hasClass("healthCareProviderNumber")){
					nextId = this.id;
					
					if(nextId != thisId){
						n = nextId.lastIndexOf("_");
						stub = nextId.substring(0, n+1);
						idIndex = nextId.substring(n+1,n.length);
						result.errorCount += validateHCProviderNumber(this, getColumnIndexNoHeader($(this).parent()));
						
					}
				}
			});
		}
		
		result.errorCount += validateHCProviderNumber(this, getColumnIndexNoHeader($(this).parent()));
		if(nj_HCProviderEffdt == 'true'){
			var healthCareProviderNumber_Error_Count =  $('#healthCareProviderNumber_Error_Col_0').length;
			if (healthCareProviderNumber_Error_Count > 0 ){
				$('#healthCareProviderNumber_Error_Header').css("line-height", "0px");
			}
		}		
	
	});	
	
	
		
	$(".editGaragingAddress", selector).click(function(){
		editGaragingAddress(this.id);
	});
	
	//if($('#stateCd').val() == 'NJ'){
	//zip lookup applicable for MA too	
	
	$(document).on("blur", "#gaZip,#gaOutOfStateZip", function(){
		var stateCd = $('#stateCd').val();
		var vehIndex = parseInt($("#gaGarageIndex").val());
		var garagingState = $('#quoteSelectedState_'+vehIndex).val();
		var ignoreLookup = false;
		if(stateCd == 'MA' && garagingState == 'MA'){
			ignoreLookup = true;
		}
		var zip = $(this).val();
		if ((zip.length == 5 || zip.length == 9) && !ignoreLookup) {
				//last parameter is edit flag
				performZipTownLookup(zip, $('#gaCity'), '', '');
		}
	});
	
	$("#gaZip").bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric) {
        	this.value = this.value.replace(regex, '');
        }}});
	
	$("#gaMaCity").on("change", function(){
		var stateCd = $('#stateCd').val();
		if(stateCd == 'MA'){
				var city = $(this).val();
				var vehIndex = parseInt($("#gaGarageIndex").val());
				var garagingState = $('#quoteSelectedState_'+vehIndex).val();
				if(garagingState == 'MA'){
					var cityText = $.trim($(this).find('option:selected').text());
					if (city != undefined && city != null && city.length>1) {
						//last parameter is edit flag
						$("#garagingCity_" + vehIndex).val(cityText);
						$('#vehAltGarageTown_'+vehIndex).val(city);
						performZipTownLookup(city, $('#gaZip'), '', '');
					}
					else{
						// 55161	
						//$("#garagingCity_" + vehIndex).val('');
					}
					}
			}
		});

	
	$(columnPrefix + 'input.clsDateInputFld', selector).keyup(function(event){
		autoSlashes(this,event);
    });
	
	$('input.clsMembershipDate').keyup(function(event){
		autoSlashes(this,event);
    });
	
	//Motor Club Name validation
	$('#motorClubName_0').bind(getValidationEvent(), function(event, result){validateMotorClubName();});
	//Motor Club Membership validation
	$('#motorClubMembershipDate_0').bind(getValidationEvent(), function(event, result){validateMotorMembershipDate();});
	
	
	//renters eligibility
	$('#rentersEndEligReviewResult').bind(getValidationEvent(), function(event, result){validateAgentReviw(this);});
	
	
	
	$('#iiTypeCd').change(function(){
		$('div#interestErrormessage').empty();
	});
	
	$("#iiZip").blur(function(){
		var zip = $("#iiZip").val();

		if(zip!= '' && $.isNumeric(zip)){ 
			$('div#zipErrormessage').empty();
		}else if(!($.isNumeric(zip)) || zip.length < 5 || zip.length > 5){
			$('div#zipErrormessage').text("A numeric 5 digit Zip value is required.");
		}
	
	});
	
	$("#iiName1").blur(function(){
		var name = $("#iiName1").val();
		if(name!= ''){
			$('div#nameErrormessage').empty();
		}else{
			$('div#nameErrormessage').text("Name is required.");
		}
	});
	
	$("#iiAddress1").blur(function(){
		var address = $("#iiAddress1").val();
		if(address!= ''){
			$('div#addressErrormessage').empty();
		}else{
			$('div#addressErrormessage').text("Address is required.");
		}
	});
	
	$("#iiCity").blur(function(){
		var city = $("#iiCity").val();
		if(city!= ''){
			$('div#cityErrormessage').empty();
		}else{
			$('div#cityErrormessage').text("City is required.");
		}
	});
	
	$("#iiState").change(function(){
		var state = $("#iiState").val();
		if(state!= ''){
			$('div#stateErrormessage').empty();
		}else{
			$('div#stateErrormessage').text("State is required.");
		}
	});
	
	$(".clsDriverLicNum").change(function(){
		var lastIndex = getIndexOfElementId(this); 
		//TD# 45814	When Driver license number altered on Application Layer, no re-order is triggered
		if(isMVRInitialOrderComplete() 
				&& ($('#driverStatus_'+lastIndex).val()=='INS_POL' || $('#driverStatus_'+lastIndex).val()=='R')){
			//12/31/2014 Logic updated to handle multiple drivers
			var currVal = $('#resetMVROrderStatusApplication').val();
			currVal = (currVal==null || currVal =='')?($('#driverId_'+lastIndex).val()):(currVal+"%"+$('#driverId_'+lastIndex).val());
			$('#resetMVROrderStatusApplication').val(currVal);
		} 
	});
	
	if ($('#yubiEnabled').val() == 'true') {
		// YUBI requirement
		$('.yubiDriverInd').each(function() {
			showHideCellPhoneInfo();
		}).click(function() {
			showHideCellPhoneInfo();
		});
		
		$('.yubiDriverInd').change(function() {
			validateSelectedTncDriver(this);
		});
		
		$('.cellphoneNumber').bind('focusout',function(event, result) { validatePhoneNumber(); });
		$('.cellphoneNumber').bind('focusout',function(event, result) { addRemoveBindPreRequired(); });
		$('.cellphoneNumber').bind({'keyup keydown keypress': function(e) { fmtPhone(this,e); }});
}

}

//Inline validations
function addRemoveVehicleRow(row, addIt) {
	var headerBody = $('#vehicleRowHeaderTable > tbody');
	if (addIt) {
		addVehicleErrorRow(row, headerBody, false);
	} else {
		removeVehicleErrorRow(row, headerBody);					
	}
}

//Inline validations
function addRemoveClientRow(row, addIt) {
	var headerBody = $('#clientRowHeaderTable > tbody');
	if (addIt) {
		addClientErrorRow(row, headerBody, false);
	} else {
		removeClientErrorRow(row, headerBody);					
	}
}


//Inline validations
function addRemoveDriverRow(row, addIt) {
	var headerBody = $('#driverRowHeaderTable > tbody');
	if (addIt) {
		addDriverErrorRow(row, headerBody, false,'driver');
	} else {
		removeDriverErrorRow(row, headerBody,'driver');					
	}
}

function addRemoveDetailsRow(row, addIt) {
	var headerBody = $('#detailsRowHeaderTable > tbody');
	if (addIt) {
		addDetailsErrorRow(row, headerBody, false,'details');
	} else {
		removeDetailsErrorRow(row, headerBody,'details');					
	}
}

function addRemoveCoveragesRow(row, addIt) {
	var headerBody = $('#coverageRowHeaderTable > tbody');
	if (addIt) {
		addCoveragesErrorRow(row, headerBody, false,'coverages');
	} else {
		removeCoveragesErrorRow(row, headerBody,'coverages');					
	}
}

function addVehicleErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex=0;
	if($errorRow.attr("id").match("^vin") || $errorRow.attr("id").match("^vehicleLeasedInd") 
			|| $errorRow.attr("id").match("^garaging") || $errorRow.attr("id").match("^additionalInterests")
			|| $errorRow.attr("id").match("^preInspectionRequiredDesc") || $errorRow.attr("id").match("^snowplowEquipInd")
			|| $errorRow.attr("id").match("^vehicleTncUseInd") || $errorRow.attr("id").match("^vehicleTncCompanyCd")
			|| $errorRow.attr("id").match("^vehicleTncUsageLevel") || $errorRow.attr("id").match("^vehicleTncDriverName"))
		rowIndex = $errorRow.index();

	var rowHtml = '<tr id="' +  $errorRow.attr("id") + '_Header"><td>&nbsp;</td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}

function addClientErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex=0;
	if( $errorRow.attr("id").match("^clientEligibilityGroupId") 
			|| $errorRow.attr("id").match("^clientDistrictTownId")
			|| $errorRow.attr("id").match("^clientInstitutionNameId")){
		rowIndex = $errorRow.index();
		var rowHtml = '<tr id="' +  $errorRow.attr("id") + '_Header"><td></td></tr>';
		var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
		headerRow.after(rowHtml);
		if (alignRows) {
			alignTableRow($errorRow, headerRow.next());		
		}
	}
}

function addDriverErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex=0;
	if($errorRow.attr("id").match("^licenseState") || $errorRow.attr("id").match("^licenseNumber") || $errorRow.attr("id").match("^driverStatus")
			|| $errorRow.attr("id").match("^otherPolicyCarrName") || $errorRow.attr("id").match("^occupation")
			|| $errorRow.attr("id").match("^accidentPrvntCourseInd") || $errorRow.attr("id").match("^accidentPrvntCourseDt") 
			|| $errorRow.attr("id").match("^driverImprovCourseDt"))
		rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' +  $errorRow.attr("id") + '_Header"><td>&nbsp;</td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}

function addDetailsErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex=0;
	if($errorRow.attr("id").match("^motorClubName") 
			|| $errorRow.attr("id").match("^motorClubMembershipDate") 
			|| $errorRow.attr("id").match("^affinityCD")
			|| $errorRow.attr("id").match("^pruLifePolicyNum"))
		rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' + $errorRow.attr("id")  + '_Header"><td>&nbsp;</td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}

function addCoveragesErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex=0;
	
	if($errorRow.attr("id").match("^healthCareProviderName") || $errorRow.attr("id").match("^healthCareProviderNumber") || $errorRow.attr("id").match("^PRINC_PIP_HCPNAME"))
		rowIndex = $errorRow.index();

	var rowHtml = '<tr id="' +  $errorRow.attr("id") + '_Header"><td>&nbsp;</td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}



function removeDriverErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;	
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

function removeClientErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;	
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

function removeVehicleErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

function removeDetailsErrorRow(errorRow, headerBody) {	
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

function removeCoveragesErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

function validateAffinityCode(affinityCD) {
	return validateRequiredWithMap(affinityCD, 'affinityCD.browser.inLine',
			fieldIdToModelErrorRow['defaultSingle'], -1, errorMessages, addRemoveDetailsRow);	
}

//Life Discount
function validatePruLifePolicyNumber(){
	return validateRequiredWithMap(document.aiForm.pruLifePolicyNum_0, 'pruLifePolicyNum.browser.inLine',
			fieldIdToModelErrorRow['defaultSingle'], -1, errorMessages, addRemoveDetailsRow);	
}

function validateVin(vin, columnIndex) {
	var vinVal = $(vin).val();
	var state = $('#stateCd').val();
	var rmvLookupSuccess = $('#rmvLookupInd_'+columnIndex).val();
	if(rmvLookupSuccess == undefined || rmvLookupSuccess == null || rmvLookupSuccess.toUpperCase() != 'YES'){
			rmvLookupSuccess= false;
	}
	else{
		rmvLookupSuccess = true;
	}
	var prefillLookupSuccess = $('#dataSourceCd_'+columnIndex).val();
	if(prefillLookupSuccess == undefined || prefillLookupSuccess == null || prefillLookupSuccess.toUpperCase() != 'YES'){
		prefillLookupSuccess= false;
	}
	else{
		prefillLookupSuccess = true;
	}
	
	if(state != 'MA' || (state == 'MA' && (!rmvLookupSuccess && !prefillLookupSuccess))){
	var typeVal = $("#vehTypeCd_" + columnIndex).val();
	var yearVal = $("#modelYear_" + columnIndex).val();
	showClearInLineErrorMsgsWithMap('vin_'+columnIndex, "", $('#defaultVehicleMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);	
	var strErrorTag = 'vin.browser.inLine';
	var errorMessageID = '';
	
	if(isValidValue(vinVal)){
		if((typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD || typeVal == ANTIQUE_CD)){
			if((yearVal == '' || parseInt(yearVal) >= 1981)){
				if (vinVal.length < 17) {
					errorMessageID = strErrorTag + '.appRequires17';
				} 
				else{
					var last7digit = vinVal.substring(11,vinVal.length);
					if(/^(.)\1+$/.test(last7digit)){
						errorMessageID = strErrorTag + '.appRequires17';
					}else{
						errorMessageID = '';
					}
				}
		}
		}
	}else{
		errorMessageID = strErrorTag + '.required';
	}
	showClearInLineErrorMsgsWithMap('vin_' + columnIndex, errorMessageID, $('#defaultVehicleMulti').outerHTML(),
			columnIndex, errorMessages, addRemoveVehicleRow);
	}
}


function validateVehicleLeasedInd(vehicleLeasedInd, columnIndex) {
	return validateRequiredWithMap(vehicleLeasedInd, 'vehicleLeasedInd.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateGaragingZipCode(garagingZipCode, columnIndex) {
	return validateRequiredWithMap(garagingZipCode, 'garagingZipCode.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateLicenseState(licenseState, columnIndex) {
	return validateRequiredWithMap(licenseState, 'licenseState.browser.inLine',
			$('#defaultDriverMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveDriverRow);	
}

function validateLicenseNumber(licenseNumber, columnIndex, actn) {
		var lastIndex = getIndexOfElementId(licenseNumber); 
		var strLicNum = trimSpaces($(licenseNumber).val());
		var strLicstate = trimSpaces(getLicenseState(lastIndex));
		var maskLicNum = '#maskLicNum_' + lastIndex;
		
		var strMsg = '';
		
		if(strLicstate == NOT_LICENSED){
				$(licenseNumber).val("");
				$(maskLicNum).val("");
				disableDataField($(licenseNumber));				
				disableDataField($(maskLicNum));
		}
		else if (strLicstate != STATE_MA && strLicstate != STATE_RI) {
				
			if(strLicNum == '' && (isRated(lastIndex))){
				strMsg = "licenseNumber.browser.inLine.required";
				addRemovePreRequired(maskLicNum, actn);
			}
			
			if( strLicNum != '') {
				removePreRequiredStyle($(maskLicNum));
				
				var validationMsg = invokeDLValidation(strLicstate, strLicNum);
				if (validationMsg == "false" ) {
					strMsg = "licenseNumber.browser.inLine.notValidLicNumber";
				}
			
			}
			
			
		} else if (strLicstate == STATE_MA || strLicstate == STATE_RI) {	
			
			if(strLicNum == '' && (isRated(lastIndex) || isDeferred1(lastIndex))){
				strMsg = "licenseNumber.browser.inLine.required";
				addRemovePreRequired(maskLicNum, actn);
			}
			
			if( strLicNum != '') {
				removePreRequiredStyle($(maskLicNum));
				var validationMsg = invokeDLValidation(strLicstate, strLicNum);
				if (validationMsg == "false" ) {
					strMsg = "licenseNumber.browser.inLine.notValidLicNumber";
				}
			}
			
		}

		var errorMessageID = strMsg;
			if(actn == 'bind'){
				if ( $(licenseNumber).hasClass("clsHiddenLicNumForMask") ) {
					showClearInLineErrorMsgsWithMap('licenseNumber_' + lastIndex, '', $('#defaultDriverMulti').outerHTML(),
							columnIndex, errorMessages, addRemoveDriverRow);
					showClearInLineErrorMsgsWithMap('maskLicNum_' + lastIndex, errorMessageID, $('#defaultDriverMulti').outerHTML(),
							columnIndex, errorMessages, addRemoveDriverRow);				
				} else {
					showClearInLineErrorMsgsWithMap(licenseNumber.id, errorMessageID, $('#defaultDriverMulti').outerHTML(),
						columnIndex, errorMessages, addRemoveDriverRow);
				}
			}else{
				if($('#firstTimeThru').val() != 'true'){
					showClearInLineErrorMsgsWithMap(licenseNumber.id, errorMessageID, $('#defaultDriverMulti').outerHTML(),
							columnIndex, errorMessages, addRemoveDriverRow);
				}
			}	
	}

var validateMaskedLicenseNumber = function (licenseNumber, columnIndex, actn) {
	// send actual license number hidden field 
	validateLicenseNumber('#licenseNumber_' + columnIndex, columnIndex, actn);
	//return msg;
};

function invokeDLValidation(stateCd, value){
	var strLicNum = trimSpaces(value);
	var strLicstate = trimSpaces(stateCd);
	
	var strURL = addRequestParam("/aiui/application/isValidLicenseNumber", "stateCd", strLicstate);
	strURL = addRequestParam(strURL, "licenseNumber", strLicNum);
	var responseString;
	
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: strURL,
        type: "GET",
        dataType : 'text',
        async:false,
        
        success: function(response, textStatus, jqXHR){
        	responseString = response;
        },
 
        error: function(jqXHR, textStatus, errorThrown){
        	responseString =  "error";
          }
       
    });
	
	return responseString;
}
	
function getLicenseState(index) {
	var strLicState = $("#licenseState_" + index).val();
	return strLicState;
	
}

function validateDriverStatusRequired(driverStatus, columnIndex){
		return validateRequiredWithMap(driverStatus, 'driverStatus.browser.inLine',
				$('#defaultDriverMulti').outerHTML(), columnIndex, errorMessages,
				addRemoveDriverRow);	
}

function validateLicAndDriverStatuses(driverStatus, columnIndex) {
	 if (isValidLicAndDriverStatusCombo (driverStatus)) {
		return '';
	} 
		var errorMessageID = 'driverStatus.browser.inLine.invalidLicAndDriverStatus';
		showClearInLineErrorMsgsWithMap(driverStatus.id, errorMessageID, $('#defaultDriverMulti').outerHTML(),
				columnIndex, errorMessages, addRemoveDriverRow);
}

function validateOtherPolicyCarrName(otherPolicyCarrName, columnIndex){
	return validateRequiredWithMap(otherPolicyCarrName, 'otherPolicyCarrName.browser.inLine',
			$('#defaultDriverMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveDriverRow);	
}

function validateOccupation(occupation, columnIndex){
	return validateRequiredWithMap(occupation, 'occupation.browser.inLine',
			$('#defaultDriverMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveDriverRow);	
}

function validatePreInspection(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'preInspectionRequiredDesc.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncUseInd(preinspection, columnIndex){
	if($('#vehicleTncUseInd_'+columnIndex).val() != 'Yes'){
		return validateRequiredWithMap(preinspection, 'vehicleTncUseInd.browser.inLine',
				$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
				addRemoveVehicleRow);	
	}
}

function validateVehicleTncCompanyCd(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'vehicleTncCompanyCd.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncUsageLevel(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'vehicleTncUsageLevel.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncDriverName(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'vehicleTncDriverName.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function checkUniqueTNC(strElm){
	var currVehLastIndex = getIndexOfElementId(strElm); 
	//actual lic num field
	var vehcleUseIndId = 'vehicleTncUseInd_' + currVehLastIndex;
	var strMsg = EMPTY;
	var tncCount = 0;
	var currVehicleTncUseInd = $('#vehicleTncUseInd_' + currVehLastIndex).val();
	if(currVehicleTncUseInd == 'No'){
		//clear inline below the field
		showClearInLineErrorMsgsWithMap('vehicleTncUseInd_' + currVehLastIndex, strMsg,  $('#defaultVehicleMulti').outerHTML(),
				currVehLastIndex*1, errorMessages, addRemoveVehicleRow);
	}
	
	// check this license numb exists for other drivers
	$('select.vehicleTncUseInd').each(function(){
		var lastIndex = getIndexOfElementId(this); 
		//actual vehicle TNC
		var strVehicleTncUseInd = $('#vehicleTncUseInd_' + lastIndex).val();
		
		//skip the same driver check
		if (strVehicleTncUseInd != '' && strVehicleTncUseInd == 'Yes') {
			tncCount++;
		}	
 	});
	if(tncCount <= 1){
		$('select.vehicleTncUseInd').each(function(){
			var lastIndex = getIndexOfElementId(this); 	
			vehcleUseIndId = 'vehicleTncUseInd_' + lastIndex;
			showClearInLineErrorMsgsWithMap(vehcleUseIndId, strMsg,  $('#defaultVehicleMulti').outerHTML(),
					lastIndex*1, errorMessages, addRemoveVehicleRow);
	 	});
	}
	
}


function validateSnowPlow(snowplow, columnIndex){
	return validateRequiredWithMap(snowplow, 'snowplowEquipInd.browser.inLine',
			$('#defaultVehicleMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}



var isValidLicAndDriverStatusCombo = function (strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	var strLicStatus = getLicenseStatus(lastIndex);
	var strDriverStatus = getDrvrStatus(lastIndex);
		
	if (strLicStatus == '' || strDriverStatus == '' ) {
		return true;
	}
	
	switch(strLicStatus) {

	    case ACTIVE:      	
	
	    	return (strDriverStatus == INSURED_ON_THIS_POLICY || strDriverStatus == INSURED_ON_ANOTHER_PRAC	
	                            || strDriverStatus == INSURED_ELSE_WHERE|| strDriverStatus == AWAY_IN_ACTV_SERVC) ;
	        break;	
	     
	    case SUSPENDED_LICENSE:       	
	
	    	return (strDriverStatus == INSURED_ON_ANOTHER_PRAC || strDriverStatus == INSURED_ELSE_WHERE	
	                            || strDriverStatus == SUSPENDED_OPERATOR || strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;	
	    case REVOKED_LICENSE:       	
	
	    	return (strDriverStatus == INSURED_ON_ANOTHER_PRAC || strDriverStatus == INSURED_ELSE_WHERE	
	                            || strDriverStatus == REVOKED_OPERATOR|| strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;	
	    case NO_LONGER_LICENSED: 
	    	
	    	return (strDriverStatus == NO_LONGER_LICENSED || strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;
	    case EXPIRED_LICENSE:  
	    	
	    	return (strDriverStatus == NO_LONGER_LICENSED || strDriverStatus == AWAY_IN_ACTV_SERVC);
	    		
	    	break;	
	    case NEVER_LICENSED:	
	    	
	    	return (strDriverStatus == AWAY_IN_ACTV_SERVC || strDriverStatus == NEVER_LICENSED);
	         		
	        break;	         	 
	    case PERMIT:
	    	
	    	return (strDriverStatus == AWAY_IN_ACTV_SERVC || strDriverStatus == PERMIT);
	                  		
	        break; 
	    default:
	
	    	return false;
	}		
};

function getLicenseStatus (index) {
	return $("#licenseStatus_" + index).val();
}

function getDrvrStatus(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	return strDrvrSatus;	
}



function validateHCProviderName(providerName, columnIndex) {
	return validateRequiredWithMap(providerName, 'healthCareProviderName.browser.inLine',
			$('#defaultCoverageMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveCoveragesRow);	
}

function validateHCProviderDD(providerNumber, columnIndex) {	
	return validateRequiredWithMap(providerNumber, 'PRINC_PIP_HCPNAME.browser.inLine',
			$('#defaultCoverageMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveCoveragesRow);	
}

function validateHCProviderNumber(providerNumber, columnIndex) {
	return validateRequiredWithMap(providerNumber, 'healthCareProviderNumber.browser.inLine',
			$('#defaultCoverageMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveCoveragesRow);	
}

function showHideHealthCareProvider(obj, actn){
	var val = $(obj).val();
	var pipVal;
	if($(obj).hasClass("clsPRINC_PIP")){
		var pipVal = $(obj).val();
		$('.clsPRINC_PIP').val(pipVal);
	}else{
		var pipVal = $("#PRINC_PIP_0").val();
	}
	
	
	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	if($('#stateCd').val() == 'NJ'){
				//check any column for PRINC_PIP -> they are all the same
				if(pipVal == '' || pipVal == 'Primary Full PIP' || pipVal == 'Primary Medical Expense Only'){					
					//clear values
					$("#healthCareProviderName").val("");
					$("#healthCareProviderNumber").val("");
					//make it hidden
					
					$('.HC_Provider_ShowHide').addClass('hidden');
					$('.HC_Provider').addClass('hidden');
					$('.HC_Provider_Number').addClass('hidden');
					//$('.PRINC_PIP').addClass('hidden');
					if(actn == 'load'){
						$('.COVERAGE_SECTION').addClass('hidden');
					}
				}else{
					
					var pipValue = $("#PRINC_PIP_0").val();
					var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
					
					if(nj_HCProviderEffdt == 'true'){
						
						
						
						$('.HC_Provider_ShowHide').removeClass('hidden');
						//check if Health Care Number/Provider present or not
						var healthProviderName = $('#healthCareProviderName').val();
						var healthProviderNumber = $('#healthCareProviderNumber').val();
						if((healthProviderName == null || healthProviderName == ''|| healthProviderName == undefined) 
								&& (healthProviderNumber == null || healthProviderNumber == ''|| healthProviderNumber == undefined)){
							$('.HC_Provider').addClass('hidden');
							$('.HC_Provider_Number').addClass('hidden');
						}else{
							$('.HC_Provider').removeClass('hidden');
							$('.HC_Provider_Number').removeClass('hidden');
						}
						$('.COVERAGE_SECTION').removeClass('hidden');
						
					}else{
						$('.HC_Provider').removeClass('hidden');
						$('.HC_Provider_Number').removeClass('hidden');
						$('.healthCareProviderName').each(function(){
							addRemovePreRequired(this, actn);
					    });
						$('.healthCareProviderNumber').each(function(){
							addRemovePreRequired(this, actn);
					    });
						
						$('.COVERAGE_SECTION').removeClass('hidden');
					}
					
					
					
					
				}
			}
 
	// turn edit events back on
	blnTriggerEdits = true;
}


//49566 - Application page - entering a number in the Provider Name and clicking continue - wipes out Teacher information entered and Occupation
function validateHCProviderChars(hcProviderName,e)
{
	var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 8) return true;
    var keynum;
    var keychar;
    
   // var charcheck = /[a-zA-Z-'&. ]/;
   var charcheck = /[a-zA-Z ]/;
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
   
    if( charcheck.test(keychar)){
    		return true;
    	}
    	e.preventDefault();
}

function showHidePreInspectionDesc(){
	var blnShowRow = false;
	//set default value for preinspectindesc
	$('select.preInspectionRequiredDesc').each(function() {		
		
		var id = $(this).attr('id');
		var vehIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		var vehicleType = $('#vehTypeCd_' + vehIndex).val();
		

		if(vehicleType != PRIVATE_PASSENGER_CD && vehicleType != ANTIQUE_CD){
			showHideChosenContainer('preInspectionRequiredDesc_' + vehIndex, false);
		}else {
			var compCov = 'Y' == $('#compCov_' +vehIndex).val();
		
			if(compCov){
				blnShowRow = true;
			}
			//TD 63832 - Removing COLL from condition so preinspection will always displayed when COMP is selected for PPA and ANTIQUE.
			showHideChosenContainer('preInspectionRequiredDesc_' + vehIndex, (compCov));			
		}		
		
		if(blnShowRow  == true && $('#firstTimeThru').val() == 'true' && $(this).val() == ''){
			
			var defaultVal = "No - Previous policy had phys. damage";
			$(this).val(defaultVal);

			//special case so removing from here, else common.js is used
			addRemovePreRequired(this, 'load');
			//$(this).removeClass("preRequired");
			triggerChangeEvent($(this));
		}
	});
	
	//var showPreInspectionRow = $('.preInspectionRequiredDesc:not(.chosenDropDownHidden)').length > 0;
	showHideRowWithFlag('preInspectionRequiredDesc', blnShowRow);
}


function floodLiab(cov){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;

	// do not fire any edit events during this logic
	blnTriggerEdits = false;
    
    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    // check drop downs
    $('select[id^=' + stub + ']').each(function() {
    	if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsFloodPolicyCov")){
			nextId = this.id;
    		if(nextId != thisId){
                $('#' + this.id).val(newSelection).trigger('chosen:updated');
            	highlightAndFade(this);
            	
    		}
		}
    });
    // check check boxes
    $('input[id^=' + stub + ']').each(function() {
    	if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsFloodPolicyCov")){	
			nextId = this.id;
    		if(nextId != thisId){
    			//don't change or highlight the one the user changed
                this.value = newSelection;
                if(this.type == 'checkbox'){     
                	// update check box display
                	this.checked = cov.checked;
                }
   			   	highlightAndFade(this);
    		}
		}
    });
	
	// turn edit events back on
	blnTriggerEdits = true;
}

function highlightAndFade(el) {
		  
		// do not fire any edit events during this logic
		blnTriggerEdits = false;

		//For required and optional fields
		// pretend focusd to remove background / watermark
		
		if ($(el).hasClass("required") || $(el).hasClass("optional")){
			$(el).trigger('focus');
		}
		if (el.type == 'select-one'){
			//$(el).addClass('autoChange').trigger(changeSelectBoxIt); 
			$(el).addClass('autoChange').trigger('chosen:styleUpdated'); 
			//setTimeout(delayedWhite, 500, el.id);
		}else{
			$(el).animate({backgroundColor:"yellow"}, 500);
			$(el).animate({backgroundColor:"white"}, 1000);
		}
		//show yellow background for .5 seconds
		//For required and optioanl fields
		// pretend to leave field to reset background / watermark
		if ($(el).hasClass("required") || $(el).hasClass("optional")){
			$(el).trigger('blur');
		}
	    
		// turn edit events back on
		blnTriggerEdits = true;
	}

function getIndexOfElementId(strElement) {
	var strId = $(strElement).attr('id');
    if(strId !=null && strId !=undefined && strId.length>1){
    	var n = strId.lastIndexOf('_');
    	var lastIndx = strId.substring(n + 1);
    	return lastIndx;
    }
}

function deleteVehicle(deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	
	if (parseInt($('#vehicleCount').val()) == 1) {
		confirmMessageWithTitle("Invalid Vehicle Delete", "You can't delete the last vehicle");
		return;
	} 
	    $('#question #yes').bind('click.vehicleDelete', function() { 
	    	
	    	//UW Lien Cat code related
	    	if(!isEndorsement()){
	    		$('#polLienCatCode').val('');
	    	}
	    	
			var deletedId = $('#vehicleId_' + columnIndex, deleteColumn).val();
			
			deleteScrollableColumns(columnIndex, 'vehicleMultiTable',
					$('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
			
			//48959 - IF the first Column being deleted. then columnSelector for BindColumn should not be td:gt(-1);
			var columnSelector =  'gt(' + (parseInt(columnIndex) - 1) + ')';
			
			if(parseInt(columnIndex) == 0) {
				columnSelector = null ;
			}
			
			recordDeletion('deletedVehicles', deletedId);
			bindColumn('vehicleMultiTable', columnSelector);
			updateVehicleScrollPanel('#vehicleScrollPanel');
		    $('#question #yes').unbind('click.vehicleDelete');
	    });
	    questionMessageWithTitle("Confirm Vehicle Delete", "Are you sure you want to delete this vehicle?");
}

function deleteDriver(deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);	
	//get last index of element's id
	var lastIndex = getIndexOfElementId(deleteLink);	
		
	// don't delete the named insured1
	if (($('#participantRole_' + lastIndex).val() == 'PRIMARY_INSURED') || ($('#participantRole_' + lastIndex).val() == 'SECONDARY_INSURED')) {
		confirmMessage("You cannot delete Named Insured Driver. Should this driver need to be deleted, please delete the Named Insured on the Client tab, and in doing so, it will delete the corresponding Driver.");
		return;
	}
	else if (parseInt($('#driverCount').val()) == 1) {
		confirmMessageWithTitle("Invalid Driver Delete", "You can't delete the last Driver");
		return;
	} else {
	    $('#question #yes').bind('click.driverDelete', function() { 
			var deletedId = $('#driverId_' + columnIndex, deleteColumn).val();
			//TD 70510 fix
			validateSelectedTncDriverOnDelete('#driverId_' + columnIndex);
			
			deleteScrollableColumns(columnIndex, 'driverMultiTable',
					$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
			
			recordDeletion('deletedDrivers', deletedId);
			
			bindColumn('driverMultiTable', 'gt(' + (columnIndex - 1) + ')');

			updateDriverScrollPanel('#driverScrollPanel');

		    $('#question #yes').unbind('click.driverDelete');
	    });
	    questionMessageWithTitle("Confirm Driver Delete", "Are you sure you want to delete this Driver?");
	}
}


function recordDeletion(deletionTag, deletedId) {
	if (typeof deletedId != "undefined") {
		var vehicleVars = $('#hiddenApplicationVariables');
		var deletedItems = $('.' + deletionTag, vehicleVars);
		if (deletedItems.length == 0) {
			vehicleVars.append('<input id="' + deletionTag + '_0" class="' + deletionTag + '" type="hidden" value="" name="policyWrapper.' + deletionTag + '[0]">');
		} else {
			vehicleVars.append($(deletedItems[0]).replaceIndices(deletedItems.length));
		}
		deletedItems = $('.' + deletionTag + ':last', vehicleVars);			
		deletedItems.val('' + deletedId);	
	}
}

function handleSubmit(event) {
	//processAppDetailsElibilityQuestions(event, 'submit');
	enableHiddenVars();
	//finally set prefilldata updated indicator
	setPrefillDataUpdatedIndicator('application');
	//App Form Motor club date log error clean up
	checkInvalidDateFormats("#motorClubMembershipDate_0");
	
	fixCellphoneNumberFields();
	
	// Life Discount
	if(isApplicationOrEndorsement() && $('#isLifeDiscountEnabled').val() == 'true'){
		checkLifeDiscountField();
}
}

// #44378 - Had to re-use the sliding functions so that Driver & Vehicles has seperate scrolling
function slideDriverStartAppl(event, parentDiv) {

	var position = $('.slidingFrame', parentDiv).scrollLeft();
	slideLeft(event, $('.slidingFrame', parentDiv), position);	
	$('#firstDriver').val(1);
	$('.clsLtScrollSelAppl').addClass("hidden");
	$('.clsLtScrollGreySelAppl').removeClass("hidden");
	$('.clsRtScrollGreySelAppl').addClass("hidden");
	$('.clsRtScrollSelAppl').removeClass("hidden");

	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverLeftAppl(event, parentDiv) {
	var firstColumnVal = parseInt($('#firstDriver').val());
	if (firstColumnVal - 1 >= 1) {
		var scrollWidth = 0;
		var cols = $('tr', $('.slidingTable', parentDiv)).eq(0).find('td').slice(firstColumnVal, firstColumnVal + 1);
		cols.each(function () {
			scrollWidth += $(this).outerWidth(true);
		});
		slideLeft(event, $('.slidingFrame', parentDiv), scrollWidth);
		$('#firstDriver').val(parseInt($('#firstDriver').val()) - 1);
		$('.clsRtScrollGreySelAppl').addClass("hidden");
		$('.clsRtScrollSelAppl').removeClass("hidden");
	}
	else{
		$('.clsLtScrollSelAppl').addClass("hidden");
		$('.clsLtScrollGreySelAppl').removeClass("hidden");
	}
	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverRightAppl(event, parentDiv) {
	var firstColumnVal = parseInt($('#firstDriver').val());
	if (firstColumnVal <= parseInt($('#driverCount').val()) - DRIVERS_PER_PAGE) {
		var scrollWidth = 0;
		var cols = $('tr', $('.slidingTable', parentDiv)).eq(0).find('td')
		.slice(firstColumnVal - 1, firstColumnVal + 1 - 1);
		cols.each(function () {
			scrollWidth += $(this).outerWidth(true);
		});
		slideRight(event, $('.slidingFrame', parentDiv), scrollWidth);
		$('#firstDriver').val(parseInt($('#firstDriver').val()) + 1);
		$('.clsLtScrollGreySelAppl').addClass("hidden");
		$('.clsLtScrollSelAppl').removeClass("hidden");
	}
	else{
		$('.clsRtScrollSelAppl').addClass("hidden");
		$('.clsRtScrollGreySelAppl').removeClass("hidden");
	}
	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverEndAppl(event, parentDiv) {

	var position = $('.slidingFrame', parentDiv).scrollLeft();
	var frameWidth = $('.slidingFrame', parentDiv).width();
	var contentWidth = $('.slidingTable', parentDiv).width();
	slideRight(event, $('.slidingFrame', parentDiv), contentWidth - position - frameWidth);	
	$('#firstDriver').val(Math.max(1, (parseInt($('#driverCount').val()) - DRIVERS_PER_PAGE) + 1));
	$('.clsRtScrollSelAppl').addClass("hidden");
	$('.clsRtScrollGreySelAppl').removeClass("hidden");
	$('.clsLtScrollGreySelAppl').addClass("hidden");
	$('.clsLtScrollSelAppl').removeClass("hidden");

	updateDriverScrollPanel( $(event.target).parent());
}

function setupDriverScrolling() {
		
	updateDriverScrollPanel('#driverScrollPanel');
	$("#startDriverScrollBtn")
		.click(function(event) {
			slideDriverStartAppl(event, $('#driverMainContent'));
		});
	$("#leftDriverScrollBtn")
		.click( function(event) {
			slideDriverLeftAppl(event, $('#driverMainContent'));
		})
		.hover(
			function(event){
				this.iid = setInterval(function() {
					slideDriverLeftAppl(event, $('#driverMainContent'));
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightDriverScrollBtn")
		.click( function(event) {
			slideDriverRightAppl(event, $('#driverMainContent'));
		})
		.hover(
			function(event) {
				this.iid = setInterval(function() { 
					slideDriverRightAppl(event, $('#driverMainContent'));
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endDriverScrollBtn")
		.click(function(event) {
			slideDriverEndAppl(event, $('#driverMainContent'));
		});
}

function setupDriverCheckboxes() {
	
	var selector = $('select.clsDriverStatus');
	handleDefensiveDriver(selector);
	(selector);		//PA_AUTO
	selector.change(function () {
		handleDefensiveDriver($(this));
		handleDriverImprovement($(this));	//PA_AUTO
	});
}

function handleDefensiveDriver(selector) {
	
	var policyState = $("#stateCd").val();
	selector.each(function() {
		var index = getFieldIndex(this.id);
		var showDD = policyState == STATE_NJ && $(this).val() == 'INS_POL';
		if (showDD) {
			$('#defenseDrvrCourseNA_' + index).addClass('hidden');
			$('#defenseDrvrCourse_' + index).removeClass('hidden');
		} else {
			$('#defenseDrvrCourseNA_' + index).removeClass('hidden');
			$('#defenseDrvrCourse_' + index).addClass('hidden')
				.attr('checked', false);
		}
	});
	var showDDRow = $('.defenseDrvrCourse:not(.hidden)').length > 0;
	showHideRowWithFlag('defensiveDrvrCourseDt', showDDRow);
}

//PA_AUTO
function handleDriverImprovement(selector) {
	
	var policyState = $("#stateCd").val();
	selector.each(function() {
		var index = getFieldIndex(this.id);
		var showDD = policyState == STATE_PA && $(this).val() == 'INS_POL';
		if (showDD) {
			$('#drvrImprovCourseNA_' + index).addClass('hidden');
			$('#drvrImprovCourse_' + index).removeClass('hidden');
		} else {
			$('#drvrImprovCourseNA_' + index).removeClass('hidden');
			$('#drvrImprovCourse_' + index).addClass('hidden')
				.attr('checked', false);
		}
	});
	var showDDRow = $('.drvrImprovCourse:not(.hidden)').length > 0;
	showHideRowWithFlag('driverImprovCourseDt', showDDRow);
}

function showOrHideDefensiveDriverChkBoxes(strElm) {
	var lastIndex;	
	lastIndex = getIndexOfElementId(strElm);
	
	if ((getPolicyState() == STATE_NJ) && (getDrvrStatus(lastIndex) == 'INS_POL')) {			
		showOrHideHtml("#defenseDrvrCourseNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsDefDrvrCourseRow', 'show');
		showOrHideHtml("#defenseDrvrCourse_" + lastIndex, 'show');
		return;
	}
	
		showOrHideHtml("#defenseDrvrCourseNA_" + lastIndex, 'show');
		if ($("#defenseDrvrCourse_" + lastIndex).is(":checked")) {
			$("#defenseDrvrCourse_" + lastIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#defenseDrvrCourse_" + lastIndex).trigger('change');
		}
		showOrHideHtml("#defenseDrvrCourse_" + lastIndex, 'hide');
	
	// show or hide the Defensive Driver chkboxes Row
	//showOrHideFieldRow('clsDefDrvrCourseRow', 'clsDefDriverCourseChkBox');
	var blnShowRow = false;
	
	$('.clsDefDriverCourseChkBox').each(function() {		
		lastIndex = getIndexOfElementId(this);				 

		if ((getPolicyState() == STATE_NJ) && (getDrvrStatus(lastIndex) == 'INS_POL')) {
			blnShowRow = true;
			return true;
		}
		
	});
	
	if (blnShowRow) {
		showOrHideDrvrTableRow('clsDefDrvrCourseRow', 'show');
	}
	else {
		showOrHideDrvrTableRow('clsDefDrvrCourseRow', 'hide');
		showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'hide');
	}
}

//PA_AUTO
function showOrHideDriverImproveCourseChkBoxes(strElm) {

	var lastIndex;
	var elmDt;
	var elmDtVal;
	var blnIsValid;
	var intAge;
	var relToInsCheckFlag = false;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#birthDate_" + lastIndex);
	elmDtVal = $("#birthDate_" + lastIndex).val();
	blnIsValid = validateDateEntry(elmDt);
	
	if ($("#relationshipToIns_" + lastIndex).val() == 'I' 
		|| $("#relationshipToIns_" + lastIndex).val() == 'S'
		|| $("#relationshipToIns_" + lastIndex).val() == 'D') {

		relToInsCheckFlag = true;
	}
	
	if ((elmDtVal != '') && (blnIsValid)) {
		intAge = calculateAge(elmDtVal,null);		
		if ((getPolicyState() == STATE_PA) && (parseInt(intAge) >= 50) && 
			(getDrvrStatus(lastIndex) == 'INS_POL') && (relToInsCheckFlag)) {
			
			showOrHideHtml("#drvrImprovCourseNA_" + lastIndex, 'hide');
			showOrHideDrvrTableRow('clsDrvrImprovCourseRow', 'show');
			showOrHideHtml("#drvrImprovCourse_" + lastIndex, 'show');
			return;
		}
	}
	
	showOrHideHtml("#drvrImprovCourseNA_" + lastIndex, 'show');
	if ($("#drvrImprovCourse_" + lastIndex).is(":checked")) {
		$("#drvrImprovCourse_" + lastIndex).attr('checked', false);
		$("#drvrImprovCourse_" + lastIndex).trigger('change');
	}
	showOrHideHtml("#drvrImprovCourse_" + lastIndex, 'hide');
	
	var blnShowRow = false;
	
	$('.clsDrvrImprovCourseChkBox').each(function() {		
		relToInsCheckFlag = false;
		lastIndex = getIndexOfElementId(this);
		elmDt = $("#birthDate_" + lastIndex);
		elmDtVal = $("#birthDate_" + lastIndex).val();
		blnIsValid = validateDateEntry(elmDt);
		
		if ($("#relationshipToIns_" + lastIndex).val() == 'I' 
			|| $("#relationshipToIns_" + lastIndex).val() == 'S'
			|| $("#relationshipToIns_" + lastIndex).val() == 'D') {

			relToInsCheckFlag = true;
		}

		if ((elmDtVal != '') && (blnIsValid)) {
			intAge = calculateAge(elmDtVal,null);		
			if ((getPolicyState() == STATE_PA) && (parseInt(intAge) >= 50) && 
				(getDrvrStatus(lastIndex) == 'INS_POL') && (relToInsCheckFlag)) {
				
				blnShowRow = true;
				return true;
			}
		}
	});
	
	if (blnShowRow) {
		showOrHideDrvrTableRow('clsDrvrImprovCourseRow', 'show');
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').show();
	}
	else {
		showOrHideDrvrTableRow('clsDrvrImprovCourseRow', 'hide');
		showOrHideDrvrTableRow('clsDrvrImprvCourseDtRow', 'hide');
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').hide();
	}
}

function showOrHideDefDriverCourseDt(strElm, actn) {
	var policyState = $("#stateCd").val();
	var lastIndex = getIndexOfElementId(strElm);
	var columnIndex = getColumnIndexNoHeader($(strElm).parent());
	
	// hide for full quote and non NJ
	if (policyState != STATE_NJ) {
		// hide DefDriverCourseDt row always
		//$('.' + 'defensiveDrvrCourseDt_Row').hide();
		showOrHideDrvrTableRow('defensiveDrvrCourseDt_Row', 'hide');
		return false;
	}
	
	if ($(strElm).is(":checked")){

			showOrHideDrvrTableRow('defensiveDrvrCourseDt_Row', 'show');
			showOrHideHtml("#clsDefnDrivCourseDtSpan_" + lastIndex, 'show');
			showOrHideHtml("#defDriverCourseSpan_" + lastIndex, 'show');
			
		/*	if($("#defensiveDriverCourseDt_" + lastIndex).val() == '' ){				
				$("#defensiveDriverCourseDt_" + lastIndex).addClass("preRequired");
				//var errorMessageID = "defensiveDriverCourseDt.browser.inLine.required";							
			}else{
				$("#defensiveDriverCourseDt_" + lastIndex).removeClass("preRequired");
			}*/
    }
	else {
			$("#defensiveDriverCourseDt_" + lastIndex).val("");
			showOrHideDrvrTableRow('defensiveDrvrCourseDt_Row', 'hide');
			showOrHideHtml("#clsDefnDrivCourseDtSpan_" + lastIndex, 'hide');
			showOrHideHtml("#defDriverCourseSpan_" + lastIndex, 'hide');
			//$("#defensiveDriverCourseDt_" + lastIndex).removeClass("preRequired");
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('defensiveDrvrCourseDt_Row', 'clsDefDriverCourseChkBox');
	addRemovePreRequired("#defensiveDriverCourseDt_" + lastIndex, actn);
	if(actn=='change'){
		validateDefenseDrvngCrseDate("#defensiveDriverCourseDt_" + lastIndex, columnIndex, actn);
	}
}
	function validateDefenseDrvngCrseDate(defenseDrvngCrseDate, columnIndex, actn){
		
		var blnIsValid1 = validateDateEntry(defenseDrvngCrseDate);	
		var blnIsValid2 = validateFutureDate(defenseDrvngCrseDate);
		var errorMessageID = '';
		var lastIndex = getIndexOfElementId(defenseDrvngCrseDate);

		if($("#defenseDrvrCourse_" + lastIndex).is(":checked")){			
		
			if(trimSpaces($(defenseDrvngCrseDate).val()) == ''){
				errorMessageID="defensiveDriverCourseDt.browser.inLine.required";
			}
			
			else if (!blnIsValid1) {
				$(defenseDrvngCrseDate).val(""); 
				errorMessageID = 'defensiveDriverCourseDt.browser.inLine.formatShouldBeMM/DD/YYYY';
			}
			
			else if (!blnIsValid2) {
				$(defenseDrvngCrseDate).val(""); 
				errorMessageID = 'defensiveDriverCourseDt.browser.inLine.cannotBeInTheFuture';
			}
			else{
			
				var defDrvngCrseDt = Date.parse($(defenseDrvngCrseDate).val());
				var policyEffDt = Date.parse($("#policyEffDt").val());
				var dateDifference = policyEffDt - defDrvngCrseDt; 
				var noOfDays = ((dateDifference % 31536000000) % 2628000000)/86400000;
				 
				if (defDrvngCrseDt < policyEffDt) {
					var months = getMonthsDifference($(defenseDrvngCrseDate).val(), $("#policyEffDt").val());
					if (parseInt(months) > 36 || (parseInt(months) == 36 && noOfDays > 0 )) {
						errorMessageID =  'defensiveDriverCourseDt.browser.inLine.cannotBeGreaterThan36MonthsPrior';
					}
				}	
			
			}
		}
		//special case so removing from here, else common.js is used
		addRemovePreRequired(defenseDrvngCrseDate, actn);
		
		showClearInLineErrorMsgsWithMap($(defenseDrvngCrseDate).attr('id'), errorMessageID, $('#defaultDriverMulti').outerHTML(),
				getColumnIndexNoHeader($(defenseDrvngCrseDate).parent().parent()), errorMessages, addRemoveDriverRow);

}
	
//PA_AUTO
function showOrHideDriverImprovCourseDt(strElm, actn) {
	var policyState = $("#stateCd").val();
	var lastIndex = getIndexOfElementId(strElm);
	var columnIndex = getColumnIndexNoHeader($(strElm).parent());
	
	// hide for full quote and non PA
	if (policyState != STATE_PA) {
		showOrHideDrvrTableRow('drvrImprvCourseDt_Row', 'hide');
		return false;
	}
	
	if ($(strElm).is(":checked")){

			showOrHideDrvrTableRow('drvrImprvCourseDt_Row', 'show');
			showOrHideHtml("#clsDrvrImprovCoursDtSpan_" + lastIndex, 'show');
			showOrHideHtml("#drvrImprovCourseSpan_" + lastIndex, 'show');
			
    }
	else {
			$("#driverImprovCourseDt_" + lastIndex).val("");
			showOrHideDrvrTableRow('drvrImprvCourseDt_Row', 'hide');
			showOrHideHtml("#clsDrvrImprovCoursDtSpan_" + lastIndex, 'hide');
			showOrHideHtml("#drvrImprovCourseSpan_" + lastIndex, 'hide');
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('drvrImprvCourseDt_Row', 'clsDrvrImprovCourseChkBox');
	addRemovePreRequired("#driverImprovCourseDt_" + lastIndex, actn);
	if(actn=='change'){
		validateDrvrImprovCrseDate("#driverImprovCourseDt_" + lastIndex, columnIndex, actn);
	}
	if ($(".drvrImprvCourseDt_Row:visible").length){
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').show();
	}else{
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').hide();
	}
}

function validateDrvrImprovCrseDate(drvrImprovCrseDate, columnIndex, actn){
	
	var blnIsValid1 = validateDateEntry(drvrImprovCrseDate);	
	var blnIsValid2 = validateFutureDate(drvrImprovCrseDate);
	var errorMessageID = '';
	var lastIndex = getIndexOfElementId(drvrImprovCrseDate);

	if($("#drvrImprovCourse_" + lastIndex).is(":checked")){			
	
		if(trimSpaces($(drvrImprovCrseDate).val()) == ''){
			errorMessageID="driverImprovCourseDt.browser.inLine.required";
		}
		
		else if (!blnIsValid1) {
			$(drvrImprovCrseDate).val(""); 
			errorMessageID = 'driverImprovCourseDt.browser.inLine.formatShouldBeMM/DD/YYYY';
		}
		
		else if (!blnIsValid2) {
			$(drvrImprovCrseDate).val(""); 
			errorMessageID = 'driverImprovCourseDt.browser.inLine.cannotBeInTheFuture';
		}
		else{
		
			var courseDt = Date.parse($(drvrImprovCrseDate).val());
			var policyEffDt = Date.parse($("#policyEffDt").val());
			var dateDifference = policyEffDt - courseDt; 
			var noOfDays = ((dateDifference % 31536000000) % 2628000000)/86400000;
			 
			if (courseDt < policyEffDt) {
				var months = getMonthsDifference($(drvrImprovCrseDate).val(), $("#policyEffDt").val());
				if (parseInt(months) > 36 || (parseInt(months) == 36 && noOfDays > 0 )) {
					$(drvrImprovCrseDate).val("");
					errorMessageID =  'driverImprovCourseDt.browser.inLine.cannotBeGreaterThan36MonthsPrior';
				}
			}	
		
		}
	}
	//special case so removing from here, else common.js is used
	addRemovePreRequired(drvrImprovCrseDate, actn);
	
	showClearInLineErrorMsgsWithMap($(drvrImprovCrseDate).attr('id'), errorMessageID, $('#defaultDriverMulti').outerHTML(),
				getColumnIndexNoHeader($(drvrImprovCrseDate).parent().parent()), errorMessages, addRemoveDriverRow);

}

function showOrHideHtml(strElm, strVal) {
	if (strVal == 'show') {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).removeClass("hidden");
			triggerChangeEvent($(strElm));
					
		} else {
			$(strElm).css('display', 'block');
		}
	}
	else {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).addClass("hidden");
			triggerChangeEvent($(strElm));
			
		} else {
			$(strElm).css('display', 'none');
		}
	}
}

function triggerChangeEvent(strElm) {
	strElm.trigger("chosen:updated");
	//vmaddiwar : TD#48680 - we dont need to update style
	//strElm.trigger("chosen:styleUpdated");
}

function expandCollapseRows(rowPrefix) {
	$("." + rowPrefix + "Row").each(function() {
		$(this).toggleClass("hidden");
	});

	//Toggling of Plus and Minus signs upon expand and collapse of Client Details section 
	if (($('#' + rowPrefix).attr('src')).indexOf('minus') >=0) {
		$('#' + rowPrefix).attr('src', '../aiui/resources/images/plus.gif');	
	} else {
		$('#' + rowPrefix).attr('src', '../aiui/resources/images/minus.gif');
	}
}

function expandEligibilityDropdown(rowPrefix) {
	if (rowPrefix === 'eligibilityYes') {
		//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
		//if ($('#eligibilityInd').val() === 'No') {
			$('#eligibilityInd').val('Yes');
			$('.eligibilityDropDown').removeClass("hidden");
			var instVal = $('#clientInstitutionNameId').val();
			if (instVal != undefined && instVal.length > 0) {
				$('.clsInstitution').show();
				$('#clientInstitutionId').val(instVal);
			}else{
				$('.clsInstitution').hide();
			}
			if($('#clientDistrictTownId').val()!=null && $('#clientDistrictTownId').val().length > 0){
				$('.clsDistrict').show();
			}else
			{
				if($('#clientDistrictTownId').val() != 'PRV' && $('#clientDistrictTownId').val() != 'ECE' && $('#clientDistrictTownId').val() != 'PSE'){
					$('.clsDistrict').hide();
				}
			}
			lookupEligibilityGroups();

		//}
	} else {
		//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
		//if ($('#eligibilityInd').val() === 'Yes') {
			$('#eligibilityInd').val('No');
			$('.eligibilityDropDown').addClass("hidden");
			$('#clientInstitutionId').val('');
			$('.clsInstitution').hide();
			$('#clientDistrictTownId').val('');
			$('.clsDistrict').hide();
			$('#eduInstitutionGroupId').val('');
			$('#clientEligibilityGroupId').val('').trigger('chosen:updated');
			$('#clientInstitutionNameId').val('').trigger('chosen:updated');
			$('#clientDistrictTownId').val('').trigger('chosen:updated');
		//}
	}
	showClearInLineErrorMsgsWithMap($('#clientEligibilityGroupId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addRemoveDetailsRow);
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addRemoveDetailsRow);
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addRemoveDetailsRow);
}

function updateEligibilty() {
	var groupId = $('#clientEligibilityGroupId');
	$('#eduInstitutionGroupId').val(groupId.val());
	var districtId = $('#clientDistrictTownId');
	var institutionId = $('#clientInstitutionNameId');
	districtId.empty();
	districtId.append('<option value="">-- Select --</option>');
	districtId.prop('disabled',true);
	districtId.trigger('chosen:updated');
	institutionId.empty();
	institutionId.append('<option value="">-- Select --</option>');
	institutionId.prop('disabled',true);
	institutionId.trigger('chosen:updated');
	$('#clientInstitutionId').val('');
	$('.clsInstitution').hide();
	if (groupId.val().length > 0) {
		lookupEligibilityDistricts(groupId.val());
	}
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addRemoveDetailsRow);
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addRemoveDetailsRow);
}

function updateDistrict() {
	var groupId = $('#clientEligibilityGroupId');
	var districtId = $('#clientDistrictTownId');
	$('#eduInstitutionDistrict').val($('#clientDistrictTownId').val());
	var institutionId = $('#clientInstitutionNameId');
	institutionId.empty();
	institutionId.append('<option value="">-- Select --</option>');
	institutionId.prop('disabled',true);
	institutionId.trigger('chosen:updated');
	var errorMessageID = "";
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
	$('.clsInstitution').hide();
	if (districtId.val().length > 0) {
		lookupEligibilityInstitutions(groupId.val(),districtId.val());
		$('.clsDistrict').show();
	}
}

function updateInstitution() {
	var instVal = $('#clientInstitutionNameId').val();
	if (instVal != undefined) {
		$('.clsInstitution').show();
		$('#clientInstitutionId').val(instVal);
	}
}

function lookupEligibilityGroups() {
	blockUser();
	var id = $('#clientEligibilityGroupId');
	var strErrorTag = 'eligibility.group.browser.inLine';
	var errorMessageID = 'InvalidEligibilityGroup';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/eligibility",
        type: "post",
        dataType: 'json',
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	for (var i = 0; i < response.length; i++) {
        		if($('#channelCd').val() == 'CAPTIVE' && response[i].GROUP_CD == 'PTA')	continue;
        		if($('#channelCd').val() == 'IA' && response[i].GROUP_CD == 'PTA')	continue;
        		id.append('<option value="' + response[i].GROUP_CD + '">' + response[i].GROUP_NAME + '</option>');
        	}
        	if($('#eduInstitutionGroupId').val().length > 0){
        		id.val($('#eduInstitutionGroupId').val());
        	}else{
        		addPreRequiredStyle($('#clientEligibilityGroupId'));
        	}
        	id.prop('disabled',false);
        	id.trigger('chosen:updated');
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        	if ($('.eligibilityRadio:checked').attr('id') === 'eligibilityYes') {
        		setTabIndexForAllSections('lookupEligibilityGroups');
        	}
         }
    });
}

function lookupEligibilityDistricts(group) {
	blockUser();
	var id = $('#clientDistrictTownId');
	var districtName = $('#eduInstitutionDistrict').val();
	var strErrorTag = 'eligibility.district.browser.inLine';
	var errorMessageID = 'InvalidEligibilityDistrict';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/district/group/"+group,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	if ( response.length == 0 || response[0] === null) {
        		if($('#clientEligibilityGroupId').val() != 'PRV' && $('#clientEligibilityGroupId').val() != 'ECE' && $('#clientEligibilityGroupId').val() != 'PSE'){
        			$('.clsDistrict').hide();
        		}
        		var groupId = $('#clientEligibilityGroupId');
        		if($(groupId).val().length > 1){
        			lookupEligibilityInstitutions($(groupId).val(),'null');
        		}else
        		{
        			lookupEligibilityInstitutions($('#eduInstitutionGroupId').val(),'null');
        		}
        	}
        	else {
        		$('.clsDistrict').show();
        		var finalVal = '';
        		if (districtName.length>0) {
        			finalVal = districtName;
        			for (var i = 0; i < response.length; i++) {
        				var str = response[i];
        				id.append('<option value="' + str + '">' + str + '</option>');
        			}
        			if (response.length > 0) {
        				id.prop('disabled',false);
        			}
        			id.val(finalVal).prop('disabled',false).trigger('chosen:updated');
        			$('.clsInstitution').show();
        			lookupEligibilityInstitutions($('#eduInstitutionGroupId').val(),districtName);
                	validateTeachersEligiblityDistrict();
        		}else{
        			addPreRequiredStyle($('#clientDistrictTownId'));
        			for (var i = 0; i < response.length; i++) {
        				id.append('<option value="' + response[i] + '">' + response[i] + '</option>');
        			}
        			id.prop('disabled',false);
        			id.trigger('chosen:updated');
        		}      	
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function lookupEligibilityInstitutions(group,district) {
	blockUser();
	var id = $('#clientInstitutionNameId');
	var institutionId = $('#clientInstitutionId').val();
	var strErrorTag = 'eligibility.institution.browser.inLine';
	var errorMessageID = 'InvalidEligibilityInstitution';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/institution/group/"+group+"/district/"+district,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        data : JSON.stringify({"district":district}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	if ( response.length > 0 ) {
        		if (response[0].INSTITUTION_NAME === undefined) {
        			id.empty();
        			id.append('<option value="' + response[0].INSTITUTION_ID + '">-- Select --</option>');
        			id.prop('disabled',true);
        			id.trigger('chosen:updated');
        		}
        		else {
        			var finalVal = '';
        			$('.clsInstitution').show();
        			if (institutionId) {
        				for (var i = 0; i < response.length; i++) {
        					if (institutionId == response[i].INSTITUTION_ID) {
        						finalVal = response[i].INSTITUTION_ID;
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					} else {
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					}
        				}
        				if (response.length > 0) {
        					$('#clientInstitutionNameId').prop('disabled',false);
        				}
        				$('#clientInstitutionNameId').val(finalVal).trigger('chosen:updated');
                		validateTeachersEligiblityInstitution();
        			}
        			else {
        				addPreRequiredStyle($('#clientInstitutionNameId'));
        				for (var i = 0; i < response.length; i++) {
        					$('.clsInstitution').show();
        					id.empty();
        					id.append('<option value="">-- Select --</option>');
        					for (var i = 0; i < response.length; i++) {
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					}
        					id.prop('disabled',false);
        					id.trigger('chosen:updated');
        				}
        			}
        		}
        		$('#clientInstitutionNameId').prop('disabled',false).trigger('chosen:updated');
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	$('.clsInstitution').hide();
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        }
    });
	//validateTeachersEligiblityGroup();
	
}

function restoreEligibility(eligibilityFlag,institutionId){
	
		if (eligibilityFlag == 'Yes') {
			$('#eligibilityInd').val('Yes');
			$('.eligibilityDropDown').removeClass("hidden");
			if($('#clientEligibilityGroupId').val() != 'PRV' && $('#clientEligibilityGroupId').val() != 'ECE' && $('#clientEligibilityGroupId').val() != 'PSE' && $('#eduInstitutionGroupId').val().length < 1){
				$('.clsDistrict').hide();
				$('.clsInstitution').hide();
			}else {
				lookupEligibilityDistricts($('#eduInstitutionGroupId').val());
			}
			$('#eligibilityYes').prop('checked',true);
			$('#eligibilityNo').prop('checked',false);
			addRemovePreRequired('#clientEligibilityGroupId', 'true');
			addRemovePreRequired('#clientDistrictTownId', 'true');
			addRemovePreRequired('#clientInstitutionNameId', 'true');
		if (institutionId.length > 1) {
			$('.clsInstitution').show();
			$('#clientInstitutionId').val(institutionId).trigger('chosen:updated');
			//restoreEligibilityParameters(institutionId);
		}else{
			$('.clsInstitution').hide();
		}		
	}
		else {
			$('#eligibilityInd').val('No');
			$('.eligibilityDropDown').addClass("hidden");
			$('#eligibilityYes').prop('checked',false);
			$('#eligibilityNo').prop('checked',true);
}
}

function restoreEligibilityParameters(institutionId) {
	blockUser();
	var strErrorTag = 'eligibility.parameter.browser.inLine';
	var errorMessageID = 'InvalidEligibilityParameter';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/parameters/institutionId/"+institutionId,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"institutionId":institutionId}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	restoreEligibilityGroup(response.GROUP_CD);
        	restoreEligibilityDistrict(response.GROUP_CD, response.DISTRICT_NAME);
        	restoreEligibilityInstitution(response.GROUP_CD, response.DISTRICT_NAME, response.INSTITUTION_NAME);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(){
        	$.unblockUI();
        	tabIndexSet = true;
        }
    });
}

function restoreEligibilityGroup(groupCode){
	if (groupCode) {
		$("#clientEligibilityGroupId option").each(function(i){
			if ($(this).val() == groupCode) {
				$(this).prop('selected', true);
				$('#clientEligibilityGroupId').trigger('chosen:updated');
			}
		});
	}
	validateTeachersEligiblityGroup();
}

function restoreEligibilityDistrict(group, districtName) {
	blockUser();
	var id = $('#clientDistrictTownId');
	var strErrorTag = 'eligibility.district.browser.inLine';
	var errorMessageID = 'InvalidEligibilityDistrict';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/district/group/"+group,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
           	id.empty();
           	id.append('<option value="">-- Select --</option>');
           	var finalVal = '';
           	if (districtName) {
           		$('.clsDistrict').show();
           		finalVal = districtName;
           		for (var i = 0; i < response.length; i++) {
           			var str = response[i];
           			id.append('<option value="' + str + '">' + str + '</option>');
           		}
           		if (response.length > 0) {
           			id.prop('disabled',false);
           		}
           	}
           	id.val(finalVal).trigger('chosen:updated');
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function restoreEligibilityInstitution(group,district,institutionId) {
	blockUser();
	if(group == 'RR'){
		$('#clientInstitutionNameId').hide();
		$('.clsInstitution').hide();
	}else {
		var id = $('#clientInstitutionNameId');
		var strErrorTag = 'eligibility.institution.browser.inLine';
		var errorMessageID = 'InvalidEligibilityInstitution';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		if(typeof district === 'undefined'){
			district = null;
		}
		$.ajax({
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			url: "/aiui/teachelig/institution/group/"+group+"/district/"+district,
			type: "post",
			dataType: 'json',
			data : JSON.stringify({"group":group}),
			data : JSON.stringify({"district":district}),
			timeout: 2500,
			// callback handler that will be called on success
			success: function(response, textStatus, jqXHR){
				$('.clsInstitution').show();
				id.empty();
				id.append('<option value="">-- Select --</option>');
				var finalVal = '';
				if (institutionId) {
					for (var i = 0; i < response.length; i++) {
						if (institutionId == response[i].INSTITUTION_NAME) {
							finalVal = response[i].INSTITUTION_ID;
							id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
						} else {
							id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
						}
					}
					if (response.length > 0) {
						$('#clientInstitutionNameId').prop('disabled',false);
					}
				}
				$('#clientInstitutionNameId').val(finalVal).trigger('chosen:updated');
			},
			// callback handler that will be called on error
			error: function(jqXHR, textStatus, errorThrown){
			},
			complete: function(){
				$.unblockUI();
			}
		});
	}
}

function showOrHideDependentFieldRow(rowClass, chkboxClass){
	var blnChkBoxChecked = false;
	
	$('.' + chkboxClass).each(function() {		
		if ($(this).is(":checked")){	
			blnChkBoxChecked = true;
			return true;
		}
	});
	
	if(blnChkBoxChecked) {
		//$('.' + rowClass).show();
		showOrHideDrvrTableRow(rowClass, 'show');
	}
	else {
		//$('.' + rowClass).hide();
		showOrHideDrvrTableRow(rowClass, 'hide');
	}	
}

function showOrHideDrvrTableRow(rowClass, strVal) {
	if (strVal == 'show') {
		$('.' + rowClass).show();		
	}
	else {
		$('.' + rowClass).hide();		
	}
}

function setupCoverageScrolling() {
	
	updateVehicleScrollPanel('#coverageScrollPanel');
	updateVehicleScrollPanel('#vehicleScrollPanel');
	
	$("#startCoverageScrollBtn")
		.click(function(event) {
			slideVehicleStart(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		});
	$("#leftCoverageScrollBtn")
		.click( function(event) {
			slideVehicleLeft(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		})
		.hover(
			function(event){
				this.iid = setInterval(function() {
					slideVehicleLeft(event, $('.vehicleSlidingContent'));
					updateVehicleScrollPanel('#coverageScrollPanel');
					updateVehicleScrollPanel('#vehicleScrollPanel');
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightCoverageScrollBtn")
		.click( function(event) {
			slideVehicleRight(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		})
		.hover(
			function(event) {
				this.iid = setInterval(function() { 
					slideVehicleRight(event, $('.vehicleSlidingContent'));
					updateVehicleScrollPanel('#coverageScrollPanel');
					updateVehicleScrollPanel('#vehicleScrollPanel');
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endCoverageScrollBtn")
		.click(function(event) {
			slideVehicleEnd(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		});
}

function setupVehicleScrolling() {
		
	updateVehicleScrollPanel('#coverageScrollPanel');
	updateVehicleScrollPanel('#vehicleScrollPanel');
		
	$("#startVehicleScrollBtn")
		.click(function(event) {
			slideVehicleStart(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		});
	$("#leftVehicleScrollBtn")
		.click( function(event) {
			slideVehicleLeft(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		})
		.hover(
			function(event){
				this.iid = setInterval(function() {
					slideVehicleLeft(event, $('.vehicleSlidingContent'));
					updateVehicleScrollPanel('#coverageScrollPanel');
					updateVehicleScrollPanel('#vehicleScrollPanel');
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightVehicleScrollBtn")
		.click( function(event) {
			slideVehicleRight(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		})
		.hover(
			function(event) {
				this.iid = setInterval(function() { 
					slideVehicleRight(event, $('.vehicleSlidingContent'));
					updateVehicleScrollPanel('#coverageScrollPanel');
					updateVehicleScrollPanel('#vehicleScrollPanel');
				}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endVehicleScrollBtn")
		.click(function(event) {
			slideVehicleEnd(event, $('.vehicleSlidingContent'));
			updateVehicleScrollPanel('#coverageScrollPanel');
			updateVehicleScrollPanel('#vehicleScrollPanel');
		});
}

var tabIndex = 104;
window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

function alignRows() {
	
	alignRowsById('driverRowHeaderTable', 'driverMainContentTable');
	alignRowsById('vehicleRowHeaderTable', 'vehicleMainContentTable');
	alignRowsById('coverageRowHeaderTable', 'coverageMainContentTable');
	alignRowsById('detailsRowHeaderTable', 'detailsMainContentTable');
}

function validatePage() {
	var errorCount = validateInputs();
	return errorCount == 0;
}

function showHideGaragingAddress(altGaragingIndBox) {
	
	var vehIndex  = $(altGaragingIndBox).attr('id').substring('altGaragingInd_'.length);
	
	if ($(altGaragingIndBox).prop('checked')) {
		$('#garagingAddressData_'+vehIndex).removeClass('hidden');
    }  else  {
    	$('#garagingAddress1_'+vehIndex).val('');
    	$('#garagingAddress2_'+vehIndex).val('');
    	$('#garagingZipCode_'+vehIndex).val('');
    	$('#garagingCity_'+vehIndex).val('');
    	$('#garagingState_'+vehIndex).val('');
    	$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text('');
		$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected' ).addClass('hidden');
		$('#garagingAddressData_'+vehIndex+' .garagingAddressNew' ).removeClass('hidden');
        $('#garagingAddressData_'+vehIndex).addClass('hidden');
    }
    
    if ($(".altGaragingInd:checked").length == 0) {
		$('.garagingZipCode_Row').addClass('hidden');
		$('#garagingAddressData_Error').addClass('hidden');
		//$('.garagingZipCode_Error').addClass('hidden');
    } else {
        //if atleast one column is checked the whole row should be visible.
    	$('.garagingZipCode_Row').removeClass('hidden');
		$('#garagingAddressData_Error').removeClass('hidden');
    }	
	
}


function setUpAlternatingGarageIndicator(garagingCity,typeVal,vehIndex,showHide,ignoreRMVTown){
	//var residentialTown = $('#residentialTown').val();
	//var rmvGaragingTown = $('#rmvGarageTown_'+vehIndex).val();
	var garagingCity = $('#garagingCityName_'+vehIndex).val();
	var altGarageInd = $('#altGaragingInd_'+vehIndex).val();
		
	if(isApplicationOrEndorsement()) {
		if ($('#altGaragingInd_'+vehIndex).is(':checked')) {
			$('#garagingAddressData_'+vehIndex).removeClass('hidden');
			$('#altGaragingInd_'+vehIndex).val('Yes');
	    }  else  {
	    	$('#garagingAddress1_'+vehIndex).val('');
	    	$('#garagingAddress2_'+vehIndex).val('');
	    	$('#garagingZipCode_'+vehIndex).val('');
	    	$('#garagingCity_'+vehIndex).val('');
	    	$('#garagingState_'+vehIndex).val('');
	    	
	    	$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text('');
			$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected' ).addClass('hidden');
			$('#garagingAddressData_'+vehIndex+' .garagingAddressNew' ).removeClass('hidden');
	    	
	        $('#garagingAddressData_'+vehIndex).addClass('hidden');
	        $('#altGaragingInd_'+vehIndex).val('');
	        
	    	$('#quoteSelectedState_'+vehIndex).val('');
	    	$('#vehAltGarageTown_'+vehIndex).val('');
	    }
	    
	    if ($(".altGaragingInd:checked").length == 0) {
	    	$('.garagingCityName_Row').addClass('hidden');
			$('#garagingAddressData_Error').addClass('hidden');
			//$('.garagingZipCode_Error').addClass('hidden');
	    } else {
	        //if atleast one column is checked the whole row should be visible.
			$('.garagingCityName_Row').removeClass('hidden');
			$('#garagingCityName_Error').removeClass('hidden');
	    }
	} else { // QUOTE 
		if((!ignoreRMVTown) && (residentialTown != undefined && residentialTown != null && residentialTown.length>1) ){
			if(garagingCity != null && garagingCity != undefined && garagingCity.length>1 && altGarageInd=='Yes'){
				//$('#garagingCityName_'+vehIndex).val(garagingCity).trigger('chosen:updated');
				//$('#garagingCity_'+vehIndex).val(garagingCity);
			}else{
//				$('#garagingCityName_'+vehIndex).val(rmvGaragingTown).trigger('chosen:updated');
//				$('#garagingCity_'+vehIndex).val(rmvGaragingTown);
//				$('#altGaragingInd_'+vehIndex).prop('checked',true);
			}
		}
		//validateGaragingCityName(garagingCity,getColumnIndexNoHeader($('#garagingCityName_'+vehIndex).parent()));
	
		if ($('#altGaragingInd_'+vehIndex).prop('checked')) {
				//var typeVal = $("#vehTypeCd_" + vehIndex).val();
				$('#garagingCityName_'+vehIndex).removeClass('hidden');
				$('#garagingAddressData_'+vehIndex).removeClass('hidden');
				addPreRequiredStyle($('#garagingCityName_'+vehIndex));
				$('#altGaragingInd_'+vehIndex).val('Yes');
			} else  {
				    	$('#garagingCityName_'+vehIndex).val('').trigger('chosen:updated');
				    	$('#garagingCityName_'+vehIndex).addClass('hidden');
				    	$('#garagingCityName_Error_Col_'+vehIndex).empty();
				    	$('#garagingAddressData_Error_Col_'+vehIndex).empty();
				    	
				    	$('#garagingAddress1_'+vehIndex).val('');
				    	$('#garagingAddress2_'+vehIndex).val('');
				    	$('#garagingZipCode_'+vehIndex).val('');
				    	$('#garagingCity_'+vehIndex).val('');
				    	$('#garagingState_'+vehIndex).val('');
				    	
				    	$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text('');
						$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected' ).addClass('hidden');
						$('#garagingAddressData_'+vehIndex+' .garagingAddressNew' ).removeClass('hidden');
				    	
				        $('#garagingAddressData_'+vehIndex).addClass('hidden');
				    	removePreRequiredStyle($('#garagingCityName_'+vehIndex));
				    	$('#altGaragingInd_'+vehIndex).val('');
				    	$('#quoteSelectedState_'+vehIndex).val('');
				    	$('#vehAltGarageTown_'+vehIndex).val('');
		    }
			showHideField('garagingCityName', vehIndex, $('#altGaragingInd_'+vehIndex).prop('checked'));
			if ($(".altGaragingInd:checked").length == 0) {
				$('.garagingCityName_Row').addClass('hidden');
		 		$('.garagingCityName_Error').addClass('hidden');
		     } else {
		         //if atleast one column is checked the whole row should be visible.
		 		$('.garagingCityName_Row').removeClass('hidden');
		 		$('.garagingCityName_Error').removeClass('hidden');
		     }	
			}
}

function showHideMotorInfo(motorClubInd, actn){
					
	if ($(motorClubInd).prop('checked')) {
		$('.clsMotorClub_Row').removeClass('hidden');		
		//48809 - 500 error for motor club date
		if($('#firstTimeThru').val() != 'true'){
			validateMotorClubName();
			validateMotorMembershipDate();
		}
	}else{
		$('#motorClubName_0').val('');
		$('#motorClubName_0_Error_Col').addClass('hidden');
		$('#motorClubName_0').removeClass("inlineError").trigger('chosen:updated');
		$('#motorClubMembershipDate_0_Error_Col').addClass('hidden');
		$('#motorClubMembershipDate_0').removeClass("inlineError");
		$('.clsMotorClub_Row').addClass('hidden');			
	}

}

function showHideCellPhoneInfo() {
	var yubiIndChecked = false;
	
	$( ".yubiDriverInd" ).each(function( driverIndex ) {
	    if ($('#yubiDriverInd_' + driverIndex).prop('checked')) {
			$('#cellphoneNumber_' + driverIndex).removeClass('hidden');
			addPreRequiredStyle($('#cellphoneNumber_'+driverIndex));
			
			yubiIndChecked = true;
	    }  else  {
		   	$('#cellphoneNumber_'+driverIndex).addClass('hidden');
		   	$('#cellphoneNumber_Error_Col_'+driverIndex).empty();
		   	removePreRequiredStyle($('#cellphoneNumber_'+driverIndex));
	    }
	    showHideField('cellphoneNumber', driverIndex, $('#yubiDriverInd_' + driverIndex).prop('checked'));
	});
	
	if (yubiIndChecked) {
		$(".cellphoneNumber_Row").show();
	} else {
		$(".cellphoneNumber_Row").hide();
	}
}

function validateMotorClubName(){
	var errorMessageID = '';
	if($("#motorClubInd").prop('checked') && $('#motorClubName_0').val() == ''){
		//$('#motorClubName_0').addClass("preRequired");		
		$('#clsMotorNameError_Row').removeClass("hidden");		
		errorMessageID="motorClubName.browser.inLine.REQUIRED_FIELD";		
	}else{
		//$('#motorClubName_0').removeClass("preRequired");		
		$('#clsMotorNameError_Row').addClass("hidden");		
		errorMessageID="";
	}
	triggerChangeEvent($('#motorClubName_0'));
	showClearInLineErrorMsgsWithMap($('#motorClubName_0').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
}


function validateAgentReviw(rentersAgentReview){
	var rentId = rentersAgentReview.id;
	var rentVal = $('#'+rentId).val();
	var errorMessageID = '';
	if(!isValidValue(rentVal)){
		errorMessageID = 'rentersEndEligReviewResult.browser.inLine.required'; 
	}
	//validate('',rentersAgentReview, 'Yes', errorMessageID, fieldIdToModelErrorRow['defaultSingle'], '');
	showClearInLineErrorMsgsWithMap(rentId, errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
}

function validateTeachersEligiblityGroup(){
	var errorMessageID = '';
	if($('#clientEligibilityGroupId').val() != undefined && $('#eduInstitutionGroupId').val() != undefined && ($('#clientEligibilityGroupId').val() == '' && $('#eduInstitutionGroupId').val() == '') && $('#eligibilityInd').val() == 'Yes'){		
		$('#clsclientEligibilityGroupIdError_Row').removeClass("hidden");		
		errorMessageID="clientEligibilityGroupId.browser.inLine.required";		
	}else{		
		$('#clsclientEligibilityGroupIdError_Row').addClass("hidden");		
		errorMessageID="";		
	}
	triggerChangeEvent($('#clientEligibilityGroupId'));
	
	showClearInLineErrorMsgsWithMap($('#clientEligibilityGroupId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
		
}

function validateTeachersEligiblityDistrict(){
	var errorMessageID = '';
	if($('#clientDistrictTownId').val() != undefined && $('#eduInstitutionDistrict').val() != undefined && ($('#clientDistrictTownId').val() == '' && $('#eduInstitutionDistrict').val() == '')&& $('#eligibilityInd').val() == 'Yes' && $('#clientDistrictTownId').not( ":hidden" ) && !$('#clientDistrictTownId').is(':disabled')){	
		$('#clsclientDistrictTownIdError_Row').removeClass("hidden");		
		errorMessageID="clientDistrictTownId.browser.inLine.required";		
	}else{		
		$('#clsclientDistrictTownIdError_Row').addClass("hidden");		
		errorMessageID="";
	}
	triggerChangeEvent($('#clientDistrictTownId'));
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
}

function validateTeachersEligiblityInstitution(){
	var errorMessageID = '';
	if($('#clientInstitutionNameId').val() != undefined && $('#clientInstitutionId').val() != undefined && ($('#clientInstitutionNameId').val().length < 1 && $('#clientInstitutionId').val().length < 1) 
			&& $('#eligibilityInd').val() == 'Yes' && $('#clientInstitutionNameId').not( ":hidden" )
			&& !($('#clientInstitutionNameId').val() == 'RR' && $('#clientInstitutionId').val() == 'RR')){		
		$('#clsclientInstitutionNameIdError_Row').removeClass("hidden");		
		errorMessageID="clientInstitutionNameId.browser.inLine.required";		
	}else{		
		$('#clsclientInstitutionNameIdError_Row').addClass("hidden");		
		errorMessageID="";
	}
	triggerChangeEvent($('#clientInstitutionNameId'));
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addRemoveDetailsRow);
}

var addDeleteCallback = function(row, addIt) {
	//alert('what i waana do with call back?');
};

var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"errorRow fieldRowError\"><td class=\"fieldColError\" id=\"Error_Col\"></td></tr>"
	};

function showHideDetailDiscountInfo(motorClubInd, affGroup){
	/*if ($(motorClubInd).prop('checked') || ($(affGroup).val() != "" && $(affGroup).val() != "None")) {
		$('div.clsratingDiscountDiv').removeClass('hidden');
	}else{
		$('div.clsratingDiscountDiv').addClass('hidden');
	}
	
	if($(motorClubInd).prop('checked')){
		$('.motorClubMemberInfo').removeClass('hidden');
	}else{
		$('.motorClubMemberInfo').addClass('hidden');
		$('#motorClubName_0').val('');
		if($('#motorClubMembershipDate_0').length > 0){
			$('#motorClubMembershipDate_0').remove();
		}	
	}
	
	if($(affGroup).val() != ""){
		$('.affGroupMembership').removeClass('hidden');
	}else{
		$('.affGroupMembership').addClass('hidden');
	}*/
	
	//TD 52250 fix - Application Layer - Affinity Group and Motorclub info missing from the Application page - User has to navigate to the Details tab to enter
	//Update NJ Agreed to align chg w/ MA Implementation - always show Affinity on App layer.

	$('div.clsratingDiscountDiv').removeClass('hidden');
	$('.motorClubMemberInfo').removeClass('hidden');
	$('.affGroupMembership').removeClass('hidden');
}

function getVehicleHeader(vehicleIndex) {
	return $("#vehicleHeaderInfo_" + vehicleIndex).html();
}

function getVehicleIndex(id) {
	return getFieldIndex(id);
}

function checkErrorsAndSave(){
	// function checks if error exist in application tab
	$.ajax({
		url: "/aiui/application/checkErrors",
		type:'POST',
		data: $("#aiForm").serialize(),
	
	   beforeSend: function(status, xhr){
		     blockUser();
	    },
	    async:false,
		success: function(response){
			//var msg = "Errors Checked Successfully.";
			if(response == 'Yes'){
				//Error Exist, display confirm dialog		
				redirectToApplication();
			}else{
				$('#errorConfirmDlg').modal('hide');
				document.aiForm.rateFlagInd.value = 'Yes';
				//No Error Exist, save the info				
				nextTab(document.aiForm.currentTab.value, "rate");
			}
		},
	
		error: function(data){
			$.unblockUI();
			alert("Failed to check errors");	
		},

	});
}

//Redirect back to Application if errors exist
function redirectToApplication(){
	document.aiForm.action = '/aiui/application/redirectToApplication/' + encodeURI(document.aiForm.policyKey.value);
	document.aiForm.method="POST";
	document.aiForm.submit();	
}

function processAppDetailsElibilityQuestions(event, action) {
	
	var badMessage = '';
	var stateCd = $('#stateCd').val();
	
	//48833 - For question 1,2,3 Vehicle, After elgibility edit fired on new vehicle fields on the existing vehicles became enabled when they were disabled.
	if ($('#eligbQ1').prop('checked') && stateCd != STATE_MA && stateCd != STATE_NH) {
		badMessage= badMessage + '1,';		
	} if ($('#eligbQ2').prop('checked') && stateCd != STATE_NH) {
		badMessage= badMessage + '2,';		
	} if ($('#eligbQ3').prop('checked') && stateCd != STATE_NH) {
		badMessage= badMessage + '3,';		
	}  if ($('#eligbQ4').prop('checked') && stateCd == STATE_NJ) {
		badMessage= badMessage + '4,';		
	}  if ($('#eligbQ5').prop('checked') && $('#eligbQ6').prop('checked') && stateCd == STATE_NH) {
		badMessage= badMessage + '5,';
		showNHMessage = false;
	}  if (!$('#eligbQ5').prop('checked') && !$('#eligbQ6').prop('checked') && stateCd == STATE_NH) {
		badMessage= badMessage + '6,';
	}
	
	//var errMsgId = "appmessage" + badMessage;	
	var msg_array = badMessage.split(',');
	
	if (badMessage != '') {
		if(action == 'submit'){
			event.stopPropagation();
		}		
		$('.appEligibilityErrorMsg').addClass('hidden');
		
		//$('#'+errMsgId+'').removeClass('hidden');
		for(var i = 0; i < msg_array.length; i++)
		{
		   // Trim the excess whitespace.
			msg_array[i] = msg_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   // Remove hidden fields for respective messages
		   $('#appmessage'+msg_array[i]).removeClass('hidden');
		}
		
		
		$('#appEligibilityErrorsModal').modal();
		return false;
	}
		$('#appEligibilityErrorsModal').modal('hide');
		return true;
}

function showHideChosenContainer(id, showit) {
	if(showit) {
		
		$('#'+id+'_chosen').removeClass('chosenDropDownHidden');
		
	} else {
		
		$('#'+id+'_chosen').addClass('chosenDropDownHidden');
	}
	
}

function showOrHideOtherCarrier(strElm, actn) { 
	var lastIndex;		
	var strPolicyState;
	var strDrvrStatus;
		
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
	strDrvrStatus = getDrvrStatus(lastIndex);
	var otherPolicyCarrName = "#otherPolicyCarrName_" + lastIndex;
	
	if (strDrvrStatus == INSURED_ELSE_WHERE) {
		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'show');
		showOrHideHtml(otherPolicyCarrName, 'show');
		addRemovePreRequired(otherPolicyCarrName, actn);
		triggerChangeEvent($(otherPolicyCarrName));
		
		return;
	}
		showOrHideHtml(otherPolicyCarrName, 'hide');
		showClearInLineErrorMsgsWithMap(strElm.id, '', $('#defaultDriverMulti').outerHTML(),
				getColumnIndexNoHeader($(strElm).parent()), errorMessages, addRemoveDriverRow);
	
	// show or hide other carrier row
	////showOrHideFieldRow('clsOtherCarrierRow', 'clsOtherCarrierSelect');
	var blnShowRow = false;
	
	$('select.clsOtherCarrierSelect').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strDrvrStatus = getDrvrStatus(lastIndex);
		 
		 if ((strDrvrStatus == INSURED_ELSE_WHERE)
		 && (strPolicyState == STATE_CT || strPolicyState == STATE_NH 
			 || strPolicyState == STATE_NJ || strPolicyState == STATE_MA || strPolicyState == STATE_PA)) {	//PA_AUTO PA follows NJ
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'hide');
	}	
}

function getPolicyState() {
	var strPolicyState = $("#policyStateCd").val();
	return strPolicyState;
	
}


function isRated(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	// INSURED ON THE POLICY OR SUSPENDED OPERATOR
	return (strDrvrSatus == 'INS_POL' || strDrvrSatus == 'R');
}

function isDeferred1(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	//Insured on Another PRAC Policy or Insured Elsewhere or Revoked Operator or No Longer Licensed
	return (strDrvrSatus == 'Y' || strDrvrSatus == 'W' || strDrvrSatus == 'RO' || strDrvrSatus == 'NLL');
}

function validateFinancialInterest(name, zip, address, city){
    
    var isError = false;
    
	if(name == ''){
		$('div#nameErrormessage').text("Name is required.");
		isError = true;
	}
    
    if(zip == ''){
        $('div#zipErrormessage').text("A numeric 5 digit Zip value is required.");
        isError = true;
    }else if(!($.isNumeric(zip)) || zip.length < 5 || zip.length > 5){
        $('div#zipErrormessage').text("A numeric 5 digit Zip value is required.");
        isError = true;
    }
    
    if(address == ''){
        $('div#addressErrormessage').text("Address is required");
        isError = true;
    }
    
    if(city == ''){
        $('div#cityErrormessage').text("City is required");
        isError = true;
    }
    
    return isError;
}

function enableDataField (strElm) {
	$(strElm).prop('disabled', false);
	$(strElm).trigger('chosen:updated');	
}

function disableDataField (strElm) {
	$(strElm).prop('disabled', true);	
	$(strElm).trigger('chosen:updated');	
}

//This function overrides the one under validation.js
//This will make sure the largest error map is considered
function getErrorRowWithMap(pageErrorInfoItem, errorRowMap){
	var strWork = "";
	strWork = errorRowMap[pageErrorInfoItem.fieldID];
	if (strWork == null || strWork.length == 0 || strWork ==undefined){
		strWork = errorRowMap[getPreFix(pageErrorInfoItem.fieldID)];
		if (strWork == null || strWork.length == 0 || strWork ==undefined){
			if(pageErrorInfoItem.index == -1){				
				strWork = errorRowMap.defaultSingle;		
			}else{
				if($('#driverCount').val() > $('#vehicleCount').val()){
					strWork = errorRowMap.defaultDriverMulti;
				}else{
					strWork = errorRowMap.defaultVehicleMulti;
				}
			}
		}
	}
	return strWork;
}

function validateMotorMembershipDate(){
	$('.vehicleErrorRow').addClass('hidden');
	validateMCSDate('',$('#motorClubMembershipDate_0'), 'Yes', 'motorClubMembershipDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1);
}

function validateMCSDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	errorMessageID = isValidMembershipDate(elementId, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap($('#motorClubMembershipDate_0').attr('id'), errorMessageID, strErrorRow,-1, errorMessages, addRemoveDetailsRow);
	//showClearInLineErrorMsgsWithMap($('#motorClubMembershipDate_0_Error').attr('id'), errorMessageID, strErrorRow,-1, errorMessages, addRemoveDetailsRow);
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

function checkMotorClubMembershipValidRange(elementId){
	//var strMsg = '';
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
    
   return ''; 
 }

function setTabIndexClient() {
	var selector =  $('#clientRowHeaderTable > tbody > tr') ;
	var tabOrderElements = $('.tabOrder' , selector);
	tabOrderElements.each(function() {
		 if($(this).is('select:not(select[multiple])') ){
			 var chosenContainer = $(this).next();// this will be the container for the dropdown
			 chosenContainer.find('a').attr('tabindex',tabIndex++);
		 } else {
			 $(this).attr("tabindex", tabIndex++);		
		 }
	});

}

function setTabIndexDrivers(startColumn,endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);

	for (var i = startColumn; i <= endColumn; i++) {
		
		 var selector =  $('#driverMainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		 var tabOrderElements = $('.tabOrder' , selector);
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])')){
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);		
			 }
			
		  });
	}
	
	$('.clsDriverIndex').attr("tabindex", tabIndex++);
}

function setTabIndexVehicle(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);
	
	for (var i = startColumn; i <= endColumn; i++) {
		 var selector =  $('#vehicleMainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		 var tabOrderElements = $('.tabOrder' , selector);
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])')) {
				 $(this).attr('tabindex',-1);
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);		
			 }
			 		
		  });
	}
	
	$('.clsVehicleIndex').attr("tabindex", tabIndex++);
	
	$('#iiTypeCd').next().find('a').attr('tabindex',tabIndex++);
	$('#iiName1').attr('tabindex',tabIndex++);
	$('#iiName2').attr('tabindex',tabIndex++);
	$('#iiAddress1').attr('tabindex',tabIndex++);
	$('#iiAddress2').attr('tabindex',tabIndex++);
	$('#iiZip').attr('tabindex',tabIndex++);
	$('#iiCity').attr('tabindex',tabIndex++);
	$('#iiState').next().find('a').attr('tabindex',tabIndex++);
	$('#iiFid').attr('tabindex',tabIndex++);
	$('#iiLoanNumber').attr('tabindex',tabIndex++);
	$('#saveIIAndNew').attr('tabindex',tabIndex++);
	$('#saveIIAndClose').attr('tabindex',tabIndex++);
	$('#cancelII').attr('tabindex',tabIndex++);
}

function setTabIndexCoverages(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);
	
	for (var i = startColumn; i <= endColumn; i++) {
			  
		 var selector =  $('#coverageMainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		 var tabOrderElements = $('.tabOrder' , selector);
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])')) {
				 $(this).attr('tabindex',-1);
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);		
			 }
			 		
		  });
	}
	
	$('.clsVehicleIndex').attr("tabindex", tabIndex++);
}

function setupTabbingBehaviorDriver() {
	
	// Scroll to top after tabbing out of last field in a column
	$(".clsOccupation").keydown(function(e){
		if(e.shiftKey == false && e.keyCode ==9) {
			var sr22ColumnId = $(this).attr('id');
			var currentColumn = Number(sr22ColumnId.charAt(11,12));
			if (currentColumn >1){
				$('#firstDriver').val(currentColumn -1);
				$("#rightScrollBtn").trigger('click');
			}
		}
	});
	
	// Scroll to bottom after tabbing into last field in a column
	$(".clsOccupation").keyup(function(e){
	    if(e.shiftKey == true && e.keyCode ==9) {
	        if($("#leftScrollBtn").length == 1) {
	        	var checkboxId = $(this).attr('id') ? $(this).attr('id') : '';
	        	var scrollPosHtml = $.trim($('#scrollPos').html());
	        	var currentColumn = Number(checkboxId.charAt(checkboxId.length-1))+1;
	        	firstColumn = Number(scrollPosHtml.charAt(8));
	        	if(scrollPosHtml.charAt(13) == " ") {
    				lastColumn = Number(scrollPosHtml.charAt(12));
    				columnCount = Number(scrollPosHtml.substring(17));
    			} else { 
    				lastColumn = Number(scrollPosHtml.substring(12, 14));
    				columnCount = Number(scrollPosHtml.substring(18));
    			}
	        	if(checkboxId && checkboxId != '' && currentColumn < firstColumn) {
	        		// Scroll right
		        	$("#leftScrollBtn").trigger('click');
	        		// Focus on the first field of next column
	        		setFocus('occupation_' + currentColumn);
	        		e.preventDefault();
	        	}
	        }
	    }
	});
	
}

function setupTabbingBehaviorVehicle() {
	
	// Scroll to top after tabbing out of last field in a column
	$(".snowplowEquipInd").keydown(function(e){
	    if(e.shiftKey == false && e.keyCode ==9) {
	        $(window).scrollTop(0);
	        if($("#rightVehicleScrollBtn").length == 1 && !$('#scrollPanel').hasClass('hidden')) {
	        	var checkboxId = $(this).attr('id') ? $(this).attr('id') : '';
	        	var scrollPosHtml = $.trim($('#scrollPos').html());
	        	var currentColumn = Number(checkboxId.charAt(checkboxId.length-1))+1;
	        	//var nextColumn = currentColumn + 1;
	        	firstColumn = Number(scrollPosHtml.charAt(9));
	        	if(scrollPosHtml.charAt(14) == " ") {
		    		lastColumn = Number(scrollPosHtml.charAt(13));
		    		columnCount = Number(scrollPosHtml.substring(18));
		    	} else { 
		    		lastColumn = Number(scrollPosHtml.substring(13, 15));
		    		columnCount = Number(scrollPosHtml.substring(19));
		    	}
	        	if(checkboxId && checkboxId != '' && currentColumn == lastColumn) {
	        		// Scroll right
		        	$("#rightVehicleScrollBtn").trigger('click');
	        	}
	        }
	    }
	});
	
	// Scroll to bottom after tabbing into last field in a column
	$(".snowplowEquipInd").keyup(function(e){
	    if(e.shiftKey == true && e.keyCode ==9) {
	        if($("#leftVehicleScrollBtn").length == 1) {
	        	var checkboxId = $(this).attr('id') ? $(this).attr('id') : '';
	        	var scrollPosHtml = $.trim($('#scrollPos').html());
	        	var currentColumn = Number(checkboxId.charAt(checkboxId.length-1))+1;
	        	var prevColumn = currentColumn - 1;
	        	firstColumn = Number(scrollPosHtml.charAt(9));
	        	if(scrollPosHtml.charAt(14) == " ") {
		    		lastColumn = Number(scrollPosHtml.charAt(13));
		    		columnCount = Number(scrollPosHtml.substring(18));
		    	} else { 
		    		lastColumn = Number(scrollPosHtml.substring(13, 15));
		    		columnCount = Number(scrollPosHtml.substring(19));
		    	}
	        	if(checkboxId && checkboxId != '' && currentColumn > firstColumn) {
	        		// Scroll right
		        	$("#leftVehicleScrollBtn").trigger('click');
	        		// Focus on the first field of next column
	        		setFocus('snowplowEquipInd_' + prevColumn);
	        		e.preventDefault();
	        	}
	        }
	    }
	});
	
}

function processAppTeacherElibilityQuestions(event, action) {
	
	var badMessage = '';

	if ($('#eligibilityNo').is(":checked") && $('#uwCompanyCd').val() == "ALN_TEACH") {
		badMessage= badMessage + '2,';		
	} if ($('#eligibilityNo').is(":checked") && $('#uwCompanyCd').val() == "ALN_TEACH" && $('#channelCd') == 'Captive') {
		badMessage= badMessage + '1,';		
	}	
	//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
	if (!$('#eligibilityNo').is(":checked") && !$('#eligibilityYes').is(":checked") && $('#uwCompanyCd').val() == "ALN_TEACH")
	{
		badMessage= '2,';		
	}
	//var errMsgId = "appmessage" + badMessage;	
	var msg_array = badMessage.split(',');
	
	if (badMessage != '') {
		if(action == 'submit'){
			event.stopPropagation();
		}		
		$('.teacherEligibilityErrorMsg').addClass('hidden');
		
		//$('#'+errMsgId+'').removeClass('hidden');
		for(var i = 0; i < msg_array.length; i++)
		{
		   // Trim the excess whitespace.
			msg_array[i] = msg_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   // Remove hidden fields for respective messages
		   $('#teachersmessage'+msg_array[i]).removeClass('hidden');
		}
		$('#teacherEligibilityErrorsModal').modal();
		return false;
	}
		$('#teacherEligibilityErrorsModal').modal('hide');
		return true;
	
}

function setTabIndexForAllSections(calledFrom){
	setTabIndexClient();
	setTabIndexDrivers("1", $('#driverCount').val());
	setTabIndexVehicle("1", $('#vehicleCount').val());
	setTabIndexCoverages("1", $('#vehicleCount').val());
}

/* AARP logic */
function checkIfValidAARPMember(){
	var aarpNo = $('#aarpMembershipNumber').val();	
	var policyKeyId = $('#policyKeyId').val();
	var message='';
	var mode = "NB";
	
	$('#aarpMembershipNumber').removeClass("inlineError");
	$('#pageAlertMessage').hide();
	$.ajax({	        
		url: '/aiui/aarp/validate',
        type: "GET",
        data: "policyKey=" + policyKeyId + "&aarpNumber=" + aarpNo + "&mode=" + mode,
        cache: false,
        beforeSend:function(status, xhr){
			blockUser();
		},
        success: function(response, textStatus, jqXHR){	 
        	message=response;	    		
        },
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(){
        	displayAARPSvcMessage(message);
        	$.unblockUI();
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

function displayAARPSvcMessage(aarpMemberStatus){
	var msg;

	if(aarpMemberStatus == '0'){
		msg = "Membership number validated";
		$('#aarpValidationMessageID').html(msg).addClass("aarpSuccessMsg").removeClass("aarpErrMsg");
		$('#validateAARP').attr('disabled', 'true');
	} else if((aarpMemberStatus == 'NF') || (aarpMemberStatus == '4')){
		msg = "AARP Member Number is not valid. Please enter a valid number or remove AARP as the affinity.";
		$('#aarpValidationMessageID').html(msg).addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
		$('#validateAARP').removeAttr('disabled');
	} else if(aarpMemberStatus == '5'){
		msg = "AARP membership number is recently expired. The customer must have an active AARP membership to obtain this discount.";
		msg = msg + " The customer may renew his membership using the link provided or remove AARP as the affinity.";
		$('#aarpValidationMessageID').html(msg).addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
		$('#validateAARP').removeAttr('disabled');
	} else if(aarpMemberStatus.toUpperCase() == 'ERROR'){
		msg = "We are unable to validate client membership at this time. Please try again at a later time and if the issue persists, contact us at 866-353-6292.";
		$('#aarpValidationMessageID').html(msg).addClass("aarpErrMsg").removeClass("aarpSuccessMsg");
		$('#validateAARP').removeAttr('disabled');
	}
	
	$('#aarpMembershipStatus').val(aarpMemberStatus);
	$("#aarpMembershipNumber_Error").hide();
}

function showHideAARPFields(){
	if($('#isMotorCycleAvailableId').val()=='Yes'){
		$('#affinityCD').val('');
		$('#affGroupMsg').html('AARP affinity is not available on quotes that include a motorcycle.').addClass("aarpErrMsg");
		$('.aarpMembershipNumberInfo').addClass('hidden');
		$('#aarpMembershipNumber').val('');
		$('#aarpMembershipStatus').val('');
		$("#aarpMembershipNumber_Error").hide();
	}else{
		$('.aarpMembershipNumberInfo').removeClass('hidden');
		$('#aarpMembershipNumber').removeClass("inlineError");
	}
}

function validateGaragingCityName(garagingCityName, columnIndex) {
	var garagingCityName = $('#garagingCityName_' + columnIndex).val();
	//var rmvGaragingTown = $('#rmvGaragingTown_'+columnIndex).val();
	$('#garagingCity_'+columnIndex).val(garagingCityName);
	
	var isAltGarageChecked = $('#altGaragingInd_'+columnIndex).prop('checked');
	var errorMessageID =  '';
	if(isAltGarageChecked && (garagingCityName == undefined || garagingCityName == null || garagingCityName.length <= 1)){
		errorMessageID = 'garagingCityName.browser.inLine.resiTownAltGarageTownMismatch';
	}
	showClearInLineErrorMsgsWithMap('garagingCityName_'+columnIndex, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],columnIndex, errorMessages, addRemoveVehicleRow);
	alignRows();
}

function showHideField(fieldType, vehicleIndex, showIt) {
	var fieldId = fieldType + '_' + vehicleIndex;
	showHideFieldId(fieldId, $('#' + fieldId), showIt);
}

function showHideFieldId(fieldId, field, showIt) {
	if (showIt) {
		field.removeClass("hidden");
		
		if(field.hasClass('dropDownMultiSelect')){
			addDropdownCheckListForCol(field);
			showHideMultiChosenContainer(fieldId, true);
		}else{
			showHideChosenContainer(fieldId, true) ;
		}
	} else {
		field.addClass("hidden");
		
		if(field.hasClass('dropDownMultiSelect')){
			showHideMultiChosenContainer(fieldId, false);
		}else{
			showHideChosenContainer(fieldId, false);
		}

		//If the field is hidden then error messages corresponding to them should be cleared.
		var index = getIndexOfElementId("#"+fieldId);
		var strRowName = fieldId.replace("_" + index, "");
		showClearInLineErrorMsgsWithMap(fieldId, '', strRowName+'.browser.inLine',
				index*1, errorMessages, addRemoveVehicleRow);
	}
}

function showOrHideAccPrevCourseDt(strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	
	if ($(strElm).is(":checked")) {
		
		var ctxP = $('#ctxPath').val();
		var imgPath = window.location.protocol + "//" + window.location.host+ctxP;
		
		$("#accidentPrvntCourseDt_" + lastIndex).datepicker({
			showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
			dateFormat: 'mm/dd/yy',showButtonPanel : true
		});
		
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'show');
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'show');
		$("#accidentPrvntCourseDt_" + lastIndex).css('display', '');
		showOrHideHtml("#accidentPrvntCourseDtNA_" + lastIndex, 'hide');
    }
	else {
		$("#accidentPrvntCourseDt_" + lastIndex).val("");		
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'hide');
		//clear if in line error any since hiding
		clearColumnInLineError("#accidentPrvntCourseDt_" + lastIndex);
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('clsAccPrvCourseDtRow', 'clsAccPrevCourseChkBox');	
}

function showOrHideAccPrevCrseChkBoxes(strElm) {
	var lastIndex;	
	var elmDt;
	var elmDtVal; 		
	var blnIsValid;
	var intAge;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#birthDate_" + lastIndex);
	elmDtVal = $("#birthDate_" + lastIndex).val();
	blnIsValid = validateDateEntry(elmDt);
		
	if ((elmDtVal == '') || (!blnIsValid)) {	
		showOrHideHtml("#accidentPrvntCourseNA_" + lastIndex, 'show');
		
		if ($("#accidentPrvntCourse_" + lastIndex).is(":checked")) {
			$("#accidentPrvntCourse_" + lastIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#accidentPrvntCourse_" + lastIndex).trigger('change');
		}
		//$("#accidentPrvntCourse_" + lastIndex).hide();	
		showOrHideHtml("#accidentPrvntCourse_" + lastIndex, 'hide');
	}
	else {
		
		// check if age is >= 60 years and policy state is CT		
		intAge = calculateAge(elmDtVal,$('#policyEffDt').val());
		if ((parseInt(intAge) >= 60) && (getPolicyState() == STATE_CT) && (getDrvrStatus(lastIndex) == 'INS_POL')) {	
			showOrHideHtml("#accidentPrvntCourseNA_" + lastIndex, 'hide');
			showOrHideDrvrTableRow('clsAccPrvCourseRow', 'show');
			showOrHideHtml("#accidentPrvntCourse_" + lastIndex, 'show');
		}
		else {			
			//$("#accidentPrvntCourseNA_" + lastIndex).show();
			showOrHideHtml("#accidentPrvntCourseNA_" + lastIndex, 'show');
			if ($("#accidentPrvntCourse_" + lastIndex).is(":checked")) {
				$("#accidentPrvntCourse_" + lastIndex).attr('checked', false);
				//trigger change event for checkbox to show/hide dependant row
				$("#accidentPrvntCourse_" + lastIndex).trigger('change');
			}
			//$("#accidentPrvntCourse_" + lastIndex).hide();
			showOrHideHtml("#accidentPrvntCourse_" + lastIndex, 'hide');
		}
	}
	
	// show or hide the AccPrvCourse chkboxes Row
	//showOrHideFieldRow('clsAccPrvCourseRow', 'clsAccPrevCourseChkBox');
	
	var blnShowRow = false;
	
	$('.clsAccPrevCourseChkBox').each(function() {		
		lastIndex = getIndexOfElementId(this);
		elmDt = $("#birthDate_" + lastIndex);
		elmDtVal = $("#birthDate_" + lastIndex).val();
		blnIsValid = validateDateEntry(elmDt);
		 
		if ((elmDtVal != '') && (blnIsValid)) {
			intAge = calculateAge(elmDtVal,$('#policyEffDt').val());
			if ((parseInt(intAge) >= 60) && (getPolicyState() == STATE_CT) && (getDrvrStatus(lastIndex) == 'INS_POL')) {
				blnShowRow = true;
				return true;
			}
		}
	});
	
	if (blnShowRow) {
		showOrHideHtml("#accidentPrvntCourseDtNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsAccPrvCourseRow', 'show');
	}
	else {
		showOrHideDrvrTableRow('clsAccPrvCourseRow', 'hide');
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'hide');
	}
}

//TNC Requirements
function showOrHideRowVehicleTncCompanyCd(){
	var display = false;
	$("select.vehicleTncUseInd").each(function() {
		if($(this).val() == 'Yes'){
			display = true;
		}
	});
	
	if(display){
		$('.vehicleTncCompanyCd_Row').show();
	}else{
		$('.vehicleTncCompanyCd_Row').hide();
	}
}

function showOrHideRowVehicleTncUsageLevel(){
	var display = false;
	$("select.vehicleTncUseInd").each(function() {
		if($(this).val() == 'Yes'){
			display = true;
		}
	});
	
	if(display){
		$('.vehicleTncUsageLevel_Row').show();
	}else{
		$('.vehicleTncUsageLevel_Row').hide();
	}
}

function showOrHideRowVehicleTncDriverName(){
	var display = false;
	$("select.vehicleTncUseInd").each(function() {
		if($(this).val() == 'Yes'){
			display = true;
		}
	});
	
	if(display){
		$('.vehicleTncDriverName_Row').show();
	}else{
		$('.vehicleTncDriverName_Row').hide();
	}
}

function enableHiddenVars(){
	$('input.clsLicenseNumber[disabled]').prop('disabled',false);
	$('input.vinInput[disabled]').prop('disabled', false);
	
}

function validateAccidentPrvntCourseDt(accidentPrvntCourseDt){
	
	var errorMessageID = '';
	
	var lastIndex = getIndexOfElementId(accidentPrvntCourseDt);
	
	if( $("#accidentPrvntCourse_" + lastIndex).is(":checked") )	{	
		if(trimSpaces($(accidentPrvntCourseDt).val()) == ''){
			errorMessageID="accidentPrvntCourseDt.browser.inLine.required";
		}
		
		else if (!validateDateEntry(accidentPrvntCourseDt)) {
			$(accidentPrvntCourseDt).val(""); 
			errorMessageID = 'accidentPrvntCourseDt.browser.inLine.formatShouldBeMM/DD/YYYY';
		}
		else if (!validateFutureDate(accidentPrvntCourseDt)) {
			$(accidentPrvntCourseDt).val(""); 
			errorMessageID = 'accidentPrvntCourseDt.browser.inLine.cannotBeInTheFuture';
		}
		else{
		
			var accPrvntCourseDt = Date.parse($(accidentPrvntCourseDt).val());
			var policyEffDt = Date.parse($("#policyEffDt").val());
			 
			var dateDifference = policyEffDt - accPrvntCourseDt; 
			var noOfDays = ((dateDifference % 31536000000) % 2628000000)/86400000;
			
			if (accPrvntCourseDt < policyEffDt) {
				var months = getMonthsDifference($(accidentPrvntCourseDt).val(), $("#policyEffDt").val());
				if (parseInt(months) > 12 || (parseInt(months) == 12 && noOfDays > 0 )) {
					$(accidentPrvntCourseDt).val(""); 
					errorMessageID =  'accidentPrvntCourseDt.browser.inLine.cannotBeGreaterThan12MonthsPrior';
				}
			}	
		
		}
		//alert("showing");
		
		showClearInLineErrorMsgsWithMap($(accidentPrvntCourseDt).attr('id'), errorMessageID, $('#defaultDriverMulti').outerHTML(),
				lastIndex, errorMessages, addRemoveDriverRow);
	} else {
		//alert("hiding");
		$("#accidentPrvntCourseDt_" + lastIndex).val("");		
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'hide');
		clearColumnInLineError("#accidentPrvntCourseDt_" + lastIndex);
	}
}

function clearColumnInLineError(strElementID) {
	
	if ($(strElementID).length > 0) {
		
		var columnIndex = getIndexOfElementId($(strElementID));
		
		// remove red line on element
		$(strElementID).removeClass('inlineError');
		
		// remove error message in in error row column
		var strRowName = strElementID.replace("_" + columnIndex.toString(), "");
		var strErrorColId = strRowName + '_Error_Col_' + columnIndex;
		
		if ($(strErrorColId).length > 0) {
			$(strErrorColId)
				.empty()
				.removeClass('inlineErrorMsg');	
		}
	}
}

function parseErrorRow(strRowName,strErrorColId)
{
	return true;
}

function validatePhoneNumber() {
	var phonenumbers = [];
	$( ".cellphoneNumber" ).each(function( driverIndex ) {
		if ($("#yubiDriverInd_" + driverIndex).prop('checked')) {
			var errorMessageID = '';		
			var cellPhoneNumber = $('#cellphoneNumber_' + driverIndex).val();

			if(cellPhoneNumber == null || cellPhoneNumber == "" || cellPhoneNumber =='Optional'){
				errorMessageID = 'cellphone.yubi.browser.inLine.required';
				showClearInLineErrorMsgsWithMap(this.id, 
						errorMessageID, 
						$('#defaultDriverMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			} else if (!/[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/.test(cellPhoneNumber)) {
				errorMessageID = 'cellphone.yubi.browser.inLine.invalid';
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultDriverMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			} else if ($.inArray(cellPhoneNumber, phonenumbers) != -1) {
				errorMessageID = 'cellphone.yubi.browser.inLine.unique';
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultDriverMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);				
			} else {
				phonenumbers.push(cellPhoneNumber);
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultDriverMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			}
			
			if (errorMessageID != '') {
				$('#driverRowHeaderTable > tbody > tr').eq(8).after("<tr><td>&nbsp;</td></tr>");
			}
		}
		
		addRemoveBindPreRequired();
	});
}

//This function is used for those field which are not required by default but are required conditionally.
function addRemoveBindPreRequired() {
	$( ".cellphoneNumber" ).each(function( driverIndex ) {
	
		if($("#yubiDriverInd_" + driverIndex).prop('checked') && $(this).val() == '') {
			 $(this).addClass('preRequired');
		}
		else {
			$(this).removeClass('preRequired');
		}
	});
}

function fmtPhone(elm,e) { 
	var phone = elm.value;
	var phoneId = elm.id;
	var re = /\D/g;
	if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112) {		
	} else {
		if(phone.length < 13) {
			var  splitDash = phone.split("-");
			if(splitDash.length==3 && splitDash[0].length<=3 && splitDash[1].length<=3 && splitDash[2].length<=4) {
				var pos = $(elm).getCursorPosition();
				$(elm).val(phone).caretTo(pos);
			} else {
				phone = phone.replace("-","").replace(re,"");
				if(phone.length >= 3) {
					if(phone.substr(3,1) != "-") {
						phone = phone.substr(0,3) + "-" + phone.substr(3);
					}
				}
				if(phone.length >=7) {
					if(phone.substr(7,1) != "-") {
						phone = phone.substr(0,7) + "-" + phone.substr(7);
					}
				}

				var pos = $('#'+phoneId).getCursorPosition();
				if(phone.length ==4 || phone.length ==8) {
					pos=pos+1;
				}
				$('#'+phoneId).val(phone).caretTo(pos);
			}
		}
	}
}

function fixCellphoneNumberFields() {
	$( ".cellphoneNumber" ).each(function( driverIndex ) {
		if (!$("#yubiDriverInd_" + driverIndex).prop('checked')) {
			$(this).val('');
		}
	});
}

function getYubiIndcIndexForSelectedTncDriver(tncDriverName) {
	var selectedDriverIndex = -1;
	$( ".yubiDriverInd" ).each(function( driverIndex ) {
		var names = tncDriverName.split(",");
		if ($('#firstName' + '_' + driverIndex).val() == names[0] && $('#lastName' + '_' + driverIndex).val() == names[1]) {
			selectedDriverIndex = driverIndex;
		}
	});
	return selectedDriverIndex;
}

//Unselect TNC Driver on Delete of Driver
function validateSelectedTncDriverOnDelete(yubiDriverIndElement) {
	//if ($(yubiDriverIndElement).prop('checked') == false) {
		// find the vehicle dropdown with the driver name and change it to "Select"
		var driverIndex = yubiDriverIndElement.split("_")[1];
		var driverName = $('#firstName_' + driverIndex).val() + "," + $('#lastName_' + driverIndex).val();
		
		$('.vehicleTncDriverName').each(function(vehicleIndex) {
			if ($('#vehicleTncDriverName_' + vehicleIndex).val() == driverName) {
				$('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex', 0).trigger('chosen:updated');
				handleVehicleTncDriverNameChange(this);
			}
			$('#vehicleTncDriverName_' + vehicleIndex +" option[value='" + driverName + "']").remove();
			$('#vehicleTncDriverName_' + vehicleIndex).trigger('chosen:updated');		
		});
	//}
}

function validateSelectedTncDriver(yubiDriverIndElement) {
	if(hasDeclinedTNC()){
		return;
	}
	if ($(yubiDriverIndElement).prop('checked') == false) {
		// find the vehicle dropdown with the driver name and change it to "Select"
		var driverIndex = yubiDriverIndElement.id.split("_")[1];
		var driverName = $('#firstName_' + driverIndex).val() + "," + $('#lastName_' + driverIndex).val();
		
		$('.vehicleTncDriverName').each(function(vehicleIndex) {
			if ($('#vehicleTncDriverName_' + vehicleIndex).val() == driverName) {
				$('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex', 0).trigger('chosen:updated');
				handleVehicleTncDriverNameChange(this);
			}
		});
	}
}

function handleVehicleTncDriverNameChange(vehicleTncDriverName) {
	if(hasDeclinedTNC()){
		return;
	}
	var vehicleIndex = getVehicleIndex(vehicleTncDriverName.id);
	if($('#vehicleTncUseInd_'+vehicleIndex).val() == 'Yes') {
		var selectedDriver = $('#vehicleTncDriverName_' + vehicleIndex).val();
		var driverIdIndex = $('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex');
		if (driverIdIndex > 0) {	
			var driverYubiIndcIndex = getYubiIndcIndexForSelectedTncDriver(selectedDriver);
			// 	if yubi indicator is not true for the selected driver, show inline error message
			if (!$('#yubiDriverInd_' + driverYubiIndcIndex).prop('checked')) {						
				showClearInLineErrorMsgsWithMap(vehicleTncDriverName.id, 
										'vehicleTncDriverName.browser.inLine.yubi.required', 
										$('#defaultVehicleMulti').outerHTML(),
										getColumnIndexNoHeader($(vehicleTncDriverName).parent()), 
										errorMessages, addRemoveVehicleRow);
			
				$('#yubiDriverInd_' + driverYubiIndcIndex).prop('checked', true);
				showHideCellPhoneInfo();
			} else {
				// clear TncDriverName error message
				clearColumnInLineError('#vehicleTncDriverName_' + vehicleIndex);
			}
		} else {
			validateRequiredWithMap(vehicleTncDriverName, 'vehicleTncDriverName.browser.inLine', $('#defaultVehicleMulti').outerHTML(),
				getColumnIndexNoHeader($(vehicleTncDriverName).parent()), errorMessages, addRemoveVehicleRow);
		}
	}
}

function hasDeclinedTNC(){
	vehicleCount = parseInt($('#vehicleCount').val());
	for(var i=0; i< vehicleCount; i++){
		if($('#tnccvg_' + i) != '' && $('#tnccvg_' + i).val() == 'D'){
			return true;
		}
	} 
}

//Life discount logic
function hideShowLifeDiscount(){
	if($('#chkBoxPruLife').attr('checked')){
		$('tr.pruLifeNumber').removeClass("hidden");
		$('tr#pruLifePolicyNum_0_Error').removeClass("hidden");
	}else{
		$('tr.pruLifeNumber').addClass("hidden");
		$('tr#pruLifePolicyNum_0_Error').addClass("hidden");
	}
}

function checkLifeDiscountField(){
	if(!$('#chkBoxPruLife').attr('checked')){
		$('#pruLifePolicyNum_0').val();
	}
}

function showOrHideYubiChkBoxes() {
	
	if ($('#yubiEnabled').val() == 'true') {
		if (getPolicyState() == STATE_NJ || getPolicyState() == STATE_PA) {
			var blnShowRow = false;
			
			$('.yubiDriverInd').each(function() {	
				var lastIndex;	
				lastIndex = getIndexOfElementId(this);
				
				if (getDrvrStatus(lastIndex) == 'INS_POL') {			
					showOrHideDrvrTableRow('clsYubiDriverIndRow', 'show');			
					showOrHideHtml("#yubiDriverInd_" + lastIndex, 'show');
					blnShowRow = true;
					return;
				} else {
					showOrHideHtml("#yubiDriverInd_" + lastIndex, 'hide');
				}
			});				
				
			if (blnShowRow) {
				showOrHideDrvrTableRow('clsYubiDriverIndRow', 'show');
			}
			else {
				showOrHideDrvrTableRow('clsYubiDriverIndRow', 'hide');
			}
		}
	}
}

//Life discount
function showOrHideLifeDiscount(){
	if($('#chkBoxPruLife').attr('checked')){
		$('tr.pruLifeNumber').removeClass("hidden");
		if($('#firstTimeThru').val() != 'true'){
			validatePruLifePolicyNumber();
		}
	}else{
		$('tr.pruLifeNumber').addClass("hidden");
		$('#pruLifePolicyNum_0_Error_Col').addClass('hidden');
		$('#pruLifePolicyNum_0').removeClass("inlineError");
	}
}

function checkLifeDiscountField(){
	if(!$('#chkBoxPruLife').attr('checked')){
		$('#pruLifePolicyNum_0').val();
	}
}

function syncAllProvider(cov){
	var newSelection = cov.value;
	var thisId = cov.id;
	var nextId;
	var n = thisId.lastIndexOf("_");
	var stub = thisId.substring(0, n+1);
	//select the id, of Type as _0,_1
	var idIndex = thisId.substring(n+1,n.length);
	var cols = '.multiTable';
	
	$('select[id^=' + stub + ']',cols).each(function() {
		if($(this).hasClass("clsPRINC_PIP_HCPNAMELimit")){
			nextId = this.id;
			
			if(nextId != thisId){
				n = nextId.lastIndexOf("_");
				stub = nextId.substring(0, n+1);
				idIndex = nextId.substring(n+1,n.length);
				$('#' + this.id).val(newSelection).trigger('chosen:updated');
				
			}
		}
	});	
	
	$('input[id^=' + stub + ']',cols).each(function() {
		if($(this).hasClass("healthCareProviderName")){
			nextId = this.id;
			
			if(nextId != thisId){
				n = nextId.lastIndexOf("_");
				stub = nextId.substring(0, n+1);
				idIndex = nextId.substring(n+1,n.length);
				$('#' + this.id).val(newSelection);				
			}
		}
	});	
}

function validateHCPDD(cov){
	var newSelection = cov.value;
	var thisId = cov.id;
	n = thisId.lastIndexOf("_");
	
	if(newSelection != 'Other'){
		var pipVal = $("#PRINC_PIP_0").val();
		
		var newPipValue;
		
		var isMedical = pipVal.includes("Medical");
		if(isMedical){
			newPipValue = "Primary Medical Expense Only"
		}else{
			newPipValue = "Primary Full PIP"
		}
		showPopUpforPipUpdate(pipVal)
	}else{

		$('.HC_Provider').removeClass('hidden');
		$('.HC_Provider_Number').removeClass('hidden');
		
		//$('.PRINC_PIP').removeClass('hidden');
		$('.COVERAGE_SECTION').removeClass('hidden');
		
	
	}
	
}

function updatePIP(newSelection, oldPipVal){
	var cols = '.multiTable';
	showPopUpforPipUpdate(oldPipVal);
	
	
}

function showPopUpforPipUpdate(oldPipVal){
	var isMedical = oldPipVal.includes("Medical");
	if(isMedical){		
		$('#inEligibleSec_Med').modal('show');
	}else{		
		$('#inEligibleSec_Full').modal('show');
	}
	
	
}

function changePIPProvider(newSelection){
	var cols = '.multiTable';
	$(".healthCareProviderName").val("");
	$(".healthCareProviderNumber").val("");
	$('.clsPRINC_PIP',cols).each(function(event, result){						
		$('#' + this.id).val(newSelection).trigger('chosen:updated');		
		showHideHealthCareProvider(this, 'change');	
	});
	
	
}

function validateHealthCProviderName(providerNameObj){
	var providerName = providerNameObj.value;
	var regWordsarray = ['Medicare','Medicaid','Family Care','FamilyCare','New Jersey Family','NJ Family','TBD','TBA','NA','N/A'];
	var eligibility = true;
	
	for(i=0; i< regWordsarray.length ; i++){
		var isNotEligible = checkEligibility(regWordsarray[i],providerName);
		
		if(isNotEligible){
			eligibility =false;
			return eligibility;
		}
	}
	return eligibility;
}

function checkEligibility(regWord,providerName){
	var isNotEligible = false;
	switch(regWord){
	case 'Medicare':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'Medicaid':
		if(isContainValue(regWord,providerName)){
			isNotEligible =  true;
		}
	break;
	
	case 'Family Care':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'FamilyCare':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'New Jersey Family':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'NJ Family':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'TBD':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'TBA':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'NA':
		if(isExactMatch(regWord,providerName)){
			isNotEligible =  true;
		}
	break;
	case 'N/A':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	
	}
	return isNotEligible; 
	
}

function isContainValue(regWord,providerName){
	//Replace the blank spaces between words and make it lower case 
	var regWordlowerCase = regWord.toLowerCase().replace(/\s/g,'');
	var providerNamelowerCase = providerName.toLowerCase().replace(/\s/g,'');
	var m =providerNamelowerCase.search(regWordlowerCase);
	if(m.valueOf() != -1){
		if(checkChars(providerNamelowerCase)){
			return false
		}else return true;
	}else return false;
}

function isExactMatch(regWord,providerName){
	var regWordlowerCase = regWord.toLowerCase();
	var providerNamelowerCase = providerName.toLowerCase();
	var m =new RegExp('^'+regWordlowerCase+'$').test($.trim(providerNamelowerCase));
	if(m){
		return true;
	}else return false;
}


function checkChars(providerNamelowerCase){
	var containsSplChars = false;
	var regex = /^[A-Za-z -]+$/i;
	if (!regex.test(providerNamelowerCase)) {
		containsSplChars = true;
	} 
	return containsSplChars;
}