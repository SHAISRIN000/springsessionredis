 jQuery(document).ready(function() {
	 
	 disableAQTabs();
	 
	 $('.navTab').click(function(){
		if(!$(this).hasClass('active'))
			getTabSelected(this.id);
    });
	 //Reset the advance search field - "System" to empty. 
	 //If this isn't set All Quotes by default is going to take Legacy as a default parameter 
	 $("#system").val('');
	 //console.log('all quotes search = '+document.actionForm.searchResultsURL.value);
	/* JQGrid logic */
	$('#grid').jqGrid({
		url: document.actionForm.searchResultsURL.value.replaceAll("%25","'"),
		datatype:'json',
		mtype:'GET',
		colNames:['Name', 'Quote #', 'Effective Date', 'Transaction Type', 'Status', 'Premium', 
		          'Line of Business', 'Last Updated', 'Esignature Status', 'Esignature Trans Date', 
		          'PolicyKey', 'FirstName', 'LastName', 'RowNumber', 'NickName', 'Owner', 
		          'Source', 'State', 'Term', 'Esignature', 'DataSource', 'CIFlag', 'PolicyStatus', 
		          'lob', 'company', 'PNumber','channel', 'uwCompany', 'transactionId','branchId','agencyId','emailId','producedId','srcOfEntry','quickQuoteInd'],
		colModel:[
	   		{ name:'name',
	   		  index:'name',
	   		  classes:'applicantName',
	   		  formatter:nameFormater,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   	        return obj.lastName + ', ' + obj.firstName;
	   		 },
	   		  width:160
	   		 },
	   		 
	   		{ name:'policyNumber',
	   		  index:'policyNumber', 
	   		  classes:'policyNumber',
	   		  formatter:quoteNumFormatter,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
		   	        return obj.policyNumber;
		   		 },
	   		  width:150
	   		 },
	   		{ name:'effectiveDate',
	   		  index:'effectiveDate',
	   		  formatoptions:{newformat:'m/d/Y'},
	   		  datefmt:'Y-m-d',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			    return new Date(obj.effectiveDate);
	   		  },
	   		  width:90
	   		},
	   		{ name:'alignedTransactionType',
	   		  index:'alignedTransactionType',
	   		  formatter:transactionTypeFormatter,
			  sortable:true,
	   		  sorttype:'text',
			  width:115
	   		},
	   		{ name:'alignedTransactionStatus',
	   		  index:'alignedTransactionStatus',
			  sortable:true,
		   	  sorttype:'text',
		   	  width:110
		   	},
	   		{ name:'premium',
	   	      index:'premium',
	   	      classes:'money allQuotesCol',
	   	      formatter:moneyFormatter,
	   	      sortable:true,
		   	  sorttype:'float',
		   	  editrules:{edithidden: true},
	   	      width:95
	   		},
		   	{ name:'alignedLob',
	   	      index:'alignedLob',
			  sortable:true,
		   	  sorttype:'text',
	   	      width:85
		   	},
	   		{ name:'lastUpdatedDate',
	   		  index:'lastUpdatedDate',
	   		  classes:'allQuotesCol',
	   		  formatter:dateTimeFormatter,
	   		  formatoptions:{newformat:'m/d/Y'},
	   		  datefmt:'m/d/Y',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			  return new Date(obj.lastUpdatedDate);
	   		  },
	   		  editrules:{edithidden: true},
		      width:93
			},
			{ name:'esignatureStatus',
			  index:'esignatureStatus',
			  formatter:esignStatusFormatter,
			  classes:'eSignCol',
			  sortable:true,
			  sorttype: function (cell, obj) { 
		   	        return obj.esignatureStatus;
		   	  },
			  hidden:true,
			  editrules:{edithidden: true},
			  width:95
			},
			{ name:'esignatureDate',
	   		  index:'esignatureDate',
	   		  classes:'eSignCol',
	   		  formatter:dateTimeFormatter,
	   		  formatoptions:{newformat:'m/d/Y'},
	   		  datefmt:'m/d/Y',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			  return new Date(obj.esignatureDate);
	   		  },
	   		  hidden:true,
	   		  editrules:{edithidden: true},
		      width:93
			},
			{ name:'policyKey', index:'policyKey',hidden:true},
			{ name:'firstName', index:'firstName',hidden:true},
			{ name:'lastName', index:'lastName', hidden:true},
			{ name:'rowNumber',index:'rowNumber',hidden:true},
			{ name:'nickName', index:'nickName',hidden:true },
			{ name:'owner', index:'owner',hidden:true},
			{ name:'source',index:'source',hidden:true},
		    { name:'state',index:'state',hidden:true},
			{ name:'term',index:'term',hidden:true},
		    { name:'esignature',index:'esignature',hidden:true},
		    { name:'dataSource',index:'dataSource',hidden:true},
			{ name:'ciFlag',index:'ciFlag',hidden:true},
			{ name:'status',index:'status',hidden:true},
			{ name:'lob',index:'lob',hidden:true},
			{ name:'company',index:'company',hidden:true},
			{ name:'policyNumber',index:'policyNumber',hidden:true},
			{ name:'channel',index:'channel',hidden:true},
			{ name:'uwCompany',index:'uwCompany',hidden:true},
			{ name:'transactionId',index:'transactionId',hidden:true},
			{ name:'branchId',index:'branchId',hidden:true},
			{ name:'agencyId',index:'agencyId',hidden:true},
			{ name:'emailId',index:'emailId',hidden:true},
			{ name:'producedId',index:'producedId',hidden:true},
			{ name:'srcOfEntry',index:'srcOfEntry',hidden:true},
			{ name:'quickQuoteInd',index:'quickQuoteInd',hidden:true},
			],
		   	
			beforeRequest:function(){
				clearGridLoad();
		   		showLoadingMsg();
		   	},

		   	loadComplete: function(data){
		   		//console.log('data = '+JSON.stringify(data));
		   		var count;
		   		var selectedTab = $('#searchIn').val();
	   			var tabAdvSearch = selectedTab + "_advSearch";
	   			var errMsg = data.errorMessage;
	   			var sortCol = $('#grid').jqGrid('getGridParam','sortname');
	   			var sortOrder = $('#grid').jqGrid('getGridParam','sortorder');
	   			
	   			// Check if user has performed an Advanced Search on the selected tab
	   			if(hasPerformedAdvSearchForTab(tabAdvSearch)) {
	   				$('#clearAdvSearch').show();
				}
	   			
	   		    // get record count
	   			if(data.recordCount != undefined){
	   				count = data.recordCount;
	   				$('#sortCount').text(count);
	   			}else{
	   				count = $('#sortCount').text();
	   			}
	   			
	   			sortAQGrid(selectedTab, sortCol, sortOrder, count);
	   			displayRecordCount($('#grid').getGridParam('records'), count, errMsg);
		   		//$('.ui-autocomplete.ui-menu').hide();
		   		resetSearchURL();
		   		processThirdPartyError();
		   		$.unblockUI();
		   		
		   	},
		   	
		   	gridComplete: function() {
		   		showHideGridColumns();
		   		displayGridView();
		   	},
		   	
		   	loadonce:true,
		    gridview:false,
		    treeGrid:false,
		    hoverrows:false,
		    rowNum:100,
	        height:'100%',
	        ignoreCase:true,
	        rownumbers:false,
            viewrecords:false,
		    scroll:false,
	        scrollOffset:0,
	        scrollrows:false,
		    shrinkToFit:false,
		    multiselect:false, 
		    subGrid:false,
		    altRows:true,
		    altclass:'altRows',
		    
			beforeSelectRow:function(e){
		 		return false;
		 	},
		    
		    loadError:function(xhr,st,err) { 
		    	$.unblockUI();
		    	showAQSvcError();
		    	
		    	// show advanced search link
		    	$('.openPolicyAdvSearch').show();
		    	
		    	var selectedTab = $('#searchIn').val();
	   			var tabAdvSearch = selectedTab + "_advSearch";
	   		
	   			// Check if user has performed an Advanced Search on the selected tab
	   			if(hasPerformedAdvSearchForTab(tabAdvSearch)) {
	   				$('#clearAdvPolSearch').show();
				}
		    },
		    
		    jsonReader: {
		        root:'rows',
		        page:'page',
		        total:'total',
		        records:'recordCount',
		        repeatitems:false,
		        cell:'cell',
		        id:'id'
		    }
		});
		
	    function transactionTypeFormatter(TransactionType)
	    {
	    	if(TransactionType == "Endorse")
	    		return "Endorsement"
	    	else(!TransactionType == "Endorse")	
	    	    return TransactionType 
	    }
		
		// Clear quote advanced search
		$('#clearAdvSearch').click(function(){
			clearAdvSearch();
		});
		
		// Stop Esignature
		$('#submitStopEsign').click(function(){
			if(validateStopEsign()){
				stopEsignature();
			}
		});
		
		
		// Resend Esignature
		$('#submitResendEsign').click(function(){
			if(validateResendEsign()){
				resendEsignature();
			}
		});
		// Advanced Search link
		$('#advSearch').click(function(){
			resetForm($('#advSearchForm'));
			openAdvSearch();
		});
		
		// Advanced Search button
		$('#submitAdvSearch').click(function(){
			submitAdvancedSearch();
		});
		
		formatAllQuotesTabs();
		
		/*$("td.applicantName").live({
   			mouseenter: function(e){
   				var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			genAddInfo(rowId);
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
   			},
   			mouseleave: function(e){
   				var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			hideAddInfo(rowId);
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
   			}
   		});
   		
   		$("td.policyNumber").live({
   			mouseenter: function(e){
   				var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			hideToolTip($(this));
   				genActionsListAQ(rowId);
   				e.preventDefault ? e.preventDefault() : e.returnValue = false;
   			},
   			mouseleave: function(e){
   				var trRow = $(this).parent();
   				var rowId = $(trRow).attr('id');
   				clearActionsList(rowId);
   				e.preventDefault ? e.preventDefault() : e.returnValue = false;
   			}
   		});
   		
   		$("tr.jqgrow").live({
   			mouseenter: function(e){
   				var rowId = $(this).attr('id'); 
   	   			$('#addInfo_' + rowId).show();
   	   			$('#actionsArrow_' + rowId).show();
   			},
   			mouseleave: function(e){
   				var rowId = $(this).attr('id');
   	   			$('#addInfo_' + rowId).hide();
   		   		$('#actionsArrow_' + rowId).hide();
   			}
   		});*/
		
		  $(document)
		  	.on("mouseenter", "td.applicantName", function(e) {
		  		var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			genAddInfo(rowId);
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		  	})
		  	.on("mouseleave", "td.applicantName", function(e) {
		  		var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			hideAddInfo(rowId);
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
   		});
   		
		  $(document)
		  	.on("mouseenter", "td.policyNumber", function(e) {
		  		var trRow = $(this).parent();
	   			var rowId = $(trRow).attr('id');
	   			hideToolTip($(this));
   				genActionsListAQ(rowId);
   				e.preventDefault ? e.preventDefault() : e.returnValue = false;
		  	})
		  	.on("mouseleave", "td.policyNumber", function(e) {
		  		var trRow = $(this).parent();
   				var rowId = $(trRow).attr('id');
   				clearActionsList(rowId);
   				e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

		  $(document)
		  	.on("mouseenter", "tr.jqgrow", function(e) {
		  		var rowId = $(this).attr('id'); 
   	   			$('#addInfo_' + rowId).show();
   	   			$('#actionsArrow_' + rowId).show();
		  	})
		  	.on("mouseleave", "tr.jqgrow", function(e) {
		  		var rowId = $(this).attr('id');
   	   			$('#addInfo_' + rowId).hide();
   		   		$('#actionsArrow_' + rowId).hide();
		  	});
		  initialFormLoadProcessing();
	});

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
}

function disableAQTabs(){
	var tabItems = $('ul.ai-tabs li');
	tabItems.each(function() {
		var tab = this;
		var isTabDisabled = $('form[name="actionForm"] input[id="disable_' + this.id + '"]').val();
		if(isTabDisabled == "true"){
			$(tab).addClass("disabledTab").removeClass("visitedTab navTab");
		}else{
			$(tab).removeClass("disabledTab").addClass("visitedTab navTab");
		}
	});
}

function processThirdPartyError(){
	var tpSvcStatus = $('#tpServiceFail').val();
	if(tpSvcStatus !=null && tpSvcStatus != undefined && tpSvcStatus.length>1){
		var marginTop = parseInt($("#grid").css("margin-top"))+25;
		var addMarginOnTop = marginTop+"px";
		document.getElementById("grid").style.marginTop = addMarginOnTop;
		$('#errMsg').addClass('noRecFound').html(tpSvcStatus + "&nbsp;&nbsp;&nbsp;");	
	}
}

function getTabSelected(tabId){ 
	var tabPrefix = tabId.replace("_Tab", "").toUpperCase();
	
	if(tabPrefix == "RAR") {
		alert("RAR functionality not set up");
		return;
	} else {
		var searchIn = getSearchInParm(tabPrefix);
		var searchStr = $.trim($('#globalSearchInput').val());
		var previousKeyword = document.actionForm.previousKeyword.value;
		
		if(previousKeyword == ""){
			tabPrefix = tabPrefix + "_DEFAULT";
		}
		
		$('#searchIn').val(searchIn); // store value in hidden field
		submitGlobalSearch(tabPrefix, searchStr);
	}
}

function clearAdvSearch(){
	var searchIn = $('#searchIn').val();
	var tabAdvSearch = searchIn + "_advSearch";
	var searchStr = $.trim($('#globalSearchInput').val());
	
	clearAdvSearchForTab(tabAdvSearch);
	closeAdvSearch("advSearchForm");
	
	if(searchIn == SearchInEnum.ESIGNATURE){
		submitGlobalSearch(globalSearchType.ESIGNATURE, searchStr);
	}else{
		submitGlobalSearch(globalSearchType.DEFAULT, searchStr);
	}
}

function formatAllQuotesTabs(){
	var searchIn = $('#searchIn').val();
	var tabId = allQuoteTab[searchIn].id;
	var colDisplay = allQuoteTab[searchIn].showCol;
	var colHide = allQuoteTab[searchIn].hideCol;
	
	$("#" + tabId).removeClass("visitedTab").addClass("activeTab");
	$("ul.ai-tabs > li:not(#" + tabId + ")").removeClass("activeTab").addClass("visitedTab");

	$('.' + colDisplay).show();
	$('.' + colHide).hide();
}

function showHideGridColumns(){
	var searchIn = $('#searchIn').val();
	var colDisplay = allQuoteTab[searchIn].showCol;
	var colHide = allQuoteTab[searchIn].hideCol;
	$('.' + colDisplay).show();
	$('.' + colHide).hide();
}

function showAQSvcError(){
	var msg = "Sorry, our database is inaccessible at the moment. Please try later.";
	$('#count').addClass('noRecFound').html(msg);
	
	if($('#hasMultipleProfiles').val() == "true"){
		$('.profileMessage').show(); // show profile message if needed
	}
}

function displayRecordCount(count,total){
	var msg, totalRecords;
	
	if(total == 0) {
		if($('#searchIn').val() == SearchInEnum.ESIGNATURE) {
			msg = "No quotes found matching the search criteria.  Please refine the search and re-submit";
		} else {
			msg = "No results found";
		}
		$('#count').addClass('noRecFound');
	}
	else{
		if(total > 100) {
			totalRecords = formatCountNumber(total);
			msg = showMoreResultsMsg(totalRecords);
		} else {
			(total == 1) ? result =" result found": result=" results found";
			msg = count + result;
		}
		$('#count').removeClass("noRecFound");
	}
	
	$('#count').html(msg);
	$('#advSearch').show();	
	
	if($('#hasMultipleProfiles').val() == "true"){
		$('.profileMessage').show(); // show profile message if needed
	}
}

/* Grid formatters */
function nameFormater(cellValue, options, rowObject)  { 
	var rowId = rowObject.rowNumber;
	var name =  policyNameFormater(cellValue, options, rowObject);
	
	var strHTML = "<div id=\"addInfo_" + rowId + "\" class=\"smallInfoIcon addInfo\"></div>";
	strHTML = strHTML +	"<span class=\"appName\">" + name + "</span>";
	
	return strHTML;
}

function esignStatusFormatter(cellValue)  { 
	if(cellValue.toUpperCase() == "EMAIL SENT"){
		cellValue = ESignatureStatusEnum.SENT;
	}
	
	return cellValue;
}

function transactionTypeFormatter(cellValue, options, rowObject)  { 
	var lob = rowObject.lob;
	var state = rowObject.state;
	var enableCSC = document.actionForm.enableCSC.value;
	
	if(lob == "CAuto" && state == "MA" && enableCSC != "YES"){
		if(cellValue == "Request Approval" || cellValue == "Approved" || cellValue == "Request Issue"){
			return "N/A";
		}else{
			return cellValue;
		}
	}else {
		return cellValue;
	}
}

/* Additional Info */
function hideAddInfo(rowId){
	$('#addInfo_' + rowId).popover('destroy');
}

function checkAddInfoValue(item){
	if(item == "" || item == null || item == 0){
		item = "Unavailable";
	}
	
	return item;
}

function checkTerm(item){
	if(item == "" || item == null || item == 0){
		item = "Unavailable";
	}else{
		item = item + " Months";
	}
	
	return item;
}

function genAddInfo(rowId){
	var allQuoteRecord = new AllQuoteRecord(rowId);
	var isLegacyPolicy = isLegacy(allQuoteRecord.dataSource);
	var ciFlag = allQuoteRecord.ciFlag;
	var srcOfEntry = allQuoteRecord.srcOfEntry;
	var quickQuoteInd = allQuoteRecord.quickQuoteInd;
	var sourceQuote;
	
	if(allQuoteRecord.source == ""){
		if (isCIRecord(ciFlag)) {
			if($('#quickQuoteEnabled').val() == 'Yes'){
				sourceQuote = "eSales";
			}else{
			sourceQuote = "CI Entry";
			}
		}else{
			sourceQuote = "Direct Entry";
		}
		
	}else{
		sourceQuote = allQuoteRecord.source;
	}
	
	//Quick Quote
	if(quickQuoteInd.toUpperCase() == 'YES' && $('#quickQuoteEnabled').val() == 'Yes'){
		sourceQuote = "QQ-Agent";
	}
	//consumer quote
	if('CI' == srcOfEntry){
		sourceQuote = "CI Entry";
	}
	
	//Quick Quote
	if('QQUOTE' == srcOfEntry){
		sourceQuote = "Quick Quote";
	}
	
	var strHTML = "<ul id=\"addInfoList\" class=\"noBullets\">";
	strHTML = strHTML + "<li><span class=\"infoLabel\">Owner:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allQuoteRecord.owner) + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">Source:</span><span class=\"infoValue\">" 
		+ sourceQuote + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">State:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allQuoteRecord.state) + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">Term:</span><span class=\"infoValue\">" 
		+ checkTerm(allQuoteRecord.term) + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">eSignature:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allQuoteRecord.esignature) + "</span></li>";
	if(isLegacyPolicy) {
		strHTML = strHTML + "<li><span class=\"infoLabel\">Legacy Status:</span><span class=\"infoValue\">" 
			+ checkAddInfoValue(allQuoteRecord.policyStatus) + "</span></li>";
	}
	strHTML = strHTML + "</ul>";
	
	// display icon if not visible
	if(!$('#addInfo_' + rowId).is(':visible')){
		$('#addInfo_' + rowId).show();
	}
	
	$('#addInfo_' + rowId).popover({
		html: true,
		content: strHTML,
		placement:'topRight'
	}).popover('show');
}

function quoteNumFormatter(cellValue, options, rowObject)  { 
	var rowId = rowObject.rowNumber;
	var policyNumber = rowObject.policyNumber;
	var status = rowObject.status;
	var action = getEditAction(rowObject);
	var policyKey = rowObject.policyKey;
	var dataSource = rowObject.dataSource;
	var lob = rowObject.lob;
	var channel = rowObject.channel;
	var company = rowObject.company;
	var state = rowObject.state;
	var transactionType = rowObject.alignedTransactionType;
	var uwCompany = rowObject.uwCompany;
	//identify consumer-S ignnored in fetch and POLICY_SOURCE_CD is derivative
	var owner = rowObject.owner;
	var srcOfEntry = rowObject.srcOfEntry;

	var parms = "'" + policyNumber + "','" + policyKey + "','" 
	+ dataSource + "','-1','" + lob + "','" + channel + "','" + encodeURI(status) 
	+ "','" + encodeURI(transactionType) + "','" + company+ "','" + uwCompany+ "','" 
	+ state + "','" + encodeURI(action)  + "','AllQuotes'";
	
	if(transactionType =='Endorse'){
	
		parms = "'" + rowId  + "','" + encodeURI(action) + "'";
		
		var	strHTML = "<a href=\"javascript:submit2InquiryFromEsignature(" + parms + ")\">";
	    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" +policyNumber+ "</span></a>";
	    strHTML = strHTML +	"<span id=\"actionsArrow_" +  rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
		strHTML = strHTML + "<div id=\"actionsList_" +  rowId + "\" class=\"actionsFlyout\"></div>";
		return strHTML;
	}else{
	parms = parms + ",'" + rowObject.owner+ "'";
	parms = parms + ",'" + rowObject.srcOfEntry+ "'";
	
	var strHTML = "<a href=\"javascript:submitActionForm(" + parms + ")\">";
    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" + policyNumber + "</span></a>";
    strHTML = strHTML +	"<span id=\"actionsArrow_" + rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
	strHTML = strHTML + "<div id=\"actionsList_" + rowId + "\" class=\"actionsFlyout\"></div>";
	return strHTML;
} 

} 

function submit2InquiryFromEsignature(rowId, action) {
	var policyRecord = new PolicyRecord(rowId);
	var status = policyRecord.policyStatus;	
	
	var url = getPolicyURL(action);
	if(url != '') {
		console.log(policyRecord)
		showLoadingMsg();
		document.actionForm.userAction.value = action;
		document.actionForm.policyKey.value = policyRecord.policyKey;
		document.actionForm.policyNumber.value = policyRecord.policyNumber;
		//document.actionForm.policyStatus.value = encodeURI(policyRecord.policyStatus);
		document.actionForm.policyStatus.value = 'ENDOESIGN';
		document.actionForm.term.value = policyRecord.term;
		document.actionForm.company.value = policyRecord.company;
		document.actionForm.lob.value = policyRecord.lob;
		document.actionForm.fromDate.value = policyRecord.effectiveDate;
		document.actionForm.toDate.value = policyRecord.expirationDate;
		document.actionForm.action = document.actionForm.InquiryURL.value;
		document.actionForm.requestSource.value = "PolicySearch";
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

/* Policy Record. Row id is the row number from JQGrid*/
function PolicyRecord(rowId) {
	this.row = jQuery('#grid').getRowData(rowId);
	this.policyNumber = this.row.policyNumber; 
	this.policyStatus = this.row.status;
	this.lob = this.row.lob;
	this.policyKey = this.row.policyKey;
	this.rowId = rowId;
	this.term = this.row.term;
	this.company = this.row.company;
	this.effectiveDate = this.row.effectiveDate;
	this.expirationDate = this.row.expirationDate;
	this.dataSource = this.row.dataSource;
}

/* Actions */
function genActionsListAQ(rowId){
	$('#actionsList_' + rowId).html(genActionsListByRowId(rowId));
	
	// display arrow icon if not visible
	if(!$('#actionsArrow_' + rowId).is(':visible')) {
		$('#actionsArrow_' + rowId).show();
	}
	
	$('#actionsArrow_' + rowId).popover({
		html: true,
		content: $('#actionsList_' + rowId).html(),
		placement: function(tip, element) {
			// could change position based on where popover appears on screen
			var $element, above, actualHeight, actualWidth, below, boundBottom, boundTop, elementAbove, elementBelow, isWithinBounds, left, pos, right;
		    
		    isWithinBounds = function(elementPosition) {
		      return boundTop < elementPosition.top && boundBottom > (elementPosition.top + actualHeight);
		    };
		   
		    $element = $(element);
		    pos = $.extend({}, $element.offset(), {
		      width: element.offsetWidth,
		      height: element.offsetHeight
		    });
		    
		    actualWidth = 100;
		    actualHeight = 125;
		    boundTop = $(document).scrollTop();
		    boundBottom = boundTop + $(window).height();
		   
		    elementAbove = {
		      top: pos.top - actualHeight,
		      left: pos.left + pos.width / 2 - actualWidth / 2
		    };
		    elementBelow = {
		      top: pos.top + pos.height,
		      left: pos.left + pos.width / 2 - actualWidth / 2
		    };
		  
		    above = isWithinBounds(elementAbove);
		    below = isWithinBounds(elementBelow);
		    
		    if (below) {
		      return "inside bottom";
		    } else {
		      if (top) {
		        return "inside top";
		      }
		    }
		  }
		}).popover('show');
}

function genActionsListByRowId(rowId) {
	var allQuoteRecord = new AllQuoteRecord(rowId);
	return genActionsListByRecord(allQuoteRecord);
}

function genActionsListByRecord(allQuoteRecord) {
	var tabSelected = $('#searchIn').val();
	var strHTML = "";
	var actionsList = [];

	if(tabSelected == SearchInEnum.ESIGNATURE) {
		actionsList = getESignatureActions(allQuoteRecord);
	} else if(tabSelected == SearchInEnum.QUOTE) {
		actionsList = getAllQuoteActions(allQuoteRecord);
	}
	
	var parms = "'" + allQuoteRecord.policyNumber + "','" + allQuoteRecord.policyKey + "','" 
		+ allQuoteRecord.dataSource + "','" + allQuoteRecord.rowId + "','" 
		+ allQuoteRecord.lob + "','" + allQuoteRecord.channel + "','" 
		+ encodeURI(allQuoteRecord.policyStatus)  + "','" + encodeURI(allQuoteRecord.transactionType) + "','" 
		+ allQuoteRecord.company + "','" + allQuoteRecord.uwCompany + "','" 
		+ allQuoteRecord.state + "'";
	
	if (actionsList.length > 0) {
		strHTML = "<ul class=\"actionList\">";
		
		$.each(actionsList, function(id, action) {
			// check if action is reject, if so change URL
			methodParams = parms + ",'" + encodeURI(action) + "'";
			switch (action) {
				case ActionEnum.REJECT:
					strURL = "javascript:rejectPolicy("+methodParams+");";
					break;
				case ActionEnum.STOP_ESIG:
					methodParams = methodParams + ",'" + allQuoteRecord.transactionId  + "'";
					methodParams = methodParams + ",'" + allQuoteRecord.branchId  + "'";
					methodParams = methodParams + ",'" + allQuoteRecord.agencyId  + "'";
					methodParams = methodParams + ",'" + allQuoteRecord.producedId  + "'";
					strURL = "javascript:openStopEsignModal("+methodParams+");";
					break;
				case ActionEnum.RE_SEND_ESIG:
					if(allQuoteRecord.transactionType=='Endorsement'){
					strURL = "javascript:openResendEsignModal("+methodParams+");";
					}else{
						//adding for consumer
						methodParams = methodParams + ",'" + 'AllQuotes'+ "'";
						methodParams = methodParams + ",'" + allQuoteRecord.owner+ "'";
						methodParams = methodParams + ",'" + allQuoteRecord.srcOfEntry+ "'";
						strURL = "javascript:submitActionForm("+methodParams+");";
					}
					break;
				case ActionEnum.DELETE:
					strURL = "javascript:confirmDeleteCAutoPolicy("+methodParams+");";
					break;
				default:
					methodParams = methodParams + ",'" + 'AllQuotes'+ "'";
					methodParams = methodParams + ",'" + allQuoteRecord.owner+ "'";
					methodParams = methodParams + ",'" + allQuoteRecord.srcOfEntry+ "'";
					strURL = "javascript:submitActionForm("+methodParams+");";
			}
			
			strHTML = strHTML + "<li class=\"menuItem\"><a href=\"" + strURL + "\">" + action + "</a></li>";
		});
		
		strHTML = strHTML + "</ul>";
	}
	
	return strHTML;
}

/* Comm Auto delete functions */
function confirmDeleteCAutoPolicy(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, action){
	$('#btnDeleteCAutoQuote').click(function(){		
		$("#deleteCAutoModal").modal('hide');
		deleteCAutoPolicy(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, action);
	});
	
	$("#deleteCAutoModal").modal('show');
}

function deleteCAutoPolicy(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, action){
	var strURL = addRequestParam(document.actionForm.deleteCAutoPolicysURL.value, "policyKey", policyKey);
	strURL = addRequestParam(strURL, "dataSource", dataSource);
	
	$.ajax({
		url: strURL,
		type:'POST',
		
		success: function(data){
           // quote is deleted - need to reload grid to clear quote
		   submitGlobalSearch(globalSearchType.DEFAULT, $.trim($('#globalSearchInput').val()));
		},
		
		error: function(data){
			alert("Failed to delete the Quote:" + policyNumber);  
		},
		
		complete: function(){
		}
	});
}

function rejectPolicy(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, action){
	var strURL = addRequestParam(document.actionForm.rejectURL.value, "policyKey", policyKey);
	strURL = addRequestParam(strURL, "dataSource", dataSource);
	strURL = addRequestParam(strURL, "policyStatus", encodeURI(policyStatus));
	strURL = addRequestParam(strURL, "policyNumber", policyNumber);
	
	$.ajax({
		url: strURL,
		type:'POST',
		
		success: function(data){
			// change status without reloading grid
			$('#actionsList_' + rowId).closest('tr').find('td').eq(4).text(TransactionStatusEnum.REJECT); 
			$('#grid').jqGrid('setCell', rowId, 'status', TransactionStatusEnum.REJECT);
			
			// hide icons and clear popovers
			resetGridRow(rowId);
		},
		
		error: function(data){
			//alert("Failed to Reject the Quote:" + policyNumber);  
		},
		
		complete: function(){
		}
	});
}

function stopEsignature(){
	var rowId = $('#frmStopEsign input[id="rowId"]').val();
	var firstName = $('#frmStopEsign input[id="first_name"]').val();
	var middleName = $('#frmStopEsign input[id="middle_initial"]').val();
	var lastName = $('#frmStopEsign input[id="last_name"]').val();
	var strURL = addRequestParam(document.actionForm.stopESignURL.value, "firstName", firstName);
	strURL = addRequestParam(strURL, "lastName", lastName);
	strURL = addRequestParam(strURL, "middleName", middleName);
	strURL = addRequestParam(strURL, "uwCompanyCd", "");
	$.ajax({
		url: strURL,
		type:'POST',
	
	   beforeSend: function(status, xhr){
	    	clearStopEsignModal();
	    	showLoadingMsg();
	    },
	
		success: function(data){
			// change status without reloading grid
			$('#actionsList_' + rowId).closest('tr').find('td').eq(8).text(ESignatureStatusEnum.AGENTSTOPPED); 
			$('#grid').jqGrid('setCell', rowId, 'esignatureStatus', ESignatureStatusEnum.AGENTSTOPPED);
			var x = new Date();
			$('#grid').jqGrid('setCell', rowId, 'esignatureDate', Number(x));
			
			// hide icons and clear popovers
			resetGridRow(rowId);
		},
	
		error: function(data){
			alert("Failed to update Esignature Status");  
		},
		
		complete: function(){
			$.unblockUI();
		}

	});
}


function resendEsignature(){
	var rowId = $('#frmResendEsign input[id="rowId"]').val();
	var email = $('#frmResendEsign input[id="email"]').val();
	var transId = $('#frmResendEsign input[id="transId"]').val();
	var state = $('#frmResendEsign input[id="state"]').val();
	var company = $('#frmResendEsign input[id="company"]').val();
	var uwcompany = $('#frmResendEsign input[id="uwcompany"]').val();
	var lob = $('#frmResendEsign input[id="lob"]').val();
	
	
	var strURL = addRequestParam(document.actionForm.resendESignURL.value, "email", email);
	strURL = addRequestParam(strURL, "transId",transId);
	strURL = addRequestParam(strURL, "state",state);
	strURL = addRequestParam(strURL, "company",company);
	strURL = addRequestParam(strURL, "uwcompany",uwcompany);
	strURL = addRequestParam(strURL, "lob",lob);
	
	$.ajax({
		url: strURL,
		type:'POST',
	
	   beforeSend: function(status, xhr){
		   clearResendEsignModal();
	    	showLoadingMsg();
	    },
	
		success: function(data){
			// change status without reloading grid
			$('#actionsList_' + rowId).closest('tr').find('td').eq(8).text(ESignatureStatusEnum.SENT); 
			$('#grid').jqGrid('setCell', rowId, 'esignatureStatus', ESignatureStatusEnum.SENT);
			var x = new Date();
			$('#grid').jqGrid('setCell', rowId, 'esignatureDate', Number(x));
			
			// hide icons and clear popovers
			resetGridRow(rowId);
		},
	
		error: function(data){
			alert("Resend Esignature Status");  
		},
		
		complete: function(){
			$.unblockUI();
		}

	});
}

function openResendEsignModal(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, action){
	var allQuoteRecord = new AllQuoteRecord(rowId);
	var state = allQuoteRecord.state;
	var lob = allQuoteRecord.lob;
	var company = allQuoteRecord.company;	
	var uwcompany = allQuoteRecord.uwCompany;
	var strURL = addRequestParam(document.actionForm.resendESignURL.value, "policyKey", allQuoteRecord.policyKey);
	strURL = addRequestParam(strURL, "dataSource", allQuoteRecord.dataSource);
	
	// store url in hidden field
	document.actionForm.resendESignURL.value = strURL;
	// store row id in hidden field
	$('#frmResendEsign input[id="rowId"]').val(rowId);
	
	$('#frmResendEsign input[id="transId"]').val(allQuoteRecord.transactionId);
	
	$('#frmResendEsign input[id="state"]').val(state);
	$('#frmResendEsign input[id="company"]').val(company);
	$('#frmResendEsign input[id="uwcompany"]').val(uwcompany);
	$('#frmResendEsign input[id="lob"]').val(lob);
	
		
	// reset form and clear previous inline errors if needed
	resetForm(frmResendEsign);
	$('tr.errorRow').addClass("hidden");
	$('#frmResendEsign :input').each(function() {
		var strElementID = this.id;
		$("td#" + strElementID + "_error").html("");
		$("td#" + strElementID + "_error").removeClass('inlineErrorMsg');
		$("tr#" + strElementID + "_Error").remove();
		$('#' + strElementID).removeClass('inlineError'); 
	});
	$('#frmResendEsign input[id="email"]').val(allQuoteRecord.emailId);
	// show esign modal window
	$("#resendEsign").modal("show");
}


function openStopEsignModal(policyNumber, policyKey, dataSource, rowId, lob, channel, policyStatus, transactionType, company, uw_copmany, state, action, transactionId,branchId,
		agencyId,
		producedId){
	var allQuoteRecord = new AllQuoteRecord(rowId);
	var state = allQuoteRecord.state;
	var lob = allQuoteRecord.lob;
	var company = allQuoteRecord.company;
	var strURL = addRequestParam(document.actionForm.stopESignParamURL.value, "policyKey", policyKey);
	strURL = addRequestParam(strURL, "dataSource", dataSource);
	strURL = addRequestParam(strURL, "company", company);
	strURL = addRequestParam(strURL, "state", state);
	strURL = addRequestParam(strURL, "channel", channel);
	strURL = addRequestParam(strURL, "lob", lob);
	strURL = addRequestParam(strURL, "policyNumber", policyNumber);
	strURL = addRequestParam(strURL, "transactionId", transactionId);
	strURL = addRequestParam(strURL, "branchId", branchId);
	strURL = addRequestParam(strURL, "agencyId", agencyId);
	strURL = addRequestParam(strURL, "producedId", producedId);
	
	// store url in hidden field
	document.actionForm.stopESignURL.value = "";
	document.actionForm.stopESignURL.value = strURL;
	
	// store row id in hidden field
	$('#frmStopEsign input[id="rowId"]').val(rowId);
	
	// reset form and clear previous inline errors if needed
	resetForm(frmStopEsign);
	$('tr.errorRow').addClass("hidden");
	$('#frmStopEsign :input').each(function() {
		var strElementID = this.id;
		$("td#" + strElementID + "_error").html("");
		$("td#" + strElementID + "_error").removeClass('inlineErrorMsg');
		$("tr#" + strElementID + "_Error").remove();
		$('#' + strElementID).removeClass('inlineError'); 
	});
	
	// show esign modal window
	$("#stopEsign").modal("show");
}

function clearStopEsignModal(){
	$('#stopEsign').modal('hide');
	resetForm(frmStopEsign);
}

function clearResendEsignModal(){
	$('#resendEsign').modal('hide');
	resetForm(frmResendEsign);
}

function resetGridRow(rowId){
	hideAddInfo(rowId);
	clearActionsList(rowId);
	$('#addInfo_' + rowId).hide();
	$('#actionsArrow_' + rowId).hide();
}

function getAllQuoteActions(allQuoteRecord) {
	var actionsList = [];
	var status = allQuoteRecord.policyStatus;
	var transactionType = allQuoteRecord.transactionType;
	var alignedTransactionStatus = allQuoteRecord.alignedTransactionStatus;
	var ciFlag = allQuoteRecord.ciFlag;
	var dataSource = allQuoteRecord.dataSource;
	var lob = allQuoteRecord.lob;  
	var premium = allQuoteRecord.premium; 
	var isRatedFlag = false;
	var state = allQuoteRecord.state;
	//adding for consumer
	var owner = allQuoteRecord.owner;
	var srcOfEntry = allQuoteRecord.srcOfEntry;
	var uwCompany = allQuoteRecord.uwCompany;
	var quickQuoteInd = allQuoteRecord.quickQuoteInd;
	
	if(premium != "" && premium != "$0" && premium != "null"){
		isRatedFlag = true;
	}

	if (isCIRecord(ciFlag)) {
		if(srcOfEntry == 'CI'){
			if(TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase() 
					|| TransactionStatusEnum.IN_PROGRESS.toUpperCase() == status.toUpperCase()) {
					actionsList = [ActionEnum.EDIT, ActionEnum.READ_ONLY];
			}else {
				actionsList = [ActionEnum.READ_ONLY];
			}
		}else if(quickQuoteInd.toUpperCase() == 'YES'){
			actionsList = [ActionEnum.VIEW_CLAIMS_ACCIDENTS, ActionEnum.VIEW_VIOLATIONS];
			//Quick Quote - 'Copy in Agent Web'
			if($('#hasQuickQuoteAccess').val() == 'true' && $('#quickQuoteEnabled').val() == 'Yes'){
				//actionsList.push(ActionEnum.COPY_QQ)
				actionsList = []
				actionsList = [ActionEnum.VIEW_CLAIMS_ACCIDENTS, ActionEnum.VIEW_VIOLATIONS, ActionEnum.COPY_QQ];
			}
		}
		else{
			if(alignedTransactionStatus.toUpperCase() == TransactionStatusEnum.ISSUED.toUpperCase()) {
				actionsList = [ActionEnum.VIEW_CLAIMS_ACCIDENTS, ActionEnum.VIEW_VIOLATIONS];
			} else {
				actionsList = [ActionEnum.CI_QUOTE, ActionEnum.VIEW_CLAIMS_ACCIDENTS, ActionEnum.VIEW_VIOLATIONS];
				//Quick Quote - 'Copy in Agent Web'
				if( uwCompany.toUpperCase() == 'ALN_PIC' && $('#quickQuoteEnabled').val() == 'Yes'
					&& $('#hasQuickQuoteAccess').val() == 'true'){
					actionsList.push(ActionEnum.COPY_QQ)
			} 
		}
		}
	} else if (isLegacyPalHomeRecord(dataSource, lob)) {
		// legacy home record
		if(status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_UW.toUpperCase() 
				|| status.toUpperCase() == LegacyTransactionStatusEnum.WITHDRAWN.toUpperCase() 
				|| status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_INSURED.toUpperCase()) {
					actionsList = [ActionEnum.READ_ONLY];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.APPLICATION.toUpperCase() 
				|| status.toUpperCase() == LegacyTransactionStatusEnum.FULL_QUOTE.toUpperCase()
				|| status.toUpperCase() == LegacyTransactionStatusEnum.APPLICATION_WITH_REPORTS.toUpperCase()) {
					actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.QUICK_QUOTE.toUpperCase() 
				|| status.toUpperCase() == LegacyTransactionStatusEnum.QUOTE.toUpperCase()) {
					actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT];
		} else if (status.toUpperCase() == LegacyTransactionStatusEnum.CONVERTED_QUOTE.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.COPY_EDIT];
		} else if (status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_EXCEPTION.toUpperCase()){
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE2.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.COVERAGE_SUMMARY, ActionEnum.DOCUMENTS];
		}
	} else if (isLegacyPPARecord(dataSource) || isLegacyNEHomeRecord(dataSource, lob)) {
		if(status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_UW.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.WITHDRAWN.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_INSURED.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.APPLICATION.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.FULL_QUOTE.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.APPLICATION_WITH_REPORTS.toUpperCase()) {
				actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.QUICK_QUOTE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.QUOTE.toUpperCase()) {
				actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT, ActionEnum.CONVERT_TO_APPLICATION];
		} else if (status.toUpperCase() == LegacyTransactionStatusEnum.CONVERTED_QUOTE.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.COPY_EDIT];
		} else if (status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_EXCEPTION.toUpperCase()){
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY];
		} else if(status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE2.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY, ActionEnum.DOCUMENTS];
		}
	} else if (isLegacyCAutoRecord(dataSource)) {
		var requestInfo = document.actionForm.showCAutoRequestInfo.value;
		var reviewQuote = document.actionForm.showCAutoReviewQuote.value;
		var blnShowCSCChanges = false;
		if(state.toUpperCase() == "MA" && document.actionForm.enableCSC.value == "YES"){
			blnShowCSCChanges = true;
		}
		
		if(status.toUpperCase() == LegacyTransactionStatusEnum.SAVEDFULL.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.SAVEDQUICK.toUpperCase()){
				if(isEmployee()){
					if(isRatedFlag){
						actionsList = [ActionEnum.EDIT, ActionEnum.DELETE, ActionEnum.COPY_EDIT, ActionEnum.DOCUMENTS];
					}else{
						actionsList = [ActionEnum.EDIT, ActionEnum.DELETE, ActionEnum.COPY_EDIT];
					}
				}else{
					if(isRatedFlag){
						actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT, ActionEnum.DOCUMENTS];
					}else{
						actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT];
					}
				}
		}else if(status.toUpperCase() == LegacyTransactionStatusEnum.APPROVED.toUpperCase() && blnShowCSCChanges){
			if(isRatedFlag){
				actionsList = [ActionEnum.REQUEST_ISSUE, ActionEnum.DELETE, ActionEnum.DOCUMENTS];
			}else{
				actionsList = [ActionEnum.REQUEST_ISSUE, ActionEnum.DELETE];
			}
		}else if(status.toUpperCase() == LegacyTransactionStatusEnum.REQ_ISSUE.toUpperCase() && blnShowCSCChanges){
				if(isEmployee()){
				actionsList = [ActionEnum.ISSUE_POLICY, ActionEnum.DELETE];
				}else{
					actionsList = [ActionEnum.DELETE];
				}
		}else if(status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_UW.toUpperCase() 
				|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED.toUpperCase() && !blnShowCSCChanges
				|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER.toUpperCase() && !blnShowCSCChanges 
			    || status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE2.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.REQ_APPROVAL.toUpperCase()
			    || status.toUpperCase() == LegacyTransactionStatusEnum.APPROVED.toUpperCase() && !blnShowCSCChanges
			    || status.toUpperCase() == LegacyTransactionStatusEnum.REQ_ISSUE.toUpperCase() && !blnShowCSCChanges){
					
			if(isEmployee()){
						if(requestInfo.toUpperCase() == "TRUE"){
							if(reviewQuote.toUpperCase() == "TRUE"){
								actionsList = [ActionEnum.REQUEST_ADDITIONAL_INFO, ActionEnum.REVIEW, ActionEnum.DELETE, ActionEnum.DOCUMENTS];
							}else{
								actionsList = [ActionEnum.REQUEST_ADDITIONAL_INFO, ActionEnum.DELETE, ActionEnum.DOCUMENTS];
							}
						}else{
							if(reviewQuote.toUpperCase() == "TRUE"){
								actionsList = [ActionEnum.REVIEW, ActionEnum.DELETE, ActionEnum.DOCUMENTS];
							}else{
								actionsList = [ActionEnum.DELETE, ActionEnum.DOCUMENTS];
							}
						}
					}else{
						if(requestInfo.toUpperCase() == "TRUE"){
							if(reviewQuote.toUpperCase() == "TRUE"){
								actionsList = [ActionEnum.REQUEST_ADDITIONAL_INFO, ActionEnum.REVIEW, ActionEnum.DOCUMENTS];
							}else{
								actionsList = [ActionEnum.REQUEST_ADDITIONAL_INFO, ActionEnum.DOCUMENTS];
							}
						}else{
							if(reviewQuote.toUpperCase() == "TRUE"){
								actionsList = [ActionEnum.REVIEW, ActionEnum.DOCUMENTS];
							}else{
								actionsList = [ActionEnum.DOCUMENTS];
							}
						}
					}
		}else if(status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE2.toUpperCase() 
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY.toUpperCase()
			|| status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.DOCUMENTS];
		}
	} else if(dataSource == DataSourceEnum.UMBRELLA && lob.toUpperCase()=="PCAT") {
		if(TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase()) {
			actionsList = [ActionEnum.EDIT];
		} else {
			actionsList = [ActionEnum.READ_ONLY];
		}
	} else if(dataSource == DataSourceEnum.NEW_BUSINESS && lob.toUpperCase()=="HO") {
		if(TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase() 
				|| TransactionStatusEnum.IN_PROGRESS.toUpperCase() == status.toUpperCase()) {
			actionsList = [ActionEnum.EDIT, ActionEnum.READ_ONLY];
		} else if(TransactionStatusEnum.ISSUED.toUpperCase() == status.toUpperCase()) {
			actionsList = [ActionEnum.READ_ONLY, ActionEnum.FORMS];	
		} else {
			actionsList = [ActionEnum.READ_ONLY];
		}
	} else { // AI new product (AI2) - PPA
		if(TransactionTypeEnum.PENDING_ISSUANCE.toUpperCase() == transactionType.toUpperCase()){
			actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY, ActionEnum.FORMS];
		}else if(TransactionTypeEnum.POLICY.toUpperCase() == transactionType.toUpperCase() && TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase()){
			actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY, ActionEnum.FORMS];
		} else if(TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase() 
				|| TransactionStatusEnum.IN_PROGRESS.toUpperCase() == status.toUpperCase()) {
			actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT, ActionEnum.REJECT, ActionEnum.READ_ONLY];
		} else if(TransactionStatusEnum.DECLINE.toUpperCase() == status.toUpperCase()) {
					actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT, ActionEnum.READ_ONLY];
		} else if(TransactionStatusEnum.REJECT.toUpperCase() == status.toUpperCase()
			|| TransactionStatusEnum.PENDING_ISSUANCE.toUpperCase() == status.toUpperCase()) {
				actionsList = [ActionEnum.EDIT, ActionEnum.COPY_EDIT, ActionEnum.READ_ONLY];
		} else if(TransactionStatusEnum.ISSUED.toUpperCase() == status.toUpperCase() 
			|| TransactionStatusEnum.IN_REVIEW.toUpperCase() == status.toUpperCase()) {
				actionsList = [ActionEnum.READ_ONLY, ActionEnum.SUMMARY, ActionEnum.FORMS];
		} 
	}
	
	return actionsList; // return if the status is not from legacy applications
}

/* ESignature Actions */
function getESignatureActions(allQuoteRecord) {
	
	var actionsList = [ActionEnum.RE_SEND_ESIG, 
		               ActionEnum.FORMS, 
		               ActionEnum.READ_ONLY, 
		               ActionEnum.SUMMARY];
	
	if(allQuoteRecord.alignedTransactionType.toUpperCase()=="ENDORSEMENT"){
		if( ESignatureStatusEnum.SENT.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
				|| ESignatureStatusEnum.PENDING.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()){
	
			 actionsList = [ActionEnum.RE_SEND_ESIG, 
			                   ActionEnum.STOP_ESIG];
			return actionsList;
		}else if(ESignatureStatusEnum.EXPIRED.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
				|| ESignatureStatusEnum.FAILED.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
				|| ESignatureStatusEnum.AGENTSTOPPED.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()){
	
			 actionsList = [ActionEnum.RE_SEND_ESIG];
			return actionsList;
		}else if( ESignatureStatusEnum.RECEIVED.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()){
			 actionsList = [];
			return actionsList;
		}
		
	}
	
	if(ESignatureStatusEnum.EMAIL_SENT.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase() 
			|| ESignatureStatusEnum.SENT.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
			|| ESignatureStatusEnum.PENDING.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
			|| ESignatureStatusEnum.REVIEW.toUpperCase() == allQuoteRecord.eSignatureStatus.toUpperCase()
			) {
		
		
		actionsList = [ActionEnum.RE_SEND_ESIG, 
		               ActionEnum.STOP_ESIG,  
		               ActionEnum.FORMS, 
		               ActionEnum.READ_ONLY, 
		               ActionEnum.SUMMARY];
	} 
	
	return actionsList;
}

function getEditAction(rowObject){
	var status = rowObject.status;
	this.ciFlag = rowObject.ciFlag;
	this.alignedTransactionType = rowObject.alignedTransactionType;
	this.alignedTransactionStatus = rowObject.alignedTransactionStatus;
	var dataSource = rowObject.dataSource;
	var lob = rowObject.lob;
	var srcOfEntry = rowObject.srcOfEntry;
	//75387
	var quickQuoteInd = rowObject.quickQuoteInd;
	
	var action;
	if (isCIRecord(ciFlag)) {
		if(srcOfEntry == 'CI'){
			if(TransactionStatusEnum.IN_PROCESS.toUpperCase() == status.toUpperCase() 
					|| TransactionStatusEnum.IN_PROGRESS.toUpperCase() == status.toUpperCase()
					|| TransactionStatusEnum.SOFT_DECLINE.toUpperCase() == status.toUpperCase()) {
				action = ActionEnum.EDIT;
			}else {
				action = ActionEnum.READ_ONLY;
			}
		} else {//For Quick Quote Deliverable1 - The Default Action is VIEW_CLAIMS_ACCIDENTS 
			if((alignedTransactionStatus == TransactionStatusEnum.ISSUED) || ('QQUOTE' == srcOfEntry.toUpperCase())) {
				action = ActionEnum.VIEW_CLAIMS_ACCIDENTS;
			} else {
					if(quickQuoteInd ==='Yes'){ action = ActionEnum.COPY_QQ; }
						else{ action = ActionEnum.CI_QUOTE; }
			}
		}
	}else if (isLegacyCAutoRecord(dataSource)) {
		action = ActionEnum.SUMMARY;
	}
	else if (status.toUpperCase() == "SENT") {
			action = ActionEnum.SUMMARY;
	}else if(status.toUpperCase() == TransactionStatusEnum.ISSUED.toUpperCase() 
	  ||(alignedTransactionType.toUpperCase() == TransactionTypeEnum.POLICY.toUpperCase() && status.toUpperCase() == TransactionStatusEnum.IN_PROCESS.toUpperCase())		
	  || alignedTransactionType.toUpperCase() == TransactionTypeEnum.PENDING_ISSUANCE.toUpperCase() 	
	  || status.toUpperCase() == TransactionStatusEnum.IN_REVIEW.toUpperCase()
	  || status.toUpperCase() == TransactionStatusEnum.PENDING_ISSUANCE.toUpperCase() 
	  || status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_UW
	  || status.toUpperCase() == LegacyTransactionStatusEnum.WITHDRAWN
	  || status.toUpperCase() == LegacyTransactionStatusEnum.REJECTED_BY_INSURED
	  || status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW.toUpperCase() 
	  || status.toUpperCase() == LegacyTransactionStatusEnum.REVIEW_INCOMPLETE.toUpperCase()
	  || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_REFER.toUpperCase()
	  || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_WITH_EXCEPTION.toUpperCase()
	  || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_INCOMPLETE.toUpperCase()
	  || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_IN_DIFFERENT_COMPANY.toUpperCase()
	  || status.toUpperCase() == LegacyTransactionStatusEnum.ISSUED_PENDING.toUpperCase()) {
		if(isLegacyPalHomeRecord(dataSource, lob)){
			action = ActionEnum.COVERAGE_SUMMARY;
		}else if(isLegacyCAutoRecord(dataSource)){
			action = ActionEnum.REVIEW;
		}else{
			action = ActionEnum.SUMMARY;
		}
	} else {
		action = ActionEnum.EDIT;
	}
	return action;
}

/* AllQuoteRecord. Rowid is the row number from JQGrid*/
function AllQuoteRecord(rowId) {
	this.row = jQuery('#grid').getRowData(rowId);
	this.policyNumber = this.row.policyNumber; 
	this.policyStatus = this.row.status;
	this.transactionType = this.row.alignedTransactionType; 
	this.lob = this.row.lob;
	this.channel = this.row.channel;
	this.policyKey = this.row.policyKey;
	this.eSignatureStatus = this.row.esignatureStatus;
	this.dataSource = this.row.dataSource;
	this.rowId = rowId;
	this.ciFlag = this.row.ciFlag;
	this.state = this.row.state;
	this.nickNamew = this.row.nickName;
	this.owner = this.row.owner;
	this.source = this.row.source;
	this.state = this.row.state;
	this.term = this.row.term;
	this.esignature = this.row.esignature;
	this.company = this.row.company;
	this.uwCompany = this.row.uwCompany;
	this.premium = this.row.premium;
	this.alignedTransactionType = this.row.alignedTransactionType;
	this.alignedTransactionStatus = this.row.alignedTransactionStatus;
	this.transactionId = this.row.transactionId;
	this.branchId = this.row.branchId;
	this.agencyId = this.row.agencyId;
	this.emailId=this.row.emailId;
	this.producedId = this.row.producedId;
	this.srcOfEntry = this.row.srcOfEntry;
	this.quickQuoteInd = this.row.quickQuoteInd;
}


function isCIRecord(ciFlag) {
	return (ciFlag == 'Y');
}

function isLegacyPPARecord(dataSource) {
	if( dataSource == DataSourceEnum.LEGACY_PPA_NE || dataSource == DataSourceEnum.LEGACY_PPA_NJ) {
		return true;
	} else {
		return false;
	}
}

function isLegacyCAutoRecord(dataSource) {
	if(dataSource == DataSourceEnum.LEGACY_CAUTO_NE 
	  || dataSource == DataSourceEnum.LEGACY_CAUTO_NJ) {
		return true;
	} else {
		return false;
	}
}

/* Advanced Search functionality specific to All Quotes */
function setActivityDateRange(activityRange){
	var fDt;
	var now = new Date();
	
	if(activityRange != "Custom") {
		switch (activityRange){
			case "7D":
				fDt = date_by_subtracting_days(now,7);
				break;
			case "60D":
				fDt = date_by_subtracting_days(now,60);
				break;
			case "4M":
				fDt = date_by_subtracting_months(now,4);
				break;
			case "12M":
				fDt = date_by_subtracting_months(now,12);
				break;
			case "15M":
				fDt = date_by_subtracting_months(now,15);
				break;
		}
		
		$('#advSearchForm input[id="fdate"]').val(convertDateFormatMMDDYYY(fDt));
		$('#advSearchForm input[id="tdate"]').val(convertDateFormatMMDDYYY(now));
	}
}

function convertDateFormatMMDDYYY(dt){
	var month = dt.getMonth() + 1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	
	if(month <= 9){
		month = "0" + month;
	}
	
	if(day <= 9){
		day = "0" + day;
	}
	
	return month.toString() + day.toString() + year.toString();
}

function submitAdvancedSearch(){
	var charIndxPos;
	var op = "";
	var currentPage = 1;
	var rows = 100;
	var search = "true";
	var searchIn = $('#searchIn').val();
	$('#myQuotesSearch').val('N');
	
	var urlStr = document.actionForm.searchResultsURL.value +"_search="+search;
	urlStr = urlStr + "&page="+currentPage+"&rows="+rows+"&searchIn="+searchIn;
	
	if(!validateAQAdvSearch()){
		return;
	} else {
		var advSearchKey = searchIn + "_advSearch";		
		var dataStorage = {};
		dataStorage = [];
		
		// set activity date range
		var activityRange = $('#activitySearchRange').val();
		setActivityDateRange(activityRange);
		
		// build querystring
		$('#advSearchForm :input').each(function() {
			if(this.id.indexOf("ddcl") == -1){
				var id = this.id;
				var val = $(this).val();
				if(val == null){
					val = "";
				}
		
				// build advanced search results for storage
				if($(this).hasClass("locStorage")){
					var objLS = {};
					objLS.id = id;
					objLS.value = val;
					dataStorage.push(objLS);
				}
				
				// build querystring to send adv search results to controller
				if(!$(this).hasClass('noSubmit')){
					
					// strip out / in date
					if($(this).hasClass("clsDate")){
						val = val.replaceAll("/", "");
					}
				
					// get correct id for eff date range
					if(id == "effDateFrom_Quote" || id == "effDateTo_Quote"){
						var newId = id.split("_");
						id = newId[0];
					}
					
					// get correct id for channel
					if(id == "channel_QuoteSearch"){
						var newId2 = id.split("_");
						id = newId2[0];
					}
					
					// check for wildcard and set operator
					if($(this).attr("type") == "text"){
						charIndxPos = val.indexOf("*");
						if(charIndxPos != -1){
							op = "LIKE";
						}
					}
					if(''!= id){
						urlStr = urlStr + "&" + id + "=" + encodeURI(val);
					}
					
				}
			}
		}); 
		
		// add operator to querystring
		urlStr = urlStr + "&op=" + op;
		
		// store advanced search results for selected tab in storage
		if(browserAcceptLocalStorage()) {
			sessionStorage.setItem(advSearchKey, JSON.stringify(dataStorage));
		}
	
		// load grid
		gridReload(urlStr, rows, searchIn, true);
	}
}

function openAdvSearch(){
	var searchStr = $('#globalSearchInput').val();
	var searchIn = $('#searchIn').val();
	var tabAdvSearch = searchIn + "_advSearch";
	var advSearchHeader = allQuoteTab[searchIn].advSearchHeader;
	var calendarImage = imagePath + "cal_icon.png";
	var lob = $('#lob');
	var state = $('#state');
	var channel = $('#advSearchForm input[id="channel_QuoteSearch"]');
	var channelVal;
	
	clearAQModalErrors('advSearchForm');
	//$('select[multiple].advSearchInput').dropdownchecklist('destroy');
	
	$('select[multiple].advSearchInput').each(function(){
			var selectBoxId = $(this).attr("id");
			if($('#'+selectBoxId).data("ui-dropdownchecklist")){
				$('#'+selectBoxId).dropdownchecklist('destroy');
			}
	});
	
	if(hasPerformedAdvSearchForTab(tabAdvSearch)){
		populateAdvSearchFromStorage(tabAdvSearch);
	}else{
		// set defaults
		$('#customDateRange').addClass("hidden");
		$('#system').val("NEW|LEGACY").trigger('chosen:updated');
		
		if(document.actionForm.hasCurrentProfile.value == "true"){
			channelVal = $(channel).val();
			$('#activitySearchRange').val("15M").trigger('chosen:updated');
			$('#channel_QuoteSearch_Dummy').val(channelVal);
		}else{
			channelVal = "All";
			$('#activitySearchRange').val("4M").trigger('chosen:updated');
		}
		
		//TD #67582 Fix for channel drop down for direct & captive agencies
		$(channel).val(channelVal.toUpperCase());
	
		if($('#lob_Dummy')){
			$('#lob_Dummy').val($(lob).val());
		}
		
		if($('#state_Dummy')){
			$('#state_Dummy').val($(state).val());
		}

		// populate with value entered in global search
		populateFromGlobalSearch(searchStr);
	}
	
	// show/hide fields based on tab selected
	if(searchIn == SearchInEnum.ESIGNATURE){
		$('.eSignAdvSearch').show();
		$('.allQuotesAdvSearch').hide();
	} else {
		$('.eSignAdvSearch').hide();
		$('.allQuotesAdvSearch').show();
	}
    
	//Activity Search Range dropdown
	$('#activitySearchRange').change(function(){
		if(this.value == "Custom"){
			$('#customDateRange').removeClass('hidden');
		} else {
			$('#customDateRange').addClass('hidden');
			$('#advSearchForm input[id="fdate"]').val("");
			$('#advSearchForm input[id="tdate"]').val("");
		}
	});
	
	$('.advSearchHeaderText').html(advSearchHeader);
	$("#advSearchModal").modal('show');
	
	$('#advSearchForm input.clsDate').each(function(i, elem) {	
		$(this).datepicker({
			showOn: "button",buttonImage: calendarImage,buttonImageOnly:true,buttonText : 'Open calendar'
		}); 
	});
	
	$('#advSearchForm select[multiple].advSearchInput').each(function(){
		var valueMap = $(this).val();
		if($(this).is(':visible') || (valueMap != null && valueMap !=undefined && valueMap.length>0)){	
			addDropdownCheckListForAdvSearch(this);
		} 
	});
	
	// Tabbing behavior for Adv Search Modal Multi select fields
	$('.ui-dropdownchecklist-selector').keydown(function(e){
		if(e.keyCode == 40) { 
			$(this).find('.iconOpen').trigger('click');   
		}   
	});
	
	$('#advSearchForm').find('input[id^=ddcl-]').focus(function(){
	    $(this).parent().addClass('ui-dropdownchecklist-hover');
	});
	$('#advSearchForm').find('input[id^=ddcl-]').blur(function(){
	    $(this).parent().removeClass('ui-dropdownchecklist-hover');
	});
}

function addDropdownCheckListForAdvSearch(select){
	var id = $(select).attr("id");
	var blnFirstItemChkAll;
	
	$("#ddcl-" + id).remove();
	//$('#' + id).dropdownchecklist('destroy');
	
	if($('#ddcl-' + id).length > 0){
		// destroy wrapper if it's already present in DOM
		$('#' + id).dropdownchecklist('destroy');
	}
	
	// add DDCL plugin to multi select boxes
	if(id == "channel_QuoteSearch" || id=="lob"){
		blnFirstItemChkAll = true;	
	}else{
		blnFirstItemChkAll = false;	
	}
	
	$('#' + id).dropdownchecklist({firstItemChecksAll: blnFirstItemChkAll, icon: {placement: 'right', toOpen: 'iconOpen', toClose: 'iconClose'}, emptyText: 'None selected' });
	styleDropdownCheckList(id);
	
	// bind event handler to new dropdown
	$(select).bind('changeSelectBoxIt',function(event, result) {
		refreshDropdownCheckList(this.id);
	});
}

function populateFromGlobalSearch(searchStr){
	var qnumber, lname, fname, name;
	
	if(searchStr != null && searchStr != '') {
		searchStr = $.trim(searchStr.replaceAll("*", ""));
		
		if(isPolicyNumber(searchStr)) {
			qnumber = searchStr;
			if(!isCompletePolicyNumber(qnumber)){
				qnumber = qnumber + "*";
			}
			$('#advSearchForm input[id="qnumber"]').val(qnumber);
		} 
		else {
			if(lastNameHasComma(searchStr)){
				name = searchStr.split(",");
				lname = name[0];
				fname = name[1];
				
				$('#advSearchForm input[id="lname"]').val(lname);
				if(fname != undefined && fname != ""){
					fname = $.trim(fname) + "*";
					$('#advSearchForm input[id="fname"]').val(fname);
				}
			} 
			else {
				lname = searchStr + "*";
				$('#advSearchForm input[id="lname"]').val(lname);
			}	
		}
	}
}

function populateAdvSearchFromStorage(tabAdvSearch){
	var clearDt = true;
	var strJSON = sessionStorage.getItem(tabAdvSearch);
	var obj = $.parseJSON(strJSON);
	
	$.each(obj, function() {
		var id = this.id;
		var value = String(this.value);
		var charIndxPos = value.indexOf(",");
		
		if(id == "keyword"){
			parseKeywordForAdvSearch(value, 'advSearchForm');
		}else{
			var elm = $('#advSearchForm').find(":input[id='" + id + "']"); 
			
			if(charIndxPos != -1){
				if(id=="lob"){
					$(elm).val(this.value);
				}else{
					var options = value.split(',');
					$(elm).val(options);
				}
			} else {
				$(elm).val(value);
			}
			
			// populate visible channel dropdown if needed
			if(id == "channel_QuoteSearch" && document.actionForm.hasCurrentProfile.value == "true"){
				$('#channel_QuoteSearch_Dummy').val(value);
			}
			
			// populate visible lob dd if needed
			if(id == "lob" && $('#lob_Dummy')){
				$('#lob_Dummy').val(value);
			}
			
			// populate visible state dd if needed
			if(id == "state" && $('#state_Dummy')){
				$('#state_Dummy').val(value);
			}
			
			if(id == "activitySearchRange" && value == "Custom"){
				$('#customDateRange').removeClass("hidden");
				clearDt = false;
			}
		}
	});
	
	if(clearDt){
		$('#advSearchForm input[id="fdate"]').val("");
		$('#advSearchForm input[id="tdate"]').val("");
	}
}

/* Advanced Search edits */
function noAQFieldsEntered(){
	var id, value;
	var blnFieldsEntered = false;
	
	$('#advSearchForm :input').each(function() { 
		id = this.id;
		value = $(this).val();
	
		if(id.indexOf("ddcl") == -1 
			&& !$(this).hasClass('noSubmit') 
			&& !$(this).hasClass('clsActivity')){
				if(value != "" && value != null){
					blnFieldsEntered = true;
				}
		}
	});

	return blnFieldsEntered;
}

function needLastName(fName, lName){
	if($(fName).val() != "" && $(lName).val() == ""){
		return true;
	}else{
		return false;
	}
}

function validateAQAdvSearch(){
	var msg = "";
	var errorImage = imagePath + "small_error_icon.png";
	var fname = $('#advSearchForm input[id="fname"]');
	var lname = $('#advSearchForm input[id="lname"]');
	var fdate = $('#advSearchForm input[id="fdate"]');
	var tdate = $('#advSearchForm input[id="tdate"]');
	var effDtTo = $('#advSearchForm input[id="effDateTo_Quote"]');
	var effDtFrom = $('#advSearchForm input[id="effDateFrom_Quote"]');
	var activityDateRange = $('#advSearchForm select[id="activitySearchRange"]').val();
	
	// clear all error messaging
	clearAQModalErrors('advSearchForm');
	
	// check if any other fields entered beside activity period
	if(!noAQFieldsEntered()){
		// display page alert
		msg = "You must filter by more than just Activity Period";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;" + msg;
		$("#allQuotesErrorAlert").html(msg);
		$("#allQuotesErrorAlert").addClass('inlineErrorMsg').removeClass("hidden");
	} else if(needLastName(fname, lname)){
		msg = "You cannot search by first name alone, you must enter at minimum a partial last name";
		msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
		$("#allQuotesErrorAlert").html(msg);
		$("#allQuotesErrorAlert").addClass('inlineErrorMsg').removeClass("hidden");
		$(lname).addClass("inlineError");
	} else {
		msg = msg + validateName(fname,"showUnderCellAQName");
		msg = msg + validateName(lname,"showUnderCellAQName");
		msg = msg + validateDate(fdate,"showUnderCellAQActDate");
		msg = msg + validateDate(tdate,"showUnderCellAQActDate");
		if(activityDateRange == "Custom"){
			msg = msg + requiredField(fdate,"showUnderCellAQActDate");
			msg = msg + requiredField(tdate,"showUnderCellAQActDate");
		}
		msg = msg + validateDateRange(tdate,"fdate","showUnderCellAQActDate");
		msg = msg + validateFutureDate(tdate,"fdate","showUnderCellAQActDate");
		msg = msg + validatePolicyEffDate(effDtTo,"showUnderCellAQEffDate");
		msg = msg + validatePolicyEffDate(effDtFrom,"showUnderCellAQEffDate");
		msg = msg + validateDateRange(effDtTo,"effDateFrom_Quote","showUnderCellAQEffDate");
	}
	
	if(msg != ""){
		return false;
	} else {
		return true;
	}
}

/* Stop Esignature edits */
function validateStopEsign(){
	var msg = "";
	var firstName = $('#frmStopEsign input[id="first_name"]');
	var lastName = $('#frmStopEsign input[id="last_name"]');
	var iAgree = $('#frmStopEsign input[id="chkIAgree"]');
	
	clearAQModalErrors('frmStopEsign');
	msg = msg + validateESignName(firstName,"showUnderCellESign");
	msg = msg + validateESignName(lastName,"showUnderCellESign");
	msg = msg + requiredCheckedField(iAgree,"eSignCol");
	
	if(msg != ""){
		return false;
	} else {
		return true;
	}
}

/* Resend Esignature edits */
function validateResendEsign(){
	var msg = "";
	var email = $('#frmResendEsign input[id="email"]');
	
	clearAQModalErrors('frmResendEsign');
	msg = msg + validateESignEmail(email,"showUnderCellEmail");
	
	if(msg != ""){
		return false;
	} else {
		return true;
	}
	
}

/* validation logic */
var fieldIdToModelErrorRow = {
	"eSignCol":"frmStopEsign|<tr class=\"errorRow\"><td id=\"chkIAgree_error\"></td></tr>",
	"showUnderCellESign":"frmStopEsign|<tr class=\"errorRow\"><td id=\"first_name_error\"></td><td id=\"middle_initial_error\"></td><td id=\"last_name_error\"></td></tr>",
	"showUnderCellAQName":"advSearchForm|<tr class=\"errorRow\"><td id=\"lname_error\"></td><td id=\"fname_error\"></td></tr>",
	"showUnderCellAQActDate":"advSearchForm|<tr class=\"errorRow\"><td id=\"fdate_error\"></td><td id=\"tdate_error\"><span class=\"advSrchLabel\">&nbsp;</span></td></tr>",
	"showUnderCellAQEffDate":"advSearchForm|<tr class=\"errorRow\"><td id=\"effDateFrom_Quote_error\"></td><td id=\"effDateTo_Quote_error\"><span class=\"advSrchLabel\">&nbsp;</span>&nbsp;</td></tr>",
	"showUnderCellEmail":"frmResendEsign|<tr class=\"errorRow\"><td id=\"email_error\"></td></tr>"
};

//error messages for Quote Advanced Search Modal and Stop Esignature Modal
var errorMessageJSON = {
	"first_name.browser.inLine.InvalidName":"First Name is required",
	"last_name.browser.inLine.InvalidName":"Last Name is required",
	"effDateFrom_Quote.browser.inLine.InvalidDate":"Valid date is required",
	"effDateTo_Quote.browser.inLine.InvalidDate":"Valid date is required",
	"effDateTo_Quote.browser.inLine.InvalidDateRange":"Valid date is required",
	"effDateFrom_Quote.browser.inLine.NoDate":"Date is required",
	"effDateTo_Quote.browser.inLine.NoDate":"Date is required",
	"chkIAgree.browser.inLine.NotCheckedValue":"Please check I Agree",
	"fdate.browser.inLine.NotEnteredValue":"Please enter a custom date range",
	"fdate.browser.inLine.InvalidDate":"Please enter a valid date",
	"tdate.browser.inLine.NotEnteredValue":"Please enter a custom date range",
	"tdate.browser.inLine.InvalidDate":"Please enter a valid date",
	"tdate.browser.inLine.InvalidDateRange":"Please enter a valid date range",
	"fdate.browser.inLine.InvalidFutureDateRange":"Future date is an invalid date",
	"tdate.browser.inLine.InvalidFutureDateRange":"Future date is an invalid date",
	"fname.browser.inLine.InvalidName":"Please enter a valid first name",
	"lname.browser.inLine.InvalidName":"Please enter a valid last name",
	"effDateFrom_Quote.browser.inLine.InvalidDate":"Please enter a valid date",
	"effDateTo_Quote.browser.inLine.InvalidDate":"Please enter a valid date",
	"effDateTo_Quote.browser.inLine.InvalidDateRange":"Please enter a valid date range",
	"policyEffectiveDateNQ.browser.inLine.InvalidDate":"Please enter a valid policy effective date in mm/dd/yyyy format.",
	"productNQ_hidden.browser.inLine.InvalidProducerProduct":"Agency Profile is invalid for Product selected",
	"productNQ_hidden.browser.inLine.InvalidEffectiveDateProduct":"Effective date is invalid for Product selected",
	"productNQ.browser.inLine.InvalidProducerProduct":"Agency Profile is invalid for Product selected",
	"productNQ.browser.inLine.InvalidEffectiveDateProduct":"Effective date is invalid for Product selected",
	"productNQ.browser.inLine.InvalidNQValue":"Product is required",
	"lobNQ.browser.inLine.InvalidNQValue":"Line of Business is required",
	"stateNQ.browser.inLine.InvalidNQValue":"State is required",
	"agencyProfileNQ.browser.inLine.InvalidNQValue":"Agency/Branch is required",
	"opCompanyAP.browser.inLine.InvalidNQValue":"Operating Company is required",
	"branchAP.browser.inLine.InvalidNQValue":"Branch is required",
	"agencyAP.browser.inLine.InvalidNQValue":"Agency is required",
	"uw_NotesMessage.browser.inLine.InvalidNotes":"Please enter a note",
	"endtEffectiveDate.browser.inLine.InvalidDate":"Please enter a valid policy effective date in mm/dd/yyyy format.",
	"opCompanyAdvSearch.browser.inLine.InvalidOpCompany":"Please select an operating company",
	"policyCity.browser.inLine.InvalidCity":"Please enter a valid city",
	"effDateFrom.browser.inLine.InvalidDate":"Valid date is required",
	"effDateTo.browser.inLine.InvalidDate":"Valid date is required",
	"effDateTo.browser.inLine.InvalidDateRange":"Search Range cannot exceed 31 days",	
	"effDateFrom.browser.inLine.InvalidDateRange":"Search Range cannot exceed 31 days",
	"effDateTo.browser.inLine.fromExceedTo":"The To date must be greater than the From date by at least one day",
	"effDateFrom.browser.inLine.fromExceedTo":"The To date must be greater than the From date by at least one day",
	"effDateFrom.browser.inLine.NoDate":"Date is required",
	"effDateTo.browser.inLine.NoDate":"Date is required",
	"email.browser.inLine.Email":"Enter Valid Email",
	"firstNameNewCo.browser.inLine.InvalidName" : "Please enter a valid first name",
	"firstNameNewCo.browser.inLine.InvalidNQValue" : "Please enter a valid first name",
	"lastNameNewCo.browser.inLine.InvalidName" : "Please enter a valid last name",
	"lastNameNewCo.browser.inLine.InvalidNQValue" : "Please enter a valid last name",
	"dobNewCo.browser.inLine.InvalidDate" : "Please enter a valid date of birth",
	"fullAddressNewCo.browser.inLine.InvalidNQValue" : "Full Address is required",
	"policyEffectiveDateNewCo.browser.inLine.InvalidDate" : "Please enter a valid policy effective date",
	"branchNewCo.browser.inLine.InvalidNQValue" : "Branch is required",
	"agencyNewCo.browser.inLine.InvalidNQValue" : "Agency is required",
	"producerNewCo.browser.inLine.InvalidNQValue" : "Producer Code is required",
	"policyEffectiveDateNewCo.browser.inLine.InvalidProducerProduct" : "Effective date is invalid for Product selected"
};

function validateESignName(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidESignName('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validateESignEmail(addressEmailID, rowType){
	var strID = $(addressEmailID).attr("id");
	return isValidESignEmail('',addressEmailID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function requiredField(elm, rowType){
	var strID = $(elm).attr("id");
	return isFieldEntered('',elm,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function requiredCheckedField(elm, rowType){
	var strID = $(elm).attr("id");
	return isFieldChecked('',elm,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validateName(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidName('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validateDate(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidDate('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validatePolicyEffDate(nameID, rowType){
	var strID = $(nameID).attr("id");
	return isValidPolicyEffDate('',nameID,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validateDateRange(nameID, strID2, rowType){
	var strID = $(nameID).attr("id");
	return isValidDateRange('',strID, strID2,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

function validateFutureDate(nameID, strID2, rowType){
	var strID = $(nameID).attr("id");
	return isFutureDate('',strID, strID2,'No', strID + '.browser.inLine',fieldIdToModelErrorRow[rowType], '');
}

/* validation functions */
function isValidPolicyEffDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var policyEffDate = $(elementId).val();
	var errorMessageID = '';
	if(policyEffDate==null || policyEffDate =='' || policyEffDate == 'Optional'){ 
		 errorMessageID = '';
	} else
	{
		var dtDate = new Date(policyEffDate);
		var valid = true;
		
		if (!isValidDatDateFormat(policyEffDate)) valid=false;
		if (dtDate.toDateString() == "NaN" || dtDate.toDateString() == "Invalid Date") valid=false;
		if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100) valid=false;
		
		if (!valid){   
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		} else {
			errorMessageID = '';
	    }
	}
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidESignName(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var nameRegex = new RegExp(/^[a-zA-Z *~'\-\\s]+$/);
	var name = $(elementId).val();
	var errorMessageID = '';
	var valid = nameRegex.test(name);
	
	if (!valid){
		errorMessageID = 'InvalidName';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	} else{
		errorMessageID = '';
    }
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidESignEmail(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var nameRegex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/);
	var name = $(elementId).val();
	var errorMessageID = '';
	var valid = nameRegex.test(name);
	
	if (!valid){
		errorMessageID = 'email.browser.inLine.Email';
	//  errorMessageID = strErrorTag + '.' + errorMessageID;
	} else{
		errorMessageID = '';
    }
	console.log(errorMessageID);
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidDateRange(name, elementId,fromDateID, strRequired, strErrorTag, strErrorRow, index){
	var tDate = $('#advSearchForm input[id="' + elementId+ '"]').val();
	var fDate = $('#advSearchForm input[id="' + fromDateID + '"]').val();
	var errorMessageID = "";
	var valid = true;
	
	if(tDate == "" && fDate == ""){
		return errorMessageID;
	}
	
	if(tDate == "" && fDate != "") valid=false;
	if(tDate != "" && fDate == "") valid=false;
	if(isDateGreaterThan(fDate,tDate)) valid=false;
	
	if (!valid)
	{
		errorMessageID = 'InvalidDateRange';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	showClearInlineErrorMsgsWindow('',elementId, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

/*
 * 02/01/2014
 * Validate custom date range - future date
 * */
function isFutureDate(name, elementId,fromDateID, strRequired, strErrorTag, strErrorRow, index){
	
	var tDate = $('#advSearchForm input[id="' + elementId+ '"]').val();
	var fDate = $('#advSearchForm input[id="' + fromDateID + '"]').val();
	var errorMessageID = "";
	var valid = true;
	var validfutureDate = true;
	
	if(tDate == "" && fDate == ""){
		return errorMessageID;
	}
	
	var currDate = new Date();
	if(new Date(fDate)>currDate){ validfutureDate=false;}
	if(!validfutureDate)
	{
		elementId = fromDateID;
		errorMessageID = 'InvalidFutureDateRange';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	
	if(new Date(tDate)>currDate){ validfutureDate=false;}
	if(!validfutureDate)
	{
		errorMessageID = 'InvalidFutureDateRange';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	
	if(isDateGreaterThan(fDate,tDate)) valid=false;
	
	if (!valid)
	{
		errorMessageID = 'InvalidDateRange';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}
	
	showClearInlineErrorMsgsWindow('',elementId, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

/* common validation functions */
function isFieldEntered(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var fieldValue = $(elementId).val();
	var errorMessageID = '';
	if(fieldValue==null || fieldValue == 'Optional' || fieldValue != ""){ 
		 errorMessageID = '';
		 return errorMessageID;
	}
	else{
		if(fieldValue == ""){
			errorMessageID = 'NotEnteredValue';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}else{
			errorMessageID = '';
		}
		var id = $(elementId).attr("id");
		showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	}
}

function isFieldChecked(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var blnChecked = $(elementId).is(':checked');

	var errorMessageID = '';
	if(!blnChecked){
		errorMessageID = 'NotCheckedValue';
		errorMessageID = strErrorTag + '.' + errorMessageID;
	}else{
		errorMessageID = '';
	}
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidName(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var nameRegex = new RegExp(/^[a-zA-Z *~'\-\\s]+$/);
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
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function isValidDate(name, elementId,strRequired, strErrorTag, strErrorRow, index){
	var dt = $(elementId).val();
	var errorMessageID = '';
	if(dt==null || dt =='' || dt == 'Optional'){ 
		 errorMessageID = '';
	} else
	{
		var dtDate = new Date(dt);
		var valid = true;
	
		if (!isValidDatDateFormat(dt)) valid=false;
		if (dtDate.toDateString() == "NaN" || dtDate.toDateString() == "Invalid Date") valid=false;
		if (dtDate.getTime() > new Date().getTime()) valid=false;
	
		if (!valid)
		{
			errorMessageID = 'InvalidDate';
			errorMessageID = strErrorTag + '.' + errorMessageID;
		}
		else
	    {
			errorMessageID = '';
	    }
	}
	
	var id = $(elementId).attr("id");
	showClearInlineErrorMsgsWindow('',id, errorMessageID, strErrorRow, index);
	return errorMessageID;
}

function clearAQModalErrors(frmId){
	// clear any previous inline messaging
	$("#allQuotesErrorAlert").html("");
	$("#allQuotesErrorAlert").removeClass('inlineErrorMsg').addClass("hidden");
	$('tr.errorRow').remove();
	
	$('#' + frmId + ' :input').each(function() {
		$(this).removeClass('inlineError'); 
	});
}

function sortAQGrid(selectedTab, sortCol, sortOrder, count){
	var sortIcon;
	
	if(sortCol == ""){
		// sort has not been defined, set default sort column
		if(selectedTab == SearchInEnum.ESIGNATURE){
			sortCol = "esignatureDate";
		} else {
			sortCol = "lastUpdatedDate";
		}
		sortIcon = $('#' + sortCol + '_icon');
		if(count > 0){
			$(sortIcon).removeClass(arrowUpClass).addClass(arrowDownClass).show();
		}else{
			$(sortIcon).hide();
		}
	}else{
		// we already have sort defined
		sortIcon = $('#' + sortCol + '_icon');
		if(count > 0){
			if(sortOrder.toUpperCase() == "DESC"){
				$(sortIcon).removeClass(arrowUpClass).addClass(arrowDownClass).show();
			}else{
				$(sortIcon).addClass(arrowUpClass).removeClass(arrowDownClass).show();
			}
		}else{
			$(sortIcon).hide();
		}
	
		// reload grid client-side for sorting purposes
		// don't reload if user clicked column header to sort
		var $this = $("#grid");
        if ($this.jqGrid("getGridParam", "datatype") !== "local") {
        	setTimeout(function () {
                $this.trigger("reloadGrid");
            }, 10);
        }
	}	
}
