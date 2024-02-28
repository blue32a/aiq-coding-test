const http = require('http');
const { URL } = require('url');
const { createConnection } = require('./infrastructure/database');
const PostRepository = require('./infrastructure/postRepository');

const port = 3000;

const server = http.createServer(async (request, response) => {
  const baseURL = `http://${request.headers.host}/`;
  const url = new URL(request.url, baseURL);

  if (url.pathname === '/influencers/by-average-likes') {
    const limit = url.searchParams.get('limit') ?? 10;
    const conn = await createConnection();
    const repository = new PostRepository(conn);
    const results = await repository.findInfluencersByAverageLikes(limit);
    const data = results.map((row) => {
      return {
        id: row.influencer_id,
        likes_avg: row.likes_avg,
      };
    });
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
  } else {
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({error: 'Not Found'}));
  }
});

server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
