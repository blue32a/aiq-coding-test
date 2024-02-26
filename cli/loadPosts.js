const { createConnection } = require('../src/infrastructure/database');
const LoadPosts = require('../src/commands/loadPosts');

const args = process.argv.slice(2);

async function main() {
  const conn = await createConnection();
  const command = new LoadPosts(conn);
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
