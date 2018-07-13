 jQuery(document).ready(function() {
 
  /* Resizable Modeless Window */
   $('#openModeless').click(function(e){
	   $("#myModeless").modal('show');
	   e.stopPropagation();
   });
  
 /* Modal Stationary Window */
 $('#openStationaryModal').click(function(e){
     $("#myStationaryModal").modal('show');
 });
 
 /* Modal Draggable Window */
 $('#openDraggableModal').click(function(e){
	  $("#myDraggableModal").modal('show');
  });

  /* Error Details windows */

  /* Mixture of Hard and Soft Edits Window */
  $('#openMixDetails').click(function(e){
	  $("#myDetailsModal").trigger(showErrorDetailsPopup); 
  });
  
  /* Hard Edits Details */
  $('#openHardDetails').click(function(e){
	  $("#myHardEditsModal").trigger(showErrorDetailsPopup); 
  });
  
  /* Soft Edits Details */
  $('#openSoftDetails').click(function(e){
	  $("#mySoftEditsModal").trigger(showErrorDetailsPopup);
  });
  
  /* Error Modal Window - Error Messaging */
  $('#openErrorModal').click(function(e){
      $("#myErrorModal").modal('show');
  });
  
  /* Error Modal Window - Other Example*/
  $('#openOtherErrorModal').click(function(e){
      $("#myOtherErrorModal").modal('show');
  });
  
  /* Warning Modal Window - Error Messaging */
  $('#openWarningModal').click(function(e){
      $("#myWarningModal").modal('show');
  });
  
  /* Warning Modal Window - Other Example*/
  $('#openOtherWarningModal').click(function(e){
      $("#myOtherWarningModal").modal('show');
  });
 
  /* Confirmation Modal Window */
  $('#openConfirmModal').click(function(e){
      $("#myConfirmModal").modal('show');
  });
  
  /* Info Modal Window */
  $('#openInfoModal').click(function(e){
      $("#myInfoModal").modal('show');
  });
  
  /* Tip Modal Window */
  $('#openTipModal').click(function(e){
      $("#myTipModal").modal('show');
  });

});


