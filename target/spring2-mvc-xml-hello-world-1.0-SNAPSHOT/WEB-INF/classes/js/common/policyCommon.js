//Note:This is a common file for driver, prefill, vehicle, Application etc..
//STATE CONSTANTS
var STATE_MA = 'MA';
var STATE_NJ = 'NJ';
var STATE_CT = 'CT';
var STATE_NY = 'NY';
var STATE_PA = 'PA';
var STATE_RI = 'RI';
var STATE_NH = 'NH';
var STATE_CANADA = 'CDA';
var STATE_OTHER_FOREIGN = 'FI';

var YES = 'Yes';
var NO = 'No';

//STATUS CONSTANTS
var ACTIVE = 'A';
var ACTIVE_MA = 'ACT';
var SUSPENDED_LICENSE = 'S';
var SUSPENDED_LICENSE_MA = 'SUS';
var REVOKED_LICENSE = 'R';
var REVOKED_LICENSE_MA = 'REV';
var EXPIRED_LICENSE = 'E';
var EXPIRED_LICENSE_MA = 'EXP';
var NEVER_LICENSED_3CHAR = 'NEV';
var NEVER_LICENSED = 'NEV_LIC';
var NO_LONGER_LICENSED = 'NLL';
var PERMIT = 'P';
var CANCELLED = 'C';
var CANCELLED_MA = 'CAN';
var DENIED = 'D';
var DENIED_MA = 'DEN';

var INSURED_ON_THIS_POLICY = 'INS_POL';
var INSURED_ON_ANOTHER_PRAC = 'Y';
var INSURED_ELSE_WHERE = 'W';
var AWAY_IN_ACTV_SERVC = 'N';
var REVOKED_OPERATOR = 'RO';
var SUSPENDED_OPERATOR = 'R';

var NOT_LICENSED = "NLL";

//55293-CC 464- 
var EXPIRED_MA_LICENSE = 'X';
var NEVER_MA_LICENSED = 'N';
var NO_LONGER_MA_LICENSED = 'NL';

var DRIVERS_PER_PAGE = 3;
var VEHICLES_PER_PAGE = 3;

function getFieldIndex(id) {
	return parseInt(id.substring(id.lastIndexOf("_") + 1));
}

function slideDriverStart(event, parentDiv) {
	
	slideToStart(event, $('.slidingFrame', parentDiv), $('#firstDriver'));
	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverLeft(event, parentDiv) {
	
	slideTableLeft(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstDriver'), parseInt($('#driverCount').val()), 1);
	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverRight(event, parentDiv) {
	
	slideTableRight(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstDriver'), parseInt($('#driverCount').val()), DRIVERS_PER_PAGE, 1);
	updateDriverScrollPanel( $(event.target).parent());
}

function slideDriverEnd(event, parentDiv) {
	
	slideToEnd(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstDriver'), $('#driverCount'), DRIVERS_PER_PAGE);
	updateDriverScrollPanel( $(event.target).parent());
}


function slideVehicleStart(event, parentDiv) {
	
	slideToStart(event, $('.slidingFrame', parentDiv), $('#firstVehicle'));
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideVehicleLeft(event, parentDiv) {
	
	slideTableLeft(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), 1);
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideVehicleRight(event, parentDiv) {
	
	slideTableRight(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstVehicle'), parseInt($('#vehicleCount').val()), VEHICLES_PER_PAGE, 1);
	updateVehicleScrollPanel( $(event.target).parent());
}

function slideVehicleEnd(event, parentDiv) {
	
	slideToEnd(event, $('.slidingFrame', parentDiv), $('.slidingTable', parentDiv),
			$('#firstVehicle'), $('#vehicleCount'), VEHICLES_PER_PAGE);
	updateVehicleScrollPanel( $(event.target).parent());
}


function updateScrollPanel(scrollPanel, firstColumnSel, columnCountSel, perPage,
		singleTag, multiTag) {
	var firstColumn = parseInt($(firstColumnSel).val());
	var range = singleTag + ' ' + firstColumn;
	
	var columnCount = parseInt($(columnCountSel).val());
	var lastColumn = Math.min(columnCount, (firstColumn + (perPage - 1)));
	if (lastColumn > 1) {
		range = multiTag + ' ' + firstColumn + ' - ' + lastColumn;
	}
	
	var $scrollPanel = $(scrollPanel);
	$('#scrollPos', $scrollPanel).html(range + ' of ' + columnCount);
	
	if (columnCount > perPage) {
		$('#scrollPanel').removeClass('hidden');
		//$scrollPanel.removeClass('hidden');
	} else {
		$('#scrollPanel').addClass('hidden');
		//$scrollPanel.addClass('hidden');
	}
}


function updateDriverScrollPanel(scrollPanel) {
	updateScrollPanel(scrollPanel, '#firstDriver', '#driverCount', VEHICLES_PER_PAGE,
			'Driver', 'Drivers');
}
/** tjmcd - Original from driverTab.js
 * 
function updateDriverScrollPanel() {
	
	var firstDriver = parseInt($('#firstDriver').val());
	var driverRange =  'Driver ' + firstDriver;
	var driverCount = parseInt($('#driverCount').val());
	var lastDriver =  Math.min(driverCount, (firstDriver + (DRIVERS_PER_PAGE - 1)));
	
	showOrHideHtml('#scrollPanel', 'hide');
	
	if (lastDriver > 1) {
		driverRange = 'Drivers ' + firstDriver + ' - ' + lastDriver;
	}
	
	if (driverCount > DRIVERS_PER_PAGE) {
		showOrHideHtml('#scrollPanel', 'show');
		$('#scrollPos').html(driverRange + ' of ' + driverCount);
	}
}
**/

function updateVehicleScrollPanel(scrollPanel) {
	updateScrollPanel(scrollPanel, '#firstVehicle', '#vehicleCount', VEHICLES_PER_PAGE,
			'Vehicle', 'Vehicles');
}


function updateCoverageScrollPanel(scrollPanel) {
	updateScrollPanel(scrollPanel, '#firstCoverage', '#coverageCount', COVERAGES_PER_PAGE,
			'Vehicle', 'Vehicles');
}


function setupFloodingFields(floodingSelector) {
	$(floodingSelector).blur(function() {
		var newVal = $(this).val();
		var floodingClass = this.id.substring(0, this.id.indexOf('_'));
		$('.' + floodingClass).each(function() {
			$(this).val(newVal);
		});
	});
}


function alignRowsById(headerRowTable, contentRowTable) {
	
	alignTableRows('#' + headerRowTable + ' > tbody > tr', '#' + contentRowTable + ' > tbody > tr');
}

function alignTableRows(selector1, selector2) {
	var headerRows = $(selector1);
	var contentRows = $(selector2);
	
	// tjmcd -- What should we do if the row counts are different ??
	var rowCount = headerRows.length;
	if (headerRows != null && contentRows != null && 
			rowCount > 0 && contentRows.length == rowCount) {
		for (var i = 0; i < rowCount; i++ ) {
			alignTableRow($(headerRows[i]), $(contentRows[i]));
		}
	}
}

function alignTableRow(row1, row2) {
	if (! row1.hasClass('hidden') && ! row2.hasClass('hidden')) {
		var row1Height = parseInt(row1.css('height'));
		var row2Height = parseInt(row2.css('height'));
		if (row1Height > row2Height) {
			row2.css('height', row1Height);
		} else if (row2Height > row1Height) {
			row1.css('height', row2Height);
		}
	}
}

/** Original from Drivers

function alignTableRows(selector1, selector2) {
	var headerRows = $(selector1);
	var contentRows = $(selector2);
	
	var rowCount = headerRows.length;
	if (headerRows != null && contentRows != null && 
			rowCount > 0 && contentRows.length == rowCount) {
		for (var i = 0; i < rowCount; i++ ) {
			alignTableRow($(headerRows[i]), $(contentRows[i]));
		}
	}
}

function alignTableRow(row1, row2) {
	
	var row1Height = row1.css('height').toLowerCase().replace("px", "");
	var row2Height = row2.css('height').toLowerCase().replace("px", "");
	
	if (parseInt(row1Height) > parseInt(row2Height)) {
		// check if row2 is a error row
		if (row2.hasClass("errorRow")) {
			//set error header row  equal to error data row
			row1.css('height', (row2Height + 'px'));
		} else {
			row2.css('height', (row1Height + 'px'));
		}
		
	} else if (parseInt(row2Height) > parseInt(row1Height)) {
		row1.css('height', (row2Height + 'px'));
	}	
}
**/


//SSIRIGINEEDI: Verified that this functions is just used in Vehicles page. So modifying this wont impact existing pages as Vehicle
//page is now ready to accept the changes related to the removal of SelectboxIt and adapt to the functionality of new Chosen Plugin.
function showHideRow(fieldType) {
	var showHeader = $('.' + fieldType)
		.filter(function() {
			return !($(this).hasClass('chosenDropDownHidden') || $(this).hasClass('hidden')) ;
			
		}).length > 0;
	showHideRowWithFlag(fieldType, showHeader);
}

function showHideRowWithFlag(fieldType, showHeader) {
	
	var fieldRow = $('.' + fieldType + "_Row");
	if (showHeader) {
		fieldRow.removeClass("hidden");
		alignTableRow($(fieldRow[0]), $(fieldRow[1]));
	} else {
		fieldRow.addClass("hidden");
	}
}

/*** tjmcd - tab-specific nav move ***/
function processDetailsElibilityQuestions(event) {

    // Enable all fields so the values submit
    $('input:disabled').prop('disabled', false);
    $('select:disabled').prop('disabled', false);

	var badMessage = '';	
	var stateCd = $('#stateCd').val();
	
	//48833 - For question 1,2,3 Vehicle, After elgibility edit fired on new vehicle fields on the existing vehicles became enabled when they were disabled.
	if ($('#eligbQ1').prop('checked') && stateCd != STATE_MA && stateCd != STATE_NH) {
		badMessage= badMessage + '1,';		
	}  if ($('#eligbQ2').prop('checked') && stateCd != STATE_NH) {
		badMessage= badMessage + '2,';		
	}  if ($('#eligbQ3').prop('checked') && stateCd != STATE_NH) {
		badMessage= badMessage + '3,';		
	}  if ($('#eligbQ4').prop('checked') && stateCd == STATE_NJ) {
		badMessage= badMessage + '4,';		
	}  if ($('#eligbQ5').prop('checked') && $('#eligbQ6').prop('checked') && stateCd == STATE_NH) {
		badMessage= badMessage + '5,';
		showNHMessage = false;
	}  if (!$('#eligbQ5').prop('checked') && !$('#eligbQ6').prop('checked') && stateCd == STATE_NH) {
		badMessage= badMessage + '6,';
	}
	//var errMsgId = "message" + badMessage;
	var msg_array = badMessage.split(',');
	
	if (badMessage != '') {
		event.stopPropagation();
		
		$('.eligibilityErrorMsg').addClass('hidden');
		
		//$('#'+errMsgId+'').removeClass('hidden');
		for(var i = 0; i < msg_array.length; i++)
		{
		   // Trim the excess whitespace.
			msg_array[i] = msg_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   // Remove hidden fields for respective messages
		   $('#message'+msg_array[i]).removeClass('hidden');
		}
		$('#eligibilityErrorsModal').modal();
		/*** tjmcd - tab-specific nav move
				stopNextOnDetails(errMsgId);
			}else{
					nextTab(document.aiForm.currentTab.value, this.id);
		***/
	}
}

function processVehicleEligibilityQuestions(event, isMaip) {
	var stateCd = $('#stateCd').val();
	//TD 57455- NH Edit update - Change Control  AI 620, Enterprise 486
	if(!isMaip && stateCd != 'NH') {
	processVehicleValueEligibility(event);
	}
	processVehicleWeightEligibility(event);
	//56930 - This validation no more required for all states
	//processRVUsedAsPrimaryResidenceEligibility(event);
	//TD#71236 Disable experience & Cost based eligibility for PA
	if('PA' != stateCd){
		processVehicleInexperiencedDriverEligibility(event);
	}
	if(isEndorsement()){
		processEndorsementVehicleEligibility(event);
	}
}

function processVehicleValueEligibility(event) {	
	
	// Process Vehicle Value for company limit
	$('.costNewAmt').each(function() {
		var id = this.id; 
		var index = id.substring(id.lastIndexOf("_") + 1);		
		var vehicleTypeCd = $('#vehTypeCd_' + index).val();
		
		// Defaults
		var costLimit = 125000; // default it to NON trailer types
		var errorMessage = "Value of Vehicle {0} exceeds company limit.";// default it to NON trailer types
		var vehicleValue = 0;
		
		// Check if vehicle is Utility Trailers,Trailers w/ living facilities or Trailer Caps
		if (vehicleTypeCd == 'TL' || vehicleTypeCd == 'UT' || vehicleTypeCd == 'TC' ) {
			// set Limit and error Message
			costLimit = 50000;
			errorMessage = "Value of vehicle {0} exceeds company limit for trailers.";
			if ($('#vehicleValue_' + index).val() != null && $('#vehicleValue_' + index).val() != '') {
				vehicleValue = parseInt($('#vehicleValue_' + index).val());	
			}  
		} else {
			//Vehicle Update Starts
			var polEffDate = $("#policyEffDt").val();
			var stateCd = $("#stateCd").val();
			var polEffDateObj = new Date(polEffDate);
			var vehUpdateEffDate = new Date("2018/08/11");
			if( (polEffDateObj > vehUpdateEffDate) && stateCd != 'MA' && stateCd != 'NH' ){
				// set Limit and error Message
				costLimit = 150000;				
			}else{
				// set Limit and error Message
				costLimit = 125000;					
			}
			errorMessage = "Value of Vehicle {0} exceeds company limit.";
			var costNewAmtValue = 0;
			if ($(this).val() != null && $(this).val() != '') {
				costNewAmtValue = parseInt($(this).val());	
			}
			var custEqpmntAmtValue = 0;
			if ($('#customizedEquipAmt_' + index).val() != null && $('#customizedEquipAmt_' + index).val() != '') {
				custEqpmntAmtValue = parseInt($('#customizedEquipAmt_' + index).val());	
			}			
			// Obtain vehicle Value
			vehicleValue = costNewAmtValue + custEqpmntAmtValue;
			//Vehicle Update Ends
		} 
		
		/**
		 *  MA Conversion requirement
		 *	Identify the renewal conversion policies when flag is set to Yes in Polstar � PRIME_CONV_FLAG
		 *  Ignore edit for Vehicle above 125K in value or CostNew
		**/
		var maConvRollout = $('#maConvRollout').val() == 'Yes';
		//If MA Conv flag is not active, keep this flag true so it will work as earlier
		var addedVehicleOrNonPrimeConvFlag = !maConvRollout || (!isEndorsement() || (isEndorsement() && ($('#endorsementVehicleAddedInd_' + index).val() == 'Yes'
				|| $('#primeConvFlag').val() != 'Yes')));
			
		if (addedVehicleOrNonPrimeConvFlag && vehicleValue > costLimit) {
			event.stopPropagation();		
			
			// Inject the vehicle header info into the error message
			errorMessage = errorMessage.replace('{0}',$('#vehicleHeaderInfo_'+ index).html());
			
			$('.vehEligibilityErrorMsg').addClass('hidden');
			// pump that message into the HTML
			$('#vehmessage1').html(errorMessage);
			// And make it visible
			$('#vehmessage1').removeClass('hidden');
			// And show it on the modal 
			$('#vehicleEligibilityErrorsModal').modal();
			return false;			
		}
		
	});	
}

function processVehicleWeightEligibility(event) {
	// Process Vehicle weight for company limit
	$('.weight').each(function() {
		var id = this.id; 
		var index = id.substring(id.lastIndexOf("_") + 1);
		// Defaults
		var weightLimit = 12000; 
		var errorMessage = "Vehicle {0} has a weight of 12,000 pounds or more";
		
		var vehicleWeight = 0;
		var typeVal = $("#vehTypeCd_" + index).val();
		var polEffDate = $("#policyEffDt").val();
		var polEffDateObj = new Date(polEffDate);
		var vehUpdateEffDate = new Date("2018/08/11");
		var stateCd = $("#stateCd").val();
		
		//48955 - Weight Edit should fire only if its PPA, Pickup, Antique & Custom && if added newly only in ENDT
		if (isEndorsement() && $(this).val() != null && $(this).val() != ''){
			vehicleWeight = parseInt($(this).val());			
			//Vehicle Update Starts			
			if( (polEffDateObj > vehUpdateEffDate) && (stateCd == 'MA' || stateCd == 'NJ')){				
				weightLimit = 14000;
				errorMessage = "Vehicle {0} has a weight of 14,000 pounds or more";
			}else {				
				weightLimit = 12000;
				errorMessage = "Vehicle {0} has a weight of 12,000 pounds or more";
			}
			if ((stateCd != 'NH') && vehicleWeight > weightLimit && (typeVal == PRIVATE_PASSENGER_CD) && $('#endorsementVehicleAddedInd_' + index).val() == 'Yes') {
				event.stopPropagation();		
				// Inject the vehicle header info into the error message
				errorMessage = errorMessage.replace('{0}',$('#vehicleHeaderInfo_'+ index).html());				
				
				$('.vehEligibilityErrorMsg').addClass('hidden');
				// pump that message into the HTML
				$('#vehmessage1').html(errorMessage);
				// And make it visible
				$('#vehmessage1').removeClass('hidden');
				// And show it on the modal 
				$('#vehicleEligibilityErrorsModal').modal();
				return false;			
			}
			
		}else if ($(this).val() != null && $(this).val() != '') {
			vehicleWeight = parseInt($(this).val());
			if( (polEffDateObj > vehUpdateEffDate) && (stateCd == 'MA' || stateCd == 'NJ')){				
				weightLimit = 14000;
				errorMessage = "Vehicle {0} has a weight of 14,000 pounds or more";
			}else{				
				weightLimit = 12000;
				errorMessage = "Vehicle {0} has a weight of 12,000 pounds or more";
			}
			if ((stateCd != 'NH') && vehicleWeight > weightLimit && (typeVal == PRIVATE_PASSENGER_CD)) {
				event.stopPropagation();	
				// Inject the vehicle header info into the error message
				errorMessage = errorMessage.replace('{0}',$('#vehicleHeaderInfo_'+ index).html());				
				
				$('.vehEligibilityErrorMsg').addClass('hidden');
				// pump that message into the HTML
				$('#vehmessage1').html(errorMessage);
				// And make it visible
				$('#vehmessage1').removeClass('hidden');
				// And show it on the modal 
				$('#vehicleEligibilityErrorsModal').modal();
				return false;			
			}
			
		}
		
	});
}

function processRVUsedAsPrimaryResidenceEligibility(event) {
	// Process Vehicle RV USed as Primary Residence
	$('.rvUsedAsPrimaryResidenceInd').each(function() {
		// Defaults		 
		var errorMessage = "A Mobile home or Trailer with living facilities is being used as your primary residence";
		
		if ($(this).val() != null && $(this).val() != '' && $(this).val() == 'Yes') {
			
			event.stopPropagation();
			$('.vehEligibilityErrorMsg').addClass('hidden');
			// pump that message into the HTML
			$('#vehmessage1').html(errorMessage);
			// And make it visible
			$('#vehmessage1').removeClass('hidden');
			// And show it on the modal 
			$('#vehicleEligibilityErrorsModal').modal();
			return false;			
		}
	});
}
	
function processVehicleInexperiencedDriverEligibility(event) {
	
	var stateCd = $('#stateCd').val();
	var policyeffectiveDate = $('#policyEffDt').val();
	
	$('.costNewAmt').each(function() {
		var id = this.id; 
		var index = id.substring(id.lastIndexOf("_") + 1);		
		// Defaults
		var costLimit = 65000; // default it to NON trailer types
		//var errorMessage = "Value of vehicle {0} exceeds company limit for inexperienced drivers.";
		var vehicleValue = 0;
		
		// Check if vehicle is Utility Trailers,Trailers w/ living facilities or Trailer Caps
		var costNewAmtValue = 0;
		if ($(this).val() != null && $(this).val() != '') {
			costNewAmtValue = parseInt($(this).val());	
		}
		var custEqpmntAmtValue = 0;
		if ($('#customizedEquipAmt_' + index).val() != null && $('#customizedEquipAmt_' + index).val() != '') {
			custEqpmntAmtValue = parseInt($('#customizedEquipAmt_' + index).val());    
		}                    
		// Obtain vehicle Value
		vehicleValue = costNewAmtValue + custEqpmntAmtValue;                 
		var cnt = $('#driverCount').val();
		if (stateCd != 'NH' && vehicleValue > costLimit) {
			var niEligiblityFlag = false;
			var allRatedDriverEligiblityFlag = false;
			var cnt = $('#driverCount').val();
			for(var i=0;i<cnt;i++){
				var drvStatus = $('#drvDriverStatusCd_'+i).val();
				var relationshipToInsCd = $('#drvRelationshipToInsCdId_'+i).val();
				var firstLicUsaDt = $('#drvfirstLicUsaDtId_'+i).val();
				var birthDate = $('#drvBirthDateId_'+i).val();
				var driverAge = getPrincipalOperatorAge(birthDate, policyeffectiveDate);
				var driverExperience = getPNIDriverExperience(firstLicUsaDt, policyeffectiveDate);
				//console.log("driverAge ="+driverAge+"driverExperience ="+driverExperience+" Before manipulation drvStatus = "+drvStatus+" :: relationShipIns = "+relationshipToInsCd+" :: firstUSLICDt = "+firstLicUsaDt+" :: BirthDt"+birthDate);
				if(driverAge > 22 || driverExperience > 6){
					if(relationshipToInsCd == "I"){
						niEligiblityFlag = true;
						if(getDriverRatedIndicator(stateCd,drvStatus)){
							allRatedDriverEligiblityFlag = true;
						}
					}
					else{
						if(getDriverRatedIndicator(stateCd,drvStatus)){ 
							allRatedDriverEligiblityFlag = true;
						}
					}
				}
			}
			//console.log('niEligiblityFlag = '+niEligiblityFlag+' allRatedDriverEligiblityFlag ='+allRatedDriverEligiblityFlag);
			if(!niEligiblityFlag){
				displayAgeEligibityPopUp(index,event);   
			}else{
				if(!allRatedDriverEligiblityFlag){
					displayAgeEligibityPopUp(index,event);
				}
			}
		}
	});
}


function displayAgeEligibityPopUp(index,event){
	event.stopPropagation();		
	var errorMessage = "Value of vehicle {0} exceeds company limit for inexperienced drivers.";
	// Inject the vehicle header info into the error message
	errorMessage = errorMessage.replace('{0}',$('#vehicleHeaderInfo_'+ index).html());
	
	$('.vehEligibilityErrorMsg').addClass('hidden');
	// pump that message into the HTML
	$('#vehmessage1').html(errorMessage);
	// And make it visible
	$('#vehmessage1').removeClass('hidden');
	// And show it on the modal 
	$('#vehicleEligibilityErrorsModal').modal();
	return false;
}

function processEndorsementVehicleEligibility(event){
	$('.endorsementVehicleEligibilityInd').each(function() {
		var indicator = $(this).val();
		var stateCd = $('#stateCd').val();
		//58051 - 
		if (indicator == "No" && stateCd != STATE_MA && stateCd != STATE_NH) {
			event.stopPropagation();
			$('#endorsementVehicleEligibilityErrorsModal').modal();
		}	
	});
}

function getYearsBetween(strDate, policyeffectiveDate) {
    
	var pedMM = parseInt(policyeffectiveDate.split("/")[0]);
	var pedDD = parseInt(policyeffectiveDate.split("/")[1]);
	var pedYY = parseInt(policyeffectiveDate.split("/")[2]);
		 
	var dateToCompare = strDate.substring(0,strDate.indexOf("T"));
	var dtcYY = parseInt(dateToCompare.split("-")[0]);
	var dtcMM = parseInt(dateToCompare.split("-")[1]);
	var dtcDD = parseInt(dateToCompare.split("-")[2]);
	
	var age = pedYY - dtcYY;
	if(pedMM < dtcMM) {
	   age = age - 1;      
	} else if(pedMM == dtcMM && pedDD < dtcDD)	{
	   age = age - 1;
	};
	        
	 return age;
}

function getPNIDriverExperience(strDate, policyeffectiveDate) {
    
	var mm = parseInt(policyeffectiveDate.split("/")[0]);
	var dd = parseInt(policyeffectiveDate.split("/")[1]);
	var yyyy = parseInt(policyeffectiveDate.split("/")[2]);
		 
	var dateToCompare = strDate;
	var myBDM = parseInt(dateToCompare.split("/")[0]);
	var myBDD = parseInt(dateToCompare.split("/")[1]);
	var myBDY = parseInt(dateToCompare.split("/")[2]);
	
	var age = yyyy - myBDY;

	if(mm < myBDM)
	{
	   age = age - 1;      
	}
	else if(mm == myBDM && dd < myBDD)
	{
	   age = age - 1;
	};
	        
	 return age;
}

function getPrincipalOperatorAge(birthDate, policyeffectiveDate){
    var dob = birthDate;
    
    var currentMonth = parseInt(policyeffectiveDate.split("/")[0]);
    var currentDay = parseInt(policyeffectiveDate.split("/")[1]);
    var currentYear = parseInt(policyeffectiveDate.split("/")[2]);
    var birthMonth = parseInt(dob.split("/")[0]);
    var birthDay = parseInt(dob.split("/")[1]);
    var birthYear = parseInt(dob.split("/")[2]);
    
//    console.log('birthYear ='+birthYear+'birthMonth ='+birthMonth+'birthYear ='+birthYear);
    
    var age = currentYear - birthYear;
    if (age < 22 || age > 22) {
    	return age;
    } 
    
    if (age == 22) {
    	if (currentMonth > birthMonth ) {
    		return age;
    	} 
    	if (currentMonth == birthMonth ) {
    		if(currentDay >= birthDay) {
    			return age;
    		}
    	} else {
    		return age - 1;
    	}    	
    }
    
    return currentYear - birthYear;
}

function validateDateEntry(strElm) {
	var value = $(strElm).val();
	var check = true;
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    
    if (value == '') {
    	 return check;
    }
    
    if( re.test(value)) {
        var adata = value.split('/');
        var mm = parseInt(adata[0],10);
        var dd = parseInt(adata[1],10);
        var yyyy = parseInt(adata[2],10);
        var xdata = new Date(yyyy,mm-1,dd);
        if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
            check = true;
        else
            check = false;
    } 
    else {
        check = false;
    }
    
    return check;   
   
}

function validateFutureDate(strElm) {
	var blnIsValid = validateDateEntry(strElm);
	if (!blnIsValid) {
		return false;
	}
	
	var today = new Date();
    var DOB = Date.parse($(strElm).val());
    if (DOB > today ) {
    	return false;
    }
    else {
    	return true;
    }
}

function getMonthsDifference(date1, date2) {
	var MM1 = parseInt(date1.split("/")[0]);
	var DD1 = parseInt(date1.split("/")[1]);
	var YY1 = parseInt(date1.split("/")[2]);
	
	var MM2 = parseInt(date2.split("/")[0]);
	var DD2 = parseInt(date2.split("/")[1]);
	var YY2 = parseInt(date2.split("/")[2]);
	
	if(YY2 > YY1){
	    MM2 += (YY2 - YY1) * 12;
	}
	
	var diffMonths = parseInt(MM2 - MM1);
	if(DD1 > DD2) diffMonths--;
	
	return diffMonths;
}

function autoSlashes(strElm, e) {
	
	//don't do anything while deleting
	if (e.keyCode == 8) {
		return;
	}
	
	if ($(strElm).val().length == 2){
        $(strElm).val($(strElm).val() + "/");
    }else if ($(strElm).val().length == 5){
        $(strElm).val($(strElm).val() + "/");
    }
}

function acceptLicenseCharsOnly( e) {
	
	if (e.keyCode == 8 || e.keyCode == 9) {
		return;
	}

	// common function for driver & pplication pages
	var regex = new RegExp("^[a-zA-Z0-9-* ]+$");
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(key)) {
    	if(e.preventDefault){     				   
	    	e.preventDefault();    			    	
	    }
	    else{
	    	//for ie
	    	 e.returnValue = false;
	    }    	 
    }
}

function maskThirdPartyElementData(strElm, e, strType) {
	// common function for driver & pplication pages
	var maskFldVal = $.trim($(strElm).val());
	
	if (strType=="2")  {
		//Note: This masking should function like current legacy production for 2.0 release
		if (maskFldVal.length==10) {
			// populate hidden var and mask it again if not masked 
			// as hidden var contains a value for already masked 
			if (maskFldVal.substr(0,6) != "**/**/") {
				// first store 'Date of Birth' value into hidden
				$("#birthDate_" + getIndexOfElementId(strElm)).val(maskFldVal); 
				
				// Then mask the display value if it is existing  driver
				if (! $(strElm).hasClass("addNewColumn") ) {
					var strMask = '**/**/' + maskFldVal.substr(maskFldVal.length-4, 4);
					$(strElm).val(strMask);		
				}
			}
		} else {
			// populate actual hidden var with entered/changed value for validation
			$("#birthDate_" + getIndexOfElementId(strElm)).val(maskFldVal); 
		}
	} else if (strType=="4")  {
		//Note: This masking should function like current legacy production for 2.0 release
		
		if (maskFldVal.length > 3) {
			if ( maskFldVal.substr(maskFldVal.length-4, 4)  != "****") {
				
				// first store license number value into hidden if value not having any '*'
				if (maskFldVal.indexOf('*') == -1) {
					$("#licenseNumber_" + getIndexOfElementId(strElm)).val(maskFldVal); 
				}				
				
				// Then mask the display value if it is existing  driver
				// don't mask for new driver
				if (! $(strElm).hasClass("addNewColumn") ) {
					var strMask = maskFldVal.substr(0, maskFldVal.length-4) + "****";					
					$(strElm).val(strMask);		
				}
			}			
			
			// if user copies/enteres the license number with last four digits as *'s 
			// and there is no prior value in license number copy the license number with *'s
			if ( (maskFldVal.substr(maskFldVal.length-4, 4) == "****") && ($("#licenseNumber_" + getIndexOfElementId(strElm)).val() == '') ) {
				$("#licenseNumber_" + getIndexOfElementId(strElm)).val(maskFldVal); 
			}
			
		}
		else { // assign same value to hidden variable
			$("#licenseNumber_" + getIndexOfElementId(strElm)).val(maskFldVal); 
		}
		
	}
}

function getRmvLicStatusCd(lookupLicenseStatus) {
	var licenseStatus=lookupLicenseStatus;	
	switch(trimFirst3Chars(lookupLicenseStatus)) {	
	    case ACTIVE_MA:
	    	//Active
	    	licenseStatus = ACTIVE;
	    	break;
	    case SUSPENDED_LICENSE_MA:
	    	//Suspended
	    	licenseStatus = SUSPENDED_LICENSE;	    	
	    	break;
	    case REVOKED_LICENSE_MA:
	    	//revoked
	    	licenseStatus = REVOKED_LICENSE;	    	
	    	break;	    	
	    case CANCELLED_MA:
	    	//canceled
	    	licenseStatus = CANCELLED;	    	
	    	break;	 
	    case DENIED_MA:
	    	//Denied
	    	licenseStatus = DENIED;	   
	    	break;	    
	    case EXPIRED_LICENSE_MA:
	    	//expired
	    	licenseStatus = EXPIRED_LICENSE;	 
	    	break;
	}
	return licenseStatus;
}

//52261 - If RMV License Status is more than three characters � the mapping takes place using ONLY THE FIRST 3 CHARACTERS
function trimFirst3Chars(licenseStatus){
	if(licenseStatus == null){
		return licenseStatus;
	}
	if(licenseStatus.length>3){
		return licenseStatus.substring(0,3);
	}
	return licenseStatus;
}

function getRmvDriverStatusCd(lookupLicenseStatus) {
	var driverStatus='';	
	switch(trimFirst3Chars(lookupLicenseStatus)) {
    case ACTIVE:
    	//Active
    	driverStatus=INSURED_ON_THIS_POLICY;
    	break;
    case SUSPENDED_LICENSE:
    	//Suspended
    	driverStatus=SUSPENDED_OPERATOR;	    	
    	break;
    case REVOKED_LICENSE:
    case CANCELLED:
    case REVOKED_LICENSE_MA:
    	//Revoked
    	driverStatus=REVOKED_OPERATOR;
    	break;
    case EXPIRED_LICENSE: 
    case NO_LONGER_LICENSED:
    case DENIED: //#52128
    	//No longer licensed
    	driverStatus=NO_LONGER_LICENSED;
    	break;	    
    case NEVER_LICENSED_3CHAR:
    //case DENIED:
    	//Never licensed
    	driverStatus=NEVER_LICENSED;
    	break;
    case PERMIT:
    	//Permit
    	driverStatus=PERMIT;
    	break;
	}	
	return driverStatus;
}

function getDriverRatedIndicator(stateCd,drvStatus){
	if(stateCd == 'NJ' || stateCd == 'CT' || stateCd == 'PA'){
		if(drvStatus == 'INS_POL' || drvStatus == 'R'){
			return true;
		}
	}else{
		if(drvStatus == 'INS_POL' || drvStatus == 'R' || drvStatus == 'Y' || drvStatus == 'W' || drvStatus == 'RO' || drvStatus == 'NLL'){
			return true;
		}
}
}


function calculateAge(strDate,policyEffDt) {
	
	var today = new Date();
	var dd = parseInt(today.getDate());
	var mm = parseInt(today.getMonth()+1);
	var yyyy = parseInt(today.getFullYear()); 
	
	if(policyEffDt != null){
		mm = parseInt(policyEffDt.split("/")[0]);
		dd = parseInt(policyEffDt.split("/")[1]);
		yyyy = parseInt(policyEffDt.split("/")[2]);
	}

	var myBDM = parseInt(strDate.split("/")[0]);
	var myBDD = parseInt(strDate.split("/")[1]);
	var myBDY = parseInt(strDate.split("/")[2]);
	var age = yyyy - myBDY;
    if(mm < myBDM)
    {
    	age = age - 1;      
    }
    else if(mm == myBDM && dd < myBDD)
    {
    	age = age - 1;
    }
	    
    return age;
}

// firstMALicDt,dateFirstLicensed
function dateFirstLicensedAfterFirstMALicDate(firstMALicDt,dateFirstLicensed) {
	var mm = parseInt(dateFirstLicensed.split("/")[0]);
	var dd = parseInt(dateFirstLicensed.split("/")[1]);
	var yyyy = parseInt(dateFirstLicensed.split("/")[2]);

	var myBDM = parseInt(firstMALicDt.split("/")[0]);
	var myBDD = parseInt(firstMALicDt.split("/")[1]);
	var myBDY = parseInt(firstMALicDt.split("/")[2]);

	if(yyyy > myBDY){
		return true;
	}else{
		if(yyyy == myBDY){
			if(mm > myBDM){
				return true;
			}else{
				if(mm == myBDM){
					if(dd > myBDD){
						return true;
					}
				}
			}
		}
	}
	return false;
}