//changed display of popular galleries based on number of galleries. 4/6/10 -GV
//made code compliant with lite sites. 11/20/09 -GV
function SnapGallery() {
  // constants
  this.MEMBER_PREFIX = "By ";
  this.SHOW_ARCHIVES = true;
  this.MAX_WIDTH = 480;
  this.MAX_HEIGHT = 500;
  this.COMMENTS_JPATH = '#comments .content ';
  // initialize photo gallery display
  this.total = 0;
  this.current_i = 0;
  this.items = null;
  this.init = function() {
    this.getItems();
    this.getTotal();
    this.items.hide();
    this.getCurrent().show();
    //this.getVote().setId(0);
    this.setVoteIfLoaded();
    this.hideShowPrevNext();
    //vertically center the image
    this.imgScale('ul#snaps_slideshow li.current > img');
    this.vertCenter( $('ul#snaps_slideshow li.current > img') );
    //add the photo count and prepend member name with By
    $('div#snaps_slideshow_controls').append(this.photoCount());
    this.prependMember();
    // load the other images
    this.loadImages();
    //get first image id
    this.current_id = this.getPhotoId(0);
    this.setup_comments();
  };
  this.setup_comments = function() {  
    if (typeof comments === 'object') {
      comments.set_new_comment(this.COMMENTS_JPATH, this.current_id);
      feedback.init_form();
      feedback.form.about_type.value = 'Image';
    } 
    //else
      //setTimeout ('gallery.setup_comments()', 500)
  };
  this.getCurrent = function() {
    for (var index=0; index<this.items.length; index++) {
      if ( $(this.items[index]).hasClass('current') ) {
        this.current_i = index;
      }
    }
    return $('ul#snaps_slideshow li.current'); 
  };
  this.getItems = function() {
    this.items = $('ul#snaps_slideshow li');
    //return(this.items);
  };
  this.getTotal = function() {
    this.total = this.items.length
    return this.total;
  };
  this.getVote = function() {
    return(document.getElementById('slider'));
  };
  this.setVoteIfLoaded = function() {
    var duration = 500;
    var photoId = 321;
    // send the vote slider a set Id request if the function has been established
    if (this.getVote && this.getVote() && (this.getVote().setId)) {
      this.getVote().setId(this.getPhotoId(0));
    } else {
      // else call this function again if the function has not been established
      window.setTimeout(function() {
        gallery.setVoteIfLoaded();
      },
      duration);
    }
  };
  this.setCurrent = function(new_current_i) {
    var old_current_i = this.current_i;
    $(this.items[new_current_i]).addClass('current').show();
    $(this.items[old_current_i]).removeClass('current').hide();
    this.current_i = new_current_i;
    this.hideShowPrevNext();
    var id = this.getPhotoId(new_current_i)
    //update photo id's on photo change
    this.current_id = id;
    if (this.getVote())
      this.getVote().setId(id);
    this.setup_comments();
  }
  this.next = function() {
    //alert('next photo');
    this.setCurrent ( this.current_i + 1);
  };
  this.previous = function() {
    //alert('previous photo');
    this.setCurrent ( this.current_i - 1);
  };
  this.getPrevBtn = function() {
  	return $('a#snaps_slideshow_controls_prev')
  };
  this.getNextBtn = function() {
    return $('a#snaps_slideshow_controls_next');
  };
  this.hideShowPrevNext = function() {
    /* Hide or show next and previous buttons as nessessary */
    if (this.current_i>0)
      this.getPrevBtn().show();
    else
      this.getPrevBtn().hide();
    if (this.current_i<this.total-1)
      this.getNextBtn().show();
    else
      this.getNextBtn().hide();
    //vertically center the image
    this.imgScale( 'ul#snaps_slideshow li.current > img' );
    this.vertCenter( $('ul#snaps_slideshow li.current > img') );
    //reload font magic
    this.reloadFont();
    //change photo count
    $('div#snaps_slideshow_controls p.count').replaceWith(this.photoCount());
    
  };
  this.vertCenter = function(obj) {
  	var max_height = 550;
  	obj.css('margin-top', max_height/2 - obj.height()/2);
  }
  this.reloadFont = function() {
    if (century!=undefined) {
    sIFR.replace(century, {
      selector: '.snaps_caption p',
      bgcolor: 'FFFFFF',
      css: '.sIFR-root {color: #394c8c; text-align: center;}'
    });	
    }
  };
  this.photoCount = function() {
  	return '<p class="count">'+(this.current_i+1)+' of '+this.total+'</p>';
  };
  this.loadImages = function() {
  	this.items.each(
      function ( index ) {
      	//parse the image data from the span
      	var img_data = $(this).children('span').text().split(';');
      	var width = img_data[0].substring(6);
		var height = img_data[1].substring(7);
		var src = img_data[2].substring(4);
		//replace the loading images with a real image tag
		var img_tag = '<img src='+src+' width='+width+' height='+height+' />';
		$(this).find('img.loading').replaceWith(img_tag);
      }
    );
  };
  this.imgScale = function(selector) {
    var img = $(selector)
    var xy_ratio =  img.width() / img.height()
    if (img.height() > this.MAX_HEIGHT) {
      img.height(this.MAX_HEIGHT)
      img.width(xy_ratio * this.MAX_HEIGHT)
    }
    if (img.width() > this.MAX_WIDTH) {
      img.width(this.MAX_WIDTH)
      img.height(this.MAX_WIDTH / xy_ratio)
    }
  }
  this.prependMember = function() {
  	$('ul#snaps_slideshow p.member').prepend(this.MEMBER_PREFIX);
  }
  this.getPhotoId = function(index) {
    if (!window.ALL_PHOTOS) return -1;
    try{
      var currentPhotos = ALL_PHOTOS[currentGalleryInfo.channel].categories[currentGalleryInfo.category].photos
      var i=0
      for (var id in currentPhotos) {
        if (i == index)
          return(id)
        i++
      }
    }catch(err){return 0};
  }
}


var ratingSubmit = {};

function setupRatingSubmit(){
    // RatingSubmit object handle
    var pollHost = '';
    
    // crowsnest local
    // var pollHost = 'http://crowsnest/JO/icarly-webdir/polls/test.ajax';
    
    // for-beta-haml_home.2009-06-19_13-53.haml:
    //var pollHost = 'http://beta.polls.icarly.com';
    
    // for-production-haml_home.2009-06-17_13-26.haml:
    var pollHost = 'http://polls-intl.icarly.com';
    
    if (typeof(RatingSubmit) != 'undefined')
      ratingSubmit = new RatingSubmit({submitURL:pollHost});
}    
setupRatingSubmit();

function submitVote(assetId, rating) {
    ratingSubmit.submit(assetId,rating);
    // alert('This is only a test.\n Had this been real, you would have submitted this vote: \nassetId: '+assetId+', rating: '+rating);
}


//* End Slideshow   ----  Begin Archives  */
 
var gallery = new SnapGallery();

//var currentGalleryInfo = {channel: 5, category: 70};

var chans = []

if (window.ALL_PHOTOS) {

for (var chanId in ALL_PHOTOS)
  if (!(isNaN(parseInt(chanId))))
    chans.push(chanId)


var chan_obj = ALL_PHOTOS;

}

function drawChannelSelector(ref) {
  // make links that call a javscript object to change channels
  var html_str = ''
  var i=0 //channel index
  var activeClass = ''
  //determine active channel
  if (typeof(currentGalleryInfo) != 'undefined')
    var activeChannel = currentGalleryInfo.channel
  else 
    var activeChannel = chan_obj.index_chan
  for (var chanId in chan_obj)
    if (!(isNaN(parseInt(chanId)))) {
      if (chanId == activeChannel)
        activeClass = " class='active'"
      html_str += "<a href='javascript:pickChannel(" + chanId + ")' id='channel_" + i +"'" + activeClass + "><span>channel "+chanId+"</span></a>"
      activeClass = ''
      i++ }
  html_str += "\n<p class='clear'></p>"
  $(ref).html(html_str)
}


function pickChannel(chanId) {
  
  $('#category_lists > div').hide()
  if ($('#category_list_'+chanId).length > 0)
    $('#category_list_'+chanId).show()
  else {
    $('#category_lists').append("<p id='temp'></p>")
    $('#temp').replaceWith(drawCategoryList(chanId))
  }
  
  // change active channel in channel selector
  $('#channel_selector .active').removeClass('active')
  for (var i=0; i<chans.length; i++)
    if (chans[i] == chanId)
      $('#channel_selector #channel_'+i).addClass('active')
}

function drawCategoryList(chanId, ref) {
  // make an html div full of links to every category in a given channel
  var html_str = "<div id='category_list_" + chanId + "' class='list_block'>"
  for (var catId in chan_obj[chanId].categories) {
    var cat = chan_obj[chanId].categories[catId]
    html_str += "\n<a href='/iSnaps/category" + catId + ".html'>"
    html_str += cat.name + '</a>'
  }
  html_str += '\n</div>'
  if (typeof(ref) != 'undefined')
    $(ref).html(html_str)
  else 
    return html_str
}

function photoArchivesInit() {
  setupiSnapRatings();
  gallery.setVoteIfLoaded();
  if (typeof(currentGalleryInfo) != 'undefined')
    var activeChannel = currentGalleryInfo.channel
  else 
    var activeChannel = chan_obj.index_chan
  if ( $('div#snaps_archives').length > 0) {
  	if (gallery.SHOW_ARCHIVES) {
  		// Initialise Photo Archive Selector
  		drawChannelSelector('#channel_selector')
    	drawCategoryList(activeChannel, '#category_lists');
    } else {
    	$('div#snaps_archives').hide()
    }
  }
  gallery.imgScale('ul#snaps_slideshow li.current > img');
  gallery.vertCenter($('ul#snaps_slideshow li.current > img'))
}


// configRatingsiSnaps.js


    var photoSelectorRatings = {};
    
    // to be called by jquery equivilent of window.onload function in
    function setupiSnapRatings(){
      if (typeof(RatingsHandler) != 'undefined') {
        var parentId = 'snaps_slideshow'
        var ratingClass = 'snaps_caption_rating'
        var prefix = 'snaps_rating'
        var selector = '#' + parentId + ' .' + ratingClass
        
        setRatingDivs(selector, prefix)
    
        // define video ratings object
        photoSelectorRatings = new RatingsHandler({
            name : 'isnaps selector ratings' ,
            starUrls_arr : {
                empty : '/isnap_images/star_empty.gif',
                half : '/isnap_images/star_half.gif',
                full : '/isnap_images/star_full.gif'
            },
            contClass: ratingClass,
            contPrefix: prefix,
            defaultData: POLLS_AND_RATINGS
        });
        // run update right away to show most recent values
        // in POLLS_AND_RATINGS OBJECTa
        var parDiv = parentId;
        photoSelectorRatings.defaultRatingsByParent(parDiv);
      }
    }
    
    function setRatingDivs(selector, prefix){
      // find every rating, then add the id [prefix][assetId]
      try{
        currentGallery = ALL_PHOTOS[currentGalleryInfo.channel].categories[currentGalleryInfo.category].photos
        var i=0
        for (var id in currentGallery) {
          $($(selector)[i]).attr('id', prefix+id)
          i++
        }
      }catch(err){}
      // reveal the captions
      var html_str = ''
      for (var r=0; r<5; r++)
        html_str += "<img src='/isnap_images/star_full.gif' /> "
      $(selector).html(html_str)
      $(selector).show()    
    }

//PICK A GALLERY: populate and activate when the page is ready
(function () {  $(function () {
    //check for required data objects
    if (window.ALL_PHOTOS && window.currentGalleryInfo && ($("#category_list select").length > 0)) {
      var gallery_dictionary = ALL_PHOTOS[currentGalleryInfo.channel].categories;
      var list_jquery = $('#category_list select[name="category"]');
      if (!gallery.latest_category_str) {
        gallery.latest_category_str = list_jquery[0].options[0].textContent
      }
      list_jquery.html("");
      for (var cat_id in gallery_dictionary) {
        list_jquery.append('<option value="' + cat_id + '">' + gallery_dictionary[cat_id].name + "</option>")
      }
      try{
      $('#category_list option[value="' + currentGalleryInfo.category + '"]')[0].selected = true;
      } catch(err){}
      $("#category_list option").eq(0).text(gallery.latest_category_str);
      list_jquery[0].onchange = function () {
        var category = this.options[this.selectedIndex].value;
        var channel = currentGalleryInfo.channel;
        if (category === "latest") {
          location = "http://" + location.host + "/iSnaps/channel" + channel + ".html"
        } else {
          location = "http://" + location.host + "/iSnaps/category" + category + ".html"
        }
        var choice_jquery = $(this.options[this.selectedIndex]);
        choice_jquery.append(" ...")
      }
    }
})  } ());  //end PICK A GALLERY


//modify display of promo (most popular) galleries based on the number of galleries
$(function () {
    var state, elems = {
        list: $('#snaps_nav .promo_gallery ul li'),
        header: $('#snaps_nav img.popular_galleries'),
        face: $('#snaps_nav img.popular_galleries_spancer'),
        hand1: $('#snaps_nav img.popular_galleries_spancer_left'),
        hand2: $('#snaps_nav img.popular_galleries_spancer_right')
    }
    var promoGalleriesState = {
        display: function () {}
    }
    var noPromoGalleriesState = {
        display: function () {
            //hide all elems if there are no promo galleris
            elems.header.hide();
            elems.face.hide();
            elems.hand1.hide();
            elems.hand2.hide();
        }
    }
    var onePromoGalleriesState = {
        display: function () {
            //move all elems to the left if there is only one promo gallery
            elems.header.css('left', '140px');
            elems.face.css('left', '-178px');
            elems.hand1.css('left', '0');
            elems.hand2.css('left', '167px');
        }
    }
    switch (elems.list.length) {
    case 0:
        state = noPromoGalleriesState;
        break;
    case 1:
        state = onePromoGalleriesState;
        break;
    default:
        state = promoGalleriesState;
    }
    state.display();
})