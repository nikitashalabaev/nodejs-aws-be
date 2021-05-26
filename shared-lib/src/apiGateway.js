module.exports = {
  formatJSONResponse: ({
    statusCode = 200,
    response,
  }) => {
    return {
      statusCode,
      body: JSON.stringify(response)
    }
  }
};
