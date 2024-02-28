class ErrorController {
  error404(_request, response) {
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({error: 'Not Found'}));
  }
}

module.exports = ErrorController;
