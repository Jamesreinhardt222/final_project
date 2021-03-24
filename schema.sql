CREATE table posts(
	postID int AUTO_INCREMENT,
    title varchar(1000),
	content varchar(1000),
	PRIMARY KEY(postID)
);

INSERT INTO posts (title, content) 
VALUES ("First Post here", 
"Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah.... Blah Blah Blah");