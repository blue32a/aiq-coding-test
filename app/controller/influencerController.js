const { URL } = require('url');
const { createConnection } = require('../../infrastructure/database');
const PostRepository = require('../../infrastructure/postRepository');

class InfluencerController {
  async listByAverageLikes(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}/`);
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
  }
  async listByAverageComments(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}/`);
    const limit = url.searchParams.get('limit') ?? 10;

    const conn = await createConnection();
    const repository = new PostRepository(conn);
    const results = await repository.findInfluencersByAverageComments(limit);
    const data = results.map((row) => {
      return {
        id: row.influencer_id,
        comments_avg: row.comments_avg,
      };
    });

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
  }
}

module.exports = InfluencerController;
