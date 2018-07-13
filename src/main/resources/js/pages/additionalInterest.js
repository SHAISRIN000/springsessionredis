function editInsurableInterestForRmvResponse(iiID, lookupResults) {
	
	var vehIndex = iiID.substring('editInsurableInterest_'.length);
	$("#iiVehIndex").val(vehIndex);
	$("#iiVehicleId").html(getVehicleHeader(vehIndex));
	var leasedEnities = lookupResults.addlnInterestList.length;
	$("#iiCount").val($("#additionalInterests_" + vehIndex + "_aiCount").val());
	resetInsurableInterest(vehIndex);
	if(lookupResults.addlnInterestList){
		var leasedEnities = lookupResults.addlnInterestList.length;
		for(i=0;i<leasedEnities;i++){
			$("#iiIndex").val(i);
			//$('div#interestErrormessage').empty();
			clearValidationErrors();
			$("#iiTitleType").html("");
			$("#iiTypeCd").val("LC/Unseg Bus");
			//$("#iiTypeCd").trigger('changeSelectBoxIt');
			$("#iiTypeCd").trigger('chosen:updated');
			
			$("#iiTitleName").html("");
			
			$("#iiName1").val(lookupResults.addlnInterestList[i].name1);

			$("#iiName2").val("");

			$("#iiAddress1").val(lookupResults.addlnInterestList[i].address.addrLine1Txt);
			$("#iiAddress2").val("");

			//53197-New Business – Leased Vehicle Yes/No should be defaulted based on RMV returned data.  
			var zipCd = lookupResults.addlnInterestList[i].address.zip;
			if(zipCd != null && zipCd!=undefined && zipCd.length>1 && zipCd.length!=5){
				zipCd = zipCd.substring(0,5);
			}
			$("#iiZip").val(zipCd);
			$("#iiCity").val(lookupResults.addlnInterestList[i].address.cityName);
			$("#iiState").val(lookupResults.addlnInterestList[i].address.stateCd).trigger('chosen:updated');
			$("#iiFid").val(lookupResults.addlnInterestList[i].fid);
			//$("#iiLoanNumber").val("121");
			saveInsurableInterest(true,true,'');
			//53197-New Business – Leased Vehicle Yes/No should be defaulted based on RMV returned data.
			//update the hidden field you just added for Addresses
			updateOnRmvCall(vehIndex,i);
			
		}
	}
	
}

function editInsurableInterest(iiID) {
	
	var vehIndex = iiID.substring('editInsurableInterest_'.length);

	$("#iiVehIndex").val(vehIndex);
	$("#iiVehicleId").html(getVehicleHeader(vehIndex));
	
	$("#iiCount").val($("#additionalInterests_" + vehIndex + "_aiCount").val());
	
	resetInsurableInterest(0);
	//$('div#interestErrormessage').empty();
	clearValidationErrors();
	$('#insurableInterestDlg').modal('show').data("opener",iiID);
	initializeMustFillElementsforAddInt();
		
	setFocus('iiTypeCd');
	
	//50955 - fix pack 2
	if ($('#readOnlyMode').val() == 'Yes' ) {
		$('#deleteInsurableInterestPop').addClass('hidden');
	}
	
}

function resetInsurableInterest(iiIndex) {
	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	
	$("#iiIndex").val(iiIndex);
	clearValidationErrors();
	if (iiCount == 0 || iiIndex >= iiCount) {
		//53197-New Business – Leased Vehicle Yes/No should be defaulted based on RMV returned data. 
		// On two leased vehicle Leased default should have been ‘Yes’ but returned ‘No’
		$("#iiTitleType").html("");
		$("#iiTypeCd").val("");
		//$("#iiTypeCd").trigger('changeSelectBoxIt');
		$("#iiTypeCd").trigger('chosen:updated');
		
		$("#iiTitleName").html("");
		$("#iiName1").val("");
	
		$("#iiName2").val("");
	
		$("#iiAddress1").val("");
		$("#iiAddress2").val("");
	
		$("#iiZip").val("");
		$("#iiCity").val("");
		$("#iiState").val("").trigger('chosen:updated');
	
		$("#iiFid").val("");
		$("#iiLoanNumber").val("");
		
	} else {
		var type = $("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiType").val();
		if(type == 'LH/Unseg Bus'){
			type = 'LN/Unseg Bus';
		}
		$("#iiTitleType").html('Type:' + type);
		$("#iiTypeCd").val(type);
		//$("#iiTypeCd").trigger('changeSelectBoxIt');
		$("#iiTypeCd").trigger('chosen:updated');
		
		var name1 = $("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName1").val();
		$("#iiTitleName").html(name1);
		$("#iiName1").val(name1);
	
		$("#iiName2").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName2").val());
	
		$("#iiAddress1").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress1").val());
		$("#iiAddress2").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress2").val());
	
		$("#iiZip").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiZip").val());
		$("#iiCity").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiCity").val());
		$("#iiState").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiState").val()).trigger('chosen:updated');
	
		$("#iiFid").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiFid").val());
		$("#iiLoanNumber").val($("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiLoanNumber").val());
	}
}

function openInsurableInterest() {
	
	var button = $(":button:contains('Save')");
	if (! button.hasClass('SubmitButton')) {
		button.addClass('SubmitButton');
	}
	button = $(":button:contains('Cancel')");
	if (! button.hasClass('SubmitTertiaryButton')) {
		button.addClass('SubmitTertiaryButton');
	}
}

function scrollIILeft(prefix) {
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	
	if (iiCount > 1 && iiIndex > 0) {
		saveInsurableInterest(false, false,prefix);
		
		resetInsurableInterest(iiIndex - 1);
	}
}

function scrollIIRight(prefix) {
	
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	if (iiCount > 1 && iiIndex < iiCount - 1) {
		saveInsurableInterest(false, false,prefix);
		
		resetInsurableInterest(iiIndex + 1);
	}
}

function validateDuplicateAddresses(){
	
	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	var idPrefix = '#additionalInterests_' + vehIndex + '_';
	
	var newType = $("#iiTypeCd").val();
	var newName1=$("#iiName1").val();
	var newName2=$("#iiName2").val();
	var newAddress1=$("#iiAddress1").val();
	var newAddress2=$("#iiAddress2").val();
	//var newCity=$("#iiCity").val();
	//var newState= $("#iiState").val();
	var newZip=$("#iiZip").val();
	
	for(var addressIndex=0;addressIndex < iiCount;addressIndex++){
		//Skip this validation if the current record being edited is same as the one being saved
		if(iiIndex == addressIndex ){
			//Same as the one being validated
			continue;
		}
		var rowIDPrefix = idPrefix+addressIndex+"_";
		//If type of financical is same then check for address else check if both name and address are same
		if(newType == $(rowIDPrefix+"aiType").val()){
			
			if( newZip === $(rowIDPrefix+"aiZip").val()
					&& newAddress1 === $(rowIDPrefix+"aiAddress1").val() 
					&& newAddress2 === $(rowIDPrefix+"aiAddress2").val() ){
				return false;			
			}
			
		} else {
			//financial Type isn't equal
			if( newZip === $(rowIDPrefix+"aiZip").val()
					&& newAddress1 === $(rowIDPrefix+"aiAddress1").val() 
					&& newAddress2 === $(rowIDPrefix+"aiAddress2").val() 
					&& newName1 == $(rowIDPrefix+"aiName1").val()
					&& newName2 == $(rowIDPrefix+"aiName2").val()){
				// The new address isn't valid
				return false;			
			}
		}
	}
	return true;
}

function saveInsurableInterest(closeDialog, addNew, prefix) {
	
	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
    var iiCountTemp=0;
   
	var dataSection = $("#additionalInterestsData_" + vehIndex);

	var typeStr = $("#iiTypeCd").val();
	if (typeStr == null) {
		typeStr = '';
	}
	//var title = typeStr + '-' + $("#iiName1").val();
	var title = $("#iiName1").val();
	if($("#iiName1").val()!=''){
		if (iiIndex >= iiCount) {
			// Add a new one
			$("#additionalInterests_" + vehIndex + "_aiCount").val(iiCount + 1);
			$("#iiCount").val(iiCount + 1);
            
			var newRow = '<span class="aiTitle">' + title + '</span>'
			 + '<input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiId" type="hidden" value="" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].additionalInterestId"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiType" type="hidden" value="' + $("#iiTypeCd").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].additionalInterestType"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiName1" type="hidden" value="' + $("#iiName1").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].name1"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiName2" type="hidden" value="' + $("#iiName2").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].name2"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiAddress1" type="hidden" value="' + $("#iiAddress1").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].address.addrLine1Txt"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiAddress2" type="hidden" value="' + $("#iiAddress2").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].address.addrLine2Txt"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiZip" type="hidden" value="' + $("#iiZip").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].address.zip"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiCity" type="hidden" value="' + $("#iiCity").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].address.cityName"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiState" type="hidden" value="' + $("#iiState").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].address.stateCd"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiFid" type="hidden" value="' + $("#iiFid").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].fid"><input id="additionalInterests_' + vehIndex + '_' + iiIndex + '_aiLoanNumber" type="hidden" value="' + $("#iiLoanNumber").val() + '" name="'+prefix+'vehicles[' + vehIndex + '].additionalInterests[' + iiIndex
			 + '].loanNumber">';
			
			if (iiCount == 0) {
				resetInsurableInterestEditLink(vehIndex, 1, newRow, prefix);
			} else {
				var row = $('tr:last', dataSection);
				row.before(row.outerHTML());
				$('td:first', row).html(newRow);
				
				var prevRow = $('tr', dataSection).eq(-2);
				var col = $('td:last', prevRow);
				col.html('');
			}
		} else {
			// Update an existing one		
			var titleElement = $('tr:eq(' + iiIndex + ') .aiTitle', dataSection);
			titleElement.html(title);
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiType").val($("#iiTypeCd").val());
			
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName1").val($("#iiName1").val());
		
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName2").val($("#iiName2").val());
		
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress1").val($("#iiAddress1").val());
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress2").val($("#iiAddress2").val());
		
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiZip").val($("#iiZip").val());
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiCity").val($("#iiCity").val());
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiState").val($("#iiState").val());
		
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiFid").val($("#iiFid").val());
			$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiLoanNumber").val($("#iiLoanNumber").val());
		}
	}
	if (closeDialog) {
		if(prefix == 'policyWrapper.') {
			showClearInLineErrorMsgsWithMap('vehicleLeasedInd_'+vehIndex, "", $('#defaultVehicleMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
		} 
		$("#insurableInterestDlg").modal('hide');
	} else if (addNew) {
		resetInsurableInterest(parseInt($("#iiCount").val()));		
	}
	
	
	alignRows();
}

//In App layer if you dont edit the FI's then it would not save
function updateOnRmvCall(vehIndex,iiIndex){
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiType").val($("#iiTypeCd").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName1").val($("#iiName1").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName2").val($("#iiName2").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress1").val($("#iiAddress1").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiAddress2").val($("#iiAddress2").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiZip").val($("#iiZip").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiCity").val($("#iiCity").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiState").val($("#iiState").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiFid").val($("#iiFid").val());
	$("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiLoanNumber").val($("#iiLoanNumber").val());
}


function cancelInsurableInterest() {
	
	$("#insurableInterestDlg").modal('hide');
}

function deleteInsurableInterest(tabName) {
	
	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	var resetIndex = Math.max(Math.min(iiIndex, iiCount - 2), 0);
	
	var name1 = $("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiName1").val();
	$("#iiTitleName").html(name1);
	// Make sure we're not deleting a new, unsaved insurable interest
	if (iiIndex < iiCount) {
		if (iiCount == 1) {
			// We're deleting the only saved insurable interest
			recordDeletedInsurableInterest(vehIndex, iiIndex, tabName);
			
			resetInsurableInterestEditLink(vehIndex, 0, "", '');
		} else if (iiIndex == iiCount - 1) {
			// We're deleting the last saved insurable interest
			recordDeletedInsurableInterest(vehIndex, iiIndex, tabName);
			
			var rows = $("#additionalInterestsData_" + vehIndex + " tr");
			var nextToLast = rows.eq(-2);
			$("td:first", rows.eq(-1)).html($("td:first", nextToLast).html());
			nextToLast.remove();
		} else {
			// Handle deleting any other insurable interest
			recordDeletedInsurableInterest(vehIndex, iiIndex, tabName);
			
			// Decrement the index on all rows after the deleted insurable interest
			$("#additionalInterestsData_" + vehIndex + " tr:gt(" + iiIndex + ")").each( function() {
				var col = $("td:first", this);
				var colHTML = col.html();
				var regex = new RegExp("_" + vehIndex + "_[0123456789]", "g");
				var matches = regex.exec(colHTML);
				
				if (matches != null && matches.length > 0) {
					var index = getVehicleIndex(matches[0]);
					
					colHTML = colHTML.replace(regex, "_" + vehIndex + "_" + (index - 1));
					var line1 = "additionalInterests[" +index + "]";
					var line2 = "additionalInterests[" +(index-1)+ "]";
					var newcolHTML =  colHTML.replaceAll(line1, line2);
					col.html(newcolHTML);
				}
				
			});
			
			var deleteRow = $("#additionalInterestsData_" + vehIndex + " tr").eq(iiIndex);
			deleteRow.remove();
		}
		
		$("#additionalInterests_" + vehIndex + "_aiCount").val(iiCount - 1);
		$("#iiCount").val(iiCount - 1);
	}
	
	resetInsurableInterest(resetIndex);
}

function resetInsurableInterestEditLink(vehIndex, count, rowHTML, prefix) {

	var dataSection = $("#additionalInterestsData_" + vehIndex);
	var col = $('tr:last td:first', dataSection);
	col.html(rowHTML);
	var editSpan = $('.editInsurableInterest span', dataSection);
	if (count == 0) {
		editSpan.html('+ Financial Interest');		
		
		if ($('#cancelII').length) {
        	$('#cancelII').click();
        }
		
	} else {
		editSpan.html('edit');
		if(prefix == 'policyWrapper.'){
		showClearInLineErrorMsgsWithMap('additionalInterestsData_'+vehIndex, "", $('#defaultVehicleMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
		}
		else{
			showClearInLineErrorMsgsWithMap('additionalInterestsData_'+vehIndex, "", $('#defaultMulti').outerHTML(),vehIndex, errorMessages, addRemoveVehicleRow);
		}
	}
}

function recordDeletedInsurableInterest(vehIndex, iiIndex, tabName) {
	var id = $("#additionalInterests_" + vehIndex + "_" + iiIndex + "_aiId").val();
	
	// If it has an id, then record that we deleted it
	if (id != null && id.length > 0 && ! "0" != id) {
		recordFinancialInterestDeletion(id, tabName);
	}
}

function recordFinancialInterestDeletion(deletedId, tabName) {
	
	if (deletedId != "") {
		var vehicleVars;
		var prefix='';
		if('application' == tabName){
			vehicleVars = $('#hiddenApplicationVariables');
			prefix='policyWrapper.';
		}else{
			vehicleVars = $('#hiddenVehicleVariables');
		}
		
		var deletedItems = $('.deletedAdditionalInterest', vehicleVars);
		if (deletedItems.length == 0) {
			vehicleVars.append('<input id="deletedAdditionalInterest_0" class="deletedAdditionalInterest" type="hidden" value="" name="'+prefix+'deletedAdditionalInterests[0]">');
		} else {
			vehicleVars.append($(deletedItems[0]).replaceIndices(deletedItems.length));
		}
		
		deletedItems = $('.deletedAdditionalInterest:last', vehicleVars);			
		deletedItems.val('' + deletedId);	
	}
}

function validateInsurableInterest(prefix){
	$(document).on("click", "#saveIIAndNew", function(){
		var vehIndex = $('#iiVehIndex').val();
		var vehicleleased = $('#vehicleLeasedInd_' + vehIndex).val();
		var vehLoanLeased = $('#loanLeaseGap_'+vehIndex).val();
		var typeCd = $("#iiTypeCd").val(); 
		var isAddressError = validateFinancialAddress(typeCd, $("#iiName1").val(), $("#iiName2").val(), $("#iiZip").val(), $("#iiAddress1").val(), $("#iiCity").val(), $("#iiState").val());
		var isTypeDupeError = validateTypeDupe(typeCd, prefix);
		if(isAddressError || isTypeDupeError){
			return;
		}
		
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);		
		var leasedVehExists = checkIfLeasedVehiclesExists();
		
		if(vehicleleased == 'No' && typeCd == 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("'Leasing Company' Ins Int Type requires the vehicle to be leased.");
			 return;
		} else if(vehicleleased == 'Yes' && !leasedVehExists && typeCd != 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("For leased vehicle, please select 'Leasing Company'");
			 return;
		}else if(vehLoanLeased == 'Yes' && typeCd != 'LC/Unseg Bus' && typeCd != 'LN/Unseg Bus' && typeCd != 'AI/Unseg Bus') {
			$('div#interestErrormessage').text("Vehicle has Loan/Lease Gap selected, requires a Lienholder or Leasing company Ins Interest.");
			 return;
		}
		else {
			clearValidationErrors();
			//$('div#interestErrormessage').empty();
			saveInsurableInterest(false, true, prefix);
		}
	});
	$(document).on("click", "#saveIIAndClose", function(){
		var vehIndex = $('#iiVehIndex').val();
		var iiIndex = $('#iiIndex').val();
		var vehicleleased = $('#vehicleLeasedInd_' + vehIndex).val();
		var vehLoanLeased = $('#loanLeaseGap_'+vehIndex).val();
		var typeCd =  $("#iiTypeCd").val();
		
		var isAddressError = validateFinancialAddress(typeCd, $("#iiName1").val(), $("#iiName2").val(), $("#iiZip").val(), $("#iiAddress1").val(), $("#iiCity").val(), $("#iiState").val());
		var isTypeDupeError = validateTypeDupe(typeCd, prefix);
		if(isAddressError || isTypeDupeError){
			return;
		}
			
		var originalPremAmt = $('#premAmt').val();
		var ratedIndicator =  $('#ratedInd').val();
		resetPremium(ratedIndicator,originalPremAmt);	
		var leasedVehExists = checkIfLeasedVehiclesExists();
		
		if(vehicleleased == 'No' && typeCd == 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("'Leasing Company' Ins Int Type requires the vehicle to be leased.");
			 return;
		} else if(vehicleleased == 'Yes'  && !leasedVehExists && typeCd != 'LC/Unseg Bus') {
			$('div#interestErrormessage').text("For leased vehicle, please select 'Leasing Company'");
			 return;
		}else if(vehLoanLeased == 'Yes' && typeCd != 'LC/Unseg Bus' && typeCd != 'LN/Unseg Bus' && typeCd != 'AI/Unseg Bus') {
			$('div#interestErrormessage').text("Vehicle has Loan/Lease Gap selected, requires a Lienholder or Leasing company Ins Interest.");
			 return;
		}else {
			//$('div#interestErrormessage').empty();
			clearValidationErrors();
			saveInsurableInterest(true, false,prefix);
		}
	});
}

function checkIfLeasedVehiclesExists(){

	var newTypeCd = $("#iiTypeCd").val(); 
	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	var isExists = false;
	if(iiCount == '0' || iiCount == '1'){
		return isExists;
	}
	
	for (var i=0;i<iiCount;i++)
	{		
		if(i!=iiIndex){
			var savedTypeCd = $("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val();
			if(savedTypeCd == 'LC/Unseg Bus'){
				isExists = true;
				break;
			}
		}
	}
	
	if(newTypeCd == 'LC/Unseg Bus'){
		isExists = true;
	}
	
	return isExists;
}

function clearValidationErrors(){
	$('div#interestErrormessage').empty();
	$('div#nameErrormessage').empty();
	$('div#zipErrormessage').empty();
	$('div#cityErrormessage').empty();
	$('div#stateErrormessage').empty();
	$('div#addressErrormessage').empty();
	$('div#duplicatenameErrormessage').empty();
}

function validateFinancialAddress(typeCd, name1, name2, zip, address, city, state){
	
	var isError = false;
	if(typeCd == ''){
		$('div#interestErrormessage').text("Type is required.");
		isError = true;
	}
	
	if(name1 == ''){
		$('div#nameErrormessage').text("Name is required.");
		isError = true;
	}
	
	//TD#72949 Additional Interest same name (data) in Name1 and Name 2 causing issuance failures.
	if(name1.toLowerCase() === name2.toLowerCase()){
		$('div#duplicatenameErrormessage').text("Vehicle cannot have the same name for additional interest 1 & 2.  Update additional interest name 1 or 2. ");
		isError = true;
	}
	
	if(zip == ''){
		$('div#zipErrormessage').text("A numeric 5 digit Zip value is required.");
		isError = true;
	}else if(!($.isNumeric(zip)) || zip.length < 5 || zip.length > 5){
		$('div#zipErrormessage').text("A numeric 5 digit Zip value is required.");
		isError = true;
	}
	
	if(address == ''){
		$('div#addressErrormessage').text("Address is required");
		isError = true;
	}
	
	if(city == ''){
		$('div#cityErrormessage').text("City is required");
		isError = true;
	}
	
	if(state == ''){
		$('div#stateErrormessage').text("State is required");
		isError = true;
	}
	
	//Validate duplicate user & Address
	if(!validateDuplicateAddresses()){
		$('div#interestErrormessage').text("Insured individual already added");
		isError = true;
	}
	
	return isError;
}

//prefix is used to validate application and vehicle tab both
function validateTypeDupe(newTypeCd, prefix){

	var vehIndex = parseInt($("#iiVehIndex").val());
	var iiCount = parseInt($("#iiCount").val());
	var iiIndex = parseInt($("#iiIndex").val());
	
	var lcValue = '';
	var lnValue = '';
	
	var isError = false;
	if(iiCount == '0'){
		return isError;
	}
	
	var typeArray = [newTypeCd];
	for (var i=0;i<iiCount;i++)
	{		
		if(i!=iiIndex){
			typeArray[typeArray.length] = $("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val();
			if($("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val() == 'LC/Unseg Bus'){
				lcValue = $("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val();
			}else if($("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val() == 'LN/Unseg Bus'){
				lnValue = $("#additionalInterests_"+vehIndex+"_"+i+"_aiType").val();
			}
		}
	}
	
	if(newTypeCd == 'LC/Unseg Bus'){
		lcValue = newTypeCd;
	}else if(newTypeCd == 'LN/Unseg Bus'){
		lnValue = newTypeCd;
	}
	
	if(lcValue != '' && lnValue != ''){
		$('div#interestErrormessage').text("Vehicle cannot have both Leinholder and Leasing Company defined as insurable interests");
		isError = true;
	}
	
	return isError;
}

function initializeMustFillElementsforAddInt(){
	
	removeHighlightedClass($('#iiName1'),'N');
	removeHighlightedClass($('#iiAddress1'),'N');
	removeHighlightedClass($('#iiZip'),'N');
	removeHighlightedClass($('#iiCity'),'N');
	bindFocusEventsToMandatoryElements($('#iiName1'),'Y');
	bindFocusEventsToMandatoryElements($('#iiAddress1'),'Y');
	bindFocusEventsToMandatoryElements($('#iiZip'),'Y');
	bindFocusEventsToMandatoryElements($('#iiCity'),'Y');
}

function bindFocusEventsToMandatoryElements(element){
	$( element ).focus(function() {
		removeHighlightedClass(element,'Y');
	});
}

function removeHighlightedClass(element,focus){
	
	if('Y'== focus && $(element).hasClass('preRequired')){
		$(element).removeClass('preRequired');
		return;
	}
	if ($(element).val() != '' && $(element).hasClass('preRequired')) {
		$(element).removeClass('preRequired');
	} 
}
