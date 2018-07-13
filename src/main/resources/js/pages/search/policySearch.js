jQuery(document).ready(function() {
	var policyAmendLockId = $.trim(document.actionForm.policyAmendLock.value);
	
	if(policyAmendLockId!=null){
		$("#policyAmendLockId").html(policyAmendLockId).removeClass("hidden");
	}
	/* JQGrid logic */
	$('#grid').jqGrid({
		url: document.actionForm.searchResultsURL.value.replaceAll("%25","'"),
		datatype:'json',
		mtype:'GET',
		colNames:['Name', 'Residence', 'Policy #', 'Effective Date', 'Expiration Date', 'Status', 
		          'Line of Business', 'Policy Key', 'Term', 'First Name', 'Middle Name', 'Last Name',
		          'Row Number', 'Company', 'PolicyNumber', 'lob', 'houseNumber', 'address1', 
		          'city', 'zip', 'state', 'country', 'dataSource'],
		colModel:[
	   		{ name:'name',
	   		  index:'name',
	   		  classes:'applicantName',
	   		  formatter:policyNameFormater,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   	        return obj.lastName + ', ' + obj.firstName;
	   		 },
	   		 width:170
	   		 },
	   		{ name:'residence', 
		   	  index:'residence', 
		   	  formatter:residenceFormater,
		   	  classes:'residence',
		   	  width:195
		   	},
	   		{ name:'policyNumber',
	   		  index:'policyNumber', 
	   		  classes:'policyNumber',
	   		  formatter:policyNumFormatter,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			  return obj.policyNumber;
		   	   },
	   		  width:150
	   		 }, 
	   		{ name:'effectiveDate',
	   		  index:'effectiveDate',
	   		  formatter:dateFormatter,
	   		  formatoptions:{newformat:'m/d/Y'},
	   		  datefmt:'Y-m-d',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			    return new Date(obj.effectiveDate);
	   		  },
	   		  width:100
	   		},
	   		{ name:'expirationDate',
		   		  index:'expirationDate',
		   		  formatoptions:{newformat:'m/d/Y'},
		   		  formatter:dateFormatter,
		   		  datefmt:'Y-m-d',
		   		  sortable:true,
		   		  sorttype:function (cell, obj) { 
		   			    return new Date(obj.expirationDate);
		   		  },
		   		  width:105
		   	},
	   		{ name:'status',
	   		  index:'status',
	   		  formatter:statusFormater,
			  sortable:true,
		   	  sorttype:'text',
		   	  width:90
		   	},
		   	{ name:'lob',
	   	      index:'lob',
	   	      formatter:lobFormater,
			  sortable:true,
		   	  sorttype:'text',
	   	      width:95
		   	},
			{ name:'policyKey', index:'policyKey',hidden:true},
			{ name:'term', index:'term',hidden:true},
			{ name:'firstName', index:'firstName',hidden:true},
			{ name:'middleName', index:'middleName', hidden:true},
			{ name:'lastName', index:'lastName', hidden:true},
			{ name:'rowNumber',index:'rowNumber',hidden:true},
			{ name:'company',index:'company',hidden:true},
			{ name:'lob',index:'lob',hidden:true},
			{ name:'policyNumber',index:'policyNumber',hidden:true},
			{ name:'houseNumber',index:'houseNumber',hidden:true},
			{ name:'address1',index:'address1',hidden:true},
			{ name:'city',index:'city',hidden:true},
			{ name:'zip',index:'zip',hidden:true},
			{ name:'state',index:'state',hidden:true},
			{ name:'country',index:'country',hidden:true},
			{ name:'dataSource',index:'dataSource',hidden:true}
			],
		   	
			beforeRequest:function(){
				clearGridLoad();
		   		showLoadingMsg();
		   	},

		   	loadComplete: function(data){
		   		var count;
		   		var sortCol = $('#grid').jqGrid('getGridParam','sortname');
	   			var sortOrder = $('#grid').jqGrid('getGridParam','sortorder');
		   		var selectedTab = $('#searchIn').val();
	   			var tabAdvSearch = selectedTab + "_advSearch";
	   			var errMsg = data.errorMessage;
	   			
	   			// Check if user has performed an Advanced Search on the selected tab
	   			if(hasPerformedAdvSearchForTab(tabAdvSearch)) {
	   				$('#clearAdvPolSearch').show();
				}
	   			
	   		    // get record count
	   			if(data.recordCount != undefined){
	   				count = data.recordCount;
	   				$('#sortCount').text(count);
	   			}else{
	   				count = $('#sortCount').text();
	   			}
	   		
	   			sortGrid(sortCol, sortOrder, count);
	   			displayRecordCount($('#grid').getGridParam('records'), count, errMsg);
		   		
	   			if(count == 1){
	   				checkToAccessOtherApp(count);
	   			}
		   		
		   		//$('.ui-autocomplete.ui-menu').hide();
		   		resetSearchURL();
		   		$.unblockUI();
		   	},
		   	
		   	gridComplete: function() {
		   		displayGridView();
		   	},
		   	
		    loadonce:true,
		    gridview:true,
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
		    	var errorMsg = xhr.getResponseHeader("x-ai-error-msg");
		    	if(errorMsg == "" || errorMsg == null){
		    		errorMsg = "Sorry, our database is inaccessible at the moment. Please try later.";
		    	}
		    	showSvcError(errorMsg);
		    	
		    	// show advanced search link
		    	$('.openPolicyAdvSearch').show();
		    	
		    	// Check if user has performed an Advanced Search on the selected tab
		    	var selectedTab = $('#searchIn').val();
	   			var tabAdvSearch = selectedTab + "_advSearch";
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
	
	   $('#alertEndorse').modal('hide');
	   $('#alertPayments').modal('hide');
	   
	  // Advanced Policy Search
	  $(document).on("click", ".openAdvPolSearch", function(){
		  $('#advSearchPolicyForm input[id="searchRequestSource"]').val("PolicySearch");
		  openAdvPolicySearch();
	  });
	  
	  $(document).on("click", ".largeCommercial", function(){
		  $("#alertLargeCommercial").hide();
	  });

	  initialFormLoadProcessing();
});

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
}

function submitPolicyActionForm(rowId, action) {
	var policyRecord = new PolicyRecord(rowId);
	var status = policyRecord.policyStatus;
	var policyNumber = policyRecord.policyNumber;
	var isLargePolicy = "true";
	var blockCalls;
	
	var ajaxReq = $.get(
			"/aiui/landing/checkLargeCAuto"
			,{ policyNumber : policyNumber
			}, "application/json").done(function(response) {
		
		if(blockPolicyDetails(response,action)){
			$("#alertLargeCommercial").show();
		}else{
			
	if(status == InquiryPolicyStatus.INCOMPLETE){
		if(action == 'Policy'){
			var strHTML = genActionsListByRowId(rowId);
			if(strHTML != "" && strHTML.indexOf("Make a Payment") > 0 && strHTML.indexOf("Review Payments") > 0){
				//dont navigate to any action on policy click if multiple links exist
				return;
			}
			else if(strHTML != "" && strHTML.indexOf("Make a Payment") > 0){
				//navigate to Make a Payment if only one link exist
				action = InquiryActionEnum.MAKEPAYMENT;
			}
			else if(strHTML != "" && strHTML.indexOf("Review Payments") > 0){
				//navigate to Review Payment if only one link exist
				action = InquiryActionEnum.REVIEWPAYMENTS;		
			}
		}
	}

	// eFNOL
	if(action == InquiryActionEnum.REPORTCLAIM){
		reportClaim(policyRecord.policyNumber);
		return;
	}
	
	if(action == InquiryActionEnum.ENDORSEMENT && (status == undefined || status == 'undefined')){
		$("#alertEndorse").modal('show');	
		return;
	}  
	
	if((action == InquiryActionEnum.MAKEPAYMENT || action == 'Review Payments') && (status == undefined || status == 'undefined')){
		$("#alertPayments").modal('show');	
		return;
	}  

	if(status == undefined || status == 'undefined'){
		action=InquiryActionEnum.CLAIMS;
	}
	
	if(action == InquiryActionEnum.ENDORSEMENT && isAI2Record(policyRecord.dataSource)) {
		showEndorsementLandingBubble(policyRecord.policyNumber, policyRecord.term);
		return;
	}
	
	var url = getPolicyURL(action);
	
	if(url != '') {
		showLoadingMsg();
		document.actionForm.userAction.value = action;
		document.actionForm.policyKey.value = policyRecord.policyKey;
		document.actionForm.policyNumber.value = policyRecord.policyNumber;
		document.actionForm.policyStatus.value = encodeURI(policyRecord.policyStatus);
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

	}).fail(function(data) {
		//alert("error" + data);
	});
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
	this.state = this.row.state;
}

function checkToAccessOtherApp(rowId){
	// function which checks if we need to access other application from policy search results
	// if one policy found
	if(document.actionForm.showEndBubble.value != "Y" 
		&& document.actionForm.showEFNOL.value != "Y"){
			return;
	}
		
	var policyRecord = new PolicyRecord(rowId);
	var policyNumber = policyRecord.policyNumber;
	
	if(policyNumber != "" && policyNumber != undefined){
		if(document.actionForm.showEFNOL.value == "Y" && !LegacyPolicyNotHaveReportClaim(policyRecord)){
			// go to eFNOL application
			reportClaim(policyNumber);
		}else if(document.actionForm.showEndBubble.value == "Y"){
			// open up endorsement bubble
			var term = policyRecord.term;
			showEndorsementLandingBubble(policyNumber, term);
		}
	}
}

function blockPolicyDetails(response,action){
	var isLargePolicy = true;
	var isBlock = false;

	if(response === isLargePolicy){
		if( (action == InquiryActionEnum.ESIGNATURESTATUS)   
				|| (action == InquiryActionEnum.REVIEWPAYMENTS) 
				|| (action == InquiryActionEnum.REPORTCLAIM)){
			isBlock = false;
			return isBlock;
		}else{
			isBlock = true;
			return isBlock;
		}
	}else return isBlock;	
}