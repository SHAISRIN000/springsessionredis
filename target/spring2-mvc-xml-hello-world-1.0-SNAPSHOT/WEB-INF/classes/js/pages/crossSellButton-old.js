jQuery(document).ready(function() {

	//CAPTIVE
	if($('#channelCd').val()!='' && $('#channelCd').val().toUpperCase() == 'CAPTIVE'){
		$('#crossSell').hide();
		$('.crossSellBlock').hide();
	}

	//Call this on click of cross sell button on summary tab
	$('#crossSell').click(function(){
		callCrossSell();
	});


	//Call this after selecting one of the HO agent
	$('#crossSellSelect').click(function(){
		callCrossSell();
	});
});

//Call this function either on HO Select or if only 1 HO agency exist
function callCrossSell(){

	//PA Auto Cross Sell changes
	showLoadingMsg();
	$('#multiProfilesWithHome').val("false");
	$('#agencyProfileCS').val("");

	var crossSellHoQuoteNumber = $('#crossSellHoQuoteNumber').val();

	if(crossSellHoQuoteNumber != "undefined" && crossSellHoQuoteNumber != "") {
		editCrossSellQuote();
	} else {
		createCrossSellQuote();
	}

}


function editCrossSellQuote() {
	if($('#stateCd').val()=='PA') {
		var autoPolicyNumber = $('[name="policy.policyNumber"]').val();
		var homePolicyKey = $('#crossSellHoPolicyKey').val();

		if(homePolicyKey != "undefined" && homePolicyKey != ""){
			document.aiForm.action = "/aiui/redirectHome/nb/home/policy/crossselledit?homePolicyKey="+homePolicyKey+"&autoPolicyNumber="+autoPolicyNumber+"&autoPolicyKey="+$('#policyKey').val();
			document.aiForm.method="POST";
			document.aiForm.submit();
		}
	} else { /* Legacy */
		if(!isEmployee()){
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

	if($('#stateCd').val()=='PA') {
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
		if($('#residenceType').val() == 'HOME'){
			$('#policyTypeNewCo').val('HO3');	
		} else if($('#residenceType').val() == 'CONDO'){
			$('#policyTypeNewCo').val('HO6');	
		}else{
			$('#policyTypeNewCo').val('HO4');	
		}			 	
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
		url: strURL,
		type: 'get',
		dataType: 'json',
		cache: false, 
		async:false,
		beforeSend: function(status, xhr){
			$('#multiProfilesWithHome').val("false");
			$('#agencyProfileCS').val("");
		},

		success: function(data){

			var sValue;

			if(data.length > 0) {

				homeProfile = data[0];

				if(data.length > 1) {	
					$.each(data, function(i) {
						if( $('#currentProfile').val() == data[i].agencyHierarchyId){
							console.log("Current profile has Home access");
							homeProfile = data[i];
						}
					});
				}

				console.log(homeProfile);

				if(homeProfile != null) {
					sValue = homeProfile.agencyHierarchyId + ',' +  homeProfile.companyId + ',' + homeProfile.channelCode;						
					sValue = sValue + ',' + homeProfile.branchId + ',' + homeProfile.agencyId + ',' + homeProfile.producerId;
					sValue = sValue + ',' + homeProfile.companyCorporationId;
					console.log(sValue);
				}

				$('#agencyProfileCS').val(sValue);
			}
		},

		error: function(xhr, status, error){
			console.log(error);
		},

		complete: function(){
			$.unblockUI();
			return homeProfile;
		}
	});	

	return homeProfile;
}

function getCrossSellHomePolicyKey(autoPolicyNumber){
	var homePolicyKey = "";
	var strURL = addRequestParam("/aiui/policies/getCrossSellHomePolicyKey", "autoPolicyNumber", autoPolicyNumber);
	$.ajax({
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		url: strURL,
		type: "post",
		async:false,
		// callback handler that will be called on success
		success: function(response){
			homePolicyKey = response;
		},
		// callback handler that will be called on error
		error: function(jqXHR, textStatus, errorThrown){
			// alert('error accessing security database');
		}
		,
		complete: function(){
			//	$.unblockUI();
			return homePolicyKey;
		}
	});
	return homePolicyKey;
}
