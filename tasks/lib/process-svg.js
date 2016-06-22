/**
 * grunt-svg-toolkit
 * https://github.com/iconic/grunt-svg-toolkit
 *
 * Copyright (c) 2015 Waybury, contributors
 * Licensed under the MIT license.
 */

'use strict';

var async = require('async');
var cheerio = require('cheerio');
const createDOMpurify = require('dompurify');
const jsdom = require('jsdom');

module.exports = function (data, done) {
  data.logger('Processing SVG');

  // Parse the SVG into a cheerio object
  function ingestSvg(callback) {

    // :NOTE: xmlMode is important to not lowercase SVG tags
    // and attributes, like viewBox and clipPath
    var $ = cheerio.load(data.svg, {
      xmlMode: true
    });

    callback(null, $, data);
  }

  function sanitizeSvg ($, data, callback) {
    var window = jsdom.jsdom('', {
      features: {
        FetchExternalResources: false, // disables resource loading over HTTP / filesystem
        ProcessExternalResources: false // do not execute JS within script blocks
      }
    }).defaultView;

    const DOMPurify = createDOMpurify(window);
    // Add a hook to post-process a sanitized SVG
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
      // Fix namespaces added by Adobe Illustrator
      node.removeAttribute('enable-background');
      if (node.tagName === 'svg') {
        node.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        node.setAttribute('version', '1.1');
      }
      if (node.id === 'adobe_illustrator_pgf') {
        node.parentNode.removeChild(node);
      }
    });

    var svgEl = DOMPurify.sanitize($.xml(), {ADD_TAGS: ['filter']});

    // Remove partial XML comment left in the HTML
    var badTag  = svgEl.indexOf(']&gt;');
    var svgClean = svgEl.substring(badTag < 0 ? 0 : 5, svgEl.length);

    callback(null, svgClean);
  }

  async.waterfall([
    ingestSvg,
    // require('./svg/sanitize'),
    require('./svg/remove-comments'),
    require('./svg/add-dimensions-from-viewbox'),
    require('./svg/ids-to-classes'),
    sanitizeSvg
  ], function (err, svg) {
    // Save the now processed SVG content, removing any blank lines
    data.svg = svg.replace(/^\s*[\r\n]/gm, '');

    done(null, data);
  });

};
