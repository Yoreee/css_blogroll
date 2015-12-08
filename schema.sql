DROP TABLE IF EXISTS posts;


CREATE TABLE posts (
	id integer PRIMARY KEY AUTOINCREMENT,
	title varchar,
	content varchar
);

INSERT INTO posts (title, content) VALUES ('first post', 'this is the first post!');