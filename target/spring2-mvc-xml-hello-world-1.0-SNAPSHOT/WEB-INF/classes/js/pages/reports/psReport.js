jQuery(document).ready(function() {	
	
		$("#psPdfAgentReport").bind("click", function(){
		 	var psPeriod = $('#psPeriod').val();
		 	var psPlan = $('#psPlan').val();

		 	document.actionForm.action = '/aiui/agencyReports/generatePSReports?format=pdf&psPeriod='+psPeriod+'&psPlan='+psPlan;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ProfitSharingReport";
			document.actionForm.submit();
		});
		
		$("#planDocDownload").bind("click", function(){
			var psPlan = $('#psPlan').val();
			var target = 'PlanDocument';
			var inputs = '';
			inputs+='<input type="hidden" name="psPlan" value="'+ psPlan +'" />'; 
			
			var w = window.open('', target);
			$('<form action="/aiui/agencyReports/planDocDownloadPdf?method="post" target="'+ target+'">'+inputs+'</form>').appendTo('body').submit().remove();
			
		    w.focus();
			
			return false;
		});
	 	
		 createPopover('.planMenu', showPlanPopover);
		 createPopover('.periodMenu', showPeriodPopover);
		 
		 displayPlanDialog($('.planHeaderText').text());
		 
		 $(document).on("click", ".planMenuLinks", function(e){
				displayPlanDialog($(this).text());
				updateReports();
				e.stopPropagation();
				return false;
			});
		 
		$(document).on("click", ".periodMenuLinks",function(e){
			displayPeriodDialog($(this).text());
			updateReports();
			e.stopPropagation();
			return false;
		});
			
		
		$(document).on("click", function(e){
		   if(e.target.className.indexOf("planMenu") < 0){
				hidePlanPopover();
			}
		   if(e.target.className.indexOf("periodMenu") < 0){
				hidePeriodPopover();
			}
		});			
		
		//Export Loss Run Report
		$(".exportLossRun").bind("click", function(){
		 	var psPeriod = $('#psPeriod').val();
		 	var psPlan = $('#psPlan').val();

		 	document.actionForm.action = '/aiui/agencyReports/exportLossRunReport?format=xls&psPeriod='+psPeriod+'&psPlan='+psPlan;
			document.actionForm.method="POST";
			document.actionForm.requestSource.value = "ProfitSharingReport";
			document.actionForm.submit();
		});
	});


	function displayDescModel(planHeaderText, planDetailText){
		$("#planDescriptionModal").show()
		$('#psPlanModalHeader').html(planHeaderText);
		$('#psPlanModalDesc').html(planDetailText);
	}
	
	function displayPlanDialog(msg){
		var psPlan = msg;
		if("PS-BHIC-HO-CT" == msg){
			psPlan = "Bunker Hill CT";
		}else if("PS-BHIC-HO-MA" == msg){
			psPlan = "Bunker Hill MA";
		}else if("PS-PRAC-CA-CT" == msg){
			psPlan = "Commercial Auto CT";
		}else if("PS-PRAC-CA-MA" == msg){
			psPlan = "Commercial Auto MA";
		}else if("PS-PRAC-PA-CT" == msg){
			psPlan = "Personal Auto CT";
		}else if("PS-PRAC-PA-MA" == msg){
			psPlan = "Personal Auto MA";
		}else if("PS-MWAC-PA-NH" == msg){
			psPlan = "New Hampshire";
		}
		$('.planHeaderText').text(psPlan);
		$('#psPlan').val(msg);
		$('.popover').hide();
		return false;
	}
	
	function displayPeriodDialog(msg){
		$('.periodHeaderText').text(msg);
		$('#psPeriod').val(msg);
		$('.popover').hide();
		return false;
	}	
	
	
	function showPlanPopover() {
		var popupHTML = $('#planLinks').html();
		var pop = $('.planLink').richPopover({
				placement: 'bottom',
				html: true,
			    content: popupHTML
			 });
		
		pop.richPopover('show');
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
	
	
	function hidePlanPopover() {
		var popupHTML = $('#planLinks').html();
		var pop = $('.planLink').richPopover({
				placement: 'bottom',
				html: true,
			    content: popupHTML
			 });
		
		pop.richPopover('hide');
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
	
	
	
	//complete hiding, showing, etc
	window.onload=initialFormLoadProcessing;
	
	function initialFormLoadProcessing(){}
	
	
	
	var addDeleteCallback = function(row, addIt) {
	}
	
	var fieldIdToModelErrorRow = {
			"defaultSingle":"<tr id=\"sampleErrorRow\" class=\"fieldRowError\"><td class=\"fieldColError\" id=\"Error_Col\"></td><td></td><td></td></tr>"
		};
	
	
	function updateReports(){
		var psPeriod = $('#psPeriod').val();
	 	var psPlan = $('#psPlan').val();
		document.actionForm.action = '/aiui/agencyReports/generatePSReports?format=report&psPeriod='+psPeriod+'&psPlan='+psPlan;
		document.actionForm.method="POST";
		document.actionForm.requestSource.value = "ProfitSharingReport";
		document.actionForm.submit();
} 
