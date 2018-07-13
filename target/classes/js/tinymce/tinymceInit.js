tinymce.init({menubar:false,elementpath:false,selector:"#detail",theme:"modern",plugins:["advlist autolink lists link image charmap print preview hr anchor pagebreak","searchreplace wordcount visualblocks visualchars code fullscreen","insertdatetime media nonbreaking save table contextmenu directionality","template paste textcolor colorpicker textpattern imagetools"],toolbar1:"undo redo | cut copy paste | fontselect | fontsizeselect | table bullist numlist charmap pagebreak | preview print visualblocks",toolbar2:"styleselect | bold italic underline | superscript subscript strikethrough | forecolor backcolor |  alignleft aligncenter alignright alignjustify | outdent indent | link",target_list:false,default_link_target:"_blank",relative_urls:false,remove_script_host:false,document_base_url:"http://",link_assume_external_targets:false,link_title:false,image_advtab:true,visualblocks_default_state:true,forced_root_block:"div",fontsize_formats:"8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt",templates:[{title:"Test template 1",content:"Test 1"},{title:"Test template 2",content:"Test 2"}],content_css:["//fonts.googleapis.com/css?family=Lato:300","//www.tinymce.com/css/codepen.min.css"],setup:function(a){$(window).load(function(){var c,b;c=tinyMCE.activeEditor.getContent({format:"raw"}).replace(/(<([^>]+)>)/ig,"").length;b="<span class='mce-charcount mce-widget mce-label mce-flow-layout-item' style='float:right'>Characters: "+c+"</span>";$(b).insertAfter(".mce-path");$(".mce-wordcount").css({"float":"right",position:"relative"});if($("#detail_Error_Col").length){$(".mce-tinymce").attr("style","border: 1px solid #cb867b !important;")}});a.on("keyPress keyUp change",function(f){var d=f.type;var c,b;c=tinyMCE.activeEditor.getContent({format:"raw"}).replace(/(<([^>]+)>)/ig,"").length;$("span.mce-charcount").text("Characters: "+c);if(c!=0&&$("#detail_Error_Col").length){$(".mce-tinymce").attr("style","visibility: hidden; border-width: 1px;");showClearInLineErrorRowMsgs("","detail","",'aiForm|<tr id="detail_Error" class="errorRow"><td id="Error_Col" /></tr>',null)}else{if(c==0&&!$("#detail_Error_Col").length&&d!="keypress"){$(".mce-tinymce").attr("style","border: 1px solid #cb867b !important;");errorMessages=jQuery.parseJSON($("#errorMessages").val());showClearInLineErrorRowMsgs("","detail","detail.server.inLine.required",'aiForm|<tr id="detail_Error" class="errorRow"><td id="Error_Col" /></tr>',errorMessages)}}})}});