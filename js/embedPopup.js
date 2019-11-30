/* embedPopup.js */

function EmbedTagSetter(args){
        
    this.params = args;
    this.debugMessages = [];
    this.txtRef = document.getElementById(this.params.textareaHTMLID);
    this.txtLinkRef = document.getElementById(this.params.linktextareaHTMLID);
    this.btnRef = document.getElementById(this.params.buttonHTMLID);
    this.btn2Ref = document.getElementById(this.params.button2HTMLID);
    document.getElementById(this.params.closeButtonHTMLID).onclick = function(){window.close();}
    
    // 
    this.getVideoId = function()
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

    this.getGameId = function()
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
    
    this.parseUrl = function()
    {
        var url = String(window.location.href);
        // offset of 9 under the assumption that all hosts are http:// or https:// and atleast a two letter top level domain ending
        var endOfHost = url.indexOf('/',10);   
        if(endOfHost != -1)
           return url.substring(0,endOfHost);
        else
           return false;
    }
    
    this.setTextArea = function(videoId,url)
    {
        if(!videoId || videoId < 0) {
            this.txtRef.value = 'please select a video first'
            return false;
        }
        
        var url = url || this.parseUrl();
        url += this.params.path;
        url += '?id=' + videoId;
        var iframeTag = '';
        iframeTag += '<iframe src="' + url + '" width="' + this.params.height  +'" height="' + this.params.width + '" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"> </iframe>';        
        this.txtRef.value = iframeTag;
        if (!window.ActiveXObject)
          document.getElementById('clickImgA').style.backgroundPosition = 'right bottom'
    }    

    this.setTextAreaGame = function(videoId,url)
    {
        if(!videoId || videoId < 0) {
            this.txtRef.value = 'please select a game first'
            return false;
        }
        
        var url = url || this.parseUrl();
        //url += this.params.path;
        //url += '' + videoId + '_iframe.html';
          url += ALL_GAMES[videoId].iframe_url;
        var iframeTag = '';
        iframeTag += '<iframe src="' + url + '" width="' + this.params.height  +'" height="' + this.params.width + '" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"> </iframe>';        
        this.txtRef.value = iframeTag;
        if (!window.ActiveXObject)
          document.getElementById('clickImgA').style.backgroundPosition = 'right bottom'
    }
    
    this.setLink = function(videoId,url)
    {
        if(!videoId || videoId < 0) {
            this.txtLinkRef.value = 'please select a video first'
            return false;
        }
        
        var url = url || this.parseUrl();
        url += this.params.linkpath;
        url += '#vid' + videoId;
        var linkUrl = url;        
        this.txtLinkRef.value = linkUrl;
        if (!window.ActiveXObject)
          document.getElementById('clickImgA2').style.backgroundPosition = 'right bottom'
    }   

    this.setLinkGame = function(videoId,url)
    {
        if(!videoId || videoId < 0) {
            this.txtLinkRef.value = 'please select a game first'
            return false;
        }
        
        var url = url || this.parseUrl();
        //url += this.params.linkpath;
        //url += '' + videoId+'.html';
          url += ALL_GAMES[videoId].page_url;
        var linkUrl = url;        
        this.txtLinkRef.value = linkUrl;
        if (!window.ActiveXObject)
          document.getElementById('clickImgA2').style.backgroundPosition = 'right bottom'
    }

    this.setSelectCopy = function(input)
    {
                    
        input.focus();
        input.select();
        // make refrences objects area to attain
        
        // not firefox
        if(document.selection){
             sel = document.selection.createRange();
             sel.execCommand("Copy");
        }
        
    }


    // set up a closure for the textarea onclick event handler
    this.setupSelect = function()
    {

        var setSelectCopy= this.setSelectCopy;
        var input = this.txtRef;
        var input2 = this.txtLinkRef

        this.txtRef.onclick = function(){
            setSelectCopy(input);
        }
        this.btnRef.onclick = function(){
            setSelectCopy(input);
        }
        this.txtLinkRef.onclick = function(){
            setSelectCopy(input2);
        }
        this.btn2Ref.onclick = function(){
            setSelectCopy(input2);
        }
    }
    this.setupSelect(); 
}