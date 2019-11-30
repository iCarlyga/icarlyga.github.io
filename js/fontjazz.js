/*

FontJazz 1.2

http://www.fontjazz.com

(C) Copyright Rasmus Schultz, all rights reserved.

Free for use on all private/commercial websites. You may not
sell this script or FontJazz-generated fonts. Removing this
copyright statement is a violation of the licensing terms.

*/

var FontJazz = {
	
	_fonts: {},
	
	_initialized: false,
	
	_css: null,
	
	_initialize: function() {
		
		for (var fontname in FontJazz._fonts) {
			
			if (!FontJazz._fonts[fontname].initialized) {
				
				var image = FontJazz._fonts[fontname].image;
				var height = FontJazz._fonts[fontname].height;
				
        FontJazz._addRule(
          ".FontJazz-" + fontname + " div",
          "float:left; display:inline; overflow:visible;"
        );
        
				FontJazz._addRule(
					".FontJazz-" + fontname + " span",
					"display:block; float:left; background-image:url(" + image + "); height:" + height + "px;"
				);
				
				FontJazz._addRule(
					".FontJazz-" + fontname + " br",
					"clear:both;"
				);
				
				FontJazz._fonts[fontname].initialized = true;
				
			}
			
		}
		
	},
	
	_addRule: function(selector, rule) {
		
		if (!FontJazz._css) {
			if (document.createStyleSheet) {
				FontJazz._css = document.createStyleSheet();
			} else {
				FontJazz._css = document.createElement('style');
				FontJazz._css.setAttribute('type', 'text/css');
				document.getElementsByTagName("head")[0].appendChild(FontJazz._css);
			}
		}
		
		if (FontJazz._css.addRule) {
			FontJazz._css.addRule(selector, rule);
		} else {
			FontJazz._css.appendChild( document.createTextNode(selector + ' { ' + rule + " }\n") );
		}
		
	},
	
	register: function(fontname, data) {
		FontJazz._fonts[fontname] = data;
		FontJazz.initialized = false;
	},
	
	transform: function(element, fontname) {
		
		if (!document.styleSheets) return;
		
		if (!FontJazz.initialized) FontJazz._initialize();
		
		var font = FontJazz._fonts[fontname];
		var text = element.firstChild.nodeValue + ' ';
		
		var div = document.createElement('div');
		div.className = "FontJazz-" + fontname;
		
		var html = '<span style="overflow:hidden; width:0px;">' + text + '</span>';
		var adjust = font[text.charAt(0)][2];
		
    var word = '', w = 0, wm = 0;
		for (var i=0; i<text.length; i++) {
			var c = text.charAt(i), metrics = font[c];
			if (metrics) {
        w += metrics[1]+(adjust-metrics[2]);
        if (word == '') wm = adjust-metrics[2];
        word += '<span style="' + (word == '' ? '' : 'margin-left: ' + (adjust-metrics[2]) + 'px;') + 'background-position: -' + metrics[0] + 'px 0px; width: ' + metrics[1] + 'px;"></span>';
        if (c == ' ') {
          html += '<div style="margin-left:' + wm + 'px; width:' + (w-wm) + 'px;">' + word + '</div>';
          word = ''; w = 0; wm = 0;
        }
        adjust = metrics[3]-metrics[1] + 1;
			}
		}
		
		div.innerHTML = html + "<br />";
		
		element.parentNode.insertBefore(div, element);
		element.parentNode.removeChild(element);
		
	},
	
	apply: function(tagname, fontname, rootnode) {
		
		var collection = (rootnode || document.body).getElementsByTagName(tagname);
		
		var elements = new Array();
		
		for (var i=0; i<collection.length; i++)
			elements[i] = collection[i];
		
		for (var i=0; i<elements.length; i++)
			FontJazz.transform(elements[i], fontname);
		
	}
	
}