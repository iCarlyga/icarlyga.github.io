// MakeIcarlyVideo.js
// made player scale to smaller iframe sizes. 12/9/09

(function(){

    if(!window.JO)
        window['JO'] = {};

    function getVideoId()
    {
        // get id from get string
        var url = String(window.location.href);
        // alert('url is' + url);
        var idPos = 0;
        if(idPos = url.indexOf('?id=')){
            var end = url.length;
            var nextAmp = url.indexOf('&',idPos);
            if(nextAmp != -1)
                end = nextAmp;

            var id = url.substring(
                idPos + 4,
                end
            );

            if((id = parseInt(id)) != 'NaN')
                return id;
            else
                return false;
        }else{
            return false;
        }
    }
    window.JO['getVideoId'] = getVideoId;

    function MakeIcarlyVideo()
    {

        // grab video id from in page javascript
        var videoId = window.JO.getVideoId();
       
        // make icarly video object
        var vid_dictionary = getVideoDictionary()
        //alert('making object tag here for video ' + videoId);
        var videoxml = vid_dictionary[videoId].videoxml
        // replace category in url with 'embed'
        var cat = parseInt(videoxml.split('ategory')[1].split('_')[0], 10)
        videoxml = escape( videoxml.replace('category' + cat, 'embed') )
        var loadingWord = escape(document.getElementById('loadingWord').src)
        var fullScreen = escape(document.getElementById('fullscreen').src)
        var flashVars = {'autoPlayById':videoId, 'playerConfig':videoxml, 'playerKind':'single', 'fullScreen':fullScreen, 'loadingWord':loadingWord}
        
        var playerUrl = '/flash/fusion_player18.swf'
        
        var player_width = 504;
        var player_height = 330;
        var iframe_width = 520;
        var div_width = 500;
        var client_width = document.body.clientWidth;
        
        if (client_width && (client_width < iframe_width) ) {
          var scale_ratio = client_width / iframe_width;
          player_width *= scale_ratio;
          player_height *= scale_ratio;

          divs = document.getElementsByTagName('div')
          for (var i=0; i < divs.length; i++) {
            divs[i].style.width = div_width * scale_ratio  + 'px'
          }
        }
        
        swfobject.embedSWF(playerUrl, 'player_container', player_width,  player_height, "9.0.0", '', flashVars, {'allowFullScreen':'true'})  
              
    }
    window.JO['MakeIcarlyVideo'] = MakeIcarlyVideo;

    function getVideoDictionary() 
    {
        var video_dictionary = {}
        var vid_obj
          var chan_obj = ALL_CHANNELS
          for (var chans in chan_obj)
            for (var cats in chan_obj[chans].categories) {
              for (var vids in chan_obj[chans].categories[cats].videos) {
                vid_obj = chan_obj[chans].categories[cats].videos[vids] 
                vid_obj.videoxml = chan_obj[chans].categories[cats].videoxml
                vid_obj.channel = chans
                vid_obj.category = cats
                video_dictionary[vids] = vid_obj
              }
            }   
        return video_dictionary
    }
})();