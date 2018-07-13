jQuery(document).ready(function() {	
	
	if($('#continueWithIssue').val() == "true"){
		blockUser();
		document.aiForm.action = "/aiui/summary/endorsement/issue";
		$("#nextTab").val("forms");
		document.aiForm.submit();
	}
	
	$('.payPlanMsg').addClass('hidden');
	//46144-Rate button is still enabled after issuing EN
	if('Yes' == $('#readOnlyMode').val() && isEndorsement()){
		$("#rateEndorsement").prop("disabled",true);
	}
	
	if(document.getElementById('endorsementModeId').value =='true'){
		if( $('.ordrRptForDrvrAfterConvertToIssue').length > 0){
			$('#exclaimationId').removeClass('hidden');
		} else  {			
			$('#exclaimationId').addClass('hidden');
		}
	}
	//if($('#orderCompleteFlag').val() =='false'){ 
	if(document.getElementById('isQuote').value !='true'){
		if($('#orderCompleteFlag').val() =='false' && document.getElementById('endorsementModeId').value =='true' 
			&& $('#newEndorsementRatedDriver').val() == 'true'){	
			$('#issueButtonId').addClass('hidden');
		}
	}
	
	
	//60004-Data not retained in dialog after successfully sending to EZLynx
	if(isValidValue($("#exLynxReason").val())){
		var ezLynxReasonCd = $("#exLynxReason").val();
		if($("#hasEZLynxAltRate").val() == "true" &&  $("#hasEZLynxHighRisk").val() == "true"){
			$('#reasonEZLynx').prop("value",ezLynxReasonCd).attr('selected','selected');
			$('#reasonEZLynx').trigger('chosen:updated');
		}
		if(isValidValue(ezLynxReasonCd)){
			$("#exLynxReasonCodeSuccess").val(ezLynxReasonCd);
		}
	}
	    
	if(isValidValue($("#exLynxPolNum").val())){
		var ezLynxPolNum = $("#exLynxPolNum").val();
		$("#numberEZLynx").val(ezLynxPolNum);
		$("#exLynxPolicyNumberSuccess").val(ezLynxPolNum);
	}
	
	if(isValidValue($("#exLynxUser").val())){
		var ezLynxUser = $("#exLynxUser").val();
		$("#userNameEZLynx").val(ezLynxUser);
		$("#exLynxUserSuccess").val(ezLynxUser);
	}
		
	if(document.getElementById('endorsementModeId').value =='true' && $('#orderCompleteFlag').val() =='true'){
		$('#orderReportId').addClass('hidden');
	}
	/*if we land to summary from any page even through server rediret we make sure
	summary has active premium*/
	 var processErrorInfoSel = $('#processErrorInfo').val();
	 var pageErrorInfoSel = $('#pageErrorInfo').val();
	 var uwMessageInfoSel = $('#uwMessageInfo').val();
	 var isRated =  $('#ratedInd').val();
	 var originalPremAmt = $('#premAmt').val();
	 var sourceType =  $('#sourceType').val();
	 var ratingFlag = $('#ratingFlag').val();
	 var redirectedFromCoverageRate = $('#redirectedFromCoverageRate').val();
	 var showPrefillWindow = $('#showPrefillWindow').val();	
	 var convertedToIssueMode = $('#convertedToIssueMode').val(); 
	 
	 /* for to scroll screen for shift tab */
	 $('.firstTabbleElement').on("focus", function(){
		 window.scrollTo(60,0);
	 });
	 $('#discountsLink').on('keydown', function(event){
		 var keyCode = event.keyCode || event.which;
		 if(keyCode == 9 && event.shiftKey) {
			window.scrollTo(60,0);
		}
	 }); 
	 $('.clsPrefillLink').on('keydown', function(event){
		 var keyCode = event.keyCode || event.which;
		if(keyCode == 9 && event.shiftKey) {
			window.scrollTo(60,80);
		}
	 }); 
	 $('#logo').parent().attr('tabIndex', 6);
	 
	 $(".submitSummary").bind("click", function(){
			$('#quoteError').modal('hide'); 
			document.actionForm.action = '/aiui/summary';
			document.actionForm.method="GET";
			document.actionForm.submit();
	 });
	 
	 //show or hide view prefill link at report order status table.
	 showOrHidePrefillLink();
	 var fastTrackFlag1 = $('#fastTrackFlag').val();
	 var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if ( checkPrefillItemsAdded() ) {
		 // display fix now fix later 
		 showPrefillAddedItemsEdits();
	 }
	 else if(fastTrackFlag1 == "QUOTEERROR") {
		 $('#quoteError1').modal('show'); 
	 }
	 else if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 else if ('OrderReports' != sourceType 
			 && 'OrderMvrLicValidation' != sourceType
			 && 'Prefill' != sourceType 
			 && 'true' != showPrefillWindow 
			 && 'true' != convertedToIssueMode 
			 && 'Yes' != $('#readOnlyMode').val() 
			 && (processErrorInfoSel == null || processErrorInfoSel.length == 0)
			 && (ratingFlag == null || $.trim(ratingFlag) == '')
			 && (pageErrorInfoSel == null || pageErrorInfoSel.length == 0)) {
		 	rateOnSummary();
	 }
	 else if (convertedToIssueMode == 'true' && (processErrorInfoSel == '' || processErrorInfoSel.length == 0)) {
		 // display modal for order mvr reports for any drivers not ordered/unsucessful
		 if ($('.ordrRptForDrvrAfterConvertToIssue').length > 0) {
			 $('#divOrdReportsAfterConvertToIssue').modal('show'); 
		 }
	 }
	 else{
		 	var fastTrackFlag = $('#fastTrackFlag').val();
		 	var orderMVRValidation = $('#orderMVRValidation').val();
			
			if(fastTrackFlag == "Yes") {
				 var orderComFlag = document.getElementById('orderCompleteFlag').value;//false
				 var isQuoteFlag = document.getElementById('isQuote').value;//false
				 var uReportAuthorized = document.getElementById('userReportAuthorized').value;//true
				 var isCreditOrdered = getCreditCheck();
				 var isMVRCheckRequired = getMVRCheckRequired();
				//53716 - Fast Track - NJ - presenting even when prefill is NOT fully Reconciled.
				if(isQuoteFlag != 'true' 
					&& uReportAuthorized == 'true' 
					&& orderComFlag=='true' 
					&& isCreditOrdered != 'No' 
					&& isMVRCheckRequired !='Yes' 
					&& $('#prefillReconciledInd').val() == 'Yes'
					&& $('#allVehiclesHaveActiveStatus').val() =="Y"
					&& $('#allDriversHaveValidRMVStatus').val() =="Y") {
					//$('#confirmBind').modal('show');
					var uwDecision = $("#uwDecision").val();
				   	if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DONOTBIND'){
				   		//submitBtnClickDoNotBindResponse();
				   	}else{
						 $('#confirmBind').modal('show'); 
				} 
			}
			}
			
			if (orderMVRValidation == "true"){
				   var orderComFlag = document.getElementById('orderCompleteFlag').value;//false
				   var isQuoteFlag = document.getElementById('isQuote').value;//false
				   var uReportAuthorized = document.getElementById('userReportAuthorized').value;//true
				   var isCreditOrdered = getCreditCheck();
				   var isMVRCheckRequired = getMVRCheckRequired();
				   
				   var premAmt = $('#premAmt').val();
				   var showInactiveRateModal = (premAmt=='' || premAmt == '0' || $('#premamt_change').css('display') != 'none');
				   
				   if(showInactiveRateModal){
					   $('#inactiveRateModal').modal('show');
				   }
				   //TD 53309 - 3pwf-39-App layer - prefill not reconciled - Submit clicked - incorrect msg
				   //else if(isQuoteFlag != 'true' && $('#prefillReconciledInd').val() != 'Yes'){
				   else if( isQuoteFlag != 'true' && $("#PREFILL_StatusDesc").val() != 'Successful - No Data' && $('#prefillReconciledInd').val() != 'Yes' ){ //As per prefill rewrite
					   if(!$('#prefillDialog').is(':visible')){
						   $('#prefillWarningModal').modal('show');
					   }
				   }
				   /*else if (isQuoteFlag !='true' && $('#policyHasDriverPermit').val() == "Y") {
						 $('#policyHasPermit').modal('show');
						 return;
					}*/
				   //Defect 43609 - Unsuccessful order should not stop SUBMIT workflow
				   else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && ($('.clshasNotOrderedYet').length > 0  || ($('#stateCd').val()=='MA' && $('.clsUnsuccessfulOrder').length > 0))){
					   $('#summeryTabWarningModal').modal('show');						

				   } 
				   else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && !isEmployee() && $('#stateCd').val()=='MA'  && $('#orderCompleteFlag').val()=='false'){
					   $('#summeryTabWarningModal').modal('show');		
				   }
				   else  if(isQuoteFlag != 'true' && (isCreditOrdered == 'No' || isMVRCheckRequired =='Yes')){
					   $('#summeryTabInsErrorModal').modal('show');
				   } 
				   else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && orderComFlag=='true'){
					   if($("#summarydocReviewedInd").is(':checked') == false){			
						   $("#bindModal").modal('show'); 			   
					   }else{
						   $("#documentsReviewedInd").val("Yes");
						   nextTab(document.aiForm.currentTab.value, "bind");				  
					   }
				   }

				   
			}
			 
	 }
	  //errorMessages = jQuery.parseJSON($("#errorMessages").val());
	 
	 if($('#payPlanChangeIndBind').val()=='Yes'){
	 	$("#payPlanChangeInd").val("Yes");
		$('.payPlanMsg').removeClass('hidden');
		resetPremium($('#ratedInd').val(),$('#premAmt').val());
	 }
	 
		var isPrefillReconciled = $('#isPrefillReconciled').val();
		$('#prefillReconcileModal').modal('hide');
		$('#orderThirdPartyPrefillNotReconciledModal').modal('hide'); 
		/*var pageAlertDivName= 'formTop';
		$('#' + pageAlertDivName).append($('#completeApplicationAlert'));
		$('#completeApplicationAlert').show();*/
		
		/* Leave space for fixed Complete "so & so" application message */
		if($('#completeApplicationAlert').length == 1) {
			$('#mainContent').css('padding-top', '35px');
		}
	   
		$(document).on("click", ".openPrefillDialog", function(){
			$('#prefillReconcileModal').modal('hide');
			$('#orderThirdPartyPrefillNotReconciledModal').modal('hide');
			//commented below lines as prefill is dynamically loading now.
			//$('#prefillDialog').modal('show');
			//initializePrefilldata();
		});
		
		$(".closeReconcileModal").click(function(){
			$(".modal").modal('hide');
			//Prefill Rewrite FR Logic changes - Prefill MUST be reconciled prior to moving over to/opening APPLICATION LAYER. 
			if(prefillReconciledIndicator=="Yes"){
				blockUser();
				document.aiForm.action = '/aiui/summary/redirectToApplication/' + encodeURI(document.aiForm.policyKey.value);
				document.aiForm.method="POST";
				document.aiForm.submit();	
				//return false;
			}
		});
				
	   $("#bind").click(function(){
		   	validatePage();		  
		});
	   
	    $('.bindConfirmSubmit').prop('disabled', true);
	    
	    if($('#uwDecision').val() == 'DECLINE'){
	    	$('.clsBind').prop('disabled', true);
	    }
	    
	    if($(".currentPremium").val() == '0'){
	    	$('.clsBind').prop('disabled', true);
	    }
	   	   
		$('#viewPrefillData').click(function(){
			document.aiForm.viewPrefill.value = 'true';
			if ( $('#readOnlyMode').val() == 'Yes' ) {
				nextTabReadOnly(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
			} else {	
			if(isMVRReorderRequired(document.aiForm.currentTab.value)){return false; }
			nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
			}
		});
		
		//This flag is used for navigation from application tab only.
		// This is not required here as modal should be shownif prefill not in reconciled state.
		//if (isPrefillReconciled == 'false'){
			//$('#prefillReconcileModal').modal('show');
		//}
		
	   $(".accButton").click(function(){
		   nextTab(document.aiForm.currentTab.value, this.id);	
	   });
	   
	   $(".bindConfirmSubmit, .bindNext" ).click(function(){
		   $('#summarydocReviewedInd').prop('checked', true);
		   $("#documentsReviewedInd").val("Yes");
		   validateSummarySubmit(this);		   
	   });
	   
	   $(".rejectQuote").click(function(){
		    $("#rejectModal").modal('show');
		});
	   
	   $(".clsReject").click(function(){
		    rejectTheQuote();
		});
	   
		//Close X icon in Coverages popup flyout
		$(".closeSummaryCoverages").click(function(){
			closeCoveragesFlyout();
		});
			
		//Close X icon discounts popup flyout
		$(document).on("click", ".closeDiscountsPopup", function(){
			closeDocumentPopUp();
		});
		
		$(".clsQuestion").click(function(e){
			  $("#discountHelpModeless").modal('show');
			   e.stopPropagation();
		});
		
		$(".clsView").click(function(e){
			$("#vehicleCoveragesModeless").modal('show');
			//TD 44928 - #46848
			//displayCoverages(this.id);
			var seqNum = this.id.match(/_(\d)+$/);
			displayCoverages(seqNum[1]);
			e.stopPropagation();
		});
		
		// New England Patriots Assurance Plus
		$(".clsPolView").click(function(e){
			if(this.id == "ACC_FORG"){
				 $("#policyCoveragesModeless").modal('show');				
			}else if(this.id == "ESS_PAK"){
				$("#assurancePackageModeless").modal('show');				
			}else if(this.id == "ASSURE_PAK"){
				$("#assurancePlusModeless").modal('show');				
			}else if(this.id == "PREF_PAK"){
				$("#preferredPackageModeless").modal('show');				
			}else if(this.id == "PREM_PAK"){
				$("#premierPackageModeless").modal('show');				
			}else if(this.id == "AARP_PAK"){
				$("#aarpAssurancePlusModeless").modal('show');				
			}else if(this.id == "NEP_PAK"){
				$("#newEnglandPatriotsModeless").modal('show');
			}else if(this.id == "RENT_ENDR"){
				$("#rentersEndorsementModeless").modal('show');
			}else if(this.id == "PRU_PAK"){
				$("#prudentialPackageModeless").modal('show');
			}
			e.stopPropagation();
		});
		
		$(".radioPayPlan").blur(function(){
			$("#currentSelectedPayPlan").val("#selectedPayPlan_" + this.id);
								
		});
		
		$(".radioPayPlan").focus(function(){
			
			//alert(this.id);
			var rowId= "#selectedPayPlan_"+this.id;
			var payId="#payPlnCD_"+this.id;
			var payRadioId="#payPlnRad_"+this.id;
			var previousSelectId = $("#currentSelectedPayPlan").val();
			$("#selectedPlan").val(this.id);						
			$(previousSelectId).children('td').each(function() {
				 $(this).removeClass("selectedPayPlan");
			});	
			$(previousSelectId).children('td').each(function() {
				 $(this).removeClass("selectedPayPlanRight");
			});	
						
			$(rowId).children('td').each(function() {
				  if($(this).hasClass('pp_premAmt')){
					    var pp_val=this.id;
					    //TODO: TD 36522 confirm.
					    if (document.aiForm.uwDecision.value != "DECLINE"){
							$(".currentPremium").text(formatNumber(pp_val));						
							$("span.premAmt").text(formatNumber(pp_val));
							$("span.priorPremAmt").text(formatNumber(pp_val));
							originalPremAmt = formatNumber(pp_val);
							 $('#premAmt').val(pp_val);
					    }
			      }
				 $(this).addClass("selectedPayPlanRight");
			});
			
			$(payId).removeClass("selectedPayPlanRight");
			$(payId).addClass("selectedPayPlan");
			
			$(payRadioId).removeClass("selectedPayPlanRight");
			$(payRadioId).addClass("selectedPayPlan");
			
			if ((previousSelectId == "#selectedPayPlan_PP_1PAY") && (rowId != "#selectedPayPlan_PP_1PAY")){
				resetPremium(isRated,originalPremAmt);
				$("#payPlanChangeInd").val("Yes");
				$('.payPlanMsg').removeClass('hidden');
			}
			
			if ((previousSelectId != "#selectedPayPlan_PP_1PAY") && (rowId == "#selectedPayPlan_PP_1PAY")){
				resetPremium(isRated,originalPremAmt);
				$("#payPlanChangeInd").val("Yes");
				$('.payPlanMsg').removeClass('hidden');
			}

			if (previousSelectId != rowId){
				$("#anyPayPlanChangeInd").val("Yes");
			}
		});
		
		if (document.aiForm.payPlanChangeInd.value =="Yes") {
			$('.payPlanMsg').removeClass('hidden');
		}
		else {
			$('.payPlanMsg').addClass('hidden');
		}
		
		$(document).on("click", "a.clsCallDetails", function(){
			//callDetailsPage
			jumpToDifferentTab("details");

        });
		
		$(document).on("click", "a.clsCallClient", function(){
			//callClientPage
			jumpToDifferentTab("client");

        });

		$(document).on("click", "a.clsCallVehicle",function(){
			//callVehiclesPage
			$("#vehicleCoveragesModeless").modal('hide');
			 if(this.id != null && this.id!= ''){
				 var seqNum = this.id.match(/_(\d)+$/);
				 jumpToDifferentTab("vehicles?index="+seqNum[1]);
			 }else{
				 jumpToDifferentTab("vehicles");
			 }
		});
		
		$(document).on("click", "a.clsCallDriver", function(){
			//callDriverPage
			if(this.id != null && this.id!= ''){
				 jumpToDifferentTab("drivers?index="+this.id);
			 }else{
				 jumpToDifferentTab("drivers");
			 }
		});
						
		$(document).on("click", "a.clsCallCoverage", function(){
			//callCoveragesPage
			 $("#vehicleCoveragesModeless").modal('hide');
			 if(this.id != null && this.id!= ''){
				 var cov=this.id.split("@"); 
				 jumpToDifferentTab("coverages?index="+cov[0]+"&covCode="+cov[1]);
			 }else{
				 jumpToDifferentTab("coverages");
			 }
		});
		
		$(document).on("click", "a.clsCallAccViolation", function(){
			if($(this).hasClass('hrefdisable')){return false;}
			jumpToDifferentTab("accidentsViolations");
		});
		
		$(document).on("click", "a.clsCallAddAccViolation", function(){
			jumpToDifferentTab("accidentsViolations/add");
		});
		
		$(document).on("click", "a.clsCallEndrAddAccViolation", function(){
			jumpToDifferentTab("accidentsViolations/add");
		});
		
		$(document).on("click", "a.clsRate", function(){
			//alert("This will invoke rating when the actual rating module is complete. Until then, this is just a temp simulation..");
			callRating();
		});
				
		$(document).on("click", ".accVioReviewOk", function(){
			jumpToDifferentTab("accidentsViolations");
		});
		
		//Tooltips
		$(".polCovTooltip").tooltip();
		$(".thirdParty").tooltip();
		
		createFlyout(this.id);
					
		$(document).click(function(e){
			closeDocumentPopUp();			
		}); 
		
		$(".nextVehicleCoverages").click(function(){
			var id = (this.id).substring(5);
			id = parseInt(id);
			var summaryCoverageDiv = $('#summaryCoverages_' + id).next();
			var summaryCoverageId; 
			
			if(undefined != summaryCoverageDiv && summaryCoverageDiv.length != 0){
				summaryCoverageId = summaryCoverageDiv.attr('id');
				id = summaryCoverageId.substring(17);
			}else{
				id = '';
			}
			
			if(id.length != 0){
				closeCurrentCoveragesTable();
				displayCoverages(id);
			}
		});
		
		$(".previousVehicleCoverages").click(function(){
			var id = (this.id).substring(5);
			id = parseInt(id);
			var summaryCoverageDiv = $('#summaryCoverages_' + id).prev();
			var summaryCoverageId; 
			if(undefined != summaryCoverageDiv && summaryCoverageDiv.length != 0){
				summaryCoverageId = summaryCoverageDiv.attr('id');
				id = summaryCoverageId.substring(17);
			}else{
				id = '';
			}
			if(id.length != 0){
				closeCurrentCoveragesTable();
				displayCoverages(id);
			}
		});
		
		$('#bind').bind(getValidationEvent(), function(event, result){
			validatePage();
		});
		
		$('.clsOrderRptBtn').click(function(){
			  var uwDecision = $("#uwDecision").val();
			  if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
			      //Ordering reports is not authorized on quotes in decline status.
	              $("#uwDeclineModal").modal('show');
			  }else{
			//47549,47554 - NBS REGRESSION - Received Quick Quote will no longer be available after a successful report order Warning in NB
			//56035 - Should present the QQ modal for MA with OOS drivers
			if(isEndorsement() && $('#stateCd').val() == 'MA'){
				if($('#containsOOSDrivers').val() == 'true'){
					$('#orderThirdPartyEndorsementWarnModal').modal();
					return false;
				}
			}else if(isEndorsement() && $('#newDriversExistForEndorsement').val() == 'true'){
				$('#orderThirdPartyEndorsementWarnModal').modal();
				return false;
			}
			
			//TD# 73404
			if(($('#riskState').val()!='MA') && $('#prefillReconciledIndicator').val()!='Yes'){
				$('#orderThirdPartyPrefillNotReconciledModal').modal();
			}else{
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
			  }
		}
		});
		
		$('#orderReportsEndorsementsTrigger').click(function() {
		     var uwDecision = $("#uwDecision").val();
			 if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
			      //Ordering reports is not authorized on quotes in decline status.
	              $("#uwDeclineModal").modal('show');
			 }else{
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
			 }
		});
		
		$('.clsOrderRptBtnAfterConvertToIssue').click(function(){
			document.aiForm.orderReportsAfterConvertToIssue.value = 'true';		
			//Premium should be reset only if order reports call returns data
			//resetPremiumForAll();
			nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);				
		});
		
		$('.clsOrderRptBtnAfterEndrsmAddDrvr').click(function(){
			$('#orderRptBtn').trigger('click');
			return false;
		});
		
		$('#orderRptModal').modal('show');
		if($('#orderRptBtn.endOrderRepRequired').length > 0 && $('#orderCompleteFlag').val() == 'false') {
				$('#issue').removeClass('tabNextButton');
				$('#issue').off();
				$('.issue').click(function(){
					$('#divOrdReportsAfterEndrsmAddDrvr').modal('show');
					return false;
					
				});
		} else {
			$('.issue:not(.endorsementMode)').click(function(){
				blockUser();
				document.aiForm.action = "/aiui/summary/endorsement/issue";
				$("#nextTab").val("forms");
				document.aiForm.submit();
			});
			$('.issue.endorsementMode').click(function(){ 
				 var premAmt = $('#premAmt').val();
				  var showInactiveRateModal = (premAmt=='' || premAmt == '0' || $('#premamt_change').css('display') != 'none');
				  //Step 1: Check if rate is active
				  if(showInactiveRateModal){
					  $('#inactiveRateModal').modal('show');
					  return;
				  }
				  
				  //Check weather all the vehicles are active status
				  if ($('#allVehiclesHaveActiveStatus').val() != "Y") {
				 	  $('#vehicleRMVWarningModal').modal('show');
				 	return;
				  }
				  
				  //Check weather all the drivers have successfull RMV calls.
				  if ($('#allDriversHaveValidRMVStatus').val() != "Y") {
				 	 $('#driverRMVWarningModal').modal('show');
				 	return;
				  }

				  //check none of the driver has Permit
				  /*if ($('#policyHasDriverPermit').val() == "Y") {
					 	// $('#driverRMVWarningModal').modal('show');
					  	$('#policyHasPermit').modal('show');
					 	return;
					  }*/
				  
				  $('#issueModal').modal('show');
			});
		}	
		
		$('.clsEndrIssueFasTrack').click(function(){
			  $('#confirmIssueAfterOrderRpts').modal('hide');
			  var premAmt = $('#premAmt').val();
			  var showInactiveRateModal = (premAmt=='' || premAmt == '0' || $('#premamt_change').css('display') != 'none');
			  if(showInactiveRateModal){
				  $('#inactiveRateModal').modal('show');
				  return;
			  }
			  /*if ($('#policyHasDriverPermit').val() == "Y") {
					 $('#policyHasPermit').modal('show');
					 return;
				 }*/
			$('#issueModal').modal('show');
		});
		
		$('.endrsmntIssueButton').click(function(){
			//The issue popup is not closing in a few scenarios
			$('.endrsmntIssueButton').prop('disabled',true);
			blockUser();
			$('#issueModal,#reRateModal').modal('hide');			
			$("#nextTab").val("forms");
			nextTab(document.aiForm.currentTab.value, 'rate/reRate');
		});
		
		$('.endrsmntIssueButtonFinal').click(function(){
			//The issue popup is not closing in a few scenarios
			$('.endrsmntIssueButtonFinal').prop('disabled',true);
			blockUser();
			$('#issueModal,#reRateModal').modal('hide');			
			document.aiForm.action = "/aiui/summary/endorsement/issue";
			$("#nextTab").val("forms");
			document.aiForm.submit();
		});
		
		$('.convertToIssue').click(function(){
			blockUser();
			doRateEndorsementToconvertToIssue();
		});
		
		var showTabsErroneousPopupFlag = $('#showTabsErroneousPopupFlag').val();
		var showPrefillRequiredPopupFlag = $('#showPrefillRequiredPopupFlag').val();
		var showInvalidDriverLicenseFlag = $('#showInvalidDriverLicenseFlag').val();
		var showInvalidVinPopupFlag = $('#showInvalidVinPopupFlag').val();
		var orderTPAccViolRptsAfterConvertToIssue = $('#orderTPAccViolRptsAfterConvertToIssue').val();
		
		if(($('#clueDown').val()==null || $('#clueDown').val()!='true') &&
				($('#mvrDown').val()==null || $('#mvrDown').val()!='true') && 
				($('#clueDownFlag').val()==null || $('#clueDownFlag').val()!='true') &&
				($('#mvrDownFlag').val()==null || $('#mvrDownFlag').val()!='true')){		
			
			if($('#orderThirdPartyResponseClean').val() == 'true'){
				//TD # 73203
				document.aiForm.accVioUDRModelPopUpInd.value = 'Yes';
				if(orderTPAccViolRptsAfterConvertToIssue=='true'){
					$('#confirmIssueAfterOrderRpts').modal('show');
				}else{
					if($('#udrReturned').val()=='true'){
						$('#accVioCleanInfoWithUDRModal').modal();
						resetPremium(isRated,originalPremAmt);
					}else{
						$('#accVioCleanInfoModal').modal();	
					} 
				}
			}
			
			if($('#orderThirdPartyResponseReview').val() == 'true'){
				//TD # 73203
				document.aiForm.accVioUDRModelPopUpInd.value = 'Yes';
				if($('#udrReturned').val()=='true'){
					$('#accVioReviewInfoWithUDRModal').modal();
				} else{
					$('#accVioReviewInfoModal').modal();
				}
				resetPremium(isRated,originalPremAmt);
			}
		}
		
		$(document).on("click", "#popupModal .closeModal", function(){
			if(!($('#clueDown').val()=='true' && $('#mvrDown').val()=='true')){			
				if($('#orderThirdPartyResponseClean').val() == 'true'){
					if($('#udrReturned').val()=='true'){
						$('#accVioCleanInfoWithUDRModal').modal();
						resetPremium(isRated,originalPremAmt);
					}else{
						$('#accVioCleanInfoModal').modal();	
					} 
					$('#orderRptModal').modal('hide');
				}
				
				if($('#orderThirdPartyResponseReview').val() == 'true'){
					if($('#udrReturned').val()=='true'){
						$('#accVioReviewInfoWithUDRModal').modal();
					} else{
						$('#accVioReviewInfoModal').modal();
					}
					resetPremium(isRated,originalPremAmt);
				}
			}
		});

		if(showTabsErroneousPopupFlag == 'true'){
			if($('#stateCd').val()=='MA')
				$('#orderThirdPartyDriverTabErroneousModal').modal();
			else
				$('#orderThirdPartyTabsErroneousModal').modal();
		}
		
		if(showPrefillRequiredPopupFlag == 'true'){
			$('#orderThirdPartyPrefillNotReconciledModal').modal();
		}
		
		if(showInvalidDriverLicenseFlag == 'true'){
			//$('#orderThirdPartyInvalidLicenseModal').modal();
			if($('#stateCd').val()=='MA') {
				$('#orderThirdPartyInvalidLicenseModalForMA').modal();
			} else {
				$('#orderThirdPartyInvalidLicenseModal').modal();
			}
		}
		
		if(showInvalidVinPopupFlag == 'true'){
			$('#orderThirdPartyInvalidVinModal').modal();
		}
		
	  $(".clsBind").click(function(){
		    var uwDecision = $("#uwDecision").val();
		   	if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DONOTBIND'){
		   		submitBtnClickDoNotBindResponse();
		   		return;
		   	}
		   	
		 validateSummarySubmit(this);
	 });
	   
	  $(".clsFastTrackBind").click(function(){
		  $('#confirmBind').modal('hide'); 
		  var uwDecision = $("#uwDecision").val();
		   	if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DONOTBIND'){
		   		submitBtnClickDoNotBindResponse();
		   		return;
		   	}
		  $('#updateDateTime').val("");
		  validateSummarySubmit(this);
	 });
	  
	   $('.clsProRataQuestion').click(function(){
			$('#clsProRataQuestion').modal();
	   });
	   
	   $('.clsEndtPremiumQuestion').click(function(){
			$('#clsEndtPremiumQuestion').modal();
		});
	   
	   $('.clsFullTermPremiumQuestion').click(function(){
			$('#clsFullTermPremiumQuestion').modal();
		});
	   
	   $('.clsVehExistPremQuestion').click(function(){
			$('#clsVehExistPremQuestion').modal();
		});
	   
	   $('.clsVehRevPremQuestion').click(function(){
			$('#clsVehRevPremQuestion').modal();
		});
	   
	   
	   $("#numberEZLynx").bind({'keypress': function(e) {fmtNumberEZLynx(this,e);},
			'paste':function(event){
			var element = this;
			setTimeout(function(){
				var enteredName = element.value;
				var formattedName = enteredName.replace(/[^a-zA-Z0-9]/g, "");
				$('#'+element.id).val(formattedName);
			}, 100);
		}
		});
			
	   //compRater MaxLevelDiscount
	   if($('#stateCd').val()=="MA"){
		   advanceShopperMADiscount();
	   }else{
		//Prefill rewrite FR Logic change Comprater - prefill should be reconciled behind the scenes
		   if($('#ratedSource').val() =='CompRater' && $('#isCompraterPrefillReconciled').val()!='Yes' && $('#prefillReconciledIndicator').val()!='Yes'){
			   if($('#prefillStatusDesc').val()!='Successful' || $('#prefillStatusDesc').val()==''){
				   //TD#71806 show Screen blocker instead of oredring prefill dialog
				   showLoadingMsg();
				   compRaterNonMAPrefillReconcile();
			   }
		   }
		   maximumLevelDiscount();	  		  
	   }
	   
	   $('.compMaxDiscLevel').click(function(){
			resetMaxLevelDiscount();
		});
	   
		// should be a last call for readonly quote
		
		focusOnFistElement();
		if(redirectedFromCoverageRate){
			$('#samePremium').modal('show');
		}
		showReorderErrorPopups();
		if($('#reRateFlag').val() == "true"){
			$('#reRateModal').modal();
		}
		
		 $(".clsgoToBind").click(function(){
			 nextTab(document.aiForm.currentTab.value, 'bind');
		 });
		 
		 $(".clsUploadEZLynx").click(function(){
			 showEZLynxModal();
		 });
		 
		 $("#sendEZLynx").click(function(){
			 //validate the send button
			 var validate = validateEZLynx($("#reasonEZLynx").val(), $("#numberEZLynx").val(), $("#userNameEZLynx").val());
			 if(!validate){
				 return false;
			 }
			 sendEZLynx();
		 });
		 
		 $("#sendEZLynxCancel").click(function(){
			 if($("#hasEZLynxAltRate").val() == "true" &&  $("#hasEZLynxHighRisk").val() == "true"){
				 $('#reasonEZLynx').val("").trigger('chosen:updated');
			 }
			 $("#numberEZLynx").val("");
			 $("#userNameEZLynx").val("");
			
		 });
		 
		 $('#showEZLynxModal' ).on('hidden', function(){
			   if($("#hasEZLynxAltRate").val() == "true" &&  $("#hasEZLynxHighRisk").val() == "true"){
					 $('#reasonEZLynx').val("").trigger('chosen:updated');
				 }
				 $("#numberEZLynx").val("");
				 $("#userNameEZLynx").val("");
		  });
		   
		 $(document).on("change", "#reasonEZLynx", function(){
			 showClearInLineErrorMsgsWithMap($('#reasonEZLynx').attr('id'), '',fieldIdToModelErrorRow['reasonEZLynx'],-1,errorMessageJSONSummary);
		 });
		 
		 $(document).on("change", "#numberEZLynx",function(){
			 showClearInLineErrorMsgsWithMap($('#numberEZLynx').attr('id'), '',fieldIdToModelErrorRow['numberEZLynxErr'],-1,errorMessageJSONSummary);
		 });
		 
		 $(document).on("change", "#userNameEZLynx", function(){
			 showClearInLineErrorMsgsWithMap($('#userNameEZLynx').attr('id'), '',fieldIdToModelErrorRow['userNameEZLynxErr'],-1,errorMessageJSONSummary);
		 });		 
		 
		disableOrEnableElementsForReadonlyQuote();		
		
		$(document).on("click", "#doNotBindErrorModalCls", function(){
			onDoNotBindModalClsFn();
		});
		
		//Prefill rewrite-Logic change: If prefill is fully Reconciled, and the reconciliation triggered a reorder of one or multiple drivers, that reorder will commence immediately
		if($('#prefillReconciledIndicator').val()=='Yes' && $('#currentTabVal').val()=='prefill' 
			&& $('#riskState').val()=='MA' && $("#orderCompleteFlag").val()== 'false'){
			reorderAccVio();
		}

		$('.startApplication').click(function(){
			if($('#startApplicationStatus').val()=='true' && $('#prefillReconciledIndicator').val() == 'Yes' && $('#orderReportResponse').val()=='Complete'){
				$('#application').trigger('click');
			}
		});
		

});

function reorderAccVio(){
		//TD# 72231  Automatic Report order- Message should be same as ordering when entering accident violation in direct entry. 
		$('#orderReportsAlert').modal();
		  $("#orderReportsAlertExists").click(function(){	
			$('#orderReportsAlert').hide();
			$(".modal-backdrop").remove();
			if($('#startApplicationStatus').val()=='true'){
				document.aiForm.startApplication.value = 'true';
			}
			document.aiForm.automaticReorderAccidentViolations.value = 'true';
			$('.clsOrderRptBtn').trigger('click');
			
		});	
	
}


/*var getHomeAgencyProfiles = function(strURL, lob, state){
	    var request = $.ajax({
			url: strURL,
			type: 'get',
			dataType: 'json',
			cache: false, 
			
			beforeSend: function(status, xhr){
				$('#multiProfilesWithHome').val("false");
				$('#agencyProfileCS').val("");
			},
			
			success: function(data){
				if(data.length > 0){
					//assume mutipleProfilesWithHome as true as default
					$('#multiProfilesWithHome').val("true");
					$.each(data, function(i) {
						sValue = data[i].agencyHierarchyId + ',' +  data[i].companyId + ',' + data[i].channelCode;						
						sValue = sValue + ',' + data[i].branchId + ',' + data[i].agencyId + ',' + data[i].producerId;
						sValue = sValue + ',' + data[i].companyCorporationId;
						
						//if only 1 profile has home permission then always consider that agencyHierId to be sent to Home
						if(data.length == 1){
							//if only one Profile has Home set multiProfileWithHome as false
							$('#multiProfilesWithHome').val("false");
							$('#agencyProfileCS').val(sValue);
						}else if(data.length > 1){													
							if( $('#currentProfile').val() == data[i].agencyHierarchyId){
								//if selected profile has Home, reset multiProfileHome back to false and no need to show error message in legacy
								$('#multiProfilesWithHome').val("false");
							}
						}
			        });
				}
				callCrossSell();
			},
	
			error: function(xhr, status, error){
				//alert(error);
			},
			
			complete: function(){
				$.unblockUI();
			}
		});	
	    
	    return request;
	};
*/
	

	   
   function fmtNumberEZLynx(ezlynxnumber,e){
			var charCode = (e.which) ? e.which : e.keyCode;
		    if (charCode == 8) return true;
		    var keynum;
		    var keychar;
		    var charcheck = /[a-zA-Z0-9]/;
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
	   
   
//moved from .clsBind click event here
function  validateSummarySubmit(obj){
   var isQuoteFlag = document.getElementById('isQuote').value;//false
   var uReportAuthorized = document.getElementById('userReportAuthorized').value;//true
   var isCreditOrdered = getCreditCheck();
   var premAmt = $('#premAmt').val();
   var showInactiveRateModal = (premAmt=='' || premAmt == '0' || $('#premamt_change').css('display') != 'none'); 
   var isMVRCheckRequired = getMVRCheckRequired();
   var isInsuredUnVerified = isInsuredCurrLicUnverified();
   
   if (isMVRCheckRequired == 'Yes' && $('#stateCd').val()!="MA"){
	  /* if ($('#policyHasDriverPermit').val() == "Y" && isQuoteFlag != 'true') {
			 $('#policyHasPermit').modal('show');
			 return;
		 }*/
	   document.aiForm.orderMVRValidation.value = 'true';
	   nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
   } else{
	   if(showInactiveRateModal){
			 $('#inactiveRateModal').modal('show');
		 }
	 	 else if ($('#allDriversHaveValidRMVStatus').val()!="Y") {
	 		 $('#driverRMVWarningModal').modal('show');
	 	 }
		 
	 	 //TD 53309 - 3pwf-39-App layer - prefill not reconciled - Submit clicked - incorrect msg
		 //else if(isQuoteFlag != 'true' && $('#prefillReconciledInd').val() != 'Yes'){
	 	else if( isQuoteFlag != 'true' && $("#PREFILL_StatusDesc").val() != 'Successful - No Data' && $('#prefillReconciledInd').val() != 'Yes' ){
			 if(!$('#prefillDialog').is(':visible')){
				 $('#prefillWarningModal').modal('show');
			 }
		 }
	     //TD 57708 - just moved the else if from above to here
		/* else if (isQuoteFlag != 'true' && $('#policyHasDriverPermit').val() == "Y") {
			 $('#policyHasPermit').modal('show');
			 return;
		 }*/
		 //Defect 43609 - Unsuccessful order should not stop SUBMIT workflow
		 else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && ($('.clshasNotOrderedYet').length > 0  || ($('#stateCd').val()=='MA' && $('.clsUnsuccessfulOrder').length > 0))){
			    $('#summeryTabWarningModal').modal('show');
			  
		   }
		 else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && !isEmployee() && $('#stateCd').val()=='MA'  && $('#orderCompleteFlag').val()=='false'){
			   $('#summeryTabWarningModal').modal('show');		
		   }
	 	 else  if(isQuoteFlag != 'true' && $('#stateCd').val()!="MA" && isCreditOrdered == 'No'){
			   $('#summeryTabInsErrorModal').modal('show');
		   } 
	 	 else if ($('#allVehiclesHaveActiveStatus').val()!="Y") {
	 		 $('#vehicleRMVWarningModal').modal('show');
	 	 }
	   //FR...if inusred has curr lic status as UNV_US
	     else if (isQuoteFlag != 'true' && isInsuredUnVerified =="Yes") {
	    	 $('#insuredHasUnVerifyUsLicStatusAlert').modal('show');
	    	 return;
	 	 }
		 else if(isQuoteFlag != 'true' && uReportAuthorized == 'true' && $('.clshasNotOrderedYet').length == 0){
			   if($("#summarydocReviewedInd").is(':checked') == false){			
				  	  $("#bindModal").modal('show'); 			   
			   }else if(isMVRCheckRequired == 'Yes' && $('#stateCd').val()=="MA"){
					   $('#eligibilityErrorsModalMAMVRValidation').modal();
					   return ;   
			   }		   
			   else{
				      $("#documentsReviewedInd").val("Yes");
				      //nextTab(document.aiForm.currentTab.value, obj.id);
				      //ReRate
				      nextTab(document.aiForm.currentTab.value, 'rate/summaryReRate');
			   }
		   }
     }
}

function focusOnFistElement(){
	var selectedPlan = $("#currentSelectedPayPlan").val();
	selectedPlan = selectedPlan.replace('#selectedPayPlan_','');
	if($('#'+selectedPlan).length>0){
		$('#'+selectedPlan).focus();
	}else{
		$('#PP_1PAY').focus();
	}
}

window.onload=initialFormLoadProcessing;

//For tab ordering and 'Enter' key functionality
function dummyCall(){}//do nothing

function createFlyout() {
	$('.policyDiscounts').click(function(){
		var currentElement = $(this).attr("id");		
		showPopover(currentElement);
	});
}

function showPopover(id){
	var	popupHTML = $('#discountContent_'+id).html();
	var pop = $('#'+id).richPopover({
			placement: 'right',
			html: true,
		    content: popupHTML
		 });
	pop.richPopover('show');
}


function closeDocumentPopUp(){	
	$('.policyDiscounts').each( function () {
		var popoverData = $(this).data('richPopover');
		if (popoverData != undefined) {
			if (popoverData.closeOnClick) {
				$(this).richPopover('destroy');
			}
			popoverData.closeOnClick = true;
		}
	});
}


function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	//setDefaultEnterID('bind');
	
}

function closeCurrentCoveragesTable(){
	if($("#selectedVehSeqNum").val() != null && $("#selectedVehSeqNum").val() != ''){
		$("#summaryCoverages_"+$("#selectedVehSeqNum").val()).addClass('hidden');
	}
}

function jumpToDifferentTab(nextTab){
	if (( $('#readOnlyMode').val() == 'Yes')
			|| ( $('#transactionStatusCd').val() == 'Issued')  || ( $('#transactionStatusCd').val() == 'Pending Issued') ) {
		//blockUser();
		nextTabReadOnly(document.aiForm.currentTab.value, nextTab);
		return;
	} 
	blockUser();
	document.aiForm.nextTab.value =nextTab;
	document.aiForm.submit();
}

function callRating(){
	blockUser();
	document.aiForm.action = "/aiui/summary/rate/term/"+$("#selectedTerm").val();
	$("#nextTab").val("summary");
	document.aiForm.submit();
}

function confirmSummarydocReviewedIndChanged() {
	$('.bindConfirmSubmit').prop('disabled', true);
	if ($("#confirmSummarydocReviewedInd").is(':checked')){
		$('.bindConfirmSubmit').prop('disabled', false);
	}
}

function rejectTheQuote(){
	blockUser();
	document.aiForm.action = "/aiui/summary/rejectQuote";
	document.aiForm.nextTab.value ="landing";
	document.aiForm.submit();
}

function displayCoverages(vehSeqNumber){
	closeCurrentCoveragesTable(); 
	
	$("#selectedVehSeqNum").val(vehSeqNumber);
	$("#summaryCoverages_"+$("#selectedVehSeqNum").val()).removeClass('hidden');	
}

function validatePage() {
}

function formatNumber(prem){
	prem += '';
    x = prem.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return '$'+x1 + x2;
}

function getCreditCheck(){
	//TD 53869 - MA do not need Credit Check so returning back from here instead of setting it as 'No'
	//TD 57455- NH Edit update - Change Control  AI 620, Enterprise 486
	//TD 58235 - Credit check is required in NH, no mention of it in CC 620
	if($('#stateCd').val() == 'MA'){
		isCreditOrdered = "";
		return false;
	}
	
	/**vmaddiwar 6/5/2018 - MVR validation failure to not stop issuance process. User to be allowed to issue policy when MVR validation fails.
		This happen in event when MVR is and the Insurance Score is a NO HIT. In such cases the system currently prevents user from issuing the policy by throwing an edit.
		Users are requesting this edit to lifted and to allow issuance to proceed**/
	if($('#dhiMvrOrdrRevSwitch').val() == "ON" && 
		($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'CT' || $('#stateCd').val() == 'NH' || $('#stateCd').val() == 'PA')){
		return "";
	}

	var isCreditOrdered = "No";
	if (($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length > 0 )){
			if ((document.getElementById('insScoreOrderedForPI').value == "No Hit") && 
					(document.getElementById('insScoreOrderedForSI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForPI').value == "NO-HIT") || 
						(document.getElementById('validLicenseStatusForSI').value == "NO-HIT")){
					isCreditOrdered = "No";
				}
				else{
					isCreditOrdered = "Yes";
				}
			}
			else {
				isCreditOrdered = "Yes";
			}
	 } else if (($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length == 0 )){
		 	if ((document.getElementById('insScoreOrderedForPI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForPI').value == "NO-HIT")){
					isCreditOrdered = "No";
				}
				else{
					isCreditOrdered = "Yes";
				}
			}
			else {
				isCreditOrdered = "Yes";
			}
	 } else if (($('#isPrimaryInsuredExits').length == 0 )  && ($('#isSecondaryInsuredExits').length > 0 )){
		   if ((document.getElementById('insScoreOrderedForSI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForSI').value == "NO-HIT")){
					isCreditOrdered = "No";
				}
				else{
					isCreditOrdered = "Yes";
				}
			}
			else {
				isCreditOrdered = "Yes";
			}
	 } else {
		 isCreditOrdered  = "No";
	 }
	return isCreditOrdered;
}

function getMVRCheckRequiredForMA(){
	var getMVRCheckRequired = "";
	var atleastOneInsuredFoundinMVR = false;
	var atleastOneInsuredMANoPriorLicFoundInRMV = false;
	var atleastOneInsuredMAPriorLicFoundInRMVorMVR = false;
	var bypassMVRValidation = false;
	var insuredFoundInMVR = false;
	
	$('.clsParticipantRole[value=PRIMARY_INSURED],[value=SECONDARY_INSURED]').each(function(){
		var lastIndex = getIndexOfElementId(this);
		if($('#mvr_'+lastIndex).val()=="Successful" 
				|| $('#mvr_'+lastIndex).val()=="Successful-No Data"){
			insuredFoundInMVR = true;
			return false;
		} 
	});
	
	$('.clsParticipantRole[value=PRIMARY_INSURED],[value=SECONDARY_INSURED]').each(function(){
		var lastIndex = getIndexOfElementId(this);
		//If RMV or MVR (on current or prior out of state license) is found on at least one named insured, then eligible to bypass MVR validation.   
		if($('#rmvLookupInd_'+lastIndex).val()=="Yes"
				|| $('.clsMVRNI[value=Successful]').length>0){
			getMVRCheckRequired = "No";
			bypassMVRValidation = true;
			return false;
		}
		//Case 1: If current license = 'MA' and no indication of prior out of state license AND all Named Insured(s) not found in RMV – ineligible. (Stop Issuance)
		if($('#licStateCd_'+lastIndex).val()=="MA" 
			&& $('#licOutOfStatePrior3YrsInd_'+lastIndex).val()!="Yes"
			&& $('#rmvLookupInd_'+lastIndex).val()=="Yes"){
			atleastOneInsuredMANoPriorLicFoundInRMV = true;
		}
		//Case 2: If current license = ‘MA’ and indication of prior out of state license, if both RMV not found AND MVR not found on all Named Insured(s) – ineligible.  . (Stop Issuance)
		if($('#licStateCd_'+lastIndex).val()=="MA" 
			&& $('#licOutOfStatePrior3YrsInd_'+lastIndex).val()=="Yes"
			&& ($('#rmvLookupInd_'+lastIndex).val()=="Yes" 
				|| insuredFoundInMVR)){
			atleastOneInsuredMAPriorLicFoundInRMVorMVR = true;
		}
		//Case 3: If current license is out of state AND MVR not found on at least one Named Insured – ineligible. . (Stop Issuance)
		if($('#licStateCd_'+lastIndex).val()!="MA" && insuredFoundInMVR){
			atleastOneInsuredFoundinMVR = true;
		}
	});
	
	if(bypassMVRValidation
			|| atleastOneInsuredMANoPriorLicFoundInRMV
			|| atleastOneInsuredMAPriorLicFoundInRMVorMVR
			|| atleastOneInsuredFoundinMVR){
		getMVRCheckRequired = "No";
	} else{
		getMVRCheckRequired = "Yes";
	}
		
	return getMVRCheckRequired;
}

function getMVRCheckRequired(){
	
	if($('#stateCd').val() == 'MA'){
		return getMVRCheckRequiredForMA();
	}
	
	var getMVRCheckRequired = "No";
	
	/**Personal Auto DHI Requirement, Replaced existing LexisNexisMVR services with DHI v6 for CT and NJ, 
	hence no need to check if MVR is required for these two states.**/
	//vmaddiwar 6/5/2018 - added for NH and PA too based on recent email conversation with Dipesh
	if($('#dhiMvrOrdrRevSwitch').val() == "ON" && 
		($('#stateCd').val() == 'NJ' || $('#stateCd').val() == 'CT' || $('#stateCd').val() == 'NH' || $('#stateCd').val() == 'PA')){
		return getMVRCheckRequired;
	}
	
	if (($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length > 0 )){
			if ((document.getElementById('insScoreOrderedForPI').value == "No Hit") && 
					(document.getElementById('insScoreOrderedForSI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForPI').value == "") && 
						(document.getElementById('validLicenseStatusForSI').value == "")){
					getMVRCheckRequired = "Yes";
				}
				else if ((document.getElementById('validLicenseStatusForPI').value == "NO_LIC") && 
						(document.getElementById('validLicenseStatusForSI').value == "")){
					getMVRCheckRequired = "Yes";
				}
				else if ((document.getElementById('validLicenseStatusForPI').value == "") && 
						(document.getElementById('validLicenseStatusForSI').value == "NO_LIC")){
					getMVRCheckRequired = "Yes";
				}
				else {
					getMVRCheckRequired = "No";
				}
			}
			else {
				getMVRCheckRequired = "No";
			}
	 }
	 else if (($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length == 0 )){
		 	if ((document.getElementById('insScoreOrderedForPI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForPI').value == "")){
					getMVRCheckRequired = "Yes";
				}
				else{
					getMVRCheckRequired = "No";
				}
			}
			else {
				getMVRCheckRequired = "No";
			}
	 }
	 else if (($('#isPrimaryInsuredExits').length == 0 )  && ($('#isSecondaryInsuredExits').length > 0 )){
		   if ((document.getElementById('insScoreOrderedForSI').value == "No Hit")) {
				if ((document.getElementById('validLicenseStatusForSI').value == "")){
					getMVRCheckRequired = "Yes";
				}
				else{
					getMVRCheckRequired = "No";
				}
			}
			else {
				getMVRCheckRequired = "No";
			}
	 }
	 else {
		 getMVRCheckRequired  = "No";
	 }
	return getMVRCheckRequired;
}
function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var n = strId.lastIndexOf('_');
    var lastIndx = strId.substring(n + 1);
   
    return lastIndx;
}

function doRateEndorsementToconvertToIssue() {
	document.aiForm.convertToIssue.value = 'true';
	resetPremiumForAll();
	//switch the mode and rate.
	$("#transactionTypeCd").val("Endorse");
	nextTab(document.aiForm.currentTab.value, 'rate');
	
}

function maximumLevelDiscount(){
	//compRater - set the discount level flag to NO - ADVANCE_QUOTE_OVERRIDE - advancedQuoteOverrideFlag
	var days = 0;
	
	if($('#policyFirstRatedDate').val() != ''){
		 var policyFirstRatedDate = new Date($('#policyFirstRatedDate').val());
		 var policyEfftDt = new Date($('#policyEffDt').val());
		 var timeDiff = new Date (policyEfftDt - policyFirstRatedDate);
		days = timeDiff/1000/60/60/24;
	}else{
		//get the current date of the policy rated date is null
		policyFirstRatedDate = new Date();
		var policyEfftDt = new Date($('#policyEffDt').val());
		var timeDiff = new Date (policyEfftDt - policyFirstRatedDate);
		
		days = timeDiff/1000/60/60/24;
		days = Math.ceil(days);
	}			
	
	//NOT display this note on a bridged quote in AI when the quote effective date is 8 days or greater than the transaction date.
	//691200000 = 8 days in millisec
	if('Yes' == $('#advancedQuoteOverrideFlag').val() 
			&& 'CompRater' == $('#ratedSource').val()
			&& days <= 7
		){
	    	$('#compraterMaxDiscountLevel').modal('show');
	    	$('#advancedQuoteOverrideFlag').val('No');
	    	resetPremium($('#ratedInd').val(),$('#premAmt').val());
    }	
}

function compRaterNonMAPrefillReconcile(){
	var policyKey = $('#policyKey').val();
	//Call for reconcile prefill
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
        url: "/aiui/rate/reconcilePrefillCompRaterNonMA",
        type: "post",
        dataType: 'text',
        data :policyKey,// JSON.stringify({ "policyKey":policyKey}),
        timeout: 2500,
        async:false,
        success: function(response, textStatus, jqXHR){ logToDb("summaryTab.js: 1555 - In success handler of call /aiui/rate/reconcilePrefillCompRaterNonMA in compRaterNonMAPrefillReconcile()");
        //alert("Non MA - Compratere: Reconcile Prefill");
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ logToDb("summaryTab.js: 1560 - In error handler of call /aiui/rate/reconcilePrefillCompRaterNonMA in compRaterNonMAPrefillReconcile() with status = " + textStatus + " and error message = " + errorThrown);  // TODO Add Ajax call here.
	
        },
        complete: function(){
        	 window.location.reload();
        }
    });
}

//Moved to validation.js so can be reused
/*function resetMaxLevelDiscount(){
	var polKey =  $('#policyKey').val();
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
        url: "/aiui/policies/resetMaxLevelDiscount",
        type: "post",
        dataType: 'json',
        timeout: 2500,
        async:false,
        data : JSON.stringify({"policyKey":polKey}),
        success: function(response, textStatus, jqXHR){ 
        	logToDb("summaryTab.js:  - In success handler of call /aiui/policies/resetMaxLevelDiscount in resetMaxLevelDiscount()");
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ 
        	logToDb("summaryTab.js:  - In success handler of call /aiui/policies/resetMaxLevelDiscount in resetMaxLevelDiscount() with status = " + textStatus + " and error message = " + errorThrown);  	
        },
        complete: function(){
        	
        }
    });
	return;
}*/	

//Advance Shopper Change control for MA
function advanceShopperMADiscount(){
	//compRater - set the discount level flag to NO - ADVANCE_QUOTE_OVERRIDE - advancedQuoteOverrideFlag
	var days = 0;
	
	if($('#policyFirstRatedDate').val() != ''){
		 var policyFirstRatedDate = new Date($('#policyFirstRatedDate').val());
		 var policyEfftDt = new Date($('#policyEffDt').val());
		 var timeDiff = new Date (policyEfftDt - policyFirstRatedDate);
		 days = timeDiff/1000/60/60/24;
	}else{
		//get the current date of the policy rated date is null
		policyFirstRatedDate = new Date();
		var policyEfftDt = new Date($('#policyEffDt').val());
		var timeDiff = new Date (policyEfftDt - policyFirstRatedDate);
		
		days = timeDiff/1000/60/60/24;
		days = Math.ceil(days);
	}			
	
	//NOT display this note on a bridged quote in AI when the quote effective date is 8 days or greater than the transaction date.
	//691200000 = 8 days in millisec
	//$("#rmvLookupInd").val() != 'Yes' 
    
	//if the agent requested the 2-6 day discount level and the Date First Rated is less than 2 days in advance of the Quote Effective Date 
	if('A' == $('#advancedQuoteOverrideFlag').val() 
			//&& 'DIRECT' == $('#ratedSource').val()
			&& days < 2
		){
			if($("#rmvLookupInd").val() == 'Yes'){
				if('CompRater' == $('#ratedSource').val()){
					$('#advanceShopperDirectMADiscount').modal('show');
					resetPremium($('#ratedInd').val(),$('#premAmt').val());
				}
			} else{
				if('DIRECT' == $('#ratedSource').val()){
					$('#advanceShopperBridgeMADiscount').modal('show');
				}
			}
	    	$('#advancedQuoteOverrideFlag').val('No');
	    	//resetPremium($('#ratedInd').val(),$('#premAmt').val());
    }else
    	//If the agent requested the 7 or more day discount level and the Date First Rated is less than 7 days in advance of the Quote Effective Date
    	if('Z' == $('#advancedQuoteOverrideFlag').val() 
    			//&& 'DIRECT' == $('#ratedSource').val()
    			&& days <=7
    		){
	    		if($("#rmvLookupInd").val() == 'Yes'){
	    			if('CompRater' == $('#ratedSource').val()){
	    				$('#advanceShopperDirectMADiscount').modal('show');
	    				resetPremium($('#ratedInd').val(),$('#premAmt').val());
	    			}
				} else{
					if('DIRECT' == $('#ratedSource').val()){
						$('#advanceShopperBridgeMADiscount').modal('show');
					}
				}
    	    	$('#advancedQuoteOverrideFlag').val('No');
    	    	//resetPremium($('#ratedInd').val(),$('#premAmt').val());
        }	
}

var fieldIdToModelErrorRow = {
		"reasonEZLynxErr":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError inlineErrorMsg\" id=\"Error_Col\"></td></tr>",
		"numberEZLynxErr":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError inlineErrorMsg\" id=\"Error_Col\"></td></tr>",
		"userNameEZLynxErr":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError inlineErrorMsg\" id=\"Error_Col\"></td></tr>",
};

var errorMessageJSONSummary = {
		"reasonEZLynxErr.invalid":"Reason for sending is required",
		"numberEZLynxErr.invalid":"Plymouth Rock Quote/Policy # is required and</br> should contain 14 alphanumeric characters",
		"userNameEZLynxErr.invalid": "EZLynx Username is required"
};

//show EZLynx Modal window
function showEZLynxModal(){
	$('#numberEZLynx').prop('disabled', false);
	if (( $('#readOnlyMode').val() == 'Yes')
			|| ( $('#transactionStatusCd').val() == 'Issued')  || ( $('#transactionStatusCd').val() == 'Pending Issued') ) {
		$('#reasonEZLynx').prop('disabled', false).trigger('chosen:updated');
	}
	$('#userNameEZLynx').prop('disabled',false);
	
	disableEZLynxReasons();
	$('#showEZLynxModal').modal();
	 showClearInLineErrorMsgsWithMap($('#reasonEZLynx').attr('id'), '',fieldIdToModelErrorRow['reasonEZLynx'],-1,errorMessageJSONSummary);
	 showClearInLineErrorMsgsWithMap($('#numberEZLynx').attr('id'), '',fieldIdToModelErrorRow['numberEZLynxErr'],-1,errorMessageJSONSummary);
	 showClearInLineErrorMsgsWithMap($('#userNameEZLynx').attr('id'), '',fieldIdToModelErrorRow['userNameEZLynxErr'],-1,errorMessageJSONSummary);
}

//59946-EZLynx Dialog - Reason for sending should be a literal when user only has one role
function disableEZLynxReasons(){
	// console.log("hasEZLynxAltRate = "+$("#hasEZLynxAltRate").val()+"hasEZLynxHighRisk = "+$("#hasEZLynxHighRisk").val());
	/*if($("#hasEZLynxAltRate").val() == "true" &&  $("#hasEZLynxHighRisk").val() == "false"){
		$('#reasonEZLynx').prop("value","Rate").attr('selected','selected');
		$('#reasonEZLynx').prop('disabled', true).trigger('chosen:updated'); 
		}
	if($("#hasEZLynxAltRate").val() == "false" &&  $("#hasEZLynxHighRisk").val() == "true"){
		$('#reasonEZLynx').prop("value","Risk").attr('selected','selected');
		$('#reasonEZLynx').prop('disabled', true).trigger('chosen:updated');
		
	}*/
	if($("#hasEZLynxAltRate").val() == "true" &&  $("#hasEZLynxHighRisk").val() == "true"){
		var ezLynxReasonCd = $("#exLynxReasonCodeSuccess").val();
		if(ezLynxReasonCd != null && ezLynxReasonCd != undefined && ezLynxReasonCd.length>1){
		$('#reasonEZLynx').prop("value",ezLynxReasonCd).attr('selected','selected');
		$('#reasonEZLynx').prop('disabled', false).trigger('chosen:updated');
		}
	}
	
	var ezLynxPolNumber = $("#exLynxPolicyNumberSuccess").val();
	if(isValidValue(ezLynxPolNumber)){
		$('#numberEZLynx').val(ezLynxPolNumber);
	}
	
	var ezLynxUserName = $("#exLynxUserSuccess").val();
	if(isValidValue(ezLynxUserName)){
		$("#userNameEZLynx").val(ezLynxUserName);
	}
}

//send information to EZLynx
//increased timeout 
function sendEZLynx(){
	$('#reasonEZLynx').prop('disabled', false).trigger('chosen:updated');
	var lookupData = {};
	lookupData.reasonEZLynx = $('#reasonEZLynx').val();
	lookupData.numberEZLynx = $('#numberEZLynx').val();
	lookupData.policyKey = $('#policyKey').val();
	lookupData.userNameEZLynx = $('#userNameEZLynx').val();
	
	var jsonData = JSON.stringify(lookupData);
//console.log('ezlynx josndata posted = '+jsonData);
	blockUser();
	$.ajax({
		headers: {
			'Accept': 'text/plain',
			'Content-Type': 'application/json'
		},
		url: "/aiui/ezlynx/uploadEZLynx",
		type: "post",
		data : jsonData,
		timeout: 10000,
		// callback handler that will be called on success
		success: function(response, textStatus, jqXHR){
			// console.log('response successful ='+response);
			if (response != null ){
				if(response == "Succeeded"){
					$("#exLynxPolicyNumberSuccess").val(lookupData.numberEZLynx);
					$("#exLynxReasonCodeSuccess").val(lookupData.reasonEZLynx);
					$("#exLynxUserSuccess").val(lookupData.userNameEZLynx);
					
					
					$('#successEZLynx').modal();
				}
				else if(response == "Failed"){
					$('#authFailureEZLynx').modal();
				}else{
					//Failed or Unknown
					$('#techFailureEZLynx').modal();
				}	
			}else{
				$('#techFailureEZLynx').modal();
			}
		},
		// callback handler that will be called on error
		error: function(jqXHR, textStatus, errorThrown){
			 if(textStatus == "timeout") {
				 	$("#exLynxPolicyNumberSuccess").val(lookupData.numberEZLynx);
					$("#exLynxReasonCodeSuccess").val(lookupData.reasonEZLynx);
					$("#exLynxUserSuccess").val(lookupData.userNameEZLynx);
					
				 $('#timeoutEZLynxRequest').modal();
			 }else{
				 $('#techFailureEZLynx').modal();
			 }
			//console.log('timeout happening  '+textStatus);
		},
		complete: function(){
			disableEZLynxReasons();
			$.unblockUI();
		}
		});
}

function validateEZLynx(reason, number, userName){
	var result = true;
	var errorMessageID = '';
	
	if(reason.length < 1){
		errorMessageID="reasonEZLynxErr.invalid";
		showClearInLineErrorMsgsWithMap($('#reasonEZLynx').attr('id'), errorMessageID,fieldIdToModelErrorRow['reasonEZLynxErr'],-1,errorMessageJSONSummary);
		result = false;
	} 
	
	if(number.length < 14){
		errorMessageID="numberEZLynxErr.invalid";
		showClearInLineErrorMsgsWithMap($('#numberEZLynx').attr('id'), errorMessageID,fieldIdToModelErrorRow['numberEZLynxErr'],-1,errorMessageJSONSummary);
		result = false;
	}

	if(userName.length < 1){
		errorMessageID="userNameEZLynxErr.invalid";
		showClearInLineErrorMsgsWithMap($('#userNameEZLynx').attr('id'), errorMessageID,fieldIdToModelErrorRow['userNameEZLynxErr'],-1,errorMessageJSONSummary);
		result = false;
	}

	return result;
}


function onDoNotBindModalClsFn(){
	//reset premium
	//revertPremium();
	resetPremium($('#ratedInd').val(),$('#premAmt').val());	
	//disable submitBtn
	$('.bindBtn').prop('disabled', true);
}

function isInsuredCurrLicUnverified(){
	
	var isInsurCurrLicUnverified = "No"
	
	var primaryInsCurrLicStatusCd = "";
	var secondaryInsCurrLicStatusCd = "";
	
	if ( $('#dhiMvrOrdrRevSwitch').val() != "ON" || $('#stateCd').val() == 'MA' ) {
		return "No";		
	}
	
	if ( $('#currLicStatusCdFor_PRIMARY_INSURED').length > 0 ) {
		primaryInsCurrLicStatusCd = $('#currLicStatusCdFor_PRIMARY_INSURED').val();
	}
	
	if ( $('#currLicStatusCdFor_SECONDARY_INSURED').length > 0 ) {
		secondaryInsCurrLicStatusCd = $('#currLicStatusCdFor_SECONDARY_INSURED').val();
	}
	
	//FR...If both NIs have No Hit and either of Curr Lic Status code is UNV_US
	if ( ($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length > 0 ) ) {
		if ( (document.getElementById('insScoreOrderedForPI').value == "No Hit")  
		&&   (document.getElementById('insScoreOrderedForSI').value == "No Hit") ) {
			if ( primaryInsCurrLicStatusCd == "UNV_US" || secondaryInsCurrLicStatusCd == "UNV_US" ) {					
				isInsurCurrLicUnverified = "Yes";
			}
		}
	 } //PNI
	 else if ( ($('#isPrimaryInsuredExits').length > 0 )  && ($('#isSecondaryInsuredExits').length == 0) ) {
		 	if ( document.getElementById('insScoreOrderedForPI').value == "No Hit" ) {
				if (primaryInsCurrLicStatusCd == "UNV_US") {
					isInsurCurrLicUnverified = "Yes";
				}
			}
	 }//SNI
	 else if ( ($('#isPrimaryInsuredExits').length == 0 )  && ($('#isSecondaryInsuredExits').length > 0 ) ) {
		   if (document.getElementById('insScoreOrderedForSI').value == "No Hit") {
				if (secondaryInsCurrLicStatusCd == "UNV_US") {
					isInsurCurrLicUnverified = "Yes";
				}
			}
	 }	 
	
	return isInsurCurrLicUnverified;	
}
