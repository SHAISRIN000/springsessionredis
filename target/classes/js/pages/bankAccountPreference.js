//########## Page set up: adjust main container  ###############//
jQuery(document).ready(function() {
	$('#landingBreadCrumbs').css({ 'font-size': '11px' });
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Agency Bank Account');
	$('#formBottomGrey').addClass('hidden');
	$('#formBottom').removeClass('hidden');
	
	initValidationFields();
} );

function showMainPage() {
	showExitPrompt(redirectLandingPage,false);
}
//########## Event listeners  ###############//
//########## Add an account  ###############//
$(document).on("click", "#addAccountBtn", function(e){
	$("#selectDriverToAdd").show();
	$("#selectDriverToAddNext").show();
	$("#addAccountBtn").attr("disabled", "disabled");	
	$("#addAccountBtn").addClass("addAccVioDisable");
});
//########## Cancel account edit ###########//
$(document).on("click", ".cancelSelected", function(e){
	var accountId = e.target.id;
    if ( accountId == null) {
    	collapseNewBankAccount();
    }
    else {
        location.reload(); 
    }
});
//########## Save an account  ###############//
$(document).on("click", ".addSelected", function(e) {
	var accountId = e.target.id;
	saveBankAccount(accountId);	
});
//########## Mask acctNum / routingNum  #####//
$( document ).on( "blur", ".masked", function(e) {
	var fieldName = e.target.id;
	var value = e.target.value;
	
	if ( value.indexOf('xxxxx') < 0 ) {
		$("#" + fieldName + "Hidden").val(value);	
	}
	
	var name = ( fieldName.indexOf('acctNum') < 0  ? 'routingNum' : 'acctNum');
	var field = getFieldByName(name);
	if ( isFieldValid(field, fieldName) ) {
	    var result = maskedValue( value );
	    e.target.value = result;
	}

});

function maskedValue( value ) {
	var result = 'xxxxx'; 
	if ( value!=null && value.length > 3 ){
		result = result + value.substr(value.length - 4, value.length);
		return result;
	}
	else {
		return value;
	}
}

//########## init validation rules for fields ###############//
function initValidationFields() {
	$.inqury = new Object();
	$.inqury.bank_account = new Object();
	// alphanumeric is commented out as per Balaji's input on BR 9/4/2014
	$.inqury.bank_account.fields  = [ { field: 'acctName',  rules: [ { name: 'required', message: 'Account name is required.'} 
		                                                             /*,{ name: 'alphanumeric', message: 'Account name must be alpha numeric.' } */] },
		                                          
	               { field: 'acctNum', isHidden: true,  rules: [ { name: 'required', message: 'Account number is required.'}, 
		                                         { name: 'numeric', message: 'Account number must be numeric.' }, 
		                                         { name: 'min', message: 'Account number cannot be less than 4 digits.', number: 4}] },
	               
	               { field: 'routingNum',  isHidden: true, rules: [ { name: 'required', message: 'Routing number is required.'}, 
		                                            { name: 'numeric', message: 'Routing number must be numeric.' }, 
		                                            { name: 'min', message: 'Routing number cannot be less than 9 digits.', number: 9}] },
		                                         
	               { field: 'newAcctType',  rules: [ { name: 'required', message: 'Account type is required.'}] }  ];
}

function getFieldByName(name){
	for ( var i = 0; i < $.inqury.bank_account.fields.length; i++ ){
		var field = $.inqury.bank_account.fields[i];
		if ( field.field == name ) 
			return field;
	}
	return null;
}

//########## Edit an account  ###############//
$(document).on("click", ".editSelected", function(e){
	var accountId = e.target.id;
	var accountName = $('#acctName_'+accountId).val();
	var routingNum = $('#routingNum_'+accountId).val();
	var acctNum  = $('#acctNum_'+accountId).val();
	var acctType = $('#acctType_'+accountId).val();
	
	var template = "<tr class=\"selectDriverToAdd blueRow\" id=\"selectDriverToAdd" + accountId + "\" >"+
	"<td class=\"select_assigned_driver acctName\"><span " +
		"class=\"disp_drv\"><input id=\"acctName" + accountId + "\" size=\"12\" maxlength=30 value=\"" + accountName + "\"" +
			"class=\"clsAccVioDate selectableAccVioDate acctName lossDateAccVioDateField tabOrder\" />" + 
	"</span></td>"+
	"<td class=\"select_display_date routingNum\"><span " +
		"class=\"disp_drv\"><input id=\"routingNum" + accountId + "\" size=\"12\" value=\"" + routingNum + "\" " + 
			"maxlength=\"9\" "+
			"class=\"clsAccVioDate selectableAccVioDate routingNum lossDateAccVioDateField tabOrder masked\" />"+
			"<input id=\"routingNum" + accountId + "Hidden\" type=\"hidden\" value=\"" + routingNum + "\" />"+
	"</span></td>" +
	"<td class=\"select_display_date acctNum" + accountId + "\"><span " +
		"class=\"disp_drv\"><input id=\"acctNum" + accountId + "\" size=\"12\" value=\"" + acctNum + "\" " + 
			"maxlength=\"16\" " +
			"class=\"clsAccVioDate selectableAccVioDate acctNum lossDateAccVioDateField tabOrder masked\" />"+
			"<input id=\"acctNum" + accountId + "Hidden\" type=\"hidden\" value=\"" + acctNum + "\" />"+
	"</span></td>" +
	"<td class=\"select_display_type acctType\"><span " +
		"class=\"disp_drv acctType\"> <select id=\"newAcctType" + accountId + "\" "+
			"class=\"select_type_available acctType tabOrder\"> "+
				"<option value=\"\">Select</option>" +
				"<option " + ( acctType == 'D' ? 'selected' : '' ) + " value=\"D\">Checking</option>"+
				"<option " + ( acctType == 'S' ? 'selected' : '' ) + " value=\"S\">Savings</option>"+
				"<option " + ( acctType == 'M' ? 'selected' : '' ) + " value=\"M\">Money Market</option>"+
		"</select>"+
	"</span></td>"+
	"<td class=\"select_display_type acctType\"><span "+
		" class=\"disp_drv\"></span></td> "+
    "</tr> "+
    "<tr class=\"selectDriverToAddNext\" id=\"selectDriverToAdd"+accountId+"Next\">" +
	"<td id=\"selectDriverToAdd"+accountId+"_acctName"+accountId+"_Error_Col\">" +
		"<span class=\"inlineErrorMsg\"></span>" +                                              
	"</td>" +
	"<td id=\"selectDriverToAdd"+accountId+"_routingNum"+accountId+"Hidden_Error_Col\"><span " +
		"class=\"inlineErrorMsg\"></span></td>" +
	"<td id=\"selectDriverToAdd"+accountId+"_acctNum"+accountId+"Hidden_Error_Col\"><span " +
		"class=\"inlineErrorMsg\"></span></td>" +
	"<td id=\"selectDriverToAdd"+accountId+"_newAcctType"+accountId+"_Error_Col\"><span "+
		"class=\"inlineErrorMsg\"></span></td>" +
	"<td align=\"right\" class=\"blueRow\"><span " +
		"style=\"float: right;\">" +
			"<button id=\""+accountId+"\" "+
				"class=\"addSelected aiBtn primaryBtn aiBtnSmall smallRowBtn tabOrder\" "+
				"type=button>Save</button>&nbsp;&nbsp;" +
			"<button id=\""+accountId+"\" "+
				"class=\"cancelSelected aiBtn primaryBtn aiBtnSmall smallRowBtn tabOrder\" "+
				"type=\"button\">Cancel</button>" +
	"</span></td>"+ 
   "</tr>";
	
	
	$("#accountId_"+accountId).after( template );
	$('#routingNum'+accountId).val( maskedValue( routingNum ) );
	$('#acctNum'+accountId).val( maskedValue( acctNum ) );
	
	addChosenForElement( $('#newAcctType'+ accountId) );
	
	$("#accountId_"+accountId).hide();
});

//########## Delete an account  ###############//
$(document).on("click", ".deleteSelected", function(e){
	var accountId = e.target.id;
	$("#deleteConfirmationModalAccountId").val(accountId);
	$("#confirmDeleteAccountName").text( $('#acctName_'+accountId).val() );
	
	$("#deleteConfirmationModal").modal();
});

$(document).on("click", "#deleteAccountYes", function(e){
	var accountId = $("#deleteConfirmationModalAccountId").val();
	deleteBankAccount(accountId);	
	$("#deleteConfirmationModal").hide();
});


function saveBankAccount(accountId){

	var suf = ( accountId!=null ? accountId : '' );

	if ( !areFieldsValid(accountId) ) {
		return;
	}
	
	blockUser();
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/bankaccount/save',
        type: 'POST',
        data: JSON.stringify({
        	accountName:  $('#acctName' + suf).val(),
        	accountNumber:  $('#acctNum'+ suf +'Hidden').val(),
        	routingNumber:  $('#routingNum'+ suf + 'Hidden').val(),  
        	accountType:  $('#newAcctType'+ suf).val(),
        	webpaymentAccountId: suf,
        	forTimestampAsBigInt: $('#forTimestampAsBigInt_'+suf).val()
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,
        //06/05 - IE8 is fetching the previous data because of caching
        cache: false,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	location.reload();
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	$('div.failedAbstractCall').modal();
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}


function deleteBankAccount(accountId){
	blockUser();
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/bankaccount/save',
        type: 'POST',
        data: JSON.stringify({
        	accountName:  $('#acctName_'+accountId).val(),
        	routingNumber:  $('#routingNum_'+accountId).val(),
        	accountType:  $('#acctType_'+accountId).val(),
        	accountNumber:  $('#acctNum_'+accountId).val(),
        	webpaymentAccountId: accountId,
        	deleteStatus: 'D',
        	forTimestampAsBigInt: $('#forTimestampAsBigInt_'+accountId).val()
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,
        //06/05 - IE8 is fetching the previous data because of caching
        cache: false,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	$("#accountId_"+ response).hide();                         
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	$('div.failedAbstractCall').modal();
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function collapseNewBankAccount(){
    $("#selectDriverToAdd").hide();
    $("#selectDriverToAddNext").hide();
    $("#addAccountBtn").removeAttr('disabled');
    $("#addAccountBtn").removeClass("addAccVioDisable");	
}


//########## Validation ###############//
// Copied AS IS from accident violation - should be done as a re-usable framework 
// to validate fields to be shared across screens
function validateField(fieldObj, fieldName, validationType, errorMessage) {
	if($.trim(fieldObj.val())!='' && fieldObj.val()!='Select' && validationType=='required'){
		validationType = '';
	}
	var messageAppendValue = validationType;
	var trId = $(fieldObj).parents('tr').first().prop('id');
	var str0;
	var str1;
	var colId;
	var errorRowId;
	if(trId.indexOf("_")>0){
		str0 = trId.substring(0, trId.indexOf("_"));
		str1 = trId.substring(trId.indexOf("_"), trId.length);
		errorRowId = str0 + '_Error' + str1;
		fieldName = fieldName.substring(fieldName.lastIndexOf("_")+1, fieldName.length);
		colId =  fieldName;
		if(errorRowId.indexOf('unassigned_Error_acc')>=0){
			errorRowId = errorRowId.replace('unassigned_Error_acc','unassigned_acc_Error');
		} else if(errorRowId.indexOf('other_Error_acc')>=0){
			errorRowId = errorRowId.replace('other_Error_acc','other_acc_Error');
		} else if(errorRowId.indexOf('unassigned_Error_vio')>=0){
			errorRowId = errorRowId.replace('unassigned_Error_vio','unassigned_vio_Error');
		}
	} else {
		str0 = trId;
		str1 = "";
		colId =  fieldName;
		errorRowId = str0 + 'Next';
	}		
	var errorColumnId = trId + '_' + fieldName + '_Error_Col';	
	if (validationType == 'required') {
		displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,false);
		return;		
	} else if(validationType == ''){
		displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,true);
		return;
	}
	displayFieldErrorMessageInDataTable(errorRowId, errorColumnId, errorMessage,colId,false);
}

//Copied AS IS from accident violation - should be done as a re-usable framework 
//to validate fields to be shared across screens
function displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,clearErrorMsg) {
	var thisTr = $('#accVioTabl tr#'+errorRowId);
	var prevTr = $(thisTr).prev();
	var columnId = (errorColumnId!=null)?(errorColumnId.replace('_Error_Col','')):colId;
	if(clearErrorMsg){
		$(thisTr).find('td[id^="' + errorColumnId + '"]').find('span').text('');
		$(prevTr).find('select.exclude_reason_class')
				.removeClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+columnId).removeClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+colId).removeClass('inlineError').trigger('chosen:styleUpdated');
	} else {
		$(thisTr).find('td[id^="' + errorColumnId + '"]').find('span').text(errorMessage);
		if(errorMessage!=null && errorMessage.indexOf("exclude reason")!=-1){
			$(prevTr).find('select.exclude_reason_class')
				.addClass('inlineError').trigger('chosen:styleUpdated');
		}
		$('#'+columnId).addClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+colId).addClass('inlineError').trigger('chosen:styleUpdated');
	}		
}

function isAlphaNumeric(str) {
    var regularExpression = /^[a-zA-Z0-9]+$/;
    var valid = regularExpression.test(str);
    return valid;
}

function isNumeric(str) {
    var regularExpression = /^[0-9]+$/;
    var valid = regularExpression.test(str);
    return valid;
}

function isFieldValid(field, fieldName) {
	
	var isValid = true;
	var fieldId = ( field.isHidden == true ) ? fieldName + 'Hidden' : fieldName;
	var val = $('#'+ fieldId ).val();
	
	var rules = field.rules;
    for ( var r=0; r< rules.length; r++ ) {
    	var rule = rules[r];

    	if ( rule.name == "required" ) {
		    validateField( $('#'+ fieldId), fieldId ,'required', rule.message);
		    if($.trim(val)==""){
			    isValid = false;
			    break;
		    }
    	} 
    	else if ( rule.name == "alphanumeric" ) {
		    validateField( $('#'+ fieldId), fieldId ,'alphanumeric', rule.message);
		    if( !isAlphaNumeric(val) ){
			    isValid = false;
			    break;
		    }
    	} 

    	else if ( rule.name == "numeric" ) {
		    validateField( $('#'+ fieldId), fieldId ,'numeric', rule.message);
		    if( !isNumeric(val) ){
			    isValid = false;
			    break;
		    }
    	} 
    	
    	else if ( rule.name == "min" ) {
		    validateField( $('#'+ fieldId), fieldId ,'min', rule.message);
		    if( val!=null && val.length < rule.number ){
			    isValid = false;
			    break;
		    }
    	} 
    }
	// clear previous error message
	if ( isValid == true ) {
	    validateField( $('#'+ fieldId), fieldId ,'', null);
	}
	return isValid;
}

function areFieldsValid(accountId) {
	
	var suf = ( accountId!=null ? accountId : '' );
	var fields = $.inqury.bank_account.fields;
	var isAllValid = true;
	
	for ( var n=0; n < fields.length; n++ ) {
		var field = fields[n];
		var fieldName = field.field+ suf;
		if ( !isFieldValid(field, fieldName) ) {
			isAllValid = false;
		}
	}
    return isAllValid;
}