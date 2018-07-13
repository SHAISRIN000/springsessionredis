jQuery(document).ready(function() {	
	
	// should be a last call for readonly quote
	disableOrEnableElementsForReadonlyQuote();
	
	 $("#pdfAgentReport").bind("click", function(){
		 	var period = $('#period').val();
		 	var stateCodes = 'All';
		 	var locations = 'All';
		 	var subAgencyCodes = 'All';
		 	var groups = 'All';
		 	
			document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=pdf&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&groups='+groups+'&locations='+locations;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ExperienceReports";
			document.actionForm.submit();
		});
	 
	 $("#excelAgentReport").bind("click", function(){
		 	var period = $('#period').val();
		 	var stateCodes = 'All';
		 	var locations = 'All';
		 	var subAgencyCodes = 'All';
		 	var groups ='All';
		 	
 			document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=xls&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&groups='+groups+'&locations='+locations;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ExperienceReports";
			document.actionForm.submit();
		});
	 	updateExpDashboard();
	 	updatePSDashboard();
	 	
	 	 //fetch Experience Reports on click of Experience Report link
		$(document).on("click", ".expReportLink", function(e){	
				updateExpReports();
		 });
		
 
		 createPopover('.periodMenu', showPeriodPopover);
		 createPopover('.psPeriodMenu', showPSPeriodPopover);
		 createPopover('.commPeriodMenu', showCOMMPeriodPopover);
		 
		$(document).on("click", ".periodMenuLinks", function(e){
			displayPeriodDialog($(this).text());
			e.stopPropagation();
			return false;
		});
		
		$(document).on("click", ".psPeriodMenuLinks", function(e){
			displayPSPeriodDialog($(this).text());
			e.stopPropagation();
			return false;
		});
		
		$(document).on("click", ".commPeriodMenuLinks", function(e){
			displayCOMMPeriodDialog($(this).text());
			e.stopPropagation();
			return false;
		});
		
		 $("#commCurrentMonthDownload").bind("click", function(){	
			var commPeriod = $('#commPeriod').val();
			document.actionForm.action = '/aiui/agencyReports/commissionFilesDownload?commPeriod='+commPeriod+'&downloadType=Latest';
			document.actionForm.method="POST";
			document.actionForm.submit();
		});
		 
		$("#commPriorYearStmtDownload").bind("click", function(){	 	
			var commPeriod = $('#commPeriod').val();
			document.actionForm.action = '/aiui/agencyReports/commissionFilesDownload?commPeriod='+commPeriod+'&downloadType=PriorYear';
			document.actionForm.method="POST";
			document.actionForm.submit();
		});
		 
		$("#commYTDStmtDownload").bind("click", function(){	 
			var commPeriod = $('#commPeriod').val();
			document.actionForm.action = '/aiui/agencyReports/commissionFilesDownload?commPeriod='+commPeriod+'&downloadType=YTD';
			document.actionForm.method="POST";
			document.actionForm.submit();
		});
		
		$("#commPdfAgentReport").bind("click", function(){	
			var commPeriod = $('#commPeriod').val();
			var commCheckBoxVals = $('.commCheckBox:checkbox:checked').map(function() {
			    return this.value;
			}).get();
			if(commCheckBoxVals == ""){
				$('#selectCommissionError').modal('show'); 
				return false;
			}
			document.actionForm.action = '/aiui/agencyReports/commissionFilesDownload?commPeriod='+commPeriod+'&downloadType=Individual&commCheckBoxVals='+commCheckBoxVals;
			document.actionForm.method="POST";
			document.actionForm.submit();
		});
		
					
		$("#commSelectAll").bind("click", function(){	 	
			$(".commCheckBox").attr('checked',true);
		});
		
		$(document).on("click", function(e){			
		   if(e.target.className.indexOf("periodMenu") < 0){
				hidePeriodPopover();
			}
		   if(e.target.className.indexOf("psPeriodMenu") < 0){
				hidePSPeriodPopover();
			}
		   if(e.target.className.indexOf("commPeriodMenu") < 0){
				hideCOMMPeriodPopover();
			}
		});
				
});

$(window).scroll(function(event) {

});

function displayPeriodDialog(msg){
	$('.periodHeaderText').text(msg);
	$('#period').val(msg);
	$('.popover').hide();
	updateExpDashboard();
	return false;
}

function displayPSPeriodDialog(msg){
	$('.psPeriodHeaderText').text(msg);
	$('#psPeriod').val(msg);
	$('.popover').hide();
	updatePSDashboard();
	return false;
}

function displayCOMMPeriodDialog(msg){
	$('.commPeriodHeaderText').text(msg);
	$('#commPeriod').val(msg);
	$('.popover').hide();
	return false;
}

function showPeriodPopover() {
	var popupHTML = $('#periodLinks').html();
	var pop = $('.periodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function showPSPeriodPopover() {
	var popupHTML = $('#psPeriodLinks').html();
	var pop = $('.psPeriodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}

function showCOMMPeriodPopover() {
	var popupHTML = $('#commPeriodLinks').html();
	var pop = $('.commPeriodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('show');
}


function hidePeriodPopover() {
	var popupHTML = $('#periodLinks').html();
	var pop = $('.periodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

function hidePSPeriodPopover() {
	var popupHTML = $('#psPeriodLinks').html();
	var pop = $('.psPeriodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

function hideCOMMPeriodPopover() {
	var popupHTML = $('#commPeriodLinks').html();
	var pop = $('.commPeriodLink').richPopover({
			placement: 'bottom',
			html: true,
		    content: popupHTML
		 });
	
	pop.richPopover('hide');
}

//complete hiding, showing, etc
window.onload=initialFormLoadProcessing;

function initialFormLoadProcessing(){}


function updateExpReports(){
	var period = $('#period').val();
 	var stateCodes = 'All';
 	var locations = 'All';
 	var subAgencyCodes = 'All';
 	var groups = 'All';

 	groups = encodeURIComponent(groups);
	document.actionForm.action = '/aiui/agencyReports/generateExpReports?format=report&period='+period+'&stateCodes='+stateCodes+'&subAgencyCodes='+subAgencyCodes+'&groups='+groups+'&locations='+locations;
	document.actionForm.method="POST";
	document.actionForm.requestSource.value = "ExperienceReports";
	document.actionForm.submit();
}

function updatePSReports(psPlan){
	var period = $('#psPeriod').val();
	//alert(period);
	//alert(psPlan);
	document.actionForm.action = '/aiui/agencyReports/generatePSReports?format=report&psPeriod='+period+'&psPlan='+psPlan;
	document.actionForm.method="POST";
	document.actionForm.requestSource.value = "PSReports";
	document.actionForm.submit();
}

function updateExpDashboard(){
	var period = $('#period').val();
 	var stateCodes = 'All';
 	var locations = 'All';
 	var subAgencyCodes = 'All';
 	var groups = 'All';
 	
 	$.ajax({
 		
 		headers : {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json',
		},	
 	
        url: "/aiui/agencyReports/generateExpDashBoardReport",
        type: "GET",
        data: "period=" + period + "&stateCodes=" + stateCodes + "&subAgencyCodes=" + subAgencyCodes+ "&groups=" +groups + "&locations="+locations,
        beforeSend:function(status, xhr){
        	$('.expReportLoadingDiv').css('display', 'block');
        	$('.expRptBannerDiv').css('display', 'none');
		},
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){     	
        	
        	//Inforce Premium
        	$('#paCurrent').text(response.PL_Reports.inforce[0].paCurrent);
        	$('#hoCurrent').text(response.PL_Reports.inforce[0].hoCurrent);
        	$('#clPaCurrent').text(response.PLCL_Reports.inforce[0].paCurrent);
        	$('#clCededCurrent').text(response.PLCL_Reports.inforce[0].cededCurrent);
        	$('#umbCurrent').text(response.PL_Reports.inforce[0].umbCurrent);
        	$('#pltotalCurrent').text(response.PL_Reports.inforce[0].pltotalCurrent);
        	$('#clPltotalCurrent').text(response.PLCL_Reports.inforce[0].pltotalCurrent);
        	
        	//YTD Change of Inforce Premium        
        	//Personal Auto
        	var paVpye = Number(response.PL_Reports.inforce[0].paVpye.replace("$", "").replaceAll(",", ""));
        	var paPye = response.PL_Reports.inforce[0].paPye.replace("$", "").replaceAll(",", "");
        	var paChange = round((paVpye/paPye)*100,1);
        	$('#pachange').text(paChange+"%");
        	if(paChange.toString().indexOf("-") != -1)
        		$('#pachange').css('color', 'red');
        	else
        		$('#pachange').css('color', 'green');
        	
        	//Homeowners
        	var hoVpye = Number(response.PL_Reports.inforce[0].hoVpye.replace("$", "").replaceAll(",", ""));
        	var hoPye = response.PL_Reports.inforce[0].hoPye.replace("$", "").replaceAll(",", "");
        	var hoChange = round((hoVpye/hoPye)*100,1);
        	$('#hochange').text(hoChange+"%");
        	if(hoChange.toString().indexOf("-") != -1)
        		$('#hochange').css('color', 'red');
        	else
        		$('#hochange').css('color', 'green');
        	
        	//Commercial
        	var capaVpye = Number(response.PLCL_Reports.inforce[0].paVpye.replace("$", "").replaceAll(",", ""));
        	var capaPye = response.PLCL_Reports.inforce[0].paPye.replace("$", "").replaceAll(",", "");        	
        	var capaChange = round((capaVpye/capaPye)*100,1);
        	$('#capachange').text(capaChange+"%");
        	if(capaChange.toString().indexOf("-") != -1)
        		$('#capachange').css('color', 'red');
        	else
        		$('#capachange').css('color', 'green');
        	
        	//CEDED
        	var cacededVpye = Number(response.PLCL_Reports.inforce[0].cededVpye.replace("$", "").replaceAll(",", ""));
        	var cacededPye = response.PLCL_Reports.inforce[0].cededPye.replace("$", "").replaceAll(",", "");        	
        	var cacededChange = round((cacededVpye/cacededPye)*100,1);
        	$('#cacededchange').text(cacededChange+"%");
        	if(cacededChange.toString().indexOf("-") != -1)
        		$('#cacededchange').css('color', 'red');
        	else
        		$('#cacededchange').css('color', 'green');
        	
        	//Umbrella
        	var umbVpye = Number(response.PL_Reports.inforce[0].umbVpye.replace("$", "").replaceAll(",", ""));
        	var umbPye = response.PL_Reports.inforce[0].umbPye.replace("$", "").replaceAll(",", "");
        	var umbChange = round((umbVpye/umbPye)*100,1);
        	$('#umbchange').text(umbChange+"%");
        	if(umbChange.toString().indexOf("-") != -1)
        		$('#umbchange').css('color', 'red');
        	else
        		$('#umbchange').css('color', 'green');
        		
    		//PL Total
        	var pltotalVpye = Number(response.PL_Reports.inforce[0].pltotalVpye.replace("$", "").replaceAll(",", ""));
        	var pltotalPye = response.PL_Reports.inforce[0].pltotalPye.replace("$", "").replaceAll(",", "");
        	var pltotalChange = round((pltotalVpye/pltotalPye)*100,1);
        	$('#pltotalchange').text(pltotalChange+"%");
        	if(pltotalChange.toString().indexOf("-") != -1)
        		$('#pltotalchange').css('color', 'red');
        	else
        		$('#pltotalchange').css('color', 'green');
        	
        	//PLCL Total
        	var plcltotalVpye = Number(response.PLCL_Reports.inforce[0].pltotalVpye.replace("$", "").replaceAll(",", ""));
        	var plcltotalPye = response.PLCL_Reports.inforce[0].pltotalPye.replace("$", "").replaceAll(",", "");
        	var plcltotalChange = round((plcltotalVpye/plcltotalPye)*100,1);
        	$('#plcltotalchange').text(plcltotalChange+"%");
        	if(plcltotalChange.toString().indexOf("-") != -1)
        		$('#plcltotalchange').css('color', 'red');
        	else
        		$('#plcltotalchange').css('color', 'green');
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	
        },
        complete: function(){
        	$('.expRptBannerDiv').css('display', 'block');
        	$('.expReportLoadingDiv').css('display', 'none');
         }
    }); 	
}


function updatePSDashboard(){
	var period = $('#psPeriod').val();
 	
 	$.ajax({
 		headers: {
 	        'Accept': 'application/json',
 	        'Content-Type': 'application/json'
 	    },
 		url: "/aiui/agencyReports/generatePSDashBoardReport",
        type: "GET",
        data: "psPeriod=" + period,
        beforeSend:function(status, xhr){
        	$('.psReportLoadingDiv').css('display', 'block');
        	$('.psRptBannerDiv').css('display', 'none');
		},
        // callback handler that will be called on success
        success: function(response, textStatus, jqXHR){ 
        	var size = 0;
        	var totalOfDisplayedPlans = 0;
        	$('.planYearEnd').text(period.substr(period.length - 4) - 1);
        	//BKH CT
        	if(response.BHCT != undefined){
        		$('#planOneHeader').text("Bunker Hill");
        		$('#planOneHeaderState').text("Connecticut");
        		$('#planOneLossRatio').text(response.BHCT.lossRatio+"%");
        		$('#planOnePSAmt').text(response.BHCT.sumPsTotalAdjustments);
        		$('#planOneYrEndAmt').text(response.BHCT.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.BHCT.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		$('#planOneCell').show();
        	}else{
        		$('#planOneCell').hide();
        	}
        	
        	//BKH MA
        	if(response.BHMA != undefined){
        		$('#planTwoHeader').text("Bunker Hill");
        		$('#planTwoHeaderState').text("Massachusetts");
        		$('#planTwoLossRatio').text(response.BHMA.lossRatio+"%");
        		$('#planTwoPSAmt').text(response.BHMA.sumPsTotalAdjustments);
        		$('#planTwoYrEndAmt').text(response.BHMA.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.BHMA.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		$('#planTwoCell').show();
        	}else{
        		$('#planTwoCell').hide();
        	}
        	
        	//CA CT
        	if(response.CACT != undefined){
        		$('#planThreeHeader').text("Commercial Auto");
        		$('#planThreeHeaderState').text("Connecticut");
        		$('#planThreeLossRatio').text(response.CACT.lossRatio+"%");
        		$('#planThreePSAmt').text(response.CACT.sumPsTotalAdjustments);
        		$('#planThreeYrEndAmt').text(response.CACT.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.CACT.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		$('#planThreeCell').show();
        	}else{
        		$('#planThreeCell').hide();
        	}
        	
        	//CA MA
        	if(response.CAMA != undefined){
        		$('#planFourHeader').text("Commercial Auto");
        		$('#planFourHeaderState').text("Massachusetts");
        		$('#planFourLossRatio').text(response.CAMA.lossRatio+"%");
        		$('#planFourPSAmt').text(response.CAMA.sumPsTotalAdjustments);
        		$('#planFourYrEndAmt').text(response.CAMA.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.CAMA.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		$('#planFourCell').show();
        	}else{
        		$('#planFourCell').hide();
        	}
        	
        	
        	//PA CT
        	if(response.PACT != undefined){
        		$('#planFiveHeader').text("Personal Auto");
        		$('#planFiveHeaderState').text("Connecticut");
        		$('#planFiveLossRatio').text(response.PACT.lossRatio+"%");
        		$('#planFivePSAmt').text(response.PACT.sumPsTotalAdjustments);
        		$('#planFiveYrEndAmt').text(response.PACT.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.PACT.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		$('#planFiveCell').show();
        	}else{
        		$('#planFiveCell').hide();
        	}
        	
        	//PA MA
        	if(response.PAMA != undefined){        		
        		$('#planSixCell').show();
        		$('#planSixHeader').text("Personal Auto");
        		$('#planSixHeaderState').text("Massachusetts");
        		$('#planSixLossRatio').text(response.PAMA.lossRatio+"%");
        		$('#planSixPSAmt').text(response.PAMA.sumPsTotalAdjustments);
        		$('#planSixYrEndAmt').text(response.PAMA.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.PAMA.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		if(size > 5){
        			$('#planSixCell').hide();
        			$('#row2Plans').append('<td id="planSixCell" width="160px" style="border: 0px; margin: 0px;">'+$('#planSixCell').html()+'</td>');
        		}        		
        		$('#planSixCell').show();
        	}else{
        		$('#planSixCell').hide();
        	}
        	
        	//PA NH
        	if(response.PANH != undefined){
        		$('#planSevenHeaderState').text("New Hampshire");
        		$('#planSevenLossRatio').text(response.PANH.lossRatio+"%");
        		$('#planSevenPSAmt').text(response.PANH.sumPsTotalAdjustments);
        		$('#planSevenYrEndAmt').text(response.PANH.priorYearSumPsTotalAdjustments);
        		totalOfDisplayedPlans = totalOfDisplayedPlans + Number(response.PANH.sumPsTotalAdjustments.replace("$", "").replaceAll(",", ""));
        		size = size+1;
        		if(size > 5){
        			$('#planSevenCell').hide();
        			$('#row2Plans').append('<td id="planSevenCell" width="160px" style="border: 0px; margin: 0px;">'+$('#planSevenCell').html()+'</td>');
        		}
        		$('#planSevenCell').show();
        	}else{
        		$('#planSevenCell').hide();
        	}
        	
        	$('#psHeaderTotalText').text("$"+(""+totalOfDisplayedPlans).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        	
        },
        // callback handler that will be called on error
        error: function(jqXHR, textStatus, errorThrown){
        	
        },
        complete: function(){
        	$('.psRptBannerDiv').css('display', 'block');
        	$('.psReportLoadingDiv').css('display', 'none');
         }
    }); 	
}

function round(value) {
	return value.toFixed(1);
}
