/**
@author vmaddiwar
@description Create one js file for whole Inquiry module which includes tabs like  Driver, Vehicle, Coverage, 
			 etc. This one dynamic js file will take care of all js functionalities required in this module.
*/
jQuery(document).ready(function() {
	
	if($("#driverSearchResults").find("tbody").find("tr").size() > 0){
		$("#driverSearchResults").tablesorter(
				{widthFixed: true, headers: {5:{sorter: false}},sortList: [[0,0]], sortInitialOrder : 'desc' }
		);
	}
	
	if($("#vehicleSearchResults").find("tbody").find("tr").size() > 0){
		$("#vehicleSearchResults").tablesorter(
				{widthFixed: true, headers: {7:{sorter: false}},sortList: [[0,0]], sortInitialOrder : 'desc' }
		);
	}
	
	if($("#billingInstallments").find("tbody").find("tr").size() > 0){
		$("#billingInstallments").tablesorter(
				{widthFixed: true, headers: {2:{sorter: false}}, sortList: [[1,0]]}
		);
	}

	if($("#billingClaims").find("tbody").find("tr").size() > 0){
		$("#billingClaims").tablesorter(
				{widthFixed: true, headers: {1:{sorter: false}, 2:{sorter: false}}, sortList: [[0,0]]}
		);
	}
	
	if($("#billingTransactions").find("tbody").find("tr").size() > 0){
		$("#billingTransactions").tablesorter(
				{widthFixed: true, headers: {7:{sorter: false}},sortList: [[0,1]], sortInitialOrder : 'desc' }
		);
	}
	
	if($("#claimsList").find("tbody").find("tr").size() > 0){
		$("#claimsList").tablesorter(
				{widthFixed: true, headers: {4:{sorter: false}},sortList: [[0,1]], sortInitialOrder : 'desc' }
		);
	}
  
	if($('#policyExpired').val() != undefined && $('#policyExpired').val().length == 0){
		$('#premiumbox').addClass('disabled');
		$('#premiumbox').prop('disabled',true);
		$('#summary').prop('disabled',true).find("a:first-child").removeAttr("href");	
		$('#drivers').prop('disabled',true).find("a:first-child").removeAttr("href");
		$('#vehicles').prop('disabled',true).find("a:first-child").removeAttr("href");
		$('#coverages').prop('disabled',true).find("a:first-child").removeAttr("href");
		$('#billings').prop('disabled',true).find("a:first-child").removeAttr("href");
		$('#document').prop('disabled',true).find("a:first-child").removeAttr("href");
		$('#note').prop('disabled',true).find("a:first-child").removeAttr("href");
	}

	maxItemsAllow = $('#maxItemAddLimit').val();

	updateItemScrollPanel();

	$("#startScrollBtn").click(function(event) {
		slideItemStart(event);
	});
	$("#leftScrollBtn").click(function(event) {
		slideItemLeft(event);
	}).hover(function(event) {
		this.iid = setInterval(function() {
			slideItemLeft(event);
		}, 525);
	}, function(event) {
		if (this.iid != null) {
			clearInterval(this.iid);
		}
	});
	$("#rightScrollBtn").click(function(event) {
		slideItemRight(event);
	}).hover(function(event) {
		this.iid = setInterval(function() {
			slideItemRight(event);
		}, 525);
	}, function(event) {
		if (this.iid != null) {
			clearInterval(this.iid);
		}
	});
	$("#endScrollBtn").click(function(event) {
		slideItemEnd(event);
	});

	/*doSetShowHideItemFields();*/

/*	$('form').bind(getSubmitEvent(), function(event, result) {
		handleSubmit(event);
	});*/
	
	$("#policyTermsSelect").change(function(){
		var selectedTerm = $("#policyTermsSelect").val();
		//document.aiForm.action = "/aiui/inquiry/term/"+selectedTerm;
		//document.aiForm.submit();
	    $('<form action=\"'+"/aiui/inquiry/term/"+selectedTerm+'\" method=\"post\"></form>').appendTo('body').submit().remove();
	});
	
	//-------------------Create MultiColumn Flyout------------------------------------------//
	createFlyout();
	
	//-------------------Destroy MultiColumn Flyout-----------------------------------------//
	$(document).click(function(){
		destroyFlyout();
    });	
	
	/*//-------------------Create Help Flyout------------------------------------------//
	createHelpFlyout();*/
	
	$(".upgradePackHelpClass").click(function(e){
		  $("#upgradePackHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	$(".standardPackageHelpClass").click(function(e){
		  $("#standardPackageHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	$(".rentersEndorsementHelpClass").click(function(e){
		  $("#rentersEndorsementHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	$(".discountsHelpClass").click(function(e){
		  $("#discountsHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	$(".homeDiscountsHelpClass").click(function(e){
		  $("#homeDiscountsHelpModel").modal('show');
		   e.stopPropagation();
	});
	
	/*//-------------------Destroy Help Flyout-----------------------------------------//
	$(document).click(function(){
		destroyHelpFlyout();
    });	*/
	
    $(document).on("click", "#eserviceLink1", function(){
    	// for TD #71970 change eService dialog to save changes correctly by user 
    	var spanInvalid = $("#emailInvalid");
    	spanInvalid.removeClass("show").addClass("hidden"); 
    	// for TD #71970 change eService dialog to save changes correctly by user 
    	var spanInvalid = $("#emailInvalid");
    	spanInvalid.removeClass("show").addClass("hidden"); 
    	$.blockUI({ message: $('#eserviceLinkModal'), css: { width: '400px' } }); 
    });
    
	//To print
	$("#printThisPage").click(function(){
		window.print();
	});
	
	//Close X icon discounts popup flyout	
    $(document).on("click", "#eserviceCloseBtn", function(){
    	$('#eserviceLinkModal').hide();
    	// for TD #71970 change eService dialog to save changes correctly by user 
    	var emailAddress = $("#previousEserviceEmail").val();
    	document.getElementById('eserviceEmail').value=emailAddress; 
    	var emailAddress = $("#previousEdocEmail").val();
    	document.getElementById('edocEmail').value=emailAddress;  
    	$.unblockUI();
    });
	
    $(document).on("click", "#eserviceCancelBtn", function(){
    	$('#eserviceLinkModal').hide();
    	// for TD #71970 change eService dialog to save changes correctly by user 
    	var emailAddress = $("#previousEserviceEmail").val();
    	document.getElementById('eserviceEmail').value=emailAddress; 
    	var emailAddress = $("#previousEdocEmail").val();
    	document.getElementById('edocEmail').value=emailAddress;  
    	$.unblockUI();
    });
   
    $(document).on("click", "#eserviceSuccessCloseBtn", function(){
    	$.ajax({
			   url: "/aiui/inquiry/cleareeservicemsg",
			   type:'POST',
			   data: {
				   'clearEserviceMsg' : 'Y' 
			   },
			   success: function(data){},
			   error: function(data){}
		});    	
    	$('#eserviceSuccessCloseModal').hide();
    });

    $(document).on("click", "#eserviceFailureCloseBtn", function(){
    	$.ajax({
			   url: "/aiui/inquiry/cleareeservicemsg",
			   type:'POST',
			   data: {
				   'clearEserviceMsg' : 'Y' 
			   },
			   success: function(data){},
			   error: function(data){}
		});    	
    	$('#eserviceFailureCloseModal').hide();
    });
    
    //hide renewal violations
    hideRenewalViolations();
    
    $(document).on("click", "#eserviceSaveBtn", function(event){
    	event.preventDefault();
    	var eServicevalid = true;    	
    	var isEserviceDisabled = $("#eserviceEmail").is(':disabled');
        if (!isEserviceDisabled) {
        	eServicevalid = validateEserviceEmail(document.getElementById('eserviceEmail')); 
        }    	
      
    	var eDocEmailValid = true;    	
    	var isEdocDisabled = $("#edocEmail").is(':disabled');
        if (!isEdocDisabled) {
        	eDocEmailValid = validateEserviceEmail(document.getElementById('edocEmail'));  
        }
      
    	var spanInvalid = $("#emailInvalid");
    	//var spanEdocInvalid = $("#edocEmailInvalid");   	
    
    		
		if (!eServicevalid && !eDocEmailValid) {
			// for TD #71969 space between eDoc and Email 
			spanInvalid.html("Both eService & eDoc Email were Invalid");
	    	spanInvalid.removeClass("hidden").addClass("show");
	    	
	    	/*spanEdocInvalid.html("eDoc Email Is Invalid");
	    	spanEdocInvalid.removeClass("hidden").addClass("show");*/
		}else if(!eServicevalid){
			spanInvalid.html("eService Email Is Invalid");
	    	spanInvalid.removeClass("hidden").addClass("show");
		}else if (!eDocEmailValid){
			spanInvalid.html("eDoc Email Is Invalid");
			spanInvalid.removeClass("hidden").addClass("show");
		} else {
    		saveEService(event);
    	}
    });
    
    $(document).on("change", "#eserviceEmail", function(){
    	var spanInvalid = $("#emailInvalid");
    	spanInvalid.html("eService Email Is Invalid");
    	spanInvalid.removeClass("show").addClass("hidden");
    	var emailAddress = $(this).val();
    	document.getElementById('eserviceEmail').value=emailAddress;    	
    });
    
    $(document).on("change", "#edocEmail", function(){
    	var spanInvalid = $("#emailInvalid");
    	spanInvalid.html("eDoc Email Is Invalid");
    	spanInvalid.removeClass("show").addClass("hidden");
    	var emailAddress = $(this).val();
    	document.getElementById('edocEmail').value=emailAddress;    	
    });

    $(document).on("change", "#esubscribedFlag", function(){
    	var spanInvalid = $("#emailInvalid");
    	spanInvalid.removeClass("show").addClass("hidden");
    	var isChecked = $(this).is(':checked');
    	document.getElementById('eService.subscribedFlag').value=(isChecked ? 'Y' : 'N');    	
    });
    
    //This is to scroll to page to specified anchor
     var anchorObj = document.getElementById('anchorName');
     if(anchorObj!=null){
    	 location.hash = anchorObj.value;
     }
    
     //This is to call webpayment 
     $("#makePayment,#inquiryPayNow").click(function(event) {
    	 blockUser();
    	 document.aiForm.action = "/aiui/inquiry/webpay";
    	 document.aiForm.submit();
 	});     
     
 	
     $("#inquiryInsuranceProff").click(function(){
		$("#idCardsPrintDialog").modal('show');
		$('input:radio[name=idReqTypeRadionButton]')[0].checked = true;
		addDropdownCheckListForCol($('#policyTermPOISelect'));
		$('#policyTermPOISelect_chosen').addClass('chosenDropDownHidden');
	 });
     
     $("#submitPoIRequest").click(function(){
    	submitPoIRequest(); 
     });
     
     //Keep it until claims Talk project goes live
    //Claims Email actions
     
	 // Removed as part of ClaimsTalk Integration ( NMC-16-0016)
     $(document).on("click", ".clsClaimsEmailLink", function(){
    	 $('#claimEmail').removeClass("hidden");
     });
     
     $('.cancelClaimEmail').click(function(){
    	 $('#claimEmail').addClass("hidden");
 	 });
     
     $(document).on("click", "#sendClaimEmail", function(){
		if(validateClaimEmail()){
			sendClaimEmail();
		}
	});
	
	 
	 
    //vmaddiwar adding chosen for coverages only because thats excluded from common.js
    //TODO need to check if this exclude for coverages can be removed from common.js
    //After remove exlude from common.js. below code is not required
   var currentTab = $('#currentTab');
   if (currentTab.val() == "coverages") {
   	$('select:not(select[multiple])').each(function(){
			// store original value 
			$(this).data('OriginalValue', $(this).val());
			addChosen(this.id);
		});

   	$('.chosen-search').hide();
	
   }  
  
   if ($('#showIDCardsDialog').val() == 'Y' ) {
	   $("#idCardsPrintDialog").modal('show');
		$('input:radio[name=idReqTypeRadionButton]')[0].checked = true;
		addDropdownCheckListForCol($('#policyTermPOISelect'));
		$('#policyTermPOISelect_chosen').addClass('chosenDropDownHidden');
   }
 
   //Added Fullstory script to customize user session based on policynumber/quotenumber
   FS.setUserVars({
	 "policyNumber_str" : $('#policyNo').val()
	});
   
});

function validateEserviceEmail(eserviceEmail){
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
	var valid = emailRegex.test(eserviceEmail.value);
	if (!valid){
		return false;
	}else{
		return true;
	}
}

//  Function to invoke API to send email to associated adjuster via ClaimsTalk.
function sendAdjusterEmail(claimnumber, coverageId){
		$.ajax({
		url: "/aiui/inquiry/sendAdjusterEmail/"+claimnumber+"/"+ coverageId,
		type:'POST',	
		data:'',
	    beforeSend: function(textStatus, jqXHR){
		   blockUser();
	    },
	
		success: function(response, textStatus, jqXHR){
			var status = response.status;
        	if(status =='success'){
				//change modal text and add button
				var msg = " Redirecting to URL " + response	
				console.log (msg);
				window.open(response.redirectURL, '_blank');
			}else{
				alert("Failed to get redirect URL ");
			}
					
		},
	
		error: function(jqXHR, textStatus, errorThrown){	
			alert("Failed to get redirect URL ");
		},
		
		complete: function(){
			$.unblockUI();
		}

	});
	}
	
//  Function to invoke API to send email to total adjuster via ClaimsTalk.
function sendTotalLossAdjusterEmail(claimnumber){
		$.ajax({
		url: "/aiui/inquiry/sendTotalLossAdjusterEmail/"+claimnumber,
		type:'POST',	
		data:'',
	    beforeSend: function(textStatus, jqXHR){
		   blockUser();
	    },
	
		success: function(response, textStatus, jqXHR){
			var status = response.status;
        	if(status =='success'){
				//change modal text and add button
				var msg = " Redirecting to URL " + response	
				console.log (msg);
				window.open(response.redirectURL, '_blank');
			}else{
				alert("Failed to get redirect URL ");
			}
					
		},
	
		error: function(jqXHR, textStatus, errorThrown){	
			alert("Failed to get redirect URL ");
		},
		
		complete: function(){
			$.unblockUI();
		}
	});
	}

	
var tabIndex = 1;
var maxItemsAllow;
var ITEMS_PER_PAGE = 3;

function updateItemScrollPanel() {

	var firstItem = parseInt($('#firstItem').val());
	var itemRange = 'Item ' + firstItem;
	var itemCount = parseInt($('#itemCount').val());
	var lastItem = Math.min(itemCount,
			(firstItem + (ITEMS_PER_PAGE - 1)));

	showOrHideHtml('#scrollPanel', 'hide');

	if (lastItem > 1) {
		var itemType = $('.content').attr('id');
		var displayItem;
		switch(itemType){
			case "vehicleWrapper":
				displayItem = "Vehicles";
				break;
			case "driverWrapper":
				displayItem = "Drivers";
				break;
			case "coverageWrapper":
				displayItem = "Vehicles";
				break;		
		}
		itemRange = 'Viewing '+ displayItem + ' '  + firstItem + ' - ' + lastItem;
	}

	if (itemCount > ITEMS_PER_PAGE) {
		showOrHideHtml('#scrollPanel', 'show');
		$('#scrollPos').html(itemRange + ' of ' + itemCount);
	}
}

function slideItemStart(event) {

	slideToStart(event, $('.slidingFrame'), $('#firstItem'));
	updateItemScrollPanel();
}

function slideItemLeft(event) {

	slideTableLeft(event, $('.slidingFrame'), $('.slidingTable'),
			$('#firstItem'), parseInt($('#itemCount').val()), 1);
	updateItemScrollPanel();
}

function slideItemRight(event) {

	slideTableRight(event, $('.slidingFrame'), $('.slidingTable'),
			$('#firstItem'), parseInt($('#itemCount').val()),
			ITEMS_PER_PAGE, 1);
	updateItemScrollPanel();
}

function slideItemEnd(event) {

	slideToEnd(event, $('.slidingFrame'), $('.slidingTable'),
			$('#firstItem'), $('#itemCount'), ITEMS_PER_PAGE);
	updateItemScrollPanel();
}


function clearForm() {
	document.aiForm.name.value = '';
	document.aiForm.policyKey.value = '';
}

function showOrHideHtml(strElm, strVal) {
	if (strVal == 'show') {
		$(strElm).css('display', 'block');
	} else {
		$(strElm).css('display', 'none');
	}
}


/*function handleSubmit(e) {
	//enableFields();	
	//setItemsSeqNums();

	//prevent page submision for ie browsers
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}*/

/*-----------------------Flyout Popup for multi column Related Start ----------------------------*/

function createFlyout() {
	$('.flyoutClass').click(function(){
		var currentElement = $(this).attr("id");		
		showFlyout(currentElement);
	});
}

function showFlyout(currentElementId) {	
	var index = currentElementId.substring(currentElementId.length, currentElementId.length-1)
	var currentInfo = currentElementId.substring(0,currentElementId.length-1) + "Info" + index;
	var	popupHTML = $("#"+currentInfo).html();
	var pop = $("#"+currentElementId).richPopover({
			placement: 'right',
			html: true,
		    content: popupHTML
		 });
	pop.richPopover('show');
}

function destroyFlyout(){	
	$('.flyoutClass').each( function () {
		var popoverData = $(this).data('richPopover');
		if (popoverData != undefined) {
			if (popoverData.closeOnClick) {
				$(this).richPopover('destroy');
			}
			popoverData.closeOnClick = true;
		}
	});
}
/*-----------------------Flyout Popup for multi column Related End ------------------------------*/
	
function saveEService(event){	
	var subscribed = $("input[name='eService.subscribedFlag']").val();	
	var email = $("#eserviceEmail").val();
	var eDocEmail = $("#edocEmail").val();
	var previousEserviceEmail = $("#previousEserviceEmail").val();
	var previousEdocEmail = $("#previousEdocEmail").val();
	var previousSubscribedFlag = $("#previousSubscribedFlag").val();
	if (subscribed==previousSubscribedFlag && email == previousEserviceEmail && eDocEmail == previousEdocEmail) {
		//no changes were made
        var spanInvalid = $("#emailInvalid");
        spanInvalid.html("Please enter desired changes.");
	    spanInvalid.removeClass("hidden").addClass("show");
	    
		return;
	}
	var d = {
		      'eService.eserviceEmailAddress': $("#eserviceEmail").val(),
		      'eService.edocEmailAddress': $("#edocEmail").val(),
		      'eService.custId': $("input[name='eService.custId']").val(),
		      'eService.policyNumber': $("input[name='eService.policyNumber']").val(),		     
		      'eService.subscribedFlag': $("input[name='eService.subscribedFlag']").val(),
		      'eService.eServiceEmailChanged': (email != previousEserviceEmail) ? true : false,
			  'eService.eDocEmailChanged': (eDocEmail != previousEdocEmail) ? true : false,
			  'eService.eDocSubscribeChanged': (subscribed != previousSubscribedFlag) ? true : false,
		      'FORM_CSRF_TOKEN': $("input[name='FORM_CSRF_TOKEN']").val()};
		 
				$.ajax({
					   url: "/aiui/inquiry/validateeservice",
					   type:'POST',
					   data: d,
					   success: function(data){
						  var spanInvalid = $("#emailInvalid");
						  if(data == false) {
							  spanInvalid.html("The Email address entered for eService is already in use; please enter a different Email address.");
						      spanInvalid.removeClass("hidden").addClass("show");				  
						  } else {
							  spanInvalid.removeClass("show").addClass("hidden");
								$.ajax({
									   url: "/aiui/inquiry/saveeservice",
									   type:'POST',
									   data: d,
									   success: function(data){
											location.reload();
										},
										error: function(data){
											location.reload();
										}
								});
						  }
						},
					
						error: function(data){
							var spanInvalid = $("#emailInvalid");
						    spanInvalid.html("eServices are currently unavailable. Please try again later.  If the problem persists, please call Customer Care.");
							spanInvalid.removeClass("hidden").addClass("show");				  
						}
					});
				
	   
}



/*-----------------------Flyout Popup for Help Start ----------------------------*/

function createHelpFlyout() {
	$('.helpFlyoutClass').click(function(){
		var currentElement = $(this).attr("id");
		showHelpFlyout(currentElement);
	});
}

function showHelpFlyout(currentElementId) {	
	var currentInfo = currentElementId.substring(0,currentElementId.length) + "Info";
	var	popupHTML = $("#"+currentInfo).html();
	var pop = $("#"+currentElementId).richPopover({
			placement: 'right',
			html: true,
		    content: popupHTML
		 });
	pop.richPopover('show');
}

function destroyHelpFlyout(){	
	$('.helpFlyoutClass').each( function () {
		var popoverData = $(this).data('richPopover');
		if (popoverData != undefined) {
			if (popoverData.closeOnClick) {
				$(this).richPopover('destroy');
			}
			popoverData.closeOnClick = true;
		}
	});
}
/*-----------------------Flyout Popup for Help End ------------------------------*/

function submitEndorsementAction(dataSource, policyKey, policyNumber, 
        policyStatus, term, company, lob, effectiveDate, expirationDate, state) {
    
	if(dataSource == 'PRIME') {
    	showEndorsementLandingBubble(policyNumber, term, company, state);
        return;
    }
	
	/* For TD 72533 to display user friendiendly message when Endorsement not available */
	if(dataSource == 'LEGACY' && state == 'NJ' && lob == 'HO'){
			$("#endorseError").modal('show');	
		return;
	}
    
	/* For TD 72533 to display user friendiendly message when Endorsement not available */
	if(dataSource == 'LEGACY' && state == 'NJ' && lob == 'HO'){
			$("#endorseError").modal('show');	
		return;
	}
    
	var url = document.actionForm.legacyEndorsementURL.value;
    
    if(url != '') {
        showLoadingMsg();
        document.actionForm.userAction.value = 'Endorsement';
        document.actionForm.policyKey.value = policyKey;
        document.actionForm.policyNumber.value = policyNumber;
        document.actionForm.policyStatus.value = encodeURI(policyStatus);
        document.actionForm.term.value = term;
        document.actionForm.company.value = company;
        document.actionForm.lob.value = lob;
        document.actionForm.fromDate.value = effectiveDate;
        document.actionForm.toDate.value = expirationDate;
        document.actionForm.state.value = state;
        document.actionForm.action = url;
        document.actionForm.requestSource.value = "Inquiry";
        document.actionForm.method="POST";
        document.actionForm.submit();
    }
}


function retrieveClaimDetails(claimNumber){
	blockUser();
	document.aiForm.action = "/aiui/inquiry/claimNumber/"+claimNumber;
	document.aiForm.submit();
}


//Keep it until claims Talk project goes live
// Removed as part of ClaimsTalk Integration ( NMC-16-0016)
function validateClaimEmail(){
	var msg = "";

	// from address
	var fromEmailAddress = $('input[id="claimFromEmail"]').val();
	if(fromEmailAddress == "" || !isValidFieldEmail(fromEmailAddress)){
		msg = msg + "Please enter a valid from address\n";
	}
	
	// to address
	var toEmailAddress = $('input[id="claimToEmail"]').val();
	if(toEmailAddress == "" || !isValidFieldEmail(toEmailAddress)){
		msg = msg + "Please enter a valid to address\n";
	}
	
	if((fromEmailAddress != "") && (fromEmailAddress == toEmailAddress)){
		msg = msg + "From Address and To Address cannot be the same\n";
	}
	
	// cc address
	var ccEmailAddress = $('input[id="claimCCEmail"]').val();
	if(ccEmailAddress != "" && !isValidFieldEmail(ccEmailAddress)){
		msg = msg + "Please enter a valid cc address\n";
	}
	
	// subject
	var subject = $('input[id="claimSubject"]').val();
	if(subject == ""){
		msg = msg + "Please enter an email subject\n";
	}	

	if(msg != ""){
		alert(msg);
		return false;
	} else {
		return true;
	}
}

//Keep it until claims Talk project goes live
function sendClaimEmail(){

	var fromEmailAddress = $('input[id="claimFromEmail"]').val();
	var toEmailAddress = $('input[id="claimToEmail"]').val();
	var ccEmailAddress = $('input[id="claimCCEmail"]').val();
	var emailSubject = $('input[id="claimSubject"]').val();	
	var emailBody = $('#claimMessageBody').val();		
	
	
	var mesgData = "<email><fromAddress>"+ fromEmailAddress +"</fromAddress><replyTo>"+ toEmailAddress +"</replyTo><ccAddress>"+ ccEmailAddress + "</ccAddress><firstname/><lastname/><subject>"+emailSubject +"</subject><body>"+ emailBody+"</body></email>";
	mesgData = encodeURI(mesgData);
	
	// function sends esignature email
	$.ajax({
		
		url: "/aiui/inquiry/sendClaimEmail",
		type:'POST',	
		data:mesgData,
	    beforeSend: function(textStatus, jqXHR){
		   blockUser();
	    },
	
		success: function(response, textStatus, jqXHR){
			
			if(response=='success'){
				//change modal text and add button
				var msg = "Email sent successfully.";
				$('#sendClaimEmailMsg').html(msg);		
			}else{
				alert("Failed to send email");
			}
					
		},
	
		error: function(jqXHR, textStatus, errorThrown){	
			alert("Failed to send email");
		},
		
		complete: function(){
			$.unblockUI();
		}

	});
}


function submitPoIRequest(){
	var policyNumber = $('input[id="policyNo"]').val();
	var selectedTerms = $('#policyTermPOISelect').val(); 
	var reqType = $('input[id=tempPoIReqId]:checked').val();
	var strUrl;

	$("#idCardsPrintDialog").hide();
	if (reqType == undefined ) {
		requestPermIDCards(policyNumber,selectedTerms)
	} else {
		strUrl = "/aiui/idcard/requestTempIdCards";
		if(selectedTerms != undefined && selectedTerms != "" && selectedTerms != null) {
			var termArray =  selectedTerms.toString().split(",");
			 $(termArray).each(function(index,value) {
				 var target = 'IDCard_' +index;
				 var idCardWindow = window.open('', target);
				 if(idCardWindow != null) {
					 idCardWindow.close();
					 idCardWindow = window.open('', target);
				 }
				 var inputs = '<input type="hidden" name="policyNumber" value="'+ policyNumber +'" /><input type="hidden" name="term" value="'+ value +'" />'; 
				 $('<form action="'+ '/aiui/idcard/requestTempIdCards' +'" method="post" target="'+ target+'" >'+inputs+'</form>').appendTo('body').submit().remove();
			 });
		}
		
		$('#infoReqPoIDlg').modal('show');
	}
}

function requestPermIDCards(policyNumber,selectedTerms) {

	$.ajax({
		url: "/aiui/idcard/requestPermIdCard",
		type:'POST',
		data:{
		      'policyNumber': policyNumber,
		      'terms': selectedTerms.toString(),
		      'FORM_CSRF_TOKEN': $("input[name='FORM_CSRF_TOKEN']").val()
		},

		beforeSend: function(textStatus, jqXHR){
			blockUser();
		},

		success: function(response, textStatus, jqXHR){
			if(response.messageCode=='SUCCESS'){
				$('#infoReqPoIDlg').modal('show');
			}else{
				$('#errorReqPoIDlg').modal('show');	
			}
		},

		error: function(jqXHR, textStatus, errorThrown){	
			$('#errorReqPoIDlg').modal('show');	
		},

		complete: function(){
			$.unblockUI();
		}

	});
}