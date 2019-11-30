// feedback.js
// added context_poll object. 12/4/09 -GV
// added fallback if login is not on page. 10/19/09 -GV
// made script dynamically select beta or prod servers. 10/8/09 -GV
// added comments. 10/8/09 -GV
// copyright Juicyorange, LLC 2009    
  var feedback = {
      //server urls
      textus_server: 'http://ugc.icarly.com/feedback/submit',
      askquestion_server: 'http://ugc.icarly.com/you_asked_us/submit', 
      comments_server: 'http://cms.icarly.com/comment/submit',
      beta_textus_server: 'http://beta.ugc.icarly.com/feedback/submit',
      beta_askquestion_server: 'http://beta.ugc.icarly.com/you_asked_us/submit', 
      beta_comments_server: 'http://beta.cms.icarly.com/comment/submit',
      poll_server: 'http://polls.icarly.com',
      beta_poll_server: 'http://beta.polls.icarly.com',
      //text for humans
      was_sent: 'your message has been sent to iCarly.com',
      error_login: 'please log in to send a message',
      error_comment: 'please write something before sending it',
      keyboard_warning: 'No need to click the numbers, just type in the window above.',
      server_error: 'sorry, the server is not responding. Try again in a couple hours.',
      too_long_warning: 'your message is way too long. You have to end it somewhere around',
      char_limit: 500,
      //dom references
      content_ref: 'div#comments_modal',
      ask_ref: 'div#askquestion',
      textus_ref: 'div#textus',
      comments_ref: 'div#comments_modal',
      text_ref: ' textarea',
      form_ref: ' form',
      error_title: '',

      init: function () {
        //this function is called in document.onload()
        if ($(feedback.ask_ref).length > 0)
          feedback.init_askquestion()
        else if ($(feedback.textus_ref).length > 0)
          feedback.init_textus()
        if ($(feedback.comments_ref).length > 0)
          feedback.init_comments()    
      }
    }    
  var comments = {
    modal_jpath: '#comments_modal',
    content_jpath: '#comments div.content',
    thankyou_jpath: '#comments .thankyou',
    thanks_modal: '#comments_thanks_modal',
    animation: 'fast',
    thankyou_delay: 8, //show thanks for this many seconds
    is_set: false,
    show: function() {
      if (!comments.is_set) 
        comments.init()        
      $(comments.modal_jpath + comments.contents_jpath).show();
      feedback.hide_response();
      $(comments.modal_jpath).fadeIn(comments.animation)
      },
    hide: function() {
      $(comments.modal_jpath).fadeOut(comments.animation, function() {
        feedback.hide_response(); 
        })
      },
    init: function() {
      comments.set_events()
      this.dictionary = window.ALL_PHOTO_COMMENTS || window.ALL_VIDEO_COMMENTS || window.ALL_BLOG_COMMENTS || {}
      if ((window.get_get && get_get().comment) || (location.href.indexOf('#sent') !== -1)) {
        comments.show_sent();
        }
      feedback.init_form();

      comments.is_set = true
      } 
    }

    comments.setup = function(about_type, first_id, container_jpath) {
      comments.about_type = about_type;
      comments.first_id = first_id;
      comments.container_jpath = container_jpath;
      if (!comments.is_set) {
        setTimeout('comments.setup(comments.about_type, comments.first_id, comments.container_jpath)', 200)
      } else {
        feedback.init_form();
        feedback.form.about_type.value = comments.about_type;
        comments.set_new_comment (comments.container_jpath, comments.first_id);  
      }
    }
    
    comments.show_sent = function() {
      if (comments.is_set && feedback.form) {
        $(comments.thanks_modal).show();
        setTimeout( "$(comments.thanks_modal).fadeOut();", comments.thankyou_delay * 1000)
      } else
        setTimeout ( "comments.show_sent()", 200);
    }
     
    comments.get = function(id) {
        
      if (!comments.is_set) 
        comments.init()
      var comments_array = comments.dictionary[id];
      if (typeof comments_array === 'object')
        return comments_array
      else
        return []
    }
    
      // BEGIN CONTEXT POLLS       
      var context_poll = {   
        // manage polls for blogs, photos, galleries, and videos
        dictionary: window.ALL_CONTEXTUAL_POLLS ? ALL_CONTEXTUAL_POLLS : {},
        results: window.POLLS_AND_RATINGS ? POLLS_AND_RATINGS.polls : {},
        class_name: 'poll',
        id_prefix: 'comment',
        container_id: 'comments',
        about_type: 'unknown type',
        form_prefix: 'asset_poll_form_',
        choices: [],
        gallery_flag: false
      } 
      
      context_poll.set = function(about_type, about_id) {
        //check for gallery poll
        if (window.currentGalleryInfo) {
          if ( context_poll.dictionary.galleries && context_poll.dictionary.galleries[currentGalleryInfo.category] ) {
            about_type = 'galleries';
            about_id = currentGalleryInfo.category;
            context_poll.gallery_flag = true;
          }
        }
        // set about_type based on comment about_type
        switch (about_type) {
          case 'BlogEntry': about_type = 'blogs'; break;
          case 'Image': about_type = 'images'; break;
          case 'Video': about_type = 'videos'; break;
          case 'galleries': break;
          default: about_type = context_poll.about_type;
        }
        //set context_poll object properties
        context_poll.about_type = about_type;
        context_poll.about_id = about_id;
        context_poll.get_data();
        if (context_poll.data ) {
          context_poll.question = context_poll.data.question;
          // create choices array
          var votes;
          var results_obj;
          var id_index;
          var i=0;
          for (var id in context_poll.data.choices) {
            // figure out the vote results for this choice id
            results_obj = context_poll.results [context_poll.data.id]
            if (results_obj) {
              if (!results_obj.choice_ids) {
                votes = results_obj[i];
              } else {
                votes = 0;
                for (id_index=0; id_index < results_obj.choice_ids.length; id_index++) {
                  if (id.toString() == results_obj.choice_ids [id_index].toString())
                    votes = results_obj[id_index]
                }
              }
            } else votes = 0;
            
            // push choices data to to choices array
            context_poll.choices.push({
              'id': id,
              'value': context_poll.data.choices[id],
              'votes': votes
            })
            i++;
          }
          context_poll.choices = context_poll.choices.sort( context_poll.sort_by_id )
        }
      } 
      
      context_poll.get_data = function() {
        //load poll data from dictionary
        context_poll.data = context_poll.dictionary[ context_poll.about_type] 
        if (context_poll.data) {
          context_poll.data = context_poll.data[ context_poll.about_id]
          if (context_poll.data) {
            return context_poll.data;
          }
        } 
        return context_poll.data = false;
      }
      
      context_poll.draw_html = function() {
        //generate html for a poll
        var html_str = context_poll.gallery_flag ?
            '<div class="poll" id="gallery_poll' + context_poll.about_id + '">':
            '<div class="poll" id="comment' + context_poll.about_id + '">';
        var image_src = ''
        var type = context_poll.data.multiple_choice ? 'checkbox' : 'radio';
        html_str += '<div class="header"> <div>' + context_poll.data.question + '</div> </div>'; 
        //draw answer choices. If there are no answers, log the bug.
        if (context_poll.choices.length < 1) {
          context_poll.bug = 'no choices for poll ' + context_poll.data.id;
          alert(context_poll.bug)
        } else {
          html_str += '<div class="choices"> <form>';
          for (var i=0; i<context_poll.choices.length; i++) {
            html_str += '<div> <em class="number' + (i+1) + '">' + (i+1) + '</em>'; 
            html_str += '<p> <input type="' + type + '" name="radio_vote" value="' + 
                context_poll.choices[i].id + '"></input>';
            html_str += context_poll.choices[i].value + '</p></div>';
          }
          html_str += '</form> <div class="submit"> <a href="javascript:context_poll.send()"> ';
          html_str += 'submit </a></div> </div> \n';
        }
        //draw results
        
        html_str += '<div class="results"> ';   
        var choices = context_poll.choices.sort( context_poll.sort_by_votes); 
        //context_poll.choices = choices;
        
        for (i=0; i<choices.length; i++) {
          votes = choices[i].votes;
          percent = votes
          html_str += '<div> <div class="percent">' + percent + '%</div>';
          html_str += '<div class="graph" style="width:' + percent + 'px; margin-right:' + (102-percent) + 'px">&nbsp;</div>';
          html_str += '<div class="name">' + choices[i].value + '</div> </div>';
        }
        html_str += '</div>';
        if (!context_poll.results[context_poll.data.id]) {
          context_poll.bug = 'no poll results for ' + context_poll.about_id;
        }     
        return html_str + '</div>';
      }
      
      context_poll.sort_by_votes = function(a, b) {
        return b.votes - a.votes; 
      }
      context_poll.sort_by_id = function(a, b) {
        return a.id - b.id; 
      }
    
      context_poll.set_poll_display = function() {
        //add classes to turn comment display into poll display
        $('#' + context_poll.container_id).addClass(context_poll.class_name);
        $('#' + context_poll.container_id + ' > h2 ').hide();
      }
      
      context_poll.set_poll_display_off = function() {
        //remove classes to turn display back to comments
        $('#' + context_poll.container_id).removeClass(context_poll.class_name);
        $('#' + context_poll.container_id + ' > h2 ').show();
      }
      
      context_poll.send = function() {
        if (context_poll.validate()) {
          //show poll results
          $('#' + context_poll.id_prefix + context_poll.about_id + ' .choices').hide();
          $('#' + context_poll.id_prefix + context_poll.about_id + ' .results').show();  
          //submit poll with getJSON
          context_poll.server = (window.find_if_beta && find_if_beta())? 
                feedback.beta_poll_server: 
                feedback.poll_server;
          var url = context_poll.server;
          var inputs_jquery = $('#' + context_poll.id_prefix + context_poll.about_id + ' input');
          var vote_str = '';
          for (var i=0; i<inputs_jquery.length; i++) {
            if (inputs_jquery[i].checked)
              vote_str += '/id' + inputs_jquery[i].value
          }
          url += '/poll/' + context_poll.data.id + vote_str;
          url += '?callback=?';
          context_poll.url = url;
          $.getJSON(url,function(msg,statusText){
             if(typeof msg === 'object' ){
               context_poll.submitted = true;
             }
          });     
        } else {
          //alert ('please pick something before submitting poll')
        }
      }
      
      context_poll.validate = function() {
        inputs_jquery = $('#' + context_poll.id_prefix + context_poll.about_id + ' input')
        for (var i=0; i<inputs_jquery.length; i++) {
          if (inputs_jquery[i].checked)
            return true
        }
        return false
      }
      
      // END MAIN CONTEXT POLLS METHODS
            
    comments.set_new_comment = function(container_jpath, comments_id, uri)  {
      //if (typeof parseInt(comments_id) === 'number') {
      comments.current_id = parseInt(comments_id, 10)
      comments.container_jpath = container_jpath
      feedback.hide_response();
      feedback.init_form();
      if (feedback.form && feedback.form.about_id)
        feedback.form.about_id.value = comments_id;
      var com_array = comments.get(comments_id)
      if (!comments.about_type) {
        if (window.gallery) comments.about_type = 'Image';
        else if (window.videoPageInit) comments.about_type = 'Video';
      }      
      context_poll.set(comments.about_type, comments_id);
      //handle gallery poll
      if (context_poll.gallery_flag) {
        if ( $('#gallery_poll' + context_poll.about_id).length < 1) {
          $(container_jpath + ' > div').hide()
          $(container_jpath + ' > img').hide()
          $(container_jpath).append("<p id='temp'></p>");
          $('#temp').replaceWith( context_poll.draw_html() );
          context_poll.set_poll_display();
          context_poll.id_prefix = '#gallery_poll'
        } 
        return; 
      }
      //hide all comment divs before displaying new ones
      $(container_jpath + ' > div').hide()
      if ((com_array.length < 1) && (!context_poll.data) ) {
        //show image if there are no comments
        context_poll.set_poll_display_off()
        $(container_jpath + ' > img').hide().eq(0).show()
      } else {
        //draw new comments, or display if already on page
        $(container_jpath + ' > img').hide()
        $(container_jpath + ' > div').hide()
        if ($('#comment'+comments_id).length > 0)
          $('#comment'+comments_id).show()
        else {
          $(container_jpath).append("<p id='temp'></p>")
          if (context_poll.data) {
            $('#temp').replaceWith( context_poll.draw_html() )
          } else {
            $('#temp').replaceWith(comments.draw_html(comments_id, com_array))
          }
          $('#comment'+comments_id).hide().fadeIn('fast');
        }
        if ($('#comment'+comments_id+'.'+context_poll.class_name).length > 0)
          context_poll.set_poll_display()
        else
          context_poll.set_poll_display_off()
        
      }
      if ((typeof uri === 'string') && (typeof feedback === 'object') && feedback.form){
        if (uri.indexOf('http') === -1) {
          uri = 'http://' + location.host.toString() + uri
        }
        makeField(feedback.form, 'url', uri)
      }
      // create comments.onchage event
      if (typeof comments.onchange === 'function')
        comments.onchange()
    }
    
    comments.draw_html = function(id) {
      var html_str = '<div id="comment' + id + '" class="comment">';
      var com_array = comments.get(id).sort(random_order)
      for (var i=0; i<com_array.length; i++) {
        var com_obj = com_array[i];
        window.random_pastel_rgb ? 
          html_str += '<p style="background-color:' + random_pastel_rgb() + '">': 
          html_str += '<p>';        
          html_str += '<strong>' + com_obj.member + ':' + '</strong> ' +
            com_obj.comment + '</p>' + '\n\n'
      }
      html_str += '</div>'
      return html_str
    }
    
    comments.set_events = function() {
      $(comments.modal_jpath + ' .close a')[0].onclick = function() {
        comments.hide(); 
        return false
        };
      $(comments.modal_jpath + ' .cancel a')[0].onclick = function() {
        comments.hide(); 
        return false
        };
      $(comments.modal_jpath + feedback.text_ref)[0].onfocus = function() {
        this.select()
        }
        
      var textarea_jquery = $(comments.modal_jpath + ' textarea')
      textarea_jquery.click(function() {
        var textarea_value = $(comments.modal_jpath + ' textarea')[0].value;
        if (textarea_value === feedback.first_value)
          $(comments.modal_jpath + ' textarea')[0].value = ''
        })
      textarea_jquery[0].onblur = function() {
        if (this.value.length === 0)
          this.value = feedback.first_value
        }
      }
  
  feedback.set_server = function(uri) {
    feedback.server = uri;
    feedback.init_form();
    setTimeout("feedback.form.setAttribute('action', feedback.server)", 200)
    
  }     
    
  feedback.init_comments = function () {
        feedback.init_form()
        comments.init()   
        feedback.content_ref = feedback.comments_ref
        feedback.textarea = $(feedback.comments_ref + feedback.text_ref)[0]     
        setTimeout('feedback.first_value = feedback.textarea.value', 200)
        if (find_if_beta && find_if_beta())
          feedback.set_server(feedback.beta_comments_server)
        else feedback.set_server(feedback.comments_server)
        testServer(feedback.server)  
        // control form action
        $(feedback.content_ref + ' .submit button').click(function() { 
          feedback.send()
          return false
          })
        }
      
  feedback.init_textus = function () {
        feedback.content_ref = feedback.textus_ref
        feedback.textarea = $(feedback.content_ref + feedback.text_ref)[0]
        setTimeout('feedback.first_value = feedback.textarea.value', 200)
        if (find_if_beta && find_if_beta())
          feedback.set_server(feedback.beta_textus_server)
        else feedback.set_server(feedback.textus_server)
        testServer(feedback.server)   
        if (window.getHash && (getHash() === '#sent')) {
          feedback.respond( feedback.was_sent )
        }
        $('#keypad').click(function () {
          alert(feedback.keyboard_warning)
          feedback.textarea.focus()
        })
        var textarea_prompt = $('.textarea_prompt').attr('data-prompt');
        $('.textarea_prompt').append(textarea_prompt);
        if ( $('.textarea_prompt').length ) {
          $('.textarea_prompt').focus(function() {
            if (this.value == textarea_prompt) {
              this.value = '';
            }
          });
          $('.textarea_prompt').blur(function() {
            if (this.value == '') {
              this.value = textarea_prompt;
            }
          });
        }
        $('#textus .clear_button a').click(function() { 
          feedback.textarea.value = ''
          feedback.textarea.focus()
          feedback.hide_response()
          return false
        })
        $('#textus .send_button a').click(function() { 
          feedback.send()
          return false
        })
      }
  feedback.init_askquestion = function () {
        feedback.content_ref = feedback.ask_ref
        feedback.textarea = $(feedback.content_ref + feedback.text_ref)[0]
        if (find_if_beta && find_if_beta())
          feedback.set_server(feedback.beta_askquestion_server)
        else feedback.set_server(feedback.askquestion_server)
        testServer(feedback.server)   
        if (window.getHash && (getHash() === '#sent')) {
          $('#question_popup').addClass('submitted').show();
        }
        // setup button actions
        $('.month_nav li:odd').addClass('odd');
        
    	  $(feedback.content_ref + ' .video_clips .prompt a').click(function() {
          $('#question_popup').show();
          return false;
        });    
      	$(feedback.content_ref + ' .submit_button a').click(function() {
          //$('#question_popup').addClass('submitted');
          feedback.send();
          return false;
        });    
      	$(feedback.content_ref + ' .close a').click(function() {
          $('#question_popup').hide().removeClass('submitted');
          feedback.hide_response();
          return false;
        });    
      	$(feedback.content_ref + ' .cancel_button a').click(function() {
          $('#question_popup').hide().removeClass('submitted');
          feedback.hide_response();
          return false;
        });      
        $('#have_question a').click(function() {
          window.scrollTo(0, 272);
          $('#question_popup').fadeIn();
          return false;
        });
        
        if (window.askQuestionCategoryInfo) {
          setTimeout('refreshPlayerByCat(askQuestionCategoryInfo.category, askQuestionCategoryInfo.channel)', 200)
        }
        make_archive()
      }
      
    feedback.validate = function () {
        feedback.error = {}
        //username
        feedback.username = get_cookie('username') || ''
        if (! ((typeof feedback.username === 'string') && ( feedback.username.length > 0) && 
          (feedback.username !== 'null'))) feedback.error['username'] = true
        //message
        feedback.comment = feedback.textarea.value
        if (feedback.comment.length > feedback.char_limit) {
          //feedback.comment = feedback.comment.substr(0, feedback.char_limit)
          feedback.error.toolong =  feedback.too_long_warning + ': &ldquo;&ndash;' + 
              feedback.comment.substr(feedback.char_limit-15, 15) + '&ndash;&rdquo;'
          return false
        }
        if (! ((feedback.comment.length > 0) && (feedback.comment !== feedback.first_value))) feedback.error['message'] = true
        //site id
        var site_id_jquery = $('#site_id')
        if ((site_id_jquery.length > 0) && (parseInt(site_id_jquery.text()) > 0)) feedback.site_id = parseInt(site_id_jquery.text())
        else feedback.error['site_id'] = true
        return (!feedback.error.username && !feedback.error.message && !feedback.error.site_id)
      }

      feedback.send = function () {
        feedback.init_form()
        if (feedback.validate()) {
          if (testServer.flag)
            feedback.make_post_submit()
          else
            feedback.show_server_error()
        }
        else {
          var str = ''
          if (feedback.error.username) {
            str += feedback.error_login + '<br />'          
            //attach login display to login validation
            if (typeof login === 'object') {
              login.show()
              feedback.animate_login()
            }
          }
          if (feedback.error.message)
            str += feedback.error_comment + '<br />'            
          if (feedback.error.toolong)
            str += feedback.error.toolong + '<br />'
          feedback.respond (feedback.error_title + '\n' + str)
        }
      }
feedback.animate_login = function() {
  // determine to what top css to place the login box
  var login_top_css = 280;
  var login_modal_jpath = '#' + login.id
  var phone_jpath = '#textus .phone'
  if ($(feedback.comments_ref).length > 0)
    login_top_css = login_top_css + parseInt($(comments.modal_jpath).css('top'), 10) + 'px'
  else if ($(feedback.ask_ref).length > 0)
    login_top_css = parseInt ( $(login_modal_jpath).css('top'), 10) + 'px'
  else if ($(feedback.textus_ref).length > 0)
    login_top_css = login_top_css + $(phone_jpath).height() * .19 + 'px' 
  // slide modal window to the user
  $(login_modal_jpath).css('z-index', '6000').animate({
   top: login_top_css
  }, 1500)  
  // make login button scroll to login modal's new location
  $('#loginbutton a').click(function() {
    window.scrollTo( 0, 280 + parseInt($('#login_modal').css('top')) )
  })
}
      
feedback.respond = function(msg) {
  $('#question_popup').show()
  var confirm_jquery = $(feedback.content_ref + ' .confirm')
  var textarea_jquery = $(feedback.textarea)
  if (!feedback.textarea_height) {
    feedback.textarea_height = textarea_jquery.height()
  }
  textarea_jquery.height( feedback.textarea_height / 2)
  if (confirm_jquery.length > 0) {
    confirm_jquery.html(msg).show()
  }
  else {   
    textarea_jquery.after('<div class="confirm">' + msg + '</div>').show()
  }
  
}

feedback.hide_response = function() {
  $(feedback.content_ref + ' .confirm').hide()
  if (feedback.textarea_height)
    $(feedback.textarea).height( feedback.textarea_height )
}

feedback.show_server_error = function() {
  feedback.respond(feedback.server_error)
}
feedback.init_form = function() {
  if (!feedback.form) {
    form_jquery = $(feedback.content_ref + ' form')
    form_jquery.attr('name', 'feedback_form')
    feedback.form = form_jquery[0]
  }
}
var makeField = function(form, field_name, value) {
    if (typeof form[field_name] === 'undefined') {
      input = document.createElement('input')
      input.setAttribute('name', field_name)
      input.setAttribute('value', value)
      input.style.display = 'none'
      form.appendChild(input)
    } else {
      input = form[field_name]
      input.value = value
    }
  }
  
feedback.make_post_submit = function() {
      
  feedback.init_form()
  feedback.form.setAttribute('method', 'POST')
  if (feedback.server)
    feedback.form.setAttribute('action', feedback.server)
  var input
  
  makeField(feedback.form, 'site_id', feedback.site_id)
  makeField(feedback.form, 'member', feedback.username)
  makeField(feedback.form, 'comment', feedback.comment)
  var uri = location.href.toString();
  if (uri.indexOf('#') !== -1)
    uri = uri.substr(0, uri.indexOf('#'))
  uri = uri + '#sent'
  if (feedback.form.about_id && feedback.form.about_type.value == 'Image')
    uri = 'http://' + location.host.toString() + '/iSnaps/photo' + feedback.form.about_id.value +
        '.html?' + 'comment=sent'
  //if (feedback.form.about_id && feedback.form.about_type.value == 'Video')
  //  uri = 'http://' + location.host.toString() + 
  //     '/iVideo/index.html?comment=sent#vid'+vidId
  if (!feedback.form.url)
  	makeField(feedback.form, 'url', uri)
  
  feedback.form.submit()
}


// util
function getHash() {
  var hash = ''
  if (typeof(document.location.hash)!='undefined') hash = document.location.hash
  else if (typeof(window.location.hash)!='undefined') hash = window.location.hash
  else if (typeof(location.hash)!='undefined') hash = location.hash
  return (''+ hash)
}

var testServer = function(url) {
  testServer.flag = false;
  function callback(){
    if (request.readyState == 4) {
      if (request.status != 404)
        testServer.flag = true;
      //alert('server status : ' + request.status)
    }
  }
  // Test the server with a get request, catch permission denied errors
  try {
    var request = $.get(url, {}, callback);
  } catch(err) {
    //alert('get request error : ' + err.code + err.message)
    testServer.error = err.message;
    if (err.code != 404)
      testServer.flag = true;
    return;
  }
  request.onreadystatechange = callback;
  // avoid error in opera
  if (window.opera)
    testServer.flag = true;
}

// qustion archives
var selector = {}

var make_archive = function() {
  
  selector = {
    year: '',
    month: '',
    video: '',
    add: {},
    vid_array: []
  }
  selector.add = function(key, str) {
    this[key] += '\n' + str
  }
  
  // traverse all channels object for video data in iHave a Question  
  var chan = askQuestionCategoryInfo.channel
  var cat = askQuestionCategoryInfo.category
  var cat_obj = ALL_CHANNELS[chan].categories[cat]
  var img = $('#question_archive ul img')
  var img_tag = '<img alt="Play" src="'+img.attr('src') + 
      '" height="'+img.attr('height')+'" width="'+img.attr('width')+'">'
  
  make_archive.make_lists = function() {
    // push every video to selector.vid_array, where it can be sorted if needed
    for (var vid in cat_obj.videos) {
      var vid_obj = cat_obj.videos[vid]
      // add month and year to each video data object
      var d = new Date()
      d.setTime(vid_obj.date * 1000)
      vid_obj.month = d.getMonth()
      vid_obj.year = d.getFullYear()      
      vid_obj.vid = vid
      selector.vid_array.push(vid_obj)
    } 
    // loop thru video array and populate month, year, and video selectors
    var curr = {month:0, year:0}
    selector.add('year', '<ul class="year_nav horizontal">')
    for (var i=0; i<selector.vid_array.length; i++) {
      var vid_obj = selector.vid_array[i]
      // begin and end lists for every new month and year
      if ((curr.month !== vid_obj.month) || (curr.year !== vid_obj.year))  {
        // new month
        curr.month = vid_obj.month
         
        if (curr.year !== vid_obj.year) {
          // new year
          curr.year = vid_obj.year
          selector.add('year', '<li class="'+curr.year+'">')
          selector.add('year', '<a href="javascript:selector.setYear('+curr.year+')">' + 
              curr.year + '</a></li>')
          if (selector.month.length > 0)
            selector.add('month', '</ul>')
          selector.add('month', '<ul class="month_nav" id="months_'+curr.year+'">')
        }
        selector.add('month', '<li><a href="javascript:selector.setMonth('+curr.month + 
            ', '+curr.year+')">'+MONTH_NAMES[curr.month-1]+'</a></li>')
            
        if (selector.video.length > 0)
          selector.add('video', '</ul>')
        selector.add('video', '<ul id="video_'+curr.month+'_'+curr.year+'">')
        
      }
      // add video data to video selectors
      selector.add('video', '<li><dl class="horizontal"><dt>')
      selector.add('video', vid_obj.title.replace('&#10;', '<br />'))
      if (vid_obj.description.length > 0)
        selector.add('video', '<br />' + vid_obj.description)
      selector.add('video', '</dt><dd><a href="javascript:feedback.playClip('+vid_obj.vid+')">')
      selector.add('video', img_tag)
      selector.add('video', '</a></dd></dl></li>\n')
    }
    // end every selector list
    selector.add('video', '</ul>') 
    selector.add('month', '</ul>') 
    selector.add('year', '</ul>') 
  }
      
  make_archive.draw = function() {

    make_archive.make_lists()
    // replace static arhive with dynamic
    $('#question_archive ul').eq(0).replaceWith( selector.video )
    $('#question_archive ul.year_nav').replaceWith( selector.year )
    $('#question_archive ul.month_nav').replaceWith( selector.month )
    
    // hide all selector lists except the top ones, set active classes
    $('#question_archive ul').hide()
    $('#question_archive .left_column ul').eq(0).show()
    $('#question_archive ul.month_nav').eq(0).show()
    $('#question_archive ul.year_nav').show()
    $('#question_archive ul.year_nav a').eq(0).addClass('active')    
  }
  
  // date selector event handlers
  selector.setYear = function(year) {
    $('#question_archive ul.month_nav').hide()
    $('ul#months_' + year).show()
    $('#question_archive ul.year_nav a.active').removeClass('active')
    $('#question_archive li.' + year + ' a').addClass('active')
    $('ul#months_' + year + ' li:odd').addClass('odd')  
  }
  selector.setMonth = function(month, year) {
    var all_months = $('#question_archive div.left_column ul')
    var this_month = $('#video_' + month + '_' + year)
    all_months.hide()
    this_month.show()
    // set title
    //if (this_month.attr('id') === all_months.eq(0).attr('id'))
    //  $('#question_archive h3').text('Latest Clips')
    //else
      $('#question_archive h3').text(MONTH_NAMES[month-1] + ' ' + year)
  }
  
  make_archive.drawNewest = function(limit) {
    selector.newest = '<ul class="play_answers">'
    var img =  $('#askquestion .video_clips img')
    img_tag= '<img alt="Play" src="'+img.attr('src') + 
      '" height="'+img.attr('height')+'" width="'+img.attr('width')+'">'
    limit = limit || 5
    if (limit > selector.vid_array.length)
      limit = selector.vid_array.length
    for (var i=0; i < limit; i++) {
      vid_obj = selector.vid_array[i]
      selector.add('newest', '<li><dl><dt>')
      selector.add('newest', vid_obj.title.replace('&#10;', '<br />'))
      selector.add('newest', '</dt><dd class="clear_box">' + 
          '<a href="javascript:playVidIfLoaded('+vid_obj.vid+')">')
      selector.add('newest', img_tag)
      selector.add('newest', '</a></dd></dl></li>\n')    
    }
    selector.add( 'newest', '</ul>')
    $('#askquestion .video_clips ul').replaceWith( selector.newest )
  }
  
  make_archive.draw()
  make_archive.drawNewest(5)
  $('#question_archive ul.month_nav:first li:odd').addClass('odd')
}

// video functions moved to setVoteForVideo.js

function random_pastel_rgb() {
  var saturation = 28  
  var depth = 3
  var prev_factor = 0
  var rgb = 'rgb('
  for (var i=0; i<3; i++) {
    var factor = Math.floor(Math.random() * depth);
    if (factor === prev_factor) {
      factor = depth-1
    }   
    prev_factor = factor
    rgb += (255-((depth-1)*saturation)) + factor * saturation
    i === (2) ?
      rgb += ')':
      rgb += ',';
  }
  return rgb 
}

function random_order(){
  return (Math.round(Math.random())-0.5)}