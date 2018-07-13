var errorImage = imagePath + "small_error_icon.png";
var ghFunctn;
//var validModalEvent = "keydown keyup keypress";
var validModalEvent = "change blur select";
var validModalEventNewCo = "change blur";
var msg = "";
var branchMsg = "";
var lobMsg = "";
var effDtMsg = "";
var stateMsg = "";
var productMsg = "";
var effDate = '';
var product = '';
var agencyProfile = '';
var lob = '';
var stateNQ = '';
var requestAgencyProfiles;
var requestNewCoProducers;
var requestNewCoBranches;
var firstNameNewCoMsg = "";
var lastNameNewCoMsg = "";
var dobNewCoMsg = "";
var fullAddressNewCoMsg = "";
var policyEffectiveDateNewCoMsg = "";
var branchNewCoMsg = "";
var agencyNewCoMsg = "";
var producerNewCoMsg = "";
var firstNameNewCo;
var lastNameNewCo; 
var dobNewCo;
var fullAddressNewCo;
var policyEffectiveDateNewCo;
var branchNewCo;
var agencyNewCo;
var producerNewCo;

jQuery(document).ready(function() {
	
	if($('#globalSearchInput').length >  0){
		// global search value
		var searchStr = $.trim($('#globalSearchInput').val());
		
		// watermark on global search input
		$('#globalSearchInput').watermark('Last Name, First Name or Policy #');
		
		$('#globalSearchInput').bind({
			keyup: function(e){
				var keyword = $.trim(this.value);
				if(keyword.length > 0) {
					$('#clearGlobalSearch').show();
				} else {
			    	$('#clearGlobalSearch').hide();
			    }
				hideGlobalSearchErrMsg(keyword);
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
			}, 
			
			keydown:function(e){
				if(e.keyCode == 13) {					
					var qsValue = $('#quickSearchValue').text();
					var hasBasicInquiry = document.actionForm.hasBasicInquiry.value;
					var disableBasicInquiry = document.actionForm.disableBasicInquiry.value;
					if(qsValue == "Policy" && (hasBasicInquiry == "false" || disableBasicInquiry == "true")){}
					else{
						//73310 fix - Page hung on press of enter key
						chkGlobalSearchInput();
					}
		    	}
			},
			
			mouseout:function(e){
				storeGlobalSearchValue(this.value);
			}
		});
		
		// autocomplete for global search
		$('#globalSearchInput').autocomplete({
			delay: 500,  
	    	minLength: 2, 
	    	selectFirst: true, 
	    	
	    	source: function(request, response) {
	    		var url = document.actionForm.autoCompleteSearchURL.value;
	    		var limit = 20;
	    		var params = "searchIn=" + getSearchInParm($('#quickSearchValue').text());
	    		var keyword  = $.trim(request.term.toLowerCase());
	    		if(callSearchAutoComplete(keyword)) {
	    			if (typeof requestAutoComplete != "undefined" && requestAutoComplete.readyState !== 4) {
	    				requestAutoComplete.abort();
	    			}
	    			requestAutoComplete = getAutoCompleteResults(keyword, request, response, url, limit, params);
	    		}
	    	},
	    	
	    	focus: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	},
	    	
	    	change: function(event, ui){
	    	},
	    	
	    	select: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	}
	    	
	    })
	    
	    .data('ui-autocomplete')._renderItem = function(ul,item){ 
			return $( "<li></li>" ) 
			.data( "item.ui-autocomplete", item) 
			.append(formatAutoCompleteOption(item.label))
			.appendTo(ul); 
		};
		
		// Quick Search dropdown
		setQuickSearchDropdown();
		
	}
	
	// address lookup service
	/*if($('.clsAddressLookup').length > 0){
		
		$('.clsAddressLookup').autocomplete({
			delay: 500,  
	    	minLength: 2, 
	    	selectFirst: true, 
	    	
	    	source: function(request, response) {
	    		var state, params;
	    		var url = document.actionForm.retrieveAddressesURL.value; 
	    		var limit = 5;
	    		var keyword  = $.trim(request.term.toLowerCase());
	    		if(keyword.length > 0 && !isRentersQuote()) {
	    			$('.clsAddressLookup').attr('title', '');
		    		$('#newQuoteForm [id="addressKey"]').val('');
		    		$('#newQuoteForm [id="addressSelected"]').val('');
	    			(getNQState() != '') ? state=getNQState(): state="PA";
	    			params = "state=" + state;
	    			if (typeof requestAutoComplete != "undefined" && requestAutoComplete.readyState !== 4) {
	    				requestAutoComplete.abort(); 
	    			}
	    			//console.log("making address request for keyword " + keyword + " at " + Date.now()/1000);
	    			requestAutoComplete = getAutoCompleteResults(keyword, request, response, url, limit, params);
	    		}
	    	},
	    	
	    	focus: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	},
	    	
	    	change: function(event, ui){
	    	},
	    	
	    	select: function(event, ui){
	    		populateAutoCompleteInput(this, ui);
	    		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	    	}
	    	
	    })
	    
	    .data('ui-autocomplete')._renderItem = function(ul,item){ 
			var index = $('li.addrOption').length;
			return $( "<li id='addrOption_" + index + "' class='addrOption'></li>")
			.data( "item.ui-autocomplete", item) 
			.append(formatAutoCompleteOption(item.label))
			.appendTo(ul); 
		};
	}*/
	
	$('.btnSearchBox').click(function(){
		$('.popover').hide();
	});
	
	$('.quickSearchLink').click(function(){
		$('#quickSearchValue').text($(this).text());
	});
	
	// Global Search button
	$('#startGlobalSearch').unbind('click').click(function(e){
		chkGlobalSearchInput();
    });
    
	// Clear Global Search icon
	if($('#globalSearchInput').val() != ""){
		$('#clearGlobalSearch').show();
	}
	
	$('#clearGlobalSearch').click(function(){
		$('#globalSearchInput').val("");
		storeGlobalSearchValue("");
    });
	
	$("#uw_NotesMessage").blur(function(){
		uw_NotesMessageVal = $("#uw_NotesMessage").val();
		if (uw_NotesMessageVal.length >1000){
			$('#uw_NotesMessage').val(uw_NotesMessageVal.substr(0,1000));
		}
	});
	
	// All Quotes link
	$('.defaultQuotesSearch').click(function(e){
//		console.log('submitGlobalSearch = '+submitGlobalSearch+' default ='+globalSearchType.DEFAULT+'searchStr ='+searchStr);
	//	alert('allQclicked');
		ghFunctn = partial(submitGlobalSearch, globalSearchType.DEFAULT, searchStr);
	    showExitPrompt(ghFunctn, false);
    });
	
	$(document).on("click", ".returnAllQuotes",  function(e){
		submitGlobalSearch(globalSearchType.DEFAULT, searchStr);
	});
	
	$('.clearAdvSearch').click(function(){
		clearAllAdvSearch();
	});
	
	//saveandexit and return to allQuotes for vehicle over weight
	$('#fixDiscalimerSelectionVehicleWeight').bind("click", function(e){
		$('#vehicleEligibilityErrorsModal').modal('hide');
		//53477-Clicking Exit Quote when there is a vehicle that weights 12000 lbs - Wiping out all Services data
		$('input:disabled,select:disabled').prop('disabled', false);
		ghFunctn = partial(submitGlobalSearch, globalSearchType.DEFAULT, searchStr);
		saveNBPage(ghFunctn);
	});
	
	// MyQuotes
	$('.myQuotesPopover').click(function(e){
		callMyQuotesService();
		//e.stopPropagation();
    });
	
	$(document).on("click", "li.getAllMyQuotes", function(e){
		ghFunctn = partial(submitGlobalSearch, globalSearchType.MYQUOTES, searchStr);
	    showExitPrompt(ghFunctn, false);
	});

	$(document).on("click", "li.getMyQuote", function(e){
		ghFunctn= partial(getMyQuote,this);
		showExitPrompt(ghFunctn, false);
	});
	
	// don't close popover if user clicks inside of it
	$(document).on("click", ".popover", function(e){
		e.stopPropagation();
	});
	
	$(document).click(function(e){
		// My Quotes
		if ($('#myQuotesArrow').data('popover') != undefined) {
			$('#myQuotesArrow').popover('hide');
		}
		$('[data-toggle="popover"]').each(function () {
	        //the 'is' for buttons that trigger popups
	        //the 'has' for icons within a button that triggers a popup
	        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
	            $(this).popover('hide');
	        }
	    });
		
		if($(".pac-icon").is(':visible') 
		  && e.target.id != getFieldIdForMapLkup()){
			 $('.pac-container').hide();
		}
    });
	
	// Policy Search Results
	$('.policyResults').click(function(e){
		document.actionForm.quickLinksAction.value = "";
		ghFunctn= partial(submitGlobalSearch,globalSearchType.POLICYCACHE, searchStr);
		showExitPrompt(ghFunctn, false);
    });
	
	// Advanced Policy Search
	$(document).on("click", ".openPolicyAdvSearch", function(){
		openAdvPolicySearch();
	});
	
	// Clear Advanced Search link
	$('#clearAdvPolSearch').click(function(){
		clearPolAdvSearch();
	});
	
	// Policy Search Type dropdown
	$('#searchType').bind("change", function(){
		var selValue = this.value;
		changePolicyAdvSearchForm(selValue);
	});

	// Advanced Search form
	$('#advSearchPolicyForm').submit(function(e){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		ghFunctn= partial(submitAdvancedPolicySearch);
		showExitPrompt(ghFunctn, false); 
	});
	
	// Applicant name in user info box
	$("span#applicant_name").bind('mouseover', function(){
		var firstName = $('span#applicant_first_name').text();
		var lastName = $('span#applicant_last_name').text();
		var name = firstName + " " + lastName;
		if(name != undefined && name != ""){
			showValueInTooltip(this, name);
		}
	});
	
	$("span#applicant_name").bind('mouseout', function(){
		hideToolTip(this);
	});
	
	// New Quote breadcrumb functionality
	if($('#breadCrumbs').length> 0) {
		$('#breadCrumbs').find('a:contains("New Quote")').click(function() { 
			displayNewQuoteDialog();
			return false; 
		});
	}
	
	// New Quote Button - Global Header
	$('#newQuoteBtn').click(function(){
		displayNewQuoteDialog();
    });
	
	// Submit New Quote Button
	$('#newQuoteForm').submit(function(e){
		console.log('submit new Quote form');
		var result = submitNewQuote(e);
		return result;
	});
	
	$('#newQuoteForm input[type=submit]').click(function(event) {
		  populateNewQuoteTypeAction(this.id);
	});
	
	// Inline validation for New Quote LOB
	$('#newQuoteForm [id="lobNQ"]').bind(validModalEvent, function(event, result){
		$('#newQuoteForm [id="lobNQ_hidden"]').val('');
		lobMsg = requiredNQValue(lob,"newQuoteLOBCol");
		lob = $('#newQuoteForm [id="lobNQ"]');
		if(lobMsg != ""){
			$(lob).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + lob.id + '_chosen a').addClass('inlineError');
		}else{
			$(lob).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + lob.id + '_chosen a').removeClass('inlineError');
		}
	});
	
	// Inline validation for New Quote State
	$('#newQuoteForm [id="stateNQ"]').bind(validModalEvent, function(event, result){
		$('#newQuoteForm [id="stateNQ_hidden"]').val('');
		stateMsg = requiredNQValue(stateNQ,"newQuoteStateCol");
		stateNQ = $('#newQuoteForm [id="stateNQ"]');
		if(stateMsg != ""){
			$(stateNQ).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + stateNQ.id + '_chosen a').addClass('inlineError');
		}else{
			$(stateNQ).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + stateNQ.id + '_chosen a').removeClass('inlineError');
		}
	});
	
	// Inline validation for New Quote Dialog Policy Effective Date
	$('#newQuoteForm [id="policyEffectiveDateNQ"]').bind(validModalEvent, function(event, result){
		var effDate = this;
		setTimeout(function () {
			validateNQDate(effDate, "newQuoteCol");
	    }, 100);
	});

	// Inline validation for New Quote Dialog Branch
	$('#newQuoteForm [id="agencyProfileNQ"]').bind(validModalEvent, function(event, result){
		$('#newQuoteForm [id="agencyProfileNQ_hidden"]').val('');
		branchMsg = requiredNQValue(agencyProfile,"newQuoteAgencyCol");
		agencyProfile = $('#newQuoteForm [id="agencyProfileNQ"]');
		if(branchMsg != ""){
			$(agencyProfile).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + agencyProfile.id + '_chosen a').addClass('inlineError');
		}else{
			$(agencyProfile).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + agencyProfile.id + '_chosen a').removeClass('inlineError');
		}
	});

	// Inline validation for New Quote Dialog Product
	$('#newQuoteForm [id="productNQ"]').bind(validModalEvent, function(event, result){	
		$('#newQuoteForm [id="productNQ_hidden"]').val('');
		productMsg = requiredNQValue(this,"newQuoteProdCol");
		product = $('#newQuoteForm [id="productNQ"]');
		if(productMsg != ""){
			$(product).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + product.id + '_chosen a').addClass('inlineError');
		}else{
			$(product).removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + product.id + '_chosen a').removeClass('inlineError');
		}
	});	

	$(document).on('click', '#addressFormatMsg', function(){
		$('#addressFormat').modal('show');
	});
	
	// New Quote Dialog Policy Effective Date Picker
    $('.clsPolEffDate').datepicker({
		showOn: "button",buttonImage: calendarImage,buttonImageOnly:true,buttonText : 'Open calendar',
		
//		onSelect: function(date, e) {
//			this.focus();
//		},
		onClose: function() {
			var effDate = this;
			setTimeout(function () {
				validateNQDate(effDate, "newQuoteCol");
		    }, 100);
		}
	});
    
    $('.clsPolEffDate').each(function(i, elem) {		
		// watermark policy effective date fields
		var dateLabel = "mm/dd/yyyy";
		if (null != $(this).val()) {
			if ($(this).val().length == 0){
		    	$(this).val(dateLabel).addClass('watermark');
		  	}
		}
		
		//if blur and no value inside, set watermark text and class again.
		$(elem).blur(function(){
		  	if ($(this).val().length == 0){
		    	$(this).val(dateLabel).addClass('watermark');
			}
		});
		
		//if focus and text is mm/dd/yyyy, set it to empty and remove the watermark class
		$(elem).focus(function(){
			if ($(this).val() == dateLabel){
		    	$(this).val('').removeClass('watermark');
			}
		});
		
		$(elem).keydown(function(event){
			 acceptNumericsPolEffDt(this, event);
		 });
		 
		 $(elem).keyup(function(event){
			 autoSlashes(this,event);
		 }); 
	});	
    
    /*** Start of New Co NQ functionality **/
    // close google popover if user clicks cancel button on nq dialog
	$('#cancelNQ').click(function(e){
		if($(".ui-autocomplete.ui-menu").is(':visible')){
			$('.ui-autocomplete.ui-menu').hide();
		}else if($(".pac-icon").is(':visible')){
			$('.pac-container').hide();
		}
    });
	
	/*$('#fullAddressNewCo').bind('keydown', function(e){
		// display popover if hidden if user previously clicked outside of it - JG
		if(isRentersQuote() && !$(".pac-icon").is(':visible')){
			$('.pac-container').show();
		}
    });*/
    
    // inline validation for new co fields in new quote dialog
    // first name
    $('#newQuoteForm [id="firstNameNewCo"]').bind(validModalEventNewCo, function(event, result){
		firstNameNewCoMsg = requiredNQValue(this,"newQuoteFirstNameNewCoCol");
		firstNameNewCo = $('#newQuoteForm [id="firstNameNewCo"]');
		if(firstNameNewCoMsg != ""){
			$(firstNameNewCo).addClass("inlineError");
		}else{
			// entered, now check if it is valid
			firstNameNewCoMsg = validateAdvSrchName(this,"newQuoteFirstNameNewCoCol");
			if(firstNameNewCoMsg != ""){
				$(firstNameNewCo).addClass("inlineError");
			}else{
				$(firstNameNewCo).removeClass("inlineError");
			}
		}
	});	  
    
    // last name
    $('#newQuoteForm [id="lastNameNewCo"]').bind(validModalEventNewCo, function(event, result){
		lastNameNewCoMsg = requiredNQValue(this,"newQuoteLastNameNewCoCol");
		lastNameNewCo = $('#newQuoteForm [id="lastNameNewCo"]');
		if(lastNameNewCoMsg != ""){
			$(lastNameNewCoMsg).addClass("inlineError");
		}else{
			// entered, now check if it is valid
			lastNameNewCoMsg = validateAdvSrchName(this,"newQuoteLastNameNewCoCol");
			if(lastNameNewCoMsg != ""){
				$(lastNameNewCo).addClass("inlineError");
			}else{
				$(lastNameNewCo).removeClass("inlineError");
			}
		}
	});	
    
    // dob
	$('#newQuoteForm [id="dobNewCo"]').bind(validModalEventNewCo, function(event, result){
		var dob = this;
		setTimeout(function () {
			validateNQDate(dob, "newQuoteDOBNewCoCol");
	    }, 100);
	});
	
	// full address
	$('#newQuoteForm [id="fullAddressNewCo"]').bind(validModalEventNewCo, function(event, result){
		fullAddressNewCoMsg = requiredNQValue(this,"newQuoteFullAddressNewCoCol");
		fullAddressNewCo = $('#newQuoteForm [id="fullAddressNewCo"]');
		if(fullAddressNewCoMsg != ""){
			$(fullAddressNewCo).addClass("inlineError");
		}else{
			// check if it is valid
			fullAddressNewCoMsg  = validFullAddress(this, "newQuoteFullAddressNewCoCol");
			if (fullAddressNewCoMsg != "") {
				$(fullAddressNewCo).addClass("inlineError");
			}else{
				$(fullAddressNewCo).removeClass("inlineError");
			}
		}
	});	
	
	// policy effective date
	$('#newQuoteForm [id="policyEffectiveDateNewCo"]').bind(validModalEventNewCo, function(event, result){
		var effDate = this;
		setTimeout(function () {
			validateNQDate(effDate, "newQuotePolicyEffectiveDateNewCoCol");
	    }, 100);
	});
	
	// branch
	$('#newQuoteForm [id="branchNewCo"]').bind(validModalEventNewCo, function(event, result){
		branchNewCoMsg = requiredNQValue(this,"newQuoteBranchNewCoCol");
		branchNewCo = $('#newQuoteForm [id="branchNewCo"]');
		if(branchNewCoMsg != ""){
			$(branchNewCo).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + branchNewCo.id + '_chosen a').addClass('inlineError');
		}else{
			$(branchNewCo).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + branchNewCo.id + '_chosen a').removeClass('inlineError');
		}
	});
	
	// agency
	$('#newQuoteForm [id="agencyNewCo"]').bind(validModalEventNewCo, function(event, result){
		agencyNewCoMsg = requiredNQValue(this,"newQuoteAgencyNewCoCol");
		agencyNewCo = $('#newQuoteForm [id="agencyNewCo"]');
		if(agencyNewCoMsg != ""){
			$(agencyNewCo).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + agencyNewCo.id + '_chosen a').addClass('inlineError');
		}else{
			$(agencyNewCo).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + agencyNewCo.id + '_chosen a').removeClass('inlineError');
		}
	});
	
	// producer code
	$('#newQuoteForm [id="producerNewCo"]').bind(validModalEventNewCo, function(event, result){
		producerNewCoMsg = requiredNQValue(this,"newQuoteProducerNewCoCol");
		producerNewCo = $('#newQuoteForm [id="producerNewCo"]');
		if(producerNewCoMsg != ""){
			$(producerNewCo).addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + producerNewCo.id + '_chosen a').addClass('inlineError');
		}else{
			$(producerNewCo).removeClass("inlineError") .trigger('chosen:updated').trigger('chosen:styleUpdated');
			$('#' + producerNewCo.id + '_chosen a').removeClass('inlineError');
		}
	});
	
	// Branches
	$('#branchNewCo').change(function () {
		setNewCoProducers($(this).val(), $('#branchNewCo option:selected').data('corp'), $('#branchNewCo option:selected').data('support'), 
				getNQState(), getNQLOB(), $('#agencyNewCo'), $('#producerNewCo'), $('#policyEffectiveDateNewCo'), true, true, true);
	});
	
	// Agencies
	$('#agencyNewCo').change(function () {
		setNewCoProducers($(this).val(),  $('#agencyNewCo option:selected').data('corp'), $('#agencyNewCo option:selected').data('support'), 
				getNQState(), getNQLOB(), $('#agencyNewCo'), $('#producerNewCo'), $('#policyEffectiveDateNewCo'), false, true, true);
	});
	
	// Producers
	$('#producerNewCo').change(function () {
		populateHiddenProdFields(true);
	});
	
	// PA Renters dialog - order credit
	$('.reOrderCredit').click(function(){
		reOrderCreditForHomeQuote();
    });
	$('.closeReOrderCredit').click(function(){
		clearAddressDetailsNQFields();
		reOrderCreditForHomeQuote();
    });
	
	
	$('#saveAddressDetailsNQ').click(function(){
		reOrderCreditForHomeQuoteForAddrNotFound();
    });
	
	$('.rateErrorMsg').click(function(){
		$('#rateError').modal('hide');
    }); 
    
    $('.rateErrorMsgForTerrNotFound').click(function(){
		$('#rateErrorForTerrNotFound').modal('hide');
    });
	
	$('#cancelAddressDetailsNQ').click(function(){
		
		$('#declineMessage').text('');
		$('#declineMessage').removeClass('left applicationNav alert alert-info hardAlert');
		$("#declineMessage").removeAttr("style");
		$('#declineMessage').attr('style', "display: none");
		
		$('#addressSquareFootage_NQ').val('');
		$('#addressYearBuilt_NQ').val('');
		$("#addressYearBuilt_NQ, #addressSquareFootage_NQ").prop("disabled", false);
		$("#saveAddressDetailsNQ").prop("disabled", false);
		
		$('#addressNotFoundNQ').modal('hide');
    });
	
	$('#canceladdressFormat').click(function(){
		$('#addressFormat').modal('hide');
    });
	
	$('.rateErrorMsgforHome').click(function(){
		$('#rateErrorForHomeowners').modal('hide');
		$('#newQuoteDialog').modal('show');
    });
	
	
	$("#addressYearBuilt_NQ").bind(validModalEventNewCo, function(event, result){
		if(!checkLengthYearBuilt(document.getElementById('addressYearBuilt_NQ'))){
			$('#addressYearBuilt_NQ_ERROR').text('Year Built is Invalid');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="red";
		}else{
			$('#addressYearBuilt_NQ_ERROR').text('');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="";
		}
	});
	
	$("#addressSquareFootage_NQ").bind(validModalEventNewCo, function(event, result){
		if(!checkCharsSquareFeet(document.getElementById('addressSquareFootage_NQ'))){
			$('#addressSquareFootage_NQ_ERROR').text('Square Feet is Invalid');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="red";
		}else{
			$('#addressSquareFootage_NQ_ERROR').text('');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="";
		}
	});
	
	$(".maskSSN").bind({
		blur: function() {	
			var nqLob = $('#lobNQ').val();
			
			if(($('#crossSellFlag').val() == 'Yes')) {
				nqLob = 'HO,Yes';
			}
			
			if(($('#lob').val() == 'PA' && nqLob != 'HO,Yes' ) || isEndorsement() ){
				return;
			}
			var elm = this.id;
			var hdnField = elm.substr(elm.indexOf("_") + 1, elm.length);
			maskSSN(this,hdnField);
		
		},'keyup': function(e) {
			fmtSSN(this,e); },
		'paste':function(e){
			var element = this;
			setTimeout(function () {
				var ssn = element.value;
				var re = /\D/g;
				if(ssn!=null && ssn!= undefined && ssn.length>1) {ssn = ssn.replace(re,"")};
				$('#'+element.id).val(ssn);
				fmtSSN(element,e);
			}, 100);	
			
			
		}});
	
	// policy form radio buttons - if user toggles, will determine view for policy type
    $("input[name='policyTypeNewCo']").on('change', function() {
    	changeHomeNQView($(this).val());
	});
	/*** End of New Co NQ functionality ***/
    
    // Notes dialog
	$('#saveNote').click(function(){
		updateNotes('S');
    });
	
	$('#deleteNote').click(function(){
		updateNotes('D');
    });
	
	$(document).on("resize", "#notesDialog", function (e) {
		resizeNotesDialog(this);
	});
	
	$(document).on("click", ".largeCommercial", function () {
		  $("#alertLargeCommercialAllQuotes").hide();
	});
	
	//68511-PA Cross Sell Breadcrumb Issue and NJ error.
/*	if(isHomeQuote()){
		setCrossSellView();
	}*/
});

function  clearAddressDetailsNQFields(){
	$('#prioraddr_PRIMARY_INSURED_NQ').val('');
	$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('');
	$('#divAddressFormatMsg').modal('hide');
	$('#mask_ssn_PRIMARY_INSURED_NQ').val('');
	$('#ssn_PRIMARY_INSURED_NQ').val('');
	$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').val('');
	$('#prioraddr_apt_PRIMARY_INSURED_NQ').val('');
	document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="";
	document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="";
}
/* MyQuotes popover */
function callMyQuotesService() {

	$('.popover').hide();

	/*
	 * // won't call service if popover already created if
	 * ($('#myQuotesArrow').data('popover') != undefined){
	 * if($("#myQuotes").is(':visible')){ $('#myQuotesArrow').popover('hide');
	 * }else{ $('#myQuotesArrow').popover('show'); } return; }
	 */

	var date = new Date();
	date = date.getTime();
	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		// Appending date to avoid caching
		url : document.actionForm.myQuotesURL.value + "?" + date,
		type : "get",
		data : "endRow=10",
		dataType : 'json',

		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},

		success : function(data, status, xhr) {
			populateMyQuotes(data);
		},

		error : function(xhr, status) {
			showMyQuotesError();
		},

		complete : function() {
			$.unblockUI();
		}
	});
}

function populateMyQuotes(data) {
	var name, firstName, lastName;
	var arrRows = data.rows;
	var count = data.recordCount;

	var strHTML = "<div id=\"myQuotes\">";
	strHTML = strHTML + "<ul class=\"menuItems\">";

	if (count == 0) {
		strHTML = strHTML + "<li class=\"menuItemDisabled\">";
		strHTML = strHTML
				+ "Sorry, we did not find any quotes updated within the last 15 months for your username";
		strHTML = strHTML + "</li>";
	} else {
		$.each(arrRows,
				function(i, item) {
					//TD#73705 fix
					name = "";
					// format name
					firstName = capitalizeFirstChar(item.firstName);
					lastName = capitalizeFirstChar(item.lastName);

					if (lastName != "" && lastName != null
							&& lastName != undefined) {
						name = lastName;
					}

					if (firstName != "" && firstName != null
							&& firstName != undefined) {
						name = name + ', ' + firstName;
					}

					strHTML = strHTML + "<li class=\"menuItem getMyQuote\">";
					if (name == "" || name == null
							|| name == undefined) {
						strHTML = strHTML + "<b>" + item.policyNumber + "</b>&nbsp;<br/>";
					}else{					
					strHTML = strHTML + "<b>" + name + ":&nbsp;"
							+ item.policyNumber + "</b>&nbsp;<br/>";
					}
					strHTML = strHTML + "<span class=\"statusDateMyQuote\">"
							+ item.alignedTransactionStatus
							+ "&nbsp;&bull;&nbsp;" + item.effectiveDate
							+ "&nbsp;</span>";
					strHTML = strHTML + "<table>";
					strHTML = strHTML + "<tr class=\"hidden\">";
					strHTML = strHTML + "<td>" + name + "</td>";
					strHTML = strHTML + "<td>" + item.alignedTransactionStatus
							+ "</td>";
					strHTML = strHTML + "<td>" + item.effectiveDate + "</td>";
					strHTML = strHTML + "<td>" + item.policyNumber + "</td>";
					strHTML = strHTML + "<td>" + item.policyKey + "</td>";
					strHTML = strHTML + "<td>" + item.dataSource + "</td>";
					strHTML = strHTML + "<td>" + item.lob + "</td>";
					strHTML = strHTML + "<td>" + item.channel + "</td>";
					strHTML = strHTML + "<td>" + item.company + "</td>";
					strHTML = strHTML + "<td>" + item.state + "</td>";
					strHTML = strHTML + "<td>" + item.alignedTransactionType
							+ "</td>";
					strHTML = strHTML + "<td>" + item.status + "</td>";
					strHTML = strHTML + "<td>" + item.uwCompany + "</td>";
					strHTML = strHTML + "</tr>";
					strHTML = strHTML + "</table>";
					strHTML = strHTML + "</li>";
				});
	}

	strHTML = strHTML
			+ "<li class=\"divider\"/ style=\"margin-left: 15px; margin-right: 15px; width: 87%;\"></li>";
	strHTML = strHTML
			+ "<li class=\"menuItem getAllMyQuotes\">View All My Quotes</li>";
	strHTML = strHTML + "</ul>";
	strHTML = strHTML + "</div>";

	$('#myQuotesArrow').popover({
		html : true,
		content : strHTML,
		placement : 'bottom'
	}).popover('show');
}

function showMyQuotesError() {
	var strHTML = "<div id=\"myQuotes\">";
	strHTML = strHTML + "<ul class=\"menuItems\">";
	strHTML = strHTML + "<li class=\"menuItemDisabled\">";
	strHTML = strHTML
			+ "Sorry, our database is inaccessible at the moment. Please try later.";
	strHTML = strHTML + "</li>";
	strHTML = strHTML + "</ul>";
	strHTML = strHTML + "</div>";

	$('#myQuotesArrow').popover({
		html : true,
		content : strHTML,
		placement : 'bottom'
	}).popover('show');
}

function getMyQuote(selectedQuote) {
	// function is called when quote is selected in MyQuotes
	var myQuoteRow = $(selectedQuote).find('tr');
	var policyNumber = $(myQuoteRow).find('td:eq(3)').text();
	var policyKey = $(myQuoteRow).find('td:eq(4)').text();
	var dataSource = $(myQuoteRow).find('td:eq(5)').text();
	var lob = $(myQuoteRow).find('td:eq(6)').text();
	var channel = $(myQuoteRow).find('td:eq(7)').text();
	var company = $(myQuoteRow).find('td:eq(8)').text();
	var state = $(myQuoteRow).find('td:eq(9)').text();
	var transactionType = $(myQuoteRow).find('td:eq(10)').text();
	var status = $(myQuoteRow).find('td:eq(11)').text();
	var uwCompany = $(myQuoteRow).find('td:eq(12)').text();
	var action;

	if (isLegacyCAutoRecord(dataSource)) {
		action = ActionEnum.SUMMARY;
	} else if (status.toUpperCase() == TransactionStatusEnum.ISSUED
			.toUpperCase()
			|| (transactionType.toUpperCase() == TransactionTypeEnum.POLICY
					.toUpperCase() && status.toUpperCase() == TransactionStatusEnum.IN_PROCESS
					.toUpperCase())
			|| transactionType.toUpperCase() == TransactionTypeEnum.PENDING_ISSUANCE
					.toUpperCase()
			|| status.toUpperCase() == TransactionStatusEnum.IN_REVIEW
					.toUpperCase()
			|| status.toUpperCase() == TransactionStatusEnum.PENDING_ISSUANCE
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_EXCEPTION
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY
					.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING
					.toUpperCase()) {
		if (isLegacyPalHomeRecord(dataSource, lob)) {
			action = ActionEnum.COVERAGE_SUMMARY;
		} else if (isLegacyCAutoRecord(dataSource)) {
			action = ActionEnum.REVIEW;
		} else {
			action = ActionEnum.SUMMARY;
		}
	} else {
		action = ActionEnum.EDIT;
	}

	// submitActionForm(policyNumber, policyKey, dataSource, -1, lob, channel,
	// status, encodeURI(transactionType), company, state, encodeURI(action),
	// "MyQuotes");
	submitActionForm(policyNumber, policyKey, dataSource, -1, lob, channel,
			status, transactionType, company, uwCompany, state,
			encodeURI(action), "MyQuotes");
}

function showThirdPartyReports(policyKey, policyNumber, rowId, action, state) {

	var reportUrl = '';
	var title = '';

	if (action == ActionEnum.VIEW_VIOLATIONS) {
		title = ActionEnum.VIEW_VIOLATIONS;
		reportUrl = document.actionForm.viewThirdPartyViolationAbstractURL.value;
	} else if (action == ActionEnum.VIEW_CLAIMS_ACCIDENTS) {
		title = ActionEnum.VIEW_CLAIMS_ACCIDENTS;
		reportUrl = document.actionForm.viewThirdPartyClaimAbstractURL.value;
	}

	reportUrl = reportUrl + "/" + policyKey + "/" + state;

	$.ajax({
		url : reportUrl,
		type : 'GET',
		cache : false,

		beforeSend : function(status, xhr) {
			showLoadingMsg();
			$("#viewThirdPartyReportsTitle").html(title);
		},

		success : function(data) {
			$("#viewThirdPartyReportsBody").html(data);
		},

		error : function(data) {
			$("#viewThirdPartyReportsBody").html("Failed to load report.");
		},

		complete : function() {
			$.unblockUI();
			$("#viewThirdPartyReportsModeless").modal('show');
		}

	});

}

function submitActionForm(policyNumber, policyKey, dataSource, rowId, lob,
		channel, policyStatus, transactionType, company, state, action,
		requestSource) {
	submitActionForm(policyNumber, policyKey, dataSource, rowId, lob, channel,
			policyStatus, transactionType, company, "", state, action,
			requestSource);
}

function submitActionForm(policyNumber, policyKey, dataSource, rowId, lob,
		channel, policyStatus, transactionType, company, uwCompany, state,
		action, requestSource) {
	var isLargeCommercialPolicy = true;
	var ajaxReq = $.get("/aiui/landing/checkLargeCAuto"
			,{ policyNumber : policyNumber
			}).done(function(response) { 
				if(response == isLargeCommercialPolicy){
					$("#alertLargeCommercialAllQuotes").show();
				}else{
					
	var url = '';
	var nextTab = "client";
	var readOnly = "N";
	var editURL = document.actionForm.editURL.value;
	var copyEditURL = document.actionForm.copyEditURL.value;
	var legacyURL = document.actionForm.legacyURL.value;
	var eSaleslegacyURL = document.actionForm.eSalesNElegacyURL.value;
	var eSalesNewURL = document.actionForm.eSalesNENewURL.value;
	var isLegacyPolicy = isLegacy(dataSource);
	var copyQQURL = document.actionForm.copyQQURL.value;	//Quick Quote

	requestSource = requestSource || "AllQuotes";

	if ("PCAT" == lob.toUpperCase()) {
		nextTab = "umbrella";
	}

	if ("HO" == lob.toUpperCase()) {
		editURL = document.actionForm.editHomeURL.value;
		copyEditURL = ""; /*No Copy Quote functionality for Prime HO quotes.*/
	}
	
	if (state != null && state.toUpperCase() == "NJ") {
		eSaleslegacyURL = document.actionForm.eSaleslegacyURL.value;
		eSalesNewURL = document.actionForm.eSalesNewURL.value;
	}

	action = decodeURI(action);

	if (action == ActionEnum.RE_SEND_ESIG) {
		// action will either be changed to Forms or Documents
		action = isLegacyPolicy ? ActionEnum.DOCUMENTS : ActionEnum.FORMS;
	}

	if (action == ActionEnum.VIEW_VIOLATIONS
			|| action == ActionEnum.VIEW_CLAIMS_ACCIDENTS) {
		return showThirdPartyReports(policyKey, policyNumber, rowId, action,
				state);
	}

	var userAction = action;

	switch (action) {
	case ActionEnum.EDIT:
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.COPY_EDIT:
		url = isLegacyPolicy ? legacyURL : copyEditURL;
		break;
	case ActionEnum.READ_ONLY:
		readOnly = "Y";
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.COVERAGE_SUMMARY:
		readOnly = "Y";
		nextTab = "Coverage Summary";
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.SUMMARY:
		readOnly = "Y";
		if ("PCAT" != lob.toUpperCase()) {
			nextTab = "summary";
		}
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.FORMS:
		readOnly = "Y";
		nextTab = "forms";
		url = isLegacyPolicy ? legacyURL : editURL;
		userAction = isLegacyPolicy ? ActionEnum.DOCUMENTS : ActionEnum.FORMS;
		break;
	case ActionEnum.CI_QUOTE:
		var turl, pflCode;

		if (isLegacyPolicy) {
			pflCode = PlfCodeEnum[company + lob.toUpperCase()];
			turl = addRequestParam(eSaleslegacyURL, "Policy_number",
					encodeURI(policyNumber));
			turl = addRequestParam(turl, "FromAI", "Y");
		} else {
			pflCode = PlfCodeEnum[uwCompany];
			turl = addRequestParam(eSalesNewURL, "Quote_Number",
					encodeURI(policyNumber));
			turl = addRequestParam(turl, "Agent_Flag", "true");
		}

		turl = addRequestParam(turl, "PLF_Code", pflCode);
		window.open(encodeURI(turl));
		break;
	case ActionEnum.CONVERT_TO_APPLICATION:
		url = legacyURL;
		break;
	case ActionEnum.DOCUMENTS:
		url = legacyURL;
		break;
	case ActionEnum.REQUEST_ADDITIONAL_INFO:
		url = legacyURL;
		break;
	case ActionEnum.REQUEST_ISSUE:
		url = legacyURL;
		break;
	case ActionEnum.ISSUE_POLICY:
		url = legacyURL;
		break;
	case ActionEnum.REVIEW:
		url = legacyURL;
		break;
	case ActionEnum.COPY_QQ:
		url = copyQQURL;
		break;
	}

	if (url != '') {
		// destroy popover to trigger svc call next time
		$("#myQuotesArrow").popover('destroy');

		var event = jQuery.Event(getSubmitEvent());
		$('#actionForm').trigger(event);
		if (event.isPropagationStopped()) {
			$.unblockUI();
		} else {
			// submit form
			showLoadingMsg();
			document.actionForm.policyKey.value = policyKey;
			document.actionForm.policyNumber.value = policyNumber;
			document.actionForm.policyStatus.value = encodeURI(policyStatus);
			document.actionForm.dataSource.value = dataSource;
			document.actionForm.userAction.value = userAction;
			document.actionForm.nextTab.value = nextTab;
			document.actionForm.readOnly.value = readOnly;
			document.actionForm.company.value = company;
			document.actionForm.state.value = state;
			document.actionForm.lob.value = lob;
			document.actionForm.channel.value = channel;
			document.actionForm.transactionType.value = transactionType;
			document.actionForm.action = url;
			document.actionForm.requestSource.value = requestSource;
			document.actionForm.method = "POST";
			document.actionForm.submit();
		}
	}
					
}
			}).fail(function(data) {
				//alert("error" + data);
			});

	
	
/*	var url = '';
	var nextTab = "client";
	var readOnly = "N";
	var editURL = document.actionForm.editURL.value;
	var copyEditURL = document.actionForm.copyEditURL.value;
	var legacyURL = document.actionForm.legacyURL.value;
	var eSaleslegacyURL = document.actionForm.eSalesNElegacyURL.value;
	var eSalesNewURL = document.actionForm.eSalesNENewURL.value;
	var isLegacyPolicy = isLegacy(dataSource);

	requestSource = requestSource || "AllQuotes";

	if ("PCAT" == lob.toUpperCase()) {
		nextTab = "umbrella";
	}

	if ("HO" == lob.toUpperCase()) {
		editURL = document.actionForm.editHomeURL.value;
		copyEditURL = ""; No Copy Quote functionality for Prime HO quotes.
	}
	
	if (state != null && state.toUpperCase() == "NJ") {
		eSaleslegacyURL = document.actionForm.eSaleslegacyURL.value;
		eSalesNewURL = document.actionForm.eSalesNewURL.value;
	}

	action = decodeURI(action);

	if (action == ActionEnum.RE_SEND_ESIG) {
		// action will either be changed to Forms or Documents
		action = isLegacyPolicy ? ActionEnum.DOCUMENTS : ActionEnum.FORMS;
	}

	if (action == ActionEnum.VIEW_VIOLATIONS
			|| action == ActionEnum.VIEW_CLAIMS_ACCIDENTS) {
		return showThirdPartyReports(policyKey, policyNumber, rowId, action,
				state);
	}

	var userAction = action;

	switch (action) {
	case ActionEnum.EDIT:
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.COPY_EDIT:
		url = isLegacyPolicy ? legacyURL : copyEditURL;
		break;
	case ActionEnum.READ_ONLY:
		readOnly = "Y";
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.COVERAGE_SUMMARY:
		readOnly = "Y";
		nextTab = "Coverage Summary";
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.SUMMARY:
		readOnly = "Y";
		if ("PCAT" != lob.toUpperCase()) {
			nextTab = "summary";
		}
		url = isLegacyPolicy ? legacyURL : editURL;
		break;
	case ActionEnum.FORMS:
		readOnly = "Y";
		nextTab = "forms";
		url = isLegacyPolicy ? legacyURL : editURL;
		userAction = isLegacyPolicy ? ActionEnum.DOCUMENTS : ActionEnum.FORMS;
		break;
	case ActionEnum.CI_QUOTE:
		var turl, pflCode;

		if (isLegacyPolicy) {
			pflCode = PlfCodeEnum[company + lob.toUpperCase()];
			turl = addRequestParam(eSaleslegacyURL, "Policy_number",
					encodeURI(policyNumber));
			turl = addRequestParam(turl, "FromAI", "Y");
		} else {
			pflCode = PlfCodeEnum[uwCompany];
			turl = addRequestParam(eSalesNewURL, "Quote_Number",
					encodeURI(policyNumber));
			turl = addRequestParam(turl, "Agent_Flag", "true");
		}

		turl = addRequestParam(turl, "PLF_Code", pflCode);
		window.open(encodeURI(turl));
		break;
	case ActionEnum.CONVERT_TO_APPLICATION:
		url = legacyURL;
		break;
	case ActionEnum.DOCUMENTS:
		url = legacyURL;
		break;
	case ActionEnum.REQUEST_ADDITIONAL_INFO:
		url = legacyURL;
		break;
	case ActionEnum.REQUEST_ISSUE:
		url = legacyURL;
		break;
	case ActionEnum.ISSUE_POLICY:
		url = legacyURL;
		break;
	case ActionEnum.REVIEW:
		url = legacyURL;
		break;
	}

	if (url != '') {
		// destroy popover to trigger svc call next time
		$("#myQuotesArrow").popover('destroy');

		var event = jQuery.Event(getSubmitEvent());
		$('#actionForm').trigger(event);
		if (event.isPropagationStopped()) {
			$.unblockUI();
		} else {
			// submit form
			showLoadingMsg();
			document.actionForm.policyKey.value = policyKey;
			document.actionForm.policyNumber.value = policyNumber;
			document.actionForm.policyStatus.value = encodeURI(policyStatus);
			document.actionForm.dataSource.value = dataSource;
			document.actionForm.userAction.value = userAction;
			document.actionForm.nextTab.value = nextTab;
			document.actionForm.readOnly.value = readOnly;
			document.actionForm.company.value = company;
			document.actionForm.state.value = state;
			document.actionForm.lob.value = lob;
			document.actionForm.channel.value = channel;
			document.actionForm.transactionType.value = transactionType;
			document.actionForm.action = url;
			document.actionForm.requestSource.value = requestSource;
			document.actionForm.method = "POST";
			document.actionForm.submit();
		}
	}*/
}

/* AutoComplete functionality */
/*var getAutoCompleteResults = function(keyword, request, response, url, limit, params) {
	params = params + "&keyword=" + keyword.replaceAll("*", "");
	
	var request = $.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url : url,
		type : "get",
		data : params,
		dataType : 'json',
		cache : true,
		timeout: 2000, // 2 second timeout

		success : function(data, status, xhr) {
			//console.log("retrieved data " + Date.now()/1000);
			return processAutoCompleteReponse(response, data, keyword, limit);
		},

		error : function(xhr, error) {
			// error calling web service, display message
			//console.log("error calling getAutoCompleteResults is " + error);
		},

		complete : function() {
			//$.unblockUI();
		}
	});
	
	return request;
};*/

/*function processAutoCompleteReponse(response, data, term, limit){
	
	if (data.length == 0) {
		data.push("No matches found");
		response(data, term);
	} else {
		//console.log("highlighting keywords" + Date.now()/1000);
		response(highlightKeywordMatch(data, term, limit));
	}
	
	return response;
}*/

/*function formatAutoCompleteOption(item) {
	var option;
	
	if (item.toUpperCase().indexOf("NO MATCHES FOUND") > -1
			|| item.toUpperCase().indexOf("MORE THAN 20") > -1) {
		option = "<a><strong>" + item + "</strong></a>";
	} else {
		option = "<a>" + item + "</a>";
	}

	return option;
}*/

/*function highlightKeywordMatch(data, term, limit) {
	// if exact match, display option in bold in dropdown
	var regex = new RegExp("(?![^&;]+;)(?!<[^<>]*)("
			+ term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1")
			+ ")(?![^<>]*>)(?![^&;]+;)", "gi");
	var limitMatches = "...More than " + limit + " found. Please refine your search.";

	var result = $.map(data, function(value, index) {
		if (index < limit) { // Limiting the list to limit passed for elements
			var keyword = "";
			
			if(value.fullAddress){
				//console.log("setting values to hidden fields" + Date.now()/1000);
				keyword = value.fullAddress;
				if($("#addressOption_" + index).length == 0){
					var input = $("<input>").attr("type", "hidden").attr("id", "addressOption_" + index).attr("class", "addressOption");
					$('#newQuoteForm').append($(input));
				}
				$("#addressOption_" + index).val(JSON.stringify(value));
				//console.log("value is " + JSON.stringify(value));
			}else{
				keyword = value;
			}
			
			// match on term, make it bold in drop down
			return keyword.replace(regex, "<strong>$1</strong>");
		} else {
			// If count returned more than limit, display message
			if (index == (data.length - 1)) {
				return limitMatches.replace(regex, "<strong>$1</strong>");
			}
		}
	});

	//console.log("set values to hidden fields" + Date.now()/1000);
	return result;
}*/

/*function processAddressSelected(input, selectedOption){
	var id = "";
	
	selectedOption = $.trim(selectedOption);
	$(input).attr('title', selectedOption);
	selectedOption = selectedOption.toUpperCase();
	
	$("a.ui-corner-all").each(function(){
		var addrValue = $.trim($(this).text().toUpperCase());
		var elm = $(this).parent();
		if(addrValue == selectedOption){
			id = $(elm).attr('id');
			id = id.replace("addrOption_","");
			return false;
		}
	});
	
	var selAddress = $('#newQuoteForm input[id="addressOption_' + id + '"]').val();
	$('#newQuoteForm input[id="addressSelected"]').val(selAddress);
}*/

/*function populateAutoCompleteInput(input, ui) {
	var selectedOption = ui.item.label;

	if (selectedOption.toUpperCase().indexOf("MORE THAN 20") == -1
			&& selectedOption.toUpperCase().indexOf("NO MATCHES FOUND") == -1) {
		selectedOption = selectedOption.replaceAll("<strong>", "").replaceAll(
				"</strong>", "");
		if($(input).hasClass('clsAddressLookup')){
			processAddressSelected(input, selectedOption);
		}
		$(input).val(selectedOption);
	} else {
		// remove selected look
		$('#ui-active-menuitem').closest('a').removeClass('ui-state-hover')
				.addClass('noSelect');
	}
}*/

/* Global Search functionality */
function callSearchAutoComplete(searchStr) {
	var qsValue = $('#quickSearchValue').text().toUpperCase();

	if (!isValidSearchValue(searchStr) || qsValue == globalSearchType.POLICY) {
		return false;
	} else if (searchStr.length < 8 && hasNumbers(searchStr)) {
		var msg = errorMessageJSONGH.QuoteNumbers;
		showGlobalSearchErrMsg(msg);
		return false;
	} else {
		return true;
	}
}

function showGlobalSearchErrMsg(msg) {
	$('.ui-autocomplete.ui-menu').hide();
	$('#globalSearchInput').addClass('inlineError');
	$('#searchError').html(msg);
}

function hideGlobalSearchErrMsg(keyword) {
	if (!(keyword.length < 8 && hasNumbers(keyword))) {
		$('#globalSearchInput').removeClass('inlineError');
		$('#searchError').html("&nbsp;");
	}
}

function chkGlobalSearchInput() {
	var errMsg;
	var searchStr = $.trim($('#globalSearchInput').val());
	var qsValue = $.trim($('#quickSearchValue').text().toUpperCase());

	if (searchStr.length > 14 && hasNumbers(searchStr)
			&& qsValue == globalSearchType.POLICY) {
		var msg = errorMessageJSONGH.MoreChars;
		showGlobalSearchErrMsg(msg);
		openAdvPolicySearch();
		return false;
	}

	if (searchStr.length >= 2) {
		if (qsValue == globalSearchType.POLICY) {
			ghFunctn = partial(submitGlobalSearch, globalSearchType.POLICY,
					searchStr);
			showExitPrompt(ghFunctn, false);
		} else {
			ghFunctn = partial(submitGlobalSearch, globalSearchType.KEYWORD,
					searchStr);
			showExitPrompt(ghFunctn, false);
		}
	} else {
		errMsg = errorMessageJSONGH.Required;
		showGlobalSearchErrMsg(errMsg);
	}
}

function clearGlobalSearchInput() {
	$('#globalSearchInput').val("").removeClass('inlineError');
	$('#clearGlobalSearch').hide();
	$('#searchError').html('&nbsp;');
	$('.ui-autocomplete.ui-menu').hide();
}

function submitGlobalSearch(srchType, srchStr) {

	// console.log('srchType = '+srchType);
	// console.log('srchStr = '+srchStr);
	if (globalSearch.hasOwnProperty(srchType)) {

		// see if we need to clear all adv search
		if (globalSearch[srchType].clearAdvSearch == "Y") {
			clearAllAdvSearch();
		}

		var event = jQuery.Event(getSubmitEvent());
		$('#actionForm').trigger(event);
		if (event.isPropagationStopped()) {
			$.unblockUI();
		} else {
			// submit form
			showLoadingMsg();
			document.actionForm.action = $("#" + globalSearch[srchType].URL)
					.val();
			// console.log('setting form action = '+document.actionForm.action
			// );
			document.actionForm.keyword.value = srchStr;
			document.actionForm._search.value = globalSearch[srchType].search;
			document.actionForm.defaultSearch.value = globalSearch[srchType].defaultSearch;
			document.actionForm.myQuotesSearch.value = globalSearch[srchType].myQuotesSearch;
			document.actionForm.searchIn.value = globalSearch[srchType].searchIn;
			document.actionForm.showEndBubble.value = globalSearch[srchType].showEndBubble;
			document.actionForm.showEFNOL.value = globalSearch[srchType].showEFNOL;
			document.actionForm.isAdvSearch.value = globalSearch[srchType].isAdvSearch;
			document.actionForm.quickSearch.value = $('#quickSearchValue')
					.text();
			document.actionForm.globalSearchValue.value = $.trim($(
					'#globalSearchInput').val());
			if (globalSearch[srchType].isQuickLinks != "Y") {
				document.actionForm.quickLinksAction.value = "";
			}
			document.actionForm.requestSource.value = srchType;
			// console.log('globalSearch Obj = '+globalSearch);
			// alert('post the form here');
			document.actionForm.method = "POST";
			document.actionForm.submit();
		}
	}
}

function clearAllAdvSearch() {
	// clears advanced search for all tabs
	if (browserAcceptLocalStorage() && sessionStorage.length > 0) {
		for (var i = sessionStorage.length - 1; i >= 0; i--) {
			var key = sessionStorage.key(i);
			if (key.substr(1, 10).toUpperCase() == "_ADVSEARCH") {
				sessionStorage.removeItem(key);
			}
		}
	}
}

function getSearchInParm(parm) {
	var searchIn = parm.toUpperCase();

	if (SearchInEnum.hasOwnProperty(searchIn)) {
		searchIn = SearchInEnum[searchIn];
	}

	return searchIn;
}

function setQuickSearchDropdown() {
	var sValue = document.actionForm.quickSearch.value;
	var hasNewQuoteAccess = document.actionForm.hasNewQuoteAccess.value;
	var hasBasicInquiry = document.actionForm.hasBasicInquiry.value;

	if (sValue == "" || sValue == null || sValue == undefined) {
		if (hasNewQuoteAccess == "true" && hasBasicInquiry == "false") {
			sValue = "Quote";
		} else {
			sValue = "Policy";
		}
	}

	$('#quickSearchValue').text(sValue);
}

function storeGlobalSearchValue(sValue) {
	if (sValue.indexOf("Last Name") > -1) {
		sValue = "";
	}

	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json',
		},
		url : "/aiui/landing/storeGlobalSearchValue?globalSearchValue="
				+ sValue,
		type : 'get',
		dataType : 'json',
		timeout : 2500,
		async : false,
		cache : false,
		success : function(response, textStatus, jqXHR) {
			if (sValue == "") {
				clearGlobalSearchInput();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			// alert("Xhr Status: " + jqXHR.status);
		},
		complete : function() {
			$.unblockUI();
		}
	});
}

/* New Quote Dialog */
function submitNewQuote(event) {
	var errorCol;

	// clear any previous error messages if user tries to re-submit New Quote
	msg = "";

	clearModalErrors('newQuoteForm', false);
	effDate = $('#newQuoteForm [id="policyEffectiveDateNQ"]');
	lob = getNQLOB();

	var stateVal = $('#newQuoteForm [id="stateNQ_hidden"]').val();
	if (stateVal == "") {
		stateNQ = $('#newQuoteForm [id="stateNQ"]');
	} else {
		stateNQ = $('#newQuoteForm [id="stateNQ_hidden"]');
	}
	stateVal = $(stateNQ).val();
	$('#newQuoteForm [id="stateNQ_hidden"]').val(stateVal);
	
	if(isNewHomeNQProduct()){  
		msg = checkNewCoEdits(); // check edits
		if (msg != "") {
			return false;
		}
		// get producer information to pass
		channel = $('#channelNewCo').val();
		companyId = $('#companyIdNewCo').val();
		
		// check Manage effective dates service
		msg = chkMgEffDtNQ(channel, companyId, stateVal);
		if(msg != 'valid'){
			invalidProduct($('#newQuoteForm [id="policyEffectiveDateNewCo"]'), "newQuotePolicyEffectiveDateNewCoCol", "InvalidProducerProduct");
			$('#policyEffectiveDateNewCo_error').html(msg);
			return false;
		}
		
		$('#newQuoteDialog').modal('hide');
		
		var selectedAddress = document.newQuoteForm.addressSelected.value;
		
		console.log('submitNewQuote selectedaddress = '+selectedAddress);
		if(selectedAddress != "" && !(isRentersQuote() || isCondoOwnersQuote())){
			// user selected address in type ahead, no need to call DQM
			console.log('Not a renters quote');
			var addrObj = $.parseJSON(selectedAddress);
			document.newQuoteForm.addressKey.value = addrObj.addressKey;  // store address key
			proceed(addrObj, event);
		}else{
			// call DQM service
			console.log('Renters quote');
			var fullAddress = $('#newQuoteForm [id="fullAddressNewCo"]').val();
			var result = validateAddressNewCo(fullAddress);
			entryVsSuggestion(result, event);
		}
		return false;
	}else{
		var agencyProfileVal = $('#newQuoteForm [id="agencyProfileNQ_hidden"]').val();
		if (agencyProfileVal == "" || agencyProfileVal == undefined) {
			agencyProfile = $('#newQuoteForm [id="agencyProfileNQ"]');
		} else {
			agencyProfile = $('#newQuoteForm [id="agencyProfileNQ_hidden"]');
		}
		agencyProfileVal = $(agencyProfile).val();
		$('#newQuoteForm [id="agencyProfileNQ_hidden"]').val(agencyProfileVal);

		var productVal = $('#newQuoteForm [id="productNQ_hidden"]').val();
		if (productVal == "") {
			product = $('#newQuoteForm [id="productNQ"]');
			errorCol = "newQuoteProdCol";
		} else {
			product = $('#newQuoteForm [id="productNQ_hidden"]');
			errorCol = "newQuoteProdHiddenCol";
		}
		productVal = $(product).val();
		$('#newQuoteForm [id="productNQ_hidden"]').val(productVal);
		
		if (!notValidProducer(agencyProfile, effDate, stateNQ, product, errorCol)) {
			if (!$('#agencyProfileNQLiteral').hasClass('hidden')) {
				$('#agencyProfileNQLiteral').addClass("inlineError");
			}
			if (!$('#productNQLiteral').hasClass('hidden')) {
				$('#productNQLiteral').addClass("inlineError");
			}

			$('#agencyProfileNQ').addClass("inlineError").trigger('chosen:updated')
					.trigger('chosen:styleUpdated');
			$('#productNQ').addClass("inlineError").trigger('chosen:updated')
					.trigger('chosen:styleUpdated');

			if (!$('tr#effDateRow').hasClass('hidden')) {
				validateNewQuoteDate(effDate, "newQuoteCol");
			}

			return false;
		} else {
			lobMsg = requiredNQValue(lob, "newQuoteLOBCol");
			if (lobMsg != "") {
				$(lob).addClass("inlineError").trigger('chosen:updated').trigger(
						'chosen:styleUpdated');
				$('#' + lob.id + '_chosen a').addClass('inlineError');
				msg = msg + lobMsg;
			}

			if (!$('tr#stateRow').hasClass('hidden')) {
				stateMsg = requiredNQValue(stateNQ, "newQuoteStateCol");
				if (stateMsg != "") {
					$(stateNQ).addClass("inlineError").trigger('chosen:updated')
							.trigger('chosen:styleUpdated');
					$('#' + stateNQ.id + '_chosen a').addClass('inlineError');
					msg = msg + stateMsg;
				}
			}

			if (!$('tr#effDateRow').hasClass('hidden')) {
				effDtMsg = validateNewQuoteDate(effDate, "newQuoteCol");
				if (effDtMsg != "") {
					msg = msg + effDtMsg;
				}
			}

			if (!$('tr#agencyProfileRow').hasClass('hidden')) {
				branchMsg = requiredNQValue(agencyProfile, "newQuoteAgencyCol");
				if (branchMsg != "") {
					$(agencyProfile).addClass("inlineError").trigger(
							'chosen:updated').trigger('chosen:styleUpdated');
					$('#' + agencyProfile.id + '_chosen a').addClass('inlineError');
					msg = msg + branchMsg;
				}
			}

			if (!$('tr#productRow').hasClass('hidden')) {
				productMsg = requiredNQValue(product, "newQuoteProdCol");
				if (productMsg != "") {
					$(product).addClass("inlineError").trigger('chosen:updated')
							.trigger('chosen:styleUpdated');
					$('#' + product.id + '_chosen a').addClass('inlineError');
					msg = msg + productMsg;
				}
			}

			if (msg != "") {
				return false;
			} else {
				$('#newQuoteDialog').modal('hide');
				ghFunctn = partial(submitNewQuoteDialog);
				var url = document.actionForm.newQuoteURL.value;
				document.newQuoteForm.action = url;
			
				if (exitPromptRequired(false)) {
					showExitPrompt(ghFunctn, false, "", event, true);
					return false;
				} else {
					showLoadingMsg();
					return true;
				}
			}
		}
	}
}

function submitNewQuoteDialog() {
	// will need to check with state implementations - jgarrison
	if(isNewHomeNQProduct()){
		chkCreditIssueForHome();
	}else{
		document.newQuoteForm.submit();
	}
}

function populateNewQuoteTypeAction(id) {
	var quoteType;
	if (id == 'submitNewApplication') {
		quoteType = "newApplication";
	} else {
		quoteType = "newQuote";
	}
	$('#newQuoteForm [id="newQuoteType"]').val(quoteType);
}

function displayNewQuoteDialog() {
	var dateLabel = "mm/dd/yyyy";

	// console.log('-- displayNewQuoteDialog start --');
	// clear fields
	clearModalErrors('newQuoteForm', false);
	$('#productNQLiteral').removeClass("inlineError");
	$('#agencyProfileNQLiteral').removeClass("inlineError");
	$('#newQuoteForm [id="policyEffectiveDateNQ"]').val(dateLabel).addClass(
			'watermark');

	// $('#stateNQ').empty();
	$('#stateNQ').html("");
	$('#stateNQ').append($("<option value=''>--Select--</option>"));
	$('#stateNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#stateNQLabel').text('');
	$('#stateNQ_hidden').val('');
	$('#stateNQSelect').removeClass("hidden");
	$('#stateNQLiteral').addClass("hidden");

	$('#effDateRow').addClass("hidden");

	if (!isEmployeeCurrentProfile()) {
		// $('#agencyProfileNQ').empty();
		$('#agencyProfileNQ').html("");
		$('#agencyProfileNQ').append($("<option value=''>--Select--</option>"));
		$('#agencyProfileNQ').trigger('chosen:updated').trigger(
				'chosen:styleUpdated');
		$('#agencyProfileNQLabel').text('');
		$('#agencyProfileNQ_hidden').val('');
		$('#agencyProfileNQSelect').removeClass("hidden");
		$('#agencyProfileNQLiteral').addClass("hidden");
	}

	$('#productRow').addClass("hidden");
	// $('#productNQ').empty();
	$('#productNQ').html("");
	$('#productNQ').append($("<option value=''>--Select--</option>"));
	$('#productNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#productNQLabel').text('');
	$('#productNQ_hidden').val('');
	$('#productNQSelect').removeClass("hidden");
	$('#productNQLiteral').addClass("hidden");
	
	// new co fields
	$('#newQuoteText').addClass("hidden");
	$('#policyTypeNewCo').val('HO3');
	$('#firstNameNewCo').val('');
	$('#lastNameNewCo').val('');
	$('#dobNewCo').val('');
	$('#fullAddressNewCo').val('');
	$('#policyEffectiveDateNewCo').val('');
	$('.addressOption').remove(); 
	$('#addressKey').val();
	$('#addressSelected').val();
	if(isEmployee() && !isEmployeeCurrentProfile()){
		$('#branchNewCoLiteral').html("");
		$('#branchNewCoHidden').val('');
		$('#branchNewCo').html("");
		$('#branchLevelCodeNewCo').val('');
		$('#branchNewCo').append($("<option value=''>--Select--</option>"));
		$('#branchNewCo').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#agencyNewCoHidden').val('');
		$('#agencyNewCo').html("");
		$('#agencyNewCo').append($("<option value=''>--Select--</option>"));
		$('#agencyNewCo').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#agencyNewCoLiteral').html("");
		$('#agencyLevelCodeNewCo').val('');
		$('#agencyCompanyIdNewCo').val('');
		$('#agencyChannelNewCo').val('');
	}else{
		$('#producerNewCoRow').addClass("hidden");
	}
	
	if(isEmployeeCurrentProfile() && $('#producerNewCoHidden').val() != ""){
		// employee has assumed a level 3 profile, leave producer fields alone
	}else{
		$('#producerNewCoLiteral').html("");
		$('#producerNewCoHidden').val('');
		$('#companyIdNewCo').val('');
		$('#channelNewCo').val('');
		$('#uwCompanyNewCo').val('');
		$('#producerLevelCodeNewCo').val('');
		$('#producerNewCo').html("");
		$('#producerNewCo').append($("<option value=''>--Select--</option>"));
		$('#producerNewCo').trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	setLOBDefault();
	
	// store previous LOB dd in case we need to reload them again
	var lobDDHTML = $('#lobNQ').html();
	$('#hiddenLob').text(lobDDHTML);

	$('#newQuoteDialog').modal('show');
}

function isRolledOutLOB(lob, state){
	if(lob == "HO"){
		return false;
	}else if(lob == "CA" || lob == "DF"){
		return false;
	}
	
	return true;
}

function setLOBDefault() {
	var lobDD = $('#newQuoteForm [id="lobNQ"]');
	var firstEnabledIndex;
	// console.log('setLOBDefault lobDD ='+lobDD);
	$('#lobNQLabel').removeClass("hidden");

	if (lobDD.is("select")) {
		var enabledOptions = $(lobDD).find('option:not(:disabled)').length;

		$("#newQuoteForm [id='lobNQ'] option:not(:disabled)").each(function() {
			if (this.value != "") {
				firstEnabledIndex = $(this).index();
				return false;
			}
		});

		if (hasCurrentProfile() && enabledOptions > 2) {
			lobDD.trigger("blur");
			// lobDD.prop("selectedIndex", 0).trigger("blur");
		} else {
			lobDD.prop("selectedIndex", firstEnabledIndex).trigger("blur");
		}
	}

	// get states if we have selected LOB option
	var lobOption = lobDD.val();
	if (lobOption != "") {
		// console.log('getNQStates start');
		getNQStates(lobOption);
	}
}

function getNQState(){
	var state = $('#stateNQ_hidden').val();
	if(state == ""){
		state = $('#stateNQ').val();
	}
	
	return state;
}

function getNQLOB(){
	var lobValues = $('#lobNQ').val();
	lobValues = lobValues.split(",");
	return lobValues[0];
}

function getNQStates(lobOption) {
	if (lobOption == "") {
		$('#stateRow').addClass("hidden");
		$('#stateNQ').html("");
		$('#stateNQ').append($("<option value=''>--Select--</option>"));
		$('#stateNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#stateNQLabel').text('');
		$('#stateNQ_hidden').val('');
		$('#stateNQSelect').removeClass("hidden");
		$('#stateNQLiteral').addClass("hidden");
		$('#effDateRow').addClass("hidden");
		$('#agencyProfileRow').addClass("hidden");
		$('#productRow').addClass("hidden");
		$('#newStateQuoteTable').hide();
		$('#newQuoteText').addClass("hidden");
		return;
	}

	var lobValues = lobOption.split(",");
	var lob = lobValues[0];
	var state = $('#stateNQSelect').val();
	var strURL = addRequestParam("/aiui/landing/getNQStates", "lob", lob);
	var stateCode = "";
	
	if(isNewHomeNQProduct()){
		$('#newStateQuoteTable').show();
		$('#newQuoteText').removeClass("hidden");
	} else{
		$('#newStateQuoteTable').hide();
		$('#newQuoteText').addClass("hidden");
	}
	
	// clear fields
	clearModalErrors('newQuoteForm', false);

	$('#stateRow').addClass("hidden");
	$('#stateNQ').html("");
	$('#stateNQ').append($("<option value=''>--Select--</option>"));
	$('#stateNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#stateNQLabel').text('');
	$('#stateNQ_hidden').val('');
	$('#stateNQSelect').removeClass("hidden");
	$('#stateNQLiteral').addClass("hidden");

	$('#effDateRow').addClass("hidden");

	if (!isEmployeeCurrentProfile()) {
		$('#agencyProfileNQ').html("");
		$('#agencyProfileNQ').append($("<option value=''>--Select--</option>"));
		$('#agencyProfileNQ').trigger('chosen:updated').trigger(
				'chosen:styleUpdated');
		$('#agencyProfileNQLabel').text('');
		$('#agencyProfileNQ_hidden').val('');
	}
	$('#agencyProfileRow').addClass("hidden");
	$('#agencyProfileNQLiteral').addClass("hidden");
	$('#agencyProfileNQLiteral').removeClass("inlineError");
	$('#productRow').addClass("hidden");

	// $('#productNQ').empty();
	$('#productNQ').html("");
	$('#productNQ').append($("<option value=''>--Select--</option>"));
	$('#productNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#productNQLabel').text('');
	$('#productNQ_hidden').val('');
	$('#productNQSelect').removeClass("hidden");
	$('#productNQLiteral').addClass("hidden");
	$('#productNQLiteral').removeClass("inlineError");
	$('#submitNewApplication').addClass('hide');

	$.ajax({
		url : strURL,
		type : 'get',
		dataType : 'json',
		cache : false,

		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},

		success : function(data) {
			// console.log('ajax call successful data ='+data);
			if (data.length > 0) {
				$.each(data, function(i) {
					if (data.length > 1) {
						var ddOption;
						if (data[i].defaultIndicator == true) {
							ddOption = '<option value="' + data[i].stateCode
									+ '" selected>' + data[i].stateDescription
									+ '</option>';
							stateCode = data[i].stateCode;
						} else {
							ddOption = '<option value="' + data[i].stateCode
									+ '">' + data[i].stateDescription
									+ '</option>';
						}
						$('#stateNQ').append(ddOption);
					} else {
						stateCode = data[i].stateCode;
						$('#stateNQLabel').text(data[i].stateDescription);
						$('#stateNQ_hidden').val(stateCode);
					}
				});

				if (data.length > 1) {
					$('#stateRow').removeClass("hidden");
					$('#stateNQ').trigger('chosen:updated');
					$('#stateNQSelect').removeClass("hidden");
					$('#stateNQLiteral').addClass("hidden");
				} else {
					$('#stateRow').removeClass("hidden");
					$('#stateNQSelect').addClass("hidden");
					$('#stateNQLiteral').removeClass("hidden");
				}

				if (isRolledOutLOB(lob, stateCode)) {
					$('#effDateRow').removeClass("hidden");
				}

				showHideNQButtons(lob, stateCode);

				// if we have only one state - get Branches/Agency Profiles
				if (stateCode != "") {
					if (!isEmployeeCurrentProfile() || (isNewHomeNQProduct())) {
						getNQAgencyProfiles(stateCode);
					} else {
						if (lob == "PA" || lob == "PCAT") {
							$('#agencyProfileRow').removeClass("hidden");
						}
						$('#agencyProfileNQSelect').addClass("hidden");
						$('#agencyProfileNQLiteral').removeClass("hidden");
						$('#agencyProfileRow').removeClass("hidden");
						getNQProducts();
					}
				} else {
					// lob and state are displayed - don't have agencyProfiles
					// or products yet
					// will be employee or agents who have multiple profiles who
					// has access to multiple states for LOB selected
					$.unblockUI();
				}
			}
		},

		error : function(xhr, status, error) {
			// alert(error);
		},

		complete : function() {
			// $.unblockUI();
		}
	});
}

function getNQProducts() {
	var lobValues = $('#lobNQ').val().split(",");
	var lob = lobValues[0];
	var state = getNQState();

	var agencyProfile = $('#agencyProfileNQ').val();
	if (agencyProfile != "" && agencyProfile != undefined) {
		$('#agencyProfileNQ_hidden').val(agencyProfile);
	}

	// clear fields
	clearModalErrors('newQuoteForm', false);

	// $('#productNQ').empty();
	$('#productNQ').html("");
	$('#productNQ').append($("<option value=''>--Select--</option>"));
	$('#productNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('#productNQLabel').text('');
	$('#productNQ_hidden').val('');
	$('#productNQSelect').removeClass("hidden");
	$('#productNQLiteral').addClass("hidden");
	$('#productNQLiteral').removeClass("inlineError");

	var strURL = addRequestParam("/aiui/landing/getNQProducts", "lob", lob);
	strURL = addRequestParam(strURL, "state", state);

	$.ajax({
		url : strURL,
		type : 'get',
		dataType : 'json',
		cache : false,

		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},

		success : function(data) {
			if (data.length > 0) {
				$.each(data, function(i) {
					if (data.length > 1) {
						var ddOption = '<option value="' + data[i].productCode
								+ '">' + data[i].productDescription
								+ '</option>';
						$('#productNQ').append(ddOption);
					} else {
						$('#productNQLabel').text(data[i].productDescription);
						$('#productNQ_hidden').val(data[i].productCode);
					}
				});

				if (data.length > 1) {
					$('#productNQ').trigger('chosen:updated');
					$('#productNQSelect').removeClass("hidden");
					$('#productNQLiteral').addClass("hidden");
				} else {
					$('#productNQSelect').addClass("hidden");
					$('#productNQLiteral').removeClass("hidden");
				}
			}

			if (isRolledOutLOB(lob, state) && state == "NJ" && lob != "PCAT") {
				$('#productRow').removeClass("hidden");
			}

		},

		error : function(xhr, status, error) {
			// alert(error);
		},

		complete : function() {
			$.unblockUI();
		}
	});
}

function getNQProductValue(productVal) {
	$('#productNQ_hidden').val(productVal);
}

function showHideNQButtons(lob, state) {
	if (lob == "CA" || lob == "DF") {
		$('#submitNewApplication').removeClass('hidden');
		$('#submitNewQuote').addClass('hidden');
		$('#submitQuote').addClass('hidden');
	} else if (lob == "HO" && (state == "NH" || state == "CT" || state == "MA")) {
		$('#submitNewApplication').removeClass('hidden');
		$('#submitNewQuote').addClass('hidden');
		$('#submitQuote').addClass('hidden');
	} else if (lob == "HO" && (state == "PA" || state == "NY")) {
		$('#submitNewApplication').addClass('hidden');
		$('#submitNewQuote').addClass('hidden');
		$('#submitQuote').removeClass('hidden');
	} else {
		$('#submitNewQuote').removeClass('hidden');
		$('#submitNewApplication').addClass('hidden');
		$('#submitQuote').addClass('hidden');
	}
}

function removeLOBBasedOnState(state) {
	var lobVal = $('#lobNQ').val();
	var strLOBDDOptions = $('#hiddenLob').text();

	/* Remove comm auto if (NH or PA) or Home if CT is selected - TD 57475 */
	if ((state == "NH" || state=="PA" || state=="NY") && strLOBDDOptions.indexOf("Commercial Auto")) {
		strLOBDDOptions = strLOBDDOptions.replaceAll(
				"<option value=\"CA,No\">Commercial Auto</option>", "");
		strLOBDDOptions = strLOBDDOptions.replaceAll(
				"<option value=\"CA,Yes\">Commercial Auto</option>", "");
	} else if (state == "CT" && strLOBDDOptions.indexOf("Home")) {
		strLOBDDOptions = strLOBDDOptions.replaceAll(
				"<option value=\"HO,No\">Home</option>", "");
		strLOBDDOptions = strLOBDDOptions.replaceAll(
				"<option value=\"HO,Yes\">Home</option>", "");
	}

	// reload LOB dropdown
	$('#lobNQ').html("");
	$('#lobNQ').append($(strLOBDDOptions));
	$('#lobNQ').val(lobVal);
	$('#lobNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
}

function getNQAgencyProfiles(state) {

	//removeLOBBasedOnState(state);
	
	// will populate branch or agency profile dropdown
	var strPath;
	var lobValues = $('#lobNQ').val().split(",");
	var lob = lobValues[0];
	var blnPrimeHome = false;

	if(isNewHomeNQProduct()){
		blnPrimeHome = true;
	}

	if (state == "") {
		$('#agencyProfileRow').addClass("hidden");
		$('#productRow').addClass("hidden");
		return;
	} else if (isEmployeeCurrentProfile() && !blnPrimeHome) {
		$('#agencyProfileRow').removeClass("hidden");
		$('#agencyProfileNQSelect').addClass("hidden");
		$('#agencyProfileNQLiteral').removeClass("hidden");
		getNQProducts();
		return;
	}

	if (blnPrimeHome) {
		changeHomeNQView($("input[name='policyTypeNewCo']:checked").val()); // control view by policy type
		$('#agencyProfileRow').addClass("hidden");
		$('#newQuoteText').removeClass("hidden");
		$('#newStateQuoteTable').show();
		$('#showEmpAgency').hide();
		$('#showEmpProducer').hide();
		// default date for effective date
		var policyForm = $("input[name='policyTypeNewCo']:checked").val();
		var effectiveDate = new Date();
		//console.log('effectiveDate', effectiveDate);
		var day = effectiveDate.getDate();
		var month = effectiveDate.getMonth() + 1;
		if (day < 10) {
			day = '0' + day;
		}
		if (month < 10) {
			month = '0' + month;
		}
		var year = effectiveDate.getFullYear();
		var today =  month.toString() + '/' + day.toString() + '/' + year.toString();
		
		if (policyForm == 'HO4' && $("#homeEffDateValidation").val() == 'Yes' && new Date().valueOf() < new Date('2017/07/01 00:00:00').valueOf()) {
			$('#policyEffectiveDateNewCo').val("07/01/2017");
		}else if (policyForm == 'HO3' && $("#homeEffDateValidation").val() == 'Yes' && new Date().valueOf() < new Date('2017/08/01 00:00:00').valueOf()){
			$('#policyEffectiveDateNewCo').val("08/01/2017");
		}else {
			$('#policyEffectiveDateNewCo').val(today);
		} 
		
		if(isEmployee()){
			if(isEmployeeCurrentProfile()){
				// display agency row with literal
				$('#oneAgencyNewCo').removeClass('hidden');
				$('#agencyNewCoDD').addClass('hidden');
				if($('#producerNewCoHidden').val() != ""){
					// L3 Profile - no need to go to ADR, just show literal
					$('#oneProducerNewCo').removeClass('hidden');
					$('#producerNewCoDD').addClass('hidden');
				}else{
					// get producers from ADR
					setNewCoProducers($('#agencyNewCoHidden').val(), $('#agencyCompanyIdNewCo').val(), $('#agencyChannelNewCo').val(), state, 
							getNQLOB(), $('#agencyNewCoHidden'), $('#producerNewCo'), $('#policyEffectiveDateNewCo'), false, true, true);
				}
			}else{
				setNewCoBranches(state, lob, $('#branchNewCo'), $('#agencyNewCo'), $('#producerNewCo'), $('#policyEffectiveDateNewCo'));
			}
		}else{
			// agent login - get producers
			setNewCoProducersForAgent(state, lob, $('#producerNewCo'), $('#policyEffectiveDateNewCo'), false, true, true);
		}
	} else {
		$('#newStateQuoteTable').hide();
		$('#newQuoteText').addClass("hidden");
		
	}

	// clear fields
	clearModalErrors('newQuoteForm', false);
	
	showHideNQButtons(lob, state);

	if (!(isNewHomeNQProduct())) {
		$('#agencyProfileRow').addClass("hidden");
		$('#agencyProfileNQ').html("");
		$('#agencyProfileNQ').append($("<option value=''>--Select--</option>"));
		$('#agencyProfileNQ').trigger('chosen:updated').trigger(
				'chosen:styleUpdated');
		$('#agencyProfileNQLabel').text('');
		$('#agencyProfileNQ_hidden').val('');
		$('#agencyProfileNQLiteral').addClass("hidden");
		$('#agencyProfileNQLiteral').removeClass("inlineError");
	
		$('#productRow').addClass("hidden");
		$('#productNQ').html("");
		$('#productNQ').append($("<option value=''>--Select--</option>"));
		$('#productNQ').trigger('chosen:updated').trigger('chosen:styleUpdated');
		$('#productNQLabel').text('');
		$('#productNQ_hidden').val('');
		$('#productNQSelect').removeClass("hidden");
		$('#productNQLiteral').addClass("hidden");
		$('#productNQLiteral').removeClass("inlineError");

		if (isEmployee()) {
			strPath = "getNQBranches";
		} else {
			strPath = "getNQAgencyProfiles";
		}

		var strURL = addRequestParam("/aiui/landing/" + strPath, "lob", lob);
		strURL = addRequestParam(strURL, "state", state);

		if (typeof requestAgencyProfiles != "undefined"
				&& requestAgencyProfiles.readyState !== 4) {
			// Previous request needs to be aborted as user has changed LOB without
			// prior request being completed
			requestAgencyProfiles.abort();
		}

		requestAgencyProfiles = getAgencyProfiles(strURL, lob, state);
	}
}

var getAgencyProfiles = function(strURL, lob, state) {
	var request = $
			.ajax({
				url : strURL,
				type : 'get',
				dataType : 'json',
				cache : false,

				beforeSend : function(status, xhr) {
					showLoadingMsg();
				},

				success : function(data) {
					if (data.length > 0) {
						$
								.each(
										data,
										function(i) {
											if (isEmployee()) {
												sValue = data[i].branchId
														+ ','
														+ data[i].companyCorporationId
														+ ','
														+ data[i].channelCode;
											} else {
												sValue = data[i].agencyHierarchyId
														+ ','
														+ data[i].companyId
														+ ','
														+ data[i].channelCode;
											}

											sValue = sValue + ','
													+ data[i].branchId + ','
													+ data[i].agencyId + ','
													+ data[i].producerId;

											sName = data[i].name;
											if(!isEmployee() && ('BK' == data[i].companyCode || 'PR' == data[i].companyCode)) {
												sName = data[i].name + " - "+ data[i].companyCode;
											}

											if (data.length > 1) {
												var ddOption = '<option value="'
														+ sValue
														+ '">'
														+ sName
														+ '</option>';
												$('#agencyProfileNQ').append(
														ddOption);
											} else {
												$('#agencyProfileNQLabel')
														.text(sName);
												$('#agencyProfileNQ_hidden')
														.val(sValue);
											}
										});

						if (data.length > 1) {
							$('#agencyProfileNQ').trigger('chosen:updated');
							$('#agencyProfileNQSelect').removeClass("hidden");
							$('#agencyProfileNQLiteral').addClass("hidden");
							$('#agencyProfileRow').removeClass("hidden");
						} else {
							$('#agencyProfileNQSelect').addClass("hidden");
							$('#agencyProfileNQLiteral').removeClass("hidden");
							if (isEmployee() && lob != "PA" && lob != "PCAT") {
							} else {
								$('#agencyProfileRow').removeClass("hidden");
							}
						}

						getNQProducts();
					}

				},

				error : function(xhr, status, error) {
					// alert(error);
				},

				complete : function() {
					$.unblockUI();
				}
			});

	return request;
};

function notValidProducer(agency, effDate, state, product, errorCol) {
	var agencyValues;
	var hasProducers = true;
	var policyEffDate = $(effDate).val();
	var agency = $(agency).val();
	var state = $(state).val();
	var disablePrimeRole = document.actionForm.disablePrimeNBRole.value;
	var companyId = "";

	if (agency != "") {
		agencyValues = agency.split(",");
		agency = parseInt(agencyValues[0]);
		companyId = parseInt(agencyValues[1]);
	} else {
		return hasProducers;
	}

	var strURL = addRequestParam("/aiui/landing/hasNBProducers",
			"agencyHierarchyId", agency);
	strURL = addRequestParam(strURL, "companyId", companyId);
	strURL = addRequestParam(strURL, "productCd", $(product).val());
	strURL = addRequestParam(strURL, "policyEffDate", policyEffDate);
	strURL = addRequestParam(strURL, "state", state);
	strURL = addRequestParam(strURL, "isNewBusiness", "true");
	strURL = addRequestParam(strURL, "noAccessPrime", disablePrimeRole);

	$.ajax({
		url : strURL,
		type : 'get',
		async : false,
		cache : false,
		// dataType: 'json',

		beforeSend : function(status, xhr) {
			// showLoadingMsg();
		},

		success : function(data) {
			if (data.length > 0) {
				invalidProduct(product, errorCol, data);
				hasProducers = false;
			}
		},

		error : function(xhr, status, error) {
			// alert(error);
		},

		complete : function() {
			// $.unblockUI();
		}
	});

	return hasProducers;
}

/* New Quote Dialog validation */
function validateNQDate(effDate, rowId) {
	validateNewQuoteDate(effDate, rowId);
}

function validateNewQuoteDate(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidNewQuoteEffDate('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function isValidNewQuoteEffDate(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var name = $(elementId).val();
	var errorMessageID = '';
	var policyForm = $("input[name='policyTypeNewCo']:checked").val();

	if (name == null || name == 'Optional') {
		errorMessageID = '';
	} else {
		if (!isValidNewQuoteDate(name, elementId)) {
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else if (strErrorTag == 'dobNewCo.browser.inLine' ){
			errorMessageID = isDOBValidRange(name);
			if (errorMessageID == 'invalidMinValue' || errorMessageID == 'invalidMaxValue' ) {
				errorMessageID = strErrorTag + '.' + errorMessageID;
			} else {
				errorMessageID = '';
			}
		}else if (strErrorTag == 'dobNewCo.browser.inLine' && !isDOBValidMaxValue(name)){
			errorMessageID = 'invalidMaxValue';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else if (strErrorTag == 'policyEffectiveDateNewCo.browser.inLine' && policyForm == 'HO4' && $("#homeEffDateValidation").val() == 'Yes' && new Date(name).valueOf() < new Date('2017/07/01 00:00:00').valueOf()){
			errorMessageID = 'priorDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else if (strErrorTag == 'policyEffectiveDateNewCo.browser.inLine' && policyForm == 'HO3' && $("#homeEffDateValidation").val() == 'Yes' && new Date(name).valueOf() < new Date('2017/08/01 00:00:00').valueOf()){
			errorMessageID = 'priorDateHO3';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else if (strErrorTag == 'policyEffectiveDateNewCo.browser.inLine' && policyForm == 'HO6' && new Date(name).valueOf() < new Date('2018/01/01 00:00:00').valueOf()){
			errorMessageID = 'priorDateHO6';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else {
			errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function requiredNQValue(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isInvalidNQValue('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function isDOBValidRange(name) {
	//birth date validation
	
	var parts = name.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10); //1998

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
    // Check the range of the day
    if(day > 0 && day <= monthLength[month - 1]){
    	//return ''
    }
    else{
    		return 'Invalid';
    }
    //pass birth date and validate against policy eff date Or current day
    strMsg = checkMinMaxAgeViolation(year,month,day);
    return strMsg;
	
}

//Check if policy effective is present if not take the current date
function checkMinMaxAgeViolation(year,month,day){
	var strMsg = '';
	 var currentDate = new XDate().toString('MM/dd/yyyy');
	 var currentDateArr = currentDate.split("/");
	var current_year = parseInt(currentDateArr[2]);
	var current_day = parseInt(currentDateArr[1]);
	var current_month = parseInt(currentDateArr[0]);
	
	var age = current_year - year;
    if(month > current_month){
    	age = age - 1;
    }
    else if(month == current_month && day > current_day){
    	age = age - 1;
    };

    if(parseInt(age)<18){
    	strMsg='invalidMinValue';
    } else if (parseInt(age)>100) {
    	strMsg='invalidMaxValue';
    }

    return strMsg;
}

function isInvalidNQValue(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var name = $(elementId).val();
	var errorMessageID = '';

	if (name == null || name == 'Optional') {
		errorMessageID = '';
	} else {
		if (name == "") {
			errorMessageID = 'InvalidNQValue';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function invalidProduct(nameID, rowType, errorMessageID) {
	var strID = $(nameID).attr("id");
	return isInvalidProduct('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '', errorMessageID);
}

function isInvalidProduct(name, elementId, strRequired, strErrorTag,
		strErrorRow, index, errorMessageID) {
	errorMessageID = strErrorTag + '.' + errorMessageID;
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

/* Advanced Policy Search functionality */
function openAdvPolicySearch() {
	var searchStr = $('#globalSearchInput').val();
	var searchIn = $('#searchIn').val();
	var tabAdvSearch = searchIn + "_advSearch";

	$('.popover').hide();

	// watermark date fields
	$('#effDateFrom').watermark('From');
	$('#effDateTo').watermark('To');

	// check if adv search has been performed already
	if (hasPerformedAdvSearchForTab(tabAdvSearch)) {
		populateAdvSearchFromStorage(tabAdvSearch);
		$('.policySelect').trigger('chosen:updated').trigger(
				'chosen:styleUpdated');
	} else {
		// set defaults
		setDefaultAdvancedSearchType(searchIn);

		$('#policyStatus').prop("selectedIndex", 0).trigger("blur");
		$('#policyState').prop("selectedIndex", 0).trigger("blur");
		$('.policySelect').trigger('chosen:updated').trigger(
				'chosen:styleUpdated');

		// populate with value entered in global search
		populatePolicyAdvSearchFromGlobalSearch(searchStr);
	}

	// zip
	$(".clsZip").bind(
			{
				'keyup keypress' : function(event) {
					if (event.keyCode == 46 || event.keyCode == 8
							|| event.keyCode > 112) {
					}
					var regex = new RegExp(/[^0-9]/g);
					var containsNonNumeric = this.value.match(regex);
					if (containsNonNumeric)
						this.value = this.value.replace(regex, '');
				}
			});

	$("#policySearchModal").modal('show');
}

function changePolicyAdvSearchForm(selValue) {
	// clear all error messaging
	clearModalErrors('advSearchPolicyForm', false);

	switch (selValue) {
	case "Claims":
		$('.policyField').addClass("hidden");
		$('.policySelect').trigger('chosen:updated');
		$('.paymentField').addClass("hidden");
		$('.claimsField').removeClass("hidden");
		$('.policyCityState').removeClass("hidden");
		$('.policyZip').removeClass("hidden");
		// $('.polClsDate').removeClass("hidden");
		/*
		 * $('.polClsDate').datepicker({ showOn: "button",buttonImage:
		 * calendarImage,buttonImageOnly:true,buttonText : 'Open calendar' });
		 */
		break;
	case "Review Payments":
	case "ReviewPayments":
		$('.policyField').addClass("hidden");
		$('.policySelect').trigger('chosen:updated');
		$('.paymentField').removeClass("hidden");
		$('.claimsField').addClass("hidden");
		$('.policyCityState').addClass("hidden");
		$('.policyZip').addClass("hidden");
		// $('.polClsDate').removeClass("hidden");
		/*
		 * $('.polClsDate').datepicker({ showOn: "button",buttonImage:
		 * calendarImage,buttonImageOnly:true,buttonText : 'Open calendar' });
		 */
		break;
	default:
		$('.policyField').removeClass("hidden");
		// $('.polClsDate').addClass("hidden");
		// $('.polClsDate').datepicker("destroy");
		$('.policySelect').trigger('chosen:updated');
		$('.paymentField').addClass("hidden");
		$('.claimsField').addClass("hidden");
		$('.policyCityState').removeClass("hidden");
		$('.policyZip').removeClass("hidden");
	}

	if (hasBusinessNameAccess) {
		if (isBusinessNameDisplaybleForType(selValue)) {
			$('.clsBusinessName').removeClass("hidden");
		} else {
			// hide if not hidden
			if (!$('.clsBusinessName').hasClass("hidden")) {
				$('#businessName').val("");
				$('.clsBusinessName').addClass("hidden");
			}
		}
	}
}

function hasBusinessNameAccess() {
	return ($("#businessName").length > 0) ? true : false;
}

function isBusinessNameDisplaybleForType(searchType) {
	var returnVal = false;

	if (hasBusinessNameAccess) {
		if (searchType == 'Policy' || searchType == 'Billing'
				|| searchType == 'Make A Payment' || searchType == 'Documents') {
			returnVal = true;
		}
	}

	return returnVal;
}

function populatePolicyAdvSearchFromGlobalSearch(searchStr) {
	var name, lname, fname;

	if (searchStr != null && searchStr != '') {
		searchStr = $.trim(searchStr.replaceAll("*", ""));

		if (isPolicyNumber(searchStr)) {
			$('#advSearchPolicyForm input[id="qnumber"]').val(searchStr);
		} else {
			if (lastNameHasComma(searchStr)) {
				name = searchStr.split(",");
				lname = name[0];
				fname = name[1];

				$('#advSearchPolicyForm input[id="lname"]').val(lname);
				if (fname != undefined && fname != "") {
					fname = $.trim(fname);
					$('#advSearchPolicyForm input[id="fname"]').val(fname);
				}
			} else {
				$('#advSearchPolicyForm input[id="lname"]').val(searchStr);
			}
		}
	}
}

function submitAdvancedPolicySearch() {
	var charIndxPos;
	var op = "";
	var currentPage = 1;
	var rows = 100;
	var search = "true";
	var advSearchType;
	var strSource = $('input#searchRequestSource').val();
	var searchStr = $.trim($('#globalSearchInput').val());
	var srchType = $('select#searchType').val();
	var searchIn = getAdvSearchType(srchType);
	var advSearchKey = searchIn + "_advSearch";
	var blnReloadGrid = false;
	var dataStorage = {};
	dataStorage = [];

	// set flag to determine whether we should just reload grid or not
	if ((strSource.toUpperCase() == "POLICYSEARCH" && srchType.toUpperCase() != "CLAIMS")
			|| (strSource.toUpperCase() == "CLAIMSEARCH" && srchType
					.toUpperCase() == "CLAIMS")) {
		blnReloadGrid = true;
	}

	if (!validateAdvSearchForm()) {
		return;
	} else {
		$(".modal").modal('hide');

		// build query string
		var strURL = addRequestParam(getAdvSearchURL(searchIn), "_search",
				search);
		strURL = addRequestParam(strURL, "rows", rows);
		strURL = addRequestParam(strURL, "page", currentPage);

		$('#advSearchPolicyForm :input').each(function() {
			// if(this.id.indexOf("ddcl") == -1){
			var id = this.id;
			var val = $(this).val();
			if (val == null) {
				val = "";
			}

			// build advanced search results for storage
			if ($(this).hasClass("locStorage")) {
				var objLS = {};
				objLS.id = id;
				objLS.value = val;
				dataStorage.push(objLS);
			}

			// search on should be stored for search results
			if (id == "searchType") {
				document.actionForm.quickLinksAction.value = val;
			}

			if (id == "policyState") {
				id = "state";
			}

			// build querystring to send adv search results to controller
			if (!$(this).hasClass('noSubmit')) {

				// strip out / in date
				if ($(this).hasClass("clsDate")) {
					val = val.replaceAll("/", "");
				}

				// check for wildcard and set operator
				if ($(this).attr("type") == "text") {
					charIndxPos = val.indexOf("*");
					if (charIndxPos != -1) {
						op = "LIKE";
					}
				}

				strURL = strURL + "&" + id + "=" + encodeURI(val);
			}
			// }
		});

		// store advanced search results in storage
		if (browserAcceptLocalStorage()) {
			sessionStorage.setItem(advSearchKey, JSON.stringify(dataStorage));
		}

		// add operator to querystring
		strURL = strURL + "&op=" + op;
		strURL = addRequestParam(strURL, "searchIn", searchIn);

		if (searchIn == SearchInEnum.CLAIMS) {
			advSearchType = globalSearchType.ADVCLAIMSSEARCH;
		} else if (searchIn == SearchInEnum.ENDORSEMENT) {
			advSearchType = globalSearchType.ADVENDORSEMENTSEARCH;
		} else {
			advSearchType = globalSearchType.ADVPOLICYSEARCH;
		}

		// check if review payments was searched on, if so, redirect to legacy
		// webpay
		if (srchType.toUpperCase() == "REVIEW PAYMENTS") {
			// TD 62973 -- Added block UI
			showLoadingMsg();
			document.actionForm.policyNumber.value = $("input#qnumber").val();
			document.actionForm.opCompany.value = $("#opCompanyAdvSearch")
					.val();
			document.actionForm.lastName.value = $("input#lname").val();
			document.actionForm.firstName.value = $("input#fname").val();
			document.actionForm.fromDate.value = $("input#effDateFrom").val();
			document.actionForm.toDate.value = $("input#effDateTo").val();
			document.actionForm.confirmationId.value = $("input#confirmationId")
					.val();
			document.actionForm.userAction.value = srchType;
			document.actionForm.searchIn.value = searchIn;
			document.actionForm.action = document.actionForm.primeWebPayURL.value;
			document.actionForm.method = "POST";
			document.actionForm.submit();
			return;
		}

		if (blnReloadGrid) {
			document.actionForm.policyStatusSearch.value = "";

			// set eFNOL flag if needed
			if (srchType.toUpperCase() == "REPORT A CLAIM") {
				document.actionForm.showEFNOL.value = "Y";
			} else {
				document.actionForm.showEFNOL.value = "N";
			}

			// Policy Advanced Search, load grid
			gridReload(strURL, rows, searchIn, true);

		} else {

			// Policy Advanced Search
			$.ajax({
				url : strURL,
				type : 'get',
				dataType : 'json',
				cache : false,

				beforeSend : function(xhr) {
					// $(".modal").modal('hide');
					showLoadingMsg();
				},

				success : function(data) {
					submitGlobalSearch(advSearchType, searchStr);
				},

				error : function(xhr, status, error) {
					// still go to search results grid and show error
					submitGlobalSearch(advSearchType, searchStr);
				},

				complete : function() {
					$.unblockUI();
				}
			});
		}
	}
}

function getAdvSearchURL(SearchIn) {
	if (SearchIn == SearchInEnum.CLAIMS) {
		return "/aiui/search/claim/data";
	} else {
		return "/aiui/search/policy/data";
	}
}

function getAdvSearchType(advSearchType) {
	switch (advSearchType) {
	case "Review Payments":
	case "ReviewPayments":
		advSearchType = SearchInEnum.WEBPAY;
		break;
	case "Claims":
		advSearchType = SearchInEnum.CLAIMS;
		break;
	case "Endorsement":
		advSearchType = SearchInEnum.ENDORSEMENT;
		break;
	case "Quote":
		advSearchType = SearchInEnum.QUOTE;
		break;
	default:
		advSearchType = SearchInEnum.POLICY;
	}
	return advSearchType;
}

function setDefaultAdvancedSearchType(advSearchType) {
	switch (advSearchType) {
	case SearchInEnum.WEBPAY:
		advSearchType = "Review Payments";
		break;
	case SearchInEnum.CLAIMS:
		advSearchType = "Claims";
		break;
	case SearchInEnum.ENDORSEMENT:
		advSearchType = "Endorsement";
		break;
	default:
		advSearchType = "Policy";
	}

	$('#searchType').val(advSearchType);
	changePolicyAdvSearchForm(advSearchType);
}

function clearPolAdvSearch() {
	var searchIn = $('#searchIn').val();
	var tabAdvSearch = searchIn + "_advSearch";

	showLoadingMsg();
	clearAdvSearchForTab(tabAdvSearch);
	closeAdvSearch("advSearchPolicyForm");
	$('#clearAdvPolSearch').hide();
	$.unblockUI();
}

function populateAdvSearchFromStorage(tabAdvSearch) {
	var strJSON = sessionStorage.getItem(tabAdvSearch);
	var obj = $.parseJSON(strJSON);

	$.each(obj,
			function() {
				var id = this.id;
				var value = String(this.value);
				var charIndxPos = value.indexOf(",");

				if (id == "keyword") {
					parseKeywordForAdvSearch(value, 'advSearchPolicyForm');
				} else {
					if (id == "fromDate") {
						id = "effDateFrom";
					}
					if (id == "toDate") {
						id = "effDateTo";
					}

					var elm = $('#advSearchPolicyForm').find(
							":input[id='" + id + "']");
					if (charIndxPos != -1) {
						var options = value.split(',');
						$(elm).val(options);
					} else {
						$(elm).val(value);
					}

					// show/hide fields based on search type
					if (id == "searchType") {
						changePolicyAdvSearchForm(value);
					}
				}

			});
}

/* Policy Advanced Search Validation */
function noFieldsEntered() {
	var id, value;
	var blnFieldsEntered = false;
	var count = 0;

	// more than one field must be entered/selected to process form
	$('#advSearchPolicyForm :input:not([type=hidden])').each(function() {
		id = this.id;
		if (id != "searchType" && id != "policyState") {
			value = $(this).val();
			if (value != "" && value != null) {
				count++;
			}
		}
	});

	if (count > 1) {
		blnFieldsEntered = true;
	}

	return blnFieldsEntered;
}

function validateAdvSearchForm() {
	var msg = "";
	var fname = $('#advSearchPolicyForm input[id="fname"]');
	var lname = $('#advSearchPolicyForm input[id="lname"]');
	var city = $('#advSearchPolicyForm input[id="policyCity"]');
	var qnumber = $('#advSearchPolicyForm input[id="qnumber"]');
	var claimnumber = $('#advSearchPolicyForm input[id="claimNumber"]');
	var effDtTo = $('#advSearchPolicyForm input[id="effDateTo"]');
	var effDtFrom = $('#advSearchPolicyForm input[id="effDateFrom"]');
	var opCompany = $('#opCompanyAdvSearch');
	var srchType = $('select#searchType').val();
	var businessName = $('#advSearchPolicyForm input[id="businessName"]');

	// clear all error messaging
	clearModalErrors('advSearchPolicyForm', false);

	if (srchType == "Claims" && $(lname).val() == "" && $(qnumber).val() == ""
			&& $(claimnumber).val() == "") {
		if (noFieldsEntered()) {
			// user entered data in atleast another field
			msg = "Policy #, Claim# or Last Name is required";
		} else {
			msg = "Please enter a valid search criteria";

		}

		$(lname).addClass("inlineError");
		$(qnumber).addClass("inlineError");
		$(claimnumber).addClass("inlineError");

		if (msg != "") {
			msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;" + msg;
			$(".errorAlertMsg").html(msg);
			$(".errorAlertMsg").addClass('inlineErrorMsg')
					.removeClass("hidden");
		}
	} else if (!noFieldsEntered()) {
		msg = "Please enter a valid search criteria";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;"
				+ msg;
		$(".errorAlertMsg").html(msg);
		$(".errorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");
		$(lname).addClass("inlineError");
		$(qnumber).addClass("inlineError");
		if (isBusinessNameDisplaybleForType(srchType)) {
			$(businessName).addClass("inlineError");
		}
	} else if (noEnterBothDates(effDtTo, effDtFrom)) {
		if (effDtTo == "") {
			msg = noAdvSrchDate(effDtFrom, "showUnderCellEffDate");
		} else {
			msg = noAdvSrchDate(effDtTo, "showUnderCellEffDate");
		}
	} else if ((srchType != "Claims" && srchType != "Review Payments")
			&& $(lname).val() == "" && $(qnumber).val() == "") {

		if (isBusinessNameDisplaybleForType(srchType)) {
			if ($(businessName).val() == "") {
				msg = "Last name Or Business name is required";
				$(businessName).addClass("inlineError");
			} else {
				msg = "";
			}
		} else {
			msg = "Last name is required";
		}

		if (msg != "") {
			msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;" + msg;
			$(".errorAlertMsg").html(msg);
			$(".errorAlertMsg").addClass('inlineErrorMsg')
					.removeClass("hidden");
			$(lname).addClass("inlineError");
		}
	} else if ((srchType == "Review Payments")
			&& (validateAdvSrchOpCompany(opCompany, "showUnderCellOpCompany") != "")) {
		msg = "Please select an Operating Company";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;"
				+ msg;
		$(".errorAlertMsg").html(msg);
		$(".errorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");
		$('#opCompanyAdvSearch').addClass("inlineError").trigger(
				'chosen:updated').trigger('chosen:styleUpdated');
	} else {
		msg = msg + validateAdvSrchName(fname, "showUnderCellName");
		msg = msg + validateAdvSrchName(lname, "showUnderCellName");
		msg = msg + validateAdvSrchCity(city, "showUnderCellCity");
		if (srchType == "Claims") {
			msg = msg
					+ validateAdvSrchClaimDate(effDtTo, "showUnderCellEffDate");
			msg = msg
					+ validateAdvSrchClaimDate(effDtFrom,
							"showUnderCellEffDate");
		} else {
			msg = msg + validateAdvSrchDate(effDtTo, "showUnderCellEffDate");
			msg = msg + validateAdvSrchDate(effDtFrom, "showUnderCellEffDate");
		}
	}

	if (msg != "") {
		return false;
	} else {
		return true;
	}
}

function noEnterBothDates(dt1, dt2) {
	blnEnterBothDates = false;

	if ((dt1 != "" && dt2 == "") || (dt1 == "" && dt2 != "")) {
		blnEnterBothDates = true;
	}

	return blnEnterBothDates;
}

function validateAdvSrchName(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidAdvSrchName('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function validateAdvSrchCity(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidAdvSrchCity('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function validateAdvSrchOpCompany(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidAdvSrchOpCompany('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function validateAdvSrchClaimDate(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidAdvSrchClaimDate('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function validateAdvSrchDate(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidAdvSrchDate('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function noAdvSrchDate(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isNoAdvSrchDate('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function isNoAdvSrchDate(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {

	var errorMessageID = 'NoDate';
	errorMessageID = strErrorTag + '.' + errorMessageID;

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidAdvSrchName(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var nameRegex = new RegExp(/^[a-zA-Z *~'\-\\s]+$/);
	var name = $(elementId).val();

	var errorMessageID = '';
	if (name == null || name == '' || name == 'Optional') {
		errorMessageID = '';
	} else {
		var valid = nameRegex.test(name);
		if (!valid) {
			errorMessageID = 'InvalidName';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidAdvSrchOpCompany(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var name = $(elementId).val();
	var errorMessageID = '';

	if (name == '') {
		errorMessageID = 'InvalidOpCompany';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}

	// var id = $(elementId).attr("id");
	// $('#opCompanyAdvSearch').addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	// showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow,
	// index);
	return errorMessageID;
}

function isValidAdvSrchCity(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var nameRegex = new RegExp(/^[a-zA-Z *~'\-\\s]+$/);
	var name = $(elementId).val();

	var errorMessageID = '';
	if (name == null || name == '' || name == 'Optional') {
		errorMessageID = '';
	} else {
		var valid = nameRegex.test(name);
		if (!valid) {
			errorMessageID = 'InvalidCity';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidAdvSrchDate(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var dt = $(elementId).val();
	var errorMessageID = '';

	if (dt == null || dt == '' || dt == 'Optional') {
		errorMessageID = '';
	} else {
		var dtDate = new Date(dt);
		var validformat = /^\d{2}\/\d{2}\/\d{4}$/;
		var valid = true;

		if (dtDate.toDateString() == "NaN")
			valid = false;
		if (!validformat.test(dt))
			valid = false;
		if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100)
			valid = false;
		if (!isValidDatDateFormat(dt))
			valid = false;
		// if (dtDate.getTime() > new Date().getTime()) valid=false;

		if (!valid) {
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			var effDtToVal = $('#advSearchPolicyForm input[id="effDateTo"]')
					.val();
			var effDtFromVal = $('#advSearchPolicyForm input[id="effDateFrom"]')
					.val();

			if (effDtFromVal != null && effDtToVal != null) {
				if (isDateGreaterThan(effDtFromVal, effDtToVal)) {
					// Check whether To Date is greater than From Date, if not
					// then show error message
					errorMessageID = 'fromExceedTo';
					errorMessageID = strErrorTag + '.' + errorMessageID;
				} else if (new Date(effDtFromVal).DaysBetween(new Date(
						effDtToVal)) > 31) {

					var srchType = $('select#searchType').val();
					if (srchType != 'Claims' && srchType != 'Review Payments') {
						// Range may be up to 31 days. If range is greater than
						// 31 days present error message.
						// This applies only to Policy Effective date not for
						// Claims and ReviewPayments Dates
						errorMessageID = 'InvalidDateRange';
						errorMessageID = strErrorTag + '.' + errorMessageID;
					}
				}
			} else
				errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidAdvSrchClaimDate(name, elementId, strRequired, strErrorTag,
		strErrorRow, index) {
	var dt = $(elementId).val();
	var errorMessageID = '';

	if (dt == null || dt == '' || dt == 'Optional') {
		errorMessageID = '';
	} else {
		var dtDate = new Date(dt);
		var validformat = /^\d{2}\/\d{2}\/\d{4}$/;
		var valid = true;

		if (dtDate.toDateString() == "NaN")
			valid = false;
		if (!validformat.test(dt))
			valid = false;
		if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100)
			valid = false;
		if (!isValidDatDateFormat(dt))
			valid = false;
		if (dtDate.getTime() > new Date().getTime())
			valid = false;

		if (!valid) {
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			var effDtToVal = $('#advSearchPolicyForm input[id="effDateTo"]')
					.val();
			var effDtFromVal = $('#advSearchPolicyForm input[id="effDateFrom"]')
					.val();

			if (effDtFromVal != null && effDtToVal != null) {
				if (isDateGreaterThan(effDtFromVal, effDtToVal)) {
					// Check whether To Date is greater than From Date, if not
					// then show error message
					errorMessageID = 'fromExceedTo';
					errorMessageID = strErrorTag + '.' + errorMessageID;
				}
			} else {
				errorMessageID = '';
			}
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function validFullAddress(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidFullAddress('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function isValidFullAddress(name, elementId, strRequired, strErrorTag,
							strErrorRow, index) {
	var fullAddress = $(elementId).val();
	var data = {'fullAddress':fullAddress};
	data = parseManualAddrDQM(fullAddress, data);
	
	
	//var streetNum = data["street_number"];
	var street = data["route"];
	var city = data["locality"];
	var state = data["administrative_area_level_1"];
	var zip = data["postal_code"];
	var nqState = getNQState();
	
	if(street == "" || city == "" || state == "" || zip == "" || zip.length < 5){
		errorMessageID = 'InvalidFullAddress';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else if(state.toUpperCase() != nqState.toUpperCase()){
		errorMessageID = 'InvalidState';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

/* Common Advanced Search functions */
function closeAdvSearch(frm) {
	resetForm($('#' + frm));
	$(".modal").modal('hide');
}

function hasPerformedAdvSearchForTab(tabAdvSearch) {
	var blnPerfSearch = false;

	if (browserAcceptLocalStorage() && sessionStorage.length > 0) {
		for (var i = 0; i < sessionStorage.length; i++) {
			var key = sessionStorage.key(i);
			if (key.toUpperCase() == tabAdvSearch.toUpperCase()) {
				blnPerfSearch = true;
				break;
			}
		}
	}

	return blnPerfSearch;
}

function clearAdvSearchForTab(key) {
	if (hasPerformedAdvSearchForTab(key)) {
		sessionStorage.removeItem(key);
	}
}

function isPolicyNumber(searchStr) {
	if (searchStr.length >= 8 && hasNumbers(searchStr)) {
		return true;
	} else {
		return false;
	}
}

function lastNameHasComma(searchStr) {
	var charIndxPos = searchStr.indexOf(",");

	if (charIndxPos != -1) {
		return true;
	} else {
		return false;
	}
}

function browserAcceptLocalStorage() {
	if (typeof window.localStorage != "undefined") {
		return true;
	} else {
		return false;
	}
}

function setLocalStorage(key, value) {
	localStorage.setItem(key, value);
}

function setSessionStorage(key, value) {
	sessionStorage.setItem(key, value);
}

function isCompletePolicyNumber(searchStr) {
	if (hasNumbers(searchStr) && $.trim(searchStr.length) >= 14) {
		return true;
	} else {
		return false;
	}
}

function isCompleteClaimNumber(searchStr) {
	if (hasNumbers(searchStr) && $.trim(searchStr.length) >= 12) {
		return true;
	} else {
		return false;
	}
}

function isAI2Record(dataSource) {
	if (dataSource == DataSourceEnum.NEW_BUSINESS
			|| dataSource == DataSourceEnum.PRIME) {
		return true;
	} else {
		return false;
	}
}

function displayNotesDialog() {
	clearModalErrors('notesForm', false);
	// watermark on notes field
	$('#uw_NotesMessage').watermark('Please enter a note');
	$('#notesDialog').modal('show');
}

function updateNotes(sAction) {
	var msg;
	var uwNotesMessage = $('#notesForm [id="uw_NotesMessage"]');
	var uwNotesType = $('#notesForm [id="uw_NotesType"]').val();

	// inline validation check if they enter note if choose to save
	if (sAction == "S") {
		msg = validateNotes(uwNotesMessage, "notesMessageCol");
		if (msg != "") {
			$(uwNotesMessage).addClass("inlineError");
			return false;
		}
	}

	$('#notesDialog').modal('hide');
	uwNotesMessage = $.trim($(uwNotesMessage).val());

	// update notes
	var sURL = addRequestParam(document.aiForm.notesURL.value, "uwNotesType",
			uwNotesType);
	sURL = addRequestParam(sURL, "uwNotesMessage", encodeURI(uwNotesMessage));
	sURL = addRequestParam(sURL, "messageAction", sAction);

	$.ajax({
		url : sURL,
		type : "post",
		cache : false,

		beforeSend : function(status, xhr) {
			blockUser();
		},

		success : function(data, status, xhr) {
		},

		error : function(xhr, status) {
			// alert("error is " + xhr);
		},

		complete : function() {
			savePolicy();
			// $.unblockUI();
		}
	});

}

/* Notes dialog */
/* Notes Valdation */
function validateNotes(nameID, rowType) {
	var strID = $(nameID).attr("id");
	return isValidNotes('', nameID, 'No', strID + '.browser.inLine',
			fieldIdToModelErrorRowAdSearch[rowType], '');
}

function isValidNotes(name, elementId, strRequired, strErrorTag, strErrorRow,
		index) {
	var notes = $.trim($(elementId).val());
	var errorMessageID = '';

	if (notes == null || notes == 'Optional') {
		errorMessageID = '';
	} else {
		if (notes.length == 0) {
			errorMessageID = 'InvalidNotes';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			errorMessageID = '';
		}
	}

	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('', id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

// when Notes dialog is resized, we want to resize Notes textarea field so it
// expands with dialog
function resizeNotesDialog(elm) {
	var ui = $(elm).find('.modal-body');
	var uiHeight = ($(ui).height() - 40) + "px";
	var uiWidth = ($(ui).width() - 40) + "px";
	$('#uw_NotesMessage').css({
		height : uiHeight,
		width : uiWidth
	});
}

/* Enums/Objects - Searching (Global, Quick Links, Policy, Quotes) */
var TransactionTypeEnum = {
	APPLICATION : "Application",
	APPLICATION_WITH_REPORTS : "Application w/Rpts",
	QUOTE : "Quote",
	QUOTE_WITH_REPORTS : "Quote w/Rpts",
	PENDING_ISSUANCE : "Pending Issuance",
	POLICY : "Policy",
	REJECTED : "Rejected"
};

var ActionEnum = {
	/* Legacy AI Actions */
	CONVERT_TO_APPLICATION:"Convert to Application",
	REVIEW:"Review",
	ISSUE_POLICY:"Issue Policy",
	DOCUMENTS:"Documents",
	REQUEST_ADDITIONAL_INFO:"Request Additional Info",
	REQUEST_ISSUE:"Request Issue",
	
	/* AI2 Actions */
	EDIT:"Edit",
	COPY_EDIT:"Copy & Edit",
	DELETE:"Delete",
	INQUIRY:"Inquiry",
	REJECT:"Reject",
	READ_ONLY:"Read Only",
	COVERAGE_SUMMARY:"Coverage Summary",
	SUMMARY:"Summary",
	FORMS:"Forms",
	RE_SEND_ESIG:"Re-Send eSignature",
	STOP_ESIG:"Stop eSignature",
	/* CI Actions */
	CI_QUOTE:"CI Quote",
	VIEW_VIOLATIONS:" View Violations",
	VIEW_CLAIMS_ACCIDENTS:" View Claims/Accidents",
	/*Quick Quite Action - Copy CI quote to agent web*/
	COPY_QQ:"Copy in Agent Web"
};

var DataSourceEnum = {
	LEGACY_CAUTO_NE : "LEGACY_CAUTO_NE",
	LEGACY_CAUTO_NJ : "LEGACY_CAUTO_NJ",
	LEGACY_PPA_NE : "LEGACY_PPA_NE",
	LEGACY_PPA_NJ : "LEGACY_PPA_NJ",
	NEW_BUSINESS : "NEW_BUSINESS",
	UMBRELLA : "UMBRELLA",
	LEGACY : "LEGACY",
	PRIME : "PRIME"
};

function companyIdConvertToWeb(companyId){
	var web = "";
	var strArray = document.actionForm.allCompIdWeb.value.split(",");

	for(var i = 0; i < strArray.length; i++) {
		var companyIdWebArray = strArray[i].split("|");
		if(companyId == companyIdWebArray[0]){
			web = companyIdWebArray[1];
			break;
		}
	}
	
	return web;
}

var LegacyTransactionStatusEnum = {
	/* PPA */
	REJECTED_BY_UW : "Rejected by UW",
	WITHDRAWN : "Withdrawn",
	REJECTED_BY_INSURED : "Rejected by Insured",
	APPLICATION : "Application",
	FULL_QUOTE : "Full Quote",
	QUICK_QUOTE : "Quick Quote",
	QUOTE : "Quote",
	APPLICATION_WITH_REPORTS : "Application w/Reports",
	CONVERTED_QUOTE : "Converted Quote",
	REVIEW : "Review",
	REVIEW_INCOMPLETE : "Review-Incomplete",
	ISSUED : "Issued",
	ISSUED_WITH_REFER : "Issued With Refer",
	ISSUED_WITH_EXCEPTION : "Issued with Exception",
	ISSUED_INCOMPLETE : "Issued Incomplete",
	ISSUED_INCOMPLETE2 : "Issued - Incomplete",
	ISSUED_IN_DIFFERENT_COMPANY : "Issued in Different Company",
	ISSUED_PENDING : "Issued-Pending",

	/* CAUTO */
	APPROVAL_REQUESTED_AGENT : "Approval Requested (Agent)",
	APPROVAL_REQUESTED_UW : "Approval Requested (UW)",
	APPROVED_AGENT : "Approved (Agent)",
	APPROVED_UW : "Approved (UW)",
	SAVED_APPLICATION_AGENT : "Saved Application (Agent)",
	SAVED_APPLICATION_UW : "Saved Application (UW)",
	ISSUANCE_REQUESTED : "Issuance Requested",
	SAVEDFULL : "SavedFull",
	REVIEW_UW : "UWReview",
	REVIEW_AGENT : "Review (Agent)",
	SAVED_QUOTE_AGENT : "Saved Quote (Agent)",
	SAVEDQUICK : "SavedQuick",
	SAVED_QUOTE_UW : "Saved Quote (UW)",
	DECLINED : "Declined",
	DELETED : "Deleted",
	UW_REVIEW : "UWReview",
	REQ_APPROVAL : "ReqApproval",
	APPROVED : "Approved",
	REQ_ISSUE : "ReqIssue",

	/* CI */
	REJECTED_BY_CUSTOMER : "Rejected by customer"
};

var TransactionStatusEnum = {
	/* PPA */
	REJECT : "Rejected",
	IN_PROCESS : "In Process",
	IN_PROGRESS : "In Progress",
	DECLINE : "Decline",
	ISSUED : "Issued",
	IN_REVIEW : "In Review",
	PENDING_ISSUANCE : "Pending issuance",
	SOFT_DECLINE : "soft-Decline"
};

var ESignatureStatusEnum = {
	EMAIL_SENT : "Email Sent",
	SENT : "Sent",
	COMPLETE : "Complete",
	REVIEW : "Review",
	PENDING : "Pending",
	RECEIVED : "Received",
	EXPIRED : "Expired",
	STOPPED : "Stopped",
	AGENTSTOPPED : "Agent Stopped",
	FAILED : "Failed"
};

/* Inquiry Action enums */
var InquiryActionEnum={
	POLICY:"Policy",
	BILLING:"Billing",
	CLAIMS:"Claims",
	DOCUMENTS:"Documents",
	MAKEPAYMENT:"Make A Payment",
	REVIEWPAYMENTS:"Review Payments",
	ENDORSEMENT:"Endorsement",
	ESERVICES:"eServices",
	NOTES:"Notes",
	QUOTE:"Quote",
	REPORTCLAIM:"Report A Claim",
	RPAYMENTS:"ReviewPayments",
	IDCARDS:"Request Proof of Insurance",
	ESIGNATURESTATUS:"eSignatureStatus"
};

var InquiryPolicyStatus = {
	CANCELPENDING : "Cancellation pending",
	CANCELED : "Canceled",
	ACTIVE : "Active",
	EXPIRED : "Expired",
	REJECTED : "Rejected",
	INCOMPLETE : "Incomplete",
	NONRENEW : "Non Renewal",
	FUTURE : "Future"
};

var PolicySearchStatus = {
	CANCELPENDING : "CANCELPENDING",
	CANCELED : "CANCELED",
	ACTIVE : "ACTIVE",
	EXPIRED : "EXPIRED",
	REJECTED : "REJECTED",
	INCOMPLETE : "INCOMPLETE",
	NONRENEW : "NONRENEW",
	FUTURE : "FUTURE",
	ALL_ACTIVE : "ACTIVE, FUTURE",
	ALL_ACTIVECANCEL : "ACTIVE, FUTURE, CANCEL",
	ALL : "ALL"
};

var PlfCodeEnum = {
	HP : "HIPT",
	HPAUTO1625 : "HIPT",
	HPAUTOTIP1625 : "TEAC",
	PA : "PALS",
	PAAUTO : "PALS",
	PRAUTO : "PRAC",
	MWAUTO : "MWAC",
	BHHOME : "BKHL",
	ALN_PIC : "HIPT",
	ALN_HPCIC : "PDTL",
	ALN_PSIA : "PALS",
	ALN_TEACH : "TEAC",
	ALN_MWAC : "PRAC",
	ALN_PRAC : "PRAC"
};

/* Company Codes for MAIP */
var MaipCompanyEnum = {
	MAIPALST : "MAIPALST",
	MAIPBANK : "MAIPBANK",
	MAIPCHRT : "MAIPCHRT",
	MAIPCNGR : "MAIPCNGR",
	MAIPELEC : "MAIPELEC",
	MAIPFFC : "MAIPFFC",
	MAIPHARL : "MAIPHARL",
	MAIPIDS : "MAIPIDS",
	MAIPLMIC : "MAIPLMIC",
	MAIPNTLG : "MAIPNTLG",
	MAIPPREM : "MAIPPREM",
	MAIPUSAA : "MAIPUSAA",
	MAIPVERM : "MAIPVERM",
	MAIPSTFM : "MAIPSTFM",
	MAIPPRAC : "MAIPPRAC",
	MAIPPURE : "MAIPPURE"
};

var SearchInEnum = {
	QUOTE : "Q",
	ESIGNATURE : "E",
	POLICY : "P",
	WEBPAY : "WP",
	CLAIMS : "C",
	ENDORSEMENT : "EN"
};

/* Global Search */
var globalSearch = {
	QUOTE_DEFAULT : {
		defaultSearch : "Y",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ESIGNATURE_DEFAULT : {
		defaultSearch : "Y",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.ESIGNATURE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	QUOTE : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ESIGNATURE : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.ESIGNATURE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	POLICY : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "Y",
		showEFNOL : "N"
	},
	CLAIMS : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.CLAIMS,
		URL : "claimSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ENDORSEMENT : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.ENDORSEMENT,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	DEFAULT : {
		defaultSearch : "Y",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "Y",
		showEFNOL : "N"
	},
	KEYWORD : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "Y",
		showEFNOL : "N"
	},
	MYQUOTES : {
		defaultSearch : "N",
		myQuotesSearch : "Y",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "Y",
		showEFNOL : "N"
	},
	POLICYLINKS : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	WEBPAY : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.WEBPAY,
		URL : "webPaySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "Y",
		showEFNOL : "N"
	},
	MAKEPAYMENT : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ADVPOLICYSEARCH : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "Y",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ADVCLAIMSSEARCH : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.CLAIMS,
		URL : "claimSearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "Y",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	ADVENDORSEMENTSEARCH : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.ENDORSEMENT,
		URL : "policySearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "Y",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	POLICYCACHE : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	CLAIMSCACHE : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.CLAIMS,
		URL : "claimSearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	// ENDORSEMENTCACHE:{defaultSearch:"N", myQuotesSearch:"N",
	// searchIn:SearchInEnum.ENDORSEMENT, URL:"policySearchURL", search:"false",
	// showEndBubble:"Y", isAdvSearch:"N", isQuickLinks:"Y", clearAdvSearch:"N",
	// showEFNOL:"N"},
	// TD 47138
	ENDORSEMENTCACHE : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.ENDORSEMENT,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "Y",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	QUOTESEARCHFOOTER : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.QUOTE,
		URL : "quoteSearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "N",
		clearAdvSearch : "N",
		showEFNOL : "N"
	},
	REPORTCLAM : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "true",
		showEndBubble : "N",
		isAdvSearch : "N",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "Y"
	},
	ADVREPORTCLAIMSEARCH : {
		defaultSearch : "N",
		myQuotesSearch : "N",
		searchIn : SearchInEnum.POLICY,
		URL : "policySearchURL",
		search : "false",
		showEndBubble : "N",
		isAdvSearch : "Y",
		isQuickLinks : "Y",
		clearAdvSearch : "N",
		showEFNOL : "Y"
	}
};

var globalSearchType = {
	QUOTE_DEFAULT : "QUOTE_DEFAULT",
	ESIGNATURE_DEFAULT : "ESIGNATURE_DEFAULT",
	QUOTE : "QUOTE",
	ESIGNATURE : "ESIGNATURE",
	POLICY : "POLICY",
	CLAIMS : "CLAIMS",
	ENDORSEMENT : "ENDORSEMENT",
	DEFAULT : "DEFAULT",
	KEYWORD : "KEYWORD",
	MYQUOTES : "MYQUOTES",
	POLICYLINKS : "POLICYLINKS",
	WEBPAY : "WEBPAY",
	MAKEPAYMENT : "MAKEPAYMENT",
	ADVPOLICYSEARCH : "ADVPOLICYSEARCH",
	ADVENDORSEMENTSEARCH : "ADVENDORSEMENTSEARCH",
	ADVCLAIMSSEARCH : "ADVCLAIMSSEARCH",
	POLICYCACHE : "POLICYCACHE",
	CLAIMSCACHE : "CLAIMSCACHE",
	ENDORSEMENTCACHE : "ENDORSEMENTCACHE",
	QUOTESEARCHFOOTER : "QUOTESEARCHFOOTER",
	REPORTCLAM : "REPORTCLAM",
	ADVREPORTCLAIMSEARCH : "ADVREPORTCLAIMSEARCH"
};

// enum for allquote tabs
var allQuoteTab = {
	Q : {
		id : "Quote_Tab",
		showCol : "allQuotesCol",
		hideCol : "eSignCol",
		advSearchHeader : "Quote Advanced Search"
	},
	E : {
		id : "eSignature_Tab",
		showCol : "eSignCol",
		hideCol : "allQuotesCol",
		advSearchHeader : "ESignature Advanced Search"
	}
};

/* error messaging for all dialogs */
function clearModalErrors(frmId, blnClearValues) {
	// clear any previous inline messaging
	$(".errorAlertMsg").html("");
	$(".errorAlertMsg").removeClass('inlineErrorMsg').addClass("hidden");
	$('tr.errorRow').remove();

	$('#' + frmId + ' :input:not([type=hidden])').each(function() {
		if (blnClearValues) {
			$(this).val(''); // clear value in field
		}
		$(this).removeClass('inlineError');
		if ($(this).is('select')) {
			$(this).trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
	});
}

var fieldIdToModelErrorRowAdSearch = {
	"showUnderCellName" : "advSearchPolicyForm|<tr class=\"errorRow\"><td id=\"lname_error\"></td><td id=\"fname_error\"></td></tr>",
	"showUnderCellOpCompany" : "advSearchPolicyForm|<tr class=\"errorRow\"><td id=\"qnumber_error\"></td><td id=\"opCompanyAdvSearch_error\" style=\"padding-left:15px;\"></td></tr>",
	"showUnderCellCity" : "advSearchPolicyForm|<tr class=\"errorRow\"><td id=\"policyCity_error\"></td><td id=\"policyState_error\"></td></tr>",
	"showUnderCellEffDate" : "advSearchPolicyForm|<tr class=\"errorRow\"><td></td><td id=\"effDateRange_error\"></tr>",
	"newQuoteCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"policyEffectiveDateNQ_error\"></td></tr>",
	"newQuoteProdCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"productNQ_error\"></td></tr>",
	"newQuoteProdHiddenCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"productNQ_hidden_error\"></td></tr>",
	"newQuoteLOBCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"lobNQ_error\"></td></tr>",
	"newQuoteStateCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"stateNQ_error\"></td></tr>",
	"newQuoteAgencyCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"agencyProfileNQ_error\"></td></tr>",
	"APOpCompanyCol" : "agencyProfileForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"opCompanyAP_error\"></td></tr>",
	"APBranchCol" : "agencyProfileForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"branchAP_error\"></td></tr>",
	"APAgencyCol" : "agencyProfileForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"agencyAP_error\"></td></tr>",
	"notesMessageCol" : "notesForm|<tr class=\"errorRow\"><td id=\"uw_NotesMessage_error\" colspan=\"2\"></td></tr>",
	"endtEffDateCol" : "endBubbleForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"endtEffectiveDate_error\"></td></tr>",
	"newQuoteFirstNameNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"firstNameNewCo_error\"></td></tr>",
	"newQuoteLastNameNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"lastNameNewCo_error\"></td></tr>",
	"newQuoteDOBNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"dobNewCo_error\"></td></tr>",
	"newQuoteFullAddressNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"fullAddressNewCo_error\"></td></tr>",
	"newQuotePolicyEffectiveDateNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"policyEffectiveDateNewCo_error\"></td></tr>",
	"newQuoteBranchNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"branchNewCo_error\"></td></tr>",
	"newQuoteAgencyNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"agencyNewCo_error\"></td></tr>",
	"newQuoteProducerNewCoCol" : "newQuoteForm|<tr class=\"errorRow fieldRow\"><td></td><td id=\"producerNewCo_error\"></td></tr>"
};

var errorMessageJSON = {
	"opCompanyAdvSearch.browser.inLine.InvalidOpCompany" : "Please select an operating company",
	"fname.browser.inLine.InvalidName" : "Please enter a valid first name",
	"lname.browser.inLine.InvalidName" : "Please enter a valid last name",
	"policyCity.browser.inLine.InvalidCity" : "Please enter a valid city",
	"effDateFrom.browser.inLine.InvalidDate" : "Valid date is required",
	"effDateTo.browser.inLine.InvalidDate" : "Valid date is required",
	"effDateTo.browser.inLine.InvalidDateRange" : "Search Range cannot exceed 31 days",
	"effDateFrom.browser.inLine.InvalidDateRange" : "Search Range cannot exceed 31 days",
	"effDateTo.browser.inLine.fromExceedTo" : "The To date must be greater than the From date by at least one day",
	"effDateFrom.browser.inLine.fromExceedTo" : "The To date must be greater than the From date by at least one day",
	"effDateFrom.browser.inLine.NoDate" : "Date is required",
	"effDateTo.browser.inLine.NoDate" : "Date is required",
	"policyEffectiveDateNQ.browser.inLine.InvalidDate" : "Please enter a valid policy effective date in mm/dd/yyyy format.",
	"productNQ_hidden.browser.inLine.InvalidProducerProduct" : "Agency Profile is invalid for Product selected",
	"productNQ_hidden.browser.inLine.InvalidEffectiveDateProduct" : "Effective date is invalid for Product selected",
	"productNQ.browser.inLine.InvalidProducerProduct" : "Agency Profile is invalid for Product selected",
	"productNQ.browser.inLine.InvalidEffectiveDateProduct" : "Effective date is invalid for Product selected",
	"productNQ.browser.inLine.InvalidNQValue" : "Product is required",
	"lobNQ.browser.inLine.InvalidNQValue" : "Line of Business is required",
	"stateNQ.browser.inLine.InvalidNQValue" : "State is required",
	"agencyProfileNQ.browser.inLine.InvalidNQValue" : "Agency/Branch is required",
	"opCompanyAP.browser.inLine.InvalidNQValue" : "Operating Company is required",
	"branchAP.browser.inLine.InvalidNQValue" : "Branch is required",
	"agencyAP.browser.inLine.InvalidNQValue" : "Agency is required",
	"uw_NotesMessage.browser.inLine.InvalidNotes" : "Please enter a note",
	"endtEffectiveDate.browser.inLine.InvalidDate" : "Please enter a valid policy effective date in mm/dd/yyyy format.",
	"firstNameNewCo.browser.inLine.InvalidName" : "Please enter a valid first name",
	"firstNameNewCo.browser.inLine.InvalidNQValue" : "Please enter a valid first name",
	"lastNameNewCo.browser.inLine.InvalidName" : "Please enter a valid last name",
	"lastNameNewCo.browser.inLine.InvalidNQValue" : "Please enter a valid last name",
	"dobNewCo.browser.inLine.InvalidDate" : "Please enter a valid date of birth",
	"dobNewCo.browser.inLine.invalidMinValue" : "You must be at least 18 years old to purchase insurance",
	"dobNewCo.browser.inLine.invalidMaxValue" : "Please enter a valid date of birth",
	"fullAddressNewCo.browser.inLine.InvalidNQValue" : "Full Address is required",
	"fullAddressNewCo.browser.inLine.InvalidFullAddress" : "Please have commas only after the street and  after the city.<img id=\"addressFormatMsg\" alt=\"help_Icon\" src=\"/aiui/resources/images/helpIconHome.png\">",
	"fullAddressNewCo.browser.inLine.InvalidState" : "Please enter a valid address for the state selected.",
	"policyEffectiveDateNewCo.browser.inLine.InvalidDate" : "Please enter a valid policy effective date",
	"policyEffectiveDateNewCo.browser.inLine.priorDate" : "Effective date cannot be prior to 7/1/17.",
	"policyEffectiveDateNewCo.browser.inLine.priorDateHO3" : "Effective date cannot be prior to 8/1/17.",
	"policyEffectiveDateNewCo.browser.inLine.priorDateHO6" : "Effective date cannot be prior to 01/01/18.",
	"branchNewCo.browser.inLine.InvalidNQValue" : "Branch is required",
	"agencyNewCo.browser.inLine.InvalidNQValue" : "Agency is required",
	"producerNewCo.browser.inLine.InvalidNQValue" : "Producer Code is required",
	"policyEffectiveDateNewCo.browser.inLine.InvalidProducerProduct" : "Effective date is invalid for Product selected"
};

var errorMessageJSONGH = {
	QuoteNumbers : "Enter 8 positions to begin auto populating Quote numbers",
	Required : "Please enter a valid search criteria",
	MoreChars : "Too many characters.  Please refine your search criteria."
};

function showClearInlineErrorMsgsWindow(name, strElementID, strErrorMsgID,
		strErrorRow, columnIndex) {
	showClearInLineErrorRowMsgs(name, strElementID, strErrorMsgID, strErrorRow);
}

function showClearInLineErrorRowMsgs(name, strElementID, strErrorMsgID,
		strErrorRow) {
	var isAppRow = false;
	var strRowName = strElementID;
	if (isAppRow) {
		strRowName = name;
	}

	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	// sample calling code
	var strErrorMsg = '';
	if (strErrorRow.length == 0) {
		// if no error row return
		return;
	}

	if (strErrorMsgID.length == 0) {
		// clear this message
		// if this is the last error message -> remove error row
		clearInLineRowErrorWindow(strRowName, strElementID, strErrorRow);
		return;
	}

	// get the error message to be displayed
	strErrorMsg = getMessage(strErrorMsgID);
	if (strErrorMsg.length == 0) {
		// if no error message -> return;
		return;
	}

	$('#' + jq(strElementID)).each(
			function() {
				if (strErrorRow.indexOf("|") >= 0) {
					var errorRow = strErrorRow.split("|");
					var frmId = errorRow[0];
					strErrorRow = errorRow[1];

					if (strElementID == "effDateFrom"
							|| strElementID == "effDateTo") {
						$('#' + frmId + ' input[id="' + strElementID + '"]')
								.addClass('inlineError');
						strElementID = "effDateRange";
					}

					var len = $('tr.errorRow').find(
							"td#" + strElementID + "_error").length;

					// insert table row if it doesn't exist
					if (len == 0) {
						var dataRow = $("td." + strElementID).closest("tr");
						$(strErrorRow).insertAfter(dataRow);
					}

					// add inline styles
					$("td#" + strElementID + "_error").html(strErrorMsg);
					$("td#" + strElementID + "_error").addClass(
							'inlineErrorMsg');
					$('#' + frmId + ' input[id="' + strElementID + '"]')
							.addClass('inlineError');
				}
			});
}

function clearInLineRowErrorWindow(rowName, strElementID, strErrorRow) {
	var errorRow = null;

	if (strErrorRow.indexOf("|") >= 0) {
		errorRow = strErrorRow.split("|");
		var frmId = errorRow[0];

		var currentElement = $("td#" + strElementID + "_error");
		currentElement.html("");
		currentElement.removeClass('inlineErrorMsg');

		var isLastErrorMsg = true;
		currentElement.parent().children().each(function() {
			if ($(this).hasClass('inlineErrorMsg')) {
				isLastErrorMsg = false;
			}
		});

		if (isLastErrorMsg)
			currentElement.parent().remove();

		$('#' + frmId + ' input[id="' + strElementID + '"]').removeClass(
				'inlineError');

	}
}

/* Common validation functions - this will be moved to validation.js ? -JG */
function isValidSearchValue(searchStr) {
	var validValue = /^[0-9a-zA-Z*,\s]+$/;
	if (searchStr.match(validValue)) {
		return true;
	} else {
		return false;
	}
}

function isDateGreaterThanOrEqual(fdate, tdate) {
	var dteDate1 = new Date(fdate);
	var dteDate2 = new Date(tdate);

	if (dteDate1 >= dteDate2)
		return true;
	else
		return false;
}

function isDateGreaterThan(fdate, tdate) {
	var dteDate1 = new Date(fdate);
	var dteDate2 = new Date(tdate);

	if (dteDate1 > dteDate2)
		return true;
	else
		return false;
}

function getFormattedDate(date) {
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return month + '/' + day + '/' + year;
}

function isValidFirstName(valueStr) {
	if ($.trim(valueStr).match(/^[a-zA-Z*~'\-\\s]+$/)) {
		return true;
	} else {
		return false;
	}

}

function isValidLastName(valueStr) {
	if ($.trim(valueStr).match(/^[a-zA-Z *~'\-\\s]+$/)) {
		return true;
	} else {
		return false;
	}

}

function isValidPolicyNumber(valueStr) {
	if ($.trim(valueStr).match(/^[0-9a-zA-Z*]+$/)) {
		return true;
	} else {
		return false;
	}

}

function isValidUserId(valueStr) {
	if ($.trim(valueStr).match(/^[0-9a-zA-Z*]+$/)) {
		return true;
	} else {
		return false;
	}
}

function isValidNewQuoteDate(dt, elm) {
	if (dt == "") {
		return false;
	} else {
		// value entered remove watermark
		$(elm).removeClass("watermark");
	}

	var dtDate = new Date(dt);
	var valid = true;

	if (dtDate == "Invalid Date")
		valid = false;
	if (!isValidDatDateFormat(dt))
		valid = false;
	if (dtDate.toDateString() == "NaN")
		valid = false;
	if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100)
		valid = false;
	if(elm.id == "dobNewCo" &&  dtDate > new Date()){
		valid = false;
	}
		
	return valid;
}

/* Date formatting functions - this will be moved to common.js ? -JG */
function date_by_subtracting_months(date, months) {
	// gets date of months from current date in mm/dd/yyyy format
	return new Date(date.getFullYear(), date.getMonth() - months, date
			.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(),
			date.getMilliseconds());
}

function date_by_subtracting_days(date, days) {
	// gets date of days from current date in mm/dd/yyyy format
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days,
			date.getHours(), date.getMinutes(), date.getSeconds(), date
					.getMilliseconds());
}

function acceptNumericsAndSlashes(strElm, e) {

	if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27
			|| e.keyCode == 13 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
		// let it happen, don't do anything
		return;
	} else {
		if ((e.keyCode >= 48 && e.keyCode <= 57)
				|| (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 109)
				|| (e.keyCode == 111)) {
			return;
		} else {
			// for non ie
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				// for ie
				e.returnValue = false;
			}
		}
	}
}

function acceptNumericsPolEffDt(strElm, e) {
	if (e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27
			|| e.keyCode == 13 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
		// let it happen, don't do anything
		return;
	} else {
		if ((e.keyCode >= 48 && e.keyCode <= 57)
				|| (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 109)) {
			return;
		} else {
			// for non ie
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				// for ie
				e.returnValue = false;
			}
		}
	}
}

function autoSlashes(strElm, e) {

	// don't do anything while deleting
	if (e.keyCode == 8) {
		return;
	}

	if ($(strElm).val().length == 2) {
		$(strElm).val($(strElm).val() + "/");
	} else if ($(strElm).val().length == 5) {
		$(strElm).val($(strElm).val() + "/");
	}
}

function isValidDatDateFormat(dateString) {
	// First check for the pattern
	var validformat = /^\d{2}\/\d{2}\/\d{4}$/;

	if (!validformat.test(dateString))
		return false;

	// Parse the date parts to integers
	var parts = dateString.split("/");
	var day = parseInt(parts[1], 10);
	var month = parseInt(parts[0], 10);
	var year = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if (year < 1900 || year > 2100 || month == 0 || month > 12) {
		return false;
	}

	var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	// Adjust for leap years
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29;

	// Check the range of the day
	return day > 0 && day <= monthLength[month - 1];

};

function invokeInlineValidation(elm, fnct, event) {
	fnct();
}

function parseKeywordForAdvSearch(value, formId) {
	if (isPolicyNumber(value)) {
		$('#' + formId).find(":input[id='qnumber']").val(value);
	} else {
		if (lastNameHasComma(value)) {
			var name = value.split(",");
			var lname = $.trim(name[0]);
			var fname = $.trim(name[1]);

			$('#' + formId).find(":input[id='lname']").val(lname);
			if (fname != undefined && fname != "") {
				$('#' + formId).find(":input[id='fname']").val(fname);
			}
		} else {
			$('#' + formId).find(":input[id='lname']").val(value);
		}
	}
}

function LegacyPolicyNotHaveEndorsements(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob;

	if ((dataSource == DataSourceEnum.LEGACY && isPalPolicyNumber(policyRecord) && lob == "CA")
			|| (dataSource == DataSourceEnum.LEGACY && policyRecord.policyNumber
					.substring(0, 4) == "TCA0")
			|| (dataSource == DataSourceEnum.LEGACY
					&& isPalPolicyNumber(policyRecord) && lob == "HO")
			|| (lob == "PCAT")) {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveEServices(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob.toUpperCase();

	if (dataSource == DataSourceEnum.LEGACY
			&& (lob == "CA" || lob == "PCAT" || lob == "PUM")) {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveNotes(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob.toUpperCase();
	var state = policyRecord.state.toUpperCase();

	// For TD 72674, 72677, 73657 removing HO, PCAT to enable notes in policy dropdown
	// Added HO and all NE states to disable notes in policy dropdown for 1/12 release
	if (dataSource == DataSourceEnum.LEGACY
			&& (lob == "CA" || lob == "PUM")) {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveReportClaim(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob.toUpperCase();

	if (dataSource == DataSourceEnum.LEGACY && lob == "PCAT") {
		return true;
	} else {
		return false;
	}
}

function isPalPolicyNumber(policyRecord) {
	var company = policyRecord.company.toUpperCase();

	if (company == "PSIA" || company == "PPCIC" || company == "PIC"
			|| policyRecord.policyNumber.substring(0, 3) == "PAA") {
		return true;
	} else {
		return false;
	}
}

function isTeachersPolicyNumber(polNum) {
	if (polNum.substring(0, 3) == "TCA") {
		return true;
	} else {
		return false;
	}
}

function isLegacy(dataSource) {
	if (dataSource == DataSourceEnum.LEGACY_CAUTO_NE
			|| dataSource == DataSourceEnum.LEGACY_CAUTO_NJ
			|| dataSource == DataSourceEnum.LEGACY_PPA_NE
			|| dataSource == DataSourceEnum.LEGACY_PPA_NJ) {
		return true;
	} else {
		return false;
	}
}

function isLegacyPalHomeRecord(dataSource, lob) {
	if (dataSource == DataSourceEnum.LEGACY_PPA_NJ
			&& lob.toUpperCase() == "HOME") {
		return true;
	} else {
		return false;
	}
}

function isLegacyNEHomeRecord(dataSource, lob) {
	if (dataSource == DataSourceEnum.LEGACY_PPA_NE
			&& lob.toUpperCase() == "HOME") {
		return true;
	} else {
		return false;
	}
}

function isLegacyCAutoRecord(dataSource) {
	return (DataSourceEnum.LEGACY_CAUTO_NE == dataSource || DataSourceEnum.LEGACY_CAUTO_NJ == dataSource);
};

/* MAIP search functions */
function isMAIPPolicy(policyRecord) {
	if (MaipCompanyEnum.hasOwnProperty(policyRecord.company)) {
		return true;
	} else {
		return false;
	}
}

function isPrimeMAIPPolicy(policyRecord) {
	if (isMAIPPolicy(policyRecord)
			&& policyRecord.dataSource == DataSourceEnum.PRIME) {
		return true;
	} else {
		return false;
	}
}

function isLegacyMAIPPolicy(policyRecord) {
	if (isMAIPPolicy(policyRecord)
			&& policyRecord.dataSource == DataSourceEnum.LEGACY) {
		return true;
	} else {
		return false;
	}
}

function hasAccessLegacyMAIPEndorsement(policyRecord) {
	var hasLegacyMAIP = document.actionForm.hasLegacyMAIP.value;
	var disableLegacyMAIP = document.actionForm.disableLegacyMAIP.value;

	if (hasLegacyMAIP == "false" || disableLegacyMAIP == "true") {
		return false;
	} else {
		return true;
	}
}

function hasAccessPrimeMAIPEndorsement(policyRecord) {
	var hasPrimeMAIP = document.actionForm.hasPrimeMAIP.value;
	var disablePrimeMAIP = document.actionForm.disablePrimeMAIP.value;

	if (hasPrimeMAIP == "false" || disablePrimeMAIP == "true") {
		return false;
	} else {
		return true;
	}
}

function isIDCardsRollout() {
	//var idCardsRollout = document.actionForm.IDCardsRollout.value;
	var hasIDCardsRole = document.actionForm.hasIDCardsRole.value;
	
	if(hasIDCardsRole == "true" ){
		return true;
	}
	
	return false;
}

function isHomeRentersEndrRollout() {
	var homeRentersEndrRollout = document.actionForm.endHomeRentersEnabled.value;
	
	if(homeRentersEndrRollout == "YES"){
		return true;
	}
	
	return false;
}

/* New Co NQ Functionality */
/* Start address */
/*var state = 'PA';
var placeSearch, autocomplete;
var countryRestrict = {
	'country' : 'us'
};
var componentForm = {
	street_number : 'short_name',
	route : 'long_name',
	locality : 'long_name',
	administrative_area_level_1 : 'short_name',
	postal_code : 'short_name',
	country : 'long_name'
};

function initAutocomplete() {
	if(!callGoogleAutoComplete()){
		return;
	}
	
	var fieldId = getFieldIdForMapLkup();
	var input = document.getElementById(fieldId);
	var state = "";
	
	// Create the autocomplete object, restricting the search to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
	*//** @type {!HTMLInputElement} *//*
	(input), {
		types : [ 'geocode' ],
		componentRestrictions : countryRestrict
	});
	
	if(typeof autocomplete != "undefined"){
		// When the user selects an address from the dropdown, populate the address fields in the form.
		autocomplete.addListener('place_changed', fillInAddress);
		
		(getNQState() != '') ? state=getNQState(): state=$('#RESIDENTIAL_ADDRESS_stateCd').val();
		
		// if user is entering a primary address in NQ dialog, we want to restrict selections by that state
		// for google api, we must use geocodes - JG
		if(fieldId == "fullAddressNewCo" || fieldId == "adressSelected"){
			var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(stateGeoCodes[state].latitude, 
																					stateGeoCodes[state].longitude));
			autocomplete.setBounds(defaultBounds);
		}
		
		// this code prevents form from being submitted if user makes selection by hitting enter
		google.maps.event.addDomListener(input, 'keydown', function(e) { 
		   if (e.keyCode == 13) { 
			   e.preventDefault(); 
		    }
		}); 
	}
}

*//** State geocode values **//*
var stateGeoCodes = {
	"PA" : {latitude: 40.5773, longitude : -77.264}
};
*/
/*function getFieldIdForMapLkup(){
	var fieldId = "";
	
	if($('#newQuoteDialog').hasClass('in')){
		fieldId = "fullAddressNewCo";
	}else if($('#editPrimaryInsuredDlg').hasClass('in')){
		fieldId = "pri_priorAdd";
	}else if($('#editAddressDlg').hasClass('in')){
		fieldId = "adressSelected";
	}else{
		fieldId = "prioraddr_PRIMARY_INSURED_NQ";
	}
	
	return fieldId;
}*/


function callGoogleAutoComplete(){
	var callGoogleAutoComplete = true;
	
	if(($('#newQuoteDialog').hasClass('in') || $('#editPrimaryInsuredDlg').hasClass('in') || $('#editAddressDlg').hasClass('in'))
		&&!isRentersQuote()){
			callGoogleAutoComplete = false;
	}
		
	if($('#editAddressDlg').hasClass('in') && $('#adressSelected').attr('readonly') == 'readonly'){
		callGoogleAutoComplete = false;
	}
		
	if($('#editPrimaryInsuredDlg').hasClass('in') && $('#pri_priorAdd').attr('readonly') == 'readonly'){
		callGoogleAutoComplete = false;
	}
	
	return callGoogleAutoComplete;
}

/*function fillInAddress() {
	var fieldId = getFieldIdForMapLkup();
	var place = autocomplete.getPlace();
	var adrs = '';
	
	if(typeof place != "undefined" && typeof place.address_components != "undefined"){
		var hasStreetNumber = false;
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (componentForm[addressType]) {
				if (addressType != 'country') {
					var val = place.address_components[i][componentForm[addressType]];
					if (i == 0) {
						adrs = adrs + val;
						// need to check if street number is present for formatting purposes
						if (addressType == 'street_number'){
							hasStreetNumber = true;
						}
					}else if((i == 1 && hasStreetNumber) || (addressType == 'postal_code')){
						adrs = adrs + ' ' + val;
					}else{
						adrs = adrs + ', ' + val;
					}
				}
			}
		}
	
		document.getElementById(fieldId).value = adrs;
		console.log("fillInAddress=> fieldId:"+fieldId+";fullAddressNewCo:"+ $('fullAddressNewCo'));
		clearInLineRowErrorWindow("fullAddressNewCo", "fullAddressNewCo", fieldIdToModelErrorRowAdSearch['newQuoteFullAddressNewCoCol'])
	}
	$('.pac-container').hide();
}*/

//common functions will move to common file
function setNewCoBranches(state, lob, branchElm, agencyElm, producerElm, policyEffDt){
	var branchRespObj, branchCount, branchHierId, companyId, channel;
	var strURL = addRequestParam("/aiui/landing/getNQBranches", "lob", lob);
	strURL = addRequestParam(strURL, "state", state);
	
	// clear out branch dropdown
	emptySelect(branchElm);
	
	if(typeof requestNewCoBranches != "undefined" && requestNewCoBranches.readyState !== 4){
		//Previous request needs to be aborted as user has changed criteria to do new lookup
		requestNewCoBranches.abort();
    }

	requestNewCoBranches = getNewCoBranches(strURL, state, lob, branchElm, agencyElm, producerElm, policyEffDt, branchRespObj, 
			branchCount, branchHierId, companyId, channel);
	
}

var getNewCoBranches = function(strURL, state, lob, branchElm, agencyElm, producerElm, policyEffDt, branchRespObj, branchCount, branchHierId, companyId, channel){
	var request = $.ajax({
    	headers: {
 	        'Accept': 'application/json',
 	        'Content-Type': 'application/json'
 	    },
    	url: strURL,
		type: 'get',
		cache: false, 
		
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		
		// callback handler that will be called on success
	    success: function(response, textStatus, jqXHR){
	    	branchCount = response.length;
	    	if(response.length > 0){
	    		$.each(response, function(i) {
					branchRespObj = response[i];
					branchHierId = $.trim(branchRespObj.branchId);
					companyId = $.trim(branchRespObj.companyCorporationId);
					channel= $.trim(branchRespObj.channelCode);
					if(response.length > 1){
						branchElm.append('<option value="' + branchHierId +'" data-support="'+ channel + '" data-corp="'+companyId+'" data-code="'
								+$.trim(branchRespObj.branchLevelCode)+'">' + $.trim(branchRespObj.name) + '</option>');
					}
				});
	    		if(response.length > 1){
	    			branchElm.trigger("chosen:updated");
	    		}
	    	}
	 
	    	
	    },
	    
	    // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	// alert('error accessing security database');
	    }
	    ,
	    complete: function(){
	    	$.unblockUI();
	    	// if only one branch returned, make automatically call to get agencies
	    	if(branchCount == 1){
	    		handleBranches(branchRespObj); 
	    		setNewCoProducers(branchHierId, companyId, channel, state, lob, agencyElm, producerElm, policyEffDt, true, true, true);
	    	}
	    }
	});	
    
    return request;
}

function setNewCoProducers(agencyHierId, companyId, channel, state, lob, agencyElm, producerElm, policyEffDtElm, getLevel2, callHandleProducers, fromGlobal){
	// function will return producers either L2 or L3
	var producerRespObj, strURL, producerCount, agencyHierId;
	var policyEffDt = policyEffDtElm.val();
	
	if(agencyHierId == ""){
		return;
	}
	
	//var web = companyIdConvertToWeb[companyId];
	var web = companyIdConvertToWeb(companyId);
	
	clearModalErrors('newQuoteForm', false);
	
	// build URL
	strURL = addRequestParam("/aiui/landing/getNewCoProducers", "web", web);
	strURL = addRequestParam(strURL, "state", state);
	strURL = addRequestParam(strURL, "channel", channel);
	strURL = addRequestParam(strURL, "lob", lob);
	strURL = addRequestParam(strURL, "agencyHierId", agencyHierId);
	strURL = addRequestParam(strURL, "policyEffDate", policyEffDt);
	strURL = addRequestParam(strURL, "level2", getLevel2);
	
	if(getLevel2){
		emptySelect(agencyElm);
	}
	emptySelect(producerElm);
		
	
	if(typeof requestNewCoProducers != "undefined" && requestNewCoProducers.readyState !== 4){
		//Previous request needs to be aborted as user has changed criteria to do new lookup
		requestNewCoProducers.abort();
    }

	requestNewCoProducers = getNewCoProducers(strURL, state, web, companyId, channel, agencyHierId, producerCount, producerRespObj, lob, 
			agencyElm, producerElm, policyEffDtElm, getLevel2, callHandleProducers, fromGlobal);
	
}

function setNewCoProducersForAgent(state, lob, producerElm, policyEffDtElm, getLevel2, callHandleProducers){
	var producerRespObj, strURL, producerCount;
	var policyEffDt = policyEffDtElm.val();
	
	// build URL
	strURL = addRequestParam("/aiui/landing/getNewCoProducersForAgent", "state", state);
	strURL = addRequestParam(strURL, "lob", lob);
	strURL = addRequestParam(strURL, "policyEffDate", policyEffDt);
	strURL = addRequestParam(strURL, "level2", getLevel2);
	
	emptySelect(producerElm);
	
	if(typeof requestNewCoProducers != "undefined" && requestNewCoProducers.readyState !== 4){
		//Previous request needs to be aborted as user has changed criteria to do new lookup
		requestNewCoProducers.abort();
    }
	
	requestNewCoProducers = getNewCoProducersForAgent(strURL, state, producerCount, producerRespObj, producerElm, getLevel2, callHandleProducers);
	
}

var getNewCoProducersForAgent = function(strURL, stateCd, producerCount, producerRespObj, producerElm, getLevel2, callHandleProducers){

	var request = $.ajax({
    	headers: {
 	        'Accept': 'application/json',
 	        'Content-Type': 'application/json'
 	    },
    	url: strURL,
		type: 'get',
		cache: false, 
		
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(response, textStatus, jqXHR){
			producerCount = response.length;
	    	if(producerCount > 0){
				$.each(response, function(i) {
					// get producers
					producerRespObj = response[i];
					if(producerCount > 1){
						producerElm.append('<option value="' + $.trim(producerRespObj.producerId)+'" data-support="'+ $.trim(producerRespObj.channelCode) + 
								'" data-corp="'+$.trim(producerRespObj.companyCorporationId)+'" data-code="'+$.trim(producerRespObj.producerLevelCode)+
								'" data-uw="'+$.trim(producerRespObj.underWritingCompany)+ 
								'" data-agencyid="'+$.trim(producerRespObj.agencyId)+
								'" data-agencycode="'+$.trim(producerRespObj.agencyLevelCode)+
								'" data-branchid="'+$.trim(producerRespObj.branchId)+
								'" data-fiserv="'+$.trim(producerRespObj.fiServId)+
								'" data-branchcode="'+$.trim(producerRespObj.branchLevelCode)+'">' + 
								$.trim(producerRespObj.producerWebDisplayName) +" - "+ producerRespObj.producerLevelCode + '</option>');
					}
				});
				if(producerCount > 1){
					producerElm.trigger('chosen:updated');
				}
	    	}
		},

		 // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	// alert('error accessing security database');
	    }
	    ,
		
		complete: function(){
			$.unblockUI();
			if(callHandleProducers){
				handleProducers(producerRespObj, getLevel2, producerCount, true, true);
			}
		}
	});	
    
    return request;
};

var getNewCoProducers = function(strURL, stateCd, web, companyId, channel, agencyHierId, producerCount, producerRespObj, lob, 
		agencyElm, producerElm, policyEffDtElm, getLevel2, callHandleProducers, fromGlobal){

	var request = $.ajax({
    	headers: {
 	        'Accept': 'application/json',
 	        'Content-Type': 'application/json'
 	    },
    	url: strURL,
		type: 'get',
		cache: false, 
		
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		
		success: function(response, textStatus, jqXHR){
			producerCount = response.length;
	    	if(producerCount > 0){
				$.each(response, function(i) {
					producerRespObj = response[i];
					channel = $.trim(producerRespObj.channelCode);
					companyId = $.trim(producerRespObj.companyCorporationId);
					if(getLevel2){
						if(producerCount == 1){
							// one agency, store agency id as agency hier id for setNewCoProduers call
							agencyHierId = $.trim(producerRespObj.agencyId);
						}
						// get agencies
						agencyElm.append('<option value="' + $.trim(producerRespObj.agencyId)+'" data-support="'+ channel + '" data-corp="'+companyId+
								'"data-code="'+$.trim(producerRespObj.agencyLevelCode)+'">' + $.trim(producerRespObj.agencyWebDisplayName) +" - "+ 
								producerRespObj.agencyLevelCode + '</option>');
					}else{
						// get producers
						producerElm.append('<option value="' + $.trim(producerRespObj.producerId)+'" data-support="'+ channel + 
								'" data-corp="'+companyId+'" data-code="'+$.trim(producerRespObj.producerLevelCode)+
								'" data-uw="'+$.trim(producerRespObj.underWritingCompany)+
								'" data-agencycode="'+$.trim(producerRespObj.agencyLevelCode)+
								'" data-fiserv="'+$.trim(producerRespObj.fiServId)+
								'" data-branchcode="'+$.trim(producerRespObj.branchLevelCode)+'">' + 
								$.trim(producerRespObj.producerWebDisplayName) +" - "+ producerRespObj.producerLevelCode + '</option>');
					}
				});
	    	}
	    	
    		if(getLevel2){
	    		agencyElm.trigger("chosen:updated");
	    	}else{
	    		producerElm.trigger("chosen:updated");
	    	}
		
		},

		 // callback handler that will be called on error
	    error: function(jqXHR, textStatus, errorThrown){
	    	// alert('error accessing security database');
	    }
	    ,
		
		complete: function(){
			$.unblockUI();
			if(callHandleProducers){
				handleProducers(producerRespObj, getLevel2, producerCount, false, fromGlobal);
			}
	    	// call setNewCoProducers if agencies returned is 1
	    	if(producerCount == 1 && getLevel2){
	    		setNewCoProducers(agencyHierId, companyId, channel, stateCd, lob, agencyElm, producerElm, policyEffDtElm, false, true, fromGlobal);
	    	}
		}
	});	
    
    return request;
};

function handleBranches(branchRespObj){
	if(typeof branchRespObj == undefined){
		return;
	}
	
	$('#branchNewCo').addClass("hidden");
	$('#branchNewCo').val('');
	$('#branchNewCoHidden').val($.trim(branchRespObj.branchId));
	$('#branchNewCoLiteral').removeClass("hidden");
	$('#branchNewCoLiteral').html($.trim(branchRespObj.name));
}

function handleProducers(producerRespObj, getLevel2, producerCount, agentView, fromGlobal){
	if(typeof producerRespObj == undefined){
		return;
	}
	
	if(fromGlobal){
		if(getLevel2){
			// clear existing producer fields
			$('#oneProducerNewCo').addClass('hidden');
			$('#producerNewCoDD').removeClass('hidden');
			$('#producerNewCoHidden').val('');
			$('#producerNewCo').val('');
			$('#producerNewCoLiteral').html('');
			$('#companyIdNewCo').val('');
			$('#channelNewCo').val('');
			$('#uwCompanyNewCo').val('');
			$('#fiservIdNewCo').val('');
			$('#producerLevelCodeNewCo').val('');
			
			if(producerCount == 1){
				$('#oneAgencyNewCo').removeClass('hidden');
				$('#agencyNewCoDD').addClass('hidden');
				$('#agencyNewCoHidden').val($.trim(producerRespObj.agencyId));
				$('#agencyLevelCodeNewCo').val($.trim(producerRespObj.agencyLevelCode));
				$('#agencyNewCoLiteral').html($.trim(producerRespObj.agencyWebDisplayName) +" - "+ producerRespObj.agencyLevelCode);
				if(agentView){
					$('#producerNewCoRow').addClass("hidden");
				}else{
					$('#producerNewCoRow').removeClass("hidden");
				}
			}else{
				$('#oneAgencyNewCo').addClass('hidden');
				$('#agencyNewCoDD').removeClass('hidden');
				$('#agencyNewCo').val('');
				$('#agencyNewCoHidden').val('');
				$('#agencyLevelCodeNewCo').val('');
				$('#agencyNewCoLiteral').html('');
				if(agentView){
					$('#producerNewCoRow').removeClass("hidden");
				}else{
					$('#producerNewCoRow').addClass("hidden");
				}
			}
		}else{
			if(producerCount == 1){
				$('#oneProducerNewCo').removeClass('hidden');
				$('#producerNewCoDD').addClass('hidden');
				$('#producerNewCoHidden').val($.trim(producerRespObj.producerId));
				$('#companyIdNewCo').val($.trim(producerRespObj.companyCorporationId));
				$('#channelNewCo').val($.trim(producerRespObj.channelCode));
				$('#uwCompanyNewCo').val($.trim(producerRespObj.underWritingCompany));
				$('#producerLevelCodeNewCo').val($.trim(producerRespObj.producerLevelCode));
				$('#branchLevelCodeNewCo').val($.trim(producerRespObj.branchLevelCode));
				$('#agencyLevelCodeNewCo').val($.trim(producerRespObj.agencyLevelCode));
				$('#fiservIdNewCo').val($.trim(producerRespObj.fiServId));
				$('#producerNewCoLiteral').html($.trim(producerRespObj.producerWebDisplayName) +" - "+ producerRespObj.producerLevelCode);
				if(agentView){
					$('#producerNewCoRow').addClass("hidden");
					$('#branchNewCoHidden').val($.trim(producerRespObj.branchId));
					$('#agencyNewCoHidden').val($.trim(producerRespObj.agencyId));
				}else{
					$('#producerNewCoRow').removeClass("hidden");
				}
			}else{
				// more than one producer found, always display for both employee and agent
				$('#oneProducerNewCo').addClass('hidden');
				$('#producerNewCoDD').removeClass('hidden');
				$('#producerNewCo').val('');
				$('#producerNewCoHidden').val('');
				$('#companyIdNewCo').val('');
				$('#channelNewCo').val('');
				$('#uwCompanyNewCo').val('');
				$('#producerLevelCodeNewCo').val('');
				$('#branchLevelCodeNewCo').val('');
				$('#agencyLevelCodeNewCo').val('');
				$('#fiservIdNewCo').val('');
				$('#producerNewCoLiteral').html('');
				$('#producerNewCoRow').removeClass("hidden");
				/*if(agentView){
					$('#producerNewCoRow').removeClass("hidden");
				}else{
					$('#producerNewCoRow').addClass("hidden");
				}
				*/
			}
		}	
	}else{
		// clear existing fields
		$('#homeBranchId').val('');
		$('#homeAgencyId').val('');
		$('#homeProducerId').val('');
		$('#homeChannelCd').val('');
		$('#homeCompanyCd').val('');
		$('#homeUWCompanyCd').val('');
		$('#homeFiservAuthenticationId').val('');
		
		if(isEmployee() && !isEmployeeCurrentProfile()){
			$('#homeBranchHierId').val('');
			$('#homeAgencyHierId').val('');
		}
		
		if(producerCount == 1){
			if(getLevel2){
				$('select.clsAgency').prop("selectedIndex",1).prop('disabled',true).trigger("chosen:updated");
			}else{
				$('select.clsProducer').prop("selectedIndex",1).prop('disabled',true).trigger("chosen:updated");
				populateHiddenProdFields(false);
			}
		
		}
	}
}

/*function validateAddressNewCo(fullAddress) {
	var result = {};
	var data = {'fullAddress':fullAddress};
	
	var selectedAddress = document.newQuoteForm.addressSelected.value;
	if(selectedAddress != ""){
		var obj = $.parseJSON(selectedAddress);
		document.newQuoteForm.addressKey.value = obj.addressKey;  // store address key
	}
	
	
	var place = autocomplete.getPlace();
	if(place){
		for (var i = 0; i < place.address_components.length; i++) {
			var type = place.address_components[i].types[0];
			var short_name = place.address_components[i].short_name;
			var long_name = place.address_components[i].long_name;
			var value = (type == 'administrative_area_level_1') ? short_name : long_name;
			data[type] = value;
		}
	}else{ 
		// google type ahead is down, parse through manually entered address for DQM lookup
		//data = parseManualAddrDQM(fullAddress, data);
	//}
	
	data = parseManualAddrDQM(fullAddress, data);
	result['entry'] = data;
	$.ajax({
		headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
	    url: '/aiui/landing/validateFullAddress',
		type : 'POST',
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
        async : false,

		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},
		success : function(data) {
			result['suggestions'] = data;
		},
		error : function(xhr, status, error) {
			alert(xhr + ", " + status + ", " + error);
		},
		complete : function() {
			$.unblockUI();
		}
	});
	return result;
}*/

function parseManualAddrDQM(fullAddress, data){
	var streetNum = "";
	var street = "";
	var aptNum = "";
	var city = "";
	var state = "";
	var zip = "";
	
	var intPos = fullAddress.indexOf(",");
	if(intPos > 0){
		fullAddress = $.trim(fullAddress);
		var address = $.trim(fullAddress.substring(0, intPos)); 
		var citystatezip = $.trim(fullAddress.substring(address.length + 1, fullAddress.length));
		
		intPos = address.indexOf(" ");
		if(intPos > 0){
			streetNum = $.trim(address.substring(0, intPos));
			street = $.trim(address.substring(intPos, address.length));
		}
		
		intPos = citystatezip.indexOf(",");
		if(intPos > 0){
			var arrCityState = citystatezip.split(","); 
			if(arrCityState.length == 3){
				// entered an apartment
				aptNum = $.trim(arrCityState[0]);
				city = $.trim(arrCityState[1]);
				state = $.trim(arrCityState[2]);
			}else{
				// just have city, state zip
				city = $.trim(arrCityState[0]);
				state = $.trim(arrCityState[1]);
			}
			
			if(state.length > 2){
				var statezip = $.trim(state);
				statezip.replace('.','');
				statezip.replace(' ','');
				state = $.trim(statezip.substring(0,2));
				zip = $.trim(statezip.substring(3,statezip.length));
			}
		}
	}
	
	data["street_number"] = streetNum;
	data["apt_number"] = aptNum;
	data["route"] = street;
	data["locality"] = city;
	data["administrative_area_level_1"] = state;
	data["postal_code"] = zip;
	data["country"] = "United States"; 
	
	return data;
}

/*function entryVsSuggestion(result, event){
	if(result.suggestions != null || result.suggestions.length > 0){
		$('#selectMine').unbind('click');
		$('#selectMine').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	return proceed(result.suggestions[0], event);
	    });
		$('#cancelButton').unbind('click');
		$('#cancelButton').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	return false;
	    });
		$('#selectSuggestion').unbind('click');
		$('#selectSuggestion').unbind('click').on("click", function() {
	    	$('#confirmAddressDialog').modal('hide');
	    	return proceed(result.suggestions[1], event);
	    });
		
		if(result.suggestions.length > 1){
			displayAddress('addressContents', result.suggestions);
			$('#confirmAddressDialog').modal('show');
		}
		else{
			return proceed(result.suggestions[0], event);
		}
	}
	else{
		alert('Address Validation returned emtpy list of addressses.');
	}
	return false;
}*/

/*function displayAddress(trId, result){
	var entry = result[0];
	var html = '<td id="addressEntered" style="border:1px solid #ccc; padding-left:10px;">';
	html += '<div>' + entry.address1 + '</div>';
//	html += '<div>' + entry.unit_number + '</div>';
	html += '<div>' + entry.city + '</div>';
	html += '<div>' + entry.state + '</div>';
	html += '<div>' + entry.zip + '</div>';
	html += '</td>';
	
	var suggestion = result[1];
	html += '<td id="suggestedAddress" style="width:200px; border:1px solid #ccc; padding-left:10px;">';
	html += '<div>' + suggestion.address1 + '</div>';
//	html += '<div>' + suggestion.unit_number + '</div>';
	html += '<div>' + suggestion.city + '</div>';
	html += '<div>' + suggestion.state + '</div>';
	html += '<div>' + suggestion.zip + '</div>';
	html += '</td>';
	$('#'+trId).html(html);
}*/

/*function proceed(selectedAddress, event){
	ghFunctn = partial(submitNewQuoteDialog);
	url = document.actionForm.newQuoteHomeURL.value;
	document.newQuoteForm.action = url;
	
	console.log("selectedAddress is " + JSON.stringify(selectedAddress));
	var massagedAddress = updateSelectedAddress(selectedAddress);
	console.log("massagedAddress is " + JSON.stringify(massagedAddress));
	
	//var input = $("<input>").attr("type", "hidden").attr("name", "addressSelected").val(JSON.stringify(massagedAddress));
	//$('#newQuoteForm').append($(input));
	document.newQuoteForm.addressSelected.value = JSON.stringify(massagedAddress);
	console.log("addressSelected is " + document.newQuoteForm.addressSelected.value);
	
	var homePolicyObj = getHomePolicy();
	
	if($('#newQuoteForm [name="homePolicy"]').length) {
		$('#newQuoteForm [name="homePolicy"]').val(JSON.stringify(homePolicyObj));
	} else {
		var homePolicy = $("<input>").attr("type", "hidden").attr("name", "homePolicy").val(JSON.stringify(homePolicyObj));
		$('#newQuoteForm').append(homePolicy);
	}
	 
	var userDetailsObj = getUserDetails();
	if($('#newQuoteForm [name="userDetails"]').length) {
		$('#newQuoteForm [name="userDetails"]').val(JSON.stringify(userDetailsObj));
	} else {
		var homeUser = $("<input>").attr("type", "hidden").attr("name", "userDetails").val(JSON.stringify(userDetailsObj));
		$('#newQuoteForm').append(homeUser);
	}
	
	console.log('proceed returning');
	return;
	if (exitPromptRequired(false)) {
		showExitPrompt(ghFunctn, false, "", event, true);
		return false;
	} else {
		showLoadingMsg();
		submitNewQuoteDialog();
	}
}*/


function validateHomePolicyeffectiveDate(homePolicyObj){
	// console.log('state = '+homePolicyObj.state +'channel = '+homePolicyObj.channel+'lob = '+homePolicyObj.lob +'effDate = '
		// +homePolicyObj.effectiveDate+ 'uwCompany = '+homePolicyObj.uwCompany); 
		
		var state = homePolicyObj.state;
		var lob = homePolicyObj.lob;
		var channel = homePolicyObj.channel;
		var companyId = homePolicyObj.companyId;
		var effDate = homePolicyObj.effectiveDate;
		var company = homePolicyObj.company;
		var uw_company = homePolicyObj.uw_company;
		var msg = 'valid';
		var policyForm = homePolicyObj.policyForm;
						
		
		if (policyForm == 'HO4' && $("#homeEffDateValidation").val() == 'Yes' && new Date(effDate).valueOf() < new Date('2017/07/01 00:00:00').valueOf()){
			msg = "Effective date cannot be prior to 7/1/17. "
		}else if(policyForm == 'HO3' && $("#homeEffDateValidation").val() == 'Yes' && new Date(effDate).valueOf() < new Date('2017/08/01 00:00:00').valueOf()){
			msg = "Effective date cannot be prior to 8/1/17. "
		}else if(policyForm == 'HO6'  && new Date(effDate).valueOf() < new Date('2017/12/01 00:00:00').valueOf()){
			msg = "Effective date cannot be prior to 01/01/18. "
		}
		
		
		if( msg == 'valid'){
			$.ajax({
		        headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		        },
		        url: "/aiui/landing/home/validatePolicyEffectiveDate?lob="+lob+ '&channel='+channel+ '&state='+state+ '&companyId='+
		        companyId+ '&effDate='+effDate+'&company='+company+'&uw_company='+uw_company,
		        type: "POST",
		        dataType: "JSON",
		        async : false,
				cache : false,
				success : function(data) {
					msg = data.message;
					msg = msg.replace(/\\/g,'\\');
				},
				error : function(xhr, status, error) {
					console.log(' validation home policy effective date fails with status:: '+status+" error ::"+error);
					msg = 'invalid';
				},
				complete : function() {
					// $.unblockUI();
				}
			});
		}
	
		return msg;
}

function getHomePolicy(){
	var homePolicyObj = new Object();
	
	// populate home policy object
	homePolicyObj.lob=getNQLOB();
	homePolicyObj.stateCd=getNQState();
	homePolicyObj.policyEffDt = $('#policyEffectiveDateNewCo').val();
	homePolicyObj.branchHierId =parseInt(getElm('branchNewCo', 'branchNewCoHidden').val());
	homePolicyObj.branchId =$('#branchLevelCodeNewCo').val();
	homePolicyObj.agencyHierId = parseInt(getElm('agencyNewCo', 'agencyNewCoHidden').val());
	homePolicyObj.agencyId	= $('#agencyLevelCodeNewCo').val();
	homePolicyObj.producerHierId = parseInt(getElm('producerNewCo', 'producerNewCoHidden').val());
	homePolicyObj.producerId = $('#producerLevelCodeNewCo').val();
	homePolicyObj.channelCd=$('#channelNewCo').val();
	homePolicyObj.uwCompanyCd = $('#uwCompanyNewCo').val();
	homePolicyObj.fiservAuthenticationId = parseInt($('#fiservIdNewCo').val());
	homePolicyObj.companyId=companyId;
	//homePolicyObj.companyCd = companyIdConvertToWeb[companyId];
	homePolicyObj.companyCd = companyIdConvertToWeb(companyId);
	homePolicyObj.policyForm = $('input[name=policyTypeNewCo ]:checked').val(); 
	homePolicyObj.autoPolicyNumber = $('#policyNumber_Policy').val();
	homePolicyObj.autoPolicyKey = $('#policyKey').val();
	homePolicyObj.crossSellFlag = $('#crossSellFlag').val();
	
	return homePolicyObj;
}

function getUserDetails(){
	var userObj = new Object();
	//console.log("User details :: first name ="+$('#fullName').val()+' last name = '+$('#myLastName').val()+' dob ='+$('#dobNewCo').val());
	userObj.firstName=$('#firstNameNewCo').val();
	userObj.lastName=$('#lastNameNewCo').val();
	userObj.birthDate=$('#dobNewCo').val();
	return userObj;
}

/*function updateSelectedAddress(selectedAddress){
	var address2, addressKey;
    var policyType = $('input[name=policyTypeNewCo ]:checked').val();
	
	if(policyType == "HO4"){
		addressKey = "";
		address2 = $('#aptNumberNewCo').val();
		address2 = address2.replaceAll('#','$10');
	}else{
		address2 = selectedAddress.address2;
		addressKey = document.newQuoteForm.addressKey.value;
		if(addressKey.length == 0){
			addressKey = selectedAddress.addressKey;
		}
	}
	
	var address = new Object();
	address.addrLine1Txt = selectedAddress.address1;
	address.addrLine2Txt = address2;
	address.cityName = selectedAddress.city;
	address.stateCd = selectedAddress.state;
	address.zip=selectedAddress.zip;
	address.addressKey = addressKey;
	
	if(selectedAddress.fullAddress){
		address.fullAddress = selectedAddress.fullAddress;
	}else{
		if(address2.length > 0){
			address.fullAddress = selectedAddress.address1+','+address2+','+selectedAddress.city+','+selectedAddress.state+','+selectedAddress.zip;
		}else{
			address.fullAddress = selectedAddress.address1+','+selectedAddress.city+','+selectedAddress.state+','+selectedAddress.zip;
		}
	}
	
	//console.log(JSON.stringify(address));

	return address;
}*/

function checkNewCoEdits(){
	var msg = "";
	
	// first name
	firstNameNewCo = $('#newQuoteForm [id="firstNameNewCo"]');
	firstNameNewCoMsg  = requiredNQValue(firstNameNewCo, "newQuoteFirstNameNewCoCol");
	var policyForm = $("input[name='policyTypeNewCo']:checked").val();
	if(policyForm != 'HO3'){
	if (firstNameNewCoMsg != "") {
		$('#firstNameNewCo').addClass("inlineError");
		msg = msg + firstNameNewCoMsg;
	}else{
		// check if invalid
		firstNameNewCoMsg  = validateAdvSrchName(firstNameNewCo, "newQuoteFirstNameNewCoCol");
		if (firstNameNewCoMsg != "") {
			$(firstNameNewCo).addClass("inlineError");
			msg = msg + firstNameNewCoMsg;
		}
	}
	
	// last name
	lastNameNewCo = $('#newQuoteForm [id="lastNameNewCo"]');
	lastNameNewCoMsg  = requiredNQValue(lastNameNewCo, "newQuoteLastNameNewCoCol");
	if (lastNameNewCoMsg != "") {
		$(lastNameNewCo).addClass("inlineError");
		msg = msg + lastNameNewCoMsg;
	}else{
		// check if invalid
		lastNameNewCoMsg  = validateAdvSrchName(firstNameNewCo, "newQuoteFirstNameNewCoCol");
		if (lastNameNewCoMsg != "") {
			$(lastNameNewCo).addClass("inlineError");
			msg = msg + lastNameNewCoMsg;
		}
	}
	
	// dob
	dobNewCo = $('#newQuoteForm [id="dobNewCo"]');
	dobNewCoMsg = validateNewQuoteDate(dobNewCo, "newQuoteDOBNewCoCol");
	if (dobNewCoMsg != "") {
		msg = msg + dobNewCoMsg;
	}
	}
	
	// full address
	fullAddressNewCo = $('#newQuoteForm [id="fullAddressNewCo"]');
	fullAddressNewCoMsg  = requiredNQValue(fullAddressNewCo, "newQuoteFullAddressNewCoCol");
	if (fullAddressNewCoMsg != "") {
		$(fullAddressNewCo).addClass("inlineError");
		msg = msg + fullAddressNewCoMsg;
	}else{
		// check if it is valid
		fullAddressNewCoMsg  = validFullAddress(fullAddressNewCo, "newQuoteFullAddressNewCoCol");
		if (fullAddressNewCoMsg != "") {
			$(fullAddressNewCo).addClass("inlineError");
			msg = msg + fullAddressNewCoMsg;
		}
	}
	
	// effective date
	policyEffectiveDateNewCo = $('#newQuoteForm [id="policyEffectiveDateNewCo"]');
	policyEffectiveDateNewCoMsg = validateNewQuoteDate(policyEffectiveDateNewCo, "newQuotePolicyEffectiveDateNewCoCol");
	if (policyEffectiveDateNewCoMsg != "") {
		msg = msg + policyEffectiveDateNewCoMsg;
	}
	
	
	if(isEmployee() && !isEmployeeCurrentProfile()){
		// branch
		branchNewCo = getElm("branchNewCo", "branchNewCoHidden");
		branchNewCoMsg  = requiredNQValue(branchNewCo, "newQuoteBranchNewCoCol");
		if (branchNewCoMsg != "") {
			$(branchNewCo).addClass("inlineError").trigger('chosen:updated').trigger(
			'chosen:styleUpdated');
			$('#' + branchNewCo.id + '_chosen a').addClass('inlineError');
			msg = msg + branchNewCoMsg;
		}
		
		// agency
		agencyNewCo = getElm("agencyNewCo", "agencyNewCoHidden");
		agencyNewCoMsg  = requiredNQValue(agencyNewCo, "newQuoteAgencyNewCoCol");
		if (agencyNewCoMsg != "") {
			$(agencyNewCo).addClass("inlineError").trigger('chosen:updated').trigger(
			'chosen:styleUpdated');
			$('#' + agencyNewCo.id + '_chosen a').addClass('inlineError');
			msg = msg + agencyNewCoMsg;
		}
	}
	
	// Producer Code
	if (!$('tr#producerNewCoRow').hasClass('hidden')) {
		producerNewCo = getElm("producerNewCo", "producerNewCoHidden");
		producerNewCoMsg  = requiredNQValue(producerNewCo, "newQuoteProducerNewCoCol");
		if (producerNewCoMsg != "") {
			$(producerNewCo).addClass("inlineError").trigger('chosen:updated')
					.trigger('chosen:styleUpdated');
			$('#' + producerNewCo.id + '_chosen a').addClass('inlineError');
			msg = msg + producerNewCoMsg;
		}
	}
	
	return msg;
}

function chkMgEffDtNQ(channel, companyId, stateVal){
	
	var homePolicyObj = new Object();
	homePolicyObj.state=stateVal;
	homePolicyObj.channel=channel;
	homePolicyObj.lob=getMgEffDtLOB();
	homePolicyObj.effectiveDate = $('#policyEffectiveDateNewCo').val();
	homePolicyObj.companyId=companyId;
	homePolicyObj.uw_company='';
	homePolicyObj.company='';
	
	return validateHomePolicyeffectiveDate(homePolicyObj);
	
}

function getMgEffDtLOB(){
	var lob = getNQLOB();
	if(lob == 'HO'){
		lob = "Home";
	}else if(lob == 'PA'){
		lob = "Auto";
	}
	return lob;
}

function chkEdit(frmName, elmId, funct, rowName){
	//var elm = $('#' + frmName + '[id="' + elmId + '"]');
	var elm = $('#' + elmId);
	var action = partial(funct, elm, rowName);
	return action();
}

function getElm(field, fieldHidden){
	var elm  = $("#" + fieldHidden);
	if($(elm).val() == ""){
		elm  = $("#" + field);
	}
	
	return elm;

}

function populateHiddenProdFields(fromGlobal){
	if(fromGlobal){
		$('#producerLevelCodeNewCo').val($('#producerNewCo option:selected').data('code')); 
		$('#companyIdNewCo').val($('#producerNewCo option:selected').data('corp')); 
		$('#uwCompanyNewCo').val($('#producerNewCo option:selected').data('uw')); 
		$('#channelNewCo').val($('#producerNewCo option:selected').data('support'));
		$('#branchLevelCodeNewCo').val($('#producerNewCo option:selected').data('branchcode'));
		$('#agencyLevelCodeNewCo').val($('#producerNewCo option:selected').data('agencycode'));
		$('#fiservIdNewCo').val($('#producerNewCo option:selected').data('fiserv'));
		
		if(!isEmployee()){
			$('#branchNewCoHidden').val($('#producerNewCo option:selected').data('branchid'));
			$('#agencyNewCoHidden').val($('#producerNewCo option:selected').data('agencyid'));
		}
	}else{
		var elm = $('select.clsProducer option:selected');
		$('#homeBranchId').val(elm.data('branchcode'));
		$('#homeAgencyId').val(elm.data('agencycode'));
		$('#homeProducerId').val(elm.data('code'));
		$('#homeChannelCd').val(elm.data('support'));
		$('#homeCompanyCd').val(companyIdConvertToWeb(elm.data('corp')));
		//$('#homeCompanyCd').val(companyIdConvertToWeb[elm.data('corp')]);
		$('#homeUWCompanyCd').val(elm.data('uw'));
		$('#homeFiservAuthenticationId').val(elm.data('fiserv'));
		
		if(isEmployee() && !isEmployeeCurrentProfile()){
			$('#homeBranchHierId').val(elm.data('branchId'));
			$('#homeAgencyHierId').val(elm.data('agencyId'));
		}
	}
}

function isNewHomeNQProduct(){
	// jgarrison - will need to modify with state implementations
	if((getNQState() == 'PA' || getNQState() == 'NY') && getNQLOB() == 'HO'){
		return true;
	}else{
		return false;
	}
}

/*function isRentersQuote(){
	var policyType = "";
	
	if($('#newQuoteDialog').hasClass('in')){
		policyType = $('input[name=policyTypeNewCo ]:checked').val();
	}else if($("#homePolicyForm")){
		policyType = $("#homePolicyForm").val();
	}
	
	if(policyType == "HO4"){
		return true;
	}else{
		return false;
	}
}*/

function changeHomeNQView(policyForm){
	if(policyForm == "HO3"){
		 $('.clsAddressLookup').autocomplete( "enable");  // enable jQuery UI autocomplete
		 if(typeof autocomplete != "undefined"){
			// disable google map api autocomplete
			var input = document.getElementById('fullAddressNewCo');
		    google.maps.event.clearInstanceListeners(input);
		 }
		 $('tr#aptNumberNewCoRow').addClass('hidden');
		 $("tr#firstNameNewCoRow").addClass('hidden');
		 $("tr#lastNameNewCoRow").addClass('hidden');
		 $("tr#dobNewCoRow").addClass('hidden');
		 $("tr#policyEffectiveDateNewCoRow").addClass('hidden');
	}else{
		$('.clsAddressLookup').autocomplete( "disable"); // disable jQuery UI autocomplete
		initAutocomplete();  // enable google map api autocomplete
		$('tr#aptNumberNewCoRow').removeClass('hidden');
		$("tr#firstNameNewCoRow").removeClass('hidden');
		$("tr#lastNameNewCoRow").removeClass('hidden');
		$("tr#dobNewCoRow").removeClass('hidden');
		$("tr#policyEffectiveDateNewCoRow").removeClass('hidden');
	}
	
	// set default policy effective date if user toggles between policy type
	var effectiveDate = new Date();
	var day = effectiveDate.getDate();
	var month = effectiveDate.getMonth() + 1;
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	var year = effectiveDate.getFullYear();
	var today =  month.toString() + '/' + day.toString() + '/' + year.toString();
	
	if (policyForm == 'HO3' && $("#homeEffDateValidation").val() == 'Yes' && new Date().valueOf() < new Date('2017/08/01 00:00:00').valueOf()){
		$('#policyEffectiveDateNewCo').val("08/01/2017");
	}else if(policyForm == 'HO6' && new Date().valueOf() < new Date('2017/12/01 00:00:00').valueOf()){
		$('#policyEffectiveDateNewCo').val($("#condoOwnersEffDate").val());
	}else {
		$('#policyEffectiveDateNewCo').val(today);
	} 
	
	resetValues();
}

function resetValues(){
    $('#firstNameNewCo').val('');
    $('#lastNameNewCo').val('');
    $('#dobNewCo').val('');
    $('#fullAddressNewCo').val('');
    $('#aptNumberNewCo').val('');
    //$('#policyEffectiveDateNewCo').val('');
    $('.addressOption').remove(); 
    $('#addressKey').val('');
    $('#addressSelected').val('');
    
    $('#firstNameNewCo').removeClass("inlineError");
    $('#lastNameNewCo').removeClass("inlineError");
    $('#dobNewCo').removeClass("inlineError");
    $('#fullAddressNewCo').removeClass("inlineError");
    $('#aptNumberNewCo').removeClass("inlineError");
    $('#policyEffectiveDateNewCo').removeClass("inlineError");

}


function displayCreditErrWindow(errMsg){
	var policyType =$('input[name=policyTypeNewCo ]:checked').val();
	if((policyType == 'HO4' || policyType == 'HO6') && errMsg == 'No Hit'){
		$('#addPriorSsnNQ').modal('show');
		$('#divAddressFormatMsg').modal('hide');
		initAutocomplete(); // set google type ahead for prior address field
	}else if(errMsg == 'ratingError'){
		$('#rateError').modal('show');
	}else if(policyType == 'HO3' && errMsg == 'ratingErrorForAddrNotFound'){
		$('#addressNotFoundNQ').modal('show');
	}else if(policyType == 'HO3' && errMsg == 'rateErrorForHomeowners'){
		$('#rateErrorForHomeowners').modal('show');
	}else if((policyType == 'HO4' || policyType == 'HO6') && errMsg == 'ratingErrorForTerrNotFound'){
		$('#rateErrorForTerrNotFound').modal('show');
	}else{
		submitNewHomeQuote(); // for now submit for HO3 but this will change with new credit window - JG
	}
}

function chkCreditIssueForHome() {
	var errMsg = '';
	var addressSelected = document.newQuoteForm.addressSelected.value;
	var homePolicy = document.newQuoteForm.homePolicy.value;
	var userDetails = document.newQuoteForm.userDetails.value;
	
	var strURL = addRequestParam(document.actionForm.newQuoteHomeURL.value, "addressSelected", addressSelected);
	strURL = addRequestParam(strURL, "homePolicy", homePolicy);
	strURL = addRequestParam(strURL, "userDetails", userDetails);

	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url: strURL,
        type: 'get',
		dataType: 'json',
		cache: false, 
		beforeSend: function(status, xhr){
			showLoadingMsg();
		},
		success: function(data) {
			errMsg = data.message;
			errMsg = errMsg.replace(/\\/g,'\\');
			$('#homePolicyKey').val(data.policyKey);
		},
		error: function(xhr, status, error) {
			errMsg = 'ratingError';
		},
		complete : function() {
			displayCreditErrWindow(errMsg);
			$.unblockUI();
		}
	});
}

function submitNewHomeQuote(){
	var url = document.actionForm.homeQuoteTabURL.value;
	var event = jQuery.Event(getSubmitEvent());
	
	if(event.isPropagationStopped()) {
		$.unblockUI();
	}else{
		showLoadingMsg();
		//68511-PA Cross Sell Breadcrumb Issue and NJ error.
		document.newQuoteForm.autoPolicyNumber.value = $('#policyNumber_Policy').val();
		document.newQuoteForm.autoPolicyKey.value = $('#policyKey').val();
		document.newQuoteForm.crossSellFlag.value = $('#crossSellFlag').val();
		document.newQuoteForm.action= url;
		document.newQuoteForm.submit();
	}
}

function reOrderCreditForHomeQuote(){
	var reOrderCredit = "No";
	var url = document.actionForm.reOrderHomeCreditURL.value;
	
	if($('#crossSellFlag').val() == 'Yes') {
		url = document.actionForm.editQuoteFromCrossSell.value;
	}

	var ssn = $('#ssn_PRIMARY_INSURED_NQ').val();
	var priorAddr = $.trim($('#prioraddr_PRIMARY_INSURED_NQ').val());
	var priorAddrApt = $.trim($('#prioraddr_apt_PRIMARY_INSURED_NQ').val());
	priorAddrApt = priorAddrApt.replaceAll('#','$10');

	var event = jQuery.Event(getSubmitEvent());
	
	//when ssn is removed from ssn text input , remove hidden ssn field.
	var maskedSsn = $('#mask_ssn_PRIMARY_INSURED_NQ').val();
	if(maskedSsn == null || maskedSsn == undefined || maskedSsn.length<1){
		ssn = '';
	}
	
	var submitReorderDialog = true;
	if(ssn != ''){
		var isSSnValid = validSSNHome(document.getElementById('ssn_PRIMARY_INSURED_NQ'));
		if(!isSSnValid){
			$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('Invalid ssn');
			document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
		}else{
			$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('');
			document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="";
		}
	}else{
		$('#mask_ssn_PRIMARY_INSURED_NQ_ERROR').text('');
		document.getElementById('mask_ssn_PRIMARY_INSURED_NQ_ERROR').style.color="";
	}
	
	
	if(priorAddr != ''){
		var fullAddress =priorAddr;
		var data = {'fullAddress':fullAddress};
		data = parseManualAddrDQM(fullAddress, data);
		//var streetNum = data["street_number"];
		var street = data["route"];
		var city = data["locality"];
		// var state = data["administrative_area_level_1"];
		var zip = data["postal_code"];
		//dont check state
		//Temporary Solution to validate Zip according to length 
		if(street == "" || city == "" || zip == "" || (! isValidateZipPrevAddr(zip)) || (! isValidateCityPrevAddr(city))){
			$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('Please have commas only after the street and  after the city.');
			$('#divAddressFormatMsg').modal('show');
			document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
		}else{
			$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('');
			document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="";
		}
	}else{
		$('#prioraddr_PRIMARY_INSURED_NQ_ERROR').text('');
		document.getElementById('prioraddr_PRIMARY_INSURED_NQ_ERROR').style.color="";
	}
	
	if(submitReorderDialog){
		if(ssn != '' || priorAddr != ''){
			 reOrderCredit = "Yes";
		}
		
		$('#addPriorSsnNQ').modal('hide');
		
		if(event.isPropagationStopped()) {
			$.unblockUI();
		}else{
			showLoadingMsg();
			document.newQuoteForm.ssnPrimInsuredHome.value = ssn;
			document.newQuoteForm.priorAddrHome.value = priorAddr;
			document.newQuoteForm.priorAddrApt.value = priorAddrApt;
			document.newQuoteForm.reOrderCreditHome.value = reOrderCredit;
			document.newQuoteForm.autoPolicyNumber.value = $('#policyNumber_Policy').val();
			document.newQuoteForm.autoPolicyKey.value = $('#policyKey').val();
			document.newQuoteForm.crossSellFlag.value = $('#crossSellFlag').val();
			document.newQuoteForm.action= url;
			document.newQuoteForm.submit();	
		}
	}else{
		return;
	}
}

function isValidateZipPrevAddr(zip) {
	//var errorId = id.substring(0, id.length - 1);
	var zipVal = zip.valueOf();
	var regexZip = /^\d{5}$/;
	var result = true;
	if (!(zipVal.match(regexZip))) {
		result = false;
	}
	return result;
}

function isValidateCityPrevAddr(city) {
	
	var cityVal = city.valueOf();
	var regexCity = /^[A-Za-z\s]+$/;
	var result = true;
	if(!(cityVal.match(regexCity))){	
		result = false;
	}
	return result;	
}


function reOrderCreditForHomeQuoteForAddrNotFound(){
	
	var reOrderCredit = "No";
	var url = document.actionForm.reOrderHomeCreditURL.value;
	var addressSquareFootage = $('#addressSquareFootage_NQ').val();
	var addressYearBuilt = $('#addressYearBuilt_NQ').val();
	var event = jQuery.Event(getSubmitEvent());
	var submitReorderDialog = true;
	var decLineMessageText = "This risk is ineligible for Plymouth Rock.";
	
	if(addressSquareFootage == ''){
		
			$('#addressSquareFootage_NQ_ERROR').text('Square Feet should not be empty.');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
	}else{
		var isAddressSquareFeetValid = checkCharsSquareFeet(document.getElementById('addressSquareFootage_NQ'));
		if(isAddressSquareFeetValid){
			$('#addressSquareFootage_NQ_ERROR').text('');
			document.getElementById('addressSquareFootage_NQ_ERROR').style.color="";
			submitReorderDialog = true;
		}else{
			event.stopPropagation();
			submitReorderDialog = false;
		}
	}
	if(addressYearBuilt != ''){
		submitReorderDialog = false;
		var isAddressYearBuiltValid = checkYearBuilt(document.getElementById('addressYearBuilt_NQ'));
		var isAddressYearBuiltLength = checkLengthYearBuilt(document.getElementById('addressYearBuilt_NQ'))
		var isCrossSell = document.newQuoteForm.crossSellFlag.value = $('#crossSellFlag').val();
		var policyFormType = $('input[name=policyTypeNewCo ]:checked').val();
		if(isAddressYearBuiltLength){
			if(isAddressYearBuiltValid ){
				submitReorderDialog = true;
			}else{
				$('#declineMessage').show();
				$('#declineMessage').addClass('left applicationNav alert alert-info hardAlert');
				$('#declineMessage').css({
					'text-align' : 'center',
					'text-indent' : '20px',
					'margin-left' : '30px',
					'margin-top' : '10px',
					'width' : '250px',
					'height' : '10px'
				});
				$('#declineMessage').text(decLineMessageText);
				disableAddrNotFoundFields();
				submitReorderDialog = false;
				// For TD 75616 - Showing soft-decline message for crossSell when year built is < 1870 
				if(isCrossSell) {
					$("#multiPolicy").removeClass("multiPolicyMessage").addClass("declineMessage");
					if (policyFormType == 'HO3') {$("#multiPolicy").text("Home does not meet our underwriting guidelines");}
					else if (policyFormType == 'HO4') {$("#multiPolicy").text("Renters does not meet our underwriting guidelines");}
					else if (policyTypeForm == 'HO6') {$("#multiPolicy").text("Condo does not meet our underwriting guidelines");}
				}
			}
		}
	
	}else{	
			$('#addressYearBuilt_NQ_ERROR').text('Year Built Should not be empty');
			document.getElementById('addressYearBuilt_NQ_ERROR').style.color="red";
			submitReorderDialog = false;
	}
	
	
	if(submitReorderDialog){
		if(addressSquareFootage != '' && addressYearBuilt != ''){
			reOrderCredit = "Yes";
			 
		}		
		
		if(event.isPropagationStopped()) {
			$.unblockUI();
		}else{
			$('#addressNotFoundNQ').modal('hide');
			showLoadingMsg();
			document.newQuoteForm.addressSquareFootageHome.value = addressSquareFootage;
			document.newQuoteForm.addressYearBuiltHome.value = addressYearBuilt;
			document.newQuoteForm.reOrderCreditHome.value = reOrderCredit;
			document.newQuoteForm.autoPolicyNumber.value = $('#policyNumber_Policy').val();
			document.newQuoteForm.autoPolicyKey.value = $('#policyKey').val();
			document.newQuoteForm.crossSellFlag.value = $('#crossSellFlag').val();
			document.newQuoteForm.action= url;
			document.newQuoteForm.submit();	
		}
	}else{
		return;
	}
}

function disableAddrNotFoundFields(){
	$("#addressYearBuilt_NQ, #addressSquareFootage_NQ").prop("disabled", true);
	$("#saveAddressDetailsNQ").prop("disabled", true);
	
}
function checkYearBuilt(elm){
	var addressYearBuilt = $.trim(elm.value);

	if(addressYearBuilt == "" ) {return false;}
	else {		
		if(addressYearBuilt >= 1870){ 
			return true ;
			}
		else {return false;}
	}
}

function checkLengthYearBuilt(elm){
	var addressYearBuilt = $.trim(elm.value);
	if(addressYearBuilt.length >= 1){
		if(!/^\d{4}$/.test(addressYearBuilt)){
			return false;
		}else {
			return true;
		}
	}else return true;	
}

function checkCharsSquareFeet(elm){
	var addressSquareFeet = $.trim(elm.value);
	var checkZero = 0;
	if(addressSquareFeet.length >= 1){
		if(addressSquareFeet === String(checkZero)){
			return false;
		}
		else if(!/^\d+$/.test(addressSquareFeet)){
			return false;
		}else {
			return true;
		}
	}else return true;	
}

function validSSNHome(elm){
	
	
	var ssn = $.trim(elm.value);
	
	if (ssn.length == 9) {
		ssn = ssn.substring(0,3) + '-' + ssn.substring(3,5) + '-' + ssn.substring(5,9);
	}
	var matchArr = ssn.match(/^(\d{3})-?\d{2}-?\d{4}$/);
	var numDashes = ssn.split('-').length - 1;
	var errMsg = "";
	
	if((ssn == "") || (ssn.substr(6,5) == "-****")||((isEndorsement() && ssn.substr(5,4) == "****" ))) {return false;}
	else {
		
		if(!/^(\d{3})-?\d{2}-?\d{4}$/.test(ssn)){
			errMsg = 'SSN is Invalid regEx';
		}
		if (numDashes == 1) 
			errMsg = 'SSN must be 9 digits';
		else if (ssn.substr(0,1) == 9)
			errMsg = 'SSN cannot begin with a 9';	
		else if ((ssn.substr(4,1) == 0 ) &&  (ssn.substr(5,1) == 0 ))
			errMsg = 'Positions 4 and 5 cannot be 00 in SSN.';
		else if ((ssn.substring(0,1) == ssn.substring(1,2)) && (ssn.substring(1,2) == ssn.substring(2,3)) && (ssn.substring(2,3) == ssn.substring(4,5)) && (ssn.substring(4,5) == ssn.substring(5,6)) && (ssn.substring(5,6) == ssn.substring(7,8)) && (ssn.substring(7,8) == ssn.substring(8,9))  && (ssn.substring(8,9) == ssn.substring(9,10))  && (ssn.substring(9,10) == ssn.substring(10,11)) )
			errMsg = 'SSN cannot consist of equal numbers';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)) 
			errMsg = 'Reverse sequential series of numbers are not valid in SSN';
		else if (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) && ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)) 
			errMsg = 'Sequential series of numbers are not valid in SSN';	
		
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == -1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == -1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == -1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == -1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == -1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if (errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == -1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == -1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == -1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == -1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =='' && (((ssn.substring(0,1)-ssn.substring(1,2)) == 1) && 
				 ((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 )))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		else if (errMsg =='' && (((ssn.substring(1,2)-ssn.substring(2,3)) == 1) && 
				 ((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
		
		else if (errMsg =="" && (((ssn.substring(2,3)-ssn.substring(4,5)) == 1) && 
				 ((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(4,5)-ssn.substring(5,6)) == 1 ) && 
				 ((ssn.substring(5,6)-ssn.substring(7,8)) == 1) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) &&
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) ))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		else if ( errMsg =='' && (((ssn.substring(5,6)-ssn.substring(7,8)) == 1 ) && 
				 ((ssn.substring(7,8)-ssn.substring(8,9)) == 1) && 
				 ((ssn.substring(8,9)-ssn.substring(9,10)) == 1) &&
				 ((ssn.substring(9,10)-ssn.substring(10,11)) == 1)))
			errMsg = 'Five Sequential series of numbers are not valid in SSN';
			
		if(errMsg != ""){ 
			return false;
			}
		else {return true;}
	}
}

/*function setCrossSellView(){
if($('#returnAutoPA').length){
	if($('div#returnAutoPA').css("display") != 'none'){
		$('#globalHeaderBottom').css('margin-top','30px');
	}else{
		$('#globalHeaderBottom').css('margin-top','43px');
}
}else{
	$('#globalHeaderBottom').css('margin-top','43px');
}
}*/