import _ from "lodash";

const util = { };

util.extractErrors = function(errors) {
  return _
    .uniq(errors, detail => detail.path)
    .map(detail => detail.message);
};

export default util;
