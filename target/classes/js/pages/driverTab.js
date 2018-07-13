

// REFER driverTab-enchanced.js


/*
jQuery(document).ready(function() {
		
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	
	maxDriversAllow = $('#maxDriversAddLimit').val();
	
	//$('select:not(select[multiple])').selectBoxIt('destroy');
	
	// for testing only 
	//$('#isQuote').val("false");
	//$("#policyStateCd").val('NJ');
	//$("#policyStateCd").val('CT');
	
	showOrHidePrefillLink();
	
	//Bind Navigation Buttons  
	$("#newDriver").click(function(event){
		addDriver(event);
		//adding a driver should reset premium on RATE BUTTON
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);
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
	
	//$('#aiForm').bind(getSubmitFailureEvent(), function(event, result){		
		//handleSubmitFailure(result);
	//});
	
	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
		handleSubmit(event);
	});
	
	// Offset the mainContent if we're displaying a page alert
	var mainContent = $('#mainContent');
	var driverMainContent = $('#driverMainContent');
	var blnErrorOnPage = false;
	$('.aiAlert:not(.hidden)').each(function() {
		blnErrorOnPage = true;
		var alertHeight = $(this).outerHeight(false);
		mainContent.css('margin-top', parseInt(mainContent.css('margin-top')) + alertHeight + 17);
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
	
	//set focus on to first field		
	setFocus('licenseState_0');
	
	// To scroll the page up while tabing from bottom.
	$( "select[id^='licenseState_']" ).focus(function(){

		window.scrollTo(0, 0);
	});
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
    
	//if loose focus, remove the yellow background
	$('.required').blur(function(){
		if ($(this).val().length != 0){
			$(this).removeClass('preRequired');
		}
 	});
	
	//add driver column automatically
	if ( isEndorsement() ) {
		if ($("#endorsementUserAction").val().toUpperCase() == ADD_DRIVER) {
			addDriver(event);
		}
	}		
	
	chkIfLicNumIsRequired();
 	
});

var tabIndex = 1;
var maxDriversAllow;
//var maxColumns = 3;
var EMPTY_ERROR_ROW_HEIGHT = '0px';
var SCROLL_PANEL = '#scrollPanel';
var ADD_DRIVER = "ADDDRIVER";

window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	setDefaultEnterID('vehicles');
}

function doSetShowHideDriverFields() {
	setDriverColumnHeaderSeqNums();
	
	$('span.driverColumnHeaderDriverName').each(function() {		
		updateDriverColumnHeaderDriverName(this);
	});
	
	$('select.clsLicenseState').each(function() {		
		clearLicenseNumber(this);
	});
	
	setDateFirstLicensedDatesForAllDrvrs();
	
	$('input.clsBirthDate').each(function() {		
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
	});
	
	setAndDisableRelationshipToPNI();
	
	addOrDeletePNIOptions();
	
	$('input.clsDateFirstLicense').each(function() {		
		showOrHideDateFirstLicense(this);
	});
	
	$('select.clsLicenseStatus').each(function() {		
		deleteLicSatatusOptions(this);
		if (isEndorsement()) {
			showOrHideLicenseStatus(this);
		}
	});
	
	$('select.clsDriverStauts').each(function() {		
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideSr22FilingChkBoxes(this);
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
	
	$('input.clsAccPrevCourseChkBox').each(function() {		
		showOrHideAccPrevCourseDt(this);
	});
	
	// disable sr22 filing checkbox for endorsement
	if (isEndorsement()) {
		$('input.clsSr22FilingChkBox').each(function() {						
			disableForExistingDriver(this);			
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
	
	if (sAction == 'Add' || sAction == 'Delete') {
		bindInputValidationEvents(columnPrefix, selector, sAction);
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
	});
	
	$(columnPrefix + 'input.clsLicenseNumber, input.clsmMaskedLicNum', selector).keydown(function(event){
		acceptLicenseCharsOnly(this, event);
    });
	
	$(columnPrefix + 'input.clsmMaskedLicNum', selector).keydown(function(event){
		clearMaskedValue(this, event, '4');
    });
	
	$(columnPrefix + 'input.clsName', selector).keydown(function(event){
		acceptNameCharsOnly(this, event);
    });
	
	$(columnPrefix + 'input.clsDateInputFld', selector).keydown(function(event){
		acceptNumericsAndSlashes(this, event);
    });
	
	$(columnPrefix + 'input.clsDateInputFld', selector).keyup(function(event){
		autoSlashes(this,event);
    });
	
	$(columnPrefix + 'input.clsBirthDate', selector).blur(function(){
		// validateDateAndSetFirstLicDt(this);
		setDateFirstLicensedDate(this);
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDrvrTrainingChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
    });
	
	$(columnPrefix + 'input.clsmMaskedDOB', selector).keydown(function(event){
		clearMaskedValue(this, event, '2');
    });
	
	$(columnPrefix + 'input.clsmMaskedDOB', selector).blur(function(){
		// pass correct hidden birthdate 
		var strElm = '#birthDate_' + getIndexOfElementId(this);
		setDateFirstLicensedDate(strElm);
		showOrHideGoodStdntAwayAtSchlChkBoxes(strElm);
		showOrHideDrvrTrainingChkBoxes(strElm);
		showOrHideAccPrevCrseChkBoxes(strElm);
    });
	
	$(columnPrefix + 'select.clsRelationshipToIns', selector).change(function(){
		addOrDeletePNIOptions();
    });
	
	$(columnPrefix + 'select.clsLicenseStatus', selector).change(function(){
		setLicenseState(this);
		setDriverStatus(this);
		showOrHideDateFirstLicense(this);
		showOrHideOtherCarrier(this);			 
		showOrHideLicOutOfStateOrCountry(this);
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideSr22FilingChkBoxes(this);
    });
	
	$(columnPrefix + 'select.clsDriverStauts', selector).change(function(){
		showOrHideDateFirstLicense(this);
		showOrHideOtherCarrier(this);
		showOrHideLicOutOfStateOrCountry(this);		
		showOrHideGoodStdntAwayAtSchlChkBoxes(this);
		showOrHideDefensiveDriverChkBoxes(this);
		showOrHideAccPrevCrseChkBoxes(this);
		showOrHideSr22FilingChkBoxes(this);
    });
	
	$(columnPrefix + 'select.clsLicOutOfStateOrCountrySelect', selector).change(function(){
		showOrHideListAreas(this);		
    });
	
	$(columnPrefix + 'a.clsEditListAreas', selector).click(function(){
		editListAreas(this);
	});
	
	$(columnPrefix + 'input.clsDefDriverCourseChkBox', selector).change(function(){
		showOrHideDefDriverCourseDt(this);
    });
	
	$(columnPrefix + 'input.clsAccPrevCourseChkBox', selector).change(function(){
		showOrHideAccPrevCourseDt(this);
    });
}

function clearErrorForAddColumn(columnPrefix, selector) {
	//remove inlineError class for all last column copied cells input fields
	//$(selector + columnPrefix.substring (0, (columnPrefix.length - 1) )).removeClass('inlineError');
	var lastColumnCells = $(selector + columnPrefix.substring (0, (columnPrefix.length - 1) ));
	
	lastColumnCells.each(function(){
		$(this).find('input, div').removeClass('inlineError');
		$(this).find('select').removeClass('inlineError').trigger('changeSelectBoxIt');
	});
	
	//remove inlineErrorMsg and clear html for last error cell 
	$('tr.errorRow').each(function(){
		$(this).find('td:last').removeClass('inlineErrorMsg');
		$(this).find('td:last').html('');
	});
	
}

function bindInputValidationEvents(columnPrefix, selector, sAction) {
	
	//bind blur and focus events for optional/required classes
	//to only newly added columns
	var optional = 'Optional';
	
	$('input.optional').each(function(){
		
		if (isNewColumn($(this))) {
			if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		  			if($(this).find('.watermark').length <= 0) {
		  				$(this).val(optional).addClass('watermark');
		  			}
		  		}
			}
		}
	});
	
	$(columnPrefix + 'input.optional', selector).blur(function(){
		if (isNewColumn($(this))) {
			if ($(this).val().length == 0){
				if($(this).find('.watermark').length <= 0) {
	  				$(this).val(optional).addClass('watermark');
	  			}
			}
		}
	});
	
	$(columnPrefix + 'input.optional', selector).focus(function(){
		if (isNewColumn($(this))) {
			if ($(this).val() == optional){
				$(this).val('').removeClass('watermark');
			}
		}
	});
	
	//required classes	
	$('select.required, input.required').each(function(){
		if (isNewColumn($(this))) {
			if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		  			if($(this).find('.preRequired').length <= 0) {
		  				$(this).addClass('preRequired');
		  			}
		  		}
			}
		}
	});
	
	$(columnPrefix + 'select.required, input.required', selector).blur(function(){
		if (isNewColumn($(this))) {
			if ($(this).val().length == 0){
				if($(this).find('.preRequired').length <= 0) {
	  				$(this).addClass('preRequired');
	  			}
			}else{
				$(this).removeClass('preRequired');
			}
			
			//refresh
			if($(this).is('select:not(select[multiple])')){				
  				$(this).trigger(changeSelectBoxIt);
  			}
		}
	});
	
	$(columnPrefix + 'select.required, input.required', selector).focus(function(){
		if (isNewColumn($(this))) {
			$(this).removeClass('preRequired');
		}
	});	
}

function isNewColumn (strElm) {
	return strElm.hasClass("addNewColumn") ? true : false;
}

function bindInputFieldValidations(columnPrefix, selector, sAction) {
	var strErrTag = '';
	var strReqYes = 'Yes';
		
	// license state
	$(columnPrefix + 'select.clsLicenseState', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licenseState.browser.inLine';		
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// license number
	$(columnPrefix + 'input.clsLicenseNumber', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licenseNumber.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateLicenseNumber, addDeleteCallback);
	});
	
	//masked license number.. need to combine with above.
	$(columnPrefix + 'input.clsmMaskedLicNum', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'licenseNumber.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, validateMaskedLicenseNumber, addDeleteCallback);
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
	$(columnPrefix + 'select.clsOtherCarrierSelect', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'otherPolicyCarrName.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
	// occupation
	$(columnPrefix + 'select.clsOccupation', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'occupation.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
	
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
	$(columnPrefix + 'input.clsDefnsDrvngCoursDt', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'defensiveDriverCourseDt.browser.inLine';			
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
	
	$(columnPrefix + '.clsSR22ReqState', selector).bind(getValidationEvent(), function(event, result) {
		strErrTag = 'sr22State.browser.inLine';			
		result.errorCount += validateInputElementWithMap(this, strReqYes, strErrTag, $('#defaultMulti').outerHTML(),
										getColumnIndexNoHeader($(this).parent()), errorMessages, null, addDeleteCallback);										
	});
		
}

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
	
	var errorMessageID = isRequired($(strElement), strRequired);
	
	if (errorMessageID == '') {
		if (validateFieldFunc != null) {
			errorMessageID = validateFieldFunc($(strElement));
		}
	}
	
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	//show or clear error msg
	showClearInLineErrorMsgsWithMap($(strElement).attr("id"), errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
	
	//
	if ($(strElement).is('select:not(select[multiple])')) {
		triggerChangeEvent($(strElement));
	}
	
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
				if ($("#listAreas_" + index  + " .listAreasHiddenVariables").children().length <= 0) {
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
	var errorHeaderRow = $('#' + strRowName  + '_Error' + '_Header');
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
	//$('#relationshipToIns_' + 0).removeAttr('disabled');
	triggerChangeEvent($('#relationshipToIns_' +  0));
	
	addSlidableColumn(event, 'addDelColumn', driverCount,
			$('#slidingFrameId'), $('#mainContentTable'), $('#firstDriver'), DRIVERS_PER_PAGE);

	slideDriverEnd(event);
	// apply the driver column seq numbers
	setDriverColumnHeaderSeqNums();
	
	// clear the added driver column's header drivername
	$('#DriverColumnHeaderDriverFullName' + '_' + addColumnIndex).text("");
	
	// set dafault state to policy state
	var licState = '#licenseState' + '_' + addColumnIndex;
	$(licState).val(getPolicyState());
	triggerChangeSelectBoxItIfSelect($(licState));
	clearLicenseNumber(licState);
	
	// remove primary named insured option
	$("#relationshipToIns_" + addColumnIndex + " option[value='I']").remove();		
	$('#relationshipToIns_' + addColumnIndex).prop('disabled', false);
	triggerChangeEvent($('#relationshipToIns_' + addColumnIndex));
	
	// license number should not be required on quote
	var licNum = '#licenseNumber' + '_' + addColumnIndex;
	if(!isApplicationOrEndorsement()){
		$(licNum).removeClass('preRequired').removeClass('required');
	}
	
	//set driver_id for newly added column since DB is not there
	if ( isEndorsement() ) {
		$('#driverId_' +  addColumnIndex).val(getMaxIdWithIncrement());
		$('#endorsementDriverAddedInd_' + addColumnIndex).val("Yes");
	}
	
	//re-disable
	//$('#relationshipToIns_' + 0).prop('disabled', true);
	//triggerChangeEvent($('#relationshipToIns_' +  0));
	
	
	//SSIRIGINEEDI: Added newly as per discussion with KEN and Sreenath.
	//This will kickoff only in Endorsement MODE. Not sure how this should work in NB.
	//Extended this if needed for NB aswell. 
	if(isEndorsement()){
		
		//if(primary name insured is already selected it should not appear in the new column Being added.
		
		var primaryInsuredSelected = false;
		$('select.clsRelationshipToIns').each(function() {
			
			if( $(this).val() == "I" ) {
				//Primary insured is selected already.. hide this option in new column being added.
				primaryInsuredSelected = true;
			}
		});
		
		if(primaryInsuredSelected){
			$('#relationshipToIns_' +addColumnIndex + " option[value='I']").remove().trigger('changeSelectBoxIt');;
			//$('#relationshipToIns_' +addColumnIndex).find('option[value='I']').remove();
		} else {
			$("#relationshipToIns_" +addColumnIndex +" option:first").after('<option value="I">Primary Name Insured</option>').trigger('changeSelectBoxIt');
		}
		
		setFieldsForEndorsement(addColumnIndex);
	}
		
	showOrHideDriverInfoFields(addColumnIndex);
	showOrHideAddtnllInfoChkBoxes(addColumnIndex);	
	
	bindColumn('multiTable', 'last-child', 'Add');
	
	updateDriverScrollPanel(SCROLL_PANEL);
	
	// set tabindex for added column
	setTabIndex($('#driverCount').val(), $('#driverCount').val());
	

	if(false == isApplication()) {
		var licNum = '#licenseNumber_' + addColumnIndex;
		$(licNum).removeClass('required');
		$(licNum).removeClass('preRequired');
	}
	
	//set focus 	
	$('#licenseState_' + addColumnIndex).focus();
}

function setFieldsForEndorsement(addColumnIndex) {
	// set Active to hidden var of LicenseStatus field
	$('#licenseStatus_' +  addColumnIndex).val("");
	
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
}

function showOrHideDriverInfoFields(columnIndex) {	
	
	// for newly add driver only
	
	if ($('tr.clsDateFirstLicenseRow').is(":visible")) {
		//$("#firstLicUsaDtNA_" + columnIndex).hide();
		showOrHideHtml("#firstLicUsaDtNA_" + columnIndex, 'hide');
	}
	
	if ($('tr.clsOtherCarrierRow').is(":visible")) {
		//$("#otherPolicyCarrName_" + columnIndex).hide();	
		showOrHideHtml("#otherPolicyCarrName_" + columnIndex, 'hide');
	}
	
	if ($('tr.clsLicOutOfStateOrCountryRow').is(":visible")) {
		$("#licOutOfStatePrior3YrsInd_" + columnIndex).val('');
		triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + columnIndex));
		//$("#licOutOfStatePrior3YrsInd_" + columnIndex).hide();
		showOrHideHtml("#licOutOfStatePrior3YrsInd_" + columnIndex, 'hide');
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
		showOrHideHtml("#sr22FilingNA_" + columnIndex, 'show');
		if ($("#sr22Filing_" + columnIndex).is(":checked")) {
			$("#sr22Filing_" + columnIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#sr22Filing_" + lastIndex).trigger('change');
		}
		//$("#sr22Filing_" + columnIndex).hide();
		//$("#sr22State_" + columnIndex).hide();
		showOrHideHtml("#sr22Filing_" + columnIndex, 'hide');		
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
		deleteMsg =  "You requested to delete Driver: " + deletingDriver + ", are you sure you want to delete?";
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

function deleteDriverColumn(deleteLink, columnIndex) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');	
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
		
	var deleteId = $('#driverId_' + (columnIndex), deleteColumn).val();
	
	deleteScrollableColumns(columnIndex, 'multiTable',
			$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
	
	// store deleted ids 
	if (deleteId != "") {
		if ($('#endorsementDriverAddedInd_' + columnIndex).val() != 'Yes') { // This condition need to be reviewed later.....
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
	}
	
	setDriverColumnHeaderSeqNums();	
	
	bindColumn('multiTable', 'gt(' + (parseInt(columnIndex) - 1) + ')', 'Delete');
	
	updateDriverScrollPanel(SCROLL_PANEL);
	
	alignRows();
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
	var strFname = $('#firstName' + '_' + lastIndex).val();
	var strLname = $('#lastName' + '_' + lastIndex).val();
	var strFullName = strFname + ' ' + strLname;
	$('#DriverColumnHeaderDriverFullName' + '_' + lastIndex).text(strFullName);
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
			$('select.' + 'clsMaritalStatus').each(function() {	
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

function acceptLicenseCharsOnly(strElm, e) {	
	//alert(e.keyCode);
	//return;
	
	if ( e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 || 
			e.keyCode == 13 || e.keyCode == 173 ||
            // Allow: Ctrl+A
           (e.keyCode == 65 && e.ctrlKey === true) || 
            // Allow: home, end, left, right
           (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
       }
       else {
    	   //accept alphanumerics and space - *
    	   if ((e.keyCode >= 48 && e.keyCode <= 57) ||
    	   (e.keyCode >= 96 && e.keyCode <= 105) ||
    	   (e.keyCode == 32) ||
    	   (e.keyCode == 189) ||
    	   (e.keyCode == 106) ||
    	   (e.keyCode == 109) ||
    	   (e.keyCode >= 65 && e.keyCode <= 90)) { 
    		   return;
    	   }
    	   else {
    		   //for non ie
			   if(e.preventDefault){     				   
			    	e.preventDefault();    			    	
			    }
			    else{
			    	//for ie
			    	 e.returnValue = false;
			    }   			   
           } 
       }      
      
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
       else {
    	   if ((e.keyCode >= 65 && e.keyCode <= 90) ||
    	   (e.keyCode == 32) || (e.keyCode == 222) || (e.keyCode == 189) ||
    	   (e.keyCode == 55 && e.shiftKey === true)) { 
    		   return;
    	   }
    	   else {
    		   //for non ie
			   if(e.preventDefault){     				   
			    	e.preventDefault();    			    	
			    }
			    else{
			    	//for ie
			    	 e.returnValue = false;
			    }   			   
           } 
       }
}

function acceptNumericsAndSlashes(strElm, e) {
	
	if ( e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 || e.keyCode == 13 || 
            // Allow: Ctrl+A
           (e.keyCode == 65 && e.ctrlKey === true) || 
            // Allow: home, end, left, right
           (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
       }
       else {
    	   if ((e.keyCode >= 48 && e.keyCode <= 57) ||
    	   (e.keyCode >= 96 && e.keyCode <= 105) ||
    	   (e.keyCode == 109) ||
    	   (e.keyCode == 111)) {     	   
    		   return;
    	   }
    	   else {
			   //for non ie
			   if(e.preventDefault){     				   
			    	e.preventDefault();    			    	
			    }
			    else{
			    	//for ie
			    	 e.returnValue = false;
			    }   			   
    	  } 
       }
}

function  clearMaskedValue(strElm, e, strType) {
	
	var maskFldVal = $.trim($(strElm).val());
	
	//Date of Birth	
	if ( (strType == "2") && (maskFldVal.substr(0,6) == "") ) {
		//clear date for any key press except for tab 
		if (e.keyCode != 9)
		{
			$(strElm).val("");
			//clear hidden dob also.
			$("#birthDate_" + getIndexOfElementId(strElm)).val("");
			
		}
	} else if ( (strType == "4") && (maskFldVal.substr(maskFldVal.length-4, 4) == "****") ) {
		if (e.keyCode != 9)
		{
			$(strElm).val("");
			//clear hidden lic number also.
			$("#licenseNumber_" + getIndexOfElementId(strElm)).val("");
			
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

function setDateFirstLicensedDate(strElm) {
	// set DOB+16 for data first us licensed date automatically for non MA only
	if (getPolicyState() != STATE_MA) {		
		var lastIndex = getIndexOfElementId(strElm);
		//var birthDate = $('#birthDate_' + lastIndex).val();
		var birthDate = $(strElm).val();
		
		if (birthDate != '') {
			//check if date is valid or not
			var blnIsValidDate = validateDtAndFutureDt(strElm);
			if (blnIsValidDate) {
				var strMMDD = birthDate.substr(0,6);
				var strYear = birthDate.substr(6,4);
				strYear = parseInt(strYear) + 16;
				var strNewDate = strMMDD + strYear;			
				
				$('#firstLicUsaDt_' + lastIndex).val(strNewDate);
			}
			else {
				$('#firstLicUsaDt_' + lastIndex).val("");
			}
			
		}
		else {
			$('#firstLicUsaDt_' + lastIndex).val("");
		}
	}
}

var validateInputDate = function (strElm) {	
	
	var blnIsValidDate = validateDtAndFutureDt(strElm);
	if (!blnIsValidDate) {
		$(strElm).val(""); 
		return 'invalid';
	}
	else {
		return '';
	}
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
		var intAge = calculateAge($(strElm).val());
		if (parseInt(intAge) > 110) {			
			msg = 'driverCannotBeOlderThan110Years';
		}
	}
	
	// clear birth date and dependant field(s)
	if (msg != '') {
		//$(strElm).val("");
		if (getPolicyState() != STATE_MA) { $('#firstLicUsaDt_' + lastIndex).val(""); }
	}
	
	return msg;
};

var validateMaskedBirthDate = function (strElmnt) {
	var lastIndex = getIndexOfElementId(strElmnt);

	var hdnField = '#birthDate_' + lastIndex;
	
	populateDOBHiddenVar(strElmnt, hdnField);

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
		var intAge = calculateAge($(strElm).val());
		if (parseInt(intAge) > 110) {			
			msg = 'driverCannotBeOlderThan110Years';
		}
	}
	
	// clear only dependant field(s)
	if (msg != '') {
		//$(strElm).val("");
		if (getPolicyState() != STATE_MA) { $('#firstLicUsaDt_' + lastIndex).val(""); }
	}
	
	return msg;
};

function populateDOBHiddenVar(maskField, hdnField){
	var maskFldVal = $.trim($(maskField).val());	
	
	//populate hidden var if masked data is changed	
	if( (maskFldVal == "") || (maskFldVal.substr(0,6) != "") ){
		$(hdnField).val(maskFldVal);			
	}
}

var validateLicAndDriverStatuses = function (strElm) {
	
	if (isValidLicAndDriverStatusCombo (strElm)) {
		return '';
	} else {
		return 'invalidLicAndDriverStatus';
	}
		
};

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
	 
	if (defDrvngCrseDt < policyEffDt) {
		var months = getMonthsDifference($(strElm).val(), $("#policyEffDt").val());
		if (parseInt(months) > 36) {
			return 'cannotBeGreaterThan36MonthsPrior';
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
	 
	if (accPrevCrseDt < policyEffDt) {
		var months = getMonthsDifference($(strElm).val(), $("#policyEffDt").val());
		if (parseInt(months) > 36) {
			return 'cannotBeGreaterThan36MonthsPrior';
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
    else {
    	return true;
    }
} 

var validateLicenseNumber = function (strElm) {
	var lastIndex = getIndexOfElementId(strElm); 
	var strLicNum = trimSpaces($(strElm).val());
	var strLicstate = trimSpaces(getLicenseState(lastIndex));
	var strFormat1 = '';
	var strFormat2 = '';
	var strMsg = '';
	
	switch(strLicstate) {
		case STATE_MA:
			strFormat1 = /^[a-zA-Z]{1}\d{8}$/;
			strFormat2 = /^(\d){9}$/;
	    	break;
	    case STATE_NJ:
	    	strFormat1 = /^[a-zA-Z]{1}\d{14}$/;
	    	break;
	    case STATE_CT: case STATE_NY:
	    	strFormat1 = /^(\d){9}$/;	    	
	    	break;
	    case STATE_PA:
	    	strFormat1 = /^(\d){8}$/;
	    	break;
	    case STATE_RI:
	    	strFormat1 = /^(\d){7}$/;
	    	break;
	    case STATE_NH:
	    	strFormat1 = /^(\d){2}[a-zA-Z]{3}\d{5}$/;
	    	break;
	    default:
	    	strFormat1 = /^[0-9a-zA-Z -*]+$/;
	}
	
	if (strLicstate != STATE_MA) {
		if( strLicNum != '' && strFormat1 != '' ) {
			if ( !strFormat1.test(strLicNum) ) { 
				strMsg = "notValidLicNumber";
			//	$(strElm).val("");				
			}
		}
	} else if (strLicstate == STATE_MA) {
		if( strLicNum != '' && strFormat1 != '' && strFormat2 != '') {
			if ( !strFormat1.test(strLicNum) && !strFormat2.test(strLicNum)) {
				strMsg = "notValidLicNumber";
			//	$(strElm).val("");
			}
		}
		
	}
	
	return strMsg;
};

var validateMaskedLicenseNumber = function (strElmnt) {
	var lastIndex = getIndexOfElementId(strElmnt); 
	
	var hdnField = '#licenseNumber_' + lastIndex;
	populateLicHiddenVar(strElmnt, hdnField);
	
	// now validate hidden lic num field
	var strElm = hdnField;
	
	var strLicNum = trimSpaces($(strElm).val());
	var strLicstate = trimSpaces(getLicenseState(lastIndex));
	var strFormat1 = '';
	var strFormat2 = '';
	var strMsg = '';
	
	switch(strLicstate) {
		case STATE_MA:
			strFormat1 = /^[a-zA-Z]{1}\d{8}$/;
			strFormat2 = /^(\d){9}$/;
	    	break;
	    case STATE_NJ:
	    	strFormat1 = /^[a-zA-Z]{1}\d{14}$/;
	    	break;
	    case STATE_CT: case STATE_NY:
	    	strFormat1 = /^(\d){9}$/;	    	
	    	break;
	    case STATE_PA:
	    	strFormat1 = /^(\d){8}$/;
	    	break;
	    case STATE_RI:
	    	strFormat1 = /^(\d){7}$/;
	    	break;
	    case STATE_NH:
	    	strFormat1 = /^(\d){2}[a-zA-Z]{3}\d{5}$/;
	    	break;
	    default:
	    	strFormat1 = /^[0-9a-zA-Z -*]+$/;
	}
	
	if (strLicstate != STATE_MA) {
		if( strLicNum != '' && strFormat1 != '' ) {
			if ( !strFormat1.test(strLicNum) ) { 
				strMsg = "notValidLicNumber";
			//	$(strElm).val("");				
			}
		}
	} else if (strLicstate == STATE_MA) {
		if( strLicNum != '' && strFormat1 != '' && strFormat2 != '') {
			if ( !strFormat1.test(strLicNum) && !strFormat2.test(strLicNum)) {
				strMsg = "notValidLicNumber";
			//	$(strElm).val("");
			}
		}
		
	}
	
	return strMsg;
};

function populateLicHiddenVar(maskField, hdnField) {
	var maskFldVal = $.trim($(maskField).val());	
	
	//populate hidden var if masked data is changed	
	if( (maskFldVal == "") || (maskFldVal.substr(maskFldVal.length-4, 4) != "****") ){
		$(hdnField).val(maskFldVal);			
	}
};

function setDriverStatus(strElm) {
	
	var lastIndex = getIndexOfElementId(strElm);
	var strLicStatus = $("#licenseStatus_" + lastIndex).val();
	
	switch(strLicStatus) {
	    case ACTIVE:
	    	//Active
	    	$("#driverStatus_" + lastIndex).val(INSURED_ON_THIS_POLICY);
	    	break;
	    case SUSPENDED_LICENSE:
	    	//Suspended
	    	$("#driverStatus_" + lastIndex).val(SUSPENDED_OPERATOR);	    	
	    	break;
	    case REVOKED_LICENSE:
	    	//Revoked
	    	$("#driverStatus_" + lastIndex).val(REVOKED_OPERATOR);
	    	break;
	    case EXPIRED_LICENSE: case NO_LONGER_LICENSED:
	    	//Expired or No longer licensed
	    	$("#driverStatus_" + lastIndex).val(NO_LONGER_LICENSED);
	    	break;	    
	    case NEVER_LICENSED:
	    	//Never licensed
	    	$("#driverStatus_" + lastIndex).val(NEVER_LICENSED);
	    	break;
	    case PERMIT:
	    	//Permit
	    	$("#driverStatus_" + lastIndex).val(PERMIT);
	    	break;
	}
	
	//remove prerequired class
	$("#driverStatus_" + lastIndex).removeClass("preRequired");
	
	triggerChangeEvent($("#driverStatus_" + lastIndex));
	
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
		//$('.' + 'clsDateFirstLicenseRow').show();
		showOrHideDrvrTableRow('clsDateFirstLicenseRow', 'show'); 
		//$("#firstLicUsaDt_" + lastIndex).show();
		showOrHideHtml("#firstLicUsaDt_" + lastIndex, 'show');
		return;
	}
	else {
		//$("#firstLicUsaDt_" + lastIndex).hide();
		showOrHideHtml("#firstLicUsaDt_" + lastIndex, 'hide');
		clearColumnInLineError("#firstLicUsaDt_" + lastIndex);
	}	
	
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

function showOrHideLicenseStatus(strElm) { 
	var lastIndex;		
	var strPolicyState;	
		
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();	
	
	//In endorsement show only MA or else hide for non MA
	if ((isEndorsement())
	&& (strPolicyState == STATE_MA)) {		
		showOrHideDrvrTableRow('clsLicenseStatusRow', 'show');
		showOrHideHtml("licenseStatus_" + lastIndex, 'show');		
		return;	}
	else {		
		showOrHideHtml("licenseStatus_" + lastIndex, 'hide');
		clearColumnInLineError("licenseStatus_" + lastIndex);
	}
	
	// show or hide LicenseStatus row	
	var blnShowRow = false;
	
	if ( (isEndorsement())
	&&   (strPolicyState == STATE_MA) ) {
		 blnShowRow = true;
	}
		
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsLicenseStatusRow', 'show');
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
		
		//$("#otherPolicyCarrNameNA_" + lastIndex).hide();
		//$('.' + 'clsOtherCarrierRow').show();
		//$("#otherPolicyCarrName_" + lastIndex).show();		
		showOrHideDrvrTableRow('clsOtherCarrierRow', 'show');
		showOrHideHtml("#otherPolicyCarrName_" + lastIndex, 'show');
		
		return;
	}
	else {
		
		//$("#otherPolicyCarrNameNA_" + lastIndex).show();
		//$("#otherPolicyCarrName_" + lastIndex).hide();	
		showOrHideHtml("#otherPolicyCarrName_" + lastIndex, 'hide');
		clearColumnInLineError("#otherPolicyCarrName_" + lastIndex);
	}
	
	// show or hide other carrier row
	////showOrHideFieldRow('clsOtherCarrierRow', 'clsOtherCarrierSelect');
	var blnShowRow = false;
	
	$('select.clsOtherCarrierSelect').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strDrvrStatus = getDrvrStatus(lastIndex);
		 
		 if ((isApplicationOrEndorsement())
		 && (strDrvrStatus == INSURED_ELSE_WHERE)
		 && (strPolicyState == STATE_CT || strPolicyState == STATE_NH 
			 || strPolicyState == STATE_NJ || strPolicyState == STATE_MA)) {
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

function showOrHideOccupation(strElm) { 
	var lastIndex;		
	var strPolicyState;
			
	lastIndex = getIndexOfElementId(strElm);
	strPolicyState = getPolicyState();
		
	if ((isApplicationOrEndorsement())
	&& (strPolicyState != STATE_MA)) {
		//$("#occupationNA_" + lastIndex).hide();
		//$('.' + 'clsOccupationRow').show();
		//$("#occupation_" + lastIndex).show();
		showOrHideDrvrTableRow('clsOccupationRow', 'show');
		showOrHideHtml("#occupation_" + lastIndex, 'show');
		return;
	}
	else {
		
		//$("#occupationNA_" + lastIndex).show();
		//$("#occupation_" + lastIndex).val("");
		triggerChangeEvent($("#occupation_" + lastIndex));
		//$("#occupation_" + lastIndex).hide();		
		showOrHideHtml("#occupation_" + lastIndex, 'hide');
	}
	
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

function showOrHideLicOutOfStateOrCountry(strElm) { 
	var lastIndex;	
	var strLicState;	
	
	lastIndex = getIndexOfElementId(strElm);
	strLicState = getLicenseState(lastIndex);
	
	//  MA
	if (getPolicyState() == STATE_MA) {
		if ((strLicState == STATE_MA) && (isRated(lastIndex) || isDeferred1(lastIndex))) {			
			showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'show');
			
			//set default value if empty
			if ($("#licOutOfStatePrior3YrsInd_" + lastIndex).val() == '') {
				$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("No");
				triggerChangeEvent($("#licOutOfStatePrior3YrsInd_" + lastIndex));
				clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
			}
		}
		else if ((strLicState != '') && (strLicState != STATE_MA) && (isRated(lastIndex))) {			
			showOrHideDrvrTableRow('clsLicOutOfStateOrCountryRow', 'show');			
			showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'show');
			
			//set default value if empty
			if ($("#licOutOfStatePrior3YrsInd_" + lastIndex).val() == '') {
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
			
			//set default value if empty
			if ($("#licOutOfStatePrior3YrsInd_" + lastIndex).val() == '') {
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
		$("#licOutOfStatePrior3YrsInd_" + lastIndex).removeClass("preRequired");
	}
	
	// always hide the field for newly added endoresment driver
	if ( isEndorsementAddedDriver(lastIndex) ) {
		$("#licOutOfStatePrior3YrsInd_" + lastIndex).val("");
		showOrHideHtml("#licOutOfStatePrior3YrsInd_" + lastIndex, 'hide');
		clearColumnInLineError("#licOutOfStatePrior3YrsInd_" + lastIndex);
	}
	
	// show or hide Lic out of state or country row 	
	var blnShowRow = false;
	
	$('select.clsLicOutOfStateOrCountrySelect').each(function() {		
		 lastIndex = getIndexOfElementId(this);
		 strLicState = getLicenseState(lastIndex);
		 
		 // check each driver if not a newly added endorsement driver
		 if ( !isEndorsementAddedDriver(lastIndex) ) {
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
		 }
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
	else {
		//clear List areas first
		 deleteListAreas(lastIndex);
		 
		//hide		
		$("#listAreas_" + lastIndex).css('display', 'none');
		$("#listAreas_" + lastIndex).parent().css('display', 'none');
		clearColumnInLineError("#listAreas_" + lastIndex);
	}
	
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
	var elmDt;
	var elmDtVal;	
	//var strDrvrStatus;	
	var blnIsValid;
	var intAge;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#firstLicUsaDt_" + lastIndex);
	elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
	//strDrvrStatus = getDrvrStatus(lastIndex);
	blnIsValid = validateDateEntry(elmDt);
	
	if ((elmDtVal == '') || (!blnIsValid)) {	
		// Good student
		//$("#goodStudentNA_" + lastIndex).show();
		showOrHideHtml("#goodStudentNA_" + lastIndex, 'show');
		
		if ($("#goodStudent_" + lastIndex).is(":checked")) {
			$("#goodStudent_" + lastIndex).attr('checked', false);
		}
		//$("#goodStudent_" + lastIndex).hide();
		showOrHideHtml("#goodStudent_" + lastIndex, 'hide');
		
		// Away at school
		//$("#awayAtSchoolNA_" + lastIndex).show();
		showOrHideHtml("#awayAtSchoolNA_" + lastIndex, 'show');
		if ($("#awayAtSchool_" + lastIndex).is(":checked")) {
			$("#awayAtSchool_" + lastIndex).attr('checked', false);
		}
		//$("#awayAtSchool_" + lastIndex).hide();
		showOrHideHtml("#awayAtSchool_" + lastIndex, 'hide');
	}
	else {
		
		// check if date first license is less than 6 years		
		intAge = calculateAge(elmDtVal);
		// updated the condition to rated operator check
		if ((parseInt(intAge) < 6) && (isRated(lastIndex))) {
			// Good student			
			showOrHideHtml("#goodStudentNA_" + lastIndex, 'hide');
			showOrHideDrvrTableRow('clsGoodStudentRow', 'show');
			showOrHideHtml("#goodStudent_" + lastIndex, 'show');
			
			// Away at school					
			showOrHideHtml("#awayAtSchoolNA_" + lastIndex, 'hide');
			showOrHideDrvrTableRow('clsAwayAtSchoolRow', 'show');
			showOrHideHtml("#awayAtSchool_" + lastIndex, 'show');			
		}
		else {
			// Good student
			//$("#goodStudentNA_" + lastIndex).show();
			showOrHideHtml("#goodStudentNA_" + lastIndex, 'show');
			if ($("#goodStudent_" + lastIndex).is(":checked")) {
				$("#goodStudent_" + lastIndex).attr('checked', false);
			}
			//$("#goodStudent_" + lastIndex).hide();
			showOrHideHtml("#goodStudent_" + lastIndex, 'hide');
			
			// Away at school
			//$("#awayAtSchoolNA_" + lastIndex).show();
			showOrHideHtml("#awayAtSchoolNA_" + lastIndex, 'show');
			if ($("#awayAtSchool_" + lastIndex).is(":checked")) {
				$("#awayAtSchool_" + lastIndex).attr('checked', false);
			}
			//$("#awayAtSchool_" + lastIndex).hide();
			showOrHideHtml("#awayAtSchool_" + lastIndex, 'hide');
		}
	}
	
	var blnShowRow = false;
	
	$('.clsGoodStudentChkBox, .clsAwayAtSchoolChkBox').each(function() {		
		lastIndex = getIndexOfElementId(this);
		elmDt = $("#firstLicUsaDt_" + lastIndex);
		elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
		//strDrvrStatus = getDrvrStatus(lastIndex);
		blnIsValid = validateDateEntry(elmDt);
		 
		if ((elmDtVal != '') && (blnIsValid)) {
			//elmDtVal = elmDtVal.substr(6,4) + '-' + elmDtVal.substr(0,2) + '-' + elmDtVal.substr(3,2) ;
			intAge = calculateAge(elmDtVal);
			
			if ( (parseInt(intAge) < 6) && (isRated(lastIndex)) ) {
				blnShowRow = true;
				return true;
			}
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

function showOrHideDrvrTrainingChkBoxes(strElm) {
	var lastIndex;
	// get date first license element
	var elmDt;
	var elmDtVal;		
	var blnIsValid;
	var intAge;
	
	lastIndex = getIndexOfElementId(strElm);
	elmDt = $("#firstLicUsaDt_" + lastIndex);
	elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
	blnIsValid = validateDateEntry(elmDt);
	
	
	if ((elmDtVal == '') || (!blnIsValid)) {	
		//$("#drvrTrainingNA_" + lastIndex).show();
		showOrHideHtml("#drvrTrainingNA_" + lastIndex, 'show');
		
		if ($("#drvrTraining_" + lastIndex).is(":checked")) {
			$("#drvrTraining_" + lastIndex).attr('checked', false);
		}
		//$("#drvrTraining_" + lastIndex).hide();	
		showOrHideHtml("#drvrTraining_" + lastIndex, 'hide');
	}
	else {
		
		// check if date first license is less than 3 years		
		intAge = calculateAge(elmDtVal);
		if (parseInt(intAge) < 3) {					
			showOrHideHtml("#drvrTrainingNA_" + lastIndex, 'hide');
			showOrHideDrvrTableRow('clsDrvrTrainingRow', 'show');
			showOrHideHtml("#drvrTraining_" + lastIndex, 'show');			
		}
		else {			
			//$("#drvrTrainingNA_" + lastIndex).show();
			showOrHideHtml("#drvrTrainingNA_" + lastIndex, 'show');
			if ($("#drvrTraining_" + lastIndex).is(":checked")) {
				$("#drvrTraining_" + lastIndex).attr('checked', false);
			}
			//$("#drvrTraining_" + lastIndex).hide();
			showOrHideHtml("#drvrTraining_" + lastIndex, 'hide');
		}
	}
	
	// show or hide the driver training row
	//showOrHideFieldRow('clsDrvrTrainingRow', 'clsDrvrTrainingChkBox');
	
	var blnShowRow = false;
	
	$('.clsDrvrTrainingChkBox').each(function() {		
		lastIndex = getIndexOfElementId(this);
		elmDt = $("#firstLicUsaDt_" + lastIndex);
		elmDtVal = $("#firstLicUsaDt_" + lastIndex).val();
		blnIsValid = validateDateEntry(elmDt);
		
		if ((elmDtVal != '') && (blnIsValid)) {
			// check if date first license is less than 3 years			
			intAge = calculateAge(elmDtVal);
			
			if (parseInt(intAge) < 3) {	
				blnShowRow = true;
				return true;
			}
		}
	});
	
	if (blnShowRow) {		
		showOrHideDrvrTableRow('clsDrvrTrainingRow', 'show');
	}
	else {		
		showOrHideDrvrTableRow('clsDrvrTrainingRow', 'hide');
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
	else {			
		//$("#defenseDrvrCourseNA_" + lastIndex).show();
		showOrHideHtml("#defenseDrvrCourseNA_" + lastIndex, 'show');
		if ($("#defenseDrvrCourse_" + lastIndex).is(":checked")) {
			$("#defenseDrvrCourse_" + lastIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#defenseDrvrCourse_" + lastIndex).trigger('change');
		}
		//$("#defenseDrvrCourse_" + lastIndex).hide();
		showOrHideHtml("#defenseDrvrCourse_" + lastIndex, 'hide');
	}
	
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

function showOrHideDefDriverCourseDt(strElm) {
	var lastIndex = getIndexOfElementId(strElm);
	
	// hide for full quote and non NJ
	if (!isApplicationOrEndorsement() || (getPolicyState() != STATE_NJ)) {
		// hide DefDriverCourseDt row always
		//$('.' + 'clsDefDrvCourseDtRow').hide();
		showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'hide');
		return false;
	}
	
	if ($(strElm).is(":checked")){
		//if ($("#defensiveDriverCourseDt_" + lastIndex).is(':hidden')) {
			//$('.' + 'clsDefDrvCourseDtRow').show();
			//$("#defensiveDriverCourseDt_" + lastIndex).show();
			showOrHideDrvrTableRow('clsDefDrvCourseDtRow', 'show');
			showOrHideHtml("#defensiveDriverCourseDt_" + lastIndex, 'show');
		//}
    }
	else {
		$("#defensiveDriverCourseDt_" + lastIndex).val("");
		//if ($("#defensiveDriverCourseDt_" + lastIndex).is(':visible')) {
			//$("#defensiveDriverCourseDt_" + lastIndex).hide();
			showOrHideHtml("#defensiveDriverCourseDt_" + lastIndex, 'hide');
		//}
	}
	
	// show or hide the dependant row
	showOrHideDependentFieldRow('clsDefDrvCourseDtRow', 'clsDefDriverCourseChkBox');
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
	else {
		
		// check if age is >= 60 years and policy state is CT		
		intAge = calculateAge(elmDtVal);
		if ((parseInt(intAge) >= 60) && (getPolicyState() == STATE_CT) && (getDrvrStatus(lastIndex) == 'R')) {	
			
			$("#accidentPrvntCourseNA_" + lastIndex).hide();
			$('.' + 'clsAccPrvCourseRow').show();
			$("#accidentPrvntCourse_" + lastIndex).show();	
			
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
			//elmDtVal = elmDtVal.substr(6,4) + '-' + elmDtVal.substr(0,2) + '-' + elmDtVal.substr(3,2) ;
			intAge = calculateAge(elmDtVal);
			if ((parseInt(intAge) >= 60) && (getPolicyState() == STATE_CT) && (getDrvrStatus(lastIndex) == 'R')) {
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
		//$('.' + 'clsAccPrvCourseDtRow').hide();
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'hide');
		return false;
	}

	if ($(strElm).is(":checked")) {
		//$('.' + 'clsAccPrvCourseDtRow').show();
		//$("#accidentPrvntCourseDt_" + lastIndex).show();	
		showOrHideDrvrTableRow('clsAccPrvCourseDtRow', 'show');
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'show');
    }
	else {
		$("#accidentPrvntCourseDt_" + lastIndex).val("");		
		//$("#accidentPrvntCourseDt_" + lastIndex).hide();
		showOrHideHtml("#accidentPrvntCourseDt_" + lastIndex, 'hide');
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
		
		$("#sr22FilingNA_" + lastIndex).hide();
		$('.' + 'clsSr22FilingRow').show();
		$("#sr22Filing_" + lastIndex).show();
		
		showOrHideHtml("#sr22FilingNA_" + lastIndex, 'hide');
		showOrHideDrvrTableRow('clsSr22FilingRow', 'show');
		showOrHideHtml("#sr22Filing_" + lastIndex, 'show');
	}
	else {			
		//$("#sr22FilingNA_" + lastIndex).show();
		showOrHideHtml("#sr22FilingNA_" + lastIndex, 'show');
		if ($("#sr22Filing_" + lastIndex).is(":checked")) {
			$("#sr22Filing_" + lastIndex).attr('checked', false);
			//trigger change event for checkbox to show/hide dependant row
			$("#sr22Filing_" + lastIndex).trigger('change');
		}
		//$("#sr22Filing_" + lastIndex).hide();
		showOrHideHtml("#sr22Filing_" + lastIndex, 'hide');
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
		//$('.' + 'clsSr22RequestingStateRow').show();
		//$("#sr22State_" + lastIndex).show();	
		showOrHideDrvrTableRow('clsSr22RequestingStateRow', 'show');
		showOrHideHtml("#sr22State_" + lastIndex, 'show');
	}
	else {
		$("#sr22State_" + lastIndex).val("");
		triggerChangeEvent($("#sr22State_" + lastIndex));
		//$("#sr22State_" + lastIndex).hide();	
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
		//$('.' + rowClass).show();
		showOrHideDrvrTableRow(rowClass, 'show');
	}
	else {
		//$('.' + rowClass).hide();
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
	// INSURED ON THE POLICY OR SUSPENDED OPERATOR
	if (strDrvrSatus == 'INS_POL' || strDrvrSatus == 'R') {
		return true;
	}
	else {
		return false;
	}	
}

function isDeferred1(index) {
	var strDrvrSatus = $("#driverStatus_" + index).val();
	//Insured on Another PRAC Policy or Insured Elsewhere or Revoked Operator or No Longer Licensed
	if (strDrvrSatus == 'Y' || strDrvrSatus == 'W' || strDrvrSatus == 'RO' || strDrvrSatus == 'NLL') {
		return true;
	}
	else {
		return false;
	}	
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
	//var strPolicyState = $("#policyStateCd").val();
	var strPolicyState = $("#stateCd").val();
	return strPolicyState;
	
}

function calculateAge(strDate) {
	
	var today = new Date();
	var dd = parseInt(today.getDate());
	var mm = parseInt(today.getMonth()+1);
	var yyyy = parseInt(today.getFullYear()); 

	var myBDM = parseInt(strDate.split("/")[0]);
	var myBDD = parseInt(strDate.split("/")[1]);
	var myBDY = parseInt(strDate.split("/")[2]);
	var age = yyyy - myBDY;
    if(mm < myBDM)
    {
    	age = age - 1;      
    }
    else if(mm == myBDM && dd < myBDD)
    {
    	age = age - 1;
    };
	    
    return age;
}



function setAndDisableRelationshipToPNI() {
	var lastIndex;
	
    $('select.clsRelationshipToIns').each(function() {		
		lastIndex = getIndexOfElementId($(this));
		
		if ($('#participantRole_' + lastIndex).val() == 'PRIMARY_INSURED') {
			$(this).val("I");
             if ( !isEndorsement() ) {
                $(this).prop('disabled', true);
             }

			//$(this).prop('disabled', true);
			triggerChangeEvent($(this));			
			//$(this).attr({"disabled": true});
		}
		else {
            // just remove "I" from drodown options.
            if ( !isEndorsement() ) {
                    $("#" + $(this).attr("id") + " option[value='" + "I" + "']").remove();
                    triggerChangeEvent($(this));
            }
        }


	});
}

function deleteLicSatatusOptions(strElm) {
	if (getPolicyState() != STATE_MA) {	
		$("#" + $(strElm).attr("id") + " option[value='" + "C" + "']").remove();
		$("#" + $(strElm).attr("id") + " option[value='" + "D" + "']").remove();
		triggerChangeEvent($(strElm));
	}
}

function addOrDeletePNIOptions() {
	addOrDeleteOption("S", "Spouse");
	addOrDeleteOption("D", "Domestic Partner");
}

function addOrDeleteOption(optVal, optDesc) {
	var selectedElmId = '';
	var blnOptionSelected = false;
	
	$('select.clsRelationshipToIns').each(function() {		
		if ($(this).val() == optVal) {
			blnOptionSelected = true;
			selectedElmId = $(this).attr("id");
			return true;
		}
	});
	
	if (blnOptionSelected) {
		removeOptionForOtherDrivers(optVal,  selectedElmId);
	}
	else {
		addOptionForAllDrivers(optVal, optDesc);
	}
}

function removeOptionForOtherDrivers (optionVal, selectedId) {
	$('select.clsRelationshipToIns').each(function() {
		
		if ($(this).attr("id") != selectedId) {
			//$(this).find( "option[value='" + optionVal + "']" ).remove();
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

function editListAreas(strElm) {
	
	var index = getIndexOfElementId(strElm);
	
	$("#listAreasDriverIndex").val(index);
	$('#listAreasDriverHeader').html(getDriverHeader(index));
	
	$(".listAreaCheckbox").each(function() {		
		var selectedItem = $("#listArea_" + index + "_" + this.id);		
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
		alert("Check no more than 2.");
		return false;
	}
	else {
		return true;
	}
}

function saveListAreas() {
		
	var index =  $("#listAreasDriverIndex").val();
	
	//clear hidden vars first
	deleteListAreas(index);
	
	var hiddenElementsToAdd = '';	
	var selectedCount = 0;
	
	$(".listAreaCheckbox").each(function() {
		var itemChecked = $(this).prop('checked');
		if (itemChecked) {
			var element = '<input id="listArea_' + index + '_' +  this.id  + '"'
		     	+ ' name="drivers[' + index + '].listAreaCodes[' + selectedCount + ']"'
		     	+ ' type="hidden" value="' + this.id + '"/>';
			
			hiddenElementsToAdd += element;
			selectedCount++;
		}
	});
	
	if (hiddenElementsToAdd.length > 0) {
		$("#listAreas_" + index  + " .listAreasHiddenVariables").html(hiddenElementsToAdd);
	}
	
	$("#listAreas_" +  index + " .listAreasSelectedDetails" + " .listAreasSelectedCountDesc").text(selectedCount  + " selected");
	
	validateListAreasSelectionSave();
	
	//close
	cancelListAreas();
	
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
	$("#listAreas_" +  lastIndex + " .listAreasSelectedDetails" + " .listAreasSelectedCountDesc").text("0 selected");
	
	// remove the hidden vars
	$("#listAreas_" + lastIndex  + " .listAreasHiddenVariables").empty();
}

function cancelListAreas() {
	
	$("#listAreasDriverIndex").val('');
	$("#listAreasDlg").modal('hide');	
}

function getDriverHeader(index) {
	
	var strDrvrSeqNum = $("#DriverColumnHeaderSeqNum_" + index).text();
	var strDrvrName = $("#DriverColumnHeaderDriverFullName_" + index).text();
	var strDriverHeaderInfo = '<b>' + ' ' + strDrvrSeqNum + strDrvrName + '</b>';
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
function trimSpaces(strVal) {
	return jQuery.trim(strVal);
}

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
	strElm.trigger("changeSelectBoxIt");
}

function handleSubmit(e) {	
	enableFields();		
	setDriversSeqNums();	
	setLicCountryCode();
	clearOptionalValues();		
	//commented as handled in common.js file
	//setMvrDataUpdatedIndicator('drivers');	

	//final check for valid date format's
	// clean fields that do not have valid formats
	$('input.clsBirthDate').each(function() {		
		checkInvalidDateFormats('#' + this.id);
	});
	
	//finally set prefilldata updated indicator
	setPrefillDataUpdatedIndicator('drivers');	
}

function setTabIndex(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);
	
	for (var i = startColumn; i <= endColumn; i++) {
		var tabOrderElements = $("#mainContentTable > tbody > tr > td:nth-child(" + (i) + ") .tabOrder");
		tabOrderElements.each(function() {
	        $(this).attr("tabindex", tabIndex++);			
		});
	}
	
	//set tab index for next button finally
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
	var licNum = '#licenseNumber_' + lastIndex;
	
	if ($(strElm).val() == NOT_LICENSED){			
		$(licNum).val("");
		// clear any error
		clearColumnInLineError(licNum);
		disableDataField(licNum);
	} else {
		enableDataField(licNum);
	}	
}

function enableDataField (strElm) {
	$(strElm).prop('disabled', false);
	triggerChangeSelectBoxItIfSelect($(strElm));	
}

function disableDataField (strElm) {
	$(strElm).prop('disabled', true);	
	triggerChangeSelectBoxItIfSelect($(strElm));	
}

function triggerChangeSelectBoxItIfSelect(strElm) {
	if (strElm.is('select:not(select[multiple])')) {
		strElm.trigger("changeSelectBoxIt");
	}
}

function disableForExistingDriver(strElm) {
	//disable if only p* existing driver
	var lastIndex = getIndexOfElementId(strElm);
	
	if ( !isEndorsementAddedDriver(lastIndex) ) {
		disableDataField(strElm);		
	}
}

function isEndorsementAddedDriver(lastIndex) {
	return $("#endorsementDriverAddedInd_" + lastIndex).val() == 'Yes'  ? true : false;
}

function isElementExisting(strElm) {
	return ($(strElm).length > 0) ? true : null;
}

function chkIfLicNumIsRequired(){
	$('input.clsLicenseNumber, input.clsmMaskedLicNum').each(function(){
		var licNum = this;
		if(!isApplicationOrEndorsement() && $(licNum).hasClass('required')) {
			$(licNum).removeClass('preRequired').removeClass('required');
		}
 	});
}

*/