jQuery(document).ready(function() {
	$('#landingBreadCrumbs').show();
	$('#mainLinkRef').text('Coverage Preferences');
	
	/*if(($("#stateCode").val() == "MA" 
				|| $("#stateCode").val() == "CT")  
			&& $('#lob').val()=='Cauto'){
		$(".MA_CA").show();
		$(".NJ,.MA,.NH").detach();
		if($("#stateCode").val() == "CT"){
			$('.MA_ONLY').detach();	
		}
	} else if($("#stateCode").val() == "MA"){
		$(".MA").show();
		$(".NJ,.MA_CA,.CT,.NH").detach();
		$(".MA_CA,.CT,.NH").detach();
	}else if($("#stateCode").val() == "NH"){
		$(".NH").show();
		$(".NJ,.MA_CA,.CT,.MA").detach();
		// remove Commercial Auto from dropdown
		
	}*//*else if($("#stateCode").val() == "CT"){
		$(".CT").show();
		$(".MA,.NJ,.MA_CA").detach();
	}*//*else if($("#stateCode").val() == "NJ"){
		$(".NJ").show();
		$(".MA,.MA_CA,.CT,.NH").detach();
	}*/
	
	
	
	$(".btnCovPref").click(function(e){
		blockUser();
		e.preventDefault();
		$('#lob').prop('disabled',false).trigger("chosen:updated");
		$('#stateCode').prop('disabled',false).trigger("chosen:updated");
		
		var lob = $('#lob').val();
		
		if(lob =='PA'){
			$('#PA_product').prop('disabled',false).trigger("chosen:updated");
		}else if(lob =='Cauto'){
			$('#Cauto_product').prop('disabled',false).trigger("chosen:updated");
		}				
		
		document.aiForm.action = "/aiui/preferences/"+this.id;
		document.aiForm.submit();
	});
		
	$(document).on("change", "#stateCode", function() {
		refreshPreferences();
    });
	
	$(document).on("change", "#lob", function() {
		var lob = $("#lob").val();		
		if(lob =='PA'){
			$('#div_PA_product').removeClass('hidden');
			$('#div_PA_product').closest('tr').show();
			
			//hide cauto product and disable dropdown
			$('#div_Cauto_product').addClass('hidden');	
			
			$('#PA_product').val('ALN_PA').trigger("chosen:updated");
		}else if(lob =='Cauto'){
			$('#div_Cauto_product').removeClass('hidden');
			//hide PA product and disable dropdown
			$('#div_PA_product').addClass('hidden');	
			
			//50453 - When I select CA, Expected PRODUCT to go away…..not default to CA
			$('#div_PA_product').closest('tr').hide();
			
			$('#Cauto_product').val('Cauto').trigger("chosen:updated");			
		}
			refreshPreferences();
	});
 	
	$(document).on("change", "#Cauto_product,#PA_product", function() {		
		refreshPreferences();
    });
		
	//50453 - When I select CA, Expected PRODUCT to go away…..not default to CA
	if($("#lob").val()=='Cauto'){
		//hide PA product and disable dropdown
		$('#div_PA_product').addClass('hidden');
		$('#div_PA_product').closest('tr').hide();
	}
	
	$(document).on("change", "#OBI_PPA", function() {	
		if($('#OBI_PPA').val().indexOf("CSL") == 0){
			$("#PD_MA").val("").trigger('chosen:updated');
		} else {
			$("#PD_MA").val("select").trigger('chosen:updated');
		}
    });
	
	$(document).on("change", "#BI_CT", function() {
		if($("#stateCode").val() == "CT"){
		var biCT = $('#BI_CT').val();		
		if($('#BI_CT').val().indexOf("CSL")> 0){
			$("#PD_CT").val("").trigger('chosen:updated');
		} else{			
			if(biCT == 'Limit:20,000/40,000'){
				$("#PD_CT").val("10,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:25,000/50,000'){
				$("#PD_CT").val("15,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:50,000/100,000'){
				$("#PD_CT").val("25,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:100,000/300,000'){
				$("#PD_CT").val("50,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:200,000/600,000'){
				$("#PD_CT").val("100,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:250,000/500,000'){
				$("#PD_CT").val("100,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:500,000/1,000,000'){
				$("#PD_CT").val("250,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:1,000,000/1,000,000'){
				$("#PD_CT").val("500,000").trigger('chosen:updated');
			} else if(biCT == 'Limit:'){
				$("#PD_CT").val("select").trigger('chosen:updated');
			}			
		  }
		}
    });
	
	$(document).on("change", "#UM", function() {
		if($("#stateCode").val() == "CT"){
			$("#UIM_PPA").val($('#UM').val()).trigger('chosen:updated');
		}
    });
	
	if($("#stateCode").val() == "PA"){
		
		setCoveragesPA($('#FPBP'));
		
		$(document).on("change", "#FPBP", function() {
			$("#MB").val("select").trigger('chosen:updated');
			$("#ILB").val("select").trigger('chosen:updated');
			$("#ADB").val("select").trigger('chosen:updated');
			$("#FEB").val("select").trigger('chosen:updated');
			$("#CFPB").val("select").trigger('chosen:updated');
			
			setCoveragesPA($('#FPBP'));
	    });
	}	
	
});

function showMainPage() {
	showExitPrompt(redirectLandingPage,false);
}

function refreshPreferences() {
	blockUser();
	var state = $("#stateCode").val();
	var lob = $("#lob").val();
	var product = "";
	if($('#div_PA_product').hasClass('hidden')){
		product = $("#Cauto_product").val();
	}else if($('#div_Cauto_product').hasClass('hidden')){
		product = $("#PA_product").val();
	}
	
	document.aiForm.action = "/aiui/preferences/fetchPreferences?stateDD="+state+"&lobDD="+lob+"&productDD="+product;
	document.aiForm.submit();
}

function setCoveragesPA(strElement){
	if (strElement.val() != '' && strElement.val() == 'Combined Package'){
		$("#MB").addClass('hidden');
		$("#ILB").addClass('hidden');
		$("#ADB").addClass('hidden');
		$("#FEB").addClass('hidden');
		$("#CFPB").removeClass('hidden');
		
		$('#MB').closest('tr').hide();
		$('#ILB').closest('tr').hide();
		$('#ADB').closest('tr').hide();
		$('#FEB').closest('tr').hide();
		$("#CFPB").closest('tr').show();
	} else if(strElement.val() != '' && strElement.val() == 'Individual Selections'){
		$("#MB").removeClass('hidden');
		$("#ILB").removeClass('hidden');
		$("#ADB").removeClass('hidden');
		$("#FEB").removeClass('hidden');
		$("#CFPB").addClass('hidden');
		
		$('#MB').closest('tr').show();
		$('#ILB').closest('tr').show();
		$('#ADB').closest('tr').show();
		$('#FEB').closest('tr').show();
		$('#CFPB').closest('tr').hide();
	} else {
		$("#MB").addClass('hidden');
		$("#ILB").addClass('hidden');
		$("#ADB").addClass('hidden');
		$("#FEB").addClass('hidden');
		$("#CFPB").addClass('hidden');
		
		$('#MB').closest('tr').hide();
		$('#ILB').closest('tr').hide();
		$('#ADB').closest('tr').hide();
		$('#FEB').closest('tr').hide();
		$("#CFPB").closest('tr').hide();
	}	
}
