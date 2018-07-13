jQuery(document).ready(function() {
	
	window.WAIVER_CUTOFF_DATE_CTNH="02/12/2016";
	
	errorMessages = jQuery.parseJSON($("#errorMessages").val());

	if($('#UPGR_PAK_Error').css('display')!=null){
		$('#upgradePackErrorExists').val('true');
	}
	
		 
	 var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitCoverages").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/coverages';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	 //Commenting out entire block for > 4 as its causing freeze in coverage tab in IE
	// IE8 Page load Performance fix
/*	if($('#coverageCount').val() != '' && parseInt($('#coverageCount').val()) > 4){
		var colCount = parseInt($('#coverageCount').val()) - 1;
		var showProcessEditMessage = false;
		if($('#processEditMessage').css('display')=='block'){
			$('#processEditMessage').modal('hide');
			showProcessEditMessage = true;
		}
		// Block the UI
		blockUser();
		
		// Give IE some time to load the select boxes if we have more than 4 columns
		setTimeout(function() {
			$('#mainContentTable').find('tr td select').each(function() {
				$(this).data('OriginalValue', $(this).val());
				$(this).chosen ( 
				{     
					  search_contains:true
				      //, disable_search_threshold: 4
			    }).data('chosen');
			});
		}, 2000);
		// All columns are loaded. Unblock the ui and load the rest of the page
		setTimeout(function(){
			$.unblockUI(); 
			// Load chosen handlers and behavior
			$('#mainContentTable').find('tr td select').each(function() {
				$(this).data('OriginalValue', $(this).val());
				addHandlersToChosen(this.id);
			});
			if(showProcessEditMessage){
				$('#processEditMessage').modal('show');
				showProcessEditMessage = false;
			}
			// Continue to load rest of the page
			loadCoverageTab();			
		}, 1000*colCount);
		
	} else {*/
		$('select').each(function(){
		//$('select:not(select[multiple])').each(function(){
			// store original value 
			$(this).data('OriginalValue', $(this).val());
			addChosen(this.id);
		});
		// Load the rest of the page
		loadCoverageTab();
	//}
	
	$(".upgradePackHelpClass").click(function(e){
		  $("#upgradePackHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	if (!isEndorsement()) {
		bindViewPrefillDataLink();
	}
	
	$(".standardPackageHelpClass").click(function(e){
		  $("#standardPackageHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	$(".rentersEndorsementHelpClass").click(function(e){
		  $("#rentersEndorsementHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	//TD 70770 fix - coverage page navigation/gui issue
	if($('#formTop .aiAlert').length > 0) {
		$('.coveragePageHeader').attr("style", "margin-top: -53px;");
		$('#pageAlertMessage').attr("style", "height: 35px;");
	}
	initialFormLoadProcessing();
});

var tabIndex = 101;

function loadCoverageTab() {

	// Adjust margins if error is displayed
	if($('#pageAlertMessage').length > 0) {
		$('.coveragePageHeader').css('margin-top', -43);
		$('#slidingFrameId').css('margin-top', -10);
		$('#rowHeaderTableContainer').css('margin-top', 10);
		$('#pageAlertMessage').css("width","440px");
		$('#pageAlertMessage').css("height","45px");
	}
	//scrolling function routine
	updateCoverageScrollPanel("#scrollPanel");
	updateAllCoverageHeaderInfo();
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

	// Focus on dropdowns (columns 4 and above) when tabbing (or shift tabbing) to them -- Changed to updated tab behavior

		// Scroll to top after tabbing out of last field in a column
		$("div.chosen-container[id*=ACC_FORG]").keydown(function(e){
			if(e.shiftKey == false && e.keyCode == 9) {
				$(window).scrollTop(0);
				var upgrPakColumnId = $(this).attr('id');
				var currentColumn = Number(upgrPakColumnId.charAt(9,10));
				if (currentColumn >1){
					$('#firstVehicle').val(currentColumn-1);
					$("#rightScrollBtn").trigger('click');
				}
			}
		});
		
		//remove after migration to modern browsers
		$('.colInput,.chosen-single').keyup(function(e){
			if(e.shiftKey == true && e.keyCode == 9) {
				$(window).scrollTop($(this).offset().top - $('#rowHeaderTableContainer').offset().top - 45);
			}
			validateLastInput('lastInputLeft');
		});
		//end
		
		// Scroll to bottom after tabbing into last field in a column
		$("div.chosen-container[id*=ACC_FORG]").keyup(function(e){
		    if(e.shiftKey == true && e.keyCode == 9) {
		        $(window).scrollTop($('#ACC_FORG_0').offset().top);
		        if($("#leftScrollBtn").length == 1) {
		        	var checkboxId = $(this).attr('id') ? $(this).attr('id') : '';
		        	var scrollPosHtml = $.trim($('#scrollPos').html());
		        	var currentColumn = Number(checkboxId.charAt(checkboxId.length-8));
		        	firstColumn = Number(scrollPosHtml.charAt(9));
		        	if(scrollPosHtml.charAt(13) == " ") {
	    				lastColumn = Number(scrollPosHtml.charAt(13));
	    				columnCount = Number(scrollPosHtml.substring(18));
	    			} else { 
	    				lastColumn = Number(scrollPosHtml.substring(13, 15));
	    				columnCount = Number(scrollPosHtml.substring(19));
	    			}
		        	if(checkboxId && checkboxId != '' && currentColumn < firstColumn) {
		        		// Scroll right
			        	$("#leftScrollBtn").trigger('click');
		        		// Focus on the first field of next column
		        		setFocus('ACC_FORG_' + currentColumn);
		        		e.preventDefault();
		        	}
		        }
		    }
		});
		
	//Added for Endorsement Vehicle Eligibility 47051
	$(document).on("click", ".returnEndr",function(e){
		//extra check to make sure it is only ENDR
		var policySourceCd = $('#policySourceCd').val();
		if (policySourceCd == 'ENDORSEMENT') {
			//make call to delete pending amendment - only for prime end
			$('#endorsementVehicleEligibilityErrorsModal').modal('hide');
			deletePendingAmendment(redirectLandingPage);
		}
	});
	
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

   if($('#isMaipPolicy').val() == "false"){
	   setPackageIncluded();
   }
   
   if ( $('#readOnlyMode').val() != 'Yes') {bindTabOutEdits();}
   
   if (document.aiForm.payPlanChangeInd.value=="Yes") {
		$('.payPlanMsg').show();
   } else {
		$('.payPlanMsg').hide();
   }
   
   if($('#payPlanChangeIndBind').val()=='Yes'){
		$("#payPlanChangeInd").val("Yes");
		$('.payPlanMsg').show();
		$('.clsPremiumAmtDisplay ').each(function(){$(this).text('');});
		resetPremium($('#ratedInd').val(),$('#premAmt').val());
   }

   //set vehicle seq nums and coverage seq nums
   setSeqNums();

   // default
   updateNewVehCovItem('#ESS_PAK_limit_0', true);

   //Hide not applicable coverages for non-PPA type vehicles.
   hideCoveragesWhereNotApplicable();
   
   hideShowRows();

   // set multi-field model error row value
   fieldIdToModelErrorRow['defaultMulti'] =  $('#defaultMulti').outerHTML();
   
   bindCoverageColumns();
   
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
   
   // Align the row heights in the row header table and the main content table
   alignRows();

   floodUMLimitsOnPageLoad();
   floodUMUIMLimitsOnPageLoad();	//PA_AUTO
   floodMALimitsOnPageLoad();
   
   //set tab index for all coverage elements	
   setTabIndex("1", $('#coverageCount').val());
   
   /* tabIndex fix for logo - Remove this block when logo taxIndex is corrected for all pages via pure html */
   $('#logo').parent().attr('tabIndex', 6);
   $('#pageAlertMessage #openErrorModal').attr('tabIndex', 101);

   /* Leave space for fixed Compelte "so & so" application message */
	if($('#completeApplicationAlert').length == 1 && $('#pageAlertMessage').length == 0) {
		$('#slidingFrameId').css('margin-top', '20px');
		$('#rowHeaderTableContainer').css('margin-top', '41px');
		$('.coveragePageHeader').css('margin-top', '-10px');
	}

   hidePremiumsForInactiveRate();
   setFocusToCoverageField();
   showReorderErrorPopups(); 
   if($('#stateCd').val() == 'MA'){
	   markFilednotRequiredForMA();
   }
   disableOrEnableElementsForReadonlyQuote();
     //********** No code allowed beyond this line. 
   //**********Include your future code above disableOrEnableElementsForReadonlyQuote() call
   
   // TNC requirement
   if($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'PA') {
	   $('.clsTNCCVG').change(function() {
		   resetPremium($('#ratedInd').val(),$('#premAmt').val());
		   var strIndex = parseOffIndex(this.id);
		   if ($(this).val() == 'D') {			   
			   showClearInLineErrorMsgsWithMap('TNC_CVG_' + strIndex, 'tnccvg.browser.inline.info', fieldIdToModelErrorRow['defaultMulti'],
					 strIndex, errorMessages, addDeleteCallback);
			   
			   showClearInLineErrorMsgsWithMap('BI_' + strIndex, '', fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
			   showClearInLineErrorMsgsWithMap('PD_' + strIndex, '', fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		   } else {
			   showClearInLineErrorMsgsWithMap('TNC_CVG_' + strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
						 strIndex, errorMessages, addDeleteCallback);  
		   }
	   });
	   
	   if (isEndorsement()) {
		   $('.clsTNCCVG').each(function() {
			   var strIndex = parseOffIndex(this.id);
			   if ($('#endorsementVehicleAddedInd_' + strIndex).val() != 'Yes' && $('#endorsementVehicleReplacedInd_' + strIndex).val() != 'Yes') {
				   $(this).prop('disabled', true).trigger('chosen:updated');
			   }		   
		   });
	   }
   }
   
}

//55641
function markFilednotRequiredForMA(){
	$('select.clsNcr,select.clsLoan').each(function(){
		$(this).removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
	});
}

//TODO: move this to common place and return the last tab index
function setTabIndex(startColumn, endColumn) {
	startColumn = parseInt(startColumn);
	endColumn = parseInt(endColumn);
	for (var i = startColumn; i <= endColumn; i++) {
		// Set tab index for delete icons (They are named delete_vehicle_n)
		 $('#delete_vehicle_'+(i-1)).attr('tabindex', tabIndex++);
		 var tabOrderElements = $("#mainContentTable > tbody > tr > td:nth-child(" + (i) + ") .tabOrder");
		 tabOrderElements.each(function() {
			 if($(this).is('select:not(select[multiple])')){
				 var chosenContainer = $(this).next();// this will be the container for the dropdown
				 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 } else {
				 $(this).attr("tabindex", tabIndex++);		
			 }
		  });
	}
}

function setPackageIncluded(){	
	var cols = '.multiTable';
	//52347 - AARP affinity & AARP Assurance Pkg lost when opened for flat Endorsement
	if ($('#AARP_PAK_coverageCd')!=null && $('#AARP_PAK_coverageCd').length>0) {
		$('.clsDefPak',cols).val('AARP_PAK').trigger('chosen:updated');
	} else if ($('#ASSURE_PAK_coverageCd')!=null && $('#ASSURE_PAK_coverageCd').length>0) {
		$('.clsDefPak',cols).val('ASSURE_PAK').trigger('chosen:updated');
	}
	else if ($('#NEP_PAK_coverageCd')!=null && $('#NEP_PAK_coverageCd').length>0) {
		$('.clsDefPak',cols).val('NEP_PAK').trigger('chosen:updated');
	}else if ($('#PRU_PAK_coverageCd')!=null && $('#PRU_PAK_coverageCd').length>0) {
		$('.clsDefPak',cols).val('PRU_PAK').trigger('chosen:updated');
	}else {
		$('.clsDefPak',cols).val('ESS_PAK').trigger('chosen:updated');
	}
}

var SCROLL_PANEL = '#scrollPanel';

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
	//Set focus to first data capture field
	setCoverageId();
	if($('#stateCd').val() != 'MA'){
		updateNewVehCov();
	}
	$('#PS_limit').attr('disabled', 'disabled');
}

function bindTabOutEditsForCommon(){
	var cols = '.multiTable';
	
	$(document).on("change" , "select.clsCOMP, .multiTable",function(event, result){
		clearPremium();
		validateRequiredField(this);
		validateCOMPField(this);
		showHideCompGlass();
		loanLease(this);
		newCar(this);
		alignRows();
	});
	$(document).on("change","select.clsCompGlass, .multiTable", function(event, result){
	
		validateRequiredField(this);
		alignRows();
	});
	
	if(isEndorsement()){
		$('select.clsCompOnly',cols).on("change",function(event, result){
			validateCOMPONLY(this);
			validateCOMPField(this);	
			alignRows();
		});
	}

	$('select.clsColl',cols).on("change",function(event, result){
		validateRequiredField(this);
		validateCOLLField(this);
		validateCOMPField(this);
		waiveDeductibleThisCol(this);
		validateLimitColl(this);
		loanLease(this);
		newCar(this);
		alignRows();
	});

	$('select.clsTL',cols).on("change",function(event, result){
		validateRequiredField(this);
		validateCOMPField(this);
		alignRows();
	});

	$('select.clsRR',cols).on('change',function(event, result){
		validateRequiredField(this);
		validateCOMPField(this);
		alignRows();
	});

	$('select.clsNcr',cols).on('change',function(event, result){
		setNewCar(this);
		alignRows();
	});

	$('select.clsLoan',cols).on('change',function(event, result){
		setLoanLease(this);
		alignRows();
	});

	$('select.clsUpgrPak',cols).on('change',function(event, result){	
		if(isEndorsement()){
			validateUpgrPak(this);
		}
		floodPolicyCoverages(this,false);
		//54681 - Changing upgrade package to "Assurance Premiere" during midterm will not change towing labor, new car and loan lease coverages. 
		if(!isEndorsement() || $('#upgradePackErrorExists').val()!='true' || $(this).val() !='PREM_PAK'){
			if($('#uwCompanyCd').val() !='ALN_TEACH'){
				showHideTLIncluded(this.id,false);
			} 			
			loanLeaseAll(); //Need to update all vehicles as UPGR_PAK is common
			newCarAll(); //Need to update all vehicles as UPGR_PAK is common
		}
		if(!isEndorsement() || !($(this).val() =='PREM_PAK' && isPolicyMidterm())){			 
		    $('#upgradePackErrorExists').val('false');
		}
		alignRows();
	});
	

	$('select.clsAccForg',cols).on('change',function(event, result){	
		floodPolicyCoverages(this,false);
		validateRequiredField(this);
		alignRows();
	});
	
	$('select.clsCOMP,select.clsCompGlass,select.clsColl,select.clsTL,select.clsRR,select.clsAccForg',cols).on({
		blur: function(){
			validateRequiredField(this);	
		}
	});

	$('select.clsWaiverofDeductible',cols).on('change',function(event, result){
		validateRequiredField(this);
		alignRows();
	});
	
	$('select.covRentEndr',cols).on('change',function(event, result){
		validateRentCovField(this);
		//floodLiab(this);
		alignRows();
	});
}

function bindTabOutEditsForNJ(){
	var cols = '.multiTable';
	
	//Changing all "change" events to "live". Deleting first vehicle is disabling all "on-change" handlers.
	$('select.clsBILimit',cols).on('change',function(event, result){
		//TNC Requirement
		if(!validateBI_TNC_MIN_LIMITS(this)){
		validateRequiredField(this);
		}	
		
		floodBI(this);
		validateUMUIMBI(this);
		//50763: When CSL is selected, user is forced to enter Property Damage. This limit should flood automatically.
		if(this.value.indexOf('CSL')!=-1){
			floodBItoPD(this);
		} else{
			if(!validatePD_TNC_MIN_LIMITS(this)) {
			checkPDLimitForBISelected(this);	
		}
		}
		alignRows();
	});

	$('select.clsPDLimit' ,cols).on('change',function(event, result){
		floodBI(this);
		if(!validatePD_TNC_MIN_LIMITS(this)) {
		validateRequiredField(this);
		validateUMUIMPD(this);
		checkPDLimitForBISelected(this);
		}
		alignRows();
	});
	
	$('select.clsEXTRA_PIP_Limit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		extraPIPSelected();
		checkExtraPipForPipValue(this);
		alignRows();
	});

	$('select.clsPIP_Limit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select.clsPIP_Deductible',cols).on('change',function(event, result){
		validateRequiredField(this);
		//52431 - coverage PIP deductible applies to field should not display when PIP deductible = 'None'
		showHidePIPDedAppliesTo(this);
		floodLiab(this);
		alignRows();
	});
	
	$('select.clsUMPDLimit',cols).on('change',function(event, result){
		floodBI(this);
		validateUMUIMPD(this);
		alignRows();
	});
	
	$('select.clsUMUIMLimit',cols).on('change',function(event, result){
		floodBI(this);
		validateUMUIMBI(this);
		alignRows();
	});
	
	$('select.clsPRINC_PIPLimit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		hideShowHealthCareProvider(true);
		checkExtraPipForPipValue(this);
		alignRows();
	});
	
	$('select.clsPRINC_PIP_HCPNAMELimit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		hideShowHealthCareProvider(true);
		alignRows();
	});

	$('select.clsExtraPIPApplies',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select.clsEMP',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select.clsTORT',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});
	
	$('.clsHCProviderName',cols).on('blur',function(event, result){
		validateRequiredField(this);
		alignRows();
	});

	$('.clsHCProviderNumber',cols).on('blur',function(event, result){
		validateRequiredField(this);
		alignRows();
	});
	
	$('.clsHCProviderName',cols).on('change',function(event, result){
		var isEligible;
		var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
		if(nj_HCProviderEffdt == 'true'){
			isEligible = validateHCProviderName(this);	
			
			if(!isEligible){
				var PIPStr = "#PRINC_PIP_0";
				var PIPDDValue = $(PIPStr).val();
				var isMedical = PIPDDValue.includes("Medical");
				if(isMedical){
					$('#inEligiblePIP_Med').modal('show');
				}else{
					$('#inEligiblePIP_Full').modal('show');
				}
				
			}
		}		
		$('#HC_PROVIDER_NAME_limit').val(this.value);		
		floodLiab(this);
		alignRows();
	});

	$('.clsHCProviderNumber',cols).on('change',function(event, result){
		$('#HC_PROVIDER_NUMBER_limit').val(this.value);
		floodLiab(this);
		alignRows();
	});
	
	$(document).on("click", ".closeinEligible_PIPModal", function(){
		var modalID = this.parentElement.parentElement.id;
		var n = (modalID).lastIndexOf('_');
		var fullorMedical = modalID.substring(n+1,n.length);
		
		var newSelection='';
		if(fullorMedical == "Full"){
			newSelection='Primary Full PIP';
		}else{
			newSelection='Primary Medical Expense Only';
		}
		var hideHealthcarePName= true;
		$('#'+modalID).modal('hide');
		changePrimaryInsuranceProvider(newSelection,hideHealthcarePName);
	});
	$(document).on("click", ".closeinEligible_Sec_MedicalExpModal, .closeinEligible_Sec_PIPModal", function(){
		var modalID = this.parentElement.parentElement.id;
		var n = (modalID).lastIndexOf('_');
		var fullorMedical = modalID.substring(n+1,n.length);
		var newSelection='';		
		if(fullorMedical == "Full"){
			newSelection='Primary Full PIP';
		}else{
			newSelection='Primary Medical Expense Only';
		}
		
		var hideHealthcarePName= true;
		$('#'+modalID).modal('hide');
		changePrimaryInsuranceProvider(newSelection,hideHealthcarePName);
	});
	
}

//PA_AUTO
function bindTabOutEditsForPA(){
	var cols = '.multiTable';
	
	//Changing all "change" events to "live". Deleting first vehicle is disabling all "on-change" handlers.
	$('select.clsBILimit',cols).on('change',function(event, result){
		
		//TNC Requirement
		if(!validateBI_TNC_MIN_LIMITS(this)){
		validateRequiredField(this);
		}
		
		floodBIPA(this);
		validateUMBI(this);
		validateUIMBI(this);
		//50763: When CSL is selected, user is forced to enter Property Damage. This limit should flood automatically.
		if(this.value.indexOf('CSL')!=-1){
			floodBItoPD(this);
		} else{
			if(!validatePD_TNC_MIN_LIMITS(this)) {
			checkPDLimitForBISelected(this);	
		}
		}
		alignRows();
	});

	$('select.clsPDLimit',cols).on('change',function(event, result){
		floodBIPA(this);
		if(!validatePD_TNC_MIN_LIMITS(this)) {
		validateRequiredField(this);
		checkPDLimitForBISelected(this);
		}
		alignRows();
	});
	
	$('select.clsUMLimit',cols).on('change',function(event, result){
		floodBIPA(this);
		validateUMBI(this);
		UMBISelected();
		alignRows();
	});
	
	$('select.clsUMStacked',cols).on('change',function(event, result){
		floodBIPA(this);
		validateUMUIMStacked(this);
		alignRows();
	});
	
	$('select.clsUIMLimit',cols).on('change',function(event, result){
		floodBIPA(this);
		validateUIMBI(this);
		UIMBISelected();
		alignRows();
	});
	
	$('select.clsUIMStacked',cols).on('change',function(event, result){
		floodBIPA(this);
		validateUMUIMStacked(this);
		alignRows();
	});
	
	$('select.clsFPBP',cols).on('change',function(event, result){
		floodLiab(this);
		validateRequiredField(this);
		FPBPSelected();
		alignRows();
	});
	
	$('select.clsCFPB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		validateEMB(this);
		alignRows();
	});
	
	$('select.clsMB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		validateEMB(this);
		alignRows();
	});
	
	$('select.clsILB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});

	$('select.clsADB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});
	
	$('select.clsFEB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});
	
	$('select.clsEMB',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		validateEMB(this);
		alignRows();
	});

	$('select.clsTORT',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});
	
}

function bindTabOutEditsForMA(){
	var cols = '.multiTable';
	
	//Changing all "change" events to "live". Deleting first vehicle is disabling all "on-change" handlers.
	$('select.clsBILimit',cols).on('change',function(event, result){
		validateRequiredField(this);
		checkAndSetBI(this);
		alignRows();
	});

	$('select.clsPDLimit',cols).on('change',function(event, result){			
		var errorExists = validateRequiredField(this);	
		if(!validateMAPD_TNC_MIN_LIMITS(this)){	
			validateMultipleLimits($('select.clsPDLimit'),'PD','5,000',errorExists);
		}
		alignRows();
	});

	$('select.clsPIP_Limit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		alignRows();
	});
	
	$('select.clsPIP_Deductible',cols).on('change',function(event, result){
		var errorExists = validateRequiredField(this);
		floodNonMC(this);
		//54912 and 54867
		if ($('#stateCd').val()=='MA') {
			validateMCVehiclesMA(this,$('.clsPIP_Deductible'),'PIP_Deductible',errorExists);
		}else{
			validateMCVehicles(this,$('.clsPIP_Deductible'),'PIP_Deductible',errorExists);
		}
		//52431 - coverage PIP deductible applies to field should not display when PIP deductible = 'None'
		showHidePIPDedAppliesTo(this);
		alignRows();
	});
	
	$('select.clsPRINC_PIPLimit',cols).on('change',function(event, result){
		validateRequiredField(this);
		floodLiab(this);
		hideShowHealthCareProvider(true);
		checkExtraPipForPipValue(this);
		alignRows();
	});
	
	$('select.clsLmtd_Coll',cols).on('change',function(event, result){
		validateRequiredField(this);
		waiveDeductibleThisCol(this);
		validateLimitColl(this);
		alignRows();
	});	
	
	$('select.clsUM',cols).on('change',function(event, result){
		var errorExists = validateUMUIMOBI(this);
		validateMultipleLimits($('select.clsUM'),'UM','20,000/40,000',errorExists);
		alignRows();
	});
	
	//2.4 MA Liab
	$('select.clsMP',cols).on('change',function(event, result){
		clearPremium();
		var errorExists = validateRequiredField(this);
		floodNonMC(this);
		//54912
		if ($('#stateCd').val()=='MA') {
			validateMCVehiclesMA(this,$('.clsMP'),'MP', errorExists);
		}else{
			validateMCVehicles(this,$('.clsMP'),'MP', errorExists);
		}
		
		alignRows();
	});
	
	//clsOBI
	$('select.clsOBI',cols).on('change',function(event, result){
		//52015 - Uninsured Motorist has wrong default value
		checkAndSetUM(this);
		//52016 - Uninsured & Underinsured Motorist fields not following Default Requirements
		checkUMUIMOBI(this);
		//TNC requirements
		if(!validateOBI_TNC_MIN_LIMITS(this)){		
			var errorExists = validateUMUIMOBI(this);
			validateMultipleLimits($('select.clsOBI'),'OBI','20,000/40,000',errorExists);
		}
		showHideGuestCoverage();
		alignRows();
	});
	
	$('select.clsUIM',cols).on('change',function(event, result){
		var errorExists = validateUMUIMOBI(this);
		validateMultipleLimits($('select.clsUIM'),'UIM','20,000/40,000',errorExists);
		alignRows();
	});
	
	$('select.clsGC',cols).on('blur','change',function(event, result){
		validateRequiredField(this);
		validateGuestCoverage(this);
		showHideGuestCoverage();
		//ENDR guestCoverage handling
		if(isEndorsement()){
			strIndex = parseOffIndex(this.id);
			$('#GC_'+strIndex+'_vehicleInd').val($(this).val());
		}
		alignRows();		
	});
}


function bindTabOutEditsForNHCT(){
	var cols = '.multiTable';
	
	$('select.clsBILimit',cols).on('change',function(event, result){
		//TNC Requirement
		if(!validateBI_TNC_MIN_LIMITS(this)){
			validateRequiredField(this);
		}
		floodLiabNHCT(this);
		floodUMtoBI(this,'UM');
		//TNC requirements
		
		if(this.value.indexOf('CSL')!=-1){
			checkPDandUMLimitForBISelected(this);	
		}
		//additionalCheckUMLimitForBISelected(this);
		alignRows();
	});

	$('select.clsPDLimit',cols).on('change',function(event, result){
		floodLiabNHCT(this);
		//TNC Requirement
		if(!validatePD_TNC_MIN_LIMITS(this)){
			validateRequiredField(this);
			checkPDandUMLimitForBISelected(this);
		}		
		alignRows();
	});
	
	$('select.clsUM',cols).on('change',function(event, result){
		$('#UMUIM_coverageName_'+ parseOffIndex(this.id)).val($('#UMUIM_'+ parseOffIndex(this.id)+' option:selected').text());
		var errorExists = validateRequiredField(this);
		floodLiabNHCT(this);
		validateMCVehicles(this,$('.clsUM'),'UM',errorExists);
		//validateUMUIMOBI(this);
		if(STATE_NH == $('#stateCd').val()){
			floodUMtoBI(this,'BILimit');
		}
		//additionalCheckUMLimitForBISelected(this);
		checkPDandUMLimitForBISelected(this);
		additionalCheckUMLimitForBISelected(this);
		alignRows();
	});
	
	$('select.clsMP',cols).on('change',function(event, result){
		var strIndex = parseOffIndex(this.id);
		var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
		if(strVehicleType == 'PPA'){
			floodLiabNHCT(this);
		}		
		var errorExists = validateRequiredField(this);
		validateMCVehicles(this,$('.clsMP'),'MP',errorExists);				
		alignRows();
	});	
	
/*	$('select.clsBILimit,select.clsPDLimit',cols).on({
		blur: function(){
			validateRequiredField(this);	
		}
	});*/
	$('select.clsUM',cols).on({
		blur: function(){
			var errorExists = validateRequiredField(this);
			validateMCVehicles(this,$('.clsUM'),'UM',errorExists);			
		}
	});
}


//TNC requirement
function validateOBI_TNC_MIN_LIMITS(OBI){
	if ($('#stateCd').val()!='MA') {
		return false;
	}
	blnTriggerEdits = false;
	var strIndex = parseOffIndex(OBI.id);
	var OBI =  $('#OBI_' + strIndex).val();
	var vehicleTncUseInd = $('#vehicleTncUseInd_'+ strIndex).val();
	var strErrorID = '';
	if('Yes' == vehicleTncUseInd && ('No Coverage' == OBI  || isLeftValLesser(OBI,'50/100'))){
		strErrorID = 'OBI.browser.inLine.OBI_TNC_MIN_LIMITS';
		hasError = true;
		showClearInLineErrorMsgsWithMap('OBI_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		blnTriggerEdits = true;	
	}else{
		strErrorID='';
	}	
	return strErrorID!='';
}

function validateMAPD_TNC_MIN_LIMITS(PD){
	if ($('#stateCd').val()!='MA') {
		return false;
	}
	blnTriggerEdits = false;
	var strIndex = parseOffIndex(PD.id);
	var PD =  $('#PD_' + strIndex).val();	
	var vehicleTncUseInd = $('#vehicleTncUseInd_'+ strIndex).val();
	var strErrorID = '';
	if('Yes' == vehicleTncUseInd && ('No Coverage' == PD  || isLeftAmountValLesser(PD,'50,000'))){
		strErrorID = 'PD.browser.inLine.PD_TNC_MIN_LIMITS_MA';
		hasError = true;
		showClearInLineErrorMsgsWithMap('PD_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		blnTriggerEdits = true;	
	}else{
		strErrorID='';
	}	
	return strErrorID!='';
}

function validateBI_TNC_MIN_LIMITS(BI){
	//NJ need to be added later
	if (!($('#stateCd').val()=='CT' || $('#stateCd').val()=='NH' || $('#stateCd').val()=='NJ' || $('#stateCd').val()=='PA')) {
		return false;
	}
	blnTriggerEdits = false;
	var strIndex = parseOffIndex(BI.id);
	var BI =  $('#BI_' + strIndex).val();
	var vehicleTncUseInd = $('#vehicleTncUseInd_'+ strIndex).val();
	var strErrorID = '';
	
	if('Yes' == vehicleTncUseInd && $('#TNC_CVG_' + strIndex).val() != 'D'){
		if(BI.indexOf('CSL')==-1){
			if('No Coverage' == BI  || isLeftValLesser(BI,'50/100')){
				if( $('#stateCd').val()=='PA'){
					strErrorID = 'BI.browser.inLine.BI_TNC_MIN_LIMITS_PA';
				}else{
				strErrorID = 'BI.browser.inLine.BI_TNC_MIN_LIMITS';
				}				
				hasError = true;
				showClearInLineErrorMsgsWithMap('BI_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
				blnTriggerEdits = true;	
			}else{
				strErrorID='';
			}	
		}else{
			if(isLeftCSLValLesser(BI,'300,000 CSL')){
				if( $('#stateCd').val()=='PA'){
					strErrorID = 'BI.browser.inLine.BI_TNC_MIN_LIMITS_CSL_PA';
				}else{
				strErrorID = 'BI.browser.inLine.BI_TNC_MIN_LIMITS_CSL';
				}
				hasError = true;
				showClearInLineErrorMsgsWithMap('BI_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
				blnTriggerEdits = true;	
			}else{
				strErrorID='';
			}	
		}
	}
	
	return strErrorID!='';
}

function validatePD_TNC_MIN_LIMITS(PD){
	//NJ need to be added later
	if (!($('#stateCd').val()=='CT' || $('#stateCd').val()=='NH' || $('#stateCd').val()=='NJ' || $('#stateCd').val()=='PA')) {
		return false;
	}
	blnTriggerEdits = false;
	var strIndex = parseOffIndex(PD.id);
	var PD =  $('#PD_' + strIndex).val();
	var vehicleTncUseInd = $('#vehicleTncUseInd_'+ strIndex).val();
	var strErrorID = '';
	if('Yes' == vehicleTncUseInd && ('No Coverage' == PD  || isLeftAmountValLesser(PD,'25,000')) && $('#TNC_CVG_' + strIndex).val() != 'D'){
		if( $('#stateCd').val()=='PA'){
			strErrorID = 'PD.browser.inLine.PD_TNC_MIN_LIMITS_PA';
		}else{
		strErrorID = 'PD.browser.inLine.PD_TNC_MIN_LIMITS';
		}		
		hasError = true;
		showClearInLineErrorMsgsWithMap('PD_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		blnTriggerEdits = true;	
	}else{
		strErrorID='';
	}	
	return strErrorID!='';
}

function bindTabOutEdits(){
	var stateCd = $('#stateCd').val();
	//dividing all the selectors by state for performance
	bindTabOutEditsForCommon();
	
	if(stateCd == STATE_NJ){
		bindTabOutEditsForNJ();
	}
	
	//PA_AUTO
	if(stateCd == STATE_PA){
		bindTabOutEditsForPA();
	}
	
	if(stateCd == STATE_MA){
		bindTabOutEditsForMA();
	}
	
	if(stateCd == STATE_NH || stateCd == STATE_CT){
		bindTabOutEditsForNHCT();
	}
	
	$('.closeModal').click(function(){
		$('#upgradePackageModal').hide();
	});
	
	$(document).on("click", ".openPrefillDialog", function(){
		$('#orderThirdPartyPrefillNotReconciledModal').modal('hide');
		$('#reconcilePrefillClicked').val('true');
		document.aiForm.viewPrefill.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	});
}

function isNotTrailer(currVehTypeCode){
	if(currVehTypeCode == PRIVATE_PASSENGER_CD 
			|| currVehTypeCode == MOTOR_HOME_CD
			|| currVehTypeCode == MOTORCYCLE_CD
			|| currVehTypeCode == ANTIQUE_CD){
		return true;
	}
	return false;
}

function isTrailer(currVehTypeCode){
	return !isNotTrailer(currVehTypeCode);
}

function setDefaultLimitsAndDedValsForCompOnly(fieldId,strIndexSub){
	if(fieldId=='UMUIMBI'){
		$('#UMUIM_deductionVal_'+strIndexSub).val('');
	} else if(fieldId == 'NCR_ALA_Select'){
		$('#NCR_ALA_limit_' + strIndexSub).val('');
		$('#NCR_ALA_deductionVal_' + strIndexSub).val('');
    } else if(fieldId == 'LOAN_ALA_Select'){
		$('#LOAN_ALA_limit_' + strIndexSub).val('');
		$('#LOAN_ALA_deductionVal_' + strIndexSub).val('');
	} else{
		$('#'+fieldId+'_deductionVal_'+strIndexSub).val('');
	}
}

//TD 45485 - Update Liability fields with adjacent PPA or MH values
function setLiabilityLimitsAndDedValsForCompOnly(fieldCompOnly){
	  var compOnlyIndex = parseOffIndex(fieldCompOnly.id);
	  //This is list of liability coverages only
	    var liabilityCode = ["BI","PD","UMPD","UMUIMBI","PRINC_PIP",
	                            "PIP_Limit","PIP_Deductible","EXTRA_PIP_LIMIT","ExtraPIPApplies","EMP","TORT","UMUIM","MP",
	                            "UMBI","UIMBI","UMStacked","UIMStacked","FPBP","CFPB","MB","ILB","ADB","FEB","EMB"];
		var cols = '.multiTable';
		for(var index=0;index <= liabilityCode.length; index++){
			/*Loop through all the vehicles until a PPA or MH is found*/
			$('select[id^='+liabilityCode[index]+']',cols).each(function(){
				
				var strIndex = parseOffIndex(this.id);
				var intUnderbar = (this.id).lastIndexOf('_');
				var fieldId = (this.id).substring(0,intUnderbar);
				var compOnlyField = $('#'+fieldId+'_'+compOnlyIndex);
				if($(compOnlyField).val() == '' && this.value != '' 
						&& isNotTrailer($('#vehTypeCd_'+strIndex).val())){		
						$(compOnlyField).val(this.value).trigger('chosen:updated');
				    	//validateRequiredField('#'+fieldId+'_'+compOnlyIndex);
				    	//highlightAndFade('#'+fieldId+'_'+compOnlyIndex);					
						/*Exit once a PPA or MH is found*/
						return false;
				}				
			});
		}
}

function validateCOMPONLY(fieldCompOnly){
	var strMsg = '';
    var strIndex = parseOffIndex(fieldCompOnly.id);
    var compOnlyElements = ["BI","PD","PRINC_PIP","PIP_Limit","PIP_Deductible","TORT","COLL",
                            "WaiverofDeductible","TL_LIMIT","RR","NCR_ALA","LOAN_ALA"];
    
    if ($('#stateCd').val()=='MA') {
    	compOnlyElements.push("UM","OBI","MP","UIM","LMTD_COLL","GC");
    }else if($('#stateCd').val()=='NH' || $('#stateCd').val()=='CT'){
    	compOnlyElements.push("UM","MP","UMUIM");
    }else if ($('#stateCd').val()=='NJ') {
    	compOnlyElements.push("UMPD","UMUIMBI","EXTRA_PIP_LIMIT","ExtraPIPApplies","EMP");
    }else if($('#stateCd').val()=='PA'){
    	compOnlyElements.push("UMBI","UIMBI","UMStacked","UIMStacked","FPBP","CFPB","MB","ILB","ADB","FEB","EMB");
    }
    
    if(fieldCompOnly.value == 'Y'){
    	//$('#suspendIndCd_'+strIndex).val('Y');
    	$.each(compOnlyElements,function(elementIndex, elementValue){    		
    		var thisId = $('#'+elementValue+'_'+strIndex).attr('id');
    		if(thisId == null){
    			return;
    		}
			var intUnderbar = thisId.lastIndexOf('_');
			var fieldId = thisId.substring(0, intUnderbar);
			var strIndexSub = parseOffIndex(thisId);
    		if(fieldId!='COMP' && fieldId!='COMP_GLASS' && strIndexSub == strIndex){
    			$('#'+thisId).val('').prop('disabled',true).trigger('chosen:updated');
    			setDefaultLimitsAndDedValsForCompOnly(fieldId,strIndexSub);
    			showClearInLineErrorMsgsWithMap(fieldId+'_'+strIndexSub, '', fieldIdToModelErrorRow['defaultMulti'],
      					 strIndex, errorMessages, addDeleteCallback);
    			if(!$('.WaiverofDeductible').hasClass('hidden')){
    				$('.WaiverofDeductible').addClass('hidden');
    			}
    		}
    	});
    	strMsg = '';
    	//Hide H/C Provider Name & Number
    	$('#HC_PROVIDER_NAME_DISPLAY_'+strIndex).hide();
    	$('#HC_PROVIDER_NUMBER_DISPLAY_'+strIndex).hide();    	
    	showClearInLineErrorMsgsWithMap('HC_PROVIDER_NAME_DISPLAY_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex('HC_PROVIDER_NAME_DISPLAY_'+strIndex), errorMessages, addDeleteCallback);
    	showClearInLineErrorMsgsWithMap('HC_PROVIDER_NUMBER_DISPLAY_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex('HC_PROVIDER_NUMBER_DISPLAY_'+strIndex), errorMessages, addDeleteCallback);
    	//validateRequiredField('#HC_PROVIDER_NAME_DISPLAY_'+strIndex);
    	//validateRequiredField('#HC_PROVIDER_NUMBER_DISPLAY_'+strIndex);
    	
    } else if(fieldCompOnly.value == 'N'){
    	//$('#suspendIndCd_'+strIndex).val('N');
    	$.each(compOnlyElements,function(elementIndex, elementValue){
    		var thisId = $('#'+elementValue+'_'+strIndex).attr('id');
    		if(thisId == null){
    			return;
    		}		
    		var intUnderbar = thisId.lastIndexOf('_');
			var fieldId = thisId.substring(0,intUnderbar);
			var strIndexSub = parseOffIndex(thisId);
    		if(fieldId!='COMP' && fieldId!='COMP_GLASS' && strIndexSub==strIndex){
    			$('#'+thisId).prop('disabled',false).trigger('chosen:updated');
    		}
   			if($('#COLL_'+strIndexSub).val() != 'No Coverage' && $('#COLL_'+strIndexSub).val() != ''){
				$('.WaiverofDeductible').removeClass('hidden');
			}
   			if(fieldId=='PIP_Deductible' && $('#vehTypeCd_'+strIndexSub).val()=='MC'){
   				$('#'+thisId).val('0').prop('disabled',true).trigger('chosen:updated');
   			}
    	});
    	
    	//TD 45485 - Update Liability fields with adjacent PPA or MH values
    	setLiabilityLimitsAndDedValsForCompOnly(fieldCompOnly);
    	strMsg = '';
    	
    	//show H/C Provider Name & Number
    	$('#HC_PROVIDER_NAME_DISPLAY_'+strIndex).show();
    	$('#HC_PROVIDER_NUMBER_DISPLAY_'+strIndex).show();    	
    	showClearInLineErrorMsgsWithMap('HC_PROVIDER_NAME_DISPLAY_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex('HC_PROVIDER_NAME_DISPLAY_'+strIndex), errorMessages, addDeleteCallback);
    	showClearInLineErrorMsgsWithMap('HC_PROVIDER_NUMBER_DISPLAY_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex('HC_PROVIDER_NUMBER_DISPLAY_'+strIndex), errorMessages, addDeleteCallback);
    	var cols = '.multiTable';
		$('.clsHCProviderName,.clsHCProviderNumber',cols).each(function(event, result){
			var strIndex = parseOffIndex(this.id);
			var pipVal = $('#PRINC_PIP_'+strIndex);
			if(pipVal=='Secondary Full PIP' || pipVal=='Secondary Medical Expense Only'){
				validateRequiredField(this);
			}
		});
    }  else{
    	//$('#suspendIndCd_'+strIndex).val('N');
    	strMsg='COMP_ONLY.browser.inLine.valid_valueCheck';
    }
    if ($('#stateCd').val()=='MA' && isNotTrailer($('#vehTypeCd_'+strIndex).val())) {
    	validateMCVehiclesMA($('#PIP_Deductible_'+strIndex)[0],$('.clsPIP_Deductible'),'PIP_Deductible','');
    	validateMCVehiclesMA($('#MP_'+strIndex)[0],$('.clsMP'),'MP','');
    }
    showClearInLineErrorMsgsWithMap('COMP_ONLY_'+strIndex, strMsg, fieldIdToModelErrorRow['defaultMulti'],
            strIndex, errorMessages, addDeleteCallback);
}

function validateHCProviderFields(fieldThis){
	var strMsg = '';
	var intUnderbar = fieldThis.id.lastIndexOf('_');
	var fieldId = fieldThis.id.substring(0, intUnderbar);
	var regex='';
	var limitField='';
	var hit = false;
	if (fieldId == 'HC_PROVIDER_NAME_DISPLAY') {
		regex = /^[A-Za-z -]+$/i;
		limitField = 'HC_PROVIDER_NAME_limit';
		hit = true;
	} else if (fieldId == 'HC_PROVIDER_NUMBER_DISPLAY') {
		regex = /^[A-Za-z0-9 -]+$/i;
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

function validateUpgrPak(fieldThis){
	var strErrMsg = '';
    var cols = '.multiTable';
    $('#packageAddedFlag').val("Yes");
    //49764
    //PA auto follows NJ for PREM_PAK
    if(fieldThis.value=="PREM_PAK" && isPolicyMidterm() && !ifVehAdded()  && ($('#stateCd').val()=='NJ' || $('#stateCd').val()=='PA')){
		strErrMsg = 'UPGR_PAK.browser.inLine.ASSURANCE_PREMIERE_NOT_VALID_FOR_MIDTERM';
		$('#upgradePackErrorExists').val('true');
    }
    //45259 - Assurance Preferred can be added midterm for NJ
    //TD 54681 - Assurance Preferred cannot be added for for MA, CT, NH 
    //PA auto follows NJ for PREF_PAK
    else  if(fieldThis.value=="PREF_PAK" && isPolicyMidterm() && $('#stateCd').val()!='NJ' && $('#stateCd').val()!='PA'){
    	
    	//55539 - fix
    	//You can add mid-term if adding a PPA with collision
    	//You can add mid-term if adding collision to a PPA if it previously did not have collision coverage
    	//You cannot add mid-term in any other circumstance
    	var collisionCount = $('#collisionCount').val();   	
    	var cols = '.multiTable';
    	var currentCollCount = 0; 
    	$('.clsColl',cols).each(function() {
    		var collId = this.id;
    		var collValue = this.value;
    		
    		if(undefined != collValue && collValue != '' && collValue != 'No Coverage'){
    			currentCollCount = currentCollCount + 1;
    		}
    			
    	});    	
    	
    	if(currentCollCount <= collisionCount){
    		strErrMsg = 'UPGR_PAK.browser.inLine.ASSURANCE_PREFERRED_NOT_VALID_FOR_MIDTERM';	
    	}
    			
    }
    $('select.clsUpgrPak',cols).each(function(){
		showClearInLineErrorMsgsWithMap(this.id, strErrMsg, fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);
	});
}

function validateRentCovField(fieldThis) {
	var strMsg = '';
	var fieldId = fieldThis.id;
	if ($.trim(fieldThis.value) != '') {
		removePreRequiredStyle($('#'+fieldId));
		showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, undefined,-1, errorMessages, addDeleteCallback);
    } else {
		strMsg = fieldId + '.browser.inLine.valid_valueCheck';
		showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, undefined,-1, errorMessages, addDeleteCallback);
	}
	
    
}

function validateRequiredField(fieldThis){
	var strMsg = '';
    var strIndex = parseOffIndex(fieldThis.id);
    var intUnderbar = fieldThis.id.lastIndexOf('_');
    var fieldId = fieldThis.id.substring(0,intUnderbar);

    //59579-CT-NH - Comprehensive Coverage is required when collision Selected.  This edit is missing.
    if ($('#stateCd').val()=='CT' || $('#stateCd').val()=='NH') {
    	if(fieldId == 'COLL' || fieldId == 'COMP'){
    		if ($('#COLL_' + strIndex).val() != '' && $('#COLL_' + strIndex).val() != 'No Coverage'){
    			if ($('#COMP_' + strIndex).val() == '' || $('#COMP_' + strIndex).val() == 'No Coverage') {
    				return 'COMP.browser.inLine.COMP_REQUIRED_IF_COLL_EXISTS';
    			}
    		}

    		//remove waiver of deductible error message if COLL is No Coverage or empty
    		if(fieldId == 'COLL'){
    			if($('#COLL_' + strIndex).val() == '' || $('#COLL_' + strIndex).val() == 'No Coverage'){
    				showClearInLineErrorMsgsWithMap('WaiverofDeductible_'+strIndex, "", fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
    			}
    		}
    	}

    	if(fieldId == 'WaiverofDeductible' && $.trim(fieldThis.value) == '' ){
    		strMsg=fieldId + '.browser.inLine.required';
    	}
    }
    
    if(fieldId == 'COMP_GLASS' && fieldThis.value == ''
			&& ($('#COMP_' + strIndex).val() == '' ||
				$('#COMP_' + strIndex).val() == 'No Coverage')) {
    	return '';
	} else if ($.trim(fieldThis.value) != '' 
    			&& (fieldId == 'HC_PROVIDER_NAME_DISPLAY' || fieldId == 'HC_PROVIDER_NUMBER_DISPLAY' || fieldId == 'PRINC_PIP_HCPNAME')) {
    	strMsg = validateHCProviderFields(fieldThis);
    } 
    
    if(fieldId == 'COMP'){
    	strMsg = verifyMidTermCompEdits(fieldThis);
    }
    
   /* if (fieldId == 'RENT_ENDR' && $.trim(fieldThis.value) != '') {
    		removePreRequiredStyle($('#'+fieldThis.id));
        	showClearInLineErrorMsgsWithMap(fieldThis.id, '', fieldIdToModelErrorRow['defaultSingle'],strIndex, errorMessages, addDeleteCallback);
        	return strMsg;
    } */
    
    if(strMsg != ''){
    	 showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
    } else{
    	if ($.trim(fieldThis.value) == ''){
            strMsg = fieldId + '.browser.inLine.valid_valueCheck';
      	} else{
    		removePreRequiredStyle($('#'+fieldThis.id));
    	}
        showClearInLineErrorMsgsWithMap(fieldThis.id, strMsg, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
    }
    return strMsg;
}

function validateCOLLField(fieldThis) {
	var strCOLLMsg = '';
	var strIndex = parseOffIndex(fieldThis.id);
    //var intUnderbar = fieldThis.id.lastIndexOf('_');
    //var fieldId = fieldThis.id.substring(0,intUnderbar);
    var collVal = $('#COLL_' + strIndex).val();
    var compVal = $('#COMP_' + strIndex).val();
	
    if ($('#COLL_' + strIndex).val() == 'No Coverage' || $('#COLL_' + strIndex).val() == '') {
		if($('#COLL_' + strIndex).val() == ''){
			strCOLLMsg = 'COLL.browser.inLine.valid_valueCheck';
		}
		//COLL is required for financed/ leased vehicles
		//TD 59591 - Requiring Collision coverage if the vehicle is Leased or Financed (Leinholder is Leasing company) should only execute if in Application mode.
		if (!isQuote() && ($('#vehicleLeased_' + strIndex).val() == 'true'
				|| $('#vehicleFinancedOrLeased_' + strIndex).val() == 'true')){
			strCOLLMsg = 'COLL.browser.inLine.COLL_Coverage_Reqd_for_Leased_Financed_Vehicle';
			
		}
		showClearInLineErrorMsgsWithMap(fieldThis.id, strCOLLMsg, fieldIdToModelErrorRow['defaultMulti'],
	            strIndex, errorMessages, addDeleteCallback);
	}
    
    
    //MA:For all NB and Endorsement non MAIP policies:Comprehensive coverage is required if a vehicle has Collision coverage.
    if ($('#stateCd').val()=='MA') {
		if ( !isEndorsement() || (isEndorsement() && !isMaipPolicy()) ) {
			if ( collVal != '' && collVal != 'No Coverage' && (compVal == '' || compVal == 'No Coverage') ) {
				strCOLLMsg = 'COMP.browser.inLine.COMP_REQUIRED_IF_COLL_EXISTS';
				showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strCOLLMsg, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
			}
		}
    }
    //59579-CT-NH - Comprehensive Coverage is required when collision Selected.  This edit is missing.
    if ($('#stateCd').val()=='CT' || $('#stateCd').val()=='NH') {
			if ( collVal != '' && collVal != 'No Coverage' && (compVal == '' || compVal == 'No Coverage') ) {
				strCOLLMsg = 'COMP.browser.inLine.COMP_REQUIRED_IF_COLL_EXISTS';
				showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strCOLLMsg, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
			}
		}
}

function verifyMidTermCompEdits(fieldThis) {
	
	if(!isEndorsement()) {
		return '';
	}
	
	var strIndex = parseOffIndex(fieldThis.id);
	
	if ($('#COMP_' + strIndex).val() == 'No Coverage' || $('#COMP_' + strIndex).val() == '') {
		return '';
	}

	var origCompVal = $("#COMP_Prior_" + strIndex).val();
	
	// check only when coverage is added newly to the exisitng vehicle.
	if ((origCompVal == null || origCompVal == 'undefined' || origCompVal == 'No Coverage') 
			&& $('#endorsementVehicleAddedInd_'+strIndex).val() == '') {

		var policyEffectiveDate = new Date($("#policyEffDt").val()); 
		var effDateYear = policyEffectiveDate.getFullYear();
		var intModelYear = parseInt($('#modelYear_' + strIndex).val());
		var intModelAge = effDateYear - intModelYear;
		if(intModelAge >= 5) {
			return 'COMP.browser.inLine.COMP_MidTerm_valueCheck';
		}
	}
	
	return '';
}

function validateCOMPField(fieldThis) {
	var strIndex = parseOffIndex(fieldThis.id);
	var strCOMPMsg = '';
	if ($('#COMP_' + strIndex).val() == 'No Coverage' || $('#COMP_' + strIndex).val() == '') {
		if($('#COMP_' + strIndex).val() == ''){
			strCOMPMsg = 'COMP.browser.inLine.valid_valueCheck';
		}
		
		/*55591 - Coverage Screen  - Red Rimmed Message For Substitute Transportatin Coverage Does Not Immediately Generate after deleting Comp and Collision*/
		//COMP is required when Towing coverage is selected
		if ($('#uwCompanyCd').val()!='ALN_TEACH' 
				&& document.getElementById('TL_LIMIT_' + strIndex) != null 
				&& $('#TL_LIMIT_' + strIndex).val() != 'No Coverage'
				&& $('#TL_LIMIT_' + strIndex).val() != '') {
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_TL';
		}
		
		//COMP is required when Substitute Transportation is selected
		if (document.getElementById('RR_' + strIndex) != null &&
				$('#RR_' + strIndex).val() != 'No Coverage'
				&& $('#RR_' + strIndex).val() != '') {
			if ( !isEndorsement() || (isEndorsement() && !isMaipPolicy()) ) {
				strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_EXTTRAN';
			}
		}
		
		// COMP is required when Collision coverage is selected
		// NJ state condition is added
		//PA_AUTO PA follws NJ
		if($('#stateCd').val()=='NJ' || $('#stateCd').val()=='PA') {
			if ($('#COLL_' + strIndex).val() != 'No Coverage' && $('#COLL_' + strIndex).val() != '') {
				strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Required_Context_COLL';
			}
		}
		
		//MA For all NB and Endorsement non MAIP policies:Comprehensive coverage is required if a vehicle has Collision coverage.
	    if ($('#stateCd').val()=='MA') {
			if ( !isEndorsement() || (isEndorsement() && !isMaipPolicy()) ) {
				if ($('#COLL_' + strIndex).val() != 'No Coverage' && $('#COLL_' + strIndex).val() != '') {
					strCOMPMsg = 'COMP.browser.inLine.COMP_REQUIRED_IF_COLL_EXISTS';
				}
			}
	    }
	    
	  //MA:For all NB and Endorsement non MAIP policies. Comprehensive coverage is required if a vehicle has Limited Collision coverage.
		if ($('#stateCd').val()=='MA') {  
			if ( !isEndorsement() || (isEndorsement() && !isMaipPolicy()) ) {
				if ($('#LMTD_COLL_' + strIndex).val() != 'No Coverage' && $('#LMTD_COLL_' + strIndex).val() != '') {
					strCOMPMsg = 'COMP.browser.inLine.COMP_REQUIRED_IF_LMTD_COLL_EXISTS';					
				}
			}
		}

		//COMP is required for financed/ leased vehicles
		if ($('#vehicleLeased_' + strIndex).val() == 'true'
			|| $('#vehicleFinancedOrLeased_' + strIndex).val() == 'true'){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Reqd_for_Leased_Financed_Vehicle';
		}
		
		//COMP is required for customized vehicles
		if ($('#customizedEquipAmt_' + strIndex).val() != null
				&& $('#customizedEquipAmt_' + strIndex).val() != 0){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Reqd_for_CUST_EQUIP_AMT';
		}	

		//COMP is required for comp only vehicles
		if(isEndorsement() && $('#COMP_ONLY_'+strIndex).val()=='Y'){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Reqd_for_COMP_ONLY';
		}
		
		//COMP is required for Trailers
		if(!isNotTrailer($('#vehTypeCd_'+strIndex).val())){
			strCOMPMsg = 'COMP.browser.inLine.COMP_Coverage_Reqd_for_Trailer_Vehicle';
		}
		
		//59579-CT-NH - Comprehensive Coverage is required when collision Selected.  This edit is missing.
	    if ($('#stateCd').val()=='CT' || $('#stateCd').val()=='NH') {
				if ($('#COLL_' + strIndex).val() != 'No Coverage' && $('#COLL_' + strIndex).val() != '') {
					strCOMPMsg = 'COMP.browser.inLine.COMP_REQUIRED_IF_COLL_EXISTS';
				}
		}
	    
	    showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strCOMPMsg, fieldIdToModelErrorRow['defaultMulti'],
	            strIndex, errorMessages, addDeleteCallback);
	    
	} else {
		strCOMPMsg = verifyMidTermCompEdits(fieldThis);
		if(strCOMPMsg != '') {
			showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strCOMPMsg, fieldIdToModelErrorRow['defaultMulti'],
		            strIndex, errorMessages, addDeleteCallback);
		}
			
	}
	
}

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

	if(strUMUIMBIValue == null || strUMUIMBIValue == ''){
		strErrorID =  'UMUIMBI.browser.inLine.valid_valueCheck';
	}
	
	if(strBIValue != null && strUMUIMBIValue != null && strBIValue != '' && strUMUIMBIValue != ''){
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
	if(isBlank(strUMUIMBIValue)){
		strErrorID =  'UMPD.browser.inLine.valid_valueCheck';
	}
	if(strBIValue != null && strUMUIMBIValue != null  && strBIValue != '' && strUMUIMBIValue != ''){
		if (isSecondCovHigher(strBIValue, strUMUIMBIValue)){
			strErrorID = 'UMPD.browser.inLine.PD_limit_ShdNotBeLessThan_UMPD_limit';
		}
		if (strBIValue.indexOf('CSL') >= 0 && strUMUIMBIValue.indexOf('CSL') < 0){
			strErrorID = 'UMPD.browser.inLine.UMUIM_limit_ShouldBeCSL';
		}
		if(strBIValue.indexOf('CSL') < 0 && strUMUIMBIValue.indexOf('CSL') >= 0){
			strErrorID = 'UMPD.browser.inLine.UMUIM_limit_ShouldBeSplit';
		}
	}
	showClearInLineErrorMsgsWithMap(strUMUIMBI, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}

function isPolicyMidterm(){
	var polEffDt = $('#policyEffDt').val();
	var tranEffDt = $('#tranEffDt').val();
	if(polEffDt==null || tranEffDt==null 
			|| isInvalidDate(polEffDt) || isInvalidDate(tranEffDt)){
		return false;
	}
	if(new Date($('#tranEffDt').val()) > new Date($('#policyEffDt').val())){
		return true;
	}
	return false;
}

function isInvalidDate(dateInput){
	if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)){
		return true;
	}
	return false;
}

function checkPDLimitForBISelected(biPDCov){
	var strError = '';
	var cols = '.multiTable';
	$('.clsBILimit',cols).each(function() {
		var biId = this.id;
		var biValue = this.value;
		var n = biId.lastIndexOf("_");
		var idIndex = biId.substring(n+1,n.length);
		var strIndex = idIndex;

		var pdId = 'PD_'+idIndex;
		var pdValue = $('select[id^='+ pdId +']').val();
		if(biValue !=null && biValue != '' && pdValue !=null && pdValue != ''){
			if (biValue.indexOf('CSL') >= 0 && pdValue.indexOf('CSL') < 0 ){
				strError = 'PD.browser.inLine.Select_PD_csl_limit';
			}
			if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') >= 0 ){
				strError = 'PD.browser.inLine.PD_limit_ShouldBeSplit';
			}
			if(bothCSL(biValue,pdValue)){
				var strBIValue = parseInt(biValue.replace('CSL', ''));
				var strPDValue = parseInt(pdValue.replace('CSL', ''));
				if(strPDValue != strBIValue){
					strError = 'PD.browser.inLine.Select_PD_csl_limit';
				}
				strIndex = parseInt(strIndex);
			}
			if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') < 0 ){
				strError = '';
				strIndex = parseInt(strIndex);
			}
			showClearInLineErrorMsgsWithMap(pdId, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
		}
	});
}

function setFocusToCoverageField(){
	   if ( $('#readOnlyMode').val() != 'Yes') {
		   var elemToFocus = $('#covCode').val()+'_'+$('#covIndex').val();
		   if(document.getElementById(elemToFocus)){
			   setFocus(elemToFocus);
			   if(parseInt($('#covIndex').val()) > 2){
				   for(var i=0;i<parseInt($('#covIndex').val())-2;i++){
					   $("#rightScrollBtn").trigger('click');   
				   }
				   updateAllCoverageHeaderInfo();
			   }
		   } else{
			   //If first vehicle is componly or trailer, setting fovus to COMP for now
			   if($('#BI_0').attr('disabled')=='disabled'){
				   setFocus('COMP_0');  
			   }  else{
				   setFocus('BI_0');
			   }
		   }
	   }  
}

function checkExtraPipForPipValue(pipExtraPipCov){
	var strError = '';
	var cols = '.multiTable';
	$('select.clsPRINC_PIPLimit',cols).each(function() {
		var pipId = this.id;
		var pipValue = this.value;
		var n = pipId.lastIndexOf("_");
		var idIndex = pipId.substring(n+1,n.length);
		var strIndex = idIndex;
		var extraPipId = 'EXTRA_PIP_LIMIT_'+idIndex;
		var extraPipValue = $('select[id^='+ extraPipId +']').val();
		if(pipValue !=null && pipValue != '' && (pipValue =='Primary Medical Expense Only' || pipValue =='Secondary Medical Expense Only')) {
			if(extraPipValue !=null && extraPipValue != '' && extraPipValue != 'No Extra PIP Option') {
				strError = 'EXTRA_PIP_LIMIT.browser.inLine.invalidExtraPIP';
				showClearInLineErrorMsgsWithMap(extraPipId, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
			}
		} else{
			if(extraPipValue !=null && extraPipValue != '' && extraPipValue != 'No Extra PIP Option'){
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
		} else if(bothLimit(strFirstCov, strSecondCov)){
			var strFirstValue = parseInt(strFirstCov.replace('CSL', ''));
			var strSecondValue = parseInt(strSecondCov.replace('CSL', ''));
			if(strSecondValue > strFirstValue){
				blnResult = true;
			}
		}
		return blnResult;
}

function bothCSL(strFirstCov, strSecondCov){
	return (strFirstCov.indexOf('CSL') >= 0 && strSecondCov.indexOf('CSL') >= 0) ;
}

function bothSplit(strFirstCov, strSecondCov){
	return (strFirstCov.indexOf('/') > 0  && strSecondCov.indexOf('/') > 0) ;
}

function bothLimit(strFirstCov, strSecondCov){
	return (strFirstCov.indexOf('CSL') < 0 && strFirstCov.indexOf('/') < 0 &&  strSecondCov.indexOf('CSL') < 0 && strSecondCov.indexOf('/') < 0);
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

// end tab-out edit functions for this page
function setPackageSelection(el){
	var selected = '';
	for (var i=0; i < document.aiForm.selectPackage.length; i++){
	   if (document.aiForm.selectPackage[i].checked){
	      selected = document.aiForm.selectPackage[i].value;
	   }
	}
	$('#PS_limit').val(selected);
	$("#packageSelectionDialog").hide();
}

function clearPremium(){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	$('.clsPremiumAmt').val("0");
	$('.clsPremiumAmtDisplay').each(function(){
		this.outerHTML =  "<span></span>";
	});
	// turn edit events back on
	blnTriggerEdits = true;
}

function updateNewVehCov(){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	extraPIPSelected();
	var cols = '.multiTable';
	if ( $('#readOnlyMode').val() != 'Yes'  && $('#uwCompanyCd').val() != 'ALN_TEACH') {
		$('.clsUpgrPak',cols).each(function(){
			showHideTLIncluded(this.id,true);
		});
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

function updateNewVehCovItem(selector, vehPPA){
	var vehCount = parseInt($('#coverageCount').val());
	var lastVeh = vehCount -1;
	var thisId = '';
	var thisValue = '';
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	// select the first veh's Liability cov limit
	// propagate to other veh's: period
    $(selector).each(function() {
    	thisId = this.id;
    	n = thisId.lastIndexOf("_");
       	for (var i = 0; i <= lastVeh; i++){
       		if (thisValue.length == 0){
       			if (vehPPA){
           			// get thisValue from 1st CarLikeVeh
       				if (isCarLikeVehicle($('#vehTypeCd_' + i).val())){
               			thisValue = this.value;
       				}
           		}else{
           			// get this value from 1st column
       				thisValue = this.value;
           		}
    		}
       		if (thisValue.length > 0){
       			floodLiab(this);
           		break;
       		}
       	}
	});
	// turn edit events back on
	blnTriggerEdits = true;
}

//01/16/2015
//50763: When CSL is selected, user is forced to enter Property Damage. This limit should flood automatically.
function floodBItoPD(cov){
	var cols = '.multiTable';
	blnTriggerEdits = false;
	$('select.clsPDLimit,select.clsUMPDLimit',cols).each(function(){
		  var strIndex = parseOffIndex(this.id);
		  var currVehTypeCode = $('#vehTypeCd_'+strIndex).val();
		  if(readyToFlood(currVehTypeCode)){
			  $(this).val(cov.value).trigger('chosen:updated');
			  highlightAndFade(this);
			  validateRequiredField(this);
		  }
	});
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
    var currVehTypeCode = null;
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {    	
    	if($(this).hasClass("clsBILimit") || $(this).hasClass("clsUMUIMLimit") || $(this).hasClass('clsPDLimit') || $(this).hasClass('clsUMPDLimit')){
			nextId = this.id;
			n = nextId.lastIndexOf("_");
		    stub = nextId.substring(0, n+1);
		    idIndex = nextId.substring(n+1,n.length);
		    currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
		    if($('#COMP_ONLY_'+idIndex).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
		    if(nextId != thisId){
    			if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
    				$('#' + this.id).val(newSelection).trigger('chosen:updated');
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
    	floodLimitsBIPD(stub,newSelection,currVehTypeCode,false);
    }
    // turn edit events back on
	blnTriggerEdits = true;
}

function floodPolicyCoverages(cov,pageLoad){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
    // change the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	
	//default Accident Forgiveness to Not Requested if nothing is selected 
	//03/27/2015 In ENDR, if ACC_FORG exists set it to Requested. If ACC_FORG was not requested while issuing the policy, it would not have come in ENDR
	//52427 - Endt shows Accident Forgiveness as â€œNot Requestedï¿½? when it was requested
	if(thisId == "ACC_FORG_0"){
		if(isEndorsement()){
			// 55112 - No default required for Endorsement, We should select what comes from Polstar
			//newSelection = "Requested";
			//$('#' + thisId).val(newSelection).trigger('chosen:updated');
		} else if(newSelection.length <= 1){
				newSelection = "Not Requested";
				$('#' + thisId).val(newSelection).trigger('chosen:updated');
		}	
	}
	
    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    //select the id, of Type as _0,_1
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {
    	if($(this).hasClass("clsNcr") || $(this).hasClass("clsLoan") || $(this).hasClass("clsEssPak") || $(this).hasClass("clsAccForg")){
	    	if(pageLoad!=true){
	    		resetPremium($('#ratedInd').val(),$('#premAmt').val());
	    	}
    		nextId = this.id;
   			if(nextId != thisId){
    			n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    $('#' + this.id).val(newSelection).trigger('chosen:updated');
			    if(pageLoad!=true){
			    	highlightAndFade(this);	
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
    });
    // turn edit events back on
	blnTriggerEdits = true;
}

function floodNonMC(cov){
	var thisId = cov.id;
	var n = thisId.lastIndexOf("_");
	var stub = thisId.substring(0, n+1);
	var nextId;
	var strIndex = parseOffIndex(cov.id);
	var vehTypeCd = $('#vehTypeCd_'+strIndex).val();
	var newSelection = cov.value;
	var cols = '.multiTable';
	$('select[id^=' + stub + ']',cols).each(function() {
		nextId = this.id;
		if(nextId != thisId){
			n = nextId.lastIndexOf("_");
			stub = nextId.substring(0, n+1);
			var idIndex = nextId.substring(n+1,n.length);
			if(isVehicleTypeSimilar(vehTypeCd,$('#vehTypeCd_'+idIndex).val())){
				$('#' + this.id).val(newSelection).trigger('chosen:updated');
				validateRequiredField(this);
				highlightAndFade(this);
			}
		}
	});
}

function isVehicleTypeSimilar(floodingVehType,currVehType){
	if(currVehType=='MC'){
		return floodingVehType==currVehType;
	}else if(isPPAorMHorAQ(currVehType)){
		return (isPPAorMHorAQ(floodingVehType));
	} 
	return false;
}

function isPPAorMHorAQ(vehType){
	return (vehType=='PPA' || vehType=='MH' || vehType=='AQ');
}

function floodLiab(cov){
	//If MA go to MA specific method
	if($('#stateCd').val() == 'MA'){
		floodLiabMA(cov);
		return;
	}
	
	//PA_AUTO - If PA go to PA specific method
	if($('#stateCd').val() == 'PA'){
		floodLiabPA(cov);
		return;
	}
	
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
	var nextId;
	// change the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	// select by root id, such as BI_
	var n = thisId.lastIndexOf("_");
	var stub = thisId.substring(0, n+1);
	//select the id, of Type as _0,_1
	var idIndex = thisId.substring(n+1,n.length);
	var isVehicleCompOnly = false; 
	var cols = '.multiTable';
	
	$('select[id^=' + stub + ']',cols).each(function() {
		if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsPRINC_PIPLimit")
				|| $(this).hasClass("clsEXTRA_PIP_Limit") || $(this).hasClass("clsPIP_Limit")
				|| $(this).hasClass("clsPIP_Deductible") || $(this).hasClass("clsExtraPIPApplies")
				|| $(this).hasClass("clsEMP") || $(this).hasClass("clsTORT") || $(this).hasClass("clsTL")
				|| $(this).hasClass("clsPRINC_PIP_HCPNAMELimit")){
			nextId = this.id;
			if($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y'){
				isVehicleCompOnly = true;		    	
			} else{
				isVehicleCompOnly = false;
			}
			if(nextId != thisId){
				n = nextId.lastIndexOf("_");
				stub = nextId.substring(0, n+1);
				idIndex = nextId.substring(n+1,n.length);
				var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
				if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
					vehTyp = currVehTypeCode;
					$('#' + this.id).val(newSelection).trigger('chosen:updated');
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
			if($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y'){
				isVehicleCompOnly = true;		    	
			} else{
				isVehicleCompOnly = false;
			}
			if(nextId != thisId){
				//don't change or highlight the one the user changed
				n = nextId.lastIndexOf("_");
				stub = nextId.substring(0, n+1);
				//select the id, of Type as _0,_1
				idIndex = nextId.substring(n+1,n.length);
				var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
				if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
					$('#' + this.id).val(newSelection).trigger('chosen:updated');
					validateRequiredField(this);
					if(this.type == 'checkbox'){
						// update check box display
						this.checked = cov.checked;
					}
					//highlightAndFade(this);
				}
			}
		}
	});
	// turn edit events back on
	blnTriggerEdits = true;
}

//MA Liab Flooding
function floodLiabMA(cov){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
    // change the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    //select the id, of Type as _0,_1
    var idIndex = thisId.substring(n+1,n.length);
    var vehTypeCd = $('#vehTypeCd_'+idIndex).val();
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {
    	if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsPRINC_PIPLimit") || $(this).hasClass("clsPIP_Limit")
    			|| $(this).hasClass("clsPIP_Deductible") ||$(this).hasClass("clsMP")
    			|| $(this).hasClass("clsPIP_Deductible_Applies") 
    			){
			nextId = this.id;
		    if($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
   			if(nextId != thisId){
    			n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    //54867 and 54912
			    //if(readyToFloodMA(currVehTypeCode) && !isVehicleCompOnly){
			    if(isVehicleTypeSimilar(vehTypeCd,currVehTypeCode) && !isVehicleCompOnly){
			    	$('#' + this.id).val(newSelection).trigger('chosen:updated');
			    	validateRequiredField(this);
			    	highlightAndFade(this);
			    }

    		}
		}
    });

    // turn edit events back on
	blnTriggerEdits = true;
}

function readyToFlood(currVehTypeCode){
	if(currVehTypeCode == PRIVATE_PASSENGER_CD 
			|| currVehTypeCode == MOTOR_HOME_CD){
		return true;
	}
	return false;
}

function readyToFloodMA(currVehTypeCode){
	return isNotTrailer(currVehTypeCode);
}

/**
 * flood BI and PD values to UMIM and UMPD value's
 * @param stub
 * @param newSelection
 * @param currVehTypeCode
 */
function floodLimitsBIPD(stub,newSelection,currVehTypeCode,pageLoad){
	var limitType = 'UMUIMBI_';
	var isVehicleCompOnly = false;
	if(stub == 'PD_'){
		limitType = 'UMPD_';
	}
	$('select[id^=' + limitType + ']').each(function() {
		var strIndex = parseOffIndex(this.id);
		if($('#COMP_ONLY_'+strIndex).val() == 'Y'){
	    	isVehicleCompOnly = true;		    	
	    } else{
	    	isVehicleCompOnly = false;
	    }
		if($(this).hasClass("clsUMUIMLimit") || $(this).hasClass("clsUMPDLimit")){
				if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
				    	$(this).val(newSelection).trigger('chosen:updated');
				    	validateRequiredField(this);
				    	if(!pageLoad){highlightAndFade(this);}
				}
		}
	});
}

/*
 * If coverage preferences for UMUIM are not available, they should be taken 
 * from BI and PD. 
 * 
 * Executed only during first time thru.
 * 
 * */
function floodUMLimitsOnPageLoad(){
	if($('#firstTimeThru').val() != 'true'){
		return;
	}
	var liabilityCode = ["BI_","PD_"];
	var umuimCode = ["UMUIMBI_","UMPD_"];
	var cols = '.multiTable';
	for(var index=0;index<2;index++){
		/*Loop through all the vehicles until a PPA or MH is found*/
		$('select[id^='+liabilityCode[index]+']',cols).each(function(){
			var strIndex = parseOffIndex(this.id);
			if(this.value != '' && $('#'+umuimCode[index]+strIndex).val() == ''){
				floodLimitsBIPD(liabilityCode[index],this.value,$('#vehTypeCd_'+strIndex).val(),true);
				/*Exit once a PPA or MH is found*/
				return false;
			}
			/*Exit if BI is empty or UMUIM is already populated*/
			return false;
		});
	}
}

function floodMALimitsOnPageLoad(){
	if($('#firstTimeThru').val() != 'true'){
		return;
	}
	$('select.clsPIP_Limit').each(function(){
		var strIndex = parseOffIndex(this.id);
		if($('#stateCd').val() == 'MA' && readyToFloodMA($('#vehTypeCd_'+strIndex).val())){
			$(this).val("8,000").removeClass('preRequired').trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
	});
}

function hideShowRows(){
	//1. check vehicle tpye to get baseline
	
	//2. Hide Healthcare provider info on Quote
	hideShowHealthCareProvider();
	
	//3. Show PIP Applies if Extra PIP selected
	//extraPIPSelected();
	
	//4. Show Waive Deductible based on Collision
	waiveDeductibleAll();
	
	//setvalues for Upgrade Package and AccidetnForgiveness
	setValues('ESS_PAK');
	
	//5. Hide TL based for Teachers
	//5.1 For TL, Show Included when Upgrade Package Selected
	if($('#uwCompanyCd').val() == 'ALN_TEACH'){
		$('#TowingLabor').addClass('hidden');
	}else{
		if ($('#readOnlyMode').val() != 'Yes') {
			//47518
			//55700 fix - This is not error condition, This is valid condition so commenting this out
			/*if(isEndorsement() && $('#UPGR_PAK_0').val() =='PREM_PAK' && isPolicyMidterm()){
				$('#upgradePackErrorExists').val('true');
			}*/
			if(!isEndorsement() || $('#upgradePackErrorExists').val()!='true' || $('#UPGR_PAK_0').val() !='PREM_PAK'){
				showHideTLIncluded('UPGR_PAK_0',true);	
			}
		}else{
			// in read only mode TL is not defaulting
			if(!isEndorsement()){
			var cols = '.multiTable';	
			$('.clsUpgrPak',cols).each(function(){
				showHideTLIncluded(this.id,true);
			});
			}
		}
	}
	
	if(document.getElementById('UPGR_PAK_0')){
		floodPolicyCoverages(document.getElementById('UPGR_PAK_0'),true);	
	}
	if(document.getElementById('ACC_FORG_0')){
		floodPolicyCoverages(document.getElementById('ACC_FORG_0'),true);	
	}
	
	//6. New Car display
	newCarAll();
	
	//7. Loan Lease
	loanLeaseAll();
	
	if($('#stateCd').val() == 'MA'){
		showHideGuestCoverage();
		showHidePIPDedAppliesTo();
	}
	
	//PA_AUTO
	if($('#stateCd').val() == 'PA'){
		FPBPSelected();
	}
	
	showHideCompGlass();
	
	//TNC Requirement
	showHideTncCvg();

	processAllCompOnly();
	
	alignRows();
}

function processAllCompOnly(){
	if(!isEndorsement()){
		return false;
	}
	var cols = '.multiTable';
	$('.clsCompOnly',cols).each(function(){		
		validateCOMPONLY(this);
	});
}

function showHideCompGlass(){
	var retainRow = false;
	var cols = '.multiTable';
	$('.clsCOMP',cols).each(function() {
		var strIndex = parseOffIndex(this.id);
			validateCOMPGLASS(this);
			if (this.value != '' && this.value != 'No Coverage' && 
					(isNotTrailer($('#vehTypeCd_'+strIndex).val())) || ($('#stateCd').val() == 'MA')) {
				retainRow = true;
			}
	});
	if(!retainRow){
		$('.COMP_GLASS').addClass('hidden');
		$('#COMP_GLASS_Error').addClass('hidden');
		$('#COMP_GLASS_Error_Header').addClass('hidden');
	} else{
		$('.COMP_GLASS').removeClass('hidden');
		$('#COMP_GLASS_Error').removeClass('hidden');
		$('#COMP_GLASS_Error_Header').removeClass('hidden');
	}
}


function showHideTncCvg(){
	var retainRow = false;
	var cols = '.multiTable';
	$('.clsTNCCVG',cols).each(function() {
		var strIndex = parseOffIndex(this.id);
		if ('PPA' == $('#vehTypeCd_'+strIndex).val()) {
			retainRow = true;
		}
	});
	if(!retainRow){
		$('.clstnc_row').addClass('hidden');
		$('#TNC_CVG__Error').addClass('hidden');
		$('#TNC_CVG__Error_Header').addClass('hidden');
	} else{
		$('.clstnc_row').removeClass('hidden');
		$('#TNC_CVG__Error').removeClass('hidden');
		$('#TNC_CVG__Error').removeClass('hidden');
	}
}

function validateCOMPGLASS(COMP){
	var strIndex = parseOffIndex(COMP.id);
	var cols = '.multiTable';
	if(COMP.value != '' && COMP.value != 'No Coverage'){
		$('select[id^=COMP_GLASS_'+strIndex+']',cols).each(function(){
			if($('#COMP_GLASS_TD_' + strIndex).hasClass('hidden')){
				$('#COMP_GLASS_TD_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
			}
		});
		if(isTrailer($('#vehTypeCd_'+strIndex).val())){
			if($('#COMP_GLASSNA_' + strIndex).hasClass('hidden')){
				$('#COMP_GLASSNA_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
			}
		}
		//check required field entry for comp_glass
		if($('#COMP_GLASS_'+strIndex).val() == ''){
			showClearInLineErrorMsgsWithMap('COMP_GLASS_'+strIndex, 'COMP_GLASS.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					 strIndex, errorMessages, addDeleteCallback);
		}
	} else {
		$('select[id^=COMP_GLASS_'+strIndex+']',cols).each(function(){
			$(this).val('').trigger('chosen:updated');
			if(!$('#COMP_GLASS_TD_' + strIndex).hasClass('hidden')){
				$('#COMP_GLASS_TD_' + strIndex).addClass('hidden').trigger('chosen:styleUpdated');
			}
		});
		if(isTrailer($('#vehTypeCd_'+strIndex).val())){
			if(!$('#COMP_GLASSNA_' + strIndex).hasClass('hidden')){
				$('#COMP_GLASSNA_' + strIndex).addClass('hidden').trigger('chosen:styleUpdated');
			}
		}
		//remove validation for this condition
		 showClearInLineErrorMsgsWithMap('COMP_GLASS_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
	                strIndex, errorMessages, addDeleteCallback);
	}
}

var idsWithNA = [ "BI", "PD", "UMPD", "UMUIM" , "PRINC_PIP_LIMIT" , "HC_PROVIDER_NAME_DISPLAY", "HC_PROVIDER_NUMBER_DISPLAY"
                 ,"PIP_Limit", "PIP_Deductible" , "ExtraPIP_LIMIT" , "ExtraPIPApplies" , "EMP" , "TORT" , "RR" , "TL_LIMIT", "GC",
                 "UMBI", "UMStacked", "UIMBI", "UIMStacked", "FPBP", "CFPB", "MB", "ILB", "ADB", "FEB", "EMB" ];	//PA_AUTO Coverages

function hideCoveragesWhereNotApplicable(){
	var cols = '.multiTable';
	$('.vehTypeCd',cols).each(function() {
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
	$('select[id^=' + strSelectorDisplay + ']').val($(strSelectorLimit).val()).trigger('chosen:updated');
}

function isCompOnlyVehicle(strIndex){
	if($('#COMP_ONLY_'+strIndex).val()=='Y'){
		return true;
	}
	return false;
} 


function hideShowHealthCareProvider (pipChanged){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	var secondaryPIPExist = false;
	var cols = '.multiTable';
	if(isAnyCarLikeVehicle()){
		//should be 'Application' only
		if(isApplicationOrEndorsement()){
			if($('#stateCd').val() == 'NJ'){
				//check if the HealthCare Provider 
				
				
				//check any column for PRINC_PIP -> they are all the same
				//for endorsement this can vary first vehicle can be any PPA/MH/UT etc..
				//44820-Endorsement: (Update Alt Garage) H\C Provider Name & # fields display on policy that s/not qualify for H\C
				$('select.clsPRINC_PIPLimit').each(function(){
					var pipVal = this.value;
					var strIndex = parseOffIndex($(this).attr('id'));
					if(isCompOnlyVehicle(strIndex)){
						return;
					}
					if(pipVal == '' || pipVal == 'Primary Full PIP' || pipVal == 'Primary Medical Expense Only'){
						//TD 45519 - If Secondary PIP Exist then dont Hide HC fields for rest, this is special case when PIP values are coming different from Polstar
						if(!secondaryPIPExist || pipChanged){
							$('.HC_Provider_ShowHide').addClass('hidden');
							$('.HC_Provider').addClass('hidden');
							$('.HC_Provider_Number').addClass('hidden');
						}
						// and clear values
						$('input[id=HC_PROVIDER_NAME]').val('');
						$('input[id=HC_PROVIDER_NUMBER]').val('');
						$('input[id=HC_PROVIDER_NAME_limit]').val('');
						$('input[id=HC_PROVIDER_NUMBER_limit]').val('');
						
						$('.clsPRINC_PIP_HCPNAMELimit',cols).each(function(event, result){						
							removePreRequiredStyle($(this));
							$(this).val("");
							showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
									parseOffIndex(this.id), errorMessages, addDeleteCallback);
						});
						
						//36894-application-Issues on the Coverage Section
						//$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]',cols).each(function(event, result){
						$('.clsHCProviderName',cols).each(function(event, result){						
							removePreRequiredStyle($(this));
							$(this).val("");
							showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
									parseOffIndex(this.id), errorMessages, addDeleteCallback);
						});
						
						//$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]',cols).each(function(event, result){
						$('.clsHCProviderNumber',cols).each(function(event, result){						
							removePreRequiredStyle($(this));
							$(this).val("");
							showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
									parseOffIndex(this.id), errorMessages, addDeleteCallback);
						});

					}else{
						var nj_HCProviderEffdt = $('#nj_HCProviderEffdt').val();
						if(nj_HCProviderEffdt != 'true'){

							//This flag indicates that secondary PIP exist
							secondaryPIPExist = true;
							if(!$('.HC_Provider_ShowHide').hasClass('hidden')){
								$('.HC_Provider_ShowHide').addClass('hidden');
							}
							$('.HC_Provider').removeClass('hidden');
							$('.HC_Provider_Number').removeClass('hidden');
		
							//$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]',cols).each(function(event, result){
							$('.clsHCProviderName',cols).each(function(event, result){
								if(isCompOnlyVehicle(parseOffIndex($(this).attr('id')))){
									return;
								}
								addPreRequiredStyle($(this));
								if(pipChanged!=true){
									validateRequiredField(this);
								}
							});
							
							//$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]',cols).each(function(event, result){
							$('.clsHCProviderNumber',cols).each(function(event, result){
								if(isCompOnlyVehicle(parseOffIndex($(this).attr('id')))){
									return;
								}
								addPreRequiredStyle($(this));
								if(pipChanged!=true){
									validateRequiredField(this);
								}
							});
						
							
						}else{
							var HC_PROVIDER_NAME_limitStr = $('#HC_PROVIDER_NAME_limit').val();
							var HC_PROVIDER_NUMBER_limitStr = $('#HC_PROVIDER_NUMBER_limit').val();
							if(HC_PROVIDER_NAME_limitStr.length > 1 && HC_PROVIDER_NUMBER_limitStr.length > 1 && pipChanged!=true){
								$('.clsPRINC_PIP_HCPNAMELimit ').val('Other').trigger('chosen:updated');
							}else if($('.HC_Provider_ShowHide').hasClass('hidden')){
								$('.HC_Provider_ShowHide').removeClass('hidden');
							}
							
							//check if HealthCare provider name is chosen as Other
							var HCProviderNameStr = "#PRINC_PIP_HCPNAME";
							var HCProviderNameDDValue = $(HCProviderNameStr+"_"+strIndex).val();
							
							$('.clsPRINC_PIP_HCPNAMELimit',cols).each(function(event, result){
								if(isCompOnlyVehicle(parseOffIndex($(this).attr('id')))){
									return;
								}
								addPreRequiredStyle($(this));
								if(pipChanged!=true){
									validateRequiredField(this);
								}
							});
							 //check if the selected option is one of Medicare, Medicaid, NJ Family Care or Other"
							if(HCProviderNameDDValue=="Other"){
								//This flag indicates that secondary PIP exist
								secondaryPIPExist = true;
								
								
								$('.HC_Provider').removeClass('hidden');
								$('.HC_Provider_Number').removeClass('hidden');
			
								//$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]',cols).each(function(event, result){
								$('.clsHCProviderName',cols).each(function(event, result){
									if(isCompOnlyVehicle(parseOffIndex($(this).attr('id')))){
										return;
									}
									addPreRequiredStyle($(this));
									if(pipChanged!=true){
										validateRequiredField(this);
									}
								});
								
								//$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]',cols).each(function(event, result){
								$('.clsHCProviderNumber',cols).each(function(event, result){
									if(isCompOnlyVehicle(parseOffIndex($(this).attr('id')))){
										return;
									}
									addPreRequiredStyle($(this));
									if(pipChanged!=true){
										validateRequiredField(this);
									}
								});
								
							}else{
								if(pipVal != '' && HCProviderNameDDValue != null && HCProviderNameDDValue != '' && HCProviderNameDDValue !="Other" 
									&& (pipVal =="Secondary Full PIP"  || pipVal =="Secondary Medical Expense Only")){
									showDialogforPipValue(pipVal,HCProviderNameDDValue);
								}else{
									var hideHealthcarePName= false;
									changePrimaryInsuranceProvider(pipVal,hideHealthcarePName);
								}
								
							}
						}
						
						
						
						
					}
				});
			}
		}else{
			
			$('.HC_Provider_ShowHide').addClass('hidden');
			$('.HC_Provider').addClass('hidden');
			$('.HC_Provider_Number').addClass('hidden');
		}
	}
	// turn edit events back on
	blnTriggerEdits = true;
}



function showHideWaiverRow(blnCOLLPresent){
	var cols = '.multiTable';
	var blnLMTDCOLLPresent = false;
	if(blnCOLLPresent==null){
		$('.clsColl',cols).each(function() {
			// show / hide all individual cols
			if(this.value != '' && this.value != 'No Coverage'){
				//at least one Coll selected
				blnCOLLPresent = true;
				return false;
			}
		});
	}
	$('.clsLmtd_Coll',cols).each(function() {
		// see if any COLL's present
		if(this.value != '' && this.value != 'No Coverage'){
			blnLMTDCOLLPresent= true;
			return false;
		}
	});
	// see if any COLL is present
	if (blnCOLLPresent || blnLMTDCOLLPresent){
		// if at least one COLL present be sure row is shown
		if($('.WaiverofDeductible').hasClass('hidden')){
			$('.WaiverofDeductible').removeClass('hidden');
		}
	}else{
		// be sure row is hidden
		if(!$('.WaiverofDeductible').hasClass('hidden')){
			$('.WaiverofDeductible').addClass('hidden');
		}
	}
}

function waiveDeductibleAll(){
//Build the Waive of Deductible row at .ready time
	var blnCOLLPresent = false;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	var cols = '.multiTable';
	$('.clsColl',cols).each(function() {
			var strIndex = parseOffIndex(this.id);
		// show / hide all individual cols
		waiveDeductible(this);
		if(this.value != '' && this.value != 'No Coverage'){
			//at least one Coll selected
			blnCOLLPresent = true;
		}
			
			//changes related to CT and NH Waiver of Deductible Stop
			if(($('#stateCd').val() == 'CT' || $('#stateCd').val() == 'NH') && removeWaiver(strIndex)){
				if(!isEndorsement()){
					//select option is only for New Business
					$('#WaiverofDeductible_' + strIndex).prepend('<option value="">-- Select --</option>');
				}
				$('#WaiverofDeductible_'+strIndex+'  option[value="WAIVER"]').remove();
				//If WAIVER already exist then make it empty
				if($('#WaiverofDeductible_' + strIndex).val() == 'WAIVER' || $('#COLL_limit_' + strIndex).val() == ""){
					$('#WaiverofDeductible_' + strIndex).val("");
					$('#COLL_limit_' + strIndex).val("");
				}
				
				if($('#ratedInd').val() !='Yes' && $('#firstTimeThru').val()=='true'){
					//This will handle New Quote cases to default them to No Waiver
					$('#WaiverofDeductible_' + strIndex).val("NO WAIVER");
					$('#COLL_limit_' + strIndex).val("NO WAIVER");
				}
				
				$('#WaiverofDeductible_' + strIndex).trigger('chosen:updated');
			}
	});
	showHideWaiverRow(blnCOLLPresent);
	// turn edit events back on
	blnTriggerEdits = true;
}

function waiveDeductibleThisCol(COLL){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	// show / hide this col
	waiveDeductible(COLL);
	showHideWaiverRow();
	// turn edit events back on
	blnTriggerEdits = true;
}

function waiveDeductible(COLL){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	var strIndex = parseOffIndex(COLL.id);
	var isCollCovEmpty =  $('#COLL_'+strIndex).val() == '' || $('#COLL_'+strIndex).val() == 'No Coverage';
	var lmtdCollVal = $('#LMTD_COLL_'+strIndex).val();
	//52232 - waiver defaulted and protected for NJ quote
	var isLmtdCollCovEmpty = isBlank(lmtdCollVal) || lmtdCollVal=='No Coverage';
	var waiverEligible = (!isLmtdCollCovEmpty && COLL.value == 'No Coverage');
	/*For IA channel from MA  Implementation, 
	If LIMITED COLLISION Selected:   Default to Waiver and Protect
	If Collision Selected: then:
	If Direct - default to Waiver
	IF  Comp Rater - what is sent*/
	if(COLL.id == 'COLL_' + strIndex){
		if(!isCollCovEmpty || waiverEligible){
				var collLimitVal = $('#COLL_limit_' + strIndex).val();
				if (collLimitVal != '' && collLimitVal != null){
					// set waiver from COLL limit
					if($('#stateCd').val() == 'MA'&& !isLmtdCollCovEmpty){
						$('#WaiverofDeductible_' + strIndex).val('WAIVER').trigger('chosen:updated');
					}else{
						$('#WaiverofDeductible_' + strIndex).val(collLimitVal.toUpperCase()).trigger('chosen:updated');
					}
				}else{
					// no existing vlaue
					if($('#channelCd').val() == 'Direct' || $('#stateCd').val() == 'MA'){
						//set default for Direct
						$('#WaiverofDeductible_' + strIndex).val('WAIVER').trigger('chosen:updated');
						$('#COLL_limit_' + strIndex).val('WAIVER');
					}else{
						//set default for non-Direct
						$('#WaiverofDeductible_' + strIndex).val('NO WAIVER').trigger('chosen:updated');
						$('#COLL_limit_' + strIndex).val('');
					}
				}
				//52086 - Waiver of Deductible displays but the field with values does not
				$('#WaiverofDeductible_TD_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
				$('#WaiverofDeductible_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
				$('#WaiverofDeductible_' + strIndex).prop('disabled',!isLmtdCollCovEmpty).trigger('chosen:updated');
			}else{
				//No value present, clear value and be sure column is hidden
				$('#WaiverofDeductible_' + strIndex).val('');
				$('#COLL_limit_' + strIndex).val('');
				$('#WaiverofDeductible_TD_' + strIndex).addClass('hidden').trigger('chosen:styleUpdated');
				$('#WaiverofDeductible_' + strIndex).addClass('hidden').trigger('chosen:styleUpdated');
			}
	} else{
		if(isCollCovEmpty && isLmtdCollCovEmpty){
			//$('#WaiverofDeductible_' + strIndex).prop('disabled',!isLmtdCollCovEmpty).trigger('chosen:updated');	
			$('#WaiverofDeductible_TD_' + strIndex).addClass('hidden').trigger('chosen:styleUpdated');
			$('#WaiverofDeductible_' + strIndex).val('').addClass('hidden').trigger('chosen:styleUpdated');
		} else{
			$('#WaiverofDeductible_TD_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
			$('#WaiverofDeductible_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
			//TD 55010 - Collision Waiver field changes from waiver to no waiver when updating coverage from select to no coverage.
			//Dont change to No Waiver if Limited Collision empty or No Coverage
			if(!isLmtdCollCovEmpty){
				//TD 55116 - If LIMITED COLLISION Selected:   Default to Waiver and Protect for MA IA				
				if($('#stateCd').val() == 'MA'){
					$('#WaiverofDeductible_' + strIndex).val('WAIVER').prop('disabled',!isLmtdCollCovEmpty).trigger('chosen:updated');
				}else{
					$('#WaiverofDeductible_' + strIndex).val('NO WAIVER').prop('disabled',!isLmtdCollCovEmpty).trigger('chosen:updated');	
				}
			}else{
				$('#WaiverofDeductible_' + strIndex).prop('disabled',!isLmtdCollCovEmpty).trigger('chosen:updated');	
			}
		}
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

//Function to send flag for remove Waiver option based on NB and endorsment conditions
function removeWaiver(strIndex){
	var polEffDt = $('#policyEffDt').val();
	
	if(polEffDt==null || WAIVER_CUTOFF_DATE_CTNH==null 
			|| isInvalidDate(polEffDt) || isInvalidDate(WAIVER_CUTOFF_DATE_CTNH)){
		return false;
	}
	
	//Do not drop Waiver for Endorsment
	if(isEndorsement()){
		if(new Date(polEffDt) < new Date(WAIVER_CUTOFF_DATE_CTNH)){
			return false;
		}else{
			if($('#WaiverofDeductible_' + strIndex).val() == 'WAIVER'){
				return false;
			}else if($('#WaiverofDeductible_' + strIndex).val() == 'NO WAIVER'){
				return true;
			}
		}		
		return false;
	}else{
		//Drop Waiver for NB after 02/12/2016
		if(new Date(polEffDt) >= new Date(WAIVER_CUTOFF_DATE_CTNH)){
			return true;
		}
	}
	return false;
}

function showHideTLIncluded(upgradePackageId,pageLoad){
	
	if($('#stateCd').val() !='NJ' && $('#stateCd').val() !='PA'){	//NJ follows PA
		// Skipping processing based on Coverage Packages for MAIP policies - TEJAS
		if ($('#stateCd').val()=='MA') {
			if (isEndorsement() && isMaipPolicy())  {
				return;
			}	
		}
	
		var strIndexM = parseOffIndex(upgradePackageId);
		var cols = '.multiTable';
		if($('#' + upgradePackageId).val() != '' && $('#' + upgradePackageId).val() == 'PREM_PAK'){
			// Premier Package Selected
			if(!isEndorsement() || $('#upgradePackErrorExists').val()!='true' || $('#' + upgradePackageId).val() !='PREM_PAK'){
				$('.clsTLIncluded',cols).each(function(){
					strIndex = parseOffIndex(this.id);
					$('#TL_LIMIT_' + strIndex).val('').addClass('hidden').trigger('chosen:updated').trigger('chosen:styleUpdated');
					showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
							strIndex, errorMessages, addDeleteCallback);
					$('#' + this.id).removeClass('hidden');
				});
			}
			if(!($('#' + upgradePackageId).val() =='PREM_PAK' && isPolicyMidterm())){			 
				$('#upgradePackErrorExists').val('false');
			}
		}else{
			//no Upgrade Package Selected or Preffered Package selected
			$('.clsTLIncluded',cols).each(function(){
				strIndex = parseOffIndex(this.id);
				$('#' + this.id).addClass('hidden');
				$('#TL_LIMIT_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
				if($('#TL_LIMIT_' + strIndex).val() == '' && $('#COMP_ONLY_' + strIndex).val() != 'Y' && $('#firstTimeThru').val() != 'true'){
					showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, 'TL_LIMIT.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
							strIndex, errorMessages, addDeleteCallback);
				}
				$('.clsUpgrPak',cols).each(function(){
					showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
							parseOffIndex(this.id), errorMessages, addDeleteCallback);
				});
			});

			var prevTL = $('#TL_LIMIT_' + strIndexM);
			if(!pageLoad && (prevTL!=null || prevTL.value != '')){
				if($('#upgradePackErrorExists').val()=='true'){					
					$('#upgradePackErrorExists').val('false'); 
				} else if($('#uwCompanyCd').val()!="ALN_TEACH" && $(prevTL).val() == ''){
					$('#upgradePackageModal').show();	
				}			
				if(!isEndorsement() && $('#uwCompanyCd').val()!="ALN_TEACH"  && $(prevTL).val() == ''){
					$('#upgradePackageModal').show();	
				}
			}
		}
		
	}else{
		var strIndexM = parseOffIndex(upgradePackageId);
		var cols = '.multiTable';
		if($('#' + upgradePackageId).val() != '' && $('#' + upgradePackageId).val() != 'NONE'){
			// Upgrade Package Selected
			//47518 - Towing and Labor Coverage Changing from Included to No Coverage when rerating
			if(!isEndorsement() || $('#upgradePackErrorExists').val()!='true' || $('#' + upgradePackageId).val() !='PREM_PAK'){
				$('.clsTLIncluded',cols).each(function(){
					strIndex = parseOffIndex(this.id);
					$('#TL_LIMIT_' + strIndex).val('').addClass('hidden').trigger('chosen:updated').trigger('chosen:styleUpdated');
					showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'],
							strIndex, errorMessages, addDeleteCallback);
					$('#' + this.id).removeClass('hidden');
				});
			}
			if(!($('#' + upgradePackageId).val() =='PREM_PAK' && isPolicyMidterm())){			 
				$('#upgradePackErrorExists').val('false');
			}
		}else{
			//no Upgrade Package Selected
			$('.clsTLIncluded',cols).each(function(){
				strIndex = parseOffIndex(this.id);
				$('#' + this.id).addClass('hidden');
				$('#TL_LIMIT_' + strIndex).removeClass('hidden').trigger('chosen:styleUpdated');
				if($('#TL_LIMIT_' + strIndex).val() == '' && $('#COMP_ONLY_' + strIndex).val() != 'Y' && $('#firstTimeThru').val() != 'true'){
					showClearInLineErrorMsgsWithMap('TL_LIMIT_'+strIndex, 'TL_LIMIT.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
							strIndex, errorMessages, addDeleteCallback);
				}
				$('.clsUpgrPak',cols).each(function(){
					showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
							parseOffIndex(this.id), errorMessages, addDeleteCallback);
				});
			});

			var prevTL = $('#TL_LIMIT_' + strIndexM);
			if(!pageLoad && (prevTL!=null || prevTL.value != '')){
				if($('#upgradePackErrorExists').val()=='true'){					
					$('#upgradePackErrorExists').val('false'); 
				} else if($('#uwCompanyCd').val()!="ALN_TEACH"){
					$('#upgradePackageModal').show();	
				}			
				if(!isEndorsement() && $('#uwCompanyCd').val()!="ALN_TEACH"){
					$('#upgradePackageModal').show();	
				}
			}
		}
	}
}

function showOrHideTLUnavailable(upgradePackageId){
	strIndex = parseOffIndex(upgradePackageId);
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
	//updates NCR_ALA_limit sf hidden var with just selected value from non-sf dropdown
	strIndex = parseOffIndex(New_Car_Select.id);
	$('#NCR_ALA_limit_' + strIndex).val(New_Car_Select.value);
}

function newCarAll(){
	var cols = '.multiTable';
	$('.clsNcr',cols).each(function(){
		newCar(this);
	});
}

function newCar(car){
	//Show New Car per vehicle based on
	// 1. Vehicle > 2 model years
	// 2. Vehicle Leased
	// 3. Has Comp and Coll or Lmt Coll
	// 4. Package Selection: not Premier
	strIndex = parseOffIndex(car.id);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	if(newCarEligible(strIndex)){
		//Defect 44097 - New Requirement
		if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == "PREM_PAK") && $('#upgradePackErrorExists').val()!='true'){
			$('#NCR_ALA_Included_' + strIndex).removeClass('hidden');
			$('#NCR_ALA_Select_' + strIndex).val('').addClass('hidden').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#NCR_ALA_Unavailable_' + strIndex).addClass('hidden');
			$('#NCR_ALA_limit_' + strIndex).val('');
		} else {
			// show drop down for this vehicle
			$('#NCR_ALA_Included_' + strIndex).addClass('hidden');
			$('#NCR_ALA_Unavailable_' + strIndex).addClass('hidden');
			var newValue = $('#NCR_ALA_limit_' + strIndex).val();
			//45450-Endorsement Polstar Error, update contact info the New Car Replacement coverage is defaulting to --Select-- even though previously on policy
			//for endorsement this coverage limit comes as empty.If this coverage is present just set limit to Yes
			
			//46918 - Should be NO if no value comes from P* for existing vehicles
			//49436 - Teachers - loan/lease gap coverage not defaulting to select for newly added vehicles
			if(isEndorsement() && newValue=='' && $('#endorsementVehicleAddedInd_'+strIndex).val()==''){
				newValue='No';
			}
			$('#NCR_ALA_limit_' + strIndex).val(newValue);
			$('#NCR_ALA_Select_' + strIndex).removeClass('hidden').val(newValue).trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
	}else{
		// show "Unavailable" for this vehicle NCR_ALA_Unavailable_
		$('#NCR_ALA_Included_' + strIndex).addClass('hidden');
		$('#NCR_ALA_Select_' + strIndex).addClass('hidden').val('').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#NCR_ALA_Unavailable_' + strIndex).removeClass('hidden');
		$('#NCR_ALA_limit_' + strIndex).val('');
	}
}

/**
 * check to see if new Car is Eligible
 * @param strIndex
 * @returns {Boolean}
 */
function newCarEligible(strIndex){
	var vehicleType = $('#vehTypeCd_'+strIndex).val();
	var newValue = $('#NCR_ALA_limit_' + strIndex).val();
	if(vehicleType == 'PPA' && isEndorsement() && newValue == 'Yes'){
		return true;
	}
	var intCurrentYear = parseInt($('#currentYear').val());
	var intModelYear = parseInt($('#modelYear_' + strIndex).val());
	var intModelAge = intCurrentYear - intModelYear;
	if (!isNumber(intModelAge)){
		intModelAge = 999;
	}
	var vehicleLeased = $('#vehicleLeased_' + strIndex).val();
	var vehicleUsed = $('#vehicleUsed_' + strIndex).val();
	var strCOMP = $('#COMP_' + strIndex).val();
	var strCOLL = $('#COLL_' + strIndex).val();
	var strLTMCOLL = $('#LMTD_COLL' + strIndex).val();
	if (strCOMP == 'No Coverage'){
		strCOMP = '';
	}
	if (strCOLL == 'No Coverage'){
		strCOLL = '';
	}
	if (strLTMCOLL == 'No Coverage' || strLTMCOLL == undefined){
		strLTMCOLL = '';
	}

	if (intModelAge <= 2 && vehicleType == 'PPA' 
		&& vehicleLeased == 'false' && vehicleUsed == 'false' 
		&&	strCOMP.length > 0 && (strCOLL.length > 0 || strLTMCOLL.length > 0) ){
		return true;
	}
	return false;
}

function loanLeaseAll(){
	var cols = '.multiTable';
	$('.clsLoan',cols).each(function(){
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
	strIndex = parseOffIndex(loalLease.id);
	var strVehicleType =  $('#vehTypeCd_' + strIndex).val();
	var strUpgradePackage =  $('#UPGR_PAK_' + strIndex).val();
	var newValue = '';
	if(loanLeaseEligible(strIndex)){
		//Defect 44097 - New Requirement
		if ((strVehicleType == PRIVATE_PASSENGER_CD) && (strUpgradePackage == "PREM_PAK") && $('#upgradePackErrorExists').val()!='true'){
			$('#LOAN_ALA_Select_' + strIndex).val('').addClass('hidden').trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#LOAN_ALA_Unavailable_' + strIndex).addClass('hidden');
			$('#LOAN_ALA_limit_' + strIndex).val('');
			$('#LOAN_ALA_Included_' + strIndex).removeClass('hidden');
		}else{
			// show drop down for this vehicle
			$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
			$('#LOAN_ALA_Unavailable_' + strIndex).addClass('hidden');
			newValue = $('#LOAN_ALA_limit_' + strIndex).val();
			//46918 - Should be NO if no value comes from P* for existing vehicles
			//49436 - Teachers - loan/lease gap coverage not defaulting to select for newly added vehicles
			if(isEndorsement() && newValue=='' && $('#endorsementVehicleAddedInd_'+strIndex).val()==''){
				newValue='No';
			}
			$('#LOAN_ALA_limit_' + strIndex).val(newValue);
			$('#LOAN_ALA_Select_' + strIndex).removeClass('hidden').val(newValue).trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
	}else{
		// show "Unavailable" for this vehicle NCR_ALA_Unavailable_
		$('#LOAN_ALA_Included_' + strIndex).addClass('hidden');
		newValue = '';
		$('#LOAN_ALA_Select_' + strIndex).addClass('hidden').val(newValue).trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#LOAN_ALA_Unavailable_' + strIndex).removeClass('hidden');
		$('#LOAN_ALA_limit_' + strIndex).val(newValue);
	}
}

function setLoanLease(LoanLease_Select){
	//updates Loan Lease Limit sf hidden var with just selected value from non-sf dropdown
	strIndex = parseOffIndex(LoanLease_Select.id);
	$('#LOAN_ALA_limit_' + strIndex).val(LoanLease_Select.value);
}

function loanLeaseAll(){
	var cols = '.multiTable';
	$('.clsLoan',cols).each(function(){
		loanLease(this);
	});
}

function loanLeaseEligible(strIndex){
	var vehicleType = $('#vehTypeCd_'+strIndex).val();
	var newValue = $('#LOAN_ALA_limit_' + strIndex).val();
	if(vehicleType == 'PPA' && isEndorsement() && newValue == 'Yes'){
		return true;
	}
		var intCurrentYear = parseInt($('#currentYear').val());
		var intModelYear = parseInt($('#modelYear_' + strIndex).val());
		var intModelAge = intCurrentYear - intModelYear;
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
		if (vehicleType == 'PPA' && intModelAge <= 5 &&
			strCOMP.length > 0 && (strCOLL.length > 0 || strLTMCOLL.length > 0)){
			return true;
		}
		return false;
}

function extraPIPSelected(){
	var blnExtraPIPSelected = false;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	var cols = '.multiTable';
	$('.clsEXTRA_PIP_Limit',cols).each(function(){
		//35878-Coverages- If select No extra PIP - The Extra PIP applies still displays and is required, and it should NOT display
 		if (this.value != '' && this.value != 'No Extra PIP Option'){
 			blnExtraPIPSelected = true;
		}
	});
	if(!blnExtraPIPSelected){
		$('.Extra_PIP_Applies').addClass('hidden');
		$('.clsExtraPIPApplies',cols).each(function(){
			$(this).val('').trigger('chosen:updated');
			showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);			
		});

	}else if(isAnyCarLikeVehicle){
		$('.Extra_PIP_Applies').removeClass('hidden');
		$('.clsExtraPIPApplies',cols).each(function(){
			//If Extra_PIP_Applies is blank and vehicle is not comp-only, show error
			if($.trim(this.value) == '' && $(this).prop('disabled')==false){
				showClearInLineErrorMsgsWithMap(this.id, 'ExtraPIPApplies.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
						parseOffIndex(this.id), errorMessages, addDeleteCallback);	
			}
		});
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
	if (strVehType == "PP Auto" ||  strVehType == PRIVATE_PASSENGER_CD || strVehType == ANTIQUE_CD || strVehType == CLASSIC_AUTO || strVehType == MOTOR_HOME_CD || strVehType == MOTORCYCLE_CD){
		blnCarLikeVehicle = true;
	}
	return blnCarLikeVehicle;
}

function showOrHideHtml(strElm, strVal) {
	if (strVal == 'show') {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).removeClass('hidden').trigger('chosen:styleUpdated');
		} else {
			$(strElm).css('display', 'block');
		}
	} else {
		if($(strElm).is('select:not(select[multiple])')){
			$(strElm).addClass('hidden').trigger('chosen:styleUpdated');
		} else {
			$(strElm).css('display', 'none');
		}
	}
}

function getVehID(strId){
	var n = strId.lastIndexOf("_");
	var vehID = strId.substring(n+1);
	return vehID;
}

function highlightAndFade(el,timeOutVal) {
	if(timeOutVal==null){timeOutVal=1000;}
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	//For required and optional fields
	// pretend focusd to remove background / watermark
	if ($(el).hasClass("required") || $(el).hasClass("optional")){
		$(el).trigger('focus');
	}
	if (el.type == 'select-one'){
		//modifying this for dropdown changes. 
		//$(el).addClass('autoChange').trigger('chosen:styleUpdated');
		$('#' + el.id +'_chosen a').addClass('autoChange');
		setTimeout(function(){
			//delayedWhite(el.id);
			//$('#' + el.id).removeClass('autoChange');
			//$('#' + el.id).trigger('chosen:styleUpdated');
			$('#' + el.id +'_chosen a').removeClass('autoChange');
		}, timeOutVal);
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

function hidePremiumsForInactiveRate(){
	if(!isEndorsement()){
		return;
	}
	var wasPremiumAffected = $('#defaultZeroedPremium').val();
	if(wasPremiumAffected != null && wasPremiumAffected != '') {
		//$('span.premextra_column').text('');
		$('span.clsPremiumAmtDisplay').text('');
	}
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
	$('.clsWaiverofDeductible[disabled]').prop('disabled', false).trigger('chosen:updated');
	$('.clsPIP_Deductible[disabled]').prop('disabled', false).trigger('chosen:updated');
	$('#upgradePackageModal').hide();
	if(isEndorsement()){
		$('.clsAccForg').prop('disabled', false).trigger('chosen:updated');
		$('.covRentEndr').prop('disabled', false).trigger('chosen:updated');
	}
	setSeqNums();
	
	$('.clsTNCCVG').each(function() {
		$(this).prop('disabled', false).trigger('chosen:updated');
	});
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
};

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
    updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageLeft(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideTableLeft(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), 1);
	$('#firstCoverage').val(firstCoverageVal);
	slideTableLeft(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), 1);
	updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageRight(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideTableRight(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), COVERAGES_PER_PAGE, 1);
	$('#firstCoverage').val(firstCoverageVal);
	slideTableRight(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), parseInt($('#coverageCount').val()), COVERAGES_PER_PAGE, 1);
	updateCoverageScrollPanel(SCROLL_PANEL);
}

function slideCoverageEnd(event) {
	var firstCoverageVal = $('#firstCoverage').val();
	slideToEnd(event, $('#slidingFrameHeadId'), $('#mainContentTableHead'),
			$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);
	$('#firstCoverage').val(firstCoverageVal);
	slideToEnd(event, $('#slidingFrameId'), $('#mainContentTableHead'),
			$('#firstCoverage'), $('#coverageCount'), COVERAGES_PER_PAGE);
    updateCoverageScrollPanel(SCROLL_PANEL);

}

function deleteVehicle(deleteLink) {	
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
	var vehicleCount = parseInt($('#coverageCount').val());
	var ppaVehicleCount = 0;
	var mhVehicleCount = 0;
	var mcVehicleCount = 0;
	var aqVehicleCount = 0;
	
	if (isEndorsement() && ($("#stateCd").val() == 'NJ' || $("#stateCd").val() == 'PA') && $('#yubiEnabled').val() == 'true') {
		var tncCvg = $('#TNC_CVG_' + columnIndex).val();
		if (tncCvg == 'B' || tncCvg == 'E' || tncCvg == 'D') {
			$('#endorsementVehicleTncReplaceModal').modal('show');
			return;
		} 
	}
	
	var isDeletedVehiclePPA = ($('#vehTypeCd_' +columnIndex).val()== 'PPA') ? true : false;
	var isDeletedVehicleMH = ($('#vehTypeCd_' +columnIndex).val()== 'MH') ? true : false;
	var isDeletedVehicleMC = ($('#vehTypeCd_' +columnIndex).val()== MOTORCYCLE_CD) ? true : false;
	var isDeletedVehicleAQ = ($('#vehTypeCd_' +columnIndex).val()== ANTIQUE_CD) ? true : false;
	var yearValue = $("#modelYear_" + columnIndex).val();	
	var makeValue = $("#make_" + columnIndex).val();
	var modelValue = $("#model_" + columnIndex).val();
	var stateCd = $("#stateCd").val();
	
	// Column 1 is the special initial column
	if (vehicleCount == 1) {
		confirmMessageWithTitle("Invalid Vehicle Delete", "You can't delete the last vehicle");
		return;
	} 
	// if the vehicle deleted is last of the vehicle type PPA then it should not be allowed to be deleted. 
	for(var i = 0 ; i < vehicleCount; i++){
		if($('#vehTypeCd_' +i).val()== PRIVATE_PASSENGER_CD){
			ppaVehicleCount++;
		}else if($('#vehTypeCd_' +i).val()== MOTOR_HOME_CD){
				mhVehicleCount++;		
		}else if($('#vehTypeCd_' +i).val()== MOTORCYCLE_CD){
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
	else if(stateCd == 'MA'){
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
	var deleteMsg = "Vehicle"+(" #" + (columnIndex + 1) + "-" + yearValue + " "+ makeValue + " "+ modelValue) +"<br> You are about to delete the above vehicle. Please confirm deletion";
	questionMessageForVehicle(deleteMsg, deleteLink, columnIndex, deleteAction);
}

//Modal window replaced with new design - is consistant with Drivers now 
function questionMessageForVehicle(messageText, deleteLink, columnIndex, action){
	var headerTitle, primButtonText;
	$('#question #yes').unbind('click');
	$('#question #no').hide();
	
	if(action.toUpperCase() == "DELETE_VEHICLE"){
		headerTitle = "WARNING!  Confirm Deletion";
		primButtonText = "Delete";
		$('#question #yes').click(function() {         
	    	$('#question').modal('hide');
	    	deleteVehicleColumn(columnIndex, deleteLink);    	
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

function deleteVehicleColumn(columnIndex, deleteLink) {
	var deleteColumn = $(deleteLink).closest('.multiColumnInd');
	var columnIndex = getColumnIndexNoHeader(deleteColumn);
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
	resetPremium($('#ratedInd').val(),$('#premAmt').val());
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
	
	if(row1.length>0 && row2.length>0){
		
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
	
	$("#mainContentTable").removeClass("inlineError");
	
}
// End new functions for sliding columns

//49764
function ifVehAdded() {
	var isVehAdded = false;
	$('.endVehicleAddedInd').each(function(){
	    var vehIndex = parseOffIndex(this.id);
	    var vehEndrRepInd = $('#endorsementVehicleReplacedInd_'+vehIndex).val();
		if($(this).val() == 'Yes' && vehEndrRepInd != undefined && vehEndrRepInd.length < 1){
			isVehAdded = true;
		}
	});
	return isVehAdded;
}

//MA 3.2.33
function checkAndSetUIM(OBI) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(OBI.id);
	var UIM = $('#UIM_' + strIndex).val();
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	
	if($('#firstTimeThru').val() == 'true' && OBI.value != '' && OBI.value != 'No Coverage' && UIM == '' && readyToFloodMA(vehTypeCode)){
		$('#UIM_' + strIndex).val("20,000/40,000").trigger('chosen:updated').removeClass('preRequired').trigger('chosen:styleUpdated');
	} 
	// turn edit events back on
	blnTriggerEdits = true;	
}

function checkAndSetUM(OBI) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(OBI.id);
	var UM = $('#UM_' + strIndex).val();
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	
	if(OBI.value != '' && OBI.value != 'No Coverage' 
			&& UM == '' && readyToFloodMA(vehTypeCode)){
		highlightAndFade($('#UM_' + strIndex)[0],500);
		$('#UM_' + strIndex).val("20,000/40,000").trigger('chosen:updated').removeClass('preRequired').trigger('chosen:styleUpdated');
	}
	// turn edit events back on
	blnTriggerEdits = true;	
}

function checkAndPIPLimit(PIP_LIMIT) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(PIP_LIMIT.id);
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	if(readyToFloodMA(vehTypeCode)){
		$('#PIP_Limit_' + strIndex).val("8,000").trigger('chosen:updated');
	}
	// turn edit events back on
	blnTriggerEdits = true;	
}

function checkAndSetBI(BI) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(BI.id);
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	
	if(BI.value != '' && BI.value != 'No Coverage' && readyToFloodMA(vehTypeCode)){
		$('#BI_' + strIndex).val("20,000/40,000").trigger('chosen:updated');
	}
	// turn edit events back on
	blnTriggerEdits = true;	
}

//52016 - Uninsured & Underinsured Motorist fields not following Default Requirements
function checkUMUIMOBI(thisField) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var UIM = $('#UIM_' + strIndex).val();
	var UM =  $('#UM_' + strIndex).val();
	var OBI =  $('#OBI_' + strIndex).val();
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	if(OBI != '' && OBI != 'No Coverage' 
			&& isNotBlank(UM) && isNotBlank(UIM)  
			&& (isLeftValLesser(OBI,UIM) || isLeftValLesser(OBI,UM)) 
			&& readyToFloodMA(vehTypeCode)){
		highlightAndFade($('#UIM_' + strIndex)[0],500);
		highlightAndFade($('#UM_' + strIndex)[0],500);
		$('#UIM_' + strIndex).val(OBI).trigger('chosen:updated').removeClass('preRequired').trigger('chosen:styleUpdated');	
		$('#UM_' + strIndex).val(OBI).trigger('chosen:updated').removeClass('preRequired').trigger('chosen:styleUpdated');
	}
	// turn edit events back on
	blnTriggerEdits = true;	
}

function isLeftValLesser(valLeft,valRight){
	var valLeftArr = valLeft.split('/');
	var valRightArr = valRight.split('/');
	return (parseInt(valLeftArr[0]) < parseInt(valRightArr[0])
			&& parseInt(valLeftArr[1]) < parseInt(valRightArr[1]));
}

function isLeftCSLValLesser(valLeft,valRight){
	var valLeftAmt = parseInt(valLeft.replace(/,/g, "").replace('CSL', ''));
	var varRightAmt =  parseInt(valRight.replace(/,/g, "").replace('CSL', ''));
	return (parseInt(valLeftAmt) < parseInt(varRightAmt));
}

function isLeftAmountValLesser(valLeft,valRight){
	if(valLeft=='' || valRight==''){
		return false;
	}
	return (parseInt(valLeft) < parseInt(valRight));
}

function isBlank(val){
	return (val==null || val=='');
}

function isNotBlank(val){
	return !isBlank(val);
}

function validateMultipleLimits(thisClass,currentType,defaultVal,errorExists){
	var strErrorID = '';
	var selectedValues = [];
	//TD 54829 - Optional Bodily Injury Edit firing incorrectly
	$(thisClass).each(function(){
		var thisVal = $(this).val();
		if(isNotBlank(thisVal) 
				&& $.inArray(thisVal,selectedValues,0) == -1
				&& thisVal != "No Coverage"){
			selectedValues.push(thisVal);
		}
	});
	if((selectedValues.length>2) || 
			(selectedValues.length==2 && $.inArray(defaultVal,selectedValues,0) == -1)){
		strErrorID = currentType+'.browser.inLine.mustBeSame';
	} //else{strErrorID = '';}
	$(thisClass).each(function(){
		var thisVal = $(this).val();
		if(strErrorID == '' && !errorExists){
			showClearInLineErrorMsgsWithMap(this.id, strErrorID, fieldIdToModelErrorRow['defaultMulti'], parseOffIndex(this.id), errorMessages, addDeleteCallback);
			if(currentType=='OBI'){validateOBI(this,false);}
			if(currentType=='UIM'){validateUIM(this);}
			if(currentType=='UM'){validateUM(this,false);}
			//if(currentType=='PD'){validateRequiredField(this);}
		} else{
			if(isNotBlank(thisVal) 
						&& thisVal!=defaultVal && thisVal!='No Coverage'){
				showClearInLineErrorMsgsWithMap(this.id, strErrorID, fieldIdToModelErrorRow['defaultMulti'], parseOffIndex(this.id), errorMessages, addDeleteCallback);	
			}
		}
	});
}

function validateUMUIMOBI(thisField){
	if(validateOBI(thisField,$(thisField).hasClass('clsOBI')) || validateUIM(thisField) || validateUM(thisField,$(thisField).hasClass('clsUM')))
		return true;
	else
		return false;
}

function validateUM(thisField,fireReqdEntryEdit) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var strErrorID = '';
	var UM =  $('#UM_' + strIndex).val();
	var OBI =  $('#OBI_' + strIndex).val();
	
	//3.3.21 Uninsured Motorist (Part 3) limit must be 20/40 if no OBI 
	//(Part 5) limit is selected and the vehicle is not a comp only vehicle.  
	if($('#COMP_ONLY_'+strIndex).val() != 'Y' 
			&& (isBlank(OBI) || OBI == 'No Coverage') 
			&& UM != '20,000/40,000'
			//&& isNotBlank(UM)
			){
		strErrorID = 'UM.browser.inLine.UM_IF_NO_OBI';
		hasError = true;
	}
	
	showClearInLineErrorMsgsWithMap('UM_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
	
	if(fireReqdEntryEdit && strErrorID=='' && $('#COMP_ONLY_'+strIndex).val() != 'Y' && $('#UM_' + strIndex)[0]!=null){
		strErrorID = validateRequiredField($('#UM_' + strIndex)[0]);
	}
	// turn edit events back on
	blnTriggerEdits = true;
	return strErrorID!='';
}

function validateOBI(thisField,fireReqdEntryEdit) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var UM =  $('#UM_' + strIndex).val();
	var OBI =  $('#OBI_' + strIndex).val();
	var strErrorID = '';
	if(isNotBlank(UM) && isNotBlank(OBI) 
			&& UM != 'No Coverage' && OBI != 'No Coverage'){
		if(isLeftValLesser(OBI,UM)){
			strErrorID = 'OBI.browser.inLine.OBI_GREATER_THAN_UM';
			hasError = true;
		}
	}
	showClearInLineErrorMsgsWithMap('OBI_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
	if(fireReqdEntryEdit && strErrorID=='' && $('#OBI_' + strIndex)[0]!=null){
		strErrorID=validateRequiredField($('#OBI_' + strIndex)[0]);
	}
	// turn edit events back on
	blnTriggerEdits = true;	
	return strErrorID!='';
}

function validateUIM(thisField) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var UIM = $('#UIM_' + strIndex).val();
	var UM =  $('#UM_' + strIndex).val();
	var OBI =  $('#OBI_' + strIndex).val();
	var strErrorID = '';
	
	//UIM can be blank as per FIELDS doc
	//validateRequiredField($('#UIM_' + strIndex));
	
	//52308 - UIM should be selected if OBI is not
		if(OBI == '' || OBI == 'No Coverage'){
			if($('#COMP_ONLY_'+strIndex).val() != 'Y' 
				//53014 - Edit getting fired without even touching the OBI field
				&& (UIM!='' && UIM != 'No Coverage' 
						&& UIM != '20,000/40,000')){
				strErrorID = 'UIM.browser.inLine.UIM_WHEN_OBI_SELECTED';
			}
		}
		
		if(isNotBlank(UIM) && UIM != 'No Coverage'){
			if(strErrorID==''){
				if(isNotBlank(OBI) && OBI != 'No Coverage'){
					if(isLeftValLesser(OBI,UIM)){
						strErrorID = 'UIM.browser.inLine.OBI_GREATER_THAN_UIM';
					}
				} 
			}
			if($('#maConvRollout').val() != "Yes"){
				//MA Conv fix, dont show this error
				if(strErrorID=='' 
					&& isNotBlank(UM) && UM != 'No Coverage'){
				if(UIM != UM){
					strErrorID = 'UIM.browser.inLine.UIM_UM_SHOULD_MATCH';
				}
		}
			}
		}

	showClearInLineErrorMsgsWithMap('UIM_' + strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
	// turn edit events back on
	blnTriggerEdits = true;	
	return strErrorID!='';
}

function validateGuestCoverage(thisField) {
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var strErrorID = '';
	var GC =  $('#' + thisField.id).val();
	var vehTypeCode = $('#vehTypeCd_'+strIndex).val();
	if(vehTypeCode == 'MC' && GC == ''){
		strErrorID = 'GC.browser.inLine.Select_GuestCoverage';
		showClearInLineErrorMsgsWithMap(thisField.id, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
	}
	//	turn edit events back on
	blnTriggerEdits = true;	
}

function showHidePIPDedAppliesTo(thisElem){
	var retainRow = false;
	if(thisElem!=null && $(thisElem).val()!=null){
		retainRow = ($(thisElem).val()!= '' && $(thisElem).val()!='0');
	} else{
		var cols = '.multiTable';
		$('.clsPIP_Deductible',cols).each(function() {
			if(this.value!=null && this.value!='' && this.value!='0'){
				retainRow = true;
				return false;
			}
		});
	}
	if(!retainRow){
		$('.clsPIPAppliesTo').hide();
		$('.clsPRINC_PIPLimit').each(function(){
			showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'], parseOffIndex(this.id), errorMessages, addDeleteCallback);
		});	
	} else{
		$('.clsPIPAppliesTo').show();
		$('#PRINC_PIP_Error_Error,#PRINC_PIP_Error_Header').show();
		if($('#firstTimeThru').val()=='true'){
			$('.clsPRINC_PIPLimit').addClass('preRequired');
		}else{
			$('.clsPRINC_PIPLimit').each(function(){
				if(this.value==''){
					showClearInLineErrorMsgsWithMap(this.id, 'PRINC_PIP.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'], parseOffIndex(this.id), errorMessages, addDeleteCallback);	
				} else{
					showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'], parseOffIndex(this.id), errorMessages, addDeleteCallback);
				}
			});		
		}
	}
}

function showHideGuestCoverage(){
	var retainRow = false;
	var cols = '.multiTable';
	$('.clsGC',cols).each(function() {
		strIndex = parseOffIndex(this.id);
		var OBI =  $('#OBI_' + strIndex).val();
		//validateGuestCoverage(this);
			if ($('#vehTypeCd_'+strIndex).val() == 'MC' && OBI != '' && OBI != 'No Coverage') {
				retainRow = true;
			}
	});
	if(!retainRow){
		//52370 - Alignment on coverages tab breaks when we have PP and MC and errors on the page
		//Using "hidden" is causing alignment issues.
		$('.clsGuestCoverage').hide();
		$('#GC_Error,#GC_Error_Header').hide();
	} else{
		//Using "hidden" is causing alignment issues.
		$('.clsGuestCoverage').show();
		$('#GC_Error,#GC_Error_Header').show();
		//53046
		addPreRequiredStyle($('.clsGC'));
	}
}

//function name is wrong, can be used to validate all others too
function validateMCVehicles(thisField,selectorClass,thisElemId,errorExists){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var strErrorID = '';
	var thisValue = $('#'+thisElemId+'_'+strIndex).val();
	
	//Specially for comp only scenario
	if(isBlank(thisValue)){
		$(selectorClass).each(function(){
			if (isNotBlank(this.value) && this.value!='0'){
				thisValue=this.value;
				return false;
			}
		});	
	}
	
	$(selectorClass).each(function(){
		var thisIndex = parseOffIndex(this.id);
		if (this.value != thisValue && !isCompOnlyVehicle(thisIndex)){
			if('NH' == $('#stateCd').val() || 'CT' == $('#stateCd').val()){
				strErrorID = thisElemId+'.browser.inLine.mustBeSameNHCT';
			}else{
			strErrorID = thisElemId+'.browser.inLine.mustBeSame';
			}
			return false;
		}
	});	
	
	$(selectorClass).each(function(){
		var thisIndex = parseOffIndex(this.id);
		if(!isCompOnlyVehicle(thisIndex) && !errorExists){
			showClearInLineErrorMsgsWithMap(this.id, strErrorID, fieldIdToModelErrorRow['defaultMulti'],thisIndex, errorMessages, addDeleteCallback);
		}
	});			
	
	// turn edit events back on
	blnTriggerEdits = true;	
}

//54867 and 54912 fix This function is called for MA to check if coverage limes are same for same type of vehicles, ignore MC for PIP, Deductibles, MPs etc
function validateMCVehiclesMA(thisField,selectorClass,thisElemId,errorExists){
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
	strIndex = parseOffIndex(thisField.id);
	var strErrorID = '';
	var thisValue = $('#'+thisElemId+'_'+strIndex).val();
	
	//Specially for comp only scenario
	if(isBlank(thisValue)){
		$(selectorClass).each(function(){
			if (isNotBlank(this.value) && this.value!='0'){
				thisValue=this.value;
				return false;
			}
		});	
	}
	
	$(selectorClass).each(function(){
		var thisIndex = parseOffIndex(this.id);
		if ($('#vehTypeCd_'+strIndex).val() !='MC' && $('#vehTypeCd_'+thisIndex).val() !='MC' && this.value != thisValue && !isCompOnlyVehicle(thisIndex)){			
			strErrorID = thisElemId+'.browser.inLine.mustBeSame';			
			return false;
		}
	});	
	
	$(selectorClass).each(function(){
		var thisIndex = parseOffIndex(this.id);
		if(!isCompOnlyVehicle(thisIndex) && !errorExists){
			showClearInLineErrorMsgsWithMap(this.id, strErrorID, fieldIdToModelErrorRow['defaultMulti'],thisIndex, errorMessages, addDeleteCallback);
		}
	});			
	
	// turn edit events back on
	blnTriggerEdits = true;	
}

function validateLimitColl(thisField) {
	if ($('#stateCd').val()=='MA') {
		// do not fire any edit events during this logic
		blnTriggerEdits = false;
		strIndex = parseOffIndex(thisField.id);
		var strErrorID = '';
		var LimitCollVal = $('#LMTD_COLL_'+ strIndex).val();
		var collVal = $('#COLL_'+ strIndex).val();
		var compVal = $('#COMP_'+ strIndex).val();

		//02/02/2015 vehicle shouldn't have collision and Limited collision both selected if it is not leased/financed 

		//03/19/2015 52172 - Collision and Limited Collision deductible cannot both be selected
		//if ($('#vehicleLeased_' + strIndex).val() != 'true'
		//		&& $('#vehicleFinancedOrLeased_' + strIndex).val() != 'true'){
		if (collVal != '' && collVal != 'No Coverage' && LimitCollVal != '' && LimitCollVal != 'No Coverage'){
			strErrorID = 'LMTD_COLL.browser.inLine.LC_CannotBeWith_COLL';
			showClearInLineErrorMsgsWithMap('LMTD_COLL_'+strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		}else if(collVal != '' && collVal == 'No Coverage'){
			showClearInLineErrorMsgsWithMap('LMTD_COLL_'+strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
		}
		//}

		//MA:For all NB and Endorsement non MAIP policies. Comprehensive coverage is required if a vehicle has Limited Collision coverage.
		if ($('#stateCd').val()=='MA') {
			if ( !isEndorsement() || (isEndorsement() && !isMaipPolicy()) ) {
				if ( LimitCollVal != '' && LimitCollVal != 'No Coverage' && (compVal == '' || compVal == 'No Coverage') ) {
					strErrorID = 'COMP.browser.inLine.COMP_REQUIRED_IF_LMTD_COLL_EXISTS';
					showClearInLineErrorMsgsWithMap('COMP_'+strIndex, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
				} /*else{
					showClearInLineErrorMsgsWithMap('COMP_'+strIndex, '', fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
				}*/
			}
		}

		// turn edit events back on
		blnTriggerEdits = true;	
	}
}

//2.3
function floodBItoUM(cov){
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
	blnTriggerEdits = false;
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    var idIndex = thisId.substring(n+1,n.length);
    var currVehTypeCode = null;
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {
    	if($(this).hasClass("clsBILimit") || $(this).hasClass("clsUM")){
			nextId = this.id;
			n = nextId.lastIndexOf("_");
		    stub = nextId.substring(0, n+1);
		    idIndex = nextId.substring(n+1,n.length);
		    currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
		    if($('#COMP_ONLY_'+idIndex).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
		    if(nextId != thisId){
    			if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
    				$('#' + this.id).val(newSelection).trigger('chosen:updated');
			    	if($(this).hasClass("clsBILimit")){
			    		validateRequiredField(this);
			    		//validateUMUIMBI(this);
			    	}
			    	if($(this).hasClass("clsUM")){
			    		validateRequiredField(this);
			    		//validateUMUIMBI(this);
			    	}
			    	highlightAndFade(this);
			    }
    		}
		}
    });
    // turn edit events back on
	blnTriggerEdits = true;
}

function floodLiabNHCT(cov){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
    // change the drop downs based on vehicle type - vehTypeCd_0,vehTypeCd_1 etc. etc.
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n);
    //select the id, of Type as _0,_1
    var idIndex = thisId.substring(n+1,n.length);
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    //TD 56161 fix - clsUM is used as UMUIM for NHCT 
    if(stub=='UMUIM'){
    	stub='UM';
    }
    $('.cls'+stub,cols).each(function() {
    	nextId = this.id;
    	if($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y'){
    		isVehicleCompOnly = true;		    	
    	} else{
    		isVehicleCompOnly = false;
    	}
    	if(nextId != thisId){
    		n = nextId.lastIndexOf("_");
    		stub = nextId.substring(0, n+1);
    		idIndex = nextId.substring(n+1,n.length);
    		var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
    		if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
    			$('#' + this.id).val(newSelection).trigger('chosen:updated');
    			validateRequiredField(this);
    			highlightAndFade(this);
    		}

    	}
    });

    // turn edit events back on
	blnTriggerEdits = true;
}

function floodUMtoBI(cov,clsName){
	var cols = '.multiTable';
	blnTriggerEdits = false;
	$('select.cls'+clsName,cols).each(function(){
		  var strIndex = parseOffIndex(this.id);
		  var currVehTypeCode = $('#vehTypeCd_'+strIndex).val();
		  if(readyToFlood(currVehTypeCode)){
			  $(this).val(cov.value).trigger('chosen:updated');
			  highlightAndFade(this);
			  validateRequiredField(this);
		  }
	});
	blnTriggerEdits = true;
}

function checkPDandUMLimitForBISelected(biPDCov){
	var strError = '';
	var cols = '.multiTable';
	$('.clsBILimit',cols).each(function() {
		var biId = this.id;
		var biValue = this.value;
		var n = biId.lastIndexOf("_");
		var idIndex = biId.substring(n+1,n.length);
		var strIndex = parseInt(idIndex);

		var pdId = ['PD_'+idIndex,'UMUIM_'+idIndex];
		$(pdId,cols).each(function(){
			strError = '';
			n = this.lastIndexOf("_");
			var errorCov = this.substring(0,n);
			var pdValue = $('select[id^='+ this +']').val();
			var id = errorCov+'_'+strIndex;
			if(biValue !=null && biValue != '' && pdValue !=null && pdValue != ''){
				if (biValue.indexOf('CSL') >= 0 && pdValue.indexOf('CSL') < 0 ){
					strError = errorCov+'.browser.inLine.Select_'+errorCov+'_csl_limitNHCT';
				}
				if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') >= 0 ){
					strError = errorCov+'.browser.inLine.'+errorCov+'_limit_ShouldBeSplit';
				}
				if(!bothCSL(biValue,pdValue) && pdValue.indexOf('CSL') < 0){
					strError = errorCov+'.browser.inLine.Select_'+errorCov+'_csl_limitNHCT';
					strIndex = parseInt(strIndex);
				}
				if(biValue.indexOf('/') > 0 && pdValue.indexOf('CSL') < 0 ){
					strError = '';
					strIndex = parseInt(strIndex);
				}
				showClearInLineErrorMsgsWithMap(id, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
			}
		});
	});
}

function additionalCheckUMLimitForBISelected(biCov){
	var strError = '';
	var n = biCov.id.lastIndexOf("_");
	var idIndex = biCov.id.substring(n+1,n.length);
	var biValue = $('#BI_'+idIndex).val();
	var strIndex = idIndex;
	var cols = '.multiTable';

	$('.clsUM',cols).each(function(){
		strError = '';
		var pdValue = $(this).val();
		if(biValue !=null && biValue != '' && pdValue !=null && pdValue != ''){
			if($('#stateCd').val() == 'CT'){
				var blnResult = false;
				if(biValue.indexOf('CSL') < 0 && pdValue.indexOf('CSL') <0 ){
					var strPDValue = pdValue.replace(/,/g, "").split('/');
					var PDSplitFirst = parseInt(strPDValue[0]);
					var PDSplitSecond = parseInt(strPDValue[1]);
					
					var strBIValue = biValue.replace(/,/g, "").split('/');
					var BISplitFirst = parseInt(strBIValue[0]);
					var BISplitSecond = parseInt(strBIValue[1]);
					
					//var arrSecondCov = strSecondCov.split('/');
					if((BISplitFirst*2) < PDSplitFirst  || (BISplitSecond*2) < PDSplitSecond ){
						blnResult = true;
					}
				}else if(biValue.indexOf('CSL') > 0 && pdValue.indexOf('CSL') > 0 ){
					var strPDValue = parseInt(pdValue.replace(/,/g, "").replace('CSL', ''));
					var strBIValue = parseInt(biValue.replace(/,/g, "").replace('CSL',''));
					if((strBIValue*2) < strPDValue){
						blnResult = true;
					}
				}
				if(blnResult){
					strError = 'UMUIM.browser.inLine.UM_Twice_Of_BI';
					strIndex = parseOffIndex(this.id);
					showClearInLineErrorMsgsWithMap(this.id, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
				}
			}
			if($('#stateCd').val() == 'NH' && biValue != pdValue){
				strError = 'UMUIM.browser.inLine.mustBeSame_NH';
				strIndex = parseOffIndex(this.id);
				showClearInLineErrorMsgsWithMap(this.id, strError, fieldIdToModelErrorRow['defaultMulti'],strIndex, errorMessages, addDeleteCallback);
			}
			
		}
	});
}


var fieldIds =
{
	"coverageVehicle.BI":"BI",
	"coverageVehicle.PD":"PD",
	"coverageVehicle.UMUIMBI":"UMUIMBI",
	"coverageVehicle.UMUIMPD":"UMUIMPD",
	"coverageVehicle.PRINC_PIP":"PRINC_PIP",
	"coverageVehicle.PRINC_PIP_HCPNAME":"PRINC_PIP_HCPNAME",
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
	"coverageVehicle.RR":"RR",
	"coverageVehicle.UMBI":"UMBI",
	"coverageVehicle.UIMBI":"UIMBI",
	"coverageVehicle.FPBP":"FPBP",
	"coverageVehicle.CFPB":"CFPB",
	"coverageVehicle.MB":"MB",
	"coverageVehicle.ILB":"ILB",
	"coverageVehicle.ADB":"ADB",
	"coverageVehicle.FEB":"FEB",
	"coverageVehicle.EMB":"EMB"
};

var fieldIdToModelErrorRow =
{"defaultSingle":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "defaultMulti":"",
 "pageErrorData.priorCarrierInsCdName":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>"};


//PA_AUTO
function floodBIPA(cov){
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
	blnTriggerEdits = false;
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    var idIndex = thisId.substring(n+1,n.length);
    var currVehTypeCode = null;
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {    	
    	if($(this).hasClass("clsBILimit") || $(this).hasClass("clsUMLimit") || $(this).hasClass('clsPDLimit') || $(this).hasClass('clsUIMLimit')
    						|| $(this).hasClass("clsUMStacked") || $(this).hasClass("clsUIMStacked")){
			nextId = this.id;
			n = nextId.lastIndexOf("_");
		    stub = nextId.substring(0, n+1);
		    idIndex = nextId.substring(n+1,n.length);
		    currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
		    if($('#COMP_ONLY_'+idIndex).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
		    if(nextId != thisId){
    			if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
    				$('#' + this.id).val(newSelection).trigger('chosen:updated');
			    	if($(this).hasClass("clsBILimit")){
			    		validateRequiredField(this);
			    		validateUMBI(this);
			    		validateUIMBI(this);
			    	}
			    	if($(this).hasClass("clsUMLimit")){
			    		validateUMBI(this);
			    	}
			    	if($(this).hasClass("clsPDLimit")){
			    		validateRequiredField(this);
			    		//validateUMUIMPD(this);
			    	}
			    	if($(this).hasClass("clsUIMLimit")){
			    		validateUIMBI(this);
			    	}
			    	if($(this).hasClass("clsUMStacked")){
			    		validateUMUIMStacked(this);
			    	}
			    	if($(this).hasClass("clsUIMStacked")){
			    		validateUMUIMStacked(this);
			    	}
			    	highlightAndFade(this);
			    }
    		}
		}
    });
  //when it's BI Or PD overflow it in the limits
    if(stub == 'BI_'){
    	floodLimitsBI(stub,newSelection,currVehTypeCode,false);
    }
    // turn edit events back on
	blnTriggerEdits = true;
}

//PA_AUTO
function validateUIMBI(fieldThis) {
	var strBIID = '';
	var strUIMBI = '';
	var strErrorID = '';
	var strID = '';
	strID = fieldThis.id;
	if (strID.substring(0,2) == 'BI'){
		strBIID = strID;
		strUIMBI = strBIID.replace('BI_', 'UIMBI_');
	}else{
		strUIMBI = strID;
		strBIID = strUIMBI.replace('UIMBI_', 'BI_');
	}
	var strIndex = parseOffIndex(strUIMBI);
	var strBIValue = $('#' + strBIID).val();
	var strUIMBIValue = $('#' + strUIMBI).val();
	
	if(strUIMBIValue == null || strUIMBIValue == ''){
		strErrorID =  'UIMBI.browser.inLine.valid_valueCheck';
	}
	
	if(strBIValue != null && strUIMBIValue != null && strBIValue != '' && strUIMBIValue != ''){
		if (isSecondCovHigher(strBIValue, strUIMBIValue)){
			strErrorID = 'UIMBI.browser.inLine.BI_SplitLimit_CanNot_Be_LessThan_UM_UIM_SplitLimits';
		}
		if (strBIValue.indexOf('CSL') >= 0 && strUIMBIValue.indexOf('CSL') < 0 && strUIMBIValue !='No Coverage'){
			strErrorID = 'UIMBI.browser.inLine.UIM_limit_ShouldBeCSL';
		}
		if(strBIValue.indexOf('CSL') < 0 && strUIMBIValue.indexOf('CSL') >= 0){
			strErrorID = 'UIMBI.browser.inLine.UM_UIM_limit_ShouldBeSplit';
		}
	}
	showClearInLineErrorMsgsWithMap(strUIMBI, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}

//PA_AUTO
function validateUMBI(fieldThis) {
	var strBIID = '';
	var strUMBI = '';
	var strErrorID = '';
	var strID = '';
	strID = fieldThis.id;
	if (strID.substring(0,2) == 'BI'){
		strBIID = strID;
		strUMBI = strBIID.replace('BI_', 'UMBI_');
	}else{
		strUMBI = strID;
		strBIID = strUMBI.replace('UMBI_', 'BI_');
	}
	var strIndex = parseOffIndex(strUMBI);
	var strBIValue = $('#' + strBIID).val();
	var strUMBIValue = $('#' + strUMBI).val();
	
	if(strUMBIValue == null || strUMBIValue == ''){
		strErrorID =  'UMBI.browser.inLine.valid_valueCheck';
	}

	if(strBIValue != null && strUMBIValue != null && strBIValue != '' && strUMBIValue != ''){
		if (isSecondCovHigher(strBIValue, strUMBIValue)){
			strErrorID = 'UMBI.browser.inLine.BI_SplitLimit_CanNot_Be_LessThan_UM_UIM_SplitLimits';
		}
		if (strBIValue.indexOf('CSL') >= 0 && strUMBIValue.indexOf('CSL') < 0 && strUMBIValue !='No Coverage'){
			strErrorID = 'UMBI.browser.inLine.UM_limit_ShouldBeCSL';
		}
		if(strBIValue.indexOf('CSL') < 0 && strUMBIValue.indexOf('CSL') >= 0){
			strErrorID = 'UMBI.browser.inLine.UM_UIM_limit_ShouldBeSplit';
		}
	}
	showClearInLineErrorMsgsWithMap(strUMBI, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}

//PA_AUTO
/*
 * If coverage preferences for UM and UIM are not available, they should be taken 
 * from BI. 
 * 
 * Executed only during first time thru.
 * 
 * */	
function floodUMUIMLimitsOnPageLoad(){
	if($('#firstTimeThru').val() != 'true'){
		return;
	}
	var liabilityCode = 'BI_';
	var umCode = 'UMBI_';
	var uimCode = 'UIMBI_';
	var cols = '.multiTable';

	$('select[id^='+liabilityCode+']',cols).each(function(){
		var strIndex = parseOffIndex(this.id);
		if((this.value != '' && $('#'+umCode+strIndex).val() == '') || (this.value != '' && $('#'+uimCode+strIndex).val() == '')){
			floodLimitsBI(liabilityCode,this.value,$('#vehTypeCd_'+strIndex).val(),true);
			/*Exit once a PPA or MH is found*/
			return false;
		}
		/*Exit if BI is empty or UMUIM is already populated*/
		return false;
	});
	
}

//PA_AUTO
/**
* flood BI value to UM and UIM
*/
function floodLimitsBI(stub,newSelection,currVehTypeCode,pageLoad){
	var limitType = ["UMBI_","UIMBI_"];
	var isVehicleCompOnly = false;

	for(var index=0;index<2;index++){
		$('select[id^=' + limitType[index] + ']').each(function() {
			var strIndex = parseOffIndex(this.id);
			if($('#COMP_ONLY_'+strIndex).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
			if($(this).hasClass("clsUMLimit") || $(this).hasClass("clsUIMLimit")){
					if(readyToFlood(currVehTypeCode) && !isVehicleCompOnly){
					    	$(this).val(newSelection).trigger('chosen:updated');
					    	if($(this).hasClass("clsUMLimit")){
					    		validateUMBI(this);
					    		UMBISelected();
					    	}else{
					    		validateUIMBI(this);
					    		UIMBISelected();
					    	}
					    	if(!pageLoad){highlightAndFade(this);}
					}
			}
		});
	}
}

//PA_AUTO
/**
 * Display/Hide UM Stacked when UM is changed
 */
function UMBISelected(){
	var UMBIValueSelected = false;
	var UMBIValue = '';
	blnTriggerEdits = false;

	var cols = '.multiTable';
	$('.clsUMLimit',cols).each(function(){
 		if ((this.value != '' && this.value == 'No Coverage') || (this.value == '')){
 			UMBIValueSelected = true;
 			UMBIValue = this.value;
		}
	});
	if(UMBIValueSelected){
		$('.clsUMStacked',cols).each(function(){
			$(this).val(UMBIValue).trigger('chosen:updated');
			showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);
		});

	}else {
		$('.clsUMStacked',cols).each(function(){
			var strStackedValue = $(this).val().toLowerCase();
			if(strStackedValue.indexOf('stacked') == -1){
				$(this).val('Unstacked').trigger('chosen:updated');
				showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
						parseOffIndex(this.id), errorMessages, addDeleteCallback);
				highlightAndFade(this);	
			}
		});
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

/**
 * Display/Hide UIM Stacked when UIM is changed
 */
function UIMBISelected(){
	var UIMBIValueSelected = false;
	var UIMBIValue = '';
	blnTriggerEdits = false;

	var cols = '.multiTable';
	$('.clsUIMLimit',cols).each(function(){
 		if ((this.value != '' && this.value == 'No Coverage') || (this.value == '')){
 			UIMBIValueSelected = true;
 			UIMBIValue = this.value;
		}
	});
	if(UIMBIValueSelected){
		$('.clsUIMStacked',cols).each(function(){
			$(this).val(UIMBIValue).trigger('chosen:updated');
			showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);
		});

	}else {
		$('.clsUIMStacked',cols).each(function(){
			var strStackedValue = $(this).val().toLowerCase();
			if(strStackedValue.indexOf('stacked') == -1){
				$(this).val('Unstacked').trigger('chosen:updated');
				showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
						parseOffIndex(this.id), errorMessages, addDeleteCallback);
				highlightAndFade(this);				
			}
		});
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

//Validate UM and UIM Stacked value
function validateUMUIMStacked(fieldThis){
	
	var strStacked = fieldThis.id;
	var strErrorID = '';
	var strID = strStacked.split("_")[0];
	var UMUIMID = strStacked.replace("Stacked","BI");
	var strIndex = parseOffIndex(strStacked);
	var strStackedValue = $('#' + strStacked).val();
	var UMUIMLimit = $('#' + UMUIMID).val();
	
	if(strStackedValue == null || strStackedValue == ''){
		strErrorID =  strID+'.browser.inLine.valid_valueCheck';
	}
	
	if(UMUIMLimit != null && UMUIMLimit != "No Coverage"){
		if(strStackedValue != null && strStackedValue != ''){
			strStackedValue = strStackedValue.toLowerCase();
			if (strStackedValue.indexOf('stacked') == -1){
				strErrorID = strID+'.browser.inLine.Select_Stacked_Option';
			}
		} else{
			strErrorID = strID+'.browser.inLine.Select_Stacked_Option';
		}	
	}else{
		if(strStackedValue != null && strStackedValue != ''){
			strStackedValue = strStackedValue.toLowerCase();
			if (!(strStackedValue.indexOf('stacked') == -1)){
				strErrorID = strID+'.browser.inLine.No_Stacked_Option';
			}
		}
	}
	showClearInLineErrorMsgsWithMap(strStacked, strErrorID, fieldIdToModelErrorRow['defaultMulti'], strIndex, errorMessages, addDeleteCallback);
}

//PA_AUTO - Liab Flooding
function floodLiabPA(cov){
	//flood this change to same coverage on other vehicles
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
    // select by root id, such as BI_
    var n = thisId.lastIndexOf("_");
    var stub = thisId.substring(0, n+1);
    var idIndex = thisId.substring(n+1,n.length);
    var vehTypeCd = $('#vehTypeCd_'+idIndex).val();
    var isVehicleCompOnly = false; 
    var cols = '.multiTable';
    $('select[id^=' + stub + ']',cols).each(function() {
    	if($(this).hasClass("clsFloodLiab") || $(this).hasClass("clsEMB") || $(this).hasClass("clsTORT") ||
    	   $(this).hasClass("clsFPBP")	|| $(this).hasClass("clsCFPB")	||	$(this).hasClass("clsMB") ||
    	   $(this).hasClass("clsILB")	|| $(this).hasClass("clsADB")	||	$(this).hasClass("clsFEB")){
			nextId = this.id;
		    if($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y'){
		    	isVehicleCompOnly = true;		    	
		    } else{
		    	isVehicleCompOnly = false;
		    }
   			if(nextId != thisId){
    			n = nextId.lastIndexOf("_");
			    stub = nextId.substring(0, n+1);
			    idIndex = nextId.substring(n+1,n.length);
			    var currVehTypeCode = $('#vehTypeCd_'+idIndex).val();
			    if(isVehicleTypeSimilar(vehTypeCd,currVehTypeCode) && !isVehicleCompOnly){
			    	$('#' + this.id).val(newSelection).trigger('chosen:updated');
			    	validateRequiredField(this);
			    	highlightAndFade(this);
			    }

    		}
		}
    });

    // turn edit events back on
	blnTriggerEdits = true;
}

//Select coverages based on FPBP
function FPBPSelected(){
	var combinedPackage = false;
	var individualSel = false;
	blnTriggerEdits = false;

	var cols = '.multiTable';
	$('.clsFPBP',cols).each(function(){
		if(!($('#COMP_ONLY_'+parseOffIndex(this.id)).val() == 'Y')){
	 		if (this.value != '' && this.value == 'Combined Package'){
	 			combinedPackage = true;
			} else if(this.value != '' && this.value == 'Individual Selections'){
				individualSel = true;
			}else{
				validateRequiredField(this);
			}
		}
	});
	
	if(combinedPackage){
		hideIndividualSel();
		showCombinedPackage();
	}else if(individualSel){
		hideCombinedPackage();
		showIndividualSel();
	} else {
		hideIndividualSel();
		hideCombinedPackage();
	}
	// turn edit events back on
	blnTriggerEdits = true;
}

function hideIndividualSel(){
	var cols = '.multiTable';
	$('.individualSel').addClass('hidden');
	$('.clsMB',cols).each(function(){
		$(this).val('').trigger('chosen:updated');
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);			
	});
	$('.clsILB',cols).each(function(){
		$(this).val('No Coverage').trigger('chosen:updated');
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);			
	});
	$('.clsADB',cols).each(function(){
		$(this).val('No Coverage').trigger('chosen:updated');
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);			
	});
	$('.clsFEB',cols).each(function(){
		$(this).val('No Coverage').trigger('chosen:updated');
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);			
	});
}

function showCombinedPackage(){
	var cols = '.multiTable';
	$('.combinedPackage').removeClass('hidden');
	$('.clsCFPB',cols).each(function(){
		if($.trim(this.value) == '' && $(this).prop('disabled')==false){
			showClearInLineErrorMsgsWithMap(this.id, 'CFPB.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);	
		}	
	});
}

function hideCombinedPackage(){
	var cols = '.multiTable';
	$('.combinedPackage').addClass('hidden');
	$('.clsCFPB',cols).each(function(){
		$(this).val('').trigger('chosen:updated');
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);			
	});
}

function showIndividualSel(){
	var cols = '.multiTable';
	$('.individualSel').removeClass('hidden');
	$('.clsMB',cols).each(function(){
		if($.trim(this.value) == '' && $(this).prop('disabled')==false){
			showClearInLineErrorMsgsWithMap(this.id, 'MB.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);	
		}	
	});
	
	$('.clsILB',cols).each(function(){
		if($.trim(this.value) == '' && $(this).prop('disabled')==false){
			showClearInLineErrorMsgsWithMap(this.id, 'ILB.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);	
		}	
	});
	$('.clsADB',cols).each(function(){
		if($.trim(this.value) == '' && $(this).prop('disabled')==false){
			showClearInLineErrorMsgsWithMap(this.id, 'ADB.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);	
		}	
	});
	$('.clsFEB',cols).each(function(){
		if($.trim(this.value) == '' && $(this).prop('disabled')==false){
			showClearInLineErrorMsgsWithMap(this.id, 'FEB.browser.inLine.valid_valueCheck', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);	
		}	
	});
}

function validateEMB(cov){
	
	var newSelection = cov.value;
	var thisId = cov.id;
    var nextId;
	// do not fire any edit events during this logic
	blnTriggerEdits = false;
    var n = thisId.lastIndexOf("_");
    var idIndex = thisId.substring(n+1,n.length);

    var EMB = $('#EMB_'+idIndex).val();
    var MB = $('#MB_'+idIndex).val();
    var CFPB = $('#CFPB_'+idIndex).val().split('/');
    var min_MB_limit_err_msg = 'EMB.browser.inLine.min_medical_benifit_limit';
    var min_CFPB_limit_err_msg = 'EMB.browser.inLine.min_Combo_FirstParty_Benefits_Aggregate_Limit';
    var cols = '.multiTable';

    if(EMB != null && EMB != '' && EMB != 'No Coverage'){
    	// TD 71489 (PA Auto - change Extraordinary Medical Benefits edit from warning to hard edit)
    	if((MB != '' && MB != '100,000')){
    		$('.clsEMB',cols).each(function(){
    			showClearInLineErrorMsgsWithMap(this.id, min_MB_limit_err_msg, fieldIdToModelErrorRow['defaultMulti'],
    			parseOffIndex(this.id), errorMessages, addDeleteCallback);
    		});
    			
    	}else if((CFPB != '' && CFPB[0] == '50,000')){
    		$('.clsEMB',cols).each(function(){
    			showClearInLineErrorMsgsWithMap(this.id, min_CFPB_limit_err_msg, fieldIdToModelErrorRow['defaultMulti'],
    			parseOffIndex(this.id), errorMessages, addDeleteCallback);
    		});
    	}else {
    		$('.clsEMB',cols).each(function(){
    			showClearInLineErrorMsgsWithMap(this.id, "", fieldIdToModelErrorRow['defaultMulti'],
    			parseOffIndex(this.id), errorMessages, addDeleteCallback);
    		});
    	}
    	
    }
	// turn edit events back on
	blnTriggerEdits = true;
}

function validateHCProviderName(providerNameObj){
	var providerName = providerNameObj.value;
	var regWordsarray = ['Medicare','Medicaid','Family Care','FamilyCare','New Jersey Family','NJ Family','TBD','TBA','NA','N/A'];
	var eligibility = true;
	
	for(i=0; i< regWordsarray.length ; i++){
		var isNotEligible = checkEligibility(regWordsarray[i],providerName);
		
		if(isNotEligible){
			eligibility =false;
			return eligibility;
		}
	}
	return eligibility;
}

function checkEligibility(regWord,providerName){
	var isNotEligible = false;
	switch(regWord){
	case 'Medicare':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'Medicaid':
		if(isContainValue(regWord,providerName)){
			isNotEligible =  true;
		}
	break;
	
	case 'Family Care':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'FamilyCare':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'New Jersey Family':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'NJ Family':
		if(isContainValue(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'TBD':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'TBA':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	case 'NA':
		if(isExactMatch(regWord,providerName)){
			isNotEligible =  true;
		}
	break;
	case 'N/A':
		if(isExactMatch(regWord,providerName)){
			isNotEligible = true;
		}
	break;
	
	}
	return isNotEligible; 
	
}

function isContainValue(regWord,providerName){
	//Replace the blank spaces between words and make it lower case 
	var regWordlowerCase = regWord.toLowerCase().replace(/\s/g,'');
	var providerNamelowerCase = providerName.toLowerCase().replace(/\s/g,'');
	var m =providerNamelowerCase.search(regWordlowerCase);
	if(m.valueOf() != -1){
		if(checkChars(providerNamelowerCase)){
			return false
		}else return true;
	}else return false;
}

function isExactMatch(regWord,providerName){
	var regWordlowerCase = regWord.toLowerCase();
	var providerNamelowerCase = providerName.toLowerCase();
	var m =new RegExp('^'+regWordlowerCase+'$').test($.trim(providerNamelowerCase));
	if(m){
		return true;
	}else return false;
}


function checkChars(providerNamelowerCase){
	var containsSplChars = false;
	var regex = /^[A-Za-z -]+$/i;
	console.log(providerNamelowerCase);
	if (!regex.test(providerNamelowerCase)) {
		containsSplChars = true;
	} 
	return containsSplChars;
}


function showDialogforPipValue(pipValue,HCProviderNameDDValue){	
	if(pipValue == "Secondary Full PIP" ){
		$('#inEligibleSec_Full').modal('show');
	}else if (pipValue=="Secondary Medical Expense Only"){
		$('#inEligibleSec_Med').modal('show');
	}
}

function changePrimaryInsuranceProvider(newSelection,hideHealthcarePName){
	var cols = '.multiTable';
	//newSelection='Primary Full PIP';
	
	$('.clsPRINC_PIPLimit',cols).each(function(event, result){						
		$('#' + this.id).val(newSelection).trigger('chosen:updated');
	});	
	
	
	$('.HC_Provider').addClass('hidden');
	$('.HC_Provider_Number').addClass('hidden');
	
	// and clear values
	$('input[id=HC_PROVIDER_NAME]').val('');
	$('input[id=HC_PROVIDER_NUMBER]').val('');
	$('input[id=HC_PROVIDER_NAME_limit]').val('');
	$('input[id=HC_PROVIDER_NUMBER_limit]').val('');
	if(hideHealthcarePName){
		$('.HC_Provider_ShowHide').addClass('hidden');
		$('.clsPRINC_PIP_HCPNAMELimit',cols).each(function(event, result){						
			removePreRequiredStyle($(this));
			$(this).val("");
			showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
					parseOffIndex(this.id), errorMessages, addDeleteCallback);
		});
	}
	
	
	//36894-application-Issues on the Coverage Section
	//$('input[id^="HC_PROVIDER_NAME_DISPLAY_"]',cols).each(function(event, result){
	$('.clsHCProviderName',cols).each(function(event, result){						
		removePreRequiredStyle($(this));
		$(this).val("");
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);
	});
	
	//$('input[id^="HC_PROVIDER_NUMBER_DISPLAY_"]',cols).each(function(event, result){
	$('.clsHCProviderNumber',cols).each(function(event, result){						
		removePreRequiredStyle($(this));
		$(this).val("");
		showClearInLineErrorMsgsWithMap(this.id, '', fieldIdToModelErrorRow['defaultMulti'],
				parseOffIndex(this.id), errorMessages, addDeleteCallback);
	});

}