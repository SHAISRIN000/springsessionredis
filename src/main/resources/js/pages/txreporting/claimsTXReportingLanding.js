$(document)
		.ready(
				function() {
					

					var claimsGridData  = 	$("#claimsTXLandingPage").val();
					var errorCode =  $("#tpServiceFailForClaims").val();
					 
					  $("#claimsErrorMessage").hide();
					  if(errorCode==null || errorCode =="")
					  {
						  $("#claimsErrorMessage").hide();
					  }
					  else
					  {
						  $("#claimsErrorMessage").show();
					   }
					
					if (typeof claimsGridData !== "undefined") {
						// for Transaction Reporting claims grid
						txClaimsGridTrigger(JSON.parse(claimsGridData.replaceAll("%replaceSingleQuote%","'")));
					}
					
				});



/**
 * display Claims Grid data.
 * @param data
 */

function txClaimsGridTrigger(data) {

	$('#claimsGrid').jqGrid(
			{
				datatype : 'local',
				colNames : [ 'Name', 'Claim Number', 'Policy Number',
						'Transaction Type', 'Claim Description', 'Process Date',
						'Loss Date', 'Payment Information', 'PolicyKey', 'FirstName',
						'LastName', 'RowNumber', 'Voided', 'Owner', 'Source',
						'State', 'Term', 'Amount Paid', 'DataSource', 'Policy Effective Date',
						'PolicyStatus', 'lob', 'company', 'PNumber', 'channel',
						'uwCompany', 'transactionId', 'branchId', 'Agency Number',
						'emailId', 'producedId', 'Expiration Date' , 'Last Updated Date' , 'Policy Sequence Number'],
				colModel : [ {
					name : 'name',
					classes : 'nameForClaims',
					formatter : nameFormater,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.lastName + ' ' + obj.firstName;
					},
					sortable : true
				},

				{
					name : 'claimNumber',
					sortable : true,
					sorttype : 'text',
					width : 98
				},

				{
					name : 'policyNumber',
					classes : 'policyNumber',
					formatter :policyNumFormaterForClaims,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.policyNumber;
					},
					width : 150
				},

				{
					name : 'transactionType',
					sortable : true,
					sorttype : 'text',
					width : 100
				}, {
					name : 'claimType',
					sortable : true,
					sorttype : 'text',
					width : 150
				},

				{
					name : 'processDate',
					formatter : trDateFormatter,
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
					width : 70
				},

				{
					name : 'dateOfLoss',
					formatter : trDateFormatter,
					formatoptions : {
						newformat : 'm/d/Y'
					},
					datefmt : 'm/d/Y',
					sortable : true,
					sorttype : function(cell, obj) {
						return new Date(obj.dateOfLoss);
					},
					editrules : {
						edithidden : true
					},
					width : 70
				},

				{
					name : 'paymentInformation',
					formatter : paymentInfoFormater,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.paymentAmount;
					},
					sortable : true,
					width : 130
				},
				{
					name : 'policyKey',
					index : 'policyKey',
					hidden : true
				}, {
					name : 'firstName',
					index : 'firstName',
					hidden : true
				}, {
					name : 'lastName',
					index : 'lastName',
					hidden : true
				}, {
					name : 'rowNumber',
					index : 'rowNumber',
					hidden : true
				}, {
					name : 'checkStatus',
					index : 'checkStatus',
					hidden : true
				}, {
					name : 'owner',
					index : 'owner',
					hidden : true
				}, {
					name : 'source',
					index : 'source',
					hidden : true
				}, {
					name : 'state',
					index : 'state',
					hidden : true
				}, {
					name : 'term',
					hidden : true
				}, {
					name : 'paymentAmount',
					hidden : true
				}, {
					name : 'dataSource',
					index : 'dataSource',
					hidden : true
				}, {
					name : 'effectiveDate',
					index : 'effectiveDate',
					hidden : true
				}, {
					name : 'status',
					index : 'status',
					hidden : true
				}, {
					name : 'lob',
					index : 'lob',
					hidden : true
				}, {
					name : 'company',
					index : 'company',
					hidden : true
				}, {
					name : 'policyNumber',
					index : 'policyNumber',
					hidden : true
				}, {
					name : 'channel',
					index : 'channel',
					hidden : true
				}, {
					name : 'uwCompany',
					index : 'uwCompany',
					hidden : true
				}, {
					name : 'transactionId',
					index : 'transactionId',
					hidden : true
				}, {
					name : 'branchId',
					index : 'branchId',
					hidden : true
				}, {
					name : 'agencyNumber',
					hidden : true
				}, {
					name : 'emailId',
					index : 'emailId',
					hidden : true
				}, {
					name : 'producedId',
					index : 'producedId',
					hidden : true
				}, {
					name : 'expirationDate',
					hidden : true
				}, {
					name : 'lastUpdatedDate',
					hidden : true
				}, {
					name : 'polSeqNumber',
					hidden : true
				}

				],

				beforeRequest : function() {
					showLoadingMsg();
				},

				loadComplete : function() {
					//For hiding "more" when all records displayed
					var numOfRecordsFound = $('#numOfRecordsFound').text();
					var rows = $('#claimsGrid')[0].rows.length;
					 if(numOfRecordsFound <= rows-1) {
							$('.more').hide();
						}else{
							$('.more').show();
						} 
					 
					 //Sort when clicked on Search Header
			    var sortCol = $('#claimsGrid').jqGrid('getGridParam','sortname');
				var sortOrder = $('#claimsGrid').jqGrid('getGridParam','sortorder');
				var count = ($('#'+findGridId())[0].rows.length-1);
				
				sortAQGridTR(sortCol, sortOrder, count);
					$.unblockUI();
				},

				gridComplete : function() {
					displayGridViewForClaims();
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
				jsonReader: {
		            root: "rows",
		            page: "page",
		            total: "total"
		        }
		      

			});
}


function paymentInfoFormater(cellValue, options, rowObject){
	
	var rowId = options.rowId;
	var payAmount = rowObject.paymentAmount;
	var check_Status  = rowObject.checkStatus;
	var paymentInformation = "N/A";
	var result = "No";
	
	
	if(payAmount != "" && payAmount != null && payAmount != undefined) {
		payAmount = moneyFormatterForBilling(payAmount);
		paymentInformation = "Amount : "+payAmount+"<br>";
	}
	  if(check_Status != "" && check_Status != null && check_Status != undefined) {
		  if(check_Status.toUpperCase() == "VOIDED"){
			  result  = "Yes";
		  }
		  paymentInformation = paymentInformation + "Voided : "+result+"<br>";
	}
		
	return paymentInformation;
};

//MouseEnter MouseLeave actions on grid row for claims grid
/*$("td.nameForClaims").live({
		mouseenter: function(e){
			var trRow = $(this).parent();
			var rowId = $(trRow).attr('id');
			genAddInfoForClaims(rowId);
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
	.on("mouseenter", "td.nameForClaims", function(e) {
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		genAddInfoForClaims(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	})
	.on("mouseleave", "td.nameForClaims", function(e) {
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		hideAddInfo(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	});

function genAddInfoForClaims(rowId){
	var allPolicyRecord = new PolicyRecord(rowId);


	var strHTML = "<ul id=\"addInfoList\" class=\"noBullets\">";
	strHTML = strHTML + "<li><span class=\"infoLabel\">LOB:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allPolicyRecord.lob) + "</span></li>";
	strHTML = strHTML + "<li><br><span class=\"infoLabel\">Policy\<br>\Effective Date:</span><span class=\"infoValue\">" 
	+ checkEffDate(allPolicyRecord.effectiveDate) + "</span></li>";

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

function checkEffDate(effDate){
	if(!effDate == "" || !effDate == null){
		result = effDate;
	}else{
		result = "Unavailable";
	}
	
	return result;
}

function displayGridViewForClaims(){
	
	$('.sortColIcon').hide();
	
	// no need to apply rounded corners on IE8
	if(!($.browser.msie  && parseInt($.browser.version, 10) === 8)){
		$('#claimsGrid tr:last-child td:first-child').addClass('roundBottomLeft');
		$('#claimsGrid tr:last-child td:visible:last').addClass('roundBottomRight');
	}
	
	$('#claimsGrid tbody:first-child tr:last-child td').addClass('gridBottomBorder');
	$('#claimsGrid').unbind('contextmenu');
}
/**
 * This method is used for claimsTR Transaction Type dropdown 
 * @param dropdownRecordsCount
 */
function individualCountForClaimsTXType(dropdownRecordsCount){
	var typeAllCheck=true;
	  var typeCheckedList="";
	  if(!$("#ddcl-alertType-i0").is(':checked'))
		  typeAllCheck=false;
	
	  var typeObj=$('#alertType option');
	  var setupCount=$("#ddcl-alertType-i1").parent().children("label").html();
	  setupCount=substringData(setupCount,dropdownRecordsCount.setUpCount)
	  $("#ddcl-alertType-i1").parent().children("label").html(setupCount);
	  $(typeObj[1]).text(setupCount);
	  if($("#ddcl-alertType-i1").is(':checked') && !typeAllCheck){
		  typeCheckedList+=setupCount+" "
	  }
	  var paidCount=$("#ddcl-alertType-i2").parent().children("label").html();
	  paidCount=substringData(paidCount,dropdownRecordsCount.paidCount)
	  $("#ddcl-alertType-i2").parent().children("label").html(paidCount);
	  $(typeObj[2]).text(paidCount);
	  if($("#ddcl-alertType-i2").is(':checked') && !typeAllCheck){
		  typeCheckedList+=paidCount+" "
	  }
	  if(typeAllCheck)
		  typeCheckedList="All Claims Transactions";
	  
	  $("#ddcl-alertType").children().children(".ui-dropdownchecklist-headertext").html(typeCheckedList);
}

function policyNumFormaterForClaims(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var policyNumber = rowObject.policyNumber;
	var status = rowObject.status;
	var policyKey = rowObject.policyKey;
	var dataSource = rowObject.dataSource;
	var lob = rowObject.lob;
	var channelCD = rowObject.channelCD;
	var company = rowObject.company;
	var state = rowObject.state;
	var effectiveDate = rowObject.effectiveDate;
	var expirationDate = rowObject.expirationDate;
	var term = rowObject.term;
	var transactionType = rowObject.transactionType;
	var uwCompany = rowObject.uwCompany;
	var polSequenceNumber = policySeqFormatterForClaims(cellValue, options, rowObject);
	
	var action = "Inquiry"
	var parms = "'" + rowId  + "','" +action + "'";
		
		var	strHTML = "<a href=\"javascript:submitPolicyActionForm(" + parms + ")\">";
	    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" +policyNumber+polSequenceNumber+"</span></a>";
	    strHTML = strHTML +	"<span id=\"actionsArrow_" +  rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
		strHTML = strHTML + "<div id=\"actionsList_" +  rowId + "\" class=\"actionsFlyout\"></div>";
		return strHTML;
} 

function policySeqFormatterForClaims(cellValue, options, rowObject)
{
	var sequenceNuber= rowObject.polSeqNumber;
	if(sequenceNuber == null || sequenceNuber == "" || typeof sequenceNuber == 'undefined'){
	result = "";
	}else{
		result = "- "+sequenceNuber;
	}
	return result;
} 
