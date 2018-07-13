jQuery(document).ready(function() {	
	// PA Renters dialog - order credit
		$('.reOrderCredit').click(function(){
			reOrderCreditForHomeQuote();
    });
		
	/*$('#saveAddressDetailsNQ').click(function(){
		reOrderCreditForHomeQuoteForAddrNotFound();
    });*/
	
	$('.rateErrorMsg').click(function(){
		$('#rateError').modal('hide');
    });
	
	$('#cancelAddressDetailsNQ').click(function(){
		$('#addressNotFoundNQ').modal('hide');
    });
	
	$('.rateErrorMsgforHome').click(function(){
		$('#rateErrorForHomeowners').modal('hide');
		$('#newQuoteDialog').modal('show');
    });
	
	
	$("#addressYearBuilt_NQ").bind(validModalEventNewCo, function(event, result){
		if(!checkLengthYearBuilt(document.getElementById('addressYearBuilt_NQ'))){
			$('#addressYearBuilt_NQ_ERROR').text('Year Built is Invalid');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="red";
		}else{
			$('#addressYearBuilt_NQ_ERROR').text('');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="";
		}
	});
	
	$("#addressSquareFootage_NQ").bind(validModalEventNewCo, function(event, result){
		if(!checkCharsSquareFeet(document.getElementById('addressSquareFootage_NQ'))){
			$('#addressSquareFootage_NQ_ERROR').text('Square Feet is Invalid');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="red";
		}else{
			$('#addressSquareFootage_NQ_ERROR').text('');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="";
		}
	});
		
	
});

//CREDIT REORDERING LOGIC
function displayCreditErrWindow(errMsg,typeOfPolicy){
	console.log('displayCreditErrWindow');
	var policyType = typeOfPolicy;
	
	if(typeOfPolicy == undefined || typeOfPolicy == null || typeOfPolicy.length<1){
		policyType =$('input[name=policyTypeNewCo ]:checked').val();
	}
	
	if((policyType == 'HO4' || policyType == 'HO6') && errMsg == 'No Hit'){
		$('#addPriorSsnNQ').modal('show');
		// initAutocomplete(); // set google type ahead for prior address field
	}else if(errMsg == 'ratingError'){
		$('#rateError').modal('show');
	}else if(policyType == 'HO3' && errMsg == 'ratingErrorForAddrNotFound'){
		$('#addressNotFoundNQ').modal('show');
	}else if(policyType == 'HO3' && errMsg == 'rateErrorForHomeowners'){
		$('#rateErrorForHomeowners').modal('show');
	}else{
		submitNewHomeQuote(); // for now submit for HO3 but this will change with new credit window - JG
	}
}


function reOrderCreditForHomeQuoteForAddrNotFound(){
	var isConsumer = $('#isConsumer').val();
	var reOrderCredit = "No";
	var fname = 'newQuoteForm';
	var url = document.actionForm.reOrderHomeCreditURL.value;
	//consumer view
	if('Yes' == isConsumer){
		url = document.homeForm.reOrderHomeCreditConsumerURL.value;
		fname = 'homeForm';
	}
	
	console.log('isConsumer = '+isConsumer+' fname= '+fname+' url ='+url);
	
	var addressSquareFootage = $('#addressSquareFootage_NQ').val();
	var addressYearBuilt = $('#addressYearBuilt_NQ').val();
	var event = jQuery.Event(getSubmitEvent());
	var submitReorderDialog = true;
	var decLineMessageText = "This risk is ineligible for Plymouth Rock.";
	
	if(addressSquareFootage == ''){
			$('#addressSquareFootage_NQ_ERROR').text('Square Feet should not be empty.');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
	}else{
		var isAddressSquareFeetValid = checkCharsSquareFeet(document.getElementById('addressSquareFootage_NQ'));
		if(isAddressSquareFeetValid){
			$('#addressSquareFootage_NQ_ERROR').text('');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="";
			submitReorderDialog = true;
		}else{
			event.stopPropagation();
			submitReorderDialog = false;
		}
	}
	if(addressYearBuilt != ''){
		submitReorderDialog = false;
		var isAddressYearBuiltValid = checkYearBuilt(document.getElementById('addressYearBuilt_NQ'));
		var isAddressYearBuiltLength = checkLengthYearBuilt(document.getElementById('addressYearBuilt_NQ'))
		if(isAddressYearBuiltLength){
			if(isAddressYearBuiltValid ){
				submitReorderDialog = true;
			}else{
				$('#declineMessage').show();
				$('#declineMessage').addClass('left applicationNav alert alert-info hardAlert');
				$('#declineMessage').text(decLineMessageText);
				$('#addressNotFoundNQ_infoModal').addClass('height-70');
				disableAddrNotFoundFields();
				submitReorderDialog = false;
			}
		}
	
	}else{	
			$('#addressYearBuilt_NQ_ERROR').text('Year Built Should not be empty');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
	}
	
	if(submitReorderDialog){
		if(addressSquareFootage != '' && addressYearBuilt != ''){
			reOrderCredit = "Yes";
		}		
		
		if(event.isPropagationStopped()) {
			$.unblockUI();
		}else{
			$('#addressNotFoundNQ').modal('hide');
			showLoadingMsg();
			document.getElementById(fname).addressSquareFootageHome.value = addressSquareFootage;
			document.getElementById(fname).addressYearBuiltHome.value = addressYearBuilt;
			document.getElementById(fname).reOrderCreditHome.value = reOrderCredit;
			
			//for new home
			if(fname == 'newQuoteForm'){
				document.getElementById(fname).autoPolicyNumber.value = $('#policyNumber_Policy').val();
				document.getElementById(fname).autoPolicyKey.value = $('#policyKey').val();
				document.getElementById(fname).crossSellFlag.value = $('#crossSellFlag').val();
			}
			
			document.getElementById(fname).action= url;
			document.getElementById(fname).submit();	
		}
	}else{
		return;
	}
}

function submitNewHomeQuote(){
	var isConsumer = $('#isConsumer').val();
	console.log('... submitNewHomeQuote ...');
	var url = document.actionForm.homeQuoteTabURL.value;
	var fname = 'newQuoteForm';
	if('Yes' == isConsumer){
		url = document.homeForm.homeConsumerQuoteTabURL.value;
		fname = 'homeForm';
	}
	
	console.log('url = '+url);
	console.log('fname = '+fname);
	
	var event = jQuery.Event(getSubmitEvent());
	
	if(event.isPropagationStopped()) {
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.getElementById(fname).action= url;
		document.getElementById(fname).submit();
	}
}


function chkCreditIssueForHome() {
	var errMsg = '';
	var isConsumer = $('#isConsumer').val();
	
	var addressSelected = document.newQuoteForm.addressSelected.value;
	var homePolicy = document.newQuoteForm.homePolicy.value;
	var userDetails = document.newQuoteForm.userDetails.value;
	
	
	var strURL = addRequestParam(document.actionForm.newQuoteHomeURL.value, "addressSelected", addressSelected);
	strURL = addRequestParam(strURL, "homePolicy", homePolicy);
	strURL = addRequestParam(strURL, "userDetails", userDetails);

	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url: strURL,
        type: 'get',
		dataType: 'json',
		cache: false, 
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		success: function(data) {
			errMsg = data.message;
			errMsg = errMsg.replace(/\\/g,'\\');
		},
		error: function(xhr, status, error) {
			//alert('error');
		},
		complete : function() {
			displayCreditErrWindow(errMsg);
			$.unblockUI();
		}
	});
}


/*function initAutocomplete() {
	var fieldId;
	
	if($('#newQuoteDialog').hasClass('in') && !isRentersNQ()){
		return;
	}
	
	if($('#newQuoteDialog').hasClass('in')){
		fieldId = "fullAddressNewCo";
	}else{
		fieldId = "prioraddr_PRIMARY_INSURED_NQ";
	}
	
	var input = document.getElementById(fieldId);
	
	// Create the autocomplete object, restricting the search to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
	*//** @type {!HTMLInputElement} *//*
	(input), {
		types : [ 'geocode' ],
		componentRestrictions : countryRestrict
	});
	
	if(typeof autocomplete != "undefined"){
		// When the user selects an address from the dropdown, populate the address fields in the form.
		autocomplete.addListener('place_changed', fillInAddress);
		
		// this code prevents form from being submitted if user makes selection by hitting enter
		google.maps.event.addDomListener(input, 'keydown', function(e) { 
		   if (e.keyCode == 13) { 
			   e.preventDefault(); 
		    }
		}); 
	}
}*/

function reOrderCreditForHomeQuote(){
	
	//consumer view variance
	var isConsumer = $('#isConsumer').val();
	
	var reOrderCredit = "No";
	
	var url = document.actionForm.reOrderHomeCreditURL.value;
	var fname = 'newQuoteForm';
	
	if('Yes' == isConsumer){
		url = document.homeForm.reOrderHomeCreditConsumerURL.value;
		fname = 'homeForm';
	}
	
	var ssn = $('#ssn_PRIMARY_INSURED_NQ').val();
	var priorAddr = $('#prioraddr_PRIMARY_INSURED_NQ').val();
	var event = jQuery.Event(getSubmitEvent());
	
	//when ssn is removed from ssn text input , remove hidden ssn field.
	var maskedSsn = $('#mask_ssn_PRIMARY_INSURED_NQ').val();
	if(maskedSsn == null || maskedSsn == undefined || maskedSsn.length<1){
		ssn = '';
	}
	
	var submitReorderDialog = true;
	if(ssn != ''){
		var isSSnValid = validSSNHome(document.getElementById('ssn_PRIMARY_INSURED_NQ'));
		if(!isSSnValid){
			$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('Invalid ssn');
			document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
		}else{
			$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('');
			document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="";
		}
	}else{
		$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('');
		document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="";
	}
	
	
	if(priorAddr != ''){
		var fullAddress =priorAddr;
		var data = {'fullAddress':fullAddress};
		data = parseManualAddrDQM(fullAddress, data);
		//var streetNum = data["street_number"];
		var street = data["route"];
		var city = data["locality"];
		// var state = data["administrative_area_level_1"];
		var zip = data["postal_code"];
		//dont check state
		//Temporary Solution to validate Zip according to length 
		if(street == "" || city == "" || zip == "" || (! isValidateZipPrevAddr(zip)) || (! isValidateCityPrevAddr(city))){
			$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('Invalid address');
			document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
		}else{
			$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('');
			document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="";
		}
	}else{
		$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('');
		document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="";
	}
	
	if(submitReorderDialog){
		if(ssn != '' || priorAddr != ''){
			 reOrderCredit = "Yes";
		}
		
		$('#addPriorSsnNQ').modal('hide');
		
		if(event.isPropagationStopped()) {
			$.unblockUI();
		}else{
			showLoadingMsg();
			document.getElementById(fname).ssnPrimInsuredHome.value = ssn;
			document.getElementById(fname).priorAddrHome.value = priorAddr;
			document.getElementById(fname).reOrderCreditHome.value = reOrderCredit;
			
			if(fname == 'newQuoteForm'){
				document.getElementById(fname).autoPolicyNumber.value = $('#policyNumber_Policy').val();
				document.getElementById(fname).autoPolicyKey.value = $('#policyKey').val();
				document.getElementById(fname).crossSellFlag.value = $('#crossSellFlag').val();
			}
			document.getElementById(fname).action= url;
			document.getElementById(fname).submit();	
		}
	}else{
		return;
	}
}

function validSSNHome(elm){
	var ssn = $.trim(elm.value);
	if (ssn.length == 9) {
		ssn = ssn.substring(0,3) + '-' + ssn.substring(3,5) + '-' + ssn.substring(5,9);
	}
	var matchArr = ssn.match(/^(\d{3})-?\d{2}-?\d{4}$/);
	var numDashes = ssn.split('-').length - 1;
	var errMsg = "";
	
	if((ssn == "") || (ssn.substr(6,5) == "-****")||((isEndorsement() && ssn.substr(5,4) == "****" ))) {return false;}
	else {
		if(!/^(\d{3})-?\d{2}-?\d{4}$/.test(ssn)){
			errMsg = 'SSN is Invalid regEx';
		}
		if (numDashes == 1) 
			errMsg = 'SSN must be 9 digits';
		else if (ssn.substr(0,1) == 9)
			errMsg = 'SSN cannot begin with a 9';	
		else if ((ssn.substr(4,1) == 0 ) &&  (ssn.substr(5,1) == 0 ))
			errMsg = 'Positions 4 and 5 cannot be 00 in SSN.';
		else if ((ssn.substring(0,1) == ssn.substring(1,2)) && (ssn.substring(1,2) == ssn.substring(2,3)) && (ssn.substring(2,3) == ssn.substring(4,5)) && (ssn.substring(4,5) == ssn.substring(5,6)) && (ssn.substring(5,6) == ssn.substring(7,8)) && (ssn.substring(7,8) == ssn.substring(8,9))  && (ssn.substring(8,9) == ssn.substring(9,10))  && (ssn.substring(9,10) == ssn.substring(10,11)) )
			errMsg = 'SSN cannot consist of equal numbers';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)) 
			errMsg = 'Reverse sequential series of numbers are not valid in SSN';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)) 
			errMsg = 'Sequential series of numbers are not valid in SSN';	
	
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if (errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == -1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == 1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		if(errMsg != ""){ 
			return false;
			}
		else {return true;}
	}
}



function disableAddrNotFoundFields(){
	$("#addressYearBuilt_NQ, #addressSquareFootage_NQ").prop("disabled", true);
	$("#saveAddressDetailsNQ").prop("disabled", true);
	
}
function checkYearBuilt(elm){
	var addressYearBuilt = $.trim(elm.value);

	if(addressYearBuilt == "" ) {return false;}
	else {		
		if(addressYearBuilt >= 1870){ 
			return true ;
			}
		else {return false;}
	}
}

function checkLengthYearBuilt(elm){
	var addressYearBuilt = $.trim(elm.value);
	if(addressYearBuilt.length >= 1){
		if(!/^\d{4}$/.test(addressYearBuilt)){
			return false;
		}else {
			return true;
		}
	}else return true;	
}

function checkCharsSquareFeet(elm){
	var addressSquareFeet = $.trim(elm.value);
	var checkZero = 0;
	if(addressSquareFeet.length >= 1){
		if(addressSquareFeet === String(checkZero)){
			return false;
		}
		else if(!/^\d+$/.test(addressSquareFeet)){
			return false;
		}else {
			return true;
		}
	}else return true;	
}
