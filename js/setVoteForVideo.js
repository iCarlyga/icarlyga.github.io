//for video players with vote slider:

VOTE_SLIDER_ID = 'slider'
var current_video = 0

if (typeof(ALL_CHANNELS) != 'undefined') {

  var video_dictionary = {}
  var videos_title_obj = {} 
  var vid_obj
  var chan_obj = ALL_CHANNELS
  for (var chans in chan_obj)
    for (var cats in chan_obj[chans].categories) {
      for (var vids in chan_obj[chans].categories[cats].videos) {
        vid_obj = chan_obj[chans].categories[cats].videos[vids] 
        videos_title_obj[escape(vid_obj.title)] = vids
        vid_obj.channel = chans
        vid_obj.category = cats
        video_dictionary[vids] = vid_obj
      }
    } 

}
  
function setAssetIdByVideoTitle(video_title) {
  if (typeof(videos_title_obj) != 'undefined') {
    video_title = escape(video_title)
    var id = videos_title_obj[video_title]
    document.getElementById(VOTE_SLIDER_ID).setId(id)
  } else {
    var voting_error = 'videos_title_obj not defined'
  }
}

function setNewVideo(vidId) {
  //alert(vidId)
  if (vidId && (vidId != -1)) {
    current_video = vidId
    if (document.getElementById(VOTE_SLIDER_ID).setId)
      document.getElementById(VOTE_SLIDER_ID).setId(vidId)
  }
}

// video button handlers

function sendthis() {
  popSend.setVideo(current_video) 
}

function embedthis() {
  var l_arr = ('' + document.location).split('/')
  var baseurl = l_arr[0] + '//' + l_arr[2] + '/embedVideo/index.html'
  var popupSetter = new EmbedPopupSetter(baseurl)
  if (current_video != -1) 
    popupSetter.popup(current_video)
}
if (typeof RatingSubmit == 'function') {
  var ratingSubmit = {}; 
  function setupRatingSubmit() {      
    var isbeta = typeof find_if_beta === 'function' && find_if_beta()
    var pollHost = isbeta ? 'http://beta.polls.icarly.com': 'http://polls.icarly.com';
    ratingSubmit = new RatingSubmit({submitURL:pollHost});
  }
  setupRatingSubmit();
  function submitVote(assetId, rating) {
    ratingSubmit.submit(assetId,rating);
  }
}

// Video functions for Ask a Question page

// Video Functions

if (typeof feedback !== 'object')
  feedback = {}

feedback.playClip = function(videoId) {
  window.scrollTo(0, 300);
  playVidIfLoaded(videoId);
}

function playVidIfLoaded(vidId) {
  var duration = 500;
  // send the play request if the function has been established
  if (getPlayer && (getPlayer().selectVideo)) {
    getPlayer().selectVideo(vidId);
  } else {
    // else call this function again if the function has not been established
    window.setTimeout(function() {
      playVidIfLoaded(vidId);
    },
    duration);
  }
}

var default_config_url = ''
var swf_url = ''

function refreshPlayer(playerConfig) {
  //alert('refreshPlayer: '+playerConfig)
  
  var flash_objects = flash_to_objects('player')
  var params = flash_objects.params
  var flashVars = flash_objects.flashVars || flash_objects.flashvars
  
  //If this is a LoadUrl, replace movie url with LoadUrl
  if (flashVars.loadUrl) {
    params.movie = flashVars.loadUrl
    delete flashVars.loadUrl
  }
   
  // If default config is not set, save the current config as the default
  var oldConfig = flashVars.playerConfig
  if (default_config_url === '') default_config_url = oldConfig
  
  // Use default config if playerConfig is not given
  if ((default_config_url !== '') && (typeof(playerConfig) === 'undefined')) {
  	//alert('using default player config because none was given');
    var playerConfig = default_config_url
    setHash()
  }

  //Replace the old config with the new config in playerHtml
  flashVars.playerConfig = playerConfig;
  
  // add autoPlayById flash var 
  if ((window.currVid) && (currVid.vid != -1)) {
    flashVars.autoPlayById = currVid.vid  
  }
  
  // remember movie swf url
  if (swf_url === '')
    swf_url = unescape(params.movie)
  
  //Replace the player with an swfobject
  obj = flashVars
  // debug flashvars and swf_url
  //str = '';
  //for (var id in obj) {
  //   str += id + ' = ' + obj[id] + '\n\n'
  //};
  //alert(str)
  //alert('swf_url ' +  swf_url) 
  replaceSwfWithEmptyDiv('player')
  swfobject.embedSWF(swf_url, 'player', '504',  "330", "9.0.0", '', flashVars, {'allowFullScreen':'true', 'allowScriptAccess':'always'}) 
}

function replaceSwfWithEmptyDiv(targetID){
   var el = document.getElementById(targetID);
   if(el){
      var div = document.createElement("div");
      el.parentNode.insertBefore(div, el);
      //Remove the SWF
      swfobject.removeSWF(targetID);   
      //Give the new DIV the old element's ID
      div.setAttribute("id", targetID);     
   }
}

function strToObj(str, split, equals) {
    var obj = {};
    split = split || '&'
    equals = equals || '='
    var key
    while (str.indexOf(equals) !== -1) {
        key = str.substr(0, str.indexOf(equals));
        str = str.substr(str.indexOf(equals) + 1, str.length); 
        end_index = str.indexOf(split); 
        if (end_index === -1) 
          end_index = str.length;
        obj[key] = str.substr(0, end_index); 
        str = str.substr(str.indexOf(split) + 1, str.length);
    }
    return obj
}


function flash_to_objects(id) {
  // return {params:object, flashVars:object}
  var params_jquery = $('#'+id+' param')
  var param_obj = {}
  for (var i=0; i<params_jquery.length; i++) {
    var param = params_jquery[i]
    param_obj[param.name] = param.value
  }
  
  if (param_obj.flashVars) {
    flashVars = strToObj(param_obj.flashVars)
    delete param_obj.flashVars 
  } else if (param_obj.flashvars) {
    flashVars = strToObj(param_obj.flashvars)
    delete param_obj.flashvars
  }
  
  return {'params':param_obj, 'flashVars':flashVars}
}

function refreshPlayerByCat(cat, chan) {
  //alert ('refreshPlayerByCat:  cat: '+cat+', chan: '+chan)
  if ( typeof(ALL_CHANNELS[chan]) != 'undefined')
    if ( typeof(ALL_CHANNELS[chan].categories[cat]) != 'undefined')
      if ( typeof(ALL_CHANNELS[chan].categories[cat].videoxml) != 'undefined') {
      	var playerConfig = ALL_CHANNELS[chan].categories[cat].videoxml
        //alert('playerConfig: ' + playerConfig)
        refreshPlayer(playerConfig);
      }
}

// End Video Functions
