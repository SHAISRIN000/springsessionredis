
//STG validation loader
jQuery(document).ready(function(){ 


	jQuery("form").each(function() {
		jQuery(this).validate({

		//Setup <DIV> for error message display
		errorElement: "div", 
		wrapper: "div",  //a wrapper around the error message
		errorPlacement: function(error, element) {
			offset = element.offset();
			error.insertBefore(element)
			error.addClass('message');  //add a class to the wrapper
		//	error.css('position', 'absolute');
			error.css('left', offset.left + element.outerWidth());  //display errors to the left of the element
			error.css('top', offset.top);
		  	error.css('z-index', 1000);		//Set zIndex to 1000 to hover above other elements
		}});

    }); 
    
    
    //================================
    //Configure STG validation rules
    //================================

    jQuery.validator.addClassRules("vRequired", {
	//Enables validation for the element
    	required: true
    });

	//---------------------------
	//Alpha validation routines
	//---------------------------

    jQuery.validator.addClassRules("vAlpha", {
   	//Alpha validation (a-z, A-Z)
    	lettersonly: true
    });

    jQuery.validator.addClassRules("vAlphaSpace", {
   	//Alpha space validation (a-z, A-Z, ' ')
    	alphaSpace: true
    });

    jQuery.validator.addClassRules("vAlphaNumSpace", {
   	//Alpha space validation (a-z, A-Z, ' ')
    	alphaNumSpace: true
    });

    jQuery.validator.addClassRules("vNoSpaces", {
   	//No whitespace validation
			nowhitespace: true
    });

    jQuery.validator.addClassRules("vAlphaNum", {
   	//Text validation (a-z, A-Z, 0-9)
			alphaNum: true
    });

	//---------------------------
	//Numeric validation routines
	//---------------------------

    jQuery.validator.addClassRules("vNumber", {
	//Numeric validation (0-9,.) 
    	number: true
    });

    jQuery.validator.addClassRules("vInteger", {
	//Numeric validation (0-9,.) 
    	integer: true
    });

    jQuery.validator.addClassRules("vDigits", {
	//Digit validation (0-9)
    	digits: true
    });

	//-----------------------------
	//Date/Time validation routines
	//-----------------------------

    jQuery.validator.addClassRules("vDate", {
	//Date validation (mm/dd/yyyy or yyyy/mm/dd)
    	date: true
    });

    jQuery.validator.addClassRules("vDateISO", {
	//Date (ISO) validation (mm/dd/yyyy or yyyy/mm/dd)
    	dateISO: true
    });

    jQuery.validator.addClassRules("vPriorDate", {
	//Date validation (mm/dd/yyyy or yyyy/mm/dd)
    	date: true,
    	priorDate: true
    });

    jQuery.validator.addClassRules("vFutureDate", {
	//Date validation (mm/dd/yyyy or yyyy/mm/dd)
    	date: true,
    	futureDate: true
    });

    jQuery.validator.addClassRules("vWeekday", {
	//Weekday validation
		date: true,
		weekDay: true
    });

    jQuery.validator.addClassRules("vWeekend", {
	//Weekend validation
		date: true,
		weekEnd: true
    });

    jQuery.validator.addClassRules("vTime", {
	//Time validation (12:34PM or 15:46)
		time: true
    });

	//---------------------------
	//Internet validation routines
	//---------------------------

    jQuery.validator.addClassRules("vUrl", {
	//URL validation (http://validurl.com)
    	url: true
    });

    jQuery.validator.addClassRules("vEmail", {
	//Email validation (email@somewhere.com)
    	email: true
    });

    jQuery.validator.addClassRules("vIPv4", {
	//IP Address (v4) validation
    	ipv4: true
    });

    jQuery.validator.addClassRules("vIPv6", {
	//IP Address (v6) validation
    	ipv6: true
    });

	//---------------------------
	//Phone validation routines
	//---------------------------

    jQuery.validator.addClassRules("vPhone", {
	//Phone validation (###-###-####)
		phoneUS: true
    });

	//-------------------------------
	//Credit Card validation routines
	//-------------------------------

    jQuery.validator.addClassRules("vCredit", {
   	//Credit card validation
    	creditcard: true
    });

	//---------------------------
	//Address validation routines
	//---------------------------

    jQuery.validator.addClassRules("vState", {
   	//State validation (only 2 alpha characters)
    	minlength: 2,
    	maxlength: 2,
    	state: true
    });

    jQuery.validator.addClassRules("vZip", {
	//Zip code validation (only 5 numeric characters)
    	number: true,
    	minlength: 5,
    	maxlength: 5
    });

    jQuery.validator.addClassRules("vZipExt", {
   	//Extended zip code validation (#####-####)
    	number: true,
    	minlength: 10,
    	maxlength: 10
    });


	//---------------------------
	//Vehicle validation routines
	//---------------------------

    jQuery.validator.addClassRules("vVIN", {
	//Vehicle Identification Number validation
    	vinUS: true
    });
  
 
    //================================
    //Custom STG validation functions
    //================================

    //------------------------------------------------------------------
  	//DESC: 	Validate value contains only alpha and space characters
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
		function alphaSpaceValidation(value, element) {  
			try
			{
			    // regular expression to match alpha and spaces
	    		exp = /^[a-zA-Z ]+$/
	
				//Validate 12hr and 24hr formats
	    		if(value == '' || value.match(exp)) {
			    	return true;
			    }
				else {
					return false;
				}
			}
			catch(err)
			{
				return false;
			}
		} 
		jQuery.validator.addMethod("alphaSpace", alphaSpaceValidation, "Please enter a value containing only alpha characters and spaces");


    //------------------------------------------------------------------
  	//DESC: 	Validate value contains only alphanumeric and space characters
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
		function alphaNumSpaceValidation(value, element) {  
			try
			{
			    // regular expression to match alpha and spaces
	    		exp = /^[a-zA-Z0-9 ]+$/
	
				//Validate 12hr and 24hr formats
	    		if(value == '' || value.match(exp)) {
			    	return true;
			    }
				else {
					return false;
				}
			}
			catch(err)
			{
				return false;
			}
		} 
		jQuery.validator.addMethod("alphaNumSpace", alphaNumSpaceValidation, "Please enter a value containing only alphanumeric characters and spaces");


    //------------------------------------------------------------------
  	//DESC: 	Validate value contains only alphanumeric without spaces
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function alphaNumValidation(value, element) {  
		try
		{
		    // regular expression to match alphanumeric and no spaces
    		exp = /^[a-zA-Z0-9]+$/

			//Validate regex
    		if(value == '' || value.match(exp)) {
		    	return true;
		    }
			else {
				return false;
			}
		}
		catch(err)
		{
			return false;
		}
	} 
	jQuery.validator.addMethod("alphaNum", alphaNumValidation, "Please enter a value containing only alphanumeric characters without spaces");



  	//------------------------------------------------------------------
  	//DESC: 	Validate date is greater than today
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function futureDateValidation(value, element) {  
		var testDate = value;
		if (value == '' || Date.parse(testDate) > new Date()) {
			return true;
		}
		else {
			return false;
		} 
	} 
	jQuery.validator.addMethod("futureDate", futureDateValidation, "Please enter a date greater than today.");


  	//------------------------------------------------------------------
  	//DESC: 	Validate date is less than today
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function priorDateValidation(value, element) {  
		var testDate = value;
		if (value == '' || Date.parse(testDate) > new Date()) {
			return true;
		}
		else {
			return false;
		} 
	} 
	jQuery.validator.addMethod("priorDate", priorDateValidation, "Please enter a date prior to today.");


  	//------------------------------------------------------------------
  	//DESC: 	Validate date is a weekday
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function weekDayValidation(value, element) {  
		try
		{
			var testDate = new Date(value);
			var DOW = testDate.getDay();
			if (value =='' || (DOW > 0 && DOW < 6))
				return true;
			else
				return false;
		}
		catch(err)
		{
			return false;
		}
	} 
	jQuery.validator.addMethod("weekDay", weekDayValidation, "Please enter a valid date for a weekday.");
  
  
  	//------------------------------------------------------------------
  	//DESC: 	Validate date is a weekend
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function weekEndValidation(value, element) {  
		try
		{
			var testDate = new Date(value);
			var DOW = testDate.getDay();
			if (value == '' || (DOW == 0 || DOW == 6))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		catch(err)
		{
			return false;
		}
	} 
	jQuery.validator.addMethod("weekEnd", weekEndValidation, "Please enter a valid date for a weekend.");
  
  
    //------------------------------------------------------------------
  	//DESC: 	Validate state
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function stateValidation(value, element) {  
		try
		{
			states = "wa|or|ca|ak|nv|id|ut|az|hi|mt|wy" +
			"co|nm|nd|sd|ne|ks|ok|tx|mn|ia|mo" +
			"ar|la|wi|il|ms|mi|in|ky|tn|al|fl" +
			"ga|sc|nc|oh|wv|va|pa|ny|vt|me|nh" +
			"ma|ri|ct|nj|de|md|dc";
			
			if (states.indexOf(value.toLowerCase() + "|") > -1) {
				return true;
			}
			else {
				return false;	
			}
		}
		catch(err)
		{
			return false;
		}
	} 
	jQuery.validator.addMethod("state", stateValidation, "Please enter a valid US state.");

  
  
    //------------------------------------------------------------------
  	//DESC: 	Validate time format (03:11 or 3:11am)
  	//CREATED: 	Bob Headrick
  	//PARAMS:
  	//	Value	value to be tested
  	//	Element element reference containing the value to be tested
  	//RETURNS:
  	//	True	success
  	//	False	failure
  	//-------------------------------------------------------------------
	function timeValidation(value, element) {  
		try
		{
		    // regular expression to match required time format
    		exp1 = /^([01]\d|2[0-3])(:[0-5]\d){0,2}$/  //24hr time
				exp2 = /^((0?[1-9]|1[012])(:[0-5]\d){0,2}(\ [AP]M))$/i  //12hr time

			//Validate 12hr and 24hr formats
    		if(value == '' || (value.match(exp1) || value.match(exp2))) {
		    	return true;
		    }
			else {
				return false;
			}
		}
		catch(err)
		{
			return false;
		}
	} 
	jQuery.validator.addMethod("time", timeValidation, "Please enter a valid time [03:11 or 3:11am].");
   
  }); 

