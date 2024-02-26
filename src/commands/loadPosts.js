const csv = require('csv-parser');
const fs = require('fs');

class LoadPosts {
  constructor(conn) {
    this.conn = conn;
  }
  async run(args) {
    const file = args[0];
    const parser = fs.createReadStream(file)
      .pipe(csv());
    for await (const row of parser) {
      await this._insert(row);
    }
  }
  async _insert(row) {
    await this.conn.execute(
      'INSERT INTO `post` (id, influencer_id, shortcode, likes, comments, thumbnail, text, posted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [row.post_id, row.influencer_id, row.shortcode, row.likes, row.comments, row.thumbnail, row.text, row.post_date]
    );
  }
}

module.exports = LoadPosts;
