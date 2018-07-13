$(document)
		.ready(
				function() {
					
					
					// Making active tab white
					var tabs = $( "#tabPanel" );
					if (tabs != null && tabs.length > 0) {
					                var tabItems = $('#tabPanel ul li');

					                /** Select the current tab - Note that attempting to select the tab -
					                                as in the commented out code below -  does not work, 
					                                as there is no actual href attached to the tab
					                **/

					                tabItems.removeClass('activeTab').addClass('visitedTab');
					                var li = $('#tabPanel ul li#' +$("#tabSelected").val());
					                li.addClass('activeTab').removeClass('visitedTab');
					}


					// Apply Button common call for TR/DOC Search
						$('.getData').click(function() {
								if(findGridId() == "claimsGrid"){
									if(!errorCheckerForTR()){
										var urlString =	generateSearchStringURL();
										if(typeof urlString !== "undefined"){
											getGridJsonDataForTR(urlString);
										}
									}
								}else if(findGridId() == "billinggrid"){
									if(!errorCheckerForTR()){
										var urlString =	generateSearchStringURL();
										if(typeof urlString !== "undefined"){
											getGridJsonDataForTR(urlString);
										}
									}
								}
							
						});

						
						// More Button common call for TR/DOC Search
						$('.more').click(function() {
								var rows = ($('#'+findGridId())[0].rows.length-1);
								var search = "false";
								var urlString =	generateSearchStringURL();
								var urlString = urlString+"&rows="+rows+"&_search="+search;
								
								if(typeof urlString !== "undefined"){
									if(findGridId() == "docsearchgrid"){
									   storeCheckedDocuments();
									}
									getGridJsonDataForTR(urlString);
								}
							
						});
						
						// ExportXLS Event common for TR/DOC Search
						$("#exportXlsxBtnTxReporting").bind("click", function(){
							var activeGrid = findGridId();
							
							if(activeGrid == "claimsGrid"){
								urlForExport = "/aiui/ClaimsTXReporting/generateClaimsTxnReports";
							}else if(activeGrid == "billinggrid"){
								urlForExport = "/aiui/billingTxReporting/generateBillingTxnReports";
							}else if(activeGrid == "policygrid"){
								urlForExport = "/aiui/txPolicy/generatePolicyTxnReports";
							}
							
							var xhr = new XMLHttpRequest();
							
							xhr.open('POST', urlForExport, true);
							xhr.responseType = 'arraybuffer';
							xhr.onload = function () {
								if (this.status === 200) {
									var URL, downloadUrl, w;
									var filename = "";
							
									hideLoadingMsg();
								 
									var disposition = xhr.getResponseHeader('Content-Disposition');
								    if (disposition && disposition.indexOf('attachment') !== -1) {
								    	var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
								    	var matches = filenameRegex.exec(disposition);
								    	if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
								    }
								    var type = xhr.getResponseHeader('Content-Type');
							
								    var blob = new Blob([this.response], { type: type });
								    if (typeof window.navigator.msSaveBlob !== 'undefined') {
								    	// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. 
								    	// These URLs will no longer resolve as the data backing the URL has been freed."
								    	window.navigator.msSaveBlob(blob, filename);
								    } else {
								    	URL = window.URL || window.webkitURL;
								    	downloadUrl = URL.createObjectURL(blob);
							
								    	if (filename) {
								    		// use HTML5 a[download] attribute to specify filename
								    		var a = document.createElement("a");
								    		// safari doesn't support this yet
								    		if (typeof a.download === 'undefined') {
								    			window.location = downloadUrl;
								    		} else {
								    			a.href = downloadUrl;
								    			a.download = filename;
								    			document.body.appendChild(a);
								    			a.click();
								    		}
								    	} else {
								             if(printFile()){
								            	w = window.open(downloadUrl, name='_blank','width=600,height=800, resizable, status=0, toolbar=0, titlebar=0, menubar=0, location=0');
								            	w.focus();
								             }else{
								            	 window.location = downloadUrl;
								             } 
								    	}
							
								    	setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
								    }
								}
							 };
							 showLoadingMsg();
							 xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
							 xhr.send($("#frmTR").serialize());
							 event.preventDefault ? event.preventDefault() : event.returnValue = false;   
						});
						
						// Sort Event common for TR/DOC Search
						$('.sortColTR').click(function(){
							sortColumnTR(this.id);
						});
				});

/*Common to TXAlerts/TR/DocSearch*/
function findGridId(){
	var gridId = "grid";
	
	if($("#tabSelected").val() == 'txClaimsTab'){
		gridId = "claimsGrid";
	}else if($("#tabSelected").val() == 'txBilling'){
		gridId = "billinggrid";
	}
	else if($("#tabSelected").val() == 'txPolicy'){
		gridId = "policygrid";
	}else if($("#tabSelected").val() == 'txDocSearch'){
		gridId = "docsearchgrid";
	}
	return gridId;
}

//Common sort for TR/DocSearch
function sortAQGridTR(sortCol, sortOrder, count){
	var sortIcon;
	
	/*if(sortCol == ""){
		// sort has not been defined, set default sort column
		sortCol = "actionDate";
		sortIcon = $('#' + sortCol + '_icon');
		if(count > 0){
			$(sortIcon).removeClass(arrowUpClass).addClass(arrowDownClass).show();
		}else{
			$(sortIcon).hide();
		}
	}else{*/
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
		var $this = $("#"+findGridId());
        if ($this.jqGrid("getGridParam", "datatype") !== "local") {
        	setTimeout(function () {
                $this.trigger("reloadGrid");
            }, 10);
        }
	/*}*/}

/*Common to TXAlerts/TR/DocSearch*/
function generateSearchStringURL() {
	var txRepType = $("#alertType").val();
	var producer = $("#producer").val();
	var actionDateFrom = $("#effDateFrom_Quote").val();
	var actionDateTo = $("#effDateTo_Quote").val();
	var lineOfBusiness = $("#lob").val();
	var txSource = $("#transactionSource").val();
	var uwCompanyTR = $("#uwCompany").val();
	var gridId  = findGridId();
	
	var urlStr ="?txRepType="+txRepType+"&producer="+producer+"&actionDateFrom="+actionDateFrom+"&actionDateTo="+actionDateTo;
	var trURL = "&lineOfBusiness="+lineOfBusiness+"&txSource="+txSource+"&uwCompanyTR="+uwCompanyTR;
	
	// tR Claims
	if(gridId == "claimsGrid"){
		 urlStr ="/aiui/ClaimsTXReporting/getClaimsData"+urlStr+trURL;
	}else if(gridId == "billinggrid"){
		 urlStr ="/aiui/billingTxReporting/getBillingTxData"+urlStr+trURL;
	}else if(gridId == "policygrid"){
		 urlStr ="/aiui/txPolicy/getTxPolicy"+urlStr+trURL;
	}else if(gridId == "docsearchgrid"){
		 urlStr = generateDocumentSearchStringURL();
	}else{
		// txAlerts 
		urlStr = "/aiui/txAlerts/getTxAlerts"+urlStr;
	}
	
	return urlStr;
}

/*Common Ajax call to TR/DocSearch*/
function getGridJsonDataForTR(strUrl) {
	blockUI();
	var activeGrid = findGridId();
	
	$.ajax({
		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		},
		url : strUrl,
		type : 'GET',
		contentType : 'application/json; charset=utf-8',
		dataType : 'json',
		timeout : 30000,
		cache : false,
		success : function(data, textStatus, jqXHR) {
			
			$("#"+activeGrid).GridUnload();
			  
			if(activeGrid == "claimsGrid" && typeof data !== "undefined"){
				var recordFoundAsOfDayDate = data.recordsFoundAsOfDayDate; 
				var errorCode=data.errorMessage;
				$("#numOfRecordsFound").text(recordFoundAsOfDayDate.numOfRecordsFound);
				$("#latestInsertionDate").text(recordFoundAsOfDayDate.latestInsertionDate);
				
				 $("#claimsErrorMessage").hide();
				  if(errorCode==null)
				  {
					  $("#claimsErrorMessage").hide();
				  }
				  else
				  {
					  $("#claimsError").text(errorCode);
					  $("#claimsErrorMessage").show();
					  
				   }
				
				 $("#endRowNumber").text(data.endRowNo);
				 // individual count for claimsTR TransactionType
				individualCountForClaimsTXType(data.countsForClaimsTXType);
				txClaimsGridTrigger(JSON.parse(data.claimsTXSearchRecords));
			}else if(activeGrid == "billinggrid" && typeof data !== "undefined"){
				var numOfRecordsFound = data.noOfRecords; 
				var latestInsertionDate = data.latestInsertionDate;
				if(data.errormessage == null){
					$("#billingErrorMessage").hide();
				}
					
				$("#endRowNumber").text(data.endRowNo);
				$("#numOfRecordsFound").text(numOfRecordsFound);
				$("#latestInsertionDate").text(latestInsertionDate);
				
				individualCountForBillingTXType(data.billingTransactionTypeWithCount);
				txBillingGridTrigger(JSON.parse(data.billingTxnSearchRecords));
			}else if(activeGrid == "docsearchgrid" && typeof data !== "undefined"){
				$("#endRowNumber").text(data.endRowNo);
				$("#numOfRecordsFound").text(data.noOfRecords);
				$("#numTotalDocTypes").val(data.totalDocTypeWithCount);
				$("#latestInsertionDate").text(data.latestInsertionDate);
				$("#docSearchLandingPage").val(JSON.parse(data.documentSearchRecords));
				
				docSearchGridTrigger(JSON.parse(data.documentSearchRecords), JSON.stringify(data.docTypeWithCount));
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {

		},
		complete : function() {
			$.unblockUI();
		}
	});

};

/*Common to TR/DocSearch*/
function sortColumnTR(col){
	var gridId = findGridId();
	var sortCol = $('#'+gridId).jqGrid('getGridParam','sortname'); 
	var sort = $('#'+gridId).jqGrid('getGridParam','sortorder');
	
	if ((sortCol.toUpperCase() != col.toUpperCase()) ||(sortCol.toUpperCase() == col.toUpperCase() && sort.toUpperCase() == "ASC")) {
		sort = "desc";
	} else {
		sort = "asc";
	}
	
	// reload grid without calling service
	$('#'+gridId).jqGrid('setGridParam',{sortname:col, sortorder:sort, datatype: 'local'}).trigger('reloadGrid');
}

/*Common to TR*/
function trDateFormatter(cellValue)  { 
	var dtDate = new Date(cellValue);
	if(cellValue == null || cellValue == "" || typeof cellValue == 'undefined'){
        return 'N/A';
    }else if(!isNaN(dtDate.getFullYear()) && !isNaN(dtDate.getMonth()+1) && !isNaN(dtDate.getDate())){
		var lyear = dtDate.getFullYear();
		var lmonth=dtDate.getMonth()+1;
		 var ltoday=dtDate.getDate();
		 
		 if(lmonth <= 9) lmonth = "0" + lmonth;
		 if(ltoday <= 9) ltoday = "0" + ltoday;
		 
		 return lmonth+"/"+ltoday+"/"+lyear;
	}else{
		return 'Unavailable';
	}
}

//Search Header Edits
function errorCheckerForTR(){
	 var blnHasError = false;
	 var blnHasDateError = false;
	 var hasInValidDate = false;
	 var selDocType = $("#alertType").val() || "";
	 var selProducer = $("#producer").val() || "";
	 var selLOB = $("#lob").val() || "";
	 var selUWCompany = $("#uwCompany").val() || "";
	 var selTSource = $("#transactionSource").val() || "";
	 var selActionFromDate = $("#effDateFrom_Quote").val() || "";
	 var selActionToDate = $("#effDateTo_Quote").val() || "";
	 var docTypeEditMsg = "Please select a Type";
	 var producerEditMsg = "Please select a Producer";
	 var lobEditMsg = "Please select a LOB";
	 var uwCompanyEditMsg = "Please select a UW Company";
	 var dateEditMsg = "Cannot perform search more than 90 days from current date";
	 var inValidDateMsg = "Please enter a valid date range";
	 
	if($.trim(selDocType)==""){
		$('#typeError').css({"visibility" : "visible"});
		$("#alertType").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#typeError').css({"visibility" : "hidden"});
		$("#alertType").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selProducer)==""){
		$('#producerError').css({"visibility" : "visible"});
		$("#producer").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#producerError').css({"visibility" : "hidden"});
		$("#producer").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selLOB)==""){
		$('#lobError').css({"visibility" : "visible"});
		$("#lob").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#lobError').css({"visibility" : "hidden"});
		$("#lob").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selUWCompany)==""){
		$('#uwCompanyError').css({"visibility" : "visible"});
		$("#uwCompany").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#uwCompanyError').css({"visibility" : "hidden"});
		$("#uwCompany").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if(findGridId() != "claimsGrid"){
	if($.trim(selTSource)==""){
		$('#tsError').css({"visibility" : "visible"});
		$("#transactionSource").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#tsError').css({"visibility" : "hidden"});
		$("#transactionSource").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	}
	// Date range edits
	if(!isValidDateTR(selActionFromDate) || !isValidDateTR(selActionToDate) || !isValidDateBothDates(selActionFromDate,selActionToDate)){
		// see if both dates are valid and see if from date is greater than to date
		hasInValidDate = true;
		blnHasError = true;
	} else if(!isDateGreaterThanForTR(selActionFromDate, selActionToDate)){
		// other date rules
		blnHasDateError = true;
		blnHasError = true;
	}
	
	
	
	if(hasInValidDate){
		$(".actionDateAlerts").addClass("inlineError");
		$('#actionDateError').text(inValidDateMsg).css({"visibility" : "visible"});
		
	}else if(blnHasDateError){
		$(".actionDateAlerts").addClass("inlineError");
		$('#actionDateError').text(dateEditMsg).css({"visibility" : "visible"});
	}else{
		$(".actionDateAlerts").removeClass("inlineError");
		$('#actionDateError').text("").css({"visibility" : "hidden"});
	}
	
	return blnHasError;
}

function isDateGreaterThanForTR(fDate,tDate){
	var valid = true;
	
	var endTimeStamp = new Date(fDate).getTime() + (90 * 24 * 60 * 60 * 1000);
	var selectedDate = new Date(tDate).getTime();
	var selectedFromDate = new Date(fDate).getTime() ;
	var maxLimitTimeStamp = new Date().getTime() - (90 * 24 * 60 * 60 * 1000);
	
	if (endTimeStamp < selectedDate || selectedDate <= maxLimitTimeStamp || selectedFromDate < maxLimitTimeStamp) {
    // The selected time is greater than 90 days from now
		valid=false;
}
	return valid;
}
function isValidDateTR(dt){
	var dtDate = new Date(dt);
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;
	var valid = true;
	
	if(dtDate.toDateString() == "NaN") valid=false;
	if (!validformat.test(dt)) valid=false;
	if (new Date(dtDate).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) valid=false;
	if(!isValidDatDateFormat(dt)) valid=false;
	
	return valid;
	
}

function isValidDateBothDates(fDate, tDate){
var valid = true;
	
	var ToDate = new Date(tDate).getTime();
	var FromDate = new Date(fDate).getTime() ;
	
	if (FromDate > ToDate) {
    // From Date is greater than To date
		valid=false;
}
	return valid;
	
}
function policyHolderNameTR(clientName)  {
	
	 if(clientName == ""){
		 clientName = "Unavailable";
	  }	
	var name = clientName.toLowerCase();
	var arr = name.split(' ');
	var policyHolderName = "";
	
	// Removing extra spaces
	var arrNames = new Array();
	for(var i =0; i < arr.length; i++){
		if(arr[i] != ""){
			arrNames.push(arr[i]);
		}
	}
	
	if(arrNames.length == 3){
		policyHolderName = capitalizeFirstChar(arrNames[2]) + ", " + capitalizeFirstChar(arrNames[0]) + ' ' + capitalizeFirstChar(arrNames[1]);
	}else if(arrNames.length == 2){
		policyHolderName = capitalizeFirstChar(arrNames[1]) + ", " + capitalizeFirstChar(arrNames[0]);
	}else if(arrNames.length == 4){
		policyHolderName = capitalizeFirstChar(arrNames[3]) + ", " + capitalizeFirstChar(arrNames[0]) + ' ' + capitalizeFirstChar(arrNames[1]) + ' ' + capitalizeFirstChar(arrNames[2]);
	}else{
		policyHolderName = capitalizeFirstChar(arrNames[0]);
	}
	
	return "&nbsp;" + policyHolderName;
}