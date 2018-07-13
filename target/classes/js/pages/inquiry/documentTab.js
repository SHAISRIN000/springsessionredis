AI.inquiry = {};
AI.inquiry.document={};
var INQDOC = AI.inquiry.document;
INQDOC.MAX_DOCS_ALLOWED=10;
INQDOC.Messages = {
	"eMailSucceeded":"Email sent successfully.",
	"eMailPrompt":	 "Please do not exit from the application.<br/> " +
	"A prompt will display to let you know your forms(s) have been e-mailed.",
	"invalidEmail":"Email Address is invalid",
	"emailEmpty":"Email field cannot be empty",
	"invalidFromAddr":"Please enter a valid from address",
	"invalidToAddr":"Please enter a valid to address",
	"invalidCCAddr":"Please enter a valid cc address",
	"sameToAndFromAddr":"From Address and To Address cannot be the same",
	"emptySubject":"Please enter an email subject",
	"noDocsSelected":"No documents were selected",
	"maxDocsSelected":"The maximum number of documents that can be attached to the email is "+INQDOC.MAX_DOCS_ALLOWED+
			". If you need to send more than "+INQDOC.MAX_DOCS_ALLOWED+", please send multiple emails"
};

INQDOC.Messages.errors={};
var genericErrorMessage = "Email functionality is currently experiencing difficulties. Please try again and if issue  persists, contact us at: ";
var ERRORS = INQDOC.Messages.errors;

ERRORS['PA']=genericErrorMessage+"844-748-8857.";
ERRORS['NJ']=genericErrorMessage+"866-328-7378.";
ERRORS['NJ.IA']=genericErrorMessage+"908-219-5373.";
ERRORS['MA']=genericErrorMessage+"866-353-6292.";
ERRORS['MA.PG']=genericErrorMessage+"877-784-5099.";
ERRORS['CT']=genericErrorMessage+"866-591-5545.";
ERRORS['NH']=genericErrorMessage+'800-979-6288.';

AI.utils.validateEmail = function($field, isManadatory){
	
	//Field is not mandatory & is empty
	if(!isManadatory && ($field.val() == undefined || $field.val().trim() == "")){
		return;
	}
	
	//Email field is empty
	if($field.val() == undefined || $field.val().trim() == ""){
		$field.addClass("invalid");
		$field.attr("title",INQDOC.Messages["emailEmpty"]);
		return;
	}
	//Validate if the value of email is good
	if(isValidFieldEmail($field.val())){
		//Email is valid
		$field.removeClass("invalid");
		$field.attr("title","");
		return;
	}
	//Email is invalid
	$field.addClass("invalid");
	$field.attr("title",INQDOC.Messages["invalidEmail"]);
	
};

AI.inquiry.showAlert = function(message, okHandler){
	
	$('#alertMsg').html(message);
	$("#alertModal").modal("show");
	$('#alertModal').off('hidden.bs.modal');
	if(undefined !== okHandler){
		$('#alertModal').on('hidden.bs.modal', okHandler);
	}
}

INQDOC.sendEmail = function (){
	//Extract the contents and format it as json
	var data = {
			"fromAddress":$('#fromEmailAddress').val(),
			"toAddress":$('#toEmailAddress').val(),
			"ccAddress":$('#ccEmailAddress').val(),
			"body":$('textarea#message').val(),
			"subject":$('#subject').val(),
			"state":$("#state").val(),
			"policyNumber":$("#docPolicyNumber").val(),
			"documents":[]
	};
	//Select all Checked records
	var $selectedDocs = $("#documentDetails").find(".chkBoxCol input[type='checkbox']:checked");
	$selectedDocs.each(function(index){
		var prefix = "#"+this.id;
		var document = {
				"docID":$(prefix+"_docID").val(),
				"drawer":$(prefix+"_drawer").val(),
				"pageIDs":$(prefix+"_pageIDs").val(),
				"fileName":$(prefix+"_fileName").val()
			};
		data.documents.push(document);
	});
	
	$.ajax({
		url: "../inquiry/sendDocsEmail?FORM_CSRF_TOKEN="+$("input[name='FORM_CSRF_TOKEN']").val(),
		type:'POST',
		 contentType: "application/json; charset=utf-8",
		 dataType: "json",
		data: JSON.stringify(data),
		beforeSend: function(status, xhr){
		   showLoadingMsg();
	    },
		success: function(data){
			if(!data.error){
				AI.inquiry.showAlert(INQDOC.Messages["eMailSucceeded"]);
				return;
			}
			AI.inquiry.showAlert("Email Application is down");
			var company = $('#companyCD').val();
			var state = $('#state').val();
			var channel = $('#channelCD').val();
			var error = ERRORS[state+"."+company] || ERRORS[state+"."+channel] || ERRORS[state];
			AI.inquiry.showAlert(error);
		},
		error: function(data){
			var company = $('#companyCD').val();
			var state = $('#state').val();
			var channel = $('#channelCD').val();
			var error = ERRORS[state+"."+company] || ERRORS[state+"."+channel] || ERRORS[state];
			AI.inquiry.showAlert(error);
		},
		complete: function(){
			$.unblockUI();
		}

	});
};

INQDOC.selectAllDocs = function(checkStatus){
	$("#chkAllFormsId").prop('checked',checkStatus);
	var $selectedDocs = $("#documentDetails").find(".chkBoxCol input[type='checkbox']:checked");
	var selectedCount = $selectedDocs.length;
	if (checkStatus) {
		//Already more than 10 docs were selected so 
		if( selectedCount >  INQDOC.MAX_DOCS_ALLOWED){
			$("#chkAllFormsId").prop('checked',false);
			AI.inquiry.showAlert(INQDOC.Messages["maxDocsSelected"]);
			return false;
		}
		
		//Select only top 10 docs
		$("#documentDetails").find(".chkBoxCol input[type='checkbox']").each(function(index){
			//Select only at max of 10 docs
			//if email popup is disabled then select all  
			if(index >= INQDOC.MAX_DOCS_ALLOWED-selectedCount && !$('#sendEmail').attr('disabled')){
				AI.inquiry.showAlert(INQDOC.Messages["maxDocsSelected"]);
				return false;
			}
			//already a doc from top 10 selected so don't decrease the overall count of docs selected
			if($(this).prop('checked')) {
				selectedCount--;
			}
			//select a doc
			$(this).prop('checked',true);
		});
		return;
	} 
	$("#documentDetails").find(".chkBoxCol input[type='checkbox']").prop('checked',checkStatus);
};

INQDOC.toggleEmailFields = function(isDisabled){
	var $docs = $("#documentDetails");
	//var $checkboxFields = $docs.find(".chkBoxCol input[type='checkbox']");
	//$checkboxFields.prop('checked',false);
	//$("#chkAllFormsId").prop('checked',false);
	//$("#chkAllFormsId").prop('disabled',isDisabled);
	//$checkboxFields.prop('disabled',isDisabled);
	$docs.find('input[type=text]').attr('disabled',isDisabled);
	$docs.find('textarea[id="message"]').attr('disabled', isDisabled);
	$('#sendEmail').attr('disabled', isDisabled);
	if(isDisabled){
		//Cancel Email was clicked
		$('#emailForm').addClass("hidden");
	} else {
		//Email icon was clicked
		$('#emailForm').removeClass("hidden");
	}
};

INQDOC.documentSelected = function(){
	var newValue = $(this).prop("checked");
	var $selectedDocs = $("#documentDetails").find(".chkBoxCol input[type='checkbox']:checked");
	//if unchecked validation isn't required
	//if selected docs is greater than 10
	//If Email is disabled don't show an alert
	if(newValue && ($selectedDocs.length >  INQDOC.MAX_DOCS_ALLOWED && !$('#sendEmail').attr('disabled'))) {
		//More than 10 documents selected so don't all the user to proceed Further
		$(this).prop("checked",false);
		AI.inquiry.showAlert(INQDOC.Messages["maxDocsSelected"]);
		return;
	} 
	var $checkboxFields = $("#documentDetails").find(".chkBoxCol input[type='checkbox']");
	var isCheckAll = true;
	$checkboxFields.each(function(index){
		if(!$(this).prop("checked") && (index < INQDOC.MAX_DOCS_ALLOWED || $('#sendEmail').attr('disabled'))){
			isCheckAll = false;
			return false;
		}
	});
	$("#chkAllFormsId").prop("checked", isCheckAll);
}; 

INQDOC.validateSubject = function(){

	var $this = $(this);
	if($this.val() == undefined || $this.val().trim() == ""){
		$this.addClass("invalid");
		$this.attr("title",INQDOC.Messages["emptySubject"]);
		return;
	} else {
		$this.removeClass("invalid");
		$this.prop("title","");
	}

}

INQDOC.validatePage = function(){
	var msg = "";

	// from address
	var fromEmailAddress = $('#fromEmailAddress').val();
	if(fromEmailAddress == "" || !isValidFieldEmail(fromEmailAddress)){
		msg = msg + "<li>"+INQDOC.Messages["invalidFromAddr"]+"</li>";
	}
	
	// to address
	var toEmailAddress = $('#toEmailAddress').val();
	if(toEmailAddress == "" || !isValidFieldEmail(toEmailAddress)){
		msg = msg +  "<li>"+INQDOC.Messages["invalidToAddr"]+"</li>";
	}
	
	if((fromEmailAddress != "") && (fromEmailAddress.toLowerCase() == toEmailAddress.toLowerCase())){
		msg = msg +  "<li>"+INQDOC.Messages["sameToAndFromAddr"]+"</li>";
	}
	
	// cc address
	var ccEmailAddress = $('#ccEmailAddress').val();
	if(ccEmailAddress != "" && !isValidFieldEmail(ccEmailAddress)){
		msg = msg +  "<li>"+INQDOC.Messages["invalidCCAddr"]+"</li>";
	}
	
	// subject
	var subject = $('#subject').val();
	if(subject == ""){
		msg = msg + "<li>"+ INQDOC.Messages["emptySubject"]+"</li>";
	}
	var $selectedDocs = $("#documentDetails").find(".chkBoxCol input[type='checkbox']:checked");
	if($selectedDocs.length == 0 ){
		msg = msg + "<li>"+ INQDOC.Messages["noDocsSelected"]+"</li>";
	}
	
	if($selectedDocs.length >  INQDOC.MAX_DOCS_ALLOWED ){
		msg = msg + "<li>"+ INQDOC.Messages["maxDocsSelected"]+"</li>";
	}

	if(msg != ""){
		AI.inquiry.showAlert(msg)
		return false;
	} else {
		return true;
	}
};

jQuery(document).ready(function() {
	
	$('#fromEmailAddress').on( "change", function(){
		AI.utils.validateEmail($('#fromEmailAddress'), true);
	} );
	$('#toEmailAddress').on( "change", function(){
		AI.utils.validateEmail($('#toEmailAddress'), true);
	} );
	$('#ccEmailAddress').on( "change", function(){
		AI.utils.validateEmail($('#ccEmailAddress'), false);
	} );
	$(".chkBoxCol input[type='checkbox']").on( "change", INQDOC.documentSelected );
	$('#chkAllFormsId').click(function(){
		var checkStatus =  $("#chkAllFormsId").prop("checked");
		INQDOC.selectAllDocs(checkStatus);
	});
	
	$('#subject').on( "change", INQDOC.validateSubject);
	$('#emailIcon').click(function(){
		INQDOC.toggleEmailFields(false);
		//Validate
		var $selectedDocs = $("#documentDetails").find(".chkBoxCol input[type='checkbox']:checked");
		if($selectedDocs.length >  INQDOC.MAX_DOCS_ALLOWED ) {
			//More than 10 documents selected so don't all the user to proceed Further
			AI.inquiry.showAlert(INQDOC.Messages["maxDocsSelected"]);
		} 
	});
	
	$('#cancelEmail').click(function(){
		INQDOC.toggleEmailFields(true);
	});
	
	$("#sendEmail").on("click", function(){
		if(INQDOC.validatePage()){
			AI.inquiry.showAlert(INQDOC.Messages["eMailPrompt"], INQDOC.sendEmail);
		}
	});
	
	INQDOC.toggleEmailFields(true);
	
});



