const LoadPostsCommand = require('../../../../app/console/loadPostsCommand');
const { createConnection } = require('../../../../infrastructure/database');
const PostRepository = require('../../../../infrastructure/postRepository');

let conn;

beforeAll(async () => {
  conn = await createConnection();
});
afterAll(async () => {
  await conn.end();
});

describe('投稿データをデータベースに読み込む LoadPostsCommand', () => {
  beforeEach(async () => {
    await clearPost();
  });
  test('引数に与えられたCSVファイルのデータをデータベースに登録する', async () => {
    // Arrange
    const filePath = __dirname + '/data.csv';
    const args = [filePath];
    const repository = new PostRepository(conn);
    const command = new LoadPostsCommand(repository);

    // Act
    await command.run(args);

    // Assert
    const [results] = await findAllPost();

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      id: '2000000000000000000',
      influencer_id: 1,
      shortcode: 'AAAAAAAAAAA',
      likes: 100000,
      comments: 1000,
      thumbnail: 'https://placehold.jp/3d4070/ffffff/150x150.png',
      text: '「ではみなさんは、そういうふうに川だと言われたり、乳の流れたあとだと言われたりしていた、このぼんやり',
      posted_at: new Date('2023-02-10 10:05:23'),
    });
    expect(results[1]).toEqual({
      id: '2000000000000000010',
      influencer_id: 2,
      shortcode: 'BBBBBBBBBBB',
      likes: 200000,
      comments: 2000,
      thumbnail: 'https://placehold.jp/48703e/ffffff/150x150.png',
      text: '私はその人を常に先生と呼んでいた。\nだからここでもただ先生と書くだけで本名は打ち明けない。\nこれは世間を',
      posted_at: new Date('2023-02-11 20:31:08'),
    });
  });
});

async function findAllPost() {
  return conn.query(
    'SELECT * FROM `post` ORDER BY id ASC'
  );
}

async function clearPost() {
  return conn.query('DELETE FROM `post`');
}
