jQuery(document).ready(function() {	
	
	
	
});

function performZipTownLookup(zip, townElement) {
	blockUser();
	var stateCd = $('#stateCd').val();
	//var strCityName = $('#cityName').val();
	//var strErrorTag = 'zip.browser.inLine';
	//var errorMessageID = 'InvalidZip';
	//errorMessageID = strErrorTag + '.' + errorMessageID;
	var zipId = $('#mailing_addr_zipcode').attr('id'); 
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
       url: '/aiui/lookup/zipAddress/zipTownLookup',
       type: "post",
       dataType: 'json',
      //  data : JSON.stringify({ "zip":zip}),
       data : JSON.stringify({ "zip":zip,"garageTown":'',"stateCd":''}), 
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	processZipTownResults(response, townElement);
        	//TD 62823
        	/*var cities = response.cityAssociatedWithZip;
        	//errorMessageID = '';
        	
        	var stCd = $('#addrstateCd').val();
    		
        	if (cities!=null && cities.length >=1){
        		errorMessageID = '';
        	}
          	
        	if(stCd !='MA' && stCd!='NH' && stCd !='NJ' && stCd!='CT'){
        		errorMessageID = '';
        	}
        	
        	showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);*/
          	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	        	//parseZipLookupError();
	            //showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);
        },
        complete: function(){
        	$.unblockUI();
//        	if (strCityName != "") {
//        		$('#cityName').val(strCityName).trigger('chosen:updated'); 
//        	}

        }
    });
}

var addDeleteCallback = function(row, addIt) {
	//alert('what i waana do with call back?');
}

/*function parseZipLookupError()
{
	$('#cityName_chosen').hide();
	 $('#cityName').empty();
	 $('#cityName').val('');
	 $('#cityName').show();
	 $('#cityName').prop('disabled',false);
	 $('#addrstateCd').prop('disabled',false);
	 $('#cityName').prop('readonly', false);
	 $('#addrstateCd').removeClass('required');
	 $('#addrstateCd').removeClass('inlineError');
	 $('#addrstateCd').removeClass('preRequired');
	 $('#cityName').removeClass('required');
	 $('#cityName').removeClass('inlineError');
	 $('#cityName').removeClass('preRequired');
	 $('#cityName').trigger('chosen:updated').trigger('chosen:styleUpdated');
	 $('#addrstateCd').trigger('chosen:updated').trigger('chosen:styleUpdated');
	 $('#addrstateCd_Error').remove();
	 $('zip_Error').remove();
}*/

function processZipTownResults(results, townElement) {
	populateSelect(results);
}

function populateSelect(options) 
{
	var cities = options.cityAssociatedWithZip;
	var state = options.stateAssociatedWithZip;
	
	var mailCity = $('#mailingCity').val();
	//TD 62823
	//$('#cityName').empty();
	//$('#Freeform_cityName').val('');
	var errorMessageID = '';
	if(cities !=null && cities.length>0){
		$('#Freeform_cityName').addClass('hidden');
		$('#mailing_addr_city').removeClass('hidden');
		$('#mailing_addr_city_chosen').removeClass('chosenDropDownHidden');
		
		//var errorMessageID = '';
		var freeFormCityId = $('#Freeform_cityName').attr('id');
		//showClearInLineErrorMsgsWithMap(freeFormCityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		
		//var cityId = $('#cityName').attr('id');
      	//if(isValidValue($('#cityName').val())){
      		//showClearInLineErrorMsgsWithMap(cityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
      	//}
		
		
		$('#mailing_addr_city').empty('');		
		var options_select = '';
		options_select+='<option value="">Select</option>';
		$('#mailing_addr_city').append(options_select);
		for (var i = 0; i < cities.length; i++) {
			if (i < cities.length) {
				options_select +='<option value="' + cities[i] + '">' + cities[i] + '</option>';
				$('#mailing_addr_city').append('<option value="' + cities[i] + '">' + cities[i] + '</option>');
			}
		}
		
		if(cities.length == 1){
			mailCity = cities[0];
			$('#mailing_addr_city').val(mailCity).prop('disabled', true).trigger('chosen:updated');
//			$('#mailing_addr_city').removeClass('required');
//			$('#mailing_addr_city').removeClass('inlineError');
//			$('#mailing_addr_city').removeClass('preRequired');
//			$('#mailing_addr_city_Error').remove();
			$('#mailing_addr_city').val(mailCity);
		}
		else{
			$('#mailing_addr_city').val(mailCity).prop('disabled', false).trigger('chosen:updated');
			$('#mailing_addr_city').removeClass('required');
			$('#mailing_addr_city').removeClass('inlineError');
			$('#mailing_addr_city').removeClass('preRequired');
		}
	}
	else{
		
		$('#Freeform_cityName').removeClass('hidden');
		$('#Freeform_cityName').show();
		$('#mailing_addr_city_chosen').addClass('chosenDropDownHidden');
		$('#Freeform_cityName').val(mailCity);
		
		
		//var cityId = $('#mailing_addr_city').attr('id');
		//showClearInLineErrorMsgsWithMap(cityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		
		//if(!isValidValue($('#Freeform_cityName').val())){
			//var freeFormCityId = $('#Freeform_cityName').attr('id');
			//errorMessageID = 'cityName.browser.inLine.required';
			//showClearInLineErrorMsgsWithMap(freeFormCityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		//}
	
		//	var zipId = $('#zip').attr('id');
	}
	
	if(state !=null && state[0] !=null){
		if (state !=null && state.length == 1){
			$('#mailing_addr_state').prop('disabled', false).trigger('chosen:updated');
			var stateAssociated = state[0];
			$('#mailing_addr_state').removeClass('required');
			$('#mailing_addr_state').removeClass('inlineError');
			$('#mailing_addr_state').removeClass('preRequired');
			$('#mailing_addr_state').val(stateAssociated).prop('disabled', true).trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#mailing_addr_state_Error').remove();
			$('#mailingZipLookupReturnedState').val(state);
			$('#mailingAddressState').val(state);
		}
	}
	else{
			$('#zipLookupReturnedState').val('');
			//TD 62823 - default to empty
			var defaultState = '';
			if(isValidValue($('#mailingAddressState').val())){
				defaultState = $('#mailingAddressState').val();
				//TD 62823 - retain selected state
				/*if(defaultState == 'MA' || defaultState == 'NJ' || defaultState == 'CT' || defaultState == 'NH')
				{
					defaultState = 'AL';
				}*/
			}else{
				$('#mailingAddressState').val(defaultState);
			}
			$('#mailing_addr_state').val(defaultState);
//			if($('#addressState').val(''))
//			$('#addressState').val('AL');
//			if($('#addrstateCd').val() == 'AL'){
//				$('#addrstateCd').val('AL');
//				$('#addressState').val('AL');
//			}
			$('#mailing_addr_state').prop('disabled', false).trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
}