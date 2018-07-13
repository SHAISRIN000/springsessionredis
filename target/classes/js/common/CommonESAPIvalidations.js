var charIndxPos;

function isValidNumerics(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^0-9]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidAlphaChars(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^A-Za-z]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidAlphaNumerics(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^A-Za-z0-9]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidName(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^A-Za-z.' ]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidDate(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^0-9-/]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidSSN(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^0-9-]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidEmail(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^A-Za-z0-9\-@._\+]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}

function isValidPhoneNum(strVal) {
	// This function checks to allow only specified chars below.
	// if Invalid then return false else return true.	
	charIndxPos = strVal.search("[^0-9-]"); 
	if(charIndxPos >= 0) {	 
	   return false; 
	}
	else {
		 return true;
	}
}