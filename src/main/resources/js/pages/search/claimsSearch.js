jQuery(document).ready(function() {
	
	/* JQGrid logic */
	$('#grid').jqGrid({
		url: document.actionForm.searchResultsURL.value.replaceAll("%25","'"),
		datatype:'json',
		mtype:'GET',
		colNames:['Name', 'Residence', 'Policy #', 'Date Of Loss', 'Claim #', 
		          'Status', 'Type', 'Row Number',
		          'Company', 'PolicyNumber', 'lob', 'houseNumber', 'address1', 
		          'city', 'zip', 'state', 'country', 'Term', 'First Name', 'Middle Name', 'Last Name',
		          'Effective Date', 'Expiration Date', 'dataSource'],
		colModel:[
	   		{ name:'name',
	   		  index:'name',
	   		  classes:'applicantName',
	   		  formatter:policyNameFormater,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   	        return obj.lastName + ', ' + obj.firstName;
	   		 },
	   		 width:150
	   		 },
	   		{ name:'residence', 
		   	  index:'residence', 
		   	  formatter:residenceFormater,
		   	  classes:'residence',
		   	  width:160
		   	},
	   		{ name:'policyNumber',
	   		  index:'policyNumber', 
	   		  classes:'policyNumber',
	   		  formatter:policyNumFormatter,
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			  return obj.policyNumber + obj.term;
		   		 },
	   		  width:155
	   		 }, 
	   		{ name:'dateOfLoss',
	   		  index:'dateOfLoss',
	   		  formatter:dateFormatter,
	   		  formatoptions:{newformat:'m/d/Y'},
	   		  datefmt:'Y-m-d',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			    return new Date(obj.dateOfLoss);
	   		  },
	   		  width:90
	   		},
	   		{ name:'claimNumber',
	   		  index:'claimNumber',
	   		  sortable:true,
	   		  sorttype:function (cell, obj) { 
	   			return obj.claimNumber;
	   		  },
	   		  width:115
		   	},
	   		{ name:'claimStatus',
	   		  index:'claimStatus',
			  sortable:true,
		   	  sorttype:'text',
		   	  width:118
		   	},
		   	{ name:'claimType',
	   	      index:'claimType',
			  sortable:true,
		   	  sorttype:'text',
	   	      width:117
		   	},
			 { name:'rowNumber',index:'rowNumber',hidden:true},
			 { name:'company',index:'company',hidden:true},
			 { name:'policyNumber',index:'policyNumber',hidden:true},
			 { name:'lob',index:'lob',hidden:true},
			 { name:'houseNumber',index:'houseNumber',hidden:true},
			 { name:'address1',index:'address1',hidden:true},
			 { name:'city',index:'city',hidden:true},
			 { name:'zip',index:'zip',hidden:true},
			 { name:'state',index:'state',hidden:true},
			 { name:'country',index:'country',hidden:true},
			 { name:'term', index:'term',hidden:true},
			 { name:'firstName', index:'firstName',hidden:true},
			 { name:'middleName', index:'middleName', hidden:true},
			 { name:'lastName', index:'lastName', hidden:true},
			 { name:'effectiveDate', index:'effectiveDate', hidden:true, formatter:dateFormatter},
			 { name:'expirationDate', index:'expirationDate', hidden:true, formatter:dateFormatter},
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
	
	   $('#alertNoEndorse').modal('hide');
	   $('#alertNoPayments').modal('hide');
	   
	   // Advanced Policy Search
	   $(document).on("click", ".openAdvPolSearch", function(){
		  $('#advSearchPolicyForm input[id="searchRequestSource"]').val("ClaimSearch");
		  openAdvPolicySearch();
	   });
	   initialFormLoadProcessing();
});

//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing() {
}

function submitPolicyActionForm(rowId, action) {
	
	var policyRecord = new PolicyRecord(rowId);
	var status = policyRecord.policyStatus;
	
	//TD 45315 - Policy # hyperlink should not take the user to inquiry if the status is incomplete
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
		$("#alertNoEndorse").modal('show');	
		return;
	}  
	
	if((action == InquiryActionEnum.MAKEPAYMENT || action == 'Review Payments') && (status == undefined || status == 'undefined')){
		$("#alertNoPayments").modal('show');	
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
		// check parameters
		showLoadingMsg();
		document.actionForm.company.value = policyRecord.company;
		document.actionForm.lob.value = policyRecord.lob;
		document.actionForm.claimNumber.value = policyRecord.claimNumber; 
		document.actionForm.term.value = policyRecord.term;
		document.actionForm.policyNumber.value = policyRecord.policyNumber;
		document.actionForm.state.value = policyRecord.state;
		document.actionForm.company.value = policyRecord.company;
		document.actionForm.lob.value = policyRecord.lob;
		document.actionForm.fromDate.value = policyRecord.effectiveDate;
		document.actionForm.toDate.value = policyRecord.expirationDate; 
		document.actionForm.action = document.actionForm.InquiryURL.value;
		document.actionForm.userAction.value = decodeURI(action);
		document.actionForm.requestSource.value = "PolicySearch";
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

/* Policy Record. Rowid is the row number from JQGrid*/
function PolicyRecord(rowId) {
	this.row = jQuery('#grid').getRowData(rowId);
	this.rowId = rowId;
	this.claimNumber = this.row.claimNumber; 
	this.term = this.row.term;
	this.policyNumber = this.row.policyNumber; 
	this.state = this.row.state;
	this.company = this.row.company;
	this.lob = this.row.lob;
	this.effectiveDate = this.row.effectiveDate;
	this.expirationDate = this.row.expirationDate;
	this.dataSource = this.row.dataSource;
}