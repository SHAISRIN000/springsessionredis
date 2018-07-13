import React from 'react';
import ReactDOM from 'react-dom';
var createReactClass = require('create-react-class');

jQuery(document).ready(function() {
	
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Content Management');
	
	$('#contentUploads').removeClass('hidden');
	$('#contentUploadChannelId').prop('disabled',true).trigger('chosen:updated');
	$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
	
	$('#formBottomGrey').addClass('hidden');
	$('#formBottom').removeClass('hidden');
	$('#links').addClass('hidden');
	
	$("#contentTypeId").on('change', function(){
		$('#contentUploadStateId').prop('selectedIndex',0).trigger('chosen:updated');
		$('#contentUploadChannelId').prop('selectedIndex',0).trigger('chosen:updated');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');
		$('#contentUploadChannelId').prop('disabled',true).trigger('chosen:updated');
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		$('#captiveSecondaryLandingPageFlag').val('NO');
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');		
	});
	 
	$("#addContentTypePageId").on('change', function(){
		var state = $("#contentUploadStateId").val(); 
		var opCompanyMap;
		var operatingCompany = $('#operatingCompanyIdAdd');
		var selectedCompany = $("#operatingCompanyIdAdd").val();
		$('#descriptionId').hide();
		 if('Header' == $('#addContentTypePageId').val()){
			 $('#contentPathPrmIdFirst').hide();			 
			 if(state == 'CT' || state == 'MA'){
				   opCompanyMap = opCompanyMapGroup1ForHeaderOnly;
				   operatingCompany.find('option').remove().end();
				   $.each(opCompanyMap, function(val, text) {
					   operatingCompany.append('<option id="operatingCompanyIdAdd" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
				   });			
				   $('#operatingCompanyIdAdd').val(selectedCompany).trigger('chosen:updated');
			 }  
		 }else{
			 $('#contentPathPrmIdFirst').show();
			 
			 var contentType= $("#contentTypeId").val();
			 var state = $("#contentUploadStateId").val();
			 var channel= $("#contentUploadChannelId").val();
			 var secPageId = $('#secLandingDDId').val();
			 if(contentType=='Resources' && (state=='NJ' || state =='PA' || state=='NY') && channel=='Captive' && secPageId != '-Select-'){
				 $('#descriptionId').show();
		 }
			if(state == 'CT' || state == 'MA'){
				  opCompanyMap = opCompanyMapGroup1;
				   operatingCompany.find('option').remove().end();
				   if (selectedCompany == "PRPG") {
					   selectedCompany = "-Select-"
		 }
				   $.each(opCompanyMap, function(val, text) {
					   operatingCompany.append('<option id="operatingCompanyIdAdd" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
	});
				   $('#operatingCompanyIdAdd').val(selectedCompany).trigger('chosen:updated');
			 } 
		 }
	});
	
	$("#contentUploadStateId").on('change', function(){
		$("#contentUploadChannelId").text('');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');		
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		var contentUploadChannelId = $('#contentUploadChannelId');
		$('#contentUploadChannelId').prop('selectedIndex',0).trigger('chosen:updated');
	    var selectedState = $("#contentUploadStateId").val();
	    var linkURL = '/aiui/contentManagement/getChannelDropdown';
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});		
		
		$.ajax({ 
			headers: { 
				'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },	 
		    url: linkURL,
		    type: "get",
		    data: {selectedState: selectedState},
		    cache: false
		}).done(function (response) {
			var channelFlag=0;
	    	contentUploadChannelId.append('<option>-Select-</option>');
	    	$.each(response, function(val, text) {
	    		channelFlag=channelFlag+1;
	    		contentUploadChannelId.append('<option id="channelDDId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
            });
	    	$('#channelFlag').val(channelFlag);
		}).fail(function (jqXHR, textStatus) {
		   
		}).always(function (jqXHR, textStatus) {
			$.unblockUI();
		});
	});
	
	$("#contentUploadChannelId").on('change', function(){
		changeOfChannel();
	});
	
	$("#secLandingDDId").on('change', function(){
		changeOfSeclandingPage();
	});
});

function changeOfChannel(){
	if($("#contentUploadChannelId").val() =='-Select-'){
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		return;
	} else {
		$('#primaryContentResultId').removeClass('hidden');
	}
	$('#firstLevelContents').html('');
	$('#secondaryContentResultId').addClass('hidden');

	var firstLevelContentsId = $('#firstLevelContents');
	$('#secLandingDDId').html("");
	var secLandingDDId = $('#secLandingDDId');
	
	var contentType= $("#contentTypeId").val();
    var state = $("#contentUploadStateId").val();
    var channel= $("#contentUploadChannelId").val();
    var linkURL = '/aiui/contentManagement/getPrimaryContentData';

    $.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
	
	$.ajax({ 
		async: false,
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },	       
        url:linkURL,
        type: "GET",
        data: {contentType: contentType, state: state, channel: channel},
        cache: false
	}).done(function (response) {
		if(response!=null){
			var NoData = JSON.stringify(response.noData);	    			
			if(NoData === undefined || NoData == "null" || typeof(NoData) == null){
				$("#contentResultsGridHeader").removeClass('hidden');
				displayPLPage(firstLevelContentsId, secLandingDDId, response);
			} else {
				$("#contentResultsGridHeader").addClass('hidden');
				firstLevelContentsId.append('<tr><td class="contentTD1">'+response.noData+'</td></tr>');
			}
		}
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		$('#contentUploads').removeClass('hidden');			    
	    $.unblockUI();
	});
}

function changeOfSeclandingPage(){
    if($("#secLandingDDId").val() =='-Select-'){
		$('#secondaryContentResultId').addClass('hidden');
		changeOfChannel();
		return;
    }
	if($("#contentUploadChannelId").val() =='-Select-'){
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		return;
	} else {
		$('#secondaryContentResultId').removeClass('hidden');
		$('#primaryContentResultId').addClass('hidden');
	}
	
    var secPageId = $('#secLandingDDId').val();
    var categoryName = $(this).find(":selected").text();		
	var secondLevelContentsId = $('#secondLevelContents');		
    
    $('#secondLevelContents').empty('');
    var linkURL = '/aiui/contentManagement/getSecondaryContentData';
    
    $.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
    	
	$.ajax({ 
		async: false,
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },	       
        url:linkURL,
        type: "get",
        data: {secPageId: secPageId},
        cache: false
	}).done(function (response) {
		if(response!=null){
			$("#contentResultsGridHeaderSecondary").removeClass('hidden');
			displaySLPage(response);
		}     
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		 $('#contentUploads').removeClass('hidden');
		 $.unblockUI();
	});
}

function isEmailValid(email){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function updatePrimaryContentLandingPage(){
	 	var contentLabel = $("#contentDisplayNamePLPageId").val();
	    var path= $("#contentNamePathId").val();
	    var companyCd = $("#operatingCompanyIdEdit").val();
	    var contentItemValue = $("#contentItemValueId").val();
	    var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    
	    $('#descriptionEdit').hide();
	    
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({ 
			async: false,
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/contentManagement/updateContentOnPLPage',
	        type: 'GET',
	        data: {
	        	contentLabel:  contentLabel,	        	
	        	path:  path,
	        	companyCd: companyCd,
	        	contentItemValue:contentItemValue,
	        	contentType:contentType,
	         	state:state,
	         	channel:channel
	        },
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false
		}).done(function (response) {
			   
		}).fail(function (jqXHR, textStatus) {
		   
		}).always(function (jqXHR, textStatus) {
			$('#contentUploads').removeClass('hidden');	
		    $("#editLandingPage").modal('hide');
		    $.unblockUI();
		});
		
		changeOfChannel();
}

function updateSecondaryContentLandingPage(){
	 	var contentLabel = $("#contentDisplayNamePLPageId").val();
	    var path= $("#contentNamePathId").val();
	    var companyCd = $("#operatingCompanyIdEdit").val();
	    var contentItemValue = $("#contentItemValueId").val();
	    var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var secPageId = $('#secLandingDDId').val();
	    var description = $('#descriptionPageId').val();
	    
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({ 
			async: false,
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/contentManagement/updateContentOnSLPage',
	        type: 'GET',
	        data: {
	        	contentLabel:  contentLabel,	        	
	        	path:  path,
	        	companyCd: companyCd,
	        	contentItemValue:contentItemValue,
	        	contentType:contentType,
	         	state:state,
	         	channel:channel,
	         	secPageId: secPageId,
	         	description: description
	        },
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false
		}).done(function (response) {
			   
		}).fail(function (jqXHR, textStatus) {
		   
		}).always(function (jqXHR, textStatus) {
			$('#contentUploads').removeClass('hidden');	
		    $("#editLandingPage").modal('hide');
		    $.unblockUI();
		});
		
		changeOfSeclandingPage();
}

function addPrimaryContentLandingPageItem(){
	var contentType = $("#addContentTypePageId").val();
 	var contentLabel = $("#addContentLabelPageId").val();
    var path= $("#addContentPathPageId").val();
    var companyCd = $("#operatingCompanyIdAdd").val();
    var contentItemValue = $("#contentItemValueId").val();
    var pageValue = $("#pageValueId").val();
    var displayOrder = $("#displayOrderId").val();
    var state = $("#contentUploadStateId").val();
    var channel= $("#contentUploadChannelId").val();
    var department= $("#contentTypeId").val();
    
    var errorFlag = false;
    
    $('#descriptionId').hide();
    
    $(".errorMessageClsPLP").empty();
    $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','');
    $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','');
    
    if(contentLabel.length == 0){         
        $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','red');
        $("#addContentBubblePrmTable #contentLabelTypePrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                "<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
        errorFlag= true;
    } 
    
    if(contentType =='Mailto'){
        var emailValid = isEmailValid(path);
        if(emailValid == false){
            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                    "<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. email@prac.com</td></tr>");
            errorFlag= true;
        }
    }
    else if(contentType =='URL'){                
            if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(path)){
                //move forward      
            } else {                                
                $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
                $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                        "<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
                        "e.g. http://www.example.org</td></tr>");
                errorFlag= true;
            }
    }
    else if(path.length == 0){
        if(contentType =='Uploaded'){
            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                    "<td class='validation' style='color:red;margin-bottom: 20px;'>" +
                    "Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");              
            errorFlag= true;
        }
    } 
	if($("#operatingCompanyIdAdd").val() == null || companyCd =='-Select-'){         
        $("#addContentBubblePrmTable #operatingCompanyIdAdd").css('border-color','red');
        $("#addContentBubblePrmTable #OpCompId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                "<td class='validation' style='color:red;margin-bottom: 20px;'>Please select an Operating Company.</td></tr>");
        errorFlag= true;
    } 																					
    
    if(errorFlag == true){
        return;
    } 
    
    $('#secondaryContentResultId').removeClass('hidden');
    $('#primaryContentResultId').addClass('hidden');
    
	$.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
	
	$.ajax({ 
		async: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/contentManagement/addContentOnPLPage',
        type: 'GET',
        data: {
        	contentType:  contentType,
        	contentLabel:  contentLabel,	        	
        	path:  path,
        	companyCd: companyCd,
        	contentItemValue: contentItemValue,
        	pageValue: pageValue,
        	displayOrder: displayOrder,
        	department: department,
         	state:state,
         	channel:channel
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,	        
        cache: false
	}).done(function (response) {
		   
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		$('#contentUploads').removeClass('hidden');	
	    $("#addContentLandingPage").modal('hide');
	    $.unblockUI();
	});
	
	changeOfChannel();
}

function addSecondaryContentLandingPageItem(){
		var contentType = $("#addContentTypePageId").val();
	 	var contentLabel = $("#addContentLabelPageId").val();
	    var path= $("#addContentPathPageId").val();
	    var companyCd = $("#operatingCompanyIdAdd").val();
	    var contentItemValue = $("#contentItemValueId").val();
	    var pageValue = $("#pageValueId").val();
	    var displayOrder = $("#displayOrderId").val();
	    var description = $('#addDescription').val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var department= $("#contentTypeId").val();
	    var errorFlag = false;

	    
	    $(".errorMessageClsPLP").empty();
	    $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','');
	    $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','');
	    
	    if(contentLabel.length == 0){         
	        $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','red');
	        $("#addContentBubblePrmTable #contentLabelTypePrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
	                "<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
	        errorFlag= true;
	    } 
	    
	    if(contentType =='Mailto'){
	        var emailValid = isEmailValid(path);
	        if(emailValid == false){
	            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
	            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
	                    "<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. email@prac.com</td></tr>");
	            errorFlag= true;
	        }
	    }
	    else if(contentType =='URL'){                
	            if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(path)){
	                //move forward      
	            } else {                                
	                $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
	                $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
	                        "<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
	                        "e.g. http://www.example.org</td></tr>");
	                errorFlag= true;
	            }
	    }
	    else if(path.length == 0){
	        if(contentType =='Uploaded'){
	            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
	            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
	                    "<td class='validation' style='color:red;margin-bottom: 20px;'>" +
	                    "Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");              
	            errorFlag= true;
	        }
	    } 
	    if($("#operatingCompanyIdAdd").val() == null || companyCd =='-Select-'){         
	        $("#addContentBubblePrmTable #operatingCompanyIdAdd").css('border-color','red');
	        $("#addContentBubblePrmTable #OpCompId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
	                "<td class='validation' style='color:red;margin-bottom: 20px;'>Please select an Operating Company.</td></tr>");
	        errorFlag= true;
	    } 		
	    
	    if($('#descriptionId').css('display') != 'none'){
	    	if(description.length==0){
	    		$("#addContentBubblePrmTable #addDescription").css('border-color','red');
	    		$("#addContentBubblePrmTable #descriptionId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                "<td class='validation' style='color:red;margin-bottom: 20px;'>Description is required.</td></tr>");
	    		errorFlag = true;
	    	}
	    }
	    
	    if(errorFlag == true){
	        return;
	    } 
	    
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({ 
			async: false,
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/contentManagement/addContentOnSLPage',
	        type: 'GET',
	        data: {
	        	contentType:  contentType,
	        	contentLabel:  contentLabel,	        	
	        	path:  path,
	        	companyCd: companyCd,
	        	contentItemValue: contentItemValue,
	        	pageValue: pageValue,
	        	displayOrder: displayOrder,
	        	description: description,
	        	department: department,
	        	state: state,
	        	channel: channel
	        },
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false
		}).done(function (response) {
			   
		}).fail(function (jqXHR, textStatus) {
		   
		}).always(function (jqXHR, textStatus) {
			$('#contentUploads').removeClass('hidden');	
		    $("#addContentLandingPage").modal('hide');
		    $.unblockUI();
		});
		
		changeOfSeclandingPage();
} 

function deletePrimaryContentLandingPage(){
 	
    var contentItemValue = $("#contentItemValueId").val();
    var pageValue = $("#pageValueId").val();
    var displayOrder = $("#displayOrderId").val();
    
    $('#primaryContentResultId').removeClass('hidden');
	$('#secondaryContentResultId').addClass('hidden');
	
	var firstLevelContentsId = $('#firstLevelContents');
	var secLandingDDId = $('#secLandingDDId');
	
	$.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
	
	$.ajax({ 
		async: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/contentManagement/deleteContentLandingItem',
        type: 'GET',
        data: {
        	contentItemValue: contentItemValue,
        	pageValue: pageValue,
        	displayOrder: displayOrder
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,	        
        cache: false
	}).done(function (response) {
		   
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		$('#contentUploads').removeClass('hidden');	
	    $("#deleteLandingPage").modal('hide');
	    $.unblockUI();
	});
	
	changeOfChannel();
}

function deleteSecondaryContentLandingPage(){
	    var contentItemValue = $("#contentItemValueId").val();
	    var pageValue = $("#pageValueId").val();
	    var displayOrder = $("#displayOrderId").val();
	    
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({ 
			async: false,
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/contentManagement/deleteContentLandingItem',
	        type: 'GET',
	        data: {
	        	contentItemValue: contentItemValue,
	        	pageValue: pageValue,
	        	displayOrder: displayOrder
	        },
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false
		}).done(function (response) {
			   
		}).fail(function (jqXHR, textStatus) {
		   
		}).always(function (jqXHR, textStatus) {
			$('#contentUploads').removeClass('hidden');	
		    $("#deleteLandingPage").modal('hide');
		    $.unblockUI();
		});
		
		changeOfSeclandingPage();
}

function arrowUpOrDownPrimaryLandingPage(){
	var contentType = $("#addContentTypePageId").val();
 	var contentLabel = $("#addContentLabelPageId").val();
    var path= $("#addContentPathPageId").val();
    var companyCd = $("#operatingCompanyIdAdd").val();
    var contentItemValue = $("#contentItemValueId").val();
    var pageValue = $("#pageValueId").val();
	var department= $("#contentTypeId").val();
    var state = $("#contentUploadStateId").val();
    var channel= $("#contentUploadChannelId").val();
    var displayOrder = $("#displayOrderId").val();
	
    var arrowUpOrDownFlag = $('#arrowUpFlagId').val()
    
    $('#secondaryContentResultId').removeClass('hidden');
    $('#primaryContentResultId').addClass('hidden');
	
	$.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
	
	$.ajax({ 
		async: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/contentManagement/arrowUpOrDownPrimaryLandingPage',
        type: 'GET',
        data: {
        	contentType:  contentType,
        	contentLabel:  contentLabel,	        	
        	path:  path,
        	companyCd: companyCd,
        	contentItemValue: contentItemValue,
        	pageValue: pageValue,
        	displayOrder: displayOrder,
        	arrowUpOrDownFlag: arrowUpOrDownFlag,
			department: department,
			state: state,
			channel: channel
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,	        
        cache: false
	}).done(function (response) {
		   
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		$('#contentUploads').removeClass('hidden');	
	    $("#addContentLandingPage").modal('hide');
	    $.unblockUI();
	});
	
	changeOfChannel();
}

function arrowUpOrDownSecondaryLandingPage(){
	var contentType = $("#addContentTypePageId").val();
 	var contentLabel = $("#addContentLabelPageId").val();
    var path= $("#addContentPathPageId").val();
    var companyCd = $("#operatingCompanyIdAdd").val();
    var contentItemValue = $("#contentItemValueId").val();
    var pageValue = $("#pageValueId").val();
    var displayOrder = $("#displayOrderId").val();
    var arrowUpOrDownFlag = $('#arrowUpFlagId').val()
    
    $('#primaryContentResultId').removeClass('hidden');
	$('#secondaryContentResultId').addClass('hidden');
	
	var firstLevelContentsId = $('#firstLevelContents');
	var secLandingDDId = $('#secLandingDDId');
	
	$.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
	
	$.ajax({ 
		async: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/aiui/contentManagement/arrowUpOrDownSecondaryLandingPage',
        type: 'GET',
        data: {
        	contentType:  contentType,
        	contentLabel:  contentLabel,	        	
        	path:  path,
        	companyCd: companyCd,
        	contentItemValue: contentItemValue,
        	pageValue: pageValue,
        	displayOrder: displayOrder,
        	arrowUpOrDownFlag : arrowUpOrDownFlag
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 30000,	        
        cache: false
	}).done(function (response) {
		   
	}).fail(function (jqXHR, textStatus) {
	   
	}).always(function (jqXHR, textStatus) {
		$('#contentUploads').removeClass('hidden');	
	    $("#addContentLandingPage").modal('hide');
	    $.unblockUI();
	});
	
	changeOfSeclandingPage();
}

function inputDataValidation(){
    var errorFlag= false;
    $(".errorMessageClsPLP").empty();
    $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','');
    $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','');
    
    if(contentLabel.length == 0){         
        $("#addContentBubblePrmTable #addContentLabelPageId").css('border-color','red');
        $("#addContentBubblePrmTable #contentLabelTypePrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                "<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
        errorFlag= true;
    } 
    
    if(contentType =='Mailto'){
        var emailValid = isEmailValid(path);
        if(emailValid == false){
            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                    "<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. email@prac.com</td></tr>");
            errorFlag= true;
        }
    }
   else if(contentType =='URL'){                
            if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(path)){
                //move forward      
            } else {                                
                $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
                $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                        "<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
                        "e.g. http://www.example.org</td></tr>");
                errorFlag= true;
            }
   }
   else if(path.length == 0){
       if(contentType =='Uploaded'){
            $("#addContentBubblePrmTable #addContentPathPageId").css('border-color','red');
            $("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
                    "<td class='validation' style='color:red;margin-bottom: 20px;'>" +
                    "Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");              
            errorFlag= true;
        }
    } 
}

$(document).on("click", "#updateContentLandingPage", function(){
	if( $('#primaryLandingFlagId').val()=="YES"){
		updatePrimaryContentLandingPage();
	} else {
		updateSecondaryContentLandingPage();
	}
});

$(document).on("click", "#saveNewItemContentLanding", function(){
	if( $('#primaryLandingFlagId').val()=="YES"){
		addPrimaryContentLandingPageItem();
	} else {
		addSecondaryContentLandingPageItem();
	}
});

$(document).on("click", "#deleteContentLanding", function(){
	if( $('#primaryLandingFlagId').val()=="YES"){
		deletePrimaryContentLandingPage();
	} else {
		deleteSecondaryContentLandingPage();
	}
});

$(document).on("click", "#arrowUpOrDownLandingButton", function(){
	if($('#primaryLandingFlagId').val()=="YES"){
		arrowUpOrDownPrimaryLandingPage();
	} else {
		arrowUpOrDownSecondaryLandingPage(); 
	}
});

function displayPLPage(firstLevelContentsId, secLandingDDId, response){
	var primaryLandingList = JSON.stringify(response.contentItemList);	 
	var secLandingDropdown = JSON.stringify(response.secLandPageDropdown);
	
	secLandingDDId.append('<option>-Select-');
	$.each($.parseJSON(secLandingDropdown), function(index, value) {
	if(value!=null){
	    secLandingDDId.append('<option id="secLPageDDId" value='+index+'>'+value+'</option>').prop('disabled',false).trigger('chosen:updated');
	}
	});
	secLandingDDId.append('</option>');
	
	ReactDOM.render(<PrimaryLandingTable cols={cols} data={$.parseJSON(primaryLandingList)}/>,  document.getElementById('contentGridHeader'));
}

function displaySLPage(response){
	if(response!=null){
		var NoData = JSON.stringify(response.noData);	    			
		if(NoData === undefined || NoData == "null" || typeof(NoData) == null){
			var secondaryLandingList = JSON.stringify(response);	 
			var contentType= $("#contentTypeId").val();
		    var state = $("#contentUploadStateId").val();
		    var channel= $("#contentUploadChannelId").val();
		    if(contentType=='Resources' && (state=='NJ' || state =='PA' || state=='NY') && channel=='Captive'){
		    	ReactDOM.render(<SecondaryLandingTable cols={colsForSecPageDescription} data={$.parseJSON(secondaryLandingList)}/>,  document.getElementById('contentGridHeaderSecondary'));
		    }else{
			ReactDOM.render(<SecondaryLandingTable cols={colsForSecPage} data={$.parseJSON(secondaryLandingList)}/>,  document.getElementById('contentGridHeaderSecondary'));
		    }
			
		} else {
			$("#contentResultsGridHeaderSecondary").addClass('hidden');
			var secondLevelContentsId = $('#secondLevelContents');
			secondLevelContentsId.append('<tr><td class="contentTD1">'+response.noData+'</td><td class="contentTD1">'+
			'<a id="addFirstPage" class="prmLinkRight">Add</a></td></tr>');
		}
	}
}

var PrimaryLandingTable = createReactClass({

	render: function() {
		var headerComponents = this.generateHeaders(),
            rowComponents = this.generateRows();

            return (
            	<table>
            		<thead> {headerComponents} </thead>
            		<tbody> {rowComponents} </tbody>
            	</table>
            );
	},

   generateHeaders: function() {
	   var cols = this.props.cols;  
	   
	   return cols.map(function(colData) {
		   if(colData.key=='operatingCompanyCd'){
			   return <th style={thStyleForCompany} key={colData.key}> {colData.label} </th>;
		   }else if (colData.key=='displayValue'){
			   return <th style={thStyleForSecColumn} key={colData.key}> {colData.label} </th>;
		   }else{
			   return <th style={thStyleForFirstAndLastColumn} key={colData.key}> {colData.label} </th>;
		   }
       });
   },
   
   generateRows: function() {
	   var cols = this.props.cols,  
           data = this.props.data;
	   
	   function editPrimaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId){
		   var chosenState = $("#contentUploadStateId").val();
		   var selectedChannel = $("#contentUploadChannelId").val();
		   var operatingCompany = $('#operatingCompanyIdEdit');
		   var primaryLandingFlag = "YES";
		   var opCompanyMap='';
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#editContentTypePLPageId').text(contentType);
		   $('#contentDisplayNamePLPageId').val(displayVal);
		   
		 	$('#descriptionEdit').hide();
		   
		   //TD#75364 - Edit URL does not have path field
		   if(contentType=='Uploaded Document' || contentType == 'Mailto' || contentType == 'URL'){
			   $('#contentPathId').removeClass('hidden');
			   if(contentType=='Uploaded Document') {
				   if (url.indexOf("http") == -1) {
				   url = "/AIContent" + url;
			   }
			   }
			   $('#contentNamePathId').val(url);
		   } else {
			   $('#contentPathId').addClass('hidden');
			   $('#contentNamePathId').val('');
		   }
		   
		   if(chosenState == 'CT' || chosenState == 'MA'){

			   if(contentType=='Header' || contentType=='Uploaded Document'){
				   opCompanyMap = opCompanyMapGroup1ForHeaderOnly;
			   } else {
				   opCompanyMap = opCompanyMapGroup1;
			   }
		   } else if(chosenState == 'NH'){
			   opCompanyMap = opCompanyMapGroup2;
		   } else if(chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY'){
			   if(selectedChannel == 'Teachers'){
				   opCompanyMap = opCompanyMapGroup3IndependentAgent;
			   } else if(selectedChannel == 'Captive'){
				   opCompanyMap = opCompanyMapGroup3Captive;
			   } 
		   }
		   
		   if(Object.keys(opCompanyMap).length == 1){
			   $('.operatingCompanyIdSelectClass').hide();
			   $('.operatingCompanyIdLiteralClass').show();
			    $('.operatingCompanyIdLiteralClass').html(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0]);
			   operatingCompany.html('<option id="operatingCompanyIdEdit" value='+(Object.keys(opCompanyMap)[0])+'>'+(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0])+'</option>');
		   }else{
			   $('.operatingCompanyIdLiteralClass').hide();
			   $('.operatingCompanyIdSelectClass').show();
			   operatingCompany.find('option').remove().end();
			   $.each(opCompanyMap, function(val, text) {
				   operatingCompany.append('<option id="operatingCompanyIdEdit" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			   });			
			   $('#operatingCompanyIdEdit').val(operatingCompanyCd).trigger('chosen:updated');
			   operatingCompany.append('</option>');
			   
		   }
		   
		  
		   $("#editLandingPage").modal('show');
	   };
	   
	   function addNewContentItem(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var chosenState = $("#contentUploadStateId").val();
		   var selectedChannel = $("#contentUploadChannelId").val();
		   var operatingCompany = $('#operatingCompanyIdAdd');
		   var addContentType = $('#addContentTypePageId');
		   var primaryLandingFlag = "YES";
		   var opCompanyMap='';
		   $('#contentPathPrmIdFirst').show();
		   $('#descriptionId').hide();
		   
		   //Clear existing fields
		   $('#addContentLabelPageId').val('');
		   $('#addContentPathPageId').val('');
		   $(".errorMessageClsPLP").empty();
		   $("#addContentLabelPageId").css('border-color','');
		    $("#addContentPathPageId").css('border-color','');
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   
		   if(chosenState == 'CT' || chosenState == 'MA'){
			   opCompanyMap = opCompanyMapGroup1ForHeaderOnly;
		   } else if(chosenState == 'NH'){
			   opCompanyMap = opCompanyMapGroup2;
		   } else if(chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY'){
			   if(selectedChannel == 'Teachers'){
				   opCompanyMap = opCompanyMapGroup3IndependentAgent;
			   } else if(selectedChannel == 'Captive'){
				   opCompanyMap = opCompanyMapGroup3Captive;
			   } 
		   }
		   
		   addContentType.find('option').remove().end();
		   $.each(contentTypeMap, function(val, text) {
			   addContentType.append('<option id="addContentTypePageId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
		   });			
		   $('#addContentTypePageId').val("Uploaded").trigger('chosen:updated');
		   addContentType.append('</option>');
		 //hide path for header
		   if('Header' == $('#addContentTypePageId').val()){
			   $('#contentPathPrmIdFirst').hide();
		   }
		      		   
		   if(Object.keys(opCompanyMap).length == 1){
			   $('.operatingCompanyIdSelectClass').hide();
			   $('.operatingCompanyIdLiteralClass').show();
			   $('.operatingCompanyIdLiteralClass').html(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0]);
			   operatingCompany.html('<option id="operatingCompanyIdAdd" value='+(Object.keys(opCompanyMap)[0])+'>'+(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0])+'</option>');
		   }else{
			   $('.operatingCompanyIdLiteralClass').hide();
			   $('.operatingCompanyIdSelectClass').show();
			   operatingCompany.find('option').remove().end();
			   $.each(opCompanyMap, function(val, text) {
				   operatingCompany.append('<option id="operatingCompanyIdAdd" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			   });			
			   $('#operatingCompanyIdAdd').val('').trigger('chosen:updated');
			   operatingCompany.append('</option>');
		   }
		   		   
		   $("#addContentLandingPage").modal('show');
	   };
	   
	   function deletePrimaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "YES";
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $('#messageDeleteText').text(' Are you sure you want to delete'+' '+displayVal+'?');
		   $("#deleteLandingPage").modal('show');
	   };
	   
	   function arrowUpOperation(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "YES";
		   var arrowUpFlag = "YES";
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#arrowUpFlagId').val(arrowUpFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $("#arrowUpOrDownLandingButton").click();
	   };
	   
	   function arrowDownOperation(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "YES";
		   var arrowUpFlag = "NO";
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#arrowUpFlagId').val(arrowUpFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $("#arrowUpOrDownLandingButton").click();
	   };

       return data.map(function(item) {
    	   var contentType = item.contentType;
    	   var displayVal = item.displayValue;
    	   var operatingCompanyCd = item.operatingCompanyCd; 
    	   var url = item.url;
		   var hrefUrl = item.url;					   
    	   var contentItemId = item.contentItemId;
    	   var contentTypeDeleteFlag = false;
    	   var pageId = item.pageId;
    	   var displayOrder = item.displayOrder;
    	   var aiVignetteURL = item.aiVignetteURL;
    	   var contentTypedisplay = false;
     	   
		   if (hrefUrl.indexOf("http") == -1)  {
    		   hrefUrl = aiVignetteURL + hrefUrl;
    	   }							  
    	   if (contentType =='Primary Page') {
    		   contentTypedisplay = true;
    	   }
    	   
    	   if(contentType=='Header' || contentType=='Uploaded Document' || contentType=='URL'){
    		   contentTypeDeleteFlag = true;
    	   }
    	   
    	   var cells = cols.map(function(colData) {
    		   if(colData.key=='adminOperation'){
    			   if (contentTypedisplay == true){
    				   return <td style={tdStyleForAdminOperation}> 
			   		    	<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
	    						url, contentItemId, pageId, displayOrder)} />
			   		  	</td>; 
    			   }
    			   else if(contentTypeDeleteFlag == true){
    				   return <td style={tdStyleForAdminOperation}> 
    				   		  	<ContentAdminPageEdit edit={() => editPrimaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId)} />
    				   		  	<ContentAdminPageDelete del={() => deletePrimaryLandingPage(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowUp arrowUp={() => arrowUpOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowDown arrowDown={() => arrowDownOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    				   		  	</td>;
    			   }else {
    				   return <td style={tdStyleForAdminOperation}> 
    				   			<ContentAdminPageEdit edit={() => editPrimaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId)} />
    				    		<ContentAdminPageArrowUpWithoutDelete arrowUp={() => arrowUpOperation(contentType, displayVal, operatingCompanyCd, 
    				    				url, contentItemId, pageId, displayOrder)} />
    				    		<ContentAdminPageArrowDown arrowDown={() => arrowDownOperation(contentType, displayVal, operatingCompanyCd, 
    				    				url, contentItemId, pageId, displayOrder)} />
    				   			<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    				    	  </td>;
    			   }
    		   }else if(colData.key=='displayValue'){
    			   if(item.contentType=='Header'){
    				   return <td style={tdStyleForHeaderRow}> {item[colData.key]} </td>;
        		   }else if(item.contentType=='URL'){
        			   return <td style={tdStyleForSecRow}> 
			   					<a target='_blank' href={url}>{item[colData.key]}</a> 
			   				  </td>;
        		   }else if(item.contentType=='Secondary Page'){
        			   return <td style={tdStyleForHeaderRow}> {item[colData.key]} </td>;
        		   }else if(item.contentType=='Mailto'){
        			   return <td style={tdStyleForSecRow}> 
			   					<a href={"mailto:" + url}>{item[colData.key]}</a>
			   				  </td>;
        		   }else {
        			   return <td style={tdStyleForSecRow}> 
        			   			<a target='_blank' href={hrefUrl}>{item[colData.key]}</a> 
        			   		  </td>;
        		   }
    		   }else if(colData.key=='operatingCompanyCd'){
    		       if(item[colData.key]=='PRPG'){
    		           return <td style={tdStyleForCompany}>PR/PG</td>;
    		       } else {
    		           return <td style={tdStyleForCompany}> {item[colData.key]} </td>;
    		       }
    		   }else {
    			   return <td style={tdStyleForSecColumn}> {item[colData.key]} </td>;
    		   }
           });
    	   return <tr key={item.id}> {cells} </tr>;
       });
   }
});

var SecondaryLandingTable = createReactClass({

	render: function() {
		var headerComponents = this.generateHeaders(),
            rowComponents = this.generateRows();

            return (
            	<table>
            		<thead> {headerComponents} </thead>
            		<tbody> {rowComponents} </tbody>
            	</table>
            );
	},

   generateHeaders: function() {
	   var cols = this.props.cols;  
	   
	   return cols.map(function(colData) {
		   if(colData.key=='operatingCompanyCd'){
			   return <th style={thStyleForCompany} key={colData.key}> {colData.label} </th>;
		   }else if (colData.key=='displayValue'){
			   return <th style={thStyleForSecColumn} key={colData.key}> {colData.label} </th>;
		   }else if (colData.key=='contentType'){
			   return <th style={thStyleForContentType} key={colData.key}> {colData.label} </th>;
		   }else if (colData.key=='description'){
			   return <th style={thStyleForDescription} key={colData.key}> {colData.label} </th>;
		   }else{
			   return <th style={thStyleForFirstAndLastColumn} key={colData.key}> {colData.label} </th>;
		   }
       });
   },
   
   generateRows: function() {
	   var cols = this.props.cols,  
           data = this.props.data;
	   
	   function editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, description){
		   var chosenState = $("#contentUploadStateId").val();
		   var selectedChannel = $("#contentUploadChannelId").val();
		   var operatingCompany = $('#operatingCompanyIdEdit');
		   var primaryLandingFlag = false;
		   var opCompanyMap = '';
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#editContentTypePLPageId').text(contentType);
		   $('#contentDisplayNamePLPageId').val(displayVal);
		   $('#descriptionPageId').val(description);
		   
		    //TD#75364 - Edit URL does not have path field
		   if(contentType=='Uploaded Document'||contentType=='Mailto' || contentType == 'URL'){
			   $('#contentPathId').removeClass('hidden');
			   if(contentType=='Uploaded Document') {
				   if (url.indexOf("http") == -1) {
				   url = "/AIContent" + url;
			   }
			   }
			   $('#contentNamePathId').val(url);
		   } else {
			   $('#contentPathId').addClass('hidden');
			   $('#contentNamePathId').val('');
		   }
		   
		   $('#descriptionEdit').hide();
		   if((chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY') && $("#contentTypeId").val()=='Resources' && selectedChannel=='Captive' ){
			   if(contentType=='Uploaded Document' || contentType == 'URL'){
				   $('#descriptionEdit').show();
			   }
		   }
		   
		   
		   if(chosenState == 'CT' || chosenState == 'MA'){
			   if(contentType=='Header' || contentType=='Uploaded Document'){
				   opCompanyMap = opCompanyMapGroup1ForHeaderOnly;
			   } else {
				   opCompanyMap = opCompanyMapGroup1;
			   }
		   } else if(chosenState == 'NH'){
			   opCompanyMap = opCompanyMapGroup2;
		   } else if(chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY'){
			   if(selectedChannel == 'Teachers'){
				   opCompanyMap = opCompanyMapGroup3IndependentAgent;
			   } else if(selectedChannel == 'Captive'){
				   opCompanyMap = opCompanyMapGroup3Captive;
			   } 
		   }
		   
		   if(Object.keys(opCompanyMap).length == 1){
			   $('.operatingCompanyIdSelectClass').hide();
			   $('.operatingCompanyIdLiteralClass').show();
			    $('.operatingCompanyIdLiteralClass').html(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0]);
			   operatingCompany.html('<option id="operatingCompanyIdEdit" value='+(Object.keys(opCompanyMap)[0])+'>'+(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0])+'</option>');
		   }else{
			   $('.operatingCompanyIdLiteralClass').hide();
			   $('.operatingCompanyIdSelectClass').show();
			   operatingCompany.find('option').remove().end();
			   $.each(opCompanyMap, function(val, text) {
				   operatingCompany.append('<option id="operatingCompanyIdEdit" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			   });			
			   $('#operatingCompanyIdEdit').val(operatingCompanyCd).trigger('chosen:updated');
			   operatingCompany.append('</option>');
		   }
		   
		   $("#editLandingPage").modal('show');
	   };
	   
	   function addNewContentItem(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var chosenState = $("#contentUploadStateId").val();
		   var selectedChannel = $("#contentUploadChannelId").val();
		   var operatingCompany = $('#operatingCompanyIdAdd');
		   var addContentType = $('#addContentTypePageId');
		   var primaryLandingFlag = "NO";
		   var opCompanyMap = '';
		   $('#contentPathPrmIdFirst').show();
		   
		   $('#addContentLabelPageId').val('');
		   $('#addContentPathPageId').val('');
		   $('#addDescription').val(''); 
		   $(".errorMessageClsPLP").empty();
		   $("#addContentLabelPageId").css('border-color','');
		    $("#addContentPathPageId").css('border-color','');
		    
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   
		   $('#descriptionId').hide();
		   if((chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY') && $("#contentTypeId").val()=='Resources' && selectedChannel=='Captive' ){
			   if(contentType!='Header'){
				   $('#descriptionId').show();
			   }
		   }
		   
		   if(chosenState == 'CT' || chosenState == 'MA'){
			   opCompanyMap = opCompanyMapGroup1ForHeaderOnly;
		   } else if(chosenState == 'NH'){
			   opCompanyMap = opCompanyMapGroup2;
		   } else if(chosenState == 'NJ' || chosenState == 'PA' || chosenState == 'NY'){
			   if(selectedChannel == 'Teachers'){
				   opCompanyMap = opCompanyMapGroup3IndependentAgent;
			   } else if(selectedChannel == 'Captive'){
				   opCompanyMap = opCompanyMapGroup3Captive;
			   } 
		   }
		   
		   addContentType.find('option').remove().end();
		   $.each(contentTypeMap, function(val, text) {
			   addContentType.append('<option id="addContentTypePageId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
		   });			
		   $('#addContentTypePageId').val("Uploaded").trigger('chosen:updated');
		   addContentType.append('</option>');
		   //hide path for header
		   if('Header' == $('#addContentTypePageId').val()){
			   $('#contentPathPrmIdFirst').hide();
			   $('#descriptionId').hide();
		   }
		   
		   if(Object.keys(opCompanyMap).length == 1){
			   $('.operatingCompanyIdSelectClass').hide();
			   $('.operatingCompanyIdLiteralClass').show();
			   $('.operatingCompanyIdLiteralClass').html(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0]);
			   operatingCompany.html('<option id="operatingCompanyIdAdd" value='+(Object.keys(opCompanyMap)[0])+'>'+(Object.keys(opCompanyMap).map(itm => opCompanyMap[itm])[0])+'</option>');
		   }else{
			   $('.operatingCompanyIdLiteralClass').hide();
			   $('.operatingCompanyIdSelectClass').show();
			   operatingCompany.find('option').remove().end();
			   $.each(opCompanyMap, function(val, text) {
				   operatingCompany.append('<option id="operatingCompanyIdAdd" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			   });			
			   $('#operatingCompanyIdAdd').val('').trigger('chosen:updated');
			   operatingCompany.append('</option>');
		   }
		   
		   
		   $("#addContentLandingPage").modal('show');
	   };
	   
	   function deleteSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "NO";
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $('#messageDeleteText').text(' Are you sure you want to delete'+' '+displayVal+'?');
		   $("#deleteLandingPage").modal('show');
	   }; 
	   
	   function arrowUpOperation(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "NO";
		   var arrowUpFlag = "YES";
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#arrowUpFlagId').val(arrowUpFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $("#arrowUpOrDownLandingButton").click();
	   };
	   
	   function arrowDownOperation(contentType, displayVal, operatingCompanyCd, url, contentItemId, pageId, displayOrder){
		   var primaryLandingFlag = "NO";
		   var arrowUpFlag = "NO";
		   
		   $('#primaryLandingFlagId').val(primaryLandingFlag);
		   $('#arrowUpFlagId').val(arrowUpFlag);
		   $('#contentItemValueId').val(contentItemId);
		   $('#pageValueId').val(pageId);
		   $('#displayOrderId').val(displayOrder);
		   $("#arrowUpOrDownLandingButton").click();
	   };
	   
       return data.contentItemList.map(function(item) {
    	   var contentType = item.contentType;
    	   var displayVal = item.displayValue;
    	   var url = item.url;
    	   var operatingCompanyCd = item.operatingCompanyCd;
    	   var contentItemId = item.contentItemId;
    	   var pageId = item.pageId;
    	   var displayOrder = item.displayOrder;
    	   var aiVignetteURL = item.aiVignetteURL;
    	   var uploadDocumentFlag = false;
    	   var deleteDocumentFlag = false;
    	   var channelFlag = false;
    	   var selectedChannel = $("#contentUploadChannelId").val();
    	   var description = item.description;
    	   var secondaryPageDisplay = false;
    	   
    	   if (contentType =='SecondaryPage') {
    		   secondaryPageDisplay = true;
    	   }
    	   
    	   if(contentType=='Uploaded Document'){
    		   uploadDocumentFlag = true;
    	   }
    	   
    	   if(contentType=='Header'){
    		   deleteDocumentFlag = true;
    	   }

    	   if(selectedChannel =='Captive' && contentType=='Secondary Page'){
    		   channelFlag = true;
    	   }
    	   
    	   var cells = cols.map(function(colData) {
    		   if(colData.key=='adminOperation'){
    			   if (secondaryPageDisplay == true){
    				   return <td style={tdStyleForAdminOperation}> 
			   		    	<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
	    						url, contentItemId, pageId, displayOrder)} />
			   		  	</td>; 
    			   } else if(uploadDocumentFlag == true || deleteDocumentFlag == true){
    				   return <td style={tdStyleForAdminOperation}> 
    				   		  	<ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, description)} />
    				   		  	<ContentAdminPageDelete del={() => deleteSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowUp arrowUp={() => arrowUpOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowDown arrowDown={() => arrowDownOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  </td>;
    			   } else {
    				   if(channelFlag == true){
    					   return <td style={tdStyleForAdminOperation}> 
				    			  	<ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId)} />
				    			  </td>;
    				   }else {
    					   if(item.contentType=='Mailto') {
    						   return <td style={tdStyleForAdminOperation}> 
			    				<ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId)} />
			    				<ContentAdminPageDelete del={() => deleteSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowUp arrowUp={() => arrowUpOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
    				   		  	<ContentAdminPageArrowDown arrowDown={() => arrowDownOperation(contentType, displayVal, operatingCompanyCd, 
    				   		  			url, contentItemId, pageId, displayOrder)} />
			    				<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
			    			  </td>;
    					   }//here  
    					   else if(item.contentType=='Category'){
    						   return <td style={tdStyleForAdminOperation}> 
    						   <ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, description)} />
    						   </td>;
    					   }
    					   else if(item.contentType=='URL'){
    						   return <td style={tdStyleForAdminOperation}> 
			    				<ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, description)} />
    						   <ContentAdminPageDelete del={() => deleteSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
    						   <ContentAdminPageArrowUp arrowUp={() => arrowUpOperation(contentType, displayVal, operatingCompanyCd, 
   				   		  			url, contentItemId, pageId, displayOrder)} />
   				   		  	   <ContentAdminPageArrowDown arrowDown={() => arrowDownOperation(contentType, displayVal, operatingCompanyCd, 
   				   		  			url, contentItemId, pageId, displayOrder)} />
			    				<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
			    			  </td>;
    					   }else {
    						   return <td style={tdStyleForAdminOperation}> 
			    				<ContentAdminPageEdit edit={() => editSecondaryLandingPage(contentType, displayVal, operatingCompanyCd, url, contentItemId, description)} />
			    				<ContentAdminPageAdd add={() => addNewContentItem(contentType, displayVal, operatingCompanyCd, 
			    						url, contentItemId, pageId, displayOrder)} />
			    			  </td>;
    					   }
    					   
    				   }
    			   }
    		   }else if (colData.key=='displayValue'){
    			   if(uploadDocumentFlag == true){
    				   var tempurl = url.replace("AIContent", "");
    				   if (tempurl.indexOf("http") == -1)  {
    					   tempurl = aiVignetteURL + tempurl;
    		    	   }
        			   return <td style={tdStyleForSecRow}> 
        			   <a target='_blank' title={item[colData.key]} href={aiVignetteURL + tempurl}>{item[colData.key].slice(0,50)}</a>
        			   		  </td>;
        		   }else if(item.contentType=='URL'){
        			   return <td style={tdStyleForSecRow}> 
	   							<a target='_blank' href={url}>{item[colData.key]}</a> 
	   						  </td>;
        		   }else if(item.contentType=='Mailto'){
        			   return <td style={tdStyleForSecRow}> 
        			   			<a href={"mailto:" + url}>{item[colData.key]}</a>
        			   		  </td>;
        		   }else {
        			   return <td style={tdStyleForHeaderRow}> {item[colData.key]} </td>;
        		   }
    		   }else if(colData.key=='operatingCompanyCd'){
    			   return <td style={tdStyleForCompany}> {item[colData.key]} </td>;
    		   }else if(colData.key=='Description'){
    			   return <td style={tdStyleForDescription}> {item[colData.key]} </td>;
    		   }else{
    			   return <td style={tdStyleForSecColumn}> {item[colData.key]} </td>;
    		   }
           });
    	   return <tr key={item.id}> {cells} </tr>;
       });
   }
});

var ContentAdminPageEdit = createReactClass({
	render() {
		return (
			<a style={leftAligned} onClick={this.props.edit}>Edit</a> 
		);
	}
});

var ContentAdminPageDelete = createReactClass({
	render() {
		return (
			<a style={rightPadding} onClick={this.props.del}>Delete</a> 
		);
	}
});

var ContentAdminPageArrowUp = createReactClass({
	render() {
		return (
			<a style={rightPadding} onClick={this.props.arrowUp}><img src="../../aiui/resources/images/arrow_up_blue.png"/></a>
		);
	}
});

var ContentAdminPageArrowDown = createReactClass({
	render() {
		return (
			<a onClick={this.props.arrowDown}><img src="../../aiui/resources/images/arrow_down_blue.png"/></a>
		);
	}
});

var ContentAdminPageArrowUpWithoutDelete = createReactClass({
	render() {
		return (
			<a style={rightPaddingWithoutDel} onClick={this.props.arrowUp}><img src="../../aiui/resources/images/arrow_up_blue.png"/></a>
		);
	}
});

var ContentAdminPageAdd = createReactClass({
	render(){
		return (
			<a style={rightAlignedforAdd} onClick={this.props.add}>Add</a>	
		);
	}
});