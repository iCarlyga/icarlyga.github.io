$(document).ready(function(){
  
  if ( ($('#searchdiv').length > 0) && $.jqm) {
      $('#searchdiv').jqm({modal:true, overlay: 50});
      $('#searchdiv').jqmAddClose('#searchdiv');
  }
  if ($('#search-cont').length > 0) {        
      setUpSearchHandler();
  }      
  if($('.slideshow').length > 0) {
      if(typeof(gallery) != 'undefined'){
          gallery.init();
      }
  }
  if ($('ul#snaps_slideshow li.current img').length > 0) {
      if(typeof(gallery) != 'undefined'){
          gallery.vertCenter( $('ul#snaps_slideshow li.current > img') );
      }
  }
  if ($('#snaps_archives').length > 0)
    photoArchivesInit()

  if ($('#logo').length > 0) {
      var url = "/index.html";  // must keep in var named "url" like this for URL-munging code
      // Compare to "/index.html", "/", and ""
      if (url != window.location.pathname &&
          url.substring(0, url.length - 10) != window.location.pathname &&
          url.substring(0, url.length - 11) != window.location.pathname)
          $('#logo').addClass('not-home');
  }
  if ($('#videos').length > 0){
      setUpVideo();
      setupiVideoRatings();
  }
  
  // home poll code
  if($('#home_poll_wrapper_top').length > 0){
      setupPoll();
  }
  // blog archives
  if (($('#blog_archives').length > 0) && (typeof ALL_BLOGS != 'undefined'))
    setTimeout('if (typeof load_blogs_archive === "function") load_blogs_archive();', 500)
  // webshow ratings
  if($('#video-player-cont').length > 0)
    setupWebshowRatings();
  if( ($('#home_content_container').length > 0) && window.setupPopupForEmbed)
    setupPopupForEmbed();
  
  //flash sniffer
  if (window.flashUpdate) flashUpdate();
      
  // login / registration
  if (window.login) login.show_user();     
  if (window.reg) reg.init();
    
  // textus / ask a question
  if (window.feedback) feedback.init();    

  // ugc    
  if (window.sendmedia && sendmedia.init)
    sendmedia.init();
  if (window.uploadphotos && uploadphotos.init)
    uploadphotos.init();
  if (window.uploadvideos && uploadvideos.init)
    uploadvideos.init();
  if (window.approval && approval.init)
    approval.init();
  
  // If you want a page specific code to run on page load,
  // put it in a function named "on_page_ready"
  if (typeof on_page_ready === 'function') on_page_ready();
});