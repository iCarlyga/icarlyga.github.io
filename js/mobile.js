// jQuery hashchange plugin - v1.3 - http://benalman.com/projects/jquery-hashchange-plugin/
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

// jQuery cookie plugin - http://plugins.jquery.com/files/jquery.cookie.js.txt
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};

// jQuery.windowLoaded - Runs a function if/when the window is loaded - http://plugins.jquery.com/project/window-loaded
(function($){$(window).load(function(){window.loaded=1});$.windowLoaded=function(fn){var windowLoadedFn=window.loaded?(function(fn){fn.call(window)}):(function(fn){$(window).load(fn)});windowLoadedFn(fn)}})(jQuery);

// jQuery easing plugin - http://gsgd.co.uk/sandbox/jquery/easing/
jQuery.extend(jQuery.easing,{easeOutBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b}});

// Google Analytics
(function(){
    var config = {
        account: 'UA-17284420-1',
        category: 'Video',
        debug: true,
        value: 0
    };
    $.fn.track.defaults.debug = config.debug;
    $.trackPage(config.account);
    
    window.trackVideoEvent = function(action) {
        $.trackEvent(
            config.category, 
            action, 
            $('#player').attr('data-title'), 
            Math.floor($('#player').attr('data-id') || config.value)
        );
    }
})();

// Common animations
(function($){  
    $.animationSpeed = 400;
    $.fn.slideInFromSide = function() {  
        $(this).css({'left': '100%'}).animate({'left': '0%'}, $.animationSpeed, 'swing');
        return this.each(function(){});
    }; 
    $.fn.slideOutToSide = function() {  
        $(this).css({'left': '0%'}).animate({'left': '-100%'}, $.animationSpeed, 'swing');
        return this.each(function(){});
    };
})(jQuery);


// equalheight - a jquery method that makes elements equal in height, and binds with window resizing. Good for grids
(function($){  
    $.fn.equalheight = function(min) {  
        var cells = this;
        $(window).bind('resize', function(){
            var height, max = (typeof min != 'undefined')? min: 10;
            cells.css('min-height',0).each(function(i, element){
                height = element.offsetHeight;
                max = height > max ? height : max;
            }).css('min-height', max + 'px'); 
        }).trigger('resize');      
        return this.each(function(){});
    };
})(jQuery);

// gpaginate - a custom pagination jquery plugin
(function($){  
    var defaults = {
        items_per_page: 6,
        next: 'a.next.button',
        previous: 'a.previous.button',
        first: 'a.latest.button',
        container: '<div data-gpaginate="true" style="position:relative; left:0; width:-w-%; height: 100%;" />',
        subpage: '<div data-subpage="-i-" style="position:absolute; left:-l-%; width:-w-%;" />',
        duration: 120
    };
    $.gpaginate = {'update_buttons':function(){}};
    $.fn.gpaginate = function(options) {   
        if (typeof options == 'undefined') var options = {};
        options = $.extend(defaults, options);
        //the first time pgaginate is called, set up all pagination buttons with livequery
        if (!$('div[data-gpaginate]').length) {
            $.gpaginate.update_buttons = function(index, length, slider){
                if (typeof slider == 'undefined') {
                  slider = $('body');
                }
                if (index == 0) {
                    $(options.previous, slider.parents()).eq(0).addClass('inactive');
                } else {
                    $(options.previous, slider.parents()).eq(0).removeClass('inactive');
                }
                if (index >= length - 1) {
                    $(options.next, slider.parents()).eq(0).addClass('inactive');
                } else {
                    $(options.next, slider.parents()).eq(0).removeClass('inactive');
                }
            }
            $(options.next).live('click',function(event){
                var slider = $(this).parents().find('div[data-gpaginate]').eq(0);
                var index = Math.floor(slider.attr('data-index'));
                var length = Math.floor(slider.attr('data-length'));
                if (length - index > 1) {
                    slider.attr('data-index', index + 1);
                    slider.trigger('slide');
                }
                event.preventDefault();
            });
            $(options.previous).live('click',function(event){
                var slider = $(this).parents().find('div[data-gpaginate]').eq(0);
                var index = Math.floor(slider.attr('data-index'));
                if (index > 0) {
                    slider.attr('data-index', index - 1);
                    slider.trigger('slide');
                }
                event.preventDefault();
            });
            $(options.first).live('click',function(event){
                var slider = $(this).parents().find('div[data-gpaginate]').eq(0);
                slider.attr('data-index', 0);
                slider.trigger('slide');
                event.preventDefault();
            });
        }
        return this.each(function() {
            obj = $(this);
            obj.css({position: 'relative'});
            //make sub pages
            var children = obj.children();
            var length = Math.ceil(children.length / options.items_per_page);
            var container = $( $.replace(options.container, {'-w-': 100 * length}));
            obj.empty().html(container);
            var subpage, width = 100 / length;
            for (var i=0; i<length; i++) {
                subpage = $( $.replace(options.subpage, {'-i-': i, '-l-': i*width, '-w-': width}));
                subpage.append(children.slice(i*options.items_per_page, (i+1)*options.items_per_page));
                container.append(subpage);
            };
            container.attr({
                'data-length': length, 
                'data-index': 0
            }).bind('slide', function(){
                var slider = $(this);
                var index = Math.floor(slider.attr('data-index'));
                var length = Math.floor(slider.attr('data-length'));
                slider.animate({
                    left: (-100 * index) + '%'
                }, options.duration, 'swing');
                $.log('slide to subpage ' + index + ' of ' + length);
                
                $.gpaginate.update_buttons(index, length, slider);
                  
                slider.trigger('reset-height');
            }).bind('reset-height', function(){
                var slider = $(this);
                var index = Math.floor(slider.attr('data-index'));
                subpage = slider.find('div[data-subpage=' + index + ']');
                slider.height( subpage.height());
            }).trigger('slide');
            $(window).bind('resize', function(){
                container.trigger('reset-height');
            });
         
        });
    };
})(jQuery);
 

(function($){
    //helper functions
    $.extend($, {
        log: function(message) {
            window.console && console.log? console.log(message): message;
        },
        replace: function(template, hash) {
            $.each(hash, function(key, value) {
                while(template.indexOf(key) != -1) {
        		    template = template.replace(key, value);
                }
            });
            return template;
        },
        format_song: function(title,artist,duration) {
            return $.replace('<strong>-title-</strong> <span>Artist: -artist-</span><em>-minutes-:-seconds-</em>', {
                '-title-': title, '-artist-': artist, 
                '-minutes-': Math.floor(duration/60), 
                '-seconds-': (duration%60<10? '0': '') + Math.floor(duration%60)    
            });
        },
        scroll_page: function(top){
            if (top > $('html').scrollTop()+$('body').scrollTop()) {
                $('html,body').animate({scrollTop:top+'px'}, $.animationSpeed, 'swing');
            }
        },
        sort_by_date: function(a,b){
            return b.date - a.date;
        },
        cloneDataAttributes: function(source, target){
            if (source.attr('data-title')) target.attr('data-title', source.attr('data-title'));
            if (source.attr('data-id')) target.attr('data-id', source.attr('data-id'));
            target.removeAttr('data-started');
        },
        autoplay: function(){
            if (navigator.userAgent.match(/android/i)) {
                setTimeout(function(){ 
                    $('video').trigger('play'); //this delay fixes an android issue
                }, 100); 
            } else if (navigator.userAgent.match(/iphone/i)) {  
                $('video').trigger('play');
                setTimeout(function(){ 
                    $('video').trigger('play'); //this delay fixes an android issue
                }, 100); 
            }
            else {
                $('video').trigger('play');
            }
            
        }
    });
    
    //contextual polls
    $(document).bind('load_comments', function(){
        if (!window.POLLS_AND_RATINGS) {
            $.getScript('/js/polls_and_ratings/data.js');
            $.getScript('/js/polls_and_ratings/contextual_polls.js');
        }
    });
    
    //on dom ready
    $(function(){
        //highlight the page name in nav
        var page_name = $('article:first').attr('class');
        $('body').addClass(page_name);
        $('nav a[href*='+page_name+']').addClass('active'); 
        
        //handle load_asset requests that are called before asset data is loaded
        $(document).bind('load_asset',function(e,data){
            if (!$.model){
                setTimeout(function(){
                    $(document).trigger('load_asset', data);
                }, 200);
            }
        });
        //show a page section or icarly asset when hash changes
        $(window).bind('hashchange', function(event){
            //get section name or asset id from url
            var key = window.location.hash.substr(1);
            var section = key? $('section#'+key): 0;
            var id = parseInt(key,10);
            $.log('hashchange: ' + key);
            if (key.length == 0) {
                //view first section    /#
                $('section.active').removeClass('active').addClass('inactive');
                $('section:not(#loading):first').addClass('active').removeClass('inactive').slideInFromSide();
            } else if (section.length) {
                //view section          /#section_name
                $('section.active').removeClass('active').slideOutToSide();
                section.addClass('active').removeClass('inactive').slideInFromSide();
                $('section:not(.active)').addClass('inactive');
                $(window).trigger('scroll_top');
            } else if (id) {
                //view icarly asset     /#id_number
                $(document).trigger('load_asset', {id:id});
            }       
        });
        
        $(window).bind('hashchange', function(event){
            $('video,audio').trigger('pause');
        });
        

    });
    
    //click event for inactive links
    $('a.inactive').live('click', function(){
        return false;
    });
    
    //initialize videos
    $(function(){ if ($('#player').length) {
    
        //a link to an mp4 file with the id player, html5 video player when clicked
        $("a#player[href$=.mp4]").live('click', function(){
            var $this = $(this);
            var $video = $('<video id=player>');
            var $poster = $this.find('img:first');
            $.extend($video[0], {
                autoplay: 'true',
                controls: 'controls',
                height: $poster.height(),
                poster: $poster.attr('src'),
                src: this.href,
                width: $poster.width()
            });               
            $video.attr('controls', 'controls'); //makes controls appear on iPad  
            $.cloneDataAttributes($this, $video);
            var qthtml = '<object class="quicktime" type="video/quicktime" bgcolor="000" autoplay=true ' +
                ' data="-src-" width=-w- height=-h-><param name=controller value=true><param name=scale value=aspect></object>';
            
            $video.bind('error',function(error){
                $.log(error);
                var clone = $video.clone();
                $video.replaceWith( $.replace(qthtml, 
                    {'-src-': this.src, '-w-': '100%', '-h-': 320}
                ));
                $('object[type=video/quicktime]:first').append(clone)
                
                $('a[href$=.mp4]:not(#player)').bind('click',function(){
                    $.log(this.href);
                    $('.quicktime').attr({data:this.href});;
                });
            });
            
            //fade out placeholder image while loading the video
            $poster.css({top:0,left:0,position:'absolute'});
            $this.parent().css('position','relative').append($poster);
            $poster.fadeOut(function(){$(this).remove();});
            
            //pop in the video and play
            $this.replaceWith($video);
            $.autoplay();
            
            //scale changes the video height to in step with the aspect ratio 
            $video.bind('scale',function(){
                setTimeout(function(){
                    var $video = $('video#player');
                    var player = $video[0];
                    //scale when video metadata is loaded
                    if ((player.readyState > 3) && player.videoHeight) {
                        aspect_ratio =  player.videoWidth / player.videoHeight;
                        $video.stop().animate({
                           height: $(player).width() / aspect_ratio
                        },'fast','swing');
                    } else {                     
                        $video.trigger('scale');
                    }
                },600);
            }); 
            $video.bind('change_url',function(event, data){
                var a = $('<a href="' + data.url + '">a</a>');
                $('body').append(a);
                if (data.title && data.id) {
                    a.attr('data-title', data.title.replace(/"/g, '&quot;')).attr('data-id', data.id); 
                }
                a.click();
                $('body').remove(a);
                $(document).trigger('load_asset_info', data);
            });
            $video.bind('ended', function() { 
                trackVideoEvent('end');
            }); 
            $video.bind('play', function() { 
                if (!this.getAttribute('data-started')) {
                    this.setAttribute('data-started', true);
                    trackVideoEvent('start');
                    $.completionChecker.start();
                }
            });
            return false;   
        });
        //scroll to player
        $.scrollToPlayer = function() {
            $(window).scrollTop( $('body>*:first').height() );   
        }
        //other links to mp4 files change the video in the player, and first p.description
        $("a[href$=.mp4]:not(#player)").live('click', function(){
            var $video = $('video#player');
            if ($video.length < 1) {
                $("a#player[href$=.mp4]").attr('href', this.href).click(); 
                $video = $('video#player').trigger('scale');
                $.cloneDataAttributes($(this), $video);
            } else {
                $video[0].src = this.href;
                $.cloneDataAttributes($(this), $video);
                $video.trigger('load').trigger('play').trigger('scale');
            }
            $('p.description:first').html($(this).html()).find('img').remove();
            $.scrollToPlayer();
            $(document).trigger('load_asset_info', {id: $video.attr('data-id')});
            return false
        });
        //any link with href=#player becomes a play button
        $("a[href$=#player]").live('click', function(){
            $("a#player[href$=.mp4]").click();
            $('video#player').trigger('play');
            $.scrollToPlayer();
            return false
        });
        //when video metadata loads, change video height to preserve aspect ratio
        $("video").live('loadedmetadata', function(){
            $.log('metadata loaded: ' + this);  
            $(this).trigger('scale'); 
        });
        //scale video when the window or device size changes
        $(window).bind('resize', function() {
            $('video').trigger('scale');  
            $.log('resize event. width is now: ' + $(window).width());
        });
    } });
        
    //archive tabs
    $('section > .nav a').live('click',function(event){
        event.preventDefault();
        $(this).closest('section').attr('class',$(this).attr('class') + ' active');
        $('div[data-gpaginate]').trigger('reset-height').attr('data-index',0).css({left: 0}); 
        $.gpaginate.update_buttons(0, 2);
        $(window).scrollTop($('header:first').height());
    });
    
    
    

    //video page script
    $(function () {
        if ($('#player').length) {

            $.windowLoaded(function () {
                $('#video-promos a').equalheight(112);
            });

            $.completionChecker = {
                TARGET_COMPLETION: .9,
                DELAY: 2200,
                start: function () {
                    if (!this.active) {
                        this.active = true;
                        this.tickAfterDelay();
                    }
                },
                stop: function () {
                    this.active = false;
                },
                tickAfterDelay: function() {
                    setTimeout(function(){
                        $.completionChecker.tick()
                    }, this.DELAY);  
                },
                tick: function () {
                    if (typeof $('video').length) {
                        this.v = this.v || $('video')[0];
                        if (this.v.currentTime && this.v.duration) {
                            //$.log('check video completion. currentTime = ' + this.v.currentTime);
                            if (!this.scaled && this.v.currentTime > 1) {
                                $(this).trigger('scale');
                                this.scaled = true;
                            }
                            if (this.v.currentTime / this.v.duration >= this.TARGET_COMPLETION) {
                               trackVideoEvent('90-percent-completion');
                               this.active = false;
                            }
                        }
                    }
                    if (this.active) {
                        this.tickAfterDelay();
                    }
                }
            }


        }
    }); //end video page script



            
        
    $(function(){ 
        //initilize ajaxy display
        if ($('section.active').length) {
              $('section:not(.active)').addClass('inactive');
        };       
        var page = $('article:first');
        var height = page.height() * 2/3;
        page.css({height: '320px'});
        setTimeout(function(){
            $('#loading').addClass('inactive').fadeOut($.animationSpeed / 4);          
            $('audio').css('top',0);
            page.animate({height: height}, $.animationSpeed, 'swing', function(){
                page.css('height', 'auto');
            });        
        }, $.animationSpeed / 8);
        $(window).bind('scroll_top', function(){
            var page_top = $('body').width()*.31; 
            $.scroll_page(page_top)
        });
        if (!$('article.iblogs').length) {
            $(window).trigger('hashchange').trigger('resize');
        }
        $('.nav-pages a').live('click', function(){
            if ($(window).height() < $('section.active').height()) {
                $(window).trigger('scroll_top');
            }
        });
    });  
    
    //put a random cast member in the page header
    $(document).bind('change_header_photo', function(){
        var CAST_MEMBERS = 5;
        var random_index = Math.floor(Math.random() * CAST_MEMBERS);
        //use a cookie to make sure random number is not the same as last time
        var last_random_header = parseInt($.cookie('last_random_header'), 10);
        random_index = (last_random_header != random_index)?
            random_index: (random_index < CAST_MEMBERS - 1)? random_index + 1: 0;
        $.cookie('last_random_header', random_index, null);
        // add a class with the random index to the header 
        var header_cast = $('header .cast:first').attr('class','cast random' + random_index);
        // reapply background image scale 
        $.each(['-moz-', '-ms-', '-o-', '-webkit-', ''], function(i, browser_prefix){
            $('header .cast').css(browser_prefix + 'background-size', '100% auto');
        });
    });

    
    $(function(){
        $(document).trigger('change_header_photo');
        //add click event to change header cast photo
        var header_cast = $('header .cast');
        header_cast.click(function(){
            header_cast2 = header_cast.clone();
            $('header').append(header_cast2);
            $(document).trigger('change_header_photo');
            header_cast2.fadeOut(function(){header_cast2.remove()});
        });
        (function(date_quote){
            var url="/js/date_names.json";
            $.getJSON(url,function(data){
                var d=new Date();var mon=d.getMonth()+1;var day=d.getDate();
                var date_str=""+d.getFullYear()+"-"+(mon<10?"0":"")+mon+"-"+(day<10?"0":"")+day;
                var str=data[date_str];if(str==null||str==""){str=data.not_found}if(str==null||str==""){str="JSON Mystery"}
                date_quote.text(str).show();
            }
        )})($('blockquote:first'));
                    
    }); 
       
})(jQuery);
