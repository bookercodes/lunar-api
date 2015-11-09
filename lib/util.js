import _ from "lodash";

export function extractErrors(errors) {
  return _
    .uniq(errors, detail => detail.path)
    .map(detail => detail.message);
}
