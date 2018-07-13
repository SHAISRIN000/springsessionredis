
//REFER : coverageTab-enhanced.js

/*jQuery(document).ready(function() {

	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	//scrolling function routine
	updateCoverageScrollPanel("#scrollPanel");
	$("#startScrollBtn")
		.click(function(event){ slideCoverageStart(event); });
	$("#leftScrollBtn")
		.click( function(event){ slideCoverageLeft(event); })
		.hover(
			function(event){
				this.iid = setInterval(function() { slideCoverageLeft(event);}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#rightScrollBtn")
		.click( function(event){ slideCoverageRight(event); })
		.hover(
			function(event){
				this.iid = setInterval(function() { slideCoverageRight(event);}, 525); },
			function(event){ if (this.iid != null) { clearInterval(this.iid); }});
	$("#endScrollBtn")
		.click(function(event){ slideCoverageEnd(event); });
	//scrolling function end


	if($('#stateCd').val() != 'MA'){
		$('.clearPremium').change(function(){
			clearPremium();
	});
	}

	$('form').bind(getSubmitEvent(), function(event, result){
		handleSubmit();
	});

	if($('#policyPremiumAmt').val()=='' || $('#policyPremiumAmt').val()=='0'){
		clearPremium();
	}
	
   setPackageIncluded();
	
   bindTabOutEdits();
   
   //set vehicle seq nums and coverage seq nums
   setSeqNums();
   // default
   updateNewVehCovItem('#ESS_PAK_limit_0', true);

   //Hide not applicable coverages for non-PPA type vehicles.
   hideCoveragesWhereNotApplicable();

   hideShowRows();

   bindCoverageColumns();

   // set multi-field model error row value
   fieldIdToModelErrorRow['defaultMulti'] =  $('#defaultMulti').outerHTML();

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

   // Set up column-based tabbing
   var vehCount = parseInt($('#coverageCount').val());
   
//commenting this out it takes more time for script to load--tabbing needs to revisit 12/16/2013
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

updateAllCoverageHeaderInfo();
   
// Align the row heights in the row header table and the main content table
alignRows();

//should be a last call for readonly quote
disableOrEnableElementsForReadonlyQuote();

setUpEndorsementDefaultOptionalsToNoCoverage();

});

function setPackageIncluded(){
	
	if($('#motorClubInd').val() == 'Yes' || $('#sourceOfBusinessCode').val() == 'EXIST_SPIN'){
		$('select[id^="DEF_PAK_Disabled_"]').each(function(){
			$(this).val('ASSURE_PAK').trigger(changeSelectBoxIt);
		});
	}
	else{
		$('select[id^="DEF_PAK_Disabled_"]').each(function(){
			$(this).val('ESS_PAK').trigger(changeSelectBoxIt);
		});
	}
	
	//$('#DEF_PAK_limit').val($('#DEF_PAK_Disabled_0').val());
	//$('#DEF_PAK_coverageCd').val($('#DEF_PAK_Disabled_0').val());

}

var SCROLL_PANEL = '#scrollPanel';

window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
	//Set focus to first data capture field
	//document.getElementById('BI_0').focus();
	//BI_0.focus();
	setCoverageId();
	//if not MA
	if($('#stateCd').val() != 'MA'){
		updateNewVehCov();
	}
	$('#PS_limit').attr('disabled', 'disabled');
}

function bindTabOutEdits(){
	
	$('select[id^="BI_"]').change(function(event, result){ 
		validateRequiredField(this);
		floodBI(this);
		validateUMUIMBI(this);
		checkPDLimitForBISelected(this);
		alignRows();
	});

	$('select[id^="UMUIMBI_"]').change(function(event, result){
		//validateRequiredField(this);
		floodBI(this);
		validateUMUIMBI(this);
		alignRows();
	});

	$('select[id^="PD_"]').change(function(event, result){
		validateRequiredField(this);
		floodBI(this);
		validateUMUIMPD(this);
		checkPDLimitForBISelected(this);
		alignRows();
	});

	$('select[id^="UMPD_"]').change(function(event, result){
		//validateRequiredField(this);
		floodBI(this);
		validateUMUIMPD(this);
		alignRows();
	});

	$('select[id^=PRINC_PIP_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		HideShowHealthCareProvider();
		checkExtraPipForPipValue(this);
		alignRows();
	});

	$('select[id^=EXTRA_PIP_LIMIT_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		extraPIPSelected();
		checkExtraPipForPipValue(this);
		alignRows();
	});

	$('select[id^=PIP_Limit_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select[id^=PIP_Deductible_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});


	$('select[id^=ExtraPIPApplies_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select[id^=EMP_]').change(function(){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select[id^="TORT_"]').change(function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
		alignRows();
	});

	//start optional coverages
	$('select[id^="COMP_"]').change(function(event, result){
		
		var str_sel_id = $(this).attr('id');
		var isComp = true;
		if(str_sel_id.indexOf('COMP_ONLY')>=0 || str_sel_id.indexOf('COMP_GLASS')>=0 ){
			isComp = false;
		}
		if(isComp){
			validateRequiredField(this);
			validateCOMPField(this);
			showHideCompGlass();
			loanLease(this);
			newCar(this);
			alignRows();
		}

	});

	$('select[id^="COMP_GLASS_"]').change(function(event, result){
		validateRequiredField(this);
		alignRows();
	});
	
	$('select[id^="COMP_ONLY_"]').change(function(event, result){
		if(isEndorsement()){
			validateCOMPONLY(this);
			validateCOMPField(this);	
		}
	});

	$('select[id^="COLL_"]').change(function(event, result){
		validateRequiredField(this);
		validateCOLLField(this);
		validateCOMPField(this);
		waiveDeductibleThisCol(this);
		loanLease(this);
		newCar(this);
		alignRows();
	});

	$('select[id^="WaiverofDeductible_"]').change(function(event, result){
		validateRequiredField(this);
		//waiveDeductibleSetCOLLimit(this);
		 alignRows();
	 });

	$('select[id^="TL_LIMIT_"]').change(function(event, result){
		validateRequiredField(this);
		validateCOMPField(this);
		//floodLiab(this);
		alignRows();
	});

	$('select[id^="RR_"]').change(function(event, result){
		validateRequiredField(this);
		validateCOMPField(this);
		alignRows();
	});


	$('select[id^="NCR_ALA_Select_"]').change(function(event, result){
		//floodPolicyCoverages(this,false);
		setNewCar(this);
		alignRows();
	});


	$('select[id^="LOAN_ALA_Select_"]').change(function(event, result){
		//floodPolicyCoverages(this,false);
		setLoanLease(this);
		alignRows();
	});

	$('select[id^="ACC_FORG_DISPLAY_"]').change(function(event, result){
		$('#ACC_FORG_limit').val(this.value);
		alignRows();
	});

	$('select[id^="UPGR_PAK_"]').change(function(event, result){
		//showOrHideTLUnavailable(this.id)
		floodPolicyCoverages(this,false);
		showHideTLIncluded(this.id);
		showHideNewCarIncluded(this.id);
		showHideLoanLeaseIncluded(this.id);
		alignRows();
	});

	$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]').change(function(event, result){
		$('#HC_PROVIDER_NAME_limit').val(this.value);
		floodLiab(this);
		validateRequiredField(this);
		alignRows();
	});

	$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]').change(function(event, result){
		$('#HC_PROVIDER_NUMBER_limit').val(this.value);
		floodLiab(this);
		validateRequiredField(this);
		alignRows();
	});

}

//For comp only and all required coverages, peform the operation
//function validateRequiredFields(){
//	$('.reqdCov,.compOnly').change(function(event, result){
//		alert('change comp only');
//		validateRequiredField(this);
//	});
//
//	$('select[id^="COMP_ONLY_"]').change(function(event, result){
//			validateCOMPONLY(this);
//	});
//
//}


function setUpEndorsementDefaultOptionalsToNoCoverage()
{
	if(isEndorsement()){
		$('select[id^="COMP_"]').each(function() {
		var str_sel_id = $(this).attr('id');
		var isComp = true;
		if(str_sel_id.indexOf('COMP_ONLY')>=0 
				|| str_sel_id.indexOf('COMP_GLASS')>=0 ){
				isComp = false;
			}
		if(isComp && (this.value == null || this.value == '')){
			$(this).val("No Coverage").trigger(changeSelectBoxIt);
		}
		});
		
		$('select[id^="COLL_"]').each(function() {
			if($(this).prop('disabled')==false && (this.value == null || this.value == '')){
				$(this).val("No Coverage").trigger(changeSelectBoxIt);
			}});
		

		$('select[id^="TL_"]').each(function() {
			if($(this).prop('disabled')==false && (this.value == null || this.value == '')){
				$(this).val("No Coverage").trigger(changeSelectBoxIt);
			}});
		
		$('select[id^="RR_"]').each(function() {
			if($(this).prop('disabled')==false && (this.value == null || this.value == '')){
				$(this).val("No Coverage").trigger(changeSelectBoxIt);
			}});
		}
}

 *
 * preddy
 * 
function validateCOMPONLY(fieldCompOnly){
	var strMsg = '';
    var strIndex = parseOffIndex(fieldCompOnly.id);
    
    var compOnlyElements = ["clsBILimit","clsPDLimit","clsUMPDLimit","clsUMUIMLimit","clsPRINC_PIPLimit",
            "clsPIP_Limit","clsPIP_Deductible","clsEXTRA_PIP_Limit","clsExtraPIPApplies","clsEMP","clsTORT","clsColl",
            "clsWaiverofDeductible","clsTL","clsRR","clsNcr","clsLoan"];
    
    var compOnlyElements = ["BI","PD","UMPD","UMUIMBI","PRINC_PIP",
                            "PIP_Limit","PIP_Deductible","EXTRA_PIP_LIMIT","ExtraPIPApplies","EMP","TORT","COLL",
                            "WaiverofDeductible","TL_LIMIT","RR","NCR_ALA","LOAN_ALA"];
                    
    if(fieldCompOnly.value == 'Yes'){
    	$('#suspendIndCd_'+strIndex).val('Y');
    	$.each(compOnlyElements,function(elementIndex, elementValue){
    		
    		var thisId = $('#'+elementValue+'_'+strIndex).attr('id');
    		if(thisId == null){
    			return;
    		}
			var intUnderbar = thisId.lastIndexOf('_');
			var fieldId = thisId.substring(0,intUnderbar);
			var strIndexSub = parseOffIndex(thisId);
    		if(fieldId!='COMP' && fieldId!='COMP_GLASS' && strIndexSub==strIndex){
    			$('#'+thisId).val('').prop('disabled',true).trigger(changeSelectBoxIt);

    			if(fieldId=='UMUIMBI'){
        			$('#UMUIM_deductionVal_'+strIndexSub).val('');
    			}
    			else if(fieldId == 'NCR_ALA_Select'){
        			$('#NCR_ALA_limit_' + strIndexSub).val('');
        			$('#NCR_ALA_deductionVal_' + strIndexSub).val('');
    		    }
    			else if(fieldId == 'LOAN_ALA_Select'){
        			$('#LOAN_ALA_limit_' + strIndexSub).val('');
        			$('#LOAN_ALA_deductionVal_' + strIndexSub).val('');
    			}
    			else{
    				$('#'+fieldId+'_deductionVal_'+strIndexSub).val('');
    			}

    			showClearInLineErrorMsgsWithMap(fieldId+'_'+strIndexSub, '', fieldIdToModelErrorRow['defaultMulti'],
      					 strIndex, errorMessages, addDeleteCallback);

    			if(!$('.WaiverofDeductible').hasClass("hidden")){
    				$('.WaiverofDeductible').addClass('hidden');
    			}

    		    if ($('#' + fieldId + '_Error').length > 0) {
    		    	//removeFloodedErrorRows(fieldId,'');
    		    }
    		}
    	});

    	if(document.getElementById('COMP_' + strIndex).value == 'No Coverage'){
    		  showClearInLineErrorMsgsWithMap('COMP_'+strIndex, 'COMP.browser.inLine.COMP_Reqd_for_COMP_ONLY', fieldIdToModelErrorRow['defaultMulti'],
    	                strIndex, errorMessages, addDeleteCallback);
    	}
    	 strMsg='';
    }
    else if(fieldCompOnly.value == 'No'){
    	$('#suspendIndCd_'+strIndex).val('N');
    	$.each(compOnlyElements,function(elementIndex, elementValue){
    		var thisId = $('#'+elementValue+'_'+strIndex).attr('id');
    		if(thisId == null){
    			return;
    		}		
    		var intUnderbar = thisId.lastIndexOf('_');
			var fieldId = thisId.substring(0,intUnderbar);
			var strIndexSub = parseOffIndex(thisId);
    		if(fieldId!='COMP' && fieldId!='COMP_GLASS' && strIndexSub==strIndex){
    			$('#'+thisId).prop('disabled',false).trigger(changeSelectBoxIt);
    			if(fieldId=='COLL' || fieldId=='TL_LIMIT' || fieldId=='RR' ){
    				$('#'+thisId).val('No Coverage').trigger(changeSelectBoxIt);
    			}
    		}
   			if($('#COLL_'+strIndexSub).val()!='No Coverage' && $('#COLL_'+strIndexSub).val()!=''){
				$('.WaiverofDeductible').removeClass('hidden');
			}
    	});
    	 showClearInLineErrorMsgsWithMap('COMP_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
	                strIndex, errorMessages, addDeleteCallback);
   	 strMsg='';
   	
    }
    else{
    	$('#suspendIndCd_'+strIndex).val('N');
    	strMsg='COMP_ONLY.browser.inLine.valid_valueCheck';
    }

    showClearInLineErrorMsgsWithMap('COMP_ONLY_'+strIndex, strMsg, fieldIdToModelErrorRow['defaultMulti'],
            strIndex, errorMessages, addDeleteCallback);

	if (strMsg=='' && $('#COMP_ONLY_Error').length > 0) {
	    	removeFloodedErrorRows('COMP_ONLY',strMsg);
	}
}

 *
 * preddy
 * 
function validateHCProviderFields(fieldThis){
	var strMsg = '';
	var intUnderbar = fieldThis.id.lastIndexOf('_');
	var fieldId = fieldThis.id.substring(0, intUnderbar);
	var regex;
	var limitField;
	var hit = false;
	if (fieldId == 'HC_PROVIDER_NAME_DISPLAY') {
		regex = /^[A-Za-z ]+$/i;
		limitField = 'HC_PROVIDER_NAME_limit';
		hit = true;
	} else if (fieldId == 'HC_PROVIDER_NUMBER_DISPLAY') {
		regex = /^[A-Za-z0-9 ]+$/i;
		limitField = 'HC_PROVIDER_NUMBER_limit';
		hit = true;
	}
	if (hit == false) {
		return strMsg;
	}
	if (regex.test(fieldThis.value)) {
		strMsg = '';
	} else {
		strMsg = fieldId + '.browser.inLine.Invalid';
		$('#' + fieldThis.id).val('');
		$('#' + limitField).val('');
	}

	return strMsg;
}

 *
 * preddy
 * 
function validateRequiredField(fieldThis){
	//console.log('validating '+fieldThis.id+' value:'+fieldThis.value);
	var strMsg = '';
    var strIndex = parseOffIndex(fieldThis.id);
    var intUnderbar = fieldThis.id.lastIndexOf('_');
    var fieldId = fieldThis.id.substring(0,intUnderbar);

    
     * NCR_ALA, LOAN_ALA and UPGR_PAK are not required. Do not perform validation
     * for these fields
     
    if(fieldId == 'NCR_ALA_Select' || fieldId == 'LOAN_ALA_Select' || fieldId == 'UPGR_PAK'){
    	return;
    }
    if(fieldId == 'COMP_GLASS' && fieldThis.value == ''
			&& (document.getElementById('COMP_' + strIndex).value == '' ||
				document.getElementById('COMP_' + strIndex).value == 'No Coverage')) {
		return;
	}
    else if (fieldThis.value != '' && (fieldId == 'HC_PROVIDER_NAME_DISPLAY' || fieldId == 'HC_PROVIDER_NUMBER_DISPLAY')) {
    	strMsg = validateHCProviderFields(fieldThis);
    } 
    if(strMsg!=''){
    	 showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
    }
    else{
    	if (fieldThis.value == ''){
            strMsg = fieldId + '.browser.inLine.valid_valueCheck';
      	}
        showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
    }
  
    if (strMsg == '' && $('#' + fieldId + '_Error').length > 0) {
    	removeFloodedErrorRows(fieldId,strMsg);
    }
}

//remove this function global function to handle this
function removeFloodedErrorRows(fieldId, strMsg) {
	var removeFloodedErrorRow = false;
	$('td[id^=' + fieldId + '_Error_Col_]').each(function() {
		if ($('#' + this.id).html().indexOf('span') >= 0) {
			removeFloodedErrorRow = true;
		}
	});
	if (removeFloodedErrorRow) {
		$('#' + fieldId + '_Error').remove();
		$('#' + fieldId + '_Error_Header').remove();
	}
}

function validateCOLLField(fieldThis) {
	var strCOLLMsg = '';
	var strIndex = parseOffIndex(fieldThis.id);
    var intUnderbar = fieldThis.id.lastIndexOf('_');
    var fieldId = fieldThis.id.substring(0,intUnderbar);
	if (document.getElementById('COLL_' + strIndex).value == 'No Coverage') {
		//COLL is required for financed/ leased vehicles
		if (document.getElementById('vehicleLeased_' + strIndex).value == 'true'){
			strCOLLMsg = 'COLL.browser.inLine.COLL_Coverage_Reqd_for_Leased_Financed_Vehicle';
			showClearInLineErrorMsgsWithMap(fieldThis.id, strCOLLMsg, fieldIdToModelErrorRow['defaultMulti'],
		            strIndex, errorMessages, addDeleteCallback);
		}
	}
}

function validateCOMPField(fieldThis) {
	var strIndex = parseOffIndex(fieldThis.id);
    var intUnderbar = fieldThis.id.lastIndexOf('_');
    var fieldId = fieldThis.id.substring(0,intUnderbar);
	var strCOMPMsg = '';
	if (document.getElementById('COMP_' + strIndex).value == 'No Coverage') {
		//COMP is required when Substitute Transportation is selected
		if (document.getElementById('RR_' + strIndex) != null &&
				document.getElementById('RR_' + strIndex).value != 'No Coverage'
				&& document.getElementById('RR_' + strIndex).value != '') {
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_EXTTRAN';
		}

		//COMP is required when Towing coverage is selected
		if (document.getElementById('TL_LIMIT_' + strIndex) != null &&
				document.getElementById('TL_LIMIT_' + strIndex).value != 'No Coverage'
				&& document.getElementById('TL_LIMIT_' + strIndex).value != '') {
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_TL';
		}

		// COMP is required when Collision coverage is selected
		if (document.getElementById('COLL_' + strIndex).value != 'No Coverage'
				&& document.getElementById('COLL_' + strIndex).value != '') {
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_COLL';
		}

		//COMP is required for financed/ leased vehicles
		if (document.getElementById('vehicleLeased_' + strIndex).value == 'true'){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Reqd_for_Leased_Financed_Vehicle';
		}
		
		//COMP is required for customized vehicles
		if (document.getElementById('customizedEquipAmt_' + strIndex).value != null
				&& document.getElementById('customizedEquipAmt_' + strIndex).value != 0){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Reqd_for_CUST_EQUIP_AMT';
		}	

		//COMP is required for comp only vehicles
		if(isEndorsement() && $('#suspendIndCd_'+strIndex).val()=='Y'){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Reqd_for_COMP_ONLY';
		}
		
		showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strCOMPMsg, fieldIdToModelErrorRow['defaultMulti'],
	            strIndex, errorMessages, addDeleteCallback);
	}
	
}

*//**
 * flood BI to UMUIMBI as well
 * @param fieldThis
 *//*
function validateUMUIMBI(fieldThis) {
	var strBIID = '';
	var strUMUIMBI = '';
	var strErrorID = '';
	var strID = '';
	strID = fieldThis.id;
	if (strID.substring(0,2) == 'BI'){
		strBIID = strID;
		strUMUIMBI = strBIID.replace('BI_', 'UMUIMBI_');
	}else{
		strUMUIMBI = strID;
		strBIID = strUMUIMBI.replace('UMUIMBI_', 'BI_');
	}
	var strIndex = parseOffIndex(strUMUIMBI);
	var strBIValue = $('#' + strBIID).val();
	var strUMUIMBIValue = $('#' + strUMUIMBI).val();

	if(strUMUIMBIValue == null || strUMUIMBIValue ==''){
		strErrorID =  'UMUIMBI.browser.inLine.valid_valueCheck';
	}
	
	if(strBIValue != null && strUMUIMBIValue != null && strBIValue !='' && strUMUIMBIValue!=''){
		if (isSecondCovHigher(strBIValue, strUMUIMBIValue)){
			strErrorID = 'UMUIMBI.browser.inLine.BI_SplitLimit_CanNot_Be_LessThan_UMUIM_SplitLimits';
		}
		if (strBIValue.indexOf('CSL') >= 0 && strUMUIMBIValue.indexOf('CSL') < 0){
			strErrorID = 'UMUIMBI.browser.inLine.UMUIM_limit_ShouldBeCSL';
		}
		if(strBIValue.indexOf('CSL') < 0 && strUMUIMBIValue.indexOf('CSL') >= 0){
			strErrorID = 'UMUIMBI.browser.inLine.UMUIM_limit_ShouldBeSplit';
		}
	}

	//console.log('validating '+strUMUIMBI+'...Error msg: '+strErrorID + '...strIndex: '+strIndex);
	showClearInLineErrorMsgsWithMap(strUMUIMBI, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}

function validateUMUIMPD(fieldThis) {
	var strBIID = '';
	var strUMUIMBI = '';
	var strErrorID = '';
	var strID = '';
	strID = fieldThis.id;
	if (strID.substring(0,2) == 'PD'){
		strBIID = strID;
		strUMUIMBI = strBIID.replace('PD_', 'UMPD_');
	}else{
		strUMUIMBI = strID;
		strBIID = strUMUIMBI.replace('UMPD_', 'PD_');
	}
	var strIndex = parseOffIndex(strUMUIMBI);
	var strBIValue = $('#' + strBIID).val();
	var strUMUIMBIValue = $('#' + strUMUIMBI).val();

	if(strUMUIMBIValue == null || strUMUIMBIValue ==''){
		strErrorID =  'UMPD.browser.inLine.valid_valueCheck';
	}

	if(strBIValue != null && strUMUIMBIValue != null  && strBIValue !='' && strUMUIMBIValue!=''){
		if (isSecondCovHigher(strBIValue, strUMUIMBIValue)){
			strErrorID = 'UMPD.browser.inLine.PD_limit_ShdNotBeLessThan_UMPD_limit';
		}

		if (strBIValue.indexOf('CSL') >= 0 && strUMUIMBIValue.indexOf('CSL') < 0)
		{
			strErrorID = 'UMPD.browser.inLine.UMUIM_limit_ShouldBeCSL';
		}
		if(strBIValue.indexOf('CSL') < 0 && strUMUIMBIValue.indexOf('CSL') >= 0){
			strErrorID = 'UMPD.browser.inLine.UMUIM_limit_ShouldBeSplit';
		}
	}
	showClearInLineErrorMsgsWithMap(strUMUIMBI, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}


*//**
 * check PD value based on BI selection(PD must be CSL if BI is CSL)
 * @param biPDCov
 *//*
function checkPDLimitForBISelected(biPDCov){
	var stub = biPDCov;
	var strError = '';
	$('select[id^="BI_"]').each(function() {
		var biId = this.id;
		var biValue = this.value;
		var n = biId.lastIndexOf("_");
		var idIndex = biId.substring(n+1,n.length);
		var strIndex = idIndex;

		var pdId = 'PD_'+idIndex;
		var pdValue = $('select[id^='+ pdId +']').val();
		if(biValue !=null && biValue !='' && pdValue !=null && pdValue !='')
		{
			if (biValue.indexOf('CSL') >= 0 && pdValue.indexOf('CSL') < 0 )
			{
				strError = 'PD.browser.inLine.Select_PD_csl_limit';
			}

			if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') >= 0 ){
				strError = 'PD.browser.inLine.PD_limit_ShouldBeSplit';
			}
			if(bothCSL(biValue,pdValue))
			{
				var strBIValue = parseInt(biValue.replace('CSL', ''));
				var strPDValue = parseInt(pdValue.replace('CSL', ''));
				if(strPDValue != strBIValue){
					strError = 'PD.browser.inLine.Select_PD_csl_limit';
				}
			}
			if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') < 0 ){
				strError = '';
				strIndex = parseInt(strIndex);
			}
			
			showClearInLineErrorMsgsWithMap(pdId, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
		}
	});
}


function checkExtraPipForPipValue(pipExtraPipCov){
	var stub = pipExtraPipCov;
	var strError = '';
	$('select[id^="PRINC_PIP_"]').each(function() {
		var pipId = this.id;
		var pipValue = this.value;
		var n = pipId.lastIndexOf("_");
		var idIndex = pipId.substring(n+1,n.length);
		var strIndex = idIndex;

		var extraPipId = 'EXTRA_PIP_LIMIT_'+idIndex;
		var extraPipValue = $('select[id^='+ extraPipId +']').val();
		if(pipValue !=null && pipValue !='' && (pipValue =='Primary Medical Expense Only' || pipValue =='Secondary Medical Expense Only'))
		{
			if(extraPipValue !=null && extraPipValue !='' && extraPipValue != 'No Extra PIP Option')
			{
				strError = 'EXTRA_PIP_LIMIT.browser.inLine.invalidExtraPIP';
				showClearInLineErrorMsgsWithMap(extraPipId, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
			}

		}
		else{
			if(extraPipValue !=null && extraPipValue !='' && extraPipValue != 'No Extra PIP Option'){
					var ndx = parseInt(strIndex);
					showClearInLineErrorMsgsWithMap(extraPipId, strError, fieldIdToModelErrorRow['defaultMulti'],ndx, errorMessages, addDeleteCallback);
			}
		}
	});
}

function isSecondCovHigher(strFirstCov, strSecondCov){
	var blnResult = false;
		if(bothCSL(strFirstCov, strSecondCov)){
			var strFirstValue = parseInt(strFirstCov.replace('CSL', ''));
			var strSecondValue = parseInt(strSecondCov.replace('CSL', ''));
			if(strSecondValue > strFirstValue){
				blnResult = true;
			}
		}else if(bothSplit(strFirstCov, strSecondCov)){
			var arrFirstCov = strFirstCov.split('/');
			var arrSecondCov = strSecondCov.split('/');
			if((parseInt(arrSecondCov[0]) > parseInt(arrFirstCov[0])) || (parseInt(arrSecondCov[1]) > parseInt(arrFirstCov[1]))){
				blnResult = true;
			}
		}
		else if(bothLimit(strFirstCov, strSecondCov)){
			var strFirstValue = parseInt(strFirstCov.replace('CSL', ''));
			var strSecondValue = parseInt(strSecondCov.replace('CSL', ''));
			if(strSecondValue > strFirstValue){
				blnResult = true;
			}
		}
		return blnResult;
}

function bothCSL(strFirstCov, strSecondCov){
		if (strFirstCov.indexOf('CSL') >= 0 && strSecondCov.indexOf('CSL') >= 0 ){
			return true;
		}else{
			return false;
		}
}

function bothSplit(strFirstCov, strSecondCov){
		if (strFirstCov.indexOf('/') > 0  && strSecondCov.indexOf('/') > 0 ){
			return true;
		}else{
			return false;
		}
}

function bothLimit(strFirstCov, strSecondCov){
	if (strFirstCov.indexOf('CSL') < 0 && strFirstCov.indexOf('/') < 0 &&  strSecondCov.indexOf('CSL') < 0 && strSecondCov.indexOf('/') < 0){
			return true;
	}
	else{
		return false;
	}
}

function parseOffIndex(str){
	var strIndex = '';
	var intUnderbar = str.lastIndexOf('_');
	strIndex = str.substring(intUnderbar + 1, str.length);
	return parseInt(strIndex);
}

function validatePracticeInput(practiceInput) {
	validateNameInColumn(practiceInput, 'Yes', 'practiceInput.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateBI(BI){
	var strColumn;
	var strID;

	strID = BI.id;
	strColumn = strID.replace("BI_", "");
	validateNameInColumn(BI, 'Yes', 'BI.browser.inLine', fieldIdToModelErrorRow['defaultMulti'], strColumn);
}

// end tab-out edit functions for this page
function setPackageSelection(el){
	var selected = '';
	for (var i=0; i < document.aiForm.selectPackage.length; i++)
	   {
	   if (document.aiForm.selectPackage[i].checked)
	      {
	      selected = document.aiForm.selectPackage[i].value;
	      }
	   }
	$('#PS_limit').val(selected);
	$("#packageSelectionDialog").hide();
}

*//**
 * any change should fire clear premium event for a rated policy?? remove class .clearPremium and use SELECT.change(event)..
 * @returns
 *//*
function clearPremium(){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	$('.clsPremiumAmt').each(function(){
		this.value =  "0";
	});
	$('.clsPremiumAmtDisplay').each(function(){
		this.outerHTML =  "<span></span>";
	});
	// turn edit events back on
	blnTriggerEdits = true;
}

function updateNewVehCov(){

	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	
	var selector = 'select[id$="_0"].clsFloodLiab';
	updateNewVehCovItem(selector,false);
	selector = 'input[id$="_0"].clsFloodLiab';
	updateNewVehCovItem(selector);
	
	// flood Policy Coverages across all veh's
	//  -> this is for show
	//     it is not a cov change
	
	selector = 'select[id$="_0"].clsFloodPolicyCov';
	updateNewVehCovItem(selector, false);
	selector = 'input[id$="_0"].clsFloodPolicyCov';
	updateNewVehCovItem(selector, false);

	extraPIPSelected();
	$('select[id^=UPGR_PAK]').each(function(){
		var strIndex = parseOffIndex(this.id);
		showHideTLIncluded(this.id);
	});
	// turn edit events back on
	blnTriggerEdits = true;
}

function updateNewVehCovItem(selector, vehPPA){
	var vehCount = parseInt($('#coverageCount').val());
	var lastVeh = vehCount -1;
	var thisId = '';
	var stub = '';
	var n = 0;
	var testId = '';
	var thisValue = '';
	var newChecked = '';

	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	// select the first veh's Liability cov limit
	// propagate to other veh's: period
    $(selector).each(function() {
    	thisId = this.id;
    	n = thisId.lastIndexOf("_");
    	stub = thisId.substring(0, n+1);
       	for (var i = 0; i <= lastVeh; i++){
       		if (thisValue.length == 0){
       			if (vehPPA){
           			// get thisValue from 1st CarLikeVeh
       				if (isCarLikeVehicle($('#vehTypeCd_' + i).val())){
               			thisValue = this.value;
           		    	if(this.type == 'checkbox'){
           		    		newChecked = this.checked;
           		    	}
       				}
           		}else{
           			// get this value from 1st column
       				thisValue = this.value;
       		    	if(this.type == 'checkbox'){
       		    		newChecked = this.checked;
       		    	}
           		}
    		}
       		if (thisValue.length > 0){
       			// got one now propagate
       			floodLiab(this);

           		break;
       		}

       	}
	});

	// turn edit events back on
	blnTriggerEdits = true;
}

function floodBI(cov){
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
	blnTriggerEdits = false;
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    var idIndex = thisId.substring(n+1,n.length);
    var vehTypeCode = $('#vehTypeCd_'+idIndex).val();
    var currVehTypeCode = null;
    var isVehicleCompOnly = false; 
    $('select[id^=' + stub + ']').each(function() {    	
    	if($(this).hasClass("clsBILimit") || $(this).hasClass("clsUMUIMLimit") || $(this).hasClass('clsPDLimit') || $(this).hasClass('clsUMPDLimit')){
			nextId = this.id;
			n = nextId.lastIndexOf("_");
		    stub = nextId.substring(0, n+1);
		    idIndex = nextId.substring(n+1,n.length);
		    currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
		    if($('#COMP_ONLY_'+idIndex).val()=='Yes'){
		    	isVehicleCompOnly = true;		    	
		    }
		    else{
		    	isVehicleCompOnly = false;
		    }
		    if(nextId != thisId){
    			if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
    				$('#' + this.id).val(newSelection).trigger(changeSelectBoxIt);
			    	//validateRequiredField(this);
			    	
			    	if($(this).hasClass("clsBILimit")){
			    		validateRequiredField(this);
			    		validateUMUIMBI(this);
			    	}
			    	if($(this).hasClass("clsUMUIMLimit")){
			    		validateUMUIMBI(this);
			    	}
			    	if($(this).hasClass("clsPDLimit")){
			    		validateRequiredField(this);
			    		validateUMUIMPD(this);
			    	}
			    	if($(this).hasClass("clsUMPDLimit")){
			    		validateUMUIMPD(this);
			    	}

			    	highlightAndFade(this);
			    }

    		}
		}
    });
  //when it's BI Or PD overflow it in the limits
    if(stub == 'BI_' || stub == 'PD_'){
    	floodLimitsBIPD(stub,newSelection,currVehTypeCode);
    	//checkPDLimitForBISelected(stub);
    }
    // turn edit events back on
	blnTriggerEdits = true;
}


function floodPolicyCoverages(cov,pageLoad){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
    // chnage the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;

    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    //select the id, of Type as _0,_1
    var idIndex = thisId.substring(n+1,n.length);
    var vehTypeCode = $('#vehTypeCd_'+idIndex).val();
    var vehTyp =null;
  // alert('stub = '+stub);
    $('select[id^=' + stub + ']').each(function() {
    	if($(this).hasClass("clsNcr") || $(this).hasClass("clsLoan") || $(this).hasClass("clsEssPak")){
    		var ratedIndicator =  $('#ratedInd').val();
	    	var originalPremAmt = $('#premAmt').val();
	    	if(pageLoad!=true){
	    		resetPremium(ratedIndicator,originalPremAmt);
	    	}
    		nextId = this.id;
   			if(nextId != thisId){
    			n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);

			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    if(readyToFlood(currVehTypeCode)){
			    	vehTyp = currVehTypeCode;
			    	$('#' + this.id).val(newSelection).trigger(changeSelectBoxIt);
			    	if(pageLoad!=true){
			    		highlightAndFade(this);	
			    	}
			    }
			}
		}
    });

    // check check boxes
    $('input[id^=' + stub + ']').each(function() {
    	if($(this).hasClass("clsNcr") 
    			|| $(this).hasClass("clsLoan") 
    			|| $(this).hasClass("clsEssPak")){
			nextId = this.id;
    		if(nextId != thisId){
    			//don't change or highlight the one the user changed
             	n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    //select the id, of Type as _0,_1
			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    if(readyToFlood(currVehTypeCode))
			   {
					this.value = newSelection;
	                if(this.type == 'checkbox'){
	                	// update check box display
	                	this.checked = cov.checked;
	                }
			    	if(pageLoad!=true){
			    		highlightAndFade(this);	
			    	}
			    }
			}
		}
    });

    // turn edit events back on
	blnTriggerEdits = true;
}



function floodLiab(cov){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
    // chnage the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;

    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    //select the id, of Type as _0,_1
    var idIndex = thisId.substring(n+1,n.length);
    var vehTypeCode = $('#vehTypeCd_'+idIndex).val();
    var vehTyp =null;
    var isVehicleCompOnly = false; 
    $('select[id^=' + stub + ']').each(function() {
    	//console.log('selecting '+this.id+'='+this.value);
    	if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsPRINC_PIPLimit")
    			|| $(this).hasClass("clsEXTRA_PIP_Limit") || $(this).hasClass("clsPIP_Limit")
    			|| $(this).hasClass("clsPIP_Deductible") || $(this).hasClass("clsExtraPIPApplies")
    			|| $(this).hasClass("clsEMP") || $(this).hasClass("clsTORT") || $(this).hasClass("clsTL")){
			nextId = this.id;
		    if($('#COMP_ONLY_'+parseOffIndex(this.id)).val()=='Yes'){
		    	isVehicleCompOnly = true;		    	
		    }
		    else{
		    	isVehicleCompOnly = false;
		    }
   			if(nextId != thisId){
    			n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
			    	vehTyp = currVehTypeCode;
			    	$('#' + this.id).val(newSelection).trigger(changeSelectBoxIt);
			    	validateRequiredField(this);
			    	highlightAndFade(this);
			    }

    		}
		}
    });

    // check check boxes
    $('input[id^=' + stub + ']').each(function() {
    	if($(this).hasClass("clsPRINC_PIPLimit") 
    			|| $(this).hasClass("clsHCProviderName")
    			|| $(this).hasClass("clsHCProviderNumber")){
			nextId = this.id;
    		if(nextId != thisId){
    			//don't change or highlight the one the user changed
             	n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    //select the id, of Type as _0,_1
			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    if(readyToFlood(currVehTypeCode)){
					$('#' + this.id).val(newSelection).trigger(changeSelectBoxIt);
				    validateRequiredField(this);
	                if(this.type == 'checkbox'){
	                	// update check box display
	                	this.checked = cov.checked;
	                }
	               	highlightAndFade(this);
			    }
			}
		}
    });

    // turn edit events back on
	blnTriggerEdits = true;
}

function readyToFlood(currVehTypeCode)
{
	if(currVehTypeCode == PRIVATE_PASSENGER_CD 
			|| currVehTypeCode == MOTOR_HOME_CD){
			return true;
	}
	return false;
}

*//**
 * flood BI and PD values to UMIM and UMPD value's
 * @param stub
 * @param newSelection
 * @param currVehTypeCode
 *//*
function floodLimitsBIPD(stub,newSelection,currVehTypeCode){
	var limitType = 'UMUIMBI_';
	var isVehicleCompOnly = false;
	if(stub == 'PD_'){
		limitType = 'UMPD_';
	}
	//alert('stub ='+stub+'limitType ='+limitType+'new Selection ='+newSelection+'currVehTypeCode ='+currVehTypeCode);
	$('select[id^=' + limitType + ']').each(function() {
		var strIndex = parseOffIndex(this.id);
		if($('#COMP_ONLY_'+strIndex).val()=='Yes'){
	    	isVehicleCompOnly = true;		    	
	    }
	    else{
	    	isVehicleCompOnly = false;
	    }

		if($(this).hasClass("clsUMUIMLimit") || $(this).hasClass("clsUMPDLimit")){
				if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
				    	$(this).val(newSelection).trigger(changeSelectBoxIt);
				    	validateRequiredField(this);
				    	highlightAndFade(this);
				}
		}
	});
}

function hideShowRows(){
	var strTeachers = 'ALN_TEACH';
	// if there are any car-like vehicles
	// show car-like only rows
	// else hide
	//1. check vehicle tpye to get baseline
	if(isAnyCarLikeVehicle()){
		$('.CarLikeVehicles').removeClass('hidden');
	}else{
		$('.CarLikeVehicles').addClass('hidden');
	}
	//2. Hide Healthcare provider info on Quote
	HideShowHealthCareProvider();
	//3. Show PIP Applies if Extra PIP selected
	//extraPIPSelected();
	//4. Show Waive Deductible based on Collision
	waiveDeductibleAll();
	//setvalues for Upgrade Package and AccidetnForgiveness
	setValues('ESS_PAK');
	//commenting this row ACC_FOR goes off
	//setValues('ACC_FORG');
	//5. Hide TL based for Teachers
	//5.1 For TL, Show Included when Upgrade Package Selected
	if($('#companyCd') == strTeachers){
		$('#TowingLabor').addClass('hidden');
	}else{
		//var strElement = $('#UPGR_PAK_0');
		//showOrHideTLUnavailable(strElement.attr('id'));
		showHideTLIncluded('UPGR_PAK_0');
	}
	if(document.getElementById('UPGR_PAK_0')){
		floodPolicyCoverages(document.getElementById('UPGR_PAK_0'),true);	
	}
	
	//6. New Car display
	showHideNewCarIncluded('UPGR_PAK_0');
	newCarAll();
	//7. Loan Lease
	showHideLoanLeaseIncluded('UPGR_PAK_0');
	loanLeaseAll();

	 *
	 * preddy
	 * 
	showHideCompGlass();
	showHideCompOnly();

	alignRows();
}

 *
 * preddy
 * 
function processAllCompOnly(){
	
	$('select[id^=COMP_ONLY_]').each(function(){
		
	    var strIndex = parseOffIndex(this.id);
	    var intUnderbar = this.id.lastIndexOf('_');
	    var fieldId = this.id.substring(0,intUnderbar);
	    
	    if($('#suspendIndCd_'+strIndex).val()=='Y'){
	    	$(this).val('Yes').trigger(changeSelectBoxIt);
	    }
	    else{
	    	$(this).val('No').trigger(changeSelectBoxIt);
	    }

		if(fieldId == 'COMP_ONLY'){
	    	validateCOMPONLY(this);
	    }

	});
}

 *
 * preddy
 * 
function showHideCompGlass(){

	var retainRow = false;

	$('select[id^=COMP_]').each(function() {

	    var strIndex = parseOffIndex(this.id);
	    var intUnderbar = this.id.lastIndexOf('_');
	    var fieldId = this.id.substring(0,intUnderbar);

	    if(fieldId == 'COMP'){
	    	validateCOMPGLASS(this);
	    }

	    if(fieldId == 'COMP' && this.value != '' && this.value != 'No Coverage'){
			retainRow = true;
		}

	});

	if(!retainRow){
		$('.COMP_GLASS').addClass('hidden');
		$('#COMP_GLASS_Error').addClass('hidden');
		$('#COMP_GLASS_Error_Header').addClass('hidden');

	}
	else{
		$('.COMP_GLASS').removeClass('hidden');
		$('#COMP_GLASS_Error').removeClass('hidden');
		$('#COMP_GLASS_Error_Header').removeClass('hidden');

	}
}

 *
 * preddy
 * 
function validateCOMPGLASS(COMP){

	var strIndex = parseOffIndex(COMP.id);

	if(COMP.value != '' && COMP.value != 'No Coverage'){
		$('select[id^=COMP_GLASS_'+strIndex+']').each(function(){
			if($(this).hasClass('hidden')){
				$(this).removeClass('hidden');
			}
			if($('#COMP_GLASS_TD_' + strIndex).hasClass("hidden")){
				$('#COMP_GLASS_TD_' + strIndex).removeClass('hidden');
			}
		});

		//check required field entry for comp_glass
		if(document.getElementById('COMP_GLASS_'+strIndex).value == ''
			&& (COMP.value == '' || COMP.value == 'No Coverage')){
			showClearInLineErrorMsgsWithMap('COMP_GLASS_'+strIndex, 'COMP_GLASS.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					 strIndex, errorMessages, addDeleteCallback);
		}

	}
	else{
		$('select[id^=COMP_GLASS_'+strIndex+']').each(function(){
			$(this).val('').trigger('chosen:updated');
			if(!$(this).hasClass('hidden')){
				$(this).addClass('hidden');
			}
			if(!$('#COMP_GLASS_TD_' + strIndex).hasClass("hidden")){
				$('#COMP_GLASS_TD_' + strIndex).addClass('hidden');
			}
		});

		//remove validation for this condition
		 showClearInLineErrorMsgsWithMap('COMP_GLASS_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
	                strIndex, errorMessages, addDeleteCallback);

	}
}

 *
 * preddy
 * 
function showHideCompOnly(){
	if(isEndorsement()){
		$('.COMP_ONLY').removeClass('hidden');
		processAllCompOnly();
	}
	else{
		$('.COMP_ONLY').addClass('hidden');
	}

}

var idsWithNA = [ "BI", "PD", "UMPD", "UMUIM" , "PRINC_PIP_LIMIT" , "HC_PROVIDER_NAME_DISPLAY", "HC_PROVIDER_NUMBER_DISPLAY"
                 ,"PIP_Limit", "PIP_Deductible" , "ExtraPIP_LIMIT" , "ExtraPIPApplies" , "EMP" , "TORT" , "RR" , "TL_LIMIT"
                ];


function hideCoveragesWhereNotApplicable(){

	$('.vehTypeCd').each(function() {
		for(var i=0; i< idsWithNA.length; i++) {
			showOrHideNotApplicable(this, idsWithNA[i]);
		}
	});
}

function showOrHideNotApplicable(strElm, covCode) {
	lastIndex = getIndexOfElementId(strElm);
	var vehType = $(strElm).val();

	var strNotApplicable = "#"+covCode+"NA_";
	var strApplicable = "#"+covCode+"_";

	if(isCarLikeVehicle(vehType)){
		showOrHideHtml(strNotApplicable + lastIndex, 'hide');
		showOrHideHtml(strApplicable + lastIndex, 'show');
	}else{
		showOrHideHtml(strNotApplicable + lastIndex, 'show');
		showOrHideHtml(strApplicable + lastIndex, 'hide');
	}
}

function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var n = strId.lastIndexOf('_');
    var lastIndx = strId.substring(n + 1);

    return lastIndx;
}

function setValues(strIdRoot){

	var strSelectorDisplay = strIdRoot + '_DISPLAY_0';
	var strSelectorLimit = '#' + strIdRoot + '_limit';

	$('select[id^=' + strSelectorDisplay + ']').val($(strSelectorLimit).val()).trigger(changeSelectBoxIt);

}

function HideShowHealthCareProvider (){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	if(isAnyCarLikeVehicle()){
		//should be 'Application' only
		if(isApplicationOrEndorsement()){
			if($('#stateCd').val() == 'NJ'){
				//check any column for PRINC_PIP -> they are all the same
				if($('#PRINC_PIP_0').val() == '' || $('#PRINC_PIP_0').val() == 'Primary Full PIP' || $('#PRINC_PIP_0').val() == 'Primary Medical Expense Only'){
					$('.HC_Provider').addClass('hidden');
					$('.HC_Provider_Number').addClass('hidden');
					// and clear values
					$('input[id=HC_PROVIDER_NAME]').val('');
					$('input[id=HC_PROVIDER_NUMBER]').val('');
					$('input[id=HC_PROVIDER_NAME_limit]').val('');
					$('input[id=HC_PROVIDER_NUMBER_limit]').val('');
					
					$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]').each(function(event, result){
						showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
								parseOffIndex(this.id), errorMessages, addDeleteCallback);
					});
					
					$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]').each(function(event, result){
						showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
								parseOffIndex(this.id), errorMessages, addDeleteCallback);
					});

				}else{
					$('.HC_Provider').removeClass('hidden');
					$('.HC_Provider_Number').removeClass('hidden');

					$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]').each(function(event, result){
						validateRequiredField(this);
					});
					
					$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]').each(function(event, result){
						validateRequiredField(this);
					});
					
				}
			}
		}else{
			$('.HC_Provider').addClass('hidden');
			$('.HC_Provider_Number').addClass('hidden');
		}
	}

	// turn edit events back on
	blnTriggerEdits = true;
}

function waiveDeductibleAll(){
//Build the Waive of Deductible row at .ready time
	var blnCOLLPresent = false;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	$('select[id^=COLL_]').each(function() {
		// show / hide all individual cols
		waiveDeductible(this);
		if(this.value != '' && this.value != 'No Coverage'){
			//at least one Coll selected
			blnCOLLPresent = true;
		}
	});
	// see if any COLL's present
	if(blnCOLLPresent){
		// at least one Coll present
		// be sure row is showing and check all COLL's
		if($('.WaiverofDeductible').hasClass("hidden")){
			// show row
			$('.WaiverofDeductible').removeClass('hidden');
		}
	}else{
		// no Coll present, be sure row is hidden
		if($('.WaiverofDeductible').hasClass("hidden")){
		}else{
			//row is not hidden -> hide it
			$('.WaiverofDeductible').addClass('hidden');
		}
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

function waiveDeductibleThisCol(COLL){
	var blnCOLLPresent = false;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	// show / hide this col
	waiveDeductible(COLL);
	//see if any COLL present
	$('select[id^=COLL_]').each(function() {
		// see if any COLL's present
		if(this.value != '' && this.value != 'No Coverage'){
			blnCOLLPresent= true;
			return false;
		}
	});
	if (blnCOLLPresent){
		// at least one COLL present
		// be sure row is shown
		if($('.WaiverofDeductible').hasClass("hidden")){
			$('.WaiverofDeductible').removeClass('hidden');
		}
	}else{
		// be sure row is hidden
		if($('.WaiverofDeductible').hasClass("hidden")){
		}else{
			//hide row
			$('.WaiverofDeductible').addClass('hidden');
		}
	}

	// turn edit events back on
	blnTriggerEdits = true;
}

function waiveDeductible(COLL){
	var strIndex;

	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	strIndex = parseOffIndex(COLL.id);
	if(COLL.value != '' && COLL.value != 'No Coverage'){
		// Value present: be sure col shows
		if($('#WaiverofDeductible_TD_' + strIndex).hasClass("hidden")){
			$('#WaiverofDeductible_TD_' + strIndex).removeClass('hidden');
		}
		if ($('#COLL_limit_' + strIndex).val() != ''){
			// set waiver from COLL limit
			$('#WaiverofDeductible_' + strIndex).val($('#COLL_limit_' + strIndex).val()).trigger(changeSelectBoxIt);
		}else{
			// no existing vlaue
			if($('#channelCd').val() == 'Direct'){
				//set default for Direct
				$('#WaiverofDeductible_' + strIndex).val('WAIVER').trigger(changeSelectBoxIt);
				$('#COLL_limit_' + strIndex).val('WAIVER');
			}else{
				//set default for non-Direct
				$('#WaiverofDeductible_' + strIndex).val('').trigger(changeSelectBoxIt);
				$('#COLL_limit_' + strIndex).val('');
			}
		}
	}else{
		//No value present, clear value and be sure column is hidden
		$('#WaiverofDeductible_' + strIndex).val('');
		$('#COLL_limit_' + strIndex).val('');
		if($('#WaiverofDeductible_TD_' + strIndex).hasClass("hidden")){
		}else{
			$('#WaiverofDeductible_TD_' + strIndex).addClass('hidden');
		}
	}
	// turn edit events back on
	blnTriggerEdits = true;
}


function showHideTLIncluded(upgradePackageId){

	var hideTLError = false;
	var strIndex = parseOffIndex(upgradePackageId);
	if($('#' + upgradePackageId).val() != '' && $('#' + upgradePackageId).val() != 'NONE'){
		// Upgrade Package Selected
		$('[id^=TL_Included_]').each(function(){
			strIndex = parseOffIndex(this.id);
			$('#TL_LIMIT_' + strIndex).val('').addClass('hidden').trigger(changeSelectBoxIt);
			//$('#TL_LIMIT_Error').addClass('hidden');
			//$('#TL_LIMIT_Error_Header').addClass('hidden');
			showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
					 strIndex, errorMessages, addDeleteCallback);
			$('#' + this.id).removeClass('hidden');

		});
	}else{
		//no Upgrade Package Selected
		$('[id^=TL_Included_]').each(function(){
			strIndex = parseOffIndex(this.id);
			$('#' + this.id).addClass('hidden');
			//$('#TL_LIMIT_' + strIndex).val('').removeClass('hidden').trigger(changeSelectBoxIt);
			$('#TL_LIMIT_' + strIndex).removeClass('hidden').trigger(changeSelectBoxIt);

			if($('#TL_LIMIT_' + strIndex).val() == '' && $('#COMP_ONLY_' + strIndex).val()!='Yes'){
				//showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, 'TL_LIMIT.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
						// strIndex, errorMessages, addDeleteCallback);
			}

			$('[id^=UPGR_PAK_]').each(function(){
				showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
						parseOffIndex(this.id), errorMessages, addDeleteCallback);
			});

			//$('#TL_LIMIT_Error').removeClass('hidden');
			//$('#TL_LIMIT_Error_Header').removeClass('hidden');
		});
	}


}

function showOrHideTLUnavailable(upgradePackageId){
	var strIndex = parseOffIndex(upgradePackageId);

	if($('#' + upgradePackageId).val() != '' && $('#' + upgradePackageId).val() != 'NONE'){
		// Upgrade Package Selected
		showOrHideHtml("#TL_Included_" + strIndex, 'show');
		showOrHideHtml("#TL_LIMIT_" + strIndex, 'hide');
	}else{
		//no Upgrade Package Selected
		showOrHideHtml("#TL_Included_" + strIndex, 'hide');
		showOrHideHtml("#TL_LIMIT_" + strIndex, 'show');
	}
}


function setNewCar(New_Car_Select){
	var strIndex;

	//updates NCR_ALA_limit sf hidden var with just selected value from non-sf dropdown
	strIndex = parseOffIndex(New_Car_Select.id);
	$('#NCR_ALA_limit_' + strIndex).val(New_Car_Select.value);

}

*//**
 * when a car is declared New and Upgrade Package Selection is Assurance Premier(PREM_PAK)
 * Upgrade package selection user will make after landing on Coverage
 * then New Car Replacement is included
 *//*
function showHideNewCarIncluded(upgradePackageId){
	//NCR_ALA_Included_: shows "Included"
	//NCR_ALA_Select_: shows TL dropdown -> non-sf, wrapped with selectBoxIt
	//NCR_ALA_limit_: actual sf limit
	var strIndex = parseOffIndex(upgradePackageId);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();

	if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == 'PREM_PAK')){
		// PPA and Premiere -> show new car as Included
		$('input[id^=NCR_ALA_Included_]').each(function(){
			strIndex = parseOffIndex(this.id);
			$('#NCR_ALA_Select_' + strIndex).val('').addClass('hidden').trigger(changeSelectBoxIt);
			$('#NCR_ALA_Unavailable_' + strIndex).addClass('hidden');
			$('#NCR_ALA_limit_' + strIndex).val('');
			$('#' + this.id).removeClass('hidden');
		});
	}else{
		// re-set vehicle by vehicle
		newCarAll();
	}
}

*//**
 * when a car is declared New and Upgrade Package Selection is Assurance Premier(PREM_PAK)
 * Upgrade package selection user will make after landing on Coverage
 * then Loan/Lease/Gap coverage is included
 *//*
function showHideLoanLeaseIncluded(upgradePackageId){
	//LOAN_ALA_Included_: shows "Included"
	//LOAN_ALA_Unavailable_: shows "Unavailable"
	//LOAN_ALA_Select_: shows TL dropdown -> non-sf, wrapped with selectBoxIt
	//LOAN_ALA_limit_: actual sf limit
	var strIndex = parseOffIndex(upgradePackageId);;
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();

	if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == 'PREM_PAK')){
		// PPA and Premiere -> show new car as Included
		$('input[id^=LOAN_ALA_Included_]').each(function(){
			strIndex = parseOffIndex(this.id);
			$('#LOAN_ALA_Select_' + strIndex).val('').addClass('hidden').trigger(changeSelectBoxIt);
			$('#LOAN_ALA_Unavailable_' + strIndex).addClass('hidden');
			$('#LOAN_ALA_limit_' + strIndex).val('');
			$('#' + this.id).removeClass('hidden');
		});
	}else{
		// re-set vehicle by vehicle
		loanLeaseAll();
	}
}

function newCarAll(){
	$('select[id^=NCR_ALA_Select_]').each(function(){
		newCar(this);
	});
}

function newCar(car){
	//Show New Car per vehicle based on
	// 1. Vehicle > 2 model years
	// 2. Vehicle Leased
	// 3. Has Comp and Coll or Lmt Coll
	// 4. Package Selection: not Premier

	var strIndex = parseOffIndex(car.id);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	var newValue = '';

	if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == ASSURANCE_PREMIERE)){
		//Whole row already shown as included
	}else if(newCarEligible(strIndex)){
		// show drop down for this vehicle
		$('#NCR_ALA_Included_' + strIndex).addClass('hidden');
		$('#NCR_ALA_Unavailable_' + strIndex).addClass('hidden');
		newValue = $('#NCR_ALA_limit_' + strIndex).val();
		$('#NCR_ALA_Select_' + strIndex).removeClass('hidden').val(newValue).trigger(changeSelectBoxIt);
	}else{
		// show "Unavailable" for this vehicle NCR_ALA_Unavailable_
		$('#NCR_ALA_Included_' + strIndex).addClass('hidden');
		newValue = '';
		$('#NCR_ALA_Select_' + strIndex).addClass('hidden').val(newValue).trigger(changeSelectBoxIt);
		$('#NCR_ALA_Unavailable_' + strIndex).removeClass('hidden');
		$('#NCR_ALA_limit_' + strIndex).val(newValue);
	}
}

*//**
 * check to see if new Car is Eligible
 * @param strIndex
 * @returns {Boolean}
 *//*
function newCarEligible(strIndex){
	var intCurrentYear = parseInt($('#currentYear').val());
	var intModelYear = parseInt($('#modelYear_' + strIndex).val());
	var intModelAge = intCurrentYear - intModelYear;
	if (!isNumber(intModelAge)){
		intModelAge = 999;
	}
	var vehicleLeased = $('#vehicleLeased_' + strIndex).val();
	var vehicleUsed = $('#vehicleUsed_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	var strCOMP = $('#COMP_' + strIndex).val();
	var strCOLL = $('#COLL_' + strIndex).val();
	var vehicleType = $('#vehTypeCd_'+strIndex).val();
	var strLTMCOLL = '';   //$('#LTMCOLL_' + strIndex).val();
	if (strCOMP == 'No Coverage'){
		strCOMP = '';
	}
	if (strCOLL == 'No Coverage'){
		strCOLL = '';
	}
	if (strLTMCOLL == 'No Coverage'){
		strLTMCOLL = '';
	}

	if (intModelAge <= 2 && vehicleType == 'PPA' &&
		strUpgradePackage != 'PREM_PAK' &&	vehicleLeased == 'false' 
		&& vehicleUsed == 'false' &&	strCOMP.length > 0 &&	strCOLL.length > 0 ){
		return true;
	}else{
		return false;
	}

}

function loanLeaseAll(){

	$('select[id^=LOAN_ALA_Select_]').each(function(){
		loanLease(this);
	});

}

function loanLease(loalLease){
	//LOAN_ALA_Included_: shows "Included"
	//LOAN_ALA_Unavailable_: shows "Unavailable"
	//LOAN_ALA_Select_: shows TL dropdown -> non-sf, wrapped with selectBoxIt
	//LOAN_ALA_limit_: actual sf limit
	//Show New Car per vehicle based on
	// 1. Vehicle > 5 model years
	// 2. Has Comp and Coll or Lmt Coll
	// 3. Package Selection: not Premier

	var strIndex = parseOffIndex(loalLease.id);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	var newValue = '';

	if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == "PREM_PAK")){
		//Whole row already shown as included
	}else if(loanLeaseEligible(strIndex)){
		// show drop down for this vehicle
		$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
		$('#LOAN_ALA_Unavailable_' + strIndex).addClass('hidden');
		newValue = $('#LOAN_ALA_limit_' + strIndex).val();
		$('#LOAN_ALA_Select_' + strIndex).removeClass('hidden').val(newValue).trigger(changeSelectBoxIt);
	}else{
		// show "Unavailable" for this vehicle NCR_ALA_Unavailable_
		$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
		newValue = '';
		$('#LOAN_ALA_Select_' + strIndex).addClass('hidden').val(newValue).trigger(changeSelectBoxIt);
		$('#LOAN_ALA_Unavailable_' + strIndex).removeClass('hidden');
		$('#LOAN_ALA_limit_' + strIndex).val(newValue);
	}

}

function setLoanLease(LoanLease_Select){

	var strIndex;

	//updates Loan Lease Limit sf hidden var with just selected value from non-sf dropdown
	strIndex = parseOffIndex(LoanLease_Select.id);
	$('#LOAN_ALA_limit_' + strIndex).val(LoanLease_Select.value);

}

function loanLeaseAll(){

	$('select[id^=LOAN_ALA_Select_]').each(function(){
		loanLease(this);
	});

}

function loanLease(loalLease){
	//LOAN_ALA_Included_: shows "Included"
	//LOAN_ALA_Unavailable_: shows "Unavailable"
	//LOAN_ALA_Select_: shows TL dropdown -> non-sf, wrapped with selectBoxIt
	//LOAN_ALA_limit_: actual sf limit
	//Show New Car per vehicle based on
	// 1. Vehicle > 5 model years
	// 2. Has Comp and Coll or Lmt Coll
	// 3. Package Selection: not Premier

	var strIndex = parseOffIndex(loalLease.id);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	var newValue = '';

	if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == "PREM_PAK")){
		//Whole row already shown as included
	}else if(loanLeaseEligible(strIndex)){
		// show drop down for this vehicle
		$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
		$('#LOAN_ALA_Unavailable_' + strIndex).addClass('hidden');
		newValue = $('#LOAN_ALA_limit_' + strIndex).val();
		$('#LOAN_ALA_Select_' + strIndex).removeClass('hidden').val(newValue).trigger(changeSelectBoxIt);
	}else{
		// show "Unavailable" for this vehicle NCR_ALA_Unavailable_
		$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
		newValue = '';
		$('#LOAN_ALA_Select_' + strIndex).addClass('hidden').val(newValue).trigger(changeSelectBoxIt);
		$('#LOAN_ALA_Unavailable_' + strIndex).removeClass('hidden');
		$('#LOAN_ALA_limit_' + strIndex).val(newValue);
	}

}

function loanLeaseEligible(strIndex){
	var intCurrentYear = parseInt($('#currentYear').val());
	var intModelYear = parseInt($('#modelYear_' + strIndex).val());
	var intModelAge = intCurrentYear - intModelYear;
	var vehicleType = $('#vehTypeCd_'+strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();

	if (!isNumber(intModelAge)){
		intModelAge = 999;
	}
	var strCOMP = $('#COMP_' + strIndex).val();
	var strCOLL = $('#COLL_' + strIndex).val();
	var strLTMCOLL = '';   //$('#LTMCOLL_' + strIndex).val();
	if (strCOMP == 'No Coverage'){
		strCOMP = '';
	}
	if (strCOLL == 'No Coverage'){
		strCOLL = '';
	}
	if (strLTMCOLL == 'No Coverage'){
		strLTMCOLL = '';
	}

	if (vehicleType == 'PPA' &&
		strUpgradePackage != 'PREM_PAK' &&
		intModelAge <= 5 &&
		strCOMP.length > 0 &&
		(strCOLL.length > 0 ||
		 strLTMCOLL.length > 0)
		){
		return true;
	}else{
		return false;
	}
}

function extraPIPSelected(){

	var blnExtraPIPSelected = false;

	// do not fire any edit events during this logic
	blnTriggerEdits = false;

 	$('select[id^=EXTRA_PIP_LIMIT]').each(function(){
		//35878-Coverages- If select No extra PIP - The Extra PIP applies still displays and is required, and it should NOT display
 		if (this.value != '' && this.value != 'No Extra PIP Option'){
 			blnExtraPIPSelected = true;
		}
	});
	if(!blnExtraPIPSelected){
		$('.Extra_PIP_Applies').addClass('hidden');
		//$('#ExtraPIPApplies_Error').addClass('hidden');
		$('#ExtraPIPApplies_Error').addClass('hidden');
		$('#ExtraPIPApplies_Error_Header').addClass('hidden');
		$('select[id^=ExtraPIPApplies_]').val('');

	}else if(isAnyCarLikeVehicle){
		$('.Extra_PIP_Applies').removeClass('hidden');
		//$('#ExtraPIPApplies_Error').removeClass('hidden');
		$('#ExtraPIPApplies_Error').removeClass('hidden');
		$('#ExtraPIPApplies_Error_Header').removeClass('hidden');
	}

	// turn edit events back on
	blnTriggerEdits = true;
}

function isAnyCarLikeVehicle(){
	var blnCarLikeVehicle = false;
	$('input[id^=vehTypeCd_]').each(function() {
		if(isCarLikeVehicle(this.value)){
			blnCarLikeVehicle = true;
		}
	});
	return blnCarLikeVehicle;
}

function isCarLikeVehicle(strVehType){

	var blnCarLikeVehicle = false;
	// car like Vehicle Types
	if (strVehType == "PP Auto" ||  strVehType == PRIVATE_PASSENGER_CD || strVehType == ANTIQUE_CD || strVehType == CLASSIC_AUTO || strVehType == MOTOR_HOME_CD){
		blnCarLikeVehicle = true;
	}
	return blnCarLikeVehicle;
}

function showOrHideHtml(strElm, strVal) {
	if (strVal == 'show') {

		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).removeClass("hidden");
			triggerChangeEvent($(strElm));

		} else {
			$(strElm).css('display', 'block');
		}
	}
	else {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).addClass("hidden");
			triggerChangeEvent($(strElm));
		} else {
			$(strElm).css('display', 'none');
		}
	}
}

function triggerChangeEvent(strElm) {
	strElm.trigger("changeSelectBoxIt");
}

function getVehID(strId){

	var n = strId.lastIndexOf("_");
	var vehID = strId.substring(n+1);
	return vehID;

}

function highlightAndFade(el) {
	var strAnimateId = '';
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	//For required and optional fields
	// pretend focusd to remove background / watermark
	if ($(el).hasClass("required") || $(el).hasClass("optional")){
		$(el).trigger('focus');
	}
	if (el.type == 'select-one'){
		$(el).addClass('autoChange').trigger(changeSelectBoxIt);
		setTimeout(function(){
			//delayedWhite(el.id);
			$('#' + el.id).removeClass('autoChange');
			$('#' + el.id).trigger(changeSelectBoxIt);
		}, 500);
	}else{
		$(el).animate({backgroundColor:"yellow"}, 500);
		$(el).animate({backgroundColor:"white"}, 1000);
	}
	//show yellow background for .5 seconds
	//For required and optioanl fields
	// pretend to leave field to reset background / watermark
	if ($(el).hasClass("required") || $(el).hasClass("optional")){
		$(el).trigger('blur');
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

function setCoverageId (){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	//if a new coverage, be sure coverageId is zero, not empty
    $(".coverageId").each(function() {
        if($.trim(this.value) == "") {
            this.value = '0';
        }
    });
	// turn edit events back on
	blnTriggerEdits = true;
}

function clearForm() {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	document.aiForm.name.value = '';
	document.aiForm.policyKey.value = '';
	// turn edit events back on
	blnTriggerEdits = true;
}

function handleSubmit() {
	setSeqNums();
}

function setSeqNums(){

	// do not fire any edit events during this logic
	blnTriggerEdits = false;

	// re-number vehicle seq num
	var seqNum = 1;
	$('#headerTable .vehicleSeqNum').each(function() {
		$(this).val(seqNum++);
	});
	// re-number coverage seq num
	seqNum = 1;
	$('.coverageSeqNum').each(function() {
		$(this).val(seqNum++);
	});

	// turn edit events back on
	blnTriggerEdits = true;
}

function bindCoverageColumns() {
	bindColumn('multiTable', null, null);
}

function bindColumn(tableClass, columnSelector, sAction) {

	var now = $.now();
	var last = now;

	var selector = '.' + tableClass;
	var columnPrefix = '';
	var swapSelector = '.swappableField';

	if (columnSelector != null) {
		selector += ' > tbody > tr';
		columnPrefix = ' > td:' + columnSelector + ' ';
		swapSelector = ' > ' + swapSelector + ':' + columnSelector + ' ';

		selector += columnPrefix;
	}
	var cols = $(selector);
	$('.clsDeleteVehicle', cols).click(function(){
		deleteVehicle(this);
	});
 }

var addDeleteCallback = function(row, addIt) {
	var headerBody = $('#rowHeaderTable > tbody');

	if (addIt) {
		addErrorRow(row, headerBody, true);
	} else {
		removeErrorRow(row, headerBody);
	}
}

function addErrorRow(errorRow, headerBody, alignRows) {
	var $errorRow = $(errorRow);
	var rowIndex = $errorRow.index();
	var rowHtml = '<tr id="' + $errorRow.attr("id") + '_Header"><td></td></tr>';
	var headerRow = $('tr:nth-child(' + rowIndex + ')', headerBody);
	headerRow.after(rowHtml);
	if (alignRows) {
		alignTableRow($errorRow, headerRow.next());
	}
}

function removeErrorRow(errorRow, headerBody) {
	var rowIndex = $(errorRow).index()+1;
	$('tr:nth-child(' + rowIndex + ')', headerBody).remove();
}


//tab-out edit functions for this page
var strErrorSingleColRow = '<tr id="sampleErrorRow"><td></td><td class= "floatLeft" id="Error_Col"></td></tr>';
var strErrorMultiColRow;



// new functions for sliding columns
var COVERAGES_PER_PAGE = 3;
function slideCoverageStart(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideToStart(event, $('#slidingFrameHeadId'), $('#firstCoverage'));
	$('#firstCoverage').val(firstCoverageVal);
	slideToStart(event, $('#slidingFrameId'), $('#firstCoverage'));
	//updateCoverageScrollPanel( $(event.target).parent());
	updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageLeft(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideTableLeft(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), 1);
	$('#firstCoverage').val(firstCoverageVal);
	slideTableLeft(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), 1);
	//updateCoverageScrollPanel( $(event.target).parent());
	updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageRight(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideTableRight(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), COVERAGES_PER_PAGE, 1);
	$('#firstCoverage').val(firstCoverageVal);
	slideTableRight(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), COVERAGES_PER_PAGE, 1);

	//updateCoverageScrollPanel( $(event.target).parent());
	updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageEnd(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideToEnd(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);
	$('#firstCoverage').val(firstCoverageVal);
	slideToEnd(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);
	//updateCoverageScrollPanel( $(event.target).parent());
	updateCoverageScrollPanel(SCROLL_PANEL);

}

function deleteVehicle(deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);

	// Column 1 is the special initial column
	if (parseInt($('#coverageCount').val()) == 1) {
		confirmMessageWithTitle("Invalid Vehicle Delete", "You can't delete the last vehicle");
		return;
	} else {
		var deletedId = $('#vehicleId_' + columnIndex, deleteColumn).val();

		deleteScrollableColumns(columnIndex, 'multiTable',
				$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);

		recordDeletion('deletedVehicles', deletedId);

		bindColumn('multiTable', 'gt(' + (columnIndex - 1) + ')');
		 questionDeleteMessageWithTitle("Confirm Vehicle Delete", "Are you sure you want to delete this vehicle?", columnIndex, deleteColumn);
			
	}
	
}

function questionDeleteMessageWithTitle(messageTitle, messageText ,columnIndex, deleteColumn){
	
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

		deleteVehicleColumn(columnIndex, deleteColumn);

		return true;
	});

	$('#question #no').unbind('click');

	$('#question #no').click(function() {
		$.unblockUI();
		return false;
	}); 
	
	$('.closeModal').unbind('click');
	
	$('.closeModal').click(function() {
		$.unblockUI();
		return false;
	});
}

function deleteVehicleColumn(columnIndex, deleteColumn) {
	
	var deletedId = $('#vehicleId_' + columnIndex, deleteColumn).val();

	deleteScrollableColumns(columnIndex, 'multiTable',
			$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);

	recordDeletion('deletedVehicles', deletedId);

	//IF the first Column being deleted. then columnSelector for BindColumn should not be td:gt(-1);
	var columnSelector =  'gt(' + (parseInt(columnIndex) - 1) + ')';
	
	if(parseInt(columnIndex) == 0) {
		columnSelector = null ;
	}

	bindColumn('multiTable', columnSelector);
	
	updateCoverageScrollPanel(SCROLL_PANEL);
	
	updateAllCoverageHeaderInfo();
	
	alignRows();
}

function recordDeletion(deletionTag, deletedId) {
	if (typeof deletedId != "undefined") {
		var vehicleVars = $('#hiddenCoverageVariables');
		var deletedItems = $('.' + deletionTag, vehicleVars);
		if (deletedItems.length == 0) {
			vehicleVars.append('<input id="' + deletionTag + '_0" class="' + deletionTag + '" type="hidden" value="" name="' + deletionTag + '[0]">');
		} else {
			vehicleVars.append($(deletedItems[0]).replaceIndices(deletedItems.length));
		}
		deletedItems = $('.' + deletionTag + ':last', vehicleVars);
		deletedItems.val('' + deletedId);
	}
}

function updateAllCoverageHeaderInfo(){
	$('.coverageHeaderInfo').each(function(){
		updateCoverageHeaderInfo(parseOffIndex(this.id));
	});
}

function updateCoverageHeaderInfo(vehicleIndex){
	var yearValue = $("#modelYear_" + vehicleIndex).val();	
	var makeValue = $("#make_" + vehicleIndex).val();
	var modelValue = $("#model_" + vehicleIndex).val();
	$("#coverageHeaderInfo_" + vehicleIndex).html("#" + (vehicleIndex + 1) + "-" + yearValue + " "+ makeValue + " "+ modelValue);
}

function alignRows() {
	//alignRowsById('rowHeaderTable', 'mainContentTable');
	alignTableRows('#rowHeaderTable > tbody > tr', '#mainContentTable > tbody > tr');
}

function alignTableRows(selector1, selector2) {
	var headerRows = $(selector1);
	var contentRows = $(selector2);

	var rowCount = headerRows.length;
	if (headerRows != null && contentRows != null &&
			rowCount > 0 && contentRows.length == rowCount) {
		for (var i = 0; i < rowCount; i++ ) {
			alignTableRow($(headerRows[i]), $(contentRows[i]));
		}
	}
}

function alignTableRow(row1, row2) {

	var row1Height = row1.css('height').toLowerCase().replace("px", "");
	var row2Height = row2.css('height').toLowerCase().replace("px", "");

	if (parseInt(row1Height) > parseInt(row2Height)) {
		// check if row2 is a error row
		if (row2.hasClass("errorRow")) {
			//set error header row  equal to error data row
			row1.css('height', (row2Height + 'px'));
		} else {
			row2.css('height', (row1Height + 'px'));
		}

	} else if (parseInt(row2Height) > parseInt(row1Height)) {
		row1.css('height', (row2Height + 'px'));
	}
}


// End new functions for sliding columns

var fieldIds =
{
	"coverageVehicle.BI":"BI",
	"coverageVehicle.PD":"PD",
	"coverageVehicle.UMUIMBI":"UMUIMBI",
	"coverageVehicle.UMUIMPD":"UMUIMPD",
	"coverageVehicle.PRINC_PIP":"PRINC_PIP",
	"":"PIP_Limit",
	"":"PIP_Deduct",
	"":"ExtraPIP",
	"":"ExtMed",
	"coverageVehicle.TORT":"TORT",
	"coverageVehicle.COMP":"COMP",
	"":"COMP_Glass",
	"coverageVehicle.COLL":"COLL",
	"":"WaiverofDeductible",
	"coverageVehicle.TL":"TL",
	"coverageVehicle.RR":"RR"
};

var fieldIdToModelErrorRow =
{"defaultSingle":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "defaultMulti":"",
 "pageErrorData.priorCarrierInsCdName":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>"};



*/