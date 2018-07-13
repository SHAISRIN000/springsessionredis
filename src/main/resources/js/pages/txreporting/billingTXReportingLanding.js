$(document)
		.ready(
				function() {

					var billingGridData  = 	$("#billingTXLandingPage").val();
					
					if (typeof billingGridData !== "undefined") {
						// for Transaction Reporting billing grid
						var bills = $.parseJSON(billingGridData.replaceAll("%replaceSingleQuote%","'")).billings;
						if(typeof bills !="undefined" && bills!=undefined){
							txBillingGridTrigger(bills);
						}else{
							txBillingGridTrigger(JSON.parse(billingGridData));
						}
					} 
				});



/**
 * display Billing Grid data.
 * @param data
 */

function txBillingGridTrigger(data) {

	$('#billinggrid')
			.jqGrid(
					{
						datatype : 'local',
						colNames : [ 'Name', 'Contact Info', 'Home Phone Number', 'Work Phone Number', 'Email ID','Policy#', 'Transaction Seq#',
								'Transaction Type', 'Status', 'Process Date',
								'Action/Effective Date', 'Amount', 'Min Due', 'Balance', 'Transaction Date', 'Policy LOB', 'Noic Due Date',
								'Producer', 'Policy Eff Date', 'Policy Exp Date', 'Transaction State', 'Comm Type Desc', 'NewBusinessSource', 'EndorsementSource',
								'company', ' Data Source', 'state', ' Email Address', 'Work Phone Number' , ' Mobile Phone Number', 'Effective/Action Date'],
						colModel : [
								{
									name : 'clientName',
									classes : 'nameForBilling',
									formatter : nameFormaterForBilling,
									sortable : true,
									sorttype : function(cell, obj) {
										return obj.clientName;
									},
									width : 160
								},

								{
									name : 'commInfo',
									formatter : commFormaterForBilling,
									classes : 'contactInfoBilling',
									sortable : true,
									sorttype : function(cell, obj) {
										return obj.commInfo + ', ' + obj.workPhoneNumber + ', ' + obj.emailAddress ;
									},
									width : 115
								},
								{
									name : 'homePhoneNumber',
									hidden : true
								}, 
								{
									name : 'workPhoneNumber',
									hidden : true
								},
								{	name : 'emailAddress',
									hidden : true
								},
								{
									name : 'policyNumber',
									classes : 'policyNumber',
									formatter : policyNumFormaterForBilling,
									sortable : true,
									sorttype : function(cell, obj) {
										return obj.policyNumber;
									},
									width : 155
								},
								{
									name : 'transactionSeqNo',
									hidden : true
								},
								{
									name : 'transactionType',
									sortable : true,
									sorttype : 'text',
									width : 110
								}, {
									name : 'status',
									sortable : true,
									sorttype : 'text',
									width : 100
								},

								{
									name : 'processDate',
									formatoptions : {
										newformat : 'm/d/Y'
									},
									datefmt : 'm/d/Y',
									sortable : true,
									sorttype : function(cell, obj) {
										return new Date(obj.processDate);
									},
									editrules : {
										edithidden : true
									},
									/*align : "center",*/
									width : 70
								},

								{
									name : 'actionDate',
									formatoptions : {
										newformat : 'm/d/Y'
									},
									datefmt : 'm/d/Y',
									sortable : true,
									sorttype : function(cell, obj) {
										return obj.actionDate;
									},
									editrules : {
										edithidden : true
									},
									/*align : "center",*/
									width : 70
								},
								
								{
									name : 'totalAmt',
									formatter : amountFormatterForBilling,
									sortable : true,
									sorttype : function(cell, obj) {
										return obj.totalAmt;
									},
									align : "right",
									width : 140
								},
								
								{
									name : 'minDue',
									hidden : true
								}, {
									name : 'balance',
									hidden : true
								},
								
								{
									name : 'transactionDate',
									hidden : true
								},
								
								{
									name : 'policyLOB',
									hidden : true
								},
								
								{
									name : 'noicDueDate',
									hidden : true
								},
								
								{
									name : 'producer',
									hidden : true
								},
								
								{
									name : 'policyEffDate',
									hidden : true
								},
								
								{
									name : 'policyExpDate',
									hidden : true
								},
								
								{
									name : 'transactionState',
									hidden : true
								},
								
								{
									name : 'commTypeDesc',
									hidden : true
								},
								
								{
									name : 'newBusinessSource',
									hidden : true
								},
								
								{
									name : 'endorsementSource',
									hidden : true
								},
								
								{
									name : 'company',
									hidden : true
								},
								
								{
									name : 'dataSource',
									hidden : true
								},
								
								{
									name : 'state',
									hidden : true
								},
								
								{
									name : 'emailAddress',
									hidden : true
								},
								
								{
									name : 'workPhoneNumber',
									hidden : true
								},
								
								{
									name : 'mobilePhoneNumber',
									hidden : true
								},
								
								{
									name : 'effectiveDate',
									hidden : true
								}

						],

						beforeRequest : function() {
							showLoadingMsg();
						},

						loadComplete : function(data) {
							
							//For hiding "more" when all records displayed
							var numOfRecordsFound = $('#numOfRecordsFound').text();
							var rows = $('#billinggrid')[0].rows.length;
							if(numOfRecordsFound <= rows-1) {
								$('.more').hide();
							}else{
								$('.more').show();
							} 
							var sortCol = $('#billinggrid').jqGrid('getGridParam', 'sortname');
							var sortOrder = $('#billinggrid').jqGrid('getGridParam', 'sortorder');
							var count = $('#numOfRecordsFound').text();

							sortAQGridTR(sortCol, sortOrder, count);
														
							$.unblockUI();

						},

						gridComplete : function() {
							displayBillingGridView();
						},

						data : data,
						gridview : true,
						treeGrid : false,
						hoverrows : false,
						rowNum : data.length,
						height : '100%',
						ignoreCase : true,
						rownumbers : false,
						viewrecords : true,
						scroll : false,
						scrollOffset : 0,
						scrollrows : false,
						shrinkToFit : false,
						multiselect : false,
						subGrid : false,
						altRows : true,
						altclass : 'altRows', 

						beforeSelectRow : function(e) {
							return false;
						},

						loadError : function(xhr, st, err) {
							$.unblockUI();
							showAQSvcError();

						},

						jsonReader : {
							root : 'rows',
							page : 'page',
							total : 'total'
						}

					});
}

function policyNumFormaterForBilling(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var policyNumber = rowObject.policyNumber;
	var status = rowObject.status;
	var action = 'Inquiry';
	/*var policyKey = rowObject.policyKey;*/
	/*var dataSource = rowObject.dataSource;*/
	var lob = rowObject.policyLOB;
	/*var channelCD = rowObject.channelCD;*/
	var company = rowObject.company;
	var state = rowObject.state;
	var effectiveDate = rowObject.policyEffDate;
	var expirationDate = rowObject.policyExpDate;
	/*var term = rowObject.term;*/
	var transactionType = rowObject.transactionType;
	/*var uwCompany = rowObject.uwCompany;*/
	var transactionSeqNo = policySeqFormatterForBilling(cellValue, options, rowObject);
	
		var parms = "'" + rowId  + "','" + action + "'";
		
		var	strHTML = "<a href=\"javascript:submitPolicyActionForm(" + parms + ")\">";
	    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" +policyNumber+transactionSeqNo+"</span></a>";
	    strHTML = strHTML +	"<span id=\"actionsArrow_" +  rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
		strHTML = strHTML + "<div id=\"actionsList_" +  rowId + "\" class=\"actionsFlyout\"></div>";
		return strHTML;
} 

//MouseEnter MouseLeave actions on grid row for claims grid
/*$("td.nameForBilling").live({
		mouseenter: function(e){
			var trRow = $(this).parent();
			var rowId = $(trRow).attr('id');
			genAddInfoForBilling(rowId);
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		},
		mouseleave: function(e){
			var trRow = $(this).parent();
			var rowId = $(trRow).attr('id');
			hideAddInfo(rowId);
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		}
	});*/

$(document)
	.on("mouseenter", "td.nameForBilling", function(e) {
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		genAddInfoForBilling(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	})
	.on("mouseleave", "td.nameForBilling", function(e) {
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		hideAddInfo(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

function policySeqFormatterForBilling(cellValue, options, rowObject)
{
	var sequenceNuber= rowObject.transactionSeqNo;
	if(sequenceNuber == null || sequenceNuber == "" || typeof sequenceNuber == 'undefined'){
	result = "";
	}else{
		result = "- "+sequenceNuber;
	}
	return result;
} 

function genAddInfoForBilling(rowId){
	var allPolicyRecord = new PolicyRecordForBilling(rowId);

	var strHTML = "<ul id=\"addInfoList\" class=\"noBullets\">";
	strHTML = strHTML + "<li><span class=\"infoLabel\">LOB:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allPolicyRecord.lob) + "</span></li>";
	
	strHTML = strHTML + "<li><br><span class=\"infoLabel\">Policy\<br>\Effective Date:</span><span class=\"infoValue\">" 
	+ checkEffDate(allPolicyRecord.effectiveDate) + "</span></li>";
	
	strHTML = strHTML + "<li><br><span class=\"infoLabel\">Transaction\<br>\Source:</span><span class=\"infoValue\">" 
	+ checkAddInfoValue(allPolicyRecord.source) + "</span></li>";
	
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

function PolicyRecordForBilling(rowId) {
	this.row = jQuery('#'+findGridId()).getRowData(rowId);
	this.policyNumber = $(this.row.policyNumber).text().substring(0,14);  
	/*this.policyStatus = this.row.status;*/
	this.lob = this.row.policyLOB;
	/*this.company = this.row.company;*/
	/*this.term = this.row.term;*/
	this.effectiveDate = this.row.policyEffDate;
	this.expirationDate = this.row.policyExpDate;
	/*this.uwCompany = this.row.uwCompany;*/
	/*this.channelCD = this.row.channelCD;*/
	this.rowId = rowId;
	/*this.processDate = this.row.processDate;
	this.actionDate = this.row.actionDate;
	this.state = this.row.state;*/
	this.source = this.row.newBusinessSource;
	/*this.agencyHierarchyID = this.row.agencyHierarchyID;*/
}

function nameFormaterForBilling(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var name = policyHolderNameTR(rowObject.clientName);
	var strHTML = "<div id=\"addInfo_" + rowId + "\" class=\"smallInfoIcon addInfo\"></div>";
	strHTML = strHTML +	"<span class=\"appName\">" + name+ "</span>";
	
	return strHTML;
}

function amountFormatterForBilling(cellValue, options, rowObject){
	var transType = rowObject.transactionType;
	var amountInfo = "";
	
	if(transType.trim() == "Pending Non-Pay Cancel Notice"){	
		if(cellValue != "" && cellValue != null && cellValue != undefined && typeof cellValue!="undefined" && cellValue!=0) {
			amountInfo = "Minimum Due: " + moneyFormatterForBilling(cellValue);
		}else{
			amountInfo = "Minimum Due: "+ "$0";
		}
	}else{
		if(cellValue != "" && cellValue != null && cellValue != undefined && typeof cellValue!="undefined" && cellValue!=0) {
			amountInfo = moneyFormatterForBilling(cellValue);
	    }else{
	    	amountInfo = "$0";
	    }
	}	
	return amountInfo;
}

function commFormaterForBilling(cellValue, options, rowObject){
	var rowId = options.rowId;
	var commInformation = rowObject.commInfo; // For Home Phone Number
	var emailAddress = rowObject.emailAddress;
	var workPhoneNum  = rowObject.workPhoneNumber;
	var cellPhoneNum = rowObject.mobilePhoneNumber;
	var result = "";
	
	if(commInformation != "" && cellValue != null && cellValue != undefined && typeof cellValue!="undefined") {
		result = "H : "+rowObject.commInfo;
	}
	
	if(workPhoneNum != "" && workPhoneNum != null && workPhoneNum != undefined && typeof workPhoneNum!="undefined") {
		  if(result != ""){
			  result = result + "<br>";
		    }
		  result = result + "W : "+workPhoneNum;
	}
	  
	  if(cellPhoneNum != "" && cellPhoneNum != null && cellPhoneNum != undefined && typeof workPhoneNum!="undefined") {
		  if(result != ""){
			  result = result + "<br>";
		    }
		  result = result + "M : "+cellPhoneNum;
	}

	  if(emailAddress != "" && emailAddress != null && emailAddress != undefined && typeof workPhoneNum!="undefined") {
		  var recipient = "mailto:"+emailAddress;
		  var strHTML =  "<a href=\"" +recipient+ "\">";
		    strHTML = strHTML + "<span id=\"emailIDInAlerts" + rowId + "\">"+emailAddress+"</span></a>";
		    if(result != ""){
		    	result = result + "<br>";
		    }
		    result = result +strHTML; 
	  }
	  
	  if(result == ""){
		  result = "Unavailable";
	  }
	return result;
}

function moneyFormatterForBilling(cellValue){
	var charIndxPos = cellValue.indexOf(".");
	if(charIndxPos > -1){
		cellValue = "$" + numberWithCommas($.trim(cellValue));
	}
	return cellValue;
}

function displayBillingGridView() {
	
	$('.sortColIcon').hide();
	
	if (!($.browser.msie && parseInt($.browser.version, 10) === 8)) {
		$("#billinggrid tr:last-child td:first-child").addClass("roundBottomLeft");
		$("#billinggrid tr:last-child td:visible:last").addClass("roundBottomRight")
	}
	$("#billinggrid tbody:first-child tr:last-child td").addClass("gridBottomBorder");
	$("#billinggrid").unbind("contextmenu")
}

function individualCountForBillingTXType(dropdownRecordsCount){
	var typeAllCheck=true;
	  var typeCheckedList="";
	  if(!$("#ddcl-alertType-i0").is(':checked'))
		  typeAllCheck=false;
	  
	  var typeObj=$('#alertType option');
	  var countOfType = '';
	  
	  for(itr = 1 ; itr <= 13 ; itr++){
		  
		  switch(itr) {
		    case 1:
		    	countOfType = 'Pending Non-Pay Cancel Notice';
		        break;
		    case 2:
		    	countOfType = 'Late Fee';
		        break;
		    case 3:
		    	countOfType = 'End Reapply';
		    	break;
		    case 4:
		    	countOfType = 'Cancellation';
		        break;
		    case 5:
		    	countOfType = 'Endorsement';
		    	break;
		    case 6:
		    	countOfType = 'New Business';
		        break;
		    case 7:
		    	countOfType = 'Pay Plan Change';
		        break;
		    case 8:
		    	countOfType = 'Renewal';
		    	break;
		    case 9:
		    	countOfType = 'Rescind';
		    	break;
		    case 10:
		    	countOfType = 'Service Fee';
		        break;
		    case 11:
		    	countOfType = 'Reinstate';
		        break;
		    case 12:
		    	countOfType = 'Reinstate with Lapse-Same Term';
		        break;
		    case 13:
		    	countOfType = 'OOS Endorsement';
		    	break;
		}
		  
		 
		  
		var typeCount =  dropdownRecordsCount[ countOfType ];
		if(typeCount == undefined || typeCount == 'undefined' || typeCount == null){
			typeCount = 0
		}
		  var count = $("#ddcl-alertType-i"+itr).parent().children("label").html();
		  count=substringData(count,typeCount)
		  $("#ddcl-alertType-i"+itr).parent().children("label").html(count);
		  $(typeObj[1]).text(count);
		  if($("#ddcl-alertType-i"+itr).is(':checked') && !typeAllCheck){
			  typeCheckedList+=count+" "
		  }
	  }
	  if(typeAllCheck)
		  typeCheckedList="All Billing Transactions";
	  
	  $("#ddcl-alertType").children().children(".ui-dropdownchecklist-headertext").html(typeCheckedList);
}