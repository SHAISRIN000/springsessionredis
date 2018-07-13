//TD#64321 Adding SDIP to "Reorder 3rd party" workflow.
var APP = APP||{};
APP.currentTab="drivers";
var DRIVERS = APP.drivers = {};
DRIVERS.updatedDrivers=[];

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
	
	pageLoading = true;
	if($("#errorMessages").val()){
		errorMessages = JSON.parse($("#errorMessages").val());	
	}
	
	var pageAlertDivName= 'formTop';
	var mainContentDivName= 'mainContent';
	
	if($('#formTop .successAlert').length > 0) {
		$('#' + pageAlertDivName).attr("style", "padding: 25px 0 10px 30px;");
		$('#' + mainContentDivName).attr("style", "margin-top: 143px;");
		// additional style changes for drivers tab when displaying page alerts
		$('.driverPageHeader').attr("style", "margin-top: -43px;");
		$('.rowHeaderAndSlidingFrameParentDiv').attr("style", "margin-top: 25px;");
	}
	
	/*if($('#formTop .aiAlert').length > 0) {
		
		if(isEndorsement()){
			$('#' + pageAlertDivName).attr("style", "padding: 15px 0px 10px 20px;");
		}
		else{
			$('#' + pageAlertDivName).attr("style", "padding: 10px 0px 10px 20px;");
		}
	}*/
	 
	
	maxDriversAllow = $('#maxDriversAddLimit').val();
	
	// for testing only 
	//$('#isQuote').val("false");
	//$("#policyStateCd").val('NJ');
	//$("#policyStateCd").val('CT');
	/*var pageAlertDivName= 'formTop';
	$('#' + pageAlertDivName).append($('#completeApplicationAlert'));
	$('#completeApplicationAlert').show();*/
	
	showOrHidePrefillLink();
	showOrHideAllDriversRMVLookUp();
	
	//Bind Navigation Buttons  
	$("#newDriver").click(function(event){
		// Remove focus from existing active dropdown
		if($('div.chosen-container-active').length > 0) {
			$('div.chosen-container-active').removeClass('chosen-container-active').trigger('blur');
		}
		$('#isDriverInformationUpdated').val('true');
		addDriver(event);
		//adding a driver should reset premium on RATE BUTTON
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);
		// Ensure tabbing behavior is right for newly added columns
		setupTabbingBehavior();
		alignRows();
		return false;
	});
	
	updateDriverScrollPanel(SCROLL_PANEL);
	
	$("#startScrollBtn")
	.click(function(event){ slideDriverStart(event); });
	$("#leftScrollBtn")
	.click( function(event){ slideDriverLeft(event); })
	.hover(
		function(event){
			this.iid = setInterval(function() { slideDriverLeft(event);}, 525); },
		function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightScrollBtn")
	.click( function(event){ slideDriverRight(event); })
	.hover(
		function(event){
			this.iid = setInterval(function() { slideDriverRight(event);}, 525); },
		function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endScrollBtn")
	.click(function(event){ slideDriverEnd(event); });

	doSetShowHideDriverFields();
	
	bindDriverColumns();
	
	// reset clsMvrDataUpdatedInd to '' during load.
	// In new business these always contain empty during load.
	if (isEndorsement()) {
		$('input.clsMvrDataUpdatedInd').each(function() {		
			$(this).val("");
			var index = getIndexOfElementId(this);
			$('#driverStatus_'+index).prop('defaultValue',($('#driverStatus_'+index).val()));
		});
	}
	
	// list area modal dialog	
	$('#listAreasDlg').modal('hide');
	
	$("input.listAreaCheckbox").each(function(i, elem){
	    $(elem).change(function(){
        	validateListAreasSelection(this);
        });
    });
	
	$('#saveListAreas').click(function(){
		saveListAreas();
		return false;
	});
	
	$('a.cancelListAreasModel, button.cancelListAreasModel').click(function(){
		cancelListAreas();
		return false;
	});	
	
	//set tab index for all drivers	
	setTabIndex("1", $('#driverCount').val());
	
	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
		handleSubmit(event);
	});
	
	$(document).on("click", ".returnEndr", function(e){
		var policySourceCd = $('#policySourceCd').val();
		if (policySourceCd == 'ENDORSEMENT') {
			deletePendingAmendment(redirectLandingPage);
		}
	});
	
	// Offset the mainContent if we're displaying a page alert
	var mainContent = $('#mainContent');
	var driverMainContent = $('#driverMainContent');
	var blnErrorOnPage = false;
	$('.aiAlert:not(.hidden)').each(function() {
		blnErrorOnPage = true;
		//var alertHeight = $(this).outerHeight(false);
		mainContent.css('margin-top', parseInt(mainContent.css('margin-top')) + 77);
		if (parseInt($('#driverCount').val()) > 3){
			// different spacing depending on whether there is overflow drivers
			driverMainContent.css('padding-top', parseInt(driverMainContent.css('padding-top')) + 11);
		}else{
			driverMainContent.css('padding-top', parseInt(driverMainContent.css('padding-top')) + 15);
		}
	});
	if(!blnErrorOnPage){
		if (parseInt($('#driverCount').val()) == 2 || parseInt($('#driverCount').val()) == 3){
			// different spacing depending on whether there is overflow drivers
			driverMainContent.css('padding-top', parseInt(driverMainContent.css('padding-top')) + 15);
		}else{
			// 1 or > 3 are fine
		}
	}
	// Add rows to the row header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#rowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addErrorRowHeader(this, headerBody, true);
	});
	
	alignRows();
	chkIfLicNumIsRequired();
	
	//add driver column automatically
	if ( isEndorsement() ) {
		if ($("#landingBubbleEndorsementUserAction").val() == EndorsementUserAction.AddDriver) {
			addDriver(event);
			alignRows();
		}
		disableLicenseNumberForENDR();
	}
	
	// add additional style settings to scroll panel if application/end
	//if(isApplicationOrEndorsement()){
		//#53586..apply class for all. so commented above if condition.
		$("#scrollPanel").addClass("scrollPanelApp");
	//}
	
	setAndDisableRelationshipToPNI();
	
	//For endorsement focus - focus resets
	if ( !isEndorsement() ) {
		//set focus on to first field	
		if ( $('#showPrefillWindow').val() == 'true' ) {
			$("#spanSelAllAgentData").focus();
		}else { 
		 //TD 53315 -  click FIX now - and focus is on DLState of first driver - when it should be on the first Error on the First tab in error 
		 //TD 56572 - MArtial Status field edit on Driver tab not consistent for all drivers - edit only appears when landing on Driver tab for Column 2 - Other drivers get edit after leaving the page
		//vmaddiwar - Focus should not be on First error field first time or on prefill lookup.
			if($('#firstTimeThru').val() == 'true'){
				setFocus('licenseState_0');
			}else{
				setFocusToErroredDriverField();
			}
		}
	} else {
	//TD 53315 -  click FIX now - and focus is on DLState of first driver - when it should be on the first Error on the First tab in error 
		//setFocus('licenseState_0');
		setFocusToErroredDriverField();
	}
	
	if($('#orderReportsErrorExists').val()=="true"){
		setFocusToErroredDriverField();
	}
	
	if($('#isFromfixDriverPermit').val()=="true"){
		setFocusToPermitDriverField();
	}
	
	$.each($('#aiForm input, #aiForm select'), function() {
		$(this).attr('origval', $(this).val());
	});
	
	$('#aiForm').on('reset', function(e) {
		e.preventDefault();
		$.each($('#aiForm input:text'), function() {
			var origVal = $(this).attr('origval') ? $(this).attr('origval') : '';
			$(this).val(origVal);
		});
		$.each($('#aiForm select'), function() {
			var origVal = $(this).attr('origval') ? $(this).attr('origval') : '';
			$(this).val(origVal).trigger('chosen:updated');
		});
		return false;
	});
	
	$('.clsDefDriverCourseChkBox').bind("click", function(event, result){
		resetPremiumForAll();
	});
	
	//PA_AUTO
	$('.clsDrvrImprovCourseChkBox').bind("click", function(event, result){
		resetPremiumForAll();
	});
	
	$('.clsGoodStudentChkBox').bind("click", function(event, result){
		resetPremiumForAll();
	});
	
	$('.clsAwayAtSchoolChkBox').bind("click", function(event, result){
		resetPremiumForAll();
	});
	
	$(document).on("click", ".clsDrvrTrainingChkBox", function(event, result){
		resetPremiumForAll();	
		var lastIndex = getIndexOfElementId(this);
		$('#drvrTrainingOverrideInd_'+lastIndex).val('Yes') ;		
	});
	
	 var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	$(".submitDriver").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.aiForm.viewPrefill.value = 'true';
		document.actionForm.action = '/aiui/drivers';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	$('.clsmMaskedDOB,.clsBirthDate').bind("blur", function(event, result){
		var currVal = $(this).val();
		var origVal = $(this).prop("defaultValue");
		if(currVal=="" && currVal!=origVal){
			resetPremiumForAll();
			var lastIndex = getIndexOfElementId(this);
			var currDriverId = $('#driverId_'+lastIndex).val();
			if ( !isNotRatedDriver(lastIndex)){
				$('#isDriverInformationUpdated').val('true');
			}
			if ( !isNotRatedDriver(lastIndex) 
					&& $('#mvrDataUpdatedIndDriver_'+currDriverId).val()!='Y'
					&& $('#mvrDataUpdatedIndDriverStatus_'+currDriverId).val()!=''){
				resetMVROrderStatus($('#driverId_'+lastIndex).val(),'drivers');
			}
		}			
		showOrHideAccPrevCrseChkBoxes(this);
	});
	
	$('.clsmMaskedLicNum').bind('blur', function(event, result) {
		var strLicReq = 'No';
		var strErrTag = '';
		
		// populate actual hidden vars 
		processMaskedElementData(this, event, '4', 'drivers'); 
		
		//clear RMV data if Lic num changed for MA state
		clearRmvDataIfDataChanged(getIndexOfElementId(this));
		
		//#54191...callDisplayRmvLookupStatus
		callDisplayRmvLookupStatus(getIndexOfElementId(this));
		
		if($(this).hasClass('required')){ 
			strLicReq = 'Yes';
		}
		
		// validate actual hidden var values
		strErrTag = 'licenseNumber.browser.inLine';		
		var lastIndex = getIndexOfElementId(this);
		validateInputElementWithMap($('#licenseNumber_' + lastIndex), strLicReq, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($('#licenseNumber_' + lastIndex).parent()), errorMessages, validateMaskedLicenseNumber, addDeleteCallback);
		
	});
	
	$('#orderReportsEndorsementsTrigger').click(function() {
	    var uwDecision = $("#uwDecision").val();
		if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
		    //Ordering reports is not authorized on quotes in decline status.
            $("#uwDeclineModal").modal('show');
		 }else{
		document.aiForm.orderThirdPartyReports.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
		 }
	});
		
	/* Leave space for fixed Compelte "so & so" application message */
	if($('#completeApplicationAlert').length == 1 && $('#pageAlertMessage').length == 0) {
		$('.rowHeaderAndSlidingFrameParentDiv').css('margin-top', '80px');
		$('.driverPageHeader').css('margin-top', '0');
	}
	
	if ( checkPrefillItemsAdded() ) {
		 // display fix now fix later if returns from prefill
		 lookupRMVDriver();
		 showPrefillAddedItemsEdits();
	 } 
	
	/* tabIndex fix for logo - Remove this block when logo taxIndex is corrected for all pages via pure html */
	$('#logo').parent().attr('tabIndex', 6);
	$('#pageAlertMessage #openErrorModal').attr('tabIndex', 101);
	
	setupTabbingBehavior();
	
	$('a[id*=delete_drivers_]').keydown(function(e){
	    if(e.keyCode==13) $(this).trigger('click');
	});
	
	setMvrDataUpdatedIndicatorDrivers();
	
	showReorderErrorPopups(); 
	//showReorderErrorPopups(); commented during merge due to repeat/ dupe call
	//Disable or enable Elements for Insurance Score if order count > 3
	disableOrEnableInsScoreElements(document.aiForm.currentTab.value);
	
	deleteUnwantedInlineErrors();
	
	// Highlight the excluded operators field when tabbing in and out of it
	$('span.ui-dropdownchecklist-default').keyup(function(e){
	    if(e.keyCode == 9) {
	      $(this).addClass('ui-dropdownchecklist-selector-hover').addClass('ui-dropdownchecklist-hover');
	    }
	});

	$('span.ui-dropdownchecklist-default').keydown(function(e){
	    if(e.keyCode == 9) {
	      $(this).removeClass('ui-dropdownchecklist-selector-hover').removeClass('ui-dropdownchecklist-hover');
	    }
	});
	
	$('.clsDeletedDriverIdList').val('');
	$('.clsDeleteDriver').each(function(){
		$('.clsDeletedDriverIdList').val($('.clsDeletedDriverIdList').val()+'%'+$(this).val());
	});
	$('.clsAgentDriverPrefillDataUpdatedInd').val('');
	
	if($('#prefillNewlyAddedItemsList').val()=='drivers'){
		var found = false;
		var prefillNewlyAddedItemIndex = $('#prefillNewlyAddedItemIndex').val();
		$('tr.errorRow:not(:hidden)').find('td.inlineErrorMsg').each(function(){
			if(prefillNewlyAddedItemIndex==getIndexOfElementId(this)){
				closeSetFocus(this.id.replace('Error_Col_','').replace('licenseNumber_','maskLicNum_'));
				$('#prefillNewlyAddedItemIndex').val('');
				$('#prefillNewlyAddedItemsList').val('');
				found = true;
				return false;
			}
		});
		if(!found){
			var fieldWithError = $('tr.errorRow:not(:hidden)').find('td.inlineErrorMsg').attr('id');
			if(fieldWithError!=null && fieldWithError!=""){
				closeSetFocus(fieldWithError.replace('Error_Col_','').replace('licenseNumber_','maskLicNum_'));	
			}	
		}
	}
	
	
	if (getPolicyState() == STATE_MA) {
		$('input.clsLicenseNumber').each(function() {
			// store original value to compare on blur event(if lic num changed after successful RMV lookup)
			$('#licenseNumber_'+ getIndexOfElementId(this)).data('OriginalValue', $('#licenseNumber_'+ getIndexOfElementId(this)).val());
		});
		
		$('input.clsRmvLookupInd[value=Yes]').each(function() {
			disableDriverFieldsForRMVLookup(getDriverIndex($(this).attr('id')));
		});
		
		$('input.clsRmvLookupInd[value!=Yes]').each(function() {
			//#54191...call below all the time and not for add driver from endorsemenet bubble.
			//displayRMVLookupStatus(this);		
			if ($("#landingBubbleEndorsementUserAction").val() != EndorsementUserAction.AddDriver) {
				displayRMVLookupStatus(this);
			}
		});
		
		//CC#621
		$('select.clsLicenseStatus').each(function() {
			//console.log('enable dds');
			$(this).prop('disabled',false);
			triggerChangeEvent($(this));
		});
		//52282 - Server line error usually generates red rim around the field.
		//But this shouldnt happen for RMV looukup button
		$('.clsRmvLookupBtn').removeClass('inlineError');
		
		//#54026... show/hide both label or field side rows
		showOrHideRMVLookupButtonRows();
	}
	
	$(".expandCollapseRows").click(function(){
		// update varibale to use in below functions
		if (($('#' + this.id).attr('src')).indexOf('plus') >=0) {
			blnRegistryDataExpaned = true;
		} else {
			blnRegistryDataExpaned = false;
		}
		
		showOrHideRegistryDataFields();
		
		expandCollapseRows(this.id);		
	});
	

	//52046 - Motorcycle licse should default to None
/*	$('select.clsMotorcycleLicense option:contains("None")').prop('selected',true)

		.removeClass('preRequired')
		.trigger('chosen:updated')
		.trigger('chosen:styleUpdated');
*/		
		/*$('.clsMotorcycleLicense[value=""]').val('None').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');*/
	
	if($(".clsMotorcycleLicense").val()==""){
		$(".clsMotorcycleLicense").val('None').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	/*$(".clsMotorcycleLicense").filter("").val('None').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');*/
        
	// Alert:please keep the below statement as last statement.
	// please include your code above this one.............
	disableOrEnableElementsForReadonlyQuote();
	
	if (!isEndorsement()) {
		$('.clsMvrOrderSatatus').each(function() {
			var mvrOrderSatatus = $(this).val();
			if ((mvrOrderSatatus == "Reorder Required") || (mvrOrderSatatus == "")){
				$('#isDriverInformationUpdated').val('true');
				$('#mvrDataUpdatedIndDriver_' + getIndexOfElementId(this)).val('Y');
			}
			
		});
	}
	pageLoading = false;
	
	
	if ($('#yubiEnabled').val() == 'true') {
		
		if ($('#isApplication').val() == 'true' || $('#isEndorsement').val() == 'true') {
			// YUBI requirement
			$('.clsYubiDriverChkBox').each(function() {
				showHideCellPhoneInfo();
			});
			
			if ($('#isApplication').val() == 'true') {
				$('.clsYubiDriverChkBox').click(function() {
					showHideCellPhoneInfo();
				});
			} else {
				$('.clsYubiDriverChkBox').click(function(event) {
					event.stopPropagation();
					return false;
				})
			}
			
			if ($('#isEndorsement').val() == 'true') {
				$('.clsYubiDriverChkBox').each(function() {
					$(this).attr('disabled', true);
					$(this).attr('readonly', true);
				});
				$('.cellphoneNumber').each(function() {
					$(this).attr('readonly', true);
				});
			}
		}
		
		if ($('#isApplication').val() == 'true') {
			$('.clsYubiDriverChkBox').change(function() {
				showHideCellPhoneInfo();
			});
			
			$('.cellphoneNumber').bind('focusout',function(event, result) { validatePhoneNumber(); });
			$('.cellphoneNumber').bind('focusout',function(event, result) { addRemoveBindPreRequired(); });
			$('.cellphoneNumber').bind({'keyup keydown keypress': function(e) { fmtPhone(this,e); }});
			
			validatePhoneNumber();
		}
		
		if ($('#isEndorsement').val() != 'true') {
			$('.clsYubiDriverChkBox').change(function() {
				resetPremiumForAll();
			});
		}
	}
	initialFormLoadProcessing();
});

var pageLoading =  false;
var tabIndex = 104; // 1-100 is for header. 101-103 is for driver page header
var maxDriversAllow;
//var maxColumns = 3;
var EMPTY_ERROR_ROW_HEIGHT = '0px';
var SCROLL_PANEL = '#scrollPanel';
var ADD_DRIVER = "ADDDRIVER";
var blnRegistryDataExpaned = false;

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

function doSetShowHideDriverFields() {
	setDriverColumnHeaderSeqNums();
	
	$('span.driverColumnHeaderDriverName').each(function() {		
		updateDriverColumnHeaderDriverName(this);
	});
	
	$('select.clsLicenseState').each(function() {	
		// for NLL state don't clear lic number and show the page edit
		if ( $(this).val() != 'NLL') {
			clearLicenseNumber(this);
		}
		if (getPolicyState() == STATE_MA) {
			showOrHideRMVButton(this, true);
			showOrHideRegistryDataFields();	
		}
		
		//displayRMVLookupStatus(this);	
		//displayMAFirstLicensed(this);
	});
	
	
	//for NJ set always as it is a hidden field..
	//TD 57418 - set Date firstlicence date for NH/CT/NJ
	if (getPolicyState() != STATE_MA) {
		setDateFirstLicensedDatesForAllDrvrs();
	} else {
		//For MA policy.. for MA Lic state drivers..Rmv/Manual entry populates it and should not be reset back.#52641
		// For MA policy ..for non MA Lic state populate if it is empty (based on driver status) #53022
		setDateFirstLicdDatesIfEmptyForMAPolicy();
	}
	
	
	$('input.clsBirthDate').each(function() {		
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
	});
	

	setAndDisableRelationshipToPNI();
	
	addOrDeletePNIOptions();
	
	$('input.clsDateFirstLicense').each(function() {		
		showOrHideDateFirstLicense(this);
		if (getPolicyState() == STATE_MA) {
			populateOOSLicenseValue(this);
		}
	});
	
	/*$('input.clsDateFirstMALicense').each(function() {		
		showOrHideDateFirstMALicense(this);
	});*/
	
	$('input.clsMotorcycleFirstLicDt').each(function() {
		if (getPolicyState() == STATE_MA) {
			showOrHideMotorcycleLicenseDate(this);
		}
	});
	
	$('input.clsMotorcycleCourseInd').each(function() {		
		if (getPolicyState() == STATE_MA) {
			showOrHideMotorcycleCourseInd(this);
		}
	});
	
	/*$('select.clsLicenseStatus').each(function() {		
		deleteLicStatusOptions(this);
		if (isEndorsement()) {
			showOrHideLicenseStatus(this);
		}
	});*/
	
		
	//This is for endorsement only
	if (isEndorsement()) {
		showOrHideLicenseStatus();
	}
	
	$('select.clsDriverStauts').each(function() {		
		//46711
		if(isEndorsement()){
		$('#defensiveDriverCourseDt_' + getIndexOfElementId(this)).data('orgValue', $(this).val());
		//PA_AUTO
		$('#driverImprovCourseDt_' + getIndexOfElementId(this)).data('orgValue', $(this).val());
		
		$('#driverStatus_' + getIndexOfElementId(this)).data('orgValue', $(this).val());
		}
		showDriverStatusLiteral(this);
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideDriverImproveCourseChkBoxes(this);	//PA_AUTO
		showOrHideSr22FilingChkBoxes(this);
		
		//YUBI requirement
		showOrHideYubiChkBoxes(this);
	});
	
	$('select.clsOtherCarrierSelect').each(function() {			
		showOrHideOtherCarrier(this);
	});
	
	$('select.clsLicOutOfStateOrCountrySelect').each(function() {	
		//disable field for endorsement
		if (isEndorsement()) {
			disableForExistingDriver(this);
		}
		showOrHideLicOutOfStateOrCountry(this);
	});
	
	$('div.listAreas').each(function() {
		//disable field for endorsement
		if (isEndorsement()) {				
			disableForExistingDriver( $('#listAreas_' + getIndexOfElementId(this)) );
		}
		showOrHideListAreas(this);
	});
	
	$('select.clsOccupation').each(function() {		
		showOrHideOccupation(this);
	});
	
	$('input.clsDefDriverCourseChkBox').each(function() {		
		showOrHideDefDriverCourseDt(this);
	});
	
	//PA_AUTO
	$('input.clsDrvrImprovCourseChkBox').each(function() {		
		showOrHideDriverImprovCourseDt(this);
	});
	
	$('input.clsAccPrevCourseChkBox').each(function() {		
		showOrHideAccPrevCourseDt(this);
	});
	
	$('select.clsMotorcycleLicense').each(function() {	
		if (getPolicyState() == STATE_MA) {
			processMotorcycleLicenseFields(this);
		}
	});
	
	// disable sr22 filing checkbox for endorsement
	//#52785..don't disable at all. Even value is there for existing driver.
	//#54128..disable sr22 filing checkbox for endorsement for existing driver if already has Yes value from p*
	if (isEndorsement()) {
		$('input.clsSr22FilingChkBox').each(function() {						
			disableForExistingDriverForSR22(this);			
		});
	}
}

function bindDriverColumns() {
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
	
	if ((sAction == 'Add') && (columnSelector == 'last-child')) {
		//clear error class and error message for copied cells
		clearErrorForAddColumn(columnPrefix, selector);
	}
	
	if (sAction == 'Add') {
		var columnSelector = '.multiTable > tbody > tr > td:last-child';
		applyFirstTimeThruStyle($(columnSelector) , 'true');
	}
	
	// bind all input validations
	bindInputFieldValidations(columnPrefix, selector, sAction);
	
	
	$(columnPrefix + 'a.clsDeleteDriver', selector).bind("click", function(event, result){
		deleteDriver(this);
	});
	
	
	$(columnPrefix + 'input.clsDriverName', selector).blur(function(){
		updateDriverColumnHeaderDriverName(this);
	});
	
	$(columnPrefix + 'select.clsLicenseState', selector).change(function(){
		showOrHideLicOutOfStateOrCountry(this);
		clearLicenseNumber(this);
		chkIfLicNumIsRequiredForADriver(this);		
		//clear RMV data if Lic state changed for MA state
		clearRmvDataIfDataChanged(getIndexOfElementId(this));
		showOrHideRMVButton(this, true);
		//alignrows();
		showOrHideRegistryDataFields();	
		if (isEndorsement()) {
			alignRows();
		}
		
		//triggerValidateDriverStatus(this);
	});
	
	$(columnPrefix + 'input.clsLicenseNumber, input.clsmMaskedLicNum', selector).keypress(function(event){
		acceptLicenseCharsOnly(event);
    });
	
	$(columnPrefix + 'input.clsName', selector).keydown(function(event){
		acceptNameCharsOnly(this, event);
    });
	
	$(columnPrefix + 'input.clsDateInputFld', selector).keypress(function(event){
		acceptNumericsAndSlashes(this, event);
    });
	
	$(columnPrefix + 'input.clsDateInputFld', selector).keyup(function(event){
		autoSlashes(this,event);
    });
	
	//change to change instead of blur as sometimes doesn't trigger
	$(columnPrefix + 'input.clsBirthDate', selector).change(function(){
		// validateDateAndSetFirstLicDt(this);
		var updateDOB = '#maskBirthDate_' + getIndexOfElementId(this);
		$(updateDOB).val($(this).val());
		var strElm = '#birthDate_' + getIndexOfElementId(this);
		$(strElm).val($(this).val());
		setDateFirstLicensedDate(this);
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
		showOrHideDriverImproveCourseChkBoxes(this);		//PA_AUTO
    });
	
	$('input.clsDateFirstLicense', selector).change(function(){
		populateOOSLicenseValue(this);
		//Based on BA email on 5/22/2015.. included below good studentAndAwayAtSchool for MA also
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
    });
	
	$(columnPrefix + 'input.clsmMaskedDOB', selector).keydown(function(event){
		clearMaskedValue(this, event, '2');
    });
	
	//change to change instead of blur as sometimes doesn't trigger
	$(columnPrefix + 'input.clsmMaskedDOB', selector).change(function(event){
		// pass correct hidden birthdate 
		var updateDOB = '#maskBirthDate_' + getIndexOfElementId(this);
		$(updateDOB).val($(this).val());
		var strElm = '#birthDate_' + getIndexOfElementId(this);
		$(strElm).val($(this).val());
		setDateFirstLicensedDate(this);
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
    });
	
	$(columnPrefix + 'select.clsRelationshipToIns', selector).change(function(){
		addOrDeletePNIOptions();
		//PA_AUTO
		showOrHideDriverImproveCourseChkBoxes(this);  
    });
		
	$(columnPrefix + 'select.clsLicenseStatus', selector).change(function(){
		
		setLicenseState(this);
		var lastIndex = getIndexOfElementId(this);
		//Fix for #44812 | Adding this here along with good student,driver training, acc prev course check boxes
		var strElm = '#birthDate_' + getIndexOfElementId(this);
		setDateFirstLicensedDate(strElm);
		setTimeout("chkIfLicNumIsRequiredForADriver($('#licenseNumber_" + lastIndex + "'))",10);
		setTimeout("showOrHideDrvrTrainingChkBoxes($('#licenseNumber_" + lastIndex + "'))",50);
		setDriverStatus(this);
		showOrHideDateFirstLicense(this);
		//showOrHideDateFirstMALicense(this);		
		showOrHideMotorcycleLicenseDate(this);
		showOrHideOtherCarrier(this);			 
		showOrHideLicOutOfStateOrCountry(this,true);
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideDriverImproveCourseChkBoxes(this);  //PA_AUTO
		showOrHideSr22FilingChkBoxes(this);
		triggerValidateDriverStatus(this);
		//TD 48667- commenting this out as this is page level edits only as per defect
		//triggerValidateLicState(this);
		showDriverStatusLiteral(this,true);
		//Change of driver status can make a driver go from RMV Required to not required. I
		showOrHideRMVButton(this,true);
		//show status once above RmvLookbutton function
		//#...53747
		displayRMVLookupStatus(this);
		
		if (isEndorsement()) {
			alignRows();
		}
		
		if ($('#yubiEnabled').val() == 'true' && (getPolicyState() == STATE_NJ || getPolicyState() == STATE_PA)) { 
			showOrHideYubiChkBoxes(this);
		}
    });
	

	$(columnPrefix + 'select.clsDriverStauts', selector).change(function() {
		
		var lastIndex = getIndexOfElementId(this);
		
		if ($('#yubiEnabled').val() == 'true' && isEndorsement() && (getPolicyState() == STATE_NJ || getPolicyState() == STATE_PA) 
				&& $('#driverStatus_' + lastIndex).data('orgValue') == 'INS_POL' && getDrvrStatus(lastIndex) != 'INS_POL' 
					&& $("#yubiDriver_" + lastIndex).is(":checked")) {
			
			var lastIndex = getIndexOfElementId(this);
			$('#endorsementDriverYubiModal').modal('show');
			$('#driverStatus_' + lastIndex).val($('#driverStatus_' + lastIndex).data('orgValue')).trigger('chosen:updated');
			return;
		} else {
		
			showOrHideDateFirstLicense(this);
			//showOrHideDateFirstMALicense(this); //3.2.12 and #53416
			showOrHideMotorcycleLicenseDate(this);
			chkIfLicNumIsRequiredForADriver(this);		
			showOrHideDrvrTrainingChkBoxes(this);
			showOrHideOtherCarrier(this);
			showOrHideLicOutOfStateOrCountry(this,true);
			showOrHideGoodStdntAwayAtSchlChkBoxes(this);
			showOrHideDefensiveDriverChkBoxes(this);
			showOrHideDriverImproveCourseChkBoxes(this);  //PA_AUTO
			showOrHideAccPrevCrseChkBoxes(this);
			showOrHideSr22FilingChkBoxes(this);
			
			showOrHideYubiChkBoxes(this);
			
			//TD 48667- commenting this out as this is page level edits only as per defect
			//triggerValidateLicState(this);
			showDriverStatusLiteral(this, true);
			//Change of driver status can make a driver go from RMV Required to not required. I
			showOrHideRMVButton(this,true);
			//#...53747
			displayRMVLookupStatus(this);
			//3.3.15
			//triggerMotorcylceLicense(this);
			//#53533...enable rmv lookup button and set indicator...for endorsement only
			setExistingDrvrChangedFromDeferred2ToOtherInd(this);
			//#54911
			enableLicenseStatus(this);	
			
			if (isEndorsement()) {
				alignRows();
			}
			//alignrows();
		}
    });
	
	$(columnPrefix + 'select.clsLicOutOfStateOrCountrySelect', selector).change(function(){
		showOrHideListAreas(this);		
    });
	
	$(columnPrefix + 'select.clsMotorcycleLicense', selector).change(function() {
		processMotorcycleLicenseFields(this);
		//52409 - Screen format error when selecting motorcycle license
		alignRows();
    });
	
	$(columnPrefix + 'a.clsEditListAreas', selector).click(function(){
		editListAreas(this);
	});
	
	$(columnPrefix + 'input.clsDefDriverCourseChkBox', selector).change(function(){
		showOrHideDefDriverCourseDt(this);
    });

	//PA_AUTO
	$(columnPrefix + 'input.clsDrvrImprovCourseChkBox', selector).change(function(){
		showOrHideDriverImprovCourseDt(this);
    });
	
	$(columnPrefix + 'input.clsAccPrevCourseChkBox', selector).change(function(){
		showOrHideAccPrevCourseDt(this);
    });
	
	//Since we are looping each driver here; we can search for participantRole who is Secondary and set FirstTimeThrough
	if(isEndorsement() && (sAction == null || undefined)){
		//45460 - for Driver firstTimePassThrough - Set FirstTimeThrough by removing all errors for newly added SNI
		$(columnPrefix + '.clsParticipantRole', selector).each(function(){
			var participantRole = '#participantRole_' + getIndexOfElementId(this);
			if($(participantRole).val() == 'SECONDARY_INSURED'){
				var participantId = '#participantId_' + getIndexOfElementId(this);
				if($(participantId).val() == '1111' && $('#transactionProgress').val() < 3){
					applyFirstTimeThruStyle(selector,'true');
				}
			}
		});
	}
	
	$(".clsRmvLookupBtn", selector).on('click',function(event) {
		//ajax call
		doRmvLookupForDriver(this, true);
		//commented below and implemented in above ajax call complete.
		/*$('.rmvLookup_Row > td').removeClass('lastSelected');
		$(this).parent().addClass('lastSelected');	*/	
	});
	
	$("#allDriverRMVLookUp").click(function() {
		var emptyLicNumMessages = checkForLicenseNumbersForRMVLookup('.licenseInput');
		if (emptyLicNumMessages != '') {
			confirmMessage(emptyLicNumMessages);
			return;
		} else {
			lookupRMVDriver();			
		}
		
		return;
		
	});
}

function postProcessRmvLookedupDriver(elm) {
	//var driverIndex = elm.id.substring('rmvLookup_'.length);
	$('.rmvLookup_Row > td').removeClass('lastSelected');
	$(elm).parent().addClass('lastSelected');
	
	//#54896
	//#55579(cc)...below call commented
	/*if (isEndorsement()) {
		performOrderReportsForRmvDriver("DriverPage", driverIndex);
	}*/
}



function checkForLicenseNumbersForRMVLookup(driverSelector) {
	var messages = '';
	
	$(driverSelector).each(function() {			
		var driverIndex = getDriverIndex($(this).attr('id'));
		var drvrNum = driverIndex + 1;
		var licenseState = $('#licenseState_' + driverIndex).val();
		var rmvLookupInd = $('#rmvLookupInd_' + driverIndex).val();
		var firstName = $('#firstName_' + driverIndex).val();
		var lastName= $('#lastName_' + driverIndex).val();
		
		//check license numbers to do rmv lookup for eligible drivers only
		if (licenseState == STATE_MA &&  rmvLookupInd != 'Yes' &&  isDriverEligibleForRmvLookUp(driverIndex)) {			
			var licenseNumber = $.trim($('#licenseNumber_' + driverIndex).val());	
			if (licenseNumber == '') {
				messages = messages + '#' + drvrNum + '-' + lastName + ' ' + firstName + '</BR>';
			}
		}
		
	});
	
	if (messages != '') {
		messages = "<b>" + "Please enter License Number(s) for the below driver(s) to do All Driver Lookup." +  '</BR></BR>' + messages + "</b>";
	}
	
	return messages;
}

function lookupRMVDriver() {
	performRMVLookup('.licenseInput', false, null, false);
}

//TEJAS 
function doRmvLookupForDriver(elm, btnClick) {
	var driverIndex = elm.id.substring('rmvLookup_'.length);
	//$('#rmvLookupInd_' + driverIndex).val('HIT');
	//clearDriverRMVResult(driverIndex);
	if ($('#licenseNumber_'+driverIndex).val() == '') {
		confirmMessage("Please enter a License Number before invoking RMV Lookup");
		return;
	}
	
	performRMVLookup('#licenseNumber_'+ driverIndex, true, elm, btnClick);	
}

//TEJAS 
function performRMVLookup(driverSelector, perDriver, elm, btnClick) {
	    //59226 - Reset premium if the user clicks RMV Lookup button
	    resetPremiumForAll();
	   
		var lookupData = gatherRMVLookupData(driverSelector, perDriver);
		
		if (lookupData == '') {
			// TEJAS 
			return;
		}
		
		var jsonData = JSON.stringify(lookupData);
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/drivers/lookup?maipFlag="+isMaipPolicy(),
	        type: "post",
	        data: jsonData,
	        dataType: 'json',
	        beforeSend:function(){
				blockUser();
			},
	        async:true, //should be always true to make blockUser() work
	       
	        // callback handler that will be called on success
	        success: function(response, textStatus, jqXHR){	        	
	            processRMVLookupResults(response);
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
	        },
	        complete: function(){
	        	$.unblockUI();
	        	if (perDriver && btnClick) {
	        		postProcessRmvLookedupDriver(elm);
	        	}
			}
	    });			
}


// TEJAS  
function processRMVLookupResults(lookupResults) {
	
	for (var i = 0; i < lookupResults.length; i++) {
		if (lookupResults[i].request.licenseRequestFlag) { // lookup request was based on license data
			if(lookupResults[i].lookupSucceededFlag) {
				processDriverRMVResult(lookupResults[i].lookupResults, lookupResults[i].driverIndex);
			} else if((lookupResults[i].lookupResults == null) && !(lookupResults[i].lookupSucceededFlag)){
				//alert('lookupSucceededFlag >> ' + lookupResults[i].lookupSucceededFlag);
			} else {
				if (lookupResults[i].lookupResults.requestResponse == 'LICENSE NUMBER NOT FOUND') {
					$('#rmvLookupInd_' + lookupResults[i].driverIndex).val("X");
					showClearInLineErrorMsgsWithMap('rmvLookup_'+lookupResults[i].driverIndex, 'rmvlookup.browser.inLine.nohit', $('#defaultMulti').outerHTML(), lookupResults[i].driverIndex, errorMessages, addDeleteCallback);						
					$('#rmvLookup_Error_Col_' + (lookupResults[i].driverIndex)).removeClass('inlineMsgGreen').addClass('inlineErrorMsg');
					//52282 - RMV Lookup button is red rimmed-FR says "No red rim"
					$('#rmvLookup_' + lookupResults[i].driverIndex).removeClass('inlineError');
				} else {
					$('#rmvLookupInd_' + lookupResults[i].driverIndex).val("No");
					showClearInLineErrorMsgsWithMap('rmvLookup_'+lookupResults[i].driverIndex, 'rmvlookup.browser.inLine.unsuccessful', $('#defaultMulti').outerHTML(), lookupResults[i].driverIndex, errorMessages, addDeleteCallback);					
					$('#rmvLookup_Error_Col_' + (lookupResults[i].driverIndex)).removeClass('inlineMsgGreen').addClass('inlineErrorMsg');
					//52282 - RMV Lookup button is red rimmed-FR says "No red rim"
					$('#rmvLookup_' + lookupResults[i].driverIndex).removeClass('inlineError');
				}
			}
		} else {
			// lookup request was based on Name and DOB . Out of scope for now
		}
	}
	showRMVFailedModalIfApplicable(lookupResults);
}

function processDriverRMVResult(lookupResults, driverIndex) {
	// store the entered license state/number
	$('#licenseState_'+ driverIndex).data('OriginalValue', $('#licenseState_'+ driverIndex).val());
	addChosenForElement($('#licenseState_'+ driverIndex));	
	$('#licenseNumber_'+ driverIndex).data('OriginalValue', $('#licenseNumber_'+ driverIndex).val());	
	
	$('#rmvLookupInd_' + driverIndex).val(lookupResults.rmvLookupInd);
	//#55579(cc)...The below indicator specifies whether the rmv lookup is done currently(fresh) or not
	$('#currentRmvLookUpInd_' + driverIndex).val("Yes");
	
	$('#firstName_' + driverIndex).val(lookupResults.firstName);
	$('#middleName_' + driverIndex).val(lookupResults.middleName);
	$('#lastName_' + driverIndex).val(lookupResults.lastName);
	$('#lastName_' + driverIndex).val(lookupResults.lastName);
	//#56017... reset premium if original value is different from the newly flooding value
	if ($('#birthDate_' + driverIndex).val() != lookupResults.dob) {
		resetPremiumForAll();
	}

	$('#birthDate_' + driverIndex).val(lookupResults.dob).removeClass('preRequired');
	//mask dob since it is RMV data
	if(lookupResults.dob != '') {
		var strMask = '**/**/' + lookupResults.dob.substr(lookupResults.dob.length-4, 4);
		$('#maskBirthDate_' + driverIndex).val(strMask);
	}
	$('#gender_' + driverIndex).val(lookupResults.gender).trigger('chosen:updated');
	
	//52326 - License Status = Coming back blank from RMV call - Field gets greyed out on Driver tab and user cannot select
	if( !isBlank(lookupResults.licenseStatus)){
		//51890 fix - License Status field is still open after an RMV call
		//setLicenseStatus(driverIndex, lookupResults.licenseStatus);
		//#52128(CC)..License status
		$('#licenseStatus_' + driverIndex).val(lookupResults.licenseStatus).trigger('chosen:updated');
		
		//52216 - Driver Status doesn't default after RMV lookup and License Status returned
		setDriverStatus($('#driverStatus_' + driverIndex));

		//52216 - The indication below the Driver Status that tells the user How that driver will be rated, is missing.  
		showDriverStatusLiteral($('#licenseStatus_' + driverIndex), true);
		
		showOrHideLicOutOfStateOrCountry($('#licenseStatus_' + driverIndex),true);
		//#52306
		showOrHideDateFirstLicense($('#driverStatus_' + driverIndex));
	}
	
	//#52129.(motorcycleLicTypeDesc should not be mapped from rmv)
	//$('#motorcycleLicTypeDesc_' + driverIndex).val(lookupResults.motorcycleLicTypeDesc).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#firstLicUsaDt_' + driverIndex).val(lookupResults.firstLicenseDate);
	if(lookupResults.maFirstLicenseDate != '') {
		$('#firstLicMADt_' + driverIndex).val(lookupResults.maFirstLicenseDate);	
	} //else {
		//3.2.11 last section says this field should be disabled always. so commented.
		//$('#firstLicMADt_' + driverIndex).prop('disabled', false);
	//}
	//TD 63309 - Force report reorder for MA policies when Driver SDIP changes in NB application process - MA Only
	if($('#sdip_' + driverIndex).val() != '' && lookupResults.sdip != ''
			&& parseInt($('#sdip_' + driverIndex).val()) != parseInt(lookupResults.sdip)){
		resetMVROrderStatus($('#driverId_'+driverIndex).val(),'drivers');
	}
	$('#sdip_' + driverIndex).val(lookupResults.sdip);
	$('#licOutOfStatePrior3YrsInd_' + driverIndex).val(lookupResults.licenseOutofState);
	$('#rmvFirstLookupDate_' + driverIndex).val(lookupResults.rmvLookupDate);
	$('#drvrTraining_' + driverIndex).prop('checked', lookupResults.drvrTrainingInd == 'Yes');
	
	$('#priorLicenseNumber_' + driverIndex).val(lookupResults.priorLicenseNumber);
	$('#priorLicenseState_' + driverIndex).val(lookupResults.priorLicenseState);
	
	updateDriverColumnHeaderDriverNameByIndex(driverIndex);	
	disableDriverFieldsForRMVLookup(driverIndex);	
	clearEditMessageAfterRMVLookup (driverIndex);
	
	// Show success message
	showClearInLineErrorMsgsWithMap('rmvLookup_'+ driverIndex, 'rmvlookup.browser.inLine.successful', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	$('#rmvLookup_' + driverIndex).removeClass('inlineError');
	$('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineErrorMsg').addClass('inlineMsgGreen');
	
	//show or hide checkboxes
	showOrHideDrvrTrainingChkBoxes($('#rmvLookup_' + driverIndex));
	showOrHideGoodStdntAwayAtSchlChkBoxes($('#rmvLookup_' + driverIndex));
}

//Set license status from RMV lookup Response and Map it to existing dropdown values
function setLicenseStatus(driverIndex, lookupLicenseStatus) {
	$('#licenseStatus_' + driverIndex).val(getRmvLicStatusCd(lookupLicenseStatus)).trigger('chosen:updated');
}

function disableDriverFieldsForRMVLookup (driverIndex) {
	//#52958.. rmv button shouldn't be disabled for any driver
	/*if ($('#participantRole_' + driverIndex).val() == 'PRIMARY_INSURED') {
			//#52958..commented below or condition
			//|| $('#participantRole_' + driverIndex).val() == 'SECONDARY_INSURED') {
		disableDataField ('#rmvLookup_' + driverIndex);
	} */
	
	//#53533...Rmv lookup button should be disabled only in endorsement......
	// no existing drivers should have the button enabled UNLESS they are updated from deferred 2 to rated/deferred 1.
	if (isEndorsement() 
	&& $('#endorsementDriverAddedInd_' + driverIndex).val() != 'Yes'
	&& $('#existingDrvrChangedFromDefer2ToOtherInd_' + driverIndex).val() != 'Yes'
	) {
		//disableDataField ('#rmvLookup_' + driverIndex);
		// #53699....for existing drivers always hide it
		showOrHideHtml($("#rmvLookup_" + driverIndex), 'hide');
	}
	
	//	3.2.1.C For  NBS and Endorsements:  After a successful lookup for the 2nd NI 
	//  He/she does NOT have their license protected, 
	//  nor is their Name protected.
	//  The 2nd NI has their DOB protected and MM/DD masked.
		
	if ($('#participantRole_' + driverIndex).val() == 'PRIMARY_INSURED') {
		// only disable in NB #53332
		if (!isEndorsement()) {
			disableDataField ('#firstName_' + driverIndex);
			disableDataField ('#lastName_' + driverIndex); 
		}
		disableDataField ('#licenseState_' + driverIndex);
		disableDataField ('#licenseNumber_' + driverIndex);
		disableDataField ('#maskLicNum_' + driverIndex);
	} 

	//52156 - DOB is not protected in Driver Tab after RMV look-up 
	disableDataField ('#birthDate_' + driverIndex);
	disableDataField ('#maskBirthDate_' + driverIndex);	
	disableDataField ('#licenseStatus_' + driverIndex);
	
	//52046 - Gender and dates should be protected for all drivers with Successful RMV call
	disableDataField ('#gender_' + driverIndex);
	//TD 52404 -Driver Screen - Date first licensed field is locked and should be available for update
	//disableDataField ('#firstLicUsaDt_' + driverIndex);
	
	//51654 - The �RMV Successful message disappears for the third driver after you leave and come back into the Drivers Tab.
	//showClearInLineErrorMsgsWithMap('rmvLookup_'+ driverIndex, 'rmvlookup.browser.inLine.successful', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	//$('#rmvLookup_' + driverIndex).removeClass('inlineError');
	//$('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineErrorMsg').addClass('inlineMsgGreen');
	
	// #53699....for existing drivers don't show messages. so commented above block of 51654 
	if (isEndorsement() 
	&& $('#endorsementDriverAddedInd_' + driverIndex).val() != 'Yes'
	&& $('#existingDrvrChangedFromDefer2ToOtherInd_' + driverIndex).val() != 'Yes'
	) {		
		$('#rmvLookup_' + driverIndex).removeClass('inlineError');
		$('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineErrorMsg').removeClass('inlineMsgGreen');
		
	} else if(getDateDiffInDays($('#rmvFirstLookupDate_'+ driverIndex).val()) > 60){
		showClearInLineErrorMsgsWithMap('rmvLookup_'+ driverIndex, 'driver.rmvLookup.browser.inLine.lookupRequired', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	} else {
		showClearInLineErrorMsgsWithMap('rmvLookup_'+ driverIndex, 'rmvlookup.browser.inLine.successful', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
		$('#rmvLookup_' + driverIndex).removeClass('inlineError');
		$('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineErrorMsg').addClass('inlineMsgGreen');
	}
}

function clearEditMessageAfterRMVLookup (driverIndex) {
	showClearInLineErrorMsgsWithMap('rmvLookup_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('firstName_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('lastName_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('birthDate_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	
	//52281 - After RMV lookup successful, DOB required msg displays even after DOB is retrieved
	//52306 - 2 fields' inline error messages did not clear when data entered while all others did
	showClearInLineErrorMsgsWithMap('maskBirthDate_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('firstLicUsaDt_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	
	showClearInLineErrorMsgsWithMap('gender_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('licenseStatus_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap('driverStatus_'+driverIndex, '', $('#defaultMulti').outerHTML(), driverIndex, errorMessages, addDeleteCallback);
	removePreRequiredStyle($('#firstName_'+driverIndex));
	removePreRequiredStyle($('#lastName_'+driverIndex));
	removePreRequiredStyle($('#maskBirthDate_'+driverIndex));
	removePreRequiredStyle($('#gender_'+driverIndex));
	removePreRequiredStyle($('#licenseStatus_'+driverIndex));
	removePreRequiredStyle($('#driverStatus_'+driverIndex));
}

function clearDriverRMVResult(driverIndex) {
	//clear the driver status also if the lic state is changed to 'NLL'
	if ( $('#licenseState_' + driverIndex).val() == 'NLL' ) {
		$('#driverStatus_' + driverIndex).val('').trigger('chosen:updated');
		$('#driverStatusLiteral_' + driverIndex).text("");
	}
	$('#firstName_' + driverIndex).val('');
	$('#middleName_' + driverIndex).val('');
	$('#lastName_' + driverIndex).val('');
	$('#lastName_' + driverIndex).val('');
	$('#birthDate_' + driverIndex).val('');
	$('#maskBirthDate_' + driverIndex).val('');
	$('#gender_' + driverIndex).val('').trigger('chosen:updated');
	$('#licenseStatus_' + driverIndex).val('').trigger('chosen:updated');	
	$('#firstLicUsaDt_' + driverIndex).val('');	
	$('#firstLicUsaDt_' + driverIndex).val('');	
	$('#sdip_' + driverIndex).val('');	
	$('#rmvFirstLookupDate_' + driverIndex).val('');
	$('#firstLicMADt_' + driverIndex).val('');
	
	//clear indicator
	$('#rmvLookupInd_' + driverIndex).val('');
	//show or hide checkboxes
	showOrHideDrvrTrainingChkBoxes($('#rmvLookup_' + driverIndex));
	showOrHideGoodStdntAwayAtSchlChkBoxes($('#rmvLookup_' + driverIndex));
	
	updateDriverColumnHeaderDriverNameByIndex(driverIndex);	
}

function gatherRMVLookupData(driverSelector, perDriver) {

	var data = {};
	data.lookupData = [];
	
	$(driverSelector).each(function() {
		
		var driverIndex = getDriverIndex($(this).attr('id'));
		var licenseState = $('#licenseState_'+driverIndex).val();
		var rmvLookupInd = $('#rmvLookupInd_'+driverIndex).val();
		if ( licenseState == STATE_MA && (perDriver || (rmvLookupInd != 'Yes'  && isDriverEligibleForRmvLookUp(driverIndex))) ) {
			var driver = {};
			
			driver.driverIndex = driverIndex;
			driver.request = {};
			driver.request.company = $('#companyCd').val();
			driver.request.state = $('#stateCd').val();
			driver.request.lob = $('#lob').val();
			driver.request.channel = $('#channelCd').val();
			driver.request.policyNumber = $('div > #policyNumber').val();
			driver.request.policyEffectiveDate = $('#policyEffDt').val();
			
			var licenseNumber = $('#licenseNumber_'+driverIndex).val();
			
			
			if (licenseNumber != null && licenseNumber.length > 0 && licenseState != null && licenseState.length > 0) {
				driver.request.licenseNumber = licenseNumber;
				driver.request.licenseState = licenseState;
			}		
			
			driver.request.licenseRequestFlag = true; 
			data.lookupData.push(driver);	
		}

	});
	
	return data.lookupData;
}

function bindInputFieldValidations(columnPrefix, selector, sAction) {
	var strErrTag = '';
	var strReqYes = 'Yes';
		
	// license state
	$(columnPrefix + 'select.clsLicenseState', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licenseState.browser.inLine';		
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
				getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);	
		/*result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateLicState, addDeleteCallback);	
		triggerValidateDriverStatus(this);*/
	});
	
	// license number
	$(columnPrefix + 'input.clsLicenseNumber', selector).bind(getValidationEvent(), function(event, result) {
		var strLicReq = 'No';

		//clear RMV data if Lic num changed for MA state
		clearRmvDataIfDataChanged(getIndexOfElementId(this));
		
		//#54191...callDisplayRmvLookupStatus
		callDisplayRmvLookupStatus(getIndexOfElementId(this));
		
		if($(this).hasClass('required')){ 
			strLicReq = 'Yes';
		}		
		
		if($(this).attr('type') != 'hidden'){	
			result.errorCount += invokeValidateLicNumber(this,strLicReq);
		}		
	});
	
	$(columnPrefix + 'input.clsmMaskedLicNum', selector).bind(getValidationEvent(), function(event, result) {
		var strLicReq = 'No';
		
		// populate actual hidden vars 
		processMaskedElementData(this, event, '4', 'drivers'); 
		
		//clear RMV data if Lic num changed for MA state
		clearRmvDataIfDataChanged(getIndexOfElementId(this));
		
		//#54191...callDisplayRmvLookupStatus
		callDisplayRmvLookupStatus(getIndexOfElementId(this));
		
		if($(this).hasClass('required')){ 
			strLicReq = 'Yes';
		}
		
		// validate actual hidden var values
		strErrTag = 'licenseNumber.browser.inLine';		
		var lastIndex = getIndexOfElementId(this);
		result.errorCount += validateInputElementWithMap($('#licenseNumber_' + lastIndex), strLicReq, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($('#licenseNumber_' + lastIndex).parent()), errorMessages, validateMaskedLicenseNumber, addDeleteCallback);
		
	});

	// first name
	$(columnPrefix + 'input.clsFName', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'firstName.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// last name
	$(columnPrefix + 'input.clsLName', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'lastName.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// birth date
	$(columnPrefix + 'input.clsBirthDate', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'birthDate.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateBirthDate, addDeleteCallback);										
	});
	
	// masked birth date
	$(columnPrefix + 'input.clsmMaskedDOB', selector).bind(getValidationEvent(), function(event, result) {
		showClearInLineErrorMsgsWithMap('birthDate_'+getColumnIndexNoHeader($(this).parent()), '', $('#defaultMulti').outerHTML(),
				getColumnIndexNoHeader($(this).parent()), errorMessages, addDeleteCallback);
		processMaskedElementData(this, event, '2', 'drivers');
		strErrTag = 'birthDate.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateMaskedBirthDate, addDeleteCallback);										
	});
	
	// gender
	$(columnPrefix + 'select.clsGender', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'gender.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// relationship to PNI
	$(columnPrefix + 'select.clsRelationshipToIns', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'relationshipToIns.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// marital status
	$(columnPrefix + 'select.clsMaritalStatus', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'maritalStatus.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// license status
	$(columnPrefix + 'select.clsLicenseStatus', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licenseStatus.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// driver status
	$(columnPrefix + 'select.clsDriverStauts', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'driverStatus.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateLicAndDriverStatuses, addDeleteCallback);										
	});
	
	// other carrier
	// 46936 - We still need to display the Other Carrier Select but not run a validation in Quote mode in ENDR.
	if(!(isQuote() && isApplicationOrEndorsement())){
		$(columnPrefix + 'select.clsOtherCarrierSelect', selector).bind(getValidationEvent(), function(event, result) {
			strErrTag = 'otherPolicyCarrName.browser.inLine';			
			result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
					getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
		});
	}
	
	// occupation
	if(!isQuote()){
	$(columnPrefix + 'select.clsOccupation', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'occupation.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	}
	
	// licensed out of state
	$(columnPrefix + 'select.clsLicOutOfStateOrCountrySelect', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licOutOfStatePrior3YrsInd.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});	
	
	$(columnPrefix + 'div.driverlistAreas', selector).focus(function(){
		validateLastInput('lastInputLeft');				
    });
	
	$(columnPrefix + 'div.driverlistAreas', selector).blur(function(){
		var listAreasDiv = '#listAreas_' + getColumnIndexNoHeader($(this).parent());
		recordLastInput($(listAreasDiv).get(0), 'lastInputLeft');		
    });
	
	// list areas
	$(columnPrefix + 'div.listAreas', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'listAreas.browser.inLine';	
		//var listAreasDiv = '#listAreas_' + getColumnIndexNoHeader($(this).parent().parent());
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent().parent()), errorMessages, null, addDeleteCallback);										
	});	
	
	//defensive driving course date
	//46855 - We still need to display the Defensive Driving Dt but not run a validation in Quote mode in ENDR.
	$(columnPrefix + 'input.clsDefnsDrvngCoursDt', selector).bind(getValidationEvent(), function(event, result) {
			strErrTag = 'defensiveDriverCourseDt.browser.inLine';			
			result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
					getColumnIndexNoHeader($(this).parent()), errorMessages, validateDefenseDrvngCrseDate, addDeleteCallback);										
	});
	
	//PA_AUTO
	//Driver Improvement Course date
	$(columnPrefix + 'input.clsDrvrImprovCoursDt', selector).bind(getValidationEvent(), function(event, result) {
			strErrTag = 'driverImprovCourseDt.browser.inLine';			
			result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
					getColumnIndexNoHeader($(this).parent()), errorMessages, validateDefenseDrvngCrseDate, addDeleteCallback);										
	});	
	
	//accident prevention course date	
	$(columnPrefix + 'input.clsAccdntPrevCourseDt', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'accidentPrvntCourseDt.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateAccPrvCrseDate, addDeleteCallback);										
	});	
	
	//sr22 requesting state
	/*
	$(columnPrefix + '.clsSR22ReqState', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'sr22State.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	*/	
	
	//Date First Licensed
	$(columnPrefix + 'input.clsDateFirstLicense', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'firstLicUsaDt.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										// changed to correct function validateDateFirstLicensed
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateDateFirstLicensed, addDeleteCallback);
	});
	
	//Motorcycle License or permit is not a required field and one policy level validation is handled at change event
	
	//Motorcycle License Date
	$(columnPrefix + 'input.clsMotorcycleFirstLicDt', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'motorcycleFirstLicDt.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateInputDate, addDeleteCallback);										
	});
	
}


function triggerValidateDriverStatus(elem){
	
	var lastIndex = getIndexOfElementId(elem);
	var drvStatus = $("#driverStatus_" + lastIndex);
	var strErrTag = 'driverStatus.browser.inLine';			
	var strReqYes = 'Yes';			
	validateInputElementWithMap($(drvStatus), strReqYes, strErrTag, $('#defaultMulti').outerHTML(),getColumnIndexNoHeader($(drvStatus).parent()), errorMessages, validateLicAndDriverStatuses, addDeleteCallback);
}

//TD 48667- commenting this out as this is page level edits only as per defect
/*function triggerValidateLicState(elem){
	
	var lastIndex = getIndexOfElementId(elem);
	var licState = $("#licenseState_" + lastIndex);
	var strErrTag = 'licenseState.browser.inLine';			
	var strReqYes = 'Yes';			
	validateInputElementWithMap($(licState), strReqYes, strErrTag, $('#defaultMulti').outerHTML(),getColumnIndexNoHeader($(licState).parent()), errorMessages, validateLicState, addDeleteCallback);
}*/

var addDeleteCallback = function(row, addIt) {
	var headerBody = $('#rowHeaderTable > tbody');
	
	if (addIt) {
		addErrorRowHeader(row, headerBody, true);
	} else {
		removeErrorRowHeader(row, headerBody);					
	}
};

function validateInputElementWithMap(strElement, strRequired, strErrorTag, strErrorRow,
									index, messageMap, 
									validateFieldFunc, addDeleteCallback) {
	var errorMessageID = '';
	var isRequiredIncluded = true;
	var isDrivingCourseDt = $(strElement).hasClass('clsDefnsDrvngCoursDt');
	//PA_AUTO
	var isDrvrImprovCourseDt = $(strElement).hasClass('clsDrvrImprovCoursDt');
	if(isDrvrImprovCourseDt && (isQuote() && isApplicationOrEndorsement())){
		isRequiredIncluded = false;
	}	
	
	//var isDriverStatus = $(strElement).hasClass('clsDriverStauts');
	var isDateFirstLicensed = $(strElement).hasClass('clsDateFirstLicense');
	
	if(isDrivingCourseDt && (isQuote() && isApplicationOrEndorsement())){
		isRequiredIncluded = false;
	}
	
	if(isRequiredIncluded){
		errorMessageID = isRequired($(strElement), strRequired);
	}
	
	if (errorMessageID == '') {
		if (validateFieldFunc != null) {
			errorMessageID = validateFieldFunc($(strElement));
		}
	} 
	
	/*if($('#orderReportsErrorExists').val()=="true"){
		errorMessageID = 'licenseNumber.browser.inLine.notValidLicNumber';
	}*/
	
	if($(strElement).attr('id').indexOf('licenseNumber') == 0){
		// Clear dependent field error
		var lastIndex = getIndexOfElementId(strElement);
		if(true == existsAndVisible('#maskLicNum_' + lastIndex)){			
			if (errorMessageID.length > 0){
				$('#maskLicNum_' + lastIndex).addClass('inlineError');
			}else{
				$('#maskLicNum_' + lastIndex).removeClass('inlineError');
			}
		}			
	}
	
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	
	/*if(isDriverStatus){
		var lastIndex = getIndexOfElementId(strElement);
		if($('#participantRole_'+lastIndex).val() == 'PRIMARY_INSURED' || $('#participantRole_'+lastIndex).val() == 'SECONDARY_INSURED'){
		if($(strElement).val() != null && $(strElement).val() != '' && $(strElement).val() != undefined && $(strElement).val() == 'P'){
				errorMessageID = 'driverStatus.browser.inLine.oneRatedOperator';
			}
		}
	}*/
	
	//59927
	if(isDateFirstLicensed){
		var lastIndex = getIndexOfElementId(strElement);
		var firstMALicensed = $('#firstLicMADt_'+lastIndex).val();
		if(firstMALicensed == null || firstMALicensed == undefined || firstMALicensed.length<1){
			var dateFirstLicensed = $(strElement).val();
			if(dateFirstLicensed == null || dateFirstLicensed == undefined || dateFirstLicensed.length<1){
				errorMessageID = 'firstLicUsaDt.browser.inLine.requiredMALicenseDateEmpty';
			}
		}
	}
	
	//show or clear error msg
	showClearInLineErrorMsgsWithMap($(strElement).attr("id"), errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
	
	//why is this trigger ??? causing issues for duplicate validaitons.
	/*if ($(strElement).is('select:not(select[multiple])')) {
		triggerChangeEvent($(strElement));
	}*/
	
	//align error row
	var strErrRowName = $(strElement).attr("id").replace("_" + index.toString(), "");
	alignErrorRow(strErrRowName);

}

function isRequired(strElm, strRequired) {
	var msg = '';
	
	if (strRequired == 'Yes') {
		if ($(strElm).hasClass("listAreas")) {
			var index = getColumnIndexNoHeader($(strElm).parent().parent());

			// make sure the div is visible
			if ($("#listAreas_" + index).is(':visible')) {
				if ($("#listAreas_" + index  + " .listAreasHiddenVariables").children('.clslistAreaCode').length <= 0) {
					msg = 'required';
				}
			}
		}
		else if ( $(strElm).hasClass("clsLicenseNumber") || $(strElm).hasClass("clsmMaskedLicNum") ) {
			var lastIndex = getIndexOfElementId(strElm);
			var strLicState = $("#licenseState_" + lastIndex).val();
			
			//required for only MA state
			if ( (strLicState != STATE_MA && isApplicationOrEndorsement()) || (strLicState == STATE_MA) ) {
				if (($(strElm).val() == null) || ($(strElm).val() == "")) {
					msg = 'required';
				}
			}
		}
		else {
			if (($(strElm).val() == null) || ($(strElm).val() == "")) {
				msg = 'required';
			}
		}
	}
	
	return msg;
}

function addErrorRowHeader(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' + $errorRow.attr("id") + '_Header"><td></td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}

function removeErrorRowHeader(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
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
		
		//align error row
		var strErrRowName = $(strElementID).attr("id").replace("_" + columnIndex.toString(), "");
		alignErrorRow(strErrRowName);
	}
}

function alignErrorRow(strRowName) {
	var errorHeaderRow = $('#' + strRowName  + '_Error_Header');
	var errorDataRow = $('#' + strRowName  + '_Error');
	
	if((errorHeaderRow.length > 0) && (errorDataRow.length > 0)) {
		//var errorHeaderRowHeight = errorHeaderRow.css('height');
		var errorDataRowHeight = errorDataRow.css('height');
		
		// check if errorDataRow contains any error message
		var errorMsgCols = (errorDataRow).find('td');
		var blnErrMsgFound = false;
		
		errorMsgCols.each(function(){
			var msgTxt = $(this).text();
			msgTxt = msgTxt.replace(/ /g,'');
			
			if (msgTxt != '') {
				blnErrMsgFound = true;
				return true;
			}
		});
		
		if (blnErrMsgFound) {
			$(errorHeaderRow).css('height', errorDataRowHeight);
		}
		else {
			$(errorHeaderRow).css('height', EMPTY_ERROR_ROW_HEIGHT);
			$(errorDataRow).css('height', EMPTY_ERROR_ROW_HEIGHT);	
		}
		
	}
}

function addDriver(event) {
	if (parseInt($('#driverCount').val()) >= parseInt(maxDriversAllow)) {
		confirmMessage("No more than 10 drivers permitted.");
		return;
	}
	
	var addColumnIndex = $('#driverCount').val();
	
	var driverCount = $('#driverCount');
	
	//add span tag with id to first td for each error row to make sure id present with square brackets.
	//this id is useful in replaceHTMLIndices function in multicolumn.js for finding index
	$("tr.errorRow").each(function(){
		if ($(this).find('td:first').find('span').length <= 0) {
			$(this).find('td:first').append('<span id="errorColSpan[0]"></span>');
		}
	});
	
	//enable before add column
	$('#relationshipToIns_' + 0).prop('disabled', false);
	triggerChangeEvent($('#relationshipToIns_' +  0));
	
	//We wouldn't be needing all the above parameters( just the column to replicate and the vehicle Count is enought to clone the column)
	addSlidableColumn('addDelColumn', driverCount);

	slideDriverEnd(event);
	// apply the driver column seq numbers
	setDriverColumnHeaderSeqNums();
	
	// clear the added driver column's header drivername
	$('#DriverColumnHeaderDriverFullName' + '_' + addColumnIndex).text("");
	
	// set dafault state to policy state
	var licState = '#licenseState_' + addColumnIndex;
	$(licState).val(getPolicyState());
	triggerChangeSelectBoxItIfSelect($(licState));
	clearLicenseNumber(licState);
	showOrHideRMVButton(licState, false);	//currently this shows RMV button for new driver column...
	enableDataField ('#licenseState_' + addColumnIndex);
	enableDataField ('#licenseNumber_' + addColumnIndex);
	enableDataField ('#rmvLookup_' + addColumnIndex);
	enableDataField ('#gender_' + addColumnIndex);
	enableDataField ('#maskBirthDate_' + addColumnIndex);
	enableDataField ('#licenseStatus_' + addColumnIndex);	
	enableDataField ('#firstLicUsaDt_' + addColumnIndex);
	//showClearInLineErrorMsgsWithMap('rmvLookup_'+ addColumnIndex, 'licenseNumber.browser.inLine.lookupRequired', $('#defaultMulti').outerHTML(), addColumnIndex, errorMessages, addDeleteCallback);	
	
	// remove primary named insured option
	$("#relationshipToIns_" + addColumnIndex + " option[value='I']").remove();		
	$('#relationshipToIns_' + addColumnIndex).prop('disabled', false);
	triggerChangeEvent($('#relationshipToIns_' + addColumnIndex));
	
	//Enable all insurance Application/Orderees related fields
	$('#firstName_' + addColumnIndex).prop('disabled', false);
	$('#lastName_' + addColumnIndex).prop('disabled', false);
	$('#birthDate_' + addColumnIndex).prop('disabled', false);
	$('#delete_drivers_' + addColumnIndex).removeClass('hidden');	
	
	// license number should not be required on quote
	var licNum = '#licenseNumber_' + addColumnIndex;
	$(licNum).addClass('licenseInput');
	if(!isApplicationOrEndorsement()){
		$(licNum).removeClass('preRequired').removeClass('required');
		// commented and moved to top for rmv lookup validation.
		//$(licNum).addClass('licenseInput');
	}
	
	//set driver_id for newly added column since DB is not there
	if ( isEndorsement() ) {
		$('#driverId_' +  addColumnIndex).val(getMaxIdWithIncrement());
		$('#endorsementDriverAddedInd_' + addColumnIndex).val("Yes");
	}
		
	//SSIRIGINEEDI: Added newly as per discussion with KEN and Sreenath.
	//This will kickoff only in Endorsement MODE. Not sure how this should work in NB.
	//Extended this if needed for NB aswell. 
	if (isEndorsement()) {		
		//set driver_id for newly added column since DB is not there
		$('#driverId_' +  addColumnIndex).val(getMaxIdWithIncrement());
		$('#driverSeqNum_' +  addColumnIndex).val(getMaxSeqNoWithIncrement('drivers'));
		$('#endorsementDriverAddedInd_' + addColumnIndex).val("Yes");
		$('#endorsementDriverAdditionCheckInd_' + addColumnIndex).val("Yes");
		$('input#endorsementRatedDriverInd').val("Yes");
		
		if($('#driverStatus_' + addColumnIndex).val()=='INS_POL' 
				|| $('#driverStatus_' + addColumnIndex).val()=='R'){
			$('input#endorsementOnlyRatedDriverInd').val("Yes");				
		}
		
		//Srini:set participant role for newly added driver for edits	
		// may be useful for new business. if so move this to above
		$('#participantRole_' + addColumnIndex).val("Driver");
		
		//if(primary name insured is already selected it should not appear in the new column Being added.
		var primaryInsuredSelected = false;
		$('select.clsRelationshipToIns').each(function() {
			
			if( $(this).val() == "I" ) {
				//Primary insured is selected already.. hide this option in new column being added.
				primaryInsuredSelected = true;
			}
		});
		
		if(primaryInsuredSelected){
			$('#relationshipToIns_' +addColumnIndex + " option[value='I']").remove().trigger('chosen:updated');
			//$('#relationshipToIns_' +addColumnIndex).find('option[value='I']').remove();
		} else {
			$("#relationshipToIns_" +addColumnIndex +" option:first").after('<option value="I">Primary Name Insured</option>').trigger('chosen:updated');
		}
		
		setFieldsForEndorsement(addColumnIndex);
	}
	
	if (!isEndorsement()){
		if (isElementExisting('#maskBirthDate_' + addColumnIndex) ) {
			$('#maskBirthDate_' + addColumnIndex).val('').prop('disabled', false);
		}
	}
	
	showOrHideDriverInfoFields(addColumnIndex);
	showOrHideAddtnllInfoChkBoxes(addColumnIndex);	
	if(getPolicyState() == 'MA'){
		showOrHideRegistryDataFields();
	}
	
	bindColumn('multiTable', 'last-child', 'Add');
	
	updateDriverScrollPanel(SCROLL_PANEL);
	
	// set tabindex for added column
	setTabIndex($('#driverCount').val(), $('#driverCount').val());
	

	if(false == isApplication()) {
		var licNum = '#licenseNumber_' + addColumnIndex;
		$(licNum).removeClass('required').removeClass('preRequired');
	}
/*	$('.chosen-single').focus(function(e){
	    e.preventDefault();
	});*/
	//set focus 	
	setFocus('licenseState_' + addColumnIndex);
	
	resetPremiumForAll();
	
	setAndDisableRelationshipToPNI();
	
	chkIfLicNumIsRequiredForADriver('#licenseNumber_' + addColumnIndex, YES);
	
	// Remove original value attribute for form reset trackinging
	$.each($('#mainContentTable .fieldRow11'), function(){
	    $(this).find('td:last input').removeAttr('origval');
	    $(this).find('td:last select').removeAttr('origval');
	});
	
	//52046 - Motorcycle licse should default to None
	$('#motorcycleLicTypeDesc_'+addColumnIndex).removeClass('preRequired').val('None')
			.trigger('chosen:updated').trigger('chosen:styleUpdated');
	
	//clear literal
	$('#driverStatusLiteral_' + addColumnIndex).text("");
}

function setFieldsForEndorsement(addColumnIndex) {
	// set Active to hidden var of LicenseStatus field
	$('#licenseStatus_' +  addColumnIndex).val("");
	
	//occupation is not required in quote mode
	if ( isQuote() ) {
		$('#occupation_' + addColumnIndex).removeClass('preRequired').removeClass('required');
		
	} else{
		if(getPolicyState() != 'MA'){
			$("#driverStatus_" + addColumnIndex).val(INSURED_ON_THIS_POLICY);
			$("#driverStatus_" + addColumnIndex).trigger('chosen:updated');
		}
	}
	
	// Licensed out of State or Country in the past 3 years.
	// remove disabled, set value and hide it.
	if (isElementExisting("#licOutOfStatePrior3YrsInd_" + addColumnIndex)) {
		$('#licOutOfStatePrior3YrsInd_' + addColumnIndex).prop('disabled', false);
		$('#licOutOfStatePrior3YrsInd_' +  addColumnIndex).val("No");
		showOrHideHtml("licOutOfStatePrior3YrsInd_" + addColumnIndex, 'hide');
	}
	
	// just hide List areas where a license was held	
	$('#listAreasdrivers[' + addColumnIndex + ']').hide();
	$('#listAreas_' + addColumnIndex).hide();
	
	//enable sr22 field
	if (isElementExisting("#sr22Filing_" + addColumnIndex)) {
		$('#sr22Filing_' + addColumnIndex).prop('disabled', false);
	}	
	
	// show licensestatus for new endorsement driver for MA state only
	// 55293- ENDTS:  License Status field does not display in AI endts
	if(getPolicyState() == STATE_MA){	
		showOrHideDrvrTableRow('clsLicenseStatusRow', 'show');
		showOrHideHtml("#licenseStatus_" + addColumnIndex, 'show');
	}else{
		showOrHideHtml("#licenseStatus_" + addColumnIndex, 'hide');
		clearColumnInLineError("#licenseStatus_" + addColumnIndex);		
	}
	
}

// Need to hook this up later
function showOrHideDriverStatus(strElm) { 

	var lastIndex = getIndexOfElementId(strElm);
	var showOrHide = 'show';
	
	if (isEndorsement()) {
		
		showOrHide = 'hide';		
	}
	
	showOrHideHtml($("#driverStatus_" + lastIndex), showOrHide);
	showOrHideHtml($(".clsDriverStatus"), showOrHide);
	return;
}

function showOrHideDriverInfoFields(columnIndex) {	
	
	// for newly add driver only
	// hide the below fields for new column
	if ($('tr.clsDateFirstLicenseRow').is(":visible")) {
		//$("#firstLicUsaDtNA_" + columnIndex).hide();
		//showOrHideHtml("#firstLicUsaDtNA_" + columnIndex, 'hide');
		//#52306
		showOrHideHtml("#firstLicUsaDt_" + columnIndex, 'hide');		
	}
	
	if ($('tr.clsDateFirstMALicenseRow').is(":visible")) {
		showOrHideHtml("#firstLicMADtNA_" + columnIndex, 'hide');
	}
	
	if ($('tr.clsOtherCarrierRow').is(":visible")) {
		//$("#otherPolicyCarrName_" + columnIndex).hide();	
		showOrHideHtml("#otherPolicyCarrName_" + columnIndex, 'hide');
	}
	
	if ($('tr.clsLicOutOfStateOrCountryRow').is(":visible")) {
		$("#licOutOfStatePrior3YrsInd_" + columnIndex).val('');
		triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + columnIndex));
		addChosen($("#licOutOfStatePrior3YrsInd_" + columnIndex).attr('id'));
		//$("#licOutOfStatePrior3YrsInd_" + columnIndex).hide();
		showOrHideHtml("#licOutOfStatePrior3YrsInd_" + columnIndex, 'hide');
		//applyChosenToPage($("#licOutOfStatePrior3YrsInd_" + columnIndex));
	}
	
	if ($('tr.clsListAreasRow').is(":visible")) {
		deleteListAreas(columnIndex);		
		//hide		
		//$("#listAreas_" + columnIndex).css('display', 'none');
		$("#listAreas_" + columnIndex).hide();
	}	
	
	if ($('tr.clsOccupationRow').is(":visible")) {
		var elm = $("#occupation_" + columnIndex);
		showOrHideOccupation(elm);
	}
	
	if ($('tr.clsMotorcycleLicenseRow').is(":visible")) {
		var elm = $("#motorcycleLicTypeDesc_" + columnIndex);
		showOrHideMotorcycleLicTypeDesc(elm);
	}
	
	if ($('tr.clsMotorcycleLicenseDateRow').is(":visible")) {
		showOrHideHtml("#motorcycleFirstLicDt_" + columnIndex, 'hide');
	}
	
	//TODO Revisit this if its a checkbox or dropdown
	if ($('tr.clsMotorcycleCourseIndRow').is(":visible")) {
		showOrHideHtml("#motorcycleCourseInd_" + columnIndex, 'hide');
	}
}

function showOrHideAddtnllInfoChkBoxes(columnIndex) {
	//Good student
	if ($('tr.clsGoodStudentRow').is(":visible")) {
		//$("#goodStudentNA_" + columnIndex).show();
		showOrHideHtml("#goodStudentNA_" + columnIndex, 'show');
		if ($("#goodStudent_" + columnIndex).is(":checked")) {
			$("#goodStudent_" + columnIndex).attr('checked', false);
		}
		//$("#goodStudent_" + columnIndex).hide();
		showOrHideHtml("#goodStudent_" + columnIndex, 'hide');
	}
	
	//Away at school
	if ($('tr.clsAwayAtSchoolRow').is(":visible")) {
		//$("#awayAtSchoolNA_" + columnIndex).show();
		showOrHideHtml("#awayAtSchoolNA_" + columnIndex, 'show');
		
		if ($("#awayAtSchool_" + columnIndex).is(":checked")) {
			$("#awayAtSchool_" + columnIndex).attr('checked', false);
		}
		//$("#awayAtSchool_" + columnIndex).hide();
		showOrHideHtml("#awayAtSchool_" + columnIndex, 'hide');
	}
	
	//Driver training
	if ($('tr.clsDrvrTrainingRow').is(":visible")) {
		//$("#drvrTrainingNA_" + columnIndex).show();
		showOrHideHtml("#drvrTrainingNA_" + columnIndex, 'show');
		if ($("#drvrTraining_" + columnIndex).is(":checked")) {
			$("#drvrTraining_" + columnIndex).attr('checked', false);
			disableDriverTraining(columnIndex);
		}
		//$("#drvrTraining_" + columnIndex).hide();
		showOrHideHtml("#drvrTraining_" + columnIndex, 'hide');
	}
	
	//Defensive driver course
	if ($('tr.clsDefDrvrCourseRow').is(":visible")) {
		//$("#defenseDrvrCourseNA_" + columnIndex).show();
		showOrHideHtml("#defenseDrvrCourseNA_" + columnIndex, 'show');
		
		if ($("#defenseDrvrCourse_" + columnIndex).is(":checked")) {
			$("#defenseDrvrCourse_" + columnIndex).attr('checked', false);
		}
		//$("#defenseDrvrCourse_" + columnIndex).hide();		
		//$("#defensiveDriverCourseDt_" + columnIndex).hide();
		showOrHideHtml("#defenseDrvrCourse_" + columnIndex, 'hide');		
		showOrHideHtml("#defensiveDriverCourseDt_" + columnIndex, 'hide');
		showOrHideDefensiveDriverChkBoxes("#defenseDrvrCourse_" + columnIndex);
	}
	
	//Yubi Driver
	if ($('#yubiEnabled').val() == 'true' && (getPolicyState() == STATE_NJ || getPolicyState() == STATE_PA)) {
		if ($('tr.clsYubiRow').is(":visible")) {
			showOrHideHtml("#yubiDriverNA_" + columnIndex, 'show');
			
			if ($("#yubiDriver_" + columnIndex).is(":checked")) {
				$("#yubiDriver_" + columnIndex).attr('checked', false);
			}
			showOrHideHtml("#yubiDriver_" + columnIndex, 'hide');
			showOrHideYubiChkBoxes("#yubiDriver_" + columnIndex);
		}
	}

	//Driver improvement course  PA_AUTO
	if ($('tr.clsDrvrImprovCourseRow').is(":visible")) {
		showOrHideHtml("#drvrImprovCourseNA_" + columnIndex, 'show');
		
		if ($("#drvrImprovCourse_" + columnIndex).is(":checked")) {
			$("#drvrImprovCourse_" + columnIndex).attr('checked', false);
		}
		showOrHideHtml("#drvrImprovCourse_" + columnIndex, 'hide');		
		showOrHideHtml("#driverImprovCourseDt_" + columnIndex, 'hide');
		showOrHideDriverImproveCourseChkBoxes("#drvrImprovCourse_" + columnIndex);
	}
	
	//Acc prev course
	if ($('tr.clsAccPrvCourseRow').is(":visible")) {
		//$("#accidentPrvntCourseNA_" + columnIndex).show();
		showOrHideHtml("#accidentPrvntCourseNA_" + columnIndex, 'show');
		if ($("#accidentPrvntCourse_" + columnIndex).is(":checked")) {
			$("#accidentPrvntCourse_" + columnIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#accidentPrvntCourse_" + lastIndex).trigger('change');
		}
		//$("#accidentPrvntCourse_" + columnIndex).hide();
		//$("#accidentPrvntCourseDt_" + columnIndex).hide();
		showOrHideHtml("#accidentPrvntCourse_" + columnIndex, 'hide');		
		showOrHideHtml("#accidentPrvntCourseDt_" + columnIndex, 'hide');		
	}
	
	//Sr22 filing
	if ($('tr.clsSr22FilingRow').is(":visible")) {
		//$("#sr22FilingNA_" + columnIndex).show();
		// showOrHideHtml("#sr22FilingNA_" + columnIndex, 'show');
		if ($("#sr22Filing_" + columnIndex).is(":checked")) {
			$("#sr22Filing_" + columnIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#sr22Filing_" + lastIndex).trigger('change');
		}
		//$("#sr22Filing_" + columnIndex).hide();
		//$("#sr22State_" + columnIndex).hide();
		showOrHideHtml("#sr22Filing_" + columnIndex, 'show');		
		showOrHideHtml("#sr22State_" + columnIndex, 'hide');
	}
}

function slideDriverStart(event) {
	var firstDriverVal = $('#firstDriver').val();
	
	slideToStart(event, $('#slidingFrameHeadId'), $('#firstDriver'));
	$('#firstDriver').val(firstDriverVal);
	slideToStart(event, $('#slidingFrameId'), $('#firstDriver'));
	updateDriverScrollPanel(SCROLL_PANEL);
}

function slideDriverLeft(event) {
	var firstDriverVal = $('#firstDriver').val();
	
	slideTableLeft(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstDriver'), parseInt($('#driverCount').val()), 1);
	$('#firstDriver').val(firstDriverVal);
	slideTableLeft(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstDriver'), parseInt($('#driverCount').val()), 1);
	updateDriverScrollPanel(SCROLL_PANEL);
}

function slideDriverRight(event) {
	var firstDriverVal = $('#firstDriver').val();
	
	slideTableRight(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstDriver'), parseInt($('#driverCount').val()), DRIVERS_PER_PAGE, 1);
	$('#firstDriver').val(firstDriverVal);
	slideTableRight(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstDriver'), parseInt($('#driverCount').val()), DRIVERS_PER_PAGE, 1);
	updateDriverScrollPanel(SCROLL_PANEL);
}

function slideDriverEnd(event) {
	var firstDriverVal = $('#firstDriver').val();	
	
	slideToEnd(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
	$('#firstDriver').val(firstDriverVal);
	slideToEnd(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
	updateDriverScrollPanel(SCROLL_PANEL);
}

function deleteDriver(deleteLink) {	
	var deleteMsg, deleteAction;
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	//var columnIndex = getColumnIndex(deleteColumn);
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	
	//get last index of element's id
	var lastIndex = getIndexOfElementId(deleteLink);
	
	// IE Reset fix
	if($('#firstName_' + lastIndex + '.preRequired').length == 1 || $('#middleName_' + lastIndex + '.preRequired').length == 1
			|| $('#lasstName_' + lastIndex + '.preRequired').length == 1 || $('#birthDate_' + lastIndex + '.preRequired').length == 1) {
		$('#participantRole_' + lastIndex).val('');
	}
		
	// don't delete the named insured1
	if (($('#participantRole_' + lastIndex).val() == 'PRIMARY_INSURED') || ($('#participantRole_' + lastIndex).val() == 'SECONDARY_INSURED')) {
		deleteAction = "DELETE_NAMED_INSURED_1";
		deleteMsg =  "You cannot delete Named Insured Driver. Should this driver need to be deleted, please delete the Named Insured on the Client tab, and in doing so, it will delete the corresponding Driver.";
		questionMessageForDriver(deleteMsg, deleteLink, columnIndex, deleteAction);
		return;
	}
	// no label column in this tables so starts with 0
	else if (columnIndex == 0 && parseInt($('#driverCount').val()) == 1) {
		confirmMessage("You cannot delete the last driver");
		return;
	} else {		
		var deletingDriver = $('#DriverColumnHeaderSeqNum_' + lastIndex).text() + ' ' + $('#DriverColumnHeaderDriverFullName_' + lastIndex).text();
		deleteAction = "DELETE_DRIVER";
		deleteMsg =  deletingDriver +"<br>You are about to delete the above driver. Please confirm deletion";
		questionMessageForDriver(deleteMsg, deleteLink, columnIndex, deleteAction);			
	}
}

function questionMessageForDriver(messageText, deleteLink, columnIndex, action){
	var headerTitle, primButtonText;
	
	$('#question #yes').unbind('click');
	$('#question #no').hide();
	
	if(action.toUpperCase() == "DELETE_DRIVER"){
		headerTitle = "WARNING!  Confirm Deletion";
		primButtonText = "Delete";
		$('#question #yes').click(function() {         
	    	$('#question').modal('hide');
	    	deleteDriverColumn(deleteLink, columnIndex);    	
	    	return true;
	    }); 
	}else{
		headerTitle = "WARNING!";
		primButtonText = "Ok";
		$('#question #yes').click(function() { 
	    	$('#question').modal('hide');	
	    	return true;
	    }); 
	}
	
	$('#question #title').html(headerTitle);
	$('#question #message').html(messageText);
	$('#question #closeQuestion').removeClass("hidden");
	$("#question #yes").text(primButtonText);
	$('#question').modal();
}

function removeDeletedDriverErrors(drvrIndex){
	
	var handlerfn = null;
	var driverIndex = null;
	$('li.errorMsg a').each(function() {		
		handlerfn  = $(this).attr('onclick');
		if(handlerfn != "" && handlerfn != null){
			driverIndex = handlerfn.split("_");
			if(driverIndex.length > 1){
				driverIndex = driverIndex[1].substring(0,1);
				if(driverIndex == drvrIndex){
					$(this).parent().remove(); 
				}
			}
		}
	});
//	if($('.softErrorMsgDetails').text().length == 0){
//		$('#pageAlertMessage').hide();
//	}
}

function deleteDriverColumn(deleteLink, columnIndex) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');	
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
		
	var deleteId = $('#driverId_' + (columnIndex), deleteColumn).val();
	
	$('#driverFullName_'+deleteId).val($('#firstName_'+columnIndex).val()+" "+$('#lastName_'+columnIndex).val());
	$('#originalDriverStatus_'+deleteId).val($('#driverStatus_'+columnIndex).val());
		
	deleteScrollableColumns(columnIndex, 'multiTable',
			$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
	
	// store deleted ids 
	if (deleteId != "") {
		if (!isEndorsement() && $('#endorsementDriverAddedInd_' + columnIndex).val() != 'Yes') { // This condition need to be reviewed later.....
			var driverVars = $('#hiddendriverVariables');
			var deletedDrivers = $('.deletedDrivers', driverVars);
			if (deletedDrivers.length == 0) {
				driverVars.append('<input id="deletedDrivers_0" class="deletedDrivers" type="hidden" value="" name="deletedDrivers[0]">');
			} else {
				driverVars.append($(deletedDrivers[0]).replaceIndices(deletedDrivers.length));
			}
			deletedDrivers = $('.deletedDrivers:last', driverVars);			
			deletedDrivers.val('' + deleteId);	
		}
		if(isEndorsement()){
			var driverVars = $('#hiddendriverVariables');
			var deletedDrivers = $('.deletedDrivers', driverVars);
			if (deletedDrivers.length == 0) {
				driverVars.append('<input id="deletedDrivers_0" class="deletedDrivers" type="hidden" value="" name="deletedDrivers[0]">');
			} else {
				driverVars.append($(deletedDrivers[0]).replaceIndices(deletedDrivers.length));
			}
			deletedDrivers = $('.deletedDrivers:last', driverVars);			
			deletedDrivers.val('' + deleteId);
			if($('input[class=clsEndorsementDriverAddedInd][value=Yes],input[class=clsEndorsementExistingDriverRatedInd][value=Yes]').length<1){
				$('input#endorsementRatedDriverInd').val("");
			}			
			//46941 - Need to reset sequence number if a driver is deleted
			//Need to think of another way to handle sequence numbers for Acc/Vio
			//setDriversSeqNums();	
		}
	}
	
	setDriverColumnHeaderSeqNums();	
	$('#isDriverInformationUpdated').val('true');
	bindColumn('multiTable', 'gt(' + (parseInt(columnIndex) - 1) + ')', 'Delete');
	
	//Commenting the below for performance TD#44246 since this is already called part of slideDriverEnd
	//updateDriverScrollPanel(SCROLL_PANEL);
	
	resetPremiumForAll();
	
	removeDeletedDriverErrors(columnIndex);
	
	// check for remaining drivers
	showOrHideGoodStdntAndAwayAtSchoolChkBoxesRows();
	showOrHideDrvrTrainingChkBoxesRow();
	
	if (getPolicyState() == STATE_MA) {
		//#54026... show/hide both label or field side rows
		showOrHideRMVLookupButtonRows();
	}
	
	alignRows();
	
	slideDriverEnd(event);
}

function setDriverColumnHeaderSeqNums() {
	var i = 0;
	$('span.driverColumnHeaderSeqNum').each(function() {		
		i++;
		$(this).text('#' + i + '-');
	});
}

function clearForm() {		
	document.aiForm.name.value = '';
	document.aiForm.policyKey.value = '';
}

function updateDriverColumnHeaderDriverName(strElm) {
	//get last index of element's id
	var lastIndex = getIndexOfElementId(strElm);
	var strFname = $('#firstName_' + lastIndex).val();
	var strLname = $('#lastName_' + lastIndex).val();
	var strFullName = strFname + ' ' + strLname;
	$('#DriverColumnHeaderDriverFullName_' + lastIndex).text(strFullName);
}

function updateDriverColumnHeaderDriverNameByIndex(driverIndex) {
	
	var strFname = $('#firstName_' + driverIndex).val();
	var strLname = $('#lastName_' + driverIndex).val();
	var strFullName = strFname + ' ' + strLname;
	$('#DriverColumnHeaderDriverFullName_' + driverIndex).text(strFullName);
}


function checkDriversMaritalStatus() {
	// if primary named insured marital status is M or Q or C
	// the one of the remaining drivers should be same
	var blnPNIMaritalStausChk = false;	
	var blnPNIMaritalStatusMatched = false;
	
	var insuredType = $('#participantRole_' + 0).val();
	
	if (insuredType == 'PRIMARY_INSURED') {		
		var maritalStatusOfPNI =  $('#maritalStatus_' + 0).val();
		if(maritalStatusOfPNI == 'M' || maritalStatusOfPNI == 'Q' || maritalStatusOfPNI == 'C') {
			blnPNIMaritalStausChk = true;
		}
		
		if (blnPNIMaritalStausChk) {
			// check remaining drivers marital status			
			$('select.clsMaritalStatus').each(function() {	
				var lastIndex = getIndexOfElementId(this);
				// check other than PRIMARY_INSURED
				if ($('#participantRole_' + lastIndex).val() != 'PRIMARY_INSURED') {
					// check marital status of each driver
					if (maritalStatusOfPNI == $('#maritalStatus_' + lastIndex).val()) {
						blnPNIMaritalStatusMatched = true;
					}
				} 
			});
			
			if (! blnPNIMaritalStatusMatched) {
				confirmMessage("Missing Married / Domestic Partner / Civil Union driver, please enter");
				return 1;
			}
		}
	}
	
	return 0;
}

function acceptNameCharsOnly(strElm, e) {
	if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 || 
			e.keyCode == 13 || 
            // Allow: Ctrl+A
           (e.keyCode == 65 && e.ctrlKey === true) || 
            // Allow: home, end, left, right
           (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
       }
    	   if ((e.keyCode >= 65 && e.keyCode <= 90) 
    			   || (e.keyCode == 32) 
    			   //48359 - Do not alow  " and _
    			   //48359 - Allow ' and -
    			   || (e.keyCode == 222 && e.shiftKey !== true) 
    			   || (e.keyCode == 189 && e.shiftKey !== true) 
    			   || (e.keyCode == 55 && e.shiftKey === true)) { 
    		   return;
    	   }
    		   //for non ie
			   if(e.preventDefault){     				   
			    	e.preventDefault();    			    	
			    }
			    else{
			    	//for ie
			    	 e.returnValue = false;
			    }   			   
}

function acceptNumericsAndSlashes(strElm, e) {
	if(e.keyCode == 8 || e.keyCode == 9)
		return;
	
	var regex = new RegExp("^[0-9/]+$");
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(key)) {
    	if(e.preventDefault){     				   
	    	e.preventDefault();    			    	
	    }
	    else{
	    	//for ie
	    	 e.returnValue = false;
	    }    	 
    }
}

function setDateFirstLicensedDatesForAllDrvrs() {
	
	$('input.clsBirthDate').each(function() {	
		//var blnIsValid = validateDateEntry($(this));
		
		//if (blnIsValid) {
			setDateFirstLicensedDate($(this));
		//}
	});
}

function setDateFirstLicdDatesIfEmptyForMAPolicy() {
	
	$('input.clsBirthDate').each(function() {	
		var lastIndex = getIndexOfElementId(this);
		var strPolicyState = getPolicyState();
		var strLicState = $("#licenseState_" + lastIndex).val();
		var strFirstLicUsaDt = $("#firstLicUsaDt_" + lastIndex).val();
		
		// if first lic usa dt is empty then set default value
		if ( strFirstLicUsaDt == '') {
			if (strPolicyState == STATE_MA && strLicState != STATE_MA) {
				 if ( isRated(lastIndex) || isDeferred1(lastIndex) ) {
					 setDateFirstLicensedDate($(this));
				 }
			}
		}
	});
}

function setDateFirstLicensedDate(strElm) {
	var dateAddValue=0;
	var lastIndex = getIndexOfElementId(strElm);
	var birthDate = $(strElm).val();
	
	if(getPolicyState() != STATE_MA){
		// set DOB+16 for data first us licensed date automatically for non MA only
		dateAddValue=16;
	} else{
		var dmlValue = $('#firstLicMADt_'+lastIndex).val();
		//52043 If the POLICY STATE  = MA If DML (Date first MA Licensed is Blank/Null, Default to DOB (date of birth + 17).  
		//Else if DML-DOB < 18 Years, default to DML.  Else Default to DOB = 17 Years.
		if(dmlValue==null || dmlValue=='' || getMonthsDifference(dmlValue,birthDate)>=18*12){
			dateAddValue=17;
		} else{
			$('#firstLicUsaDt_' + lastIndex).val(dmlValue);
			return;
		}
	}
	$('#firstLicUsaDt_' + lastIndex).val("");
	if (birthDate!=null && birthDate != '') {
		//check if date is valid or not
		var blnIsValidDate = validateDtAndFutureDt(strElm);
		if (blnIsValidDate) {
			var dateParts = birthDate.split("/");
			var month = dateParts[0];
			var day = dateParts[1];			   
		    var year = dateParts[2]; 
		    if (year != "") {
		    	year = parseInt(year) + dateAddValue;
		    }
		    var strNewDate = month + "/" + day + "/" + year;			
		    // finally this date will be double checked during submitevent
			$('#firstLicUsaDt_' + lastIndex).val(strNewDate);
			//clear inline error if any			
			clearColumnInLineError("#firstLicUsaDt_" + lastIndex);
		}
	} 
}

var validateInputDate = function (strElm) {	
	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);		
	var msg = '';
	
	if (!blnIsValid1) {		
		msg = 'formatShouldBeMM/DD/YYYY';
	} else if (!blnIsValid2) {		
		msg = 'cannotBeInTheFuture';
	} 
	
	return msg;
};

var validateBirthDate = function (strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	
	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);	
	
	var msg = '';
	
	if (!blnIsValid1) {		
		msg = 'formatShouldBeMM/DD/YYYY';
	} else if (!blnIsValid2) {		
		msg = 'cannotBeInTheFuture';
	} else {
		var intAge = calculateAge($(strElm).val(),null);
		if (parseInt(intAge) > 110) {			
			msg = 'driverCannotBeOlderThan110Years';
		}
	}
	
	// clear birth date and dependant field(s)
	if (msg != '') {
		//$(strElm).val("");
		if (getPolicyState() != STATE_MA) { $('#firstLicUsaDt_' + lastIndex).val(""); }
	} else {
		if (getPolicyState() == STATE_PA) { showOrHideDriverImproveCourseChkBoxes(strElm); }		//PA_AUTO
	}
	
	return msg;
};

var validateDateFirstLicensed = function (strElm) {
	
	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);
	//index of element
	var lastIndex = getIndexOfElementId(strElm);
	var hdnField = '#birthDate_' + lastIndex;
	// now validate hidden birthdate field
	var strElmBtDt = hdnField;
	var blnIsValid3 = validateDateEntry(strElmBtDt);	
	var msg = '';
	
	if (!blnIsValid1) {		
		msg = 'formatShouldBeMM/DD/YYYY';
	} else if (!blnIsValid2) {
		//check if year is greater than current year
		var inputYear = parseInt($(strElm).val().split("/")[2]);
		var currYear = parseInt(new Date().getFullYear());
		if (inputYear > currYear) {
			msg = 'invalid4DigitYear';
		} else {
			msg = 'cannotBeGreaterCurrentDate';
		}
	} 
	//now compare birthdate with first license date
	if(blnIsValid1 && blnIsValid2 && blnIsValid3 && (isRated(lastIndex) || isDeferred1(lastIndex))){
		var intBirthDateAge = calculateAge($(strElmBtDt).val(),$(strElm).val());
		if(intBirthDateAge<16){
				msg = 'mustBeSixteen';
		}else{
		// check for MA license date being current
		var firstMALicDt = $('#firstLicMADt_' + lastIndex).val();
		//TODO commenting below edit temporarily due to insurity production issue, need to revert back later.
		/*if(firstMALicDt != null || firstMALicDt != undefined || firstMALicDt.length>1){
			var calDiffDateFirstLicensed = dateFirstLicensedAfterFirstMALicDate(firstMALicDt,$(strElm).val());
			if(calDiffDateFirstLicensed > 0){
				msg = 'required';
			}
			
		}*/
		}
	}
	return msg;
};

var validateMaskedBirthDate = function (strElmnt) {
	var lastIndex = getIndexOfElementId(strElmnt);

	var hdnField = '#birthDate_' + lastIndex;
	
	// now validate hidden birthdate field
	var strElm = hdnField;

	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);
	
	var msg = '';
	
	if (!blnIsValid1) {		
		msg = 'formatShouldBeMM/DD/YYYY';
	} else if (!blnIsValid2) {		
		msg = 'cannotBeInTheFuture';
	} else {
		var intAge = calculateAge($(strElm).val(),null);
		if (parseInt(intAge) > 110) {			
			msg = 'driverCannotBeOlderThan110Years';
		}
	}
	
	// clear only dependant field(s)
	if (msg != '') {
		//$(strElm).val("");
		if (getPolicyState() != STATE_MA) { $('#firstLicUsaDt_' + lastIndex).val(""); }
	} else {
		if (getPolicyState() == STATE_PA) { showOrHideDriverImproveCourseChkBoxes(strElm); }		//PA_AUTO
	}
	
	return msg;
};

function populateDOBHiddenVar(maskField, hdnField){
	var maskFldVal = $.trim($(maskField).val());	
	
	//populate hidden var if masked data is changed	
	if( (maskFldVal == "") || (maskFldVal.substr(0,6) != "**/**/") ){
		$(hdnField).val(maskFldVal);			
	}
}

function  clearMaskedValue(strElm, e, strType) {
	
	var maskFldVal = $.trim($(strElm).val());
	
	//Date of Birth	
	if ( (strType == "2") && (maskFldVal.substr(0,6) == "**/**/") ) {
		//clear date for any key press except for tab & shift 
		if (e.keyCode != 9 && e.keyCode !=16 )
		{
			$(strElm).val("");
			//clear hidden dob also.
			$("#birthDate_" + getIndexOfElementId(strElm)).val("");
		}
	} 
}

//TD 48667- commenting this out as this is page level edits only as per defect
/*var validateLicState = function (strElm) {
	
	// Need to wipe out the message
	setTimeout("deleteUnwantedInlineErrors()",10);
	var licStatusErrMsg = '';
	if(false == isValidLicStateAndDriverStatuses(strElm)){
		licStatusErrMsg = "invalidLicStateAndDriverStatus";
	}
	return licStatusErrMsg;
};*/

//TD 48667- commenting this out as this is page level edits only as per defect
/*function isValidLicStateAndDriverStatuses(strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	var strLicState = getLicenseState(lastIndex);
	var strDriverStatus = getDrvrStatus(lastIndex);

	var isValid = true;
	if(getPolicyState() == 'MA'){
		if(strLicState == NOT_LICENSED 
				&& strDriverStatus != NO_LONGER_LICENSED 
				&& strDriverStatus != NEVER_LICENSED
				&& strDriverStatus != ''){
			isValid = false;
		}
	}else{
		if(strLicState == NOT_LICENSED){
			if(	(strDriverStatus != AWAY_IN_ACTV_SERVC)
					&& (strDriverStatus != NO_LONGER_LICENSED)
					&& (strDriverStatus != NEVER_LICENSED)
					&& (strDriverStatus != PERMIT) 
					&& (strDriverStatus != '')) {
				isValid = false;
			}
		}
	}
	return isValid;
}*/

var validateLicAndDriverStatuses = function (strElm) {
	
	if (false == isValidLicAndDriverStatusCombo (strElm)) {
		return 'invalidLicAndDriverStatus';
	} 
	//TD 48667- commenting this out as this is page level edits only as per defect
	/*else if (false == isValidLicStateAndDriverStatuses (strElm)) {
		return 'invalidLicStateAndDriverStatus';
	}*/
	else {
		return '';
	}	
};
//56708 -Checkout-Driver marked as insured elsewhere during prefill reconcile are not being deferred on driver page
//55293-CC 464- EXPIRED_MA_LICENSE("X"),NEVER_MA_LICENSED("N"),NO_LONGER_MA_LICENSED("NL");
var isValidLicAndDriverStatusCombo = function (strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	var strLicStatus = getLicenseStatus(lastIndex);
	var strDriverStatus = getDrvrStatus(lastIndex);
		
	if (strLicStatus == '' || strDriverStatus == '' ) {
		return true;
	}
	
	
	switch(strLicStatus) {

	    case ACTIVE:
	    case ACTIVE_MA:	
	
	    	return (strDriverStatus == INSURED_ON_THIS_POLICY || strDriverStatus == INSURED_ON_ANOTHER_PRAC	
	                            || strDriverStatus == INSURED_ELSE_WHERE|| strDriverStatus == AWAY_IN_ACTV_SERVC) ;
	        break;	
	     
	    case SUSPENDED_LICENSE:       	
	    case SUSPENDED_LICENSE_MA:
	    	return (strDriverStatus == INSURED_ON_ANOTHER_PRAC || strDriverStatus == INSURED_ELSE_WHERE	
	                            || strDriverStatus == SUSPENDED_OPERATOR || strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;	
	    case REVOKED_LICENSE:       	
	    case REVOKED_LICENSE_MA:
	    case CANCELLED:
	    case CANCELLED_MA:
	    	return (strDriverStatus == INSURED_ON_ANOTHER_PRAC || strDriverStatus == INSURED_ELSE_WHERE	
	                            || strDriverStatus == REVOKED_OPERATOR|| strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;	
	    case NO_LONGER_LICENSED: 
	    case NO_LONGER_MA_LICENSED: 
	    	return (strDriverStatus == NO_LONGER_LICENSED || strDriverStatus == AWAY_IN_ACTV_SERVC);
	
	        break;
	    case EXPIRED_LICENSE:  
	    case EXPIRED_LICENSE_MA:
	    case EXPIRED_MA_LICENSE:	
	    	return (strDriverStatus == INSURED_ON_THIS_POLICY || strDriverStatus == INSURED_ON_ANOTHER_PRAC	
                    || strDriverStatus == INSURED_ELSE_WHERE || strDriverStatus == NO_LONGER_LICENSED || strDriverStatus == AWAY_IN_ACTV_SERVC);
	    		
	    	break;	
	    case NEVER_LICENSED:	
	    case NEVER_MA_LICENSED:
	    	return (strDriverStatus == AWAY_IN_ACTV_SERVC || strDriverStatus == NEVER_LICENSED);	         		
	        break;	
	        
	    case DENIED:
	    case DENIED_MA:	// #52128
	    	return (strDriverStatus == NO_LONGER_LICENSED || strDriverStatus == AWAY_IN_ACTV_SERVC || strDriverStatus == NEVER_LICENSED);
	         		
	        break;	         	 
	    case PERMIT:
	    	
	    	return (strDriverStatus == INSURED_ON_THIS_POLICY || strDriverStatus == INSURED_ON_ANOTHER_PRAC	
                    || strDriverStatus == INSURED_ELSE_WHERE || strDriverStatus == AWAY_IN_ACTV_SERVC || strDriverStatus == PERMIT);
	                  		
	        break; 
	    default:
	
	    	return false;
	}		
};

var validateDefenseDrvngCrseDate = function (strElm) {
	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);
	
	if (!blnIsValid1) {
		$(strElm).val(""); 
		return 'formatShouldBeMM/DD/YYYY';
	}
	
	if (!blnIsValid2) {
		$(strElm).val(""); 
		return 'cannotBeInTheFuture';
	}
	
	var defDrvngCrseDt = Date.parse($(strElm).val());
	var policyEffDt = Date.parse($("#policyEffDt").val());
	var dateDifference = policyEffDt - defDrvngCrseDt; 
	var noOfDays = ((dateDifference % 31536000000) % 2628000000)/86400000;
	
	if (defDrvngCrseDt < policyEffDt) {
		var months = getMonthsDifference($(strElm).val(), $("#policyEffDt").val());
		if (parseInt(months) > 36 || (parseInt(months) == 36 && noOfDays > 0 )) {
			$(strElm).val("");
			if(($(strElm).hasClass('clsDrvrImprovCoursDt'))  && isEndorsement()){
				return 'cannotBeGreaterThan36MonthsPriorEnd';
			}else
				{
					return 'cannotBeGreaterThan36MonthsPrior';	
				}
			
		}
	}	
		
	return '';
};

var validateAccPrvCrseDate = function (strElm) {
	var blnIsValid1 = validateDateEntry(strElm);	
	var blnIsValid2 = validateFutureDate(strElm);
	
	if (!blnIsValid1) {
		$(strElm).val(""); 
		return 'formatShouldBeMM/DD/YYYY';
	}
	
	if (!blnIsValid2) {
		$(strElm).val(""); 
		return 'cannotBeInTheFuture';
	}
	
	var accPrevCrseDt = Date.parse($(strElm).val());
	var policyEffDt = Date.parse($("#policyEffDt").val());
	 
	var dateDifference = policyEffDt - accPrevCrseDt; 
	var noOfDays = ((dateDifference % 31536000000) % 2628000000)/86400000;
	
	if (accPrevCrseDt < policyEffDt) {
		var months = getMonthsDifference($(strElm).val(), $("#policyEffDt").val());
		if (parseInt(months) > 12 || (parseInt(months) == 12 && noOfDays > 0 )) {
			return 'cannotBeGreaterThan12MonthsPrior';
		}
	}	
	
	return '';
};

function validateDtAndFutureDt(strElm) {
	var blnIsValid = validateDateEntry(strElm);
	if (!blnIsValid) {
		return false;
	}
	
	var today = new Date();
    var DOB = Date.parse($(strElm).val());
    if (DOB > today ) {
    	return false;
    }
    return true;
} 

var validateLicenseNumber = function (strElm) {
	var lastIndex = getIndexOfElementId(strElm); 
	//var strLicNum = trimSpaces($(strElm).val());
	// trim it #53142
	$('#licenseNumber_' + lastIndex).val(trimSpaces($('#licenseNumber_' + lastIndex).val()));
	var strLicNum = $('#licenseNumber_' + lastIndex).val();
	var strLicstate = trimSpaces(getLicenseState(lastIndex));
	//
	var strExistingPolstarLicState = $('#endrsmntExistingPolstrDrvrLicStateCd_' + lastIndex).val();
	var strExistingPolstarLicNum = $('#endrsmntExistingPolstrDrvrLicNum_' + lastIndex).val();
	//
	var strFormat1 = '';
	var strFormat2 = '';
	var strMsg = '';
	
	  //TD 66601 (updates to driver license field validation)
	  if(!!strLicstate && !!strLicNum){
			var validationMsg = invokeDLValidation(strLicstate, strLicNum);
			if (validationMsg == "false" ) {
				 strMsg = "notValidLicNumber";
				 
				//Align licenseNumberErrorHeader on page load for invalid license number.
				$('#licenseNumber_Error_Header').addClass('licenseNumberErrorHeaderAlign');
			}
		}
				
	//#54890..Endorsement...for existing driver don't validate lic number unless state or lic num changed.
	if (isEndorsement()) {
		if(!isEndorsementAddedDriver(lastIndex)) {
			if (strLicstate == strExistingPolstarLicState && strLicNum == strExistingPolstarLicNum) {
				strMsg = '';
			}
		}
	}
	
	return strMsg;
};


function invokeDLValidation(stateCd, value){
	var strLicNum = trimSpaces(value);
	var strLicstate = trimSpaces(stateCd);
	
	var strURL = addRequestParam("/aiui/drivers/isValidLicenseNumber", "stateCd", strLicstate);
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

var validateUniqueLicenseNumber = function (strElm) {
	var currDrvrLastIndex = getIndexOfElementId(strElm); 
	//actual lic num field
	var currDrvrLicNum = $('#licenseNumber_' + currDrvrLastIndex).val();
	var currDrvrLicstate = trimSpaces(getLicenseState(currDrvrLastIndex));
	var strMsg = EMPTY;
	
	// check this license numb exists for other drivers
	$('input.clsLicenseNumber').each(function(){
		var lastIndex = getIndexOfElementId(this); 
		//actual lic num field
		var strLicNum = $('#licenseNumber_' + lastIndex).val();
		var strLicstate = trimSpaces(getLicenseState(lastIndex));
		
		//skip the same driver check
		if (currDrvrLastIndex != lastIndex) {
			if (currDrvrLicNum != '' && currDrvrLicstate != '' && strLicNum != '' && strLicstate != '') {
				if ( currDrvrLicNum == strLicNum && currDrvrLicstate == strLicstate) {
					strMsg = 'mustBeUnique';
				}
			}
			
		}		
 	});
	return strMsg;
};

var validateMaskedLicenseNumber = function (strElmnt) {
	var msg = validateLicenseNumber(strElmnt);
	return msg;
};

function populateLicHiddenVar(maskField, hdnField) {
	var maskFldVal = $.trim($(maskField).val());	
	//populate hidden var if masked data is changed	
	if( (maskFldVal == "") || (maskFldVal.substr(maskFldVal.length-4, 4) != "****") ){
		$(hdnField).val(maskFldVal);			
	}
}

function setDriverStatus(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	removePreRequiredStyle($("#driverStatus_" + lastIndex));
	$("#driverStatus_" + lastIndex).val(getRmvDriverStatusCd($("#licenseStatus_" + lastIndex).val())).trigger('chosen:updated');
	// clear any error
	clearColumnInLineError("#driverStatus_" + lastIndex);
}

function showOrHideDateFirstLicense(strElm) { 
	//for testing
	//return true;
	
	var lastIndex;		
	var strPolicyState;
			
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
	
		
	if ((strPolicyState == STATE_MA)&&(isRated(lastIndex) || isDeferred1(lastIndex))) {
		showOrHideDrvrTableRow('clsDateFirstLicenseRow', 'show'); 
		showOrHideHtml("#firstLicUsaDt_" + lastIndex, 'show');
		return;
	}
	showOrHideHtml("#firstLicUsaDt_" + lastIndex, 'hide');
	
	clearColumnInLineError("#firstLicUsaDt_" + lastIndex);
	
	
	// show or hide date first license row
	////showOrHideFieldRow('clsDateFirstLicenseRow', 'clsDateFirstLicense');
	var blnShowRow = false;
	
	$('.clsDateFirstLicense').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 
		 if ((strPolicyState == STATE_MA)&&(isRated(lastIndex) || isDeferred1(lastIndex))) {
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsDateFirstLicenseRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsDateFirstLicenseRow', 'hide');
	}	
}

function showOrHideRegistryDataFields() {
	showOrHideDateFirstMALicense();
	showOrHideSDIP();
	showOrHideRmvLookUpDate();
}

function showOrHideDateFirstMALicense() { 
	
	//FR 3.2.12 Date First MA Licensed Field for NB & Endorsment
	//This field is only displayed if the Client field State = MA and if the Driver page field License State = MA
	
	showOrHideRegistryData('clsDateFirstMALicenseRow', '.clsDateFirstMALicense', '#firstLicMADt_');
}

function showOrHideSDIP() { 
	//FR 3.2.12 SDIP Field for NB & Endorsment
	//This field is only displayed if the Client field State = MA and if the Driver page field License State = MA
	
	showOrHideRegistryData('clsSDIPRow', '.clsSDIP', '#sdip_');
}

function showOrHideRmvLookUpDate() { 
	
	//FR 3.2.12 Date RMV Lookup date Field for NB & Endorsment
	//This field is only displayed if the Client field State = MA and if the Driver page field License State = MA
	
	showOrHideRegistryData('clsRmvFirstLookupDate', '.clsFirstLookupDate', '#rmvFirstLookupDate_');
}

function showOrHideRegistryData(rowClass, fieldldClass, fieldId ) {
	
	//FR 3.2.12 Date First MA Licensed Field for NB & Endorsment..#53416(Same applicable for registry data flds)
	//This field is only displayed if the Client field State = MA and if the Driver page field License State = MA
	
	// if Registry Data class (.expandCollapseRows)(+) is not expanded then always hide the entire row.
	if (!blnRegistryDataExpaned) {
		showOrHideDrvrTableRow(rowClass, 'hide');
		return;
	}
	
	var blnShowRow = false;
	
	// loop thru and show/hide each element based on condition.
	$(fieldldClass).each(function() {	
		var lastIndex = getIndexOfElementId(this);
		 if (isDisplaybleForRegistry(this)) {
			 showOrHideHtml(fieldId + lastIndex, 'show');
			 blnShowRow = true;
		 } else {
			 showOrHideHtml(fieldId + lastIndex, 'hide');
		 }
	});
	
	// show or hide entire row
	if (blnShowRow) {		
		showOrHideDrvrTableRow(rowClass, 'show');
	}else {		
		showOrHideDrvrTableRow(rowClass, 'hide');
	}
}

function isDisplaybleForRegistry(strElm) {
	
	var licState = $("#licenseState_" + getIndexOfElementId(strElm)).val();
	
	return (getPolicyState() == STATE_MA && licState == STATE_MA);
}

//This function is called for endorsement only
function showOrHideLicenseStatus(){
	
	var lastIndex='';		
	var strPolicyState;			
	strPolicyState = getPolicyState();	
	
	//show or hide license status row
	// show for new endorement driver & MA policy state only
	var blnShowRow = false;
	
	$('select.clsLicenseStatus').each(function() {		
		lastIndex = getIndexOfElementId(this);
		// 55293- ENDTS:  License Status field does not display in AI endts MA Only
		if(strPolicyState == STATE_MA){
			blnShowRow = true;
			showOrHideDrvrTableRow('clsLicenseStatusRow', 'show');
			showOrHideHtml("#licenseStatus_" + lastIndex, 'show');
		}else{
			showOrHideHtml("#licenseStatus_" + lastIndex, 'hide');
			clearColumnInLineError("#licenseStatus_" + lastIndex);		
		}
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsLicenseStatusRow', 'show');
		addChosen($("#licenseStatus_" + lastIndex).attr('id'));
	}
	else {		
		showOrHideDrvrTableRow('clsLicenseStatusRow', 'hide');
	}	
}

function showOrHideOtherCarrier(strElm) { 
	var lastIndex;		
	var strPolicyState;
	var strDrvrStatus;
		
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
	strDrvrStatus = getDrvrStatus(lastIndex);
	
	if ((isApplicationOrEndorsement())
	&& (strDrvrStatus == INSURED_ELSE_WHERE)) {	
		if ($('#isMaipPolicy').val() == "false") {
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'show');
		showOrHideHtml("#otherPolicyCarrName_" + lastIndex, 'show');
		}
		return;
	}
	showOrHideHtml("#otherPolicyCarrName_" + lastIndex, 'hide');
	clearColumnInLineError("#otherPolicyCarrName_" + lastIndex);
	
	// show or hide other carrier row
	var blnShowRow = false;
	$('select.clsOtherCarrierSelect').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strDrvrStatus = getDrvrStatus(lastIndex);
		 
		 if ((isApplicationOrEndorsement())
		 && (strDrvrStatus == INSURED_ELSE_WHERE)
				 && ($('#isMaipPolicy').val() == "false")
		 && (strPolicyState == STATE_CT || strPolicyState == STATE_NH 
			 || strPolicyState == STATE_NJ || strPolicyState == STATE_MA || strPolicyState == STATE_PA)) {		//PA_AUTO - added PA state
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'show');
	} else {		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'hide');
	}	
}

function showOrHideOccupation(strElm) { 
	var lastIndex;		
	var strPolicyState;
			
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
		
	if ((isApplicationOrEndorsement()) 	&& (strPolicyState != STATE_MA)) {
		showOrHideDrvrTableRow('clsOccupationRow', 'show');
		showOrHideHtml("#occupation_" + lastIndex, 'show');
		return;
	}
	triggerChangeEvent($("#occupation_" + lastIndex));
	showOrHideHtml("#occupation_" + lastIndex, 'hide');
	
	// show or hide occupation row
	////showOrHideFieldRow('clsOccupationRow', 'clsOccupation');
	var blnShowRow = false;
	
	$('select.clsOccupation').each(function() {		
		 lastIndex = getIndexOfElementId(this);
				 
		if ((isApplicationOrEndorsement())
		&& (strPolicyState != STATE_MA)) {
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsOccupationRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsOccupationRow', 'hide');
	}	
}

function showOrHideMotorcycleLicTypeDesc(strElm) { 
	var lastIndex;		
	var strPolicyState;
			
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
		
	if (strPolicyState == STATE_MA) {
		showOrHideDrvrTableRow('clsMotorcycleLicenseRow', 'show');
		showOrHideHtml("#motorcycleLicTypeDesc_" + lastIndex, 'show');
		return;
	}
	
	triggerChangeEvent($("#motorcycleLicTypeDesc_" + lastIndex));
	showOrHideHtml("#motorcycleLicTypeDesc_" + lastIndex, 'hide');
	
	// show or hide occupation row
	var blnShowRow = false;
	
	$('select.clsMotorcycleLicenseRow').each(function() {		
		 lastIndex = getIndexOfElementId(this);
				 
		if (strPolicyState == STATE_MA) {
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseRow', 'hide');
	}	
}

function showOrHideLicOutOfStateOrCountry(strElm,setDefVal) { 
	var lastIndex;	
	var strLicState;	
	
	lastIndex = getIndexOfElementId(strElm);
	strLicState = getLicenseState(lastIndex);
	
	if(	(null == setDefVal) ||
		('undefined' == setDefVal)){
		setDefVal = false;
	}
	
	//  MA
	if (getPolicyState() == STATE_MA) {
		if ((strLicState == STATE_MA) && (isRated(lastIndex) || isDeferred1(lastIndex))) {			
			showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'show');
			
			if(setDefVal == true){
				$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("No");
				triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));
				clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);				
			}
		}
		else if ((strLicState != '') && (strLicState != STATE_MA) && (isRated(lastIndex))) {			
			showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'show');
			
			if(setDefVal == true){
				$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("No");
				triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));
				clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
			}
		}
		else {			
			$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("");
			triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));
			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'hide');
			clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
			
			// hide list areas also
			showOrHideListAreas(strElm);
		}
	}
	else {
		//NON MA
		if (isRated(lastIndex)) {			
			showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'show');
			
			if(setDefVal == true){
				$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("No");
				triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));
			}		
		}
		else {
			$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("");
			triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'hide');
			clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
			
			// hide list areas also
			showOrHideListAreas(strElm);
		}
	}
	
	if ($("#licOutOfStatePrior3YrsInd_" + lastIndex).val() != "") {
		removePreRequiredStyle($("#licOutOfStatePrior3YrsInd_" + lastIndex));
		//$("#licOutOfStatePrior3YrsInd_" + lastIndex).removeClass("preRequired");
	}
	
	//defect 45347. always hide for every driver in endorsement.(Including newly added)
	if ( isEndorsement() ) {
		$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("");
		showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'hide');
		clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
		// hide the row and return
		showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'hide');
		return;
	}
	
	// show or hide Lic out of state or country row 	
	var blnShowRow = false;
	
	$('select.clsLicOutOfStateOrCountrySelect').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strLicState = getLicenseState(lastIndex);
		 
		 // check each driver if not a newly added endorsement driver
		 //if ( !isEndorsementAddedDriver(lastIndex) ) { //commented for defect 45347 to handle above
			 if (getPolicyState() == STATE_MA) {
				if ((strLicState == STATE_MA)&&(isRated(lastIndex) || isDeferred1(lastIndex))) {
					blnShowRow = true;	
					return true;
				}
				else if ((strLicState != STATE_MA)&&(isRated(lastIndex))) {
					blnShowRow = true;	
					return true;
				}				
			}
			else {
				//NON MA
				if (isRated(lastIndex)) {
					blnShowRow = true;
					return true;
				}				
			}
		 //}
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'hide');
	}
}

function showOrHideListAreas(strElm) {
	var lastIndex;
	var strLicOutOfState;
	
	lastIndex = getIndexOfElementId(strElm);
	strLicOutOfState = getLicOutOfState(lastIndex);
	
	// don't show for newly added endorsement driver
	if ( (strLicOutOfState == "Yes") && (!isEndorsementAddedDriver(lastIndex)) ) {
		//$('.' + 'clsListAreasRow').show();
		showOrHideDrvrTableRow('clsListAreasRow', 'show');	
		$("#listAreas_" + lastIndex).parent().css('display', 'block');
		$("#listAreas_" + lastIndex).css('display', 'block');
		return;
	}
	//clear List areas first
	 deleteListAreas(lastIndex);	
	 
	//hide		
	$("#listAreas_" + lastIndex).css('display', 'none');
	$("#listAreas_" + lastIndex).parent().css('display', 'none');
	clearColumnInLineError("#listAreas_" + lastIndex);
	
	//show or hide the row
	var blnShowRow = false;
	
	$('.listAreas').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strLicOutOfState = getLicOutOfState(lastIndex);
		 
		 if ( (strLicOutOfState == "Yes") && (!isEndorsementAddedDriver(lastIndex)) ) {
			blnShowRow = true;
			return true;				
		}
		
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsListAreasRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsListAreasRow', 'hide');
	}
	
}


function showOrHideGoodStdntAwayAtSchlChkBoxes(strElm) {
	
	var lastIndex;
	
	lastIndex = getIndexOfElementId(strElm);
	
	if (areGoodStudentAndAwayAtSchoolDisplayble(strElm)) {
		// show checkboxes and hide N/A
		// Good student			
		showOrHideHtml("#goodStudentNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsGoodStudentRow', 'show');
		showOrHideHtml("#goodStudent_" + lastIndex, 'show');
		
		// Away at school					
		showOrHideHtml("#awayAtSchoolNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsAwayAtSchoolRow', 'show');
		showOrHideHtml("#awayAtSchool_" + lastIndex, 'show');	
		
		return;
	} 
	// Good student
	showOrHideHtml("#goodStudentNA_" + lastIndex, 'show');
	if ($("#goodStudent_" + lastIndex).is(":checked")) {
		$("#goodStudent_" + lastIndex).attr('checked', false);
	}
	showOrHideHtml("#goodStudent_" + lastIndex, 'hide');
	
	// Away at school
	showOrHideHtml("#awayAtSchoolNA_" + lastIndex, 'show');
	if ($("#awayAtSchool_" + lastIndex).is(":checked")) {
		$("#awayAtSchool_" + lastIndex).attr('checked', false);
	}
	showOrHideHtml("#awayAtSchool_" + lastIndex, 'hide');

	// finally check if entire row to be shown or not for other drivers also	
	showOrHideGoodStdntAndAwayAtSchoolChkBoxesRows();
	
}

function showOrHideGoodStdntAndAwayAtSchoolChkBoxesRows() {
	
	var blnShowRow = false;
	
	$('.clsGoodStudentChkBox, .clsAwayAtSchoolChkBox').each(function() {		
		if (areGoodStudentAndAwayAtSchoolDisplayble(this)) {
			blnShowRow = true;
			return true;
		}		
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsGoodStudentRow', 'show');
		showOrHideDrvrTableRow('clsAwayAtSchoolRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsGoodStudentRow', 'hide');
		showOrHideDrvrTableRow('clsAwayAtSchoolRow', 'hide');
	}
}

function areGoodStudentAndAwayAtSchoolDisplayble(strElm) {
	var lastIndex;	
	var elmDt;
	var elmDtVal;	
	var blnIsValid;
	var intAge;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#firstLicUsaDt_" + lastIndex);
	elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
	
	blnIsValid = validateDateEntry(elmDt);
	
	if ((elmDtVal != '') && (blnIsValid)) {
		//calcualte the age from date first licensed
		intAge = calculateAge(elmDtVal,null);		
		if ( (parseInt(intAge) <= 6) && (isRated(lastIndex)) ) {
			return true;
		} 
			return false;
	} 
		return false;
}

function showOrHideDrvrTrainingChkBoxes(strElm) {
	var lastIndex;
	
	lastIndex = getIndexOfElementId(strElm);
	
	if (isDriverTrainingDisplayble(strElm)) {
		// show checkbox
		showOrHideHtml("#drvrTrainingNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsDrvrTrainingRow', 'show');
		showOrHideHtml("#drvrTraining_" + lastIndex, 'show');
		if(isDriverTrainingDefault(strElm)){
			$("#drvrTraining_" + lastIndex).attr('checked', true);
		}
		disableDriverTraining(lastIndex);
	} else {
		showOrHideHtml("#drvrTrainingNA_" + lastIndex, 'show');
		if ($("#drvrTraining_" + lastIndex).is(":checked")) {
			$("#drvrTraining_" + lastIndex).attr('checked', false);
		}
		
		showOrHideHtml("#drvrTraining_" + lastIndex, 'hide');
	}	
	
	// finally check if entire row to be shown or not for other drivers also	
	showOrHideDrvrTrainingChkBoxesRow();
}

function showOrHideDrvrTrainingChkBoxesRow() {
	var blnShowRow = false;
	
	$('.clsDrvrTrainingChkBox').each(function() {	
		if (isDriverTrainingDisplayble(this)) {
			blnShowRow = true;
			return true;
		}
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsDrvrTrainingRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsDrvrTrainingRow', 'hide');
	}
}

function isDriverTrainingDisplayble(strElm) {
	
	/**
	 *	#52149 Change conditional display rule for risk state = MA
	 *	Need to collect date for all drivers < 25 years of age, regardless of Driver Status, and years of experience..	 
	**/
	var lastIndex = getIndexOfElementId(strElm);
	var elmDob = $("#birthDate_" + lastIndex).val();
	var elmDateFirstLic = $("#firstLicUsaDt_" + lastIndex).val();
	var currYear = parseInt(new Date().getFullYear());
	
	/*if (elmDob != '') {
		var currYear = parseInt(new Date().getFullYear());
		var dateDobYear = parseInt(elmDob.split("/")[2]);
		if (getPolicyState() == STATE_MA ) {
			var intAge25 = currYear - dateDobYear;
			return parseInt(intAge25) <=25;
		}
		//52386 - driver training not diplaying for Non-MA states
		//return false;
		var dateFirstLicYear = dateDobYear+16;
		return parseInt(currYear-dateFirstLicYear) <=3;
	} */
	
	//#54787..CC...For MA .Above block is commented and implemented below.
	//.If risk state= MA and Date first licensed <=3 years – OR – driver’s age is <25 regardless of the experience, show the Driver Training box to check off.
	if (getPolicyState() == STATE_MA ) {	
		//Date first licensed <=3 years
		if (elmDateFirstLic != '') {
			var dateFirstLicYear = parseInt(elmDateFirstLic.split("/")[2]);			
			var intYrsDiff = currYear - dateFirstLicYear;			
			if (parseInt(intYrsDiff) <=3) {
				return true;
			}
		}
		
		//driver’s age is <25 
		if (elmDob != '') {
			 var intAge = calculateAge(elmDob, null);
			if (parseInt(intAge) < 25) {
				return true;
			}
		}	
		
	}else {
		if (elmDob != '') {	
			var dateDobYear = parseInt(elmDob.split("/")[2]);
			var dateFirstLicYear = dateDobYear+16; //for NJ dateFirrst Lic is hidden and always dob + 16
			
			return parseInt(currYear-dateFirstLicYear) <=3;		
		}
	}
	
	return false;
	
/*	var lastIndex;
	// get date first license element
	var elmDt;
	var elmDtVal;		
	var blnIsValid;
	var intAge;
	var elmDob;
	var intAge25;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#firstLicUsaDt_" + lastIndex);
	elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
	elmDob = $("#birthDate_" + lastIndex).val();
	blnIsValid = validateDateEntry(elmDt);
	
	if ((elmDtVal != '') && (blnIsValid)) {
		//calcualte the age from date first licensed
		var currYear = parseInt(new Date().getFullYear());
		var dateLicYear = parseInt(elmDtVal.split("/")[2]);
		intAge = currYear - dateLicYear;
		
		//#43992
		if (parseInt(intAge) <= 3 && chkIfDrvrTrainingIsRequiredForADriver(strElm)) {	
			return true;
		} else if (getPolicyState() == STATE_MA ) {
				var dateDobYear = parseInt(elmDob.split("/")[2]);
				intAge25 = currYear - dateDobYear;
				if (parseInt(intAge) <= 3 && chkIfDrvrTrainingIsRequiredForADriver(strElm) && parseInt(intAge25) <=25) {	
					return true;
				} else {
					return false;
				}			
		} else {
			return false;
		}
	} else {
		return false;
	}*/	
	
}

function isDriverTrainingDefault(strElm) {
	
	//No need to default training checkbox based on below condition as per latest requirement
	//TD# 61865 - If risk state= MA and driver’s age is <25 regardless of the experience, show the Driver Training box checked.
/*	if (getPolicyState() == STATE_MA ) {
		var lastIndex = getIndexOfElementId(strElm);
		var elmDob = $("#birthDate_" + lastIndex).val();
		var drvTrainOverRideInd = $("#drvrTrainingOverrideInd_" + lastIndex).val();
			
		//driver’s age is <25 
		if (elmDob != '' && drvTrainOverRideInd != 'Yes') {
			 var intAge = calculateAge(elmDob, null);
			if (parseInt(intAge) < 25) {
				return true;
			}
		}	
		
	}*/
	
	return false;
	
}

function chkIfDrvrTrainingIsRequiredForADriver(elem){

	var drvrTrainingReq = true;
	
	var lastIndex = getIndexOfElementId(elem);
	var drvStatus = getDrvrStatus(lastIndex);
	var licStatus = getLicenseStatus(lastIndex);
	
	if(licStatus == NEVER_LICENSED){
		drvrTrainingReq = false;
	}
	
	if (drvStatus != INSURED_ON_THIS_POLICY && drvStatus != SUSPENDED_OPERATOR) {
		drvrTrainingReq = false;		
	}
	
	return drvrTrainingReq;
}

function showDriverStatusLiteral(strElm, isLicStatus) {
	var lastIndex = getIndexOfElementId(strElm);
	var strDriverStatus = strElm.value;
	if(isLicStatus){
		strDriverStatus = getDrvrStatus(lastIndex);
	}
	var literalValue = '';
	if (getPolicyState() == STATE_MA) {
		if (strDriverStatus == INSURED_ON_THIS_POLICY
				|| strDriverStatus == SUSPENDED_OPERATOR) {
			literalValue = 'Rated Driver';
		/*} else if (getLicenseState(lastIndex) == STATE_MA
				&& (strDriverStatus == INSURED_ON_ANOTHER_PRAC
						|| strDriverStatus == INSURED_ELSE_WHERE
						|| strDriverStatus == REVOKED_OPERATOR 
						|| strDriverStatus == NO_LONGER_LICENSED)) {
			literalValue = 'Deferred Driver';
		}*/
		//54910 - following condition requires for both MA and out of state drivers
		} else if (strDriverStatus == INSURED_ON_ANOTHER_PRAC
					|| strDriverStatus == INSURED_ELSE_WHERE
					|| strDriverStatus == REVOKED_OPERATOR 
					|| strDriverStatus == NO_LONGER_LICENSED) {
			literalValue = 'Deferred Driver';
		} else {
			literalValue = 'Not-Rated Driver';
		}
		$('#driverStatusLiteral_' + lastIndex).text(literalValue);
	}
}

function showOrHideDefensiveDriverChkBoxes(strElm) {
	var lastIndex;	
	lastIndex = getIndexOfElementId(strElm);
	
	if ((getPolicyState() == STATE_NJ) && (getDrvrStatus(lastIndex) == 'INS_POL')) {			
		//$("#defenseDrvrCourseNA_" + lastIndex).hide();
		showOrHideHtml("#defenseDrvrCourseNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsDefDrvrCourseRow', 'show');
		//$("#defenseDrvrCourse_" + lastIndex).show();
		showOrHideHtml("#defenseDrvrCourse_" + lastIndex, 'show');
		return;
	}
	//$("#defenseDrvrCourseNA_" + lastIndex).show();
	showOrHideHtml("#defenseDrvrCourseNA_" + lastIndex, 'show');
	if ($("#defenseDrvrCourse_" + lastIndex).is(":checked")) {
		$("#defenseDrvrCourse_" + lastIndex).attr('checked', false);
		//trigger change event for checkbox to show/hide dependant row
		$("#defenseDrvrCourse_" + lastIndex).trigger('change');
	}
	//$("#defenseDrvrCourse_" + lastIndex).hide();
	showOrHideHtml("#defenseDrvrCourse_" + lastIndex, 'hide');
	
	// show or hide the Defensive Driver chkboxes Row
	
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
		$('#defensiveDriverCourseDt_Error,#defensiveDriverCourseDt_Error_Header').show();
	}
	else {
		showOrHideDrvrTableRow('clsDefDrvrCourseRow', 'hide');
		showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'hide');
		$('#defensiveDriverCourseDt_Error,#defensiveDriverCourseDt_Error_Header').hide();
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
	
	// show or hide the Driver Improvement chkboxes Row
	
	var blnShowRow = false;
	
	$('.clsDrvrImprovCourseChkBox').each(function() {		
		
		lastIndex = getIndexOfElementId(this);
		elmDt = $("#birthDate_" + lastIndex);
		elmDtVal = $("#birthDate_" + lastIndex).val();
		blnIsValid = validateDateEntry(elmDt);
		relToInsCheckFlag = false;
		
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
		showOrHideDrvrTableRow('clsDrvImprvCourseDtRow', 'hide');
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').hide();
	}
}



/*3.2.14 Default 'Licensed out of State or Country' to 'Yes' if 'Date First Licensed' 
		and 'Date First MA Licensed' are not equal and the difference between the quote effective date and 
		'Date First MA Licensed' is less than 3 years.  Otherwise default to No.  
		If Date first MA licensed is null/blank, do not default this field to Yes.*/
function populateOOSLicenseValue(strElm){
	var lastIndex = getIndexOfElementId(strElm);
	var dateFirstMALicensed = $('#firstLicMADt_'+lastIndex).val();
	if(dateFirstMALicensed==null || dateFirstMALicensed==""){
		return;
	}
	var monthDiffWithPolEffDate = getMonthsDifference(dateFirstMALicensed,$('#policyEffDt').val());
	if($('#licOutOfStatePrior3YrsInd_'+lastIndex).val()!='Yes'
			&& dateFirstMALicensed!=strElm.value
			&& monthDiffWithPolEffDate<36
			){
		$('#licOutOfStatePrior3YrsInd_'+lastIndex).val('No').trigger('chosen:updated');
	}
}

function showOrHideDefDriverCourseDt(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	var orginalValue = $("#defensiveDriverCourseDt_" + lastIndex).data('orgValue');
	
	// hide for full quote and non NJ
	if (!isApplicationOrEndorsement() || (getPolicyState() != STATE_NJ)) {
		// hide DefDriverCourseDt row always
		showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'hide');
		return false;
	}
	
	if ($(strElm).is(":checked")){
		showOrHideHtml("#driverImprovCourseDt_" + lastIndex, 'show');
    }
	else {
		showClearInLineErrorMsgsWithMap('driverImprovCourseDt_'+lastIndex, '', $('#defaultMulti').outerHTML(), 
				getColumnIndexNoHeader($(strElm).parent()), errorMessages, addDeleteCallback);
		$("#driverImprovCourseDt_" + lastIndex).val("");
		showOrHideHtml("#driverImprovCourseDt_" + lastIndex, 'hide');
		//clearColumnInLineError("#driverImprovCourseDt_" + lastIndex);
	}
	
	if ($(strElm).is(":checked")){
		if(isEndorsement() && (orginalValue != 'INS_POL')){
			$("#defensiveDriverCourseDt_" + lastIndex).val('');
		}
		//showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'show');
		showOrHideHtml("#defensiveDriverCourseDt_" + lastIndex, 'show');
    }
	else {

		showClearInLineErrorMsgsWithMap('defensiveDriverCourseDt_'+lastIndex, '', $('#defaultMulti').outerHTML(), 
				getColumnIndexNoHeader($(strElm).parent()), errorMessages, addDeleteCallback);
		$("#defensiveDriverCourseDt_" + lastIndex).val("");
		showOrHideHtml("#defensiveDriverCourseDt_" + lastIndex, 'hide');
	}
	
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('clsDefDrvCourseDtRow', 'clsDefDriverCourseChkBox');

	if ($(".clsDefDrvCourseDtRow:visible").length){
		$('#defensiveDriverCourseDt_Error,#defensiveDriverCourseDt_Error_Header').show();
	}else{
		$('#defensiveDriverCourseDt_Error,#defensiveDriverCourseDt_Error_Header').hide();
	}	
}

//PA_AUTO
function showOrHideDriverImprovCourseDt(strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	var orginalValue = $("#driverImprovCourseDt_" + lastIndex).data('orgValue');
	
	// hide for full quote and non PA
	if (!isApplicationOrEndorsement() || (getPolicyState() != STATE_PA)) {
		// hide DefDriverCourseDt row always
		showOrHideDrvrTableRow('clsDrvImprvCourseDtRow', 'hide');
		return false;
	}
	if ($(strElm).is(":checked")){
		showOrHideHtml("#driverImprovCourseDt_" + lastIndex, 'show');
    }
	else {
		showClearInLineErrorMsgsWithMap('driverImprovCourseDt_'+lastIndex, '', $('#defaultMulti').outerHTML(), 
				getColumnIndexNoHeader($(strElm).parent()), errorMessages, addDeleteCallback);
		$("#driverImprovCourseDt_" + lastIndex).val("");
		showOrHideHtml("#driverImprovCourseDt_" + lastIndex, 'hide');
		//clearColumnInLineError("#driverImprovCourseDt_" + lastIndex);
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('clsDrvImprvCourseDtRow', 'clsDrvrImprovCourseChkBox');
	
	if ($(".clsDrvImprvCourseDtRow:visible").length){
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').show();
	}else{
		$('#driverImprovCourseDt_Error,#driverImprovCourseDt_Error_Header').hide();
	}	
	
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
		showOrHideDrvrTableRow('clsAccPrvCourseRow', 'show');
	}
	else {
		showOrHideDrvrTableRow('clsAccPrvCourseRow', 'hide');
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'hide');
	}
}


function showOrHideAccPrevCourseDt(strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	
	if (!isApplicationOrEndorsement()) {
		// hide clsAccPrvCourseDtRow  always
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'hide');
		return false;
	}

	if ($(strElm).is(":checked")) {
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'show');
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'show');
    }
	else {
		$("#accidentPrvntCourseDt_" + lastIndex).val("");		
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'hide');
		clearColumnInLineError("#accidentPrvntCourseDt_" + lastIndex);
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('clsAccPrvCourseDtRow', 'clsAccPrevCourseChkBox');	
}

function showOrHideSr22FilingChkBoxes(strElm) {
 	var lastIndex; 	
 	var strDrvrStatus;
 	
 	lastIndex = getIndexOfElementId(strElm);
 	strDrvrStatus = getDrvrStatus(lastIndex);
 		
	if (strDrvrStatus == INSURED_ON_THIS_POLICY || strDrvrStatus == SUSPENDED_OPERATOR || strDrvrStatus == AWAY_IN_ACTV_SERVC) {			
		//showOrHideHtml("#sr22FilingNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsSr22FilingRow', 'show');
		showOrHideHtml("#sr22Filing_" + lastIndex, 'show');
	}
	else {			
		//showOrHideHtml("#sr22FilingNA_" + lastIndex, 'show');
		if ($("#sr22Filing_" + lastIndex).is(":checked")) {
			if (isEndorsement()) { // in endorsment it may be disabled. so enable it before unchecked.
				$("#sr22Filing_" + lastIndex).prop('disabled', false);
			}
			//$("#sr22Filing_" + lastIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#sr22Filing_" + lastIndex).trigger('change');
		}
		showOrHideHtml("#sr22Filing_" + lastIndex, 'show');
	}
 	
 	// show or hide the Sr22Filing row
 	//showOrHideFieldRow('clsSr22FilingRow', 'clsSr22FilingChkBox');
	var blnShowRow = false;
	
	$('.clsSr22FilingChkBox').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strDrvrStatus = getDrvrStatus(lastIndex);
		 
		 if (strDrvrStatus == INSURED_ON_THIS_POLICY || strDrvrStatus == SUSPENDED_OPERATOR || strDrvrStatus == AWAY_IN_ACTV_SERVC) {
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsSr22FilingRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsSr22FilingRow', 'hide');
		showOrHideDrvrTableRow('clsSr22RequestingStateRow', 'hide');
	}
}


function showOrHideYubiChkBoxes(strElm) {
	
	if ($('#yubiEnabled').val() == 'true') {
		if ((getPolicyState() == STATE_NJ || getPolicyState() == STATE_PA)) {
			var lastIndex;	
			lastIndex = getIndexOfElementId(strElm);
			
			if (getDrvrStatus(lastIndex) == 'INS_POL') {			
				//showOrHideDrvrTableRow('cellphoneNumber_Row', 'show');
				showOrHideHtml("#yubiDriverNA_" + lastIndex, 'hide');
				showOrHideDrvrTableRow('clsYubiRow', 'show');			
				showOrHideHtml("#yubiDriver_" + lastIndex, 'show');
				return;
			}
		
			if ($("#yubiDriver_" + lastIndex).is(":checked")) {
				$("#yubiDriver_" + lastIndex).attr('checked', false);
				$("#yubiDriver_" + lastIndex).trigger('change');
			}
		
			showOrHideHtml("#yubiDriver_" + lastIndex, 'hide');
			var blnShowRow = false;
			
			$('.clsYubiDriverChkBox').each(function() {		
				lastIndex = getIndexOfElementId(this);				 
		
				if (getDrvrStatus(lastIndex) == 'INS_POL') {
					blnShowRow = true;
					return true;
				}
				
			});
			
			if (blnShowRow) {
				//showOrHideDrvrTableRow('cellphoneNumber_Row', 'show');
				showOrHideDrvrTableRow('clsYubiRow', 'show');
			}
			else {
				//showOrHideDrvrTableRow('cellphoneNumber_Row', 'hide');
				showOrHideDrvrTableRow('clsYubiRow', 'hide');
			}
		}
	}
}

function showOrHideSr22RequestingState(strElm) {
	// As per new change hide always
	showOrHideDrvrTableRow('clsSr22RequestingStateRow', 'hide');
	return false;
	
	var lastIndex = getIndexOfElementId(strElm);
	
	if (!isApplicationOrEndorsement()) {
		//$('.' + 'clsSr22RequestingStateRow').hide();
		showOrHideDrvrTableRow('clsSr22RequestingStateRow', 'hide');
		return false;
	}

	if ($(strElm).is(":checked")) {		
		showOrHideDrvrTableRow('clsSr22RequestingStateRow', 'show');
		showOrHideHtml("#sr22State_" + lastIndex, 'show');
	}
	else {
		$("#sr22State_" + lastIndex).val("");
		triggerChangeEvent($("#sr22State_" + lastIndex));
		showOrHideHtml("#sr22State_" + lastIndex, 'hide');
	}

	// show or hide the dependant row
	showOrHideDependentFieldRow('clsSr22RequestingStateRow', 'clsSr22FilingChkBox');	
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
		showOrHideDrvrTableRow(rowClass, 'show');
	}
	else {
		showOrHideDrvrTableRow(rowClass, 'hide');
	}	
}

function getLicenseStatus (index) {
	return $("#licenseStatus_" + index).val();
}

function getDrvrStatus(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	return strDrvrSatus;	
}

function isRated(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	return isRatedImpl(strDrvrSatus);
}

//moved isRatedImpl() to common.js

function isDeferred1(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	return isDeferred1Impl(strDrvrSatus);
}

function isDeferred2(index) {
	
	var strDrvrSatus = $("#driverStatus_" + index).val();
	return isDeferred2Impl(strDrvrSatus);	
}


function getLicenseState(index) {
	var strLicState = $("#licenseState_" + index).val();
	return strLicState;
	
}

function getLicOutOfState(index) {
	var strLicOutOfSate = $("#licOutOfStatePrior3YrsInd_" + index).val();
	return strLicOutOfSate;
	
}

function getPolicyState() { 
	var strPolicyState = $("#stateCd").val();
	return strPolicyState;
	
}


function setAndDisableRelationshipToPNI() {
	var lastIndex;
	
    $('select.clsRelationshipToIns').each(function() {		
		lastIndex = getIndexOfElementId($(this));
		
		if ($('#participantRole_' + lastIndex).val() == 'PRIMARY_INSURED') {
			$(this).val("I");
             //if ( !isEndorsement() ) { // commented as per defects 45339, 30266
                $(this).prop('disabled', true);
             //}

			triggerChangeEvent($(this));			
		}
		else {
            // just remove "I" from drodown options.
            if ( isEndorsement() ) { 
        		// remove from the options if value is not saved as 'I'.
        		// for existing driver in p* the value may come as 'I'
        		if ( $(this).val() != "I" ) {
                	$("#" + $(this).attr("id") + " option[value='I']").remove();
                	triggerChangeEvent($(this));
        		}
            } else {
            	$("#" + $(this).attr("id") + " option[value='I']").remove();
                triggerChangeEvent($(this));
            }
        }


	});
}

function addOrDeletePNIOptions() {
	addOrDeleteSpouseDomesticPartnerOptions();
}

function addOrDeleteSpouseDomesticPartnerOptions() {
	var selectedElmId = '';
	var blnOptionSelected = false;
	
	$('select.clsRelationshipToIns').each(function() {		
		if ($(this).val() == 'S' || $(this).val() == 'D') {
			blnOptionSelected = true;
			selectedElmId = $(this).attr("id");
			return true;
		}
	});
	
	if (blnOptionSelected) {
		removeOptionForOtherDrivers('S',  selectedElmId);
		removeOptionForOtherDrivers('D',  selectedElmId);
	} else {
		addOptionForAllDrivers('S', "Spouse");
		if(!isDomesticPartnerExpired()) {
			addOptionForAllDrivers('D', "Domestic Partner");
		}
	}
}

//NH Renewal Conversion changes
function isDomesticPartnerExpired() {
	
	if(getPolicyState() != 'NH') {
		return false;
	}
	
	if ( $("#policyEffDt").val() != "" && $("#nh_renewal_conversion_eff_date").val() != "" ) {
		var policyEffDt = Date.parse($("#policyEffDt").val());
		var nhRenewalConversionEffDate = Date.parse($("#nh_renewal_conversion_eff_date").val());
		return (policyEffDt >= nhRenewalConversionEffDate);
	}
	
	return false;
}

function removeOptionForOtherDrivers (optionVal, selectedId) {
	$('select.clsRelationshipToIns').each(function() {
		
		if ($(this).attr("id") != selectedId) {
			$("#" + $(this).attr("id") + " option[value='" + optionVal + "']").remove();
			triggerChangeEvent($(this));
		}		
	});
}

function addOptionForAllDrivers (optionVal, optionDesc) {
	$('select.clsRelationshipToIns').each(function() {		
		// add if option doesn't exist
		if ($("#" + $(this).attr("id") + " option[value='" + optionVal + "']").length <= 0)	 {				
			$("#" + $(this).attr("id") + ' option:first').after($('<option />', { "value": optionVal, text: optionDesc}));
			triggerChangeEvent($(this));
		}
		
	});
}

function fixSelectors(valToFix){
	return valToFix.replace(/[!"#$%&'()*+,.\/:; <=>?@[\\\]^`{|}~]/g, "_");
}

function editListAreas(strElm) {
	
	var index = getIndexOfElementId(strElm);
	
	$("#listAreasDriverIndex").val(index);
	$('#listAreasDriverHeader').html(getDriverHeader(index));
	
	$(".listAreaCheckbox").each(function() {		
		var selectedItem = $("#listArea_" + index + "_" + fixSelectors(this.id));		
		$(this).prop('checked', selectedItem.length > 0 && selectedItem.val() != '');
	});
	
	// hide first checkbox and message display if Risk state <> DL state
	if (getPolicyState() != getLicenseState(index)) {		
		$('.listAreaCheckbox').eq(0).prop('checked', false);
		$('.listAreaCheckbox').eq(0).parent().hide();
		$('#listAreasCheckMsg').hide();
	}
	else {
		$('.listAreaCheckbox').eq(0).parent().show();
		$('#listAreasCheckMsg').show();
	}
	
	$("#listAreasDlg").modal('show');
}

function validateListAreasSelection(strElm) {
	if ($('.listAreaCheckbox:checked').length > 2) {
		$(strElm).prop('checked', false);
		//alert("Check no more than 2.");
		return false;
	}
	return true;
}

function clearPriorDLStatuses(index) {
	//$("#priorDL1Status_" + index).val("");
	$("#priorDL2Status_" + index).val("");
	$("#priorDL3Status_" + index).val("");
}

function saveListAreas() {
		
	var index =  $("#listAreasDriverIndex").val();
	
	//clear hidden vars first. Below clears dependant priorDLstatuses also.(#48665)
	deleteListAreas(index);	
	
	var hiddenElementsToAdd = '';	
	var selectedCount = 0;
	var selectedItems = '';
	
	$(".listAreaCheckbox").each(function() {
		var itemChecked = $(this).prop('checked');
		if (itemChecked) {
			var element = '<input id="listArea_' + index + '_' +   fixSelectors(this.id)  + '"'
		     	+ ' name="drivers[' + index + '].listAreaCodes[' + selectedCount + ']"'
		     	+ ' class="clslistAreaCode" '
		     	+ ' type="hidden" value="' + getCorrectListAreaCode(this.id) + '"/>';
			
			hiddenElementsToAdd += element;
			selectedCount++;
			
			if (selectedItems == '') {
				selectedItems = getCorrectListAreaCode(this.id);				
			} else {
				selectedItems = selectedItems + ',' + getCorrectListAreaCode(this.id);
			}
			var valueForDLStatus = getCorrectListAreaCode(this.id);
			if(valueForDLStatus == "50 US/DC"){
				//#48665...don't populate from AI
				//$("#priorDL1Status_" + index).val("UNV_US");
			}else if(valueForDLStatus == "Canada/US Territory"){
				$("#priorDL2Status_" + index).val("UNV_CAN");
			}else if(valueForDLStatus == "Other Foreign"){
				$("#priorDL3Status_" + index).val("UNV_FOR");
			}
			
		}
	});
	
	var hiddenSelectedItemsElement = '<input id="listAreasSelectedValues_' + index + '"'
	+ ' class="clslistAreaCodes clsMvrDataFldHidden clsMvrDataFld" '
 	+ ' type="hidden" value="' + selectedItems + '"/>';
	
	if (hiddenElementsToAdd.length > 0) {
		hiddenElementsToAdd = hiddenElementsToAdd + hiddenSelectedItemsElement;
		$("#listAreas_" + index  + " .listAreasHiddenVariables").html(hiddenElementsToAdd);
	} else {
		$("#listAreas_" + index  + " .listAreasHiddenVariables").html(hiddenSelectedItemsElement);
	}
	
	
	/*alert(index
			+":Selected=>"+
			$('#listAreasSelectedValues_' + index).val()
			+":Original=>"+
			$('#listAreasOriginalSelectedValues_' + index).val());*/
	
	if ( $('#listAreasSelectedValues_' + index).val() != $('#listAreasOriginalSelectedValues_' + index).val() ) {
		// reset pemium if original selections are modified
		if ( $("#premAmt").val() != "" && $("#premAmt").val() != "0" ) {
			resetPremiumForAll();
		}
		
		/* FIX for 56313 : MA - On Driver screen - change of  List areas where a license was held: (Check at most 2) is not triggering Reorder */
		$('#isDriverInformationUpdated').val('true');
	}

	
	var origVal = $("#listAreasSelectedCountDesc_" + index).prop('defaultValue');
	if(origVal == null || origVal == 'undefined'){
		origVal = $("#listAreasSelectedCountDesc_" + index).val();
	}
	
	$("#listAreas_" +  index + " .listAreasSelectedDetails .listAreasSelectedCountDesc").text(selectedCount  + " selected");
	$("#listAreasSelectedCountDesc_" + index).val(selectedCount  + " selected");
	$("#listAreasSelectedCountDesc_" + index).prop('defaultValue', origVal);
	
	validateListAreasSelectionSave();
	
	//close
	cancelListAreas();
	
}

function getCorrectListAreaCode(strCode) {
	switch (strCode) {
		case "50_US_DC":	
			return "50 US/DC";	    	
			break;
		case "Canada_US_Territory":
			return "Canada/US Territory";	    	
			break;
		case "Other_Foreign":
			return "Other Foreign";	    	
			break;
		default:
			return strCode;	
	}
}

function validateListAreasSelectionSave() {
	var index = $("#listAreasDriverIndex").val();
	
	// clear prior error in the error column and show errors based on fresh save	
	var strElementID = '#listAreas_' + index;
	clearColumnInLineError(strElementID);
	
	var strErrTag = 'listAreas.browser.inLine';	
	validateInputElementWithMap($(strElementID), 'Yes', strErrTag, $('#defaultMulti').outerHTML(),
			getColumnIndexNoHeader($(strElementID).parent().parent()), errorMessages, null, addDeleteCallback);
	
	alignRows();
}


function deleteListAreas(lastIndex) {
	//$("#listAreas_" +  lastIndex + " .listAreasSelectedDetails .listAreasSelectedCountDesc").text("0 selected");
     $("div[id='listAreas_"+lastIndex+"']").find('span.listAreasSelectedCountDesc').html('0 selected');
	// remove the hidden vars
	$("#listAreas_" + lastIndex  + " .listAreasHiddenVariables").empty();
	
	//clear dependant PriorDLstatuses also.	
	clearPriorDLStatuses(lastIndex);
}

function cancelListAreas() {
	
	$("#listAreasDriverIndex").val('');
	$("#listAreasDlg").modal('hide');	
}

function getDriverHeader(index) {
	
	var strDrvrSeqNum = $("#DriverColumnHeaderSeqNum_" + index).text();
	var strDrvrName = $("#DriverColumnHeaderDriverFullName_" + index).text();
	var strDriverHeaderInfo = '<b> ' + strDrvrSeqNum + strDrvrName + '</b>';
	return strDriverHeaderInfo;
}

function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var n = strId.lastIndexOf('_');
    var lastIndx = strId.substring(n + 1);
   
    return lastIndx;
}

function enableFields() {
	// enable relationshipToIns
	$('#relationshipToIns_' + 0).attr({"disabled": false});
	
	// enable license out of state or country and sr22 filing
	$('select.clsLicOutOfStateOrCountrySelect, .clsSr22FilingChkBox').each(function() {	
		if (isEndorsement()) {
			 $(this).prop('disabled', false);
		}			
	});	
	
	$('select.clsLicenseState').each(function() {
			 $(this).prop('disabled', false);
	});
	
	$('.clsLicenseNumber, .clsSDIP, .clsDateFirstMALicense, .clsFirstLookupDate, .clsLicenseStatus,.clsGender,.clsDateFirstLicense,.clsmMaskedDOB,.clsBirthDate').each(function() {
		 $(this).prop('disabled', false);
	});
	
	$('input:disabled,select:disabled').prop('disabled', false);
}

function setDriversSeqNums() {
	var seqNum = 1;
	$('.clsDriverSeqNum').each(function() {
		$(this).val(seqNum++);
	});
}

function setLicCountryCode() {	
	$('.clsLicCountryCd').each(function() {
		$(this).val(getLicCountryCdByLicState(this));
	});
}

function getLicCountryCdByLicState(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	var licState =  $("#licenseState_" + lastIndex).val();
	
	switch (licState) {
		case LicStatesEnum.NOT_LICENSED: case EMPTY:	
			return EMPTY;	    	
			break;
		case LicStatesEnum.CAN_US_TERR:
			return LicCountryEnum.CANADA;	    	
			break;
		case LicStatesEnum.OTH_FOREIGN_LIC:
			return LicCountryEnum.FOREIGN;	    	
			break;
		default:
			return LicCountryEnum.USA;	
	}
}

function alignRows() {	
	alignRowsById('rowHeaderTable', 'mainContentTable');
}

//moved to common.js
/*function trimSpaces(strVal) {return jQuery.trim(strVal);}*/

function showOrHideDrvrTableRow(rowClass, strVal) {
	if (strVal == 'show') {
		$('.' + rowClass).show();		
	}
	else {
		$('.' + rowClass).hide();		
	}
}

function showOrHideHtml(strElm, strVal) {
	if (strVal == 'show') {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).removeClass("hidden").trigger('chosen:styleUpdated');
			//triggerChangeEvent($(strElm));
					
		} else {
			$(strElm).css('display', 'block');
		}
	} else {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).addClass("hidden").trigger('chosen:styleUpdated');
			//triggerChangeEvent($(strElm));
			
		} else {
			$(strElm).css('display', 'none');
		}
	}
}

function triggerChangeEvent(strElm) {
	//strElm.trigger("changeSelectBoxIt");
	strElm.trigger("chosen:updated");
}

function handleSubmit(e) {	
	enableFields();		
	//set seq nums for NB only
	if (!isEndorsement()) {
		setDriversSeqNums();	
	}
	setLicCountryCode();
	clearOptionalValues();		
	//commented as handled in common.js file
	//setMvrDataUpdatedIndicator('drivers');	

	//final check for valid date format's
	// clean fields that do not have valid formats
	//47470 - Enter the incorrect date format for defensive driver course date and immediately click on RATE, I receive a Status 500 error
	//PA_AUTO - added input.clsDrvrImprovCoursDt
	$('input.clsBirthDate,input.clsDateFirstLicense,input.clsDefnsDrvngCoursDt,input.clsDrvrImprovCoursDt,input.clsDateFirstMALicense,input.clsMotorcycleFirstLicDt').each(function() {		
		checkInvalidDateFormats('#' + this.id);
	});
	
	/*$('input.clsDateFirstLicense').each(function() {		
		checkInvalidDateFormats('#' + this.id);
	});*/
	
	// loop thru all masked license number data and find out for '*'
	// put back the original prefill lic number 
	// for existing prefill driver it may contain value. 
	// For newly added driver  with clsmMasked class its empty always.
	$('input.clsmMaskedLicNum').each(function() {		
		var strLicNum = $('#licenseNumber_' + getIndexOfElementId(this)).val();
		var strOrigLicNum = $('#OrigPrefillLicenseNumber_' + getIndexOfElementId(this)).val();		
			
		// if asterisk found then treat as invalid data
		if (strLicNum.indexOf('*') != -1) {
			// put back original prefill lic number 
			if (! $(this).hasClass("addNewColumn") ) {
				$('#licenseNumber_' + getIndexOfElementId(this)).val(strOrigLicNum);
			}
		}
		
	});
	
	// Clear the invalid birth date
	clearInvalidDriverTabBirthDate();
	
	//set date first lic usa date if it is empty for MA policy no MA state drivers.
	setDateFirstLicdDatesIfEmptyForMAPolicy();
	
	//#48665..for NJ/MA set current Lic status code based on state selection
	setCurrLicenseStatusCodes();
	
	//finally set prefilldata updated indicator
	setPrefillDataUpdatedIndicator('drivers');	
	
	if ($('#yubiEnabled').val() == 'true') {
	$('.clsYubiDriverChkBox').each(function(driverIndex) {
		if ($("#yubiDriver_" + driverIndex).prop('checked') == false) {
			$('#cellphoneNumber_' + driverIndex).val('');
		}
	});
	}
}

function setCurrLicenseStatusCodes() {
	$('select.clsLicenseState').each(function() {	
		var driverIndex = getIndexOfElementId(this);
		var strCurrLicStatusCd = getCurrnetLicStatusCode(driverIndex);
		$("#currLicenseStatusCd_" + driverIndex).val(strCurrLicStatusCd);
	});
}

function getCurrnetLicStatusCode(driverIndex) {
	var strState = getLicenseState(driverIndex);
	var currLicStatusCd = '';
	
	if (strState == STATE_CANADA) {
		currLicStatusCd = 'UNV_CAN';
	} else if(strState == STATE_OTHER_FOREIGN){
		currLicStatusCd = 'UNV_FOR';
	} else {
		//56193 - return the existing value, if not will be set to blank
		currLicStatusCd = $("#currLicenseStatusCd_" + driverIndex).val();
	}
	
	return currLicStatusCd;
}

function setTabIndex(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);

	for (var i = startColumn; i <= endColumn; i++) {
		 // Set tab index for delete icons
		 $('#delete_drivers_'+(i-1)).attr('tabindex', tabIndex++);
		
		 var selector =  $('#mainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		 var tabOrderElements = $('.tabOrder' , selector);
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])') && (!$(this).attr('disabled'))){
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
				 //chosenContainer.find('input').attr('tabindex',tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);		
			 }
			
		  });
	}
	$('.clsDriverIndex').attr("tabindex", tabIndex++);
}

function preventDefaultAction(e) {
	if(e.preventDefault){     				   
    	e.preventDefault();    			    	
    }
    else{
    	//for ie
    	 e.returnValue = false;
    } 	
}

function setLicenseState(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	if ( $(strElm).val() == NEVER_LICENSED ) {
		var licState = '#licenseState_' + lastIndex;
		$(licState).val(NOT_LICENSED);
		triggerChangeSelectBoxItIfSelect($(licState));
		clearLicenseNumber(licState);
	}
}

function clearLicenseNumber(strElm) {
	var lastIndex = getIndexOfElementId(strElm);	
	var hide = ($(strElm).val() == NOT_LICENSED);
	clearLicenseNumberImpl(lastIndex,hide);	
}

function clearLicenseNumberImpl(index, hide){
	var licNum = '#licenseNumber_' + index;
	var maskLicNum = '#maskLicNum_' + index;
	if(true == hide){
		$(licNum).val("");
		$(maskLicNum).val("");
		// clear any error
		clearColumnInLineError(licNum);
		clearColumnInLineError(maskLicNum);	
		disableDataField(licNum);
		disableDataField(maskLicNum);
		//make sure to clear prerequired also.Defect # 71475
		$(licNum).removeClass('preRequired');
		$(maskLicNum).removeClass('preRequired');
		
	}else{
		enableDataField(licNum);
		enableDataField(maskLicNum);
	}
}

function enableDataField (strElm) {
	$(strElm).prop('disabled', false);
	triggerChangeSelectBoxItIfSelect($(strElm));	
}

function disableDataField (strElm) {
	if(!isBlank($(strElm).val())){
		$(strElm).prop('disabled', true);
	}		
	triggerChangeSelectBoxItIfSelect($(strElm));	
}

function isBlank(value){
	return (value==null || value=="");
}

function triggerChangeSelectBoxItIfSelect(strElm) {
	if (strElm.is('select:not(select[multiple])')) {
		//strElm.trigger("changeSelectBoxIt");
		strElm.trigger("chosen:updated");
	}
}

function disableForExistingDriver(strElm) {
	//disable if only p* existing driver 
	var lastIndex = getIndexOfElementId(strElm);
	if ( !isEndorsementAddedDriver(lastIndex) ) {
		disableDataField(strElm);		
	}
}

function disableForExistingDriverForSR22(strElm) {
	//disable if only p* existing driver if already has value from p*
	var lastIndex = getIndexOfElementId(strElm);
	if ( !isEndorsementAddedDriver(lastIndex) && $("#existingPolstarSr22FilingInd_" + lastIndex).val() == 'Yes') {
		disableDataField(strElm);		
	}
}

function isEndorsementAddedDriver(lastIndex) {
	return $("#endorsementDriverAddedInd_" + lastIndex).val() == 'Yes'  ? true : false;
}

function isElementExisting(strElm) {
	return ($(strElm).length > 0) ? true : null;
}

//Added 02/05/2015 In Endorsements, License Number field is protected on existing drivers on the policy.  
//For newly added drivers, follow same rules as NBs.  
function disableLicenseNumberForENDR(){
	$('.clsEndorsementDriverAddedInd[value=""]').each(function(){
		var lastIndex = getIndexOfElementId(this);
		//54226.. Protect Lic num if driver Lic state=MA and policy state=MA
		//54591...only for existing MA drivers(if they are not changed from defered2 to other)
		if (getPolicyState() == STATE_MA && getLicenseState(lastIndex) == STATE_MA
		&& $("#existingMALicStateDriverInd_" + lastIndex).val() == 'Yes' && $("#existingDrvrChangedFromDefer2ToOtherInd_" + lastIndex).val() != 'Yes') {
			$('#licenseNumber_'+lastIndex).prop('disabled','disabled');
			$('#maskLicNum_'+lastIndex).prop('disabled','disabled');
		}
	});
}

function chkIfLicNumIsRequired(){
	$('input.clsLicenseNumber, input.clsmMaskedLicNum').each(function(){
		chkIfLicNumIsRequiredForADriver(this);
 	});
}

function chkIfLicNumIsRequiredForADriver(elem, addDriver){

	var lastIndex = getIndexOfElementId(elem);
	var licNum = $('#licenseNumber_' + lastIndex);
	var maskLicNum =  $('#maskLicNum_' + lastIndex);
	var licState = $('#licenseState_' + lastIndex).val();
	var policyState = $('#stateCd').val();
	
	if(getLicenseStatus(lastIndex) == NEVER_LICENSED){
		clearLicenseNumberImpl(lastIndex,true);
	}else{
		clearLicenseNumberImpl(lastIndex,false);
		var required = false;
		
		// Is this MA
		if( (licState == STATE_MA) &&
			(policyState == STATE_MA)){
			
			// Set required for the folowing
			if(isQuote() || isEndorsement()){
				if(!isDeferred2(lastIndex)){
					required = true;
				}
			}
		}else if(licState != STATE_MA && licState != 'NLL'){
			if(isApplicationOrEndorsement()){
				// In endorsment required only in Endorse mode.
				if ( isEndorsement() ) {
					if(!isQuote()) {
						if( isRated(lastIndex)){
							required = true;
						}
					}
				} else {
					if( isRated(lastIndex)){
						required = true;
					}
				}
			}
		}
		
		if(required == true) {
			// If we have lic num field, then mark that as required
			if( ($(licNum).length > 0) &&
				($(licNum).attr('type') != 'hidden')){
				if(!($(licNum).hasClass('required'))){
					$(licNum).addClass('required');
				}
			}// else masked lic num field is the one visible, lic num is hidden, then mark that as required
			else if($(maskLicNum).length > 0){ 
				if(!($(maskLicNum).hasClass('required'))){
					$(maskLicNum).addClass('required');
				}
			}
			if ($("#landingBubbleEndorsementUserAction").val() == EndorsementUserAction.AddDriver || addDriver == YES) {
				invokeValidateLicNumber(licNum,NO);	
			} else {
				invokeValidateLicNumber(licNum,YES);
			}
			
			if (pageLoading) { //if no inlineError
				if ( !($(licNum).hasClass("inlineError")) ) {
					invokeValidateUniqueLicNumber(licNum, NO);
				}
			}
		}else {
			// Usual clear the inline errors as required is gone now
			if($(licNum).hasClass('required')){
				$(licNum).removeClass('required').removeClass('preRequired');
			}
			clearColumnInLineError('#licenseNumber_' + lastIndex);
			
			if($(maskLicNum).hasClass('required')){
				$(maskLicNum).removeClass('required').removeClass('preRequired');
			}
			clearColumnInLineError('#maskLicNum_' + lastIndex);	
			
			invokeValidateLicNumber(licNum,NO);
			
			//if above doesn't have any errors then validate unique lic nums & NLL State
			if ( !($(licNum).hasClass("inlineError")) ) {
				invokeValidateUniqueLicNumber(licNum, NO);
				
				if (pageLoading) { //if no errors
					if ( !($(licNum).hasClass("inlineError")) ) {
						invokeValidateLicNumForNLL(licNum, NO);
					}
				}
			}
		}
	}
}

function invokeValidateLicNumForNLL(elem,strLicReq){
	var strErrTag = 'licenseNumber.browser.inLine';			
	return validateInputElementWithMap(	elem, strLicReq, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(elem).parent()), errorMessages, 
										validateLicNumForNLL, addDeleteCallback);
}

var validateLicNumForNLL = function (strElm) {
	var currDrvrLastIndex = getIndexOfElementId(strElm); 
	//actual lic num field
	var currDrvrLicNum = $('#licenseNumber_' + currDrvrLastIndex).val();
	var currDrvrLicstate = trimSpaces(getLicenseState(currDrvrLastIndex));
	var strMsg = EMPTY;
	if (currDrvrLicstate == 'NLL' && currDrvrLicNum != '') {
		strMsg = 'notValidLicNumberForNLL';
	}
	return strMsg;
};

function existsAndVisible(elemName){
	var existsNVisible = false;
	if(	($(elemName).length > 0) &&
		($(elemName).attr('type') != 'hidden')){
		existsNVisible = true;
	}
	return existsNVisible;
}

function deleteUnwantedInlineErrors(){
	// When we have the inline error for this field as what is said, it means we intend to delete it 
	// as the rror is not needed	
	$('tr#licenseState_Error td').each(function() {
		
		// This is to find what to hide, if you delete, 
		// the red rim etc won't egt taken care of on no error, 
		// as they tag on the elem being present
		if($(this).text() == "To be found and deleted from client js"){
			$(this).text('');
			$(this).parent().attr('class','display:none');
			$(this).attr('class','display:none');
		}		
	});
	var count = 0;
	$('tr#licenseState_Error').each(function() {
		if($(this).parent().attr('class') != 'display:none'){
			count++;
		}		
	});
	if(count == 0){
		$('tr#licenseState_Error_Header').attr('class','display:none');
	}
}

function processMaskedElementData(strElm, e, strType, strSource) {
	// common function for driver & pplication pages
	var maskFldVal = $.trim($(strElm).val());
	
	if (strType=="2")  { //Dob
		//Note: This masking should function like current legacy production for 2.0 release
		if (maskFldVal.length==10) {
			// populate hidden var and mask it again if not masked 
			// as hidden var contains a value for already masked 
			if (maskFldVal.substr(0,6) != "**/**/") {
				// first store 'Date of Birth' value into hidden
				$("#birthDate_" + getIndexOfElementId(strElm)).val(maskFldVal); 
				
				// Then mask it for existing/saved driver. Not for newly adding driver column...
				if (! $(strElm).hasClass("addNewColumn") ) {
					//#54909.. Even for MA exisitng driver it should be masked if Rmv lookup is successful.
					if(getPolicyState() == 'MA') { 
						// mask only for rmv lookedup driver
						if ($('#rmvLookupInd_' + getIndexOfElementId(strElm)).val() == 'Yes') {
							var strMask = '**/**/' + maskFldVal.substr(maskFldVal.length-4, 4);
							$(strElm).val(strMask);
						}						
					} else {
						var strMask = '**/**/' + maskFldVal.substr(maskFldVal.length-4, 4);
						$(strElm).val(strMask);
					}
				}
			}
		} else {
			// populate actual hidden var with entered/changed value for validation
			$("#birthDate_" + getIndexOfElementId(strElm)).val(maskFldVal); 
		}
	} else if (strType=="4")  { //Lic number
		
		// check if masked license number is modified or not.
		// if modified then..start processing...
		var actualLicNum = $("#licenseNumber_" + getIndexOfElementId(strElm)).val();
		var actualLicNumWithMask = actualLicNum.substr(0, maskFldVal.length-4) + "****";
		var lastIndex = getIndexOfElementId(strElm);
			
		if (maskFldVal.length > 3) {
			// For  existing prefill driver.  Not for newly adding driver column...
			if (! $(strElm).hasClass("addNewColumn") ) { 
				if ( maskFldVal == actualLicNumWithMask) {
					// don't update actual hidden variable as not modified  
				} else { // modified				
					// first store license number value into hidden
					$("#licenseNumber_" + lastIndex).val(maskFldVal);
					
					// then mask the license number
					//$(strElm).val(maskFldVal.substr(0, maskFldVal.length-4) + "****");
					
					//#54909.. Even for MA exisitng driver it should be masked if Rmv lookup is successful.
					if(getPolicyState() == 'MA') { 
						// mask only for rmv lookedup driver
						if ($('#rmvLookupInd_' + lastIndex).val() == 'Yes') {
							$(strElm).val(maskFldVal.substr(0, maskFldVal.length-4) + "****");
						}
					}else{
						$(strElm).val(maskFldVal.substr(0, maskFldVal.length-4) + "****");
					}
					
					//set the reorder flag since data got updated
					if (maskFldVal.indexOf('*') == -1) {
						$('#mvrDataUpdatedInd_' + lastIndex).val("Yes");
						
						$('#prefillDataUpdatedInd_' + lastIndex).val("Yes");
						$('#prefillUpdatedColumnName_' + lastIndex).val("LICENSE NUMBER");
						// no need to set PrefillUpdatedPIIFields as not in use prefill page
						//setPrefillUpdatedPIIFields("drivers", $(this));
					}	
				}
			} else { // For newly added driver
				// assign same value to hidden variable
				$("#licenseNumber_" + getIndexOfElementId(strElm)).val(maskFldVal);
			}
		}
		else { // assign same value to hidden variable
			$("#licenseNumber_" + getIndexOfElementId(strElm)).val(maskFldVal); 
		}		
	}
}

function clearInvalidDriverTabBirthDate(){
	var lastIndex = null;
	// The birthdate  
	$('input.clsBirthDate').each(function() {			
		var intAge = calculateAge($(this).val(),null);
		if (parseInt(intAge) > 110) {		
			
			lastIndex = getIndexOfElementId($(this));				
			if($('#maskBirthDate_' + lastIndex).length > 0){
				$('#maskBirthDate_' + lastIndex).val('');				
			}
			$('#firstLicUsaDt_' + lastIndex).val('');
			$(this).val('');
		}
	});
	$('input.clsmMaskedDOB').each(function() {		
		var intAge = calculateAge($(this).val(),null);
		if (parseInt(intAge) > 110) {						
			
			lastIndex = getIndexOfElementId($(this));			
			if($('#birthDate_' + lastIndex).length > 0){
				$('#birthDate_' + lastIndex).val('');				
			}
			$('#firstLicUsaDt_' + lastIndex).val('');
			$(this).val('');
		}
	});
}

function invokeValidateLicNumber(elem,strLicReq){
	var strErrTag = 'licenseNumber.browser.inLine';			
	return validateInputElementWithMap(elem, strLicReq, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(elem).parent()), errorMessages, 
										validateLicenseNumber, addDeleteCallback);
}

function invokeValidateUniqueLicNumber(elem,strLicReq){
	var strErrTag = 'licenseNumber.browser.inLine';			
	return validateInputElementWithMap(elem, strLicReq, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(elem).parent()), errorMessages, 
										validateUniqueLicenseNumber, addDeleteCallback);
}

function setFocusToErroredDriverField(){
	var pageErrorInfoSel = $('#pageErrorInfo').val();
	if(pageErrorInfoSel != null && pageErrorInfoSel != 'null' && pageErrorInfoSel.length > 0 && pageErrorInfoSel != '[]'){
		var pageErrorInfos = jQuery.parseJSON(pageErrorInfoSel);
		if(pageErrorInfos==null){
			return;
		}
		for(var i=0;i<pageErrorInfos.length;i++){
			if(pageErrorInfos[i].fieldID=='driver.licenseNumber' && (pageErrorInfos[i].messageCode=='notValidLicNumber' || pageErrorInfos[i].messageCode=='required')){
				currLicenseType = 'maskLicNum_';
				if(document.getElementById(currLicenseType+pageErrorInfos[i].index) == null){
					currLicenseType = 'licenseNumber_';
				}
				var elemWithError = currLicenseType+pageErrorInfos[i].index;
				if(document.getElementById(elemWithError)){
					//41470 - Driver page did not position you correctly to the first  DL# missing
					closeSetFocus(elemWithError);
					var errorMsgDisplay = 'licenseNumber.browser.inLine.'+ pageErrorInfos[i].messageCode;
					showClearInLineErrorMsgsWithMap(pageErrorInfos[i].fieldID.replace('driver.','')+'_'+pageErrorInfos[i].index, errorMsgDisplay, $('#defaultMulti').outerHTML(),
							pageErrorInfos[i].index, errorMessages, addDeleteCallback);
				}
				return;
			}else{
				var errorId = pageErrorInfos[i].fieldID.replace('driver.','')+'_'+pageErrorInfos[i].index;
				if(errorId && errorId.indexOf("POLSTAR_SERVICE_ERROR") == -1){
					closeSetFocus(errorId);
				}
				return;
			}
		}
	}
}

function setFocusToPermitDriverField() {
	
	$('select.clsLicenseStatus').each(function() {		
		var lastIndex = getIndexOfElementId(this);
		if ($("#licenseStatus_"+ lastIndex).val()=='P') {
			setFocus('licenseStatus_'+ lastIndex);
			return;
		}
		
	});
}

function setupTabbingBehavior() {
	// Scroll to top after tabbing out of last field in a column
	$(".clsDeleteDriver").focus(function(e){
		$(window).scrollTop(0);
		var deleteDriverId = $(this).attr('id');
		var currentColumn = Number(deleteDriverId.charAt(15,16));
		if (currentColumn >3){
			$('#firstDriver').val(currentColumn-1);
			slideDriverRight(event);
			updateDriverScrollPanel(SCROLL_PANEL);
		}
		$('#firstDriver').val(currentColumn);
		updateDriverScrollPanel(SCROLL_PANEL);
	});
	
	// Scroll to top after tabbing out of last field in a column
	$(".clsSr22FilingChkBox").keydown(function(e){
		if(e.shiftKey == false && e.keyCode ==9) {
			$(window).scrollTop(0);
			var sr22ColumnId = $(this).attr('id');
			var currentColumn = Number(sr22ColumnId.charAt(11,12));
			if (currentColumn >1){
				$('#firstDriver').val(currentColumn-1);
				$("#rightScrollBtn").trigger('click');
			}
		}
	});
	
	//remove scroll function after migration to modern browsers 
	$('.colInput,.chosen-single').keyup(function(e){
	    if(e.shiftKey == true && e.keyCode == 9) {
	        $(window).scrollTop($(this).offset().top - $('#rowHeaderTable').offset().top - 45);
	    }
	    validateLastInput('lastInputLeft');
	});
	//end
	
	// Scroll to bottom after tabbing into last field in a column
	$(".clsSr22FilingChkBox").keyup(function(e){
	    if(e.shiftKey == true && e.keyCode ==9) {
	        $(window).scrollTop($('#sr22Filing_0').offset().top);
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
	        		setFocus('sr22Filing_' + (currentColumn -1));
	        		e.preventDefault();
	        	}
	        }
	    }
	});
	
}

//OR condition will trigger if name, dob is changed on driver for PNI
function checkIfCLUEPrefillReorderIsRequiredOffDriver(){
	var pendingClue = $('#clueOrderStatus').val()=='Successful-No Data' || $('#clueOrderStatus').val()=='Unsuccessful' ;
	var pendingPrefill = $('#PREFILL_StatusDesc').val()=='Successful - No Data' || $('#PREFILL_StatusDesc').val()=='Unsuccessful' ;
	if($('#firstName_0').val() != $('#firstName_0').prop('defaultValue')){
		if(pendingPrefill) {$('#isPrefillReorderRequired').val('true');}
		if(pendingClue) {$('#isCLUEReorderRequired').val('true');}
		$('#isPrefillResetRequired').val('true');		
		return true;
	}
	if($('#lastName_0').val() != $('#lastName_0').prop('defaultValue')){
		if(pendingPrefill) {$('#isPrefillReorderRequired').val('true');}
		if(pendingClue) {$('#isCLUEReorderRequired').val('true');}
		$('#isPrefillResetRequired').val('true');
		return true;
	}
	if($('#birthDate_0').val() != $('#birthDate_0').prop('defaultValue')){
		if(pendingPrefill) {$('#isPrefillReorderRequired').val('true');}
		if(pendingClue) {$('#isCLUEReorderRequired').val('true');}
		$('#isPrefillResetRequired').val('true');
		return true;
	}
	$('#isPrefillReorderRequired').val('');
	$('#isCLUEReorderRequired').val('');
	$('#isPrefillResetRequired').val('');
	return false;
}

function setEndorsementRatedDriverInd(thisElem){
	//This function is only for drivers from NB, not added in ENDR
	var lastIndex = getIndexOfElementId(thisElem);
	if($('#endorsementDriverAddedInd_'+lastIndex).val()=='Yes'){
		return false;
	}
	var originalVal = $(thisElem).prop('defaultValue');
	var currVal = $(thisElem).val();
	var setIndicators = false;
	//If driver status changes from unrated to rated, set the status
	if($('#stateCd').val() == 'MA' && $('#existingMALicStateDriverInd_'+ lastIndex).val() =='Yes' 		
		&& $('#licenseState_'+ lastIndex).val() == STATE_MA ){
		var originalValMA = $(thisElem).data('OriginalValue');
		// if original driver status is changed from deferred2 to other
		if(isDeferred2Impl(originalValMA) == true && isDeferred2Impl(currVal) == false) {
			setIndicators = true;
		}
	}else if(isRatedImpl(originalVal) == false && (isRatedImpl(currVal) == true)) {
		setIndicators = true;
	}
	if(setIndicators){
		$('#endorsementExistingDriverRatedInd_'+lastIndex).val('Yes');
		$('input#endorsementRatedDriverInd').val("Yes");
		$('input#endorsementOnlyRatedDriverInd').val("Yes");
	}
}

function resetRMVInformationForDriver(driverIndex){
	/*	
	$('#firstName_' + driverIndex).val('');
	$('#middleName_' + driverIndex).val('');
	$('#lastName_' + driverIndex).val('');
	$('#lastName_' + driverIndex).val('');
	$('#birthDate_' + driverIndex).val('');
	$('#maskBirthDate_' + driverIndex).val('');
	$('#gender_' + driverIndex).val('').trigger('chosen:updated');
	$('#licenseStatus_' + driverIndex).val('').trigger('chosen:updated');
	*/
	clearDriverRMVResult(driverIndex);
	
	$('#rmvLookupInd_' + driverIndex).val('R');	
	enableFieldsForRMVLookup(driverIndex);
}

//01/29/2015 Changing the License Number to a new MA license number or changing the License State to MA 
//triggers an RMV Look Up. When this data is changed, the RMV returned data is cleared. 
function performAutomatedRMVLookup(thisElem){
	//#54725...autoRmvLookup is not required as per FR. 
	return;
	
	if ($('#stateCd').val()!='MA'){
		return;
	}
	var lastIndex = getIndexOfElementId(thisElem);
	if($(thisElem).hasClass('clsmMaskedLicNum')
			|| $(thisElem).hasClass('clsLicenseNumber')){
		if (isMASpecificDriver($('#stateCd').val(),$('#licenseState_'+lastIndex).val())
				&& !isNotRatedDriverMA(lastIndex)){
			$('#maskLicNum_'+lastIndex).val(trimSpaces(thisElem.value));
			$('#licenseNumber_'+lastIndex).val(trimSpaces(thisElem.value));
			resetRMVInformationForDriver(lastIndex);
			performRMVLookup('#licenseNumber_'+ lastIndex, true);
		}
	} else if($(thisElem).hasClass('clsLicenseState')
			&& $(thisElem).data('OriginalValue')!='MA'
			&& $(thisElem).val()=='MA'){
		if (!isNotRatedDriverMA(lastIndex)){
			resetRMVInformationForDriver(lastIndex);
			performRMVLookup('#licenseNumber_'+ lastIndex, true);	
		}
	}
}

function setMvrDataUpdatedIndicatorDrivers(){
	$('select.clsMvrDataFld, input.clsMvrDataFld, input.clsmMaskedLicNum,input.clsLicenseNumber,select.clsLicOutOfStateOrCountrySelect,select.clsLicenseStatus').change(function() {
		var lastIndex = getIndexOfElementId(this);

		// condition limited to do for only license number change...
		//#54725...autoRmvLookup is not required as per FR. so commented below block for NB & Endorsement.
		/*if ($(this).hasClass("clsLicenseNumber") || $(this).hasClass("clsmMaskedLicNum")) {
			if(isEndorsement()){
				// #54320...for endorsement auto rmv lookup is eligible for newly added or if existing MA deferred2 driver is changed to other.
				if ( $('#endorsementDriverAddedInd_' + lastIndex).val() == 'Yes' 
				|| ($('#existingMALicStateDriverInd_' + lastIndex).val() =='Yes' && $('#existingDrvrChangedFromDefer2ToOtherInd_' + lastIndex).val() =='Yes') ) {
					performAutomatedRMVLookup(this);
				}
			}else{
				performAutomatedRMVLookup(this);
			}
		}*/
		//55726 -- Addiding condition for MA, not changing the flow for NJ
		var setMvrIndicators = true;
		if(isEndorsement() && getPolicyState() == STATE_MA && $('#endorsementDriverAddedInd_'+lastIndex).val()=='Yes'){
			//check the mvrorderstatus
			if($('#mvrOrderSatatus_'+lastIndex).val() != undefined && $('#mvrOrderSatatus_'+lastIndex).val() == 'Has not ordered yet'){
				setMvrIndicators = false;
			}
		}

		if(setMvrIndicators){
			if ( !isNotRatedDriver(lastIndex)){
				$('#isDriverInformationUpdated').val('true');
			}

			if(isEndorsement()){
				setEndorsementRatedDriverInd(this);	
			}
			if ( !isMVRInitialOrderComplete() ){
				return;
			}
			var currDriverId = $('#driverId_'+lastIndex).val();
			if ( isNotRatedDriver(lastIndex) 
					|| $('#mvrDataUpdatedIndDriver_'+currDriverId).val()=='Y' 
						|| $('#mvrDataUpdatedIndDriverStatus_'+currDriverId).val()=='' 
							|| $('#mvrDataUpdatedIndDriverStatus_'+currDriverId).val()==null){
				return;
			}
			var currVal = $(this).val();
			var originalVal = '';
			var ratedToNonRatedDrvIds='';

			if ($(this).is('select:not(select[multiple])')){
				originalVal = $(this).data('OriginalValue');
			} else {
				originalVal = $(this).prop('defaultValue');
				// check for particular hidden variables and take their original values
				if ($(this).hasClass("clsMvrDataFldHidden")) {
					lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));				
					if ($(this).hasClass("clslistAreaCodes")) {
						originalVal = $('#listAreasOriginalSelectedValues_' + lastIndex).val();
					} 			
				}
			}

			if( (isRatedImpl(originalVal) == true) &&
					((isDeferred1Impl(currVal) == true) || (isDeferred2Impl(currVal) == true)) ) {
				ratedToNonRatedDrvIds = lastIndex;
			}
			if ( currVal != originalVal) {
				if($(this).attr('id').indexOf('driverStatus') == 0){
					if( ((isDeferred1Impl(originalVal) == true) || (isDeferred2Impl(originalVal) == true)) &&
							(isRatedImpl(currVal) == true)){
						resetMVROrderStatus(currDriverId,'drivers');
					}
				}else if($(this).attr('id').indexOf('licOutOfStatePrior3YrsInd') == 0){
					if(	((currVal == 'No') && (originalVal == 'Yes')) ||
							((currVal == 'Yes') && (originalVal == 'No'))){
						if (ratedToNonRatedDrvIds == '') {
							resetMVROrderStatus(currDriverId,'drivers');
						}
					}
				}else{
					if (ratedToNonRatedDrvIds == '') {
						resetMVROrderStatus(currDriverId,'drivers');
					}
				}
			}
		}
	});
}

function setExistingDrvrChangedFromDeferred2ToOtherInd(strElm){
	
	if (isEndorsement() && getPolicyState() == STATE_MA) {
		var lastIndex = getIndexOfElementId(strElm);
		//#54591...show the rmv lookup button.... 
		// if existing p* driver(only MA lic state driver) status is changed from deferred2 to other  
		if($('#existingMALicStateDriverInd_'+ lastIndex).val() =='Yes' 		
		&& $('#licenseState_'+ lastIndex).val() == STATE_MA ) {
			var originalVal = $(strElm).data('OriginalValue');
			var currVal = $(strElm).val();
			// if original driver status is changed from deferred2 to other
			if(isDeferred2Impl(originalVal) == true && isDeferred2Impl(currVal) == false) {
				//set indicator
				$('#existingDrvrChangedFromDefer2ToOtherInd_'+ lastIndex).val('Yes');	
				
				//enable rmv lookup button
				showOrHideHtml($("#rmvLookup_" + lastIndex), 'show');
				if ($('#rmvLookupInd_'+ lastIndex).val() != 'Yes') {
					displayRMVLookupStatus($('#rmvLookupInd_'+ lastIndex));
				}
				showOrHideRMVLookupButtonRows();
			}
		}	
	}
}

function showOrHideMotorcycleLicenseDate(strElm) { 
	var lastIndex;		
	var strPolicyState;
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
	
	//Not applicable fields for Non MA
	if (strPolicyState != STATE_MA) {
		return;
	}
	
	if ((strPolicyState == STATE_MA) 
			//52217 - Field should only display when Motorcycle License field = License 
			//&&(isRated(lastIndex) || isDeferred1(lastIndex))
			&& $("#motorcycleLicTypeDesc_"+ lastIndex).val()=='License') {
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'show'); 
		showOrHideHtml("#motorcycleFirstLicDt_" + lastIndex, 'show');
		return;
	}
	showOrHideHtml("#motorcycleFirstLicDt_" + lastIndex, 'hide');
	clearColumnInLineError("#motorcycleFirstLicDt_" + lastIndex);
	
	// show or hide date first license row
	////showOrHideFieldRow('clsDateFirstLicenseRow', 'clsDateFirstLicense');
	var blnShowRow = false;
	
	$('.clsMotorcycleFirstLicDt').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 
		 if ((strPolicyState == STATE_MA) 
					//52217 - Field should only display when Motorcycle License field = License 
					//&&(isRated(lastIndex) || isDeferred1(lastIndex))
					&& $("#motorcycleLicTypeDesc_"+ lastIndex).val()=='License') {
			 blnShowRow = true;
			 return true;
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'hide');
	}	
}

function processMotorcycleLicenseFields(strElm) {
	var lastIndex = getIndexOfElementId(strElm);		
	var strPolicyState = getPolicyState();
	var blnLicOrPermitSelected = false;
	
	var motorCycleLicenseVal =  $(strElm).val();
	
	//blow fields dont exist in non MA.
	if (strPolicyState != STATE_MA) {
		return;
	}
	
	if (strPolicyState == STATE_MA && motorCycleLicenseVal == 'License') {			
		// show motorcycleFirstLicDt
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'show');
		showOrHideHtml("#motorcycleFirstLicDt_" + lastIndex, 'show');
		
		// hide motorcycleCourseInd checkbox
		showOrHideHtml("#motorcycleCourseIndNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsMotorcycleCourseIndRow', 'show'); 
		showOrHideHtml("#motorcycleCourseInd_" + lastIndex, 'show');
	} else {
		// hide motorcycleFirstLicDt and also clear  value/in line error
		showOrHideHtml("#motorcycleFirstLicDt_" + lastIndex, 'hide');
		clearColumnInLineError("#motorcycleFirstLicDt_" + lastIndex);
		$("#motorcycleFirstLicDt_" + lastIndex).val("");
		
		// show motorcycleCourseInd checkbox
		showOrHideHtml("#motorcycleCourseIndNA_" + lastIndex, 'show');
		showOrHideHtml("#motorcycleCourseInd_" + lastIndex, 'hide');
		$('#motorcycleCourseInd_' + lastIndex).prop('checked', false);
	}
	
	if (strPolicyState == STATE_MA && (motorCycleLicenseVal == 'License' || motorCycleLicenseVal == 'Permit')) {	
		blnLicOrPermitSelected = true;
	}
	
	var blnShowRow = false;	
	$('.clsMotorcycleLicense').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 
		 if (strPolicyState == STATE_MA && $(this).val() =='License') {
			 blnShowRow = true;
			 //return true; commented to continue loop to execute below condition also for each driver.
		 }
		 
		 // clear in line errors for all drivers
		 if (blnLicOrPermitSelected) {
			 clearColumnInLineError("#motorcycleLicTypeDesc_" + lastIndex);
			 $('#motorcycleLicTypeDesc_' + lastIndex).removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
		 }
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'show');
		showOrHideDrvrTableRow('clsMotorCycleTrainingCourse', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsMotorcycleLicenseDateRow', 'hide');
		showOrHideDrvrTableRow('clsMotorCycleTrainingCourse', 'hide');
	}
}

function showOrHideAllDriversRMVLookUp() {
	// for endorsement always hide
	//if (getPolicyState() != STATE_MA || isEndorsement()) {
	/*if (getPolicyState() != STATE_MA) {
		$("#allDriverRMVLookUp").addClass("hidden");
		return;
	}*/
	
	//#53332
	$("#allDriverRMVLookUp").addClass("hidden"); //default
	//only show for NB & Policy state = MA
	if (!isEndorsement() && getPolicyState() == STATE_MA ) {
		$("#allDriverRMVLookUp").removeClass("hidden");
	}
}


function showOrHideRMVButton(strElm,forceButton) { 
	if (getPolicyState() != STATE_MA) {
		//exit
		return;
	}
	
	var lastIndex = getIndexOfElementId(strElm);
	var showOrHide = 'show';
	
	var licState = $("#licenseState_" + lastIndex).val();	
	//if (getPolicyState() != STATE_MA || isEndorsement() || licState != STATE_MA) {
	if (getPolicyState() != STATE_MA || licState != STATE_MA) {
		showOrHide = 'hide';		
	}
	
	if(forceButton){
		if (isMASpecificDriver($('#stateCd').val(),$('#licenseState_'+lastIndex).val())
		&& isDriverEligibleForRmvLookUp(lastIndex)){
			//showOrHide = 'show';
			if (isEndorsement()) { 
				// #54591(Endorsement)..#54320..if newly added MA driver or existingMALicStateDriverInd is yes then show the button
				// don't show even existing p* oos drivers is changed to MA driver
				if ( $('#endorsementDriverAddedInd_' + lastIndex).val() == 'Yes' 
				|| ($('#existingMALicStateDriverInd_' + lastIndex).val() =='Yes' && $('#existingDrvrChangedFromDefer2ToOtherInd_' + lastIndex).val() =='Yes') ) {
					showOrHide = 'show';
				} else {
					//for existing MA driver setExistingDrvrChangedFromDeferred2ToOtherInd() shows during driverstatus change event.
					showOrHide = 'hide';
				}
			} else {
				showOrHide = 'show';
			}
		} else{
			showOrHide = 'hide';
			//clear rmv lookup indicator/registry data fields since no longer treated as RMV driver.
			$('#rmvLookupInd_' + lastIndex).val('');
			//clear registry data
			// in endorsement for existing drivers just keep/show whatever p* sends ??.
			/*if (isEndorsement()) { 
				if ( $('#endorsementDriverAddedInd_' + lastIndex).val() == 'Yes' ) {
					clearRegistryDataFields(lastIndex);
				}
			} else {
				clearRegistryDataFields(lastIndex);
			}	*/	
			clearRegistryDataFields(lastIndex);
		}
	}
	//TD 51891 fix - Driver - field labels and entry fields do not line up sometimes after changes to Driver Status field
	showOrHideHtml($("#rmvLookup_" + lastIndex), showOrHide);
	
	if("hide" == showOrHide){
		//since button is hidden remove error/ messages if any
		//showClearInLineErrorMsgsWithMap('rmvLookup_'+lastIndex, '', $('#defaultMulti').outerHTML(), lastIndex, errorMessages, addDeleteCallback);
		$('#rmvLookup_' + lastIndex).removeClass('inlineError');
		$('#rmvLookup_Error_Col_' + lastIndex).removeClass('inlineErrorMsg').removeClass('inlineMsgGreen');
		$('#rmvLookup_Error_Col_' + lastIndex).text("");
		$("#rmvLookup_Error_Col_" + lastIndex).css({"visibility":"hidden"});
	}else{
		$("#rmvLookup_Error_Col_" + lastIndex).css({"visibility":""});
	}
	
	//showOrHideHtml($("#rmvLookup_Error_Col_" + lastIndex), showOrHide);
	//$('#rmvLookup_Error_Col_' + lastIndex).removeClass('inlineMsgGreen');
	//show or hide whole row
	//deleted unwanted code as beleow function takes care	
	
	showOrHideRMVLookupButtonRows();
	
	return;
}

function enableLicenseStatus(strElm) {
	var driverIndex = getIndexOfElementId(strElm);
	if (getPolicyState() == STATE_MA) {
		if (isDeferred2(driverIndex)) {
			if (isEndorsement()) {
				if(isEndorsementAddedDriver(driverIndex)) {
					enableDataField ('#licenseStatus_' + driverIndex);
				}
			} else {
				enableDataField ('#licenseStatus_' + driverIndex);
			}
		}
	}
}

function clearRegistryDataFields(driverIndex) {
	$("#firstLicMADt_" + driverIndex).val('');
	$("#sdip_" + driverIndex).val('');
	$("#rmvFirstLookupDate_" + driverIndex).val('');
}

function displayRMVLookupStatus(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	var licState = $("#licenseState_" + lastIndex).val();
	
	if (getPolicyState() == STATE_MA && licState == STATE_MA && isDriverEligibleForRmvLookUp(lastIndex)) {
		var rmvLokkupInd = $("#rmvLookupInd_" + lastIndex).val();
		if (rmvLokkupInd == '' || rmvLokkupInd == 'No') {
			// display below message if button displays
			if ($('#rmvLookup_' + lastIndex).css('display') == 'block') {
				showClearInLineErrorMsgsWithMap('rmvLookup_'+ lastIndex, 'driver.rmvLookup.browser.inLine.lookupRequired', $('#defaultMulti').outerHTML(), lastIndex, errorMessages, addDeleteCallback);
			}
		} else if (rmvLokkupInd == 'X') {
			// display below message if button displays
			if ($('#rmvLookup_' + lastIndex).css('display') == 'block') {
				showClearInLineErrorMsgsWithMap('rmvLookup_'+ lastIndex, 'rmvlookup.browser.inLine.nohit', $('#defaultMulti').outerHTML(), lastIndex, errorMessages, addDeleteCallback);	
				$('#rmvLookup_Error_Col_' + lastIndex).removeClass('inlineMsgGreen').addClass('inlineErrorMsg');
			}
		}
	}	
}	

function displayMAFirstLicensed(strElm) {
	$(licState).val(getPolicyState());
	var lastIndex = getIndexOfElementId(strElm);
	var licState = $("#licenseState_" + lastIndex).val();
	if (getPolicyState() == STATE_MA && licState == STATE_MA) {
		showClearInLineErrorMsgsWithMap('firstLicMADt_'+ lastIndex, 'firstLicMADt.browser.inLine.required', $('#defaultMulti').outerHTML(), lastIndex, errorMessages, addDeleteCallback);	
	}	
}	


function getDriverIndex(id) {
	return getFieldIndex(id);
}

function closeSetFocus(fieldId){
	//52619 - Mod 2 - entered 2 Licenses the same - by accident - Got the error - clicked View details - clicked fixed now - nothing happened
	if(fieldId.indexOf('licenseNumber')==-1 && $('#'+fieldId).attr('style')==null){
		fieldId=fieldId.replace('licenseNumber','maskLicNum');
	}
	slideToShowError(fieldId, "#firstDriver", "#driverCount", DRIVERS_PER_PAGE, "#leftScrollBtn", "#rightScrollBtn");	
	setFocus(fieldId);
}

function clearRmvDataIfDataChanged(lastIndex) {
	//#52471...
	if (getPolicyState() == STATE_MA) {
		if ($('#rmvLookupInd_' + lastIndex).val() == 'Yes') {
			var originalLicStateVal = $('#licenseState_'+ lastIndex).data('OriginalValue');
			var currLicStateVal = $('#licenseState_'+ lastIndex).val();
			
			var originalLicVal = $('#licenseNumber_'+ lastIndex).data('OriginalValue');
			var currLicVal = $('#licenseNumber_'+ lastIndex).val();
			
			if (( originalLicStateVal != currLicStateVal) || ( originalLicVal != currLicVal)) { 
				clearDriverRMVResult(lastIndex);
				//unamsk after clearing rmv indicator above
				unmaskData(lastIndex);
				showClearInLineErrorMsgsWithMap('rmvLookup_'+ lastIndex, 'driver.rmvLookup.browser.inLine.lookupReorderRequired', $('#defaultMulti').outerHTML(), lastIndex, errorMessages, addDeleteCallback);
				$('#rmvLookup_Error_Col_' + lastIndex).removeClass('inlineMsgGreen').addClass('inlineErrorMsg');			
				enableFieldsForRMVLookup(lastIndex);
			}
		}
	}
}

function unmaskData(lastIndex) {
	//un mask lic number
	var licNum =  $('#licenseNumber_'+ lastIndex).val();
	
	if ( isElementExisting('#maskLicNum_' + lastIndex) ){		
		$('#maskLicNum_'+ lastIndex).val(licNum);
	}
}

function enableFieldsForRMVLookup(driverIndex) {
	enableDataField ('#birthDate_' + driverIndex);
	enableDataField ('#maskBirthDate_' + driverIndex);	
	enableDataField ('#licenseStatus_' + driverIndex);	
	enableDataField ('#gender_' + driverIndex);
}

function showOrHideRMVLookupButtonRows() {
	var blnAtleastOneRmvLookupBtnEnabled = false;
	
	$('.clsRmvLookupBtn').each(function() {
		var driverIndex = this.id.substring('rmvLookup_'.length);
		
		if ($('#rmvLookup_' + driverIndex).css('display') == 'block') {
			blnAtleastOneRmvLookupBtnEnabled = true;
		}
		
	});
	
	if (blnAtleastOneRmvLookupBtnEnabled) {				
		showOrHideDrvrTableRow('rmvLookup_Row', 'show');
		showOrHideDrvrTableRow('rmvLookup_Error_Header', 'show');
	}
	else {		
		showOrHideDrvrTableRow('rmvLookup_Row', 'hide');
		showOrHideDrvrTableRow('rmvLookup_Error_Header', 'hide');
	}	
	
}

function isDriverEligibleForRmvLookUp(driverIndex) {
	var driverStatus = getDrvrStatus(driverIndex);
	// empty value considered as eligible for rmv lookup now..
	return (driverStatus != "N" && driverStatus != "P" && driverStatus != "NEV_LIC");
}

function callDisplayRmvLookupStatus(driverIndex) {
	
	var licState = $("#licenseState_" + driverIndex).val();
	var licNum = $("#licenseNumber_" + driverIndex).val();
	
	if (getPolicyState() == STATE_MA  && licState == STATE_MA) {
		// dispplay rmv look up status if lic num is there.
		 if (licNum != '') {
			 displayRMVLookupStatus($("#licenseNumber_" + driverIndex));
			 $('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineMsgGreen');
			 $("#rmvLookup_Error_Col_" + driverIndex).css({"visibility":""});
		 } else {
			 clearRmvLookupStatus(driverIndex);
		 }
		
	}
}

function clearRmvLookupStatus(driverIndex) {
	
	$('#rmvLookup_' + driverIndex).removeClass('inlineError');
	$('#rmvLookup_Error_Col_' + driverIndex).removeClass('inlineErrorMsg').removeClass('inlineMsgGreen');
	$('#rmvLookup_Error_Col_' + driverIndex).text("");
	$("#rmvLookup_Error_Col_" + driverIndex).css({"visibility":"hidden"});
}

function showHideCellPhoneInfo() {
	var yubiIndChecked = false;
	
	$( ".clsYubiDriverChkBox" ).each(function( driverIndex ) {
	    if ($('#yubiDriver_' + driverIndex).prop('checked')) {
			$('#cellphoneNumber_' + driverIndex).removeClass('hidden');
			
			if ($('#cellphoneNumber_'+driverIndex).val() == '') {
				addPreRequiredStyle($('#cellphoneNumber_'+driverIndex));
			}
			
			yubiIndChecked = true;
	    }  else  {
		   	$('#cellphoneNumber_'+driverIndex).addClass('hidden');
		   	$('#cellphoneNumber_Error_Col_'+driverIndex).empty();
		   	removePreRequiredStyle($('#cellphoneNumber_'+driverIndex));
	    }
	    showHideField('cellphoneNumber', driverIndex, $('#yubiDriver_' + driverIndex).prop('checked'));
	});
	
	if (yubiIndChecked) {
		$(".cellphoneNumber_Row").show();
	} else {
		$(".cellphoneNumber_Row").hide();
	}
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
				index*1, errorMessages, addDeleteCallback);
	}
}

function showHideChosenContainer(id, showit) {
	if(showit) {
		
		$('#'+id+'_chosen').removeClass('chosenDropDownHidden');
		
	} else {
		
		$('#'+id+'_chosen').addClass('chosenDropDownHidden');
	}
	
}

function validatePhoneNumber() {
	var phonenumbers = [];
	$( ".cellphoneNumber" ).each(function( driverIndex ) {
		if ($("#yubiDriver_" + driverIndex).prop('checked')) {
			var errorMessageID = '';		
			var cellPhoneNumber = $('#cellphoneNumber_' + driverIndex).val();
			
			if(cellPhoneNumber == null || cellPhoneNumber == "" || cellPhoneNumber =='Optional'){
				errorMessageID = 'cellphone.yubi.browser.inLine.required';
				showClearInLineErrorMsgsWithMap(this.id, 
						errorMessageID, 
						$('#defaultMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			} else if (!/[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/.test(cellPhoneNumber)) {
				errorMessageID = 'cellphone.yubi.browser.inLine.invalid';
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			} else if ($.inArray(cellPhoneNumber, phonenumbers) != -1) {
				errorMessageID = 'cellphone.yubi.browser.inLine.unique';
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);				
			} else {
				phonenumbers.push(cellPhoneNumber);
				showClearInLineErrorMsgsWithMap(this.id, errorMessageID, 
						$('#defaultMulti').outerHTML(),
						getColumnIndexNoHeader($(this).parent()), 
						errorMessages, addDeleteCallback);
			}
		}
		
		addRemoveBindPreRequired();
	});
}

//This function is used for those field which are not required by default but are required conditionally.
function addRemoveBindPreRequired() {
	$( ".cellphoneNumber" ).each(function( driverIndex ) {
	
		if($("#yubiDriver_" + driverIndex).prop('checked') && $(this).val() == '') {
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
		if (!$("#yubiDriver_" + driverIndex).prop('checked')) {
			$(this).val('');
		}
	});
}

//Rule#29-Lock down Driver Training Status Flag to Agents.
function disableDriverTraining(columnIndex){
	var maRule29Enabled = $('#maRule29Enabled').val() || '';
	if ('Yes'=== maRule29Enabled && getPolicyState() == STATE_MA && !isEmployee()) {
		$("#drvrTraining_" + columnIndex).attr('disabled', 'disabled');
	}
}
