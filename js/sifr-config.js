/*****************************************************************************
It is adviced to place the sIFR JavaScript calls in this file, keeping it
separate from the `sifr.js` file. That way, you can easily swap the `sifr.js`
file for a new version, while keeping the configuration.

You must load this file *after* loading `sifr.js`.

That said, you're of course free to merge the JavaScript files. Just make sure
the copyright statement in `sifr.js` is kept intact.
*****************************************************************************/

var century = { src: '/flash/20century.swf' };
var aachen = { src: '/flash/aachen.swf' };

// sIFR.useStyleCheck = true;

sIFR.activate(century, aachen);

// iSNAPS page

sIFR.replace(century, {
  selector: '.snaps_caption p',
  wmode: 'transparent',
  css: '.sIFR-root {color: #394c8c; text-align: center; font-size:14px;}'
});

  
//FLEX PROMOS
sIFR.replace(aachen, {
  selector: '.purple .pretty_item_box_title',
  css: '.sIFR-root {color: #9041a1;font-size:14px; }'
});

sIFR.replace(aachen, {
  selector: '.pink .pretty_item_box_title',
  css: '.sIFR-root {color: #ED1F8F;font-size:14px; }'
});

sIFR.replace(aachen, {
  selector: '.red .pretty_item_box_title',
  css: '.sIFR-root {color: #ff3b42;font-size:15px;line-height:.5em; }'
});

sIFR.replace(aachen, {
  selector: '.orange .pretty_item_box_title',
  css: '.sIFR-root {color: #FF6F00;font-size:14px; }'
});

sIFR.replace(aachen, {
  selector: '.blue .pretty_item_box_title',
  css: '.sIFR-root {color: #384B8B;font-size:14px;line-height:.5em; }'
});

sIFR.replace(aachen, {
  selector: '.green .pretty_item_box_title',
  css: '.sIFR-root {color: #315f2e;font-size:14px; }'
});