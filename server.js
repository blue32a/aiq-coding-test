const http = require('http');
const router = require('./router');

const port = 3000;

const server = http.createServer(async (request, response) => {
  await router.route(request, response);
});

server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
