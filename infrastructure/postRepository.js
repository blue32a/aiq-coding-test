class PostRepository {
  constructor(conn) {
    this.conn = conn;
  }
  async save(post) {
    return this.conn.execute(
      'INSERT INTO `post` (id, influencer_id, shortcode, likes, comments, thumbnail, text, posted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [post.id, post.influencer_id, post.shortcode, post.likes, post.comments, post.thumbnail, post.text, post.postedAt]
    );
  }
  async findInfluencer(id) {
    return this.conn.execute(
      'SELECT influencer_id, AVG(likes) as likes_avg, AVG(comments) as comments_avg FROM `post` WHERE influencer_id = ? GROUP BY influencer_id',
      [id]
    ).then(([results]) => results[0] ?? null);
  }
  async findInfluencersByAverageLikes(limit) {
    return this.conn.execute(
      'SELECT influencer_id, AVG(likes) as likes_avg FROM `post` GROUP BY influencer_id ORDER BY likes_avg DESC LIMIT ?',
      [limit.toString()]
    ).then(([results]) => results);
  }
  async findInfluencersByAverageComments(limit) {
    return this.conn.execute(
      'SELECT influencer_id, AVG(comments) as comments_avg FROM `post` GROUP BY influencer_id ORDER BY comments_avg DESC LIMIT ?',
      [limit.toString()]
    ).then(([results]) => results);
  }
}

module.exports = PostRepository;
