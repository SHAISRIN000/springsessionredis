var imagePath = "/aiui/resources/images/";
var calendarImage = imagePath + "cal_icon.png";

jQuery(document).ready(function() { logToDb("common.js: 4 - Entering jQuery(document).ready function"); 
	
	/**
	 * TD 48207 - This call is used to check whether session is valid on any link
	 */
	$("body a").click(function( event ) {

		//no need to check for forgot password or Password Help link & Agent Support popup .
		var parentClass = $(this).parent().attr("class") ;
		if((parentClass != 'forgotPassword') && (parentClass != 'agentDescLabel') 
					&& $(this).attr("id") != 'openUserPasswordHelp'
						&& $(this).attr("class") !== 'browserUpgradeCls'	){		
			$.ajax({	    
				url: "/aiui/login/checkSessionValid",
			    //dataType: 'string',
			    timeout: 30000,
			    type: "post",
			    //setting global to false will disable ajaxStart and ajaxStop calls (this is causing an issue on vehicle page)
			    global: false,
			    success:function(response, textStatus) {
			    	if(response != 'valid'){
						event.preventDefault();
			    		window.location = '/aiui/login?error=Invalid Session.Please login again.';
			    	}
				},
			    error: function(jqXHR, textStatus, errorThrown){
			    		 
			    }
			});	
		}
		
		/**
		 * Handler to display the Browser Upgrade pop-up and present links to browser support
		 *
		 */
		$(document).on('click', '#browserUpgradeInfo', function(){
			 // Display the popup.
			 $('#browserUpgradeDialog').modal('show');
		});
		/**
		 * Handler function to close the popup .
		 */
		$('#closeBrowserUpgradeDlg').click(function(){		
			$("#browserUpgradeDialog").modal('hide');
		});
	});
	
	/**
	 * check for back button from Forms tab
	 */

	$( window ).load(function(){
		var currentTab = $('#currentTab');
		//This is for IE and Mozilla
		/*if($('#refreshedonload').val()!="yes"){
			$('#refreshedonload').val('yes');		
		}
		else{
			$('#refreshedonload').val('no');			 
			 if (currentTab.val() == "bind") {
				   nextTab('summary', 'bind');
			 }
		}*/
		//This is for Chrome		
		//$.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
	   // if($.browser.chrome){	   
			if (currentTab.val() == "forms") {		
			    if (typeof history.pushState === "function") {
			        history.pushState("jibberish", null, null);
			        window.onpopstate = function () {
			            history.pushState('newjibberish', null, null);
			            //alert('This policy is Issued. You cannot go back');
			            // Handle the back (or forward) buttons here
			            // Will NOT handle refresh, use onbeforeunload for this.
			        };
			    }
			    else {
			        var ignoreHashChange = true;
			        window.onhashchange = function () {
			            if (!ignoreHashChange) {
			                ignoreHashChange = true;
			                window.location.hash = Math.random();
			                // Detect and redirect change here
			                // Works in older FF and IE9
			                // * it does mess with your hash symbol (anchor?) pound sign
			                // delimiter on the end of the URL
			                //alert('back2');
			            }
			            else {
			                ignoreHashChange = false;   
			            }
			        };
			    }		
			}
	    //}
	});
		 

	//set rate cahnge eff date
	$('#rateChangeEffDate').val($('#hdnRateChangeEffDt').val());

	//hide prefill reconcile modal 
	$('#prefillReconcileModal').hide();
	
	$("#prefillReconcileLater").click(function(){
		$("#prefillReconcileModal").modal('hide');
		
	});
	
	//Premium Button changes
	$('#premamt_change').hide();
	 
	var isRated =  $('#ratedInd').val();
	var currentprem =  $('#premAmt').val();
	var priorPrem =  $('#priorRatedPremAmt').val();
	
	if(isRated == 'Yes' && priorPrem > 0){
		$('#premamt_no_change').hide();
		$('#premamt_change').show();
		$('#defaultZeroedPremium').val("0.00");
	}
	
	//vmaddiwar - Endorsement logic is different, we dont have prior premium concept
	//so we are checking currentPrem. Even if its not rated, we have to all User to RATE
	if ( isEndorsement() ) {
		if(isRated != 'Yes' || (isRated == 'Yes' && currentprem == 0)){
			$('#defaultZeroedPremium').val("0.00");
			
			if(isRated == 'Yes'){
				$('#premamt_no_change').hide();
				$('#premamt_change').show();
			}
		}
	}
	
	// set to default false to endorse mode switch during load
	if (!isHomeQuote() &&  isEndorsement() ) {
		document.aiForm.switchEndorsementMode.value = 'false';
	}
	
	//disable auto complete off.
	$('form,input,select,textarea').attr("autocomplete", "off");
	
	//do not close flyouts if click is within flyout
	$('.flyoutPanel').click(function(e) {  logToDb("common.js: 23 - In $('.flyoutPanel') click handler about to call e.stopPropagation()");  
		  e.stopPropagation();
	});
	
	//do not close flyouts if click is within flyout
	$('.flyoutHREF').click(function(e) { logToDb("common.js: 28 - In $('.flyoutHREF') click handler about to call e.stopPropagation()");  
		  e.stopPropagation();
	});
	
	//closes flyouts on click
	$(document).click(function(){  
		  $('.flyoutPanel').hide();
	});
	
	// Disbaling scrolling of body when focus is on modal
	$('.modal').on('shown', function () {
	    // disable background scrolling
		$('body').addClass('overflowHidden');
	});
	$('.modal').on('hidden', function () {
	    // enable background scrolling
		$('body').removeClass('overflowHidden');
	});
	
	/* SelectBoxIt functionality Removal and Chosen Migration */
	//Tabs that are migrated to reflect dropdowns will be applied as below
	
	var action = "";
	if(document.aiForm != null) {
		 action = document.aiForm.action;
	}
	//ALL AI pages are now migrated to use the new Chosen Dropdown. 
	applyChosenToFullPage();
	
	if(action.indexOf('/aiui/inquiry') != -1) {
		$('div#policyTermsSelect_chosen div.chosen-drop div.chosen-search').hide();
		//$('.chosen-search').hide();
	}
	
	/* Modal/Modeless Window functionality */
	if (!isHomeQuote()) {
		$('.modal').hide();
	}
	
	$(document).on("click", ".closeModal", function() {
		$(".modal").modal('hide');
		return false;
    });
	
	/*$('.closeMVRReorderModal').on('click', function() {
		$("div#confirmMVRReorder").hide();
		$("#mvrReOrderInd").val("");
		return false;
    });	*/

	$(document).on("click", ".closeOrderReportsPendingRateModal", function() {
		$("div.orderReportsPendingRate,div.orderReportsPending").hide();
		$.unblockUI();
		return false;
    });
  
	/* Modeless window should close when clicking outside of it */
   /* $('.modeless').on("click", function(e){ logToDb("common.js: 82 - In $('.modeless') click handler about to call e.stopPropagation()"); 
		  e.stopPropagation();
    });*/
	
	 $(document).on("click", ".modeless", function(e){ logToDb("common.js: 82 - In $('.modeless') click handler about to call e.stopPropagation()"); 
	  e.stopPropagation();
	 });
   
    /* when Modal stationary window is displayed, we darken background color  */
	$('.modalStationary').on('show hidden', function(e) {
		$('body').toggleClass('modal-stationary');
	});
	   
	// draggable
	$(".draggable").draggable({
		handle: '.dragHandle'
	});

	// resizable settings
	$('.modal.resizable').resizable({ 
	  handles: "se",
	  maxWidth: 700,   //630 was original
	  maxHeight: 700,  // 500 was original
	  minWidth: 565,
	  minHeight: 275
	});
	   
    $('.modal.alertModal.resizable').resizable({ 
	     handles: "se",
	     maxWidth: 700,
	     maxHeight: 400,
	     minWidth: 340,
	     minHeight: 165
	});
	    
    $('.errorDetailsPopup.resizable').resizable({ 
	     handles: "se",
	     maxWidth: 700,
	     maxHeight: 500,
	     minWidth: 340,
	     minHeight: 165
    });
    
    $('.modeless .resizable').resizable({ 
        handles: "se",
        maxWidth: 630,
        maxHeight: 400,
        minWidth: 565,
        minHeight: 275
      });
      
    /* Prefill modal */
    $('.modal.prefillDialog.resizable').resizable({ 
	     handles: "se",
	     maxWidth: 1280,
	     maxHeight: 700,
	     minWidth: 565,
	     minHeight: 275
	});
	 
   /* Modal Window resize functionality */
   $(document).on("resize", ".modal:not(.modalSmallFooter)", function (e) {
	  $(this).find('.resizePush').css('height', ($(this).height() - $('.modal-footer').outerHeight()) + 'px');
   }); 

   /* Modeless Window resize functionality */
   $(document).on("resize", ".modeless", function (e) {
	 $(this).find('.resizePush').css('height', ($(this).height() - $('.modeless-footer').outerHeight() - parseInt($('.resizePush').css('line-height'), 20)) + 'px');
     $(this).css('height', parseInt($(this).height() + 40) + 'px');
   }); 
   
   // alert modals
   $(document).on("show", ".alertModal:not(.modalSmallFooter)", function (e) {
		$(this).find('.resizePush').css('height', ($(this).height() - $('.modal-footer').outerHeight()) + 'px');
   });    
 
   // error details popup
   $(document).on('showErrorDetailsPopup', ".errorDetailsPopup", function() {
		createErrorDetailsPopup(this);
	});
   
   $(document).on("resize", ".errorDetailsPopup", function () {
	   $(this).find('.resizePush').css('height', ($(this).height() - 40) + 'px');
   });
   
   $(document).on("resize", ".modalSmallFooter", function () {
	   $(this).find('.resizePush').css('height', ($(this).height() - 40) + 'px');
   });
   
   // error popup
   $(document).on("showErrorPopup", ".alertModal", function (e) {
	   createErrorPopup(this);
   }); 
   
	// common date functionality
    $('.clsDate').datepicker({
		showOn: "button",buttonImage: calendarImage,buttonImageOnly:true,buttonText : 'Open calendar'
	}); 
   
    $('.ui-datepicker-trigger').addClass("calIcon"); 
	
	$('.clsDate').each(function(i, elem) {		
		 $(elem).keydown(function(event){
			 acceptNumericsAndSlashes(this, event);
		 });
		 
		 $(elem).keyup(function(event){
			 autoSlashes(this,event);
		 });
	});	
	
	$('.birthDate').each(function(i, elem) {		
		 $(elem).keydown(function(event){
			 acceptNumericsAndSlashes(this, event);
		 });
		 
		 $(elem).keyup(function(event){
			 autoSlashes(this,event);
		 });
	});	
	
	
	// auto correct year format on date fields
	$(dateClasses).bind("blur", function(){
		var dtField = this;
		if(dtField.id != "policyEffectiveDate"){
			dtField.value = autoCorrectDateYear(dtField.value);
		}
	});
	
	//Detect if scrolling is done on window, then close the drop down.
	//If scrolling is done with in the drop down container, then window scroll should not be executed.
	//Specially to relay mouse scroll events between chosen drop down and window scroll.
	 $(window).scroll(function(event) { 
	        $('.chosen-with-drop').each(function () {
	            var select =  $(this).prev();
	            var chosen = select.data('chosen');
	             if(chosen.results_showing) {
		            chosen.results_hide();
		         }
	         });
	        
	        //Since we have Fixed header, the header never moves on horizontal scroll/vertical Scroll. Rather than using modified the positon
	        //css on fly, I am adding this to offset left position of the header.
	        
	        /*$('.globalHeader').css({
	            'left': jQuery(this).scrollLeft() > 0 ?   0 - jQuery(this).scrollLeft() : ''
	        });*/
	        
	        $('#formTop').css({
	            //'left':    0 - jQuery(this).scrollLeft()
	        	 'left': jQuery(this).scrollLeft() > 0 ?   0 - jQuery(this).scrollLeft() : ''
	        });
	        
	        $('.fixedPageHeader, .driverPageHeader, .vehiclePageHeader, .coveragePageHeader').css({
	            //'left':    0 - jQuery(this).scrollLeft()+30
	        	 'left': jQuery(this).scrollLeft() > 0 ?   0 - jQuery(this).scrollLeft()+30 : ''
	        });
	        
	        if(jQuery(this).scrollLeft() > 0 ) {
		    	  // $('.globalHeader').width('1000px');
		    	   $('#formTop').width('1000px');
		       } else {
		    	   //$('.globalHeader').width('100%');
		    	   $('#formTop').width('100%');
		      }
	       // $(".globalHeader").redraw();
	       
	  });
	
	 //TD 53808 - ENDTS:  Q2E - Radio button locked down once user visits accviol tab
	 //54126
	 if(isEndorsement()){
		 if($('#stateCd').val()=='MA'){
				//MA Driver						 
			//54835 - ENDTS: Hdr QQ radio button protected when no OOS reports ordered yet
			 if($('#disableQuickQuote').val() == 'Yes' ){
					$('input[name=endorsementType]').attr('disabled', 'disabled');
				}				
			}else {
				//Non MA Driver
				 if (isMVRInitialOrderComplete()) {
						$('input[name=endorsementType]').attr('disabled', 'disabled');
					 }
			}
	 }
	
	 $('.clsClearPrefillAddedItems').click(function() {
		 $('#prefillAddedItemsList').val('');
	 });
	 
	$('button.orderReportsBeforeRate').click(function() {
		$('div.orderReportsPending, div.orderReportsPendingRate').hide();
		document.aiForm.orderThirdPartyReports.value = 'true';
		//47529 - After the policy rated I am landed on the Summary tab, instead of leaving me on the Driver tab with a rate.
		//rateOnSummary();
		if($('#navigateToSummary').val()=='true'){
			rateOnSummary();
		} else{
			nextTab(document.aiForm.currentTab.value, "rate");				
		}
	});
	
	$("#prefillReconcileLaterAccVio").click(function(){
		$("#orderThirdPartyPrefillNotReconciledModal").modal('hide');
		return false;
	});
	
	showReorderResultpopup();
	
	$('.btnOrderRptModalReview').click(function(){
		if(document.aiForm.currentTab.value!='accidentsViolations'){
			$('#divOrderRptModalClean').modal('hide');
			nextTab(document.aiForm.currentTab.value, "accidentsViolations");
		}
	});
	
	//-------------------Create Help Flyout------------------------------------------//
	createHelpFlyout();
	
	$(document).click(function(){
		destroyHelpFlyout();
    });	
	
	//Set focus back to where the modal is opened from after modal hide.
	//All we trying to do is instead of watching for this across pages, when ever a modal is opened just add the handle to the opener who opened it
	//and handle it back after hide of the modal.This will help in retaining the tabbing order / user last attended field.  
	$('.modal').on('hide', function(event) {
		var opener = $(this).data("opener");
		if(opener !== undefined) {
			//set focus back to where the popup is opened from. 
			$("#"+opener).focus();
		}
	});

	//Added Fullstory script to customize user session based on policynumber/quotenumber
	FS.setUserVars({
		 "quoteNumber_str" : ($('#isQuote').val() == 'true' || $('#isApplication').val() == 'true') ? $('[name="policy.policyNumber"]').val() : "",
		 "policyNumber_str" : ($('#isQuote').val() == 'true' || $('#isApplication').val() == 'true') ? "" : $('[name="policy.policyNumber"]').val()
	});
	
});

/*$.fn.redraw = function(){
	  $(this).each(function(){
	    var redraw = this.offsetHeight;
	  });
};*/

//SSIRIGINEEDI: START:   CHOSEN-Dropdown related code 
//The below functionality of adding chosen plugin is common for pages
//Developers can use any of the below 4 helper functions based on your needs.

//Scan through entire DOM for select elements
function applyChosenToFullPage() {
	var thisTab = document.aiForm ? document.aiForm.currentTab.value : '';
	if(thisTab != COVERAGESTABNAME) {
		$('select:not(select[multiple])').each(function(){
			// store original value 
			$(this).data('OriginalValue', $(this).val());
			 addChosenForElement($(this));
		});
	}
}

//Scan for Select elements inside the context based on the selector
function applyChosenToPage(selector) {
	
	// Use scope based selector for select items to render the selectdds only on  viewable area for fastness.
	// consider doing the selectdds outside the mainContent table asynchronously.TBD
	$(selector).find('select:not(select[multiple])').each(function(){
		// store original value 
		$(this).data('OriginalValue', $(this).val());
		 addChosenForElement($(this));
	});
}

//Added the contextSelector param to limit the scope for searching the native select element.
//If developer passes this contextSelector(Ex. like div/Form etc, then the "element" is looked for only in that container).
//Developers can still continue to just pass only the "id". But if you pass the boundary Container, then the id is searched only
//in that container as suppossed to searching the entire DOM Tree( Which will result in better DOM traversal performance).

//Use this if you have "Id" of select Element to create the chosen dropdown wrapper
function addChosen(id , contextSelector) {	

	  if(id == null || id == undefined)
		  return ;
	  
	  var selectElement  =  $('#' + id  , contextSelector) ;	  
	  addChosenForElement(selectElement);	
}

//Use this if you have the "select" element to create the chosen dropdown wrapper.
function addChosenForElement(selectElement) {
    
    var chosen =  selectElement.chosen ( 
								{     
									  search_contains:true
								      //, disable_search_threshold: 4
							    }).data("chosen");
	  
	    var chosenContainer  = chosen.container;
	    var chosenDropContainer = chosen.dropdown;
		
	    //each native select element is transformed to div element(with _chosen appended to the original id) with necessary stuff in it.
	    //This generated DIV container is appended after the native select element in the DOM tree.
	
	    //add a custom handler needed for tooltip. We show selected value in tooltip.
	    chosenContainer.mouseover( handle_mouseover_for_tooltip ); 

		// Handling the case of edge room detection so drop downs flip up when parent container has overflow hidden CSS. 
		selectElement.on("chosen:showing_dropdown", function () {
		    var flipDropDown = isFlippingNeeded( chosenDropContainer, chosenDropContainer.height()+ $(this).height());
		    chosenDropContainer.toggleClass('chosen-above', flipDropDown );
		    
		 });
		
		selectElement.on("chosen:hiding_dropdown", function () {
		    chosenDropContainer.removeClass('chosen-above');
		 });
         
         //Added newly: the only native event Chosen triggers on the original select field is 'change'. So in order to 
         //listen to the Blur event on the dropdwon, we have to trigger custom blur event(in this case see our own "chosen:inactive" in chosen.jquery.js) trigger.
         //In our case this is needed to handle the blur event to invoke validations when we dropdown looses focus.
		selectElement.on("chosen:inactive", function () {
 			 //validate the input component ( trigger the validation event).
 			 $(this).trigger("blur");
 			 validateLastInput('lastInputLeft');
 			 //remove prerequired styles.....
 	         $(this).removeClass("preRequired");
 	         $(this).next().find('a').removeClass("preRequired");
 		 });
          
		//It is necessary sometimes the user defined styles for underlying selectMenu should be copied over to the generated Chosen div as well.
		//In cases like Pre-required Style(yellowColor), required class etc.
		
		//The reason for creating new function is to avoid the recreating the chosen drop down again when there is a need 
		//for just applying style to the container. This will be help full. Also specific styles can be targeted to individual elements.
		selectElement.bind('chosen:styleUpdated', function() {
		     //We don't need all classes that are on the native select element to be applied to the Chosen Div Containter
			 //and also we should't expect it behave the same way when we supply it with classes that are applicable to Select element. 
			 //Hence we have to pass on only those classes that really apply and can be used.
			
			 //chosenContainer.addClass($(this).attr('class'));
			 
			 //if select has hidden apply hidden Style( display none  to chosen container)
			 //don't use the jquery hide() as it has impact on performance. Alternatively apply class so we can easily toggle between show/hide.
			 chosenContainer.toggleClass('chosenDropDownHidden' , $(this).hasClass('hidden') );
			 
			 //If native Select has preRequired class( This is set from validation.js/common.js/or user specific.js)then apply the same style to the drop down container. 
			 // preRequired and inLineError classes should be applied to container div first child so they are shown accurately.
			 
			 //The toggleClass helps in switching the class.
			 chosenContainer.children(":first").toggleClass('preRequired' , $(this).hasClass('preRequired'));
			 chosenContainer.children(":first").toggleClass('inlineError' , $(this).hasClass('inlineError'));
			 
			 //For Coverages.
			 chosenContainer.toggleClass('covColSelect' , $(this).hasClass('covColSelect') );
			 
			 //For Cleint Tab.
			 chosenContainer.toggleClass('colZipCitySelect' , $(this).hasClass('colZipCitySelect') );
			 chosenContainer.toggleClass('colZip4StateSelect' , $(this).hasClass('colZip4StateSelect') );
			 
			 //For Bind Tab.
			 chosenContainer.toggleClass('bindColZip4StateSelect' , $(this).hasClass('bindColZip4StateSelect') );
			 
			 //For accidentViolations://assignedDriverAccVio ,typeAccVio ,descriptionAccVio , stateAccVio
			 chosenContainer.toggleClass('assignedDriverAccVio' , $(this).hasClass('assignedDriverAccVio') );
			 chosenContainer.toggleClass('typeAccVio' , $(this).hasClass('typeAccVio') );
			 chosenContainer.toggleClass('descriptionAccVio' , $(this).hasClass('descriptionAccVio') );
			 chosenContainer.toggleClass('stateAccVio' , $(this).hasClass('stateAccVio') );
			 chosenContainer.toggleClass('excludeReasonAccVioSelect' , $(this).hasClass('excludeReasonAccVioSelect') );
			 
			 //For inquiry.
			 chosenContainer.toggleClass('termSelect' , $(this).hasClass('termSelect') );
			 
			 //For Drivers
			 chosenContainer.toggleClass('clsLicOutOfStateOrCountryRow', $(this).hasClass('clsLicOutOfStateOrCountryRow'));			 
			 chosenContainer.toggleClass('opCompanySelect' , $(this).hasClass('opCompanySelect') );
			 
			 //For Agent Reports
			 chosenContainer.toggleClass('periodSelect', $(this).hasClass('periodSelect'));	
			 
			//PA Home
			 chosenContainer.toggleClass('homecolZip4StateSelect', $(this).hasClass('homecolZip4StateSelect'));	
			 		 
		 });
		
		//Need to trigger the change if any styles are applied in the validation
		selectElement.trigger('chosen:styleUpdated');
		//return handle to chosen dropdown so developers can use if needed.
		return chosen;
		
}

function handle_mouseover_for_tooltip(event){
	  var selectedTextElement = $(event.currentTarget).find("span" ,".chosen-single");
	  var selectedText = selectedTextElement.text();
	  
	  if( selectedText  == '--Select--') {
      	$(selectedTextElement).attr('title', '');
      } else {
      	$(selectedTextElement).attr('title', selectedText);
      }
}

//FIXME: REMOVE: For what so ever reason this particular addHandlersToChosen code is copied here, needs to be removed. 
//This is a pure code duplication of addChosen() method.
function addHandlersToChosen(id) {
	
		//each select element is transformed to div element(with _chosen appended to the original id) with necessary stuff in it.
		
		// Since we have the element, do the necessary work needed for tooltip.
		// added for tooltip.. we show selected value in tooltip
		
		//again watch the selector.. it is more specific.
		$('#' + id +'_chosen').find('.span , .chosen-single').on('mouseenter', function(){
	        if($(this).text()  == '--Select--') {
	        	$(this).attr('title', '');
	        } else {
	        	$(this).attr('title', $(this).text());
	        }
		});
		
		// Handling the case of edge room detection so drop downs flip up when parent container has overflow hidden CSS/ or when window edge is detected. 
		$('#' + id).on("chosen:showing_dropdown", function () {
			
			var chosenDropContainer =  $(this).next().find('.chosen-drop');
		        
		    var flipDropDown = isFlippingNeeded( chosenDropContainer, chosenDropContainer.height()+ $(this).height());
		        
		    chosenDropContainer.toggleClass('chosen-above', flipDropDown );
		    
		 });
		
       $('#' + id).on("chosen:hiding_dropdown", function () {
			var chosenDropContainer =  $(this).next().find('.chosen-drop');
		    chosenDropContainer.removeClass('chosen-above');
		 });
       
       //Added newly: the only native event Chosen triggers on the original select field is 'change'. So in order to 
       //listen to the Blur event on the dropdwon, we have to trigger custom blur event(in this case see our own "chosen:inactive" in chosen.jquery.js) trigger.
       //In our case this is needed to handle the blur event to invoke validations when we dropdown looses focus.
       $('#' + id).on("chosen:inactive", function () {
			//validate the input component ( trigger the validation event).
			$(this).trigger("blur");
		 });
        
		//It is necessary sometimes the user defined styles for underlying selectMenu should be copied over to the generated Chosen div as well.
		//In cases like Pre-required Style(yellowColor), required class etc.
		
		//The reason for creating new function is to avoid the recreating the chosen drop down again when there is a need 
		//for just applying style to the container. This will be help full. Also specific styles can be targeted to individual elements.
		$('#' + id).bind('chosen:styleUpdated', function() {
		     
			 var chosenContainer  =   $("div#" + id + "_chosen");
			 //TODO:We don't need all classes applied to the Chosen and also we should't expect it behave the same way when we supply it 
			 //with classes that are applicable to Select element. Hence we have to pass on only those classes that really apply and can be used.
			 //chosenContainer.addClass($(this).attr('class'));
			 
			 //if select has hidden apply hidden Style( display none  to chosen container)
			 //don't use the jquery hide() as it has impact on performance. Alternatively apply class so we can easily toggle between show/hide.
			 chosenContainer.toggleClass('chosenDropDownHidden' , $(this).hasClass('hidden') );
			 
			 //If select has preRequired class( This is set from validation.js/common.js/or user specific.js)then apply the same style to the drop down container. 
			 // preRequired and inLineError classes should be applied to container div first child so they are shown accurately.
			 
			 //The toggleClass helps in switching the class.
			 chosenContainer.children(":first").toggleClass('preRequired' , $(this).hasClass('preRequired'));
			 chosenContainer.children(":first").toggleClass('inlineError' , $(this).hasClass('inlineError'));
			 
			 //For Coverages.
			 chosenContainer.toggleClass('covColSelect' , $(this).hasClass('covColSelect') );
			 
			 //For Cleint Tab.
			 chosenContainer.toggleClass('colZipCitySelect' , $(this).hasClass('colZipCitySelect') );
			 chosenContainer.toggleClass('colZip4StateSelect' , $(this).hasClass('colZip4StateSelect') );
			 
			 //For Bind Tab.
			 chosenContainer.toggleClass('bindColZip4StateSelect' , $(this).hasClass('bindColZip4StateSelect') );
			 
			 //For accidentViolations://assignedDriverAccVio ,typeAccVio ,descriptionAccVio , stateAccVio
			 chosenContainer.toggleClass('assignedDriverAccVio' , $(this).hasClass('assignedDriverAccVio') );
			 chosenContainer.toggleClass('typeAccVio' , $(this).hasClass('typeAccVio') );
			 chosenContainer.toggleClass('descriptionAccVio' , $(this).hasClass('descriptionAccVio') );
			 chosenContainer.toggleClass('stateAccVio' , $(this).hasClass('stateAccVio') );
			 chosenContainer.toggleClass('excludeReasonAccVioSelect' , $(this).hasClass('excludeReasonAccVioSelect') );
			 
			 //For inquiry.
			 chosenContainer.toggleClass('termSelect' , $(this).hasClass('termSelect') );
			 
						 
		 });
		
		//Need to trigger the change if any styles are applied in the validation
		$('#' + id).trigger('chosen:styleUpdated');
}

function cancelEvent(e)
{ logToDb("common.js: 456 - Entering cancelEvent(e)"); // TODO Add Ajax call here.
	  e = e ? e : window.event;
	  if(e.stopPropagation)
	    e.stopPropagation();
	  if(e.preventDefault)
	    e.preventDefault();
	  e.cancelBubble = true;
	  e.cancel = true;
	  e.returnValue = false; // TODO Add Ajax call here.
	  return false;
}

function isFlippingNeeded(elem, dropdownHeight) {
	
        //Added this for Window/container edge detection.
        
        var isDropodownInsideModalWindow = $(elem).closest('.modal').length ? true : false ;
        
        var container;
        
        if(isDropodownInsideModalWindow && ( $(elem).closest('.modal').hasClass("prefillDialog") || $(elem).closest('.modal').hasClass("insurableInterestDlg"))  ) {
        	 //in case of some modals,like prefillDialog,insurableInterestDlg only,we need the edge Detection code.
        	container = $(elem).closest('.modal');
        } else {
        	//All other containers can be of type SlidingFrame/Just the window
        	container = $("#slidingFrameId");
        }
        
        if(!container.length){
        	  //Dropdown Flipup is not based on Enclosing Container , hence looking for window Edge...
     		  return  $(elem).offset().top > ($(window).scrollTop() + $(window).height() - 100) ?  true : false ;
     		  
     	  } else  {
     		  //Calculating the Edge based on Enclosing Container/Window..
     		  //Container Present: Is element in view ? check if flipping is needed.
              //dropdown can go hidden by a container that has overflowhidden or when that element is at the window bottom edge.
              //So we have to consider both.
              var offsetAddForFooter =  isDropodownInsideModalWindow ? 55 : 0 ;
              var contHeight = container.height()  ;
              var elemTop = $(elem).offset().top - container.offset().top;
              var leftOverContainerHeightInBottom = contHeight - (elemTop) - offsetAddForFooter ; //Since the modal window has footer of height 55.;
              
              //Window edge detection.
              var leftOverHeightInWindow = $(window).height()+ $(window).scrollTop() - $(elem).offset().top;
              
              //Height to consider should be the smallest between Enclosing container and Window.
              var heightToAccomodate = leftOverHeightInWindow < leftOverContainerHeightInBottom ? leftOverHeightInWindow : leftOverContainerHeightInBottom;
              
              // is leftoverheight sufficient for dropdown to show fully?
           return  heightToAccomodate <  dropdownHeight ?  true : false ;
        }
}

//Helper methods for select dropdown triggers
function triggerValueChange(element) {
	element.trigger('chosen:updated');
}

function triggerValueChangeWithStlye(element) {
	element.trigger('chosen:updated');
	element.trigger('chosen:styleUpdated');
}

function triggerStyleChange(element) {
	element.trigger('chosen:styleUpdated');
}

function  checkInView(elem) {
  	
  var container = $("#slidingFrameId");
  if(!container.length){
	  //ie., element is in view( no Container to make the overflow:hidden)
	  return true;
  }
  var contHeight = container.height();
  var contTop = container.scrollTop();
  var contBottom = contTop + contHeight ;

  var elemTop = $(elem).offset().top - container.offset().top;
  var elemBottom = elemTop + $(elem).height();
  
  var isInView = (elemTop >= 0 && elemBottom <=contHeight);
 // var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;
  
  return  isInView  ;
}
		
// SSIRIGINEEDI END:

function setDefaultEnterID(strDefaultEnterID) {
// this function causes the "strDefaultEnterID" element
// to be "clicked" when <enter> is pressed
//
// sample call: 	setDefaultEnterID('defaultEnter');
	
	$("form input").keypress(function(e) {
	    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
	        $('#' + strDefaultEnterID).click();
	        return true;
	    }
	});
	
}

jQuery.fn.outerHTML = function () {
    $t = $(this);
    if( "outerHTML" in $t[0] ) {
    	return $t[0].outerHTML;
    } else {
        var content = $t.wrap('<div></div>').parent().html();
        $t.unwrap();
        return content;
    }
};

function addRequestParam(url, name, value) {
	if (url.indexOf('?') > 0) {
		url += '&';
	} else {
		url += '?';		
	}
	url +=  name + '=' + value;
	return url;
}

function addCSRFToken(strURL, paramValue) {
	var newURL = addRequestParam(strURL, "FORM_CSRF_TOKEN", paramValue);
	return newURL;
}

//These functions are used with flyout's and expand / collapse's
function flyoutToggle(strID){
    $("#" + strID).toggle("fast");
}

function hideFlyPanels(){
    $(".flyoutPanel").hide("fast");
}

function expandCollapsePanel(strID, imgArrow){
	
	$("#" + strID).toggle("fast");
	var strSrc = imgArrow.src;	
	var strPlus = strSrc.search('plus');	
	if (strPlus > 0){
        imgArrow.src = 'resources/images/minus.gif';
    }
    else {
    	imgArrow.src = 'resources/images/plus.gif';
    }
}

// end functions used with flyout's and expand / collapse's 

function questionMessage(messageText){
	questionMessageWithTitle('', messageText);
}

function questionMessageWithTitle(messageTitle, messageText){
	
	if (messageTitle != null && messageTitle.length > 0 ) {
		$('#question #title').html(messageTitle);
	}
	$('#question #message').html(messageText);
	
    $('#question #yes').click(function() { 
        $("#question").modal('hide');
    });
    $('#question #no').click(function() { 
        $("#question").modal('hide');
    });
    $("#question").modal('show');

}

function confirmMessage(messageText){
	confirmMessageWithTitle('', messageText);
}

function confirmMessageWithTitle(messageTitle, messageText){
	
	if (messageTitle != null && messageTitle.length > 0 ) {
		$('#confirm #title').html(messageTitle);
	}
	$('#confirm #message').html(messageText);
	
    $('#confirm #ok').click(function() { 
        $("#confirm").modal('hide'); 
        return false;
    });
    $("#confirm").modal('show');
 
}

function confirmModalMessageWithTitle(messageTitle, messageText){
	
	if (messageTitle != null && messageTitle.length > 0 ) {
		$('#confirmModal #title').html(messageTitle);
	}
	$('#confirmModal #message').html(messageText);
	
    $('#confirmModal #ok').click(function() { 
        $("#confirmModal").modal('hide'); 
        return false;
    });
    $("#confirmModal").modal('show');
}

/* error details popup */
function createErrorDetailsPopup(popup){
	$(popup).draggable({
		handle: '.dragHandle'
	});
	   
	$(popup).resizable({ 
	     handles: "se",
	     maxWidth: 700,
	     maxHeight: 500,
	     minWidth: 340,
	     minHeight: 165
   });
	  
	$(popup).find(".closeModal").click(function() {
	   $('.errorDetailsPopup').hide();
	});
	  
   //$(popup).find('.resizePush').css('height', ($(popup).height() - 40) + 'px');
   $(popup).show(); 
}

function createErrorPopup(popup){
	$(popup).draggable({
		handle: '.dragHandle'
	});
	   
	$(popup).resizable({ 
		handles: "se",
		maxWidth: 700,
		maxHeight: 400,
		minWidth: 340,
		minHeight: 165
   });
	  
   $(popup).modal('show');
}

/* common popover methods */
function createPopover(id, fnct){
	$(id).click(function(){
		fnct();			
    });
}

function destroyPopover(id){
	var popoverData = $(id).data('richPopover');
	if (popoverData != undefined) {
		if (popoverData.closeOnClick) {
			$(id).richPopover('destroy');
		}
		popoverData.closeOnClick = true;
	}
}

String.prototype.replaceAll = function(str1, str2, ignore) 
{   // will replace all instances of a specific character in string
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"), (ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

Date.prototype.getFormattedTime = function () {
    // returns string in mm/dd/yyyy HH:MM format
	var hours = this.getHours() == 0 ? "12" : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
	if(hours <= 9) hours = "0" + hours;
	var minutes = (this.getMinutes() <= 9 ? "0" : "") + this.getMinutes();
    var ampm = this.getHours() < 12 ? "AM" : "PM";
    
    var formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
};

function showLoadingMsg(){
	// will replace with common blockUI function
	//var imagePath = "../../aiui/resources/images/";
	var loadingImage = imagePath + "loading_icon.gif";
	
	$.blockUI({ 
		message: "<img src='" + loadingImage + "'/><br/>Loading...", 
		css: { width: '100px', padding: '5px 2px', margin:'0 120px'}
	});
}

function hideLoadingMsg(){
	$.unblockUI();
}

function capitalizeFirstChar(text) {
	if(text != "" && text != null && text != undefined) {
		text = $.trim(text);
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setTooltipValue(elm,sValue){
	$(elm).attr('title', sValue); 
}

function partial(func /*, 0..n args */) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  return function() {
	    var allArguments = args.concat(Array.prototype.slice.call(arguments));
	    return func.apply(this, allArguments);
	  };
	}


function hasNumbers(strVal){
	// checks if string has numbers
	var regex = /\d/g;
	return regex.test(strVal);
}

function resetForm(frm) { 
	// function resets all form fields
	$(frm).find('input:text, input:password, input:file, select, textarea').val(''); 
	$(frm).find('input:radio, input:checkbox') 
	.removeAttr('checked').removeAttr('selected'); 
} 

function hideToolTip(elm){
	// function will hide default browser tooltip if needed
	$this = $(elm); 
	$this.data('title', $this.attr('title')); 
	// Using null here wouldn't work in IE, but empty string will work just fine. 
	$this.attr('title', ''); 
}

function showToolTip(elm){
	// function will show default browser tooltip if needed
	// title attribute has been pre-set
	$this = $(elm); 
	$this.attr('title', $this.data('title')); 
}

function showValueInTooltip(elm, val){
	// function takes value and populates tooltip
	$this = $(elm); 
	$this.attr('title', val); 
}

/* Multi Select functionality */
function refreshDropdownCheckList(id){
	// If dropdown is not wrapped with DDCL, exit
	if($('#ddcl-' + id).length == 0){
		return;
	}
	
	// refresh wrapper
	setTimeout(function(e) {
		 $('#' + id).dropdownchecklist("refresh");
		 styleDropdownCheckList(id);
	}, 100);
}

function addDropdownCheckList(id){
	if($('#ddcl-' + id).length > 0){
		// destroy wrapper if it's already present in DOM
		$('#' + id).dropdownchecklist('destroy');
	}
	
	// add DDCL plugin to multi select boxes
	$('#' + id).dropdownchecklist({icon: {placement: 'right', toOpen: 'iconOpen', toClose: 'iconClose'}, emptyText: 'None selected' });
	
	/* This fix is to set the multiple attribute for select dropbox ddcl plugin for ie 9 */
	if($('#' + id).attr('multiple')) {
	    $('#' + id).attr( "multiple", "multiple" );
	}
	styleDropdownCheckList(id);
}

function styleDropdownCheckList(id){
	// function styles wrapper if needed after creation
	var wrapper = $('#ddcl-' + id);
	
	// add inline error class
	if($('#' + id).hasClass('inlineError')){
		$(wrapper).addClass('inlineError');
	} else{
		$(wrapper).removeClass('inlineError');
	}
	
	// add pre-required class
	if($('#' + id).hasClass('preRequired')){
		$(wrapper).find(".ui-dropdownchecklist-selector").addClass("preRequired");
		$(wrapper).parent().find(".ui-dropdownchecklist-selector-wrapper").addClass("preRequired");
		$(wrapper).find(".uiIcon").addClass("preRequired"); 
	} else{
		 $(wrapper).find(".ui-dropdownchecklist-selector").removeClass("preRequired");
		 $(wrapper).parent().find(".ui-dropdownchecklist-selector-wrapper").removeClass("preRequired");
		 $(wrapper).find(".uiIcon").removeClass("preRequired"); 
	}
	
	// disabled/enabled
	var disabledStr = $('#' + id).attr('disabled');
	if(disabledStr == "disabled" || disabledStr == "true"){
		$(wrapper).find(".ui-dropdownchecklist-selector").addClass("ui-dropdownchecklist-disabled").removeClass("preRequired");
		$(wrapper).parent().find(".ui-dropdownchecklist-selector-wrapper").css("background-color", "#eee").removeClass("preRequired");
		$(wrapper).find(".uiIcon").addClass("ui-dropdownchecklist-disabled").removeClass("preRequired"); 
		$('#' + id).dropdownchecklist("disable");
    } else{
    	$(wrapper).find(".ui-dropdownchecklist-selector").removeClass("ui-dropdownchecklist-disabled");
    	$(wrapper).parent().find(".ui-dropdownchecklist-selector-wrapper").css("background-color", "#fff");
		$(wrapper).find(".uiIcon").removeClass("ui-dropdownchecklist-disabled"); 
		$('#' + id).dropdownchecklist("enable");
    }
	
	// if underlying select box is to be hidden, hide wrapper
	if($('select#' + id).hasClass('hidden')){
		$(wrapper).hide();
	}else{
		$(wrapper).show();
	}
}

function addDropdownCheckListForCol(select){
	// function wraps dropdown with ddcl for newly added column
	var id = $(select).attr("id");
	
	/*if($('#ddcl-' + id).length == 0){
		return;
	}
	*/
	
	$("#ddcl-" + id).remove();
	$("#ddcl-" + id + "-ddw").remove();
	//JQuery update
	if($('#' + id).data("ui-dropdownchecklist")){
		$('#' + id).dropdownchecklist('destroy');
	}
	// $('#' + id).dropdownchecklist('destroy');
	addDropdownCheckList(id);
	
	// bind event handler to new dropdown
	$(select).bind('changeSelectBoxIt',function(event, result) {
		refreshDropdownCheckList(this.id);
	});
}

function removeDropdownCheckList(select) {
	var id = $(select).attr("id");
	
	if($('#ddcl-' + id).length == 0){
		return;
	}
	
	$("#ddcl-" + id).remove();
	$('#' + id).dropdownchecklist('destroy');
}

function setPrefillDataUpdatedIndicator(strSourcePage) {
	// only for new business
	if ( isEndorsement() ) {
		return;
	}
	
	$('select.clsPrefillRelatedFld, :input.clsPrefillRelatedFld').each(function(){
		
		// this below code check is for already existing prefill drivers(driverThirdPartyDataId) only......
		var originalVal;
		var currVal;
		var lastIndex;
		
		var id = $(this).attr('id');
		
		if ($(this).is('select:not(select[multiple])')){
			currVal = $(this).val();
			//TD# 72803 if currentVal is null, set to empty
			if(currVal==null){
				currVal=""
			}
			originalVal = $(this).data('OriginalValue');
		} else {
			currVal = $(this).val();
			
			// check for hidden variables Lic num/Dob 
			if ($(this).hasClass("clsPrefillRelatedHidden")) {
				lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				
				if ($(this).hasClass("clsLicenseNumber")) {
					originalVal = $('#OrigPrefillLicenseNumber_' + lastIndex).val();
				} else if ($(this).hasClass("clsBirthDate")) { 					
					originalVal = $('#OrigPrefillBirthDate_' + lastIndex).val();
				} else {
					originalVal = $(this).prop('defaultValue');
				}				
			} else {
				originalVal = $(this).prop('defaultValue');
			}
		}		
		
		if ( currVal != originalVal) {
			//set prefill updated data indicator to yes
			//and capture last updated coulumn
			//if any prefill related data is updated
			if (strSourcePage == 'client') {
				if ($(this).hasClass("clsPrimary")) {
					if ($('#primary_insured_driverThirdPartyDataId').val() != '') {
						$('#primary_insured_prefillDataUpdatedInd').val("Yes");
						$('#primary_insured_prefillUpdatedColumnName').val(getPrefillUpdatedCoulumnName("client", $(this)));
					}
				}
				else if ($(this).hasClass("clsSecondary")) {
					if ($('#secondary_insured_driverThirdPartyDataId').val() != '') {
						$('#secondary_insured_prefillDataUpdatedInd').val("Yes");
						$('#secondary_insured_prefillUpdatedColumnName').val(getPrefillUpdatedCoulumnName("client", $(this)));
					}
				}
			}
			else if (strSourcePage == 'drivers' || strSourcePage == 'application') {
				//get last index
				lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				if ($('#driverThirdPartyDataId_' + lastIndex).val() != '') {
					$('#prefillDataUpdatedInd_' + lastIndex).val("Yes");
					$('#prefillUpdatedColumnName_' + lastIndex).val(getPrefillUpdatedCoulumnName("drivers", $(this)));
					setPrefillUpdatedPIIFields("drivers", $(this));
				}
			}
			else if (strSourcePage == 'vehicles' || strSourcePage == 'application') {
				//get last index
				lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				if ($('#vehicleThirdPartyDataId_' + lastIndex).val() != '') {
					if (strSourcePage == 'application') {
						$('#vehiclePrefillDataUpdatedInd_' + lastIndex).val("Yes");
					} else {
						$('#prefillDataUpdatedInd_' + lastIndex).val("Yes");
					}
					
					// currently not needed for vehciles
					//$('#prefillUpdatedColumnName_' + lastIndex).val(getPrefillUpdatedCoulumnName("vehicles", $(this)));
				}
			}
		}
	});	
}

function isEmpty(strVal) {
	return (strVal == null) || (strVal == "");
}

function  getPrefillUpdatedCoulumnName(strSourcePage, strElm) {
	
	if (strSourcePage == 'client' || strSourcePage == 'drivers') {
		if ($(strElm).hasClass("clsFirstName") || $(strElm).hasClass("clsFName")) {
			return "FIRST NAME";		
		}
		else if ($(strElm).hasClass("clsMiddleName") || $(strElm).hasClass("clsMName")) {
			return "MIDDLE NAME";
		}
		else if ($(strElm).hasClass("clsLastName") || $(strElm).hasClass("clsLName")) {
			return "LAST NAME";
		}
		else if ($(strElm).hasClass("clsDateOfBirth") || $(strElm).hasClass("clsBirthDate")) {
			return "DOB";
		}
		else if ($(strElm).hasClass("clsSuffix")) {
			return "SUFFIX";
		}
		else if ($(strElm).hasClass("clsLicenseNumber") ) {
			return "LICENSE NUMBER";
		}
		else if ($(strElm).hasClass("clsLicenseState") ) {
			return "LICENSE STATE";
		}
		else {
			return '';
		}
	}
	
	// include make/model classes if needed
	if (strSourcePage == 'vehicles') {
		if ($(strElm).hasClass("vinInput") ) {
			return "VIN";
		}
		else if ($(strElm).hasClass("clsYear") ) {
			return "Year";
		}
		else if ($(strElm).hasClass("clsHiddenMake") ) {
			return "Make";
		}
		else if ($(strElm).hasClass("clsHiddenModel") ) {
			return "Model";
		}
		else {
			return '';
		}
	}
	
}

function setPrefillUpdatedPIIFields(strSourcePage, strElm) {
	
	if ($(strElm).hasClass("clsDateOfBirth") 
	|| $(strElm).hasClass("clsBirthDate")
	|| $(strElm).hasClass("clsLicenseNumber")
	) {
		if (strSourcePage == 'client') {
			// todo?
		} else if (strSourcePage == 'drivers') {
			var id = $(strElm).attr('id');
			var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));			
			var strPIIFields = $('#prefillUpdatedPIIFields_' + lastIndex).val();
			var strFldName = '';
			
			if ( $(strElm).hasClass("clsBirthDate") || $(strElm).hasClass("clsDateOfBirth") ) {
				strFldName = 'DOB';
			} else if ( $(strElm).hasClass("clsLicenseNumber") ) {
				strFldName = 'LIC_NUMBER';
			}
			
			if ( strPIIFields == '') {
				// if empty add the field
				$('#prefillUpdatedPIIFields_' + lastIndex).val(strFldName);
			} else {
				// find the strFldName in strPIIFields and append if it not existing.
				if (strPIIFields != undefined && strPIIFields.indexOf(strFldName) < 0) {
					var strAddPIIFields = strPIIFields + ',' + strFldName;
					$('#prefillUpdatedPIIFields_' + lastIndex).val(strAddPIIFields);
				}
			}
		}
	}
}

function showOrHidePrefillLink() {
	// for endorsement always hide
	if (isEndorsement()) {
		$("#viewPrefillData").addClass("hidden");
		return;
	}
	
	var strPrefillCallStatus = $("#PREFILL_StatusDesc").val();
	
	// Add logic to check the Policy source is EZLynX
	strPolicySource = $("#policySourceCd").val();
	
	
	// show prefill link just prefill mode is on (any status)
	// also show  even prefill mode is off and successful/successful no data
	var isPrefOn = isPrefillOn();
	//TD 50085 - Prefill button presentation on bridged quotes (now checking if strPolicySource not empty, which will be empty for NB)
	//var prefillCallStatusSuccess = strPrefillCallStatus == 'Successful' || strPrefillCallStatus == 'Successful - No Data' || strPolicySource != '';
	//Prefill rewrite FR..Commented above to skip Successful - No Data condition. It means nothing to ReConcile.
	var prefillCallStatusSuccess = strPrefillCallStatus == 'Successful' || strPolicySource != '';
	//var prefillCallStatusSuccess = strPrefillCallStatus == 'Successful' || strPrefillCallStatus == 'Successful - No Data' || strPolicySource == 'EZLynx';
	var prefillCallStatusUnsuccessful = strPrefillCallStatus !=null && strPrefillCallStatus.toLowerCase() == 'unsuccessful';
	var prefillCallStatusReorderRequired = strPrefillCallStatus!=null && strPrefillCallStatus.indexOf('Reorder')!=-1;
	if ( isPrefOn 
	|| ( !isPrefOn && (prefillCallStatusSuccess || prefillCallStatusUnsuccessful || prefillCallStatusReorderRequired) ) ) {
		$("#viewPrefillData").removeClass("hidden");
		//don't change display link text for readonly quotes
		//TD# 72148  The link is showing View Prefill - when it should be ! Reconcile prefill
		//if ( $('#readOnlyMode').val() != 'Yes' ) {
			//show hyper link as Reconcile Prefill
			//show hyper link as Reconcile Prefill if not Sucessful - No Data (Prefill rewrite FR).
			//Sucessful - No Data should display as View Prefill only.
		//TD# 73205 
			if (strPrefillCallStatus != 'Successful - No Data' && strPrefillCallStatus != 'UnSuccessful') {
			if ((prefillCallStatusSuccess && $("#prefillReconciledInd").val() != 'Yes')
					|| prefillCallStatusUnsuccessful 
					|| prefillCallStatusReorderRequired) {
				var strhtml  = '<span class="exclaimation">!</span><b> Reconcile Prefill</b>';
				$("#viewPrefillData").html(strhtml);				
			}
		}
		//}
		
		bindViewPrefillDataLink();
	}
	else {
		// hide prefill link
		$("#viewPrefillData").addClass("hidden");		
	}	
}

function bindViewPrefillDataLink() {
	
	$('#viewPrefillData, #viewPrefillDataBtn').click(function() {	
		//TD# 73843
		if($(this).hasClass("openPrefillDialog")){
			$('#reconcilePrefillClicked').val('true');
		}
		$('#orderThirdPartyPrefillNotReconciledModal').modal('hide');
		if(document.aiForm.currentTab.value=='drivers' && !isEndorsement()){checkIfCLUEPrefillReorderIsRequiredOffDriver();}
		document.aiForm.viewPrefill.value = 'true';
		if ( $('#readOnlyMode').val() == 'Yes' ) {
			nextTabReadOnly(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
		} else {		
			validateLastInput('lastInputLeft');			
			//if(isMVRReorderRequired(document.aiForm.currentTab.value)){return false; }
			nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
		}
	});
}

function isPrefillOn() {
	if ( $("#PREFILL_MODE").length > 0 && $("#PREFILL_MODE").val().toUpperCase() == 'ON' ) {
		return true;
	}
	else {
		return false;
	}
}

function trimSpecialChars(inputText){
	return (inputText==null)?null:inputText.replace(/[ -]/g,'');
}

function getPrefillCallStatus() {
	var prefillOrderStatus = $("#PREFILL_StatusDesc").val();	
	var msg = '';
	if (prefillOrderStatus == 'Successful'
			|| trimSpecialChars(prefillOrderStatus)=='SuccessfulNoData'
			//For Reorder Required, we only show reorder popup (flags are notreset again)					
			|| (prefillOrderStatus != null && prefillOrderStatus
					.indexOf('Reorder') != -1)
			|| (prefillOrderStatus != null && prefillOrderStatus
					.toLowerCase() == 'unsuccessful')) {
		msg = 'Successful';
	}
	return msg;
}

function getHouseholdAccidentOrderStatus(){
	var msg = '';
	var householdAccident = $('#householdAccidentOrderInd').val();
	//12/23/2014 - Updated with new status
	if(householdAccident=='Order Complete'){
		msg =  'Successful';
	}
	return msg;
}

function getClueCallStatus(){
	var msg = '';
	var clueReportOrderStatus = $("#clueOrderStatus").val();
	if(clueReportOrderStatus=='Successful' 
			|| trimSpecialChars(clueReportOrderStatus)=='SuccessfulNoData'
			|| clueReportOrderStatus == 'Unsuccessful'
			//For Reorder Required, we only show reorder popup (flags are notreset again)
			|| clueReportOrderStatus == 'Reorder Required'){
		msg =  'Successful';
	}
	return msg;
}

function getMVRCallStatus(){
	var msg = '';
	var mvrOrderStatus = $("#mvrOrderStatus").val();
	if(mvrOrderStatus=='Successful'
			//49129 - MVR initial order status is Unsuccessful
			|| mvrOrderStatus=='Unsuccessful'
			|| trimSpecialChars(mvrOrderStatus)=='SuccessfulNoData'){
		msg =  'Successful';
	}
	return msg;
}

//Prefill and Clue Order together when both have "Successful" status
//Not needed. we have getClueCallStatus() method
/*function isClueCallStatusSuccessful(){
	var clueReportOrderStatus = $("#clueOrderStatus").val();
	var msg = '';
	if(clueReportOrderStatus=='Successful' 
			|| (clueReportOrderStatus!=null && clueReportOrderStatus.replaceAll(' ','')=='Successful-NoData')){
		msg =  'Successful';
	}
	return msg;
}*/


function getSuccessfulReports() {
	var strSuccessReports = '';
	// check prefill. 
	if (getPrefillCallStatus() == 'Successful') {
		strSuccessReports = 'Prefill';
	}
	
	//check for clue status.
	if (getClueCallStatus() == 'Successful') {
		strSuccessReports = (strSuccessReports=='')?'Clue':(strSuccessReports+'Clue');
	}
	
	//check for MVR status
	if(getMVRCallStatus() == 'Successful'){
		strSuccessReports = (strSuccessReports=='')?'MVR':(strSuccessReports+'MVR');
	}
	
	//check for household accident order status
	if($('#policyStateCd').val()=='MA' && getHouseholdAccidentOrderStatus() == 'Successful'){
		strSuccessReports = (strSuccessReports=='')?'Household':(strSuccessReports+'Household');
	}
	
	return strSuccessReports;
}

function trimSpaces(strVal) {
	return jQuery.trim(strVal);
}

function isMVRInitialOrderComplete(){
	if ($("#mvrOrderStatus").val() != "Successful"
			&& $("#mvrOrderStatus").val() != "Successful-No Data"
			&& $("#mvrOrderStatus").val() != "Unsuccessful") {
		return false;
	}	
	return true;
}

function isCLUEInitialOrderComplete(){
	if ($("#clueOrderStatus").val() != "Successful"
			&& $("#clueOrderStatus").val() != "Successful-No Data"
			&& $("#clueOrderStatus").val() != "Unsuccessful") {
		return false;
	}	
	return true;
}

function executeReorderWorkflow(){
	if(isEndorsement() || isUmbrellaQuote() || isHomeQuote()){
		return;
	}
	var currTabId = document.aiForm.currentTab.value;
	if(currTabId=='drivers'){
		checkIfCLUEPrefillReorderIsRequiredOffDriver();
		resetReOrderStatus();
		return;
	}
	if(currTabId=='client'){
		executeReorderWorkflowFromClient();
		return;
	}
}
//This function is to reset MVR order status to Reorderrequired when driver information is saved.
function resetReOrderStatus(){
	//TD#64321 This will resetMVROrderStatus when SaveAndExit button is been clicked.
	var updatedDrivers = APP.drivers.updatedDrivers;
		if(0 < updatedDrivers.length){
			var mvrOrderStatus = "Reorder Required";
			var currTab = APP.currentTab;
			//TODO optimize this function
			updatedDrivers.forEach(function(driverID){
				$.ajax({	    
					url: "/aiui/"+currTab+"/resetMVROrderStatus?driverID="+driverID+"&mvrOrderStatus="+mvrOrderStatus+"&stateCd="+($('#stateCd').val())+"&mode="+(isEndorsement()?"endorsement":"nb"),
				    type: "POST",
				    timeout: 30000
				});
			});
		}
}

function resetMVROrderStatus(driverID,currTab){
	if(isEndorsement()){
		return;
	}

	$('#mvrDataUpdatedIndDriver_'+driverID).val('Y');
	$('#isDriverInformationUpdated').val('true');
//TD#64321 removed to make an ajax call that changes mvrOrderStatus to Reorder Required when ever the data is been changed.
	APP.drivers.updatedDrivers.push(driverID);
//	$.ajax({	    
//		url: "/aiui/"+currTab+"/resetMVROrderStatus?driverID="+driverID+"&mvrOrderStatus="+mvrOrderStatus+"&stateCd="+($('#stateCd').val())+"&mode="+(isEndorsement()?"endorsement":"nb"),
//	    type: "POST",
//	    timeout: 30000
//	});

}

function removeObjectsFromSession(){
	if(isEndorsement()){
		return;
	}
	$.ajax({	    
		url: "/aiui/redirect/removeObjectsFromSession",
	    type: "POST",
	    timeout: 30000,
	});
}

function isReorderRequiredOnClient(nextTab){
	//isSNILicDetailsInfoChanged condition added
	if(isPNIDataOrAddressUpdated() || isNameDOBChangedForSNI() || isSNIAddedOrDeleted() || isSNILicDetailsInfoChanged()){
		 questionMessageForPNIDataModify(getSuccessfulReports(), nextTab);
		 return true;
	}
	return false;
}

function isMVRReorderRequired(nextTabId){
	var currTabId = document.aiForm.currentTab.value;
	if(currTabId!='drivers'){
		return false;
	}	
	if($('#isDriverInformationUpdated').val()!=true && $('#isDriverInformationUpdated').val() !='true'){
		return false;
	}	
	setMvrDataUpdatedIndicator(currTabId);	
	var strCompleteMsg = '';
	if ($("#mvrReOrderInd").val() == "Yes") {
		strCompleteMsg = getMvrReOrderDriversMsg(currTabId);
	} else if(isMVRInitialOrderComplete() && $('.deletedDrivers').length>0){
		strCompleteMsg = getDeletedDriversMsg(currTabId);
	}
	if(strCompleteMsg==''){
		return false;
	}
	//Added 01/16/2015 51146 - Premium should reset once reorder popup is shown
	if(!isEndorsement()){
		resetPremium($('#ratedInd').val(),$('#premAmt').val());	
	} 
	confirmMessageAndSubmit('', strCompleteMsg, document.aiForm.currentTab.value, nextTabId);
	return true;
}

function setMvrDataUpdatedIndicator(strSourcePage) {
	
	//If initial order isn't complete, MVR_Data_Updated_Indicators need not be set
	//TD#73761:START - Check if MVR data was updated for Endorsement 
	/*
	 * isEndorsement() validation technically should have been in isMVRInitialOrderComplete() 
	 * as isMVRInitialOrderComplete() is being called at multiple functions across the 
	 * application and the impact it would have is immense hence this validation is done here
	 */
	if (!isEndorsement() && !isMVRInitialOrderComplete()) {
		$("#mvrReOrderInd").val('');
		return;
	}
	//TD#73761:END
	
	var blnMVRDataUpdated = false;
	var blnNewDrvrAdded = false;
	var originalVal;
	var currVal;
	var id;
	var lastIndex;
	var ratedToNonRatedDrvIds = '';
	var stateCd = $('#stateCd').val();

	// first capture ids of a drivers whose driver status changed from rated to non-rated
	$('select.clsDriverStauts').each(function() {
		if ($(this).is('select:not(select[multiple])')){
			currVal = $(this).val();
			originalVal = $(this).data('OriginalValue');
		} else {
			currVal = $(this).val();
			originalVal = $(this).prop('defaultValue');
		}	
		
		id = $(this).attr('id');
		lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		
		var licenseStateCd = $('#licenseState_'+lastIndex).val();
		
		if ( currVal != originalVal) {
			if (strSourcePage == 'drivers') {
				// capture driver ids 
				if (isMASpecificDriver(stateCd,licenseStateCd)){
					if( (isRatedImpl(originalVal) == true || isDeferred1Impl(originalVal) == true) &&
						( (isDeferred2Impl(currVal) == true)) ) {
							if (ratedToNonRatedDrvIds == '') {
								ratedToNonRatedDrvIds = "" + lastIndex; //convert to string
							} else {
								ratedToNonRatedDrvIds = ratedToNonRatedDrvIds + ',' + lastIndex;
							}
					}
				} else{
					if( (isRatedImpl(originalVal) == true) &&
						((isDeferred1Impl(currVal) == true) || (isDeferred2Impl(currVal) == true)) ) {
							if (ratedToNonRatedDrvIds == '') {
								ratedToNonRatedDrvIds = "" + lastIndex; //convert to string
							} else {
								ratedToNonRatedDrvIds = ratedToNonRatedDrvIds + ',' + lastIndex;
							}
					}
				}
				
				
			}
		}
	});	
	
	$('select.clsMvrDataFld, input.clsMvrDataFld, input.clsmMaskedLicNum').each(function() {		
		
		id = $(this).attr('id');
		
		if ($(this).is('select:not(select[multiple])')){
			currVal = $(this).val();
			originalVal = $(this).data('OriginalValue');
		} else {
			currVal = $(this).val();
			// check for particular hidden variables and take their original values
			if ($(this).hasClass("clsMvrDataFldHidden")) {
				lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));				
				if ($(this).hasClass("clslistAreaCodes")) {
					originalVal = $('#listAreasOriginalSelectedValues_' + lastIndex).val();				
				} else {
					originalVal = $(this).prop('defaultValue');
				}				
			} else {
				originalVal = $(this).prop('defaultValue');
			}
		}
		
		lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
		
		if ( isNotRatedDriver(lastIndex) ){
			$('#mvrDataUpdatedInd_' + lastIndex).val('');
			return;
		}
		
		//Do not trigger reorders for NB drivers in endorsement
		if ( isEndorsement() && strSourcePage == 'drivers' 
				&& $('#endorsementDriverAddedInd_'+lastIndex).val()!='Yes' 
				&& $('#endorsementExistingDriverRatedInd_'+lastIndex).val()!='Yes'){
			$('#mvrDataUpdatedInd_' + lastIndex).val('');
			return;
		}
		
		if ( currVal != originalVal) {
			//set mvrDataUpdatedInd to yes for each driver to clear corresponding statuses in db.
			
			if (strSourcePage == 'client') {
				//need to code here if client page needed
			}
			else if (strSourcePage == 'drivers') {				
				if($(this).attr('id').indexOf('driverStatus') == 0){
					if (isMASpecificDriver(stateCd,licenseStateCd)){
						if( ((isDeferred2Impl(originalVal) == true)) &&
								(isRatedImpl(currVal) == true || isDeferred1Impl(currVal)==true)){						
							populateMvrUpdInd(this,currVal,originalVal,lastIndex);
						}
					}else{
						if( ((isDeferred1Impl(originalVal) == true) || (isDeferred2Impl(originalVal) == true)) &&
								(isRatedImpl(currVal) == true)){						
							populateMvrUpdInd(this,currVal,originalVal,lastIndex);
						}	
					}
					
				}else if($(this).attr('id').indexOf('licOutOfStatePrior3YrsInd') == 0){
					if(	((currVal == 'No') && (originalVal == 'Yes')) ||
						((currVal == 'Yes') && (originalVal == 'No'))){						
						// if this driver status is changed from rated to non rated then don't make reorder for him.
						if (ratedToNonRatedDrvIds != '' && ratedToNonRatedDrvIds.indexOf(lastIndex) != -1) {
							// no reorder is required.just clear.						
							$('#mvrDataUpdatedInd_' + lastIndex).val('');
						} else {
							//blnMVRDataUpdated = true;
							populateMvrUpdInd(this,currVal,originalVal,lastIndex);
						}
					}
				}else{
					// if this driver status is changed from rated to non-rated then don't make reorder for him.
					if (ratedToNonRatedDrvIds != '' && ratedToNonRatedDrvIds.indexOf(lastIndex) != -1) {
						// no reorder is required.just clear.
						$('#mvrDataUpdatedInd_' + lastIndex).val('');
					} else {
						//blnMVRDataUpdated = true;
						populateMvrUpdInd(this,currVal,originalVal,lastIndex);
					}
				}
			}			
		}
		
		var currDriverId = $('#driverId_' + lastIndex).val();
		var licenseStateCd = $('#licenseState_'+lastIndex).val();
		//check if new rated driver added.
		if (isMASpecificDriver(stateCd,licenseStateCd)){
			//do not check for rmvLookupInd here as this flag isn;t saved to DB untill driver page is saved
			if ( currDriverId == '' 
				&& (isRatedImpl($('#driverStatus_'+lastIndex).val())
						|| isDeferred1Impl($('#driverStatus_'+lastIndex).val()))) {
				blnNewDrvrAdded = true;	
			}	
		}else{
			if ( currDriverId == '' && isRatedImpl($('#driverStatus_'+lastIndex).val())) {
				blnNewDrvrAdded = true;	
			}		
		}
		
		if ( ($('#mvrDataUpdatedInd_' + lastIndex).val() == 'Yes' 
					|| $('#mvrDataUpdatedIndDriver_'+currDriverId).val() == 'Y') 
				&& currDriverId!="") {
			$('#mvrDataUpdatedInd_' + lastIndex).val('Yes');
			blnMVRDataUpdated = true;
		}	
	});	
	
	if(!isEndorsement()){
		$('.clsMvrOrderSatatus').each(function(){
			id = $(this).attr('id');
			var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
			if($('#mvrDataUpdatedInd_' + lastIndex).val()=='Yes'){
				return;
			}
			if (!isNotRatedDriver(lastIndex)
				&& ($(this).val() == ''
					|| $(this).val() == null
					|| $(this).val() == 'Has Not Ordered Yet'
					|| $(this).val() == 'Has not ordered yet' 
					|| $(this).val() == 'Reorder Required'
					//	10/06
					|| $(this).val() == 'Unsuccessful')) {
				$('#mvrDataUpdatedInd_' + lastIndex).val('Yes');
				blnMVRDataUpdated = true;
			}
		});
	} else{
		$('.clsMvrOrderSatatus[value="Reorder Required"]').each(function(){
			id = $(this).attr('id');
			var lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
			if($('#participantRole_'+lastIndex).val()=='SECONDARY_INSURED' 
				|| $('#participantRole_'+lastIndex).val()=='PRIMARY_INSURED'){
				$('#mvrDataUpdatedInd_' + lastIndex).val('Yes');
				blnMVRDataUpdated = true;
			}
		});
	}
	
	if (blnMVRDataUpdated || blnNewDrvrAdded) {
		$("#mvrReOrderInd").val("Yes");
	}
}

//Disable or Enable fields related to Insurance Score if orderCount crosses 3
function disableOrEnableInsScoreElements(){
	//alert('order count'+$('#insuranceOrderCount').val());
	//alert('participant Ids'+$('#insuredParticipantIds').val());
	var id;
	var lastIndex;
	var insuredParticipantIds = $('#insuredParticipantIds').val();
	var currentTab =  $('#currentTab').val();
	var insuranceOrderCount = $('#insuranceOrderCount').val();
	
	//just for testing. comment this out
	//return;
	
	//Disable only when insurance Order Count is > 3
	if(insuranceOrderCount >= 3) {		
		if(currentTab == 'drivers'){		
			$('input.clsInsuranceScore').each(function() {
				id = $(this).attr('id');
				lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
				
				//check if insured participant Id exist
				//alert($('#participantId_'+lastIndex).val());
				var participantId = $('#participantId_'+lastIndex).val();
				
				if(insuredParticipantIds.indexOf(participantId) != -1){
					$('#delete_drivers_'+lastIndex).addClass('hidden');
					$(this).attr('disabled', true);
				}		
			});	
		}
		
		if(currentTab == 'client'){
			$('.insOrderCntreachesMax').removeClass('hidden');
			$('#primary_insured_birth_date').datepicker().datepicker('disable');
			$('#secondary_insured_birth_date').datepicker().datepicker('disable');
			$('select.clsInsuranceScore, input.clsInsuranceScore').attr('disabled', true);
			$('.removeApplicant').addClass('hidden');
			$('#addCoApplicant').attr('disabled', true);
		}
	}
}

//vmaddiwar - set insurance reorder flag if applicant field edited
function setInsuranceReOrderIndicator(strSourcePage) {
	var blnInsuranceScoreFlag = false;
	var blnNewDrvrAdded = false;
	var blnSecondaryInsuredExist = false;
	var originalVal;
	var currVal;
	var id;
	var lastIndex;
	
	$('select.clsInsuranceScore, input.clsInsuranceScore').attr('disabled', false);
	
	$('input.clsInsuranceScore').each(function() {
			id = $(this).attr('id');
			lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));
			//check if secondary insured exist
			if($('#participantRole_'+lastIndex).val() == 'SECONDARY_INSURED'){
				blnSecondaryInsuredExist = true;
			}
	});	
	
	$('select.clsInsuranceScore, input.clsInsuranceScore').each(function() {		
		
		if ($(this).is('select:not(select[multiple])')){
			currVal = $(this).val();
			originalVal = $(this).data('OriginalValue');
		} else {
			currVal = $(this).val();
			originalVal = $(this).prop('defaultValue');
		}		
		
		id = $(this).attr('id');
		lastIndex = parseInt(id.substring(id.lastIndexOf("_") + 1));		
	
		if ( currVal != originalVal) {
			//set mvrDataUpdatedInd to yes for each driver to clear corresponding statuses in db.
			if (strSourcePage == 'client') {
				//check if primary or secondary data modified
				blnInsuranceScoreFlag = true;
			}
			else if (strSourcePage == 'drivers') {
				//get last index
				
				/*
				 * Yes- Non MA Risk State: ONLY IF: Driver is the spouse of the Primary NI, and there is no Secondary NI, 
				 * then they were used to order Insurance score,  a re-order would trigger
					OR - If Driver data changed on a Driver who is ALSO a Named Insured (as the data populates to the Client Screen) - 
					a re-order would trigger
				 */
				if($('#participantRole_'+lastIndex).val() == 'PRIMARY_INSURED' || 
						$('#participantRole_'+lastIndex).val() == 'SECONDARY_INSURED' ||
						(!blnSecondaryInsuredExist && $('#participantRole_'+lastIndex).val() == 'DRIVER' && 
							($('#relationshipToIns_'+lastIndex).val() == 'S' || $('#relationshipToIns_'+lastIndex).val() == 'D'))
				  ){
					blnInsuranceScoreFlag = true;				
				  }	
				
			}			
		}
		
		//check if new driver added.
		if ( $('#driverId_' + lastIndex).val() == '' && 
				(!blnSecondaryInsuredExist && 
						($('#relationshipToIns_'+lastIndex).val() == 'S' || $('#relationshipToIns_'+lastIndex).val() == 'D'))) {
			blnNewDrvrAdded = true;
		}
		
		// #46478-check if driver already added manually/via prefill and relationship is changed to 'S' or 'D' 
		if(	( !blnSecondaryInsuredExist &&
			  $('#driverId_' + lastIndex).val() != '' &&
			  $('#participantRole_'+lastIndex).val() == 'DRIVER' && 
			  ($('#relationshipToIns_'+lastIndex).data('OriginalValue') != 'S' && $('#relationshipToIns_'+lastIndex).data('OriginalValue') != 'D') && 
			  ($('#relationshipToIns_'+lastIndex).val() == 'S' || $('#relationshipToIns_'+lastIndex).val() == 'D')
			)
		){
			blnInsuranceScoreFlag = true;				
		}	
		
		// #46478-check if driver already added manually/via prefill and relationship is changed out from 'S' or 'D' to other val
		if(	( !blnSecondaryInsuredExist &&
			  $('#driverId_' + lastIndex).val() != '' &&
			  $('#participantRole_'+lastIndex).val() == 'DRIVER' && 
			  ($('#relationshipToIns_'+lastIndex).data('OriginalValue') == 'S' || $('#relationshipToIns_'+lastIndex).data('OriginalValue') == 'D') && 
			  ($('#relationshipToIns_'+lastIndex).val() != 'S' && $('#relationshipToIns_'+lastIndex).val() != 'D')
			)
		){
			blnInsuranceScoreFlag = true;				
		}	
			
		
	});	
	
	//set flag 
	if (blnInsuranceScoreFlag || blnNewDrvrAdded) {
			$("#insuranceReOrderInd").val("Yes");
	}
}

function disableOrEnableElementsForFormsTab(){
	if ( isEndorsement() ) {
		$('#endorsementType').prop('disabled', true);		
		$('.clsEndorsementType').prop('disabled', true);
	}
}

function disableOrEnableElementsForReadonlyQuote(){
	if ( $('#readOnlyMode').val() == 'Yes' ) {
		$('.tabNextButton').button("enable");
		$("#aiForm :input:not([type=hidden])").prop("disabled", true);
		//$("#aiPreFillForm :input:not([type=hidden])").prop("disabled", true);		
		$("#aiForm :input:not([type=hidden])").prop("disabled", true);
		$('#aiForm select').prop('disabled', true).trigger('chosen:updated');
		
		//49130 - Read Only Option allowing me to copy quote
		$("#savePolicy,#cpQuoteLink").removeAttr("href");
		$('#savePolicy,#cpQuoteLink').attr("disabled", "disabled");
		$('#savePolicy,#cpQuoteLink').unbind('click');
		$("#details").button("enable");
		$(".tabNextButton").prop("disabled", false);
//      $('.clsPolEffDate, .clsDateOfBirth, .currentTermDate, .clsAccVioDate').datepicker("disable");
		$('.clsPolEffDate, .clsDateOfBirth, .currentTermDate, .clsAccVioDate, .clsEffDate').datepicker("disable");
//		$('.textInblue, .removeApplicant, .clsDeleteDriver, .clsDeleteVehicle, .textInblueDeleteDriver').addClass('hidden');
		$('.removeApplicant, .clsDeleteDriver, .clsDeleteVehicle').addClass('hidden');
		$('.textInblueDeleteDriver').addClass('hrefdisable');
		$('.listAreas, .savePrefill').prop('disabled', true);
		$('#application').prop('disabled', true);
		$('.startApp').addClass('hidden');
//		$('#orderRptBtn').prop('disabled', true);
//		$('#orderRptBtn').addClass('hidden');	
//		$('#bind').prop('disabled', true);
		$('#rate').prop('disabled', true);	
		$('#orderStatusReportsOrder').prop('disabled', true);	
		$('#rate_temp').prop('disabled', true);
		$('.covrgRateButton').addClass('hidden');		
		$('.clsOrderRptBtn').addClass('hidden');
		$('.tabBindmakePayment, .tabBindNextButton').addClass('hidden');
		$('#MP').addClass('hidden');		
		$('#IP').addClass('hidden');	
		$('.clsEditListAreas, .editAntiTheft, .clsCallAddAccViolation, .rejectQuote, .editGaragingAddress').addClass('hidden');
		$('#openPrefillDialog').addClass('hidden');
		//$('#aiPreFillForm a').addClass('hidden');
		//$('#aiForm a').addClass('hidden');
		
//		$('#orderRptBtn').attr("disabled", "disabled");
//		$('#addAccVio').attr("disabled", "disabled");		
		$('#editCoverageId').prop('disabled', true);
		//TD 48117 - Issued Teachers Policy - Orange Tab - On Vehicle  Tab Excluded Operator is ENABLED and allowed to be changed
		$('.ui-dropdownchecklist-selector-wrapper').wrap("<div class='chosen-container chosen-container-single chosen-disabled'></div>");
		
		$('#rate').prop('disabled', true);
		$('#span_fullPrefillXml').removeClass('hidden');			
		$('#aiForm input[type="hidden"]').prop("disabled", false);				
		$("#deleteInsurableInterest").addClass('hrefdisable');
		$("#deleteInsurableInterest").removeAttr("href");
		$('#deleteInsurableInterest').attr("disabled", "disabled");
		$(".addInsIntrst").removeAttr("href");
		$('.addInsIntrst').attr("disabled", "disabled");
		$('.saveAntiTheft').prop('disabled', true);
		$("#editsAccidentVioId").addClass('hrefdisable');
		$("#addManualAccidentVioId").addClass('hrefdisable');		
		$('.exclude_dd_reason').addClass('hrefdisable');
		$('.exclude_dd_reason').prop('disabled', true);
		$('.close').removeAttr('disabled');
		$('.closeModal').removeAttr('disabled');
		$("#editCoverageId").addClass('hrefdisable');		
		$("#closeDiscountsPopupId").addClass('hrefdisable');		
		$('#discountDivId a').addClass('hrefdisable');
		$('.inlineErrorMsg').addClass('hidden'); 
	//	$('#viewPrefillData').prop("disabled", true);
		$("#details").prop("disabled", false);	
		$('.errorRow, .errorCol').addClass('hidden');
		$("#defaultMulti").addClass('hidden');		
		$("#editAccVioLink").addClass('hrefdisable');
		$('.view_rpt_details_order a').addClass('hidden'); 
		//$('#uploadEZLynx').prop('disabled', true);
		
		//TD# 72138 Alignment issue in driver page-read only mode
		$('#rmvLookup_Error_Header').addClass('hidden');
		
		if ( isEndorsement() ) {
			$('#endorsementType').prop('disabled', true);		
			$('.clsEndorsementType').prop('disabled', true);
			$('.issue').prop("disabled", true);	
			//46144-Rate button is still enabled after issuing EN
		    $("#rateEndorsement").prop("disabled",true);
			//57413-Endorsements -  the (R) is not locked down to view mode user can replace vehicle
		    $('#mainContentTableHead .clsReplaceVehicle').remove();
			
		}
	}
}

//This method is called from forms tab too
//not called form anywhere in Endorsement never make Exit disabled
function disableExitLink(){
	$("#exitLink").removeAttr("href");
    $('#exitLink').unbind('click');
    $('#exitLink').attr("disabled", "disabled");
}

function emptySelect(selectElement) {	
	selectElement.empty();
	selectElement.append('<option value="">--Select--</option>');
	//48922 - VEH Tab: [Webpage Err] User encounters webpage error when selecting Make or Model without the Year
	selectElement.trigger('chosen:updated');
}

function isValidFieldEmail(valueStr){
	///^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i ;
	if($.trim(valueStr).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)){
		return true;
	} else {
		return false;
	}	
}


function KeyCheck(event)
{
   var KeyID = event.keyCode;

      if(KeyID == 8 || event.which == 8) {
    	 event.stopPropagation();
    	 event.preventDefault();
    	 return false;
    }
 

}

function isQuote() {
	return ($('#isQuote').val() == 'true');
}

function isApplication() {
	return ($('#isQuote').val() == 'false');
}

function isEndorsement() {
	return ($('#isEndorsement').val() == 'true');
}

function isMaipPolicy() {
	return ($('#isMaipPolicy').val() == 'true');
}

function isHomeQuote() {
	if ($('#isHomeQuote').val() == 'true') {
		return true;
	}else {
		return false;
	}
}

/**
 * Returns true if 
 * 	transaction type is application OR ( Quote or Endorse) in Endorsement.
 * @returns {Boolean}
 */
function isApplicationOrEndorsement() {
	return (isApplication() || isEndorsement());
}

function getMaxIdWithIncrement() {
	var maxIdValue = "0";
	$('input.clsIdValue').each(function() {		
		var strIdValue = $(this).val();
		if (strIdValue != "") {
			if (parseInt(strIdValue) > parseInt(maxIdValue)) {
				maxIdValue = strIdValue;
			}
		}
	});
	
	return parseInt(maxIdValue) + parseInt(DEFAULT_ID_INCREMENT);	
}

//Return the difference between two dates
Date.prototype.DaysBetween = function(){  
    var intMilDay = 24 * 60 * 60 * 1000;  
    var intMilDif = arguments[0] - this;  
    var intDays = Math.floor(intMilDif/intMilDay);  
    return intDays;  
}  


function populateMvrUpdInd(thisElem,currVal,originalVal,lastIndex){
	if($(thisElem).hasClass('clsBirthDate') && currVal=='' 
			&& originalVal!='' && $('#mvrDataUpdatedInd_' + lastIndex).val()!='Yes'){
		$('#mvrDataUpdatedInd_' + lastIndex).val("");
	} else{
		$('#mvrDataUpdatedInd_' + lastIndex).val("Yes");
	}
}

//This function is used to check location of the curosr in textbox
function GetCursorLocation(CurrentTextBox) {
	var input = $(CurrentTextBox).get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }

}
//This function is used to check whether user select any country or not and it doesn't allow user to edit the country code and it disable delete and backspacekeys in keyboard
function doReadOnlyText(CurrentTextBox, elementCount) {	
	
	var vehIndex = $(CurrentTextBox).attr('id').substring(4);
	
	
	if("HIT" == $('#polkLookupInd_' + vehIndex).val()){
		 return;
	}
	 
	//Avoid cut paste function
	$(CurrentTextBox).bind("cut paste",function(e) {
		var vehicleIndex = $(this).attr('id').substring(4);
		if("Yes"== $('#endorsementVehicleReplacedInd_' +vehicleIndex).val()){
			return;
		}
	     e.preventDefault();
	});
	
	var keycode = (event.which) ? event.which : event.keyCode;
	//If keycode is not a TAB Key
	if (keycode != 9) {
		if (GetCursorLocation(CurrentTextBox) <= elementCount - 1) {
			event.returnValue = false;
			//48831 - IE11 is allowing VIN to be edited (first 10 chars)
			event.preventDefault();
		} else if ((GetCursorLocation(CurrentTextBox) == elementCount)
				&& (keycode == 8)) {
			event.returnValue = false;
			//48831 - IE11 is allowing VIN to be edited (first 10 chars)
		    event.preventDefault();
		} else {
			event.returnValue = true;
		}
	}
}

function doChangeTextColor(CurrentTextBox, elementCount){
	
	//55961- initial display of VIN is not yellow filled
	$(CurrentTextBox).removeClass('preRequired');	
		
	if($(CurrentTextBox).val().length <= elementCount+0){
		$(CurrentTextBox).css("color","grey");
	}
	else{
		$(CurrentTextBox).css("color","black");
	}
}

function autoCorrectDateYear(sDate){
	// function converts year of yy format to yyyy format
	if (sDate.length == 8){
		var mMonth = sDate.substr(0,2);
		var mDay = sDate.substr(3,2);
		var mYear = sDate.substr(6,2);
		var mToday = new Date();
		
		//If the year is greater than 30 years from now use 19, otherwise use 20
		var checkYear = mToday.getFullYear() + 30; 
		var mCheckYear = '20' + mYear;
		
		if (mCheckYear >= checkYear) {
			mYear = '19' + mYear;
		}
		else{
			mYear = '20' + mYear;
		}
	
		sDate = mMonth + "/" + mDay + "/" + mYear;	
	}

	return sDate;
}

function isPolicyIssued() {
	return ( $('#transactionStatusCd').val() == 'Issued'  || $('#transactionStatusCd').val() == 'Pending Issued') ? true : false;
}

function isRatedImpl(drvStatus) {
	// INSURED ON THE POLICY OR SUSPENDED OPERATOR
	if (drvStatus == 'INS_POL' || drvStatus == 'R') {
		return true;
	}
	return false;
}

function isDeferred1Impl(drvrSatus) {
	
	//Insured on Another PRAC Policy or Insured Elsewhere or Revoked Operator or No Longer Licensed
	if (drvrSatus == INSURED_ON_ANOTHER_PRAC || drvrSatus == INSURED_ELSE_WHERE || drvrSatus == REVOKED_OPERATOR || drvrSatus == NO_LONGER_LICENSED) {
		return true;
	}
	else {
		return false;
	}	
}

function isDeferred2Impl(drvrSatus) {
	//Away in service or Permit or Never licensed
	if (drvrSatus == AWAY_IN_ACTV_SERVC || drvrSatus == PERMIT || drvrSatus == NEVER_LICENSED) {
		return true;
	}
	else {
		return false;
	}	
}

function isMASpecificDriver(stateCd,licenseStateCd){
	return (stateCd == 'MA' && licenseStateCd=='MA');
}

function isNotRatedDriver(lastIndex){
	if (isMASpecificDriver($('#stateCd').val(),$('#licenseState_'+lastIndex).val())){
		return isNotRatedDriverMA(lastIndex);
	}
	var currVal = $('#driverStatus_'+lastIndex).val();
	var origVal = $('#driverStatus_'+lastIndex).data('OriginalValue');
	if(currVal!=null && currVal!='INS_POL' && currVal!='R' && currVal==origVal){
		return true;
	}
	
	if(currVal!=null && currVal!='INS_POL' && currVal!='R'){
		return true;
	}
	return false;
}

function isNotRatedDriverMA(lastIndex){
	var currVal = $('#driverStatus_'+lastIndex).val();
	var origVal = $('#driverStatus_'+lastIndex).data('OriginalValue');
	
	if(currVal!=null && currVal!='INS_POL' 	&& currVal!='R' && currVal!=INSURED_ON_ANOTHER_PRAC 
	&& currVal!=INSURED_ELSE_WHERE 	&& currVal!=REVOKED_OPERATOR && currVal!=NO_LONGER_LICENSED 
	&& currVal==origVal
	){
		return true;
	}
	
	if(currVal!=null && currVal!='INS_POL' && currVal!='R' && currVal!=INSURED_ON_ANOTHER_PRAC
	&& currVal!=INSURED_ELSE_WHERE && currVal!=REVOKED_OPERATOR && currVal!=NO_LONGER_LICENSED
	){
		return true;
	}
	
	//driver is rated MA
	//now check if rmv order status is successful
	//If license number is changed, this flag is reset and a lookup is made
	//if($('#rmvLookupInd_'+lastIndex).val()!='Yes'){
	//	return true;
	//}
	
	return false;
}

function checkPrefillItemsAdded () {
	var sourceType =  $('#sourceType').val();
	var prefillAddedItemsList = $('#prefillAddedItemsList').val();
	
	// once vehicle page is saved
	if ( ($("#transactionProgress").val() != '' && parseInt($("#transactionProgress").val()) >= 3)
	&& (sourceType =='Prefill' &&  prefillAddedItemsList != null &&  trimSpaces(prefillAddedItemsList) != '')
	) {
		// 55969-Vehicle page - opened up prefill on vehicle added 1 discovered vehicle - 
		// then maually added other vehicles kept getting errant message every time i clicke Vehicle Lookup
		//$('#prefillAddedItemsList').val('');
		// The above statment is commented as part of the TD: 56378 fix.
		return true;  
	} else {
		return false;
	}
}

function showPrefillAddedItemsEdits() {
		
	$('#prefillAddedItemsEdits').modal('show');
}

function navigateToPrefillAddedItemsTab() {
	var prefillAddedItemsList = $('#prefillAddedItemsList').val();
	var targetPage = '';
	if (prefillAddedItemsList == 'drivers_vehicles' || prefillAddedItemsList == 'drivers') {
		targetPage = "drivers";
		$('#prefillNewlyAddedItemsList').val('drivers');
	} else if (prefillAddedItemsList == 'vehicles') {
		targetPage = "vehicles";
		$('#prefillNewlyAddedItemsList').val('vehicles');
	} else {
		$(".modal").modal('hide');				
		return false;
	}

	$('#prefillAddedItemsList').val('');

	nextTab (document.aiForm.currentTab.value, targetPage);
}



function getTabOrderCode(tabName) {
	/*
	switch (tabName) {
		case QuoteProgressEnum.CLIENT:	
			return "1";	    	
			break;
		case QuoteProgressEnum.DRIVERS:
			return "2";	    	
			break;
		case QuoteProgressEnum.VEHICLES:
			return "3";	    	
			break;
		case QuoteProgressEnum.ACCIDENTS_VIOLATIONS:
			return "4";	    	
			break;
		case QuoteProgressEnum.DETAILS:
			return "5";	    	
			break;
		case QuoteProgressEnum.COVERAGES:
			return "6";	    	
			break;
		case QuoteProgressEnum.SUMMARY:
			return "7";	    	
			break;
		case QuoteProgressEnum.APPLICATION:
			return "8";	    	
			break;
		case QuoteProgressEnum.BIND:
			return "9";	    	
			break;
		case QuoteProgressEnum.NOTES:
			return "10";	    	
			break;
		case QuoteProgressEnum.RATE:
			return "11";	    	
			break;
		default:
			return "0";	
	}
	*/
	var orderCode = '0';
	
	if (tabName && tabName in QuoteProgressEnumJS) {
		orderCode = QuoteProgressEnumJS[tabName];
	}
	return orderCode;
}


//this is only for endorsement
//driver exception handling rule - 
//if DOB changes and any two of these fields (First, Middle, Last, Suffix) chang
//display hard edit text
// Below function is commented and re-implemented below by Srini Sanagala regarding #45824. 
// The edit should be fired for driver level and not combination.#45824.
/*
function driverTabEditFieldsRule(){
	var flag = false;
	var originalVal;
	var currVal;
	var driverFieldFlag= 0;
	var birthDateChangeFlag = false;
	
	$('select.clsDriverEditFieldRule, input.clsDriverEditFieldRule').each(function() {		
			var tempId = $(this).attr('id');		
			var birtdateId = "birthDate_";
			lastIndex = parseInt(tempId.substring(tempId.lastIndexOf("_") + 1));
			
			if ($(this).is('select:not(select[multiple])')){
				currVal = $(this).val();
				originalVal = $(this).data('OriginalValue');			
				if(currVal !=originalVal){
					driverFieldFlag = driverFieldFlag + 1;
				}
			} else {
				currVal = $(this).val();
				originalVal = $(this).prop('defaultValue');			
				if(currVal !=originalVal){
					driverFieldFlag = driverFieldFlag + 1;
				}
				if(tempId.indexOf(birtdateId) != -1){
				   if(currVal !=originalVal && isEndorsementAddedDriver(lastIndex) !=true){
					   birthDateChangeFlag = true; 
				   }
				}			
			}
		});
		
		if(birthDateChangeFlag == true && driverFieldFlag > 2){
			flag = true;
			return flag;
		}
}
*/

function showRMVFailedModalIfApplicable(response){
	if (response!=null && response[0]!=null && response[0].orderStatus!=null && response[0].orderStatus.toLowerCase()=="unsuccessful"){
		$('#rmvUnsuccessfulModal').modal();
	}
}

function driverTabEditFieldsRule() {
	var startColumn = 1;
	var endColumn = parseInt($('#driverCount').val());
	var flag = false;
	var originalVal;
	var currVal;
	//var driverFieldFlag= 0;
	//var birthDateChangeFlag = false;
	
	// loop thru each driver	
	for (var i = startColumn; i <= endColumn; i++) {
		var selector =  $('#mainContentTable > tbody > tr > td:nth-child('+ i +')') ;
		var driverEditFieldRuleElements = $('.clsDriverEditFieldRule' , selector);
		 
		var birthDateChangeFlag = false; //re set for each driver level
		var driverFieldFlag= 0;
		//loop thru each element inside the driver
		driverEditFieldRuleElements.each(function() {
			var tempId = $(this).attr('id');		
			var birtdateId = "birthDate_";
			lastIndex = parseInt(tempId.substring(tempId.lastIndexOf("_") + 1));
			// check for only existing driver
			if (isEndorsementAddedDriver(lastIndex) !=true) {
				
				if ($(this).is('select:not(select[multiple])')){
				currVal = $(this).val();
				originalVal = $(this).data('OriginalValue');			
					if(currVal !=originalVal){
						driverFieldFlag = driverFieldFlag + 1;
					}
				} else {
					currVal = $(this).val();
					originalVal = $(this).prop('defaultValue');			
					if(currVal !=originalVal){
						driverFieldFlag = driverFieldFlag + 1;
					}
					if(tempId.indexOf(birtdateId) != -1){
					   if(currVal !=originalVal){
						   birthDateChangeFlag = true; 
					   }
					}			
				}
			}
		});
		
		if(birthDateChangeFlag == true && driverFieldFlag > 2){
			flag = true;
			break;
		}
		
	} //for loop ends
	
	return flag;
}

//2.1 Order reports - Deleted drivers should be included in the popup
function getListOfDriverNamesForPopup(middleMsg){
	$('.deletedDrivers').each(function(){
		if(isRatedImpl($('#originalDriverStatus_'+$(this).val()).val()) ){
			middleMsg = middleMsg+$('#driverFullName_'+$(this).val()).val()+"<br>";
		}		
	});	
	return middleMsg;
}

//2.1 Order reports - Deleted drivers should be included in the popup 
function getDeletedDriversMsg(strTab){
	var firstMsg = "Due to driver information being added, changed, deleted or "+
    				"a manual violations order exists, the " + 
    				"following rated driver(s)" + "<br>";
	var middleMsg = '';
	var lastMsg = "will have their incident orders updated." + "<br>";
	var finalMsg = '';	
	middleMsg=getListOfDriverNamesForPopup(middleMsg);
	finalMsg = firstMsg + middleMsg + lastMsg;
	if(middleMsg==''){
		return '';
	}
	return finalMsg;
}

function getMvrReOrderDriversMsg(strTab) {
	var firstMsg = "Due to driver information being added, changed, deleted or " +
				    "a manual violations order exists, the " + 
					"following rated driver(s)" + "<br>";
    var middleMsg = '';
	var lastMsg = "will have their incident orders updated." + "<br>";
	var finalMsg = '';	
	if (strTab == 'drivers') {
		$('input.clsDriverSeqNum').each(function() {
			var lastIndex = getIndexOfElementId(this);
			if ( $('#mvrDataUpdatedInd_' + lastIndex).val() == 'Yes') {
				var drvrName = $('#firstName_' + lastIndex).val() + " " + $('#lastName_' + lastIndex).val() + "<br>";
				middleMsg = middleMsg + drvrName;
			}
		});
		
		//2.1 Order reports - Deleted drivers should be included in the popup
		middleMsg=getListOfDriverNamesForPopup(middleMsg);
		
	} 
	//2.1 Order reports - Reorder popup should only show up in Driver tab
	/*else if(strTab == 'vehicles' || strTab == 'details' || strTab == 'summary'){
		$('input.hiddenDriverIndexNum').each(function() {
			var index = getIndexOfElementId(this);
			var lastIndex = $('#driverIndexNum_'+index).val();
			if ( $('#mvrDataUpdatedInd_' + lastIndex).val() == 'Yes') {
				var drvrName = $('#firstName_' + lastIndex).val() + " " + $('#lastName_' + lastIndex).val() + "<br>";
				middleMsg = middleMsg + drvrName;
			}
		});
	}*/
	
	finalMsg = firstMsg + middleMsg + lastMsg;
	
	if(middleMsg==''){
		return '';
	}
	
	return finalMsg;
}

function showReorderErrorPopups(){
	if($('#showTabsErroneousPopupFlag').val() == 'true'){
		if($('#stateCd').val()=='MA'){
			 $('#orderThirdPartyDriverTabErroneousModal').modal("show");
		}
		else{
			$('#orderThirdPartyTabsErroneousModal').modal("show");
		}
		$('#processEditMessage').hide();
	}

	//client doesn't have prefill data
	if($('#showPrefillRequiredPopupFlag').val() == 'true' 
			&& (document.aiForm.currentTab.value!='client')){
		$('#orderThirdPartyPrefillNotReconciledModal').modal("show");
		$('#processEditMessage').hide();
	}	
	
	if($('#showInvalidDriverLicenseFlag').val() == 'true'){
		$('#orderThirdPartyInvalidLicenseModal').modal("show");
		$('#processEditMessage').hide();
	}
	
	if($('#showInvalidVinFlag').val() == 'true'){
		$('#orderThirdPartyInvalidVinModal').modal("show");
		$('#processEditMessage').hide();
	}
	
	if($('#showRMVNotOrderedFlag').val() == 'true'){
		var driversNotOrdered = $('#rmvNotOrderedDrivers').val().split(";");
		
		var messageText = "Reports cannot be ordered on Driver(s) ";
		var driverName = "";

		$(driversNotOrdered).each(function(){
			driverName = driverName + this + " ";
		});
		messageText = messageText + driverName + " until a successful Driver RMV Look up is complete.Please complete the RMV Driver Look up.";
		$('#orderThirdPartyRMVNotOrderedModal #message').html(messageText);
		$('#orderThirdPartyRMVNotOrderedModal').modal("show");
		$('#processEditMessage').hide();
	}
	
	$(document).on("click", ".fixVehicleVin", function(){
		jumpToDifferentTab("vehicles?isFromOrderReports=true");
	});
	
	$(document).on("click", ".fixVehicleRmv", function(){
		jumpToDifferentTab("vehicles");
	});
	
	$(document).on("click", ".fixDriverLic", function(){
		$('input:disabled,select:disabled').prop('disabled', false);
		jumpToDifferentTab("drivers?isFromOrderReports=true");
	});
	
	$(document).on("click", ".fixDriverRmv", function(){
		jumpToDifferentTab("drivers");
	});
	
	$(document).on("click", ".fixDriverPermit", function(){
		$('input:disabled,select:disabled').prop('disabled', false);
		jumpToDifferentTab("drivers?isFromfixDriverPermit=true");
	});
	
	$(document).on("click", ".fixInvalidRenters", function(){
		$('input:disabled,select:disabled').prop('disabled', false);
		jumpToDifferentTab("coverages");
	});
}

function jumpToDifferentTab(nextTab){
	blockUser();
	document.aiForm.nextTab.value = nextTab;
	document.aiForm.submit();
}

function showReorderResultpopup(){
	if($('#orderThirdPartyResponseCommonReview').val()=='true'){
		//Policy was already rated after reports were ordered. Shouldn't reset premium again
		//resetPremiumForAll();
		$('#divOrderRptModalReview').modal();
		$('#orderThirdPartyResponseReview').val('');
	}
	
	if($('#orderThirdPartyResponseCommonClean').val()=='true'){
		$('#divOrderRptModalClean').modal();
		$('#orderThirdPartyResponseClean').val('');		
	}
}

/**
 * Log a message to the database via ajax call. Logging is turned on or off by the logToDbFlag variable.
 * @param message Message to be logged
 */
function logToDb(message) {
	if(logToDbFlag) {
		var thisTab = "";
		if(document.aiForm && document.aiForm.currentTab && document.aiForm.currentTab.value) {
			thisTab = document.aiForm.currentTab.value;
		}
		message += " Current Tab: " + thisTab;
		if(thisTab != VEHICLESTABNAME)
			$.post("/aiui/log", {"message":message});
	}
}

function getIndexOfElementId(strElement) {
    var strId = $(strElement).attr('id');
    var n = strId.lastIndexOf('_');
    var lastIndx = strId.substring(n + 1);
   
    return lastIndx;
}

function getMaxSeqNoWithIncrement(tab) {
    var maxIdValue = "0";
    var selector;
    if(tab == 'vehicle'){
           selector = $('input.vehicleSeqNum');
    }else {
           selector = $('input.driversSeqNum');
    }
    $(selector).each(function() {            
           var strIdValue = $(this).val();
           //console.log(strIdValue);
           if (strIdValue != "") {
                  if (parseInt(strIdValue) > parseInt(maxIdValue)) {
                        maxIdValue = strIdValue;
                  }
           }
    });
    
    return parseInt(maxIdValue) + parseInt(1);             
}

function isEmployeeCurrentProfile(){
	var loginType = document.actionForm.loginType.value;
	var hasCurrentProfile = document.actionForm.hasCurrentProfile.value;
	
	if(loginType=="E" && hasCurrentProfile=="true"){
		return true;
	}else{
		return false;
	}
}

function isEmployee(){
	var loginType = document.actionForm.loginType.value;
	
	if(loginType=="E"){
		return true;
	}else{
		return false;
	}
}

function hasCurrentProfile(){
	var hasCurrentProfile = document.actionForm.hasCurrentProfile.value;
	
	if(hasCurrentProfile=="true"){
		return true;
	}else{
		return false;
	}
}

function isIndependentAgentLogin(){
	return (!isEmployee() && hasCurrentProfile() && $('#channel').val() == 'IA');
}

function createHelpFlyout() {
	$('.helpFlyoutClass').click(function(){
		var currentElement = $(this).attr("id");
		showHelpFlyout(currentElement);
	});
}

function destroyHelpFlyout(){	
	$('.helpFlyoutClass').each( function () {
		var popoverData = $(this).data('richPopover');
		if (popoverData != undefined) {
			if (popoverData.closeOnClick) {
				$(this).richPopover('destroy');
			}
			popoverData.closeOnClick = true;
		}
	});
}

function showHelpFlyout(currentElementId) {	
	var currentInfo = currentElementId.substring(0,currentElementId.length) + "Info";
	var	popupHTML = $("#"+currentInfo).html();
	var pop = $("#"+currentElementId).richPopover({
			placement: 'right',
			html: true,
		    content: popupHTML
		 });
	pop.richPopover('show');
}

//moving expandCollapseRows to Common from Vehicles since it is also used by Drivers now
function expandCollapseRows(rowPrefix) {
	$("." + rowPrefix + "Row").each(function() {
		$(this).toggleClass("hidden");
	});

	if(isEndorsement()){
		//Fix for #46180 -- Endorsement URL mapping is different
		//Toggling of Plus and Minus signs upon expand and collapse of Polk Returned Data section 
		if (($('#' + rowPrefix).attr('src')).indexOf('plus') >=0) {
			$('#' + rowPrefix).attr('src', '../resources/images/minus.gif');	
		} else {
			$('#' + rowPrefix).attr('src', '../resources/images/plus.gif');
		}
	}else{ 
		//Toggling of Plus and Minus signs upon expand and collapse of Polk Returned Data section 
		if (($('#' + rowPrefix).attr('src')).indexOf('plus') >=0) {
			$('#' + rowPrefix).attr('src', '../aiui/resources/images/minus.gif');	
		} else {
			$('#' + rowPrefix).attr('src', '../aiui/resources/images/plus.gif');
		}	
	}
	$("#mainContentTable ." + rowPrefix + "Row").each(function() {
		var headerRow = $('#rowHeaderTable .' + this.id);
		alignTableRow($(this), $(headerRow[0]));
	});
}

//2.3 specific to determine if the CT,NJ,NH states are applicable  
//PA_AUTO added PA state
function validforNonMA(state){
	var states = ['NJ','NH','CT','PA'];
	return $.inArray($.trim($('#stateCd').val()),states) > -1;
}

function calculateAge(strDate,policyEffDt) {
	
	var today = new Date();
	var dd = parseInt(today.getDate());
	var mm = parseInt(today.getMonth()+1);
	var yyyy = parseInt(today.getFullYear()); 
	
	if(policyEffDt != null){
		dd = parseInt(policyEffDt.split("/")[0]);
		mm = parseInt(policyEffDt.split("/")[1]);
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

function isElementExisting(strElm) {
	return ($(strElm).length > 0) ? true : null;
}

function performOrderReportsForPriorLicForCurrRmvLookupDrvrs(strSourcePage, strTarget){
	//#55579(cc)...
	var priorLicState = "";
	var priorLicNum = "";
	var driverName = "";
	var prioLicDriversNames = "";
	var driversIndexes = "";
	
	if (strSourcePage == "DriverPage") {
		$('input.clsCurrentRmvLookup[value=Yes]').each(function() {
			var driverIndex = getIndexOfElementId(this);
			
			priorLicState = $('#priorLicenseState_' + driverIndex).val(); 
			priorLicNum = $('#priorLicenseNumber_' + driverIndex).val();
			// check if prior lic info exists
			if (priorLicState != "" && priorLicNum != "") {
				//#55838...consider only if rated driver..
				if (isRatedImpl($("#driverStatus_" + driverIndex).val())) {
					driverName = $('#firstName_' + driverIndex).val() + " " + $('#lastName_' + driverIndex).val();
					// store drivers names
					if (prioLicDriversNames == "") {
						prioLicDriversNames = driverName;
					} else {
						prioLicDriversNames = prioLicDriversNames + ", " + driverName;
					}
					
					// store drivers idexes
					if (driversIndexes == "") {
						driversIndexes = driverIndex;
					} else {
						driversIndexes =  driversIndexes + "," + driverIndex;
					}
				}else{
					//set indicator to 'No' just not to order MVR(For Prior License) but to order RMV
					$('#endrsemntOrdRptsForPrioLicInd_' + driverIndex).val("No");
				}
			}
		});
	} else if(strSourcePage == "ClientPage") {
		//In endorsement always SNI
		
		var priRMVLookup = $('#primary_insured_rmvLookupInd').val();
		var priPriorLicState = $('#primary_insured_priorLicenseState').val(); 
		var priPriorLicNum = $('#primary_insured_priorLicenseNumber').val();
		var priEndRMVRptOrdered = $('#primary_insured_endrsemntOrdRptsForPrioLicInd').val();
		var priMvrDataUpdInd = $('#primary_insured_mvrDataUpdatedInd').val();
		var priInsuredDrvStatus = $('#primary_insured_driverStatusCd').val();
		
		var secRMVLookup = $('#secondary_insured_rmvLookupInd').val();
		var secPriorLicState = $('#secondary_insured_priorLicenseState').val(); 
		var secPriorLicNum = $('#secondary_insured_priorLicenseNumber').val();
		var secEndRMVRptOrdered = $('#secondary_insured_endrsemntOrdRptsForPrioLicInd').val();
		var secMvrDataUpdInd = $('#secondary_insured_mvrDataUpdatedInd').val();
		var secInsuredDrvStatus = $('#primary_insured_driverStatusCd').val();
		
		if(priRMVLookup == 'Yes' && isValidValue(priPriorLicNum) &&  isValidValue(priPriorLicState) && priEndRMVRptOrdered != 'Yes'){
			$('#primary_insured_endrsemntOrdRptsForPrioLicInd').val('Yes');
			driverName = $('#primary_insured_firstName').val() + " " + $('#primary_insured_lastName').val();
			prioLicDriversNames = driverName;
		}else{
			driverName="";
			if(priEndRMVRptOrdered != 'Yes'){
				$('#primary_insured_endrsemntOrdRptsForPrioLicInd').val('No');
			}
		}
		 
		if(secRMVLookup == 'Yes' && isValidValue(secPriorLicNum) &&  isValidValue(secPriorLicState) && secEndRMVRptOrdered != 'Yes'){
			$('#secondary_insured_endrsemntOrdRptsForPrioLicInd').val('Yes');
			driverName = $('#secondary_insured_firstName').val() + " " + $('#secondary_insured_lastName').val();
			prioLicDriversNames = prioLicDriversNames+","+driverName;
		}else{
			driverName = "";
			if(secEndRMVRptOrdered != 'Yes'){
				$('#secondary_insured_endrsemntOrdRptsForPrioLicInd').val('No');
			}
		}
	}
	
	if (prioLicDriversNames == "") {
		return false;
	}
		
	displayModelForOrderReportsForCurrRmvLookedupDrivers(strSourcePage, prioLicDriversNames, driversIndexes, strTarget);
	
	return true;
}

function isValidValue(strId){
	var isValid = true;
	if(strId ==  undefined || strId == null || $.trim(strId).length < 1){
		isValid = false;
	}
	return isValid;
}

function displayModelForOrderReportsForCurrRmvLookedupDrivers(strSourcePage, prioLicDriversNames, driversIndexes, strTarget) {
	$('#divEndorsmntOrderReportsForRmvLookup #orderReportsNowForRmvLookup').unbind('click');
	var driversIndexesSplit = driversIndexes.split(",");
	
	//bind click event
	$('#divEndorsmntOrderReportsForRmvLookup #orderReportsNowForRmvLookup').click(function() {         
		$('#divEndorsmntOrderReportsForRmvLookup').modal('hide');
		document.aiForm.orderReportsForRmvLookup.value = 'true';
		
		//set Yes indicators to order prior lic(mvr) + rmv reports 
		if (strSourcePage == "DriverPage") {			
			for(var i=0;i<driversIndexesSplit.length;i++){
				var driverIndex = driversIndexesSplit[i];
				$('#endrsemntOrdRptsForPrioLicInd_' + driverIndex).val("Yes"); 
				 //make sure to set reorder ind to Yes prior to order. It makes sure to order 
				 // even license number is changed and hit rmv lookup on saved driver
				 $('#mvrDataUpdatedInd_' + driverIndex).val("Yes"); 
			}
		}
		if (strSourcePage == "ClientPage") {
			nextTab(document.aiForm.currentTab.value, strTarget);
			return;
		}
		nextTab(document.aiForm.currentTab.value, document.aiForm.currentTab.value);
		return;
	});
	
	$('#divEndorsmntOrderReportsForRmvLookup #closeOrdRptsForRmvLookup').click(function() {         
		//set No indicators not to order prior lic(mvr) but order rmv reports 
		if (strSourcePage == "DriverPage") {
			for(var i=0;i<driversIndexesSplit.length;i++){
				var driverIndex = driversIndexesSplit[i];
				
				$('#endrsemntOrdRptsForPrioLicInd_' + driverIndex).val("No");
			} 
		}
		
		if (strSourcePage == "ClientPage") {
			$('#primary_insured_endrsemntOrdRptsForPrioLicInd').val('No');
			$('#secondary_insured_endrsemntOrdRptsForPrioLicInd').val('No');
		}

		nextTab(document.aiForm.currentTab.value, strTarget);
		return;
	});
	
	var messageText = "Driver(s) " +  prioLicDriversNames;
	messageText = messageText + " has a prior out of state license. For an accurate rate, reports must be ordered.";
	messageText = messageText + " Quick Quote will no longer be available after a successful report Order";
	
	$('#divEndorsmntOrderReportsForRmvLookup #message').html(messageText);
	$('#divEndorsmntOrderReportsForRmvLookup').modal();
}

function getDateDiffInDays(date) {
	var xDate = new XDate(date);
	return xDate.diffDays(new XDate());
}

function hideRenewalViolationsForEndorsement() {
	
	if ( $("#policyEffDt").val() != "" && $("#hdnRateChangeEffDt").val() != "" ) {
		
		var policyEffDt = Date.parse($("#policyEffDt").val());
		var njRateChangeEffDt = Date.parse($("#hdnRateChangeEffDt").val());
		
		//do for only eff date policy only
		if (policyEffDt >= njRateChangeEffDt) {
			//Renewal violations should be hidden	
			hideRenewalViolations();
		}
	}
}

function hideRenewalViolations() {
	$('tr.PRIGNR,tr.PRPRKG,tr.PRUNKN').each(function() {		
		$(this).addClass('hidden');		
	});
}
$.fn.getCursorPosition = function() {
    var el = $(this).get(0);
    var pos = 0;
    if('selectionStart' in el) {
        pos = el.selectionStart;
    } else if('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
};


$.caretTo = function (el, index) {
	 if (el.createTextRange) {
	 var range = el.createTextRange();
	 range.move("character", index);
	 range.select();
	 } else if (el.selectionStart != null) {
	 el.focus();
	 el.setSelectionRange(index, index);
	 }
	 };
	  
	 // Set caret to a particular index
	 $.fn.caretTo = function (index, offset) {
	 return this.queue(function (next) {
	 if (isNaN(index)) {
	 var i = $(this).val().indexOf(index);
	 if (offset === true) {
	 i += index.length;
	 } else if (offset) {
	 i += offset;
	 }
	 $.caretTo(this, i);
	 } else {
	 $.caretTo(this, index);
	 }
	 next();
	 });
	 };
	  
	 // Set caret to beginning of an element
	 $.fn.caretToStart = function () {
	 return this.caretTo(0);
	 };
	  
	 // Set caret to the end of an element
	 $.fn.caretToEnd = function () {
	 return this.queue(function (next) {
	 $.caretTo(this, $(this).val().length);
	 next();
	 });
	 };

	 function fmtPhone(elm,e) { 
			var phone = elm.value;
			var phoneId = elm.id;
			var re = /\D/g;
			if(e.keyCode == 46 || e.keyCode == 8 || e.keyCode > 112){} 
			else{
			if(phone.length < 13) {
				var  splitDash = phone.split("-");
				if(splitDash.length==3 && splitDash[0].length<=3 && splitDash[1].length<=3 && splitDash[2].length<=4){
				//	var start = $(elm).prop("selectionStart");
					var pos = $(elm).getCursorPosition();
					$(elm).val(phone).caretTo(pos);
			}
				else{
				phone = phone.replace("-","").replace(re,"");
				if(phone.length >= 3){
					if(phone.substr(3,1) != "-") {
						phone = phone.substr(0,3) + "-" + phone.substr(3);
					}
				}
				if(phone.length >=7){
					if(phone.substr(7,1) != "-") {
						phone = phone.substr(0,7) + "-" + phone.substr(7);
					}
				}
			//	var start = $('#'+phoneId).prop("selectionStart");
			    var pos = $('#'+phoneId).getCursorPosition();
			    if(phone.length ==4 || phone.length ==8){
			    	pos=pos+1;
			    }
			    $('#'+phoneId).val(phone).caretTo(pos);
			}
			}
			}
		}

//Javascript Constants//
var changeSelectBoxIt = 'changeSelectBoxIt';
var showErrorDetailsPopup = 'showErrorDetailsPopup';
var showErrorPopup = 'showErrorPopup';

//Prior Carrier Codes
var N0_PRIOR_INS_CD = 'NONE';
var LT_25_50_CD = 'LT25_50';
var LT_100_30_CD = 'LT100_300'; 
var LT_250_500_CD = 'LT250_500'; 
var GT_250_500_CD = 'GT250_500'; 

//Residence Type
var HOMEOWNERS_CD = 'HOME';
var CONDO_CD = 'CONDO';
var RENTERS_CD = 'RENTER';
var MOBILEHOME_CD = 'MOBILE_H';

//Source of Business
var EXISTING_AGY_CUST_CD = 'EXIST_AGY'; 
var NEW_AGY_CUST_CD = 'NEW_AGY';
var EXISTING_SPIN_OFF_CD = 'EXIST_SPIN';
var ESALES_CD = 'ESALES';    

//Sales Program
var RENEWAL_ACCT_REVIEW_CD = 'RN_ACC_REV';
var PREF_BOOK_ROLL_CD = 'PREF_BK_RL';
var BOOK_ROLL_CD = 'BK_ROLL';
var IND_POL_TRANSFER_CD = 'IND_POL_TR';

//Vehicle Types
var PRIVATE_PASSENGER_CD = 'PPA';
var TRAILER_W_LIVING_FAC_CD = 'TL';
var UTILITY_TRAILERS_CD = 'UT';
var ANTIQUE_CD = 'AQ';
var CLASSIC_AUTO = 'CL';
var MOTOR_HOME_CD = 'MH';
var TRAILER_CAPS_CD = 'TC';
var MOTORCYCLE_CD = 'MC';


//VehicleType/PlateType Valid Combinations
AQ_PlateType = ['MCN','MCR','MCS','MCV','PAN','PAR','PAS','PAV','PAY'];
PPA_PlateType = ['PAN','PAR','PAS','PAV','CON','COR','COV','PAY'];
UT_PlateType = ['TRN','TRR','AHN','AHR','AHV','PAY'];
MC_PlateType = ['MCN','MCR','MCS','MCV','PAY'];
MH_PlateType = ['AHN','AHR','AHV','PAY'];
TC_PlateType = ['AHN','AHR','AHV','PAY'];
TL_PlateType = ['AHN','AHR','AHV','PAY'];

//RMV VehicleTypes
RMV_PPA_PlateType = ['PAN','PAR','PAS','PAV','PAY','CON','COR','COV'];
RMV_MH_PlateType = ['AHN','AHR','AHV']; // cylinder null
RMV_TL_PlateType = ['AHN','AHR','AHV']; // cylinder non null
RMV_UT_PlateType = ['TRN','TRR']; // 
RMV_MC_PlateType = ['MCN','MCR','MCS','MCV'];

//Upgrade Package Type
var ASSURANCE_PREFERRED = 'Assurance_Preferred';
var ASSURANCE_PREMIERE = 'Assurance_Premiere';

//Tab Descriptions
var CLIENTTABNAME = 'client';
var DRIVERSTABNAME = 'drivers';
var VEHICLESTABNAME = 'vehicles';
var ACCIDENTSVIOLATIONSTABNAME = 'accidentsViolations';
var DETAILSTABNAME = 'details';
var COVERAGESTABNAME = 'coverages';
var SUMMARYTABNAME = 'summary';
var BINDTAB = 'bind';

//Tab Sequence Numbers
var CLIENTTABNUMBER = 1;
var DRIVERSTABNUMBER = 2;
var VEHICLESTABNUMBER = 3;
var ACCIDENTSVIOLATIONSTABNUMBER = 4;
var DETAILSTABNUMBER = 5;
var COVERAGESTABNUMBER = 6;
var SUMMARYTABNUMBER = 7;

var dateClasses = ".clsDate, .colDateField, .clsDateInputFld, .clsDateFirstLicense, .clsAccVioDate";


// Flag to turning on or off logging to the database
var logToDbFlag = false;