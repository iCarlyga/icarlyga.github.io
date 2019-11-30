// game_archive.js
// in chrome, sorting games by id number 5/20/2011
// created 11/24/2009 -GV

var game_archive = {
  latest_limit: 4,  //number of "latest games"
  page_limit: 8,    //number of games per page
  page_width: 235,
  id: 'awesome_games',
  links_id: 'game_page_list',
  page_slider_id: 'game_page_slider',
  page_prefix: 'game_page',
  title: "Awesome Games"
  }
  game_archive.draw = function(){
    //check for data, then draw archive
    if (!window.ALL_GAMES){
      alert('error: missing game archive data object')
      return}
    var html_str = '<h2>' + this.title + '</h2>'
    //latest games
    html_str += '\n<div class="latest">\n'
    html_str += '<h3>latest</h3>'
    var count = 0
    //make an array for all games
    games_array = [];
    for (var id in ALL_GAMES){
        ALL_GAMES[id].id = id;
        games_array.push(ALL_GAMES[id]);
    }
    // sort array for chrome
    if (navigator.userAgent.match(/chrome/i)){
        games_array = games_array.sort(function(a,b){
            return Math.floor(b.id) - Math.floor(a.id);
        });
    }
    
    for (var i=0; i < games_array.length; i++) { var id = games_array[i].id;
      if ((count > 0) && (count <= this.latest_limit)) {
        html_str += '<a href="' + ALL_GAMES[id].page_url +
            '"> <img src="' + ALL_GAMES[id].thumbnail + 
            '"> <h4>' + ALL_GAMES[id].caption +
            '</h4> <em>play</em> </a>\n'}
      count++
    }
    //more games
    html_str += '</div> \n\n <div class="more"> \n'
    html_str += '<h2>games archive</h2> <h3>more games</h3>'
    html_str += '<div id="more_game_pages"> <div id="game_page_slider">'
    count = 0;
    var page = 0;
    var class_prop;
    var odd = false;
    for (var i=0; i < games_array.length; i++) { var id = games_array[i].id;
      if (count > this.latest_limit){
        //make new divs for pagination
        if ((count - this.latest_limit) % (this.page_limit) === 1){
          count === this.latest_limit + 1 ?
          html_str += '<div id="' + this.page_prefix + '0">':    
          html_str += '</div> \n <div id="' + this.page_prefix + page + 
              '" style="left:' + (page * game_archive.page_width) + 'px">\n'
          odd = false;
          page++
        }             
        class_prop =  odd ? ' class="odd"' : ''
        odd = !odd
        if (count === this.latest_limit) class_prop = ' class="active"'
        html_str += '<a href="' + ALL_GAMES[id].page_url + '"' + 
            class_prop + '"> <em>play</em>  <h6>' + 
            ALL_GAMES[id].caption + '</h6> </a>\n'                    
        }    
      count++
    }
    html_str += count==0 ?
        '</div></div></div>\n\n':
        '</div></div></div></div>\n\n';   
    if (page > 1) {
      //make page selector
      html_str += '<div class="paginator">' +  //center pagination links
          '<div id="game_page_list" style="left: ' + (96 - page * 9) + 'px">'
      for (var p=0; p < page; p++) {
        p === 0 ?
          html_str += '<a class="p' + p + '_active" href="#' + p + '">' + (p+1) + '</a>':
          html_str += '<a class="p' + p + '" href="#' + p + '">' + (p+1) + '</a>'
      }
      html_str += '</div> </div>'
    }   
    //alert(html_str)
    if (page <= 1) {
        html_str = html_str.replace('</div></div></div>\n\n', '</div></div>\n')
    }
    game_archive.str = html_str
    $('#' + game_archive.id).prepend(html_str);
    game_archive.set_links()
    game_archive.center_titles()
  }
  game_archive.show_page = function(page) {
    //alert(page);
    //$('#' + this.page_slider_id).css('left', (page * -1 * game_archive.page_width));
    $('#' + this.page_slider_id).stop().animate({
      left: page * -1 * game_archive.page_width + 'px'
    //}, 1000, 'easeOutQuad'); 
    //}, 1000, 'easeInOutSine'); 
    //}, 1000, 'easeOutQuint'); 
    }, 1500, 'easeOutElastic'); 
    
    //set active classes on game_page_list links
    var links_jquery = $('#game_page_list a');
    for (var i=0; i<links_jquery.length; i++) {
      links_jquery.eq(i).removeClass('p' + i + '_active');
      links_jquery.eq(i).addClass('p' + i);   
    }
    page = parseInt(page, 10);
    links_jquery.eq(page).addClass('p' + page + '_active');
    links_jquery.eq(page).removeClass('p' + page); 


  }
  game_archive.set_links = function() {
    //alert('setting links at ' + '#' + this.links_id + ' a')
    $('#' + this.links_id + ' a').click( function() {
      var page = this.href.split('#')[1];
      game_archive.show_page(page);
      return false;
    })
    
  }
  
  game_archive.center_titles = function() {
    var titles_jquery = $('#'+game_archive.id+ ' .latest h4')
    for (var i=0; i<titles_jquery.length; i++) {
      if (titles_jquery.eq(i).height() < 21)
        titles_jquery.eq(i).css('margin-top', '7px')
      else if (titles_jquery.eq(i).height() > 40)
        titles_jquery.eq(i).css({'top': '128px', 'line-height': '12px'})
    } 
    
    var more_games_jquery = $('#more_game_pages a')
    var more_play_jquery = $('#more_game_pages em');
    titles_jquery = $('#more_game_pages h6')
    for (var i=0; i<titles_jquery.length; i++) {
      if (titles_jquery.eq(i).height() > 32) {
        more_games_jquery.eq(i).height('60px')
        more_play_jquery.eq(i).css({'position': 'relative', 'top': '8px'});
      }
    }
  }
  game_archive.toString = function() {
    return game_archive.str}
    
  game_archive.jquery = function() {
    return $('#' + game_archive.id)}

//on dom ready, initialize 
$( function(){ game_archive.draw() } );