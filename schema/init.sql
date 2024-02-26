CREATE TABLE post (
  id             VARCHAR(20) PRIMARY KEY,
  influencer_id  INT UNSIGNED NOT NULL,
  shortcode      CHAR(11) NOT NULL,
  likes          INT UNSIGNED NOT NULL,
  comments       INT UNSIGNED NOT NULL,
  thumbnail      TEXT NOT NULL,
  text           TEXT NOT NULL,
  posted_at      DATETIME NOT NULL
)
