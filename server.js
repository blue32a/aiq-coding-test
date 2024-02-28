const http = require('http');
const { URL } = require('url');
const { createConnection } = require('./infrastructure/database');

const port = 3000;

const server = http.createServer(async (request, response) => {
  const baseURL = `http://${request.headers.host}/`;
  const url = new URL(request.url, baseURL);

  if (url.pathname === '/influencers/by-average-likes') {
    const limit = url.searchParams.get('limit') ?? 10;
    const conn = await createConnection();
    const [results] = await conn.execute(
      'SELECT influencer_id, AVG(likes) as likes_avg FROM `post` GROUP BY influencer_id ORDER BY likes_avg DESC LIMIT ?',
      [limit.toString()]
    );
    console.log(results);
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
