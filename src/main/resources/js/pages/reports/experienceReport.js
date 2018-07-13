jQuery(document).ready(function() {	
	
	// should be a last call for readonly quote
	//disableOrEnableElementsForReadonlyQuote();
	
	 $("#pdfAgentReport").bind("click", function(){
		 	var period = $('#period').val();
		 	var stateCodes = $('#stateCode').val();
		 	var locations = $('#location').val();
		 	var subAgencyCodes = $('#subAgencyCode').val();
		 	var groups = $('#group').val();
		 	var error = validateInputs(stateCodes, locations, subAgencyCodes, groups);
		 	if(error){
		 		return;
		 	}
		 	groups = encodeURIComponent(groups);
			document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=pdf&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&stateCodes='+stateCodes+'&groups='+groups+'&locations='+locations;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ExperienceReports";
			document.actionForm.submit();
		});
	 
	 $("#excelAgentReport").bind("click", function(){
		 	var period = $('#period').val();
		 	var stateCodes = $('#stateCode').val();
		 	var locations = $('#location').val();
		 	var subAgencyCodes = $('#subAgencyCode').val();
		 	var groups = $('#group').val();
		 	var error = validateInputs(stateCodes, locations, subAgencyCodes, groups);
		 	if(error){
		 		return;
		 	}		 	
		 	groups = encodeURIComponent(groups);
			document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=xls&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&stateCodes='+stateCodes+'&groups='+groups+'&locations='+locations;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ExperienceReports";
			document.actionForm.submit();
		});

	 //fetch All Reports on load
	if($('.lob1HeaderText').text() == ''){
			updateReports();
	 }
	 //hide button 
	 $('#updateReport').hide();
	 $("#updateReport").bind("click", function(){
		 updateReports();		
		});
	 
		 //fetchSubAgencyCodes($("#stateCode").val());
		 //fetchGroups($("#subAgencyCode").val());
	 	 	 	
	 	//MultiSelect Fields
	 	
	 	//State Multiselect
	 	addDropdownCheckListForCol($('#stateCode'));	 	
		$('#stateCode_chosen').addClass('chosenDropDownHidden');
		$('#stateCode').addClass('agencyReportsMultiSelect');
		if($('#stateCodes').val() !=''){
			// Set the value
			$("#stateCode").val($('#stateCodes').val().split(","));
	 	}else{
	 		$('#stateCode').val('All');
	 	}
		addDropdownCheckListForCol($('#stateCode'));	 
		
		//Location Multiselect
		addDropdownCheckListForCol($('#location'));
		$('#location_chosen').addClass('chosenDropDownHidden');
		$('#location').addClass('agencyReportsMultiSelect');
		if($('#locations').val() !=''){
			// Set the value
			$("#location").val($('#locations').val().split(","));
	 	}else{
	 		$('#location').val('All');
	 	}
		addDropdownCheckListForCol($('#location'));	
		
		addDropdownCheckListForCol($('#subAgencyCode'));
		$('#subAgencyCode_chosen').addClass('chosenDropDownHidden');
		$('#subAgencyCode').addClass('agencyReportsMultiSelect');
		if($('#subAgencyCodes').val() !=''){
			// Set the value			
			$("#subAgencyCode").val($('#subAgencyCodes').val().split(","));
	 	}else{
	 		$('#subAgencyCode').val('All');
	 	}
		addDropdownCheckListForCol($('#subAgencyCode'));	
		
		addDropdownCheckListForCol($('#group'));
		$('#group_chosen').addClass('chosenDropDownHidden');
		if($('#groups').val() !=''){
			 var beforeSplit = $('#groups').val().replaceAll(", ","~~");
			 var afterSplit = beforeSplit.split(",");			 
			 var finalString = [];
			 for (i = 0; i < afterSplit.length; ++i) {				
				 finalString.push(afterSplit[i].replace("~~", ", "));
			 }
			// Set the value
			$("#group").val(finalString);
	 	}else{
	 		$('#group').val('All');
	 	}
		addDropdownCheckListForCol($('#group'));	
		
		window.previousStateCode = $("#stateCode").val();
		 $("#stateCode").bind("change", function(){
			//Check/Uncheck All dynamically based on User selection
			 var currentStateCode = $(this).val();
			 if(previousStateCode.indexOf("All") == -1 && currentStateCode.indexOf("All") > -1){
				 $('#stateCode').val('All');
				 addDropdownCheckListForCol($('#stateCode'));	
				 simulateClickEvent("#ddcl-stateCode");
				 
			 }
			 if(previousStateCode.indexOf("All") > -1 && currentStateCode.indexOf("All") > -1 && currentStateCode.length > 1){
				 $('#stateCode').find('option[value="All"]').prop('selected',false);
				 addDropdownCheckListForCol($('#stateCode'));	
				 simulateClickEvent("#ddcl-stateCode");
			 }			 
			 previousStateCode = $('#stateCode').val();			 
			 $('#updateReport').show();
		 });

		 window.previousLocations = $("#location").val();
		 $("#location").bind("change", function(){
			 //Check/Uncheck All dynamically based on User selection
			 var currentLocations = $(this).val();
			 if(previousLocations.indexOf("All") == -1 && currentLocations.indexOf("All") > -1){
				 $('#location').val('All');				 
				 addDropdownCheckListForCol($('#location'));	
				 simulateClickEvent("#ddcl-location");
			 }
			 if(previousLocations.indexOf("All") > -1 && currentLocations.indexOf("All") > -1 && currentLocations.length > 1){
				 $('#location').find('option[value="All"]').prop('selected',false);
				 addDropdownCheckListForCol($('#location'));	
				 simulateClickEvent("#ddcl-location");
			 }		 
			 if(currentLocations.length == 0){
				 $('#location').val('All');				 
				 addDropdownCheckListForCol($('#location'));	
				 simulateClickEvent("#ddcl-location");
			 }
			 
			 fetchSubAgencyCodes($("#location").val());
			 fetchGroups($("#location").val(), $("#subAgencyCode").val());
			 $('#updateReport').show();
			 
			 previousLocations = $('#location').val();		
			 
			 
			
		 });
		 
		 
		 window.previousSubAgencyCode = $("#subAgencyCode").val();
		 $("#subAgencyCode").bind("change", function(){
			//Check/Uncheck All dynamically based on User selection
			 var currentSubAgencyCode = $(this).val();
			 if(previousSubAgencyCode.indexOf("All") == -1 && currentSubAgencyCode.indexOf("All") > -1){
				 $('#subAgencyCode').val('All');
				 addDropdownCheckListForCol($('#subAgencyCode'));
				 simulateClickEvent("#ddcl-subAgencyCode");
			 }
			 if(previousSubAgencyCode.indexOf("All") > -1 && currentSubAgencyCode.indexOf("All") > -1 && currentSubAgencyCode.length > 1){
				 $('#subAgencyCode').find('option[value="All"]').prop('selected',false);
				 addDropdownCheckListForCol($('#subAgencyCode'));
				 simulateClickEvent("#ddcl-subAgencyCode");
			 }			 	
			 
			 if(currentSubAgencyCode.length == 0){
				 $('#subAgencyCode').val('All');				 
				 addDropdownCheckListForCol($('#subAgencyCode'));	
				 simulateClickEvent("#ddcl-subAgencyCode");
			 }
			 
			 fetchGroups($("#location").val(), $("#subAgencyCode").val());			
			 $('#updateReport').show();
			 previousSubAgencyCode = $('#subAgencyCode').val();
			 
			 
		 });
		 
		 window.previousGroupCode = $("#group").val();
		 $("#group").bind("change", function(){
			//Check/Uncheck All dynamically based on User selection
			 var currentGroupCode = $(this).val();
			 if(previousGroupCode.indexOf("All") == -1 && currentGroupCode.indexOf("All") > -1){
				 $('#group').val('All');
				 addDropdownCheckListForCol($('#group'));
				 simulateClickEvent("#ddcl-group");
			 }
			 if(previousGroupCode.indexOf("All") > -1 && currentGroupCode.indexOf("All") > -1 && currentGroupCode.length > 1){
				 $('#group').find('option[value="All"]').prop('selected',false);
				 addDropdownCheckListForCol($('#group'));
				 simulateClickEvent("#ddcl-group");
			 }	
			 if(currentGroupCode.length == 0){
				 $('#group').val('All');				 
				 addDropdownCheckListForCol($('#group'));	
				 simulateClickEvent("#ddcl-group");
			 }
			
			 $('#updateReport').show();
			 previousGroupCode = $('#group').val();
			 
			 
		 });
		 
		 $('.pa1').show();
		 $('.ho1').hide();
		 $('.umb1').hide();
		 $('.ca1').hide();
		 $('.ceded1').hide();
		 $('.plclTotal1').hide();
		 $('.plTotal1').hide();
		 
		 $('.pa2').hide();
		 $('.ho2').show();
		 $('.umb2').hide();
		 $('.ca2').hide();
		 $('.ceded2').hide();
		 $('.plclTotal2').hide();
		 $('.plTotal2').hide();
		 
		 createPopover('.periodMenu', showPeriodPopover);
		 createPopover('.lob1Menu', showLob1Popover);
		 createPopover('.lob2Menu', showLob2Popover);
		 
		$(document).on("click", ".periodMenuLinks", function(e){
			displayPeriodDialog($(this).text());
			e.stopPropagation();
			return false;
		});
			
		$(document).on("click", ".lob1MenuLinks", function(e){
			displayLOB1Dialog($(this).text());
			e.stopPropagation();
			return false;
		});
		
		$(document).on("click", ".lob2MenuLinks", function(e){
			displayLOB2Dialog($(this).text());
			e.stopPropagation();
			return false;
		});
		
		$(document).on("click", function(e){
			if(e.target.className.indexOf("lob1Menu") < 0){
				hideLob1Popover();
			}
			if(e.target.className.indexOf("lob2Menu") < 0){
				hideLob2Popover();
			}
		   if(e.target.className.indexOf("periodMenu") < 0){
				hidePeriodPopover();
			}
		});
				
});


function simulateClickEvent(selector){
	 var targetNode = document.querySelector (selector);
	 if (targetNode) {
	     //--- Simulate a natural mouse-click sequence.
	     triggerMouseEvent (targetNode, "click");
	 }
}
function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function displayPeriodDialog(msg){
	$('.periodHeaderText').text("Experience Report: "+msg);
	$('#period').val(msg);
	$('#updateReport').show();
	$('.popover').hide();
	return false;
}

function displayLOB1Dialog(msg){
	//Hide all first, then show for each header
	$('.pa1').hide();
	 $('.ho1').hide();
	 $('.umb1').hide();
	 $('.ca1').hide();
	 $('.ceded1').hide();
	 $('.plclTotal1').hide();
	 $('.plTotal1').hide();
	 
	 $('.pa2').hide();
	 $('.ho2').hide();
	 $('.umb2').hide();
	 $('.ca2').hide();
	 $('.ceded2').hide();
	 $('.plclTotal2').hide();
	 $('.plTotal2').hide();
	 
	 
	var lob1HeaderText = $('.lob1HeaderText').text();
	var lob2HeaderText = $('.lob2HeaderText').text();
	
	if('PERSONAL AUTO'== msg){
		 $('.pa1').show();
	}else if('HOMEOWNERS' == msg){
		 $('.ho1').show();
	}else if('UMBRELLA' == msg){
		 $('.umb1').show();
	}else if('COMMERCIAL AUTO' == msg){
		 $('.ca1').show();
	}else if('CEDED COMMERCIAL AUTO' == msg){
		 $('.ceded1').show();
	}else if('PL TOTAL' == msg){
		 $('.plTotal1').show();
	}else if('PL/CL TOTAL' == msg){
		 $('.plclTotal1').show();
	}
		
	$('.lob1HeaderText').text(msg);
	
	if('PERSONAL AUTO'== lob2HeaderText){
		 $('.pa2').show();
	}else if('HOMEOWNERS' == lob2HeaderText){
		 $('.ho2').show();
	}else if('UMBRELLA' == lob2HeaderText){
		 $('.umb2').show();
	}else if('COMMERCIAL AUTO' == lob2HeaderText){
		 $('.ca2').show();
	}else if('CEDED COMMERCIAL AUTO' == lob2HeaderText){
		 $('.ceded2').show();
	}else if('PL TOTAL' == lob2HeaderText){
		 $('.plTotal2').show();
	}else if('PL/CL TOTAL' == lob2HeaderText){
		 $('.plclTotal2').show();
	}
	
	$('.popover').hide();
	return false;
}


function displayLOB2Dialog(msg){
	//Hide all first, then show for each header
	$('.pa1').hide();
	 $('.ho1').hide();
	 $('.umb1').hide();
	 $('.ca1').hide();
	 $('.ceded1').hide();
	 $('.plclTotal1').hide();
	 $('.plTotal1').hide();
	 
	 $('.pa2').hide();
	 $('.ho2').hide();
	 $('.umb2').hide();
	 $('.ca2').hide();
	 $('.ceded2').hide()
	 $('.plclTotal2').hide();
	 $('.plTotal2').hide();
	 
	 
	var lob1HeaderText = $('.lob1HeaderText').text();
	var lob2HeaderText = $('.lob2HeaderText').text();
	
	if('PERSONAL AUTO'== msg){
		 $('.pa2').show();
	}else if('HOMEOWNERS' == msg){
		 $('.ho2').show();
	}else if('UMBRELLA' == msg){
		 $('.umb2').show();
	}else if('COMMERCIAL AUTO' == msg){
		 $('.ca2').show();
	}else if('CEDED COMMERCIAL AUTO' == msg){
		 $('.ceded2').show();
	}else if('PL TOTAL' == msg){
		 $('.plTotal2').show();
	}else if('PL/CL TOTAL' == msg){
		 $('.plclTotal2').show();
	}
		
	$('.lob2HeaderText').text(msg);
	
	if('PERSONAL AUTO'== lob1HeaderText){
		 $('.pa1').show();
	}else if('HOMEOWNERS' == lob1HeaderText){
		 $('.ho1').show();
	}else if('UMBRELLA' == lob1HeaderText){
		 $('.umb1').show();
	}else if('COMMERCIAL AUTO' == lob1HeaderText){
		 $('.ca1').show();
	}else if('CEDED COMMERCIAL AUTO' == lob1HeaderText){
		 $('.ceded1').show();
	}else if('PL TOTAL' == lob1HeaderText){
		 $('.plTotal1').show();
	}else if('PL/CL TOTAL' == lob1HeaderText){
		 $('.plclTotal1').show();
	}
	
	$('.popover').hide();
	return false;
}

function showPeriodPopover() {
	var popupHTML = $('#periodLinks').html();
	var pop = $('.periodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function showLob1Popover() {
	var popupHTML = $('#lob1Links').html();
	var pop = $('.lob1Link').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function showLob2Popover() {
	var popupHTML = $('#lob2Links').html();
	var pop = $('.lob2Link').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function hidePeriodPopover() {
	var popupHTML = $('#periodLinks').html();
	var pop = $('.periodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

function hideLob1Popover() {
	var popupHTML = $('#lob1Links').html();
	var pop = $('.lob1Link').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

function hideLob2Popover() {
	var popupHTML = $('#lob2Links').html();
	var pop = $('.lob2Link').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

//complete hiding, showing, etc
window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing(){}

function validateInputs(stateCodes, locations, subAgencyCodes, groups){
	var isRequired = false;
	var errorMessages=jQuery.parseJSON($("#errorMessages").val());
	if(stateCodes==null){
		showClearInLineErrorMsgsWithMap("stateCode", "stateCode.browser.inLine.required", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
		isRequired = true;
	}else{
		showClearInLineErrorMsgsWithMap("stateCode", "", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
	}
	
	if(locations==null){
		showClearInLineErrorMsgsWithMap("location", "location.browser.inLine.required", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
		isRequired = true;
	}else{
		showClearInLineErrorMsgsWithMap("location", "", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
	}
	
	if(subAgencyCodes==null){
		showClearInLineErrorMsgsWithMap("subAgencyCode", "subAgencyCode.browser.inLine.required", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
		isRequired = true;
	}else{
		showClearInLineErrorMsgsWithMap("subAgencyCode", "", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
	}
	
	if(groups==null){
		showClearInLineErrorMsgsWithMap("group", "group.browser.inLine.required", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
		isRequired = true;
	}else{
		showClearInLineErrorMsgsWithMap("group", "", fieldIdToModelErrorRow['defaultSingle'],-1, errorMessages, addDeleteCallback,'');
	}
	
	return isRequired;
}

var addDeleteCallback = function(row, addIt) {
}

var fieldIdToModelErrorRow = {
		"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>"
	};

function fetchSubAgencyCodes(location) {
	blockUser();
	var id = $('#subAgencyCode');
	//var strErrorTag = 'eligibility.group.browser.inLine';
	//var errorMessageID = 'InvalidEligibilityGroup';
	//errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/agencyReports/fetchSubAgencyCodes/"+location,
        type: "post",
        dataType: 'json',
        timeout: 25000,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){        	
        	id.empty();
        	id.append('<option value="All">All</option>');
        	for (var i = 0; i < response.length; i++) {
        		id.append('<option value="' + response[i].split('-')[0] + '">' + response[i] + '</option>');
        	}        	
        	//id.prop('disabled',false);
        	//id.val('All');
        	//id.val($('#subAgencyCodes').val());
        	addDropdownCheckListForCol(id);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- ALL --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){        
        	//default to All after fetch
        	 $('#subAgencyCode').val('All');
			 $('#group').val('All');
			 addDropdownCheckListForCol($('#subAgencyCode'));
			 addDropdownCheckListForCol($('#group'));	
			 previousSubAgencyCode = $('#subAgencyCode').val();
        	$.unblockUI();
         }
    });
}

function fetchGroups(locations, subAgencyCodes) {
	blockUser();
	var id = $('#group');
	//var strErrorTag = 'eligibility.group.browser.inLine';
	//var errorMessageID = 'InvalidEligibilityGroup';
	//errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/agencyReports/fetchGroups/"+locations+"/"+subAgencyCodes,
        type: "post",
        dataType: 'json',
        timeout: 25000,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){        	
        	id.empty();
        	id.append('<option value="All">All</option>');
        	id.append('<option value="Non-Group">Non-Group</option>');
        	for (var i = 0; i < response.length; i++) {
        		id.append('<option value="' + response[i] + '">' + response[i] + '</option>');
        	}        	
        	//id.prop('disabled',false);
        	//id.val('All');
        	//id.val($('#groups').val());
        	addDropdownCheckListForCol(id);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- ALL --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){        
        	//default to All after fetch
			 $('#group').val('All');
			 addDropdownCheckListForCol($('#group'));	
			 previousGroupCode = $('#group').val();
        	$.unblockUI();
         }
    });
}


function fetchLocations(stateCodes) {
	blockUser();
	var id = $('#location');
	//var strErrorTag = 'eligibility.group.browser.inLine';
	//var errorMessageID = 'InvalidEligibilityGroup';
	//errorMessageID = strErrorTag + '.' + errorMessageID;
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: "/aiui/agencyReports/fetchLocations/"+stateCodes,
        type: "post",
        dataType: 'json',
        timeout: 25000,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){        	
        	id.empty();
        	id.append('<option value="All">All</option>');
        	for (var i = 0; i < response.length; i++) {
        		id.append('<option value="' + response[i] + '">' + response[i] + '</option>');
        	}        	
        	//id.prop('disabled',false);
        	//id.val('All');
        	//id.val($('#locations').val());
        	addDropdownCheckListForCol(id);
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	id.empty();
        	id.append('<option value="">-- ALL --</option>');
        	id.prop('disabled',true);
        	id.trigger('chosen:updated');
        },
        complete: function(){        	
        	previousLocations = $('#location').val();
        	$.unblockUI();
         }
    });
}

function updateReports(){
	 $('#updateReport').hide();
	var period = $('#period').val();
 	var stateCodes = $('#stateCode').val();
 	var locations = $('#location').val();
 	var subAgencyCodes = $('#subAgencyCode').val();
 	var groups = $('#group').val();
 	var error = validateInputs(stateCodes, locations, subAgencyCodes, groups);
 	if(error){
 		return;
 	}
 	groups = encodeURIComponent(groups);
	document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=report&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&stateCodes='+stateCodes+'&groups='+groups+'&locations='+locations;
	document.actionForm.method="POST";
	document.actionForm.requestSource.value = "ExperienceReports";
	document.actionForm.submit();
} 
