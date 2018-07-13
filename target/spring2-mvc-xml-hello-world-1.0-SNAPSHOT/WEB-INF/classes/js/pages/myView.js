jQuery(document).ready(function() {	
	
	$('#saveMyView').click(function () {
		//trigger close dropdowns if save is clicked
		$('#ddcl-stateId-ddw').parent().find('.iconClose').trigger('click');
		$('#ddcl-channelId-ddw').parent().find('.iconClose').trigger('click');
		//validate the save button
		var validate = validateMyViewSelections($("#stateId").val(),$("#channelId").val());
		if(!validate){
			return false;
		}
		
		
		console.log('Save my View is Called')
		$("#stateId option[value='']").attr('selected', true);
		
		var myViewLocationFlag = $('#mcSubHeading').text();
		
		console.log('myViewLocationFlag '+myViewLocationFlag)
		var date = new Date();
	    var stateId= $("#stateId").val();
	    var channelId= $("#channelId").val();
	    var milliSecs = date.getMilliseconds();

	    var linkURL = 'stateId/' + stateId+'/channelId/' + channelId+'/myViewLocationFlag/'+myViewLocationFlag;	
	       
	    $.blockUI({
			message: "<img src='../../aiui/resources/images/loading_icon.gif'/><br/>Loading...", 
			css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
		});
	    
	   $.ajax({
	        headers: { 
	            'Accept': 'application/json',
	            'Content-Type': 'application/json' 
	        },
	        url: "/aiui/myView/" + linkURL + "?" + milliSecs,
	        type: "get",
		        success: function(response){
		        	$('#NJHPAccessId').val(JSON.stringify(response.NJHPAccess));
		        	$('#NJIAAccessId').val(JSON.stringify(response.NJIAAccess));
		        	$('#MAIAAccessId').val(JSON.stringify(response.MAIAAccess));
		        	$('#CTIAAccessId').val(JSON.stringify(response.CTIAAccess));
		        	$('#NHIAAccessId').val(JSON.stringify(response.NHIAAccess));
		        	$('#PAHPAccessId').val(JSON.stringify(response.PAHPAccess));
		        	$('#PAIAAccessId').val(JSON.stringify(response.PAIAAccess));
		        	$('#NYHPAccessId').val(JSON.stringify(response.NYHPAccess));
		        	$('#NYIAAccessId').val(JSON.stringify(response.NYIAAccess));
		        	$('#PAPRAccessId').val(JSON.stringify(response.PAPRAccess));
		        },
		        error: function(jqXHR, textStatus, errorThrown){	           
			    },
		        	        
		        complete: function(){
		        	//update the my view dialog
		        	//myViewStates
		        	
		        	$(myViewStates).empty();
		        	if(stateId){
		        	$(stateId).each(function(index){
		        		if (index == (stateId.length - 1)) { 
		        			$('#myViewStates').append(this+"");
		        		}else{
		        			$('#myViewStates').append(this + "; ");
		        		}
		        	});
		        	}
		        	//myViewChannel
		        	$(myViewChannel).empty();
		        	
		        	if(channelId){
		        	$(channelId).each(function(index){
		        		if (!index == (channelId.length - 1)) { 
		        			$('#myViewChannel').append(this + "; ");
		        		}else{
		        			$('#myViewChannel').append(this+"");
		        		}
		        	});
		        	}
		        	//Update for multidropdown
		        	$('#statesFromSession').val(stateId);
		        	$('#channelsFromSession').val(channelId);
		        	
		        	$("#changeMyViewModal").modal('hide');
		        	window.location.reload(true);
//		        	if(myViewLocationFlag =='Landing'){
//			        	window.location.reload(true);
//			        }
		        	$.unblockUI();
		        }
	    });
	});
	
	
});

//51817
function validateMyViewSelections(state,channel){
	var hasError = false;
	var invalidComb = -1;
	var errorMessageID = '';

	var selectionHasNJ = $.inArray('NJ',state)>=0?true:false;
	var selectionHasPA = $.inArray('PA',state)>=0?true:false;
	var selectionHasNY = $.inArray('NY',state)>=0?true:false;
	
	$(state).each(function(){
		if(this == 'CT' && !selectionHasNJ && !selectionHasPA && !selectionHasNY){
			invalidComb = $.inArray('Captive',channel);
		}if(this == 'MA' && !selectionHasNJ && !selectionHasPA && !selectionHasNY){
			invalidComb = $.inArray('Captive',channel);
		}if(this == 'NH' && !selectionHasNJ && !selectionHasPA && !selectionHasNY){
			invalidComb = $.inArray('Captive',channel);
		}if((this == 'CT' || this == 'MA' || this == 'NH') && ((selectionHasNJ && channel.length == 1) || (selectionHasPA && channel.length == 1) || (selectionHasNY && channel.length == 1))){
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
	var selectionHasNY = $.inArray('NY',state)>=0?true:false;
	
	$(state).each(function(){
		if(this == 'CT' && !selectionHasNJ && !selectionHasPA && !selectionHasNY ){
			invalidComb = $.inArray('Captive',channel);
		}if(this == 'MA' && !selectionHasNJ && !selectionHasPA && !selectionHasNY ){
			invalidComb = $.inArray('Captive',channel);
		}if(this == 'NH' && !selectionHasNJ && !selectionHasPA && !selectionHasNY ){
			invalidComb = $.inArray('Captive',channel);
		}if((this == 'CT' || this == 'MA' || this == 'NH') && ((selectionHasNJ && channel.length == 1) || (selectionHasPA && channel.length == 1) || (selectionHasNY && channel.length == 1))){
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