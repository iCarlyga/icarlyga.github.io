// song_player.js  - javascript music controller
// iPhone compatibility fix. 12/4/09

var music_core;                     // http://flowplayer.org/documentation/api/player.html
var song_remote;                    // flash remote reference. Main gui controller
var play_list = []                  // array storing song url, duration, title, ablum, artist
var current_index = 0;              // index of current song in play_list array
var progress_update_interval = 50;  // frequency of progress bar updates (milliseconds)
var coverflow;                      // a 3d gui for the music player.

//global functions
var update_progress = function () {
  //update isongs remote during playback
  if (music_core.isPlaying()) {  
    var seconds_played = music_core.getTime();
    var percent_complete = find_percent(seconds_played);
    song_remote.setTracking(percent_complete);
    //repeat every interval
    setTimeout("update_progress()", progress_update_interval); 
  }
}

var find_duration = function() {
    //return the duration of the current audio clip
    if (current_index < play_list.length)
      return play_list[current_index].duration;
    else
      return 300;
}

var find_percent = function (seconds) {
    //return a percentage based on seconds and current song duration
    var duration = find_duration();
    return 100 * seconds / duration;    
}

var find_seconds = function (percent) {
    //return a number of seconds based on a percentage and current song duration
    var duration = find_duration();
    return duration * percent / 100;    
}

var play_this_song = function(song_url) {
  //make music core play a song given its url
  //music_core.play(song_url);
  //reload the playlist, incase it has been updated
  for (var i=0; i<play_list.length; i++) {
    if ( song_url.indexOf (play_list[i].url) != -1 )
      current_index = i;    
  }
  music_core.setPlaylist(play_list);
  music_core.play(current_index);
}

var play_my_song = function() {
  //make a link to an mp3 file play in music core
  var uri = this.href
  if (this.href) {
    play_this_song(this.href);
    set_active_song( music_core.getClip().url );
  }
  return false
  //make this update current play_list, pass play_list back into music core, then current clip
}

var set_active_song = function(song_url) {  
  //set active row in html playlist
  var table_jpath = 'table#songs_yellow_box_list_table ';
  $(table_jpath + 'tr.active').removeClass('active');
  var song_links_jquery = $(table_jpath + 'tr td:first-child a');
  for (var i=0; i<song_links_jquery.length; i++) {
    if (song_links_jquery[i].href.indexOf( song_url ) !== -1) {
       $(table_jpath + 'tr').eq(i + 1).addClass('active');  
       active_index = i; 
    }
  }
  var mini_list_jpath = '#songs_blue_box_mini_list a';
  var mini_list_jquery = $(mini_list_jpath);
  $(mini_list_jpath + '.active').removeClass('active');
  for (var i=0; i<mini_list_jquery.length; i++) {
    if (mini_list_jquery[i].href.indexOf( song_url ) !== -1) {
      $(mini_list_jpath).eq(i).addClass('active');
    }
  }
}

var setSongLinks = function() {
  //don't change mp3 links on iphone
  if (typeof findOS === 'object') {
    findOS.init()
    if (findOS.name === 'iphone')
      return;
  } 
  //set onclick events for links on page
  var table_links_jquery = $('#songs_yellow_box_list a')
  for (var i=0; i<table_links_jquery.length; i++) {
    table_links_jquery[i].onclick = play_my_song;
  }
  table_links_jquery= $('#songs_blue_box_mini_list a');
  for (var i=0; i<table_links_jquery.length; i++) {
    table_links_jquery[i].onclick = play_my_song;
  }   
}

var load_coverflow_images = function() {
  //use coverflow.Load to load images, keep retrying if interface is not ready
  if (coverflow && coverflow.Load && play_list)
    coverflow.Load(play_list)
  else
    setTimeout('load_coverflow_images()', progress_update_interval);
}

//initilize with jquery's dom ready function
$(function () {
  //get song remote reference    
  song_remote = document.getElementById('song_remote');
  //create playlist
  for (var id in ALL_SONGS) {
    if (ALL_SONGS[id].file_path) {
      play_list.push( {
        url: ALL_SONGS[id].file_path, 
        duration: ALL_SONGS[id].length, 
        title: ALL_SONGS[id].title,
        artist: ALL_SONGS[id].artist,
        album: ALL_SONGS[id].album,
        album_image_url: ALL_SONGS[id].album_image_url,
        'id': id,
        autoPlay:true} )
    }
  }
  //for first clip, manually set autoplay
  play_list[0].autoPlay = false;
  //create flowplayer music_core
  music_core = flowplayer("music_core", "/flash/flowplayer-3.1.3.swf", {
    playlist: play_list,
    plugin: {
      audio: {
        url: '/flash/flowplayer.audio-3.1.2.swf'
      },
      controls: null
    },
    clip: {
      autoPlay: false,
      onPause: function () {
        song_remote.setIsPlaying(false)
      },
      onResume: function () {
        song_remote.setIsPlaying(true);
        setTimeout("update_progress()", progress_update_interval);
      },
      onBegin: function() {
        song_remote.setIsPlaying(true);
        setTimeout("update_progress()", progress_update_interval);
        current_index = music_core.getClip().index;
        set_active_song( music_core.getClip().url );
        if (coverflow.set_album)
            coverflow.set_album( play_list[current_index].album );
      },
      onStart: function() { 
        current_index = music_core.getClip().index;
        set_active_song( music_core.getClip().url );
        if (coverflow.set_album)
            coverflow.set_album( play_list[current_index].album );
      },
      onStop: function () {
        song_remote.setIsPlaying(false);
      },
      onError: function (errorCode, errorMessage) {
        alert("" + errorCode + ' : ' + errorMessage);
      }
    }
  });
  music_core.onLoad(function () {
    music_core.stop()
  });
  music_core.seekPercent = function(percent) {
    music_core.seek( find_seconds(percent) );
  }
  music_core.next = function() {
    var new_index = current_index + 1;
    if (new_index < play_list.length) {
      music_core.play(new_index);
      //set_active_song(new_index);
    }
  } 
  music_core.previous = function(new_index) {
    var new_index = current_index - 1;
    if (new_index >= 0) {
      music_core.play(new_index);
      //set_active_song(new_index);
    }
  }
  //setup coverflow
  coverflow = document.getElementById('coverflow');
  load_coverflow_images();
  //set page links
  setTimeout('setSongLinks()', 500);
})
/*
     FILE ARCHIVED ON 18:45:09 Aug 11, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:01:13 Oct 28, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 116.68 (4)
  load_resource: 23.304
  exclusion.robots.policy: 0.296
  RedisCDXSource: 11.368
  CDXLines.iter: 16.868 (3)
  esindex: 0.043
  LoadShardBlock: 112.574 (3)
  exclusion.robots: 0.317
  captures_list: 163.521
*/