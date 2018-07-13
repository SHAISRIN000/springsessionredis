jQuery(document).ready(function() {
	
	// making bread crumbs	
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Messages Administration');
	var isEdit;
	if($('#isEditValue').val() != null){ 
		$('#mainLinkRef').replaceWith('<a href="javascript:showExitPrompt(redirectMessagesAdmin, false)">Messages Administration</a>&nbsp;<span class="angleDiv">&nbsp;&gt;&nbsp;</span>');
		isEdit= $('#isEditValue').val() === "true";
		if(isEdit){ $('#secondaryLinkRef').text('Edit Message'); } 
		else{ $('#secondaryLinkRef').text('New Message'); }
		$('#secondaryLinkRef').removeClass('hidden');
	}
		
	// hide weird things
	$('#formBottomGrey').addClass('hidden');
	$('#formBottom').removeClass('hidden');
	
	// New & Edit Message
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	populateStateDropdown($('#operatingCompany').val());
//	if(isEdit){ $('#effectiveDate').prop('disabled', true); }  // makes effective Date uneditable when editing message
	
	var stateValue;
	if($('#stateValue').val().length == 4){
		stateValue = $('#stateValue').val().slice(0,2) + ';' + $('#stateValue').val().slice(2);
	}else{
		stateValue = $('#stateValue').val();
	}	
	$('#state').val(stateValue).trigger('chosen:updated');
	
	$('#effectiveDate').datepicker({
		showOn: "button", buttonImage: "/aiui/resources/images/cal_icon.png", buttonImageOnly: true, buttonText: 'Open calendar', dateFormat: 'mm/dd/yy', showButtonPanel: true
	}).focus(function() { $(this).select(); }).on("change", function(){ $(this).trigger('input'); });
	$('#expirationDate').datepicker({
		showOn: "button", buttonImage: "/aiui/resources/images/cal_icon.png", buttonImageOnly: true, buttonText: 'Open calendar', dateFormat: 'mm/dd/yy', showButtonPanel: true
	}).focus(function() { $(this).select(); }).on("change", function(){ $(this).trigger('input'); });
	if($('#effDateValue').val() == "" && $('#expDateValue').val() == ""){
		$('#effectiveDate').datepicker("setDate", "0d");
		$('#expirationDate').datepicker("setDate", "1Y");
	}

	// Need form validation
	$(document).on("click", "#publishBtn", function(){
		if(validateForm()){
			if(isEdit){ 
				$('#messageStatus').val('Published');
				submit('/aiui/msg_admin/submit/update');
			}else{
				submit('/aiui/msg_admin/submit/publish');
			}
		}
	});
	$(document).on("click", "#draftBtn", function(){
		if(validateForm()){
			if(isEdit){ 
				$('#messageStatus').val('Draft');
				submit('/aiui/msg_admin/submit/update');
			}else{
				submit('/aiui/msg_admin/submit/draft');
			}
		}
	});
	$(document).on("click", "#cancelBtn", function(){
		return showQuestionModal("CANCEL", null);
	});
	
	// Dynamic real-time validation : Type=input
	$('input.required').on('input', function(){
		onInputChange($(this));
	});
	// Dynamic real-time validation : Type=select
	$('select.required').on('change', function(){
		onSelectChange($(this));
		if(this.id == 'operatingCompany'){
			populateStateDropdown($('#operatingCompany').val());
			$('#state').trigger('change');
		}
	});
	
	if(!($('#pageInfo').val() == "")){ 
		return showInfoModal($('#pageInfo').val());
	}
});

// Closing the error popup
function closeSetFocus(fieldId){
	$('#editsModal').find('.closeModal').click();
	setFocus(fieldId);
}

// UI form validation only checking the formats of the dates for the type conversion
function validateForm(){
	valid = true;
	$('input.required.hasDatepicker').each(function(){
		valid = valid && onInputChange($(this));
	});
	return valid;
}

// UI real-time form validation messages. Type=select
function onSelectChange(select){
	var strId = select.attr('id');
	var errorMessageID = "";
	var strErrorTag = strId + '.server.inLine';
	var errorRowType = (strId == "state") ? "state" : "operatingCompany";
	if(!validateNonEmpty(select.val(), false)){ errorMessageID = strErrorTag + '.' + "required"; }
	return showClearInLineErrorRowMsgs('' , strId, errorMessageID, fieldIdToModelErrorRow[errorRowType], errorMessages);
}

// UI real-time form validation messages. Type=input
function onInputChange(input){
	var invalid = false, empty = false;
	var strId = input.attr('id');
	var errorMessageID = "";
	var strErrorTag = strId + '.server.inLine';
	var errorRowType = "title";
	if(input.hasClass('hasDatepicker')){
		invalid = !validateDateEntry(input.val());
		empty = !validateNonEmpty(input.val(), true);
		errorRowType = (strId == "effectiveDate") ? "effectiveDate" : "expirationDate";		
	} else{
		empty = !validateNonEmpty(input.val(), false);
	}
	errorMessageID = ((empty) ? strErrorTag + '.' + "required" : (invalid) ? strErrorTag + '.' + "invalid" : "");
	return showClearInLineErrorRowMsgs('' , strId, errorMessageID, fieldIdToModelErrorRow[errorRowType], errorMessages);
}

// UI real-time form validation messages
function showClearInLineErrorRowMsgs(name,strElementID, strErrorMsgID, strErrorRow, messageMap){
	var isAppRow = false;
	var strRowName = strElementID;
	if(isAppRow){ strRowName = name; }
	var strErrorMsg = '';
	if (strErrorRow.length == 0){  return false; }
	if (strErrorMsgID.length == 0){
		clearInLineRowErrorWindow(strRowName,strElementID, strErrorRow);
		return true;
	}
	strErrorMsg = getMessageWithMap(strErrorMsgID, messageMap);
	if(strErrorMsg.length == 0){ return true; }
	
	$('#' + strElementID).each(function(){
		if(strErrorRow.indexOf("|") >= 0){
			var errorRow = strErrorRow.split("|");
			var frmId = errorRow[0];
			strErrorRow = errorRow[1];
			var len =  $('tr.errorRow').find("td#" + strElementID + "_Error_Col").length;			
			if(len == 0){
				var dataRow = $('#' + strElementID).closest("tr");
				strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
				$(strErrorRow).insertAfter(dataRow); 
			}
			$("td#" + strElementID + "_Error_Col").html(strErrorMsg);
			$("td#" + strElementID + "_Error_Col").addClass('inlineErrorMsg');
			if($('#' + strElementID).is('select')) { $('#' + strElementID + '_chosen').find('a').addClass('inlineError'); }
			else{ $('#' + strElementID).addClass('inlineError'); }
		}
	});
	return false;
}

// UI real-time form validation messages
function clearInLineRowErrorWindow(rowName,strElementID, strErrorRow){
	var errorRow = null;
	if(strErrorRow.indexOf("|") >= 0){
		errorRow = strErrorRow.split("|");
		var frmId = errorRow[0];
		var currentElement = $("td#" + strElementID + "_Error_Col");
		currentElement.html("");
		currentElement.removeClass('inlineErrorMsg');
		var isLastErrorMsg = true;
		currentElement.parent().children().each(function () {
			if($(this).hasClass('inlineErrorMsg')){ isLastErrorMsg = false; }
		});
		if(isLastErrorMsg) currentElement.parent().remove();
		
		if($('#' + strElementID).is('select')) { $('#' + strElementID + '_chosen').find('a').removeClass('inlineError'); }
		else{ $('#' + strElementID).removeClass('inlineError'); }
	}
}

var fieldIdToModelErrorRow = {
	"title":"aiForm|<tr id=\"title_Error\" class=\"errorRow\"><td/><td id=\"Error_Col\"></td><td/><td/><td/></tr>",
	"effectiveDate":"aiForm|<tr id=\"effectiveDate_Error\" class=\"errorRow\"><td/><td id=\"Error_Col\" /><td/></tr>",
	"expirationDate":"aiForm|<tr id=\"expirationDate_Error\" class=\"errorRow\"><td/><td/><td id=\"Error_Col\" /></tr>",
	"operatingCompany":"aiForm|<tr id=\"operatingCompany_Error\" class=\"errorRow\"><td/><td id=\"Error_Col\" /><td/></tr>",
	"state":"aiForm|<tr id=\"state_Error\" class=\"errorRow\"><td/><td/><td id=\"Error_Col\" /></tr>",
	"detail":"aiForm|<tr id=\"detail_Error\" class=\"errorRow\"><td id=\"Error_Col\" /></tr>"	
};

function validateNonEmpty(value, isDate){
	if(value == "" || value == null || (isDate && value == "mm/dd/yyyy")) 
		return false;
	return true;
}

function validateDateEntry(value) {
	var check = true;
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;    
    if(value == '') { return check; }    
    if(re.test(value)) {
        var adata = value.split('/');
        var mm = parseInt(adata[0],10);
        var dd = parseInt(adata[1],10);
        var yyyy = parseInt(adata[2],10);
        var xdata = new Date(yyyy,mm-1,dd);
        if((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm-1) && (xdata.getDate() == dd)) { check = true; }
        else { check = false; }
    } 
    else { check = false; }
    return check;   
}

function checkBirthDateValidRange(elementId){
	var strMsg = '';
	var dateString = $(elementId).val();
	if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) { return 'Invalid'; }
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10); //1998
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;
    if(day > 0 && day <= monthLength[month - 1]){ }
    else { return 'Invalid'; }
    return "";
}

function showQuestionModal(action, items){
	var primeButtonText, headerTitle, messageText, intro = "Are you sure you want to ";	
	$('#questionModal #questionModalYes').unbind('click');
	$('#questionModal #questionModalNo').unbind('click');
	$('#questionModal #questionModalNo').click(function() {         
    	$('#questionModal').modal('hide');
    	return false;
    });
	
	var task = action.toLowerCase();
	primeButtonText = task.charAt(0).toUpperCase() + task.slice(1);	

	var isEdit = ($('#isEditValue').val() === "true");
	headerTitle = primeButtonText + (isEdit ? " Edit" : " New Message");
	messageText = intro + task + (isEdit ? " your changes" : " this message")  + "? Your work will not be saved!";
	
	primeButtonText = "OK";
	messageText = "Changes have not been saved. Are you sure you want to discard them?"; 
	$(document).on("click", "#questionModal #questionModalYes", function() {
    	$('#questionModal').modal('hide');
    	return redirect('/aiui/msg_admin/All');
    });

	$("#questionModal #questionModalYes").text(primeButtonText);
	$('#questionModal #questionModalTitle').html(headerTitle);
	$('#questionModal #questionModalMessage').html(messageText);
	$('#questionModal').modal('show');
}

function showInfoModal(message){
	$('#errorModal #errorModalYes').unbind('click');
	$('#errorModal #errorModalNo').unbind('click');
	$(document).on("click", "#errorModal #errorModalYes", function() {
    	$('#errorModal').modal('hide');
    	return false;
    });
	$('#errorModal #errorModalNo').click(function() {         
    	$('#errorModal').modal('hide');
    	return false;
    });
	$("#errorModal #errorModalYes").text("Fix Now");
	$('#errorModal #errorModalTitle').html(message);
	$('#errorModal #errorModalMessage').html("&nbsp;");
	$('#errorModal').modal('show');
}

function redirect(url){
	showLoadingMsg();
	window.location.replace(url);
	return false;
}

function submit(url){			
	var event = jQuery.Event(getSubmitEvent());
	$('#aiForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.aiForm.action = url;
		document.aiForm.method="POST";
		document.aiForm.submit();
	}
}

function redirectMessagesAdmin(){
	showLoadingMsg();
	window.location.replace('/aiui/msg_admin/All');
	return false;
}

function populateStateDropdown(company){
	var select = "<option value=''>--Select--</option>";
	var CT = "<option value='CT'>Connecticut</option>";
	var CTMA = "<option value='CT;MA'>Connecticut & Massachusetts</option>";
	var MA = "<option value='MA'>Massachusetts</option>";
	var NH = "<option value='NH'>New Hampshire</option>";
	var NJ = "<option value='NJ'>New Jersey</option>";
	var NJPA = "<option value='NJ;PA'>New Jersey & Pennsylvania</option>";
	var PA = "<option value='PA'>Pennsylvania</option>";
	//TD#75227 - Messages Admin should have a state of NY/NJ in addition to only NY
	var NY = "<option value='NY'>New York</option>";
	var NJNY = "<option value='NJ;NY'>New Jersey & New York</option>";
	var NYPA = "<option value='NY;PA'>New York & Pennsylvania</option>";
	var NJNYPA = "<option value='NJ;NY;PA'>New Jersey , New York & Pennsylvania</option>";
	var CTMANY = "<option value='CT;MA;NY'>Connecticut , Massachusetts & New York</option>";
	var MANY = "<option value='MA;NY'>Massachusetts & New York</option>";
	var CTNY = "<option value='CT;NY'>Connecticut & New York</option>";
	// added for Replicating Product project
	var CTNH = "<option value='CT;NH'>Connecticut & New Hampshire</option>";
	var CTPA = "<option value='CT;;PA'>Connecticut & Pennsylvania</option>";
	var CTMANYPA = "<option value='CT;MA;NY;PA'>Connecticut , Massachusetts, New York & Pennsylvania</option>";
	var MAPA = "<option value='CT;;PA'>Massachusetts & Pennsylvania</option>";
		
	//Add NJPA+PA for HP
	if (company == "BK") {
		 $('#state').html(select + CT + CTMA + MA);
    } else if (company == "HP") {
    	 $('#state').html(select + CT + CTNH + NH + NJ + NJPA + NY + NJNY + PA + NJNYPA + NYPA);
       // $('#state').html(select + NJ + NJPA + NY + PA);
    } else if (company == "MW") {
        $('#state').html(select + NH);
    } else if (company == "PA") {
    	 $('#state').html(select + NJ + NJPA + NY + NJNY + PA + NJNYPA + NYPA);
        //$('#state').html(select + NJ + NJPA + NY + PA);
    } else if (company == "PG") {
        $('#state').html(select + CT + CTMA + MA);
    } else if (company == "PR") {
    	  $('#state').html(select + CT + CTMANY + MA + NY + CTMA + CTNY + MANY + + MAPA + CTPA + CTMANYPA + NYPA + PA);
        //$('#state').html(select + CT + CTMA + MA + PA);
    } else{
    	$('#state').html(select);
    }
    $('#state').trigger('chosen:updated');
}