jQuery(document).ready(function() {
	
	$('#tabPanel').hide();
	$('#rateLinks').hide();
	$('#mainContent').css('padding-bottom', '50px');
	if($("#errorMessages").val()){
		errorMessages = JSON.parse($("#errorMessages").val());	
	}
	if($("#pageErrorInfo").val()){
		pageErrorInfo = JSON.parse($("#pageErrorInfo").val());	
	}

	var downPaymentMethod= $("#downPaymentMethodCd").val();		
	
	document.addEventListener("keydown", KeyCheck);
	//set value on confirmation page
	
	$("#EWC").hide();
	$("#EWA").hide();	
	$("#DC").hide();
	$("#MP").show();
	$("#EMAIL").hide();
	
	
	$("#downPaymentMethodCd option[value='MO']").remove();
	$("#downPaymentMethodCd option[value='INV']").remove();
	//Added logic same as bind to remove EWA if channel is 'IA'
	if(isEmployee() || $("#channel").val() != 'IA' || $("#accountsdata").val() == 'false') {
		$("#downPaymentMethodCd option[value='EWA']").remove();
	}
	triggerValueChange($('#downPaymentMethodCd'));
		
	
	
	$(".aiPrintBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiPrintBtn').click handler");
		window.print();
	});
	
	$(".aiHelpBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiHelpBtn').click handler");
		$("#webPayHelpModeless").modal('show');
		e.stopPropagation();
	});
	
	$(".aiHelpReviewBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiHelpReviewBtn').click handler");
		$("#searchPaymentHelpModeless").modal('show');
		e.stopPropagation();
	});
	
	$(".aiHelpConfirmBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiHelpConfirmBtn').click handler");
		$("#reviewWebPayHelpModeless").modal('show');
		e.stopPropagation();
	});
	
	$(".aiEmailBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiEmailBtn').click handler");
		$("#EMAIL").show();		
		$("#toAddress").focus();
	});
	
	$(".aiEmailSendBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiEmailSendBtn').click handler");		
		sendEmail();
	});	
	
	$(".aiEmailCancelBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiEmailCancelBtn').click handler");		
		$("#EMAIL").hide();
	});
	
	$(".aiCVVHelpBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiCVVHelpBtn').click handler");
		$("#webPayCVVHelpModeless").modal('show');
		e.stopPropagation();
	});
	
	$("#mask_cardNumber").bind({'keyup keydown keypress': function(e) {updateCardNumberLength(this,e);}});
	
	$(".prime2LegacyBtn").bind("click",function() {logToDb("webPay.js - Entering $('.aiCVVHelpBtn').click handler");
		var legacyparams =$('#legacyParams').val();
	    if (legacyparams != "") {
		    var res = legacyparams.split("-");
		    submitActionForm($('#policyNumber').val(),res[0],res[1],'1',res[2],'',res[3],res[4],res[5],'',res[6],'Documents');
	    }
	});
	
	 // Advanced Policy Search
	  $(document).on("click", ".openAdvPolSearch", function(){
		  $('#searchIn').val("WP");
		  $('#advSearchPolicyForm input[id="searchRequestSource"]').val("PolicySearch");
		  openAdvPolicySearch();
		  clearAdvSearchForTab("WP_advSearch");
		 
	  });
	
	$(".paymentAmt").click(function () {
		var rowPrefix = $(this).attr('id');
		$("#paymentSelected").val(rowPrefix);
		showClearInLineErrorMsgsWithMap('otherPaymentAmt', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
		showClearInLineErrorMsgsWithMap('minPaymentAmt', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
		showClearInLineErrorMsgsWithMap('outStandingPaymentAmt', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
		if(rowPrefix == 'minPaymentAmt'){
			$("#paymentAmount").val($("#minimumAmountDue").val());
			$("#otherAmount").val('');
		} else if(rowPrefix == 'otherPaymentAmt') {
			$("#otherAmount").focus();
			$("#paymentAmount").val($("#otherAmount").val());			
		} else {
			$("#otherAmount").val('');
		}
	});
	
	if (downPaymentMethod == "DC") {
		$("#DC").show();
	}
	if (downPaymentMethod == "EWC") {
		$("#EWC").show();
	}
	
	if (downPaymentMethod == "EWA") {
		$("#EWA").show();
	}
	
	var paymentAmount= $("#paymentAmount").val();
	var otherAmount= $("#otherAmount").val();
	var rowPrefix = $("#paymentSelected").val();
	$('input:radio[name=paymentAmt][id='+rowPrefix+']').attr('checked', true);
	
	$('#addrstateCd').bind({"change blur" : function(){
		var stateVal = $(this).val();
/*		var zipLookupReturnedState = $('#zipLookupReturnedState').val();
		if(!isValidValue(zipLookupReturnedState)){
			var errorMessageID = '';
			var strId = $('#zip').attr('id');
			if(stateVal == 'NJ' || stateVal == 'MA' || stateVal == 'CT' || stateVal == 'NH'){
				errorMessageID = 'zip.browser.inLine.InvalidZip';
			}
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);
*/			$('#addressState').val(stateVal);
			
/*		}*/
	}});
	
	$(".tabAsCreditNextButton,.tabCreditNextButton").bind("click",function() {logToDb("webPay.js: - Entering $('.tabCreditNextButton').click handler");
		$('#payAsCreditModal').modal('hide');
		
		/*vshah
		 * the indicator used .attr before jquery3.2.1 upgrade now it will use .prop that will return as true or false instead of checked
		 * */ 
		var strCertifyPaymentInd;
		 
		if ($('#downPaymentMethodCd').val() =='DC'){
			strCertifyPaymentInd = $("#certifyPaymentInd_DC").prop('checked');	
		} else if ($('#downPaymentMethodCd').val() =='EWC'){
			strCertifyPaymentInd = $("#certifyPaymentInd_EWC").prop('checked');	
		} 
		
		if ($('#downPaymentMethodCd').val() !='EWA') {
			if (strCertifyPaymentInd) {
				$("#certifyPaymentInd").val('Yes');
			}	
		}
		
		var rowPrefix = $('input[type=radio][name=paymentAmt]:checked').attr('id');
		$("#paymentSelected").val(rowPrefix);
		if (rowPrefix == 'minPaymentAmt') {
			$("#paymentAmount").val($("#minimumAmountDue").val());
		} else if (rowPrefix == 'outStandingPaymentAmt') {
			$("#paymentAmount").val($("#outstandingBalance").val());
		} else if (rowPrefix == 'otherPaymentAmt') {
			$("#paymentAmount").val($("#otherAmount").val());
		}
		
		$("#cardTypeCd").val("C");
		var strID = $(this).attr('id');
		$('#requiredBinValidation').val(true);
		if (strID =='payAsCredit') {
			$('#requiredBinValidation').val(false);
		}
		if ($('#downPaymentMethodCd').val() =='EWC' || $('#downPaymentMethodCd').val() =='EWA') {
			$('#requiredBinValidation').val(false);
		}
		showLoadingMsg();
		if ($('#webpaySource').val() == 'landing'){ 
			document.aiForm.action = "/aiui/webpaynb/quickLinkConfirmWebPayDetails";
		}
		else {
			document.aiForm.action = "/aiui/webpaynb/confirmWebPayDetails";
		}
		document.aiForm.nextTab.value = "webPay";
		document.aiForm.submit();	
	});
	
	$('#otherAmount').on('change blur', function(event, result) {
		var rowPrefix = $('input[type=radio][name=paymentAmt]:checked').attr('id');
		if (rowPrefix == 'otherPaymentAmt') {
			validateOtherAmount(this);
		}			
	});
		
	$(".viewWebPaymentCls").bind("click", function(event){ logToDb("webPay.js:- Entering $('.viewWebPaymentCls').click handler");
	
		showLoadingMsg();	
		document.aiForm.action = "/aiui/webpaynb/viewWebPaymentDetail";
		document.aiForm.policyNumber.value = encodeURI($(this).attr('policyNumber'));
		document.aiForm.confirmationId.value = $(this).attr('confirmationId');
		document.aiForm.rewSearchParams.value = $("#searchParams").val();
		document.aiForm.nextTab.value = "webPay";
		document.aiForm.submit();
	});	
	
	$(".reviewPayments").bind("click", function(event){ logToDb("webPay.js - Entering $('.reviewPayments').click handler");
	
		showLoadingMsg();	
		document.aiForm.action = "/aiui/webpaynb/returnToReviewWebPayDetails";
		document.aiForm.policyNumber.value = $('#policyNumberVar').val();
		document.aiForm.rewSearchParams.value = $("#searchParams").val();
		document.aiForm.nextTab.value = "webPay";
		document.aiForm.submit();
	});	
	
	$(".cancelWebPaymentCls").bind("click", function(event){ logToDb("webPay.js- Entering $('.cancelWebPaymentCls').click handler");
	
	$('#cancelPaymentDialog').modal('show');	
	var policyNumber = encodeURI($(this).attr('policyNumber'));
	var confirmationId = $(this).attr('confirmationId');
	var paymentType = $(this).attr('paymentType');
	var owner = $(this).attr('owner');
	var uwCompany = $(this).attr('uwCompany');
	$('#cancelPayment').on("click", function() {
		$('#cancelPaymentDialog').modal('hide');
		showLoadingMsg();
		document.aiForm.action = "/aiui/webpaynb/cancelWebPayment";
		document.aiForm.policyNumber.value = policyNumber;
		document.aiForm.confirmationId.value = confirmationId;
		document.aiForm.paymentType.value = paymentType;
		document.aiForm.owner.value = owner;
		document.aiForm.uwCompany.value = uwCompany;
		document.aiForm.nextTab.value = "webPay";
		document.aiForm.submit();
	});
	$('#closeCancelPayment').on("click", function() {
		$('#cancelPaymentDialog').modal('hide');
	});
	
});	
	
	$(".changeCardType").bind("click",function(event) {logToDb("Entering $('.changeCardType').click handler");
	
		if ($('#downPaymentMethodCd').val() =='DC'){
			var strCertifyPaymentInd = $("#certifyPaymentInd_DC").prop('checked');
			
			if (!strCertifyPaymentInd) {
				$('#myChkModal').modal();
				return;	
			} else {
				$("#certifyPaymentInd").val('Yes');
			}
		 } 
	
	
		$('#payAsCreditModal').modal();
		 return;
	 });
	
	$(".payAsDebit").bind("click",function(event) {	logToDb("Entering $('.payAsDebit').click handler");
		if ($('#downPaymentMethodCd').val() =='DC'){
			var strCertifyPaymentInd = $("#certifyPaymentInd_DC").prop('checked');
			
			if (!strCertifyPaymentInd) {
				$('#myChkModal').modal();
				return;	
			} else {
				$("#certifyPaymentInd").val('Yes');
			}
		 }
		$('#payAsDebitModal').modal();
		 return;
	 });
	
	$(".webPayMakePaymentCls").bind("click",function(event) {logToDb("webPay.js - Entering $('.webPayMakePaymentCls').click handler");
				var rowPrefix = $('input[type=radio][name=paymentAmt]:checked').attr('id');
				$("#paymentSelected").val(rowPrefix);
				if (rowPrefix == 'minPaymentAmt') {
					$("#paymentAmount").val($("#minimumAmountDue").val());
				} else if (rowPrefix == 'outStandingPaymentAmt') {
					$("#paymentAmount").val($("#outstandingBalance").val());
				} else if (rowPrefix == 'otherPaymentAmt') {
					$("#paymentAmount").val($("#otherAmount").val());
				}

				$("#cardTypeCd").val("C");
				showLoadingMsg();
				//document.aiForm.action = "/aiui/webpaynb/confirmWebPayDetails";
				if ($('#webpaySource').val() == 'landing'){ 
					document.aiForm.action = "/aiui/webpaynb/quickLinkConfirmWebPayDetails";
				}
				else {
					document.aiForm.action = "/aiui/webpaynb/confirmWebPayDetails";
				}
				document.aiForm.nextTab.value = "webPay";
				document.aiForm.submit();
	});
	$(".tabDebitNextButton").bind("click",function() {logToDb("webPay.js - Entering $('.tabDebitNextButton').click handler");
				$('#payAsDebitModal').modal('hide');
				
				var strCertifyPaymentInd = $("#certifyPaymentInd_DC").prop('checked');
				if (strCertifyPaymentInd) {
					$("#certifyPaymentInd").val('Yes');
				}
				
				var rowPrefix = $('input[type=radio][name=paymentAmt]:checked').attr('id');
				$("#paymentSelected").val(rowPrefix);
				if (rowPrefix == 'minPaymentAmt') {
					$("#paymentAmount").val($("#minimumAmountDue").val());
				} else if (rowPrefix == 'outStandingPaymentAmt') {
					$("#paymentAmount").val($("#outstandingBalance").val());
				} else if (rowPrefix == 'otherPaymentAmt') {
					$("#paymentAmount").val($("#otherAmount").val());
				}
				$("#cardTypeCd").val("D");
				$('#requiredBinValidation').val(false);
				showLoadingMsg();
				//document.aiForm.action = "/aiui/webpaynb/confirmWebPayDetails";
				if ($('#webpaySource').val() == 'landing'){ 
					document.aiForm.action = "/aiui/webpaynb/quickLinkConfirmWebPayDetails";
				}
				else {
					document.aiForm.action = "/aiui/webpaynb/confirmWebPayDetails";
				}
				document.aiForm.nextTab.value = "webPay";
				document.aiForm.submit();
			});
	
	var requiredBinValidation=  $("#requiredBinValidation").val();
	var isDebitCard= $("#isDebitCard").val();
	var isValidCard= $("#isValidCard").val();
	
	
	$("#BV").hide();
	if (downPaymentMethod == 'DC'){
		if (requiredBinValidation == "true") {
			if (isValidCard == "true") {
				if (isDebitCard == "true") {
					$("#BV").show();
					$("#MPP").hide();
				/*	$("#MakePayment").hide();
					var focusOn = $("#MPP").attr('id');
					closeSetFocus(focusOn);*/
				}
				else {
					$('#cardTypeCd').val("C");
					$("#MPP").show();
				}
			}
		}
	}

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
	
	$(".clsPayorAddrLine1Txt,.clsPayorAddrLine2Txt").bind({'keypress': function(e) {fmtAddress(this,e);},
		'paste':function(event){
		var element = this;
		setTimeout(function(){
			var enteredName = element.value;
			var formattedName = enteredName.replace(/[^\\/,.#a-zA-Z0-9-'& ]/g, "");
			$('#'+element.id).val(formattedName);
			//validateAddressLine1(element,event);
		}, 100);
	}
	});	

	$('#downPaymentMethodCd,#payorCityName,#downPayBankAccountTypeCd,#agentBankName,#emailSubject').on('change blur', function(event, result) {
		validateFieldRequired(this);	
	});		
	
	$(".maskAccountNum").bind({
		blur: function() {
			  var elm = this.id;
			  var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			  maskAccountNum(this,hdnField);
			  $("#"+elm).addClass("masked");			  
			}
	});	
	
	$(".maskDate").bind({
		blur: function() {
			var elm = this.id;
			var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			maskDate(this,hdnField);
			$("#"+elm).addClass("masked");
		}
	});	
	
	$('#mask_cardExpDt').keyup(function(e){
		/*if(e && e.keyCode && e.keyCode == 9) {
			$(window).scrollTop('#mainContent');
			e.preventDefault();
			return false;
		}*/
		formatDate(this, "MM/YYYY");
	});
	function formatDate(oField, format)
	{
		
		var cursorPos = getCursorPosition(oField);
		var fld = oField.value;
		var startFieldLength = fld.length;
		var findNonNumericCharacters = /\D/g; 
		
		fld = fld.replace(findNonNumericCharacters, "");

		var rawDate = fld;	
		var flda, fldb;
		var fldlen = fld.length;
		
		if(fldlen >= 2)
		{
			flda = fld.substr(0,2);
			fldb = fld.substr(2);
			fld = flda + "/" + fldb;
			++fldlen;
		};
		
		// check if the field actually changed, this allows shift+arrow key selections 
		// to work since they do not modify the value.  Otherwise, the restoration of the
		// cursor position via setCursorPosition destroys the current selection.
		if(oField.value != fld)
		{
			oField.value = fld;

			var cursorOffset = (fld.length - startFieldLength);

			if(cursorOffset < 0)
			{
				cursorOffset = 0;
			}

			setCursorPosition(oField, cursorPos + cursorOffset);
		}
		
	}
	
	
	function setCursorPosition(textBox, position)
	{
		if(textBox.setSelectionRange)
		{
			textBox.setSelectionRange(position, position);
		}
		else if(textBox.createTextRange)
		{
			var range = textBox.createTextRange();
			
			range.collapse(true);
			range.moveEnd('character', position);
			range.moveStart('character', position);
			range.select();
		}
	}

	
	function getCursorPosition(textBox)
	{
		var cursorPos = 0;
		
		if(document.selection)
		{
			var sel = document.selection.createRange();
			
			sel.moveStart('character', -textBox.value.length);
			cursorPos = sel.text.length;
		}
		else if(textBox.selectionStart || textBox.selectionStart == '0')
		{
			cursorPos = textBox.selectionStart;
		};
		
		return cursorPos;
	}
	
	$(".maskCardCvv").bind({
		blur: function() {
			var elm = this.id;
			var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			maskCardCvv(this,hdnField);
			$("#"+elm).addClass("masked");
		}		
	});	
	
	/*$("#mask_confirmBankAccountNumber").bind({
		'cut copy paste':function(e){
			return false;
		}
	});*/
	
	
	$('#mask_downPayBankRoutingtNumber,#mask_downPayBankAccountNumber').on('change blur', function(event, result) {
	
		var strId = this.id;
		var fieldId = strId.substr(5, strId.length);
		var valStr = $(this).val();
		var strErrorTag =  strId + '.browser.inLine';
		var errorMessageID = '';
		if(valStr.substr(0, 5) == "*****"){
			valStr = $('#' + fieldId).val();
		}		
		if (valStr.length == 0) {
			errorMessageID = 'required';
		} else if(!$.isNumeric(valStr)){
			errorMessageID = 'NotNumeric';
		} else {
			if(fieldId == 'downPayBankRoutingtNumber') {
				if (valStr.length < 9 ) {
					errorMessageID = 'MinNineDigits';
				} else {
					var errorFlag = validateRoutingnumber(valStr);
					if(!errorFlag){
						var errorMessageID = 'InvalidNumber';
					}
				}
			} else {
				if (valStr.length < 4 ) {
					errorMessageID = 'MinFourDigits';
				}
				
				if(errorMessageID == '') {
					/*if (fieldId == 'confirmBankAccountNumber') {
						var value1 =  $('#downPayBankAccountNumber').val();
						var value2 =  $('#confirmBankAccountNumber').val();
						if(value1.length >= 4 && value2.length >= 4) {
							if (value1 != value2) {
								errorMessageID = 'match';
							}
						}
					}*/
				}
			}
		}
		clearInLineRowError(fieldId, fieldId, fieldIdToModelErrorRow['defaultSingle'], '', -1, null);
		if(errorMessageID != '') {
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
	});
	
	$('#mask_cardNumber,#mask_cardCvv').on('change blur', function(event, result) {
		var strId = $(this).attr('id');
		var fieldId = strId.substr(5, strId.length);
		var strErrorTag = strId + '.browser.inLine';
		var errorMessageID = '';
		var value = $(this).val();
		if(fieldId == 'cardNumber') {
			if(value.substr(0, 5) == "*****"){
				value = $('#' + fieldId).val();
			}	
		} else {
			if(value.substr(0, 3) == "***"){
				value = $('#' + fieldId).val();
			}
		}
		if (value.length == 0) {
			errorMessageID = 'required';					
		} else if(!$.isNumeric(value)) {
			errorMessageID = 'NotNumeric';
		} 
		clearInLineRowError(fieldId, fieldId, fieldIdToModelErrorRow['defaultSingle'], '', -1, null);
		if(errorMessageID != '') {
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}			
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
	});
	
	$('#mask_cardExpDt').on('change blur', function(event, result) {
		var strId = $(this).attr('id');
		var fieldId = strId.substr(5, strId.length);
		var strErrorTag = strId + '.browser.inLine';
		var errorMessageID = '';
		var value = $(this).val();
		if(value.substr(0, 3) == "***"){
			value = $('#' + fieldId).val();
		}
		if (value.length == 0) {
			errorMessageID = 'required';					
		} else if(!isValidExpDate(value)) {
			errorMessageID = 'Invalid';
		}
		clearInLineRowError(fieldId, fieldId, fieldIdToModelErrorRow['defaultSingle'], '', -1, null);
		if(errorMessageID != '') {
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}			
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
	});
	
	/*$('#payorAddrLine1Txt,#payorAddrLine2Txt').on('change blur', function(event, result) {
		//validateAddress(this);
	});*/
	
	$('#payorFirstName,#payorLastName').on('change blur', function(event, result){
		validatePayorName(this);		
	});
	
	$('#payorZip').on('change blur', function(event, result){
	
		var zipRegex = new RegExp(/(^\d{5}$)/);
		var zip = $(this).val();
		var fieldId = $(this).attr('id');
		var valid = zipRegex.test(zip);
		var errorMessageID = '';
		if (!valid){
			errorMessageID = 'InvalidZip';
			if(zip == null || zip == '' || zip == undefined){
				errorMessageID = 'required';
			}
			errorMessageID = fieldId + '.browser.inLine.' + errorMessageID;
		}
		showClearInLineErrorMsgsWithMap(fieldId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);

	});
	
	$('#emailId,#fromAddress,#toAddress,#ccAddress').on('change blur', function(event, result){
		validateEmail(this);
	});
	
	 $('#openErrorModal').click(function(e){
	    	$("#editsModal").trigger(showErrorDetailsPopup);
	 });
	
	 $(".clsmMaskedValue").bind({'keydown' :function(event){
		clearMaskedValue(this, event);
	 }});
	 
	$('.certifyPaymentInd').change(function(){
		if($(this).prop('checked')=='checked'){
			$("#certifyPaymentInd").val('Yes');
		} else{
			$("#certifyPaymentInd").val('No');
		}		
	});
	 
		
	 $('.maskAccountNum').each(function(){
		 if(this.id=='mask_downPayBankRoutingtNumber' && this.value==''){
			 $(this).val($('#downPayBankRoutingtNumber').val());
		 } else if(this.id=='mask_downPayBankAccountNumber' && this.value==''){
			$(this).val($('#downPayBankAccountNumber').val());
		 } else if(this.id=='mask_confirmBankAccountNumber' && this.value==''){
			$(this).val($('#confirmBankAccountNumber').val());
		 }
	});
	 
	 var submitFlag = $("#submitFlag").val();
	 
	 if(submitFlag == 'YES'){
		if(!errorsExistOnPage()){
			if($("#certifyPaymentInd") != 'Yes') {
				$('#myChkModal').modal();
				return;
			}
		}
	 } 
	 
});

	
	function validateOtherAmount(fieldName){		
		var strId = 'otherPaymentAmt';
		var strErrorTag = strId + '.browser.inLine';
		var errorMessageID = '';
		var otherAmountVal = (+$(fieldName).val());
		var outstandingAmount = (+$("#outstandingBalance").val()); 
		var minimumAmountDue = (+$("#minimumAmountDue").val());
		if (otherAmountVal.length == 0 || otherAmountVal == 0) {
			errorMessageID = 'required';					
		} else if(!$.isNumeric(otherAmountVal)) {
			errorMessageID = 'NotNumeric';
		} /*else if (outstandingAmount.length != 0 && outstandingAmount >0 && otherAmountVal > outstandingAmount) {
			errorMessageID ='greaterThan';
		}*/ /*else if (otherAmountVal < minimumAmountDue) {
			errorMessageID ='lessThan';
		}*/
		
		if(errorMessageID != '') {
			errorMessageID = strErrorTag + '.' + errorMessageID;			
		}
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
		return errorMessageID;
	}		
	
	var fieldIdToModelErrorRow = {
			"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>"
	};

	function validateFieldRequired (fieldName) {
		var errorMessageID = '';
		var strId = $(fieldName).attr('id');
		if ($(fieldName).val() == '' || $(fieldName).val() == null) {
			errorMessageID = strId + '.browser.inLine.required';
		} 
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
	}
	
	function showLegacyPage() {
		var legacyparams =$('#legacyParams').val();
	    if (legacyparams != "") {
		    var res = legacyparams.split("-");
		    submitActionForm($('#policyNumber').val(),res[0],res[1],'1',res[2],'',res[3],res[4],res[5],'',res[6],'Documents');
	    }
	}
	
	function updateCardNumberLength(elm,e) {
		
		if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))) {
			var elmNumber = elm.value;
			var re = /\D/g;
			elmNumber = elmNumber.replace(re,"");
			if (elmNumber.length == 2) {
				if ( elmNumber.charAt(0)== '3' && (elmNumber.charAt(1) == '4' || elmNumber.charAt(1) == '7')) {
					$(elm).prop('maxLength', 15);
					$('#mask_cardCvv').prop('maxLength', 4);
				} else {
					$(elm).prop('maxLength', 16);
					$('#mask_cardCvv').prop('maxLength', 3);
				}
			} 
		}
	}

	function validateFirstMiddleLastNames(firstMiddleLastName,e) {
		var charCode = (e.which) ? e.which : e.keyCode;
	    if (charCode == 8) return true;
	    var keynum;
	    var keychar;
	
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
	    	}
	}

	function validatePayorName(fieldName){
		var val = $(fieldName).val();
		var lob = $('#lob').val();
		var strId = fieldName.id;
		errorMessageID = isValidClientFirstLastName(val, 'Yes');
		if (strId == 'payorFirstName' && lob == 'CA') {
			if(errorMessageID == 'required') {
				errorMessageID ='';
			}
		}
		if (errorMessageID.length > 0){
			errorMessageID = strId + '.browser.inLine.' + errorMessageID;
		}else{
			errorMessageID = '';
		}		
		showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
		
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

	function validateEmail(field){
		var strID = field.id;
		var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w)+)?)((\.(\w){2,6})+)$/i);
		var emailAddress = $(field).val();
		var errorMessageID = '';
		if(emailAddress==null || emailAddress ==''){
			if (strID== 'fromAddress' || strID == 'toAddress') {
				errorMessageID = strID + '.browser.inLine.required';
			} else {
				errorMessageID = '';
			}
			 
		} else {
			var valid = emailRegex.test(emailAddress);
			if (!valid){
				errorMessageID = strID + '.browser.inLine.InvalidEmailId';				
			} 
		}
		showClearInLineErrorMsgsWithMap(strID, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);		
	}

	function validateAddress(field){
		var addressRegex = new RegExp(/\s*((((p(o|ob))|(b(ox|x)))(#|\d+|[^a-zA-Z]+|\s*)$))/i);
		
		var strID = field.id;
		var addrVal = $(field).val();		
		var errorMessageID = '';		
		if (strID =='payorAddrLine1Txt') {
			if (addrVal == '' || addrVal == null) {
				errorMessageID = strID + '.browser.inLine.required';
			} else if(addressRegex.test(addrVal)) {
				errorMessageID = strID + '.browser.inLine.Invalid';
			}
		} else {
			if(addrVal != '' && addressRegex.test(addrVal)){
				errorMessageID = strID + '.browser.inLine.Invalid';			
			}	
		}
		showClearInLineErrorMsgsWithMap(strID, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages);
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
	    if( charcheck.test(keychar))
	    	{
	    		return true;
	    	}
	   else
	    	{
	    		e.preventDefault();
	   	}
	 }
	
	function isValidExpDate(dValue) {		
		  var result = true;
		  
	   	  dValue = dValue.split('/');	   	  
	   	  if(!$.isNumeric(dValue[0]) || !$.isNumeric(dValue[1])) {	   		
	   		  return false;
	   	  }
	   
		  var d = new Date();
		  var cyear = d.getFullYear();
		  var cmonth = d.getMonth();
		  
		  if (dValue[1] > cyear) {
			  result = true;
		  }
		  
		  if (dValue[0] < 1 || dValue[0] > 12) {
		      result = false;
		  }
		  
		  if(dValue[1].length != 4) {
			  return false;
		  }
		  
		  if (dValue[0] <= cmonth  && dValue[1] == cyear) {
		      result = false;
		  }
		  
		  if (dValue[1] < cyear) {
		      result = false;
		  }		  

		  if (dValue[2]) {
		      result = false;
		  }
		  
		  return result; 
		}
	
	function sendEmail() {
		var policyNumber = $('#policyNumberVar').val();
		var paymentConfirmationID = $('#confirmationIDVar').val();
		var fromAddress = $('#fromAddress').val();
		var toAddress = $('#toAddress').val();
		var ccAddress = $('#ccAddress').val();
		var emailSubject = $('#emailSubject').val();
		var emailText = $('#emailText').val();		
		
		var mode = $('#mode').val();
		
		var errMsg = "";
		if(fromAddress == '') {
			errMsg = "<li class='errorMsg'>From address is required <a onclick='closeSetFocus(\"fromAddress\")'>Fix Now</a></li>";			
		}
		if(toAddress == '') {
			errMsg+= "<li class='errorMsg'>To address is required <a onclick='closeSetFocus(\"toAddress\")'>Fix Now</a></li>";
		}
		if(emailSubject == '') {
			errMsg+= "<li class='errorMsg'>Subject is required <a onclick='closeSetFocus(\"emailSubject\")'>Fix Now</a></li>";
		}
		
		if (errMsg != '') {
			$('#emailErrMsg').html(errMsg);
			$('#showEMailErrors').modal();
			return;
		}		
		
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/webpaynb/sendWebPaymentDetailEmail",
	        type: "post",
	        data : JSON.stringify({ "policyNumber":policyNumber, "paymentConfirmationID":paymentConfirmationID , 
	        						"mode":mode, "fromAddress":fromAddress, "toAddress":toAddress, "ccAddress":ccAddress,
	        						"emailSubject":emailSubject,"emailText":emailText}),
	        dataType: 'json',
	        beforeSend:function(){
				blockUser();
			},
	        async:true, //should be always true to make blockUser() work
	        success: function(response, textStatus, jqXHR){	        	
	        	var reponseStatus = JSON.stringify(response);
	        	if (reponseStatus.indexOf("success") >=0) {
	        		$("#EMAIL").hide();
	        		$('#emailConfirmMsg').html("The Email was sent successfully");	        			
	        	} else {
	        		$('#emailConfirmMsg').html("There was a error while sending the Email. Please try again");	        		
	        	}
	        	$('#showEmailConfirm').modal();
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
	        	//alert("There was a error while sending Email. Please try again");
	        	$('#emailConfirmMsg').html("The Email was sent successfully");
	        	$('#showEmailConfirm').modal();
	        },
	        complete: function(){
	        	$.unblockUI();
			}
	    });
	}
	
	function validateRoutingnumber(futurePayBankRoutingNumber){
		var i, n, t = futurePayBankRoutingNumber;
		n = 0;
		for (i = 0; i < t.length; i += 3) {
			n += parseInt(t.charAt(i),10) * 3
				+  parseInt(t.charAt(i + 1), 10) * 7
				+  parseInt(t.charAt(i + 2), 10);
			}			
			if (n != 0 && n % 10 == 0){
				return true;
			} else {				
				return false;
			}
	}

	function  clearMaskedValue(strElm, e) {
		if(strElm != ""){
			//clear for backspace and delete
			if (e.keyCode == 8 || e.keyCode == 46)
			{
				$(strElm).val("");
				if ((strElm.id.search("mask_") >=0)){
					//clear hidden value also.
					$("#"+strElm.name).val("");
					// TODO Tejas Uncomment this for resetting fields after binValidation landing
					/*if(strElm.name == 'cardNumber') {
						$('#requiredBinValidation').val(true);
						$("#BV").hide();
						$("#MPP").show();
					}*/
				}			
			}
		}
	}
	
	function downPaymentMethodChanged(downPaymentMethod){
		$("#DC").hide();
		$("#EWC").hide();
		$("#EWA").hide();
		$("#BV").hide();
		$("#MPP").show();
		$('#requiredBinValidation').val(true);
		$("#certifyPaymentInd_DC").removeAttr('checked');
		$("#certifyPaymentInd_EWC").removeAttr('checked');
		if (downPaymentMethod == 'DC'){
			$("#DC").show();			
			$("#EWC").hide();
			$("#EWA").hide();
			$('#EWC input[type="text"]').val('');
			$("#agentBankName").val('').trigger('chosen:updated');
			$("#downPayBankAccountTypeCd").val('').trigger('chosen:updated');
			$("#downPayBankRoutingtNumber").val('');
			$("#downPayBankAccountNumber").val('');
			$("#confirmDownPayBankAccountNumber").val('');
		} else if (downPaymentMethod == 'EWC'){
			$("#DC").hide();
			$("#EWC").show();			
			$("#EWA").hide();
			$('#DC input[type="text"]').val('');			
			$("#agentBankName").val('').trigger('chosen:updated');
			$("#cardNumber").val('');
			$("#cardCvv").val('');
			$("#cardExpDt").val('');
			$("#cardTypeCd").val('');
		} else if (downPaymentMethod == 'EWA'){
			$("#DC").hide();
			$("#EWC").hide();
			$("#EWA").show();
			$("#downPayBankAccountTypeCd").val('').trigger('chosen:updated');			
			$('#DC input[type="text"]').val('');
			$('#EWC input[type="text"]').val('');
			$("#cardNumber").val('');
			$("#cardCvv").val('');
			$("#cardExpDt").val('');
			$("#cardTypeCd").val('');
			$("#downPayBankRoutingtNumber").val('');
			$("#downPayBankAccountNumber").val('');
			$("#confirmDownPayBankAccountNumber").val('');
		};		
	}
	
	function errorsExistOnPage(){
		var pageErrors = $('#pageErrorInfo').val();
		if(pageErrors!=null && (pageErrors.indexOf('hard')!=-1 || pageErrors.indexOf('soft')!=-1)){
			return true;
		}
		return false;
	}