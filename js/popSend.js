//popSend.js

var popSend = {
  asset_url: '',
  asset_type: '',
  asset_caption: '',
  
  popWindow: {},
  url: '/sendtofriend.html',
  name: 'SendToFriend',
  args: {
    'width': '460',
    'height': '480',
    'menubar':'no',
    'location':'hide',
    'toolbar':'no',
    'status':'no'
  }
}

popSend.set = function(location, kind, caption) {
  this.asset_url = location || this.asset_url
  this.asset_type = kind || this.asset_type
  this.asset_caption = caption || this.asset_caption
  this.makeWindow()
  // delay writing data to window until window exists in IE/Windows
  setTimeout("popSend.setAssetData()", 400)
}

popSend.makeWindow = function() {
  var specs = concatObject(this.args, '=', ',')
  this.popWindow = window.open(this.url, this.name, specs)
  popSend.popWindow.focus()
}

popSend.setAssetData = function () {
  popSend.popWindow.focus()
  popSend.popWindow.asset_url = popSend.asset_url || 'http://www.icarly/'
  popSend.popWindow.asset_type = popSend.asset_type || 'Test'
  popSend.popWindow.asset_caption = popSend.asset_caption  || 'No caption'
}

// Utils
function concatObject(obj, equals, splitter) {
  equals = equals || '='
  splitter = splitter || ','
  obj = obj || this
  var str = ''
  for (var id in obj) {
      str += id + equals + obj[id] + splitter
  }
  return str.substr(0, str.length-1)
}

// Public API
popSend.setVideo = function(vidId) {
  vidId = vidId || ((typeof(currVid)!='undefined') ? currVid.vid:false) || current_video || -1
  if (vidId == -1) {
    alert('Please select a video before sending it to a friend!')
    return
  }
  this.asset_type = 'Video'
  this.asset_url = '/iVideo/index.html#vid'+vidId
  if ((typeof(video_dictionary) != 'undefined') && video_dictionary[vidId]) {
    var vid_obj = video_dictionary[vidId]
    this.asset_caption = vid_obj.title
    if ((vid_obj.description) && (vid_obj.description.length > 0))
      this.asset_caption += ' - ' + vid_obj.description       
  }
  this.asset_id = vidId
  popSend.set()
}

popSend.setGame = function(gameId) {
  this.asset_type = 'Game'
  var loc = window.location.toString()
  gameId = gameId || loc.substr(loc.indexOf('game')+'game'.length).split('.')[0]
  this.asset_url = '/flash/' + location.toString().split('/flash/')[1]
  if ((typeof(ALL_GAMES) != 'undefined') && (ALL_GAMES[gameId])) {
    this.asset_caption = ALL_GAMES[gameId].caption
    if ((ALL_GAMES[gameId].description) && (ALL_GAMES[gameId].description.length > 0) &&
    (ALL_GAMES[gameId].caption != ALL_GAMES[gameId].description))
      this.asset_caption += '<br>' + ALL_GAMES[gameId].description
  } else
    this.asset_caption = ''
  this.asset_id = gameId
  popSend.set()
}