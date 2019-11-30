// accepts a csv string of video ids
// splits string by , into videIdsArr array
// grabs ratings for each video in videoIdsArr
// if not found uses 0
// concatenates videoIdsArr and ratings into ratingsCSV string
// formatted as id:rating,id:rating,id:rating...
// -> looks in ALLVIDEOS_AND_RATINGS object and
function ratingsToAS(idCSV){

    // testing         
    // alert(idCSV);

    var ids_arr = idCSV.split(',');

    var ratings_str = '';

    for(var i = 0 ; i < ids_arr.length ; i++)
    {
        if(POLLS_AND_RATINGS.ratings[ids_arr[i]] != undefined)
        {
            if(ratings_str != '')
            {
                ratings_str += ',';
            }
            ratings_str += ids_arr[i] + ':' + POLLS_AND_RATINGS.ratings[ids_arr[i]];
        }
    }

    // testing code
    // alert(ratings_str);
    return ratings_str;
};




function returnRatingsToAS(idCSV)
{
    // testing code
    // alert(ratingsToAS(idCSV));
    return ratingsToAS(idCSV);

}