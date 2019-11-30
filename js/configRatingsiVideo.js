var videoSideSelectorRatings = {};

// to be called by jquery equivilent of window.onload function in
function setupiVideoRatings(){

    // define video ratings object
    videoSideSelectorRatings = new RatingsHandler({
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
    var parDiv = 'videos_playlist_container';
    videoSideSelectorRatings.defaultRatingsByParent(parDiv);
}