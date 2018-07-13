jQuery(document).ready(function() {
	setupTabs();
	
	$('#continueSubmitUmbrellaQuote').click(function(){
		//submitFinishPage(true);
		checkSubmitFinishPage(true);
	})
	
	$('#submitUmbrellaQuote').click(function(){
		//submitFinishPage(false);
		checkSubmitFinishPage(false);
	})
	
	$('#downloadForm').click(function(){
		downloadUmbrellaForm();
	})
	
	
	initializeFileData();
	checkFileList();
	
	$("#rateUmbrellaQuoteSummary").bind("click", function(){
		submitForm();
	});
	
	checkRateButtonDisplay();
	showRatingEditsUmbrella();	
	makeReadOnly();
	
	$(document).on("click", "#yesSubmitPrompt",function(){
		$('#submitWarningModal').modal('hide');
		submitFinishPage();
	});
	$(document).on("click", "#noSubmitPrompt", function(){
		$('#submitWarningModal').modal('hide');
	});
	
	$(document).on("click", "#submitPrompt", function(fnctCall){
		$('#finishEditModal').modal('hide');
		$("#reviewInd").attr("checked",true);
		blockUser();
		var event = jQuery.Event(getSubmitEvent());
		$('#umbrellaForm').trigger(event);
		if (event.isPropagationStopped()) { logToDb("umbrellaFinishTab.js: 343 - Inside evet.isPropagationStopped() in submitFinishPage()"); 
			$.unblockUI();
		} else {
			document.umbrellaForm.action = '/aiui/umbrellafinish/submit';
			document.umbrellaForm.method = 'POST';
			document.umbrellaForm.submit();
		}
	});
	
	$(document).on("click", "#yesPrompt", function(fnctCall){
		$('#removeFileModal').modal('hide');
		var strURL = "/aiui/umbrellafinish/removefile";
		var fileIdVal = $('#fileIdVal').val();
		var form_data = new FormData();
		form_data.append("fileId", fileIdVal); 
		
		$.ajax({
			url: strURL,
			type:'POST',
			processData: false,
			contentType: false,
			cache:false,
			data: form_data,

			success: function(data){ logToDb("navigation.js: 597 - In success handler of the ajax call " + strURL + " )");
				//alert("success");
				hideFileName(fileIdVal);
			},
			error: function(xhr, status, error){ logToDb("navigation.js: 600 - In the error handler of the ajax call " + strURL + " in saveNBPage(). Response status " + status + " and error message: " + error);  
				//alert("error is " + error); 
			},
			complete: function(){
				// complete we want to redirect user to chosen action
				//callGlobalHeaderAction();
				
			}
		});
	});
	$(document).on("click", "#noPrompt", function(fnctCall){
		$('#removeFileModal').modal('hide');
	});

});

function downloadUmbrellaForm() {
	//57817 - Added wait message on Save for 3 secs
	showLoadingMsg();
	var policyKey = $("#policyKey").val();
	//Added hidLoadingMsg as callback functino so show loading message while save
	//TD 57817 and 57842
	download("/aiui/umbrellafinish/download", policyKey, "POST");
	setTimeout("hideLoadingMsg()", 3000); 
	return false;
}

function download(url, data, method){
	//url and data options required
	if( url  ){ 
		var inputs = '<input type="hidden" name="policyKey" value="'+ data +'" />'; 
		jQuery('<form action="'+ url +'" method="'+ (method) +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};

}




function initializeFileData() {
	var filesSize =  $('#filesSize').val();
	for (var i=0; i< filesSize ; i++) {
		displayFileName($('#fileFieldId_'+i).val())
	}
}

function checkFileList() {
	if ( $('#fileList').children().length > 0 ) {
		$('#fileList').show();
		$('#noFileList').hide();
	}else {
		$('#fileList').hide();
		$('#noFileList').show();
		
	}
	
}

function checkSubmitFinishPage(skipRate){
	var isRated =  $('#ratedInd').val();
	var activePrem = $('#premAmt').val();
	
	if (!(isRated == 'Yes' && activePrem != "")) {
		$("#finishEditMsg").html("An active rate is not present. Please re-rate and then submit.");
		$(document).on("click", "#okPrompt", function(fnctCall){
			$('#finishEditModal').modal('hide');
		});
		$('#finishEditModal').modal('show');
		
		$('#okPrompt').removeClass("hidden");
	}else if ( $('#fileList').children().length == 0 ) {
		$(document).on("click", "#okPrompt", function(fnctCall){
			$('#fileErrorDialog').modal('hide');
		});
		$('#fileErrorDialog').modal('show');
		$('#okPrompt').removeClass("hidden");
	}else{
		// display warning modal
		$('#skipRate').val(skipRate);
		$('#submitWarningModal').modal('show');
	}
}

function submitFinishPage() {
	
	if (! $('#reviewInd').is(":checked") ) {
		var fName = $('#applicantFirstName').val();
		var lName = $('#applicantLastName').val();
		
		$("#finishEditMsg").html('<input type="checkbox" id="reviewIndTwo" onchange="enableSubmit()" />' + " I have reviewed and completed the application for Umbrella insurance with <b>"+ fName + " " +lName+"</b>. The information contained " +
				"in the application is as told to me by the applicant <b>"+ fName +" "+lName+"</b>. Where applicable, I have retained or submitted all documents required to " +
				"the company.");
		$(document).on("click", "#cancelPrompt", function(fnctCall){
			$('#finishEditModal').modal('hide');
		});
		$('#submitPrompt').prop("disabled",true);
		$('#submitPrompt').removeClass("hidden");
		$('#cancelPrompt').removeClass("hidden");
		$('#finishEditModal').modal('show');
		
	} else {
		blockUser();
		var event = jQuery.Event(getSubmitEvent());
		$('#umbrellaForm').trigger(event);
		if (event.isPropagationStopped()) { logToDb("umbrellaFinishTab.js: 343 - Inside evet.isPropagationStopped() in submitFinishPage()"); 
			$.unblockUI();
		} else {
			document.umbrellaForm.action = '/aiui/umbrellafinish/submit';
			document.umbrellaForm.method = 'POST';
			document.umbrellaForm.submit();
		}
	}
}

function enableSubmit() {
	if ($('#reviewIndTwo').is(":checked")) {
		$('#submitPrompt').prop("disabled",false);
	} else {
		$('#submitPrompt').prop("disabled",true);
	}
}


function uploadFile() {
	
	var file_data = $("#uploadBtn").prop("files");
	var strURL = "/aiui/umbrellafinish/uploadfile";
	var form_data = new FormData();
	var noOfFile = file_data.length;
	if (noOfFile > 0) {
		for (var i=0;i<noOfFile;i++) {
			form_data.append("files", file_data[i]);
		}
		$.ajax({
			url: strURL,
			type:'POST',
			processData: false,
			contentType: false,
			cache:false,
			data: form_data, //$('#umbrellaForm').serialize(),

			beforeSend: function(status, xhr){
				showLoadingMsg();
			},
			success: function(data){ logToDb("umbrellafinishtab.js: - In success handler of the ajax call " + strURL + " )");
				displayFileName(data);
			},
			error: function(xhr, status, error){ logToDb("umbrellafinishtab.js: - In the error handler of the ajax call " + strURL + " in saveNBPage(). Response status " + status + " and error message: " + error);  
				$('#fileUploadErrorDialog').modal('show');
			},
			complete: function(){
				checkFileList();
				$("#uploadBtn").val("");
				hideLoadingMsg();
			}
		});
	}
}

function removeFile(fileId) {
	
	$('#fileIdVal').val(fileId);
	$('#removeFileModal').modal('show');
}

function displayFileName(data) {
	var file =  data.split("|");
	for (var i=0;i<file.length;) {
		var fileName = file[i];
		var fileId = file[i+1];
		var div = $('<div />').attr({'id':'file_'+fileId });
		var subspan = $("<span class=\"fileNameItem\">").text('\t'+ fileName).attr('display','inline');
		var link = $('<a/>');
	       link.attr('href', 'javascript:removeFile(\''+fileId+'\')');
	       link.text('Remove');
	       div.append(link);
	       div.append(subspan);
		$('#fileList').append(div);
		i = i+2;
	}
}

function hideFileName(fileId) {
	if ($('#file_'+fileId).length) {
		$('#file_'+fileId).remove();
	}
	checkFileList();
}
