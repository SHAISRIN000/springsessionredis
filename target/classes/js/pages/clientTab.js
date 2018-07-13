jQuery(document).ready(function() {
	var isRated =  $('#ratedInd').val();
	var pre_repsonse_id = $('#PREFILL_ResponseId').val();

	if(pre_repsonse_id !=null && pre_repsonse_id !='' && pre_repsonse_id !=undefined){
		$('.preFillFullXML').show();
	}
	else{
		$('.preFillFullXML').hide();
	}
	
	/* Leave space for fixed Complete "so & so" application message */
	if($('#completeApplicationAlert').length == 1 || $('#crnLinkHolder').length ==1) {
		$('#mainContent').css('padding-top', '20px');
	}
	
	/* tabIndex fix for logo - Remove this block when logo taxIndex is corrected for all pages via pure html */
	$('#logo').parent().attr('tabIndex', 6);
	
	$('#tabPanel .tabNextButton:last').keyup(function(e){
		if(e && e.keyCode && e.keyCode == 9) {
			$(window).scrollTop('#mainContent');
			e.preventDefault();
			return false;
		}
	});
	
	 var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 if($('#compraterTransactionStatus').val() != 'HALF_BRIDGE'){
			 $('#quoteError').modal('show');
		 }
	 }
	 
	 $(".submitClient").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/client';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	 
	if (!isEndorsement()) {
		bindViewPrefillDataLink();
	}
	 
	//creating another page will not identify the context path appropriately
	var ctxP = $('#ctxPath').val();
	var imgPath = window.location.protocol + "//" + window.location.host+ctxP;
	
	// Client-related functionality for Teachers Eligibility
	//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
	if(!isQuote()){
		if($('#uwCompanyCd').val() != 'ALN_TEACH'){
			 $('.teachersEligibilitysection').addClass('hidden');
			 $('.teachersEligibilitysectionlower').addClass('hidden');
			$('#eligibilityInd').val('');
			validateTeachersEligiblityGroup();
			validateTeachersEligiblityDistrict();
			validateTeachersEligiblityInstitution();
		}else{
			//expandEligibilityDropdown('eligibilityYes');
		}
	}
	
	$("#clientEligibilityGroupId").change(function () {
		updateEligibilty();
		resetPremiumForAll();
		validateTeachersEligiblityGroup();
	});
	
	
	$(".eligibilityRadio").click(function () {
		var rowPrefix = $(this).attr('id');
		expandEligibilityDropdown(rowPrefix);
		if(rowPrefix == 'eligibilityYes'){
			lookupEligibilityGroups();
		}
		resetPremiumForAll();
	});
	
	$("#clientDistrictTownId").change(function () {
		updateDistrict();
		resetPremiumForAll();
		validateTeachersEligiblityGroup();
		validateTeachersEligiblityDistrict();
	});

	$("#clientInstitutionNameId").change(function () {
		updateInstitution();
		resetPremiumForAll();
		validateTeachersEligiblityInstitution();
    });

	$("#clientEligibilityGroupId").blur(function () {
		validateTeachersEligiblityGroup();
		$(this).removeClass('preRequired');
	});

	$("#clientDistrictTownId").blur(function () {
		validateTeachersEligiblityGroup();
		validateTeachersEligiblityDistrict();
		$(this).removeClass('preRequired');
	});

	$("#clientInstitutionNameId").blur(function () {
		validateTeachersEligiblityInstitution();
		$(this).removeClass('preRequired');
    });
	
	//TD# 56121 - on change, the rate has to be inactive if rated already
	$("#priceTransferLevelCredit").change(function () {
		resetPremiumForAll();		
    });
	
	//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
	if(!isQuote()){	
	if ($('#eligibilityInd').val()) {
		lookupEligibilityGroups();
		restoreEligibility($('#eligibilityInd').val(), $('#clientInstitutionId').val());
	} else {
		$('#eligibilityInd').val('No');
		$('#clientInstitutionId').val('');
	}
	}
	//if channel = 'IA' hide ReferralSourceCd
	if($('#policyChannelCd').val() == "IA"){
		$('.clsReferralSourceCd').hide();
	}
	
	$('#salesProgramOverride').prop('disabled',true);
	$('#salesProgram').prop('disabled',true).trigger("chosen:updated");

	//Update the drop down based on the values returned for NB ,display the literal value in ENDT 
	if(!isEndorsement()) {
		// Defect# Fix 50080
		/*var producerSelected = $('#policyProducerInput option:selected').val();
		
		if(producerSelected.length > 1){
			performProducerPostSelection(producerSelected,'policyProducerInput');
		}*/
		var isDisabled = $('#policyProductCd').is(":disabled");
		$('#policyProductCd').prop('disabled',false).trigger("chosen:updated");

		if($('#policyProductCd').hasClass('inlineError')){
			$('#policyProductCd').val('').trigger("chosen:updated");
		}

		$('#policyProductCd option').each(function() {
			if($(this).text() == 'Teachers Personal Auto'){
				$(this).replaceWith('<option value="ALN_PA" data-support="Teachers">Teachers Personal Auto</option>');
			}else{
				$(this).replaceWith('<option value="ALN_PA" data-support="Prime">Personal Auto</option>');
			}
		});
		if($('#uwCompanyCd').val() == 'ALN_TEACH'){	
			$('#policyProductCd option').filter(function() { 
				return ($(this).text() == 'Teachers Personal Auto');
			}).prop('selected', true);
		}
		$('#policyProductCd').prop('disabled',isDisabled).trigger("chosen:updated");	
		
		if($("#transactionProgress").val() != '' && $("#empType").val() == 'A' && $.trim($('#agency_hier_id option:selected').text()) == "--Select--") {
		//if($('#firstTimeThru').val() == 'false' && $("#empType").val() == 'A' && $.trim($('#agency_hier_id option:selected').text()) == "--Select--"){
			var agencySelectorFlag = false;
			var agencySelectorFlag1 = false;
			$('#agency_hier_id option').filter(function() { 
				agencySelectorFlag = $(this).text() == $.trim($('#policyProducerInput option:selected').text());
				if(agencySelectorFlag) {
					agencySelectorFlag1 = true;
				}
				return agencySelectorFlag;
				//return ($(this).text() == $.trim($('#policyProducerInput option:selected').text()));
			}).prop('selected', true);
			
			if(!agencySelectorFlag1){
				$('#agency_hier_id option').filter(function() {
					if($(this).val() == $.trim($('#clientInfoIdentifier').val()) && $(this).data('support') == 'l2'){
						return true;
					}else
					return false;
				}).prop('selected', true);
		}
			$('#agency_hier_id').trigger("chosen:updated");
		}
	}else {
		if($('#uwCompanyCd').val() == 'ALN_TEACH'){	
			$('.clsClientEndrProduct').text('Teachers Personal Auto');
		}
	}
	
	
	if($("#transactionProgress").val() != '' && $("#ratedInd").val() != "Yes" && $('#policyProducerInput').find("option").length > 2){
	//if($('#firstTimeThru').val() == 'false' && $("#ratedInd").val() != "Yes" && $('#policyProducerInput').find("option").length > 2){
		$('#policyProducerInput').prop('disabled',false).trigger("chosen:updated");
	}
	
	//Protection Rules for Client Page Fields//
	//if($('#firstTimeThru').val() != 'true'){
	if($("#transactionProgress").val() != ''){
		//$('#policyStateCd').prop('disabled',true).trigger("chosen:updated");
		if( ($("#priorRatedPremAmt").val() != "" && $("#ratedInd").val() == "Yes")){
			protectedFields(true);
		}
		//vmaddiwar - TD 50143 fix - Bridged Quote The Agency Profile, Producer and Product fields are locked down prior to first rate in AI.
		//For Comprater if its Rated from AI ratedSource turns to 'DIRECT' else will remain CompRater
		if($("#ratedSource").val() == "CompRater"){
			protectedFields(false);
		}
	}
	
	//55489-Comp rater bridged quote garaging city/town error upon bridge
	if(isMaComparator()){
		var zip = $('#zip').val();
		if(zip != null && zip!= undefined && zip.length == 5){
			//55489- also update the DB for ALternate garage town- some comparator flow where user lands on client directly..
			updateAltGarageTowns(zip);
		}
	}
		
	if($.trim($('#policyProducerInput option:selected').text()) == $.trim($('#agency_hier_id option:selected').text()) && $('#policyProducerInput').val() != ''){
		$('#policyProducerInput').prop('disabled',true).trigger("chosen:updated");
	}
	
	$("span#addr_ln_1,span#addr_ln_2,span#pri_Fname,span#sec_Fname,span#pri_Mname,span#sec_Mname,span#pri_Lname,span#sec_Lname").bind('mouseover', function(){
		var element = $(this).find('input');
		showFieldValueInTooltip(this,element);
	});
	
	$("span#addr_ln_1,span#addr_ln_2,span#pri_Fname,span#sec_Fname,span#pri_Mname,span#sec_Mname,span#pri_Lname,span#sec_Lname").bind('mouseout', function(){
		hideToolTip(this);
	});
		
	 $('#currentReportRequiredIndicator_chosen  input[type="text"]').on('keydown', function(event){
		 var keyCode = event.keyCode || event.which;
		if(keyCode == 9 && event.shiftKey) {
			window.scrollTo(0,0);
		};
	}); 
	 
	//for endorsement
	$("span#mailing_addr_ln_1,span#mailing_addr_ln_2").bind('mouseover', function(){
		var element = $(this).find('input');
		showFieldValueInTooltip(this,element);
	});
	
	$("span#mailing_addr_ln_1,span#mailing_addr_ln_2").bind('mouseout', function(){
		hideToolTip(this);
	});
	
	
	var comp_cd = $('#companyCd').val();
	if(comp_cd!=null && comp_cd !=undefined && comp_cd!='')
	{
		$('#policyCompanyCd').val(comp_cd);
	}

	//Endorsement addressOnVehIdCard
	var addVehIdCard = $('#addressOnVehIdCard').val();
	if(addVehIdCard !=null && addVehIdCard !=''){
	if(addVehIdCard == 'P'){
			$('input:radio[id=mailingAddressOnVehIdCard]').attr('checked',false);
			$('input:radio[id=residenceAddressOnVehIdCard]').attr('checked',true);
		}
	if(addVehIdCard == 'M'){
			$('input:radio[id=residenceAddressOnVehIdCard]').attr('checked',false);
			$('input:radio[id=mailingAddressOnVehIdCard]').attr('checked',true);
		}
	}

	$('#mailingAddressOnVehIdCard').on("click",function(){
		$('#addressOnVehIdCard').val('M');
	});

	$('#residenceAddressOnVehIdCard').on("click",function(){
		$('#addressOnVehIdCard').val('P');
	});

	//44742 -Drivers>Delete Named Insured: trying to delete PNI on Client tab and delete button is active - per Fields it should not be when only 1 NI listed
	var secInsuredParticipantId= $("#secondary_insured_participantId").val();
	var secInsOperation = $("#secondary_insured_operation").val();
	if((secInsuredParticipantId == null || secInsuredParticipantId == undefined || secInsuredParticipantId == 0 || secInsuredParticipantId == "") && secInsOperation !='ADD'){
		$(".secondaryInsured").hide();
		$("#addCoApplicant").show();
		$("#addCoApplicant_disable").hide();
	    $('#deletePrimaryApplicantIcon').hide();
		$("#disableCoApplicantValidation").val("Yes");
	}
	else{
		$(".secondaryInsured").show();
		$("#addCoApplicant").hide();
		$("#addCoApplicant_disable").show();
	    $('#deletePrimaryApplicantIcon').show();
		$("#disableCoApplicantValidation").val("No");
	}
	
	var userAction = $('#landingBubbleEndorsementUserAction').val();

	if(userAction!=null){
		if(userAction == EndorsementUserAction.UpdateMailingAddress){
			$("#mailingAddrLine1Txt").focus();
		}
		if(userAction == EndorsementUserAction.UpdateContactInformation){
			$("#addrLine1Txt").focus();
		}
		if(userAction == EndorsementUserAction.AddNamedInsured){
			//secondaryApplicantAddInit();
			secondaryApplicantEndBubbleAddInit();
			//$('#secondary_insured_firstName').focus();
		}
		if(userAction == EndorsementUserAction.UpdateNamedInsured || userAction == EndorsementUserAction.DeleteNamedInsured){
			$('#primary_insured_firstName').focus();
		}
	}

	
	if ( $('#readOnlyMode').val() != 'Yes' ) { 
		//New Quote Set policy effective date
		var effectiveDate = getPolEffDate($('#policyEffectiveDate').val());
		if(effectiveDate!=null && effectiveDate.length == 10 && hasValidParamsSecurityDate()){
				policyEffectiveDateChanged($("#policyEffectiveDate"));
		//calculatePolicyExpiryDate();
		}
	}
	//ctrl+a -17  65/97
	 errorMessages = jQuery.parseJSON($("#errorMessages").val());
	
	
	//40749- All Quotes - Issued policy with insured undefined, undefined.
	 var pri_ins_fname = $('#primary_insured_firstName').val();
	 var pri_ins_lname = $('#primary_insured_lastName').val();
	 if(pri_ins_fname !=null || $.trim(pri_ins_fname) !='' || typeof pri_ins_fname != undefined){
		 	$('#applicant_first_name').text(pri_ins_fname);
	 }
	 if(pri_ins_lname !=null || $.trim(pri_ins_lname) !='' || typeof pri_ins_lname != undefined){
		 	$('#applicant_last_name').text(pri_ins_lname);
	 }
	 
	 var polEff = getPolEffDate($('#policyEffectiveDate').val());
	 if(polEff!=null && polEff.length>=9){
		 $('#effective_date').text(polEff);
	 }

	 $.fn.getCursorPosition = function() {
	        var el = $(this).get(0);
	        var pos = 0;
	        if('selectionStart' in el) {
	            pos = el.selectionStart;
	        } else if('selection' in document) {
	            el.focus();
	            var Sel = document.selection.createRange();
	            var SelLength = document.selection.createRange().text.length;
	            Sel.moveStart('character', -el.value.length);
	            pos = Sel.text.length - SelLength;
	        }
	        return pos;
	    }

	 $.caretTo = function (el, index) {
		 if (el.createTextRange) {
		 var range = el.createTextRange();
		 range.move("character", index);
		 range.select();
		 } else if (el.selectionStart != null) {
		 el.focus();
		 el.setSelectionRange(index, index);
		 }
		 };

		 // Set caret to a particular index
		 $.fn.caretTo = function (index, offset) {
		 return this.queue(function (next) {
		 if (isNaN(index)) {
		 var i = $(this).val().indexOf(index);
		 if (offset === true) {
		 i += index.length;
		 } else if (offset) {
		 i += offset;
		 }
		 $.caretTo(this, i);
		 } else {
		 $.caretTo(this, index);
		 }
		 next();
		 });
		 };

		 // Set caret to beginning of an element
		 $.fn.caretToStart = function () {
		 return this.caretTo(0);
		 };

		 // Set caret to the end of an element
		 $.fn.caretToEnd = function () {
		 return this.queue(function (next) {
		 $.caretTo(this, $(this).val().length);
		 next();
		 });
		 };

	 //destroy selectBox drop down plugin?Yes
	//$("SELECT").selectBoxIt('destroy');

	$(".closeModal").click(function(){
        $(".modal").modal('hide');
	});

	$("#removeCoAppNo").click(function(){
		$(".modal").modal('hide');
	});

	//what is this fix doing ?
	
	//Fix:diasbled city name gets lost during page navigation
	var cityNameAddr = $('#addressCity').val();
	var cityListSize = $('#cityListSize').val();
	if(cityNameAddr!=null && cityNameAddr!=undefined && cityNameAddr.length>1){
		if(cityListSize !=null && cityListSize !='' && cityListSize != undefined && 
		(parseInt(cityListSize)<2)){
		$('#cityName').empty();
		$('#cityName').prop('disabled', false);
		 $('#cityName').append($("<option></option>")
			          .attr("value", cityNameAddr)
			          .text(cityNameAddr).attr('selected','selected'));
		 $('#cityName').prop('defaultValue',cityNameAddr);
		 $('#cityName').prop('disabled', true);
		 $("#cityName").trigger('chosen:updated');
		}
		else{
			if ($("#cityName option[value='"+cityNameAddr+"']").length != 0){
				  	$('#cityName').attr("value", cityNameAddr).attr('selected','selected');
					$('#cityName').prop('defaultValue',cityNameAddr);
					$("#cityName").trigger('chosen:updated');
			}
		}
	}
	
	//endorsement city name enablement
	var mailingCityNameAddr = $('#mailingAddressCity').val();
	var mailingCityListSize = $('#mailingCityListSize').val();
	
	//mailing address state not displaying value inspite of being present
	var mailingAddressState = $("#mailingAddressState").val();
	if(!isValidValue(mailingAddressState)){
		//Replaced NJ with !MA
		//TD 62823 - All States - Mailing Address edit - When ZIP Code entered is not on the RATABLE Zips Table
		$('#mailingCityName').hide();
		$('#mailingCityName_chosen').addClass('chosenDropDownHidden');
		$("#mailingCityName").trigger('chosen:updated');
		$('#mailingCityName_FreeForm').show();
		$('#mailingCityName_FreeForm').val(mailingCityNameAddr);
		$('#mailingStateCd').prop('disabled', false).trigger('chosen:updated');

	}
	
	if(isEndorsement()) {
		
		if($('#uwCompanyCd').val() == 'ALN_TEACH' ){
			$('#eligibilityGroup').addClass('required');
		}
		
		var eligibilityGroup = $('#eligibilityGroup').val();
		
		if(eligibilityGroup == 'COLLEGE' ||  eligibilityGroup == 'SBM' || eligibilityGroup == 'CSE' || eligibilityGroup == 'RR'||
				eligibilityGroup == 'PTA' ||eligibilityGroup == 'OM' ){
			$('.town_row').addClass('hidden');
			$('#districtOrTownTxt').val('');
		} else {
			$('.town_row').removeClass('hidden');
		}
		
		if(eligibilityGroup == 'RR'){
			$('.institutionName_Row').addClass('hidden');
			$('#institutionNameTxt').val('');
		} else {
			$('.institutionName_Row').removeClass('hidden');
		}
	}
	
	var empType = $("#empType").val();
	$("input[id=updateUserTypeCd]").setValue(empType);

	$("#removeCoAppYes").click(function(){
		$("#secondary_insured_operation").val("DELETE");
	    $('.secondaryInsured').hide();
	    $("#addCoApplicant").show();
	    $("#addCoApplicant_disable").hide();
	    $('#deletePrimaryApplicantIcon').hide();
	 	$("#disableCoApplicantValidation").val("Yes");
	 	resetCoApplicant();
		$(".modal").modal('hide');
		if(isRated == 'Yes')
			{
				var originalPremAmt = $('#premAmt').val();
				resetPremium(isRated,originalPremAmt);
			}
		if(isEndorsement()) {
			var originalPremAmt = $('#premAmt').val();
			resetPremium(isRated,originalPremAmt);
		}		
		//52378 - RMV lookup button is deactivated after removing a co applicant
		//if($('#firstTimeThru').val()!='true'){
		if($("#transactionProgress").val() != ''){
			//enableRMVButton(isRiskStateMA() && $('#primary_insured_rmvLookupInd').val()!='Yes' && checkIfAtleastOneMAInsuredExists());
			//#56001....check driver status also...Rmv lookup button display should behave as same as driver page
			enableRMVButton(isRiskStateMA() && $('#primary_insured_rmvLookupInd').val()!='Yes' && isApplicantDriverEligibleForRmvLookUp($('#primary_insured_driverStatusCd').val()) && checkIfAtleastOneMAInsuredExists());
		} else{
			if($('#primary_insured_rmvLookupInd').val()!='Yes'){
				if($('#primary_insured_licenseState').val() == 'MA'){
				enableRMVButton(isRiskStateMA());
				}
				else{
					enableRMVButton(false);
				}
			}else{
				enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists());
			}
		}	
	}); 
	
	
	
	
	
	
	$("#removePriAppYes").click(function(){
	
		 	$('#primary_insured_firstName').val($('#secondary_insured_firstName').val());
		 	
		 	var secInsuredMiddleName = $('#secondary_insured_middleName').val();
		 	//tbd check watermark coming in value
		 	if(secInsuredMiddleName == 'Optional'){
		 		secInsuredMiddleName='';
		 	}
		 	//$('#primary_insured_middleName').val($('#secondary_insured_middleName').val());
		 	$('#primary_insured_middleName').val(secInsuredMiddleName);
		 	$('#primary_insured_lastName').val($('#secondary_insured_lastName').val());
		 	
		 	//#54150..Lic state, Lic num and birthdate
		 	//$('#primary_insured_birth_date').val($('#secondary_insured_birth_date').val());
		 	if (isRiskStateMA()) { 
		 		$('#primary_insured_licenseState').val($('#secondary_insured_licenseState').val());
		 		$("#primary_insured_licenseNumber").prop('disabled',false);
		 		$('#primary_insured_licenseNumber').val($('#secondary_insured_licenseNumber').val());
		 		$("#primary_insured_licenseNumber").prop('disabled',true);
		 		$('#primary_insured_birth_date_orig').val($('#secondary_insured_birth_date_orig').val());
		 		//registry related data
		 		$('#primary_insured_rmvLookupInd').val($('#secondary_insured_rmvLookupInd').val());
		 		$('#primary_insured_firstLicUsaDt').val($('#secondary_insured_firstLicUsaDt').val());
		 		$('#primary_insured_licOutOfStatePrior3YrsInd').val($('#secondary_insured_licOutOfStatePrior3YrsInd').val());
		 		$('#primary_insured_firstLicMADt').val($('#secondary_insured_firstLicMADt').val());
		 		$('#primary_insured_sdip').val($('#secondary_insured_sdip').val());
		 		$('#primary_insured_rmvLookupDate').val($('#secondary_insured_rmvLookupDate').val());
		 	} else {
		 		$('#primary_insured_birth_date').val($('#secondary_insured_birth_date').val());
		 	}
		 	
		 	var secInsSuffix = $("#secondary_insured_suffix").val();
		 	$("#primary_insured_suffix").prop("selected", false);
		 	$("#primary_insured_suffix").find('option:selected').removeAttr("selected").trigger("chosen:updated");
		 	$("#primary_insured_suffix option[value='"+secInsSuffix+"']").attr('selected', 'selected').trigger("chosen:updated");;
		 	$('#primary_insured_suffix_hidden').val(secInsSuffix);
		 	
		 	var secInsMS =$("#secondary_insured_maritalStatusCd").val();
		 	$("#primary_insured_maritalStatusCd").val(secInsMS);
		 	
		 	$("#primary_insured_maritalStatusCd").prop("selected", false);
		 	$("#primary_insured_maritalStatusCd").removeAttr("selected");
		 	$("#primary_insured_maritalStatusCd option[value='"+secInsMS+"']").attr('selected', 'selected').trigger("chosen:updated");;
		 	$('#primary_insured_maritalStatusCd_hidden').val(secInsMS);

		 	
		 	$('#mask_ssn_PRIMARY_INSURED').val($('#mask_ssn_SECONDARY_INSURED').val());
		 	
		 	$('#primary_insured_mask_ssn_PRIMARY').val($('#insured_mask_ssn_SECONDARY').val());
		 	//$('#primary_insured_mask_ssn_PRIMARY').val($('#secondary_insured_mask_ssn_SECONDARY').val());
	 		$('#insured_mask_ssn_PRIMARY').val($('#insured_mask_ssn_SECONDARY').val());
	 		
	 		//alert('middle name = '+$('#secondary_insured_middleName').val()+' ssn = '+$('#mask_ssn_SECONDARY_INSURED').val());
//	 		$("#primary_insured_suffix").trigger('chosen:updated').trigger('chosen:styleUpdated');
//		 	$("#primary_insured_maritalStatusCd").trigger('chosen:updated').trigger('chosen:styleUpdated');
	 		
	 		//Set the default values here Start --
	 		var defSecInsuredFirstName = $.trim($('#secondary_insured_firstName').prop('defaultValue'));
	 		var defSecInsuredMiddleName = $.trim($('#secondary_insured_middleName').prop('defaultValue'));
	 		var defSecInsuredLastName = $.trim($('#secondary_insured_lastName').prop('defaultValue'));
	 		var defSecInsuredBirthDate = $.trim($('#secondary_insured_birth_date').prop('defaultValue'));
	 		var defSecInsuredSSN = $.trim($('#mask_ssn_SECONDARY_INSURED').prop('defaultValue'));
	 		var defSecInsuredSuffix = $.trim($('#secondary_insured_suffix').data('OriginalValue'));
	 		var defSecInsuredMaritalStatus = $.trim($('#secondary_insured_maritalStatusCd').data('OriginalValue'));
	 		
	 		//Ok keep this
//		alert('Secondary has following \n'+'firstName = '+defSecInsuredFirstName+'\n middle Name ='+defSecInsuredMiddleName+'\n last Name = '+defSecInsuredLastName+
//		 	'\n birth Date = '+defSecInsuredBirthDate+'\n ssn = '+defSecInsuredSSN+'\n suffix = '+defSecInsuredSuffix+'\n marital status = '+defSecInsuredMaritalStatus);
//	 		
	 		$('#primary_insured_firstName').prop('defaultValue',defSecInsuredFirstName);
		 	$('#primary_insured_middleName').prop('defaultValue',defSecInsuredMiddleName);
		 	$('#primary_insured_lastName').prop('defaultValue',defSecInsuredLastName);
		 	$('#primary_insured_birth_date').prop('defaultValue',defSecInsuredBirthDate);
		 	$('#mask_ssn_PRIMARY_INSURED').prop('defaultValue',defSecInsuredSSN);
	 		$("#primary_insured_suffix").data("OriginalValue",defSecInsuredSuffix);
		 	$("#primary_insured_maritalStatusCd").data("OriginalValue",defSecInsuredMaritalStatus);
	 			 		
//		 	alert('Primary gets these defaults from secondary \n firstName ='+$('#primary_insured_firstName').prop('defaultValue')+'\n middle name = '+$('#primary_insured_middleName').prop('defaultValue')+
//		 			'\n last name = '+$('#primary_insured_lastName').prop('defaultValue')+'\n birth Date = '+$('#primary_insured_birth_date').prop('defaultValue')+
//		 			'\n ssn = '+$('#mask_ssn_PRIMARY_INSURED').prop('defaultValue')+'\n marital status = '+$('#primary_insured_maritalStatusCd').data('OriginalValue')+
//		 			'\n suffix = '+$('#primary_insured_suffix').data('OriginalValue')
//		 	);
		 	
		 	//check if ssn is valid and show error message
		 	var ssnAssigned = $('#insured_mask_ssn_PRIMARY').val();
		 	if(ssnAssigned == null ||  ssnAssigned == '' || ssnAssigned == 'Optional'){
		 		var strErrorTag = 'primary_insured_mask_ssn_PRIMARY.browser.inLine';
				var errorMessageID = '';
				//#53575..do if element exists only
				if ( $('#primary_insured_mask_ssn_PRIMARY').length > 0 ) {
					var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
					showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
				}
		 		
		 	}
		 	else{
		 		var priSsnArr = ssnAssigned.split('-');
		 		if(validSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY')) && priSsnArr.length == 3){
		 			var elm = 'primary_insured_mask_ssn_PRIMARY';
					var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
					maskSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY'),hdnField);
					var strErrorTag = 'primary_insured_mask_ssn_PRIMARY.browser.inLine';
					var errorMessageID = '';
					//#53575..do if element exists only
					if ( $('#primary_insured_mask_ssn_PRIMARY').length > 0 ) {
						var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
						showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
					}
		 		}
		 		else{
		 			var errorMessageID = 'primary_insured_mask_ssn_PRIMARY.browser.inLine.Invalid';
		 			//#53575..do if element exists only
		 			if ( $('#primary_insured_mask_ssn_PRIMARY').length > 0 ) {
						var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
						showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
					}
		 		}
		 		
		 	}
		 	
//		 	validate birth date too !!
//		 	var bday = $('#secondary_insured_birth_date').val()
//		 	if(bday != null && bday !=''){
//		 	var splitDate = bday.split('/');
//		 	if(splitDate.length ==3){
//		 		validatePrimaryInsuredBirthDate($('#primary_insured_birth_date'));
//		 	}
//		 	}
		 	
		 	//Set the default values here End --
	 		//Assign P* existing flag before clearing exiting Flag
	 		
		 	$('#primary_insured_pstarexists').val( $('#secondary_insured_pstarexists').val());
	 		resetCoApplicantForPromotion();
	 		
	 		$("#primary_insured_operation").val("PROMOTE");
	 		$("#secondary_insured_operation").val("PROMOTE");
		    
	 		$('.secondaryInsured').hide();
		    $("#addCoApplicant").show();
		    $("#addCoApplicant_disable").hide();
		    $('#deletePrimaryApplicantIcon').hide();
		 	$("#disableCoApplicantValidation").val("Yes");
	 		
			$(".modal").modal('hide');

			if(isRated == 'Yes')
			{
				var originalPremAmt = $('#premAmt').val();
				resetPremium(isRated,originalPremAmt);
			}
		if(isEndorsement()) {
			var originalPremAmt = $('#premAmt').val();
			resetPremium(isRated,originalPremAmt);
		}
		if($("#transactionProgress").val() != ''){
			//enableRMVButton(isRiskStateMA() && $('#primary_insured_rmvLookupInd').val()!='Yes' && checkIfAtleastOneMAInsuredExists());
			//#56001....check driver status also...Rmv lookup button display should behave as same as driver page
			enableRMVButton(isRiskStateMA() && $('#primary_insured_rmvLookupInd').val()!='Yes' && isApplicantDriverEligibleForRmvLookUp($('#primary_insured_driverStatusCd').val()) && checkIfAtleastOneMAInsuredExists());
		} else{
			if($('#primary_insured_rmvLookupInd').val()!='Yes'){
				if($('#primary_insured_licenseState').val() == 'MA'){
				enableRMVButton(isRiskStateMA());
				}
				else{
					enableRMVButton(false);
				}
			}else{
				enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists());
			}
		}

		});

	$("#removePriAppNo").click(function(){
		$(".modal").modal('hide');
		});
	

	var mailingSameAsResidence = $('#shouldValidateMailingAddress').val();

	if(mailingSameAsResidence == 'Y'){
		$('.mailingAddressBlock').hide();
		$('#mailingresidenceaddresssame').attr('checked',false);
	}
	else{
		$('.mailingAddressBlock').show();
		$('#mailingresidenceaddresssame').attr('checked',true);
	}

	$("#mailingresidenceaddresssame").change(function(){
		if(this.checked){
			$('.mailingAddressBlock').show();
			$('#shouldValidateMailingAddress').val('N');
		}
		else
			{
				$('#shouldValidateMailingAddress').val('Y');
				$(".mailingAddressBlock").hide();
			}
	});


	var srcBusiness = $('select[id=clientSourceOfBusinessCode]').val();
	//Only valid for "Employee" and srcBusiness="ExistingAgencyCustomer"
	if(empType == 'E')
	{
		if(srcBusiness == 'EXIST_AGY'){
				$('.salesProgramOverride_class').show();
				$('.priorCarrierName_class').show();
				$('.priorCarrierPolicyNumber_class').show();
				$('.salesProgram_class').show();
				validateSalesProgram();
				//should not be triggering a call in readOnlyMode
				if ( $('#readOnlyMode').val() != 'Yes' ) {
					performADRSalesProgramSearch('salesProgram', true);
				}
		}else if(srcBusiness == 'EXIST_SPIN'){
			//Remove preRequiredClass/yellow fill.
			$('#clientReferralSourceCd').val('SPIN').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#salesProgram').val("").trigger('chosen:updated');
			$('.salesProgramOverride_class').hide();
			$('.salesProgram_class').hide();
			$('.priorCarrierName_class').hide();
			$('.priorCarrierPolicyNumber_class').hide();
			$('.priorCarrierPolicyTermInfo').addClass('hidden');
			$('.activeCurrentPolicyInfo').addClass('hidden');
			$('#priorCarrirePolicyEfftDateInfo').addClass('hidden');
			$('.clspriceTransferCredit').addClass('hidden');
		}else{
			$('#salesProgram').val("").trigger('chosen:updated');
			$('.salesProgramOverride_class').hide();
			$('.salesProgram_class').hide();
			$('.priorCarrierName_class').hide();
			$('.priorCarrierPolicyNumber_class').hide();
			$('.priorCarrierPolicyTermInfo').addClass('hidden');
			$('.activeCurrentPolicyInfo').addClass('hidden');
			$('#priorCarrirePolicyEfftDateInfo').addClass('hidden');
			$('.clspriceTransferCredit').addClass('hidden');

		}
	}

	//We do not need if the employee is an Agent since we do display the salesprogram for them
	if(empType == 'A')
	{
		if(srcBusiness == 'EXIST_AGY'){
			//49166 -- Rating: (L2 Agent Login) User gets Sales Program is required but there is no Sales Program drop down displayed
			// Agent default to IND_PO_TR. ADRSales program look up not needed ..
			//$('#salesProgramAgentDefault').val("IND_POL_TR");
			performADRSalesProgramSearch('salesProgramAgentDefault', true);
		}else if(srcBusiness == 'EXIST_SPIN'){
			//Remove preRequiredClass/yellow fill.
			$('#clientReferralSourceCd').val('SPIN').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');	
		}
	}
	
	$('select[id=clientSourceOfBusinessCode]').change(function(){
		sourceOfBizVal = this.value;
		if(sourceOfBizVal != null){
			sourceOfBizVal = $.trim(sourceOfBizVal);
		}
		
		if(sourceOfBizVal !='EXIST_AGY'){			
		
			$('#salesProgramOverride').prop('disabled',false);
			$('#salesProgramOverride').prop('checked',false);
			$('#salesProgramOverrideInd').val("No");
			
			var errorMessageID = '';				
			var priorPremAmtId = $('#priorCarrierPremiumAmount').attr('id');
			showClearInLineErrorMsgsWithMap(priorPremAmtId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
										
			var piorPolTermId = $('#priorCarrierPolicyTerm').attr('id');
			showClearInLineErrorMsgsWithMap(piorPolTermId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var salesPrgmId = $('#salesProgram').attr('id');
			showClearInLineErrorMsgsWithMap(salesPrgmId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var priorPolEffDateId = $('#priorCarrierPolicyEfftDate').attr('id');
			showClearInLineErrorMsgsWithMap(priorPolEffDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var priorCarrierNameId = $('#priorCarrierName').attr('id');
			showClearInLineErrorMsgsWithMap(priorCarrierNameId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else if (sourceOfBizVal =='EXIST_AGY'){
		
			$('#salesProgramOverride').prop('disabled',false);
			$('#salesProgramOverride').prop('checked',false);	
			$('#salesProgramOverrideInd').val("No");
		}else if (sourceOfBizVal =='NEW_AGY' || sourceOfBizVal =='ESALES'){
			 var channel = $('#channelCd').val();
			 if(channel == 'IA'){
				 $('#clientReferralSourceCd').val('');
				 $('.clsReferralSourceCd').hide();
				 var clientReferralSourceCd = $("#clientReferralSourceCd").attr("id");
				 var errorMessageID = '';
				 showClearInLineErrorMsgsWithMap(clientReferralSourceCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);	 
			 }
			 
		}
		var srcBusinessCode = $(this).val();
		if(empType == 'E')
		{
			if(srcBusinessCode == 'EXIST_AGY'){
				$('.salesProgramOverride_class').show();
				$('.priorCarrierName_class').show();
				$('.priorCarrierPolicyNumber_class').show();
				$('.salesProgram_class').show();
				validateSalesProgram();
				performADRSalesProgramSearch('salesProgram', true);
				$('#clientReferralSourceCd').val('').trigger('chosen:updated');
			}else if(srcBusinessCode == "EXIST_SPIN"){
				//Remove preRequiredClass/yellow fill.
				$('#clientReferralSourceCd').val('SPIN').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
				sourceOfBusinessNonExistingAgencyCustoomer();
			}
			else{
				$('#clientReferralSourceCd').val('').trigger('chosen:updated');
				sourceOfBusinessNonExistingAgencyCustoomer();
				$('.salesProgramOverride_class').hide();
				$('.salesProgram_class').hide();
				validateSalesProgram();
			}
		}
		if(empType == 'A')
		{
			if(srcBusinessCode == 'EXIST_AGY'){
				//$('#salesProgramAgentDefault').val("IND_POL_TR");
				//49166 -- Rating: (L2 Agent Login) User gets Sales Program is required but there is no Sales Program drop down displayed
				// Agent default to IND_PO_TR. ADRSales program look up not needed ..
				performADRSalesProgramSearch('salesProgramAgentDefault', true);
				$('#clientReferralSourceCd').val('').trigger('chosen:updated');
			} else if(srcBusinessCode == "EXIST_SPIN"){
				//Remove preRequiredClass/yellow fill.
				$('#clientReferralSourceCd').val('SPIN').removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');	
				sourceOfBusinessNonExistingAgencyCustoomer();
			} else
				{
					//If Agent chnages back Source of business code to something other than EXIST_AGY set it back to empty..
					$('#salesProgramAgentDefault').val('');
					sourceOfBusinessNonExistingAgencyCustoomer();
				}
		}

	});

	$('#fixDiscalimerSelection').click(function(){
		$('#myErrorModal').modal('hide');
		$('span[id^=currentReportRequiredIndicator]').focus();

	});

	
 	var salesProgOverride = $('#salesProgramOverrideInd').val();
	
	$('#salesProgramOverride').change(function(){
		if($(this).is(":checked")) {
			$('#preOverrrideSalesProgramCd').val($('#salesProgram').val());
			$('#salesProgramOverrideInd').val("Yes");
			$('#salesProgram').prop('disabled',false).trigger('chosen:updated');
		}
		else{
				$('#salesProgramOverrideInd').val("No");
				//58798 - SalesProgram should reevaluate when override is unchecked
				/*if($('#preOverrrideSalesProgramCd').val().length > 0){
					$('#salesProgram').val($('#preOverrrideSalesProgramCd').val());
					$('#preOverrrideSalesProgramCd').val('');
				}*/
				$('#preOverrrideSalesProgramCd').val('');
				performADRSalesProgramSearch('salesProgram', true);
				var errorMessageID = '';				
				var priorPremAmtId = $('#priorCarrierPremiumAmount').attr('id');
				showClearInLineErrorMsgsWithMap(priorPremAmtId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
											
				var piorPolTermId = $('#priorCarrierPolicyTerm').attr('id');
				showClearInLineErrorMsgsWithMap(piorPolTermId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				
				var salesPrgmId = $('#salesProgram').attr('id');
				showClearInLineErrorMsgsWithMap(salesPrgmId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				
				var priorPolEffDateId = $('#priorCarrierPolicyEfftDate').attr('id');
				showClearInLineErrorMsgsWithMap(priorPolEffDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				
				var priorCarrierNameId = $('#priorCarrierName').attr('id');
				showClearInLineErrorMsgsWithMap(priorCarrierNameId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				
				$('#salesProgram').prop('disabled',true).trigger('chosen:updated');
			}
		
		validateSalesProgram();
		//56473 - Re-rate is not being triggered when Sales Program is checked off or unchecked for override.
		resetPremiumForAll();
	});

	$('select[id^="salesProgram"]').bind(getValidationEvent(), function(event, result){
			validateSalesProgram();
	});
	//initialize and default the values here


	var pol_key = $("#policyKey").val();

	// This block should not be executed for Endorsements
	if( (!isEndorsement()) && (pol_key == null || pol_key == '' || pol_key == 0 || pol_key == '0'))
	{
		$("#primary_insured_participantId").val("0");
		$("#addressId").val("0");
		$('#clientInfo_policyId').val("0");
		$('#priorCarrierPolicyKey').val("0");


		//27602	Client Tab: Source Of Business drop down menu should default to New To Agency for [New Quotes]
		//51064
		/*var hasError = $('#pageErrorInfo').val();
		if(hasError==null || hasError == undefined || hasError.length<1){
			$('#clientSourceOfBusinessCode').val("NEW_AGY");
			$('#clientSourceOfBusinessCode').removeClass("preRequired");
			$("#clientSourceOfBusinessCode").trigger('chosen:updated').trigger('chosen:styleUpdated');
		}*/
		}

	$('#primary_insured_maritalStatusCd').change(function(){$('#primary_insured_maritalStatusCd_hidden').val($(this).val());
		var maritalStatusPrimary = $.trim($(this).val());
		//49075 - Co-applicant fields should populate if martial status = Married/Domestic Partner
		if(maritalStatusPrimary == 'M' || maritalStatusPrimary == 'Q' || maritalStatusPrimary == 'X') {
			if (!isEndorsement()){
				secondaryApplicantAddInit();
			}
			$('#secondary_insured_maritalStatusCd').val(maritalStatusPrimary).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#secondary_insured_maritalStatusCd_hidden').val(maritalStatusPrimary);
		} 
		//51718 - Martial Status Field for Co Applicant getting changed to Select when you change the PNIs MArital Status
		/*else{
			secondaryApplicantResetMaritalStatus();
		}*/
	});

	$('#eligibilityGroup').change(function(){
		 $('#eligibilityGrp').val($(this).val());
		var eligibilityGroup = $(this).val();
	
		if(eligibilityGroup == 'COLLEGE' ||  eligibilityGroup == 'SBM' || eligibilityGroup == 'CSE' ||
			eligibilityGroup == 'PTA' ||eligibilityGroup == 'OM'|| eligibilityGroup == 'RR' )
		{
			$('.town_row').addClass('hidden');
			$('#districtOrTownTxt').val('');
		} else {
			$('.town_row').removeClass('hidden');
		}
			
		if(eligibilityGroup == 'RR'){
			$('.institutionName_Row').addClass('hidden');
			$('#institutionNameTxt').val('');
		} else {
			$('.institutionName_Row').removeClass('hidden');
		}
		
	});
	
	$('#eligibilityGroup').bind({change :function(event, result){validateEligibilityGroup(this);},
		blur : function(){
			validateEligibilityGroup(this);
	}});

	$('#secondary_insured_maritalStatusCd').change(function(){$('#secondary_insured_maritalStatusCd_hidden').val($(this).val());});

	$('#primary_insured_suffix').change(function(){$('#primary_insured_suffix_hidden').val($(this).val());});

	$('#secondary_insured_suffix').change(function(){$('#secondary_insured_suffix_hidden').val($(this).val());});

	$('#primary_insured_licenseState').change(function(){
		$('#primary_insured_licenseState_hidden').val($(this).val());
		
		if($(this).val()=='MA'){
			if($('#primary_insured_rmvLookupInd').val() !='Yes'){
				enableRMVButton(isRiskStateMA());
			}	
			else{
				if($('#secondary_insured_licenseNumber').is(':visible')){
					enableRMVButton(isRiskStateMA());
				}else{
					enableRMVButton(checkIfAtleastOneMAInsuredExists());
				}
			}
		}
		if($(this).val()!='MA'){
			if($('#secondary_insured_licenseNumber').is(':visible')){
				enableRMVButton(isRiskStateMA());
			}else{
				enableRMVButton(false);
			}
			
			showClearInLineErrorMsgsWithMap('primary_insured_licenseNumber', '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);	
		}
	});
	
	$('#secondary_insured_licenseState').change(function(){
		$('#secondary_insured_licenseState_hidden').val($(this).val());
		//55376
		if($(this).val() == 'MA'){
			enableRMVButton(true);
		}else{
			enableRMVButton(checkIfAtleastOneMAInsuredExists());
			clearSNILicenseNumberError();
		}
		
		//TD 66601 (updates to driver license field validation)
		if (isEndorsement()) {
			if ($('#secondary_insured_endorsementDriverAddedInd').val()=='Yes') {
				validateSecondaryInsuredLicenseState(this);
			}	
		} else {
			validateSecondaryInsuredLicenseState(this);
		}
		
	});
	
	/*$('#mailingStateCd').change(function(){
		var mailingState = $(this).val();
		var stateResp = $('#mailingAddressState').val();
		var zipId = $('#mailingZip').attr('id');
		//Replaced NJ with !MA
		if((mailingState == 'MA' || mailingState == 'NJ' || mailingState == 'CT' || mailingState == 'NH') && (stateResp == null || stateResp == '')){
			errorMessageID='mailingZip.browser.inLine.nonRatable';
		}
		else{
				errorMessageID = '';	
				//$('#mailingAddressState').val(mailingState);
		}
		
		showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
	});*/
	
	$('select[id^="policyProducerInput"]').change(function(){
		if(validatePolicyProducer(this)){
			getuwCompanyandValidateProduct(true);
			var srcBiz = $('#clientSourceOfBusinessCode').val();
			if($("#empType").val() == 'E'){						
				if(srcBiz == 'EXIST_AGY'){
					$('.salesProgramOverride_class').show();
					$('.priorCarrierName_class').show();
					$('.priorCarrierPolicyNumber_class').show();
					$('.salesProgram_class').show();
					validateSalesProgram();
					if($("#empType").val() == 'E'){
						performADRSalesProgramSearch('salesProgram', true);
					}
				}	 
			}else if(srcBiz == 'EXIST_AGY'){
				performADRSalesProgramSearch('salesProgramAgentDefault', true);
			}
		}
		resetPremiumForAll();
		


	});
	
	$('select[id^="policyProducerInput"]').blur(function(){
		validatePolicyProducer(this);
	});
	
		
	$('#priorCarrierPremiumAmount').bind(getValidationEvent(), function(event, result){
		$('#priorCarrierPremiumAmount').removeClass('preRequired').trigger('chosen:styleUpdated');
		var preAmt = $(this).val();
		
		if(preAmt.length < 1){
		
			var strErrorTag = 'priorCarrierPremiumAmount.browser.inLine';
			
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = $(this).attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else{
			var errorMessageID = '';				
			var priorPremAmtId = $('#priorCarrierPremiumAmount').attr('id');
			showClearInLineErrorMsgsWithMap(priorPremAmtId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);										
			
		}
				
	});
	
	$('#priorCarrierPolicyTerm').bind(getValidationEvent(), function(event, result){
		var priorTerm = $(this).val();
		
		if(priorTerm.length < 1){
		
			var strErrorTag = 'priorCarrierPolicyTerm.browser.inLine';
			
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = $(this).attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else{
			var errorMessageID = '';
			var piorPolTermId = $('#priorCarrierPolicyTerm').attr('id');
			showClearInLineErrorMsgsWithMap(piorPolTermId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
		}
				
	});
	
	$('#salesProgram').on('change blur', function(event, result){
		var salesPrgm = $(this).val();
		var overrideInd = $('#salesProgramOverrideInd').val();
		if(overrideInd != null){
			overrideInd = $.trim(overrideInd);
		}
		 
		if(overrideInd == 'Yes' && salesPrgm.length < 1){
			
			var strErrorTag = 'salesProgram.browser.inLine';
			
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = $(this).attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}else{
			var errorMessageID = '';
			var salesPrgmId = $('#salesProgram').attr('id');
			showClearInLineErrorMsgsWithMap(salesPrgmId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
		}
				
	});
	
	$('#priorCarrierName').change(function(){
		performADRSalesProgramSearch('salesProgram',true);
	});
	
	$(document).on("change", "#priorCarrierPolicyTerm", function(){

		
		if($('#salesProgram').val() == 'PREF_BK_RL'){
			resetPremiumForAll();	
		}
		
	});
	
	$(document).on("change", "#priorCarrierPremiumAmount", function(){
		if($('#salesProgram').val() == 'PREF_BK_RL'){
			resetPremiumForAll();	
		}
	});
	
	  var existPriorCarrier = $('#priorCarrierPolicyEfftDate').val();
	    
	  $('#priorCarrierPolicyEfftDate').on('change blur',function(){
			$('#priorCarrierPolicyEfftDate').removeClass('preRequired').trigger('chosen:styleUpdated');
			var priorEffDate = $(this).val();	
			
			if(existPriorCarrier != priorEffDate){
				resetPremiumForAll();
			}
			existPriorCarrier = $('#priorCarrierPolicyEfftDate').val();
			
			if(priorEffDate.length < 1){

				var strErrorTag = 'priorCarrierPolicyEfftDate.browser.inLine';

				var errorMessageID = 'required';
				errorMessageID = strErrorTag + '.' + errorMessageID;
				var strId = $(this).attr('id');
				showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			}else{
				var errorMessageID = '';
				var priorPolEffDateId = $('#priorCarrierPolicyEfftDate').attr('id');
				showClearInLineErrorMsgsWithMap(priorPolEffDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
				
			}
		});	
	
	
	$('input[id="primary_insured_firstName"]').on('change blur', function(event, result){
		validatePrimaryInsuredFirstName(this);
		var nameUpdate = $('#primary_insured_firstName').val();
		$("#applicant_first_name").text(nameUpdate);
	});

	$('input[id="primary_insured_lastName"]').on('change blur', function(event, result){
		validatePrimaryInsuredLastName(this);
		var nameUpdate = $('#primary_insured_lastName').val();
		$("#applicant_last_name").text(nameUpdate);
	});
	
	$('input[id="secondary_insured_firstName"]').on('change blur', function(event, result){validateSecondaryInsuredFirstName(this);});

	$('input[id="secondary_insured_lastName"]').on('change blur', function(event, result){
		validateSecondaryInsuredLastName(this);});
	
	$('#primary_insured_licenseState').on('change blur', function(event, result){
		//#54226...In endorsement only for newly added drivers or Exisitng MA deferred2 driver cahnged to rated MA driver
		if (isEndorsement()) {
			if ($('#primary_insured_endorsementDriverAddedInd').val()=='Yes') {
				validatePrimaryInsuredLicenseState(this);
			}	
		} else {
			validatePrimaryInsuredLicenseState(this);
		}
	});

	$('#primary_insured_licenseNumber').on('change blur', function(event, result){
		if (!isMaipPolicy()) {
		if(event.type=='change'){
			$('#primary_insured_rmvLookupInd').val('');	
			// #53659.since above indiactor is being cleared. so enable rmv look up button for MA state to do re look up.
			if($('#primary_insured_licenseState').val()=='MA' && $('#primary_insured_licenseNumber').val() != '' ){
				//$('#rmvLookUp').show();	
				//$('#rmvLookUp_disable').hide();
				enableRMVButton(true);
			} else
			{
				enableRMVButton(checkIfAtleastOneMAInsuredExists());
			}
		}
		}
	/*	if($('#primary_insured_licenseState').val()!='MA'){
			return false;
		}*/
		//validatePrimaryInsuredLicenseNumber(this);
		
		//#54226...In endorsement only for newly added drivers or Exisitng MA deferred2 driver cahnged to rated MA driver
		if (isEndorsement()) {
			if (isMaipPolicy()) {
				validatePrimaryInsuredLicenseNumber(this);
			} else if ($('#primary_insured_endorsementDriverAddedInd').val()=='Yes') {
				validatePrimaryInsuredLicenseNumber(this);
			}	
		} else {
			//55286-Client - Lookup required edit triggering when license state = New York
			if($('#primary_insured_licenseState').val()=='MA'){
				validatePrimaryInsuredLicenseNumber(this);
			}else if($('#primary_insured_licenseState').val()!='MA'){
			    //TD 66601 (updates to driver license field validation)
				validatePrimaryInsuredNonMALicNum(this);
			}
		}
	});
		
	$('#secondary_insured_licenseNumber').on('change blur', function(event, result){
		if (isMaipPolicy() || (isMaipPolicy() && $('#secondary_insured_endorsementDriverAddedInd').val() == 'Yes')) {
		if(event.type=='change'){
			$('#secondary_insured_rmvLookupInd').val('');	
			// #53659.since above indiactor is being cleared. so enable rmv look up button for MA state to do re look up.
			if($('#secondary_insured_licenseState').val()=='MA' && $('#secondary_insured_licenseNumber').val() != '' ){
				//$('#rmvLookUp').show();	
				//$('#rmvLookUp_disable').hide();
				enableRMVButton(true);
			}
			else {
				enableRMVButton(checkIfAtleastOneMAInsuredExists());
			}
		}
		}
		/*if($('#secondary_insured_licenseState').val()!='MA'){
			return false;
		}*/
		//55286-Client - Lookup required edit triggering when license state = New York
		if($('#secondary_insured_licenseState').val()=='MA'){
			validateSecondaryInsuredLicenseNumber(this);
		}else if($('#secondary_insured_licenseState').val() !='MA'){
		    //TD 66601 (updates to driver license field validation)
			validateSecondaryInsuredNonMALicNum(this);
		}
	});
	
	$('.clsFirstName,.clsMiddleName,.clsLastName').bind({
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

	$('#primary_insured_maritalStatusCd').bind({change :function(event, result){validatePrimaryInsuredMaritalStatus(this);},
	blur : function(){
		validatePrimaryInsuredMaritalStatus(this);
	}});

	$('#secondary_insured_maritalStatusCd').bind({change: function(event, result){validateSecondaryInsuredMaritalStatus(this);},
		blur : function(){ validateSecondaryInsuredMaritalStatus(this);
		}});
	
	$('#clientSourceOfBusinessCode').bind({change :function(event, result){validateSourceOfBusiness(this);},
			blur:function(){
				validateSourceOfBusiness(this);
			}});

	$('#clientReferralSourceCd').bind({change: function(event, result){validateReferralSource(this);},
	blur: function(){validateReferralSource(this);}
	});
	
	$('#currentReportRequiredIndicator').bind({change: function(event, result){validateReportRequiredIndicator(this);},
		blur : function(){ validateReportRequiredIndicator(this);
		}});

	$('#addrLine1Txt,#addrLine2Txt,#mailingAddrLine1Txt,#mailingAddrLine2Txt').bind(getValidationEvent(), function(event, result){validateAddressLine1(this,event);});

	$(".clsResiAddr1,.clsResiAddr2,.clsMailingAddr1,.clsMailingAddr2").bind({'keypress': function(e) {fmtAddress(this,e);},
		'paste':function(event){
		var element = this;
		setTimeout(function(){
			var enteredName = element.value;
			var formattedName = enteredName.replace(/[^\\/,.#a-zA-Z0-9-'& ]/g, "");
			$('#'+element.id).val(formattedName);
			validateAddressLine1(element,event);
		}, 100);
	}
	});

	$('#priorCarrierName').bind(getValidationEvent(), function(event, result){
		validatePriorCarrier(this);
	});

	$('#currentPolicyPremium').bind(getValidationEvent(),function(event,result){
		validateCurrentPolicyPremium(this);
	});

	$('#currentPolicyPremiumTerm').bind(getValidationEvent(),function(event,result){
		validateCurrentPremiumEffDate(this);
	});

	$('#cityName').bind({change: function(event, result){
		validateCity(this);
	}});

	$('#mailingCityName').bind({change: function(event, result){
		validateCity(this);
	}});

	$('#currentPolicyPremium').bind({'keyup keypress': function(event) {
		var key = event.which || event.keyCode;
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
		var regex = new RegExp(/[^0-9]/g);
		var containsNonNumeric = this.value.match(regex);
		if (containsNonNumeric)
			this.value = this.value.replace(regex, '');
	}});

	$(".clsResiZipPlusFour ,.clsResiZip,.clsMailingZipPlusFour ,.clsMailingZip ,.clsNumberInput").bind({'keyup keypress': function(event) {
		var key = event.which || event.keyCode;
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric)
            this.value = this.value.replace(regex, '');
	}});

	/**
	 * open full prefill raw xml in browser
	 */
	$("#span_fullPrefillXml").bind({click:function(event)
	{
		var openURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
		//pass now response id instead of third party id
		var prefillId = $('#PREFILL_ResponseId').val();
		var url =  openURL+'/popUpFullPrefillXML?prefillXMLId='+prefillId;
		newwindow=window.open(url,'','height=550,width=450,scrollbars=1,resizable=0,status=0,toolbar=no,menubar=no,location=no,directories=no');
	    if (window.focus) {newwindow.focus()}
	    return false;
	}});

	$('#zip,#mailingZip').bind(getValidationEvent(), function(event, result){
		var emailRegex = new RegExp(/(^\d{5}$)/);
		var zip = $(this).val();
		var fieldId = $(this).attr('id');
		var valid1 = emailRegex.test(zip);
		if (!valid1){
			var strErrorTag = 'zip.browser.inLine';
			if(fieldId.indexOf('mailing') != -1){
				strErrorTag = 'mailingZip.browser.inLine';
			}
			var errorMessageID = 'InvalidZip';
			
			if(zip == null || zip == '' || zip == undefined){
				errorMessageID = 'required';
			}
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = $(this).attr('id');
			
			clearCityDropDown(fieldId);
			
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
		}
		else{
			var valid2 = validateZip(this);
			$("#mailingCityName_FreeForm").hide();
		}
	});

	$('#addressEmailID').bind(getValidationEvent(), function(event, result){validateEmail(this);});

	
	$('#njPolicyTerm').bind(getValidationEvent(), function(event, result){
		// Pru-12 Month disable start /*
		 validateExpirationDate();
		// Pru-12 Month disable end */
		validatePolicyTerm(this);});

	//Bind SSN fields
	$(".maskSSN").bind({
		blur: function() {
			//41307-Focus Group- When changing a SS# a reorder of insurance score should trigger a rerate.
			if(isRated == 'Yes'){
				var originalPremAmt = $('#premAmt').val();
				resetPremium(isRated,originalPremAmt);
			}
			
			if(validSSN(this)) {var elm = this.id;var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			maskSSN(this,hdnField);
			clearSSNError(this);
			}
			else{
				var ssn_id = this.id;
				var ssn_val = $.trim($('#'+ssn_id).val());
				if(ssn_val == null || ssn_val =="" || ssn_val.substr(6,5) == "-****" || ssn_val == 'Optional' || (ssn_val.length == 9 && ssn_val.substr(5,4) == "****")){
					if(ssn_val==null || ssn_val ==""){
						if(ssn_id.indexOf("PRIMARY")!=-1){
							$('#insured_mask_ssn_PRIMARY').val("");
						}
						if(ssn_id.indexOf("SECONDARY")!=-1){
							$('#insured_mask_ssn_SECONDARY').val("");
						}
					}
					clearSSNError(this);
				}
				else{
					displaySSNError(this);
				}
			}
			validateIdenticalSSNs(this);
		},'keyup': function(e) {
			fmtSSN(this,e); },
		'paste':function(e){
			var element = this;
			setTimeout(function () {
				var ssn = element.value;
				var re = /\D/g;
				if(ssn!=null && ssn!= undefined && ssn.length>1) {ssn = ssn.replace(re,"")};
				$('#'+element.id).val(ssn);
				fmtSSN(element,e);
			}, 100);	
			
			
		}});
	
	
	$("#homePhoneNumber,#workPhoneNumber,#cellPhoneNumber").bind({'keyup': function(e) {fmtPhone(this,e);},
		'paste':function(e){
			var element = this;
			setTimeout(function () {
				fmtPhone(element,e);
		    }, 100);
		}});
	
	//48443 - Invalid Phone Number Error(Endorsements)
	/*$('#homePhoneNumber,#workPhoneNumber,#cellPhoneNumber').bind('blur',function(event, result){
		var phoneId = this.id;
		var phoneNumberValue = $('#'+phoneId).val();
		if(isEndorsement() && phoneNumberValue.length == 12){
			phoneNumberValue = phoneNumberValue.replace(/[^\d]/g, '');
    		$('#'+phoneId).val(phoneNumberValue);
    	}
	});*/


	$('#homePhoneNumber,#workPhoneNumber,#cellPhoneNumber').each(function(){
		var phoneNumberVal = $(this).val();
		if(isEndorsement() && phoneNumberVal.length == 10){
			phoneNumberVal = convertToPhoneFormat(phoneNumberVal);
			$(this).val(phoneNumberVal);
		}
	});
	
	$('#homePhoneNumber,#workPhoneNumber,#cellPhoneNumber').bind(getValidationEvent(),function(event, result){
		validateHomePhoneNumber(this,event);
	});
	
	//go to security system to validate effective date
	$('#policyEffectiveDate').bind({'blur': function(event, result){
		var effDate = this;
		setTimeout(function () {
			if(hasValidParamsSecurityDate()){
				policyEffectiveDateChanged(effDate);
			}
		}, 100);
		
	}});
	
	$('#policyEffectiveDate').bind({change: function(event, result){
		//UW Tier - Lien Category 
		if(!isEndorsement()){
			$('#polLienCatCode').val('');
		}
		
		if($('#salesProgramOverrideInd').val() != 'Yes'){
			if($("#empType").val() == 'E'){
				performADRSalesProgramSearch('salesProgram', true);
			}else {
				performADRSalesProgramSearch('salesProgramAgentDefault', true);
			}
		}
	}});
	
	//NH Renewal Conversion changes
	$('#policyEffectiveDate').bind({change: function(event, result){
		updateMaritalStatusDDForNHRenewalConversion();
	}});

	$('#primary_insured_birth_date').bind({blur: function(event, result){
		validatePrimaryInsuredBirthDate(this);
	}});
	
	$('#secondary_insured_birth_date').bind({blur: function(event, result){
		validateSecondaryInsuredBirthDate(this);
	}});

	$("#priorCarrierPolicyEfftDate").bind({'keyup keydown keypress': function(e) {fmtDateClient(this,e);},
		'cut copy paste':function(e){return false;}
	});

	

//	var secInsOperation = $('#secondary_insured_operation').val();
//	if(secInsOperation =='ADD'){
//		alert('when is this ever called...add..');
//		// included the condition not to call the function second time when
//		// add named isured is selected in endorsment bubble.
//		if(userAction != EndorsementUserAction.AddNamedInsured){
//			secondaryApplicantAddInit();
//		}
//	}
//	
//	if(secInsOperation =='DELETE'){
//		alert('when is this ever called...delete..');
//		$("#secondary_insured_operation").val("DELETE");
//	    $('.secondaryInsured').hide();
//	    $("#addCoApplicant").show();
//	    $("#addCoApplicant_disable").hide();
//	    $('#deletePrimaryApplicantIcon').hide();
//	 	$("#disableCoApplicantValidation").val("Yes");
//	 	//just clear seconday named participant id here since deleted
//	 	if (isEndorsement()) {
//	 		$("#secondary_insured_participantId").val("");
//	 	}
//		resetCoApplicant();	
//	}

	$("#addCoApplicant").click(function(){
		//51715 - Co applicant DL of the item I deleted appears in DL# field with State of MA
		$("#secondary_insured_licenseNumber").val('');
		if(isEndorsement()) {
			$("#secondary_insured_endorsementDriverAddedInd").val('Yes');
		}
			
		secondaryApplicantAddInit();
		//enableRMVButton(checkIfAtleastOneMAInsuredExists());
		//55376-
		enableRMVButton(true);
	});

	$(".removeApplicant").click(function(){
		$('#myModal').modal();
	});

	$(".removePrimaryApplicant").click(function(){
		var secDeleted = $("#secondary_insured_operation").val();
		var isSecHidden = $('#addCoApplicant').is(":visible");
		if(secDeleted == 'DELETED' || isSecHidden == true){
			alert("Named Insured 1 cannot be deleted");
		}
		else{
				$('#primaryConfirmModal').modal();
		}
	});

	var pol_State =  $('#policyStateCd').each(function(){return this;});
	var pol_term = $('#nonMaTerm').each(function(){return this;});
	
	//$('#policyEffectiveDate').inputmask("mm/dd/yyyy");
	$('#policyEffectiveDate').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		minDate : "0d",maxDate : "+1Y",dateFormat: 'mm/dd/yy',showButtonPanel : true,
		beforeShow: function(date, e) {
			callSecurityPolDate = false;
		},

//		onSelect: function(date, e) {
//			this.focus();
//		},
		onClose: function() {
			callSecurityPolDate = true;
			var effDate = this;
			setTimeout(function () {
				if($(effDate).val() != dateLabel){
					$(effDate).removeClass("watermark");
				}
				if(hasValidParamsSecurityDate()){
						policyEffectiveDateChanged(effDate);
				}
		    }, 100);
		}
	});
	
	/*$('.clsPolEffDate').datepicker({
			showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
			minDate : "0d",maxDate : "+1Y",dateFormat: 'mm/dd/yy',showButtonPanel : true,
			beforeShow: function(date, e) {
				callSecurityPolDate = false;
			},
	
	//		onSelect: function(date, e) {
	//			this.focus();
	//		},
			onClose: function() {
				callSecurityPolDate = true;
				var effDate = this;
				setTimeout(function () {
					policyEffectiveDateChanged(effDate);
			    }, 100);
			}
		});
		$('.clsPolEffDate').inputmask();
	*/	

	/*"onincomplete":function(){alert('date ip is In complete');},
	"oncleared":function(){alert('date ip is cleared');}*/
	
	//52585 - Mod 2 - NJ Risk State - Client - DOB not formatting correctly
	//vmaddiwar - added if condition because this inputmask is causing issues on existing birthdates
	
	// 55505-client- dob values change when entered without slashes
	if(!isRiskStateMA()){
		$('#primary_insured_birth_date').inputmask("mm/dd/yyyy");
		$('#secondary_insured_birth_date').inputmask("mm/dd/yyyy");
	}
	
	if(isRiskStateMA()){
		
		if($('#primary_insured_birth_date').val() == ''){
			$('#primary_insured_birth_date').inputmask("mm/dd/yyyy");
		}
		if($('#secondary_insured_birth_date').val() == ''){
			$('#secondary_insured_birth_date').inputmask("mm/dd/yyyy");
		}
		if($('#primary_insured_rmvLookupInd').val() !='Yes'){
			$('#primary_insured_birth_date').val($('#primary_insured_birth_date_orig').val());
			//55350...set the same default value inorder to avoid display re-order reports even no changes done on screen.
			$('#primary_insured_birth_date').attr('value', $('#primary_insured_birth_date_orig').val());
			
			$("#beforeRmvCall").show();
			$("#afterRmvCall").hide();
		}else{
			$("#beforeRmvCall").hide();
			$("#afterRmvCall").show();
		}
		if($('#secondary_insured_rmvLookupInd').val() !='Yes'){
			
			$('#secondary_insured_birth_date').val($('#secondary_insured_birth_date_orig').val());
			//55350...set the same default value inorder to avoid display re-order reports even no changes done on screen.
			$('#secondary_insured_birth_date').attr('value', $('#secondary_insured_birth_date_orig').val());
			
			$("#beforeRmvCallSec").show();
			$("#afterRmvCallSec").hide();
		}else{
			$("#beforeRmvCallSec").hide();
			$("#afterRmvCallSec").show();
		}
	} 
	
	$('#primary_insured_birth_date').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
	});

	//$('#secondary_insured_birth_date').inputmask("mm/dd/yyyy");
	$('#secondary_insured_birth_date').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy',showButtonPanel : true
	});
	
	$('#priorCarrierPolicyEfftDate').datepicker({
		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
		dateFormat: 'mm/dd/yy'
	});
	//initialize birthdates  
//	if(isEndorsement()) {
//		$('#endorsement_primary_insured_birth_date').inputmask("mm/dd/yyyy");
//		$('#endorsement_primary_insured_birth_date').datepicker({
//			showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
//			dateFormat: 'mm/dd/yy',showButtonPanel : true
//		});
//		
//		$('#endorsement_secondary_insured_birth_date').inputmask("mm/dd/yyyy");
//		$('#endorsement_secondary_insured_birth_date').datepicker({
//			showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
//			dateFormat: 'mm/dd/yy',showButtonPanel : true
//		});
//	}
	
	
//$('.clsDateOfBirth').inputmask();
//	$('.currentTermDate').datepicker({
//		showOn: "button",buttonImage: imgPath+"/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
//		dateFormat: 'mm/dd/yy',showButtonPanel : true
//	});

	if($("#policyKey").val() !=null){
		$('#termMA').show();$('#nonMaTerm').show();
	}

	$('Form').bind(getSubmitEvent(), function(event, result){
		handleSubmit(event);
	});

	//$('#aiForm').bind(getSubmitEvent(), function(event, result){
		//handleSubmit(event);
	//});
	//check if ssn identical unmask their values
	checkForIdenticalSSNS();
//	$('.tabNextButton').on('keydown', function(event){
//		setFocuFromNext(event);
//	}); 
	setInitialFocus();
	$('#addCoApplicant').on('keydown', function(event){
		 var keyCode = event.keyCode || event.which;
		 if(keyCode == 9 && event.shiftKey) {
			window.scrollTo(0,0);
		};
	});
	 $('#addressEmailID').on('keydown', function(event){
		 var keyCode = event.keyCode || event.which;
		 if(keyCode == 9 && event.shiftKey) {
			window.scrollTo(0,0);
		};
	});
	
	 $(document).on("change", "select.clsPolicyStateCd", function(){
		 $('#policyInfoStateCd').val($(this).val()); // set value to hidden state field
		 showHideLicenseInfo($(this).val()=='MA');
		 handleProductCode();
		 if ($('#branchLabel').is(':visible')){
			 setBranches($('#policyStateCd').val());
			}else{
				 setBranches($('#policyStateCd').val(),getAgencies);
			}
		
		 setProducts($('#policyStateCd').val());
		 //51599 - Branch, Agency, Agency Profile, Producer are not being cleared when changing state on Client tab
		 $('.clsAgency').prop('disabled',false).val('').trigger('chosen:updated');
		 $('.clsProducer').prop('disabled',false).val('').trigger('chosen:updated');
		 $('.clsResiState').attr("disabled", false).trigger('chosen:updated');
		 $('.clsResiState').val($(this).val());
		 $('.clsResiState').attr("disabled", true).trigger('chosen:updated');
		 
		 $('#zip').val('');
		 $('#cityName').prop('disabled',false).val('').trigger('chosen:updated');
		 $('#cityName').prop('disabled',true).trigger('chosen:updated'); 
		 $('#stateCd').val($(this).val());
		 //FIX For TD#71933: START 
		 /*
		  * There are two elements with the same ID - stateCd & when an update on ID is invoked,
		  * jQuery selects the above element with tag 'Select' & not the element with 'input' tag.
		  * Hence updating the element with 'input' tag by name. 
		  * Though the below statement get's overridden on the backend, Updating this just to be on a safer side.
		  */
		 $("input[name='policy.stateCd']").val($(this).val());
		 $('#addressState').val($(this).val());
		 //FIX For TD#71933: END
		 //57809-Client tab - gettting blank blue screen when changing state before clicking next on Client tab
		 $('#policyExpirationDate').val("");
		 $('#expDt').text("");
		 $('#uwCompanyCd').val("");
	     $('#policyUwCompanyCd').val("");
	     $('#superAgentInd').val("");
	 });
	 
	//TD #71938 -> This method is called when state is changed and  Branch dropdown is hidden.This updates new agencies for the state changed.
	 function getAgencies(channelCd){
		 var branchHierId = $('input#branch_hier_id').val();
		
		 if(channelCd == undefined || channelCd == '' || channelCd.length<1 ){
			 channelCd='';
		 }		 
		 $('#policyChannelCd').val(channelCd);
		 // Ok when changing branch channel changes.
		 // keep channel info in synch with what you are changing when changing branch on page
		 $('#channelCd').val(channelCd);
		 
		 //also change the channel text dispalyed in employee section
		
		 if(channelCd == 'IA'){
				$("#span_channelCd").text('Independent Agent');
				
				var bookrollfound = 'No';
				var renewalfound = 'No';
				var prefBookrollfound = 'No';
				
				$('#salesProgram option').each(function(){
					if (this.value == 'BK_ROLL') {
						bookrollfound = 'Yes';						
					}
					if (this.value == 'RN_ACC_REV') {
						renewalfound = 'Yes';
					}
					if (this.value == 'PREF_BK_RL') {
						prefBookrollfound = 'Yes';
						
					}
				});
				
				if(prefBookrollfound == 'No' && $('#noPrefBookRole').val() != 'true'){
					$('#salesProgram').append('<option value="PREF_BK_RL">Preferred Book Roll</option>');
					triggerValueChange($('#salesProgram'));
				}
				
				if(prefBookrollfound == 'Yes'
					&& $('#salesProgram').val() != 'PREF_BK_RL' && $('#noPrefBookRole').val() == 'true'){
					$("#salesProgram option[value='PREF_BK_RL']").remove();
					triggerValueChange($('#salesProgram'));	    	

				}
				
				if(bookrollfound == 'No'){
					$('#salesProgram').append('<option value="BK_ROLL">Book Roll</option>');
					triggerValueChange($('#salesProgram'));
				}
				
				if(renewalfound == 'No'){
					$('#salesProgram').append('<option value="RN_ACC_REV">Renewal Account Review</option>');
					triggerValueChange($('#salesProgram'));
				}
			}else{
				$("#span_channelCd").text(channelCd);
				
				$('#salesProgram > option').each(function(){				
				    if (this.value == 'BK_ROLL') {			    	
				    	$("#salesProgram option[value='BK_ROLL']").remove();
				    	triggerValueChange($('#salesProgram'));			    	
				    }	
				    
				    if (this.value == 'RN_ACC_REV') {			    	
				    	$("#salesProgram option[value='RN_ACC_REV']").remove();
				    	triggerValueChange($('#salesProgram'));			    	
				    }
				    
				    if($('#salesProgram').val() != 'PREF_BK_RL' && $('#noPrefBookRole').val() == 'true'){
				    	if (this.value == 'PREF_BK_RL') {			    	
				    		$("#salesProgram option[value='PREF_BK_RL']").remove();
				    		triggerValueChange($('#salesProgram'));			    	
				    	}
				    }
				    
				    
				});						
				
			} 
		 
		 
		// if(validatePolicyBranch('select.clsBranch')){
			 performProducersSearchPostSelection('searchAgencies','select.clsBranch', "");
			 $('.clsProducer').prop('disabled',false).val('').trigger('chosen:updated');
			 var productCd = $("#policyProductCd").attr("id");
			 var errorMessageID = '';
			 showClearInLineErrorMsgsWithMap(productCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		// }
		 if(channelCd == 'IA'){
			 $('#clientReferralSourceCd').val('');
			 $('.clsReferralSourceCd').hide();
			 var clientReferralSourceCd = $("#clientReferralSourceCd").attr("id");
			 var errorMessageID = '';
			 showClearInLineErrorMsgsWithMap(clientReferralSourceCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		 }else if($('.clsReferralSourceCd').is( ":hidden" )){
			 $('.clsReferralSourceCd').show();
		 } 
		 resetPremiumForAll();		 
		 
	 }
	 $(document).on("change", "select.clsBranch", function(){
		 var branchHierId = $(this).val();
		 var channelCd = $('.clsBranch option:selected').data('support');
		 var branchId = $('.clsBranch option:selected').text();
		
		 //when at select you are setting branch_id to ---Select --- ?
		 $("#branch_id").val(branchId);
		 
		 if(channelCd == undefined || channelCd == '' || channelCd.length<1 ){
			 channelCd='';
		 }		 
		 $('#policyChannelCd').val(channelCd);
		 // Ok when changing branch channel changes.
		 // keep channel info in synch with what you are changing when changing branch on page
		 $('#channelCd').val(channelCd);
		 
		 //also change the channel text dispalyed in employee section
		 //var corpId = $('#policyProducerInput option:selected').data("corp");
		 var corpId = $('.clsBranch option:selected').data('corp');
		 corpId = $.trim(corpId);
		
		 if(channelCd == 'IA'){
				$("#span_channelCd").text('Independent Agent');
				
				var bookrollfound = 'No';
				var renewalfound = 'No';
				var prefBookrollfound = 'No';
				
				$('#salesProgram option').each(function(){
					if (this.value == 'BK_ROLL') {
						bookrollfound = 'Yes';						
					}
					if (this.value == 'RN_ACC_REV') {
						renewalfound = 'Yes';
					}
					if (this.value == 'PREF_BK_RL') {
						prefBookrollfound = 'Yes';
						
					}
				});
				
				if(prefBookrollfound == 'No' && $('#noPrefBookRole').val() != 'true'){
					$('#salesProgram').append('<option value="PREF_BK_RL">Preferred Book Roll</option>');
					triggerValueChange($('#salesProgram'));
				}
				
				if(prefBookrollfound == 'Yes'
					&& $('#salesProgram').val() != 'PREF_BK_RL' && $('#noPrefBookRole').val() == 'true'){
					$("#salesProgram option[value='PREF_BK_RL']").remove();
					triggerValueChange($('#salesProgram'));	    	

				}
				
				if(bookrollfound == 'No'){
					$('#salesProgram').append('<option value="BK_ROLL">Book Roll</option>');
					triggerValueChange($('#salesProgram'));
				}
				
				if(renewalfound == 'No'){
					$('#salesProgram').append('<option value="RN_ACC_REV">Renewal Account Review</option>');
					triggerValueChange($('#salesProgram'));
				}
			}else{
				$("#span_channelCd").text(channelCd);
				
				$('#salesProgram > option').each(function(){				
				    if (this.value == 'BK_ROLL') {			    	
				    	$("#salesProgram option[value='BK_ROLL']").remove();
				    	triggerValueChange($('#salesProgram'));			    	
				    }	
				    
				    if (this.value == 'RN_ACC_REV') {			    	
				    	$("#salesProgram option[value='RN_ACC_REV']").remove();
				    	triggerValueChange($('#salesProgram'));			    	
				    }
				    
				    if($('#salesProgram').val() != 'PREF_BK_RL' && $('#noPrefBookRole').val() == 'true'){
				    	if (this.value == 'PREF_BK_RL') {			    	
				    		$("#salesProgram option[value='PREF_BK_RL']").remove();
				    		triggerValueChange($('#salesProgram'));			    	
				    	}
				    }
				    
				    
				});						
				
			} 
		 
		 
		 if(validatePolicyBranch(this)){
			 performProducersSearchPostSelection('searchAgencies',this.id, corpId);
			 $('.clsProducer').prop('disabled',false).val('').trigger('chosen:updated');
			 var productCd = $("#policyProductCd").attr("id");
			 var errorMessageID = '';
			 showClearInLineErrorMsgsWithMap(productCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		 }
		 if(channelCd == 'IA'){
			 $('#clientReferralSourceCd').val('');
			 $('.clsReferralSourceCd').hide();
			 var clientReferralSourceCd = $("#clientReferralSourceCd").attr("id");
			 var errorMessageID = '';
			 showClearInLineErrorMsgsWithMap(clientReferralSourceCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		 }else if($('.clsReferralSourceCd').is( ":hidden" )){
			 $('.clsReferralSourceCd').show();
		 } 
		 resetPremiumForAll();		 
		 
	 }); 

	 $('select.clsBranch').blur(function(){
		 validatePolicyBranch(this);
	 });

	 
	 $(document).on("change", "select.clsAgency", function(){
		 if(validatePolicyAgency(this)){
			 $('.clsProducer').prop('disabled', false).trigger('chosen:updated');
			 //$('.clsProduct').prop('disabled',false).trigger('chosen:updated');
			
			 // get corp id from selected branch
			 var corpId = $('.clsBranch option:selected').data('corp');
			 corpId = $.trim(corpId);
			 
			 performProducersSearchPostSelection('searchProducers',this.id, corpId);
		 }
		 resetPremiumForAll();		 
		
	 });

	 $('select.clsAgency').blur(function(){
		 validatePolicyAgency(this);
	 });

	
	 $(document).on("change", "#policyProductCd", function(){
		 if(validatePolicyProduct(this)){
			 getuwCompanyandValidateProduct(true);
			 resetPremiumForAll();
			 if(!isQuote()){
				 if($('.clsProduct option:selected').data('support') != 'Teachers'){
					 $('.teachersEligibilitysection').addClass('hidden');
					 $('.teachersEligibilitysectionlower').addClass('hidden');
					 $('#clientEligibilityGroupId').val('').trigger('chosen:updated');
					 $('#clientDistrictTownId').val('').trigger('chosen:updated');
					 $('#clientInstitutionNameId').val('').trigger('chosen:updated');
					 $('#clientInstitutionId').val('');
					 $('#eduInstitutionGroupId').val('');
					 $('#eduInstitutionDistrict').val('');
					 $('#eligibilityYes').prop('checked',false);
					 $('#eligibilityNo').prop('checked',false);
					 $('#eligibilityInd').val('');
					 validateTeachersEligiblityGroup();
					 validateTeachersEligiblityDistrict();
					 validateTeachersEligiblityInstitution();
				 }else {
					 $('.teachersEligibilitysection').removeClass('hidden');
					 lookupEligibilityGroups();
					 //expandEligibilityDropdown('eligibilityYes');
				 }
			 } 
			
			 
		 }
	 });

	 $('select.clsProduct').blur(function(){
		 validatePolicyProduct(this);
		 validateBranchProduct();		
	 });
	 
	
	 //validateSalesProgram();
	
	$(document).on("click", ".openPrefillDialog", function(){
		$('#orderThirdPartyPrefillNotReconciledModal').modal('hide');
		$('#reconcilePrefillClicked').val('true');
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	});
	 
	if(salesProgOverride=='Yes'){

		$('#salesProgramOverride').prop('disabled',false).trigger("chosen:updated");
		$('#salesProgram').prop('disabled',false).trigger("chosen:updated");
		$('#salesProgramOverride').prop('checked',true);
	}else{
		$('#salesProgramOverride').prop('disabled',false).trigger("chosen:updated");
		$('#salesProgramOverride').prop('checked',false);

	}
	/*if(empType == 'E' && $('#firstTimeThru').val() == 'true'){
		performADRSalesProgramSearch('salesProgram', true);
	}else if($('#firstTimeThru').val() == 'true'){
		performADRSalesProgramSearch('salesProgramAgentDefault', true);
	}*/
	if(empType == 'E' && $("#transactionProgress").val() == ''){
		performADRSalesProgramSearch('salesProgram', true);
	}else if($("#transactionProgress").val() == ''){
		performADRSalesProgramSearch('salesProgramAgentDefault', true);
	}
	
	showReorderErrorPopups(); 
	//Disable or enable Elements for Insurance Score if order count > 3
	 disableOrEnableInsScoreElements(document.aiForm.currentTab.value);

	truncateLongerNames();
	if ( $('#readOnlyMode').val() == 'Yes' ) {
		$('#clientEligibilityGroupId').prop('disabled',true).trigger("chosen:updated");
		$('#clientDistrictTownId').prop('disabled',true).trigger("chosen:updated");
		$('#clientInstitutionNameId').prop('disabled',true).trigger("chosen:updated");
	}
	
	if($('#salesProgram').val() != 'PREF_BK_RL' && $('#noPrefBookRole').val() == 'true'){
		$('#salesProgram option').each(function(){
			if (this.value == 'PREF_BK_RL') {
					$("#salesProgram option[value='PREF_BK_RL']").remove();
					triggerValueChange($('#salesProgram'));		
			}
		});
	}
	
	$("#rmvLookUp").on('click',function() {
		if(validateRmvParameters()){
			if($("#secondary_insured_operation").val()=="DELETE"
				|| ($("#secondary_insured_participantId").val()=='0' && $("#secondary_insured_operation").val()=="")){
				performRMVLookup(".rmvLincenseLookup[id=primary_insured_licenseNumber]");				
			} else{
				performRMVLookup(".rmvLincenseLookup");
			}
		}

	});
	
	handlePolicyState();
	
	handlePolicyTerm();
	
	handleProductCode();
	
	//52451 - firstTimeThru condition can't be used here. If there are any errors on client tab when we hit next, license fields are being protected.
	//But until client is actually saved, we should not deisable license and other RMV fields.
	//if($('#firstTimeThru').val()=='true'){
	if($("#transactionProgress").val() == '' || $('#transactionTypeCd').val() == 'ENDORSE') {
		showHideLicenseInfo(isRiskStateMA());
		//enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists());
		//#53699..existing NIs should not show RMV button/Status
		if(isEndorsement()){
			enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists() && checkIfSNIAdded());
			enableRMVButton(isRiskStateMA() && checkIfSNIAdded());
		} else {
			if($('#primary_insured_rmvLookupInd').val()!='Yes'){
				enableRMVButton(isRiskStateMA());
			}
			else if($('#secondary_insured_licenseState').val() == 'MA'){
				enableRMVButton(isRiskStateMA());
			}
			else{
				enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists());
			}
		}
		disableDateFieldsForSuccessfulRMVCall();
	} else if(isRiskStateMA()){
		disableFieldsForSuccessfulRMVCall();
		if($('#secondary_insured_licenseState').val() == 'MA'){
			enableRMVButton(isRiskStateMA());
		}
		else{
		if($('#secondary_insured_participantId').val()==0){
				//#56001....check driver status also...Rmv lookup button display should behave as same as driver page
				//enableRMVButton($('#primary_insured_rmvLookupInd').val()!='Yes' && checkIfAtleastOneMAInsuredExists());
				enableRMVButton(checkIfAtleastOneMAInsuredExistsWithValidDrvrStatus());
				
		} else{
				//#56001....check driver status also...Rmv lookup button display should behave as same as driver page
				//enableRMVButton(checkIfAtleastOneMAInsuredExists());
				enableRMVButton(checkIfAtleastOneMAInsuredExistsWithValidDrvrStatus());
		} 
		}
		//52282 - Server line error usually generates red rim around the field.
		//But this shouldnt happen for RMV looukup button
		$('#rmvLookUp').removeClass('inlineError');
	}
	
	//52894 - Need to revisit. State is not being persisted to other tabs
	if(isEndorsement()){
		//#54226..if license state= MA and lic state = MA and rmv lookup is successful then only disable
		if(isRiskStateMA()
		&& $('#primary_insured_licenseState').val()=='MA'
		&& $('#primary_insured_rmvLookupInd').val() =='Yes'
		) {
			$('#primary_insured_licenseState').prop('disabled',true).trigger('chosen:updated');
			if(!isMaipPolicy()) {
			$('#primary_insured_licenseNumber').prop('disabled',true);
			} else if(isMaipPolicy() && $("#primary_insured_licenseNumber").val() != '') {
				if ($('#primary_insured_endorsementDriverAddedInd').val() !='Yes') {
					$('#primary_insured_licenseNumber').prop('disabled',true);	
		}
			}
			if(isMaipPolicy() && $("#primary_insured_licenseNumber").val() == '') {
				$("#primary_insured_endorsementDriverAddedInd").val('Yes');
			}
		}
		//do not disabled for SNI. What if Add named insured was clicked?
		//$('#secondary_insured_licenseState').prop('disabled',true).trigger('chosen:updated');
		//$('#secondary_insured_licenseNumber').prop('disabled',true);
	}
	
	if($('#showStaleReportsModal').val()=='true'){
		$('#staleReportsModal').modal();
	}
	
	validateNHRenewalConversion();
	
	//TD 73955 - DO NOT BIND - Change Behavior of AI to eliminate the need to AMEND after a DNB Override
	if($('div > #policyNumber').val()!=''){
		var producerSelected = $('#policyProducerInput option:selected').val();
		performProducerPostSelection(producerSelected,'policyProducerInput');
	}
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
	//TD#59849  - Co-applicant fields should populate if martial status = Married/Domestic Partner
	if(!isEndorsement() && $("#transactionProgress").val() == ''){			
		var maritalStatusPrime = $('#primary_insured_maritalStatusCd').val();
 		
 		if(maritalStatusPrime == 'M' || maritalStatusPrime == 'Q' || maritalStatusPrime == 'X') {
 			secondaryApplicantAddInit(); 			
 			$('#secondary_insured_maritalStatusCd').val(maritalStatusPrime).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
 			$('#secondary_insured_maritalStatusCd_hidden').val(maritalStatusPrime);
 		}				
	}
	
	$( document ).ajaxStop(function( event, request, settings ) {
		if($('#compraterTransactionStatus').val() == 'HALF_BRIDGE'){
			nextTab(document.aiForm.currentTab.value, "comprater/initiateRMVOnClient");	
		}
	});	
	
	
		if($('#agency_hier_id').val() == "" ){
			setAgencyHierValue();
		}
		initialFormLoadProcessing();
	
});
	

//TD#73901 - NB Auto Quotes: Agent Profile Defaulting to --Select-- and HOLD:   
//Issue with Teachers Quote - agency profile and producer fields grayed out
function setAgencyHierValue(){

	$('#agency_hier_id').val($.trim($('#clientInfoIdentifier').val())).trigger('chosen:updated'); 
	
	if($("#transactionProgress").val() != ''){
		if( ($("#priorRatedPremAmt").val() != "" && $("#ratedInd").val() == "Yes")){
			$('#agency_hier_id').prop('disabled',true).trigger("chosen:updated");
		}
		if($("#ratedSource").val() == "CompRater"){
			$('#agency_hier_id').prop('disabled',false).trigger("chosen:updated");
		}
	}
}
	
//NH Renewal Conversion changes
function validateNHRenewalConversion() {
	
	if($('#policyStateCd').val() != 'NH') {
		return;
	}
	
	if ($('#policySourceCd').val() == 'ENDORSEMENT') {
		return;
	}
	
	var pimh = trimSpaces($("#primary_insured_maritalStatusCd_hidden").val());
	var pim = trimSpaces($("#primary_insured_maritalStatusCd").val());
	
	if(pimh != pim) {
		$('#primary_insured_maritalStatusCd_hidden').val('');
		$('#primary_insured_maritalStatusCd').trigger('blur');
	}
	
	var simh = trimSpaces($("#secondary_insured_maritalStatusCd_hidden").val());
	var sim = trimSpaces($("#secondary_insured_maritalStatusCd").val());
		
	if(simh != sim) {
		$('#secondary_insured_maritalStatusCd_hidden').val('');
		if($("#secondary_insured_firstName").is(":visible")) {
			$('#secondary_insured_maritalStatusCd').trigger('blur');
		}
	}
}

function updateMaritalStatusDDForNHRenewalConversion() {
	
	if($('#policyStateCd').val() != 'NH') {
		return;
	}
	
	if ($('#policySourceCd').val() == 'ENDORSEMENT') {
		return;
	}
	
	if ( $("#policyEffectiveDate").val() != "" && $("#nh_renewal_conversion_eff_date").val() != "" ) {
			
		var policyEffDt = Date.parse($("#policyEffectiveDate").val());
		var nhRenewalConversionEffDate = Date.parse($("#nh_renewal_conversion_eff_date").val());
		
		var piMaritalStatusCd = $("#primary_insured_maritalStatusCd option[value='Q']").val();
		var siMaritalStatusCd = $("#secondary_insured_maritalStatusCd option[value='Q']").val();
		
		if (policyEffDt >= nhRenewalConversionEffDate) {
			if (!(piMaritalStatusCd == null || piMaritalStatusCd == "" || piMaritalStatusCd == undefined)){
				$("#primary_insured_maritalStatusCd option[value='Q']").remove();
				$('#primary_insured_maritalStatusCd').trigger('chosen:updated');
			}
			
			if (!(siMaritalStatusCd == null || siMaritalStatusCd == "" || siMaritalStatusCd == undefined)){
				$("#secondary_insured_maritalStatusCd option[value='Q']").remove();
				$('#secondary_insured_maritalStatusCd').trigger('chosen:updated');
			}
			
		} else {
			if(piMaritalStatusCd == null || piMaritalStatusCd == "" || piMaritalStatusCd == undefined){
				$('#primary_insured_maritalStatusCd')
					.append('<option value="Q">Domestic Partner</option>')
					.prop('disabled',false)
					.trigger('chosen:updated');
				
			}
			if(siMaritalStatusCd == null || siMaritalStatusCd == "" || siMaritalStatusCd == undefined){
				$('#secondary_insured_maritalStatusCd')
					.append('<option value="Q">Domestic Partner</option>')
					.prop('disabled',false)
					.trigger('chosen:updated');
			}
		}
		
		validateNHRenewalConversion();
	}
}

function checkIfAtleastOneMAInsuredExists(){
	//TD 52966 - added additional check of primary rmvLookupInd based on below requirement
	/*RMV button is enabled on the Client page if the PNI is a MA DL state, and current call is not successful.
	RMV button is enabled on the Client page if there are 2 NI and the 2nd NI is a MA DL State.
	RMV button is disabled on the Client page if there is only one NI and their RMV Call is Successful
	RMV button is disabled on the Client page if there are 2 NI and PNI has a successful RMV call, and NI2 is a Non MA DL State.
	RMV button will be enabled again if the NI2 license state changes from "not MA" to "MA", or NI2 is added and a MA DL state selected.*/
	
	if(isEndorsement()){
		//PNI would already have been looked up successfully in ENDR. Check only SNI
		if ($('#secondary_insured_licenseState').val()=='MA' && $('#secondary_insured_licenseNumber').val() != '')
			return true;
		else
			return false;
	}else{
		if (($('#primary_insured_licenseState').val()=='MA' && $('#primary_insured_rmvLookupInd').val()!='Yes' && $('#primary_insured_licenseNumber').val() != '')
			|| ($('#secondary_insured_licenseState').val()=='MA' && $('#secondary_insured_licenseNumber').val() != ''))
			return true;
		else
			return false;
	}
}

function checkIfAtleastOneMAInsuredExistsWithValidDrvrStatus(){
	
	
	if(isEndorsement()){
		//PNI would already have been looked up successfully in ENDR. Check only SNI
		if ( $('#secondary_insured_licenseState').val()=='MA' && $('#secondary_insured_licenseNumber').val() != '' &&  isApplicantDriverEligibleForRmvLookUp($('#primary_insured_driverStatusCd').val()) )
			return true;
		else
			return false;
	}else{
		if ( ( $('#primary_insured_licenseState').val()=='MA' && $('#primary_insured_rmvLookupInd').val()!='Yes' && $('#primary_insured_licenseNumber').val() != '' && isApplicantDriverEligibleForRmvLookUp($('#primary_insured_driverStatusCd').val()) )
		  || ( $('#secondary_insured_licenseState').val()=='MA' && $('#secondary_insured_licenseNumber').val() != '' && isApplicantDriverEligibleForRmvLookUp($('#secondary_insured_driverStatusCd').val()) ) 
		  ) {
			return true;
		}else{
			return false;
		}
	}
}

function isApplicantDriverEligibleForRmvLookUp(driverStatus) {
	// below are not considered for rmv lookup now..(empty value considered)
	return (driverStatus != "N" && driverStatus != "P" && driverStatus != "NEV_LIC");
}

function checkIfSNIAdded() {	
	//55262-ENDTS: Client tab - RMV button disables if user clicks on another tab
	if($('#secondary_insured_rmvLookupInd').val() != 'Yes' && $('#secondary_insured_licenseNumber').is(':visible')){
			return true;
	}
	return ($('#secondary_insured_endorsementDriverAddedInd').val()=='Yes');	
}
	
function showHideLicenseInfo(show){
	if(show){
		// #54226...In endorsement don't set/overwrite. Only set it NB.
		if(!isEndorsement()){
			$('#primary_insured_licenseState').val('MA').removeClass('preRequired').trigger('chosen:styleUpdated').trigger('chosen:updated');
			$('#primary_insured_licenseState_hidden').val('MA');
		}
		$('.clsLicenseInfo').show();	
		enableRMVButton(isRiskStateMA() && checkIfAtleastOneMAInsuredExists());
	} else{
		$('#primary_insured_licenseState_hidden,#secondary_insured_licenseState_hidden').val('');
		$('.clsLicenseInfo').hide();
		//52900-On Change of Policy State, Required Entry inline messages are not going away.
		clearInLineRowError('primary_insured_licenseNumber', 'primary_insured_licenseNumber_Error_Col_app', fieldIdToModelRmvResultRow['rmvSuccess'], 'primary_insured_licenseNumber', 'app', null);
		clearInLineRowError('primary_insured_licenseState', 'primary_insured_licenseState_Error_Col_app', fieldIdToModelRmvResultRow['rmvSuccess'], 'primary_insured_licenseState', 'app', null);
	}
}	

function enableRMVButton(enable){	
	if(enable){
		$('#rmvLookUp').show();	
		$('#rmvLookUp_disable').hide();		
	}else{
		$('#rmvLookUp').hide();	
		$('#rmvLookUp_disable').show();
	}
}
	
//window.onload=initialFormLoadProcessing;
var errorMessages;
var blnHandleSubmit = false;

//43883-First or Last Name with 33 Characters or More
//43633-500 error when i try to rate this policy
function truncateLongerNames(){
	$('.clsFirstName,.clsLastName').each(function(){
		var name = $(this).val();
		if(name !=null && name != undefined && name.length>32){
				$(this).val(name.substring(0,32));
		}
	});
	
	$('.clsMiddleName').each(function(){
		var name = $(this).val();
		if(name !=null && name != undefined && name.length>15){
				$(this).val(name.substring(0,15));
		}
	});
	
}

function handlePolicyState(){
	//52756 - Policy State is protected on Client Tab for multi-state log on before proceeding to Driver Tab
	//52228 - AI2 let me change State on Client page after getting quote number on Driver pg
	if($('div > #policyNumber').val()!=''){
		$('#policyStateCd').prop('disabled', true).trigger("chosen:updated");
	}else{
		//57141-State field not protected on client screen for 1 state agency CT
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

function handlePolicyTerm(){
	//TD 55987 - Client Tab, Policy Term is defaulted to Semi-Annual 6 Month for MA CT and NH IA Policies
	if($('#policyStateCd').val()!='NJ' && $('#policyStateCd').val()!='PA'){
		$('#njPolicyTerm').val('12').trigger("chosen:updated");
	}
	// Pru-12 Month enable start 
	
	
	if(!isEndorsement()){
		var isPruPolicy = $('#isPruPolicy').val() ||'';
		var isRated =  $('#ratedInd').val() ||'';
		var uwCompanyCd = isEmptyStr($('#policyUwCompanyCd').val()) ? $('#uwCompanyCd').val() : $('#policyUwCompanyCd').val();
		if(isRated !== 'Yes' && isPruPolicy === 'Yes' && 'ALN_TEACH' !== uwCompanyCd){
			$('#njPolicyTerm').prop('disabled',false).trigger("chosen:updated");
		}
	}
	
	// Pru-12 Month enable end 
}

function handleProductCode(){
	if($('#policyStateCd').val()!='NJ') {
		//$('#policyProductCd').attr('disabled', true);
		$('#policyProductCd').prop('disabled',true).trigger("chosen:updated");
		if($('#policyProductCd').hasClass('inlineError')){
			$('#policyProductCd').val('').trigger("chosen:updated");
		}
		$('.policyProductCdRow').addClass('hidden');
		$('#policyProductCd_Error').addClass('hidden');//TD 56258
		/*$('#policyProductCd option').each(function() {
			if($(this).text() == 'Teachers Personal Auto'){
				$(this).replaceWith('<option value="ALN_PA" data-support="Teachers">Teachers Personal Auto</option>');
			}else{
				$(this).replaceWith('<option value="ALN_PA" data-support="Prime">Personal Auto</option>');
			}
		});*/
	}else{
		$('.policyProductCdRow').removeClass('hidden');
		$('#policyProductCd').prop('disabled',false).trigger("chosen:updated");
		//$('#policyProductCd').attr('disabled', false);
	}
}

function showFieldValueInTooltip(container,element)
{
	var toolTipFieldId = $(element).attr('id');
	var toolTipFieldValue = $(element).val();
	if(typeof toolTipFieldValue != 'undefined' && toolTipFieldValue != "" && toolTipFieldValue != null){
		showValueInTooltip(container, toolTipFieldValue);
	}
}

function stopNextOnClient(){
	$('#myErrorModal').modal();
}

function validateBranchProduct(){
	var branch_hier_id = $('#branch_hier_id').val();
	var policyProductCd = $('#policyProductCd').val();
	var policyExpirationDate = $("#policyExpirationDate").val();
	var fiServAuthId = $("#fiServAuthId").val();
	var agency_heir_id = $('#agency_hier_id').val();
	
	var productCd = $("#policyProductCd").attr("id");
	var errorMessageID = '';
	
	// Pru-12 Month disable start 
	
	
	var stateCd = $('#policyStateCd').val() || '';
	if(!isEndorsement() && stateCd == 'NJ'){
		var isRated =  $('#ratedInd').val() ||'';
		var uwCompanyCd =  $('#uwCompanyCd').val() || '';
		var branchLevelCode = ($('#branch_id').val() || '').toUpperCase();
		var channelCd = ($('#policyChannelCd').val() || '').toUpperCase();
		var policyKey = $('#policyKey').val() || '';
		var termValue = $('#njPolicyTerm').val() || '';
		if(isRated !== 'Yes'){
			if('ALN_TEACH' === uwCompanyCd){
						$('#njPolicyTerm').val('12').prop('disabled',true).trigger("chosen:updated");
			}
			else{
					if(channelCd === 'IA'){
							$('#njPolicyTerm').val('12').prop('disabled',true).trigger("chosen:updated");
					}else if(channelCd === 'DIRECT'){
						$('#njPolicyTerm').val('6').prop('disabled',true).trigger("chosen:updated");
					}
					else if(channelCd === 'CAPTIVE' ){
							if(branchLevelCode === 'RETAIL'){
								if(policyKey.length>1 && termValue.length>0){
									$('#njPolicyTerm').prop('disabled',false).val(termValue).trigger("chosen:updated");
								}else{
									$('#njPolicyTerm').prop('disabled',false).trigger("chosen:updated");	
								}	
								
							}else{
								$('#njPolicyTerm').val('6').prop('disabled',true).trigger("chosen:updated");
						}
					}
				}	
			validateExpirationDate();
		}
	}
	
	// Pru-12 Month disable end 
	
	
	if(policyExpirationDate != null || policyExpirationDate !='' || policyExpirationDate != undefined){
		var policyEffDate = $("#policyEffectiveDate").val();
		if(policyEffDate != null && policyEffDate !='' && policyEffDate != undefined){
			if(branch_hier_id !=null && branch_hier_id !='' && branch_hier_id !=undefined && policyProductCd !=null && policyProductCd !='' && policyProductCd !=undefined)
			{
				if($('#policyProducerInput option').length <=1){
					errorMessageID = 'policyProductCd.browser.inLine.invalid';		
				}
			}
			if(agency_heir_id !=null && agency_heir_id.length > 0 && fiServAuthId == '' && fiServAuthId.length == 0)
			{
				if( fiServAuthId.length == 0){
					errorMessageID = 'policyProductCd.browser.inLine.invalid';		
				}
			}
	}
		showClearInLineErrorMsgsWithMap(productCd, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
}
}


function clearCityDropDown(fieldId){
	
	if(fieldId.indexOf('mailing') != -1){
	$('#mailingCityName').empty();
	var options_select = '';
	options_select+='<option value="">Select</option>';
	$('#mailingCityName').append(options_select);
	
	//$('#cityName').addClass('required');
	//$('#cityName').addClass('preRequired');
	$('#mailingCityName').prop('disabled',true);
	if( $('#mailingAddressCity').length ){
		$('#mailingAddressCity').val("");
	}
	$('#mailingCityName').trigger('chosen:updated');
	}
	else
		{
		
		$('#cityName').empty();
		var options_select = '';
		options_select+='<option value="">Select</option>';
		$('#cityName').append(options_select);
		
		//$('#cityName').addClass('required');
		//$('#cityName').addClass('preRequired');
		$('#cityName').prop('disabled',true);
		if( $('#addressCity').length ){
			$('#addressCity').val("");
		}
		$('#cityName').trigger('chosen:updated');
		
		}
}

function policyEffectiveDateChanged(effDate){
	var sValue = effDate.value;
	if(sValue != "" && callSecurityPolDate){
		var op = validatePolicyEffectiveDate(effDate);
		if(op)
		{
			var effectiveDate = $("#policyEffectiveDate").val();
			//call security service to obtain details
			getPolicyEffDateFromSecurity(effectiveDate);
			//calculatePolicyExpiryDate();
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

function isEmptyStr(strValue){
	if(strValue == null || strValue == undefined || strValue.length<1){
		return true;
	}
	else return false;
}

function hasValidParamsSecurityDate(){
	if(isEmptyStr($('#uwCompanyCd').val()) && isEmptyStr($('#policyUwCompanyCd').val())){
		return false;
	}
	if(isEmptyStr($('#channelCd').val()) && isEmptyStr($('#policyChannelCd').val())){
		return false;
	}
	if(isEmptyStr($('#companyCd').val()) && isEmptyStr($('#policyCompanyCd').val())){
		return false;
	}
	return true;
}


function getPolicyEffDateFromSecurity(effDate){
	var state = $('#stateCd').val();
	//why lob is PPA it should be PA
	var lob = 'PPA';
	var channel = $('#policyChannelCd').val();
	var company = $('#companyCd').val();
	var uw_company = $('#policyUwCompanyCd').val();
	var branch_hier_Id = $('#branch_hier_id').val();
	var policyProductCd = $('#policyProductCd').val();
	if(uw_company == null || uw_company =='' || uw_company == undefined || uw_company.length < 1){
		uw_company = $('#uwCompanyCd').val();
	}
	// var securityDate = { "objEff":{"LOB" : lob, "Channel" : channel}};
	// var jsonData = JSON.stringify(securityDate);
	//blockUser();
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "/aiui/client/polEffDateValidate?lob="+lob+ '&channel='+channel+ '&state='+state+ '&company='+company+ '&uw_company='+uw_company+ '&effDate='+effDate +'&branch_hier_Id=' +branch_hier_Id +'&policyProductCd=' +policyProductCd,
        type: "POST",
        dataType: "JSON",
        timeout: 3000,
        //data:jsonData,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	var msg = response.message;
        	if(msg !='valid' && msg != 'notConfigured'){
        		$("#expDt").text('');
				$("#policyExpirationDate").val('');
        		errorMessages['policyEffectiveDate.browser.inLine.Security']=response.message;
        		var effDateId = $("#policyEffectiveDate").attr("id");
        		var errorMessageID = 'policyEffectiveDate.browser.inLine.Security';
        		showClearInLineErrorMsgsWithMap(effDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
        	}
        	else{
        		calculatePolicyExpiryDate();
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	     // alert('error accessing security database');
          }
        ,
        complete: function(){
        //	$.unblockUI();
        }
    });
}

function validateIdenticalSSNs(ssn){
	var identicalSsn = checkForIdenticalSSNS();
	if(identicalSsn){
		displayIdenticalSSNError();
	}
	else{
		var ssnPrimary = $('#insured_mask_ssn_PRIMARY').val();
		var ssnSecondary = $('#insured_mask_ssn_SECONDARY').val();
		
		var priTxtField = $('#primary_insured_mask_ssn_PRIMARY').val();
		var secTxtField = $('#secondary_insured_mask_ssn_SECONDARY').val();
		
		var priSsnArr  = ssnPrimary.split('-');
		var secSsnArr = ssnSecondary.split('-');
		//alert('ssnPrimary ='+ssnPrimary+'ssnSecondary ='+ssnSecondary);
		if(ssnPrimary!=null && ssnPrimary.length ==11 && ssnSecondary!=null && ssnSecondary.length ==11 && ssnPrimary != ssnSecondary)
		{
			
			var secMod = true;
			if(ssn.id.indexOf('PRIMARY')!=-1){
				secMod = false;
			}
			if(secMod && validSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY')) && priSsnArr.length == 3){
				var elm = 'primary_insured_mask_ssn_PRIMARY';
				var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
				maskSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY'),hdnField);
				clearIdenticalSSNError();
			}
			if(!secMod && validSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY')) && secSsnArr.length == 3){
				var elm = 'secondary_insured_mask_ssn_SECONDARY';
				var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
				maskSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY'),hdnField);
				clearIdenticalSSNError();
			}
			
		}
		
		//removing ssn scenario when applicant/co-aplicant would have dissimilar values
		//user updating primary ssn
		if(ssn.id.indexOf('PRIMARY')!=-1){
			if(ssnPrimary == null || ssnPrimary == ''){
				if(ssnSecondary == null || ssnSecondary == '' || (validSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY')) && secSsnArr.length == 3)){
					if(ssnSecondary != null && ssnSecondary != '' && ssnSecondary !='Optional'){
					var elm = 'secondary_insured_mask_ssn_SECONDARY';
					var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
					maskSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY'),hdnField);
					}
					clearIdenticalSSNError();
				}
			}
			
			if(ssnPrimary !=null && ssnPrimary.length>1 && !validSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY'))){
				if(ssnSecondary == null || ssnSecondary == '' || (validSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY')) && secSsnArr.length == 3)){
					if(ssnSecondary != null && ssnSecondary != '' && ssnSecondary !='Optional'){
					var elm = 'secondary_insured_mask_ssn_SECONDARY';
					var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
					maskSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY'),hdnField);
					}
					var strErrorTag = 'secondary_insured_mask_ssn_SECONDARY.browser.inLine'
					var errorMessageID = '';
					var ssnId = $('#secondary_insured_mask_ssn_SECONDARY').attr('id');
					showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
				}
			}
		}
		
		if(ssn.id.indexOf('SECONDARY')!=-1){
			if(ssnSecondary == null || ssnSecondary == ''){
				if(ssnPrimary == null || ssnPrimary == '' || (validSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY')) && priSsnArr.length == 3)){
					if(ssnPrimary != null && ssnPrimary != '' && ssnPrimary !='Optional' ){
					var elm = 'primary_insured_mask_ssn_PRIMARY';
					var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
					maskSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY'),hdnField);
					}
					clearIdenticalSSNError();
				}
			}
			
			if(ssnSecondary !=null && ssnSecondary.length>1 && !validSSN(document.getElementById('secondary_insured_mask_ssn_SECONDARY'))){
				if(ssnPrimary == null || ssnPrimary == '' || (validSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY')) && priSsnArr.length == 3)){
					if(ssnPrimary != null && ssnPrimary != '' && ssnPrimary !='Optional'){
					var elm = 'primary_insured_mask_ssn_PRIMARY';
					var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
					maskSSN(document.getElementById('primary_insured_mask_ssn_PRIMARY'),hdnField);
					}
					var strErrorTag = 'primary_insured_mask_ssn_PRIMARY.browser.inLine';
					var errorMessageID = '';
					var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
					showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
				}
			}
			
		}
	}
}

function displaySSNError(ssn){
	var strErrorTag = ssn.id+'.browser.inLine';
	var errorMessageID = 'Invalid';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	var ssnId = ssn.id;
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
	if(ssn.id.indexOf('primary_insured_mask_ssn_PRIMARY')!=-1){
		var pr = $('#primary_insured_mask_ssn_PRIMARY').val();
		$('#insured_mask_ssn_PRIMARY').val(pr);
	}
	if(ssn.id.indexOf('secondary_insured_mask_ssn_SECONDARY')!=-1){
		var sec = $('#secondary_insured_mask_ssn_SECONDARY').val();
		$('#insured_mask_ssn_SECONDARY').val(sec);
	}
}

function clearSSNError(ssn){
	//alert('clear ssn error');
	var errorMessageID = '';
	var ssnId = ssn.id;
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
}

function displayIdenticalSSNError(){
	var strErrorTag = 'primary_insured_mask_ssn_PRIMARY.browser.inLine';
	var errorMessageID = 'Identical';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);

	strErrorTag = 'secondary_insured_mask_ssn_SECONDARY.browser.inLine'
	errorMessageID = 'Identical';
	errorMessageID = strErrorTag+'.'+errorMessageID;
	ssnId = $('#secondary_insured_mask_ssn_SECONDARY').attr('id');
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
	//$('#primary_insured_mask_ssn_PRIMARY').val("");
	//$('#secondary_insured_mask_ssn_SECONDARY').val("");
}

function clearIdenticalSSNError(){
	var strErrorTag = 'primary_insured_mask_ssn_PRIMARY.browser.inLine';
	var errorMessageID = '';
	var ssnId = $('#primary_insured_mask_ssn_PRIMARY').attr('id');
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);

	strErrorTag = 'secondary_insured_mask_ssn_SECONDARY.browser.inLine'
	ssnId = $('#secondary_insured_mask_ssn_SECONDARY').attr('id');
	showClearInLineErrorMsgsWithMap(ssnId, errorMessageID, fieldIdToModelErrorRow['applicants'],'app',  errorMessages, addDeleteCallback);
}

function checkForIdenticalSSNS(){
	var ssnPrimary = $('#insured_mask_ssn_PRIMARY').val();
	var ssnSecondary = $('#insured_mask_ssn_SECONDARY').val();
	if(ssnPrimary!=null && ssnPrimary.length ==11 && ssnSecondary!=null && ssnSecondary.length ==11 && ssnPrimary == ssnSecondary){
		//unmask the values as they are identical
		$('#primary_insured_mask_ssn_PRIMARY').val(ssnPrimary);
		$('#secondary_insured_mask_ssn_SECONDARY').val(ssnSecondary);
		return true;
	}
	else
		return false;
}


function fmtAddress(address,e){

	var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 8) return true;
    var keynum;
    var keychar;

    //[,.#\\/A-Za-z0-9\\s'&-]
    var charcheck = /[\\/,.#a-zA-Z0-9-'& ]/;
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
   //alert(keychar);
    if( charcheck.test(keychar))
    	{
    		return true;
    	}
   else
    	{
    		e.preventDefault();

   	}
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



/**
 * only called when date entered is partial and we know we still will be sending to server for validation
 * and DateTime binding going to fail anyways
 */
function checkClientPreSubmit(){
	clearDateFormatValues(); // clear out watermark before submitting
	return;
	// Disabled 11-2013 AJP
}

/**
 * User enters Add NI from endorsment bubble
 * @returns
 */
function secondaryApplicantEndBubbleAddInit(){
	var secInsuredExistsInPstar = $('#secondary_insured_pstarexists').val();
	if(secInsuredExistsInPstar != 'Yes'){
		secondaryApplicantAddInit();
	}
	else{
		$("#secondary_insured_operation").val("");
	}
}


function secondaryApplicantAddInit(isMarried){
	$('.secondaryInsured').show();
	$("#addCoApplicant").hide();
	$("#addCoApplicant_disable").show();
	$('#deletePrimaryApplicantIcon').show();
	$("#disableCoApplicantValidation").val("No");
	$("#secondary_insured_operation").val("ADD");
	
	$("#secondary_insured_firstName").prop('disabled',false);
	$("#secondary_insured_lastName").prop('disabled',false);
	$("#secondary_insured_licenseState").prop('disabled',false);
	//51707 - Co Applicants state is changing to MA when entering an out of state license when clicking on the PNI Marital Status
	if(isRiskStateMA() && $("#secondary_insured_licenseState").val()==''){
		$("#secondary_insured_licenseState").val('MA').removeClass('preRequired');
		$('#secondary_insured_licenseState_hidden').val('MA');
	}
	$("#secondary_insured_licenseState").trigger('chosen:styleUpdated').trigger('chosen:updated');
	$("#secondary_insured_licenseNumber").prop('disabled',false);
	//vmaddiwar - TD 52415 - Client Tab - Co applicant Date of Birth Field 'unlocks' when selecting a marital status for Applicant 
	if($('#secondary_insured_rmvLookupInd').val() != 'Yes'){
		$("#secondary_insured_birth_date").prop('disabled',false);
	}
	
	//i am deleting and adding back
	
	if(isEndorsement()){
	$("#secondary_insured_participantId").val("0");
	}
	else{
		if($("#secondary_insured_participantId").val() == null || $("#secondary_insured_participantId").val()=='')
		{
			$("#secondary_insured_participantId").val("0");
		}
	}
	/*
	if($("#secondary_insured_participantId").val() == null || $("#secondary_insured_participantId").val()=='')
	{
		//$("#secondary_insured_participantId").val("0");
		if (isEndorsement()) {
			// srini...set the new participant id for newly adding PNI2.
			$("#secondary_insured_participantId").val("1111");
		} else {
			$("#secondary_insured_participantId").val("0");
		}
	} else {
		if (isEndorsement()) {
			if ( $("#secondary_insured_participantId").val()=='0' ) {
				// srini...set the new participant id for newly adding PNI2.
				$("#secondary_insured_participantId").val("1111");
			} if ( $("#secondary_insured_participantId").val()=='1111' ) {
				// dont do anything. 
			} else {
				// reset the operation since secondary insured exists. treat him as updated
				$("#secondary_insured_operation").val("");
			}
			
		}
	}
	*/
	$('#secondary_insured_pstarexists').val("");
	//38141-PRIME 2.0 - Endorsement Client- Marital Status does not auto populate. PRIME policy
	//It is being taken care of with primary_insured_maritalStatusCd change function
/*	if(isMarried !=null && isMarried !== undefined && isMarried !='' && isMarried == 'M'){
		$('#secondary_insured_maritalStatusCd').val('M').trigger('chosen:updated');
		// update the hidden var also
		$('#secondary_insured_maritalStatusCd_hidden').val('M');
	}*/
	// if this is not the first time thru, 
	// then we need to rebind co applicant columns for error handling
	
	if($("#transactionProgress").val() != '') {
	//if($('#firstTimeThru').val() != 'true'){
		bindCoApplicantColumn();
	}
	
	if(isEndorsement()){
		//45460 - for Driver firstTimePassThrough
		$('#transactionProgress').val('');
		//53638-- yellow bgcolor for required fields not showing in ENDR
		bindCoApplicantColumn();
	}
}

function sourceOfBusinessNonExistingAgencyCustoomer(){
	$('#salesProgramOverrideInd').val("No");
	$('#salesProgramOverride').prop('checked',false);
	$('#salesProgram').val("").trigger('chosen:updated');
	$('.salesProgramOverride_class').hide();
	$('.salesProgram_class').hide();
	$('.priorCarrierName_class').hide();
	$('.priorCarrierPolicyNumber_class').hide();
	$('#salesProgramEmployeeDefault').val("");
	$('#pref_Book_Ind').val('No');
	$('#preOverrrideSalesProgramCd').val("");
	$('.priorCarrierPolicyTermInfo').addClass('hidden');
	$('.activeCurrentPolicyInfo').addClass('hidden');
	$('#priorCarrirePolicyEfftDateInfo').addClass('hidden');
	$('#priorCarrierPolicyEfftDate').val("");
	$('.clspriceTransferCredit').addClass('hidden');
	/*$('.currentPolicyTerm_class').hide();
	$('#currentPolicyTerm').val("12").trigger("changeSelectBoxIt");
	$('.currentPolicyPremium_class').hide();
	$('#currentPolicyPremium').val("");
	$('.currentPolicyPremiumTerm_class').hide();
	$('#currentPolicyPremiumTerm').val("");*/
	//clear all error messages associated
	//removeCurrentCarrierOptionMsgs();
}

/*function salesProgramNotBookRoll(){
	$('.currentPolicyTerm_class').hide();
	$('#currentPolicyTerm').val("12").trigger("changeSelectBoxIt");
	$('.currentPolicyPremium_class').hide();
	$('#currentPolicyPremium').val("");
	$('.currentPolicyPremiumTerm_class').hide();
	$('#currentPolicyPremiumTerm').val("");
	removeCurrentCarrierOptionMsgs();
}*/

function validatePremiumAmt(){}

function removeCurrentCarrierOptionMsgs(){
	/*var strErrorTag = 'priorCarrierName.browser.inLine';
	var errorMessageID = '';
	var priorCarrierName = $('#priorCarrierName').attr('id');
	showClearInLineErrorMsgsWithMap(priorCarrierName, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);

	var strErrorTag = 'currentPolicyPremium.browser.inLine';
	var errorMessageID = '';
	var currentPolicyPremium = $('#currentPolicyPremium').attr('id');
	showClearInLineErrorMsgsWithMap(currentPolicyPremium, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);

	var strErrorTag = 'currentPolicyPremiumTerm.browser.inLine';
	var errorMessageID = '';
	var currentPolicyPremiumTerm = $('#currentPolicyPremiumTerm').attr('id');
	showClearInLineErrorMsgsWithMap(currentPolicyPremiumTerm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);*/
}

function salesProgramIsBookRoll(){
	/*$('.currentPolicyTerm_class').show();
	$('.currentPolicyPremium_class').show();
	$('.currentPolicyPremiumTerm_class').show();*/
}

function secondaryApplicantResetMaritalStatus(){
	$('#secondary_insured_maritalStatusCd').val("").trigger('chosen:updated');
}

function fmtPhone(elm,e) {
	var phone = elm.value;
	var phoneId = elm.id;
	var re = /\D/g;
	var ctrlPressed = false;
	if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
	if(e.keyCode == 65){
		if(ctrlPressed){
			ctrlPressed=false;
			return;
		}
	}
	
	if(e.keyCode == 46 ||
    e.keyCode == 8 ||
    e.keyCode == 37 ||
    e.keyCode == 39 ||
    e.keyCode == 13 ||
    e.keyCode == 9 ||
    e.keyCode == 17 ||
    e.keyCode == 65)
    {
		if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
		if(ctrlPressed){
			if(e.keyCode == 65){
				ctrlPressed=false;
			}
		}

	}
	/*if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112){}*/
	else{
		ctrlPressed = false;
		phone=phone.replace(re,"");
		if(parseInt(phone.length) >=12){
			var dshSplit = phone.split("-");
			var tmpPhone ='';
			for(var i=0;i<dshSplit.length;i++){
				tmpPhone = tmpPhone+dshSplit[i];
			}
			phone = tmpPhone.substring(0,9);
		}
		if(phone.length < 13) {
		var  splitDash = phone.split("-");
		if(splitDash.length==3 && splitDash[0].length<=3 && splitDash[1].length<=3 && splitDash[2].length<=4){
			var start = $(elm).prop("selectionStart");
			var pos = $(elm).getCursorPosition();
			$(elm).val(phone).caretTo(pos);
		}
		else{
		phone = phone.replace("-","");
		if(phone.length >= 3){
			if(phone.substr(3,1) != "-") {
				phone = phone.substr(0,3) + "-" + phone.substr(3);
			}
		}
		if(phone.length >=7){
			if(phone.substr(7,1) != "-") {
				phone = phone.substr(0,7) + "-" + phone.substr(7);
			}
		}
		var start = $('#'+phoneId).prop("selectionStart");
	    var pos = $('#'+phoneId).getCursorPosition();
	    if(phone.length ==4 || phone.length ==8){
	    	pos=pos+1;
	    }
	    $('#'+phoneId).val(phone).caretTo(pos);
	}
	}
	}
}

//remove this when endorsement is also moved on to new input mask
function fmtDateClient(elm,e) {
	var effDate = elm.value;
	var dateId = elm.id;
	var re = /\D/g;
	var ctrlPressed = false;

	if(e.shiftKey == true && e.KeyCode == 16){
		return;
	}

	if(e.keyCode == 191){
		if(effDate.length==2){
			if(effDate.indexOf("/") !=-1)
			{
				effDate = '0'+effDate;
			}
		}
		if(effDate.length==5){
			var datSplit = effDate.split("/");
			if(datSplit.length ==3)
			{
				effDate = datSplit[0]+'/'+'0'+datSplit[1]+'/';
			}
		}
	}

	if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
	if(e.keyCode == 65 || e.keyCode ==97){
		if(ctrlPressed){
			ctrlPressed=false;
			return;
		}
	}
	if(e.keyCode == 46 ||
    e.keyCode == 8 ||
    e.keyCode == 37 ||
    e.keyCode == 39 ||
    e.keyCode == 13 ||
    e.keyCode == 9 ||
    e.keyCode == 17 ||
    e.keyCode == 65 || e.keyCode ==97)
    {
		if(e.keyCode == 17)
		{
			ctrlPressed = true;
		}
		if(ctrlPressed){
			if(e.keyCode == 65 || e.keyCode ==97){
				ctrlPressed=false;
			}
		}

	}
	else{
		ctrlPressed=false;
	if(effDate.length < 11) {

		var  splitDash = effDate.split("/");
		if(splitDash.length==3 && splitDash[0].length<=2 && splitDash[1].length<=2 && splitDash[2].length<=4){
			var start = $(elm).prop("selectionStart");
			var pos = $(elm).getCursorPosition();
			$(elm).val(effDate).caretTo(pos);
	}
		else{
		effDate = effDate.replace("/","").replace(re,"");
		 if(effDate.length >= 2 ){
			if(effDate.substr(2,1) != "/") {
				effDate = effDate.substr(0,2) + "/" + effDate.substr(2);
			}
		}

		if(effDate.length >=5){
			if(effDate.substr(5,1) != "/") {
					effDate = effDate.substr(0,5) + "/" + effDate.substr(5);

			}
		}
		var start = $('#'+dateId).prop("selectionStart");
	    var pos = $('#'+dateId).getCursorPosition();
	   
	    if(effDate.length ==3 || effDate.length ==6){
	    	pos=pos+1;
	    }
	    $('#'+dateId).val(effDate).caretTo(pos);
	}
	}
	}
}

function fmtSSNClient(elm,e) {
	// check for valid characters before formatting
	var ssn = elm.value;
  var re = /\D/g;

  if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112)
	{

	}
  /*if (event.keyCode == 46 ||
	        event.keyCode == 8 ||
	        event.keyCode == 37 ||
	        event.keyCode == 39 ||
	        event.keyCode == 38 ||
	        event.keyCode == 40 ||
	        event.keyCode == 13 ||
	        event.keyCode == 9) {
	        // let it happen
	    }*/
  else{
 	  if(ssn.length < 11) {
		ssn = ssn.replace("-","").replace(re,"");
		if(ssn.length >= 3){
			if(ssn.substr(3,1) != "-" && (!isEndorsement())) {
				ssn = ssn.substr(0,3) + "-" + ssn.substr(3);
			}
		}

		if(ssn.length >=6){
			if(ssn.substr(6,1) != "-" && (!isEndorsement())) {
				ssn = ssn.substr(0,6) + "-" + ssn.substr(6);
			}
		}

		$(elm).val(ssn);
	}

  else {
  	// ssn's already masked
  	// if user tries to delete any chars, force them to re-enter ssn
  	if((ssn.substr(6,5) == "-****") && (e.keyCode == 8))
  		$(elm).val("");
  }
  }
}

function checkPartialInvalidDateFormats(dateString){
	if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
		return 'Invalid';
	else
    return '';
}

function validateCurrentPolicyPremium(currentPolicyPremium){
	var strID = currentPolicyPremium.id;
	//var isValidDouble = checkEnteredPremiumAmt($('#currentPolicyPremium').val());
	validateNameClient('',currentPolicyPremium, 'Yes', 'currentPolicyPremium.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateCurrentPremiumEffDate(currentPolicyPremiumTerm){
	var strID = currentPolicyPremiumTerm.id;
	var op=validatePolicyEffDate('',currentPolicyPremiumTerm,'Yes', 'currentPolicyPremiumTerm.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatePrimaryInsuredMaritalStatus(primary_insured_maritalStatusCd){
	var strID = primary_insured_maritalStatusCd.id;
	validateNameClient('app_marital_status',primary_insured_maritalStatusCd, 'Yes', 'primary_insured_maritalStatusCd.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validateSecondaryInsuredMaritalStatus(secondary_insured_maritalStatusCd){
	var strID = secondary_insured_maritalStatusCd.id;
	validateNameClient('app_marital_status',secondary_insured_maritalStatusCd, 'Yes', 'secondary_insured_maritalStatusCd.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validateSourceOfBusiness(clientSourceOfBusinessCode){
	var strID = clientSourceOfBusinessCode.id;
	validateNameClient('',clientSourceOfBusinessCode, 'Yes', 'clientSourceOfBusinessCode.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateReportRequiredIndicator(currentReportRequiredIndicator)
{
	var strID = currentReportRequiredIndicator.id;
	validateNameClient('',currentReportRequiredIndicator, 'Yes', 'currentReportRequiredIndicator.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	checkValueClient(currentReportRequiredIndicator);
}

function validateReferralSource(clientReferralSourceCd)
{
	var strID = clientReferralSourceCd.id;
	validateNameClient('',clientReferralSourceCd, 'Yes', 'clientReferralSourceCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatePolicyProducer(policyAgencyInput){
	var strID = policyAgencyInput.id;
	return validateNameClient('',policyAgencyInput,'Yes', 'policyProducerInput.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatePrimaryInsuredFirstName(primary_insured_firstName){
	var strID = primary_insured_firstName.id;
	//validateNameClient('app_first_name',primary_insured_firstName, 'Yes', 'primary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	validateClientFirstLastNames('app_first_name',primary_insured_firstName, 'Yes', 'primary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '')
}

function validateSecondaryInsuredFirstName(secondary_insured_firstName){
	var strID = secondary_insured_firstName.id;
	//validateNameClient('app_first_name',secondary_insured_firstName,'Yes', 'secondary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	validateClientFirstLastNames('app_first_name',secondary_insured_firstName,'Yes', 'secondary_insured_firstName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validatePrimaryInsuredLastName(primary_insured_lastName){
	var strID = primary_insured_lastName.id;
	//validateNameClient('app_last_name',primary_insured_lastName, 'Yes', 'primary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	validateClientFirstLastNames('app_last_name',primary_insured_lastName, 'Yes', 'primary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validateSecondaryInsuredLastName(secondary_insured_lastName){
	var strID = secondary_insured_lastName.id;
	//validateNameClient('app_last_name',secondary_insured_lastName,'Yes', 'secondary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	validateClientFirstLastNames('app_last_name',secondary_insured_lastName,'Yes', 'secondary_insured_lastName.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
}

function validatePrimaryInsuredBirthDate(primary_insured_birth_date){
	var strID = primary_insured_birth_date.id;
	//testDateValidity(strID);
	if(strID.indexOf("endorsement") ==-1){
	validateClientBirthDate('app_birth_date',primary_insured_birth_date,'Yes', 'primary_insured_birth_date.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	}
	else
		{
			validateClientBirthDate('app_birth_date',primary_insured_birth_date,'Yes', 'endorsement_primary_insured_birth_date.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
		}
}

function validateSecondaryInsuredBirthDate(secondary_insured_birth_date){
	var strID = secondary_insured_birth_date.id;
	if(strID.indexOf("endorsement") ==-1){
	validateClientBirthDate('app_birth_date',secondary_insured_birth_date,'Yes', 'secondary_insured_birth_date.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
	}
	else
		{
			validateClientBirthDate('app_birth_date',secondary_insured_birth_date,'Yes', 'endorsement_secondary_insured_birth_date.browser.inLine', fieldIdToModelErrorRow['applicants'], '');
		}
}

function validatePolicyEffectiveDate(policyEffectiveDate){
	var strID = policyEffectiveDate.id;
	var op = validatePolicyEffDate('',policyEffectiveDate,'Yes', 'policyEffectiveDate.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	return op;
}

function validateAddressLine1(addrLineTxt,event){
	var strID = addrLineTxt.id;
	if(strID.indexOf('addrLine1Txt')!=-1)
	{
		validateRequiredAddressAndNotNull('residence',addrLineTxt,'Yes', 'addrLine1Txt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
		validatePostAddress('residence',addrLineTxt);
		validatePMBAddress('residence',addrLineTxt);
	}
	if(strID.indexOf('addrLine2Txt')!=-1)
	{
		validateRequiredAddressAndNotNull('residence',addrLineTxt,'Yes', 'addrLine2Txt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
		validatePostAddress('residence',addrLineTxt);
		//53893.. # symbol should be allowed in address line 2.. so seperated if any other changes come later.
		//validatePMBAddress('residence',addrLineTxt);
		validatePMBAddressForAddrLine2('residence',addrLineTxt);
	}

	if(strID.indexOf('mailingAddrLine1Txt')!=-1)
	{
		validateRequiredAddressAndNotNull('mailing',addrLineTxt,'Yes', 'mailingAddrLine1Txt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
		//44532-Endorsements not acceptiong PO BOX for a mailing address
		//validatePostAddress('mailing',addrLineTxt);
		validatePMBAddress('mailing',addrLineTxt);
	}
	if(strID.indexOf('mailingAddrLine2Txt')!=-1)
	{
		validateRequiredAddressAndNotNull('mailing',addrLineTxt,'Yes', 'mailingAddrLine1Txt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
		//44532-Endorsements not acceptiong PO BOX for a mailing address
		//validatePostAddress('mailing',addrLineTxt);
		validatePMBAddress('mailing',addrLineTxt);
	}

}

function validatePostAddress(resmail,addrLine1Txt){
	var strID = addrLine1Txt.id;
	var addressLine1 = $('#'+strID).val();
	// A lot of defects have opened up (multiple times) over the past few months regarding post box edit
	// Here is a list of combinations that should work whenever anyone changes the below regex. If required run the test method below validatePostAddressTest() to check for correctness of your regex
	// 36766, 48541 - Edit should fire for "P.O. Box", "PO Box", "POBOX",  "Post box 123","Old P.O. Box", " Old PO Box", "Old POBOX",  "Old Post box 123"
	// 38070 - Edit should NOT fire for "Old Post Rd", "Old Boxwood Dr", "Old Box wood dr", "Old Woodbox dr", "Post Rd", "Boxwood Dr", "Box wood dr", "old pos Fox road"
	// 52808 - PO 125 should throw error also 28 Applebox st shud be allowed hence modified expression, kept old one commented
	// 57655 - "PO", "BOX" or "BX" should throw edit
	// 59322- NB Auto quote error message - address with letter PO in street name (top priority 5 nj)
	//if(/\s*(((\b^BX$\b))|((\b^BOX$\b))|((\b^po$\b))|(po[\s\d])|((p[o|\s|\.]((st))?.?\s*(o(ff(ice)?)?)?.?\s*(b(in|ox))+)))/i.test(addressLine1)){
	var addressLn1 = addressLine1.replace(/\s/g,'');
	if(/\s*((((p(o|ob))|(b(ox|x)))(#|\d+|[^a-zA-Z]+|\s*)$))/i.test(addressLn1)){
		var strErrorTag = 'addrLine1Txt.browser.inLine';
		if(resmail.indexOf('mailing')!=-1){
			strErrorTag = 'mailingAddrLine1Txt.browser.inLine';
		}
		var errorMessageID = 'InvalidAddress';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(addrLine1Txt.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}

/*function testValidatePostAddress(){
	var testAddressesToFail = ["P.O. Box", "PO Box", "POBOX",  "Post box 123","Old P.O. Box", " Old PO Box", "Old POBOX",  "Old Post box 123"];
	var testAddressesToPass = ["Old Post Rd", "Old Boxwood Dr", "Old Box wood dr", "Old Woodbox dr", "Post Rd", "Boxwood Dr", "Box wood dr", "old pos Fox road"];
	var counterFail = 0;
	var counterPass = 0;
	for(var i=0;i<testAddressesToFail.length;i++){
		if(/\s*((p((ost))?.?\s*(o(ff(ice)?)?)?.?\s*(b(in|ox))+))/i.test(testAddressesToFail[i])){
			console.log(testAddressesToFail[i] + ' not accepted');
		} else{
			console.log(testAddressesToFail[i] + ' accepted');
			counterFail++;
		}
	}
	for(var i=0;i<testAddressesToPass.length;i++){
		if(/\s*((p((ost))?.?\s*(o(ff(ice)?)?)?.?\s*(b(in|ox))+))/i.test(testAddressesToPass[i])){
			console.log(testAddressesToPass[i] + ' not accepted');
			counterPass++;
		} else{
			console.log(testAddressesToPass[i] + ' accepted');
		}
	}
	console.log(counterFail+counterPass + ' failures');
}*/

function validatePMBAddress(resmail,addrLine1Txt){
	var strID = addrLine1Txt.id;
	var addressLine1 = $('#'+strID).val();
	//29753 - NBS CLTC #144 Address line 1 on client allow PMB
	//52831 - # is not allowed so added it in or condition, ex. #123 Main St is invalid
	//59322- NB Auto quote error message - address with letter PO in street name (top priority 5 nj)
	//if(/(?:p(?:mb)?\s*\.?\s*?[m]?\s*\.?\s*?[b])\b|(?:private\s*mail\s*box)\b|([#])/i.test(addressLine1)){
	var addressLn1 = addressLine1.replace(/\s/g,'');
	if(/\s*pmb(#|\d+|[^a-zA-Z]+|\s*)$/i.test(addressLn1)){
		var strErrorTag = 'addrLine1Txt.browser.inLine';
		if(resmail.indexOf('mailing')!=-1){
			strErrorTag = 'mailingAddrLine1Txt.browser.inLine';
		}
		var errorMessageID = 'InvalidPMBAddress';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(addrLine1Txt.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}

function validatePMBAddressForAddrLine2(resmail,addrLine1Txt){
	var strID = addrLine1Txt.id;
	var addressLine1 = $('#'+strID).val();
	//if(/(?:p(?:mb)?\s*\.?\s*?[m]?\s*\.?\s*?[b])\b|(?:private\s*mail\s*box)\b/i.test(addressLine1)){
	if(/\s*((pmb(#|\s*#)$)|(pmb(\d+|\s*\d+)$))/i.test(addressLine1)){
		var strErrorTag = 'addrLine1Txt.browser.inLine';
		
		var errorMessageID = 'InvalidPMBAddress';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(addrLine1Txt.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}

}

function validateEligibilityGroup(eligibilityGroup){
	validateNameClient('',eligibilityGroup, 'Yes', 'eligibilityGroup.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

/*function checkAddressValidParams(addrLine1Txt){
	var emailRegex = /^[0-9a-zA-Z-]$/;

	var strID = addrLine1Txt.id;
	var addressLine1 = $('#'+strID).val();
	var valid = emailRegex.test(addressLine1);
	alert(addressLine1+' is valid = '+valid);
}*/

function validatePriorCarrier(priorCarrierName){
	var salesProg = $('select[id^="salesProgram"]').val();
	if(salesProg=='PREF_BK_RL'){
			var strID = priorCarrierName.id;
			validateNameClient('',priorCarrierName,'Yes', 'priorCarrierName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}
}

function checkEnteredPremiumAmt(premiumAmt)
{
	  var num = new Number(premiumAmt);
      if(/^[0-9]{0,10}?$/.test(premiumAmt) && num > 0){

      } else {

      }
}

function checkValueClient(currentReportRequiredIndicator){
	var checkCurrRepInd  = currentReportRequiredIndicator.id;
	var yesNoInd = $('#'+checkCurrRepInd).val();
	if(yesNoInd.toUpperCase() == "NO"){
		var strErrorTag = 'currentReportRequiredIndicator.browser.inLine';
		var errorMessageID = 'noSelection';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(currentReportRequiredIndicator.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}

function validateSalesProgram(){
		var salesProgram = $('#salesProgram').val();
		if(salesProgram == 'PREF_BK_RL'){
			$('#pref_Book_Ind').val('Yes');
			$('.clspriceTransferCredit').removeClass('hidden');
			//52258 - Client Empl section shows [Current Policy Term], [CT Premium], & [ED of C Term] fields but should not
			//56397 - commented out MA check as we should show these fields for MA
			//if($("#policyStateCd").val() != 'MA'
				// && $("#stateCd").val() != 'MA'){
				if($('.priorCarrierPolicyTermInfo').hasClass('hidden')){
					$('.priorCarrierPolicyTermInfo').removeClass('hidden');
					$('.activeCurrentPolicyInfo').removeClass('hidden');
					$('#priorCarrirePolicyEfftDateInfo').removeClass('hidden');
				}
				$('.priorCarrierPolicyTermInfo').addClass('required');
				$('.activeCurrentPolicyInfo').addClass('required');
				$('#priorCarrirePolicyEfftDateInfo').addClass('required');
			
				//if($('#firstTimeThru').val() == 'true'){
				if($("#transactionProgress").val() == ''){
					$('#priorCarrierPolicyTerm').addClass('preRequired').trigger('chosen:styleUpdated');
					$('#priorCarrierPremiumAmount').addClass('preRequired');
					$('#priorCarrierPolicyEfftDate').addClass('preRequired');
				}
			/*} else{
				$('#priorCarrierPolicyTerm').addClass('hidden').val('').trigger('chosen:updated').trigger('chosen:styleUpdated');
				$('#priorCarrierPremiumAmount').addClass('hidden').val('');
				$('.priorCarrierPolicyTermInfo').addClass('hidden');
				$('.activeCurrentPolicyInfo').addClass('hidden');
				$('#priorCarrirePolicyEfftDateInfo').addClass('hidden').val('');
			}
			*/
			perferredBookRollSearch();

		} else {
			$('#pref_Book_Ind').val('No');
			$('.priorCarrierPolicyTermInfo').addClass('hidden');
			$('.activeCurrentPolicyInfo').addClass('hidden');
			$('#priorCarrirePolicyEfftDateInfo').addClass('hidden');
			$('.clspriceTransferCredit').addClass('hidden');
			var errorMessageID = '';				
			var priorPremAmtId = $('#priorCarrierPremiumAmount').attr('id');
			showClearInLineErrorMsgsWithMap(priorPremAmtId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
										
			var piorPolTermId = $('#priorCarrierPolicyTerm').attr('id');
			showClearInLineErrorMsgsWithMap(piorPolTermId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var salesPrgmId = $('#salesProgram').attr('id');
			showClearInLineErrorMsgsWithMap(salesPrgmId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var priorPolEffDateId = $('#priorCarrierPolicyEfftDate').attr('id');
			showClearInLineErrorMsgsWithMap(priorPolEffDateId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
			
			var priorCarrierNameId = $('#priorCarrierName').attr('id');
			showClearInLineErrorMsgsWithMap(priorCarrierNameId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
		}
}
		/*	
	var sProg = $('#salesProgram').val();
	if(sProg=='BK_ROLL'){
		salesProgramIsBookRoll();
	}else{
		salesProgramNotBookRoll();
	}
	var priorCarrierName = $('select[id^="priorCarrierName"]').val();
	if(priorCarrierName!=null && priorCarrierName!=""){
		var strID = salesProgram.id;
		validateNameClient('',salesProgram,'Yes', 'salesProgram.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	}
	if(priorCarrierName==null || priorCarrierName==""){
		showClearInLineErrorMsgsWithMap(salesProgram.id, '',fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}*/

function validateCity(cityName){
	var strID = cityName.id;
	var ciSelected = $('#'+strID).val();
	if(ciSelected == null || ciSelected == "" || ciSelected == undefined){
		ciSelected = "";
	}
		
	if(ciSelected !=""){
		if(strID.indexOf('mailing')!=-1){
			$('#mailingCityName').removeClass('required');
			$('#mailingCityName').removeClass('inlineError');
			$('#mailingCityName').removeClass('preRequired');
			$('#mailingCityName').trigger('chosen:styleUpdated');
		}
		else{
		$('#cityName').removeClass('required');
		$('#cityName').removeClass('inlineError');
		$('#cityName').removeClass('preRequired');
		$('#cityName').trigger('chosen:styleUpdated');
		}
	}
	
	
	if(strID.indexOf('mailing')!=-1){
		$('#mailingAddressCity').val(ciSelected);
	}
	else
		{
			$('#addressCity').val(ciSelected);
		}
	
	validateRequiredAndNotNull('',cityName,'Yes', 'cityName.browser.inLine', fieldIdToModelErrorRow['cityState'], '');
	if(strID.indexOf('mailing')==-1){
			var zipCd = $('#zip').val();
			var zip_state = $('#addressState').val();
			var zip_city = $('#addressCity').val();
			var errorMessageID = '';
			var fldId = $('#zip').attr('id');
			if(zip_city!=null && zip_city !='' && zip_city != undefined && zip_city.length>1){
				
				var parsed_resiCity = '';
				var zip_associated_city = zip_city.split(" ");
				for(j=0;j<zip_associated_city.length;j++){
					parsed_resiCity = parsed_resiCity+zip_associated_city[j];
					if(j != (zip_associated_city.length -1)){
						parsed_resiCity =parsed_resiCity+'_';
					}
				}
				
				//var poId = 'pobox_'+zip_city+'_'+zip_state+'_'+zipCd;
				var poId = 'pobox_'+parsed_resiCity+'_'+zip_state+'_'+zipCd;
				var poBoxIndicator = $('#'+poId).val();
				//console.log('is po box valid id for pbxo zip = '+poId+' poBoxIndicator ='+poBoxIndicator+'zip_city ='+zip_city);
				if(poBoxIndicator == 'Y'){
					errorMessageID = 'zip.browser.inLine.nonRatablePOBox';
				}
				showClearInLineErrorMsgsWithMap(fldId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
				}
		}
}

function validateZip(zip){
	var strID = zip.id;

	var msgRow = 'zip.browser.inLine';
	if(strID.indexOf('mailing')!=-1){
		msgRow = 'mailingZip.browser.inLine'
	}
	isValidZip('',zip,'Yes', msgRow, fieldIdToModelErrorRow['zipZip4'], '');
}


function isValidZip(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var zip = $(elementId).val();
	var errorMessageID = isNameClient(zip, strRequired);
	errorMessageID = strErrorTag+'.'+errorMessageID;
	//showClearInLineErrorMsgsWithMap(elementId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	if(errorMessageID.indexOf('required')==-1){
		var strID = elementId.id;
		if(strID.indexOf('mailing')!=-1){
			performZipTownLookup(zip, $('#mailingCityName'),'mailing');
		}
		else{
			performZipTownLookup(zip, $('#cityName'),'residence');
		}
	}
}

function validateEmail(addressEmailID){
	var strID = addressEmailID.id;
	isValidEmail('',addressEmailID,'No','addressEmailID.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateHomePhoneNumber(homePhoneNumber,event){
	var errorMessageID = '';
	var homePhoneId = homePhoneNumber.id;
	var homePhoneNumberValue = $('#'+homePhoneId).val();

    if(homePhoneNumberValue == null || homePhoneNumberValue == "" || homePhoneNumberValue =='Optional' || /[0-9]{10}$/.test(homePhoneNumberValue) && isEndorsement() || /[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/.test(homePhoneNumberValue)){
    
    	//48443 - Invalid Phone Number Error(Endorsements)
    	/*if(isEndorsement() && homePhoneNumberValue.length == 12){
    		homePhoneNumberValue = homePhoneNumberValue.replace(/[^\d]/g, '');
    		$('#'+homePhoneId).val(homePhoneNumberValue);
    	}*/
    	if(isEndorsement() && homePhoneNumberValue.length == 10){
    		homePhoneNumberValue = convertToPhoneFormat(homePhoneNumberValue);
    		$('#'+homePhoneId).val(homePhoneNumberValue);
    	}
		showClearInLineErrorMsgsWithMap(homePhoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
	else
	{
			//$('#'+homePhoneId).val("");
			errorMessageID =homePhoneId+'.browser.inLine.Invalid';
			showClearInLineErrorMsgsWithMap(homePhoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	}
}

function convertToPhoneFormat(homePhoneNumberValue){
	if(homePhoneNumberValue=='' || homePhoneNumberValue==null || homePhoneNumberValue.length!=10){
		return homePhoneNumberValue;
	}
	return homePhoneNumberValue.substring(0,3) + '-' + homePhoneNumberValue.substring(3,6) + '-' + homePhoneNumberValue.substring(6,10);
}

function validatePolicyTerm(njPolicyTerm){
	var strID = njPolicyTerm.id;
	validateNameClient('',njPolicyTerm,'Yes', 'njPolicyTerm.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}


function validatePolicyBranch(branchId){
	return validateNameClient('',branchId,'Yes', 'branch_hier_id.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatePolicyAgency(agencyId){
	return validateNameClient('',agencyId,'Yes', 'agency_hier_id.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validatePolicyProduct(productId){
	return validateNameClient('',productId,'Yes', 'policyProductCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

/*style=\"height:9px !important;\"*/

var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>",
		"applicants":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col_PRI\"></td><td class=\"fieldColError\" id=\"Error_Col_SEC\"></td><td></td></tr>",
		"zipZip4":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>",
		"cityState":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>"
};

var fieldIdToModelRmvResultRow = {
		"rmvSuccess":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"rmvResultCol\" id=\"Error_Col_PRI\"></td><td class=\"rmvResultCol\" id=\"Error_Col_SEC\"></td><td></td></tr>",
		"rmvError":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"rmvResultCol\" id=\"Error_Col_PRI\"></td><td class=\"rmvResultCol\" id=\"Error_Col_SEC\"></td><td></td></tr>"
};

function isEnterKeyPressed(event){
	 var c = event.keyCode;
	 if (c == 13) {e.preventDefault();return false;}
}

// expiry date calculation remove for now - relook at the logic must be a better way !!
function calculatePolicyExpiryDate(){
			var policyEffDate = $("#policyEffectiveDate").val();
			var pol_key = $("#policyKey").val();
			var dateArray = policyEffDate.split("/");var year = dateArray[2];var month = dateArray[0];var day = dateArray[1];
			var policyTerm = '';
			if(pol_key == null || pol_key == ''){policyTerm = $("#njPolicyTerm").val();}
			else{ policyTerm = $("#njPolicyTerm").val();}
			if(policyTerm == "0"){$("#policyEffectiveDate").val("");return;}
			if(policyTerm == "6")
			{
				var xDate = new XDate(year,month,day);
				xDate.addMonths(05,true);
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
				
				 // to fix day bug for jan 29 or 30
				 if(month = "01"){
					 if ( day == "29") {
						 if((xDate.getMonth() + 1) == "8" && xDate.getDate() == "1"){
							 xDate.addDays(-3);
						 }
					 }
					 
					 if ( day == "30") {
						 if( (xDate.getMonth() + 1) == "8" && xDate.getDate() == "2" ){
							 xDate.addDays(-3);
						 }
					 }
				 }
			
				var dt = xDate.toString('MM/dd/yyyy');
				$("#expDt").text(dt);
				$("#policyExpirationDate").val(dt);
			}
			
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
					
					 // to fix day bug for jan 29 or 30
					 if(month = "01"){
						 if ( day == "29") {
							 if((xDate.getMonth() + 1) == "2" && xDate.getDate() == "1"){
								 xDate.addDays(-3);
							 }
						 }
						 
						 if ( day == "30") {
							 if( (xDate.getMonth() + 1) == "2" && xDate.getDate() == "2" ){
								 xDate.addDays(-3);
							 }
						 }
					 }
				
				 	var dt = xDate.toString('MM/dd/yyyy');
					$("#expDt").text(dt);
					$("#policyExpirationDate").val(dt);
			}

}

function daysInMonth(iMonth, iYear) {return 32 - new Date(iYear, iMonth, 32).getDate();}

	function initialFormLoadProcessing() {
		//Set default button when <enter> is clicked
		setDefaultEnterID('save');
	}

	function validatePage() {
		/**
		// clear any existing errorclearPageError('.pageError');
		**/
		var errorCount = validateInputs();
		/**
		if (errorCount > 0) {
			errorMessageID = 'aiui.aiForm.editPage.all';
			showPageError('.pageError', errorMessageID);
		}
		**/
		return errorCount == 0;
	}

	function validateClientBirthDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
		errorMessageID = isValidBirthDate(elementId, strRequired);
		if (errorMessageID.length > 0){
			//set the birth date to null
			//$(elementId).val("");
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,'app', errorMessages, addDeleteCallback);
	}

	function validatePolicyEffDate(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
		errorMessageID = isValidPolicyEffDate(elementId, strRequired);
		if (errorMessageID.length > 0){
				errorMessageID = strErrorTag + '.' + errorMessageID;
			}
			else{
				errorMessageID = '';
			}
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
			if(errorMessageID==''){ return true;}else{return false;}
	}


	function validateClientFirstLastNames(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
		if(name !=null && name!='' && name.indexOf('app')!=-1){
			errorMessageID = isValidClientFirstLastName($(elementId).val(), strRequired);
			if (errorMessageID.length > 0){
				errorMessageID = strErrorTag + '.' + errorMessageID;
			}else{
				errorMessageID = '';
			}
			showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,'app', errorMessages, addDeleteCallback);
		}

	}

	function validateNameClient(name, elementId, strRequired, strErrorTag, strErrorRow, index) {
		var flag = true;
		if(name !=null && name!='' && name.indexOf('app')!=-1){
			errorMessageID = isNameClient($(elementId).val(), strRequired);
			if (errorMessageID.length > 0){
				errorMessageID = strErrorTag + '.' + errorMessageID;
			}else{
				errorMessageID = '';
			}
			showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,'app', errorMessages, addDeleteCallback);
		}
		else{
			errorMessageID = isNameClient($(elementId).val(), strRequired);
			if (errorMessageID.length > 0){
				errorMessageID = strErrorTag + '.' + errorMessageID;
				flag = false;
			}
			else{
				errorMessageID = '';
				flag = true;
			}
			showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
			return flag;
		}
	}

	function validateRequiredAndNotNull(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
			errorMessageID = isRequiredAndNotEmpty($(elementId).val(), strRequired);
			if (errorMessageID.length > 0){
				errorMessageID = strErrorTag + '.' + errorMessageID;
			}
			else{
				errorMessageID = '';
			}

			showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
		}

	function validateRequiredAddressAndNotNull(name, elementId,strRequired, strErrorTag, strErrorRow, index){
		var addrId = elementId.id;
		if(name.indexOf('residence')!=-1){
		if(addrId.indexOf('addrLine1')==-1){
			strRequired = false;
		}
		}
		if(name.indexOf('mailing')!=-1){
			if(addrId.indexOf('mailingAddrLine1Txt')==-1){
				strRequired = false;
			}
			}
		errorMessageID = isRequiredAndNotEmptyAddress($(elementId).val(), strRequired);
		if (errorMessageID.length > 0){
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else{
			errorMessageID = '';
		}

		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
	}

	function parseErrorRow(strRowName,strErrorColId)
	{
		if(strErrorColId == 'app_first_name_sec_Error_Col'){
			var txtVal = $('#app_first_name_pri_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
					return false;
			}
		}

		if(strErrorColId == 'app_first_name_pri_Error_Col'){
			var txtVal = $('#app_first_name_sec_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
			return false;
			}
		}

		if(strErrorColId == 'app_last_name_sec_Error_Col'){
			var txtVal = $('#app_last_name_pri_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
			}
		}

		if(strErrorColId == 'app_last_name_pri_Error_Col'){
			var txtVal = $('#app_last_name_sec_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
			return false;
			}
		}

		if(strErrorColId == 'app_birth_date_sec_Error_Col'){
			var txtVal = $('#app_birth_date_pri_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
			}
		}

		if(strErrorColId == 'app_birth_date_pri_Error_Col'){
			var txtVal = $('#app_birth_date_sec_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
			}
		}

		if(strErrorColId == 'app_marital_status_sec_Error_Col'){
			var txtVal = $('#app_marital_status_pri_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
			}
		}

		if(strErrorColId == 'app_marital_status_pri_Error_Col'){
			var txtVal = $('#app_marital_status_sec_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
			return false;
			}
		}

		if(strErrorColId == 'app_mask_ssn_sec_Error_Col'){
			var txtVal = $('#app_mask_ssn_pri_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
				return false;
			}
		}

		if(strErrorColId == 'app_mask_ssn_pri_Error_Col'){
			var txtVal = $('#app_mask_ssn_sec_Error_Col').text();
			if(txtVal !=null && $.trim(txtVal) != ''){
			return false;
			}
		}
		return true;
	}

	function processAppRows(strErrorRow,strElementID,strRowName)
	{
		strErrorRow = strErrorRow.replace(/Error_Col_PRI/g, strRowName+'_pri' + '_Error_Col');
		strErrorRow = strErrorRow.replace(/Error_Col_SEC/g, strRowName+'_sec' + '_Error_Col');
		return strErrorRow;
	}

	function getErrorColumnId(strElementID){
		var strErrorColId = '';
		if(strElementID.indexOf('primary_insured_firstName') == 0) {
			strErrorColId = 'app_first_name_pri_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_lastName') == 0) {
			strErrorColId = 'app_last_name_pri_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_birth_date') == 0) {
			strErrorColId = 'app_birth_date_pri_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_maritalStatusCd') == 0) {
			strErrorColId = 'app_marital_status_pri_Error_Col';
		}

		if(strElementID.indexOf('secondary_insured_firstName') == 0) {
			strErrorColId = 'app_first_name_sec_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_lastName') == 0) {
			strErrorColId = 'app_last_name_sec_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_birth_date') == 0) {
			strErrorColId = 'app_birth_date_sec_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_maritalStatusCd') == 0) {
			strErrorColId = 'app_marital_status_sec_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_mask_ssn_SECONDARY') == 0) {
			strErrorColId = 'app_mask_ssn_sec_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_mask_ssn_PRIMARY') == 0) {
			strErrorColId = 'app_mask_ssn_pri_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_licenseState') == 0) {
			strErrorColId = 'app_license_state_pri_Error_Col';
		}
		if(strElementID.indexOf('primary_insured_licenseNumber') == 0) {
			strErrorColId = 'app_license_number_pri_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_licenseState') == 0) {
			strErrorColId = 'app_license_state_sec_Error_Col';
		}
		if(strElementID.indexOf('secondary_insured_licenseNumber') == 0) {
			strErrorColId = 'app_license_number_sec_Error_Col';
		}

		return strErrorColId;
	}

	function getErrorRowId(strElementID){
		var strErrorRowId = '';
		if(strElementID.indexOf('primary_insured_firstName') == 0 || strElementID.indexOf('secondary_insured_firstName') == 0) {
			strErrorRowId = 'app_first_name';
		}
		if(strElementID.indexOf('primary_insured_lastName') == 0 || strElementID.indexOf('secondary_insured_lastName') == 0) {
			strErrorRowId = 'app_last_name';
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

	function updateAltGarageTowns(zip){
		var pol_key = $("#policyKey").val();
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: "/aiui/client/compratorAltGarageUpdate",
	        type: "post",
	        dataType: 'json',
	        data : JSON.stringify({ "policyKey":pol_key}),
	        timeout: 3000,
	        // callback handler that will be called on success
	        success: function(response, textStatus, jqXHR){
	        	
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
		      
	        },
	        complete: function(){
	        	performZipTownLookup(zip, $('#cityName'),'residence');
	        }
	    });
	}
	
	function performZipTownLookup(zip, townElement,resiOrmailing) {
		var successfulLookup = true;
		blockUser();
		var stateCd = $('#stateCd').val();
		var strErrorTag = 'zip.browser.inLine';
		var zipId = $('#zip').attr('id');
		var errorMessageID = 'nonRatable';
		var dataToPost = '';
		if(resiOrmailing.indexOf('mailing')!=-1){
			 strErrorTag = 'mailingZip.browser.inLine';
			 zipId = $('#mailingZip').attr('id');
			 dataToPost=  JSON.stringify({ "zip":zip,"garageTown":'',"stateCd":''});
		}
		else{
			 strErrorTag = 'zip.browser.inLine';
			 var transTypCd = $('#transactionTypeCd').val();
			 dataToPost = JSON.stringify({ "zip":zip,"garageTown":'',"stateCd":stateCd});
			 //errorMessageID = 'nonRatable';
			}
		
		errorMessageID = strErrorTag + '.' + errorMessageID;
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	           },
	        //url: "/aiui/lookup/zipAddress/zip/"+zip,
	           
	           url: "/aiui/lookup/zipAddress/zipTownLookup",
	        type: "post",
	        dataType: 'json',
	        data : dataToPost,
	        timeout: 3000,
	        // callback handler that will be called on success
	        success: function(response, textStatus, jqXHR){
	        	processZipTownResults(response, townElement , resiOrmailing);
	          	var cities = response.cityAssociatedWithZip;
	          	if (cities!=null && cities.length >=1){
	          		errorMessageID = '';
	          	}
	          	else {
	          		successfulLookup=false;
	          		if(resiOrmailing.indexOf('mailing')!= -1){
	          			//if NJ no cities returned its error
	          			var mailingAddressState = $("#mailingAddressState").val();
	          			var mailingStateDD = $("#mailingStateCd").val();
	          			if(! isValidValue(mailingAddressState) && isValidValue(mailingStateDD)){
	          				mailingAddressState = mailingStateDD;
	          			}	          			
	          			errorMessageID='';
	          			$('#mailingStateCd').val("").trigger('chosen:updated');
	          		}
	          		else{
	          				var transTypCd = $('#transactionTypeCd').val();
	          				errorMessageID = 'zip.browser.inLine.nonRatable';
	          		}
	          	}
	          	showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
		        //in case of error what state you need to pass	
	        	successfulLookup = false;
	        	parseZipLookupError(resiOrmailing,null);
		        showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
	        },
	        complete: function(){
	        	$.unblockUI();
	        	var zipAttr = $('#zip').attr('id');
	    		if(resiOrmailing.indexOf('mailing')==-1 && successfulLookup){
	    			var zipCd = $('#'+zipAttr).val();
	    			var zip_state = $('#addressState').val();
	    			var zip_city = $('#addressCity').val();
	    			var errorMessageID = '';
	    			var fldId = $('#'+zipAttr).attr('id');
	    			//we do this validation only for residence address for both endorsement and new business
	    			var cityParse = $.trim(zip_city);
					var cityParsedName = zip_city.replace(/\s/g, '_');
	    			if(zip_city!=null && zip_city !='' && zip_city != undefined && zip_city.length>1){
	    				var poId = 'pobox_'+cityParsedName+'_'+zip_state+'_'+zipCd;
	    				var poBoxIndicator = $('#'+poId).val();
	    				//alert('is po box valid id for pbxo zip = '+poId+' poBoxIndicator ='+poBoxIndicator);
	    				if(poBoxIndicator == 'Y'){
	    					errorMessageID = 'zip.browser.inLine.nonRatablePOBox';
	    				}
	    				showClearInLineErrorMsgsWithMap(fldId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessages, addDeleteCallback);
	    				}
	    		}
	        }
	    });
	}

	function parseZipLookupError(resiOrmailing,state)
	{
		if(resiOrmailing.indexOf('mailing')!= -1){
			//var mailingAddressState = $("#mailingAddressState").val();
			//Replaced NJ with !MA
			if(isValidValue(state)){
				$('#mailingStateCd').attr("value", state).attr('selected','selected').trigger('chosen:updated');
				//$('#mailingStateCd').text(state).attr('selected','selected').trigger('chosen:updated');
				$("#mailingAddressState").val(state);
				$('#mailingCityName').removeClass('hidden');
				$('#mailingCityName_chosen').removeClass('chosenDropDownHidden');
				$("#mailingCityName").trigger('chosen:updated');
			}
			else{
				if(state == null){state = '';}
				if(isValidValue($('#mailingStateCd').val())){
					state = $('#mailingStateCd').val();
				}
				$('#mailingStateCd').attr("value", state).attr('selected','selected').trigger('chosen:updated');
				//$('#mailingStateCd').text(state).attr('selected','selected').trigger('chosen:updated');
				$("#mailingAddressState").val(state);
				$('#mailingCityName').addClass('hidden');
				$('#mailingCityName_chosen').addClass('chosenDropDownHidden');
				$("#mailingCityName").trigger('chosen:updated');
				$('#mailingCityName_FreeForm').show();
				
			}
		}
		else{
		$('#cityName').addClass('required');
		$('#cityName').addClass('preRequired');
		$('#cityName').prop('disabled',true);
		if( $('#addressCity').length )
		{
			$('#addressCity').val("");
		}
		$('#cityName').val("").trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
		//Show error message that zip is invalid..
		if(isMaComparator()){
			$('#compAddressCity').val('');
	}
	}

	function processZipTownResults(results, townElement,resiOrmailing) {
			populateSelect(results,resiOrmailing);
	}

	function populateSelect(options,resiOrmailing)
	{
		
		var cities = options.cityAssociatedWithZip;
		var state =  options.stateAssociatedWithZip;
		var poboxZipCities = options.zipTownLookup;
		if(resiOrmailing.indexOf('mailing')!=-1){
			if(isValidValue(state)){
				$('#mailingStateCd').attr("value", state).attr('selected','selected').prop('disabled', true).trigger('chosen:updated');
				$("#mailingAddressState").val(state);
				$('#mailingCityName').removeClass('hidden');
				$('#mailingCityName_chosen').removeClass('chosenDropDownHidden');
				$("#mailingCityName").trigger('chosen:updated');				
				$('#mailingCityName_FreeForm').hide();
			}
			else{
				$('#mailingStateCd').prop('disabled', false).trigger('chosen:updated');
				$("#mailingAddressState").val($('#mailingStateCd').val());
			}
			
			$('#mailingAddressCity').val("");
			$('#mailingCityName').prop('disabled', false);
			$('#mailingCityName').empty();
			var options_select = '';
			options_select+='<option value="">Select</option>';
			$('#mailingCityName').append(options_select);
			for (var i = 0; cities!=null && i < cities.length; i++) {
				if (i < cities.length) {
					options_select +='<option value="' + cities[i] + '">' + cities[i] + '</option>';
					$('#mailingCityName').append('<option value="' + cities[i] + '">' + cities[i] + '</option>');
				}
			}
	
			if (cities ==null || cities.length  == 0){
				parseZipLookupError('mailing',state);
			}

			if (cities!=null && cities.length  == 1)
			{
				city = cities[0];
				$('#mailingCityName').prop('disabled', 'disabled');
				$('#mailingCityName').removeClass('required');
				$('#mailingCityName').removeClass('inlineError');
				$('#mailingCityName').removeClass('preRequired');
				$('#mailingCityName').val(city).trigger('chosen:updated').trigger('chosen:styleUpdated');
				if( $('#mailingAddressCity').length )
				{
					$('#mailingAddressCity').val(city);
				}
				else
				{
					$('#aiForm').append('<input type="hidden" id="mailingAddressCity" name="mailingAddress.addressCity" value=""/>');
					$('#mailingAddressCity').val(city);
				}
				$('#mailingCityName_Error').remove();
			}
			else
			{
				$('#mailingCityName').addClass('required');
				//$('#mailingCityName').addClass('inlineError');
				$('#mailingCityName').addClass('preRequired');
				//$('#mailingAddressCity').remove();
				$('#mailingCityName').trigger('chosen:updated').trigger('chosen:styleUpdated');
			}
		}
		else{
			$('#addressCity').val("");
			$('#cityName').prop('disabled', false);
			$('#cityName').empty();
			var options_select = '';
			options_select+='<option value="">Select</option>';
			$('#cityName').append(options_select);
			var compResiCity = $('#compAddressCity').val();
			
			for (var i = 0; cities!=null && i < cities.length; i++) {
				if (i < cities.length ) {
								
					var cityParse = $.trim(poboxZipCities[i].cityName);
					var cityParsedName = cityParse.replace(/\s/g, '_');
					var id = 'pobox_'+cityParsedName+'_'+poboxZipCities[i].stateCode+'_'+poboxZipCities[i].zipCode;
					//var id = 'pobox_'+poboxZipCities[i].cityName+'_'+poboxZipCities[i].stateCode+'_'+poboxZipCities[i].zipCode;
					var poboxIndicator = poboxZipCities[i].poBoxIndicator;
					if($('#'+id).length){
						//alert('exisiting id ');
					}
					else{
						//alert('append new id');	
						$('#aiForm').append('<input type="hidden" id='+id+' value='+poboxIndicator+'></input>');
					}
					//alert('getting pobox indicators = '+poboxZipCities[i].poBoxIndicator);
					options_select +='<option value="' + cities[i] + '">' + cities[i] + '</option>';
					$('#cityName').append('<option value="' + cities[i] + '">' + cities[i] + '</option>');
					if(isMaComparator() && isValidValue(compResiCity) && isValidValue(cities[i]) ){
						if(compResiCity.toUpperCase() == cities[i].toUpperCase()){
							$('#compAddressCity').val(cities[i]);
				}
			}
				}
			}
			
			if (cities ==null || cities.length  == 0){
				parseZipLookupError('resi',state);
			}

			if (cities!=null && cities.length  == 1)
			{
				
				city = cities[0];
							
				$('#cityName').prop('disabled', 'disabled');
				$('#cityName').removeClass('required');
				$('#cityName').removeClass('inlineError');
				$('#cityName').removeClass('preRequired');
				$('#cityName').val(city).trigger('chosen:updated').trigger('chosen:styleUpdated');
				if( $('#addressCity').length)
				{
					$('#addressCity').val(city);
				}
				else
				{
				
					$('#aiForm').append('<input type="hidden" id="addressCity" name="address.addressCity" value=""/>');
					$('#addressCity').val(city);
				}
				$('#cityName_Error').remove();
			
				
				var cityParse = $.trim(poboxZipCities[0].cityName);
				var cityParsedName = cityParse.replace(/\s/g, '_');
				//alert('cityParsedName ='+cityParsedName);
				//var id = 'pobox_'+poboxZipCities[0].cityName+'_'+poboxZipCities[0].stateCode+'_'+poboxZipCities[0].zipCode;
				var id = 'pobox_'+cityParsedName+'_'+poboxZipCities[0].stateCode+'_'+poboxZipCities[0].zipCode;
				//alert('cityname poboxZipCities ='+poboxZipCities[0].cityName);
				var poboxIndicator = poboxZipCities[0].poBoxIndicator;
				if($('#'+id).length){
					
				}
				else{
					$('#aiForm').append('<input type="hidden" id='+id+' value='+poboxIndicator+'></input>');
				}
			
				if(isMaComparator()){
					$('#compAddressCity').val('');
			}
			}
			else
			{
				$('#cityName').addClass('required');
				//$('#cityName').addClass('inlineError');
				$('#cityName').addClass('preRequired');
				// $('#addressCity').remove();
				
				if(isMaComparator()){
					var compResiCity = $('#compAddressCity').val();
					if(isValidValue(compResiCity)){
						$('#cityName').val(compResiCity).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
						$('#addressCity').val(compResiCity);
						$('#compAddressCity').val('');
					}else{
				$('#cityName').trigger('chosen:updated').trigger('chosen:styleUpdated');
			}
				}else{
					$('#cityName').trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
}
		}
}

	function setMailingCity(){
		var stateCdDropDown = $('#mailingStateCd').val();
		var state = $('#mailingAddressState').val(stateCdDropDown);
		var freeFormCity = $('#mailingCityName_FreeForm').val();
		//TD 62823 - Let user to enter free form city for all states 
		if(freeFormCity !=null && freeFormCity !=""){
			$('#mailingAddressCity').val(freeFormCity);
		}

				
	}
	
	function performProducerPostSelection(producerId, selectBoxId) {
		var uwCompanyId = $('#uwCompanyCd').val();
		
		blockUser();
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: "/aiui/client/producer/attrib",
	        type: "post",
	        dataType: 'json',
	        data : JSON.stringify({ "producerId":producerId, "uwCompanyId":uwCompanyId}),
	        timeout: 10000,
	        // callback handler that will be called on success
	        success: function(response, textStatus, jqXHR){
	        	initializeADRData(producerId,response);
	        	//Comes from ADR
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
		      initializeADRData(null,textStatus);
	        },
	        complete: function(){
	        	$.unblockUI();
/*	        	// Refocus the select box to make it lost the blue highlight after user moves to other fields
	        	if(selectBoxId && selectBoxId != '') setFocus(selectBoxId);*/
	        }
	    });
	}


	function initializeADRData(producerId,response){
		if(producerId!=null && producerId!="" && response !=null && response.producerId !=null){
		//console.log('initializeADRData -- response.fiservId='+response.fiServId+'response.branchLevelCode ='+response.branchLevelCode+'response.producerLevelCode ='+response.producerLevelCode+
			//'response.agencyLevelCode ='+response.agencyLevelCode+'response.branchId='+response.branchId+
		//	'response.agencyId='+response.agencyId+'response.underWritingCompany = '+response.underWritingCompany);

			$("#branch_id").val(response.branchLevelCode);
			$("#producer_id").val(response.producerLevelCode);
			$("#agency_id").val(response.agencyLevelCode);

			//$("#agency_hier_id").val(response.agencyId);
			$("#branch_hier_id").val(response.branchId);
			$("#policyProducerInput option:selected").replaceWith('<option value="' + $.trim(response.producerId) + '"selected data-support="'+$.trim(response.companyCorporationId)+'">' + response.producerWebDisplayName +" - "+ response.producerLevelCode + '</option>');
			$("#policyProducerInput").trigger('chosen:updated');
			$("#coCorpId").val(response.companyCorporationId);
			
			$("#maxAdjustmentFactor").val(response.maxAdjustmentFactor);
			$("#minAdjustmentFactor").val(response.minAdjustmentFactor);
			$("#upToleranceFactor").val(response.upToleranceFactor);
			$("#downToleranceFactor").val(response.downToleranceFactor);
			$("#exposureChangeIndicator").val(response.exposureChangeInd);

			$("#adrProcessCode").val(response.adrProcessCode);
			$("#span_adrProcessCode").text(response.adrProcessCode);
			$("#adrUwGroupCode").val(response.adrUwCode);
			$("#span_adrUwGroupCode").text(response.adrUwCode);
			$("#adrMarketingCd").val(response.adrMarketingCode);
			$("#span_adrMarketingCd").text(response.adrMarketingCode);
			$("#adrModel14Code").val(response.adrModel14Code);
			$("#span_adrModel14Code").text(response.adrModel14Code);

			$("#policyUwCompanyCd").val(response.underWritingCompany);
			$("#span_uwCompanyCd").text(response.underWritingCompany);
			$('#uwCompanyCd').val(response.underWritingCompany);
			$("#fiServAuthId").val(response.fiServId);
			$("#serviceCenterInd").val(response.serviceCenterInd);
			$("#superAgentInd").val(response.superAgency);
			validateBranchProduct();
			if(response.channelCode == 'IA'){
				$("#span_channelCd").text('Independent Agent');
			}else{
				$("#span_channelCd").text(response.channelCode);
			} 
		
			var effectiveDate = getPolEffDate($('#policyEffectiveDate').val());
			if(effectiveDate !=null && effectiveDate.length == 10 && hasValidParamsSecurityDate()){
				calculatePolicyExpiryDate();
			}
			else{
					$("#policyExpirationDate").val("");
					$("#expDt").text("");
				}
		}
		else{
			$("#branch_id").val("");
			$("#producer_id").val("");
			$("#agency_id").val("");

			//$("#agency_hier_id").val("");
			//41545-Client page: (Error on Page) User gets Error on page and blank blue screens when clicking next and Agency field
			// always keep the branch id in case the user
			//$("#branch_hier_id").val("");

			$("#maxAdjustmentFactor").val("");
			$("#minAdjustmentFactor").val("");
			$("#upToleranceFactor").val("");
			$("#downToleranceFactor").val("");
			$("#exposureChangeIndicator").val("");

			$("#adrProcessCode").val("");
			$("#adrUwGroupCode").val("");
			$("#adrMarketingCd").val("");
			$("#adrModel14Code").val("");
			$("#span_adrProcessCode").text("");
			$("#span_adrUwGroupCode").text("");
			$("#span_adrMarketingCd").text("");
			$("#span_adrModel14Code").text("");

			$("#span_uwCompanyCd").text("");
			//$("#policyUwCompanyCd").val("");

			$("#superAgentInd").val("");
			
			$("#fiServAuthId").val("");
			$("#serviceCenterInd").val("");
			validateBranchProduct();
		}
	}

function resetCoApplicantForPromotion(){
		$('#secondary_insured_firstName').val("");
 		$('#secondary_insured_lastName').val("");
 		$('#secondary_insured_middleName').val("");
 		$('#secondary_insured_maritalStatusCd').val("").trigger('chosen:updated');
 		$('#secondary_insured_birth_date').val("");
 		$('#mask_ssn_SECONDARY_INSURED').val("");
 		$('#secondary_insured_mask_ssn_SECONDARY').val("");
 		$('#insured_mask_ssn_SECONDARY').val("");
 		$('#secondary_insured_suffix').val("").trigger('chosen:updated');
 		
 		var secExistsPStar = $('#secondary_insured_pstarexists').val();
 		var secParticipantId = $('#secondary_insured_participantId').val();
 		
 		if(secExistsPStar == 'Yes'){
 			//var secParticipantId = $('#secondary_insured_participantId').val();	
 			$('#primary_insured_deletedId').val(secParticipantId);
 			
 		}
 		//alert('secParticipant Id = '+secParticipantId+'sec Exists in P* = '+secExistsPStar);
 		if(secParticipantId !=null && secParticipantId !=undefined && secParticipantId !="" && secParticipantId !=0){
 			$('#primary_insured_deletedId').val(secParticipantId);
 		}
 		if(secExistsPStar != 'Yes' && (secParticipantId ==null || secParticipantId ==undefined || secParticipantId =="" || secParticipantId ==0)){
 			$('#primary_insured_createNewDriver').val("Yes");
 		}
 		
 		$('#secondary_insured_participantId').val("0");
 		//reset secondary insured P* value 
 		$('#secondary_insured_pstarexists').val("");

 		if($('#app_first_name_Error').length>0 
 				&& $('#app_first_name_sec_Error_Col').length>0){
			showClearInLineErrorMsgsWithMap($('#secondary_insured_firstName').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
 		}

 		if($('#app_last_name_Error').length>0 
 				&& $('#app_last_name_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_lastName').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_birth_date_Error').length>0 
 				&& $('#app_birth_date_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap( $('#secondary_insured_birth_date').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_marital_status_Error').length>0 
 				&& $('#app_marital_status_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_maritalStatusCd').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_mask_ssn_Error').length>0 
 				&& $('#app_mask_ssn_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_mask_ssn_SECONDARY').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}
	}
	
	function clearSNILicenseNumberError(){
		$('#secondary_insured_licenseNumber').removeClass('inlineError');
 		$('#app_license_number_sec_Error_Col').text("");
	}
	
	function clearSNILicenseStateError(){
		$('#secondary_insured_licenseState').removeClass('inlineError');
		$('#app_license_state_sec_Error_Col').text("");
	}

	function resetCoApplicant(){
		//don't clear partcipant id here as it is useful in cascading delete for driver
		$('#secondary_insured_firstName').val("");
 		$('#secondary_insured_lastName').val("");
 		$('#secondary_insured_middleName').val("");
 		$('#secondary_insured_birth_date').val("");
 		$('#mask_ssn_SECONDARY_INSURED').val("");
 		$('#app_license_number_sec_Error_Col > span').text("");
 		$('#secondary_insured_mask_ssn_SECONDARY').val("");
 		$('#insured_mask_ssn_SECONDARY').val("");
 		$('#secondary_insured_licenseState').val('').trigger('chosen:updated');
 		$('#secondary_insured_licenseNumber').val('');
 		
 		//09/08/2014 - Removed trigger:chosenUpdated as user has flexiblity to abandon changes
 		$('#secondary_insured_maritalStatusCd').val("")//.trigger('chosen:updated');
 		$('#secondary_insured_suffix').val("");//.trigger('chosen:updated');
 		
 		var secExistsPStar = $('#secondary_insured_pstarexists').val();
 		//alert('sec Exists in P* = '+secExistsPStar);
 		if(secExistsPStar == 'Yes'){
 			var secParticipantId = $('#secondary_insured_participantId').val();	
 			$('#secondary_insured_deletedId').val(secParticipantId);
 			$('#secondary_insured_participantId').val("0");
 		}
 		
 		//This is not working properly and is clearing the PNI row's error too
 		//showClearInLineErrorMsgsWithMap('secondary_insured_licenseNumber', '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
 		//showClearInLineErrorMsgsWithMap('secondary_insured_licenseState', '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
 		clearSNILicenseStateError();
 		clearSNILicenseNumberError();
 		
 		//reset secondary insured P* value 
 		$('#secondary_insured_pstarexists').val("");

 		if($('#app_first_name_Error').length>0 
 				&& $('#app_first_name_sec_Error_Col').length>0){
			showClearInLineErrorMsgsWithMap($('#secondary_insured_firstName').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
 		}

 		if($('#app_last_name_Error').length>0 
 				&& $('#app_last_name_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_lastName').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_birth_date_Error').length>0 
 				&& $('#app_birth_date_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap( $('#secondary_insured_birth_date').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_marital_status_Error').length>0 
 				&& $('#app_marital_status_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_maritalStatusCd').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}

 		if($('#app_mask_ssn_Error').length>0 
 				&& $('#app_mask_ssn_sec_Error_Col').length>0){
 			showClearInLineErrorMsgsWithMap($('#secondary_insured_mask_ssn_SECONDARY').attr('id'), '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
		}
 	}

	function isValidPolicyEffDate(elementId, strRequired){
		var strVal = $(elementId).val();
		var msg = '';
		if (strRequired == 'Yes'){
			if ((strVal == null) || (strVal == "") || (strVal == dateLabel)){
				msg = 'Invalid';
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
		var returnval=true;
		if (!validformat.test(strEffDate))
		{
		// don't clear dates
		//	$(elementId).val("");
			return 'Invalid';
		}
		else
		{
			return '';
		}
	}

	function isValidBirthDate(elementId, strRequired){
		var strVal = $(elementId).val();
		var msg = '';
		if (strRequired == 'Yes'){
			if ((strVal == null) || (strVal == "")){
				msg = 'required';
			}
			else{
				msg=checkBirthDateValidRange(elementId);
			}
		}
		else{
			msg ='';
		}
		return msg;
	}

	//birth date validation
	function checkBirthDateValidRange(elementId){
		var strMsg = '';
		var dateString = $(elementId).val();
		if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
    	{
			return 'Invalid';
    	}
	    var parts = dateString.split("/");
	    var day = parseInt(parts[1], 10);
	    var month = parseInt(parts[0], 10);
	    var year = parseInt(parts[2], 10); //1998

	    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	    // Adjust for leap years
	    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
	        monthLength[1] = 29;
	    // Check the range of the day
	    if(day > 0 && day <= monthLength[month - 1]){
	    	//return ''
	    }
	    else{
	    		return 'Invalid';
	    }
	    //pass birth date and validate against policy eff date Or current day
	    strMsg = checkMinMaxAgeViolation(year,month,day);
	    return strMsg;
	}

	//Check if policy effective is present if not take the current date
	function checkMinMaxAgeViolation(year,month,day){
		var strMsg = '';
		var policyEffDate = $('#policyEffectiveDate').val();
		var isPolEffDateValid = '';
	    if(policyEffDate !=null && policyEffDate !='' && policyEffDate !=undefined)
	    {
	    	isPolEffDateValid = checkEffectivePolicyDateValidity($('#policyEffectiveDate'));
	    }
	    else if(policyEffDate ==null || policyEffDate =='' || policyEffDate ==undefined){
	    	 policyEffDate = new XDate().toString('MM/dd/yyyy');
	    	 isPolEffDateValid = '';
	    }
    	//this is a valid policy effective date
    	if(isPolEffDateValid==''){
    	var policyEffDateArr = policyEffDate.split("/");
    	var yearPolicyEffDate = parseInt(policyEffDateArr[2]);
    	var dayPolicyEffDate = parseInt(policyEffDateArr[1]);
    	var monthPolicyEffDate = parseInt(policyEffDateArr[0]);
    	var age = yearPolicyEffDate - year;
        if(month > monthPolicyEffDate){
        	age = age - 1;
        }
        else if(month == monthPolicyEffDate && day > dayPolicyEffDate){
        	age = age - 1;
        };

        if(parseInt(age)<15){
        	strMsg='MinViolation';
        }
       // 32622- 1/31 Client - DOB Messages when an invalid date format entered are wrong.
       // The YYYY must be a valid 4 digit year between 1900 and the current year, so we should display Date format should be MM/DD/YYYY, as per the common edits. 
        var currentDate = new XDate().toString('MM/dd/yyyy');
		var current_year = parseInt(currentDate.split("/")[2]);
       if(year < 1900 || year > current_year){
        	strMsg = 'Invalid';
        }	
    }
	    return strMsg;
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


function isNameClient(strVal, strRequired){
		if (strRequired == 'Yes')
		{
			if ((strVal == null) || (strVal == ""))
			{
				return 'required';
			}
			else if (strVal.length > 1)
			{
				var regex = /^[A-Za-z0-9_'& ]{1,30}$/;

				if(regex.test(strVal))
				{
					return '';
				}
				else
				{
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

function isRequiredAndNotEmpty(strVal, strRequired){
	if (strRequired == 'Yes')
	{
		if ((strVal == null) || (strVal == ""))
		{
			return 'required';
		}
		else
			{
				return '';
			}

	}
	else
	{
		return '';
	}
}


function isRequiredAndNotEmptyAddress(strVal, strRequired){

	if (strRequired == 'Yes')
	{
		if ((strVal == null) || (strVal == ""))
		{
			return 'required';
		}
		else if (strVal.length > 1)
		{
			var regex = /^[\\/,.#a-zA-Z0-9-'& ]+$/i;
			if(regex.test(strVal))
			{
				return '';
			}
			else
			{
				return 'InvalidLength';
			}
		}
		else
		{
			return '';
		}
	}
	else{

		if ((strVal == null) || (strVal == ""))
		{
			return '';
		}

		else if(strVal.length >=1)
		{
		var regex = /^[\\/,.#a-zA-Z0-9-'& ]+$/i;

		if(regex.test(strVal))
		{
			return '';
		}
		else
		{
			return 'InvalidLength';
		}
		}
		else
		return '';
	}
}

function isValidEmail(name, elementId,strRequired, strErrorTag, strErrorRow, index)
{
		//52265 - Email field does not except address with 2 dots (mike@mit.faculty.edu)
		var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w)+)?)((\.(\w){2,6})+)$/i);
		var emailAddress = $(elementId).val();
		var errorMessageID = '';
		var pruCenterBenefitsInd = $('#pruCenterBenefitsInd').val();
		var existingPayplanCd = $('#existingPayplanCd').val();
		
		//Recurring Payment changes
		if (isEndorsement()){			
		if(pruCenterBenefitsInd == 'Yes' || (existingPayplanCd == '5REC' || existingPayplanCd == '10REC' || existingPayplanCd == 'ACC')) {
				if (emailAddress == null || emailAddress == '') {
					if(pruCenterBenefitsInd == 'Yes'){
						errorMessageID = 'addressEmailID.pcap.browser.inLine' + '.' + 'required';
					}else{
						errorMessageID = 'addressEmailID.acc.browser.inLine' + '.' + 'required';
					}
				}else {
					var valid = emailRegex.test(emailAddress);
					if (!valid){
						errorMessageID = strErrorTag + '.' + 'InvalidEmailId';
					}
				}
			} 
			showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
			return;
		}
		
		if(emailAddress==null || emailAddress =='' || emailAddress == 'Optional'){
			 errorMessageID = '';
		}
		else{
			var valid = emailRegex.test(emailAddress);
			if (!valid){
				errorMessageID = 'InvalidEmailId';
				errorMessageID = strErrorTag + '.' + errorMessageID;
				//$('#'+elementId.id).val("");
			}
			else{
				errorMessageID = '';
		    }
		}
		showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessages, addDeleteCallback);
}

function isValidTerm(name, elementId,strRequired, strErrorTag, strErrorRow, index){}

var addDeleteCallback = function(row, addIt) {
	//alert('what i waana do with call back?');
}

function handleSubmit(e) {
	var selectedAgencyProfileText = $.trim($('#agency_hier_id option:selected').text());		
	if($("#empType").val() == 'A' && !isEndorsement()){		
			$('#selectedAgencyText').val(selectedAgencyProfileText);
	}
	$('#agencyShortName').val($.trim(selectedAgencyProfileText.substring(0,10)));
	
	// to be fixed in navigation.js to avoid 'form'.trigger
	// temp fix to call function one time
	if (!blnHandleSubmit) {
		setPrefillDataUpdatedIndicator('client');
		// set boolean value
		blnHandleSubmit = true;
	}

	//setUpSSNValues();
	//final check for valid date format's
	// clean fields that do not have valid formats
	checkInvalidDateFormats("#policyEffectiveDate");
	
	if($('#primary_insured_rmvLookupInd').val() != 'Yes'){ 
		checkInvalidDateFormats("#primary_insured_birth_date");
	}
	
	if($('#secondary_insured_rmvLookupInd').val() != 'Yes'){ 
		checkInvalidDateFormats("#secondary_insured_birth_date");
	}
	
	
	setMailingCity();
	
	if(isEndorsementResidenceAddressChanged()){
		if (isEndorsement()) {
			processResidentialAddressUpdate(e);
		}
		$('#primaryAddressChanged').val('Yes');
	}
	if(isEndorsementMailingAddressChanged()){
		$('#mailingAddressChanged').val('Yes');
	}
	if(isMailingAddressValidationRequired() == 'N'){
		$('#mailingAddressDeleted').val('');
	}
	else{
		$('#mailingAddressDeleted').val('Yes');
	}
	
	//Policy Term - Enable to submit
	$('#njPolicyTerm,#salesProgram').prop('disabled',false).trigger("chosen:updated");
	
	$('#policyStateCd').prop('disabled',false).trigger("chosen:updated");
	
	if(!isQuote() && !isEndorsement()){
		processTeachersElibilityQuestions(e);
	}
	$('#primary_insured_licenseState').prop('disabled',false).trigger("chosen:updated");
	$('#primary_insured_licenseNumber').prop('disabled',false);
	$('#secondary_insured_licenseState').prop('disabled',false).trigger("chosen:updated");
	$('#secondary_insured_licenseNumber').prop('disabled',false);
	// Enable fields so the values submit
	protectedFields(false);
	//prevent page submision for ie browsers
	if(e.preventDefault){
    	e.preventDefault();
    }
    else{
    	 e.returnValue = false;
    }
}

function isPNIDataAndAddressUpdated() {
	if ( $("#transactionProgress").val() != '' && parseInt($("#transactionProgress").val()) > 1 ) {
		if ( isNameDOBChangedForPNI() && isAddressChanged() ) {
			return true;
		}
	}
	return false;
}


function isPNIDataOrAddressUpdated() {
	if ( $("#transactionProgress").val() != '' && parseInt($("#transactionProgress").val()) > 1 ) {
		//if ( isNameDOBChangedForPNI() || isAddressExceptCityChanged() ) {
		if ( isNameDOBChangedForPNI() || isAddressChanged() ) {
			return true;
		}
	}
	return false;
}

//endorsement check start 
function dobAndInsuredChanged(){
	
	var priExistsPStar = $('#primary_insured_pstarexists').val();
	var secExistsPStar = $('#secondary_insured_pstarexists').val();	
	var currVal;
	var originalVal;
	var blnReturn = false;
	var priDobChanged = false;
	var secDobChanged = false;
	var pniCount = 0;
	var secCount = 0;
	
	$('input.clsDateOfBirth').each(function() {
		if ($(this).hasClass("clsPrimary")) {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
			if (currVal != originalVal) {
				priDobChanged = true;
			}
		}
		if ($(this).hasClass("clsSecondary")) {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
			if (currVal != originalVal) {
				secDobChanged = true;
			}
		}
	});
	
	if (priDobChanged && priExistsPStar == 'Yes') {
		pniCount = updatedCount("clsPrimary");
	}
	if (secDobChanged && secExistsPStar == 'Yes') {
		secCount = updatedCount("clsSecondary");
	}
	
	if(priExistsPStar == 'Yes' && (priDobChanged && parseInt(pniCount)>1)){
		//alert('priExistsPStar pniCount = '+pniCount);
		return true;
	}
	if(secExistsPStar == 'Yes' && (secDobChanged &&  parseInt(secCount)>1)){
		//alert('priExistsPStar secCount = '+secCount);
		return true;
	}
	
	return false;
}

function updatedCount(updatedClass){
		var count = 0;
		$('input.clsFirstName,input.clsMiddleName,input.clsLastName,input.maskSSN,select.suffix,select.maritalStatus').each(function() {
			if ($(this).hasClass(updatedClass)) {
			if ($(this).is('select:not(select[multiple])')){
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).data('OriginalValue'));
			if(originalVal ==''){
				originalVal = $.trim($(this).prop('defaultValue'));
			}
		} else {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
		}
			//alert(updatedClass+' currVal = '+currVal+' originalVal = '+originalVal);
			if (currVal != originalVal) {
			count++;
		}
		}
	});
	return count;
}

function showMessageForDOBPNIDataModify(){
	messageTxt = 'Cannot change two or more fields for a Client, please contact Customer Care. ';
	$('#question').find('button.primaryBtn').text("Ok");
	$('#question').find('button.secondaryBtn').remove();
	$('#question #message').html(messageTxt);
	$('#question').modal({
		'backdrop': 'static',
		'keyboard': false,
		'show': true
	});
	$.blockUI({ message: '' });
	$('#yes').unbind('click');
	$('#yes').click(function() {
		$('#question').modal('hide');
		
	});	
	$('#question').on('hidden', function(){
		$.unblockUI();
	});
}
//endorsement check end

function isNameDOBChangedForPNI() {
	var currVal;
	var originalVal;
	var blnReturn = false;
	$('input.clsFirstName, input.clsLastName, input.clsDateOfBirth').each(function() {
		if ($(this).hasClass("clsPrimary")) {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
			if (currVal != originalVal) {
				blnReturn = true;
				return true;
			}
		}
	});
	return blnReturn;
}

function isSNIAddedOrDeleted(){
	if($('#secondary_insured_operation').val()=='DELETE'
		|| $('#secondary_insured_operation').val()=='ADD'){
		return true;
	}
	return false;
}

function isNameDOBChangedForSNI() {
	var currVal;
	var originalVal;
	var blnReturn = false;

	$('input.clsFirstName, input.clsLastName, input.clsDateOfBirth').each(function() {
		if ($(this).hasClass("clsSecondary")) {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));

			if (currVal != originalVal) {
				blnReturn = true;
				return true;
			}
		}
	});

	return blnReturn;
}

function isSNILicDetailsInfoChanged() {
	var currVal;
	var originalVal;
	var blnReturn = false;
	
	//#55099 Endorsement
	if(isEndorsement()) {
		$('input.clsLicenseNumber').each(function() {
			if ($(this).hasClass("clsSecondary")) {
				currVal = $.trim($(this).val());
				originalVal = $.trim($(this).prop('defaultValue'));
	
				if (currVal != originalVal) {
					blnReturn = true;
					return true;
				}
			}
		});
	}

	return blnReturn;
}

function isAddressChanged() {
	var currVal;
	var originalVal;
	var blnReturn = false;

	$('input.clsResiAddr1, input.clsResiZip, select.clsZipCityResiSelect').each(function() {
		if ($(this).is('select:not(select[multiple])')){
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).data('OriginalValue'));
			if(originalVal==''){
				originalVal = $.trim($(this).prop('defaultValue'));
			}
		} else {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
		}

		if (currVal != originalVal) {
			blnReturn = true;
			return true;
		}
	});
	return blnReturn;
}

function isEndorsementMailingAddressChanged() {
	var currVal;
	var originalVal;
	var blnReturn = false;

	$('input.clsMailingAddr1, input.clsMailingAddr2,input.clsMailingZip,input.clsMailingZipPlusFour, select.clsMailingZipCitySelect,input.clsMailingZipCityInput,select.clsMailingState')
	.each(function() {
		if ($(this).is('select:not(select[multiple])')){
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).data('OriginalValue'));
			if(originalVal==''){
				originalVal = $.trim($(this).prop('defaultValue'));
			}
		} else {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
		}

		if (currVal != originalVal) {
			blnReturn = true;
			return true;
		}
	});
	return blnReturn;
}

function isEndorsementResidenceAddressChanged() {
	var currVal;
	var originalVal;
	var blnReturn = false;

	$('input.clsResiAddr1, input.clsResiAddr2,input.clsResiZip,input.clsResiZipPlusFour, select.clsZipCityResiSelect,select.clsResiState')
	.each(function() {
		if ($(this).is('select:not(select[multiple])')){
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).data('OriginalValue'));
			if(originalVal==''){
				originalVal = $.trim($(this).prop('defaultValue'));
			}
		} else {
			currVal = $.trim($(this).val());
			originalVal = $.trim($(this).prop('defaultValue'));
		}

		if (currVal != originalVal) {
			blnReturn = true;
			return true;
		}
	});
	return blnReturn;
}

function isMailingAddressValidationRequired() {
	var mailingAddressDeleted = $('#shouldValidateMailingAddress').val()
	return mailingAddressDeleted;
}

//Overrides method from common.js
//While leaving Client, certain fields need to be enabled
function jumpToDifferentTab(nextTab){
	protectedFields(false);
	$('#njPolicyTerm,#salesProgram').prop('disabled',false).trigger("chosen:updated");
	blockUser();
	document.aiForm.nextTab.value = nextTab;
	document.aiForm.submit();
}

function navigateToNextTab(strTarget){
	if(strTarget=='summary'){
		rateOnSummary();
	} else{
		nextTab(document.aiForm.currentTab.value, strTarget);
	}
}

function navigateToNextTabWithoutReorder(strTarget){
	$("#reOrderReports").val('');
	navigateToNextTab(strTarget);
	return;	
}

function executeReorderWorkflowFromClient(){	
	var strReports = filterUnwantedReorderRequests(getSuccessfulReports());
	if(strReports==''){
		return '';
	}
	var prefillReorderRequired =  $("#PREFILL_StatusDesc").val() != null && $("#PREFILL_StatusDesc").val().indexOf('Reorder') != -1;
	var clueReorderRequired = $("#clueOrderStatus").val() == 'Reorder Required';
	var householdReorderRequired = $('#householdAccidentOrderInd').val() == 'Reorder Required';

	//If CLUE status is already reset to "Reorder Required", do  not do it again
	if(clueReorderRequired){
		strReports = strReports.replace('Clue','');
	}
	
	//If Prefill status is already reset to "Reorder Required", do  not do it again
	if(prefillReorderRequired){
		strReports = strReports.replace('Prefill','');
	}
	
	//12/31/2014 If Household order status is already reset to "Reorder Required", do  not do it again
	if(householdReorderRequired){
		strReports = strReports.replace('Household','');
	}
	
	$("#reOrderReports").val(strReports);
	if(strReports.indexOf('MVR')!=-1){
		setApplicantMVRStatustoReorderRequired(strReports);
	}	
}

function filterUnwantedReorderRequests(strReports){
	if(strReports==null || strReports==''){
		return '';
	}
	var varPNIDataAndAddressUpdated = isPNIDataAndAddressUpdated();
	var varPNIDataOrAddressUpdated = isPNIDataOrAddressUpdated();
	var varNameDOBChangedForPNI = isNameDOBChangedForPNI();
	var varNameDOBChangedForSNI = isNameDOBChangedForSNI();
	var varLicInfoChangedForSNI = isSNILicDetailsInfoChanged();//#55099
	var varSNIAddedOrDeleted = isSNIAddedOrDeleted();
	var varIsAddressChanged = isAddressChanged();
		
	//If no information was changed, do not reset any flags
	if(!varPNIDataOrAddressUpdated && !varNameDOBChangedForSNI && !varSNIAddedOrDeleted && !varLicInfoChangedForSNI){
		return '';
	}
	
	//12/19/2014 - CLUE and Household flags are mutually exclusive. Do not treat them the same.
	//Household flag is only for MA 
	if($('#policyStateCd').val()=='MA'){
		strReports = strReports.replace('Clue','');
	} else{
		strReports = strReports.replace('Household','');
	}
	
	//If PNI information was not changed, Prefill and Clue flags need not be reset 
	if(!varPNIDataOrAddressUpdated){
		strReports = strReports.replace('Prefill','');
		strReports = strReports.replace('Clue','');
	}
	
	if(strReports.indexOf('Prefill')!=-1){
		if(varNameDOBChangedForPNI){
			$('#prefillClearOldPniInfo').val('true');	
		}		
		if(varNameDOBChangedForSNI){ //varLicInfoChangedForSNI to be included also??
			$('#prefillClearOldSniInfo').val('true');
		}
	}
	
	//If only SNI information is changed, only MVR reorder (not CLUE or PREFILL) can happen 
	if(strReports.indexOf('MVR')!=-1 
			&& (varNameDOBChangedForSNI || varLicInfoChangedForSNI || varSNIAddedOrDeleted) 
			&& !varPNIDataOrAddressUpdated){
		strReports = 'MVR';
	}
	
	//If name and DOB and Lic num was not changed, MVR need not trigger
	if(strReports.indexOf('MVR')!=-1 
			&& !varNameDOBChangedForPNI 
			&& !varSNIAddedOrDeleted 
			&& !varNameDOBChangedForSNI
			&& !varLicInfoChangedForSNI
	){
		strReports = strReports.replace('MVR','');
	}

	//CLUE reorder
	//OR condition - Successful-No Data and Unsuccessful only
	//AND condition - Successful, Successful-No Data and Unsuccessful only
	if(strReports.indexOf('Clue')!=-1){
		if(varPNIDataAndAddressUpdated){
			//no need to filter out CLUE
		}
		else if(varPNIDataOrAddressUpdated && $("#clueOrderStatus").val()=='Successful'){
			strReports = strReports.replace('Clue','');
		}
	}
	
	//PREFILL reorder
	//OR condition - Successful-No Data and Unsuccessful only
	//AND condition - Successful, Successful-No Data and Unsuccessful only
	if(strReports.indexOf('Prefill')!=-1){
		if(varPNIDataAndAddressUpdated){
			//no need to filter out Prefill
		}
		else if(varPNIDataOrAddressUpdated && $("#PREFILL_StatusDesc").val()=='Successful'){
			strReports = strReports.replace('Prefill','');
		}
	}
	
	//12/03	MA rules for household accident order
	if(strReports.indexOf('Household')!=-1){
		//12/23/2014 If address was not changed, it means AND condition isn't triggered
		//Household flag should be reset in this case.
		//This is wrong because if only address was changed, it would still retain the HH flag
		/*if(!varIsAddressChanged){
			strReports = strReports.replace('Household','');
		}*/
		
		//Household flag should be cleared only if an AND condition is executed
		//55367 - Day1 there is no reorder of CLUE so commenting out the household check
		/*var clearHouseholdFlag = true;
		if(varIsAddressChanged
				&& (varPNIDataOrAddressUpdated
						|| varNameDOBChangedForSNI 
						|| varSNIAddedOrDeleted)){
			clearHouseholdFlag = false;
		}
		if(clearHouseholdFlag){
			strReports = strReports.replace('Household','');
		}*/
		strReports = strReports.replace('Household','');
	}
	
	return strReports;		
}

function questionMessageForPNIDataModify(strReports, strTarget) {
	if (strReports == '' || strReports==null) { 
		navigateToNextTabWithoutReorder(strTarget);			
		return;	
	}
	
	var varNameDOBChangedForSNI = isNameDOBChangedForSNI();
	var varLicInfoChangedForSNI = isSNILicDetailsInfoChanged();//#55099
	var varSNIAddedOrDeleted = isSNIAddedOrDeleted();
	var varNameDOBChangedForPNI = isNameDOBChangedForPNI();	
	strReports = filterUnwantedReorderRequests(strReports);

	//Only MVR
	//Do not trigger popup again if violation order status is previously reset 
	if(strReports=='MVR'){
		var reorderForPNI=false;
		var reorderForSNI=false;
		if(varSNIAddedOrDeleted){
			$('#secondary_insured_mvrOrderSatatus').val('');
		}
		if(varNameDOBChangedForPNI 
				&& ($('#primary_insured_mvrOrderSatatus').val()!='Reorder Required' 
					&& $('#primary_insured_mvrOrderSatatus').val()!='' 
					&& $('#primary_insured_mvrOrderSatatus').val()!='Has not ordered yet'
					&& $('#primary_insured_mvrOrderSatatus').val()!=null)){
			reorderForPNI=true;
		}
		if(varNameDOBChangedForSNI 
				&& ($('#secondary_insured_mvrOrderSatatus').val()!='Reorder Required' 
						&& $('#secondary_insured_mvrOrderSatatus').val()!='' 
						&& $('#secondary_insured_mvrOrderSatatus').val()!='Has not ordered yet'
						&& $('#secondary_insured_mvrOrderSatatus').val()!=null)){
			reorderForSNI=true;
		}
		
		//#55099...
		if (varLicInfoChangedForSNI) { //irrespective of secondary_insured_mvrOrderSatatus 
			reorderForSNI=true;
		}
		
		if(!reorderForPNI && !reorderForSNI && !varSNIAddedOrDeleted){
			navigateToNextTabWithoutReorder(strTarget);	
			return;	
		}
		submitPrefillClueMVRReport('MVR',strTarget);
		return;		
	}

	if(strReports==''){
		navigateToNextTabWithoutReorder(strTarget);
		return;	
	}

	//Can be a combination of "MVR", "Clue", "Prefill" and "Household"
	submitPrefillClueMVRReport(strReports,strTarget);
	return;
}

function submitPrefillClueMVRReport(strReports,strTarget){
	switch(strReports) {
	 	case "MVR":
	 		messageTxt = 'Changes on client information will require incident activity to be refreshed for the affected Named Insured(s). '; 
	 		messageTxt =  messageTxt + 'Clicking "Continue" will delete current activity. ';
	 		messageTxt =  messageTxt + 'Please review the accident and violations tab and reconcile activity or order reports for newly added or changed insured(s).'+'<br>';
	 		messageTxt =  messageTxt + '<br>';
	 		messageTxt =  messageTxt + '<b>Note: Reconciliation of third party activity is required prior to issuance. Any quote obtained prior to '; 
	 		messageTxt =  messageTxt + 'reconciliation does not include all relevant incident activity.</b>';
	 		break;
	 	default:
	 		messageTxt = 'Changes to the named insured information will require incident activity to be reordered. '; 
	 		messageTxt =  messageTxt + 'Clicking "Continue" will delete current activity. ';
	 		messageTxt =  messageTxt + 'To accurately update your quote, use the Order Reports button to refresh all incident activity.' +'<br>';
	 		messageTxt =  messageTxt + '<br>';
	 		messageTxt =  messageTxt + '<b>Note: Ordering Reports is required prior to issuance. Any quote obtained prior to '; 
	 		messageTxt =  messageTxt + 'ordering reports does not include all relevant incident activity.</b>';
	}
	
	//Only "show" reorder popup if CLUE or Prefill status is "Reorder Required". Do not trigger reorder again
	var prefillReorderRequired =  $("#PREFILL_StatusDesc").val() != null && $("#PREFILL_StatusDesc").val().indexOf('Reorder') != -1;
	var clueReorderRequired = $("#clueOrderStatus").val() == 'Reorder Required';

	if(clueReorderRequired){
		strReports = strReports.replace('Clue','');
	}

	$('#question').find('button.primaryBtn').text("Continue with Re-order");
	$('#question').find('button.secondaryBtn').addClass('abandonChanges').text("Abandon Changes");
	$('#question').find('#closeQuestion').text("Close").show();
	$('#question').find('.closeModal').removeClass('closeModal').addClass('abandonChanges');
	$('#question #message').html(messageTxt);
	$('#question').modal({
		'backdrop': 'static',
		'keyboard': false,
		'show': true
	});
	
	$.blockUI({ message: '' });
	$('#yes').unbind('click');
	$('#yes').click(function() {
		$('#question').modal('hide');
		if ($("#reOrderReports").length > 0) {
			$("#reOrderReports").val(strReports);
		}
		setApplicantMVRStatustoReorderRequired(strReports);
		//flag for Reorder report to handle error
		document.aiForm.reOrderMsg.value = 'true';
		if(strReports.indexOf('Prefill')!=-1){
			$('#prefillReorder').val('true');
		}		
		// submit client page
		navigateToNextTab(strTarget);
	});
	
	//49278 - Re-order message off client, when clicking on X or selecting Close, changes made do not clear.
	$('.abandonChanges').unbind('click');
	$('.abandonChanges').click(function() {
		$('#question').modal('hide');
	    abondonPNIAndAddrChanges();
	    //49277 - Changing First Name and DOB - Clicking on Abandon Changes from POP MESSAGE wiping out DL on Driver tab
	    $('#clueReOrderInd,#reOrderReports,#prefillClearOldPniInfo,#prefillClearOldSniInfo').val("");
	    if(this.id=='no'){
	    	 navigateToNextTab(strTarget);
	    }
	});	
	
	$('#question').on('hidden', function(){
		$.unblockUI();
	});
}


function setApplicantMVRStatustoReorderRequired(strReports){
	if(strReports!=null && strReports.indexOf('MVR')!=-1){
		$('input.clsFirstName, input.clsLastName, input.clsDateOfBirth, input.clsLicenseNumber').each(function() {
			var isPrimaryInsured = $(this).attr('id').indexOf('primary_insured')!=-1;
			if($(this).val()!=$(this).prop('defaultValue')){
				if(isPrimaryInsured 
						&& ($('#primary_insured_mvrOrderSatatus').val()=='Successful' 
							|| $('#primary_insured_mvrOrderSatatus').val()=='Successful-No Data' )){
					$('#primary_insured_mvrOrderSatatus').val('Reorder Required'); 
				}
				//55099 - theMvrOrderSatatus is blank in some cases and if we are forcing it to reorder then 
				// check if the order status is empty and update to 'reorder required'
				if(!isPrimaryInsured 
						&& ($('#secondary_insured_mvrOrderSatatus').val()=='Successful' 
							|| $('#secondary_insured_mvrOrderSatatus').val()=='Successful-No Data'
								|| $('#secondary_insured_mvrOrderSatatus').val()=='')){
					$('#secondary_insured_mvrOrderSatatus').val('Reorder Required'); 
				}
				
				//12/22/2014 Updated Clue status too 
				if(isPrimaryInsured 
						&& $('#primary_insured_licenseState_hidden').val() == 'MA'
						&& ($('#primary_insured_clueOrderSatatus').val()=='Successful' 
							|| $('#primary_insured_clueOrderSatatus').val()=='Successful-No Data' )){
					$('#primary_insured_clueOrderSatatus').val('Reorder Required'); 
				}
				if(!isPrimaryInsured 
						&& $('#secondary_insured_licenseState_hidden').val() == 'MA'
						&& ($('#secondary_insured_clueOrderSatatus').val()=='Successful' 
							|| $('#secondary_insured_clueOrderSatatus').val()=='Successful-No Data' 
								|| $('#secondary_insured_clueOrderSatatus').val()=='')){
					$('#secondary_insured_clueOrderSatatus').val('Reorder Required'); 
				}
			}
		});
	}
}

function abondonPNIAndAddrChanges() {
	// revert back name&dob changes
	$('input.clsFirstName, input.clsLastName, input.clsMiddleName, select.suffix, input.clsDateOfBirth').each(function() {
		if ($(this).hasClass("clsPrimary") || $(this).hasClass("clsSecondary")) {
			if ($(this).hasClass("suffix")) {
				// get original suffix and repopulate NI suffix fields
				var id = $(this).attr('id');
				var originalSuffix = $('#origSuffix_' + id).val();
				$('#' + id + '_hidden').val(originalSuffix);
				$('#' + id).val(originalSuffix);
				$('#' + id).trigger('chosen:updated').trigger('chosen:styleUpdated');
			}else{
				$(this).val($.trim($(this).prop('defaultValue')));
			}
		}
	});

	// revert back address changes
	//41772 - The APT number field is not clearing when clicking on  Abandon Changes 
	$('input.clsResiAddr1, input.clsResiAddr2, input.clsResiZip, input.clsResiZipPlusFour , select.clsZipCityResiSelect').each(function() {
		if ($(this).hasClass("colZipCitySelect")) {
			//var originalVal = $.trim($(this).data('OriginalValue'));
			//39919-AI 2.0  HTTP 500 error after changing birthdate and clicking 'yes' for prefill
			var originalVal = $('#origAddressCity').val();
			//55782 -We don't have the value in ENDR JSP so its always undefined for ENDR
			if(originalVal != undefined){
				$('#addressCity').val(originalVal);
			}
			
			//42606-Reorder - Clicking on Abanbon Changes not reverting back to original SSN
			var origPriSsn = $('#original_insured_mask_ssn_PRIMARY').val();
			$('#insured_mask_ssn_PRIMARY').val(origPriSsn);
			var origSecSsn = $('#original_insured_mask_ssn_SECONDARY').val();
			$('#insured_mask_ssn_SECONDARY').val(origSecSsn);
			
		} else {
			$(this).val($.trim($(this).prop('defaultValue')));
		}
	});
	//55782 -- need to put back old license number for MA
	$('input.rmvLincenseLookup').each(function() {
		if ($(this).hasClass("clsSecondary")) {
			$(this).val($.trim($(this).prop('defaultValue')));
		}	
	});
	//Td#50967-Client -  The Abandon Changes button on the 3rd party msg 
	//dialog is not working when user tries to abandon changes on a delete 2nd ni.
	var secondaryInsuredAbondonChange = true;
	//48220
	if($('#secondary_insured_operation').val()=='DELETE'){
		secondaryInsuredAbondonChange = false;
		$('#addCoApplicant').trigger('click');
		$('#secondary_insured_maritalStatusCd').removeClass('preRequired').trigger('chosen:styleUpdated');
	}
	
	//48220 - Abandon Changes on ADD 2nd NI.//55782 - ignore for MA ENDR as it will delete the sni
	if($('#secondary_insured_operation').val()=='ADD' && !(isEndorsement() && "MA" == $('#stateCd').val()) && secondaryInsuredAbondonChange){
		secondaryInsuredAbondonChange = false;
		$('#removeCoAppYes').trigger('click');
	}

}


function bindCoApplicantColumn(){
	// add yellow prefill to fields if needed
	var selectorForNewlyAddedColumn = $('.secondaryInsured');
	
	applyFirstTimeThruStyle(selectorForNewlyAddedColumn , 'true');
	
	/*$('.secondaryInsured .required').each(function() {
		var obj = this;
		//addRemovePreRequired(this);
		
		$(obj).blur(function(){
			$(this).removeClass('preRequired');
    		if($(this).is('select')){				
  				$(this).trigger('chosen:styleUpdated');
  			}
		});
	
		$(obj).change(function(){
			$(this).removeClass('preRequired');
    		if($(this).is('select')){				
  				$(this).trigger('chosen:styleUpdated');
  			}
		});
		
		$(obj).focus(function(){
	    	$(this).removeClass('preRequired');
	 	});
	});	 
	
	// set optional watermark on appropriate fields
	$('.secondaryInsured .optional').each(function() {
		var obj = this; 
		var optional = 'Optional';
		
		if (null != $(obj).val() && $(obj).val().length == 0) {
	    	$(this).val(optional).addClass('watermark');
	  		
		}
		
		//if blur and no value inside, set watermark text and class again.
	 	$(obj).blur(function(){
	  		if ($(this).val().length == 0){
	    		$(this).val(optional).addClass('watermark');
			}
	 	});
	 	
	 	//if focus and text is optional, set it to empty and remove the watermark class
		$(obj).focus(function(){
	  		if ($(this).val() == optional){
	    		$(this).val('').removeClass('watermark');
			}
		});
	});*/	
}

function setInitialFocus(){
	var tabbables = $("#mainContentTable >tbody .tabOrder");
	tabbables.each(function() {
		var disabled = $(this).is(':disabled');
		if(!disabled){
			var focusOn = $(this).attr('id');
			if($('#'+focusOn).is('select:not(select[multiple])')){
			       var chosenContainer = $('#'+focusOn).next();
			       // Focus the anchor element | We focus to the a element now after tabbing changes
			       chosenContainer.find('a').focus();   
			}
			else
			{
				$('#'+focusOn).focus();
			}
			$('#'+focusOn).on("focus", function(){
				 window.scrollTo(0,0);
			 });
			return false;
		}
	});
}

function getPolEffDate(sDate){
	if(sDate == dateLabel){
		sDate = "";
	}
	return sDate;
}

//function setFocuFromNext(event){
//	var keyCode = event.keyCode || event.which;
//	if(keyCode == 9 && !event.shiftKey) {
//	  event.preventDefault();
//	  setInitialFocus();
//	}
//}
var dateLabel = "mm/dd/yyyy";
var callSecurityPolDate = true;

function performAgencySearchPostSelection(branchHierarchyId, selectBoxId) {
	var lookupData = {};
	lookupData.branchHierarchyId = branchHierarchyId+"";
	lookupData.uwCompany = $('#uwCompanyCd').val();
	blockUser();
	
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "/aiui/client/agenciesList",
        type: "post",
        dataType: 'json',
        data : JSON.stringify(lookupData),
        timeout: 3000,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	populateAgencyDropDown(response);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	     // initializeADRData(null,textStatus);
        },
        complete: function(){
        	$.unblockUI();
      	// Refocus the select box to make it lost the blue highlight after user moves to other fields
        	if(selectBoxId && selectBoxId != '') setFocus(selectBoxId);
        }
    });
}

function performProducersSearchPostSelection(searchType,thisId,corpId) {
	//We are using the same method to call both agencies & producers since getNBProducers fetches every data.
	
	var sucess = false;
	var lookupData = {};
	lookupData.agencyHierarchyId = $('#agency_hier_id').val();
	lookupData.stateCd = $('#policyStateCd').val();
	lookupData.channelCd = $('#policyChannelCd').val();
	lookupData.policyefftDate = $('#policyEffectiveDate').val();
	lookupData.uwCompany = $('#uwCompanyCd').val();
	lookupData.corpId = corpId;
	
	//56127- Product getting lost
	if(isValidValue($('#policyProductCd').val())){
		lookupData.productCd = $('#policyProductCd').val();
	}else{
		var product_cd = $('#productCd').val(); 
		if(!isValidValue(product_cd)){
			product_cd = "ALN_PA";
		}
		lookupData.productCd = product_cd;
		$('#policyProductCd').val(product_cd).trigger("chosen:updated");
	}
	if(searchType == 'searchAgencies'){
		lookupData.agencyHierarchyId = $('#branch_hier_id').val();
	}
	lookupData.searchType = searchType;
	
	var jsonData = JSON.stringify(lookupData);
	
	// console.log(jsonData);

	var dataToCheckBlock = $(window).data();
	if(dataToCheckBlock["blockUI.isBlocked"] !== 1){
		blockUser();
	}
	
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "/aiui/client/producersList",
        type: "post",
        dataType: 'json',
        data : jsonData,
        timeout: 110000, //50782 - Change timeout to 11 secs
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	sucess=true;
        	if(searchType == 'searchAgencies'){
        		populateAgencyDropDown(response);
        	}
        	else{
        		if($("#empType").val() == 'A' && response != null && response.producerList != null){
        			//50782 - Optimization 
        			var i = response.producerList.length;
        			var data = $('#agency_hier_id option:selected').text();
        			var producerLevelCode = data.split('- ');
        			var alreadySelected = false;
        			while(i-- && !alreadySelected){
        				if((response.producerList.length) && (producerLevelCode[1] == response.producerList[i].producerLevelCode || $('#agency_hier_id').val() == response.producerList[i].producerId)){	        					
        					initializeAgencyData(response.producerList[i]);
        					alreadySelected = true;
        				}
        			}
        			if(!alreadySelected && response != null && response.producerList != null && response.producerList.length >= 1){       					
        				populateProducerDropDown(response.producerList);
        			}
        		}else if(response != null && response.producerList != null && response.producerList.length >= 1){			     			
        			populateProducerDropDown(response.producerList);
        		} else {
                	var agencyElement = $('#policyProducerInput');
        			agencyElement.prop('disabled',false);
        			emptySelect(agencyElement);
        			agencyElement.trigger("chosen:updated");
        		}
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	     // initializeADRData(null,textStatus);
        	sucess=false;
        },
        complete: function(){
        	$.unblockUI();
       		/*        	// Refocus the select box to make it lost the blue highlight after user moves to other fields
        	if(selectBoxId && selectBoxId != '') setFocus(selectBoxId);*/
        	
        	if(sucess && ($('#'+thisId).hasClass('clsBranch') || $('#'+thisId).hasClass('clsProduct'))){
        		validateBranchProduct();
        	}
        }
    });
}

function disableDateFieldsForSuccessfulRMVCall(){
	if($('#primary_insured_rmvLookupInd').val()=='Yes'){
		$("#primary_insured_birth_date").prop('disabled',true);
		$("#primary_insured_birth_date").datepicker().datepicker('disable');
		//#53699..existing NIs should not show RMV button/Status
		//processSuccessRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "primary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
		if (isEndorsement()) {
			if ($('#primary_insured_endorsementDriverAddedInd').val()=='Yes') {
				if (!isMaipPolicy()) {
				processSuccessRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "primary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
			}
			}
		} else {
			processSuccessRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "primary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
		}
	} else if($('#primary_insured_rmvLookupInd').val()=='X'){
		processErrorRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "primary_insured_licenseNumber", "No Hit" , null);
	}
	if($('#secondary_insured_rmvLookupInd').val()=='Yes'){
		$("#secondary_insured_birth_date").prop('disabled',true);
		$("#secondary_insured_birth_date").datepicker().datepicker('disable');
		//#53699..existing NIs should not show RMV button/Status
		if (isEndorsement()) {
			if ($('#secondary_insured_endorsementDriverAddedInd').val()=='Yes') {
				processSuccessRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "secondary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
			}
		}else{
			processSuccessRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "secondary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
		}		
	} else if($('#secondary_insured_rmvLookupInd').val()=='X'){
		processErrorRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "secondary_insured_licenseNumber", "No Hit" , null);
	}
}

function disableFieldsForSuccessfulRMVCall(){
	if(isEndorsement()){
		return;
	}
	if($('#primary_insured_rmvLookupInd').val()=='Yes'){
		$("#primary_insured_firstName").prop('disabled',true);
		$("#primary_insured_lastName").prop('disabled',true);
		$("#primary_insured_licenseState").prop('disabled',true).trigger('chosen:updated');
		$("#primary_insured_licenseNumber").prop('disabled',true);
	}

	//	3.2.1.C For  NBS and Endorsements:  After a successful lookup for the 2nd NI 
	//  He/she does NOT have their license protected, nor is their Name protected.
	//  The 2nd NI has their DOB protected and MM/DD masked.
	disableDateFieldsForSuccessfulRMVCall();
}

function initializeAgencyData(response){
	if(response !=null){
		//$("#agency_hier_id").val(response.agencyId);
		$("#branch_id").val(response.branchLevelCode);
		$("#producer_id").val(response.producerLevelCode);
		$("#agency_id").val(response.agencyLevelCode);
		$("#branch_hier_id").val(response.branchId);
		$('#policyCompanyCd').val(response.companyCode);
		$('#companyCd').val(response.companyCode);
		$('#policyChannelCd').val(response.channelCode);
		$('#uwCompanyCd').val(response.underWritingCompany);
		$('#policyUwCompanyCd').val(response.underWritingCompany);
		$('#serviceCenterInd').val(response.serviceCenterInd);
		
		$("#adrProcessCode").val(response.adrProcessCode);
		$("#adrUwGroupCode").val(response.adrUwCode);
		$("#adrModel14Code").val(response.adrModel14Code);
		$("#adrMarketingCd").val(response.adrMarketingCode);
		$("#fiServAuthId").val(response.fiServId);
		
		$("#superAgentInd").val(response.superAgency);
		
		agencyElement = $('#policyProducerInput');
		agencyElement.prop('disabled',false).trigger("chosen:updated");
		emptySelect(agencyElement);
		//$('#policyProductCd').prop('disabled',false).trigger("chosen:updated");
		agencyElement.append('<option value="' + $.trim(response.producerId) + '"selected data-support="'+$.trim(response.companyCorporationId)+'">' + response.producerWebDisplayName +" - "+ response.producerLevelCode + '</option>').trigger("chosen:updated");
		agencyElement.prop('disabled',true).trigger("chosen:updated");
		getuwCompanyandValidateProduct(false);
		validateBranchProduct();
	}
}

function populateAgencyDropDown(options) {
	agencyElement = $('#agency_hier_id');
	agencyElement.prop('disabled',false);
	emptySelect(agencyElement);
	var companyCode = '';
	if(options != null){
		if($("#empType").val() == 'E'){
			for (var i = 0; i < options.length; i++) {
				if (i < options.length) {
					agencyElement.append('<option value="' + $.trim(options[i].agencyId) + '">' + options[i].agencyWebDisplayName + ' - ' + options[i].agencyLevelCode + '</option>');
				}
			}
		}else{
			for (var i = 0; i < options.length; i++) {
				if (i < options.length) {
					if((options[i].companyCode != null || options[i].companyCode != undefined) &&(options[i].companyCode == 'PR' || options[i].companyCode == 'BK')){
						companyCode = ' - ' + options[i].companyCode;
					}else{
						companyCode = '';
					}
					agencyElement.append('<option value="' + $.trim(options[i].agencyId) + '">' + options[i].name +  companyCode + '</option>');
				}
			}
		}
	}
		agencyElement.trigger("chosen:updated");
}

function populateProducerDropDown(options) {
	agencyElement = $('#policyProducerInput');
	agencyElement.prop('disabled',false);
	//var isDisabled = $('#policyProductCd').is(":disabled");
	//$('#policyProductCd').prop('disabled',false).trigger("chosen:updated");
	var value = agencyElement.val();
	emptySelect(agencyElement);
	if(options != null){
		for (var i = 0; i < options.length; i++) {
			if (i < options.length) {
				agencyElement.append('<option value="' + $.trim(options[i].producerId) + '"data-support="'+$.trim(options[i].companyCorporationId)+'">' + options[i].producerWebDisplayName +" - "+ options[i].producerLevelCode + '</option>');
			}
		}
		if(value != null || value !=  undefined || value != ''){
			agencyElement.val(value);
		}
		
		/* 57658 - if only one producer is found, default it to that */
		if(options.length == 1){
			agencyElement.prop("selectedIndex", 1).trigger("blur");
			getuwCompanyandValidateProduct(agencyElement);
		}
	}
	agencyElement.trigger("chosen:updated");
	//$('#policyProductCd').prop('disabled',isDisabled).trigger("chosen:updated");
}

function protectedFields(action) {
	$('#branch_hier_id,#agency_hier_id,#policyProducerInput,#policyProductCd').prop('disabled',action).trigger("chosen:updated");
}

function processTeachersElibilityQuestions(event) {

	var badMessage = '';

	if ($('#uwCompanyCd').val() == "ALN_TEACH" && $('#eligibilityInd').val() != 'Yes')  {
		badMessage= badMessage + '1,';		
	} if ($('#uwCompanyCd').val() == "ALN_TEACH" && $('#policyChannelCd') == 'Captive' && $('#eligibilityInd').val() != 'Yes') {
		badMessage= badMessage + '1,';		
	}	
	//var errMsgId = "message" + badMessage;
	var msg_array = badMessage.split(',');
	
	if (badMessage != '') {
		event.stopPropagation();
		
		$('.teacherEligibilityErrorMsg').addClass('hidden');
		
		//$('#'+errMsgId+'').removeClass('hidden');
		for(var i = 0; i < msg_array.length; i++)
		{
		   // Trim the excess whitespace.
			msg_array[i] = msg_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   // Remove hidden fields for respective messages
		   $('#teachersmessage'+msg_array[i]).removeClass('hidden');
		}
		$('#teacherEligibilityErrorsModal').modal();
	}
}



function processResidentialAddressUpdate(event) {

	if ($('#rentEndrQualInd').val() == "Yes" && $('#continueRentEndr').val() != 'Yes')  {
		event.stopPropagation();
		
		$("#continueRenters").click(function(){
			$(".modal").modal('hide');
			$("#continueRentEndr").val("Yes");
			nextTab('client',event.targetTag);
		});
		
		$('#rentEndrModal').modal();	
	} 
	
}

function performADRSalesProgramSearch(selectBoxId, firstTime) {
	var lookupData = {};
	var srcBusiness = $('select[id=clientSourceOfBusinessCode]').val();
	
	if(($('#' + selectBoxId).val() != 'PREF_BK_RL' && $('#salesProgramOverrideInd').val() != 'Yes' && srcBusiness == 'EXIST_AGY' ) || firstTime == 'override')
	{
		var adrPriorCarrier = "";
		if($("#empType").val() == 'E'){		
			adrPriorCarrier = $('#priorCarrierName option:selected').text();
		}else{
			adrPriorCarrier = $('#priorCarrierNameAgent option:selected').text(); 
		}

		
		lookupData.agency_Heir_Id = $('#policyProducerInput').val();
		lookupData.co_Corp_Id = $('#policyProducerInput option:selected').data("support") + " ";
		lookupData.priorCarrier = adrPriorCarrier;
		lookupData.polEfftDate = $('#policyEffectiveDate').val();
		lookupData.stateCd = $('#stateCd').val();
		var jsonData = JSON.stringify(lookupData);


		blockUser();
		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			url: "/aiui/client/adrSalesProgram",
			type: "post",
			dataType: 'json',
			data : jsonData,
			timeout: 3000,
			// callback handler that will be called on success
			success: function(response, textStatus, jqXHR){				
				if (response != null && response.name != ''){					
					populateADRSalesProgram(selectBoxId,response);					
				}
				else {
					//Fix for TD# 62523 - sales program not defaulting
					setDefaultSalesProgram(selectBoxId)
				}
			},
			// callback handler that will be called on error
			error: function(jqXHR, textStatus, errorThrown){
				//Fix for TD# 62523 - sales program not defaulting
				setDefaultSalesProgram(selectBoxId);
				//initializeADRData(null,textStatus);
			},
			complete: function(){
				$.unblockUI();
				// Refocus the select box to make it lost the blue highlight after user moves to other fields
				//if(selectBoxId && selectBoxId != '') setFocus(selectBoxId);
			}
		});
	}
}

//Fix for TD# 62523 - sales program not defaulting
function setDefaultSalesProgram(selectBoxId){
	
	$('#salesProgramOverride').prop('disabled',false);
	$('#salesProgramOverride').prop('checked',false);
	if(selectBoxId == 'salesProgram'){
		$('#salesProgram').prop('disabled',true).val('IND_POL_TR').trigger("chosen:updated");
		validateSalesProgram();
	}
	else{
		$('#salesProgramAgentDefault').val('IND_POL_TR');
	}
}

function populateADRSalesProgram(selectBoxId,response){	
	if(response.name == 'Preferred Book Roll' && $('#noPrefBookRole').val() != 'true'){
		if(response.maxAdjustmentFactor == null && $('#stateCd').val() != 'MA' && $('#salesModal').val() != 'No'){
			$('#salesModal').val("No");
			$('#salesProgramModal').modal();
		}else{
			$("#maxAdjustmentFactor").val(response.maxAdjustmentFactor);
			$("#minAdjustmentFactor").val(response.minAdjustmentFactor);
			$("#upToleranceFactor").val(response.upToleranceFactor);
			$("#downToleranceFactor").val(response.downToleranceFactor);
			$("#exposureChangeIndicator").val(response.exposureChangeInd);
		}
		$('#pref_Book_Ind').val('Yes');
	}
	$('#pref_Book_Ind').val('No');
	if(selectBoxId == 'salesProgram'){
		$('#salesProgram option').filter(function() { 
			return ($(this).text() == response.name);
		}).prop('selected', true).trigger("chosen:updated");
		if(response.name == 'Preferred Book Roll' && $('#noPrefBookRole').val() == 'true'){
			$('#salesProgram').val('IND_POL_TR').trigger("chosen:updated");
		}
	}else{
		if(response.name == "Book Roll"){
			$('#salesProgramAgentDefault').val('BK_ROLL');
		}else if (response.name == "Renewal Account Review"){
			$('#salesProgramAgentDefault').val('RN_ACC_REV');
		}else{
			$('#salesProgramAgentDefault').val('IND_POL_TR');
		}
	}
	validateSalesProgram();
}

function getuwCompanyandValidateProduct(searchOption){
	var agencyHierarchyId = $('#agency_hier_id').val();
	var channel = $('#policyChannelCd').val();
	var companyCorpId = $('.clsProducer option:selected').data('support');
	var product = 'ALN_PA';
	var productIndicator = $('.clsProduct option:selected').data('support'); 
	var productDesc = $('.clsProduct').find(":selected").text();
	var stateCd = $('#stateCd').val();
	
	/* Set product indicator if needed */
	if(productIndicator == undefined){
		if(productDesc.toUpperCase().indexOf('TEACHERS') >= 0){
	        productIndicator = "Teachers";
		}else{
			productIndicator = "Prime";
		}
	}
	
	// clear out contract type field as user has changed producer or product
	if(stateCd == 'MA'){
		$('#policyContractTypeCd').val('');
	}
	
	 
	var strURL = addRequestParam("/aiui/client/isValidProduct", "agencyHierarchyId", agencyHierarchyId);
	strURL = addRequestParam(strURL, "channel", channel);
	strURL = addRequestParam(strURL, "stateCd", stateCd);
	strURL = addRequestParam(strURL, "companyCorpId", companyCorpId);
	strURL = addRequestParam(strURL, "product", product);
	strURL = addRequestParam(strURL, "productIndicator", productIndicator);
	
	
	// ajax call
	$.ajax({
		url: strURL,
		type:'get',
		dataType: 'string',
		cache: false, 
		
		beforeSend:function(status, xhr){
			showLoadingMsg();
		},
		
		complete: function(returnData){
			var returnData = returnData.responseText;
			var data = returnData.split(',');
			var uwCompanyCd = data[0];
			var validate = data[1];
			var web = data[2];
			var term = data[3];
			
			var badUwCompany = "<html>";

			var producerSelected = $('#policyProducerInput option:selected').val();
			if(uwCompanyCd == null && productIndicator == 'Teachers'){
				$('#uwCompanyCd').val('ALN_TEACH');
				$('#policyUwCompanyCd').val('ALN_TEACH');
			}else if(uwCompanyCd == "null" || uwCompanyCd.indexOf( badUwCompany ) != -1 ){
				validate = false;
			}else{
				$('#uwCompanyCd').val(uwCompanyCd);
				$('#policyUwCompanyCd').val(uwCompanyCd);
			}
			if(web != null){
				$('#policyCompanyCd').val(web);
				$('#companyCd').val(web);
			}
			
			if(term !=null && $('#policyStateCd').val()!='MA'){
				//$('#njPolicyTerm').val(term).trigger("chosen:updated");
				// The below condition carried from  handlePolicyTerm()
				//TD 55987 - Client Tab, Policy Term is defaulted to Semi-Annual 6 Month for MA CT and NH IA Policies
				if($('#policyStateCd').val()!='NJ' && $('#policyStateCd').val()!='PA'){
					$('#njPolicyTerm').val('12').trigger("chosen:updated");
				}else{
					//TD 58933 - Checkout Teachers reflect SemiAnnual - 6 Months for Policy Term
					//NJ should modify to whatever come from rules.
					//NJ Pru move setting of terms to seperate location
					// $('#njPolicyTerm').val(term).trigger("chosen:updated");
					//Pru-12 Month disable start
					
					
					if($('#policyStateCd').val() === 'PA'){
						$('#njPolicyTerm').val(term).trigger("chosen:updated");
					}
					
					//Pru-12 Month disable end 
					
				}
				calculatePolicyExpiryDate();
			}
	    	
		    if(validate == 'false' || !validate){
		    	initializeADRData('policyProducerInput',null);
		    }else{
		    	if(searchOption){
		    		if(producerSelected.length < 1){
		    			performProducersSearchPostSelection('searchProducers',this.id, companyCorpId);
		    		}
		    		performProducerPostSelection(producerSelected,'policyProducerInput');
		    	}
		    }

			$.unblockUI();
		}
	});
}

function expandCollapseRows(rowPrefix) {
	$("." + rowPrefix + "Row").each(function() {
		$(this).toggleClass("hidden");
	});

	//Toggling of Plus and Minus signs upon expand and collapse of Client Details section 
	if (($('#' + rowPrefix).attr('src')).indexOf('minus') >=0) {
		$('#' + rowPrefix).attr('src', '../aiui/resources/images/plus.gif');	
	} else {
		$('#' + rowPrefix).attr('src', '../aiui/resources/images/minus.gif');
	}
}

function expandEligibilityDropdown(rowPrefix) {
	if (rowPrefix === 'eligibilityYes') {
		//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
		//if ($('#eligibilityInd').val() === 'No') {
			$('#eligibilityInd').val('Yes');
			$('.eligibilityDropDown').removeClass("hidden");
			var instVal = $('#clientInstitutionNameId').val();
			if (instVal != undefined && instVal.length > 1) {
				$('.clsInstitution').show();
				$('#clientInstitutionId').val(instVal);
			}else{
				$('.clsInstitution').hide();
			}
			if($('#clientDistrictTownId').val()!=null && $('#clientDistrictTownId').val().length > 0){
				$('.clsDistrict').show();
			}else
			{
				if($('#clientDistrictTownId').val() != 'PRV' && $('#clientDistrictTownId').val() != 'ECE' && $('#clientDistrictTownId').val() != 'PSE'){
					$('.clsDistrict').hide();
				}
			}
			lookupEligibilityGroups();
		//}
	} else {
		//48870 - 2.1 focus testing - teachers - teachers eligibility wording is incorrectly defaulting
		//if ($('#eligibilityInd').val() === 'Yes') {
			$('#eligibilityInd').val('No');
			$('.eligibilityDropDown').addClass("hidden");
			$('#clientInstitutionId').val('');
			$('.clsInstitution').hide();
			$('#clientDistrictTownId').val('');
			$('.clsDistrict').hide();
		$('#eduInstitutionGroupId').val('');
			$('#clientEligibilityGroupId').val('').trigger('chosen:updated');
			$('#clientInstitutionNameId').val('').trigger('chosen:updated');
			$('#clientDistrictTownId').val('').trigger('chosen:updated');
		//}
	}
	showClearInLineErrorMsgsWithMap($('#clientEligibilityGroupId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addDeleteCallback);
}

function updateEligibilty() {
	var groupId = $('#clientEligibilityGroupId');
	$('#eduInstitutionGroupId').val(groupId.val());
	var districtId = $('#clientDistrictTownId');
	var institutionId = $('#clientInstitutionNameId');
	districtId.empty();
	districtId.append('<option value="">-- Select --</option>');
	districtId.prop('disabled',true);
	districtId.trigger('chosen:updated');
	institutionId.empty();
	institutionId.append('<option value="">-- Select --</option>');
	institutionId.prop('disabled',true);
	institutionId.trigger('chosen:updated');
	$('#clientInstitutionId').val('');
	$('.clsInstitution').hide();
	if (groupId.val().length > 0) {
		lookupEligibilityDistricts(groupId.val());
	}
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addDeleteCallback);
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), "",fieldIdToModelErrorRow['defaultSingle'],
            -1, errorMessages, addDeleteCallback);
}

function updateDistrict() {
	var groupId = $('#clientEligibilityGroupId');
	var districtId = $('#clientDistrictTownId');
	$('#eduInstitutionDistrict').val($('#clientDistrictTownId').val());
	var institutionId = $('#clientInstitutionNameId');
	institutionId.empty();
	institutionId.append('<option value="">-- Select --</option>');
	institutionId.prop('disabled',true);
	institutionId.trigger('chosen:updated');
	var errorMessageID = "";
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addDeleteCallback);
	$('.clsInstitution').hide();
	if (districtId.val().length > 0) {
		lookupEligibilityInstitutions(groupId.val(),districtId.val());
		$('.clsDistrict').show();
	}
}

function updateInstitution() {
	var instVal = $('#clientInstitutionNameId').val();
	if (instVal != undefined) {
		$('.clsInstitution').show();
		$('#clientInstitutionId').val(instVal);
	}
}

function lookupEligibilityGroups() {
	blockUser();
	var id = $('#clientEligibilityGroupId');
	var strErrorTag = 'eligibility.group.browser.inLine';
	var errorMessageID = 'InvalidEligibilityGroup';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/eligibility",
        type: "post",
        dataType: 'json',
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	id.prop('disabled',false);
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	for (var i = 0; i < response.length; i++) {
        		if($('#channelCd').val() == 'CAPTIVE' && response[i].GROUP_CD == 'PTA')	continue;
        		if($('#channelCd').val() == 'IA' && response[i].GROUP_CD == 'PTA')	continue;
        		id.append('<option value="' + response[i].GROUP_CD + '">' + response[i].GROUP_NAME + '</option>');
        	}
        	if($('#eduInstitutionGroupId').val().length > 0){
        		id.val($('#eduInstitutionGroupId').val());
        	}else{
        		addPreRequiredStyle($('#clientEligibilityGroupId'));
        	}
        	id.trigger('chosen:updated');
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        	validateReadOnly('clientEligibilityGroupId');

        }
    });
}

function lookupEligibilityDistricts(group) {
	blockUser();
	var id = $('#clientDistrictTownId');
	var districtName = $('#eduInstitutionDistrict').val();
	var strErrorTag = 'eligibility.district.browser.inLine';
	var errorMessageID = 'InvalidEligibilityDistrict';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/district/group/"+group,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	if ( response.length == 0 || response[0] === null) {
        		if($('#clientEligibilityGroupId').val() != 'PRV' && $('#clientEligibilityGroupId').val() != 'ECE' && $('#clientEligibilityGroupId').val() != 'PSE'){
        			$('.clsDistrict').hide();
        		}
        		var groupId = $('#clientEligibilityGroupId');
        		if($(groupId).val().length > 1){
        			lookupEligibilityInstitutions($(groupId).val(),'null');
        		}else
        		{
        			lookupEligibilityInstitutions($('#eduInstitutionGroupId').val(),'null');
        		}
        	}
        	else {
        		$('.clsDistrict').show();
        		var finalVal = '';
        		if (districtName.length>0) {
        			finalVal = districtName;
        			for (var i = 0; i < response.length; i++) {
        				var str = response[i];
        				id.append('<option value="' + str + '">' + str + '</option>');
        			}
        			if (response.length > 0) {
        				id.prop('disabled',false);
        			}
        			id.val(finalVal).prop('disabled',false).trigger('chosen:updated');
        			$('.clsInstitution').show();
        			lookupEligibilityInstitutions($('#eduInstitutionGroupId').val(),districtName);
        			validateTeachersEligiblityDistrict();
        		}else{
        			addPreRequiredStyle($('#clientDistrictTownId'));
        			for (var i = 0; i < response.length; i++) {
        				id.append('<option value="' + response[i] + '">' + response[i] + '</option>');
        			}
        			id.prop('disabled',false);
        			id.trigger('chosen:updated');
        		}      	
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        	validateReadOnly('clientDistrictTownId');
        }
    });
}


function lookupEligibilityInstitutions(group,district) {
	blockUser();
	var id = $('#clientInstitutionNameId');
	var institutionId = $('#clientInstitutionId').val();
	var strErrorTag = 'eligibility.institution.browser.inLine';
	var errorMessageID = 'InvalidEligibilityInstitution';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/institution/group/"+group+"/district/"+district,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        data : JSON.stringify({"district":district}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	if ( response.length > 0 ) {
        		if (response[0].INSTITUTION_NAME === undefined) {
        			id.empty();
        			id.append('<option value="' + response[0].INSTITUTION_ID + '">-- Select --</option>');
        			id.prop('disabled',true);
        			id.trigger('chosen:updated');
        		}
        		else {
        			var finalVal = '';
        			$('.clsInstitution').show();
        			if (institutionId) {
        				for (var i = 0; i < response.length; i++) {
        					if (institutionId == response[i].INSTITUTION_ID) {
        						finalVal = response[i].INSTITUTION_ID;
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					} else {
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					}
        				}
        				if (response.length > 0) {
        					$('#clientInstitutionNameId').prop('disabled',false);
        				}
        				$('#clientInstitutionNameId').val(finalVal).trigger('chosen:updated');
        				validateTeachersEligiblityInstitution();
        			}
        			else {
        				addPreRequiredStyle($('#clientInstitutionNameId'));
        				for (var i = 0; i < response.length; i++) {
        					$('.clsInstitution').show();
        					id.empty();
        					id.append('<option value="">-- Select --</option>');
        					for (var i = 0; i < response.length; i++) {
        						id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
        					}
        					id.prop('disabled',false);
        					id.trigger('chosen:updated');
        				}
        			}
        		}
        		$('#clientInstitutionNameId').prop('disabled',false).trigger('chosen:updated');
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	$('.clsInstitution').hide();
        	id.empty();
        	id.append('<option value="">-- Select --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){
        	$.unblockUI();
        	validateReadOnly('clientInstitutionNameId');
        }
    });
	//validateTeachersEligiblityGroup();
	
}

function validateReadOnly(id){
	if ( $('#readOnlyMode').val() == 'Yes' ) {
		$('#'+id).prop('disabled',true).trigger("chosen:updated");
	}	
}

function restoreEligibility(eligibilityFlag,institutionId)
{
	if (eligibilityFlag) {
		if (eligibilityFlag == 'Yes') {
			$('#eligibilityInd').val('Yes');
			$('.eligibilityDropDown').removeClass("hidden");
			if($('#clientEligibilityGroupId').val() != 'PRV' && $('#clientEligibilityGroupId').val() != 'ECE' && $('#clientEligibilityGroupId').val() != 'PSE' && $('#eduInstitutionGroupId').val().length < 1){
				$('.clsDistrict').hide();
				$('.clsInstitution').hide();
			}else {
				lookupEligibilityDistricts($('#eduInstitutionGroupId').val());
			}
			$('#eligibilityYes').prop('checked',true);
			$('#eligibilityNo').prop('checked',false);
			addRemovePreRequired('#clientEligibilityGroupId', 'true');
			addRemovePreRequired('#clientDistrictTownId', 'true');
			addRemovePreRequired('#clientInstitutionNameId', 'true');
		if (institutionId.length > 1) {
			$('.clsInstitution').show();
			$('#clientInstitutionId').val(institutionId).trigger('chosen:updated');
			//restoreEligibilityParameters(institutionId);
		}else{
			$('.clsInstitution').hide();
		}
	}
		else {
			$('#eligibilityInd').val('No');
			$('.eligibilityDropDown').addClass("hidden");
			$('#eligibilityYes').prop('checked',false);
			$('#eligibilityNo').prop('checked',true);
}
	}
}

function restoreEligibilityParameters(institutionId) {
	blockUser();
	var strErrorTag = 'eligibility.parameter.browser.inLine';
	var errorMessageID = 'InvalidEligibilityParameter';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/parameters/institutionId/"+institutionId,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"institutionId":institutionId}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	restoreEligibilityGroup(response.GROUP_CD);
        	restoreEligibilityDistrict(response.GROUP_CD, response.DISTRICT_NAME);
        	restoreEligibilityInstitution(response.GROUP_CD, response.DISTRICT_NAME, response.INSTITUTION_NAME);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function restoreEligibilityGroup(groupCode)
{
	if (groupCode) {
		$("#clientEligibilityGroupId option").each(function(i){
			if ($(this).val() == groupCode) {
				$(this).prop('selected', true);
				$('#clientEligibilityGroupId').trigger('chosen:updated');
			}
		});
	}
	validateTeachersEligiblityGroup();
}

function restoreEligibilityDistrict(group, districtName) 
{
	blockUser();
	var id = $('#clientDistrictTownId');
	var strErrorTag = 'eligibility.district.browser.inLine';
	var errorMessageID = 'InvalidEligibilityDistrict';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/teachelig/district/group/"+group,
        type: "post",
        dataType: 'json',
        data : JSON.stringify({"group":group}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
           	id.empty();
           	id.append('<option value="">-- Select --</option>');
           	var finalVal = '';
           	if (districtName) {
           		$('.clsDistrict').show();
           		finalVal = districtName;
           		for (var i = 0; i < response.length; i++) {
           			var str = response[i];
           			id.append('<option value="' + str + '">' + str + '</option>');
           		}
           		if (response.length > 0) {
           			id.prop('disabled',false);
           		}
           	}
           	id.val(finalVal).trigger('chosen:updated');
           	if ( $('#readOnlyMode').val() == 'Yes' ) { 
        		id.prop('disabled',true).trigger('chosen:updated');
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function restoreEligibilityInstitution(group,district,institutionId) {
	blockUser();
	if(group == 'RR'){
		$('#clientInstitutionNameId').hide();
		$('.clsInstitution').hide();
	}else {
		var id = $('#clientInstitutionNameId');
		var strErrorTag = 'eligibility.institution.browser.inLine';
		var errorMessageID = 'InvalidEligibilityInstitution';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		if(typeof district === 'undefined'){
			district = null;
		}
		$.ajax({
			headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			url: "/aiui/teachelig/institution/group/"+group+"/district/"+district,
			type: "post",
			dataType: 'json',
			data : JSON.stringify({"group":group}),
			data : JSON.stringify({"district":district}),
			timeout: 2500,
			// callback handler that will be called on success
			success: function(response, textStatus, jqXHR){
				id.empty();
				id.append('<option value="">-- Select --</option>');
				var finalVal = '';
				$('.clsInstitution').show();
				if (institutionId) {
					for (var i = 0; i < response.length; i++) {
						if (institutionId == response[i].INSTITUTION_NAME) {
							finalVal = response[i].INSTITUTION_ID;
							id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
						} else {
							id.append('<option value="' + response[i].INSTITUTION_ID + '">' + response[i].INSTITUTION_NAME + '</option>');
						}
					}
					if (response.length > 0) {
						id.prop('disabled',false);
					}
				}
				id.val(finalVal).trigger('chosen:updated');
				if ( $('#readOnlyMode').val() == 'Yes' ) { 
	        		id.prop('disabled',true).trigger('chosen:updated');
	        	}
			},
			// callback handler that will be called on error
			error: function(jqXHR, textStatus, errorThrown){
			},
			complete: function(){
				$.unblockUI();
			}
		});
	}
}

function validateTeachersEligiblityGroup(){
	var errorMessageID = '';
	if(($('#clientEligibilityGroupId').val() == '' && $('#eduInstitutionGroupId').val() == '') && $('#eligibilityInd').val() == 'Yes'){		
		$('#clsclientEligibilityGroupIdError_Row').removeClass("hidden");		
		errorMessageID="clientEligibilityGroupId.browser.inLine.required";		
	}else{		
		$('#clsclientEligibilityGroupIdError_Row').addClass("hidden");		
		errorMessageID="";
	}
	//$('#clientEligibilityGroupId').trigger("chosen:updated");
	showClearInLineErrorMsgsWithMap($('#clientEligibilityGroupId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addDeleteCallback);
}

function validateTeachersEligiblityDistrict(){
	var errorMessageID = '';
	if($('#clientDistrictTownId').val() == '' && $('#eligibilityInd').val() == 'Yes' && $('#clientDistrictTownId').not( ":hidden" ) && !$('#clientDistrictTownId').is(':disabled')){
		if($('#clientEligibilityGroupId').val() == 'PRV' || $('#clientEligibilityGroupId').val() == 'ECE' || $('#clientEligibilityGroupId').val() == 'PSE'){
		$('#clsclientDistrictTownIdError_Row').removeClass("hidden");		
		errorMessageID="clientDistrictTownId.browser.inLine.required";
		}
	}else{		
		$('#clsclientDistrictTownIdError_Row').addClass("hidden");		
		errorMessageID="";
	}
	//$('#clientDistrictTownId').trigger("chosen:updated");
	showClearInLineErrorMsgsWithMap($('#clientDistrictTownId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addDeleteCallback);
}

function validateTeachersEligiblityInstitution(){
	var errorMessageID = '';
	if(($('#clientInstitutionNameId').val() != undefined && $('#clientInstitutionId').val() != undefined && $('#clientInstitutionNameId').val().length < 1 && $('#clientInstitutionId').val().length < 1) 
			&& $('#eligibilityInd').val() == 'Yes' && $('#clientInstitutionNameId').not( ":hidden" )
			&& !($('#clientInstitutionNameId').val() == 'RR' && $('#clientInstitutionId').val() == 'RR')){	
		$('#clsclientInstitutionNameIdError_Row').removeClass("hidden");		
		errorMessageID="clientInstitutionNameId.browser.inLine.required";		
	}else{		
		$('#clsclientInstitutionNameIdError_Row').addClass("hidden");		
		errorMessageID="";
	}
	//$('#clientInstitutionNameId').trigger("chosen:updated");
	showClearInLineErrorMsgsWithMap($('#clientInstitutionNameId').attr('id'), errorMessageID,fieldIdToModelErrorRow['defaultSingle'],
			-1, errorMessages, addDeleteCallback);
}

function perferredBookRollSearch() {
	var lookupData = {};

	if($('#salesProgramOverrideInd').val() == 'Yes')
	{				
		var adrPriorCarrier = $('#priorCarrierName option:selected').text();  

		lookupData.agency_Heir_Id = $('#policyProducerInput').val();
		lookupData.co_Corp_Id = $('#policyProducerInput option:selected').data("support") + " ";
		lookupData.priorCarrier = adrPriorCarrier;
		lookupData.polEfftDate = $('#policyEffectiveDate').val();
		lookupData.stateCd = $('#stateCd').val();
		var jsonData = JSON.stringify(lookupData);


		blockUser();
		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			url: "/aiui/client/adrSalesProgram",
			type: "post",
			dataType: 'json',
			data : jsonData,
			timeout: 3000,
			// callback handler that will be called on success
			success: function(response, textStatus, jqXHR){
				if (response != null && response.name == 'Preferred Book Roll'){
					if(response.maxAdjustmentFactor == null && $('#stateCd').val() != 'MA' && $('#salesModal').val() != 'No'){
						$('#salesModal').val('No');
						$('#salesProgramModal').modal();
					}else{
						$("#maxAdjustmentFactor").val(response.maxAdjustmentFactor);
						$("#minAdjustmentFactor").val(response.minAdjustmentFactor);
						$("#upToleranceFactor").val(response.upToleranceFactor);
						$("#downToleranceFactor").val(response.downToleranceFactor);
						$("#exposureChangeIndicator").val(response.exposureChangeInd);
					}
				}else if($('#stateCd').val() != 'MA' && $('#salesModal').val() != 'No'){
					$('#salesModal').val('No');
					$('#salesProgramModal').modal();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
			},
			complete: function(){
				$.unblockUI();
			}
		});
	}
}


//RMV - Changes
//Primary - License State Validation
function validatePrimaryInsuredLicenseState(primary_insured_licenseState){
	if($(primary_insured_licenseState).val()=='MA'){
		validatePrimaryInsuredLicenseNumber($('#primary_insured_licenseNumber')[0]);
	}
	if(primary_insured_licenseState.value == ''){
		showClearInLineErrorMsgsWithMap(primary_insured_licenseState.id, "primary_insured_licenseState.browser.inLine.required", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return false;
	}
	else {
		
		if($(primary_insured_licenseState).val()!='MA'){
		    //TD 66601 (updates to driver license field validation)
			validatePrimaryInsuredNonMALicNum($('#primary_insured_licenseNumber')[0]);
		}
		
		$("#primary_insured_licenseState_chosen a").removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(primary_insured_licenseState.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	}
}

function validatePrimaryInsuredLicenseStateRmv(){
	primary_insured_licenseState = $("#primary_insured_licenseState")[0]; 
	if(primary_insured_licenseState.value == ''){
		showClearInLineErrorMsgsWithMap(primary_insured_licenseState.id, "primary_insured_licenseState.browser.inLine.rmvRequired", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return false;
	}
	else {
		$("#primary_insured_licenseState_chosen a").removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(primary_insured_licenseState.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	}
}

//Seconday - License State Validation
function validateSecondaryInsuredLicenseState(secondary_insured_licenseState){
	if($(secondary_insured_licenseState).val()=='MA'){
		validateSecondaryInsuredLicenseNumber($('#secondary_insured_licenseNumber')[0]);
	}
	if(secondary_insured_licenseState.value == ''){
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseState.id, "secondary_insured_licenseState.browser.inLine.required", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return false;
	}
	else {
		
		if($(secondary_insured_licenseState).val()!='MA'){
		    //TD 66601 (updates to driver license field validation)
			validateSecondaryInsuredNonMALicNum($('#secondary_insured_licenseNumber')[0]);
		}
		
		$("#secondary_insured_licenseState_chosen a").removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseState.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	}
}

function validateSecondaryInsuredLicenseStateRmv(){
	secondary_insured_licenseState = $("#secondary_insured_licenseState")[0]; 
	if(secondary_insured_licenseState.value == ''){
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseState.id, "secondary_insured_licenseState.browser.inLine.rmvRequired", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return false;
	} else {
		$("#secondary_insured_licenseState_chosen a").removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseState.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	}
}

//Primary - License Number Validation for Non MA states
//TD 66601 (updates to driver license field validation)
function validatePrimaryInsuredNonMALicNum(primary_insured_licenseNumber){
	var errroMsgID = '';
	var stateCd = $('#primary_insured_licenseState').val();
	if(primary_insured_licenseNumber.value != ""){
		var errroMsgID = 'primary_insured_licenseNumber.browser.inLine.InvalidFormat';
		if(stateCd !=''){
			var errorMsg = validateLicenseNumber(stateCd, primary_insured_licenseNumber.value);
			if(errorMsg==''){
				errroMsgID = '';
			}
		} else{
			errroMsgID = '';
		}
		 showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return errroMsgID;
	}else{
		$('#primary_insured_licenseNumber').removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	} 
}

//Primary - License Number Validation
function validatePrimaryInsuredLicenseNumber(primary_insured_licenseNumber,rmvClicked){
	var errroMsgID = '';
	var stateCd = $('#primary_insured_licenseState').val();
	if(primary_insured_licenseNumber.value == ""){
		//52567 - Client - Did not receive message when trying to do a RMV lookup by Name
		errroMsgID = "primary_insured_licenseNumber.browser.inLine."+((stateCd=='MA' && rmvClicked==true)?"requiredRMV":"required");
		showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
	} else {
		var errroMsgID = 'primary_insured_licenseNumber.browser.inLine.InvalidFormat';
		if(stateCd !=''){
			var errorMsg = validateLicenseNumber(stateCd, primary_insured_licenseNumber.value);
			if(errorMsg==''){
				errroMsgID = '';
			}
		} else{
			errroMsgID = '';
		}

		if (!isMaipPolicy()) {
		if(errroMsgID == ''){		
			//showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
			if($('#primary_insured_rmvLookupInd').val()=='X'){
				processErrorRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "primary_insured_licenseNumber", "No Hit" , null);
			} else if($('#primary_insured_rmvLookupInd').val()=='' || $('#primary_insured_rmvLookupInd').val()=='No'){
				processErrorRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "primary_insured_licenseNumber", "Lookup required" , null);
			} else if($('#primary_insured_rmvLookupInd').val()=='Yes'){
				processSuccessRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "primary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
			}
		} else {			
			showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
			$('#primary_insured_rmvLookupInd').val('No');
		}
		} else {
			showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		}

		//showClearInLineErrorMsgsWithMap(primary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return errroMsgID;
	}
}

function validatePrimaryInsuredLicenseNumberRmv(){
	var errroMsgID = validatePrimaryInsuredLicenseNumber($('#primary_insured_licenseNumber')[0],true);
	return errroMsgID=='';
}

//Secondary - License Number Validation
function validateSecondaryInsuredLicenseNumber(secondary_insured_licenseNumber,rmvClicked){
	var errroMsgID = '';
	var stateCd = $('#secondary_insured_licenseState').val();
	if(secondary_insured_licenseNumber.value == ""){
		//52567 - Client - Did not receive message when trying to do a RMV lookup by Name
		errroMsgID = "secondary_insured_licenseNumber.browser.inLine."+((stateCd=='MA' && rmvClicked==true)?"requiredRMV":"required");
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
	} else {
		var errroMsgID = 'secondary_insured_licenseNumber.browser.inLine.InvalidFormat';
		if(stateCd !=''){
			var errorMsg = validateLicenseNumber(stateCd, secondary_insured_licenseNumber.value);
			if(errorMsg==''){
				errroMsgID = '';
			}
		} else{
			errroMsgID = '';
		}
		
		if (!isMaipPolicy()) {
		if(errroMsgID == ''){			
			//showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
			if($('#secondary_insured_rmvLookupInd').val()=='X'){
				processErrorRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "secondary_insured_licenseNumber", "No Hit" , null);
			} else if($('#secondary_insured_rmvLookupInd').val()=='' || $('#secondary_insured_rmvLookupInd').val()=='No'){
				processErrorRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "secondary_insured_licenseNumber", "Lookup required" , null);
			} else if($('#secondary_insured_rmvLookupInd').val()=='Yes'){
				processSuccessRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "secondary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
			}			
		} else {			
			showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
			$('#secondary_insured_rmvLookupInd').val('No');
		}
		} else {
			showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		}
		
		return errroMsgID;
	}
}

//Secondary - License Number Validation for Non MA state
//TD 66601 (updates to driver license field validation)
function validateSecondaryInsuredNonMALicNum(secondary_insured_licenseNumber){
	var errroMsgID = '';
	var stateCd = $('#secondary_insured_licenseState').val();
	if(secondary_insured_licenseNumber.value != ""){
		var errroMsgID = 'secondary_insured_licenseNumber.browser.inLine.InvalidFormat';
		if(stateCd !=''){
			var errorMsg = validateLicenseNumber(stateCd, secondary_insured_licenseNumber.value);
			if(errorMsg==''){
				errroMsgID = '';
			}
		} else{
			errroMsgID = '';
		}
			showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, errroMsgID, fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return errroMsgID;
	}else{
		
		$('#secondary_insured_licenseNumber').removeClass('inlineError');
		showClearInLineErrorMsgsWithMap(secondary_insured_licenseNumber.id, "", fieldIdToModelErrorRow['applicants'],'app', errorMessages, null);
		return true;
	} 
}

function validateSecondaryInsuredLicenseNumberRmv(){
	var errroMsgID = validateSecondaryInsuredLicenseNumber($('#secondary_insured_licenseNumber')[0],true);
	return errroMsgID=='';
}

function validateRmvParameters(){
	
	var validPrimaryInsuredLicenseState = validatePrimaryInsuredLicenseStateRmv();
	var validPrimaryInsuredLicenseNumber = validatePrimaryInsuredLicenseNumberRmv();
	var validSecondaryInsuredLicenseState = true;
	var validSecondaryInsuredLicenseNumber = true;
	var validPolicyEffectiveDate = true;
	var validProducerId = true;
	
	if(!isEndorsement()){
		validPolicyEffectiveDate = validatePolicyEffectiveDate($("#policyEffectiveDate")[0]);
		validProducerId = $('#policyProducerInput').val()!="";
	}
	
	if($("#disableCoApplicantValidation").val() != "Yes"){
		var validSecondaryInsuredLicenseState = validateSecondaryInsuredLicenseStateRmv();
		//var validSecondaryInsuredLicenseNumber = validateSecondaryInsuredLicenseNumberRmv();
		//validate SNI lic num, only if lic state is MA...#52806
		secondary_insured_licenseState = $("#secondary_insured_licenseState")[0]; 
		if(secondary_insured_licenseState.value == 'MA'){
			var validSecondaryInsuredLicenseNumber = validateSecondaryInsuredLicenseNumberRmv();
		}
	}	
	if(!validProducerId){
		$('#policyProducerInput').trigger('blur');
	}
	
	if(validPolicyEffectiveDate && validProducerId
			&& validPrimaryInsuredLicenseState && validSecondaryInsuredLicenseState
			//52902 - RMV Look Up with 2 Named Insured not working when entering 1 with proper license and 2nd with wrong format, AI doesnt do the look up for the NI 1 who has proper license
			&& (validPrimaryInsuredLicenseNumber || validSecondaryInsuredLicenseNumber)){
		return true;
	}
	else{
		return false;
	}
	
}

function gatherRMVLookupData(driverSelector) {

	var data = {};
	data.lookupData = [];
	var driverIndex = 0;
	
	var firstTimeThru= $("#transactionProgress").val()==''?'true':'false';
	
	if(isEndorsement()){
		firstTimeThru = 'false';
	}
	
	$(driverSelector).each(function() {
		var insuredType = getInsuredType(this.id);
		var licenseState = $('#' + insuredType + '_insured_licenseState').val();
		var licenseNumber = $('#' + insuredType + '_insured_licenseNumber').val();
		var rmvLookupInd = $('#' + insuredType + '_insured_rmvLookupInd').val(); 
		var driverStatusCode =  $('#' + insuredType + '_insured_driverStatusCd').val(); 
		
		//#56001...look for driver status code also to make compatible with driver page
		if (isEndorsement()) {
		 var blnEligibleForRmvLookup = true; // for now make true for endorsement..
		} else {
			var blnEligibleForRmvLookup = isApplicantDriverEligibleForRmvLookUp(driverStatusCode);
		}
		
		
		if(insuredType=='primary' && !validatePrimaryInsuredLicenseNumberRmv()){
			return;
		}
		if(insuredType=='secondary' && !validateSecondaryInsuredLicenseNumberRmv()){
			return;
		}
		
		//51515 - RMV Look for NI 2 is invoking NI 1 look up also
		if(licenseNumber != "" 
				&& licenseState == "MA" 
				&& blnEligibleForRmvLookup == true 
				&& (rmvLookupInd != "Yes" || firstTimeThru == 'true')){
			var driver = {};
			
			driver.driverIndex = driverIndex++;
			driver.request = {};
			driver.request.company = $('#companyCd').val();
			driver.request.state = $('#stateCd').val();
			driver.request.lob = $('#lob').val();
			driver.request.channel = $('#channelCd').val();
			
			//For new quotes, there wont be a policy number generated yet. Pass 0 in such cases
			driver.request.policyNumber = $('div > #policyNumber').val()==""?"0":$('div > #policyNumber').val();
			driver.request.policyEffectiveDate = $('#policyEffDt').val();
			
			if (licenseNumber != null && licenseNumber.length > 0 && licenseState != null && licenseState.length > 0) {
				driver.request.licenseNumber = licenseNumber;
				driver.request.licenseState = licenseState;
			}		
			
			driver.request.licenseRequestFlag = true; // TODO 
			data.lookupData.push(driver);
		}

	});
	
	return data.lookupData;
}

function isMAIPFlag(){
	if (isMaipPolicy()) {
		return 'true';
	} else {
		return 'false';
	}
}

function performRMVLookup(driverSelector) {
	var lookupData = gatherRMVLookupData(driverSelector);
	var jsonData = JSON.stringify(lookupData);
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/client/rmvlookup?firstTimeThru="+($("#transactionProgress").val()==''?'true':'false')+"&maipFlag="+isMAIPFlag(),
        type: "post",
        data: jsonData,
        dataType: 'json',
        beforeSend:function(){
        	clearInLineRowError('primary_insured_licenseNumber', 'primary_insured_licenseNumber_Error_Col_app', fieldIdToModelRmvResultRow['rmvSuccess'], 'primary_insured_licenseNumber', 'app', null);
        	$('.rmvLincenseLookup').removeClass('inlineError');
			blockUser();
		},
        success: function(response, textStatus, jqXHR){
            processRMVLookupResults(response);
        },
        complete: function(){
			$.unblockUI();
			$(driverSelector).each(function() {				
				var insuredType = getInsuredType(this.id);
				var licenseState = $('#' + insuredType + '_insured_licenseState').val();
				var rmvLookupInd = $('#' + insuredType + '_insured_rmvLookupInd').val();
				var strElementID = insuredType + "_insured_licenseNumber";
				var strErrorColId = insuredType + "_insured_licenseNumber";
				var strRowName = strElementID + '_Error_Col_' + columnIndex;
				var columnIndex = "app";
				
				//TD 53501 start - Endts: Client tab - when a 2nd NI is added - clicking RMV Lookup button lookups up NI1 too
				//vmaddiwar - This logic is added to check which RMV lookups are actually required, only those need to updated with messages
				//existing already lookedup ones not required to have messages
				var successMsgReq = false;
				$(lookupData).each(function() {
					var currLicenseNumber = this.request.licenseNumber;
					if(currLicenseNumber == $('#' + strElementID).val()){
						successMsgReq = true;
					}
				});				
				if(!successMsgReq){
					return;
				}	
				//TD 53501 end
				if(licenseState != "" && licenseState != "MA" ){
					processSuccessRow(strElementID, fieldIdToModelRmvResultRow['rmvSuccess'], columnIndex, strElementID, '<span style="color:green">RMV Lookup not required</span>', null);
				} else if(rmvLookupInd=="Yes"){
					processSuccessRow(strElementID, fieldIdToModelRmvResultRow['rmvSuccess'], columnIndex, strElementID, '<span style="color:green">RMV Successful</span>', null);
				} else if(rmvLookupInd=="X"){
					processErrorRow(strElementID, fieldIdToModelRmvResultRow['rmvError'], columnIndex, strElementID, "No Hit" , null);
				} else{
					if(insuredType=='primary')
						validatePrimaryInsuredLicenseNumberRmv();
					if(insuredType=='secondary')
						validateSecondaryInsuredLicenseNumberRmv();
				}
			});
        }
    });
}

function getInsuredType(id){
	return id.substring(id.indexOf("_"), 0);
}

function processRMVLookupResults(response) {
	if(response != null && response.length > 0){
		$.each(response, function( index, rmvResponse ) {
			if( rmvResponse.lookupResults==null){
				return;
			}
			if( rmvResponse.lookupResults.licenseNumber.toUpperCase() == $.trim($("#primary_insured_licenseNumber").val().toUpperCase()) &&
				rmvResponse.lookupResults.licenseState.toUpperCase() == $.trim($("#primary_insured_licenseState").val().toUpperCase()) ){
				if(rmvResponse.lookupResults.requestResponse == ""){
					$('#primary_insured_rmvLookupInd').val('Yes')
					$("#primary_insured_firstName").val(rmvResponse.lookupResults.firstName).trigger('blur');
					$("#primary_insured_middleName").val(rmvResponse.lookupResults.middleName).trigger('blur');
					$("#primary_insured_lastName").val(rmvResponse.lookupResults.lastName).trigger('blur');
					$("#primary_insured_licenseState").val(rmvResponse.lookupResults.licenseState).trigger('blur');
					$("#primary_insured_genderCd").val(rmvResponse.lookupResults.gender).trigger('blur');
					//var licStatus = getRmvLicStatusCd(rmvResponse.lookupResults.licenseStatus);
					//#52128(CC)..License status
					var licStatus = rmvResponse.lookupResults.licenseStatus;
					$("#primary_insured_licenseStatusCd").val(licStatus);
					$("#primary_insured_driverStatusCd").val(getRmvDriverStatusCd(licStatus));
					//02/09/2015 License number should not be protected untill page save.
					//$("#primary_insured_licenseNumber").prop('disabled',true);
					
					//Added 01/28/2015 to flood DOB and RMV_LOOKUP_IND from RMV response
					$("#primary_insured_rmvLookupInd").val(rmvResponse.lookupResults.rmvLookupInd);
					
					//02/09/2015 DOB should be protected immediately after RMV lookup
					//51463
					showClearInLineErrorMsgsWithMap('primary_insured_birth_date', '', fieldIdToModelErrorRow['defaultSingle'],'app', errorMessages, addDeleteCallback);
					
					var dob = rmvResponse.lookupResults.dob;
					var dobArr = dob.split("/");
					var formattedDob = '**/**/'+dobArr[2];
					
					// $("#primary_insured_birth_date").inputmask("**/**/yyyy");
					// $("#primary_insured_birth_date").val(formattedDob).trigger('blur');
					
					$('#beforeRmvCall').hide();
					$('#afterRmvCall').show();
					$('#primary_insured_birth_date_postRmvCall').val(formattedDob);
					
					//#53659.. just assing masked format as in page error below field is loaded and visible.
					$('#primary_insured_birth_date').val(formattedDob);
					$("#primary_insured_birth_date").prop('disabled',true);					
					
					$("#primary_insured_birth_date_postRmvCall").removeClass('preRequired');
					$("#primary_insured_birth_date_postRmvCall").prop('disabled',true);
					$("#primary_insured_birth_date").datepicker().datepicker('disable');
					$("#primary_insured_birth_date_orig").val(rmvResponse.lookupResults.dob);
					
					$("#addrLine1Txt").val(rmvResponse.lookupResults.insuredAddressLine1).trigger('blur');
					$("#addrLine2Txt").val(rmvResponse.lookupResults.insuredAddressLine2).trigger('blur');
					
					var zipValue = rmvResponse.lookupResults.insuredAddressZip;
					
					
					
					if(zipValue!=null && zipValue.length>5){
						$("#zip").val(zipValue.substring(0,5)).removeClass('preRequired');//'.trigger('blur');
						$("#zip_plus_four").val(zipValue.substring(5,9));
					} else{
						$("#zip").val(zipValue).removeClass('preRequired');//'.trigger('blur');
					}
					
					
					var cities = rmvResponse.lookupResults.cityAssociatedWithRmvZip.cityAssociatedWithZip;
					if(cities !=null && cities.length >0){
						populateSelect(rmvResponse.lookupResults.cityAssociatedWithRmvZip,'resi');
					}
										
					/*
					$("#cityName").append($("<option></option>")
					          .attr("value", rmvResponse.lookupResults.insuredAddressCity)
					          .text(rmvResponse.lookupResults.insuredAddressCity).attr('selected','selected')).prop('disabled',true).trigger('chosen:styleUpdated').trigger('chosen:updated');
					
					$("#addressCity").val(rmvResponse.lookupResults.insuredAddressCity);
					*/
					
					//Mapping state is not required as it will always be the policy state
					//$("#addressState").val(rmvResponse.lookupResults.insuredAddressState);
					$('#rmvLookUp_Error').remove();
					
					$("#primary_insured_sdip").val(rmvResponse.lookupResults.sdip);					
					$("#primary_insured_rmvLookupDate").val(rmvResponse.lookupResults.rmvLookupDate);
					$("#primary_insured_firstLicUsaDt").val(rmvResponse.lookupResults.firstLicenseDate);
					$("#primary_insured_firstLicMADt").val(rmvResponse.lookupResults.maFirstLicenseDate);
					$("#primary_insured_priorLicenseNumber").val(rmvResponse.lookupResults.priorLicenseNumber);	
					$("#primary_insured_priorLicenseState").val(rmvResponse.lookupResults.priorLicenseState);
					$("#primary_insured_drvrTrainingInd").val(rmvResponse.lookupResults.drvrTrainingInd);
					$("#priorCarrierUnpaidPremiumAmount").val(rmvResponse.lookupResults.UnpaidPremium);
					$("#primary_insured_licOutOfStatePrior3YrsInd").val(rmvResponse.lookupResults.licenseOutofState);
					$("#priorCarrierName").val(rmvResponse.lookupResults.PerCurrentInsCompanyCode).trigger('blur');		
					$("#priorCarrierName").trigger("chosen:updated");
					//#55774.. set the indicator only if PerCurrentInsCompanyCode is not empty
					if (trimSpaces(rmvResponse.lookupResults.PerCurrentInsCompanyCode) != "") {
						$("#priorCarrierActiveCurrentPolicyInd").val("Yes");
					}
					$("#prePriorCarrierName").val(rmvResponse.lookupResults.PerCurrentInsCompanyCode);
					$("#priorCarrierAgentEnteredPriorCarrCd").val(rmvResponse.lookupResults.PerCurrentInsCompanyCode);	
					//#55774.. set the indicator only if PerCurrentInsCompanyCode is not empty
					if (trimSpaces(rmvResponse.lookupResults.PerCurrentInsCompanyCode) != "") {
						$("#priorCarrierAgentEnteredActiveCurrPolInd").val("Yes");
					}
				
					
					//#52129.(motorcycleLicTypeDesc should not be mapped from rmv)
					//$("#primary_insured_motorcycleLicTypeDesc").val(rmvResponse.lookupResults.motorcycleLicTypeDesc);
					
					processSuccessRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "primary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
					showClearInLineErrorMsgsWithMap('primary_insured_licenseNumber', '', fieldIdToModelErrorRow['applicants'],'app', errorMessages, addDeleteCallback);
					showClearInLineErrorMsgsWithMap('addrLine1Txt', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
					showClearInLineErrorMsgsWithMap('zip', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
					//52099 - Red rimmed edit stays on Town when its already populated
					showClearInLineErrorMsgsWithMap('cityName', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
					enableRMVButton(false);
				}
				else{
					//$("#primary_insured_rmvLookupInd").val('');
					var msg = getRMVUnsuccessfulMessage(rmvResponse.lookupResults.requestResponse);
					if ('No Hit' == msg) {
						$("#primary_insured_rmvLookupInd").val('X');	
						//TD 53502 start - ENDTS:  Client tab - relookup on NI2 does not refresh info when there is a NO HIT
						$("#primary_insured_firstName").val('');
						$("#primary_insured_middleName").val('');
						$("#primary_insured_lastName").val('');
						$("#primary_insured_genderCd").val('');
						$("#primary_insured_licenseStatusCd").val('');
						$("#primary_insured_driverStatusCd").val('');						
						$("#primary_insured_birth_date").prop('disabled',false);
						$("#primary_insured_birth_date_postRmvCall").prop('disabled',false);
						$("#primary_insured_birth_date").datepicker().datepicker('enable');
						$('#primary_insured_birth_date_postRmvCall').val('');	
						$("#primary_insured_birth_date").val('');
						$("#addrLine1Txt").val('');
						$("#addrLine2Txt").val('');
						$("#zip").val('');
						$("#zip_plus_four").val('');
						$("#cityName").val('');
						$("#addressCity").val('');
						$("#primary_insured_sdip").val('');					
						$("#primary_insured_rmvLookupDate").val('');
						$("#primary_insured_firstLicUsaDt").val('');
						$("#primary_insured_firstLicMADt").val('');
						$("#primary_insured_priorLicenseNumber").val('');	
						$("#primary_insured_priorLicenseState").val('');
						$("#primary_insured_drvrTrainingInd").val('');
						$("#priorCarrierUnpaidPremiumAmount").val('');
						$("#primary_insured_licOutOfStatePrior3YrsInd").val('');
						//TD 53502 end
						
					} else {
						$("#primary_insured_rmvLookupInd").val('');
					}					
					processErrorRow("primary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "primary_insured_licenseNumber", msg , null);
					enableRMVButton(true);
				}
			}
			else if( rmvResponse.lookupResults.licenseNumber.toUpperCase() == $.trim($("#secondary_insured_licenseNumber").val().toUpperCase()) &&
					 rmvResponse.lookupResults.licenseState.toUpperCase() == $.trim($("#secondary_insured_licenseState").val().toUpperCase())){
				if(rmvResponse.lookupResults.requestResponse == ""){
					var secondaryInsuredOriginalRMVStatus = $('#secondary_insured_rmvLookupInd_original').val();
					$('#secondary_insured_rmvLookupInd').val('Yes');
					$('#secondary_insured_rmvLookupInd_original').val('Yes');
					$("#secondary_insured_firstName").val(rmvResponse.lookupResults.firstName).trigger('blur');
					$("#secondary_insured_middeName").val(rmvResponse.lookupResults.middleName).trigger('blur');
					$("#secondary_insured_lastName").val(rmvResponse.lookupResults.lastName).trigger('blur');
					$("#secondary_insured_licenseState").val(rmvResponse.lookupResults.licenseState).trigger('blur');
					$("#secondary_insured_genderCd").val(rmvResponse.lookupResults.gender).trigger('blur');
					//var licStatus = getRmvLicStatusCd(rmvResponse.lookupResults.licenseStatus);	
					//#52128(CC)..License status
					var licStatus = rmvResponse.lookupResults.licenseStatus;
					$("#secondary_insured_licenseStatusCd").val(licStatus);
					$("#secondary_insured_driverStatusCd").val(getRmvDriverStatusCd(licStatus));
					//02/09/2015 License number should not be protected untill page save.
					//$("#secondary_insured_licenseNumber").prop('disabled',true);
					
					//Added 01/28/2015 to flood DOB and RMV_LOOKUP_IND from RMV response
					$("#secondary_insured_rmvLookupInd").val(rmvResponse.lookupResults.rmvLookupInd);
					
					//02/09/2015 DOB should be protected immediately after RMV lookup
					var dob = rmvResponse.lookupResults.dob;
					var dobArr = dob.split("/");
					var formattedDob = '**/**/'+dobArr[2];
					
					// $("#primary_insured_birth_date").inputmask("**/**/yyyy");
					// $("#primary_insured_birth_date").val(formattedDob).trigger('blur');
					
					//52692 - CLIENT: after RMV Lookup, required entry inline edit is not cleared on Co-App for DOB field
					showClearInLineErrorMsgsWithMap('secondary_insured_birth_date', '', fieldIdToModelErrorRow['defaultSingle'],'app', errorMessages, addDeleteCallback);
					
					//Already secondary existing with successful
					if(secondaryInsuredOriginalRMVStatus == 'Yes'){
						$('#secondary_insured_birth_date').val(formattedDob);
						$('#secondary_insured_birth_date_postRmvCall').val(formattedDob);
						//if SNI already existed & we are re-looking or changing the SNI for ENDR to delete and re add the driver
						// we need the opertaion to be set to 'ADD'
						if(isEndorsement()){
							$("#secondary_insured_operation").val("ADD");
						}
					}else{
						$('#beforeRmvCallSec').hide();
						$('#afterRmvCallSec').show();
						$('#secondary_insured_birth_date_postRmvCall').val(formattedDob);
					}
					//$("#secondary_insured_birth_date").val(rmvResponse.lookupResults.dob).trigger('blur');
					$("#secondary_insured_birth_date").prop('disabled',true);
					$("#secondary_insured_birth_date_postRmvCall").removeClass('preRequired');
					$("#secondary_insured_birth_date_postRmvCall").prop('disabled',true);
					$("#secondary_insured_birth_date").datepicker().datepicker('disable');
					$("#secondary_insured_birth_date_orig").val(rmvResponse.lookupResults.dob);
					
					// sdip, date fields
					$("#secondary_insured_sdip").val(rmvResponse.lookupResults.sdip);
					$("#secondary_insured_firstLicUsaDt").val(rmvResponse.lookupResults.firstLicenseDate);
					$("#secondary_insured_firstLicMADt").val(rmvResponse.lookupResults.maFirstLicenseDate);
					$("#secondary_insured_rmvLookupDate").val(rmvResponse.lookupResults.rmvLookupDate);
					$("#secondary_insured_priorLicenseNumber").val(rmvResponse.lookupResults.priorLicenseNumber);	
					$("#secondary_insured_priorLicenseState").val(rmvResponse.lookupResults.priorLicenseState);	
					$("#secondary_insured_drvrTrainingInd").val(rmvResponse.lookupResults.drvrTrainingInd);
					$("#secondary_insured_licOutOfStatePrior3YrsInd").val(rmvResponse.lookupResults.licenseOutofState);
					//#52129.(motorcycleLicTypeDesc should not be mapped from rmv)
					//$("#secondary_insured_motorcycleLicTypeDesc").val(rmvResponse.lookupResults.motorcycleLicTypeDesc);
					
					$('#rmvLookUp_Error').remove();
					processSuccessRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvSuccess'], "app", "secondary_insured_licenseNumber", '<span style="color:green">RMV Successful</span>', null);
					clearSNILicenseNumberError();
				}
				else{
					//$("#secondary_insured_rmvLookupInd").val('');
					var msg = getRMVUnsuccessfulMessage(rmvResponse.lookupResults.requestResponse);
					if ('No Hit' == msg) {
						$("#secondary_insured_rmvLookupInd").val('X');	
						//TD 53502 start - ENDTS:  Client tab - relookup on NI2 does not refresh info when there is a NO HIT
						$("#secondary_insured_firstName").val('');
						$("#secondary_insured_middleName").val('');
						$("#secondary_insured_lastName").val('');
						$("#secondary_insured_genderCd").val('');
						$("#secondary_insured_licenseStatusCd").val('');
						$("#secondary_insured_driverStatusCd").val('');
						$("#secondary_insured_birth_date").prop('disabled',false);
						$("#secondary_insured_birth_date_postRmvCall").prop('disabled',false);
						$("#secondary_insured_birth_date").datepicker().datepicker('enable');
						$('#secondary_insured_birth_date_postRmvCall').val('');						
						$("#secondary_insured_birth_date").val('');					
						$("#secondary_insured_sdip").val('');					
						$("#secondary_insured_rmvLookupDate").val('');
						$("#secondary_insured_firstLicUsaDt").val('');
						$("#secondary_insured_firstLicMADt").val('');
						$("#secondary_insured_priorLicenseNumber").val('');	
						$("#secondary_insured_priorLicenseState").val('');
						$("#secondary_insured_drvrTrainingInd").val('');
						$("#secondary_insured_licOutOfStatePrior3YrsInd").val('');
						//TD 53502 end
					} else {
						$("#secondary_insured_rmvLookupInd").val('');
					}
					processErrorRow("secondary_insured_licenseNumber", fieldIdToModelRmvResultRow['rmvError'], "app", "secondary_insured_licenseNumber", msg , null);
				}
				//55376-RMV button is enabled on client if there are 2NI's and the 2nd NI has MA license 
				enableRMVButton(true);
			}
		});
	}
	showRMVFailedModalIfApplicable(response);
}

function getRMVUnsuccessfulMessage(msg){
	if(msg == "" || msg == null){
		return "";
	}
	var msgTC = toTitleCase(msg);
	if(msgTC=='License Number Not Found'){
		return "No Hit";
	}
	//TD 52721 - RMV lookup on client is failing with strange error message
	//Got message from vendor --> 1NO QUEUE FROM RMV AFTER 45 SECONDS, so having user readable message
	else if(msgTC.indexOf("Seconds") >= 0){
		return "Unsuccessful-Vendor down";
	}else
		return msg;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function setBranches(state,callback){
	showLoadingMsg();
	//console.log(callback);
	var sValue;
	var strURL = addRequestParam("/aiui/client/getBranches", "policyStateCd", state);
	var branchRespObj;
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: strURL,
        type: "GET",
        //dataType: "JSON",
        //timeout: 3000,
        //data:jsonData,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	var branchElem = $('#branch_hier_id');
        	var branchHierId = $('input#branch_hier_id').val();
        	emptySelect(branchElem);
        	if(response.length > 0){
        		var matchedChannelCode = '';
				$.each(response, function(i) {
					branchRespObj = response[i];
					if(branchHierId == $.trim(branchRespObj.branchId)){
						matchedChannelCode = $.trim(branchRespObj.channelCode);
					}
					branchElem.append('<option value="' + $.trim(branchRespObj.branchId)+'" data-support="'+ $.trim(branchRespObj.channelCode) + '" data-corp="'+$.trim(branchRespObj.companyCorporationId)+'">' + $.trim(branchRespObj.name) + '</option>');
					//alert(branchRespObj.name);
				});
        	}
        	branchElem.trigger("chosen:updated");
        	if(callback == 'undefined' || callback == undefined || callback == null){
        		$.unblockUI();
        	}else{
        		//TD #71938 -> calling getAgenices() method when state is chnaged in dd and Branch dd is hidden 
        		callback(matchedChannelCode);
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	     // alert('error accessing security database');
          }
        ,
        complete: function(){
        	//$.unblockUI();
        }
    });
}

function setProducts(state){
	
	var sValue;
	var strURL = addRequestParam("/aiui/client/getProducts", "policyStateCd", state);
	var productObj;
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: strURL,
        type: "GET",
        //dataType: "JSON",
        //timeout: 3000,
        //data:jsonData,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	var productCdElem = $('#policyProductCd');
        	emptySelect(productCdElem);
        	if(response.length > 0){
				$.each(response, function(i) {
					productObj = response[i];
					productCdElem.append('<option value="' + $.trim(productObj.productCode)+'">' + $.trim(productObj.productDescription) + '</option>');
					//alert(branchRespObj.name);
				});
        	}
        	productCdElem.trigger("chosen:updated");
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	     // alert('error accessing security database');
          }
        ,
        complete: function(){
        //	$.unblockUI();
        }
    });
}

function isRiskStateMA(){
	// Included $('#policyLevelStateCd').val()=='MA'(For endorsement).. middle condition should be removed as two ids exist??
	//return ($('#policyStateCd').val()=='MA' || $('#stateCd').val()=='MA');
	return ($('#policyStateCd').val()=='MA' || $('#stateCd').val()=='MA' || $('#policyLevelStateCd').val()=='MA');
}

function validateLicenseNumber(stateCd, value) {
	var strLicNum = trimSpaces(value);
	var strLicstate = trimSpaces(stateCd);
	var strFormat1 = '';
	var strFormat2 = '';
	var strMsg = '';
	
	    //TD 66601 (updates to driver license field validation)
	 	if(!!strLicstate && !!strLicNum){
	 		
	 		var validationMsg = invokeDLValidation(stateCd, value);
	 		if (validationMsg == 'false') {
				strMsg = "notValidLicNumber";		
			}
	 	}
		
	return strMsg;
}

function invokeDLValidation(stateCd, value){
	var strLicNum = trimSpaces(value);
	var strLicstate = trimSpaces(stateCd);
	
	var strURL = addRequestParam("/aiui/client/isValidLicenseNumber", "stateCd", strLicstate);
	strURL = addRequestParam(strURL, "licenseNumber", strLicNum);
	var responseString;
	
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: strURL,
        type: "GET",
        dataType : 'text',
        async:false,
        
        success: function(response, textStatus, jqXHR){
        	responseString = response;
        },
        error: function(jqXHR, textStatus, errorThrown){
        	responseString =  "error";
          }
       
    });
	
	return responseString;
}

function getPolicyState() { 
	var strPolicyState = $("#stateCd").val();
	return strPolicyState;
	
}

function isMaComparator(){
	if($('#stateCd').val() == 'MA' && $("#ratedSource").val()!=null && $("#ratedSource").val().toLowerCase() == "comprater"){
		return true;
	}
	return false;
}

//Pru-12 Month disable start 

function validateExpirationDate(){
	var effectiveDate = getPolEffDate($('#policyEffectiveDate').val());
	if(effectiveDate !=null && effectiveDate.length == 10 && hasValidParamsSecurityDate()){
		calculatePolicyExpiryDate();
	}
	else{
		$("#policyExpirationDate").val("");
			$("#expDt").text("");
		}
}

//Pru-12 Month disable end 
