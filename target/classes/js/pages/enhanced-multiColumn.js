//MOVED stuff to multicolumn.js

//SSIRIGINEEDI: Verified that these functions are from common.js and multicolumn.js is used in Vehicles page. 
// Overriding here will actually only apply to Vehicles Tab( as the js functions order winning priority applies). 
// So modifying this wont impact existing pages as their add/delete columns functions are still driven using the multicolumn.js.
// Vehicle page is now ready to accept the changes related to the removal of SelectboxIt and adapt to the functionality of new Chosen Plugin.
// Slowly other tabs are moved to accept these changes.

// tjmcd - This entire routine needs to be reviewed. I think it's overly complex, slow, and probe to breaking
// SSirigineedi: Agree. Can be done in a simpler way by reducing the scope of selectors being used and cloning.
// Need to find time to rewrite the logic.

/*function addSlidableColumn(columnClass, columnCount) { 
	
	var columnSelector = $('.' + columnClass);
	
	columnSelector.each(function() {
		addNewColumnRowUsingClone($(this), columnClass, columnCount);
	});
	
	columnCount.val(parseInt(columnCount.val()) + 1);
}

function removeChosen(elementId){
	
	$('#' + elementId +'_chosen').remove();
	
}

//Added newly with different approach to clone a column and then make updates.
function addNewColumnRowUsingClone(tdToClone, columnClass, columnCount) {
	
	var $row = $(tdToClone).parent();
	var $clonedTd  = $(tdToClone).clone();
	
	//remove the class for the newly added column
	$clonedTd.removeClass(columnClass);
	
	//Increment the index of the elements in the cloned Td with next index.
	var clonedHtml = $clonedTd.replaceIndices(columnCount.val());
	
	$row.append(clonedHtml);
	
	//clear the values of the elements added to the new column
	$row.find('td:last').find('input, select, checkbox').each(function(){
		if($(this).is('input:text') || $(this).is('select')) { // text box and select
			$(this).val('');
			// add a class indicates newly added column
			$(this).addClass('addNewColumn');
			
			if($(this).is('select')){
			     //DESTROY and recreate the plugin so the handlers will works.
				 //TODO:ssirigineedi Revisit later. do we need to recreate ? ..Alternatively we can deep clone which can copy event handlers as well.

				if(!$(this).hasClass('dropDownMultiSelect')){
					 $(this).next('div').remove();
					 addChosen(this.id);
				}
			}
	    } 
		else if($(this).is('input:hidden')) { // hidden
			// don't clear check box and its check box hidden variables
			if ($(this).is("input[type!=checkbox]")) {
				if (($(this).val() != 'on') && ($(this).val() != 'true')) {
					$(this).val("");
				}
			}
		} 
		else if($(this).is('input:checkbox')) { //check box
	    	$(this).attr('checked', false);
	    	// add a class indicates newly added column
			$(this).addClass("addNewColumn");
	    }	
	});
	
	 //TODO: Revisit later. Why this is needed in the first place...?
	
	$row.find('td:last').find('.clsValidatingInput').blur(function(){		
		recordLastInput(this, 'lastInputLeft');
	}).focus(function(){		
		validateLastInput('lastInputLeft');
	});
	
}*/

// see above method for the changes and enhancements
/*function addVehicleColumnRow(col, columnClass, columnCount) {
	
	var start = $.now();
	
	//TODO: DESTROY and recreate the plugin so the handlers will works.
	col.find('select').each(function() {
		if($(this).is('select:not(select[multiple])')){
		     $(this).chosen('destroy');
		} else {
			//TODO: visit later.
			removeDropdownCheckList(this);
		}
	});

	col.find('select').each(function(){
		if($(this).is('select:not(select[multiple])')){
			//TODO:
			//removeSelectBoxIt(this);
			removeChosen(this);
		} else {
			removeDropdownCheckList(this);
		}
	});
	
	//$('#performanceTiming_1').val($.now() - start);
	//start = $.now();
	
	var row = col.parent();
	//row.append(col.replaceIndices(columnCount.val()));
	row.append(clearElementsValues(col.replaceIndices(columnCount.val())));
	
	//$('#performanceTiming_2').val($.now() - start);
	//start = $.now();

	col.find('select').each(function(){
		if($(this).is('select:not(select[multiple])')){
			//addSelectBoxItForCol(this);
			addChosen(this.id);
		} else {
			//TODO: Visit later.
			addDropdownCheckListForCol(this);
		}
	});
	
	//$('#performanceTiming_3').val($.now() - start);
	//start = $.now();

	var col = row.children(":last");
	col.removeClass(columnClass);
	
	//$('#performanceTiming_4').val($.now() - start);
	//start = $.now();

	//clear the values of the elements for all browsers including ie
	col.find('input, select, checkbox').each(function(){
		if($(this).is('input:text') || $(this).is('select')) { // text box and select
			$(this).val("");
			// add a class indicates newly added column
			$(this).addClass('addNewColumn');
			if($(this).is('select:not(select[multiple])')){
				$(this).trigger('chosen:updated');
			}
	    } 
		else if($(this).is('input:hidden')) { // hidden
			// don't clear check box and its check box hidden variables
			if ($(this).is("input[type!=checkbox]")) {
				if (($(this).val() != 'on') && ($(this).val() != 'true')) {
					$(this).val("");
				}
			}
		} 
		else if($(this).is('input:checkbox')) { //check box
	    	$(this).attr('checked', false);
	    	// add a class indicates newly added column
			$(this).addClass("addNewColumn");
	    }	
		
		//Removed as this is handled during recreation above
		// apply wrappers to new dropdown
		if($(this).is('select:not(select[multiple])')){
			//addSelectBoxItForCol(this);
			addChosen(this.id);
		}
		
		if($(this).is('select[multiple]')){
			//TODO: Revisit later.
			addDropdownCheckListForCol(this);
		}
		
	});
	
	//$('#performanceTiming_5').val($.now() - start);
	//start = $.now();
    //TODO: Revisit later. Why this is needed in the first place...?
	col.find('.clsValidatingInput').blur(function(){		
		recordLastInput(this, 'lastInputLeft');
	}).focus(function(){		
		validateLastInput('lastInputLeft');
	});

	//$('#performanceTiming_6').val($.now() - start);
	//start = $.now();

	return col;
}
*/


/*//tjmcd - This entire routine needs to be reviewed. I think it's overly complex, slow, and probe to breaking
//SSirigineedi: Agree. Can be done in a simpler way by reducing the scope of selectors being used and cloning.
//Need to find time to rewrite the logic.
function deleteColumns(childIndex, tableClass, columnCount) {

	$('.' + tableClass + ' > tbody > tr').each(function () {
		
		var columnsToReset = $('> td:gt(' + (parseInt(childIndex)) + ')', this);
		
		// childIndex is 0 for first column since label column is removed.  
		if (childIndex == 0) {
			// Add the duplication class to the second column
			// Then delete the first column
			var firstChild = $('> td:nth-child(1)', this);
			var nextChild = firstChild.next();
			nextChild.addClass('addDelColumn');
			firstChild.remove();
		} else {
			// Remove the indexed column from each row
			//$('> td:nth-child(' + parseInt(childIndex) + ')', this).remove();
			// skip horizontal line removal
			if ($(this).find('hr').length <= 0) {
				// tjmcd - work around to avoid issues with colspans not associated with an <hr>
				var cellIndex = parseInt(childIndex);
				if (cellIndex < this.cells.length) {
					this.removeChild(this.cells[ parseInt(childIndex) ]);
				}
			}
		}
		
		// Bump the index of every column after this one down by 1
		columnsToReset.each(function () {
			var $this = $(this);
			
			// capture the values before decreasing index.
			var blnChecked = false;
			var strInputVal = '';
			var strSelectVal = '';
			var strOriginalValue = '';
			
			if ($this.find('input:checkbox').length == 1) {
				blnChecked = $this.find('input:checkbox').is(':checked');
			}
			else if($this.find('input:text').length == 1 || $this.find('select').length == 1) { 
				strInputVal = $this.find('input[id]:text').val();
				strSelectVal = $this.find('select').val();
				strOriginalValue = $this.find('select').data('OriginalValue');
			}
			
			// assign new html
			var newHtml = $this.decrementIndices();
			$this[0].innerHTML = newHtml;
			
			// also decrease error col id's index by 1
			if ($this.hasClass("errorCol")) {
				var currentId = $this[0].id;
				//remove last index
				currentId =currentId.substring(0, (currentId.lastIndexOf("_") + 1));
				
				var newId = currentId + (parseInt(getIndexById($this[0].id)) - 1); 
				$this.attr("id", newId);
			}
						
			// re assign above values
			if ($this.find('input:checkbox').length == 1) {
				$this.find('input:checkbox').attr('checked', blnChecked);
			}
			else if($this.find('input:text').length == 1 || $this.find('select').length == 1) { 
				$this.find('input[id]:text').val(strInputVal);
				$this.find('select').val(strSelectVal);
				$this.find('select').data('OriginalValue', strOriginalValue);
			}
			
			// need to rebuild dropdown wrappers for newly indexed column
			var select =$this.find('select:not(select[multiple])');
			//if(select.length == 1){//
			//TODO: Do we neeed to rebuild the selectMenu ?? Trigger will take care
			removeChosen($(select).attr('id'));
			addChosen($(select).attr('id'));
				//addSelectBoxItForCol(select);
			//}
			
			var multiSelect =$this.find('select[multiple]');
			if(multiSelect.length == 1){
				addDropdownCheckListForCol(multiSelect);
			}
			
		});
	});
	
	columnCount.val(parseInt(columnCount.val()) - 1);
}*/

/*function clearErrorForAddColumn(columnPrefix, selector) {
	//remove inlineError class for all last column copied cells input fields
	//$(selector + columnPrefix.substring (0, (columnPrefix.length - 1) )).removeClass('inlineError');
	var lastColumnCells = $(selector + columnPrefix.substring (0, (columnPrefix.length - 1) ));
	
	lastColumnCells.each(function(){
		$(this).find('input, div').removeClass('inlineError');
		$(this).find('select').removeClass('inlineError').trigger('chosen:styleUpdated');
	});
	
	//remove inlineErrorMsg and clear html for last error cell 
	$('tr.errorRow').each(function(){
		$(this).find('td:last').removeClass('inlineErrorMsg');
		$(this).find('td:last').html('');
	});
	
}*/