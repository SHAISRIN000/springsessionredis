$(function() {
	var rowId_delete = '';
	var primaryDriverId = $('#primaryDriverId').val();
	var accVioCount = parseInt($('#accVioList_Count').val());
	errorMessages = jQuery.parseJSON($("#errorMessages").val());
	checkIfIncidentsExist();
	hideTemplateRows();
	updateDropdowns();

	//NAF FR
	var policyEffDt = Date.parse($("#policyEffDt").val());
	var nafEffDate = Date.parse($("#nafEffDate").val());
	if((policyEffDt >=nafEffDate )){
		$('#accVioNAFTable').removeClass('hidden');
	}

	if( $('#containsExcluded').val() != 'true'){
		$('#viewRemovedAccidentsAndViolationsLink').hide();
		$('#pipeSeparatorSpan').hide();
	}else{
		$('#viewRemovedAccidentsAndViolationsLink').show();
		$('#pipeSeparatorSpan').show();
	}
	
	$('#logo').parent().attr('tabIndex', 6);
	
	/* Leave space for fixed Complete "so & so" application message */
	if($('#completeApplicationAlert').length == 1) {
		$('#mainContent').css('padding-top', '25px');
	}	
	
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
	 
	//hide renewal violations
	if(isEndorsement()) {
		hideRenewalViolationsForEndorsement();
	}
	
	$('table#accVioTabl tr.display_mode').each(function() {	
		$(this).find('select.exclude_reason_class').val($(this).find('#excludeReasonHidden').val())
			.trigger('chosen:updated');
		var excludeRowValue = $(this).find('#excludeRowIndicator').val();
		var accVioSource =$(this).find('td.display_datasource span.id_disp_dd input');
		var hideRowValue = $(this).find('td.excludeReasonAccVio span.hideViolationInd #hideViolationHiddenInd').val();
		//Is this required?
		if(accVioSource[0]!=null && accVioSource[0].value=='Client' 
			&& ($(this).find('td.display_desc span:not(:hidden) select.descriptionAccVio').val()=='' 
				|| $(this).find('td.display_desc span:not(:hidden) select.descriptionAccVio').val()=='Select')){
			$(this).find('td.display_desc span:not(:hidden) select.descriptionAccVio')
				.val($(this).find('td.display_desc span.id_desc_text input').val()).trigger('chosen:updated');
		}
		if (excludeRowValue == 'Yes' && accVioSource[0]!=null && accVioSource[0].value=='Client') {
			$(this).closest('tr').find("td.display_state span.ex_re input[type='hidden']").setValue("DELETE");
			$(this).hide();
		} else if(excludeRowValue == 'Yes' && ($(this).find('#excludeReasonHidden').val()=='Driver Deleted'
													|| $(this).find('#excludeReasonHidden').val()=='Program Removed Duplicate')){
			$(this).hide();
		}
		if(hideRowValue == 'true'){
			$(this).hide();
		}
		//55213
		var descId = $(this).find('td.display_desc span.id_disp_id input').val();
		if(isEndorsement() && accVioSource[0]!=null && accVioSource[0].value=='Client' && descId != '' && (descId == 'UDR2' || descId == 'UDR3')){
			$(this).hide();
		}
	});
	
	$('table#removeAccVioTabl tr').each(function() {
		var excludeRowValue = $(this).find('#excludeRowIndicator').val();
		if ((excludeRowValue == 'No' || excludeRowValue == '' || excludeRowValue == null)
				&& $(this).attr('class') == 'display_mode') {
			$(this).hide();
		}
	});

	$(document).on("click","span.addBackDriver",function(e) {
		var acc_rowId_All = $(this).attr('id');
		var acc_rowId = acc_rowId_All.substring(acc_rowId_All.indexOf("_") + 1, acc_rowId_All.length);
		var acc_rowId_Mod =  acc_rowId.replace('acc_','').replace('vio_','');
		var parentTrId = $(this).closest('tr').attr('id');
		var parentTrIdArray = $(this).closest('tr').attr('id').split('_');
		var closestTr = $(this).closest('tr');
		var driverIdEndIndex =acc_rowId_Mod.indexOf('_');
		var driverId = acc_rowId_Mod.substr(0,driverIdEndIndex);
		var foundRow = false;
		var typeOfIncident = '';
		var isUnassigned = false;
		var rowToShow = "driver_row_" + driverId;		
		$(closestTr).remove();
		if(parentTrId.indexOf('other') != -1 || parentTrId.indexOf('unassigned') != -1){
			typeOfIncident = parentTrIdArray[1] + '_' + parentTrIdArray[2];
		}else{
			typeOfIncident = parentTrIdArray[1];
		}
		if(parentTrId.indexOf('unassigned') != -1){
			isUnassigned = true;
			$('.unassignedDriverAccVio').show();
		}
		$('table#accVioTabl tr.display_mode').each(function() {
			if (!foundRow && $(this).attr('id') == typeOfIncident + '_' + acc_rowId) {
				$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').setValue('No');
				$(this).find("td.display_state span.ex_re input[type='hidden']").setValue('');
				if(typeOfIncident!='unassigned_vio'){
					$(this).find('input#excludeReasonHidden').setValue('None');
				}
				if(isUnassigned){
					$(this).find('td.assigned_driver span.disp_drv select').val('').trigger('chosen:updated');
				}
				$(this).show();
				foundRow = true;
			}
		});
		$('table#accVioTabl tr#'+acc_rowId).each(function() {
			$(this).find('td.exclude_reason span.exclude_dd_reason').setValue('No');
			$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').setValue('No');
			$(this).find("td.display_state span.ex_re input[type='hidden']").setValue('');
			if(typeOfIncident!='unassigned_vio'){
				$(this).find('input#excludeReasonHidden').setValue('None');
			}
			if(isUnassigned){
				$(this).find('td.assigned_driver span.disp_drv select').val('').trigger('chosen:updated');
			}
			if($(closestTr).find('td.exclude_reason span.ex_re2 input').val()=='New'){
				$(this).find('td.display_state span.ex_re input').val('Add');
			}
			$(this).show();
			$(this).removeClass('blueRow');
			$(this).removeClass('removed');
			$(this).removeClass('editingRow');
			$(this).addClass('display_mode');
		});
		emptyOutViewRemovedModalIfApplicable();
		$('#' + rowToShow).show();
		refreshRateButton();
	});
	
	$(".tabNextButtonAccident").click(function() {
		nextTab(document.aiForm.currentTab.value, this.id);
	});
	
	$(".accVioErrorModal").click(function(){
		$('.modal').hide();	
		closeAccVioErrorModal();
	});	
	
	$(".closeViewDeletedModal").click(function(){
		$('div#viewDeletedAccVio').hide();
	});	

	$(".clsAccVioDate").datepicker({
		showOn : "button",
		buttonImage : "/aiui/resources/images/cal_icon.png",
		buttonImageOnly : true,
		buttonText : 'Open calendar',
		dateFormat : 'mm/dd/yy',
		showButtonPanel : true,
		onSelect: function () {
			$(this).closest('td').find('span.id_disp input[type=hidden]').val($(this).val());
		}
	});

	$("input:radio[name=hasAccVio]").click(function() {
		if ($(this).val() == 'Yes') {
			$('#accVioAddTable').show();
			$('#addAccVioDisable').hide();
			$('#manualViewDescTableId').show();
			$('#reportStatusDetailsSpan').show();
			$('#reportsTableId').show();
			$('#reportsMessageTableId').show();
			$('#addAccVio').show();
			$('input[id=anyAccVioLast5YrsHidden]').val('Yes');
		} else if($(this).val() == 'No') {
			$('#accVioAddTable').hide();
			$('#addAccVioDisable').hide();
			$('#manualView').hide();
			$('#manualViewDescTableId').hide();
			$('#reportStatusDetailsSpan').hide();
			$('#reportsTableId').hide();
			$('#reportsMessageTableId').hide();
			$('input[id=anyAccVioLast5YrsHidden]').val('No');
		}
	});

	$('select.typeAccVio').change(function() {
		var closestTr = $(this).closest('tr');
		$(closestTr).find('span.disp_drv_vio').hide();
		$(closestTr).find('span.disp_drv_acc').hide();
		$(closestTr).find('span.disp_drv_com').hide();
		var assignedDriverBox = $(closestTr).find('td.assignedDriverAccVio span.disp_drv select');
		var driverSelected = $(assignedDriverBox).val();		
		var descType='disp_drv_acc';
		if(assignedDriverBox[0]!=null && assignedDriverBox[0].value!=''){
			validateDriverTypeCombination(assignedDriverBox[0],$(this).val());
		}
		if(!isValueBlankOrSelect($(this)) && !$(closestTr).hasClass('selectDriverToAdd')){
			$(this).prop('disabled',true).trigger('chosen:updated');
		}
		if ($(this).val() == 'Accident') {
			if(driverSelected == 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('').prop('disabled',false).trigger('chosen:updated');
			}
		} else if ($(this).val() == 'Violation') {
			descType='disp_drv_vio';
			if(driverSelected == 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('').prop('disabled',false).trigger('chosen:updated');
			}
		} else if ($(this).val() == 'COMPCLAIM') {
			descType='disp_drv_com';
			$(this).prop('disabled',true).trigger('chosen:updated');
			if(driverSelected != 'No Driver-Comp Clm'){
				$(assignedDriverBox).val('No Driver-Comp Clm').prop('disabled',true).trigger('chosen:updated');
				$(assignedDriverBox).prop('disabled',true).trigger('chosen:updated');	
			}
			if($(closestTr).hasClass('selectDriverToAdd')){
				$('tr.selectDriverToAddNext').find('td#selectDriverToAdd_selected_assigned_driver_id_Error_Col span.inlineErrorMsg').text('');
				$('tr.selectDriverToAddNext').find('td#selectDriverToAdd_selectEdType_Error_Col span.inlineErrorMsg').text('');
			}
			$(assignedDriverBox).removeClass('inlineError').trigger('chosen:styleUpdated');
			$(this).removeClass('inlineError').trigger('chosen:styleUpdated');
		}
		var selectId = $(closestTr).find('td.display_desc span.'+descType+' select.descriptionAccVio').attr("id");
		addChosenForAccViol($('#' + selectId));
		$(closestTr).find('span.'+descType).show();
	});

	$(document).on("change","#edType",function() {
			type = $(this).val();
			var closestTr = $(this).closest('tr');
			var updatingId = $(closestTr).prop('id');
			var ddId = updatingId + '_accVioDesc';
			if (type == 'Accident') {
				$(closestTr).find("td.display_desc span.disp_drv")
					.replaceWith($('tr.edit_mode').find('td.edit_desc_acc').html());
				$(closestTr).find("td.display_desc span.disp_drv select").prop('id', ddId);
				$(closestTr).find('div[id$="editAcc_chosen"]').remove();
				addChosenForAccViol($('#' + ddId));
				$('#' + ddId).trigger('chosen:updated');
			} else if (type == 'COMPCLAIM') {
				$(closestTr).find("td.display_desc span.disp_drv")
					.replaceWith($('tr.edit_mode').find('td.edit_desc_com').html());
				$(closestTr).find("td.display_desc span.disp_drv select").prop('id', ddId);
				$(closestTr).find('div[id$="editCom_chosen"]').remove();
				addChosenForAccViol($('#' + ddId));
				$('#' + ddId).trigger('chosen:updated');
			} else if (type == 'Violation') {
				$(closestTr).find("td.display_desc span.disp_drv")
					.replaceWith($('tr.edit_mode').find('td.edit_desc_vio').html());
				$(closestTr).find("td.display_desc span.disp_drv select").prop('id', ddId);
				$(closestTr).find('div[id$="editVio_chosen"]').remove();
				addChosenForAccViol($('#' + ddId));
				$('#' + ddId).trigger('chosen:updated');
			}
	});

	// adding accident/violation for user
	$(document).on("click", "#addAccVio", function() {
		$('#manualView').show();
		$("#accVioTabl").show();
		$('tr.selectDriverToAdd').toggle();
		$('tr.selectDriverToAddNext').show();		
		$('#select_state_addicent_vio_id').val($('#riskState').val());
		$('#select_state_addicent_vio_id').trigger('chosen:updated');		
		$('#addAccVio').hide();
		$('#addAccVioDisable').show();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
	});

	$(document).on("click",".addSelectedUnassigned",function(e){
		//Get the required details to be added entered in Add Accident/Violation button
		var containerTr = $(this).closest('tr');
		var unassignedDriverId = $(containerTr).attr("id").replace('_Error','');
		var relevantTr = $('#'+unassignedDriverId);
		var driverId = $('#'+unassignedDriverId+'_assignedDriver').val();
		var dataSource = $(relevantTr).find('td.display_datasource span.id_disp_dd input').val();
		var accVioType = $.trim($(relevantTr).find('td.display_type span.disp_drv').text());
		//Validate unassigned driver before adding    
		validateField($('#'+unassignedDriverId+'_assignedDriver')[0],$('#'+unassignedDriverId+'_assignedDriver')[0].id,'required');
		if(driverId=="Select" || driverId==""){
			driverId="";
			return false;
		} else if(!validateDriverTypeCombination($('#'+unassignedDriverId+'_assignedDriver')[0],accVioType)){
			return false;
		} else if(!validateExcludeReason($(this).closest('tr').prev(),driverId)){
			return false;
		}
		var idArray = unassignedDriverId.split('_');
		var accVioIndex = "";
		var accVioListIndex = "";
		if(idArray != null){
			accVioIndex = idArray[idArray.length-1];
			accVioListIndex = idArray[idArray.length-2];
		}
		var selectEdDt = $.trim($(relevantTr).find('td.display_date span.disp_drv').text());
		var accVioExcludeReason = $.trim($($('#'+unassignedDriverId+'_accVioExcludeReason')[0]).val());
		var srchR = '';
		var accVioDesc = '';
		var accidentId = $(relevantTr).find("td.display_desc span.acc_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accVioIndex +".accidentId']").val();
		var accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accVioIndex +".accidentDescId']").val();
		var otherCategory = false;
		var selectedValue = driverId;
		var typeString = "";
		var selectedSource = $.trim($(relevantTr).find('td.display_datasource span.disp_dd').text());
		var selectedState =  $.trim($(relevantTr).find('td.display_state span.disp_drv').text());
		var driverOnReport = $(relevantTr).find("td.assigned_driver span.disp_drv span.driverOnReportSpan input").val();
		var isThirdPartyRecord = true; 
		
		if(dataSource!=null && dataSource.toLowerCase()!='clue' && dataSource.toLowerCase()!='rmv'){
			isThirdPartyRecord = false; 
			accVioType = $(relevantTr).find('td.display_type span.disp_drv select').val();
			selectEdDt = $(relevantTr).find('td.display_date span.disp_drv input').val();
			selectedState = $(relevantTr).find('td.display_state span.disp_drv select').val();
			driverOnReport = $(relevantTr).find("td.assigned_driver span.disp_drv span.driverOnReportSpan input").val();
			if(!validateAllDataBeforeSaving($(this).closest('tr').prev(),accVioType,driverId)){
				return false;
			}
		}
		accVioCount++; 
		var accVioDescIdTemp = $(relevantTr).find('td.display_desc span:not(:hidden) select').val();
		var accVioDescIdArray = '';
		if(accVioDescIdTemp!=null || accVioDescIdTemp!=undefined){
			accVioDescIdArray = accVioDescIdTemp.split('_');
			accVioId = accVioDescIdArray[0];
		}						
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
		clearRowErrors($(this).closest('tr'));
		if(accVioType=='Accident' || accVioType.toLowerCase()=='compclaim'){
			if(isOtherType(selectedValue) || accVioType.toLowerCase()=='compclaim'){
				otherCategory = true;
				driverId = primaryDriverId;
			}
			typeString = 'accidents';
			srchR = appendOtherToStringIfApplicable(otherCategory,'acc_'+driverId);
		} else{
			typeString = 'violations';
			srchR = 'vio_'+driverId;
			accidentId = $(relevantTr).find("td.display_desc span.vio_id input[id^='accidentViolationList" +accVioListIndex + ".violations"+ accVioIndex +".violationId']").val();
			accVioId = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".violations"+ accVioIndex +".violationDescId']").val();
		}
		accVioDesc = $(relevantTr).find('td.display_desc span.disp_drv').text();
		if(dataSource!=null && dataSource.toLowerCase()!='clue'){
			accVioDesc = $(relevantTr).find('td.display_desc span:not(:hidden) select').val();
		}
		if(accVioDesc==""){
			accVioDesc = $(relevantTr).find('td.display_desc span.id_desc_text input').val();
		}
		//display the driver ID row seperator it's always there
		if(otherCategory){ $("otherDiv").show(); }
		showDriverOrOtherRow(otherCategory,driverId);
		var srchOR = srchR.replace('other_','');		
		var trLastOccurence = $('tr[id^="'+srchOR+'"]').filter(":last");
		if(driverId == primaryDriverId){
			if($('tr[id^="other_'+srchOR+'"]:not([class="header_driver_row"])').length>0){
				trLastOccurence = $('tr[id^="other_'+srchOR+'"]').filter(":last");
			}
		}
		var idVal = trLastOccurence.attr('id');
		//  this driver has the accident/vio that agent is trying to add now get the row clone it and insert it back
		if(idVal!=null){
			var trFirstOccurence = $('tr[id^="'+srchOR+'"]').filter(":first");
			if(driverId == primaryDriverId){
				if($('tr[id^="other_'+srchOR+'"]').length>0){
					trFirstOccurence = $('tr[id^="other_'+srchOR+'"]').filter(":first");
				}
			}
			var ndxToPickup = 0;
			var lastOccuranceArray = trLastOccurence.attr('id').split('_');
			var firstOccuranceArray = trFirstOccurence.attr('id').split('_');			
			if(otherCategory || driverId == primaryDriverId){
				if(lastOccuranceArray!=null && firstOccuranceArray!=null 
						&& lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[4]>lastOccuranceArray[4]){
					ndxToPickup = firstOccuranceArray[4];
				}
			} else {
				if(lastOccuranceArray!=null && firstOccuranceArray!=null 
						&& lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[3]>lastOccuranceArray[3]){
					ndxToPickup = firstOccuranceArray[3];
				}
			}			
			var accVioLastOccIdArray = idVal.split('_');
			var accVioListIndex = '';
			var accIndex = 0;
			var trClone = isThirdPartyRecord?$('#empty_unassigned_acc_display_mode').clone():$('#empty_acc_display_mode').clone();
			var accVioTypePrefix = 'acc';
			
			if(accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim'){
				trClone = $('#empty_vio_display_mode').clone();
				accVioTypePrefix = 'vio';
			}

			//07/16/2014- 500 error production fixes 
			if(accVioLastOccIdArray[0]=='other'){				
				accVioListIndex = parseInt(accVioLastOccIdArray[3]);
				accIndex = parseInt(accVioLastOccIdArray[4]);					
			}else {
				accVioListIndex = parseInt(accVioLastOccIdArray[2]);
				accIndex = parseInt(accVioLastOccIdArray[3]);
			}					
			if(ndxToPickup!=null){
				accIndex = ndxToPickup;
			}
		    //do not replace this block. maxAccId is used later and is used differently (Retry 2) 
			//getMaxAccVioId(accVioType,driverId,driverIndexNum,currentAccVioIndex);
			var idArrayAcc = [];
			$("tr[id*="+accVioTypePrefix+"_" +driverId+'_'+accVioListIndex+'_' +"]").each( function() {
			       var splitIdArray = $(this).attr('id').split('_');
			       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
			});
			var maxAccId = (idArrayAcc.sort(function(a,b){return b-a;})[0]);
			if(parseInt(maxAccId) >= 0){
				accIndex = parseInt(maxAccId) + 1;
			}
			
		   var nextRowHeader = appendOtherToStringIfApplicable(otherCategory,accVioTypePrefix+'_'+driverId+'_'+accVioListIndex+'_'+accIndex);
		   if(maxAccId != 0 && !otherCategory && driverId != primaryDriverId){
			   var accidentIdDrvChange;
			   var accVioIdDrvChange;
			   if(accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim'){
				   accidentIdDrvChange = $(relevantTr).find("td.display_desc span.vio_id input[id^='accidentViolationList" +accVioListIndex + ".violations"+ accIndex +".violationId']").val();
				   accVioIdDrvChange = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".violations"+ accIndex +".violationDescId']").val();
			   } else{
				   accidentIdDrvChange = $(relevantTr).find("td.display_desc span.acc_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accIndex +".accidentId']").val();
				   accVioIdDrvChange = $(relevantTr).find("td.display_desc span.id_disp_id input[id^='accidentViolationList" +accVioListIndex + ".accidents"+ accIndex +".accidentDescId']").val();
			   }
			   //Fix for Defect 41329.
			   if(accidentIdDrvChange!=null){accidentId = accidentIdDrvChange;}
			   if(accVioIdDrvChange!=null){accVioId = accVioIdDrvChange;}
		   }
		   
		    //clone start...
		    //Added newly: Migrate7			   
		    cloneDataRowHelper(trClone , accVioType, otherCategory , accVioListIndex ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState, true , selectedSource , driverOnReport, accVioExcludeReason,accidentId);
			
			var driverNameRowHeaderFilter = getDriverRowFilter(otherCategory,driverId);
			var accTypePrefix = appendOtherToStringIfApplicable(otherCategory,accVioTypePrefix);
			
			$('tr[id^="'+driverNameRowHeaderFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
			$('td.newlyAdd').replaceWith(trClone.html());
			
			//COPY Data fucntion for unassigned should update the text field( no dropdowns should be shown)>
			copyDataToClonedRow(accVioType, nextRowHeader, otherCategory, selectedValue, driverId, selectEdDt, accVioDesc, selectedState, true, accVioExcludeReason, selectedSource);
			
			//Error Row
			var errorRowTemplate = cloneErrorRowHelper(accTypePrefix, driverId ,accVioListIndex , accIndex);
			var nextErrorRowId = accTypePrefix+'_Error_'+driverId+'_'+accVioListIndex+'_'+accIndex;
			$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
			$('td.newlyAdd').replaceWith(errorRowTemplate.html());

		}
		
		// Agent adding accident but the user does not have accident but has a violation and viceversa
		// Check for row of accident OR violation that driver has which agent is adding acc/vio against
		else {//if (idVal == null || idVal == undefined) {
			// alter the acc vio change
			if (accVioType == 'Accident' || accVioType.toLowerCase() == 'compclaim') {
				srchR = appendOtherToStringIfApplicable(otherCategory,'vio_'+driverId);
			}
			trLastOccurence = $('tr[id^="' + srchR + '"]').filter(":last");
			idVal = trLastOccurence.attr('id');
			tr = $('tr[id^="' + srchR + '"]').filter(":last");
			idVal = tr.attr('id');
			if (idVal != null) {
				// this driver has a accident or violation recorded
				var accVioLastOccIdArray = idVal.split('_');
				var accVioListIndex = parseInt(accVioLastOccIdArray[2]);
				if(accVioLastOccIdArray[0]=='other'){ accVioListIndex = parseInt(accVioLastOccIdArray[3]);}
				var trClone = isThirdPartyRecord?$('#empty_unassigned_'+(accVioType == 'Accident'?'acc':'com')+'_display_mode').clone():$('#empty_'+(accVioType == 'Accident'?'acc':'com')+'_display_mode').clone();			
				var accTypePrefix = appendOtherToStringIfApplicable(otherCategory,'acc');
				var accIndex = '';				
				if (accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim') {
					trClone = $('#empty_vio_display_mode').clone();
					accTypePrefix = 'vio';
				}
				accIndex = getMaxAccVioId(accTypePrefix=='vio'?'vio':'acc',driverId,accVioListIndex,0);
				var nextRowHeader = accTypePrefix+'_'+driverId+'_'+accVioListIndex+'_'+accIndex;
				// start
				//Added newly: Migrate8
				cloneDataRowHelper(trClone , accVioType, otherCategory , accVioListIndex ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState, true , selectedSource , driverOnReport , accVioExcludeReason,accidentId);
				
				var driverNameRowHeaderFilter = "driver_row_"+ driverId;
				$('tr[id^="' + driverNameRowHeaderFilter + '"]').after('<tr id="'+ nextRowHeader+ '" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				$('td.newlyAdd').replaceWith(trClone.html());
				
				//COPY Data function for unassigned should update the text field( no dropdowns should be shown)>
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory, selectedValue, driverId, selectEdDt, accVioDesc, selectedState, true, accVioExcludeReason, selectedSource);
				
				//Errow Row
				var errorRowTemplate = cloneErrorRowHelper(accTypePrefix, driverId ,accVioListIndex , accIndex);
				var nextErrorRowId = accTypePrefix+'_Error_'+driverId+'_'+accVioListIndex+'_'+accIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());				
			} else {
				var nextAccVioListNdx = parseInt($('#driverIndexNumber_'+driverId).val()); 
				var trClone = isThirdPartyRecord?$('#empty_unassigned_acc_display_mode').clone():$('#empty_acc_display_mode').clone();
				var driverNameRowHeaderFilter = getDriverRowFilter(otherCategory,driverId);
				var accTypePrefix = appendOtherToStringIfApplicable(otherCategory,'acc');
				if (accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim') {
					trClone = $('#empty_vio_display_mode').clone();
					accTypePrefix = 'vio';
				}
				accIndex = getMaxAccVioId(accTypePrefix=='vio'?'vio':'acc',driverId,nextAccVioListNdx,0);
				var nextRowHeader = accTypePrefix+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex;
				// start
				//Added newly: Migrate9 					
				cloneDataRowHelper(trClone , accVioType, otherCategory , nextAccVioListNdx ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState, true , selectedSource , driverOnReport , accVioExcludeReason,accidentId);
				
				$('tr[id^="' + driverNameRowHeaderFilter + '"]').after('<tr id="'+ nextRowHeader + '" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				$('td.newlyAdd').replaceWith(trClone.html());
				
				//COPY Data function for unassigned should update the text field( no dropdowns should be shown)>
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory, selectedValue, driverId, selectEdDt, accVioDesc, selectedState, true, accVioExcludeReason,selectedSource);
				
				//Errow Row
				var errorRowTemplate = cloneErrorRowHelper(accTypePrefix, driverId ,nextAccVioListNdx , accIndex);
				var nextErrorRowId = accTypePrefix+'_Error_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());
				
				nextAccVioListNdx = nextAccVioListNdx + 1;
				$('#accVioList_LastNdx').val(nextAccVioListNdx);
			}
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$(relevantTr).remove();
		$(containerTr).remove();
		if($("tr[id^='unassigned_acc_']").length <= 0){
			$("tr[id^='unassigned_driver_row_']").hide();
		}		
		//REFACTOR: 12
		enableRows(true);	
		
		//Set Tab Index for .tabOrder fields
		setTabIndex();
	});
	// Edit Error Messaging End
	
	// ########## Add new Driver Start###############//
	//Refactor Start: 2/28/2014: 4.04PM	
	$(document).on("click",".addSelected",function(e){		
		var selectEdDt = $('#selectEdDt').val();
		var selectedSource = 'Client';
		var selectedState =  $('.selected_populated_state_class option:selected').val();
		var selectEdDtElem = $('#selectEdDt');
		var selectedAccVioTypeElem = $('#selectEdType');
		var selectedAssignedDriverElem = $('.selected_driver_class');
		var selectedStateElem =  $('.selected_populated_state_class');
		var selectedAccVioDescElem;
		
		if(selectedAccVioTypeElem[0].value=='Violation'){
			selectedAccVioDescElem = $('.selected_populated_desc_class_violation');
		} else if(selectedAccVioTypeElem[0].value=='COMPCLAIM'){
			selectedAccVioDescElem = $('.selected_populated_desc_class_comp');
		} else {
			selectedAccVioDescElem = $('.selected_populated_desc_class_accident');	
		}
		 
		//Validate required fields before adding
		if(!checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem,selectedSource,'ADD')){
			return false;
		} 
		accVioCount++; 
		var otherCategory = false;		
		//TODO: Get driverId from the selected dropdown. The native dropdow has this value selected and we can pick the id from there.
		//Get the required details to be added entered in Add Accident/Violation button
		var driverId = $('.selected_driver_class option:selected').val();
		var driverIdArray = driverId.split('_');
		driverId =  driverIdArray[0];
		var assignedDriver = $('.selected_driver_class option:selected').val();
		var assignedDriverValueArray = assignedDriver.split("_");
		var selectedValue = (assignedDriverValueArray.size > 1)?assignedDriverValueArray[1]:assignedDriverValueArray[0];
		var accVioDescId = '';
		var accVioId = '';
		var accVioDesc = '';
		var typeString = 'accidents';
		var accPrefixString = 'acc';
		var accVioType = $('#selectEdType').val();
		if(accVioType.toLowerCase() == 'compclaim' || isOtherType(selectedValue)){
			otherCategory = true;
			driverId = primaryDriverId;
			typeString = 'accidents';
			accPrefixString = 'other_acc';
		}
		
		//TODO: Get the description from the dropdown and use switch case to the necessary work. ?
		var srchR = '';
		if(accVioType=='Accident'){
			accVioDescId = $('.selected_populated_desc_class_accident option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			accVioDesc = $('.selected_populated_desc_class_accident option:selected').text();
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			srchR = appendOtherToStringIfApplicable(otherCategory,'acc_'+driverId);
		} else if(accVioType.toLowerCase() == 'compclaim'){
			accVioDescId = $('.selected_populated_desc_class_comp option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			accVioDesc = $(this).closest('tr').prev().find('td.select_display_desc span.disp_drv_com select').find(":selected").text();
			if(accVioDesc!=undefined){
				accVioDesc = $.trim(accVioDesc);
			} 
			$.trim(accVioDesc.replaceAll('Select',''));
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			srchR = appendOtherToStringIfApplicable(otherCategory,'acc_'+driverId);
		} else if(accVioType=='Violation'){
			accVioDescId = $('.selected_populated_desc_class_violation option:selected').val();
			var accVioIdArray = accVioDescId.split('_');
			accVioId = accVioIdArray[0];
			accVioDesc = $('.selected_populated_desc_class_violation option:selected').text();
			accVioDesc = accVioDesc.replace(/^\s+|\s+$/g,'');
			srchR = appendOtherToStringIfApplicable(otherCategory,'vio_'+driverId);
		}
		$('tr.selectDriverToAdd').toggle();
		$('tr.selectDriverToAddNext').hide();
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
        
		//display the driver ID row seperator it's always there
		if(otherCategory){ $("otherDiv").show(); } 
		showDriverOrOtherRow(otherCategory,driverId);
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
			var trFirstOccurence = $('tr[id^="'+srchR+'"]').filter(":first");
			var ndxToPickup =null;
			if(trFirstOccurence.length <= 0){
				trFirstOccurence = $('tr[id^="other_'+srchR+'"]').filter(":first");
				otherOccursFirst = true;
			}
			var lastOccuranceArray = trLastOccurence.attr('id').split('_');
			var firstOccuranceArray = trFirstOccurence.attr('id').split('_');
			if(otherCategory || otherOccursFirst){
				if(lastOccuranceArray!=null && firstOccuranceArray!=null 
						&& lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[4]>lastOccuranceArray[4])				{
					ndxToPickup = firstOccuranceArray[4];
				}
			} else {
				if(lastOccuranceArray!=null && firstOccuranceArray!=null 
						&& lastOccuranceArray != firstOccuranceArray && firstOccuranceArray[3]>lastOccuranceArray[3]){
					ndxToPickup = firstOccuranceArray[3];
				}
			}
			var accVioArray = idVal.split('_');
			if(accVioType == 'Accident' || accVioType.toLowerCase() == 'compclaim'){
				var accIndex = 0;
				var accVioList = 0;
				var insertBefore = false;
				var insertAfter = false;
				var trToInsertNewRowId = '';
				var lengthOfTrArray = '';
				var index1 = '';
				var index2 = ''; 
				var prefixString = '';
				//Accident exists for Add 	
				if(otherCategory || otherOccursFirst){
					accVioList = parseInt(accVioArray[3]);
					accIndex = parseInt(accVioArray[4]);
				} else {
					if(accVioArray[0]=='other'){
						accVioList = parseInt(accVioArray[3]);
						accIndex = parseInt(accVioArray[4]);
					} else {
						accVioList = parseInt(accVioArray[2]);
						accIndex = parseInt(accVioArray[3]);	
					}
				}
				if(ndxToPickup!=null){
					accIndex = ndxToPickup;
				}
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
			   var trClone = $('#empty_'+(accVioType == 'Accident'?'acc':'com')+'_display_mode').clone();
			   accIndex = getMaxAccVioId('acc',driverId,accVioList,accIndex);
			   nextAcc = typeString + accIndex;
			   var nextRowHeader = appendOtherToStringIfApplicable(otherCategory,'acc_'+driverId+'_'+accVioList+'_'+accIndex);
			   var driverRowFilter = getDriverRowFilter(otherCategory,driverId);

			   //Added newly : Migrate3
			   cloneDataRowHelper(trClone , accVioType, otherCategory , accVioList ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState);
				
				if(insertBefore){
					$('#'+trToInsertNewRowId).before('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				} else if(insertAfter){
					$('#'+trToInsertNewRowId).after('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				} else {
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());	
				}
				
				//Update the actual Values.
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory , selectedValue , driverId , selectEdDt, accVioDescId , selectedState);
				
				//Refactor above error row clone ...nextAddRowTemplate, driverId ,accVioList ,accIndex
				var errorRowTemplate = cloneErrorRowHelper(accPrefixString, driverId ,accVioList , accIndex);
				var nextErrorRowId = accPrefixString+'_Error_'+driverId+'_'+accVioList+'_'+accIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());
			} else if(accVioType == 'Violation'){
				var trClone = $('#empty_vio_display_mode').clone();
				var accVioList = parseInt(accVioArray[2]);
				var vioIndex = parseInt(accVioArray[3]);
				var insertBefore = false;
				var insertAfter = false;
				var trToInsertNewRowId = '';
				if(ndxToPickup!=null){
					vioIndex = ndxToPickup;
				}
				//Adding a new violation is inserting a blank violation because of indices
				vioIndex = $('tr[id^="'+srchR+'"]').length;
				var lengthOfTrArray = $('tr[id^=vio_' + accVioArray[1] + '_' + accVioArray[2] + ']').length;
				$('tr[id^=vio_' + accVioArray[1] + '_' + accVioArray[2] + ']').each(function(index) {
					var dateStr = $(this).find('td.display_date span.id_disp input[id$=violationDt]').val();
					var date = Date.parse(dateStr);
					var currentDate = Date.parse(selectEdDt);
					if(currentDate > date){
						trToInsertNewRowId = $(this).attr("id");
						insertBefore = true;
						return false;
					} else if(index == lengthOfTrArray - 1){
						trToInsertNewRowId = $(this).attr("id");
						insertAfter = true;
						return false;
					}
				});
				var nextRowHeader ='vio_'+driverId+'_'+accVioList+'_'+vioIndex;
				   
				//Added newly : Migrate4
				typeString = 'violations';
				cloneDataRowHelper(trClone , accVioType, otherCategory , accVioList ,typeString ,driverId ,nextRowHeader ,vioIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState);
				
				var driverRowFilter = "driver_row_"+driverId;
				if(insertBefore){
					$('#'+trToInsertNewRowId).before('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				} else if(insertAfter) {
					$('#'+trToInsertNewRowId).after('<tr id="'+nextRowHeader+'" class="display_mode">' + trClone.html() + '</tr>');
				} else {
					$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
					$('td.newlyAdd').replaceWith(trClone.html());	
				}
				
				//Update the actual Values.
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory , selectedValue , driverId , selectEdDt, accVioDescId , selectedState);
				
				//Error Row Cloning.
				var errorRowTemplate = cloneErrorRowHelper('vio', driverId ,accVioList , vioIndex);
				var nextErrorRowId ='vio_Error_'+driverId+'_'+accVioList+'_'+vioIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());			
			}
		}
		
		//	Agent adding accident but the user does not have accident but has a violation and viceversa
		//	Check for row of accident OR violation that driver has which agent is adding acc/vio against
		else {
			if(accVioType == 'Accident' || accVioType.toLowerCase() == 'compclaim'){
				srchR = 'vio_'+driverId;		
			} else if(accVioType == 'Violation'){
				srchR = 'acc_'+driverId;		
			}
			srchR = appendOtherToStringIfApplicable(otherCategory,srchR);
			trLastOccurence = $('tr[id^="'+srchR+'"]').filter(":last");
			idVal = trLastOccurence.attr('id');
			tr = $('tr[id^="'+srchR+'"]').filter(":last");
			idVal = tr.attr('id');
			if(idVal !=null){
				//this driver has a accident or violation recorded
				var accVioArray = idVal.split('_');
				var accVioList = '0';
				var nextRowHeader ='';
				var trClone = $('#empty_'+(accVioType == 'Accident'?'acc':'com')+'_display_mode').clone();
				var driverRowFilter = getDriverRowFilter(otherCategory,driverId);
				var accVioTypePrefix = 'acc';
				if(otherCategory){
					accVioList = parseInt(accVioArray[3]);
				} else {
					accVioList = parseInt(accVioArray[2]);
				}
				if(accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim'){
					accVioTypePrefix = 'vio';
					trClone = $('#empty_vio_display_mode').clone();
					typeString = 'violations';
					accPrefixString = 'vio';
				}
				var accIndex = getMaxAccVioId(accVioTypePrefix,driverId,accVioList,0);
				nextRowHeader = appendOtherToStringIfApplicable(otherCategory,accVioTypePrefix+'_'+driverId+'_'+accVioList+'_'+accIndex);
				var nextRowHeaderIdArray = nextRowHeader.split("_");
				
				//CLONE: start
				//TODO: do we really need these many params? and also revisit why we need to clone the hidden row and then copy the values.
				//Added newly: Migrate1					
				cloneDataRowHelper(trClone , accVioType, otherCategory , accVioList ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState);
				var trIncLastOccurence = '';
				if(accVioType == 'Accident' || accVioType.toLowerCase() == 'compclaim'){
					var violationTrId = appendOtherToStringIfApplicable(otherCategory,"vio_" + nextRowHeaderIdArray[1]);
					trIncLastOccurence = $('tr[id^="'+violationTrId+'"]').filter(":last");
				} else if(accVioType == 'Violation'){
					var accidentTrId = '';
					if(otherCategory){
						accidentTrId = "other_acc_" + nextRowHeaderIdArray[2];
					} else{
						accidentTrId = "acc_" + nextRowHeaderIdArray[1];
					}
					trIncLastOccurence = $('tr[id^="'+accidentTrId+'"]').filter(":last");
				}
				if(trIncLastOccurence.length > 0){
					driverRowFilter = $(trIncLastOccurence).attr("id");
				}
				//TODO:Revisit: why replace of TD? we can add the trclone html insidde the TR			
				$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				$('td.newlyAdd').replaceWith(trClone.html());
				//Update the actual Values.
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory , selectedValue , driverId , selectEdDt, accVioDescId , selectedState);
				
				//Error Row
				var errorRowTemplate = cloneErrorRowHelper(accPrefixString, driverId ,accVioList , accIndex);
				var nextErrorRowId =accPrefixString+'_Error_'+driverId+'_'+accVioList+'_'+accIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());		
			} else {
				var nextAccVioListNdx = parseInt($('#driverIndexNumber_'+driverId).val());
				var driverRowFilter = getDriverRowFilter(otherCategory,driverId);
				var accVioTypePrefix = 'acc';
				var trClone = $('#empty_'+(accVioType == 'Accident'?'acc':'com')+'_display_mode').clone();
				if(accVioType != 'Accident' && accVioType.toLowerCase() != 'compclaim'){
					accVioTypePrefix = 'vio';
					trClone = $('#empty_vio_display_mode').clone();
					accPrefixString = 'vio';
					typeString = 'violations';
				} 				
				var accIndex = getMaxAccVioId(accVioTypePrefix,driverId,nextAccVioListNdx,0);
				var nextRowHeader = appendOtherToStringIfApplicable(otherCategory,accVioTypePrefix+'_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex);
				if(accPrefixString == 'vio'){
					var nextRowHeaderIdArray = nextRowHeader.split("_");
					var accidentTrId = "acc_" + nextRowHeaderIdArray[1];
					var trAccLastOccurence = $('tr[id^="'+accidentTrId+'"]').filter(":last");
					if(trAccLastOccurence.length > 0){
						driverRowFilter = $(trAccLastOccurence).attr("id");
					}
				}
				//Added newly: Migrate3
				cloneDataRowHelper(trClone , accVioType, otherCategory , nextAccVioListNdx ,typeString ,driverId ,nextRowHeader ,accIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc ,selectedState);
				
				$('tr[id^="'+driverRowFilter+'"]').after('<tr id="'+nextRowHeader+'" class="display_mode"><td class="newlyAdd">classsic</td></tr>');
				$('td.newlyAdd').replaceWith(trClone.html());
				
				//Update the actual Values.
				copyDataToClonedRow(accVioType, nextRowHeader, otherCategory , selectedValue , driverId , selectEdDt, accVioDescId , selectedState);

				//Refactor above error row clone ...nextAddRowTemplate, driverId ,accVioList ,accIndex
				var errorRowTemplate = cloneErrorRowHelper(accPrefixString, driverId ,nextAccVioListNdx , accIndex);
				var nextErrorRowId = accPrefixString+'_Error_'+driverId+'_'+nextAccVioListNdx+'_'+accIndex;
				$('tr[id^="'+nextRowHeader+'"]').after('<tr id="'+nextErrorRowId+'" class="drvSepAccVio" style="display:none;"><td class="newlyAdd">classis</td></tr>');
				$('td.newlyAdd').replaceWith(errorRowTemplate.html());
				showDriverOrOtherRow(otherCategory,driverId);
				//there is no violation/accident added for this user Add now all new ok..
				nextAccVioListNdx = nextAccVioListNdx+1;
				$('#accVioList_LastNdx').val(nextAccVioListNdx);
			}
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$('.tabNextButton').button("enable");
		
		setTabIndex();
		refreshRateButton();
	});

	$(document).on("click", ".cancelSelected", function(e) {
		$('tr.selectDriverToAdd').toggle();
		$('tr.selectDriverToAddNext').hide();
		clearNewlyAddedRow();
		$('#addAccVio').show();
		$('#addAccVioDisable').hide();
		if(accVioCount <= 0){ $("#accVioTabl").hide(); }
		$('.tabNextButton').button("enable");
		resetAddDefaultSelections();
	});

	// ########## Add new Driver End ###############//
	$("#removeAccVioRowYes").click(function() {
		if (rowId_delete != null && rowId_delete.length > 1) {
			var errRow;
			if(rowId_delete.indexOf('acc')!=-1){
				errRow = rowId_delete.replace('acc','acc_Error');
			} else {
				errRow = rowId_delete.replace('vio','vio_Error');
			}
			if(!isEndorsement()){
				$('#' + rowId_delete).find("td.display_state span.ex_re input[type='hidden']").setValue("DELETE");
			}
			$('#' + rowId_delete).css("display", "none");
			$('#' + rowId_delete + '_Error').css("display", "none");
			$('#' + errRow).css("display", "none");
			$('#' + rowId_delete).removeClass('display_mode');
			$('#' + rowId_delete).addClass('removed');
			accVioCount--;
			//03/10/2015 Removed more helper code for below
			//04/25/2014 Commented this for a reason - Let driver header display so that ADD BACK inserts incident in correct place.
			if($('tr[id^=unassigned_][class="display_mode"]:not(:hidden)').length==0){
				$('.unassignedDriverAccVio').hide();
			}
		}
		$('#accVioTabl tr#'+rowId_delete).each(function() {
			$(this).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').setValue('Yes');
			if(isEndorsement()){
				$(this).find('td.exclude_reason span.id_disp input[type=hidden]').setValue('Agent Removed');
			}
		});
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
		$("#myModal").hide();
		$(".modal-backdrop").hide();
		$('#viewRemovedAccidentsAndViolationsLink').show();
		$('#pipeSeparatorSpan').show();
		$('#containsExcluded').setValue(true);
		
		//04/25/2014 Modified View-Removed-Duplicates to use javascript instead of loading whole page 
		addIncidentToRemovedList($('#' + rowId_delete));
		enableRows(true);
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
			$('div#myModal').modal().position({
				my : 'center top',
				at : 'center bottom',
				of : 'div#fixedPageHeader'
			});
		}
		$('#addAccVioDisable').hide();
		$('#addAccVio').show();
	});

	$(document).on("click","#accVioTabl tr.display_mode>td",function(e){
		if($('#readOnlyMode').val()=='Yes'){
			return;
		}
		var addedInEndtInd = $(this).parent('tr').find('span.addedInEndtInd input[type=hidden]').val();
		var unassignedInEndr = $(this).parent('tr').attr('id');
		unassignedInEndr = unassignedInEndr!=null?unassignedInEndr.indexOf('unassigned')!=-1:false;
		if($('#newBusinessMode').val() || addedInEndtInd == 'Yes' || addedInEndtInd=='true' || ($('#endorsementMode').val() && unassignedInEndr)){
			var rowStatus =  $(this).parent('tr').prop('disabled');
			rowId_delete = $(this).parent('tr').attr('id');			
			if(deleteDriverClicked){
				deleteDriverClicked = false;
			} else {
				if(rowStatus == undefined || !rowStatus){
					var rowId_delNew = "";
					var rowId_delNew2 = "";
					var dataSource=$(this).closest('tr').find('td.display_datasource  span.disp_dd').text();
					//Fix for 53866
					var dispState=$(this).closest('tr').find('td.display_state  span.disp_drv').text();
					if(dataSource!=null && dispState!=null && $.trim(dataSource) == 'RMV' && $.trim(dispState) == 'MA'){
						return;
					}
					if(rowId_delete.lastIndexOf('other_')!=-1){
						rowId_delNew = rowId_delete.replace('other_','other_excludeDriver_'); 
						rowId_delNew2 = rowId_delete.replace('other_','deleteDriver_');
					} else {
						rowId_delNew = 'excludeDriver_'+rowId_delete; 
						rowId_delNew2 = 'deleteDriver_'+rowId_delete;
					}					
					//hide all delete links
					if(rowId_delete.indexOf('unassigned') == -1){
						enableExcludeReasons(false,rowId_delNew,rowId_delNew2);
					}
					if(dataSource!=null && $.trim(dataSource)=='Client'){
						$(this).closest('tr').find('span.exclude_dd_reason').prop('disabled',true);
					}					
					$('#addAccVioDisable').show();
					$('#addAccVio').hide();					
					$('.tabNextButton').button("disable");					
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
					disp_desc_selected_name = $(this).parent('tr').find("td.display_desc span.id_desc_text input[type='hidden']").getValue();
					disp_acc_vio_date_name = $(this).parent('tr').find("td.display_date span.disp_drv").text();
					disp_acc_vio_date = $(this).parent('tr').find("td.display_date span.id_disp input[type='hidden']").getValue();
					disp_state_selected = $(this).parent('tr').find("td.display_state span.id_disp_id input[type='hidden']").getValue();
					disp_state_selected_name = $(this).parent('tr').find("td.display_state span.disp_drv").text();
					disp_data_source_cd = $(this).parent('tr').find("td.display_datasource span.disp_dd").text();
					disp_exclude_reason = $(this).parent('tr').find("td.exclude_reason span.exclude_dd_reason select.excludeReasonAccVioSelect option:selected").val();
					
					$(".clsAccVioDate").datepicker({
						buttonImage: "/aiui/resources/images/calendar.png",
						dateFormat:'mm/dd/yy',showButtonPanel : true
					});
					$(this).parent('tr').removeClass("display_mode");
					$(this).parent('tr').addClass('editingrow');
					updatedId = $('.editingrow').prop('id');
					$('#'+updatedId+'_accVioType').prop('id','edType');
					//REFACTOR 13:					
					enableRows(false);					
				}
			}
		}
	});

	// Keep Save/cancel in next row avoid manipulating dom
	$(document).on("click",".accVioSave_New",function(e) {
			var ButtonId = $(this).prop("id");
			var arrElm = ButtonId.split("*");
			var row_ID = arrElm[1];
			var rower_id = $(this).parents("tr").first().prop("id");
			var rowIdArray = row_ID.split("_");
			var originalDriverId = (row_ID.indexOf('other') >= 0)?rowIdArray[2]:rowIdArray[1]; 						
			var updatedId = row_ID;
			var driverId = $('#' + updatedId + ' option:selected').val();
			var otherCategory = false;
			var driverChanged = false;
			var newTrId = '';
			var typeString = '';
			var typeAccVio = '';
			var otherString = '';
			var accVioDt = $('#' + updatedId + '_accVioDt').val();
			var accOrVio = $('#edType').val();
			var updatedIdArray = updatedId.split("_");
			var oldId = updatedId;
			var primaryDriverChanging = (originalDriverId == primaryDriverId)?true:false;
			if(driverId != originalDriverId && (originalDriverId != primaryDriverId || primaryDriverChanging)){
				driverChanged = true;
			}
			var otherSource = $('tr[id^='+updatedId+']').find('td.display_datasource span.id_disp_dd input[type=hidden]');
			//Driver will be disabled for these data sources. Get the driver ID from the disabled field or empty it if not available.
			if(otherSource[0]!=null 
					&& (otherSource[0].value=='ECP' || otherSource[0].value=='DHI' || otherSource[0].value=='MVR' 
						|| otherSource[0].value=='VIOL' || otherSource[0].value=='UDR'  || otherSource[0].value=='RMV')){
				var driverDisabled=$(this).parents("tr").prev().find('td.assigned_driver span.id_disp input[type=hidden]');
				if(driverDisabled[0]!=null && driverDisabled[0].value!=null){
					driverId=driverDisabled[0].value;
				} else{
					driverId='';
				}
			}
			if(driverChanged && isOtherType(driverId)){
				otherCategory = true;
				selectedValue = driverId;
				driverId = primaryDriverId;
			}
			if(accOrVio == 'Accident' && updatedId.indexOf("vio_") >= 0){
				updatedId = "acc_" + updatedIdArray[1] + "_" + updatedIdArray[2] + "_" + updatedIdArray[3]; 
			} else if(accOrVio == 'Violation' && updatedId.indexOf("acc_") >= 0){
				updatedId = "vio_" +  + updatedIdArray[1] + "_" + updatedIdArray[2] + "_" + updatedIdArray[3];
			}
			var accVioDesc = $('#' + updatedId + '_accVioDesc option:selected').text();
			var accVioDescIdTemp = $('#' + updatedId + '_accVioDesc option:selected').val();
			var accVioDescIdArray = '';
			var accVioDescId = '';
			var accVioDescTempNew =  $(this).closest('tr').prev().find('td.display_desc span').not(':hidden').find('select').val();
			var accVioDescNew = '';
			var accVioDescIdNew = '';
			var accVioState = $('#' + oldId+ '_accVioState option:selected').text();
			var accVioStateId = $('#' + oldId+ '_accVioState option:selected').val();
			var accVioSource = $('tr[id^='+row_ID+']').find('td.display_datasource span.id_disp_dd input[type=hidden]').val();
			var accVioExRe = $('tr[id^='+row_ID+']').find('td.exclude_reason span.id_disp input[type=hidden]').val();
			var updatedIdWithoutOther = oldId.replace('other_','');
			var accVioTypeLabelElem = $('#' + oldId).find('td.typeAccVio span.id_disp input');
			var origDriverType = $(this).closest('tr').prev().find('td.assigned_driver span.id_drv_type input').val();
			var newDriverType = $(this).closest('tr').prev().find('td.assigned_driver span.id_drv_type2 input').val();
			var primaryDriverChangedToOtherOrViceVersa = false;
					
			if(accVioDescIdTemp!=null || accVioDescIdTemp!=undefined){
				accVioDescIdArray = accVioDescIdTemp.split('_');
				accVioDescId = accVioDescIdArray[0];
			}						
			if(accVioDescTempNew!=null){
				accVioDescIdNew = accVioDescTempNew.split('_')[0];
				accVioDescNew = accVioDescTempNew.split('_')[1];
			}
			if((accOrVio == null || accOrVio=='') 
							&& $(accVioTypeLabelElem)!=null && $(accVioTypeLabelElem).val()!=""){
				accOrVio = $(accVioTypeLabelElem).val();
			}
			if(accOrVio!=null && (accOrVio.toLowerCase() == 'compclaim' || isOtherType(driverId))){
				driverId = primaryDriverId;
			}		
			origDriverType = (origDriverType==null || origDriverType=='')?'A':origDriverType;
			newDriverType = (newDriverType==null || newDriverType=='')?'A':newDriverType;
			if(primaryDriverChanging && (origDriverType!=newDriverType)){
				primaryDriverChangedToOtherOrViceVersa = true;
			}
					
			//Validate required fields before saving						
			if(!validateAllDataBeforeSaving($(this).closest('tr').prev(),accOrVio,driverId)){
				return false;
			}
			$('#' + rower_id).hide();
			$('#' + row_ID).removeClass("blueRow");
			clearRowErrors($(this).closest('tr'));
			
			if(driverId != originalDriverId || otherCategory || primaryDriverChangedToOtherOrViceVersa){
				var srchIdPrefix;
				var trToInsertNewRowId = '';
				if(otherCategory){
					otherString = 'other_';
				}
				showDriverOrOtherRow(otherCategory,driverId);
				typeAccVio = rowIdArray[0];
				if(typeAccVio == 'other' || typeAccVio == 'acc'){
					typeString = 'accidents';
					srchIdPrefix = 'acc';
				}else{
					typeString = 'violations';
					srchIdPrefix = 'vio';
				}
				if(otherCategory){
					trToInsertNewRowId = $('#other_driver_row').attr("id");
				} else {
					trToInsertNewRowId = $('#driver_row_'+driverId).attr("id");
				}
				var trToInsert = $('#' + row_ID);
				var driverSeqNum = parseInt($('#driverIndexNumber_'+driverId).val());
				var maxAccId = getMaxAccVioId(srchIdPrefix,driverId,driverSeqNum,0);
				var accorviotype='';
				var descIdText='';
				var descCdText='';
				var dateText='';
				if(typeAccVio=='other' || typeAccVio=='acc'){
					newTrId = otherString + 'acc' + '_' +driverId+'_' + driverSeqNum + '_' + maxAccId;
					accorviotype='accident';
					descIdText='accidentDescId';
					descCdText='accidentDesc';
					dateText='accidentDate';
				}
				else{
					newTrId = otherString + 'vio' + '_' +driverId+'_' + driverSeqNum + '_' + maxAccId;
					accorviotype='violation';
					descIdText='violationDescId';
					descCdText='violationDescCd';
					dateText='violationDt';
				}
			    var newTrIdArray = newTrId.split('_');
			    var selectEdDt = $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').val();
			    var typeDis = $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').val();
			    if(accVioDesc==null || accVioDesc==''){
			    	accVioDescId = $(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').val();
				    accVioDesc = $(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').val();							    	
			    }
			    var selectedState = $(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').val();							    	
			    var source = $(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').val();
			    var operation = $(trToInsert).find('td.display_state span.ex_re input[type=hidden]').val();
			    var accVioId = '';
			    var driverOnReport = $(trToInsert).find('td.assigned_driver span.disp_drv span.driverOnReportSpan input[type=hidden]').val();
			    driverOnReport = driverOnReport==null?$(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').val():driverOnReport;
			    var idPrefix = 'accidentViolationList'+driverSeqNum+'.'+ typeString + maxAccId;
			    var namePrefix = 'accidentViolationList['+driverSeqNum+'].'+typeString+'['+maxAccId+']';

			    driverOnReport=driverOnReport!=undefined?driverOnReport:'';
			    accVioId = $(trToInsert).find('td.display_desc span.'+srchIdPrefix+'_id input[type=hidden]').val();
			    
			    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
			    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
			    $(trToInsert).find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(driverSeqNum);
			    
			    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name','dto.'+namePrefix+'.driverName');
			    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id','dto.'+idPrefix+'.driverName');
			    $(trToInsert).find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('/','').replace(/^\s+|\s+$/g,''));

			    $(trToInsert).find("td.assigned_driver span.disp_drv select").prop('id',newTrId+'_assignedDriver');
			    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').attr('name',namePrefix+'.driverId');
			    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').attr('id',idPrefix+'.driverId');
			    $(trToInsert).find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
			    
			    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('name','accidentViolationList['+driverSeqNum+'].driverId');
			    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').attr('id','accidentViolationList'+driverSeqNum+'.driverId');
			    $(trToInsert).find('td.assigned_driver span.id_disp_drvaccvio input[type=hidden]').setValue(driverId);
			    
			    $(trToInsert).find('td.assigned_driver div[id^=' + row_ID + '_assignedDriver_chosen' + ']').attr('id',newTrId + '_assignedDriver_chosen');
				   
			   if($('#endorsementMode').val() == 'true'){
				   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name',namePrefix+'.addedInEndorsementInd');
				   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id',idPrefix+'.addedInEndorsementInd');
				   $(trToInsert).find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
			   }
			 
			   // Violation or loss date
			   $(trToInsert).find('td.display_date span.disp_drv input').prop('id',newTrId+'_accVioDt');
			   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').attr('id',idPrefix+'.'+dateText);
			   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').attr('name',namePrefix+'.'+dateText);
			   $(trToInsert).find('td.display_date span.id_disp input[type=hidden]').setValue((accVioDt!=null && $.trim(accVioDt)!='')?accVioDt:selectEdDt);  
			   
				//Type
			   $(trToInsert).find('td.display_type span.disp_drv select').prop('id',newTrId+'_accVioType');
			   $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').attr('id',idPrefix+'.type');
			   $(trToInsert).find('td.display_type span.id_disp input[type=hidden]').attr('name',namePrefix+'.type');
			   
				$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id',idPrefix+'.driverTypeCd');
				$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name',namePrefix+'.driverTypeCd');

			   if(typeDis == 'Accident'){
					$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
				    $(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue(otherCategory?getDriverTypeCode(selectedValue):'A');
				    $(trToInsert).find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue(otherCategory?getDriverTypeCode(selectedValue):'A');
				}else if(typeDis == 'Violation'){
					$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');
					$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('A');
					$(trToInsert).find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue('A');
				}
			   
			    //description
				$(trToInsert).find('td.display_desc span.disp_drv select').prop('id',newTrId+'_accVioDesc');
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('id',idPrefix+'.'+descIdText);
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('name',namePrefix+'.'+descIdText);
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioDescId);
					
				$(trToInsert).find('td.display_desc span.'+(typeAccVio=='vio'?'vio':'acc')+'_id input[type=hidden]').attr('id',idPrefix+'.'+accorviotype+'Id');
				$(trToInsert).find('td.display_desc span.'+(typeAccVio=='vio'?'vio':'acc')+'_id input[type=hidden]').attr('name',namePrefix+'.'+accorviotype+'Id');
				$(trToInsert).find('td.display_desc span.'+(typeAccVio=='vio'?'vio':'acc')+'_id input[type=hidden]').setValue(accVioId);
			
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('id',idPrefix+'.'+descIdText);
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').attr('name',namePrefix+'.'+descIdText);
				$(trToInsert).find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioDescIdNew==''?accVioDescId:accVioDescIdNew);
				
				$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').attr('id',idPrefix+'.'+descCdText);
				$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').attr('name',namePrefix+'.'+descCdText);
				$(trToInsert).find('td.display_desc span.id_desc_text input[type=hidden]').setValue(accVioDescNew==''?accVioDesc:accVioDescNew);
				
				//state
				$(trToInsert).find('td.display_state span.disp_drv select').prop('id',newTrId+'_accVioState');
				$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').attr('id',idPrefix+'.'+accorviotype+'StateCd');
				$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').attr('name',namePrefix+'.'+accorviotype+'StateCd');
				$(trToInsert).find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState==null?accVioState:selectedState);
					
				//source
				$(trToInsert).find('td.display_datasource span.disp_dd').text(source);	
				$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id',idPrefix+'.dataSourceCd');
				$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name',namePrefix+'.dataSourceCd');
				$(trToInsert).find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(accVioSource);
				
			   	if(accOrVio == 'COMPCLAIM' || typeDis == 'COMPCLAIM'){
				   	$(trToInsert).find('td.display_type span.id_disp input[type=hidden]').setValue('COMPCLAIM');
					$(trToInsert).find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C');					
					$(trToInsert).find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue('C');
				}
			   	
				//operation
				$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').attr('id',idPrefix+'.operation');
				$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').attr('name',namePrefix+'.operation');
				$(trToInsert).find('td.display_state span.ex_re input[type=hidden]').setValue(operation);
					
				//exclude reason Delete Link
				$(trToInsert).find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_acc_'+driverId+'_'+driverSeqNum+'_'+maxAccId);
				$(trToInsert).find('td.exclude_reason span.id_disp input[type=hidden]').attr('name',namePrefix+'.excludeReasonCd');
				$(trToInsert).find('td.exclude_reason span.id_disp input[type=hidden]').setValue(accVioExRe);
				
				$(trToInsert).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('id', idPrefix+'.excludeIndicator');
				$(trToInsert).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('name', namePrefix+'.excludeIndicator');
				$(trToInsert).find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').setValue(getExcludeIndicatorValue(accVioExRe));
				
				$(trToInsert).find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');
				$(trToInsert).attr('id', newTrId);
				$(trToInsert).toggleClass('display_mode');
				$(trToInsert).toggleClass('editingrow');
			    
				var errorRow = $('tr[id^=' + rowIdArray[0] + '_Error_' + rowIdArray[1] + '_' +  
						rowIdArray[2] + '_' + rowIdArray[3] + ']');
				if(errorRow.length==0){
					errorRow = $('tr[id^=' + rowIdArray[0]  + '_' +rowIdArray[1] + '_Error_' +  
							rowIdArray[2] + '_' + rowIdArray[3] + '_' + rowIdArray[4] + ']');
				}
				
				var newErrorRowId = '';
				var newTrIdError = '';
				if(otherCategory){
					newErrorRowId = otherString + newTrIdArray[1] + '_Error_' + newTrIdArray[2] + '_' +  
						newTrIdArray[3] + '_' + newTrIdArray[4];
					newTrIdError = otherString + newTrIdArray[1] + '_' + newTrIdArray[2] + '_' +  
						newTrIdArray[3] + '_' + newTrIdArray[4];
				} else{
					newErrorRowId = newTrIdArray[0] + '_Error_' + newTrIdArray[1] + '_' +  
						newTrIdArray[2] + '_' + newTrIdArray[3];
					newTrIdError = newTrIdArray[0] + '_' + newTrIdArray[1] + '_' +  
						newTrIdArray[2] + '_' + newTrIdArray[3];
				}
				
				var otherErrorString = '';
				if(row_ID.indexOf('other') >= 0){
					otherErrorString = row_ID;
				} else{
					otherErrorString = otherString + row_ID;
				}
				
				if($(errorRow).find("td[id='"+ otherErrorString +"_assignedDriver_Error_Col']").length==0){
					otherErrorString = row_ID;
				}
				
				$(errorRow).attr('id', newErrorRowId);
				$(errorRow).find("td[id='"+ otherErrorString +"_assignedDriver_Error_Col']").attr('id',newTrIdError +'_assignedDriver_Error_Col');
				$(errorRow).find("td[id='"+ otherErrorString +"_accVioDt_Error_Col']").attr('id',newTrIdError +'_accVioDt_Error_Col');
				$(errorRow).find("td[id='"+ otherErrorString +"_edType_Error_Col']").attr('id',newTrIdError +'_edType_Error_Col');
				$(errorRow).find("td[id='"+ otherErrorString +"_accVioDesc_Error_Col']").attr('id',newTrIdError +'_accVioDesc_Error_Col');
				$(errorRow).find("td[id='"+ otherErrorString +"_accVioState_Error_Col']").attr('id',newTrIdError +'_accVioState_Error_Col');
				$(errorRow).find("td[id='"+ otherErrorString +"Source_Error_Col']").attr('id',newTrIdError +'Source_Error_Col');
				$(errorRow).find("td.exclude_reason span > :button").attr('id','modify_*' + newTrIdError);
				$('#'+trToInsertNewRowId).after(trToInsert);
				$('#' + newTrId).after(errorRow);
				$(errorRow).hide();
			} else{
					$(".editingrow .assigned_driver span.id_disp input[type='hidden']")
						.setValue(driverId);
					var selectEdDtElem = $('#' + updatedIdWithoutOther + '_accVioDt');
					selectEdDtElem = selectEdDtElem!=undefined?selectEdDtElem:$('#' + oldId + '_accVioDt');
					if(accVioDt!=null && $.trim(accVioDt)!=""){
						$(".editingrow .display_date span.id_disp input[type='hidden']")
							.setValue($.trim(accVioDt));
					} else if(accVioDt!=null && $.trim(accVioDt)==""){
						accVioDt =  $('#' + updatedId + '_accVioDt').text();
						$(".editingrow .display_date span.id_disp input[type='hidden']")
							.setValue($.trim(accVioDt));
					} else if(selectEdDtElem[0]!=null){
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
					$(".editingrow").find("td span.disp_drv select").prop('disabled', false)
						.trigger('chosen:updated');
					
					$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]')
						.setValue('A');
					$(".editingrow").find('td.assigned_driver span.id_drv_type2 input[type=hidden]')
						.setValue('A');

					if (accOrVio!=null && (accOrVio.toLowerCase() == 'accident' || accOrVio.toLowerCase() == 'compclaim')) {
						if (disp_type!=null && disp_type.toLowerCase() == 'violation') {
							$(".editingrow .display_state span.ex_re input[type='hidden']").setValue("CHANGE");
							$(".editingrow .display_desc span.id_disp_id input[type='hidden']").setValue(accVioDescIdNew);
							$(".editingrow .display_desc span.id_desc_text input[type='hidden']").setValue(accVioDescNew);
						}
						$(".editingrow .display_type span.id_disp input[type='hidden']")
							.setValue(accOrVio);
					}
					if (accOrVio!=null && accOrVio.toLowerCase() == 'violation') {
						if (disp_type!=null && disp_type.toLowerCase() == 'accident') {
							$(".editingrow .display_state span.ex_re input[type='hidden']").setValue("CHANGE");
							$(".editingrow .display_desc span.id_disp_id input[type='hidden']").setValue(accVioDescIdNew);
							$(".editingrow .display_desc span.id_desc_text input[type='hidden']").setValue(accVioDescNew);
						}
					}
					$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .disp_dd').show();
					$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .ex_re').show();
					$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .accVioCancel')
						.replaceWith('<span class=\"ex_reason"\></span>');
					
					$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_state .disp_drv').show();
					$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_state .accVioSave')
							.replaceWith('<span class=\"ex_reason"\></span>');
					
					$(".editingrow td.exclude_reason span.exclude_dd_reason input[type=hidden]").setValue(getExcludeIndicatorValue(accVioExRe));
					
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
							} else if(currentDate == date){
							} else if(index == lengthOfTrArray - 1){
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
		enableExcludeReasons(true);
		//REFACTOR 11:
		enableRows(true);							
		e.preventDefault();
		e.stopPropagation();
		refreshRateButton();
	});

	$(document).on("click",".accVioCancel_New",function(e) {
			var ButtonId = $(this).prop("id");
			var arrElm = ButtonId.split("*");
			var row_ID = arrElm[1];
			var rower_id = $(this).parents("tr").first().prop("id");
			var updatedId = row_ID;
			var driverId = disp_assigned_driver_selected;
			var driverName = disp_assigned_driver_selected_name;
			var accVioId = disp_desc_selected;
			var accVioDesc = disp_desc_selected_name;
			var accVioStateId = disp_state_selected;
			var display_type = disp_type;
			var display_date_hidden = disp_acc_vio_date;
			var data_source_cd = disp_data_source_cd;
			var disp_exc_reason = disp_exclude_reason;
			var ddId = updatedId + '_accVioDesc';
			var typePrefix;
			var chosenTypePrefix;
											
			$('#' + rower_id).hide();
			$('#' + row_ID).removeClass("blueRow");
			if(driverId=='Select'){
				driverId='';
			}
			if(display_type==''){
				display_type = $(this).closest('tr').prev().find("td.display_type span.id_disp input[type='hidden']").getValue();
			}
			if(display_type.toLowerCase() == 'compclaim' || isOtherType(driverId)){
				driverId = primaryDriverId;
			}

			$('#edType').val(display_type);
			$(".editingrow .display_type span.id_disp input[type='hidden']").setValue(display_type);
			if(rower_id.indexOf('unassigned') >= 0 && !isEndorsement()){
					$('#' + updatedId + '_assignedDriver').val('');
					$(".editingrow .assigned_driver span.id_disp input[type='hidden']").setValue('');
			}else{
					$('#' + updatedId + '_assignedDriver').val(driverId);
					$(".editingrow .assigned_driver span.id_disp input[type='hidden']").setValue(driverId);
					$('#' + updatedId + '_accVioState').val(accVioStateId);
					$(".editingrow .display_state span.id_disp_id input[type='hidden']").setValue(driverId);
			}
					
			if (display_type == 'Violation') {
				typePrefix = 'vio';
				chosenTypePrefix = 'div[id$="editVio_chosen"]';
			} else if (display_type.toLowerCase() == 'compclaim') {
				typePrefix = 'com';
				chosenTypePrefix = 'div[id$="editCom_chosen"]';
			} else {
				typePrefix = 'acc';
				chosenTypePrefix = 'div[id$="editAcc_chosen"]';
			}
					
			if(data_source_cd != 'Client'){
				$(".editingrow td.display_desc span.disp_drv").replaceWith(accVioDesc);
			} else {
				$('.editingrow td.display_desc span.disp_drv')
					.replaceWith($('tr.edit_mode').find('td.edit_desc_'+typePrefix).html());
				$(".editingrow td.display_desc span select").prop('id', ddId);
				$('#' + ddId).closest('tr').find(chosenTypePrefix).remove();
				addChosenForAccViol($('#' + ddId));
				$('#' + updatedId + '_accVioDesc').val(accVioId + '_' + accVioDesc);
				$('#' + ddId).trigger('chosen:updated');
			}
					
			$(".editingrow .display_desc span.id_disp_id input[type='hidden']").setValue(accVioId);
			$(".editingrow .display_desc span.id_desc_text input[type='hidden']").setValue(accVioDesc);
					
			$('#' + updatedId + '_accVioDt').val(display_date_hidden);
			$(".editingrow .display_date span.id_disp_id input[type='hidden']").setValue($.trim(display_date_hidden));
					
			$('#' + updatedId + '_accVioState').val(accVioStateId);
			$(".editingrow .display_state span.id_disp_id input[type='hidden']").setValue(accVioStateId);
					
			$(".editingrow").find("td.exclude_reason span.exclude_dd_reason select.excludeReasonAccVioSelect")
				.val(disp_exc_reason).trigger('chosen:updated');

			
			var excReasonVio = $(".editingrow").find("td.exclude_reason span.id_disp input[type='hidden']").val();
			if(excReasonVio!='Driver Removed'){
				$(".editingrow").find("td.exclude_reason span.id_disp input[type='hidden']")
				.setValue(disp_exc_reason);
			}	
			
			// wrapper disabled
			if (isOtherType(driverName)) {
				if (driverName == 'No Driver-Comp Clm') {
					$(".editingrow").find("td.assigned_driver span.disp_drv select")
									.val(driverName).prop('disabled',true).trigger('chosen:updated');
					$(".editingrow").find("td.typeAccVio span.disp_drv select")
									.prop('disabled',true).trigger('chosen:updated');
				} else {
					$(".editingrow").find("td.assigned_driver span.disp_drv select")
									.val(driverName).prop('disabled',false).trigger('chosen:updated');
					$(".editingrow").find("td span.disp_drv select")
									.prop('disabled', false).trigger('chosen:updated');
				}
			} else {
				if(driverName == 'Select' || driverName == ''){
					$(".editingrow").find("td.assigned_driver span.disp_drv select").val('Select').trigger('chosen:updated');
				}
				$(".editingrow").find("td span.disp_drv select").prop('disabled', false).trigger('chosen:updated');
			}
			$(".editingrow").find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue(getDriverTypeCode(driverName));
			$(".editingrow").find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue(getDriverTypeCode(driverName));
			$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .disp_dd').show();
			$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_datasource .ex_re').show();
			$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_state .disp_drv').show();
			$('.editingrow').nextAll('tr[class^="display_mode"]').first().find('td.display_state .accVioSave')
				.replaceWith('<span class=\"ex_reason"\></span>');
			$('.editingrow').nextAll('tr[class^="display_mode"]')
				.first().find('td.display_datasource .accVioCancel').replaceWith('<span class=\"ex_reason"\></span>');
			highlightRow(row_ID);
			
			// set the id back to what it was for acc_vio type
			$('#edType').prop('id', updatedId + '_accVioType');
			$('.editingrow').addClass("display_mode");
			$('.editingrow').removeClass("editingrow");
			$('#addAccVioDisable').hide();
			$('#addAccVio').show();
			enableExcludeReasons(true);
			clearRowErrors($(this).closest('tr'));
            //REFACTOR 10:						
			enableRows (true);
			e.preventDefault();
			e.stopPropagation();
	});
		
	$('span#viewAccVio3rdPartyReportDetails').on("click", function() {
		$('div#viewAccVioThirdPartyReportLinks').modal().position({
			my : 'left top',
			at : 'center bottom',
			of : '#viewAccVio3rdPartyReportDetails'
		});
	});

	$('span#viewRemovedAccidentsAndViolationsLink').on("click",function() {
		$('div#viewDeletedAccVio').show();
	});

	$('span#viewReportsDetailsLink').on("click",function() {
		$('div#reportDetails').modal().position({
			my : 'left top',
			at : 'left bottom',
			of : '#viewReportsDetailsLink'
		});
	});
	
	$('span#viewReportsEndorsementDetailsLink').on("click",function() {
		//$('#reportDetails').modal();
		$('#reportDetails').modal().position({
			my : 'left top',
			at : 'left bottom',
			of : '#viewReportsEndorsementDetailsLink'
		});
	});

	$('span#viewClaimAbstractLink').click(function() {
		callOfflineAbstractService("/aiui/accidentsViolations/viewThirdPartyClaimAbstract/"+$('#policyKey').val()+"/"+$("#stateCd").val(),$('div#viewClaimsAbstract'),'<td width="65%" class="headerSectionAbstract"><b>Accident / Claims Abstract</b><br />Quote# : '+$('#policyNumberForAccVio').val()+'<br />Effective : '+$('#policyEffDt').val()+'</td>');
	});
	
	$('span#viewViolationAbstractLink').click(function() {
		callOfflineAbstractService("/aiui/accidentsViolations/viewThirdPartyViolationAbstract/"+$('#policyKey').val()+"/"+$("#stateCd").val(),$('div#viewViolationsAbstract'),'<td width="65%" class="headerSectionAbstract"><b>Violation Abstract</b><br />Quote# : '+$('#policyNumberForAccVio').val()+'<br />Effective : '+$('#policyEffDt').val()+'</td>');
	});
	
	$('span#viewViolationAbstractEndorsementLink').click(function() {
		$('#viewAccVioThirdPartyReportLinks').hide();
		document.aiForm.viewViolationAbstractPopup.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	});
	
	$('span#viewClaimAbstractEndorsementLink').click(function() {
		$('#viewAccVioThirdPartyReportLinks').hide();
		document.aiForm.viewClaimAbstractPopup.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	});

	$('button#orderRptBtn').click(function() {
	    var uwDecision = $("#uwDecision").val();
		if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
		    //Ordering reports is not authorized on quotes in decline status.
            $("#uwDeclineModal").modal('show');
		}else{
		document.aiForm.orderThirdPartyReports.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
		}
	});
	
	$('button#orderRptEndorsementBtn').click(function() {
	    var uwDecision = $("#uwDecision").val();
	    if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
			 //Ordering reports is not authorized on quotes in decline status.
	         $("#uwDeclineModal").modal('show');
		}else{
		if($('#stateCd').val() == 'MA'){
			if($('#containsOOSDrivers').val() == 'true'){
				$('#orderThirdPartyEndorsementWarnModal').modal();	
			}else{
				document.aiForm.orderThirdPartyReports.value = 'true';
				nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value); 
			}
		}else if($('#stateCd').val() != 'MA' && isMVRInitialOrderComplete()){			
			document.aiForm.orderThirdPartyReports.value = 'true';
			nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value); 
		} else{
			$('#orderThirdPartyEndorsementWarnModal').modal();
		}
		return false;
	    }
	});
	
	$(document).on("click", "button.offlineAbstractPrint", function(){
		 printThisMessage(this.id);
		 return false;
	});
	
	//handled in common.js
	//$('button.orderReportsBeforeRate').click(function() {
	//	document.aiForm.orderThirdPartyReports.value = 'true';
	//	nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	//});
	
	$('#orderReportsEndorsementsTrigger').click(function() {
	     var uwDecision = $("#uwDecision").val();
		 if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
				//Ordering reports is not authorized on quotes in decline status.
			    $("#uwDeclineModal").modal('show');
		 }else{
		document.aiForm.orderThirdPartyReports.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
		 }
	});
	
	$('.view_rpt_details_order').click(function() {
		   var uwDecision = $("#uwDecision").val();
		   if(uwDecision!= undefined && uwDecision!='' && uwDecision.toUpperCase() == 'DECLINE'){
			    //Ordering reports is not authorized on quotes in decline status.
	            $("#uwDeclineModal").modal('show');
		   }else{
		$('#reportDetails').hide();
		if(!isMVRInitialOrderComplete() 
				&& ($('#newBusinessMode').val() == 'false' || $('#newBusinessMode').val() == '')){
			$('#orderThirdPartyEndorsementWarnModal').modal();
			return false;
		}
		document.aiForm.orderThirdPartyReports.value = 'true';
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
		   }
	});
	
	if($('#showViewViolationAbstractPopup').val() == 'true' && 
			document.aiForm.currentTab.value == 'accidentsViolations'){
		$('#viewViolationsAbstract').modal();
	}
	
	if($('#showViewClaimAbstractPopup').val() == 'true' && 
			document.aiForm.currentTab.value == 'accidentsViolations'){
		$('#viewClaimsAbstract').modal();
	}

	if(($('#clueDown').val()==null || $('#clueDown').val()!='true') &&
			($('#mvrDown').val()==null || $('#mvrDown').val()!='true') && 
			($('#clueDownFlag').val()==null || $('#clueDownFlag').val()!='true') &&
			($('#mvrDownFlag').val()==null || $('#mvrDownFlag').val()!='true')){		
		showCleanDirtyModals();
	}
	
	$(document).on("click", "#popupModal .closeModal", function(){
		if($('#mvrErrorCd').val()!='Validation' && !($('#clueDown').val()=='true' && $('#mvrDown').val()=='true')){			
			showCleanDirtyModals();
		}
	});
	
	if($('#showTabsErroneousPopupFlag').val() == 'true'){
		if($('#stateCd').val()=='MA')
			$('#orderThirdPartyDriverTabErroneousModal').modal();
		else
			$('#orderThirdPartyTabsErroneousModal').modal();
		$('#processEditMessage').hide();
	}
	
	if($('#showPrefillRequiredPopupFlag').val() == 'true'){
		$('#orderThirdPartyPrefillNotReconciledModal').modal();
		$('#processEditMessage').hide();
	}
	
	if (!isEndorsement()) {
		bindViewPrefillDataLink();
	}
	
	if($('#showInvalidDriverLicenseFlag').val() == 'true'){
		if($('#stateCd').val()=='MA') {
			$('#orderThirdPartyInvalidLicenseModalForMA').modal();
		} else {
			$('#orderThirdPartyInvalidLicenseModal').modal();
		}
	}
	
	if($('#showInvalidVinFlag').val() == 'true'){
		$('#orderThirdPartyInvalidVinModal').modal();
	}
	
	$('.selected_driver_class').on("change", function(e) {
		var driverId = $(this).val();
		var closestTr = $(this).closest('tr');
		var closestTd = $(this).closest('td');
		var accVioType=$(closestTr).find('td.typeAccVio select.typeAccVio')[0];
		validateField(this, this.id, 'required');
		if($(this)[0].value!='No Driver-Comp Clm' && accVioType!=null && accVioType.value!=null){
			validateDriverTypeCombination($(this)[0],accVioType.value);
		}
		defaultExcludeReason($(this).closest('tr'),driverId);
		validateExcludeReason($(this).closest('tr'),driverId);
		if(isOtherType(driverId)){
			$(closestTd).find("span.id_drv_type input[type='hidden']").setValue(getDriverTypeCode(driverId));
		}
		else{
			$(closestTd).find("span.id_drv_type input[type='hidden']").setValue('');
			$(closestTd).find("span.id_disp_drvaccvio input[type='hidden']").setValue('').trigger('chosen:updated');
			$(closestTd).find("span.id_disp input[type='hidden']").setValue('').trigger('chosen:updated');
		}
		if(!$(closestTr).hasClass('selectDriverToAdd')){
			refreshRateButton();
		}
	});

	$('.lossDateAccVio').on("change", function(e) {
		validateAccVioDateField(this);		
		if(!$(this).closest('tr').hasClass('selectDriverToAdd')){
			refreshRateButton();
		}
	});
	
	$('.select_type_available').on("change", function(e) {
		validateField(this, this.id, 'required');
		if(!$(this).closest('tr').hasClass('selectDriverToAdd')){
			refreshRateButton();
		}
	});
	
	$('select.descriptionAccVio').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('select.selected_populated_state_class').on("change", function(e) {
		validateField(this, this.id, 'required');
	});
	
	$('select.selected_populated_state_class_').on("change", function(e) {
		validateField(this, this.id, 'required');
	});	
	//TD# 73843
	/*$(document).on("click", ".openPrefillDialog", function(){
		$('#orderThirdPartyPrefillNotReconciledModal').modal('hide');
		document.aiForm.viewPrefill.value = 'true';
		$('#reconcilePrefillClicked').val('true');
		nextTab(document.aiForm.currentTab.value,document.aiForm.currentTab.value);
	});*/
	
	$('#selectEdDt').keyup(function(event){
		autoSlashes(this,event);
    });
	
	$("[id$=accVioDt]").keyup(function(event){
		autoSlashes(this,event);
    });
	
	$(document).on("change", ".excludeReasonAccVioSelect", function(e) {
		$(this).closest('td').find('#excludeReasonHidden').val(this.value);
		//"Hidden" Driver ID is being read incorrectly for unassigned rows. (It is always populating primary driver ID)
		var driverId = $(this).closest('tr').find('.assigned_driver select').val();
		validateExcludeReason($(this).closest('tr'),driverId);
		refreshRateButton();
	});
	
	var containsOther = $('#containsOther').val();
	if(containsOther == 'false'){
		$('#other_driver_row').hide();
	} else {
		$('#other_driver_row').show();
	}
	
	$(document).on("change", ".assignedDriverAccVio", function(e) {
		var selectValue = $(this).val();
		if(selectValue==''){ return false; }
		defaultExcludeReason($(this).closest('tr'),selectValue);
		validateExcludeReason($(this).closest('tr'),selectValue);
		if(selectValue == 'No Driver-Comp Clm'){
			var selectTypeBox = $(this).closest('tr').find("td.select_display_type span.disp_drv select[id^='selectEdType']"); 
			var typeVal = $(selectTypeBox).val();
			if(typeVal==undefined){
				selectTypeBox = $(this).closest('tr').find("span.disp_drv select.typeAccVio");
				typeVal = $(selectTypeBox).val();
			}
			if(typeVal != 'COMPCLAIM'){
				var descBox = $(this).closest('tr').find("td.select_display_desc span.disp_drv_acc select.descriptionAccVio");
				$(selectTypeBox).val('COMPCLAIM').trigger('chosen:updated');
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
			var typeVal = $(selectTypeBox).val();
			if(typeVal==undefined){
				selectTypeBox = $(this).closest('tr').find("span.disp_drv select.typeAccVio");
				typeVal = $(selectTypeBox).val();
			}
			if(typeVal == 'COMPCLAIM'){
				var descBox = $(this).closest('tr').find("td.select_display_desc span.disp_drv_acc select.descriptionAccVio");
				$(selectTypeBox).val('').trigger('chosen:updated');
				$('.disp_drv_com').show();
				$('.disp_drv_vio').hide();
				$('.disp_drv_acc').hide();
				$(descBox).val('').trigger('chosen:updated');
			}
		}
		if(!$(this).closest('tr').hasClass('selectDriverToAdd')){
			refreshRateButton();
		}
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
	
	//TD - 43312 - display fix now fix later
	if ( checkPrefillItemsAdded() ) {
		 showPrefillAddedItemsEdits();
	} 
	
	emptyOutViewRemovedModalIfApplicable();
	showReorderErrorPopups(); 
	
	$('select.manualAccidents').each(function(e) {
		validateField(this, this.id, 'blank');
	});
	
	//set tab index for all .tabOrder fields	
	setTabIndex();
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	initialFormLoadProcessing();
});

var tabIndex = 101; // 1-100 is for header

function setTabIndex() {
	 var selector =  $('#accVioTabl > tbody > tr') ;
	 var tabOrderElements = $('.tabOrder', selector);
	 tabOrderElements.each(function() {
		 if($(this).is('select:not(select[multiple])') && (!$(this).attr('disabled'))){
			 var chosenContainer = $(this).next();// this will be the container for the dropdown
			 chosenContainer.find('a').attr('tabindex',tabIndex++);
			 //chosenContainer.find('input').attr('tabindex',tabIndex++);
		 } else {
			 $(this).attr("tabindex", tabIndex++);		
		 }
		
	  });
}

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
		} else if(errorRowId.indexOf('other_Error_acc')>=0){
			errorRowId = errorRowId.replace('other_Error_acc','other_acc_Error');
		} else if(errorRowId.indexOf('unassigned_Error_vio')>=0){
			errorRowId = errorRowId.replace('unassigned_Error_vio','unassigned_vio_Error');
		}
	} else {
		str0 = trId;
		str1 = "";
		colId =  fieldName;
		errorRowId = str0 + 'Next';
	}		
	if(fieldName!=null && (fieldName=='select_manual_addicent_id' 
		|| fieldName=='select_manual_violation_id' || fieldName=='select_manual_comp_id')){
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
		displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,false);
		return;		
	} else if(validationType == ''){
		displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,true);
		return;
	} else if (validationType == 'blank'){
		if(fieldObj.value=="Select"){
			displayFieldErrorMessageInDataTable(errorRowId, errorColumnId, errorMessage,colId,false);
		}
		return;
	}
	displayFieldErrorMessageInDataTable(errorRowId, errorColumnId, errorMessage,colId,false);
}

function displayFieldErrorMessageInDataTable(errorRowId, errorColumnId,errorMessage,colId,clearErrorMsg) {
	var thisTr = $('#accVioTabl tr#'+errorRowId);
	var prevTr = $(thisTr).prev();
	var columnId = (errorColumnId!=null)?(errorColumnId.replace('_Error_Col','')):colId;
	if(clearErrorMsg){
		$(thisTr).find('td[id^="' + errorColumnId + '"]').find('span').text('');
		$(prevTr).find('select.exclude_reason_class')
				.removeClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+columnId).removeClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+colId).removeClass('inlineError').trigger('chosen:styleUpdated');
	} else {
		$(thisTr).find('td[id^="' + errorColumnId + '"]').find('span').text(errorMessage);
		if(errorMessage!=null && errorMessage.indexOf("exclude reason")!=-1){
			$(prevTr).find('select.exclude_reason_class')
				.addClass('inlineError').trigger('chosen:styleUpdated');
		}
		$('#'+columnId).addClass('inlineError').trigger('chosen:styleUpdated');
		$('#'+colId).addClass('inlineError').trigger('chosen:styleUpdated');
	}		
}

function validateAccVioDateField(fieldObj){
	if ($(fieldObj).val() == ''){
		validateField(fieldObj, fieldObj.id, 'required');
	}else{
		var dateId = '#' + fieldObj.id;
		var currentDate = new XDate().toString('MM/dd/yyyy');
		var current_year = parseInt(currentDate.split("/")[2]);
		var year = parseInt($(fieldObj).val().split("/")[2]);
		
		if (isValidDateFormat(dateId) == false){
			validateField(fieldObj, fieldObj.id, 'invalidFormat');			
		}
		else if(year < 1900 || year > current_year){
			validateField(fieldObj, fieldObj.id, 'invalidFormat');
		}	
		//Future dates are allowed as part of change control
		//if (isFutureDate(fieldObj.value) == true){validateField(fieldObj, fieldObj.id, 'noFutureDate');}
		else{
			validateField(fieldObj, fieldObj.id, '');	
		}
	}	
}

//Future dates are allowed as part of change control.
//function isFutureDate(dateVal){if(new Date(dateVal) > new Date()){return true;}return false;}

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

//window.onload = initialFormLoadProcessing;
var errorMessages;
function initialFormLoadProcessing() {
	// Set default button when <enter> is clicked
	setDefaultEnterID('save');
}

var addDeleteCallback = function(row, addIt){};

function validatePage() {
	// clear any existing error clearPageError('.pageError');
	var errorCount = validateInputs();
	return errorCount == 0;
}

//11/18/2014 Updated as per 2.4 requirements 3.2.24
function updateDropdowns(){
	if($('#riskState').val()=='MA'){
		$('.descriptionAccVio option[value*="Accident - Not At Fault"]').remove();
		$('span.id_drv_type input[value="F"]').each(function(){
				$(this).closest('tr').find('td.exclude_reason select').append('<option val="Non-household member">Non-household member</option>');
		});
		$('.descriptionAccVio').trigger('chosen:updated');		
	}
	if($('#riskState').val()!='NH'){
		$('.exclude_reason_class option[value=HTANRN]').remove();
		$('.exclude_reason_class option[value=COLWTAN]').remove();
		$('.exclude_reason_class option[value=DRVDCS]').remove();
		$('.exclude_reason_class option[value=CLRMRE]').remove();	
		$('.exclude_reason_class').trigger('chosen:updated');
	}
}

/**When ADD or CANCEL for a newly added manual entry is clicked, clear the old data.*/
function clearNewlyAddedRow(){		
	$('tr.selectDriverToAdd').find('select')
		.val('').removeClass('inlineError').prop('disabled',false)
		.trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAdd').find('td.select_display_date  span.disp_drv input')
		.val('').removeClass('inlineError')
		.trigger('chosen:updated').trigger('chosen:styleUpdated');
	$('tr.selectDriverToAddNext').find('td span.inlineErrorMsg').text('');
}

/**
 * Assigned driver vs Type combination
 * 1) Can not have Violations for Friend/Relative
 * 2) Can not have No Driver-Comp Claim for Acc, Vio types and vice versa. * 
 * */
function validateDriverTypeCombination(assignedDriverElem,accVioType){
	if(assignedDriverElem==null || accVioType==null || accVioType==''){
		return true;
	}
	var assignedDrv = assignedDriverElem.value;
	if(assignedDrv=='No Driver or Friend/Relative' && accVioType.toLowerCase()=='violation'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidCombinationType');
		return false;
	}	
	if(assignedDrv=='No Driver-Comp Clm' && accVioType.toLowerCase()!='compclaim'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidCombinationType');
		return false;
	}
	if(assignedDrv!='No Driver-Comp Clm' && accVioType.toLowerCase()=='compclaim'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidCombinationType');
		return false;
	}
	validateField(assignedDriverElem, assignedDriverElem.id, '');
	return true;
}

/**Default exclude reasons as per FIELDS document*/
function defaultExcludeReason(closestTr,driverId){
	var assignedDriverElem = $(closestTr).find('td.assigned_driver span.disp_drv select.assignedDriverAccVio')[0];
	var excludeReasonElem = $(closestTr).find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0];
	var dataSource = $(closestTr).find('td.display_datasource span.disp_dd').text();
	if (assignedDriverElem == null || dataSource==null 
			|| $.trim(dataSource.toLowerCase())!='clue' || excludeReasonElem == null) {
		return;
	}
	var assignedDrv = assignedDriverElem.value;
	var driverStatus = '';
	if(assignedDrv!=null && $.trim(assignedDrv)!="" && $.isNumeric(assignedDrv)){
		driverStatus = $('#driverStatusCd_'+driverId).val();
	}
	if (assignedDrv == 'Unknown Driver') {
		$(excludeReasonElem).val('UNKWN').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('UNKWN');
	} else if (assignedDrv == 'Deceased HH Member') {
		$(excludeReasonElem).val('DCSDFM').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('DCSDFM');
	} else if (driverStatus == 'N') {
		$(excludeReasonElem).val('MLTSVC').trigger('chosen:updated');
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('MLTSVC');
	} else if (assignedDrv == "No Driver or Friend/Relative" && $('#riskState').val() == 'MA') {
		if($('#'+excludeReasonElem.id+' option[val="Non-household member"]').length > 0){
			$(excludeReasonElem).val('Non-household member').trigger('chosen:updated');
		}else{
			$(excludeReasonElem).append('<option val="Non-household member">Non-household member</option>').trigger('chosen:updated');
			$(excludeReasonElem).val('Non-household member').trigger('chosen:updated');
		}
		$(excludeReasonElem).closest('td').find('span.id_disp input[type=hidden]').val('Non-household member');
	}
}

/**Edits for Exclude reason as per EDITS document*/
function validateExcludeReason(closestTr,driverId){
	var assignedDriverElem = $(closestTr).find('td.assigned_driver span.disp_drv select.assignedDriverAccVio')[0];
	var excludeReasonElem = $(closestTr).find('td.exclude_reason  span.exclude_dd_reason select.excludeReasonAccVioSelect')[0];
	var dataSource = $(closestTr).find('td.display_datasource span.disp_dd').text();
	if(assignedDriverElem==null || dataSource==null || $.trim(dataSource.toLowerCase())!='clue'){
		return true;
	}	
	var assignedDrv = assignedDriverElem.value;
	var excludeReason = '';
	var driverStatus = '';
	if(assignedDrv!=null && $.trim(assignedDrv)!="" && $.isNumeric(assignedDrv)){
		driverStatus = $('#driverStatusCd_'+driverId).val();
	}
	if(excludeReasonElem!=null){
		excludeReason = excludeReasonElem.value;
	}
	if(excludeReason=='UNKWN' && assignedDrv!='Unknown Driver'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason=='DCSDFM' && assignedDrv!='Deceased HH Member'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason=='CHOWINS' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason=='CHNOAC' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason=='MLTSVC' && driverStatus!='N'){	//Defect 43240
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason=='DIVSP' && $.isNumeric(assignedDrv)){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}
	//Revese Edits - with respect to Assigned Driver
	if(excludeReason!='' && excludeReason!='UNKWN' && assignedDrv=='Unknown Driver'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	} else if(excludeReason!='' && excludeReason!='DCSDFM' && assignedDrv=='Deceased HH Member'){
		validateField(assignedDriverElem, assignedDriverElem.id, 'invalidExcludeReason');
		return false;
	}
	//Defect 43240 - Reverse edit shouldn't fire for "Away in Military"
	validateField(assignedDriverElem, assignedDriverElem.id, '');
	return true;
}

function lengthCheck(field){
	if(field.length!=null){
		if(field.length>0){ return true; }
		return false; 
	} 
	return true; 
}

/**Validate all fields for manual entry and driver for all cases*/
function validateAllDataBeforeSaving(prevTr,accOrVio,driverId){	
	var selectEdDtElem = '';
	var selectedAccVioTypeElem  = '';
	var selectedStateElem = '';
	var selectedAccVioDescElem = '';
	var selectedAssignedDriverElem = $(prevTr).find('td.assigned_driver span.disp_drv select');
	var accVioSource = $(prevTr).find('td.display_datasource span.id_disp_dd input').val();
	if(accVioSource!=null && accVioSource.toLowerCase()=='client'){		
		selectEdDtElem = $(prevTr).find('td.display_date span.disp_drv input');
		selectedAccVioTypeElem = $(prevTr).find('td.display_type span.disp_drv select');
		selectedStateElem = $(prevTr).find('td.display_state span.disp_drv select');
		selectedAccVioDescElem = $(prevTr).find('td.display_desc span:not(:hidden) select');
	}
	if(!checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem,accVioSource,'SAVE')){
		return false;
	} else if(!validateDriverTypeCombination(selectedAssignedDriverElem[0],accOrVio)){
		return false;
	} else if(!validateExcludeReason($(prevTr),driverId)){
		return false;
	}
	return true;
}

/**This function will be called by ADD and SAVE operations. 
 * It will validate whether all required fields are entered or not.*/
function checkReqdFieldsBeforeAdding(selectEdDtElem,selectedAccVioTypeElem,selectedAssignedDriverElem,selectedStateElem,selectedAccVioDescElem,accVioSource,operation){
	var isValidationSuccessful = true;
	var assignedDriver = selectedAssignedDriverElem[0]!=null?selectedAssignedDriverElem[0]:selectedAssignedDriverElem;
	var invalidDriverComb = false;
	if(accVioSource!=null && accVioSource.toLowerCase()=='client'){		
		var accVioType = selectedAccVioTypeElem[0];
		var dateField = selectEdDtElem[0];
		var accVioDesc = selectedAccVioDescElem[0];
		var state = selectedStateElem[0];
		if(dateField!=null && lengthCheck(dateField)){
			validateAccVioDateField(dateField);
			if(dateField.value=="" || isValidDateVal(dateField.value) == false || verifyDateYear(dateField) == false){
				isValidationSuccessful = false;
			}
		}	
		if(accVioType!=null && lengthCheck(accVioType)){
			validateField(accVioType,accVioType.id,'required');
			if(isValueBlankOrSelect(accVioType)){
				isValidationSuccessful = false;
			}
		}	
		if(state!=null && lengthCheck(state) ){
			validateField(state,state.id,'required');
			if(isValueBlankOrSelect(state)){
				isValidationSuccessful = false;
			}
		}	
		if(accVioDesc!=null && lengthCheck(accVioDesc)){
			validateField(accVioDesc,accVioDesc.id,'required');
			if(isValueBlankOrSelect(accVioDesc)){
				isValidationSuccessful = false;
			}
		}	
		if(operation=='ADD' && !validateDriverTypeCombination(selectedAssignedDriverElem[0],selectedAccVioTypeElem[0].value)){
			isValidationSuccessful = false;
			invalidDriverComb = true;
		}
	}
	if(!invalidDriverComb && assignedDriver!=null && lengthCheck(assignedDriver)){
		validateField(assignedDriver,assignedDriver.id,'required');
		if(isValueBlankOrSelect(assignedDriver)){
			isValidationSuccessful = false;
		}
	}
	return isValidationSuccessful;
}

function highlightRow(rowName) {
	$('#' + rowName).effect("highlight", {color : '#FF9C00'}, 3000);
}

function resetAddDefaultSelections() {
	$('#selected_assigned_driver_id').val("").trigger('chosen:updated');
	$('#selectEdDt').val("");
	$('#selectEdType').val("").trigger('chosen:updated');
	$('#select_manual_addicent_id').val("").trigger('chosen:updated');
	$('#select_manual_violation_id').val("").trigger('chosen:updated');
	$('#select_state_addicent_vio_id').val("").trigger('chosen:updated');
}

function resetAddDefaultUnassignedSelections() {
	$('#unassigned_selected_driver_class').val("Select").trigger('chosen:updated');
}

function addChosenForAccViol(select) {	
	//Chosen: Migration
	 addChosen(select.attr("id"));	
}

function handleSubmit(e) {	
	//final check for valid date format's. Clear fields that do not have valid formats	
	$("#accVioTabl > tbody > tr:visible > td.display_date > span.id_disp > input").each(function() {
		var strDate = $(this).val();
		 if (isValidDateVal(strDate) == false){
			 $(this).val('');
		 }
	});
}

/**
 * Check if any error row exists which is not either corrected or cleared.
 * Users are not allowed to save or navigate away without this.
 * */
function isReadyToSubmit(){
	//01/26/2015 Do not combine the selectors. Taking longer time (250ms as opposed to 1 ms)
	//if($('tr.drvSepAccVio:not(:hidden),tr.selectDriverToAdd:not(:hidden)').length > 0){
	if($('tr.drvSepAccVio:not(:hidden)').length > 0
			|| $('tr.selectDriverToAdd:not(:hidden)').length > 0){
		return false;
	}
	return true;	
}

/******NOT FOR 2.0*****/
/**The below is a better way of handling the "Hard Stop". 
	If user clicks edits a row (or tries to add a new row), and clicks 
	NEXT or another tab or global SAVE or RATE, we can automatically invoke the row's save. 
	a.	If any errors exist on this row,
		i.	We can either cancel the row's changes by invoking the row's Cancel 
			button which would revert the row's changes and continue the NEXT 
			or another tab navigation without giving a hard stop to the user.
		ii.	Or we can show the hard edit now saying that errors exist on the 
			page and need to be corrected before leaving
	b.	If no errors exist on the row all changes would be saved, and continue 
		the NEXT or another tab navigation
*/
/*function isReadyToSubmit(){
	var errorRowExisting = $('tr.drvSepAccVio:not(:hidden)');
	var errorRowNew = $('tr.selectDriverToAdd:not(:hidden)');
	if(errorRowExisting.length > 0){
		errorRowExisting.find('button.accVioSave_New,button.addSelectedUnassigned').trigger('click');
		//Do not use above selector. Need to compute it again
		if($('tr.drvSepAccVio:not(:hidden)').length > 0){
			//errorRowExisting.find('button.accVioCancel_New').trigger('click');
			return false;
		}
	}
	if(errorRowNew.length > 0){
		errorRowNew.find('button.addSelected').trigger('click');
		//Do not use above selector. Need to compute it again
		if($('tr.selectDriverToAdd:not(:hidden)').length > 0){
			//errorRowNew.find('button.cancelSelected').trigger('click');
			return false;			
		}
	}
	return true;
}*/

function refreshRateButton(){
	resetPremium($('#ratedInd').val(),$('#premAmt').val());
}

function printThisMessage(abstractType)  {
	var currentModal = (abstractType=='violationsPrintBtn')?($('#viewViolationsAbstract').html()):($('#viewClaimsAbstract').html());
	var content = '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">'+ '<head>' 
		+ '</head>' + '<body>' +  '<div style = "font-family: Arial, Helvetica, sans-serif;font-size: 14px;font-weight: bold;color: #333333">' 
    	+ currentModal + '</div>' + '</body>' + '</html>';
	content = content.replaceAll('button','button style="display:none;"');
	content = content.replaceAll('<a href="#"','<a href="#" style="display:none;"');
    var windowReport = window.open('','_blank');
    windowReport.document.write(content);
    //The below is causing issues while viewing another abstract after PRINT. Need to revisit this. 
    //windowReport.focus();
    //windowReport.document.execCommand('print', false, null);
	return; 
}

/** Below functions are added to "enhance" page performance. Date created: 03/03/2014 **/ 

/**Added newly for common clone method:*/
function cloneDataRowHelper(trClone, accVioType, otherCategory , accVioList ,typeString ,driverId ,nextRowHeader ,incidentIndex ,selectEdDt ,selectedValue ,accVioId ,accVioDesc, selectedState , isUnassigned, selectedSource ,driverOnReport, accVioExcludeReason,accidentId)  {
		//TODO: can be done in a better way w.r.t to spanType
		var spanType;
		var dateType;
		var typePrefix;
		var accvioDescCode;
		var namePrefix = 'accidentViolationList['+accVioList+'].'+typeString+'['+incidentIndex+']';
		var idPrefix = 'accidentViolationList'+accVioList+'.'+typeString+incidentIndex;
		var excludeReasonId;
		
		if(accVioType == 'Accident'){
			trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Accident');
			trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue(getDriverTypeCode(selectedValue));
			trClone.find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue(getDriverTypeCode(selectedValue));
			spanType = 'acc' ;
			typePrefix ='accident';
			dateType = 'accidentDate';
			accvioDescCode="accidentDesc";
		} else if(accVioType.toLowerCase()=='compclaim'){
			trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('COMPCLAIM');
			trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').setValue('C'); 
			trClone.find('td.assigned_driver span.id_drv_type2 input[type=hidden]').setValue('C');
			trClone.find('td.assigned_driver  span.disp_drv select').prop('disabled',true);
			trClone.find('td.typeAccVio span.disp_drv select').prop('disabled',true);
			spanType = 'acc';
			typePrefix ="accident";
			dateType = 'accidentDate';
			accvioDescCode="accidentDesc";
		} else {
			//REVISIT LATER.... 
			trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Violation');	
			spanType ='vio';
			typePrefix ='violation';
			dateType = 'violationDt';
			accvioDescCode="violationDescCd";
		}
		
		trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('id',idPrefix+'.driverTypeCd');
		trClone.find('td.assigned_driver span.id_drv_type input[type=hidden]').attr('name',namePrefix+'.driverTypeCd');
		
		//driverId  
		trClone.find("td.assigned_driver span.disp_drv select").prop('id',nextRowHeader+'_assignedDriver');
		trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('name',namePrefix+'.driverId');
		trClone.find('td.assigned_driver span.id_disp input[type=hidden]').attr('id',idPrefix+'.driverId');
		trClone.find('td.assigned_driver span.id_disp input[type=hidden]').setValue(driverId);
        
		//dirverAccidentIndex
		trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('name','driverAccidentIndex');
		trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').attr('id','driverAccidentIndex');
		trClone.find('td.assigned_driver span.driverAccidentIndex input[type=hidden]').setValue(accVioList);
		
		if($('#endorsementMode').val() == 'true'){
		   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('name',namePrefix+'.addedInEndorsementInd');
		   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').attr('id',idPrefix+'.addedInEndorsementInd');
		   trClone.find('td.assigned_driver span.addedInEndtInd input[type=hidden]').setValue('Yes');
		}
		
		isUnassigned = isUnassigned!=null?isUnassigned:false;
		
		//Fix : if the add is is for UnAssigned Driver then it has to be datasource as from the selectedSource else Client
		var dataSourceText =  isUnassigned ? selectedSource : 'Client' ;
		var status = '';
		if(isUnassigned && dataSourceText=='Client'){
			status = 'unassignedclient';
		} else if(dataSourceText=='Client'){
			status = 'client';
		} else if(isUnassigned){
			status = 'unassigned';
		}
		//Fix : if the add is is for UnAssigned Driver then it has to be text else it is input/ Select
		var selectorSelect =  status.indexOf('unassigned')!=-1 ? '' : ' select';
		var selectorInput  =  status=='unassigned' ? '' : ' input';

		//violation or loss date  // Fix : if the add is is for  UnAssigned Driver  then it has to be text else it is input
		trClone.find('td.display_date span.disp_drv '+selectorInput).prop('id',nextRowHeader+'_accVioDt');
		trClone.find('td.display_date span.id_disp input[type=hidden]').attr('id',idPrefix+'.'+dateType);
		trClone.find('td.display_date span.id_disp input[type=hidden]').attr('name',namePrefix+'.'+dateType);
		trClone.find('td.display_date span.id_disp input[type=hidden]').setValue(selectEdDt);

		//type // Fix : if the add is is for  UnAssigned Driver  then it has to be text else it is select
		trClone.find("td.display_type span.disp_drv "+selectorSelect).prop('id',nextRowHeader+'_accVioType');
		trClone.find('td.display_type span.id_disp input[type=hidden]').attr('id',idPrefix+'.type');
		trClone.find('td.display_type span.id_disp input[type=hidden]').attr('name',namePrefix+'.type');
		//trClone.find('td.display_type span.id_disp input[type=hidden]').setValue('Violation'); //update

		//description Id // Fix : if the add is is for  UnAssigned Driver  then it has to be text else it is select
		trClone.find('td.display_desc span.disp_drv '+selectorSelect).prop('id',nextRowHeader+'_accVioDesc');
		trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('id',idPrefix+'.'+typePrefix+'DescId');
		trClone.find('td.display_desc span.id_disp_id input[type=hidden]').attr('name',namePrefix+'.'+typePrefix+'DescId');
		trClone.find('td.display_desc span.id_disp_id input[type=hidden]').setValue(accVioId);
		
		//desc code
		trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('id',idPrefix+'.'+accvioDescCode);
		trClone.find('td.display_desc span.id_desc_text input[type=hidden]').attr('name',namePrefix+'.'+accvioDescCode);
		trClone.find('td.display_desc span.id_desc_text input[type=hidden]').setValue(processAccVioDesc(accVioDesc));

		//state // Fix : if the add is is for  UnAssigned Driver  then it has to be text else it is select
		trClone.find("td.display_state span.disp_drv "+selectorSelect).prop('id',nextRowHeader+'_accVioState');
		trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('id',idPrefix+'.'+typePrefix+'StateCd');
		trClone.find('td.display_state span.id_disp_id input[type=hidden]').attr('name',namePrefix+'.'+typePrefix+'StateCd');
		trClone.find('td.display_state span.id_disp_id input[type=hidden]').setValue(selectedState);

		// stick id's ? what is this doing...
		trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').attr('id',idPrefix+'.'+typePrefix+'Id');
		trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').attr('name',namePrefix+'.'+typePrefix+'Id');
		trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').setValue("");

		//source //TODO  datasource should be different incase of add unassiged Drivers:  "selectedSource"
		trClone.find('td.display_datasource span.disp_dd').text(dataSourceText);
		trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('id',idPrefix+'.dataSourceCd');
		trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').attr('name',namePrefix+'.dataSourceCd');
		trClone.find('td.display_datasource span.id_disp_dd input[type=hidden]').setValue(dataSourceText);

		//operation
		trClone.find('td.display_state span.ex_re input[type=hidden]').attr('id',idPrefix+'.operation');
		trClone.find('td.display_state span.ex_re input[type=hidden]').attr('name',namePrefix+'.operation');

		if(dataSourceText == 'Client') {		
			trClone.find("td.display_type span.disp_drv "+selectorSelect).prop('disabled',true).trigger('chosen:updated');
			trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','deleteDriver_'+spanType+'_'+driverId+'_'+accVioList+'_'+incidentIndex);
			trClone.find('td.exclude_reason span.exclude_dd_reason').addClass('textInblueDeleteDriver');			
			if(!isUnassigned){
				trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('Add');
			} else{
				// accident ID
				trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').attr('id', idPrefix+'.'+typePrefix+'Id');
				trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').attr('name',namePrefix+'.'+typePrefix+'Id');
				trClone.find('td.display_desc span.'+spanType+'_id input[type=hidden]').setValue(accidentId);
			}
			if(isEndorsement()){
				trClone.find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('id',idPrefix+'.'+'excludeIndicator');
				trClone.find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('name',namePrefix+'.'+'excludeIndicator');
				trClone.find('td.exclude_reason span.id_disp input[type=hidden]').attr('id',idPrefix+'.'+'excludeReasonCd');
				trClone.find('td.exclude_reason span.id_disp input[type=hidden]').attr('name',namePrefix+'.'+'excludeReasonCd');
			}
		} else {			
			// accident ID
			trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('id', idPrefix+'.accidentId');
			trClone.find('td.display_desc span.acc_id input[type=hidden]').attr('name',namePrefix+'.accidentId');
			trClone.find('td.display_desc span.acc_id input[type=hidden]').setValue(accidentId);
			
			//driver on report for unassigned
			driverOnReport = processDriverOnReport(driverOnReport);

			trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").text(driverOnReport);
		    trClone.find("td.assigned_driver span.disp_drv span.emptyDriverOnReportSpan").removeClass('emptyDriverOnReportSpan').addClass('driverOnReportSpan');
		   
		    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('id', idPrefix+'.driverName');
		    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').attr('name', namePrefix+'.driverName');
		    trClone.find('td.assigned_driver span.disp_drv span.id_disp_drv_on_report input[type=hidden]').setValue(driverOnReport.replace('None','').replace('/','').replace(/^\s+|\s+$/g,''));
		   
		    //exclude reason Delete Link			
			excludeReasonId = appendOtherToStringIfApplicable(otherCategory,'excludeDriver_' + spanType + '_' + driverId + '_' + accVioList + '_' + incidentIndex);
		    trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id',excludeReasonId);
			trClone.find('td.exclude_reason span.exclude_dd_reason select').prop('id',nextRowHeader+'_accVioExcludeReason');
			trClone.find('td.exclude_reason span.id_disp input[type=hidden]').attr('id', idPrefix+'.excludeReasonCd');
			trClone.find('td.exclude_reason span.id_disp input[type=hidden]').attr('name', namePrefix+'.excludeReasonCd');
			trClone.find('td.exclude_reason span.id_disp input[type=hidden]').setValue(accVioExcludeReason);
			
			trClone.find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('id', idPrefix+'.excludeIndicator');
			trClone.find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').attr('name', namePrefix+'.excludeIndicator');
			trClone.find('td.exclude_reason span.exclude_dd_reason input[type=hidden]').setValue(getExcludeIndicatorValue(accVioExcludeReason));
			
			trClone.find('td.display_state span.ex_re input[type=hidden]').setValue('');			
		}		
	}

	function copyDataToClonedRow(accVioType, nextRowHeader, otherCategory , selectedValue , driverId , selectEdDt, accVioDescId , selectedState, isUnassigned, accVioExcludeReason,accVioSource) {
		$('tr#'+nextRowHeader).each( function() {
			//remove any dropdown containers if existing.
			 $(this).find('div[id$="_chosen"]').remove();
		});	
	
		// Create the dropdown plugin for select menus:
		$("tr#"+nextRowHeader).find('select').each(function() {
		    addChosen(this.id);		
		});	
		
		if(otherCategory){
			if(accVioType.toLowerCase() == 'compclaim'){
				$('#'+nextRowHeader+'_assignedDriver').val('No Driver-Comp Clm').prop('disabled', true).trigger('chosen:updated');
			}else{
				if(!($("tr#"+nextRowHeader).find('td.assigned_driver select'+' option[val="No Driver or Friend/Relative"]').length > 0)){
					$("tr#"+nextRowHeader).find('td.assigned_driver select').append('<option value="No Driver or Friend/Relative">No Driver or Friend/Relative</option>').trigger('chosen:updated');
				}
				
				$('#'+nextRowHeader+'_assignedDriver').val(selectedValue).trigger('chosen:updated');
			}
		} else{
			$('#'+nextRowHeader+'_assignedDriver').val(driverId).trigger('chosen:updated');
		} 
		if(isUnassigned && accVioSource!=null && accVioSource!='Client') {
			// FOR UN ASSGINED DRIVERS ADD, the values are set at Text.( not dropdwons for certain fields).
			$('#'+nextRowHeader+'_accVioDt').text(selectEdDt);
			$('#'+nextRowHeader+'_accVioType').text(accVioType);
			$('#'+nextRowHeader+'_accVioDesc').text(accVioDescId);
			$('#'+nextRowHeader+'_accVioState').text(selectedState);
			$('#'+nextRowHeader+'_accVioExcludeReason').val(accVioExcludeReason).trigger('chosen:updated');	
		} else {
			//Unassigned manual record - (driver deleted)
			if(accVioSource=='Client'){
				$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
				$('#'+nextRowHeader+'_accVioType').find('select').val(accVioType).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioDesc').find('select').val(accVioDescId).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioState').find('select').val(selectedState).trigger('chosen:updated');	
			} else{
				$('#'+nextRowHeader+'_accVioDt').val(selectEdDt);
				$('#'+nextRowHeader+'_accVioType').val(accVioType).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioDesc').val(accVioDescId).trigger('chosen:updated');
				$('#'+nextRowHeader+'_accVioState').val(selectedState).trigger('chosen:updated');	
				//45776 - Image is not loading correctly in Endorsement mode.
				$('#'+nextRowHeader+'_accVioDt').datepicker({
					showOn: "button",buttonImage: "/aiui/resources/images/cal_icon.png",buttonImageOnly: true,buttonText : 'Open calendar' ,
					dateFormat: 'mm/dd/yy',showButtonPanel : true		
				});	
			}
			
			//Added this for TD 46523 tab order fix
			$('#'+nextRowHeader+'_assignedDriver').addClass("tabOrder");
			$('#'+nextRowHeader+'_accVioDt').addClass("tabOrder");
			$('#'+nextRowHeader+'_accVioType').addClass("tabOrder");
			$('#'+nextRowHeader+'_accVioDesc').addClass("tabOrder");
			$('#'+nextRowHeader+'_accVioState').addClass("tabOrder");
			$('.accVioAddSaveCancelBtn').addClass("tabOrder");
			
		}
		highlightRow(nextRowHeader);
		resetAddDefaultSelections();
}

function cloneErrorRowHelper(type, driverId ,accVioList ,index) {
	//REVISIT FOR A BETTER APPROACH TO CLONE THE ERROR ROW.
	var errorRowTemplate = $("#saveCancel_btn_"+(type=='vio'?'vio':'acc')).clone();
	var prefix =  type+'_'+driverId+'_'+accVioList+'_'+index ;
	errorRowTemplate.find('button').prop('id','modify_*'+prefix);
	errorRowTemplate.find('td.assignedDriver_Error_Col').prop('id', prefix +'_assignedDriver_Error_Col');
	errorRowTemplate.find('td.accVioDt_Error_Col').prop('id', prefix +'_accVioDt_Error_Col');
	errorRowTemplate.find('td.edType_Error_Col').prop('id', prefix +'_edType_Error_Col');
	errorRowTemplate.find('td.accVioDesc_Error_Col').prop('id', prefix +'_accVioDesc_Error_Col');
	errorRowTemplate.find('td.accVioState_Error_Col').prop('id', prefix +'_accVioState_Error_Col');
	return  errorRowTemplate ;
}

/**ENABLE ALL ELEMENTS IN ALL ROWS AFTER SAVE OR CANCEL OR ADD UNASSIGNED FUNCTIONS.
	DISABLE OTHER ELEMENTS IF ROW IS CLICKED*/
function enableRows(isEnable) {
	$("#accVioTabl tr.display_mode").each( function() {		
        if($(this).hasClass("editingrow") && !isEnable ) {			
			return;
		}	
        //Date-picker functionality is disabled for now. Need to revisit this
        //var rowId = this.id; $('#' + rowId + '_accVioDt').datepicker('destroy');
        if(!isEnable){
        	$(this).find('input.clsAccVioDate').datepicker('destroy');
        }        
		//This is required. When a row is being edited, CLICK of any other row shouldn't be allowed
        $(this).prop('disabled', !isEnable);
        $(this).find("select").prop('disabled', !isEnable).trigger('chosen:updated');
		$(this).find("input:not(:hidden)").prop('disabled', !isEnable);
		
		if(isEnable) {
			var selectedDriverElement = $(this).find("select.selected_driver_class");
			if($(selectedDriverElement)!=null && $(selectedDriverElement).val()=='No Driver-Comp Clm'){
				//disable the driver if its No Driver-Comp Claim.
				$(selectedDriverElement).prop('disabled', true).trigger('chosen:updated');
			}
			//disable types for all rows. Defect 35237
			$(this).find("select.typeAccVio").prop('disabled',true).trigger('chosen:updated');
		}		
	});
	if(isEnable) {
		$(".clsAccVioDate").datepicker({
			showOn : "button",
			buttonImage : "/aiui/resources/images/cal_icon.png",
			buttonImageOnly : true,
			buttonText : 'Open calendar',
			dateFormat : 'mm/dd/yy',
			showButtonPanel : true,
			onSelect: function () {
				$(this).closest('td').find('span.id_disp input[type=hidden]').val($(this).val());
			}
		});
	}
}

function isOtherType(driverName){
	if(driverName=='No Driver or Friend/Relative' || driverName=='No Driver-Comp Clm' 
			|| driverName=='Unknown Driver' || driverName=='Deceased HH Member') {
		return true;
	} 
	return false;
} 

function getDriverTypeCode(driverName) {
	if (driverName=='No Driver or Friend/Relative') { return 'F'; } 
	else if (driverName=='No Driver-Comp Clm') { return 'C'; } 
	else if (driverName=='Unknown Driver') { return 'K'; } 
	else if (driverName=='Deceased HH Member') { return 'H'; }
	else if (driverName=='Select' && isEndorsement()) { return 'U'; }
	return 'A';
} 

function enableExcludeReasons(isEnable,rowId_delNew,rowId_delNew2){
	$('span.exclude_dd_reason').each(function(event) {
		if(isEnable || ($(this).attr('id')!=rowId_delNew && $(this).attr('id')!=rowId_delNew2)){
			$(this).find('select').prop('disabled',!isEnable).trigger('chosen:updated');
			$(this).prop('disabled',!isEnable).trigger('chosen:updated');
		}
	});
}

function getExcludeIndicatorValue(accVioExcludeReason){
	if(accVioExcludeReason=='' || accVioExcludeReason==null){
		return 'No';
	} else if(accVioExcludeReason!=null && accVioExcludeReason.toLowerCase()!='none'
			&& accVioExcludeReason.toLowerCase()!=''){
		return 'Yes';
	}
	return 'No';
}

function appendOtherToStringIfApplicable(otherCategory,inputString){
	return otherCategory?('other_'+inputString):inputString;
}

function getDriverRowFilter(otherCategory,driverId){
	return otherCategory?"other_driver_row":("driver_row_"+driverId);
}

function showDriverOrOtherRow(otherCategory,driverId){
	if(otherCategory){ 
		$("#other_driver_row").show(); 
	} else { 
		$("#driver_row_"+driverId).show(); 
	}	
}

function isValueBlankOrSelect(inputElem){
	return (inputElem.value=="" || inputElem.value=="Select") ;
}

function getMaxAccVioId(accVioType,driverId,driverIndexNum,currentAccVioIndex){
	var idArrayAcc = [];
	$("tr[id*="+accVioType+"_" +driverId+'_'+driverIndexNum+'_' +"]").each( function() {
	       var splitIdArray = $(this).attr('id').split('_');
	       idArrayAcc.push(splitIdArray[splitIdArray.length - 1]);
	});
	var maxAccId = (idArrayAcc.sort(function(a,b){return b-a;})[0]);
	if(parseInt(maxAccId) >= 0){
		currentAccVioIndex = parseInt(maxAccId) + 1;
	}
	return currentAccVioIndex;
}

function closeAccVioErrorModal(){
	$.unblockUI();
	if($('div.incompletePageModal').css('display')=='block'){
		$('div.incompletePageModal').hide();
		return false;
	}	
	return true;
}

function clearRowErrors(closestTr){
	$(closestTr).find('td span.inlineErrorMsg').text('');
	$(closestTr).prev().find('select.inlineError').removeClass('inlineError').trigger('chosen:styleUpdated');
	$(closestTr).prev().find('input.inlineError').removeClass('inlineError').trigger('chosen:styleUpdated');
}	

function processDriverOnReport(driverOnReport){
	if(driverOnReport==null || $.trim(driverOnReport)==''){
		return '';
	}
	driverOnReport = driverOnReport.toUpperCase();
	if(driverOnReport.indexOf('/')==-1){
		driverOnReport = ' / '+driverOnReport;	
	}
	return driverOnReport;
}

function processAccVioDesc(accVioDesc){
	if(accVioDesc==null || accVioDesc.indexOf('_')==-1){
		return accVioDesc;
	}
	return (accVioDesc.split('_'))[1];
}

/**Modified View-Removed-Duplicates to use javascript instead of loading whole page - 04/25/2014*/
function addIncidentToRemovedList(deletedIncident){
	var driverId = $(deletedIncident).find('td.assigned_driver span.id_disp input').val();
	var trClone = $('.removed_Incident').clone();
	var id='rem_'+$(deletedIncident).attr('id');
	var otherCategory = false;
	var unassigned =  false;
	var driverName = $(deletedIncident).find('td.assigned_driver span.disp_drv select').find(":selected").text();
	var driverNameFull = $(deletedIncident).find('td.assigned_driver span.disp_drv select').find(":selected").text();
	
	if(driverNameFull!=null && driverNameFull.indexOf('Select')!=-1){
		driverNameFull = 'Unassigned Drivers';
		driverName='';
		unassigned =  true;
	}
	if(driverName!=null && driverName.indexOf('#')!=-1 && driverName.indexOf(' ')!=-1){
		driverName = $.trim(driverName.replace('#','').replace(/[0-9]/,''));
	}
	if(driverNameFull!=null && driverNameFull.indexOf('No Driver')!=-1){
		driverNameFull = 'Other';
		otherCategory = true;
	}
	
	trClone.addClass('display_mode').removeClass('removed_Incident');
	trClone.find('td.assigned_driver span.disp_drv').text(driverName);
	trClone.find('td.display_date span.disp_drv').text($(deletedIncident).find('td.display_date span.id_disp input').val());
	trClone.find('td.display_desc span.disp_drv').text($(deletedIncident).find('td.display_desc span.id_desc_text input').val());
	trClone.find('td.display_removed_reason span.disp_dd').text('Agent Removed');
	trClone.find('td.exclude_reason span.exclude_dd_reason').attr('id','addBackDriver_'+$(deletedIncident).attr('id'));
	trClone.find('td.exclude_reason span.exclude_dd_reason input').val($(deletedIncident).find('td.exclude_reason span.exclude_dd_reason input').val());
	trClone.find('td.exclude_reason span.ex_re input').val($(deletedIncident).find('td.display_state span.ex_re input').val());
	trClone.find('td.exclude_reason span.ex_re2 input').val('New');
	$(trClone).attr('id',id);
	
	if(!otherCategory && !unassigned){
		if($('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_acc_'+driverId+']:last').length>0){
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_acc_'+driverId+']:last').after(trClone);
		} else if($('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_vio_'+driverId+']:last').length>0){
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_vio_'+driverId+']:last').after(trClone);
		}  else{
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody').append('<tr class="HeaderRowColWidth"><td colspan="6" class="rowHeaderClass">'+driverNameFull+'</td></tr><tr id='+id+'>'+trClone.html()+'</tr>');
		}
	}else if(unassigned){	
		if($('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_unassigned_acc_'+driverId+']:last').length>0){
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_unassigned_acc_'+driverId+']:last').after(trClone);
		} else if($('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_unassigned_vio_'+driverId+']:last').length>0){
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_unassigned_vio_'+driverId+']:last').after(trClone);
		} else{
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody').append('<tr class="HeaderRowColWidth"><td colspan="6" class="rowHeaderClass">'+driverNameFull+'</td></tr><tr id='+id+'>'+trClone.html()+'</tr>');
		}
	} else{
		if($('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_other_acc_'+driverId+']:last').length>0){
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody tr[id^=rem_other_acc_'+driverId+']:last').after(trClone);
		} else{
			$('#viewDeletedAccVio').find('table#removeAccVioTabl tbody').append('<tr class="HeaderRowColWidth"><td colspan="6" class="rowHeaderClass">'+driverNameFull+'</td></tr><tr id='+id+'>'+trClone.html()+'</tr>');
		}
	}
	$(trClone).show();
}

/**Modified abstract calls to use ajax instead of loading whole page - 04/25/2014*/
function callOfflineAbstractService(serviceURL,abstractDiv,headerDiv){
	blockUser();
	$('div#viewAccVioThirdPartyReportLinks').hide();
	$.ajax({
        headers: {
            'Accept': 'text/html',
            'Content-Type': 'text/html'
        },
        url: serviceURL,
        type: "GET",
        timeout: 30000,
        //06/05 - IE8 is fetching the previous data because of caching
        cache: false,
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){
        	$(abstractDiv).find('div.resizePush div').html(response);
        	$(abstractDiv).find('td.headerSectionAbstract').html(headerDiv);
        	$(abstractDiv).modal();
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	$('div.failedAbstractCall').modal();
        },
        complete: function(){
        	$.unblockUI();
        }
    });
}

function emptyOutViewRemovedModalIfApplicable(){
	if($("#removeAccVioTabl tr[id*='rem_acc_']").length==0 
			&& $("#removeAccVioTabl tr[id*='rem_vio_']").length==0
			&& $("#removeAccVioTabl tr[id*='rem_other_acc_']").length==0
			&& $("#removeAccVioTabl tr[id*='rem_other_vio_']").length==0
			&& $("#removeAccVioTabl tr[id*='rem_unassigned_acc_']").length==0
			&& $("#removeAccVioTabl tr[id*='rem_unassigned_vio_']").length==0){
		$('span#viewRemovedAccidentsAndViolationsLink').hide();
		$('span#pipeSeparatorSpan').hide();
		$('table#removeAccVioTabl').find('tr.HeaderRowColWidth').each(function(){
			$(this).hide();
		});
	}
}

function hideTemplateRows(){
	$('tr#empty_acc_display_mode').hide();
	$('tr#empty_vio_display_mode').hide();
	$('tr#empty_com_display_mode').hide();
	$('tr#empty_unassigned_acc_display_mode').hide();
	$('tr#empty_unassigned_vio_display_mode').hide();
	$('tr#empty_unassigned_com_display_mode').hide();
	$('.disp_drv_standby').hide();
	$('#deletedAccVio').hide();			
	if($('#addAccVio').css('display')!='none' 
		&& $('#addAccVioDisable').css('display')!='none'){
		$('#addAccVioDisable').hide();	
	}	
}

function checkIfIncidentsExist(){
	var accVioCount = parseInt($('#accVioList_Count').val());
	var driverIncidentExistInd = $('#driverIncidentExistInd').val();
	var isSummaryTabVisitied = $('#transactionProgress').val()>6;	
	if ($('input.accVioPopup[value=true]').length==0) {
		if($('#newBusinessMode').val() == 'true'){
			if (accVioCount == 0 && $('#fromPrefill').val() == 'false' && $('#notOrderedFlag').val() == 'true' && $('#userAthorizedToOrder').val() == 'false'){
				$('#manualView').hide();
				if(driverIncidentExistInd == 'Yes' || isSummaryTabVisitied){
					$("#accVioYes").prop('checked', true);
					$('input[id=anyAccVioLast5YrsHidden]').val('Yes');
					$('#accVioAddTable').show();
					$('#manualViewDescTableId').show();
					//48447
					if(isSummaryTabVisitied){
						$('input[name=hasAccVio]').attr('disabled', 'disabled');
					}
				}else{
					$("#accVioNo").prop('checked', true);
					$('input[id=anyAccVioLast5YrsHidden]').val('No');
					$('input[name=hasAccVio]').removeAttr('disabled');
					$('#accVioAddTable').hide();
					$('#manualViewDescTableId').hide();
				}
				$('#reportStatusDetailsSpan').hide();
				$('#reportsTableId').hide();
				$('#reportsMessageTableId').hide();
			} else{
				var varIsMVRInitialOrderComplete = isMVRInitialOrderComplete(); 
				var varIsCLUEInitialOrderComplete = $('#clueOrderStatus').val()=='Successful' || $('#clueOrderStatus').val()=='Successful-No Data';
				//47860 - Acc/Vio - No Activity Incorrect View for Successful-No Data scenario
				if(accVioCount > 0 
						|| varIsMVRInitialOrderComplete
						|| varIsCLUEInitialOrderComplete){
					$("#accVioYes").prop('checked', true);
					$('input[id=anyAccVioLast5YrsHidden]').val('Yes');
					$('input[name=hasAccVio]').attr('disabled', 'disabled');
					$('#manualView').show();
					$('#accVioAddTable').show();
					$('#manualViewDescTableId').show();
					$('#reportStatusDetailsSpan').show();
					$('#reportsTableId').show();
					$('#reportsMessageTableId').show();
				}else{
					//47563-NBS REGRESSION - Order Reports button doesn't display for spinoff policies
					var policySOB = $('#sourceOfBusinessCode').val();
					if(driverIncidentExistInd == 'Yes' 
						|| policySOB=='EXIST_SPIN'
						|| isSummaryTabVisitied){
							$("#accVioYes").prop('checked', true);
							$('input[id=anyAccVioLast5YrsHidden]').val('Yes');
							$('#manualView').show();
							$('#accVioAddTable').show();
							$('#manualViewDescTableId').show();
							$('#reportStatusDetailsSpan').show();
							$('#reportsTableId').show();
							$('#reportsMessageTableId').show();							
					}else{
						$("#accVioNo").prop('checked', true);
						$('input[id=anyAccVioLast5YrsHidden]').val('No');
						$('#manualView').hide();
						$('#accVioAddTable').hide();
						$('#manualViewDescTableId').hide();
						$('#reportStatusDetailsSpan').hide();
						$('#reportsTableId').hide();
						$('#reportsMessageTableId').hide();
					}
					$('input[name=hasAccVio]').removeAttr('disabled');
				}				
			}
		}else{
			if($('#newDriversExistForEndorsement').val()!='true' 
					&& $('input[class=clsEndorsementDriverAddedInd][value=Yes],input[class=clsEndorsementExistingDriverRatedInd][value=Yes]').length>0){
				//This is also set from tabController. But if no rated driver exists, it is not set there.
				$('#newDriversExistForEndorsement').val('true');
			}
			$('#hasAnyDriversMsgsTrId').show();
			if($('#newEndorsementRatedDriver').val() == 'true' || 
					$('#newDriversExistForEndorsement').val() == 'true'){
				$('#manualView').show();
				$('#accVioAddTable').show();
				$('#manualViewDescTableId').show();
				if($('#newDriversExistForEndorsement').val() == 'true'){
					//$("#accVioNo").prop('checked', true);
					//$('input[name=hasAccVio]').removeAttr('disabled');
					$('#addAccVioDisable').hide();
					$('#addAccVio').show();
					$('#manualMsgSpan').show();
					if($('#newEndorsementRatedDriver').val() == 'true'){
						$('#reportStatusDetailsSpan').show();
						$('#reportsTableId').show();
						$('#reportsMessageTableId').show();
					}else{
						$('#reportStatusDetailsSpan').hide();
						$('#reportsTableId').hide();
						$('#reportsMessageTableId').hide();
					}
				}else{
					//$("#accVioYes").prop('checked', true);
					$('#addAccVioDisable').show();
					$('#manualMsgSpan').hide();
					$('#addAccVio').hide();
					$('#reportStatusDetailsSpan').hide();
					$('#reportsTableId').hide();
					$('#reportsMessageTableId').hide();
				}				
			} else {
				$('#accVioAddTable').show();
				$('#addAccVioDisable').show();
				$('#addAccVio').hide();
				$('#manualViewDescTableId').show();
				$('#manualMsgSpan').hide();
				$('#reportStatusDetailsSpan').hide();
				$('#reportsTableId').hide();
				$('#reportsMessageTableId').hide();
				if(accVioCount == 0){
					$('#manualView').hide();
				}else{
					$('#manualView').show();					
				}
			}
		}
	} else {
		$('input[name=hasAccVio]').attr('disabled', 'disabled');
		if ($('input[name=hasAccVio]').val() == 'No') {
			$("#accVioNo").prop('checked', true);
		} else if ($('input[name=hasAccVio]').val() == 'Yes') {
			$("#accVioYes").prop('checked', true);
		}
	}

	//2.4: Question shouldn't show for MA. Make it YES always.
	if($('#stateCd').val()=='MA'){
		$('#accVioAddTable').show();
		//Fix for 54946
		if(!isEndorsement()){
			$('#addAccVioDisable').hide();
			$('#addAccVio').show();
		}
		$('#manualViewDescTableId').show();
		//The 'Order Reports' button will always display on the page.
		$('#reportStatusDetailsSpan').show();
		$('#reportsTableId').show();
		$('#reportsMessageTableId').show();
	}
}

function showCleanDirtyModals(){
	if($('#orderThirdPartyResponseClean').val() == 'true'){
		if($('#udrReturned').val()=='true'){
			$('#accVioCleanInfoWithUDRModal').modal();
			refreshRateButton();
		} else{
			//TD# 73203
			if($("#accVioUDRModelPoppedUpInd").val()!="Yes"){
				$('#accVioCleanInfoModal').modal();	
			}
		}
	}
	if($('#orderThirdPartyResponseReview').val() == 'true'){
		if($('#udrReturned').val()=='true'){
			$('#accVioReviewInfoWithUDRModal').modal();
		} else{
			$('#accVioReviewInfoModal').modal();
		}
		refreshRateButton();
	}
}

function verifyDateYear(dateObj){
	var currentDate = new XDate().toString('MM/dd/yyyy');
	var current_year = parseInt(currentDate.split("/")[2]);
	var year = parseInt($(dateObj).val().split("/")[2]);
	if(year < 1900 || year > current_year){
		return false;
	}else
		return true;
}
