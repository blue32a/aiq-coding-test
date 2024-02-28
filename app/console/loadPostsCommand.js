const csv = require('csv-parser');
const fs = require('fs');
const { createPostFromCsvRow } = require('../../domain/model/post');

class LoadPostsCommand {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  async run(args) {
    const file = args[0];
    const parser = fs.createReadStream(file)
      .pipe(csv());
    for await (const row of parser) {
      const post = createPostFromCsvRow(row);
      await this.postRepository.save(post);
    }
  }
}

module.exports = LoadPostsCommand;
