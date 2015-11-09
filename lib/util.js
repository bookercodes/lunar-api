"use strict";

const _ = require("lodash");

const util = { };

util.extractErrors = function(errors) {
  return _
    .uniq(errors, detail => detail.path)
    .map(detail => detail.message);
};

module.exports = util;
