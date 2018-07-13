jQuery.fn.replaceHTMLIndices = function (replacementHTML, newIndex) {

    // Get rid of the IE junk
    var re = /\s*(sizset|sizcache|jquery)\d*="[^"]*"/gi;
    replacementHTML = replacementHTML.replace(re,'');

    // Find the X index to replace
	var regex = new RegExp("\\[([^\\]]*)\\]", "g");
	var matches = regex.exec(replacementHTML);
	if (matches != null && matches.length > 0) {
		var index = matches[0].substring(1, matches[0].length - 1);

		// Change the "[X]" content to "[newIndex]"
		//var regex = new RegExp("\\[" + index + "\\]", "g");
		//replacementHTML = replacementHTML.replace(regex, '[' + newIndex + ']');

		if (replacementHTML.indexOf("driverlistAreas") >= 0) {
			 // temp fix for drivers list area child elements
	         var regex = new RegExp("drivers" + "\\[" + index + "\\]","g");
	         replacementHTML = replacementHTML.replace(regex, 'drivers[' + newIndex + ']');
	    }
	    else {
	         var regex = new RegExp("\\[" + index + "\\]", "g");
	         replacementHTML = replacementHTML.replace(regex, '[' + newIndex + ']');
	    }

		// Change the "_X" content to "_newIndex"
		var regex = new RegExp("_" + index, "g");
		replacementHTML = replacementHTML.replace(regex, '_' + newIndex);

	}

    return replacementHTML;
};

jQuery.fn.replaceIndices = function (newIndex) {

	return $(this).replaceHTMLIndices($(this).outerHTML(), newIndex);
};

jQuery.fn.decrementIndices = function () {

	var columnIndex = getColumnIndex(this);
	// 1 for the deleted column
	return this.replaceHTMLIndices(this.html(), columnIndex - 1);
};


/** tjmcd - If all multi-column pages adopt the "sliding" scrolling model,
 * this method can go away as it presumes that the row header column is in the
 * same table as the data, which is not true in the "sliding" model
 */
function getColumnIndex(columnField) {
	return getColumnIndexNoHeader(columnField) + 1;
};

function getColumnIndexNoHeader(columnField) {
	var parentRow = columnField.parent();
	var rowColumns = parentRow.children();

	// Add 1 to get past the row-header column
	return rowColumns.index(columnField);
}

function showColumn(tableClass, indexSelector) {

	var rows = $('.' + tableClass + ' > tbody > tr');
	var cols = $('> td:' + indexSelector, rows);
	cols.removeClass('hidden');
}

function addSlidableColumn(columnClass, columnCount) {

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
	//console.log('after replacing indices clonedHTML ='+clonedHtml);

	$row.append(clonedHtml);
	//console.log('appended clonedHTML ='+clonedHtml);
	//console.log("========================================================================");

	//clear the values of the elements added to the new column
	$row.find('td:last').find('input, select, checkbox').each(function(){
		if($(this).is('input:text') || $(this).is('select')) { // text box and select
			$(this).val('');
			// add a class indicates newly added column
			$(this).addClass('addNewColumn');

			if($(this).is('select')){
			     //DESTROY and recreate the plugin so the handlers will works.
				 //Revisit later. do we need to recreate ? ..Alternatively we can deep clone which can copy event handlers as well.

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
}

//tjmcd - This entire routine needs to be reviewed. I think it's overly complex, slow, and probe to breaking
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
}

function clearErrorForAddColumn(columnPrefix, selector) {
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

}

function getIndexById(id) {
	return parseInt(id.substring(id.lastIndexOf("_") + 1));
}

function deleteScrollableColumns(childIndex, tableClass,
		firstColumn, columnCount, maxDisplayed) {

	deleteColumns(childIndex, tableClass, columnCount);

	var columnCountIndex = parseInt(columnCount.val());
	var firstColumnIndex = parseInt(firstColumn.val());

	if (columnCountIndex - firstColumnIndex + 1 >= maxDisplayed) {
		showColumn(tableClass, 'nth-child(' + (firstColumnIndex + maxDisplayed) + ')');
	} else if (columnCountIndex > 1) {
		scrollLeft(tableClass, firstColumn, columnCount, maxDisplayed);
	}
}

function scrollLeft(tableClass, firstColumn, columnCount, maxDisplayed) {

	var firstColumnIndex = parseInt(firstColumn.val());

	if (firstColumnIndex > 1) {
		$('.' + tableClass + ' > tbody > tr').each(function () {
			$('> td:nth-child(' + (firstColumnIndex + maxDisplayed) + ')', this).addClass('hidden');
			$('> td:nth-child(' + firstColumnIndex + ')', this).removeClass('hidden');
		});

		firstColumn.val(firstColumnIndex - 1);
	}

}

function scrollRight(tableClass, firstColumn, columnCount, maxDisplayed, overScroll) {

	var firstColumnIndex = parseInt(firstColumn.val());

	if (overScroll || firstColumnIndex + maxDisplayed <= columnCount) {
		$('.' + tableClass + ' > tbody > tr').each(function () {
			$('> td:nth-child(' + (firstColumnIndex + 1) + ')', this).addClass('hidden');
			$('> td:nth-child(' + (firstColumnIndex + maxDisplayed + 1) + ')', this).removeClass('hidden');
		});

		firstColumn.val(firstColumnIndex + 1);
	}
}

function slideToStart(event, slidingFrame, firstColumn) {

	var position = slidingFrame.scrollLeft();
	slideLeft(event, slidingFrame, position);
    firstColumn.val(1);
    $('.clsLtScrollSel').addClass("hidden");
	$('.clsLtScrollGreySel').removeClass("hidden");
	$('.clsRtScrollGreySel').addClass("hidden");
  	$('.clsRtScrollSel').removeClass("hidden");
}

function slideTableLeft(event, slidingFrame, slidingTable,
		firstColumn, columnCount, columnsToScroll) {
	/* parms:
	 *  event:
	 *  slidingframe: selector of table to slide
	 *  slidingtable: used to get width of column to slide
	 *  firstColumn: first col showing
	 *  columncount: total number of columns
	 *  columnstoscroll: columns per page
	*/
	var firstColumnVal = parseInt(firstColumn.val());
	if (firstColumnVal - columnsToScroll >= 1) {
		var scrollWidth = 0;
		var cols = $('tr', slidingTable).eq(0).find('td').slice(firstColumnVal, firstColumnVal + columnsToScroll);
		cols.each(function () {
			scrollWidth += $(this).outerWidth(true);
		});
		slideLeft(event, slidingFrame, scrollWidth);
	    firstColumn.val(parseInt(firstColumn.val()) - columnsToScroll);
	    $('.clsRtScrollGreySel').addClass("hidden");
	  	$('.clsRtScrollSel').removeClass("hidden");
	}
	else{
		$('.clsLtScrollSel').addClass("hidden");
		$('.clsLtScrollGreySel').removeClass("hidden");
	}
}

function slideLeft(event, slidingFrame, scrollWidrh) {

	if(event.preventdefault){
		event.preventDefault();
	}
    slidingFrame.animate({scrollLeft:'-=' + scrollWidrh}, 'slow');
}

function slideToEnd(event, slidingFrame, slidingContent, firstColumn, columnCount, maxDisplayed) {

	var position = slidingFrame.scrollLeft();
	var frameWidth = slidingFrame.width();
	var contentWidth = slidingContent.width();
	slideRight(event, slidingFrame, contentWidth - position - frameWidth);
    firstColumn.val(Math.max(1, (parseInt(columnCount.val()) - maxDisplayed) + 1));
    $('.clsRtScrollSel').addClass("hidden");
	$('.clsRtScrollGreySel').removeClass("hidden");
	$('.clsLtScrollGreySel').addClass("hidden");
	$('.clsLtScrollSel').removeClass("hidden");

}

function slideTableRight(event, slidingFrame, slidingTable,
		firstColumn, columnCount, columnsPerPage, columnsToScroll) {
	/* args:
	 *  event:
	 *  slidingframe: selector of table to slide
	 *  slidingtable: used to get width of column to slide
	 *  firstColumn: first col showing
	 *  columncount: total number of columns
	 *  columnstoscroll: columns per page
	*/
	var firstColumnVal = parseInt(firstColumn.val());
	if (firstColumnVal <= columnCount - columnsPerPage) {
		var scrollWidth = 0;
		var cols = $('tr', slidingTable).eq(0).find('td')
			.slice(firstColumnVal - 1, firstColumnVal + columnsToScroll - 1);
		cols.each(function () {
			scrollWidth += $(this).outerWidth(true);
		});
		slideRight(event, slidingFrame, scrollWidth);
	    firstColumn.val(parseInt(firstColumn.val()) + columnsToScroll);
	    $('.clsLtScrollGreySel').addClass("hidden");
	  	$('.clsLtScrollSel').removeClass("hidden");
	}
	else{
		$('.clsRtScrollSel').addClass("hidden");
		$('.clsRtScrollGreySel').removeClass("hidden");
	}
}

function slideRight(event, slidingFrame, scrollWidrh) {
	if (event != null && event != undefined) {
		if(event.preventdefault){
			event.preventDefault();
		}
	}
    slidingFrame.animate({scrollLeft:'+=' + scrollWidrh}, 'slow');
}

function clearElementsValues(replacementHTML) {
	// Replace only selected="selected"  with ''  for dropdown selected value
	// Replace the value="xxxx" with value="" for textboxes
	// Replace the checked="checked" with '' for checkboxes

	var regex = new RegExp("<select" , "g");
	var matchSelect = regex.exec(replacementHTML);

	var regex = new RegExp("<input" , "g");
	var matchInput = regex.exec(replacementHTML);

	if (matchSelect != null && matchSelect.length > 0) {
		replacementHTML = replacementHTML.replace(/selected=\"selected\"/g, '');
	} else if (matchInput != null && matchInput.length > 0) {
		// below line commented as addColumnRow method takes care
		//replacementHTML = replacementHTML.replace(/value=\"(?!on)(?!true)([^\"]*)\"/g, 'value=""');
	}

	replacementHTML = replacementHTML.replace(/checked=\"checked\"/g, '');


	return replacementHTML;
}

//view and hide functionality of Optional coverages
function viewOptCoverages(){
		$(".opt").show();
		$("#hideOpt").show();
		$("#viewOpt").hide();
}


//view and hide functionality of Optional coverages
function hideOptCoverages(){
	$(".opt").hide();
	$("#viewOpt").show();
	$("#hideOpt").hide();
}
