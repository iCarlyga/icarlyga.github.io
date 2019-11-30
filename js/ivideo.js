// added alert for embed with no video selected. 12/09/09 -GV
// added setCategoryPicker. 11/20/09 -GV
// fixed archives in IE8. fix requires fusion player31 or later. 12/4/2009
// misc cleanup, optimization. requires fusion player23 or later. 10/28/2009
// added comments. 10/8/09 -GV
/* fixed issue with loading vid from all videos page */
/* Scroll To top is higher for no-top banner template  */

var currVid = {
  vid: -1, cat: -1, chan: -1
}
var loadingVid = {
  vid: -1, cat: -1, chan: -1
}
var exit_archive_flag = false;
var is_archive_flag = false;
video_comment_url = '/iVideo/index.html?comment=sent#vid'

loadingVid.reloadPlayer = function() {
  if (loadingVid.vid !== -1)
    currVid.vid = loadingVid.vid
  if (loadingVid.chan !== -1) 
    refreshPlayerByChan(loadingVid.chan)
  else
    refreshPlayer()
} 

function videoPageInit() {
  // check hash, refreshPlayer if neccessay, draw videolist, reload player with autoplay if neccessary
  // Get url hash and store for reference
  
  var newVid = {
    vid: -1,
    chan: -1,
    cat: -1
  }
  
  getVidObjFromHash(newVid)
    
  // set current video channel and tabs and title for archives, if archives
  if (newVid.chan != -1) {
    currVid.chan = newVid.chan        
    setVidChannel(newVid.chan)
    setTitleArchives()
  } 
  
  if (newVid.vid != -1) {
  	
  	currVid.vid = newVid.vid
  	
    if ((newVid.cat == -1) && (newVid.chan != -1)) {
      
      currVid.chan = newVid.chan
      loadingVid.chan = newVid.chan
      loadingVid.vid = newVid.vid
      
      //alert('coming from all videos -- draw custom videolist')
      $('div#video_channel_' + newVid.chan + ' ul').hide()
      $('div#video_channel_' + newVid.chan).append(drawVideoListByChan(newVid.chan))
      
      $('#videos_player_container object').css('opacity', 0)
      setTimeout('$("#videos_player_container object").css("opacity", 1);loadingVid.reloadPlayer()', 2000) 
    
    } else if ((newVid.cat != -1) && (newVid.chan != -1)) {
      
      currVid.cat = newVid.cat
      currVid.chan = newVid.chan
      
      // refresh player by category
      refreshPlayerByCat(newVid.cat, newVid.chan)
      
      //alert('refresh player by category') 
      $('div#video_channel_' + newVid.chan + ' ul').hide()
      $('div#video_channel_' + newVid.chan).append(drawVideoListByCat(newVid.cat, newVid.chan))
          
    } else if ((newVid.chan == -1) && (newVid.cat == -1)) {
    
      currVid.vid = newVid.vid 
      loadingVid.vid = newVid.vid
      
      setVidChannel(video_dictionary[loadingVid.vid].channel)
      
      //determine if video is in latest clips
      var isLatest = ( $('#videos_playlist_container').html().indexOf('Video('+loadingVid.vid) != -1 )
      if (!isLatest) {
        // if it isn't in latest clips, find its category and channel, and reload playlist and player
        loadingVid.cat = newVid.cat = video_dictionary[loadingVid.vid].category
        loadingVid.chan = newVid.chan = video_dictionary[loadingVid.vid].channel
        // refresh player by category
        refreshPlayerByCat(loadingVid.cat, loadingVid.chan)
        setVidChannel(loadingVid.chan)
        setTitleArchives()
        $('div#video_channel_' + newVid.chan + ' ul').hide()
        $('div#video_channel_' + newVid.chan).append(drawVideoListByCat(newVid.cat, newVid.chan))     
      }   else {
      //$('#videos_player_container object').css('opacity', 0)
      setTimeout('$("#videos_player_container object").css("opacity", 1);loadingVid.reloadPlayer()', 2000) 
      }
    }
  
    doPlayerCheck()

  //if chan or cat are in the url, but not vidID, show the video selector for channel or category
  
  } else if (newVid.vid == -1) {
    
    currVid.vid = newVid.vid 
    
    if ((newVid.cat != -1) && (newVid.chan != -1)) { 
      // show all videos in a category
      currVid.chan = newVid.chan 
      currVid.cat = newVid.cat 
      refreshPlayerByCat(newVid.cat, newVid.chan)
      $('div#video_channel_' + newVid.chan + ' ul').hide()
      $('div#video_channel_' + newVid.chan).append(drawVideoListByCat(newVid.cat, newVid.chan))
    
    } else if (newVid.chan != -1) {
      // show all videos in channel
      currVid.chan = newVid.chan 
      refreshPlayerByChan(newVid.chan)
      $('div#video_channel_' + newVid.chan + ' ul').hide()
      $('div#video_channel_' + newVid.chan).append(drawVideoListByChan(newVid.chan))
    }
  } 	

  currVid = newVid
  drawVideoLocker()
}

// set the visibility to the channel
// set the active channel
function setVidChannel(chanId) {

  var alertStr = '';
  // for identifying html_id prefix
  var searchLen = '';
  var searchString = '';
  var searchObject = '';
  // for 
  var curHTMLid = '';

  // get all children of the channel divs parent element in order to target the channel divs
  var catDivs_arr = document.getElementById('videos_playlist_container').childNodes;
  // loop through each div, operate on it if the html_id begins with the channel prefix
  var i = null;
  for (i = 0; i < catDivs_arr.length; i++) {
    if (catDivs_arr[i].nodeType == 1) {
      // check if the id starts with video_channel
      var listPreName = 'video_channel_';
      searchString = listPreName;
      searchLen = searchString.length
      searchObject = catDivs_arr[i].id;
      // operate on the div if the html_id starts with the channel prefix
      if (searchObject.substring(0, searchLen) == searchString) {
        // grab the channel id by getting the html_id after the prefix
        var curId = searchObject.substring(searchLen, searchObject.length);

        // if its the current channel argument remove hide from its classname
        if (chanId == curId) {
          curHTMLId = '#' + searchObject;
          $(curHTMLId).removeClass('hide');

        } else {
          //else if its not the current channel argument add hide to its classname
          curHTMLId = '#' + searchObject;
          $(curHTMLId).addClass('hide');
        }
      }    
    }
    
    // hide custom videos_playlist, show normal videos_playlist
    $('div#video_channel_' + chanId + ' ul.videos_playlist').eq(0).show()
    $('ul#custom_chan_' + chanId).hide()
    // set title to 'new clips'
    setTitleNewClips()
  }

  // get the child elements of the parent to the channel tab LIs in order to target the channel tabs LIs
  var chanLis_arr = document.getElementById('videos_playlist_header').childNodes;

  // loop through each div, operate on it if the html_id begins with the channel tab prefix
  var i = null;
  for (i = 0; i < chanLis_arr.length; i++) {
    if (chanLis_arr[i].nodeType == 1 && chanLis_arr[i].nodeName == 'LI') {

      // get the childnodes of the LI in order to target the A attribute which is the channel tab
      var curLiChildren_arr = chanLis_arr[i].childNodes;

      // loop through the child elements of the current channel tab LI
      for (ii = 0; ii < curLiChildren_arr.length; ii++) {

        // look into the element only if it is an A element 
        if ((curLiChildren_arr[ii].nodeType == 1) && (curLiChildren_arr[ii].nodeName == 'A')) {

          // channel tab html_id prefix
          var listPreName = 'videos_playlist_tab_';
          searchString = listPreName;
          searchLen = searchString.length
          searchObject = curLiChildren_arr[ii].id;

          // operate on the element if the html_id contains the channel tab prefix
          if (searchObject.substring(0, searchLen) == searchString) {

            // deduce the channel id as the html_id after the prefix
            var curTabId = searchObject.substring(searchLen, searchObject.length);

            // if the channel is the current channel add selected to it's class name
            if (chanId == curTabId) {
              curLiChildren_arr[ii].className = 'selected';
              // alertStr += 'remove hide from tab ' + curTabId + '\n';
            } else {
              // else if the channel is not the current channel clear the class name
              curLiChildren_arr[ii].className = '';
            }
          }
        }
      }
    }
  }
  setCategoryPicker(chanId)
}

var latest_option_str

function setCategoryPicker(chanId) {
    //PICK A CATEGORY: populate and activate category picker
    //get dom and dictionary references
    var category_dictionary = ALL_CHANNELS[chanId].categories;
    var list_jquery = $('#videos_playlist_category_list select')
    // get Latest Video text from page
    if (!window.latest_option_str) {
      if ((list_jquery.length > 0) && list_jquery[0].options && (list_jquery[0].options.length > 0))
        latest_option_str = list_jquery[0].options[0].text
      else latest_option_str = ''
    }
    if (list_jquery.length > 0) {
      //loop thru category dictionary, adding to options to category picker
      list_jquery.html('')[0].channel= chanId
      list_jquery.append('<option value="latest">' + latest_option_str + '</option>')
      for (var cat_id in category_dictionary) {
        list_jquery.append('<option value="' + cat_id + '">' + category_dictionary[cat_id].name + '</option>')
      }
      //on list change, go to gallery
      list_jquery[0].onchange = function () {
        var category = this.options[this.selectedIndex].value
          var channel = this.channel;
        if (category === "latest") {
          $('#videos_playlist_container ul.videos_playlist').hide();
          setVidChannel (channel);
        } else {
          makeCustomVideoSelector('div#video_channel_', channel, category);
        }
        //alert('show category ' + category + ' in channel ' + channel)
      }
    }     
}

$(function() {
  if (loadingVid.vid === -1)
    setCategoryPicker( ALL_CHANNELS.index_chan) 
})


function getHash() {
  var hash = ''
  if (typeof(document.location.hash)!='undefined') hash = document.location.hash
  else if (typeof(window.location.hash)!='undefined') hash = window.location.hash
  else if (typeof(location.hash)!='undefined') hash = location.hash
  return (''+ hash)
}
function setHash(hash) {
  
  // use a default hash string to prevent unwanted page reload and scolling
  var default_hash = 'vid'+currVid.vid
  if (typeof(hash)=='undefined') 
    var hash = default_hash
  else if (hash.length < 1)
    hash = default_hash
  
  if (typeof(document.location.hash) != 'undefined') document.location.hash = hash
  else if (typeof(window.location.hash) != 'undefined') window.location.hash = hash
  else if (typeof(location.hash) != 'undefined') location.hash = hash
}


function setUpVideo() {
    videoPageInit()
}

// digest link
function playVidIfLoaded(vidId) {
  //alert('playVidIfLoaded: '+vidId)
  var duration = 500;

  // send the play request if the function has been established
  if (getPlayer && (getPlayer().isReady) && (getPlayer().isReady()) ) {
    getPlayer().selectVideo(vidId);
  } else {
    // else call this function again if the function has not been established
    window.setTimeout(function() {
      playVidIfLoaded(vidId);
    },
    duration);
  }
}


function playPromo(vidId) {
  // by setting current vid, the player will be reloaded with an autplay by video id flash var
  currVid.vid = vidId;
  refreshPlayer()
  // scroll up to the player
  scrollToTop();
  //pickVideo(vidId);
}

function flash_to_objects(id) {
  // return {params:object, flashVars:object}
  if (!getPlayer().getParams) {
    var params_jquery = $('#'+id+' param')
    var param_obj = {}
    for (var i=0; i<params_jquery.length; i++) {
      var param = params_jquery[i]
      param_obj[param.name] = param.value
    }
  } else {  //silly hack for ie8. 12/1/09 -GV 
    var param_obj = getPlayer().getParams();
    param_obj.movie = getPlayer().data;
  }
  var flashVars = {'empty_flag':true}
  if (param_obj.flashVars) {
    flashVars = strToObj(param_obj.flashVars)
    delete param_obj.flashVars 
  } else if (param_obj.flashvars) {
    flashVars = strToObj(param_obj.flashvars)
    delete param_obj.flashvars
  }
  return {'params':param_obj, 'flashVars':flashVars}
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

var default_config_url = ''
var swf_url = ''
var reloadedOnce = false

function refreshPlayer(playerConfig) {
  // Get the complete html object tag for the video player
  //alert('refreshPlayer: '+playerConfig)
  
  var flash_objects = flash_to_objects('player')
  var params = flash_objects.params
  var flashVars = flash_objects.flashVars 
  
  if (flashVars.empty_flag) { //silly ie8 fix
     if (typeof playerConfig !== 'undefined')
       default_config_url = playerConfig;
     setTimeout('refreshPlayer()', 200);
     return;
  }
  
  replaceSwfWithEmptyDiv('player')
  
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
  if (currVid.vid != -1) {
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
  if (playerConfig === default_config_url)
    is_archive_flag = false;
  
  swfobject.embedSWF(swf_url, 'player', '504',  "332", "9.0.0", '', flashVars, {'allowFullScreen':'true', 'allowScriptAccess':'always'}) 
}

function strToObj(str, split, equals) {
    var obj = {};
    split = split || '&'
    equals = equals || '='
    var key
    str = str || ''
    while (str.indexOf(equals) !== -1) 
    {
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

function refreshPlayerByChan(chan) {
  var playerConfig = ALL_CHANNELS[chan].videoxml
  refreshPlayer(playerConfig);
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

function scrollToTop() {
  // scroll up to the player
  window.scrollTo(0, 315);
}

function getVidObjFromHash(obj) {
  // get video id, channel, and category from hash
  var hash = getHash();
  //alert('getVidObjFromHash: hash: '+hash)

  if (hash.indexOf('vid') != -1) {
    obj.vid = hash.substring(hash.indexOf('vid') + 3).split('_')[0]
  }
  if (hash.indexOf('chan') != -1) {
    obj.chan = hash.substring(hash.indexOf('chan') + 4).split('_')[0]
  }
  if (hash.indexOf('cat') != -1) {
    obj.cat = hash.substring(hash.indexOf('cat') + 3).split('_')[0]
  }
}

function pickVideo(vidId, catId, chanId, scroll_flag) {
  // compare with currentVideo to see if player or selector need to be redrawn, scroll, play video
  //alert('pickVideo: ' + vidId)

  var hash_obj = {
    vid: -1,
    cat: -1,
    chan: -1
  }
  getVidObjFromHash(hash_obj);
  
  // remember seleted video as current video and hash
  
  var hash_str = '';
  
  //alert ('don\'t write hash if chan id is not specified -- typeof(chanId): '+typeof(chanId))
  // don't write hash if vid id is not specified
  if (typeof(vidId) != 'undefined') {
  	
  	//alert ('chanId is valid, so write a video hash')
  
    if (vidId != -1) {
      currVid.vid = vidId
      hash_str += 'vid' + vidId
    }
    if ((typeof(catId) != 'undefined') && (catId != -1)) {
      currVid.cat = catId
      hash_str += '_cat' + catId
    }
    if ((typeof(catId) != 'undefined') &&(chanId != -1)) {
      currVid.chan = chanId
      hash_str += '_chan' + chanId
    }
  } //else alert ('chanId is invalid')
      
  //alert ('remember seleted video as current video and hash: '+hash_str)
  
  //setHash(hash_str)

  if (exit_archive_flag && is_archive_flag) {
    //alert('do refresh if selecting non-archive video after coming from archive: ')
    exit_archive_flag = false
    refreshPlayer()
  } else if ( (typeof(catId) != 'undefined') && (catId != hash_obj.cat) && (typeof(chanId) != 'undefined')) {
  	var config = ALL_CHANNELS[chanId].categories[catId].videoxml
    refreshPlayer(config)
    setTitleArchives()
  } else if ((typeof(vidId) != 'undefined') && (vidId != -1)) {
    //alert('vidId is valid - playing '+vidId);
    playVidIfLoaded(vidId)
  }

  newVid = currVid
    
  //alert ('checking scroll flag: '+typeof(scroll_flag))
  
  if (typeof(scroll_flag) != 'undefined') {
  	scrollToTop()
  	if (typeof(catId) != 'undefined') {
  	  //alert('valid catId. redawing video selector. catId: ' + catId)
  	  // change video selector to custom list
      setVidChannel(chanId)
      makeCustomVideoSelector('div#video_channel_', chanId, catId)
      setTitleArchives()
      //pick category in category list
      list_jquery = $('#videos_playlist_category_list select')
      if (list_jquery.length > 0) {
          list_jquery[0].value = parseInt( catId, 10)
      }
  	}
  }
  // update hash
  if (!window.ActiveXObject)
    setHash()
}

var starImgSrc = ''

function drawRatingStars(vidId) {
  // Draw html star rating based on database. For now, assume 8 out of 10 rating and draw 4 stars
  // get rating star image source
  if (starImgSrc == '') starImgSrc = $('div.videos_playlist_item_rating:first img:first').attr('src')
  // set rating
  if ((typeof(POLLS_AND_RATINGS)!='undefined') && (typeof(POLLS_AND_RATINGS.ratings[vidId])!='undefined'))
    var starRating = POLLS_AND_RATINGS.ratings[vidId]
  else
    var starRating = 8;
  var html_str = '';
  for (var i=1; i <= starRating/2; i++) 
    html_str += " <img src='" + starImgSrc + "' height='14' width='14'> "
  // half star <img> 
  if (starRating % 2 > 0) html_str += $('#half_star_ref').html().trim() 
  return html_str
}

function drawVideoListElement(vid_obj, lokr_flag) {
  var locker_str = ''
  html_str = "\n<li>"
  html_str += "\n<a href='javascript:pickVideo(" + vid_obj.id + ", " + vid_obj.catId + ", " + vid_obj.chanId
    if (typeof(lokr_flag) != 'undefined') {
      html_str += ", " + lokr_flag
      locker_str = 'Locker'
    }
  html_str += ")'>"
  html_str += "\n<img src='" + vid_obj.thumbnail + "' "
  html_str += "class='videos_playlist_thumbnail' width='70' height='48'/>"
  html_str += "\n<div class='videos_playlist_item_description'>"
  var video_text = vid_obj.title.replace("&#10;", "<br />")
  if ((typeof(vid_obj.description) != 'undefined') && (vid_obj.description.length > 0))
    video_text += "<br />\n" + vid_obj.description
  html_str += "\n<p>" + video_text + "</p>"
  html_str += "\n<div class='clear'></div>"
  html_str += "\n<div class='videos_playlist_item_rating' id='archiveRatingDiv" + locker_str + vid_obj.id + "'>"
  html_str += "\n" + drawRatingStars(vid_obj.id)
  html_str += "\n</div>\n</div>\n<div class='clear'></div>\n</a>\n</li>"
  return html_str
}

function drawVideoListByChan(chanId, lokrflag) {
  // makes an html list of all videos in a given channel
  var chan_obj = ALL_CHANNELS[chanId]
  var vid_obj

  if (typeof(lokrflag) == 'undefined') var html_str = "<ul class='videos_playlist' id ='custom_chan_" + chanId + "'>"
  else var html_str = "<ul class='videos_playlist' id ='lokr_custom_chan_" + chanId + "'>"

  // loop thru every video and add to array to be sorted
  var videos_array = []
  for (var cats in chan_obj.categories) {
    for (var vids in chan_obj.categories[cats].videos) {
      vid_obj = chan_obj.categories[cats].videos[vids]  
      vid_obj.id = vids
      vid_obj.chanId = chanId
      vid_obj.catId = -1
      videos_array.push(vid_obj)
    }
  }
  videos_array.sort(sortByDate)
  // add every video in array to the html list, now that it is sorted by day
  for (var i in videos_array) {
    html_str += drawVideoListElement(videos_array[i])
  }
  html_str += "\n</ul>"

  return html_str
}

  var MAX_CATS = 6   // maximum categories per category list page

function sortByDate (a, b) {
  // sort in descending order by date property
  return ( b.date - a.date )
}
  
function drawCategoryList(chanId) {
  // make an html list of every category in a given channel, divided into pages

  //alert('drawCategoryList: ' + chanId)
  var chanName = ALL_CHANNELS[chanId].name
  var catName

  var html_str = '<div class="category_select">'
  html_str += '\n<h4><span>' + chanName + '</span></h4>'

  var firstCat = ' class="selected"'
  
  var c=0                // category count
  var p=0                // category page count
  
  var cat_array = []
  var cat_date
  var vid_date
  var debug  = ''
  
  // loop thru categories and push to array to be sorted

  for (var catId in ALL_CHANNELS[chanId].categories) {
    
    //find the earliest date of a video in this category
    cat_date = 0
    for (var vidId in ALL_CHANNELS[chanId].categories[catId].videos) {
      vid_date =  ALL_CHANNELS[chanId].categories[catId].videos[vidId].date
      if (vid_date > cat_date)
        cat_date = vid_date
    }
    
    // add id and date properties to category object before pushing to array

    ALL_CHANNELS[chanId].categories[catId].id = catId
    ALL_CHANNELS[chanId].categories[catId].date = cat_date
   
    cat_array.push( ALL_CHANNELS[chanId].categories[catId] )
  }

  cat_array.sort(sortByDate)

  for (var catIndex in cat_array) {
    
    if (catIndex % MAX_CATS == 0) {
      html_str += "\n<div class='list_block' id='category_page_" + p + "'>"
      p++
    }
           
    catName = cat_array[catIndex].name
    var catId = cat_array[catIndex].id
    html_str += '\n<a href="javascript:pickLockerCategory(' + catId + ')" id="locker_cat_' + catId + '"' + firstCat + '>'
    html_str += '<p>' + catName + '</p></a>'
    firstCat = ''        
    
    if (catIndex % MAX_CATS == MAX_CATS-1) {
      html_str += "\n</div>"
      firstCat = ' class="selected"'
    }
  }
  html_str += '\n</div>'
  
  // check for category pagination. If <div id='cat_page_selector' is on page, populate it
  
  firstCat = ' class="selected"'
  
  if ($('#cat_page_selector').length > 0) {
    var page_selector_html = "<div id='cat_page_selector'>\n<p>"
    for (var i=0; i<p; i++) {
      page_selector_html += "\n <a id='cat_page_pick_" + i + "'" + firstCat + " href='javascript:showCatPage(" + i + ")'>" + (i+1) + "</a> "
      firstCat = ''
    }
    page_selector_html += "\n</p></div>"
    
    if (p > 1) 
      $('#cat_page_selector').replaceWith(page_selector_html)
    else
      $('#cat_page_selector').replaceWith("<div id='cat_page_selector' style='display:none'></div>")
    //alert(page_selector_html);	
  }
  return html_str
}


var lokrChanId = ALL_CHANNELS.index_chan

function pickLockerChannel(chanId) {
  // change tab style, replace category selector, replace video selector (in locker)
  lokrChanId = chanId
  //switch channel tabs by moving 'selected' class
  $('#video_locker .channel_select a.selected').removeClass('selected')
  $('#video_locker .channel_select a#locker_chan_' + chanId).addClass('selected')
  // switch category selector
  $('#video_locker .category_select').replaceWith(drawCategoryList(chanId))
  // initialize category page
  showCatPage(0)
  // switch video selector (now done with showCatPage)
  //var firstCatId = firstCatInChan(chanId)
  //$('#video_locker ul.videos_playlist').replaceWith(drawVideoListByCat(firstCatId, chanId, true))
  // switch category title
  $('#video_locker .category_select h4 span').text(ALL_CHANNELS[lokrChanId].name)
  // vertically center category names more than one line long
  vertCentCats()
  // set comments
  if ((typeof comments === 'object') && comments.setup)
  	comments.setup( 'Video', currVid.vid, '#comments .content')
}

function drawVideoListByCat(catId, chanId, lockr_flag) {
  // makes an html list of all videos in a given category
  //alert('drawVideoListByCat: ' + chanId + ', ' + catId)
  var cat_obj = ALL_CHANNELS[chanId].categories[catId]
  var vid_obj
  locker_str = ''
  if (typeof(lockr_flag) != 'undefined') locker_str = 'Locker'
  
  html_str = "<ul class='videos_playlist'>"
  
  // loop thru every video and write html
  for (var vids in cat_obj.videos) {
    vid_obj = cat_obj.videos[vids]
    vid_obj.id = vids
    vid_obj.chanId = chanId
    vid_obj.catId = catId
    if (typeof(lockr_flag) != 'undefined')
      html_str += drawVideoListElement(vid_obj, true)
    else
      html_str += drawVideoListElement(vid_obj)
  }
  html_str += "\n</ul>"
  return html_str
}

function firstCatInChan(chanId) {
  // Find the first category in a given channel
  for (var catId in ALL_CHANNELS[chanId].categories)
    return catId
}

function drawVideoLocker() {
  // Draw the skeleton video locker
  if (currVid.chan != -1)
    lokrChanId = currVid.chan
  else
    lokrChanId = ALL_CHANNELS.index_chan
  if (currVid.cat != -1)
    var firstCat = currVid.cat
  else
    var firstCat = firstCatInChan(lokrChanId)
  
  $('#video_locker ul.videos_playlist').html(drawVideoListByCat(firstCat, lokrChanId, true))
  
  // select locker channel & category
  pickLockerChannel (lokrChanId)
 
  // display initial catogory page
  //showCatPage(0)
    
  // select current channel
}

function pickLockerCategory(catId) {
  var vidlist = '#video_locker ul.videos_playlist'
  var catlist = '#video_locker .category_select'
  // highlight selected category item
  $(catlist + ' a.selected').removeClass('selected')
  $(catlist + ' a#locker_cat_' + catId).addClass('selected')
  // draw video selector for category
  $(vidlist).replaceWith(drawVideoListByCat(catId, lokrChanId, true))
}

function toggleSprite(selector) {
  // toggles between two states of a sprite, assuming one image is on top, another on bottom
  var sprite = $(selector)
  var bg_position_y = $(selector).css('background-position').split(' ')[1]
  if (bg_position_y == "0%")
    $(selector).css('background-position', '50% 100%')
  else if (bg_position_y == "100%")
    $(selector).css('background-position', '50% 0%')
}

function makeCustomVideoSelector(selector, chanId, catId) {
  if (typeof(catId) != 'undefined') {
    // redraw top video selector to match video locker, by category
    $(selector + chanId + ' ul').hide()
    $(selector + chanId).append(drawVideoListByCat(catId, chanId))
  } else if (typeof(chanId) != 'undefined') {
    // draw custom videolist by channel, typically for all videos page
    $(selector + chanId + ' ul').hide()
    $(selector + chanId).append(drawVideoListByChan(chanId))
  } else {
    // refresh video selector back to normal by hiding custom videos_playlist, show normal videos_playlist
    $(selector + chanId + ' ul.videos_playlist').show()
    $('ul#custom_chan_' + chanId).hide()
  }
}

// toggle video list title between 'new clips' and 'archive clips' with css sprite
function setTitleNewClips() {
  $('#videos_playlist_container .title').css('background-position', 'center top')
  exit_archive_flag = true
}
function setTitleArchives() {
  $('#videos_playlist_container .title').css('background-position', 'center bottom')
  exit_archive_flag = false
  is_archive_flag = true;
}
// category pagination select. index is category page number (zero based)
function showCatPage(index) {
  $('div#video_locker .category_select .list_block').hide()
  $('div#video_locker #category_page_'+index).show()
  // show the video selector for the first category on page
  var idName = $('div#video_locker #category_page_'+index + ' a:first').attr('id')
  var catID = parseInt( idName.split('_')[2] )
  pickLockerCategory(catID)
  // show current page number
  $('#cat_page_selector .selected').removeClass('selected')
  $('#cat_page_selector #cat_page_pick_' + index).addClass('selected')
  // vertically center category names more than one line long
  vertCentCats()
  
}
function vertCentCats() {
  // Vercitically Center a CSS element greater than a given height
  (function(selector, max_height, center_margin) {

    for ( var i=0; i<$(selector).length; i++ ) {
      var elem = $($(selector)[i])
      if (elem.height() > max_height)
        elem.css('margin', center_margin)
    }

  })('#video_locker .category_select a p', 20, '16px 0')
}

/* Vote Integration */

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

var ratingSubmit = {};

function setupRatingSubmit(){
    // RatingSubmit object handle
    var pollHost = '';
                                   
    // for-beta-haml_home.2009-06-19_13-53.haml:
    // var pollHost = 'http://beta.polls.icarly.com';
    
    // for-production-haml_home.2009-06-17_13-26.haml:
    pollHost = 'http://polls.icarly.com';
    
    ratingSubmit = new RatingSubmit({submitURL:pollHost});
}
setupRatingSubmit();

function submitVote(assetId, rating) {
    ratingSubmit.submit(assetId,rating);
    // alert('This is only a test.\n Had this been real, you would have submitted this vote: \nassetId: '+assetId+', rating: '+rating);
}

function setAssetIdByVideoTitle(video_title) {
     video_title = escape(video_title)
     var id = videos_title_obj[video_title]
     if (document.getElementById('slider') && document.getElementById('slider').setId)
        document.getElementById('slider').setId(id)
     //update the url hash so people can bookmark any video
     //if ((typeof(id)!='undefined') && (getHash().indexOf(id) == -1)) {
     //   currVid.vid = id
     //   setHash()
     //}
}

// Utilities
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function doPlayerCheck() {
  //if (!window.ActiveXObject)
    setTimeout('playerCheck()', 6000)
}

function playerCheck() {
  if ($('object#player').length <= 0)
    setTimeout('playerCheck()', 200)
  else if (document.getElementById('player').selectVideo)
    return
  else  {
    loadingVid.reloadPlayer()
    setTimeout('playerCheck()', 10000)
  }
}

// Embed Video event
function embedthis() {
  var l_arr = ('' + document.location).split('/')
  var baseurl = l_arr[0] + '//' + l_arr[2] + '/embedVideo/index.html'
  var popupSetter = new EmbedPopupSetter(baseurl)
  if (currVid.vid != -1) 
    popupSetter.popup(currVid.vid)
  else 
    alert("Please select a video first")
}

// Update for new every new video
function setNewVideo(vidId) {
  //alert(vidId)
  if (vidId && (vidId != -1)) {
    currVid.vid = vidId
    if ( (document.getElementById('slider')) && (document.getElementById('slider').setId) )
      document.getElementById('slider').setId(vidId)
    //if (getHash().indexOf('vid') != -1)
      //setHash()
    if ((typeof comments === 'object') && (comments.set_new_comment))
      comments.set_new_comment('#comments .content', vidId, video_comment_url+vidId);
    //highlight active video in playlist
    $('#videos ul.videos_playlist a.active').removeClass('active')
    $('#videos ul.videos_playlist a[href^="javascript:pickVideo(' + vidId + '"]').addClass('active')
  }
}