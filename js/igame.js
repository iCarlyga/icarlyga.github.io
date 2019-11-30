// Embed Game event
function embedthis() {
  var l_arr = ('' + document.location).split('/')
  var baseurl = l_arr[0] + '//' + l_arr[2] + '/embedGame/index.html'
  gameId = parseInt(location.toString().split('game')[1], 10)
  var popupSetter = new EmbedPopupSetter(baseurl)
  //if (currVid.vid != -1) 
    popupSetter.popup(gameId)
}