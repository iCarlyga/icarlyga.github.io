// added image swap. 1/5/10 -GV
// added showCurrentPerson(). 12/11/09 -GV
var state = {}

state.CONTAINER_ID = 'blog_archives'
state.BLOG_LIST_REF = '#blog_archives .blogs'

function load_blogs_archive() {

var monthFirstLine = ''
var blog_obj
var blogTitle
var blogUrl

var selector = {
  char: "<ul class='characters'>",
  year: "<ul class='years'>",
  month: "<div class='months'>",
  blog: "<div class='blogs'>",
  add: {},
  month_list_array: []
}
selector.add = function(key, str) {
  this[key] += '\n' + str
}

state.blogs = [];
state.latestYear = 0

state.MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var first_char; var first_year; var first_month = " class='active'";
first_char = first_year = first_month;

// traverse blog data structure and create blogs archive selector

for (var character in ALL_BLOGS) {
  selector.add('char', "<li class=" + character + "><a href='javascript:pickPerson(\"" + character + "\")'" + first_char + "><span>" + character + "</span></a></li>")
  for (var year in ALL_BLOGS[character]) {
    if (year > state.latestYear)
      state.latestYear = year
    if (first_char != '')
      selector.add('year', "<li class='" + year + "'><a" + first_year + " href='javascript:pickYear(" + year + ")'>" + year + "</a></li>")
    first_month = " class='active'";
    selector.add('month', "<ul id='months_" + character + "_" + year + "'>")
    for (var month in ALL_BLOGS[character][year]) {
      for (var blogId in ALL_BLOGS[character][year][month]) {
        blog_obj = ALL_BLOGS[character][year][month]
        blog_obj.year = year
        blog_obj.month = month
        blog_obj.character = character
        //store blog data in a dictionary by id, in case we need the info later
        state.blogs[blogId] = blog_obj
      }
      selector.month_list_array.push("<li id='month_"+character+year+"_"+month+"'><a href='javascript:pickMonth("+month+","+year+")'>"+state.MONTH_NAMES[month]+"</a></li>")
      first_month = ''
    }
    first_year = ''
    // add month list elements in reverse order
    for (var m=selector.month_list_array.length-1; m>=0; m--) {
      // add odd classes to every other month
      if ((selector.month_list_array.length % 2) != (m % 2 == 0))
         selector.month_list_array[m] = selector.month_list_array[m].replace("<li id", "<li class=odd id")
      selector.add('month', selector.month_list_array[m])
      
    }
    selector.add('month', '</ul>')
    selector.month_list_array = []
    monthFirstLine =  "<ul id='months_" + character + "_"
  }
  first_char = ''
}

//alert(selector.month)

//end div and ul elements in selector html strings
for (var key in selector)
  if (typeof(selector[key]) == 'string') {
    selector.add(key, '</ul>')
    if ((key == 'blog') || (key =='month'))
      selector.add(key, '</div>')
  }

  
  
  // draw Blog Archives
  var html_block = "<h2><span>Blog Archives</span></h2>\n"+
    "<div class='block'>"
  html_block += selector.char
 
  html_block += selector.year
  
  html_block += selector.month
  html_block += "<h3>Latest Blogs</h3>\n"
  html_block += selector.blog
  html_block += "</div>"
  $('div#'+state.CONTAINER_ID).append(html_block)
  
  //alert(selector.year)

  // show the first month selector, hide all other month selector
  $('#blog_archives .months > ul').hide()
  $('#blog_archives .months > ul:first').show() 
  
  // select the first character
  state.currentPerson = 'Carly'
  state.currentYear = new Date().getFullYear();
  
  //show the latest blogs
  pickPerson(state.currentPerson);
  
  // set latest month
  $('#blog_archives .months ul a:first').addClass('active')
  $('#blog_archives .months ul a:first').text('Latest')
  $('#blog_archives .months ul a:first').text('Latest')
  
  showCurrentPerson();
  
  if (window.comments)
    blogs.setup_comments();
}

// comment features
var blogs = {state: state,
 comments_content_jpath: '#comments',
 uri_search_key: 'entry'
}

blogs.get_latest_blog_id = function() {
  var latest_date = 0;
  var latest_id = 0;
  for (var id in state.blogs) {
    var blog_obj = state.blogs[id][id];
    if (blog_obj.date > latest_date) {
      latest_date = blog_obj.date;
      latest_id = id;	
    }
  }	
  return parseInt( latest_id, 10)
}

blogs.setup_comments = function() {
  // get blog id from url 
  var blog_id
  var uri = location.href
  var uri_index = uri.indexOf(blogs.uri_search_key)
  if (uri_index != -1) {
    uri = uri.substr(uri_index + blogs.uri_search_key.length)
    uri = uri.substr(0, uri.indexOf('.'))
    blog_id = parseInt(uri)
  } else {
    blog_id = blogs.get_latest_blog_id()
  }
  // hide comments section if there are no comments
  comments.onchange = function() {
    if ($('#comments div').length < 2) 
      $('#comments').hide();
    else
      $('#comments').show();
    // remove fancy colors
    setTimeout("if (!context_poll.data) $('#comments div p').css('background-color', 'white')", 500)

  }
  // setup comments
  comments.setup( 'BlogEntry', blog_id, blogs.comments_content_jpath)
}


// event handlers

function pickPerson(name) {
    
  //set active tabs
  $('div#'+state.CONTAINER_ID + ' .characters > li > a').removeClass('active');
  $('div#'+state.CONTAINER_ID + ' .characters .' + name + ' a').addClass('active');

  //set current person to global namespace
  state.currentPerson = name
  pickYear(state.currentYear)
  
  //set title to latest blogs if the year is current
  if (state.currentYear == state.latestYear)
    $('#blog_archives h3').text('Latest Blogs')

  // hide latest year if nothing is in it
  $('#blog_archives ul#months_'+name+'_'+state.latestYear+' li').length < 1 ?
    $('#blog_archives ul.years .'+state.latestYear).hide():
    $('#blog_archives ul.years .'+state.latestYear).show()
}
 
function pickYear(year) {
  //use previous year if no blog entries for current year.
  if ($('#months_'+state.currentPerson+'_'+year+' li ').length < 1)
    year = state.currentYear = year - 1
  //set active tabs
  $('div#'+state.CONTAINER_ID + ' .years > li > a').removeClass('active');
  $('div#'+state.CONTAINER_ID + ' .years .' + year + ' a').addClass('active');
  
  //show the month selector
  $('#blog_archives .months > ul ').hide()
  $('#months_'+state.currentPerson+'_'+year).show();
  
  state.currentYear = year
  
  // set latest month
  $('#months_'+state.currentPerson+'_'+year + ' a:first').addClass('active')
  if ($('#months_'+state.currentPerson+'_'+state.currentYear + ' a').length > 0) {
    var topMonth = parseInt($('#months_'+state.currentPerson+'_'+state.currentYear + ' a:first').attr('href').split('(')[1].split(',')[0])
    pickMonth(topMonth, year)
  }
}

function pickMonth(month, year) {
  // hide all divs inside #archives, show div #archives_[currPerson]_[year]
  var character = state.currentPerson
  var blogTitle
  var blogUrl
  
  //start blog list
  var blog_list_html = "<ul id='the_blog_list'>"
  
  //loop thru each blogs in the list
  for (var blogId in ALL_BLOGS[character][year][month]) {
    if ( isNaN(parseInt(blogId)) == false) {
      //alert('blogId: '+blogId)
      blog_obj = ALL_BLOGS[character][year][month][blogId]
      blog_obj.id = blogId
      //save the title and url to variables
      for (var property in blog_obj) {
        switch(property) {
         //case 'id':
           //str += 'blog id - ' + blog_obj[property]
           //break
         case 'title':
           blogTitle = blog_obj[property]
           break
          //case 'teaser':    
            //str += blog_obj[property]
            //break
         case 'url':
           blogUrl = blog_obj[property]
           break
         //case 'date':  
           //str += blog_obj[property]
           //break     
        }  
      }
    // write list element
    blog_list_html += '\n' + "<li><a href='" + blogUrl + "'><p>" + blogTitle + "</p></a></li>"
    }
  }
  blog_list_html += '</ul>'
  //alert(blog_list_html)
  $(state.BLOG_LIST_REF).html(blog_list_html)
  //update header
  $('#blog_archives h3').text(state.MONTH_NAMES[month] + ' ' + year)
  //update active month
  $('#blog_archives .months .active').removeClass('active')
  $('#month_' + state.currentPerson + year + '_' + month + ' a').addClass('active')
}

  function showCurrentPerson() {
    var names = {carly:'Carly', sam:'Sam', freddie:'Freddie', spencer:'Spencer'};
    var name_jquery = $('#blogs_content_frame');
    var person = ''
    for (var name_id in names) {
      if (name_jquery.hasClass(name_id))
        person = names[name_id]
    }
    if (person.length > 0) {
      //alert(person)
      pickPerson(person)
    }
  }


// begin image swap
$(function() {
  //Turn bulleted lists of images into click swappible images.
  var keyword = '[image swap]'
  var prefix = 'list'
  var blog_lists_jquery = $('#blogs_content_frame ul')
  var list_num, index
  //Loop thru every bulleted list in blog, test for keyword
  for (var i=0; i < blog_lists_jquery.length; i++) {
    if (blog_lists_jquery.eq(i).text().indexOf(keyword) > -1) {
      blog_lists_jquery.eq(i).css({'list-style-type': 'none',
          'margin': '0', 'padding': '0'})
      //hide images in list
      var list_elems = blog_lists_jquery[i].getElementsByTagName("li");
      for (var li=0; li<list_elems.length; li++) {
        list_elems[li].style.display = 'none';
        list_elems[li].style.margin = '0';
        list_elems[li].style.cursor = 'pointer';
        list_elems[li].className = prefix + i + '_' + li;
        //add click events
        if ( (li + 1) < list_elems.length) {
          $( list_elems[li] ).click( function() {
             list_num = parseInt(this.className.substr(4, 100), 10)
             index = parseInt(this.className.split('_')[1], 10)
             $('ul li.' + prefix + list_num + '_' + (index+1)).fadeIn('fast')
             this.style.display = 'none'
             //alert('ul li.list' + list_num + '_' + (index+1))
          })  
        } else {      
          $( list_elems[li] ).click( function() {
             list_num = parseInt(this.className.substr(4, 100), 10)
             $('ul li.' + prefix + list_num + '_1').fadeIn('fast')
             this.style.display = 'none'
             //alert('show first: ' + 'ul li.list' + list_num + '1')
          })
        }
      }
      // display first image in list
      if (list_elems.length >= 2) {
        list_elems[1].style.display = 'block'
      } 
    }
  }
})  // end image swap
