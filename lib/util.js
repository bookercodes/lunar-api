import _ from "lodash";

const util = {};

util.extractErrors = function(errors) {
  return _
    .uniq(errors, detail => detail.path)
    .map(detail => ({
      path: detail.path,
      message: detail.message
    }));
};
export default util;
