jQuery(document).ready(function() {
 
	var imagePath = "../../resources/images/";
	var calendarImage = imagePath + "cal_icon.png";
	
	$('input.colDateField').datepicker({
		showOn: "button",buttonImage: calendarImage,buttonImageOnly:true,buttonText : 'Open calendar'
	}); 
	
	
	//Popover 
  $('.showPopover').popover({
	    position: 'right',
	    content: $("#popupContent").html()
	}).click(function(evt) {
	    evt.stopPropagation();
	    $(this).popover('show');
	});
 
	//close popover if user clicks anywhere outside of it
	$(document).click(function(e){ 
		$(".showPopover").popover('hide');
	}); 
  
   // Tooltip Example One
   $("#txtField").tooltip();

   // Tooltip Example Two
   var msg = $("#toolTipMsg").html();
   $("#showToolTip").tooltip({placement:'right'})
    .attr('data-original-title', msg)
    .trigger('hover');
   
   // Clickable checkbox label
   $("#chkLabel").click(function() {   
     $('#chkAddress').attr('checked', !$('#chkAddress').is(':checked'));    
   }); 
   
   // Date Picker
   $("#datePicker").datepicker();
   
   // watermark optional fields
   var optional = 'Optional';
	 $('.optional').val(optional).addClass('watermark');
   
    //if blur and no value inside, set watermark text and class again.
 	$('.optional').blur(function(){
  		if ($(this).val().length == 0){
    		$(this).val(optional).addClass('watermark');
		}
 	});
 
	//if focus and text is watermark, set it to empty and remove the watermark class
	$('.optional').focus(function(){
  		if ($(this).val() == optional){
    		$(this).val('').removeClass('watermark');
		}
 	});
   
});