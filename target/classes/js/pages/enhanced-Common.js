//SSIRIGINEEDI: CHOSEN-STYLE 
//The below functionality of adding chosen plugin is common for pages and once the all the tags adapt
//to the new changes, then move this to common place. Until then respective tabs should use this for migration.





//MOVED TO common.js





/*function applyChosenToPage(selector) {
	
	// Use scope based selector for select items to render the selectdds only on  viewable area for fastness.
	// consider doing the selectdds outside the mainContent table asynchronously.TBD
	$(selector).find('select:not(select[multiple])').each(function(){
		// store original value 
		$(this).data('OriginalValue', $(this).val());
		addChosen(this.id);
	});
}

function applyChosen() {
	
	// Use scope based selector for select items to render the selectdds only on  viewable area for fastness.
	// consider doing the selectdds outside the mainContent table asynchronously.TBD
	$('#mainContentTable').find('select:not(select[multiple])').each(function(){
		// store original value
		$(this).data('OriginalValue', $(this).val());
		addChosen(this.id);
	});
	
	//Since Vehicle page has these Modals outside the main content table we have to do this way.
	//While moving this applyChosen() to common place overload the function to accept 'selector' as parameter.
	$('#insurableInterestDlg').find('select:not(select[multiple])').each(function(){
		addChosen(this.id);
	});
	
	$('#garagingAddressDlg').find('select:not(select[multiple])').each(function(){
		addChosen(this.id);
	});
}

function addChosen(id) {
	
		$('#' + id).chosen ( 
		{     
			  search_contains:true 
		      //, disable_search_threshold: 4
	    });
		
		//each select element is transformed to div element(with _chosen appended to the original id) with necessary stuff in it.
		
		// Since we have the element, do the necessary work needed for tooltip.
		// added for tooltip.. we show selected value in tooltip
		
		//again watch the selector.. it is more specific.
		$('#' + id +'_chosen').find('.span , .chosen-single').live('mouseenter', function(){
	        if($(this).text()  == '--Select--') {
	        	$(this).attr('title', '');
	        } else {
	        	$(this).attr('title', $(this).text());
	        }
		});
		
		// Handling the case of edge detection so dropdowns flip up when parent container has overflow hidden CSS. 
		
		$('#' + id).on("chosen:showing_dropdown", function () {
		       
			  var result = checkInView($('#' + id +'_chosen').find('.chosen-drop'));    
		      //  console.log('Regular Script Result :'+result);
			  var chosenContainer =  $("div#" + id + "_chosen");
		      if (!result ){
		    	  chosenContainer.addClass('chosen-above');
		    	  chosenContainer.find('div.chosen-drop').first().addClass('chosen-above');
		          //$this.dropdown.addClass('chosen-above');
		       } else {
		          //this.dropdown.removeClass('chosen-above');
		    	  chosenContainer.removeClass('chosen-above');
		    	  chosenContainer.find('div.chosen-drop').first().removeClass('chosen-above');
		       }
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
			 chosenContainer.children(":first").toggleClass('tabOrder' , $(this).hasClass('tabOrder') );
			 
		 });
		
		//Need to trigger the change if any styles are applied in the validation
		$('#' + id).trigger('chosen:styleUpdated');
}

function  checkInView(elem) {
	
    var container = $("#slidingFrameId");
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight ;
 
    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();
    
    var isInView = (elemTop >= 0 && elemBottom <=contHeight);
   // var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;
    
    return  isInView  ;
}*/
		
