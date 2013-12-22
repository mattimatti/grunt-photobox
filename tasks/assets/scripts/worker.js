/**
 * getHighlightColor converts a given hex color value
 * into an array with color values
 * @param  {String} hexValue  a string like '#fff000'
 * @return {Array}            Array with r, g, and b value
 */
function getHighlightColor( hexValue ) {
  'use strict';

  if ( /^#([A-Fa-f0-9]{6})$/.test( hexValue ) ) {
    // @link http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers
    var hex = parseInt(hexValue.substring(1), 16),
        r = (hex & 0xff0000) >> 16,
        g = (hex & 0x00ff00) >> 8,
        b = hex & 0x0000ff;

    return [r, g, b];
  } else {
    // Fallback to red
    console.warn( 'no valid hex color value provided' );
    return [ '250', '0', '0' ];
  }
}


/**
 * [diff description]
 * @param  {Object} pixelsA ImageData Object with pixel data information
 * @param  {Object} pixelsB ImageData Object with pixel data information
 * @param  {Object} config  Object to define the highlight color and a threshold value
 * @return {Object}         ImageData Object with pixel data information
 */
function diff( pixelsA, pixelsB, config ) {
  'use strict';

  var pixelsC = pixelsA,
      length = pixelsA.data.length,
      diffAmount = 0,
      threshold = ~~config.threshold,
      color = getHighlightColor ( config.higlightcolor ),
      i;


  for ( i = 0; i < length; i += 4 ) {
    if (
         Math.abs( pixelsA.data[i]     - pixelsB.data[i]) > threshold &&
         Math.abs( pixelsA.data[i + 1] - pixelsB.data[i + 1] ) > threshold &&
         Math.abs( pixelsA.data[i + 2] - pixelsB.data[i + 2]  )> threshold
       )
    {
      pixelsC.data[i]     = color[0]; // r
      pixelsC.data[i + 1] = color[1]; // g
      pixelsC.data[i + 2] = color[2]; // b
      diffAmount++;
    }
  }

  var diffResult = {
    amount : diffAmount,
    imageData : pixelsC
  };

  return diffResult;
}


var onmessage = function( event ) {
  'use strict';
  var data = event.data;
  var result = diff( data.a, data.b, data.config );
  postMessage( result );
};

