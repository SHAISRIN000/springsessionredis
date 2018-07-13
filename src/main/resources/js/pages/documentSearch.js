 var errorMsgShownSavePrint = false; 

jQuery(document).ready(function() {
	
	// stop js processing if not on document search tab
	if($('#txAlertType').val() != 'txDocSearch'){
		return;
	}
	
	// doc search grid loading
	if(enableGridFunctions()){
		var docSearchGridData =$("#docSearchLandingPage").val();
		var docs = $.parseJSON(docSearchGridData);
		var docCount = $("#docSearchCounts").val();
		if(typeof docs !="undefined" && docs!=undefined){
			docSearchGridTrigger(docs,docCount);
		}else{
			docSearchGridTrigger(JSON.parse(docSearchGridData),docCount);
		}
	}else if(!noTotalDocTypeCount()){
		/* TD#72360 -> This is happening when there are records for other Doc Types ,
		but nothing to display as  CANC,REIN,RESC has 0 records(when navigated from alerts to DS these are selected by default) */
		$('.hasDocSearchResults').hide();
		$('.sortColIcon').hide();
		 rebuildDocTypeDropdown($("#docSearchCounts").val());
	}else{
		resetGridView();
	}
	
	$('.getDocSearchData').click(function() {
		var hasError = errorCheckerDocSearch();
		if(!hasError){
			var urlString =	generateSearchStringURL();
			if(typeof urlString !== "undefined"){
				$('#moreSelected').val('');
				$('#checkedDocuments').val('');
				getGridJsonDataForTR(urlString);
			}
		}	
	});
	 
	 $('#chkAllDocumentsId').focus();
	 $('#chkAllDocumentsId').click(function(e){
		var checkStatus = $('#chkAllDocumentsId').prop("checked");
		selectAllDocuments(checkStatus);
		e.stopPropagation();
	 });
	 
	 // Sort method need different implementation than common TR/DS method to handle Select all checkboxes - JG
	 $('.sortColDS').click(function(e){
		 var id = this.id;
		 if(enableGridFunctions()){
			 sortColDS(id);
		 }
	 });
	 
	 $('#exportXlsxBtnDS').click(function(){
		showSavePrintPopover();
	 });
	 
	 $(document).on("click", ".showSavePrintBtn", function(e){
		$("." + this.id + "_Fields").removeClass('hidden');
		e.stopPropagation();
     });

	 /*
	 $('.showSavePrintBtn').live("click", function(e){
		$("." + this.id + "_Fields").removeClass('hidden');
		e.stopPropagation();
	 });
	 */
	 
	 $('#frmDocSearch').submit(function(event){
		if(printFile()){
			var target = 'AI2printPage';
			document.frmDocSearch.target = target;
			if(isIE()){
				// For IE, print file will be different implementation
				printDocIE(target);
				return false;
			}
		}
		downloadDocsSavePrint(event);
	 });
	 
	 $(document).click(function(){
		 destroyPopover('#exportMenu');
	 });
	 
	 $(document).on("click", "#saveMultipleDocs", function(e){
		 saveDocs("No", "No", "No");
	 });
	 
	 $(document).on("click", "#saveSingleDoc", function(e){
		 saveDocs("Yes", "No", "No");
	 });
	 
	 $(document).on("click", ".printDoc", function(e){
		 saveDocs("Yes", "Yes", "No");
	 });
	 
	 // export to excel functionality
	 $(document).on("click", "#saveExcelDocSearch", function(e){
		 saveDocs("No", "No", "Yes");
	 });
	 
	 // Tabbing behavior for multi select fields
	 $('.ui-dropdownchecklist-selector').keydown(function(e){
		if(e.keyCode == 40) { 
			$(this).find('.iconOpen').trigger('click');   
		}   
	 });
	
	 $('#frmDocSearch').find('input[id^=ddcl-]').focus(function(){
	    $(this).parent().addClass('ui-dropdownchecklist-hover');
	 });
	
	 $('#frmDocSearch').find('input[id^=ddcl-]').blur(function(){
	    $(this).parent().removeClass('ui-dropdownchecklist-hover');
	 });
	
	 // generate dropdowns in search header
	 generateSearchHeaderDropdown("producer");
	 generateSearchHeaderDropdown("lob");
	 generateSearchHeaderDropdown("uwCompany");
	 
	 // fields to determine if query changed
	 $('.dsFieldChg').change(function(){
		 $('#dsQueryChanged').val('Yes');
	 });
	 initialFormLoadProcessing();
});

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
}

function enableGridFunctions(){
	var docSearchGridData =$("#docSearchLandingPage").val();
	
	if(docSearchGridData != "" 
	  && typeof docSearchGridData !== "undefined" 
	  && docSearchGridData.toUpperCase() != "NO RESULTS") {
		return true;
	}else{
		return false;
	}
}

function noTotalDocTypeCount(){
	var numTotalDocTypes = $('#numTotalDocTypes').val();
	numTotalDocTypes = numTotalDocTypes.replaceAll(",","");
   
	if(parseInt(numTotalDocTypes) == 0){
    	return true;
    }else{
    	return false;
    }
}

function resetGridView(){
	$('.hasDocSearchResults').hide();
	$('.sortColIcon').hide();
	
    if(noTotalDocTypeCount()){
    	rebuildDocTypeDropdown(null);
    }
}

function docSearchGridTrigger(data, docTypeCount) {
	//console.log(data);
	//console.log(docTypeCount);
	
	// do not load grid if no data is returned
	if(data == null || data==""){
		resetGridView();
		return;
	}
	
	if(typeof data=='string'){
		data=JSON.parse(data);
	}
		$('#docsearchgrid').jqGrid(
				{
					datatype : 'local',
					colNames:['Name', 'Policy #', 'Document Type', 'Status', 'Process Date', 'Select All', 'Doc Id', 'Doc Type', 'Package Type', 
					          'Drawer', 'First Name', 'Last Name', 'Row Number', 'Policy Number', 'Date Imaged', 'Checked Row', 'Applicant Name', 'Doc Description', 'Page Ids'],
					colModel : [ {
						name : 'policyHolderName',
						index : 'policyHolderName',
						//formatter : policyHolderNameDS,
						classes: 'nameForDocumentSearch',
						sortable : true,
						sorttype : 'text',
						width : 200,
						align : "left"
					},

					{
						name : 'folderNumber',
						classes : 'folderNumber',
						sortable : true,
						sorttype : function(cell, obj) {
							 return obj.folderNumber;
						},
						align : "left",
						width : 150
					},

					{
						name : 'description',
						index : 'description',
						formatter:documentTypeFormatter,
						classes:'description',
						sortable : true,
						sorttype:function (cell, obj) { 
						   	   return obj.description;
						 },
						align : "left",
						width : 225
					}, {
						name:'status',
					   	index:'status', 
					   	sortable:true,
					   	sorttype:function (cell, obj) { 
						   	return obj.status;
						},
						align : "left",
						width : 150
					},
					{
						name : 'processDate',
						index : 'processDate',
				   		formatoptions:{newformat:'m/d/Y'},
				   		sortable:true,
				   		sorttype:function (cell, obj) { 
				   			return new Date(formatProcessDate(obj.processDate));
				   		},
				   		align : "left",
						width : 125
					},

					{
						name:'selectAll',
						index : '',
						formatter:selectAllFormatter,
				   		sortable:true,
				   		width: 80
					},
					{ name:'docId', index:'docId',hidden:true},
					{ name:'docType', index:'docType',hidden:true},
					{ name:'packageType', index:'packageType',hidden:true},
					{ name:'drawer', index:'drawer',hidden:true},
					{ name:'firstName', index:'firstName',hidden:true},
					{ name:'lastName', index:'lastName', hidden:true},
					{ name:'rowNumber', index:'rowNumber', hidden:true},
					{ name:'folderNumber',index:'folderNumber',hidden:true},
					{ name:'processDate', index:'processDate', hidden:true},
					{ name:'checkedRow', index:'', hidden:true},
					{ name:'policyHolderName', index:'policyHolderName', hidden:true},
					{ name:'description', index:'description', hidden:true},
					{ name:'pageIds', index:'pageIds', hidden:true},
					],

					beforeRequest : function() {
				   		showLoadingMsg();
					},

					loadComplete : function(data) {
						var rows = $('#docsearchgrid')[0].rows.length;
						var count = $('#numOfRecordsFound').text();
						count = count.replaceAll(",","");
						
					    if(parseInt(count) > 0){
					    	if(parseInt(count) <= rows-1) {
								$('#moreDocSearchResults').hide();
							}else{
								$('#moreDocSearchResults').show();
							} 
					    }
					    
			   			var sortCol = $('#docsearchgrid').jqGrid('getGridParam','sortname');
			   			var sortOrder = $('#docsearchgrid').jqGrid('getGridParam','sortorder');
						sortGrid(sortCol, sortOrder, count);
					
					    processThirdPartyError();
					    
					    // rebuild Doc Type dropdown
					    rebuildDocTypeDropdown(docTypeCount);
					    
						$.unblockUI();

					},

					gridComplete: function() {
						displayDocSearchGridView();
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
						//showAQSvcError();

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

function rebuildDocTypeDropdown(docTypeCount){
	if($('#dsQueryChanged').val() == "Yes"){
		var dropdownId = "docType_DocSearch";
		var id = "docType";
		var options = "";
	
		if(typeof docTypeCount != "undefined" 
		  && docTypeCount != undefined 
		  && docTypeCount != null) {
			docTypeCount = docTypeCount.replaceAll('{','');
			docTypeCount = docTypeCount.replaceAll('}','');
		}
	
		// loop through existing dropdown and update descriptions with counts if needed
		$("#" + dropdownId + " option").each(function(i){
			var docType = $(this).val();
			var docDesc = removePriorCountFromDocDesc($(this).text());
	
			if(docType != "ALL"){
				docDesc = getDocTypeDescWithCount(docType, docTypeCount, docDesc);
			}else{
				docDesc =  docDesc + " (" + $('#numTotalDocTypes').val() + ")";
			}
			options = options + "<option value='" + docType + "'>" + docDesc + "</option>";
	    });
		
		$('#' + dropdownId).html(options);
		
		generateSearchHeaderDropdown(id);	
	}
	
	$('#dsQueryChanged').val('No'); // reset new query flag to No
}

function removePriorCountFromDocDesc(docDesc){
	// remove any old counts in description if needed
	var charPos = docDesc.indexOf("(");
	if(charPos > 0){
		docDesc = docDesc.substring(0, charPos-1);
	}
	
	return docDesc;
}


function getDocTypeDescWithCount(docType, docTypeCount, docDesc){
	//console.log("in getDocTypeDescWithCount");

	if(docTypeCount != null){
		// add zero to desc as default
		docDesc = docDesc + " (0)";
		
		$.each(docTypeCount.split(","), function(i,e){
			var arrDocTypes;
			if(e.indexOf("=") > 0){
				arrDocTypes = e.split('=');
			}else{
				arrDocTypes = e.split(':');
			}
			//console.log($.trim(arrDocTypes[0].replaceAll("\"","")));
			//console.log($.trim(arrDocTypes[1].replaceAll("\"","")));
			if($.trim(docType) == $.trim(arrDocTypes[0].replaceAll("\"",""))){
				docDesc = removePriorCountFromDocDesc(docDesc);
				docDesc = docDesc + " (" + arrDocTypes[1].replaceAll("\"","") + ")";
				return false;
			}
		});
	}else{
		docDesc = docDesc + " (0)";
	}

	return docDesc;
}

function generateDocumentSearchStringURL() {
	var docType = convertParam($("#docType_DocSearch").val());
	var lob = convertParam($("#lob_DocSearch").val());
	var producer =  convertParam($("#producer_DocSearch").val());
	var uwCompany =  convertParam($("#uwCompany_DocSearch").val());
	var actionDateFrom = $("#effDateFrom_Quote").val();
	var actionDateTo =  $("#effDateTo_Quote").val();
	var urlStr = document.actionForm.documentSearchResultsURL.value + "?docType="+docType+"&lob="+lob+"&producer="+producer+"&actionDateFrom="+actionDateFrom+"&actionDateTo="+actionDateTo+"&uwCompany="+uwCompany;
	
	// set doc type hidden field for rebuilding doc type dropdown
	$('#ds_docType').val($("#docType_DocSearch").val());
	
	//console.log(urlStr);
	return urlStr;
}

function generateDropDownForDS(){
	var producer, uwCompany, lob, type;
	var trSource = "ALL";
	var actionDateFrom = $("#effDateFrom_Quote").val();
	var actionDateTo = $("#effDateTo_Quote").val();
	var tabSelected = $("#tabSelected").val();
	var tabAlertType =  $("#txAlertType").val();
	
	if(tabSelected == 'txDocSearch'){
		// navigating from doc search tab
		producer = getMultiSelectValue("#producer_DocSearch");
		if(tabAlertType == "txAlertAll"){
			// do not pass date range selected to TX Alert, let default kick in
			actionDateFrom = "";
			actionDateTo = "";
		}else{
			if(checkRulesForDate(actionDateFrom,actionDateTo)){
				// if date range is not valid for TR, let default kick in
				actionDateFrom = "";
				actionDateTo = "";
			};
			lob = convertLOBFromDS();
			uwCompany = getMultiSelectValue("#uwCompany_DocSearch");
		}
	}else{
		// navigating to doc search tab
		
		// TD 71309 - don't carry over date range search if coming from TX Alerts tab to Doc Search tab
		// let default kick in
		if(tabSelected == 'txAlertAll'){
			actionDateFrom = "";
			actionDateTo = "";
		}
		
		producer = getMultiSelectValue("#producer");
		uwCompany = getMultiSelectValue("#uwCompany");
		lob = getMultiSelectValue("#lob");
		type = getMultiSelectValue("#alertType");
	}
	
	if(typeof type == "undefined" || type == undefined){
		type = "ALL";
	}
	
	if(typeof producer == "undefined" || producer == undefined || producer == null){
		producer = "ALL";
	}
	
	if(typeof uwCompany == "undefined" || uwCompany == undefined || uwCompany == null) {
		uwCompany = "ALL";
	}
	
	if(typeof lob == "undefined" || lob == undefined || lob == null) {
		lob = "ALL";
	}
	
	document.txForm.txRepType.value = type;
	document.txForm.producer.value = producer;
	document.txForm.actionDateFrom.value = actionDateFrom;
	document.txForm.actionDateTo.value = actionDateTo;
	document.txForm.lineOfBusiness.value = lob;
	document.txForm.txSource.value = trSource;
	document.txForm.uwCompanyTR.value = uwCompany;
	document.txForm.txTabSelected.value = tabSelected;
}

function convertLOBFromDS(){
	var selectedText = "";
	var count = 1;
	
	$('#lob_DocSearch :selected').each(function(i, sel){ 
		var ddText = $.trim($(this).text());
		if(ddText == "All LOB"){
			selectedText = "ALL";
			return false;
		}else{
			ddText = getTRLOB(ddText);
			if(count > 1){
				selectedText = ddText + ',' + selectedText;
			}else{
				selectedText = ddText;
			}
			count = count + 1;
		}
		
	});
	
	return selectedText;
}

function getTRLOB(lob){
	var trLOB = "";
	
	switch (lob) {
	case 'All LOB':  
		trLOB = "All";
	case 'Personal Auto':  
		trLOB = "PA,ALN_PA";
		break;
	case 'Umbrella':  
		trLOB = "PCAT";
		break;
	case 'Homeowners':  
		trLOB = "HO";
		break;
	case 'Dwelling Fire':  
		trLOB = "DF";
		break;
	case 'Commercial Auto':  
		trLOB = "PIC_NEW_CA";
		break;
	}
		
	return trLOB;
}

function getDocSearchLOB(lob){
	var dsLOB = "";
	
	switch (lob) {
	case 'ALL':  
		dsLOB = "All";
		break;
	case 'PA':  
		dsLOB = "Personal Auto";
		break;
	case 'PA,ALN_PA':  
		dsLOB = "Personal Auto";
		break;
	case 'PCAT':  
		dsLOB = "Umbrella";
		break;
	case 'HO':  
		dsLOB = "Homeowners";
		break;
	case 'DF':  
		dsLOB = "Dwelling Fire";
		break;
	case 'PIC_NEW_CA':  
		dsLOB = "Commercial Auto";
		break;
	}
		
	return dsLOB;
}

function getMultiSelectValue(elm){
	var selectedValue = "";
	var count = 1;
	
	$(elm + ' :selected').each(function(i, sel){ 
		var ddValue = $.trim($(this).val());
		if(elm == '#lob'){
			ddValue = getDocSearchLOB(ddValue);
		}
		if(ddValue == "ALL"){
			selectedValue = ddValue;
			return false;
		}else{
			if(count > 1){
				selectedValue = selectedValue + ',' + ddValue;
			}else{
				selectedValue = ddValue;
			}
			count = count + 1;
		}
		
	});
	
	return selectedValue;
}

function convertParam(param){
	if(typeof param == "object"){
		param = param.toString();
	}
	param = param.replaceAll("&","%25");
	param = encodeURI(param);
	
	return param;
}

//dropdown logic
function generateSearchHeaderDropdown(id){
	var selectedValue = $('#ds_' + id).val();
	var dropdownId = id + "_DocSearch";
	
	removeDropdownCheckList($('#' + dropdownId));

	var charIndxPos = selectedValue.indexOf(",");
	if(charIndxPos != -1){
		var options = selectedValue.split(',');
		selectedValue = options.toString();
	}
	
	// set selected values
	$.each(selectedValue.split(","), function(i,e){
		$("#" + dropdownId + " option[value='" + e + "']").prop("selected", true);
	});
	
	$("#" + dropdownId).dropdownchecklist({
		emptyText : "Select",
		firstItemChecksAll : true,
		icon: {placement: 'right', toOpen: 'iconOpen'},
		width : "160px",
	});
}

/** Excel, Save, Print functionality **/
function showSavePrintPopover() {
	$('.expandLink_Fields').addClass('hidden');
	$('#savePrintErrorMsg').remove();
	errorMsgShownSavePrint = false;

	var profileMenuHTML = $('#saveDocSearchContent').html();
	var pop = $('#exportMenu').richPopover({
			placement: 'bottom',
			html: true,
		    content: profileMenuHTML,
		 });
	
	pop.richPopover('show');
}

function storeCheckedDocuments(){
	var checkedDocuments = [];
	
	$('input.docChkbox:checkbox:checked').each(function () {
		var elm = $(this).closest('tr');
		var rowId = $(elm).attr("id");
		checkedDocuments.push(rowId);
	});
	
	$('#checkedDocuments').val(checkedDocuments);
	$('#moreSelected').val('Yes');
}

function getSelectedDocuments(){
	var docsSave = [];
	
	$('input.docChkbox:checkbox:checked').each(function () {
		var elm = $(this).closest('tr');
		var rowId = $(elm).attr("id");
		var documentSearchRecord = new DocumentSearchRecord(rowId);
		
		var docSaveObj = new Object();
		var policyHolderName = documentSearchRecord.policyHolderName;
		if(policyHolderName != null && policyHolderName != ""){
			policyHolderName = policyHolderName.replaceAll("*","'");
		}
		
		docSaveObj.policyHolderName = policyHolderName;
		docSaveObj.description = documentSearchRecord.description;
		docSaveObj.packageType = documentSearchRecord.packageType;
		docSaveObj.docId = documentSearchRecord.docId;
		docSaveObj.docType = documentSearchRecord.docType;
		docSaveObj.folderNumber = documentSearchRecord.folderNumber;
		docSaveObj.drawer = documentSearchRecord.drawer;
		docSaveObj.processDate = documentSearchRecord.processDate;
		docSaveObj.pageIds = documentSearchRecord.pageIds;
		docSaveObj.status = "Processed";
		docsSave.push(docSaveObj);
	});
	
	return docsSave;
}

function saveDocs(mergeSingleFile, printFile, excelFile){
	var downloadAllDocuments;
	var strErrMsg = "";
	var selectedDocCount = $('input.docChkbox:checkbox:checked').length;

	//check if atleast one document is selected or if more than 100 are selected
	//only needed for save/print functionality
	if(excelFile == "No"){
		if(selectedDocCount == 0){
			 strErrMsg = "Please select a document.";
		}else if(selectedDocCount > 100){
			strErrMsg = "You have selected " + selectedDocCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
				+ " documents.<br/>Please select no more than 100 documents.";
		}
		if(strErrMsg != ""){
			if(!errorMsgShownSavePrint){
				showSavePrintErrMsg(strErrMsg);
			}
			return;
		}
	}
	
	destroyPopover('#exportMenu');
	
	if(excelFile == "Yes" && (selectedDocCount == 0 || isAllDocumentsChecked())){
		downloadAllDocuments = "Yes";
	}else{
		downloadAllDocuments = "No";
		$('#frmDocSearch [name="filesSave"]').val(JSON.stringify(getSelectedDocuments())); // store array of objects in hidden field
	}

	$('#frmDocSearch [name="mergeSingleFile"]').val(mergeSingleFile);
	$('#frmDocSearch [name="printFile"]').val(printFile);
	$('#frmDocSearch [name="excelFile"]').val(excelFile);
	$('#frmDocSearch [name="allDocuments"]').val(downloadAllDocuments);
	$('#frmDocSearch').submit();
}

function showSavePrintErrMsg(errorMsg){
	var errorHTML = "<div id='savePrintErrorMsg' class='inlineErrorMsg' style='margin-left:10px;margin-top:10px;'>";
	errorHTML = errorHTML + "<img class='linksErrorIcon' id='errorImage' src='" + errorImage + "'>";
	errorHTML = errorHTML + errorMsg + "</div>";
	$(errorHTML).insertAfter('.savePrintHeaderHR');
	errorMsgShownSavePrint = true;
}

function exceedDocLimit(count){
	var maxCount = 100;
	
	if(count > maxCount){
		return true;
	}else if($('#chkAllDocumentsId').is(':checked') 
	  && parseInt($('#numOfRecordsFound').text().replaceAll(",","")) > maxCount){
		return true;
	}else{
		return false;
	}
}

function downloadDocsSavePrint(event){
	// need to use JS Ajax implementation as jQuery AJAX functionality not set up to handle PDF type
	var strURL;
	
	if(excelFile()){
		strURL = document.actionForm.documentSearchDownloadExcelURL.value;
	}else{
		strURL = document.actionForm.documentSearchDownloadURL.value;
	}
	
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', strURL, true);
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
	
		    	setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
		    }
		}
	 };
	 showLoadingMsg();
	 xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	 xhr.send($("#frmDocSearch").serialize());
	 event.preventDefault ? event.preventDefault() : event.returnValue = false;   
}

function printFile(){
	var printFile = $('#frmDocSearch [name="printFile"]').val();
	if(printFile == "Yes"){
		return true;
	}else{
		return false;
	}
}

function excelFile(){
	var excelFile = $('#frmDocSearch [name="excelFile"]').val();
	if(excelFile == "Yes"){
		return true;
	}else{
		return false;
	}
}

function isIE(){
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		return true;
	}else{
		return false;
	}
}

function printDocIE(target){
	var w = window.open('', target);
	document.frmDocSearch.action = document.actionForm.documentSearchDownloadURL.value;
	document.frmDocSearch.method = 'POST';
	document.frmDocSearch.submit();
	w.focus();
}

/* Document Search Record. Row id is the row number from JQGrid*/
function DocumentSearchRecord(rowId) {
	this.row = jQuery('#docsearchgrid').getRowData(rowId);
	this.folderNumber = this.row.folderNumber; 
	this.policyHolderName = this.row.policyHolderName;
	this.firstName = this.row.firstName; 
	this.lastName = this.row.lastName; 
	this.description = this.row.description; 
	this.docType = this.row.docType; 
	this.docId = this.row.docId; 
	this.drawer = this.row.drawer; 
	this.packageType = this.row.packageType; 
	this.processDate = this.row.processDate;
	this.pageIds = this.row.pageIds;
}

// Grid functions
function processThirdPartyError(){
	var tpSvcStatus = $('#tpServiceFail').val();
	if(tpSvcStatus !=null && tpSvcStatus != undefined && tpSvcStatus.length>1){
		$('#docSearchErrorMessage').text(tpSvcStatus).removeClass('hidden');
	}else{
		$('#docSearchErrorMessage').text('').addClass('hidden');
	}
}

function selectAllDocuments(checkStatus){
	$("#chkAllDocumentsId").attr('checked',checkStatus);
	
	$("td.chkBoxCol").find("input:checkbox:not(:disabled)").each(function () { 
		this.checked = checkStatus;
		// need to set hidden field for sorting purposes
		var rowId = this.id.replaceAll("chkBox_","");
		setCheckedDocument(rowId);
	});
}

function isAllDocumentsChecked(){
	var isAllDocumentsChecked = true;

	$("td.chkBoxCol").find("input:checkbox:not(:disabled)").each(function () { 
		var rowId = this.id.replaceAll("chkBox_","");
		var isChecked = ($('#chkBox_' + rowId).is(':checked'));
		if(!isChecked){
			isAllDocumentsChecked = false;
			return false;
		}
	});
	
	return isAllDocumentsChecked;
}

/* Grid formatters */
function policyHolderNameDS(cellValue, options, rowObject)  { 
	var name = rowObject.policyHolderName.toLowerCase().replaceAll("*","'");
	var arrNames = name.split(' ');
	var policyHolderName = "";
	
	if(arrNames.length == 3){
		policyHolderName = capitalizeFirstChar(arrNames[2]) + ", " + capitalizeFirstChar(arrNames[0]) + ' ' + capitalizeFirstChar(arrNames[1]);
	}else if(arrNames.length == 2){
		policyHolderName = capitalizeFirstChar(arrNames[1]) + ", " + capitalizeFirstChar(arrNames[0]);
	}else{
		policyHolderName = capitalizeFirstChar(arrNames[0]);
	}
	
	return "&nbsp;" + policyHolderName;
}

function documentTypeFormatter(cellValue, options, rowObject)  { 
	var rowId = rowObject.rowNumber;
	var description = rowObject.description;
	var strHTML;
	
	strHTML = "<a href=\"javascript:viewDocument(" + rowId + ")\">" + description + "</a>";
	
	return strHTML;
}

function formatProcessDate(processDate){
	return processDate.substring(4, 6) + "/" + processDate.substring(6, 8) + "/" + processDate.substring(0, 4);
}

function selectAllFormatter(cellValue, options, rowObject)  { 
	var rowId = rowObject.rowNumber;
	var data = $('#docsearchgrid').jqGrid('getGridParam', 'data');
	var checked = "";

    if(data[rowId - 1]["checkedRow"]){
    	checked = "checked";
    }
    	
    var strHTML = "<input type=\"checkbox\" id=\"chkBox_" + rowId + "\" class=\"docChkbox\" onclick=\"javascript:setCheckedDocument('" + rowId + "')\"; " + checked + ">";
	
	return strHTML;
}

function setCheckedDocument(rowId){
    var isChecked = ($('#chkBox_' + rowId).is(':checked'));
    var data = $('#docsearchgrid').jqGrid('getGridParam', 'data');
    data[rowId - 1]["checkedRow"] = isChecked;
}

function sortColDS(col){
	var gridId = 'docsearchgrid';
	var sortCol = $('#'+gridId).jqGrid('getGridParam','sortname'); 
	var sort = $('#'+gridId).jqGrid('getGridParam','sortorder');
	
	if(col == "selectAll"){
		col = "checkedRow";
	}
	
	if ((sortCol.toUpperCase() != col.toUpperCase()) ||(sortCol.toUpperCase() == col.toUpperCase() && sort.toUpperCase() == "ASC")) {
		sort = "desc";
	} else {
		sort = "asc";
	}
	
	// clear hidden fields for checked documents
	$('#moreSelected').val('');
	$('#checkedDocuments').val('');
	
	// reload grid without calling service
	$('#'+gridId).jqGrid('setGridParam',{sortname:col, sortorder:sort, datatype: 'local'}).trigger('reloadGrid');
}

function viewDocument(rowId){
	var selRowNum = $("#chkBox_" + rowId).closest('tr').attr("id");
	var documentSearchRecord = new DocumentSearchRecord(selRowNum);
	var url = "viewDocument?docId=" + documentSearchRecord.docId + "&policy=" + documentSearchRecord.folderNumber + "&drawer=" + documentSearchRecord.drawer + "&pageIds=" + documentSearchRecord.pageIds;
	//console.log("url is " + url);
	window.open(url, name='_blank','width=800,height=600, resizable, status=0, toolbar=0, titlebar=0, menubar=0, location=0');
}

function retainSelectedDocuments(){
	var checkedDocuments = $('#checkedDocuments').val();
	
	$('input.docChkbox').each(function () {
		var chkBox = this;
		var elm = $(chkBox).closest('tr');
		var rowId = $(elm).attr("id");
		$.each(checkedDocuments.split(","), function(i,id){
			if(id == rowId){
				// set checkbox to be selected
				$(chkBox).prop('checked', true);
				setCheckedDocument(id);
				return false;
			}
		});
	});
}

function displayDocSearchGridView(){
	var gridId = '#docsearchgrid';
	var sortCol = $(gridId).jqGrid('getGridParam','sortname');
	var moreSelected = $('#moreSelected').val();
	var checkedDocuments = $('#checkedDocuments').val();
	
	$('#exportXlsxBtnDS').show();
	$('.sortColIcon').hide();
	
	// do not reset select all checkbox if user performs sort
	if(sortCol != "" || moreSelected == "Yes"){}
	else{
		$("#chkAllDocumentsId").attr('checked',false);
	}
	
	// if user selected documents and clicks more link, we need to retain
	if(moreSelected == "Yes" && checkedDocuments != ""){
		 retainSelectedDocuments();
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

// Search header edits
function errorCheckerDocSearch(){
	 var blnHasError = false;
	 var blnHasDateError = false;
	 var selDocType = $("#docType_DocSearch").val();
	 var selProducer = $("#producer_DocSearch").val();
	 var selLOB = $("#lob_DocSearch").val();
	 var selUWCompany = $("#uwCompany_DocSearch").val();
	 var selActionFromDate = $("#effDateFrom_Quote").val();
	 var selActionToDate = $("#effDateTo_Quote").val();
	 var docTypeEditMsg = "Please select a Doc Type";
	 var producerEditMsg = "Please select a Producer";
	 var lobEditMsg = "Please select a LOB";
	 var uwCompanyEditMsg = "Please select a UW Company";
	 var dateEditMsg = "Please enter a valid date range";
	 
	if($.trim(selDocType)==""){
		$('#docTypeError').text(docTypeEditMsg).css({"visibility" : "visible"});
		$("#docType_DocSearch").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#docTypeError').text("").css({"visibility" : "hidden"});
		$("#docType_DocSearch").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selProducer)==""){
		$('#producerError').text(producerEditMsg).css({"visibility" : "visible"});
		$("#producer_DocSearch").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#producerError').text("").css({"visibility" : "hidden"});
		$("#producer_DocSearch").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selLOB)==""){
		$('#lobError').text(lobEditMsg).css({"visibility" : "visible"});
		$("#lob_DocSearch").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#lobError').text("").css({"visibility" : "hidden"});
		$("#lob_DocSearch").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	if($.trim(selUWCompany)==""){
		$('#uwCompanyError').text(uwCompanyEditMsg).css({"visibility" : "visible"});
		$("#uwCompany_DocSearch").addClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
		blnHasError = true;
	} else{
		$('#uwCompanyError').text("").css({"visibility" : "hidden"});
		$("#uwCompany_DocSearch").removeClass("inlineError").trigger('chosen:updated').trigger('chosen:styleUpdated');
	}
	
	// Date range edits
	if(!isValidDate(selActionFromDate) || !isValidDate(selActionToDate)){
		// see if both dates are valid
		blnHasDateError = true;
		blnHasError = true;
	} else if(isDateGreaterThan(selActionFromDate, selActionToDate)){
		// see if from date is greater than to date
		blnHasDateError = true;
		blnHasError = true;
	}else if(!checkDateRange(selActionToDate, selActionFromDate, '31')){
	   // date range exceeds 31 days
	   dateEditMsg = "Search cannot exceed 31 days";
	   blnHasDateError = true;
	   blnHasError = true;
	}
	
	if(blnHasDateError){
		$(".actionDateAlerts").addClass("inlineError");
		$('#actionDateError').text(dateEditMsg).css({"visibility" : "visible"});
		$('#searchResultsGridHeader').css({"margin-top" : "20px"});
	}else{
		$(".actionDateAlerts").removeClass("inlineError");
		$('#actionDateError').text("").css({"visibility" : "hidden"});
		$('#searchResultsGridHeader').css({"margin-top" : "10px"});
	}
	
	return blnHasError;
}

function isValidDate(dt){
	var dtDate = new Date(dt);
	var validformat=/^\d{2}\/\d{2}\/\d{4}$/;
	var valid = true;
	
	if(dtDate.toDateString() == "NaN") valid=false;
	if (!validformat.test(dt)) valid=false;
	if (dtDate.getFullYear() < 1900 || dtDate.getFullYear() > 2100) valid=false;
	if (dtDate.getTime() > new Date().getTime()) valid=false;
	if(!isValidDatDateFormat(dt)) valid=false;
	
	return valid;
	
}

function checkDateRange(strDate1, strDate2, strDays) {
	  // Time in seconds for 31 days
	  var dtTest = new Date(strDate1);
	  var dtTest2 = new Date(strDate2);
	 
	  if(strDate1 == "") return false; 
	  if(dtTest.toDateString() == "NaN") return false;
	  if (!isValidDate(strDate1)) return false;
	  if(strDate2 == "") return false; 
	  if(dtTest2.toDateString() == "NaN") return false;
	  if (!isValidDate(strDate2)) return false;
	  
	  if((dtTest.getTime() - dtTest2.getTime()) > strDays*24*60*60*1000)
	    {  return false;
	    }
	  else
	    {
	       return true;
	    }
}


