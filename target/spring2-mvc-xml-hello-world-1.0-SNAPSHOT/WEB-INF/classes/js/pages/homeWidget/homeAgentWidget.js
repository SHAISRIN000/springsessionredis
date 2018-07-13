
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

var autoComplete = (function(){
    // "use strict";
    function autoComplete(options){
        if (!document.querySelector) return;

        // helpers
        function hasClass(el, className){ return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className); }

        function addEvent(el, type, handler){
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler){
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context){
            addEvent(context || document, event, function(e){
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass))) el = el.parentElement;
                if (found) cb.call(el, e);
            });
        }

        var o = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: function (item, search){
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function(e, term, item){}
        };
        for (var k in options) { if (options.hasOwnProperty(k)) o[k] = options[k]; }

        // init
        var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i=0; i<elems.length; i++) {
            var that = elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = 'autocomplete-suggestions '+o.menuClass;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function(resize, next){
                var rect = that.getBoundingClientRect();
                that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) { that.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight); }
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            else if (selTop < 0)
                                that.sc.scrollTop = selTop + scrTop;
                        }
                }
            }
            addEvent(window, 'resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', function(e){
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(function(){ sel.className = sel.className.replace('selected', ''); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', function(e){
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', function(e){
                if (hasClass(this, 'autocomplete-suggestion')) { // else outside click
                    var v = this.getAttribute('data-val');
                    that.value = v;
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = function(){
                try { var over_sb = document.querySelector('.autocomplete-suggestions:hover'); } catch(e){ var over_sb = 0; }
                if (!over_sb) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function(){ that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(function(){ that.focus(); }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);

            var suggest = function(data){
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], val);
                    that.sc.innerHTML = s;
                    that.updateSC(0);
                }
                else
                    that.sc.style.display = 'none';
            }

            that.keydownHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next, sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? that.sc.querySelector('.autocomplete-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        }
                        else { sel.className = sel.className.replace('selected', ''); that.value = that.last_val; next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (key == 27) { that.value = that.last_val; that.sc.style.display = 'none'; }
                // enter
                else if (key == 13 || key == 9) {
                    var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display != 'none') { o.onSelect(e, sel.getAttribute('data-val'), sel); setTimeout(function(){ that.sc.style.display = 'none'; }, 20); }
                }
            };
            addEvent(that, 'keydown', that.keydownHandler);

            that.keyupHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);

            that.focusHandler = function(e){
                that.last_val = '\n';
                that.keyupHandler(e)
            };
            if (!o.minChars) addEvent(that, 'focus', that.focusHandler);
        }

        // public destroy method
        this.destroy = function(){
            for (var i=0; i<elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr)
                    that.setAttribute('autocomplete', that.autocompleteAttr);
                else
                    that.removeAttribute('autocomplete');
                document.body.removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
})();

(function(){
    if (typeof define === 'function' && define.amd)
        define('autoComplete', function () { return autoComplete; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = autoComplete;
    else
        window.autoComplete = autoComplete;
})();



//Home Widget Code
window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_org'] = '174RJ';
window['_fs_namespace'] = 'FS';
(function(m,n,e,t,l,o,g,y){
    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
    g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
    o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
    y="rec";g.shutdown=function(i,v){g(y,!1)};g.restart=function(i,v){g(y,!0)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(){};
})(window,document,window['_fs_namespace'],'script','user');


//Create googleTag
document.addEventListener("DOMContentLoaded", function(event) { 
	cretaHomeWidgetGoogleTag();
});
window.dataLayer = window.dataLayer || [];

function cretaHomeWidgetGoogleTag(){
	var jsscript = document.getElementsByTagName("script"); 
	var gTagValue;
	for (var i = 0; i < jsscript.length; i++) { 
	    var pattern = new RegExp('aiui/resources/js/pages/homeWidget/homeAgentWidget.js' ) // the name of your js, whose source you are looking for
	    if ( pattern.test( jsscript[i].getAttribute("src") ) ){
	    	if(jsscript[i].getAttribute("src").indexOf('homeowners.plymouthrock.com') >= 0){
	    		gTagValue = 'UA-61158495-5';
	    	}else{
	    		gTagValue = 'UA-112843890-1';
	    	}
	    	createGtag(gTagValue);
	    }
	}
}

function gtag() {
    dataLayer.push(arguments);
}

function createGtag(gTagValue){
	var gTag = gTagValue;
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://www.googletagmanager.com/gtag/js?id="+gTag;
	document.body.appendChild( script );
	gtag('js', new Date());
	gtag('config', gTag);
}

var homeWidgetAutoComplete;

function onEnteringWidgetHomeAddress(){
	//remove error message if exist
	clearInvalidAddressErrorMsg();
	
	if(!(homeWidgetAutoComplete instanceof autoComplete)){
		homeWidgetAutoComplete = new autoComplete({
		    selector: 'input[name="prac-address"]',
		    minChars: 3,
		    source: function (term, suggest) {
		        var keyWord = document.getElementById("prac-address").value;
		        var xhttp = new XMLHttpRequest();
		        var xmlDoc, txt;
		        var env = document.getElementById("prac-env").value;
		        term = term.toLowerCase();
		        xhttp.onreadystatechange = function () {
		            if (this.readyState == 4 && this.status == 200) {
		                xmlDoc = this.responseXML;
		                x = xmlDoc.getElementsByTagName('fullAddress');
		                var addresses = [];
		                for (i = 0; i < x.length; i++) {
		                    txt = x[i].childNodes[0].nodeValue;
		                    if(i >= 2){
		                        break;
		                    }
		                    addresses.push(txt);
		                }
		                suggest(addresses);
		            }
		        };
		        xhttp.open("GET", env + "aiui/consumer/retrieveAddressesConsumer?keyword=" + term + "&state=PA", true);
		        xhttp.send();
		    },
		    onSelect: function (e, term, item) {
		    }
		});  
	}
}

function parseAddress(address){
	var addressObj = {};
    var intPos = address.indexOf(",");
    var addressLine;
    var cityStateZip;
    var streetNum; var street; var aptNum; var city; var state; var zip;
    if (intPos > 0) {
        address = address.trim();
        addressLine = address.substring(0, intPos).trim();
        cityStateZip = address.substring(addressLine.length + 1, address.length).trim();

        intPos = addressLine.indexOf(" ");
        if (intPos > 0) {
            streetNum = addressLine.substring(0, intPos).trim();
            street = addressLine.substring(intPos, addressLine.length).trim();
        }

        intPos = cityStateZip.indexOf(",");
        if (intPos > 0) {
            var arrCityState = cityStateZip.split(",");
            if (arrCityState.length == 3) {
                // entered an apartment
                aptNum = arrCityState[0].trim();
                city = arrCityState[1].trim();
                state = arrCityState[2].trim();
            } else {
                // just have city, state zip
                city = arrCityState[0].trim();
                state = arrCityState[1].trim();
            }

            if (state.length > 2) {
                var statezip = state.trim();
                statezip.replace('.', '');
                statezip.replace(' ', '');
                state = statezip.substring(0, 2).trim();
                zip = statezip.substring(3, statezip.length).trim();
            }
        }
        addressObj['address1'] = addressLine;
        addressObj['city'] = city;
        addressObj['state'] = state;
        addressObj['zip'] = zip;
        addressObj['fullAddress'] = address;

    }
    return addressObj;
}

function getHomeQuotePremiumPrac(){
	var reqObj = {};
    var address = {};
    var env = document.getElementById("prac-env").value;
	var parsedAddress = parseAddress(document.getElementById("prac-address").value);
	 //validate Address
	if(!isValidAddress(document.getElementById("prac-address").value)){
		showInvalidAddressErrorMsg();
		return;
	}else{
		hideInvalidAddressErrorMsg();
	}
	
    
    address['addrLine1Txt'] = parsedAddress['address1'];
    address['addrLine2Txt'] = "";
    address['cityName'] = parsedAddress['city'];
    address['stateCd'] = parsedAddress['state'];
	address['zip'] = parsedAddress['zip'];
    address['fullAddress'] = parsedAddress['fullAddress'];
    
    reqObj['userAddress'] = JSON.stringify(address);
    reqObj['agentId'] = document.getElementById("prac-agencyCode").value;
    reqObj['username'] = document.getElementById("prac-uName").value;
    reqObj['password'] = document.getElementById("prac-pWord").value;
    reqObj['showPremium'] = document.getElementById("prac-showPremium").value;
    
    //show loading button
    document.getElementById("prac-getQuoteBtn").style.display = "none";
    document.getElementById("prac-loadingBtn").style.display = "inline-block";
    
    xhr = new XMLHttpRequest();
    
    xhr.open('POST', env+'aiui/login/campaign/widget/premium');
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.onload = function () {
        if (xhr.status === 200) {
        	document.getElementById("prac-getQuoteBtn").style.display = "inline-block";
            document.getElementById("prac-loadingBtn").style.display = "none";
            document.getElementById('prac-widget-content').innerHTML = xhr.responseText;
        }
        else if (xhr.status !== 200) {
        	document.getElementById("prac-getQuoteBtn").style.display = "inline-block";
            document.getElementById("prac-loadingBtn").style.display = "none";
            console.log('Error--> Error in geting premium in widget - PRAC Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(JSON.stringify(reqObj));

}

function getHomeQuoteNoPremiumPrac(){
	var fullAddress = document.getElementById("prac-address").value;
	 //validate Address
	if(!isValidAddress(fullAddress)){
		showInvalidAddressErrorMsg();
		return;
	}else{
		hideInvalidAddressErrorMsg();
	}
	
	if(fullAddress == null || fullAddress == ""){
		return;
	}
	
	var address = {};
 	var parsedAddress = parseAddress(fullAddress);
    address['addrLine1Txt'] = parsedAddress['address1'];
    address['addrLine2Txt'] = "";
    address['cityName'] = parsedAddress['city'];
    address['stateCd'] = parsedAddress['state'];
	address['zip'] = parsedAddress['zip'];
    address['fullAddress'] = parsedAddress['fullAddress'];
    document.getElementById("parsedAddressStr").value = JSON.stringify(address);
    
    document.getElementById('bannerForm').submit();
}

function getQuoteShowMeMoreBtn(){
	document.getElementById('actionForm').submit();
}

function clearInvalidAddressErrorMsg(){
	document.getElementById('prac-address').classList.remove('widgetInlineError');
	if (document.getElementById('invalidErrorMsg')){
		document.getElementById('invalidErrorMsg').style.display = "none";
		document.getElementById('invalidErrorMsg').classList.remove('widgetInvalidAddress');
	}
}

function showInvalidAddressErrorMsg() {
	document.getElementById('prac-address').classList.add('widgetInlineError');
	document.getElementById('invalidErrorMsg').style.display = "block";
	document.getElementById('invalidErrorMsg').classList.add('widgetInvalidAddress');
}

function hideInvalidAddressErrorMsg() {
	document.getElementById('prac-address').classList.remove('widgetInlineError');
	document.getElementById('invalidErrorMsg').style.display = "none";
	document.getElementById('invalidErrorMsg').classList.remove('widgetInvalidAddress');
}

function isValidAddress(address) {
	var fullAddress = address;
	var data = { 'fullAddress': fullAddress };
	data = parseManualAddrDQM(fullAddress, data);

	var street = data["route"];
	var city = data["locality"];
	var state = data["administrative_area_level_1"];
	var zip = data["postal_code"];

	if (street == "" || city == "" || state == "" || zip == "" || zip.length < 5) {
		var errorMessageID = 'InvalidFullAddress';
		return false;
	} else{
		return true;
	}
}

function parseManualAddrDQM(address, data) {
	var streetNum = "";
	var street = "";
	var aptNum = "";
	var city = "";
	var state = "";
	var zip = "";

	var intPos = address.indexOf(",");
	if (intPos > 0) {
		address = address.trim();
		var addressLine = address.substring(0, intPos).trim();
		var citystatezip = address.substring(addressLine.length + 1, address.length).trim();

		intPos = addressLine.indexOf(" ");
		if (intPos > 0) {
			streetNum = addressLine.substring(0, intPos).trim();
			street = addressLine.substring(intPos, addressLine.length).trim();
		}

		intPos = citystatezip.indexOf(",");
		if (intPos > 0) {
			var arrCityState = citystatezip.split(",");
			if (arrCityState.length == 3) {
				// entered an apartment
				aptNum = arrCityState[0].trim();
				city = arrCityState[1].trim();
				state = arrCityState[2].trim();
			} else {
				// just have city, state zip
				city = arrCityState[0].trim();
				state = arrCityState[1].trim();
			}

			if (state.length > 2) {
				var statezip = state.trim();
				statezip.replace('.', '');
				statezip.replace(' ', '');
				state = statezip.substring(0, 2).trim();
				zip = statezip.substring(3, statezip.length).trim();
			}
		}
	}

	data["street_number"] = streetNum;
	data["apt_number"] = aptNum;
	data["route"] = street;
	data["locality"] = city;
	data["administrative_area_level_1"] = state;
	data["postal_code"] = zip;
	data["country"] = "United States";

	return data;
}











