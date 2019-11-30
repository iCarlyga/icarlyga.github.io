/* popupForEmbed.js */

function EmbedPopupSetter(url){

    this.url = url;
    
    this._runpopup = function(url,opts,name){
        var name = name || '';
        // height,width,toolbar,location,menubar
        var optstr = null;
        for(var i in opts){
            (optstr) ?
                optstr += ',':
                optstr = '';
            optstr += i+'='+opts[i];
        }
        // alert(optstr);
        window.open(url,name,optstr);
      }
    
    this.popup = function(videoId)
    {
        var url = this.url; 
        url += '?id=' + videoId;
 
        var args = {
            'width':'450',
            'height':'420',
            'menubar':'no',
            'location':'hide',
            'toolbar':'no',
            'status':'no'
        }
    
        this._runpopup(url,args);
      
    }

    // popup funciton
    this.apply = function(linkRef,videoId,name){
        var name = name || '';

        var url = this.url; 
        url += '?id=' + videoId;

        var _runpopup = this._runpopup;

        linkRef.onclick = function(){
            
            var args = {
                'width':'450',
                'height':'366',
                'menubar':'no',
                'location':'hide',
                'toolbar':'no',
                'status':'no'
            }
    
            _runpopup(url,args,name);
            
            return false;
        }
    }
     
}