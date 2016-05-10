/**
 * grunt-svg-toolkit
 * https://github.com/iconic/grunt-svg-toolkit
 *
 * Copyright (c) 2015 Waybury, contributors
 * Licensed under the MIT license.
 */

'use strict';

// :TODO: Use Cheerio for SVG DOM manip/parse/serialize, and to avoid
// the Phantom XMLSerializer namespace attribute mangling issue

var cheerio = require('cheerio');
var onml = require('onml');

module.exports = function (data, done) {
  data.logger('Serializing SVG');
  // :NOTE: xmlMode is important to not lowercase SVG tags
  // and attributes, like viewBox and clipPath
  var $ = cheerio.load(data.svg, {
    xmlMode: true
  });

  var svgEl = onml.parse($('svg'));

  // data.logger(onml.stringify(svgEl));

  var svg = {
    cleaned: onml.stringify(svgEl)
  };

  // Update and pass along the newly transformed SVG
  data.svg = svg.cleaned;

  done(null, data);
};
