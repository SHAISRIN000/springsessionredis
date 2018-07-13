jQuery(document).ready(	function() { logToDb("prefill.js: 1 - Entering jQuery(document).ready function"); // TODO Add Ajax call here.
			var checked;
			var showPrefillWindow = $('#showPrefillWindow').val();			
			
			$('#prefillDialog').modal('hide');
			if($('#newDriver').length == 1) {
	    		$('#prefillDialog').css('left', ($('#newDriver').offset().left - 76) + 'px');
	    	} else if ($('#newVehicle').length == 1) {
	    		$('#prefillDialog').css('left', ($('#newVehicle').offset().left - 76) + 'px');
	    	} else {
	    		$('#prefillDialog').css('left', '25%');
	    	}
			window.onresize = function(e) {
			    $('#prefillDialog').css('margin-left', 'auto');
			    $('#prefillDialog').css('left', 'auto');
			    if( $(window).width() >= 0.9 * screen.width) {
			    	if($('#newDriver').length == 1) {
			    		$('#prefillDialog').css('left', ($('#newDriver').offset().left - 45) + 'px');
			    	} else if ($('#newVehicle').length == 1) {
			    		$('#prefillDialog').css('left', ($('#newVehicle').offset().left - 45) + 'px');
			    	} else {
			    		$('#prefillDialog').css('left', '25%');
			    	}
			    }
			};
			
			// Modal resize behavior
			$(document).on("resize", "#prefillDialog", function (e) {
				$('table.prefillFormTab').width($(this).find('.prefillSections').width());
		    }); 

			$('.savePrefill').click(function() {				
				
				if ( getMaxDriversAddingCount() > 10 ) {
					confirmModalMessageWithTitle("","A policy can have a maximum of 10 drivers");
				} else if (getMaxVehiclesAddingCount() > 10 ) {
					confirmModalMessageWithTitle("","A policy can have a maximum of 10 vehicles");				
				} else {
					// the below functions always returns true. so disable it to avoid double click on apply.
					$("body").css("cursor", "progress");					
					$('#prefill').attr("disabled", "disabled");
					
					$(".vehicleDeleteCheckBox").each(function() {
						 var itemChecked = $(this).prop('checked');
						 	if (itemChecked) {
	                        	blnDataChanged = true;
	                        }
 					});
					
					$(".driverDeleteCheckBox").each(function() {
						 var itemChecked = $(this).prop('checked');
						 	if (itemChecked) {
	                        	blnDataChanged = true;
	                        }
					});
					
					if ( (setDriverThirdPartyDataIds())	
					&&   (setVehicleThirdPartyDataIds()) 
					&&   (setCurrentCarrierDataIds()) ) {
						
						//To reset premium
						if (blnDataChanged) {
							if ( $("#policyPremAmt").val() != "" && $("#policyPremAmt").val() != "0" ) {
								$.ajaxSetup({async:false});
								resetPremiumForAll();
								$.ajaxSetup({async:true});
							}
						}
						
						if (blnPrefillDrvrAdded && blnPrefillVehAdded) {
							$("#prefillAddedItems").val("drivers_vehicles");
						} else if (blnPrefillDrvrAdded) {
							$("#prefillAddedItems").val("drivers");
						} else if (blnPrefillVehAdded) {
							$("#prefillAddedItems").val("vehicles");
						}
						
						setMvrUpdatedIndicatorFromPrefill('savePrefill');
						
						document.aiPreFillForm.currentTab.value = document.aiForm.currentTab.value;
						nextTab('prefill', document.aiForm.currentTab.value);
					}
				}
			});
			
			$(".closePrefillModal").click(function(){
				$(".modal").modal('hide');				
				return false;
			});
			
			if (showPrefillWindow == 'true' ) {				
				// make sure to display prefill window on respective pages
				if (blnPrefillLinkContainedTab(document.aiForm.currentTab.value) 
						|| $('#showPrefillWindowAfterReconcilePopup').val()=='true') {					
					//check if prefill is successful with data
					//if (getPrefillCallStatus() == 'SuccessfulWithData') {
						$('#prefillDialog').modal('show');
						$('#prefillDialog').find('.prefillErrorMessage').text(showPrefillUnsuccessfulMessageIfApplicable());
						 
						//alert($("#prefillPoppedUpInd").val());
						if ( $("#prefillPoppedUpInd").val() != 'Yes' ) {
							// initiate ajax call to set prefillPoppedUp indicator.
							setPrefillPoppedUpIndicator();
						}
						
						initializePrefilldata();
						setMvrUpdatedIndicatorFromPrefill();
						//set tab index and focus			
						setTabIndexForPrefill();
						
						//42169 - Check box against agent vehicle on prefill screen will only be shown if there is either a YEAR or a MAKE or a MODEL or VIN on the vehicle page
						$('.agentVehicleThirdPartyDataId[value=""]').each(function(){
							var lastIndex = getIndexOfElementId_prefill(this);
							if($('#agentEnteredYear_'+lastIndex).val()==""
									&& $('#agentEnteredModel_'+lastIndex).val()==""
									&& $('#agentEnteredMake_'+lastIndex).val()==""
									&& $('#agentEnteredVin_'+lastIndex).val()==""){
								//$('#agentVehicleChkBox_'+lastIndex).hide();
								//Hide the row completely
								$(this).closest('tr').hide();
							}
						});
						
					/*
					} else {
						if (getPrefillCallStatus() == 'SuccessfulWithNoData') {
							confirmMessage('No data found for the primary named insured/residence address. Please review and correct if necessary.');
						} else {
							confirmMessage('Pre-fill vendor is currently down, please try again a bit later.');
						}
					}*/
				}
			}
			
			// Below are bind events 
			//bindSpanColors();
			bindSelectAllForAllAgentAndPrefillData();
			bindSelectAllForAllAgentAndPrefillDrivers();
			bindSelectAllForAllAgentAndPrefillVehicles();
			bindSelectAllForAllAgentAndPrefillCurrentCarr();		
			$('#reconcilePrefillClicked').val('');
			$('#prefillReorder').val('');
			// below commented as handling in common.js
			logToDb("prefill.js: 104 - Exiting jQuery(document).ready function"); //	disableOrEnableElementsForReadonlyQuote(); // TODO Add Ajax call here.
			
			//If tabbing inside the modal, When you reach the bottom of the Dialog,it should go back to the top of the dialog to the initial focus point.
			$("#closePrefill").keydown(function(e){
			    if(e.shiftKey == false && e.keyCode ==9) {
			    	$("#selectAllAgentData").focus();
			    	$('.prefill-modal-body').scrollTop(0);
			    	e.preventDefault();
			    }			    
			});
			initialFormLoadProcessing();
});


//if any agent side current carrier check box doesn't exist
var blnAgentCheckBoxExists = false;
var blnDataChanged = false;
var blnPrefillDrvrAdded = false;
var blnPrefillVehAdded = false;
var initialAgentCurrCarrCheckedCount = 0;
var initialPrefillCurrCarrCheckedCount = 0;

// complete hiding, showing, etc
//window.onload = initialFormLoadProcessing;

function initialFormLoadProcessing() {
	// alert("log");
}

//not needed: use anchor Pseudo:classes to get the style.
/*function bindSpanColors() {
	$(".anchor-highlight").focus(function(){
		   //your code here
		if ( ! $(this).hasClass("allData") ) {
			 $(this).addClass("dottedWhite");
		}
	});
	
	
	
	$(".anchor-highlight").blur(function(){
		   //your code here
		if ( ! $(this).hasClass("allData") ) {
			 $(this).removeClass("dottedWhite");
		}
	});
}*/

function bindSelectAllForAllAgentAndPrefillData() {
	$('#selectAllAgentData').click(function(){				
		checked = ($('.agentData').attr('checked') == 'checked') ? 'false': true;
		$('input.agentData:not(.hidden)').attr('checked',checked);
		//$('.prefillData').removeAttr("checked");
		$('input.prefillData:not(.clsUnMatchedSelectedPrefillData)').removeAttr("checked");		
		setDriverStatusCodes();
		reSetPrefillSideDriverStatusCodes();
		setVehicleStatusCodes();	
		reSetPrefillVehicleStatusCodes();
		enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);		
	});
	
	$('#selectAllPrefillData').click(function(){
		checked = ($('.prefillData').attr('checked') == 'checked') ? 'false': true;			
		// Don't forcibly check corresponding disabled prefill driver since RMV lookup successful for matched agent driver.
		//$('.prefillData').attr('checked',checked);
		$('.prefillData:not(.clsMatchedAgentDriverRmvLookedUp)').attr('checked',checked);
		
		//Don't remove check for unmatched agent driver and  matched disabled checked agent driver(RMV lookup successful)
		$('input.agentData:not(.clsUnMatchedAgentData, .clsMatchedAgentDriverRmvLookedUp)').removeAttr("checked");		
		setDriverStatusCodes ();
		setVehicleStatusCodes();
		setOrResetBGColorForAllCurrCarrElms();
		enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);		
	});
}

function bindSelectAllForAllAgentAndPrefillDrivers() {
	$('#selectAllAgentDrivers').click(function(){
		checked = ($('.agentDrivers').attr('checked') == 'checked') ? 'false': true;		
		$('input.agentDrivers:not(.hidden)').attr('checked',checked);
		//$('.prefillDrivers').removeAttr("checked");
		$('input.prefillDrivers:not(.clsUnMatchedSelectedPrefillData)').removeAttr("checked");			
		setDriverStatusCodes ();	
		reSetPrefillSideDriverStatusCodes();		
	});
	
	$('#selectAllPrefillDrivers').click(function() {
		checked = ($('.prefillDrivers').attr('checked') == 'checked') ? 'false': true;		
		// Don't forcibly check corresponding disabled prefill driver since RMV lookup successful for matched agent driver.
		//$('input.prefillDrivers').attr('checked',checked);
		$('input.prefillDrivers:not(.clsMatchedAgentDriverRmvLookedUp)').attr('checked',checked);
		
		//Don't remove check for unmatched agent driver and  matched disabled checked agent driver(RMV lookup successful)
		$('input.agentDrivers:not(.clsUnMatchedAgentData, .clsMatchedAgentDriverRmvLookedUp)').removeAttr("checked");		
		setDriverStatusCodes ();				
	});
}

function bindSelectAllForAllAgentAndPrefillVehicles() {
	$('#selectAllAgentVehicles').click(function() {
		checked = ($('.agentVehicles').attr('checked') == 'checked') ? 'false': true;
		//$(':checkbox').each(function(){
			//$('.agentVehicles').attr('checked',checked);
			$('input.agentVehicles:not(.hidden)').attr('checked',checked);
			//$('.prefillVehicles').removeAttr("checked");
			$('input.prefillVehicles:not(.clsUnMatchedSelectedPrefillData)').removeAttr("checked");
		//});
		setVehicleStatusCodes();	
		reSetPrefillVehicleStatusCodes();
	});			

	$('#selectAllPrefillVehicles').click(function() {
		checked = ($('.prefillVehicles').attr('checked') == 'checked') ? 'false': true;
		//$(':checkbox').each(function() {
			$('input.prefillVehicles').attr('checked',checked);
			$('input.agentVehicles:not(.clsUnMatchedAgentData)').removeAttr("checked");				
		//});
		setVehicleStatusCodes();		
	});
}

function bindSelectAllForAllAgentAndPrefillCurrentCarr() {
	$('#selectAllAgentCurrentCarrier').click(function() {
		checked = ($('.agentCurrentCarrier').attr('checked') == 'checked') ? 'false': true;		
		$('.agentCurrentCarrier').attr('checked',checked);
		$('.prefillCurrentCarrier').removeAttr("checked");	
		setVarIfCurrentCarrDataChanged('Agent');
		enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
		
	});			

	$('#selectAllPrefillCurrentCarrier').click(function() {
		checked = ($('.prefillCurrentCarrier').attr('checked') == 'checked') ? 'false': true;
		$('.prefillCurrentCarrier').attr('checked',checked);			
		$('input.agentCurrentCarrier:not(.clsUnMatchedAgentData)').removeAttr("checked");
		setVarIfCurrentCarrDataChanged('Prefill');
		enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
		setOrResetBGColorForAllCurrCarrElms();
	});
}

function blnPrefillLinkContainedTab(currentTab) {
	
	if (currentTab == "drivers" || currentTab == "vehicles" 
	|| currentTab == "details" || currentTab == "summary" ) {
		return true;
	} else {
		return false;
	}	
}

function initializePrefilldata(){
	
	initializeDrivers();
	
	InitializeVehicles();	
		
	initializeCurrentCarrier();	
	
	return true;
}

function initializeDrivers () {
	var lastIndex;
	var strTpDriverTPDataId;
	var strTPDriverChkBox;
	var strAgentDriverChkBox;
	var strAgentDriverId;
	
	// Loop thru agent side checkboxes 
	$('input.agentDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTpDriverTPDataId = getTpDriverTPDataId(lastIndex);
		strAgentDrvrRmvLookUpInd = $('#agentDriverRmvLookupInd_' + lastIndex).val();
		
		// if agent driver has a match with prefill driver
		if (strTpDriverTPDataId != null) {	
			strTPDriverChkBox = getTPDriverChkBox(lastIndex);
			// check matched agent driver by default if matched prefill driver is not checked
			if (strTPDriverChkBox !='checked') {
				$("#agentDriverChkBox_" + lastIndex).attr('checked','checked');
			}
			
			if ($('#agentDriverStatus_' + lastIndex).val() == "") {
				//default it as per usecase #1
				$('#agentDriverStatus_' + lastIndex).val("INS_POL");
				triggerPrefillChangeEvent($('#agentDriverStatus_' + lastIndex));
				//showClearInLineErrorRowMsgsPrefill(this.id, 'agentDriverStatus_' + lastIndex,  fieldIdToModelErrorRow['defaultSingle'], lastIndex);
			}
			
			// if agent driver rmv lookup is done/successful then  disable agent/prefill side driver checkboxes.
			// user doesn't have to select prefill again.
			if (strAgentDrvrRmvLookUpInd == 'Yes') {
				$("#agentDriverChkBox_" + lastIndex).attr("disabled", true);
				$("#tpDriverChkBox_" + lastIndex).attr("disabled", true);
				//add class that indicates matched agent driver Rmv looked up
				$('#agentDriverChkBox_' + lastIndex).addClass('clsMatchedAgentDriverRmvLookedUp');
				$('#tpDriverChkBox_' + lastIndex).addClass('clsMatchedAgentDriverRmvLookedUp');
				
				if ( isElementExisting('#agentDriverStatus_' + lastIndex) ){
					var isDisabled = $("#agentDriverStatus_" + lastIndex).is(':disabled');
					if (!isDisabled) {
						$("#agentDriverStatus_" + lastIndex).attr("disabled", true);
						$("#agentDriverStatus_" + lastIndex ).trigger('chosen:updated');
					}
				}
			}
		}
		else {
			// make checked & disable agent driver since it doesn't have corresponding prefill driver.  
			strAgentDriverChkBox = getAgentDriverChkBox(lastIndex);			
			if (strAgentDriverChkBox !='checked') {
				$("#agentDriverChkBox_" + lastIndex ).attr('checked','checked');
				$("#agentDriverChkBox_" + lastIndex ).attr("disabled", true);
				//add a class
				$("#agentDriverChkBox_" + lastIndex ).addClass("clsUnMatchedAgentData");
				
				// set default driver status for this unmatched agent driver
				if ($('#agentDriverStatus_' + lastIndex).val() == "") {
					$('#agentDriverStatus_' + lastIndex).val("INS_POL");
					triggerPrefillChangeEvent($('#agentDriverStatus_' + lastIndex));
				}
			} 
			else {
				if ($('#agentDriverStatus_' + lastIndex).val() == "") {
					showClearInLineErrorRowMsgsPrefill(this.id, 'agentDriverStatus_' + lastIndex,  fieldIdToModelErrorRow['defaultSingle'], lastIndex);
				}
			}
			
		}
			
	});
	
	// Loop thru prefill drivers checkboxes
	$('input.tpDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		
		if ( $('#readOnlyMode').val() != 'Yes' ) {
			if ($('#prefillDriverStatus_' + lastIndex).val() == ""){
				showClearInLineErrorRowMsgsPrefill(this.id, 'prefillDriverStatus_' + lastIndex,  fieldIdToModelErrorRow['defaultSingle'], lastIndex);
			}
		}
		// disable TP Driver checkbox if this TP(prefill) driver is already selected as agent driver 
		// and this agent thirdparty driver is hidden in corresponding agent driver cell.
		strTPDriverChkBox = getTPDriverChkBox(lastIndex);
		
		if (strTPDriverChkBox == 'checked') {
			if ($("#hdnAgentThirdPartyDriver_" + lastIndex).length > 0) {
				if ($("#hdnAgentThirdPartyDriver_" + lastIndex).val() == 'true') {
					$("#tpDriverChkBox_" + lastIndex ).attr("disabled", true);
					$("#tpDriverChkBox_" + lastIndex ).addClass("clsUnMatchedSelectedPrefillData");
				}
			}
		} else {
			// check if any agent side driver is there.. if not add a class prefill driver checkbox to track it.
			strAgentDriverId = getAgentDriverId(lastIndex);
			if (strAgentDriverId == null) {
				if ( isElementExisting('#prefillDriverStatus_' + lastIndex) && $('#prefillDriverStatus_' + lastIndex).val() == "" ) {
					$("#tpDriverChkBox_" + lastIndex ).addClass("clsUnMatchedNotSelectedPrefillData");					
				}
			}			
		}		
	});	
}

function InitializeVehicles() {
	var lastIndex;	
	var strTpVehicleTPDataId;
	var strTPVehicleChkBox;
	var strAgentVehicleChkBox;
	var agentVehicleId;
	
	//Loop thru all agent vehicle check boxes
	$('input.agentVehicleChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTpVehicleTPDataId = getTpVehicleTPDataId(lastIndex);
		
		// if agent vehicle has a match with prefill vehicle
		if (strTpVehicleTPDataId != null) {	
			strTPVehicleChkBox = getTPVehicleChkBox(lastIndex);
			// check matched agent vehicle by default if matched prefill vehicle is not checked
			if (strTPVehicleChkBox !='checked') 
				$("#agentVehicleChkBox_" + lastIndex ).attr('checked','checked');
		}
		else {
			// make checked & disable agent vehicle since it doesn't have corresponding prefill vehicle.  
			strAgentVehicleChkBox = getAgentVehcileChkBox(lastIndex);			
			if (strAgentVehicleChkBox !='checked') {
				$("#agentVehicleChkBox_" + lastIndex ).attr('checked','checked');
				$("#agentVehicleChkBox_" + lastIndex ).attr("disabled", true);
				$("#agentVehicleChkBox_" + lastIndex ).addClass("clsUnMatchedAgentData");
			} 
		}
			
	});
	
	// Loop thru prefill vehicles check boxes.	
	$('input.tpVehicleChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		if ( isElementExisting("#prefillSelectedRejectedStatusCd_" + lastIndex) && $('#prefillSelectedRejectedStatusCd_' + lastIndex).val() == "" ) {
			showClearInLineErrorRowMsgsPrefill(this.id,'prefillSelectedRejectedStatusCd_'+ lastIndex, fieldIdToModelErrorRow['defaultSingle'], lastIndex);
		}
		
		// disable TP vehicle checkbox if this TP(prefill) vehicle is already selected as agent vehicle 
		// and this agent thirdparty vehicle is hidden in corresponding agent cell.
		strTPVehicleChkBox = getTPVehicleChkBox(lastIndex);
		
		if (strTPVehicleChkBox == 'checked') {
			if (isElementExisting("#hdnAgentThirdPartyVehicle_" + lastIndex)) {
				if ($("#hdnAgentThirdPartyVehicle_" + lastIndex).val() == 'true') {
					$("#tpVehicleChkBox_" + lastIndex ).attr("disabled", true);		
					$("#tpVehicleChkBox_" + lastIndex ).addClass("clsUnMatchedSelectedPrefillData");
				}
			}
		} else {
			// check if any agent side vehicle is existing hidden/visible correspond to prefill.. if not add a class to track it.
			agentVehicleId = getAgentVehicleId(lastIndex);
			if (agentVehicleId == null) {
				if ( isElementExisting('#prefillSelectedRejectedStatusCd_' + lastIndex) && $('#prefillSelectedRejectedStatusCd_' + lastIndex).val() == "" ) {
					$("#tpVehicleChkBox_" + lastIndex ).addClass("clsUnMatchedNotSelectedPrefillData");					
				}
			}	
		}
		
		if (isElementExisting("#prefillSelectedRejectedStatusCd_" + lastIndex)) {
			if ($("#prefillSelectedRejectedStatusCd_" + lastIndex).val() == 'Rated Vehicle') {
				$("#prefillSelectedRejectedStatusCd_" + lastIndex ).attr("disabled", true);
				$("#prefillSelectedRejectedStatusCd_" + lastIndex ).trigger('chosen:updated');
			}
		}
		
	});
}

function initializeCurrentCarrier() {
	// current carrier section	
	// set agent side check boxes checked by default if both sides are present and both are unchecked 
	// or agent side existing with un-checked and prefill side even don't exist
	setAgentCurrCarrChecked("#agentActiveCurrentPolicySelInd", "#prefillActiveCurrentPolicySelInd", "NotApplicable");
	setAgentCurrCarrChecked("#agentNumYrsContinuousCoverageSelInd", "#prefillNumYrsContinuousCoverageSelInd", "#prefillNoCurrentAutoPolicyReasonCodeSelInd");	
	setAgentCurrCarrChecked("#agentNoCurrentAutoPolicyReasonCodeSelInd", "#prefillNoCurrentAutoPolicyReasonCodeSelInd", "#prefillNumYrsContinuousCoverageSelInd");	
	setAgentCurrCarrChecked("#agentPriorCarrierCodeSelInd", "#prefillPriorCarrierCodeSelInd", "NotApplicable");	
	setAgentCurrCarrChecked("#agentPriorCarrierBILimitsSelInd", "#prefillPriorCarrierBILimitsSelInd", "NotApplicable");
	
	//disable prefill side check boxes		
	if ($('input.agentCurrentCarrier').length > 0) {
		blnAgentCheckBoxExists = true;
	}	
	
	if ( !blnAgentCheckBoxExists ) {
		//loop thru prefill check boxes and disable if already checked
		$('input.prefillCurrentCarrier').each(function() {
			if ( $(this).is(":checked") ) {
				$(this).attr("disabled", true); 
				$(this).addClass('clsUnMatchedSelectedPrefillData');
			} else {
				//show yellow strip
				setBGColor(this);
			}
		});
	}
	
	//if agent & prefill side have different current auto policy inforces
	//clear left side agent boxes if right side current policy in force has saved checked value	
	if ( currentAutoPolInForcesAreDifferent() ) {	
		if ( isCheckBoxChecked("#prefillActiveCurrentPolicySelInd") ) { 
			// just make sure to clear all agent side checkboxes
			$('.agentCurrentCarrier').prop('checked', false);
		}
	}
	
	//if agent & prefill side have same 'No' current auto policy inforces
	//then disable agent side prior carrier code & prior bi limits if exists
	//as corresponding prefill side never exists these two.
	 enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(true);
	 
	 initialAgentCurrCarrCheckedCount = $('.agentCurrentCarrier:checked').length;
	 initialPrefillCurrCarrCheckedCount = $('.prefillCurrentCarrier:checked').length;		 
}


function setAgentCurrCarrChecked(strElm1, strElm2, strElm3) {
	if ( isElementExisting(strElm1) && isElementExisting(strElm2) ) {
		if (!isCheckBoxChecked(strElm1) && !isCheckBoxChecked(strElm2) ) {
			$(strElm1).attr('checked','checked');				
		}			
	} else if ( isElementExisting(strElm1) && isElementExisting(strElm3) ) {
		if (!isCheckBoxChecked(strElm1) && !isCheckBoxChecked(strElm3) ) {
			$(strElm1).attr('checked','checked');				
		} else {
			if (isCheckBoxChecked(strElm3)) {
				// if prefill side checkbox is checked then uncheck agent side
				$( strElm1).removeAttr("checked");						
			}
		}
	} else if ( isElementExisting(strElm1) ) {
		// if agent side single element exists
		if (!isCheckBoxChecked(strElm1)) {
			// if original field value is there then show as checked by default for proir carr code & bi limits
			// as these fields may not have corresponding prefil elements
			if (strElm1 == '#agentPriorCarrierCodeSelInd' || strElm1 == '#agentPriorCarrierBILimitsSelInd' )  {
				if (strElm1 == '#agentPriorCarrierCodeSelInd' && $("#agentPriorCarrierCode").val() != '' )  {
					$(strElm1).attr('checked','checked');
				} else if (strElm1 == '#agentPriorCarrierBILimitsSelInd' && $("#agentPriorCarrierBILimits").val() != '' )  {
					$(strElm1).attr('checked','checked');
				}
				
			} else {
				$(strElm1).attr('checked','checked');
			}
						
		}
	}
}

var fieldIdToModelErrorRow = 
{"defaultSingle":"<tr class=\"prefillFieldRow\" id=\"sampleErrorRow\"><td></td><td></td><td id=\"Error_Col\"></td></tr>"};

//created same like above to discard above later as same var name is being used by other .js files
var prefillFieldIdToModelErrorRow = 
{"defaultSingle":"<tr class=\"prefillFieldRow\" id=\"sampleErrorRow\"><td></td><td></td><td id=\"Error_Col\"></td></tr>"};

function showClearInLineErrorRowMsgsPrefill(strElementID, strErrorElementID, strErrorRow, columnIndex){
	var isAppRow = false;
	//var isPri = false;
	
	var strRowName = strElementID;
	if(isAppRow){
	 strRowName = name;
	}
	// Uses the table row definition passed in through strErrorRow.
	// This assumes there is a <td> in that definition with the name 'Error_Col'
	//sample calling code
	var strErrorMsg = 'Required Entry';
	if ( strErrorRow == null || strErrorRow == 'undefined') {
		strErrorRow = prefillFieldIdToModelErrorRow['defaultSingle'];
	}
	
	if (strErrorRow.length == 0){
		// if no error row return
		return;
	}
	
	$('#' + jq(strElementID)).each(function(){
		var dataRow = '';
				
		if ($("#prefillPoppedUpInd").val() =='Yes' ) {
				dataRow = $(this).parents("tr").first();
				var errorRowExists = false;
				$('#' + strRowName  + '_Error').each(function(){
					errorRowExists = true;
				});
				
				if (errorRowExists == false) {
					strErrorRow = strErrorRow.replace('sampleErrorRow', strRowName + '_Error');
					strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
					$(strErrorRow).insertAfter(dataRow);  //msg below
				}
				
				var strErrorColSelector = strRowName + '_Error_Col';
				$('#' + strErrorColSelector).empty();
				$('#' + strErrorColSelector).append(strErrorMsg);
				$('#' + strErrorColSelector).addClass('inlineErrorMsg');
				$('#' + strErrorElementID).addClass('inlineError');
				triggerPrefillChangeEvent($('#' + strErrorElementID));
		}
		else {
				dataRow = $(this).parents("tr").first();
				$(dataRow).find( "td:eq( 1 )" ).css("background-color", "#FFFFE0");
				$(dataRow).find( "td:eq( 2 )" ).css("background-color", "#FFFFE0");
				//dataRow.css("background-color", "#FFFFE0");
		}
	});

}

function setPrefillPoppedUpIndicator(){
	
	var policykeyId = $("#policyKey").val();
	if (policykeyId == '') {
		return;
	}
	
	$.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },        
         url: "/aiui/prefill/setPrefillPoppedUpIndicator",
        type: "post",
        dataType: 'json',
        data : JSON.stringify({ "policykeyId":policykeyId}),
        timeout: 2500,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){ logToDb("prefill.js: 570 - In success handler of url /aiui/prefill/setPrefillPoppedUpIndicator?policykeyId=" + policykeyId + " in setPrefillPoppedUpIndicator()");
          //do nothing
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){ logToDb("prefill.js: 574 - In error handler of url /aiui/prefill/setPrefillPoppedUpIndicator?policykeyId=" + policykeyId + " in setPrefillPoppedUpIndicator(). Response status = " + textStatus + " and error message = " + errorThrown); // TODO Add Ajax call here.
	       //do nothing	            
        },
        complete: function(){
        	//do nothing
        }
    });
}

function getIndexOfElementId_prefill(strElement) {
	var strId = $(strElement).attr('id');
	var n = strId.lastIndexOf('_');
	var lastIndx = strId.substring(n + 1);
	return lastIndx;
}

function setDriverThirdPartyDataIds() {
	var lastIndex;	
	var strAgentDriverId;
	var strTPDriverChkBox;
	var strDriverTPDataId;
	//var strDriverSeqID;
	//var strDriverStatusCd;
	var strAgentDriverChkBox;
	
	$('input.tpDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTPDriverChkBox = getTPDriverChkBox(lastIndex);
				
		if (strTPDriverChkBox == "checked") {			
			strAgentDriverId = getAgentDriverId(lastIndex);
			strDriverTPDataId = getDriverTPDataId(lastIndex);			
			
			// if matched agent driver presents left side for corresponding checked prefill driver...
			if (strAgentDriverId != null && trimSpaces(strAgentDriverId) != '') {
				// always assign TP DriverThirdpartyDataId to agent driver(matched)
				$("#agentDriverThirdPartyDataId_" + lastIndex).val(strDriverTPDataId);
				
				//always set Yes to agentChosenAsPrefillDriverInd to agent driver(matched)
				$("#agentChosenAsPrefillDriverInd_" + lastIndex).val("Yes");
				
				//means prefill driver is selected freshly
				if ( trimSpaces($("#ExistingAgentDriverThirdPartyDataId_" + lastIndex).val()) == '' 
				|| trimSpaces($("#ExistingAgentDriverThirdPartyDataId_" + lastIndex).val()) != strDriverTPDataId
				) {
					blnDataChanged = true;
					// set ind means matched prefill driver is seleted freshly
					$("#agentMatchedPrefillDrvrNewlySelectedInd_" + lastIndex).val("Yes");
				}
				
				// set license state with prefill selected license state always if it is empty.
				// or set(even overwrite) if agent matched prefill side driver is selected freshly
				var licStateCd = getLicStateCode(lastIndex);
				if( trimSpaces(licStateCd) == ''){
					licStateCd = $('#stateCd').val();
				}	
				
				if ( trimSpaces($("#agentDriverLicStateCd_" + lastIndex).val()) == '') {					
					$("#agentDriverLicStateCd_" + lastIndex).val(licStateCd);
				} else {
					if ( trimSpaces($("#ExistingAgentDriverThirdPartyDataId_" + lastIndex).val()) == '' ) {
						$("#agentDriverLicStateCd_" + lastIndex).val(licStateCd);
					}
				}
				
				//set lic number from prefill driver 				
				$("#agentDriverLicenseNumber_" + lastIndex).val(trimSpaces($("#tplicenseNumber_" + lastIndex).val()));
				
				//set first name from prefill driver 
				$("#agentDriverFirstName_" + lastIndex).val(trimSpaces($("#tpfirstName_" + lastIndex).val()));
				
				//set mid name from prefill driver 
				$("#agentDriverMiddleName_" + lastIndex).val(trimSpaces($("#tpmiddleName_" + lastIndex).val()));
				
				//set last name from prefill driver 
				$("#agentDriverLastName_" + lastIndex).val(trimSpaces($("#tplastName_" + lastIndex).val()));
				
				//set dob from prefill driver 
				$("#agentDriverBirthDate_" + lastIndex).val(trimSpaces($("#tpbirthDate_" + lastIndex).val()));
				
				
				//set default license status code if it is empty.
				// or set(even overwrite) if agent matched prefill side driver is selected freshly
				if ( trimSpaces($("#agentDriverLicenseStatusCd_" + lastIndex).val()) == ''
				|| trimSpaces($("#agentMatchedPrefillDrvrNewlySelectedInd_" + lastIndex).val()) == 'Yes' ) {
					$("#agentDriverLicenseStatusCd_" + lastIndex).val(getLicStatusCdForDrvrStatus(lastIndex));
				} 
			}
			else {
				// else agent driver is null and prefill driver is picked(To add as agent driver).
				// so create a new agent driver from prefill selected driver.
				createNewAgentDriver(lastIndex);
			}
		} 
		else {
			
			// before clearing in the next statement check if a value is there..
			if ( $("#agentDriverThirdPartyDataId_" + lastIndex).val() != null 
			&& $("#agentDriverThirdPartyDataId_" + lastIndex).val() != '' ) {
				blnDataChanged = true;
			}
			
			// clear agent DriverThirdPartyDataId. 
			// Note: Don't clear agentChosenAsPrefillDriverInd as it should stay forever
			$("#agentDriverThirdPartyDataId_" + lastIndex).val(null);	
		}
		
		// set matched agent driver id for each TP prefill driver
		// if any matched agent driver exists otherwise null
		strAgentDriverId = getAgentDriverId(lastIndex);
		$("#tpMatchedAgentDriverId_" + lastIndex).val(strAgentDriverId);
		
	});
	
	// loop thru agent drivers
	$('input.agentDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);		
		strAgentDriverChkBox = getAgentDriverChkBox(lastIndex);
		strDriverTPDataId = getDriverTPDataId(lastIndex);
		
		//if agent driver is checked
		if (strAgentDriverChkBox == "checked") {
			// clear agentDriverThirdPartyDataId since its a pure agent driver
			$("#agentDriverThirdPartyDataId_" + lastIndex).val(null);	
			
			//set defalult license status for each agent selected driver based on driver status
			if ( trimSpaces($("#agentDriverLicenseStatusCd_" + lastIndex).val()) == '') {
				$("#agentDriverLicenseStatusCd_" + lastIndex).val(getLicStatusCdForDrvrStatus(lastIndex));
			}
			
			// populate agent driver's agent entered license state with risk state if it is empty
			if ( trimSpaces($("#agentEnteredlicenseStateCd_" + lastIndex).val()) == '' ) {
				 $("#agentEnteredlicenseStateCd_" + lastIndex).val($('#stateCd').val());
			}
			
			// populate remaining agent driver's  agent entered fields data from matched prefill driver just incase if any one is empty
			if (strDriverTPDataId != null && trimSpaces(strDriverTPDataId) != '') {					
				if ( trimSpaces($("#agentEnteredFirstName_" + lastIndex).val()) == '' ) {
					 $("#agentEnteredFirstName_" + lastIndex).val( $("#tpfirstName_" + lastIndex).val() );
				}
				
				if ( trimSpaces($("#agentEnteredMiddleName_" + lastIndex).val()) == '' ) {
					 $("#agentEnteredMiddleName_" + lastIndex).val( $("#tpmiddleName_" + lastIndex).val() );
				}
				
				if ( trimSpaces($("#agentEnteredLastName_" + lastIndex).val()) == '' ) {
					 $("#agentEnteredLastName_" + lastIndex).val( $("#tplastName_" + lastIndex).val() );
				}
				
				if ( trimSpaces($("#agentEnteredBirthDate_" + lastIndex).val()) == '' ) {
					 $("#agentEnteredBirthDate_" + lastIndex).val( $("#tpbirthDate_" + lastIndex).val() );
				}
				
				if ( trimSpaces($("#agentDriverGenderCd_" + lastIndex).val()) == '' ) {				
					$("#agentDriverGenderCd_" + lastIndex).val( $("#tpDriverGenderCd_" + lastIndex).val() );
				}
			}
		}
	});
	
	
	// enable fields before submit
	$('.agentDriverStatusData').each(function() {
		lastStatusIndex = getIndexOfElementId_prefill(this);
		$('#tpDriverChkBox_' + lastStatusIndex).removeAttr("disabled");
		$('#agentDriverStatus_' + lastStatusIndex).removeAttr("disabled");		
	});
	
	// enable fields
	$('.clsMatchedAgentDriverRmvLookedUp').each(function() {	
		lastStatusIndex = getIndexOfElementId_prefill(this);
		$('#agentDriverChkBox_' + lastStatusIndex).removeAttr("disabled");
		$('#tpDriverChkBox_' + lastStatusIndex).removeAttr("disabled");
	});
	
	return true;
}


function createNewAgentDriver(lastIndex) {

	var strDriverStatusCd = getDriverStatusCd(lastIndex);
	var strDriverTPDataId = getDriverTPDataId(lastIndex);	
				
	if ((strDriverStatusCd  != null) 
	&& (strDriverStatusCd  != 'DELETED') 
	&& (strDriverStatusCd  != 'NLH') 
	&& (strDriverStatusCd  != 'DUP') 
	&& (strDriverStatusCd  != 'DEC')) {
		
		var agentDriverVars = $('#hiddenDriverVariables_' + lastIndex);
		var strDriverSeqID = $('.agentDriversSeqNum').length;

		$("#tprejectedReasonCd_" + lastIndex).val(strDriverStatusCd);
		
		blnDataChanged = true;
		blnPrefillDrvrAdded = true;
		if($('#prefillNewlyAddedItemIndex').val()=="" || $('#prefillNewlyAddedItemIndex').val()==null){
			$('#prefillNewlyAddedItemIndex').val(lastIndex);
		}  
							
		// Creating Driver Third Party ID for Agent Driver
		agentDriverVars.append('<input  id="agentDriverThirdPartyDataId_' + strDriverSeqID
						+ '" name="agentDrivers[' + strDriverSeqID
						+ '].driverThirdPartyDataId" type="hidden" value="' + strDriverTPDataId + '"/>');

		// Creating Seq number for Agent Driver
		agentDriverVars.append('<input class="agentDriversSeqNum" id="agentDriverSeqNum_' + strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].driverSeqNum" type="hidden" value="' + parseInt(strDriverSeqID + 1) + '"/>');
		
		// Creating license state code
		var licStateCd = getLicStateCode(lastIndex);
		if( trimSpaces(licStateCd) == '' ) {
			licStateCd = $('#stateCd').val();
		}		
		agentDriverVars.append('<input id="agentDriverLicStateCd_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].licStateCd" type="hidden" value="' + licStateCd + '"/>');
		
		// Creating license number
		agentDriverVars.append('<input id="agentDriverLicenseNumber_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].licenseNumber" type="hidden" value="' + trimSpaces($("#tplicenseNumber_" + lastIndex).val()) + '"/>');
		
		// Creating first name
		agentDriverVars.append('<input id="agentDriverFirstName_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].firstName" type="hidden" value="' + trimSpaces($("#tpfirstName_" + lastIndex).val()) + '"/>');
		
		// Creating middle name
		agentDriverVars.append('<input id="agentDriverMiddleName_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].middleName" type="hidden" value="' + trimSpaces($("#tpmiddleName_" + lastIndex).val()) + '"/>');
		
		// Creating last name
		agentDriverVars.append('<input id="agentDriverLastName_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].lastName" type="hidden" value="' + trimSpaces($("#tplastName_" + lastIndex).val()) + '"/>');
		
		// Creating dob
		agentDriverVars.append('<input id="agentDriverBirthDate_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].birthDate" type="hidden" value="' + trimSpaces($("#tpbirthDate_" + lastIndex).val()) + '"/>');
		
		// Creating license status code
		agentDriverVars.append('<input id="agentDriverLicenseStatusCd_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].licenseStatusCd" type="hidden" value="' + getLicStatusCdForDrvrStatus(lastIndex) + '"/>');
		
		// Creating Driver Status code for Agent Driver
		agentDriverVars.append('<input id="agentDriverStatus_' + strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].driverStatusCd" type="hidden" value="' + strDriverStatusCd + '"/>');
		
		// Creating chosenAsPrefillDriverInd
		agentDriverVars.append('<input id="agentChosenAsPrefillDriverInd_'	+ strDriverSeqID
				+ '" name="agentDrivers[' + strDriverSeqID
				+ '].chosenAsPrefillDriverInd" type="hidden" value="' + 'Yes' + '"/>');
		
		// Reset the Reject reason code to NULL
		$("#prefillDriverStatus_" + lastIndex).val("");			
	}
	
	return true;
}

function setVehicleThirdPartyDataIds() {
	var lastIndex;	
	var agentVehicleId;
	var strTPVehicleChkBox;
	var strVehicleTPDataId;
	var strVehicleSeqId;
	var strPrefillSelectedRejectedStatusCd;	

	$('input.tpVehicleChkBox').each(	function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTPVehicleChkBox = getTPVehicleChkBox(lastIndex);		
		
		if (strTPVehicleChkBox == "checked") {			
			agentVehicleId = getAgentVehicleId(lastIndex);
			strAgentVehicleTPDataId = $("#vehicleThirdPartyDataId_" + lastIndex).val();
			strVehicleTPDataId = getVehicleTPDataId(lastIndex);
			strVehicleTPVin = $("#tpVin_" + lastIndex).val();
			strVehicleTPModelYear = $("#tpModelYear_" + lastIndex).val();
			strVehicleTPMake = $("#tpMake_" + lastIndex).val();
			strVehicleTPModel = $("#tpModel_" + lastIndex).val();
			
			strPrefillSelectedRejectedStatusCd = getPrefillSelectedRejectedStatusCd(lastIndex);
			
			//if matched agent vehicle id is there
			if (agentVehicleId != null && trimSpaces(agentVehicleId) != '') {
				//means prefill vehicle is selected freshly...
				if ( (strAgentVehicleTPDataId == '') || (strAgentVehicleTPDataId != strVehicleTPDataId) ) {		//strAgentVehicleTPDataId may contain a ID from upload			
					blnDataChanged = true;
					// set indicator
					$("#agentMatchedPrefillVehNewlySelectedInd_" + lastIndex).val("Yes");
					
					// transfer prefill vehicle data to agent vehicle
					 $("#agentVehicleVin_" + lastIndex).val( $("#tpVin_" + lastIndex).val() ); 
					 $("#agentVehicleModelYear_" + lastIndex).val( $("#tpModelYear_" + lastIndex).val() );
					 $("#agentVehicleMake_" + lastIndex).val( $("#tpMake_" + lastIndex).val() );
					 $("#agentVehicleModel_" + lastIndex).val( $("#tpModel_" + lastIndex).val() );
				}
				
				// always assign TP VehileThirdpartyDataId to agent vehicle(matched)
				$("#vehicleThirdPartyDataId_" + lastIndex).val(strVehicleTPDataId);
			}
			else {
				// else agent vehicle is null and prefill vehicle is picked to add as a agent vehicle.
				if ( (strPrefillSelectedRejectedStatusCd !='Exclude-Sold' )
				&& (strPrefillSelectedRejectedStatusCd !='Exclude-Named Insured not Registered Owner') 
				&& (strPrefillSelectedRejectedStatusCd !='Exclude-Commercial Vehicle') 
				&& (strPrefillSelectedRejectedStatusCd !='Exclude-Other')) {
					
					var agentVehicleVars = $('#hiddenVehicleVariables_'	+ lastIndex);
					strVehicleSeqId = $('.agentVehicleThirdPartyDataId').length;
					blnDataChanged = true;
					blnPrefillVehAdded = true;
					if($('#prefillNewlyAddedItemIndex').val()=="" || $('#prefillNewlyAddedItemIndex').val()==null){
						$('#prefillNewlyAddedItemIndex').val(lastIndex);
					}  
					
					// Assing selected TP vehicle data to new agent vehicle.					
					// Vin
					agentVehicleVars.append('<input id="agentVehicleVin_' + strVehicleSeqId + '" name="agentVehicles['
							+ strVehicleSeqId + '].vin" type="hidden" value="' 	+ strVehicleTPVin + '"/>');
					
					// Year
					agentVehicleVars.append('<input id="agentVehicleModelYear_' + strVehicleSeqId + '" name="agentVehicles['
							+ strVehicleSeqId + '].modelYear" type="hidden" value="' + strVehicleTPModelYear + '"/>');
						
					// Make
					agentVehicleVars.append('<input id="agentVehicleMake_' + strVehicleSeqId + '" name="agentVehicles['
							+ strVehicleSeqId + '].make" type="hidden" value="' + strVehicleTPMake + '"/>');
					
					// Model
					agentVehicleVars.append('<input id="agentVehicleModel_' + strVehicleSeqId + '" name="agentVehicles['
							+ strVehicleSeqId + '].model" type="hidden" value="' + strVehicleTPModel + '"/>');
					
					// Creating Vehicle Third Party ID for Agent Vehicle
					agentVehicleVars.append('<input class="agentVehicleThirdPartyDataId agentVehiclesSeqNum" id="vehicleThirdPartyDataId_'
							+ strVehicleSeqId + '" name="agentVehicles[' + strVehicleSeqId + '].vehicleThirdPartyDataId" type="hidden" value="'
							+ strVehicleTPDataId + '"/>');
					
					// Creating Vehicle Seq number ID for Agent Vehicle
					agentVehicleVars.append('<input id="agentVehicleSeqNum_' + strVehicleSeqId + '" name="agentVehicles['
							+ strVehicleSeqId + '].vehicleSeqNum" type="hidden" value="' + parseInt(strVehicleSeqId + 1)  + '"/>');
					
					// commented below code to not to clear/reset the selected reject reason code to NULL
					//$("#prefillSelectedRejectedStatusCd_" + lastIndex).val("");
				}
			}
		} 
		else {		
			
			// before clearing in the next statement check if a value is there..
			if ( $("#vehicleThirdPartyDataId_" + lastIndex).val() != null 
			&& $("#vehicleThirdPartyDataId_" + lastIndex).val() != '' 
			&& $("#vehicleThirdPartyDataId_" + lastIndex).val() == getVehicleTPDataId(lastIndex)
			) {
				blnDataChanged = true; // means checkbox selection shifted to agent side from prefill.
			}
			
			// clear agent vehicleThirdPartyDataId since it's a pure agent vehicle now.
			$("#vehicleThirdPartyDataId_" + lastIndex).val(null);			
		}
		
		// set matched agent vehicle id for each TP prefill vehicle
		// if any matched agent vehicle exists otherwise null
		agentVehicleId = getAgentVehicleId(lastIndex);
		$("#tpMatchedAgentVehicleId_" + lastIndex).val(agentVehicleId);
		
	});
	
	//enable fields before submit. pefill driver status is always enabled.
	$('.agentVehicleStatusData').each(function() {
		lastStatusIndex = getIndexOfElementId_prefill(this);
		$('#tpVehicleChkBox_' + lastStatusIndex).removeAttr("disabled");
		$('#prefillSelectedRejectedStatusCd_' + lastStatusIndex).removeAttr("disabled");
	});

	return true;
}

function setCurrentCarrierDataIds() {
		
	// if agent checkbox is checked then move the agent entered field value to
	// agent regular field as they should contain smae value.
	$('input.agentCurrentCarrier').each(function() {
		if ($(this).prop('checked') == true) { 
			if ( $(this).hasClass("agentActvCurrPolSelChkbox") ) {
				if (isElementExisting("#agentActiveCurrentPolicyInd")) 
					$("#agentActiveCurrentPolicyInd").val( $("#agentEnteredActiveCurrentPolicyInd").val() );
			} else if ( $(this).hasClass("agentNumYrsContCovrgChkbox") ) {
				//continuous coverage
				if ( isElementExisting("#agentNumYrsContinuousCoverage") )  {
					$("#agentNumYrsContinuousCoverage").val( $("#agentEnteredNumYrsContinuousCoverage").val() );	
				
					//dependant field1
					if ( isElementExisting("#agentNumYrsInsuredWithCurrentCarrier") )  {
						$("#agentNumYrsInsuredWithCurrentCarrier").val( $("#agentEnteredNumYrsInsuredWithCurrentCarrier").val() );	
					}
					//dependant field2
					if ( isElementExisting("#agentInsuredWithCurrentAgent36MthsFlag") )  {
						$("#agentInsuredWithCurrentAgent36MthsFlag").val( $("#agentEnteredInsuredWithCurrentAgent36MthsFlag").val() );	
					}
				}
			} else if ( $(this).hasClass("agentNoCurrPolReasCdChkbox") ) {
				if (isElementExisting("#agentNoCurrentAutoPolicyReasonCode")) 					
					$("#agentNoCurrentAutoPolicyReasonCode").val( $("#agentEnteredNoCurrAutoPolReasonCd").val() );
			} else if ( $(this).hasClass("agentCurrCarrCodeChkbox") ) {
				if (isElementExisting("#agentPriorCarrierCode")) 
					$("#agentPriorCarrierCode").val( $("#agentEnteredPriorCarrCd").val() );									
			} else if ( $(this).hasClass("agentPriorCarrBIlimtChkbox") ) {	
				if (isElementExisting("#agentPriorCarrierBILimits")) 
					$("#agentPriorCarrierBILimits").val( $("#agentEnteredPriorCarrBILimits").val() );					
			}
		}
		
		// check if data is changed.
		if ( $(this).prop('defaultChecked') != $(this).prop('checked') ) {
			blnDataChanged = true;
		}
		
	});	
	
	// if prefill checkbox is checked then assign prefill field value to agent regular field if exists
	// or else create a new agent regular field and assign prefill field data to this new field.
	var agentCurrCarrFlds = $('#agentCurrentCarrFldsCreate');	
	$('input.prefillCurrentCarrier').each(function() {		
		if ($(this).prop('checked') == true) { 
			// has current auto insurance
			if ( $(this).hasClass("prefillActvCurrPolSelChkbox") ) {
				
				if (isElementExisting("#agentActiveCurrentPolicyInd")) {
					$("#agentActiveCurrentPolicyInd").val( $("#prefillActiveCurrentPolicyInd").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentActiveCurrentPolicyInd'	+ '" name="agentPriorCarrier.activeCurrentPolicyInd" type="hidden" value="'
							+ $("#prefillActiveCurrentPolicyInd").val() + '"/>');
				}
			} else if ( $(this).hasClass("prefillNumYrsContCovrgChkbox") ) {
				//continuous coverage
				if (isElementExisting("#agentNumYrsContinuousCoverage")) {
					$("#agentNumYrsContinuousCoverage").val( $("#prefillNumYrsContinuousCoverage").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentNumYrsContinuousCoverage' + '" name="agentPriorCarrier.numYrsContinuousCoverage" type="hidden" value="'
							+ $("#prefillNumYrsContinuousCoverage").val() + '"/>');
				}
				
				//dependant field1
				if (isElementExisting("#agentNumYrsInsuredWithCurrentCarrier")) {
					$("#agentNumYrsInsuredWithCurrentCarrier").val( $("#prefillNumYrsInsuredWithCurrentCarrier").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentNumYrsInsuredWithCurrentCarrier' + '" name="agentPriorCarrier.numYrsInsuredWithCurrentCarrier" type="hidden" value="'
							+ $("#prefillNumYrsInsuredWithCurrentCarrier").val() + '"/>');
				}
				
				//dependant field2
				if (isElementExisting("#agentInsuredWithCurrentAgent36MthsFlag")) {
					$("#agentInsuredWithCurrentAgent36MthsFlag").val( $("#prefillInsuredWithCurrentAgent36MthsFlag").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentInsuredWithCurrentAgent36MthsFlag' + '" name="agentPriorCarrier.insuredWithCurrentAgent36MthsFlag" type="hidden" value="'
							+ $("#prefillInsuredWithCurrentAgent36MthsFlag").val() + '"/>');
				}
				
				// clear agent side no current auto policy reason code
				if (isElementExisting("#agentNoCurrentAutoPolicyReasonCode")) {
					$("#agentNoCurrentAutoPolicyReasonCode").val("");					
				}
			} else if ( $(this).hasClass("prefillNoCurrPolReasCdChkbox") ) {
				if (isElementExisting("#agentNoCurrentAutoPolicyReasonCode")) {
					$("#agentNoCurrentAutoPolicyReasonCode").val( $("#prefillNoCurrentAutoPolicyReasonCode").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentNoCurrentAutoPolicyReasonCode' + '" name="agentPriorCarrier.noCurrentAutoPolicyReasonCode" type="hidden" value="'
							+ $("#prefillNoCurrentAutoPolicyReasonCode").val() + '"/>');
				}
				
				// clear agent side agentNumYrsContinuousCoverage
				if (isElementExisting("#agentNumYrsContinuousCoverage")) {
					$("#agentNumYrsContinuousCoverage").val("");					
				}
			} else if ( $(this).hasClass("prefillCurrCarrCodeChkbox") ) {
				if (isElementExisting("#agentPriorCarrierCode")) {
					$("#agentPriorCarrierCode").val( $("#prefillPriorCarrierCode").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentPriorCarrierCode' + '" name="agentPriorCarrier.priorCarrierCode" type="hidden" value="'
							+ $("#prefillPriorCarrierCode").val() + '"/>');
				}
			} else if ( $(this).hasClass("prefillPriorCarrBIlimtChkbox") ) {
				if (isElementExisting("#agentPriorCarrierBILimits")) {
					$("#agentPriorCarrierBILimits").val( $("#prefillPriorCarrierBILimits").val() );
				} else {
					agentCurrCarrFlds.append('<input  id="agentPriorCarrierBILimits' + '" name="agentPriorCarrier.priorCarrierBILimits" type="hidden" value="'
							+ $("#prefillPriorCarrierBILimits").val() + '"/>');
				}
			}
		}
		
		// check if data is changed.
		if ( $(this).prop('defaultChecked') != $(this).prop('checked') ) {
			blnDataChanged = true;
		}
	});
	
	// finally clear not related fields based on agentActiveCurrentPolicyInd value
	// processed above. Eventhough not applicable field picked from prefill side.
	if (isElementExisting("#agentActiveCurrentPolicyInd")) {
		
		if ( $("#agentActiveCurrentPolicyInd").val() == 'Yes' ) {
			//clear 
			if (isElementExisting("#agentNoCurrentAutoPolicyReasonCode")) { $("#agentNoCurrentAutoPolicyReasonCode").val(""); }
			
		} else if ( $("#agentActiveCurrentPolicyInd").val() == 'No' ) {
			//clear numm yrs continuous coverage as not applicable.
			if (isElementExisting("#agentNumYrsContinuousCoverage")) { $("#agentNumYrsContinuousCoverage").val(""); }
			
			// clear prior carrier code & prior carrier bi limits 
			// if prfill has no current auto policy selected and prefillNoCurrentAutoPolicyReasonCode is selected which is not 0_31DAYS
			if( isCheckBoxChecked("#prefillActiveCurrentPolicyInd")
			&& $("#prefillActiveCurrentPolicyInd").val() == 'No' 
			&& isCheckBoxChecked("#prefillNoCurrentAutoPolicyReasonCodeSelInd")
			&& $("#prefillNoCurrentAutoPolicyReasonCode").val() != '0_31DAYS'
			) {
				if (isElementExisting("#agentPriorCarrierCode")) { $("#agentPriorCarrierCode").val(""); }			
		
				if (isElementExisting("#agentPriorCarrierBILimits")) { $("#agentPriorCarrierBILimits").val(""); }
			}
			else {
				//also clear if agent prior carr code existing and not checked where corresponding prefill row element not exists			
				if (isElementExisting("#agentPriorCarrierCodeSelInd")
				&& (!isCheckBoxChecked("#agentPriorCarrierCodeSelInd")) 
				&& (!isElementExisting("#prefillPriorCarrierCodeSelInd"))
				) { 
					$("#agentPriorCarrierCode").val(""); 
				}	
				
				//also clear if agent prior carr bi limit  existing and not checked where corresponding prefill row element not exists
				if (isElementExisting("#agentPriorCarrierBILimitsSelInd")
				&& (!isCheckBoxChecked("#agentPriorCarrierBILimitsSelInd")) 
				&& (!isElementExisting("#prefillPriorCarrierBILimitsSelInd"))
				) { 
					$("#agentPriorCarrierBILimits").val(""); 
				}	
			}
			
		}
	}
	
		
	$('input.agentCurrentCarrier').removeAttr('disabled');
	$('input.prefillCurrentCarrier').removeAttr('disabled');
	
	return true;
}

function setDriverStatusCodes() {
	var lastIndex;
	$('input.tpDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		
		if ($("input:checkbox[id='tpDriverChkBox_" + lastIndex + "']").attr('checked') || $("input:checkbox[id='agentDriverChkBox_" + lastIndex + "']").attr('checked')) {
			if ($('#prefillDriverStatus_' + lastIndex).val() == ""){
				clearInLineRowErrorBind ('tpDriverChkBox_'+ lastIndex,'prefillDriverStatus_'+ lastIndex,fieldIdToModelErrorRow['defaultSingle']);
				$('#prefillDriverStatus_' + lastIndex).val("INS_POL");
				triggerPrefillChangeEvent($('#prefillDriverStatus_' + lastIndex));
			}
		} 
	});

	return true;
}

function reSetPrefillSideDriverStatusCodes() {
	var lastIndex;
	$('input.tpDriverChkBox').each(function() {
		lastIndex = getIndexOfElementId_prefill(this);
		
		if ( $("input:checkbox[id='tpDriverChkBox_" + lastIndex + "']").attr('checked') ) {
			// do nothing as above function takes care
		} else {
			//remove the dropdown value also since checkbox not selected for unmatched prefill drivers
			if ($(this).hasClass("clsUnMatchedNotSelectedPrefillData")) {
				$('#prefillDriverStatus_' + lastIndex).val("");
				triggerPrefillChangeEvent($('#prefillDriverStatus_' + lastIndex));
			}
		}
	});

	return true;
}

function clearInLineRowErrorBind(rowName,strElementID, strErrorRow){
	var strRowName = rowName;
	var errorRow = null;
	/*//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	if (errorRow == null || errorRow.length == 0 ) {
		return ;
	}
	// remove error row
	errorRow.remove();
	$('#' + strElementID).removeClass('inlineError');*/	
	
	$('#' + jq(strElementID)).each(function(){
		var dataRow = '';
				
		if ($("#prefillPoppedUpInd").val() =='Yes' ) {
			errorRow = $('#' + strRowName  + '_Error');
			if (errorRow == null || errorRow.length == 0 ) {
				return ;
			}
			// remove error row
			errorRow.remove();
			$('#' + strElementID).removeClass('inlineError');
		}
		else {
			dataRow = $(this).parents("tr").first();
			//dataRow.css("background-color", "#FFFFFF");
			$(dataRow).find( "td:eq( 1 )" ).css("background-color", "#FFFFFF");
			$(dataRow).find( "td:eq( 2 )" ).css("background-color", "#FFFFFF");			
		}
	});
	 
}

function setVehicleStatusCodes() {
	var lastIndex;

	$('input.tpVehicleChkBox').each(	function() {
		lastIndex = getIndexOfElementId_prefill(this);
		if ($("input:checkbox[id='agentVehicleChkBox_" + lastIndex + "']").attr('checked') || $("input:checkbox[id='tpVehicleChkBox_" + lastIndex + "']").attr('checked')) {
			if ($('#prefillSelectedRejectedStatusCd_' + lastIndex).val() == ""){
				clearInLineRowErrorBind ('tpVehicleChkBox_'+ lastIndex,'prefillSelectedRejectedStatusCd_'+ lastIndex,fieldIdToModelErrorRow['defaultSingle']);
				$('#prefillSelectedRejectedStatusCd_' + lastIndex).val("Rated Vehicle");
				triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + lastIndex));
			}
		}
	});

	return true;
}

function reSetPrefillVehicleStatusCodes() {
	var lastIndex;

	$('input.tpVehicleChkBox').each(	function() {
		lastIndex = getIndexOfElementId_prefill(this);
		if ( $("input:checkbox[id='tpVehicleChkBox_" + lastIndex + "']").attr('checked') ) {
			//don't do anything 
		} else {
			if ($(this).hasClass("clsUnMatchedNotSelectedPrefillData")) {
				$('#prefillSelectedRejectedStatusCd_' + lastIndex).val("");
				triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + lastIndex));
			}
		}
	});

	return true;
}

function getAgentDriverThirdPartyDataId(index) {
	return($("#agentDriverThirdPartyDataId_" + index).val());
}

function getAgentDriverId(index) {
	return ($("#agentDriverId_" + index).length > 0) ? $("#agentDriverId_" + index).val() : null;
	
}

function getDriverTPDataId(index) {
	return($("#driverTPDataId_" + index).val());
}

function getDriverStatusCd(index) {
	return ($("#prefillDriverStatus_" + index).length > 0) ? $("#prefillDriverStatus_" + index).val() : null;
}

function getTpDriverTPDataId(index) {
	//return ($("#tpdriverTPDataId_" + index).val());
	return ($("#tpdriverTPDataId_" + index).length > 0) ? $("#tpdriverTPDataId_" + index).val() : null;
}

function getTpVehicleTPDataId(index) {
	//return ($("#tpdriverTPDataId_" + index).val());
	return ($("#vehicleTPDataId_" + index).length > 0) ? $("#vehicleTPDataId_" + index).val() : null;
}

function getTPDriverChkBox(index) {
	return ($("#tpDriverChkBox_" + index).attr('checked'));
}

function getAgentDriverChkBox(index) {
	return ($("#agentDriverChkBox_" + index).attr('checked'));
}

function getAgentVehcileChkBox(index) {
	return ($("#agentVehicleChkBox_" + index).attr('checked'));
}

function chkSelectedVehicle(isAgentVehicle, SelectedVehicle, vehicleIndex) {
	if (isAgentVehicle == "")
		$("input:checkbox[id='" + SelectedVehicle + "']").removeAttr("checked");
	
	
	$("input:checkbox[id='deleteVehicleChkBox_" + vehicleIndex + "']").removeAttr("checked");
	
	$("#agentVehileFontColor_" + vehicleIndex).css('color', 'black');
	$("#tpVehileFontColor_" + vehicleIndex).css('color', 'black');
	
	if ($("input:checkbox[id='agentVehicleChkBox_" + vehicleIndex + "']").attr('checked') || $("input:checkbox[id='tpVehicleChkBox_" + vehicleIndex + "']").attr('checked')) {
		if (($('#prefillSelectedRejectedStatusCd_' + vehicleIndex).val() == "") || ($('#prefillSelectedRejectedStatusCd_' + vehicleIndex).val() == null)){
			clearInLineRowErrorBind ('tpVehicleChkBox_'+ vehicleIndex ,'prefillSelectedRejectedStatusCd_'+ vehicleIndex ,fieldIdToModelErrorRow['defaultSingle']);
			$('#prefillSelectedRejectedStatusCd_' + vehicleIndex).val("Rated Vehicle");
			triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + vehicleIndex));
		}
	}
	else {
		$('#prefillSelectedRejectedStatusCd_' + vehicleIndex).val("");
		showClearInLineErrorRowMsgsPrefill('tpVehicleChkBox_'+ vehicleIndex,'prefillSelectedRejectedStatusCd_'+ vehicleIndex, fieldIdToModelErrorRow['defaultSingle'], vehicleIndex);
		triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + vehicleIndex));
	}
}

function chkSelectedAgentVehicle(vehicleIndex) {
	
	$("input:checkbox[id='agentVehicleChkBox_" + vehicleIndex + "']").prop('checked', true);
	$("input:checkbox[id='deleteVehicleChkBox_" + vehicleIndex + "']").removeAttr("checked");
	
	$("#agentVehileFontColor_" + vehicleIndex).css('color', 'black');
	$("#tpVehileFontColor_" + vehicleIndex).css('color', 'black');
}



function chkDeletedVehicle(vehicleIndex) {
	
	if ($("input:checkbox[id='deleteVehicleChkBox_" + vehicleIndex + "']").attr('checked')) {
 	 	$("#agentVehicleChkBox_" + vehicleIndex ).attr("disabled", false);
 	 	$("#tpVehicleChkBox_" + vehicleIndex ).attr("disabled", false);
 		$("#agentVehicleChkBox_" + vehicleIndex ).removeAttr("checked");
 		$("#tpVehicleChkBox_" + vehicleIndex ).removeAttr("checked");
	}
	else {
		$("input:checkbox[id='deleteVehicleChkBox_" + vehicleIndex + "']").prop('checked', true);
	}
	$("#agentVehileFontColor_" + vehicleIndex).css('color', 'gray');
	$("#tpVehileFontColor_" + vehicleIndex).css('color', 'gray');
}


function chkDeletedDriver(driverIndex) {
	
	
	if ($("input:checkbox[id='deleteDriverChkBox_" + driverIndex + "']").attr('checked')) {
 	 	$("#agentDriverChkBox_" + driverIndex ).attr("disabled", false);
 	 	$("#tpDriverChkBox_" + driverIndex ).attr("disabled", false);
 		$("#agentDriverChkBox_" + driverIndex ).removeAttr("checked");
 		$("#tpDriverChkBox_" + driverIndex ).removeAttr("checked");
 		$("#agentDriverFontColor_" + driverIndex).css('color', 'gray');
 		$("#tpDriverFontColor_" + driverIndex).css('color', 'gray');
	}
	else {
	//	$("#agentDriverChkBox_" + driverIndex ).attr("disabled", false);
 	//	$("#tpDriverChkBox_" + driverIndex ).attr("disabled", false);
		$("input:checkbox[id='deleteDriverChkBox_" + driverIndex + "']").prop('checked', true);
		$("#agentDriverFontColor_" + driverIndex).css('color', 'gray');
 		$("#tpDriverFontColor_" + driverIndex).css('color', 'gray');
	}
}



function chkSelectedDriver(isAgentDriver, SelectedDriver, driverID, driverType) {
	
	// uncheck opposite checkbox automatically. Applies if agent driver exists.
	if (isAgentDriver == 'true')
		$("input:checkbox[id='" + SelectedDriver + "']").removeAttr("checked");
	
	
	if (driverType == "agentDriver") {
		if (!$("input:checkbox[id='agentDriverChkBox_" + driverID + "']").attr('checked')) {
			$("input:checkbox[id='" + SelectedDriver + "']").prop('checked', true);
		//	$("input:checkbox[id='deleteDriverChkBox_" + driverID + "']").removeAttr("checked");
		}
	}
	
	if ((isAgentDriver == 'true') && (driverType == "tpDriver")) {
		if (!$("input:checkbox[id='tpDriverChkBox_" + driverID + "']").attr('checked')) {
			$("input:checkbox[id='" + SelectedDriver + "']").prop('checked', true);
		//	$("input:checkbox[id='deleteDriverChkBox_" + driverID + "']").removeAttr("checked");
		
		}
	}
	
	$("input:checkbox[id='deleteDriverChkBox_" + driverID + "']").removeAttr("checked");
	$("#agentDriverFontColor_" + driverID).css('color', 'black');
	$("#tpDriverFontColor_" + driverID).css('color', 'black');
	
	//check if any checkbox is checked
	if ($("input:checkbox[id='tpDriverChkBox_" + driverID + "']").attr('checked') || $("input:checkbox[id='agentDriverChkBox_" + driverID + "']").attr('checked')) {
		
		// if corresponding agent driver exists then set default for agent driver status dropdown if empty
		if (($('#agentDriverId_' + driverID).val() != null ) && ($('#agentDriverId_' + driverID).val() != "")) {
			if ($('#agentDriverStatus_' + driverID).val() == ""){
				clearInLineRowErrorBind ('agentDriverChkBox_'+ driverID,'agentDriverStatus_'+ driverID,fieldIdToModelErrorRow['defaultSingle']);
				$('#agentDriverStatus_' + driverID).val("INS_POL");
				triggerPrefillChangeEvent($('#agentDriverStatus_' + driverID));
			}
		}
		else { // else set default for prefill driver status dropdown if empty
			if (($('#prefillDriverStatus_' + driverID).val()) == null || ($('#prefillDriverStatus_' + driverID).val() == "")) {
				clearInLineRowErrorBind ('tpDriverChkBox_'+ driverID,'prefillDriverStatus_'+ driverID,fieldIdToModelErrorRow['defaultSingle']);
				$('#prefillDriverStatus_' + driverID).val("INS_POL");
				triggerPrefillChangeEvent($('#prefillDriverStatus_' + driverID));
			}
		}
	}
	else {
		// if no check box is checked then clear dropdown statuses
		if (($('#agentDriverId_' + driverID).val() != null) && ($('#agentDriverId_' + driverID).val() != "")) {
			$('#agentDriverStatus_' + driverID).val("");
			showClearInLineErrorRowMsgsPrefill('agentDriverChkBox_'+ driverID,'agentDriverStatus_'+ driverID, fieldIdToModelErrorRow['defaultSingle'], driverID);
			triggerPrefillChangeEvent($('#agentDriverStatus_' + driverID));
			
		}
		else {
			$('#prefillDriverStatus_' + driverID).val("");
			showClearInLineErrorRowMsgsPrefill('tpDriverChkBox_'+ driverID,'prefillDriverStatus_'+ driverID, fieldIdToModelErrorRow['defaultSingle'], driverID);
			triggerPrefillChangeEvent($('#prefillDriverStatus_' + driverID));
		}
	}
	
}

function agentDriverStatusChanged(driverStatus,driverID){
	var strDriverStatus= driverStatus.value;
	if (strDriverStatus == "") {
		$("#agentDriverChkBox_" + driverID ).removeAttr("checked");
		$("#tpDriverChkBox_" + driverID ).removeAttr("checked");
		$("#" +'tpDriverChkBox_' + driverID).removeClass('hidden');
		showClearInLineErrorRowMsgsPrefill('agentDriverChkBox_'+ driverID,'agentDriverStatus_'+ driverID, fieldIdToModelErrorRow['defaultSingle'], driverID);
		triggerPrefillChangeEvent($('#agentDriverStatus_' + driverID));
	}
	else {
		clearInLineRowErrorBind ('agentDriverChkBox_'+ driverID,'agentDriverStatus_'+ driverID,fieldIdToModelErrorRow['defaultSingle']);
		triggerPrefillChangeEvent($('#agentDriverStatus_' + driverID));
	}
}

function prefillDriverStatusChanged(driverStatus,driverID){
	var strDriverStatus= driverStatus.value;
	if (strDriverStatus == "") {
		$("#agentDriverChkBox_" + driverID ).removeAttr("checked");
		$("#tpDriverChkBox_" + driverID ).removeAttr("checked");
		$("#tpDriverChkBox_" + driverID).removeClass('hidden');
		showClearInLineErrorRowMsgsPrefill('tpDriverChkBox_'+ driverID,'prefillDriverStatus_'+ driverID, fieldIdToModelErrorRow['defaultSingle'], driverID);
		triggerPrefillChangeEvent($('#prefillDriverStatus_' + driverID));
	}
	else {
		if ((strDriverStatus  == 'DELETED') || (strDriverStatus  == 'NLH') 
				|| (strDriverStatus  == 'DUP') || (strDriverStatus  == 'DEC')) {
			$("#tpDriverChkBox_" + driverID).addClass('hidden');
			$("#tpDriverChkBoxSpace_" + driverID).html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		} else {
			$("#tpDriverChkBox_" + driverID).attr('checked','checked');
			$("#tpDriverChkBox_" + driverID).removeClass('hidden');
			$("#tpDriverChkBoxSpace_" + driverID).html("");
		}		
		
		clearInLineRowErrorBind ('tpDriverChkBox_'+ driverID,'prefillDriverStatus_'+ driverID,fieldIdToModelErrorRow['defaultSingle']);
		triggerPrefillChangeEvent($('#prefillDriverStatus_' + driverID));
	}
}

function vehicleStatusChanged(vehicleStatus,vehileID){
	var strVehicleStatus= vehicleStatus.value;
	if (strVehicleStatus == "") {
		$("#agentVehicleChkBox_" + vehileID ).removeAttr("checked");
		$("#tpVehicleChkBox_" + vehileID ).removeAttr("checked");
		showClearInLineErrorRowMsgsPrefill('tpVehicleChkBox_'+ vehileID, 'prefillSelectedRejectedStatusCd_'+ vehileID, fieldIdToModelErrorRow['defaultSingle'], vehileID);
		triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + vehileID));
	}
	else {
		if (strVehicleStatus  != 'Rated Vehicle')  {
			$("#tpVehicleChkBox_" + vehileID ).addClass('hidden');
			$("#tpVehicleChkBoxSpace_" + vehileID ).html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		} else {
			$("#tpVehicleChkBox_" + vehileID ).attr('checked','checked');
			$("#tpVehicleChkBox_" + vehileID ).removeClass('hidden');
			$("#tpVehicleChkBoxSpace_" + vehileID ).html("");
		}
		
		clearInLineRowErrorBind('tpVehicleChkBox_'+ vehileID,'prefillSelectedRejectedStatusCd_'+ vehileID ,fieldIdToModelErrorRow['defaultSingle']);
		triggerPrefillChangeEvent($('#prefillSelectedRejectedStatusCd_' + vehileID));
	}
}

function unChkActiveCurrentPolicySelInd (isAgent) {
	
	if (isAgent == "Yes") {
		$("input:checkbox[id='prefillActiveCurrentPolicySelInd']").removeAttr("checked");
	} else {
		$("input:checkbox[id='agentActiveCurrentPolicySelInd']").removeAttr("checked");
	}
	
	//resetAgentAndPrefillChkBoxes
	if (isAgent == 'Yes') {
		if( isCheckBoxChecked("#agentActiveCurrentPolicySelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
		} else {
			//clear all dependant checkboxes because its a main checkbox
			$('input.agentCurrentCarrier').prop('checked', false);
		}
	} else {		
		if ( isCheckBoxChecked("#prefillActiveCurrentPolicySelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);			
		} else {
			//clear all dependant checkboxes because its a main checkbox
			$('input.prefillCurrentCarrier').prop('checked', false);
		}
		
		// set or reset bg colors for remaining dependant elements
		setOrResetBGColorForAllCurrCarrElms();		
	}

	enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
}

function unChkNumYrsContCovrgAndNoCurrPolReasonCdSelInds (isAgent) {
	if (isAgent == "Yes") {
		// uncheck prefill side
		if(isElementExisting("#prefillNumYrsContinuousCoverageSelInd")) {
			$("input:checkbox[id='prefillNumYrsContinuousCoverageSelInd']").removeAttr("checked");
		}
		if(isElementExisting("#prefillNoCurrentAutoPolicyReasonCodeSelInd")) {
			$("input:checkbox[id='prefillNoCurrentAutoPolicyReasonCodeSelInd']").removeAttr("checked");
		}
	} else{
		// uncheck agent side
		if(isElementExisting("#agentNumYrsContinuousCoverageSelInd")) {
			$("input:checkbox[id='agentNumYrsContinuousCoverageSelInd']").removeAttr("checked");
		}
		if(isElementExisting("#agentNoCurrentAutoPolicyReasonCodeSelInd")) {
			$("input:checkbox[id='agentNoCurrentAutoPolicyReasonCodeSelInd']").removeAttr("checked");	
		}
	}
	
	if (isAgent == 'Yes') {
		//resetAgentAndPrefillChkBoxes
		if( isCheckBoxChecked("#agentNumYrsContinuousCoverageSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
		} else if( isCheckBoxChecked("#agentNoCurrentAutoPolicyReasonCodeSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
			
			//clear Prefill Flds If Agent and Prefill NoCurrAutoPolReasonCds are different;
			if ( bothCurrentAutoPolInForcesHaveNoValues() ) {
				if ( $("#agentEnteredNoCurrAutoPolReasonCd").val() != $("#prefillNoCurrentAutoPolicyReasonCode").val() ) {
					$('input.prefillCurrentCarrier').prop('checked', false);
				}
			}
		} else {
			// clear all same side values if both has current auto policy in force are different
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.agentCurrentCarrier').prop('checked', false);
			}
		}
		
	} else {		
		if ( isCheckBoxChecked("#prefillNumYrsContinuousCoverageSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);			
		} else if ( isCheckBoxChecked("#prefillNoCurrentAutoPolicyReasonCodeSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);			
			
		} else {
			// clear all same side values if both has current auto policy in force are different
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.prefillCurrentCarrier').prop('checked', false);
			}
		}
		
		setOrResetBGColorForAllCurrCarrElms();			
	}	
	
	enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
}

function unChkPriorCarrierCodeSelInd(isAgent) {
	if (isAgent == "Yes") {
		$("input:checkbox[id='prefillPriorCarrierCodeSelInd']").removeAttr("checked");
	} else {
		$("input:checkbox[id='agentPriorCarrierCodeSelInd']").removeAttr("checked");
	}
	
	//resetAgentAndPrefillChkBoxes
	if (isAgent == 'Yes') {
		if( isCheckBoxChecked("#agentPriorCarrierCodeSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
		} else {
			// clear all same side value if whole set is different from opposite side
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.agentCurrentCarrier').prop('checked', false);
			}
		}
	} else {		
		if ( isCheckBoxChecked("#prefillPriorCarrierCodeSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
			//reSetBGColor("#prefillPriorCarrierCodeSelInd");
		} else {
			// clear all same side value if whole set is different from opposite side
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.prefillCurrentCarrier').prop('checked', false);
			}
		}
		
		setOrResetBGColorForAllCurrCarrElms();		
	}	
	
	enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
}

function unChkPriorCarrierBILimitsSelInd(isAgent) {
	
	if (isAgent == "Yes") {
		$("input:checkbox[id='prefillPriorCarrierBILimitsSelInd']").removeAttr("checked");
	} else {
		$("input:checkbox[id='agentPriorCarrierBILimitsSelInd']").removeAttr("checked");
	}
	
	//resetAgentAndPrefillChkBoxes
	if (isAgent == 'Yes') {
		if( isCheckBoxChecked("#agentPriorCarrierBILimitsSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
		} else {
			// clear all same side value if whole set is different from opposite side
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.agentCurrentCarrier').prop('checked', false);
			}
		}	
	} else {		
		if ( isCheckBoxChecked("#prefillPriorCarrierBILimitsSelInd") ) { 
			resetAgentAndPrefillChkBoxes(isAgent, true);
			//reSetBGColor("#prefillPriorCarrierBILimitsSelInd");
		} else {
			// clear all same side value if whole set is different from opposite side
			if ( currentAutoPolInForcesAreDifferent() ) {
				$('input.prefillCurrentCarrier').prop('checked', false);
			}
		}
		
		setOrResetBGColorForAllCurrCarrElms();		
	}	
	
	enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(false);
}

function enableDisableAgentPriorCarrCdAndBiLimtsForNoReasonCd(blnInitialize) {
	
	// if prefill side no reason code is selected which is not 0_31DAYS 
	// then clear and disable agent side as they are not applicable.....
	if ( bothCurrentAutoPolInForcesHaveNoValues() ) {
		if (isElementExisting("#prefillNoCurrentAutoPolicyReasonCode") 
		&& (isCheckBoxChecked("#prefillNoCurrentAutoPolicyReasonCode"))
		&& $("#prefillNoCurrentAutoPolicyReasonCode").val() != "0_31DAYS" )
		{ 			
			uncheckAndDisableAgentPriorCarrCdAndBiLimits();			
		} 
		else {
			// do agent side enable and disabling if prefill no curr auto pol reason code is not 0_31DAYS
			// since those fields don't exist on prefill side for non 0_31DAYS and agent side may/may not exists.
			if ( $("#prefillNoCurrentAutoPolicyReasonCode").val() != "0_31DAYS" ) {				
				
				// clear checkboxes  and disable if agent no curretn auto policy reason code not checked
				// since the both fields are dependant on the above mentioned field
				if ( isElementExisting("#agentNoCurrentAutoPolicyReasonCodeSelInd")
				&& (!isCheckBoxChecked("#agentNoCurrentAutoPolicyReasonCodeSelInd")) )			
				{
					uncheckAndDisableAgentPriorCarrCdAndBiLimits();
				}
				else { // if checked					
					 // continue to disbale if already 2 fields are checked during load
					// else enable them for selection
					if ( isElementExisting("#agentPriorCarrierCodeSelInd") ) {
						if (isCheckBoxChecked("#agentPriorCarrierCodeSelInd") && blnInitialize ) {
							$("#agentPriorCarrierCodeSelInd").attr("disabled", true);
						} else {
							$("#agentPriorCarrierCodeSelInd").attr("disabled", false);
						}
					}
					
					if ( isElementExisting("#agentPriorCarrierBILimitsSelInd") ) {					
						if (isCheckBoxChecked("#agentPriorCarrierBILimitsSelInd") && blnInitialize) {
							$("#agentPriorCarrierBILimitsSelInd").attr("disabled", true);
						} else {
							$("#agentPriorCarrierBILimitsSelInd").attr("disabled", false);
						}
					}
					
				}
			}
		}
	}
}

function uncheckAndDisableAgentPriorCarrCdAndBiLimits() {
	if ( isElementExisting("#agentPriorCarrierCodeSelInd") ) {
		$('#agentPriorCarrierCodeSelInd').prop('checked', false);
		$("#agentPriorCarrierCodeSelInd").attr("disabled", true);
	}
	
	if ( isElementExisting("#agentPriorCarrierBILimitsSelInd") ) {
		$('#agentPriorCarrierBILimitsSelInd').prop('checked', false);
		$("#agentPriorCarrierBILimitsSelInd").attr("disabled", true);
	}
}

function triggerPrefillChangeEvent(strElm) {
	strElm.trigger('chosen:updated');
	strElm.trigger('chosen:styleUpdated');
}


function getTPVehicleChkBox(index) {
	return ($("#tpVehicleChkBox_" + index).attr('checked'));
}


function getAgentVehicleChkBox(index) {
	return ( $("#agentVehicleChkBox_" + index).attr('checked'));
}


function getVehicleThirdPartyDataId(index) {
	return ($("#vehicleThirdPartyDataId_" + index).val());
}

function getAgentVehicleId(index) {
	return ($("#agentVehicleId_" + index).length > 0) ? $("#agentVehicleId_" + index).val() : null;
	
}

function getVehicleTPDataId(index) {
	return ( $("#vehicleTPDataId_" + index).val());
}

function getPrefillSelectedRejectedStatusCd(index) {
	return ($("#prefillSelectedRejectedStatusCd_" + index).val());
}

function getLicStatusCdForDrvrStatus(strLastIndex) {	

	strAgentDriverStatusCd = $("#agentDriverStatus_" + strLastIndex).val();
	
	if (strAgentDriverStatusCd == null || strAgentDriverStatusCd == 'undefined') {
		strAgentDriverStatusCd = $("#prefillDriverStatus_" + strLastIndex).val();
	}
	
	switch(strAgentDriverStatusCd) {
	    case INSURED_ON_THIS_POLICY: case INSURED_ON_ANOTHER_PRAC: case INSURED_ELSE_WHERE: case AWAY_IN_ACTV_SERVC:
	    	return ACTIVE;	    	
	        break;
	    case SUSPENDED_OPERATOR:	
	    	return SUSPENDED_LICENSE;	    	
	        break;
	    case REVOKED_OPERATOR:	
	    	return REVOKED_LICENSE;	    	
	        break;
	    case NO_LONGER_LICENSED:	
	    	return NO_LONGER_LICENSED;	    	
	        break;
	    case PERMIT:	
	    	return PERMIT;	    	
	        break;
	    case PERMIT:	
	    	return PERMIT;	    	
	        break;
	    case NEVER_LICENSED:	
	    	return NEVER_LICENSED;	    	
	        break;
	    default:	    	
	    	return '';
	}
}

function getLicStateCode(strLastIndex) {
	strAgentDriverStatusCd = $("#agentDriverStatus_" + strLastIndex).val();
	// try to set based on selected driver status code.
	switch(strAgentDriverStatusCd) {
	    case NO_LONGER_LICENSED: case NEVER_LICENSED:	
	    	return NOT_LICENSED;	    	
	        break;
	    default:	    	
	    	// assign selected prefill TP driver state code.(Default)
	    	return $("#tplicStateCd_" + strLastIndex).val();
	}
	
}

function resetAgentAndPrefillChkBoxes(isAgent, blnElmChkBoxChecked) {
	// do the below if both sides of have a current auto policy inforce are different	
	if ( currentAutoPolInForcesAreDifferent() ) {				
		// check same side all elements checked by default if element is checked
		// and also uncheck all opposite checkboxes
		if ( blnElmChkBoxChecked ) {
			if (isAgent == 'Yes') {
				$('input.agentCurrentCarrier').prop('checked', true);
				$('input.prefillCurrentCarrier').prop('checked', false);
			} else {
				$('input.prefillCurrentCarrier').prop('checked', true);
				$('input.agentCurrentCarrier').prop('checked', false);
			}
		}		
	} else {
		// if both sides of have a same auto policy inforces
		// make sure Has a current auto policy inforce is checked(first checkbox)
		// because dependant field is checked
		if (isAgent == 'Yes') { 
			$('#agentActiveCurrentPolicySelInd').prop('checked', true);
			$('#prefillActiveCurrentPolicySelInd').prop('checked', false);
		} else {
			$('#prefillActiveCurrentPolicySelInd').prop('checked', true);
			$('#agentActiveCurrentPolicySelInd').prop('checked', false);
		}
	}	
}

function currentAutoPolInForcesAreDifferent() {
	
	var blnReturn = false;
	
	if ( isElementExisting("#agentActiveCurrentPolicySelInd") && isElementExisting("#prefillActiveCurrentPolicySelInd") ) {
		if ( $("#agentEnteredActiveCurrentPolicyInd").val() != $("#prefillActiveCurrentPolicyInd").val()) {
			blnReturn = true;
		}
	}
	
	return blnReturn;
}

function bothCurrentAutoPolInForcesHaveNoValues() {
	
	var blnReturn = false;
	
	if ( isElementExisting("#agentActiveCurrentPolicySelInd") && isElementExisting("#prefillActiveCurrentPolicySelInd") ) {
		if ( $("#agentEnteredActiveCurrentPolicyInd").val() == 'No'
		&& $("#prefillActiveCurrentPolicyInd").val()  == 'No') {
			blnReturn = true;
		}
	}
	
	return blnReturn;
}

function setBGColor( strElm ) {
	dataRow = $(strElm).parents("tr").first();
	$(dataRow).find( "td:eq( 1 )" ).css("background-color", "#FFFFE0");
	$(dataRow).find( "td:eq( 2 )" ).css("background-color", "#FFFFE0");
	//dataRow.css("background-color", "#FFFFE0");
}

function reSetBGColor(strElm) {
	dataRow = $(strElm).parents("tr").first();
	$(dataRow).find( "td:eq( 1 )" ).css("background-color", "#FFFFFF");
	$(dataRow).find( "td:eq( 2 )" ).css("background-color", "#FFFFFF");
	//dataRow.css("background-color", "#FFFFFF");
}

function setOrResetBGColorForCurrCarrElm (strElm) {
	// do color switch if no agent side elements exist
	if (!blnAgentCheckBoxExists) {
		if ( isElementExisting(strElm) ) {
			if ( isCheckBoxChecked(strElm) ) {
				reSetBGColor(strElm);
			} else {
				setBGColor(strElm);
			}
		}		
	}
}

function setOrResetBGColorForAllCurrCarrElms() {
	setOrResetBGColorForCurrCarrElm("#prefillActiveCurrentPolicySelInd");
	setOrResetBGColorForCurrCarrElm("#prefillNumYrsContinuousCoverageSelInd");
	setOrResetBGColorForCurrCarrElm("#prefillNoCurrentAutoPolicyReasonCodeSelInd");
	setOrResetBGColorForCurrCarrElm("#prefillPriorCarrierCodeSelInd");
	setOrResetBGColorForCurrCarrElm("#prefillPriorCarrierBILimitsSelInd");
}

function isElementExisting(strElm) {
	return ($(strElm).length > 0) ? true : null;
}

function isCheckBoxChecked(strElm) {
	return ($(strElm).attr('checked') == "checked") ? true : false;	
}

function getMaxDriversAddingCount() {
	// check for number of drivers added and newly adding...
	var lastIndex;	
	var strTPDriverChkBox;
	var strAgentDriverId;
	var strDriverStatusCd;	
	var driverCount = 0;
	
	//already exisitng drivers count
	driverCount = $("#aiPreFillForm .agentDriversSeqNum").length;
	
	//get newly selected prefill rated drivers(Not added earlier)	
	$('input.tpDriverChkBox').each(	function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTPDriverChkBox = getTPDriverChkBox(lastIndex);
		
		if (strTPDriverChkBox == "checked") {	
			strAgentDriverId = getAgentDriverId(lastIndex);
			strDriverStatusCd = getDriverStatusCd(lastIndex);
			
			if (strAgentDriverId == null || trimSpaces(strAgentDriverId) == '') {
				if ((strDriverStatusCd  != null) 
						&& (strDriverStatusCd  != 'DELETED') 
						&& (strDriverStatusCd  != 'NLH') 
						&& (strDriverStatusCd  != 'DUP') 
						&& (strDriverStatusCd  != 'DEC')) {
					driverCount++;				
				}
			}
		}
	});
	
	return driverCount;
}

function getMaxVehiclesAddingCount() {
	// check for number of vehicles added and newly adding...
	var lastIndex;	
	var strTPVehicleChkBox;
	var agentVehicleId;
	var strPrefillSelectedRejectedStatusCd;	
	var vehicleCount = 0;
	
	//already exisitng vehicles count
	vehicleCount = $("#aiPreFillForm .agentVehiclesSeqNum").length;
	
	//get newly selected prefill rated vehicles(Not added earlier)	
	$('input.tpVehicleChkBox').each(	function() {
		lastIndex = getIndexOfElementId_prefill(this);
		strTPVehicleChkBox = getTPVehicleChkBox(lastIndex);		
		
		if (strTPVehicleChkBox == "checked") {
			agentVehicleId = getAgentVehicleId(lastIndex);
			strPrefillSelectedRejectedStatusCd = getPrefillSelectedRejectedStatusCd(lastIndex);
			if (agentVehicleId == null || trimSpaces(agentVehicleId) == '') {
				if ( (strPrefillSelectedRejectedStatusCd !='Exclude-Sold' )
						&& (strPrefillSelectedRejectedStatusCd !='Exclude-Named Insured not Registered Owner') 
						&& (strPrefillSelectedRejectedStatusCd !='Exclude-Commercial Vehicle') 
						&& (strPrefillSelectedRejectedStatusCd !='Exclude-Other')) {
					vehicleCount++;
				
				}
			}
		}
	});
	
	return vehicleCount;
}

function setTabIndexForPrefill() {
		
    var tabIndex = 1000;
	
	var selector =  $('#aiPreFillForm table tr td') ;
	var tabOrderElements = $('.tabOrder' , selector);
	
	 tabOrderElements.each( function() {
	
		if($(this).is('select:not(select[multiple])') && (!$(this).attr('disabled'))){
			 var chosenContainer = $(this).next();// this will be the container for the dropdown
			 chosenContainer.find('a').attr('tabindex',tabIndex++);
		 } else {
			 $(this).attr("tabindex", tabIndex++);		
		 }
		
	 });
	 
	 //Assign the starting element to receive focus upon load.
	 
	$("#selectAllAgentData").focus();
	
	
	//set for apply and close
	$(".savePrefill").attr("tabindex", tabIndex++);
	$(".closePrefillModal").attr("tabindex", tabIndex++);

}

function setVarIfCurrentCarrDataChanged(strType) {
	if (strType == 'Agent') {
		if (initialAgentCurrCarrCheckedCount != $('.agentCurrentCarrier:checked').length) {
			blnDataChanged = true;
		}			
	}

	if (strType == 'Prefill') {
		if (initialPrefillCurrCarrCheckedCount != $('.prefillCurrentCarrier:checked').length) {
			blnDataChanged = true;
		}	
	}
}

function setMvrUpdatedIndicatorFromPrefill(action){
	if($('#showPrefillWindow').val()!='true' || !isMVRInitialOrderComplete()){
		return;
	}
	//only during load. pre-set few flags
	if(action!='savePrefill'){
		$('.agentDriverChkBox').each(function(){
			var id=$(this).attr('id');
			var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
			if($('#agentDriverChkBox_'+lastIndex).attr('checked')=='checked'
					&& $('#agentDriverChkBox_'+lastIndex).prop('disabled')!=true){
				$('#isAgentDriverCheckBoxCheckedOrig_'+lastIndex).val('true');
			} else{
				$('#isAgentDriverCheckBoxCheckedOrig_'+lastIndex).val('false');
			}				
		});
		return;
	}
	
	//Clear existing MVR order flags if any and start fresh.
	$('.clsAgentMvrDataUpdatedInd').val('');
	
	//Setting reorder flag for newly added drivers from prefill
	$('.clsAgentChosenAsPrefillDriverInd[value=Yes]').each(function(){
			var id = $(this).attr('id');
			var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
			if($('#agentDriverId_'+lastIndex).val()==null){
				$('#mvrDataUpdatedInd_'+lastIndex).val('Yes');
			}
	});
	
	$('.agentDriverChkBox').each(function(){
		var id=$(this).attr('id');
		var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		if($('#agentDriverChkBox_'+lastIndex).prop('disabled')!=true 
				&&  $('#agentDriverChkBox_'+lastIndex).attr('checked')=='checked'){
			$('#isAgentDriverCheckBoxChecked_'+lastIndex).val('true');
		} else{
			$('#isAgentDriverCheckBoxChecked_'+lastIndex).val('false');
		}				
	});
	
	$('.clsIsAgentDriverCheckBoxChecked').each(function(){
		var id=$(this).attr('id');
		var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		if($(this).val()!=$('#isAgentDriverCheckBoxCheckedOrig_'+lastIndex).val() 
				&& isMvrRelatedDataChanged(lastIndex)
				&& isRatedImpl($('#agentDriverStatus_'+lastIndex).val())){
			$('#mvrDataUpdatedInd_'+lastIndex).val('Yes');
		} else{
			$('#mvrDataUpdatedInd_'+lastIndex).val('');
		}
	});
}

function isMvrRelatedDataChanged(lastIndex){
	if($('#agentEnteredFirstName_'+lastIndex).val()!=$('#tpfirstName_'+lastIndex).val()){
		return true;
	} else if($('#agentEnteredLastName_'+lastIndex).val()!=$('#tplastName_'+lastIndex).val()){
		return true;
	} else if($('#agentEnteredBirthDate_'+lastIndex).val()!=$('#tpbirthDate_'+lastIndex).val()){
		return true;
	} else if($('#agentEnteredlicenseStateCd_'+lastIndex).val()!=$('#tplicStateCd_'+lastIndex).val()){
		return true;
	} else if($('#agentEnteredLicenseNumber_'+lastIndex).val()!=$('#tplicenseNumber_'+lastIndex).val()){
		return true;
	}
	return false;
}

function showPrefillUnsuccessfulMessageIfApplicable(){
	var messageToBeReturned = '';
	var prefillOrderStatus = $("#PREFILL_StatusDesc").val();
	if(prefillOrderStatus == null || prefillOrderStatus.toLowerCase() != 'unsuccessful'){
		 return messageToBeReturned;
	}
	var messageMap = jQuery.parseJSON($("#errorMessages").val()); 
	 var thirdPartyErrorMessages = jQuery.parseJSON($('#thirdPartyPageErrorInfo').val());
	 if(thirdPartyErrorMessages==null || thirdPartyErrorMessages.length==0){
		 return messageToBeReturned;
	 }
	 var message=thirdPartyErrorMessages[0].fieldID+'.server.popUp.'+thirdPartyErrorMessages[0].messageCode;
	 messageToBeReturned = messageMap[message];
	 if(messageToBeReturned==null || messageToBeReturned==''){
		 return messageToBeReturned;
	 }
	 
	 $('#prefillDialog').find('.prefillErrorMessage').show();
	 return messageToBeReturned;
	 
} 
