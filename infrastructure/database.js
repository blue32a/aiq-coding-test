const mysql = require('mysql2/promise');

async function createConnection() {
  return mysql.createConnection({
    host: 'mysql',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

exports.createConnection = createConnection;
