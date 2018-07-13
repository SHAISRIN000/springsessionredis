jQuery(document).ready(function() {
	
	// making bread crumbs	
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Messages Administration');

	// hide weird things
	$('#formBottomGrey').addClass('hidden');
	$('#formBottom').removeClass('hidden');
	
	// initiate popover for status => exp date
	$('[data-toggle="popover"]').popover();
	
	// default to all companies / select previously picked company 
	$('#companyFilter').val($('#company').val()).trigger('chosen:updated');
	
	// pagination disable current page
	$("a.pageIndex_"+$('#currentPageIndex').val()).addClass("disabled");
	
	$('#companyFilter').change(function(){
		redirect('/aiui/msg_admin/' + $('#companyFilter').val());
//		var messageEntries = $("tr.messageEntry");
//		for(var i=0; i<messageEntries.length; i++){
//			var company = messageEntries[i].dataset.company.replace(/ /g, "");
//			if(!$('#companyFilter').val().includes(company)){ messageEntries[i].style.display = "none"; }
//			else { messageEntries[i].style.display = ""; }
//		}
//		$('#deselectAllBtn').click();
	});
	var checkboxes = $("input[type='checkbox']");
	$(document).on("click", "#selectAllBtn", function(){
		$(':checkbox').each(function(){ this.checked = true; });
		refreshBtns(checkboxes);
	});	
	$(document).on("click", "#deselectAllBtn", function(){
		$(':checkbox').each(function(){ this.checked = false; });
		refreshBtns(checkboxes);
	});
	$(document).on("click", "#newMsgBtn", function(){
		submit('/aiui/msg_admin/new');
	});	
	$('#deselectAllBtn').prop("disabled", true);
	$('#deleteSelectedBtn').prop("disabled", true);
	$('#publishSelectedBtn').prop("disabled", true);
	$('#unpublishSelectedBtn').prop("disabled", true);
	checkboxes.click(function() {
		$('#deleteSelectedBtn').attr("disabled", !checkboxes.is(":checked"));
		$('#deselectAllBtn').attr("disabled", !checkboxes.is(":checked"));
		$('#publishSelectedBtn').attr("disabled", !checkboxes.is(":checked"));
		$('#unpublishSelectedBtn').attr("disabled", !checkboxes.is(":checked"));
	});
	$(document).on("click", "#deleteSelectedBtn", function(){
		var checkedMessages = getCheckedMessages(checkboxes);		
		showQuestionModal("DELETE", checkedMessages);
	});
	$(document).on("click", "#publishSelectedBtn", function(){
		var checkedMessages = getCheckedMessages(checkboxes);
		showQuestionModal("PUBLISH", checkedMessages);
	});
	$(document).on("click", "#unpublishSelectedBtn", function(){
		var checkedMessages = getCheckedMessages(checkboxes);
		showQuestionModal("UNPUBLISH", checkedMessages);
	});
	$(document).on("click", ".messageEdit", function(){		
		var messageId = trimID(this.id);
		submit('/aiui/msg_admin/edit/'+messageId);
	});
	$(".preview").click(function (){
		var id = trimID(this.id);
		var title = $('#messageTitle_' + id).val();
		var detail = Base64.decode($('#messageDetail_' + id).html());
		showMessageModal(title, detail);
	});
	$(document).on("click", ".pageNav", function(){
		redirect('/aiui/msg_admin/'+$('#companyFilter').val()+'?start='+this.getAttribute("value"));
	});
	$(document).on("click", "#pageGo", function(){		
		redirect('/aiui/msg_admin/'+$('#companyFilter').val()+'?start='+$('#pageInput').val());
	});
//	$(".release").click(function (){
//		var id = trimID(this.id);
//		showQuestionModal("RELEASE", [id]);
//	});
//	$(".republish").click(function (){
//		var id = trimID(this.id);
//		showQuestionModal("REPUBLISH", [id]);
//	});
	
	if(!($('#pageInfo').val() == "")){ 
		return showInfoModal($('#pageInfo').val());
	}
});

function showInfoModal(message){
	$('#infoModal #infoModalYes').unbind('click');
//	$('#infoModal #infoModalNo').unbind('click');
	$(document).on("click", "#infoModal #infoModalYes", function() {
    	$('#infoModal').modal('hide');
    	return false;
    });
//	$('#infoModal #infoModalNo').click(function() {         
//    	$('#infoModal').modal('hide');
//    	return false;
//    });
//	$("#infoModal #infoModalYes").text("OK");
	$('#infoModal #infoModalTitle').html(message);
	$('#infoModal #infoModalMessage').html("&nbsp;");
	$('#infoModal').modal('show');
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
	if(items != null){
		headerTitle = primeButtonText + (items.length==1 ? " Message" : " Multiple Messages");
		messageText = intro + task + " the selected message(s)?";
	}
	$('#questionModal #questionModalYes').click(function() {         
    	$('#questionModal').modal('hide');
    	submit('/aiui/msg_admin/selected/' + task + '/' + items.toString());
    });
	$("#questionModal #questionModalYes").text(primeButtonText);
	$('#questionModal #questionModalTitle').html(headerTitle);
	$('#questionModal #questionModalMessage').html(messageText);
	$('#questionModal').modal('show');
}

function showMessageModal(title, detail) {
	$('#msgHeader').html(title);
	$('#msgDetail').html(detail);
	$('#messageDialog').modal('show');	
}

function getCheckedMessages(checkboxes){
	var checkedMessages = [];
	for(var i=0; i<checkboxes.length; i++){
		if(checkboxes[i].checked){ checkedMessages.push(trimID(checkboxes[i].id)); }
	}
	return checkedMessages;
}

function refreshBtns(checkboxes){
	$('#deleteSelectedBtn').attr("disabled", !checkboxes.is(":checked"));
	$('#deselectAllBtn').attr("disabled", !checkboxes.is(":checked"));
	$('#publishSelectedBtn').attr("disabled", !checkboxes.is(":checked"));
	$('#unpublishSelectedBtn').attr("disabled", !checkboxes.is(":checked"));	
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

// trims the id of an element down to the "primaryKey" of Message DB table
function trimID(id){ 
	return id.substring(id.lastIndexOf('_') + 1); 
}

function printThisMessage()  {
    var content = '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">'+
    '<head>' +
    '</head>' +
    '<body>' +
    '<div style = "font-family: Arial, Helvetica, sans-serif;font-size: 14px;font-weight: bold;color: #333333">' +
    document.getElementById('msgHeader').outerHTML +
    '</div>' +
    '<BR><BR>' +
    '<div style = "font-family: Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;color: #333333">' +
    document.getElementById('msgDetail').outerHTML +
    '</div>' +
    '</body>' +
    '</html>';
    $("#print-iframe").remove();
    var newIframe = document.createElement('iframe');
    newIframe.width = '0';
    newIframe.height = '0';
    newIframe.src = 'about:blank';
    newIframe.id ='print-iframe';
    newIframe.name ='print-iframe-name';
    document.body.appendChild(newIframe);
    
    newIframe.contentWindow.contents = content;
    newIframe.src = 'javascript:window["contents"]';
    var loaded = false;
    $("#print-iframe").load(function() {
    	 loaded = true;
         window.frames['print-iframe-name'].focus();
         window.frames['print-iframe-name'].print();
         $("#print-iframe").remove();
         $('#messageDialog').modal('show');
    });
    setTimeout(function(){ if(!loaded) { $('#print-iframe').load(); }  }, 500);
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}