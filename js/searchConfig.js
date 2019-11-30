/* Javascript Document
*   
*	Copyright 2009 Juicyorange, LLC
*	all rights reserved
*/

var searchHandler = {};

function setUpSearchHandler()
{
    // testing code
    // alert('hi I"m here');
    searchHandler = new SearchHandler({
        // local crowsnest
        // submitURL:'http://staticlocal/JO/icarly-webdir/search/jsonP.php',
        // beta
        // submitURL: http://beta.search.icarly.com/search
        submitURL: 'http://search.icarly.com/search',
        // submitURL: 'http://wrongserver.icarly.com/search',
        parDivHTMLID: 'results-content',
        blockHTMLClasses: {
            odd: 'result-block-odd-cont', 
            even: 'result-block-even-cont'
        },
        blockWrapperHTMLStart: {
            odd:'<div class="result-block-odd-top">&nbsp;</div><div class="result-block-odd-content">',
            even:'<div class="result-block-even-top">&nbsp;</div><div class="result-block-even-content">'
        },
        blockWrapperHTMLEnd: {
            odd: '</div><div class="result-block-odd-bottom">&nbsp;</div>',
            even: '</div><div class="result-block-even-bottom">&nbsp;</div>'
        },
        siteSearchURL: 'www.icarly.ga',
        itemHTMLClassName: 'search-results',
        searchInpName: 'q',
        searchFormName: 'search',
        searchBtnHTMLID: 'search-button',
        labelHTMLClassName: 'search-block-title',
        modalHTMLID: 'searchdiv'
    });
}