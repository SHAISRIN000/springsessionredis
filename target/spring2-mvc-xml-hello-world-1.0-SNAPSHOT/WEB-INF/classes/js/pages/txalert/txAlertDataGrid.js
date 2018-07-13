/* Grid formatters needed to be changed once wiring is done*/
function nameFormater(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var name =  policyNameFormatter(cellValue, options, rowObject);
	var strHTML = "<div id=\"addInfo_" + rowId + "\" class=\"smallInfoIcon addInfo\"></div>";
	strHTML = strHTML +	"<span class=\"appName\">" + name + "</span>";
	
	return strHTML;
}
function policyTabNameFormater(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var name = policyHolderNameTR(cellValue);
	var strHTML = "<div id=\"addInfo_" + rowId + "\" class=\"smallInfoIcon addInfo\"></div>";
	strHTML = strHTML +	"<span class=\"appName\">" + name + "</span>";
	
	return strHTML;
}

function policyNameFormatter(cellValue, options, rowObject)  { 
	var lastName, firstName;
	var name = "";
	
	lastName = rowObject.lastName;
	firstName = rowObject.firstName;
	
	if(lastName == "Unavailable"){
		lastName = "";
	}
	if(firstName == "Unavailable"){
		firstName = "";
	}
	
	if(lastName != "" && lastName != null && lastName != undefined) {
		name = capitalizeFirstChar(lastName.toLowerCase());
	}
	
	if(firstName != "" && firstName != null && firstName != undefined) {
		name =	name + (name!=""?', ':'')+capitalizeFirstChar(firstName.toLowerCase());
	}
	
	  if(name == ""){
		  name = "Unavailable";
	  }	
	
	return "&nbsp;" + name;
}

function reviewedFormatter(cellValue, options, rowObject){
	var rowId = rowObject.rowNumber;
	var data = $('#grid').jqGrid('getGridParam', 'data');
	var checked = "";

    if(data[rowId-1]["reviewedInd"] == 1){
    	checked = "checked";
    }
    var strHTML = "<input type=\"checkbox\" id=\"alertsChkBox_" + rowId + "\" class=\"alerts_ChkBox\" onclick=\"javascript:generateURLForUpdateReview('" + rowId + "')\"; " + checked + ">";
	return strHTML;
}
function policyNumFormater(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var policyNumber = rowObject.policyNumber;
	var status = rowObject.status;
    var action = 'Inquiry';
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
	var polSequenceNumber = policySeqFormatterForAlerts(cellValue, options, rowObject);
	
	var parms = "'" + rowId  + "','" + action + "'";
		
		var	strHTML = "<a href=\"javascript:submitPolicyActionForm(" + parms + ")\">";
	    strHTML = strHTML + "<span id=\"policyNumber_" + rowId + "\">" +policyNumber+polSequenceNumber+"</span></a>";
	    strHTML = strHTML +	"<span id=\"actionsArrow_" +  rowId + "\" class=\"lightBlueCaratIcon actionsArrow\"></span>";
		strHTML = strHTML + "<div id=\"actionsList_" +  rowId + "\" class=\"actionsFlyout\"></div>";
		return strHTML;
} 

function policySeqFormatterForAlerts(cellValue, options, rowObject)
{
	var sequenceNuber= rowObject.policySeqNum;
	if(sequenceNuber == null || sequenceNuber == "" || typeof sequenceNuber == 'undefined'){
	result = "";
	}else{
		result = "- "+sequenceNuber;
	}
	return result;
} 
function contactInfoFormater(cellValue , options , rowObject){
	
	var rowId = options.rowId;
	var emailAddress = rowObject.emailAddress;
	var workPhoneNum  = rowObject.workPhoneNumber;
	var homePhoneNum = rowObject.homePhoneNumber;
	var cellPhoneNum = rowObject.cellPhoneNumber;
	var contactInformation = "";
	
	if(homePhoneNum != "" && homePhoneNum != null && homePhoneNum != undefined) {
		contactInformation = "H : "+homePhoneNum;
	}
	  if(workPhoneNum != "" && workPhoneNum != null && workPhoneNum != undefined) {
		  if(contactInformation != ""){
		    	 contactInformation = contactInformation + "<br>";
		    }
		contactInformation = contactInformation + "W : "+workPhoneNum;
	}
	  
	  if(cellPhoneNum != "" && cellPhoneNum != null && cellPhoneNum != undefined) {
		  if(contactInformation != ""){
		    	 contactInformation = contactInformation + "<br>";
		    }
		contactInformation = contactInformation + "M : "+cellPhoneNum;
	}
	
	  if(emailAddress != "" && emailAddress != null && emailAddress != undefined) {
		  var recipient = "mailto:"+emailAddress;
		  var strHTML =  "<a href=\"" +recipient+ "\">";
		    strHTML = strHTML + "<span id=\"emailIDInAlerts" + rowId + "\">"+emailAddress+"</span></a>";
		    if(contactInformation != ""){
		    	 contactInformation = contactInformation + "<br>";
		    }
		  contactInformation = contactInformation +strHTML; 
	  }
	  
	  if(contactInformation == ""){
		  contactInformation = "Unavailable";
	  }
	return contactInformation;
}

function contactInfoFormaterForBilling(cellValue , options , rowObject){
	
	var rowId = options.rowId;
	var commInfo = rowObject.commInfo;
	var contactInformation = "";
	
	if(commInfo != "" && commInfo != null && commInfo != undefined) {
		contactInformation = commInfo;
	}
	
	return contactInformation;
	
}

function statusFormatterAlert(cellValue, options, rowObject)  { 
	var rowId = options.rowId;
	var action = 'Make A Payment';
	var params =  "'" + rowId + "','" + action+"'";
	var type = rowObject.transactionType.toUpperCase();
	var result = "Not Enrolled";
	var pendingCancellation = "PENDING_CANCELL";
	var eSignature = "TX_ESIGNATURE";
	var notReceived = "Not Received";
	var pending = "PENDING";
	var sent = "SENT";
	
	if(type.indexOf(pendingCancellation)!=-1){
		//result = "Non-Payment"; 
		if(type.indexOf(pendingCancellation)!=-1){
			var totalStatus = "";
			var minDue =  rowObject.minnimumDue;
			var balanceDue = rowObject.balanceDue;
			
			if(minDue != "" && minDue != null && minDue != undefined){
				totalStatus = totalStatus+"<br><a href=\"javascript:submitPolicyActionForm(" + params + ")\">Min Due "+moneyFormatterForAlerts(minDue)+"</a>";
			}
			if(balanceDue != "" && balanceDue != null && balanceDue != undefined){
				totalStatus = totalStatus+"<br><a href=\"javascript:submitPolicyActionForm(" + params + ")\">Balance "+moneyFormatterForAlerts(balanceDue)+"</a>";
			}
			result = "Non-Payment"+totalStatus; 
		}
	}else if(type.indexOf(eSignature)!=-1) {
		if(rowObject.status.toUpperCase().trim() == pending || rowObject.status.toUpperCase().trim() == sent){
			result = notReceived;
		}else{
				result = rowObject.status; 
			}
	}
	return result;
}

function policyStatusFormatter(cellValue, options, rowObject)  { 
	
	var transactionType = rowObject.policyTransactionType.toUpperCase();
	

	if(transactionType.indexOf("ENDORSEMENTS")!=-1){
		result = "Old Premium: "+rowObject.originalPremium + "<br>Premium Change: "+rowObject.premiumChange; 
	}else if(transactionType.indexOf("RENEWALS")!=-1) {
				result = "Effective: "+rowObject.policyEffDate.toUpperCase(); 
	}
	else if(transactionType.indexOf("REINSTATEMENTS")!=-1) {
		   	result = "Active"; 
	} 
	else if(transactionType.indexOf("REINSTATEMENT WITH LAPSE")!=-1) {
	   	result = "Active";
	}
	else if(transactionType.indexOf("NEW BUSINESS SUBMISSIONS")!=-1) {
	   	result = "Effective: "+rowObject.policyEffDate.toUpperCase(); 
	} 
	else if(transactionType.indexOf("CANCELLATIONS")!=-1) {
	   	result = "Canceled<br>"+ "Canceled reason:<br>"+rowObject.cancellationReason.toUpperCase(); 
	}
	else{
		result =  " ";
	}
	return result;
} 

function currentPremiumForPolicyFormatter(cellValue, options, rowObject){
	var transactionType = rowObject.policyTransactionType.toUpperCase();

	if(transactionType.indexOf("ENDORSEMENTS")!=-1){
		result = rowObject.totalPremium; 
	} else{
	   	result = rowObject.premiumChange; 
	}
	return result;
}

function policyNumberSeqFormatter(cellValue, options, rowObject)
{
	var policyNumber = rowObject.policyNumber;
	var sequenceNuber= rowObject.transactionSeqNo;
	result= policyNumber+"- "+sequenceNuber;
	return result;
}

// MouseEnter MouseLeave actions on grid row
/*$("td.policyName").live({
	mouseenter: function(e){
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		genAddInfoPolicyName(rowId);
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
.on("mouseenter", "td.policyName", function(e) {
	var trRow = $(this).parent();
	var rowId = $(trRow).attr('id');
	genAddInfoPolicyName(rowId);
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
})
.on("mouseleave", "td.policyName", function(e) {
	var trRow = $(this).parent();
	var rowId = $(trRow).attr('id');
	hideAddInfo(rowId);
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
});

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

/*$("td.policyNumber").live({
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
	});*/

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

/*$("td.contactInfoAlerts").live({
	mouseenter: function(e){
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		hideToolTip($(this));
		genHoverForContactInfo(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	},
	mouseleave: function(e){
		var trRow = $(this).parent();
		var rowId = $(trRow).attr('id');
		clearActionsContactInfo(rowId);
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	}
});*/

$(document)
.on("mouseenter", "td.contactInfoAlerts", function(e) {
	var trRow = $(this).parent();
	var rowId = $(trRow).attr('id');
	hideToolTip($(this));
	genHoverForContactInfo(rowId);
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
})
.on("mouseleave", "td.contactInfoAlerts", function(e) {
	var trRow = $(this).parent();
	var rowId = $(trRow).attr('id');
	clearActionsContactInfo(rowId);
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
});

/*$("tr.jqgrow").live({
	mouseenter: function(e){
		var rowId = $(this).attr('id'); 
			$('#addInfo_' + rowId).show();
			$('#actionsArrow_' + rowId).show();
			$('#actionsArrowContactInfo_' + rowId).show();
	},
	mouseleave: function(e){
		var rowId = $(this).attr('id');
			$('#addInfo_' + rowId).hide();
   		$('#actionsArrow_' + rowId).hide();
   		$('#actionsArrowContactInfo_' + rowId).hide();
	}
});*/

$(document)
.on("mouseenter", "td.jqgrow", function(e) {
	var rowId = $(this).attr('id'); 
	$('#addInfo_' + rowId).show();
	$('#actionsArrow_' + rowId).show();
	$('#actionsArrowContactInfo_' + rowId).show();
})
.on("mouseleave", "td.jqgrow", function(e) {
	var rowId = $(this).attr('id');
	$('#addInfo_' + rowId).hide();
	$('#actionsArrow_' + rowId).hide();
	$('#actionsArrowContactInfo_' + rowId).hide();
});

function genAddInfo(rowId){
var allPolicyRecord = new PolicyRecord(rowId);


var strHTML = "<ul id=\"addInfoList\" class=\"noBullets\">";
strHTML = strHTML + "<li><span class=\"infoLabel\">Producer:</span><span class=\"infoValue\">" 
	+ checkAddInfoValue(allPolicyRecord.producerCD) + "</span></li>";
strHTML = strHTML + "<li><span class=\"infoLabel\">Term:</span><span class=\"infoValue\">" 
+ checkTerm(allPolicyRecord.effectiveDate , allPolicyRecord.expirationDate) + "</span></li>";
strHTML = strHTML + "<li><span class=\"infoLabel\">LOB:</span><span class=\"infoValue\">" 
+ checkAddInfoValue(allPolicyRecord.lob) + "</span></li>";
strHTML = strHTML + "<li><span class=\"infoLabel\">State:</span><span class=\"infoValue\">" 
	+ checkAddInfoValue(allPolicyRecord.state) + "</span></li>";

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
function genAddInfoPolicyName(rowId){
	var allPolicyRecord = new PolicyTabRecord(rowId);	
	var source = allPolicyRecord.policyTransactionType;
	if(source.indexOf('NEW BUSINESS')-1)
		{
		source=allPolicyRecord.newBusinessSource;
		}
	else if(source.indexOf('ENDORSEMENT')-1)
		{
		source=allPolicyRecord.endorsementSource;
		}

	var strHTML = "<ul id=\"addInfoList\" class=\"noBullets\">";
	strHTML = strHTML + "<li><span class=\"infoLabel\">LOB:</span><span class=\"infoValue\">" 
		+ checkAddInfoValue(allPolicyRecord.policyLOB) + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">Policy Effective Date:</span><span class=\"infoValue\">" 
	+ checkAddInfoValue(allPolicyRecord.policyEffDate) + "</span></li>";
	strHTML = strHTML + "<li><span class=\"infoLabel\">Transaction Source:</span><span class=\"infoValue\">" 
	+ checkAddInfoValue(source) + "</span></li>";

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
/* Additional Info */
function hideAddInfo(rowId){
	$('#addInfo_' + rowId).popover('destroy');
}

//For TXAlerts/TR/DocSearch
function PolicyRecord(rowId) {
	var activeGrid = findGridId();
	this.row = jQuery('#'+activeGrid).getRowData(rowId);
	
	if(activeGrid == "billinggrid"){
		this.policyNumber = $(this.row.policyNumber).text().substring(0,14); 
		this.policyStatus = this.row.status;
		this.company = this.row.company;
		this.term = this.row.transactionSeqNo;
		this.state = this.row.state;
		this.effectiveDate = this.row.policyEffDate;
		this.expirationDate = this.row.policyExpDate;
		this.rowId = rowId;
		this.transactionType = this.row.transactionType;
		this.processDate = this.row.processDate;
		this.actionDate = this.row.actionDate;
		this.source = this.row.endorsementSource;
		this.dataSource = "LEGACY";
		
		if(this.row.policyLOB!= null){
			this.lob = this.row.policyLOB.trim();
			if(this.lob == "ALN_PA"){
				this.lob = "PA"
			}
			if(this.lob == "PIC_NEW_CA"){
				this.lob = "CA"
			}
			if(this.lob == "ALN_HO"){
				this.lob = "HO"
			}
		if(this.row.policyLOB.indexOf("ALN") >= 0){
			this.dataSource = 'PRIME';
		}
		}
		if(this.state == 'NJ'){// TD #71218
			this.state = 'PA'
		}
		
		if(this.transactionType != null && this.transactionType.trim() == "Cancellation"){
			this.policyStatus = InquiryPolicyStatus.CANCELED	
		}
		
		
	}else if(activeGrid == "claimsGrid"){
		//ClaimsTR properties
		this.policyNumber = this.row.policyNumber;
		this.claimNumber = this.row.claimNumber;
		this.policyStatus = this.row.status;
		this.lob = this.row.lob;
		this.company = this.row.company;
		this.term = this.row.polSeqNumber;
		this.effectiveDate = this.row.effectiveDate;
		this.expirationDate = this.row.expirationDate;
		this.uwCompany = this.row.uwCompany;
		this.channelCD = this.row.channelCD;
		this.rowId = rowId;
		this.processDate = this.row.processDate;
		this.actionDate = this.row.actionDate;
		this.state = this.row.state;
		this.dataSource = "PRIME";
		this.agencyHierarchyID = this.row.agencyHierarchyID;
		
	}
	else if(activeGrid == "policygrid"){
		//Policy TR properties
		this.policyNumber = $(this.row.policyNumber).text().substring(0,14); 
		this.policyStatus = this.row.status;
		this.term = this.row.transactionSeqNo;
		this.company = this.row.companyName;
		this.effectiveDate = this.row.policyEffDate;
		this.expirationDate = this.row.policyExpDate;
		this.rowId = rowId;
		this.processDate = this.row.policyProcessDate;
		this.state = this.row.transactionState;
		this.source = this.row.newBusinessSource;
		this.dataSource = "LEGACY";
		
		if(this.row.policyLOB!= null){
			this.lob = this.row.policyLOB.trim();
			if(this.lob == "ALN_PA"){
				this.lob = "PA"
			}
			if(this.lob == "PIC_NEW_CA"){
				this.lob = "CA"
			}
			if(this.lob == "ALN_HO"){
				this.lob = "HO"
			}
		if(this.row.policyLOB.indexOf("ALN") >= 0){
			this.dataSource = 'PRIME';
		}
		}
		
		if(this.row.status!= null && this.row.status.indexOf("Canceled") >= 0){
			this.policyStatus = InquiryPolicyStatus.CANCELED
		}
	}
	else{
		//TxAlerts properties
		this.policyNumber = $(this.row.policyNumber).text().substring(0,14);
		this.policyStatus = this.row.status;
		this.lob = this.row.lob;
		this.company = this.row.company;
		this.term = this.row.policySeqNum;
		this.effectiveDate = this.row.effectiveDate;
		this.expirationDate = this.row.expirationDate;
		this.uwCompany = this.row.uwCompany;
		this.channelCD = this.row.channelCD;
		this.rowId = rowId;
		this.processDate = this.row.processDate;
		this.actionDate = this.row.actionDate;
		this.state = this.row.state;
		this.emailId = this.row.emailAddress;
		this.dataSource = this.row.dataSource;
		this.agencyHierarchyID = this.row.agencyHierarchyID;
		this.producerHierarchyID = this.row.producerHierarchyID;
		this.producerCD = this.row.producerCD;
	}
}
function PolicyTabRecord(rowId) {
	this.row = jQuery('#policygrid').getRowData(rowId);
	this.policyName = $(this.row.name).text(); 
	this.policypolicys = this.row.policy;
	this.policyTransactionType = this.row.policyTransactionType;
	this.status = this.row.status;
	this.processdate = this.row.processdate;
	this.policyEffDate = this.row.policyEffDate;
	this.currentPremium = this.row.currentPremium;
	this.policyLOB = this.row.policyLOB;
	this.transactionSource = this.row.transactionSource;
	this.newBusinessSource = this.row.newBusinessSource;
	this.endorsementSource = this.row.endorsementSource;
}

/* Actions */
function genActionsListAQ(rowId){
	var policyRecord = new PolicyRecord(rowId);
	var state = policyRecord.state;
	var lob = policyRecord.lob;
	
	if("claimsGrid" == findGridId()){
		$('#actionsList_' + rowId).html(genActionsListByRowIdWithoutProofOfInsurance(rowId));
	} else if ("policygrid" == findGridId()){
		if(("NJ" == state) && ("HO" == lob)){
			$('#actionsList_' + rowId).html(genActionsListByRowIdWithoutProofOfInsurance(rowId));
		} else {
			$('#actionsList_' + rowId).html(genActionsListByRowId(rowId));
		}
	} else if ("billinggrid" == findGridId()){
		if((("NJ" == state) && ("HO" == lob)) || (("NJ" == state) && ("CA" == lob))){
			$('#actionsList_' + rowId).html(genActionsListByRowIdWithoutProofOfInsurance(rowId));
		} else {
			$('#actionsList_' + rowId).html(genActionsListByRowId(rowId));
		}
	} else {
		if(("NJ" == state) && ("HO" == lob)){
			$('#actionsList_' + rowId).html(genActionsListByRowIdWithoutProofOfInsurance(rowId));
		} else {
			$('#actionsList_' + rowId).html(genActionsListByRowId(rowId));
		}
	}
	
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
		    actualHeight = 330;
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

function genActionsListByRowIdWithoutProofOfInsurance(rowId){

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
				           InquiryActionEnum.REPORTCLAIM];
		}else{
			actionsList = [InquiryActionEnum.POLICY, 
				           InquiryActionEnum.BILLING, 
				           InquiryActionEnum.CLAIMS,
				           InquiryActionEnum.DOCUMENTS,
				           InquiryActionEnum.MAKEPAYMENT,
				           InquiryActionEnum.REVIEWPAYMENTS,
				           InquiryActionEnum.ENDORSEMENT,
				           InquiryActionEnum.ESERVICES];
		}
		
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
	}
	
	
	if (actionsList.length > 0) {
		strHTML = "<ul class=\"actionList\">";
		$.each(actionsList, function(id, action) {
			//TD 49015 -Teachers Independent Agent should not be able to view notes
			//TD 66396 - Remove Notes and Request Proof of Insurance from the policy dropdown
			if(action == 'Notes' && ((policyState != 'NJ' && policyState != 'PA' && !isEmployee()) 
									 || ((policyState == 'NJ' || policyState == 'PA') && isTeachersPolicyNumber(policyNumber) && isIndependentAgentLogin())
									 || (policyState == 'PA' && lob == 'HO'))) {
			
				//skip generation of Notes flyout 
			}else if(action == 'Request Proof of Insurance' && (policyState == 'PA' && lob == 'HO')){
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

function submitPolicyActionForm(rowId, action) {
	
	// Storing checked records
	storeCheckedAlerts();
	
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
		showEndorsementLandingBubbleForAlerts(policyRecord.policyNumber, policyRecord.term, policyRecord.company, policyRecord.state);
		return;
	}
	
	var url = getPolicyURL(action);
	
	if(url != '') {
		showLoadingMsg();
		document.actionForm.userAction.value = action;
		document.actionForm.policyKey.value = policyRecord.policyKey;
		document.actionForm.policyNumber.value = policyRecord.policyNumber;
		document.actionForm.claimNumber.value = policyRecord.claimNumber;
		document.actionForm.policyStatus.value = encodeURI(policyRecord.policyStatus);
		document.actionForm.term.value = policyRecord.term;
		document.actionForm.company.value = policyRecord.company;
		document.actionForm.state.value = policyRecord.state
		document.actionForm.lob.value = policyRecord.lob;
		document.actionForm.fromDate.value = policyRecord.effectiveDate;
		document.actionForm.toDate.value = policyRecord.expirationDate;
		document.actionForm.checkedRecords.value = $('#checkedAlerts').val();
		document.actionForm.unCheckedRecords.value = $('#unCheckedAlerts').val();
		document.actionForm.action = document.actionForm.TxAlertInquiryURL.value;
		document.actionForm.requestSource.value = "Inquiry";
		document.actionForm.method="POST";
		document.actionForm.submit();
	}
}

function clearActionsList(rowId){
	$('#actionsArrow_' + rowId).popover('destroy');
}
 
function clearActionsContactInfo(rowId){
	$('#actionsArrowContactInfo_' + rowId).popover('destroy');
}

function checkAddInfoValue(item){
	if(item == "" || item == null || item == 0){
		item = "Unavailable";
	}
	
	return item;
}

function checkTerm(termStart , termEnd){
	if((!termStart == "" || !termStart == null) && (!termEnd == "" || !termEnd == null)){
		
		result = termStart +"-"+ termEnd;
	}else{
		result = "Unavailable";
	}
	
	return result;
}

function policySeqFormatterForPolicy(cellValue, options, rowObject)
{
	var sequenceNuber= rowObject.transactionSeqNo;
	if(sequenceNuber == null || sequenceNuber == "" || typeof sequenceNuber == 'undefined'){
	result = "";
	}else{
		result = "- "+sequenceNuber;
	}
	return result;
} 

function txAlertTypeFormatter(cellValue, options, rowObject)
{
	var type= rowObject.transactionType;
	if(type.indexOf("EDOCUMENTS")!=-1){
	result = 'eDocuments Enrollment';
	}
	else if(type.indexOf("PENDING_CANCELL")!=-1)
	{
		result = 'Pending Cancellation';
	}
	else{
		result = 'eSignature';
	}
		
	return result;
} 

function moneyFormatterForAlerts(cellValue){
	var charIndxPos = cellValue.indexOf(".");
	if(charIndxPos > -1){
		cellValue = "$" + numberWithCommas($.trim(cellValue.substring(0,charIndxPos)))+cellValue.substring(charIndxPos,charIndxPos+3);
	}
	return cellValue;
}

//Contact Info actions
function genActionsListForContactInfo(rowId) {
	var strHTML = "";
	var allPolicyRecord = new PolicyRecord(rowId);
	var emailId = allPolicyRecord.emailId;
	var recipient = "mailto:"+emailId;
	
		strHTML = "<ul class=\"actionList\">";
				strHTML = strHTML + "<li class=\"menuItem\"><a href=\"" + recipient + "\">" + emailId + "</a></li>";
		strHTML = strHTML + "</ul>";
	return strHTML;
}

function genHoverForContactInfo(rowId){
	$('#actionsListForContactInfo_' + rowId).html(genActionsListForContactInfo(rowId));
	
	// display arrow icon if not visible
	if(!$('#actionsArrowContactInfo_' + rowId).is(':visible')) {
		$('#actionsArrowContactInfo_' + rowId).show();
	}
	
	$('#actionsArrowContactInfo_' + rowId).popover({
		html: true,
		content: $('#actionsListForContactInfo_' + rowId).html(),
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

/*TXAlerts Date Fromatter*/
function alertsDateFormatter(cellValue)  { 
	var result = 'Unavailable';
	if(cellValue != null && cellValue != "" && cellValue != undefined){
		var dateArr = cellValue.split("-");
		if(dateArr.length == 3){
		result = dateArr[1]+"/"+dateArr[2].substring(0,2)+"/"+dateArr[0];
		}
	}
		
		return result;
}

function showEndorsementLandingBubbleForAlerts(policyNumber, term, company, state) {
	if (typeof company === 'undefined') {company = "";}
	if (typeof state === 'undefined') {state = "";}

	resetLandingBubble();

	// reset endorsement effective date field
	var dateLabel = "mm/dd/yyyy";
	$('#endCanEffectiveDateId').val(dateLabel).addClass('watermark');
	
	var url = document.actionForm.TxAlertEndBubbleURL.value;
	var FORM_CSRF_TOKEN = document.actionForm.FORM_CSRF_TOKEN.value;

	url = url.replace("{policyNumber}", policyNumber); 
	url = url.replace("{term}", term); 
	url = addRequestParam(url, "company", company);
	url = addRequestParam(url, "state", state);
	url = addRequestParam(url, "checkedRecords",  $('#checkedAlerts').val());
	url = addRequestParam(url, "unCheckedRecords", $('#unCheckedAlerts').val());
	url = addRequestParam(url, "FORM_CSRF_TOKEN", FORM_CSRF_TOKEN);
	url = addRequestParam(url, "_uid", new Date().getTime());

	$.ajax({
		url : url,
		type : 'GET',
		cache: false,
		beforeSend : function(status, xhr) {
			showLoadingMsg();
		},

		success : function(data) {
			if(data !=null || data !=undefined) {
				var strJSON = JSON.stringify(data).replaceAll("[", "").replaceAll("]", "");
				if(strJSON.length > 0){
					// First Insured & Second Insured (if any)
					var firstInsured = formatApplicantName(capitalizeFirstChar(data.firstName1), 
							capitalizeFirstChar(data.lastName1), capitalizeFirstChar(data.middleName1), " ");
					
					updateLandingBubbleData(firstInsured, data.policyStatus, data.policyTerms, data.term);
					updateAccountNumber(data.accountNumber);
					updateMinimumPayemntDue(data.minimumPayemntDue);
					updateIsPayrollDeductPlan(data.isPayrollDeductPlan);
					updatePolicyForm(data.policyForm);
				    
				}
			}
		},

		error : function(data) {
			$("#endBubbleDialogBody").html("ERROR:"+ data);
		},

		complete : function() {
			$.unblockUI();
			$("#endBubbleDialog").modal('show');
		}

	});
	
}

function isPalPolicyNumber(policyRecord) {
	//globalSearch.js method overrided
	var company = policyRecord.company.toUpperCase();

	if (company == "PA" || company == "PSIA" || company == "PPCIC" || company == "PIC"
			|| policyRecord.policyNumber.substring(0, 3) == "PAA") {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveEndorsements(policyRecord) {
	//Overriding function from globalSearch.js - TD #70681
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob;
	var state = policyRecord.state;

	if ((dataSource == DataSourceEnum.LEGACY && isPalPolicyNumber(policyRecord) && lob == "CA")
			|| (dataSource == DataSourceEnum.LEGACY && policyRecord.policyNumber
					.substring(0, 4) == "TCA0")
			|| (dataSource == DataSourceEnum.LEGACY
					&& isPalPolicyNumber(policyRecord) && lob == "HO")
			|| (lob == "PCAT") || (state == "NJ" && lob == "HO") || (state == "NJ" && lob == "CA") || (state == "NJ" && lob == "PIC_NEW_CA") ||(state == "PA" && lob == "CA")) {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveEServices(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob.toUpperCase();
	var state = policyRecord.state.toUpperCase();
	var currentGrid = findGridId();
	var disabledEServicesFlag= "YES";
	
	if(("claimsGrid" == currentGrid)){
		disabledEServicesFlag = "NO";
	} 

	if (dataSource == DataSourceEnum.LEGACY && (lob == "CA" || lob == "PCAT" || lob == "PUM")) {
		return true;
	} else if(("YES" == disabledEServicesFlag) && ((state == "NJ" && lob == "HO") || (state == "PA" && lob == "HO"))) {
		return true;
	} else {
		return false;
	}
}

function LegacyPolicyNotHaveReportClaim(policyRecord) {
	var dataSource = policyRecord.dataSource;
	var lob = policyRecord.lob.toUpperCase();
	var state = policyRecord.state.toUpperCase();
	var currentGrid = findGridId();
	var enabledReportClaimFlag= "NO";
	
	if(("policygrid" == currentGrid) || ("billinggrid" == currentGrid)){
		enabledReportClaimFlag = "YES";
	} 
	
	if(("YES" == enabledReportClaimFlag) && ((state == "NJ" && lob == "PCAT") || (state == "PA" && lob == "PCAT"))) {
		return false;
	} else if (dataSource == DataSourceEnum.LEGACY && lob == "PCAT") {
		return true;
	} else {
		return false;
	}
}