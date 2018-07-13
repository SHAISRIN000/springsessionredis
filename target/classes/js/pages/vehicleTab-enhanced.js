jQuery(document).ready(function() {
	
	//TBD 06-24-2015: Remove all console.log(..),Clean up js remove any unused variable, commented code, indentation etc etc.. 
	
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	// Adjust margins if error is displayed
	if($('#pageAlertMessage').length > 0) {
		$('.vehiclePageHeader').css('margin-top', -43);
		$('#slidingFrameId').css('margin-top', 0);
		$('#rowHeaderTableContainer').css('margin-top', 50);
	}
	
	showOrHidePrefillLink();
	
	//rama changes
	if($('#openRMVSection').val() == 'Y') {
		expandCollapseRows('returnedData');
	}	
	
	
	$('.garagingTownName').each(function(){
			var defGarageTown = $('#defaultGargeTown').val();
			//console.log('setting default town = '+defGarageTown);
			$(this).val(defGarageTown).trigger('chosen:updated').trigger('chosen:styleUpdated');
		
	});
	
	
	//Based on the QUOTE or Endorsement certain rows shouldn't should show up. Refer Policy isApplicationOrEndorsement()
	var isApplnOrEndrsmnt = isApplicationOrEndorsement();
	
	if(isApplnOrEndrsmnt){
	$('.altTownsExt').each(function(){
		var garageTownId = $(this).attr('id');
		var pos = garageTownId.split('_');
		var state = $('#garagingState_'+pos[1]).val();
		if(state!='MA' && isValidValue(state) && isValidValue(stateMap[state])){
			$('#garagingAddressData_'+pos[1]+' .garagingAddressSelected .gaTitle' ).text(stateMap[state]);
		}
	});
	}
	//if(isEndorsement()) {
		// set defaults for PreInspection when page first loads
		$('.preInspectionRequiredDesc').each(function(){
			setPreInspectionDefault(this);
		});
	//}
	
	 // 51529 - Odometer Data - Greyed out yet user can click in the data field and has blue rim around field - 
	 // when user clicks backspace to see if they can delete the number in the field - they are taken to client tab -
	 // keep it here and once it passes move to one of global js as this is happening for all read only/disabled fields
	 var rx = /INPUT|SELECT/i;
	 $(document).bind("keydown keypress", function(e){
	    	if( e.which == 8 ){ // 8 == backspace
	    		if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
	    			e.preventDefault();
	            }
	        }
	 });
	 
	 //Fix for TD#54857 to allow only numeric to be entered
	 $(".customizedEquipAmt").bind({'keyup keypress': function(event) {		   
		          if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
		    var regex = new RegExp(/[^0-9]/g);
		    var containsNonNumeric = this.value.match(regex);
		    if (containsNonNumeric)
		        this.value = this.value.replace(regex, '');
	 }});
	    
	if(!isApplnOrEndrsmnt) {
//		$('.additionalInterests_Row, .preInspectionRequiredDesc_Row , .snowplowEquipInd_Row').each(function() {
		$('.preInspectionRequiredDesc_Row , .snowplowEquipInd_Row').each(function() {
			$(this).remove();
		});
	}
	if(!isApplnOrEndrsmnt) {
		$('.additionalInterests_Row').each(function() {
			$(this).toggle();
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
		
		// Setup tabbing behavior for newly added column fields
		setupTabbingBehavior();
	});
	
	$("#allVehicleLookup").click(function(){
		lookupVehicles();
	});
	
	$(".expandCollapseRows").click(function(){
		expandCollapseRows(this.id);
	});
		 
	$(".expandCollapseRowsOdometer").click(function(){
		expandCollapseRowsOdometer(this.id);
	});
	
	updateVehicleScrollPanel('#scrollPanel');
	
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
		
	$('#cancelII').click(function(){
		$('div#interestErrormessage').empty();
		$('div#nameErrormessage').empty();
		$('div#zipErrormessage').empty();
		$('div#addressErrormessage').empty();
		$('div#cityErrormessage').empty();
		$('div#stateErrormessage').empty();
		cancelInsurableInterest();
	});
	
	$('#saveGAAndClose').click(function(){
		saveGaragingAddress(true, false, '');
	});
	
	$('#cancelGA').click(function(){
		cancelGaragingAddress();
	});
	
	$("#leftIIScrollBtn").click(function(){
		scrollIILeft('');
	});
	$("#rightIIScrollBtn").click(function(){
		scrollIIRight('');
	});
	
	$("#deleteInsurableInterest").click(function(){
				
		$("#delVehIndex").text($("#iiVehicleId").text());
		$("#delTitleType").text($("#iiTypeCd option:selected").text());
		$("#delTitleName").text($("#iiName1").val());		
		$("#deleteInsurableInterestDlg").modal('show');
	});
	
	$(document).on('click', '#fiDeleteYes', function(){
		$('#deleteInsurableInterestPop').popover('hide');
		deleteInsurableInterest('vehicle'); // !!!
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);
	});
	$(document).on('click', '#fiDeleteCancel', function(){
		$('#deleteInsurableInterestPop').popover('hide');
	});
	$(document).on('click', '#deleteInsurableInterestPop', function(){
		$('#deleteInsurableInterestPop').popover('show');
		$('#fiDeleteContentVhc').text( 'Vehicle '+$("#iiVehicleId").text() );
		$('#fiDeleteContentHolder').text( $("#iiTypeCd option:selected").text()+' : '+$("#iiName1").val() );
		
	});
	
	$("#deleteInsurableInterestDlg #deleteYes").click(function(){
		deleteInsurableInterest('vehicle');
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
	
	//changed this to live 
	$(document).on('keyup keypress', "input.motorCycleCc,input.motorCycleAverageRetailValue,input.motorCycleOriginalCostNew", function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);     
        if (containsNonNumeric)
            this.value = this.value.replace(regex, '');
	});
	
	// Returned data
	window.setTimeout(function(){showHideReturnedData();},1);
	
	//ssirigineedi: update
	//apply all input validation bindings/event handlers necessary for all the Vehicle columns(inputs) in the vehicle main content table.
	//applyBindForVehicleColumns();
	
	window.setTimeout(function(){bindColumns();},1);
		
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
		addErrorRow(this, headerBody, true);
	});
	
	var selector = '.multiTable';
	var cols = $(selector);
	
	window.setTimeout(function(){showHideColumnsData(cols);},1);
	
	//Sssirigineedi: update: The time is right for handling first time thru styles(yellow color) to Validaiton.js.
	//Hence commenting in here.
	//This is from the Validation.js. Each page should call this for setting the Yellow color/Watermark optional on input fields.
	//If needed can overridden/overloaded in their corresponding tabs for additional logic.
	//applyFirstTimeThruStyle('' , $('#firstTimeThru').val());
		
	// Align the row heights in the row header table and the main content table
	window.setTimeout(function(){alignRows();},1);

	if ( isEndorsement() ) {
		if ($("#landingBubbleEndorsementUserAction").val() == EndorsementUserAction.AddVehicle) {
			var event = jQuery.Event( "click"); // set default event
			addVehicle(event);
		}
		//Added for Endorsement Vehicle Eligibility 47051
		$(document).on("click", ".returnEndr", function(e){
			//extra check to make sure it is only ENDR
			var policySourceCd = $('#policySourceCd').val();
			if (policySourceCd == 'ENDORSEMENT') {
				//make call to delete pending amendment - only for prime end
				$('#endorsementVehicleEligibilityErrorsModal').modal('hide');
				deletePendingAmendment(redirectLandingPage);
			}
		});
		
		$('.antiTheftContents').each(function(){
			
			var vehicleIndex = this.id.substring(18,19);
			var selectedCount = 0;
			
			if($('#antiTheftDevices_' + vehicleIndex + '_CAT1').val() == "true"){
					selectedCount++;
			}
			if($('#antiTheftDevices_' + vehicleIndex + '_CAT2').val() == "true"){
				selectedCount++;
			}
			if($('#antiTheftDevices_' + vehicleIndex + '_CAT3').val() == "true"){
				selectedCount++;
			}
			if($('#antiTheftDevices_' + vehicleIndex + '_CAT4').val() == "true"){
				selectedCount++;
			}
			if($('#antiTheftDevices_' + vehicleIndex + '_CAT5').val() == "true"){
				selectedCount++;
			}
			if($('#antiTheftDevices_' + vehicleIndex + '_WID').val() == "true"){
				selectedCount++;
			}
			
			if (selectedCount == 0) {
				selectedCount = "0";
			}else {
				selectedCount = selectedCount + ' device(s)';		
			}
			
			$("#antiTheftContents_" +  vehicleIndex + " .antiTheftSelectedDetails" + " .antiTheftSelectedCountDesc").text(selectedCount  + " selected");
		});
	}
	
	
	//window.scrollTo(-20, -20);
	// To scroll the page up while tabing.
	$( "select[id^='vehTypeCd_']" ).focus(function(){
		window.scrollTo(0, 0);
	});
	
	//set tab index for all vehicles	
	setTabIndex("1", $('#vehicleCount').val());
	
	/* tabIndex fix for logo - Remove this block when logo taxIndex is corrected for all pages via pure html */
	$('#logo').parent().attr('tabIndex', 6);
	$('#pageAlertMessage #openErrorModal').attr('tabIndex', 101);
	
	setupTabbingBehavior();
	
	$('.excludedOperators').each(function() {
			var vehicleIndex = getVehicleIndex(this.id);
			$('#excludedOperator_' + vehicleIndex).val($('#excludedOperators_'+vehicleIndex +" :selected").length);
			//TD#71563 - AI - Named Driver Exclusion enhancement - Hide-Show-Protect by state/channel
			if(isEndorsement() && $('#hideExcludeOperators').val() == 'true'){
				$('#excludedOperators_'+ vehicleIndex).prop('disabled', true);
			} 
     });
	
	//PA_AUTO
	setDefaultPassiveRestraint('.vinInput');

	//For endorsement focus - focus resets
	if ( !(isEndorsement()) ) {
		//set focus on Prefill if prefill is Shown -- if not then set initial focus on the vehicle column
		if ( $('#showPrefillWindow').val() == 'true' ) {
			$("#spanSelAllAgentData").focus();
		}else{ 
		// sgopalan: setInitialFocus method has been modified to not loop through each tabbale element. 
		// It now seeks and finds the first non-disabled error element using a selector. 
		//Fix for Defect # 40842 - Focus UAT: Error handling on Vehicle Quote -  Clicking "Fix Now" lands user in the wrong field
			setInitialFocus();
		}
	} else {
		setInitialFocus();
	}
	
	//Blocking and Unblocking UI when Ajax Call Starts/ends for controls inside the Vehicle MainContent
	if(!isEndorsement()){
		 $('#vehicleMainContent').ajaxStart(function () {
			 blockUser();
		 });
		 
		 $('#vehicleMainContent').ajaxStop(function () {
			 $.unblockUI();
		 });
	}
	
	/* Leave space for fixed Compelte "so & so" application message */
	if($('#completeApplicationAlert').length == 1 && $('#pageAlertMessage').length == 0) {
		$('#slidingFrameId').css('margin-top', '30px');
		$('#rowHeaderTableContainer').css('margin-top', '78px');
		$('.vehiclePageHeader').css('margin-top', '-10px');
	}
	
	if ( checkPrefillItemsAdded() ) {
		 // display fix now fix later if returns from prefill
		var prefillAddedItemsList = $('#prefillAddedItemsList').val();
		 if (prefillAddedItemsList == 'vehicles') {
			 lookupVehicles();
		 }
		 else {
			 showPrefillAddedItemsEdits();
		 }
		// showPrefillAddedItemsEdits(); Fix for defect 53419
	 } 

	if($('#prefillNewlyAddedItemsList').val()=='vehicles'){
		var found=false;
		var prefillNewlyAddedItemIndex = $('#prefillNewlyAddedItemIndex').val();
		$('tr.errorRow:not(:hidden)').find('td.inlineErrorMsg').each(function(){
			if(prefillNewlyAddedItemIndex==getIndexOfElementId(this)){
				setFocus(this.id.replace('Error_Col_',''));
				$('#prefillNewlyAddedItemIndex').val('');
				$('#prefillNewlyAddedItemsList').val('');
				found=true;
				return false;
			}
		});
		if(!found){
			var fieldWithError = $('tr.errorRow:not(:hidden)').find('td.inlineErrorMsg').attr('id');
			if(fieldWithError!=null && fieldWithError!=""){
				setFocus(fieldWithError.replace('Error_Col_',''));	
			}	
		}
	}
	
	//Fix for 59688
	if ( $('#valueExceedsErrorFlag').val() == 'Y' ) {
		//alert($('#valueExceedsErrorMsg').val());
		//alert($('.vehEligibilityErrorMsg').text());
		$('.vehEligibilityErrorMsg').text($('#valueExceedsErrorMsg').val());
		$("#vehicleEligibilityErrorsModal").modal("show");
	}
	
	var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitVehicle").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/vehicles';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	//51660 Page Aligment on Bottom of WEB page if off
	$('#formBottom').addClass('hidden');
	showReorderErrorPopups(); 
	// Alert:please keep the below statement as last statement.
	// please include your code above this one
	window.setTimeout(function(){disableOrEnableElementsForReadonlyQuote();},1);
	
	logToDb(" Step 2  Vehicle Tab ready end..");
	
	//MA Plate Transfer fix
	$('.transferPlateNumber').bind("change", function(){
		resetPremiumForAll();	
	});
	initialFormLoadProcessing();
	
});


function setInitialFocus(){
	var vehIndex = $('#vehIndex').val();
	if (vehIndex.length > 0 && isEndorsement()) {
		
		vehIndex = vehIndex.replace("/endorsement", "");
		vehIndex = ""+lookupVehDisplayIndex(vehIndex);		
	}
	
	if(vehIndex.length > 0)
	{
		var selector =  $('#mainContentTable > tbody > tr > td:nth-child('+ vehIndex +')') ;
		var vehColumnElements = $('.tabOrder', selector);
		vehColumnElements.each(function() {
			if(!$(this).attr('disabled')){
				var focusOn= $(this).attr('id');
				if(focusOn && focusOn.length > 0){
					closeSetFocus(focusOn);
				}
				return false;
			}
		});
	}
	else{
		var firstErrorElement = $('.tabOrder.inlineError');
		if(firstErrorElement && firstErrorElement.length > 0) {
			firstErrorElement = firstErrorElement.not('.disabled').first();
			var focusOn = firstErrorElement.attr('id');			
			closeSetFocus(focusOn);
		}
	}
	return false;
}

function lookupVehDisplayIndex(vehIndex) {
	var retVehicleDisplayIndex = 0;	
	$('#mainContentTableHead .vehicleSeqNum').each(function() {
		var vehDispIndex = $(this).val();
		if (vehIndex == vehDispIndex) {			
			retVehicleDisplayIndex = this.id.replace("vehicleSeqNum_","");		
			retVehicleDisplayIndex = parseInt(retVehicleDisplayIndex) + 1;
		}		
	});
	
	return retVehicleDisplayIndex;
}

var tabIndex = 105; // 1-100 is for header. 101-104 is for vehicle page header

function setTabIndex(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);
	
	for (var i = startColumn; i <= endColumn; i++) {
		 // Set tab index for delete icons
		 $('#delete_vehicle_'+(i-1)).attr('tabindex', tabIndex++);
		  
		 var selector =  $('#mainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		 var tabOrderElements = $('.tabOrder' , selector);
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])') && (!$(this).attr('disabled'))) {
				 $(this).attr('tabindex',-1);
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 if(!$(this).hasClass('preInspectionRequiredDesc')){ //to be removed later
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
				 }
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 } else if($(this).is('select[multiple]')) { 
				 $(this).parent().find('.ui-dropdownchecklist-selector').attr('tabindex', tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);
			 }
		  });
	}
	$('.clsVehicleIndex').attr("tabindex", tabIndex++);
	
	// Financial address tabIndex
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
	
	// Alternate Garaging address tabIndex
	$('#gaAddress1').attr('tabindex',tabIndex++);
	$('#gaAddress2').attr('tabindex',tabIndex++);
	
	//52768-Tab Order in Alt Garage Location Box-App Layer
	if($('#stateCd').val() == 'MA'){
		$('#gaZip').next().find('a').attr('tabindex',tabIndex++);
	}else{
		$('#gaZip').attr('tabindex',tabIndex++);	
	}
	
	$('#gaCity').next().find('a').attr('tabindex',tabIndex++);
	$('#gaState').next().find('a').attr('tabindex',tabIndex++);
	$('#saveGAAndClose').attr('tabindex',tabIndex++);
	$('#cancelGA').attr('tabindex',tabIndex++);
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

//window.onload=initialFormLoadProcessing;

window.deletedAntiThefts = [] ;

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
	bindColumn('multiTable', null, null);
}

function bindColumn(tableClass, columnSelector, sAction) {
	var selector = '.' + tableClass;
	var columnPrefix = '';
	var swapSelector = '.swappableField';
	
	var swappableFieldContextSelector  = '.'+tableClass+ '> tbody > tr > td'+swapSelector ;
	
	if (columnSelector != null) {
		selector += ' > tbody > tr';
		columnPrefix = ' > td:' + columnSelector + ' ';
		swappableFieldContextSelector = '.' + tableClass + '> tbody > tr > td'+swapSelector+':last-child';
		if ((sAction == 'Add') && (columnSelector == 'last-child')) {
			//clear error class and error message for copied cells
			clearErrorForAddColumn(columnPrefix, selector);
		}
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
		
	$(".vehicleLookup", cols).on('click',function(){
		lookupAVehicle(this.id);
		$('.vehicleLookup_Row > td').removeClass('lastSelected');
		$(this).parent().addClass('lastSelected');
	});
	
	// Inline validations
	$('.costNewAmt', cols).on('change blur', function(){
		validateCostNewAmt(this, getColumnIndexNoHeader($(this).parent()));
	});
	$('.motorcycleOrMaipAntiTheft', cols).on('change blur', function(){
		if (isMaipPolicy()) {
			var vehicleIndex = getVehicleIndex(this.id);
			var errMsg = "";
			if ($(this).val() == "" ) {
				errMsg = 'antiTheft.browser.inLine.required';
			}
			showClearInLineErrorMsgsWithMap(this.id,errMsg , $('#defaultMulti').outerHTML(), vehicleIndex, errorMessages, addRemoveVehicleRow);
		}
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
	if($('#stateCd').val() == 'MA'){
		$('.garagingZipCode', cols).bind(getValidationEvent(), function(event, result) {		
			result.errorCount += validateGaragingZipCode(this, getColumnIndexNoHeader($(this).parent()));
		});
	}
	
	$('.garagingCityName', cols).bind(getValidationEvent(), function(event, result) {		
		var ndx = getColumnIndexNoHeader($(this).parent());
		resetGaragingAddress(ndx,'CityFlip','');
		result.errorCount += validateGaragingCityName(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	// Make could be dropdown or input text field - will bind validateMake on change event for dropdown and blur for text field
	// assures that validateMake will not be fired twice on text fields, reason for this is dropdown is using chosen plugin which does not accept blur
	$('select.clsMake').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		clearVinOnChange(vehicleIndex);
		processCurrentSelectionChange(this);
		showClearInLineErrorMsgsWithMap('dd_make_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		showClearInLineErrorMsgsWithMap('ff_make_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);	
    	validateMake(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('select.clsMake').bind('blur',function(event){
		validateMake(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('input.clsMake').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		clearVinOnChange(vehicleIndex);
		processCurrentSelectionChange(this);
		validateMake(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('input.clsMake').bind('blur',function(event){
    	validateMake(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	// Model could be dropdown or input text field - will bind validateModel on change event for dropdown and blur for text field
	// assures that validateModel will not be fired twice on text fields, reason for this is dropdown is using chosen plugin which does not accept blur
	$('select.clsModel').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		clearVinOnChange(vehicleIndex);
		processCurrentSelectionChange(this);
		showClearInLineErrorMsgsWithMap('dd_model_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		showClearInLineErrorMsgsWithMap('ff_model_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);	
		validateModel(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('select.clsModel').bind('blur',function(event){
		validateModel(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('input.clsModel').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		clearVinOnChange(vehicleIndex);
		processCurrentSelectionChange(this);
	});
	
	$('input.clsModel').bind('blur',function(event){
		validateModel(this, getColumnIndexNoHeader($(this).parent()));
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
		
		//60333
		if($('#stateCd').val() == 'MA' && isValidValue($(this).val())){
			var index = getFieldIndex(this.id);
			vehLeaseRMVOwnerDetailsMissingMessage(index);
			
		}
	});
	
	//TNC Requirement
	$('.vehicleTncUseInd', cols).bind(getValidationEvent(), function(event, result) {
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();		
		resetPremium(ratedIndicator,originalPremAmt);	
		if(!isQuote() && vehicleType == PRIVATE_PASSENGER_CD && !isMaipPolicy()){
			if($('#vehicleTncUseInd_'+vehicleIndex).val() != 'Yes'){
				result.errorCount += validateVehicleTncUseInd(this, getColumnIndexNoHeader($(this).parent()));
			}
		}
	});
	
	$('.resetPremiumCls').on('change', function(){
		
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);	
	});
	
	
	
	$('.vehicleTncCompanyCd', cols).bind(getValidationEvent(), function(event, result) {
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();		
		resetPremium(ratedIndicator,originalPremAmt);	
		if(!isQuote() && vehicleType == PRIVATE_PASSENGER_CD && !isMaipPolicy()){
			if('Yes' == $('#vehicleTncUseInd_'+vehicleIndex).val()){
				result.errorCount += validateVehicleTncCompanyCd(this, getColumnIndexNoHeader($(this).parent()));		
			}
		}
	});
	
	$('.vehicleTncUsageLevel', cols).bind(getValidationEvent(), function(event, result) {
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();		
		resetPremium(ratedIndicator,originalPremAmt);	
		if(!isQuote() && vehicleType == PRIVATE_PASSENGER_CD && !isMaipPolicy()){
			if('Yes' == $('#vehicleTncUseInd_'+vehicleIndex).val()){
				result.errorCount += validateVehicleTncUsageLevel(this, getColumnIndexNoHeader($(this).parent()));		
			}
		}
	});
	
	$('.vehicleTncDriverName', cols).bind(getValidationEvent(), function(event, result) {
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();		
		resetPremium(ratedIndicator,originalPremAmt);	
		if((!isQuote() || ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) && vehicleType == PRIVATE_PASSENGER_CD && !isMaipPolicy()){
			if('Yes' == $('#vehicleTncUseInd_'+vehicleIndex).val()){
				result.errorCount += validateVehicleTncDriverName(this, getColumnIndexNoHeader($(this).parent()));		
			}
		}
		
		if ($('#yubiEnabled').val() == 'true' && $('#isEndorsement').val() != 'true') {
			if($('#vehicleTncUseInd_'+vehicleIndex).val() == 'Yes'){
				var selectedDriver = $('#vehicleTncDriverName_' + vehicleIndex).val();
				var driverIdIndex = $('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex');
				if (driverIdIndex > 0) {
					//var names = selectedDriver.split(" ");
					var firstName = selectedDriver.substring(0, selectedDriver.lastIndexOf(","));
					var lastName = selectedDriver.substring(selectedDriver.lastIndexOf(",") + 1);
					
					//var driverYubiInd = $('#' + names[0] + '_' + names[1] + '_0').val();
					var driverYubiInd = $('[id="' + firstName + '_' + lastName + '_0"]').val();
					
					// if yubi indicator is not true for the selected driver, show inline error message
					if (driverYubiInd != 'Yes') {						
						result.errorCount += showClearInLineErrorMsgsWithMap(this.id, 
													'vehicleTncDriverName.browser.inLine.yubi.required', 
													$('#defaultMulti').outerHTML(),
													getColumnIndexNoHeader($(this).parent()), 
													errorMessages, addRemoveVehicleRow);
					}
				}
			}
		}
	});
	
	
	// ADD NJ and PA only
	if($('#yubiEnabled').val() == 'true' && ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) {
		$('.vehicleTncUseInd').each(function() {
			var vehicleIndex = getVehicleIndex(this.id);
			if(isEndorsement() && ($("#endorsementVehicleAddedInd_" + vehicleIndex).val().toUpperCase() != "YES" 
								&& $("#endorsementVehicleReplacedInd_" + vehicleIndex).val().toUpperCase() != "YES")) {
				$('#vehicleTncUseInd_' + vehicleIndex).prop('disabled', true).trigger("chosen:updated");
				
				$('#vehicleTncDriverName_' + vehicleIndex).prop('disabled', true).trigger("chosen:updated");
				$('#vehicleTncCompanyCd_' + vehicleIndex).prop('disabled', true).trigger("chosen:updated");
				$('#vehicleTncUsageLevel_' + vehicleIndex).prop('disabled', true).trigger("chosen:updated");				
			} else {
				$('#vehicleTncUseInd_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
				
				$('#vehicleTncDriverName_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
				$('#vehicleTncCompanyCd_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
				$('#vehicleTncUsageLevel_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
			}
		});
	}
	
	$('select.vehicleTncUseInd').bind('change',function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		var vehicleType = $('#vehTypeCd_' + vehicleIndex).val();
		if($('#vehicleTncUseInd_'+vehicleIndex).val() != 'Yes'){
			$('#vehicleTncCompanyCd_' + vehicleIndex).val('').trigger('chosen:updated');
			$('#vehicleTncUsageLevel_' + vehicleIndex).val('').trigger('chosen:updated');
			$('#vehicleTncDriverName_' + vehicleIndex).val('').trigger('chosen:updated');
			
			//Check if policy has more than one TNC selected, else clean up errors
			checkUniqueTNC(this)
		} else {
			// stop user with hardstop message:  To add this coverage, please contact Customer Solutions
			if(isEndorsement() && ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) {
				$('#endorsementVehicleTncYesAddModal').modal('show');
				$('#vehicleTncUseInd_'+vehicleIndex).val('--Select--').trigger('chosen:updated');
				return;
			}
		}
		
		//As per recent CC this message not required
		/*else{
			showClearInLineErrorMsgsWithMap(this.id, 'vehicleTncUseInd.browser.inLine.minlimits',  $('#defaultMulti').outerHTML(),
					vehicleIndex, errorMessages, addRemoveVehicleRow);
		}*/
		showOrHideRowVehicleTncCompanyCd(vehicleType, vehicleIndex, true);
		showOrHideRowVehicleTncUsageLevel(vehicleType, vehicleIndex, true);
		showOrHideRowVehicleTncDriverName(vehicleType, vehicleIndex, true);
	});
	
	// YUBI requirement
//	$('select.vehicleTncDriverName').bind('change',function(event){
//		var vehicleIndex = getVehicleIndex(this.id);
//		if($('#vehicleTncUseInd_'+vehicleIndex).val() == 'Yes'){
//			var selectedDriver = $('#vehicleTncDriverName_' + vehicleIndex).val();
//			var driverIdIndex = $('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex');
//			if (driverIdIndex > 0) {
//				var names = selectedDriver.split(" ");		
//				var driverYubiInd = $('#' + names[0] + '_' + names[1] + '_' + vehicleIndex).val();
//				// if yubi indicator is not true for the selected driver, show inline error message
//				if (driverYubiInd != 'Yes') {				
//					var errorMessageID = 'vehicleTncDriverName.browser.inLine.yubirequired';
//					showClearInLineErrorMsgsWithMap('vehicleTncDriverName_'+vehicleIndex, errorMessageID, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
//				}
//			}
//		}
//	});
		
	$('.rvUsedAsPrimaryResidenceInd', cols).bind(getValidationEvent(), function(event, result) {        
        result.errorCount += validateRVUsedAsPrimaryResidenceInd(this, getColumnIndexNoHeader($(this).parent()));
    });
	//snow plow
	$('.snowplowEquipInd', cols).bind(getValidationEvent(), function(event, result) {
		result.errorCount += validateSnowPlow(this, getColumnIndexNoHeader($(this).parent()));										
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
		$(this).removeClass('preRequired');
	});	
	
	$('.bodyTypeCd', cols).bind(getValidationEvent(), function(event, result) {		
		result.errorCount += validateBodyType(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$('.makeModelOverride', cols).click(function() {
		processMakeModelOverride(this);
		// When the override checkbox is unchecked, clear out the value in Year
		var overrideColumn = $(this).closest('.multiColumnInd');
		
		// tjmcd - Should this become getColumnIndexNoHeader
		var columnIndex = getColumnIndex(overrideColumn);
		var vehicleIndex = columnIndex-1;
		var ymmOverrideInd  = $('#makeModelOverrideInd_'+vehicleIndex).prop('checked');
		var yearVal = $("#modelYear_"+vehicleIndex).val();
		var bodyType = $("#bodyTypeCd_"+vehicleIndex).val();
		if(ymmOverrideInd) {
			$("#modelYear_"+vehicleIndex).val($("#modelYear_"+vehicleIndex).attr('prevval') ? $("#modelYear_"+vehicleIndex).attr('prevval') : '');
			$("#bodyTypeCd_"+vehicleIndex).val($("#bodyTypeCd_"+vehicleIndex).attr('prevval') ? $("#bodyTypeCd_"+vehicleIndex).attr('prevval') : '');
		} else {
			$("#modelYear_"+vehicleIndex).val('');
			$("#modelYear_"+vehicleIndex).attr('prevval', yearVal);
			$("#bodyTypeCd_"+vehicleIndex).val('');
			$("#bodyTypeCd_"+vehicleIndex).attr('prevval', bodyType);
		}
	});
	
	$('.maMakeModelOverride', cols).click(function() {		
		processMakeModelOverride(this);
		// When the override checkbox is unchecked, clear out the value in Year
		var overrideColumn = $(this).closest('.multiColumnInd');
		
		// tjmcd - Should this become getColumnIndexNoHeader
		var columnIndex = getColumnIndex(overrideColumn);
		var vehicleIndex = columnIndex-1;
		var ymmOverrideInd  = $('#ma_makeModelOverrideInd_'+vehicleIndex).prop('checked');		
		var yearVal = $("#modelYear_"+vehicleIndex).val();
		var bodyType = $("#bodyTypeCd_"+vehicleIndex).val();
		if(ymmOverrideInd) {
			$("#modelYear_"+vehicleIndex).val($("#modelYear_"+vehicleIndex).attr('prevval') ? $("#modelYear_"+vehicleIndex).attr('prevval') : '');
			$("#bodyTypeCd_"+vehicleIndex).val($("#bodyTypeCd_"+vehicleIndex).attr('prevval') ? $("#bodyTypeCd_"+vehicleIndex).attr('prevval') : '');
		} else {
			$("#modelYear_"+vehicleIndex).val('');
			$("#modelYear_"+vehicleIndex).attr('prevval', yearVal);
			$("#bodyTypeCd_"+vehicleIndex).val('');
			$("#bodyTypeCd_"+vehicleIndex).attr('prevval', bodyType);
		}
		
		//var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $('#vehTypeCd_'+vehicleIndex).val();
		//var yearVal = $('#modelYear_'+vehicleIndex).val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, false);
	});	
	
	$('.altGaragingInd', cols).each(function() {
		if($('#stateCd').val() == 'MA'){
			if(isValidValue($(this).attr('id'))){
			// 51552 -Vehicle tab - Alternate Garage check box being populated when deleting another vehicle
			if(sAction != 'Delete'){
				var vehIndex  = $(this).attr('id').substring('altGaragingInd_'.length);
				var typeVal = $("#vehTypeCd_" + vehIndex).val();
				setUpAlternatingGarageIndicator(this,typeVal,vehIndex,false,false);
			}
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
	
	
	/*('.garagingCityName',cols).each(function(){
		if($('#stateCd').val() == 'MA'){
			if(isValidValue($(this).attr('id'))){
					var vehIndex  = $(this).attr('id').substring('garagingCityName_'.length);
					$('#garagingCity_'+vehIndex).val($(this).val());
			}
		}
	});
	*/
	
	$(".editAntiTheft", cols).on('click',function(){		
		editAntiTheft(this.id);
	});
	
	$(".antiTheftCheckbox").click(function(){
		validateAntiTheft(this);
	});
	
	$(document).on('click', '.editInsurableInterest', function(){
		editInsurableInterest(this.id);
	});

	$(".editGaragingAddress", cols).click(function(){
		editGaragingAddress(this.id);
	});
	
	//set the VIN input data field for previous-Value comparision to detect change in VIN.
	$(".vinInput", cols).each(function () {
		$(this).data("previous-value", $(this).val());
    });
	
	if(isEndorsement()){
		// set Year, Make Model for pevious value comparison to detect change in VIN
		$(".clsYear", cols).each(function () {
			var vehicleIndex = getVehicleIndex(this.id);
			$("#modelYear_" + vehicleIndex).data('prevYear',$("#modelYear_" + vehicleIndex).val());
	    });
		
		$(".clsMake", cols).each(function () {
			var vehicleIndex = getVehicleIndex(this.id);
			var sVal = $("#make_" + vehicleIndex).val();
			if(sVal != ""){
				$("#make_" + vehicleIndex).data('prevMake',sVal);
			}
	    });
		
		$(".clsModel", cols).each(function () {
			var vehicleIndex = getVehicleIndex(this.id);
			var sVal = $("#model_" + vehicleIndex).val();
			if(sVal != ""){
				$("#model_" + vehicleIndex).data('prevModel',sVal);
			}
	    });
		
		//Added for Endorsement Vehicle Eligibility 47051
		$(".endorsementVehicleEligibilityInd", cols).bind(getValidationEvent(), function(event, result) {		
				result.errorCount += validateEndorsementVehicleEligibility(this, getColumnIndexNoHeader($(this).parent()));
		});
	}
	
	$(".vinInput", cols).on('change' , function (event) {
		formatVIN(this);
		if(!isEndorsement()){
			$('#polLienCatCode').val('');
		}
		processVINChange(this);
		event.stopImmediatePropagation();
    });
	
	$(".yearInput", cols).on('change' , function (event) {
		processYearChange(this);
		event.stopImmediatePropagation();
    });

	
	$(".vehicleHeaderInfo", cols).each(function(){
		var vehicleIndex = getVehicleIndex(this.id);
		updateVehicleHeaderTitle(vehicleIndex);
	});
	
	
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
				//performZipTownLookup(zip, $('#gaCity'), '', '');
				//do the look up for new business and endorsment non maip polices
				if ( (!isEndorsement()) || (isEndorsement() && !isMaipPolicy()) ) {
				performZipTownLookup(zip, $('#gaCity'), '', '');
			}
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
	
	$("#gaMaCity").on("change", function(){
		var stateCd = $('#stateCd').val();
		if(stateCd == 'MA'){
		if(isApplication()){
				//console.log('This is application mode when city is flipped');
		}	
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
			// $("#garagingCity_" + vehIndex).val('');
			
		}
		}
		}
	});
		
	
	$('.excludedOperators').on('change', function(event){
		var vehicleIndex = getVehicleIndex(this.id);
		var noOfExcludedOperators = $('#excludedOperators_'+vehicleIndex +" :selected").length;
		var prevExcludedOperators =$('#excludedOperator_' + vehicleIndex).val();
		$('#excludedOperator_' + vehicleIndex).val(noOfExcludedOperators);
		if(noOfExcludedOperators  > prevExcludedOperators){
			// event.stopPropagation();
			$("#excludeDriverModal").modal("show");
		}
		showClearInLineErrorMsgsWithMap('excludedOperators_'+vehicleIndex, '', $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);

		//PA_AUTO
		var stateCd = $('#stateCd').val();
		if(stateCd == 'PA'){
		var excluded = $('#excludedOperators_'+vehicleIndex).val();
		$('#mainContentTableHead .vehicleSeqNum').each(function() {
				var vehIndexOnTable = $(this).val() - 1;
				if (vehicleIndex != vehIndexOnTable &&
					($('#vehTypeCd_'+vehIndexOnTable).val() == PRIVATE_PASSENGER_CD || $('#vehTypeCd_'+vehIndexOnTable).val() == MOTOR_HOME_CD)){

					$('#excludedOperators_'+vehIndexOnTable).val(excluded).trigger('chosen:updated');
					addDropdownCheckListForCol($('#excludedOperators_'+vehIndexOnTable));					
					var noOfExcludedOperators = $('#excludedOperators_'+vehIndexOnTable +" :selected").length;
					var prevExcludedOperators =$('#excludedOperator_' + vehIndexOnTable).val();
					$('#excludedOperator_' + vehIndexOnTable).val(noOfExcludedOperators);

					showClearInLineErrorMsgsWithMap('excludedOperators_'+vehIndexOnTable, '', $('#defaultMulti').outerHTML(),vehIndexOnTable, errorMessages, addRemoveVehicleRow);
				}		
		});
	}
		
		//46933 - When we select or remove excluded oepraters - premium should reset 
		//if(isEndorsement()) { // commented this out for defect # 46961 	
			var ratedIndicator =  $('#ratedInd').val();
			var originalPremAmt = $('#premAmt').val();
			resetPremium(ratedIndicator,originalPremAmt);
		//} 
		
	});	
	
	$("#gaZip").bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric) {
        	this.value = this.value.replace(regex, '');
        }

	}});
	
	$(".vinInput").bind({'keyup keypress': function(event) {
		
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
		formatVIN(this);
//        var regex = new RegExp(/[^a-zA-Z0-9&]/g);
//        var containsNonAlphaNumeric = this.value.match(regex);
//        if (containsNonAlphaNumeric) {
//        	this.value = this.value.replace(regex, '');
//        }

	}});
	
	
	function formatVIN(currentElement){
		 var regex = new RegExp(/[^a-zA-Z0-9&]/g);
	        var containsNonAlphaNumeric = currentElement.value.match(regex);
	        if (containsNonAlphaNumeric) {
	        	currentElement.value = currentElement.value.replace(regex, '');
	        }
	}
	
	
	//55961 - for Quote too handle yellow fill too
	$(".vinInput", cols).on('focus' , function(e) {
		$(this).removeClass('preRequired');
	});
	
	// Show / hide dependencies
	$(".clsYear", cols).blur(function(){
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
		var yearVal = $(this).val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true);
		showHideNewOrUsed(typeVal, vehicleIndex, false);
	});
	
	//48831 - Clear VIN only if Year changes
	$(".clsYear", cols).change(function(){
		var vehicleIndex = getVehicleIndex(this.id);
        //48992 - Cost new field gets locked down after POLK call and stays locked down.
		$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled',false);
		$('#costNewAmt_'+vehicleIndex).prop('disabled',false).removeClass('preRequired');
		clearVinOnChange(vehicleIndex);
	});
	
	//53796-Vehicle Value field produces HTTP 500 message if user enters non-numeric value in field
	$('.vehicleValue, .costNewAmt').bind({'keyup keypress': function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
		var regex = new RegExp(/[^0-9.]/g);
		var containsNonNumeric = this.value.match(regex);
		if (containsNonNumeric)
			this.value = this.value.replace(regex, '');
	}});
	
	// 53796- Vehicle Value field produces HTTP 500 message if user enters non-numeric value in field
	$(".vehicleValue", cols).blur(function(){
		validateVehicleValue(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	//changing to onchange as apposed to onblur event...
	$(".vehicleType", cols).on('change', function(){
		if ($(this).is("select")) {		
			vehicleTypeChange(this);
			
			/*var vehicleIndex = getVehicleIndex(this.id);
			var typeVal = $(this).val();
			var yearVal = $("#modelYear_" + vehicleIndex).val();
			var policystate=$('#stateCd').val();
			showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true);
			showHidePrimaryUse(typeVal, vehicleIndex, true);
			showHideCostNew(typeVal, vehicleIndex, true);
			showHideVehicleValue(typeVal, vehicleIndex, true);
			if(typeVal == MOTORCYCLE_CD){
							initMCAntiTheft(typeVal, vehicleIndex, true);
			}else{
				initNonMCAntiTheft(typeVal, vehicleIndex, true);
				showHideAntiTheft(typeVal, vehicleIndex, true);
			}
			showHideCustomizedEquipAmt(typeVal, vehicleIndex, true);
			showHideVehicleLeasedInd(typeVal, vehicleIndex, true);
			showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, true);
			showHidePrincipalOperatorId(typeVal, vehicleIndex, true);
			showHideExcludedOperators(typeVal, vehicleIndex, true);
			showHideSnowplowEquipInd(typeVal, vehicleIndex, true);
			showHideNewOrUsed(typeVal, vehicleIndex, true);
			makeModelOverride(typeVal, vehicleIndex, true);
			defaultForRVAsPrimaryResidence(typeVal, vehicleIndex);
			showHideMotorCycleFields(typeVal, vehicleIndex, true);
			showHideVehicleTypePlateTypeEdit(vehicleIndex);
			
			if(policystate=='MA'){
				showHideMassYMMOverride(vehicleIndex);
				showHideUnregisterdVehicle(vehicleIndex);
			}
			
			if(isApplicationOrEndorsement()){
				var checkRow = isEndorsement();
				showHidePreinspectionRequired(false, typeVal, vehicleIndex, checkRow);
			}
			if(isEndorsement()){
				showHideYMMOverride(false, typeVal, vehicleIndex, false);			
			}
			
			if(typeVal == PRIVATE_PASSENGER_CD){
				addPreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
			}else{
				removePreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
			}
			
			showClearInLineErrorMsgsWithMap('bodyTypeCd_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
			showClearInLineErrorMsgsWithMap('vin_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		}*/
		}});
	
	$(".customizedEquipAmt", cols).on('change' , function(e) {
		//47034 -- Default value for customizedEquipAmt is 0.
		//Sending null value will return previous saved value from P*
		resetPremiumForAll();
		if($(this).val() == null || $(this).val() == "") {
			$(this).val('0');
		}
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
		showHideCustomizedEquipAmt(typeVal, vehicleIndex, true);
	}); 
	
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
	
	//TODO: fields default values based on NB / ENDORSEMENT.
	//applyfieldDefaultsBasedOnPolicyFunction();
	$('.garagingZipCode', cols).on('keyup keypress' , function(event) {
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric) {
        	this.value = this.value.replace(regex, '');
        }
	});	
	
	$('.principalOperatorId', cols).on('change', function() {
		var id = this.id; 
		var index = id.substring(id.lastIndexOf("_") + 1);
		var principalOperatorId = $('#principalOperatorId_' + index).val();
		var newprincipalOperatorDOB = $('#principalOperatorDOB_' + principalOperatorId).val();		
		$('#principalOperatorDOB_' + index).val(newprincipalOperatorDOB);
	});
	
	//Add PlateType/VehicleType Validation here
	
	//52915- VEHS: required field not showing inline edit on tab through
	$('select.plateType').bind('change',function(event){
		if ($(this).is("select")) {		
			var index = getFieldIndex(this.id);
			showHideVehicleTypePlateTypeEdit(index);
			//51878 
			/*if(isValidVehPlateType(index) && isValidRmvData(index)){
					lookupAVehicle('vehicleLookup_'+index);
				}*/
		}
	});
	
	$('select.plateType').bind('blur',function(event){
		if ($(this).is("select")) {		
			var index = getFieldIndex(this.id);
			showHideVehicleTypePlateTypeEdit(index);
			//51878 
			/*if(isValidVehPlateType(index) && isValidRmvData(index)){
					lookupAVehicle('vehicleLookup_'+index);
				}*/
		}
	});

	$(".plateNumber", cols).on('blur', function(){
		var index = getFieldIndex(this.id);
		showHidePlateNumberEdit(index);
		//51878
		/*if(isValidVehPlateType(index) && isValidRmvData(index)){
				lookupAVehicle('vehicleLookup_'+index);
		}*/
	});

	$(".unregisteredVehicleIndOverride").click(function() {
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $('#vehTypeCd_'+vehicleIndex).val();
		var yearVal = $('#modelYear_'+vehicleIndex).val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, false);
		showHideMassYMMOverride(vehicleIndex);
		
		if(!$(this).is(':checked')){
			//TD 62278 - Setting value to 'No' if checkbox is unchecked
			$(this).val('No');			
			if(isValidRmvData(vehicleIndex)){
				//56404-AI does not reset to inactive rate when moving a vehicle from unreigstered to registered
				var ratedIndicator =  $('#ratedInd').val();
	    		if(ratedIndicator.toUpperCase() == 'YES'){
	    			var originalPremAmt = $('#premAmt').val();
	        		resetPremium(ratedIndicator,originalPremAmt);
		    	}
				lookupAVehicle('vehicleLookup_'+vehicleIndex);
			}
			
			//MA Plate Transfer requirement
			showHideTransferPlateNumber(typeVal, vehicleIndex, true);
		}else{
			//TD 62278 - Setting value to 'Yes' if checkbox is checked
			$(this).val('Yes');	
			clearInLineColumnError('vehicleLookup_'+ vehicleIndex, $('#defaultMulti').outerHTML(), vehicleIndex);
			//55961 - with so many chnages around same edits(remoiving and putting back again same thing) keeping up with latest defect
			$('#plateNumber_'+vehicleIndex).removeClass('preRequired');
			$('#plateTypeCd_'+vehicleIndex).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			showHidePlateNumberEdit(vehicleIndex);
			showHideVehicleTypePlateTypeEdit(vehicleIndex);		
			
			//MA Plate Transfer requirement
			showHideTransferPlateNumber(typeVal, vehicleIndex, true);
		}
		return true;
	});
	
	/*$('.maMakeModelOverride').click(function() {
		var vehicleIndex = getVehicleIndex(this.id);
		var typeVal = $('#vehTypeCd_'+vehicleIndex).val();
		var yearVal = $('#modelYear_'+vehicleIndex).val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, false);
	});*/
	
	
	$('input.motorCycleCc, input.motorCycleAverageRetailValue,input.motorCycleOriginalCostNew ', cols).on('change blur', function(){
		validateMotorCycleEdits(this, getColumnIndexNoHeader($(this).parent()));
	});
	
	$(document).on("change", "select.motorcycleOrMaipAntiTheft", function(event){
		if ($(this).is("select")) {		
			var antitheftIndex = $(this).attr('id');
			var antiTheftArray  = antitheftIndex.split('_');
			var index = antiTheftArray[1];
			var selectedAntiTheftCategory = $(this).val();
			
			if( isEndorsement() && isMaipPolicy() ) {
				buildAntiTheftMCOrMaip(0,selectedAntiTheftCategory,'',index);
				
			} else {
			if(selectedAntiTheftCategory == 'CAT4'){
				if(parseInt($('#mcAntitheftLen').val()) == 0){
					buildAntiTheftMC(0,selectedAntiTheftCategory,'NONE',index);
				}
				else{
					buildAntiTheftMC(1,selectedAntiTheftCategory,'NONE',index);
				}
			}
			if(selectedAntiTheftCategory == 'NONE'){
				if(parseInt($('#mcAntitheftLen').val()) == 0){
					buildAntiTheftMC(0,selectedAntiTheftCategory,'CAT4',index);
				}
				else{
					buildAntiTheftMC(1,selectedAntiTheftCategory,'CAT4',index);
				}
				}
			}
			}
		
		});
	}

function initMCAntiTheft(vehType, vehicleIndex, showHide){
	var mcDefault = $('#mcOrMaipTypeHolder_pos').html();
	var updatedValue = mcDefault.replaceAll('pos',vehicleIndex).replaceAll('cola','vehicles');
	var nonMcWithIdExists = false;
	//var nonMcPlaceHolder = false;
	
	$("#antiTheftContents_" + vehicleIndex + " .antiTheftValues > .nonMcAntiTheft").each(function(){
		var idName = $(this).attr('id');
		if(idName !=null && idName != undefined && idName.indexOf('atid')!=-1){
			var idValue = $('#'+idName).val();
			if(idValue != null && idValue != undefined && idValue.length>1){
				nonMcWithIdExists = true;
			}
		}
		if($(this).attr('name').indexOf('selected') !=-1){
		$(this).val('false');
		}	
	});
	
	if (nonMcWithIdExists){
		deletedAntiThefts [vehicleIndex] = $("#antiTheftContents_" + vehicleIndex + " .antiTheftValues").html();
	}

	//below check for if
	if( isEndorsement() && isMaipPolicy() ) {
		$('#mcOrMaipTypeHolder_'+vehicleIndex).html(updatedValue); // this id always exists for maip
		//$('#nonMcTypeHolder_'+vehicleIndex).attr('id','mcOrMaipTypeHolder_'+vehicleIndex);
	}else{
	$('#nonMcTypeHolder_'+vehicleIndex).html(updatedValue);
		$('#nonMcTypeHolder_'+vehicleIndex).attr('id','mcOrMaipTypeHolder_'+vehicleIndex);
	}
	
	$('#swapDeleteAntiTheftContents_'+vehicleIndex).html(deletedAntiThefts[vehicleIndex]);
	$('#mcOrMaipAntiTheft_'+vehicleIndex+'_chosen').remove();
	addChosen('mcOrMaipAntiTheft_'+vehicleIndex);
	$('#mcOrMaipAntiTheft_'+vehicleIndex).trigger('chosen:updated');
}

function initNonMCMaipAntiTheft(vehType, vehicleIndex, showHide){
	var mcDefault = $('#maipTypeHolder_nonMcPos').html();
	var updatedValue = mcDefault.replaceAll('nonMcPos',vehicleIndex).replaceAll('cola','vehicles');	
	
	// this id always exists for maip so update
	$('#mcOrMaipTypeHolder_'+vehicleIndex).html(updatedValue); 
	$('#swapDeleteAntiTheftContents_'+vehicleIndex).html(deletedAntiThefts[vehicleIndex]);
	$('#mcOrMaipAntiTheft_'+vehicleIndex+'_chosen').remove();
	addChosen('mcOrMaipAntiTheft_'+vehicleIndex);
	$('#mcOrMaipAntiTheft_'+vehicleIndex).trigger('chosen:updated');
}

function initNonMCAntiTheft(vehType, vehicleIndex, showHide){
	var nonMcDefault = $('#nonMcTypeHolder_pos').html();
	var updatedValue = nonMcDefault.replaceAll('pos',vehicleIndex);
	var mcWithIdExists = false;
	var mcPlaceHolder = false;
	var nonMcWithIdExists = false;
	var nonMcPlaceHolder = false;
	$("#antiTheftContents_" + vehicleIndex + " > .mcMaipAntiTheft").each(function(){
			var idName = $(this).attr('id');
			if(idName !=null && idName != undefined && idName.indexOf('atid')!=-1){
				var idValue = $('#'+idName).val();
				if(idValue != null && idValue != undefined && idValue.length>1){
					mcWithIdExists = true;
				}
			}
			if($(this).attr('name').indexOf('selected') !=-1){
			$(this).val('false');
		}
			
	});
	
	$("#antiTheftContents_" + vehicleIndex + " .antiTheftValues > .nonMcAntiTheft").each(function(){
			var idName = $(this).attr('id');
			if(idName !=null && idName != undefined && idName.indexOf('atid')!=-1){
				var idValue = $('#'+idName).val();
				if(idValue != null && idValue != undefined && idValue.length>1){
					nonMcWithIdExists = true;
					//deletedAntiThefts[vehicleIndex] = $("#antiTheftContents_" + vehicleIndex + " .antiTheftValues").html();
				}
			}
			if($(this).attr('name').indexOf('selected') !=-1){
			$(this).val('false');
		}
	});
	
	if ($('#nonMcTypeHolder_'+vehicleIndex).length == 0){
		mcPlaceHolder = true;
		nonMcPlaceHolder = false;
	}
	else{
		nonMcPlaceHolder = true;
		mcPlaceHolder = false;
	}
		
	$("#antiTheftContents_" +  vehicleIndex + " .antiTheftSelectedDetails" + " .antiTheftSelectedCountDesc").text("0 selected");
	
	if(mcWithIdExists){
		deletedAntiThefts [vehicleIndex]= $("#antiTheftContents_" + vehicleIndex).html();
	} 
	if (nonMcWithIdExists){
		deletedAntiThefts [vehicleIndex] = $("#antiTheftContents_" + vehicleIndex + " .antiTheftValues").html();
	}
	
	if(mcPlaceHolder){
		$('#mcOrMaipTypeHolder_'+vehicleIndex).html(updatedValue);
		$('#mcOrMaipTypeHolder_'+vehicleIndex).attr('id','nonMcTypeHolder_'+vehicleIndex);
		$('#swapDeleteAntiTheftContents_'+vehicleIndex).html(deletedAntiThefts[vehicleIndex]);
	}
	
	if(nonMcPlaceHolder){
		$('#nonMcTypeHolder_'+vehicleIndex).html(updatedValue);
		$('#swapDeleteAntiTheftContents_'+vehicleIndex).html(deletedAntiThefts[vehicleIndex]);
		}
}


function buildAntiTheftMC(antiTheftCount,atType,removingAntiTheftCategory,index){
	var elementsToAdd = '';	
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
		
		if(antiTheftCount ==0){
			$("#antiTheftContents_" + index).html(elementsToAdd);
		}
		else{
			var values = $("#antiTheftContents_" + index);
			 var antiTheftExists = $('#antiTheftDevices_'+index+'_'+atType+'_atDeviceTypeCd').val();
			 if(antiTheftExists == null || antiTheftExists == undefined || antiTheftExists.length<1){
				 $("#antiTheftContents_" + index).html(values.html() + elementsToAdd);
			 }
			 $('#antiTheftDevices_'+index+'_'+atType).val('true');
			 $('#antiTheftDevices_'+index+'_'+removingAntiTheftCategory).val('false');
			}
	}

function buildAntiTheftMCOrMaip(antiTheftCount,atType,removingAntiTheftCategory,index){
	var elementsToAdd = '';	
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
		
		if(antiTheftCount ==0){
			$("#antiTheftContents_" + index).html(elementsToAdd);
		}
		/*
		else{
			var values = $("#antiTheftContents_" + index);
			 var antiTheftExists = $('#antiTheftDevices_'+index+'_'+atType+'_atDeviceTypeCd').val();
			 if(antiTheftExists == null || antiTheftExists == undefined || antiTheftExists.length<1){
				 $("#antiTheftContents_" + index).html(values.html() + elementsToAdd);
			 }
			 $('#antiTheftDevices_'+index+'_'+atType).val('true');
			 $('#antiTheftDevices_'+index+'_'+removingAntiTheftCategory).val('false');
			}
		*/
}

//vehicle Type/ Plate Type edits
function showHideVehicleTypePlateTypeEdit(index){
	//var isUnregisterd = $('#unregisteredVehicleInd_'+index).val();
	/*
		var isPolkLookupInd = $('#polkLookupInd_'+index).val() ;//== 'Yes';
		var isPrefillRMV = $('#dataSourceCd_'+index).val(); //  == 'RMV';
		var isRmvLookupInd = $('#rmvLookupInd_'+index).val();
	*/
	var veh_type = $('#vehTypeCd_'+index).val();
	var plateTypeSelected = $('#plateTypeCd_'+index).val();
	var errorMessageID = '';
	if(!$('#unregisteredVehicleInd_'+index).prop('checked')){
		if(!isValidValue(plateTypeSelected) && veh_type != 'TC'){
			errorMessageID = 'plateTypeCd.browser.inLine.required';
		}else{
			
			if(!isValidVehPlateType(index) && veh_type != 'TC'){
				errorMessageID = 'plateTypeCd.browser.inLine.invalid';
			}
		}
	}
	else{
		if(!isValidVehPlateType(index) && veh_type != 'TC'){
			if(!isValidValue(plateTypeSelected)){
				errorMessageID = '';
			}
			else{
				errorMessageID = 'plateTypeCd.browser.inLine.invalid';
			}
		}
	}
	showClearInLineErrorMsgsWithMap('plateTypeCd_'+index, errorMessageID, $('#defaultMulti').outerHTML(),index, errorMessages, addRemoveVehicleRow);
}


function showHidePlateNumberEdit(index){
	var veh_type = $('#vehTypeCd_'+index).val();
	var plateNumber= $('#plateNumber_'+index).val();
	var errorMessageID = '';
	if(!$('#unregisteredVehicleInd_'+index).prop('checked') && veh_type !== 'TC'){
		if(plateNumber == undefined || plateNumber ==  null || plateNumber.length < 1){
			errorMessageID = 'plateNumber.browser.inLine.required';
		}
	}
	else{
		errorMessageID='';
	}
	showClearInLineErrorMsgsWithMap('plateNumber_'+index, errorMessageID, $('#defaultMulti').outerHTML(),index, errorMessages, addRemoveVehicleRow);
}


function showHideMassYMMOverride(index){
	var veh_type = $('#vehTypeCd_'+index).val();
	var unregistered_ind = $('#unregisteredVehicleInd_'+index).is(':checked');
	if((veh_type == PRIVATE_PASSENGER_CD || veh_type == ANTIQUE_CD || veh_type == MOTORCYCLE_CD) && unregistered_ind){
		var hasclass = $("#maYMMBlock_"+index).hasClass("hideVisibility");
		if(hasclass){
			$("#maYMMBlock_"+index).removeClass("hideVisibility");
		}
	}else{
		$("#maYMMBlock_"+index).addClass("hideVisibility");
		$("#ma_makeModelOverrideInd_"+index).prop('checked',false);
		/*var obj = $("#ma_makeModelOverrideInd_"+index);
		processMakeModelOverride(obj);
		// When the override checkbox is unchecked, clear out the value in Year
		var overrideColumn = $(obj).closest('.multiColumnInd');
		
		// tjmcd - Should this become getColumnIndexNoHeader
		var columnIndex = getColumnIndex(overrideColumn);
		var vehicleIndex = columnIndex-1;
		var ymmOverrideInd  = $('#ma_makeModelOverrideInd_'+vehicleIndex).prop('checked');		
		var yearVal = $("#modelYear_"+vehicleIndex).val();
		var bodyType = $("#bodyTypeCd_"+vehicleIndex).val();
		if(ymmOverrideInd) {
			$("#modelYear_"+vehicleIndex).val($("#modelYear_"+vehicleIndex).attr('prevval') ? $("#modelYear_"+vehicleIndex).attr('prevval') : '');
			$("#bodyTypeCd_"+vehicleIndex).val($("#bodyTypeCd_"+vehicleIndex).attr('prevval') ? $("#bodyTypeCd_"+vehicleIndex).attr('prevval') : '');
		} else {
			$("#modelYear_"+vehicleIndex).val('');
			$("#modelYear_"+vehicleIndex).attr('prevval', yearVal);
			$("#bodyTypeCd_"+vehicleIndex).val('');
			$("#bodyTypeCd_"+vehicleIndex).attr('prevval', bodyType);
		}
		*/
				
	}
}


//3.2.19 update hide unregisterd vehicle for TC
function showHideUnregisterdVehicle(index){
	var veh_type = $('#vehTypeCd_'+index).val();
	if(veh_type =='TC'){
		$('#unregisteredVehicleInd_'+index).prop('checked',false);
		$('#unregisteredVehicleHideShow_'+index).addClass("hideVisibility");
	}
	else{
		$('#unregisteredVehicleHideShow_'+index).removeClass("hideVisibility");
	}
}

function isValidVehPlateType(index){
	var veh_type = $('#vehTypeCd_'+index).val();
	var plate_type = $('#plateTypeCd_'+index).val();
	if(isValidValue(veh_type) && isValidValue(plate_type)){
	if(veh_type == 'AQ' && $.inArray(plate_type, AQ_PlateType)!=-1 ){
		return true;
	}
	if(veh_type == 'PPA' && $.inArray(plate_type, PPA_PlateType)!=-1){
		return true;
	}
	if(veh_type == 'UT' && $.inArray(plate_type, UT_PlateType)!=-1){
		return true;
	}
	if(veh_type == 'MH' && $.inArray(plate_type, MH_PlateType)!=-1){
		return true;
	}
	if(veh_type == 'MC' && $.inArray(plate_type, MC_PlateType)!=-1){
		return true;
	}
	if(veh_type == 'TC' && $.inArray(plate_type, TC_PlateType)!=-1){
		return true;
	}
	if(veh_type == 'TL' && $.inArray(plate_type, TL_PlateType)!=-1){
		return true;
	}
	}
	return false;
}

function isValidRmvData(index){
	var validRmvData = false;
	var plateType = $('#plateTypeCd_'+index).val();
	var plateNumber= $('#plateNumber_'+index).val();
	//	selecting this checkbox allows the user to by-pass the RMV call and 
	// allows quoting for a vehicle that is not registered with the RMV.
	if($('#unregisteredVehicleInd_'+index).is(':checked')){
		return false;
	}
	if(isValidValue(plateType) && isValidValue(plateNumber)){
		validRmvData = true;
	}
	var vin = $('#vin_'+index).val();
	if(isValidValue(vin)){
		validRmvData = true;
	}
return validRmvData;
}


function setUpAlternatingGarageIndicator(garagingCity,typeVal,vehIndex,showHide,ignoreRMVTown){
	var residentialTown = $('#residentialTown').val();
	//var rmvGaragingTown = $('#rmvGarageTown_'+vehIndex).val();
	var garagingCity = $('#garagingCityName_'+vehIndex).val();
	var altGarageInd = $('#altGaragingInd_'+vehIndex).val();
	
	/* What indicator to look for if RMV call is successfull based on that below logic should fire
		is there time when alt grage indicator check box is disabled? is there time when alt garage town drop down is disabled
	 	is below used for RMV
	 */ 
	/*var polkLookupInd = $('#polkLookupInd_'+vehIndex).val();
	var dataSource = $('#dataSourceCd_' + vehIndex).val();
	var rmvLookupInd = $('#rmvLookupInd_'+vehIndex).val();*/
		
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
				// keep up user preference if he removes garaging city no need to update with rmvGaragingTown again
				/*if(rmvGaragingTown != null && rmvGaragingTown != undefined && rmvGaragingTown.length>1){
					$('#garagingCityName_'+vehIndex).val(rmvGaragingTown).trigger('chosen:updated');
					$('#garagingCity_'+vehIndex).val(rmvGaragingTown);
					$('#altGaragingInd_'+vehIndex).prop('checked',true);
				}*/
			}
			//not seeing this logic in FRD any more
			/*if((rmvGaragingTown == undefined || rmvGaragingTown == null || rmvGaragingTown.length <= 1) || ( residentialTown.toLowerCase() != rmvGaragingTown.toLowerCase())){
				$('#altGaragingInd_'+vehIndex).prop('checked',true);
				// ERROR MESSAGE TO SHOW :: resiTownAltGarageTownMismatch
			}*/
		}
		
		//validateGaragingCityName(garagingCity,getColumnIndexNoHeader($('#garagingCityName_'+vehIndex).parent()));
	
		if ($('#altGaragingInd_'+vehIndex).prop('checked')) {
				$('#garagingCityName_'+vehIndex).removeClass('hidden');
				addPreRequiredStyle($('#garagingCityName_'+vehIndex));
				$('#altGaragingInd_'+vehIndex).val('Yes');
			} else  {
				    	// if user unchecks just clear the Address associated and ignore RMV returned garagingTown info
						resetGaragingAddress(vehIndex,'Update','');
				    	$('#garagingCityName_'+vehIndex).val('').trigger('chosen:updated');
				    	$('#garagingCityName_'+vehIndex).addClass('hidden');
				    	$('#garagingCityName_Error_Col_'+vehIndex).empty();
				    	removePreRequiredStyle($('#garagingCityName_'+vehIndex));
				    	$('#altGaragingInd_'+vehIndex).val('');
				    	$('#quoteSelectedState_'+vehIndex).val('');
				    	$('#vehAltGarageTown_'+vehIndex).val('');
		    }
			showHideField('garagingCityName', vehIndex, $('#altGaragingInd_'+vehIndex).is(':checked'));
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

function enableColumnFields(columnIndex) {
	var selector = '.multiTable > tbody > tr > td:nth-child(' + (parseInt(columnIndex) + 1) + ') ';
	showHideColumnsData(selector);
}

function showHideColumnsData(selector) {	
	//55713 - Dont call this on readonly mode, below code enables all fields on window.setTimeOut
	/*if ( $('#readOnlyMode').val() == 'Yes' ) {
		return;
	}*/
	
	// Commented above for Defect# 57985 AW - during Quote only rated driver was listed as an 'Excluded Operator', however not displayed in Polstar as excluded.   
	// and added a timeout on the call to disableOrEnableElementsForReadonlyQuote() in ready function  (Line 412 as of 08/28/2015)
	
	var dataSources = $('.dataSource', selector);
	var vehicleType = $('select.vehicleType', selector);
	var year = $('.clsYear', selector);
	var make = $('.clsMake:not(div)', selector);
	var model = $('.clsModel:not(div)', selector);
	var vinSelector = $('.vinInput', selector);
	//Added newly for PREFIL Source
	//var thirdPartyData = $('.thirdPartyData', selector);
	// Added newly for vehciles successfully looked up in Comprator and landed on AI
	var polkLookup = $('.polkLookup', selector);
	var lookUpSourceCd = $('.lookUpSourceCd', selector);
	
	var rmvPartialDataInd = $('.rmvPartialData',selector);
	var rmvLookup = $('.rmvLookupInd', selector);
	var unregisteredOverride = $('.unregisteredVehicleIndOverride', selector);
	var plateType = $('select.plateType', selector);
	var plateNumber = $('.plateNumber', selector); 
	var stateCd = $('#stateCd').val();
	//var isUnregSpecial = false;
	var ymmOverride = '';
	if(stateCd == 'MA'){
		ymmOverride = $('.maMakeModelOverride', selector);
	}
	else{
		ymmOverride = $('.makeModelOverride', selector);
	}
	for (var i = 0; i < dataSources.length; i++) {
		var vin = $(vinSelector[i]).val();
		var $ymmOverride = $(ymmOverride[i]);
		var isYMMOverride = $ymmOverride.prop('checked');
		
		var $unregOverride = $(unregisteredOverride[i]);
		var isUnregistered = $unregOverride.prop('checked');
		if(isUnregistered == null || isUnregistered == undefined || isUnregistered == ''){
			isUnregistered = false;
		}
		//FIXME: THIS should not be just RMV. It should ECP for NJ.
		var isRMV = $(dataSources[i]).val() == 'RMV';
		//Added newly for PREFIL Source
		var isDataFromPrefill = $('#vehicleThirdPartyDataId_' + i).val() != '';
		// lookUp scource code tells whethere vehicle is prefill vehicle or not.
		var isPrefillSourced = $(lookUpSourceCd[i]).val() == 'PREFILL';
		// Added newly for vehciles successfully looked up in Comprator and landed on AI
		var isPolkLookupInd = $(polkLookup[i]).val() == 'Yes';
		
		//TD# 57690 - Added to handle  the dit for the reverse lookup- it should not fire the lookiup required reverse look up done
		var isReverseLookupInd = $(polkLookup[i]).val() == 'Rev';
		// RMV lookup MA
		var isRmvLookupInd = $(rmvLookup[i]).val() == 'Yes';
		
		//THE YMM protection should be same way as VehicleLookup / Vehicle Selected from PREFILL
		var protectYMMFlag = false;
		
		//56099 - If RMV lookup failed, and Polk Successful - The VIN field should not be protected.  It s/b changable.  
		// (I(f RMV call successful - the VIN should be protected).
		var protectVINFlag = false;
		
		
		var partialRMVData = $(rmvPartialDataInd[i]).val() == 'Yes';
		
		if(stateCd =='MA'){
			//what-ever VIN length RMV Returns accept as is 
			protectYMMFlag = (isRMV || isDataFromPrefill || isRmvLookupInd) ? true : false;
			//56099
			protectVINFlag = (isRMV) ? true :false;
		}
		else{
			protectYMMFlag = ((isRMV || isDataFromPrefill || isPolkLookupInd)  && ! isYMMOverride && vin.length == 17) ? true : false;
		}
		var vTypeCd = $('#vehTypeCd_' + i).val();		
		
		if(vTypeCd == PRIVATE_PASSENGER_CD || vTypeCd == ANTIQUE_CD || vTypeCd == MOTORCYCLE_CD){			
			if(isUnregistered){
				protectYMMFlag = ((isRMV || isDataFromPrefill || isPolkLookupInd)  && ! isYMMOverride && vin.length == 17) ? true : false;
				//isUnregSpecial = true;
			}
		}
		
		//$(vehicleType[i]).prop('disabled', (isRMV || isDataFromPrefill || isPolkLookupInd) ? true : false).trigger('chosen:updated');
		//3.2.23 vehicle type can be chnaged during quote or Application work flow .For endorsement it should be Read only for MA
		$(vehicleType[i]).prop('disabled', ((stateCd =='NJ' || isEndorsement() || stateCd =='PA') &&				//PA_AUTO - added PA state 
											(isRMV || isDataFromPrefill || isPolkLookupInd)) ? true : false).trigger('chosen:updated');
		
		if(stateCd == 'MA'){
			$ymmOverride.prop('disabled', protectYMMFlag ? true : false);
		}else{
				$ymmOverride.prop('disabled', ((isRMV || isDataFromPrefill || isPolkLookupInd) && (vin.length == 17)) ? true : false);
			}
		// This checkbox is open for entry until a successful RMV call is made.  Once a successful RMV call is made (by VIN or by plate #/plate type), 
		// the checkbox remains read-only and unselected
		$(unregisteredOverride[i]).prop('disabled', (!isUnregistered && stateCd =='MA' && isRmvLookupInd) ? true : false);
				
		//56099
		//$(vinSelector[i]).prop('disabled', (stateCd =='MA' && protectYMMFlag) ? true : false);
		$(vinSelector[i]).prop('disabled', (stateCd =='MA' && protectVINFlag) ? true : false);
		
		$(year[i]).prop('disabled', protectYMMFlag);
		
		//55072 - partial RMV data
		//54072-AI Endorsement - plate type and number not grayed out when doing add vehicle-do not touch this chnage-05/07/2015
		//52708 - MA 2.4 [Endorsement] Plate type is defaulted to "–Select– "in END mode for transaction [Update VEH]
		$(plateType[i]).prop('disabled', (stateCd == 'MA' && !partialRMVData  && protectYMMFlag && !isUnregistered)?true:false).trigger('chosen:updated');
		$(plateNumber[i]).prop('disabled', (stateCd == 'MA' && !partialRMVData && protectYMMFlag && !isUnregistered)?true:false).trigger('chosen:updated');
		
//		if(isUnregSpecial){
//			$(plateType[i]).prop('disabled', false).trigger('chosen:updated');
//			$(plateNumber[i]).prop('disabled', false).trigger('chosen:updated');
//		}
	
		//starting Jquery jQuery 1.6+
        //To change the disabled property you should use the .prop() function like> $("input").prop('disabled', true);

		// Swappables have 2 fields to edit
		$(make[(2*i)]).prop('disabled', protectYMMFlag).removeClass('preRequired').trigger('chosen:updated');
		$(make[(2*i)+1]).prop('disabled', protectYMMFlag);
		$(model[(2*i)]).prop('disabled', protectYMMFlag).removeClass('preRequired').trigger('chosen:updated');
		$(model[(2*i)+1]).prop('disabled', protectYMMFlag);
		
		$(vinSelector[i]).prop('disabled', (stateCd =='MA' && protectYMMFlag) ? true : false);
		
		$("#bodyTypeCd_" + i).prop('disabled', (stateCd =='MA' && protectYMMFlag) ? true : false);
		
		//disable cost New field if it is retrieved during vehicle lookup
		//48535 FOCUS 2.1_Vehicles - The Cost New field for Vehicles selected from Prefill are not locked down consistantly.
		if((isRMV || isDataFromPrefill || isPolkLookupInd) 
				&& $('#costNewAmt_' + i).val() != '' && $('#costNewAmt_' + i).val() != '0' &&  $('#costNewAmt_' + i).val() != '0.0'){
			$('#costNewAmt_' + i).prop('disabled', true);
		}
		if(isEndorsement()){
			$("#bodyTypeCd_" + i).prop('disabled', protectYMMFlag);
			$('#vehicleLookup_' + i).prop('disabled',protectYMMFlag);
			//$('#excludedOperators_'+ i).prop('disabled', protectYMMFlag);
			//during endorsments/amend the field preInspection required should not be shown for existing Vehicles. but while adding vehicle it is shown.
			
			// if protectYMMFlag is true then vehicle is already pol looked up, so we are setting the polklookup indicator to true so it is not lookup during all vehicle lookup.
			if(protectYMMFlag){
				$('#polkLookupInd_' + i).val('Yes');
			}
			
			showHideYMMOverride(false, typeVal, i, false);
			showHidePreinspectionRequired(false, typeVal, i, false);
		
			//if endr we do not show the make model override
			//for replaced vehicle, after issued the policy, need to hide these fields
			if($('#vehicleLookup_' + i).attr('disabled') || 
					$('#transactionStatusCd').val() == 'Issued'){
				showHideField('makeModelOverrideInd', i , false);
				showHideField('makeModelOverrideText', i , false);
			}
			
			// hide replace icon for vehicles which have been added
			//for replaced vehicle, after issued the policy, need to hide these fields
			if($("#endorsementVehicleAddedInd_" + i).val().toUpperCase() == "YES" || 
					$('#transactionStatusCd').val() == 'Issued'){
				$("#replace_vehicle_" + i).addClass('hidden');
			}
			
			var ratedIndicator =  $('#ratedInd').val();
			if(ratedIndicator == 'Yes' && isYMMOverride){
				$("#bodyTypeCd_" + i).prop('disabled', false);
				$("#vin_" + i).prop('disabled',false);
				$(year[i]).prop('disabled', false);
				$(make[(2*i)+1]).prop('disabled', false);
				$(model[(2*i)+1]).prop('disabled', false);
			}
		}
		if($("#endorsementVehicleAddedInd_" + i).val().toUpperCase() != "YES" || !isEndorsement()){
			//57543
			if( $("#stateCd").val() == 'NJ' || $("#stateCd").val() == 'CT' || 
				$("#stateCd").val() == 'NH' || $("#stateCd").val() == 'PA'){		//PA_AUTO - added PA state
				showHideEligibilityVehicles(true, typeVal, i, false);
			}
		}
		
		// application - protect VIN if returned from prefill if it is 17 characters or greater
		//if(isApplicationOrEndorsement()) {	
			var vehTypeVal = $("#vehTypeCd_" + i).val();
			if((isDataFromPrefill && isPrefillSourced) && (vehTypeVal == PRIVATE_PASSENGER_CD)){
				var vin = $("#vin_" + i);
			    var len = $(vin).val().length;
				if(len == 17){
					$(vin).prop('disabled',true);
				}else{
					$(vin).prop('disabled',false).addClass("preRequired");
					restrictVinEntry(vin,len);
				}
			}
		//}
		
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
		showHideVehicleTncUseInd(typeVal, i, true)
		showOrHideRowVehicleTncCompanyCd(typeVal, i, true);
		showOrHideRowVehicleTncUsageLevel(typeVal, i, true);
		showOrHideRowVehicleTncDriverName(typeVal, i, true);
		showHideRvUsedAsPrimaryResidenceInd(typeVal, i, false);
		showHidePrincipalOperatorId(typeVal, i, false);
		showHideExcludedOperators(typeVal, i, false);
		showHideMotorCycleFields(typeVal, i, false);
		showHideUnregisterdVehicle(i);
		//Transfer Plate Number changes
		showHideTransferPlateNumber(typeVal, i, true)
				
		if(isApplication()){
			showHidePreinspectionRequired(false, typeVal, i, true);
		}
		showHideSnowplowEquipInd(typeVal, i, false);
		showHideNewOrUsed(typeVal, i, false);
		//makeModelOverride($("#makeModelOverrideInd_" + i));
		makeModelOverride(typeVal, i, false);
		var lookupRes = null;
		checkThenAppendNewMakeOption($("#dd_make_" + i), $("#ff_make_" + i).val(), $("#ff_make_" + i).val(),lookupRes );
		checkThenAppendModelOption($("#dd_model_" + i), $("#ff_model_" + i).val());	
		
		if(isApplicationOrEndorsement()){
			showHidePreinspectionRequired(false, typeVal, i, false);
		}
		if(isEndorsement()){
			showHideYMMOverride(false, typeVal, i, false);			
		}
		//applying field defualts. eg:- if vehicle lease is empty then set it to 'No'
		applyfieldDefaults(typeVal, i);
		
		//GATING DEFECT: If VIN lookup was not successful earlier, then we have to figure out a way to retain the 'LOOKUP required' message under the 
		//LOOKUKP button and also the message under the VIN (VIN is invalid, please correct or use the Year Make Model override function).
		//one way of doing this check by relying on the dataSourceCd, isVehicle from PREFIL ,Vehicle Type and  YMM Overide checkbox check box
		
		var endorsementVehicleAddedInd = $('#endorsementVehicleAddedInd_' + i).val();
		if(endorsementVehicleAddedInd != "Yes") {
			showVINRelatedErrors(i, typeVal, isRMV, isDataFromPrefill, isPolkLookupInd, isYMMOverride, isReverseLookupInd);		
		}
		
		//33262 - 
		 var principalOperatorElement =  $('#principalOperatorId_' + i);
		 if ($('option', principalOperatorElement).length == 2 && ((isDataFromPrefill && isPrefillSourced) && ( (typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD || typeVal == MOTORCYCLE_CD || typeVal == ANTIQUE_CD) || $('#firstTimeThru').val() == 'true')) ) {
				 // Only one item plus the - Select- option)
			    principalOperatorElement.prop('selectedIndex', 1).trigger('chosen:updated');
			    principalOperatorElement.removeClass('preRequired').trigger('chosen:styleUpdated');
			    showClearInLineErrorMsgsWithMap('principalOperatorId_'+i, '', $('#defaultMulti').outerHTML(), i, errorMessages, addRemoveVehicleRow);
		}
		 if(isApplication() && $('#stateCd').val() == 'MA' ){
			 if(isRMV || isDataFromPrefill ){
				$('#vin_' + i).prop('disabled', true);
			 }
		 }
		 
		 if(isPolkLookupInd && isUnregistered){
			 $('#vin_' + i).prop('disabled', false);
			 $('#vehicleLookup_' + i).prop('disabled',false);
		 }
}
	
	//:LABEL LEVEL Conditionally show / hide row Labels
	showHideVehicleRowLabels();
	
}


function showVINRelatedErrors(vehicleIndex, vehicleType, isRMVSourced, isDataFromPrefill, isPolkLookupInd, isYMMOverrideInd, isReverseLookupInd) {
	//retain Lookup required error Message:
	//FOR SUCCESSfull lookup the dataSourceCd will not be empty.
	//53426-vehciles- receiving RMV message on NJ policy
	var stateCd = $('#stateCd').val();
	if($('#firstTimeThru').val() == 'true') {
		if(stateCd == 'MA'){
			//53237-Edit is firing before user even enters VIN to look up
				if($('#dataSourceCd_0').val() == 'RMV' || $('#rmvLookupInd_0').val() == 'Yes'){ 
				processRMVMessageRules(vehicleIndex,null);
			}
		}
		return;
	}
		
		
	var yearVal = $("#modelYear_" + vehicleIndex).val();	
	if ($('#readOnlyMode').val() != 'Yes' ) {		
		if(stateCd != 'MA' && vehicleType == PRIVATE_PASSENGER_CD && !isRMVSourced && !isReverseLookupInd && !isPolkLookupInd && !isYMMOverrideInd && (isEmpty(yearVal) || parseInt(yearVal) >= 1981)) {		 
			//MA and unregistered do not prompt for look up required			
			showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
					vehicleIndex, errorMessages, addRemoveVehicleRow);
		}
		// 52391-RMV Status messages for vehicles disappear
		if(stateCd == 'MA' && vehicleType != TRAILER_CAPS_CD) {
			
			if(isEndorsement() && $('#endorsementVehicleAddedInd_'+vehicleIndex).val()!='Yes'
					&& $('#endorsementVehicleReplacedInd_'+vehicleIndex).val()!='Yes'){
				//52707 - Do not show messages for existing vehicles in ENDR
			} else{
				processRMVMessageRules(vehicleIndex,null);
			}
	
}
}
}

function processRMVMessageRules(vehicleIndex,lookupResults){	
	 	//console.log('processRMVMessageRules start');
		var unRegistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
		var isPolkLookupInd = $('#polkLookupInd_'+vehicleIndex).val(); 
		var isRmvLookupInd =  $('#rmvLookupInd_'+vehicleIndex).val();
		var vehTypeCd = $('#vehTypeCd_'+vehicleIndex).val();
		var modelYr = $('#modelYear_'+vehicleIndex).val();
		var yearMakeModelOverride = $('#ma_makeModelOverrideInd_'+vehicleIndex).is(':checked');
		var isRMVSourced = $('#dataSourceCd_'+vehicleIndex).val();
		var isGreen = false;
		var disableLookupBtn = false;
		var hideLookupButton = false;
		//var isYMM = false;
		var msg = '';
	
		//var isRMVSuccessful = false;
		var ispolkSuccesful = false;
		var isVinApplicableRequest = false;
		if(lookupResults !=null){
			isRMVSuccessful = lookupResults.rmvLookupSucceededFlag?true:false;
			ispolkSuccesful = lookupResults.lookupSucceededFlag?true:false;
			isVinApplicableRequest = lookupResults.request.vinRequestFlag?true:false;
		}
		if(vehTypeCd == PRIVATE_PASSENGER_CD || vehTypeCd == ANTIQUE_CD || vehTypeCd == MOTORCYCLE_CD){
			//53015,Button Active/Inactive conflicting defects go by FRD and defect 53449
			if(!unRegistered){
					if(isRmvLookupInd == 'Yes' || isRMVSourced){
						if(isPolkLookupInd == 'Yes'){
							if(getDateDiffInDays($('#rmvLookupDate_'+ vehicleIndex).val()) > 60){
								msg = 'vin.browser.inLine.vinlookupRequired';
								isGreen = false;
							}else {
								msg= 'vin.browser.inLine.rmvAndPolkSuccessful';
								isGreen = true;
								//disableLookupBtn = true;
							}
						}else{
							isGreen = true;
							msg= 'vin.browser.inLine.rmvSuccessful';
							//disableLookupBtn = true;
							}
					}
					if(isRmvLookupInd != 'Yes' || !isRMVSourced){
						//55239
						if(isPolkLookupInd == 'Yes'){
							isGreen=false;
							msg= 'vin.browser.inLine.rmvFailed';
						}else{
							isGreen=false;
							msg= 'vin.browser.inLine.rmvAndPolkFailed';
							}
					}
			}
			else if(unRegistered){
				if(isPolkLookupInd == 'Yes' || ispolkSuccesful){
					if(!yearMakeModelOverride){
						isGreen = true;
						msg = 'vin.browser.inLine.polkSuccessful';
						disableLookupBtn = false;
						$('#vin_' +vehicleIndex).prop('disabled', false);
						if(isEmpty(modelYr) || parseInt(modelYr) >= 1981){
							hideLookupButton = false;
						}
					}
				}else{
					msg = 'vin.browser.inLine.YMMlookup.noresults';
					isYMM = true;
				}
			}
				
				//53514-Unable to complete a Year Make Model Lookup for an Unregistered Vehicle
				if(lookupResults !=null && isPolkLookupInd != 'Yes' && !ispolkSuccesful && !isVinApplicableRequest  && isRmvLookupInd != 'Yes' && !yearMakeModelOverride){
					msg = 'vin.browser.inLine.YMMlookup.noresults';
					isYMM = true;
					disableLookupBtn = false;
				}
				if(yearMakeModelOverride){
					msg = '';
					hideLookupButton = true;
				}
			}
			
		
		
		if(vehTypeCd == MOTOR_HOME_CD || vehTypeCd == UTILITY_TRAILERS_CD || vehTypeCd == TRAILER_W_LIVING_FAC_CD || 
				vehTypeCd == TRAILER_CAPS_CD){
				if(!unRegistered){
						if(isRmvLookupInd == 'Yes' || isRMVSourced){
							isGreen = true;
							msg= 'vin.browser.inLine.rmvSuccessful';
							//disableLookupBtn = true;
						}else{
							isGreen = false;
							msg= 'vin.browser.inLine.rmvFailed';
						}
				}
				else if(unRegistered){
					msg = '';
					hideLookupButton = true;
				}
		}
		
//		console.log('vehTypeCd = '+vehTypeCd+'isRmvLookupInd ='+isRmvLookupInd+' isPolkLookupInd ='+isPolkLookupInd+'unRegistered = '+unRegistered);
//		console.log('msg = '+msg);
	//	if(isYMM){
		//	showClearInLineErrorMsgsWithMap('ff_model_'+vehicleIndex, msg, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		//}
		//else{
			//clear any ymm look up error
			//showClearInLineErrorMsgsWithMap('ff_model_'+vehicleIndex, '', $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
			//show success failure message
			showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, msg, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
			$('#vehicleLookup_'+vehicleIndex).removeClass('inlineError');
			$('#vehicleLookup_Error_Col_' + vehicleIndex).removeClass('inlineErrorMsg');
			$('#vehicleLookup_Error_Col_' + vehicleIndex).removeClass('inlineMsgGreen');
			if(isGreen){
				$('#vehicleLookup_Error_Col_' + vehicleIndex).addClass('inlineMsgGreen');
			}else{
				$('#vehicleLookup_'+vehicleIndex).addClass('inlineError');
				$('#vehicleLookup_Error_Col_'+vehicleIndex).addClass('inlineErrorMsg');
			}
			// 52970-Vehicle Lookup button enabled on vehicle tab when the vehicle lookup has already been completed
			if(disableLookupBtn){
					$('#vehicleLookup_'+vehicleIndex).attr("disabled",true).show();
			}if(hideLookupButton){
				$('#vehicleLookup_'+vehicleIndex).addClass('hidden');
			}
			
		//}
		//console.log('processRMVMessageRules end');
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
	showHideRow('endorsementVehicleEligibilityInd');
	showHideRow('motorCycleCc');
	showHideRow('motorCycleAverageRetailValue');
	showHideRow('motorCycleOriginalCostNew');
}

function showHideNewColumnFields(vehicleIndex) {
	//Incase of Adding vehicle, this has to take the Vehicle Column index to the perform the enable/hidden functions.
	//Fixing the below code to handle
	
	var dataSource = $('#dataSourceCd_'+vehicleIndex);
	
	$('#bodyTypeCd_'+vehicleIndex).prop('disabled', false);
	$('#vin_'+vehicleIndex).prop('disabled', false);
	//Default Vehicletype to PPA for new column
	$('#vehTypeCd_'+vehicleIndex).val(PRIVATE_PASSENGER_CD).prop('disabled', false).trigger('chosen:updated');
	
	//remove disable styleclass for YMM:
	$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled', false);
	$('#modelYear_'+vehicleIndex).prop('disabled', false);
	
	//since the Dropdowns for MAKE<MODEL<BODY are dynamic lookups, we have to empty the items for the dropdown.
	$('#dd_make_'+vehicleIndex).empty().append('<option value="">--Select--</option>').prop('disabled', false ).trigger('chosen:updated');
	$('#dd_model_'+vehicleIndex).empty().append('<option value="">--Select--</option>').prop('disabled', false ).trigger('chosen:updated');
	$('#dd_make_'+vehicleIndex).removeClass('hidden').trigger('chosen:styleUpdated');
	$('#dd_model_'+vehicleIndex).removeClass('hidden').trigger('chosen:styleUpdated');
	
	if($('#stateCd').val() == 'MA'){
		$('#unregisteredVehicleInd_'+vehicleIndex).prop('disabled', false);
		$('#plateNumber_'+vehicleIndex).prop('disabled', false);
		$('#plateTypeCd_'+vehicleIndex).prop('disabled', false).trigger('chosen:updated');
		$('#motorCycleCc_'+vehicleIndex).addClass('hidden');
		$('#motorCycleAverageRetailValue_'+vehicleIndex).addClass('hidden');
		$('#motorCycleOriginalCostNew_'+vehicleIndex).addClass('hidden');
		$('#ma_makeModelOverrideInd_'+vehicleIndex).prop('disabled', false);
	}
	
	$('#ff_make_'+vehicleIndex).prop('disabled', false).addClass('hidden');
	$('#ff_model_'+vehicleIndex).prop('disabled', false).addClass('hidden');
	
    //TODO: make and model hidden eleemnts are never disabled. this is not needed. test and remove.
	$('#make_'+vehicleIndex).prop('disabled', false );
	$('#model_'+vehicleIndex).prop('disabled', false );
	
	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
	//ExcludedOperators field enable
	$('#excludedOperators_'+ vehicleIndex).prop('disabled', false);
	
	// Field LEVEL Conditionally show / hide fields  
	var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
	var yearVal = '1983'; //This allows the VehileLookukp button to show while adding new vehicle..
	showHideVehicleLookup(typeVal, yearVal, vehicleIndex, false);
	//uncommenting this why was this commented..
	showHidePrimaryUse(typeVal, vehicleIndex, false);
	showHideCostNew(typeVal, vehicleIndex, false);
	showHideVehicleValue(typeVal, vehicleIndex, false);
	showHideAntiTheft(typeVal, vehicleIndex, false);
	showHideCustomizedEquipAmt(typeVal, vehicleIndex, false);
	showHideVehicleLeasedInd(typeVal, vehicleIndex, false);
	showHideVehicleTncUseInd(typeVal, vehicleIndex, true);
	showOrHideRowVehicleTncCompanyCd(typeVal, vehicleIndex, false);
	showOrHideRowVehicleTncUsageLevel(typeVal, vehicleIndex, false);
	showOrHideRowVehicleTncDriverName(typeVal, vehicleIndex, false);
	showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, false);
	showHidePrincipalOperatorId(typeVal, vehicleIndex, false);
	showHideExcludedOperators(typeVal, vehicleIndex, false);
	showHideSnowplowEquipInd(typeVal, vehicleIndex, false);
	//Transfer Plate Number changes
	showHideTransferPlateNumber(typeVal, vehicleIndex, true)
	
	if(isEndorsement()){
		showHideYMMOverride(false, typeVal, vehicleIndex, false);
	}
	
	showHidePreinspectionRequired(false, typeVal, vehicleIndex , false);
	
	//:LABEL LEVEL Conditionally show / hide row Labels
	showHideVehicleRowLabels();
	showHideNewOrUsed(typeVal, vehicleIndex, false);
	
	//Added for Endorsement Vehicle Eligibility 47051
	showHideEligibilityVehicles(false, typeVal, vehicleIndex, false);
	applyfieldDefaults(typeVal , vehicleIndex );
	
	//ssirigineedi: update
	//This will take care of the YELLOW PreREquiured class and handlers for the input elements.
	var selector = '.multiTable > tbody > tr > td:last-child';
	var selectorForNewlyAddedColumn = $(selector);
	//This function should be same as the firstTimeThru function in the Valdation.js. 
	//This will apply preRequired Class to all rquried fields and page level over rides can be done below .
	//PS: Do not add page specific conditions inside the function.
	applyFirstTimeThruStyle(selectorForNewlyAddedColumn , 'true');
	
	//Special case for New Used Indicator field while adding New Vehicle
	//for New Used Ind field, even though it is required, it should not be shown with YELLOW initially.
	removePreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	//$('#newUsedInd_' + vehicleIndex).removeClass('preRequired').trigger('chosen:styleUpdated');

	//Initialize previous values for clearVinOnChange
	$("#modelYear_" + vehicleIndex).data('prevYear',$("#modelYear_" + vehicleIndex).val());
	$("#make_" + vehicleIndex).data('prevMake',$("#make_" + vehicleIndex).val());
	$("#model_" + vehicleIndex).data('prevModel',$("#model_" + vehicleIndex).val());
	
	$('.altGaragingInd:last').prop('checked',false);
	$('.altGaragingInd:last').val("No");
	
	$('#garagingCityName_'+vehicleIndex).addClass('hidden');
	showHideField('garagingCityName', vehicleIndex, false );
}

//TODO: This function should be same as the firstTimeThru function in the Valdation.js. Once the consensus has been reached remove this.
/*function applyPreRequiredStyles(selector){
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
		//DON't apply the selector multiple times to assign functions. Select the elements in one go and then apply all event handling functions.
		$('input.required', selector).each( function(){
			
			togglePreRequiredStyle($(this));
				
	    }).blur( function () {
			
			togglePreRequiredStyle($(this));
			
		}).focus( function () {
	    	
	        $(this).removeClass('preRequired');
			
		});
		
		//Handle the selectboxes specifically.
		//the only native event Chosen triggers on the original select field is 'change'. so focus and blur is out of question.
		$('select.required', selector).each( function() {
			
			if(null != $(this).val() &&  $(this).val().length == 0) {
				$('#' + this.id+'_chosen a').addClass('preRequired');
			} else {
				$('#' + this.id+'_chosen a').removeClass('preRequired');
			}
			
		}).change(function () {
			
			$('#' + this.id+'_chosen a').removeClass('preRequired');
			
		});
}*/

//Added Newly
function applyfieldDefaults(vehicleType , vehicleIndex) {
	if( vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTOR_HOME_CD ) {
	    if($('#vehicleLeasedInd_'+vehicleIndex).val() == ''){
	    	$('#vehicleLeasedInd_'+vehicleIndex).val("No").trigger("chosen:updated");
	    	removePreRequiredStyle($('#vehicleLeasedInd_'+vehicleIndex));
		}
	}
	
    defaultForRVAsPrimaryResidence(vehicleType , vehicleIndex);

    if($('#snowplowEquipInd_'+vehicleIndex).val() == ''){
    	$('#snowplowEquipInd_'+vehicleIndex).val("No").trigger("chosen:updated");
    	removePreRequiredStyle($('#snowplowEquipInd_'+vehicleIndex));
	}
	//48303 - Pre inspection default incorrect	
    var preInspectionVal = $('#preInspectionRequiredDesc_'+vehicleIndex).val();
    if(preInspectionVal == null || preInspectionVal == undefined || preInspectionVal.length == 0){
		var preInspDefault = 'No - Previous policy had phys. damage';
		//TD 60988 Application Mode Vehicle Tab Pre-Inspection Required field Locked - Affects NJ Only - as NJ is the only state w/ preinspection field.
		$('#preInspectionRequiredDesc_'+vehicleIndex).val(preInspDefault)
		if(isEndorsement()){
			preInspDefault='No - PRAC customer > 1 policy term';
			$('#preInspectionRequiredDesc_'+vehicleIndex).val(preInspDefault).prop('disabled', true).trigger("chosen:updated");
			removePreRequiredStyle($('#preInspectionRequiredDesc_'+vehicleIndex));
		}
	}
	
	if(vehicleType == PRIVATE_PASSENGER_CD){
		addPreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}else{
		removePreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}
	
	//MORE to come here if needed...
}

function defaultForRVAsPrimaryResidence(vehicleType , vehicleIndex){ 
    if(vehicleType == MOTOR_HOME_CD || vehicleType == TRAILER_W_LIVING_FAC_CD ) {
    	var primaryResidence = $('#rvUsedAsPrimaryResidenceInd_'+vehicleIndex).val();
        if(null == primaryResidence || primaryResidence == ''){
        	$('#rvUsedAsPrimaryResidenceInd_'+vehicleIndex).val("No").trigger("chosen:updated");
        	removePreRequiredStyle($('#rvUsedAsPrimaryResidenceInd_'+vehicleIndex));
        }
    }
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
		//odometer always remove hidden test ..keep it back once the 3rd party odometer calls are success
		$('.returnedOdometerDataHeader').addClass('hidden');
		//$('.returnedDataOdometerRow').removeClass('hidden');
		
	} else {
		$(".returnedDataHeader").removeClass('hidden');		
		//odometer always remove hidden test ..keep it back once the 3rd party odometer calls are success
		$('.returnedOdometerDataHeader').removeClass('hidden');
	}
	
	
	//55198 - + RMV & Polk Returned Data section missing when vehicle screen renders and no vehicles returned from prefill
	// This section should be visible at all times
	if($('#stateCd').val() == 'MA'){
		$(".returnedDataHeader").removeClass('hidden');
	}
	
	var unRegVehAtIssue = $('#unregisterdVehAtIssue').val();
	if(isValidValue(unRegVehAtIssue) && unRegVehAtIssue == 'Yes'){
		$(".returnedDataRow").removeClass('hidden');
		$(".returnedDataHeader").removeClass('hidden');
		$('#returnedData').attr('src', '../aiui/resources/images/minus.gif');	
	}
}

function showHideYMMOverride(forceHide, typeVal , vehicleIndex, checkRow){
	if(forceHide) {
		//hide 
		showHideField('makeModelOverrideInd', vehicleIndex, false );
		showHideField('makeModelOverrideText', vehicleIndex, false );
		showHideRow('labelforMMOverrideInd');
		
	} else {
		if(isEndorsement()) {
			if(('Yes' == $('#endorsementVehicleReplacedInd_' +vehicleIndex).val()) || ('Yes' == $('#endorsementVehicleAddedInd_' +vehicleIndex).val())){
				if ((typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD)) {
					showHideField('makeModelOverrideInd', vehicleIndex, true );
					showHideField('makeModelOverrideText', vehicleIndex, true );
					showHideRowWithFlag('labelforMMOverrideInd', true);	
				} else {
					showHideField('makeModelOverrideInd', vehicleIndex, false );
					showHideField('makeModelOverrideText', vehicleIndex, false );
					//showHideRowWithFlag('labelforMMOverrideInd', false);					
				}
				
			} else {
				showHideField('makeModelOverrideInd', vehicleIndex, false );
				showHideField('makeModelOverrideText', vehicleIndex, false );
				// breaks page layout, see 48892,48531
				//showHideRow('labelforMMOverrideInd'); 
			}
		}
	}
}

function showHidePreinspectionRequired(forceHide, typeVal , vehicleIndex, checkRow){
	//IN endorsment while showing the data for existing vehicles this should be hidden. but while adding new vehicle this is shown.
	
	if(forceHide) {
		//hide 
		showHideField('preInspectionRequiredDesc', vehicleIndex, false );
	} else  {
		//Show where Policy State =  MA or NJ and Vehicle type = PPA/Pickup, Antique.
		var compCov = 'Y' == $('#compCov_' +vehicleIndex).val();
		
		// added or replaced vehicle, we want to show preinspection fields
		if(isEndorsement()) {
			if(('Yes' == $('#endorsementVehicleReplacedInd_' +vehicleIndex).val()) || ('Yes' == $('#endorsementVehicleAddedInd_' +vehicleIndex).val())){
				compCov = true;
			}
			
			// if replaced vehicle - set default for pre-inspection field
			if(('Yes' == $('#endorsementVehicleReplacedInd_' +vehicleIndex).val())){
				var elm = $('#preInspectionRequiredDesc_' + vehicleIndex);
				setPreInspectionDefault(elm);
			}
		}
		//TD 63832 - Removing COLL from condition so preinspection will always displayed when COMP is selected for PPA and ANTIQUE.
		showHideField('preInspectionRequiredDesc', vehicleIndex, (typeVal == '' || typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) && (compCov));
	}
	
	if(checkRow) {
		showHideRow('preInspectionRequiredDesc');
	}
	
}

function showHideVehicleLookup(typeVal, yearVal, vehicleIndex, checkRow) {	
	//New validation: if vehicleType is not selected , then dont show Vehicle LOOKUP.
	var stateCd = $('#stateCd').val();
	var showLookup = false;
	var isValidYearRange = false;
	if(stateCd == 'NJ' || stateCd == 'CT' || 
	   stateCd == 'NH' || stateCd == 'PA'){		//PA_AUTO - added PA state
		var makeModelOverride =  $("#makeModelOverrideInd_"+vehicleIndex).prop('checked');
		if(!makeModelOverride){
			showLookup = true;
			if(yearVal == null || yearVal.length == 0 || parseInt(yearVal) >= 1981){
					isValidYearRange = true;
				}
		}
	}
	//53015-RMV returned vehicles prior to 1981 do not have the Vehicle Lookup button 
	// and the Year/Make/Model/Body type fields are not locked down.
	if(stateCd == 'MA'){
		var makeModelOverride = $("#ma_makeModelOverrideInd_"+vehicleIndex).prop('checked');
		var isUnregistered = $("#unregisteredVehicleInd_"+vehicleIndex).prop('checked');
		if(!isUnregistered){
			showLookup = true;
			isValidYearRange = true;
		}else{
			if((typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTORCYCLE_CD) && !makeModelOverride){
				if(yearVal == null || yearVal.length == 0 || parseInt(yearVal) >= 1981){
					isValidYearRange = true;
					showLookup = true;
				}
			}
		}
	}

	showHideField('vehicleLookup', vehicleIndex,(typeVal == '' || isValidVehicleToLookup(typeVal,vehicleIndex)) && isValidYearRange && showLookup);
	
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
//	showHideField('costNewAmt', vehicleIndex, 
	//(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTORCYCLE_CD || typeVal == MOTOR_HOME_CD));
	//removed Motor cycles from here not needed rather it should read from original cost new
	/*showHideField('costNewAmt', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD));*/
	//TD 55018
	showHideField('costNewAmt', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD));
	
	if (checkRow) {
		showHideRow('costNewAmt');		
	}
}

function showHideMotorCycleFields(typeVal, vehicleIndex, checkRow){
	showHideField('motorCycleCc', vehicleIndex, (typeVal == MOTORCYCLE_CD));
	showHideField('motorCycleAverageRetailValue', vehicleIndex, (typeVal == MOTORCYCLE_CD));
	showHideField('motorCycleOriginalCostNew', vehicleIndex, (typeVal == MOTORCYCLE_CD));
	if (checkRow) {
		showHideRow('motorCycleCc');
		showHideRow('motorCycleAverageRetailValue');
		showHideRow('motorCycleOriginalCostNew');
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
	//var field = 'antiTheftContents\\[' + vehicleIndex + '\\]';
	var field = '';
	
	if( isEndorsement() && isMaipPolicy() ) {
		field = 'antiTheftContents_' + vehicleIndex;
	}else{
		field = 'antiTheftContents\\[' + vehicleIndex + '\\]';
	}
	
	var fieldId = $('#' + field);
	//var showIt = (typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD);
	var showIt;
	if( isEndorsement() && isMaipPolicy() ) {
		showIt = (typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD || MOTORCYCLE_CD);
	}else{
		showIt = (typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD);
	}
	
	if (showIt) {
		fieldId.removeClass("hidden");
	} else {
		fieldId.addClass("hidden");
		
		//for maip policy dropdown clear dd value after hide.
		if( isEndorsement() && isMaipPolicy() ) {
			$("#mcOrMaipAntiTheft_" + vehicleIndex).val('');
			//remove errors if any
			$('#mcOrMaipAntiTheft_' + vehicleIndex).removeClass('inlineError');
			$('#mcOrMaipAntiTheft_Error_Col_' + lastIndex).removeClass('inlineErrorMsg');
			$('#mcOrMaipAntiTheft_Error_Col_' + lastIndex).text("");
		}
		
		showClearInLineErrorMsgsWithMap(field, '', 'antiTheftContents.browser.inLine',
				vehicleIndex*1, errorMessages, addRemoveVehicleRow);
	}
	
	if (checkRow) {
		showHideRow('antiTheftContents');		
	}
}

function showHideCustomizedEquipAmt(typeVal, vehicleIndex, checkRow) {
	var showIt = typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD;
	var amt = $("#customizedEquipAmt_" + vehicleIndex).val();
	
	// Fix for Defect#	41136 - AI RULE MISCUS03-Rule fired and should not have
	// Upon conditionally hiding this field the previous (if) selected value was getting persisted
	if(amt == null || amt.length == 0 || parseInt(amt) == 0) {
		$("#performanceCustomizationInd_" + vehicleIndex).val("").trigger('chosen:updated');
	}
	
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
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD || typeVal == MOTORCYCLE_CD ));
	
	if (checkRow) {
		showHideRow('vehicleLeasedInd');		
	}
}

//Transfer Plate Number changes
function showHideTransferPlateNumber(typeVal, vehicleIndex, checkRow) {
	if($('#maPlateTransferRollout').val() != "Yes"){
		return;
	}
	var unregisterdChecked = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	/*if(!unregisterdChecked){
		$('#transferPlateNumber_'+vehicleIndex).val("");
	}*/
	showHideField('transferPlateNumber', vehicleIndex,	($('#stateCd').val() == 'MA' && typeVal == PRIVATE_PASSENGER_CD && unregisterdChecked));
	if (checkRow) {
		showHideRow('transferPlateNumber');		
	}
}


//TNC Requirements
function showHideVehicleTncUseInd(typeVal, vehicleIndex, checkRow) {
	if(typeVal != PRIVATE_PASSENGER_CD){
		$('#vehicleTncUseInd_' + vehicleIndex).val('').trigger('chosen:updated');
		$('#vehicleTncCompanyCd_' + vehicleIndex).val('').trigger('chosen:updated');
		$('#vehicleTncUsageLevel_' + vehicleIndex).val('').trigger('chosen:updated');
		$('#vehicleTncDriverName_' + vehicleIndex).val('').trigger('chosen:updated');
	}
	showHideField('vehicleTncUseInd', vehicleIndex,	(typeVal == PRIVATE_PASSENGER_CD && !isMaipPolicy()));
	
	if (checkRow) {
		showHideRow('vehicleTncUseInd');		
	}
}

function showOrHideRowVehicleTncCompanyCd(typeVal, vehicleIndex, checkRow) {
	showHideField('vehicleTncCompanyCd', vehicleIndex,	(!isMaipPolicy() && !isQuote() && (typeVal == PRIVATE_PASSENGER_CD) && ('Yes' == $('#vehicleTncUseInd_' +vehicleIndex).val())));
	
	if (checkRow) {
		showHideRow('vehicleTncCompanyCd');		
	}
}

function showOrHideRowVehicleTncUsageLevel(typeVal, vehicleIndex, checkRow) {
	showHideField('vehicleTncUsageLevel', vehicleIndex,	(!isMaipPolicy() && !isQuote() && (typeVal == PRIVATE_PASSENGER_CD) && ('Yes' == $('#vehicleTncUseInd_' +vehicleIndex).val())));
	
	if (checkRow) {
		showHideRow('vehicleTncUsageLevel');		
	}
}

function showOrHideRowVehicleTncDriverName(typeVal, vehicleIndex, checkRow) {
	showHideField('vehicleTncDriverName', vehicleIndex,	(!isMaipPolicy() && (!isQuote() || ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) && (typeVal == PRIVATE_PASSENGER_CD) && ('Yes' == $('#vehicleTncUseInd_' +vehicleIndex).val())));
	
	if (checkRow) {
		showHideRow('vehicleTncDriverName');		
	}
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
		showClearInLineErrorMsgsWithMap('vehicleTncUseInd_' + currVehLastIndex, strMsg,  $('#defaultMulti').outerHTML(),
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
			showClearInLineErrorMsgsWithMap(vehcleUseIndId, strMsg,  $('#defaultMulti').outerHTML(),
					lastIndex*1, errorMessages, addRemoveVehicleRow);
	 	});
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
	//52749-Principally Operated By field doesn't display for Motorcycles
	showHideField('principalOperatorId', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD || typeVal == MOTORCYCLE_CD || (isMaipPolicy() && typeVal == UTILITY_TRAILERS_CD)));
	
	if (checkRow) {
		showHideRow('principalOperatorId');		
	}
}

function showHideExcludedOperators(typeVal, vehicleIndex, checkRow) {
	showHideField('excludedOperators', vehicleIndex,
			(typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD || typeVal == MOTOR_HOME_CD || typeVal == MOTORCYCLE_CD));
	
	if (checkRow) {
		showHideRow('excludedOperators');		
	}
	//TD#71563 - AI - Named Driver Exclusion enhancement - Hide-Show-Protect by state/channel
	var isDisabled = $("#excludedOperators_"+vehicleIndex).is(':disabled');
    if(isDisabled){
           $("#ddcl-excludedOperators_"+vehicleIndex+"-ddw").css("display","none");
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
		var errorMessageID="";
		var strErrorRow = $('#defaultMulti').outerHTML();
		var vehicleID = $('#vehicleId_' +vehicleIndex).val();
		
		if(isEndorsement()){
			if(('Yes' == $('#endorsementVehicleReplacedInd_' +vehicleIndex).val()) || ('Yes' == $('#endorsementVehicleAddedInd_' +vehicleIndex).val())){
				vehicleID = '';
			}
		}
	    if(currentYear && modelYear !=""){
	    	if(parseInt(modelYear) >= currentYear - 2){

	    		if(vehicleID == '' || vehicleID == undefined ){
	    			addPreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	    		}
	    		else{
	    			removePreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	    			errorMessageID =  'newUsedInd.browser.inLine.required';
	    			showClearInLineErrorMsgsWithMap("newUsedInd_" + vehicleIndex, errorMessageID, strErrorRow,vehicleIndex, errorMessages, addRemoveVehicleRow);
	    		}
	    	} else {
	    		removePreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	    	}
        }else{
        	removePreRequiredStyle($('#newUsedInd_' + vehicleIndex));
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

//Added for Endorsement Vehicle Eligibility 47051
function showHideEligibilityVehicles(forcehide, typeVal, vehicleIndex, checkRow) {
	if(forcehide) {
		//hide 
		showHideField('endorsementVehicleEligibilityInd', vehicleIndex, false );
	} else {
		showHideField('endorsementVehicleEligibilityInd', vehicleIndex,
				((typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) && (isEndorsement())));

		checkRow = (typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) && (isEndorsement());
	}
	
	if (checkRow) {
		showHideRow('endorsementVehicleEligibilityInd');		
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

function showHideChosenContainer(id, showit) {
	if(showit) {
		$('#'+id+'_chosen').removeClass('chosenDropDownHidden');
	} else {
		$('#'+id+'_chosen').addClass('chosenDropDownHidden');
	}
}

function showHideMultiChosenContainer(id, showit) {
	if(showit) {
		$('#ddcl-'+id).removeClass('multiDropDownHidden');
	} else {
		$('#ddcl-'+id).addClass('multiDropDownHidden');
	}
}
//Updated to handle new select drop downs.
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

//Revisit: RV Used as a primary Residence not working as expected when adding Vehicle(which is currently defaulted to PPA).

//SSIRIGINEEDI: TEMP Fix: Revisit: added newly added for Multicheckboxes..since the common function is not working..
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
	element.trigger('chosen:updated');
}


function expandCollapseRowsOdometer(rowPrefix){
	$("." + rowPrefix + "Row").each(function() {
		$(this).toggleClass("hidden");
	});
	if(isEndorsement()){
		//Fix for #46180 -- Endorsement URL mapping is different
		//Toggling of Plus and Minus signs upon expand and collapse of Polk Returned Data section 
		if (($('#' + rowPrefix).attr('src')).indexOf('plus') >=0) {
			$('#' + rowPrefix).attr('src', '../resources/images/minus.gif');	
		} else {
			$('#' + rowPrefix).attr('src', '../resources/images/plus.gif');
		}
	}else{ 
		//Toggling of Plus and Minus signs upon expand and collapse of Polk Returned Data section 
		if (($('#' + rowPrefix).attr('src')).indexOf('plus') >=0) {
			$('#' + rowPrefix).attr('src', '../aiui/resources/images/minus.gif');	
		} else {
			$('#' + rowPrefix).attr('src', '../aiui/resources/images/plus.gif');
		}	
	}
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
    	if(!isEndorsement() || (isEndorsement() && 'HIT'!= $('#polkLookupInd_' + vehicleIndex).val())){
    		$('#polkLookupInd_' + vehicleIndex).val('');
    		
    	}
    	
    	//If Vin Changed;  the YMM and YMM override should no longer be protected,
		//enableColumnFields(vehicleIndex);
        enableYMMFields(vehicleIndex);
        //48992 - Cost new field gets locked down after POLK call and stays locked down.
        $('#costNewAmt_'+vehicleIndex).prop('disabled', false ).removeClass('preRequired');
		if(!$("#makeModelOverrideInd_" + vehicleIndex).prop('checked') ) {
			if(!$('#vehicleLookup_' + vehicleIndex).hasClass('hidden')){
				$('#vehicleLookup_'+vehicleIndex).removeClass('inlineError');
				$('#vehicleLookup_Error_Col_' + vehicleIndex).removeClass('inlineErrorMsg');
				$('#vehicleLookup_Error_Col_' + vehicleIndex).removeClass('inlineMsgGreen');
				
				//53454-Lookup Required edit message displays along with Year, Make, Model Lookup Failed edit messages.
				var rmvLookupDate = $('#rmvLookupDate_'+vehicleIndex).val();
				if(isValidValue(rmvLookupDate)){
					var xDate = new XDate();
					var rmvDate = new XDate(rmvLookupDate);
					var sixtyDayRule = Math.ceil(rmvDate.diffDays(xDate));
					if(sixtyDayRule > 60){
					showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
	 						vehicleIndex, errorMessages, addRemoveVehicleRow);
						$('#vehicleLookup_'+vehicleIndex).addClass('inlineError'); 
						$('#vehicleLookup_Error_Col_' + vehicleIndex).addClass('inlineErrorMsg');
				}
				}
			}
	    }
    }
    //Fix for 44011 ResetRate when modify the last 7 digits
    //55871-change VIN on unregistered vehicle didn't set the rate to inactive
    var unregisterdChecked = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
    if((unregisterdChecked && newValue != prevValue) || (newValue.length == 17 && prevValue.substring(10, 17) != newValue.substring(10, 17)) || (prevValue.length == 10 && newValue.length == 17)) {
   		//adding a Vehicle should reset premium on RATE BUTTON
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);
		if(isEndorsement()){
			//47768
			$('#reqVehRepCd_'+ vehicleIndex).val('Y');
    }
    }
    
    // Fix for defect # 41189 - VEHICLES APPLICATION - VIN lookup being required when i modify the last 7 digits.  FOCUS
    /*else if (isApplicationOrEndorsement() && (newValue.length > 10 && prevValue.substring(10, 17) != newValue.substring(10, 17))){
    	
    	enableYMMFields(vehicleIndex);
    	if(!$("#makeModelOverrideInd_" + vehicleIndex).prop('checked') ) {
			if(!$('#vehicleLookup_' + vehicleIndex).hasClass('hidden')){
				showClearInLineErrorMsgsWithMap('vehicleLookup_'+vehicleIndex, 'vin.browser.inLine.vinlookupRequired', $('#defaultMulti').outerHTML(),
					 						vehicleIndex, errorMessages, addRemoveVehicleRow);
			}
	    }
    	
    }*/
    
    //Need more clarificationfor this logic.  for VIN with 17 digits...
    /*if(newValue.length > 10 && prevValue.substring(10, 17) != newValue.substring(10, 17)) {
    	$('#vehicleLookup_'+vehicleIndex).prop('disabled',true);
    } else {
    	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
    } */
    
    $(vinInputElement).data('previous-value', newValue);
	
}

function enableYMMFields(vehicleIndex) {
	$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled', false );
	$('#modelYear_'+vehicleIndex).prop('disabled', false );
	
	//SSIRIGINEEDI: Modified as needed.
	$('#dd_make_'+vehicleIndex).prop('disabled', false ).trigger('chosen:updated');
	$('#ff_make_'+vehicleIndex).prop('disabled', false );
	
	$('#dd_model_'+vehicleIndex).prop('disabled', false ).trigger('chosen:updated');
	$('#ff_model_'+vehicleIndex).prop('disabled', false );
	
	$('#make_'+vehicleIndex).prop('disabled', false );
	$('#model_'+vehicleIndex).prop('disabled', false );
	$('#bodyTypeCd_'+vehicleIndex).prop('disabled', false );
	
	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
}

function processCurrentSelectionChange(source) {
	var vehicleIndex = getVehicleIndex(source.id);
	
	if($(source).hasClass("clsMake")) {
		 processMakeChange(vehicleIndex);
	} else if($(source).hasClass("clsModel")) {
		processModelChange(vehicleIndex);
	}
} 

function processMakeChange(vehicleIndex) {
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	//Make,Model fields should be free form edits when YMM Overide is checked. Hence not necessary to do lookukp for Model dropdown values.
	var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).prop('checked');
	
	if(PRIVATE_PASSENGER_CD == vehicleType && !isYMMOverideCheck) {
		
		var year = $("#modelYear_" + vehicleIndex).val();
		
		var ddMakeElement = $("#dd_make_" + vehicleIndex);
		var makeValue =  $("option:selected", ddMakeElement).val();
		var modelElement = $("#dd_model_" + vehicleIndex);
		
		//Default lookup result here
		var lookupResult = null;
		performModelLookup(year, makeValue, modelElement, modelLookupSuccess(modelElement,lookupResult), modelLookupFailure(modelElement));	
	
	}
	
	updateVehicleHeaderInfo(vehicleIndex);
}

function processModelChange(vehicleIndex) {
	$("#bodyTypeCd_" + vehicleIndex).val('');
	//Just update the header info
	updateVehicleHeaderInfo(vehicleIndex);
}

function updateVehicleHeaderTitle(vehicleIndex) {
	var year = $("#modelYear_" + vehicleIndex).val();
	var make = $("#make_" + vehicleIndex).val();
	var model = $("#model_" + vehicleIndex).val();
	
	if(isEndorsement()){
		if(model != null && model.length > 15)
		$("#vehicleHeaderInfo_" + vehicleIndex).css({
		     minWidth: "190px", 
		     width: "190px"
		 });
	}
	
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
}

function processYearChange(source) {
    //Lookup is performed only for PPA vehicle types .. hence MM are free form edits. no lookup calls for make and model.
	
	var vehicleIndex = getVehicleIndex(source.id);
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	
	//clear errors
	showClearInLineErrorMsgsWithMap('modelYear_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	showClearInLineErrorMsgsWithMap('make_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	showClearInLineErrorMsgsWithMap('model_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	
	
	//Make,Model fields should be free form edits when YMM Overide is checked. Hence not necessary to do lookukp for Make Values dropdown.
	var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).prop('checked');
	if($('#stateCd').val() == 'MA'){
		isYMMOverideCheck = $("#ma_makeModelOverrideInd_" + vehicleIndex).prop('checked');
	}
	
	if(PRIVATE_PASSENGER_CD == vehicleType  && !isYMMOverideCheck) {
		var year = $("#modelYear_" + vehicleIndex).val();	
		var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
		performVehicleMakeLookup(year, vehicleMakeElement, makeLookupSuccess(vehicleMakeElement), makeLookupFailure(vehicleMakeElement));
	}
	
	updateVehicleHeaderInfo(vehicleIndex);
}

//Added for Vehicle Make Lookup
function performVehicleMakeLookup(year, makeElement, successFunction, errorFunction) {
	emptySelect(makeElement);
	
	if (year != null && year > 0) {
		var startYear = 1901;
		var currYearPlusTwo = new Date().getFullYear() + 2;
		if (parseInt(year) > startYear && parseInt(year) <= currYearPlusTwo) {
			var lookupData = {};
			lookupData.year = year;		
			var jsonData = JSON.stringify(lookupData);
			
			$.ajax({
		        headers: { 
		            'Accept': 'application/json',
		            'Content-Type': 'application/json' 
		        },
		        url: "/aiui/vehicles/lookupMakes",
		        type: "post",
		        data: jsonData,
		        dataType: 'json',/*,
		        beforeSend:function(){
					blockUserForRMVRating();
				},*/
		        // callback handler that will be called on success
		        success: successFunction,
		        // callback handler that will be called on error
		        error: errorFunction/*,
		        complete: function(){
					$.unblockUI();
				}*/
		    });
		}
		
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
	var vehicleIndex = getVehicleIndex(makeElement.attr('id'));
	var modelElement = $("#dd_model_" + vehicleIndex);
	if (response.length == 0) {		
		swapDropDown(makeElement, true, true);
		swapDropDown(modelElement, true, true);
		$('#ff_make_' + vehicleIndex).val('');
		$('#ff_model_' + vehicleIndex).val('');		
		$('#dd_make_' + vehicleIndex).val('').trigger('chosen:updated');
		$('#dd_model_' + vehicleIndex).val('').trigger('chosen:updated');		
	} else {
		populateMakeDropDown(response, makeElement );
		swapDropDown(makeElement, false, true);	
		if(isEndorsement()){
			// make sure search is enabled - defect 44738
			addSearchBoxChosen('#dd_make_' + vehicleIndex + '_chosen');
		}
	}	
}

function processMakeLookupFailure(jqXHR, textStatus, errorThrown, makeElement) {
    // log the error to the console
    //if(console) console.log( "The following error occured: "+textStatus, errorThrown);
	swapDropDown(makeElement, false, true);
}

function processMakeModelOverride(overrideCheckBox) {
	var overrideColumn = $(overrideCheckBox).closest('.multiColumnInd');
	
	// tjmcd - Should this become getColumnIndexNoHeader
	var columnIndex = getColumnIndex(overrideColumn);
	var vehicleIndex = columnIndex-1;
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	
	makeModelOverride(vehicleType, vehicleIndex, true);
}

function makeModelOverride(vehicleType , vehicleIndex, resetValues) {
	var ymmOverrideInd  = $('#makeModelOverrideInd_'+vehicleIndex).prop('checked');	
	var ymmOverrideIndMA  = $('#ma_makeModelOverrideInd_'+vehicleIndex).prop('checked');
	
	//if ymmOverride is checked, then dropdowns should hide and it should be free form input.
	//Also, if the vehicle type is not PPA, then dropdowns should hide and it should be free form input.
	
	var forceDropDownHide = false;
	
	showHideField('makeModelOverrideInd', vehicleIndex, ($('#stateCd').val() != 'MA' &&
				(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == ANTIQUE_CD )));
	showHideField('makeModelOverrideText', vehicleIndex, ($('#stateCd').val() != 'MA' &&
				(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == ANTIQUE_CD )));
	
	var tdSelector = $("#mainContentTable > tbody > tr > td:nth-child(" + (vehicleIndex+1) +" ).makemodeloverrideOrLabel ");
	
	if(($('#stateCd').val() != 'MA' &&
				(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == ANTIQUE_CD ))){
		//$('tr > td.makemodeloverrideOrLabel:first-child').removeClass('hidden');
		$('#labelIdforOr').removeClass('hidden');
		$('#labelIdforMMOverrideInd').removeClass('hidden');
		tdSelector.find('span').text('OR');
	}else{
		tdSelector.find('span').text('');
		$('#labelIdforOr').addClass('hidden');
		$('#labelIdforMMOverrideInd').addClass('hidden');
	}
	processLabelRowsForVehicleType();
	if(vehicleType != PRIVATE_PASSENGER_CD ||  ymmOverrideInd ) {
		
		forceDropDownHide  = true;
		
	} else if(vehicleType != PRIVATE_PASSENGER_CD ||  ymmOverrideIndMA ) {		
		forceDropDownHide  = true;		
	} else {
		
		forceDropDownHide = false;
	}
	
	toggleSwappableFields(vehicleIndex, forceDropDownHide, resetValues);
	
	//show Hide Vehicle Lookup button accordingly
	var yearVal = $("#modelYear_"+vehicleIndex).val();

	showHideVehicleLookup(vehicleType, yearVal, vehicleIndex, true)
}

function processLabelRowsForVehicleType(vehicleCount){
	$("#rowHeaderTable > tbody > tr.labelforMMOverrideInd_Row").css('height', $("#mainContentTable > tbody > tr.makemodeloverrideInd_Row").css('height'));
	$("#rowHeaderTable > tbody > tr.labelforOrRow").css('height', $("#mainContentTable > tbody > tr.makemodeloverrideOrRow").css('height'));
	
}

function showHideGaragingAddress(altGaragingIndBox) {
    var vehIndex  = $(altGaragingIndBox).attr('id').substring('altGaragingInd_'.length);
    if(isApplicationOrEndorsement()) {
	// TBD alternate garage town for MA in below condition how should it work ? -
		if ($(altGaragingIndBox).prop('checked')) {
			$('#garagingAddressData_'+vehIndex).removeClass('hidden');
	    }  else  {
	    	$('#garagingAddress1_'+vehIndex).val('');
	    	$('#garagingAddress2_'+vehIndex).val('');
	    	$('#garagingZipCode_'+vehIndex).val('');
	    	$('#garagingCity_'+vehIndex).val('');
	    	$('#garagingState_'+vehIndex).val('');
	    	$('#vehAltGarageTown_'+vehIndex).val('');
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
	} else { // QUOTE 
		if ($(altGaragingIndBox).prop('checked')) {
					$('#garagingZipCode_'+vehIndex).removeClass('hidden');
					addPreRequiredStyle($('#garagingZipCode_'+vehIndex));
			
	    }  else  {
	    		    	$('#garagingZipCode_'+vehIndex).val('');
				    	$('#garagingZipCode_'+vehIndex).addClass('hidden');
				    	$('#garagingZipCode_Error_Col_'+vehIndex).empty();
				    	removePreRequiredStyle($('#garagingZipCode_'+vehIndex));
	    }
		showHideField('garagingZipCode', vehIndex, $(altGaragingIndBox).prop('checked'));
		if ($(".altGaragingInd:checked").length == 0) {
	    	$('.garagingZipCode_Row').addClass('hidden');
	 		$('.garagingZipCode_Error').addClass('hidden');
	     } else {
	         //if atleast one column is checked the whole row should be visible.
	 		$('.garagingZipCode_Row').removeClass('hidden');
	     }	
		
		}
}


function vehicleTypeChange(vehType,vehicleIndex,typeVal,origVehType){
	/*console.log('** vehicleTypeChange Start **');*/	
	if(vehType){
			vehicleIndex = getVehicleIndex(vehType.id);
			typeVal = $(vehType).val();
		}
		var yearVal = $("#modelYear_" + vehicleIndex).val();
		var policystate=$('#stateCd').val();
		showHideVehicleLookup(typeVal, yearVal, vehicleIndex, true);
		showHidePrimaryUse(typeVal, vehicleIndex, true);
		showHideCostNew(typeVal, vehicleIndex, true);
		showHideVehicleValue(typeVal, vehicleIndex, true);
		//when vehicle type change Antitheft fields need to update
		//56403- if vehicle Type chnages update the antithefts
		if(isValidValue(vehType)){
			if(typeVal == MOTORCYCLE_CD){
							initMCAntiTheft(typeVal, vehicleIndex, true);
			}else{
				//initNonMCAntiTheft(typeVal, vehicleIndex, true);
				if (isEndorsement() && isMaipPolicy()) {
					initNonMCMaipAntiTheft(typeVal, vehicleIndex, true);
				}else{
				initNonMCAntiTheft(typeVal, vehicleIndex, true);
				}
				
				showHideAntiTheft(typeVal, vehicleIndex, true);
			}
		}
		else{
			// 56403/56421
			// if rmv returned type is same as vehType no need to reintialize antithefts we want to retain the selected antithefts
			if(isValidValue(origVehType) && isValidValue(typeVal) && (origVehType.toUpperCase() == typeVal.toUpperCase())){
				
			}else{
					if(typeVal == MOTORCYCLE_CD){
						initMCAntiTheft(typeVal, vehicleIndex, true);
					}else{
							//initNonMCAntiTheft(typeVal, vehicleIndex, true);
							if (isEndorsement() && isMaipPolicy()) {
								initNonMCMaipAntiTheft(typeVal, vehicleIndex, true);
							}else{
							initNonMCAntiTheft(typeVal, vehicleIndex, true);
							}
							showHideAntiTheft(typeVal, vehicleIndex, true);
						}
				}
		}
		showHideCustomizedEquipAmt(typeVal, vehicleIndex, true);
		showHideVehicleLeasedInd(typeVal, vehicleIndex, true);
		//TNC Requirement
		showHideVehicleTncUseInd(typeVal, vehicleIndex, true);
		showOrHideRowVehicleTncCompanyCd(typeVal, vehicleIndex, true);
		showOrHideRowVehicleTncUsageLevel(typeVal, vehicleIndex, true);
		showOrHideRowVehicleTncDriverName(typeVal, vehicleIndex, true);
		showHideRvUsedAsPrimaryResidenceInd(typeVal, vehicleIndex, true);
		showHidePrincipalOperatorId(typeVal, vehicleIndex, true);
		showHideExcludedOperators(typeVal, vehicleIndex, true);
		showHideSnowplowEquipInd(typeVal, vehicleIndex, true);
		showHideNewOrUsed(typeVal, vehicleIndex, true);
		makeModelOverride(typeVal, vehicleIndex, true);
		defaultForRVAsPrimaryResidence(typeVal, vehicleIndex);
		showHideMotorCycleFields(typeVal, vehicleIndex, true);
		//Transfer Plate Number changes
		showHideTransferPlateNumber(typeVal, vehicleIndex, true);
		/*//52454-Plate type and Vehicle Type invalid combination edits firing incorrectly
		//uncommenting this now we need it seems
		showHideVehicleTypePlateTypeEdit(vehicleIndex);
		//53105-MA 2.4 [Plate # Motorhome] Plate # field should be a required fields for VEH Type Motor Home
		showHidePlateNumberEdit(vehicleIndex);*/
		if(policystate=='MA'){
			showHideMassYMMOverride(vehicleIndex);
			showHideUnregisterdVehicle(vehicleIndex);
		}
		
		if(isApplicationOrEndorsement()){
			var checkRow = isEndorsement();
			showHidePreinspectionRequired(false, typeVal, vehicleIndex, checkRow);
		}
		if(isEndorsement()){
			showHideYMMOverride(false, typeVal, vehicleIndex, false);			
		}
		
		if(typeVal == PRIVATE_PASSENGER_CD){
			addPreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
		}else{
			removePreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
		}
		
		//55235-Antique Vehicle Cost New Error
		if(typeVal == ANTIQUE_CD){
			var costNew = $('#costNewAmt_'+vehicleIndex).val();
			var vehValue = $('#vehicleValue_'+vehicleIndex).val();
			$('#costNewAmt_'+vehicleIndex).val('');
			if(isValidValue(costNew)){
				$('#vehicleValue_'+vehicleIndex).val(costNew);
			}
		}
		
		showClearInLineErrorMsgsWithMap('bodyTypeCd_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		showClearInLineErrorMsgsWithMap('vin_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		/*console.log('veh at index = '+vehicleIndex+' has a type changed to ='+typeVal);
		console.log('** vehicleTypeChange End **');*/
	}



function toggleSwappableFields(vehicleIndex, ymmOverrideInd, clearValues) {
	$('.multiTable > tbody > tr > td:nth-child(' + parseInt(vehicleIndex+1) + ') > select.dropDownSwap').each(function () {
		swapDropDown($(this), ymmOverrideInd , clearValues);
	});
}

function setupSwappableDropDown(swappable) {
	var swappableValue = $('.swappableValue', swappable);
	var ddId = 'select#dd_' + swappableValue.attr('id');
	var dd = $(ddId, swappable);
	var value = swappableValue.val();
	dd.val(value);
	
	swapDropDown(dd, false, false);
}

function swapDropDown(dropDownSwap, forceDropDownHide, resetValues) {
    var hideDropDown = forceDropDownHide;
	if (! hideDropDown) {
		var options = $('option', dropDownSwap);
		var optionCount = options.length;
		// count will be 1 considering the only value -Select-
		hideDropDown = optionCount < 1;
	}
	
	//Now: swap the Dropdown with freeformInput
	//We already have the dropdown Element , we need to get the reference to the Freeform input element.
	//TODO: check if resetValues is really required
	var ddColumn = dropDownSwap.parent(); //.swappableField 
	var freeFormSwap = $('.freeFormSwap', ddColumn);
	
	if(hideDropDown){
		if(dropDownSwap.val() != "" && null != dropDownSwap.val()){
		   freeFormSwap.val(dropDownSwap.val());
		}
		toggleSwappableFieldClass(freeFormSwap ,dropDownSwap[0].id , false);
	}  else {
		dropDownSwap.val(freeFormSwap.val()).trigger('chosen:updated');
		toggleSwappableFieldClass(freeFormSwap ,dropDownSwap[0].id , true);
	}
}

//SSIRIGINEEDI: CHOSEN-STYLE
function toggleSwappableFieldClass(freeformInput, dropDownElementId, showDropDown) {
	//var chosenDDElementId = '#'+dropDownElementId+'_chosen';
	if(showDropDown){
		$('#'+dropDownElementId).removeClass('hidden').trigger('chosen:styleUpdated');
		$(freeformInput).addClass('hidden');
	} else {
		$('#'+dropDownElementId).addClass('hidden').trigger('chosen:styleUpdated');
		$(freeformInput).removeClass('hidden');
	}
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
		//UW Lien Cat code related
		if(!isEndorsement()){
			$('#polLienCatCode').val('');
		}
		
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
		
		//addSlidableColumn(event, 'addDelColumn', vehicleCount,
			//	$('#slidingFrameId'), $('#mainContentTable'), $('#firstVehicle'), VEHICLES_PER_PAGE);
		//We wouldn't be need the all the above parameters( just the column to replicate and the vehicle Count is enought to clone the column)
		addSlidableColumn('addDelColumn', vehicleCount);
		
		slideThisVehicleEnd(event);
		
		$('#vin_'+addColumnIndex).prop("onkeyup",null);
		$('#vin_'+addColumnIndex).prop("onkeydown",null);
		$('#vin_'+addColumnIndex).css("color","black");
		
		var defGarageTown = $('#defaultGargeTown').val();
		//console.log('setting default town = '+defGarageTown);
		//don't set any default value if it is a maip policy. set it from rmv lookup.
		if (isEndorsement() && isMaipPolicy()) {
			$('#garagingTownName_'+addColumnIndex).val("");
		} else {
		$('#garagingTownName_'+addColumnIndex).val(defGarageTown).trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
		
		//if(isEndorsement() && !isQuote()) {
		//	$('#vin_'+addColumnIndex).addClass('preRequired');	
		//}
		//55961- commented above code and replacing with this
		$('#vin_'+addColumnIndex).addClass('preRequired');	
		
		$('#vehicleLookup_'+addColumnIndex).removeClass('inlineError');
		
		//AntiTheftValues Setup 
		//FIXED: The same vehicle Index is copied to all Antitheft columns.
		$('.antiTheftValues:last').html('');
		$('.antiTheftStatus:last').html('0 selected');
		//due to change in antitheft design(defect 34233), this line is added to display to 'none selected'.
		$("#antiTheftContents_" +  addColumnIndex + " .antiTheftSelectedDetails" + " .antiTheftSelectedCountDesc").text("0 selected");
		//57617
		$("#antiTheftContents_" +  addColumnIndex +" .antiTheftValues > " + " input[type='hidden']").each(function(){
			if($(this).val()){
				$(this).val("");
			}
		});
		
		initNonMCAntiTheft("PPA", addColumnIndex, true);
		
		/*if($('#mcOrMaipTypeHolder_'+addColumnIndex).length>0){
			var nonMcDefault = $('#nonMcTypeHolder_pos').html();
			var updatedValue = nonMcDefault.replaceAll('pos',addColumnIndex);
			$('#mcOrMaipTypeHolder_'+addColumnIndex).html(updatedValue);
			$('#mcOrMaipTypeHolder_'+addColumnIndex).attr('id','nonMcTypeHolder_'+addColumnIndex);
		}*/
		
		//Alternate Garage:
		//clear Garage Address and make it ready for New Entry.
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressSelected .gaTitle' ).html('');
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressSelected' ).addClass('hidden');
		$('#garagingAddressData_'+addColumnIndex+' .garagingAddressNew' ).removeClass('hidden');
		
		//TODO: fixes need...Insurable Interest Type dropdown. SAVE and Another having issues.
		$('#additionalInterests_'+addColumnIndex+'_aiCount').val(0);
		
		var addNewText = '<tr><td></td><td><a class="SubmitTertiaryButton editInsurableInterest addInsIntrst tabOrder" id="editInsurableInterest_'+addColumnIndex+'" href="#">'
			             +'<span>+ Financial Interest</span></a></td></tr>';
		$('#additionalInterestsData_'+addColumnIndex).html(addNewText);
		
		 //newly Added. if Principally Operated has only one driver, then default is selected
		 var principalOperatorElement =  $('select.principalOperatorId').last();
		 if ($('option', principalOperatorElement).length == 2) {
				 // Only one item plus the - Select- option)
			    principalOperatorElement.prop('selectedIndex', 1);
			    principalOperatorElement.trigger('chosen:updated');
		}
		 
		$(".vehicleHeaderInfo:last").html("#" + vehicleCount.val() + "-");
		
		if($('#costNewAmt_'+addColumnIndex).attr('disabled')){
			$('#costNewAmt_'+addColumnIndex).removeAttr('disabled');
		}
		
		$('#unregisteredVehicleInd_'+addColumnIndex).val("No");
		
		//set VehicleID for newly added Vehicle for Endorsement Mode as we would rely on this for updating the Cache/XML.
		if ( isEndorsement() ) {
			$('#vehicleId_' +  addColumnIndex).val(getMaxIdWithIncrement());
			$('#vehicleSeqNum_' +  addColumnIndex).val(getMaxSeqNoWithIncrement('vehicle'));
			
			$('#endorsementVehicleAddedInd_' + addColumnIndex).val("Yes");
			$("#replace_vehicle_"  + addColumnIndex).addClass('hidden'); // replace icon shouldn't show up on added vehicle
			//show the ymm override when adding a vehicle
		/*	$('#makeModelOverrideInd_'+ addColumnIndex).show();
			$('#makeModelOverrideText_'+ addColumnIndex).show();*/
			//47768
			$('#reqVehRepCd_'+ addColumnIndex).val('Y');
		} else {
			$('#endorsementVehicleAddedInd_' + addColumnIndex).val('');
		}
		
		bindColumn('multiTable', 'last-child', 'Add');
		
		showHideNewColumnFields(addColumnIndex);
		
		updateVehicleScrollPanel('#scrollPanel');
		
		alignRows();

		// set tabindex for added column
		setTabIndex($('#vehicleCount').val(), $('#vehicleCount').val());
		
		//set focus
		setFocus('vehTypeCd_' + addColumnIndex);
	}
	
	resetPremiumForAll();
}


function replaceVehicle(vehicleToReplaceElement) {
	
	var deleteColumn = $(vehicleToReplaceElement).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	var deletedId = $('#vehicleId_' + columnIndex).val();
	var vehicleIndex =  $(vehicleToReplaceElement).attr("id").substring('replace_vehicle_'.length);
	
	// TNC requirement
	if ($('#yubiEnabled').val() == 'true' && ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) {
		if ($('#vehicleTncUseInd_' + vehicleIndex).val() == 'Yes' && $('#replace_vehicle_' + vehicleIndex).length) {
			$('#endorsementVehicleTncReplaceModal').modal('show');
			return;
		}		
	}
	
	if ($('#endorsementVehicleAddedInd_' + columnIndex).val() != 'Yes') {
	   recordDeletion(deletedId);
	}
	
	//TODO: Reset the column values as per the specs. what needs to be retained and cleared.
	/*  1. User chooses to replace a vehicle that qualifies for replace function.
		2. User hits the Replace link
		3. Upon hitting the link, 
			A. vehicle type is retained from the vehicle being replaced.
			B. Garaging zip defaults to the same as vehicle being replaced
			C. vehicle primary use defaults to the same as the vehicle being replaced.
			D. Vehicle lookup will be required for MA. VIn/Vehicle lookup required for NON MA.
			E. Principal Operator/Additional Interest/Excluded Operator/and all other vehicle specific questions will not default. 
			F. Coverage of the REPLACED vehicle is retained."
			G. We show the YMM override fields when replacing*/
	// CLEAR THE HEADER TEXT
	
	
	$("#vehicleHeaderInfo_" + vehicleIndex).html("#" + (parseInt(vehicleIndex) +  1) );
	
	// set replaced vehicle indicator
	$('#endorsementVehicleReplacedInd_' +vehicleIndex).val("Yes");
	$('#replacedVehicleID_' +vehicleIndex).val(deletedId);
	
	//data fields..
    $('#dataSourceCd_' + vehicleIndex).val('');
    $('#polkLookupInd_' + vehicleIndex).val('');
    //54280
    $('#rmvLookupDate_'+vehicleIndex).val('');
	$('#rmvLookupInd_'+vehicleIndex).val('');
    
    $('#vehicleId_'+vehicleIndex).val(getMaxIdWithIncrement());
	$('#endorsementVehicleAddedInd_' + vehicleIndex).val("Yes");
	$("#replace_vehicle_"  + vehicleIndex).addClass('hidden'); 
    
    //Vin Related.
    $('#vin_'+vehicleIndex).attr('onkeyup','');
	$('#vin_'+vehicleIndex).attr('onkeydown','');
	$('#vin_'+vehicleIndex).css("color","black");
	
	// Comment next 2 lines - Defect 48988
	// $('.antiTheftValues:last').html('');
	// $('.antiTheftStatus:last').html('0 selected');
	
	//due to change in antitheft design(defect 34233), this line is added to display to 'none selected'.
	$("#antiTheftContents_" +  vehicleIndex + " .antiTheftSelectedDetails" + " .antiTheftSelectedCountDesc").text("0 selected");

	//Vehicle LookupButton enable
	$('#vehicleLookup_'+vehicleIndex).prop('disabled',false);
	//should enable for Replace
	$('#excludedOperators_'+ vehicleIndex).prop('disabled', false);
	
	// Additional Interests need to be removed
	removeAdditionalInterests(vehicleIndex);
	
	//show the ymm override when replacing a vehicle
	showHideField('makeModelOverrideInd', vehicleIndex, true);
	showHideField('makeModelOverrideText', vehicleIndex, true);
	
	//IE 9 looses VehicleType value after resetSelectiveFields -- #45467 additional fix
	var typeVal = $("#vehTypeCd_" + vehicleIndex).val();
	var stateCd = $("#stateCd").val();

	if(stateCd == 'MA'){
	//	var plateIssueDate = $("#plateIssueDate_" + vehicleIndex).val();
	//	var plateNumber = $("#plateNumber_" + vehicleIndex).val();
		var priorOdometerReadingVal = $("#priorOdometerReadingVal_" + vehicleIndex).val();
		var priorOdometerReadingDt = $("#priorOdometerReadingDt_" + vehicleIndex).val();
		var odometerReadingVal = $("#odometerReadingVal_" + vehicleIndex).val();
		var odometerReadingDt = $("#odometerReadingDt_" + vehicleIndex).val();
		var calcAnnualMileage = $("#calcAnnualMileage_" + vehicleIndex).val();
		var rvaMilesGroup = $("#rvaMilesGroup" + vehicleIndex).val();
		var annuallMilgeCorrect = $("#annuallMilgeCorrect_" + vehicleIndex).val();
		var annuallMilgeCorrectCode = $("#annuallMilgeCorrectCode_" + vehicleIndex).val();
		var currentAnnualMilage = $("#currentAnnualMilage_" + vehicleIndex).val();
		var currentBIMrgFctr = $("#currentBIMrgFctr_" + vehicleIndex).val();
		var currentCOLMrgFctr= $("#currentCOLMrgFctr_" + vehicleIndex).val();
		var currentOTCMrgFctr= $("#currentOTCMrgFctr_" + vehicleIndex).val();
		var currentPDMrgFctr= $("#currentPDMrgFctr_" + vehicleIndex).val();
		var currentPIPMrgFctr= $("#currentPIPMrgFctr_" + vehicleIndex).val();
		var ebrafMILESbase= $("#ebrafMILESbase_" + vehicleIndex).val();
		var ebrafMILESrel= $("#ebrafMILESrel_" + vehicleIndex).val();
		var ebrafRDR= $("#ebrafRDR_" + vehicleIndex).val();
		var ebrafRdrCode= $("#ebrafRdrCode_" + vehicleIndex).val();
		var ebrafUseGrp= $("#ebrafUseGrp_" + vehicleIndex).val();
		var ebrafUseGrpCode= $("#ebrafUseGrpCode_" + vehicleIndex).val();
		var exemptFlag= $("#exemptFlag_" + vehicleIndex).val();
		var exemptFlagCode= $("#exemptFlagCode_" + vehicleIndex).val();
		var insNewMA= $("#insNewMA_" + vehicleIndex).val();
		var insNewMACode= $("#insNewMACode_" + vehicleIndex).val();
		var mlgeEstGrp= $("#mlgeEstGrp_" + vehicleIndex).val();
		var mlgeEstBank= $("#mlgeEstBank_" + vehicleIndex).val();
		var rateBIMrgFctr= $("#rateBIMrgFctr_" + vehicleIndex).val();
		var rateCOLMrgFctr= $("#rateCOLMrgFctr_" + vehicleIndex).val();
		var rateOTCMrgFctr= $("#rateOTCMrgFctr_" + vehicleIndex).val();
		var ratePDMrgFctr= $("#ratePDMrgFctr_" + vehicleIndex).val();
		var ratePIPMrgFctr= $("#ratePIPMrgFctr_" + vehicleIndex).val();
		var tuCURMileage= $("#tuCURMileage_" + vehicleIndex).val();
		var tuCURMileageDt= $("#tuCURMileageDt_" + vehicleIndex).val();
		var tuMileage= $("#tuMileage_" + vehicleIndex).val();
		var tuMileageFlag= $("#tuMileageFlag_" + vehicleIndex).val();
		var tuMileageStatus= $("#tuMileageStatus_" + vehicleIndex).val();
		var tuMileageStatusCode= $("#tuMileageStatusCode_" + vehicleIndex).val();
		var tuPrevMileage= $("#tuPrevMileage_" + vehicleIndex).val();
		var tuPrevMileageDt= $("#tuPrevMileageDt_" + vehicleIndex).val();
		var vehNewlyAcq= $("#vehNewlyAcq_" + vehicleIndex).val();
		var vehNewlyAcqCode= $("#vehNewlyAcqCode_" + vehicleIndex).val();
		var tuScore= $("#tuScore_" + vehicleIndex).val();
		var tuBand= $("#tuBand_" + vehicleIndex).val();
		var tuStatusCode= $("#tuStatusCode_" + vehicleIndex).val();
		var tuStatus= $("#tuStatus_" + vehicleIndex).val();
		var tuScoreStatusCode= $("#tuScoreStatusCode_" + vehicleIndex).val();
		var tuScoreStatus= $("#tuScoreStatus_" + vehicleIndex).val();
		var mileageFlag= $("#mileageFlag_" + vehicleIndex).val();
		var rvaMilesGrpPrime = $("#rvaMilesGrpPrime_" + vehicleIndex).val();
		var rvaMilesGrpPrimeCode = $("#rvaMilesGrpPrimeCode_" + vehicleIndex).val();
		var annualMileagePrime = $("#annualMileagePrime_" + vehicleIndex).val();
		
	resetSelectiveFields(vehicleIndex);
	
	//IE 9 looses VehicleType value after resetSelectiveFields -- #45467 additional fix
	$("#vehTypeCd_" + vehicleIndex).val(typeVal).trigger("chosen:updated");
		//$("#plateIssueDate_" + vehicleIndex).val(plateIssueDate).trigger("chosen:updated");
	 
		//$("#plateNumber_" + vehicleIndex).val(plateNumber).trigger("chosen:updated");
		$("#priorOdometerReadingVal_" + vehicleIndex).val(priorOdometerReadingVal).trigger("chosen:updated");
		$("#priorOdometerReadingDt_" + vehicleIndex).val(priorOdometerReadingDt).trigger("chosen:updated");
		$("#odometerReadingVal_" + vehicleIndex).val(odometerReadingVal).trigger("chosen:updated");
		$("#odometerReadingDt_" + vehicleIndex).val(odometerReadingDt).trigger("chosen:updated");
		$("#calcAnnualMileage_" + vehicleIndex).val(calcAnnualMileage).trigger("chosen:updated");
		
		$("#priorOdometerReadingVal_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
		$("#priorOdometerReadingDt_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
		$("#odometerReadingVal_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
		$("#odometerReadingDt_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
		$("#calcAnnualMileage_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
		
		$("#rvaMilesGroup" + vehicleIndex).val(rvaMilesGroup).trigger("chosen:updated");
		$("#annuallMilgeCorrect_" + vehicleIndex).val(annuallMilgeCorrect).trigger("chosen:updated");
		$("#annuallMilgeCorrectCode_" + vehicleIndex).val(annuallMilgeCorrectCode).trigger("chosen:updated");
		$("#currentAnnualMilage_" + vehicleIndex).val(currentAnnualMilage).trigger("chosen:updated");
		$("#currentBIMrgFctr_" + vehicleIndex).val(currentBIMrgFctr).trigger("chosen:updated");
		$("#currentCOLMrgFctr_" + vehicleIndex).val(currentCOLMrgFctr).trigger("chosen:updated");
		$("#currentOTCMrgFctr_" + vehicleIndex).val(currentOTCMrgFctr).trigger("chosen:updated");
		$("#currentPDMrgFctr_" + vehicleIndex).val(currentPDMrgFctr).trigger("chosen:updated");
		$("#currentPIPMrgFctr_" + vehicleIndex).val(currentPIPMrgFctr).trigger("chosen:updated");
		$("#ebrafMILESbase_" + vehicleIndex).val(ebrafMILESbase).trigger("chosen:updated");
		$("#ebrafMILESrel_" + vehicleIndex).val(ebrafMILESrel).trigger("chosen:updated");
		$("#ebrafRDR_" + vehicleIndex).val(ebrafRDR).trigger("chosen:updated");
		$("#ebrafRdrCode_" + vehicleIndex).val(ebrafRdrCode).trigger("chosen:updated");
		$("#ebrafUseGrp_" + vehicleIndex).val(ebrafUseGrp).trigger("chosen:updated");
		$("#ebrafUseGrpCode_" + vehicleIndex).val(ebrafUseGrpCode).trigger("chosen:updated");
		$("#exemptFlag_" + vehicleIndex).val(exemptFlag).trigger("chosen:updated");
		$("#exemptFlagCode_" + vehicleIndex).val(exemptFlagCode).trigger("chosen:updated");
		$("#insNewMA_" + vehicleIndex).val(insNewMA).trigger("chosen:updated");
		$("#insNewMACode_" + vehicleIndex).val(insNewMACode).trigger("chosen:updated");
		$("#mlgeEstGrp_" + vehicleIndex).val(mlgeEstGrp).trigger("chosen:updated");
		$("#mlgeEstBank_" + vehicleIndex).val(mlgeEstBank).trigger("chosen:updated");
		$("#rateBIMrgFctr_" + vehicleIndex).val(rateBIMrgFctr).trigger("chosen:updated");
		$("#rateCOLMrgFctr_" + vehicleIndex).val(rateCOLMrgFctr).trigger("chosen:updated");
		$("#rateOTCMrgFctr_" + vehicleIndex).val(rateOTCMrgFctr).trigger("chosen:updated");
		$("#ratePDMrgFctr_" + vehicleIndex).val(ratePDMrgFctr).trigger("chosen:updated");
		$("#ratePIPMrgFctr_" + vehicleIndex).val(ratePIPMrgFctr).trigger("chosen:updated");
		$("#tuCURMileage_" + vehicleIndex).val(tuCURMileage).trigger("chosen:updated");
		$("#tuCURMileageDt_" + vehicleIndex).val(tuCURMileageDt).trigger("chosen:updated");
		$("#tuMileage_" + vehicleIndex).val(tuMileage).trigger("chosen:updated");
		$("#tuMileageFlag_" + vehicleIndex).val(tuMileageFlag).trigger("chosen:updated");
		$("#tuMileageStatus_" + vehicleIndex).val(tuMileageStatus).trigger("chosen:updated");
		$("#tuMileageStatusCode_" + vehicleIndex).val(tuMileageStatusCode).trigger("chosen:updated");
		$("#tuPrevMileage_" + vehicleIndex).val(tuPrevMileage).trigger("chosen:updated");
		$("#tuPrevMileageDt_" + vehicleIndex).val(tuPrevMileageDt).trigger("chosen:updated");
		$("#vehNewlyAcq_" + vehicleIndex).val(vehNewlyAcq).trigger("chosen:updated");
		$("#vehNewlyAcqCode_" + vehicleIndex).val(vehNewlyAcqCode).trigger("chosen:updated");
		$("#tuScore_" + vehicleIndex).val(tuScore).trigger("chosen:updated");
		$("#tuBand_" + vehicleIndex).val(tuBand).trigger("chosen:updated");
		$("#tuStatusCode_" + vehicleIndex).val(tuStatusCode).trigger("chosen:updated");
		$("#tuStatus_" + vehicleIndex).val(tuStatus).trigger("chosen:updated");
		$("#tuScoreStatusCode_" + vehicleIndex).val(tuScoreStatusCode).trigger("chosen:updated");
		$("#tuScoreStatus_" + vehicleIndex).val(tuScoreStatus).trigger("chosen:updated");
		$("#mileageFlag_" + vehicleIndex).val(mileageFlag).trigger("chosen:updated");
		$("#rvaMilesGrpPrime_" + vehicleIndex).val(rvaMilesGrpPrime).trigger("chosen:updated");
		$("#rvaMilesGrpPrimeCode_" + vehicleIndex).val(rvaMilesGrpPrimeCode).trigger("chosen:updated");
		$("#annualMileagePrime_" + vehicleIndex).val(annualMileagePrime).trigger("chosen:updated");
		
	}
	else {
		resetSelectiveFields(vehicleIndex);
		$("#vehTypeCd_" + vehicleIndex).val(typeVal).trigger("chosen:updated");
	}
	
	$("#ratingTerritoryCd_" + vehicleIndex).prop('disabled',true).trigger("chosen:updated"); 
	// show/hide preinspection field if needed
	showHidePreinspectionRequired(false, typeVal, vehicleIndex, true);
	
	//54444-NJ field showing in ENDTS on vehicles tab and alt garage town not loading into field
	
	showHideEligibilityVehicles(false,typeVal, vehicleIndex, true);
	
	var defaultGarage = $('#defaultGargeTown').val();
	
	//set default
	$('#garagingTownName_'+vehicleIndex).val(defaultGarage).prop('disabled',true).trigger("chosen:updated");
	
	// set defaults
	$('#snowplowEquipInd_'+vehicleIndex).val("No").trigger("chosen:updated");

	//Added newly for Replace functionality to reset the premium.
	var ratedIndicator =  $('#ratedInd').val();
	if(isEndorsement()) {    	
		var originalPremAmt = $('#premAmt').val();
		resetPremium(ratedIndicator,originalPremAmt);
	}
	
	//47768
	$('#reqVehRepCd_'+ vehicleIndex).val('Y');

	//We reset all the tabindexs since we are replacing a vehicle and 
	//the fields have changed
	setTabIndex("1", $('#vehicleCount').val());
	//46782 - Set focus to vehicleType
	setFocus('vehTypeCd_' + columnIndex);
}

function resetSelectiveFields(vehicleIndex) {

	var vehType = $('#vehTypeCd_' + vehicleIndex).val();

	$('#mainContentTable tbody tr').find("td:eq(" + vehicleIndex + ")").each( function() {
		 //clear the value for selective elements
		 	 // It is required that alterage Garage address zip should retain to vehicle being replaced.
				$(this).find('input:not(.garagingAddressCls,.altGaragingInd,.clsAddInt) , select:not(.primaryUseCd) ,  checkbox:not(.altGaragingInd) ').each( function() {
					if($(this).is('input') || $(this).is('select')) { // text box and select
						$(this).val('').prop('disabled', false);
						if($(this).is('select:not(select[multiple])')) {
							//for make/model/body the dropdown values needs to be emptied.
							var freeFormId = $(this).attr('id');
							if($(this).hasClass('clsMake') || $(this).hasClass('clsModel')) {
								if(vehType != PRIVATE_PASSENGER_CD){
									if(null != freeFormId || freeFormId != ""){
										freeFormId = freeFormId.substring(3);
										$('#ff_'+freeFormId).val('');
										$(freeFormId).val('');
									}
								}else{
									emptySelect($(this));
									if($(this).is(':hidden')){
										$(this).removeClass('hidden').trigger('chosen:styleUpdated');
										if(null != freeFormId || freeFormId != ""){
											freeFormId = freeFormId.substring(3);
											$('#ff_'+freeFormId).val('');
											$('#ff_'+freeFormId).addClass('hidden');
											$(freeFormId).val('');
										}
									}
								}
							}
							
							$(this).trigger('chosen:updated');
						 }else if( vehType != PRIVATE_PASSENGER_CD && $(this).hasClass('makeModelOverride')){
							 showHideField('makeModelOverrideInd', vehicleIndex , false);
							 showHideField('makeModelOverrideText', vehicleIndex , false);
					     }
				    } else if($(this).is('input:checkbox')) { //check box
				    	$(this).attr('checked', false).prop('disabled', false);;
				    }	
					
					if($(this).is('select[multiple]')){
						addDropdownCheckListForCol(this);
					}
			});
			
	});
	//55778
	$('tr.returnedDataRow input.uneditable-input').each(function(){
		var idVal = $(this).attr('id');
		if(isValidValue(idVal) && idVal.indexOf('_'+vehicleIndex) !=-1){	
			$(this).attr('disabled',true);
		}
	});
}

function deleteVehicle(deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	var vehicleCount = parseInt($('#vehicleCount').val());
	var ppaVehicleCount = 0;
	var mhVehicleCount = 0;	
	//Motocycles can be on a policy with other vehicles or alone for MA
	var mcVehicleCount = 0;
	var aqVehicleCount = 0;
	
	var isDeletedVehiclePPA = ($('#vehTypeCd_' +columnIndex).val()== PRIVATE_PASSENGER_CD) ? true : false;
	var isDeletedVehicleMH = ($('#vehTypeCd_' +columnIndex).val()== MOTOR_HOME_CD) ? true : false;
	var isDeletedVehicleMC = ($('#vehTypeCd_' +columnIndex).val()== MOTORCYCLE_CD) ? true : false;
	var isDeletedVehicleAQ = ($('#vehTypeCd_' +columnIndex).val()== ANTIQUE_CD) ? true : false;
	
	var yearValue = $("#modelYear_" + columnIndex).val();	
	var makeValue = $("#make_" + columnIndex).val();
	var modelValue = $("#model_" + columnIndex).val();
	var stateCd = $("#stateCd").val();
	
	// TNC requirement
	if ($('#yubiEnabled').val() == 'true' && ($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA')) {
		if ($('#vehicleTncUseInd_' + columnIndex).val() == 'Yes' && $('#replace_vehicle_' + columnIndex).length) {
			$('#endorsementVehicleTncReplaceModal').modal('show');
			return;
		}		
	}
	
	if (parseInt($('#vehicleCount').val()) == 1) {
		confirmMessageWithTitle("Invalid Vehicle Delete", "You can't delete the last vehicle");
		return;
	} else {
		// if the vehicle deleted is last of the vehicle type PPA then it should not be allowed to be deleted. 
		for(var i = 0 ; i < vehicleCount; i++){
			if($('#vehTypeCd_' +i).val()== PRIVATE_PASSENGER_CD){
				ppaVehicleCount++;
			}else if($('#vehTypeCd_' +i).val()== MOTOR_HOME_CD){
				mhVehicleCount++;
			}
			else if($('#vehTypeCd_' +i).val()== MOTORCYCLE_CD){
				if(stateCd == 'MA'){
					mcVehicleCount++;
					}
			}
			else if($('#vehTypeCd_' +i).val()== ANTIQUE_CD){
				if(stateCd == 'MA'){
					aqVehicleCount++;
					}
			}
		}
		
		if(stateCd != 'MA'){
		if(ppaVehicleCount == 1 && isDeletedVehiclePPA && mhVehicleCount == 0 || mhVehicleCount == 1 && isDeletedVehicleMH && ppaVehicleCount == 0){
			confirmMessageWithTitle("Invalid Vehicle Delete", "At least 1 standard vehicle type (Private Passenger, Antiques or Motorhome) required to continue");
			return;
		}
		}
		//Motocycles can be on a policy with other vehicles or alone for MA
		if(stateCd == 'MA'){
			if(ppaVehicleCount == 1 && isDeletedVehiclePPA && mhVehicleCount == 0 && mcVehicleCount == 0 && aqVehicleCount == 0
					|| mhVehicleCount == 1 && isDeletedVehicleMH && ppaVehicleCount == 0 && mcVehicleCount == 0 && aqVehicleCount == 0
					|| mcVehicleCount == 1 && isDeletedVehicleMC && ppaVehicleCount == 0 && mhVehicleCount == 0 && aqVehicleCount == 0
					|| aqVehicleCount == 1 && isDeletedVehicleAQ && ppaVehicleCount == 0 && mhVehicleCount == 0 && mcVehicleCount == 0){
				confirmMessageWithTitle("Invalid Vehicle Delete", "At least 1 standard vehicle type (Private Passenger, Antiques or Motorhome) required to continue");
				return;
			}
		}
		
		
		deleteAction = "DELETE_VEHICLE";
		var deleteColumn = $(deleteLink).closest('.multiColumnInd');
		var columnIndex = getColumnIndexNoHeader(deleteColumn);
		var deleteMsg = "Vehicle"+(" #" + (columnIndex + 1) + "-" + yearValue + " "+ makeValue + " "+ modelValue) +"<br> You are about to delete the above vehicle. <span id='msg_confirm_delete'>Please confirm deletion</span>";
		questionMessageForVehicle(deleteMsg, deleteLink, columnIndex, deleteAction);		
	}
}

//TODO:need to set the button label not the value...There is a defect -- need to remove the commented code
//#33301 which calls for new design of the modal.. work then..
/*function questionDeleteMessageWithTitle(messageTitle, messageText ,columnIndex){
    if (messageTitle != null && messageTitle.length > 0) {
		$('#question #title').html(messageTitle);
	}
    
	$('#question #message').html(messageText);

	$.blockUI({
		message : $('#question'),css : {width : '275px'}
	});

	$("#question #yes").val('Yes-Delete');

	$('#question #yes').unbind('click');
	$('#question #yes').removeAttr('disabled');
	$("#question #yes").removeClass('disabled');
	$('#question #yes').click(function() {
		$("#question #yes").attr('disabled', true);
		$("#question #yes").addClass('disabled');
		$.unblockUI();

		deleteVehicleColumn(columnIndex);

		return true;
	});

	$('#question #no').unbind('click');

	$('#question #no').click(function() {
		$.unblockUI();
		return false;
	}); 
}*/
// Modal window replaced with new design - is consistant with Drivers now 

function questionMessageForVehicle(messageText, deleteLink, columnIndex, action){
	var headerTitle, primButtonText;
	
	$('#question #yes').unbind('click');
	$('#question #no').hide();
	
	if(action.toUpperCase() == "DELETE_VEHICLE"){
		headerTitle = "WARNING!  Confirm Deletion";
		primButtonText = "Delete";
		$('#question #yes').click(function() {
			$('#question #yes').hide();
			$('#question #closeQuestion').hide();
			$('#msg_confirm_delete').hide();
			$('#question #title').html('Wait...');
	    	setTimeout(function () {
		    	deleteVehicleColumn(columnIndex);
				$('#question #yes').show();
				$('#question #closeQuestion').show();
	    		$('#question').modal('hide');
	    	}, 100);
	    	
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

function deleteVehicleColumn(columnIndex) {
	var deletedId = $('#vehicleId_' + columnIndex).val();
	
	//UW Lien Cat code related
	if(!isEndorsement()){
		$('#polLienCatCode').val('');
	}
	
	if ($('#endorsementVehicleAddedInd_' + columnIndex).val() != 'Yes') {
	   recordDeletion(deletedId);
	}
	
	deleteScrollableColumns(columnIndex, 'multiTable', $('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
	
	//IF the first Column being deleted. then columnSelector for BindColumn should not be td:gt(-1);
	var columnSelector =  'gt(' + (parseInt(columnIndex) - 1) + ')';
	
	if(parseInt(columnIndex) == 0) {
		columnSelector = null ;
	}
	
	bindColumn('multiTable', columnSelector, 'Delete');
	
	updateVehicleScrollPanel('#scrollPanel');
	
	alignRows();
	
	resetPremiumForAll();
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

	if (year != null && year > 0 && make != null && make.length >= 0) {
		var lookupData = {};
		lookupData.year = year;
		lookupData.make = make;
		var jsonData = JSON.stringify(lookupData);
		
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/vehicles/lookupModels",
	        type: "post",
	        data: jsonData,
	        dataType: 'json',
	      /*  beforeSend:function(){
				blockUser();
			},*/
	        // callback handler that will be called on success
	        success: successFunction,
	        // callback handler that will be called on error
	        error: errorFunction/*,
	        complete: function(){
				$.unblockUI();
			}*/
	    });
	}
}

function modelLookupSuccess(modelElement,lookupResult) {
	return function(response, textStatus, jqXHR) {
		processModelLookupSuccess(response, textStatus, jqXHR, modelElement,lookupResult);
	};
}

function processModelLookupSuccess(response, textStatus, jqXHR, modelElement,lookupResult) {
	var vehicleIndex = getVehicleIndex(modelElement.attr('id'));
	if (response.length == 0) {
	// this is required to display the fields as free form again
		var makeVal = $("#dd_make_" + vehicleIndex).val();
		if(makeVal != '' ){
			swapDropDown(modelElement, true, true);
			$('#ff_model_' + vehicleIndex).val('');
			//$('#ff_make_' + vehicleIndex).focus();
			$('#dd_model_' + vehicleIndex).val('').trigger('chosen:updated');
			$('#model_' + vehicleIndex).val('');
			var errorMessageID =  'model.browser.inLine.required';
			showClearInLineErrorMsgsWithMap('model_'+vehicleIndex, errorMessageID, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		}else{
			populateModelDropDown(response, modelElement,lookupResult,vehicleIndex);
			$('#ff_model_' + vehicleIndex).val('');
			$('#model_' + vehicleIndex).val('');
			$('#dd_model_' + vehicleIndex).val('').trigger('chosen:updated');
		}
		checkMakeModelPopulation(lookupResult,vehicleIndex);
	} else {
		populateModelDropDown(response, modelElement,lookupResult,vehicleIndex);
		swapDropDown(modelElement, false, true);	
	}
}

function modelLookupFailure(modelElement) {
	return function(jqXHR, textStatus, errorThrown){
		processModelLookupFailure(jqXHR, textStatus, errorThrown, modelElement);
	};
}

function processModelLookupFailure(jqXHR, textStatus, errorThrown, modelElement) {
    // log the error to the console
    //if(console) console.log("The following error occured: "+  textStatus, errorThrown);

	swapDropDown(modelElement, false, true);
}

function checkMakeModelPopulation(lookupResults,vehicleIndex){
	if(isValidValue(lookupResults) && $('#stateCd').val() == 'MA' && isValidValue(lookupResults.rmvYear) && isValidValue(lookupResults.rmvMake) && isValidValue(lookupResults.rmvModel)){
		$('#ff_model_' + vehicleIndex).val(lookupResults.rmvModel);
		$('#model_' + vehicleIndex).val(lookupResults.rmvModel);
		$('#ff_make_' + vehicleIndex).val(lookupResults.rmvMake);
		$('#make_' + vehicleIndex).val(lookupResults.rmvMake);
	}	
}

function populateMakeDropDown(options, makeElement) {
	emptySelect(makeElement);
	for (var i = 0; i < options.length; i++) {
		if (i < options.length) {
			makeElement.append('<option value="' + $.trim(options[i].key) + '">' + options[i].value + '</option>');
		}
	}
	//SSIRIGINEEDI: CHOSEN-STYLE
	//makeElement.trigger("chosen:updated");
}

function populateModelDropDown(options, modelElement,lookupResult,vehicleIndex) {
	emptySelect(modelElement);
	
	for (var i = 0; i < options.length; i++) {
		if (i < options.length) {
			modelElement.append('<option value="' + options[i] + '">' + options[i] + '</option>');
		}
	}
	//SSIRIGINEEDI: CHOSEN-STYLE
	//modelElement.trigger("chosen:updated");
	
	// Assume it needs to be enabled
	//selectElement.prop('disabled', false);
	
	$('#ff_model_' + vehicleIndex).val('');
	$('#model_' + vehicleIndex).val('');
	// SelectBoxIt adjustment
	//selectElement.trigger('changeSelectBoxIt');
	if(options.length == 0){
		checkMakeModelPopulation(lookupResult,vehicleIndex);
		
	}else{
	if(!isValidValue($('#dd_model_' + vehicleIndex).val()) && !isValidValue(lookupResult)){
		var errorMessageID =  'model.browser.inLine.required';
		showClearInLineErrorMsgsWithMap('model_'+vehicleIndex, errorMessageID, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	}
	}
}

function lookupVehicles() {
	performVehicleLookup('.vinInput',false);
}

function lookupAVehicle(lookupId) {
	var vehicleIndex = lookupId.substring('vehicleLookup_'.length);
//	if($('#stateCd').val() == 'NJ'){
//		$('#polkLookupInd_' + vehicleIndex).val('HIT');
//	}
	if($('#stateCd').val() == 'MA'){
		//var rmvLookupSuccessful = $('#rmvLookupInd_' + vehicleIndex).val();
		//if(rmvLookupSuccessful != 'Yes'){
		$('#rmvLookupInd_' + vehicleIndex).val('HIT');
		//}
	}
	else{
		$('#polkLookupInd_' + vehicleIndex).val('HIT');
	}
	performVehicleLookup('#vin_' + vehicleIndex,true);
}

function performVehicleLookup(vehicleSelector,ignoreMAValidation) {
	var lookupData = gatherLookupData(vehicleSelector,ignoreMAValidation);
	var jsonData = JSON.stringify(lookupData);
	
	//59171-When ever vehicle lookup butotn is clicked reset the premiums for All state's and for NB/Endorsement flow
	resetPremiumForAll();
	
	//blockUser();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/vehicles/lookup",
        contentType: "application/json; charset=utf-8",
        type: "post",
        data: jsonData,
        dataType: 'json',
        beforeSend:function(){
        	blockUserForVehicleLookup();
		},
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	//console.log('** performVehicleLookup is successful going to  processLookupResults **');
        	processLookupResults(response);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
            // console.log('** performVehicleLookup has failed **');
        	// log the error to the console
        	//	what to when there is error on lookup itself??
        	//            if(console) console.log(
//                "The following error occured: "+
//                textStatus, errorThrown
//            );
        },
        complete: function(){
			$.unblockUI();
			setDefaultPassiveRestraint(vehicleSelector);
			if (checkPrefillItemsAdded() ) {
				showPrefillAddedItemsEdits();
			}
		}
    });

}

function gatherLookupData(vehicleSelector,ignoreMAValidation) {
	//console.log('** gatherLookupData Begin **');
	// Store all swappable fields. There's no harm in doing this in column-specific mode
	var prefillAddedItemsList = $('#prefillAddedItemsList').val();
	//TD 73983
	if(!(checkPrefillItemsAdded() && prefillAddedItemsList == 'vehicles' && $('#stateCd').val() == 'MA')) {
		$('.swappableField').each(function() {		
			storeSwappableValue(this);
		});
	}

	var data = {};
	data.lookupData = [];
	
		$(vehicleSelector).each(function() {
		var vehicleIndex = getVehicleIndex($(this).attr('id'));
		//SSirigineedi: Fix: ALL vehicle lookup should be executed for only PPA and nonChecked YMM indicator
		//Not sure where this requirment is resting but, this has to done as above for having data integrity as this is causing issues.
		
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();
		var doLookup = false;
		if($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'CT' || 
		   $('#stateCd').val() == 'NH' || $("#stateCd").val() == 'PA'){		//PA_AUTO - added PA state
			var makeModelOverride = $('#makeModelOverrideInd_'+vehicleIndex).is(':checked');
			var polkLookupSuccessful = $('#polkLookupInd_' + vehicleIndex).val();
			if(!makeModelOverride || polkLookupSuccessful !='Yes'){
				doLookup = true;
			}
		}
		
		if($('#stateCd').val() == 'MA'){
			if(ignoreMAValidation){
				doLookup =true;
			}else{
				doLookup = rmvPolkCallRequired(vehicleIndex);
			}
		}
		
		if(isValidVehicleToLookup(vehicleType,vehicleIndex) && doLookup) {
			var vin = $(this).val();					
			var plateNumber = $('#plateNumber_'+vehicleIndex).val();			
			var plateTypeCd = $('#plateTypeCd_'+vehicleIndex).val();
			
			var year = $('#modelYear_' + vehicleIndex).val();
			var make = $('#make_' + vehicleIndex).val();
			var model = $('#model_' + vehicleIndex).val();
			
			var vehicle = {};
			vehicle.vehicleIndex = vehicleIndex;
			vehicle.vehicleTPDataId = $('#vehicleThirdPartyDataId_'+vehicleIndex).val();
			vehicle.policyKey =$('#policyKey').val();
			vehicle.vehicleId =$('#vehicleId_'+vehicleIndex).val();
			vehicle.request = {};
			vehicle.request.company = $('#companyCd').val();
			vehicle.request.state = $('#stateCd').val();
			vehicle.request.lob = $('#lob').val();
			vehicle.request.channel = $('#channelCd').val();
			vehicle.request.policyNumber = $('div > #policyNumber').val();
			vehicle.request.policyEffectiveDate = $('#policyEffDt').val();
			vehicle.onlyPolkLookup = false;
			
			if (vin != null && vin.length > 0){
				vehicle.request.vinRequestFlag = true;
				if(isUnregisteredWithVin(vehicleIndex)){
					vehicle.onlyPolkLookup = true;
				}
			}
			else{
				// 51361 - 2.4 MA, Vehicles - Year, Make, Model look up doesnt work
				// plate type/number look up is also valid for a vin look up
				// here vinRequest flag should be true
				if(isValidValue(plateNumber) && isValidValue(plateTypeCd)){
					vehicle.request.vinRequestFlag = true;
				}
				else{
						vehicle.request.vinRequestFlag = false;
				}
			}
			
			if($('#stateCd').val() == 'MA'){
				var unregisterdChecked = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
				if(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD ){
					if(!unregisterdChecked){
						vehicle.rmvAndPolkLookup = true;
					}
				}
				if(vehicleType == MOTOR_HOME_CD	|| vehicleType == UTILITY_TRAILERS_CD || vehicleType == TRAILER_W_LIVING_FAC_CD){
					if(!unregisterdChecked){
						vehicle.onlyRMVLookup = true;
					}
				}
			}
						
			vehicle.request.vin = vin;
			if (year != null && year.length > 0 && year >= 1981 &&
					make != null && make.length > 0 &&
					model != null && model.length > 0) {
					vehicle.request.year = parseInt(year);
					vehicle.request.make = make;
					vehicle.request.model = encodeURIComponent(model);
					if(isUnregisterdWithYearMakeModel(vehicleIndex)){
						vehicle.onlyPolkLookup = true;
					}
			}
			/*console.log('vehicleType ='+vehicleType+' vehicle.rmvAndPolkLookup ='+vehicle.rmvAndPolkLookup+'vehicle.onlyPolkLookup ='+vehicle.onlyPolkLookup);
			console.log('vehicle.onlyRMVLookup ='+vehicle.onlyRMVLookup+' vehicle.request.vinRequestFlag ='+vehicle.request.vinRequestFlag);
			*/vehicle.request.plateNumber=plateNumber;
			vehicle.request.plateTypeCd=plateTypeCd;
			data.lookupData.push(vehicle);
		}
	});
	/*console.log('gatherLookupData for vehicle type = '+vehicleType+' ignoreLookup = '+ignoreLookup+' polk Lookup Ind = '+$('#polkLookupInd_' + vehicleIndex).val());
	console.log('** gatherLookupData End **');*/
	return data.lookupData;
}

function isValidVehicleToLookup(vehicleType,vehicleIndex){
	var stateCd = $('#stateCd').val();
	if(stateCd != 'MA' && vehicleType == PRIVATE_PASSENGER_CD){
		return true;
	}
	if(stateCd == 'MA' && (vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD || vehicleType == MOTOR_HOME_CD
			|| vehicleType == UTILITY_TRAILERS_CD || vehicleType == TRAILER_W_LIVING_FAC_CD)){
			return true;
	}
}

function isUnregisteredWithVin(vehicleIndex){
	var shouldCallPolk = false;
	var unregisterdChecked = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var maYearMakeModelOverride = $('#ma_makeModelOverrideInd_'+vehicleIndex).is(':checked');
	var modelYear = $('#modelYear_'+vehicleIndex).val();
	
	if(unregisterdChecked){
		var vinNum = $('#vin_'+vehicleIndex).val();
		if (vinNum != null && vinNum.length > 0){
			if(!maYearMakeModelOverride && (modelYear == null || modelYear.length == 0 || parseInt(modelYear) >= 1981)){
			 shouldCallPolk = true;
			}
		}
	}
	return shouldCallPolk;
}

function isUnregisterdWithYearMakeModel(vehicleIndex){
	var unregisterdChecked = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var maYearMakeModelOverride = $('#ma_makeModelOverrideInd_'+vehicleIndex).is(':checked');
	var isValidForRevLookup = false;
	var vehicleType = $('#vehTypeCd_'+vehicleIndex).val();
	var vinNum = $('#vin_'+vehicleIndex).val();
	if((vinNum == null || vinNum.length < 1) && unregisterdChecked && !maYearMakeModelOverride && (vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD )){
		isValidForRevLookup = true;
	}
	return isValidForRevLookup;
}

function processLookupResults(lookupResults) {
	var showReverse = false;
	var channel =  $('#channelCd').val();
	//adding this as it's not defined and used
	var state = $('#stateCd').val();
	
	$('#reverseVINResults').html("");
	var vehicleType;
	var origVehType;
	for (var i = 0; i < lookupResults.length; i++) {
		if (lookupResults[i].request.vinRequestFlag) {
			//ie> Request is based on VIN.
			if(lookupResults[i].lookupSucceededFlag) {
				showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				//51616-2.4 MA - Endorsements - After successful VIN Look Up yellow fill doesnt go away
				removePreRequiredStyle($('#vin_'+lookupResults[i].vehicleIndex));
				showClearInLineErrorMsgsWithMap('modelYear_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				showClearInLineErrorMsgsWithMap('make_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				showClearInLineErrorMsgsWithMap('model_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				//Adding additional -- doesn't clear in some cases
				showClearInLineErrorMsgsWithMap('dd_model_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				showClearInLineErrorMsgsWithMap('dd_make_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				
				vehicleType = lookupResults[i].lookupResults.Vehicle_Type;
				//console.log('processLookupResults MA processLookupResults vehicle Type = '+vehicleType);
				if(isApplicableForPolkProcessing(vehicleType,lookupResults[i])) {
					//console.log('processVINResult vehicle Type = '+vehicleType+'at index = '+lookupResults[i].vehicleIndex);
					processVINResult(lookupResults[i].lookupResults, lookupResults[i].vehicleIndex,false);
					showClearInLineErrorMsgsWithMap('vehicleLookup_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				} else {
					if(state != 'MA'){
					showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.notPPAType', $('#defaultMulti').outerHTML(),
                            lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
					}
					if(state == 'MA'){
						//what is here to do this would be case for Traler caps
					}
				}
			} else if((lookupResults[i].lookupResults == null) && !(lookupResults[i].lookupSucceededFlag)){
				//If service down, show the service down message --  #45618
				if(state=='MA'){/**/}
				else if(channel == 'IA'){
					showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.ia.noservice', $('#defaultMulti').outerHTML(),
	                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				}else if(channel == 'DIRECT' || channel == 'CAPTIVE' || channel.length == 0){
					showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.noservice', $('#defaultMulti').outerHTML(),
                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				}
			} 
			else if(!lookupResults[i].lookupSucceededFlag && state == 'MA' && lookupResults[i].rmvLookupSucceededFlag){
				//process vin result here with RMV response as polk lookup for year < 1981 would fail to return any data 
				
			}
			else {
				//IF, VIN lookup has failed/ Not Valid VIN,/no results. show the inline message under VIN.
				if(state!='MA'){
					showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.vinlookup.noresults', $('#defaultMulti').outerHTML(),
						                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				}
			}
		} else {
			//ie> Request is YMM lookup for VIN
            if(lookupResults[i].lookupSucceededFlag) {
            	showReverse = processReverseVINResult(lookupResults[i], i) || showReverse;
            	showClearInLineErrorMsgsWithMap('vin_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
            	showClearInLineErrorMsgsWithMap('ff_model_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
           		showClearInLineErrorMsgsWithMap('vehicleLookup_'+lookupResults[i].vehicleIndex, "", $('#defaultMulti').outerHTML(),lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);

            } else {
				if(state == 'MA'){
				
				}else{
				showClearInLineErrorMsgsWithMap('ff_model_'+lookupResults[i].vehicleIndex, 'vin.browser.inLine.YMMlookup.noresults', $('#defaultMulti').outerHTML(),
							                        lookupResults[i].vehicleIndex, errorMessages, addRemoveVehicleRow);
				}
			}
		}
		
		//RMV lookup results mapping
		if(lookupResults[i].rmvLookupSucceededFlag) {
			origVehType = $('#vehTypeCd_'+lookupResults[i].vehicleIndex).val();
			processRMVResult(lookupResults[i].lookupResults, lookupResults[i].vehicleIndex,lookupResults[i].lookupSucceededFlag);
			
			
		}
		if(state=="MA"){
			processPolkRMVResponseMessages(lookupResults[i],origVehType);
		}
	}
	
	if(state=="MA"){
		showRMVFailedModalIfApplicable(lookupResults);	
	}
	
	if (showReverse) {
		openReverseVIN(lookupResults);
	}
	
	showHideReturnedData();
	alignRows();
	
}

function isApplicableForPolkProcessing(vehicleType,lookupResults){
	var stateCd = $('#stateCd').val();
	var isValid = false;
	if(validforNonMA(stateCd) && vehicleType !=undefined && vehicleType !=null && (vehicleType == 'Passenger' || vehicleType == 'Truck')){
		isValid = true;
	}
	if(stateCd == 'MA' && vehicleType !=undefined && vehicleType !=null && (vehicleType == 'Passenger' || vehicleType == 'Truck'
			|| vehicleType== 'Motorcycle')){
		var vehicleIndex = lookupResults.vehicleIndex;
		var vehType = $('#vehTypeCd_'+vehicleIndex).val();
		var isVehicleUnRegistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
		var isRMVSuccessful = lookupResults.rmvLookupSucceededFlag?true:false;
		if(vehType == PRIVATE_PASSENGER_CD || vehType == MOTORCYCLE_CD || vehType == ANTIQUE_CD ){
			if(!isRMVSuccessful || isVehicleUnRegistered){
				isValid = true;
			}}
		}
	return isValid;
}

function processPolkRMVResponseMessages(lookupResults,origVehType){
	var vehicleIndex = lookupResults.vehicleIndex;
	
	processRMVMessageRules(vehicleIndex,lookupResults);
	
	var isRMVSuccessful = lookupResults.rmvLookupSucceededFlag?true:false;
	var ispolkSuccesful = lookupResults.lookupSucceededFlag?true:false;
	var isVehicleUnRegistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var isNoHit = false;
	if(! isRMVSuccessful && isValidValue(lookupResults.orderStatus) &&  lookupResults.orderStatus.indexOf('VIN NOT FOUND')!=-1){
		isNoHit = true;
	}
	//handle rmv failure scenario clear rmv fields should I? no use case
	if(! isRMVSuccessful){
		
	}
	//handle polk failure scenario clear the polk fields should I? no use case
	if(! ispolkSuccesful){
		
	}
	//keep it there is no such use case but this should happen anyways
	if(! isVehicleUnRegistered && !isNoHit && isRMVSuccessful){
		showHideVehTypeFields(lookupResults.lookupResults,vehicleIndex,origVehType);
	}
	
/*	console.log(' msg ='+msg +'vin = '+vin+' plateType = '+plateType+' plateNumber = '+plateNumber+
		' yearMakeModelOverride ='+yearMakeModelOverride);
	console.log('** processPolkRMVResponseMessages End **');*/
}

function showHideVehTypeFields(lookupResults,vehicleIndex,origVehType){
	//console.log('** showHideVehTypeFields Start **');
	if(isValidValue(lookupResults)){
	var platetype=lookupResults.rmvPlateType;
	var cylinders = lookupResults.engineCylinders;
	var plateNumber = lookupResults.rmvPlateNumber;
	var typeVal = '';
	if(isValidValue(platetype) && ($.inArray(platetype, RMV_PPA_PlateType)!=-1)){
		typeVal = 'PPA';
	}else if(isValidValue(platetype) && isValidValue(cylinders) && ($.inArray(platetype, RMV_MH_PlateType)!=-1)){
		typeVal = 'MH';
	}else if(isValidValue(platetype) && !isValidValue(cylinders) && ($.inArray(platetype, RMV_TL_PlateType)!=-1)){
		typeVal = 'TL';
	}else if(isValidValue(platetype) && ($.inArray(platetype, RMV_UT_PlateType)!=-1)){
		typeVal = 'UT';

	}else if(isValidValue(platetype) && ($.inArray(platetype, RMV_MC_PlateType)!=-1)){
		typeVal = 'MC';
	}
	 vehicleTypeChange(null,vehicleIndex,typeVal,origVehType);
	 //51878
	 if(isValidValue(platetype)){
		 errorMessageID = '';
		 showClearInLineErrorMsgsWithMap('plateTypeCd_'+vehicleIndex, errorMessageID, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		}
	 if(isValidValue(plateNumber)){
		 errorMessageID = '';
		 showClearInLineErrorMsgsWithMap('plateNumber_'+vehicleIndex, errorMessageID, $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
		}
	}
	/*console.log('processing showHideVehTypeFields based on platetype ='+platetype+' cylinders ='+cylinders+' plate Number = '+plateNumber);
	console.log('** showHideVehTypeFields End **');*/
}

function rmvPolkCallRequired(vehicleIndex){
	// console.log('** rmvPolkCallRequired Start **');
	var rmvLookupDate = $('#rmvLookupDate_'+vehicleIndex).val();
	var rmvLookupInd = $('#rmvLookupInd_'+vehicleIndex).val();
	var isUnregistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var maYearMakeModelOverride = $('#ma_makeModelOverrideInd_'+vehicleIndex).is(':checked');
	var vehicleType = $('#vehTypeCd_'+vehicleIndex).val();
	var rmvPolkRequired = false;
	var sixtyDayRule = 0;

	if(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD ){
		if(!isUnregistered){
			if(rmvLookupInd != 'Yes'){
				rmvPolkRequired = true;
			}
			if(rmvLookupInd == 'Yes' && isValidValue(rmvLookupDate)){
				var xDate = new XDate();
				var rmvDate = new XDate(rmvLookupDate);
				sixtyDayRule = Math.ceil(rmvDate.diffDays(xDate));
				if(sixtyDayRule > 60){
					rmvPolkRequired = true;
				}
			}
			}else{
				if(!maYearMakeModelOverride){
					rmvPolkRequired = true;
				}
				}
		}
			
	
	if(vehicleType == MOTOR_HOME_CD	|| vehicleType == UTILITY_TRAILERS_CD || vehicleType == TRAILER_W_LIVING_FAC_CD){
		if(!isUnregistered){
			if(rmvLookupInd != 'Yes'){
				rmvPolkRequired = true;
			}
		}
	}
	// console.log('** rmvPolkCallRequired Start **');
	return rmvPolkRequired;
}

function processRMVResult(lookupResults, vehicleIndex, polkSuccessful) {	
	var stateCd = $("#stateCd").val();

	
	//console.log('** processRMVResult Begin **');
	vehicleTypeSelectionOnRMV(lookupResults,vehicleIndex);
	$('#dataSourceCd_' + vehicleIndex).val('RMV');
	$('#rmvLookupInd_' + vehicleIndex).val('Yes');
	$('#rmvLookupDate_'+vehicleIndex).val(lookupResults.rmvLookupDate);	
	//maip policy.set rmv garage town to garage town
	if (isEndorsement() && isMaipPolicy()) {
		$('#garagingTownName_' + vehicleIndex).val(lookupResults.rmvGaragingTown).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	$('#rmvGarageTown_' + vehicleIndex).val(lookupResults.rmvGaragingTown);
	
//	if(isApplicationOrEndorsement()){
//		$('#garagingAddressData_'+vehicleIndex+' .garagingAddressSelected .gaTitle' ).text(lookupResults.rmvGaragingTown);
//		$('#garagingAddressData_'+vehicleIndex+' .garagingAddressSelected' ).removeClass('hidden');
//		$('#garagingAddressData_'+vehicleIndex+' .garagingAddressNew' ).addClass('hidden');
//	}
	
	$('#plateColorCd_' + vehicleIndex).val(lookupResults.rmvPlateColor);
	$('#vehColorCd_' + vehicleIndex).val(lookupResults.rmvVehicleColor);
	$('#registrationStatus_' + vehicleIndex).val(lookupResults.rmvRegStatus);	
	//UW Tier changes
	$('#lienCode_' + vehicleIndex).val(lookupResults.lienCode);
	$('#registrationDate_' + vehicleIndex).val(lookupResults.registrationDate);
	$('#registeredOwnerName_' + vehicleIndex).val(lookupResults.registeredOwnerName);
	$('#ownerFirstName_' + vehicleIndex).val(lookupResults.registeredOwnerFirstName);
	$('#ownerLastName_' + vehicleIndex).val(lookupResults.registeredOwnerLastName);
	$('#registeredOwnerDOB_' + vehicleIndex).val(lookupResults.registeredOwnerDOB);
	$('#registeredOwnerLic_' + vehicleIndex).val(lookupResults.registeredOwnerLic);
	$('#registeredOwnerLicSt_' + vehicleIndex).val(lookupResults.registeredOwnerLicSt);
	$('#vehicleThirdPartyDataId_' + vehicleIndex).val(lookupResults.thirdPartyDataId);
	
	if((stateCd != 'MA') || ($("#endorsementVehicleReplacedInd_" + vehicleIndex).val() != "Yes" )){
		$('#priorOdometerReadingVal_'+ vehicleIndex).val(lookupResults.priorOdometerReading);
		$('#priorOdometerReadingDt_'+ vehicleIndex).val(lookupResults.priorOdometerReadingDate);
		$('#odometerReadingVal_'+ vehicleIndex).val(lookupResults.currentOdometerReading);
		$('#odometerReadingDt_'+ vehicleIndex).val(lookupResults.currentOdometerReadingDate);
	}
	$('#plateIssueDate_'+vehicleIndex).val(lookupResults.plateOriginalIssueDate);
	$('#cylinder_'+vehicleIndex).val(lookupResults.engineCylinders);
	$('#registrationOdometerReading_'+vehicleIndex).val(lookupResults.odometerAtFirstRegistration);
	//53052- Utility Trailer/Trailers with Living facilities Look up by Plate type and Plate # doesn't return VIN
	$('#vin_' + vehicleIndex).val(lookupResults.rmvVIN);
	processPolkRelatedData(lookupResults,vehicleIndex,polkSuccessful);
	
	// look for Veh Type from RMV here 
	//var vehType = lookupResults.Vehicle_Type;
	var vehType = $('#vehTypeCd_'+ vehicleIndex).val();
	if(isValidValue(vehType) && vehType.toUpperCase() == MOTORCYCLE_CD && isValidValue(lookupResults.avgRetailValue)){
		$('#motorCycleAverageRetailValue_'+vehicleIndex).val(lookupResults.avgRetailValue);
	}
	else{
		$('#motorCycleAverageRetailValue_'+vehicleIndex).val("");
	}
	
	//default purchased new or used based on odometerAtFirstRegistration value - frd 3.2.23
	if(lookupResults.odometerAtFirstRegistration != null && lookupResults.odometerAtFirstRegistration != undefined && 
	parseInt(lookupResults.odometerAtFirstRegistration) > 0){
		if(parseInt(lookupResults.odometerAtFirstRegistration) < 1000){
			$('#newUsedInd_'+vehicleIndex).val('N').trigger('chosen:updated');
		}
		else{
			$('#newUsedInd_'+vehicleIndex).val('U').trigger('chosen:updated');
		}
	}
	validateNewOrUsedOnLookup(vehicleIndex);
	
	
	//55072
	
	if(!isValidValue(lookupResults.rmvPlateType) || !isValidValue(lookupResults.rmvPlateNumber)){
		$('#rmvPartialDataInd_'+vehicleIndex).val("Yes");
	}else{
		$('#rmvPartialDataInd_'+vehicleIndex).val("");
	}
	
	//55812
	if(isValidValue(lookupResults.rmvRegStatus)){
		$('#unregisteredVehicleInd_'+vehicleIndex).val("");
		$('#unregisteredVehicleInd_'+vehicleIndex).prop("checked",false);
	}
	else{
		$('#unregisteredVehicleInd_'+vehicleIndex).val("Yes");
		$('#unregisteredVehicleInd_'+vehicleIndex).prop("checked",true);
	}
	
	
	$('#plateTypeCd_'+ vehicleIndex).val(lookupResults.rmvPlateType).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	//53105-MA 2.4 [Plate # Motorhome] Plate # field should be a required fields for VEH Type Motor Home

	/*if((stateCd != 'MA') || ($("#endorsementVehicleReplacedInd_" + vehicleIndex).val() != "Yes" )){
	
	}*/
	
	$('#plateNumber_'+vehicleIndex).val(lookupResults.rmvPlateNumber).removeClass('preRequired');
	//vehicleTypeSelectionOnRMV(lookupResults,vehicleIndex);
	var leasedVehicle = lookupResults.vehicleLeasedInd;
	//console.log('vehicle Leased Ind = '+leasedVehicle);
	$('#vehicleLeasedInd_'+ vehicleIndex).val(leasedVehicle);
	$('#vehicleLeasedInd_'+ vehicleIndex).trigger('chosen:updated');

	//var state = $('#stateCd').val();
	//CC#500 
	/*if(state.toUpperCase() == 'MA' && lookupResults.hasRmvGaragingTown == "true"){
		intializeRmvGaragingTown(vehicleIndex,lookupResults.rmvGaragingTown);
	}*/
	
	showHideRMVColumns(lookupResults,vehicleIndex);
	
	
	//53908-RMV Call for Vehicles -where RMV successful- Polk not called because prior to 1981 - when made on Vehicle page buttons - missing Model
	if(isValidValue(lookupResults.rmvYear) && parseInt(lookupResults.rmvYear) < 1981){
		var ffMakeVal = $('#ff_make_'+ vehicleIndex).val();
		if(isValidValue(ffMakeVal)){
			$('#ff_model_'+ vehicleIndex).val(lookupResults.rmvModel).prop('disabled',true).removeClass('preRequired');
		}
	}
	
	// keep this only active for RMV
	//52454-Plate type and Vehicle Type invalid combination edits firing incorrectly
	//uncommenting this now we need it seems
	showHideVehicleTypePlateTypeEdit(vehicleIndex);
	//53105-MA 2.4 [Plate # Motorhome] Plate # field should be a required fields for VEH Type Motor Home
	showHidePlateNumberEdit(vehicleIndex);
	
	
	if(leasedVehicle == 'Yes'){
		editInsurableInterestForRmvResponse('editInsurableInterest_'+vehicleIndex, lookupResults);
	}
	
	// 60333- MA Only-To prevent Issue Rollback-require quote edit for Successful Vehicle RMV Call when Vehicle is not leased, 
	// but no Registered Owner info returned from RMV
	vehLeaseRMVOwnerDetailsMissingMessage(vehicleIndex);
	/*console.log('processing RMV result for vehicle Type ='+vehType+' at index ='+vehicleIndex);
	console.log('rmv Year = '+lookupResults.rmvYear +'rmvMake = '+lookupResults.rmvMake+' rmvModel = '+lookupResults.rmvModel+' bodyType = '+lookupResults.rmvBodyType
			+'vin '+lookupResults.rmvVIN);
	console.log('** processRMVResult End **');*/
	
	
}

function processPolkRelatedData(lookupResults,vehicleIndex,polkSuccessful){
	//console.log('processPolkRelatedData start');
	var isUnregistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var vehicleType = $('#vehTypeCd_'+vehicleIndex).val();
		
	if(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD || 
			vehicleType == MOTOR_HOME_CD	|| vehicleType == UTILITY_TRAILERS_CD || vehicleType == TRAILER_W_LIVING_FAC_CD){
			if(!isUnregistered){
				var originalVinValue = 	$('#vin_' + vehicleIndex).val();
				if(polkSuccessful){
					$('#polkLookupInd_'+vehicleIndex).val('Yes');	
				}
				//Start-populate polk data start
				if(vehicleType == PRIVATE_PASSENGER_CD || vehicleType == MOTORCYCLE_CD || vehicleType == ANTIQUE_CD){
					
					//51928 : for motrocycle populate Original cost new and not cost new keep original cost new disabled?
					//var vehType = lookupResults.Vehicle_Type;
					
					if(isValidValue(vehicleType) && vehicleType.toUpperCase() == MOTORCYCLE_CD){
						$('#costNewAmt_' + vehicleIndex).val('').removeClass('preRequired').prop('disabled', true);
						if(lookupResults.List_Price != '' && null != lookupResults.List_Price && '0' != lookupResults.List_Price && '00000' != lookupResults.List_Price ) {
							$("#motorCycleOriginalCostNew_"+vehicleIndex).val(lookupResults.List_Price);
						}else{
							$("#motorCycleOriginalCostNew_"+vehicleIndex).val('');
						}
						if(lookupResults.Cubic_Inch_Displacement !=null && lookupResults.Cubic_Inch_Displacement !=undefined && lookupResults.Cubic_Inch_Displacement !=''){
							$("#motorCycleCc_"+vehicleIndex).val(lookupResults.Cubic_Inch_Displacement);
						}
						else{
							$("#motorCycleCc_"+vehicleIndex).val('');
						}
						showClearInLineErrorMsgsWithMap('costNewAmt_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
					}
					else{
						if(lookupResults.List_Price != '' && null != lookupResults.List_Price && '0' != lookupResults.List_Price && '00000' != lookupResults.List_Price ) {
							$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).prop('disabled', true);
							showClearInLineErrorMsgsWithMap('costNewAmt_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	
						} else {
							//$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).change().removeClass('preRequired').prop('disabled', false);
							// don't fire change event automatically for '0' and '00000' value. User should see the value and field should be editable to change.
							if ( null != lookupResults.List_Price && ('0' == lookupResults.List_Price || '00000' == lookupResults.List_Price) ) {
								$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).removeClass('preRequired').prop('disabled', false);
							} else {
								$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).change().removeClass('preRequired').prop('disabled', false);
							}
						}
					}
					
					$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
					$('#highTheftInd_' + vehicleIndex).val(lookupResults.High_Theft_Code);
					//$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
					$('#symbol_' + vehicleIndex).val(lookupResults.Symbol);
					$('#weight_' + vehicleIndex).val(lookupResults.GrossVehicleWeight);	
					$('#symbolPip_' + vehicleIndex).val(lookupResults.PIP_MED_Symbol_Code);	
					$('#vrgColl_' + vehicleIndex).val(lookupResults.VRG_COLL);	
					$('#vrgComp_' + vehicleIndex).val(lookupResults.VRG_COMP);	
					$('#airbagsInd_' + vehicleIndex).val(lookupResults.Vehicle_Airbags);	
					$('#performanceTypeCd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
					
				}
				
				//PA_AUTO
				if(isValidValue(vehicleType) && (vehicleType.toUpperCase() == PRIVATE_PASSENGER_CD || vehicleType.toUpperCase() == MOTOR_HOME_CD)){
					if(lookupResults.Restraint_Type != null){
						$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
						setPassiveRestraint(lookupResults.Restraint_Type_Code, vehicleIndex);
					} else{
						$('#passiveRestraint_' + vehicleIndex).val("Driver & Passenger Airbags");
					}
				}
				
				//END- populate pok data
				 
				//52650 - Utility Trailer - Year/Make/Model not returned from registry call
				$('#modelYear_'+ vehicleIndex).val(lookupResults.rmvYear).prop('disabled',true).removeClass('preRequired');
				/*	$('#modelYear_'+ vehicleIndex).val(lookupResults.rmvYear).prop('disabled',true).removeClass('preRequired');
				$('#ff_make_'+ vehicleIndex).val(lookupResults.rmvMake).prop('disabled',true).removeClass('preRequired');
				
				//52949 - Year/Make/Model Fields not locked down after lookup for ALL vehicle types
				$('#ff_model_'+ vehicleIndex).val(lookupResults.rmvModel).prop('disabled',true).removeClass('preRequired');
				$('#dd_make_'+ vehicleIndex).val(lookupResults.rmvMake).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
				$('#dd_model_'+ vehicleIndex).val(lookupResults.rmvModel).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
				$('#bodyTypeCd_'+ vehicleIndex).val(lookupResults.rmvBodyType).removeClass('preRequired');

*/
//				console.log('Year = '+lookupResults.rmvYear+'lookupResults.rmvMake ='+lookupResults.rmvMake+'lookupResults.rmvModel ='+lookupResults.rmvModel
//						+'lookupResults.rmvBodyType ='+lookupResults.rmvBodyType);

				$('#bodyTypeCd_'+ vehicleIndex).val(lookupResults.rmvBodyType).removeClass('preRequired');
				
				var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
					
				performVehicleMakeLookup(lookupResults.rmvYear,  vehicleMakeElement,
										vinMakeLookupSuccess(lookupResults, vehicleIndex, vehicleMakeElement, 'RMV'),
										makeLookupFailure(vehicleMakeElement));
				//console.log('All call completes here make is set to '+$('#make_' + vehicleIndex).val()+'ddMake ='+$("#dd_make_" + vehicleIndex).val()+'ffMake ='+$('#ff_make_' + vehicleIndex).val());
					var modelElement = $('#dd_model_' + vehicleIndex);
				//43568 -- If Model is alrealy selected; then do not replace
					if(($('#dd_model_' + vehicleIndex).get(0).selectedIndex == 0) || originalVinValue.length != 0 ){
					performModelLookup(lookupResults.rmvYear, lookupResults.rmvMake, modelElement,
										vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement, 'RMV'),
										modelLookupFailure(modelElement));
				}else{
					//46781
					$('#model_' + vehicleIndex).val(modelElement.val());
					$('#ff_model_' + vehicleIndex).val(modelElement.val());
					modelElement.trigger('chosen:updated');
				}
				
			}
	}
	
}

function showHideRMVColumns(lookupResults,vehicleIndex){
	
	var rmvPartialData = $('#rmvPartialDataInd_'+vehicleIndex).val() == 'Yes';
	var stateCd = $('#stateCd').val();
	var rmvLookupInd = $('#rmvLookupInd_' + vehicleIndex).val() == 'Yes';
	var isUnRegistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');
	var disableMe = false;
	if(stateCd == 'MA' && rmvLookupInd){
		disableMe = true;
		if(isUnRegistered){
			showHideMassYMMOverride(vehicleIndex);
			$('#ma_makeModelOverrideInd_'+vehicleIndex).prop('disabled',true);
		}
	}
	
	if(!isUnRegistered){
		$('#unregisteredVehicleInd_'+vehicleIndex).prop('disabled', (disableMe && !rmvPartialData));
	}else{
		$('#unregisteredVehicleInd_'+vehicleIndex).prop('disabled', false);
	}
	$('#vin_'+vehicleIndex).prop('disabled', disableMe);
	//54072-AI Endorsement - plate type and number not grayed out when doing add vehicle
	$('#plateNumber_'+vehicleIndex).prop('disabled', (!rmvPartialData && disableMe));
	$('#plateTypeCd_'+vehicleIndex).prop('disabled', (!rmvPartialData && disableMe)).trigger('chosen:updated');
	//54157-NB-Body Type field is not read-only after vehicle lookup
	//54140-AI Endorsement - Body type not grayed out when adding motorhome by looking up Plate #
	$("#bodyTypeCd_" + vehicleIndex).prop('disabled', disableMe);
	
	$('#ff_make_'+ vehicleIndex).prop('disabled',disableMe).removeClass('preRequired');
	$('#dd_make_'+ vehicleIndex).prop('disabled',disableMe).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#ff_model_'+ vehicleIndex).prop('disabled',disableMe).removeClass('preRequired');
	$('#dd_model_'+ vehicleIndex).prop('disabled',disableMe).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	
}


function vehicleTypeSelectionOnRMV(lookupResults,vehicleIndex){
	var platetype=lookupResults.rmvPlateType;
	var cylinders = lookupResults.engineCylinders;
	
	if(isValidValue(platetype) && ($.inArray(platetype, RMV_PPA_PlateType)!=-1)){
		$('#vehTypeCd_'+ vehicleIndex).val('PPA').trigger('chosen:updated');
	}else if(isValidValue(platetype) && isValidValue(cylinders) && ($.inArray(platetype, RMV_MH_PlateType)!=-1)){
		$('#vehTypeCd_'+ vehicleIndex).val('MH').trigger('chosen:updated');

	}else if(isValidValue(platetype) && !isValidValue(cylinders) && ($.inArray(platetype, RMV_TL_PlateType)!=-1)){
		$('#vehTypeCd_'+ vehicleIndex).val('TL').trigger('chosen:updated');
	}else if(isValidValue(platetype) && ($.inArray(platetype, RMV_UT_PlateType)!=-1)){
		$('#vehTypeCd_'+ vehicleIndex).val('UT').trigger('chosen:updated');

	}else if(isValidValue(platetype) && ($.inArray(platetype, RMV_MC_PlateType)!=-1)){
		$('#vehTypeCd_'+ vehicleIndex).val('MC').trigger('chosen:updated');
	}
}
//55068 - on reverse lookup dont disable year/make/model/bodyType/ymm
function processVINResult(lookupResults, vehicleIndex,isReverse) {
	//console.log('processVINResult start');
	var originalVinValue = 	$('#vin_' + vehicleIndex).val();
	
	//$('#dataSourceCd_' + vehicleIndex).val('RMV');
	//dont set polkLookup indicator when doing reverse lookup
	if(!isReverse){
		$('#polkLookupInd_' + vehicleIndex).val('Yes');
	}else{
		$('#polkLookupInd_' + vehicleIndex).val('Rev');
	}
	$('#vin_' + vehicleIndex).val(lookupResults.Vin);
	$('#vin_' + vehicleIndex).data("previous-value", lookupResults.Vin);
	
	//57584
	if(isValidValue(lookupResults.Vin)){
		//UW Tier - Lien Category, clear vin
		if(!isEndorsement() && originalVinValue!=lookupResults.Vin){
			$('#polLienCatCode').val('');
		}
		$('#vin_' + vehicleIndex).removeClass('preRequired');
	}
	
	$('#modelYear_' + vehicleIndex).val(lookupResults.Year);
	
	$('#bodyTypeCd_' + vehicleIndex).val(lookupResults.Body_Type);
	if($('#vehTypeCd_' + vehicleIndex).val() == PRIVATE_PASSENGER_CD){
		addPreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}else{
		removePreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}

	if (lookupResults.Body_Type != null && lookupResults.Body_Type != '') {
		showClearInLineErrorMsgsWithMap('bodyTypeCd_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	}
	
	//$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).change().removeClass('preRequired');
	
	//51928 : for motrocycle populate Original cost new and not cost new keep original cost new disabled?
	var vehType = lookupResults.Vehicle_Type;
	if(isValidValue(vehType) && vehType.toUpperCase() == 'MOTORCYCLE'){
		$('#costNewAmt_' + vehicleIndex).val('').removeClass('preRequired').prop('disabled', true);
		if(lookupResults.List_Price != '' && null != lookupResults.List_Price && '0' != lookupResults.List_Price && '00000' != lookupResults.List_Price ) {
			$("#motorCycleOriginalCostNew_"+vehicleIndex).val(lookupResults.List_Price);
		}else{
			$("#motorCycleOriginalCostNew_"+vehicleIndex).val('');
		}
		if(lookupResults.Cubic_Inch_Displacement !=null && lookupResults.Cubic_Inch_Displacement !=undefined && lookupResults.Cubic_Inch_Displacement !=''){
			$("#motorCycleCc_"+vehicleIndex).val(lookupResults.Cubic_Inch_Displacement);
		}
		else{
			$("#motorCycleCc_"+vehicleIndex).val('');
		}
		showClearInLineErrorMsgsWithMap('costNewAmt_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	}
	else{
		if(lookupResults.List_Price != '' && null != lookupResults.List_Price && '0' != lookupResults.List_Price && '00000' != lookupResults.List_Price ) {
			$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).prop('disabled', true);
			showClearInLineErrorMsgsWithMap('costNewAmt_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	
		} else {
			// don't fire change event automatically for '0' and '00000'. User should see the value and field should be editable to change.
			if ( null != lookupResults.List_Price && ('0' == lookupResults.List_Price || '00000' == lookupResults.List_Price) ) {
				$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).removeClass('preRequired').prop('disabled', false);
			} else {
				$('#costNewAmt_' + vehicleIndex).val(lookupResults.List_Price).change().removeClass('preRequired').prop('disabled', false);
			}
		}
	}
	
	$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
	$('#highTheftInd_' + vehicleIndex).val(lookupResults.High_Theft_Code);
	
	$('#symbol_' + vehicleIndex).val(lookupResults.Symbol);
	$('#weight_' + vehicleIndex).val(lookupResults.GrossVehicleWeight);	
	$('#symbolPip_' + vehicleIndex).val(lookupResults.PIP_MED_Symbol_Code);	
	$('#vrgColl_' + vehicleIndex).val(lookupResults.VRG_COLL);	
	$('#vrgComp_' + vehicleIndex).val(lookupResults.VRG_COMP);	
	$('#airbagsInd_' + vehicleIndex).val(lookupResults.Vehicle_Airbags);	
	$('#performanceTypeCd_' + vehicleIndex).val(lookupResults.Performance_Code_Numeric);
	
	//PA_AUTO
	if($('#vehTypeCd_' + vehicleIndex).val() == PRIVATE_PASSENGER_CD || $('#vehTypeCd_' + vehicleIndex).val() == MOTOR_HOME_CD){
		if(lookupResults.Restraint_Type != null){
			$('#safetyRestraintType_' + vehicleIndex).val(lookupResults.Restraint_Type_Code);
			setPassiveRestraint(lookupResults.Restraint_Type_Code, vehicleIndex);
		} else{
			$('#passiveRestraint_' + vehicleIndex).val("Driver & Passenger Airbags");
		}
	}
	
	// We need to perform lookups for Make and Model drop downs and set the selected value.
	//55068-
	var vTypeCd = $('#vehTypeCd_' + vehicleIndex).val();
	if($('#stateCd').val() == 'MA' && (vTypeCd == PRIVATE_PASSENGER_CD || vTypeCd == ANTIQUE_CD || vTypeCd == MOTORCYCLE_CD)){
		var isVehicleUnRegistered = $('#unregisteredVehicleInd_'+vehicleIndex).is(':checked');		
		if(isVehicleUnRegistered && !isReverse){			
			$('#modelYear_'+ vehicleIndex).val(lookupResults.Year).prop('disabled',true).removeClass('preRequired');
			$('#ff_make_'+ vehicleIndex).val(lookupResults.Make).prop('disabled',true).removeClass('preRequired');
			$('#ff_model_'+ vehicleIndex).val(lookupResults.Model).prop('disabled',true).removeClass('preRequired');
			$('#dd_make_'+ vehicleIndex).val(lookupResults.Make).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#dd_model_'+ vehicleIndex).val(lookupResults.Model).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#bodyTypeCd_'+ vehicleIndex).val(lookupResults.Body_Type).removeClass('preRequired');
			$("#bodyTypeCd_" + vehicleIndex).prop('disabled', true);
			$('#ma_makeModelOverrideInd_'+vehicleIndex).prop('disabled', true);		
		}
	}
	
	if($('#stateCd').val() != 'MA'){ 
	//52650 - Utility Trailer - Year/Make/Model not returned from registry call
		//dont disable fields when reversed look up
		var vinNum = $('#vin_' + vehicleIndex).val();
		if(!isReverse && isValidValue(vinNum) && vinNum.length == 17){
		$('#modelYear_'+ vehicleIndex).val(lookupResults.Year).prop('disabled',true).removeClass('preRequired');
		$('#ff_make_'+ vehicleIndex).val(lookupResults.Make).prop('disabled',true).removeClass('preRequired');
		//52949 - Year/Make/Model Fields not locked down after lookup for ALL vehicle types
		$('#ff_model_'+ vehicleIndex).val(lookupResults.Model).prop('disabled',true).removeClass('preRequired');
		$('#dd_make_'+ vehicleIndex).val(lookupResults.Make).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#dd_model_'+ vehicleIndex).val(lookupResults.Model).prop('disabled',true).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#bodyTypeCd_'+ vehicleIndex).val(lookupResults.Body_Type).removeClass('preRequired');
		$("#bodyTypeCd_" + vehicleIndex).prop('disabled', true);
		
		//57782-17 Digit VIN lookup Yr/Make/Model Override display
		var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).is(':checked');
		var vinEntered = $('#vin_' + vehicleIndex).val();
		var protectYMMFlag = (!isYMMOverideCheck && vinEntered.length == 17) ? true : false;
		$('#makeModelOverrideInd_'+vehicleIndex).prop('disabled', protectYMMFlag);
		}
		
	}
	/*console.log('lookupResults.Year ='+lookupResults.Year+'lookupResults.Make ='+lookupResults.Make+'lookupResults.Model ='+lookupResults.Model+'lookupResults.Body_Type ='+lookupResults.Body_Type);*/
	var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
	
		performVehicleMakeLookup(lookupResults.Year,  vehicleMakeElement,
			vinMakeLookupSuccess(lookupResults, vehicleIndex, vehicleMakeElement, 'POLK'),
			makeLookupFailure(vehicleMakeElement));
		var modelElement = $('#dd_model_' + vehicleIndex);
		//43568 -- If Model is alrealy selected; then do not replace
		if(($('#dd_model_' + vehicleIndex).get(0).selectedIndex == 0) || originalVinValue.length != 0 ){
		
		performModelLookup(lookupResults.Year, lookupResults.NCICMake, modelElement,
					vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement, 'POLK'),
					modelLookupFailure(modelElement));
		}else{
		//46781
		$('#model_' + vehicleIndex).val(modelElement.val());
		$('#ff_model_' + vehicleIndex).val(modelElement.val());
		modelElement.trigger('chosen:updated');
		}
		
		// Based on the Rusults data, if YMM is not available,
		
		//resetVehicleTitle(vehicleIndex);
		//enableColumnFields(vehicleIndex);
		
		// enableColumnFields(vehicleIndex);
		
		//This function will be called when lookup is done through vin no only.
		if(originalVinValue !=''){
		validateNewOrUsedOnLookup(vehicleIndex);
		}

}

/*
function intializeRmvGaragingTown(index,rmvGaragingTown){
	//console.log('** intializeRmvGaragingTown Start ** ');
	var rmvLookupInd = $('#rmvLookupInd_'+index).val();
	var residentialTown = $('#residentialTown').val();
	var garagingCity = $('#garagingCityName_'+index).val();
	if(rmvGaragingTown !=null && rmvGaragingTown != undefined && rmvGaragingTown.length>1){
		$('#garagingCityName_'+index).val(rmvGaragingTown).trigger('chosen:updated').removeClass('hidden');
		$('#garagingCityName_'+index).removeClass('hidden');
		$('#garagingCity_'+index).val(rmvGaragingTown);
		$('#altGaragingInd_'+index).prop('checked',true);
		$('#altGaragingInd_'+index).val('Yes');
		showHideField('garagingCityName', index, true);
		If a vehicle is added in the application workflow or RMV called in application workflow, 
		and the RMV Garaging Town is the same as the primary residence town,
		the entire residence address is automatically mapped to the Garaging Location in AI. 
		// Todays discussion with Sarah .Do this also for Quote not just Application- 02/24/2015 so in App layer you do not need to enter zip address etc.
		// if(rmvGaragingTown.toUpperCase() == residentialTown.toUpperCase() && isApplication()
		if(rmvGaragingTown.toUpperCase() == residentialTown.toUpperCase()){
			resetGaragingAddress(index,'Init',rmvGaragingTown);
		}else{
				resetGaragingAddress(index,'Update',rmvGaragingTown);
		}
		
		if ($('#altGaragingInd_'+index).prop('checked')) {
			var typeVal = $("#vehTypeCd_" + index).val();
			$('#garagingCityName_'+index).removeClass('hidden');
			addPreRequiredStyle($('#garagingCityName_'+index));
		} 
		showHideField('garagingCityName', index, $('#altGaragingInd_'+index).prop('checked'));
		if ($(".altGaragingInd:checked").length == 0) {
			$('.garagingCityName_Row').addClass('hidden');
	 		$('.garagingCityName_Error').addClass('hidden');
	     } else {
	         	$('.garagingCityName_Row').removeClass('hidden');
	         	$('.garagingCityName_Error').removeClass('hidden');
	     }	
		}else{
			// no rmv garaging town is returned
			resetGaragingAddress(index,'Update','');
		}
	//console.log('** intializeRmvGaragingTown End ** ');
	}
	*/
//sAction values - Update/Init/CityFlip
function resetGaragingAddress(vehIndex,sAction,rmvGaragingTown){
	// there was a match with rmvGarageTown and residential garaging address
	
	//console.log('resetGaraging Address vehIndex ='+vehIndex+'sAction ='+sAction);
	//var residentialTown = $('#residentialTown').val();
	var garagingCityName = $('#garagingCityName_'+vehIndex).val();
	var garagingCityText = $('#garagingCityName_'+vehIndex).find('option:selected').text();
	
	//console.log('garagingCityName ='+garagingCityName+' garagingCityText ='+garagingCityText);
	if(sAction == 'CityFlip'){
		if(isValidValue(garagingCityName)){
				$('#garagingAddress1_'+vehIndex).val('');
				if(garagingCityName.length>2 && $.trim(garagingCityName).toUpperCase() !='OTHER'){
					$('#garagingState_'+vehIndex).val('MA');
					$('#garagingCity_'+vehIndex).val(garagingCityText);
					$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text(garagingCityText);
				}else{
					//console.log('garagingCity Name is states or other');
					if($.trim(garagingCityName).toUpperCase() !='OTHER'){
						$('#garagingState_'+vehIndex).val(garagingCityName);
					}else{
						$('#garagingState_'+vehIndex).val('');
					}
					$('#garagingCity_'+vehIndex).val('');
					$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text();
				}
				$('#garagingZipCode_'+vehIndex).val('');
				$('#garagingAddressData_'+vehIndex).removeClass('hidden');	
			}
		else{
				$('#garagingAddress1_'+vehIndex).val('');
				$('#garagingState_'+vehIndex).val('');
				$('#garagingCity_'+vehIndex).val('');
				$('#garagingZipCode_'+vehIndex).val('');
				$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text('');
			//$('#garagingAddressData_'+vehIndex).removeClass('hidden');
		}
		//rmvGaragingTown = $('#rmvGarageTown_'+vehIndex).val();
		//var garagingCityName = $('#garagingCityName_'+vehIndex).val();
		//if(isValidValue(rmvGaragingTown)){
		//	if((residentialTown.toUpperCase() == rmvGaragingTown.toUpperCase()) && (residentialTown.toUpperCase() == garagingCityName.toUpperCase())){
			//	sAction= 'Init';
			//}else{
			//	sAction= 'Update';
			//}
		//}else{
		//	rmvGaragingTown = '';
		//	sAction= 'Update';
		//}
	}
	
//	if(sAction == 'Init'){
//		$('#garagingAddress1_'+vehIndex).val($('#residentialddress').val());
//		$('#garagingState_'+vehIndex).val($('#residentialState').val());
//		$('#garagingCity_'+vehIndex).val(rmvGaragingTown);
//		$('#garagingZipCode_'+vehIndex).val($('#residentialZipCode').val());
//		$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text(rmvGaragingTown);
//		$('#garagingAddressData_'+vehIndex).removeClass('hidden');
//	}

	if(sAction == 'Update'){
		$('#garagingAddress1_'+vehIndex).val('');
		$('#garagingState_'+vehIndex).val('');
		$('#garagingCity_'+vehIndex).val('');
		$('#garagingZipCode_'+vehIndex).val('');
		$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text('');
		$('#garagingAddressData_'+vehIndex).removeClass('hidden');
	}
	
	//console.log('setting garagingCity text = '+$('#garagingCity_'+vehIndex).val());
  }


function vinMakeLookupSuccess(lookupResults, vehicleIndex, makeElement, parseResponse) {
	return function(response, textStatus, jqXHR) {
		processVinMakeLookupSuccess(response, textStatus, jqXHR,
				lookupResults, vehicleIndex, makeElement,parseResponse );
	};
}


function processVinMakeLookupSuccess(response, textStatus, jqXHR, lookupResults, vehicleIndex, makeElement,parseResponse) {
	processMakeLookupSuccess(response, textStatus, jqXHR, makeElement,lookupResults);
	if(parseResponse == 'POLK'){
		$('#make_' + vehicleIndex).val(lookupResults.NCICMake);
		$('#ff_make_' + vehicleIndex).val(lookupResults.NCICMake);
		makeElement.val(lookupResults.NCICMake).trigger('chosen:updated');
		$('#ff_make_'+vehicleIndex).trigger('chosen:updated');
		$('#make_' + vehicleIndex).trigger('chosen:updated');
		//If vin lookup has resulted in new Make which is not available in dropdown, then append that as option.	
		checkThenAppendNewMakeOption(makeElement,lookupResults.NCICMake, lookupResults.Make,lookupResults) ;
	}
	if(parseResponse == 'RMV'){
		$('#make_' + vehicleIndex).val(lookupResults.rmvMake);
		$('#ff_make_' + vehicleIndex).val(lookupResults.rmvMake);
		makeElement.val(lookupResults.rmvMake).trigger('chosen:updated');
		$('#ff_make_'+vehicleIndex).trigger('chosen:updated');
		$('#make_' + vehicleIndex).trigger('chosen:updated');
		//If vin lookup has resulted in new Make which is not available in dropdown, then append that as option.	
		checkThenAppendNewMakeOption(makeElement,lookupResults.rmvMake, lookupResults.rmvMake,lookupResults) ;
	}
	updateVehicleHeaderInfo(vehicleIndex);
}

function checkThenAppendNewMakeOption(makeElement, makeVal, makeDesc,lookupResults){
	//48534 - Make element is null in IE and "" in other browsers
	var vehicleIndex = getVehicleIndex(makeElement.attr('id'));
	if((makeElement.val() == "" || makeElement.val() == null) 
			&& makeVal != ""){
		//makeElement.append('<option value="' + makeVal  + '" selected="selected">' + makeDesc + '</option>').trigger('chosen:updated');
		swapDropDown(makeElement, true, false);
	}else if((makeElement.val() == null || makeElement.val()== "") && makeVal == ""){
		//var vehicleIndex = getVehicleIndex(makeElement.attr('id'));
		var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
		var isYMMOverideCheck =  $("#makeModelOverrideInd_" + vehicleIndex).prop('checked');
		
		if($('#stateCd').val() == 'MA'){
			isYMMOverideCheck = $("#ma_makeModelOverrideInd_" + vehicleIndex).prop('checked');
		}
		
		if(PRIVATE_PASSENGER_CD == vehicleType  && !isYMMOverideCheck) {
			swapDropDown(makeElement, false, true);
			var year = $("#modelYear_" + vehicleIndex).val();	
			var vehicleMakeElement = $("#dd_make_" + vehicleIndex);
			performVehicleMakeLookup(year, vehicleMakeElement, makeLookupSuccess(vehicleMakeElement), makeLookupFailure(vehicleMakeElement));
		} else{
			//48533 - When Make field is left blank and you leave the page and return field becomes dropdown.
			swapDropDown(makeElement, true, false);
		}
	}
	checkMakeModelPopulation(lookupResults,vehicleIndex);
}


function vinModelLookupSuccess(lookupResults, vehicleIndex, modelElement,parseResponse) {
	return function(response, textStatus, jqXHR) {
		processVinModelLookupSuccess(response, textStatus, jqXHR,lookupResults, vehicleIndex, modelElement,parseResponse);
	};
}

function processVinModelLookupSuccess(response, textStatus, jqXHR, 
		lookupResults, vehicleIndex, modelElement,parseResponse) {
	processModelLookupSuccess(response, textStatus, jqXHR, modelElement,lookupResults);
	
	if(parseResponse == 'POLK'){
	$('#model_' + vehicleIndex).val(lookupResults.Model);
	$('#ff_model_' + vehicleIndex).val(lookupResults.Model);
	
	modelElement.val(lookupResults.Model);

	//If vin lookup has discrepancy with model lookup, Append the value of Model from VIN lookup in Model dropdown.	
	checkThenAppendModelOption(modelElement, lookupResults.Model);
	}
	
	if(parseResponse == 'RMV'){
		$('#model_' + vehicleIndex).val(lookupResults.rmvModel);
		$('#ff_model_' + vehicleIndex).val(lookupResults.rmvModel);
		
		modelElement.val(lookupResults.rmvModel);

		//If vin lookup has discrepancy with model lookup, Append the value of Model from VIN lookup in Model dropdown.	
		checkThenAppendModelOption(modelElement, lookupResults.rmvModel);
		}
	
	//yellow fill removed if a freeform text is displayed with a value.
	addPreRequiredStyle($('#ff_model_' + vehicleIndex));
	
	modelElement.trigger('chosen:updated');
	
	// will check if we need to add or remove prerequired style for year and body type based on lookup
	addPreRequiredStyle($('#modelYear_'+vehicleIndex));
	if(parseResponse == 'POLK'){
	$('#bodyTypeCd_' + vehicleIndex).val(lookupResults.Body_Type);
	}
	if(parseResponse == 'RMV'){
		$('#bodyTypeCd_' + vehicleIndex).val(lookupResults.rmvBodyType);
		}
	
	if($('#vehTypeCd_' + vehicleIndex).val() == PRIVATE_PASSENGER_CD){
		addPreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}else{
		removePreRequiredStyle($('#bodyTypeCd_'+vehicleIndex));
	}

	if ((parseResponse == 'POLK' && lookupResults.Body_Type != null && lookupResults.Body_Type != '')||
			(parseResponse == 'RMV' && lookupResults.rmvBodyType != null && lookupResults.rmvBodyType != '')	
	) {
		showClearInLineErrorMsgsWithMap('bodyTypeCd_'+vehicleIndex, "", $('#defaultMulti').outerHTML(),vehicleIndex, errorMessages, addRemoveVehicleRow);
	}
	
	updateVehicleHeaderInfo(vehicleIndex);
	
	/**
	 *
	The following fields don't appear to be captured in the current Java objects. We'll need to determine if they exist in the database, and make the necessary changes to the codebase.
	
	1.	Series
	2.	Daytime_running_lamps
	3.	Security Device
	4.	MASS_Symbol - There are a number of SYMBOL-related fields, but none of them seems to be a good match
	5.	ISO_Price New_Symbol - There are a number of SYMBOL-related fields, but none of them seems to be a good match
	6.	Mass_Price_New_Symbol - There are a number of SYMBOL-related fields, but none of them seems to be a good match
	7.	List_Price
	8.	Ton
	9.	Cubic Inch displacement
	10.	BI_PD_LIAB_Symbol - There are a number of SYMBOL-related fields. In this case, there are several that are appropriate, and it's not clear which is the right one.
	11.	VinRawData
	12.	VinPlusRawData
	13.	Return_Code
	14.	Error_Status
	15.	Time
	16.	Cylinders
	17.	POLK MATCH - Maintained by the Lookup Service itself?
	 */
	
	/*
	 * 
	The following fields appear to have appropriate fields, but we need to confirm that these are correct
	
	1.	Antilock Brakes - DB alias: ANTI_LOCK_BRAKE_CD, Java field: antiLockBrakeCd
	2.	High_Theft Code  - DB alias: HIGH_THEFT_IND, Java field - highTheftInd
	3.	Restraint_Type  - DB alias: SAFETY_RESTRAINT_TYPE, Java field -  safetyRestraintType. Currently noted as â€œInquiry Specificâ€?, so it may not exist in the database at this point
	4.	Performance - DB alias: PERFORMANCE_TYPE_CD, Java field:  performanceTypeCd
	5.	Symbol - DB alias: SYMBOL, Java field: symbol
	6.	Gross Vehicle Weight -  DB alias: WEIGHT, Java field: weight
	7.	PIP_MED_Symbol  - DB alias: SYMBOL_PIP, Java field: symbolPip
	8.	VRG_COLL - DB alias: VRG_COLL, Java field: vrgColl
	9.	VRG_COMP  - DB alias: VRG_COMP, Java field: vrgComp
	10.	Vehicle_Airbags - DB alias: AIRBAGS_IND"), Java field:   airbagsInd
	11.	Performance Indicator - DB alias: PERFORMANCE_CUSTOMIZATION_IND, Java field: performanceCustomizationInd
	12.	Performance Indicator Code - Same as Performance / PERFORMANCE_TYPE_CD above ???
	 * 
	 */
	/*$('#antiLockBrakeCd_' + vehicleIndex).val(lookupResults.Antilock_Brakes_Code);
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
	
	enableColumnFields(vehicleIndex);*/
}

function checkThenAppendModelOption(modelElement, missingModel){
	if((null == modelElement.val() ||modelElement.val() == "") && missingModel != ""){
		//modelElement.append('<option value="' + missingModel + '" selected="selected">' + missingModel + '</option>').trigger('chosen:updated');
		swapDropDown(modelElement, true, false);
	}
}

function processReverseVINResult(lookupResult, index) {
	var reverseCount = 0;
	var lastKey = '';
	var vehicleIndex = lookupResult.vehicleIndex;
	
	var resultText = '<div>'
						+ '<table class="formTab"><tr class="sectionHeaderRow"><td class="sectionHeaderLabel">'
								+ '<label class="sectionHeaderLabel">'
									+'Vehicle ' + getVehicleHeader(vehicleIndex)
								+'</label>'
						+ '</td></tr></table>' 
					+ '</div><div>'
					+ '<table class="table table-striped table-bordered">' 
					+ '<thead><tr>' 
					+ '<th>Select</th>' 
					+ '<th nowrap="nowrap">Body Style</th>' 
					+ '<th nowrap="nowrap"># Cylinders</th>' 
					+ '<th>Symbol</th>' 
					+ '<th nowrap="nowrap">Comp Symbol</th>' 
					+ '<th nowrap="nowrap">Coll Symbol</th>' 
					+ '<th>VIN Prefix</th>' 
					+ '<th nowrap="nowrap">List Price</th>' 
					+ '<th>ABS</th>' 
					+ '<th style="width:250px">Restraint</th>' 
					+ '<th nowrap="nowrap">High Theft</th>' 
					+ '</tr></thead><tbody>';
	
	for (var key in lookupResult.lookupResults) {
		reverseCount++;
		lastKey = key;
		
		resultText += '<tr><td style="text-align: center;"><input type="radio" name="select_' + index +'" value="' + key + '"></td><td>' + 
			lookupResult.lookupResults[key].Body_Type +
			'</td><td>CYLINDER</td><td style="text-align: center;">' + 
			lookupResult.lookupResults[key].Symbol +
			'</td><td style="text-align: center;">' + 
			lookupResult.lookupResults[key].VRG_COMP +
			'</td><td style="text-align: center;">' + 
			lookupResult.lookupResults[key].VRG_COLL +
			'</td><td>' + 
			key +
			'</td><td style="text-align: center;">' + 
			lookupResult.lookupResults[key].List_Price +
			'</td><td>' + 
			lookupResult.lookupResults[key].Antilock_Brakes +
			'</td><td>' + 
			lookupResult.lookupResults[key].Restraint_Type +
			'</td><td style="text-align: center;">' + 
			lookupResult.lookupResults[key].High_Theft_Code +
			'</td></tr>';
	}
	
	resultText += '</tbody></table>' 
					+ '</div><div>&nbsp;</div>';
	
	if (reverseCount == 1) {
		processVINResult(lookupResult.lookupResults[lastKey], vehicleIndex,true);
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
			processVINResult(result.lookupResults[selectedKey], result.vehicleIndex,true);
		});
	}	
	$("#reverseVINDlg").modal('hide');
	var selector = $('.vehicleLookup_Row > td').hasClass('lastSelected');
	if (selector){
		var focuselem = $('.vehicleLookup_Row').find('td.lastSelected .vehicleLookup').attr('id');
		$('.vehicleLookup_Row > td').removeClass('lastSelected');
		setFocus(focuselem);	
	}
}

function cancelReverseVIN() {
	$("#reverseVINDlg").modal('hide');
	var selector = $('.vehicleLookup_Row > td').hasClass('lastSelected');
	if (selector){
		var focuselem = $('.vehicleLookup_Row').find('td.lastSelected .vehicleLookup').attr('id');
		$('.vehicleLookup_Row > td').removeClass('lastSelected');
		setFocus(focuselem);	
	}
}

function editAntiTheft(antiTheftID) {
	$('div#errormessage').empty();
	var index = antiTheftID.substring('editAntiTheft_'.length);
	$("#antiTheftVehicleIndex").val(index);
	$('#antiTheftVehicleHeader').html(getVehicleHeader(index));
	
	var noneSelected = $("#antiTheftDevices_" + index + "_NONE");
	
	if (noneSelected.length > 0 && noneSelected.val() == 'true') { // NONE selected
		$(".antiTheftCheckbox").each(function() { // process all options
			if($(this).prop('id') == 'NONE') {	// NONE option			
				$(this).prop('checked', true);  // checked		
			} else { 							// All other Option
				$(this).prop('checked', false); // Clear out selection
				$(this).prop('disabled', true); // Disable the option
			}
		});
	} else { // Option NONE was not selected
		$(".antiTheftCheckbox").each(function() { // check selections on all other options and check/uncheck accordingly
			var selection = $("#antiTheftDevices_" + index + "_" + this.id);
			$(this).prop('disabled', false); // enable in case it was disabled 
			$(this).prop('checked', selection.length > 0 && selection.val() == 'true'); // process checked for this option
		});	
	}
	
	$("#antiTheftDlg").modal('show').data("opener", antiTheftID);;
}


function validateAntiTheft(antiTheftObj) {
	if (antiTheftObj.id == 'NONE') { 		
		if(antiTheftObj.checked) {
			$(".antiTheftCheckbox").each(function() {
				if($(this).prop('id') != 'NONE') {					
					$(this).prop('checked', false);
					$(this).prop('disabled', true);
				}
			});
		} else {
			$(".antiTheftCheckbox").each(function() {
				$(this).prop('disabled', false);				
			});
		}
	} 
}

function saveAntiTheft() {
	//Fix for Defect#39817 - Vehicles - RATE stays ACTIVE when you Add/Change/Delete the anti-theft on vehicle - FOCUS UAT 
	resetPremiumForAll();
	
	var index = $("#antiTheftVehicleIndex").val();
	var elementsToAdd = '';
	
	var selectedCount = 0;
	$(".antiTheftCheckbox").each(function() {
		var selected = $(this).prop('checked');
		if (selected) {
			if($(this).prop('id') != 'NONE') {
				selectedCount++;
			}			
		}
		
		var atType = this.id;
		var selection = $("#antiTheftDevices_" + index + "_" + atType);
		if (selection.length > 0) {
			// If the input exists for Anti-Theft type, set its checked state
			selection.val(selected);
			if (selected) {
				$("#antiTheftDevices_" + index + "_" + atType+"_atDeviceTypeCd").val(atType);	
			}			
		} else if (selected) {
			// Otherwise, if the Anti-Theft type is checked, create the necessary input
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
		 $("#antiTheftContents_" + index + " .antiTheftValues").html(values.html() + elementsToAdd);
	}
	
	if (selectedCount == 0) {
		selectedCount = "0";
	}else {
		selectedCount = selectedCount + ' device(s)';		
	}
	
	$("#antiTheftContents_" +  index + " .antiTheftSelectedDetails" + " .antiTheftSelectedCountDesc").text(selectedCount  + " selected");
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

function validateMotorCycleEdits(motorCycle, columnIndex){
	var mcFieldName = motorCycle.id;
	var mcFieldValue = $('#'+mcFieldName).val();
	var errorMessageID ='';
	if(mcFieldName.indexOf('motorCycleCc') !=- 1){
		if(!isValidValue(mcFieldValue)){
			errorMessageID = 'motorCycleCc.browser.inLine.required';
		}else if(mcFieldValue != undefined && mcFieldValue < 50){
			errorMessageID = 'motorCycleCc.browser.inLine.greaterThan49';
		}
	}
	if(mcFieldName.indexOf('motorCycleAverageRetailValue') != -1){
		if(!isValidValue(mcFieldValue)){	
			errorMessageID = 'motorCycleAverageRetailValue.browser.inLine.required';
		}else if(mcFieldValue != undefined && mcFieldValue < 200){
			errorMessageID = 'motorCycleAverageRetailValue.browser.inLine.greaterThan200';
		}
	}
	if(mcFieldName.indexOf('motorCycleOriginalCostNew') != -1){
		if(!isValidValue(mcFieldValue)){
			errorMessageID = 'motorCycleOriginalCostNew.browser.inLine.required';
		} else if(mcFieldValue != undefined && mcFieldValue == 0){
			errorMessageID = 'motorCycleOriginalCostNew.browser.inLine.greaterThanZero';
		}
	}
	showClearInLineErrorMsgsWithMap(mcFieldName, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
}

function validateCostNewAmt(costNewAmt, columnIndex) {
	return validateCostNewRequiredWithMap(costNewAmt, 'costNewAmt.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
}

function validateVehicleValue(vehicleValue, columnIndex) {
	return validateVehicleValueRequiredWithMap(vehicleValue, 'vehicleValue.browser.inLine',$('#defaultMulti').outerHTML(), columnIndex, 
											   errorMessages,addRemoveVehicleRow);
}

function validateGaragingAddress(garagingAddress, columnIndex) {
	return validateGARequiredWithMap(garagingAddress, 'garagingAddressData.browser.inLine.addressrequired',$('#defaultMulti').outerHTML(), columnIndex,
									errorMessages,addRemoveVehicleRow);	
}

function validateGaragingCity(garagingCity, columnIndex) {
	return validateGARequiredWithMap(garagingCity, 'garagingAddressData.browser.inLine.cityrequired',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);		
}

function validateGaragingState(garagingState, columnIndex) {
	return validateGARequiredWithMap(garagingState, 'garagingAddressData.browser.inLine.staterequired',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateGaragingZipCode(garagingZipCode, columnIndex) {
	var zip = $('#garagingZipCode_' + columnIndex).val();
	
	var disallowed = ['00000','11111','22222','33333','55555','66666','77777','88888','99999'];
	// What do you know! turns out 44444 is NEWTON FALLS OH and 12345 is SCHENECTADY NY ! HUH :)
	if(zip.length == 5 && jQuery.inArray(zip, disallowed) != -1) {
		var errorMessageID =  'garagingAddressData.browser.inLine.invalidZip';
		showClearInLineErrorMsgsWithMap('garagingZipCode_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
		$('#garagingZipCode_' + columnIndex).val("");
	} else if (zip.length != 0  && (zip.length < 5) || (zip.length > 5 && zip.length < 9)) {
		var errorMessageID =  'garagingAddressData.browser.inLine.invalidZip';	
		showClearInLineErrorMsgsWithMap('garagingZipCode_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);				
	} else {
		return validateRequiredWithMap(garagingZipCode, 'garagingZipCode.browser.inLine', $('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow);
	}
}

function validateGaragingCityName(garagingCityName, columnIndex) {
	var garagingCityName = $('#garagingCityName_' + columnIndex).val();
	//var rmvGaragingTown = $('#rmvGaragingTown_'+columnIndex).val();
	//$('#garagingCity_'+columnIndex).val(garagingCityName);
	
	var isAltGarageChecked = $('#altGaragingInd_'+columnIndex).prop('checked');
	var errorMessageID =  '';
	if(isAltGarageChecked && (garagingCityName == undefined || garagingCityName == null || garagingCityName.length <= 1)){
		errorMessageID = 'garagingCityName.browser.inLine.resiTownAltGarageTownMismatch';
	}
	showClearInLineErrorMsgsWithMap('garagingCityName_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
	alignRows();
}


function validateMake(make, columnIndex) {
	return validateMakeOrModelWithMap(make, 'make.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateModel(model, columnIndex) {
	return validateMakeOrModelWithMap(model, 'model.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleYear(year, columnIndex) {
	var yearVal = $("#modelYear_" + columnIndex).val();
	var startYear = 1901;
	var currYearPlusTwo = new Date().getFullYear() + 2;		
	if (yearVal != null && yearVal.length > 0) {
		if (parseInt(yearVal) <= parseInt(startYear) || parseInt(yearVal) > parseInt(currYearPlusTwo)) {
			var errorMessageID =  'modelYear.browser.inLine.notCurrent';
			showClearInLineErrorMsgsWithMap('modelYear_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
			return;
		} 
	} 
	return validateYearWithMap(year, 'Yes', 'modelYear.browser.inLine',
				$('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow);
}

function validateNewUsedInd(newUsedInd, columnIndex) {
    return validateNewUsedIndRequiredWithMap(newUsedInd, 'newUsedInd.browser.inLine',
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

function validateVehicleTncUseInd(vehicleTncUseInd, columnIndex) {
	return validateRequiredWithMap(vehicleTncUseInd, 'vehicleTncUseInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncCompanyCd(vehicleTncCompanyCd, columnIndex) {
	return validateRequiredWithMap(vehicleTncCompanyCd, 'vehicleTncCompanyCd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncUsageLevel(vehicleTncUsageLevel, columnIndex) {
	return validateRequiredWithMap(vehicleTncUsageLevel, 'vehicleTncUsageLevel.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function validateVehicleTncDriverName(vehicleTncDriverName, columnIndex) {
	return validateRequiredWithMap(vehicleTncDriverName, 'vehicleTncDriverName.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}


function validateRVUsedAsPrimaryResidenceInd(rvUsedAsPrimaryResidenceInd, columnIndex) {
    return validateRequiredWithMap(rvUsedAsPrimaryResidenceInd, 'rvUsedAsPrimaryResidenceInd.browser.inLine',
            $('#defaultMulti').outerHTML(), columnIndex, errorMessages,
            addRemoveVehicleRow);   
}

function validateSnowPlow(snowplow, columnIndex){
	triggerChangeEvent($(snowplow));
	return validateRequiredWithMap(snowplow, 'snowplowEquipInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}


function validateVehicleType(vehicleType, columnIndex) {
	if($('#stateCd').val() == 'MA'){
		// show msg if MC selected and user has selected AARP as Affinity
		if($(vehicleType).val() == "MC" && $('#aarpSelected').val() == "true"){
			var errorMessageID =  'vehicleType.browser.inLine.aarpAffGroup';
			showClearInLineErrorMsgsWithMap('vehTypeCd_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
			return;
		}
	}
	
	return validateRequiredWithMap(vehicleType, 'vehicleType.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);
}

function validatePreInspection(preinspection, columnIndex){
	return validateRequiredWithMap(preinspection, 'preInspectionRequiredDesc.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

//TBD :: many edits around vin variations keep this in separate function before combining 
// remove these as this should align with non-MA vin edits 
// removed vin edits for MA and kept them inline with non-MA vin edits
//	Where Registry lookup is successful, there is no VIN edit; we accept what is returned.
//	If Registry lookup is unsuccessful or No Hit the edits are aligned with Non-MA rules.

/*
function validateVinMA(vin, columnIndex){
	var typeVal = $("#vehTypeCd_" + columnIndex).val();
	var yearVal = $("#modelYear_" + columnIndex).val();
	var isRegistered = $('#unregisteredVehicleInd_'+columnIndex).prop('checked');
	
	//TBD these flags come from rmv calls validate them once the data is in place
	var isSalvageVin = $('#salvageInd_'+columnIndex).val();
	var rmvReturnedVin = $('#vehicleThirdPartyVin_'+columnIndex).val();
	//is the below indicator valid for rmv?? 
	var rmvPolkIndicator = $('#polkLookupInd_'+columnIndex).val();
	var vinValue = $(vin).val();
	var errorMessageID ='';
	showClearInLineErrorMsgsWithMap('vin_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);	
	if (typeVal == ANTIQUE_CD || typeVal == PRIVATE_PASSENGER_CD  || typeVal == MOTOR_HOME_CD) {
		if((yearVal != undefined && yearVal !=null && parseInt(yearVal) >= 1981) &&  !isRegistered  && isSalvageVin !='Yes')  {
			if(vinValue ==undefined || vinValue ==null || vinValue.length != 17){
				errorMessageID = 'vin.browser.inLine.vinMustBe17Digits';
			}
		}
	if((yearVal != undefined && yearVal !=null && parseInt(yearVal) < 1981) &&  !isRegistered  && isSalvageVin !='Yes')  {
			if(vinValue !=undefined && vinValue !=null && vinValue.length >1){
				errorMessageID = 'vin.browser.inLine.noVinRequired';
			}
		}
		
	if(isRegistered && isSalvageVin !='Yes'){
			if(vinValue ==undefined || vinValue ==null || vinValue.length != 10){
				errorMessageID = 'vin.browser.inLine.vinMustBe10Digits';
			}
		}
		
		if((isSalvageVin =='Yes') && (vinValue == undefined || vinValue == null || vinValue.length<1)){
			errorMessageID = 'vin.browser.inLine.required';
		}
	
		// perform rest of Application/Issuance edits here
		if(!isQuote() && !isEndorsement()){
			if((vinValue ==undefined || vinValue ==null || vinValue.length <1) || ( rmvReturnedVin == undefined || rmvReturnedVin ==null || rmvReturnedVin.length<1)){
				errorMessageID = 'vin.browser.inLine.vinMustBeAvailableinRegistryNB';
				
			}
			if((vinValue !=undefined && vinValue !=null && vinValue.length >1) && ( rmvReturnedVin != undefined && rmvReturnedVin !=null && rmvReturnedVin.length>1)){
				if(vinValue.toLowerCase() !=  rmvReturnedVin.toLowerCase()){
					errorMessageID = 'vin.browser.inLine.vinMustMatchMARegistry';
				}
			}
		
		} 
		
		if(isEndorsement()){
			if((vinValue ==undefined || vinValue ==null || vinValue.length <1) || ( rmvReturnedVin == undefined || rmvReturnedVin ==null || rmvReturnedVin.length<1)){
						errorMessageID = 'vin.browser.inLine.vinMustBeAvailableinRegistryEND';
				}
			
			if((vinValue !=undefined && vinValue !=null && vinValue.length >1) && ( rmvReturnedVin != undefined && rmvReturnedVin !=null && rmvReturnedVin.length>1)){
				if(vinValue.toLowerCase() !=  rmvReturnedVin.toLowerCase()){
					errorMessageID = 'vin.browser.inLine.vinMustMatchMARegistry';
				}
			}
		}
		showClearInLineErrorMsgsWithMap('vin_'+columnIndex, errorMessageID, $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);
	}
}
*/

function validateVin(vin, columnIndex) {
	// Fix for Defect 40742 - Vehicles - VIN edit fired for PPA <1981 focus
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
	
	//3.2.17
	//Where Registry lookup is successful, there is no VIN edit; we accept what is returned.
	//If Registry lookup is unsuccessful or No Hit the edits are aligned with Non-MA rules.
	if(state != 'MA' || (state == 'MA' && (!rmvLookupSuccess && !prefillLookupSuccess))){
	var typeVal = $("#vehTypeCd_" + columnIndex).val();
	var yearVal = $("#modelYear_" + columnIndex).val();
	var isYMMOverride = false;
	if(state == 'MA'){
		isYMMOverride = $('#ma_makeModelOverrideInd_'+ columnIndex).prop('checked');
	}
	if(state != 'MA'){
		isYMMOverride = $("#makeModelOverrideInd_" + columnIndex).prop('checked');
	}
	
	// clear any existing inline errors
	showClearInLineErrorMsgsWithMap('vin_'+columnIndex, "", $('#defaultMulti').outerHTML(),columnIndex, errorMessages, addRemoveVehicleRow);	
	if (((typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) && !isYMMOverride) || typeVal == MOTOR_HOME_CD) {
		if((yearVal == '' || parseInt(yearVal) >= 1981) && (!isEndorsement() || (isEndorsement() && !isQuote()))) {
			return validateRequiredVINWithMap(vin, 'vin.browser.inLine', $('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow, typeVal);
		}
		//48713 - Endorse Vehicle-Incorrect VIN edit firing
		else if(parseInt(yearVal) < 1981 && typeVal == PRIVATE_PASSENGER_CD && isEndorsement()) {
			return validateRequiredVINWithMap(vin, 'vin.browser.inLine', $('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow, typeVal,true);
		}
	} else if((typeVal == PRIVATE_PASSENGER_CD || typeVal == MOTOR_HOME_CD) && isYMMOverride){
		return validateRequiredVINWithMap(vin, 'vin.browser.inLine', $('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow, typeVal);
	} else if (isApplicationOrEndorsement() && 
					(typeVal == PRIVATE_PASSENGER_CD || typeVal == TRAILER_W_LIVING_FAC_CD 
							|| typeVal == UTILITY_TRAILERS_CD || typeVal == TRAILER_CAPS_CD)) {
		var endorseQuoteMode = isQuote() && isEndorsement();
		if(endorseQuoteMode && (typeVal == TRAILER_W_LIVING_FAC_CD 
							|| typeVal == UTILITY_TRAILERS_CD || typeVal == TRAILER_CAPS_CD)){
			return;// no vin validation for trailer types for endorsement in quote mode.
		}
		return validateRequiredVINWithMap(vin, 'vin.browser.inLine', $('#defaultMulti').outerHTML(), columnIndex, errorMessages, addRemoveVehicleRow, typeVal);
	}
	}
}

function validateBodyType(bodyType, columnIndex) {
	
	var typeVal = $("#vehTypeCd_" + columnIndex).val();	
	if (typeVal == PRIVATE_PASSENGER_CD || typeVal == ANTIQUE_CD) {
		return validateRequiredWithMap(bodyType, 'bodyTypeCd.browser.inLine',
				$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
				addRemoveVehicleRow);	
	}	
}

function validateEndorsementVehicleEligibility(endorsementVehicleEligibilityInd, columnIndex){
	return validateRequiredWithMap(endorsementVehicleEligibilityInd, 'endorsementVehicleEligibilityInd.browser.inLine',
			$('#defaultMulti').outerHTML(), columnIndex, errorMessages,
			addRemoveVehicleRow);	
}

function addErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' + $(errorRow).attr('id') + '_Header"><td>&nbsp;</td></tr>';
	var headerRow;
	/*TD 54175 fix , weight is hidden field so we have to implicitely add this error header, This is hidden by default only for MA */
	if($(errorRow).attr('id') == 'weight_Error'){
		headerRow = $('.weight_Row', headerBody);
	}else{
		headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	}
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());		
	}
}

function removeErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index() + 1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
	//Also Remove the Error_Row_Header.
}

function handleSubmitFailure(result) {
}

function handleSubmit(event) {
	processVehicleEligibilityQuestions(event, isMaipPolicy());
    if (!isEndorsement()) {
		var seqNum = 1;
		$('#mainContentTableHead .vehicleSeqNum').each(function() {
		$(this).val(seqNum++);
		});
    }
       
	setPrefillDataUpdatedIndicator('vehicles');
	
	// Enable all fields so the values submit
	//48833 - Vehicle, After elgibility edit fired on new vehicle fields on the existing vehicles became enabled when they were disabled.
	if (!event.isPropagationStopped()) {
		$('input:disabled,select:disabled').prop('disabled', false);
	}
	
	// set yubi indicators
	if ($('#isEndorsement').val() != 'true') {
		setDriverYubiInd();
	}
	
	$('.vehicleTncUseInd').each(function() {
		$(this).prop('disabled', false).trigger("chosen:updated");
		var vehicleIndex = getVehicleIndex(this.id);
		
		$('#vehicleTncDriverName_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
		$('#vehicleTncCompanyCd_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
		$('#vehicleTncUsageLevel_' + vehicleIndex).prop('disabled', false).trigger("chosen:updated");
	});
}

//Overrides method from common.js
//While leaving Vehicle, certain fields need to be enabled
//48591
function jumpToDifferentTab(nextTab){
	// Enable all fields so the values submit
	$('input:disabled,select:disabled').prop('disabled', false);
	blockUser();
	
	// set yubi indicators
	setDriverYubiInd();
	
	document.aiForm.nextTab.value = nextTab;
	document.aiForm.submit();
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

//53796-Vehicle Value field produces HTTP 500 message if user enters non-numeric value in field
function validateVehicleValueRequiredWithMap(field, strErrorTag, strErrorRow,index, messageMap, addDeleteCallback) {
	var errorMessageID = isCostNew($(field).val(), 'Yes');
	if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
			$(field).val("");
	}else{
			errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,index, messageMap, addDeleteCallback);
}

function validateCostNewRequiredWithMap(field, strErrorTag, strErrorRow,index, messageMap, addDeleteCallback) {
	var errorMessageID = isCostNew($(field).val(), 'Yes');
	if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
			$(field).val("");
	}else{
			errorMessageID = '';
	}
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,index, messageMap, addDeleteCallback);
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
			msgTxt = msgTxt.replace(/(\r\n|\n|\r)/g,'');
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

function validateNewOrUsedOnLookup(vehicleIndex){
	var vehicleType = $('#vehTypeCd_' +vehicleIndex).val();
	if(vehicleType == PRIVATE_PASSENGER_CD){
		var modelYear = $("#modelYear_" + vehicleIndex).val();
		var currentYear = new Date().getFullYear();
		if(currentYear && modelYear){
	            if(modelYear >= currentYear - 2){
		        		addPreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	            }else{
	            		removePreRequiredStyle($('#newUsedInd_' + vehicleIndex));
	            }
			}
	    }
}

function setPreInspectionDefault(elm){
	//44649 #CC-243
	//48303 - Pre-inspection default incorrect
	var defaultVal = $(elm).val();
	if(defaultVal == null || defaultVal == undefined || defaultVal.length == 0){
		defaultVal = "No - Previous policy had phys. damage";
 	 	//TD 60988 Application Mode Vehicle Tab Pre-Inspection Required field Locked - Affects NJ Only - as NJ is the only state w/ preinspection field.
		$(elm).val(defaultVal)
		if(isEndorsement()){
			defaultVal = "No - PRAC customer > 1 policy term";
			$(elm).val(defaultVal).prop('disabled', true ).trigger('chosen:updated');
		}
	}
	
	
}

function restrictVinEntry(vin,len){
	// function restricst user from clearing VIN return from TP call
	$(vin).keydown(function(e) {
		var newLen = $(vin).val().length;
		if(e.keyCode == 8 && newLen == len){
			e.preventDefault();
	    }
	});
}

//Adding clearVinOnChange TD #44005
function clearVinOnChange(vehicleIndex){
	var isYMMOverride = false;
	var state = $('#stateCd').val();
	//Replacing NJ with !MA
	if(state != 'MA' && $('#makeModelOverrideInd_'+vehicleIndex).prop('checked')){
		isYMMOverride = true;
	}
	if(state == 'MA' && $('#ma_makeModelOverrideInd_'+vehicleIndex).prop('checked')){
		isYMMOverride = true;
	}
	var vehicleType = $("#vehTypeCd_" + vehicleIndex).val();
	if(vehicleType == PRIVATE_PASSENGER_CD && !isYMMOverride ) {
		if($("#modelYear_" + vehicleIndex).data('prevYear') != ''){
			if (($("#modelYear_" + vehicleIndex).data('prevYear')!== undefined  && $("#modelYear_" + vehicleIndex).data('prevYear') != $("#modelYear_" + vehicleIndex).val()) || 
				($("#make_" + vehicleIndex).data('prevMake')!== undefined  &&  $("#make_" + vehicleIndex).data('prevMake') != $("#make_" + vehicleIndex).val()) || 
				($("#model_" + vehicleIndex).data('prevModel')!== undefined  && $("#model_" + vehicleIndex).data('prevModel') != $("#model_" + vehicleIndex).val()))
			{
				$("#vin_" + vehicleIndex).val('');
	    		$('#polkLookupInd_' + vehicleIndex).val('');
			}
		}
		//57690-QUOTE & Application Field Protection Rules:
		//Add additional condition to handle make/model/yr lookup works as the very first time 
		if(isValidValue($("#vin_" + vehicleIndex).val()) && (!isValidValue($("#modelYear_" + vehicleIndex).data('prevYear')) ||
				!isValidValue($("#make_" + vehicleIndex).data('prevYear')) || !isValidValue($("#model_" + vehicleIndex).data('prevYear')))){
			$("#vin_" + vehicleIndex).val('');
    		$('#polkLookupInd_' + vehicleIndex).val('');
		}
	//Initialize old values | Replace existing values
	$("#modelYear_" + vehicleIndex).data('prevYear',$("#modelYear_" + vehicleIndex).val());
	$("#make_" + vehicleIndex).data('prevMake',$("#make_" + vehicleIndex).val());
	$("#model_" + vehicleIndex).data('prevModel',$("#model_" + vehicleIndex).val());
	}
}

//we need this function for garaging address so fix now should highlight garaging table
function validateGARequiredWithMap(field, strErrorTag, strErrorRow,
		index, messageMap, addDeleteCallback) {
	
	var errorMessageID = '';
	if (isEmpty($(field).val())){
		errorMessageID = strErrorTag;
	}else{
		errorMessageID = '';
	}
	
	showClearInLineErrorMsgsWithMap(field.id, errorMessageID, strErrorRow,
			index, messageMap, addDeleteCallback);

}

function addSearchBoxChosen(wrapper){
	if($(wrapper).hasClass('chosen-container-single-nosearch')){
		var chosenSearchField = $(wrapper).find('div.chosen-search input:text');
		if($(chosenSearchField).attr('readonly').length > 0){
			$(chosenSearchField).removeAttr('readonly'); // user should be able to search
		}
		$(wrapper).removeClass('chosen-container-single-nosearch').removeClass('chosenDropDownHidden').removeClass("chosen-disabled").trigger('chosen:updated');
	}
}

function isValidValue(strId){
	var isValid = true;
	if(strId ==  undefined || strId == null || $.trim(strId).length < 1){
		isValid = false;
	}
	return isValid;
}

function removeAdditionalInterests(vehicleIndex){
	// remove existing additional interests if vehicle is replaced
	var iiCount = parseInt($('#additionalInterests_'+vehicleIndex+'_aiCount').val());
	if(iiCount == 0){
		return;
	}
	
	var addInterestTbl = $("#additionalInterestsData_" + vehicleIndex);
	var aiTitle = $(addInterestTbl).find('span.aiTitle');
	var aiButton = $('#editInsurableInterest_' + vehicleIndex).find('span');
	$(aiTitle).text('');
	$(aiButton).text('+ Financial Interest');
	
	$('#additionalInterests_'+vehicleIndex+'_aiCount').val(0);
	for(var i=0; i<iiCount; i++){
		var id = $("#additionalInterests_" + vehicleIndex + "_" + i + "_aiId").val();
		if (id != null && id.length > 0 && ! "0" != id) {
			recordFinancialInterestDeletion(id, 'vehicle');
		}
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiType').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiId').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiSSequenceNumber').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_additionalInterestType').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiName1').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiName2').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiAddressId').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiAddress1').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiAddress2').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiZip').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiCity').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiState').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiFid').val('');
		$('#additionalInterests_' + vehicleIndex + "_" + i + '_aiLoanNumber').val('');
	}
}

//setuptabbing revised
function setupTabbingBehavior() {
	// Scroll to top after tabbing out of last field in a column
	$(".ratingTerritoryCd").keydown(function(e){
	    if(e.shiftKey == false && e.keyCode ==9) {
	        $(window).scrollTop(0);
	        if($("#rightVehicleScrollBtn").length == 1 && !$('#scrollPanel').hasClass('hidden')) {
	        	var checkboxId = $(this).attr('id') ? $(this).attr('id') : '';
	        	var scrollPosHtml = $.trim($('#scrollPos').html());
	        	var currentColumn = Number(checkboxId.charAt(checkboxId.length-1))+1;
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
	    };
	});
	
	//remove after migration to modern browsers 
	$('.colInput,.vehicleLookup,.chosen-single').keyup(function(e){
		if(e.shiftKey == true && e.keyCode == 9) {
	    	if($('#pageAlertMessage').length==1) {
	    		$(window).scrollTop($(this).offset().top - 470);
	    	} else {
	    		$(window).scrollTop($(this).offset().top - 270);
	    	}
	    }
	    validateLastInput('lastInputLeft');
	});
	
	// Scroll to bottom after tabbing into last field in a column
	$(".ratingTerritoryCd").keyup(function(e){
	    if(e.shiftKey == true && e.keyCode ==9) {
	        $(window).scrollTop($('#ratingTerritoryCd_0').offset().top);
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
	        		if(!lastColumn){
	        		// Scroll right
		        	$("#leftVehicleScrollBtn").trigger('click');
	        		}
	        		// Focus on the first field of next column
	        		setFocus('ratingTerritoryCd_' + prevColumn);
	        		e.preventDefault();
	        	}
	        }
	    };
	});
	
	// Enabling tabbing for anti theft device
/*	$('.editAntiTheftDiv').keydown(function(e){
	    if(e.keyCode == 13) $(this).find('.editAntiTheft').trigger('click');
	});*/
	
	// Tabbing behavior for External Operator (s) field
	$('.ui-dropdownchecklist-selector-wrapper').keydown(function(e){
		if(e.keyCode == 40) { 
			$(this).find('.iconOpen').trigger('click');   
		}   
	});
	
	$('input[id^=ddcl-excludedOperators_]').focus(function(){
	    $(this).parent().addClass('ui-dropdownchecklist-hover');
	});
	$('input[id^=ddcl-excludedOperators_]').blur(function(){
	    $(this).parent().removeClass('ui-dropdownchecklist-hover');
	});
	
	// Close the multi select dropdown when pressign tab from last option
	$('.ui-dropdownchecklist-dropcontainer div.ui-dropdownchecklist-item:last input').keydown(function(e){
	    if(e.keyCode == 9) { 
	     var iconClose = $(this).parent().parent().parent().parent().find('.iconClose');
	     if(iconClose && iconClose.length > 0) {
	    	setTimeout(function(){ iconClose.trigger('click'); }, 200);
	     }
	    }
	});
	
}

// 60333-MA Only-To prevent Issue Rollback-require quote edit for Successful Vehicle RMV Call when Vehicle is not leased,
// but no Registered Owner info returned from RMV
function vehLeaseRMVOwnerDetailsMissingMessage(index){
	var errorMessageID = '';
	if($('#rmvLookupInd_'+index).val() == 'Yes' && $('#vehicleLeasedInd_'+index).val() == 'No' && !$('#unregisteredVehicleInd_'+index).prop('checked')){
		if((!isValidValue($('#ownerFirstName_'+index).val()) && !isValidValue($('#ownerLastName_'+index).val())) || !isValidValue($('#registeredOwnerDOB_'+index).val()) ||
		!isValidValue($('#registeredOwnerLic_'+index).val()) || !isValidValue($('#registeredOwnerLicSt_'+index).val())){
			errorMessageID = 'vehicleLeasedInd.browser.inLine.rmvownerleaserequired';	
	}
	}
	showClearInLineErrorMsgsWithMap('vehicleLeasedInd_'+index, errorMessageID, $('#defaultMulti').outerHTML(),index, errorMessages, addRemoveVehicleRow);
}

//Set Passive Restraint
function setPassiveRestraint(restraint_Type_Code, vehicleIndex){
	var asb = 'P';			//Automatic Seat Belts
	var da = ['B' , 'D'];	//Driver Airbag
	var none = [0 , 'A'];	//None/Other
	var passiveRestraint = null;
	if(restraint_Type_Code != null){
		if($.inArray(restraint_Type_Code, asb)!=-1 ){
			passiveRestraint = "Automatic Seat Belts";
		}else if($.inArray(restraint_Type_Code, da)!=-1 ){
			passiveRestraint = "Driver Airbag";
		}else if($.inArray(restraint_Type_Code, none)!=-1 ){
			passiveRestraint = "None/Other";
		}else{
			passiveRestraint = "Driver & Passenger Airbags";
		}
		$('#passiveRestraint_' + vehicleIndex).val(passiveRestraint);
	}
}

//Default passive restraint 
function setDefaultPassiveRestraint(vehicleSelector) {
	
	$(vehicleSelector).each(function() {
		var vehicleIndex = getVehicleIndex($(this).attr('id'));
		var vehicleType =  $('#vehTypeCd_'+vehicleIndex).val();
		var restraintType = $('#safetyRestraintType_' + vehicleIndex).val();
		if(vehicleType == 'MH' || (vehicleType == 'PPA' && (restraintType == null || restraintType == ""))){
			$('#passiveRestraint_' + vehicleIndex).val("Driver & Passenger Airbags");
		}else if(vehicleType == 'PPA' && restraintType != null && restraintType != ""){
			setPassiveRestraint(restraintType, vehicleIndex);
		}
	});
}

function setDriverYubiInd() {	
	if ($('#yubiEnabled').val() == 'true' && $('#isEndorsement').val() != 'true') {
		$( ".vehicleTncDriverName" ).each(function( vehicleIndex ) {
			if($('#vehicleTncUseInd_'+vehicleIndex).val() == 'Yes'){
				var selectedDriver = $('#vehicleTncDriverName_' + vehicleIndex).val();
				var driverIdIndex = $('#vehicleTncDriverName_' + vehicleIndex).prop('selectedIndex');
				if (driverIdIndex > 0) {					
					var firstName = selectedDriver.substring(0, selectedDriver.lastIndexOf(","));
					var lastName = selectedDriver.substring(selectedDriver.lastIndexOf(",") + 1);
					
					//var names = selectedDriver.split(" ");
					//var driverIndexVal = $('#index_' + names[0] + '_' + names[1] + '_0').val();
					var driverIndexVal = $('[id="index_' + firstName + '_' + lastName + '_0"]').val();
					
					var hiddenFldId = 'drivers['+ (driverIndexVal) +'].yubiDriverInd';
					var driverYubiInd = $('[id="' + firstName + '_' + lastName + '_0"]').val();
					if (driverYubiInd != 'Yes') {
						if (!$('#'+hiddenFldId).length) {
							$('<input>').attr('type','hidden').attr('id',hiddenFldId).attr('name',hiddenFldId).attr('value', 'Yes').appendTo('#aiForm');
						} 
					}
				}
			}
		});
	}
}