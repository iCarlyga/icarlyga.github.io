/* pollsHandler.js 
     * copyright Juicyorange, LLC 2009
     * all rights reserved
     */
    var pollHandler_obj = {};
    // testing code
    // alert('new here : )');

    // -> setup function that configures object onload |
    pollHandler_obj.setupPoll = function(args)
    {
        // testing code
        // alert('setting up');

        // ---- initialize variables {

        // -- setup function specific variables
        var containerChildren = null;
        var questionPrefix = null;
        var answerPrefix = null;
        var srch = null;
        var srchlen = null;
        var srchContent = null;
        var answerChildren = null;
        var ansRowChildren = null;
        // c count of poll questions/answers
        var c = 0;

        // -- object variables

        this.isError = false;
        this.errorMessages = [];

        // refs of all the polls
        this.pollRefs = [];

        // ref to answer rows
        this.answerRowRefs = [];

        this.submitHTMLID = args['submitHTMLID'];

        // explicitly set pollId to null
        this.pollId = null;

        this.submitStatus = null;

        // digest arguments to setup {
        
        // get the container div and create a reference to it
        if(args['containerHTMLID']){
            this.containerRef = document.getElementById(args['containerHTMLID']);
            // testing code;

            if(!this.containerRef){
                this.isError = true;
                this.errorMessages.push('container element not found');
            }else{
                // grab children to iterate over the rest of the elements needed
                // for the poll functionality
                containerChildren = this.containerRef.childNodes;
            }
             
        }

        // get the question div and create a reference to it
        // get the answer div and create a reference to it
        // also digest the id of the poll
        if(containerChildren != null){
            
            // get the answer div and create a reference to it
            // setup the initial variables
            if(args['question']['questionPrefix']){
                questionPrefix = args['question']['questionPrefix'];
                   
            }

            if(args['answer']['answerPrefix']){
                answerPrefix = args['answer']['answerPrefix'];
            }

            // loop through the children and grab the respective elements by thier prefixes
            for(var i=0; i < containerChildren.length; i++){
                // continue to hanlde if node is an element
                if(containerChildren[i].nodeType == 1){
                    // testing code
                    // alert(containerChildren[i].id);

                    srchContent = containerChildren[i].id;

                    // get the question div if the prefix matches
                    srch = questionPrefix;
                    srchlen = srch.length;
                    if(srchContent.substring(0,srchlen) == srch){
                        // grab the answer reference
                        this.questionRef = containerChildren[i];

                        // deduce as the htmlid after the prefix if it does not yet exist
                        if(this.pollId == null){
                            this.pollId = srchContent.substring(srchlen,srchContent.length);
                            // testing code
                            // alert('poll id set' + this.pollId);
                        }
                        // testing code
                        // alert('found question ' + srchContent);

                    }

                    // get the answer div and create a reference to it
                    srch = answerPrefix;
                    srchlen = srch.length;
                    if(srchContent.substring(0,srchlen) == srch){
                        // grab the answer reference
                        this.answerRef = containerChildren[i];

                        // deduce as the htmlid after the prefix if it does not yet exist
                        if(this.pollId == null){
                            this.pollId = srchContent.substring(srchlen,srchContent.length);
                            // testing code
                            // alert('poll id set' + this.pollId);
                        }
                        // testing code
                        // alert('found question ' + srchContent);

                        // get refs to rows used for sort
                        var answerRows_arr = this.answerRef.childNodes;
                        for(var i = 0; i < answerRows_arr.length; i++)
                        {
                            // nodeType 1 = HTMLElementNode as aposed to TextNode
                            if(answerRows_arr[i].nodeType == 1){
                                // testing code
                                // alert('found :' + answerRows_arr[i].className);
                                this.answerRowRefs.push(answerRows_arr[i]);
                            }
                        }

                    }
                }
            }
        }

        // get the formname ref
        if(args['question']['formNamePrefix']){
            this.formRef = document.forms[args['question']['formNamePrefix'] + this.pollId];
            if(!this.formRef){
                this.isError = true;
                this.errorMessages.push('form not found');
            }
        }

        // get the inputs ref  
        if(args['question']['inputHTMLID']){
            // handle if radio
             this.inputRefs = this.formRef[args['question']['inputHTMLID']];
             // alert('input refs: ' + this.inputRefs);
             
             // alert(this.inputRefs);
             this.inputType = this.inputRefs[0].type;
        }
        
        this.submit_ref = document.getElementById(this.submitHTMLID);
        this.submit_ref.onclick = function(){
            pollHandler_obj.submitVote();
        }

        this.submitURL = args['submitURL'];
        
        // }
        
        // testing code
        if(this.isError){
            var errMessages = '';
            for(var i = 0 ; i < this.errorMessages.length ; i++ ){
                errMessages += 'error: ' + this.errorMessages[i] + '\n';
            }
            // alert(errMessages);
        }

        // get the answer children to cycle through and make references to them
        // for later use by the functions
        if(args['answer']['labelClassName'] && args['answer']['barClassName']){
            answerChildren = this.answerRef.childNodes;
            
            // the index for the polls
            c = 0;

            // refs of all the polls
            this.pollRefs = [];

            for(var i = 0 ; i < answerChildren.length ; i++){
                // cycle through row children to find poll and label
                // proceed if node is an an element nodeType
                if(answerChildren[i].nodeType == 1){
                    // initialize branch of the pollRefs array
                    this.pollRefs[c] = [];

                    // loop through the rows child elements
                    ansRowChildren = answerChildren[i].childNodes;
                    for(var ii = 0 ; ii < ansRowChildren.length ; ii ++){

                        // if node is element nodeType proceed
                        if(ansRowChildren[ii].nodeType == 1){

                            // get the bar
                            if(ansRowChildren[ii].className == args['answer']['barClassName']){
                                // grab the inner element 
                                for(var iii = 0; iii < ansRowChildren[ii].childNodes.length; iii++){
                                    
                                    if(ansRowChildren[ii].childNodes[iii].nodeType == 1){
                                        this.pollRefs[c]['bar'] = ansRowChildren[ii].childNodes[iii];
                                    }
                                }
                                // testing code
                                // alert('bar found: ' + this.pollRefs[indexCount]['bar'] + ' for index: ' + indexCount);
                            }
                            // get the label
                            if(ansRowChildren[ii].className == args['answer']['labelClassName']){
                                this.pollRefs[c]['label'] = ansRowChildren[ii];
                                // this.pollRefs['1'] = [];//ansRowChildren[ii];
                                // this.pollRefs['1']['label'] = ansRowChildren[ii];
                                
                                // testing code
                                // alert('label found: ' + this.pollRefs[c]['label'] + ' for index: ' + c);
                            }
                            // testing code
                            // alert('index: ' + indexCount + ' element class ' + ansRowChildren[ii].className);
                            
                        }

                    }
                    // increment the index
                    c++;
                }
            }
        }

        // set the reference to the global data object
        if(args['dataRef']){
            this.dataRef = args['dataRef'];
        }

        // setup the polls to reflect information in the global object
        if(!this.isError){
            this.setOnLoad();
        }

        // testing code
        // alert('done setting up');

    }// end

    // function used to return the selected index
    // uses this.inputType argument to find the selected index
    // !!! dynamically detect input
    pollHandler_obj.getIndex = function()
    {
         // alert(this.inputType);
         // cycle through the radio buttons and return the value that is checked
         if(this.inputType == 'radio'){
            for(var i=0; i< this.inputRefs.length; i++){
                if(this.inputRefs[i].checked){
                    return this.inputRefs[i].value;
                }
            }
         }else if(this.inputType == 'checkbox'){
            var values = [];
            for(var i=0; i< this.inputRefs.length; i++){
                if(this.inputRefs[i].checked){
                    values.push(i);
                }
            }
            return values;
         }
    }

    // -> operator function that updates a poll set |
    pollHandler_obj.updatePoll = function(pollResults_arr)
    {
        // alert('updating');
        // testing code
        // alert('poll results are ' + pollResults_arr);
        
        // testing code
        // alert(this.pollRefs.length);
        // alert(this.pollRefs[0]['label']);
        
        
        // cycle through childNodes of poll bars parent 
        for(var i = 0 ; i < this.pollRefs.length ; i++){
            // set amount of each poll bar to percentage
            // testing code
            // alert(this.pollRefs[i]['label'] + ' ' + i);

            // check if the number of percentage items matches the number
            // if not add 0 entries for items that have not yet been
            // voted on, this is necessary becuase the server lazily
            // instantiates poll options so they will not be in the 
            // array if they are zero and after the highest existing
            // vote
            if(pollResults_arr[i] == null){
                 pollResults_arr[i] = 0;
            }
            
            this.pollRefs[i]['label'].innerHTML = String(pollResults_arr[i]) + '%';
            this.pollRefs[i]['bar'].style.width = String(pollResults_arr[i]) + '%';
        } 
        
        // alert('done updating');

        this.sortResults(this.getSortOrder(pollResults_arr));
    }
    
    // -> sort the poll results into highest first
    // run through the array backward append to the results to the parent div
    pollHandler_obj.sortResults = function(sortedIndex)
    {

        for(var i = 0 ; i < sortedIndex.length ; i++){
            // testing code
            // alert('adding node ' + sortedIndex[i]);
            this.answerRef.appendChild(this.answerRowRefs[sortedIndex[i]]);
        }

    }

    // numerical sort handler
    pollHandler_obj.sortNumber = function(a,b)
    {
        return a - b;
    }
    

    // -> sort the poll results into highest first
    // make index
    // sort results
    // run sorted against index to make ordered list of index positions
    pollHandler_obj.getSortOrder = function(pollResults_arr)
    {

        // testing code
        var new_array = [];
        for (var j=0; j < this.answerRowRefs.length; j++) {
          new_array[j] = pollResults_arr[j]}
        pollResults_arr = new_array;
        // alert('poll results arr ' + pollResults_arr);

        pollResults_arr = pollResults_arr.splice(0,this.answerRowRefs.length);
        
        var sortedPollResults_arr = [];
        for(var i = 0 ; i < pollResults_arr.length  ; i++ ){
            sortedPollResults_arr.push(pollResults_arr[i]);
        }
        
        sortedPollResults_arr.sort(this.sortNumber);
        sortedPollResults_arr.reverse();

        // testing code
        // alert('sorted poll results ' + sortedPollResults_arr);

        var indexOrder = [];        
        
        // loop through and get the indexes then remove then so
        // that nodes with the same percen map to the correct
        // node number
        for(var i = 0; i < sortedPollResults_arr.length ; i++)
        {
            for(var ii = 0 ; ii < pollResults_arr.length ; ii++)
            {
                if(pollResults_arr[ii] != null && ( pollResults_arr[ii] == sortedPollResults_arr[i]))
                {
                    indexOrder.push(ii);
                    pollResults_arr[ii] = null;
                }
            }
        }

        // testing code
        // alert(indexOrder);
       
        return indexOrder;
    }


    // -> controller function that updates the polls by calling the operator function |
    pollHandler_obj.setOnLoad = function()
    {
        // -> sets all from object loaded with page on load |
        if(this.dataRef['polls'][this.pollId]){
            this.updatePoll(this.dataRef['polls'][this.pollId]);
        }else{
            this.isError = true;
            this.errorMessages.push('data in native object not found');
        }
    }

    // -> submitter function that submits the poll and then calls the operator to update the polls and shows the poll |
    pollHandler_obj.submitVote = function(pollId)
    {
        var voteIndex = this.getIndex();
        
        // alert('voting for: ' + voteIndex);
        
        // define url
        // take absolute url into account
        // alert('submit host is: ' + this.submitHost);
        
        var url = this.submitURL;
        if(url == null || voteIndex == undefined){
            return;
        }

        // create url for poll id and vote index
        var value_str = '';
        if(this.inputType == 'radio'){
            value_str = voteIndex; 
        }else if(this.inputType == 'checkbox'){
            for(var i=0; i < voteIndex.length ; i++){
                if(value_str != ''){
                    value_str += '/';
                }
                value_str += voteIndex[i];
            }
        }
        
        url += '/poll/' + this.pollId + '/' + value_str;
        url += '?callback=?';
        // alert('submitting to: ' + url);
        $.getJSON(url,function(msg,statusText){
           if(typeof msg == 'object' ){
               this.submitStatus = true;
           }
           //alert('submit status: ' + this.submitStatus);
        });
        

        // hide question
        this.questionRef.style.display = 'none';
        
        // show answer
        this.answerRef.style.display = 'block';

        // hide submit button
        this.submit_ref.style.display = 'none';
    }