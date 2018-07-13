jQuery(document).ready(function() {
	// CAPTIVE
	if ($('#channelCd').val() != ''
		&& $('#channelCd').val().toUpperCase() == 'CAPTIVE') {
		$('#crossSell').hide();
		$('.crossSellBlock').hide();
	}

	// Call this on click of cross sell button on summary tab
	$('#crossSell').click(function() {
		callCrossSell();
	});

	// Call this after selecting one of the HO agent
	$('#crossSellSelect').click(function() {
		callCrossSell();
	});
});

//Call this function either on HO Select or if only 1 HO agency exist
function callCrossSell() {

	// PA Auto Cross Sell changes
	showLoadingMsg();
	$('#multiProfilesWithHome').val("false");
	$('#agencyProfileCS').val("");

	var crossSellHoQuoteNumber = $('#crossSellHoQuoteNumber').val();
	var homePolicyKey = $('#crossSellHoPolicyKey').val();

	if (crossSellHoQuoteNumber != null 
			&& crossSellHoQuoteNumber != "" 
			&& crossSellHoQuoteNumber != "undefined" 
			&& homePolicyKey != null && homePolicyKey != "") {
		editCrossSellQuote();
	} else {
		createCrossSellQuote();
	}
}

function editCrossSellQuote(){
	$('#crossSellFlag').val('Yes');
	var autoPolicyNumber = $('[name="policy.policyNumber"]').val();
	var homePolicyKey = $('#crossSellHoPolicyKey').val();
	var policyType = $('#policyForm').val();
	
	if ($('#primeHOStates').val().indexOf($('#stateCd').val()) > -1) {

		document.newQuoteForm.homePolicyKey.value = homePolicyKey;
		document.newQuoteForm.ratedSource.value = $('#hoQuoteRatedSource').val();
		document.newQuoteForm.autoPolicyNumber.value = autoPolicyNumber;
		document.newQuoteForm.autoPolicyKey.value = $('#policyKey').val();

		if($('#isBridged').val() === 'false') {
			// Suggest Address dialog
			if ($('#userAddressUpdated').val() == 'No') {
				if ((policyType == 'HO4' || policyType == 'HO6')) {

					var result = validateAddressNewCo($.trim($('#residentAddrLine1Txt')
							.val())
							+ ", "
							+ $('#residentCityName').val()
							+ ", "
							+ $('#residentStateCd').val() + " " + $('#residentZip').val());

					if (result.suggestions != null && result.suggestions.length > 1) {
						// For HO4 and HO6 , if Addresses suggestions are more than one ,
						// User can select address entry .
						var event = jQuery.Event(getSubmitEvent());
						entryVsSuggestion(result, event);
						return;
					}
				}
			}
			// SSN Dialog
			if ($('#crossSellUserSSNUpdated').val() == 'No') {
				if((policyType == 'HO4' || policyType == 'HO6') && $('#crossSellCreditCallStatus').val() == 'No Hit'){
					$('#crossSellUserSSNUpdated').val('Yes');
					$('#addPriorSsnNQ').modal('show');
					return;
				}
			}
		}

		if (homePolicyKey != "undefined" && homePolicyKey != "") {
			document.newQuoteForm.action = document.actionForm.editQuoteFromCrossSell.value;
			document.newQuoteForm.method = "POST";
			document.newQuoteForm.submit();
		}

	} else { /* Legacy */
		if (!isEmployee()) {
			homeProfile = getHomeProfileForCrossSell();
		}
		document.aiForm.action = "/aiui/summary/crosssell";
		document.aiForm.submit();
	}
}



function createCrossSellQuote() {

	var homeProfile;
	if(!isEmployee()){
		homeProfile = getHomeProfileForCrossSell();
	}

	if($('#primeHOStates').val().indexOf($('#stateCd').val()) > -1) {
		// user selected address in type ahead, no need to call DQM
		//var result = validateAddressNewCo("166 Magnolia DR, Chester Springs, PA 19425");
		var result = validateAddressNewCo($.trim($('#residentAddrLine1Txt').val())+", "+$('#residentCityName').val()+", "+$('#residentStateCd').val()+" "+$('#residentZip').val());
		setLOB();

		$('#stateNQ_hidden').val($('#stateCd').val());
		$('#policyEffectiveDateNewCo').val($('#policyEffDt').val());
		//$('#producerNewCoHidden').val("85963");
		$('#channelNewCo').val($('#channelCd').val());
		//$('#channelNewCo').val('DIRECT');
		$('#uwCompanyNewCo').val($('#homeUwCompanyCode').val());
		//$('#uwCompanyNewCo').val('ALN_PPCIC');
		$('#fiservIdNewCo').val($('#fiServId').val());
		$('#firstNameNewCo').val($('#applicantFirstName').val());
		$('#lastNameNewCo').val($('#applicantLastName').val());
		$('#dobNewCo').val($('#applicantBirthDate').val());
		var policyForm = $('#policyForm').val();
		if(policyForm == null || policyForm == undefined || policyForm == ''){
			policyForm = 'HO4';
		}
		$('#policyTypeNewCo').val(policyForm);	
		$('#homeStateCd').val($('#stateCd').val());
		$('#homeChannelCd').val($('#channelCd').val());
		$("#policyEffectiveDate").val($('#policyEffDt').val());
		$('#homeUWCompanyCd').val($('#homeUwCompanyCode').val());
		$('#homeCompanyCd').val($('companyCd').val());
		$('#crossSellFlag').val('Yes');
		companyId = $('#companyId').val();

		if(homeProfile != "undefined" && homeProfile != null) {

			$('#agencyLevelCodeNewCo').val(homeProfile.agencyId);
			$('#branchLevelCodeNewCo').val(homeProfile.branchId);
			$('#producerLevelCodeNewCo').val(homeProfile.producerId);

			$('#branchNewCoHidden').val(homeProfile.branchLevelCode);
			$('#agencyNewCoHidden').val(homeProfile.agencyHierarchyId);
			$('#producerNewCoHidden').val(homeProfile.producerLevelCode);


		} else {
			/* get from policy */
			$('#agencyLevelCodeNewCo').val($('#agencyId').val());
			$('#branchLevelCodeNewCo').val($('#branchId').val());
			$('#producerLevelCodeNewCo').val($('#producerId').val());

			$('#branchNewCoHidden').val($('#branchHierId').val());
			$('#agencyNewCoHidden').val($('#agencyHierId').val());
			$('#producerNewCoHidden').val($('#producerHierId').val());
		}

		//This is method created by PA Newco, we are calling that if its new policy
		var event = jQuery.Event(getSubmitEvent()); // resolve js exception where event wasn't defined.
		proceed(result.suggestions[0], event);

	} else { /* Legacy */
		document.aiForm.action = "/aiui/summary/crosssell";
		document.aiForm.submit();
	}


}

function getHomeProfileForCrossSell() {
	var strURL = "/aiui/landing/getNQAgencyProfiles";

	strURL = addRequestParam(strURL, "lob", "HO");
	strURL = addRequestParam(strURL, "state", $('#stateCd').val());

	var homeProfile;

	$.ajax({
		url : strURL,
		type : 'get',
		dataType : 'json',
		cache : false,
		async : false,
		beforeSend : function(status, xhr) {
			$('#multiProfilesWithHome').val("false");
			$('#agencyProfileCS').val("");
		},
		success : function(data) {
			var sValue;
			if (data.length > 0) {
				homeProfile = data[0];
				if (data.length > 1) {
					$.each(data, function(i) {
						if ($('#currentProfile').val() == data[i].agencyHierarchyId) {
							console
							.log("Current profile has Home access");
							homeProfile = data[i];
						}
					});
				}
				console.log(homeProfile);
				if (homeProfile != null) {
					sValue = homeProfile.agencyHierarchyId + ','
					+ homeProfile.companyId + ','
					+ homeProfile.channelCode;
					sValue = sValue + ',' + homeProfile.branchId + ','
					+ homeProfile.agencyId + ','
					+ homeProfile.producerId;
					sValue = sValue + ','
					+ homeProfile.companyCorporationId;
					console.log(sValue);
				}

				$('#agencyProfileCS').val(sValue);
			}
		},

		error : function(xhr, status, error) {
			console.log(error);
		},

		complete : function() {
			$.unblockUI();
			return homeProfile;
		}
	});

	return homeProfile;
}

function setLOB() {
	var lobVal = "HO,Yes";
	var strLOBDDOptions = $('#hiddenLob').text();
	strLOBDDOptions = "<option value=\"HO,Yes\">Home</option>";
	// reload LOB dropdown
	$('#lobNQ').html("");
	$('#lobNQ').append($(strLOBDDOptions));
	$('#lobNQ').val(lobVal);
	$('#lobNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
}

function getCrossSellHomePolicyKey(autoPolicyNumber) {
	var homePolicyKey = "";
	var strURL = addRequestParam("/aiui/policies/getCrossSellHomePolicyKey",
			"autoPolicyNumber", autoPolicyNumber);
	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url : strURL,
		type : "post",
		async : false,
		// callback handler that will be called on success
		success : function(response) {
			homePolicyKey = response;
		},
		// callback handler that will be called on error
		error : function(jqXHR, textStatus, errorThrown) {
			// alert('error accessing security database');
		},
		complete : function() {
			// $.unblockUI();
			return homePolicyKey;
		}
	});
	return homePolicyKey;
}

//Update Address
function proceedToUpdateAddr(selectedAddress, event) {
	console.log("selectedAddress is " + JSON.stringify(selectedAddress));
	var formattedAddress = updateSelectedAddress(selectedAddress);
	console.log("formattedAddress is " + JSON.stringify(formattedAddress));
	//document.aiForm.userSelectedAddress.value = JSON.stringify(formattedAddress);
	document.newQuoteForm.addressSelected.value = JSON.stringify(formattedAddress);;
	showLoadingMsg();
	$('#userAddressUpdated').val('Yes');
	editCrossSellQuote();
}

function entryVsSuggestion(result, event){
	if(result.suggestions != null || result.suggestions.length > 0){
		$('#selectMine').unbind('click');
		$('#selectMine').unbind('click').on("click", function() {
			$('#confirmAddressDialog').modal('hide');
			return proceedToUpdateAddr(result.suggestions[0], event);
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
			return proceedToUpdateAddr(result.suggestions[1], event);
		});

		if(result.suggestions.length > 1){
			displayAddress('addressContents', result.suggestions);
			$('#confirmAddressDialog').modal('show');
		}
		else{
			return proceedToUpdateAddr(result.suggestions[0], event);
		}
	}
	else{
		alert('Address Validation returned emtpy list of addressses.');
	}
	return false;
}