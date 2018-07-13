jQuery(document).ready(function() {

	$('#chkAllFormsId').focus();
	
	$("#savePolicy").removeAttr("href");
	$('#savePolicy').unbind('click');
	
	/* Fixes for reducing gap between tab bottom and Top Container & Section Title Top Margin */
	$('#mainContent').css('margin-top', '117px');
	$('#formTop').css('height', '20px');
	$('.globalHeader').css('height', '165px');
	$('.globalHeader').css('background-position', '0 -30px');
	$('#fixedPageHeader').css('height', '20px');
	
	//Road Rewards FR
	var policyEffDt = Date.parse($("#policyEffDt").val());
	var roadRewardsEffDate = Date.parse($("#roadRewardsEffDate").val());
	/*if($('#transactionStatusCd').val()!='Issued' || $('#transactionTypeCd').val()!='Policy' || !(policyEffDt >=roadRewardsEffDate ) || 
			$('#stateCd').val()!='MA'){
		//$('#road_rewards_img').addClass("hidden");
	}*/
	
	if($('#transactionStatusCd').val()=='Issued' && $('#transactionTypeCd').val()=='Policy' && (policyEffDt >=roadRewardsEffDate )){
		$('#road_rewards_img').removeClass("hidden");
	}

	$('#eSignature').click(function(){
		$('#emailTemplate').val('primeesign');	
		$("input.clsEsignForm").each(function(i, tr) {
			if(this.value == "true"){
		    	$('#form_' + i).attr('checked','checked');
		    }else{
		    	$('#form_' + i).attr('checked',false);
		    }
			
			/*TD#74345 eSignature automatically selecting Electronic Fund Transfer Policy Document*/
			var formname = $("input[name='forms["+i+"].formName']").val();
			if(formname == "EFT" && $('#paymentMethodCd').val() == "EDB"){
				$('#form_' + i).attr('checked','checked');
				$('#form_' + i).attr('disabled', true);
			}
			if(formname == "EFT" && $('#paymentMethodCd').val() != "EDB"){
				$('#form_' + i).attr('checked',false);
				$('#form_' + i).attr('disabled', true);
			}
			
		});
		$('#esigForm').removeClass("hidden");
		$('#esigFormDetail').removeClass("hidden");
		$('#tblEsigAgree').removeClass("hidden");
	});
	$('#eSignature_endorse').click(function() {
		$('#emailTemplate').val('endoesign');
		$("input.clsEsignForm").each(function(i, tr) {
			if (this.value == "true") {
				$('#form_' + i).attr('checked', 'checked');
				
			} else {
				$('#form_' + i).attr('checked', false);
			}
			/*TD#74345 eSignature automatically selecting Electronic Fund Transfer Policy Document*/
			var formname = $("input[name='forms["+i+"].formName']").val();
			if(formname == "EFT" && $('#paymentMethodCd').val() == "EDB"){
				$('#form_' + i).attr('checked','checked');
				$('#form_' + i).attr('disabled', true);
			}
			if(formname == "EFT" && $('#paymentMethodCd').val() != "EDB"){
				$('#form_' + i).attr('checked',false);
				$('#form_' + i).attr('disabled', true);
			}
			if($("#stateCd").val()=='MA' &&( formname =='RMV1_NO_ESTAMP_END' || formname == 'RMV1_End')){
				$('#form_' + i).attr('disabled', true);
			}
		});
		$('#esigForm').removeClass("hidden");
		$('#esigFormDetail').removeClass("hidden");
		$('#tblEsigAgree').removeClass("hidden");
		$("#subject").val($("#esignSubject").val());	
	});
	
	$(function () {
	 	$("input[type='checkbox'").each(function(i, tr) {
			$(':checkbox').attr('disabled', false);
		});
	});
	
	$('#emailForm').click(function(){
		$('#emailTemplate').val('forms');
		$('#esigForm').removeClass("hidden");
		$('input[type=text]').prop('disabled',false);
		$('textarea[id="message"]').attr('disabled', false);
		$('#btnSendEsignOk').attr('disabled', false);
		$('#sendEsignEmail').attr('disabled', false);
		$('#esigFormDetail').addClass("hidden");
		$('#tblEsigAgree').removeClass("hidden");
		$("#subject").val($("#emailSubject").val());		
		/*$('#chkAllFormsId').removeAttr("checked");
		$("input.clsEsignForm").each(function(i, tr) {
			if(this.value == "true"){
		    	$('#form_' + i).attr("disabled", false).removeAttr("checked");
		    }
		});*/
	});
	
	$('#cancelEmail').click(function(){
		$('#emailTemplate').val('');
		$('#esigForm').addClass("hidden");
		$('#esigFormDetail').addClass("hidden");
		$('#tblEsigAgree').addClass("hidden");
		$('#chkAllFormsId').removeAttr("checked");
		$("input.clsEsignForm").each(function(i, tr) {
			if(this.value == "true"){
		    	$('#form_' + i).attr("disabled", false).removeAttr("checked");
		    }
		});

	});
	
	$('.chkAllForms').click(function(){
		var checkStatus =  $("#chkAllFormsId").prop("checked");
		selectAllForms(checkStatus);
	});
	
	$('.formHiddenCheckBox').click(function(){
	    if(!$(this).is(':checked')){
	    	// When unchecking one checkbox, make the check all checkbox unchecked
	        $('#chkAllFormsId').attr('checked', false);
	    } else {
	        if($('.formHiddenCheckBox:unchecked').length == 0) {
	        	// When checking one checkbox, if all checkboxes are checked, make the check all checkbox checked
	            $('#chkAllFormsId').attr('checked', true);
	        }
	    }
	});

	//To Save Form
	$('#saveForm').click(function(){
		$('#emailTemplate').val('');
		setFormHiddenData();
		if(!printForm){
			alert('Please Select a Document');
			return false;
		} else {
			//57817 - Added wait message on Save for 3 secs
			showLoadingMsg();
			var formData = $("#aiForm").serialize();
			formData = decodeURIComponent(formData).split('+').join(' ');
			//Added hidLoadingMsg as callback functino so show loading message while save
			//TD 57817 and 57842
			download(document.aiForm.downloadURI.value, formData, "POST");
			setTimeout("hideLoadingMsg()", 3000); 
			return false;
		}
	});
	

	//To open instructions
	$('#formsInstructions').click(function(){
		var target = 'AI2FormInstructions';
		var inputs = '';
		inputs+='<input type="hidden" name="FORM_CSRF_TOKEN" value="'+ $('input[name=FORM_CSRF_TOKEN]').val() +'" />'; 
		inputs+='<input type="hidden" name="state" value="'+ $("input[name='policy.stateCd']").val() +'" />'; 
		inputs+='<input type="hidden" name="channel" value="'+ $("input[name='policy.channelCd']").val() +'" />';
		inputs+='<input type="hidden" name="uwCompanyCd" value="'+ $("input[name='policy.uwCompanyCd']").val() +'" />';
		
		var w = window.open('', target);
		if($('#endorseMentDetails').val()=='ENDORSEMENT'){
			inputs+='<input type="hidden" name="lob" value="'+ $("input[name='policy.lob']").val() +'" />';
			$('<form action="'+ document.aiForm.instructionsEndorseURI.value +'" method="post" target="'+ target+'">'+inputs+'</form>').appendTo('body').submit().remove();
		}else{
		$('<form action="'+ document.aiForm.instructionsURI.value +'" method="post" target="'+ target+'">'+inputs+'</form>').appendTo('body').submit().remove();
			}
	    w.focus();
		
		return false;
	});	
	
	//To Print forms
	$('#printForms').click(function(){
		$('#emailTemplate').val('');
		var target = 'AI2printPage';
		setFormHiddenData();
		if(!printForm){
			alert('Please Select a Document');
			return false;
		} else {
			var data = decodeURIComponent($("#aiForm").serialize()).split('+').join(' ');
			var inputs = '';
			$.each(data.split('&'), function(){ 
				var pair = this.split('=');
				inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
			});
	
			if(!printForm){
				return;
			}
			var w = window.open('', target);
			$('<form action="'+ document.aiForm.printURI.value +'" method="post" target="'+ target+'">'+inputs+'</form>').appendTo('body').submit().remove();
			
		    w.focus();
			
			return false;
		}

	});
	
	$(document).on("click", "#sendEsignEmail", function(){
		if(validatePage()){
			setFormHiddenData();
			if(!printForm){
				alert('Please Select a Document');
				return;
			}
			promptESignEmail();
		}
	});
	
	$('.eSignForms').removeAttr('checked');
	
	$('.clsClearForms').click(function(){
		clearFormsPage();
	});
	
	// validate email
	$('.clsEmail').bind(getValidationEvent(), function(event, result){validateEmail(this);});
	
	// validate subject
	$('#subject').bind(getValidationEvent(), function(event, result){requiredField(this);});
	
	// validate agent first name
	$('#firstName').bind(getValidationEvent(), function(event, result){validateAgentName(this);});
	$('#firstName').bind(getValidationEvent(), function(event, result){requiredAgentField(this);});
	
	// validate agent middle name
	$('#middleName').bind(getValidationEvent(), function(event, result){validateAgentName(this);});
	
	// validate agent last name
	$('#lastName').bind(getValidationEvent(), function(event, result){validateAgentName(this);});
	$('#lastName').bind(getValidationEvent(), function(event, result){requiredAgentField(this);});
	
	// Ok button to send E-signature
	$('#btnSendEsignOk').click(function(event){
		$('#btnSendEsignOk').attr('disabled',true);
		sendEsignEmail();
		event.stopImmediatePropagation();
	});
	
	if ($('#showConfirmMsg').val() == "Y") {
		//CT UBI requirement
		var stateCd = $('#stateCd').val();
		var ubiProgramInd= $("#ubiProgramInd").length > 0 ? $("#ubiProgramInd").val() : "";
		if(stateCd == "CT" && ubiProgramInd == "Yes"){
			$('#ubiDiscountModal').modal();
		}else{
			$('#myshowConfirm').modal();
		}
	};
	
	if ($('#showEndorseConfirmMsg').val() == "Yes") {
		//CT UBI requirement
		var stateCd = $('#stateCd').val();
		var ubiDiscApplied= $("#ubiDiscApplied").length > 0 ? $("#ubiDiscApplied").val() : "";
		//TD 61973 - YUBI CC
		var priorUbiProgramInd= $("#priorUbiProgramInd").length > 0 ? $("#priorUbiProgramInd").val() : "";
		if(stateCd == "CT" && ubiDiscApplied == "Yes" && priorUbiProgramInd != "Yes"){
			$('#ubiEndorseDiscountModal').modal();
		}
	};
	
	//CT UBI requirement
	$('.ubiDiscountCls').bind("click",function () {
		$('#ubiDiscountModal').modal('hide');
		$('#myshowConfirm').modal();
	});
	
	//CT UBI requirement
	$('.ubiEndorseDiscountCls').bind("click",function () {
		$('#ubiEndorseDiscountModal').modal('hide');
	});
	
	$("#rate").addClass("disabled");
	$("#rate_temp").addClass("disabled");
	$('#confirmBtn').prop("disabled",false);

	disableOrEnableElementsForFormsTab();
	
	var policyNumber=$('#policyNumber_Policy').val();
	var residentZip=$('#residentZip').val();
	$("#road_rewards_img").click(function(){
		var roadrewards_url= $('#roadRewardsUrl').val();
		roadrewards_url = roadrewards_url + '?policyNumber=' + policyNumber +'&zipCode='+ residentZip;
		window.open(roadrewards_url,"_blank");
	});
	initialFormLoadProcessing();
});

function viewDocument(i) {
	var target = '_blank';
	var inputs = '';
	
	$('#hidden_form_' + i).val('true');
	
	$(':input[name]', "#aiForm").each(function() {
		var fieldName = $(this).attr('name');
		
		if (fieldName.indexOf("forms[") >= 0 ) {
			if (fieldName.indexOf("forms["+i+"]") >= 0 ) { /*copy only selected form details. */
				inputs+='<input type="hidden" name="'+ fieldName +'" value="'+ $(this).val() +'" />'; 
			} 
		} else {
			inputs+='<input type="hidden" name="'+ fieldName +'" value="'+ $(this).val() +'" />'; 
		}
	});
	
	$('<form action="'+ document.aiForm.printURI.value +'" method="post" target="'+ target+'">'+inputs+'</form>').appendTo('body').submit().remove();
}

/*function download (url, data, method, callback){

	var iframeX;
	var downloadInterval;
	if(url && data){
		// remove old iframe if has
		if($("#iframeX")){
			$("#iframeX").remove();
		}
		// creater new iframe
		iframeX= $('<iframe src="[removed]false;" name="iframeX" id="iframeX"></iframe>').appendTo('body').hide();
		if($.browser.msie){
			downloadInterval = setInterval(function(){
				// if loading then readyState is "loading" else readyState is "interactive"
				if(iframeX&& iframeX[0].readyState !=="loading"){
					if(typeof callback == 'function'){
						callback();
					}
					clearInterval(downloadInterval);
				}
			}, 23);
		} else {
			iframeX.load(function(){
				if(typeof callback == 'function'){
					callback();
				}
			});
		}
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : $.param(data);
		//split params into form inputs
		var inputs = '';
		$.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});

		// create form to send request
		$('<form action="'+ url +'" method="'+ (method||'post') + '" target="iframeX">'+inputs+'</form>').appendTo('body').submit().remove();
	};
}; */

//UBI CT requirement
function processUBIModal(nextOpen){
    $("#" +nextOpen).modal();  	
	$("#" +nextOpen).on('hidden', function () {
		$('#myshowConfirm').modal('show');
	});
}

function download(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
		
	};

}

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
	//Set default button when <enter> is clicked
	setDefaultEnterID('save');
}
var printForm = false;
function setFormHiddenData() {
	printForm = false;
	$("input.formHiddenCheckBox").each(function(i, tr) {
		if(this.checked){
			printForm = true;
	    	$('#hidden_form_' + i).val('true');
	    } else {
	    	$('#hidden_form_' + i).val('false');
	    }
	});
}

function clearFormsPage(){
	/*resetForm(tblForms);*/
	$('#aiForm').get(0).reset();
	$('.chkBoxCol').find("input:checkbox").removeAttr("disabled");
	$('#esigForm').addClass("hidden");
	$('#esigFormDetail').addClass("hidden");
	$('#tblEsigAgree').addClass("hidden");
}

function selectAllForms(checkStatus){
	$("#chkAllFormsId").attr('checked',checkStatus);
	$("td.chkBoxCol").find("input:checkbox:not(:disabled)").each(function () { 
		 this.checked = checkStatus;
	});	
	$("input.clsEsignPaymentForm").each(function(i, tr) {
		if (this.value == "true") {
			$('#form_' + i).attr('checked', false);
		}
	});
}

function promptESignEmail(){
	var msg = "Please do not exit from the application.<br/> " +
			"A prompt will display to let you know your forms(s) have been e-mailed.";
	$('#sendEsignModalMsg').html(msg);
	$('#btnSendEsignOk').removeClass("hidden");
	$('#btnConfirmSendEsign').addClass("hidden");
	$("#sendEsignModal").modal("show");
}

function sendEsignEmail(){

	// function sends esignature email
	$.ajax({
		url: "/aiui/forms/sendEmail",
		type:'POST',
		data: $("#aiForm").serialize(),
	
	   beforeSend: function(status, xhr){
		   showLoadingMsg();
	    },
	
		success: function(data){
			//change modal text and add button
			var msg = "Email sent successfully.";
			$('#sendEsignModalMsg').html(msg);
			$('#btnSendEsignOk').attr('disabled',false);
			$('#btnSendEsignOk').addClass("hidden");
			$('#btnConfirmSendEsign').removeClass("hidden");
		},
	
		error: function(data){
			var state = $("input[name='policy.stateCd']").val(); 
			var channel = $("input[name='policy.channelCd']").val();
			var companyCd = $("input[name='policy.companyCd']").val();
			var msg = "Email Sending Failed.";
			if(state == 'NJ' && (channel == 'DIRECT' || channel == 'CAPTIVE')){ 
				msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 866-328-7378.';
			}
			if(state == 'NJ' && channel == 'IA'){ 
				msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 908-219-5373.';
			}
			//PA message
			if(state == 'PA'){ 
				msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 844-748-8857.';
			}
			if(state == 'MA' ){
				if(companyCd == 'PR'){ 
					msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 866-353-6292.';
				}else if(companyCd == 'MAIP'){ 
					msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 866-353-6292.';
				}else if(companyCd == 'PG'){
					msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 877-784-5099.';
				}else{
					msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 866-353-6292.';
				}
			}
			if(state == 'NH' && channel == 'IA'){ 
				msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 800-979-6288.';
			}
			if(state == 'CT' && channel == 'IA'){ 
				msg = 'Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: 866-591-5545.';
			}
			
			$('#sendEsignModalMsg').html(msg);
			$('#btnSendEsignOk').attr('disabled',false);
			$('#btnSendEsignOk').addClass("hidden");
			$('#btnConfirmSendEsign').removeClass("hidden");
		},
		
		complete: function(){
			$.unblockUI();
		}

	});
}

/* validation */
function showClearInLineErrorMsgs(name,strElementID, strErrorMsgID, strErrorRow, columnIndex){
	showClearInLineErrorRowMsgs(name,strElementID, strErrorMsgID, strErrorRow);
}

function showClearInLineErrorRowMsgs(name,strElementID, strErrorMsgID, strErrorRow){
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
		clearInLineRowError(strRowName,strElementID, strErrorRow);
		return;
	}
	
	//get the error message to be displayed
	strErrorMsg = getMessage(strErrorMsgID);
	if(strErrorMsg.length == 0){
		// if no error message -> return;
		return;
	}
	
	$('#' + jq(strElementID)).each(function(){
		var dataRow = '';
		if(isAppRow)
		{
			//alert('ok this exists in the ID');
			dataRow = $(this).parents("tr").first();   //TR containing this TD
			var errorRowExists = false;
			//see if error row already exists 
			$('#' + strRowName  + '_Error').each(function(){
				errorRowExists = true;
			});
			//var strErrorColSelector = '';
			if (errorRowExists == false) {
				//Error row does not exist, so insert it
				strErrorRow = strErrorRow.replace('sampleErrorRow', strRowName+'_Error');
				if(isPri)
				{
					strErrorRow = strErrorRow.replace(/Error_Col_PRI/g, strRowName+'_pri' + '_Error_Col');

				}
				else
				{
					strErrorRow = strErrorRow.replace(/Error_Col_SEC/g, strRowName+'_sec' + '_Error_Col');
				}
				$(strErrorRow).insertAfter(dataRow);  
				var strErrorColSelector = strRowName + '_Error';
				if(isPri)
				{
					$('#'+name+'_pri_Error_Col').append(strErrorMsg);
				}
				else
				{
					$('#'+name+'_sec_Error_Col').append(strErrorMsg);
			
				}
				$('#' + strErrorColSelector).addClass('inlineErrorMsg');
				$('#' + strElementID).addClass('inlineError');
			}
			if(errorRowExists == true)
			{
				//row exists but erorrMeessage id is empty so just remove it
				var strErrorColSelector = strRowName + '_Error';
				if(isPri)
				{
					if(($('#'+strErrorColSelector).has('td[id^="'+name+'_pri_Error_Col"]')).length>0)
					{
						$('#'+name+'_pri_Error_Col').text(strErrorMsg);
					}
					else
					{
						var updatedErrorRow = $('#'+strErrorColSelector).html().replace(/Error_Col_PRI/g, strRowName+'_pri' + '_Error_Col');
						$('#'+strErrorColSelector).replaceWith('<tr id="'+name+'_Error" class="inlineErrorMsg">'+updatedErrorRow+'</tr>');
						$('#'+name+'_pri_Error_Col').append(strErrorMsg);
						$('#' + strErrorColSelector).addClass('inlineErrorMsg');
						$('#' + strElementID).addClass('inlineError');
					}
					
				}
				else
				{
						if(($('#'+strErrorColSelector).has('td[id^="'+name+'_sec_Error_Col"]')).length>0)
						{
							$('#'+name+'_sec_Error_Col').text(strErrorMsg);
						}
						else
						{
							var updatedErrorRow = $('#'+strErrorColSelector).html().replace(/Error_Col_SEC/g, strRowName+'_sec' + '_Error_Col');
							$('#'+strErrorColSelector).replaceWith('<tr id="'+name+'_Error" class="inlineErrorMsg">'+updatedErrorRow+'</tr>');
							$('#'+name+'_sec_Error_Col').append(strErrorMsg);
							$('#' + strErrorColSelector).addClass('inlineErrorMsg');
							$('#' + strElementID).addClass('inlineError');
						}
				}
				
			}
		}
		
		else{
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
			}
		});
}

function clearInLineRowError(rowName,strElementID, strErrorRow){
	var strRowName = rowName;
	var errorRow = null;
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	var isPri=false;
	var isAppRow=false;
	if(isAppRow){
			if(isPri){
				var repPri = rowName+'_sec_Error_Col';
				if(($('#' + strRowName  + '_Error').has('td[id^="'+repPri+'"]')).length>0)
				{
					var repRow = rowName+'_pri_Error_Col';
					var re = new RegExp(repRow,"g");
					var updatedErrorRow = errorRow.html().replace(re,'Error_Col_PRI');
					$('#' + strRowName  + '_Error').replaceWith('<tr id="'+rowName+'_Error" class="inlineErrorMsg">'+updatedErrorRow+'</tr>');
					//$('#Error_Col_PRI').text('');
					$('#'+rowName+'_Error td[id^="Error_Col_PRI"]').text('');
					$('#' + strElementID).removeClass('inlineError');
				}
				else
				{
					errorRow.remove();
					$('#' + strElementID).removeClass('inlineError');
				}
			}
			else{
				var repPri = rowName+'_pri_Error_Col';
				if(($('#' + strRowName  + '_Error').has('td[id^="'+repPri+'"]')).length>0){
					var repRow = rowName+'_sec_Error_Col';
					var re = new RegExp(repRow,"g");
					errorRow = errorRow.html().replace(re,'Error_Col_SEC');
					$('#' + strRowName  + '_Error').replaceWith('<tr id="'+rowName+'_Error" class="inlineErrorMsg">'+errorRow+'</tr>');
					//$('#Error_Col_SEC').text('');
					$('#'+rowName+'_Error td[id^="Error_Col_SEC"]').text('');
					$('#' + strElementID).removeClass('inlineError');
				}
				else
				{
					errorRow.remove();
					$('#' + strElementID).removeClass('inlineError');	
				}
			}
	}
	else
	{
		if (errorRow == null || errorRow.length == 0 ) {
			return ;
		}
		// remove error row
		errorRow.remove();
		$('#' + strElementID).removeClass('inlineError');	
	}
}

var fieldIdToModelErrorRow = {
	"agentSingle":"<div id=\"sampleErrorRow\"><span class=\"grid1\" id=\"Error_Col\"></span></div>",
	"defaultSingle":"<tr id=\"sampleErrorRow\"><td></td><td class=\"grid1\" id=\"Error_Col\"></td><td></td><td></td></tr>"
};

var errorMessageJSON = {
	"fromEmailAddress.browser.inLine.InvalidEmailId":"From Email is invalid",
	"toEmailAddress.browser.inLine.InvalidEmailId":"To Email is invalid",
	"ccEmailAddress.browser.inLine.InvalidEmailId":"CC Email is invalid",
	"subject.browser.inLine.NotEnteredValue":"Please enter a subject",
	"firstName.browser.inLine.NotEnteredValue":"Please enter a first name",
	"firstName.browser.inLine.InvalidName":"Please enter a valid first name",
	"middleName.browser.inLine.InvalidName":"Please enter a valid middle name",
	"lastName.browser.inLine.NotEnteredValue":"Please enter a last name",
	"lastName.browser.inLine.InvalidName":"Please enter a valid last name"	
};

function requiredAgentField(elm){
	var strID = elm.id;
	isFieldEntered('',elm,'No', strID + '.browser.inLine',fieldIdToModelErrorRow['agentSingle'], '');
}

function requiredField(elm){
	var strID = elm.id;
	isFieldEntered('',elm,'No', strID + '.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateAgentName(nameID){
	var strID = nameID.id;
	isValidName('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow['agentSingle'], '');
}

function validateName(nameID){
	var strID = nameID.id;
	isValidName('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], '');
}

function validateEmail(addressEmailID){
	var strID = addressEmailID.id;
	isValidEmail('',addressEmailID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow['defaultSingle'], '');
}

function isFieldEntered(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var fieldValue = $(elementId).val();
	var errorMessageID = '';
	if(fieldValue==null || fieldValue == 'Optional'){ 
		 errorMessageID = '';
	}
	else{
		if(fieldValue == ""){
			errorMessageID = 'NotEnteredValue';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else{
			errorMessageID = '';
		}
	}
	showClearInLineErrorMsgs('',elementId.id, errorMessageID, strErrorRow, index);
}



function isValidEmail(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/i);
	var emailAddress = $(elementId).val();
	var errorMessageID = '';
	if(emailAddress==null || emailAddress =='' || emailAddress == 'Optional'){ 
		 errorMessageID = '';
	}
	else
	{
		var valid = emailRegex.test(emailAddress);
		if (!valid)
		{
			errorMessageID = 'InvalidEmailId';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	showClearInLineErrorMsgs('',elementId.id, errorMessageID, strErrorRow, index);
}

function isValidFieldName(valueStr){
	if($.trim(valueStr).match(/^[a-zA-Z*~'\-\\s]+$/)){
		return true;
	} else {
		return false;
	}
}

function isValidName(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var nameRegex = new RegExp(/^[a-zA-Z*~'\-\\s]+$/);
	var name = $(elementId).val();
	var errorMessageID = '';
	if(name==null || name =='' || name == 'Optional'){ 
		 errorMessageID = '';
	} else
	{
		var valid = nameRegex.test(name);
		if (!valid)
		{
			errorMessageID = 'InvalidName';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	showClearInLineErrorMsgs('',elementId.id, errorMessageID, strErrorRow, index);
	
}

function validatePage(){
	var msg = "";

	// from address
	var fromEmailAddress = $('input[id="fromEmailAddress"]').val();
	if(fromEmailAddress == "" || !isValidFieldEmail(fromEmailAddress)){
		msg = msg + "Please enter a valid from address\n";
	}
	
	// to address
	var toEmailAddress = $('input[id="toEmailAddress"]').val();
	if(toEmailAddress == "" || !isValidFieldEmail(toEmailAddress)){
		msg = msg + "Please enter a valid to address\n";
	}
	
	if((fromEmailAddress != "") && (fromEmailAddress.toLowerCase() == toEmailAddress.toLowerCase())){
		msg = msg + "From Address and To Address cannot be the same\n";
	}
	
	// cc address
	var ccEmailAddress = $('input[id="ccEmailAddress"]').val();
	if(ccEmailAddress != "" && !isValidFieldEmail(ccEmailAddress)){
		msg = msg + "Please enter a valid cc address\n";
	}
	
	// subject
	var subject = $('input[id="subject"]').val();
	if(subject == ""){
		msg = msg + "Please enter an email subject\n";
	}
	
	var emailTemplate = $('#emailTemplate').val();
	
	if(emailTemplate == "primeesign" ||emailTemplate == "endoesign"  ) {
		// first/middle/last name
		var firstName = $('input[id="agentFirstName"]').val();
		//var firstName = $('#agentFirstName').val();
		var middleName = $('input[id="agentMiddleName"]').val();
		var lastName = $('input[id="agentLastName"]').val();
				
		if(firstName == "" || !isValidFieldName(firstName)){
			msg = msg + "Please enter a valid Agent First Name\n";
		}
		
		if(middleName != "" && !isValidFieldName(middleName)){
			msg = msg + "Please enter a valid Agent Middle Initial\n";
		}
		
		if(lastName == "" || !isValidFieldName(lastName)){
			msg = msg + "Please enter a valid Agent Last Name\n";
		}
		
		// I agree
		var blnAgreeChk = $('input[id="chkIAgree"]').is(":checked");
		if(!blnAgreeChk){
			msg = msg + "Please select I Agree\n";
		}
	}

	if(msg != ""){
		alert(msg);
		return false;
	} else {
		return true;
	}
}
