const { createConnection } = require('../../../infrastructure/database');
const { createPostFromCsvRow } = require('../../../domain/model/post');
const PostRepository = require('../../../infrastructure/postRepository');

let conn;

beforeAll(async () => {
  conn = await createConnection();
});
afterAll(async () => {
  await conn.end();
});


describe('インフルエンサーについてのAPI', () => {
  describe('平均いいね数が多いinfluencer上位N件をJSON形式で返すAPI', () => {
    async function fetchInfluencersByAverageLikes(limit) {
      let url = 'http://localhost:3000/influencers/by-average-likes';
      if (limit) {
        url += '?limit=' + limit;
      }
      return fetch(url);
    }
    beforeEach(async () => {
      await clearPost();
    });
    test('平均いいね数が一番多いinfuluencerが結果の最初に来る', async () => {
      // Arrange
      await insertPost(createPost({
        id: '2000000000000000000',
        influencer_id: 1,
        likes: 10,
      }));
      await insertPost(createPost({
        id: '2000000000000000001',
        influencer_id: 1,
        likes: 2,
      }));
      await insertPost(createPost({
        id: '2000000000000000002',
        influencer_id: 2,
        likes: 8,
      }));
      await insertPost(createPost({
        id: '2000000000000000003',
        influencer_id: 2,
        likes: 8,
      }));
      await insertPost(createPost({
        id: '2000000000000000004',
        influencer_id: 3,
        likes: 10,
      }));

      // Act
      const data = await fetchInfluencersByAverageLikes()
        .then(response => response.json());

      // Assert
      expect(data).toEqual([
        {id: 3, likes_avg: '10.0000'},
        {id: 2, likes_avg: '8.0000'},
        {id: 1, likes_avg: '6.0000'},
      ]);
    });
    test('クエリパラメータ limit で指定した件数を最大とする', async () => {
      // Arrange
      for (let i = 1; i <= 3; i++) {
        await insertPost(createPost({
          id: '200000000000000000' + i,
          influencer_id: i,
        }));
      }

      // Act
      const result = await fetchInfluencersByAverageLikes(2)
        .then(response => response.json());

      // Assert
      expect(result).toHaveLength(2);
    });
    test('クエリパラメータ limit が指定されない場合は 10件 を最大とする', async () => {
      // Arrange
      for (let i = 1; i <= 11; i++) {
        await insertPost(createPost({
          id: '200000000000000000' + i,
          influencer_id: i,
        }));
      }

      // Act
      const result = await fetchInfluencersByAverageLikes()
        .then(response => response.json());

      // Assert
      expect(result).toHaveLength(10);
    });
  });
});

async function clearPost() {
  return conn.query('DELETE FROM `post`');
}

async function insertPost(post) {
  return new PostRepository(conn).save(post);
}

function createPost(params) {
  return createPostFromCsvRow({
    post_id: params.id,
    influencer_id: params.influencer_id,
    shortcode: params.shortcode ?? 'AAAAAAAAAAA',
    likes: params.likes ?? 0,
    comments: params.comments ?? 0,
    thumbnail: params.thumbnail ?? 'https://placehold.jp/3d4070/ffffff/150x150.png',
    text: params.text ?? 'dummy text',
    post_date: params.post_date ?? '2023-02-27 15:10:00',
  });
}
