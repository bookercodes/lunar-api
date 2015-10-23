import isEmpty from "lodash.isempty";

export default {
  create: function(req, res) {
    if (isEmpty(req.body)) {
      return res.sendStatus(400);
    }
    return res.sendStatus(201);
  }
};
