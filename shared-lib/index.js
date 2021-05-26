const { formatJSONResponse } = require('./src/apiGateway');
const { handlerPath } = require('./src/handlerResolver');
const { middyfy } = require('./src/lambda');

module.exports = {
  middyfy,
  handlerPath,
  formatJSONResponse
}