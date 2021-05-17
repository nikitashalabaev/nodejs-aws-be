const middy = require("@middy/core");
const cors = require("@middy/cors");
const middyJsonBodyParser = require("@middy/http-json-body-parser");

module.exports = {
  middyfy: (handler) => {
    return middy(handler).use(middyJsonBodyParser()).use(cors());
  }
};
