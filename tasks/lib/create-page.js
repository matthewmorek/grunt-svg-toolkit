/**
 * grunt-svg-toolkit
 * https://github.com/iconic/grunt-svg-toolkit
 *
 * Copyright (c) 2015 Waybury, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (file, page, data, done) {
  if (!page) {
    var phantom = require('phantom');

    phantom.create(function (ph) {
      ph.createPage(function (newpage) {
        console.log('New PhantomJS page created: ' + newpage);

        newpage.set('onConsoleMessage', function (msg) {
          console.log('Phantom Console: ' + msg);
        });

        newpage.set('onLoadStarted', function () {
          console.log('Phantom page loading started');
        });

        newpage.set('onLoadFinished', function (status) {
          console.log('Loading finished, the page is ' + ((status === 'success') ? 'open.' : 'not open!'));
        });

        // newpage.open('about:blank', function (status) {
        //   if (status === 'success') {
        //     console.log('Phantom page opened');
        //     // console.log(page.injectJs("injectme.js") ? "... done injecting itself!" : "... fail! Check the $PWD?!");
        //   }
        //   else {
        //     console.log('Unable to open Phantom page: ' + status);
        //   }

        // });
        done(null, file, newpage, data);

      });
    }, {
      dnodeOpts: {
        weak: false
      }
    });
  }
  else {
    console.log('Using previously created PhantomJS page');
    done(null, file, page, data);
  }

};
