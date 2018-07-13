var requestAgencies;
var requestProducers;

jQuery(document).ready(function() {
	var isRated =  $('#ratedInd').val();
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	 
	handlePolicyState(isRated);
	handleBranches(isRated);
	handleAgencies(isRated);
	handleProducers(isRated);
	
	$('select.required').on('change blur',function () {
		var value = $(this).val();
		var errorMessageID;
		var elementId = $(this).attr('id');
		var errorRow;
		var strState = $('#policyInfoStateCd').val();
		if (strState == 'MA' && elementId == 'policyProducerInput') { 
			errorMessageID = '';
			showClearInLineErrorMsgsWithMap( elementId, errorMessageID, errorRow,-1, errorMessages, addDeleteCallback);
			return;
		}
		
		if (!$(this).hasClass('required')) {
			return;
		}
		
		if (elementId == 'primaryResidenceType' ) {
			errorRow = fieldIdToModelErrorRow['residenceType'];
		}else {
			errorRow = fieldIdToModelErrorRow['defaultSingle'];
		}
		if (value != '') {
			errorMessageID = '';
			showClearInLineErrorMsgsWithMap( elementId, errorMessageID, errorRow,-1, errorMessages, addDeleteCallback);
		} else {
			errorMessageID = $(this).attr('id')+'.browser.inLine.required';
			showClearInLineErrorMsgsWithMap( elementId, errorMessageID, errorRow,-1, errorMessages, addDeleteCallback);
		}
		
	});
	
	
	
	$('select.clsPolicyStateCd').change(function () {
		var strState = $(this).val();
		$('#policyInfoStateCd').val(strState); // set value to hidden state field
		$('#uqZip').val('');
	    //$("#expDt").text('');
		//$("#policyExpirationDate").val('');
		
		// clear out producer drop down and make it enabled
		emptySelect($('#policyProducerInput'));
		$('#policyProducerInput').prop('disabled',false).trigger('chosen:updated');
		
		if(isEmployee()){
			// clear out agency drop down and make it enabled
			emptySelect($('#agency_hier_id'));
			$('#agency_hier_id').prop('disabled',false).trigger('chosen:updated');
			// make call to get branches
			setBranches(strState); 
	   	}else{
	   		// make call to get agency profiles
	   		setAgencies("", "", strState,true); 
	   	}
	});
	
	$('#uqZip').on('change blur',function(){
		validateZip($('#uqZip').val());
	});
	
	onOffStateSpecificFields();
	
	
	// Branches
	$('select.clsBranch').change(function () {
	   	var corpId = $('.clsBranch option:selected').data('corp');
	   	
	   	// clear out producer drop down and make it enabled
	   	emptySelect($('#policyProducerInput'));
		$('#policyProducerInput').prop('disabled',false).trigger('chosen:updated');
		
		// populate channel hidden field with selected branch
		var channelCd = $('.clsBranch option:selected').data('support');
		$("#channelCd").val(channelCd);
		var state = $('#policyStateCd').val();
        // make call to get agencies
		setAgencies($(this).val(), corpId, state,false);
		var web;
		web = companyIdConvertToWebUmbrella(state,corpId)
		getUmbrellaDropDown(state,web);
	});
	

	// Agency/Agency Profile drop down
	$('select.clsAgency').change(function(){
		// populate producer drop down
		var corpId;
		var state = $('#policyStateCd').val();
	   	if(isEmployee()){
	   		corpId = $('.clsBranch option:selected').data('corp');
	   	}else{
	   		corpId = $('.clsAgency option:selected').data('corp');
	   		var web = companyIdConvertToWebUmbrella(state,corpId);
			getUmbrellaDropDown(state,web);
	   	}
	   	
	   	setProducers($(this).val(), corpId);
	 });
	
	// Agency/Agency Profile drop down
	$('select.clsProducer').change(function(){
		// populate producer hidden value
		$('#producer_hier_ids').val($('#policyProducerInput').val());
	 });
	

	$("#secondaryResidenceQty").change(function () {
		secResidenceTypeCheck();
		showClearInLineErrorMsgsWithMap( 'secondaryResidenceType', '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		showClearInLineErrorMsgsWithMap( 'secondaryPropertyTypeTwo', '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
	})
	
	$("#rentalPropertyQty").change(function () {
		rentResidenceTypeCheck();
		showClearInLineErrorMsgsWithMap( 'rentalResidenceType', '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		showClearInLineErrorMsgsWithMap( 'rentalPropertyTypeTwo', '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
	})
	
	$("#secondaryResidenceType").on('change blur',function () {	
		validateResidenceType('secondary','false');
	})
	
	$("#rentalResidenceType").on('change blur',function () {
		validateResidenceType('rental','false');
	})
	
	$('#secondaryPropertyTypeEdit').on('change blur',function () {
		validateResidenceType('secondary','false');
	})
	
	$('#rentalPropertyTypeEdit').on('change blur',function () {
		validateResidenceType('rental','false');
	})
	
	
	
	$(".clsPremium").change(function () {
		$("#hiddenlimit").val("");
		premiumCheck();
	})

	
	//creating another page will not identify the context path appropriately
	var ctxP = $('#ctxPath').val();
	var imgPath = window.location.protocol + "//" + window.location.host+ctxP;
	var dateLabel = "mm/dd/yyyy";
	
	$('#policyEffectiveDate').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		minDate : "0d",maxDate : "+1Y",dateFormat: 'mm/dd/yy',showButtonPanel : true,
		beforeShow: function() {
			callSecurityPolDate = false;
		},

		onClose: function() {
			callSecurityPolDate = true;
			var effDate = this;
			setTimeout(function () {
				if($(effDate).val() != dateLabel){
					$(effDate).removeClass("watermark");
				}
				callSecurityPolDate = true;
				policyEffectiveDateChanged(effDate, callSecurityPolDate);
			}, 100);
		}
	});
	
	//go to security system to validate effective date
	$('#policyEffectiveDate').bind({'change': function(){
		premiumCheck();
		updateUmbrellaLimitDropDown();
		var effDate = this;
		setTimeout(function () {
			if($(effDate).val() != dateLabel){
				$(effDate).removeClass("watermark");
			}
			callSecurityPolDate = true;
			policyEffectiveDateChanged(effDate, callSecurityPolDate);
		}, 100);
		
	}});
	
	 $(".rateBtn, #rateButtonQuote").bind("click", function(){
		 if (!isUmbrellaQuoteSubmitted()) {
		 	submitForm();
		 }
		});
	 $("#nextBtn").bind("click", function(event){
			navigateToFinish(event);
		});
	
	$('input[id="primary_insured_firstName"]').on('change blur', function(){
		validatePrimaryInsuredFirstName(this);
		var nameUpdate = $('#primary_insured_firstName').val();
		$("#applicant_first_name").text(nameUpdate);
	});

	$('input[id="primary_insured_lastName"]').on('change blur', function(){
		validatePrimaryInsuredLastName(this);
		var nameUpdate = $('#primary_insured_lastName').val();
		$("#applicant_last_name").text(nameUpdate);
	});
	
	$('input[id="secondary_insured_firstName"]').on('change blur', function(){
		validateSecondaryInsuredFirstName(this);
	});

	$('input[id="secondary_insured_lastName"]').on('change blur', function(){
		validateSecondaryInsuredLastName(this);});
	
	$(".clsInExpDrivers").bind({'keyup keypress': function(event) {
		validateNumeric(this,event);
		}});
	$(".clsInExpDrivers").on({'change blur': function() {
		var value = $(this).val();
		var errorMessageID;
		if (value != '') {
			errorMessageID = '';
			showClearInLineErrorMsgsWithMap( $(this).attr('id'), errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		} else {
			errorMessageID = $(this).attr('id')+'.browser.inLine.required';
			showClearInLineErrorMsgsWithMap( $(this).attr('id'), errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
		}});
	
	// watermark on global search input
	$('#inExpDriversOne').watermark('Less than 6 years driving exp.');
	$('#inExpDriversTwo').watermark('Less than 6 years driving exp.');
	$('#inExpDrivers').watermark('Drivers Under 25 Years Old');
	$('#primary_insured_firstName').watermark('First');
	$('#primary_insured_lastName').watermark('Last');
	$('#secondary_insured_firstName').watermark('First');
	$('#secondary_insured_lastName').watermark('Last');
	
	
	$('.clsFirstName,.clsLastName').bind({
		'keypress': function(event){validateFirstMiddleLastNames(this,event);
	},
	'paste':function(event){
		var element = this;
		setTimeout(function () {
			var enteredName = element.value;
			var formattedName = enteredName.replace(/[^A-Za-z\s'&-.]/g, "");
			$('#'+element.id).val(formattedName);
			validateFirstMiddleLastNames(this,event);
		}, 100);
		
	}}
	);
	
	secResidenceTypeCheck();
	rentResidenceTypeCheck();
	validatePolicyEffDateForFuture();
	updateUmbrellaLimitDropDown();
	setupTabs();
	
	$('#secondaryPropertyTypeEdit').click( function () {
		secondaryproptypedialog();
	})
	
	$('#rentalPropertyTypeEdit').click( function () {
		rentalproptypedialog();
	})
	
	
	
	 $(".secResidenceTypeBtn").bind("click", function(){
			updateSecResidenceType();
	});
	 
	 $(".rentalResidenceTypeBtn").bind("click", function(){
			updateRentalResidenceType();
	});
	
	 
	 $(".secondarycloseModal").click(function(){
		 $('#secondaryResidencePropertyTypeTable').empty();
		 $('#secondaryResidencePropertyTypeDialog').modal('hide');
		});
	 
	 $(".rentalcloseModal").click(function(){
		 $('#rentalResidencePropertyTypeTable').empty();
		 $('#rentalResidencePropertyTypeDialog').modal('hide');
		});
	 $(".clslulmwc").change(function () {
		updateLULWCClass($(this).val()); 
	 });
	 updateLULWCClass(0); 
	checkRateButtonDisplay();
	showRatingEditsUmbrella();		
	validateQuoteStatus();
	makeReadOnly();
	
});

function companyIdConvertToWebUmbrella(state,corpId) {
	var web;
	if(state == "MA"){
		web = "BK";
	}else{
		web = companyIdConvertToWeb(corpId);
	}
	return web;
}

function updateLULWCClass(value) {
	
	if (!$('#lulmwc').length) {
		return;
	}
	
	if (value > 0) {
		if (!$('#lulmwc').hasClass("required")) {
			$('#lulmwc').addClass("required");
			$('#lulmwc').addClass("preRequired");
			 $('#lulmwc').next().find('a').addClass("preRequired");
		}
		return;
	} else {
		$(".clslulmwc").each(function() { 
			if ($(this).val() > 0) {
				value = 1;
			}
		});
		if (value == 0) {
			$('#lulmwc').removeClass("required");
			$('#lulmwc').removeClass("preRequired");
			 $('#lulmwc').next().find('a').removeClass("preRequired");
			 clearInLineRowError('lulmwc', 'lulmwc', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		}
	}
	
}

function validateZip(zip) {
	
	var strURL = '/aiui/umbrella/validateZip';
	var stateCd = $('#policyInfoStateCd').val();
	var errorMessageID = '';
	var dataToPost = JSON.stringify({ "zip":zip,"stateCd":stateCd});
	
	if (zip == '') {
		errorMessageID = 'uqzip.browser.inLine.required';
		showClearInLineErrorMsgsWithMap('uqZip', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		return;
	}
	
	$.ajax({
	    headers: {
	        'Accept': 'text/plain',
	        'Content-Type': 'application/json'
	    },
	    url: strURL,
	    type: "post",
       // dataType: 'json',
        data : dataToPost,
	    
	    beforeSend:function(){
			//showLoadingMsg();
		},

	    // callback handler that will be called on success
	    success: function(response, textStatus, jqXHR){
    		if (response == 'Invalid') {
    			errorMessageID = 'uqzip.browser.inLine.invalid';
    			showClearInLineErrorMsgsWithMap('uqZip', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
    		}else if (stateCd == 'MA') {
    			showClearInLineErrorMsgsWithMap('uqZip', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
    			$('#city').val(response);
    		}else if (stateCd == 'NJ') {
    			showClearInLineErrorMsgsWithMap('uqZip', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
    			$('#county').val(response);
    		}else {
    			showClearInLineErrorMsgsWithMap('uqZip', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
    		}
		},
	    // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	 //alert('error accessing security database'+textStatus+":"+errorThrown);
	    }
	    ,
	    complete: function(){
	    	//onOffStateSpecificFields();
	    }
	});
}

function updateUmbrellaLimitDropDown(){

	var strState = $('select.clsPolicyStateCd').val();
	var company = $('#policyInfoCompanyCd').val();
	
	if ((company =='BK') && (strState =='MA')) {
		if ( $("#policyEffectiveDate").val() != "" && $("#umbrella_conversion_eff_date").val() != "" ) {
			var policyEffDt = Date.parse($("#policyEffectiveDate").val());
			var umbrellaConversionEffDate = Date.parse($("#umbrella_conversion_eff_date").val());
		
			var selectLimit = $("#policyLimit").val();
			var selectHiddenlimit = $("#hiddenlimit").val();
			
			if ((selectHiddenlimit == '3,000,000') || (selectHiddenlimit == '4,000,000') || (selectHiddenlimit == '5,000,000')) {
				selectLimit = selectHiddenlimit;
			}
			
			$("#policyLimit option[value='3,000,000']").remove();
			$("#policyLimit option[value='4,000,000']").remove();
			$("#policyLimit option[value='5,000,000']").remove();
			
			if(policyEffDt >= umbrellaConversionEffDate){
				 var policyLimitElem = $('#policyLimit');
				 policyLimitElem.append('<option value="3,000,000">3,000,000</option>');
				 policyLimitElem.append('<option value="4,000,000">4,000,000</option>');
				 policyLimitElem.append('<option value="5,000,000">5,000,000</option>');
				 policyLimitElem.trigger("chosen:updated");
				 if ((selectLimit != '3,000,000') || (selectLimit != '4,000,000') || (selectLimit != '5,000,000')) {
						$("#policyLimit").val(selectLimit);
				}
			}
			$('#policyLimit').trigger('chosen:updated');
		}
	}
}

function onOffStateSpecificFields() {
	var strState = $('select.clsPolicyStateCd').val();
	var company = $('#policyInfoCompanyCd').val();
	
	if (strState == 'MA') { 
		$('#policyProducerInput').removeClass("required");
		$('#policyProducerInput').removeClass("preRequired");
		 $('#policyProducerInput').next().find('a').removeClass("preRequired");
		 clearInLineRowError('policyProducerInput', 'policyProducerInput', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}else if (!$('#policyProducerInput').hasClass("required")) {
		$('#policyProducerInput').addClass("required");
		$('#policyProducerInput').addClass("preRequired");
		 $('#policyProducerInput').next().find('a').addClass("preRequired");
	}
	
	/*  water craft */
	if ( strState == 'NH' ) {
		$('#226to350HPQtyRow').show();
	}else {
		$('#226to350HPQtyRow').hide();
	}
	
	if (strState != 'NJ' ) {
		$('#sail26To35Row').show();
	}else {
		$('#sail26To35Row').hide();
	}
	
	if (strState != 'MA') {
		$('#lulWCRow').show();
		$('#101to150HPQtyRow').hide();
		$('#101to160HPQtyRow').show();
	}else {
		$('#lulWCRow').hide();
		$('#101to150HPQtyRow').show();
		$('#101to160HPQtyRow').hide();
	}
	
	/* Vehicle */
	if (strState == 'NH') {
		$('#umuimCoverageRow').show();
	} else {
		$('#umuimCoverageRow').hide();
		clearInLineRowError('umuimCoverage', 'umuimCoverage', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}  
	
	if (strState != 'MA') {
		$('#lulVehicleRow').show();
		$('#inExpDriversOneRow').hide();
		$('#inExpDriversTwoRow').hide();
		$('#inExpDriversRow').show();
		clearInLineRowError('inExpDriversOne', 'inExpDriversOne', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError('inExpDriversTwo', 'inExpDriversTwo', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	} else {
		$('#lulVehicleRow').hide();
		$('#inExpDriversOneRow').show();
		$('#inExpDriversTwoRow').show();
		$('#inExpDriversRow').hide();
		clearInLineRowError('inExpDrivers', 'inExpDrivers', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError('lowUnderLLVehicle', 'lowUnderLLVehicle', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	
	/* Property */
	if (strState != 'MA') {
		$('#lulPropRow').show();
	}else {
		$('#lulPropRow').hide();
		clearInLineRowError('lullProperty', 'lullProperty', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	}
	
	if (strState == 'NJ' && company == 'HP') {
		$('#primaryPWPCRow').show();
		$('#permittedBusPurRow').hide();
		$('#permittedIncOccRow').hide();
		$('#primaryResidenceInsurancePolicyCovg').hide();
		clearInLineRowError('permittedBusPur', 'permittedBusPur', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		clearInLineRowError('permittedIncOcc', 'permittedIncOcc', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
	} else {
		$('#primaryPWPCRow').hide();
		$('#permittedBusPurRow').show();
		$('#permittedIncOccRow').show();
		$('#primaryResidenceInsurancePolicyCovg').show();
		clearInLineRowError('primaryPWPC', 'primaryPWPC', fieldIdToModelErrorRow['defaultSingle'], '', -1, addDeleteCallback);
		
	}
	 
}

function getUmbrellaDropDown(state,companyCd) {
	var hiddenCompanyCd = $('#hiddenCompanyCd').val();
	
	if (hiddenCompanyCd == "" ||  companyCd != hiddenCompanyCd) {
		$('#hiddenCompanyCd').val(companyCd);
		var strURL = addRequestParam("/aiui/umbrella/getUmbrellaDropdowns", "policyStateCd", state);
		strURL = addRequestParam(strURL,"companyCd",companyCd); 
		
		$.ajax({
		    headers: {
		        'Accept': 'application/json',
		        'Content-Type': 'application/json'
		    },
		    url: strURL,
		    type: "GET",
		    
		    beforeSend:function(status, xhr){
				//showLoadingMsg(); already showing block UI when loading security dropdowns when user changs state. No need to duplicate - JG
			},

		    // callback handler that will be called on success
		    success: function(response, textStatus, jqXHR){
		    		loadDropDowns(response);
			},
		    // callback handler that will be called on error
		    error: function(jqXHR, textStatus, errorThrown){
		    	// alert('error accessing security database');
		    }
		    ,
		    complete: function(){
		    	onOffStateSpecificFields();
		    	//$.unblockUI(); already showing block UI when loading security dropdowns when user changs state. No need to duplicate - JG
		    }
		});
	}
	
}

function navigateToFinish(event) {
	umbrellaNextTab(document.umbrellaForm.currentTab.value, "umbrellafinish",event);
}

function loadDropDowns(dropdowns) {
	
	
	emptySelect($('#policyLimit'));
	emptySelect($('#lowUnderLLVehicle'));
	emptySelect($('#primaryResidenceType'));
	emptySelect($('#secondaryResidenceType'));
	emptySelect($('#rentalResidenceType'));
	emptySelect($('#lullProperty'));
	emptySelect($('#lulmwc'));
		
	var policyLimitElem = $('#policyLimit');
	$.each(dropdowns.UMBRELLA_LIMIT, function(i) {
		limitResponseObj = dropdowns.UMBRELLA_LIMIT[i];
		policyLimitElem.append('<option value="' + $.trim(limitResponseObj.dataValue)+'">' + $.trim(limitResponseObj.displayDescription) + '</option>');
	});
	policyLimitElem.trigger("chosen:updated");
	
	var primaryResidenceTypeElem = $('#primaryResidenceType');
	$.each(dropdowns.PRIMARY_RESIDENT_TYPE, function(i) {
		limitResponseObj = dropdowns.PRIMARY_RESIDENT_TYPE[i];
		primaryResidenceTypeElem.append('<option value="' + $.trim(limitResponseObj.dataValue)+'">' + $.trim(limitResponseObj.displayDescription) + '</option>');
	});
	primaryResidenceTypeElem.trigger("chosen:updated");
	
	
	var lowUnderLLVehicleElem = $('#lowUnderLLVehicle');
	$.each(dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_VEHICLE, function(i) {
		lulVehicleResponseObj = dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_VEHICLE[i];
		lowUnderLLVehicleElem.append('<option value="' + $.trim(lulVehicleResponseObj.dataValue)+'">' + $.trim(lulVehicleResponseObj.displayDescription) + '</option>');
	});
	lowUnderLLVehicleElem.trigger("chosen:updated");
	
	var secondaryResTypeElem = $('#secondaryResidenceType');
	var rentalResTypeElem = $('#rentalResidenceType');
	var resTypeArray = new Array();
	$.each(dropdowns.SECONDARY_RESIDENT_TYPE, function(i) {
		secResResponseObj = dropdowns.SECONDARY_RESIDENT_TYPE[i];
		secondaryResTypeElem.append('<option value="' + $.trim(secResResponseObj.dataValue)+'">' + $.trim(secResResponseObj.displayDescription) + '</option>');
		rentalResTypeElem.append('<option value="' + $.trim(secResResponseObj.dataValue)+'">' + $.trim(secResResponseObj.displayDescription) + '</option>');
		resTypeArray.push('::'+secResResponseObj.dataValue+':'+secResResponseObj.displayDescription);
	});
	secondaryResTypeElem.trigger("chosen:updated");
	rentalResTypeElem.trigger("chosen:updated");
	
	
	$('#rentResidenceType').val(resTypeArray);
	$('#secResidenceType').val(resTypeArray);
	
	
	
	var lowUnderLLPropElem = $('#lullProperty');
	$.each(dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_PROPERTY, function(i) {
		lulPropResponseObj = dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_PROPERTY[i];
		lowUnderLLPropElem.append('<option value="' + $.trim(lulPropResponseObj.dataValue)+'">' + $.trim(lulPropResponseObj.displayDescription) + '</option>');
	});
	lowUnderLLPropElem.trigger("chosen:updated");
	
	var lowUnderLLWCElem = $('#lulmwc');
	$.each(dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_WATERCRAFT, function(i) {
		lulWCResponseObj = dropdowns.LOWEST_UNDERLYING_LIABILITY_LIMIT_WATERCRAFT[i];
		lowUnderLLWCElem.append('<option value="' + $.trim(lulWCResponseObj.dataValue)+'">' + $.trim(lulWCResponseObj.displayDescription) + '</option>');
	});
	lowUnderLLWCElem.trigger("chosen:updated");
	
	
}

function validateQuoteStatus(){
	if (isUmbrellaQuoteSubmitted()) {
		$("#umbrellaForm :input:not([type=hidden])").prop("disabled", true);
		$('#umbrellaForm select').prop('disabled', true).trigger('chosen:updated');
		$('.clsPolEffDate').datepicker("disable");
		$("#rateButton").children().prop('disabled',true);
		if ($("#submitted").val() == 'true') {
			$( "#submitModal" ).modal('show');
			$(document).on("click", "#okClosePrompt", function(fnctCall){	
				$('#submitModal').modal('hide');
			});
		}
		
	}
}

/* Create Property type dialog with number of rows equal to quantity selected or equal to number of existing property types already selected by user*/
function secondaryproptypedialog() {
	var qty = $('#secondaryResidenceQty').val();
	var existQty = $('[id^="secondaryResidenceTypeVal_"]').length;
	var delCheckReqd = false;
	if ( existQty > qty) {
		delCheckReqd = true;
		qty = existQty;
	}
	var array=$('#secResidenceType').val();
		array=array.replace("[", "");
		array=array.replace("]", "");
	var finalArray =  array.split(",");
	
	var table = $('<table></table>').attr('id',"secondaryResidenceTypeTable");
	if (delCheckReqd) {
		var row = $('<tr></tr>');
	    var col1 = $('<td class=\"fieldLabel\"></td>');
	    var col2 = $('<td class=\"fieldCol\"></td>');
	    var col3 = $('<td></td>').text('Delete');
	    row.append(col1);
	    row.append(col2);
	    row.append(col3);
	    table.append(row);
	}
	for(i=0; i<qty; i++){
	    var row = $('<tr></tr>');
	    var col1 = $('<td class=\"fieldLabel\"></td>').text('Property Type ' + (i+1));
	    var col2 = $('<td class=\"fieldCol\"></td>');
	    var sel = $('<select></select>').attr('id',"secondaryResidenceType_"+i).attr('class',"propTypeDD");
	    sel.append($("<option></option>").attr('value',"").text("--Select--"));
	    var value = '';
    	if ($('#secondaryResidenceTypeVal_'+i).length) {
    		value = $('#secondaryResidenceTypeVal_'+i).val();
    	}
	    $(finalArray).each(function() {
	    	if (value == this.split(":")[2]) {
	    		sel.append($("<option></option>").attr('value',this.split(":")[2]).attr('selected',true).text(this.split(":")[3]));
	    	} else {
	    		sel.append($("<option></option>").attr('value',this.split(":")[2]).text(this.split(":")[3]));
	    	}
	     
	    });
	    
	    row.append(col1);
	    row.append(col2);
	    col2.append(sel);
	    
	    if (delCheckReqd) {
	    	var col3 = $('<td></td>');
	    	var input = $('<input>').attr('type','checkbox').attr('id','delSecondaryResidenceType_'+i);
	    	col3.append(input);
	    	row.append(col3);
	    }

	    addChosenForElement(sel);
	    if (isUmbrellaQuoteSubmitted()) {
	    	$(sel).prop('disabled', true).trigger("chosen:updated");
	    }
	    
	    table.append(row);
	}
	
	if (isUmbrellaQuoteSubmitted()) {
		$("#updateSecResidenceTypeBtn").prop('disabled',true);
	}
	
	$('#secondaryResidencePropertyTypeTable').append(table);
	$('#secondaryResidencePropertyTypeDialog').modal('show');
	
}
/* Create Property type dialog with number of rows equal to quantity selected or equal to number of existing property types already selected by user*/
function rentalproptypedialog() {
	var qty = $('#rentalPropertyQty').val();
	var existQty = $('[id^="rentalResidenceTypeVal_"]').length;
	var delCheckReqd = false;
	if ( existQty > qty) {
		delCheckReqd = true;
		qty = existQty;
	}
	
	var array=$('#rentResidenceType').val();
		array=array.replace("[", "");
		array=array.replace("]", "");
	var finalArray =  array.split(",");
	
	var table = $('<table></table>').attr('id',"rentalResidenceTypeTable");
	if (delCheckReqd) {
		var row = $('<tr></tr>');
	    var col1 = $('<td class=\"fieldLabel\"></td>');
	    var col2 = $('<td class=\"fieldCol\"></td>');
	    var col3 = $('<td></td>').text('Delete');
	    row.append(col1);
	    row.append(col2);
	    row.append(col3);
	    table.append(row);
	}
	for(i=0; i<qty; i++){
	    var row = $('<tr></tr>');
	    var col1 = $('<td class=\"fieldLabel\"></td>').text('Property Type ' + (i+1));
	    var col2 = $('<td class=\"fieldCol\"></td>');
	    var sel = $('<select></select>').attr('id',"rentalResidenceType_"+i).attr('class',"propTypeDD");
	    sel.append($("<option></option>").attr('value',"").text("--Select--"));
	    var value = '';
    	if ($('#rentalResidenceTypeVal_'+i).length) {
    		value = $('#rentalResidenceTypeVal_'+i).val();
    	}
	    $(finalArray).each(function() {
	    	if (value == this.split(":")[2]) {
	    		sel.append($("<option></option>").attr('value',this.split(":")[2]).attr('selected',true).text(this.split(":")[3]));
	    	} else {
	    		sel.append($("<option></option>").attr('value',this.split(":")[2]).text(this.split(":")[3]));
	    	}
	     
	    });
	    
	    row.append(col1);
	    row.append(col2);
	    col2.append(sel);
	    if (delCheckReqd) {
	    	var col3 = $('<td></td>');
	    	var input = $('<input>').attr('type','checkbox').attr('id','delRentalResidenceType_'+i);
	    	col3.append(input);
	    	row.append(col3);
	    }
	    addChosenForElement(sel);
	    if (isUmbrellaQuoteSubmitted()) {
	    	$(sel).prop('disabled', true).trigger("chosen:updated");
	    }
	    table.append(row);
	}
	
	if (isUmbrellaQuoteSubmitted()) {
		$("#updateRentalResidenceTypeBtn").prop('disabled',true);
	}
	
	
	
	 $('#rentalResidencePropertyTypeTable').append(table);
	 $('#rentalResidencePropertyTypeDialog').modal('show');
}
/* Updates selected property types from dialog window to hidden elements(Hidden elements will be created/modified only for valid property types. hidden 
elements will be removed for deleted property types and property types which dont have value */
function updateRentalResidenceType() {
	var qty = $('#rentalPropertyQty').val();
	var existQty = $('[id^="rentalResidenceTypeVal_"]').length;
	var delCheckReqd = false;
	var j=0,k;
	var error = false;
	if ( existQty > qty) {
		delCheckReqd = true;
		qty = existQty;
		k=existQty-1;
	} else {
		k = qty - 1;
	}
	for(i=0; i<qty; i++){
		var value = $( "#rentalResidenceType_"+i ).val();
		var delCheckBox = $( "#delRentalResidenceType_"+i ).prop('checked');
		if (delCheckReqd) {
			if(delCheckBox) {
				$('#rentalResidenceTypeVal_'+k).remove();
				k = k-1;
			}else {
				$('#rentalResidenceTypeVal_'+j).val(value);
				j = j+1;
			}
		}else {
			if(value != 'undefined') {
				if (value =="") {
					error = true;
					if ($('#rentalResidenceTypeVal_'+k).length) {
						$('#rentalResidenceTypeVal_'+k).remove();
						k = k-1;
					}
				} else {
					if ($('#rentalResidenceTypeVal_'+j).length) {
						$('#rentalResidenceTypeVal_'+j).val(value);
					}else {
						var input = $('<input>').attr('type','hidden').attr('id','rentalResidenceTypeVal_'+j)
						.attr('name','umbrellaPolicy.property.rentalResidenceTypes['+j+'].propertyValue')
						.attr('value',value);
						$('#umbrellaForm').append(input);
					}
					j++;
				}
			}
		}
		
	}
	showPropertyTypeTwo('rental');
	validateResidenceType('rental',error);
	applyResidenceTypeStyle(qty,'rental');
	$('#rentalResidencePropertyTypeTable').empty();
	$('#rentalResidencePropertyTypeDialog').modal('hide');
	premiumCheck();
}
/* Updates selected property types from dialog window to hidden elements(Hidden elements will be created/modified only for valid property types. hidden 
   elements will be removed for deleted property types and property types which dont have value */
function updateSecResidenceType() {
	var qty = $('#secondaryResidenceQty').val();
	var existQty = $('[id^="secondaryResidenceTypeVal_"]').length;
	var delCheckReqd = false;
	var j=0,k;
	var error = false;
	if ( existQty > qty) {
		delCheckReqd = true;
		qty = existQty;
		j=0;
		k=existQty-1;
	} else {
		k=qty-1;
	}
	for(i=0; i<qty; i++){
		var value = $( "#secondaryResidenceType_"+i ).val();
		var delCheckBox = $( "#delSecondaryResidenceType_"+i ).prop('checked');
		if (delCheckReqd) {
			if(delCheckBox) {
				$('#secondaryResidenceTypeVal_'+k).remove();
				k = k-1;
			}else {
				$('#secondaryResidenceTypeVal_'+j).val(value);
				j = j+1;
			}
		}else {
			if(value != 'undefined') {
				if (value =="") {
					error = true;
					if ($('#secondaryResidenceTypeVal_'+k).length) {
						$('#secondaryResidenceTypeVal_'+k).remove();
						k = k-1;
					}
				} else {
					if ($('#secondaryResidenceTypeVal_'+j).length) {
						$('#secondaryResidenceTypeVal_'+j).val(value);
					}else {
						var input = $('<input>').attr('type','hidden').attr('id','secondaryResidenceTypeVal_'+j)
						.attr('name','umbrellaPolicy.property.secondaryResidenceTypes['+j+'].propertyValue')
						.attr('value',value);
						$('#umbrellaForm').append(input);
					}
					j++;
				}
			} 
		}
	}
	showPropertyTypeTwo('secondary');
	validateResidenceType('secondary',error);
	applyResidenceTypeStyle(qty,'secondary');
	
	$('#secondaryResidencePropertyTypeTable').empty();
	$('#secondaryResidencePropertyTypeDialog').modal('hide');
	premiumCheck();
}
/* Validates both secondary and rental residence types */
function validateResidenceType(type,error) {
	var a,b;
	var errorMessageID;
	var elementIdOne,elementIdTwo;
	var value;
	if (type == 'secondary') {
		a = "secondaryResidenceQty";
		b = "secondaryResidenceTypeVal_";
		elementIdOne = "secondaryPropertyTypeTwo";
		elementIdTwo = "secondaryResidenceType";
		value = $("#secondaryResidenceType").val();
	} else {
		a = "rentalPropertyQty";
		b = "rentalResidenceTypeVal_";
		elementIdOne = "rentalPropertyTypeTwo";
		elementIdTwo = "rentalResidenceType";
		value = $("#rentalResidenceType").val();
	}
	 
	var qty = $('#'+a).val();
	var existQty = $('[id^='+b+']').length; /* Hidden elements which actually holds selected property types */
	if (qty > 1) {
		showClearInLineErrorMsgsWithMap( elementIdTwo, '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		if (qty > existQty || error == true) {
			errorMessageID = "residencetype.browser.inLine.lessselection";
		}else if (qty < existQty) {
			errorMessageID = "residencetype.browser.inLine.moreselection";
		}else {
			errorMessageID = '';
		}
		showClearInLineErrorMsgsWithMap( elementIdOne, errorMessageID, fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
	} else if (qty == 1) {
		showClearInLineErrorMsgsWithMap( elementIdOne, '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		if ( value == '') {
			errorMessageID = "residencetype.browser.inLine.required";
			showClearInLineErrorMsgsWithMap( elementIdTwo, errorMessageID, fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		}else {
			errorMessageID = '';
			showClearInLineErrorMsgsWithMap( elementIdTwo, errorMessageID, fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		}
	} else if (qty == 0) { 
		showClearInLineErrorMsgsWithMap( elementIdOne, '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		if (value != '') {
			errorMessageID = 'residencetype.browser.inLine.typenotrequired';
		} else {
			errorMessageID = '';
		}
		showClearInLineErrorMsgsWithMap( elementIdTwo, errorMessageID, fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
	} else {
		showClearInLineErrorMsgsWithMap( elementIdTwo, '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
		showClearInLineErrorMsgsWithMap( elementIdOne, '', fieldIdToModelErrorRow['residenceType'],-1, errorMessages, addDeleteCallback);
	}
	
	
}
/* Based on selected dropdown value in secondary Residence Type quantity display secondary Residence Type */
function secResidenceTypeCheck() {
	var secondaryQty = $('#secondaryResidenceQty').val();
	 if (secondaryQty > 1) {
		 showPropertyTypeTwo('secondary');
		 $("#secondaryPropertyTypeOne").hide();
		 $("#secondaryResidenceType").val("");
		 $("#secondaryResidenceType").prop("disabled",true);
		 if ($("#secondaryResidenceTypeVal_0").length) {
			 $("#secondaryResidenceTypeVal_0").prop("disabled",false);
		 }
	 } else {
		 $("#secondaryPropertyTypeTwo").hide();
		 $("#secondaryPropertyTypeOne").show();
		 $("#secondaryResidenceType").prop("disabled",false);
		 $("#secondaryResidenceType").trigger("chosen:updated");
		 removeResidenceTypeHiddenVal('secondary');
		 if ($("#secondaryResidenceTypeVal_0").length) {
			 $("#secondaryResidenceTypeVal_0").prop("disabled",true);
		 }
	 }
	 
	 applyResidenceTypeStyle(secondaryQty,"secondary");
}
/* Based on selected dropdown value in Rental Residence Type quantity display Rental Residence Type */
function rentResidenceTypeCheck() {
	 var rentalQty = $('#rentalPropertyQty').val();
	 if (rentalQty > 1) {
		 showPropertyTypeTwo('rental');
		 $("#rentalPropertyTypeOne").hide();
		 $("#rentalResidenceType").val("");
		 $("#rentalResidenceType").prop("disabled",true);
		 if ($('#rentalResidenceTypeVal_0').length) {
			 $("#rentalResidenceTypeVal_0").prop("disabled",false);
		 }
	 } else {
		 $("#rentalPropertyTypeTwo").hide();
		 $("#rentalPropertyTypeOne").show();
		 $("#rentalResidenceType").prop("disabled",false);
		 $("#rentalResidenceType").trigger("chosen:updated");
		 removeResidenceTypeHiddenVal('rental');
		 if ($('#rentalResidenceTypeVal_0').length) {
			 $("#rentalResidenceTypeVal_0").prop("disabled",true);
		 }
	 }
	 applyResidenceTypeStyle(rentalQty,"rental");
}

function applyResidenceTypeStyle(qty,type) {
	
	var typeOne = type + "ResidenceType";
	var typeTwo = type + "PropertyTypeTwo";
	var typeId = type + "ResidenceTypeVal_";
	var existQty = $('[id^='+typeId+']').length;
	
	if (qty == 1) {
		if (!$('#'+typeOne).hasClass("required") && $('#'+typeOne).val() == "") {
			$('#'+typeOne).addClass("required");
			$('#'+typeOne).addClass("preRequired");
			 $('#'+typeOne).next().find('a').addClass("preRequired");
		}
	} else if (qty > 1) {
		if (!$('#'+typeTwo).hasClass("required") && existQty == 0) {
			$('#'+typeTwo).addClass("required");
			$('#'+typeTwo).addClass("preRequired");
		} else if ($('#'+typeTwo).hasClass("required") && existQty > 0 ) {
			$('#'+typeTwo).removeClass("required");
			$('#'+typeTwo).removeClass("preRequired");
		}
		if ($('#'+typeOne).hasClass("required")) {
			$('#'+typeOne).removeClass("required");
			$('#'+typeOne).removeClass("preRequired");
			 $('#'+typeOne).next().find('a').removeClass("preRequired");
		}
	} else {
		if ($('#'+typeOne).hasClass("required")) {
			$('#'+typeOne).removeClass("required");
			$('#'+typeOne).removeClass("preRequired");
			 $('#'+typeOne).next().find('a').removeClass("preRequired");
		}
	}
	
}

function  removeResidenceTypeHiddenVal(residence) {
	var elementId = residence + "ResidenceTypeVal_";
	var existQty = $('[id^='+elementId+']').length;
	for(i=0; i<existQty; i++){ 
		$("#"+elementId+i).remove();
	}
}

function showPropertyTypeTwo(residence) {
	var divId = residence + "PropertyTypeTwo";
	var hiddenId = residence + 'ResidenceTypeVal_';
	var spanId = residence+'ResidenceTypeCountDesc';
	var value = "0 Selected";
	var hiddenValue;
	var morevalues = false;
	var qty = $('[id^='+hiddenId+']').length;
	if (qty > 0) {
		for (i=0; i< qty; i++) {
			hiddenValue = $('#'+hiddenId+i).val(); 
			if (hiddenValue != "") {
				if (value == "0 Selected") {
					value = hiddenValue+" Family";
				} else if (value.length < 38) {
					value = value+", "+hiddenValue+" Family";
				} else {
					morevalues = true;
					break;
				}
			}
		}
		if (morevalues) {
			$("."+spanId).text(value + '...' );
		} else {
			$("."+spanId).text(value);
		}
	} else {
		$("."+spanId).text('0 Selected');
	}

	$("#"+divId).show();
}


function validateNumeric(field,event) {
	var regex = new RegExp(/[^0-9]/g);
    var containsNonNumeric = field.value.match(regex);
    if (containsNonNumeric)
    	field.value = field.value.replace(regex, '');
}

function validateFirstMiddleLastNames(firstMiddleLastName,e)
{
	var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 8) return true;
    var keynum;
    var keychar;
    
   // var charcheck = /[a-zA-Z-'&. ]/;
   var charcheck = /[a-zA-Z-'& ]/;
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
    else{
    		e.preventDefault();
    		//return false;
    	}
    //8- backspace
	//37 - left arrow
	//39 right arrow
	//38 - up arrow
	//40 down arrow
	//46-delete
	//tab-9
	//27-escape
	//13 enter
	//65 -a 90-z
	//36 home
	//35 end
	//32 - SPACE
	//222 - ' AND "
	//189 _ AND -
	//55 &
}


function validatePolicyEffDateForFuture() {
	
	var policyEffDate = $("#policyEffectiveDate").val();
	var dateArray = policyEffDate.split("/");var year = dateArray[2];var month = dateArray[0];var day = dateArray[1];
	
	//var now = new Date();
	var effDate = new Date(policyEffDate);
	
	//if( now> effDate){
	if(!isUmbrellaQuoteSubmitted() && getDateDiffInDays(effDate) >= 1){
		$("#expDt").text('');
		$("#policyExpirationDate").val('');
		errorMessages['policyEffectiveDate.browser.inLine.Security']='The effective date on quotes cannot be earlier than todays date. Please contact your Underwriting Team if you have questions or require additional information.';
		var effDateId = $("#policyEffectiveDate").attr("id");
		var errorMessageID = 'policyEffectiveDate.browser.inLine.Security';
		showClearInLineErrorMsgsWithMap(effDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
	else{
		calculatePolicyExpiryDate();
	}
}

function policyEffectiveDateChanged(effDate, callSecurityPolDate){
	var sValue = effDate.value;
	if(sValue != "" && callSecurityPolDate){
		var op = validatePolicyEffectiveDate(effDate);
		if(op)
		{
			var effectiveDate = $("#policyEffectiveDate").val();
			//call security service to obtain details
			//getPolicyEffDateFromSecurity(effectiveDate);
			validatePolicyEffDateForFuture();
			$("#effective_date").text(effectiveDate);
		}
		else{
			$("#policyExpirationDate").val("");
			$("#expDt").text("");
			$("#effective_date").text("");
		}
	}else{
		// did not enter a policy effective date -fire edit and clear exp date fields if needed
		validatePolicyEffectiveDate(effDate);
		$("#policyExpirationDate").val("");
		$("#expDt").text("");
		$("#effective_date").text("");
	}
}


//expiry date calculation remove for now - relook at the logic must be a better way !!
function calculatePolicyExpiryDate(){
			var policyEffDate = $("#policyEffectiveDate").val();
			var pol_key = $("#policyKey").val();
			var dateArray = policyEffDate.split("/");var year = dateArray[2];var month = dateArray[0];var day = dateArray[1];
			var policyTerm = '';
			if(pol_key == null || pol_key == ''){policyTerm = $("#policyTerm").val();}
			else{ policyTerm = $("#policyTerm").val();}
			
			if(policyTerm == "12")
			{
				 var xDate = new XDate(year,month,day);
				 xDate.addMonths(11,true);
				 if(day == "31")
					{
						if(xDate.getDate()=="1"){
							xDate.addDays(-1);
							}
						if(xDate.getDate()=="2")
						{
							xDate.addDays(-2);
						}
						if(xDate.getDate()=="3")
						{
							xDate.addDays(-3);
						}
					}
					if(day == "30"){
						if(xDate.getDate() == "1" && xDate.getMonth() == "1"){ xDate.addDays(-2); }
				}
				
				 	var dt = xDate.toString('MM/dd/yyyy');
					$("#expDt").text(dt);
					$("#policyExpirationDate").val(dt);
			}

}

function validatePolicyEffectiveDate(policyEffectiveDate){
	var op = validatePolicyEffDate('',policyEffectiveDate,'Yes', 'policyEffectiveDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle']);
	return op;
}

function validatePolicyEffDate(name, elementId,strRequired, strErrorTag, strErrorRow) {
	var errorMessageID = isValidPolicyEffDate(elementId, strRequired);
	if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
		if(errorMessageID==''){ 
			return true;
		} else {
			return false;
		}
}


function isValidPolicyEffDate(elementId, strRequired){
	var strVal = $(elementId).val();
	var msg = '';
	if (strRequired == 'Yes'){
		if ((strVal == null) || (strVal == "") || (strVal == dateLabel)){
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

function checkEffectivePolicyDateValidity(elementId){
	var strEffDate = $(elementId).val();
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;
	if (!validformat.test(strEffDate))
	{
		return 'required';
	}
	else
	{
		return '';
	}
}

function premiumCheck() {
	var isRated =  $('#ratedInd').val();
	var premAmt = $("#premAmt").val();
	
	if (isRated == 'Yes' && premAmt != "") {
		$('#premamt_no_change').hide();
		$('#premamt_change').show();
		$('#priorRatedPremAmt').val(premAmt);
		$('#premAmt').val("");
		$('#wasPremiumChanged').val("Yes");
		$("#pliga").hide();
		$("#rateButtonQuote").show();
		$("#nextButton").hide();
	}
}


function validatePrimaryInsuredFirstName(primary_insured_firstName){
	validateClientFirstLastNames('app_first_name',primary_insured_firstName, 'Yes', 'primary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '')
}

function validateSecondaryInsuredFirstName(secondary_insured_firstName){
	var coaFName = $(secondary_insured_firstName).val();
	var secondary_insured_lastName = $('#secondary_insured_lastName');
	var coaLName = $(secondary_insured_lastName).val();
	
	if (coaLName != '' ) {
		validateClientFirstLastNames('app_first_name',secondary_insured_firstName,'Yes', 'secondary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	} else if (coaFName == '') {
		clearInLineRowError('secondary_insured_lastName', 'secondary_insured_lastName', fieldIdToModelErrorRow['applicants'], '', 'app', addDeleteCallback);
	} /*else if (coaFName != '') {
		validateClientFirstLastNames('app_last_name',secondary_insured_lastName[0],'Yes', 'secondary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	}*/
	
}

function validatePrimaryInsuredLastName(primary_insured_lastName){
	validateClientFirstLastNames('app_last_name',primary_insured_lastName, 'Yes', 'primary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validateSecondaryInsuredLastName(secondary_insured_lastName){
	var coaLName = $(secondary_insured_lastName).val();
	var secondary_insured_firstName = $('#secondary_insured_firstName');
	var coaFName = $(secondary_insured_firstName).val();
	
	if (coaFName != '' ) {
		validateClientFirstLastNames('app_first_name',secondary_insured_lastName,'Yes', 'secondary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	} else if (coaLName == '') {
		clearInLineRowError('secondary_insured_firstName', 'secondary_insured_firstName', fieldIdToModelErrorRow['applicants'], '', 'app', addDeleteCallback);
	} else if (coaLName != '') {
		validateClientFirstLastNames('app_first_name',secondary_insured_firstName[0],'Yes', 'secondary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	}
}

function validateClientFirstLastNames(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
	if(name !=null && name!='' && name.indexOf('app')!=-1){
		var errorMessageID = isValidClientFirstLastName($(elementId).val(), strRequired);
		if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else{
			errorMessageID = '';
		}
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,'app', errorMessages, addDeleteCallback);
	}

}

function isValidClientFirstLastName(strVal, strRequired){
	if (strRequired == 'Yes')
	{
		if ((strVal == null) || (strVal == ""))
		{
			return 'required';
		}
		else if (strVal.length > 1)
		{
			var regex = /^[A-Za-z-'&. ]+$/i;
			if(regex.test(strVal))
			{
				return '';
			}
			else
			{
				//what other can be message here -- will show See Page Alert
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

function getPolEffDate(sDate){
	if(sDate == dateLabel){
		sDate = "";
	}
	return sDate;
}

var dateLabel = "mm/dd/yyyy";

function getErrorColumnId(strElementID){
	var strErrorColId = '';
	if(strElementID.indexOf('primary_insured_firstName') == 0) {
		strErrorColId = 'app_primary_fn_Error_Col';
	}
	if(strElementID.indexOf('primary_insured_lastName') == 0) {
		strErrorColId = 'app_primary_ln_Error_Col';
	}
	
	if(strElementID.indexOf('secondary_insured_firstName') == 0) {
		strErrorColId = 'app_secondary_fn_Error_Col';
	}
	if(strElementID.indexOf('secondary_insured_lastName') == 0) {
		strErrorColId = 'app_secondary_ln_Error_Col';
	}
	
	return strErrorColId;
}

function parseErrorRow(strRowName,strErrorColId)
{
	if(strErrorColId == 'app_primary_fn_Error_Col'){
		var txtVal = $('#app_primary_ln_Error_Col').text();
		if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
		}
	}

	if(strErrorColId == 'app_secondary_fn_Error_Col'){
		var txtVal = $('#app_secondary_ln_Error_Col').text();
		if(txtVal !=null && $.trim(txtVal) != ''){
		return false;
		}
	}

	if(strErrorColId == 'app_secondary_ln_Error_Col'){
		var txtVal = $('#app_secondary_fn_Error_Col').text();
		if(txtVal !=null && $.trim(txtVal) != ''){
			return false;
		}
	}

	if(strErrorColId == 'app_primary_ln_Error_Col'){
		var txtVal = $('#app_primary_fn_Error_Col').text();
		if(txtVal !=null && $.trim(txtVal) != ''){
		return false;
		}
	}


	return true;
}

function getErrorRowId(strElementID){
	var strErrorRowId = '';
	if(strElementID.indexOf('primary_insured_firstName') == 0 || strElementID.indexOf('primary_insured_lastName') == 0) {
		strErrorRowId = 'app_primary';
	}
	if(strElementID.indexOf('secondary_insured_firstName') == 0 || strElementID.indexOf('secondary_insured_lastName') == 0) {
		strErrorRowId = 'app_secondary';
	}
	if(strElementID.indexOf('primary_insured_birth_date') == 0 || strElementID.indexOf('secondary_insured_birth_date') == 0) {
		strErrorRowId = 'app_birth_date';
	}
	if(strElementID.indexOf('primary_insured_maritalStatusCd') == 0 || strElementID.indexOf('secondary_insured_maritalStatusCd') == 0) {
		strErrorRowId = 'app_marital_status';
	}
	if(strElementID.indexOf('primary_insured_mask_ssn_PRIMARY') == 0 || strElementID.indexOf('secondary_insured_mask_ssn_SECONDARY') == 0) {
		strErrorRowId = 'app_mask_ssn';
	}
	if(strElementID.indexOf('primary_insured_licenseState') == 0 || strElementID.indexOf('secondary_insured_licenseState') == 0) {
		strErrorRowId = 'app_license_state';
	}
	if(strElementID.indexOf('primary_insured_licenseNumber') == 0 || strElementID.indexOf('secondary_insured_licenseNumber') == 0) {
		strErrorRowId = 'app_license_number';
	}
	return strErrorRowId;
}

function processAppRows(strErrorRow,strElementID,strRowName)
{
	strErrorRow = strErrorRow.replace(/Error_Col_FirstName/g, strRowName+'_fn' + '_Error_Col');
	strErrorRow = strErrorRow.replace(/Error_Col_LastName/g, strRowName+'_ln' + '_Error_Col');
	return strErrorRow;
}

var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>",
		"applicants":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col_FirstName\"></td><td class=\"fieldColError\" id=\"Error_Col_LastName\"></td><td></td></tr>",
		"residenceType":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td></tr>"
};

function isEmptyStr(strValue){
	if(strValue == null || strValue == undefined || strValue.length<1){
		return true;
	}
	else return false;
}

var addDeleteCallback = function(row, addIt) {
	//alert('what i waana do with call back?');
}

/** Security logic - JGarrison **/
function handlePolicyState(isRated){
	if(isRated == "Yes"){
		// will disable on rating and enable when moving off page
		$('#policyStateCd').prop('disabled', true).trigger("chosen:updated");
	}else{
		if($('div > #policyNumber').val()!=''){
				$('#policyStateCd').prop('disabled', true).trigger("chosen:updated");
		}else{
			var oneStateAuthority = $('#oneStateAuthority').val();
			var hiddenPolicyState = $('#policyInfoStateCd').val();
			if(isValidValue(oneStateAuthority) && oneStateAuthority.toUpperCase() == 'YES' && isValidValue(hiddenPolicyState)){
				var policyState = $('#policyStateCd').val();
				if(isValidValue(policyState) && policyState.toUpperCase() == hiddenPolicyState.toUpperCase()){
					$('#policyStateCd').prop('disabled', true).trigger("chosen:updated");
				}
			}
		}
	}
}

function handleBranches(isRated){
	if(isRated == "Yes" || $('div > #policyNumber').val()!=''){
		// will disable on rating and enable when moving off page
		$('select.clsBranch').prop('disabled', true).trigger("chosen:updated");
	}else if(isEmployee() && $('select.clsBranch').find('option').length == 2){
		$('select.clsBranch').prop("selectedIndex",1).prop('disabled',true).trigger("chosen:updated");
	}else{
		$('select.clsBranch').prop('disabled',false).trigger("chosen:updated");
	}
}

function handleAgencies(isRated){
	if(isRated == "Yes" || $('div > #policyNumber').val()!=''){
		// will disable on rating and enable when moving off page
		$('select.clsAgency').prop('disabled', true).trigger("chosen:updated");
	}else if($('select.clsAgency').find('option').length == 2){
		$('select.clsAgency').prop("selectedIndex",1).prop('disabled',true).trigger("chosen:updated");
	}else{
		$('select.clsAgency').prop('disabled',false).trigger("chosen:updated");
	}
}

function handleProducers(isRated){
	var stateCd = $('#policyStateCd').val();
	if(isRated == "Yes" || $('div > #policyNumber').val()!=''){
		// will disable on rating and enable when moving off page
		$('#policyProducerInput').prop('disabled', true).trigger("chosen:updated");
	}else if($('#policyProducerInput').find('option').length == 2 && stateCd != "MA"){
		$('#policyProducerInput').prop("selectedIndex",1);
		$('#producer_hier_ids').val($('#policyProducerInput').val());
		$('#policyProducerInput').prop('disabled',true).trigger("chosen:updated");
	}else{
		$('#policyProducerInput').prop('disabled',false).trigger("chosen:updated");
	}
}

/* Ajax calls to get Branch, Agency Profile, Agency and Producer */
function setBranches(state){
	var strURL = addRequestParam("/aiui/umbrella/getBranches", "policyStateCd", state);
	var branchRespObj;
	var branchCount, branchHierId, companyId;
	
	emptySelect($('#branch_hier_id'));
	
	$.ajax({
	    headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
	    url: strURL,
	    type: "GET",
	    
	    beforeSend:function(status, xhr){
			showLoadingMsg();
		},

	    // callback handler that will be called on success
	    success: function(response, textStatus, jqXHR){
	    	var branchElem = $('#branch_hier_id');
	    	branchCount = response.length;
	    	if(response.length > 0){
				$.each(response, function(i) {
					branchRespObj = response[i];
					branchHierId = $.trim(branchRespObj.branchId);
					companyId = $.trim(branchRespObj.companyCorporationId);
					branchElem.append('<option value="' + branchHierId +'" data-support="'+ $.trim(branchRespObj.channelCode) + '" data-corp="'+companyId+'">' + $.trim(branchRespObj.name) + '</option>');
				});
	    	}
	    	branchElem.trigger("chosen:updated");
	    },
	    
	    // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	// alert('error accessing security database');
	    }
	    ,
	    complete: function(){
	    	handleBranches();
	    	$.unblockUI();
	    	web = companyIdConvertToWebUmbrella(state,companyId);
	    	$('#policyInfoCompanyCd').val(web);
	    	getUmbrellaDropDown(state,web);
	    	// call setAgencies if branches returned is 1
	    	if(branchCount == 1){
	    		setAgencies(branchHierId, companyId, state,false);
	    	}
	    }
	});
}

function setAgencies(branchHierId, companyId, stateCd, getudropdown){
	var agencyRespObj, strURL, agencyCount, agencyHierId;
	var policyEffDt = $('#policyEffectiveDate').val();
	var web = companyIdConvertToWebUmbrella(stateCd,companyId);
	
	if(isEmployee()){
		if(web == "BK"){
			strURL = addRequestParam("/aiui/umbrella/getAgencies", "companyCd", web);
			strURL = addRequestParam(strURL, "branchHierId", branchHierId);
		}else{
			strURL = addRequestParam("/aiui/umbrella/getProducers", "companyCd", web);
			strURL = addRequestParam(strURL, "stateCd", stateCd);
			strURL = addRequestParam(strURL, "agencyHierId", branchHierId);
			strURL = addRequestParam(strURL, "policyEffDate", policyEffDt);
			strURL = addRequestParam(strURL, "chkDuplicateAgencies", true);
		}
	}else{
		strURL = addRequestParam("/aiui/umbrella/getAgencyProfiles", "stateCd", stateCd);
	}
	
	emptySelect($('#agency_hier_id'));
	
	if(typeof requestAgencies != "undefined" && requestAgencies.readyState !== 4){
		//Previous request needs to be aborted as user has changed criteria to do new lookup
		requestAgencies.abort();
    }

	requestAgencies = getAgencies(strURL, stateCd, web, companyId, agencyHierId, agencyCount, agencyRespObj, getudropdown);
}

var getAgencies = function(strURL, stateCd, web, companyId, agencyHierId, agencyCount, agencyRespObj, getudropdown){
	var request = $.ajax({
    	headers: {
 	        'Accept': 'application/json',
 	        'Content-Type': 'application/json'
 	    },
    	url: strURL,
		type: 'get',
		cache: false, 
		
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(response, textStatus, jqXHR){
			var agencyElem = $('#agency_hier_id');
	    	agencyCount = response.length;
	    	if(agencyCount > 0){
				$.each(response, function(i) {
					agencyRespObj = response[i];
					if(isEmployee()){
						if(web == "BK"){
							agencyElem.append('<option value="' + $.trim(agencyRespObj.agencyHierarchyId)+'">' + $.trim(agencyRespObj.name) + '</option>');
						}else{
							agencyElem.append('<option value="' + $.trim(agencyRespObj.agencyId)+'">' + $.trim(agencyRespObj.agencyWebDisplayName) +" - "+ agencyRespObj.agencyLevelCode + '</option>');
						}
					}else{
						if($.trim(agencyRespObj.agencyHierarchyId) == $.trim(agencyRespObj.agencyId)){
							// L2 Agency Profile
							agencyHierId = $.trim(agencyRespObj.agencyId);
							companyId = $.trim(agencyRespObj.companyId);
							web = $.trim(agencyRespObj.companyCode);
							agencyElem.append('<option value="' + agencyHierId + '"data-corp="'+companyId+'">' + agencyRespObj.agencyName +" - "+ agencyRespObj.agencyLevelCode + '</option>');
						}else{
							// L3 Agency Profile
							agencyHierId = $.trim(agencyRespObj.producerId);
							companyId = $.trim(agencyRespObj.companyId);
							web = $.trim(agencyRespObj.companyCode);
							agencyElem.append('<option value="' + agencyHierId + '"data-corp="'+companyId+'">' + agencyRespObj.producerName +" - "+ agencyRespObj.producerLevelCode + '</option>');
						}
						
						
					}
				});
	    	}
		
		},

		 // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	// alert('error accessing security database');
	    }
	    ,
		
		complete: function(){
			handleAgencies();
			$.unblockUI();
	    	$('#policyInfoCompanyCd').val(web);
	    	if (getudropdown) {
	    		getUmbrellaDropDown(stateCd,web);
	    	}
	    	// call setProducers if agencies returned is 1
	    	if(agencyCount == 1){
	    		setProducers(agencyHierId, companyId);
	    	}
		}
	});	
    
    return request;
};

function setProducers(agencyHierId, companyCorpId){
	var producerRespObj, strURL;
	var stateCd = $('#policyStateCd').val();
	var blnLevel2ProfileSelected = false;
	var policyEffDt = $('#policyEffectiveDate').val();
	var web = companyIdConvertToWebUmbrella(stateCd,companyCorpId);
	
	emptySelect($('#policyProducerInput'));
	$('#policyInfoCompanyCd').val(web);
	
	if(isEmployee()){
		strURL = addRequestParam("/aiui/umbrella/getProducers", "companyCd", web);
		strURL = addRequestParam(strURL, "chkDuplicateAgencies", false);
	}else{
		strURL = addRequestParam("/aiui/umbrella/getProducerForAgencyProfile", "companyCd", web);
	}
	
	strURL = addRequestParam(strURL, "stateCd", stateCd);
	strURL = addRequestParam(strURL, "agencyHierId", agencyHierId);
	strURL = addRequestParam(strURL, "policyEffDate", policyEffDt);
	
	if(typeof requestProducers != "undefined" && requestProducers.readyState !== 4){
		//Previous request needs to be aborted as user has changed criteria to do new lookup
		requestProducers.abort();
    }

	requestProducers = getProducers(strURL, web, producerRespObj, blnLevel2ProfileSelected);

}

var getProducers = function(strURL, web, producerRespObj, blnLevel2ProfileSelected){
    var request = $.ajax({
	    headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
	    url: strURL,
	    type: "GET",
	    cache: false, 
	    
	    beforeSend:function(status, xhr){
	    	showLoadingMsg();
		},

	    // callback handler that will be called on success
	    success: function(response, textStatus, jqXHR){
	    	var producerElem = $('#policyProducerInput');
	    	if(response.length > 0){
	    		$.each(response, function(i) {
					producerRespObj = response[i];
					if(producerRespObj.producerWebDisplayName){
						blnLevel2ProfileSelected = true;
						if(web == "BK"){
							producerElem.append('<option value="' + $.trim(producerRespObj.producerId)+'">' + $.trim(producerRespObj.producerWebDisplayName) + '</option>');
						}else{
							producerElem.append('<option value="' + $.trim(producerRespObj.producerId)+'">' + $.trim(producerRespObj.producerWebDisplayName) +" - "+ producerRespObj.producerLevelCode + '</option>');
						}
					}else{
						producerElem.append('<option value="' + $.trim(producerRespObj.producerId) + '"data-support="'+$.trim(producerRespObj.companyId)+'">' + producerRespObj.producerName +" - "+ producerRespObj.producerLevelCode + '</option>');
					}
					
				});
	    	}
	    },
	    
	    // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	//alert('error accessing security database');
	    }
	    ,
	    complete: function(){
	    	$('#policyInfoLevel2ProfileSelectedFlag').val(blnLevel2ProfileSelected);
	    	handleProducers();
	    	$.unblockUI();
	    }
	});
    
    return request;
};

