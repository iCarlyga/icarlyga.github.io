/* Javascript Document
*
*	searchHandler.js 
*	copyright Juicyorange, LLC
*	all rights reserved
*/
var searchDataObj = {
    isNew: false,
    data: {}
}

function setSearchData(data,instanceId)
{
    // testing code
    // alert('setting data for: '+ instanceId);
    searchDataObj[instanceId]['data'] = data;
    searchDataObj[instanceId]['isNew'] = true;
}

var searchHandlerInstances = new Array();

// ---- detect from get vars or hash ----
function _SetSearch()
{
    // alert("setter here");
    // defines the search from the query string
    // or the get string from the hash
    // define search object
    
    
    this['fromHash'] = function()
    {
        // getHash if starts with 'q='
        var hash = window.location.hash;
        var q = '';
        if(hash.substring(0,1) == '#')
        {
            hash = hash.substring(1,hash.length);
        }
        if(hash.substring(0,2) == 'q='){
            q = hash.substring(2,hash.length);
        }
        return q;
    }
    
    // getQString
    // get the value of q by parsing the substring
    // of the href and taking from teh first '?q='
    // or '&q=' to the next '&' after that point
    this['fromQString'] = function()
    {
        var url = String(window.location.href);
        var qPos = -1;
        var qstring = '';

        if(url.indexOf('?') == -1){
            return '';
        }
        
        qPos = url.indexOf('?q=');
        if(qPos == -1){
           qPos = url.indexOf('&q=');
        }
        
        if(qPos == -1 ){
            return '';
        }else{
            qPos += 3;
            qstring = url.substring(qPos,url.length);
        }
        
        if(qstring.indexOf('&') != (-1)){
            qstring = qstring.substring(0,qstring.indexOf('&'));
        }
        
        // get the index of the next and
        return qstring;
    }
    
    // setHash
    this['setHash'] = function(hash)
    {
        // e is resemblant of an empty hash
        if(hash == ''){
            hash = 'e'
        }
        window.location.hash = hash;
    }

    
    this['getSearchTerms'] = function()
    {
       // detectSearch
       // look for the search terms first in the hash
       // then in the qstring
       // return the string when one is found
       var terms = '';
       terms = this.fromHash();
       if(terms == ''){
           terms = this.fromQString();
       }       
       return terms;
    }
    
    this['detect'] = function()
    {
        return this.getSearchTerms();        
    }
    
    // parse search results if necessary
}
    
// ---- loading graphic  ----
// loading graphic  
   // show
   // hide

// ---- submit search string to server ----
function _HandleSearch(instanceId,submitURL,siteSearchURL)
{
    // submitSearch
    // alert("handler created");
    this['submitURL'] = submitURL;
    this['submitStatus'] = false;
    this['instanceId'] = instanceId;

    this['getResults'] = function(searchTerms)
    {
        clearTimeout(searchDataObj[this.instanceId].timer);

        url = this.submitURL;
        url += '?callback=?';
        url += '&d=' + siteSearchURL;
        url += '&q=' + escape(searchTerms);
        // testing code
        // alert('submitting search: ' + searchTerms + ' to: ' + url);
        $.ajax({
            'success': function(msg,statusText){
                 if(typeof msg == 'object' ){
                    this.submitStatus = true;
                    // testing code
                    // alert('submitted: ' + this.submitStatus + ' voting for asset: ' + assetId + ' with rating of: ' + rating );
                    // alert('information retrieved ' + msg);
                    
                    // instanceId works instead of this.instanceId - something to do with closure in javascript
                    setSearchData(msg,instanceId);
                 }
             },            
            'dataType': "json",
            'url': url
        });
    }
}

// populate results
// including timout that calls this funciton recursively
// until searchDataObj.data
// then cycle through results and populate data
function _PopulateResults(instanceId,contentInfo)
{
      // testing code
      // alert('populator called');
      this['instanceId'] = instanceId
      this['contentInfo'] = contentInfo
      this['timeoutCount'] = 0;
      this['resetCount'] = function()
      {
          this.timeoutCount = 0;
      }
      this['set'] = function()
      {
          
          // alert('set called');
          this.contentInfo.parDivRef.innerHTML = '';
          // dude
          if(!searchDataObj[this.instanceId].isNew){
              // testing code
              // alert('data not set setting timeout ' + this.timeoutCount);
              var maximum = 30;
              (this.timeoutCount < maximum) ?
                  searchDataObj[this.instanceId].timer = setTimeout('searchHandlerInstances[' + instanceId + '].populator.set()',500) :
                  this.searchBroken();              
              this.timeoutCount++;
          }else{
              searchDataObj[this.instanceId].isNew = false;                    
              // alert('populating data now' + searchDataObj.data.blogs);               

              var curSection = null;
              // alert('hi');

              var blockIsOdd = true;
              var contentKeyword = '';
              var itemContent = '';
              var blockTitle = '';
              for(var k in searchDataObj[this.instanceId].data){
                  curSection = searchDataObj[this.instanceId].data[k];

                  var showSection = curSection.length > 0;

                  if ({'pages':true,'categories':true,'channels':true}[k]){
                      showSection = false;
                  }

                  if(showSection)
                  {
                      var nextBlock = document.createElement('DIV');                      
                      var contentStr = '';
                      var evenOrOdd = '';
                      if(blockIsOdd){
                          evenOrOdd = 'odd'
                          blockIsOdd = false;
                      }else{
                          evenOrOdd = 'even';
                          blockIsOdd = true;
                      }
                      
                      switch(k){
                         case 'images':
                            blockTitle = 'iSnaps';
                            contentKeyword = 'caption';
                            break;
                         case 'videos':
                            blockTitle = 'iVideo';
                            contentKeyword = 'title';
                            break;
                         case 'blogs':
                            blockTitle = 'iBlogs';
                            contentKeyword = 'title';
                            break;
                         case 'songs':
                            blockTitle = 'iSongs';
                            contentKeyword = 'title';
                            break;
                         case 'games':
                            blockTitle = 'iPlay';
                            contentKeyword = 'title';
                            break;
                         case 'channels': 
                            blockTitle = 'Channels';
                            contentKeyword = 'title';
                            break;
                         case 'categories':
                            blockTitle = 'Categories';
                            contentKeyword = 'caption';
                            break;
                         case 'pages':
                            blockTitle = 'Pages';
                            contentKeyword = 'name';
                            break;
                         default:
                            blockTitle = k;
                            contentKeyword = 'title';
                            break;
                      }

                      nextBlock.className = this.contentInfo.blockHTMLClasses[evenOrOdd];                                            

                      contentStr += this.contentInfo.blockWrapperHTMLStart[evenOrOdd];

                      contentStr += '<span class="' + this.contentInfo.labelClassName + '">' + blockTitle + '</span>';

                      // make new contents
                      contentStr += '<ul class="' + this.contentInfo.itemClassName  + '">';
                      for(i=0; i < curSection.length ; i++){
                          var sectionItems = curSection[i];
                          // testing code
                          // alert('sectionItems: ' + i +' ' + sectionItems);
                          
                          contentStr += '<li>';
                          contentStr += '<a href="' + sectionItems.url + '">' + sectionItems[contentKeyword] + '</a>';
                          contentStr += '</li>';

                          for(var kii in sectionItems){
                              // tester code
                              //alert('section ' + kii + '  ' + sectionItems[kii]);
                          }
                          // assemble

                      }
                      contentStr += '</ul>';
                      
                      contentStr += this.contentInfo.blockWrapperHTMLEnd[evenOrOdd];
                      
                      // alert('inner content: ' + contentStr);
                      // swap innter html
                      nextBlock.innerHTML = contentStr;
                      // alert('parDif: ' + parDiv);
                                               
                      this.contentInfo.parDivRef.appendChild(nextBlock);
                      // testing code
                      // alert('section found: ' + k); 
                      
                  }
              }
          }
      }

      this['searchBroken'] = function()
      {
          // alert('search model broken' + this.contentInfo.modalHTMLID);
          if(this.contentInfo.modalHTMLID)
             $('#' + this.contentInfo.modalHTMLID).jqmShow();          
      }
}

// ---- public object and setup ----
function SearchHandler(args)
{
    // testing code
    // alert('setting up');
    this.instanceId = Number(searchHandlerInstances.length);
    searchHandlerInstances.push(this);
    // alert('istance id is : ' + this.instanceId);

    // alert('instance: ' + searchHandlerInstances[this.instanceId]);
    
    // set testing
    // alert("hi ho hi ho it's off to work I go")
    this['handler'] = {};
    this['setSearch'] = {};  
    this['populator'] = {};
    this['contentInfo'] = {};
    this['contentInfo']['parDivRef'] = document.getElementById(args.parDivHTMLID);
    this['contentInfo']['blockHTMLClasses'] = args.blockHTMLClasses;
    this['contentInfo']['labelClassName'] = args.labelHTMLClassName;
    this['contentInfo']['itemClassName'] = args.itemHTMLClassName;
    this['contentInfo']['blockWrapperHTMLStart'] = args.blockWrapperHTMLStart;
    this['contentInfo']['blockWrapperHTMLEnd'] = args.blockWrapperHTMLEnd;
    this['contentInfo']['modalHTMLID'] = args.modalHTMLID;
    this['siteSearchURL'] = args.siteSearchURL;     

    // alert(this.parDivRef);
    // alert('even' + this.contentInfo.blockClassEven);
    
    this['q'];
    
    // setup
    // digest arguments

    this['searchInpRef'] = document.forms[args.searchFormName][args.searchInpName]; 
    var searchBtn = document.getElementById(args.searchBtnHTMLID);
    searchBtn.instanceId = this.instanceId;

    searchBtn.onclick = function(){
        searchHandlerInstances[this.instanceId].update();
    }
  
    this.handler = new _HandleSearch(this.instanceId,args.submitURL,this.siteSearchURL);
    this.searchStrObj = new _SetSearch();
    this.populator = new _PopulateResults(
       this.instanceId,
       this.contentInfo
    );
    searchDataObj[this.instanceId] = {isNew:false, data: {},timer:null};
    
    // trigger search detect
    // trigger submit if search not empty
    
    // testing code      
    
    
    this['submitAndLoad'] = function()
    {
        this.handler.getResults(this.q);
        this.set();
    }

    this['update'] = function()
    {
        str = this.searchInpRef.value;
        // alert('setting search terms to ' + str);
        this.searchStrObj.setHash(str);
        this.q = str;
        this.submitAndLoad();
    }
    
    this['updateInput'] = function(){
        this.searchInpRef.value = this.q;       
    }

    this['set'] = function()
    {
        // alert('set called');
        this.populator.resetCount();        
        this.populator.set();
    }
    
    this.q = this.searchStrObj.detect();
    this.updateInput();
    this.submitAndLoad();                 
}