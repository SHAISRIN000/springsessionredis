/* js functionality for links in footer and top nav bar - except for Advanced Search dialog - that is in globalSearch.js - JG */
jQuery(document).ready(function() {
	
	// create nav menus
	createPopover('.profileMenu', showProfileMenuPopover);
	createPopover('.hiUserMenu', showHiUserPopover);
	createPopover('.contactUsMenu', showContactUsPopover);
	createPopover('.myViewMenu', showMyViewPopover);
	
	// quick links menu
	$(document).on("click", ".quickLinksMenu", function(e){
		$('.popover').hide();
		showQuickLinksPopover();
		e.stopPropagation();
	});
	
	$(document).click(function(){
		destroyPopover('.agencyInfoArrow');
		destroyPopover('.contactUsLink');
		destroyPopover('.hiUserLink');
	
		// quick links menu
		var popoverData = $('.quickLinksArrow').data('richPopover');
		if (popoverData != undefined) {
			// see if calendar icon is selected, if so, do not close quick links popover
			if(!$(".linkDate").datepicker( "widget" ).is(":visible")){
				$('.quickLinksArrow').richPopover('destroy');
				popoverData.closeOnClick = true;
			}
		}
    });
	
	//51417 - My View pop over needs two clicks to open in certain cases
	$('#landingContent').click(function(){
		destroyPopover('.myView');
	});
	
	// nav menus - hover effect
	$(document).on("mouseover", "li.menuItem", function(){
		var item = this;
		var link = $(item).find("div.footerLink a.expandLink");
		if(!$(link).hasClass('linkSelected')){
			$(item).addClass('menuHover');
		}
		
		// My Quotes
		var myQuoteTxt = $(item).find('.statusDateMyQuote');
		if(myQuoteTxt){
			$(myQuoteTxt).addClass('hoverText');
		}
	});
	
	$(document).on("mouseout", "li.menuItem", function(){
		var item = this;
		$(item).removeClass('menuHover');
		
		// My Quotes
		var myQuoteTxt = $(item).find('.statusDateMyQuote');
		if(myQuoteTxt){
			$(myQuoteTxt).removeClass('hoverText');
		}
	});
	
	// Agency Profile - Agents
	$(document).on("click", "ul#profileList li.menuItem", function(){
		var profileIndex = parseInt(this.id.substring(this.id.lastIndexOf("_") + 1));
		var profileValues = $('#profileId_' + profileIndex).val().split(",");
		ghFunctn = partial(selectUserProfile, profileValues[0], profileValues[1]);
		showExitPrompt(ghFunctn, true, profileValues[1]);
	});
	
	// Hi User Menu links
	$(document).on("click", "ul#menuItems li.menuItem", function(){
		var id = this.id;
        if (id.toUpperCase() == "BANKACCOUNTPREFERENCES"){
        	redirectToLegacyPage(LinksEnum.BANKACCOUNTPREFERNCES);
		}else if(id.toUpperCase() != "AGENCYPROFILE"){
			ghFunctn = partial(submitMenuAction, id);
		    showExitPrompt(ghFunctn, false);
		}else{
			submitMenuAction(id);
		}
	});
	
	// Agency Profile - Employees
	$(document).on("click", ".agencyProfileLink", function(e){
		var txId = this.id;
		if((txId=="txAlertPolicyCancellation")
				||(txId=="txAlertEDocEnroll")
				||(txId=="txAlertESig")
				||(txId=="txAlertAll")){
			displayAgencyProfileDialog('','Transaction Alert');
		}else{
		displayAgencyProfileDialog('','');
		}
		e.stopPropagation();
	});
	
	// My View Edit
	$(document).on("click", ".clsChangeId", function(e){
		showChangeMyViewPage();
		//init My View checkbox values
		initMyViewValues();
		addDropdownCheckList('stateId');
		showHideMultiChosenContainer('stateId', true);
		addDropdownCheckList('channelId');
		showHideMultiChosenContainer('channelId', true);

		//e.stopPropagation();
	});
	
	function showChangeMyViewPage(){		
		$('#changeMyViewModal').modal('show');
		hideMyViewPopover();
	}
	
	//51417 - My View pop over needs two clicks to open in certain cases
	$(document).on('click', ".myViewMenu", function(){
		showMyViewPopover();
	});
	
	// Submit Agency Profile
	$('#submitAgencyProfile').bind("click", function(){
		submitAgencyProfileDialog();
	});
	
	// Clear agency profile link in dialog
	$('#clearAgencyProfile').bind("click", function(){
		$('#agencyProfileDialog').modal('hide');
		ghFunctn = partial(updateEmployeeProfile, 0,0,'','');
	    showExitPrompt(ghFunctn, true, '');
	});
	
	// Transaction Reporting link
	$(document).on("click", "#transactionReporting", function(e){
		redirectToLegacyPage(LinksEnum.TRANSACTIONREPORTING);
	});
	
	// Document Search Link
	$(document).on("click", "#documentSearch", function(e){
		redirectToLegacyPage(LinksEnum.DOCUMENTSEARCH);
	});
	
	// Commission Statements
	$(document).on("click", "#commissionStatements", function(e){
		redirectToLegacyPage(LinksEnum.COMMISSIONSTATEMENTS);
	});
	
	//Agency Reports
	$(document).on("click", "#agencyReports", function(e){
		redirectToAgencyReportsPage(LinksEnum.AGENCYREPORTS);
	});
	
	// Enabling submission of New Quote and Agency Profile with enter key
	$('#branchAP_chosen, #agencyAP_chosen, #producerAP_chosen').keyup(function(e){
	    if(e && e.keyCode == 13) {
	       $('#submitAgencyProfile').click();
	    }
	});
	
    //Quick Quote
	$(document).on("click", "#quickQuote", function(e){
		redirectToESales(LinksEnum.QUICKQUOTE);
	});
	
	// Homeowner Partners
	$(document).on("click", "#homeownerPartners_Go", function(e){
		redirectLinkDDURL("dropdownPartners", "homeownerPartners", e);
	});
	
	// BOP Partners
	$(document).on("click", "#bopPartners_Go", function(e){
		redirectLinkDDURL("dropdownBOPPartners", "bopPartners", e);
	});
	
	// Flood Link
	$(document).on("click", "#flood_Go", function(e){
		redirectLinkDDURL("floodDD", "flood", e);
	});
	
	// Quote Marketplace
	$(document).on("click", "#quoteMarketplace", function(){
		redirectToLegacyPage(LinksEnum.QUOTEMARKETPLACE);
	});
	
	// RMV Access
	$(document).on("click", ".rmvAccess", function(e){
		gotToRMVAccess(e);
	});
	
	// RMV Portal
	$(document).on("click", ".rmvPortal", function(e){
		gotToRMVPortal(e);
	});
	
	// Replacement Cost Calculator
	$(document).on("click", "#replacementCostCalculator", function(){
		redirectToLegacyPage(LinksEnum.REPLACEMENTCOSTCALCULATOR);
	});
	
	// when user scrolls, will close flyouts automatically
	$(window).on('scroll',closeFlyouts);
	
});

/* Quick Links */
function showQuickLinksPopover() {
	
	$('#quickLinksContent').find('select').each(function () {	
		 $(this).chosen('destroy');
	});
	
	var popupHTML = $('#quickLinksContent').html();
	popupHTML = popupHTML.replace('claimInquiryQL_effDateFromXX','claimInquiryQL_effDateFrom');
	popupHTML = popupHTML.replace('claimInquiryQL_effDateToXX','claimInquiryQL_effDateTo');
	popupHTML = popupHTML.replace('reviewPaymentsQL_fromDateXX','reviewPaymentsQL_fromDate');
	popupHTML = popupHTML.replace('reviewPaymentsQL_toDateXX','reviewPaymentsQL_toDate');
	var pop = $('.quickLinksArrow').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML,
		    postShowCall: function() {
		    	configureQuickLinks(this);		    	
		    }
		 });
	pop.richPopover('show');
	
	$('.popover-content').find('select').each(function () {
	    
		$(this).next().remove();
		addChosen($(this).attr("id") , $('.popover-content') );
	
	});
		
}

function configureQuickLinks(linkParent) {
	$('.popover-content', linkParent.$tip).each(function() {
		configureLinks(this);
	});
}

function applyChosenLinkDD(selectId, errId){
	addChosen(selectId);
	var chosenContainer = $("div#" + selectId + "_chosen");
	chosenContainer.addClass('linksSelect');
	// remove error message and inline error if needed
	$('#' + errId + "ErrorMsg").addClass('hidden');
	$('#' + selectId).removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
}

function configureLinks(linkParent) {
	$('.expandLink', linkParent).click(function(){
		var item = this;
		
		// Homeowner Partners drop down
		if(item.id == LinksEnum.HOMEOWNERPARTNERS){
			applyChosenLinkDD("dropdownPartners", "homeownerPartners");
		}
		
		// BOP Partners drop down
		if(item.id == LinksEnum.BOPPARTNERS){
			applyChosenLinkDD("dropdownBOPPartners", "bopPartners");
		}
		
		// Flood Partners drop down
		if(item.id == LinksEnum.FLOOD){
			var selectId = "floodDD";
			if($("#" + selectId).length > 0){
				applyChosenLinkDD(selectId, "flood");
			}
		}
		
		if($(item).hasClass("menuItem")){
			$(item).removeClass('menuHover');
			var link = $(item).find("div.footerLink a.expandLink");
			if(!$(link).hasClass('linkSelected')){
				selectLink(link);
			}
		}else{
			var menuItem = $(item).parent().parent();
			if($(menuItem).hasClass("menuItem")){
				$(menuItem).removeClass('menuHover');
			}
			selectLink(item);
		}
		
	});

    $('.newQuote', linkParent).click(function() {
		var popoverData = $('.quickLinksArrow').data('richPopover');
		if (popoverData != undefined) {
			$('.quickLinksArrow').richPopover('destroy');
		}
		
		displayNewQuoteDialog();
    });
        
	$('.watermark', linkParent).each(function() {
		var $this = $(this);
		$this.val($this.attr('alt'));
		$this.blur(function(){
			var $blurThis = $(this);
	  		if ($blurThis.val().length == 0){
	  			$blurThis.val($blurThis.attr('alt')).addClass('watermark');
			}
	 	});
		$this.focus(function(){
			$('.inlineError', linkParent).removeClass('inlineError');
			$('.link_ErrorRow').remove();
			var $focusThis = $(this);
	  		if ($focusThis.val() == $focusThis.attr('alt')){
	  			$focusThis.val('').removeClass('watermark');
			}
		});
	});
	
	$('.quickLinksForm').off("submit");  // to prevent double form submission in IE 9
    $('.quickLinksForm').on("submit", function(e) {

		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		
		var processIt = true;
		var errorField = '';
		var errorText = '';
		var thisForm = $(this); //.find('.input-append'); //TODO: Check if this works for all situations
		var btnId = $('.linkButton', thisForm).attr('id');
	    var blnShowAlert = false;
	    
	    $.each($('.linkInput,.linkDate'), function() {
	    	var prevValue = $(this).val();
	    	$(this).val($.trim(prevValue));
	    });

	    //Dropdown validations: can be extended if needed.
        thisForm.find('select').each( function() {
        	 
   			if($(this).val() =="") {
   				
   				var errorField = $(this).next();//Actual Div for select dropdown
   				//add redRim style for select Menu
   				$(this).addClass('inlineError').trigger('chosen:styleUpdated');
   				
   				//add ErrorRow
	   			errorText = 'Please make a selection';
	   			var strErrorRow = '<div class="select_ErrorRow inlineErrorMsg">'+errorText+'</div>';
	   			var selectErrorRow = $('.select_ErrorRow' , thisForm);
	   			if(!selectErrorRow.is(":visible")) {
	   				$(strErrorRow).insertAfter(errorField); 
	   			}
	   			
	   			processIt = false;
	   	
   			} else {
   				var errorField = $(this).next();//Actual Div for select dropdown
   				//remove redRim
   				$(this).removeClass('inlineError').trigger('chosen:styleUpdated');

   				//remove error row
   				if(errorField.next().hasClass("inlineErrorMsg")) {
   					errorField.next().remove();
   				}
   			}
			
		});
         
       if(!processIt) 
        	//hardstop: (ex. Operating company needs to be selected)
	       return false;
       else 
          processIt = true;
       
       // All other regular input field checks.
       var enteredLinks = $('.linkInput:not(.watermark)[value!=""]', thisForm);
       var enteredDates = $('.linkDate:not(.watermark)', thisForm);
     
	   if (enteredLinks.length == 0) {
			//var emptyLinks = $('.linkInput:not([value]),.linkInput[value=""]', thisForm); //$('.linkInput[value=""]', thisForm);
			var emptyLinks = $('.linkInput', thisForm);
			
			/* Policy Number and/or claim # not entered */
			if(btnId.toUpperCase() == "CLAIMINQUIRY_GO" || btnId.toUpperCase() == "CLAIMINQUIRYQL_GO"){
				blnShowAlert = true;
				/* check if dates have been entered */
				if (enteredDates.length > 0) {
					errorText = "Policy #, Claim# or Last Name is required";
					errorText = "<img class='linksErrorIcon' id='errorImage' src='" + errorImage + "'>" + errorText;
					
				}else{
					errorText = "Please enter a valid search criteria";
					if(btnId.toUpperCase() == "CLAIMINQUIRYQL_GO"){
						errorText = "<img class='linksErrorIcon' id='errorImage' src='" + errorImage + "' style='margin-bottom: -5px;'>" + errorText;
					}else{
						errorText = "<img class='linksErrorIcon' id='errorImage' src='" + errorImage + "'>" + errorText;
					}
				}
				
	   			emptyLinks.each(function() {
	   				$(this).addClass('inlineError');
				});	
	   			processIt = false;
	   			errorField = emptyLinks.first();
			}else if(btnId.toUpperCase() == "REVIEWPAYMENTS_GO" || btnId.toUpperCase() == "REVIEWPAYMENTSQL_GO"){
				/* check dates  */
				if (enteredDates.length == 0) {
					   blnShowAlert = true;
					   errorText = "Please enter at least one search criteria";
					   errorText = "<img class='linksErrorIcon' id='errorImage' src='" + errorImage + "'>" + errorText;
					   processIt = false;
					   errorField = emptyLinks.first();
				  }else if (enteredDates.length == 1) {
						// if one date was entered, then both dates should be entered.
					    var emptyLinks = $('.linkDate.watermark', thisForm);
						emptyLinks.each(function() {
							$(this).addClass('inlineError');
							processIt = false;
						});				
						errorField = emptyLinks.last();
						errorText = 'Please enter both the From and To dates';
				 }else{
					    /* Dates are entered - check if dates entered are valid */
					    var fdate, tdate;
						enteredDates.each(function() {
				    	   var dtField = this;
				    	   var dateString = $(dtField).val();
				    	   if(this.id.toUpperCase().indexOf("FROM") > 0){
				    			fdate = $(this);
				    		}else{
				    		    tdate = $(this);
				    	   }
				    	   if(!isValidDatDateFormat(dateString)){
				    		   $(dtField).addClass('inlineError');
							   processIt = false;
							   errorText = 'Please enter a valid date';
							   errorField = enteredDates.last();
				    	   }
						});	
						/* check if To date is greater than From Date */
						 if(isDateGreaterThan($(fdate).val(), $(tdate).val())){
							 $(fdate).addClass('inlineError');
							 $(tdate).addClass('inlineError');
							 processIt = false;
							 errorText = 'The To date must be greater than the From date by at least one day';
							 errorField = enteredDates.last();
						}
						
				  }
			 }else{
				emptyLinks.each(function() {
					$(this).addClass('inlineError');
					processIt = false;
				});	
				
				errorField = $(emptyLinks).last();
				errorText = 'Please enter a search criteria';
			}	
		}else{
			/*Policy Number and/or Claim number was entered  - check dates */
			var emptyLinks = $('.linkInput', thisForm);
			if(btnId.toUpperCase() == "REVIEWPAYMENTS_GO" || btnId.toUpperCase() == "REVIEWPAYMENTSQL_GO"
				|| btnId.toUpperCase() == "CLAIMINQUIRY_GO" || btnId.toUpperCase() == "CLAIMINQUIRYQL_GO"){
			   /* check dates  */
			   if (enteredDates.length == 1) {
					// if one date was entered, then both dates should be entered.
				    var emptyLinks = $('.linkDate.watermark', thisForm);
					emptyLinks.each(function() {
						$(this).addClass('inlineError');
						processIt = false;
					});				
					errorField = emptyLinks.last();
					errorText = 'Please enter both the From and To dates';
				}else if (enteredDates.length == 2) {
					 /* Dates are entered - check if dates entered are valid */
					 var fdate, tdate;
					 enteredDates.each(function() {
				    	   var dtField = this;
				    	   var dateString = $(dtField).val();
				    	   var currentDate = getFormattedDate(new Date());
				    	   if(this.id.toUpperCase().indexOf("FROM") > 0){
				    			fdate = $(this);
				    		}else{
				    		    tdate = $(this);
				    		}
				    	   if(!isValidDatDateFormat(dateString)
				    	    || ((btnId.toUpperCase() == "CLAIMINQUIRY_GO" || btnId.toUpperCase() == "CLAIMINQUIRYQL_GO")
				    	     && (isDateGreaterThan(dateString, currentDate)))) {
				    	    	 $(dtField).addClass('inlineError');
								 processIt = false;
								 errorText = 'Please enter a valid date';
								 errorField = enteredDates.last();
				    	    }
					 });
					 
					 /* check if To date is greater than From Date */
					 if(isDateGreaterThan($(fdate).val(), $(tdate).val())){
						 $(fdate).addClass('inlineError');
						 $(tdate).addClass('inlineError');
						 processIt = false;
						 errorText = 'The To date must be greater than the From date by at least one day';
						 errorField = enteredDates.last();
					 }
				}
			}
		}
		
		if (processIt) {
			var linkId = $('.linkButton', thisForm).attr('id');
			var action = linkId.substring(0, linkId.length - 3);
			$('#linkId').val(action);
			
			// submit quick link search
			var searchStr = $.trim(enteredLinks.val());
			
			$("form#aiForm").submit(function (e) {
				//prevent default form from submitting - this is for footer links
				e.preventDefault(); 
		     });
			
			$(".popover").hide();
			submitQuickLinksSearch(searchStr, action);
			
		} else {
			var strErrorRow = '<div class="link_ErrorRow inlineErrorMsg">'+errorText+'</div>';
			var errorParent = errorField.parent();
			var linkErrorRow = $('.link_ErrorRow');
	
			if(!linkErrorRow.is(":visible")) {
				if(blnShowAlert){
					$(strErrorRow).css('width', errorParent.css('width')).insertBefore(errorParent);  // msg first
				}else{
					$(strErrorRow).css('width', errorParent.css('width')).insertAfter(errorParent);  //msg below
				}
			}
	
			return false;
		}
		
	});
	
	// date fields
	$('.linkDate', linkParent).datepicker({
		showOn: "button",
		buttonImage: "/aiui/resources/images/cal_icon.png",
		buttonImageOnly: true,
		buttonText: 'Open calendar',
		onSelect: function(){
			$(this).removeClass('inlineError').removeClass('watermark');
			$('.link_ErrorRow').remove();
		}
	});
	
	// add class to calendar icon for display purposes
    $('.ui-datepicker-trigger', linkParent).addClass("calIconLink");
    
    $('.linkDate').each(function(i, elem) {          
      $(elem).keydown(function(event){
            acceptNumericsAndSlashes(this, event);
      });
       $(elem).keyup(function(event){
            autoSlashes(this,event);
      });
    });
    
    // auto correct year format on date fields
	$('.linkDate').bind("blur", function(){
		this.value = autoCorrectDateYear(this.value);
	});
}

function selectLink(link) {
	// Hide any current open link
	$('.expandLink_Fields').addClass('hidden');
	$('.inlineError').removeClass('inlineError');
	$('.link_ErrorRow').remove();
	$('.expandLink').css('font-weight', 'normal').removeClass("linkSelected");
	
	// Open the fields for the selected link
	var $link = $(link);
	var linkId = $(link).attr("id");

	$('.' + linkId + '_Fields', $link.parent().parent()).removeClass('hidden');
	$link.css('font-weight', 'bold').addClass("linkSelected");
	
	//Requirement to add dropdown for selecting operating company
	//We made necessary changes on the server side to push this html snippet.
	var outerDivElement =  $('#managePolicies #reviewPayments_helper_Fields').children(":first");
	
	//We need to move necessary elements inside the form for the correct value to be submitted.
	$('#managePolicies  .reviewPayments_Fields .quickLinksForm').prepend(outerDivElement);
	// This can be either input/select
	elemnt = outerDivElement.children(":nth-child(2)");

	if(elemnt.is('select')){
		//if select, add the dropdown plugin and add class to make this dropdown fit in the footer column.
		elemnt.addClass("opCompanySelect");
		var chosen = addChosen( elemnt.attr("id"), $('#footerSections  .reviewPayments_Fields .quickLinksForm')) ;
	}
}

function hideLink(link) {
	// hide the fields for the selected link
	var $link = $(link);
	var linkId = $(link).attr("id");

	$('.' + linkId + '_Fields', $link.parent().parent()).addClass('hidden');
	$link.css('font-weight', 'normal').removeClass("linkSelected");
}

/** User Profile Links **/
function showProfileMenuPopover() {
	var profileMenuHTML = $('#profileMenuContent').html();
	var pop = $('.agencyInfoArrow').richPopover({
			placement: 'bottom',
			html: true,
		    content: profileMenuHTML,
		 });
	
	pop.richPopover('show');
}

function selectUserProfile(newProfileId,companyCode) {
	var currentProfile = $('#currentProfile').val();
	var currentProfileCompanyCode = $('#currentProfileCompanyCode').val();
	if (currentProfile != newProfileId ||
			(currentProfile == newProfileId && companyCode != currentProfileCompanyCode) ) {
		updateCurrentProfile(newProfileId,companyCode);
	}
}

function updateCurrentProfile(newProfileId,companyCode) {
	var strURL = "/aiui/user/currentProfile";
	strURL = addRequestParam(strURL, "newProfileId", newProfileId);
	strURL = addRequestParam(strURL, "companyCode", companyCode);
	
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.actionForm.action =  strURL;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

/* Agency Profile Employee Dialog */
function populateAgencyProfileDD(select, newSelectId, mapPath){
	var strURL = "/aiui/landing/" + mapPath;
	var id = $(select).val();
	var agencyId, displayName, companyCorpId, web;

	if(mapPath == "getAgencies"){
		var values = id.split(",");
		id = values[0]; // branch id
		companyCorpId = values[1]; // company corp id
		$('#branchIdAP').val(id);
		$('#companyCorpIdAP').val(companyCorpId); // set hidden fields
	}else{
		companyCorpId = $('#companyCorpIdAP').val();
	}
	
	// get operating company
	web = $('#opCompanyAP_hidden').val();
	if(web == ""){
		web = $('#opCompanyAP').val();
	}
	
	
	// clear out target dropdown
	$("#" + newSelectId).html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	
	// if branch is selected, make sure producer dropdown is cleared
	if(newSelectId == "branchAP"){
		$('#agencyAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
		$('#producerAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	}else if(newSelectId == "agencyAP"){
		$('#producerAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	}
	
	if(mapPath == "getBranches"){
		strURL = addRequestParam(strURL, "web", id);
	}else if(mapPath == "getAgencies"){
		strURL = addRequestParam(strURL, "agencyHierarchyId", id);
		strURL = addRequestParam(strURL, "web", web);
		strURL = addRequestParam(strURL, "isNewBusiness", "false");
	}else{
		strURL = addRequestParam(strURL, "agencyHierarchyId", id);
		strURL = addRequestParam(strURL, "web", web);
		strURL = addRequestParam(strURL, "productCd", "ALN_PA");
		strURL = addRequestParam(strURL, "policyEffDate", "");
		strURL = addRequestParam(strURL, "isNewBusiness", "false");
	}
	
	// ajax call
	$.ajax({
		url: strURL,
		type: 'get',
		dataType: 'json',
		cache: false, 
		
		beforeSend:function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(data){
			if(data.length > 0){
				$.each(data, function(i) {
		        	// populate dropdown values - check for agency or producer
					if(mapPath == "getBranches"){
		        		agencyId = data[i].branchId + ',' + data[i].companyCorporationId;
		        		displayName = data[i].name;
		        	}
					else if(mapPath == "getProducers"){
		        		agencyId = data[i].producerId;
		        		displayName = data[i].producerWebDisplayName;
		        	}else{
		        		agencyId = data[i].agencyHierarchyId;
		        		displayName = data[i].name;
		        	}
		        	
		        	var ddOption = '<option value="' + agencyId + '">' + displayName + '</option>';
		        	$("#" + newSelectId).append(ddOption);
		        });
			}
	        $("#" + newSelectId).trigger('chosen:updated');
		},

		error: function(xhr, status, error){
			//alert(error);
		},
		
		complete: function(){
			$.unblockUI();
		}
	});
}

function displayAgencyProfileDialog(action, msg){
	$('.popover').hide();
	
	// clear dropdown options
	$('#branchAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	$('#agencyAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	$('#producerAP').html("").append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	/*$('#branchAP').empty().append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	$('#agencyAP').empty().append($("<option value=''>--Select--</option>")).trigger('chosen:updated');
	$('#producerAP').empty().append($("<option value=''>--Select--</option>")).trigger('chosen:updated');*/
	
	clearModalErrors('agencyProfileForm', true);
	
	// show message if user is trying to access TR or Doc Search and not logged in
	if(msg != ""){
		var msg = "You must be signed in as an agent to access " + msg + ".<br/>" +
					"<span style='margin-left:25px;'>Please modify your user account in Agency Profile.</span>";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
		$(".errorAlertMsg").html(msg);
		$(".errorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");	
		$('#agencyProfileForm input[id="redirectToPage"]').val(action);
	}else{
		$('#agencyProfileForm input[id="redirectToPage"]').val("");
	}
	
	// see if one operating company, if so populate behind the scenes
	var opCompanyHidden = $('#opCompanyAP_hidden');
	if($(opCompanyHidden).val() != ""){
		populateAgencyProfileDD(opCompanyHidden,'branchAP','getBranches');
	}

	$('#agencyProfileDialog').modal('show');
}

function notValidFunctionForCompany(opCompany,action){
	var branchText = $('#agencyProfileForm select[id="branchAP"] option:selected').text();
	var branchLvlCodes = branchText.split('|');
	var branchLvlCode = branchLvlCodes[0].trim().toUpperCase();
	
	if(opCompany != "PA" 
	  && (action == LinksEnum.COMMISSIONSTATEMENTS || action == LinksEnum.BOPPARTNERS)){
		return true;
	}else if(opCompany == "HP"){
		if(action == LinksEnum.DOCUMENTSEARCH
		  || action == LinksEnum.HOMEOWNERPARTNERS
	      || action == LinksEnum.BANKACCOUNTPREFERNCES){
			return true;
		}else if(action == LinksEnum.QUICKQUOTE && !isValidQQAgency(branchLvlCode)){
			//Quick Quote is only for HP and Direct/Retail
			return true; 
		}
	}else if(opCompany != "HP" && action == LinksEnum.QUICKQUOTE){
		//Quick Quote is only for HP and Direct
		return true;
	}
	return false;
}

function isValidQQAgency(branchLvlCode){
	// console.log(' branchLvlCode = '+branchLvlCode);
	if(branchLvlCode === 'DIRECT' || branchLvlCode === 'RETAIL'){
		return true;
	}
	return false;
} 


function submitAgencyProfileDialog(){
	var newProfile, web;
	var msg = "";
	var opCompanyHidden = $('#agencyProfileForm input[id="opCompanyAP_hidden"]').val();
	var opCompany = $('#agencyProfileForm select[id="opCompanyAP"]');
	var companyCode = $(opCompany).val();
	var branch = $('#agencyProfileForm select[id="branchAP"]');
	var companyCorpId = $('#agencyProfileForm input[id="companyCorpIdAP"]').val();
	var agency = $('#agencyProfileForm select[id="agencyAP"]');
	var producerId = $('#agencyProfileForm select[id="producerAP"]').val();
	var redirectToPage = $('#agencyProfileForm input[id="redirectToPage"]').val();
	
	clearModalErrors('agencyProfileForm', false);
	
	// check validation
	if(notValidFunctionForCompany($(opCompany).val() || opCompanyHidden, redirectToPage)){
		msg = "Agency profile selected is not authorized for this function" + msg + ".<br/>" +
		"<span style='margin-left:25px;'>Please modify your user account in Agency Profile.</span>";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
		$(".errorAlertMsg").html(msg);
		$(".errorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");	
		return false;
	}
	
	if(opCompanyHidden != ""){
		web = opCompanyHidden;
	}
	else{
		web = $(opCompany).val();
		msg = msg + requiredNQValue(opCompany,"APOpCompanyCol");
		if(msg!=""){
			$(opCompany).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
	}
	
	msg = msg + requiredNQValue(branch,"APBranchCol");
	if(msg!=""){
		$(branch).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	msg = msg + requiredNQValue(agency,"APAgencyCol");
	if(msg!=""){
		$(agency).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	if(msg != ""){
		return false;
	}
	else {
	    // update profile
		if(producerId != "") {
			newProfile = producerId;
		}else{
			newProfile = $(agency).val();
		}
		
		// close modal window
		$('#agencyProfileDialog').modal('hide');
		
		// prompt user if needed
		ghFunctn = partial(updateEmployeeProfile, newProfile, companyCorpId, web, redirectToPage);
	    showExitPrompt(ghFunctn, true, companyCode);
	}
}

function updateEmployeeProfile(newProfile, companyCorpId, web, redirectToPage) {
	var strURL = "/aiui/user/updateEmployeeProfile";
	strURL = addRequestParam(strURL, "agencyHierId", newProfile);
	strURL = addRequestParam(strURL, "companyCorpId", companyCorpId);
	strURL = addRequestParam(strURL, "web", web);
	strURL = addRequestParam(strURL, "redirectToPage", redirectToPage);
	
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.actionForm.action =  strURL;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

/* Hi User Menu */
function showHiUserPopover() {
	var popupHTML = $('#hiUserLinks').html();
	var pop = $('.hiUserLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function submitMenuAction(id){
	var url, userAction;
  switch (id.toUpperCase()) {
		case "COVERAGEPREFERENCES":  
			url = document.actionForm.preferencesURL.value;
			userAction = "";
			break;
		case "AGENCYPROFILE":  
			url = "";
			userAction = "";
			break;
			return;
		case "MANAGEUSERS":  
			url = document.actionForm.securityURL.value;
			userAction = "ManageUser";
			break;
		case "MYPROFILE": 
			url = document.actionForm.securityURL.value;
			userAction = "MyProfile";
			break;
		case "MANAGECONTENT": 
			url = '/aiui/contentManagement';
			/*url = '/aiui/manageContent';*/
			userAction = "";			
			break;
		case "TOOLS": 
			url = '/aiui/tools/landing';
			userAction = "";			
			break;	
		case "MESSAGESADMIN":
			url = '/aiui/msg_admin/All';
			userAction = "";
			break;
	}
	
	// submit form
	if(url != ""){
		var event = jQuery.Event(getSubmitEvent());
		$('#actionForm').trigger(event);
		if (event.isPropagationStopped()) { 
			$.unblockUI();
		}else{
			showLoadingMsg();
			document.actionForm.action = url;
			document.actionForm.userAction.value = userAction;
			document.actionForm.method="POST";
			document.actionForm.submit();
		}
	}
}

/* Contact Us */
function showContactUsPopover() {
	var popupHTML = $('#contactInfo').html();
	var pop = $('.contactUsLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

/* My View */
function showMyViewPopover() {
	var popupHTML = $('#myViewId').html();
	var pop = $('.myView').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function hideMyViewPopover() {
	var popupHTML = $('#myViewId').html();
	var pop = $('.myView').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

/* Quick Links Search functionality */
function submitQuickLinksSearch(srchStr, action){
	
	if(QuickLinksActionsEnum.hasOwnProperty(action)){
		var inqAction = QuickLinksActionsEnum[action].inqAction;
		var srchType = QuickLinksActionsEnum[action].globalSearchType;
		document.actionForm.quickLinksAction.value = inqAction; 
	
		/* determine quick links action */
		if(action.toUpperCase() == "REVIEWPAYMENTS" || action.toUpperCase() == "REVIEWPAYMENTSQL"){
			storeReviewWebPaySearchCriteria(inqAction, action);
			ghFunctn = partial(submitReviewWebPaySearch, inqAction);
		    showExitPrompt(ghFunctn, false);
		}else if(action.toUpperCase() == "CLAIMINQUIRY" || action.toUpperCase() == "CLAIMINQUIRYQL"){
			ghFunctn = partial(redirectToClaims, srchStr, inqAction, action);
			showExitPrompt(ghFunctn, false);
		}else if(action.toUpperCase() == "SEARCHQUOTE"){
			storeAdvSearchForQuickLinks(inqAction, srchStr);
			ghFunctn = partial(submitGlobalSearch, srchType, srchStr);
		    showExitPrompt(ghFunctn, false);
		}else if(action.toUpperCase() == "ESIGNATURESTATUS"){
			storeAdvSearchForQuickLinks(inqAction, srchStr);
			ghFunctn = partial(submitGlobalSearch, srchType, srchStr);
		    showExitPrompt(ghFunctn, false);
		}else{
			if (QuickLinksActionsEnum[action].completeNum(srchStr)){
				$('#globalSearchInput').val(srchStr);
				if (inqAction.toUpperCase() == "MAKE A PAYMENT") {
					ghFunctn = partial(getPolicyData, srchStr, "quickLink" + inqAction);
				}
				else {
					ghFunctn = partial(getPolicyData, srchStr,  inqAction);
				}
				
			} else{
				storeAdvSearchForQuickLinks(inqAction, srchStr);
				ghFunctn = partial(submitGlobalSearch, srchType, srchStr);
			}
			showExitPrompt(ghFunctn, false);
		}
	
	} else{
		//alert("Quick Links action not set up yet");
		return false;
	}
}

function getPolicyData(policyNumber, action){
	// function gets necessary policy data from policy number
	var currentPage = 1;
	var rows = 100;
	var search = "true";
	var searchIn;
		
	if(action == InquiryActionEnum.ENDORSEMENT){
		searchIn = SearchInEnum.ENDORSEMENT;
	}else{
		searchIn = SearchInEnum.POLICY;
	}
	
	storeAdvSearchForQuickLinks(action, policyNumber);

	// build query string
	var strURL = addRequestParam(getAdvSearchURL(searchIn), "_search", search);
	strURL = addRequestParam(strURL, "rows", rows);
	strURL = addRequestParam(strURL, "page", currentPage);
	strURL = addRequestParam(strURL, "searchIn", searchIn);
	strURL = addRequestParam(strURL, "qnumber", policyNumber);
	strURL = addRequestParam(strURL, "quickLinksAction", action);

	$.ajax({
		url: strURL,
		type: 'get',
		dataType: 'json',
		cache: false, 
		
		beforeSend:function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(data){
			if(data.recordCount == 1){
				if(data.errorCode == 1) {
					submitGlobalSearch(globalSearchType.POLICYCACHE, policyNumber);
				} else {
				// go directly to Inquiry action
				goToPolicyInquiry(data, action);   
				}
			}else{
				submitGlobalSearch(globalSearchType.POLICYCACHE, policyNumber);
			}
		},

		error: function(xhr, status, error){
			// will take to search results where error will display
			submitGlobalSearch(globalSearchType.POLICYCACHE, policyNumber);
		},
		
		complete: function(){
			$.unblockUI();
		}
	});
}

function reportClaim(policyNumber){
	
	if(policyNumber != "" && policyNumber != undefined){
		var url = document.actionForm.eFNOLURL.value;
		var userName = document.actionForm.userFName.value + ' ' + document.actionForm.userLName.value;
		url = url + policyNumber + "/AI";
		url = addRequestParam(url, "userid", document.actionForm.userId.value);
		url = addRequestParam(url, "username", userName);
		window.open(encodeURI(url));
	}
}

function goToPolicyInquiry(data, action) {
	var policyKey, policyStatus, term, company, lob, state;
	var expirationDate,  effectiveDate, policyNumber, dataSource;
	var url = getPolicyURL(action);
	
	if(url != '') {
		var arrRows = data.rows;
		$.each(arrRows, function(i,item) {
			policyKey = item.policyKey;
			policyNumber = item.policyNumber;
			policyStatus = item.policyStatus;
			term = item.term;
			state = item.state;
			company = item.company;
			lob = item.lob;
			effectiveDate = item.effectiveDate;
			expirationDate = item.expirationDate;
			dataSource = item.dataSource;
		});
		
		if(company != "" && company != undefined){
			var policyRecord = {dataSource:dataSource, policyNumber:policyNumber, company:company, lob:lob};
		    if (action == InquiryActionEnum.ENDORSEMENT && isAI2Record(dataSource)){
		    	 // prime endorsement searching
		    	 if(isPrimeMAIPPolicy(policyRecord) && !hasAccessPrimeMAIPEndorsement(policyRecord)){
					 submitGlobalSearch(globalSearchType.ENDORSEMENTCACHE, "0");
				 } else if ((state == 'PA' && lob == 'HO') && !isHomeRentersEndrRollout()){
					    submitGlobalSearch(globalSearchType.ENDORSEMENT, policyNumber);
				 } else{
					submitGlobalSearch(globalSearchType.ENDORSEMENTCACHE, policyNumber);
				 }
		    }else if (action == InquiryActionEnum.REPORTCLAIM){
		    	submitGlobalSearch(globalSearchType.REPORTCLAM, policyNumber);
		    }else if (action == InquiryActionEnum.ENDORSEMENT && 
				(LegacyPolicyNotHaveEndorsements(policyRecord)
				||(isLegacyMAIPPolicy(policyRecord) && !hasAccessLegacyMAIPEndorsement(policyRecord)))){
				    submitGlobalSearch(globalSearchType.ENDORSEMENTCACHE, "0");
			 }else{
				var event = jQuery.Event(getSubmitEvent());
				$('#actionForm').trigger(event);
				if (event.isPropagationStopped()) { 
					$.unblockUI();
				}else{
					showLoadingMsg();
					document.actionForm.userAction.value = decodeURI(action);
					document.actionForm.policyKey.value = policyKey;
					document.actionForm.policyNumber.value = policyNumber;
					document.actionForm.policyStatus.value = encodeURI(policyStatus);
					document.actionForm.term.value = term;
					document.actionForm.company.value = company;
					document.actionForm.lob.value = lob;
					document.actionForm.fromDate.value = effectiveDate;
					document.actionForm.toDate.value = expirationDate;
					document.actionForm.action = url;
					document.actionForm.method="POST";
					document.actionForm.submit();	
				}
		    }
		}
	}
}

/* Claims search functionality */
function redirectToClaims(srchStr, action, qlAction){
	var fieldName, sValue, sWatermark;
	var blnGetClaims = false;
	var currentPage = 1;
	var rows = 100;
	var search = "true";
	var searchIn = getAdvSearchType(action);
	var blnClearSearchStr = true;
	var advSearchKey = searchIn + "_advSearch";
	var dataStorage = {};
	dataStorage = [];
	
	var objLS = {};
	objLS.id = "searchType";
	objLS.value = action;
	dataStorage.push(objLS);
	
	// build query string
	var url = addRequestParam(getAdvSearchURL(searchIn), "_search", search);
	url = addRequestParam(url, "rows", rows);
	url = addRequestParam(url, "page", currentPage);
	url = addRequestParam(url, "searchIn", searchIn);
	
	// loop through fields and collect claim information entered
	$('input[name^="' + qlAction + '"]').each(function() {
		fieldName = $(this).attr("name");
		sValue = $.trim($(this).val());
		sWatermark = $(this).attr("alt");
        
		if(sValue != "" && sValue != sWatermark){
			fieldName = fieldName.substr(fieldName.indexOf("_") + 1, fieldName.length); 	
			
			// store values in advanced search
	      	var objLS = {};
	      	objLS.id = fieldName;
	  		objLS.value = sValue;
	  		dataStorage.push(objLS);
        	
			if(fieldName == "effDateFrom" || fieldName=="effDateTo"){
        		sValue = sValue.replaceAll("/","");
        	}
        	
        	if(fieldName == "claimNumber" && isCompleteClaimNumber(sValue)){
        		blnGetClaims = true;
        	}
            
            if(fieldName=="keyword"){
        	   blnClearSearchStr = false;
        	   if(isCompletePolicyNumber(sValue)){
        		 url = addRequestParam(url, "qnumber", sValue); 
           		 blnGetClaims = true;
        	   }
           }
            
          url = addRequestParam(url, fieldName, sValue);
          $('form[name="actionForm"] input[id="' + fieldName + '"]').val(sValue);
        }
     });  

	if(blnClearSearchStr){
		srchStr = "";
	}
	
	// store advanced search results in storage
	if(browserAcceptLocalStorage()) {
		sessionStorage.setItem(advSearchKey, JSON.stringify(dataStorage));
	}

	if(blnGetClaims){
		getClaimsData(srchStr, action, url);
	}else{
		submitGlobalSearch(globalSearchType.CLAIMS, srchStr);
	}	
}

function getClaimsData(srchStr, action, url){
	
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		cache: false, 
		
		beforeSend:function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(data){
			if(data.recordCount >= 1){
				// go directly to Inquiry action
				goToClaimsInquiry(data, action); 
			}else{
				submitGlobalSearch(globalSearchType.CLAIMSCACHE, srchStr);
			}
		},

		error: function(xhr, status, error){
			// will take to search results where error will display
			submitGlobalSearch(globalSearchType.CLAIMSCACHE, srchStr);
		},
		
		complete: function(){
			$.unblockUI();
		}
	});
}

function goToClaimsInquiry(data, action) {
	var claimNumber, term, policyNumber, state, company;
	var lob, fromDate, toDate;
	var url = getPolicyURL(action);
	
	if(url != '') {
		var arrRows = data.rows;
		
		// will be dependent on response back from claims service
		$.each(arrRows, function(i,item) {
			claimNumber = item.claimNumber;
			term = item.term;
			policyNumber = item.policyNumber;
			state = item.state;
			company = item.company;
			lob = item.lob;
			fromDate = item.effectiveDate;
			toDate = item.expirationDate;
		});
		
		if(company != "" && company != undefined){
			var event = jQuery.Event(getSubmitEvent());
			$('#actionForm').trigger(event);
			if (event.isPropagationStopped()) { 
				$.unblockUI();
			}else{
				showLoadingMsg();
				document.actionForm.userAction.value = decodeURI(action);
				document.actionForm.claimNumber.value = claimNumber; 
				document.actionForm.term.value = term;
				document.actionForm.policyNumber.value = policyNumber;
				document.actionForm.state.value = state;
				document.actionForm.company.value = company;
				document.actionForm.lob.value = lob;
				document.actionForm.fromDate.value = fromDate;
				document.actionForm.toDate.value = toDate; 
				document.actionForm.requestSource.value = "ClaimsSearch";
				document.actionForm.action = url;
				document.actionForm.method="POST";
				document.actionForm.submit();
			}
		}
	}
}

function getPolicyURL(action){
	var url ='';
	
	// will uncomment and modify once endorsements is set up - JG
	/*switch (action) {
		//case InquiryActionEnum.ENDORSEMENT:
			//url = document.actionForm.EndorsementURL.value;
			//break;
		default :
			url = document.actionForm.InquiryURL.value;
			break;
	}
	*/
	
	url = document.actionForm.InquiryURL.value;
	
	return url;
}

function storeReviewWebPaySearchCriteria(action, qlAction){
	var searchIn = getAdvSearchType(action);
	var advSearchKey = searchIn + "_advSearch";
	var dataStorage = {};
	dataStorage = [];
	
	var objLS = {};
	objLS.id = "searchType";
	objLS.value = "Review Payments";
	dataStorage.push(objLS);

	$(':input[name^="' + qlAction + '_"]').each(function() {             
		fieldName = $(this).attr("name");
		sValue = $(this).val();
		sWatermark = $(this).attr("alt");
		
        if(sValue != "" && sValue != sWatermark){
        	fieldName = fieldName.substr(fieldName.indexOf("_") + 1, fieldName.length);
        	var objLS = {};
        	objLS.id = fieldName;
    		objLS.value = sValue;
    		dataStorage.push(objLS);
        }
     });  
	
	// store advanced search results in storage
	if(browserAcceptLocalStorage()) {
		sessionStorage.setItem(advSearchKey, JSON.stringify(dataStorage));
	}
}
	
function submitReviewWebPaySearch(action){
	var searchIn = getAdvSearchType(action);
	var advSearchKey = searchIn + "_advSearch";
	var strJSON = sessionStorage.getItem(advSearchKey);
	var obj = $.parseJSON(strJSON);
	
	$.each(obj, function() {
		var fieldName = this.id;
	    var sValue = String(this.value);
	    if(sValue != ""){
	    	$('form[name="actionForm"] input[name="' + fieldName + '"]').val(sValue);
	    }
	});
	
	// submit action form
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.actionForm.userAction.value = action;
		document.actionForm.searchIn.value = SearchInEnum.WEBPAY;
		document.actionForm.action =  document.actionForm.primeWebPayURL.value;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

function submitToLegacyPage(legacyAction){
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		if(legacyAction != LinksEnum.QUOTEMARKETPLACE 
			&& legacyAction != LinksEnum.REPLACEMENTCOSTCALCULATOR){
				showLoadingMsg();
		}
		document.actionForm.userAction.value = legacyAction;
		document.actionForm.action =  document.actionForm.legacyRedirectURL.value + legacyAction;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}


function submitToAgencyReportsPage(action){
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{		
		showLoadingMsg();
		document.actionForm.userAction.value = action;
		document.actionForm.action =  document.actionForm.agencyReportURL.value;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}
function redirectToLegacyPage(legacyAction){
	var loginType = document.actionForm.loginType.value;
	var hasCurrentProfile = document.actionForm.hasCurrentProfile.value;
	var msg = "";
	
	if(loginType=="E" 
		&& hasCurrentProfile=="false" 
		&& legacyAction != LinksEnum.QUOTEMARKETPLACE
		&& legacyAction != LinksEnum.REPLACEMENTCOSTCALCULATOR){
	    if(legacyAction == LinksEnum.TRANSACTIONREPORTING){
	    	msg = "Transaction Reporting";
	    }else if(legacyAction == LinksEnum.DOCUMENTSEARCH){
	    	msg = "Document Search";
	    }else if(legacyAction == LinksEnum.COMMISSIONSTATEMENTS){
	    	msg = "Commission Statements";
	    }else if(legacyAction == LinksEnum.BANKACCOUNTPREFERNCES){
	    	msg = "Bank Account Preferences";
	    }
		displayAgencyProfileDialog(legacyAction,msg);
		return false;
	}else{
		submitToLegacyPage(legacyAction);
	}
}

function redirectToAgencyReportsPage(action){
	var loginType = document.actionForm.loginType.value;
	var hasCurrentProfile = document.actionForm.hasCurrentProfile.value;
	var msg = "Agency Report";
	if(loginType=="E"
		&& hasCurrentProfile=="false"){
		displayAgencyProfileDialog(action,msg);
		return false;
	}else{
		submitToAgencyReportsPage(action);
	}
}

function redirectLinkDDURL(selectId, id, e){
	var url = $("#" + selectId).val();
	if(url != ""){
		window.open(url, '_blank');
		//$('#' + id + "_Fields").addClass('hidden');
	}else{
		$("#" + selectId).addClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#' + id + "ErrorMsg").removeClass('hidden');
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	}
}

function redirectToPolicyInq(polNum){
	ghFunctn = partial(getPolicyData, polNum, InquiryActionEnum.POLICY);
	showExitPrompt(ghFunctn, false);
}

function redirectLandingPage(){
	var url = document.actionForm.redirectLandingURL.value;
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.actionForm.action = url;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

/* Quick Links Enums */
var QuickLinksActionsEnum = {
	policyInquiry:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.POLICY, completeNum: isCompletePolicyNumber}, 
	billingInquiry:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.BILLING, completeNum: isCompletePolicyNumber},
	claimInquiry:{globalSearchType: globalSearchType.CLAIMS, inqAction: InquiryActionEnum.CLAIMS, completeNum: isCompletePolicyNumber},
	claimInquiryQL:{globalSearchType: globalSearchType.CLAIMS, inqAction: InquiryActionEnum.CLAIMS, completeNum: isCompletePolicyNumber},
	policyDocuments:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.DOCUMENTS, completeNum: isCompletePolicyNumber},
	makeAPayment:{globalSearchType: globalSearchType.MAKEPAYMENT, inqAction: InquiryActionEnum.MAKEPAYMENT, completeNum: isCompletePolicyNumber},
	reviewPayments:{globalSearchType: globalSearchType.WEBPAY, inqAction: InquiryActionEnum.RPAYMENTS, completeNum: isCompletePolicyNumber},
	reviewPaymentsQL:{globalSearchType: globalSearchType.WEBPAY, inqAction: InquiryActionEnum.RPAYMENTS, completeNum: isCompletePolicyNumber},
	endorsement:{globalSearchType: globalSearchType.ENDORSEMENT, inqAction: InquiryActionEnum.ENDORSEMENT, completeNum: isCompletePolicyNumber},
	eServices:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.POLICY, completeNum: isCompletePolicyNumber},
	notes:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.NOTES, completeNum: isCompletePolicyNumber},
	reportClaim:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.REPORTCLAIM, completeNum: isCompletePolicyNumber},
	searchQuote:{globalSearchType: globalSearchType.QUOTESEARCHFOOTER, inqAction:InquiryActionEnum.QUOTE, completeNum: isCompletePolicyNumber},
	reqProofOfInsurance:{globalSearchType: globalSearchType.POLICYLINKS, inqAction: InquiryActionEnum.IDCARDS, completeNum: isCompletePolicyNumber},
	eSignatureStatus:{globalSearchType: globalSearchType.ESIGNATURE, inqAction: InquiryActionEnum.ESIGNATURESTATUS, completeNum: isCompletePolicyNumber}

};

/* Link enums */
var LinksEnum={
	TRANSACTIONREPORTING:"transactionReporting",
	DOCUMENTSEARCH:"documentSearch",
	HOMEOWNERPARTNERS:"homeownerPartners",
	BOPPARTNERS:"bopPartners",
	COMMISSIONSTATEMENTS:"commissionStatements",
	BANKACCOUNTPREFERNCES:"bankAccountPreferences",
	QUOTEMARKETPLACE:"quoteMarketplace",
	RMVACCESS:"rmvAccess",
	FLOOD:"flood",
	REPLACEMENTCOSTCALCULATOR:"replacementCostCalculator",
	AGENCYREPORTS:"agencyReports",
	QUICKQUOTE:"quickQuote"
};

function closeFlyouts(){
	// hides specified floating divs
	$('.popover').hide();
	$('.selectboxit-options').hide();
	$('.ui-autocomplete.ui-menu').hide();	
}

function storeAdvSearchForQuickLinks(action, srchStr){
	var searchIn = getAdvSearchType(action);
	var advSearchKey = searchIn + "_advSearch";
	var dataStorage = {};
	dataStorage = [];
	
	var objLSSearchType = {};
	objLSSearchType.id = "searchType";
	objLSSearchType.value = action;
	dataStorage.push(objLSSearchType);
	
	var objLSName = {};
	objLSName.id = "keyword";
	objLSName.value = srchStr;
	dataStorage.push(objLSName);

	// store advanced search results in storage
	if(browserAcceptLocalStorage()) {
		sessionStorage.setItem(advSearchKey, JSON.stringify(dataStorage));
	} 
}

function initMyViewValues(){
	var statesArray = $('#statesFromSession').val().replace("[","").replace("]","").split(',');  
	var channelsArray = $('#channelsFromSession').val().replace("[","").replace("]","").split(','); 
	

	$(statesArray).each(function(){
		var state = this.trim();
		$('#stateId option').filter(function() { 
			return ($(this).val() == state);
		}).prop('selected', true);

		$('#stateId').trigger("chosen:updated");

		$(channelsArray).each(function(){
			var channel = this.trim();
			$('#channelId option').filter(function() { 
				return ($(this).val() == channel);
			}).prop('selected', true);
		});
		$('#channelId').trigger("chosen:updated");
	});
	
	//Handle default condition if the session varibales are null
	if($('#statesFromSession').val().length <= 0){
		$('#stateId option').each(function() { 
			$(this).prop('selected', true);
		});
	}
	if($('#channelsFromSession').val().length <= 0){
		$('#channelId option').each(function() { 
			$(this).prop('selected', true);
		});
	}
}

function gotToRMVAccess(e){
	document.actionForm_RMVAccess.target="_blank";
	document.actionForm_RMVAccess.submit();
	//e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

function gotToRMVPortal(e){
	document.actionForm_RMVPortal.target="_blank";
	document.actionForm_RMVPortal.submit();
}


function redirectToESales(action){
	var loginType = document.actionForm.loginType.value;
	var hasCurrentProfile = document.actionForm.hasCurrentProfile.value;
	var branchLevelCode = $('#currentBranch').val().toUpperCase();
	
	var msg = "Quick Quote";
	if(loginType=="E"){
		if(hasCurrentProfile=="false"){
			displayAgencyProfileDialog(action,msg);
			return false;
		}else if(!('HP' == $('#currentOpCompany').val() && (('DIRECT' == branchLevelCode)
		|| ('RETAIL' === branchLevelCode )))){
			msg = "Agency profile selected is not authorized for Quick Quote.<br/>" +
			"<span style='margin-left:25px;'>Please select a new profile.</span>";
			msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
			$(".errorAlertMsg").html(msg);
			$(".errorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");
			$('#agencyProfileForm input[id="redirectToPage"]').val(action);
			// see if one operating company, if so populate behind the scenes
			var opCompanyHidden = $('#opCompanyAP_hidden');
			if($(opCompanyHidden).val() != ""){
				populateAgencyProfileDD(opCompanyHidden,'branchAP','getBranches');
			}
			$('#agencyProfileDialog').modal('show');
			return false;
		}else{
			//call eSales
			redirectToESalesQuickQuotePage()
		}
	}else{
		//get producer and call eSales
		redirectToESalesQuickQuotePage()
	}
}

function redirectToESalesQuickQuotePage(){
	var event = jQuery.Event(getSubmitEvent());
	$('#actionForm').trigger(event);
	if (event.isPropagationStopped()) { 
		$.unblockUI();
	}else{
		showLoadingMsg();
		document.actionForm.action =  document.actionForm.eSalesQQURL.value;
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}
