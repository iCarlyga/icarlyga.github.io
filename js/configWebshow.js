// set the visibility to the channelvar ratingSubmit = {};

function setupRatingSubmit(){
    // RatingSubmit object handle
    var pollHost = '';
    
    // crowsnest local
    // var pollHost = 'http://crowsnest/JO/icarly-webdir/polls/test.ajax';
                                   
    // for-beta-haml_home.2009-06-19_13-53.haml:
    // pollHost = 'http://beta.polls.icarly.com';
    pollHost = 'http://polls.icarly.com';
    
    // for-production-haml_home.2009-06-17_13-26.haml:
    // pollHost = 'http://polls.icarly.com';
    
    ratingSubmit = new RatingSubmit({submitURL:pollHost});
}    
setupRatingSubmit();
  
function submitVote(assetId, rating) {
    ratingSubmit.submit(assetId,rating);
    // alert('This is only a test.\n Had this been real, you would have submitted this vote: \nassetId: '+assetId+', rating: '+rating);
}


function playWebshowClip(videoId) {
     window.scrollTo(0, 650);
     getPlayer().selectVideo(videoId);
}


var webshowRatings = {};

    // to be called by jquery equivilent of window.onload function in
function setupWebshowRatings(){

        // define video ratings object
    webshowRatings = new RatingsHandler({
        name : 'ivideo side selector ratings' ,
        starUrls_arr : {
            empty : '/assets/1/image/2009/06/22/66381_4277220058.gif',
            half : '/assets/1/image/2009/03/26/28945_3401305737.gif',
            full : '/assets/1/image/2009/03/26/28928_1600580155.gif'
        },
        contClass: 'videos_playlist_item_rating',
        contPrefix: 'ratingDiv',
        defaultData: POLLS_AND_RATINGS
    });
        // run update right away to show most recent values
        // in POLLS_AND_RATINGS OBJECT
    var parDiv = 'selector-clips';
    webshowRatings.defaultRatingsByParent(parDiv);
}
