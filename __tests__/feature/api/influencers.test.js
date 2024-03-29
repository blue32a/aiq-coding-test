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
  describe('指定したインフルエンサーのサマリーをJSON形式で返すAPI', () => {
    async function fetchInfluencer(influencerId) {
      let url = 'http://localhost:3000/influencers/' + influencerId;
      return fetch(url);
    }
    beforeEach(async () => {
      await clearPost();
    });
    test('指定したインフルエンサーの平均いいね数、平均コメント数を取得できる', async () => {
      // Arrange
      await insertPost(createPost({
        id: '2000000000000000000',
        influencer_id: 1,
        likes: 1,
        comments: 2,
      }));
      await insertPost(createPost({
        id: '2000000000000000001',
        influencer_id: 1,
        likes: 2,
        comments: 4,
      }));
      await insertPost(createPost({
        id: '2000000000000000002',
        influencer_id: 1,
        likes: 3,
        comments: 6,
      }));
      await insertPost(createPost({
        id: '2000000000000000003',
        influencer_id: 2,
      }));

      // Act
      const data = await fetchInfluencer(1)
        .then(response => response.json());

      // Assert
      expect(data).toEqual({
        id: 1,
        likes_avg: '2.0000',
        comments_avg: '4.0000',
      });
    });
    test('指定したインフルエンサーが存在しなければ404エラーになる', async () => {
      // Arrange
      await insertPost(createPost({
        id: '2000000000000000000',
        influencer_id: 1,
      }));

      // Act
      const response = await fetchInfluencer(2);

      // Assert
      expect(response.status).toBe(404);
    });
  });
  describe('平均いいね数が多いインフルエンサー上位N件をJSON形式で返すAPI', () => {
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
    test('平均いいね数が多い順に並んだインフルエンサーのリストが取得できる', async () => {
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
  describe('平均コメント数が多いインフルエンサー上位N件をJSON形式で返すAPI', () => {
    async function fetchInfluencersByAverageComments(limit) {
      let url = 'http://localhost:3000/influencers/by-average-comments';
      if (limit) {
        url += '?limit=' + limit;
      }
      return fetch(url);
    }
    beforeEach(async () => {
      await clearPost();
    });
    test('平均コメント数が多い順に並んだinfuluencerのリストが取得できる', async () => {
      // Arrange
      await insertPost(createPost({
        id: '2000000000000000000',
        influencer_id: 1,
        comments: 10,
      }));
      await insertPost(createPost({
        id: '2000000000000000001',
        influencer_id: 1,
        comments: 2,
      }));
      await insertPost(createPost({
        id: '2000000000000000002',
        influencer_id: 2,
        comments: 8,
      }));
      await insertPost(createPost({
        id: '2000000000000000003',
        influencer_id: 2,
        comments: 8,
      }));
      await insertPost(createPost({
        id: '2000000000000000004',
        influencer_id: 3,
        comments: 10,
      }));

      // Act
      const data = await fetchInfluencersByAverageComments()
        .then(response => response.json());

      // Assert
      expect(data).toEqual([
        {id: 3, comments_avg: '10.0000'},
        {id: 2, comments_avg: '8.0000'},
        {id: 1, comments_avg: '6.0000'},
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
      const result = await fetchInfluencersByAverageComments(2)
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
      const result = await fetchInfluencersByAverageComments()
        .then(response => response.json());

      // Assert
      expect(result).toHaveLength(10);
    });
  });
  describe('インフルエンサーの投稿から名詞の使用回数の上位N件をJSON形式で返すAPI', () => {
    async function fetchInfluencerTopUsedNouns(influencerId, limit) {
      let url = 'http://localhost:3000/influencers/' + influencerId + '/top-used-nouns';
      if (limit) {
        url += '?limit=' + limit;
      }
      return fetch(url);
    }
    beforeEach(async () => {
      await clearPost();
    });
    test('投稿に使われる名詞が多い順に返す', async () => {
      // Arrange
      await insertPost(createPost({
        id: '200000000000000001',
        influencer_id: 1,
        text: '公園で猫が遊んでいる。',
      }));
      await insertPost(createPost({
        id: '200000000000000002',
        influencer_id: 1,
        text: 'その猫はよく公園に来る。',
      }));
      await insertPost(createPost({
        id: '200000000000000003',
        influencer_id: 1,
        text: '公園のベンチで本を読む。',
      }));

      // Act
      const result = await fetchInfluencerTopUsedNouns(1)
        .then(response => response.json());

      // Assert
      expect(result).toEqual([
        {noun: '公園', count: 3},
        {noun: '猫', count: 2},
        {noun: 'ベンチ', count: 1},
        {noun: '本', count: 1},
      ]);
    });
    test('クエリパラメータ limit で指定した件数を最大とする', async () => {
      // Arrange
      await insertPost(createPost({
        id: '200000000000000001',
        influencer_id: 1,
        text: '公園で猫が遊んでいる。',
      }));
      await insertPost(createPost({
        id: '200000000000000002',
        influencer_id: 1,
        text: 'その猫はよく公園に来る。',
      }));
      await insertPost(createPost({
        id: '200000000000000003',
        influencer_id: 1,
        text: '公園のベンチで本を読む。',
      }));

      // Act
      const result = await fetchInfluencerTopUsedNouns(1, 2)
        .then(response => response.json());

      // Assert
      expect(result).toHaveLength(2);
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
