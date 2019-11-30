    /* ratingSubmit.js 
     * copyright Juicyorange, LLC 2009
     * all rights reserved
     */
    
    RatingSubmit = function(args){

        this.submitURL = args.submitURL;
        
        this.submit = function(assetId,rating)
        {
            
            var url = this.submitURL;
            if(url == null || assetId == null || rating == null){
                return false;
            }
    
            url += '/rate/' + assetId + '/' + rating;
            url += '?callback=?';
            // testing code
            // alert('voting for asset: ' + assetId + ' with rating of: ' + rating + '\n' + 'submitting to:' + url);
            $.getJSON(url,function(msg,statusText){
               if(typeof msg == 'object' ){
                   this.submitStatus = true;
                   // testing code
                   // alert('submitted: ' + this.submitStatus + ' voting for asset: ' + assetId + ' with rating of: ' + rating );
               }
            });
        }
    }

    // var pollHost = '';    
    //local 
    // var pollHost = 'http://crowsnest/JO/icarly-webdir/polls/test.ajax';
    // for-beta-haml_home.2009-06-19_13-53.haml:
    // var pollHost = 'http://beta.polls.icarly.com';
    // for-production-haml_home.2009-06-17_13-26.haml:
    // submitURL : 'http://polls.icarly.com'

    // var ratingSubmit = new RatingSubmit({submitURL:pollHost});
    