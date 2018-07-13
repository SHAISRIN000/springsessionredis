
var DEFAULT_ID_INCREMENT = 888;
var EMPTY = '';

var PolicySourceEnum = {
	NEW_BUSINESS	: "NEW_BUSINESS",
	ENDORSEMENT		: "ENDORSEMENT",
	DIRECT_ENTRY    : "Direct Entry",
	EZ_LYNKS		: "EZ Lynks",
	PL_RATER		: "PL Rater",	
	WIN_RATER		: "Win Rater",	
	CI_ENTRY		: "CI Entry",	
	PL_RATER		: "PL Rater",
	AMS_UPLOAD		: "AMS Upload"	
};

var StatesEnum = {
	STATE_MA	 : "MA",
	STATE_NJ	 : "NJ",
	STATE_CT	 : "CT",
	STATE_NY	 : "NY",
	STATE_RI	 : "RI",
	STATE_NH	 : "NH",
	STATE_PA	 : "PA"
};

var LicStatesEnum = {
	CAN_US_TERR  	 : "CDA",
	OTH_FOREIGN_LIC  : "FI",
	NOT_LICENSED 	 : "NLL" 
};

var LicCountryEnum = {
	CANADA       : "CDA",
	USA          : "USA",
	FOREIGN		 : "FRI"
};

var QuoteProgressEnum = {
	CLIENT       			: "client",
	DRIVERS      			: "drivers",
	VEHICLES	 			: "vehicles",
	ACCIDENTS_VIOLATIONS	: "accidentsViolations",
	DETAILS		 			: "details",
	COVERAGES	 			: "coverages",
	SUMMARY		 			: "summary",
	APPLICATION	 			: "application",
	BIND		 			: "bind",
	NOTES		 			: "notes",
	RATE		 			: "rate"
};

var QuoteProgressEnumJS = {
		client				: '1',
		drivers				: '2',
		vehicles			: '3',
		accidentsViolations	: '4',
		details				: '5',
		coverages			: '6',
		summary				: '7',
		application			: '8',
		bind				: '9',
		notes				: '10',
		rate				: '11'
	};

var EndorsementUserAction = {
	UpdateContactInformation	:"UpdateContactInformation",
	UpdateMailingAddress		:"UpdateMailingAddress",
	UpdateResidenceAddress		:"UpdateResidenceAddress",
	AddNamedInsured				:"AddNamedInsured",
	UpdateNamedInsured			:"UpdateNamedInsured",
	DeleteNamedInsured			:"DeleteNamedInsured",

	UpdateCoverage				:"UpdateCoverage",
	AddVehicle					:"AddVehicle",
	UpdateVehicle				:"UpdateVehicle",
	DeleteVehicle				:"DeleteVehicle",
	ReplaceVehicle				:"ReplaceVehicle",
	UpdateInsurableInterest		:"UpdateInsurableInterest",
	UpdateGarageLocation		:"UpdateGarageLocation",

	AddDriver					:"AddDriver",
	UpdateDriver				:"UpdateDriver",
	DeleteDriver				:"DeleteDriver",

	UpdatePolicyDiscount		:"UpdatePolicyDiscount",
	UpdateDriverDiscount		:"UpdateDriverDiscount",
	UpdateVehicleDiscount		:"UpdateVehicleDiscount",

	UpdatePaymentPlan			:"UpdatePaymentPlan",

	CancelPolicy				:"CancelPolicy",
	CancelPolicywithMailing		:"CancelPolicywithMailing",

	MultipleChanges				:"MultipleChanges",
	UpdateAffinityGroup			:"UpdateAffinityGroup"
}
