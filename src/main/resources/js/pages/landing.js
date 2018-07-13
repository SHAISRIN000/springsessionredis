jQuery(document).ready(function() {	
//$('#contentUploads').removeClass('hidden');
	//open up app in new window if we are coming back to landing after clicking on specific link
	openUpAppInNewWin();
	
	$('#aiForm').ajaxStart(function () {
		blockUser();
	});

	$('#aiForm').ajaxStop(function () {
		$.unblockUI();
	});
	
	$('#mcSubHeading').html("Landing");
	
	// Show / hide New buttons
	var index = 0;
	$(".messageDate").each(function () {
	//	var index = this.id.substring('messageDate_'.length);
		var ONE_DAY = 1000 * 60 * 60 * 24;
		
		var date1temp = new Date($("#messageDate_" + index).val());
		var date2temp = new Date($("#currDate").val());
		var date1_ms = date1temp.getTime();
		var date2_ms = date2temp.getTime();
		var difference_ms = Math.abs(date1_ms - date2_ms);
		
		if (Math.round(difference_ms/ONE_DAY) > 7) {
			$("#newStar_" + index).hide();
		}
		index = index + 1;
	});
	
	// Bind message buttons
	
	$(".messageLinkMain").click(function (){
		showMessageModal(this);
	});
	
	$(document).on("click", ".messageLinkMyView", function(){
		var msgDetails=$('#messageDetails_'+this.id);
		var detailsMsg = msgDetails.html();
		showMessageFromMyView(this, detailsMsg);
	});
	
	function showMessageFromMyView(message , detailsMsg) {
		var title = $(message).html();		
		$('#msgHeader').html(title);		
		var index = message.id.substring(message.id.lastIndexOf("_") + 1);
		//var detail = $('#messageDetailCT_' + index);
		var msgDetail = $('#msgDetail');
		msgDetail.html(detailsMsg);
		$("a", msgDetail).click(function () {
			return openLink($(this));
		});
		$('#messageDialog').modal('show');
	}
	
	$('#viewAllMessages').click(function (){
		//put reset color for message
			document.actionForm.action = "/aiui/landing/messages";
			document.actionForm.method="POST";
			document.actionForm.submit();
		
	});
    
	$(".primaryLink").click(function() {
		var contents =  $('#' + this.id + '_Contents');
		var contentsHTML = contents.html();
		if (contentsHTML == null || contents.length == 0) {
			// tjmcd - IE hack
			createLinks(this, this.id, 
					function(primaryLink, response) {
						showPrimaryPage(primaryLink, response);			
			});	
		} else {
			showPrimaryPage(this, null);			
		}
	});
		
	$('#marketing').click(function (){
		showContentPage('Marketing');		
	});	
	
	
	$('#products').click(function (){
		//showProductLinesPage();
		showContentPage('Product Lines');
	});

	$('#resources').click(function (){
		//showResourcePage();
		showContentPage('Resources');
	});
	
	
	//click marketing breadcrumbs 
	$('#marketing_ShowPrimary').click(function (){
		showMarketingPage();		
		$("#marketingContentsNJImg").attr('src', '../aiui/resources/images/plus.gif');
		$('#marketingBrandAndAdvCaptive').addClass('hidden');		
	});
	
//	$('#products').click(function (){
//		//showProductLinesPage();
//		showContentPage('Product Lines');
//	});
	//click products breadcrumbs
	$('#products_ShowPrimary').click(function (){
		showProductLinesPage();
		$("#productlinesContentsNJImg").attr('src', '../aiui/resources/images/plus.gif');
		$('#productLinesCaptive').addClass('hidden');
	});
	

	//click resources breadcrumbs
	$('#resources_ShowPrimary').click(function (){
		showResourcePage();
		$("#resourcesContentsNJImg").attr('src', '../aiui/resources/images/plus.gif');
		$('#resourcesFieldForms').addClass('hidden');
	});	
	
	
	
	//2.4 changes starts here

	
//	$('#showMainContent').click(function () {
//		showMainPage();
//	});
    
	$(".footerLinks").each(function() {
		// tjmcd - IE hack
		createLinks(this, this.id, 
			function(footerLink, response) {
            	showFooterLinks(footerLink, response);			
		});	
	});
	
    // This is a work-around function when All Quotes breaks
	$("#goToClientLink").click(function (){
		document.actionForm.policyNumber.value = $("#globalSearchInput").val();
		document.actionForm.action = "/aiui/policies/policy/" + encodeURI(document.actionForm.policyNumber.value);
		document.actionForm.nextTab.value = 'client';
		document.actionForm.method="POST";
		document.actionForm.submit();
	});
	
	// Enabling submission of New Quote and Agency Profile with enter key
	$('#productNQ_chosen, #agencyProfileNQ_chosen').keyup(function(e){
	    if(e && e.keyCode == 13) {
	       $('#submitNewQuote').click();
	    }
	});
	
	$('#producerAP_chosen').keyup(function(e){
	    if(e && e.keyCode == 13) {
	       $('#submitAgencyProfile').click();
	    }
	});
	
	$("#stateId").change(function(){	
		//if($("#stateId").val() =='CT' || $("#stateId").val() =='MA'){
		if($("#stateId").val() =='CT' || $("#stateId").val() =='MA' || $("#stateId").val() =='NH'){
			$('#channelId').val('Independent Agent').trigger('chosen:updated');
			$("#channelId").dropdownchecklist("refresh");
		}
		if($("#stateId").val() =='NJ'){
			$('#channelId option').each(function() { 
				$(this).prop('selected', true);
			});
			$("#channelId").dropdownchecklist("refresh");
		}
		validateMyViewSelections($("#stateId").val(),$("#channelId").val());
		//$("#channelId").dropdownchecklist("refresh");
	 });
	
	$("#channelId").change(function(){	
		validateMyViewSelections($("#stateId").val(),$("#channelId").val());
	 });
		
	$('.ui-dropdownchecklist-selector-wrapper').keydown(function(e){
		if(e.keyCode == 40) { 
			$(this).find('.iconOpen').trigger('click');   
		}   
	});

	// Close the multi select dropdown when pressign tab from last option
	$('.ui-dropdownchecklist-dropcontainer div.ui-dropdownchecklist-item:last input').keydown(function(e){
		if(e.keyCode == 9) { 
			var iconClose = $(this).parent().parent().parent().parent().find('.iconClose');
			if(iconClose && iconClose.length > 0) {
				setTimeout(function(){ iconClose.trigger('click'); }, 200);
			}
		}
	});
	
	$('#changeMyViewModal').click(function(){
		$('#ddcl-stateId-ddw').parent().find('.iconClose').trigger('click');
		$('#ddcl-channelId-ddw').parent().find('.iconClose').trigger('click');
	});
	
	if($('#hoErrMsg').val() == 'rateErrorForHomeowners'){
		$('#rateErrorForHomeowners').modal('show');
	}else if($('#hoErrMsg').val() == 'rateErrorForTerrNotFound'){
		$('#rateErrorForTerrNotFound').modal('show');
	} 
	
	//Tx-Alerts
	$('.listTxAlert').click(function (){
		var txId = this.id;
		document.aiForm.txAlertType.value = txId;
		if(txId=='REINSTATE'){
			txId = 'Reinstate,Rescind,Reinstate with Lapse-Same Term';
			document.aiForm.txRepType.value = txId;
			document.aiForm.action = "/aiui/billingTxReporting/billing";
		}else if(txId=='CANCEL'){
			document.aiForm.txRepType.value = txId;
			document.aiForm.action = "/aiui/txPolicy/fetchTxPolicy";
		}else{
			document.aiForm.action = "/aiui/landing/fetchTxAlerts";
		}
		document.aiForm.method="POST";
		document.aiForm.submit();
		
});

	
	$('select[id="qqAgency"]').change(function () {
		var producerCd = $('#qqAgency').val()||'';
		if(producerCd.length>1){
			$('#qqSubmitAgency').removeAttr('disabled');
		}
	});
	
	$('#qqSubmitAgency').bind("click", function(){
		var producerCd = $('#qqAgency').val()||'';
		if(producerCd.length<1){
			var msg = "Agency profile should be selected" ;
			msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
			$(".qqErrorAlertMsg").html(msg);
			$(".qqErrorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");	
			return false;
		}
		
		var event = jQuery.Event(getSubmitEvent());
		$('#actionForm').trigger(event);
		if (event.isPropagationStopped()) { 
			$.unblockUI();
		}else{
			showLoadingMsg();
			document.actionForm.producerCodeId.value=producerCd;
			document.actionForm.action =  document.actionForm.eSalesQQURL.value;
			document.actionForm.method="POST";
			document.actionForm.submit();
		}
		$('#qqAgencyProfileDialog').modal('hide');
	});
	
	//QQ agent profile has multiple agencies
	var displayQQAgentProfiles = $('#qqPopUp').val() ||'';
	if('Yes' === displayQQAgentProfiles){
		$('#qqAgency').empty();
		var  strURL = '/aiui/landing/getQQAgentProfiles';
		var lob= 'PA';
		var state = 'NJ';
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: "/aiui/landing/getQQAgentProfiles?lob="+lob+'&state='+state,
	        type: "GET",
	        dataType: "JSON",
	        timeout: 3000,
	        success: function(response, textStatus, jqXHR){
	        		var qqProfiles = response;
		        	// console.log(qqProfiles);
		        	var companyCd = qqProfiles[0].companyCode;
		        	var branchName = qqProfiles[0].branchName;
		        	var branchLevelCode = qqProfiles[0].branchLevelCode;
		        	var branch='';
		        	if(branchName.toUpperCase() === branchLevelCode.toUpperCase()){
		        		branch = branchLevelCode.toUpperCase();
		        	}else{
		        		branch = branchLevelCode+' | '+branchName;
		        	}
		        	
		        	$('#qqCompany_Cd').text(companyCd);
		        	$('#qqBranch_Cd').text(branch);
		        	var options_select = '';
					options_select+='<option value="">--Select--</option>';
					$('#qqAgency').append(options_select);
			    	for (var i = 0; qqProfiles!=null && i < qqProfiles.length; i++) {
		        		$('#qqAgency').append('<option value="' + qqProfiles[i].agencyHierarchyId + '">' + qqProfiles[i].name + '</option>');
		        	}
		        	$('#qqAgency').addClass('required');
					$('#qqAgency').addClass('preRequired');
					$('#qqAgency').trigger('chosen:updated').trigger('chosen:styleUpdated');
					
		        	var invalidProducers = $('#qqInValidProducers').val();
		        	if('Yes'=== invalidProducers){
		        		var selectedAgency = $('#qqInValidProducersAgency').val();
		        		$('#qqAgency').val(selectedAgency).trigger("chosen:updated");
		        		var msg = "Agency profile not configured for quick quote " ;
		    			msg = "<img id='errorImage' src='" + errorImage + "'/>&nbsp;&nbsp;" + msg;
		    			$(".qqErrorAlertMsg").html(msg);
		    			$(".qqErrorAlertMsg").addClass('inlineErrorMsg').removeClass("hidden");	
		    			console.log('disable the button');
		    			$('#qqSubmitAgency').attr('disabled','disabled');
		    		}
		        	
		        	$('#qqAgencyProfileDialog').modal('show');
	        },
	        // callback handler that will be called on error
	        error: function(jqXHR, textStatus, errorThrown){
		           	console.log('error calling qqProfiles');
	          }
	        ,
	        complete: function(){
	        //	$.unblockUI();
	        	console.log('qqProfiles call completes--');
	        }
	    });
	}
});


function showContentPage(department){
	document.actionForm.action = "/aiui/contentLanding/contents";
	//$('#selectedDept').val(department);
	document.actionForm.selectedDept.value = department;
	document.actionForm.method="POST";
	document.actionForm.submit();
}

function myViewMessageHandler(header, messageBody){	
	header.removeClass('hidden');
	$('#'+messageBody+'').removeClass('hidden');	
	if (($('#'+messageBody+'Img').attr('src')).indexOf('minus') <=0){
		expandCollapseIcon('#'+messageBody+'');
	}					        				        	
	expandCollapseRowsWelcome(''+messageBody+'');
}



function showHideMultiChosenContainer(id, showit) {
	if(showit) {
		$('#ddcl-'+id).removeClass('multiDropDownHidden');
	} else {
		$('#ddcl-'+id).addClass('multiDropDownHidden');
	}
}


function createLinks(linkHolder, linkURL, successFunction) {
	var date = new Date();
    var milliSecs = date.getMilliseconds();
   
	$.ajax({
        headers: { 
            'Accept': 'application/html',
            'Content-Type': 'application/html' 
        },
        url: "/aiui/landing/" + linkURL + "?" + milliSecs,
        type: "get",
        // callback handler that will be called on success
        success: function(response){
        	if (successFunction != null) {
        		successFunction(linkHolder, response);
        	}
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
            // log the error to the console
           /* console.log(
                "The following error occured: "+
                textStatus, errorThrown
            );
            */
        },
        // callback handler that will be called on completion
        // which means, either on success or error
        complete: function(){
        }
    });
}


function bindContentLinks(contentPage) {
	// Open content link in new tab / window (depending on browser preferences)
	$('.contentLink', contentPage).unbind('click');
	$('.contentLink', contentPage).click(function() {
		return openLink($(this));
	});
	// Open a secondary menu page in the right hand panel
	$('.contentMenuItem', contentPage).click(function() {
		
		createLinks(this, 'secondary/' + this.id, 
				function(secondaryLink, response) {
			return showSecondaryMenuContent(contentPage, response);			
			});	

		$('.contentMenuItem', $(this).closest('.contentMenuBar')).removeClass('contentMenuItemSelected');
		$(this).addClass('contentMenuItemSelected');
	});
}

function openLink(link) {
	link.target = "_blank";
    window.open(link.prop('href'));
    return false;	
}

function showSecondaryMenuContent(contentPage, response) {
	var contents = $('#menuItemContent', contentPage);
	contents.html(response);
	bindContentLinks(contents);
}

function showFooterLinks(footerLink, response) {
	
	var $footerLink = $(footerLink);
	$footerLink.html('');
	// check if we need to manipulate footer links
	$footerLink.append(formatFooterLinks(response));
	
	configureLinks($footerLink);
}

function formatFooterLinks(response){
	var strReplace;
	
	if(!isEmployee()){
		strReplace = "<div class=\"footerLink\"><a href=\"#\" id=\"agencyProfile\" class=\"agencyProfileLink\">Agency Profile</a></div>";
		response = response.replaceAll(strReplace, "");
	}

	// see if we need to disable footer links
	var elms = $(response).find("a");
	$(elms).each(function(){
		var elm = this;
		var id = elm.id;
		
		if(footerLinksDisable.hasOwnProperty(id)){
			var frmName =  footerLinksDisable[id];
		    var frmVal = $('input[name^="' + frmName + '"]').val();
			if(frmVal == "true"){
				var classes;
				var label = $(elm).html();
				var aId = "\"" + id+ "\"";
				
				if(id=="newQuote"){
					classes = "\"newQuote\"";
				}else if(id==LinksEnum.TRANSACTIONREPORTING
							|| id==LinksEnum.DOCUMENTSEARCH
							|| id==LinksEnum.FLOOD
							|| id==LinksEnum.COMMISSIONSTATEMENTS
							|| id==LinksEnum.QUOTEMARKETPLACE
							|| id==LinksEnum.REPLACEMENTCOSTCALCULATOR
							|| id==LinksEnum.AGENCYREPORTS){
					classes = "\"linkButton\"";
				}else if(id==LinksEnum.RMVACCESS){
					classes = "\"linkButton rmvAccess\"";
				}else{
					classes = "\"expandLink\"";
				}
				
				if(id==LinksEnum.FLOOD){
					strReplace = "<a id=" + aId + " class=" + classes + ">" + label + "</a>";
				}else{
					strReplace = "<a href=\"#\" id=" + aId + " class=" + classes + ">" + label + "</a>";
				}
				
				response = response.replaceAll(strReplace, label);
			}
		}
		
	});
	
	return response;	
}

var footerLinksDisable = {
	billingInquiry:'disableBasicInquiry',
	claimInquiry:'disableBasicInquiry',
	endorsement:'disableEndorsement',
	endorsement:'disableEndorsement',
	eServices:'disableBasicInquiry',
	makeAPayment:'disableWebPay',
	newQuote:'disableQuote',
	notes:'disableNotes',
	policyDocuments:'disableBasicInquiry',
	policyInquiry:'disableBasicInquiry',
	reviewPayments:'disableWebPay',
	searchQuote:'disableQuote',
	transactionReporting:'disableTransactionReporting',
	documentSearch:'disableDocumentSearch',
	flood:'disableFlood',
	commissionStatements:'disableCommissionStatements',
	agencyReports:'disableAgencyReports',
	homeownerPartners:'disableHomeownerPartners',
	bopPartners:'disableBOPPartners',
	rmvAccess:'disableRMVAccess',
	quoteMarketplace:'disableQuoteMarketPlace',
	replacementCostCalculator:'disableReplacementCostCalculator',
	reportClaim:'disableBasicInquiry',
	reqProofOfInsurance:'disableIDCards',
	quickQuote:'disableQuickQuote'
};

function showSubmenu(submenu) {
	var submenuContents = $('.submenuContents', submenu.parent());
	var showIt = submenuContents.hasClass('hidden');
	$('.submenuContents:not(.hidden)').addClass('hidden');
	if (showIt) {
		submenuContents.removeClass('hidden');
	}
}

function showMessageModal(message) {
	
	var title = $(message).html();

	$('#msgHeader').html(title);
	
	var index = message.id.substring(message.id.lastIndexOf("_") + 1);
	var detail = $('#messageDetail_' + index);
	
	var msgDetail = $('#msgDetail');
	msgDetail.html(detail.html());
	$("a", msgDetail).click(function () {
		return openLink($(this));
	});
	$('#messageDialog').modal('show');
	
}

function openUpAppInNewWin(){
	if(document.actionForm_QM.goToQuoteMarketPlace.value == "Yes"){ // Quote Marketplace
		document.actionForm_QM.target="_blank";
		document.actionForm_QM.submit();
	}else if(document.actionForm_ReplacementCost.goToReplacementCost.value == "Yes"){ // Replacement Cost Calculator
		var sPassword = document.actionForm_ReplacementCost.ticket_password.value;
		var sUserId = document.actionForm_ReplacementCost.ticket_userid.value;
		var sGroupId = document.actionForm_ReplacementCost.ticket_groupid.value;
		var sRole = document.actionForm_ReplacementCost.role_role.value;
		document.actionForm_ReplacementCost.ticket_date.value=getGmtDateString();
		var HashString = sPassword + '|' + sUserId + '|' + sGroupId + '|' + document.actionForm_ReplacementCost.ticket_date.value + '|' +  sRole + '||||||||';
		document.actionForm_ReplacementCost.ticket_hash.value=sha1Hash(HashString);
		document.actionForm_ReplacementCost.target="_blank";
		document.actionForm_ReplacementCost.submit();
	}
}

function printNewIframe() { 
	newIframe.focus(); 
	newIframe.contentWindow.print();
	return; 
}

function printThisMessage()  {
    
    var content = '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">'+
    '<head>' +
    '</head>' +
    '<body>' +
    '<div style = "font-family: Arial, Helvetica, sans-serif;font-size: 14px;font-weight: bold;color: #333333">' +
    document.getElementById('msgHeader').outerHTML +
    '</div>' +
    '<BR><BR>' +
    '<div style = "font-family: Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;color: #333333">' +
    document.getElementById('msgDetail').outerHTML +
    '</div>' +
    '</body>' +
    '</html>';
    $("#print-iframe").remove();
    var newIframe = document.createElement('iframe');
    newIframe.width = '0';
    newIframe.height = '0';
    newIframe.src = 'about:blank';
    newIframe.id ='print-iframe';
    newIframe.name ='print-iframe-name';
    document.body.appendChild(newIframe);
    
    newIframe.contentWindow.contents = content;
    newIframe.src = 'javascript:window["contents"]';
    var loaded = false;
    $("#print-iframe").load( 
         function() {
        	 loaded = true;
             window.frames['print-iframe-name'].focus();
             window.frames['print-iframe-name'].print();
             $("#print-iframe").remove();
             $('#messageDialog').modal('show');
         }
 );
    setTimeout(function(){
    	if(!loaded) {
    		$('#print-iframe').load();
    	}
    }, 500);
}

// Replacement Cost Calculator code
if ( !Date.prototype.toISOString ) {
    ( function() {
      
      function pad(number) {
        if ( number < 10 ) {
          return '0' + number;
        }
        return number;
      }
  
      Date.prototype.toISOString = function() {
        return this.getUTCFullYear() +
          '-' + pad( this.getUTCMonth() + 1 ) +
          '-' + pad( this.getUTCDate() ) +
          'T' + pad( this.getUTCHours() ) +
          ':' + pad( this.getUTCMinutes() ) +
          ':' + pad( this.getUTCSeconds() ) +
          '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice( 2, 5 ) +
          'Z';
      };
    
    }() );
}

function sha1Hash(msg)
{
    // constants [§4.2.1]
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];


    // PREPROCESSING 
 
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length<BR>   
    var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints<BR>   
    var M = new Array(N);
    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                      (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        }
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [§6.1.2]

    var W = new Array(80); var a, b, c, d, e;
    for (var i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<80; t++) W[t] = ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0; b = H1; c = H2; d = H3; e = H4;

        // 3 - main loop
        for (var t=0; t<80; t++) {
            var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
            var T = (ROTL(a,5) + f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = ROTL(b, 30);
            b = a;
            a = T;
        }

        // 4 - compute the new intermediate hash value
        H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
        H1 = (H1+b) & 0xffffffff; 
        H2 = (H2+c) & 0xffffffff; 
        H3 = (H3+d) & 0xffffffff; 
        H4 = (H4+e) & 0xffffffff;
    }

   //document.sso.ticket_hash.value = H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr();

    return H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr();
}

//
//function 'f' [§4.1.1]
//
function f(s, x, y, z) 
{
 switch (s) {
 case 0: return (x & y) ^ (~x & z);           // Ch()
 case 1: return x ^ y ^ z;                    // Parity()
 case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
 case 3: return x ^ y ^ z;                    // Parity()
 }
}

//
//rotate left (circular left shift) value x by n positions [§3.2.5]
//
function ROTL(x, n)
{
 return (x<<n) | (x>>>(32-n));
}

//
//extend Number class with a tailored hex-string method 
//(note toString(16) is implementation-dependant, and 
//in IE returns signed numbers when used on full words)
//
Number.prototype.toHexStr = function()
{
 var s="", v;
 for (var i=7; i>=0; i--) { v = (this>>>(i*4)) & 0xf; s += v.toString(16); }
 return s;
};

//Returns a formatted date time string.
function getGmtDateString() {
	var d = new Date();
	
	return d.toISOString();
}



/* validation logic */
var fieldIdToModelErrorRow = {
		"myViewChannelErr":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldLabelError\"></td><td class=\"fieldColError inlineErrorMsg\" id=\"Error_Col\">Channel is invalid for the state selected</td></tr>",
};

var errorMessageJSONLanding = {
		"ddcl-channelId.browser.inLine.invalid":"Channel is invalid for the state selected"
};

//51817
function validateMyViewSelections(state,channel){
	var hasError = false;
	var invalidComb = -1;
	var errorMessageID = '';

	var selectionHasNJ = $.inArray('NJ',state)>=0?true:false;
	var selectionHasPA = $.inArray('PA',state)>=0?true:false;
	
	
	$(state).each(function(){

		if(this == 'CT' && !selectionHasNJ && !selectionHasPA){
			invalidComb = $.inArray('Captive',channel);

		}if(this == 'MA' && !selectionHasNJ && !selectionHasPA){
			invalidComb = $.inArray('Captive',channel);

		}if(this == 'NH' && !selectionHasNJ && !selectionHasPA){
			invalidComb = $.inArray('Captive',channel);

		}if((this == 'CT' || this == 'MA' || this == 'NH') && ((selectionHasNJ && channel.length == 1) || (selectionHasPA && channel.length == 1))){
			invalidComb = channel[0] == 'Captive'?0:-1;
		} 
		if(invalidComb >= 0){
			hasError = true;
			errorMessageID="ddcl-channelId.browser.inLine.invalid";
		}
	});
	showClearInLineErrorMsgsWithMap($('#ddcl-channelId').attr('id'), errorMessageID,fieldIdToModelErrorRow['myViewChannelErr'],-1,errorMessageJSONLanding);

	if(hasError){
		return false;
	}
	return true;
}

