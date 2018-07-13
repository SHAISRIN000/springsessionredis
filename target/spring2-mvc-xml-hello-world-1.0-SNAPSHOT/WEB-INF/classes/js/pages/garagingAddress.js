
var maGaragingCity = '';
var maAltGarageTown = '';
var maZip = '';
var stateMap = {'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California ','CO':'Colorado','CT':'Connecticut','DE':'Delaware'
	,'DC':'District of Columbia','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky'
	,'LA':'Louisiana','ME':'Maine','MD':'Maryland','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada'	
		,'NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma'
			,'OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont'
				,'VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'};

function editGaragingAddress(iiID){
	
	var garIndex = iiID.substring('editAlternateGaragingAddress_'.length);

	$("#gaGarageIndex").val(garIndex);
	$("#gaGarageId").html(getVehicleHeader(garIndex));
	
	//clearGaragingAddress();
	
	if (isEndorsement() && isMaipPolicy()) {
		clearGaragingAddressForMAIP();
		populateGaragingAddressForMAIP('edit');
	} else{
		clearGaragingAddress();
		populateGaragingAddress('edit');
	}
	
	$('#garagingAddressDlg').modal('show');
	if($('#stateCd').val() == 'MA'){
		bindGaragingFields();
		if (isEndorsement() && isMaipPolicy()) {
			return;
		}
		var garagingState = $('#quoteSelectedState_'+garIndex).val();
		if(garagingState == 'MA'){
			$("#gaState").attr("disabled", true).trigger('chosen:updated');
			$('#gaCity_chosen').addClass('chosenDropDownHidden');
			$('#gaMaCity_chosen').removeClass('chosenDropDownHidden');
			$('#gaOutOfStateZip').addClass('hidden');
			$('#gaZip_chosen').removeClass('chosenDropDownHidden');
		}else{
			$("#gaState").attr("disabled", false).trigger('chosen:updated');
			//$('#gaCity_chosen').removeClass('chosenDropDownHidden');
			$('#gaMaCity_chosen').addClass('chosenDropDownHidden');
			$('#gaOutOfStateZip').removeClass('hidden');
			$('#gaZip_chosen').addClass('chosenDropDownHidden');
		}
	}
}

function clearGaragingAddress() {
	
	$("#gaAddress1").val('');
	$("#gaAddress2").val('');	
	$("#gaZip").val('');
	$("#gaCity").val('');
	$('#gaStateForZip').val('');
	
	$('#gaOutOfStateZip').val('');
	$('#gaOutOfStateCity').val('');
	
	$('div#unratablezipmsg').text('');
	
	$('div#gaAddress1msg').text('');
	$('div#gaCitymsg').text('');
	$('div#gaZipmsg').text('');
	
	maGaragingCity = '';
	maAltGarageTown = '';
	maZip = '';
	
	if($('#stateCd').val() != 'MA'){
		emptySelect($("#gaCity"));
	    if($('#gaCity_chosen').hasClass('chosenDropDownHidden')){
			$('#gaOutOfStateCity').addClass('hidden');
			$('#gaCity_chosen').removeClass('chosenDropDownHidden'); 
	   	}
	    $("#gaCity").prop("disabled", false).trigger('chosen:updated');
	}
	
	if($('#stateCd').val() == 'MA'){
		var vehIndex = parseInt($("#gaGarageIndex").val());
		var garagingStateInQuote = $('#quoteSelectedState_'+vehIndex).val();
		emptySelect($("#gaCity"));
		if(garagingStateInQuote == 'MA'){
			emptySelect($("#gaZip"));
		}
//		else{
//			emptySelect($("#gaCity"));
//		}
		$("#gaCity").prop("disabled", false).trigger('chosen:updated');
	}
	
	$("#gaState").val('').trigger('chosen:updated');
}

function clearGaragingAddressForMAIP() {
	$("#gaAddress1").val('');
	$("#gaAddress2").val('');	
	$("#gaZip").val('');
	$("#gaCity").val('');
	$('#gaStateForZip').val('');
	
	$('#gaOutOfStateZip').val('');
	$('#gaOutOfStateCity').val('');
	
	$('div#unratablezipmsg').text('');
	
	$('div#gaAddress1msg').text('');
	$('div#gaCitymsg').text('');
	$('div#gaZipmsg').text('');
	$("#gaState").val('').trigger('chosen:updated');
}

function populateGaragingAddress(editFlag) {
	
	var vehIndex = parseInt($("#gaGarageIndex").val());
	$("#gaAddress1").val($("#garagingAddress1_" + vehIndex).val());
	$("#gaAddress2").val($("#garagingAddress2_" + vehIndex).val());	
	
	if($('#stateCd').val() != 'MA'){
		$("#gaZip").val($("#garagingZipCode_" + vehIndex).val());
		var zipVal = $("#gaZip").val();
		if (zipVal.length == 5 || zipVal.length == 9) {
			performZipTownLookup(zipVal, $('#gaCity') , $("#garagingCity_" + vehIndex).val(), editFlag);
	}
	}
	
	var disableState = false;
	if($('#stateCd').val() == 'MA'){
		var garageCity = $("#garagingCity_" + vehIndex).val();
		var garagingState = $('#quoteSelectedState_'+vehIndex).val();
		if(performTownToZipLookup() && isValidValue(garageCity)){
			var altGarageTown = $('#vehAltGarageTown_'+vehIndex).val();
			maGaragingCity = garageCity;
			maAltGarageTown = altGarageTown;
			maZip = $("#garagingZipCode_" + vehIndex).val();
			$("#gaMaCity").val(altGarageTown).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#gaOutOfStateCity').addClass('hidden');
			performZipTownLookup(altGarageTown, $('#gaZip') , $("#garagingZipCode_" + vehIndex).val(), editFlag);
			disableState = true;
		}else{
			$('#gaOutOfStateZip').val($("#garagingZipCode_" + vehIndex).val());
			var zipVal = $('#gaOutOfStateZip').val();
			if(zipVal== null || zipVal.length < 1){
				$('#gaOutOfStateCity').addClass('hidden');
				$('#gaCity_chosen').removeClass('chosenDropDownHidden');
			}else{
				var garageSt = $("#garagingState_" + vehIndex).val();
				var altGarageTown = $('#vehAltGarageTown_'+vehIndex).val();
				if(garageSt == 'MA'){
					performZipTownLookup(zipVal, $('#gaCity') , altGarageTown, editFlag);
				}else{
					performZipTownLookup(zipVal, $('#gaCity') , $("#garagingCity_" + vehIndex).val(), editFlag);
				}
			}
		}
		
		if(garagingState != 'MA'){
			$('#gaOutOfStateZip').removeClass('hidden');
			$('#gaZip_chosen').addClass('chosenDropDownHidden');
    		disableState = false;
			if(!isValidValue(garageCity)){
				emptySelect($("#gaCity"));
			}
		}
	}
	
	var garageSt = $("#garagingState_" + vehIndex).val();
	if(isValidValue(garageSt)){
		$("#gaState").val($("#garagingState_" + vehIndex).val()).trigger('chosen:updated');
		$("#gaState").attr("disabled", disableState).trigger('chosen:updated');
	}
}

function populateGaragingAddressForMAIP(editFlag) {
	var vehIndex = parseInt($("#gaGarageIndex").val());
	$("#gaAddress1").val($("#garagingAddress1_" + vehIndex).val());
	$("#gaAddress2").val($("#garagingAddress2_" + vehIndex).val());	
	$('#gaOutOfStateZip').val($("#garagingZipCode_" + vehIndex).val());
	$('#gaOutOfStateCity').val($("#garagingCity_" + vehIndex).val());
	$("#gaState").val($("#garagingState_" + vehIndex).val()).trigger('chosen:updated');
}

function saveGaragingAddress(closeDialog, addNew, prefix) {
	//Check whether zip entered belong to NJ or not for release 2.0
	//old-todo for 2.1 we have to come back here.
	//2.3 - 3.1.12	When CT and NH zip codes are added in this release, the zip code to town look-up will be available
	//in MA and NJ quotes.
	var stateCd = $('#stateCd').val();
	var vehIndex = parseInt($("#gaGarageIndex").val());
	var garagingState = $('#quoteSelectedState_'+vehIndex).val();
	
	if(stateCd != 'MA'){
		
		if(!hasAllDataFilledIn()){
			handleErrorMessage($('#gaAddress1'));
			if($('#gaOutOfStateCity').hasClass('hidden')){
				handleErrorMessage($('#gaCity'));
			}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden')){
				handleErrorMessage($('#gaOutOfStateCity'));
			}
			
			handleErrorMessage($('#gaZip'));
			handleErrorMessage($('#gaState'));			
			return;
		}
		
		if( ($('#gaStateForZip').val() != '' && ($('#gaStateForZip').val() != $("#gaState").val()))){
		$('div#gaZipmsg').text("The Zip Code is not valid ratable Zip for selected State, Please correct");
			return;
	
	}else{
		//empty error message if zip and state matches
		$('div#unratablezipmsg').text('');
		$('#gaStateForZip').val('');
	}

	
	if($('#gaOutOfStateCity').hasClass('hidden')){
		$("#garagingCity_" + vehIndex).val($("#gaCity").val());
	}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden')){
		$("#garagingCity_" + vehIndex).val($("#gaOutOfStateCity").val());
	}
	
	//TODO: Determine what fields are necessary for saving the Address. Is zip just sufficient for save?
	$("#garagingAddress1_" + vehIndex).val($("#gaAddress1").val());		
	$("#garagingAddress2_" + vehIndex).val($("#gaAddress2").val());	
	$("#garagingZipCode_" + vehIndex).val($("#gaZip").val());	
	$("#garagingState_" + vehIndex).val($("#gaState").val());
	
		if($("#gaZip").val() != null) {
		//Now all handled through classes..removed the restGAragingAddressEditLInk.
		$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text($("#gaZip").val() );
		$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected' ).removeClass('hidden');
		$('#garagingAddressData_'+vehIndex+' .garagingAddressNew' ).addClass('hidden');
		
		//resetGaragingAddressEditLink(vehIndex, newRow);
		
		//update the edit link with newly selected Zip
	}
		
		$("#garagingAddressDlg").modal('hide');
		
		if('' != $("#gaAddress1").val() && '' != $("#gaZip").val() && '' != $("#garagingCity_" + vehIndex).val() && '' != $("#garagingState_" + vehIndex).val()){
			$('#garagingAddressData_Error_Col_'+vehIndex).empty();
			if(prefix == 'policyWrapper.'){			
				showClearInLineErrorMsgsWithMap('garagingAddressData_'+vehIndex, "", $('#defaultVehicleMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
			}
			else{
				showClearInLineErrorMsgsWithMap('garagingAddressData_'+vehIndex, "", $('#defaultMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
			}		
		}
		
	}
	
	if(stateCd == 'MA'){
		//Error handling
		if(!hasAllDataFilledIn()){
			handleErrorMessage($('#gaAddress1'));
			
			
			if($('#gaOutOfStateCity').hasClass('hidden') && $('#gaMaCity_chosen').hasClass('chosenDropDownHidden')){
				handleErrorMessage($('#gaCity'));
			}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden') && $('#gaMaCity_chosen').hasClass('chosenDropDownHidden')){
				handleErrorMessage($('#gaOutOfStateCity'));
			}
			else if($('#gaOutOfStateCity').hasClass('hidden') && $('#gaCity_chosen').hasClass('chosenDropDownHidden')){
				handleErrorMessage($('#gaMaCity'));
			}
			
			if($('#gaOutOfStateZip').hasClass('hidden')){
				handleErrorMessage($('#gaZip'));
			}else if($('#gaZip_chosen').hasClass('chosenDropDownHidden')){
				handleErrorMessage($('#gaOutOfStateZip'));
			}
			handleErrorMessage($('#gaState'));			
			return;
		}
		
		if($('#gaStateForZip').val() != '' && $('#gaStateForZip').val() != $("#gaState").val()){
			//($('#gaStateForZip').val() == '' && ($('#gaState').val() == 'MA'))
			$('div#gaZipmsg').text("The zip code entered is not a ratable zip and cannot be used for a garaging address. " +
						"Please update the zip code to a physical location or contact Customer Care for assistance");
				$('div#gaCitymsg').text("The Zip and Town are not consistent according to our Zip/Town rating table. " +
						"Please correct Town and/or Zip Code.");
				return;
		}else{
			//empty error message if zip and state matches
			$('div#unratablezipmsg').text('');
			$('div#unratablecitymsg').text('');
			
		}
		//clear out errors here
		$('div#gaAddress1msg').text('');
		$('div#gaCitymsg').text('');
		$('div#gaZipmsg').text('');
		
			
		$("#garagingAddress1_" + vehIndex).val($("#gaAddress1").val());		
		$("#garagingAddress2_" + vehIndex).val($("#gaAddress2").val());	
		var city_selected_text = '';
		var city_selected_value = '';
		
			if(performTownToZipLookup()){
				var city_selected_text = $.trim($("#gaMaCity").find('option:selected').text());
				city_selected_value = $("#gaMaCity").val();
				$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text(city_selected_text);
				$("#garagingCity_" + vehIndex).val(city_selected_text);
				$("#garagingZipCode_" + vehIndex).val($("#gaZip").val());
			}
			else{
				//user doing zip lookup 
				
				var state_fr_zip = $('#gaStateForZip').val();
				var statedropDown = $('#gaState').val();
				
				if($('#gaOutOfStateCity').hasClass('hidden')){
					if(state_fr_zip == 'MA' && statedropDown=='MA'){
						city_selected_value = $("#gaCity").val();
					}else{
						city_selected_value = statedropDown;
					}
					city_selected_text = $.trim($("#gaCity").find('option:selected').text());
					
				}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden')){
					city_selected_text = $("#gaOutOfStateCity").val();
					city_selected_value = statedropDown;
				}
				
				
				var entered_zip = $("#gaOutOfStateZip").val();
				
				$("#garagingZipCode_" + vehIndex).val(entered_zip);
				//var cityText = $.trim($("#gaCity").find('option:selected').text());
				$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text(city_selected_text);
				$("#garagingCity_" + vehIndex).val(city_selected_text);
				$('#vehAltGarageTown_'+vehIndex).val(city_selected_value);
					if(isValidValue(state_fr_zip)){
							$("#garagingState_" + vehIndex).val(state_fr_zip);
					}
					else if (isValidValue(statedropDown)){
						$("#garagingState_" + vehIndex).val(statedropDown);
					}
				
					$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected .gaTitle' ).text(stateMap[statedropDown]);
			}
			
			if(city_selected_text != null) {
			$('#garagingAddressData_'+vehIndex+' .garagingAddressSelected' ).removeClass('hidden');
			$('#garagingAddressData_'+vehIndex+' .garagingAddressNew' ).addClass('hidden');
			}
			//resetGaragingAddressEditLink(vehIndex, newRow);
			
			//update the edit link with newly selected Zip
		//}
		
			
		
			$("#garagingAddressDlg").modal('hide');
		
			if(('' == $("#gaAddress1").val()) || ('' != $("#gaAddress1").val() && '' != $("#gaZip").val() && '' != $("#garagingCity_" + vehIndex).val() && '' != $("#garagingState_" + vehIndex).val())){
				$('#garagingAddressData_Error_Col_'+vehIndex).empty();
				if(prefix == 'policyWrapper.'){			
					showClearInLineErrorMsgsWithMap('garagingAddressData_'+vehIndex, "", $('#defaultVehicleMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
				}
				else{
					showClearInLineErrorMsgsWithMap('garagingAddressData_'+vehIndex, "", $('#defaultMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
				}		
		
	
	
			}
			
			//for maip
			if (isEndorsement() && isMaipPolicy()) {
				$("#garagingCity_" + vehIndex).val($("#gaOutOfStateCity").val());
			}	
	}
}

function cancelGaragingAddress() {	
	//55161-Alt Garage Bubble in App
	if($('#stateCd').val() == 'MA' && performTownToZipLookup()){
		if(isValidValue(maZip) && isValidValue(maGaragingCity) && isValidValue(maAltGarageTown)){
			var vehIndex = parseInt($("#gaGarageIndex").val());
			$("#garagingCity_" + vehIndex).val(maGaragingCity);
			$("#garagingZipCode_" + vehIndex).val(maZip);
			$('#vehAltGarageTown_'+vehIndex).val(maAltGarageTown);
		}
	}
	
	$("#garagingAddressDlg").modal('hide');
}


/*function resetGaragingAddressEditLink(vehIndex, rowHTML) {

	var dataSection = $("#garagingAddressData_" + vehIndex);

	var col = $('tr:last td:first', dataSection);
	col.html(rowHTML);
	
	var editSpan = $('.editGaragingAddress span', dataSection);
	
	editSpan.html('edit');		

}*/

//Refactor below method from client/application and vehicle..

function performZipTownLookup(zip, townElement, valueSelected, editFlag) {
	var stateCd = $('#stateCd').val();
	var lookupData = {};
	lookupData.zip = zip;
	lookupData.garageTown = '';
	lookupData.stateCd = '';
	
	if(stateCd != 'MA'){
		lookupData.zip = zip;
		lookupData.garageTown = '';
		lookupData.stateCd = '';
	}
	
	if(stateCd == 'MA'){
		if(performTownToZipLookup()){
			lookupData.garageTown = zip;
			lookupData.zip = '';
			lookupData.stateCd = stateCd;
		}
	}

	var jsonData = JSON.stringify(lookupData);
	
	blockUser();
	
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        async:false,
        url: '/aiui/lookup/zipAddress/zipTownLookup',
        type: "post",
        data: jsonData,
        dataType: 'json',
        
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
            processZipTownResults(response, townElement ,valueSelected, editFlag);          	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
            // log the error to the console
        	if(console)
            console.log( "The following error occured: "+textStatus, errorThrown );
        },
        // callback handler that will be called on completion
        // which means, either on success or error
        complete: function(){
            // enable the inputs
        	$.unblockUI();
        }
    });
}

function populateGaragingCitySelect(options, selectElement) {
	emptySelect(selectElement);
	var stateCd = $('#stateCd').val();
	if(options !=null && options !=undefined && options.zipTownLookup != null && options.zipTownLookup !=undefined){
		for (var i = 0; i < options.zipTownLookup.length; i++) {
			//if (i < options.zipTownLookup.length) {
				if(stateCd == 'MA' && options.zipTownLookup[i].stateCode == 'MA'){
					selectElement.append('<option value="' + options.zipTownLookup[i].rateableGarageTown + '">' + options.zipTownLookup[i].cityName +'</option>');
				}
				else{
					selectElement.append('<option value="' + options.zipTownLookup[i].cityName + '">' + options.zipTownLookup[i].cityName+ '</option>');
				}
				
			//}
		}
		//Added in 2.3 NH & CT - 3.1.12
		//If only one town is associated to the zip code, the City field is populated with that town and the field is read-only.
		//No functionality change from NJ.
		if(options.zipTownLookup.length == 1){
			if(stateCd == 'MA' && options.zipTownLookup[0].stateCode == 'MA'){
				selectElement.val(options.zipTownLookup[0].rateableGarageTown).prop('disabled',true).trigger('chosen:updated');
			}else{
				selectElement.val(options.zipTownLookup[0].cityName).prop('disabled',true).trigger('chosen:updated');	
			}
			
		}else{
			selectElement.prop('disabled',false).trigger('chosen:updated');	
		}
	}
}


/**
 * when MA is selected as garage town and state is also MA we are doing town to zip lookup
 * @param options
 * @param selectElement
 */
function populateGaragingZipSelect(options, selectElement){
	emptySelect(selectElement);
	if(options !=null && options !=undefined && options.zipAssociatedWithTown != undefined && options.zipAssociatedWithTown !=null){
	for (var i = 0; i < options.zipAssociatedWithTown.length; i++) {
		if (i < options.zipAssociatedWithTown.length) {
			selectElement.append('<option value="' + options.zipAssociatedWithTown[i] + '">' + options.zipAssociatedWithTown[i]+ '</option>');
		}
	}
	//55229
	if(options.zipTownLookup.length == 1){
		selectElement.val(options.zipAssociatedWithTown[0]).prop('disabled',true).trigger('chosen:updated');
	}else{
		selectElement.prop('disabled',false).trigger('chosen:updated');	
	}
	}
	
}

function populateGaragingStateSelect(options, editFlag){
	//editFlag tells whether its coming from edit or not
	if(options != null && options.stateAssociatedWithZip !=null){
	if(editFlag != 'edit'){
		$('#gaState').val(options.stateAssociatedWithZip);
		$('#gaState').trigger('chosen:updated');		
	}
	$('#gaStateForZip').val(options.stateAssociatedWithZip);
	}else{
		$('#gaStateForZip').val('');
		$('#gaState').val('').trigger('chosen:updated');
	}
}

function processZipTownResults(results, townElement , valueSelected, editFlag) {
	var stateCd = $('#stateCd').val();
	var vehIndex = parseInt($("#gaGarageIndex").val());

	if(stateCd != 'MA'){
		if(results == null || results.zipTownLookup ==null ||  results.zipTownLookup.length<1){
			$('#gaOutOfStateCity').removeClass('hidden');
			$('#gaCity_chosen').addClass('chosenDropDownHidden');
	} else {
		$('#gaOutOfStateCity').addClass('hidden');
		$('#gaCity_chosen').removeClass('chosenDropDownHidden');
		populateGaragingCitySelect(results, townElement);
	}
	}
	
	if(stateCd == 'MA'){
		if(performTownToZipLookup()){
			populateGaragingZipSelect(results, townElement);
		}
		else{
        	
			if(results == null || results.zipTownLookup ==null || results.zipTownLookup.length<1){
        	
				$('#gaOutOfStateCity').removeClass('hidden');
    			//$('#gaCity_chosen').addClass('chosenDropDownHidden');
    			//$('#gaMaCity_chosen').addClass('chosenDropDownHidden');
        	} else {
        	
        		$('#gaOutOfStateCity').addClass('hidden');
	    		$('#gaCity_chosen').removeClass('chosenDropDownHidden');
	    		populateGaragingCitySelect(results, townElement);
	    		if(results.zipTownLookup.length>1){
	    			townElement.prop('disabled', false);
	    			if(stateCd == 'MA' && results.stateAssociatedWithZip =='MA'){
	    				valueSelected = $('#vehAltGarageTown_'+vehIndex).val();
	    	
	    			}
	    		}
	    	
    	}
        
        }
	}
	
	//$("#garagingState_" + vehIndex).val($("#gaState").val());
	
	
	populateGaragingStateSelect(results, editFlag);
	

	if(results == null || results.stateAssociatedWithZip == null){
		$('#gaState_'+vehIndex).val($("#garagingState_" + vehIndex));
	}else{
		$('div#gaCitymsg').text('');
		$('#gaState').val(results.stateAssociatedWithZip).trigger('chosen:updated');
	}
	
	//2.3 - Why are we checking if the results we are getting back are not null 
	//and again putting back the user selected value for the townElement ?
	//also should be checking if townElement is empty too 
	//TODO: verify me
	
	if(results.cityAssociatedWithZip != null){
		if(valueSelected != undefined && valueSelected.length > 1){
			if(results.cityAssociatedWithZip.length == 1)
				{
					townElement.val(valueSelected).prop('disabled', true).trigger('chosen:updated');
				}else{
					townElement.val(valueSelected).prop('disabled', false).trigger('chosen:updated');
				}
		}
	}else if(results.cityAssociatedWithZip == null){
		$('#gaOutOfStateCity').val(valueSelected);
		$('#gaCity_chosen').addClass('chosenDropDownHidden');
	}
	
	
	
	
}

function isValidValue(strId){
	var isValid = true;
	if(strId ==  undefined || strId == null || strId.length < 1){
		isValid = false;
	}
	return isValid;
}

function bindGaragingFields(){
//	if($('#gaAddress1').val()==''){
//		$('#gaAddress1').addClass('preRequired');
//	}
//	if(!$('#gaZip').hasClass('.colSelect') && $('#gaZip').val()==''){
//		$('#gaZip').addClass('preRequired');
//	}
//	handleInput($('#gaAddress1'));
//	handleMandatoryFields();
	initializeMustFillElements();
}

function handleMandatoryFields() {
	$("#gaAddress1").bind({
		blur : function() {
			handleErrorMessage(this);
		}
	});
	
	$("#gaZip").bind({
		blur : function() {
			handleErrorMessage(this);
		},
		change : function() {
			handleErrorMessage(this);
		}
	});
	
	$("#gaOutOfStateZip").bind({
		blur : function() {
			handleErrorMessage(this);
		},
		change : function() {
			handleErrorMessage(this);
		}
	});
	
	$("#gaCity").bind({
		blur : function() {
			handleErrorMessage(this);
		},
		change : function() {
			handleErrorMessage(this);
		}
	});
	
	$("#gaMaCity").bind({
		blur : function() {
			handleErrorMessage(this);
		},
		change : function() {
			handleErrorMessage(this);
		}
	});
	
	$("#gaOutOfStateCity").bind({
			blur : function() {
				handleErrorMessage(this);
			},
			change : function() {
				handleErrorMessage(this);
			}
		});
	
	$("#gaState").bind({
		blur : function() {
			handleErrorMessage(this);
		},
		change : function() {
			handleErrorMessage(this);
		}
	});
		
}

function hasAllDataFilledIn(){
	var hasDataFilledIn=false;
	
	var address1 = $('#gaAddress1').val();
	var zip = '';
	var city = ''
	var state = $('#gaState').val();
	
	if($('#stateCd').val() != 'MA'){
			if($('#gaOutOfStateCity').hasClass('hidden')){
				city = $('#gaCity').val();
			}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden')){
				city = $('#gaOutOfStateCity').val();
			}
			zip = $('#gaZip').val();
	}
	
	if($('#stateCd').val() == 'MA'){
		if($('#gaOutOfStateZip').hasClass('hidden')){
			zip = $('#gaZip').val();
		}else if($('#gaZip_chosen').hasClass('chosenDropDownHidden')){
			zip = $('#gaOutOfStateZip').val();
		}
		
		if($('#gaOutOfStateCity').hasClass('hidden') && $('#gaMaCity_chosen').hasClass('chosenDropDownHidden')){
			city = $('#gaCity').val();
		}else if($('#gaCity_chosen').hasClass('chosenDropDownHidden') && $('#gaMaCity_chosen').hasClass('chosenDropDownHidden')){
			city = $('#gaOutOfStateCity').val();
		}
		else if($('#gaOutOfStateCity').hasClass('hidden') && $('#gaCity_chosen').hasClass('chosenDropDownHidden')){
			city = $('#gaMaCity').val();
		}
		
		//overwrite above if maip policy
		if (isEndorsement() && isMaipPolicy()) {
			zip = $('#gaOutOfStateZip').val();
			city = $('#gaOutOfStateCity').val();
		}
	}
	
	if(isValidValue(address1) && isValidValue(zip) && isValidValue(city) && isValidValue(state)){
		hasDataFilledIn = true;
	}
	return hasDataFilledIn;
	
}

function handleErrorMessage(element){
	var id = $(element).attr('id');
	if(id.indexOf('gaMaCity')!=-1){
		id ='gaCity'; 
	}
	
	if(id.indexOf('gaOutOfStateCity')!=-1){
		id ='gaCity'; 
	}
	if(id.indexOf('gaOutOfStateZip')!=-1){
		id ='gaZip'; 
	}
	id = id+'msg';
	
	if ($(element).val() != '') {
		$('#'+id).text('');
	} else {
		$('#'+id).text('Required Entry');
	}
	applyClass($(element));
}

function initializeMustFillElements(){
	
	applyClass($('#gaAddress1'));
	handleMandatoryFields();
}

function applyClass(element){
	if ($(element).val() != ''){
		$(element).removeClass('preRequired');
	} else if ($(element).val() == '') {
		$(element).addClass('preRequired');
	};
}

function performTownToZipLookup(){
	var reverseLookup = false;
	var vehIndex = parseInt($("#gaGarageIndex").val());
	var quoteGaragingState = $('#quoteSelectedState_'+vehIndex).val();
	var altGarageInd = $('#altGaragingInd_'+vehIndex).val();
    var altGarageTown = $('#vehAltGarageTown_'+vehIndex).val();
    if(quoteGaragingState !=null && quoteGaragingState.toUpperCase() == 'MA' && altGarageInd == 'Yes' && isValidValue(altGarageTown)){
    	reverseLookup = true;
    }
    return reverseLookup;
}




