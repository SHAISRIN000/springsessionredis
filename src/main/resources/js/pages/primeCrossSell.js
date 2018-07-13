//complete hiding, showing, etc
function initialFormLoadProcessing()
{
	document.frmPrimeCrossSell.method = "POST";
	document.frmPrimeCrossSell.submit();
}

jQuery(document).ready(function() {
	initialFormLoadProcessing();
});
