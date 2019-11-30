var songs = {
  songs_path : "songs_yellow_box_list_table",
  is_set: false,
  init: function() {
    this.dictionary = window.ALL_SONGS || {}
    songs.is_set = true;
  }
}

var songs_mini_list = {
  songs_mini_list_path : "songs_blue_box_mini_list",
  is_set: false,
  init: function() {
    this.dictionary = window.ALL_SONGS || {}
    songs_mini_list.is_set = true;
  }
}

songs.draw_html = function(id, tbody) {
  if(!songs.dictionary[id].title && !songs.dictionary[id].artist){return;}
  tr = document.createElement('tr');
  tbody.appendChild(tr);
  var uri = songs.dictionary[id].file_path;
  if (typeof uri === 'string'){
    if (uri.indexOf('http') === -1) {
      uri = 'http://' + location.host.toString() + uri
    }
  }
  earphone = document.createElement('td');
  earphone.setAttribute("align", "center");
  earphone.setAttribute("width", 18);
  tr.appendChild(earphone);
  earphone.innerHTML = '<a id="songs_yellow_box_earphone" href="'+uri+'"></a>';
  title = document.createElement('td');
  title.setAttribute("align", "left");
  title.setAttribute("width", 325);
  tr.appendChild(title);
  title.innerHTML = '<a id="songs_link" href="'+uri+'">'+songs.dictionary[id].title+'</a>';
  play = document.createElement('td');
  play.setAttribute("align", "center");
  play.setAttribute("width", 35);
  tr.appendChild(play);
  play.innerHTML = '<a id="songs_yellow_box_button_play" href="'+uri+'"></a>';
  s_length = document.createElement('td');
  s_length.setAttribute("align", "center");
  s_length.setAttribute("width", 95);
  s_length.setAttribute("id", "songs_title");
  tr.appendChild(s_length);

var m = parseInt(parseFloat(songs.dictionary[id].length)/60).toString() + ":";
m+=(parseFloat(songs.dictionary[id].length) - parseInt(parseInt(parseFloat(songs.dictionary[id].length)/60)*60)).toFixed(0) < 10 ? "0"+(parseFloat(songs.dictionary[id].length) - parseInt(parseInt(parseFloat(songs.dictionary[id].length)/60)*60)).toFixed(0).toString() : (parseFloat(songs.dictionary[id].length) - parseInt(parseInt(parseFloat(songs.dictionary[id].length)/60)*60)).toFixed(0);
  s_length.innerHTML = m;
  artist = document.createElement('td');
  artist.setAttribute("align", "left");
  artist.setAttribute("width", "215");
  artist.setAttribute("id", "songs_title");
  tr.appendChild(artist);
  artist.innerHTML = songs.dictionary[id].artist;
}

songs_mini_list.draw_html = function(id) {
  if(!songs_mini_list.dictionary[id].title && !songs_mini_list.dictionary[id].artist){return "";}
  var uri = songs_mini_list.dictionary[id].file_path;
  if (typeof uri === 'string'){
    if (uri.indexOf('http') === -1) {
      uri = 'http://' + location.host.toString() + uri
    }
  }
  var html_str = '<a id="mini_list_link" href="'+uri+'"> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp '+songs_mini_list.dictionary[id].title+'</a>';
  return html_str;
}

  
songs.draw = function(){
  if(document.getElementById('songs_yellow_box_list_table').getElementsByTagName('tbody').length>0)
  {tbody = document.getElementById('songs_yellow_box_list_table').getElementsByTagName('tbody')[0];}
  else{tbody = document.createElement('tbody');}
  document.getElementById('songs_yellow_box_list_table').appendChild(tbody);
  for(var s in songs.dictionary){
   songs.draw_html(s, tbody);
  }
}

songs_mini_list.draw = function()  {
  var html_str = "";
  for(var s in songs_mini_list.dictionary){
    html_str += songs_mini_list.draw_html(s);
  }
  document.getElementById(songs_mini_list.songs_mini_list_path).innerHTML = html_str;
}

songs.setup = function() {
  if (!songs.is_set) {
    songs.init();
    setTimeout('songs.setup()', 200);
  } else {
    songs.draw();
    songs.initSort();
  }
}

songs_mini_list.setup = function() {
  if (!songs_mini_list.is_set) {
    songs_mini_list.init();
    setTimeout('songs_mini_list.setup()', 200);
  } else {
    songs_mini_list.draw();  
  }
}

songs.initSort = function() {
  /* for Mozilla/Opera9 */
  if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", sorttable.init, false);
  }
  
  /* for Safari */
  if (/WebKit/i.test(navigator.userAgent)) { // sniff
      sorttable._timer = setInterval(function() {
          if (/loaded|complete/.test(document.readyState)) {
              sorttable.init(); // call the onload handler
          }
      }, 10);
  }
  
  /* for other browsers */
  window.onload = sorttable.init;
}