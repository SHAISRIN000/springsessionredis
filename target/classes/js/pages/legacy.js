jQuery(document).ready(function() {	
	showClearAdvSearch();
	
	$("#returnAuto").click(function () {	
		if($('#autoPolicyKey').val() == ""){
			//This is flow for legacy quotes via cross sell button click
			document.actionForm.action = '/aiui/summary';
			document.actionForm.method="GET";
		}else{
			//this is a flow for legacy quotes via search edit
			document.actionForm.action = '/aiui/summary/crossSellReturn';
			document.actionForm.policyKey.value = $('#autoPolicyKey').val();
			document.actionForm.policyNumber.value = $('#autoPolicyNumber').val();
			document.actionForm.method="POST";
		}		
			
			document.actionForm.submit();	
	});
	initialFormLoadProcessing();
});

//complete hiding, showing, etc
//window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing()
{
}

function showClearAdvSearch(){
	var searchIn = $('#searchIn').val();
	var tabAdvSearch = searchIn + "_advSearch";
	
	if(hasPerformedAdvSearchForTab(tabAdvSearch)){
		$("#clearAdvPolSearch").show();
	}else{
		$("#clearAdvPolSearch").hide();
	}
	
}
