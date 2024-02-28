const csv = require('csv-parser');
const fs = require('fs');
const { createPostFromCsvRow } = require('../../domain/model/post');

class LoadPostsCommand {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  async run(args) {
    console.log('Load started...');

    const file = args[0];
    const parser = fs.createReadStream(file)
      .pipe(csv());
    let counter = 0;
    for await (const row of parser) {
      const post = createPostFromCsvRow(row);
      await this.postRepository.save(post);

      counter++;
      if (counter % 50 === 0) console.log(`Loaded ${counter} posts`);
    }

    console.log('Complete load posts!!!');
  }
}

module.exports = LoadPostsCommand;
