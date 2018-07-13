jQuery(document).ready(function() {	
	$('.password').attr('autocomplete', 'off');

	$('#openUserPasswordHelp').click(function(e){
		$("#passwordHelpModal").modal('show');
		e.stopPropagation();
	});
	
	$('#j_username').change(function(){
		showOrHideError($(this).val(),$('#username-error'));
	});
	
	$('#j_password').change(function(){		
		showOrHideError($(this).val(),$('#password-error'));
	});
	
	$('.forgotPaswordLink').click(function() {
		var urlSuffix = "/company/" + document.loginForm.company.value;		
		var userID = $.trim($('#j_username').val());
		var hostnm = location.hostname;
		
		if (userID != null && userID != "") {
			urlSuffix = urlSuffix + "/userID/"+userID;
		}
		
		if(hostnm.indexOf("agentweb2") > -1){
			urlSuffix = urlSuffix + "?source=prime2";
		}else{
			urlSuffix = urlSuffix + "?source=prime";
		}
		
	    $(this).attr("href", this.href + urlSuffix);
	});

	//$.unblockUI();
	$('#waitImg').hide();
	setDefaultEnterID('login');
	var submitted = false;
	//Bind login Button  
	$("#loginForm").submit(function(){
		document.loginForm.j_username.value = encodeURIComponent(document.loginForm.j_username.value); 
		document.loginForm.j_password.value = encodeURIComponent(document.loginForm.j_password.value); 
		document.loginForm.company.value = encodeURIComponent(document.loginForm.company.value); 
		if(submitted) {
			return false;
		}
		submitted = isValidSubmit();
		return submitted;
	});
	
	if($('#loginErrorHardAlert').length == 1) {
		$('#formTop').append($('#loginErrorHardAlert'));
		$('#loginErrorHardAlert').show();
		$('#mainContent').css('margin-top', '202px');
	}
	
	/**
	 * Handler to display the Agent Support Line pop-up and present the phone #s 
	 * Makes use of UIConstants.SYSTEM_CODE to determine which support #s to be shown.
	 */
	$(document).on('click', '#agentContactInfo', function(){
		 var sysCode = $("#system_code").val();
		 var login_failure_reason = $("#LOGIN_FAILURE_REASON").val();
		 console.log('company',$("#company").val());
		 // To be commented after testing.
		 console.log('system_code, serverName, LOGIN_FAILURE_REASON: ',sysCode, ',', $("#serverName").val(),',',login_failure_reason); 
		 // Display the popup.
		 $('#agentSupportDialog').modal('show');
	});
	/**
	 * Handler function to close the popup .
	 */
	$('#closeAgentSupportDlg').click(function(){		
		$("#agentSupportDialog").modal('hide');
	});
       
    $(document).on('click', '#saveAcceptAndLogin', function(){
       document.saveAcceptForm.submit();
    });
    initialFormLoadProcessing();
       
});

//complete hiding, showing, etc
//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing(){
	$('#j_username').focus();
}

function showClearInlineErrorMsgsWindow(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgs(name,strElementID, strErrorMsgID, strErrorRow);
}

function isValidSubmit() {
	var isValidSubmit = true;
	
	//clear the error messages
	$('#username-error,#password-error').hide();
	
	if(document.loginForm.j_username.value==""){
		$('#username-error').show();
		isValidSubmit = false;
	}
		
	if(document.loginForm.j_password.value==""){
		$('#password-error').show();
		isValidSubmit = false;
	}
	
	if(!isValidSubmit){
		 //clear any locked out or invalid login messages
		 $('.aiLoginAlert').css({display:"none"});
		 $('.aiAlert').css({display:"none"});
	}

	return isValidSubmit;
}

function showOrHideError(thisVal,thisErrorElem){
	if($.trim(thisVal)==""){
		$(thisErrorElem).show();
	} else{
		$(thisErrorElem).hide();
	}
}
