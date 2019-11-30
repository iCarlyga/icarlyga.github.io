// Fixed hammer IE bug - 1/22/10 - GV
// added debug mode and show_object functions - 10/13/09 - GV
// added find_if_beta, get_get, & makeListPop functions - 9/9/09 - GV

function set_cookie(name, value, num_days, path, domain, secure) {
  var expires = -1;
  if ((typeof num_days == "number") && (num_days >= 0)) {
    var d = new Date();
    d.setTime(d.getTime()+(num_days*24*60*60*1000));
    expires = d.toGMTString();
  }
  value = escape(value);
  document.cookie = name + "=" + value + ";" +
    (expires != -1 ? " expires=" + expires + ";" : "") +
    (path ? "path=" + path : "") +
    (domain ? "; domain=" + domain : "") +
    (secure ? "; secure" : "");
}

function get_cookie(name) {
  var i = document.cookie.lastIndexOf(name + '=');
  if (i == -1)
    return null;
  var value = document.cookie.substring(i + name.length + 1);
  var end = value.indexOf(';');
  if (end == -1)
    end = value.length;
  value = value.substring(0, end);
  value = unescape(value);
  return value;
}

function delete_cookie(name) {
  set_cookie(name, "-", 0);
}

function accepted_ads() {
  return get_cookie("iBeenBumpered") == '1';
}

function bumper_if_no_ad_cookie() {
  var accepted = accepted_ads();
  if (document.referrer.indexOf('.icarly.com/') == -1) { // no bumper check if coming from outside
    if (!accepted)
      set_bumper_cookie();
  }
  else if (!accepted)
    window.location = "/bumper.html?url=" + escape(document.location);
}

function outgoing_ok(key) {
  var params = "" + window.location.search;
  if (key == null) key = "destination=";
  var url_start = params.lastIndexOf(key);
  var url = params.substring(url_start + key.length);
  var url_end = url.indexOf(";");
  if (url_end == -1)
    url_end = url.length;
  url = unescape(url.substring(0, url_end));
  if (url.charAt(url.length - 1) == '#')
    url = url.substring(0, url.length - 1);
  window.location.replace(url);
}

function outgoing_close() {
  window.close();
}

function set_bumper_cookie() {
  set_cookie("iBeenBumpered", 1, null, "/");
}

function accept_ads() {
  set_bumper_cookie();
  outgoing_ok("url=");
}

var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December');

function date_quote(id_list) {
  var url = "/js/date_names.json";
  $.getJSON(url,
            function(data) {
              var d = new Date();
              var mon = d.getMonth() + 1;
              var day = d.getDate();
              var date_str = "" + d.getFullYear() + "-" + (mon < 10 ? '0' : '') + mon + '-' + (day < 10 ? '0' : '') + day;
              var str = data[date_str];
              if (str == null || str == '')
                str = data['not_found'];
              if (str == null || str == '')
                str = 'JSON Mystery';
             $(id_list).html(str);
            });
}

function date_str(id_list) {
  var d = new Date();
  $(id_list).html("" + DAY_NAMES[d.getDay()] + ", " + MONTH_NAMES[d.getMonth()] + " " + d.getDate());
}

function getPlayer() {
  return document.getElementById('player');
}


/*
  da Hamma - shake the window and/or its contents
*/
var intHammaStep = 0;    // which step we're on
var blnHammering = 0;    // whether or not we're currently hamma-ing
var blnHammaWindow = 1;    // whether or not we try to hamma the window
var strHammaShoken = 'frame';  // element in page to be hamma'd
function daHamma () {
  if (window.ActiveXObject) {
  	if( window.outerHeight && screen.availHeight && ((screen.availHeight - window.outerHeight) < 30)) {
      blnHammaWindow = 0;
    } else {
      blnHammaWindow = 1;
    }
    if( blnHammering ) {
      return false;
    } else {
      blnHammering = 1;
      daHammaHamma();
    }
  } else {
  	if (blnHammering == 0) {
      if( window.outerHeight && screen.availHeight && ((screen.availHeight - window.outerHeight) < 30)) {
        blnHammaWindow = 0;
      } else {
        blnHammaWindow = 1;
      }
      if( blnHammering ) {
        return false;
      } else {
        blnHammering = 1;
        daHammaHamma();
      }
    }
  }
}
function daHammaHamma () {
  var intBrowserMoveAmount = 5;
  var intContentMoveAmount = 2;
  var intTimeoutAmount = 10 + (intHammaStep * 5);
  if( intHammaStep < 20 ) {
  var oddNess = intHammaStep % 2;
  intHammaStep++;
  var objS = document.getElementById(strHammaShoken);
  var intX = objS.style.left ? parseInt(objS.style.left) : 50;
  var intY = objS.style.top ? parseInt(objS.style.top) : 0;
  if( oddNess ) {
    if (blnHammaWindow) {try {window.moveBy(0,intBrowserMoveAmount); window.moveBy(intBrowserMoveAmount,0);} catch (err) {appendDevNote(err.description);}}
    intX = intX + intContentMoveAmount; objS.style.left = intX + '%';
    intY = intY + intContentMoveAmount; objS.style.top = intY + '%';
  } else {
    if (blnHammaWindow) {try {window.moveBy(0,-intBrowserMoveAmount); window.moveBy(-intBrowserMoveAmount,0);} catch(err) {appendDevNote(err.description);}}
    intX = intX - intContentMoveAmount; objS.style.left = intX + '%';
    intY = intY - intContentMoveAmount; objS.style.top = intY + '%';
  }
  setTimeout("daHammaHamma()", intTimeoutAmount);
  } else {
  intHammaStep = 0;
  blnHammering = 0;
  }
}
function appendDevNote(msg) {window.devNotes? devNotes+=msg: devNotes=msg; devNotes+='\n'}
/*  end daHamma  */

function relaodFontMagic() {
  $('body').append("<script src='/js/sifr-config.js' type='text/javascript'></script>")
}

function find_if_beta() {
  // return true or false if 'beta.' is in url
  return ((window.location.toString()).indexOf('beta.') !== -1)
}


function get_get() {
  // return a dictionary with all get parameters in current url
  var get_dictionary = {}
  var uri = ''
  var index = 0
  var key  
  if (window.location) {
    uri = window.location.href.toString()
    index = 1 + uri.indexOf('?')
    if (index > 0)
      uri = uri.substr(index, uri.length - index)
    index = uri.indexOf('#')
    if (index > 0)
      uri = uri.substr(0, index)
    index = uri.indexOf('=')
    while (index > 0) {
      key = uri.substr(0, index)
      index++
      uri = uri.substr(index, uri.length-index)
      index = uri.indexOf('&')
      if (index <= 0)
        index = uri.length
      get_dictionary[key] = uri.substr(0, index)
      index++
      uri = uri.substr(index, uri.length-index)
      index = uri.indexOf('=')
    } 
  } 
  return get_dictionary
}

function makeListPop (container_id) {
  // This function makes all html dictionary terms in a container into buttons
  // that reveal corresponding dictionary definitions
  container_id = container_id || 'content';
  var terms_jquery = $('#'+ container_id + ' dt');
  var definitions_jquery = $('#'+ container_id + ' dd');
  for (var i=0; i<terms_jquery.length; i++) {
    terms_jquery[i].inum = i;
    definitions_jquery[i].inum = i;
    terms_jquery.eq(i).css('cursor', 'pointer');
    terms_jquery.eq(i).click( function(){
      var definition_jquery = $('#'+ container_id + ' dd').eq(this.inum);
      this_jquery = $(this)
      if (this_jquery.hasClass('active')) {
        this_jquery.removeClass('active');
        definition_jquery.hide('fast', function(){ definition_jquery.removeClass('active') });
      } else {
        this_jquery.addClass('active');
        definition_jquery.show('fast', function(){ definition_jquery.addClass('active') });
      }
    });
  } 
}

function show_object(obj, equals, splitter) {
  // A very useful function for debugging javascript objects
  var splitter =  splitter || '\n'
  var equals =  equals || ' == '
  if (typeof obj === 'object') {   
    var str = ''
    for (var id in obj) {
      var property = obj[id]
      if (typeof property === 'function') 
        str += id + equals + '(function)' + '\n'
      else if (typeof property === 'undefined')
        str += id + equals + '-undefined-' + '\n';  
      else if (property === '')
        str += id + equals + '(empty string)' + '\n';  
      else
        str += id + equals + property + '\n';      
    }   
    return str  
  } else 
    return 'type' + equals + typeof obj + splitter + obj.toString() 
}

  var debug_mode = false
  if (debug_mode) {
    window.onerror = function (msg, url, line) {
      alert("Message : " + msg + '\n' +
        "url : " + url  + '\n' +
        "Line number : " + line );
      }
  }