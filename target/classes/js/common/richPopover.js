/* ===========================================================
 * richPopover.js 
 * =========================================================== */



 !function ($) {

  "use strict"; // jshint ;_;
  



 /* RICHPOPOVER PUBLIC CLASS DEFINITION
  * =============================== */
  
  var fromProto = function(proto){
      var f = function(){
          this.proto = proto;
      };
      f.prototype = proto;
      return new f();
  };
  
  var RichPopover = function (element, options) {
    this.init('richPopover', element, options);
    
    this.popoverProto = fromProto($.fn.popover.Constructor.prototype);
  };


  /* NOTE: RICHPOPOVER EXTENDS BOOTSTRAP-POPOVER.js
     ========================================== */

  RichPopover.prototype = $.extend({}, $.fn.popover.Constructor.prototype, {

    constructor: RichPopover

    , show: function () {
    	// Call the "parent" show function in the Popover plugIn
    	this.popoverProto['show'].call(this);
    	
    	// If there's a post-show function, call that
    	if (this.options.postShowCall != null) {
    		this.options.postShowCall.call(this);
    	}
    }

  });


 /* RICHPOPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.richPopover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('richPopover')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('richPopover', (data = new RichPopover(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.richPopover.Constructor = RichPopover;

  $.fn.richPopover.defaults = $.extend({} , $.fn.popover.defaults, {
	    postShowCall: null,
	    closeOnClick: true
  });

}(window.jQuery);