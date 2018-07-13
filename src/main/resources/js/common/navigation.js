//Navigation functions
var AI = {};
AI.utils = {};
AI.utils.ErrorMessage = function(url, message, status) {
	var self = this;
	var browserDetails = AI.utils.getBrowserDetails();
	self.url = url;
	self.errorMessage = message;
	self.status = status;
	self.maxRetries = 0;
	self.response = "";
	self.responseTime = 0;
	self.browser = browserDetails.browser;
	self.browserVersion = browserDetails.version;
};
/**
 * Loads the Script from the URL until it either succeeds or until maxRetries
 */
AI.utils.loadScript = function(url, maxRetries) {
	console.log("navigation.js - Loading the Script from server URL - " + url);
	maxRetries = maxRetries || 0;
	var isSuccess = false;
	var startTime = Date.now();
	jQuery.ajax({
		async : false,
		url : url,
		dataType : "script"
	}).done(function() {
		isSuccess = true;
	}).fail(
			function(jqxhr, responseStatus, message) {
				console.log("navigation.js - Failed to load Script from - "
						+ url, message);
				if (0 < maxRetries) {
					var endTime = Date.now() - startTime;
					var errorMessage = new AI.utils.ErrorMessage(url, message,
							jqxhr.status);
					errorMessage.maxRetries = maxRetries;
					errorMessage.errorMessage = message;
					errorMessage.response = responseStatus;
					errorMessage.responseTime = endTime;
					AI.utils.logError(errorMessage);

				}
				// Retry up to MAXRetries passed and until it's Successful.
				for (var retryCounter = 0; retryCounter < maxRetries
						&& !isSuccess; retryCounter++) {
					// As we are already reloading don't hit load again
					isSuccess = AI.utils.loadScript(url, -1);
				}
			});
	return isSuccess;
};

/**
 * Enum on All Browsers/Layout engine supported
 */
AI.utils.Browser = {
	Chrome : "Chrome",
	MSIE : "IE",
	Trident : "IE",
	EDGE : "Edge",
	Safari : "Safari",
	Firefox : 'Firefox',
	Opera : 'Opera'
};
/**
 * Extracts the current browser details form navigator and returns the current
 * browser & it's full version
 */
AI.utils.getBrowserDetails = function() {
	if (AI.utils.CURRENT_BROWSER) {
		return AI.utils.CURRENT_BROWSER;
	}
	var browser = AI.utils.Browser;
	var agent, ixm, fullVersion;
	var userAgent = navigator.userAgent;
	// Safari Check
	if (userAgent.search(browser.Safari) >= 0
			&& userAgent.search(browser.Chrome) < 0) {
		agent = browser.Safari;
		var verOffset = userAgent.indexOf("Safari");
		fullVersion = userAgent.substring(verOffset + 7);
		if ((verOffset = userAgent.indexOf("Version")) != -1) {
			fullVersion = userAgent.substring(verOffset + 8);
		}
	} else {
		// Rest all browsers
		$.each(browser, function(key, value) {
			if (userAgent.search(key) >= 0) {
				agent = value;
				var verOffset = userAgent.indexOf(key) + key.length + 1;
				fullVersion = userAgent.substring(verOffset);
				// Stop iterating
				return false;
			}
		});
	}
	// Trim negative for browsers like IE
	if ((ix = fullVersion.indexOf(";")) != -1) {
		fullVersion = fullVersion.substring(0, ix);
	}
	// Trim Space for browsers like Chrome
	if ((ix = fullVersion.indexOf(" ")) != -1) {
		fullVersion = fullVersion.substring(0, ix);
	}

	if (agent == browser.Trident) {
		// Set version for IE
		if (7 == fullVersion) {
			fullVersion = 11;
		} else if (6 == fullVersion) {
			fullVersion = 10;
		} else if (5 == fullVersion) {
			fullVersion = 9;
		}
	}

	AI.utils.CURRENT_BROWSER = {
		browser : agent,
		version : fullVersion
	};

	return AI.utils.CURRENT_BROWSER
}

/**
 * Logs the client side error on the Server
 */
AI.utils.logError = function(e) {
	console.log("Fallback in case, network is down - "+ JSON.stringify(e));
	jQuery.ajax({
	    url: "error?FORM_CSRF_TOKEN="+$("input[name='FORM_CSRF_TOKEN']").val(),
	    method:'POST',
	    dataType:'json',
	    contentType : "application/json",
	    data:JSON.stringify(e)
	}).done(function(){
		console.log("Error was logged successfully");
	})
};

jQuery(document).ready(function() {

	//Added this code the keep the LocalStorage Thread Alive as the browser Thread parses the html page.
	setInterval(function() {
		//console.log("Keeping Local Thread Alive.....");
		window.localStorage.setItem("one", "one");
	}, 5000);


	logToDb("navigation.js: 4 - Entering  jQuery(document).ready function");
	$.unblockUI(); logToDb("navigation.js: 5 - Completed $.unblockUI");

	// Set up the tabs
	var tabs = $( "#tabPanel" );
	if (tabs != null && tabs.length > 0 && document.aiForm != undefined) {
		var tabItems = $('#tabPanel ul li');

		logToDb("navitation.js: 12 - Before tabItems.each loop"); // Having an href="#" disables the tabs. Re-enable them
		tabItems.each(function() {
			var tabErrors = $('#' + this.id + '_hasErrors').val();

			if (isApplicationOrEndorsement()) {
				$(this).addClass('applicationTab');
			}

			if ( !(isTabDisabledBasedOnProgess(this.id)) ) {
				$(this).removeClass('disabledTab');
			} else {
				$(this).removeClass('tabNextButton');
			}

			// we don't show red ! on tab which doesn't have errors
			// or hasn't been visited yet(Means disabled mode)
			if (tabErrors != 'true' || isTabDisabledBasedOnProgess(this.id)) {
				$('#' + this.id + '_error').addClass('hidden');
			}
		});

		/** Select the current tab - Note that attempting to select the tab -
			as in the commented out code below -  does not work,
			as there is no actual href attached to the tab
		 **/

		tabItems.removeClass('activeTab').addClass('visitedTab');
		var li = $('#tabPanel ul li#' + document.aiForm.currentTab.value);
		li.addClass('activeTab').removeClass('visitedTab').removeClass('tabNextButton').removeClass('applicationTab');

		if (!isApplicationOrEndorsement()) {
			// make sure that active tab does not show red ! on first time thru
			hideErrorOnActiveTabFirstTime();
		}
	}
	
	// PA Home Tabs
	if (tabs != null && tabs.length > 0 && document.homeForm != undefined) {
		var tabItems = $('#tabPanel ul li');
		logToDb("navitation.js: 12 - Before tabItems.each loop"); // Having an href="#" disables the tabs. Re-enable them
		
		tabItems.removeClass('activeTab').addClass('visitedTab');
		var li = $('#tabPanel ul li#' + document.homeForm.currentTab.value);
		li.addClass('activeTab').removeClass('visitedTab');
	}

	$('a[id="consumerRptLink"]').on('click',function(event){
		var companyCd = $('#companyCd').val();
		var stateCd = $('#stateCd').val();
		var channelCd = $('#channelCd').val();
		var lob = $('#lob').val();
		var uwCompanyCd = $('#uwCompanyCd').val();
		var policyKey = $('#policyKey').val();
		// policy number duplicate in hidden fields which ones are who referring?
		// var policyNumber = $('#policyNumber').val();
		var policyNumber = $('#policyNumber_Policy').val();
		var policySourceCd = $('#policySourceCd').val();
		var openURL = window.location.protocol + "//" + window.location.host + '/aiui';
		var url =  openURL+'/forms/crn?companyCd='+companyCd+ '&stateCd='+stateCd+ '&channelCd='+channelCd+ '&lob='+lob+ '&uwCompanyCd='+uwCompanyCd+ '&policyKey='+policyKey +'&policyNumber=' +policyNumber +'&policySourceCd=' +policySourceCd;
		newwindow=window.open(url,'','scrollbars=1,resizable=0,status=0,toolbar=no,menubar=no,location=no,directories=no');
	    if (window.focus) {newwindow.focus();}
	    return false;
	});
	
	$('a[id="declineNoticeLink"]').on('click',function(event){
		var companyCd = $('#companyCd').val();
		var stateCd = $('#stateCd').val();
		var channelCd = $('#channelCd').val();
		var lob = $('#lob').val();
		var uwCompanyCd = $('#uwCompanyCd').val();
		var policyKey = $('#policyKey').val();
		// policy number duplicate in hidden fields which ones are who referring?
		// var policyNumber = $('#policyNumber').val();
		var policyNumber = $('#policyNumber_Policy').val();
		var policySourceCd = $('#policySourceCd').val();
		var openURL = window.location.protocol + "//" + window.location.host + '/aiui';
		var url =  openURL+'/forms/declineNotice?companyCd='+companyCd+ '&stateCd='+stateCd+ '&channelCd='+channelCd+ '&lob='+lob+ '&uwCompanyCd='+uwCompanyCd+ '&policyKey='+policyKey +'&policyNumber=' +policyNumber +'&policySourceCd=' +policySourceCd;
		newwindow=window.open(url,'','scrollbars=1,resizable=0,status=0,toolbar=no,menubar=no,location=no,directories=no');
	    if (window.focus) {newwindow.focus();}
	    return false;
	});

	//Bind Navigation Buttons
	$("#savePolicy").click(function(){ logToDb("navigation.js: 62 - Entering $('#savePolicy').click handler");
		if(!isUmbrellaQuote() && !checkAccVio()){ return false; }
		executeReorderWorkflow();
		savePolicy(); logToDb("navigation.js: 64 - Exiting $('#savePolicy').click handler");
	});

	$(".tabNextButton").bind("click", function(event){ logToDb("navigation.js: 67 - Entering $('.tabNextButton').click handler");
		if (isUmbrellaQuote()) {
			var currTabId = document.umbrellaForm.currentTab.value;
			/*if (( $('#readOnlyMode').val() == 'Yes')
					|| ( $('#transactionStatusCd').val() == 'Issued')  || ( $('#transactionStatusCd').val() == 'Pending Issued') ) {
				nextTabReadOnly(document.uqForm.currentTab.value, this.id);
				return;
			}*/
			umbrellaNextTab(document.umbrellaForm.currentTab.value, this.id,event);

		} else {
		var currTabId = document.aiForm.currentTab.value;

		// clear viewPrefill value for next button/tab clicks.
		document.aiForm.viewPrefill.value = '';

		if (( $('#readOnlyMode').val() == 'Yes')
				|| ( $('#transactionStatusCd').val() == 'Issued')  || ( $('#transactionStatusCd').val() == 'Pending Issued') ) {
			nextTabReadOnly(document.aiForm.currentTab.value, this.id);
			return;
		}

		//modifying this to show hard stop if disclaimer is not selected or No is the selected option
		if(currTabId=='client')
		{
			var prePriorCarrierName = $('#prePriorCarrierName').val();
			var preSourceOfBusinessCode = $('#preSourceOfBusinessCode').val();
			var sourceOfBusinessCode = $('#clientSourceOfBusinessCode').val();

			if ((sourceOfBusinessCode !="EXIST_AGY")){
				if ((preSourceOfBusinessCode == "EXIST_SPIN") && (sourceOfBusinessCode !="EXIST_SPIN")) {
					$('#priorCarrierName').val("");
				} else {
					$('#priorCarrierName').val(prePriorCarrierName);
				}
			}
			//2.1 BR

			if(!isEndorsement() && isReorderRequiredOnClient(this.id)){
				//Commenting this here as it is handled in isReorderRequiredOnClient function. This is causing double submit
				 //questionMessageForPNIDataModify(strSuccessfulReports, this.id);
				return;
			} else if(isEndorsement() && dobAndInsuredChanged()){
				showMessageForDOBPNIDataModify();
				return;
			}
			else if (isEndorsement() && getPolicyState() == STATE_MA) {
				if (performOrderReportsForPriorLicForCurrRmvLookupDrvrs('ClientPage', this.id)) {
					return;
				}
			}
		}
		//2.1 BR 08/06- Reorder Popup should only be on drivers tab
		else if (currTabId=='drivers'){
			document.aiForm.ignoreSoftErrors.value = 'false';
			if(!isEndorsement()){checkIfCLUEPrefillReorderIsRequiredOffDriver();
			executeReorderWorkflow();
			}
			if(isMVRReorderRequired(this.id)){
				return;
			}else{
				//#55579...MA Endorsment only.. if ok is selected Before submit just check each currently Rmv looked up driver
				//has prior lic info or not to order prior lic (mvr) reports also along with rmv reports
				if (isEndorsement() && getPolicyState() == STATE_MA) {
					if (performOrderReportsForPriorLicForCurrRmvLookupDrvrs('DriverPage', this.id)) {
						return;
					}
				}
			}
		}
		else if (currTabId=='bind'){
			$('#requiredBinValidation').val(false);
			if ($('#downPaymentMethodCd').val() =='DC'){
				$('#paymentAmount').val($('#paymentAmount_DC').val());
			}
			if ($('#downPaymentMethodCd').val() =='EWC'){
				$('#paymentAmount').val($('#paymentAmount_EWC').val());
			}
			var futureId=$("#paymentMethodCd");
			futureId.prop('disabled',false);
			futureId.trigger('chosen:updated');
			var curPlan=$("#selectedPlan").val();
			var paymentMethodCd=$("#paymentMethodCd").val();
			if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
				if (paymentMethodCd !="EDB") {
					$('#paymentMethodfor6Pay').modal('show');
					return;
				}
			}
		}
		else if (currTabId=='accidentsViolations'){
			if(!checkAccVio()){ return false; }
			document.aiForm.nextTab.value = 'false';
		}
		else if (currTabId=='coverages'){ logToDb("navigation.js: 151 - In currTabId=='coverages'");
			if($(this).parent().hasClass('covrgRateButton')){
				return;
			}
		}

		if(this.id=='summary'){
			if(!checkAccVio()){ return false; }
			if(document.aiForm.currentTab.value=='drivers' && !isEndorsement()){checkIfCLUEPrefillReorderIsRequiredOffDriver();}
			if(document.aiForm.currentTab.value=='drivers' && isMVRReorderRequired('summary')){return false; }
			if(document.aiForm.currentTab.value=='client' && isReorderRequiredOnClient('summary')){return false;}
			if(!checkIfAccVioReportsPending($(this).attr('id'))){return false;}
			if($('#readOnlyMode').val() != 'Yes'){
				rateOnSummary();
				return;
			}
		}
		
		//prefill rewrite FR
		//show prefill reconcile modal for application button/link click if not reconciled. 
		//show the modal if not 'Successful - No Data' only.
		if (this.id=='application') {
			if ( $("#PREFILL_StatusDesc").val() != 'Successful - No Data' && $("#prefillReconciledInd").val() != 'Yes' ) {
				$("#prefillReconcileModal").modal('show');
				return;
			}

			// MA Only: Order reports will be requited prior to entering application.     
			if($('#orderReportResponse').val() != 'Complete' && $('#riskState').val() =='MA'){
				$("#divOrdReportsPriorApplication").modal('show');
				return;
			}
		}
				
		//Recurring payment changes
		if(currTabId=='details'){
			if ($('#paymentMethodCd1').val()=='ACC'){
				strCertifyPaymentInd = $("#certifyPaymentInd_ACC").attr('checked');
				if (strCertifyPaymentInd != "checked") {
					$('#accChkModal').modal();
					return;	
				}
				else {
					$("#certifyPaymentInd_ACC").val('Yes');
				}
			}
		}

		nextTab(document.aiForm.currentTab.value, this.id);
		}
		logToDb("navigation.js: 158 - Exiting $('.tabNextButton').click handler");
	});

	$("#landing").click(function(){
		/**
		if (user says "SAVE") {
			nextTab(document.aiForm.currentTab.value, "landing");
		} else
		 **/
		{
			goHome();
		}
	});

	$("#policyFetch").click(function(){
		fetchPolicy();
	});

	$(".newPolicy").click(function(){
		newPolicy();
	});

	$('#systemDropDown').change(function() {
		alert('Selected ' + $(this).attr('value'));
	});

	$('#rate,#rate_temp').on('click',function(event) { logToDb("navigation.js: 184 - Entering $('#rate,#rate_temp').click handler");
		var ops = 'rate';
		var isDisabled = $(this).hasClass('disabled');
		if(isDisabled) { logToDb("navigation.js: 188 - Entering if(isDisabled) block and about to call event.stopPropagation inside $('#rate,#rate_temp').click handler");
			event.stopPropagation();
		} else {
			if (document.aiForm.currentTab.value=='application') {
				//checkErrorsAndSave() will take care of saving and then navigating to next tab
				checkErrorsAndSave();
			} else {
				var wasPremiumAffected = $('#defaultZeroedPremium').val();
				if(isEndorsement()) {
					if(wasPremiumAffected == null || wasPremiumAffected == ''){
						if($(this).parent().hasClass('covrgRateButton')){
							//If quote is already rated, RATE button on coverage tab should take user to summary
							nextTab(document.aiForm.currentTab.value+'/rate', 'summary');
						}
						else{
							$('#samePremium').modal('show');
							return;
						}
					} else {
						if(!checkAccVio()){ return false; }
						executeReorderWorkflow();
						if(isEndorsement() && !checkIfAccVioReportsPendingRate($(this).attr('id'))){return false;}
						//Rate button at the bottom of coverage page behaves differently
						if($(this).parent().hasClass('covrgRateButton')){
							if(isEndorsement()){
								//45460 - DriverTab SecondaryNamedInsured
								$('#transactionProgress').val('9');
							}
							nextTab(document.aiForm.currentTab.value+'/rate', ops);
						}
						else{
							nextTab(document.aiForm.currentTab.value, ops);
						}
						return;
					}
				} else {
    				// If Summary tab is unreachable but we are displaying a current quote, let them reach Summary page
					if(isAlreadyRated() && !$('li#summary').hasClass('disabledTab')){
						if($(this).parent().hasClass('covrgRateButton')){
							//If quote is already rated, RATE button on coverage tab should take user to summary
							nextTab(document.aiForm.currentTab.value+'/rate', 'summary');
						}
						else{
							$('#samePremium').modal('show');
							return;
						}
					} else {
						//TD#64321 To change the mvr status to ReorderRequired when driver information is changed
						var currTabId = document.aiForm.currentTab.value;
						if(currTabId=='drivers' && !isEndorsement()){resetReOrderStatus();}
						//Added 01/16/2015 51146 RATE button clicked, it should follow the "Leaving page-staying in quote workflow"
						if(isMVRReorderRequired(ops)){return;}
						if(!checkAccVio()){ return false; }
						executeReorderWorkflow();
						if(isEndorsement() && !checkIfAccVioReportsPendingRate($(this).attr('id'))){return false;}
						//Rate button at the bottom of coverage page behaves differently
						if($(this).parent().hasClass('covrgRateButton')){
							nextTab(document.aiForm.currentTab.value+'/rate', ops);
						}
						else{
							nextTab(document.aiForm.currentTab.value, ops);
						}
					}
				}
			}
		}  logToDb("navigation.js: 240 - Exiting $('#rate,#rate_temp').click handler");
	});

	$('button#cancelReportsAndRate').on('click',function(event) {
		$('div.orderReportsPending').hide();
		if($('#readOnlyMode').val() != 'Yes'){
			rateOnSummary();
		}
	});
	$('#PremiumSame').click(function(){
		$('#samePremium').modal('hide');
	});

	//vmaddiwar - Made it live because dynamically we are hiding/show divs on reset premium.
	//live will catch dynamic ids correctly
	$(document).on("click", "#rateEndorsement,button#cancelReportsPendingRate", function(){
		var currentTab = document.aiForm.currentTab.value;
		//Added 01/16/2015 51146 RATE button clicked, it should follow the "Leaving page-staying in quote workflow"
		if(this.id=='rateEndorsement' && isMVRReorderRequired('rate')){return;}
		if(this.id=='rateEndorsement' && !checkAccVio()){ return false; }
		if(this.id=='rateEndorsement' && currentTab=='drivers'){
			setMvrDataUpdatedIndicator('drivers');
			//Reset the reorderInd. Automatic reorder should not happen as popup shouldn't show when Rate is clicked (2.1 BR).
			$("#mvrReOrderInd").val('');
		}
		if($('#navigateToSummary').val()=='true'
				&& $(this).attr('id')=='cancelReportsPendingRate'){
			rateOnSummary();
			$("div.orderReportsPendingRate").hide();
			return;
		}
		//if defaultZeroedPremium if not null means premium is affected
		var wasPremiumAffected = $('#defaultZeroedPremium').val();
		if(wasPremiumAffected == null || wasPremiumAffected == '') {
			$("#samePremium").modal('show');
		} else{
			$("div.orderReportsPendingRate").hide();
			//Added 01/16/2015 51146 RATE button clicked, it should follow the "Leaving page-staying in quote workflow"
			if(this.id=='rateEndorsement' && isMVRReorderRequired('rate')){return;}
			if(!checkIfAccVioReportsPendingRate($(this).attr('id'))){return false;}
			if (currentTab=='client') {
				if(dobAndInsuredChanged()){
					showMessageForDOBPNIDataModify();
					return;
				}
					var ops = 'rate';
					//45460 - DriverTab SecondaryNamedInsured - Set FirstTimeThrough for newly added SNI
					$('#transactionProgress').val('9');
					nextTab(currentTab, ops);
			}else{
				var ops = 'rate';
				//45460 - DriverTab SecondaryNamedInsured - Set FirstTimeThrough for newly added SNI
				$('#transactionProgress').val('9');
				nextTab(currentTab, ops);
			}
		}
	});

	// Set the height of the legacy frame to the height of its contents
	// Only works for non-cross domain inner pages
	$('#legacyFrame').load(function() { logToDb("navigation.js: 281 - Entering (and Exiting) $('#legacyFrame').click handler");
		/*var legacyFrame = $(this);
        var innerHeight = 550;
        window.onerror = function(msg, url, line) {
			// Ignore this error and go with the default height
        	legacyFrame.height(innerHeight);
		};

        var innerDoc = (this.contentDocument) ? this.contentDocument : this.contentWindow.document;
        var innerContent = $("html", innerDoc);

        if (innerContent != null && innerContent.length > 0) {
	        innerHeight = innerContent[0].scrollHeight;
		}
        $(this).height(innerHeight);*/
	});

	$('.clsEndorsementType').click(function(event) {
		//switchEndorsementMode($(this).val());
		//47247-Warning Message  when Changing Client information (Name and Address and DOB) in edorsement mode allowing endorsment to issue
		//dont allow chnaging mode when data P* NI related data changes.
		if (document.aiForm.currentTab.value=='client' && dobAndInsuredChanged()) {
			var transTypeCd = $("#transactionTypeCd").val();
			$("#transactionTypeCd").val(transTypeCd);
			if(transTypeCd== 'Quote'){
				$('input:radio[name=endorsementType]:nth(0)').attr('checked',true);
			} else{
				$('input:radio[name=endorsementType]:nth(1)').attr('checked',true);
			}
			showMessageForDOBPNIDataModify();
			return;
		}
		switchEndorsementModeAndSubmit($(this).val());
	});

	//Copy Quote related
	$('#cpQuoteLink').click(function(event) {
		$('#copyQuoteDlg').modal('show');
	});

	$('#saveCopyQuote').click(function(event) {
		executeReorderWorkflow();
		removeObjectsFromSession();
		copyQuote();
	});
	logToDb("navigation.js: 310 - Exiting ready()");
});

function callForms(formsaction) {
	console.log('formsAction = '+formsaction);
	if (isEndorsement() || $('#readOnlyMode').val() == 'Yes') {
		callGlobalHeaderAction(formsaction);
	} else {
		var event = jQuery.Event(getSubmitEvent());
		$('#aiForm').trigger(event);
		if (!event.isPropagationStopped()) {
			saveNBPage(formsaction);
		}
	}
}

function findTab(tabs, tabID){
	return $.grep(tabs, function(n, i){
		return n.id == tabID;
	});
}

function getSubmitEvent() {
	return 'preSubmit';
}

function getSubmitFailureEvent() {
	return 'submitFailed';
}

function newPolicy(){
	//document.aiForm.action = "/aiui/policies/policy";
	//document.aiForm.nextTab.value = 'client';
	//document.aiForm.submit();
	return false;
}

function fetchPolicy() {  logToDb("navigation.js: 334 - Entering fetchPolicy");
	var policyNumber = $('#fetchPolicyNumber').val();
	if (policyNumber == null || policyNumber == '') {
		alert('You must enter a Policy Number');
	} else {
		blockUser();

		var event = jQuery.Event(getSubmitEvent());
		$('#aiForm').trigger(event);
		if (event.isPropagationStopped()) { logToDb("navigation.js: 343 - Inside evet.isPropagationStopped() in fetchPolicy()");
			$.unblockUI();
		} else {
			document.aiForm.action = "/aiui/policies/policy/" + encodeURI(policyNumber);
			document.aiForm.nextTab.value = 'client';
			document.aiForm.submit();
		}
	}
}

function prePerformSubmit(actionURL){
	// tjmcd - This should be removed and its functionality replaced with trigger(getSubmitEvent() processing
	if(actionURL == 'client'){
		checkClientPreSubmit();
	}
	
	clearOptionalValues();
}

function isAlreadyRated(){
	var wasPremiumAffected = $('#defaultZeroedPremium').val();
	var ratedIndicator =  $('#ratedInd').val();
	return (ratedIndicator == 'Yes' && (wasPremiumAffected == null || wasPremiumAffected == ''));
}

function performBlockUserFuncion(currentTab, targetTag){
	if(targetTag == 'comprater/initiateRMV'){
		//Show differente loading message whenever rating while landing to summary page
		logToDb("navigation.js: 388 - Before blockUserForRMVRate");
		blockUserForRMVRating();
		logToDb("navigation.js: 388 - After blockUserForRMVRate");
	}
	if(targetTag == 'comprater/initiateRMVOnClient'){
		//Show differente loading message whenever rating while landing to client page
		blockUserForRMVClientRating(); 
	}
	//When Rate is hit from Coverage tab, a different message other than "Loading" should be shown
	else if(currentTab=='coverages' && targetTag=='rate'){ logToDb("navigation.js: 372 - In if block with currentTab=='coverages' AND targetTag == 'rate'. About to call blockUserForRating()");
		//Need to re-check these indicators for Rate button on coverage page
		// If Summary tab is unreachable but we are displaying a current quote, let them reach Summary page
		if(isAlreadyRated() && !$('li#summary').hasClass('disabledTab')){
			return true;
		}
		blockUserForRating();
	}
	//First time entry of Acc/Vio page takes a long time due to automatic report ordering
	else if($('#firstTimeThru').val()=='true' && $('#stateCd').val()=='MA' && currentTab=='vehicles' && targetTag=="accidentsViolations"){
		blockUserForOrderReports();
	}
	else{ logToDb("navigation.js: 383 - In else block of if statement with condition currentTab = " + currentTab + " AND targetTag is not 'rate'. Current value of currentTab = " + currentTab + ", targetTag = " + targetTag);
		//--Clear optional fields
		//--Show pl. wait when navigating
		if(targetTag == 'rate/summaryRate'){
			//Show differente loading message whenever rating while landing to summary page
			logToDb("navigation.js: 388 - Before blockUserForRating"); blockUserForRating(); logToDb("navigation.js: 388 - After blockUserForRating");
		}else{
			logToDb("navigation.js: 390 - Before blockUser");  blockUser(); logToDb("navigation.js: 390 - After blockUser");
		}
	}
	return false;
}

function umbrellaNextTab(actionURL, targetTag,event) {
	var currentTab =  $('#currentTab').val();
	var premAmt = $('#premAmt').val();
	var reRate = false;
	if(premAmt == "" || premAmt == "0.0000"){
		reRate = true;
	}

	if (currentTab == 'umbrellafinish' && ($('#fileList').children().length > 0 || $('#agentComments').val() != '')) {
		leaveUmbrellaFinishTab(null,targetTag,event);
		return;
	}else {
		if(reRate){
			blockUserForRating();
		}else{
			blockUser();
		}
		var event = jQuery.Event(getSubmitEvent());
		$('#umbrellaForm').trigger(event);
		if (event.isPropagationStopped()) {
			$.unblockUI();
		}else{
			logToDb("In navigation.js: 365 -  nextTab currentTab = " + currentTab);
			enableFields(); // enable disable fields for saving
			document.umbrellaForm.action = "/aiui/" + actionURL;
			document.umbrellaForm.nextTab.value = targetTag;
			logToDb("navigation.js: 410 - Before document.umbrellaForm.submit()"); document.umbrellaForm.submit();
		}
	}
}

function leaveUmbrellaFinishTab(action,targetTag,event) {

	var finishHasData = ($('#fileList').children().length > 0 || $('#agentComments').val() != '');

	$('.modal').hide();
	$('.popover').hide();
	if (typeof event === 'undefined') {event = jQuery.Event( "click");}
	event.preventDefault ? event.preventDefault() : event.returnValue = false;

	if (finishHasData) {
		$("#promptFinishMsg").html("You are attempting to leave the Finish tab!<br/> If you leave the Finish tab your Files and Comments will be deleted. " +
		"You will need to enter Comments and add Files again prior to submitting the application to Underwriting.");
		$('#continueLeavePrompt').off();
		$(document).on("click", "#continueLeavePrompt", function(fnctCall){
			$('#exitPromptFinishModal').modal('hide');
			if(targetTag != null) {
				document.umbrellaForm.nextTab.value = targetTag;
				document.umbrellaForm.action = "/aiui/umbrellafinish";
				document.umbrellaForm.submit();

			}else {
				document.umbrellaForm.nextTab.value = null;
				var strURL =  "/aiui/umbrellafinish";

				$.ajax({
					url: strURL,
					type:'POST',
					data: $("#umbrellaForm").serialize(),

					beforeSend: function(status, xhr){
						showLoadingMsg();
					},
					success: function(data){ logToDb("navigation.js: 597 - In success handler of the ajax call " + strURL + " )");
						//alert("success");
					},
					error: function(xhr, status, error){ logToDb("navigation.js: 600 - In the error handler of the ajax call " + strURL + " in saveNBPage(). Response status " + status + " and error message: " + error);
						//alert("error is " + error);
					},
					complete: function(){
						// complete we want to redirect user to chosen action
						callGlobalHeaderAction(action);
					}
				});
			}
		});

		$(document).on("click", "#sofPrompt", function(fnctCall){
			$('#exitPromptFinishModal').modal('hide');
		});

		// show prompt
		$('#continueLeavePrompt').removeClass("hidden");
		$('#sofPrompt').removeClass("hidden");
		$('#exitPromptFinishModal').modal('show');
	} else {
		$("#promptMsg").html("You are leaving this quote. Do you want to: Save & Exit, Exit without Saving or Cancel?");
		$(document).on("click", "#exitPrompt", function(fnctCall){
			$('#exitPromptModal').modal('hide');
			showLoadingMsg();
			callGlobalHeaderAction(action);
		});

		$(document).on("click", "#saveExitPrompt", function(){
			$('#exitPromptModal').modal('hide');
			showLoadingMsg();
			callGlobalHeaderAction(action);
		});

		// show prompt
		$('#saveExitPrompt').removeClass("hidden");
		$("#exitPrompt").removeClass("hidden");
		$('#exitPromptModal').modal('show');
		return;
	}


}

function nextTab(actionURL, targetTag) { logToDb("navigation.js: 362 - Entering nextTab(actionURL, targetTag)");
	updatePriorPremium();
	var currentTab =  $('#currentTab').val();
	logToDb("In navigation.js: 365 -  nextTab currentTab = " + currentTab);
	prePerformSubmit(actionURL);
	hideFlyPanels();

	//set insurance reorder flag as 'Yes' if respective applicant field edited
	setInsuranceReOrderIndicator(currentTab);
	//TD# 72231  Automatic Report order- Message should be same as ordering when entering accident violation in direct entry.
	if($('#automaticReorderAccidentViolations').val()=='true'){
		blockUserForOrderReports();
	}else{
		if(performBlockUserFuncion(currentTab, targetTag)){
			return;
		}
	}

	if(targetTag == 'comprater/initiateRMVOnClient'){
		targetTag = 'comprater/initiateRMV';
	}

	logToDb("navigation.js: 393 - Before var event = jQuery.Event(getSubmitEvent())");
	var event = jQuery.Event(getSubmitEvent());
	event.targetTag=targetTag;
	$('#aiForm').trigger(event); logToDb("navigation.js: 395 - After aiForm trigger event");
	//31836 - Vehicle and Details prefill links STILL are considered leaving the page, and should not be.
	if (event.isPropagationStopped() && document.aiForm.viewPrefill.value!='true') { logToDb("navigation.js: 396 - In event.isPropagationStopped() if block, about to call $.unblockUI()");
		$.unblockUI();
	} else {
		if(actionURL == 'prefill'){	logToDb("navigation.js: 399 - In actionURL = prefill if block. About to call submitPrefillForm");
			submitPrefillForm(actionURL, targetTag);
			return;
		}
		logToDb("navigation.js: 393 - Before var event = jQuery.Event(getSubmitEvent())");
		if ($('#policySourceCd').val() == 'ENDORSEMENT') {
			actionURL += '/endorsement';
		}
		$('.eligibilityErrorModal').modal('hide');
		document.aiForm.action = "/aiui/" + actionURL;
		document.aiForm.nextTab.value = targetTag;
		logToDb("navigation.js: 410 - Before document.aiForm.submit()"); document.aiForm.submit();
	} logToDb("navigation.js: 411 - Exiting nextTab(actionURL, targetTag)");
}

function nextTabReadOnly(actionURL, targetTag) { logToDb("navigation.js: 411 - Entering nextTabReadOnly(" + actionURL + ", " + targetTag + ")");
	/*
	document.aiForm.action = '/aiui/redirect/readOnlyMode';
	document.aiForm.policyKeyNum.value = document.aiForm.policyKey.value;
	document.aiForm.policyNum.value = document.aiForm.policyNumber.value;
	document.aiForm.nextTab.value = targetTag;
	document.aiForm.method="POST";
	document.aiForm.submit();
	*/
	if(isEndorsement()){
		reDirectToEndorsementTargetPage('/aiui/redirect/endorsement/readOnlyMode', targetTag);
	}else{
		reDirectToTargetPage('/aiui/redirect/readOnlyMode', targetTag);
	}
}

function reDirectToNextTargetPage(actionURL, targetTag) {
	logToDb("navigation.js: 427 - Entering reDirectToNextTargetPage");
	reDirectToTargetPage('/aiui/redirect/reDirectToTargetPage', targetTag); logToDb("navigation.js: 428 - Exiting reDirectToNextTargetPage");
}

function reDirectToTargetPage(actionURL, targetTag) { logToDb("navigation.js: 431 - Entering reDirectToTargetPage(" + actionURL + "," + targetTag +")");
	document.aiForm.action = actionURL;
	document.aiForm.policyKeyNum.value = document.aiForm.policyKey.value;
	document.aiForm.policyNum.value = document.aiForm.policyNumber.value;
	document.aiForm.stateCode.value=$('#stateCd').val();
	document.aiForm.uwCompany.value=$('#uwCompanyCd').val();
	document.aiForm.nextTab.value = targetTag;
	document.aiForm.method="POST";
	document.aiForm.submit();
}

//This is for Endorsement
function reDirectToEndorsementTargetPage(actionURL, targetTag) {

		document.actionForm.txnEffDate.value = $("#tranEffDt").val();
		document.actionForm.effDateFrom.value = $("#policyEffDt").val();
		document.actionForm.policyNumber.value = document.aiForm.policyNumber.value;
		document.actionForm.term.value = $("#term").val();
		document.actionForm.company.value = $("#companyCd").val();
		document.actionForm.lob.value = $("#lob").val();
		document.actionForm.state.value = $("#stateCd").val();
		document.actionForm.nextTab.value = targetTag;
		document.actionForm.amendTranNbr.value = $("#amendTranNbr").val();
		document.actionForm.transactionType.value = $("#transactionTypeCd").val();
		document.actionForm.action = actionURL;
		document.actionForm.method="POST";
		document.actionForm.submit();
}

function submitPrefillForm(actionURL, targetTag){ logToDb("navigation.js: 440 - Entering submitPrefillForm(" + actionURL + "," + targetTag +")");
	//document.aiPreFillForm.action = "/aiui/" + actionURL;
	//document.aiPreFillForm.nextTab.value = targetTag + '?fromPrefill=true';
	//document.aiPreFillForm.submit();
	
	if ( preProcessPrefillFormData() ) {		
	 	document.aiForm.action = "/aiui/" + actionURL;
	 	document.aiForm.nextTab.value = targetTag + '?fromPrefill=true';
	 	document.aiForm.submit();
}
}

function goHome() {
	blockUser();
	var event = jQuery.Event(getSubmitEvent());
	$('#aiForm').trigger(event);
	if (event.isPropagationStopped()) {
		$.unblockUI();
	} else {
		$('#aiForm').trigger(getSubmitEvent());
		document.aiForm.action = "/aiui/landing";
		document.aiForm.submit();
	}
}

function legacyNav(legacyURL) {
	document.aiForm.action = "/aiui/legacy";
	document.aiForm.nextTab.value = legacyURL;
	document.aiForm.submit();
}

function savePolicy() {
	if (isUmbrellaQuote()) {
		//nextTab(document.umbrellaForm.currentTab.value, document.umbrellaForm.currentTab.value);
		saveUmbrellaPage('');
	}else {
	nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
}
}

function checkAccVio(nextTab){
	//User not allowed to navigate away, save Acc/Vio page or rate if information is incomplete
	//ADD or SAVE rows not completely entered or canceled
	var returnVal = true;
	if (document.aiForm.currentTab.value=='accidentsViolations'){
		if(!isReadyToSubmit()){
			$('div.incompletePageModal').show();
			$.blockUI({message: ""});
			returnVal = false;
		}

		if(nextTab == 'summary' && isEndorsement()){
			returnVal = checkIfReportsPending();
			if(!returnVal){
				$('div.orderReportsPending').show();
				$.blockUI({message: ""});
			}
		}
	}

	return returnVal;
}

function checkIfAccVioReportsPending(currentId){
	var returnVal = true;
	if(currentId=='summary'){
		$('#navigateToSummary').val('true');
	} else{
		$('#navigateToSummary').val('false');
	}
	if(currentId != 'cancelReportsAndRate'){
		returnVal = checkIfReportsPending();
		if(!returnVal){
			$('div.orderReportsPending').show();
			$.blockUI({message: ""});
		}
	}

	return returnVal;
}

function checkIfAccVioReportsPendingRate(currentId){
	var returnVal = true;
	//If coverage bottom rate is hit or Cancel is hit after coverage bottom rate is hit, go to summary after rating
	if(currentId=='rate'
		|| ($('#navigateToSummary').val()=='true' && currentId=='cancelReportsPendingRate')){
		$('#navigateToSummary').val('true');
	} else{
		$('#navigateToSummary').val('false');
	}
	if(currentId != 'cancelReportsPendingRate'){
		returnVal = checkIfReportsPending();
		if(!returnVal){
			$('div.orderReportsPendingRate').show();
			$.blockUI({message: ""});
		}
	}

	return returnVal;
}

function checkIfReportsPending(){
	if(isEndorsement()){
		if(document.aiForm.currentTab.value=='drivers'){
			$('#endorsementOnlyRatedDriverInd').val('');
			$('input[class=clsEndorsementDriverAddedInd][value=Yes],input[class=clsEndorsementExistingDriverRatedInd][value=Yes]').each(function(){
				var currIndex = getIndexOfElementId(this);
				var licenseStateCd = $('#licenseState_'+currIndex).val();
				var stateCd = $('#stateCd').val();
				//53911 && 55639 -- updated logic for MA
				if("MA" == stateCd){
					if(!isDeferred2Impl(currIndex) && !isMASpecificDriver(stateCd,licenseStateCd)){
						if($('#mvrOrderSatatus_'+currIndex).val()=='Successful'
							|| $('#mvrOrderSatatus_'+currIndex).val()=='Successful-No Data'
								|| $('#mvrOrderSatatus_'+currIndex).val()=='Unsuccessful'){
							return;
						}
						$('#endorsementOnlyRatedDriverInd').val('Yes');
						return false;
					}
				}else if(isRated(currIndex)){
					if($('#mvrOrderSatatus_'+currIndex).val()=='Successful'
						|| $('#mvrOrderSatatus_'+currIndex).val()=='Successful-No Data'
						|| $('#mvrOrderSatatus_'+currIndex).val()=='Unsuccessful'){
						return;
					}
					$('#endorsementOnlyRatedDriverInd').val('Yes');
					return false;
				}
			});
		}
		var defaultZPremiumAmt = $('#defaultZeroedPremium').val();
		if(($('#endorsementOnlyRatedDriverInd').val() == 'Yes')
				&& $('#mvrOrderStatus').val() != 'Successful'
				&& $('#mvrOrderStatus').val() != "Successful-No Data"
				&& $('#mvrOrderStatus').val() != "Unsuccessful"
				&& defaultZPremiumAmt == '0.00' && $('#isQuote').val() == 'false'){
			return false;
		}
	}
	return true;
}

function blockUserForRating(){
	blockUserCommon('Just a moment while we get your rate....','250px');
}

function blockUserForOrderReports(){
	blockUserCommon('Just a moment while we order your reports....','250px');
}

function blockUserForRMVRating(){
	blockUserCommon('We are processing an RMV look-up and re-rating your quote.  Please wait....','250px');
}

function blockUserForRMVClientRating(){
	blockUserCommon('Please wait while we are completing the quote...','250px');
}

function blockUser(){
	blockUserCommon('Loading...','100px');
}

function blockUserForVehicleLookup(){
	blockUserCommon('Lookup in progress. Please Wait..','250px');
}

function typeOfDevice(){
	if(screen.width <= 480){
		return "Mobile";
	}else if(screen.width > 480 && screen.width <= 768){
		return "Tablet";
	}else{
		return "Desktop";
	}
}
function blockUserCommon(msg,inputWidth){
   var loadingImage = imagePath + "loading_icon.gif";
	
		if( typeOfDevice() == 'Mobile'){
			$.blockUI({
				message: "<img src='" + loadingImage + "'/><br/>"+msg,
				css: { width: inputWidth, padding: '5px 2px', margin:'0'}
			});
		}else{
			$.blockUI({
				message: "<img src='" + loadingImage + "'/><br/>"+msg,
				css: { width: inputWidth, padding: '5px 2px', margin:'0 120px'}
			});
		}	
		
	
}


/** Prompt Exit Logic **/
function showExitPrompt(action, blnAgencyProfile, companyCode, event, blnShowExitPrompt){ logToDb("navigation.js: 529 - Entering showExitPrompt(" + action + ", " + blnAgencyProfile + ", event)");
    if (isUmbrellaQuote() && document.umbrellaForm.currentTab.value == 'umbrellafinish' ) {
    	leaveUmbrellaFinishTab(action,null,event);
    	return;
    }
    if (typeof blnAgencyProfile === 'undefined') {blnAgencyProfile = false;}
    if (typeof companyCode === 'undefined') {companyCode = "";}
	if (typeof event === 'undefined') {event = jQuery.Event( "click");}
	if (typeof blnShowExitPrompt === 'undefined') {
		if(typeof isHomePolicy !== 'undefined' && isHomePolicy()){
			if (homeIFrameLoadCheck()) {
				callGlobalHeaderAction(action);
			} else {
				//Send Message to Agency 6
				showExitWindowHomeNB(action, blnAgencyProfile, companyCode, event, blnShowExitPrompt);
			}
			return;
		}else{
			blnShowExitPrompt = exitPromptRequired(blnAgencyProfile, companyCode);
		}
	}

	var policySourceCd = $('#policySourceCd').val();

	if(blnShowExitPrompt){
		// hide any existing modal windows as we cannot have stackable modals
		$('.modal').hide();
		$('.popover').hide();
		event.preventDefault ? event.preventDefault() : event.returnValue = false;

		$(document).on("click", "#exitPrompt", function(fnctCall){
			$('#exitPromptModal').modal('hide');
			showLoadingMsg();
			if (!isUmbrellaQuote()) {
			removeObjectsFromSession();
			}
			if (policySourceCd == 'ENDORSEMENT') {
				//make call to delete pending amendment - only for prime end
				deletePendingAmendment(action);
			}else{
				callGlobalHeaderAction(action);
			}
		});
		// Used die, But we may need to replace live and die from 1.9
		$('#saveExitPrompt').off();
		$(document).on("click", "#saveExitPrompt", function(){
			$('#exitPromptModal').modal('hide');
			// isHomeQuote - call save -jgarrison
			if (isUmbrellaQuote()) {
				saveUmbrellaPage(action);
			}else {
				//Fix for duplicate issue
				removeObjectsFromSession();
				if(document.aiForm.currentTab.value == "forms"){
					callGlobalHeaderAction(action);
				}else{
					executeReorderWorkflow();
					saveNBPage(action);
				}

			}
		});

		// show prompt
		$("#exitPrompt").removeClass("hidden");
		$('#exitPromptModal').modal('show');
		return;
	}
		callGlobalHeaderAction(action);
	logToDb("navigation.js: 562 - Exiting showExitPrompt(" + action + ", " + blnAgencyProfile + ", event)");
}

function saveUmbrellaPage(action) {
	var currentTab = document.umbrellaForm.currentTab.value;
	var strURL = "/aiui/" + currentTab + "?saveAndExit=1";
	document.umbrellaForm.nextTab.value = currentTab;

	var event = jQuery.Event(getSubmitEvent());
	$('#umbrellaForm').trigger(event);
	checkPreSubmit();
	clearOptionalValues();
	enableFields();

	if (action != "") {
		$.ajax({
			url: strURL,
			type:'POST',
			data: $("#umbrellaForm").serialize(),

			beforeSend: function(status, xhr){
				showLoadingMsg();
			},
			success: function(data){ logToDb("navigation.js: 597 - In success handler of the ajax call " + strURL + " )");
				//alert("success");
			},
			error: function(xhr, status, error){ logToDb("navigation.js: 600 - In the error handler of the ajax call " + strURL + " in saveNBPage(). Response status " + status + " and error message: " + error);
				//alert("error is " + error);
			},
			complete: function(){
				// complete we want to redirect user to chosen action
				callGlobalHeaderAction(action);
				hideLoadingMsg();
			}
		});
	} else {
		showLoadingMsg();
		document.umbrellaForm.action = strURL;
		document.umbrellaForm.submit();
	}

}

function saveNBPage(action){ logToDb("navigation.js: 565 - Entering saveNBPage(" + action + ")");
	updatePriorPremium();
	var currentTab;

	if(document.aiForm != undefined){
		currentTab= document.aiForm.currentTab.value;
	}else{
		currentTab = $('input[name="currentTab"]').val();
	}

	//set insurance reorder flag as 'Yes' if respective applicant field edited
	setInsuranceReOrderIndicator(currentTab);

	var strURL = "/aiui/" + currentTab + "?saveAndExit=1";

	if(currentTab == 'application'){
		strURL = "/aiui/application/saveOnlyApplication/application?saveAndExit=1";
	}
	
	if(currentTab == 'prefill'){
		if ( !preProcessPrefillFormData() ) {
			return false;
		}
	}
	
	prePerformSubmit(currentTab);
	document.aiForm.nextTab.value = currentTab; // set next tab

	var event = jQuery.Event(getSubmitEvent());
	$('#aiForm').trigger(event);

	$.ajax({
		url: strURL,
		type:'POST',
		data: $("#aiForm").serialize(),

		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		success: function(data){ logToDb("navigation.js: 597 - In success handler of the ajax call " + strURL + " )");
			//alert("success");
		},
		error: function(xhr, status, error){ logToDb("navigation.js: 600 - In the error handler of the ajax call " + strURL + " in saveNBPage(). Response status " + status + " and error message: " + error);
			//alert("error is " + error);
		},
		complete: function(){
			// complete we want to redirect user to chosen action
			callGlobalHeaderAction(action);
		}
	});
}

function deletePendingAmendment(action){
	// set URL and get parameters from policy
	// build query string
	
	var strURL = "/aiui/endorsement/delete/amendment";
	var polNumber;
	var formData;

	if (isHomeQuote()) {
		strURL = "/aiui/homeRentersQuote/delete/amendment";
		polNumber = document.homeForm.homePolicyNumber.value;
		formData = $("#homeForm").serialize();
	}else if(document.cancelEndPolicyForm){
		polNumber = document.cancelEndPolicyForm.policyNumber.value;
		formData = $("#aiForm").serialize();
	}else{
		polNumber = document.aiForm.policyNumber.value;
		formData = $("#aiForm").serialize();
	}
	strURL = addRequestParam(strURL, "policyNumber", polNumber);
	$.ajax({
		url: strURL,
		type:'POST',
		data: formData,
		dataType: 'json',
		async:false,
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		success: function(data){ logToDb("navigation.js: 624 - In success handler of the ajax call " + strURL + " )");
			//alert("success");
		},
		error: function(xhr, status, error){ logToDb("navigation.js: 627 - In the error handler of the ajax call " + strURL + " in deletePendingAmendment(). Response status " + status + " and error message: " + error);
			//alert("error is " + error);
		},
		complete: function(){
			// complete we want to redirect user to chosen action
			callGlobalHeaderAction(action);
		}
	});
	
}

function exitPromptRequired(blnAgencyProfile, companyCode){
	if (typeof companyCode === 'undefined') {companyCode = "";}

	var msg = "";
	var policyKey;
	var blnNewUmbrellaQuote = false;

	if ( $('#readOnlyMode').val() == 'Yes' ) {
		return false;
	}

	if (isUmbrellaQuote()) {
		if (isUmbrellaQuoteSubmitted()) {
			return false;
		}else {
			policyKey = $('input[name="umbrellaPolicy.policyKey"]').val();
			if($('input[name="umbrellaPolicy.policyNumber"]').val() == ""){
				blnNewUmbrellaQuote = true;
			}
		}
	}else if (isHomeQuote()) {
		policyKey = $('input[id="homePolicyKey"]').val();
	}else{
		policyKey = $('input[name="policy.policyKey"]').val();
	}

	var currentTab;

	if(document.aiForm != undefined){
		currentTab= document.aiForm.currentTab.value;
	}else{
		currentTab = $('input[name="currentTab"]').val();
	}

	var legacyPage = $('input[name="legacyPage"]').val();
	var policySourceCd = $('#policySourceCd').val();
	var blnShowExitPrompt = false;

	// check where need to prompt user
	if(blnAgencyProfile && !agentHasAccesstoSelectedAction(companyCode, legacyPage)){
		msg = "You are leaving " + legacyPage + ". Do you want to: Exit or Cancel?";
	}else if(currentTab != undefined && currentTab != "" && currentTab != "preferences"){
		if(policySourceCd == 'ENDORSEMENT') {
			msg = "You are leaving Endorsements. Do you want to: Exit or Cancel?";
		}else if(policyKey != undefined && policyKey != ""){
			 if(blnNewUmbrellaQuote || currentTab == "umbrellafinish"){
				 msg = "You are leaving this quote. Do you want to: Exit without Saving or Cancel?";
			 }else if(policyKey != "0" && !isHomeQuote()){
				msg = "You are leaving this quote. Do you want to: Save & Exit, Exit without Saving or Cancel?";
				$("#saveExitPrompt").removeClass("hidden");
			}else{
				if(isHomeQuote() && isHomeownersPolicy() && isPrimaryInsuredEmpty()){
					msg = "The client information is blank.  Click Cancel to add before leaving the quote.";
				}else{
				msg = "You are leaving this quote. Cancel to return to the quote.";
			}
				
			}
		}else if(blnAgencyProfile){
			msg = "You are leaving Inquiry. Do you want to: Exit or Cancel?";
		} else if(currentTab.toUpperCase() == "WEBPAY"){
			msg = "You are leaving WebPay. Do you want to: Exit or Cancel?";
		}else if(currentTab.toUpperCase() == "MESSAGESADMINEDITOR"){
			msg = "You are leaving this message. Do you want to: Exit without saving or Cancel?";
		}
	}else if(legacyPage != undefined && legacyPage != ""){
		if(legacyPage.toUpperCase() == "QUOTE"){
			msg = "You are leaving this quote. Do you want to: Exit without Saving or Cancel?";
		}else if(legacyPage.toUpperCase() == "WEBPAY"){
			msg = "You are leaving WebPay. Do you want to: Exit or Cancel?";
		}else if(legacyPage.toUpperCase() == "ENDORSEMENT"){
			msg = "You are leaving Endorsements. Do you want to: Exit or Cancel?";
		}else if(blnAgencyProfile){
			if(legacyPage.toUpperCase() == "INQUIRY"){
				msg = "You are leaving " + legacyPage + ". Do you want to: Exit or Cancel?";
			}
		}
	}

	if(msg != ""){
		$("#promptMsg").html(msg);
		blnShowExitPrompt = true;
	}

	return blnShowExitPrompt;
}

function agentHasAccesstoSelectedAction(companyCode, legacyPage){
	if(companyCode != "PA" && legacyPage.toUpperCase() == "COMMISSION STATEMENTS"){
		return false;
	}else if(companyCode == "HP"){
		if(legacyPage.toUpperCase() == "DOCUMENT SEARCH"
		|| legacyPage.toUpperCase() == "AGENCY BANK ACCOUNT") {
				return false;
		}
	}else if(companyCode == ""){
		if(legacyPage.toUpperCase() == "DOCUMENT SEARCH"
			|| legacyPage.toUpperCase() == "TRANSACTION REPORTING"
			|| legacyPage.toUpperCase() == "AGENCY BANK ACCOUNT") {
					return false;
			}
	}

	return true;
}

function callGlobalHeaderAction(action){
	if(typeof(action) == "function") {
		action();
	}else{
		window.open(action, "_self");
	}
}

function switchEndorsementMode(tranTypeCd) {

	var url = document.actionForm.endSwitchURL.value;
	if(url != '') {
		showLoadingMsg();
		document.actionForm.txnEffDate.value = $("#tranEffDt").val();
		document.actionForm.policyNumber.value = $("input[name='policy.policyNumber']").val();
		document.actionForm.term.value = $("#term").val();
		document.actionForm.company.value = $("#companyCd").val();
		document.actionForm.lob.value = $("#lob").val();
		document.actionForm.state.value = $("#stateCd").val();
		document.actionForm.nextTab.value = document.aiForm.currentTab.value;
		document.actionForm.amendTranNbr.value = $("#amendTranNbr").val();
		document.actionForm.transactionType.value = tranTypeCd;
		document.actionForm.action = url;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

function switchEndorsementModeAndSubmit(tranTypeCd) {
	//If current mode is the same, no need to reset premium or load page.
	if($("#transactionTypeCd").val()!=null && tranTypeCd!=null
			&& $("#transactionTypeCd").val().toUpperCase()==tranTypeCd.toUpperCase()){
		return;
	}

	//first clear premium
	resetPremiumForAll();
	//switch the mode and save the current page.
	document.aiForm.switchEndorsementMode.value = 'true';
	$("#transactionTypeCd").val(tranTypeCd);
	nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
}


function copyQuote() {
	$('#copyQuoteDlg').modal('hide');
	$("#copyQuoteFlag").val('Yes');
	savePolicy();
	//copyQuoteNow();
	//TD 50281 - Copy Quote - Not working sporatically. This functionality has been moved to backend
	/*$.ajax({
		   async:false,
		   url:savePolicy(),
		   success:function(){
			   //copyQuoteNow();
		}
	});*/
}

function copyQuoteNow() {
	var url = document.actionForm.copyEditURL.value;
	if(url != '') {
		showLoadingMsg();
		document.actionForm.policyKey.value = $("#policyKey").val();
		document.actionForm.policyStatus.value = $("#transactionStatusCd").val();
		document.actionForm.policyNumber.value = $("input[name='policy.policyNumber']").val();
		document.actionForm.dataSource.value = 'NEW_BUSINESS';
		document.actionForm.lob.value = $("#lob").val();
		document.actionForm.channel.value = $("#channelCd").val();
		document.actionForm.state.value = $("#stateCd").val();
		document.actionForm.company.value = $("#companyCd").val();
		document.actionForm.transactionType.value = $("#transactionTypeCd").val();
		document.actionForm.requestSource.value = "NewBusiness";
		document.actionForm.nextTab.value = 'client';
		document.actionForm.action = url;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

function hideErrorOnActiveTabFirstTime(){
	var firstTime = document.aiForm.firstTimeThru.value;
	var currentTab = document.aiForm.currentTab.value;
	if(firstTime == 'true'){
		$('#' + currentTab + '_error').addClass('hidden');
	}
}

function confirmMessageAndSubmit(messageTitle, messageText, strCurrentTab, strTarget){
	$('#infoCloseModal').hide();
	if (messageTitle != null && messageTitle.length > 0 ) {
		$('#confirmMVRReorder #title').html(messageTitle);
	}
	$('#confirmMVRReorder #message').html(messageText);

	$('#confirmMVRReorder #ok').click(function() {
		$("#confirmMVRReorder").hide();
		if(strTarget=='summary'){
			rateOnSummary();
		} else{
			//#55579...MA Endorsment only.. if ok is selected Before submit just check each currently Rmv looked up driver
			//has prior lic info or not to order prior lic (mvr) reports also.
			if (isEndorsement() && getPolicyState() == STATE_MA) {
				if (performOrderReportsForPriorLicForCurrRmvLookupDrvrs('DriverPage', strTarget)) {
					return true;
				} else {
					nextTab(strCurrentTab, strTarget);
				}
			} else {
				nextTab(strCurrentTab, strTarget);
			}

		}
	});
	$("#confirmMVRReorder").show();
	$.blockUI({message: ""});
}

//This function is used to rate whenever we navigated to summary tab
function rateOnSummary(){ logToDb("navigation.js: 771 - Entering rateOnSummary()");
	//if from comprater
	//TD 63311 - Fixed issue where comprater is called for half-bridge while it shouldn't.
	if($("#stateCd").val() == 'MA' && document.aiForm.currentTab.value == 'summary' && $("#rmvLookupInd").val() != 'Yes'
			&& $("#ratedSource").val()!=null && $("#ratedSource").val().toLowerCase() == "comprater"){
		nextTab(document.aiForm.currentTab.value, "comprater/initiateRMV");
		return;
	}
	var isDisabled = $(this).hasClass('disabled');
	if(isDisabled) { logToDb("navigation.js: 779 - In isDisabled block of rateOnSummary() - about to call event.stopPropagation()");
		event.stopPropagation();
	} else {
		var ratedIndicator =  $('#ratedInd').val();
		if(ratedIndicator==null || ratedIndicator != 'Yes'){
			if(isEndorsement()){
				//45460 - DriverTab SecondaryNamedInsured - Set FirstTimeThrough newly added SNI
				$('#transactionProgress').val('9');
			}
			nextTab(document.aiForm.currentTab.value, "rate/summaryRate");
		}else{
			if(isAlreadyRated() || $('#readOnlyMode').val() == 'Yes' ){
				logToDb("navigation.js: 792 - After if readOnlyMode yes");
				if(document.aiForm.currentTab.value == 'summary' ){
					return;
				}
				nextTab(document.aiForm.currentTab.value, 'summary');
			} else {
				nextTab(document.aiForm.currentTab.value, "rate/summaryRate");
			}
		}
	} logToDb("navigation.js: 799 - Exiting rateOnSummary()");
}

function isTabDisabledBasedOnProgess(tabName) {
	var transactionTypeCd = $("#transactionTypeCd").val();
	var progress = $("#transactionProgress").val();
	var tabCode = getTabOrderCode(tabName);
	var currTabCode = getTabOrderCode(document.aiForm.currentTab.value);
	var disabled = false;
	if(currTabCode == "webPay"){
		return true;
	}
	if (isEndorsement()) {
		return false;
	}

	if(isQuote() && (progress == null || progress == '') && parseInt(tabCode) != 1){
		disabled = true;
	}

	if(isQuote() && (progress !=null && progress != '') && parseInt(tabCode) > parseInt(progress) ){
		disabled = true;
	}

	if(parseInt(currTabCode) == parseInt(tabCode)){
		disabled = false;
	}

	if (transactionTypeCd != null && transactionTypeCd != '' && transactionTypeCd == 'Application'
		&& parseInt(currTabCode) != 9 && tabName == 'bind' ) {
		disabled = true;
	}

	return disabled;
}


function printTimeStamp() {
    var now = new Date();
    logToDb("Time:" + ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
                  + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                  .getSeconds()) : (now.getSeconds()))) );
}
