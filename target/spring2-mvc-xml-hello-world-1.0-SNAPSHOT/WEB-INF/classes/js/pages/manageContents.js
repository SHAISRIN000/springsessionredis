jQuery(document).ready(function() {
	
	//51077 - Content Management - Should see breadcrumb when in new content management page
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Content Management');
	
	resetAddContentPopUp();
	$('#contentUploads').removeClass('hidden');
	$('#contentUploadChannelId').prop('disabled',true).trigger('chosen:updated');
	$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
	
	//51076
	$('#formBottomGrey').addClass('hidden');
	$('#formBottom').removeClass('hidden');
	$('#links').addClass('hidden');
	
	$("#contentTypeId").change(function(){	
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
	
$("#contentUploadStateId").change(function(){	
		$("#contentUploadChannelId").text('');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');		
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		var contentUploadChannelId = $('#contentUploadChannelId');
		$('#contentUploadChannelId').prop('selectedIndex',0).trigger('chosen:updated');
	    var state = $("#contentUploadStateId").val();
	    var contentType= $("#contentTypeId").val();
	    if(contentType =='Marketing' && state =='CT' ){
	    	$('#contentUploadChannelId').prop('disabled',true).trigger('chosen:updated');
	    	$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
	    	return;
	    }
	    var linkURL = '/aiui/manageContent/getChannel/state/'+state;
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },	       
	        url:linkURL,
	        type: "get",
	        cache: false,
		    success: function(response){
		    	var channelFlag=0;
		    	contentUploadChannelId.append('<option>-Select-</option>');
		    	$.each(response, function(val, text) {
		    		channelFlag=channelFlag+1;
		    		contentUploadChannelId.append('<option id="channelDDId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
                });
		    	$('#channelFlag').val(channelFlag);
		    },
		
	    error: function(jqXHR, textStatus, errorThrown){	
	    
	    },	        
	    complete: function(){	
	    	// enable for user action
	    	$.unblockUI();
        }
	    });
	});
	
	$("#contentUploadChannelId").change(function(){
		// console.log('contentUploadChannelId change');
		changeOfChannel();
	});
	
	$("#secLandingDDId").on('change', function(){
		$('#primaryContentResultId').addClass('hidden');
		//console.log('secLandingDDId change');
		var categoryName = $(this).find(":selected").text();		
		var secondLevelContentsId = $('#secondLevelContents');		
		var secLandingDDId = $('#secLandingDDId').val();
		var contentType= $("#contentTypeId").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var captiveSecondaryLandingPageFlag= $("#captiveSecondaryLandingPageFlag").val();
	    //#64826 related secondary page drop down value's getting lost
	    var secLandingPageVal = $('#secLandingDDId').val();
	    //console.log('categoryName ='+categoryName+' secLandingDDId ='+secLandingDDId+' contentType ='+contentType+' captiveSecondaryLandingPageFlag ='+captiveSecondaryLandingPageFlag);
	    if($("#secLandingDDId").val() =='-Select-'){
			$('#secondaryContentResultId').addClass('hidden');
			$('#secondaryContentResultFOfficeFormId').addClass('hidden');
			changeOfChannel();
			return;
		}
  var cfId = $(this).val();
	    if(channel =='Captive' && captiveSecondaryLandingPageFlag !='YES'){
	    	handleCaptiveSecondaryDD(categoryName, cfId, state, channel, contentType);
	    } else {
	    	$('#secondLevelContents').empty('');
	    	var linkURL = '/aiui/manageContent/contentType/' + contentType+'/state/'+state+'/channel/'+channel+'/secPage/'+secLandingDDId;
	    	$('#secondaryContentResultId').removeClass('hidden');
	    	// console.log('call handleCaptiveSecondaryDD with linkURL = '+linkURL);
	    $.blockUI({
    		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
    		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
    	});
	    	
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },	       
	        url:linkURL,
	        type: "get",
	        cache: false,
		    success: function(response){
		    	if(response!=null){
		    		displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal);
		    		}       
			    },
			    error: function(jqXHR, textStatus, errorThrown){	           
			    },
			    complete: function(){		    	
				    $('#contentUploads').removeClass('hidden');
				    $.unblockUI();
		        }
		    });
	    }
	});
	
	function handleCaptiveSecondaryDD(categoryName, cfId ,state, channel, contentType){
		if($("#secLandingDDId").val() =='-Select-'){
			$('#secondaryContentResultId').addClass('hidden');
			return;
		}
		
		$('#primaryContentResultId').addClass('hidden');
		var secondLevelContentsId;
		var isCFFO = isCFFOForm(categoryName);
		//console.log('handleCaptiveSecondaryDD isCFFO = '+isCFFO);
		if(isCFFO){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}else{
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
			}
		/*if(cfId!=16){
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}else if( cfId == 16){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}*/
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		var secPageFlag=$("#secPageFlag").val(); 
		var secLandingDDId = $('#secLandingDDId');
		var contentType= $("#contentTypeId").val();	
		//make this generic to as captive now come from PA also
		var department = contentType;
		var linkURL = '/aiui/manageContent/contentType/secPageNJCaptive/'+categoryName+'/state/'+state+'/channel/'+channel+'/department/'+department;
		var categoryFlag;
		var foFormContentId;
		
		//console.log('handleCaptiveSecondaryDD linkURL = '+linkURL);
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },	       
	        url:linkURL,
	        type: "get",
	        cache: false,
		    success: function(response){		    	
		    	if(response!=null){
		    		displaySLPCaptive(response, secondLevelContentsId, cfId, categoryName, foFormContentId, secPageFlag, secLandingDDId );
		   	   }
		    },
			error: function(jqXHR, textStatus, errorThrown){	           
			 },
			complete: function(){	
					$('#contentUploads').removeClass('hidden');
					$.unblockUI();
		     }	
	    });
	}
		
	$(document).on("click", "#editSLPId", function(){
		
		var clsContentType=$(this).closest('tr').find('.clsContentType').val();
		if(clsContentType=='Header'){
			$("#editContentBubbleBody #contentPathId").hide();
			$("#contentDescriptionID").hide();
		} else{
			$("#editContentBubbleBody #contentPathId").show();
			$("#contentDescriptionID").show();
		}
		
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();	
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();
		var urlToDisplay=$(this).closest('tr').find('.clsUrlToDisplay').val();
		var cfId = $(this).closest('tr').find('.clsCFId').val();
		var description = $(this).closest('tr').find('.clsDescriptionID').val();
		$("#IsFOFormFlag").val(clsIsFOForm);
		var IsCaptive = $(this).closest('tr').find('.clsIsCaptive').val();
		$("#IsCaptive").val(IsCaptive);
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#cfID").val(cfId);
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#cfDetailsID").val(clsCFDetailsID);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#editContentBubbleBody #contentDescriptionId").val(description);
		$("#oldUrlID").val(clsUrlID);				
		$("#contentDisplayNameId").val(clsUrlDisplayNameID);
		$("#contentNamePathId").val(urlToDisplay);
		$("#editFOFormCategoryFlag").val("NO");
		$("#editFOFormHeadingFlag").val("NO");
		$("#HeaderOrNotFlag").val("NO");
		
		var catName = $('#categoryNameHiddenID').val();
		var isCFFO = isCFFOForm(catName);
		if(!isCFFO){
			$('#contentDescriptionID').hide();
		}
		//	console.log('editSLPId catName = '+catName+' isCFFO = '+isCFFO);
		/*if(cfId != 16){
			$('#contentDescriptionID').hide();
		}*/
		
		var clsOpCompaneName=$(this).closest('tr').find('.clsCompanyCD').val();
		if(clsOpCompaneName =='HP'){
			$('#editCBOperatingCompId').html('High Point');
		} else if(clsOpCompaneName =='IA'){
			$('#editCBOperatingCompId').html('Palisades');
		} else if(clsOpCompaneName =='PG'){
			$('#editCBOperatingCompId').html('Pilgrim');
		} else if(clsOpCompaneName =='PR'){
			$('#editCBOperatingCompId').html('Plymouth Rock');
		} else if(clsOpCompaneName =='MW'){
			$('#editCBOperatingCompId').html('Mt. Washington');
		}else if(clsOpCompaneName =='BK'){
			$('#editCBOperatingCompId').html('Bunker Hill');
		}
		
		$("#editContentBubble").modal('show');
	});
	
	$(document).on("click", "#submitEditContentBubble", function(){
		var IsCaptive = $("#IsCaptive").val();
		var cfID = $("#cfID").val();
		var cfDetailsId = $("#cfDetailsID").val();
		var oldUrlDisplayName = $("#oldUrlDisplayNameID").val();
		var oldUrl = $("#oldUrlID").val();		
		var newUrlDisplayName= $("#contentDisplayNameId").val();
		var contentDescription= $("#editContentBubbleBody #contentDescriptionId").val();
		var newUrl = $("#contentNamePathId").val();		
	    var channel= $("#contentUploadChannelId").val();
	    var captiveSecondaryLandingPageFlag= $("#captiveSecondaryLandingPageFlag").val();	   
	    var categoryName = $("#categoryNameHiddenID").val();
	    var contentDisplayNameFOFormsId = $("#contentDisplayNameFOFormsId").val();
	    var IsSecondayLandingPage = $("#IsSecondayLandingPage").val();
	    var secLandingPageVal = $('#secLandingDDId').val();
	    if(IsSecondayLandingPage == 'YES'){
		    $('#secLandingDDId').html("");
		    categoryName = contentDisplayNameFOFormsId;
	    }
	    
	    $('#primaryContentResultId').addClass('hidden');
		var secondLevelContentsId;		
		
		var isCFFO = isCFFOForm(categoryName);
		if(isCFFO){
			$('#secondaryContentResultId').addClass('hidden');
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}else{
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}
		
		// console.log('submitEditContentBubble categoryName = '+categoryName +' isCFFO ='+isCFFO);
		/*if(cfID !=16){
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		} else if(cfID == 16){
			$('#secondaryContentResultId').addClass('hidden');
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}*/
		
		var secLPageDDFlag=$("#secLPageDDFlag").val();
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		var secPageFlag=$("#secPageFlag").val(); 
		
		var secLandingDDId = $('#secLandingDDId');
		
		var editFOFormCategoryFlag = $("#editFOFormCategoryFlag").val();
		
		var editFOFormHeadingFlag = $("#editFOFormHeadingFlag").val();
		var IsFOFormFlag= $("#IsFOFormFlag").val();		
		var state = $("#contentUploadStateId").val();
		var contentType= $("#contentTypeId").val();
		var HeaderOrNotFlag = $("#HeaderOrNotFlag").val();
		var foFormContentId;
		
		// console.log('submitEditContentBubble state='+state+' channel = '+channel+' url  = /aiui/manageContent/updateContentFilterDetails');
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/updateContentFilterDetails',
	        type: 'POST',
	        cache: false,
	        data: JSON.stringify({
	        	newDisplayName:  newUrlDisplayName,
	        	newUrlPath:  newUrl,
	        	oldDisplayName:  oldUrlDisplayName,  
	        	oldUrlPath:  oldUrl,
	        	id:  cfDetailsId,	        	
	        	channel: channel,
	        	captiveSecondaryLandingPageFlag: captiveSecondaryLandingPageFlag,
	        	categoryName: categoryName,
	        	editFOFormCategoryFlag: editFOFormCategoryFlag,
	        	contentDisplayName:contentDisplayNameFOFormsId,
	        	editFOFormHeadingFlag:editFOFormHeadingFlag,
	        	state:state,
	        	contentType:contentType,
	        	contentDescription: contentDescription,
	        	IsCaptive:IsCaptive
	        	
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response, textStatus, jqXHR){
	        	
	        	if(response!=null){
	        		if(IsCaptive=='NO'){
	        			displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal);
	        		} else {
	        			displaySLPCaptive(response, secondLevelContentsId, cfID, categoryName, foFormContentId, secPageFlag, secLandingDDId );
	        		}	        		
	        		}		    		           
			    },
	        error: function(jqXHR, textStatus, errorThrown){	        	
	        },
	        complete: function(){
	        	$("#editContentBubble").modal('hide');
	        	$("#editContentBubbleForFOForms").modal('hide');
	        	$("#IsSecondayLandingPage").val('NO');
	        	$.unblockUI();
	        }		
		});
	});
	
	
	$(document).on("click", "#editPrmPageId", function(){	
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();	
		var clsSecondayLandingPage=$(this).closest('tr').find('.clsSecondayLandingPage').val();
		var slPageName = $(this).closest('tr').find('.clsSLPageId').val();				
		$("#cfDetailsID").val(clsCFDetailsID);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#oldUrlID").val(clsUrlID);	
		//$("#secondayLandingPageID").val(clsSecondayLandingPage);
		$("#contentDisplayNameId").val(clsUrlDisplayNameID);
		$("#contentNamePathId").val(clsUrlID);
		$("#contentDisplayNamePrmPageId").val(clsSecondayLandingPage);
		$('#editContentTypeId').html(slPageName);
		
		var clsCompanyCd = $(this).closest('tr').find('.clsCompanyCd').val();		
		var state = $("#contentUploadStateId").val();
		var channel= $("#contentUploadChannelId").val();	
		
		if(state =='CT' || state=='MA'){
			$('#OpCompIdEditPLPHeader').removeClass('hidden');
			$('#OpCompNJIdEditPLPHeader').addClass('hidden');
			$('#operatingCompanyIdEdit1PLPHeader').html("");
			$('#OpCompPAIdEditPLPHeader').addClass('hidden');
			
			var operatingCompany = $('#operatingCompanyIdEdit1PLPHeader');
			var opCompData = $('#opCompMapId').val();		
			operatingCompany.append('<option>-Select-');
			$.each($.parseJSON(opCompData), function(val, text) {
				operatingCompany.append('<option id="operatingCompanyIdEdit1" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			});			
			$('#operatingCompanyIdEdit1PLPHeader').val(clsCompanyCd).trigger('chosen:updated');
			operatingCompany.append('</option>');
		
		} else if(state =='NJ'){			
			$('#OpCompIdEditPLPHeader').addClass('hidden');
			$('#OpCompNJIdEditPLPHeader').removeClass('hidden');
			$('#OpCompPAIdEditPLPHeader').addClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyNJIdEdit1PLPHeader').html('High Point');
			} else if(channel =='Teachers'){
				$('#operatingCompanyNJIdEdit1PLPHeader').html('Palisades');
			}
		}
		else if(state =='PA'){			
			$('#OpCompIdEditPLPHeader').addClass('hidden');
			$('#OpCompNJIdEditPLPHeader').addClass('hidden');
			$('#OpCompPAIdEditPLPHeader').removeClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyPAIdEdit1PLPHeader').html('High Point');
			} else if(channel =='Teachers'){
				$('#operatingCompanyPAIdEdit1PLPHeader').html('Palisades');
			}
		}
		$("#editPLPHeader").modal('show');
	});	
	
	$(document).on("click", "#savePLPHeader", function(){
		$('#firstLevelContents').html('');
		$('#secLandingDDId').html("");
		var cfDetailsId = $("#cfDetailsID").val();
		var contentDisplayNamePrmPage = $("#contentDisplayNamePrmPageId").val();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    //$('#firstLevelContents').empty('');
	   
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/updateContentFilterPrmPage',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentDisplayName:  contentDisplayNamePrmPage,	        	
	        	contentFiltersId:  cfDetailsId,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	    		if(response!=null){	    			
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){		    	
		    $('#contentUploads').removeClass('hidden');	
		    $("#editPLPHeader").modal('hide');
			$.unblockUI();
        }
	    });
	});
	
	$(document).on("click", "#editCFLinks", function(){	
		var clsSLPageId=$(this).closest('tr').find('.clsSLPageId').val();
		$("#contentTypeEditId").html(clsSLPageId);
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();
		var urlToDisplay=$(this).closest('tr').find('.clsUrlToDisplay').val();
		$("#cfDetailsID").val(clsCFDetailsID);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#oldUrlID").val(clsUrlID);				
		$("#pfContentDisplayNameId").val(clsUrlDisplayNameID);
		$("#pfContentNamePathId").val(urlToDisplay);
		var clsCompanyCd = $(this).closest('tr').find('.clsCompanyCd').val();
		//make it empty
		$('#op_comp_def').val('');
		
		var state = $("#contentUploadStateId").val();
		var channel= $("#contentUploadChannelId").val();	
		if(state =='CT' || state=='MA'){
			$('#OpCompIdEdit').removeClass('hidden');
			$('#OpCompNJIdEdit').addClass('hidden');
			$('#OpCompPAIdEdit').addClass('hidden');
			$('#operatingCompanyIdEdit').html("");
			var operatingCompany = $('#operatingCompanyIdEdit');
			var opCompData = $('#opCompMapId').val();		
			operatingCompany.append('<option>-Select-');
			$.each($.parseJSON(opCompData), function(val, text) {
				operatingCompany.append('<option id="operatingCompanyIdEdit" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			});			
			$('#operatingCompanyIdEdit').val(clsCompanyCd).trigger('chosen:updated');
			operatingCompany.append('</option>');
		} else if(state =='NJ'){			
			$('#OpCompIdEdit').addClass('hidden');
			$('#OpCompNJIdEdit').removeClass('hidden');
			$('#OpCompPAIdEdit').addClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyNJIdEdit').html('High Point');
				$('#op_comp_def').val('HP');
			} else if(channel =='Teachers'){
				$('#operatingCompanyNJIdEdit').html('Palisades');
				$('#op_comp_def').val('IA');
			}
		} else if(state =='NH'){
			$('#OpCompIdEdit').addClass('hidden');
			$('#OpCompNHIdEdit').removeClass('hidden');
			$('#OpCompNJIdEdit').addClass('hidden');
			$('#OpCompPAIdEdit').addClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyNHIdEdit').html('Mt. Washington');
			}
		
		}	else if(state =='PA'){
			$('#OpCompIdEdit').addClass('hidden');
			$('#OpCompNJIdEdit').addClass('hidden');
			$('#OpCompNHIdEdit').addClass('hidden');
			$('#OpCompPAIdEdit').removeClass('hidden');
			
			if(channel =='Teachers'){
				$('#operatingCompanyPAIdEdit').html('Palisades');
				$('#op_comp_def').val('IA');
			}
			if(channel =='Captive'){
				$('#operatingCompanyPAIdEdit').html('High Point');
				$('#op_comp_def').val('HP');
			}
		}
				
				
		$("#editContentBubbleBody #inValidErrorModalText").text('');
		$("#editContentBubbleForPLFiltersLink").modal('show');
	});
	
	
	$(document).on("click", "#saveContentFiltersLink", function(){
		resetErrorMessagePLPage();
		var cfDetailsId = $("#cfDetailsID").val();		
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    
	    var oldUrlDisplayName = $("#oldUrlDisplayNameID").val();
		var oldUrl = $("#oldUrlID").val();		
		var newUrlDisplayName= $("#pfContentDisplayNameId").val();
		var newUrl = $("#pfContentNamePathId").val();
		var companyCD = $("#operatingCompanyIdEdit").val();
		// we are not setting operatingCompanyIdEdit for NJ/PA ..make this chnage so with default or single selections 
		// we copy over the default company
		if(!isValidValue(companyCD)){
			companyCD = $('#op_comp_def').val();
		}
		
		var saveContentFiltersLinkFlag = false;
		if( $("#contentTypeEditId").text() =='URL'){
			if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(newUrl)){
				//move forward		
			} else {			    				
				$("#editContentBubbleTable #pfContentNamePathId").css('border-color','red');
				$("#editContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'>" +
						"<td class='fieldLabel'></td><td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> e.g. http://www.example.org</td></tr>");
				//return;
				saveContentFiltersLinkFlag = true;
			}
		}
		
		if(newUrlDisplayName.length == 0){			
			$("#editContentBubbleTable #pfContentDisplayNameId").css('border-color','red');
			$("#editContentBubbleTable #contentLevelTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
			//return ;
			saveContentFiltersLinkFlag = true;
		}
		
		
		if($("#contentTypeEditId").text() =='Mailto'){
			var email1 = "Mailto:";
			var email2 = newUrl.replace(email1,"");			
			var emailValid = isEmailValid(email2);
			if(emailValid == false){				
				$("#editContentBubbleTable #pfContentNamePathId").css('border-color','red');
				$("#editContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'>" +
						"<td class='fieldLabel'></td><td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				//return;
				saveContentFiltersLinkFlag = true;
			}
		}
		
		if(saveContentFiltersLinkFlag == true){
			return;
		}
		
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
				
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		
		$('#firstLevelContents').html('');
		$('#secLandingDDId').html("");
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/updateContentFiltersLink',
	        type: 'POST',
	        data: JSON.stringify({	        	
	        	newDisplayName:  newUrlDisplayName,
	        	newUrlPath:  newUrl,
	        	oldDisplayName:  oldUrlDisplayName,  
	        	oldUrlPath:  oldUrl,
	        	id:  cfDetailsId,	        	
	        	channel: channel,	        	
	        	state:state,
	        	contentType:contentType,
	        	companyCD:companyCD
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	    		if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){		    	
		    $('#contentUploads').removeClass('hidden');	
		    $("#editContentBubbleForPLFiltersLink").modal('hide');
		    $.unblockUI();
        }
	    });
	});
	
	
	$(document).on("click", "#editPLPageHeaderId", function(){
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();		
		var plPage=$(this).closest('tr').find('.clsGrpHeadingContent').val();
		$("#plPageOld").val(plPage);
		$("#contentDisplayNamePLPageId").val(plPage);
		$("#cfDetailsID").val(clsCFDetailsID);
		$('#editContentTypePLPageId').html('Header');
		var clsCompanyCd = $(this).closest('tr').find('.clsCompanyCd').val();
		var state = $("#contentUploadStateId").val();
		var channel= $("#contentUploadChannelId").val();	
		$('#op_comp_def').val('');
		
		if(state =='CT' || state=='MA'){
			$('#OpCompIdEditH').removeClass('hidden');
			$('#OpCompNJIdEditH').addClass('hidden');
			$('#OpCompNHIdEditH').addClass('hidden');
			$('#operatingCompanyIdEditH').html("");
			var operatingCompany = $('#operatingCompanyIdEditH');
			var opCompData = $('#opCompMapForHeaderId').val();		
			operatingCompany.append('<option>-Select-');
			$.each($.parseJSON(opCompData), function(val, text) {
				operatingCompany.append('<option id="operatingCompanyIdEditH" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			});			
			$('#operatingCompanyIdEditH').val(clsCompanyCd).trigger('chosen:updated');
			operatingCompany.append('</option>');
		} else if(state =='NJ'){			
			$('#OpCompIdEditH').addClass('hidden');
			$('#OpCompNHIdEditH').addClass('hidden');
			$('#OpCompNJIdEditH').removeClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyNJIdEditH').html('High Point');
				$('#op_comp_def').val('HP');
			} else if(channel =='Teachers'){
				$('#operatingCompanyNJIdEditH').html('Palisades');
				$('#op_comp_def').val('IA');
			}
		} else if(state =='NH'){
			$('#OpCompIdEditH').addClass('hidden');
			$('#OpCompNHIdEditH').removeClass('hidden');
			$('#OpCompNJIdEditH').addClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyNHIdEditH').html('Mt. Washington');
			}
		}
		
		else if(state =='PA'){
			$('#OpCompIdEditH').addClass('hidden');
			$('#OpCompNHIdEditH').addClass('hidden');
			$('#OpCompNJIdEditH').addClass('hidden');
			$('#OpCompPAIdEditH').removeClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyPAIdEditH').html('Palisades');
				$('#op_comp_def').val('IA');
			}
			if(channel =='Captive'){
				$('#operatingCompanyPAIdEditH').html('High Point');
				$('#op_comp_def').val('HP');
			}
		}
		
		$("#editPLPageHeader").modal('show');
	});	
	
	$(document).on("click", "#savePLPageHeader", function(){	
		$('#firstLevelContents').html('');
		$('#secLandingDDId').html("");
		var cfDetailsId = $("#cfDetailsID").val();
		var plPageOld = $("#plPageOld").val();		
		var plPage = $("#contentDisplayNamePLPageId").val();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var companyCD = $("#operatingCompanyIdEditH").val();
	    $('#primaryContentResultId').removeClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		
		if(!isValidValue(companyCD)){
			companyCD = $('#op_comp_def').val();
		}
		
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/updateContentFilterPLPage',
	        type: 'POST',
	        data: JSON.stringify({
	        	plPage:  plPage,	        	
	        	id:  cfDetailsId,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	plPageOld:plPageOld,
	        	companyCD:companyCD
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	    		if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){		    	
		    $('#contentUploads').removeClass('hidden');	
		    $("#editPLPageHeader").modal('hide');
		    $.unblockUI();
        }
	    });
	});
	$('#operatingCompanyId').on('change', function(){
		$("#addContentBubblePrmBody #inValidErrorModalText").text('');
	});
	
	$('#addContentTypePrmPageId').on('change', function(){
		resetErrorMessagePLPage();
		var addContentTypePrmPageId =$("#addContentTypePrmPageId").val();
		var state = $("#contentUploadStateId").val();	
		var channel= $("#contentUploadChannelId").val();
		if(addContentTypePrmPageId =='Header'){
			$('#contentPathPrmId').addClass('hidden');
			if(state =='CT' || state=='MA'){
				$('#OpCompId').removeClass('hidden');
				$('#OpCompNJId').addClass('hidden');
				$('#operatingCompanyId').html("");						
				var operatingCompany = $('#operatingCompanyId');
				var opCompData = $('#opCompMapForHeaderId').val();		
				operatingCompany.append('<option>-Select-');
				$.each($.parseJSON(opCompData), function(val, text) {
					operatingCompany.append('<option id="operatingCompanyId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
				});
				operatingCompany.append('</option>');
			}
		} else {
			$('#contentPathPrmId').removeClass('hidden');
			if(state =='CT' || state=='MA'){
				$('#OpCompId').removeClass('hidden');
				$('#OpCompNJId').addClass('hidden');
				$('#operatingCompanyId').html("");						
				var operatingCompany = $('#operatingCompanyId');
				var opCompData = $('#opCompMapId').val();		
				operatingCompany.append('<option>-Select-');
				$.each($.parseJSON(opCompData), function(val, text) {
					operatingCompany.append('<option id="operatingCompanyId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
				});
				operatingCompany.append('</option>');
			} else if(state =='NJ'){			
				$('#OpCompId').addClass('hidden');
				$('#OpCompNJId').removeClass('hidden');
				if(channel =='Captive'){
					$('#operatingCompanyNJId').html('High Point');
				} else if(channel =='Teachers'){
					$('#operatingCompanyNJId').html('Palisades');
				}
			}
		}		
	});
	
	$('#operatingCompanyIdFirst').on('change', function(){
		$("#addContentBubblePrmBodyFirst #inValidErrorModalTextFirst").text('');
	});
	
	$('#addContentTypePrmPageIdFirst').on('change', function(){
		var addContentTypePrmPageId =$("#addContentTypePrmPageIdFirst").val();
		var state = $("#contentUploadStateId").val();		
		if(addContentTypePrmPageId =='Header'){			
			$('#contentPathPrmIdFirst').addClass('hidden');
			if(state =='CT' || state=='MA'){
				$('#OpCompId').removeClass('hidden');
				$('#OpCompNJId').addClass('hidden');
				$('#operatingCompanyIdFirst').html("");						
				var operatingCompany = $('#operatingCompanyIdFirst');
				var opCompData = $('#opCompMapForHeaderId').val();		
				operatingCompany.append('<option>-Select-');
				$.each($.parseJSON(opCompData), function(val, text) {
					operatingCompany.append('<option id="operatingCompanyIdFirst" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
				});
				operatingCompany.append('</option>');
			}
		} else {
			$('#contentPathPrmIdFirst').removeClass('hidden');
			if(state =='CT' || state=='MA'){
				$('#OpCompId').removeClass('hidden');
				$('#OpCompNJId').addClass('hidden');
				$('#operatingCompanyIdFirst').html("");						
				var operatingCompany = $('#operatingCompanyIdFirst');
				var opCompData = $('#opCompMapId').val();		
				operatingCompany.append('<option>-Select-');
				$.each($.parseJSON(opCompData), function(val, text) {
					operatingCompany.append('<option id="operatingCompanyIdFirst" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
				});
				operatingCompany.append('</option>');
			} else if(state =='NJ'){			
				$('#OpCompId').addClass('hidden');
				$('#OpCompNJId').removeClass('hidden');
				if(channel =='Captive'){
					$('#operatingCompanyNJIdFirst').html('High Point');
				} else if(channel =='Teachers'){
					$('#operatingCompanyNJIdFirst').html('Palisades');
				}
			}
		}		
	});
	
	var contentLabelFlagPLPage=0; 
	$("#addContentBubblePrmTable #addContentLabelPrmPageId").on("input", function() {
		contentLabelFlagPLPage = contentLabelFlagPLPage+1; 
		if(contentLabelFlagPLPage == 1){
			resetErrorMessagePLPage();
		}
	});
	
	var contentPathFlagPLPage=0; 
	$("#addContentPathPrmPageId").on("input", function() {
		contentPathFlagPLPage = contentPathFlagPLPage+1; 
		if(contentPathFlagPLPage == 1){
			resetErrorMessagePLPage();
		}
	});
	
	$(document).on("click", "#addPrmPageId", function(){
		resetErrorMessagePLPage();
		$('#contentPathPrmId').removeClass('hidden');
		var state = $("#contentUploadStateId").val();
		var channel= $("#contentUploadChannelId").val();
		$('#op_comp_def').val('');
		
		if(state =='CT' || state=='MA'){
			$('#OpCompId').removeClass('hidden');
			$('#OpCompNJId').addClass('hidden');
			$('#OpCompNHId').addClass('hidden');
			$('#operatingCompanyId').html("");						
			var operatingCompany = $('#operatingCompanyId');
			var opCompData = $('#opCompMapId').val();		
			operatingCompany.append('<option>-Select-');
			$.each($.parseJSON(opCompData), function(val, text) {
				operatingCompany.append('<option id="operatingCompanyId" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			});
			operatingCompany.append('</option>');
		} else if(state =='NJ'){			
			$('#OpCompId').addClass('hidden');
			$('#OpCompNJId').removeClass('hidden');
			$('#OpCompNHId').addClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyNJId').html('High Point');
				$('#op_comp_def').val('HP');
			} else if(channel =='Teachers'){
				$('#operatingCompanyNJId').html('Palisades');
				$('#op_comp_def').val('IA');
			}
		} else if(state =='NH'){			
			$('#OpCompId').addClass('hidden');
			$('#OpCompNJId').addClass('hidden');
			$('#OpCompNHId').removeClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyNHId').html('Mt. Washington');
			}
		}
		else if(state =='PA'){			
			$('#OpCompId').addClass('hidden');
			$('#OpCompNJId').addClass('hidden');
			$('#OpCompNHId').addClass('hidden');
			
			$('#OpCompPAId').removeClass('hidden');
			
			if(channel =='Teachers'){
				$('#operatingCompanyPAId').html('Palisades');
				$('#op_comp_def').val('IA');
			}else if(channel =='Captive'){
				$('#operatingCompanyPAId').html('High Point');
				$('#op_comp_def').val('HP');
			}
		}
		resetPrimaryLandingPageDataAdd();
		
		if($("#secLandingDDId").val() =='-Select-'){
			$("#addContentLabelId").attr('maxlength', '88');			
		} else {
			$("#addContentLabelId").attr('maxlength', '98');
		}
		
		$("#cfID").val($(this).closest('tr').find('.clsContentFiltersID').val());
		$("#primaryLandingPage").val($(this).closest('tr').find('.clsPrimaryLandingPage').val());
		$("#secondayLandingPage").val($(this).closest('tr').find('.clsSecondayLandingPage').val());
		
		$("#companyCd").val($(this).closest('tr').find('.clsCompanyCd').val());
		$("#department").val($(this).closest('tr').find('.clsDepartment').val());
		$("#channelCd").val($(this).closest('tr').find('.clsChannelCd').val());
		$("#displayOrder").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#addContentBubblePrmBody #inValidErrorModalText").text('');		
		$("#addContentPLPage").modal('show');
	});	
	
	$(document).on("click", "#savePrmPage", function(){	
		resetErrorMessagePLPage();
		var cfID = $("#cfID").val();
		var clsPrimaryLandingPage = $("#primaryLandingPage").val();
		var clsSecondayLandingPage = $("#secondayLandingPage").val();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();	    
	    //var companyCd = $("#companyCd").val();
	    var department= $("#department").val();
	    var companyCd = $("#operatingCompanyId").val();
	    var url = $("#addContentPathPrmPageId").val();
		var urlDisplayName= $("#addContentLabelPrmPageId").val();
		//var description = $("#addDescriptionPrmPageId").val();
		var categoryName =$("#categoryNameHiddenID").val();
		var addContentTypePrmPageId =$("#addContentTypePrmPageId").val();
		var displayOrder =$("#displayOrder").val();
		// company code getting empty on save
		if(!isValidValue(companyCd)){
			companyCd = $('#op_comp_def').val();
		}
		
		if(!isValidValue(companyCd)){
			companyCd = $('#op_comp_def').val();
		}
				
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		var errorFlag = false;
		if(addContentTypePrmPageId=='select'){
			$("#addContentBubblePrmTable #addContentTypePrmPageId").css('border-color','red').trigger('chosen:updated');			
			$("#addContentBubblePrmTable #contentTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Type is required.</td></tr>");
			//return ;
			errorFlag= true;
		} 
		if(urlDisplayName.length == 0){			
			$("#addContentBubblePrmTable #addContentLabelPrmPageId").css('border-color','red');
			$("#addContentBubblePrmTable #contentLabelTypePrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
			errorFlag= true;
		}
		
		if(url.length == 0){
			if(addContentTypePrmPageId =='URL'){				
				$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> " +
						"e.g. http://www.example.org</td></tr>");
				errorFlag= true;
			}
		} else if(addContentTypePrmPageId =='URL'){
			if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)){
				//move forward		
			} else {			    				
				$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
						"e.g. http://www.example.org</td></tr>");
				errorFlag= true;
			}
		}
		
		if(addContentTypePrmPageId=='select' && url.length == 0){
			$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required.</td></tr>");
				errorFlag= true;
		} 
		
		if(url.length == 0){			
			if(addContentTypePrmPageId =='UploadedDocument'){
				$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>" +
						"Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");				
				errorFlag= true;
			}
		}
		
		if(url.length == 0){
			if(addContentTypePrmPageId =='Mailto'){
				$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> " +
						"e.g. Mailto:email@prac.com</td></tr>");
				errorFlag= true;
			}
		} else if(addContentTypePrmPageId =='Mailto'){
			var email1 = "Mailto:";
			var email2 = url.replace(email1,"");
			var emailValid = isEmailValid(email2);
			if(emailValid == false){				
				$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				errorFlag= true;
			}
		}
		
		if($("#contentUploadStateId").val() !='NJ' && companyCd =='-Select-'){
			$("#addContentBubblePrmTable #operatingCompanyId").css('border-color','red');
			$("#addContentBubblePrmTable #OpCompId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td><td class='validation' " +
					"style='color:red;margin-bottom: 20px;'>Please select an Operating Company.</td></tr>");
			errorFlag= true;
		}
		
		if(errorFlag == true){
			return;
		}
		$('#savePrmPage').attr('disabled',true);
		$('#firstLevelContents').html('');
		$('#secLandingDDId').html("");
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/addContentFilters',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentDisplayName:  clsSecondayLandingPage,	        	
	        	contentFiltersId:  cfID,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	primaryLandingPage: clsPrimaryLandingPage,
	        	companyCd:companyCd,
	        	department: department,
	        	url: url,
	        	urlDisplayName: urlDisplayName,
	        	//description: description,
	        	addContentTypePrmPage: addContentTypePrmPageId,
	        	displayOrder : displayOrder
	        	
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	        	$("#addContentPLPage").modal('hide');
	    		if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){
			$('#savePrmPage').attr('disabled',false);
	    	$('#primaryContentResultId').removeClass('hidden');
	   		$('#secondaryContentResultId').addClass('hidden');
		    $('#contentUploads').removeClass('hidden');
		    $.unblockUI();
        	}
		});
	});
	
	//this is for adding totally new content where there is currently empty content
	$(document).on("click", "#addFirstPage", function(){
		resetErrorMessagePLPage();
		$('#contentPathPrmIdFirst').removeClass('hidden');
		var state = $("#contentUploadStateId").val();
		var channel= $("#contentUploadChannelId").val();
		if(state =='CT' || state=='MA'){
			$('#OpCompId').removeClass('hidden');
			$('#OpCompNJId').addClass('hidden');
			$('#OpCompNHId').addClass('hidden');
			$('#operatingCompanyId').html("");						
			var operatingCompany = $('#operatingCompanyIdFirst');
			var opCompData = $('#opCompMapId').val();		
			operatingCompany.append('<option>-Select-');
			$.each($.parseJSON(opCompData), function(val, text) {
				operatingCompany.append('<option id="operatingCompanyIdFirst" value='+val+'>'+text+'</option>').prop('disabled',false).trigger('chosen:updated');
			});
			operatingCompany.append('</option>');
		} else if(state =='NJ'){			
			$('#OpCompId').addClass('hidden');
			$('#OpCompNHId').addClass('hidden');
			$('#OpCompNJId').removeClass('hidden');
			if(channel =='Captive'){
				$('#operatingCompanyNJIdFirst').html('High Point');
			} else if(channel =='Teachers'){
				$('#operatingCompanyNJIdFirst').html('Palisades');
			}
		} else if(state =='NH'){			
			$('.clsOpCompId').addClass('hidden');			
			$('.clsOpCompNHId').removeClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyNHIdFirst').html('Mt. Washington');
			}			
		}
		else if(state =='PA'){			
			$('.clsOpCompId').addClass('hidden');			
			$('.clsOpCompNHId').addClass('hidden');
			$('.clsOpCompPAId').removeClass('hidden');
			if(channel =='Teachers'){
				$('#operatingCompanyPAIdFirst').html('Palisades');
			}			
		}
		resetPrimaryLandingPageDataAddFirst();
		
		if($("#secLandingDDId").val() =='-Select-'){
			$("#addContentLabelId").attr('maxlength', '88');			
		} else {
			$("#addContentLabelId").attr('maxlength', '98');
		}
		
		$("#companyCd").val($(this).closest('tr').find('.clsCompanyCd').val());
		$("#department").val($(this).closest('tr').find('.clsDepartment').val());
		$("#channelCd").val($(this).closest('tr').find('.clsChannelCd').val());
		$("#displayOrder").val(1);
		$("#addContentBubblePrmBody #inValidErrorModalText").text('');		
		$("#addContentPLPageFirst").modal('show');
	});	
	
	
	$(document).on("click", "#savePrmPageFirst", function(){
		resetErrorMessagePLPage();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	   // var department= $("#department").val();
	    var companyCdFirst = $("#operatingCompanyIdFirst").val();
	    var urlFirst = $("#addContentPathPrmPageIdFirst").val();
		var urlDisplayNameFirst= $("#addContentLabelPrmPageIdFirst").val();		
		var addContentTypePrmPageIdFirst =$("#addContentTypePrmPageIdFirst").val();
		
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		var savePrmPageFirstFlag = false;
		if(addContentTypePrmPageIdFirst=='select'){
			$("#addContentBubblePrmTable #addContentTypePrmPageIdFirst").css('border-color','red');
			$("#addContentBubblePrmTable #contentTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
			"</td><td class='validation' style='color:red;margin-bottom: 20px;'>Content Type is required.</td></tr>");
			//return ;
			savePrmPageFirstFlag = true;
		}
		if(urlDisplayNameFirst.length == 0){			
			$("#addContentBubblePrmTable #addContentLabelPrmPageIdFirst").css('border-color','red');
			$("#addContentBubblePrmTable #contentLabelTypePrmId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
			"</td><td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
			//return ;
			savePrmPageFirstFlag = true;
		}
		
		if(urlFirst.length == 0){
				if(addContentTypePrmPageIdFirst == 'URL'){
					$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
					$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
					"</td><td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
					" e.g. http://www.example.org</td></tr>");
					savePrmPageFirstFlag = true;
				} 
			} else if(addContentTypePrmPageIdFirst =='URL'){
				if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)){
					//move forward		
				} else {			    				
					$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
					$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
					"</td><td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br />" +
					" e.g. http://www.example.org</td></tr>");
					savePrmPageFirstFlag= true;
				}
			}			
		
		if(addContentTypePrmPageIdFirst=='select' && urlFirst.length == 0){
			$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
			$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required.</td></tr>");
			savePrmPageFirstFlag= true;
		} 
		
		if(urlFirst.length == 0){
			if(addContentTypePrmPageIdFirst =='UploadedDocument'){
				$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
				"</td><td class='validation' style='color:red;margin-bottom: 20px;'>Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");
				savePrmPageFirstFlag = true;
			} 
		}
		
		if(urlFirst.length == 0){
			if(addContentTypePrmPageIdFirst =='Mailto'){
				$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
				"</td><td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				savePrmPageFirstFlag = true;
			}
		} else if(addContentTypePrmPageIdFirst =='Mailto'){
			var email1 = "Mailto:";
			var email2 = url.replace(email1,"");
			var emailValid = isEmailValid(email2);
			if(emailValid == false){				
				$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color','red');
				$("#addContentBubblePrmTable #contentPathPrmIdFirst").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'>" +
				"</td><td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				savePrmPageFirstFlag = true;
			}
		}		
		
		if($("#contentUploadStateId").val() !='NJ' && companyCdFirst =='-Select-'){
			$("#addContentBubblePrmTable #operatingCompanyIdFirst").css('border-color','red');
			$("#addContentBubblePrmTable #OpCompId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td><td class='validation' style='color:red;margin-bottom: 20px;'>Please select an Operating Company.</td></tr>");
			savePrmPageFirstFlag = true;
		}
		
		if(savePrmPageFirstFlag == true){
			return;
		}
		
		$('#firstLevelContents').html('');
		$('#secLandingDDId').html("");
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/addContentFiltersFirst',
	        type: 'POST',
	        data: JSON.stringify({	        	
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	companyCd:companyCdFirst,
	        	//department: department,
	        	url: urlFirst,
	        	urlDisplayName: urlDisplayNameFirst,	        	
	        	addContentTypePrmPage: addContentTypePrmPageIdFirst
	        	
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	        	$("#addContentPLPageFirst").modal('hide');
	    		if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){
	    	$('#primaryContentResultId').removeClass('hidden');
	   		$('#secondaryContentResultId').addClass('hidden');
		    $('#contentUploads').removeClass('hidden');
		    $.unblockUI();
        	}
		});
	});
	
	//$('#categoryEditId').live("click", function(){
	$(document).on("click", "#categoryEditIdNonCaptive", function(){
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();	
		var clsSecondayLandingPage=$(this).closest('tr').find('.clsSecondayLandingPage').val();
		var slPageName = $(this).closest('tr').find('.clsSLPageId').val();
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();
		var IsCaptive = $(this).closest('tr').find('.clsIsCaptive').val();
		$("#IsCaptive").val(IsCaptive);
		$("#cfDetailsID").val(clsCFDetailsID);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#oldUrlID").val(clsUrlID);
		$("#editFOFormCategoryFlag").val("YES");
		$("#editFOFormHeadingFlag").val("NO");
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#contentDisplayNameId").val(clsUrlDisplayNameID);		
		$("#contentDisplayNameFOFormsId").val(slPageName);
		if(clsIsFOForm =='NO'){
			$('#editContentTypeFOFormsId').html("Secondary Landing Page");
		} else {
			$('#editContentTypeFOFormsId').html("Category");
		}
		$("#HeaderOrNotFlag").val("YES");
		$("#editContentBubbleForFOForms").modal('show');
	});
	
	
	$(document).on("click", "#categoryEditIdCaptive", function(){
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();	
		var clsSecondayLandingPage=$(this).closest('tr').find('.clsSecondayLandingPage').val();
		var slPageName = $(this).closest('tr').find('.clsSLPageId').val();
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();	
		var cfId = $(this).closest('tr').find('.clsCFId').val();
		
		var editOpComp =  $(this).closest('tr').find('.clsCompanyCD').val();
		
		$("#cfID").val(cfId);
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		
		$("#cfDetailsID").val(clsCFDetailsID);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#oldUrlID").val(clsUrlID);
		$("#editFOFormCategoryFlag").val("YES");
		$("#editFOFormHeadingFlag").val("NO");
		//$('#captiveSecondaryLandingPageFlag').val('YES');
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#contentDisplayNameId").val(clsUrlDisplayNameID);		
		$("#contentDisplayNameFOFormsId").val(slPageName);
		
		$('#editOperatingCompId').html(editOpComp);
		
		if(clsIsFOForm =='NO'){
			$('#editContentTypeFOFormsId').html("Secondary Landing Page");
		} else {
			$('#editContentTypeFOFormsId').html("Category");
		}
		$("#HeaderOrNotFlag").val("YES");
		$("#editContentBubbleForFOForms").modal('show');
	});
	
	$(document).on("click", "#headingEditId", function(){
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();	
		var clsSecondayLandingPage=$(this).closest('tr').find('.clsSecondayLandingPage').val();
		var slPageName = $(this).closest('tr').find('.clsSLPageId').val();
		var clsSecLandingDDId = $(this).closest('tr').find('.clsSecLandingDDId').val();
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();
		
		var IsCaptive = $(this).closest('tr').find('.clsIsCaptive').val();
		$("#IsCaptive").val(IsCaptive);

		var cfId = $(this).closest('tr').find('.clsSecLandingDDId').val();
		$("#cfID").val(cfId);
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsSLPageId').val());
		$("#cfDetailsID").val(clsSecLandingDDId);
		$("#oldUrlDisplayNameID").val(clsUrlDisplayNameID);
		$("#oldUrlID").val(clsUrlID);
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#editFOFormCategoryFlag").val("YES");
		$("#editFOFormHeadingFlag").val("YES");
		$("#contentDisplayNameId").val(clsUrlDisplayNameID);		
		$("#contentDisplayNameFOFormsId").val(slPageName);
		$("#IsSecondayLandingPage").val("YES");
		$('#editContentTypeFOFormsId').html("Secondary Landing Page");
		var clsOpCompaneName=$(this).closest('tr').find('.clsCompanyCD').val();
		if(clsOpCompaneName =='PR'){
			$('#editOperatingCompId').html('Plymouth Rock');
		} else if(clsOpCompaneName =='PG'){
			$('#editOperatingCompId').html('Pilgrim');
		} else if(clsOpCompaneName =='HP'){
			$('#editOperatingCompId').html('High Point');
		} else if(clsOpCompaneName =='IA'){
			$('#editOperatingCompId').html('Palisades');
		} else if(clsOpCompaneName =='MW'){
			$('#editOperatingCompId').html('Mt. Washington');
		}else if(clsOpCompaneName =='BK'){
			$('#editOperatingCompId').html('Bunker Hill');
		}
		$("#editContentBubbleForFOForms").modal('show');
	});
	
	
	$(document).on("click", "#addId", function(){		
	//$('#addSLPNonCaptiveId').live("click", function(){
		resetSecondaryLandingPageDataAdd();
		if($("#contentTypeId").val() == 'resources' && $("#contentUploadStateId").val()=='NJ' && $("#contentUploadChannelId").val() =='Captive'
			&& $("#secLandingDDId").val() =='-Select-'){			
			$("#contentDescriptionId").show();
			$("#contentDescriptionId").attr('maxlength', '226');
		} else {			
			$("#contentDescriptionId").hide();
		}

		if($("#secLandingDDId").val() =='-Select-'){//this is field office forms
			$("#addContentLabelId").attr('maxlength', '88');			
		} else {
			$("#addContentLabelId").attr('maxlength', '98');
		}
		
		$("#contentFiltersHiddenID").val($(this).closest('tr').find('.clsContentFiltersID').val());
		$("#displayOrderHiddenID").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#addContentBubbleBody #inValidErrorModalText").text('');		
		$("#addContentBubbleSecPage").modal('show');		
	});
		
	$(document).on("click", "#addSLPCaptiveId", function(){	
		resetErrorMessagePLPage();
		resetSecondaryLandingPageDataAdd();		
		$('#submitAddContentBubbleSecPage').attr('disabled',false);
		var cfId = $(this).closest('tr').find('.clsCFId').val();
		$("#cfID").val(cfId);
		
		var catName = $(this).closest('tr').find('.clsCategoryName').val();
		var isCFFO = isCFFOForm(catName);
		if(isCFFO){
			$('#addContentBubbleTable #contentDescriptionId').show();
		}else{
			$('#addContentBubbleTable #contentDescriptionId').hide();
		}
		//console.log('addSLPCaptiveId cfId = '+cfId+' catName = '+catName +' isCFFO ='+isCFFO);
		/*if(cfId != 16){
			$('#addContentBubbleTable #contentDescriptionId').hide();
		} else if(cfId == 16){
			$('#addContentBubbleTable #contentDescriptionId').show();
		}*/
				
		$("#IsFOFormFlag").val($(this).closest('tr').find('.clsIsFOForm').val());
		$("#contentFiltersHiddenID").val($(this).closest('tr').find('.clsContentFiltersID').val());
		$("#displayOrderHiddenID").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#addContentBubbleBody #inValidErrorModalText").text('');	
		$("#contentPathId").show();
		//$("#contentDescriptionId").show();
		
		var clsOpCompaneName=$(this).closest('tr').find('.clsCompanyCD').val();
		if(clsOpCompaneName =='PR'){
			$('#addOperatingCompIdHP').html('Plymouth Rock');
		} else if(clsOpCompaneName =='PG'){
			$('#addOperatingCompIdHP').html('Pilgrim');
		} else if(clsOpCompaneName =='HP'){
			$('#addOperatingCompIdHP').html('High Point');
		} else if(clsOpCompaneName =='IA'){
			$('#addOperatingCompIdHP').html('Palisades');
		} else if(clsOpCompaneName =='MW'){
			$('#addOperatingCompIdHP').html('Mt. Washington');
		}
		else if(clsOpCompaneName =='BK'){
			$('#addOperatingCompIdHP').html('Bunker Hill');
		}
		
		$("#addContentBubbleSecPage").modal('show');		
	});
	
	
	$(document).on("click", "#submitAddContentBubbleSecPage", function(){
		resetErrorMessagePLPage();
		var contentType= $("#addContentTypeId").val();		
		if(contentType=='Header'){
			$("#addContentBubbleBody #contentPathId").hide();
			$("#contentDescriptionId").hide();
		} else{
			$("#addContentBubbleBody #contentPathId").show();
			$("#contentDescriptionId").show();
		}
		
		if($("#IsFOFormFlag").val()=='YES' && contentType !='Header'){
			$("#contentDescriptionId").show();
			$("#contentDescriptionId").attr('maxlength', '226');
			$("#addContentLabelId").attr('maxlength', '88');
		} else {			
			$("#contentDescriptionId").hide();
			$("#addContentLabelId").attr('maxlength', '98');
		}

		var contentFiltersID = $("#contentFiltersHiddenID").val();
		var displayOrder = $("#displayOrderHiddenID").val();		
		
		var url = $("#addContentPathId").val();
		var urlDisplayName= $("#addContentLabelId").val();
		var description = $("#addDescriptionId").val();
		var categoryName =$("#categoryNameHiddenID").val();
		var secondLevelContentsId;
		var secLandingDDId = $('#secLandingDDId').val();
		var cfID = $('#cfID').val();
		var submitAddContentBubbleSecPageFlag = false;
		
		//Add state/channel for secondary captive
		var state = $('#contentUploadStateId').val();
		var channel = $('#contentUploadChannelId').val();
		
		if(contentType=='select'){
			$("#addContentBubbleTable #addContentTypeId").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Type is required.</td></tr>");
			submitAddContentBubbleSecPageFlag = true;
		}
		if(urlDisplayName.length == 0){			
			$("#addContentBubbleTable #addContentLabelId").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentLabellTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
			submitAddContentBubbleSecPageFlag = true;
		}
		
		if(url.length == 0){
			if(contentType =='URL'){
				$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> e.g. http://www.example.org</td></tr>");
				submitAddContentBubbleSecPageFlag = true;
			} 
		}else if(contentType =='URL'){
			if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)){
				//move forward		
			} else {			    				
				$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> e.g. http://www.example.org</td></tr>");
				submitAddContentBubbleSecPageFlag = true;
			}
		}
		
		if(contentType=='select' && url.length == 0){
			$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required.</td></tr>");
			submitAddContentBubbleSecPageFlag = true;
		} 
		
		if(url.length == 0){
			if(contentType =='UploadedDocument'){
				$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");
				submitAddContentBubbleSecPageFlag = true;
			} 
		}
		
		if(url.length == 0){
			if(contentType =='Mailto'){
				$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				submitAddContentBubbleSecPageFlag = true;
			} 
		} else if(contentType =='Mailto'){
			var email1 = "Mailto:";
			var email2 = url.replace(email1,"");			
			var emailValid = isEmailValid(email2);
			if(emailValid == false){
				$("#addContentBubbleTable #addContentPathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");				
				submitAddContentBubbleSecPageFlag = true;
			}
		}

		if($("#contentTypeId").val() == 'resources' && ($("#contentUploadStateId").val()=='NJ' || $("#contentUploadStateId").val()=='PA') && $("#contentUploadChannelId").val() =='Captive'
			){
			if(contentType !='Header'){
				if(description.length == 0){
					$("#addContentBubbleTable #addDescriptionId").css('border-color','red').trigger('chosen:updated');
					$("#addContentBubbleTable #contentDescriptionId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
							"<td class='validation' style='color:red;margin-bottom: 20px;'>Description is required.</td></tr>");				
					submitAddContentBubbleSecPageFlag = true;
				}
			}
		}
		
		if(submitAddContentBubbleSecPageFlag == true){
			return;
		}
		
		var isCFFO = isCFFOForm(categoryName);
		if(isCFFO){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}else{
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}
		
		//console.log('submitAddContentBubbleSecPage isCFFO ='+isCFFO +'categoryName ='+categoryName);
		/*if($("#cfID").val() != 16){
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}else if( $("#cfID").val() == 16){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}*/
		
		var link;
		if(displayOrder!='null'){		
			link='/aiui/manageContent/addContentFilterDetails'; 
		} else if(displayOrder=='null'){
			link='/aiui/manageContent/addContentFilterDetailsFromChannel';
		}
	
		var department = $("#contentTypeId").val();
		
		// console.log('submitAddContentBubbleSecPage  state = '+state+' channel ='+channel+' url = '+link);
		//var secPageFlag=0;
		$('#submitAddContentBubbleSecPage').attr('disabled',true);		
		var secPageFlag=$("#secPageFlag").val();
		var foFormContentId;
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
				
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: link,
	        type: 'POST',
	        data: JSON.stringify({
	        	id:  contentFiltersID,
	        	displayOrder: displayOrder,
	        	contentType : contentType,
	        	newUrlPath:  url,
	        	newDisplayName:  urlDisplayName,
	        	description : description,
	        	secPage: categoryName,
	        	department : department,
	        	state: state,
	        	channel:channel
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        
	        success: function(response){
	        	$("#addContentBubbleSecPage").modal('hide');
	        	if(response!=null){	  
	        		displaySLPCaptive(response, secondLevelContentsId, $("#cfID").val(), categoryName, foFormContentId, secPageFlag, $('#secLandingDDId') );
	        	}
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	$("#addContentBubbleSecPage").modal('hide');
	        	$("#addContentBubbleBody #inValidErrorModalText").text('');
	        	//location.reload(true);
	        	resetAddContentPopUp();
	        	$.unblockUI();
	        }		
		});		
	});
	
	
	$(document).on("click", "#addSLPNonCaptiveId", function(){
		resetSLPAddNonCaptive();
		resetErrorMessagePLPage();
		if($("#secLandingDDId").val() =='-Select-'){
			$("#addContentLabelId").attr('maxlength', '88');			
		} else {
			$("#addContentLabelId").attr('maxlength', '98');
		}
		
		$("#contentFiltersHiddenID").val($(this).closest('tr').find('.clsContentFiltersID').val());
		$("#displayOrderHiddenID").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#addContentBubbleBody #inValidErrorModalText").text('');	
		
		var clsOpCompaneName=$(this).closest('tr').find('.clsCompanyCD').val();
		if(clsOpCompaneName =='PR'){
			$('#addOperatingCompId').html('Plymouth Rock');
		} else if(clsOpCompaneName =='PG'){
			$('#addOperatingCompId').html('Pilgrim');
		} else if(clsOpCompaneName =='HP'){
			$('#addOperatingCompId').html('High Point');
		} else if(clsOpCompaneName =='IA'){
			$('#addOperatingCompId').html('Palisades');
		} else if(clsOpCompaneName =='MW'){
			$('#addOperatingCompId').html('Mt. Washington');
		}
		else if(clsOpCompaneName =='BK'){
			$('#addOperatingCompId').html('Bunker Hill');
		}
		$('#addSLPNonCaptiveSave').attr('disabled',false);
		$("#addContentBubbleTable #contentPathId").show();
				
		$("#addSLPNonCaptivePage").modal('show');		
	});
	
	
	$(document).on("click", "#addSLPNonCaptiveSave", function(){
		resetErrorMessagePLPage();
		var contentFiltersID = $("#contentFiltersHiddenID").val();
		var displayOrder = $("#displayOrderHiddenID").val();
		var contentType= $("#contentTypeID").val();
		var contentType1= $("#contentTypeId").val();
		var url = $("#pathId").val();
		var urlDisplayName= $("#labelId").val();
		var categoryName =$("#categoryNameHiddenID").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
		//var secondLevelContentsId = $('#secondLevelContents');
		var secondLevelContentsId;
		var secLandingDDId = $('#secLandingDDId').val();
		//Keep the secondary page dd value
		var secLandingPageVal = $('#secLandingDDId').val();
		var cfID = $('#cfID').val();
		
		var addSLPNonCaptiveSaveFlag = false;
		
		if(contentType=='select'){
			$("#addContentBubbleTable #contentTypeID").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Type is required.</td></tr>");
			addSLPNonCaptiveSaveFlag = true;
		}
		if(urlDisplayName.length == 0){			
			$("#addContentBubbleTable #labelId").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentLabellTypeId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Content Label is required.</td></tr>");
			addSLPNonCaptiveSaveFlag = true;
		}
		
		if(url.length == 0){
			if(contentType =='URL'){
				$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> e.g. http://www.example.org</td></tr>");
				addSLPNonCaptiveSaveFlag = true;
			} 
		} else if( contentType =='URL'){
			if(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)){
				//move forward		
			} else {			    				
				$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>URL is required in valid format.<br /> e.g. http://www.example.org</td></tr>");
				addSLPNonCaptiveSaveFlag = true;
			}
		}
		
		if(contentType=='select' && url.length == 0){
			$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
			$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
					"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required.</td></tr>");
			addSLPNonCaptiveSaveFlag = true;
		} 

		if(url.length == 0){
			if(contentType =='UploadedDocument'){
				$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Path is required and can include alphanumeric and special characters : / . - _ only.</td></tr>");
				addSLPNonCaptiveSaveFlag = true;
			}
		}
		
		if(url.length == 0){
			if(contentType =='Mailto'){
				$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				addSLPNonCaptiveSaveFlag = true;
			}
		} else if(contentType =='Mailto'){
			var email1 = "Mailto:";
			var email2 = url.replace(email1,"");
			var emailValid = isEmailValid(email2);
			if(emailValid == false){
				$("#addContentBubbleTable #pathId").css('border-color','red').trigger('chosen:updated');
				$("#addContentBubbleTable #contentPathId").after("<tr class='errorMessageClsPLP'><td class='fieldLabel'></td>" +
						"<td class='validation' style='color:red;margin-bottom: 20px;'>Mailto is required in valid format.<br /> e.g. Mailto:email@prac.com</td></tr>");
				addSLPNonCaptiveSaveFlag = true;
			}
		}		
		
		if(addSLPNonCaptiveSaveFlag == true){
			return;
		}
		
		$('#secondLevelContents').empty('');
		$('#secondaryContentResultId').removeClass('hidden');
		$('#addSLPNonCaptiveSave').attr('disabled',true);
		secondLevelContentsId = $('#secondLevelContents');
		var link;
		link='/aiui/manageContent/addContentFilterDetailsNonCaptive';
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});		
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: link,
	        type: 'POST',
	        data: JSON.stringify({
	        	id:  contentFiltersID,
	        	displayOrder: displayOrder,
	        	contentType : contentType,
	        	newUrlPath:  url,
	        	newDisplayName:  urlDisplayName,	        	
	        	secPage: categoryName,
	        	secLandingDDId:secLandingDDId,
	        	state: state,
	        	channel:  channel,
	        	contentType1: contentType1
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        
	        success: function(response){
	        	$("#addContentBubbleSecPage").modal('hide');
	        	if(response!=null){	        	
	        		displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal);
	        	}
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	$("#addSLPNonCaptivePage").modal('hide');
	        	$("#addSLPNonCaptivePageBody #inValidErrorModalText").text('');
	        	//location.reload(true);
	        	resetAddContentPopUp();
	        	$.unblockUI();
	        }		
		});		
	});
	
	
		
	$(document).on("click", "#groupHeadingEditId", function(){
		var clsGrpHeading=$(this).closest('tr').find('.clsGrpHeading').val();
		var grpHeadingContent =$(this).closest('tr').find('.clsGrpHeadingContent').val();
		
		$("#grpHeaderID").val(clsGrpHeading);
		$("#grpHeaderContentDisplayNameId").val(grpHeadingContent);
		$("#editGrpHeaderBubbleId").modal('show');
	});
	
	$(document).on("click", "#submitEditGrpHeaderBubble", function(){
		var grpHeaderID = $("#grpHeaderID").val();
		var grpHeaderContentDisplayName = $("#grpHeaderContentDisplayNameId").val();
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/updateContentFilter',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  grpHeaderID,
	        	contentDisplayName:  grpHeaderContentDisplayName	        		        	
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response, textStatus, jqXHR){
	        	
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	$.unblockUI();
	        }		
		});
	});
	
		
	$(document).on("click", ".clsOrderingImage", function(){
		var categoryName =$(this).closest('tr').find('.clsCategoryName').val();
		var secondLevelContentsId;
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var IsFOFormFlag= $(this).closest('tr').find('.clsIsFOForm').val();
		
		if(IsFOFormFlag=='NO'){
			$('#secondLevelContents').empty('');
			secondLevelContentsId = $('#secondLevelContents');
		}else if(IsFOFormFlag=='YES'){
			$('#secondLevelContentsFOfficeForm').empty('');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}
		
		var rowFlag;
		if($(this).attr("id") =='cfDRowUpId'){
			rowFlag ='Up';
		} else {
			rowFlag ='Down';
		}
		var contentType= $("#contentTypeId").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
		
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();
		var clsDisplayOrder= $(this).closest('tr').find('.clsDisplayOrder').val();
		var secLandingDDId = $('#secLandingDDId').val();
		var cfId = $(this).closest('tr').find('.clsCFId').val(); 
		var foFormContentId;
		var secPageFlag = 0;
		
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});		
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/rowUpAndDownCFDetails',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  clsCFDetailsID,
	        	urlDisplayName:  clsUrlDisplayNameID,
	        	url:  clsUrlID,
	        	displayOrder:  clsDisplayOrder,
	        	rowFlag: rowFlag,
	        	secLandingDDId: categoryName,
	        	contentType : contentType,
	        	state : state,
	        	channel: channel
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	        	if(response!=null){
	        		displaySLPCaptive(response, secondLevelContentsId, cfId, categoryName, foFormContentId, secPageFlag, $('#secLandingDDId') );
	        		}
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	//location.reload(true);
	        	$('#contentUploads').removeClass('hidden');
	        	$.unblockUI();
	        }		
		});		
	});
	
	
	$(document).on("click", ".clsOrderingImageNonCaptive", function(){
		var categoryName =$(this).closest('tr').find('.clsCategoryName').val();		
		var clsCFDetailsID=$(this).closest('tr').find('.clsContentFiltersID').val();
				
		$('#secondLevelContents').empty('');
		var secondLevelContentsId = $('#secondLevelContents');
				
		var rowFlag;
		if($(this).attr("id") =='cfDRowUpId'){
			rowFlag ='Up';
		} else {
			rowFlag ='Down';
		}
		
		var clsUrlDisplayNameID=$(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsUrlID=$(this).closest('tr').find('.clsUrlID').val();
		var clsDisplayOrder= $(this).closest('tr').find('.clsDisplayOrder').val();
		var secLandingDDId = $('#secLandingDDId').val();
		var cfId = $(this).closest('tr').find('.clsCFId').val(); 
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var contentType= $("#contentTypeId").val();
	    
	    var secLandingPageVal = $('#secLandingDDId').val();
	
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/rowUpAndDownCFDetailsNonCaptive',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  clsCFDetailsID,
	        	urlDisplayName:  clsUrlDisplayNameID,
	        	url:  clsUrlID,
	        	displayOrder:  clsDisplayOrder,
	        	rowFlag: rowFlag,
	        	secLandingDDId: categoryName,
	        	state: state,
	        	channel:channel,
	        	contentType: contentType,
	        	secLandingDDId1:secLandingDDId
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response){
	        	if(response!=null){
	        		displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal);
	        		}
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	//location.reload(true);
	        	$('#contentUploads').removeClass('hidden');	
	        	$.unblockUI();
	        }		
		});		
	});
	
	
	$(document).on("click", ".clsPrmOrderingImage", function(){
		var rowFlag;
		if($(this).attr("id") =='cfRowUpId'){
			rowFlag ='Up';
		} else {
			rowFlag ='Down';
		}
		
		if($("#contentUploadChannelId").val() =='-Select-'){
			$('#primaryContentResultId').addClass('hidden');
			$('#secondaryContentResultId').addClass('hidden');
			$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
			return;
		} else {
			$('#primaryContentResultId').removeClass('hidden');
		}
		$('#firstLevelContents').empty('');
		$('#secLandingDDId').html("");
		$('#secondaryContentResultId').addClass('hidden');
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		var clsContentFiltersID=$(this).closest('tr').find('.clsContentFiltersID').val();
		var clsPrimaryLandingPage=$(this).closest('tr').find('.clsPrimaryLandingPage').val();
		var clsDisplayOrder= $(this).closest('tr').find('.clsDisplayOrder').val();
		
		var contentType= $("#contentTypeId").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var url=$(this).closest('tr').find('.clsUrlID').val();
	    var urlDisplayName= $(this).closest('tr').find('.clsUrlDisplayNameID').val();
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/rowUpAndDownContentFilters',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  clsContentFiltersID,
	        	primaryLandingPage:  clsPrimaryLandingPage,
	        	displayOrder:  clsDisplayOrder,
	        	rowFlag: rowFlag,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	url:url,
	        	urlDisplayName:urlDisplayName
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response, textStatus, jqXHR){
	    		if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){		    	
		    $('#contentUploads').removeClass('hidden');			    
			//$('#firstLevelContents').addClass("hidden");
		    $.unblockUI();
        }
    });
});
	
	
	$("#addContentTypeId").change(function(){
		$("#addContentBubbleBody #inValidErrorModalText").text('');
		var IsFOFormFlag= $("#IsFOFormFlag").val();
		var contentFilterId = $("#contentFiltersHiddenID").val();
		var contentType= $("#addContentTypeId").val();
		if(contentType == 'Header'){
			$("#contentPathId").hide();
			$("#contentDescriptionId").hide();
		} else {
			$("#contentPathId").show();
		}		
		if(IsFOFormFlag =='NO'){
			$("#contentDescriptionId").hide();
		} else if(IsFOFormFlag =='YES' && contentType != 'Header'){
			$("#contentDescriptionId").show();
		}
	});
	
	
	$("#contentTypeID").change(function(){		
		$("#addSLPNonCaptivePageBody #inValidErrorModalText").text('');
		var contentType= $("#contentTypeID").val();
		if(contentType == 'Header'){
			$("#addContentBubbleTable #contentPathId").hide();
		} else {
			$("#addContentBubbleTable #contentPathId").show();
		}
	});
	
	$(document).on("click", ".clsDeleteSLP",function(){
		var contentFilterId = $(this).closest('tr').find('.clsContentFiltersID').val();
		var displayName = $(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();
		$("#cfID").val($(this).closest('tr').find('.clsCFId').val());
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#contentFilterId").val(contentFilterId);
		$("#displayNameId").val(displayName);
		$("#urlId").val($(this).closest('tr').find('.clsUrlToDisplay').val());
		$("#displayOrder").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#warningMessageDelete #messageDeleteModalText").text('Are you sure you want to delete '+displayName +'?');
		$("#deleteSLPModal").modal('show'); 
	});
	
	
	$(document).on("click", "#deleteSLPButton",function(){
		$('#primaryContentResultId').addClass('hidden');
		$('#secondLevelContents').empty('');
		
		if($("#IsFOFormFlag").val() !='YES'){
		    if($("#secLandingDDId").val() =='-Select-'){
				$('#secondaryContentResultId').addClass('hidden');
				return;
			}
		}
		var urlId =$("#urlId").val();
	    var contentFilterId = $("#contentFilterId").val();
		var displayName = $("#displayNameId").val();
		var contentType= $("#contentTypeId").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var secLandingDDId = $('#secLandingDDId').val();
	    var categoryName =$("#categoryNameHiddenID").val();
	    var secondLevelContentsId = $('#secondLevelContents');
	    var displayOrder = $('#displayOrder').val();
	    
	    var secLandingPageVal = $('#secLandingDDId').val();
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/deleteSecLandingPageData',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  contentFilterId,
	        	displayName : displayName,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	secPage: secLandingDDId,
	        	urlId: urlId,
	        	displayName: displayName,
	        	displayOrder: displayOrder
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response, textStatus, jqXHR){
		    	if(response!=null){
		    		displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal);
		    		}        
			    },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	$("#deleteSLPModal").modal('hide');
	        	//location.reload(true);
	        	resetAddContentPopUp();
	        	$.unblockUI();
	        }
		});
	});
	
	
	$(document).on("click", ".clsDeleteSLPHP",function(){		
		var contentFilterId = $(this).closest('tr').find('.clsContentFiltersID').val();
		var displayName = $(this).closest('tr').find('.clsUrlDisplayNameID').val();
		var clsIsFOForm=$(this).closest('tr').find('.clsIsFOForm').val();
		var cfId = $(this).closest('tr').find('.clsCFId').val();
		$("#cfID").val(cfId);
		$("#IsFOFormFlag").val(clsIsFOForm);
		$("#categoryNameHiddenID").val($(this).closest('tr').find('.clsCategoryName').val());
		$("#contentFilterId").val(contentFilterId);
		$("#displayNameId").val(displayName);
		$("#urlId").val($(this).closest('tr').find('.clsUrlToDisplay').val());
		$("#displayOrder").val($(this).closest('tr').find('.clsDisplayOrder').val());
		$("#warningMessageDeleteHP #messageDeleteModalTextHP").text('Are you sure you want to delete '+displayName +'?');
		$("#deleteSLPModalHP").modal('show'); 
	});
	
	$(document).on("click", "#deleteSLPHP",function(){	
		$('#primaryContentResultId').addClass('hidden');
		//$('#secondaryContentResultId').removeClass('hidden');
		var secPageFlag=$("#secPageFlag").val(); 
		
		if($("#IsFOFormFlag").val() !='YES'){
		    if($("#secLandingDDId").val() =='-Select-'){
				$('#secondaryContentResultId').addClass('hidden');
				return;
			}
		}
	    var contentFilterId = $("#contentFilterId").val();
		var displayName = $("#displayNameId").val();
		var contentType= $("#contentTypeId").val();
		var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    var secLandingDDId = $('#secLandingDDId').val();
	    var categoryName =$("#categoryNameHiddenID").val();
	    var urlId =$("#urlId").val();
	    var secondLevelContentsId;		
		var isCFFO = isCFFOForm(categoryName);
	   if(isCFFO){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}else{
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}
	   //console.log('deleteSLPHP state = '+state +' channel ='+channel+' hit url = /aiui/manageContent/deleteSecLandingPageDataHP'+' categoryName='+categoryName
	   //	   +'isCFFO = '+isCFFO);
	    
	   /* if($("#cfID").val() != 16){
			$('#secondLevelContents').empty('');
			$('#secondaryContentResultId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContents');
		}else if( $("#cfID").val() == 16){
			$('#secondLevelContentsFOfficeForm').empty('');
			$('#secondaryContentResultFOfficeFormId').removeClass('hidden');
			secondLevelContentsId = $('#secondLevelContentsFOfficeForm');
		}*/
		var displayOrder = $('#displayOrder').val();
		var categoryFlag;
		var foFormContentId;
	    
		$.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
		
		$.ajax({
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/deleteSecLandingPageDataHP',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  contentFilterId,
	        	displayName : displayName,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel,
	        	secPage: categoryName,
	        	urlId: urlId,
	        	displayOrder: displayOrder
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
	        success: function(response, textStatus, jqXHR){		    	
		    	if(response!=null){
		    		displaySLPCaptive(response, secondLevelContentsId, $("#cfID").val(), categoryName, foFormContentId, secPageFlag, $('#secLandingDDId') );
		    		}
		    		           
			    },
	        error: function(jqXHR, textStatus, errorThrown){
	        	
	        },
	        complete: function(){
	        	$("#deleteSLPModalHP").modal('hide');
	        	//location.reload(true);
	        	resetAddContentPopUp();
	        	$.unblockUI();
	        }
		});
	});
	
	$(document).on("click", "#deleteCFLinks", function(){
		var contentFilterId = $(this).closest('tr').find('.clsContentFiltersID').val();
		var displayName = $(this).closest('tr').find('.clsUrlDisplayNameID').val();
		$("#contentFilterId").val(contentFilterId);
		$("#displayNameId").val(displayName);
		$("#warningMessageDeleteCF #messageDeleteModalTextCF").text('Are you sure you want to delete '+displayName +'?');
		$("#deleteCFModal").modal('show'); 
	});
	
	$(document).on("click", "#deleteCF", function(){
		if($("#contentUploadChannelId").val() =='-Select-'){
			$('#primaryContentResultId').addClass('hidden');
			$('#secondaryContentResultId').addClass('hidden');
			$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
			return;
		} else {
			$('#primaryContentResultId').removeClass('hidden');
		}
		//$('#firstLevelContents').html('');
		$('#firstLevelContents').empty('');
		$('#secLandingDDId').html("");
		$('#secondaryContentResultId').addClass('hidden');
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		var contentFilterId = $("#contentFilterId").val();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
	    $.ajax({
	    	headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/deleteCFPageData',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  contentFilterId,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
		    success: function(response){
		    		/*if(response!=null){
		    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
		    		}*/
		    	
		    	var NoData = JSON.stringify(response.NoData);	    			
		    	if(NoData === undefined){
		    		$("#contentResultsGridHeader").removeClass('hidden');
		    		displayPLPage(firstLevelContentsId, secLandingDDId, response);
		    	} else {
		    		var opCompMap = JSON.stringify(response.opCompMap);
		    		$('#opCompMapId').val(opCompMap);
		    		var opCompMapForHeader = JSON.stringify(response.opCompMapForHeader);
		    		$('#opCompMapForHeaderId').val(opCompMapForHeader);
		    		firstLevelContentsId.append('<tr><td class="contentTD1">'+response.NoData+'</td><td class="contentTD1">'+
		    				'<a id="addFirstPage" class="prmLinkRight">Add</a></td></tr>');
		    	}
		    	
		    },
		    error: function(jqXHR, textStatus, errorThrown){	           
		    },	        
		    complete: function(){		    	
			    $('#contentUploads').removeClass('hidden');	
			    $("#deleteCFModal").modal('hide');
			    $.unblockUI();
	        }
	    });
	});
	
	
	$(document).on("click", "#deleteCFHeaderLink", function(){
		var contentFilterId = $(this).closest('tr').find('.clsContentFiltersID').val();
		var displayName = $(this).closest('tr').find('.clsPrimaryLandingPage').val();
		$("#contentFilterId").val(contentFilterId);
		$("#displayNameId").val(displayName);
		$("#warningMessageDeleteCF #messageDeleteModalTextCF").text('Are you sure you want to delete '+displayName +'?');
		$("#deleteCFModalH").modal('show'); 
	});
	
	$(document).on("click", "#deleteCFH", function(){
		if($("#contentUploadChannelId").val() =='-Select-'){
			$('#primaryContentResultId').addClass('hidden');
			$('#secondaryContentResultId').addClass('hidden');
			$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
			return;
		} else {
			$('#primaryContentResultId').removeClass('hidden');
		}
		//$('#firstLevelContents').html('');
		$('#firstLevelContents').empty('');
		$('#secLandingDDId').html("");
		$('#secondaryContentResultId').addClass('hidden');
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		var secLPageDDFlag=$("#secLPageDDFlag").val(); 
		for(var i =0; i<secLPageDDFlag;i++){
			$("#secLPageDDId").remove();
		}
		var grpHeadingFlag=$("#grpHeadingFlag").val();
		for(var i =0; i<grpHeadingFlag;i++){
			$("#contentRowId1").remove();
		}
		var secPageFlag=$("#secPageFlag").val(); 
		for(var i =0; i<secPageFlag;i++){
			$("#contentRowId2").remove();
		}
		var firstLevelContentsId = $('#firstLevelContents');
		var secLandingDDId = $('#secLandingDDId');
		
		var contentFilterId = $("#contentFilterId").val();
		var contentType= $("#contentTypeId").val();
	    var state = $("#contentUploadStateId").val();
	    var channel= $("#contentUploadChannelId").val();
	    
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
	    $.ajax({
	    	headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        url: '/aiui/manageContent/deleteHeaderFromCF',
	        type: 'POST',
	        data: JSON.stringify({
	        	contentFiltersId:  contentFilterId,
	        	contentType: contentType,
	        	state: state,
	        	channel: channel
	        }),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        timeout: 30000,	        
	        cache: false,
		    success: function(response){
		    		/*if(response!=null){
		    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
		    		}*/
		    	var NoData = JSON.stringify(response.NoData);	    			
		    	if(NoData === undefined){
		    		$("#contentResultsGridHeader").removeClass('hidden');
		    		displayPLPage(firstLevelContentsId, secLandingDDId, response);
		    	} else {
		    		var opCompMap = JSON.stringify(response.opCompMap);
		    		$('#opCompMapId').val(opCompMap);
		    		var opCompMapForHeader = JSON.stringify(response.opCompMapForHeader);
		    		$('#opCompMapForHeaderId').val(opCompMapForHeader);
		    		firstLevelContentsId.append('<tr><td class="contentTD1">'+response.NoData+'</td><td class="contentTD1">'+
		    				'<a id="addFirstPage" class="prmLinkRight">Add</a></td></tr>');
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown){	           
		    },	        
		    complete: function(){		    	
			    $('#contentUploads').removeClass('hidden');	
			    $("#deleteCFModalH").modal('hide');
			    $.unblockUI();
	        }
	    });
	});
	
	
});

function resetErrorMessagePLPage(){	
	$('.errorMessageClsPLP').remove();
	$('.validation').empty();
	$("#addContentBubblePrmTable #addContentTypePrmPageId").css('border-color', '');
	$("#addContentBubblePrmTable #addContentLabelPrmPageId").css('border-color', '');
	$("#addContentBubblePrmTable #addContentPathPrmPageId").css('border-color', '');

	$("#addContentBubblePrmTable #addContentTypePrmPageIdFirst").css('border-color', '');
	$("#addContentBubblePrmTable #addContentLabelPrmPageIdFirst").css('border-color', '');
	$("#addContentBubblePrmTable #addContentPathPrmPageIdFirst").css('border-color', '');

	$("#addContentBubbleTable #contentTypeID").css('border-color', '');
	$("#addContentBubbleTable #labelId").css('border-color', '');
	$("#addContentBubbleTable #pathId").css('border-color', '');
	
	$("#addContentBubbleTable #addContentPathId").css('border-color', '').trigger('chosen:updated');
	$("#addContentBubbleTable #addContentLabelId").css('border-color', '');	
	
	$("#addContentBubbleTable #addDescriptionId").css('border-color','').trigger('chosen:updated');
	$("#addContentBubbleTable #contentDescriptionId").css('border-color', '');
	
	
}

function resetPrimaryPageData() {
	$("#secLandingDDId").text('');		
	$("#firstLevelContents").remove();
}

function resetAddContentPopUp(){
	$("#contentFiltersHiddenID").val('');
	$("#displayOrderHiddenID").val('');
	$("#addContentTypeId").val('');
	$("#addContentPathId").text('');
}

function resetPrimaryLandingPageDataAdd(){	
	 $("#addContentPathPrmPageId").val('');
	 $("#addContentLabelPrmPageId").val('');
	 $("#addDescriptionPrmPageId").val('');
	 $("#categoryNameHiddenID").val('');
	 $("#addContentTypePrmPageId").val('UploadedDocument').trigger('chosen:updated');
}

function resetPrimaryLandingPageDataAddFirst(){	
	 $("#addContentPathPrmPageIdFirst").val('');
	 $("#addContentLabelPrmPageIdFirst").val('');	 	 
	 $("#addContentTypePrmPageIdFirst").val('UploadedDocument').trigger('chosen:updated');
}

function resetSecondaryLandingPageDataAdd(){	
	 $("#addContentPathId").val('');
	 $("#addContentLabelId").val('');
	 $("#addDescriptionId").val('');
	 $("#inValidErrorModalText").val('');
	 $("#addContentTypeId").val('UploadedDocument').trigger('chosen:updated');
}

function resetSLPAddNonCaptive(){	
	 $("#pathId").val('');
	 $("#labelId").val('');
	 $("#inValidErrorModalText").val('');
	 $("#contentTypeID").val('UploadedDocument').trigger('chosen:updated');
}

function displaySLPCaptive(response, secondLevelContentsId, cfId, categoryName, foFormContentId, secPageFlag, secLandingDDId ){
	var IsSecondayLandingPage = $("#IsSecondayLandingPage").val();
	var secondaryLPageJsonObject = JSON.stringify(response.SecondaryLandingList);
	var groupHeadingListJsonObject = JSON.stringify(response.GroupHeadingList);
	var cfListJsonObject = JSON.stringify(response.cfList);
	var companyCD;
	//if(IsSecondayLandingPage == 'YES'){
	if(cfListJsonObject !== undefined){
		secLandingDDId.append('<option>-Select-');
		$.each($.parseJSON(cfListJsonObject), function(idx, obj) {	
			if(obj !=null){
				if(obj.noLandingPageFlag !='YES'){
					secLandingDDId.append('<option id="secLPageDDId" value='+obj.contentFiltersID+'>'+obj.secondayLandingPage+'</option>').prop('disabled',false).trigger('chosen:updated');
				}
			}
		});
		secLandingDDId.append('</option>');
	}
	
	$.each($.parseJSON(groupHeadingListJsonObject), function(idx, obj3) {
		companyCD = obj3.operatingCompany;
	});
	
	// What if company CD is empty as there is no data inserted yet in database for filter details.
	//captive shuld anyways be HP but keep the check
	if(companyCD == null || companyCD == undefined || companyCD.length<1){
		var chanel_cd = $('#contentUploadChannelId').val() || '';
		if(chanel_cd){
			if(chanel_cd.indexOf('Captive')!= -1){
				companyCD = 'HP';
			}else{
				companyCD = 'IA';
			}
		}
	}
	//Field Office Forms is different category then other secondary landing pages
	var isCFFO = isCFFOForm(categoryName);
//	console.log('displaySLPCaptive cfId = '+cfId +'companyCD derived from groupHeadingListJsonObject='+companyCD+' isFOForm = '+isCFFO);
	if(isCFFO){
	//if(cfId ==16){
		// console.log('whats cfId = 16 categoryName = '+categoryName+'clsIsFOForm = YES');
		secondLevelContentsId.append('<tr id="contentRowId2"><td class="secContentTD1"  style="color: #007ac9; !important;">'+categoryName+'</td>'+
			'<input type="hidden" value="'+ cfId +'" class="clsSecLandingDDId" />'+
			'<input type="hidden" value="'+categoryName+'" class="clsSLPageId" />'+
			'<input type="hidden" value="YES" class="clsIsCaptive" />'+
			'<input type="hidden" value="YES" class="clsIsFOForm" />'+	
			'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
			'<td class="secContentTD2" style="text-align: right; !important;">'+'Secondary Landing Page'+'</td>'+
			'<td class="secContentTD1" style="text-align: right; !important;">'+''+'</td>'+
			'<td class="secContentTD3">'+
			'<a id="headingEditId" class="secLinkLeft">Edit</a>'+
			'</td></tr>');
		$.each($.parseJSON(groupHeadingListJsonObject), function(idx, obj1) {
			foFormContentId = obj1.contentFiltersID;
			secondLevelContentsId.append('<tr id="contentRowId2"><td class="secContentTD1"  style="color: #007ac9; !important;">'+obj1.category+'</td>'+
					'<input type="hidden" value="'+obj1.category+'" class="clsSLPageId" />'+
					'<input type="hidden" value="'+obj1.contentFiltersID+'" class="clsContentFiltersID">'+
					'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
					'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
					'<input type="hidden" value="YES" class="clsIsFOForm" />'+
					'<input type="hidden" value="" class="clsHeaderOrNot" />'+
					'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
					'<td class="secContentTD2" style="text-align: right; !important;">'+'Category'+'</td>'+
					'<td class="secContentTD1" style="text-align: right; !important;">'+''+'</td>'+
					'<td class="secContentTD3">'+
					'<a id="categoryEditIdCaptive" class="secLinkLeft">Edit</a>'+
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
					'<a id="addSLPCaptiveId" class="secLinkRightFOF">Add</a>'+
					'</td></tr>');
			
			$.each($.parseJSON(secondaryLPageJsonObject), function(idx, obj2) {
				secPageFlag=secPageFlag+1;	    						 
				if(foFormContentId == obj2.contentFiltersID){
					if(obj2.url.indexOf("http") >=0){
						secondLevelContentsId.append('<tr id="contentRowId2">'+
								'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
								'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
								'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
								'<input type="hidden" value="'+obj2.description+'" class="clsDescriptionID" />'+
								'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
								'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
								'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
								'<input type="hidden" value="YES" class="clsIsFOForm" />'+
								'<input type="hidden" value="" class="clsHeaderOrNot" />'+
								'<input type="hidden" value="'+obj2.contentType+'" class="clsContentType" />'+
								'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
								'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
								'<td class="secContentTD1" id="contentNameId" style="color: #007ac9; !important;">'+	    								
								'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+
								obj2.url+
								'"'+'target="_blank">'+
								obj2.urlDisplayName+'</a></td>'+
								//'<td class="secContentTD2" style="text-align: right; !important;">'+'Uploaded Document'+'</td>'+
								'<td class="secContentTD2" style="text-align: right; !important;">'+obj2.contentType+'</td>'+
								'<td class="secContentTD1" style="text-align: right; !important;">'+obj2.description+'</td>'+
								'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeftFOF">Edit</a>'+
								'<a class="secLinkCenterFOF clsDeleteSLPHP">Delete</a>'+
								'<a class="secLinkOrderingImageUpFOF clsOrderingImage" id="cfDRowUpId">'+
								'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
								'<a class="secLinkOrderingImageDownFOF clsOrderingImage" id="cfDRowDownId">'+
								'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
								'<a id="addSLPCaptiveId" class="secLinkRightFOF">Add</a></td></tr>');
					} else {
						secondLevelContentsId.append('<tr id="contentRowId2">'+
							'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
							'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
							'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
							'<input type="hidden" value="'+obj2.description+'" class="clsDescriptionID" />'+
							'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
							'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
							'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
							'<input type="hidden" value="YES" class="clsIsFOForm" />'+
							'<input type="hidden" value="" class="clsHeaderOrNot" />'+
							'<input type="hidden" value="'+obj2.contentType+'" class="clsContentType" />'+
							'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
							'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
							'<td class="secContentTD1" id="contentNameId" style="color: #007ac9; !important;">'+	    								
							'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+ obj2.aiVignetteURL+
							obj2.url+
							'"'+'target="_blank">'+
							obj2.urlDisplayName+'</a></td>'+
							//'<td class="secContentTD2" style="text-align: right; !important;">'+'Uploaded Document'+'</td>'+
							'<td class="secContentTD2" style="text-align: right; !important;">'+obj2.contentType+'</td>'+
							'<td class="secContentTD1" style="text-align: right; !important;">'+obj2.description+'</td>'+
							'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeftFOF">Edit</a>'+
							'<a class="secLinkCenterFOF clsDeleteSLPHP">Delete</a>'+
							'<a class="secLinkOrderingImageUpFOF clsOrderingImage" id="cfDRowUpId">'+
							'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
							'<a class="secLinkOrderingImageDownFOF clsOrderingImage" id="cfDRowDownId">'+
							'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
							'<a id="addSLPCaptiveId" class="secLinkRightFOF">Add</a></td></tr>');
			}
			}
			});
		});
	} else {
		// console.log('cfId is not 16 categoryName ='+categoryName+'and clsIsFOForm = NO');
		secondLevelContentsId.append('<tr id="contentRowId2"><td class="secContentTD1"  style="color: #007ac9; !important;">'+categoryName+'</td>'+
				'<input type="hidden" value="'+ cfId +'" class="clsSecLandingDDId" />'+
				'<input type="hidden" value="'+ cfId +'" class="clsContentFiltersID" />'+
				'<input type="hidden" value="'+categoryName+'" class="clsSLPageId" />'+
				'<input type="hidden" value="NO" class="clsIsFOForm" />'+
				'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
				'<td class="secContentTD2" style="text-align: right; !important;">'+'Secondary Landing Page'+'</td>'+
				//'<td class="secContentTD1" style="text-align: right; !important;">'+''+'</td>'+
				'<td class="secContentTD3">'+
//				'<a class="secLinkCenter">Delete</a>'+
				'<a id="headingEditId" class="secLinkLeft">Edit</a>'+
				'</td></tr>');
		
		secPageFlag=0;
		$.each($.parseJSON(groupHeadingListJsonObject), function(idx, obj1) {
			foFormContentId = obj1.contentFiltersID;
			secondLevelContentsId.append('<tr id="contentRowId2"><td class="secContentTD1"  style="color: #007ac9; !important;">'+obj1.category+'</td>'+
					'<input type="hidden" value="'+obj1.category+'" class="clsSLPageId" />'+
					'<input type="hidden" value="'+obj1.contentFiltersID+'" class="clsContentFiltersID">'+
					'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
					'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
					'<input type="hidden" value="YES" class="clsIsFOForm" />'+
					'<input type="hidden" value="" class="clsHeaderOrNot" />'+
					'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
					'<td class="secContentTD2" style="text-align: right; !important;">'+'Category'+'</td>'+
					//'<td class="secContentTD1" style="text-align: right; !important;">'+''+'</td>'+
					'<td class="secContentTD3">'+
					'<a id="categoryEditIdCaptive" class="secLinkLeft">Edit</a>'+
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
					'<a id="addSLPCaptiveId" class="secLinkRight">Add</a>'+
					'</td></tr>');
		$.each($.parseJSON(secondaryLPageJsonObject), function(idx, obj2) {
				secPageFlag=secPageFlag+1;
				//if( == obj2.contentFiltersID){
				if(obj2.contentFiltersID == foFormContentId){
					if(obj2.url.indexOf("http") >=0){
						secondLevelContentsId.append('<tr id="contentRowId2">'+
								'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
								'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
								'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
								'<input type="hidden" value="'+obj2.description+'" class="clsDescriptionID" />'+
								'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
								'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
								'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
								'<input type="hidden" value="NO" class="clsIsFOForm" />'+
								'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
								'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
								'<td class="secContentTD1" style="color: #007ac9; !important;">'+
								'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+
								obj2.url+
								'"'+'target="_blank">'+
								obj2.urlDisplayName+'</a></td>'+
								'<td class="secContentTD2" style="text-align: right; !important;">'+obj2.contentType+'</td>'+
								'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeft">Edit</a>'+
								'<a class="secLinkCenter clsDeleteSLPHP">Delete</a>'+
								'<a class="secLinkOrderingImageUp clsOrderingImage" id="cfDRowUpId">'+
								'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
								'<a class="secLinkOrderingImageDown clsOrderingImage" id="cfDRowDownId">'+
								'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
								'<a id="addSLPCaptiveId" class="secLinkRight">Add</a></td></tr>');
					} else {
						secondLevelContentsId.append('<tr id="contentRowId2">'+
							'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
							'<input type="hidden" value="'+ cfId +'" class="clsCFId" />'+
							'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
							'<input type="hidden" value="'+obj2.description+'" class="clsDescriptionID" />'+
							'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
							'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
							'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
							'<input type="hidden" value="NO" class="clsIsFOForm" />'+
							'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
							'<input type="hidden" value="'+ companyCD +'" class="clsCompanyCD" />'+
							'<td class="secContentTD1" style="color: #007ac9; !important;">'+
							'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+ obj2.aiVignetteURL+
							obj2.url+
							'"'+'target="_blank">'+
							obj2.urlDisplayName+'</a></td>'+
							'<td class="secContentTD2" style="text-align: right; !important;">'+obj2.contentType+'</td>'+
							'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeft">Edit</a>'+
							'<a class="secLinkCenter clsDeleteSLPHP">Delete</a>'+
							'<a class="secLinkOrderingImageUp clsOrderingImage" id="cfDRowUpId">'+
							'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
							'<a class="secLinkOrderingImageDown clsOrderingImage" id="cfDRowDownId">'+
							'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
							'<a id="addSLPCaptiveId" class="secLinkRight">Add</a></td></tr>');
					}
				}
			});
		});
	$('#secPageFlag').val(secPageFlag);
}
}

function displaySLPNonCaptive(response, categoryName, secondLevelContentsId,secLandingPageVal){
	var companySecLanding;
	var cfListJsonObject = JSON.stringify(response.cfList);
	var secondaryLPageJsonObject = JSON.stringify(response.SecondaryLandingList);	
	
	var IsSecondayLandingPage = $("#IsSecondayLandingPage").val();
	if(IsSecondayLandingPage == 'YES'){
	//if(cfListJsonObject !== undefined){
		var secDDSelectionValue = $('#secLandingDDId').val();
		$('#secLandingDDId').html("");
		var secLandingDDId = $('#secLandingDDId');	

		if(!isValidValue(secDDSelectionValue)){
			secDDSelectionValue = secLandingPageVal;
		}
		secLandingDDId.append('<option>-Select-');
		//secLandingDDId.append('<option>-Select-</option>');
		//secLandingDDId.append('<option value=></option>');
		$.each($.parseJSON(cfListJsonObject), function(idx, obj) {
			if(obj !=null){
				if(obj.noLandingPageFlag !='YES'){
					secLandingDDId.append('<option id="secLPageDDId" value='+obj.contentFiltersID+'>'+obj.secondayLandingPage+'</option>').prop('disabled',false);
				}
			}
		});
		
	 	secLandingDDId.val(secDDSelectionValue).trigger('chosen:updated');
		
		secLandingDDId.append('</option>');
	}
	
	$.each($.parseJSON(cfListJsonObject), function(idx, cfListObj) {			    			
		if(cfListObj !=null){
			if(categoryName == cfListObj.secondayLandingPage && secLandingPageVal == cfListObj.contentFiltersID){
				//fix for company defaulting incorrectly
				companySecLanding = cfListObj.companyCd;
				secondLevelContentsId.append('<tr id="contentRowId2"><td class="secContentTD1"  style="color: #007ac9; !important;">'+cfListObj.secondayLandingPage+'</td>'+
    					'<input type="hidden" value="'+cfListObj.contentFiltersID+'" class="clsContentFiltersID">'+
    					'<input type="hidden" value="'+ cfListObj.contentFiltersID +'" class="clsCFId" />'+	
	    				'<input type="hidden" value="'+cfListObj.secondayLandingPage+'" class="clsSLPageId" />'+
	    				'<input type="hidden" value="'+ cfListObj.contentFiltersID +'" class="clsSecLandingDDId" />'+
	    				'<input type="hidden" value="'+ cfListObj.companyCd +'" class="clsCompanyCD" />'+
	    				'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
	    				'<input type="hidden" value="NO" class="clsIsFOForm" />'+
	    				'<input type="hidden" value="NO" class="clsIsCaptive" />'+
						'<td class="secContentTD2" style="text-align: right; !important;">'+'Secondary Landing Page'+'</td>'+
						//'<td class="secContentTD1" style="text-align: right; !important;">'+''+'</td>'+
						'<td class="secContentTD3">'+
//						'<a class="secLinkCenter">Delete</a>'+
						//'<a id="categoryEditIdNonCaptive" class="secLinkLeft">Edit</a>'+
						'<a id="headingEditId" class="secLinkLeft">Edit</a>'+
						'<a id="addSLPNonCaptiveId" class="secLinkRight1">Add</a>'+
						'</td></tr>');
			}		
			if(companySecLanding == null || companySecLanding == undefined || companySecLanding.length<1){
				companySecLanding = cfListObj.companyCd;
		}
		}
	});
	
	$.each($.parseJSON(secondaryLPageJsonObject), function(idx, obj2) {
		companySecLanding = obj2.operatingCompany;
		if(obj2.url.indexOf("http") >=0){
			secondLevelContentsId.append('<tr id="contentRowId2">'+
					'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
					'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsCFId" />'+	
					'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
					'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
					'<input type="hidden" value="NO" class="clsIsCaptive" />'+
					'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
					'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
					'<input type="hidden" value="NO" class="clsIsFOForm" />'+
					'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
					'<input type="hidden" value="'+ companySecLanding +'" class="clsCompanyCD" />'+
					'<td class="secContentTD1" style="color: #007ac9; !important;">'+
					'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+
					obj2.url+
					'"'+'target="_blank">'+
					obj2.urlDisplayName+'</a></td>'+
					'<td class="secContentTD2" style="text-align: right; !important;">'+'Uploaded Document'+'</td>'+
				    //'<td class="secContentTD1" style="text-align: right; !important;">'+obj2.urlDisplayName+'</td>'+
					'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeft">Edit</a>'+
					'<a class="secLinkCenter clsDeleteSLP">Delete</a>'+
					'<a class="secLinkOrderingImageUp clsOrderingImageNonCaptive" id="cfDRowUpId">'+
					'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
					'<a class="secLinkOrderingImageDown clsOrderingImageNonCaptive" id="cfDRowDownId">'+
					'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
					'<a id="addSLPNonCaptiveId" class="secLinkRight">Add</a></td></tr>');
		} else {
			secondLevelContentsId.append('<tr id="contentRowId2">'+
					'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsContentFiltersID" />'+
					'<input type="hidden" value="'+ obj2.contentFiltersID +'" class="clsCFId" />'+	
					'<input type="hidden" value="'+obj2.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
					'<input type="hidden" value="'+obj2.url+'" class="clsUrlID" />'+
					'<input type="hidden" value="NO" class="clsIsCaptive" />'+
					'<input type="hidden" value="'+obj2.displayOrder+'" class="clsDisplayOrder" />'+
					'<input type="hidden" value="'+categoryName+'" class="clsCategoryName" />'+
					'<input type="hidden" value="NO" class="clsIsFOForm" />'+
					'<input type="hidden" value="'+obj2.urlToDisplay+'" class="clsUrlToDisplay" />'+
					'<input type="hidden" value="'+ companySecLanding +'" class="clsCompanyCD" />'+
					'<td class="secContentTD1" style="color: #007ac9; !important;">'+
					'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+ obj2.aiVignetteURL+
					obj2.url+
					'"'+'target="_blank">'+
					obj2.urlDisplayName+'</a></td>'+
					'<td class="secContentTD2" style="text-align: right; !important;">'+'Uploaded Document'+'</td>'+
				    //'<td class="secContentTD1" style="text-align: right; !important;">'+obj2.urlDisplayName+'</td>'+
					'<td class="secContentTD3"><a id="editSLPId" class="secLinkLeft">Edit</a>'+
					'<a class="secLinkCenter clsDeleteSLP">Delete</a>'+
					'<a class="secLinkOrderingImageUp clsOrderingImageNonCaptive" id="cfDRowUpId">'+
					'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
					'<a class="secLinkOrderingImageDown clsOrderingImageNonCaptive" id="cfDRowDownId">'+
					'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
					'<a id="addSLPNonCaptiveId" class="secLinkRight">Add</a></td></tr>');
			}
		});		    		
 }

function changeOfChannel(){
	if($("#contentUploadChannelId").val() =='-Select-'){
		$('#primaryContentResultId').addClass('hidden');
		$('#secondaryContentResultId').addClass('hidden');
		$('#secondaryContentResultFOfficeFormId').addClass('hidden');
		$('#secLandingDDId').prop('selectedIndex',0).trigger('chosen:updated');	
		$('#secLandingDDId').prop('disabled',true).trigger('chosen:updated');
		return;
	} else {
		$('#primaryContentResultId').removeClass('hidden');
	}
	$('#firstLevelContents').html('');
	$('#secondaryContentResultId').addClass('hidden');
	$('#secondaryContentResultFOfficeFormId').addClass('hidden');
	var secLPageDDFlag=$("#secLPageDDFlag").val();
	var grpHeadingFlag=$("#grpHeadingFlag").val();
	var secPageFlag=$("#secPageFlag").val(); 

	var firstLevelContentsId = $('#firstLevelContents');
	$('#secLandingDDId').html("");
	var secLandingDDId = $('#secLandingDDId');
	
	var contentType= $("#contentTypeId").val();
    var state = $("#contentUploadStateId").val();
    var channel= $("#contentUploadChannelId").val();
    var linkURL = '/aiui/manageContent/contentType/' + contentType+'/state/'+state+'/channel/'+channel;
    //console.log('chnageOfChannel linkURL = '+linkURL);

    $.blockUI({
		message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
    
	$.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },	       
        url:linkURL,
        type: "GET",
        cache: false,
	    success: function(response){
	    		/*if(response!=null){
	    			displayPLPage(firstLevelContentsId, secLandingDDId, response);
	    		}*/
	    	if(response!=null){
    			var NoData = JSON.stringify(response.NoData);	    			
    			if(NoData === undefined){
    				$("#contentResultsGridHeader").removeClass('hidden');
    				//console.log(' changeOfChannel reponse successful call displayPLPage');
    				displayPLPage(firstLevelContentsId, secLandingDDId, response);
    			} else {
    				var opCompMap = JSON.stringify(response.opCompMap);
    				$('#opCompMapId').val(opCompMap);
    				var opCompMapForHeader = JSON.stringify(response.opCompMapForHeader);
    				$('#opCompMapForHeaderId').val(opCompMapForHeader);
    				//console.log(' changeOfChannel reponse successful NoData found ');
    				firstLevelContentsId.append('<tr><td class="contentTD1">'+response.NoData+'</td><td class="contentTD1">'+
    						'<a id="addFirstPage" class="prmLinkRight">Add</a></td></tr>');
    			}
    		}
	    },
	    error: function(jqXHR, textStatus, errorThrown){	           
	    },	        
	    complete: function(){		    	
		    $('#contentUploads').removeClass('hidden');			    
			//$('#firstLevelContents').addClass("hidden");
		    $.unblockUI();
        }
    });
}
	
	function displayPLPage(firstLevelContentsId, secLandingDDId, response){
		
		//console.log('displayPLPage firstLevelContentsId = '+firstLevelContentsId+' secLandingDDId ='+secLandingDDId);
		var opCompMap = JSON.stringify(response.opCompMap);
		$('#opCompMapId').val(opCompMap);
		var opCompMapForHeader = JSON.stringify(response.opCompMapForHeader);
		$('#opCompMapForHeaderId').val(opCompMapForHeader);
		var PrimaryLandingList = JSON.stringify(response.PrimaryLandingList);	    			
		var secLPageDDFlag=0;
		var channelFlag=0;
		secLandingDDId.append('<option>-Select-');
		$.each($.parseJSON(PrimaryLandingList), function(idx, obj) {
			if(obj !=null){
				channelFlag = obj.channelCd;
				secLPageDDFlag=secLPageDDFlag+1;
				//if(obj.isTertiary !='NoSLanding' || obj.isTertiary !='Header'){
				if(obj.channelCd !='Captive' && obj.isTertiary =='No'){
					secLandingDDId.append('<option id="secLPageDDId" value='+obj.contentFiltersID+'>'+obj.secondayLandingPage+'</option>').prop('disabled',false).trigger('chosen:updated');
				} else if(obj.channelCd =='Captive' && obj.isTertiary =='Yes'){
					secLandingDDId.append('<option id="secLPageDDId" value='+obj.contentFiltersID+'>'+obj.secondayLandingPage+'</option>').prop('disabled',false).trigger('chosen:updated');
				}
			}
		});
		secLandingDDId.append('</option>');
		$.each($.parseJSON(PrimaryLandingList), function(idx, object) {
			if(object.isTertiary=='Header'){
				//if(object.displayOrder == 1){
				firstLevelContentsId.append('<tr id="contentRowId1"><td class="contentTD1">'+object.primaryLandingPage+'</td>'+
						'<input type="hidden" value="'+ object.contentFiltersID +'" class="clsContentFiltersID" />'+
						'<input type="hidden" value="'+ object.primaryLandingPage +'" class="clsGrpHeadingContent" />'+
						'<input type="hidden" value="'+ object.stateCd +'" class="clsGrpState" />'+
						'<input type="hidden" value="'+ object.companyCd +'" class="clsGrpCompany" />'+
						'<input type="hidden" value="'+ object.department +'" class="clsGrpDepartment" />'+
						'<input type="hidden" value="'+ object.channelCd +'" class="clsGrpChannel" />'+
						
						
						'<input type="hidden" value="'+ object.primaryLandingPage +'" class="clsPrimaryLandingPage" />'+
						'<input type="hidden" value="'+ object.secondayLandingPage +'" class="clsSecondayLandingPage" />'+
						'<input type="hidden" value="'+ object.stateCd +'" class="clsStateCd" />'+
						'<input type="hidden" value="'+ object.companyCd +'" class="clsCompanyCd" />'+
						'<input type="hidden" value="'+ object.department +'" class="clsDepartment" />'+
						'<input type="hidden" value="'+ object.channelCd +'" class="clsChannelCd" />'+
						'<input type="hidden" value="'+ object.displayOrder +'" class="clsDisplayOrder" />'+
						'<input type="hidden" value="'+object.url+'" class="clsUrlID" />'+
						'<input type="hidden" value="'+object.contentType+'" class="clsSLPageId" />'+
						'<input type="hidden" value="'+object.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
						'<input type="hidden" value="'+object.secondayLandingPage+'" class="clsCategoryName" />'+
						'<input type="hidden" value="'+object.urlToDisplay+'" class="clsUrlToDisplay" />'+
						'<input type="hidden" value="'+object.isTertiary+'" class="clsCType" />'+
						
						'<td class="contentTD1" style="text-align: right; !important;">'+object.isTertiary+'</td>'+
						'<td class="contentTD3">'+
						'<a id="editPLPageHeaderId" class="prmLinkLeft">Edit</a>'+
						'<a id="deleteCFHeaderLink" class="prmLinkCenter">Delete</a>'+
						'<a class="prmLinkOrderingImageUp clsPrmOrderingImage" id="cfRowUpId">'+
						'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
						'<a class="prmLinkOrderingImageDown clsPrmOrderingImage" id="cfRowDownId">'+
						'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
						'<a id="addPrmPageId" class="prmLinkRight">Add</a>'+
						'</td></tr>');
				//}
			} else if(object.url!=null){
				if(object.url.indexOf("http") >=0){
					firstLevelContentsId.append('<tr id="contentRowId2"><td class="contentTD1" style="color: #007ac9; !important;">'+
							'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+object.url+
							'"'+'target="_blank">'+
							object.secondayLandingPage		    								
							+'</a></td>'+
							'<input type="hidden" value="'+ object.contentFiltersID +'" class="clsContentFiltersID" />'+
    						'<input type="hidden" value="'+ object.primaryLandingPage +'" class="clsPrimaryLandingPage" />'+
    						'<input type="hidden" value="'+ object.secondayLandingPage +'" class="clsSecondayLandingPage" />'+
    						'<input type="hidden" value="'+ object.stateCd +'" class="clsStateCd" />'+
    						'<input type="hidden" value="'+ object.companyCd +'" class="clsCompanyCd" />'+
    						'<input type="hidden" value="'+ object.department +'" class="clsDepartment" />'+
    						'<input type="hidden" value="'+ object.channelCd +'" class="clsChannelCd" />'+
    						'<input type="hidden" value="'+ object.displayOrder +'" class="clsDisplayOrder" />'+
    						'<input type="hidden" value="'+object.url+'" class="clsUrlID" />'+
    						'<input type="hidden" value="'+object.contentType+'" class="clsSLPageId" />'+
    						'<input type="hidden" value="'+object.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
    						'<input type="hidden" value="'+object.secondayLandingPage+'" class="clsCategoryName" />'+
    						'<input type="hidden" value="'+object.urlToDisplay+'" class="clsUrlToDisplay" />'+
							'<td class="contentTD1" style="text-align: right; !important;">'+object.contentType+'</td><td class="contentTD3">'+
							//'<a id="editPrmPageId" class="prmLinkLeft">Edit</a>'+
							'<a id="editCFLinks" class="secLinkLeft">Edit</a>'+				    								
							'<a id="deleteCFLinks" class="prmLinkCenter">Delete</a>'+
							'<a class="prmLinkOrderingImageUp clsPrmOrderingImage" id="cfRowUpId">'+
							'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
							'<a class="prmLinkOrderingImageDown clsPrmOrderingImage" id="cfRowDownId">'+
							'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
							'<a id="addPrmPageId" class="prmLinkRight">Add</a>'+
							'</td></tr>');
					} else{
					firstLevelContentsId.append('<tr id="contentRowId2"><td class="contentTD1" style="color: #007ac9; !important;">'+
							'<a class="w_contentLink_marketing" style="padding-top: 0px !important;" href="'+ object.aiVignetteURL+
							object.url+
							'"'+'target="_blank">'+
							object.secondayLandingPage		    								
							+'</a></td>'+
							'<input type="hidden" value="'+ object.contentFiltersID +'" class="clsContentFiltersID" />'+
    						'<input type="hidden" value="'+ object.primaryLandingPage +'" class="clsPrimaryLandingPage" />'+
    						'<input type="hidden" value="'+ object.secondayLandingPage +'" class="clsSecondayLandingPage" />'+
    						'<input type="hidden" value="'+ object.stateCd +'" class="clsStateCd" />'+
    						'<input type="hidden" value="'+ object.companyCd +'" class="clsCompanyCd" />'+
    						'<input type="hidden" value="'+ object.department +'" class="clsDepartment" />'+
    						'<input type="hidden" value="'+ object.channelCd +'" class="clsChannelCd" />'+
    						'<input type="hidden" value="'+ object.displayOrder +'" class="clsDisplayOrder" />'+
    						'<input type="hidden" value="'+object.url+'" class="clsUrlID" />'+
    						'<input type="hidden" value="'+object.contentType+'" class="clsSLPageId" />'+
    						'<input type="hidden" value="'+object.urlDisplayName+'" class="clsUrlDisplayNameID" />'+
    						'<input type="hidden" value="'+object.secondayLandingPage+'" class="clsCategoryName" />'+
    						'<input type="hidden" value="'+object.urlToDisplay+'" class="clsUrlToDisplay" />'+
							'<td class="contentTD1" style="text-align: right; !important;">'+object.contentType+'</td><td class="contentTD3">'+
							//'<a id="editPrmPageId" class="prmLinkLeft">Edit</a>'+
							'<a id="editCFLinks" class="secLinkLeft">Edit</a>'+
							'<a id="deleteCFLinks" class="prmLinkCenter">Delete</a>'+
							'<a class="prmLinkOrderingImageUp clsPrmOrderingImage" id="cfRowUpId">'+
							'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
							'<a class="prmLinkOrderingImageDown clsPrmOrderingImage" id="cfRowDownId">'+
							'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
							'<a id="addPrmPageId" class="prmLinkRight">Add</a>'+
							'</td></tr>');
				}
			} else {
				//Secondary LP 
				//console.log('displayPLPage Non Header data = '+JSON.stringify(object));
				firstLevelContentsId.append('<tr id="contentRowId2"><td class="contentTD1" style="color: #007ac9; !important;">'+object.secondayLandingPage+'</td>'+
						'<input type="hidden" value="'+ object.contentFiltersID +'" class="clsContentFiltersID" />'+
						'<input type="hidden" value="'+ object.primaryLandingPage +'" class="clsPrimaryLandingPage" />'+
						'<input type="hidden" value="'+ object.secondayLandingPage +'" class="clsSecondayLandingPage" />'+
						'<input type="hidden" value="'+ object.stateCd +'" class="clsStateCd" />'+
						'<input type="hidden" value="'+ object.companyCd +'" class="clsCompanyCd" />'+
						'<input type="hidden" value="'+ object.department +'" class="clsDepartment" />'+
						'<input type="hidden" value="'+ object.channelCd +'" class="clsChannelCd" />'+
						'<input type="hidden" value="'+ object.displayOrder +'" class="clsDisplayOrder" />'+
						'<input type="hidden" value="'+object.contentType+'" class="clsSLPageId" />'+
						'<td class="contentTD1" style="text-align: right; !important;">'+object.contentType+'</td><td class="contentTD3">'+
						'<a id="editPrmPageId" class="prmLinkLeft">Edit</a>'+
//						'<a id="deletePrmPageId" class="prmLinkCenter">Delete</a>'+
						/*'<a class="prmLinkOrderingImageUp clsPrmOrderingImage" id="cfRowUpId">'+*/
						'<a class="prmLinkOrderingImageUp1 clsPrmOrderingImage" id="cfRowUpId">'+
						'<img src="../../aiui/resources/images/arrow_up_blue.png"/></a>'+
						/*'<a class="prmLinkOrderingImageDown clsPrmOrderingImage" id="cfRowDownId">'+*/
						'<a class="prmLinkOrderingImageDown1 clsPrmOrderingImage" id="cfRowDownId">'+
						'<img src="../../aiui/resources/images/arrow_down_blue.png"/></a>'+
						/*'<a id="addPrmPageId" class="prmLinkRight">Add</a>'+*/
						'<a id="addPrmPageId" class="prmLinkRight1">Add</a>'+
						'</td></tr>');
			}			
		});
	}
	
	function isEmailValid(email){
		 var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		 return regex.test(email);
	}

	
	function isCFFOForm(categoryName){
		var isFO = false;
		if(categoryName != null && categoryName != undefined && categoryName.length > 1){
			if(categoryName.indexOf("Field") != -1 && categoryName.indexOf("Office") != -1 && categoryName.indexOf("Forms") != -1){
				isFO = true;
			}
		}
		return isFO;
	}
