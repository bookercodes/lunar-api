import _ from "lodash";

const util = { };

util.extractErrors = function(errors) {
  return _
    .uniq(errors, detail => detail.path);
};
export default util;
