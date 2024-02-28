class Post {
  constructor(id) {
    this.id = id;
  }
}

function createPostFromCsvRow(row) {
  const post = new Post(row.post_id);
  post.influencer_id = row.influencer_id;
  post.shortcode = row.shortcode;
  post.likes = row.likes;
  post.comments = row.comments;
  post.thumbnail = row.thumbnail;
  post.text = row.text;
  post.postedAt = new Date(row.post_date);
  return post;
}

module.exports = {
  createPostFromCsvRow
};
