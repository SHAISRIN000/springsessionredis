var arrowUpClass = "arrow-up";
var arrowDownClass = "arrow-down";

$(document)
		.ready(
				function() {
					
					$('.navTab').click(function(){
						var altVal=$(this).attr("alt");
						$("#txAlertType").val(altVal);
						
						var strURL = "";
						generateDropDownForTxReporting();
						
						if(altVal=='txBilling'){
							strURL = "/aiui/billingTxReporting/billing";
						}else if(altVal=='txClaims'){
							strURL = "/aiui/ClaimsTXReporting/getClaims";	
						}
						else if(altVal=='txPolicy'){
							strURL = "/aiui/txPolicy/fetchTxPolicy";
						}else if(altVal=='txDocSearch'){
							strURL = "/aiui/documentSearch/fetchDocumentSearchResults";
						}else{
							strURL = "/aiui/txAlerts/getAlertsLanding";
						}
							
						document.txForm.action = strURL;
						document.txForm.method="POST";
						document.txForm.submit();
						
					 });
					
					 $(".reviewAll").click(function (e) {
                    	 //Select only checkboxes of class='alerts_ChkBox'
                    	 $( 'input.alerts_ChkBox' ).prop('checked', $(this).prop('checked'));
                    	 //Editing check boxes for client-side sorting
                    	$('input.alerts_ChkBox').each(function () {
                    		var elm = $(this).closest('tr');
                    		var rowId = $(elm).attr("id");
                    		setCheckedAlerts(rowId);
                    	});
                    	var isChecked = $(e.target).is(':checked');
                    	var reviewedAll = "true";
                    	var url = 'updateTxReview?reviewUpdater='+isChecked+'&reviewAll='+reviewedAll;
                    	updateReview(url);
                    	});
					 
					$('.errorChecker').change(function(){
						var tabSelected = findGridId();
						if(tabSelected == "grid"){
							// alerts tab
							//errorCheckerForAlerts();
						}else if(findGridId() == "claimsGrid"){
							// claims tab
							//errorCheckerForTR();
						}
						else if(findGridId() == "billinggrid"){
							errorCheckerForTR();
						}else if(findGridId() == "policygrid"){
							//errorCheckerForTR();
						}
					});
					
					// Disable "Review All" when navigating from "All Alerts" link 
					if($("#alertType").val()!= null){
					 if($("#tabSelected").val() == "txAlertAll" && $("#alertType").val().indexOf('TX_ALL_ALERTS') >= 0){
							$(".reviewAll").attr("disabled", true);
						}else{
							$(".reviewAll").attr("disabled", false);
						}
					}
					$(".multiCheckdropDown").dropdownchecklist({
						firstItemChecksAll : true,
						emptyText : "Select",
						icon: {placement: 'right', toOpen: 'iconOpen'},
						width : "162px"
					});
					
					$(".multiCheckdropDownTR").dropdownchecklist({
						firstItemChecksAll : true,
						emptyText : "Select",
						icon: {placement: 'right', toOpen: 'iconOpen'},
						width : "162px"
					});
					
					$('.sortColALert').click(function(){
						sortColumnForAlert(this.id);
					});
					$('.sortColPolicy').click(function(){
						sortColumnPolicy(this.id);
					});
					$("#exportXlsxBtn").bind("click", function(){
						var urlForExport ="/aiui/txAlerts/generateTxnAlertsReports";
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
					
					var alertsGridData = $("#txLandingPagedefaultgrid").val();
					
					var errorCode =  $("#tpServiceFailForAlerts").val();
					 
					  $("#txAlertErrorMessage").hide();
					  if(errorCode==null || errorCode =="")
					  {
						  $("#txAlertErrorMessage").hide();
					  }
					  else
					  {
						  $("#txAlertErrorMessage").show();
					   }
					
					if (typeof alertsGridData !== "undefined") {
						// for txAlerts grid
						txAlertGridTrigger(JSON.parse(alertsGridData));
						}
					
					$('#applyBtn').click(function() {
						if(!errorCheckerForAlerts()){
							$('#checkedAlerts').val('');
							$('#moreSelectedForAlerts').val('');
							$('#breadCrumbFlagCheckedAlerts').val('');
							$('#breadCrumbFlagUncheckedAlerts').val('');
							 var strUrl = generateSearchStringURL();
						 		getGridJsonData(strUrl);
						}
					});
					$('#applyPolicyBtn').click(function() {
					if(!errorCheckerForTR()){
						$("#currentPage").val(1);
						var strUrl = generateSearchStringURL();
					 		getPolicyGridJsonData(strUrl);
					}
					});
					// View more results link
					$('.moreRes').click(function() {
							getMoreRecords();
					});
					$('.policyMoreRes').click(function() {
							getMorPolicyeRecords();
						
					});
					
				});

function getMoreRecords() {
	var rows = $("#grid")[0].rows.length-1;
	var search = "false";
	var sortCol = $('#grid').jqGrid('getGridParam', 'sortname');
	var sortOrder = $('#grid').jqGrid('getGridParam', 'sortorder');
	var strUrl = generateSearchStringURL();
	var strUrl = strUrl+"&rows="+rows+"&_search="+search;
	if(typeof strUrl !== "undefined"){
		$('#breadCrumbFlagCheckedAlerts').val('');
		$('#breadCrumbFlagUncheckedAlerts').val('');
    storeCheckedAlerts();
	getGridJsonData(strUrl);
	}
}

function blockUI(){
	
	$
	.blockUI({
		message : "<img src='../../../aiui/resources/images/loading_icon.gif'/><br/>Loading...",
		css : {
			width : '100px',
			padding : '5px 2px',
			margin : '0 120px'
		}
	});
}

/*
 * Ajax call to send form data to controller(in details grid page, when user
 * clicks on Apply btn)
 */
function getGridJsonData(strUrl) {

	blockUI();

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
			  var errorCode=data.errorMessage;
			  var recordFoundAsOfDayDate = data.recordsFoundAsOfDayDate; 
			  var numOfRecordsFound = recordFoundAsOfDayDate.numOfRecordsFound; 
			  var latestInsertionDate = recordFoundAsOfDayDate.latestInsertionDate;
			 
			  $("#endRowNumber").text(data.endRowNo);
              $("#numOfRecordsFound").text(numOfRecordsFound);
			  $("#latestInsertionDate").text(latestInsertionDate);
			  $("#grid").GridUnload();
			  
			  $("#txAlertErrorMessage").hide();
			  if(errorCode==null)
			  {
				  $("#txAlertErrorMessage").hide();
			  }
			  else
			  {
				  $("#txAlertError").text(errorCode);
				  $("#txAlertErrorMessage").show();				  
			   }
			  
			  if(typeof data !== "undefined"){
				// individual count for claimsTR TransactionType
					individualCountForAlertType(data.countsForTXType);
				  txAlertGridTrigger(JSON.parse(data.txAlertSearchRecord));
					}			
			
			

		},
		error : function(jqXHR, textStatus, errorThrown) {

		},
		complete : function() {
			$.unblockUI();
		}
	});

};

function getPolicyGridJsonData(strUrl) {
	
	blockUI();

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
			  var recordFoundAsOfDayDate = data.recordsFoundAsOfDayDate; 
			  var numOfRecordsFound = recordFoundAsOfDayDate.numOfRecordsFound; 
			  var latestInsertionDate = recordFoundAsOfDayDate.latestInsertionDate;
			  var errorCode=data.errorMessage;	  
			  
			  $("#endRowNumber").text(data.endRowNo);
			  $("#numOfRecordsFound").text(numOfRecordsFound);
			  $("#latestInsertionDate").text(latestInsertionDate);
			  var dropdownRecordsCount = data.dropdownRecordsCount; 
			  var typeAllCheck=true;
			  var typeCheckedList="";
			  if(!$("#ddcl-alertType-i0").is(':checked'))
				  typeAllCheck=false;
			  
			  $("#errorMessage").hide();
			  if(errorCode==null)
			  {
				  $("#errorMessage").hide();
			  }
			  else
			  {
				  $("#errorMessage").text(errorCode);
				  
				  $("#errorMessage").show();				  
			   }
			  
			  var typeObj=$('#alertType option');
			  var newBusinessCount=$("#ddcl-alertType-i1").parent().children("label").html();
			  newBusinessCount=substringData(newBusinessCount,dropdownRecordsCount.newBusinessCount)
			  $("#ddcl-alertType-i1").parent().children("label").html(newBusinessCount);
			  if($("#ddcl-alertType-i1").is(':checked') && !typeAllCheck){
				  typeCheckedList+=newBusinessCount+" "
			  }
			  var creditCount=$("#ddcl-alertType-i2").parent().children("label").html();
			  creditCount=substringData(creditCount,dropdownRecordsCount.creditCount)
			  $("#ddcl-alertType-i2").parent().children("label").html(creditCount);
			  $(typeObj[2]).text(creditCount);
			  if($("#ddcl-alertType-i2").is(':checked') && !typeAllCheck){
				  typeCheckedList+=creditCount+" "
			  }
			  var reinstateCount=$("#ddcl-alertType-i3").parent().children("label").html();
			  reinstateCount=substringData(reinstateCount,dropdownRecordsCount.reinstateCount)
			  $("#ddcl-alertType-i3").parent().children("label").html(reinstateCount);
			  $(typeObj[3]).text(reinstateCount);
			  if($("#ddcl-alertType-i3").is(':checked') && !typeAllCheck){
				  typeCheckedList+=reinstateCount+" "
			  }
			  var reinWLapseCount=$("#ddcl-alertType-i4").parent().children("label").html();
			  reinWLapseCount=substringData(reinWLapseCount,dropdownRecordsCount.reinWLapseCount)
			  $("#ddcl-alertType-i4").parent().children("label").html(reinWLapseCount);
			  $(typeObj[4]).text(reinWLapseCount);
			  if($("#ddcl-alertType-i4").is(':checked') && !typeAllCheck){
				  typeCheckedList+=reinWLapseCount+" "
			  }
			  var cancelCount=$("#ddcl-alertType-i5").parent().children("label").html();
			  cancelCount=substringData(cancelCount,dropdownRecordsCount.cancelCount)
			  $("#ddcl-alertType-i5").parent().children("label").html(cancelCount);
			  $(typeObj[5]).text(cancelCount);
			  if($("#ddcl-alertType-i5").is(':checked') && !typeAllCheck){
				  typeCheckedList+=cancelCount+" "
			  }
			  var renewalCount=$("#ddcl-alertType-i6").parent().children("label").html();
			  renewalCount=substringData(renewalCount,dropdownRecordsCount.renewalCount)
			  $("#ddcl-alertType-i6").parent().children("label").html(renewalCount); 
			  $(typeObj[6]).text(renewalCount);
			  $("#policygrid").GridUnload();
			  if($("#ddcl-alertType-i6").is(':checked') && !typeAllCheck){
				  typeCheckedList+=renewalCount+" "
			  }
			  if(typeAllCheck)
				  typeCheckedList="ALL";
			  			  
			  $("#ddcl-alertType").children().children(".ui-dropdownchecklist-headertext").html(typeCheckedList);
			 	txPolicyGridTrigger(JSON.parse(data.txAlertSearchRecord));
		},
		error : function(jqXHR, textStatus, errorThrown) {

		},
		complete : function() {
			$.unblockUI();
		}
	});

};

function substringData(text,updateText){
	var _text="";
	 if(text.lastIndexOf("(")!=-1){
		  var endIndex=text.lastIndexOf("(");
		  _text=text.substring(0,endIndex); 
		  _text+=" ("+updateText+")";
		  
	  }
	 return _text;
}
/**
 * display Grid data.
 * 
 * @param data
 */
function txAlertGridTrigger(data) {
	$('#grid').jqGrid(
			{
				datatype : 'local',
				colNames : [ 'Name', 'Contact Info', 'Policy #',
						'Transaction Type', 'Status', 'Process Date',
						'Action Date', 'Reviewed CheckBox',  'FirstName',
						'LastName', 'RowNumber',  'Owner', 'Source',
						'State',  'Esignature', 
						 'lob', 'company',  'channel',
						'uwCompany', 'Transaction Id', 'Branch Id', 'Agency Id',
						'Email Address', 'Agency Hierarchy Id' , 'Work Phone Number' , 'Home Phone Number' , 'Minnimum Due' , 'Balance Due' , 
						'Producer CD' , 'Producer Hierarchy Id' , 'Branch CD' , 'Agency CD' , 'Middle Name' , 'Cancel Reason', 'Term' ,'Effective Date' , 'Expiration Date' , 
						'Policy Sequence Number','Data Souce','Reviewed Indicator' , 'Cell Phone Number'],
				colModel : [ {
					name : 'name',
					classes : 'applicantName',
					formatter : nameFormater,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.lastName +' ' + obj.firstName;
					},
					width : 155
				},

				{
					name : 'contactInfo',
					formatter : contactInfoFormater,
					classes : 'contactInfoAlerts',
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.homePhoneNumber + ', ' + obj.workPhoneNumber + ', ' + obj.emailAddress ;
					},
					width : 110
				},

				{
					name : 'policyNumber',
					classes : 'policyNumber',
					editable : true,
					formatter : policyNumFormater,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.policyNumber;
					},
					width : 150
				},

				{
					name : 'transactionType',
					formatter : txAlertTypeFormatter,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.transactionType;
					},
					width : 148
				}, {
					name : 'status',
					formatter : statusFormatterAlert,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.transactionType +','+ obj.minnimumDue;
					},
					/*align : "center",*/
					width : 138
				},

				{
					name : 'processDate',
					formatter : alertsDateFormatter,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.processDate;
					},
					width : 65
				},

				{
					name : 'actionDate',
					formatter : alertsDateFormatter,
					sortable : true,
					sorttype : function(cell, obj) {
						return obj.actionDate;
					},
					width : 65
				},

				{ // below column will contains checkbox.....
					name : 'reviewedCheckBox',
					classes : 'reviewClass',
					sortable : true,
					formatter: reviewedFormatter,
					width : 92,
					align : "center"
				},{
					name : 'firstName',
					hidden : true
				}, {
					name : 'lastName',
					hidden : true
				}, {
					name : 'rowNumber',
					hidden : true
				},  {
					name : 'owner',
					hidden : true
				}, {
					name : 'source',
					hidden : true
				}, {
					name : 'state',
					hidden : true
				}, {
					name : 'eSignatureStatus',
					hidden : true
				},  {
					name : 'lob',
					hidden : true
				}, {
					name : 'company',
					hidden : true
				}, {
					name : 'channelCD',
					hidden : true
				}, {
					name : 'uwCompany',
					hidden : true
				}, {
					name : 'transactionId',
					hidden : true
				}, {
					name : 'branchId',
					hidden : true
				}, {
					name : 'agencyId',
					hidden : true
				}, {
					name : 'emailAddress',
					hidden : true
				}, {
					name : 'agencyHierarchyID',
					hidden : true
				},
				{
					name : 'workPhoneNumber',
					hidden : true
				},
				{
					name : 'homePhoneNumber',
					hidden : true
				},
				{
					name : 'minnimumDue',
					hidden : true
				},
				{
					name : 'balanceDue',
					hidden : true
				},
				{
					name : 'producerCD',
					hidden : true
				},
				{
					name : 'producerHierarchyID',
					hidden : true
				},
				{
					name : 'branchCD',
					hidden : true
				},
				{
					name : 'agencyCD',
					hidden : true
				},
				{
			    	name : 'middleName',
				    hidden : true
				},
				{
					name : 'cancelReason',
					hidden : true
				},
				{
					name : 'term',
					hidden : true
				},
				{
					name : 'effectiveDate',
					hidden : true,
					formatter : alertsDateFormatter
				},
				{
					name : 'expirationDate',
					hidden : true,
					formatter : alertsDateFormatter
				},
				{
					name : 'policySeqNum',
					hidden : true,
				},
				{
					name : 'dataSource',
					hidden : true,
				},
				{
					name : 'reviewedInd',
					hidden : true,
				},
				{
					name : 'cellPhoneNumber',
					hidden : true,
				}

				],

				beforeRequest : function() {
					showLoadingMsg();
				},

				  loadComplete: function (data) {
	                var sortColAlert = $('#grid').jqGrid('getGridParam','sortname');
					var sortOrder = $('#grid').jqGrid('getGridParam','sortorder');
					var count = $('#numOfRecordsFound').text();
					
					sortAQGridForAlert(sortColAlert, sortOrder, count);
					
					//For hiding "more" when all records displayed
					var numOfRecordsFound = $('#numOfRecordsFound').text();
					var rows = $('#grid')[0].rows.length;
					 if(numOfRecordsFound <= rows-1) {
							$('#moreAlerts').hide();
						}else{
							$('#moreAlerts').show();
						} 
	                     $.unblockUI();
	                 },
	                
				gridComplete : function() {
					 displayAlertsGridView();
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

getColumnIndexByName = function (grid, columnName) {
    var cm = grid.jqGrid('getGridParam', 'colModel'), i, l;
    for (i = 0, l = cm.length; i < l; i += 1) {
        if (cm[i].name === columnName) {
            return i; // return the index
        }
    }
    return -1;
}

function getCellValue(content) {
	 var cell = jQuery('#' + rowId + '_' + cellId);        
	    var val = cell.val();
	    return val;
}



function generateURLForUpdateReview(id){
	//Setting check/uncheck the review checkbox client side
	setCheckedAlerts(id);
	
	var isChecked = $('#alertsChkBox_'+id).prop('checked');
    var userIDContent = $("#grid").getCell(id,"policyNumber"); 
    var txType = $("#grid").getCell(id,"transactionType");
   var reviewedPolicyNumber = $(userIDContent).text().substring(0,14);  
	var url = 'updateTxReview?reviewPolicyNumber='+reviewedPolicyNumber+'&reviewUpdater='+isChecked+'&txType='+txType;
	
	// for ajax call to update in db
         updateReview(url);
}

//Ajax call to send review updates to db.
function updateReview(url){
$.ajax({
	url : url,
	type : 'GET',
	contentType : 'application/json; charset=utf-8',
	timeout : 30000,
	cache : false,
	 dataType: "json",
	success : function(data, textStatus, jqXHR) {
		console.log(data);
	},
	error : function(jqXHR, textStatus, errorThrown) {

	}
});
}
function sortColumnForAlert(col){
	var sortCol = $('#grid').jqGrid('getGridParam','sortname'); 
	var sort = $('#grid').jqGrid('getGridParam','sortorder');
	
	if(col == "reviewedCheckBox"){
		col = "reviewedInd";
	}
	
	
		if ((sortCol.toUpperCase() != col.toUpperCase()) ||(sortCol.toUpperCase() == col.toUpperCase() && sort.toUpperCase() == "ASC")) {
			sort = "desc";
		} else {
			sort = "asc";
		}
		$('#checkedAlerts').val('');
		$('#moreSelectedForAlerts').val('');	
		$('#breadCrumbFlagCheckedAlerts').val('');
		$('#breadCrumbFlagUncheckedAlerts').val('');
	
		// reload grid without calling service
		$('#grid').jqGrid('setGridParam',{sortname:col, sortorder:sort, datatype: 'local'}).trigger('reloadGrid');
}


function sortAQGridForAlert(sortCol, sortOrder, count){
	var sortIcon;
	
	if(sortCol == ""){
		// sort has not been defined, set default sort column
	}else{
		// we already have sort defined
		if(sortCol == "reviewedInd"){
			sortIcon = $(".reviewedCheckBox_icon");
		}else{
			sortIcon = $('#' + sortCol + '_icon');
		}
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
	}}

function errorCheckerForAlerts(){
	
	 var hasError = false;
	 var selType = $("#alertType").val() || "";
	 var selProducer = $("#producer").val() || "";
	 var selActionDate = $("#effDateFrom_Quote").val() || "";
	 var selActionDateTo = $("#effDateTo_Quote").val() || "";
	 var dateEditMsg = "Not a valid date range";
	 var backDateMsg = "Cannot back date";
	 
	// Enable/Disable "Review All" when "All Alerts" is selected
		if(selType!=null && selType.indexOf('TX_ALL_ALERTS') > -1){
			$(".reviewAll").attr("disabled", true);
		}else{
			$(".reviewAll").attr("disabled", false);
		}
	 
	 if($.trim(selType)==""){
			$('#typeError').css({"visibility" : "visible"});
			$("#alertType").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			hasError = true;
		} else{
			$('#typeError').css({"visibility" : "hidden"});
			$("#alertType").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
		if($.trim(selProducer)==""){
			$('#producerError').css({"visibility" : "visible"});
			$("#producer").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
			hasError = true;
		} else{
			$('#producerError').css({"visibility" : "hidden"});
			$("#producer").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		}
		if($.trim(selActionDate)==""){
			$('#actionDateError').css({"visibility" : "visible"});
			$("#effDateFrom_Quote").addClass("inlineError");
			hasError = true;
		} else{
			$('#actionDateError').css({"visibility" : "hidden"});
			$("#effDateFrom_Quote").removeClass("inlineError");
		}
		if($.trim(selActionDateTo)==""){
			$('#actionDateToError').css({"visibility" : "visible"});
			$("#effDateTo_Quote").addClass("inlineError");
			hasError = true;
		} else{
			$('#actionDateToError').css({"visibility" : "hidden"});
			$("#effDateTo_Quote").removeClass("inlineError");
		}
		
		// Date range edits
		if(!isbackDate(selActionDate) || !isbackDate(selActionDateTo)){
			$('#actionDateError').text(backDateMsg).css({"visibility" : "visible"});
			$(".actionDateAlerts").addClass("inlineError");
			hasError = true;
		}else if (!isValidDateForAlerts(selActionDate) || !isValidDateForAlerts(selActionDateTo) || !isDateGreaterThanForAlerts(selActionDate, selActionDateTo)) {
			// see if both dates are valid
			$('#actionDateError').text(dateEditMsg).css({"visibility" : "visible"});
			$(".actionDateAlerts").addClass("inlineError");
			hasError = true;
		}else{
			$('#actionDateError').text("").css({"visibility" : "hidden"});
			$(".actionDateAlerts").removeClass("inlineError");
		}
     
     return hasError;
}

function generateDropDownForTxReporting(){
	var notValid = "";
	var hasDateError = false;
	
	// if user is navigating to or from doc search tab, call separate function to pass params - JG
	if($("#tabSelected").val() == 'txDocSearch' || $('#txAlertType').val() == 'txDocSearch'){
		return generateDropDownForDS();
	}
	
	var txType = $("#alertType").val();
	if(typeof txType == "undefined" || txType == undefined || $("#tabSelected").val() == 'txAlertAll'){
		document.txForm.txRepType.value = "ALL";
	}else{
		document.txForm.txRepType.value = txType;
	}
	
	var actionDateFromVal = $("#effDateFrom_Quote").val();
	var actionDateToVal = $("#effDateTo_Quote").val();
	
	
	
	var producerList = $("#producer").val();
	if(typeof producerList == "undefined" || producerList == undefined || producerList == null || producerList == ""){
		document.txForm.producer.value = "ALL";
	}else{
		document.txForm.producer.value = producerList;
	}
	
	if(checkRulesForDate(actionDateFromVal,actionDateToVal)){
		//Not a valid date
		actionDateFromVal = notValid;
		actionDateToVal = notValid;
	}
	
	document.txForm.actionDateFrom.value = actionDateFromVal;
	document.txForm.actionDateTo.value = actionDateToVal;
	
	var lobVal = $("#lob").val();
	if(typeof lobVal == "undefined" || lobVal == undefined){
		document.txForm.lineOfBusiness.value = "ALL";
	}else{
		document.txForm.lineOfBusiness.value = lobVal;
	}
	
	var trSourceVal = $("#transactionSource").val();
	if(typeof trSourceVal == "undefined" || trSourceVal == undefined){
		document.txForm.txSource.value = "ALL";
	}else {
		document.txForm.txSource.value = trSourceVal;
	}
	
	var uwCompanyVal = $("#uwCompany").val();
	if(typeof uwCompanyVal == "undefined" || uwCompanyVal == undefined){
		document.txForm.uwCompanyTR.value = "ALL";
	}else {
		document.txForm.uwCompanyTR.value = uwCompanyVal;
	}
}

function isValidDateForAlerts(dt){
	var dtDate = new Date(dt);
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;
	var valid = true;
	
	if(dtDate.toDateString() == "NaN") valid=false;
	if (!validformat.test(dt)) valid=false;
	if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100) valid=false;
	if(!isValidDatDateFormat(dt)) valid=false;
	
	return valid;
	
}

function isbackDate(dt){
	var valid = true;
	var dtDate = new Date(dt);
	if (new Date(dtDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) valid=false;
	return valid;
}
function isDateGreaterThanForAlerts(fDate,tDate){
	var valid = true;
	
	var endTimeStamp = new Date(fDate).getTime() + (30 * 24 * 60 * 60 * 1000);
	var selectedDate = new Date(tDate).getTime();
	var maxDateTS = new Date().getTime()+ (30 * 24 * 60 * 60 * 1000);
	var fromDateTS = new Date(fDate).getTime();
	
	if (endTimeStamp < selectedDate || maxDateTS < selectedDate || fromDateTS > selectedDate) {
    // The selected time is greater than 30 days from now
		valid=false;
}
	return valid;
}

function displayAlertsGridView(){
	var gridId = '#grid';
	var sortCol = $(gridId).jqGrid('getGridParam','sortname');
	var moreSelected = $('#moreSelectedForAlerts').val();
	var checkedRecords = $('#checkedAlerts').val();
	var breadCrumbFlagCheckedAlerts = $('#breadCrumbFlagCheckedAlerts').val();
	var breadCrumbFlagUncheckedAlerts = $('#breadCrumbFlagUncheckedAlerts').val();
	
	$('.sortColIcon').hide();
	
	// do not reset Review all checkbox if user performs sort
	if(sortCol != "" || moreSelected == "Yes"){}
	else{
		$("#ReviewAllChkBox").attr('checked',false);
	}
	
	
	//
	if(breadCrumbFlagCheckedAlerts != "" || breadCrumbFlagUncheckedAlerts != ""){
		$('#checkedAlerts').val(breadCrumbFlagCheckedAlerts);
		$('#unCheckedAlerts').val(breadCrumbFlagUncheckedAlerts);
		retainSelectedRecords();
	}
	
	// if user reviewed alerts and clicks more link, or checked 'All alerts' and sort we need to retain
	if(moreSelected == "Yes" && checkedRecords != ""){
		retainSelectedRecords();
	}

	// no need to apply rounded corners on IE8
	if(!($.browser.msie  && parseInt($.browser.version, 10) === 8)){
		$(gridId + ' tr:last-child td:first-child').addClass('roundBottomLeft');
		$(gridId + ' tr:last-child td:visible:last').addClass('roundBottomRight');
	}
		
	$(gridId + ' tbody:first-child tr:last-child td').addClass('gridBottomBorder');
	$(gridId).unbind('contextmenu');
	
	$(gridId + ' tr.jqgrow').each(function(){
		$(this).find('td:visible:last').addClass('chkBoxCol'); 
	});
}

function storeCheckedAlerts(){
	var checkedAlerts = [];
	var unCheckedAlerts = [];
	
	$('input.alerts_ChkBox:checkbox:checked').each(function () {
		var id = this.id;
		var rowId = id.substring(13);
		checkedAlerts.push(rowId);
	});
	
	$('input.alerts_ChkBox:checkbox:unchecked').each(function () {
		var id = this.id;
		var rowId = id.substring(13);
		unCheckedAlerts.push(rowId);
	});
	
	$('#checkedAlerts').val(checkedAlerts);
	$('#unCheckedAlerts').val(unCheckedAlerts);
	$('#moreSelectedForAlerts').val('Yes');
}

function retainSelectedRecords(){
	var checkedRecords = $('#checkedAlerts').val();
	var unCheckedRecords = $('#unCheckedAlerts').val();
	
	$('input.alerts_ChkBox').each(function () {
		var chkBox = this;
		var id = this.id;
		var rowId = id.substring(13);
		$.each(checkedRecords.split(","), function(i,id){
			if(id == rowId){
				// set checkbox to be selected
				$(chkBox).prop('checked', true);
				setCheckedAlerts(id);
				return false;
			}
		});
		$.each(unCheckedRecords.split(","), function(i,id){
			if(id == rowId){
				// set checkbox to be selected
				$(chkBox).prop('checked', false);
				setCheckedAlerts(id);
				return false;
			}
		});
	});
}

//Setting check/uncheck the review checkbox client side
function setCheckedAlerts(rowId){
	var isChecked = $('#alertsChkBox_'+rowId).prop('checked');
	var data = $('#grid').jqGrid('getGridParam', 'data');
	data[rowId-1]["reviewedInd"] = isChecked;
}

function checkRulesForDate(actionDateFromVal,actionDateToVal){
	var hasDateError = false;
	// Date range Checker
	if(!isValidDateTR(actionDateFromVal) || !isValidDateTR(actionDateToVal)){
		// see if both dates are valid
		hasDateError = true;
	} else if(!isDateGreaterThanForTR(actionDateFromVal, actionDateToVal)){
		// see if from date is greater than to date
		hasDateError = true;
	}
	return hasDateError
}

/**
 * This method is used for Alerts Transaction Type dropdown 
 * @param dropdownRecordsCount
 */
function individualCountForAlertType(dropdownRecordsCount){
	var typeAllCheck=true;
	  var typeCheckedList="";
	  if(!$("#ddcl-alertType-i0").is(':checked'))
		  typeAllCheck=false;
	
	  var typeObj=$('#alertType option');
	  var pCCount=$("#ddcl-alertType-i1").parent().children("label").html();
	  pCCount=substringData(pCCount,dropdownRecordsCount.pCCount)
	  $("#ddcl-alertType-i1").parent().children("label").html(pCCount);
	  $(typeObj[1]).text(pCCount);
	  if($("#ddcl-alertType-i1").is(':checked') && !typeAllCheck){
		  typeCheckedList+=pCCount+" "
	  }
	  var eDocCount=$("#ddcl-alertType-i2").parent().children("label").html();
	  eDocCount=substringData(eDocCount,dropdownRecordsCount.eDocCount)
	  $("#ddcl-alertType-i2").parent().children("label").html(eDocCount);
	  $(typeObj[2]).text(eDocCount);
	  if($("#ddcl-alertType-i2").is(':checked') && !typeAllCheck){
		  typeCheckedList+=eDocCount+" "
	  }
	  var eSigCount=$("#ddcl-alertType-i3").parent().children("label").html();
	  eSigCount=substringData(eSigCount,dropdownRecordsCount.eSigCount)
	  $("#ddcl-alertType-i3").parent().children("label").html(eSigCount);
	  $(typeObj[3]).text(eSigCount);
	  if($("#ddcl-alertType-i3").is(':checked') && !typeAllCheck){
		  typeCheckedList+=eSigCount+" "
	  }
	  if(typeAllCheck)
		  typeCheckedList="All Alerts";
	  
	  $("#ddcl-alertType").children().children(".ui-dropdownchecklist-headertext").html(typeCheckedList);
}