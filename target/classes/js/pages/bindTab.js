jQuery(document).ready(function() {
	
 	//$("SELECT").selectBoxIt('destroy');
	
	
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
    };
    
    //#TD 68636 if you try to backspace (to correct a keying error) the backspace does not work
    //document.addEventListener("keydown", KeyCheck);
    
    $('#rate').prop('disabled', true);
    $('#Freeform_cityName').hide();
    $('#addrstateCd').prop('disabled', false);
    $('#paymentWithDrawalDay').val($('#paymentWithDrawlDayLabel').text());    
    
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
		 
		 
	 $('#changeCardType').click(function(){
		
		 if ($('#downPaymentMethodCd').val() =='DC'){
			var strCertifyPaymentInd;
			strCertifyPaymentInd = $("#certifyPaymentInd_DC").attr('checked');
			
			if (strCertifyPaymentInd != "checked") {
				$('#myChkModal').modal();
				return;	
			}
			else {
				$("#certifyPaymentInd").val('Yes');
			}
		 } 
		 
		 $('#cardTypeCd').val("C"); 
		 if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
			 //eDocsprompt('issueCreditModal'); /* $('#eDocsModal').modal();  */
			 processPaymentModal('issueCreditModal');
		 }else{
			 $('.creditFormCls').addClass('tabBindNextButton');
			 $('#issueCreditModal').modal();
		 }
		 return;		
	 });
	
	  $('.closeModalBackdrop').on("click", function(){
		 $(".modal-backdrop").hide();
		});
	
	//53734-Client Mailing/Billing address is different than the Residence Address  getting red rimmed edit unnecessarily
	// Alpha & Numeric; Plus accept the following:Pound sign #backslash /forward slash\hyphen -apostrophe 'Ampersand &Comma ,Period .
	$(".clsAddr1,.clsAddr2").bind({'keyup keypress': function(event) {
		var key = event.which || event.keyCode;
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){}
		var regex = new RegExp(/[^A-Za-z0-9'#\s\.&,\\\/-]/i);
		if (this.value.match(regex)){
			 this.value = this.value.replace(regex, '');	
		}
	}});
	

	
	$('#address1').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#address2').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#Freeform_cityName').blur(function(){
		$('#mailingCity').val($(this).val());
		validatecityNameInput(this);
	});
	
	$('#cityName').bind({"change blur" : function(){
		$('#mailingCity').val($(this).val());
		validatecityNameInput(this);
	}});
	
	$('#addrstateCd').bind({"change blur" : function(){
		var stateVal = $(this).val();
		var zipLookupReturnedState = $('#zipLookupReturnedState').val();
		if(!isValidValue(zipLookupReturnedState)){
		//TD 62823
		/*  var errorMessageID = '';
			var strId = $('#zip').attr('id');
			if(stateVal == 'NJ' || stateVal == 'MA' || stateVal == 'CT' || stateVal == 'NH'){
				errorMessageID = 'zip.browser.inLine.InvalidZip';
			}
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);*/
			$('#addressState').val(stateVal);
			
		}
	}});
	
	if(isEmployee() || $("#channel").val() != 'IA' || $("#accountsdata").val() == 'false') {
		$("#downPaymentMethodCd option[value='EWA']").remove();
	}
	triggerValueChange($('#downPaymentMethodCd'));
	
	var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitBind").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/bind';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	$('#emailId').bind(getValidationEvent(), function(event, result){validateEmail(this);});
 
	$('#homePhoneNum').bind(getValidationEvent(),function(event, result){validatePhoneNumber(this);});
	$('#cellPhone').bind(getValidationEvent(),function(event, result){validatePhoneNumber(this);});
	$('#workPhoneNum').bind(getValidationEvent(),function(event, result){validateWorkPhoneNumber(this);});
	
	$('#homePhoneNum').bind(getValidationEvent(),function(event, result){addRemoveBindPreRequired();});
	$('#cellPhone').bind(getValidationEvent(),function(event, result){addRemoveBindPreRequired();});
	$('#workPhoneNum').bind(getValidationEvent(),function(event, result){addRemoveBindPreRequired();});
	
	$("#homePhoneNum").bind({'keyup keydown keypress': function(e) {fmtPhone(this,e);}});
	$("#cellPhone").bind({'keyup keydown keypress': function(e) {fmtPhone(this,e);}});	
	$("#workPhoneNum").bind({'keyup keydown keypress': function(e) {fmtPhone(this,e);}});
	
	$('#paymentMethodCd').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#downPaymentMethodCd').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$("#mask_futurePayBankRoutingNumber").bind({'keyup keydown keypress': function(e) {}});
	
	$('#mask_futurePayBankRoutingNumber').bind(getValidationEvent(), function(event, result){		
		
		var futurePayBankRoutingNumber =  $(this).val(); //$('#futurePayBankRoutingNumber').val();
		var strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';

		/*if (futurePayBankRoutingNumber.length == 0) {
			var strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			
		}
		else{
			validateBindFieldInput(this);
		}*/
		if(futurePayBankRoutingNumber.substr(0, 5) == "*****"){ // TODO: replace this temporary fix for 07/07/2014 only.
			futurePayBankRoutingNumber = $('#futurePayBankRoutingNumber').val();
		}
		
		if (futurePayBankRoutingNumber.length == 0) {
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			//validate('', $(this), 'Yes', 'futurePayBankRoutingNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else if (futurePayBankRoutingNumber.length < 9 ){
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}else if(!$.isNumeric(futurePayBankRoutingNumber)){
			var errorMessageID = 'numeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; 
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		
		
	});
	
	$("#mask_futurePayBankAccountNumber").bind({'keyup keydown keypress': function(e) {}}); //fmtNumber(this,e);
	
	$('#mask_futurePayBankAccountNumber').bind(getValidationEvent(), function(event, result){		
		var futurePayBankAccountNumber = $(this).val();
		
		if(futurePayBankAccountNumber.substr(0, 5) == "*****"){ 
			futurePayBankAccountNumber = $('#futurePayBankAccountNumber').val();
		}
		
		if (futurePayBankAccountNumber.length == 0) {
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			
		}
		else if (futurePayBankAccountNumber.length < 4 ){
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		} else if(!$.isNumeric(futurePayBankAccountNumber)){
			var strErrorTag = 'futurePayBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else{
			validateBindFieldInput(this);
		}
			
	});
	
	$("#mask_confirmBankAccountNumber").bind({'keyup keydown keypress': function(e) {}});//fmtNumber(this,e);
	
	$('#mask_confirmBankAccountNumber').bind(getValidationEvent(), function(event, result){		
		var confirmBankAccountNumber = $(this).val();
		
		if(confirmBankAccountNumber.substr(0, 5) == "*****"){ 
			confirmBankAccountNumber = $('#confirmBankAccountNumber').val();
		}
		
		if (confirmBankAccountNumber.length == 0) {
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			
		}
		else if (confirmBankAccountNumber.length < 4 ){
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}else if(!$.isNumeric(confirmBankAccountNumber)){
			var strErrorTag = 'confirmBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else{
			validateBindFieldInput(this);
		}
	});
	
	// Producer License Number
	$('#producerLicenseNumber').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#futurePayBankAccountTypeCd').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#payrollDeductGroupNumber').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$("#payrollDeductGroupNumber").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);}});
	
	$('#employeeId').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$("#mask_cardNumber").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);updateCardNumberLength(this,e);}});
	
	$('#mask_cardNumber').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$("#mask_cardExpDt").bind({'keyup keydown keypress': function(e) {fmtDate(this,e);}});
	
	$('#mask_cardExpDt').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});

	$('#mask_cardExpDt').blur(function(){
		validateBindFieldInput(this);
	});
	
	$("#mask_cardCvv").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);}});
	
	/*$('#mask_cardCvv').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});*/
	
	/** Recurring Payment changes **/
	$("#mask_recurrCardNumber").bind({'keyup keydown keypress': function(e) {fmtNumber(this,e);updateCardNumberLength(this,e);}});
	
	$('#mask_recurrCardNumber').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$("#mask_recurrCardExpDt").bind({'keyup keydown keypress': function(e) {fmtDate(this,e);}});
	
	$('#mask_recurrCardExpDt').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});

	$('#mask_recurrCardExpDt').blur(function(){
		validateBindFieldInput(this);
	});
	
	
	$('.paymentAmount').keyup(function(){
        if($(this).val().indexOf('.')!=-1){         
            if($(this).val().split(".")[1].length > 2){                
                if( isNaN( parseFloat( this.value ) ) ) return;
                this.value = parseFloat(this.value).toFixed(2);
            }  
         }            
         return this; //for chaining
    });

	$("#paymentAmount_DC").bind({'keyup keydown keypress': function(e) {fmtDecimal(this,e);}});

	$('#paymentAmount_DC').bind(getValidationEvent(), function(event, result){
		validateBindFieldInput(this);
		validatePaymentAmount(this);
	});

	$("#paymentAmount_EWC").bind({'keyup keydown keypress': function(e) {fmtDecimal(this,e);}});
	$('#paymentAmount_EWC').bind(getValidationEvent(), function(event, result){
		validateBindFieldInput(this);
		validatePaymentAmount(this);
	});
	
	$("#paymentAmount_EWA").bind({'keyup keydown keypress': function(e) {fmtDecimal(this,e);}});
	$('#paymentAmount_EWA').bind(getValidationEvent(), function(event, result){
		validateBindFieldInput(this);
		validatePaymentAmount(this);
		});

	$("#mask_downPayBankRoutingtNumber").bind({'keyup keydown keypress': function(e) {}});
	
	$('#mask_downPayBankRoutingtNumber').bind(getValidationEvent(), function(event, result){		
		
		var downPayBankRoutingNumber =  $(this).val(); // $('#downPayBankRoutingtNumber').val();										
		var strErrorTag = 'downPayBankRoutingtNumber.browser.inLine';

		if(downPayBankRoutingNumber.substr(0, 5) == "*****"){ // TODO: replace this temporary fix for 07/07/2014 only.
			downPayBankRoutingNumber = $('#downPayBankRoutingtNumber').val();
		}
		
		if (downPayBankRoutingNumber.length == 0) {
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			//validate('', $(this), 'Yes', 'futurePayBankRoutingNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else if (downPayBankRoutingNumber.length < 9 ){
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}else if(!$.isNumeric(downPayBankRoutingNumber)){
			var errorMessageID = 'numeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; 
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		/*else
			validateBindFieldInput(this);*/
		
	});
	
	$("#mask_downPayBankAccountNumber").bind({'keyup keydown keypress': function(e) {}});
	
	$('#mask_downPayBankAccountNumber').bind(getValidationEvent(), function(event, result){		
		var downPayBankAccountNumber = $(this).val();//$('#downPayBankAccountNumber').val();
		
		if(downPayBankAccountNumber.substr(0, 5) == "*****"){ 
			downPayBankAccountNumber = $('#downPayBankAccountNumber').val();
		}
		
		if (downPayBankAccountNumber.length == 0) {
			var strErrorTag = 'downPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);			
		}
		else if (downPayBankAccountNumber.length < 4 ){
			var strErrorTag = 'downPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		} else if(!$.isNumeric(downPayBankAccountNumber)){
			var strErrorTag = 'downPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}else
		validateBindFieldInput(this);
	});
	
	$("#mask_confirmDownPayBankAccountNumber").bind({'keyup keydown keypress': function(e) {}});
	
	$('#mask_confirmDownPayBankAccountNumber').bind(getValidationEvent(), function(event, result){		
		var confirmDownPayBankAccountNumber = $(this).val();//$('#confirmDownPayBankAccountNumber').val();
		
		if(confirmDownPayBankAccountNumber.substr(0, 5) == "*****"){ 
			confirmDownPayBankAccountNumber = $('#confirmDownPayBankAccountNumber').val();
		}
		
		if (confirmDownPayBankAccountNumber.length == 0) {
			var strErrorTag = 'confirmDownPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'required';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			
		}
		else if (confirmDownPayBankAccountNumber.length < 4 ){
			var strErrorTag = 'confirmDownPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'MinFourDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		} else if(!$.isNumeric(confirmDownPayBankAccountNumber)){
			var strErrorTag = 'confirmDownPayBankAccountNumber.browser.inLine';
			var errorMessageID = 'NotNumeric';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = this.id; //$(this).attr('id');
			//$('#'+strId).val("");
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
		else
			validateBindFieldInput(this);
	});
	
	$('#downPayBankAccountTypeCd').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
	
	$('#agentBankName').bind(getValidationEvent(), function(event, result){		
		validateBindFieldInput(this);
	});
    
	$('.edocCls').bind("click",function () {
		$('#eDocsModal').modal('hide');
		if ($('#downPaymentMethodCd').val() !='INV' && $('#downPaymentMethodCd').val() !='MO'
			&& $('#downPaymentMethodCd').val() !='EWA')
			$('#issueModal').modal('show');
	});

	$('#issueCheckModal').bind("click",function () {
		$('#issueCheckModal').modal('hide');
	});
	
	$('#issueDebitModal').bind("click",function () {
		$('#issueDebitModal').modal('hide');
	});
	
	$('#issueCreditModal').bind("click",function () {
		$('#issueCreditModal').modal('hide');
	});
	
	//Commented so that the modal will close only when clicked on button.
	/*$('#issueModal').bind("click",function () {
		$('#issueModal').modal('hide');
	});*/
	
	$('#issueModal').on('hidden',function(e){
	    $(this).remove();
	});
	
	$(".clsmMaskedValue").bind({'keydown' :function(event){
		clearMaskedValue(this, event);
	}});
	
	$('.certifyPaymentInd').change(function(){
		if($(this).attr('checked')=='checked'){
			$("#certifyPaymentInd").val('Yes');
		} else{
			$("#certifyPaymentInd").val('No');
		}		
	});
	
	$(document).on("click", ".tabBindNextButton", function(){
		
		var formsId = this.id;
	    var strCertifyPaymentInd;
	    
	    var futureId=$("#paymentMethodCd");
		futureId.prop('disabled',false);
		futureId.trigger('chosen:updated');
		
		
		 var downPaymentMethodId=$("#downPaymentMethodCd");
		 downPaymentMethodId.prop('disabled',false);
		 downPaymentMethodId.trigger('chosen:updated');
		
		var curPlan=$("#selectedPlan").val();
		var paymentMethodCd=$("#paymentMethodCd").val();
		
		
		if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
			if (paymentMethodCd !="EDB") {
				$('#paymentMethodfor6Pay').modal('show');
				return;
			}
		}
		
		$('#requiredBinValidation').val(false);
		//$('#issueModal').hide();
		$('#issueModal').modal('hide');
		if ($('#paymentMethodCd').val() =='EDB'){
			if ($('#futurePayBankAccountNumber').val() !=$('#confirmBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else
			{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
		}

		if ($('#downPaymentMethodCd').val() =='EWC'){
			if ($('#downPayBankAccountNumber').val() !=$('#confirmDownPayBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_downPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmDownPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_EWC').val()); 
			strCertifyPaymentInd = $("#certifyPaymentInd_EWC").attr('checked');
			if (strCertifyPaymentInd != "checked") {
				$('#myChkModal').modal();
				return;	
			}
			else {
				$("#certifyPaymentInd").val('Yes');
			}
		}

		if ($('#downPaymentMethodCd').val() =='DC'){
			strCertifyPaymentInd = $("#certifyPaymentInd_DC").attr('checked');
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_DC').val());
			
			if (strCertifyPaymentInd != "checked") {
				$('#myChkModal').modal();
				return;	
			}
			else {
				$("#certifyPaymentInd").val('Yes');
			}
		} 
		if ($('#downPaymentMethodCd').val() =='EWA') {
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_EWA').val()); 
		}
		if ($('#downPaymentMethodCd').val() !='MO' && $('#downPaymentMethodCd').val() !='INV' && $('#downPaymentMethodCd').val() !='') {

			var fullAmnt = $('#payPlnDwn').text();
			fullAmnt = fullAmnt.replace(/\,|\$/g, '');
			var minAmnt = ($('#payPlanTable #selectedPayPlan_PP_4PAY').find('td:eq(4)').text());
			minAmnt = minAmnt.replace(/\,|\$/g, '');
			var selectedAmnt = $("#payPlnDwn.selectedPayPlanRight").text();
			selectedAmnt = selectedAmnt.replace(/\,|\$/g, '');
			var enterAmnt = $('#paymentAmount').val();

			if($('#currentSelectedPayPlan').val() == '#selectedPayPlan_PP_1PAY'){				
			/*	if ((Number(enterAmnt) < Number(selectedAmnt) ) && (Number(enterAmnt) > Number(minAmnt))){
					$('#warnDownpaymentModal').modal();
				}*/
				if ((Number(enterAmnt) < Number(selectedAmnt)) && (Number(enterAmnt) < Number(minAmnt))){
					$('#checkDownpaymentModal').modal();
					return;
				}
			}else if (Number(enterAmnt) < Number(selectedAmnt)){
				$('#checksecondDownpaymentModal').modal();
				return;
			}
		}
        //var currTabId = document.aiForm.currentTab.value;
		document.aiForm.viewPrefill.value = '';
		nextTab(document.aiForm.currentTab.value, formsId);
	});

	$(".tabDebitNextButton").bind("click", function(){
		var strCertifyPaymentInd;
		
		
		var futureId=$("#paymentMethodCd");
		futureId.prop('disabled',false);
		futureId.trigger('chosen:updated');
		
		var downPaymentMethodId=$("#downPaymentMethodCd");
		downPaymentMethodId.prop('disabled',false);
		downPaymentMethodId.trigger('chosen:updated');
		
		var curPlan=$("#selectedPlan").val();
		var paymentMethodCd=$("#paymentMethodCd").val();
		
		
		if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
			if (paymentMethodCd !="EDB") {
				$('#paymentMethodfor6Pay').modal('show');
				return;
			}
		}
		
		$('#requiredBinValidation').val(false);

		if ($('#paymentMethodCd').val() =='EDB'){
			if ($('#futurePayBankAccountNumber').val() !=$('#confirmBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
		}
		if ($('#downPaymentMethodCd').val() =='EWC'){
			if ($('#downPayBankAccountNumber').val() !=$('#confirmDownPayBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_downPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmDownPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
			strCertifyPaymentInd = $("#certifyPaymentInd_EWC").attr('checked');
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_EWC').val());
		}
		if ($('#downPaymentMethodCd').val() =='DC'){
			strCertifyPaymentInd = $("#certifyPaymentInd_DC").attr('checked');
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_DC').val());
			//$('#requiredBinValidation').val(true);
		}

		if ($('#downPaymentMethodCd').val() =='EWA') {
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_EWA').val()); 
		}

		if (strCertifyPaymentInd != "checked") {
			$('#myChkModal').modal();
			return;	
		}
		else {
			$("#certifyPaymentInd").val('Yes');
		}

			//	var currTabId = document.aiForm.currentTab.value;
				//	nextTab(document.aiForm.currentTab.value, this.id);
				$('#cardTypeCd').val("D");
				if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
					//eDocsprompt('issueDebitModal');/*$('#eDocsModal').modal();*/
					processPaymentModal('issueDebitModal');
				}else{
					$('.debitFormCls').addClass('tabBindNextButton');
					$('#issueDebitModal').modal();
				}
	});

	$(".tabBindmakePayment").bind("click", function(){
		var formId = this.id;
		var strCertifyPaymentInd;
		

		var futureId=$("#paymentMethodCd");
		futureId.prop('disabled',false);
		futureId.trigger('chosen:updated');
		
		var downPaymentMethodId=$("#downPaymentMethodCd");
		downPaymentMethodId.prop('disabled',false);
		downPaymentMethodId.trigger('chosen:updated');
		
		var curPlan=$("#selectedPlan").val();
		var paymentMethodCd=$("#paymentMethodCd").val();
		
		
		if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
			if (paymentMethodCd !="EDB") {
				$('#paymentMethodfor6Pay').modal('show');
				return;
			}
		}
		
		$('#requiredFieldsValidation').val(true);
		$('#requiredBinValidation').val(false);

		if ($('#paymentMethodCd').val() =='EDB'){
			if ($('#futurePayBankAccountNumber').val() !=$('#confirmBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
		}

		if ($('#downPaymentMethodCd').val() =='EWC'){
			if ($('#downPayBankAccountNumber').val() !=$('#confirmDownPayBankAccountNumber').val()) {
				showClearInLineErrorMsgsWithMap('mask_downPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmDownPayBankAccountNumber', 'bankAccountNumber.browser.inLine.misMatch', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				$('#myModal').modal();
				return;		
			}else{
				showClearInLineErrorMsgsWithMap('mask_futurePayBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				showClearInLineErrorMsgsWithMap('mask_confirmBankAccountNumber', '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}

			if ($('#downPaymentMethodCd').val() !='MO' && $('#downPaymentMethodCd').val() !='INV' && $('#downPaymentMethodCd').val() !='') {
				/*strCertifyPaymentInd = $("#certifyPaymentInd_EWC").attr('checked');
				if (strCertifyPaymentInd != "checked") {
					$('#myChkModal').modal();
					return;	
				}
				else {
					$("#certifyPaymentInd").val('Yes');
				}*/
				$('#paymentAmount').val("");
				$('#paymentAmount').val($('#paymentAmount_EWC').val());
				/*if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
					eDocsprompt('issueCheckModal');//$('#eDocsModal').modal();  
				}else
					$('#issueCheckModal').modal();*/				
				//nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);	
			}
		}

		if ($('#downPaymentMethodCd').val() =='DC'){
			strCertifyPaymentInd = $("#certifyPaymentInd_DC").attr('checked');
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_DC').val());
			$('#requiredBinValidation').val(true);
		}

		if ($('#downPaymentMethodCd').val() =='EWA') {
			$('#paymentAmount').val("");
			$('#paymentAmount').val($('#paymentAmount_EWA').val()); 
		}
		
		if ($('#downPaymentMethodCd').val() !='MO' && $('#downPaymentMethodCd').val() !='INV' && $('#downPaymentMethodCd').val() !='') {
			/*if (strCertifyPaymentInd != "checked") {
				$('#myChkModal').modal();
				return;	
			}
			else {
				$("#certifyPaymentInd").val('Yes');
			}*/
			
			var fullAmnt = $('#payPlnDwn').text();
			fullAmnt = fullAmnt.replace(/\,|\$/g, '');
			var minAmnt = ($('#payPlanTable #selectedPayPlan_PP_4PAY').find('td:eq(4)').text());
			minAmnt = minAmnt.replace(/\,|\$/g, '');
			var selectedAmnt = $("#payPlnDwn.selectedPayPlanRight").text();
			selectedAmnt = selectedAmnt.replace(/\,|\$/g, '');
			var enterAmnt = $('#paymentAmount').val();
	
			if($('#currentSelectedPayPlan').val() == '#selectedPayPlan_PP_1PAY'){				
				if ((Number(enterAmnt) < Number(selectedAmnt) ) && ( (Number(enterAmnt) == Number(minAmnt)) || (Number(enterAmnt) > Number(minAmnt)))){					
					//confirmMessage("The down payment amount entered is less than the down payment amount required.  If the full down payment amount is not received within three days, you will lose the Paid in Full Discount.");
					$('#warnDownpaymentModal').modal();
					return;
				}
				if ((Number(enterAmnt) < Number(selectedAmnt)) && (Number(enterAmnt) < Number(minAmnt))){
					$('#checkDownpaymentModal').modal();
					return;
				}
			}else if (Number(enterAmnt) < Number(selectedAmnt)){
				    $('#checksecondDownpaymentModal').modal();
				    return;
			}
		
			if($('#requiredBinValidation').val()){
				nextTab(document.aiForm.currentTab.value, formId);
			}
		}
		/*else if(('#isDebitCard') && ('#isValidCard')){
			$('#cardTypeCd').val("D");
			if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
				eDocsprompt('issueDebitModal');$('#eDocsModal').modal();  
			}else
			$('#issueDebitModal').modal();
		}*/
		else{	
			nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
			/*if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
				eDocsprompt('issueModal');$('#eDocsModal').modal();  
			}else
				$('#issueModal').modal();
			}*/
		}
		
	});
	
	 //TD 44318 - added class as warnDownpaymentOK so payment continues on OK button
	$(".warnDownpaymentOK").bind("click", function(){
		var formId = this.id;
		nextTab(document.aiForm.currentTab.value, formId);
	});

	$(".rateSummarySubmit").bind("click", function(){
		$('#confirmBind').modal('hide');
		$('#defaultZeroedPremium').val("0.00");
		rateOnSummary();
	});
	
	$('.closeConfirmBindModal').bind("click",function(){
		//updatePayPlanChangeInd();
		$('#payPlanChangeIndBind').val('Yes');
	});
		
	$(".paymentMethod6Pay").bind("click", function(){
		$('#paymentMethodfor6Pay').modal('hide');
		return;
	});
	
	
	//Mask Account fields
	$(".maskAccountNum").bind({
		blur: function() {
			  var elm = this.id;
			  var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			  maskAccountNum(this,hdnField);
			  $("#"+elm).addClass("masked");
			  if(elm == "mask_futurePayBankRoutingNumber" || elm == "mask_downPayBankRoutingtNumber")	{
				  validateRoutingnumber(this);
				  
				  if ($("#"+elm).val() == "") {
					  if(elm == "mask_futurePayBankRoutingNumber") 					  
						  $("#futurePayBankRoutingNumber").val($("#"+elm).val());
					
					  if(elm == "mask_downPayBankRoutingtNumber")
					   $("#downPayBankRoutingtNumber").val($("#"+elm).val());
				  }

			  }
			   if (elm =="mask_cardNumber"){
				   	if ($.trim(this.value) != "") {
				  		clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
				  	}
			  	else {
			  		var strErrorTag = 'cardNumber.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			  	}
			   }	
			   
			   //Recurring Card changes
			   if (elm =="mask_recurrCardNumber"){
				   	if ($.trim(this.value) != "") {
				  		clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
				  	}
			  	else {
			  		var strErrorTag = 'recurrCardNumber.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			  	}
			   }	
			}	
	});	
	
	$(".maskDate").bind({
		blur: function() {
			var elm = this.id;
			var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			var elmVal = this.value;

			//TD#74920 - Credit Card Expiration Date - Formatting error
				if (elm =="mask_cardExpDt"){
					if ($.trim(this.value) != "") {
						clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
					}
					else {
						var strErrorTag = 'cardExpDt.browser.inLine';
						var errorMessageID = 'required';
						errorMessageID = strErrorTag + '.' + errorMessageID;
						showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
					}
				}	
				
				//Recurring Card changes
				if (elm =="mask_recurrCardExpDt"){
					if ($.trim(this.value) != "") {
						clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
					}
					else {
						var strErrorTag = 'recurrCardExpDt.browser.inLine';
						var errorMessageID = 'required';
						errorMessageID = strErrorTag + '.' + errorMessageID;
						showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
					}
				}	
				
			if (elmVal.length <= 7 && elmVal.length > 1) {
				
               var cardExpirationArray = elmVal.split('/');
			   var cardExpiration = '';

				for (var i = 0; i < cardExpirationArray.length; i++) {
					
						if (i == 0) {
						var month = cardExpirationArray[0];
														
						if (1 == month.length) {
							month = "0" + month;
							cardExpiration = month+ '/';
						}else{
							cardExpiration = month+ '/';
							
						if (month.length < 1 || 2 > month.length) {
							
				          var strErrorTag = 'cardExpDt.browser.inLine';
				          var errorMessageID = 'format';
				          errorMessageID = strErrorTag + '.' + errorMessageID;
				          showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			}
		}
	                 }
													
						if (i == 1) {
							var year = cardExpirationArray[1];
														
						 if (4 == year.length ) {
								
							 cardExpiration = cardExpiration + year;
															
						     if (cardExpiration.length == 7) {
									elmVal = cardExpiration;
							      if (elm =="mask_recurrCardExpDt"){
										$('#mask_recurrCardExpDt').val(elmVal);
								  }
								  if (elm =="mask_cardExpDt"){
										$('#mask_cardExpDt').val(elmVal);
								  }
																
								maskDate(this,hdnField);
							}
						 } else {
							 
							var strErrorTag = 'cardExpDt.browser.inLine';
				            var errorMessageID = 'format';
				            errorMessageID = strErrorTag + '.' + errorMessageID;
				            showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
						}
					}
				}

			}
		}
	});	
	
	$(".maskCardCvv").bind({
		blur: function() {
			  var elm = this.id;
			  var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			  maskCardCvv(this,hdnField);
			  	
			   if (elm =="mask_cardCvv"){
				   	if ($.trim(this.value) != "") {
				   		//alert($('#' + hdnField).val().length);
				   		var cardNbr = $('#cardNumber').val();
				   		var cardType = determineCardType(cardNbr);
				   		if(cardType != 'unknown' && (cardType != 'AE' && $('#' + hdnField).val().length != 3) || (cardType == 'AE'  && $('#' + hdnField).val().length != 4)){
				   			var strErrorTag = 'mask_cardCvv.browser.inLine';
							var errorMessageID = 'mustbethree';
							errorMessageID = strErrorTag + '.' + errorMessageID;
							//alert(errorMessageID);
							showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				   		}else{
				   			clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
				   		}
				  	}
			  	else {
			  		var strErrorTag = 'cardCvv.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			  	}
			   }	
			   
			 //Recurring Card changes
			  /* if (elm =="mask_recurrCardCvv"){
				   	if ($.trim(this.value) != "") {
				   		//alert($('#' + hdnField).val().length);
				   		if($('#' + hdnField).val().length != 3){
				   			var strErrorTag = 'mask_recurrCardCvv.browser.inLine';
							var errorMessageID = 'mustbethree';
							errorMessageID = strErrorTag + '.' + errorMessageID;
							//alert(errorMessageID);
							showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
				   		}else{
				   			clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
				   		}
				  	}
			  	else {
			  		var strErrorTag = 'recurrCardCvv.browser.inLine';
					var errorMessageID = 'required';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			  	}
			   }	*/
			}	
	});		
	
	
	$("#recurrZipCode").bind({
		blur: function() {
		var elm = "recurrZipCode";
	   	if ($("#recurrZipCode").val() != "") {	   		
	   		//alert($('#' + hdnField).val().length);
	   		if($("#recurrZipCode").val().length != 5 && $("#recurrZipCode").val().length != 9){
	   			var strErrorTag = 'recurrZipCode.browser.inLine';
				var errorMessageID = 'mustbefiveornine';
				errorMessageID = strErrorTag + '.' + errorMessageID;
				//alert(errorMessageID);
				showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	   		}else{
	   			clearInLineRowErrorBind (elm,elm,fieldIdToModelErrorRow['defaultSingle']);
	   		}
	  	}
  	else {
  		var strErrorTag = 'recurrZipCode.browser.inLine';
		var errorMessageID = 'required';
		errorMessageID = strErrorTag + '.' + errorMessageID;
		showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
  	}
	}
	});
	
	
	// Producer License Number
	var stateCd = $('#stateCd').val();
	if((stateCd == "NH" 
		|| stateCd == "CT") 
		&& $('#producerLicenseNumberLength').val() == "true"){
			var elm = "producerLicenseNumber";
		    var strErrorTag = 'producerLicenseNumber.browser.inLine';
			var errorMessageID = "";
			if(stateCd == "NH"){
				errorMessageID = 'noLicenseNumbersNH';
			}else{
				errorMessageID = 'noLicenseNumbersCT';
			}

			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}


	$('form').bind(getSubmitEvent(), function(event, result){
        clearOptionalValues();
	});
	
	$(".clsZipPlusFour ,.clsZip").bind({'keyup keypress': function(event) {
	//	var key = event.which || event.keyCode; 
		if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode > 112){} 
        var regex = new RegExp(/[^0-9]/g);
        var containsNonNumeric = this.value.match(regex);
        if (containsNonNumeric)
            this.value = this.value.replace(regex, '');
	}});
	
	$('#zip').bind(getValidationEvent(), function(event, result){
		var emailRegex = new RegExp(/(^\d{5}$)/);
		var zip = $(this).val();
		var valid1 = emailRegex.test(zip);
		if (!valid1){
			//var strErrorTag = 'zip.browser.inLine.InvalidName';
			var strErrorTag = 'zip.browser.inLine';
			var errorMessageID = 'required';
			if(zip.length >0 && zip.length < 5){
				errorMessageID = 'InvalidName';
			}
			errorMessageID = strErrorTag + '.' + errorMessageID;
			var strId = $(this).attr('id');
			showClearInLineErrorMsgsWithMap(strId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);
		}
		else{
			var valid2 = validateZip(this);
		}	
	});
	
	$(".radioPayPlan").blur(function(){
		document.aiForm.currentSelectedPayPlan.value = "#selectedPayPlan_" + this.id;
				
	});
	
	$(".radioPayPlan").click(function(){
		
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
					$(".currentPremium").text(formatNumber(pp_val));
					 $('#premAmt').val(pp_val);
					$("span.premAmt").text(formatNumber(pp_val));
		      }
			 $(this).addClass("selectedPayPlanRight");
		});
		
		$(payId).removeClass("selectedPayPlanRight");
		$(payId).addClass("selectedPayPlan");
		
		$(payRadioId).removeClass("selectedPayPlanRight");
		$(payRadioId).addClass("selectedPayPlan");
		
		var downPaymentMethod= $("#downPaymentMethodCd").val();
		
	 	if ((previousSelectId == "#selectedPayPlan_PP_1PAY") && (rowId != "#selectedPayPlan_PP_1PAY")){
				$('#confirmBind').modal('show');
		}
		
		if ((previousSelectId != "#selectedPayPlan_PP_1PAY") && (rowId == "#selectedPayPlan_PP_1PAY")){
				$('#confirmBind').modal('show');			
		} 
		
		var curPlan=$("#selectedPlan").val();
		
		//Recurring Payment Plan changes
		if(curPlan == 'PP_5REC' || curPlan == 'PP_10REC'){
			//add ACC dropdown dynamically if it doesnt exist
			$("#paymentMethodCd").append('<option value="ACC">Automatic Credit Card</option>');
			clearInLineRowErrorBind ('paymentMethodCd','paymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
		}else{
			$("#paymentMethodCd option[value='ACC']").remove();
    		triggerValueChange($('#paymentMethodCd'));	
    		$("#ACC").hide();
		}	
		
		addPayRollDeductOption();

		if(curPlan == 'PP_PAYDED'){
			$('#employeeId').val('');
		}
		
		if (downPaymentMethod == 'DC'){
 			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
 			dollarRep = dollarRep.replace(/\,|\$/g, '');
 			$("#paymentAmount_DC").val(dollarRep.replace(/\s+/g, ''));
 			$("#paymentAmount").val($("#paymentAmount_DC").val());

		}
		else if (downPaymentMethod == 'EWC'){
 			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
 			dollarRep = dollarRep.replace(/\,|\$/g, '');
 			$("#paymentAmount_EWC").val(dollarRep.replace(/\s+/g, ''));
 			$("#paymentAmount").val($("#paymentAmount_EWC").val());
		}
		
		//Recurring payment validate email changes
		validateEmail($('#emailId'));
		showMaillingAddress();
	});
	
	$('.colInput,.chosen-single').keyup(function(e){
	    validateLastInput('lastInputLeft');
	});
	
	//add/remove yellow field for phone numbers and other fields
	addRemoveBindPreRequired();
	
	if ($('#zip').val() != "" && $('#zip').val() != undefined) {
		if($('#zip').val().length == 5){
			performZipTownLookup($('#zip').val(), $('#cityName'));
		}
	}
	
	if ( $('#readOnlyMode').val() != 'Yes' ) {
	setFocus('mailingIsSameIndicator');
	}
	
	addPayRollDeductOption();
	
	//Remove 'MO'for CAPTIVE channels.
	if($('#channelCd').val()!='' && $('#channelCd').val().toUpperCase() == 'CAPTIVE' &&  $('#transactionStatusCd').val() != 'Issued'){
		$("#downPaymentMethodCd option[value='MO']").remove();
		triggerValueChange($('#downPaymentMethodCd'));	
	}
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
	
	
	$('#reasonNoEmailId').change(function(){
		var reasonNoEmailId= $('#reasonNoEmailId').val();
		if(reasonNoEmailId != 'NA'){
			showClearInLineErrorMsgsWithMap("emailId", '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		} else if(reasonNoEmailId == 'NA'){
			showClearInLineErrorMsgsWithMap("emailId", 'emailId.browser.inLine.required', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}
	
	});
	
	//recurring payment changes, put default * for recurring payment fields
	if ( $('#readOnlyMode').val() == 'Yes' ) {
		$('#mask_recurrCardExpDt').val('********');
		$('#recurrZipCode').val('*****');	
		$('#mask_recurrCardNumber').val('****************');
	}
	
	initialFormLoadProcessing();
	
});



function addPayRollDeductOption() {
	var curPlan=$("#selectedPlan").val();
	var futureId=$("#paymentMethodCd");
	var downPaymentId=$("#downPaymentMethodCd");
	
	if(curPlan != 'PP_PAYDED'){
		$('#paymentMethodCd option').each(function(){
			if (this.value == 'PDT') {
				$("#paymentMethodCd option[value='PDT']").remove();
	    		triggerValueChange($('#paymentMethodCd'));	
	    		futureId.prop('disabled',false);
			}				
		});
		
		$('#downPaymentMethodCd option').each(function(){
			if (this.value == 'PDT') {
				$("#downPaymentMethodCd option[value='PDT']").remove();
	    		triggerValueChange($('#downPaymentMethodCd'));	
	    		$('#downPaymentMethodCd').prop('disabled',false);
			}				
		});
		
		$("#PDT").hide();
	}
	
	
	if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
		futureId.val('EDB');
		$("#EDB").show();
		$("#PDT").hide();
		$("#ACC").hide();
		futureId.prop('disabled',true);
		downPaymentId.prop('disabled',false);
	} else if(curPlan == 'PP_PAYDED'){
		$('#paymentMethodCd').append('<option value="PDT">Payroll Deduct</option>');
		triggerValueChange($('#paymentMethodCd'));
		futureId.val('PDT');
		clearInLineRowErrorBind ('paymentMethodCd','paymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
		futureId.prop('disabled',true);
		
		$('#downPaymentMethodCd').append('<option value="PDT">Payroll Deduct</option>');
		triggerValueChange($('#downPaymentMethodCd'));
		$('#downPaymentMethodCd').val('PDT');
		clearInLineRowErrorBind ('downPaymentMethodCd','downPaymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
		$('#downPaymentMethodCd').prop('disabled',true);
		$('#downPaymentMethodCd').trigger('chosen:updated');
		
		$("#PDT").show();
		$("#EDB").hide();
		
	} else if(curPlan == 'PP_5REC' || curPlan == 'PP_10REC'){
		if($("#downPaymentMethodCd").val() == ""){
			$("#downPaymentMethodCd").val('DC');
			$("#DC").show();
			$("#downPaymentMethodCd").trigger('chosen:updated');
		}
		
		futureId.val('ACC');		
		$("#ACC").show();
		$("#PDT").hide();
		$("#EDB").hide();
		futureId.prop('disabled',true);
		downPaymentId.prop('disabled',false);
	}	
	else {
		//futureId.prop('selectedIndex', 0);
		futureId.prop('disabled',false);
		downPaymentId.prop('disabled',false);
	}
	futureId.trigger('chosen:updated');
	downPaymentId.trigger('chosen:updated');
}

/*function validateAddress1(address1){
	var strID = address1.id;
	validateRequiredAndNotNull('',address1,'Yes', 'address1.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], '');
	validateAddress(address1);
}*/

function validateRequiredAndNotNull(name, elementId,strRequired, strErrorTag, strErrorRow, index) {
	errorMessageID = isRequiredAndNotEmpty($(elementId).val(), strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	else{
		errorMessageID = '';
	}
	
	showClearInLineErrorMsgsWithMap(elementId.id, errorMessageID, strErrorRow,-1, errorMessageJSON, addDeleteCallback);
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

/*function validateAddress(address1){
	var strID = address1.id;
	var addressLine1 = $('#'+strID).val();

	if($("#ResidenceAddress").prop('checked') == true){

		if(/(?:PMB)|(?:p(?:ost)?\.?\s*\.?\s*[o|0](?:\.|ffice |b(?:[o|0]x))?)\b|(?:post)\b/i.test(addressLine1)) {
			var strErrorTag = 'address1.browser.inLine';
			var errorMessageID = 'InvalidPMBAddress';
			$('#'+strID).val("");
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(address1.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
		}

		else if(/(?:p(?:mb)?\s*\.?\s*?[m]?\s*\.?\s*?[b])\b|(?:private\s*mail\s*box)\b/i.test(addressLine1)){
			var strErrorTag = 'address1.browser.inLine';
			var errorMessageID = 'InvalidAddress';
			$('#'+strID).val("");
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(address1.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);

		}
	}
   
}*/

function validateZip(zip){
	//var strID = zip.id;
	isValidZip('',zip,'Yes', 'zip.browser.inLine', fieldIdToModelErrorRow['zipZip4'], '');
}

function isValidZip(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var zip = $(elementId).val();
	var errorMessageID = isNameClient(zip, strRequired);
	errorMessageID = strErrorTag+'.'+errorMessageID;
	//showClearInLineErrorMsgsWithMap(elementId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback);
	if(errorMessageID.indexOf('required')==-1){
		$('#mailingCity').val('');
		//TD 62823 fix - default state to empty
		$('#addressState').val('');
		performZipTownLookup(zip, $('#cityName'));
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

function performZipTownLookup(zip, townElement) {
	blockUser();
	var stateCd = $('#stateCd').val();//'MA';
	//var strCityName = $('#cityName').val();
	var strErrorTag = 'zip.browser.inLine';
	var errorMessageID = 'InvalidZip';
	errorMessageID = strErrorTag + '.' + errorMessageID;
	var zipId = $('#zip').attr('id'); 
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
       url: '/aiui/lookup/zipAddress/zipTownLookup',
       type: "post",
       dataType: 'json',
      //  data : JSON.stringify({ "zip":zip}),
       data : JSON.stringify({ "zip":zip,"garageTown":'',"stateCd":''}), 
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	processZipTownResults(response, townElement);
        	//TD 62823
        	/*var cities = response.cityAssociatedWithZip;
        	//errorMessageID = '';
        	
        	var stCd = $('#addrstateCd').val();
    		
        	if (cities!=null && cities.length >=1){
        		errorMessageID = '';
        	}
          	
        	if(stCd !='MA' && stCd!='NH' && stCd !='NJ' && stCd!='CT'){
        		errorMessageID = '';
        	}
        	
        	showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);*/
          	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
	        	parseZipLookupError();
	            showClearInLineErrorMsgsWithMap(zipId, errorMessageID, fieldIdToModelErrorRow['zipZip4'],-1, errorMessageJSON, addDeleteCallback);
        },
        complete: function(){
        	$.unblockUI();
//        	if (strCityName != "") {
//        		$('#cityName').val(strCityName).trigger('chosen:updated'); 
//        	}

        }
    });
}

var addDeleteCallback = function(row, addIt) {
	//alert('what i waana do with call back?');
}

function parseZipLookupError()
{
	$('#cityName_chosen').hide();
	 $('#cityName').empty();
	 $('#cityName').val('');
	 $('#cityName').show();
	 $('#cityName').prop('disabled',false);
	 $('#addrstateCd').prop('disabled',false);
	 $('#cityName').prop('readonly', false);
	 $('#addrstateCd').removeClass('required');
	 $('#addrstateCd').removeClass('inlineError');
	 $('#addrstateCd').removeClass('preRequired');
	 $('#cityName').removeClass('required');
	 $('#cityName').removeClass('inlineError');
	 $('#cityName').removeClass('preRequired');
	 $('#cityName').trigger('chosen:updated').trigger('chosen:styleUpdated');
	 $('#addrstateCd').trigger('chosen:updated').trigger('chosen:styleUpdated');
	 $('#addrstateCd_Error').remove();
	 $('zip_Error').remove();
}

function processZipTownResults(results, townElement) {
	populateSelect(results);
}

function populateSelect(options) 
{
	var cities = options.cityAssociatedWithZip;
	var state = options.stateAssociatedWithZip;
	var mailCity = $('#mailingCity').val();
	//TD 62823
	//$('#cityName').empty();
	//$('#Freeform_cityName').val('');
	var errorMessageID = '';
	if(cities !=null && cities.length>0){
		$('#Freeform_cityName').addClass('hidden');
		$('#cityName').removeClass('hidden');
		$('#cityName_chosen').removeClass('chosenDropDownHidden');
		
		var errorMessageID = '';
		var freeFormCityId = $('#Freeform_cityName').attr('id');
		showClearInLineErrorMsgsWithMap(freeFormCityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		
		var cityId = $('#cityName').attr('id');
      	if(isValidValue($('#cityName').val())){
      		showClearInLineErrorMsgsWithMap(cityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
      	}
		var options_select = '';
		options_select+='<option value="">Select</option>';
		$('#cityName').append(options_select);
		for (var i = 0; i < cities.length; i++) {
			if (i < cities.length) {
				options_select +='<option value="' + cities[i] + '">' + cities[i] + '</option>';
				$('#cityName').append('<option value="' + cities[i] + '">' + cities[i] + '</option>');
			}
		}
		
		if(cities.length == 1){
			mailCity = cities[0];
			$('#cityName').val(mailCity).prop('disabled', true).trigger('chosen:updated');
			$('#cityName').removeClass('required');
			$('#cityName').removeClass('inlineError');
			$('#cityName').removeClass('preRequired');
			$('#cityName_Error').remove();
			$('#mailingCity').val(mailCity);
		}
		else{
			$('#cityName').val(mailCity).prop('disabled', false).trigger('chosen:updated');
			$('#cityName').removeClass('required');
			$('#cityName').removeClass('inlineError');
			$('#cityName').removeClass('preRequired');
		}
	}
	else{
		
		$('#Freeform_cityName').removeClass('hidden');
		$('#Freeform_cityName').show();
		$('#cityName_chosen').addClass('chosenDropDownHidden');
		$('#Freeform_cityName').val(mailCity);
		
		
		var cityId = $('#cityName').attr('id');
		showClearInLineErrorMsgsWithMap(cityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		
		if(!isValidValue($('#Freeform_cityName').val())){
			var freeFormCityId = $('#Freeform_cityName').attr('id');
			errorMessageID = 'cityName.browser.inLine.required';
			showClearInLineErrorMsgsWithMap(freeFormCityId, errorMessageID, fieldIdToModelErrorRow['cityState'],-1, errorMessageJSON, addDeleteCallback);
		}
		
		
		
	//	var zipId = $('#zip').attr('id');
	}
	
	if(state !=null && state[0] !=null){
		if (state !=null && state.length == 1){
			$('#addrstateCd').prop('disabled', false).trigger('chosen:updated');
			var stateAssociated = state[0];
			$('#addrstateCd').removeClass('required');
			$('#addrstateCd').removeClass('inlineError');
			$('#addrstateCd').removeClass('preRequired');
			$('#addrstateCd').val(stateAssociated).prop('disabled', true).trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#addrstateCd_Error').remove();
			$('#zipLookupReturnedState').val(state);
			$('#addressState').val(state);
		}
	}
	else{
			$('#zipLookupReturnedState').val('');
			//TD 62823 - default to empty
			var defaultState = '';
			if(isValidValue($('#addressState').val())){
				defaultState = $('#addressState').val();
				//TD 62823 - retain selected state
				/*if(defaultState == 'MA' || defaultState == 'NJ' || defaultState == 'CT' || defaultState == 'NH')
				{
					defaultState = 'AL';
				}*/
			}else{
				$('#addressState').val(defaultState);
			}
			$('#addrstateCd').val(defaultState);
//			if($('#addressState').val(''))
//			$('#addressState').val('AL');
//			if($('#addrstateCd').val() == 'AL'){
//				$('#addrstateCd').val('AL');
//				$('#addressState').val('AL');
//			}
			$('#addrstateCd').prop('disabled', false).trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
}

function fmtPhone_old(elm,e) { 
	var phone = elm.value;
	var re = /\D/g;
	if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112) 
	{
		 
	} 
	else{
	if(phone.length < 13) {
		phone = phone.replace("-","").replace(re,"");
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
		$(elm).val(phone);
	}
	}
}


function validateWorkPhoneNumber(phoneNumber){
	
	var errorMessageID = '';
	var workPhoneId = phoneNumber.id;
	var workPhoneNumberValue = $('#'+workPhoneId).val();
	var cellPhoneNumberValue = $('#homePhoneNum').val();
	var homePhoneNumberValue = $('#cellPhone').val();
	
	if((homePhoneNumberValue == null || homePhoneNumberValue == "") &&  (cellPhoneNumberValue == null || cellPhoneNumberValue == "")  && (workPhoneNumberValue == null || workPhoneNumberValue == "")) {
		errorMessageID =workPhoneId+'.browser.inLine.required';
		showClearInLineErrorMsgsWithMap(workPhoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}
	else {
		validatePhoneNumber(phoneNumber);
	}
	
}

function validatePhoneNumber(phoneNumber){
	var errorMessageID = '';
	var phoneId = phoneNumber.id;
	var phoneNumberValue = $('#'+phoneId).val();
	
	var workPhoneNumberValue = $('#workPhoneNum').val();
	var cellPhoneNumberValue = $('#homePhoneNum').val();
	var homePhoneNumberValue = $('#cellPhone').val();
	
	if(phoneNumberValue == null || phoneNumberValue == "" || phoneNumberValue =='Optional' || /[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/.test(phoneNumberValue)){
		showClearInLineErrorMsgsWithMap(phoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}
	else
	{
		$('#'+phoneId).val("");	
		errorMessageID =phoneId+'.browser.inLine.Invalid';
		showClearInLineErrorMsgsWithMap(phoneId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}
	if((homePhoneNumberValue != "") ||  ( cellPhoneNumberValue != "") || (workPhoneNumberValue != "")) {
		showClearInLineErrorMsgsWithMap("workPhoneNum", errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}
}

function fmtPhone(elm,e) { 
	var phone = elm.value;
	var phoneId = elm.id;
	var re = /\D/g;
	if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112){} 
	else{
	if(phone.length < 13) {
		var  splitDash = phone.split("-");
		if(splitDash.length==3 && splitDash[0].length<=3 && splitDash[1].length<=3 && splitDash[2].length<=4){
		//	var start = $(elm).prop("selectionStart");
			var pos = $(elm).getCursorPosition();
			$(elm).val(phone).caretTo(pos);
	}
		else{
		phone = phone.replace("-","").replace(re,"");
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
	//	var start = $('#'+phoneId).prop("selectionStart");
	    var pos = $('#'+phoneId).getCursorPosition();
	    if(phone.length ==4 || phone.length ==8){
	    	pos=pos+1;
	    }
	    $('#'+phoneId).val(phone).caretTo(pos);
	}
	}
	}
}
function fmtNumber(elm,e) { 
	if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))) {
		var elmNumber = elm.value;
		var re = /\D/g;
		if((elmNumber != "") && ( (elmNumber.substr(elmNumber.length-4,elmNumber.length) != "*****") ||(elmNumber.substr(elmNumber.length,-3) != "***") || (elmNumber != "***") || (elmNumber.substr(elmNumber.length-4,4) != "****") || (elmNumber.substr(elmNumber.length-3,3) != "***"))){
			elmNumber = elmNumber.replace(re,"");

			$(elm).val(elmNumber);
		}
	}
}

function updateCardNumberLength(elm,e) {
	
	if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))) {
		var elmNumber = elm.value;
		var re = /\D/g;
		elmNumber = elmNumber.replace(re,"");
		if (determineCardType(elmNumber) == 'AE') {
			$(elm).prop('maxLength', 15);
		} else {
			$(elm).prop('maxLength', 16);
		}
	}
}

function determineCardType(val) {
	
	if (val && val.length >2) {
		if (val.charAt(0) == '3' && (val.charAt(1) == '4' || val.charAt(1) == '7') ) {
			return "AE";
		} else {
			return "NAE";
		}
	} else {
		return "unknown";
	}
	
}

function fmtDecimal(elm,e) { 
	var elmNumber = elm.value;
	var re = /[^0-9.]/g;
	if((elmNumber != "") && (elmNumber.substr(elmNumber.length-4,4) != "****")){
		elmNumber = elmNumber.replace(re,"");
		
		$(elm).val(elmNumber);
	}
}

function fmtDate(elm,e) { 
	if(!(((e.keyCode == 9) && (e.keyCode == 16)) || (e.keyCode == 9) || (e.keyCode == 16))){
		var elmNumber = elm.value;
		var re = /[^\d\/]+/g;

		elmNumber = elmNumber.replace(re,"");
		if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112) 
		{

		} 
		else{
			if(elmNumber.length >= 2){

			}
			$(elm).val(elmNumber);
		}
	}
}



function isBindName(dataType, strVal, strRequired){
	
	if (strRequired == 'Yes') {
		if ((strVal == null) || (strVal == "")){
			return 'required';
		}
	}
		
	if (strVal.length > 40){
		return 'InvalidLength';
	}
	if (dataType == "number" ) {
		if (isValidNumerics(strVal) == false)
			return 'InvalidNumber'; 
	}
	if (dataType == "decimal" ) {
		var pattern=/^\d+(?:\.\d{2})?$/;
		if(pattern.test(strVal) == false)
			return 'InvalidNumber'; 
	}
	else if (strVal.length <= 7 && strVal.length > 1) {
		 
		 var cardExpDate = '';
		 
		 if($('#mask_cardExpDt').val() != ''){
			 
			 cardExpDate = $('#mask_cardExpDt').val();
		 } else {
			 cardExpDate = $('#mask_recurrCardExpDt').val();
		 }
			
	        var cardExpirationArray = cardExpDate.split('/');
			   
	            for (var i = 0; i < cardExpirationArray.length; i++) {
					
					if (i == 1) {
							var year = cardExpirationArray[1];
														
						 if (4 != year.length ) {
							 return 'format';
					      } 
				     }
				} 
	            
	 } else if (dataType == "date" ) {
		if (isValidDate(strVal) == false)
			  return 'InvalidDate'; 
	}
	else  {
		if (isBindValidName(strVal) == false)
		  return 'InvalidName'; 
	}
	
	return '';
}

//not required just keep additinal test remove later TBD
function isBindValidName(strName){
	var regex = new RegExp(/[^A-Za-z0-9'#\s\.&,\\\/-]/i);
     var validString = strName.match(regex);
     if (validString){
    	 return false;
     }
     else{
    	 return true;
     }
}

function isValidDate(dValue) {
	  var result = true;
   	 dValue = dValue.split('/');
	  //var pattern = /^\d{4}$/;
	  
	  var d = new Date();
	  var cyear = d.getFullYear();
	  var cmonth = d.getMonth();
	  
	  if (dValue[1] > cyear)
	      result = true;
	  
	  if (dValue[0] < 1 || dValue[0] > 12)
	      result = false;
	  
	  if (dValue[0] <= cmonth  && dValue[1] == cyear)
	      result = false;
	  
	  if (dValue[1] < cyear)
	      result = false;
	  

	  if (dValue[2])
	      result = false;
	  return result; 
	}


function validateNameInBindColumn(name, strRequired, strErrorTag, strErrorRow, index, errorMessageJSON, addDeleteCallback,dataType){
	var errorMessage = '';
	var strfieldvalue;
		
	
	if (($(name).val() !="") && (name.id.search("mask_") >=0)){
		strfieldvalue = $("#"+name.name).val();	
		if (strfieldvalue == "") {
			strfieldvalue=$(name).val();
		}
	}
	else{
		strfieldvalue = $(name).val();
	}
		
	
	errorMessageID = isBindName(dataType, strfieldvalue, strRequired);
	if (errorMessageID.length > 0){
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	showClearInLineErrorMsgsBind(name,name.id, errorMessageID, strErrorRow, index);
}

function emptySelect(selectElement) {
	
	selectElement.empty();
	selectElement.append('<option value=""></option>');
}
function validateBindFieldInput(selectedElement) {
	if (selectedElement.id == "address1")
		validateNameInBindColumn(selectedElement, 'Yes', 'address1.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");	
	else if (selectedElement.id == "address2")
		validateNameInBindColumn(selectedElement, 'No', 'address2.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
//	else if (selectedElement.id == "zip")
//		validateNameInBindColumn(selectedElement, 'Yes', 'zip.browser.inLine', fieldIdToModelErrorRow['zipZip4'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "paymentMethodCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "mask_futurePayBankRoutingNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankRoutingNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_futurePayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_confirmBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'confirmBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "futurePayBankAccountTypeCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'futurePayBankAccountTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "payrollDeductGroupNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'payrollDeductGroupNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "employeeId")
		validateNameInBindColumn(selectedElement, 'Yes', 'employeeId.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "downPaymentMethodCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPaymentMethodCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "mask_downPayBankRoutingtNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankRoutingtNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_downPayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "mask_confirmDownPayBankAccountNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'confirmDownPayBankAccountNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if (selectedElement.id == "downPayBankAccountTypeCd")
		validateNameInBindColumn(selectedElement, 'Yes', 'downPayBankAccountTypeCd.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if (selectedElement.id == "agentBankName")
		validateNameInBindColumn(selectedElement, 'Yes', 'agentBankName.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");
	else if(selectedElement.id == "mask_cardCvv")
		validateNameInBindColumn(selectedElement, 'Yes', 'cardCvv.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if(selectedElement.id == "mask_cardNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'cardNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if(selectedElement.id == "mask_cardExpDt")
		validateNameInBindColumn(selectedElement, 'Yes', 'mask_cardExpDt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"date");
	/**Recurring Card chagnes**/
	/*else if(selectedElement.id == "mask_recurrCardCvv")
		validateNameInBindColumn(selectedElement, 'Yes', 'recurrCardCvv.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");*/
	else if(selectedElement.id == "mask_recurrCardNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'recurrCardNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"number");
	else if(selectedElement.id == "mask_recurrCardExpDt")
		validateNameInBindColumn(selectedElement, 'Yes', 'mask_recurrCardExpDt.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"date");
	else if(selectedElement.id == "paymentAmount_DC")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_DC.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	else if(selectedElement.id == "paymentAmount_EWC")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_EWC.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	else if(selectedElement.id == "paymentAmount_EWA")
		validateNameInBindColumn(selectedElement, 'Yes', 'paymentAmount_EWA.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"decimal");
	else if(selectedElement.id == "producerLicenseNumber")
		validateNameInBindColumn(selectedElement, 'Yes', 'producerLicenseNumber.browser.inLine', fieldIdToModelErrorRow['defaultSingle'], -1,errorMessageJSON,null,"");

	
}

function validatecityNameInput(cityName) {
	//validateNameInColumn(cityName, 'Yes', 'cityName.browser.inLine', fieldIdToModelErrorRow['cityState'], -1);	
	var blnIsValidName = isValidName('',cityName,'Yes','cityName.browser.inLine',fieldIdToModelErrorRow['cityState'], -1);
	if(blnIsValidName){
		var strID = cityName.id;
		if($('#'+strID).val()!=""){
			$('#cityName').removeClass('required');
			$('#cityName').removeClass('inlineError');
			$('#cityName').removeClass('preRequired');
			$('#cityName_Error').remove();
			//$('#cityName').val(cityName).trigger('chosen:updated').trigger('chosen:styleUpdated');
			if( $('#addressCity').length )
			{
				$('#addressCity').val('');
				$('Freeform_cityName').val('');
				$('#addressCity').val($('#cityName').val());
			}
		}
	}
}

function isValidName(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var nameRegex = new RegExp(/^[a-zA-Z *~'\-\\&s]+$/);
	var name = $(elementId).val();
	var errorMessageID = '';
	
	if(name==null || name =='' || name == 'Optional'){ 
		errorMessageID = 'required';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		var valid = nameRegex.test(name);
		if (!valid)
		{
			$(elementId).val(''); // clear value in field
			errorMessageID = 'InvalidCity';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	
	showClearInLineErrorMsgsBind('',elementId.id, errorMessageID, strErrorRow, index);
	
//	if(errorMessageID != ""){
//		showClearInLineErrorMsgsBind('',elementId.id, errorMessageID, strErrorRow, index);
//		return false;
//	}else{
//		return true;
//	}
}

function validateEmail(addressEmailID){
	//var strID = addressEmailID.id;
	isValidEmail('',addressEmailID,'No','emailId.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], -1);
}

var fieldIds = 
{"bindPageData.producerLicenseNumber":"producerLicenseNumber",
 "bindPageData.address1":"address1",
 "bindPageData.zip":"zip",
 "bindPageData.cityName":"cityName",
 "bindPageData.stateCd":"addrstateCd",
 "bindPageData.emailId":"emailId",
 "bindPageData.reasonNoEmailId":"reasonNoEmailId",
 "bindPageData.workPhoneNum":"workPhoneNum",
 "bindPageData.paymentMethodCd":"paymentMethodCd",
 "bindPageData.futurePayBankRoutingNumber":"mask_futurePayBankRoutingNumber",
 "bindPageData.futurePayBankAccountNumber":"mask_futurePayBankAccountNumber",
 "bindPageData.confirmBankAccountNumber":"mask_confirmBankAccountNumber",
 "bindPageData.futurePayBankAccountTypeCd":"futurePayBankAccountTypeCd",
 "bindPageData.payrollDeductGroupNumber":"payrollDeductGroupNumber",
 "bindPageData.employeeId":"employeeId",
 "bindPageData.downPaymentMethodCd":"downPaymentMethodCd",
 "bindPageData.cardNumber":"mask_cardNumber",
 "bindPageData.cardExpDt":"mask_cardExpDt",
 "bindPageData.cardCvv":"mask_cardCvv",
 "bindPageData.recurrCardNumber":"mask_recurrCardNumber",
 "bindPageData.recurrCardExpDt":"mask_recurrCardExpDt",
 //"bindPageData.recurrCardCvv":"mask_recurrCardCvv",
 "bindPageData.paymentAmount_DC":"paymentAmount_DC",
 "bindPageData.paymentAmount_EWC":"paymentAmount_EWC",
 "bindPageData.paymentAmount_EWA":"paymentAmount_EWA",
 "bindPageData.downPayBankRoutingtNumber":"mask_downPayBankRoutingtNumber",
 "bindPageData.downPayBankAccountNumber":"mask_downPayBankAccountNumber",
 "bindPageData.confirmDownPayBankAccountNumber":"mask_confirmDownPayBankAccountNumber",
 "bindPageData.downPayBankAccountTypeCd":"downPayBankAccountTypeCd",
 "bindPageData.agentBankName":"agentBankName",
 "bindPageData.FAB_TEST":"issueError"
};


var fieldIdToModelErrorRow = 
{"defaultSingle":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "defaultMulti":"",
 "pageErrorData.address1":"<tr id=\"sampleErrorRow\"><td></td><td id=\"Error_Col\"></td></tr>",
 "zipZip4":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>",
 "cityState":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColZipCity\" id=\"Error_Col\"></td><td></td></tr>"};

var errorMessageJSON = 
{"producerLicenseNumber.browser.inLine.required":"Required entry",
"producerLicenseNumber.browser.inLine.noLicenseNumbersNH":"There are no active producer appointments on file. Please contact us at 800-979-6288 for assistance",
"producerLicenseNumber.browser.inLine.noLicenseNumbersCT":"There are no active producer appointments on file. Please contact us at 866-591-5545 for assistance",
"address1.server.pageAlert.required":"Address1 is required",
"address1.server.inLine.required":"Required entry",
"address1.server.popUp.required":"Required entry",
"address1.browser.inLine.required":"Required entry",
"address1.browser.inLine.InvalidAddress":"Required entry",
"address1.browser.inLine.InvalidPMBAddress":"The PMB (Private Mailbox) is not accepted.  Please enter the residence address",
"address1.browser.inLine.InvalidLength":"Address has Invalid Length",
"address1.browser.inLine.InvalidName":"Please enter valid Address",
"address2.browser.inLine.InvalidLength":"Address has Invalid Length",
"address2.browser.inLine.InvalidName":"Please enter valid Address",
"zip.server.pageAlert.required":"Zip code is required",
"zip.server.inLine.required":"Required entry",
"zip.server.popUp.required":"Required entry",
"zip.browser.inLine.required":"Required entry",
"zip.browser.inLine.InvalidName":"Zip is invalid",
"zip.browser.inLine.InvalidZip":"The zip code entered must match the city and state entered",
"cityName.server.pageAlert.required":"City is required",
"cityName.server.inLine.required":"Required entry",
"cityName.server.popUp.required":"Required entry",
"cityName.browser.inLine.required":"Required entry",
"cityName.browser.inLine.InvalidCity":"Please enter a valid city",
"addrstateCd.server.pageAlert.required":"Required entry",
"addrstateCd.server.inLine.required":"Required entry",
"addrstateCd.server.popUp.required":"Required entry",
"addrstateCd.browser.inLine.required":"Required entry", 
"emailId.server.pageAlert.required":"Required entry",
"emailId.server.inLine.required":"Required entry",
"emailId.server.popUp.required":"Required entry",
"emailId.browser.inLine.required":"Required entry",
"emailId.browser.inLine.requirededoc":"Enter a valid active email to ensure your customer can enroll in the eDocument program and maintains the policy discount",
"emailId.browser.inLine.requiredeYUBI":"Enter a valid active email to ensure customer can enroll in YUBI program",
"emailId.browser.inLine.requiredeACC":"Enter a valid active email to ensure customer remains on Recurring Credit Card Payment Plan",
"emailId.browser.inLine.requiredeNEP":"Enter a valid active email to ensure your customer receives all benefits from enrolling in the New England Patriots Program",
"emailId.browser.inLine.requiredSportEnt":"Enter a valid active email to ensure your customer receives all the benefits from enrolling in the XYZ.",
"emailId.browser.inLine.requiredPCAP":"Enter a valid active email to ensure your customer receives all benefits from enrolling in the Prudential Center Program",
"emailId.browser.inLine.InvalidEmailId":"Invalid email address format",
"reasonNoEmailId.server.pageAlert.required":"e-mail or reason code required",
"reasonNoEmailId.server.inLine.required":"Please enter an e-mail address, or select the appropriate reason why one is not being provided",
"reasonNoEmailId.browser.inLine.required":"Please enter an e-mail address, or select the appropriate reason why one is not being provided",
"homePhoneNum.browser.inLine.Invalid":"Phone number is invalid, please correct",
"cellPhone.browser.inLine.Invalid":"Phone number is invalid, please correct",
"workPhoneNum.server.pageAlert.required":"At least one valid phone number is required",
"workPhoneNum.server.inLine.required":"At least one valid phone number is required",
"workPhoneNum.browser.inLine.Invalid":"Phone number is invalid, please correct",
"workPhoneNum.browser.inLine.required":"At least one valid phone number is required",
"paymentMethodCd.server.pageAlert.required":"PaymentMethod is required",
"paymentMethodCd.server.inLine.required":"Required entry",
"paymentMethodCd.server.popUp.required":"PaymentMethod is required",
"paymentMethodCd.browser.inLine.required":"Required entry",
"mask_futurePayBankRoutingNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_futurePayBankRoutingNumber.server.pageAlert.required":"Bank Routing Number is required",
"mask_futurePayBankRoutingNumber.server.inLine.required":"Required entry",
"mask_futurePayBankRoutingNumber.server.popUp.required":"Bank Routing Number is required",
"mask_futurePayBankRoutingNumber.server.pageAlert.InvalidNumber":"The Routing number entered is not found. Please correct.",
"mask_futurePayBankRoutingNumber.server.inLine.InvalidNumber":"The Routing number entered is not found. Please correct.",
"mask_futurePayBankRoutingNumber.server.pageAlert.numeric":"Future Pay Bank routing number must be numeric",        
"mask_futurePayBankRoutingNumber.server.inLine.numeric":"Bank routing number must be numeric",      
"futurePayBankRoutingNumber.browser.inLine.required":"Required entry",
"futurePayBankRoutingNumber.browser.inLine.InvalidNumber":"The Routing number entered is not found. Please correct.",
"futurePayBankRoutingNumber.browser.inLine.MinNineDigits":"Routing number cannot be less than nine digits",
"futurePayBankRoutingNumber.browser.inLine.numeric":"Bank routing number must be numeric",
"downPayBankRoutingNumber.browser.inLine.numeric":"Bank routing number must be numeric",
"downPayBankRoutingNumber.browser.inLine.MinNineDigits":"Routing number cannot be less than nine digits",
"mask_futurePayBankAccountNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_futurePayBankAccountNumber.server.pageAlert.required":"Bank Account Number is required",
"mask_futurePayBankAccountNumber.server.inLine.required":"Required entry",
"mask_futurePayBankAccountNumber.server.popUp.required":"Bank Account Number is required",
"futurePayBankAccountNumber.browser.inLine.required":"Required entry",
"futurePayBankAccountNumber.browser.inLine.MinFourDigits":"Bank Account number must be at least 4 digits",
"futurePayBankAccountNumber.browser.inLine.InvalidNumber":"Please enter valid Bank Account Number",
"mask_confirmBankAccountNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_confirmBankAccountNumber.server.pageAlert.required":"Bank Account Number is required",
"mask_confirmBankAccountNumber.server.inLine.required":"Required entry",
"mask_confirmBankAccountNumber.server.popUp.required":"Bank Account Number is required",
"confirmBankAccountNumber.browser.inLine.required":"Required entry",
"confirmBankAccountNumber.browser.inLine.NotNumeric":"Bank Account number must be numeric",
"futurePayBankAccountNumber.browser.inLine.NotNumeric":"Bank Account number must be numeric",
"confirmDownPayBankAccountNumber.browser.inLine.NotNumeric":"Bank Account number must be numeric",
"downPayBankAccountNumber.browser.inLine.NotNumeric":"Bank Account number must be numeric",
"confirmBankAccountNumber.browser.inLine.MinFourDigits":"Bank Account number must be at least 4 digits",
"confirmBankAccountNumber.browser.inLine.InvalidNumber":"Please enter valid Bank Account Number",
"futurePayBankAccountTypeCd.server.pageAlert.badData":"Bad Data in Field",
"futurePayBankAccountTypeCd.server.pageAlert.required":"Account Type is required",
"futurePayBankAccountTypeCd.server.inLine.required":"Required entry",
"futurePayBankAccountTypeCd.server.popUp.required":"Account Type is required",
"futurePayBankAccountTypeCd.browser.inLine.required":"Required entry",
"payrollDeductGroupNumber.server.pageAlert.required":"Payroll Deduct Group Number is required",
"payrollDeductGroupNumber.server.inLine.required":"Payroll Deduct Group Number is required",
"payrollDeductGroupNumber.server.popUp.required":"Payroll Deduct Group Number is required",
"payrollDeductGroupNumber.browser.inLine.required":"Payroll Deduct Group Number is required",
"employeeId.server.pageAlert.badData":"Bad Data in Field",
"employeeId.server.pageAlert.required":"Employee ID is required",
"employeeId.server.inLine.required":"Employee ID is required",
"employeeId.server.popUp.required":"Employee ID is required",
"employeeId.browser.inLine.required":"Employee ID is required",
"emailId.server.pageAlert.pcapRequired":"A valid email is required for Prudential Center Assurance  Plus",
"emailId.server.inLine.pcapRequired":"A valid email is required for Prudential Center Assurance  Plus",
"emailId.server.popUp.pcapRequired":"A valid email is required for Prudential Center Assurance  Plus",
"emailId.browser.inLine.pcapRequired":"A valid email is required for Prudential Center Assurance  Plus",
"downPaymentMethodCd.server.pageAlert.required":"Down Payment Method is required",
"downPaymentMethodCd.server.inLine.required":"Required entry",
"downPaymentMethodCd.server.popUp.required":"Down Payment Method is required",
"downPaymentMethodCd.browser.inLine.required":"Required entry",
"mask_cardNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_cardNumber.server.pageAlert.required":"Card Number is required",
"mask_cardNumber.server.inLine.required":"Required entry",
"mask_cardNumber.server.popUp.required":"Card Number is required",
"mask_cardNumber.browser.inLine.Invalid":"Invalid card number",
"cardNumber.browser.inLine.required":"Required entry",
"mask_cardNumber.browser.inLine.InvalidNumber":"Invalid card number",
"mask_cardExpDt.server.pageAlert.badData":"Bad Data in Field",
"mask_cardExpDt.server.pageAlert.required":"Expiration Date is required",
"mask_cardExpDt.server.inLine.required":"Required entry",
"mask_cardExpDt.server.popUp.required":"Expiration Date is required",
"cardExpDt.browser.inLine.required":"Required entry", 
"cardExpDt.browser.inLine.format":"Please enter in a valid date format eg: 02/2015",
"mask_cardExpDt.browser.inLine.required":"Required entry",
"mask_cardExpDt.browser.inLine.InvalidDate":"Please enter valid Expiration Date",
"mask_cardExpDt.browser.inLine.format":"Please enter in a valid date format eg: 02/2015",
"mask_cardExpDt.server.pageAlert.InvalidDate":"Please enter valid Expiration Date",
"mask_cardExpDt.server.popUp.InvalidDate":"Please enter valid Expiration Date",
"mask_cardExpDt.server.inLine.InvalidDate":"Please enter valid Expiration Date",
"mask_cardCvv.server.pageAlert.badData":"Bad Data in Field",
"mask_cardCvv.server.pageAlert.required":"Card CVV Number is required",
"mask_cardCvv.server.inLine.required":"Required entry",
"mask_cardCvv.server.popUp.required":"Card CVV Number is required",
"cardCvv.browser.inLine.required":"Required entry",
"mask_cardCvv.browser.inLine.InvalidNumber":"Please enter valid Card CVV Number",
"mask_cardCvv.browser.inLine.mustbethree":"Card CVV Number must be 3 digits for Visa, Master Card and Discover and 4 digits for American Express. Please correct your entry.",

/**Recurring Card Changes**/
"mask_recurrCardNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_recurrCardNumber.server.pageAlert.required":"Card Number is required",
"mask_recurrCardNumber.server.inLine.required":"Required entry",
"mask_recurrCardNumber.server.popUp.required":"Card Number is required",
"mask_recurrCardNumber.browser.inLine.Invalid":"Invalid card number",
"recurrCardNumber.browser.inLine.required":"Required entry",
"mask_recurrCardNumber.browser.inLine.InvalidNumber":"Invalid card number",
"mask_recurrCardExpDt.server.pageAlert.badData":"Bad Data in Field",
"mask_recurrCardExpDt.server.pageAlert.required":"Expiration Date is required",
"mask_recurrCardExpDt.server.inLine.required":"Required entry",
"mask_recurrCardExpDt.server.popUp.required":"Expiration Date is required",
"recurrCardExpDt.browser.inLine.required":"Required entry", 
"recurrCardExpDt.browser.inLine.format":"Please enter in a valid date format eg: 02/2015",
"mask_recurrCardExpDt.browser.inLine.required":"Required entry",
"mask_recurrCardExpDt.browser.inLine.InvalidDate":"Please enter valid Expiration Date",
"mask_recurrCardExpDt.server.pageAlert.InvalidDate":"Please enter valid Expiration Date",
"mask_recurrCardExpDt.server.popUp.InvalidDate":"Please enter valid Expiration Date",
"mask_recurrCardExpDt.server.inLine.InvalidDate":"Please enter valid Expiration Date",
//"mask_recurrCardCvv.server.pageAlert.badData":"Bad Data in Field",
//"mask_recurrCardCvv.server.pageAlert.required":"Card CVV Number is required",
//"mask_recurrCardCvv.server.inLine.required":"Required entry",
//"mask_recurrCardCvv.server.popUp.required":"Card CVV Number is required",
//"recurrCardCvv.browser.inLine.required":"Required entry",
//"mask_recurrCardCvv.browser.inLine.InvalidNumber":"Please enter valid Card CVV Number",
//"mask_recurrCardCvv.browser.inLine.mustbethree":"Card CVV Number must be 3 positions.  Please correct your entry.",
"recurrZipCode.browser.inLine.required":"Required entry",
"recurrZipCode.server.pageAlert.required":"Required entry",
"recurrZipCode.server.popUp.required":"Required entry",
"recurrZipCode.server.inLine.required":"Required entry",
"recurrZipCode.browser.inLine.mustbefiveornine":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.pageAlert.mustbefiveornine":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.popUp.mustbefiveornine":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.inLine.mustbefiveornine":"Zipcode must be 5 or 9 digits",
"recurrZipCode.browser.inLine.InvalidName":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.pageAlert.InvalidName":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.popUp.InvalidName":"Zipcode must be 5 or 9 digits",
"recurrZipCode.server.inLine.InvalidName":"Zipcode must be 5 or 9 digits",

"paymentAmount_DC.server.pageAlert.badData":"Bad Data in Field",
"paymentAmount_DC.server.pageAlert.required":"Payment Amount is required",
"paymentAmount_DC.server.inLine.required":"Required entry",
"paymentAmount_DC.server.popUp.required":"Payment Amount is required",
"paymentAmount_DC.browser.inLine.required":"Required entry",
"paymentAmount_DC.browser.inLine.warning":"Warning: The down payment amount entered is less than the down payment amount required.  If the full down payment amount is not received within three days, you will lose the Paid in Full Discount.",
"paymentAmount_DC.server.pageAlert.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_DC.server.inLine.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_DC.server.popUp.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_DC.browser.inLine.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_DC.server.pageAlert.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_DC.server.inLine.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_DC.server.popUp.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_DC.browser.inLine.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",

"paymentAmount_EWC.server.pageAlert.badData":"Bad Data in Field",
"paymentAmount_EWC.server.pageAlert.required":"Payment Amount is required",
"paymentAmount_EWC.server.inLine.required":"Required entry",
"paymentAmount_EWC.server.popUp.required":"Payment Amount is required",
"paymentAmount_EWC.browser.inLine.required":"Required entry",
"paymentAmount_EWC.browser.inLine.warning":"Warning: The down payment amount entered is less than the down payment amount required.  If the full down payment amount is not received within three days, you will lose the Paid in Full Discount.",
"paymentAmount_EWC.server.pageAlert.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_EWC.server.inLine.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_EWC.server.popUp.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_EWC.browser.inLine.invalidMaxAmount":"Maximum amount cannot be more than $10,000.00",
"paymentAmount_EWC.server.pageAlert.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_EWC.server.inLine.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_EWC.server.popUp.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",
"paymentAmount_EWC.browser.inLine.invalidDownPaymentAmount":"The Down Payment cannot exceed the balance of the policy term.",

"paymentAmount_EWA.server.pageAlert.badData":"Bad Data in Field",
"paymentAmount_EWA.server.pageAlert.required":"Payment Amount is required",
"paymentAmount_EWA.server.inLine.required":"Required entry",
"paymentAmount_EWA.server.popUp.required":"Payment Amount is required",
"paymentAmount_EWA.browser.inLine.required":"Required entry",
"mask_downPayBankRoutingtNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_downPayBankRoutingtNumber.server.pageAlert.required":"Down Payment Bank Routing Number is required",
"mask_downPayBankRoutingtNumber.server.inLine.required":"Required entry",
"mask_downPayBankRoutingtNumber.server.popUp.required":"Down Payment Bank Routing Number is required",
"downPayBankRoutingtNumber.browser.inLine.required":"Required entry",
"downPayBankRoutingtNumber.browser.inLine.InvalidNumber":"Please enter valid Down Payment Bank Routing Number",

"mask_downPayBankRoutingtNumber.server.pageAlert.numeric":"Down payment Bank routing number must be numeric",        
"mask_downPayBankRoutingtNumber.server.inLine.numeric":"Bank routing number must be numeric",   
"downPayBankRoutingtNumber.browser.inLine.numeric":"Bank routing number must be numeric",

"mask_downPayBankRoutingtNumber.browser.inLine.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"mask_downPayBankRoutingtNumber.server.pageAlert.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"mask_downPayBankRoutingtNumber.server.inLine.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"mask_downPayBankRoutingtNumber.server.popUp.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"downPayBankRoutingtNumber.browser.inLine.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"downPayBankRoutingtNumber.server.pageAlert.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"downPayBankRoutingtNumber.server.inLine.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",
"downPayBankRoutingtNumber.server.popUp.InvalidRoutingNumber":"Please enter valid Down Payment Bank Routing Number",

"mask_downPayBankAccountNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_downPayBankAccountNumber.server.pageAlert.required":"Down Payment Bank Account Number is required",
"mask_downPayBankAccountNumber.server.inLine.required":"Required entry",
"mask_downPayBankAccountNumber.server.popUp.required":"Down Payment Bank Account Number is required",
"downPayBankAccountNumber.browser.inLine.required":"Required entry",
"downPayBankAccountNumber.browser.inLine.InvalidNumber":"Please enter valid Down Payment Bank Account Number",
"mask_confirmDownPayBankAccountNumber.server.pageAlert.badData":"Bad Data in Field",
"mask_confirmDownPayBankAccountNumber.server.pageAlert.required":"Confirm Down Payment Bank Account Number is required",
"mask_confirmDownPayBankAccountNumber.server.inLine.required":"Required entry",
"mask_confirmDownPayBankAccountNumber.server.popUp.required":"Bank Account Number is required",
"confirmDownPayBankAccountNumber.browser.inLine.required":"Required entry",
"downPayBankAccountNumber.browser.inLine.MinFourDigits":"Bank Account number must be at least 4 digits",
"confirmDownPayBankAccountNumber.browser.inLine.MinFourDigits":"Bank Account number must be at least 4 digits",
"confirmDownPayBankAccountNumber.browser.inLine.InvalidNumber":"Please enter valid Bank Account Number",
"downPayBankAccountTypeCd.server.pageAlert.badData":"Bad Data in Field",
"downPayBankAccountTypeCd.server.pageAlert.required":"Down Payment Account Type is required",
"downPayBankAccountTypeCd.server.inLine.required":"Required entry",
"downPayBankAccountTypeCd.server.popUp.required":"Down Payment Account Type is required",
"downPayBankAccountTypeCd.browser.inLine.required":"Required entry",
"agentBankName.server.pageAlert.badData":"Bad Data in Field",
"agentBankName.server.pageAlert.required":"Agent BankAccount is required",
"agentBankName.server.inLine.required":"Required entry",
"agentBankName.server.popUp.required":"Agent BankAccount is required",
"agentBankName.browser.inLine.required":"Required entry",
"issueError.server.pageAlert.required":"Error in Issue",
"bankAccountNumber.browser.inLine.misMatch":"The values entered for account number do not match. Please correct",
};

function validateAddressLine1(addressLine1) {
	return validateName(addressLine1, 'clsAddressLine1', 'Yes','aiui.aiForm.addressLine1', $('#messages').val(), strErrorRow);	
}

function validateAddressLine2(addressLine2) {
	return validateName(addressLine2, 'clsAddressLine2', 'Yes','aiui.aiForm.addressLine2', $('#messages').val(), strErrorRow);	
}


function initialFormLoadProcessing() {

	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
	
	showMaillingAddress();
	
	var emailAddress = $('#emailId').val();
	var stateCd = $('#stateCd').val();
		
	$("#emailLabel").hide();
	if(emailAddress==null || emailAddress =='' || emailAddress == 'Optional'){ 
		 errorMessageID = '';
		 //Recurring payment change, added paymentMethodCd for email validation
		 if ($('#eDocumentsInd').val() == 'Yes') {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					$("#emailLabel").show();
			}
		 }
		 else  if (($('#ubiProgramInd').val() == 'Yes') && (stateCd == 'CT' || stateCd == 'NJ' || stateCd == 'PA' )) {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					$("#emailLabel").show();
			}
		 }
		 else  if ($('#paymentMethodCd').val() == 'ACC') {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
						$("#emailLabel").show();
			}
		 }
		 else  if (($('#affinityCd').val() == 'MA143') || ($('#affinityCd').val() == 'NH11') || ($('#affinityCd').val() == 'CT11')){
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
						$("#emailLabel").show();
			}
		 }
		 else if ($('#pruCenterBenefitsInd').val() == 'Yes') {
				if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					$("#emailLabel").show();
				}
		   }
	}
	
	$("#EDB").hide();
	$("#PDT").hide();
	$("#ACC").hide();
	var pMethod= $("#paymentMethodCd").val();
	var downPaymentMethod= $("#downPaymentMethodCd").val();
	var anyPayPlanChangeInd = $("#anyPayPlanChangeInd").val();
	
	var curPlan=$("#selectedPlan").val();
	var futureId=$("#paymentMethodCd");
	if(curPlan == 'PP_6PAY' || curPlan == 'PP_12PAY') {
		futureId.val('EDB');
		$("#EDB").show();
		$("#PDT").hide();
		$("#ACC").hide();
		futureId.prop('disabled',true);
	}
	futureId.trigger('chosen:updated');
	
	
	if (pMethod == 'EDB'){
		$("#EDB").show();
		$("#PDT").hide();
		$("#ACC").hide();
/*		if (downPaymentMethod == ''){
			$("#downPaymentMethodCd").val("EWC", 'Yes');
			clearInLineRowErrorBind ('downPaymentMethodCd','downPaymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
			$('#downPaymentMethodCd').trigger('chosen:updated');
		}*/
	}
	else if (pMethod == 'PDT'){
		$("#EDB").hide();
		$("#PDT").show();
		$("#ACC").hide();
		if (downPaymentMethod == ''){
			 $("#downPaymentMethodCd").val("INV", 'Yes');
			 clearInLineRowErrorBind ('downPaymentMethodCd','downPaymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
			$('#downPaymentMethodCd').trigger('chosen:updated');
		}
	}
	else if (pMethod == 'ACC'){
		$("#EDB").hide();
		$("#PDT").hide();
		$("#ACC").show();
		if (downPaymentMethod == ''){
			 $("#downPaymentMethodCd").val("INV", 'Yes');
			 clearInLineRowErrorBind ('downPaymentMethodCd','downPaymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
			$('#downPaymentMethodCd').trigger('chosen:updated');
		}
	}
	
	//Recurring Payment changes
	if(curPlan == 'PP_5REC' || curPlan == 'PP_10REC'){
		//add ACC dropdown dynamically if it doesnt exist
		$("#paymentMethodCd").append('<option value="ACC">Automatic Credit Card</option>');
		clearInLineRowErrorBind ('paymentMethodCd','paymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
	}else{
		$("#paymentMethodCd option[value='ACC']").remove();
		triggerValueChange($('#paymentMethodCd'));	
		$("#ACC").hide();
	}		
		
	$("#DC").hide();
	$("#DCCert").hide();
	$("#EWC").hide();
	$("#EWCCert").hide();
	$("#EWA").hide();
	$("#MP").hide();
	$("#IP").hide();
	
	if (downPaymentMethod == 'DC'){
		$("#DC").show();
		$("#DCCert").show();
		if($("#paymentAmount_DC").val().length == 0 || parseInt($("#paymentAmount_DC").val()) <= 0 || anyPayPlanChangeInd == 'Yes'){
			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
			dollarRep = dollarRep.replace(/\,|\$/g, '');
			$("#paymentAmount_DC").val(dollarRep.replace(/\s+/g, ''));
			$("#paymentAmount").val($("#paymentAmount_DC").val());
		}
		clearInLineRowErrorBind ('paymentAmount_DC','paymentAmount_DC',fieldIdToModelErrorRow['defaultSingle']);
		$("#EWC").hide();
		$("#EWCCert").hide();
		$("#EWA").hide();
		$("#MP").show();
	}
	else if (downPaymentMethod == 'EWC'){
		$("#DC").hide();
		$("#DCCert").hide();
		$("#EWC").show();
		$("#EWCCert").show();
		if($("#paymentAmount_EWC").val().length == 0 || parseInt($("#paymentAmount_EWC").val()) <= 0 || anyPayPlanChangeInd == 'Yes'){
			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
			dollarRep = dollarRep.replace(/\,|\$/g, '');
			$("#paymentAmount_EWC").val(dollarRep.replace(/\s+/g, ''));
			$("#paymentAmount").val($("#paymentAmount_EWC").val());
		}
		clearInLineRowErrorBind ('paymentAmount_EWC','paymentAmount_EWC',fieldIdToModelErrorRow['defaultSingle']);
		$("#EWA").hide();
		$("#MP").show();
	}
	else if (downPaymentMethod == 'EWA'){
		$("#DC").hide();
		$("#DCCert").hide();
		$("#EWC").hide();
		$("#EWCCert").hide();
		$("#EWA").show();
		if($("#paymentAmount_EWA").val().length == 0 || parseInt($("#paymentAmount_EWA").val()) <= 0 || anyPayPlanChangeInd == 'Yes'){
			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
			dollarRep = dollarRep.replace(/\,|\$/g, '');
			$("#paymentAmount_EWA").val(dollarRep.replace(/\s+/g, ''));
			$("#paymentAmount").val($("#paymentAmount_EWA").val());
		}
		clearInLineRowErrorBind ('paymentAmount_EWA','paymentAmount_EWA',fieldIdToModelErrorRow['defaultSingle']);		
		$("#IP").show();
	}
	else {
		$("#IP").show();		
	};	
	
	var requiredBinValidation= $("#requiredBinValidation").val();
	var isDebitCard= $("#isDebitCard").val();
	var isValidCard= $("#isValidCard").val();
	
	$("#BV").hide();
	
	var submitFlag = $("#submit_flag").val();
	if(submitFlag != 'YES' && $('#readOnlyMode').val() != 'Yes' ){
		if (downPaymentMethod == 'DC'){
			if (requiredBinValidation == "true") {
				if (isValidCard == "true") {
					if (isDebitCard == "true") {
						$("#BV").show();
						$("#MakePayment").hide();
						var focusOn = $("#MPP").attr('id');
						closeSetFocus(focusOn);
					}
					else {
						$('#cardTypeCd').val("C");
						if(errorsExistOnPage()){
							return;
						}
						var strCertifyPaymentInd = $("#certifyPaymentInd_DC").attr('checked');
						if (strCertifyPaymentInd != "checked") {
							$('#myChkModal').modal();
							return;	
						}
						else {
							$("#certifyPaymentInd").val('Yes');
						}
						
						
						if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
							
							//eDocsprompt('issueCreditModal');//$('#eDocsModal').modal();  
							processPaymentModal('issueCreditModal');
						}else{
							$('.creditFormCls').addClass('tabBindNextButton');
							$('#issueCreditModal').modal();
						}
						return;
					}
				}
				else {
					if ($("#mask_cardNumber").val() != ""){
						var strErrorTag = 'mask_cardNumber.browser.inLine';
						var errorMessageID = 'Invalid';
						errorMessageID = strErrorTag + '.' + errorMessageID;
						var cardNumberId = $('#mask_cardNumber').attr('id');
						showClearInLineErrorMsgsWithMap(cardNumberId, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
					}
				}
			}
		} 
		else if (downPaymentMethod == 'EWC'){
			if(errorsExistOnPage()){
				return;
			}
			strCertifyPaymentInd = $("#certifyPaymentInd_EWC").attr('checked');
			if (strCertifyPaymentInd != "checked") {
				$('#myChkModal').modal();
				return;	
			}
			else {
				$("#certifyPaymentInd").val('Yes');
			}
			if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val()){
				//eDocsprompt('issueCheckModal');//$('#eDocsModal').modal();  
				processPaymentModal('issueCheckModal');
			}else{
				$('.checkFormCls').addClass('tabBindNextButton');
				$('#issueCheckModal').modal();	
			}
		}	
		else if ( $('#readOnlyMode').val() != 'Yes' ) {
			if(errorsExistOnPage()){
				return;
			}
			if ($('#eDocumentsInd').val() == 'Yes' && $('#emailId').val() && $('#showIssueModalInBind').val() == 'true'){
				processPaymentModal('issueModal');
			}else if($('#showIssueModalInBind').val() == 'true'){
				$('#issueModal').modal();
			}
		}
	}
}

function validateBindPage() {
	return validatePage();
}

function eDocsprompt(nextOpen){
    $('#eDocsModal').modal();  	
	$('#eDocsModal').on('hidden', function () {
		$("#" +nextOpen).modal('show');
	});
}

function processPaymentModal(nextOpen){
    $("#" +nextOpen).modal();  	
	$("#" +nextOpen).on('hidden', function () {
		$('#eDocsModal').modal('show');
	});
}

function paymentMethodChanged(strpayment){
	
	$("#EDB").hide();
	$("#PDT").hide();
	//recurring payment changes
	$("#ACC").hide();
	
	var pMethod= strpayment.value;
	if (pMethod == 'EDB'){
		$("#EDB").show();
		$("#PDT").hide();
		$("#ACC").hide();
		
		//clear Automatic Credit Card fields
		$('#ACC input[type="text"]').val('');
	}
	else if(pMethod == 'PPR'){
		$('#EDB input[type="text"]').val('');
		$("#futurePayBankRoutingNumber").val('');
		$("#futurePayBankAccountNumber").val('');
		$("#confirmBankAccountNumber").val('');
		$("#futurePayBankAccountTypeCd").val('');
		
		//clear Automatic Credit Card fields
		$('#ACC input[type="text"]').val('');
	}
	else if (pMethod == 'PDT'){
		if ($("#downPaymentMethodCd").val() == ''){
			$("#downPaymentMethodCd").val("INV");
			downPaymentMethodChanged($("#downPaymentMethodCd").val());
			clearInLineRowErrorBind ('downPaymentMethodCd','downPaymentMethodCd',fieldIdToModelErrorRow['defaultSingle']);
			$('#downPaymentMethodCd').trigger('chosen:updated');
		}
		$("#EDB").hide();
		$("#PDT").show();
		$("#ACC").hide();
		
		$('#EDB input[type="text"]').val('');
		$("#futurePayBankRoutingNumber").val('');
		$("#futurePayBankAccountNumber").val('');
		$("#confirmBankAccountNumber").val('');
		$("#futurePayBankAccountTypeCd").val('');
		
		//clear Automatic Credit Card fields
		$('#ACC input[type="text"]').val('');
	}
	else if (pMethod == 'ACC'){
		$("#EDB").hide();
		$("#PDT").hide();
		$("#ACC").show();
		
		$('#EDB input[type="text"]').val('');
		$("#futurePayBankRoutingNumber").val('');
		$("#futurePayBankAccountNumber").val('');
		$("#confirmBankAccountNumber").val('');
		$("#futurePayBankAccountTypeCd").val('');
	}
}

function triggerBindChangeEvent(strElm) {
	strElm.trigger('chosen:updated');
}

function downPaymentMethodChanged(downPaymentMethod){
	$("#DC").hide();
	$("#DCCert").hide();
	$("#EWC").hide();
	$("#EWCCert").hide();
	$("#EWA").hide();
	
	$("#MP").hide();
	$("#IP").hide();
	
//	var downPaymentMethod= strdownPayment.value;
//	alert(pMethod);
	if (downPaymentMethod == 'DC'){
		$("#agentBankName").val('').trigger('chosen:updated');
		$("#DC").show();
		$("#DCCert").show();
		if($("#paymentAmount_DC").val().length == 0){
		var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
		dollarRep = dollarRep.replace(/\,|\$/g, '');
		$("#paymentAmount_DC").val(dollarRep.replace(/\s+/g, ''));
		$("#paymentAmount").val($("#paymentAmount_DC").val());
		}
		clearInLineRowErrorBind ('paymentAmount_DC','paymentAmount_DC',fieldIdToModelErrorRow['defaultSingle']);
		$("#EWC").hide();
		$("#EWCCert").hide();
		$("#EWA").hide();
		$("#MP").show();
		$('#EWC input[type="text"]').val('');
		$("#downPayBankRoutingtNumber").val('');
		$("#downPayBankAccountNumber").val('');
		$("#confirmDownPayBankAccountNumber").val('');
	}
	else if (downPaymentMethod == 'EWC'){
		$("#agentBankName").val('').trigger('chosen:updated');
		$("#DC").hide();
		$("#DCCert").hide();
		$("#EWC").show();
		$("#EWCCert").show();
		if($("#paymentAmount_EWC").val().length == 0){
		var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
		dollarRep = dollarRep.replace(/\,|\$/g, '');
		$("#paymentAmount_EWC").val(dollarRep.replace(/\s+/g, ''));
		$("#paymentAmount").val($("#paymentAmount_EWC").val());
		}
		clearInLineRowErrorBind ('paymentAmount_EWC','paymentAmount_EWC',fieldIdToModelErrorRow['defaultSingle']);
		$("#EWA").hide();
		$("#MP").show();
		$('#DC input[type="text"]').val('');
		
		$("#cardNumber").val('');
		$("#cardCvv").val('');
		$("#cardExpDt").val('');
		$("#cardTypeCd").val('');
	}
	else if (downPaymentMethod == 'EWA'){
		$("#DC").hide();
		$("#DCCert").hide();
		$("#EWC").hide();
		$("#EWCCert").hide();
		$("#EWA").show();
		if($("#paymentAmount_EWA").val().length == 0){
			var dollarRep = $("#payPlnDwn.selectedPayPlanRight").text();
			dollarRep = dollarRep.replace(/\,|\$/g, '');
			$("#paymentAmount_EWA").val(dollarRep.replace(/\s+/g, ''));
			$("#paymentAmount").val($("#paymentAmount_EWA").val());
		}
		clearInLineRowErrorBind ('paymentAmount_EWA','paymentAmount_EWA',fieldIdToModelErrorRow['defaultSingle']);		
		$("#IP").show();
		$('#DC input[type="text"]').val('');
		$('#EWC input[type="text"]').val('');
		$("#cardNumber").val('');
		$("#cardCvv").val('');
		$("#cardExpDt").val('');
		$("#cardTypeCd").val('');
		$("#downPayBankRoutingtNumber").val('');
		$("#downPayBankAccountNumber").val('');
		$("#confirmDownPayBankAccountNumber").val('');
	}
	else if (downPaymentMethod == 'INV' || downPaymentMethod == 'MO'){
		$('#DC input[type="text"]').val('');
		$('#EWC input[type="text"]').val('');	
		$("#IP").show();
		$("#cardNumber").val('');
		$("#cardCvv").val('');
		$("#cardExpDt").val('');
		$("#cardTypeCd").val('');
		$("#downPayBankRoutingtNumber").val('');
		$("#downPayBankAccountNumber").val('');
		$("#confirmDownPayBankAccountNumber").val('');
	}else {
		$("#IP").show();		
	};		
}

function showMaillingAddress(){
	
	
	if ($("#mailingIsSameIndicator").is(':checked')){ 
		
		$("#mailingAddress").show();
		
		var pState= $("#stateCd").val();
		//replacing NJ with !MA
		if (pState != "MA") {
			if (!($("#MaillingAddress").is(':checked'))) {
				$('#ResidenceAddress').attr('checked', 'checked');
			}
		}

		else
			$("#vechileAddress").hide();
	}
	else{
		$("#mailingAddress").hide();
		$('#ResidenceAddress').attr('checked', 'checked');
	}
	var eDocumentsInd= $("#eDocumentsInd").val();
	var pruCenterBenefitsInd= $("#pruCenterBenefitsInd").val();
	//SP 2015-04-02 Added to address UBI requirements
	var ubiProgramInd= $("#ubiProgramInd").length > 0 ? $("#ubiProgramInd").val() : "";
	//Recurring Payment Requirement
	var paymentMethodCode = $('#paymentMethodCd').val();
	
	//Sports sport package flag indicator
	var hasSportPackage = $('#hasSportPackage').val();
	
	//Route One NEPAP requirement
	var affinityCd = $("#affinityCd").length > 0 ? $("#affinityCd").val() : "";
	if (eDocumentsInd == "Yes" || ubiProgramInd == "Yes" || pruCenterBenefitsInd == 'Yes' || hasSportPackage == 'Yes' ||
			(affinityCd == "MA143" || affinityCd == "NH11" || affinityCd == "CT11") || paymentMethodCode == "ACC") {
		$("#ReasonNoEmail").hide();
	}
	else
		$("#ReasonNoEmail").show();
	
}

function validatePage() {
	/**
	// clear any existing error
	clearPageError('.pageError');		
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

function showClearInLineErrorMsgsBind(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgsBind(name,strElementID, strErrorMsgID, strErrorRow);
}

function showClearInLineErrorRowMsgsBind(name,strElementID, strErrorMsgID, strErrorRow){
	var isAppRow = false;
	var isPri = false;
	
	var strRowName = strElementID;
	if(isAppRow){
	 strRowName = name;
	}
	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	//sample calling code
	var strErrorMsg = '';
	if (strErrorRow.length == 0){
		// if no error row return
		return;
	}
	if (strErrorMsgID.length == 0){
		//clear this message
		//if this is the last error message -> remove error row
		clearInLineRowErrorBind(strRowName,strElementID, strErrorRow);
		return;
	}
	
	//get the error message to be displayed
	strErrorMsg = getMessage(strErrorMsgID);
	if(strErrorMsg.length == 0){
		// if no error message -> return;
		return;
	}
	
	if (strErrorMsgID.indexOf("requiredSportEnt")!= -1) {
		var sprtPackageDescError = $('#sprtPackageDescError').val();
		console.log('sprtPackageDescError ='+sprtPackageDescError);
		//if not Empty
		if(sprtPackageDescError !== 'EMPTY'){
			strErrorMsg = strErrorMsg.replace("XYZ",sprtPackageDescError);
		}else{
			sprtPackageDescError = $('#sprtPackageDefaultError').val();
			strErrorMsg = strErrorMsg.replace("XYZ",sprtPackageDescError);
		}
		
	}
	
	$('#' + jq(strElementID)).each(function(){
		var dataRow = '';
		
				
				dataRow = $(this).parents("tr").first();   
				var errorRowExists = false;
				$('#' + strRowName  + '_Error').each(function(){
					errorRowExists = true;
				});
				if (errorRowExists == false) {
					strErrorRow = strErrorRow.replace('sampleErrorRow', strRowName + '_Error');
					strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
					$(strErrorRow).insertAfter(dataRow);  //msg below
				}
				var strErrorColSelector = strRowName + '_Error_Col';
				$('#' + strErrorColSelector).empty();
				$('#' + strErrorColSelector).append(strErrorMsg);
				$('#' + strErrorColSelector).addClass('inlineErrorMsg');
				// put red outline around existing col
				$('#' + strElementID).addClass('inlineError');
				// refresh it if it is selectbox
				if ($('#' + strElementID).is('select:not(select[multiple])')) {
					$('#' + strElementID).trigger('chosen:styleUpdated');
				}
	});

}

function clearInLineRowErrorBind(rowName,strElementID, strErrorRow){
	var strRowName = rowName;
	var errorRow = null;
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	
	if (errorRow == null || errorRow.length == 0 ) {
		return ;
	}
	// remove error row
	errorRow.remove();
	$('#' + strElementID).removeClass('inlineError');	
	
	if ($('#' + strElementID).is('select:not(select[multiple])')) {
		 $('#' + strElementID).trigger('chosen:styleUpdated');
	} 
	 
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


function isValidEmail(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w)+)?)((\.(\w){2,6})+)$/i);
	//var emailRegex = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
	var emailAddress = $(elementId).val();
	var errorMessageID = '';
	var stateCd = $('#stateCd').val();
	$("#emailLabel").hide();
	if(emailAddress==null || emailAddress =='' || emailAddress == 'Optional'){ 
		 errorMessageID = '';
		
		 //Recurring payment change, added paymentMethodCd for email validation
		 if ($('#eDocumentsInd').val() == 'Yes') {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					errorMessageID = 'requirededoc';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
			}
		 }
		 else  if (($('#ubiProgramInd').val() == 'Yes') && (stateCd == 'CT' || stateCd == 'NJ' || stateCd == 'PA' )) {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					errorMessageID = 'requiredeYUBI';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
			}
		 }
		 else  if ($('#paymentMethodCd').val() == 'ACC') {
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					errorMessageID = 'requiredeACC';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
			}
		 }
		 else  if (($('#affinityCd').val() == 'MA143') || ($('#affinityCd').val() == 'NH11') || ($('#affinityCd').val() == 'CT11')){
			 if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					errorMessageID = 'requiredeNEP';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
			}
		 }
		 else if ($('#pruCenterBenefitsInd').val() == 'Yes') {
				if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					errorMessageID = 'requiredPCAP';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
				}
		  }
		 
		 else if ($('#hasSportPackage').val() == 'Yes') {
				if (($('#reasonNoEmailId').val()!=null) && ($('#reasonNoEmailId').val()!="")) {
					var sprtPackageDescError = $('#sprtPackageDescError').val();
					errorMessageID = 'requiredSportEnt';
					errorMessageID = strErrorTag + '.' + errorMessageID;
					$("#emailLabel").show();
				}
		  } 
		 
		 
	}
	else
	{
		var valid = emailRegex.test(emailAddress);
		if (!valid)
		{
			errorMessageID = 'InvalidEmailId';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			//$('#'+elementId.id).val("");
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	if(elementId.id != undefined){
		//showClearInLineErrorMsgsWithMap('', errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, myMap);
		showClearInLineErrorMsgsBind('',elementId.id, errorMessageID, strErrorRow, index);
	}
}

function validateRoutingnumber(selectedElement){
//	var flag = true;
	var strErrorTag;
	var s;
		
		if(selectedElement.id == "mask_futurePayBankRoutingNumber"){
			s = $("#futurePayBankRoutingNumber").val();
			showClearInLineErrorMsgsWithMap(selectedElement.id, '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';
		}
		else{
			s = $("#downPayBankRoutingtNumber").val();
			showClearInLineErrorMsgsWithMap(selectedElement.id, '', fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			strErrorTag = 'downPayBankRoutingtNumber.browser.inLine';
		}
	
		var i, n, t = s;
		//t = "";

	/*	for (i = 0; i < s.length; i++) {
			c = parseInt(s.charAt(i), 10);
			if (c >= 0 && c <= 9)
				t = t + c;
		}*/
		n = 0;
		for (i = 0; i < t.length; i += 3) {
			/*n += parseInt(t.charAt(i),10) * 3
			+  parseInt(t.charAt(i + 1), 10) * 7
			+  parseInt(t.charAt(i + 2), 10);*/
	         n += parseInt(t.substring(i, i+1)) * 3
	            +  parseInt(t.substring(i+1, i+2)) * 7
	            +  parseInt(t.substring(i+2, i+3));
		}
		if (t.length != 9)
		{
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			flag = false;
		}
		if (n != 0 && n % 10 == 0){
			return true;
		}
		else
		{
			var errorMessageID = 'InvalidNumber';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			flag = false;
			return false;
		}
		
}

/*function validateRoutingnumber(selectedElement){
	var flag = true;
	var strErrorTag;
	var s;
	if(selectedElement.id == "mask_futurePayBankRoutingNumber"){
		s = $("#futurePayBankRoutingNumber").val();
		strErrorTag = 'futurePayBankRoutingNumber.browser.inLine';
		}
		else{
			s = $("#downPayBankRoutingtNumber").val();
			strErrorTag = 'downPayBankRoutingtNumber.browser.inLine';
			}
		var i, n, t;
		t = "";

		for (i = 0; i < s.length; i++) {
			c = parseInt(s.charAt(i), 10);
			if (c >= 0 && c <= 9)
				t = t + c;
		}
		n = 0;
		for (i = 0; i < t.length; i += 3) {
			n += parseInt(t.charAt(i),     10) * 3
			+  parseInt(t.charAt(i + 1), 10) * 7
			+  parseInt(t.charAt(i + 2), 10);
		}
		if (t.length != 9)
		{
			var errorMessageID = 'MinNineDigits';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			flag = false;
		}
		if (n != 0 && n % 10 == 0){}
		else
		{
			var errorMessageID = 'InvalidNumber';
			errorMessageID = strErrorTag + '.' + errorMessageID;
			showClearInLineErrorMsgsWithMap(selectedElement.id, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
			if(selectedElement.id == "mask_futurePayBankRoutingNumber")
				$("#futurePayBankRoutingNumber").val('');
			else
				$("#downPayBankRoutingtNumber").val('');
			flag = false;
		}
		return flag;
}*/

function validatePaymentAmount(thisElem) {
	var elm = thisElem.id;
	var enteredAmount = $(thisElem).val();
	var strErrorTag = elm+'.browser.inLine';
	var downPaymentAmount = $('#payPlanTable').find('td.selectedPayPlan').closest('tr').find('td#payPlnWithTax').text();
	var errorMessageID = '';
	if(errorMessageID == '' && $.isNumeric(enteredAmount) && parseFloat(enteredAmount)>10000){
		errorMessageID = strErrorTag + '.' + 'invalidMaxAmount';
	}
	if(errorMessageID == '' && downPaymentAmount!=null){
		downPaymentAmount = $.trim(downPaymentAmount).replace(/[,$]/g,'');
		if($.isNumeric(downPaymentAmount) && parseFloat(enteredAmount)>parseFloat(downPaymentAmount)){
			errorMessageID = strErrorTag + '.' + 'invalidDownPaymentAmount';
		}
	}
	if(errorMessageID != ''){
		showClearInLineErrorMsgsWithMap(elm, errorMessageID, fieldIdToModelErrorRow['defaultSingle'],-1, errorMessageJSON, addDeleteCallback);
	}
}

function  clearMaskedValue(strElm, e) {
	if((strElm != "") && ($("#"+strElm.id).hasClass("masked"))){
		//clear for backspace and delete
		if (e.keyCode == 8 || e.keyCode == 46)
		{
			$(strElm).val("");
			if ((strElm.id.search("mask_") >=0)){
				//clear hidden value also.
				$("#"+strElm.name).val("");	
				$("#"+strElm.id).removeClass("masked");
			}			
		}
	}
}

function errorsExistOnPage(){
	var pageErrors = $('#pageErrorInfo').val();
	if(pageErrors!=null && (pageErrors.indexOf('hard')!=-1 || pageErrors.indexOf('soft')!=-1)){
		return true;
	}
	return false;
}


//This function is used for those field which are not required by default but are required conditionally.
function addRemoveBindPreRequired(){
	var workPhoneNumberValue = $('#workPhoneNum').val();
	var homePhoneNumberValue = $('#homePhoneNum').val();
	var cellPhoneNumberValue = $('#cellPhone').val();

	if((homePhoneNumberValue == null || homePhoneNumberValue == "") &&  (cellPhoneNumberValue == null || cellPhoneNumberValue == "")  && (workPhoneNumberValue == null || workPhoneNumberValue == "")) {
		 $('#homePhoneNum').addClass('preRequired');
	}
	else {
		$('#homePhoneNum').removeClass('preRequired');
	}
}

