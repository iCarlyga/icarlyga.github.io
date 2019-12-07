// :plain
    /* RatingsHandler.js 
     * copyright Juicyorange, LLC 2009
     * all rights reserved
     */

    // -> RatingsHandler(Object:params)   
    //   constructor and classname
    function RatingsHandler(params){
        
        // set arguments to a member named parms
        this.params = params;
        // testing code
        // alert('params are ' + this.params);
        
        // ---- generic operations ----
        // -> setRating(nodeRefecence:starRefs_arr,int:rating )
        //    given a collection of stars 
        //    and a rating decides what to tell setStar for each star
        this.setRating = function(starRefs_arr,rating)
        {
            // testing code
            // alert('starRefs: ' + starRefs_arr + ' value of' + rating);
            
            // anchor variables scoped to this function
            var starKind = null;
            var empty = 0;
            var half = 0;
            var full = 0;
            var starNum = 0;
            
            // map out the ratings to a per star value
            for(var i=0 ; i < starRefs_arr.length ; i++ )
            {
                
                // define numbers for stars to compare to ratings
                // set 1 base for clarity
                starNum = i + 1; 
                empty = (starNum * 2) - 2;
                half =  (starNum * 2) - 1;
                full =  (starNum * 2);

                // full star if rating number not yet reached
                if(rating >= full)       
                {
                    starKind = 'full';
                // half star if rating equals one below i
                }else if(rating == half){
                    
                    starKind = 'half';
                // else empty star
                }else{
                    starKind = 'empty';
                }
                
                // set the star
                // testing code
                //alert('set star ' + i + ' to ' + starKind);
                this.setStar(starRefs_arr[i],starKind);
            }
        }
        
        // -> setStar: set rating for individual star empty, half, or full.
        this.setStar = function(img,starKind)
        {
            img.src = this.params.starUrls_arr[starKind];
        }
        
        // -> getRatingImgsByCont(nodeReference:containerNode)
        //    returns nodeList of the star images 
        this.getRatingImgsByCont = function(id)
        {
             return $('#' + this.params.contPrefix + id + ' img').get();
        }
        
        // -> getRatingDivsByPar(string:parentHTMLID)
        //    returns nodeList of all ratings containers within the
        //    given element
        this.getRatingContsByPar = function(parentHTMLID)
        {
            // get all elements with the parent element
            return ratingsRefs_arr = $('#' + parentHTMLID + ' .' + this.params.contClass).get();
        }
        
        // -> getIdPostPrefix(nodeReference:node,string:prefix)
        //   returns the content after the prefix  
        this.getIdFromPrefix = function(node,prefix)
        {
            if(!node.id){
                return;
            }
            var search = prefix;
            var searchLen = search.length; 
            var id = -1;
            if(node.id.substring(0,searchLen) == search){
                id = node.id.substring(searchLen,node.id.length);
            }
            return id;
        }
        
        // ---- behaviours ----
        // -> defaultRatingsByParent(string:parHTMLIDPrefix) 
        //   given parent element, sets value of all ratings within that element
        //   to the value for each asset id in the default object
        //   calls set rating for all ratings within that element
        this.defaultRatingsByParent = function(parHTMLIDPrefix)
        {
            // get the list of ratings containers 
            var ratingsRefsList = this.getRatingContsByPar(parHTMLIDPrefix);
                   
            // anchor variables to local scope
            var curID = null;
            var curValue = null;
            // loop through the array of ratings divs 
            for(var i=0; i < ratingsRefsList.length ; i++ ){
                
                // get id from HTMLID portion not in the prefix for node
                curID = this.getIdFromPrefix(ratingsRefsList[i],this.params.contPrefix); 
                
                // get default from polls object
                curValue = this.params.defaultData['ratings'][curID];
                
                if(!curValue){
                    curValue = 0;
                    // alert('no rating found for asset using 0 ');
                }
                
                // set rating 
                // testing code
                // alert('setting ' + curID + ' to ' + curValue );
                starsRefs = this.getRatingImgsByCont(curID);
                this.setRating(starsRefs,curValue);
            }
        }
        
        // -> defaultSingleRating(int:assetID,int:ratingValue)
        //   set a single rating to it's default value in the data 
        //   object
        this.defaultSingleRating = function(id)
        {
           // get rating from defualt data object
           rating = '';
           var starRefs_arr = this.getRatingImgsByCont(id);
           this.setRating(starRefs_arr,rating);
        }
        
        // -> setSingleRating(int:assetID,int:ratingValue)
        //   given the asset id and specific value, calls set rating for 
        //   a single rating
        this.setSingleRating = function(id,rating)
        {
           var starRefs_arr = this.getRatingImgsByCont(id);
           this.setRating(starRefs_arr,rating);
        }
        

    };

    
