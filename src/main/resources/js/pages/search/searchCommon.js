var arrowUpClass = "arrow-up";
var arrowDownClass = "arrow-down";

jQuery(document).ready(function() {
	
	// Sort columns on grid
	$('.sortCol').click(function(){
		sortColumn(this.id);
	});

   // View more results link
   $('.moreResults').click(function(){
    	getNextRecords();
   });
   
   // hover help
   $('td.sortCol').bind("mouseover", function(){
	   var charIndxPos = $(this).attr("title").indexOf("Sort by:");
	   if(charIndxPos == -1){
		   var toolTip = "Sort by: " + $(this).attr("title");
		   setTooltipValue(this,toolTip);
	   }
	});
   
  /* $("td.policyNumber").on({
		mouseenter: function(e){
			var trRow = $(this).parent();
			var rowId = $(trRow).attr('id');
			hideToolTip($(this));
			genActionsList(rowId);
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		},
		mouseleave: function(e){
			var trRow = $(this).parent();
			var rowId = $(trRow).attr('id');
			clearActionsList(rowId);
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		}
	});*/
 /*  $(document).on("mouseenter", "td.policyNumber", function(e){
	   var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		hideToolTip($(this));
		genActionsList(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
   });
   
   $(document).on("mouseleave", "td.policyNumber", function(e){
	   var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		clearActionsList(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
   });*/
   
   $(document)
  	.on("mouseenter", "td.policyNumber", function(e) {
  		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		hideToolTip($(this));
		genActionsList(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
  	})
  	.on("mouseleave", "td.policyNumber", function(e) {
  		var trRow = $(this).parent();
 		var rowId = $(trRow).attr('id');
 		clearActionsList(rowId);
 		e.preventDefault ? e.preventDefault() : e.returnValue = false;
  	});
   
/*   $("tr.jqgrow").on({
		mouseenter: function(e){
			var rowId = $(this).attr('id'); 
   			$('#actionsArrow_' + rowId).show();
		},
		mouseleave: function(e){
			var rowId = $(this).attr('id');
	   		$('#actionsArrow_' + rowId).hide();
		}
   });*/
   
   
/*   $(document).on("mouseenter", "tr.jqgrow", function(e){
	   var rowId = $(this).attr('id'); 
			$('#actionsArrow_' + rowId).show();
   });
   
   $(document).on("mouseleave", "tr.jqgrow", function(e){
	   var rowId = $(this).attr('id');
  		$('#actionsArrow_' + rowId).hide();
   });*/
   
   $(document)
   	.on("mouseenter", "tr.jqgrow", function(e) {
	   var rowId = $(this).attr('id'); 
	   $('#actionsArrow_' + rowId).show();
   	})
   	.on("mouseleave", "tr.jqgrow", function(e) {
	   var rowId = $(this).attr('id');
	   $('#actionsArrow_' + rowId).hide();
   	});
  
   initialFormLoadProcessing();
});

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
}

// common grid functions
function clearGridLoad(){
	// clears applicable DOM elements as grid loads
	$('.popover').hide();
	$('.ui-autocomplete.ui-menu').hide();
	$('.gridLoadHide').hide();
	$("#infoMessage").addClass("hidden");
	$('#count').html('&nbsp;');
	$('#grid tbody:first-child tr:last-child td').removeClass('gridBottomBorder');
	$(".modal").modal('hide');
	$("#gridCountRowAdditional").addClass("hidden");
}

function displayGridView(){
	// no need to apply rounded corners on IE8
	if(!($.browser.msie  && parseInt($.browser.version, 10) === 8)){
		$('#grid tr:last-child td:first-child').addClass('roundBottomLeft');
		$('#grid tr:last-child td:visible:last').addClass('roundBottomRight');
	}
	
	$('#grid tbody:first-child tr:last-child td').addClass('gridBottomBorder');
	$('#grid').unbind('contextmenu');
}

function gridReload(urlStr, rowCnt, searchIn, reloadGrid){
	$('#searchIn').val(searchIn);
	$('#grid').jqGrid('setGridParam',{url:urlStr,page:1,rowNum:rowCnt,sortname:'',datatype:'json'})
	.clearGridData(reloadGrid).trigger('reloadGrid');
}

function getColumnIndexByName(grid,columnName) {     
	var cm = grid.jqGrid('getGridParam','colModel');    
 	for (var i=0,l=cm.length; i<l; i++) {         
		if (cm[i].name===columnName) {             
			return i; // return the index of the grid column        
		}     
	}    
	 return -1; 
}; 

function resetSearchURL(){
	var url = document.actionForm.searchResultsURL.value;
	var charIndxPos = url.indexOf("/data?");
	if(charIndxPos > -1 ) {
		url = $.trim(url.substr(0, charIndxPos + 6));
		document.actionForm.searchResultsURL.value = url;
	} 

}

function sortColumn(col){
	var sortCol = $('#grid').jqGrid('getGridParam','sortname'); 
	var sort = $('#grid').jqGrid('getGridParam','sortorder');
	
	if ((sortCol.toUpperCase() != col.toUpperCase()) ||(sortCol.toUpperCase() == col.toUpperCase() && sort.toUpperCase() == "ASC")) {
		sort = "desc";
	} else {
		sort = "asc";
	}
	
	// reload grid without calling service
	$('#grid').jqGrid('setGridParam',{sortname:col, sortorder:sort, datatype: 'local'}).trigger('reloadGrid');
}

function showMoreResultsMsg(total){
	var msg;
	var recCount = $('#grid').getGridParam('records');

	if(total <= recCount) {
		$('.moreResults').hide();
	} else {
		$('.moreResults').show();
	}
	
	msg = "Displaying " + formatCountNumber(recCount) + " of " + total + " results";
	
	return msg;
}

function showStandardProfileMsg(){
	if($('#hasMultipleProfiles').val() == "true"){
		$("#gridCountRowAdditional").addClass("hidden");
		$("#profileMsgAdditional").addClass("hidden");
		$("#profileMessage").show();
	}
}

function showAdditionalProfileMsg(){
	if($('#hasMultipleProfiles').val() == "true"){
		var marginTop = parseInt($("#grid").css("margin-top"));
		$("#gridCountRowAdditional").removeClass("hidden");
		$("#profileMsg").hide();
		$("#profileMsgAdditional").removeClass("hidden");
		$("#profileMessageAdditional").show();
		$("#profileMessageAdditional").css("padding-left", "0px").css("margin-left", "-35px");
		$("#grid").css("margin-top", marginTop + 25);
	}
}

function showSvcError(msg){
	// errors messages will need to be in common
	var errorImage = imagePath + "small_error_icon.png";
	msg = "<img id='errorImage' src='" + errorImage + "'/>" + msg;
	$("#infoMessage").addClass("hidden");
	$('#count').addClass('inlineErrorMsg').html(msg);
	$('.moreResults').hide();
	
	if(msg.length > 40){
		showStandardProfileMsg();
	}else{
		showAdditionalProfileMsg();
	}
}

function formatCountNumber(num) {
	return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

/* Grid messaging */
function displayRecordCount(count, total, errMsg){
	var msg, totalRecords;
	var errorImage = imagePath + "small_error_icon.png";

	if(total == 0) {
		if(errMsg!= undefined && errMsg.length == 0){
			errMsg = "No results found";
		}
		
		msg = "<img id='errorImage' src='" + errorImage + "'/>" + errMsg;
		$('#count').addClass('inlineErrorMsg');
		$("#infoMessage").addClass("hidden");
		$('.moreResults').hide();
		
		
		if(errMsg!= undefined && errMsg.length > 40){
			showAdditionalProfileMsg();
		}else{
			showStandardProfileMsg();
		}
		
		// display policy advanced search - need clarification in FR it says should display but use case says user can optionally click it ???
		//openAdvPolicySearch();
	}
	else{
		if(total > 100) {
			totalRecords = formatCountNumber(total);
			msg = showMoreResultsMsg(totalRecords);
			$('#count').removeClass("inlineErrorMsg");
			showInfoMessage(msg);
		} else {
			if(errMsg!= undefined && errMsg.length > 0){
				msg = "<img id='errorImage' src='" + errorImage + "'/>" + errMsg;
				$('#count').addClass('inlineErrorMsg');
				$("#infoMessage").addClass("hidden");
				$('.moreResults').hide();
				if(errMsg.length > 40){
					showAdditionalProfileMsg();
				}else{
					showStandardProfileMsg();
				}
			} else {
			(total == 1) ? result =" result found.": result=" results found";
			msg = count + result;
		$('#count').removeClass("inlineErrorMsg");
		showInfoMessage(msg);
	}
	
		}
		
	}
	
	$('#count').html(msg);
	$('#advSearch').show();	
}

function showInfoMessage(countMsg){
	// need to check what message will display
	var infoMsg;
	var polStatus = $.trim(document.actionForm.policyStatusSearch.value);
	var errorImage = imagePath + "small_error_icon.png";
	var infoImage = imagePath + "small_icon_info.png";
	var strHTML = "<img id='infoImage' src='" + infoImage + "'/>";
	
	if(polStatus == PolicySearchStatus.ALL_ACTIVE || polStatus == PolicySearchStatus.ALL_ACTIVECANCEL){
		if(polStatus == PolicySearchStatus.ALL_ACTIVE){
			infoMsg = "Only active policies displayed";
		} else {
			infoMsg = "Only active or cancelled policies displayed";
		}
		strHTML = strHTML + infoMsg;

		var strErrorMsg = document.actionForm.policyError.value;
		if(strErrorMsg != "" && strErrorMsg != "null"){
			strErrorMsg = "<img id='errorImage' src='" + errorImage + "'/>" + strErrorMsg;
			showAdditionalProfileMsg();
			$("#infoMessage").html(strErrorMsg).removeClass("hidden");
			$("#infoMessageAdditional").html(strHTML);
			$('#addCount').html(countMsg);
		}else{
			if($('#hasMultipleProfiles').val() == "true"){
				showAdditionalProfileMsg();
				$("#profileMessageAdditional").css("padding-left", "0px").css("margin-left", "-38px");
				$("#infoMessageAdditional").removeClass("hidden");
				$("#infoMessage").html(strHTML).removeClass("hidden");
			}else{
				$("#infoMessage").html(strHTML).removeClass("hidden");
				$("#infoMessageAdditional").html("");
				$("#infoMessageAdditional").addClass("hidden");
			}
		}
	}else{
		showStandardProfileMsg();
	}
}

/* Grid formatters */
function policyNameFormater(cellValue, options, rowObject)  { 
	var lastName, firstName;
	var name = "";
	
	/* Do not want to do any capitalization for Comm Auto Quotes/Policies */
	if(rowObject.lob.toUpperCase() == "CA" || rowObject.lob.toUpperCase() == "CAUTO"){
		lastName = rowObject.lastName;
		firstName = rowObject.firstName;
	}else{
		lastName = capitalizeFirstChar(rowObject.lastName);
		firstName = capitalizeFirstChar(rowObject.firstName);
	}
	
	if(lastName != "" && lastName != null && lastName != undefined) {
		name = lastName;
	}
		
	if(firstName != "" && firstName != null && firstName != undefined) {
		name = name + ', ' + firstName;
	}
	
	return "&nbsp;" + name;
}

function residenceFormater(cellValue, options, rowObject)  { 
	return rowObject.houseNumber +" "+ rowObject.address1+"<br/>"
		+ rowObject.city  + ", "+ rowObject.state + " " + rowObject.zip  +" "+ rowObject.country;
}

function statusFormater(cellValue, options, rowObject)  { 
	return capitalizeFirstChar(rowObject.status);
}

function lobFormater(cellValue, options, rowObject)  { 
	
	if(cellValue == null || cellValue == "" || typeof cellValue == 'undefined') {
        return '';
    }
	
	if ("PA"  === cellValue.toUpperCase()) {
		return "Personal Auto";
	} else if ("HO"  === cellValue.toUpperCase()) {
		return "Home";
	} else if ("PRIMARY_PP"  === cellValue.toUpperCase() || "PCAT"  === cellValue.toUpperCase()) {
		return "Umbrella";
	} else if ("CA"  === cellValue.toUpperCase()) {
		return "Commercial Auto";
	}
	
}

function policyNumFormatter(cellValue, options, rowObject)  { 
	var rowId = rowObject.rowNumber;
	var policyNumber = rowObject.policyNumber;
	var term = "";
	var action, strHTML;
	
	if(document.actionForm.quickLinksAction.value != ""){
		action = document.actionForm.quickLinksAction.value;
	}else if(document.actionForm.searchIn.value == SearchInEnum.ENDORSEMENT){
		action = InquiryActionEnum.ENDORSEMENT;
	}else if(document.actionForm.searchIn.value == SearchInEnum.CLAIMS){
		action = InquiryActionEnum.CLAIMS;
	}else{
		action = InquiryActionEnum.POLICY;
	}
	
	var parms = "'" + rowId  + "','" + encodeURI(action) + "'";
	
	if(rowObject.term != undefined){
		term = "-" + rowObject.term;
	}
	
    // if review payments was action
	if(action == InquiryActionEnum.REVIEWPAYMENTS || disablePolicyNumLink(action, rowObject)){
    	strHTML = "<span id=\"policyNumber_" + rowId + "\">" + policyNumber + term + "</span>";
    }else{
    	strHTML = "<a href=\"javascript:submitPolicyActionForm(" + parms + ")\">";
        strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" + policyNumber + term + "</span></a>";
    }
	
	strHTML = strHTML +	"<span id=\"actionsArrow_" + rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
	strHTML = strHTML + "<div id=\"actionsList_" + rowId + "\" class=\"actionsFlyout\"></div>";
	
	return strHTML;
}

function disablePolicyNumLink(action, policyRecord){
	if((action == InquiryActionEnum.ENDORSEMENT && LegacyPolicyNotHaveEndorsements(policyRecord))
	  || (action == InquiryActionEnum.ESERVICES && LegacyPolicyNotHaveEServices(policyRecord))
	  || (action == InquiryActionEnum.NOTES && LegacyPolicyNotHaveNotes(policyRecord))
	  || (action == InquiryActionEnum.REPORTCLAIM && LegacyPolicyNotHaveReportClaim(policyRecord))){
			return true;
	}else{
		return false;
	}
}

function moneyFormatter(cellValue){
	if(cellValue == null || cellValue == "" || typeof cellValue == 'undefined') {
        return "$0";
    }
	
	var charIndxPos = cellValue.indexOf(".");
	if(charIndxPos > -1){
		cellValue = "$" + numberWithCommas($.trim(cellValue.substr(1, charIndxPos - 1)));
	}

	return cellValue;
}

//TD 44344 - This is for allquotes only. We need to show time if its todays date
function dateTimeFormatter(cellValue)  { 
	if(cellValue == null || cellValue == "" || typeof cellValue == 'undefined') {
        return '';
    }

    var lastUpdatedDate = new Date(cellValue); 
    var today = new Date(); 
    
    if(today.getDate() == lastUpdatedDate.getDate() 
	&& today.getMonth() == lastUpdatedDate.getMonth() 
	&& today.getFullYear() == lastUpdatedDate.getFullYear()) {
    	return lastUpdatedDate.getFormattedTime();
    } else {
		 var lyear=lastUpdatedDate.getFullYear();

		 var lmonth=lastUpdatedDate.getMonth()+1;
		 var ltoday=lastUpdatedDate.getDate();
		 if(lmonth <= 9) lmonth = "0" + lmonth;
		 if(ltoday <= 9) ltoday = "0" + ltoday;
	
		 return lmonth+"/"+ltoday+"/"+lyear;;
	} 
}

//TD 44344 - This is for policy and claim search, We dont want time to be displayed for policy/claim searches
function dateFormatter(cellValue)  { 
	if(cellValue == null || cellValue == "" || typeof cellValue == 'undefined') {
        return '';
    }

    var lastUpdatedDate = new Date(cellValue); 
    /*  var today = new Date(); 
    
    if(today.getDate() == lastUpdatedDate.getDate() 
	&& today.getMonth() == lastUpdatedDate.getMonth() 
	&& today.getFullYear() == lastUpdatedDate.getFullYear()) {
    	return lastUpdatedDate.getFormattedTime();
    } else {*/
		 var lyear=lastUpdatedDate.getFullYear();

		 var lmonth=lastUpdatedDate.getMonth()+1;
		 var ltoday=lastUpdatedDate.getDate();
		 if(lmonth <= 9) lmonth = "0" + lmonth;
		 if(ltoday <= 9) ltoday = "0" + ltoday;
	
		 return lmonth+"/"+ltoday+"/"+lyear;;
//	} 
}

/* Actions */
function genActionsList(rowId){
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
		    actualHeight = 230;
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

function enablePolicyAction(action, policyRecord){
	var disableBasicInquiry = document.actionForm.disableBasicInquiry.value;
	var disableWebPay = document.actionForm.disableWebPay.value;
	var disableEndorsement = document.actionForm.disableEndorsement.value;
	var status = policyRecord.policyStatus;
	
	// disable inqury actions if needed
	if((action == InquiryActionEnum.POLICY || action == InquiryActionEnum.BILLING || action == InquiryActionEnum.CLAIMS
	    || action == InquiryActionEnum.DOCUMENTS || action == InquiryActionEnum.ESERVICES || action == InquiryActionEnum.NOTES)
	    && (disableBasicInquiry.toUpperCase() == "TRUE")){
			return false;
    }
	
	// disable web pay actions if needed
	if((action == InquiryActionEnum.MAKEPAYMENT || action == InquiryActionEnum.REVIEWPAYMENTS)
		&& (disableWebPay.toUpperCase() == "TRUE")){
			return false;
	}
	
	// disable endorsement if needed
	if(action == InquiryActionEnum.ENDORSEMENT){
		if(LegacyPolicyNotHaveEndorsements(policyRecord) || disableEndorsement.toUpperCase() == "TRUE") {
			return false;	
		}else if(status == InquiryPolicyStatus.REJECTED 
			|| status ==  InquiryPolicyStatus.INCOMPLETE 
			|| status ==  InquiryPolicyStatus.CANCELED){
				return false;
		}else if((isLegacyMAIPPolicy(policyRecord) && !hasAccessLegacyMAIPEndorsement(policyRecord))
			|| (isPrimeMAIPPolicy(policyRecord) && !hasAccessPrimeMAIPEndorsement(policyRecord))){
				return false;
		}
	}
	
	// disable e-Services if needed
	if(action == InquiryActionEnum.ESERVICES && LegacyPolicyNotHaveEServices(policyRecord)){
		return false;
	}
	
	// disable notes if needed
	if(action == InquiryActionEnum.NOTES && LegacyPolicyNotHaveNotes(policyRecord)){
		return false;
	}
	
	// disable make a payment if needed
	if(action == InquiryActionEnum.MAKEPAYMENT){
		if(status == InquiryPolicyStatus.REJECTED ){
			return false;
		}
	}
	
	// disable report a claim if needed 
	if(action == InquiryActionEnum.REPORTCLAIM && LegacyPolicyNotHaveReportClaim(policyRecord)){
		return false;
	}
	
	if(action == InquiryActionEnum.IDCARDS) {
		if (!enableIDCardLink(policyRecord)) {
			return false;
		}
	}
	
	return true;
}

function clearActionsList(rowId){
	$('#actionsArrow_' + rowId).popover('destroy');
}

function getNextRecords() {
	var urlStr;
	var currentPage = 1;
	var rows = $('#grid').getGridParam('rowNum') + 100;
	var search = "false";
	var searchIn = document.actionForm.searchIn.value;
	var keyword = document.actionForm.previousKeyword.value;
	var sortCol = $('#grid').jqGrid('getGridParam','sortname');
	var sortOrder = $('#grid').jqGrid('getGridParam','sortorder');
	
	$('#searchIn').val(searchIn);
	urlStr = generateSearchURL(keyword, currentPage, rows, search, searchIn);
	
	$('#grid').jqGrid('setGridParam',{url:urlStr,page:currentPage,rowNum:rows,sortname:sortCol,sortOrder:sortOrder,datatype: 'json'})
	.clearGridData(false).trigger('reloadGrid');
}

function generateSearchURL(searchStr, currentPage, rows, search, searchIn){
	var lname = "";
    var fname = "";
    var name;
	var urlStr = document.actionForm.searchResultsURL.value+"_search="+search+"&searchIn="+searchIn;
	urlStr = urlStr + "&page="+currentPage+"&rows="+rows;
	
	if((searchStr != null && searchStr != '')) {
		if(isPolicyNumber(searchStr)) {
			var qnumber = searchStr;
			if(!isCompletePolicyNumber(qnumber)) {
				qnumber = qnumber +"*";
			}
			urlStr = urlStr + "&qnumber="+ qnumber;
		} else {
			name = searchStr.split(",");
			if(name[1] != undefined) {
				fname = $.trim(name[1])+"*";
			} else {
				lname = lname+"*";
			}
			urlStr = urlStr + "&lname="+lname;
			urlStr = urlStr + "&fname="+fname;
		}
	} else if("false" == search) {
		//More was hit
		urlStr = urlStr+generateSearchParams();
	}
	
	return urlStr;
}

/**
 * Forms an URL based on advance search fields/popup
 * 
 * @returns URL string based on advanced search Entries
 */
function generateSearchParams(){
	var urlStr="";
	
	$('#advSearchForm :input').each(function() {
		if(this.id.indexOf("ddcl") == -1){
			var id = this.id;
			var val = $(this).val();
			if(val == null){
				val = "";
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
				if(id!=''){
					urlStr = urlStr + "&" + id + "=" + encodeURI(val);
				}
			}
		}
	}); 
	
	return urlStr;
}

var InquiryActionLinkEnum={
	"Policy":"Policy Summary",
	"Billing":"Billing Details",
	"Claims":"Claims Details",
	"Documents":"Documents",
	"Make A Payment":"Make a Payment",
	"Review Payments":"Review Payments",
	"Endorsement":"Endorsement",
	"eServices":"eServices",
	"Notes":"Notes",
	"Report A Claim":"Report a Claim",
	"Request Proof of Insurance":"Request Proof of Insurance"
};

/*var InquiryActionLinkEnum={
	"Policy":"Policy Inquiry",
	"Billing":"Billing Inquiry",
	"Claims":"Claims Inquiry ",
	"Documents":"Document Inquiry",
	"Make A Payment":"Make A Payment",
	"Review Payments":"Review Payments",
	"Endorsement":"Endorsement",
	"eServices":"eServices",
	"Notes":"Notes"
};
*/

function hideInqAction(action){
	// display actions based on user's security roles
	var hasWebPayAccess = document.actionForm.hasWebPayAccess.value;
	var hasBasicInquiry = document.actionForm.hasBasicInquiry.value;
	var hasEndorseAccess = document.actionForm.hasEndorseAccess.value;
	
	if(action == InquiryActionEnum.IDCARDS && !isIDCardsRollout()) {
		return true;
	}
	
	if((hasWebPayAccess == "false" && (action == InquiryActionEnum.MAKEPAYMENT || action == InquiryActionEnum.REVIEWPAYMENTS))
		||(hasEndorseAccess == "false" && action == InquiryActionEnum.ENDORSEMENT)
		||(hasBasicInquiry == "false" 
			&& action != InquiryActionEnum.MAKEPAYMENT 
			&& action == InquiryActionEnum.REVIEWPAYMENTS 
			&& action == InquiryActionEnum.ENDORSEMENT)){
				return true;
	}else{
		return false;
	}
}

function sortGrid(sortCol, sortOrder, count){
	var sortIcon;
	
	if(sortCol == ""){
		// sort has not been defined, set default sort column
		sortCol = "name";
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

/* Policy Actions */
function genActionsListByRowId(rowId) {
	var strHTML = "";
	var actionsList = [];
	var policyRecord = new PolicyRecord(rowId);
	var status = policyRecord.policyStatus;
	var policyNumber = policyRecord.policyNumber;
	var policyState = policyRecord.state;
	var lob = policyRecord.lob;

	if(status == InquiryPolicyStatus.INCOMPLETE){
		actionsList = [InquiryActionEnum.MAKEPAYMENT,
				            InquiryActionEnum.REVIEWPAYMENTS];
	}else if(isTeachersPolicyNumber(policyNumber)){
		if(document.actionForm.eFNOLRollout.value == "true"){
			actionsList = [InquiryActionEnum.POLICY, 
			               InquiryActionEnum.BILLING, 
			               InquiryActionEnum.CLAIMS,
			               InquiryActionEnum.DOCUMENTS,
			               InquiryActionEnum.MAKEPAYMENT,
			               InquiryActionEnum.REVIEWPAYMENTS,
			               InquiryActionEnum.ENDORSEMENT,
			               InquiryActionEnum.NOTES,
			               InquiryActionEnum.REPORTCLAIM];
		}else{
			actionsList = [InquiryActionEnum.POLICY, 
			               InquiryActionEnum.BILLING, 
			               InquiryActionEnum.CLAIMS,
			               InquiryActionEnum.DOCUMENTS,
			               InquiryActionEnum.MAKEPAYMENT,
			               InquiryActionEnum.REVIEWPAYMENTS,
			               InquiryActionEnum.ENDORSEMENT,
			               InquiryActionEnum.NOTES];
		}		
		actionsList.push(InquiryActionEnum.IDCARDS);
		
	}else if(isPalPolicyNumber(policyRecord)){
		if(document.actionForm.eFNOLRollout.value == "true"){
			actionsList = [InquiryActionEnum.POLICY, 
				           InquiryActionEnum.BILLING, 
				           InquiryActionEnum.CLAIMS,
				           InquiryActionEnum.DOCUMENTS,
				           InquiryActionEnum.MAKEPAYMENT,
				           InquiryActionEnum.REVIEWPAYMENTS,
				           InquiryActionEnum.ENDORSEMENT,
				           InquiryActionEnum.ESERVICES,
				           InquiryActionEnum.NOTES,
				           InquiryActionEnum.REPORTCLAIM];
		}else{
			actionsList = [InquiryActionEnum.POLICY, 
				           InquiryActionEnum.BILLING, 
				           InquiryActionEnum.CLAIMS,
				           InquiryActionEnum.DOCUMENTS,
				           InquiryActionEnum.MAKEPAYMENT,
				           InquiryActionEnum.REVIEWPAYMENTS,
				           InquiryActionEnum.ENDORSEMENT,
				           InquiryActionEnum.ESERVICES,
				           InquiryActionEnum.NOTES];
		}
		actionsList.push(InquiryActionEnum.IDCARDS);
		
	}else{
		if(document.actionForm.eFNOLRollout.value == "true"){
			actionsList = [InquiryActionEnum.POLICY, 
			               InquiryActionEnum.BILLING, 
			               InquiryActionEnum.CLAIMS,
			               InquiryActionEnum.DOCUMENTS,
			               InquiryActionEnum.MAKEPAYMENT,
			               InquiryActionEnum.REVIEWPAYMENTS,
			               InquiryActionEnum.ENDORSEMENT,
			               InquiryActionEnum.ESERVICES,
			               InquiryActionEnum.NOTES,
			               InquiryActionEnum.REPORTCLAIM];
		}else{
			actionsList = [InquiryActionEnum.POLICY, 
			               InquiryActionEnum.BILLING, 
			               InquiryActionEnum.CLAIMS,
			               InquiryActionEnum.DOCUMENTS,
			               InquiryActionEnum.MAKEPAYMENT,
			               InquiryActionEnum.REVIEWPAYMENTS,
			               InquiryActionEnum.ENDORSEMENT,
			               InquiryActionEnum.ESERVICES,
			               InquiryActionEnum.NOTES];
		}
		actionsList.push(InquiryActionEnum.IDCARDS);
	}
	
	
	if (actionsList.length > 0) {
		strHTML = "<ul class=\"actionList\">";
		$.each(actionsList, function(id, action) {
			//TD 49015 -Teachers Independent Agent should not be able to view notes
			//TD 66396 - Remove Notes and Request Proof of Insurance from the policy dropdown
			//TD 72674, 72677 - Adding Notes as per FR in policy dropdown
			if(action == 'Notes' && ((policyState != 'NJ' && !isEmployee() && !isIndependentAgentLogin() && lob == 'HO') 
			|| (policyState != 'NJ' && !isEmployee() && !isIndependentAgentLogin() && lob == 'PCAT') 
			|| (lob == 'PCAT' && isIndependentAgentLogin())
			|| ((policyState == 'NJ' || policyState == 'PA') && isTeachersPolicyNumber(policyNumber) && isIndependentAgentLogin())						 
			|| (lob == 'HO' && isIndependentAgentLogin()))) {
			
				//skip generation of Notes flyout 
			}else if(action == 'Request Proof of Insurance' && (policyState == 'PA' && lob == 'HO' || lob == 'PCAT')){
				//skip generation of Request Proof of Insurance dropdown
			}else if(action == 'Endorsement' && (policyState == 'PA' && lob == 'HO') && !isHomeRentersEndrRollout()){
				//skip generation of Endorsement dropdown
			}else{
				var methodParams = "'" + rowId  + "','" + encodeURI(action) + "'";
				
				strURL = "javascript:submitPolicyActionForm("+methodParams+");";
			
				if(!hideInqAction(action)){
					var inqLink = InquiryActionLinkEnum[action];
					if(enablePolicyAction(action, policyRecord)){
						strHTML = strHTML + "<li class=\"menuItem\"><a href=\"" + strURL + "\">" + inqLink + "</a></li>";
					}else{
						strHTML = strHTML + "<li class=\"menuItemDisabled\">" + inqLink + "</li>";
					}
				}
			}
		});
		
		strHTML = strHTML + "</ul>";
	}
	return strHTML;
}

function enableIDCardLink(policyRecord) {
	
	if(!isIDCardsRollout()) {
		return false;
	}
	
	var status = policyRecord.policyStatus;
	if (status == InquiryPolicyStatus.REJECTED || status == InquiryPolicyStatus.INCOMPLETE || status ==  InquiryPolicyStatus.CANCELED ||
			status ==  InquiryPolicyStatus.EXPIRED) {
		return false;
	}

	//MAIP and Twin Lights are out of scope.
	if(isMAIPPolicy(policyRecord)) {
		return false;
	}
	
	// Enable only for PPA policies.
	if (!(policyRecord.lob.toUpperCase() == "PA" || policyRecord.lob.toUpperCase() == "ALN_PA")){
		return false;
	}
	
	// NE legacy is out of scope.
	if(policyRecord.dataSource == DataSourceEnum.LEGACY && 
			(policyRecord.state == "MA" || policyRecord.state == "CT" || policyRecord.state == "NH")) {
		return false;
	}

	return true;
}
