

// REFER vehicleTab-enchanced.js



/*jQuery(document).ready(function() {
	
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	
	showOrHidePrefillLink();
	
	//Based on the QUOTE or Endorsement certain rows shouldn't should show up. Refer Policy isApplicationOrEndorsement()
	
	if(!isApplicationOrEndorsement()) {
		$('.additionalInterests_Row, .garagingZipCode_Row , .preInspectionRequiredDesc_Row , .snowplowEquipInd_Row').each(function() {
			$(this).remove();
		});
	}
	// Replace functions exists for Endorsement only.
	if( !isEndorsement()) {
		$('#mainContentTableHead .clsReplaceVehicle').remove();
	}
	
	//Bind Navigation Buttons  
	$("#newVehicle").click(function(event){
		addVehicle(event);
		
		//adding a Vehicle should reset premium on RATE BUTTON
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);		
	});
	
	$("#allVehicleLookup").click(function(){
		lookupVehicles();
	});
	
	$(".expandCollapseRows").click(function(){
		expandCollapseRows(this.id);
	});
		 
	//header adjustments
//	$('#' + pageAlertDivName).attr("style", "padding: 25px 0 0px 30px;");
//	$('#' + mainContentDivName).attr("style", "margin-top: 186px;");

	updateVehicleScrollPanel('#scrollPanel');
	var firstVehicleVal;	
	$("#startVehicleScrollBtn")
		.click(function(event){
					slideThisVehicleStart(event);			
					});
	$("#leftVehicleScrollBtn")
		.click( function(event){ 
					slideThisVehicleLeft(event);
					})
		.hover( function(event){
					this.iid = setInterval(function() { slideThisVehicleLeft(event);}, 525); },
				function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightVehicleScrollBtn")
		.click( function(event){ 
					slideThisVehicleRight(event);
					})
		.hover( function(event){
					this.iid = setInterval(function() { slideThisVehicleRight(event);}, 525); },
				function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endVehicleScrollBtn")
		.click(function(event){
					slideThisVehicleEnd(event);
					});
	
*//**
	$(document).scroll(function(){
	    $('#headerDiv').css({
	        'top': $(this).scrollTop() + 15
	    });
	});
**//*
	
	$('.swappableField').each(function() {
		setupSwappableDropDown(this);
	});
	
	$('#aiForm').bind(getSubmitFailureEvent(), function(event, result){		
		handleSubmitFailure(result);
	});
	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
		handleSubmit(event);
	});
	
	// Dialogs
	$('#reverseVINDlg').modal('hide');
	$('#saveReverseVIN').click(function(){
		saveReverseVIN();
		return false;
	});
	$('#cancelReverseVIN').click(function(){
		cancelReverseVIN();
	});

	$('#antiTheftDlg').modal('hide');
	$('#saveAntiTheft').click(function(){
		saveAntiTheft();
	});
	$('#cancelAntiTheft').click(function(){
		cancelAntiTheft();
	});

	$('#insurableInterestDlg').modal('hide');
	validateInsurableInterest('');
	$('#saveIIAndNew').click(function(){
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
			saveInsurableInterest(false, true,'');
		}
	});
	$('#saveIIAndClose').click(function(){
		var vehIndex = $('#iiVehIndex').val();
		var iiIndex = $('#iiIndex').val();
		var vehicleleased = $('#vehicleLeasedInd_' + vehIndex).val();
		var typeCd =  $("#iiTypeCd").val();; 
		
		var isError = validateFinancialInterest($("#iiZip").val(), $("#iiAddress1").val(), $("#iiCity").val())
		if(isError){
			return;
		}
		
		if(vehicleleased == 'Yes' && typeCd != 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("For leased vehicle, please select 'Leasing Company'");
			 return;
		}else {
			$('div#interestErrormessage').empty();	
			saveInsurableInterest(true, false,'');
		}
	});
	
	$('#cancelII').click(function(){
		$('div#interestErrormessage').empty();
		$('div#zipErrormessage').empty();
		$('div#addressErrormessage').empty();
		$('div#cityErrormessage').empty();
		cancelInsurableInterest();
	});
	
	$('#saveGAAndClose').click(function(){
		saveGaragingAddress(true, false,'');
	});
	
	$('#cancelGA').click(function(){
		cancelGaragingAddress();
	});
	
	$("#leftIIScrollBtn").click(function(){
		scrollIILeft();
	});
	$("#rightIIScrollBtn").click(function(){
		scrollIIRight();
	});
	$("#deleteInsurableInterest").click(function(){
		deleteInsurableInterest();
	});
	
	// Returned data
	showHideReturnedData();
	
	//Commenting below as tabindex takencare by setTabIndex()
	// Set up column-based tabbing
	var vehCount = parseInt($('#vehicleCount').val());
	var tabIndex = 1;
	for (var i = 0; i < vehCount; i++) {
		var tabbables = $("#mainContentTable > tbody > tr > td:nth-child(" + (i + 2) + ") .tabOrder");
		tabbables.each(function() {
	        $(this).attr("tabindex", tabIndex++);			
		});
		
		tabbables = $("#returnedDataTable > tbody > tr > td:nth-child(" + (i + 2) + ") .tabOrder");
		tabbables.each(function() {
	        $(this).attr("tabindex", tabIndex++);			
		});
	}

	// Bind validations to custom validateInput events
	//$('#performanceStart').val($.now());

	bindColumns();
	
	//$('#performanceEnd').val($.now() - parseInt($('#performanceStart').val()));

	// Offset the mainContent if we're displaying a page alert
	var mainContent = $('#mainContent');
	$('.aiAlert:not(.hidden)').each(function() {
		var alertHeight = $(this).outerHeight(false);
		mainContent.css('margin-top', parseInt(mainContent.css('margin-top')) + alertHeight + 7);
	});
	// Add rows to the header table to correspond to any error rows that we added
	// Their height will be sized to match in alignRows below]
	var headerBody = $('#rowHeaderTable > tbody');
	$('.errorRow:not(.hidden)').each(function() {
		addErrorRow(this, headerBody, false);
	});
	
	// selectBoxIt adjustments
	*//**
	$(".selectboxit").each(function () {
		adjustSelectBoxItWidth($(this));
	});
	// Multi-select adjustments
	$(".ui-dropdownchecklist-selector-wrapper").each(function () {
		adjustSelectBoxItWidth($(this));
	});
	$(".ui-dropdownchecklist-selector").each(function () {
		adjustSelectBoxItWidth($(this));
	});
	$(".ui-dropdownchecklist-headertext").each(function () {
		adjustSelectBoxItWidth($(this));
	});
	$(".ui-dropdownchecklist-dropcontainer-wrapper").each(function () {
		adjustSelectBoxItWidth($(this));
	});
		**//*

	addSelectBoxItToPage();
	
	// Align the row heights in the row header table and the main content table
	alignRows();
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
	// To scroll the page up while tabing.
	$( "select[id^='vehTypeCd_']" ).focus(function(){
		window.scrollTo(0, 0);
	});
	
	//set tab index for all vehicles	
	setTabIndex("1", $('#vehicleCount').val());
	
	//set focus on to first field		
	setFocus('vin_0');
});


var tabIndex = 1;

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
	$('.clsVehicleIndex').attr("tabindex", tabIndex++);	
}

function slideThisVehicleLeft(event) {
	var firstVehicleVal = $('#firstVehicle').val();
	
	slideTableLeft(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), 1);
	$('#firstVehicle').val(firstVehicleVal);
	slideTableLeft(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), 1);
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideThisVehicleRight(event) {
	var firstVehicleVal = $('#firstVehicle').val();
	
	slideTableRight(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), VEHICLES_PER_PAGE, 1);
	$('#firstVehicle').val(firstVehicleVal);
	slideTableRight(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), VEHICLES_PER_PAGE, 1);
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideThisVehicleEnd(event) {
	var firstVehicleVal = $('#firstVehicle').val();	
	
	slideToEnd(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
	$('#firstVehicle').val(firstVehicleVal);
	slideToEnd(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideThisVehicleStart(event) {
	var firstVehicleVal = $('#firstVehicle').val();
	
	slideToStart(event, $('#slidingFrameHeadId'), $('#firstVehicle'));
	$('#firstVehicle').val(firstVehicleVal);
	slideToStart(event, $('#slidingFrameId'), $('#firstVehicle'));
	updateVehicleScrollPanel( $(event.target).parent());
}

var EMPTY_ERROR_ROW_HEIGHT = '0px';
function adjustSelectBoxItWidth(selectBoxIt) {
	selectBoxIt.css('width', parseInt(selectBoxIt.css('width')) - 31);
}

var SCROLL_PANEL = '#scrollPanel';

var errorMessages;

window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

function getVehicleIndex(id) {
	return getFieldIndex(id);
}

function getVehicleHeader(vehicleIndex) {
	return $("#vehicleHeaderInfo_" + vehicleIndex).html();
}

function bindColumns() {
	
	bindColumn('multiTable', null);
	
	var selector = '.multiTable';
	var cols = $(selector);
	
	//enableFields(cols);
	
	showHideColumnsData(cols)
}

function bindColumn(tableClass, columnSelector) {
	
	
	//var now = $.now();
	//var last = now;

	var selector = '.' + tableClass;
	var columnPrefix = '';
	var swapSelector = '.swappableField';
	
	var swappableFieldContextSelector  = '.'+tableClass+ '> tbody > tr > td'+swapSelector ;
	
	if (columnSelector != null) {
		selector += ' > tbody > tr';
		//if(columnSelector == 'ALL') {
		//	columnPrefix = ' > td' ;
		//} else {
		//columnPrefix = ' > td:' + columnSelector + ' ';
		//}
		columnPrefix = ' > td:' + columnSelector + ' ';
		//swapSelector = ' > ' + swapSelector + ':' + columnSelector + ' ';
		swappableFieldContextSelector = '.' + tableClass + '> tbody > tr > td'+swapSelector+':last-child';
		
		selector += columnPrefix;
	}
	
	var cols = $(selector);
	
	//Fixing Issue with swappable fields handling. The swapSelector issue..
	$(swappableFieldContextSelector).bind(getValidationEvent(), function(event, result) {		
		storeSwappableValue(this);
    });
	
	$('.clsDeleteVehicle', cols).click(function(){
		deleteVehicle(this);
	});
	
	$('.clsReplaceVehicle', cols).click(function(){
		replaceVehicle(this);
	}); 
		
	$(".vehicleLookup", cols).click(function(){
		lookupAVehicle(this.id);
	});
	
	// Inline validations
	$('.costNewAmt', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateCostNewAmt(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('.costNewAmt', cols).on('change', function(){
		validateCostNewAmt(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('.garagingAddress', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateGaragingAddress(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.garagingCity', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateGaragingCity(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.garagingState', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateGaragingState(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.garagingZipCode', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateGaragingZipCode(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.make', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateMake(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.model', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateModel(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.clsYear', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateVehicleYear(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.newUsedInd', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateNewUsedInd(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.performanceCustomizationInd', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validatePerformanceCustomizationInd(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.primaryUseCd', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validatePrimaryUseCd(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.principalOperatorId', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validatePrincipalOperatorId(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.vehicleLeasedInd', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateVehicleLeasedInd(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.vehicleType', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateVehicleType(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.vehicleValue', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateVehicleValue(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.preInspectionRequiredDesc', cols).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validatePreInspection(this, getColumnIndexNoHeader($(this).parent()));										
	});	
	
	$('.vinInput', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateVin(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('.makeModelOverride', cols).click(function() {
		makeModelOverride(this);
	});
	
	$('.altGaragingInd', cols).each(function() {
		showHideGaragingAddress(this);
	}).click(function() {
		showHideGaragingAddress(this);
	});
	
	$('.altGaragingInd', cols).click(function() {
		showHideGaragingAddress(this);
	});
	
	$(swapSelector, cols).bind(getValidationEvent(), function(event, result){		
		storeSwappableValue(this);
	});
	
	$(".editAntiTheft", cols).click(function(){
		editAntiTheft(this.id);
	});
	
	$(".antiTheftCheckbox").click(function(){
		validateAntiTheft(this);
	});
	
	
	$(".editInsurableInterest", cols).click(function(){
		editInsurableInterest(this.id);
	});
	
	$(".editGaragingAddress", cols).click(function(){
		editGaragingAddress(this.id);
	});
	
	$(".vinInput", cols).each(function() {
	    $(this).data('oldValue', $(this).val());

	    this.blur(function(){
			processVINChange(this);
		});
	});
	
	//set the VIN input data field for previous-Value comparision to detect change in VIN.
	$(".vinInput", cols).each(function () {
		$(this).data("previous-value", $(this).val());
    });
	
	$(".vinInput", cols).live('change' , function (event) {
		processVINChange(this);
		event.stopImmediatePropagation();
    });
	
	$(".ymmSelect", cols).change(function(){
		updateYMM(this);
	});
	$(".ymmInput", cols).blur(function(){
		updateYMM(this);
	});
	
	$(".clsMake", cols).on('change' ,function(){
		//updateYMM(this);
		processCurrentSelectionChange(this);
	}) ;
	
	
	$(".clsModel", cols).on('change' ,function(){
		//updateYMM(this);
		processCurrentSelectionChange(this);
	});
	
	$(".bodyTypeCd", cols).on('change' ,function(){
		//updateYMM(this);
		processCurrentSelectionChange(this);
	});
	
	
	$(".yearInput", cols).live('change' , function (event) {
		processYearChange(this);
		event.stopImmediatePropagation()
    });

	
	$(".vehicleHeaderInfo", cols).each(function(){
		var vehicleIndex = getVehicleIndex(this.id);
		//resetVehicleTitle(vehicleIndex);
		//updateVehicleHeaderInfo(vehicleIndex);
		updateVehicleHeaderTitle(vehicleIndex)
	});
	
	
	$("#gaZip").on("change", function(){
		//var isQuote = $('#vehicles_isQuote').val() == "true";
		var zip = $(this).val();
		if (zip.length == 5 || zip.length == 9) {
			//var vehicleIndex = getVehicleIndex(this.id);
			performZipTownLookup(zip, $('#gaCity'));
		}
	});
	
	$("#gaZip").bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric) {
        	this.value = this.value.replace(regex, '');
        }

	}});
	
	// Show / hide dependencies
	$(".clsYear", cols).blur(function(){
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
		var yearVal = $(this).val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true);
		showHideNewOrUsed(typeVal, vehicleIndex, false);
	});
	
	//changing to onchange as apposed to onblur event...
	$(".vehicleType", cols).on('change', function(){
		if ($(this).is("select")) {		
			var vehicleIndex = getVehicleIndex(this.id);
			var typeVal = $(this).val();
			var yearVal = $("#modelYear_" + vehicleIndex).val();
			showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true);
			showHidePrimaryUse(typeVal, vehicleIndex, true);
			showHideCostNew(typeVal, vehicleIndex, true);
			showHideVehicleValue(typeVal, vehicleIndex, true);
			showHideAntiTheft(typeVal, vehicleIndex, true);
			showHideCustomizedEquipAmt(typeVal, vehicleIndex, true);
			showHideVehicleLeasedInd(typeVal, vehicleIndex, true);
			showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, true);
			showHidePrincipalOperatorId(typeVal, vehicleIndex, true);
			showHideExcludedOperators(typeVal, vehicleIndex, true);
			showHideSnowplowEquipInd(typeVal, vehicleIndex, true);
			showHideNewOrUsed(typeVal, vehicleIndex, true);
			makeModelOverride($("#makeModelOverrideInd_" + vehicleIndex));
		}
	});
	
	$(".customizedEquipAmt", cols).live('change' , function(e) {
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
		showHideCustomizedEquipAmt(typeVal, vehicleIndex, true);
	}); 
	
	
	$(".rvUsedAsPrimaryResidenceInd", cols).each(function(e) {
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
		showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, true);
	}); 
	

	//enableFields(cols);
	
	//TODO: fields default values based on NB / ENDORSEMENT.
	//applyfieldDefaultsBasedOnPolicyFunction();
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

}

function applyfieldDefaultsBasedOnPolicyFunction()  {
	
	var policyFunction  = $('#policySourceCd').val();
	if(policyFunction == 'ENDORSEMENT') {
		//fieldDefaults based on this..
		
	} else {
		//fieldDefaults based on this..
	}
}

//SSIRIGIN :Tempfix for showhide not working for some elements when selectboxit is not applied.
function showHideTableRow(fieldType) {
	
	var showLabel = $('.' + fieldType).filter(function() {
					return !($(this).hasClass('selectBoxItHidden') || $(this).hasClass('hidden')) ;
				}).length > 0;
	showHideLabelRow(fieldType, showLabel);
}

//SSIRIGIN :Tempfix for showhideLabel not working for some elements when selectboxit is not applied.
function showHideLabelRow(fieldType, showLabel) {
	
	var fieldRow = $('.' + fieldType + "_Row");
	if (showLabel) {
		fieldRow.removeClass("hidden");
		alignTableRow($(fieldRow[0]), $(fieldRow[1]));
	} else {
		fieldRow.addClass("hidden");
	}
}


function enableColumnFields(columnIndex) {
	
	var selector = '.multiTable > tbody > tr > td:nth-child(' + (parseInt(columnIndex) + 1) + ') ';
	//enableFields(selector);
	
	showHideColumnsData(selector);
}

function showHideColumnsData(selector) {
	
	var dataSources = $('.dataSource', selector);
	var ymmOverride = $('.makeModelOverride', selector);
	var vehicleType = $('.vehicleType:not(span)', selector);
	var year = $('.clsYear', selector);
	var make = $('.clsMake:not(span)', selector);
	var model = $('.clsModel:not(span)', selector);
	//var bodyType = $('.bodyType:not(span)', selector);
	
	//Added newly for PREFIL Source
	var thirdPartyData = $('.thirdPartyData', selector);
	
	for (var i = 0; i < dataSources.length; i++) {

		var $ymmOverride = $(ymmOverride[i]);
		
		var isYMMOverride = $ymmOverride.prop('checked');
		
		//FIXME: THIS shuould not be just RMV. It should ECP for NJ.
		var isRMV = $(dataSources[i]).val() == 'RMV';
		//Added newly for PREFIL Source
		var isDataFromPrefill = $(thirdPartyData[i]).val() != '';
		
		//THE YMM protection should be same way as VehicleLookup / Vehicle Selected from PREFILL
		var protectYMMFlag = ((isRMV || isDataFromPrefill)  && ! isYMMOverride ) ? true : false
		
		$(vehicleType[i]).prop('disabled', (isRMV || isDataFromPrefill) ? true : false);
		$ymmOverride.prop('disabled', (isRMV || isDataFromPrefill) ? true : false);
		
		$(year[i]).prop('disabled', protectYMMFlag);
		
		//starting Jquery jQuery 1.6+
        //To change the disabled property you should use the .prop() function like> $("input").prop('disabled', true);

		// Swappables have 2 fields to edit
		//New change:
		$(make[(2*i)]).prop('disabled', protectYMMFlag).removeClass('preRequired');
		$(make[(2*i)+1]).prop('disabled', protectYMMFlag);
		$(model[(2*i)]).prop('disabled', protectYMMFlag).removeClass('preRequired');
		$(model[(2*i)+1]).prop('disabled', protectYMMFlag);
		
		if(isEndorsement()){
			$("#bodyTypeCd_" + i).prop('disabled', protectYMMFlag);
			$('#vehicleLookup_' + i).prop('disabled',protectYMMFlag);
			$('#excludedOperators_'+ i).prop('disabled', protectYMMFlag);
			//during endorsments/amend the field preInspection required should not be shown for existing Vehicles. but while adding vehicle it is shown.
			showHidePreinspectionRequired(true, typeVal, i, false);
		}
		//$(bodyType[(2*i)]).prop('disabled', protectYMMFlag).removeClass('preRequired');
		//$(bodyType[(2*i)+1]).prop('disabled', protectYMMFlag);
		
		$(make).filter(function() { return $(this).is('select'); }).trigger('changeSelectBoxIt');
		$(model).filter(function() { return $(this).is('select'); }).trigger('changeSelectBoxIt');
		//$(bodyType).filter(function() { return $(this).is('select'); }).trigger('changeSelectBoxIt');
		
		// Conditionally show / hide fields
		var typeVal = $("#vehTypeCd_" + i).val();
		var yearVal = $(year[i]).val();
		showHideVehicleLookup(typeVal, yearVal, i, false);
		showHidePrimaryUse(typeVal, i, false);
		showHideCostNew(typeVal, i, false);
		showHideVehicleValue(typeVal, i, false);
		showHideAntiTheft(typeVal, i, false);
		showHideCustomizedEquipAmt(typeVal, i, false);
		showHideVehicleLeasedInd(typeVal, i, false);
		showHideRvUsedAsPrimaryResidenceInd(typeVal, i, false);
		showHidePrincipalOperatorId(typeVal, i, false);
		showHideExcludedOperators(typeVal, i, false);
		showHideSnowplowEquipInd(typeVal, i, false);
		showHideNewOrUsed(typeVal, i, false);
		makeModelOverride($("#makeModelOverrideInd_" + i));
		checkThenAppendModelOption($("#dd_model_" + i), $("#ff_model_" + i).val());
		//applying field defualts. eg:- if vehicle lease is empty then set it to 'No'
		applyfieldDefaults(typeVal, i);

		//during endorsements 
		
		
		//GATING DEFECT: If VIN lookup was not successful earlier, then we have to figure out a way to retain the 'LOOKUP required' message under the 
		//LOOKUKP button and also the message under the VIN (VIN is invalid, please correct or use the Year Make Model override function).
		//one way of doing this check by relying on the dataSourceCd, isVehicle from PREFIL ,Vehicle Type and  YMM Overide checkbox check box
		showVINRelatedErrors(i, typeVal, isRMV, isDataFromPrefill,  isYMMOverride);
	}
	
	//:LABEL LEVEL Conditionally show / hide row Labels
	showHideVehicleRowLabels();
	
}

function showVINRelatedErrors(vehicleIndex, vehicleType, isRMVSourced, isDataFromPrefill, isYMMOverrideInd) {
	//retain Lookup required error Message:
	//FOR SUCCESSfull lookup the dataSourceCd will not be empty.
	
	if(vehicleType == PRIVATE_PASSENGER_CD && !isRMVSourced && !isDataFromPrefill  && !isYMMOverrideInd ) {
		 
		    var vinNum =  $("#vin_" + vehicleIndex).val();
		    
		    if(vinNum != '' ) {
		    	 showClearInLineErrorMsgsWithMap('vin_'+vehicleIndex, 'vin.browser.inLine.vinlookup.noresults', $('#defaultMulti').outerHTML(),
		                 vehicleIndex, errorMessages, addRemoveVehicleRow);
		    }
		
	    	showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
					 						vehicleIndex, errorMessages, addRemoveVehicleRow);
	    }
	
}

function showHideVehicleRowLabels() {
	
	showHideRow('vehicleLookup');
	showHideRow('primaryUseCd');
	showHideRow('costNewAmt');
	showHideRow('vehicleValue');	
	showHideRow('antiTheftContents');
	showHideRow('customizedEquipAmt');
	showHideRow('performanceCustomizationInd');
	showHideRow('vehicleLeasedInd');
	showHideRow('rvUsedAsPrimaryResidenceInd');
	showHideRow('principalOperatorId');
	showHideRow('excludedOperators');
	showHideRow('snowplowEquipInd');
	showHideRow('preInspectionRequiredDesc');
}

function showHideNewColumnFields(vehicleIndex) {
	//Incase of Adding vehicle, this has to take the Vehicle Column index to the perform the enable/hidden functions.
	//Fixing the below code to handle
	
	var dataSource = $('#dataSourceCd_'+vehicleIndex);
	
	//remove disable styleclass:
	$('#vehTypeCd_'+vehicleIndex).prop('disabled', false );
	$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled', false );
	$('#modelYear_'+vehicleIndex).prop('disabled', false );
	
	$('#dd_make_'+vehicleIndex).prop('disabled', false );
	$('#dd_model_'+vehicleIndex).prop('disabled', false );
	//$('#dd_bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	$('#ff_make_'+vehicleIndex).prop('disabled', false );
	$('#ff_model_'+vehicleIndex).prop('disabled', false );
	//$('#ff_bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	$('#make_'+vehicleIndex).prop('disabled', false );
	$('#model_'+vehicleIndex).prop('disabled', false );
	$('#bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
	//ExcludedOperators field enable
	$('#excludedOperators_'+ vehicleIndex).prop('disabled', false);

		
	// Field LEVEL Conditionally show / hide fields  
	var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
	var yearVal = '1983'; //This allows the VehileLookukp button to show while adding new vehicle..
	showHideVehicleLookup(typeVal, yearVal, vehicleIndex, false);
	showHidePrimaryUse(typeVal, vehicleIndex, false);
	showHideCostNew(typeVal, vehicleIndex, false);
	showHideVehicleValue(typeVal, vehicleIndex, false);
	showHideAntiTheft(typeVal, vehicleIndex, false);
	showHideCustomizedEquipAmt(typeVal, vehicleIndex, false);
	showHideVehicleLeasedInd(typeVal, vehicleIndex, false);
	showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, false);
	showHidePrincipalOperatorId(typeVal, vehicleIndex, false);
	showHideExcludedOperators(typeVal, vehicleIndex, false);
	showHideSnowplowEquipInd(typeVal, vehicleIndex, false);
	
	showHidePreinspectionRequired(false, typeVal, vehicleIndex , false);
	
	//:LABEL LEVEL Conditionally show / hide row Labels
	showHideVehicleRowLabels();
	showHideNewOrUsed(typeVal, vehicleIndex, false);
	applyfieldDefaults(typeVal , vehicleIndex );
	
	//This will take care of the YELLOW PreREquiured class and handlers for the input elements.
	var selector = '.multiTable > tbody > tr > td:last-child';
	var selectorForNewlyAddedColumn = $(selector);
	
	applyPreRequiredStyles(selectorForNewlyAddedColumn)
}

function applyPreRequiredStyles(selector){
	   var optional = 'Optional';
	 
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
	  		if ($(this).val().length == 0){
	    		$(this).val(optional).addClass('watermark');
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
		$('.required', selector).each(function(){
			//for New Used Ind field, even though it is required, it should not be shown with YELLOW initially.
			if($(this).hasClass('newUsedInd') ) {
				$(this).removeClass('preRequired');
			} else {
				if (null != $(this).val() &&  $(this).val().length == 0) {
		  		   $(this).addClass('preRequired');
				}
			}
	    });
		//if blur and no value inside, set preRequired class again.
		
	 	$('.required' , selector).blur(function(){
	  		if ($(this).val().length == 0){
	    		$(this).addClass('preRequired');
	    		if($(this).is('select')){
	    			$(this).trigger(changeSelectBoxIt);
	    		}
	  		}else{
				$(this).removeClass('preRequired');
	    		if($(this).is('select')){				
	  				$(this).trigger(changeSelectBoxIt);
	  			}
	 		}
	 	});
	 	
		//if focus, remove the yellow background
		$('.required', selector).focus(function(){
	    	$(this).removeClass('preRequired');
	 	});
		
}

//Added Newly
function applyfieldDefaults(vehicleType , vehicleIndex) {
	
	if( vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTOR_HOME_CD ) {
		if($('#vehicleLeasedInd_'+vehicleIndex).val() == ''){
			$('#vehicleLeasedInd_'+vehicleIndex).val("No").trigger("changeSelectBoxIt");
		}
	}
	
	//MORE to come here if needed...
}


function showHideReturnedData() {
	//Added Newly..This POLK returned should be availble for Vehicles Selected via PRefil/ Vehicles via LOOKUP.
	//Hence check against both the datasource field(for LOOKUP) and thirdPartyData (for PREFIL)
	var sourceValued = $('.dataSource , .thirdPartyData').filter(function() {
		return $(this).val() != '';
	});

	if (sourceValued.length == 0) {
		$(".returnedDataRow").addClass('hidden');
		$(".returnedDataHeader").addClass('hidden');
	} else {
		$(".returnedDataHeader").removeClass('hidden');		
	}
}

function showHidePreinspectionRequired(forceHide, typeVal , vehicleIndex, checkRow){
	//IN endorsment while showing the data for existing vehicles this should be hidden. but while adding new vehicle this is shown.
	
	if(forceHide) {
		//hide 
		showHideField('preInspectionRequiredDesc', vehicleIndex, false );
	} else  {
		//Show where Policy State =  MA or NJ and Vehicle type = PPA/Pickup, Antique. 
		showHideField('preInspectionRequiredDesc', vehicleIndex, (typeVal == '' || typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD));
	}
	
	if(checkRow) {
		showHideRow('preInspectionRequiredDesc');
	}
	
}

function showHideVehicleLookup(typeVal, yearVal, vehicleIndex, checkRow) {	
	//New validation: if vehicleType is not selected , then dont show Vehicle LOOKUP.
	if(typeVal == ''){
		showHideField('vehicleLookup', vehicleIndex ,false);
		return;
	}
	
	showHideField('vehicleLookup', vehicleIndex,
			(typeVal == '' || typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) && 
			(yearVal == null || yearVal.length == 0 || parseInt(yearVal) >= 1981) && !$("#makeModelOverrideInd_"+vehicleIndex).prop('checked'));
	
	if (checkRow) {
		showHideRow('vehicleLookup');		
	}
}

function showHidePrimaryUse(typeVal, vehicleIndex, checkRow) {
	showHideField('primaryUseCd', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('primaryUseCd');		
	}
}

function showHideCostNew(typeVal, vehicleIndex, checkRow) {
	showHideField('costNewAmt', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTORCYCLE_CD));
	
	if (checkRow) {
		showHideRow('costNewAmt');		
	}
}

function showHideVehicleValue(typeVal, vehicleIndex, checkRow) {
	showHideField('vehicleValue', vehicleIndex,
			(typeVal == UTILITY_TRAILERS_CD || typeVal == TRAILER_W_LIVING_FAC_CD || typeVal == TRAILER_CAPS_CD || typeVal == ANTIQUE_CD));

	if (checkRow) {
		showHideRow('vehicleValue');		
	}
}

function showHideAntiTheft(typeVal, vehicleIndex, checkRow) {
	showHideField('antiTheftContents', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('antiTheftContents');		
	}
}

function showHideCustomizedEquipAmt(typeVal, vehicleIndex, checkRow) {
	var showIt = typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD;
	var amt = $("#customizedEquipAmt_" + vehicleIndex).val();
	if(!showIt){
		$("#customizedEquipAmt_" + vehicleIndex).val("");
		$("#performanceCustomizationInd_" + vehicleIndex).val("");
	}
	showHideField('customizedEquipAmt', vehicleIndex, showIt);
	showHideField('performanceCustomizationInd', vehicleIndex, showIt &&
			(amt != null && amt.length > 0 && parseInt(amt) > 0));
	
	if (checkRow) {
		showHideRow('customizedEquipAmt');		
		showHideRow('performanceCustomizationInd');		
	}
}

function showHideVehicleLeasedInd(typeVal, vehicleIndex, checkRow) {
	showHideField('vehicleLeasedInd', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('vehicleLeasedInd');		
	}
}

function showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, checkRow) {
	showHideField('rvUsedAsPrimaryResidenceInd', vehicleIndex,
			(typeVal == TRAILER_W_LIVING_FAC_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('rvUsedAsPrimaryResidenceInd');
	}
}

function showHidePrincipalOperatorId(typeVal, vehicleIndex, checkRow) {
	showHideField('principalOperatorId', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('principalOperatorId');		
	}
}

function showHideExcludedOperators(typeVal, vehicleIndex, checkRow) {
	showHideField('excludedOperators', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('excludedOperators');		
	}
	//SSIRIGIN :FIXED: showHideField function is not working for multiselectdropdowns. Fixed the above code so below fix canbe removed. . 
	showOrHideMultiCheckBoxElement("#excludedOperators_" + vehicleIndex, 
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('excludedOperators');		
	}
}

function showHideNewOrUsed(typeVal, vehicleIndex, checkRow){
	
	showHideField('newUsedInd', vehicleIndex, (typeVal == PRIVATE_PASSENGER_CD));
	if(typeVal != PRIVATE_PASSENGER_CD){
		 checkRow = false;
	}
	
	if(typeVal == PRIVATE_PASSENGER_CD && isEmpty($("#newUsedInd_" + vehicleIndex).val())){
		
		var modelYear = $("#modelYear_" + vehicleIndex).val();
		var currentYear = new Date().getFullYear();
		var errorMessageID;
		var strErrorRow = $('#defaultMulti').outerHTML();
		
	    if(currentYear && modelYear){
            if(modelYear >= currentYear - 2){
            	errorMessageID =  'newUsedInd.browser.inLine.required';
            	}else{
            		errorMessageID =  '';
            }
            showClearInLineErrorMsgsWithMap("newUsedInd_" + vehicleIndex, errorMessageID, strErrorRow,vehicleIndex, errorMessages, addRemoveVehicleRow);
        }
	}else {
		 checkRow = true;
	}
	
	if (checkRow) {
        showHideRow('newUsedInd');      
    }
}

function showHideSnowplowEquipInd(typeVal, vehicleIndex, checkRow) {
	showHideField('snowplowEquipInd', vehicleIndex, typeVal == PRIVATE_PASSENGER_CD);
	
	if (checkRow) {
		showHideRow('snowplowEquipInd');		
	}
}

function showHideFieldAndRow(fieldType, vehicleIndex, showIt) {
	showHideField(fieldType, vehicleIndex, showIt);
	showHideRow(fieldType);
}

function showHideField(fieldType, vehicleIndex, showIt) {
	var fieldId = fieldType + '_' + vehicleIndex;
	showHideFieldId(fieldId, $('#' + fieldId), showIt);
}


function showHideFieldId(fieldId, field, showIt) {
	var isSelect = field.is("select");
	if (isSelect) {
		removeSelectBoxIt(field);
	}
	
	if (showIt) {
		
		 field.removeClass("hidden").removeClass("selectBoxItHidden");
		
		if (isSelect) {
			//trigger the change to reflect the s for dropdowns
			if(field.is('select:not(select[multiple])')){
				addSelectBoxItForCol(field);
			} else {
				addDropdownCheckListForCol(field);
			}
		}
	} else {
		if (isSelect) {
			field.addClass("selectBoxItHidden");
		}
		field.addClass("hidden");

		//clearColumnInLineError("#"+fieldId);
		
		var index = getIndexOfElementId("#"+fieldId);
		var strRowName = fieldId.replace("_" + index, "");
		showClearInLineErrorMsgsWithMap(fieldId, '', strRowName+'.browser.inLine',
				index*1, errorMessages, addRemoveVehicleRow);
	}
	
}


function showHideFieldId(fieldId, field, showIt) {
	*//**
	if (field.is("select")) {
		var boxItField = $('#' + fieldId + 'SelectBoxItContainer');
		if (boxItField == null || boxItField.length == 0) {
			boxItField = $('#ddcl-' + field[0].id);
		}
		if (boxItField != null && boxItField.length > 0) {
			field.addClass("hidden");
			field = boxItField;
		}
	}
	**//*
	var isSelect = field.is("select");
	if (isSelect) {
		removeSelectBoxIt(field);
	}
	
*//************************************************************
	var boxItField = $('#' + fieldId + 'SelectBoxItContainer');
************************************************************//*
	if (showIt) {
*//************************************************************
		if (isSelect) {
			boxItField.removeClass("selectBoxItHidden");
		} else {
************************************************************//*
		field.removeClass("hidden")
			.removeClass("selectBoxItHidden");
*//************************************************************
		}
************************************************************//*
		
		if (isSelect) {
			if(field.is('select:not(select[multiple])')){
				addSelectBoxItForCol(field);
			} else {
				addDropdownCheckListForCol(field);
			}
		}
	} else {
		if (isSelect) {
			field.addClass("selectBoxItHidden");
		}
		field.addClass("hidden");

	
		//clearColumnInLineError("#"+fieldId);
		var index = getIndexOfElementId("#"+fieldId);
		var strRowName = fieldId.replace("_" + index, "");
		showClearInLineErrorMsgsWithMap(fieldId, '', strRowName+'.browser.inLine',
				index*1, errorMessages, addRemoveVehicleRow);
	}
}
//Revisit: RV Used as a primary Residence not working as expected when adding Vehicle(which is currently defaulted to PPA).

//SSIRIGIN: TEMP Fix: Revisit: added newly added for Multicheckboxes..since the common function is not working..
//FIXED: Modified the actual code specific to selector, so we dont need this fix any more. (not referenced anywhere). 
function showOrHideMultiCheckBoxElement(multiCheckBoxElement, showIt) {
	
	if (showIt) {
		$(multiCheckBoxElement).removeClass("hidden");
	} else {
		$(multiCheckBoxElement).addClass("hidden");
	}
	addDropdownCheckListForCol(multiCheckBoxElement);
	
}

function triggerChangeEvent(element) {
	element.trigger("changeSelectBoxIt");
}


function expandCollapseRows(rowPrefix) {
	$("." + rowPrefix + "Row").each(function() {
		$(this).toggleClass("hidden");
	});
	$("#mainContentTable ." + rowPrefix + "Row").each(function() {
		var headerRow = $('#rowHeaderTable .' + this.id);
		alignTableRow($(this), $(headerRow[0]));
	});
}

function processVINChange(vinInputElement) {
	
	
	var newValue = $(vinInputElement).val();
    var prevValue = $(vinInputElement).data('previous-value');
    
    var vehicleIndex = getVehicleIndex(vinInputElement.id);
    
    if( prevValue.substring(0, 10) != newValue.substring(0, 10) ) {
    	
    	//#34063: Clear the datasource so it forces the Vehicle Lookup before rating. 
    	$('#dataSourceCd_' + vehicleIndex).val('');
    	
    	//If Vin Changed;  the YMM and YMM override should no longer be protected,
		//enableColumnFields(vehicleIndex);
        enableYMMFields(vehicleIndex);
        
		if(!$("#makeModelOverrideInd_" + vehicleIndex).prop('checked') ) {
	    	
	    	showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
					 						vehicleIndex, errorMessages, addRemoveVehicleRow);
	    }
    } 
    
    //Need more clarificationfor this logic.  for VIN with 17 digits...
    if(newValue.length > 10 && prevValue.substring(10, 17) != newValue.substring(10, 17)) {
    	$('#vehicleLookup_'+vehicleIndex).prop('disabled',true);
    } else {
    	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
    } 
    
    $(vinInputElement).data('previous-value', newValue);
	
}

function enableYMMFields(vehicleIndex) {
	
	$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled', false );
	$('#modelYear_'+vehicleIndex).prop('disabled', false );
	
	$('#dd_make_'+vehicleIndex).prop('disabled', false );
	$('#dd_model_'+vehicleIndex).prop('disabled', false );
	//$('#dd_bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	$('#dd_make_'+vehicleIndex).trigger('changeSelectBoxIt');
	$('#dd_model_'+vehicleIndex).trigger('changeSelectBoxIt');
	//$('#dd_bodyTypeCd_'+vehicleIndex).trigger('changeSelectBoxIt');
	
	$('#ff_make_'+vehicleIndex).prop('disabled', false );
	$('#ff_model_'+vehicleIndex).prop('disabled', false );
	//$('#ff_bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	$('#make_'+vehicleIndex).prop('disabled', false );
	$('#model_'+vehicleIndex).prop('disabled', false );
	$('#bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
	
	
}
function processVINChange(vin) {
	
	var $vin = $(vin);
	var newValue = $vin.val();
    var oldValue = $vin.data('oldValue');
    
    if(oldValue === undefined) {
    	//oldValue will be undefined for the first time.
    	oldValue = $vin.val() ;
    }
    
    //oldValue will be undefined for the first time.
    
    if (  oldValue === undefined || oldValue=='' || (oldValue != null && oldValue.length > 0)) {
		var vehicleIndex = getVehicleIndex(vin.id);
		
    	if (newValue == null || oldValue.substring(0, 10) != newValue.substring(0, 10)) {
    		$('#modelYear_' + vehicleIndex).val('');
    		
    		$('#make_' + vehicleIndex).val('');
    		$('#ff_make_' + vehicleIndex).val('');
    		$('#dd_make_' + vehicleIndex).val('');
    		emptySelect($("#dd_make_" + vehicleIndex));
    		
    		$('#model_' + vehicleIndex).val('');
    		$('#ff_model_' + vehicleIndex).val('');
    		$('#dd_model_' + vehicleIndex).val('');
    		emptySelect($("#dd_model_" + vehicleIndex));
    		
    		$('#dd_bodyTypeCd_' + vehicleIndex).val('');
    		$('#ff_bodyTypeCd_' + vehicleIndex).val('');
    		$('#bodyTypeCd_' + vehicleIndex).val('');

    		$('#dataSourceCd_' + vehicleIndex).val('');
    		enableColumnFields(vehicleIndex);
    	} else if (oldValue != newValue) {
    		$('#dataSourceCd_' + vehicleIndex).val('');
    		enableColumnFields(vehicleIndex);
    	}
		if( oldValue === undefined || (newValue == null || oldValue.substring(0, 10) != newValue.substring(0, 10) )
				 ||  (oldValue != newValue) ) {
			
			$('#dataSourceCd_' + vehicleIndex).val('');
    		enableColumnFields(vehicleIndex);
    		//Added newly as per defect#33992
    	    //If Vin Changed;  the YMM and YMM override should no longer be protected,
    	    //and upon leaving the page if YMM Override not checked, and No Successful Polk lookup done,
    	    //a soft inline edit below "Vehicle Lookup" button:  "Lookup Required".  (soft – does not stop ability to leave page).
    		if(!$("#makeModelOverrideInd_" + vehicleIndex).prop('checked') ) {
    	    	
    	    	showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
    					 						vehicleIndex, errorMessages, addRemoveVehicleRow);
    	    }
		}
    } 
	
    $vin.data('oldValue', newValue);
    
}


function resetVehicleTitle(vehicleIndex) {

	processYMM(vehicleIndex, false);
}

function processCurrentSelectionChange(source) {
	
	var vehicleIndex = getVehicleIndex(source.id);
	//var year = $("#modelYear_" + vehicleIndex).val();	
	//var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
	
	if($(source).hasClass("clsMake")) {
		 processMakeChange(vehicleIndex);
	} else if($(source).hasClass("clsModel")) {
		processModelChange(vehicleIndex);
	} else {
		
		//not necessary to process
	}
	
	var srcElementClass = $(source).attr("class");
	    switch (srcElementClass) {
		    case "clsMake":
		        processMakeChange(vehicleIndex);
		        break;
		    case "clsModel":
		        //processModelChange(vehicleIndex);
		        break;
		    case "bodyTypeCd":
		      //  processBodyTypeChange(vehicleIndex);
		        break;
		    default:
		        break;
	    };
} 

function processMakeChange(vehicleIndex) {
	
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	//Make,Model fields should be free form edits when YMM Overide is checked. Hence not necessary to do lookukp for Model dropdown values.
	var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).prop('checked');
	
	if(PRIVATE_PASSENGER_CD == vehicleType && !isYMMOverideCheck) {
		
		var year = $("#modelYear_" + vehicleIndex).val();	
		var makeElement = $("#dd_make_" + vehicleIndex);
		var makeValue ="";
		if (! $(makeElement[0]).hasClass('hidden')) {
			var makeSelect = $("option:selected", makeElement);
			makeValue = makeSelect.val();
		} else {
			makeValue = $("#ff_make_" + vehicleIndex).val();
		}
		
		var modelElement = $("#dd_model_" + vehicleIndex);
		
		performModelLookup(year, makeValue, modelElement, modelLookupSuccess(modelElement), modelLookupFailure(modelElement));	
	
	}
	
	updateVehicleHeaderInfo(vehicleIndex);
	
}

function processModelChange(vehicleIndex) {
	
	//Just update the header info
	updateVehicleHeaderInfo(vehicleIndex);
	
}

function updateVehicleHeaderTitle(vehicleIndex) {
	
	var year = $("#modelYear_" + vehicleIndex).val();
	var make = $("#make_" + vehicleIndex).val();
	var model = $("#model_" + vehicleIndex).val();
	
	$("#vehicleHeaderInfo_" + vehicleIndex).html("#" + (vehicleIndex + 1) + "-" + year + " "+ make + " "+ model);
}

function updateVehicleHeaderInfo(vehicleIndex) {
	
	var year = $("#modelYear_" + vehicleIndex).val();	
	
	var makeElement = $("#dd_make_" + vehicleIndex);
	var makeValue ="";
	if (! $(makeElement[0]).hasClass('hidden')) {
		var makeSelect = $("option:selected", makeElement);
		//makeValue = makeSelect.val();
		makeValue = makeSelect.text();
	} else {
		makeValue = $("#ff_make_" + vehicleIndex).val();
	}
	
	var modelElement = $("#dd_model_" + vehicleIndex);
	var modelValue = "";
	if (! $(modelElement[0]).hasClass('hidden')) {
		var modelSelect = $("option:selected", modelElement);
		modelValue = modelSelect.val();
	} else {
		modelValue = $("#ff_model_" + vehicleIndex).val();
	}
	
	$("#vehicleHeaderInfo_" + vehicleIndex).html("#" + (vehicleIndex + 1) + "-" + year + " "+ makeValue + " "+ modelValue);
	
	
    var year = $("#modelYear_" + vehicleIndex).val();
	var make = "";
	var makeValue = "";
	var makeElement = $("#dd_make_" + vehicleIndex);
	//if (! $(makeElement[0]).parent().hasClass('hidden')) {
	if (! $(makeElement[0]).hasClass('hidden')) {
		var makeSelect = $("option:selected", makeElement);
		make = makeSelect.text();
		makeValue = makeSelect.val();
	} else {
		make = $("#ff_make_" + vehicleIndex).val();
		makeValue = make;
	}

	var modelElement = $("#dd_model_" + vehicleIndex);

	var model = "";
	var modelValue = "";
	if (! $(modelElement[0]).hasClass('hidden')) {
		var modelSelect = $("option:selected", modelElement);
		model = modelSelect.text();
		modelValue = modelSelect.val();
	} else {
		model = $("#ff_model_" + vehicleIndex).val();
		modelValue = model;
	}
	
	
	var bodyTypeCd = $("#ff_bodyTypeCd_" + vehicleIndex).val();
	
	if (modelLookup && !$("#makeModelOverrideInd_" + vehicleIndex).prop('checked')) {
		performModelLookup(year, makeValue, modelElement,
				modelLookupSuccess(modelElement), modelLookupFailure(modelElement));		
	}else{
		 $("#make_" + vehicleIndex).val(makeValue);
		 $("#model_" + vehicleIndex).val(modelValue);
		 $("#bodyTypeCd_" + vehicleIndex).val(bodyTypeCd);		 
	}
	
	$("#vehicleHeaderInfo_" + vehicleIndex).html(
			"#" + (vehicleIndex + 1) + "-" + year + " "
			+ (makeValue == null || makeValue.length == 0 ? "" : make) + " "
			+ (modelValue == null || modelValue.length == 0 ? "" : model));
	
}

function processYearChange(source) {
    //Lookup is performed only for PPA vehicle types .. hence MM are free form edits. no lookup calls for make and model.
	
	var vehicleIndex = getVehicleIndex(source.id);
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	
	//Make,Model fields should be free form edits when YMM Overide is checked. Hence not necessary to do lookukp for Make Values dropdown.
	var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).prop('checked');
	if(PRIVATE_PASSENGER_CD == vehicleType  && !isYMMOverideCheck) {
		var year = $("#modelYear_" + vehicleIndex).val();	
		var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
		performVehicleMakeLookup(year, vehicleMakeElement, makeLookupSuccess(vehicleMakeElement), makeLookupFailure(vehicleMakeElement));
	}
	
	updateVehicleHeaderInfo(vehicleIndex);
	
	//reset Model/Body.
	//processMakeChange(vehicleIndex);
	//$("#dd_model_" + vehicleIndex).remove();
	//emptySelect($("#dd_model_" + vehicleIndex));
	$("#dd_model_" + vehicleIndex)
    .find('option')
    .remove()
;
	
}
//Added for Vehicle Make Lookup
function performVehicleMakeLookup(year, makeElement, successFunction, errorFunction) {

	emptySelect(makeElement);
	
	if (year != null && year > 0) {
		var lookupData = {};
		lookupData.year = year;		
		var jsonData = JSON.stringify(lookupData);
		
		blockUser();
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/vehicles/lookupMakes",
	        type: "post",
	        data: jsonData,
	        dataType: 'json',
	        // callback handler that will be called on success
	        success: successFunction,
	        // callback handler that will be called on error
	        error: errorFunction,
	        // callback handler that will be called on completion
	        // which means, either on success or error
	        complete: function(){
	            // enable the inputs
	        	$.unblockUI();
	        }
	    });
	}
}

//Added for Make lookups
function makeLookupSuccess(makeElement) {
	return function(response, textStatus, jqXHR) {
		processMakeLookupSuccess(response, textStatus, jqXHR, makeElement);
	};
}

function makeLookupFailure(makeElement) {
	return function(jqXHR, textStatus, errorThrown){
		processMakeLookupFailure(jqXHR, textStatus, errorThrown, makeElement);
	};
}

function processMakeLookupSuccess(response, textStatus, jqXHR, makeElement) {
	populateMakeDropDown(response, makeElement );

	swapDropDown(makeElement, false, true);
}

function processMakeLookupFailure(jqXHR, textStatus, errorThrown, makeElement) {
    // log the error to the console
    console.log( "The following error occured: "+textStatus, errorThrown);
	swapDropDown(makeElement, false, true);
}

function updateYMM(source) {
	
	var vehicleIndex = getVehicleIndex(source.id);

	processYMM(vehicleIndex, ($(source).hasClass("clsYear") || $(source).hasClass("clsMake"))); 
	//processYMM(vehicleIndex, $(source).hasClass("clsMake")); 
}

function processYMM(vehicleIndex, modelLookup) {
	
	var year = $("#modelYear_" + vehicleIndex).val();
	
	var make = "";
	var makeValue = "";
	var makeElement = $("#dd_make_" + vehicleIndex);
	//if (! $(makeElement[0]).parent().hasClass('hidden')) {
	if (! $(makeElement[0]).hasClass('hidden')) {
		var makeSelect = $("option:selected", makeElement);
		make = makeSelect.text();
		makeValue = makeSelect.val();
	} else {
		make = $("#ff_make_" + vehicleIndex).val();
		makeValue = make;
	}

	var modelElement = $("#dd_model_" + vehicleIndex);

	var model = "";
	var modelValue = "";
	if (! $(modelElement[0]).hasClass('hidden')) {
		var modelSelect = $("option:selected", modelElement);
		model = modelSelect.text();
		modelValue = modelSelect.val();
	} else {
		model = $("#ff_model_" + vehicleIndex).val();
		modelValue = model;
	}
	
	
	var bodyTypeCd = $("#ff_bodyTypeCd_" + vehicleIndex).val();
	
	if (modelLookup && !$("#makeModelOverrideInd_" + vehicleIndex).prop('checked')) {
		performModelLookup(year, makeValue, modelElement,
				modelLookupSuccess(modelElement), modelLookupFailure(modelElement));		
	}else{
		 $("#make_" + vehicleIndex).val(makeValue);
		 $("#model_" + vehicleIndex).val(modelValue);
		 $("#bodyTypeCd_" + vehicleIndex).val(bodyTypeCd);		 
	}
	
	$("#vehicleHeaderInfo_" + vehicleIndex).html(
			"#" + (vehicleIndex + 1) + "-" + year + " "
			+ (makeValue == null || makeValue.length == 0 ? "" : make) + " "
			+ (modelValue == null || modelValue.length == 0 ? "" : model));
}


function makeModelOverride(overrideBox) {
	
	var checked = $(overrideBox).prop('checked');
	var overrideColumn = $(overrideBox).closest('.multiColumnInd');
	
	// tjmcd - Should this become getColumnIndexNoHeader
	var columnIndex = getColumnIndex(overrideColumn);
	var vehicleIndex = columnIndex-1;
	
	var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
	
	if(typeVal == UTILITY_TRAILERS_CD || typeVal == TRAILER_CAPS_CD || typeVal == MOTOR_HOME_CD){
		swapDropDownTables("multiTable", ".ymmSelect", columnIndex, true);
	}else{
		swapDropDownTables("multiTable", ".ymmSelect", columnIndex, checked);
	}
	//enableColumnFields(columnIndex);
	
	//Hide Vehicle Lookup button if override checkbox is checked
	
	var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
	var yearVal = $(".clsYear").val();
	
		
	showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true)

	
}

function showHideGaragingAddress(altGaragingBox) {
		
	if ($(altGaragingBox).prop('checked')) {
		
		var rows = $('.garagingZipCode_Row');
		rows.removeClass('hidden');
		alignTableRow($(rows[0]), $(rows[1]));

		var rows = $('.garagingZipCode_Error');
		rows.removeClass('hidden');
		alignTableRow($(rows[0]), $(rows[1]));
	} else if ($(".altGaragingInd:checked").length == 0) {
		
		$('.garagingZipCode_Row').addClass('hidden');
		
		$('.garagingZipCode_Error').addClass('hidden');
	}
}


function showHideGaragingAddress(altGaragingIndBox) {
    
    var vehIndex  = $(altGaragingIndBox).attr('id').substring('altGaragingInd_'.length);
    
	if ($(altGaragingIndBox).prop('checked')) {
		$('#garagingAddressData_'+vehIndex).removeClass('hidden');
    }  else  {
        $('#garagingAddressData_'+vehIndex).addClass('hidden');
    }
    
    if ($(".altGaragingInd:checked").length == 0) {
    	
		$('.garagingZipCode_Row').addClass('hidden');
		$('.garagingZipCode_Error').addClass('hidden');
    } else {
        //if atleast one column is checked the whole row should be visible.
		$('.garagingZipCode_Row').removeClass('hidden');
    }
}

function showHideGaragingAddress(altGaragingBox) {
	
	if ($(altGaragingBox).prop('checked')) {
		
		var rows = $('.garagingZipCode_Row');
		rows.removeClass('hidden');
		alignTableRow($(rows[0]), $(rows[1]));

		var rows = $('.garagingZipCode_Error');
		rows.removeClass('hidden');
		alignTableRow($(rows[0]), $(rows[1]));
	} else if ($(".altGaragingInd:checked").length == 0) {
		
		$('.garagingZipCode_Row').addClass('hidden');
		
		$('.garagingZipCode_Error').addClass('hidden');
	}
}

function setupSwappableDropDown(swappable) {
	
	var swappableValue = $('.swappableValue', swappable);
	var ddId = 'select#dd_' + swappableValue.attr('id');
	var dd = $(ddId, swappable);
	var value = swappableValue.val();
	dd.val(value);
	
	*//**
	// SelectBoxIt adjustment
	var ddd = dd.data("selectBoxIt");
	if (ddd != null) {
		ddd.selectOption(value);
	}
	$('#' + ddId + 'SelectBoxIt')[0].val(value);
	$('#' + ddId + 'SelectBoxIt').each(function() {
		adjustSelectBoxItWidth($(this));
	});
	**//*
	
	swapDropDown(dd, false, false);
}

function swapDropDownTables(tableClass, swapSelector, columnIndex, forceDropDownHide) {
	
	$('.' + tableClass + ' > tbody > tr > td:nth-child(' + parseInt(columnIndex) + ') > .dropDownSwap' + swapSelector).each(function () {
		swapDropDown($(this), forceDropDownHide, true);
	});
}

function swapDropDown(dropDownSwap, forceDropDownHide, resetValues) {
	var hideDropDown = forceDropDownHide;
	if (! hideDropDown) {
		var options = $('option', dropDownSwap);
		var optionCount = options.length;
		hideDropDown = optionCount == 0;
		
		if (! hideDropDown && optionCount == 1) {
			hideDropDown = $(options[0]).val() == '';
		}
	}
	
	var $dropDownSwap = $(dropDownSwap);
	var ddColumn = $dropDownSwap.parent();
	var ddRow = ddColumn.parent();
	var rowIndex = ddRow.index();
	
	var freeFormSwap = $('.freeFormSwap', ddColumn);
	var $freeFormSwap = $(freeFormSwap);
	
	if (hideDropDown) {
		if (resetValues && ! $dropDownSwap.hasClass('hidden') && $dropDownSwap.val() != "") {
			$freeFormSwap.val($dropDownSwap.val());
		}
		showHideFieldId(dropDownSwap[0].id, $dropDownSwap, false);
		if ($freeFormSwap.hasClass('hidden')) {
			$freeFormSwap.removeClass('hidden');
		}
	} else {
		if (resetValues && ! $freeFormSwap.hasClass('hidden')) {
			$dropDownSwap.val($freeFormSwap.val());
		}
		showHideFieldId(dropDownSwap[0].id, $dropDownSwap, true);
		if (! $freeFormSwap.hasClass('hidden')) {
			$freeFormSwap.addClass('hidden');
		}
	}
	
	alignTableRow($('#rowHeaderTable > tbody > tr:nth-child(' + (rowIndex + 1) + ')'), ddRow);
}

function storeSwappableValue(swappable) {
	
	var freeFormSwap = $('.freeFormSwap', swappable);

	if (freeFormSwap != null && freeFormSwap.length > 0) {
		var fieldToStore = null;
		if (! $(freeFormSwap[0]).hasClass('hidden')) {
			fieldToStore = freeFormSwap;
		} else {
			fieldToStore = $('.dropDownSwap', swappable);			
		}
		var fieldId = fieldToStore.attr('id');
		var fieldIdSS = fieldId.substring(3);
		var fieldVal = fieldToStore.val();
		var storedId = '#' + fieldIdSS;
		var storedField = $(storedId, swappable);
		storedField.val(fieldVal);
	}
}

function alignRows() {
	
	alignRowsById('rowHeaderTable', 'mainContentTable');
}

function addVehicle(event) {
	
	
	if (parseInt($('#vehicleCount').val()) == 10) {
		confirmMessage("A policy can have a maximum of 10 vehicles");
		return;
	} else {
		
		//SrinivasS: Usethis addColumnIndex and performd id based as opposed to class based selectors.
		var addColumnIndex = $('#vehicleCount').val();

		var vehicleCount = $('#vehicleCount');
		
		//add span tag with id to first td for error row to make sure id present with square brackets.
		//this id is useful in replaceHTMLIndices function in multicolumn.js for finding index
		//FIXME:SrinivasS Check this why is it needed when adding New vehicle everytime... should be done only for the first td of each row and for only first vehicle <tr>. 
		$(".errorRow").each(function(){
			if ($(this).find('td:first').find('span').length <= 0) {
				$(this).find('td:first').append('<span id="errorColSpan[0]"></span>');
			}
		});
		
		addSlidableColumn(event, 'addDelColumn', vehicleCount,
				$('#slidingFrameId'), $('#mainContentTable'), $('#firstVehicle'), VEHICLES_PER_PAGE);
		
		slideThisVehicleEnd(event);
		
		//$('.vehicleId:last').val('');
		$('select.vehicleType').last().val(PRIVATE_PASSENGER_CD).trigger('changeSelectBoxIt');
		$('#vin_'+addColumnIndex).removeAttr('onkeyup');
		$('#vin_'+addColumnIndex).removeAttr('onkeydown');
		$('#vin_'+addColumnIndex).css("color","black");
		
		//since the Dropdowns for MAKE<MODEL<BODY are dynamic lookups, we have to empty the items for the dropdown.
		$('#dd_make_'+addColumnIndex).empty().append('<option value="">--Select--</option>').trigger('changeSelectBoxIt');
		$('#dd_model_'+addColumnIndex).empty().append('<option value="">--Select--</option>').trigger('changeSelectBoxIt');
		//$('#dd_bodyTypeCd_'+addColumnIndex).empty().append('<option value="">--Select--</option>').trigger('changeSelectBoxIt');
		
		//AntiTheftValues Setup 
		//FIXED: The same vehicle Index is copied to all Antitheft columns.
		$('.antiTheftValues:last').html('');
		$('.antiTheftStatus:last').html('None selected');
		
		//Alternate Garage:
		//clear Garage Address and make it ready for New Entry.
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressSelected .gaTitle' ).html('');
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressSelected' ).addClass('hidden');
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressNew' ).removeClass('hidden');
		
		//TODO: fixes need...Insurable Interest Type dropdown. SAVE and Another having issues.
		$('#additionalInterests_'+addColumnIndex+'_aiCount').val(0);
		
		var addNewText = '<tr><td></td><td><a class="SubmitTertiaryButton editInsurableInterest" id="editInsurableInterest_'+addColumnIndex+'" href="#">'
			             +'<span>+ Financial Interest</span></a></td></tr>';
		$('#additionalInterestsData_'+addColumnIndex).html(addNewText);
		
		 //$('input.vinInput').last().attr('value','');
		 //$('input.clsYear').last().attr('value','');
		 
		//refactored as below for YMM
		 emptySelect( $('select.clsMake').last());
		 $('input.clsMake').last().attr('value','');
		 $('input.swappableValue').attr('value','');
		 
		 emptySelect($('select.clsModel').last());
		 $('input.clsModel').last().attr('value','');
		 $('input.swappableValue').attr('value','');
		 
		 emptySelect($('select.bodyTypeCd').last());
		 $('input.bodyTypeCd').last().attr('value','');
		 $('input.swappableValue').attr('value','');
		 
		 //added newly as above is clearing the n-1th child values.
		 
		 emptySelect( $('select.clsMake').last());
		 $('input.clsMake').last().attr('value','');
		 $('input.swappableValue').attr('value','');
		 
		 
		 //newly Added. if Principally Operated has only one driver, then default is selected
		 var principalOperatorElement =  $('select.principalOperatorId').last();
		 if ($('option', principalOperatorElement).length == 2) {
				 // Only one item plus the - Select- option)
			    principalOperatorElement.prop('selectedIndex', 1);
			    principalOperatorElement.trigger('changeSelectBoxIt');
		}
		 
		//make YMM elements empty and fresh:
		// Get the COLUMN <TD>  that needs to reset
		//$(.swappableField:last)
		
		var vehicleIndexToClone = vehicleCount.val()-1;
		$('#dd_make_'+ vehicleIndexToClone).emtpy();
		$('#ff_make_'+ vehicleIndexToClone).val('');
		$('#make_'+ vehicleCount).val('');
		 
		// $('#model_'+ vehicleCount).val('');
		
		
		$(' > .swappableField:last > input:hidden', '.multiTable > tbody > tr').val('');
	
		$('input.clsMake:last').val('');
		var ymmSelect = $('select.clsMake.ymmSelect').last();
		emptySelect(ymmSelect);
		ymmSelect.val('').trigger('changeSelectBoxIt');
		
		$('input.clsModel:last').val('');
		ymmSelect = $('select.clsModel.ymmSelect').last();
		emptySelect(ymmSelect);
		ymmSelect.val('').trigger('changeSelectBoxIt');
		
		*//** NOTE - we are no longer defaulting the garaging address fields to the residential address.
		 * The garaging address is now just for the alternate garaging address
		 *//*
		//$('.garagingId:last').val('');
		//$('.garagingZip:last').val('');
		//$('.garagingState:last').val('');
		//$('.garagingAddress:last').val('');
*//** 
		$('.garagingZip:last').val($('#residentialZipCode').val());
		$('.garagingState:last').val($('#residentialState').val());
		$('.garagingAddress:last').val($('#residentialddress').val());
		processZipTownResults($('#residentailTowns').val().split(','), $('.garagingTown:last'));
**//*
		$(".vehicleHeaderInfo:last").html("#" + vehicleCount.val() + "-");
		
		
		//set VehicleID for newly added Vehicle for Endorsement Mode as we would rely on this for updating the Cache/XML.
		if ( isEndorsement() ) {
			$('#vehicleId_' +  addColumnIndex).val(getMaxIdWithIncrement());
			$('#endorsementVehicleAddedInd_' + addColumnIndex).val("Yes");
		} else {
			$('#endorsementVehicleAddedInd_' + addColumnIndex).val('');
		}
		

		bindColumn('multiTable', 'last-child');
		
		//enableColumnFields(addColumnIndex);
		////enableFields(cols);
		//conditionallyShowHideFields(addColumnIndex);
		
		showHideNewColumnFields(addColumnIndex);
		
		updateVehicleScrollPanel('#scrollPanel');

		$('#mainContent tbody tr').find('.swappableField:last-child').each(function() {
			//$(this).addClass('result');
			setupSwappableDropDown(this);
		});
		
		// set tabindex for added column
		setTabIndex($('#vehicleCount').val(), $('#vehicleCount').val());
		
		alignRows();
			
	}
}


function replaceVehicle(vehicleToReplaceElement) {
	
	//TODO: Reset the column values as per the specs. what needs to be retained and cleared.
	  1. User chooses to replace a vehicle that qualifies for replace function.
		2. User hits the Replace link
		3. Upon hitting the link, 
			A. vehicle type is retained from the vehicle being replaced.
			B. Garaging zip defaults to the same as vehicle being replaced
			C. vehicle primary use defaults to the same as the vehicle being replaced.
			D. Vehicle lookup will be required for MA. VIn/Vehicle lookup required for NON MA.
			E. Principal Operator/Additional Interest/Excluded Operator/and all other vehicle specific questions will not default. 
			F. Coverage of the REPLACED vehicle is retained."
	
	// CLEAR THE HEADER TEXT
	
	var vehicleIndex =  $(vehicleToReplaceElement).attr("id").substring('replace_vehicle_'.length);
	        
	$("#vehicleHeaderInfo_" + vehicleIndex).html("#" + (parseInt(vehicleIndex) +  1) );
	
	//data fields..
    $('#dataSourceCd_' + vehicleIndex).val('');
    
    //Vin Related.
    $('#vin_'+vehicleIndex).removeAttr('onkeyup');
	$('#vin_'+vehicleIndex).removeAttr('onkeydown');
	$('#vin_'+vehicleIndex).css("color","black");
	
	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
	//should enable for Replace
	$('#excludedOperators_'+ vehicleIndex).prop('disabled', false);
	
	resetSelectiveFields(vehicleIndex)
		
	//Added newly for Replace functionality to reset the premium.
	var ratedIndicator =  $('#ratedInd').val();
	if(isEndorsement()) {    	
		var originalPremAmt = $('#premAmt').val();
		resetPremium(ratedIndicator,originalPremAmt);
	}    	
		
}

function resetSelectiveFields(vehicleIndex) {
	
	//var ignoreElementsArray =["vehicleType","altGaragingInd","primaryUseCd" ,"garagingAddressCls" ,"altGaragingInd"];
	
	 $('#mainContentTable tbody tr').find('td:eq(' + vehicleIndex + ')').each( function() {
		  
		 		//clear the value for selective elements
		        // It is required that alterage Garage address zip should retain to vehicle being replaced.
				$(this).find('input:not(.garagingAddressCls,.altGaragingInd) , select:not(.primaryUseCd) ,  checkbox:not(.altGaragingInd) ').each( function() {
					
					if($(this).is('input') || $(this).is('select')) { // text box and select
						
						$(this).val('').prop('disabled', false);
						
						if($(this).is('select:not(select[multiple])')) {
							
							//for make/model/body the dropdown values needs to be emptied.
							if($(this).hasClass('clsMake') || $(this).hasClass('clsModel')) {
								
								emptySelect($(this));
							}
							
							$(this).trigger(changeSelectBoxIt);
						 }
				    } else if($(this).is('input:checkbox')) { //check box
				    	$(this).attr('checked', false).prop('disabled', false);;
				    }	
					
					if($(this).is('select[multiple]')){
						addDropdownCheckListForCol(this);
					}
			});
	  });

}

function deleteVehicle(deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	
	if (parseInt($('#vehicleCount').val()) == 1) {
		confirmMessageWithTitle("Invalid Vehicle Delete", "You can't delete the last vehicle");
		return;
	} else {
	    $('#question #yes').bind('click.vehicleDelete', function() { 
			var deletedId = $('#vehicleId_' + columnIndex, deleteColumn).val();
			
			if ($('#endorsementVehicleAddedInd_' + columnIndex).val() != 'Yes') {
			   recordDeletion(deletedId);
			}
			
			deleteVehicleColumn(columnIndex);
			
			deleteScrollableColumns(columnIndex, 'multiTable',
					$('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
			
			
			
			bindColumn('multiTable', 'gt(' + (columnIndex - 1) + ')');

			updateVehicleScrollPanel('#scrollPanel');
			
			alignRows();

		    $('#question #yes').unbind('click.vehicleDelete');
	    });

        //var deletingVehicle = $('#vehicleHeaderInfo_' + columnIndex).text();
	    //var deleteMsg = "Confirm Vehicle Delete "+ deletingVehicle + ", Are you sure you want to delete this vehicle?";
	    //questionMessageWithTitle(deleteMsg , "Are you sure you want to delete this vehicle?");
	    //questionMessageWithTitle("Confirm Vehicle Delete", "Are you sure you want to delete this vehicle?");

		 questionDeleteMessageWithTitle("Confirm Vehicle Delete", "Are you sure you want to delete this vehicle?", columnIndex);
	}
}

//TODO:need to set the button label not the value...There is a defect 
//#33301 which calls for new design of the modal.. work then..
function questionDeleteMessageWithTitle(messageTitle, messageText ,columnIndex){
	
    if (messageTitle != null && messageTitle.length > 0) {
		$('#question #title').html(messageTitle);
	}
    
	$('#question #message').html(messageText);

	$.blockUI({
		message : $('#question'),css : {width : '275px'}
	});

	$("#question #yes").val('Yes-Delete');

	$('#question #yes').unbind('click');

	$('#question #yes').click(function() {

		$.unblockUI();

		deleteVehicleColumn(columnIndex);

		return true;
	});

	$('#question #no').unbind('click');

	$('#question #no').click(function() {
		$.unblockUI();
		return false;
	}); 
}

function deleteVehicleColumn(columnIndex) {
	
	var deletedId = $('#vehicleId_' + columnIndex).val();
	
	if ($('#endorsementVehicleAddedInd_' + columnIndex).val() != 'Yes') {
	   recordDeletion(deletedId);
	}
	
	deleteScrollableColumns(columnIndex, 'multiTable', $('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
	
	//IF the first Column being deleted. then columnSelector for BindColumn should not be td:gt(-1);
	var columnSelector =  'gt(' + (parseInt(columnIndex) - 1) + ')';
	
	if(parseInt(columnIndex) == 0) {
		columnSelector = null ;
	}
	
	bindColumn('multiTable', columnSelector);
	
	updateVehicleScrollPanel('#scrollPanel');
	
	alignRows();
}


function recordDeletion(deletedId) {
	
	if (deletedId != "") {
		var vehicleVars = $('#hiddenVehicleVariables');
		var deletedItems = $('.deletedVehicles', vehicleVars);
		if (deletedItems.length == 0) {
			vehicleVars.append('<input id="deletedVehicles_0" class="deletedVehicles" type="hidden" value="" name="deletedVehicles[0]">');
		} else {
			vehicleVars.append($(deletedItems[0]).replaceIndices(deletedItems.length));
		}
		deletedItems = $('.deletedVehicles:last', vehicleVars);			
		deletedItems.val('' + deletedId);	
	}
}



function performModelLookup(year, make, modelElement,
			successFunction, errorFunction) {
	
	emptySelect(modelElement);

	if (year != null && year > 0 && make != null && make.length > 0) {
		var lookupData = {};
		lookupData.year = year;
		lookupData.make = make;
		var jsonData = JSON.stringify(lookupData);
		
		blockUser();
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/vehicles/lookupModels",
	        type: "post",
	        data: jsonData,
	        dataType: 'json',
	        // callback handler that will be called on success
	        success: successFunction,
	        // callback handler that will be called on error
	        error: errorFunction,
	        // callback handler that will be called on completion
	        // which means, either on success or error
	        complete: function(){
	            // enable the inputs
	        	$.unblockUI();
	        }
	    });
	}
}

function modelLookupSuccess(modelElement) {
	return function(response, textStatus, jqXHR) {
		processModelLookupSuccess(response, textStatus, jqXHR, modelElement);
	};
}

function processModelLookupSuccess(response, textStatus, jqXHR, modelElement) {
	populateModelDropDown(response, modelElement);

	swapDropDown(modelElement, false, true);
}

function modelLookupFailure(modelElement) {
	return function(jqXHR, textStatus, errorThrown){
		processModelLookupFailure(jqXHR, textStatus, errorThrown, modelElement);
	};
}

function processModelLookupFailure(jqXHR, textStatus, errorThrown, modelElement) {
    // log the error to the console
    console.log("The following error occured: "+  textStatus, errorThrown);

	swapDropDown(modelElement, false, true);
}

function performZipTownLookup(zip, townElement) {
	
	*//**
	var lookupData = {};
	lookupData.year = year;
	lookupData.make = make;
	var jsonData = JSON.stringify(lookupData);
	**//*
	
	blockUser();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/lookup/zipTowns/zip/" + zip,
        type: "post",
        dataType: 'json',
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
            processZipTownResults(response, townElement);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
            // log the error to the console
            console.log(
                "The following error occured: "+
                textStatus, errorThrown
            );
        },
        // callback handler that will be called on completion
        // which means, either on success or error
        complete: function(){
            // enable the inputs
        	$.unblockUI();
        }
    });

}

function populateMakeDropDown(options, makeElement) {
	emptySelect(makeElement);
	for (var i = 0; i < options.length; i++) {
		if (i < options.length) {
			makeElement.append('<option value="' + $.trim(options[i].key) + '">' + options[i].value + '</option>');
		}
	}	
}

function populateModelDropDown(options, modelElement) {
	
	emptySelect(modelElement);
	
	for (var i = 0; i < options.length; i++) {
		if (i < options.length) {
			modelElement.append('<option value="' + options[i] + '">' + options[i] + '</option>');
		}
	}
		
	// Assume it needs to be enabled
	//selectElement.prop('disabled', false);
	
	if ($('option', selectElement).length == 2) {
		// Only one item was returned (plus the empty option)
		// Select it and disable
		selectElement.prop('selectedIndex', 1);
		selectElement.prop('disabled', 'disabled');
	}

	// SelectBoxIt adjustment
	//selectElement.trigger('changeSelectBoxIt');
	*//**
	selectElement.data("selectBoxIt").refresh();
	$('#' + selectElement[0].id + 'SelectBoxIt').each(function() {
		adjustSelectBoxItWidth($(this));
	});
	**//*
}


function populateGaragingCitySelect(options, selectElement) {
	
	var vehIndex = getIndexOfElementId(selectElement);
	
	emptySelect(selectElement);
	for (var i = 0; i < options.length; i++) {
		if (i < options.length) {
			selectElement.append('<option value="' + options[i].key + '">' + options[i].value + '</option>');
		}
	}
	
	// Assume it needs to be enabled
	selectElement.prop('disabled', false);
	
	if ($('option', selectElement).length == 2) {
		// Only one item was returned (plus the empty option)
		// Select it and disable
		selectElement.prop('selectedIndex', 1);
		//selectElement.prop('disabled', 'disabled');
		$('#aiForm').append('<input type="hidden" id="garagingTown_"'+vehIndex'  name="vehicles['+vehIndex+'].garagingAddress.cityName" value="'+ options[1].key '"/>');
	}

	// SelectBoxIt adjustment
	selectElement.trigger('changeSelectBoxIt');
	*//**
	selectElement.data("selectBoxIt").refresh();
	$('#' + selectElement[0].id + 'SelectBoxIt').each(function() {
		adjustSelectBoxItWidth($(this));
	});
	**//*
}

function processZipTownResults(results, townElement) {
	
	if (results.length == 0) {
		results[0].key = 'Out of State';
		results[0].value = 'Out of State';
	}
	
	populateGaragingCitySelect(results, townElement);
}

function lookupVehicles() {
	performVehicleLookup('.vinInput');
}

function lookupAVehicle(lookupId) {
	
	var vehicleIndex = lookupId.substring('vehicleLookup_'.length);
	performVehicleLookup('#vin_' + vehicleIndex);
}

function performVehicleLookup(vehicleSelector) {
	
	var lookupData = gatherLookupData(vehicleSelector);
	var jsonData = JSON.stringify(lookupData);
	
	blockUser();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/vehicles/lookup",
        type: "post",
        data: jsonData,
        dataType: 'json',
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
            processLookupResults(response);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
            // log the error to the console
            console.log(
                "The following error occured: "+
                textStatus, errorThrown
            );
        },
        // callback handler that will be called on completion
        // which means, either on success or error
        complete: function(){
            // enable the inputs
        	$.unblockUI();
        }
    });

}

function gatherLookupData(vehicleSelector) {
	
	// Store all swappable fields. There's no harm in doing this in column-specific mode
	$('.swappableField').each(function() {		
		storeSwappableValue(this);
	});

	var data = {};
	data.lookupData = [];
	
	$(vehicleSelector).each(function() {
		var vehicleIndex = getVehicleIndex($(this).attr('id'));
		//SSirigineedi: Fix: ALL vehicle lookup should be executed for only PPA and nonChecked YMM indicator
		//Not sure where this requirment is resting but, this has to done as above for having data integrity as this is causing issues.
		
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();
		var isYMMOverride = $('#makeModelOverrideInd_'+vehicleIndex).prop('checked');
		
		if(vehicleType == PRIVATE_PASSENGER_CD && !isYMMOverride ) {
			
			var vin = $(this).val();
			if (vin != null && vin.length > 0) {
				var vehicle = {};
				vehicle.vehicleIndex = vehicleIndex;
				vehicle.request = {};
				vehicle.request.vinRequestFlag = true;
				vehicle.request.vin = vin;
				data.lookupData.push(vehicle);
			} else {
				var year = $('#modelYear_' + vehicleIndex).val();
				var make = $('#make_' + vehicleIndex).val();
				var model = $('#model_' + vehicleIndex).val();

				if (year != null && year.length > 0 &&
						make != null && make.length > 0 &&
						model != null && model.length > 0) {
					var vehicle = {};
					vehicle.vehicleIndex = vehicleIndex;
					vehicle.request = {};
					vehicle.request.vinRequestFlag = false;
					vehicle.request.year = parseInt(year);
					vehicle.request.make = make;
					vehicle.request.model = model;
					data.lookupData.push(vehicle);				
				}
			}
		}
		
	});
	
	return data.lookupData;
}

function processLookupResults(lookupResults) {
	
	
	var showReverse = false;
	
	$('#reverseVINResults').html("");
	var vehicleType;
	
	for (var i = 0; i < lookupResults.length; i++) {

		if (lookupResults[i].lookupSucceededFlag) {
			if (lookupResults[i].request.vinRequestFlag) {
				processVINResult(lookupResults[i].lookupResults, lookupResults[i].vehicleIndex);
			} else {
				showReverse = processReverseVINResult(lookupResults[i], i) || showReverse;
			}
			//validateMake("ff_make_1",i);
		} else {
			//TODO:IF, YEAR & NCICMAKE are null ie> Not Valid VIN, then no results. show the inline message 
			showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.noresults', $('#defaultMulti').outerHTML(),
					                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
		}
		
		if (lookupResults[i].request.vinRequestFlag) {
			//ie> Request is based on VIN.
			if(lookupResults[i].lookupSucceededFlag) {
				
				vehicleType = lookupResults[i].lookupResults.Vehicle_Type;
				
				if(vehicleType == 'Passenger' || vehicleType == 'Truck') {
					processVINResult(lookupResults[i].lookupResults, lookupResults[i].vehicleIndex);
					clearColumnInLineError("#vehicleLookup_"+lookupResults[i].vehicleIndex);
					
				} else {
					showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.notPPAType', $('#defaultMulti').outerHTML(),
                            lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
                   // return; 
				}
				
			} else {
				//IF, VIN lookup has failed/ Not Valid VIN,/no results. show the inline message under VIN.
				showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.noresults', $('#defaultMulti').outerHTML(),
						                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				//return;
			}
					
		} else {
			//ie> Request is YMM lookup for VIN
            if(lookupResults[i].lookupSucceededFlag) {
            	showReverse = processReverseVINResult(lookupResults[i], i) || showReverse;
            	clearColumnInLineError("#vin_"+lookupResults[i].vehicleIndex);
            	clearColumnInLineError("#ff_model_"+lookupResults[i].vehicleIndex);
            	clearColumnInLineError("#vehicleLookup_"+lookupResults[i].vehicleIndex);
			} else {
				//“Year, Make Model lookup failed, please use Year, Make Model override function or enter a valid VIN”. show the inline message under MODEL. 
				showClearInLineErrorMsgsWithMap('ff_model_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.YMMlookup.noresults', $('#defaultMulti').outerHTML(),
							                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				//return;
			}
		}
	}
	
	if (showReverse) {
		openReverseVIN(lookupResults);		
	}
	
	showHideReturnedData();
	alignRows();
}

function processVINResult(lookupResults, vehicleIndex) {
	
	$('#dataSourceCd_' + vehicleIndex).val('RMV');
	
	$('#vin_' + vehicleIndex).val(lookupResults.Vin);
	$('#vin_' + vehicleIndex).data("previous-value", lookupResults.Vin);
	
	$('#modelYear_' + vehicleIndex).val(lookupResults.Year);
	
	$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).change().removeClass('preRequired');
	//TODO: Later
	if(lookupResults.List_Price != '') {
		$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).prop('disabled', true);
	} else {
		$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).prop('disabled', false);
	}

	$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
	$('#highTheftInd_' + vehicleIndex).val(lookupResults.High_Theft_Code);
	$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
	$('#symbol_' + vehicleIndex).val(lookupResults.Symbol);
	$('#weight_' + vehicleIndex).val(lookupResults.GrossVehicleWeight);	
	$('#symbolPip_' + vehicleIndex).val(lookupResults.PIP_MED_Symbol_Code);	
	$('#vrgColl_' + vehicleIndex).val(lookupResults.VRG_COLL);	
	$('#vrgComp_' + vehicleIndex).val(lookupResults.VRG_COMP);	
	$('#airbagsInd_' + vehicleIndex).val(lookupResults.Vehicle_Airbags);	
	$('#performanceTypeCd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
	
	// We need to perform lookups for Make and Model drop downs and set the selected value.
	var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
	performVehicleMakeLookup(lookupResults.Year,  vehicleMakeElement,
							vinMakeLookupSuccess(lookupResults, vehicleIndex, vehicleMakeElement),
							makeLookupFailure(vehicleMakeElement));
	
	
	var modelElement = $('#dd_model_' + vehicleIndex);
	performModelLookup(lookupResults.Year, lookupResults.NCICMake, modelElement,
							vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement),
							modelLookupFailure(modelElement));
	
	// Based on the Rusults data, if YMM is not available,
	
	//resetVehicleTitle(vehicleIndex);
    //enableColumnFields(vehicleIndex);
	
	enableColumnFields(vehicleIndex);
}

function processVINResult(lookupResults, vehicleIndex) {
	
	$('#dataSourceCd_' + vehicleIndex).val('RMV');
	updateGeneralFields(updateGeneralFieldsSuccess(lookupResults, vehicleIndex));
	
	var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
	performVehicleMakeLookup(lookupResults.Year,  vehicleMakeElement,
			vinMakeLookupSuccess(lookupResults, vehicleIndex, vehicleMakeElement),
			makeLookupFailure(vehicleMakeElement));
	
	
	var modelElement = $('#dd_model_' + vehicleIndex);
	performModelLookup(lookupResults.Year, lookupResults.NCICMake, modelElement,
			vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement),
			modelLookupFailure(modelElement));
	
}

function vinMakeLookupSuccess(lookupResults, vehicleIndex, makeElement) {
	return function(response, textStatus, jqXHR) {
		processVinMakeLookupSuccess(response, textStatus, jqXHR,
				lookupResults, vehicleIndex, makeElement);
	};
}

function updateGeneralFields (){
	
	$('#vin_' + vehicleIndex).val(lookupResults.Vin);
	$('#modelYear_' + vehicleIndex).val(lookupResults.Year);
	
	$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price);
	$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
	$('#highTheftInd_' + vehicleIndex).val(lookupResults.High_Theft_Code);
	$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
	$('#symbol_' + vehicleIndex).val(lookupResults.Symbol);
	$('#weight_' + vehicleIndex).val(lookupResults.GrossVehicleWeight);	
	$('#symbolPip_' + vehicleIndex).val(lookupResults.PIP_MED_Symbol_Code);	
	$('#vrgColl_' + vehicleIndex).val(lookupResults.VRG_COLL);	
	$('#vrgComp_' + vehicleIndex).val(lookupResults.VRG_COMP);	
	$('#airbagsInd_' + vehicleIndex).val(lookupResults.Vehicle_Airbags);	
	$('#performanceTypeCd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
}


function vinMakeLookupSuccess(lookupResults, vehicleIndex, makeElement) {
	return function(response, textStatus, jqXHR) {
		processVinMakeLookupSuccess(response, textStatus, jqXHR, lookupResults, vehicleIndex, makeElement);
	};
}

function processVinMakeLookupSuccess(response, textStatus, jqXHR, lookupResults, vehicleIndex, makeElement) {

	processMakeLookupSuccess(response, textStatus, jqXHR, makeElement);
	
	$('#make_' + vehicleIndex).val(lookupResults.NCICMake);
	$('#ff_make_' + vehicleIndex).val(lookupResults.NCICMake);
	
	makeElement.val(lookupResults.NCICMake).trigger('changeSelectBoxIt');
	
	//If vin lookup has resulted in new Make which is not available in dropdown, then append that as option.	
	checkThenAppendNewMakeOption(makeElement,lookupResults.NCICMake, lookupResults.Make) ;
	
	updateVehicleHeaderInfo(vehicleIndex);
}

function checkThenAppendNewMakeOption(makeElement, makeVal, makeDesc){
	
	if(makeElement.val() == "" && makeVal != ""){
		makeElement.append('<option value="' + makeVal  + '" selected="selected">' + makeDesc + '</option>');
	}
}


function vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement) {
	return function(response, textStatus, jqXHR) {
		processVinModelLookupSuccess(response, textStatus, jqXHR,lookupResults, vehicleIndex, modelElement);
	};
}

function processVinModelLookupSuccess(response, textStatus, jqXHR, 
		lookupResults, vehicleIndex, modelElement) {

	processModelLookupSuccess(response, textStatus, jqXHR, modelElement);
	
	$('#model_' + vehicleIndex).val(lookupResults.Model);
	$('#ff_model_' + vehicleIndex).val(lookupResults.Model);
	
	modelElement.val(lookupResults.Model).trigger('changeSelectBoxIt');

	//If vin lookup has discrepancy with model lookup, Append the value of Model from VIN lookup in Model dropdown.	
	checkThenAppendModelOption(modelElement, lookupResults.Model);

	$('#bodyTypeCd_' + vehicleIndex).val(lookupResults.Body_Type);
	//$('#ff_bodyTypeCd_' + vehicleIndex).val(lookupResults.Body_Type);
	//$('#dd_bodyTypeCd_' + vehicleIndex).val(lookupResults.Body_Type).trigger('changeSelectBoxIt');
	
	updateVehicleHeaderInfo(vehicleIndex);
	//enableColumnFields(vehicleIndex);
	
	*//**
	 *
The following fields don’t appear to be captured in the current Java objects. We’ll need to determine if they exist in the database, and make the necessary changes to the codebase.

1.	Series
2.	Daytime_running_lamps
3.	Security Device
4.	MASS_Symbol – There are a number of SYMBOL-related fields, but none of them seems to be a good match
5.	ISO_Price New_Symbol – There are a number of SYMBOL-related fields, but none of them seems to be a good match
6.	Mass_Price_New_Symbol – There are a number of SYMBOL-related fields, but none of them seems to be a good match
7.	List_Price
8.	Ton
9.	Cubic Inch displacement
10.	BI_PD_LIAB_Symbol  – There are a number of SYMBOL-related fields. In this case, there are several that are appropriate, and it’s not clear which is the right one.
11.	VinRawData
12.	VinPlusRawData
13.	Return_Code
14.	Error_Status
15.	Time
16.	Cylinders
17.	POLK MATCH – Maintained by the Lookup Service itself?

	 *//*
	
	
	 * 
The following fields appear to have appropriate fields, but we need to confirm that these are correct

1.	Antilock Brakes –DB alias: ANTI_LOCK_BRAKE_CD, Java field: antiLockBrakeCd
2.	High_Theft Code  - DB alias: HIGH_THEFT_IND, Java field - highTheftInd
3.	Restraint_Type  - DB alias: SAFETY_RESTRAINT_TYPE, Java field -  safetyRestraintType. Currently noted as “Inquiry Specific”, so it may not exist in the database at this point
4.	Performance –DB alias: PERFORMANCE_TYPE_CD, Java field:  performanceTypeCd
5.	Symbol –DB alias: SYMBOL, Java field: symbol
6.	Gross Vehicle Weight – DB alias: WEIGHT, Java field: weight
7.	PIP_MED_Symbol  –DB alias: SYMBOL_PIP, Java field: symbolPip
8.	VRG_COLL –DB alias: VRG_COLL, Java field: vrgColl
9.	VRG_COMP  –DB alias: VRG_COMP, Java field: vrgComp
10.	Vehicle_Airbags  –DB alias: AIRBAGS_IND"), Java field:   airbagsInd
11.	Performance Indicator  –DB alias: PERFORMANCE_CUSTOMIZATION_IND, Java field: performanceCustomizationInd
12.	Performance Indicator Code – Same as Performance / PERFORMANCE_TYPE_CD above ???

	 * 
	 
	$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
	$('#highTheftInd_' + vehicleIndex).val(lookupResults.High_Theft_Code);
	$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
	$('#symbol_' + vehicleIndex).val(lookupResults.Symbol);
	$('#weight_' + vehicleIndex).val(lookupResults.GrossVehicleWeight);	
	$('#symbolPip_' + vehicleIndex).val(lookupResults.PIP_MED_Symbol_Code);	
	$('#vrgColl_' + vehicleIndex).val(lookupResults.VRG_COLL);	
	$('#vrgComp_' + vehicleIndex).val(lookupResults.VRG_COMP);	
	$('#airbagsInd_' + vehicleIndex).val(lookupResults.Vehicle_Airbags);	
	$('#performanceTypeCd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
	*//** tjmcd - This does not appaer to be correct
	$('#performanceCustomizationInd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
	**//*
	
	resetVehicleTitle(vehicleIndex);
	
	enableColumnFields(vehicleIndex);
}

function checkThenAppendModelOption(modelElement, missingModel){
	if(modelElement.val() == "" && missingModel != ""){
		modelElement.append('<option value="' + missingModel + '" selected="selected">' + missingModel + '</option>');
	}
}

function processReverseVINResult(lookupResult, index) {
	
	var reverseCount = 0;
	var lastKey = '';
	var vehicleIndex = lookupResult.vehicleIndex;
	
	var resultText = '<div>&nbsp;</div><div>Vehicle # ' + vehicleIndex + '&nbsp;' + getVehicleHeader(vehicleIndex) + 
		'</div><div><table><tr><th>Select</th><th>Body Style</th><th># Cylinders</th><th>Symbol</th><th>Comp Symbol</th><th>Coll Symbol</th><th>VIN Prefix</th><th>List Price</th><th>ABS</th><th>Restraint</th><th>High Theft</th></tr>';
	
	for (var key in lookupResult.lookupResults) {
		reverseCount++;
		lastKey = key;
		
		resultText += '<tr><td><input type="radio" name="select_' + index +'" value="' + key + '"></td><td>' + 
			lookupResult.lookupResults[key].Body_Type +
			'</td><td>CYLINDER</td><td>' + 
			lookupResult.lookupResults[key].Symbol +
			'</td><td>' + 
			lookupResult.lookupResults[key].VRG_COMP +
			'</td><td>' + 
			lookupResult.lookupResults[key].VRG_COLL +
			'</td><td>' + 
			key +
			'</td><td>' + 
			lookupResult.lookupResults[key].List_Price +
			'</td><td>' + 
			lookupResult.lookupResults[key].Antilock_Brakes +
			'</td><td>' + 
			lookupResult.lookupResults[key].Restraint_Type +
			'</td><td>' + 
			lookupResult.lookupResults[key].High_Theft_Code +
			'</td></tr>';
	}
	
	resultText += '</table></div>';
	
	if (reverseCount == 1) {
		processVINResult(lookupResult.lookupResults[lastKey], vehicleIndex);
	} else if (reverseCount > 1) {
		$('#reverseVINResults').html($('#reverseVINResults').html() + resultText);		
	}
	
	return reverseCount > 1;
}

function openReverseVIN(lookupResults) {

	$("#reverseVINDlg #lookupResults").val(JSON.stringify(lookupResults));
	
	$("#reverseVINDlg").modal('show');		
}

function saveReverseVIN() {
	
	var selections = $("#reverseVINResults input:checked");
	if (selections.length > 0) {
		
		var lookupResults = JSON.parse($("#reverseVINDlg #lookupResults").val());
		
		selections.each(function () {
			var selectedKey = $(this).val();
			var selectedID = $(this).attr('name');
			var result = lookupResults[getVehicleIndex(selectedID)];
			processVINResult(result.lookupResults[selectedKey], result.vehicleIndex);
		});
	}	
	$("#reverseVINDlg").modal('hide');		
}

function cancelReverseVIN() {
	$("#reverseVINDlg").modal('hide');		
}

function editAntiTheft(antiTheftID) {
	$('div#errormessage').empty();
	var index = antiTheftID.substring('editAntiTheft_'.length);
	$("#antiTheftVehicleIndex").val(index);
	$('#antiTheftVehicleHeader').html(getVehicleHeader(index));
	
	$(".antiTheftCheckbox").each(function() {
		var selection = $("#antiTheftDevices_" + index + "_" + this.id);
		$(this).prop('checked', selection.length > 0 && selection.val() == 'true');
	});
	
	$("#antiTheftDlg").modal('show');
}

function validateAntiTheft(antiTheftObj) {
	var selectedCount = 0;
	$(".antiTheftCheckbox").each(function() {		
		var selected = $(this).prop('checked');
		if (selected) {
			selectedCount++;
		}
		
		if(selectedCount > 6){
			 $(antiTheftObj).attr("checked", false);
			 $('div#errormessage').append("Only upto 6 selections allowed");
			 return;
		}else{
			$('div#errormessage').empty();
		}
		
		if(selected && selectedCount > 1 && $(this).attr('id') == 'NONE'){
			 $(antiTheftObj).attr("checked", false);
			 $('div#errormessage').append("If 'None' Selected, no other device can be selected.!");
			 return;
		}else{
			$('div#errormessage').empty();
		}
	});
}



function saveAntiTheft() {
	
	var index = $("#antiTheftVehicleIndex").val();
	var elementsToAdd = '';
	
	var selectedCount = 0;
	$(".antiTheftCheckbox").each(function() {
		var selected = $(this).prop('checked');
		if (selected) {
			selectedCount++;
		}
		
		var atType = this.id;
		var selection = $("#antiTheftDevices_" + index + "_" + atType);
		if (selection.length > 0) {
			// If the input exists for Anti-Theft type, set its checked state
			selection.val(selected);
		} else if (selected) {
			// Otherwise, if the Anti-Theft type is checked, create the necessary input
			var element = '<input id="antiTheftDevices_' + index + '_' 
			+ atType + '" type="hidden" value="true" name="vehicles[' + index + '].antiTheftDevices[\''
			+ atType + '\'].selected">';
		    elementsToAdd += element;
			var element1 = '<input id="antiTheftDevices_' + index + '_' 
			+ atType +'_atid" type="hidden" value="" name="vehicles[' + index + '].antiTheftDevices[\''
			+ atType + '\'].vehicleAntiTheftId">';
			
			var element2 = '<input id="antiTheftDevices_' + index + '_' 
			+ atType + '_atSeqNum" type="hidden" value="" name="vehicles[' + index + '].antiTheftDevices[\''
			+ atType + '\'].antiTheftSeqNum">';
			
			var element3 = '<input id="antiTheftDevices_' + index + '_' 
			+ atType + '_atDeviceTypeCd" type="hidden" value='+atType+' name="vehicles[' + index + '].antiTheftDevices[\''
			+ atType + '\'].antiTheftDeviceTypeCd">';
			
			var element4 = '<input id="antiTheftDevices_' + index + '_' 
				+ atType + '" type="hidden" value="true" name="vehicles[' + index + '].antiTheftDevices[\''
				+ atType + '\'].selected">';
			
			var allInputsElmnts = element1+element2+element3+element4;
			
			elementsToAdd += allInputsElmnts;

		}
	});
	
	if (elementsToAdd.length > 0) {
		var values = $("#antiTheftContents_" + index + " .antiTheftValues");
		var valuesHtml = $("#antiTheftContents_" + index + " > .antiTheftValues").html();
		values.html(values.html() + elementsToAdd);
	}
	
	var countStatus = $("#antiTheftContents_" + index + " .antiTheftStatus");
	if (selectedCount == 0) {
		countStatus.html('None selected');
	} else {
		countStatus.html(selectedCount + ' device(s) selected');		
	}

	$("#antiTheftDlg").modal('hide');	
}

function cancelAntiTheft() {
	
	$("#antiTheftDlg").modal('hide');
}

function clearForm() {	
	
	document.aiForm.name.value = '';
	document.aiForm.policyKey.value = '';
}



// Inline validations
function addRemoveVehicleRow(row, addIt) {
	var headerBody = $('#rowHeaderTable > tbody');
	
	if (addIt) {
		addErrorRow(row, headerBody, true);
	} else {
		removeErrorRow(row, headerBody);					
	}
}
function validateCostNewAmt(costNewAmt, columnIndex) {
	return validateCostNewRequiredWithMap(costNewAmt, 'costNewAmt.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
}

function validateGaragingAddress(garagingAddress, columnIndex) {
	return validateRequiredWithMap(garagingAddress, 'garagingAddress.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateGaragingCity(garagingCity, columnIndex) {
	return validateRequiredWithMap(garagingCity, 'garagingCity.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);		
}

function validateGaragingState(garagingState, columnIndex) {
	return validateRequiredWithMap(garagingState, 'garagingState.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateGaragingZipCode(garagingZipCode, columnIndex) {
	return validateRequiredWithMap(garagingZipCode, 'garagingZipCode.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateMake(make, columnIndex) {
	return validateRequiredWithMap(make, 'make.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateModel(model, columnIndex) {
	return validateRequiredWithMap(model, 'model.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleYear(year, columnIndex) {
	return validateYearWithMap(year, 'Yes', 'modelYear.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
}

function validateNewUsedInd(newUsedInd, columnIndex) {
	
	return validateNewUsedIndRequiredWithMap(newUsedInd, 'newUsedInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
	
	return validateRequiredWithMap(newUsedInd, 'newUsedInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validatePerformanceCustomizationInd(performanceCustomizationInd, columnIndex) {
	return validateRequiredWithMap(performanceCustomizationInd, 'performanceCustomizationInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validatePrimaryUseCd(primaryUseCd, columnIndex) {
	return validateRequiredWithMap(primaryUseCd, 'primaryUseCd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validatePrincipalOperatorId(principalOperatorId, columnIndex) {
	return validateRequiredWithMap(principalOperatorId, 'principalOperatorId.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleLeasedInd(vehicleLeasedInd, columnIndex) {
	return validateRequiredWithMap(vehicleLeasedInd, 'vehicleLeasedInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleType(vehicleType, columnIndex) {
	return validateRequiredWithMap(vehicleType, 'vehicleType.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
}

function validateVehicleValue(vehicleValue, columnIndex) {
	return validateRequiredWithMap(vehicleValue, 'vehicleValue.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validatePreInspection(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'preInspectionRequiredDesc.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVin(vin, columnIndex) {
	
	return validateRequiredWithMap(vin, 'vin.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function VinLookupRequired(vin, columnIndex) {
	//New Requirement
	//If Model Year, Make and/or Model is blank and YMM Override is not checked, regardless of VIN lookup status, 
	//do NOT protect any of the Year,  Make, Model or YMMOverride fields, Clear any “Successful Vin Lookup Flags, 
	// require either an override or successful Vin Lookup prior to rating:  
	//Inline message below vin “Please enter required fields and complete vehicle look up or use the Year Make Model override function”
	
	//Lookup Required
	var make = $("#make_"+columnIndex).val();
	var model= $("#model_"+columnIndex).val();
	var year = $("#modelYear_" + columnIndex).val();

	//TODO:
}

function validateVinRequirement(vin, columnIndex) {
	//New Requirement
	//If Model Year, Make and/or Model is blank and YMM Override is not checked, regardless of VIN lookup status, 
	//do NOT protect any of the Year,  Make, Model or YMMOverride fields, Clear any “Successful Vin Lookup Flags, 
	// require either an override or successful Vin Lookup prior to rating:  
	//Inline message below vin “Please enter required fields and complete vehicle look up or use the Year Make Model override function”
	var make = $("#make_"+columnIndex).val();
	var model= $("#model_"+columnIndex).val();
	var year = $("#modelYear_" + columnIndex).val();

	//TODO:
}



function addErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' + errorRow.id + '_Header"><td>&nbsp;</td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}


function removeErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}

*//**
function validateVehicleLookupData() {
	
	var dataOK = true;
	
	$(".vinNumber").each(function() {
		if (dataOK && this.value == '') {
			var index = this.id.substring(4, this.id.length-1);
			var year = $('#year[' + index + ']');
			var model = $('#model[' + index + ']');
			var make = $('#make[' + index + ']');
			dataOK = year.val() != '' && model.val() != '' && make.val() != '';
		}
	});
	
	return dataOK;
}
**//*

function handleSubmitFailure(result) {
	
	*//**
	// clear any existing error
	clearPageError('.pageError');		
	**//*
	
	*//**
	if (errorCount > 0) {
		errorMessageID = 'aiui.aiForm.editPage.all';
		showPageError('.pageError', errorMessageID);
	}
	**//*
}

function handleSubmit(event) {
	
	var seqNum = 1;
	$('#mainContentTableHead .vehicleSeqNum').each(function() {
		$(this).val(seqNum++);
	});
	
	setPrefillDataUpdatedIndicator('vehicles');
	
	// Enable all fields so the values submit
	$('input:disabled').prop('disabled', false);
	$('select:disabled').prop('disabled', false);
}

function validateNewUsedIndRequiredWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {

	
	var typeVal =  $("#vehTypeCd_" + index).val();
	var errorMessageID = '';
	
	if(isEmpty($(field).val()) && typeVal !=null && typeVal == PRIVATE_PASSENGER_CD){
		
		var modelYear = $("#modelYear_" + index).val();
		var currentYear = new Date().getFullYear();
		if(currentYear && modelYear){
	        if(modelYear >= currentYear - 2){
	        	errorMessageID = strErrorTag + '.' + "required";
	        }else{
	        	errorMessageID = '';
	        }
	    }
	}
	
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);
}

function validateCostNewRequiredWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	var errorMessageID = isCostNew($(field).val(), 'Yes');
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
		$(field).val("");
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);

}

function isCostNew(costNewVal, strRequired){
	
	if (strRequired == 'Yes') {
		
		if ((costNewVal == null) || (costNewVal == "")){
			return 'required';
		}
	}
	if (costNewVal != null && costNewVal.length > 0) {
		if (! isNumber(costNewVal)){
			return 'NotANumber';
		} else {
			
			if(parseInt(costNewVal) < 1 )  {
				return 'nonZero';
			}
		}
	}
	return '';
}


function isCostNew(strVal, strRequired){
	
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


function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var lastIndx = 0;
   	if(strId != undefined){
	    var n = strId.lastIndexOf('_');
	    lastIndx = strId.substring(n + 1);
   	}
    return lastIndx;
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

function validateFinancialInterest(zip, address, city){
	
	var isError = false;
	
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

*/