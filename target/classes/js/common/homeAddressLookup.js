var requestAutoComplete;
jQuery(document).ready(function() {
	
	
	$(document).click(function(e){
		if($(".pac-icon").is(':visible') 
		  && e.target.id != getFieldIdForMapLkup()){
			 $('.pac-container').hide();
		}
    });
	
	// address lookup service
	if($('.clsAddressLookup').length > 0){
		var retrieveAddrURL = '';
		var isConsumer = $('#isConsumer').val();
		if('Yes' == isConsumer){
			retrieveAddrURL = document.homeForm.retrieveAddressesConsumerURL.value;
		}else{
			retrieveAddrURL = document.actionForm.retrieveAddressesURL.value;
		}
		
		$('.clsAddressLookup').autocomplete({
			delay: 500,  
	    	minLength: 2, 
	    	selectFirst: true, 
	    	
	    	source: function(request, response) {
	    		var state, params;
	    		var url = retrieveAddrURL; 
	    		var limit = 5;
	    		var keyword  = $.trim(request.term.toLowerCase());
	    		if(keyword.length > 0 && !(isRentersQuote() || isCondoOwnersQuote())) {
	    			$('.clsAddressLookup').attr('title', '');
		    		
	    			//set addressKey and addressSelected 
	    			if('Yes' == isConsumer){
	    				$('#homeForm [id="addressKey"]').val('');
			    		$('#homeForm [id="addressSelected"]').val('');
	    			}else{
		    			$('#newQuoteForm [id="addressKey"]').val('');
			    		$('#newQuoteForm [id="addressSelected"]').val('');
	    			}
	    			
	    			if('Yes' == isConsumer){
		    				state="PA";
		    		}
	    			else{
	    					(getNQState() != '') ? state=getNQState(): state="PA";
	    			}
		    		
		    		
		    		params = "state=" + state;
	    			if (typeof requestAutoComplete != "undefined" && requestAutoComplete.readyState !== 4) {
	    				requestAutoComplete.abort(); 
	    			}
	    			console.log("home Address Lookup making address request for keyword " + keyword + " at " + Date.now()/1000);
	    			requestAutoComplete = getAutoCompleteResults(keyword, request, response, url, limit, params);
	    		}
	    	},
	    	
	    	focus: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	},
	    	
	    	change: function(event, ui){
	    	},
	    	
	    	select: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	}
	    	
	    })
	    
	    .data('ui-autocomplete')._renderItem = function(ul,item){ 
			var index = $('li.addrOption').length;
			return $( "<li id='addrOption_" + index + "' class='addrOption'></li>")
			.data( "item.ui-autocomplete", item) 
			.append(formatAutoCompleteOption(item.label))
			.appendTo(ul); 
		};
	}
	
	if('Yes' == isConsumer){
		// policyType = $('#consumerSelectedPolicyType').val();
		$('.clsAddressLookup').autocomplete( "disable"); // disable jQuery UI autocomplete
		//initAutocomplete();  // enable google map api autocomplete
		$('tr#aptNumberNewCoRow').removeClass('hidden');
	
	
	}
	
	$('#fullAddressNewCo').bind('keydown', function(e){
		// display popover if hidden if user previously clicked outside of it - JG
		if(isRentersQuote() && !$(".pac-icon").is(':visible')){
			$('.pac-container').show();
		}
    });
	
	
	
});

function populateAutoCompleteInput(input, ui) {
	var selectedOption = ui.item.label;

	if (selectedOption.toUpperCase().indexOf("MORE THAN 20") == -1
			&& selectedOption.toUpperCase().indexOf("NO MATCHES FOUND") == -1) {
		selectedOption = selectedOption.replaceAll("<strong>", "").replaceAll(
				"</strong>", "");
		if($(input).hasClass('clsAddressLookup')){
			processAddressSelected(input, selectedOption);
		}
		$(input).val(selectedOption);
	} else {
		// remove selected look
		$('#ui-active-menuitem').closest('a').removeClass('ui-state-hover')
				.addClass('noSelect');
	}
}

//function to check Consumer Vs home and renters Vs homeowners 
function isRentersQuote(){
	var policyType = "";
	
	if($('#newQuoteDialog').hasClass('in')){
		policyType = $('input[name=policyTypeNewCo ]:checked').val();
	}else if($("#homePolicyForm")){
		policyType = $("#homePolicyForm").val();
	}
	
	var isConsumer = $('#isConsumer').val();
	if('Yes' == isConsumer){
		policyType = $('#consumerSelectedPolicyType').val() || $('#homePolicyForm').val();
	}
	
	if(policyType == "HO4"){
		return true;
	}else{
		return false;
	}
}

var getAutoCompleteResults = function(keyword, request, response, url, limit, params) {
	params = params + "&keyword=" + keyword.replaceAll("*", "");
	
	console.log('getAutoCompleteResults url = '+url);
	var request = $.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url : url,
		type : "get",
		data : params,
		dataType : 'json',
		cache : true,
		timeout: 2000, // 2 second timeout

		success : function(data, status, xhr) {
			console.log("getAutoCompleteResults retrieved data " + Date.now()/1000);
			return processAutoCompleteReponse(response, data, keyword, limit);
		},

		error : function(xhr, error) {
			// error calling web service, display message
			//console.log("error calling getAutoCompleteResults is " + error);
		},

		complete : function() {
			//$.unblockUI();
		}
	});
	
	return request;
};

function processAutoCompleteReponse(response, data, term, limit){
	
	if (data.length == 0) {
		data.push("No matches found");
		response(data, term);
	} else {
		//console.log("highlighting keywords" + Date.now()/1000);
		response(highlightKeywordMatch(data, term, limit));
	}
	
	return response;
}

function highlightKeywordMatch(data, term, limit) {
	// if exact match, display option in bold in dropdown
	var isConsumer = $('#isConsumer').val();
	
	var regex = new RegExp("(?![^&;]+;)(?!<[^<>]*)("
			+ term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1")
			+ ")(?![^<>]*>)(?![^&;]+;)", "gi");
	var limitMatches = "...More than " + limit + " found. Please refine your search.";

	var result = $.map(data, function(value, index) {
		if (index < limit) { // Limiting the list to limit passed for elements
			var keyword = "";
			if(value.fullAddress){
				//console.log("setting values to hidden fields" + Date.now()/1000);
				keyword = value.fullAddress;
				if($("#addressOption_" + index).length == 0){
					var input = $("<input>").attr("type", "hidden").attr("id", "addressOption_" + index).attr("class", "addressOption");
					
					if('Yes' == isConsumer){
						$('#homeForm').append($(input));
					}else{
						$('#newQuoteForm').append($(input));
					}
				}
				
				$("#addressOption_" + index).val(JSON.stringify(value));
				console.log("highlightKeywordMatch value is " + JSON.stringify(value));
			}else{
				keyword = value;
			}
			
			// match on term, make it bold in drop down
			return keyword.replace(regex, "<strong>$1</strong>");
		} else {
			// If count returned more than limit, display message
			if (index == (data.length - 1)) {
				return limitMatches.replace(regex, "<strong>$1</strong>");
			}
		}
	});

	console.log("set values to hidden fields" + Date.now()/1000);
	return result;
}

function processAddressSelected(input, selectedOption){
	var id = "";
	
	selectedOption = $.trim(selectedOption);
	$(input).attr('title', selectedOption);
	selectedOption = selectedOption.toUpperCase();
	
	$("a.ui-corner-all").each(function(){
		var addrValue = $.trim($(this).text().toUpperCase());
		var elm = $(this).parent();
		if(addrValue == selectedOption){
			id = $(elm).attr('id');
			id = id.replace("addrOption_","");
			return false;
		}
	});
	
	var selAddress = $('#newQuoteForm input[id="addressOption_' + id + '"]').val();
	$('#newQuoteForm input[id="addressSelected"]').val(selAddress);
}

function formatAutoCompleteOption(item) {
	var option;
	
	if (item.toUpperCase().indexOf("NO MATCHES FOUND") > -1
			|| item.toUpperCase().indexOf("MORE THAN 20") > -1) {
		option = "<a><strong>" + item + "</strong></a>";
	} else {
		option = "<a>" + item + "</a>";
	}

	return option;
}



//google API
var state = 'PA';
var placeSearch, autocomplete;
var countryRestrict = {
	'country' : 'us'
};
var componentForm = {
	street_number : 'short_name',
	route : 'long_name',
	locality : 'long_name',
	administrative_area_level_1 : 'short_name',
	postal_code : 'short_name',
	country : 'long_name'
};

function initAutocomplete() {
	var isConsumer = $('#isConsumer').val();
	
	console.log('inside initAutocomplete');
	if(($('#newQuoteDialog').hasClass('in') || $('#editPrimaryInsuredDlg').hasClass('in'))
		&& (!(isRentersQuote() || isCondoOwnersQuote()))){
		return;
	}
	if( ($("#editAddressDlg").hasClass("in") && $("#adressSelected").attr("readonly") == "readonly") && !(isRentersQuote() || isCondoOwnersQuote()) ) {
		return;
	}
	
	if($('#editPrimaryInsuredDlg').hasClass('in') && $('#pri_priorAdd').attr('readonly') == 'readonly'){
		return;
	}
	
	var fieldId = getFieldIdForMapLkup();
	var input = document.getElementById(fieldId);
	
	// Create the autocomplete object, restricting the search to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
	/** @type {!HTMLInputElement} */
	(input), {
		types : [ 'geocode' ],
		componentRestrictions : countryRestrict
	});
	
	if(typeof autocomplete != "undefined"){
		// When the user selects an address from the dropdown, populate the address fields in the form.
		//console.log('fillInAddress listener place_changed= '+fillInAddress);
		autocomplete.addListener('place_changed', fillInAddress);
		
		// if user is entering a primary address in NQ dialog, we want to restrict selections by that state
		// for google api, we must use geocodes - JG
		
		if(fieldId == "fullAddressNewCo"){
			var currentState = "PA";
			if('Yes' == isConsumer){
				currentState = "PA"
			}
			else{
				currentState = getNQState();
			}
			var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(stateGeoCodes[currentState].latitude, 
																					stateGeoCodes[currentState].longitude));
			autocomplete.setBounds(defaultBounds);
		}
		
		// this code prevents form from being submitted if user makes selection by hitting enter
		google.maps.event.addDomListener(input, 'keydown', function(e) { 
		   if (e.keyCode == 13) { 
			   e.preventDefault(); 
		    }
		}); 
	}
}

/** State geocode values **/
var stateGeoCodes = {
	"PA" : {latitude: 40.5773, longitude : -77.264},
	"NY" : {latitude: 40.712775, longitude : -74.005973}
};


function getFieldIdForMapLkup(){
	var fieldId = "";
	
	var isConsumer = $('#isConsumer').val();
	if('Yes' == isConsumer){
		var landing = $('#isLanding').val();
		if('Yes' == landing ){
			if($('#addPriorSsnNQ').hasClass('in')){
				fieldId = "prioraddr_PRIMARY_INSURED_NQ";
			}else{
				fieldId = "fullAddressNewCo";
			}			
		}else if($('#editPrimaryInsuredDlg').hasClass('in')){
			fieldId = "pri_priorAdd";
		}else if( $("#editAddressDlg").hasClass("in") && isRentersQuote() ) {
			fieldId = "adressSelected";
		}else{
			fieldId = "prioraddr_PRIMARY_INSURED_NQ";
		}
	}
	else{
	if($('#newQuoteDialog').hasClass('in')){
		fieldId = "fullAddressNewCo";
	}else if($('#editPrimaryInsuredDlg').hasClass('in')){
		fieldId = "pri_priorAdd";
	}else if($('#editAddressDlg').hasClass('in')){
		fieldId = "adressSelected";
	}else{
		fieldId = "prioraddr_PRIMARY_INSURED_NQ";
	}
	}
	return fieldId;
}

function fillInAddress() {
	var fieldId = getFieldIdForMapLkup();
	var place = autocomplete.getPlace();
	var adrs = '';
	
	if(typeof place != "undefined" && typeof place.address_components != "undefined"){
		var hasStreetNumber = false;
		var subLocalityName = '';
		var localityExist = false;
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (addressType == 'sublocality_level_1') {
				subLocalityName = place.address_components[i]['short_name']
			} else if (addressType == 'locality') {
				localityExist = true;
			}
			if (componentForm[addressType]) {
				if (addressType != 'country') {
					var val = place.address_components[i][componentForm[addressType]];
					if (i == 0) {
						adrs = adrs + val;
						// need to check if street number is present for formatting purposes
						if (addressType == 'street_number'){
							hasStreetNumber = true;
						}
					}else if((i == 1 && hasStreetNumber) || (addressType == 'postal_code')){
						adrs = adrs + ' ' + val;
					}else{
						if (addressType == 'administrative_area_level_1' && (!localityExist)) {
							adrs = adrs + ', ' + subLocalityName;
						adrs = adrs + ', ' + val;
						} else {
							adrs = adrs + ', ' + val;
					}
				}
			}
		}
		}
	
		console.log('fillInAddress fieldId = '+fieldId +' adrs ='+adrs);
		document.getElementById(fieldId).value = adrs;
		if (fieldId == 'fullAddressNewCo') {
			clearInLineRowErrorWindow("fullAddressNewCo", "fullAddressNewCo", fieldIdToModelErrorRowAdSearch['newQuoteFullAddressNewCoCol']);
			//validFullAddress(this, "newQuoteFullAddressNewCoCol");
			
		} else if (fieldId == 'adressSelected') {
			clearInLineRowErrorWindow("adressSelected", "adressSelected", fieldIdToModelErrorHome['editClient']);
			isValidPrimaryAddress('adressSelected', 'editClient');
		}
	}
	$('.pac-container').hide();
}


function validateAddressNewCo(fullAddress) {
	var result = {};
	var data = {'fullAddress':fullAddress};
	
	var addrValidationURL = '/aiui/landing/validateFullAddress';
		
	var isConsumer = $('#isConsumer').val();
	if('Yes' == isConsumer){
		addrValidationURL = '/aiui/consumer/validateFullAddress';
	}
	
	data = parseManualAddrDQM(fullAddress, data);
	result['entry'] = data;
	$.ajax({
		headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
	    url: addrValidationURL,
		type : 'POST',
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
        async : false,

		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},
		success : function(data) {
			result['suggestions'] = data;
		},
		error : function(xhr, status, error) {
			alert(xhr + ", " + status + ", " + error);
		},
		complete : function() {
			$.unblockUI();
		}
	});
	return result;
}

function entryVsSuggestion(result, event){
	if(result.suggestions != null || result.suggestions.length > 0){
		$('#selectMine').unbind('click');
		$('#selectMine').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	return proceed(result.suggestions[0], event);
	    });
		$('#cancelButton').unbind('click');
		$('#cancelButton').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	$.unblockUI();
	    	return false;
	    });
		$('#selectSuggestion').unbind('click');
		$('#selectSuggestion').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	return proceed(result.suggestions[1], event);
	    });
		
		if(result.suggestions.length > 1){
			displayAddress('addressContents', result.suggestions);
			$('#confirmAddressDialog').modal('show');
		}
		else{
			return proceed(result.suggestions[0], event);
		}
	}
	else{
		alert('Address Validation returned emtpy list of addressses.');
	}
	return false;
}

function proceed(selectedAddress, event){
	var isConsumer = $('#isConsumer').val();
	//-- for consumer return the single selected address --
	if('Yes' == isConsumer){
		policyType = $('#consumerSelectedPolicyType').val();
		sendConsumerRating(policyType,selectedAddress)
		return;
	}
	else{
		ghFunctn = partial(submitNewQuoteDialog);
		url = document.actionForm.newQuoteHomeURL.value;
		document.newQuoteForm.action = url;
		
		console.log("selectedAddress is " + JSON.stringify(selectedAddress));
		var massagedAddress = updateSelectedAddress(selectedAddress);
		console.log("massagedAddress is " + JSON.stringify(massagedAddress));
		
		//var input = $("<input>").attr("type", "hidden").attr("name", "addressSelected").val(JSON.stringify(massagedAddress));
		//$('#newQuoteForm').append($(input));
		document.newQuoteForm.addressSelected.value = JSON.stringify(massagedAddress);
		console.log("addressSelected is " + document.newQuoteForm.addressSelected.value);
		
		var homePolicyObj = getHomePolicy();
		
		if($('#newQuoteForm [name="homePolicy"]').length) {
			$('#newQuoteForm [name="homePolicy"]').val(JSON.stringify(homePolicyObj));
		} else {
			var homePolicy = $("<input>").attr("type", "hidden").attr("name", "homePolicy").val(JSON.stringify(homePolicyObj));
			$('#newQuoteForm').append(homePolicy);
		}
		 
		var userDetailsObj = getUserDetails();
		if($('#newQuoteForm [name="userDetails"]').length) {
			$('#newQuoteForm [name="userDetails"]').val(JSON.stringify(userDetailsObj));
		} else {
			var homeUser = $("<input>").attr("type", "hidden").attr("name", "userDetails").val(JSON.stringify(userDetailsObj));
			$('#newQuoteForm').append(homeUser);
		}
		
		console.log('proceed returning');
		//Do not show save and exit for cross sell
		if (exitPromptRequired(false) && $('#crossSellFlag').val() != 'Yes') {
			showExitPrompt(ghFunctn, false, "", event, true);
			return false;
		} else {
			showLoadingMsg();
			submitNewQuoteDialog();
		}
		}
}

function updateSelectedAddress(selectedAddress){
	var address2, addressKey;
    
	var isConsumer = $('#isConsumer').val();
	var policyType = "HO4";
	
	policyType = $('input[name=policyTypeNewCo ]:checked').val();
	
	if('Yes' == isConsumer){
		console.log("<<-- is a consumer policy -->>");
		policyType = $('#consumerSelectedPolicyType').val();
	}
	
	if(policyType == "HO4" || policyType == "HO6"){
		addressKey = "";
		address2 = $('#aptNumberNewCo').val();
		address2 = address2.replaceAll('#','$10');
		console.log("HO4 policy must have apartment number");
	}else{
		address2 = selectedAddress.address2;
		
		if('Yes' == isConsumer){
			addressKey = document.homeForm.addressKey.value;
		}else{
			addressKey = document.newQuoteForm.addressKey.value;	
		}
		
		if(addressKey.length == 0){
			addressKey = selectedAddress.addressKey;
		}
		console.log("HO3 policy must have apartment number");
	}
	
	var address = new Object();
	address.addrLine1Txt = selectedAddress.address1;
	address.addrLine2Txt = address2;
	address.cityName = selectedAddress.city;
	address.stateCd = selectedAddress.state;
	address.zip=selectedAddress.zip;
	address.addressKey = addressKey;
	
	if(selectedAddress.fullAddress){
		address.fullAddress = selectedAddress.fullAddress;
	}else{
		if(address2.length > 0){
			address.fullAddress = selectedAddress.address1+','+address2+','+selectedAddress.city+','+selectedAddress.state+','+selectedAddress.zip;
		}else{
			address.fullAddress = selectedAddress.address1+','+selectedAddress.city+','+selectedAddress.state+','+selectedAddress.zip;
		}
	}
	
	console.log(" Address generated = "+JSON.stringify(address));

	return address;
}

function displayAddress(trId, result){
	var entry = result[0];
	var html = '<td id="addressEntered" style="border:1px solid #ccc; padding-left:10px;">';
	html += '<div>' + entry.address1 + '</div>';
//	html += '<div>' + entry.unit_number + '</div>';
	html += '<div>' + entry.city + '</div>';
	html += '<div>' + entry.state + '</div>';
	html += '<div>' + entry.zip + '</div>';
	html += '</td>';
	
	var suggestion = result[1];
	/*width:200px;*/
	html += '<td id="suggestedAddress" style=" border:1px solid #ccc; padding-left:10px;">';
	html += '<div>' + suggestion.address1 + '</div>';
//	html += '<div>' + suggestion.unit_number + '</div>';
	html += '<div>' + suggestion.city + '</div>';
	html += '<div>' + suggestion.state + '</div>';
	html += '<div>' + suggestion.zip + '</div>';
	html += '</td>';
	$('#'+trId).html(html);
}

function isCondoOwnersQuote(){
	var policyType = "";
	
	if($('#newQuoteDialog').hasClass('in')){
		policyType = $('input[name=policyTypeNewCo ]:checked').val();
	}else if($("#homePolicyForm")){
		policyType = $("#homePolicyForm").val();
	}
	
	var isConsumer = $('#isConsumer').val();
	if('Yes' == isConsumer){
		policyType = $('#consumerSelectedPolicyType').val() || $('#homePolicyForm').val();
	}
	
	if(policyType == "HO6"){
		return true;
	}else{
		return false;
	}
}
function callRedirecttoHomePolicyForms(action) {
	
		var homePolicyKey= document.getElementById("homePolicyKey").textContent;
		var homePolicyNumber= document.getElementById("policy_number").textContent;
		var homeCompanyCd= document.getElementById("homeCompanyCd").textContent;
		var isEndorsement= document.getElementById("isHomeEndorsement").textContent;
		var readOnlyMode= document.getElementById("isReadonly").value;
		
		if(homePolicyKey != "" && homePolicyKey != "" && homePolicyKey != undefined){
			action = action +("&homePolicyKey="+homePolicyKey);
		}
		if(readOnlyMode != "" && readOnlyMode != "" && readOnlyMode != undefined){
			action = action +("&readOnlyMode="+readOnlyMode);
		}
		if(homePolicyNumber != "" && homePolicyNumber != "" && homePolicyNumber != undefined){
			action = action +("&homePolicyNumber="+homePolicyNumber);
		}
		if(homeCompanyCd != "" && homeCompanyCd != "" && homeCompanyCd != undefined){
			action = action +("&homeCompanyCd="+homeCompanyCd);
		}
		if(isEndorsement != "" && isEndorsement != "" && isEndorsement != undefined){
			action = action +("&isEndorsement="+isEndorsement);
		}		
		
	       callGlobalHeaderAction(action);
}
