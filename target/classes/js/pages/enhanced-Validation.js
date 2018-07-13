

// Moved and replaced corresponding methods in Validaiton. js




/*//SSIRIGINEEDI: Verified that these functions are from validaiton.js are used in Vehicles page. 
// Overriding here will actually only apply to Vehicles Tab( as the js functions order winning priority applies). 
// So modifying this wont impact existing pages as their respective validation features are still driven using the validation.js.
// Vehicle page is now ready to accept the changes related to the removal of SelectboxIt and adapt to the functionality of new Chosen Plugin.
// Slowly other tabs are moved to accept these changes.

function clearInLineRowError(strElementID, strRowName, strErrorRow,
		strColumnId, columnIndex, addDeleteCallback){

	//name of row
	var errorRow = null;
	var strErrorColId = '';
	
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		//strElementID = strErrorColId;  
		
	}
	//select error row, if it already exists 
	errorRow = $('#' + strRowName  + '_Error');
	//see if error row already exists
	if (errorRow == null || errorRow.length == 0 ) {
		//no error row, nothing to remove, so just return
		return ;
	}
	
	// remove red outline around existing col
	$('#' + strElementID).removeClass('inlineError');
	// also check for selectBoxIt naming convention and remove red outline
	//$('#' + strElementID + 'SelectBoxIt').removeClass('inlineError');
	//Remove the chosen container error red outline
	$('#' + strElementID+'_chosen a').removeClass('inlineError');
	
	
	if($.type(columnIndex) === "number"){	
	var removeRow = columnIndex < 0;
	var removeErrorSpan = false;
	
	if (! removeRow) {
		//FIXME: this empty() is removing the error row.
		$('#' + strColumnId).empty();
		//note:do not change below condition to keep empty error row.
		removeRow = $('.errorCol:not(:empty)', errorRow).length == 0;
		//above condition is not holding good.. revisit.
		removeErrorSpan = ($('.errorCol:not(:empty)', errorRow).length - $('.errorCol', errorRow).find('span').length) == 0;
	}
	
	if (removeRow || removeErrorSpan) {
		// invoke the callback if one is specified
		// Invoke BEFORE the row is removed, so that it can be referred to in context
		if (addDeleteCallback != null) {
			addDeleteCallback(errorRow, false);
		}

		// remove error row
		errorRow.remove();
	  }
	}
	if($.type(columnIndex) === "string")
	{
		var removeRow = parseErrorRow(strRowName,strErrorColId);
		if(removeRow){
			errorRow.remove();
		}
		else{
				$('#' + strErrorColId).text('');
			}
	}
	
	//TODO: When the errors are cleared completely for the Entire row, then we have remove the remove the extra <tr> created under
	//the row label. This will allow the row header label to align with with row inputs.
	
}

//Replaced the above processErrorRow method after migration.
function processErrorRow(strElementID, strErrorRow, columnIndex, strRowName, strErrorMsg, addDeleteCallback) {
	
	//alert('process error row strErrorRow ='+strErrorRow+'columIndex ='+columnIndex+'strRowName='+strRowName+'strElementID='+strElementID);
	var strErrorColId = strRowName + '_Error_Col';
	//if ($.type(columnIndex) == "number" && columnIndex >= 0) {
	//	strErrorColId += '_' + columnIndex;
	//}
	
	var isApp = false;
	if ($.type(columnIndex) === "string" && columnIndex.indexOf("app")!=-1) {
		strErrorColId = getErrorColumnId(strElementID);
		strRowName = getErrorRowId(strElementID);
		isApp=true;
	}else{
		if($.type(columnIndex) === "number" && columnIndex==-1){}
		else{
				strErrorColId += '_' + columnIndex;
		}
		
	}
	$('#' + jq(strElementID)).each(function(){
		//point to the TR containing the TD with error data	
		var dataRow = $(this).parents("tr").first();
		//see if error row already exists

		var addErrorRow = $('#' + strRowName  + '_Error').length == 0;
		if (addErrorRow) {
			//Error row does not exist, so insert it
			// make a unique id
			var strTempErrorRow = strErrorRow;			
			strErrorRow = strErrorRow.replace(/id="([^"]*)"/, 'id="' + strRowName + '_Error"');
			if (strTempErrorRow == strErrorRow){
				//replace failed look for an id without "s aroubnd it
				strErrorRow = strErrorRow.replace(/id=([^ ]*) /, 'id="' + strRowName + '_Error" ');
			}
	
			//Global replace of generic Ids with specific Ids
			
			if(isApp)
			{
				strErrorRow = processAppRows(strErrorRow,strElementID,strRowName);
			}
			else{
				strErrorRow = strErrorRow.replace(/Error_Col/g, strRowName + '_Error_Col');
			}
			$(strErrorRow).removeClass('hidden').insertAfter(dataRow);  //msg below
			
		}
		// add error message to td in error row		
		$('#' + strErrorColId)
			.empty()
			.append(strErrorMsg)
			.addClass('inlineErrorMsg');
		// put red outline around existing col
		$('#' + strElementID).addClass('inlineError');
		
		if ($('#' + strElementID).is('select:not(select[multiple])')) {
		
			$('#' + strElementID).addClass('inlineError').trigger('chosen:styleUpdated');
		}
		
		//By this time the chosen dropdown is not created yet. hence create it ?
		//Just apply class to the element and it is taken care when the page loads and chosen is applied.
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
			
		//	$('#' + strElementID+'_chosen a').addClass('inlineError');
		//}
		
		// refresh it if it is selectbox
		//if ($('#' + strElementID).is('select:not(select[multiple])')) {
		//	$('#' + strElementID).trigger("changeSelectBoxIt");
		//}
				
		// invoke the callback if one is specified
		// Do this AFTER the text is set so the error row height is correct
		if (addErrorRow && addDeleteCallback != null) {
			addDeleteCallback(dataRow.next(), true);
		}
	});
}


function applyFirstTimeThruStyle(selector , passOnFirstTime){

	//START: only do this the first time a page is displayed/ every time a new column is added. 
	
	if(passOnFirstTime == 'true') {
		
	   var optional = 'Optional';
	   var strSel = '';
	 
	   if (selector.length > 0){
		 strSel = selector;
		 
	   }
	 
	   //FIXME: the below is not an issue but multiple handlers are being assigned to elements and it progressively impacts
	   // the speed of the element interaction. Do we need blur and focus ?( an onChange would help us achieve what is needed) .
	   
	    // watermark empty, optional fields   
	   $('.optional', selector).each(function(){
		   if (null != $(this).val()) {
		  		if ($(this).val().length == 0){
		    		$(this).val(optional).addClass('watermark');
		  		}
		   }
	   });
	   //if blur and no value inside, set watermark text and class again.
	 	$('.optional', selector).blur(function(){
	  		if ($(this).val().length == 0){
	    		$(this).val(optional).addClass('watermark');
			}
	 	});
		//if focus and text is optional, set it to empty and remove the watermark class
		$('.optional', selector).focus(function(){
	  		if ($(this).val() == optional){
	    		$(this).val('').removeClass('watermark');
			}
		});
		// end watermark optional fields
		
		// required fields
		//DON't apply the selector multiple times to assign functions. Select the elements in one go and then apply all event handling functions.
		$('input.required', selector).each( function(){
			
			togglePreRequiredStyle($(this));
				
	    }).blur( function () {
	    	$(this).removeClass('preRequired');
			//togglePreRequiredStyle($(this));
			
		}).focus( function () {
	    	
	        $(this).removeClass('preRequired');
			
		});
		
		//Handle the select boxes specifically.
		//the only native event Chosen triggers on the original select field is 'change'. so focus and blur is out of question.
		//Can add prototype functions to the plugin itself to achieve this. TBD.
		
		// will need to remove preRequired on blur and focus - JG
		$('select.required', selector).each( function() {
			
			if(null != $(this).val() &&  $(this).val().length == 0) {
				$(this).addClass('preRequired').trigger('chosen:styleUpdated');
			} else {
				$(this).removeClass('preRequired').trigger('chosen:styleUpdated');
			}
			
		}).change(function () {
			
			$(this).removeClass('preRequired').trigger('chosen:styleUpdated');
			
		});
	}
}

function togglePreRequiredStyle(element) {
	
	if (null != element.val() &&  element.val().length == 0) {
		
		element.addClass('preRequired');
		
	} else {
		
		element.removeClass('preRequired');
	}
}

function setFocus(fieldId) {
	
	 var element = $('#'+ fieldId);
	 
	 if(element.is('select:not(select[multiple])')){
		 
		 $('#'+ fieldId +'_chosen a').removeClass('inlineError');
		 element.trigger("chosen:activate");
	 } else {
		 // regular input fields.
		 element.focus();
	 }
}
*/