/**
 * grunt-svg-toolkit
 * https://github.com/iconic/grunt-svg-toolkit
 *
 * Copyright (c) 2015 Waybury, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (data, done) {
  var path = require('path');

  if (data.options.generatePNGs == true){
    var dest = path.join(data.file.destRoot, 'svg', data.file.destSubdir, data.file.filename);
  } else {
    var dest = path.join(data.file.destRoot, data.file.destSubdir, data.file.filename);
  }

  data.logger('Saving SVG file: ' + dest);

  data.grunt.file.write(dest, data.svg);

  done(null, data);
};
