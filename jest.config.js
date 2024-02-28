/** @type {import('jest').Config} */
const config = {
  // テストの独立性を保つために並列実行しない
  // データベースへのデータのセット・リフレッシュが他のテストケースに影響を与える状態になっています
  maxWorkers: 1,
};

module.exports = config;
