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

  var $ = cheerio.load(data.svg, {
    xmlMode: true
  });

  var svgEl = $('svg');

  data.logger(onml.stringify(svgEl.get(0)));

  var svg = {
    width: svgEl.get(0).clientWidth,
    height: svgEl.get(0).clientHeight
  }

  data.logger('Width x Height: ' + svg.width + 'x' + svg.height);

  // Update the page viewportSize and clipRect to match SVG dimensions
  data.page.property('viewportSize', {
    width: svg.width,
    height: svg.height
  });

  data.page.property('clipRect', {
    top: 0,
    left: 0,
    width: svg.width,
    height: svg.height
  });

  // Output filename
  var pngFilename = path.basename(data.file.filename, '.svg') + '.png';
  var dest = path.join(data.file.destRoot, 'png', data.file.destSubdir, pngFilename);

  // data.page.property('viewportSize').then(function (result) {
  //   data.logger('Current viewportSize size: ' + result.width + 'x' + result.height);
  //   data.logger(result);
  // });

  // Render to file
  data.page.render(dest).then(function(dest) {
    data.logger('Generated PNG to file: ' + dest);
    done(null, data);
  });
};
