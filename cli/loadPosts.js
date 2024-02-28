const { createConnection } = require('../infrastructure/database');
const PostRepository = require('../infrastructure/postRepository');
const LoadPostsCommand = require('../app/console/loadPostsCommand');

const args = process.argv.slice(2);

async function main() {
  const conn = await createConnection();
  const repository = new PostRepository(conn);
  const command = new LoadPostsCommand(repository);
  await command.run(args);
}

main()
  .then(() => {
    console.log('Complete load posts!!!');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
