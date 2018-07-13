(function( jQuery, window, undefined ) {

// attrHooks: value
jQuery.attrHooks.checked = {
	get: function( elem, name ) {
		console.log("Use jQuery.prop instead of using Attr..!");
		if(jQuery.prop( elem, name )){
			return "checked";
		}
		return undefined;
	},
	set: function( elem, value ) {
		console.log("Use jQuery.prop instead of using Attr..!");
		value = true == value || "checked" === value;
		jQuery.prop( elem, "checked", value )
	}
};
})( jQuery, window );