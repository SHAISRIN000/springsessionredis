var arrowUpClass = "arrow-up";
var arrowDownClass = "arrow-down";

$(document)
		.ready(
				function() {
						
					var alertsGridData = $("#txLandingPagedefaultgrid").val();
					
					//txPolicy
					var txAlertType=$("#txAlertType").val();
					if(txAlertType=="txPolicy"){
						  var errorCode =  $("#tpServiceFail").val();
						  $("#errorMessage").hide();
						  if(errorCode==null || errorCode =="")
						  {
							  $("#errorMessage").hide();
						  }
						  else
						  {
							  $("#errorMessage").show();
						   }
						txPolicyGridTrigger(alertsGridData);
					}
					
				});

function getMorPolicyeRecords() {
	var currentPage = $("#currentPage").val();
	currentPage=1+parseInt(currentPage);
	$("#currentPage").val(currentPage);
	var rows = $('#policygrid').getGridParam('rowNum') ;
	var sortCol = $('#policygrid').jqGrid('getGridParam', 'sortname');
	var sortOrder = $('#policygrid').jqGrid('getGridParam', 'sortorder');
	var strUrl = generateSearchStringURL();
	
	strUrl = strUrl + "&rows="+rows+"&page="+currentPage;
	$("#policygrid").GridUnload();
	getPolicyGridJsonData(strUrl);
}


function generateSearchStringURLForPolicy() {
	var txRepType = $("#alertType").val();
	var producer = $("#producer").val();
	var actionDateFrom = $("#effDateFrom_Quote").val();
	var actionDateTo = $("#effDateTo_Quote").val();
	var urlStr ="/aiui/txAlerts/getTxAlerts?type="+type+"&producer="+producer+"&actionDateFrom="+actionDateFrom+"&actionDateTo="+actionDateTo;
	return urlStr;
}

/**
 * display Policy Grid data.
 * @param data
 */

function txPolicyGridTrigger(data) {

if(typeof data=='string'){
	data=JSON.parse(data)
}
	$('#policygrid').jqGrid(
			{
				datatype : 'local',
				colNames : [ 'Name', 'Policy #',
						'Transaction Type', 'Status', 'Process Date',
						'Effective Date','Current Premium', 'Policy LOB', 'New Business Source', 'Endorsement Source', 'Policy Transaction Type' ,'Cancellation Reason', 'Original FullTerm Premium', 'Transaction Sequence Number', 'Company Name', ' Transaction State', 'Policy Effective Date', ' Data Source',
						'Policy Exp Date' ],
				colModel : [ {
					name : 'clientName',
					classes : 'policyName',
					
					formatter : policyTabNameFormater,
					sortable : true,
					sorttype : function(cell, obj) {
						
						return obj.clientName ;
					},
					width : 160
					/*align : "center"*/
				},

				{
					name : 'policyNumber',
					classes : 'policyNumber',
					formatter: policyNumFormaterForPolicy,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.policyNumber;
					},
					width : 150
				},

				{
					name : 'policyTransactionType',
					sortable : true,
				//	formatter: policyTransactionTypeFormatter,
					sorttype : function(cell, obj) {
						return obj.policyTransactionType;
					},
					/*align : "center",*/
					width : 180
				}, {
					name : 'status',
					
					formatter : policyStatusFormatter,
					sortable : true,
					sorttype:function(cell, obj) {
						return obj.status;
					},
					/*align : "left",*/
					width : 190
				},
				
				{
					name : 'policyProcessDate',
					sortable : true,
					sorttype : function(cell, obj) {
						return new Date(obj.policyProcessDate);
					},
					/*align : "center",*/
					width : 67
				},

				{
					name : 'transactionEffDt',
					sortable : true,
					formatter : policyEffectiveDateFormatter,
					sorttype : function(cell, obj) {
						return new Date(obj.policyEffDate);
					},
					/*align : "center",*/
					width : 67
				},
				
				{
				name : 'premiumChange',
				formatter : currentPremiumForPolicyFormatter,
				sortable : true,
				sorttype:"int",
				align : "right",
				width : 105
				},
				
				{
					name : 'policyLOB',
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
					name : 'policyTransactionType',
					hidden : true
				},
				{
					name : 'cancellationReason',
					hidden : true
				}
				,
				{
					name : 'originalPremium',
					hidden : true
				},
				
				{
					name : 'transactionSeqNo',
					hidden : true
				},
				{
					name : 'companyName',
					hidden : true
				},
				{
					name : 'transactionState',
					hidden : true
				},
				{
					name : 'policyEffDate',
					hidden : true
				},
				{
					name : 'dataSource',
					hidden : true
				},
				{
					name : 'policyExpDate',
					hidden : true
				}
				

				],

				beforeRequest : function() {
					showLoadingMsg();
				},

				loadComplete : function(data) {
					var numOfRecordsFound = $('#numOfRecordsFound').text();
					var rows = $('#policygrid')[0].rows.length;
					if(numOfRecordsFound <= rows-1) {
						$('.policyMoreRes').hide();
					}else{
						$('.policyMoreRes').show();
					} 
					var sortCol = $('#policygrid').jqGrid('getGridParam', 'sortname');
					var sortOrder = $('#policygrid').jqGrid('getGridParam', 'sortorder');
					var count = $('#numOfRecordsFound').text();

					sortAQGridTR(sortCol, sortOrder, count);
												
					$.unblockUI();

				},

				gridComplete : function() {
					displayGridViewPolicy();
				},

				data:data,
				loadonce:true,
				sortable:true,
				multiSort:true,
			    gridview:false,
			    treeGrid:false,
			    hoverrows:false,
			    rowNum:data.length,
		        height:'100%',
		        ignoreCase:true,
		        rownumbers:false,
	            viewrecords:true,
			    scroll:false,
		        scrollOffset:0,
		        scrollrows:false,
			    shrinkToFit:false,
			    multiselect:false, 
			    subGrid:false,
			    altRows:true,
			    altclass:'altRows',

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
					total : 'total',
					records : 'recordCount',
					repeatitems : false,
					cell : 'cell',
					id : 'id'
				}

			});
}


function sortColumnPolicy(col){
//alert(col);
	
	var sortCol = $('#policygrid').jqGrid('getGridParam','sortname'); 
	var sort = $('#policygrid').jqGrid('getGridParam','sortorder');
	
	if ((sortCol.toUpperCase() != col.toUpperCase()) ||(sortCol.toUpperCase() == col.toUpperCase() && sort.toUpperCase() == "ASC")) {
		sort = "desc";
	} else {
		sort = "asc";
	}
	// reload grid without calling service
	$('#policygrid').jqGrid('setGridParam',{sortname:col, sortorder:sort, datatype: 'local'}).trigger('reloadGrid');
}

function policyNumFormaterForPolicy(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var policyNumber = rowObject.policyNumber;
	var lob = rowObject.policyLOB;
	var company = rowObject.companyName;
	var state = rowObject.transactionState;
	var effectiveDate = rowObject.policyEffDate;
	var expirationDate = rowObject.policyExpDate;
	var transactionType = rowObject.policyTransactionType;
	var transactionSeqNo = policySeqFormatterForPolicy(cellValue, options, rowObject);
	var action = 'Inquiry';
		
	var parms = "'" + rowId  + "','" + action + "'";
		
		var	strHTML = "<a href=\"javascript:submitPolicyActionForm(" + parms + ")\">";
	    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" +policyNumber+transactionSeqNo+"</span></a>";
	    strHTML = strHTML +	"<span id=\"actionsArrow_" +  rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
		strHTML = strHTML + "<div id=\"actionsList_" +  rowId + "\" class=\"actionsFlyout\"></div>";
		return strHTML;
	
}

function policyEffectiveDateFormatter(cellValue, options, rowObject)
{
	var transType=rowObject.policyTransactionType;
	var effDate;
	if(transType.indexOf("New Business Submissions")!=-1 || transType.indexOf("Renewals")!=-1)
		{
		effDate  = "N/A";
		}
	else 
		{
		effDate=rowObject.transactionEffDt;
		}
	return effDate;
}

function displayGridViewPolicy()
{
	$('.sortColIcon').hide();
	
	if(!($.browser.msie  && parseInt($.browser.version, 10) === 8)){
		$('#policygrid tr:last-child td:first-child').addClass('roundBottomLeft');
		$('#policygrid tr:last-child td:visible:last').addClass('roundBottomRight');
	}
	$('#policygrid tbody:first-child tr:last-child td').addClass('gridBottomBorder');
	$('#policygrid').unbind('contextmenu');
}