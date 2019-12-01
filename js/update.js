// update.js
// fixed glitch that kept asking windows 98 users to update above flash 9.

var flashUpdate = function() {
  
  // stop update if missing anything important 
  if (!window.getFlashVersion || !window.findOS || !$.browser.name)
    return false
    
  // set a cookie to keep track of update attempts, and stop showing alert notices if user refuese to update
  if (!get_cookie('update_count')) {
    set_cookie('update_count', 1, 60, '/')
  } else {
    var update_tries = parseInt( get_cookie('update_count') )
    if (update_tries > 3)
      return false
  }
  
  // messages to user  
  flashUpdate.vars = {
    title: '<strong>Freddie\'s update center</strong><br>\n',
    close_btn: '<a class="right_column" href="javascript:closeMsg()">close</a>',
    no_flash: 'hey, you don\'t have flash player. you\'re missing out on a lot of iCarly.ga<br>\n',
    old_flash1: 'hey, you need to update from flash player ',
    old_flash2: ' to see everything on iCarly.ga<br>\n',
    install: 'click here to get the latest flash player for ',
    mobile: 'You are using a mobile device without flash.<br>' + 
            'Click <a href="/m/">here</a> to go to iCarly.ga mobile.' 
  }
     
  var flash_version = parseInt(getFlashVersion())
  
  if (flash_version < 9)
  {
    findOS.init()
    var os = findOS.name
    var os_version = findOS.version
    var install_url = ''
    
    if (os === 'mac') {   
      if (os_version >= 10.4)     
        install_url = 'https://get.adobe.com/flashplayer/'      
      else if (os_version >= 10.2) 
        install_url = 'https://get.adobe.com/flashplayer/'
                    
    } else if (os === 'windows') { 
      if (window.ActiveXObject) {
        if (os_version >= 5.0)
          install_url = 'https://get.adobe.com/flashplayer/'
        else if ((os_version > 0) && (flash_version < 9))
          install_url = 'https://get.adobe.com/flashplayer/'
      } else {
        if (os_version >= 5.0)
          install_url = 'https://get.adobe.com/flashplayer/
        else if (os_version > 0)
          install_url = 'https://get.adobe.com/flashplayer/'
      }
    } else if ((os == 'iphone')||(os == 'mobile')) { 
        updateMsg(flashUpdate.vars.mobile)
    }
    
    if (install_url.length > 0) {
      str = flashUpdate.vars.title
      if (flash_version > 0) {
        str += flashUpdate.vars.old_flash1 + flash_version + flashUpdate.vars.old_flash2
        //str += 'You have flash version '+flash_version+'<br>\n'
      } else {
        str += flashUpdate.vars.no_flash
      }
      var browser_name = $.browser.name
      if (browser_name === 'msie') 
        browser_name = 'internet explorer'
        
      str += '<a href="'+install_url+'">' + flashUpdate.vars.install +
          os + ' ' + browser_name + '</a>'
      
      updateMsg(str)
    }
  }
}

// All flash installers
//downloads/flash-install-mac-1-3.dmg		
//downloads/flash-install-win-ie-5-7.exe
//downloads/flash-install-mac-4-5.dmg		
//downloads/flash-install-win-standard-1-4.exe
//downloads/flash-install-win-ie-1-4.exe		
//downloads/flash-install-win-standard-5-7.exe

// utilities
function getFlashVersion(){
  // ie
  try {
    try {
      // avoid fp6 minor version lookup issues
      // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
      var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      try { axo.AllowScriptAccess = 'always'; }
      catch(e) { return '6,0,0'; }
    } catch(e) {}
    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  // other browsers
  } catch(e) {
    try {
      if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
        return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      }
    } catch(e) {}
  }
  return '0,0,0';
}

// public api

function updateMsg(message){
  // Display any text or html message in a special alert on the top of the page
  message += flashUpdate.vars.close_btn
  $('#update_msg').hide().html('<div>'+message+'</div>').slideDown(500)
  if (window.scrollTo) window.scrollTo(0, 0)
}

function closeMsg(){
  // Hide 
  $('#update_msg').slideUp(500, function () {
      $('#update_msg').hide();
  });
  // set cookie
  if (!get_cookie('update_count')) {
    set_cookie('update_count', 1, 60, '/')
  } else {
    var update_tries = parseInt( get_cookie('update_count') )
    set_cookie('update_count', update_tries+1, 60, '/')
  }
}
