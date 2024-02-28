const { createConnection } = require('../infrastructure/database');
const LoadPostsCommand = require('../app/console/loadPostsCommand');

const args = process.argv.slice(2);

async function main() {
  const conn = await createConnection();
  const command = new LoadPostsCommand(conn);
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
