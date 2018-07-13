

/*














Migrated to accidentViolationTab-enhanced.js. Please look into the enhanced version

















*/

$(function() {
	var rowId_delete = '';
	$('tr.edit_mode').hide();	
	$('#empty_acc_display_mode').hide();
	$('#empty_vio_display_mode').hide();
	$('#empty_com_display_mode').hide();
	$('#empty_unassigned_acc_display_mode').hide();
	$('#empty_unassigned_vio_display_mode').hide();
	$('#empty_unassigned_com_display_mode').hide();
	$('.disp_drv_standby').hide();
	$('#deletedAccVio').hide();
	// hiding new row
	$("tr.drvSepAccVio").hide();
	$("tr.noDriverData").hide();
	$('#logo').parent().attr('tabIndex', 6);	
	var newBusinessMode = $('#newBusinessMode').val();
	var endorsementMode = $('#endorsementMode').val();
	var isQuote = $('#isQuote').val();
	if(endorsementMode == true){
		$('#accVioTabl tr').each(function() {
			$(this).attr('disabled', 'disabled');
		});
	}	
	removeExcludeReasons();	
	/* Leave space for fixed Complete "so & so" application message */
	if($('#completeApplicationAlert').length == 1) {
		$('#mainContent').css('padding-top', '25px');
	}	
	$('#accVioTabl tr').each(function() {
		var selectedDriver = $(this).find('select.selected_driver_class').val();				
		$(this).find('select.exclude_reason_class').val($(this).find('#excludeReasonHidden').val()).trigger('chosen:updated');
		//No need to validate every row (so many unwanted rows in this "each" function)...
		if (this.id != null && this.id != ""
				&& this.id.indexOf('unassigned') == -1
				&& this.id.indexOf('Error') == -1
				&& this.id.indexOf('driver_row') == -1
				&& this.id.indexOf('saveCancel_btn') == -1
				&& this.id.indexOf('selectDriverTo') == -1
				&& this.id.indexOf('_display_mode') == -1){
			if($(this).find('td.exclude_reason span#id_disp input[type=hidden]')!=null 
				&& $(this).find('td.exclude_reason span#id_disp input[type=hidden]').val()=='None'){
					var driverId = $(this).closest('tr').find('td.assigned_driver  span.id_disp input[type=hidden]')[0].value;
					var selectedDriverElem = $(this).closest('tr').find('td.assigned_driver  span.disp_drv select.selected_driver_class')[0];
					var selectedExcludReasonElem =$(this).closest('tr').find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0];
					defaultExcludeReason(selectedDriverElem,selectedExcludReasonElem,driverId);
			}
		}
		var excludeRowValue = $(this).find('#excludeRowIndicator').val();
		if (excludeRowValue == 'Yes') {
			$(this).closest('tr').find(
					"td.display_state span.ex_re input[type='hidden']")
			.setValue("DELETE");
			$(this).hide();
		}
	});
	$('#removeAccVioTabl tr').each(
		function() {
			var excludeRowValue = $(this).find(
					'#excludeRowIndicator').val();
			if ((excludeRowValue == 'No' || excludeRowValue == '' || excludeRowValue == null)
					&& $(this).attr('class') == 'display_mode') {
				$(this).hide();
			}
		});

	$(document).on("click","span[id^='addBackDriver']",
			function(e) {
				var acc_rowId_All = $(this).attr('id');
				var acc_rowId = acc_rowId_All.substring(acc_rowId_All
						.indexOf("_") + 1, acc_rowId_All.length);
//				$(this).closest('tr').hide();
				$(this).closest('tr').remove();
				var driverIdEndIndex = acc_rowId.indexOf('_');
				var driverId = acc_rowId.substr(0,driverIdEndIndex);
				$('#accVioTabl tr').each(
					function() {
						if ($(this).attr('id') == "acc_" + acc_rowId
								|| $(this).attr('id') == "vio_" + acc_rowId
								|| $(this).attr('id') == "other_acc_" + acc_rowId
								|| $(this).attr('id') == "other_vio_" + acc_rowId) {
							$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]')
									.setValue('');
							$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]')
									.setValue('No');
							$(this).find("td.display_state span.ex_re input[type='hidden']").setValue('');
							$(this).show();
						}
					});
//				alert($("#removeAccVioTabl tr[id*='rem_acc_"+driverId+"']").length+'......'+$("#removeAccVioTabl tr[id*='rem_vio_"+driverId+"']").length);
				if($("#removeAccVioTabl tr[id*='rem_acc_"+driverId+"']").length==0 
						&& $("#removeAccVioTabl tr[id*='rem_vio_"+driverId+"']").length==0
						&& $("#removeAccVioTabl tr[id*='rem_other_acc_"+driverId+"']").length==0
						&& $("#removeAccVioTabl tr[id*='rem_other_vio_"+driverId+"']").length==0){
					$('#rem_driver_row_'+driverId).remove();
				}
			}
		);

//	$('#aiForm').bind(getSubmitEvent(), function(event, result){		
//		handleSubmit(event);
//	});
	
	 var quoteErrorFlag = $('#quoteErrorFlag').val();
	 if(quoteErrorFlag == "QUOTEERROR") {
		 $('#quoteError').modal('show'); 
	 }
	 
	 $(".submitAccidentsViolations").bind("click", function(){
		$('#quoteError').modal('hide'); 
		document.actionForm.action = '/aiui/accidentsViolations';
		document.actionForm.method="GET";
		document.actionForm.submit();
	});
	
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	var accVioCount = parseInt($('#accVioList_Count').val());
	$(".tabNextButtonAccident").click(function() {
		nextTab(document.aiForm.currentTab.value, this.id);
	});
	$(".closeModal").click(function(){
		$('div.incompletePageModal').hide();
	});	

	$(".clsAccVioDate").datepicker({
		showOn : "button",
		buttonImage : "/aiui/resources/images/cal_icon.png",
		buttonImageOnly : true,
		buttonText : 'Open calendar',
		dateFormat : 'mm/dd/yy',
		showButtonPanel : true
	/*
	 * buttonImage: "resources/images/calendar.png",
	 * dateFormat:'mm/dd/yy',showButtonPanel : true
	 */
	});
	if(endorsementMode == true && isQuote == true){
		$('#addAccVioDisable').show();
		$('#addAccVio').hide();
	}else{
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
	}	
	var fromPrefill = $('#fromPrefill').val();
	var reportOrderStatus = $('#orderReportResponse').val();
	var accVioYesNo = $('input[name=hasAccVio]').val();
	var showViewRemovedAccidentsAndViolations = $(
			'#showViewRemovedAccidentsAndViolations').val();
	var showViewReportOrderStatusDetails = $(
			'#showViewReportOrderStatusDetails').val();
	var showViewViolationAbstractPopup = $('#showViewViolationAbstractPopup')
			.val();
	var showViewClaimAbstractPopup = $('#showViewClaimAbstractPopup').val();
	var orderThirdPartyResponseClean = $('#orderThirdPartyResponseClean').val();
	var orderThirdPartyResponseReview = $('#orderThirdPartyResponseReview').val();
	var showTabsErroneousPopupFlag = $('#showTabsErroneousPopupFlag').val();
	var showPrefillRequiredPopupFlag = $('#showPrefillRequiredPopupFlag').val();
	var showInvalidDriverLicenseFlag = $('#showInvalidDriverLicenseFlag').val();
	var showInvalidVinPopupFlag = $('#showInvalidVinFlag').val();
	
	var notOrderedFlag = $('#notOrderedFlag').val();
	var accVioExistsEndorsement = $('#accVioExistsEndorsement').val();
	var newEndorsementRatedDriver = $('#newEndorsementRatedDriver').val();
	var primaryDriverId = $('#primaryDriverId').val();
	var containsExcluded = $('#containsExcluded').val();
	var userAthorizedToOrder = $('#userAthorizedToOrder').val();
	
	if(containsExcluded != 'true'){
		$('#viewRemovedAccidentsAndViolationsLink').hide();
		$('#pipeSeparatorSpan').hide();
	}else{
		$('#viewRemovedAccidentsAndViolationsLink').show();
		$('#pipeSeparatorSpan').show();
	}
	
	if (showViewRemovedAccidentsAndViolations != 'true'
			&& showViewReportOrderStatusDetails != 'true'
			&& showViewViolationAbstractPopup != 'true'
			&& showViewClaimAbstractPopup != 'true' 
			&& orderThirdPartyResponseClean != 'true' 
			&& orderThirdPartyResponseReview != 'true'
			&& showTabsErroneousPopupFlag != 'true'
			&& showPrefillRequiredPopupFlag != 'true'
			&& showInvalidDriverLicenseFlag != 'true'
			&& showInvalidVinPopupFlag != 'true') {
		if(newBusinessMode == 'true'){
			if (accVioCount == 0 && fromPrefill == 'false' && notOrderedFlag == 'true' && userAthorizedToOrder == 'false'){// || notOrderedFlag == 'true') {
				$('#manualView').hide();
				$("#accVioNo").prop('checked', true);
				$('input[name=hasAccVio]').removeAttr('disabled');
				$('#accVioAddTable').hide();
				$('#manualViewDescTableId').hide();
				$('#reportStatusDetailsSpan').hide();
				$('#reportsTableId').hide();
				$('#reportsMessageTableId').hide();
			} else{	
				$("#accVioYes").prop('checked', true);
				$('#accVioAddTable').show();
				$('#manualViewDescTableId').show();
				if(accVioCount > 0){
					$('input[name=hasAccVio]').attr('disabled', 'disabled');
					$('#manualView').show();
				}else{
					$('input[name=hasAccVio]').removeAttr('disabled');
					$('#manualView').hide();
				}				
				$('#reportStatusDetailsSpan').show();
				$('#reportsTableId').show();
				$('#reportsMessageTableId').show();
			}
		}else{
			if(accVioExistsEndorsement == 'true' || newEndorsementRatedDriver == 'true'){
				$('#manualView').show();
				if(newEndorsementRatedDriver == 'true'){
					$("#accVioNo").prop('checked', true);
					$('input[name=hasAccVio]').removeAttr('disabled');
					$('#addAccVioDisable').hide();
					$('#addAccVio').show();
					$('#reportStatusDetailsSpan').show();
					$('#reportsTableId').show();
					$('#reportsMessageTableId').show();
				}else{
					$("#accVioYes").prop('checked', true);
					//$('input[name=hasAccVio]').attr('disabled', 'disabled');
					$('#hasAnyDriversRadioTrId').hide();
					$('#addAccVioDisable').show();
					$('#addAccVio').hide();
					$('#reportStatusDetailsSpan').hide();
					$('#reportsTableId').hide();
					$('#reportsMessageTableId').hide();
				}				
				$('#accVioAddTable').show();
				$('#manualViewDescTableId').show();
				
			} else {
				if(accVioCount == 0){
					$('#manualView').hide();
					$('#accVioTabl').hide();
					$("#accVioNo").prop('checked', true);
					$('#accVioAddTable').hide();
					$('#manualViewDescTableId').hide();
					//$('input[name=hasAccVio]').attr('disabled', 'disabled');
					$('#reportStatusDetailsSpan').hide();
					$('#reportsTableId').hide();
					$('#reportsMessageTableId').hide();
				}else{
					$('#manualView').show();
					$("#accVioNo").prop('checked', true);
					$('#accVioAddTable').hide();
					$('#accVioTable').hide();
					$('#manualViewDescTableId').hide();
					$('input[name=hasAccVio]').removeAttr('disabled');
					$('#reportStatusDetailsSpan').hide();
					$('#reportsTableId').hide();
					$('#reportsMessageTableId').hide();
					$('#hasAnyDriversRadioTrId').hide();
				}
			}
		}
	} else {
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
		if (accVioYesNo == 'No') {
			$("#accVioNo").prop('checked', true);
		} else if (accVioYesNo == 'Yes') {
			$("#accVioYes").prop('checked', true);
		}
	}

	$("input:radio[name=hasAccVio]").click(function() {
		var value = $(this).val();
		if (value == 'Yes') {
			$('#accVioAddTable').show();
			$('#addAccVioDisable').hide();
			$('#manualViewDescTableId').show();
			$('#reportStatusDetailsSpan').show();
			$('#reportsTableId').show();
			$('#reportsMessageTableId').show();
			// $('#accVioTabl').show();
			// $('#manualView').show();
			//$('input[name=hasAccVio]').attr('disabled', 'disabled');
			$('#addAccVio').show();
		} else if(value == 'No') {
			$('#accVioAddTable').hide();
			$('#addAccVioDisable').hide();
			$('#manualView').hide();
			$('#manualViewDescTableId').hide();
			$('#reportStatusDetailsSpan').hide();
			$('#reportsTableId').hide();
			$('#reportsMessageTableId').hide();
			// $('input[name=hasAccVio]').attr('disabled', 'disabled');
		}
	});

//	$('#addAccVio').click(function() {
//		// $('#accVioAddTable').show();
//		$('#manualView').show();
//		$("#accVioTabl").show();
//		// //$('#addAccVioDisable').show();
//		// //$(this).hide();
//	});

	$(document).on("change","#edType",
					function() {
						// $("#edType").live("change",function(){
						type = $(this).val();
						var updatingId = $(this).closest('tr').prop('id');
						var ddId = updatingId + '_accVioDesc';

						if (type == 'Accident' || type == 'Comp Clm') {
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv")
									.replaceWith(
											$('tr[class^="edit_mode"]').find(
													'td.edit_desc_acc').html());
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv select")
									.prop('id', ddId);
							/*$(this).closest('tr').find(
									'span[id^="editAccSelectBoxIt"]').remove();
							$(this).closest('tr').find(
									'span[id^="editAccSelectBoxItContainer"]')
									.remove();*/
							$(this).closest('tr').find('div[id$="editAcc_chosen"]').remove();
							var selectAccVioDesc = $('#' + ddId);
							addSelectBoxItForAccViol(selectAccVioDesc);
							$('#' + ddId).trigger('chosen:updated');
						}
						if (type == 'Comp Clm') {
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv")
									.replaceWith(
											$('tr[class^="edit_mode"]').find(
													'td.edit_desc_com').html());
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv select")
									.prop('id', ddId);
							/*$(this).closest('tr').find(
									'span[id^="editComSelectBoxIt"]').remove();
							$(this).closest('tr').find(
									'span[id^="editComSelectBoxItContainer"]')
									.remove();*/
							$(this).closest('tr').find('div[id$="editCom_chosen"]').remove();
							var selectAccVioDesc = $('#' + ddId);
							addSelectBoxItForAccViol(selectAccVioDesc);
							$('#' + ddId).trigger('chosen:updated');
						}
						if (type == 'Violation') {
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv")
									.replaceWith(
											$('tr[class^="edit_mode"]').find(
													'td.edit_desc_vio').html());
							$(this).closest('tr').find(
									"td.display_desc span.disp_drv select")
									.prop('id', ddId);
							/*$(this).closest('tr').find(
									'span[id^="editVioSelectBoxIt"]').remove();
							$(this).closest('tr').find(
									'span[id^="editVioSelectBoxItContainer"]')
									.remove();*/
							$(this).closest('tr').find('div[id$="editVio_chosen"]').remove();
							var selectAccVioDesc = $('#' + ddId);
							addSelectBoxItForAccViol(selectAccVioDesc);
							$('#' + ddId).trigger('chosen:updated');
							// refreshSelectBoxIt($('#'+ddId));
						}
					});

	// adding accident/violation for user
	$(document).on("click", "#addAccVio", function() {
		// $('#addAccVio').live("click",function(e){
		$('#manualView').show();
		$("#accVioTabl").show();
		$('tr[class^="selectDriverToAdd"]').toggle();
		$('tr[class^="selectDriverToAddNext"]').show();
		
		var riskState = $('#riskState').val();
		$('#select_state_addicent_vio_id').val(riskState);
		$('#select_state_addicent_vio_id').trigger('chosen:updated');
		
		// alert('destroy all plugin..');
		// $("SELECT").selectBoxIt('destroy');
		$("#accVioTabl tr.display_mode").each(function() {
			$(this).prop('disabled', true);
		});
		$('#addAccVio').hide();
		$('#addAccVioDisable').show();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
	});

	//TODO why is this being hidden??? commenting below 2 lines for now
	//$('.disp_drv_vio').hide();
	//$('.disp_drv_com').hide();

	$('.typeAccVio').change(function() {
		if(this.id==''){
			return false;
		}
		if ($(this).val() == 'Accident') {
			$(this).closest('tr').find('.disp_drv_vio').hide();
			$(this).closest('tr').find('.disp_drv_com').hide();
			$(this).closest('tr').find('.disp_drv_acc').show();
			var selectId = $(this).closest('tr').find('td.display_desc span.disp_drv_acc select.descriptionAccVio').attr("id");
			addSelectBoxItForAccViol($('#' + selectId));
			
			var assignedDriverBox = $(this).closest('tr').find('td.assignedDriverAccVio span.disp_drv select');
			var driverSelected = $(assignedDriverBox).val();
			if(driverSelected == 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('').prop('disabled',false).trigger('chosen:updated');
			}
		} else if ($(this).val() == 'Violation') {
			$(this).closest('tr').find('.disp_drv_vio').show();
			var selectId = $(this).closest('tr').find('td.display_desc .disp_drv_vio select.descriptionAccVio').attr("id");
			addSelectBoxItForAccViol($('#' + selectId));
			$(this).closest('tr').find('.disp_drv_acc').hide();
			$(this).closest('tr').find('.disp_drv_com').hide();
			var assignedDriverBox = $(this).closest('tr').find('td.assignedDriverAccVio span.disp_drv select');
			var driverSelected = $(assignedDriverBox).val();
			if(driverSelected == 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('').prop('disabled',false).trigger('chosen:updated');
			}
		} else if ($(this).val() == 'Comp Clm') {
			$(this).closest('tr').find('.disp_drv_com').show();
			var selectId = $(this).closest('tr').find('td.display_desc .disp_drv_com select.descriptionAccVio').attr("id");
			addSelectBoxItForAccViol($('#' + selectId));
			$(this).closest('tr').find('.disp_drv_vio').hide();
			$(this).closest('tr').find('.disp_drv_acc').hide();
			var assignedDriverBox = $(this).closest('tr').find('td.assignedDriverAccVio span.disp_drv select');
			var driverSelected = $(assignedDriverBox).val();
			if(driverSelected != 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('No Driver-Comp Clm').prop('disabled',true).trigger('chosen:updated');
				$(assignedDriverBox).prop('disabled',true).trigger('chosen:updated');	
			}
			$(assignedDriverBox).removeClass('inlineError').trigger('chosen:styleUpdated');
			if($(this).closest('tr').hasClass('selectDriverToAdd')){
				$('.selectDriverToAddNext').find('td#selectDriverToAdd_selected_assigned_driver_id_Error_Col span').text('');
			}
			$(this).prop('disabled',true).trigger('chosen:updated');
		}
		
	});
	
	$(document).on("click",".addSelectedUnassigned",function(e){
		accVioCount++;
		//Get the required details to be added entered in Add Accident/Violation button
		//var selectedUnassignedDriverTrId = $(this).closest('tr').attr("id");
		var containerTr = $(this).closest('tr');
		var unassignedDriverId = $(containerTr).attr("id").replace('_Error','');
		//var basicDriverIdArray = unassignedDriverId.replace('unassigned_','').split('_').slice(1);
		//var basicDriverId = basicDriverIdArray.join('_');
		
		var driverId = $('#'+unassignedDriverId+'_assignedDriver').val();
		var idArray = unassignedDriverId.split('_');
		var accVioIndex = "";
		var accVioListIndex = "";
		
		if(idArray != null || idArray != undefined){
			var accVioIndex = idArray[idArray.length-1];
			var accVioListIndex = idArray[idArray.length-2];
			
		}
		//var assignedDriverName = $('#'+unassignedDriverId+ ' option:selected').text();
		var relevantTr = $('#'+unassignedDriverId);
		var selectEdDt = $(relevantTr).find('td.display_date span.disp_drv').text();
		var accVioType = $(relevantTr).find('td.display_type span.disp_drv').text();
		
		//var accVioExcludeReason = $('.exclude_reason_class option:selected').val();
		//var accVioExcludeReasonTxt = $('.exclude_reason_class option:selected').text();
		
		var accVioExcludeReason = $($('#'+unassignedDriverId+'_accVioExcludeReason')[0]).val();
		var accVioExcludeReasonTxt = $($('#'+unassignedDriverId+'_accVioExcludeReason')[0]).find(":selected").text();
		
		var srchR = '';
		var accVioId = '';
		var accVioDesc = '';
		var accidentId = $(relevantTr).find("td.display_desc span.acc_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accVioIndex +".accidentId']").val();
		var accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accVioIndex +".accidentDescId']").val();
		//var excludeReason = $(relevantTr).find("td.exclude_reason span#id_disp input[type=hidden]").val();
		var otherCategory = false;
		var selectedValue = "";
		var typeString = "";
		
		selectedValue = driverId;
		
		/**  		
		 *  Validate unassigned driver before adding    
		 **/		
		validateField($('#'+unassignedDriverId+'_assignedDriver')[0],$('#'+unassignedDriverId+'_assignedDriver')[0].id,'required');
		if(driverId=="" || driverId=="Select"){
			driverId="";
			return false;
		}		
		if(!validateCompClaim($('#'+unassignedDriverId+'_assignedDriver')[0],accVioType)){
			return false;
		}
		if(!validateExcludeReason($('#'+unassignedDriverId+'_assignedDriver')[0],$('#'+unassignedDriverId+'_accVioExcludeReason')[0],driverId,$(relevantTr).find('td.display_datasource span.disp_dd').text())){
		//if(!validateExcludeReason($('#'+unassignedDriverId+'_assignedDriver')[0],$('.exclude_reason_class option:selected')[0],driverId,$(relevantTr).find('td.display_datasource span.disp_dd').text())){
			return false;
		}
		
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
		
		$("#accVioTabl tr.display_mode").each(function(){
			$(this).prop('disabled',false);
		});
		
		//acc_164513_2_0
		//unassigned_acc_164513_0_1_assignedDriver
		if(accVioType=='Accident' || accVioType.toLowerCase()=='comp clm'){
			if(selectedValue =='Friend or Relative' || selectedValue=='No Driver-Comp Clm' || selectedValue=='Unknown Driver' || selectedValue =='Deceased HH Member' || accVioType.toLowerCase()=='comp clm'){
				otherCategory = true;
				driverId = primaryDriverId;
			}
			accVioDesc = $(relevantTr).find('td.display_desc span.disp_drv').text();
			if(otherCategory){
				srchR='other_acc_'+driverId;
				typeString = 'accidents';
			}else{
				srchR='acc_'+driverId;
				typeString = 'accidents';
			} 
		}
//		else if(accVioType=='Violation'){
//			accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".violations"+ accVioIndex +".violationDescId']").val();//input[id^=]
//			accVioDesc = 	$('.unassigned_selected_populated_desc_class_violation option:selected').text();
//			if(otherCategory){
//				srchR='other_vio_'+driverId;
//			}else{
//				srchR='vio_'+driverId;
//			} 
//		}
		/*var selectDriverOnReport = $('#selectDriverOnReport').val();*/
		
		//where do they come from..
		var selectedSource = $(relevantTr).find('td.display_datasource span.disp_dd').text();
		var selectedState =  $(relevantTr).find('td.display_state span.disp_drv').text();
		var driverOnReport = $(relevantTr).find("td.assigned_driver span.disp_drv span.driverOnReportSpan").text();
		//var selectedExcludeReason = '-';
		
		//display the driver ID row seperator it's always there
		if(otherCategory){
			$("otherDiv").show();
			$('#other_driver_row').show();
		}else{
			$('#driver_row_'+driverId).show();
		} 
		/*
			alert('selected state = '+selectedState);
		 	var stateId = $('.selected_driver_class option:selected').val();
		 	var assignedDriverName = $('.selected_driver_class option:selected').text();
			alert('driver id = '+$('.selected_driver_class option:selected').val());
			alert('dirver desc ='+$('.selected_driver_class option:selected').text());
			alert($('#selectEdType').val());
			alert('accVio Id = '+accVioId+'accVioDesc = '+accVioDesc);
			alert('selectEdDt = '+selectEdDt);
			alert('== == srch row = '+srchR);
			alert($('tr[id^="'+srchR+'"]').filter(":last").html());
		*/
		var trLastOccurence = $('tr[id^="'+srchR+'"]').filter(":last");
		if(driverId == primaryDriverId){
			trLastOccurence = $('tr[id^="other_'+srchR+'"]').filter(":last");
		}
		
		var idVal = trLastOccurence.attr('id');
		//  this driver has the accident/vio that agent is trying to add now get the row clone it and insert it back
		if(idVal!=null){
			var trFirstOccurence = $('tr[id^="'+srchR+'"]').filter(":first");
			if(driverId == primaryDriverId){
				trFirstOccurence = $('tr[id^="other_'+srchR+'"]').filter(":first");
			}
			var ndxToPickup = 0;
			var lastOccuranceArray = trLastOccurence.attr('id').split('_');
			var firstOccuranceArray = trFirstOccurence.attr('id').split('_');			
			if(otherCategory || driverId == primaryDriverId){
				if(lastOccuranceArray!=null && firstOccuranceArray!=null && lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[4]>lastOccuranceArray[4])
				{
					ndxToPickup = firstOccuranceArray[4];
				}
			}else{
				if(lastOccuranceArray!=null && firstOccuranceArray!=null && lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[3]>lastOccuranceArray[3])
				{
					ndxToPickup = firstOccuranceArray[3];
				}
			}			
			var accVioLastOccIdArray = idVal.split('_');
			if(accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm'){
				//alert('Accident exists for Add ');	
				var accVioListIndex = '';
				var accIndex = 0;
				if(otherCategory || driverId == primaryDriverId){
					accVioListIndex = parseInt(accVioLastOccIdArray[3]);
					accIndex = parseInt(accVioLastOccIdArray[4]);
				}else{
					accVioListIndex = parseInt(accVioLastOccIdArray[2]);
					accIndex = parseInt(accVioLastOccIdArray[3]);
				}				
				if(ndxToPickup!=null){
					accIndex = ndxToPickup;
				}
				
				//var currAcc = 'accidents'+accIndex;
				//accIndex = parseInt(accIndex)+1;
				//accIndex = $('tr[id^="'+srchR+'"]').length + 1;
				//var nextAcc = 'accidents'+accIndex;
				//alert('next accVioListIndex='+accVioListIndex+'next accNdx = '+accIndex);
			   //alert('nextAcc = '+nextAcc);
			   //ok start building the updated row..
			   //assigned driver
				
			   //TODO revisit logic to make sure this can handle all scenarios
			   var trClone = $('#empty_unassigned_acc_display_mode').clone();
			   
			   var accTrs = $("tr[id^=acc_" +driverId+'_'+accVioListIndex+'_' +"]");
			   var otherAccTrs = $("tr[id^=other_acc_" +driverId+'_'+accVioListIndex+'_' +"]");
			   var idArrayAcc = [];
			   $(accTrs.get()).each( function() {
			       var splitIdArray = $(this).attr('id').split('_');
			       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
			   });
			   $(otherAccTrs.get()).each( function() {
			       var splitIdArray = $(this).attr('id').split('_');
			       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
			   });
			   var maxAccId = (idArrayAcc.sort(function(a,b){return b-a;})[0]);
			   
			   if(parseInt(maxAccId) >= 0){
				   accIndex = parseInt(maxAccId) + 1;
				   nextAcc = typeString + accIndex;
			   }else{
				   nextAcc = typeString + accIndex;
			   }
			   
			   var nextRowHeader ='';
			   if(otherCategory){
				   nextRowHeader ='other_acc_'+driverId+'_'+accVioListIndex+'_'+accIndex;
			   }else{
				   nextRowHeader ='acc_'+driverId+'_'+accVioListIndex+'_'+accIndex;
			   }
			   
			   if(maxAccId != 0 && !otherCategory && driverId != primaryDriverId){
				   accidentId = $(relevantTr).find("td.display_desc span.acc_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accIndex +".accidentId']").val();
				   accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accIndex +".accidentDescId']").val();
			   }

			   //buildRows(trClone,accVioListIndex,accIndex,true,'acc');
			   trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverId');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.driverId');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
			   
			   trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
			    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
			    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioListIndex);
			 
			   if(endorsementMode == 'true'){
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].addedInEndorsementInd');
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.addedInEndorsementInd');
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
			   } 
			   
			   trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").text(driverOnReport);
			   trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").removeClass('emptyDriverOnReportSpan').addClass('driverOnReportSpan');
			   
			   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name','dto.accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverName');
			   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id','dto.accidentViolationList'+accVioListIndex+'.'+ typeString +'.driverName');
			   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));
			   
				// Violation or loss date
			   	// trClone.find('td.display_date span.disp_drv').text(selectEdDt);
			   	trClone.find('td.display_date span.disp_drv').prop('id',nextRowHeader+'_accVioDt');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.accidentDate');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].accidentDate');
				trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
				//Type
				//trClone.find('td.display_type span.disp_drv').text('Accident');
				trClone.find("td.display_type span.disp_drv").prop('id',nextRowHeader+'_accVioType');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.type');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].type');
				
				if(accVioType == 'Accident'){
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');	
					if(otherCategory){
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverTypeCd');
						if(selectedValue == 'Friend or Relative'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');
						}else if(selectedValue == 'No Driver-Comp Clm'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
						}else if(selectedValue == 'Unknown Driver'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
						}else if(selectedValue =='Deceased HH Member'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
						}
					} else{
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
					} 
				}else{ 
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
					
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.driverTypeCd');
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverTypeCd');
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C'); 
				}
				
				//description
				//trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
				trClone.find('td.display_desc span.disp_drv').prop('id',nextRowHeader+'_accVioDesc');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.accidentDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].accidentDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
					
				//sticking in acc_id
				trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.accidentId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].accidentId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue(accidentId);
				
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.accidentDesc');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].accidentDesc');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
				//state
				trClone.find('td.display_state span.disp_drv').prop('id',nextRowHeader+'_accVioState');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.accidentStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].accidentStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					
				//source
				trClone.find('td.display_datasource span.disp_dd').text(selectedSource);
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(selectedSource);
				
				//operation
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('');
					
				//exclude reason Delete Link
				//<td class="exclude_reason excludeReasonAccVio"><span id="tmpAccDeleteDriverId" class="exclude_dd_reason">Delete Driver</span></td>
				
				trClone.find('td.exclude_reason span.exclude_dd_reason select').prop('id',nextRowHeader+'_accVioExcludeReason');
				trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.excludeReasonCd');
				trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].excludeReasonCd');
				trClone.find('td.exclude_reason span#id_disp input[type=hidden]').setValue(accVioExcludeReason);
				//trClone.find('td.exclude_reason span.id_disp input[type=hidden]').setValue(accVioExcludeReason);
				
				if(accVioExcludeReason != 'None'){
					
				}
				
				//driver type cd for accidents/claims
//				trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+nextAcc+'.driverTypeCd');
//				trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].accidents['+accIndex+'].driverTypeCd');
//				trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').setValue('A');
				
				//source exclude reason
				//Ok fade the row as you add them change blue white to yellow and back to blue or white
				//$('tr[id^="'+srchR+'"]').filter(":last").hide();
				
				var driverNameRowHeaderFilter = '';
				if(otherCategory){
					driverNameRowHeaderFilter = "other_driver_row";
				}else{
					driverNameRowHeaderFilter = "driver_row_"+driverId;
				} 
				
				//var newRow = $('<tr id="'+nextRowHeader+'" class="display_mode orangeColor"><td class="newlyAdd">classsic</td></tr>');
				$('tr[id^="'+driverNameRowHeaderFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				$('td.newlyAdd').replaceWith(trClone.html());
				
				var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
				//alert('add next row template = '+nextAddRowTemplate.html());
				var nextErrorRowId ='acc_Error_'+driverId+'_'+accVioListIndex+'_'+accIndex;
				nextAddRowTemplate.find('button').prop('id','modify_*acc_'+driverId+'_'+accVioListIndex+'_'+accIndex);
				nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_assignedDriver_Error_Col');
				nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioDt_Error_Col');
				nextAddRowTemplate.find('td.edType_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_edType_Error_Col');
				nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioDesc_Error_Col');
				nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioState_Error_Col');
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
			
				/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="emptyExcludeReasonCdSelectBoxItContainer"]').remove();*/
				
				//Rewriting the above code which is redundant and selector is way t0o heavy.
				//All it needs to remove the dropdown container in the row
				$('tr[id^="'+nextRowHeader+'"]').each( function() {
					 $(this).find('div[id$="_chosen"]').remove();
				});
				
				
				//var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
				//addSelectBoxItForAccViol(selectAccVioDesc);
				var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
				addSelectBoxItForAccViol(selectAssignedDriver);
				//var selectState = $('#'+nextRowHeader+'_accVioState');
				//addSelectBoxItForAccViol(selectState);
				var excludeReasonDropDown = $('#'+nextRowHeader+'_accVioExcludeReason');
				addSelectBoxItForAccViol(excludeReasonDropDown);
	
				if(otherCategory){
					if(accVioType.toLowerCase() == 'comp clm'){
						$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');
						$('#'+nextRowHeader+'_assignedDriver').prop('disabled', true);
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(selectedValue).trigger('chosen:updated');
					}
				}else{
					$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
				} 
				
				$('#'+nextRowHeader+'_accVioDt').text(selectEdDt);
				$('#'+nextRowHeader+'_accVioType').text(accVioType);
				$('#'+nextRowHeader+'_accVioDesc').text(accVioDesc);
				$('#'+nextRowHeader+'_accVioState').text(selectedState);
				
				$('#'+nextRowHeader+'_accVioExcludeReason').val(accVioExcludeReason).trigger('chosen:updated');
				
	//			$('#'+nextRowHeader+'_accVioDt').datepicker({
	//				showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
	//				dateFormat: 'mm/dd/yy',showButtonPanel : true		
	//			});
				
				highlightRow(nextRowHeader);
				//Reset the drop downs to default after values are read
				resetAddDefaultSelections();
			}
			//if(accVioType == 'Violation'){}
		}
		
		// Agent adding accident but the user does not have
		// accident but has a violation and viceversa
		// Check for row of accident OR violation that driver
		// has which agent is adding acc/vio against
		if (idVal == null || idVal == undefined) {
			// alert('... alter the acc vio change ...');
			if (accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm') {
				if(otherCategory){
					srchR = 'other_vio_'+driverId;
				}else{
					srchR = 'vio_'+driverId;
				} 
			}
//			if (accVioType == 'Violation') {
//				 if(otherCategory){
//					 srchR = 'other_acc_'+driverId;
//				}else{
//					 srchR = 'acc_'+driverId;
//				} 
//			}

			trLastOccurence = $('tr[id^="' + srchR + '"]')
					.filter(":last");
			idVal = trLastOccurence.attr('id');

			tr = $('tr[id^="' + srchR + '"]').filter(":last");
			idVal = tr.attr('id');
			// alert('idVal = '+idVal);
			if (idVal != null) {
				// alert('this driver has a accident or
				// violation recorded');
				var accVioLastOccIdArray = idVal.split('_');
				if (accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm') {
					var accVioListIndex = parseInt(accVioLastOccIdArray[2]);
					var nextRowHeader = 'acc_' + driverId + '_'
							+ accVioListIndex + '_0';
					var accIndex = 0;

					var trClone = '';
					if(accVioType == 'Accident'){
						trClone = $('#empty_unassigned_acc_display_mode')
						.clone();
					}else{
						trClone = $('#empty_unassigned_com_display_mode')
						.clone();
					}
					// alert('clojned row acc = '+trClone);
					// start
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]')
							.attr('id','accidentViolationList'
											+ accVioListIndex
											+ '.'+typeString+'0.driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]')
							.setValue(driverId);
					trClone.find("td.assigned_driver span.disp_drv select")
							.prop('id', nextRowHeader + '_assignedDriver');
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioListIndex);
					
					if(endorsementMode == 'true'){
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].addedInEndorsementInd');
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+typeString+'0.addedInEndorsementInd');
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
					}
					
					trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").text(driverOnReport);
					trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").removeClass('emptyDriverOnReportSpan').addClass('driverOnReportSpan');
					
				    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name','dto.accidentViolationList['+accVioListIndex+'].'+typeString+'['+accIndex+'].driverName');
				    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id','dto.accidentViolationList'+accVioListIndex+'.'+ typeString +'0.driverName');
				    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));

					// violation or loss date
					// trClone.find('td.display_date
					// span.disp_drv').text(selectEdDt);
					trClone.find('td.display_date span.disp_drv input')
							.prop('id', nextRowHeader + '_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]')
							.attr('id', 'accidentViolationList'
											+ accVioListIndex
											+ '.'
											+ ''+typeString+'0.accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]')
							.setValue(selectEdDt);

					// trClone.find('td.display_type
					// span.disp_drv').text('Accident');
					trClone.find("td.display_type span.disp_drv select")
							.prop('id',nextRowHeader+ '_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]')
							.attr('id','accidentViolationList'+accVioListIndex+'.'+''+typeString+'0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'[0].type');
					if (accVioType == 'Accident') {
						trClone.find('td.display_type span.id_disp input[type=hidden]')
						.setValue('Accident');
					}else{
						trClone.find('td.display_type span.id_disp input[type=hidden]')
						.setValue('Comp Clm');
					}
					
					if(accVioType == 'Accident'){
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');	
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+''+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'[0].driverTypeCd');
							if(selectedValue == 'Friend or Relative'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');
							}else if(selectedValue == 'No Driver-Comp Clm'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
							}else if(selectedValue == 'Unknown Driver'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
							}
							else if(selectedValue =='Deceased HH Member'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
							}
						}else{
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
						}
					}else{
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
						
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioListIndex+'.'+''+typeString+'0.driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioListIndex+'].'+typeString+'[0].driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C'); 
					}
					
					// description
					// trClone.find('td.display_desc
					// span.disp_drv').text(accVioDesc);
					trClone.find('td.display_desc span.disp_drv select')
							.prop('id',nextRowHeader+ '_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]')
							.attr('id','accidentViolationList'
											+ accVioListIndex
											+ '.'
											+ ''+typeString+'0.accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]')
							.setValue(accVioId);

					trClone.find("td.display_state span.disp_drv select").prop('id',nextRowHeader+ '_accVioState');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('id','accidentViolationList'+ accVioListIndex+ '.'+ ''+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('name','accidentViolationList['+ accVioListIndex+ '].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').setValue(selectedState);

					// stick id's
					trClone.find('td.display_desc span.acc_id input[type=hidden]')
							.attr('id','accidentViolationList'
											+ accVioListIndex
											+ '.'
											+ ''+typeString+'0.accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]')
							.setValue(accidentId);

					trClone.find('td.display_desc span.id_desc_text input[type=hidden]')
							.attr('id','accidentViolationList'
											+ accVioListIndex
											+ '.'
											+ ''+typeString+'0.accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					// state
					// trClone.find('td.display_state
					// span.disp_drv
					// select').prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+ accVioListIndex+ '.'+ ''+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+ accVioListIndex+ '].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					// source
					trClone.find('td.display_datasource span.disp_dd')
							.text(selectedSource);
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]')
							.attr('id','accidentViolationList'
											+ accVioListIndex
											+ '.'
											+ ''+typeString+'0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]')
							.attr('name','accidentViolationList['
											+ accVioListIndex
											+ '].'+typeString+'[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]')
							.setValue(selectedSource);

					// operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+ accVioListIndex+ '.'+ ''+typeString+'0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+ accVioListIndex+ '].'+typeString+'[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('');

					//trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+ driverId + '_'+ accVioListIndex + '_'+ 0);
					//trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason select').prop('id',nextRowHeader+'_accVioExcludeReason');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('id','accidentViolationList'+ accVioListIndex+ '.'+ ''+typeString+'0.excludeReasonCd');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('name','accidentViolationList['+ accVioListIndex+ '].'+typeString+'[0].excludeReasonCd');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').setValue(accVioExcludeReason);
					
					// alert('tr clone = '+trClone.html());

					var driverNameRowHeaderFilter = "driver_row_"
							+ driverId;
					$('tr[id^="' + driverNameRowHeaderFilter + '"]')
							.after('<tr id="'+ nextRowHeader+ '" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());

					var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
					// alert('add next row template =
					// '+nextAddRowTemplate.html());
					var nextErrorRowId = 'acc_Error_'
							+ driverId + '_' + accVioListIndex + '_'
							+ accIndex;
					
					nextAddRowTemplate.find('button').prop('id','modify_*acc_' + driverId + '_'
									+ accVioListIndex + '_'
									+ accIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','acc_'+driverId+'_'+accVioListIndex+'_'+accIndex+'_accVioState_Error_Col');
					$('tr[id^="' + nextRowHeader + '"]').after('<tr id="'
											+ nextErrorRowId
											+ '" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());

					/*$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="emptyExcludeReasonCdSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});

//					var selectAccVioDesc = $('#'+ nextRowHeader + '_accVioDesc');
//					addSelectBoxItForAccViol(selectAccVioDesc);
//					var selectAssignedDriver = $('#'+ nextRowHeader + '_assignedDriver');
//					addSelectBoxItForAccViol(selectAssignedDriver);
//					var selectState = $('#' + nextRowHeader+ '_accVioState');
//					addSelectBoxItForAccViol(selectState);
//
//					// set the id's of respective rows..
//					$('#' + nextRowHeader + '_assignedDriver').val(driverId).trigger('chosen:updated');
//					$('#' + nextRowHeader + '_accVioDt').val(selectEdDt);
//					$('#' + nextRowHeader + '_accVioType').val(accVioType).trigger('chosen:updated');
//					$('#' + nextRowHeader + '_accVioDesc').val(accVioId).trigger('chosen:updated');
//					$('#' + nextRowHeader + '_accVioState').val(selectedState).trigger('chosen:updated');
//
//					$('#' + nextRowHeader + '_accVioDt')
//							.datepicker(
//									{
//										showOn : "button",
//										buttonImage : "resources/images/cal_icon.png",
//										buttonImageOnly : true,
//										buttonText : 'Open calendar',
//										dateFormat : 'mm/dd/yy',
//										showButtonPanel : true
//									});
					

					var selectAssignedDriver = $('#'+ nextRowHeader + '_assignedDriver');
					addSelectBoxItForAccViol(selectAssignedDriver);
					var excludeReasonDropDown = $('#'+nextRowHeader+'_accVioExcludeReason');
					addSelectBoxItForAccViol(excludeReasonDropDown);
					
					if(otherCategory){
						if(accVioType.toLowerCase() == 'comp clm'){
							$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');
							$('#'+nextRowHeader+'_assignedDriver').prop('disabled', true);
						}else{
							$('#'+nextRowHeader+'_assignedDriver').val(selectedValue).trigger('chosen:updated');
						}
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					} 
					
					//$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					$('tr[id^="' + nextRowHeader + '"] td.display_date span.disp_drv').text(selectEdDt);
					//$('#'+nextRowHeader+'_accVioDt').text(selectEdDt);
					$('tr[id^="' + nextRowHeader + '"] td.display_type span.disp_drv').text(accVioType);
					$('tr[id^="' + nextRowHeader + '"] td.display_desc span.disp_drv').text(accVioDesc);
					$('tr[id^="' + nextRowHeader + '"] td.display_state span.disp_drv').text(selectedState);
					$('tr[id^="' + nextRowHeader + '"] td.display_datasource span.disp_dd').text(selectedSource);
					//$('#'+nextRowHeader+'_accVioType').text(accVioType);
					//$('#'+nextRowHeader+'_accVioDesc').text(accVioId);
					//$('#'+nextRowHeader+'_accVioState').text(selectedState);
					$('#'+nextRowHeader+'_accVioExcludeReason').val(accVioExcludeReason).trigger('chosen:updated');

					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}
				//if (accVioType == 'Violation') {}
			} else {
				var nextAccVioListNdx = parseInt($('#accVioList_LastNdx').val());
				
				if (accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm') {
					var nextRowHeader = '';
					if(otherCategory){
						nextRowHeader ='other_acc_'+driverId+'_'+nextAccVioListNdx+'_0';
					}else{
						nextRowHeader ='acc_'+driverId+'_'+nextAccVioListNdx+'_0';
					} 
					
					var accIndex = 0;
					// $('tr.driverSeparation').last().before('<tr
					// id="'+nextRowHeader+'"
					// class="display_mode"><td
					// class="newlyAdd">classsic</td></tr>');
					var trClone = $('#empty_unassigned_acc_display_mode').clone();
					// var trCloneSeparation =
					// $('tr.driverSeparation').clone();
					// alert(trCloneSeparation.html());
					// alert('clojned row acc = '+trClone);
					// start
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'+typeString+'0.driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
					trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader + '_assignedDriver');
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(nextAccVioListNdx);
					// trClone.find('td.assigned_driver
					// span.disp_drv').text(assignedDriverName);
					// sticking in acc_id
					// violation or loss date
					// trClone.find('td.display_date
					// span.disp_drv').text(selectEdDt);
					
					//accidentId = $(relevantTr).find("td.display_desc span.acc_id input[id^='accidentViolationList" +nextAccVioListNdx + ".accidents"+ accIndex +".accidentId']").val();
					//accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +nextAccVioListNdx + ".accidents"+ accIndex +".accidentDescId']").val();
					
					if(endorsementMode == 'true'){
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].addedInEndorsementInd');
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.addedInEndorsementInd');
						trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
					} 
					
				   trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").text(driverOnReport);
  				   trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").removeClass('emptyDriverOnReportSpan').addClass('driverOnReportSpan')
  				   
  				   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name','dto.accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverName');
				   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id','dto.accidentViolationList'+nextAccVioListNdx+'.'+ typeString +'0.driverName');
				   trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));
					
					trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader + '_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
					// type
					// trClone.find('td.display_type
					// span.disp_drv').text('Accident');
					trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader + '_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].type');
					if (accVioType == 'Accident') {
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverTypeCd');
							if(selectedValue == 'Friend or Relative'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');
							}else if(selectedValue == 'No Driver-Comp Clm'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
							}else if(selectedValue == 'Unknown Driver'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
							}
							else if(selectedValue =='Deceased HH Member'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
							}
						} else{
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
						} 
					} else{
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
						
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
						} 
					}
					// description
					// trClone.find('td.display_desc
					// span.disp_drv').text(accVioDesc);
					trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader + '_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
					// stick acc id
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue(accidentId);

					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					// state
					trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader
											+ '_accVioState');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);

					// source
					trClone.find('td.display_datasource span.disp_dd').text('Client');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'
											+ nextAccVioListNdx
											+ '.'
											+ ''+typeString+'0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['
											+ nextAccVioListNdx
											+ '].'+typeString+'[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(selectedSource);

					// operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+ nextAccVioListNdx+ '.' + ''+typeString+'0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+ nextAccVioListNdx + '].'+typeString+'[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('');
					//driver type cd for accidents/claims
//					trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+''+typeString+'0.driverTypeCd');
//					trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverTypeCd');
//					trClone.find('span[id^=driverTypeCdEmptySpan] input[type=hidden]').setValue('A');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason select').prop('id',nextRowHeader+'_accVioExcludeReason');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('id','accidentViolationList'+ nextAccVioListNdx+ '.' + ''+typeString+'0.excludeReasonCd');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').attr('name','accidentViolationList['+ nextAccVioListNdx + '].'+typeString+'[0].excludeReasonCd');
					trClone.find('td.exclude_reason span#id_disp input[type=hidden]').setValue(accVioExcludeReason);

					var driverNameRowHeaderFilter = '';
					if(otherCategory){
						driverNameRowHeaderFilter = "other_driver_row";
					}else{
						driverNameRowHeaderFilter = "driver_row_"+driverId;
					} 
					// alert('~ ~ Driver row filter =
					// '+driverNameRowHeaderFilter);
					// var newRow = $('<tr
					// id="'+nextRowHeader+'"
					// class="display_mode orangeColor"><td
					// class="newlyAdd">classsic</td></tr>');
					$('tr[id^="' + driverNameRowHeaderFilter + '"]')
							.after('<tr id="'+ nextRowHeader + '" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());

					var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
					// alert('add next row template =
					// '+nextAddRowTemplate.html());
					var nextErrorRowId = 'acc_Error_'+ driverId + '_'+ nextAccVioListNdx + '_'+ accIndex;
					nextAddRowTemplate.find('button').prop('id','modify_*acc_' + driverId + '_'+ nextAccVioListNdx + '_'+ accIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','acc_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','acc_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id','acc_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','acc_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','acc_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioState_Error_Col');
					$('tr[id^="' + nextRowHeader + '"]').after('<tr id="' + nextErrorRowId + '" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
					$("#driver_row_" + driverId).show();

					/*$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
					$('tr[id^="' + nextRowHeader + '"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="emptyExcludeReasonCdSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});

					if(selectedSource != null && selectedSource != '' && selectedSource != 'Client'){
						var selectAssignedDriver = $('#'+ nextRowHeader + '_assignedDriver');
						addSelectBoxItForAccViol(selectAssignedDriver);
						var excludeReasonDropDown = $('#'+nextRowHeader+'_accVioExcludeReason');
						addSelectBoxItForAccViol(excludeReasonDropDown);
						
						//$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
						$('tr[id^="' + nextRowHeader + '"] td.display_date span.disp_drv').text(selectEdDt);
						//$('#'+nextRowHeader+'_accVioDt').text(selectEdDt);
						$('tr[id^="' + nextRowHeader + '"] td.display_type span.disp_drv').text(accVioType);
						$('tr[id^="' + nextRowHeader + '"] td.display_desc span.disp_drv').text(accVioDesc);
						$('tr[id^="' + nextRowHeader + '"] td.display_state span.disp_drv').text(selectedState);
						$('tr[id^="' + nextRowHeader + '"] td.display_datasource span.disp_dd').text(selectedSource);
						//$('#'+nextRowHeader+'_accVioType').text(accVioType);
						//$('#'+nextRowHeader+'_accVioDesc').text(accVioId);
						//$('#'+nextRowHeader+'_accVioState').text(selectedState);
						$('#'+nextRowHeader+'_accVioExcludeReason').val(accVioExcludeReason).trigger('chosen:updated');
						if(otherCategory){
							if(accVioType.toLowerCase() == 'comp clm'){
								$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');
								$('#'+nextRowHeader+'_assignedDriver').prop('disabled', true);
							}else{
								$('#'+nextRowHeader+'_assignedDriver').val(selectedValue).trigger('chosen:updated');
							}
						}else{
							$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
						}
					}else{
						var selectAccVioDesc = $('#'+ nextRowHeader + '_accVioDesc');
						addSelectBoxItForAccViol(selectAccVioDesc);
						var selectAssignedDriver = $('#'+ nextRowHeader + '_assignedDriver');
						addSelectBoxItForAccViol(selectAssignedDriver);
						var selectState = $('#' + nextRowHeader+ '_accVioState');
						addSelectBoxItForAccViol(selectState);

						// set up the drop down id's
						 if(otherCategory){
							 if(accVioType.toLowerCase() == 'comp clm'){
								 $('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');
								 $('#'+nextRowHeader+'_assignedDriver').prop('disabled', true);
							 }else{
								 $('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
							 }
						 }else{
							 $('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
						 } 
						$('#' + nextRowHeader + '_accVioDt').val(selectEdDt);
						$('#' + nextRowHeader + '_accVioType').val(accVioType).trigger('chosen:updated');
						$('#' + nextRowHeader + '_accVioDesc').val(accVioId).trigger('chosen:updated');
						$('#' + nextRowHeader + '_accVioState').val(selectedState).trigger('chosen:updated');
						$('#' + nextRowHeader + '_accVioDt').datepicker(
							{
								showOn : "button",
								buttonImage : "resources/images/cal_icon.png",
								buttonImageOnly : true,
								buttonText : 'Open calendar',
								dateFormat : 'mm/dd/yy',
								showButtonPanel : true
							});
					}
					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}

				//if (accVioType == 'Violation') {}
				// alert('there is no violation/accident added
				// for this user Add now all new ok..');
				nextAccVioListNdx = nextAccVioListNdx + 1;
				$('#accVioList_LastNdx').val(nextAccVioListNdx);
				// alert($('#accVioList_LastNdx').val());
			}
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$(relevantTr).remove();
		$(containerTr).remove();
		if($("tr[id^='unassigned_acc_']").length <= 0){
			$("tr[id^='unassigned_driver_row_']").hide();
		}
		$("#accVioTabl tr.display_mode").each(
				function() {
					// return false;
					// var rowId = this.id;
					// document.getElementById(rowId).disabled =
					// true;
					// $("SELECT").selectBoxIt('refresh');
					// applyDefaultWidth();
					// $("SELECT").selectBoxIt('enable');
					$(this).prop('disabled', false);
					var rowId = this.id;
					// alert('cancel event on rows
					// aeefecting'+rowId);
					
					//Datepicker is disabled for now. It needs to be revisited
					/*$('#' + rowId + '_accVioDt').datepicker(
							'enable');*/
					$(this).find("td span.disp_drv select")
							.prop('disabled', false).trigger(
									'chosen:updated');
					$(this).find("td span.disp_drv input")
							.prop('disabled', false);
					
					var driverName = $(this).find("td span.disp_drv select.selected_driver_class");
					if($(driverName)!=null && $(driverName).val()=='No Driver-Comp Clm'){
						$(driverName).prop('disabled', true).trigger('chosen:updated');
						$(this).find("td.typeAccVio span.disp_drv select").prop('disabled',true).trigger('chosen:updated');
					}

					// $('.ui-datepicker-trigger').show();
				});
	});

	// Edit Error Messaging End
	// ########## Add new Driver Start###############//
	//Edit Error Messaging End
	//########## Add new Driver Start###############//
	$(document).on("click",".addSelected",function(e){
		// will be executed down the line
		//$('tr[class^="selectDriverToAdd"]').toggle();
		//$('tr[class^="selectDriverToAddNext"]').hide();
		//$('#addAccVio').show();
		//$('#addAccVioDisable').hide();
		//$('input[name=hasAccVio]').attr('disabled', 'disabled');
		
		//$("#accVioTabl tr.display_mode").each(function(){
		//	$(this).prop('disabled',false);
		//});
		var otherCategory = false;
		
		accVioCount++;
		//Get the required details to be added entered in Add Accident/Violation button
		var driverId = $('.selected_driver_class option:selected').val();
		var driverIdArray = driverId.split('_');
		driverId =  driverIdArray[0];
		var assignedDriver = $('.selected_driver_class option:selected').val();
		var assignedDriverValueArray = assignedDriver.split("_");
		var assginedDriverId = assignedDriverValueArray[0];
		var selectedValue = '';
		if(assignedDriverValueArray.size > 1){
			selectedValue = assignedDriverValueArray[1];
		}else{
			selectedValue = assignedDriverValueArray[0];
		}
		
		var accVioDescId = '';
		var accVioId = '';
		var accVioDesc = '';
		var typeString = 'accidents';
		
		var accVioType = $('#selectEdType').val();
		if(accVioType.toLowerCase() == 'comp clm' || (selectedValue =='Friend or Relative' || selectedValue=='No Driver-Comp Clm' || selectedValue=='Unknown Driver' || selectedValue =='Deceased HH Member')){
			otherCategory = true;
			driverId = primaryDriverId;
			typeString = 'accidents';
		}		
		var srchR = '';
		if(accVioType=='Accident'){
			accVioDescId = $('.selected_populated_desc_class_accident option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			accVioDesc = $('.selected_populated_desc_class_accident option:selected').text();
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			if(otherCategory){
				srchR='other_acc_'+driverId;
			}else{
				srchR='acc_'+driverId;
			}
		} else if(accVioType.toLowerCase() == 'comp clm'){
			accVioDescId = $('.selected_populated_desc_class_comp option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			//accVioDesc = $('.selected_populated_desc_class_comp option:selected').text();
			accVioDesc = $(this).closest('tr').prev().find('td.select_display_desc span.disp_drv_com select').find(":selected").text();
			if(accVioDesc!=undefined){
				accVioDesc = $.trim(accVioDesc);
			} 
			$.trim(accVioDesc.replaceAll('Select',''))
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			if(otherCategory){
				srchR='other_acc_'+driverId;
			}else{
				srchR='acc_'+driverId;
			}
		} else if(accVioType=='Violation'){
			accVioDescId = $('.selected_populated_desc_class_violation option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			accVioDesc = $('.selected_populated_desc_class_violation option:selected').text();
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			if(otherCategory){
				srchR='other_vio_'+driverId;
			}else{
				srchR='vio_'+driverId;
			}
		}
		/*var selectDriverOnReport = $('#selectDriverOnReport').val();*/
		var selectEdDt = $('#selectEdDt').val();
		//where do they come from..
		var selectedSource = 'Client';
		var selectedState =  $('.selected_populated_state_class option:selected').val();
		var selectedExcludeReason = '-';
		var addedInEndtInd = '';
		
		//Validate required fields before adding
		var selectEdDtElem = $('#selectEdDt');
		var selectedAccVioTypeElem = $('#selectEdType');
		var selectedAssignedDriverElem = $('.selected_driver_class');
		var selectedStateElem =  $('.selected_populated_state_class');
		var selectedAccVioDescElem;
		
		if(selectedAccVioTypeElem[0].value=='Violation'){
			selectedAccVioDescElem = $('.selected_populated_desc_class_violation');
		}
		else if(selectedAccVioTypeElem[0].value=='Comp Clm'){
			selectedAccVioDescElem = $('.selected_populated_desc_class_comp');
		}
		else{
			selectedAccVioDescElem = $('.selected_populated_desc_class_accident');	
		}
		 
		//Validate required fields before adding
		if(!checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem)){
			return false;
		}		
		$('tr[class^="selectDriverToAdd"]').toggle();
		$('tr[class^="selectDriverToAddNext"]').hide();
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
				
		$("#accVioTabl tr.display_mode").each(function(){
			$(this).prop('disabled',false);
		});
		//display the driver ID row seperator it's always there
		if(otherCategory){
			$("otherDiv").show();
			$('#other_driver_row').show();
		}else{
			$('#driver_row_'+driverId).show();
		}		
		clearNewlyAddedRow();	
		var trLastOccurence = '';
		trLastOccurence = $('tr[id^="other_'+srchR+'"]').filter(":last");
		if(trLastOccurence.length <= 0){
			trLastOccurence = $('tr[id^="'+srchR+'"]').filter(":last");
		}
		
		var idVal = trLastOccurence.attr('id');
		//  this driver has the accident/vio that agent is trying to add now get the row clone it and insert it back
		if(idVal!=null){
			var otherOccursFirst = false;
			var trFirstOccurence = '';
			trFirstOccurence = $('tr[id^="'+srchR+'"]').filter(":first");
			if(trFirstOccurence.length <= 0){
				trFirstOccurence = $('tr[id^="other_'+srchR+'"]').filter(":first");
				otherOccursFirst = true;
			}
			
			var ndxToPickup =null;
			var lastOccuranceArray = trLastOccurence.attr('id').split('_');
			var firstOccuranceArray = trFirstOccurence.attr('id').split('_');
			
			if(otherCategory || otherOccursFirst){
				if(lastOccuranceArray!=null && firstOccuranceArray!=null && lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[4]>lastOccuranceArray[4])
				{
					ndxToPickup = firstOccuranceArray[4];
				}
			}else{
				if(lastOccuranceArray!=null && firstOccuranceArray!=null && lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[3]>lastOccuranceArray[3])
				{
					ndxToPickup = firstOccuranceArray[3];
				}
			}
			
			var accVioArray = idVal.split('_');
			if(accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm'){
				var accIndex = 0;
				var accVioList = 0;
				//alert('Accident exists for Add ');	
				if(otherCategory || otherOccursFirst){
					accVioList = parseInt(accVioArray[3]);
					accIndex = parseInt(accVioArray[4]);
				}else{
					if(accVioArray[0]=='other'){
						accVioList = parseInt(accVioArray[3]);
						accIndex = parseInt(accVioArray[4]);
					}
					else{
						accVioList = parseInt(accVioArray[2]);
						accIndex = parseInt(accVioArray[3]);	
					}
				}
				
				if(ndxToPickup!=null)
				{
					accIndex = ndxToPickup;
				}
				//var currAcc = 'accidents'+accIndex;
				//accIndex = parseInt(accIndex)+1;
				//accIndex = $('tr[id^="'+srchR+'"]').length + 1;
				//var nextAcc = 'accidents'+accIndex;
				var insertBefore = false;
				var insertAfter = false;
				var trToInsertNewRowId = '';
				
				var lengthOfTrArray = '';
				var index1 = '';
				var index2 = ''; 
				var prefixString = '';
				if(firstOccuranceArray[0].indexOf('other') != -1){
					prefixString = "other_acc_";
					index1 = 2;
					index2 = 3;
				}else{
					prefixString = "acc_";
					index1 = 1;
					index2 = 2;
				}
				
				$('tr[id^='+ prefixString + firstOccuranceArray[index1] + '_' + firstOccuranceArray[index2] + ']').each(function(index) {
					var dateStr = $(this).find('td.display_date span.id_disp input[id$=accidentDate]').val();
					var date = Date.parse(dateStr);
					var currentDate = Date.parse(selectEdDt);
					if(currentDate > date){
						trToInsertNewRowId = $(this).attr("id");
						insertBefore = true;
						return false;
					}else if(index == lengthOfTrArray - 1){
						trToInsertNewRowId = $(this).attr("id");
						insertAfter = true;
						return false;
					}
				});
				
				//alert('next accVioList='+accVioList+'next accNdx = '+accIndex);
			   //alert('nextAcc = '+nextAcc);
			   //ok start building the updated row..
			   //assigned driver
			   var trClone = '';
			   if(accVioType == 'Accident'){
			        trClone = $('#empty_acc_display_mode').clone();
			    }else{
				    trClone = $('#empty_com_display_mode').clone();
				}
			   
			   var accTrs = $("tr[id^=acc_" +driverId+'_'+accVioList+'_' +"]");
			   var otherAccTrs = $("tr[id^=other_acc_" +driverId+'_'+accVioList+'_' +"]");
			   var idArrayAcc = [];
			   $(accTrs.get()).each( function() {
			       var splitIdArray = $(this).attr('id').split('_');
			       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
			   });
			   $(otherAccTrs.get()).each( function() {
			       var splitIdArray = $(this).attr('id').split('_');
			       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
			   });
			   var maxAccId = (idArrayAcc.sort(function(a,b){return b-a;})[0]);
			   
			   if(parseInt(maxAccId) >= 0){
				   accIndex = parseInt(maxAccId) + 1;
				   nextAcc = typeString + accIndex;
			   }else{
				   nextAcc = typeString + accIndex;
			   }
			   
			   var nextRowHeader ='';
			   if(otherCategory){
				   nextRowHeader ='other_acc_'+driverId+'_'+accVioList+'_'+accIndex;
			   }else{
				   nextRowHeader ='acc_'+driverId+'_'+accVioList+'_'+accIndex;
			   }
			   			   
			   //buildRows(trClone,accVioList,accIndex,true,'acc');
			   trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].driverId');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.driverId');
			   trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
			   
			   trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
			   trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
			   trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioList);
			   
			   if(endorsementMode == 'true'){
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].addedInEndorsementInd');
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.addedInEndorsementInd');
				   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
			   }
			 
				// Violation or loss date
			   	// trClone.find('td.display_date span.disp_drv').text(selectEdDt);
			   	trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.accidentDate');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].accidentDate');
				trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
				//Type
				//trClone.find('td.display_type span.disp_drv').text('Accident');
				
				trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.type');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].type');
				if(accVioType == 'Accident'){
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
					if(otherCategory){
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].driverTypeCd');
						if(selectedValue == 'Friend or Relative'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
						}else if(selectedValue == 'No Driver-Comp Clm'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
						}else if(selectedValue == 'Unknown Driver'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
						}
						else if(selectedValue =='Deceased HH Member'){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
						}
					}else{
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
					}
				}else{
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
					
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.driverTypeCd');
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].driverTypeCd');
					trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
					
					trClone.find('td.assigned_driver  span.disp_drv select').prop('disabled',true);
					trClone.find('td.typeAccVio span.disp_drv select').prop('disabled',true);
					
				}
				
				//description
				//trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
				trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.accidentDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].accidentDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
					
				//sticking in acc_id
				trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.accidentId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].accidentId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue("");
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.accidentDesc');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].accidentDesc');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
				//state
				trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader+'_accVioState');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.accidentStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].accidentStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					
				//source
				trClone.find('td.display_datasource span.disp_dd').text('Client');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
				
				//operation
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextAcc+'.operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
					
				//exclude reason Delete Link
				//<td class="exclude_reason excludeReasonAccVio"><span id="tmpAccDeleteDriverId" class="exclude_dd_reason">Delete Driver</span></td>
				trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+accVioList+'_'+accIndex);
				trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
				//source exclude reason
				//Ok fade the row as you add them change blue white to yellow and back to blue or white
				//$('tr[id^="'+srchR+'"]').filter(":last").hide();
				
				var driverRowFilter = '';
				var prefixString='';
				if(otherCategory){
					driverRowFilter = "other_driver_row";
					prefixString = 'other_acc';
				}else{
					driverRowFilter = "driver_row_"+driverId;
					prefixString = 'acc';
				}
				
				//var newRow = $('<tr id="'+nextRowHeader+'" class="display_mode orangeColor"><td class="newlyAdd">classsic</td></tr>');
				if(insertBefore){
					$('#'+trToInsertNewRowId).before('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				}else if(insertAfter){
					$('#'+trToInsertNewRowId).after('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				}else{
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());	
				}
				
				var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
				//alert('add next row template = '+nextAddRowTemplate.html());
				var nextErrorRowId = prefixString+'_Error_'+driverId+'_'+accVioList+'_'+accIndex;
				nextAddRowTemplate.find('button').prop('id','modify_*'+prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex);
				nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id',prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex+'_assignedDriver_Error_Col');
				nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id',prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioDt_Error_Col');
				nextAddRowTemplate.find('td.edType_Error_Col').prop('id',prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex+'_edType_Error_Col');
				nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id',prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioDesc_Error_Col');
				nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id',prefixString+'_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioState_Error_Col');
				
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());	
			
				/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxItContainer"]').remove();*/
				
				//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
				//All it needs to remove the dropdown container in the row
				$('tr[id^="'+nextRowHeader+'"]').each( function() {
					 $(this).find('div[id$="_chosen"]').remove();
				});
				
				
				var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
				addSelectBoxItForAccViol(selectAccVioDesc);
				var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
				addSelectBoxItForAccViol(selectAssignedDriver);
				var selectState = $('#'+nextRowHeader+'_accVioState');
				addSelectBoxItForAccViol(selectState);
				var selectedType = $('#'+nextRowHeader+'_accVioType');
				addSelectBoxItForAccViol(selectedType);
	
				if(otherCategory){
					if(accVioType.toLowerCase() == 'comp clm'){
						$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');							
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(assignedDriver).trigger('chosen:updated');
					}
				}else{
					$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
				}
				$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
				$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
				
				$('#'+nextRowHeader+'_accVioDt').datepicker({
					showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
					dateFormat: 'mm/dd/yy',showButtonPanel : true		
				});
				
				highlightRow(nextRowHeader);
				//Reset the drop downs to default after values are read
				resetAddDefaultSelections();
			}
			if(accVioType == 'Violation'){
				var trClone = $('#empty_vio_display_mode').clone();
				var accVioList = parseInt(accVioArray[2]);
				var vioIndex = parseInt(accVioArray[3]);
				
				var currViolation = 'violations'+vioIndex;
				if(ndxToPickup!=null)
				{
					vioIndex = ndxToPickup;
				}
				
				vioIndex = $('tr[id^="'+srchR+'"]').length + 1;
				var nextVio = 'violations'+vioIndex;
				//alert('nextVio = '+nextVio);
				//ok start building the updated row..
				//assigned driver
				//buildRows(trClone,accVioList,vioIndex,true,'vio');
				var insertBefore = false;
				var insertAfter = false;
				var trToInsertNewRowId = '';
				
				var lengthOfTrArray = $('tr[id^=vio_' + accVioArray[1] + '_' + accVioArray[2] + ']').length;
				$('tr[id^=vio_' + accVioArray[1] + '_' + accVioArray[2] + ']').each(function(index) {
					var dateStr = $(this).find('td.display_date span.id_disp input[id$=violationDt]').val();
					var date = Date.parse(dateStr);
					var currentDate = Date.parse(selectEdDt);
					if(currentDate > date){
						trToInsertNewRowId = $(this).attr("id");
						insertBefore = true;
						return false;
					}else if(index == lengthOfTrArray - 1){
						trToInsertNewRowId = $(this).attr("id");
						insertAfter = true;
						return false;
					}
				});
				
				var nextRowHeader ='vio_'+driverId+'_'+accVioList+'_'+vioIndex;
				//alert('nextRowHeader = '+nextRowHeader);
				trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
				trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.driverId');
				trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].driverId');
				trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
				
				trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
			    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
			    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioList);
				
				if(endorsementMode == 'true'){
					  trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].addedInEndorsementInd');
					  trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.addedInEndorsementInd');
					  trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
				}
				
				//Driver on reports
				/*trClone.find('td.display_driver_name span.drv_disp_name').text(selectDriverOnReport);
				trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.driverName');
				trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].driverName');
				trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').setValue(selectDriverOnReport);*/
				
				//violation or loss date trClone.find('td.display_date span.disp_drv').text(selectEdDt);
				trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.violationDt');
				trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].violationDt');
				trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
				
				//type trClone.find('td.display_type span.disp_drv').text('Violation');
				trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.type');
				trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].type');
				trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');
			
				//description trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
				trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.violationDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].violationDescId');
				trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
		
				//sticking in acc_id
				trClone.find('td.display_desc span.vio_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.violationId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].violationId');
				trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue("");
				
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.violationDescCd');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].violationDescCd');
				trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
				
				trClone.find('td.display_datasource span.disp_dd').text('Client');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].dataSourceCd');
				trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
				
				//operation
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].operation');
				trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
				//state
				trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader+'_accVioState');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+nextVio+'.violationStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations['+vioIndex+'].violationStateCd');
				trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
				
				trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_vio_'+driverId+'_'+accVioList+'_'+vioIndex);
				trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
				
				var driverRowFilter = "driver_row_"+driverId;
				//$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				//$('td.newlyAdd').replaceWith(trClone.html());
				
				if(insertBefore){
					$('#'+trToInsertNewRowId).before('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				}else if(insertAfter){
					$('#'+trToInsertNewRowId).after('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				}else{
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());	
				}
				
				var nextAddRowTemplate = $("#saveCancel_btn_vio").clone();
				var nextErrorRowId ='vio_Error_'+driverId+'_'+accVioList+'_'+vioIndex;
				nextAddRowTemplate.find('button').prop('id','modify_*vio_'+driverId+'_'+accVioList+'_'+vioIndex);
				nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_assignedDriver_Error_Col');
				nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioDt_Error_Col');
				nextAddRowTemplate.find('td.edType_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_edType_Error_Col');
				nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioDesc_Error_Col');
				nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioState_Error_Col');
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
				
				// Remove the cloned span tags..
				/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxItContainer"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioTypeSelectBoxIt"]').remove();
				$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioTypeSelectBoxItContainer"]').remove();*/
				
				//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
				//All it needs to remove the dropdown container in the row
				$('tr[id^="'+nextRowHeader+'"]').each( function() {
					 $(this).find('div[id$="_chosen"]').remove();
				});
				
				//Recreate new DD with new ID's
				var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
				addSelectBoxItForAccViol(selectAccVioDesc);
				var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
				addSelectBoxItForAccViol(selectAssignedDriver);
				var selectState = $('#'+nextRowHeader+'_accVioState');
				addSelectBoxItForAccViol(selectState);
				var selectType = $('#'+nextRowHeader+'_accVioType');
				addSelectBoxItForAccViol(selectType);
				
				$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
				$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
				
				$('#'+nextRowHeader+'_accVioDt').datepicker({
					showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
					dateFormat: 'mm/dd/yy',showButtonPanel : true		
				});
				highlightRow(nextRowHeader);
				resetAddDefaultSelections();
			}
		}
		
		//	Agent adding accident but the user does not have accident but has a violation and viceversa
		//	Check for row of accident OR violation that driver has which agent is adding acc/vio against
		if(idVal == null || idVal == undefined){
			//alert('... alter the acc vio change ...');
			
			if(accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm'){
				if(otherCategory){
					srchR = 'other_vio_'+driverId;					
				}else{
					srchR = 'vio_'+driverId;					
				}
			}
			if(accVioType == 'Violation'){
				if(otherCategory){
					srchR = 'other_acc_'+driverId;					
				}else{
					srchR = 'acc_'+driverId;				
				}
			}
			
			
			trLastOccurence = $('tr[id^="'+srchR+'"]').filter(":last");
			idVal = trLastOccurence.attr('id');
			
			tr = $('tr[id^="'+srchR+'"]').filter(":last");
			idVal = tr.attr('id');
			//alert('idVal = '+idVal);
			if(idVal !=null){
				//alert('this driver has a accident or violation recorded');
				var accVioArray = idVal.split('_');
				if(accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm'){
					var accVioList = '0';
					if(otherCategory){
						accVioList = parseInt(accVioArray[3]);
					}else{
						accVioList = parseInt(accVioArray[2]);
					}
					
					var nextRowHeader ='';
					if(otherCategory){
						nextRowHeader ='other_acc_'+driverId+'_'+accVioList+'_0';
					}else{
						nextRowHeader ='acc_'+driverId+'_'+accVioList+'_0';
					}
					
					var accIndex = 0;
					
					var trClone = '';
					if(accVioType == 'Accident'){
						trClone = $('#empty_acc_display_mode').clone();
					}else{
						trClone = $('#empty_com_display_mode').clone();
					}
					
					//alert('clojned row acc = '+trClone);
					//start
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioList);
					
					trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
					
					if(endorsementMode == 'true'){
					   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'['+accIndex+'].addedInEndorsementInd');
					   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.addedInEndorsementInd');
					   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
				    }
			
					//violation or loss date
					//trClone.find('td.display_date span.disp_drv').text(selectEdDt);
					trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
				
					//trClone.find('td.display_type span.disp_drv').text('Accident');
					trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].type');
					
					if(accVioType == 'Accident'){
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');	
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].driverTypeCd');
							if(selectedValue == 'Friend or Relative'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');
							}else if(selectedValue == 'No Driver-Comp Clm'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
							}else if(selectedValue == 'Unknown Driver'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
							}
							else if(selectedValue =='Deceased HH Member'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
							}
						}else{
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
						} 
					}else{
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
						
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].driverTypeCd');
						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C'); 
						
						trClone.find('td.assigned_driver  span.disp_drv select').prop('disabled',true);
						trClone.find('td.typeAccVio span.disp_drv select').prop('disabled',true);
					}
					
//					if (accVioType == 'Accident') {
//						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
//					}else{
//						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
//						
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'accidents0.driverTypeCd');
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].accidents[0].driverTypeCd');
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
//					}
					
					// description
					// trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
					trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
					
					
					trClone.find("td.display_state span.disp_drv select").prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').setValue(selectedState);
					
					
					// stick id's
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue("");
					
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					//state
					//trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					//source
					trClone.find('td.display_datasource span.disp_dd').text('Client');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
					
					//operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+typeString+'0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].'+typeString+'[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+accVioList+'_'+0);
					trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
					
					//alert('tr clone = '+trClone.html());
					
					var driverRowFilter = '';
					if(otherCategory){
						driverRowFilter = "other_driver_row";
					}else{
						driverRowFilter = "driver_row_"+driverId;
					} 
					
					//var driverRowFilter = "driver_row_"+driverId;
					
					var nextRowHeaderIdArray = nextRowHeader.split("_");
					var violationTrId = '';
					if(otherCategory){
						violationTrId = "other_vio_" + nextRowHeaderIdArray[1];
					}else{
						violationTrId = "vio_" + nextRowHeaderIdArray[1];
					}
					
					var trVioLastOccurence = $('tr[id^="'+accidentTrId+'"]').filter(":last");
					
					if(trVioLastOccurence.length > 0){
						var violationTrIdId = $(violationTrId).attr("id");
						driverRowFilter = violationTrIdId;
					}
					
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());
					
					var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
					//alert('add next row template = '+nextAddRowTemplate.html());
					var nextErrorRowId ='acc_Error_'+driverId+'_'+accVioList+'_'+accIndex;
					nextAddRowTemplate.find('button').prop('id','modify_*acc_'+driverId+'_'+accVioList+'_'+accIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','acc_'+driverId+'_'+accVioList+'_'+accIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','acc_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id','acc_'+driverId+'_'+accVioList+'_'+accIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','acc_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','acc_'+driverId+'_'+accVioList+'_'+accIndex+'_accVioState_Error_Col');
					$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
					
					/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});
					
					var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
					addSelectBoxItForAccViol(selectAccVioDesc);
					var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
					addSelectBoxItForAccViol(selectAssignedDriver);
					var selectState = $('#'+nextRowHeader+'_accVioState');
					addSelectBoxItForAccViol(selectState);
					var selectType = $('#'+nextRowHeader+'_accVioType');
					addSelectBoxItForAccViol(selectType);
					
					if(otherCategory){
						if(accVioType.toLowerCase() == 'comp clm'){
							$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');
							$('#'+nextRowHeader+'_assignedDriver').prop('disabled', true);
						}else{
							$('#'+nextRowHeader+'_assignedDriver').val(selectedValue).trigger('chosen:updated');
						}
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					} 
					
					//$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
					$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
					
					$('#'+nextRowHeader+'_accVioDt').datepicker({
						showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
						dateFormat: 'mm/dd/yy',showButtonPanel : true		
					});
					
					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}
				if(accVioType == 'Violation'){
					var accVioList = '';
					if(otherCategory){
						accVioList = parseInt(accVioArray[3]);
					}else{
						accVioList = parseInt(accVioArray[2]);
					}
					
					var nextRowHeader = '';
					if(otherCategory){
						nextRowHeader = 'other_vio_'+driverId+'_'+accVioList+'_0';
					}else{
						nextRowHeader = 'vio_'+driverId+'_'+accVioList+'_0';
					}
					
					var vioIndex = 0;
					var trClone = $('#empty_vio_display_mode').clone();
					
					trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
					//trClone.find('td.assigned_driver span.disp_drv').text(assignedDriverName);
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioList);
					
					if(endorsementMode == 'true'){
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.violations0.addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
					}
					
					//TODO need to uncomment once driver type is added to Violation
//					if(otherCategory){
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.violations0.driverTypeCd');
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].driverTypeCd');
//						if(selectedValue == 'Friend or Relative'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
//						}else if(selectedValue == 'No Driver-Comp Clm'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
//						}else if(selectedValue == 'Unknown Driver'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
//						}
//					}
					
					//violation or loss date
					//trClone.find('td.display_date span.disp_drv').text(selectEdDt);
					trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
					//type
					//trClone.find('td.display_type span.disp_drv').text('Violation');
					trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');
					//description
					//trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
					trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
			
					trClone.find("td.display_state span.disp_drv select").prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationStateCd');
					trClone.find('td.display_state span.id_disp input[type=hidden]').setValue(selectedState);
					
					
					/*trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);*/
					
					//sticking in acc_id
					trClone.find('td.display_desc span.vio_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationId');
					trClone.find('td.display_desc span.vio_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationId');
					trClone.find('td.display_desc span.vio_id input[type=hidden]').setValue("");
					
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationDescCd');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationDescCd');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					
					trClone.find('td.display_datasource span.disp_dd').text('Client');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
					//state
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					
					//operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+accVioList+'.'+'violations0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+accVioList+'].violations[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_vio_'+driverId+'_'+accVioList+'_'+0);
					trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
					
					$('td.newlyAdd').replaceWith(trClone.html());
					var driverRowFilter = '';
					if(otherCategory){
						driverRowFilter = "other_driver_row";
					}else{
						driverRowFilter = "driver_row_"+driverId;
					}
					
					var nextRowHeaderIdArray = nextRowHeader.split("_");
					
					var accidentTrId = '';
					if(otherCategory){
						accidentTrId = "other_acc_" + nextRowHeaderIdArray[2];
					}else{
						accidentTrId = "acc_" + nextRowHeaderIdArray[1];
					}
					//var accidentTrId = "acc_" + nextRowHeaderIdArray[1];
					var trAccLastOccurence = $('tr[id^="'+accidentTrId+'"]').filter(":last");
					
					if(trAccLastOccurence.length > 0){
						var trAccLastOccurenceId = $(trAccLastOccurence).attr("id");
						driverRowFilter = trAccLastOccurenceId;
					}
					
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());
					
					var nextAddRowTemplate = $("#saveCancel_btn_vio").clone();
					var nextErrorRowId ='vio_Error_'+driverId+'_'+accVioList+'_'+vioIndex;
					nextAddRowTemplate.find('button').prop('id','modify_*vio_'+driverId+'_'+accVioList+'_'+vioIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','vio_'+driverId+'_'+accVioList+'_'+vioIndex+'_accVioState_Error_Col');
					$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
					
					// Remove the cloned span tags..
					/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioTypeSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioTypeSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});
					
					//Recreate new DD with new ID's
					var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
					addSelectBoxItForAccViol(selectAccVioDesc);
					var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
					addSelectBoxItForAccViol(selectAssignedDriver);
					var selectState = $('#'+nextRowHeader+'_accVioState');
					addSelectBoxItForAccViol(selectState);
					var selectType = $('#'+nextRowHeader+'_accVioType');
					addSelectBoxItForAccViol(selectType);
					
					//set the id's of respective rows..
					if(otherCategory){
						$('#'+nextRowHeader+'_assignedDriver').val(assignedDriver).trigger('chosen:updated');
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					}
					$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
					$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDt').datepicker({
						showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
						dateFormat: 'mm/dd/yy',showButtonPanel : true		
					});
					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}
			}
			else
			{
				var nextAccVioListNdx = parseInt($('#accVioList_LastNdx').val());
				
				if(accVioType == 'Accident' || accVioType.toLowerCase() == 'comp clm'){
					var nextRowHeader = '';
					if(otherCategory){
						nextRowHeader ='other_acc_'+driverId+'_'+nextAccVioListNdx+'_0';
					}else{
						nextRowHeader ='acc_'+driverId+'_'+nextAccVioListNdx+'_0';
					}
					
					var accIndex = 0;
					//$('tr.driverSeparation').last().before('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					var trClone = '';
					if(accVioType == 'Accident'){
						trClone = $('#empty_acc_display_mode').clone();
					} else{
						trClone = $('#empty_com_display_mode').clone();
					}
					
					//var trCloneSeparation = $('tr.driverSeparation').clone();
					// alert(trCloneSeparation.html());
					// alert('clojned row acc = '+trClone);
					//start
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.driverId');
					if(otherCategory){
						trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
					}else{
						trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);						
					}
					trClone.find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverId');
					trClone.find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.driverId');
					trClone.find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').setValue(driverId);
					
					trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(nextAccVioListNdx);
					
					if(endorsementMode == 'true'){
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
					   }
					
					//trClone.find('td.assigned_driver span.disp_drv').text(assignedDriverName);
					//sticking in acc_id
					//violation or loss date
					//trClone.find('td.display_date span.disp_drv').text(selectEdDt);
					trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+''+typeString+'0.accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].accidentDate');
					trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
					//type
					//trClone.find('td.display_type span.disp_drv').text('Accident');
					trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+''+typeString+'0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].type');
					if(accVioType == 'Accident'){
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+''+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverTypeCd');
							if(selectedValue == 'Friend or Relative'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
							}else if(selectedValue == 'No Driver-Comp Clm'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
							}else if(selectedValue == 'Unknown Driver'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
							}
							else if(selectedValue =='Deceased HH Member'){
								trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
							}
						}else{
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
						}
					}else{
						trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
						if(otherCategory){
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].driverTypeCd');
							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
						}
						trClone.find('td.assigned_driver  span.disp_drv select').prop('disabled',true);
						trClone.find('td.typeAccVio span.disp_drv select').prop('disabled',true);
						//trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'accidents0.driverTypeCd');
						//trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].accidents[0].driverTypeCd');
						//trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
					}
					
					//description
					//trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
					trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].accidentDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
					//stick acc id
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].accidentId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue("");
					
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].accidentDesc');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					//state
					trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].accidentStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					
					//source
					trClone.find('td.display_datasource span.disp_dd').text('Client');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
					
					//operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+typeString+'0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].'+typeString+'[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+nextAccVioListNdx+'_'+0);
					trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
					
					var driverRowFilter = '';
					var prefixString='';
					if(otherCategory){
						driverRowFilter = "other_driver_row";
						prefixString = 'other_acc';
					}else{
						driverRowFilter = "driver_row_"+driverId;
						prefixString = 'acc';
					}
					//alert('~ ~ Driver row filter = '+driverRowFilter);
					//var newRow = $('<tr id="'+nextRowHeader+'" class="display_mode orangeColor"><td class="newlyAdd">classsic</td></tr>');
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());
					
					var nextAddRowTemplate = $("#saveCancel_btn_acc").clone();
					//alert('add next row template = '+nextAddRowTemplate.html());
					var nextErrorRowId =prefixString+'_Error_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex;
					nextAddRowTemplate.find('button').prop('id','modify_*'+prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id',prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id',prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id',prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id',prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id',prefixString+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex+'_accVioState_Error_Col');
					$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
					if(otherCategory){
						$("#other_driver_row").show();
					}else{
						$("#driver_row_"+driverId).show();
					}
					
					/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccDescSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccStateSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empAccTypeSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});
					
					var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
					addSelectBoxItForAccViol(selectAccVioDesc);
					var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
					addSelectBoxItForAccViol(selectAssignedDriver);
					var selectState = $('#'+nextRowHeader+'_accVioState');
					addSelectBoxItForAccViol(selectState);
					var selectType = $('#'+nextRowHeader+'_accVioType');
					addSelectBoxItForAccViol(selectType);
					
					//set up the drop down id's
					if(otherCategory){
						if(accVioType.toLowerCase() == 'comp clm'){
							$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').trigger('chosen:updated');							
						}else{
							$('#'+nextRowHeader+'_assignedDriver').val(assignedDriver).trigger('chosen:updated');
						}
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					}
					
					$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
					$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDt').datepicker({
						showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
						dateFormat: 'mm/dd/yy',showButtonPanel : true		
					});
					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}
				
				if(accVioType == 'Violation'){
					var nextRowHeader = '';
					if(otherCategory){
						nextRowHeader = 'other_vio_'+driverId+'_'+nextAccVioListNdx+'_0';
					}else{
						nextRowHeader = 'vio_'+driverId+'_'+nextAccVioListNdx+'_0';
					}
					
					var vioIndex = 0;
					//$('tr.driverSeparation').last().before('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					var trClone = $('#empty_vio_display_mode').clone();
					//var trCloneSeparation = $('tr.driverSeparation').clone();
					
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.driverId');
					trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
					trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
					
					trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
				    trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(nextAccVioListNdx);
					
					if(endorsementMode == 'true'){
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.violations0.addedInEndorsementInd');
						   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
					   }
					
					//driver on reports
//					trClone.find('td.display_driver_name span.drv_disp_name').text(selectDriverOnReport);
//					trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.driverName');
//					trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].driverName');
//					trClone.find('td.display_driver_name span.drv_nm input[type=hidden]').setValue(selectDriverOnReport);
					
					//TODO need to uncomment after driverTypeCd gets added to Violation
//					if(otherCategory){
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.driverTypeCd');
//						trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].driverTypeCd');
//						if(selectedValue == 'Friend or Relative'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
//						}else if(selectedValue == 'No Driver-Comp Clm'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
//						}else if(selectedValue == 'Unknown Driver'){
//							trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
//						}
//					}
					
					//violation or loss date
					//trClone.find('td.display_date span.disp_drv').text(selectEdDt);
					trClone.find('td.display_date span.disp_drv input').prop('id',nextRowHeader+'_accVioDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.violationDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].violationDt');
					trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);
					//type
					trClone.find("td.display_type span.disp_drv select").prop('id',nextRowHeader+'_accVioType');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].type');
					trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');
					//description
					trClone.find('td.display_desc span.disp_drv select').prop('id',nextRowHeader+'_accVioDesc');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.violationDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].violationDescId');
					trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
			
					//sticking in acc_id
					trClone.find('td.display_desc span.vio_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.violationId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].violationId');
					trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue("");
					
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.violationDescCd');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].violationDescCd');
					trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
					
					trClone.find('td.display_datasource span.disp_dd').text('Client');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].dataSourceCd');
					trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue('Client');
					//state
					trClone.find('td.display_state span.disp_drv select').prop('id',nextRowHeader+'_accVioState');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].violationStateCd');
					trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
					
					//operation
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+nextAccVioListNdx+'.'+'violations0.operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+nextAccVioListNdx+'].violations[0].operation');
					trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
					
					trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+nextAccVioListNdx+'_'+0);
					trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
										
					var driverRowFilter = '';
					if(otherCategory){
						driverRowFilter = "other_driver_row";
					}else{
						driverRowFilter = "driver_row_"+driverId;
					}
					
					var nextRowHeaderIdArray = nextRowHeader.split("_");
					var accidentTrId = "acc_" + nextRowHeaderIdArray[1];
					var trAccLastOccurence = $('tr[id^="'+accidentTrId+'"]').filter(":last");
					
					if(trAccLastOccurence.length > 0){
						var trAccLastOccurenceId = $(trAccLastOccurence).attr("id");
						driverRowFilter = trAccLastOccurenceId;
					}
										
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());
					
					var nextAddRowTemplate = $("#saveCancel_btn_vio").clone();
					//alert('add next row template = '+nextAddRowTemplate.html());
					var nextErrorRowId ='vio_Error_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex;
					nextAddRowTemplate.find('button').prop('id','modify_*vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex);
					nextAddRowTemplate.find('td.assignedDriver_Error_Col').prop('id','vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex+'_assignedDriver_Error_Col');
					nextAddRowTemplate.find('td.accVioDt_Error_Col').prop('id','vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex+'_accVioDt_Error_Col');
					nextAddRowTemplate.find('td.edType_Error_Col').prop('id','vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex+'_edType_Error_Col');
					nextAddRowTemplate.find('td.accVioDesc_Error_Col').prop('id','vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex+'_accVioDesc_Error_Col');
					nextAddRowTemplate.find('td.accVioState_Error_Col').prop('id','vio_'+driverId+'_'+nextAccVioListNdx+'_'+vioIndex+'_accVioState_Error_Col');
					$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
					$('td.newlyAdd').replaceWith(nextAddRowTemplate.html());
					if(otherCategory){
						$("#other_driver_row").show();
					}else{
						$("#driver_row_"+driverId).show();
					}
					
					// Remove the cloned span tags..
					/*$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioDescSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioAssignedDriverSelectBoxItContainer"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxIt"]').remove();
					$('tr[id^="'+nextRowHeader+'"]').find('span[id^="empVioStateSelectBoxItContainer"]').remove();*/
					
					//SSIRIGINEEDI: Rewriting the above code which is redundant and selector is way t0o heavy.
					//All it needs to remove the dropdown container in the row
					$('tr[id^="'+nextRowHeader+'"]').each( function() {
						 $(this).find('div[id$="_chosen"]').remove();
					});
					
					//Recreate new DD with new ID's
					var selectAccVioDesc = $('#'+nextRowHeader+'_accVioDesc');
					addSelectBoxItForAccViol(selectAccVioDesc);
					var selectAssignedDriver = $('#'+nextRowHeader+'_assignedDriver');
					addSelectBoxItForAccViol(selectAssignedDriver);
					var selectState = $('#'+nextRowHeader+'_accVioState');
					addSelectBoxItForAccViol(selectState);
					var selectType = $('#'+nextRowHeader+'_accVioType');
					addSelectBoxItForAccViol(selectType);
					
					//set up the drop down id's
					if(otherCategory){
						$('#'+nextRowHeader+'_assignedDriver').val(assignedDriver).trigger('chosen:updated');
					}else{
						$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
					}
					$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
					$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');
					$('#'+nextRowHeader+'_accVioDt').datepicker({
						showOn: "button",buttonImage: "resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
						dateFormat: 'mm/dd/yy',showButtonPanel : true		
					});
					highlightRow(nextRowHeader);
					resetAddDefaultSelections();
				}
				//alert('there is no violation/accident added for this user Add now all new ok..');
				nextAccVioListNdx = nextAccVioListNdx+1;
				$('#accVioList_LastNdx').val(nextAccVioListNdx);
				//alert($('#accVioList_LastNdx').val());
			}
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$('.tabNextButton').button("enable");
		refreshRateButton();
	});

	$(document).on("click", ".cancelSelected", function(e) {
		// $('.cancelSelected').live("click",function(e){
		// alert('cancel selected live');
		$('tr[class^="selectDriverToAdd"]').toggle();
		$('tr[class^="selectDriverToAddNext"]').hide();
		clearNewlyAddedRow();
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		if(accVioCount > 0){
			$("#accVioTabl tr.display_mode").each(function() {
				$(this).prop('disabled', false);
			});
		}else{
			$("#accVioTabl").hide();
		}
		$('.tabNextButton').button("enable");
		resetAddDefaultSelections();
	});

	// ########## Add new Driver End ###############//
	$("#removeAccVioRowYes").click(function() {
						if (rowId_delete != null && rowId_delete.length > 1) {
							$('#' + rowId_delete)
									.find("td.display_state span.ex_re input[type='hidden']")
									.setValue("DELETE");
							//$('#' + rowId_delete).hide();
							//$('#' + rowId_delete + '_Error').hide();
							//hide() is conflicting with bootstrap modals hide and causing issues with ie8 crash..hence doing the old fashioned way. 

							$('#' + rowId_delete).css("display", "none");
							$('#' + rowId_delete + '_Error').css("display", "none");

							$('#' + rowId_delete).removeClass('display_mode');
							$('#' + rowId_delete).addClass('removed');
							accVioCount--;
							// $('input[name=hasAccVio]').removeAttr('disabled');

							var driverRemainingRows = rowId_delete.split('_');
							var driverId;
							if(driverRemainingRows[0]=='other'){
								driverId = driverRemainingRows[2];
							}
							else{
								driverId = driverRemainingRows[1]
							}
							var hideDriverRow = true;
							var checkAccidentIds = 'acc_' + driverId;
							var checkVioIds = 'vio_' + driverId;
							// alert('driverId to delete = '+driverId);
							$('tr[id^="' + checkAccidentIds + '"]')
									.each(
											function() {
												var clazzApplied = $(this)
														.prop("class");

												// alert('ndx of removed is =
												// '+clazzApplied.indexOf('removed'));
												// if any one row has class
												// applied which is not
												// 'removed'
												// ignore driverSeperation row
												if (clazzApplied
														.indexOf('removed') == -1
														&& clazzApplied
																.indexOf('drvSepAccVio') == -1) {
													// alert('setting false');
													hideDriverRow = false;
												}

											});
							$('tr[id^="' + checkVioIds + '"]')
									.each(
											function() {
												var clazzApplied = $(this)
														.prop("class");
												// alert('vio class applied = '+
												// clazzApplied);
												if (clazzApplied
														.indexOf('removed') == -1
														&& clazzApplied
																.indexOf('drvSepAccVio') == -1) {
													hideDriverRow = false;
												}

											});
							// alert('== hideDriverRow == '+hideDriverRow);
							if (hideDriverRow) {
								var rowToHide = "driver_row_" + driverId;
								// alert('row To Hide = '+rowToHide);
								// driver_row_160583
								$('#' + rowToHide).hide();
							}

							if($("#accVioTabl tr[id*='acc_"+driverId+"']:not([style='display: none']):not([style='display: none;'])").length==0 
									&& $("#accVioTabl tr[id*='vio_"+driverId+"']:not([style='display: none']):not([style='display: none;'])").length==0
									&& $("#accVioTabl tr[id*='other_acc_"+driverId+"']:not([style='display: none']):not([style='display: none;'])").length==0
									&& $("#accVioTabl tr[id*='_other_vio_"+driverId+"']:not([style='display: none']):not([style='display: none;'])").length==0){
								$('#driver_row_'+driverId).remove();
							}
						}
						$('#accVioTabl tr').each(function() {
							if ($(this).attr('id') == rowId_delete) {
								$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]')
										.setValue('Yes');
							}
											/*if ($(this).attr('id') == rowId_delete) {
												$(this)
														.find(
																'td.exclude_reason span.exclude_dd_reason input[type=hidden]')
														.setValue('Yes');
											}*/
						});

						$('#addAccVioDisable').hide();
						$('#addAccVio').show();
						$("#myModal").hide();
						$(".modal-backdrop").hide();
						$('#viewRemovedAccidentsAndViolationsLink').show();
						$('#pipeSeparatorSpan').show();
						$('#containsExcluded').setValue(true);
						refreshRateButton();
	});

	$("#removeAccVioRowNo").click(function() {
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$("#myModal").hide();
		$(".modal-backdrop").hide();
	});

	var updatedId = '';
	deleteDriverClicked = false;
	$(document).on("click", "span[id^='deleteDriver']", function(e) {
		var driverRowId = $(this).attr('id');
		var parId = driverRowId.split('deleteDriver_');
		rowId_delete = parId[1];
		if($(this).find('select').length==0){
			deleteDriverClicked = true;
			$('#myModal').modal();
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
	});

	$(document).on("click","#accVioTabl tr.display_mode>td",function(e){
		//$('#accVioTabl tr.display_mode>td').live("click",function(e){
		var addedInEndtInd = $(this).parent('tr').find('span.addedInEndtInd input[type=hidden]').val();
		if(newBusinessMode || addedInEndtInd == 'Yes'){
			var column = $(this).attr('class');
			var rowStatus =  $(this).parent('tr').prop('disabled');
			var rowClass = $(this).parent('tr').attr('class');
			rowId_delete = $(this).parent('tr').attr('id');			
			if(deleteDriverClicked){
				deleteDriverClicked = false;
			}
			else{
				if(rowStatus == undefined || !rowStatus)
				{
					var otherIndex = rowId_delete.lastIndexOf('other_');
					var rowId_delNew = "";
					var rowId_delNew2 = "";
					if(otherIndex!=-1){
						rowId_delNew = rowId_delete.replace('other_','other_excludeDriver_'); 
						rowId_delNew2 = rowId_delete.replace('other_','deleteDriver_');
					}
					else{
						rowId_delNew = 'excludeDriver_'+rowId_delete; 
						rowId_delNew2 = 'deleteDriver_'+rowId_delete;
					}					
					//hide all delete links
					if(rowId_delete.indexOf('unassigned') == -1){
						//console.log(rowId_delete)
						//$('span.textInblueDeleteDriver').each(function(event){
						$('span.exclude_dd_reason').each(function(event){
							//console.log($(this).attr('id'))
							if($(this).attr('id')!=rowId_delNew && $(this).attr('id')!=rowId_delNew2){
								//$(this).hide();
								$(this).find('select').prop('disabled',true).trigger('chosen:updated');
								$(this).prop('disabled',true).trigger('chosen:updated');
							}
						});						
					}					
					$('#addAccVioDisable').show();
					$('#addAccVio').hide();					
					$('.tabNextButton').button("disable");					
					//alert('rowId_delete = '+rowId_delete);
					var unassignedPrependStr = '';
					if(rowId_delete.indexOf('unassigned')!=-1){
						unassignedPrependStr = "unassigned_";
					}					
					var errorRow = null;
					var errorRowOther = null;
					if(rowId_delete.indexOf('acc_')!=-1){
						var errorRowBuilder = rowId_delete.split('acc_'); 
						errorRow = unassignedPrependStr + 'acc_Error_'+errorRowBuilder[1];
						errorRowOther = unassignedPrependStr + 'acc_Error_'+errorRowBuilder[1];
					}					
					if(rowId_delete.indexOf('other_acc_')!=-1){
						var errorRowBuilder = rowId_delete.split('acc_'); 
						errorRow = unassignedPrependStr + 'acc_Error_'+errorRowBuilder[1];
						errorRowOther = unassignedPrependStr + 'other_acc_Error_'+errorRowBuilder[1];
					}					
					if(rowId_delete.indexOf('vio_')!=-1){
						var errorRowBuilder = rowId_delete.split('vio_'); 
						errorRow = unassignedPrependStr + 'vio_Error_'+errorRowBuilder[1];
					}
					//alert('row id delete is = '+errorRow);
					//var addRow = rowId_delete+'_Error';
					//alert('modify button row = '+addRow);
					if($('#'+errorRow)!=null && $('#'+errorRow).length>0){
						$('#'+errorRow).show();
					}
					if($('#'+errorRowOther)!=null && $('#'+errorRowOther).length>0){
						$('#'+errorRowOther).show();
					}	
					$('#'+rowId_delete).addClass("blueRow");
					disp_type= $(this).parent('tr').find("td.display_type span.id_disp input[type='hidden']").getValue();
					disp_assigned_driver_selected_name = $(this).parent('tr').find("td.assigned_driver span.disp_drv .assignedDriverAccVio option:selected").text();
					disp_assigned_driver_selected = $(this).parent('tr').find("td.assigned_driver span.id_disp input[type='hidden']").getValue();
					disp_desc_selected = $(this).parent('tr').find("td.display_desc span.id_disp_id input[type='hidden']").getValue();
					//disp_desc_selected_name = $(this).parent('tr').find("td.display_desc span.disp_drv").text();
					disp_desc_selected_name = $(this).parent('tr').find("td.display_desc span.id_desc_text input[type='hidden']").getValue();
					disp_acc_vio_date_name = $(this).parent('tr').find("td.display_date span.disp_drv").text();
					disp_acc_vio_date = $(this).parent('tr').find("td.display_date span.id_disp input[type='hidden']").getValue();
					//adding state
					disp_state_selected = $(this).parent('tr').find("td.display_state span.id_disp_id input[type='hidden']").getValue();
					disp_state_selected_name = $(this).parent('tr').find("td.display_state span.disp_drv").text();
					//source
					disp_data_source_cd = $(this).parent('tr').find("td.display_datasource span.disp_dd").text();
					//exclude reason
					disp_exclude_reason = $(this).parent('tr').find("td.exclude_reason span.exclude_dd_reason select.excludeReasonAccVioSelect option:selected").val();
					
					/*		alert('disp_desc_selected = '+disp_desc_selected);
							alert('disp_desc_selected_name = '+disp_desc_selected_name);
							alert('disp_assigned_driver_selected_name='+disp_assigned_driver_selected_name);
							alert('disp_assigned_driver_selected='+disp_assigned_driver_selected);
							alert('disp_acc_vio_date_name='+disp_acc_vio_date_name);
							alert('disp_acc_vio_date='+disp_acc_vio_date);*/				
					/*
					$(this).parent('tr').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .disp_dd').hide();
					$(this).parent('tr').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .ex_reason').
					replaceWith($('tr[class^="edit_mode"]').find('td.edit_datasource .accvio_options ').html());
					$(this).parent('tr').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .ex_re').hide();
					$(this).parent('tr').nextAll('tr[class^="display_mode"]').first().find('td.display_state .disp_drv').hide();
					$(this).parent('tr').nextAll('tr[class^="display_mode"]').first().find('td.display_state .ex_reason').
					replaceWith($('tr[class^="edit_mode"]').find('td.edit_state .accvio_options ').html());
					 */
					$(".clsAccVioDate").datepicker({
						buttonImage: "resources/images/calendar.png",
						dateFormat:'mm/dd/yy',showButtonPanel : true
					});
					
					$(this).parent('tr').removeClass("display_mode");
					$(this).parent('tr').addClass('editingrow');
					updatedId = $('.editingrow').prop('id');
					$('#'+updatedId+'_accVioType').prop('id','edType');
					
					$("#accVioTabl tr.display_mode").each(function(){
						//return false;
						var rowId = this.id;
						//document.getElementById(rowId).disabled = true;
						$(this).prop('disabled',true);
						//alert('rowId value is '+rowId);						
						//Date-picker functionality is disabled for now to skip javascript errors. Need to revisit this
						//$('#'+rowId+'_accVioDt').datepicker('disable');						
						//alert($(this).find("td span.disp_drv select").html());
						//$("SELECT").selectBoxIt('refresh');
						//applyDefaultWidth();
						//$("SELECT").selectBoxIt('disable');
						$(this).find("td span.disp_drv select").prop('disabled',true).trigger('chosen:updated');
						$(this).find("td span.disp_drv input").prop('disabled',true);
						//$(this).addClass("rowHeaderClass");
						/*$('#'+updatedId+'_assignedDriver').prop('disabled',false).trigger('chosen:updated');
						$('#'+updatedId+'_accVioDt').prop('disabled',false);
						$('#edType').prop('disabled',false).trigger('chosen:updated');
						$('#'+updatedId+'_accVioDesc').prop('disabled',false).trigger('chosen:updated');
						$('#'+updatedId+'_accVioState').prop('disabled',false).trigger('chosen:updated');*/
						//$('.ui-datepicker-trigger').hide(); 						
					});
				}
			}
		}
	});

	// Keep Save/cancel in next row avoid manipulating dom
	$(document).on("click",".accVioSave_New",
					function(e) {
						var ButtonId = $(this).prop("id");
						var arrElm = ButtonId.split("*");
						var row_ID = arrElm[1];

						var rower_id = $(this).parents("tr").first().prop("id");
						// alert("save this rower_id = "+rower_id);
						//$('#' + rower_id).hide();
						
						// var updatedId = $('.editingrow').prop('id');
						var rowIdArray = row_ID.split("_");
						var originalDriverId = '';
						if(row_ID.indexOf('other') >= 0){
							originalDriverId = rowIdArray[2];
						}else{
							originalDriverId = rowIdArray[1];
						}
						
						var primaryDriverChanging = false;
						if(originalDriverId == primaryDriverId){
							primaryDriverChanging = true;
						}
						var updatedId = row_ID;
						var driverId = $('#' + updatedId + ' option:selected').val();
						var otherCategory = false;
						var driverChanged = false;
						if(driverId != originalDriverId && (originalDriverId != primaryDriverId || primaryDriverChanging)){
							driverChanged = true;
						}
						 
						var otherSource = $('tr[id^='+updatedId+']').find('td.display_datasource span.id_disp_dd input[type=hidden]');
						//Driver will be disabled for these data sources. Get the driver ID from the disabled field or empty it if not available.
						if(otherSource[0]!=null && (otherSource[0].value=='ECP' || otherSource[0].value=='DHI' || otherSource[0].value=='MVR' || otherSource[0].value=='VIOL')){
						//if(otherSource[0]!=null && otherSource[0].value !='' && otherSource[0].value!=null && otherSource[0].value.toLowerCase()!='Client' && otherSource[0].value.toLowerCase()!='CLUE'){
							var driverDisabled=$(this).parents("tr").prev().find('td.assigned_driver span.id_disp input[type=hidden]');
							if(driverDisabled[0]!=null && driverDisabled[0].value!=null){
								driverId=driverDisabled[0].value;
							}
							else{
								driverId='';
							}
						}
						
						if(driverChanged && (driverId =='Friend or Relative' || driverId=='No Driver-Comp Clm' || driverId=='Unknown Driver' || driverId=='Deceased HH Member')){
							otherCategory = true;
							selectedValue = driverId;
							driverId = primaryDriverId;
						}
						var newTrId = '';
						var typeString = '';
						var typeAccVio = '';
						var otherString = '';
						
						var driverName = $('#' + updatedId+ '_assignedDriver option:selected').text();
						var accVioDt = $('#' + updatedId + '_accVioDt').val();
						var accOrVio = $('#edType').val();
						var updatedIdArray = updatedId.split("_");
						var oldId = updatedId;
						
						if(accOrVio == 'Accident' && updatedId.indexOf("vio_") >= 0){
							updatedId = "acc_" + updatedIdArray[1] + "_" + updatedIdArray[2] + "_" + updatedIdArray[3]; 
						}else if(accOrVio == 'Violation' && updatedId.indexOf("acc_") >= 0){
							updatedId = "vio_" +  + updatedIdArray[1] + "_" + updatedIdArray[2] + "_" + updatedIdArray[3];
						}
						var accVioDesc = $('#' + updatedId + '_accVioDesc option:selected').text();
						var accVioDescIdTemp = $('#' + updatedId + '_accVioDesc option:selected').val();
						var accVioDescIdArray = '';
						var accVioDescId = '';
						if(accVioDescIdTemp!=null || accVioDescIdTemp!=undefined){
							accVioDescIdArray = accVioDescIdTemp.split('_');
							accVioDescId = accVioDescIdArray[0];
						}						
						
						/*var accVioDescLabel = "";
						if($('#'+updatedId).find('td.display_desc span.disp_drv')!=null){
							accVioDescLabel = $.trim($('#'+updatedId).find('td.display_desc span.disp_drv').text());							
						}*/
						
						var accVioState = $('#' + oldId+ '_accVioState option:selected').text();
						var accVioStateId = $('#' + oldId+ '_accVioState option:selected').val();
						var accVioSource = $('tr[id^='+row_ID+']').find('td.display_datasource span.id_disp_dd input[type=hidden]').val();

						var accVioExRe = $('tr[id^='+row_ID+']').find('td.exclude_reason span#id_disp input[type=hidden]').val();
						var updatedIdWithoutOther = oldId.replace('other_','');
						
						var accVioTypeLabelElem = $('#' + oldId).find('td.typeAccVio span.id_disp input');
						if((accOrVio == null || accOrVio=='') && $(accVioTypeLabelElem)!=null && $(accVioTypeLabelElem).val()!=""){
							accOrVio = $(accVioTypeLabelElem).val();
						}
						
						if(accOrVio!=null && (accOrVio.toLowerCase() == 'comp clm' || (driverId =='Friend or Relative' || driverId=='No Driver-Comp Clm' || driverId=='Unknown Driver' || driverId=='Deceased HH Member'))){
							driverId = primaryDriverId;
						}
						
						/**
						 *  Validate required fields before saving
						 **/
						if(!validateAllDataBeforeSaving($(this).closest('tr').prev(),updatedId,updatedIdWithoutOther,oldId,accOrVio,driverId)){
							return false;
						}
						$('#' + rower_id).hide();
						$('#' + row_ID).removeClass("blueRow");						
						if(driverId != originalDriverId || otherCategory){
							if(otherCategory){
								otherString = 'other_';
								$("#other_driver_row").show();
							}else{
								$("#driver_row_"+driverId).show();
							}
							
							typeAccVio = rowIdArray[0];
							
							if(typeAccVio == 'acc' || typeAccVio == 'other'){
								typeString = 'accidents';
							}else{
								typeString = 'violations';
							}
							
							var trToInsertNewRowId = '';
							
							if(otherCategory){
								trToInsertNewRowId = $('#other_driver_row').attr("id");
							}else{
								trToInsertNewRowId = $('#driver_row_'+driverId).attr("id");
							}
							
							var trToInsert = $('#' + row_ID);
							var idArrayAcc = [];
							var driverSeqNum = '';
							var maxAccId = 0;

							var accVioTrs = $('tr[id^=' + typeAccVio + '_' +driverId+'_' +']');
							$(accVioTrs.get()).each( function() {
						       var splitIdArray = $(this).attr('id').split('_');
						       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
						       if(driverSeqNum == ''){
						    	   driverSeqNum = splitIdArray[splitIdArray.length - 2];
						       }
						    });

							var otherAccTrs = $('tr[id^=other_' + typeAccVio + '_' + driverId+ '_'+']');
							$(otherAccTrs.get()).each( function() {
							   var splitIdArray = $(this).attr('id').split('_');
							   idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
							   if(driverSeqNum == ''){
								   driverSeqNum = splitIdArray[splitIdArray.length - 2];
							   }
							});								
							
							if(idArrayAcc.length > 0){
								maxAccId = (idArrayAcc.sort(function(a,b){return b-a;})[0]);
							}
							maxAccId = parseInt(maxAccId) + 1;
							
							if(driverSeqNum == ''){
								var driverSeqNumFields = $('td.assigned_driver span.driverAccidentIndex input[type=hidden]');
								var driverSeqNumArray = [];
								$($(driverSeqNumFields).get()).each( function() {
									var id = $(this).val();
									driverSeqNumArray.push(id);
								}); 
								driverSeqNum = (driverSeqNumArray.sort(function(a,b){return b-a;})[0]);
								driverSeqNum = parseInt(driverSeqNum) + 1;
							}
							
							if(isNaN(driverSeqNum)){
								driverSeqNum=0;
							}
							
							/*if(accVioDesc!=null && accVioDesc!=""){
								$(".editingrow .display_desc span.id_disp_id input[type='hidden']")
								.setValue(accVioDescId);
								$(".editingrow .display_desc span.id_desc_text input[type='hidden']")
								.setValue(accVioDesc);
							}*/
														
							if(typeAccVio=='other' || typeAccVio=='acc'){
								newTrId = otherString + 'acc' + '_' +driverId+'_' + driverSeqNum + '_' + maxAccId;
							}
							
						    var newTrIdArray = newTrId.split('_');
						    var selectEdDt = $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').val();
						    var type = $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').val();
						    if(accVioDesc==null || accVioDesc==''){
						    	accVioDescId = $(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').val();
							    accVioDesc = $(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').val();							    	
						    }
						    var selectedState = $(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').val();							    	
						    var source = $(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').val();
						    var operation = $(trToInsert).find('td.display_state span.ex_re input[type=hidden]').val();
						    var accVioId = '';
						    var driverOnReport = $(trToInsert).find('td.assigned_driver span.disp_drv span.driverOnReportSpan input[type=hidden]').val();
						    //TODO: For manual entries, driverOnReport is undefined and is causing issues later. If so, assign blank (Defect 42015)
						    if(driverOnReport==undefined){
						    	driverOnReport='';
						    }
						    
						    if(typeAccVio == 'acc' || typeAccVio == 'other'){
						    	 accVioId = $(trToInsert).find('td.display_desc span.acc_id input[type=hidden]').val();
						    }else{
						    	 accVioId = $(trToInsert).find('td.display_desc span.vio_id input[type=hidden]').val();
						    }
						    
						    var convictionDt = $(trToInsert).find('td.display_date span.id_disp_2 input[type=hidden]').val();
						    
						    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
						    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
						    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(driverSeqNum);
						    
						    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name','dto.accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].driverName');
						    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id','dto.accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.driverName');
						    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));
						    
						    $(trToInsert).find('td.assigned_driver input[type=hidden]').attr('name','dto.accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].driverName');
						    $(trToInsert).find('td.assigned_driver input[type=hidden]').attr('id','dto.accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.driverName');
						    $(trToInsert).find('td.assigned_driver input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));
						    
						    //$(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(driverSeqNum);
						    //$(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','driverAccidentIndex_'+ driverId + '_' +driverSeqNum+'_'+ maxAccId);
						    
						    $(trToInsert).find("td.assigned_driver span.disp_drv select").prop('id',newTrId+'_assignedDriver');
						    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].driverId');
						    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.driverId');
						    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
						    
						    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].driverId');
						    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.driverId');
						    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').setValue(driverId);
						    
						    $(trToInsert).find('td.assigned_driver div[id^=' + row_ID + '_assignedDriver_chosen' + ']').attr('id',newTrId + '_assignedDriver_chosen');
							   
						   if(endorsementMode == 'true'){
							   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].addedInEndorsementInd');
							   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.addedInEndorsementInd');
							   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
						   }
						 
							// Violation or loss date
						   	// trClone.find('td.display_date span.disp_drv').text(selectEdDt);
						   $(trToInsert).find('td.display_date span.disp_drv input').prop('id',newTrId+'_accVioDt');
						   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.accidentDate');
						   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].accidentDate');
						   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').setValue(accVioDt!=null?accVioDt:selectEdDt);  
						   
						   //$(trToInsert).find('td.display_date span.id_disp_2 input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.convictionDt');
						   ///$(trToInsert).find('td.display_date span.id_disp_2 input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].convictionDt');
						   //$(trToInsert).find('td.display_date span.id_disp_2 input[type=hidden]').setValue(convictionDt);
						   
							//Type
							//trClone.find('td.display_type span.disp_drv').text('Accident');							
						   $(trToInsert).find('td.display_type span.disp_drv select').prop('id',newTrId+'_accVioType');
						   $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.type');
						   $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].type');
						   if(type == 'Accident'){
								$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
								if(otherCategory){
									$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.driverTypeCd');
									$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].driverTypeCd');
									if(selectedValue == 'Friend or Relative'){
										$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
									}else if(selectedValue == 'No Driver-Comp Clm'){
										$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
									}else if(selectedValue == 'Unknown Driver'){
										$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
									}
									else if(selectedValue =='Deceased HH Member'){
										$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
									}
								}else{
									$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
								}
							}else if(type == 'Violation'){
								$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');
								$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
							} else {
								$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('Comp Clm');
								
								$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.driverTypeCd');
								$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].driverTypeCd');
								$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
							}
							
							//description
							//trClone.find('td.display_desc span.disp_drv').text(accVioDesc);
							$(trToInsert).find('td.display_desc span.disp_drv select').prop('id',newTrId+'_accVioDesc');
							$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.accidentDescId');
							$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].accidentDescId');
							$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioDescId);
								
							//sticking in acc_id
							if(typeAccVio == 'acc' || typeAccVio == 'other'){
								$(trToInsert).find('td.display_desc span.acc_id input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.accidentId');
								$(trToInsert).find('td.display_desc span.acc_id input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].accidentId');
								$(trToInsert).find('td.display_desc span.acc_id input[type=hidden]').setValue(accVioId);
							}else{
								$(trToInsert).find('td.display_desc span.vio_id input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.violationId');
								$(trToInsert).find('td.display_desc span.vio_id input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].violationId');
								$(trToInsert).find('td.display_desc span.vio_id input[type=hidden]').setValue(accVioId);
							}
							
							$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.accidentDesc');
							$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].accidentDesc');
							$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDesc);
							//state
							$(trToInsert).find('td.display_state span.disp_drv select').prop('id',newTrId+'_accVioState');
							$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.accidentStateCd');
							$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].accidentStateCd');
							//$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);
							$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState==null?accVioState:selectedState);
								
							//source
							//if(source=='DHI' || source=='MVR'){
							//	$(trToInsert).find('td.display_datasource span.disp_dd').text('VIOL');
							//}
							//else{
							$(trToInsert).find('td.display_datasource span.disp_dd').text(source);	
							//}
							$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.dataSourceCd');
							$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].dataSourceCd');
							//$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(source);
							$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(accVioSource);
							
							//operation
							$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId+'.operation');
							$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].operation');
							$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').setValue(operation);
								
							//exclude reason Delete Link
							//<td class="exclude_reason excludeReasonAccVio"><span id="tmpAccDeleteDriverId" class="exclude_dd_reason">Delete Driver</span></td>
							$(trToInsert).find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+driverSeqNum+'_'+maxAccId);
							$(trToInsert).find('td.exclude_reason span#id_disp input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+'].excludeReasonCd');
							$(trToInsert).find('td.exclude_reason span#id_disp input[type=hidden]').setValue(accVioExRe);
							$(trToInsert).find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
							$(trToInsert).attr('id', newTrId);
							$(trToInsert).toggleClass('display_mode');
						    
							var errorRow = $('tr[id^=' + rowIdArray[0] + '_Error_' + rowIdArray[1] + '_' +  
									rowIdArray[2] + '_' + rowIdArray[3] + ']');
							if(errorRow.length==0){
								errorRow = $('tr[id^=' + rowIdArray[0]  + '_' +rowIdArray[1] + '_Error_' +  
										rowIdArray[2] + '_' + rowIdArray[3] + '_' + rowIdArray[4] + ']');
							}
							
							var newErrorRowId = '';
							//driverId+'_' + driverSeqNum + '_' + maxAccId;
							
							if(otherCategory){
								newErrorRowId = otherString + newTrIdArray[1] + '_Error_' + newTrIdArray[2] + '_' +  
								newTrIdArray[3] + '_' + newTrIdArray[4];
							}else{
								newErrorRowId = newTrIdArray[0] + '_Error_' + newTrIdArray[1] + '_' +  
								newTrIdArray[2] + '_' + newTrIdArray[3];
							}
							
							$(errorRow).attr('id', newErrorRowId);
							$(errorRow).find("td[id='"+ otherString + row_ID +"_assignedDriver_Error_Col']").attr('id',newTrId +'_assignedDriver_Error_Col');
							$(errorRow).find("td[id='"+ otherString + row_ID +"_accVioDt_Error_Col']").attr('id',newTrId +'_accVioDt_Error_Col');
							$(errorRow).find("td[id='"+ otherString + row_ID +"_edType_Error_Col']").attr('id',newTrId +'_edType_Error_Col');
							$(errorRow).find("td[id='"+ otherString + row_ID +"_accVioDesc_Error_Col']").attr('id',newTrId +'_accVioDesc_Error_Col');
							$(errorRow).find("td[id='"+ otherString + row_ID +"_accVioState_Error_Col']").attr('id',newTrId +'_accVioState_Error_Col');
							$(errorRow).find("td[id='"+ otherString + row_ID +"Source_Error_Col']").attr('id',newTrId +'Source_Error_Col');
							$(errorRow).find("td.exclude_reason span > :button").attr('id','modify_*' + newTrId);
							$('#'+trToInsertNewRowId).after(trToInsert);
							$('#' + newTrId).after(errorRow);
							$(errorRow).hide();
						} else{
							$(".editingrow .assigned_driver span.id_disp input[type='hidden']")
									.setValue(driverId);
							var editDate = $('#edDt').val();
							
							var selectEdDtElem = $('#' + updatedIdWithoutOther + '_accVioDt');
							if(selectEdDtElem==undefined){
								selectEdDtElem =  $('#' + oldId + '_accVioDt');
							}
							
							if(accVioDt!=null){
								$(".editingrow .display_date span.id_disp input[type='hidden']")
								.setValue($.trim(accVioDt));
							}	
							else if(selectEdDtElem[0]!=null){
								$(".editingrow .display_date span.id_disp input[type='hidden']")
								.setValue($.trim(selectEdDtElem[0].value));
							}
							
							if(accVioDesc!=null && accVioDesc!=""){
								$(".editingrow .display_desc span.id_disp_id input[type='hidden']")
								.setValue(accVioDescId);
								$(".editingrow .display_desc span.id_desc_text input[type='hidden']")
								.setValue(accVioDesc);
							}
							
							if(accVioStateId!=null && accVioStateId!=""){					
								$(".editingrow .display_state span.id_disp_id input[type='hidden']")
									.setValue(accVioStateId);
							}
							// wrapper enable/disable
							$(".editingrow").find("td span.disp_drv select").prop(
									'disabled', false).trigger('chosen:updated');
	
							/*
							 * $('#'+updatedId+'_assignedDriver').prop('disabled',false).trigger('chosen:updated');
							 * $('#'+updatedId+'_accVioDt').prop('disabled',false);
							 * $('#edType').prop('disabled',false).trigger('chosen:updated');
							 * $('#'+updatedId+'_accVioDesc').prop('disabled',false).trigger('chosen:updated');
							 * $('#'+updatedId+'_accVioState').prop('disabled',false).trigger('chosen:updated');
							 */
							if (accOrVio!=null && (accOrVio == 'Accident' || accOrVio.toLowerCase() == 'comp clm')) {
								if (disp_type == 'Violation') {
									$(".editingrow .display_state span.ex_re input[type='hidden']")
											.setValue("CHANGE");
								}
								$(".editingrow .display_type span.id_disp input[type='hidden']")
								.setValue(accOrVio);
							}
							if (accOrVio!=null && accOrVio == 'Violation') {
								if (disp_type == 'Accident') {
									$(".editingrow .display_state span.ex_re input[type='hidden']")
											.setValue("CHANGE");
								}
							}
							$('.editingrow').nextAll('tr[class^="display_mode"]')
									.first().find('td.display_datasource .disp_dd')
									.show();
							$('.editingrow').nextAll('tr[class^="display_mode"]')
									.first().find('td.display_datasource .ex_re')
									.show();
							$('.editingrow').nextAll('tr[class^="display_mode"]')
									.first().find('td.display_state .disp_drv')
									.show();
							$('.editingrow').nextAll('tr[class^="display_mode"]')
									.first().find('td.display_state .accVioSave')
									.replaceWith(
											'<span class=\"ex_reason"\></span>');
							$('.editingrow').nextAll('tr[class^="display_mode"]')
									.first().find(
											'td.display_datasource .accVioCancel')
									.replaceWith(
											'<span class=\"ex_reason"\></span>');
							// alert('assigned driver =
							// '+$('#'+updatedId+'_assignedDriver
							// option:selected').val());
							// alert('acc vio dt =
							// '+$('#'+updatedId+'_accVioDt').val());
							// set back the id to accident/violation type
							$('#edType').prop('id', updatedId + '_accVioType');
							$('.editingrow').addClass("display_mode");
							$('.editingrow').removeClass("editingrow");
							
							if(disp_acc_vio_date != accVioDt){
								var relevantTrIdArray = row_ID.split("_");
								var relevantTr = $('tr[id^=' + relevantTrIdArray[0] + '_' + relevantTrIdArray[1] + ']');
								var insertBefore = false;
								var insertAfter = false;
								var trToInsertNewRowId = '';
								var trToInsert = null;
								
								var lengthOfTrArray = $(relevantTr).length;
								$(relevantTr).each(function(index) {
									var dateStr = $(this).find('td.display_date span.id_disp input[id$=accidentDate]').val();
									var date = Date.parse(dateStr);
									var currentDate = Date.parse(accVioDt);
									trToInsertNewRowId = $(this).attr("id");
									trToInsert = $('#' + row_ID);
									if(currentDate > date){
										insertBefore = true;
										return false;
									}else if(currentDate == date){
										var source = $(this).find('td.display_datasource span.id_disp_dd input[type=hidden]').val();
										var currentSource = accVioSource;
										
										if(source == 'Client'){
											
										}
									}else if(index == lengthOfTrArray - 1){
										insertAfter = true;
										return false;
									}
								});
								
								if(insertBefore){
									$('#'+trToInsertNewRowId).before(trToInsert);
									var errorRow = $('tr[id^=' + relevantTrIdArray[0] + '_Error_' + relevantTrIdArray[1] + '_' +  relevantTrIdArray[2] + '_' + relevantTrIdArray[3] + ']');
									$('#' + row_ID).after(errorRow);
								}else if(insertAfter){
									var trToInsertNewRowIdArray = trToInsertNewRowId.split("_");
									var trToInsertNewRowErrorRowId = trToInsertNewRowIdArray[0] + '_Error_' + trToInsertNewRowIdArray[1] + '_' +  trToInsertNewRowIdArray[2] + '_' + trToInsertNewRowIdArray[3];
									$('#'+trToInsertNewRowErrorRowId).after(trToInsert);
									var errorRow = $('tr[id^=' + relevantTrIdArray[0] + '_Error_' + relevantTrIdArray[1] + '_' +  relevantTrIdArray[2] + '_' + relevantTrIdArray[3] + ']');
									$('#' + row_ID).after(errorRow);
								}
							} else if(driverId != disp_assigned_driver_selected){
								
							}
								highlightRow(row_ID);
							}
							
							$('#addAccVioDisable').hide();
							$('#addAccVio').show();
							
							$("#accVioTabl tr.display_mode").each(
									function() {
										var rowId = this.id;
										$(this).prop('disabled', false);
	
										//$('span.textInblueDeleteDriver').each(
										$('span.exclude_dd_reason').each(
												function(event) {
													//$(this).show();
													$(this).find('select').prop('disabled',false).trigger('chosen:updated');
													$(this).prop('disabled',false).trigger('chosen:updated');
												});
										// alert('date picker enabled for rowId
										// ='+rowId);
										
										//Date-picker functionality is disabled for now to skip javascript errors. Need to revisit this
										/*$('#' + rowId + '_accVioDt').datepicker(
												'enable');*/
										
										$(this).find("td.display_date span.disp_drv input")
										.prop('disabled', false);
										// $('#'+rowId+'_accVioDt').datepicker('enable');
										// alert('cancel event on rows
										// aeefecting'+rowId);
										$(this).find("td span.disp_drv select")
												.prop('disabled', false).trigger(
														'chosen:updated');
										
										var driverName = $(this).find("td span.disp_drv select.selected_driver_class");
										if($(driverName)!=null && $(driverName).val()=='No Driver-Comp Clm'){
											$(driverName).prop('disabled', true).trigger('chosen:updated');
											$(this).find("td.typeAccVio span.disp_drv select").prop('disabled',true).trigger('chosen:updated');
										}
										 
										$(this).find("td span.disp_drv input")
												.prop('disabled', false);
										// $(this).removeClass("rowHeaderClass");
										$('.ui-datepicker-trigger').show();
									});
							
							e.preventDefault();
							e.stopPropagation();
							refreshRateButton();
		});

		$(document).on("click",".accVioCancel_New",
					function(e) {

						var ButtonId = $(this).prop("id");
						var arrElm = ButtonId.split("*");
						var row_ID = arrElm[1];
						var rower_id = $(this).parents("tr").first().prop("id");
						// alert("rower_id = "+rower_id);
						$('#' + rower_id).hide();
						$('#' + row_ID).removeClass("blueRow");

						var updatedId = row_ID;
						var driverId = disp_assigned_driver_selected;
						var driverName = disp_assigned_driver_selected_name;
						// alert(driverName);
						var accVioId = disp_desc_selected;
						var accVioDesc = disp_desc_selected_name;

						//$(this).parent('tr').find("td.assigned_driver span.disp_drv .assignedDriverAccVio option:selected").text();
						
						var accVioStateId = disp_state_selected;
						var accVioStateDesc = disp_state_selected_name;

						var display_type = disp_type;
						var display_date_text = disp_acc_vio_date_name;
						var display_date_hidden = disp_acc_vio_date;
						
						var data_source_cd = disp_data_source_cd;

						var disp_exc_reason = disp_exclude_reason;
												
						if(driverId=='Select'){
							driverId='';
						}
						if(display_type==''){
							display_type = $(this).closest('tr').prev().find("td.display_type span.id_disp input[type='hidden']").getValue();
						}
						if(display_type.toLowerCase() == 'comp clm' || (driverId =='Friend or Relative' || driverId=='No Driver-Comp Clm' || driverId=='Unknown Driver' ||  driverId=='Deceased HH Member')){
							driverId = primaryDriverId;
						}

						// cancel display type
						$('#edType').val(display_type);
						// $(".editingrow .display_type
						// span.disp_drv").replaceWith('<span
						// class=\"disp_drv\">'+display_type+'</span>');
						$(".editingrow .display_type span.id_disp input[type='hidden']").setValue(display_type);
						// cancel drive name and id
						// $(".editingrow .assigned_driver
						// span.disp_drv").replaceWith('<span
						// class=\"disp_drv\">'+driverName+'</span>');
						if(rower_id.indexOf('unassigned') >= 0){
							$('#' + updatedId + '_assignedDriver').val('');
							/*$(".editingrow .assigned_driver span.id_disp input[type='hidden']")
									.setValue('Select');*/
							$(".editingrow .assigned_driver span.id_disp input[type='hidden']")
							.setValue('');
						}else{
							$('#' + updatedId + '_assignedDriver').val(driverId);
							$(".editingrow .assigned_driver span.id_disp input[type='hidden']")
									.setValue(driverId);
							// cancel desc/id
							$('#' + updatedId + '_accVioState').val(accVioStateId);
							$(".editingrow .display_state span.id_disp_id input[type='hidden']")
									.setValue(driverId);
						}
						// $(".editingrow .display_desc
						// span.disp_drv").replaceWith('<span
						// class=\"disp_drv\">'+accVioDesc+'</span>');
						// alert('accVioId default value is = '+accVioId);
						var ddId = updatedId + '_accVioDesc';
						// alert('updatedId is = '+updatedId);
						if (display_type == 'Accident') {
							if(rower_id.indexOf('unassigned') == 0){
								//$('#' + ddId).closest('tr').find('td.display_desc span.disp_drv').text(accVioStateDesc);
							}else{
								if(data_source_cd != 'Client'){
									$(".editingrow td.display_desc span.disp_drv")
									.replaceWith(accVioDesc);
								} else{
									$(".editingrow td.display_desc span.disp_drv")
									.replaceWith($('tr[class^="edit_mode"]').find(
													'td.edit_desc_acc').html());
										$(".editingrow td.display_desc span.disp_drv select")
												.prop('id', ddId);
										/*$('#' + ddId).closest('tr').find(
												'span[id^="editAccSelectBoxIt"]').remove();
										$('#' + ddId).closest('tr').find(
												'span[id^="editAccSelectBoxItContainer"]')
												.remove();*/
									$('#' + ddId).closest('tr').find('div[id$="editAcc_chosen"]').remove();
									var selectAccVioDesc = $('#' + ddId);
									addSelectBoxItForAccViol(selectAccVioDesc);
									var combinedId = accVioId + '_' + accVioDesc;
									$('#' + updatedId + '_accVioDesc').val(combinedId);
									$('#' + ddId).trigger('chosen:updated');
								}
							}
						}
						if (display_type.toLowerCase() == 'comp clm') {
							if(rower_id.indexOf('unassigned') == 0){
								//$('#' + ddId).closest('tr').find('td.display_desc span.disp_drv').text(accVioStateDesc);
							}else{
								if(data_source_cd != 'Client'){
									$(".editingrow td.display_desc span.disp_drv")
									.replaceWith(accVioDesc);
								}
								else{
									$(".editingrow td.display_desc span.disp_drv")
									.replaceWith(
											$('tr[class^="edit_mode"]').find(
													'td.edit_desc_com').html());
									$(".editingrow td.display_desc span.disp_drv select")
											.prop('id', ddId);
									//$('#' + ddId).trigger('chosen:updated');
									/*$('#' + ddId).closest('tr').find(
											'span[id^="editComSelectBoxIt"]').remove();
									$('#' + ddId).closest('tr').find(
											'span[id^="editComSelectBoxItContainer"]')
											.remove();*/
									$('#' + ddId).closest('tr').find('div[id$="editCom_chosen"]').remove();
									var selectAccVioDesc = $('#' + ddId);
									addSelectBoxItForAccViol(selectAccVioDesc);
									var combinedId = accVioId + '_' + accVioDesc;
									$('#' + updatedId + '_accVioDesc').val(combinedId);
									$('#' + ddId).trigger('chosen:updated');
								}
							}
						}
						if (display_type == 'Violation') {
							if(rower_id.indexOf('unassigned') == 0){
								//$('#' + ddId).closest('tr').find('td.display_desc span.disp_drv').text(accVioStateDesc);
							}else{
								$('.editingrow td.display_desc span.disp_drv')
								.replaceWith(
										$('tr[class^="edit_mode"]').find(
												'td.edit_desc_vio').html());
								$(".editingrow td.display_desc span.disp_drv select")
										.prop('id', ddId);
								/*$('#' + ddId).closest('tr').find(
										'span[id^="editVioSelectBoxIt"]').remove();
								$('#' + ddId).closest('tr').find(
										'span[id^="editVioSelectBoxItContainer"]')
										.remove();*/
								$('#' + ddId).closest('tr').find('div[id$="editVio_chosen"]').remove();
								var selectAccVioDesc = $('#' + ddId);
								addSelectBoxItForAccViol(selectAccVioDesc);
								var combinedId = accVioId + '_' + accVioDesc;
								$('#' + updatedId + '_accVioDesc').val(combinedId);
								$('#' + ddId).trigger('chosen:updated');
							}
						}
						// $('#'+updatedId+'_accVioDesc').val(accVioId);

						$(".editingrow .display_desc span.id_disp_id input[type='hidden']")
								.setValue(accVioId);
						$(".editingrow .display_desc span.id_desc_text input[type='hidden']")
								.setValue(accVioDesc);
						// $('#'+updatedId+'_accVioDesc').show();
						// cancel date
						$('#' + updatedId + '_accVioDt').val(
								display_date_hidden);
						$(".editingrow .display_date span.id_disp_id input[type='hidden']")
								.setValue($.trim(display_date_hidden));

						$('#' + updatedId + '_accVioState').val(accVioStateId);
						$(".editingrow .display_state span.id_disp_id input[type='hidden']")
								.setValue(accVioStateId);
						
						$(".editingrow").find("td.exclude_reason span.exclude_dd_reason select.excludeReasonAccVioSelect")
							.val(disp_exc_reason).trigger('chosen:updated');

						$(".editingrow").find("td.exclude_reason span#id_disp input[type='hidden']")
							.setValue(disp_exc_reason);
						
						// $(".editingrow .action_col
						// span.accvio_options").hide();
						// wrapper disabled
						if (driverName == 'Friend or Relative' || driverName == 'No Driver-Comp Clm'
							|| driverName == 'Unknown Driver' || driverName == 'Deceased HH Member') {
								if (driverName == 'No Driver-Comp Clm') {
									$(".editingrow").find("td.assigned_driver span.disp_drv select").val(driverName).prop('disabled',true).trigger('chosen:updated');
									$(".editingrow").find("td.typeAccVio span.disp_drv select").prop('disabled',true).trigger('chosen:updated');
								} else {
									$(".editingrow").find("td.assigned_driver span.disp_drv select").val(driverName).prop('disabled',false).trigger('chosen:updated');
									$(".editingrow").find("td span.disp_drv select").prop('disabled', false).trigger('chosen:updated');
								}
						} else {
							$(".editingrow").find("td span.disp_drv select").prop('disabled', false).trigger('chosen:updated');
						}
		
						if(driverName == 'Friend or Relative'){
							$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('F');								
						}else if(driverName == 'No Driver-Comp Clm'){
							$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');
						}else if(driverName == 'Unknown Driver'){
							$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('K');
						}else if(driverName =='Deceased HH Member'){
							$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('H');
						}else{
							$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
						}
						
						$('.editingrow').nextAll('tr[class^="display_mode"]')
								.first().find('td.display_datasource .disp_dd')
								.show();
						$('.editingrow').nextAll('tr[class^="display_mode"]')
								.first().find('td.display_datasource .ex_re')
								.show();
						$('.editingrow').nextAll('tr[class^="display_mode"]')
								.first().find('td.display_state .disp_drv')
								.show();
						$('.editingrow').nextAll('tr[class^="display_mode"]')
								.first().find('td.display_state .accVioSave')
								.replaceWith(
										'<span class=\"ex_reason"\></span>');
						$('.editingrow').nextAll('tr[class^="display_mode"]')
								.first().find(
										'td.display_datasource .accVioCancel')
								.replaceWith(
										'<span class=\"ex_reason"\></span>');
						// set the id back to what it was for acc_vio type
						$('#edType').prop('id', updatedId + '_accVioType');

						// alert('assigned driver =
						// '+$('#'+updatedId+'_assignedDriver').text());
						// alert('acc vio dt =
						// '+$('#'+updatedId+'_accVioDt').val());
						$('.editingrow').addClass("display_mode");
						$('.editingrow').removeClass("editingrow");

						$('#addAccVioDisable').hide();
						$('#addAccVio').show();

						//$('span.textInblueDeleteDriver').each(function(event) {
						$('span.exclude_dd_reason').each(function(event) {
							//$(this).show();
							$(this).find('select').prop('disabled',false).trigger('chosen:updated');
							$(this).prop('disabled',false).trigger('chosen:updated');
						});

						highlightRow(row_ID);

						$("#accVioTabl tr.display_mode").each(
								function() {
									// return false;
									// var rowId = this.id;
									// document.getElementById(rowId).disabled =
									// true;
									// $("SELECT").selectBoxIt('refresh');
									// applyDefaultWidth();
									// $("SELECT").selectBoxIt('enable');
									$(this).prop('disabled', false);
									var rowId = this.id;
									// alert('cancel event on rows
									// aeefecting'+rowId);
									
									//Date-picker functionality is disabled for now to skip javascript errors. Need to revisit this
									/*$('#' + rowId + '_accVioDt').datepicker(
											'enable');*/
									
									$(this).find("td span.disp_drv select")
											.prop('disabled', false).trigger(
													'chosen:updated');
									$(this).find("td span.disp_drv input")
											.prop('disabled', false);
									
									var driverName = $(this).find("td span.disp_drv select.selected_driver_class");
									if($(driverName)!=null && $(driverName).val()=='No Driver-Comp Clm'){
										$(driverName).prop('disabled', true).trigger('chosen:updated');
										$(this).find("td.typeAccVio span.disp_drv select").prop('disabled',true).trigger('chosen:updated');
									}
									
									// $('.ui-datepicker-trigger').show();
								});
						e.preventDefault();
						e.stopPropagation();

	});

	$('#viewAccVio3rdPartyReportDetails').on("click", function() {
		$('#viewAccVioThirdPartyReportLinks').modal().position({
			my : 'left top',
			at : 'center bottom',
			of : '#viewAccVio3rdPartyReportDetails'
		});
	});

	$('#viewRemovedAccidentsAndViolationsLink').on("click",
		function() {
			document.aiForm.viewRemovedAccidentsAndViolations.value = 'true';
			nextTab(document.aiForm.currentTab.value,
					document.aiForm.currentTab.value);
	});

	$('#viewReportsDetailsLink').on(
			"click",
			function() {
				document.aiForm.viewReportOrderStatusDetails.value = 'true';
				nextTab(document.aiForm.currentTab.value,
						document.aiForm.currentTab.value);
	});
	
	$('#viewReportsEndorsementDetailsLink').on(
			"click",
			function() {
				$('#reportDetails').modal().position({
					my : 'left top',
					at : 'left bottom',
					of : '#viewReportsDetailsLink'
				});
	});

	$('#viewClaimAbstractLink').click(
			function() {
				$('#viewAccVioThirdPartyReportLinks').hide();
				document.aiForm.viewClaimAbstractPopup.value = 'true';
				nextTab(document.aiForm.currentTab.value,
						document.aiForm.currentTab.value);
				 //$.ajax({type: "GET",dataType: "html",url:
				 //"/aiui/accidentsViolations/viewThirdPartyClaimAbstract/1234",
				 //success: function(data){$("#someModal").html(data);}});
	});

	$('#viewViolationAbstractLink').click(
			function() {
				$('#viewAccVioThirdPartyReportLinks').hide();
				document.aiForm.viewViolationAbstractPopup.value = 'true';
				nextTab(document.aiForm.currentTab.value,
						document.aiForm.currentTab.value);
				 //$.ajax({type: "GET",dataType: "html",url:
				 //"/aiui/accidentsViolations/viewThirdPartyViolationAbstract/1234",
				 //success: function(data){$("#someModal").html(data);}});
	});

	$('#orderRptBtn').click(
		function() {
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,
					document.aiForm.currentTab.value);
		}
	);
	
	$('#orderRptEndorsementBtn').click(
		function() {
			$('#orderThirdPartyEndorsementWarnModal').modal();
			return false;
		}
	);
	
	$('#orderReportsEndorsementsTrigger').click(
		function() {
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,
					document.aiForm.currentTab.value);
		}
	);
	
	$('#orderStatusReportsOrder').click(
		function() {
			$('#reportDetails').hide();
			var driverIdToOrderReport = $(this).find('#reportStatusReportOrderDriverId').val();
			
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,
					document.aiForm.currentTab.value);
		}
	);

	if (showViewClaimAbstractPopup == 'true'
			&& document.aiForm.currentTab.value == 'accidentsViolations') {
		$('#viewClaimsAbstract').modal();
	}

	if (showViewViolationAbstractPopup == 'true'
			&& document.aiForm.currentTab.value == 'accidentsViolations') {
		$('#viewViolationsAbstract').modal();
	}

	if (showViewReportOrderStatusDetails == 'true'
			&& document.aiForm.currentTab.value == 'accidentsViolations') {
		$('#reportDetails').modal().position({
			my : 'left top',
			at : 'left bottom',
			of : '#viewReportsDetailsLink'
		});
	}

	if (showViewRemovedAccidentsAndViolations == 'true'
			&& document.aiForm.currentTab.value == 'accidentsViolations') {
		$('#viewDeletedAccVio').modal().position({
			my : 'center top',
			at : 'center bottom',
			of : '#viewRemovedAccidentsAndViolationsLink',
			collision: 'fit'
		});
	}
	
	if(orderThirdPartyResponseClean == 'true'){
		$('#accVioCleanInfoModal').modal();
	}
	
	if(orderThirdPartyResponseReview == 'true'){
		$('#accVioReviewInfoModal').modal();
		refreshRateButton();
	}
	
	if(showTabsErroneousPopupFlag == 'true'){
		$('#orderThirdPartyTabsErroneousModal').modal();
	}
	
	if(showPrefillRequiredPopupFlag == 'true'){
		$('#orderThirdPartyPrefillNotReconciledModal').modal();
	}
	
	if(showInvalidDriverLicenseFlag == 'true'){
		$('#orderThirdPartyInvalidLicenseModal').modal();
	}
	
	if(showInvalidVinPopupFlag == 'true'){
		$('#orderThirdPartyInvalidVinModal').modal();
	}
	
	//TODO Edits
	$('.selected_driver_class').on("change", function(e) {
		var driverId = $(this).val();
		validateField(this, this.id, 'required');
		/*if(driverId.indexOf('F') != -1){
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('F');
		}*/
		var accVioType=$(this).closest('tr').find('td.typeAccVio span.id_disp input[type=hidden]')[0];
		if(accVioType!=null && $(this).closest('tr').find('td.typeAccVio span.disp_drv select').length==0){
			validateCompClaim($(this)[0],accVioType.value);
		}
		defaultExcludeReason($(this)[0],$(this).closest('tr').find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0],driverId);
		validateExcludeReason($(this)[0],$(this).closest('tr').find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0],driverId,$(this).closest('tr').find('td.display_datasource span.disp_dd').text());
		if(driverId.indexOf('Friend or Relative') >= 0){
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('F');
		}
		else if(driverId.indexOf('No Driver-Comp Clm') >= 0){
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('C');
		}
		else if(driverId.indexOf('Unknown Driver') >= 0){
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('K');
		}
		else if(driverId.indexOf('Deceased HH Member') >= 0){
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('H');
			//$(this).closest('td').find("span.id_disp_drvaccvio input[type='hidden']").setValue('').trigger('chosen:updated');
			//$(this).closest('td').find("span.id_disp input[type='hidden']").setValue('').trigger('chosen:updated');
		}
		else{
			$(this).closest('td').find("span.id_drv_type input[type='hidden']").setValue('');
			$(this).closest('td').find("span.id_disp_drvaccvio input[type='hidden']").setValue('').trigger('chosen:updated');
			$(this).closest('td').find("span.id_disp input[type='hidden']").setValue('').trigger('chosen:updated');
		}
		refreshRateButton();
	});

	/*$('.clsAccVioDate').on("change", function(e) {
		validateAccVioDateField(this);		
	});*/
	
	$('.lossDateAccVio').on("change", function(e) {
		validateAccVioDateField(this);		
		refreshRateButton();
	});
	
	$('.select_type_available').on("change", function(e) {
		validateField(this, this.id, 'required');
		refreshRateButton();
	});

	$('.select_populated_desc_class_accident_acc').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('.selected_populated_desc_class_accident').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('.populated_desc_class_accident').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('.select_populated_desc_class_accident_vio').on("change", function(e) {
		validateField(this, this.id, 'required');
	});

	$('.select_populated_desc_class_accident_com').on("change", function(e) {
		validateField(this, this.id, 'required');
	});

	$('.selected_populated_state_class').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('.selected_populated_state_class_').on("change", function(e) {
		validateField(this, this.id, 'required');
	});	
	
	$(document).on("click", "#openPrefillDialog", function(){
		$('#orderThirdPartyPrefillNotReconciledModal').hide();
		//$('#prefillDialog').show();
		$('#prefillDialog').modal('show');
		initializePrefilldata();
	});
	
	$("#prefillReconcileLaterAccVio").click(function(){
		$("#orderThirdPartyPrefillNotReconciledModal").modal('hide');
		$(".modal-backdrop").hide();
	});

	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
	$('#selectEdDt').keyup(function(event){
		autoSlashes(this,event);
    });
	
	$("[id$=accVioDt]").keyup(function(event){
		autoSlashes(this,event);
    });
	
	$('.excludeReasonAccVioSelect').on("change", function(e) {
		$(this).closest('td').find('#excludeReasonHidden').val(this.value);
		var driverIdElem = $(this).closest('tr').find('td.assigned_driver span.id_disp input[type=hidden]')[0];
		if(driverIdElem!=null){
			validateExcludeReason($(this).closest('tr').find('td.assigned_driver span.disp_drv select.assignedDriverAccVio')[0],$(this)[0],driverIdElem.value,$(this).closest('tr').find('td.display_datasource span.disp_dd').text());
		}
		else{
			validateExcludeReason($(this).closest('tr').find('td.assigned_driver span.disp_drv select.assignedDriverAccVio')[0],$(this)[0],'',$(this).closest('tr').find('td.display_datasource span.disp_dd').text());
		}
		
		refreshRateButton();
	});
	
	var containsOther = $('#containsOther').val();
	var containsUnassigned = $('#containsUnassigned').val();
	if(containsOther == 'false'){
		$('#other_driver_row').hide();
	}else{
		$('#other_driver_row').show();
	}
	
	$('.assignedDriverAccVio').on("change", function(e) {
		var selectValue = $(this).val();
		if(selectValue==''){
			return false;
		}
		var accVioType=$(this).closest('tr').find('td.typeAccVio span.id_disp input[type=hidden]')[0];
		if(accVioType!=null){
			validateCompClaim($(this)[0],accVioType.value);
		}
		defaultExcludeReason($(this)[0],$(this).closest('tr').find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0],selectValue);
		validateExcludeReason($(this)[0],$(this).closest('tr').find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0],selectValue,$(this).closest('tr').find('td.display_datasource span.disp_dd').text());
		if(selectValue == 'No Driver-Comp Clm'){
			var selectTypeBox = $(this).closest('tr').find("td.select_display_type span.disp_drv select[id^='selectEdType']"); 
			var type = $(selectTypeBox).val();
			if(type==undefined){
				selectTypeBox = $(this).closest('tr').find("span.disp_drv select.typeAccVio");
				type = $(selectTypeBox).val();
			}
			if(type != 'Comp Clm'){
				var descBox = $(this).closest('tr').find("td.select_display_desc span.disp_drv_acc select.descriptionAccVio");
				$(selectTypeBox).val('Comp Clm').trigger('chosen:updated');
				$(this).closest('tr').find('td.select_display_desc span.disp_drv_com').show();
				$(this).closest('tr').find('td.select_display_desc span.disp_drv_vio').hide();
				$(this).closest('tr').find('td.select_display_desc span.disp_drv_acc').hide();
				$(descBox).val('').trigger('chosen:updated');
				if($(this).closest('tr').hasClass('selectDriverToAdd')){
					$(this).prop('disabled',true).trigger('chosen:updated');
					$(selectTypeBox).prop('disabled',true).trigger('chosen:updated');
					$(selectTypeBox).removeClass('inlineError').trigger('chosen:styleUpdated');
					$('.selectDriverToAddNext').find('td#selectDriverToAdd_selectEdType_Error_Col span').text('');
				}
				
			}
		} else{
			var selectTypeBox = $(this).closest('tr').find("td.select_display_type span.disp_drv select[id^='selectEdType']"); 
			var type = $(selectTypeBox).val();
			if(type==undefined){
				selectTypeBox = $(this).closest('tr').find("span.disp_drv select.typeAccVio");
				type = $(selectTypeBox).val();
			}
			if(type == 'Comp Clm'){
				var descBox = $(this).closest('tr').find("td.select_display_desc span.disp_drv_acc select.descriptionAccVio");
				$(selectTypeBox).val('').trigger('chosen:updated');
				$('.disp_drv_com').show();
				$('.disp_drv_vio').hide();
				$('.disp_drv_acc').hide();
				$(descBox).val('').trigger('chosen:updated');
			}
		}
		refreshRateButton();
	});
	
	$(document).on("click", ".fixVehicleVin", function(){
		jumpToDifferentTab("vehicles");
	});
	
	$(document).on("click", ".fixDriverLic", function(){
		jumpToDifferentTab("drivers");
	});
	
	var showAddRowByDefault = $('#showAddRowByDefault').val();
	if(showAddRowByDefault == 'true'){
		$('#manualView').show();
		$('tr.selectDriverToAdd').show();
		$('tr.selectDriverToAddNext').show();
	}else{
		$('tr.selectDriverToAdd').hide();
		$('tr.selectDriverToAddNext').hide();
	}
	initialFormLoadProcessing();
});

function validateField(fieldObj, fieldName, validationType) {
	if(fieldObj.value!='' && fieldObj.value!='Select' && validationType=='required'){
		validationType = '';
	}
	var errorMessage = '';
	var messageAppendValue = validationType;
	var trId = $(fieldObj).parents('tr').first().prop('id');
	var str0;
	var str1;
	var colId;
	var errorRowId;
	if(trId.indexOf("_")>0){
		str0 = trId.substring(0, trId.indexOf("_"));
		str1 = trId.substring(trId.indexOf("_"), trId.length);
		errorRowId = str0 + '_Error' + str1;
		fieldName = fieldName.substring(fieldName.lastIndexOf("_")+1, fieldName.length);
		colId =  fieldName;
		if(errorRowId.indexOf('unassigned_Error_acc')>=0){
			errorRowId = errorRowId.replace('unassigned_Error_acc','unassigned_acc_Error');
		}
		else if(errorRowId.indexOf('other_Error_acc')>=0){
			errorRowId = errorRowId.replace('other_Error_acc','other_acc_Error');
		}
	}
	else{
		str0 = trId;
		str1 = "";
		colId =  fieldName;
		errorRowId = str0 + 'Next';
	}		
	
	if(fieldName!=null && (fieldName=='select_manual_addicent_id' || fieldName=='select_manual_violation_id' || fieldName=='select_manual_comp_id')){
		fieldName = 'select_desc';
	}
	
	var errorColumnId = trId + '_' + fieldName + '_Error_Col';	
	var errorMessageKey = str0 + '_' + fieldName + '.browser.inLine' + '.'+ messageAppendValue;	
	errorMessage = getMessageWithMap(errorMessageKey, errorMessages);	
	if (errorMessage.length > 0) {
		errorMessageID = fieldName + '.' + errorMessageKey;
	} else {
		errorMessage = 'Required Field';
	}

	if (validationType == 'required') {
		displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,
					errorMessage,colId);
		return;		
	}
	if(validationType == ''){
		clearFieldErrorMessageInDataTable(errorRowId, errorColumnId,
				errorMessage,colId);
		return;
	}

	displayFieldErrorMessageInDataTable(errorRowId, errorColumnId, errorMessage,colId);
}


function displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,
		errorMessage,colId) {
	//console.log('errorRowId:'+errorRowId);
	$('#accVioTabl tr').each(function() {
		//console.log('Actual:'+$(this).attr('id'));
		if ($(this).attr('id') == errorRowId) {
			var td = $(this).find('td[id^="' + errorColumnId + '"]').find('span');
			$(td).text(errorMessage);
			$('#'+colId).addClass('inlineError').trigger('chosen:styleUpdated');
		}
	});
}

function clearFieldErrorMessageInDataTable(errorRowId, errorColumnId,
		errorMessage,colId) {
	$('#accVioTabl tr').each(function() {
		if ($(this).attr('id') == errorRowId) {
			var td = $(this).find('td[id^="' + errorColumnId + '"]').find('span');
			$(td).text('');
			$('#'+colId).removeClass('inlineError').trigger('chosen:styleUpdated');
		}
	});
}

function validateAccVioDateField(fieldObj){
	if ($(fieldObj).val() == ''){
		validateField(fieldObj, fieldObj.id, 'required');
	}else{
		var dateId = '#' + fieldObj.id;
		if (isValidDateFormat(dateId) == false){
			validateField(fieldObj, fieldObj.id, 'invalidFormat');			
		}
		//Future dates are allowed as part of change control
		/*if (isFutureDate(fieldObj.value) == true){
			validateField(fieldObj, fieldObj.id, 'noFutureDate');			
		}*/
		else{
			validateField(fieldObj, fieldObj.id, '');	
		}
	}	
}

/**
 * This method is removed as part of change control. Future dates are allowed.
 * */
function isFutureDate(dateVal){
	if(new Date(dateVal) > new Date()){
		return true;
	}
	return false;
}

// <td class=\"deleteColumnAccVioNonEditable\"></td>

var fieldIdToModelErrorRow = {
	"accVioManualEditRow" : "<tr id=\"sampleErrorRow\">"
			+ "<td  class=\"assignedDriverAccVio\"  id=\"assignedDriverAccVio_Error_Col\"></td>"
			+ "<td  class=\"lossDateAccVio\" id=\"accVioDt_Error_Col\"></td>"
			+ "<td  class=\"typeAccVio\" id=\"accVioType_Error_Col\"></td>"
			+ "<td  class=\"descriptionAccVio\" id=\"accVioDesc_Error_Col\" ></td>"
			+ "<td  class=\"stateAccVio\" id=\"accVioState_Error_Col\" ></td>"
			+ "<td  class=\"sourceAccVio\" id=\"Source_Error_Col\"></td>"
			+ "<td  class=\"excludeReasonAccVio\" id=\"excludeReason_Error_Col\"></td></tr>"
};

function applyDefaultWidth() {
	$("select[id$='assignedDriver']").addClass("widthDD150");
	$("div[id$='assignedDriverSelectBoxIt']").addClass("widthDD150");
	$("div[id$='assignedDriverSelectBoxItOptions']").addClass("widthDD150");
	$("ul[id$='assignedDriverSelectBoxItOptions']").addClass("widthDD150");

	$("select[id$='accVioType']").addClass("widthDD90");
	$("div[id$='accVioTypeSelectBoxIt']").addClass("widthDD90");
	$("div[id$='accVioTypeSelectBoxItOptions']").addClass("widthDD90");
	$("ul[id$='accVioTypeSelectBoxItOptions']").addClass("widthDD90");

	$("select[id$='accVioDesc']").addClass("widthDD220");
	$("div[id$='accVioDescSelectBoxIt']").addClass("widthDD220");
	$("div[id$='accVioDescSelectBoxItOptions']").addClass("widthDD220");
	$("ul[id$='accVioDescSelectBoxItOptions']").addClass("widthDD220");

	$("div[id$='editVioSelectBoxIt']").addClass("widthDD220");
	$("div[id$='editVioSelectBoxItOptions']").addClass("widthDD220");
	$("ul[id$='editVioDescSelectBoxItOptions']").addClass("widthDD220");
	$("span[id$='accVioDescSelectBoxItText']").addClass("widthDD190");

	$("select[id$='accVioState']").addClass("widthDD60");
	$("div[id$='accVioStateSelectBoxIt']").addClass("widthDD60");
	$("div[id$='accVioStateSelectBoxItOptions']").addClass("widthDD60");
	$("ul[id$='accVioStateSelectBoxItOptions']").addClass("widthDD60");
}

function changedAccVioDisp() {
	var updatedId = $('.editingrow').prop('id');
	var driverId = $('#' + updatedId + ' option:selected').val();
	var driverName = $('#' + updatedId + '_assignedDriver option:selected').text();
	var accVioType = $('#' + updatedId + '_accVioType option:selected').val();
}

// ok write this generic function to modularize the operation
function buildRows(trClone, accVioList, accVioIndex, isExisting, whatType) {}

//window.onload = initialFormLoadProcessing;
var errorMessages;
function initialFormLoadProcessing() {
	// Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

var addDeleteCallback = function(row, addIt){}

function validatePage() {
	/**
	 * // clear any existing error clearPageError('.pageError');
	 */
	var errorCount = validateInputs();
	/**
	 * if (errorCount > 0) { errorMessageID = 'aiui.aiForm.editPage.all';
	 * showPageError('.pageError', errorMessageID); }
	 */
	return errorCount == 0;
}

/**
 * These dropdowns are not for NJ state
 * */
function removeExcludeReasons(){	
	$('.exclude_reason_class option[value=HTANRN]').remove();
	$('.exclude_reason_class option[value=COLWTAN]').remove();
	$('.exclude_reason_class option[value=DRVDCS]').remove();
	$('.exclude_reason_class option[value=CLRMRE]').remove();	
	$('.exclude_reason_class').trigger('chosen:updated');
}

/**
 * When ADD or CANCEL for a newly added manual entry is clicked, clear the old data.
 * */
function clearNewlyAddedRow(){		
	$('tr.selectDriverToAdd').find('td.select_assigned_driver span.disp_drv select').val('').prop('disabled',false).removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAdd').find('td.select_display_date  span.disp_drv input').val('').removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAdd').find('td.select_display_type   span.disp_drv select').val('').prop('disabled',false).removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAdd').find('td.select_display_desc select').val('').removeClass('inlineError').trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAddNext').find('td span.inlineErrorMsg').text('');
}

/**
 * Assigned driver vs Type combination
 * Can't have No Driver-Comp Claim for Acc, Vio types and vice versa.
 * */
function validateCompClaim(assignedDriverElem,accVioType){
	var assignedDrv = '';	
	if(assignedDriverElem==null || accVioType==null || accVioType==''){
		return true;
	}
	assignedDrv = assignedDriverElem.value;
	if(assignedDrv=='No Driver-Comp Clm' && accVioType.toLowerCase()!='comp clm'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidCombinationType');
		return false;
	}
	if(assignedDrv!='No Driver-Comp Clm' && accVioType.toLowerCase()=='comp clm'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidCombinationType');
		return false;
	}	
	validateField(assignedDriverElem, assignedDriverElem.id, '');
	return true;
}

/**
 *  Default exclude reasons as per FIELDS document
 * */
function defaultExcludeReason(assignedDriverElem, excludeReasonElem, driverId) {
	var assignedDrv = '';
	var excludeReason = '';
	var driverStatus = $('#driverStatusCd_' + driverId).val();
	if (assignedDriverElem == null) {
		return;
	}
	assignedDrv = assignedDriverElem.value;
	if (excludeReasonElem == null) {
		return;
	}
	//If Assigned Driver selected is Unknown Driver default to Unknown Driver (no in FIELDS document but implemented as per defect 40776)
	if (assignedDrv == 'Unknown Driver') {
		$(excludeReasonElem).val('UNKWN').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('UNKWN');
		$(excludeReasonElem).closest('td').find('span#id_disp input[type=hidden]').val('UNKWN');
	} 
	//If Assigned Driver selected is Deceased HH Member default to Deceased Family Member.
	else if (assignedDrv == 'Deceased HH Member') {
		$(excludeReasonElem).val('DCSDFM').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('DCSDFM');
		$(excludeReasonElem).closest('td').find('span#id_disp input[type=hidden]').val('DCSDFM');
	}
	//If Assigned Driver selected has a Driver Status of Away in Military then default Exclude reason to Currently away in active military service
	else if ($.isNumeric(assignedDrv) && driverStatus == 'N') {
		$(excludeReasonElem).val('MLTSVC').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('MLTSVC');
		$(excludeReasonElem).closest('td').find('span#id_disp input[type=hidden]').val('MLTSVC');
	}
}

/**
 * Edits for Exclude reason as per EDITS document
 * */
function validateExcludeReason(assignedDriverElem,excludeReasonElem,driverId,dataSource){
	var assignedDrv = '';
	var excludeReason = '';
	var driverStatus = $('#driverStatusCd_'+driverId).val();	
	if(dataSource==null || $.trim(dataSource.toLowerCase())!='clue'){
		return true;
	}	
	if(assignedDriverElem==null){
		return true;
	}
	assignedDrv = assignedDriverElem.value;
	if(excludeReasonElem!=null){
		excludeReason = excludeReasonElem.value;
	}	 
	/*If Source = Clue, and Exclude reason = Unknown Driver, 
	then Assigned driver must also be Unknown Driver.*/
	if(excludeReason=='UNKWN' && assignedDrv!='Unknown Driver'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason = Deceased HH Member, 
	then Assigned driver must also be Deceased family member.*/
	else if(excludeReason=='DCSDFM' && assignedDrv!='Deceased HH Member'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason =Child no longer in household,  
	then Assigned driver cannot be a Driver on the Driver Tab.*/  
	else if(excludeReason=='CHOWINS' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}
	/*If Source = Clue, and Exclude reason =Child-Has own insurance and No longer in Household,  
	then Assigned driver cannot be a Driver on the Driver Tab.*/  
	else if(excludeReason=='CHNOAC' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason = Currently away in active military,  
	then Assigned driver cannot be a Driver on the Driver Tab whose driver status is NOT = Driver away in military.*/  
	else if(excludeReason=='MLTSVC' && $.isNumeric(assignedDrv) && driverStatus!='' && driverStatus!='N'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason =Divorced Spouse-No longer in Household,  
	then Assigned driver cannot be a Driver Listed driver on the Driver tab.*/
	else if(excludeReason=='DIVSP' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}
	
	//Revese Edits - with respect to Assigned Driver
	/*If Source = Clue, and Exclude reason = Unknown Driver, 
	then Assigned driver must also be Unknown Driver.*/
	if(excludeReason!='' && excludeReason!='UNKWN' && assignedDrv=='Unknown Driver'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason = Deceased HH Member, 
	then Assigned driver must also be Deceased family member.*/
	else if(excludeReason!='' && excludeReason!='DCSDFM' && assignedDrv=='Deceased HH Member'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	/*If Source = Clue, and Exclude reason = Currently away in active military,  
	then Assigned driver cannot be a Driver on the Driver Tab whose driver status is NOT = Driver away in military.*/  
	else if(excludeReason!='' && excludeReason!='MLTSVC' && $.isNumeric(assignedDrv) && driverStatus=='N'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}	
	validateField(assignedDriverElem, assignedDriverElem.id, '');
	return true;
}

/**
 * Check the number of elements in this component.
 * */
function lengthCheck(field){
	if(field.length!=null){
		if(field.length>0){return true;}
		else{return false;}
	}
	else{return true;}
}

/**
 * First check if the element is read-only ,i.e.,third party returned data. If so, just pass blank
 * and it will not be validated.
 * 
 * If not, pass it for validation where required fields and other edits will be checked. 
 * */
function validateAllDataBeforeSaving(prevTr,updatedId,updatedIdWithoutOther,oldId,accOrVio,driverId){	
	var selectEdDtElem = '';
	var selectedAccVioTypeElem  = '';
	var selectedStateElem = '';
	var selectedAccVioDescElem = $(prevTr).find('td.display_type span.disp_drv select');
	var selectedAssignedDriverElem = '';
	var accVioSource = $(prevTr).find('td.display_datasource span.id_disp_dd input').val();
	var selectedAccVioExcludeReason =  $(prevTr).find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect');
	
	if(accVioSource!=null && accVioSource.toLowerCase()=='client'){		
		selectEdDtElem = $(prevTr).find('td.display_date span.disp_drv input');
		selectedAccVioTypeElem = $(prevTr).find('td.display_type span.disp_drv select');
		selectedStateElem = $(prevTr).find('td.display_state span.disp_drv select');
		selectedAccVioDescElem = $(prevTr).find('td.display_desc span.disp_drv select');
	}
	if(!checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem)){
		return false;
	}
	else if(!validateCompClaim(selectedAssignedDriverElem[0],accOrVio)){
		return false;
	}
	else if(!validateExcludeReason(selectedAssignedDriverElem[0],selectedAccVioExcludeReason[0],driverId,accVioSource)){
		return false;
	}
	return true;
}

/**  
 *  This function will be called by ADD and SAVE operations. 
 *  It will validate whether all required fields are entered or not.
 **/
function checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem){
	var assignedDriver;
	var dateField;
	var accVioType;
	var accVioDesc
	var state;	
	if(selectedAccVioTypeElem[0]!=null){
		accVioType = selectedAccVioTypeElem[0];
	}else{
		accVioType = selectedAccVioTypeElem;
	}		
	if(selectEdDtElem[0]!=null){
		dateField = selectEdDtElem[0];
	}else{
		dateField = selectEdDtElem;
	}	
	if(selectedAssignedDriverElem[0]!=null){
		assignedDriver = selectedAssignedDriverElem[0];
	}else{
		assignedDriver = selectedAssignedDriverElem;
	}	
	if(selectedAccVioDescElem[0]!=null){
		accVioDesc = selectedAccVioDescElem[0];
	}else{
		accVioDesc = selectedAccVioDescElem;
	}	
	if(selectedStateElem[0]!=null){
		state = selectedStateElem[0];
	}else{
		state = selectedStateElem;
	}		
	var isValidationSuccessful=true;
	//All the below conditions need to be validated. Do not put if-else	
	//Future date edits are removed as per a change control
	if(dateField!=null && lengthCheck(dateField)){
		validateAccVioDateField(dateField);
		if(dateField.value=="" || isValidDateVal(dateField.value) == false
				//|| isFutureDate(dateField.value) == true
				){
			isValidationSuccessful = false;
		}
	}	
	if(accVioType!=null && lengthCheck(accVioType)){
		validateField(accVioType,accVioType.id,'required');
		if(accVioType.value=="" || accVioType.value=="Select"){
			isValidationSuccessful = false;
		}
	}	
	if(state!=null && lengthCheck(state) ){
		validateField(state,state.id,'required');
		if(state.value=="" || state.value=="Select"){
			isValidationSuccessful = false;
		}
	}	
	if(accVioDesc!=null && lengthCheck(accVioDesc)){
		validateField(accVioDesc,accVioDesc.id,'required');	
		if(accVioDesc.value=="" || accVioDesc.value=="Select"){
			isValidationSuccessful = false;
		}
	}	
	if(assignedDriver!=null && lengthCheck(assignedDriver)){
		validateField(assignedDriver,assignedDriver.id,'required');
		if(assignedDriver.value=="" || assignedDriver.value=="Select"){
			isValidationSuccessful = false;
		}
	}
	
	return isValidationSuccessful;
}

function highlightRow(rowName) {
	$('#' + rowName).effect("highlight", {
		color : '#FF9C00'
	}, 3000);
}

function resetAddDefaultSelections() {
	$('#selected_assigned_driver_id').val("");
	$('#selected_assigned_driver_id').trigger('chosen:updated');
	$('#selectEdDt').val("");
	$('#selectEdType').val("");
	$('#selectEdType').trigger('chosen:updated');
	$('#select_manual_addicent_id').val("");
	$('#select_manual_addicent_id').trigger('chosen:updated');
	$('#select_manual_violation_id').val("");
	$('#select_manual_violation_id').trigger('chosen:updated');
	$('#select_state_addicent_vio_id').val("");
	$('#select_state_addicent_vio_id').trigger('chosen:updated');
}

function resetAddDefaultUnassignedSelections() {
	$('#unassigned_selected_driver_class').val("Select");
	$('#unassigned_selected_driver_class').trigger('chosen:updated');
}

function addSelectBoxItForAccViol(select) {	
	//Chosen: Migration
	 addChosen(select.attr("id"));	
}

function handleSubmit(e) {	
	//final check for valid date format's
	// clear fields that do not have valid formats	
	$("#accVioTabl > tbody > tr:visible > td.display_date > span.id_disp > input").each(function() {
		var strDate = $(this).val();
		 if (isValidDateVal(strDate) == false){
			 $(this).val('');
		 }
	});
}

/**
 * Check if any error row exists which is not either correted or cleared.
 * Users are not allowed to save or navigate away without this.
 * */
function isReadyToSubmit(){
	var workInProgress = false;
	$('.drvSepAccVio,.selectDriverToAdd').each(function(){
		if($(this).css('display')!='none'){
			workInProgress = true;
			return false;
		}
	});		
	return !workInProgress;
}

function refreshRateButton(){
	var originalPremAmt = $('#premAmt').val();
	var ratedIndicator =  $('#ratedInd').val();
	resetPremium(ratedIndicator,originalPremAmt);
}

function jumpToDifferentTab(nextTab){
	blockUser();
	document.aiForm.nextTab.value =nextTab;
	document.aiForm.submit();
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
    var newIframe = document.createElement('iframe');
    newIframe.width = '0';
    newIframe.height = '0';
    newIframe.src = 'about:blank';
    newIframe.id ='print-iframe';
    newIframe.name ='print-iframe-name';
    document.body.appendChild(newIframe);    
    newIframe.contentWindow.contents = content;
    newIframe.src = 'javascript:window["contents"]';    
    $("#print-iframe").load( 
         function() {
             window.frames['print-iframe-name'].focus();
             window.frames['print-iframe-name'].print();
             $("#print-iframe").remove();
             $('#messageDialog').modal('show');
         }
    );
}