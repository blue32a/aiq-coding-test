const { URL } = require('url');
const { createConnection } = require('../../infrastructure/database');
const PostRepository = require('../../infrastructure/postRepository');
const { buildAnalyser } = require('../../infrastructure/morphologicalAnalyser');

class InfluencerController {
  async _createRepository() {
    const conn = await createConnection();
    return new PostRepository(conn);
  }
  async index(request, response, args) {
    const repository = await this._createRepository();
    const results = await repository.findInfluencer(args.id);
    if (results) {
      const data = {
        id: results.influencer_id,
        likes_avg: results.likes_avg,
        comments_avg: results.comments_avg,
      }
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(data));
    } else {
      response.writeHead(404, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({error: 'Not Found'}));
    }
  }
  async listByAverageLikes(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}/`);
    const limit = url.searchParams.get('limit') ?? 10;

    const repository = await this._createRepository();
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

    const repository = await this._createRepository();
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
  async topUsedNouns(request, response, args) {
    const repository = await this._createRepository();
    const posts = await repository.findByInfluencer(args.id);

    const text = posts.reduce((acc, post) => acc + post.text, '');
    const nounCounts = await this._countNouns(text);

    const url = new URL(request.url, `http://${request.headers.host}/`);
    const limit = url.searchParams.get('limit') ?? 10;
    const data = Array.from(nounCounts.entries())
      .map(([noun, count]) => ({noun, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
  }
  async _countNouns(text) {
    const analyser = await buildAnalyser();
    const results = analyser.analyse(text);

    const nounCounts = new Map();
    for (const result of results) {
      if (result.pos === '名詞') {
        const count = nounCounts.get(result.surface_form) ?? 0;
        nounCounts.set(result.surface_form, count + 1);
      }
    }
    return nounCounts;
  }
}

module.exports = InfluencerController;
