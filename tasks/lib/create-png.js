/**
 * grunt-svg-toolkit
 * https://github.com/iconic/grunt-svg-toolkit
 *
 * Copyright (c) 2015 Waybury, contributors
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');
var onml = require('onml');

module.exports = function (data, done) {
  var path = require('path');

  // Only make PNGs if requested
  if (!data.options.generatePNGs) {
    done(null, data);
    return;
  }

  data.page.evaluate(function(){
    var svgWidth = document.querySelector('svg').clientWidth;
    var svgHeight = document.querySelector('svg').clientHeight;

    return {width: svgWidth, height: svgHeight};
  }).then(function(result){
    var svgEl = {
      width: 1024,
      height: 1024
    };

    if (result.width && result.height) {
      svgEl.width = result.width;
      svgEl.height = result.height;
    }

    data.logger('Width x Height: ' + svgEl.width + 'x' + svgEl.height);

    data.page.property('viewportSize', {
      width: svgEl.width,
      height: svgEl.height
    });

    data.page.property('clipRect', {
      top: 0,
      left: 0,
      width: svgEl.width,
      height: svgEl.height
    });

    data.page.property('viewportSize').then(function (result) {
      data.logger('Current viewportSize size: ' + svgEl.width + 'x' + svgEl.height);
      // data.logger(result);
    });

    // Output filename
    var pngFilename = path.basename(data.file.filename, '.svg') + '.png';
    var dest = path.join(data.file.destRoot, 'png', data.file.destSubdir, pngFilename);

    // Render to file
    data.page.render(dest).then(function(dest) {
      data.logger('Generated PNG to file: ' + dest);
      done(null, data);
    });
  });



  // Update the page viewportSize and clipRect to match SVG dimensions
  // data.page.property('viewportSize', {
  //   width: svgEl.width,
  //   height: svgEl.height
  // });
  //
  // data.page.property('clipRect', {
  //   top: 0,
  //   left: 0,
  //   width: svgEl.width,
  //   height: svgEl.height
  // });

  // data.page.property('viewportSize').then(function (result) {
  //   data.logger('Current viewportSize size: ' + result.width + 'x' + result.height);
  //   data.logger(result);
  // });
};
