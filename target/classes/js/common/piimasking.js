
function maskSSN(maskField,hdnField){
	var ssn = $.trim(maskField.value);
	var maskSSN;
	
	if(isEndorsement()){
		maskSSN = ssn.substr(0,5) + "****";
	} else {
		maskSSN = ssn.substr(0,6) + "-****";
	}
	
	if(isEndorsement()){
		if(ssn == "" || ssn.length == 0){
			$('#' + hdnField).val(ssn);
			$(maskField).val(ssn);
		}
	}
	
	if((ssn != "") && ((isEndorsement() && ssn.substr(5,4) != "****" )||ssn.substr(6,5) != "-****" )){
		$('#' + hdnField).val(ssn);
		$(maskField).val(maskSSN);
	}
}

function maskDOB(maskField,hdnField){
	var dob = $.trim(maskField.value);
	var maskDOB = "**/**/" + dob.substr(6,4);

	if((dob != "") && (dob.substr(0,6) != "**/**/")){
		$('#' + hdnField).val(dob);
		$(maskField).val(maskDOB);
	}
}

function maskLicenseNum(maskField,hdnField){
	var licNum = $.trim(maskField.value);
	var maskLicNum = licNum.substr(0,licNum.length-4) + "****";
	
	if((licNum != "") && (licNum.substr(licNum.length,-4) != "****")){
		$('#' + hdnField).val(licNum);
		$(maskField).val(maskLicNum);
	}
}

function maskAccountNum(maskField,hdnField){
	var accountNum = $.trim(maskField.value);
	var maskAccountNum = "*****" + accountNum.substr(accountNum.length-4,accountNum.length);
	if((accountNum != "") && (accountNum.substr(0,4) != "*****") && (maskAccountNum != accountNum)){
		$('#' + hdnField).val(accountNum);
		$(maskField).val(maskAccountNum);
	}
}

function maskDate(maskField,hdnField){
	var date = $.trim(maskField.value);
	var maskDate = "***" + date.substr(3,7);

	if((date != "") && (date.substr(0,3) != "***")){
		$('#' + hdnField).val(date);
		$(maskField).val(maskDate);
	}
}

function maskCardCvv(maskField,hdnField){
	var cardCvv = $.trim(maskField.value);
	var maskCardCvv =  "***" /*+ cardCvv.substr(0,3) +*/;
	
	if((cardCvv != "") && (cardCvv.substr(0,3) != "***")){
		$('#' + hdnField).val(cardCvv);
		if ($(maskField).prop('maxLength')== '4') {
			$(maskField).val("****");
		} else {
			$(maskField).val(maskCardCvv);
		}
	}
}