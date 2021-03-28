CREATE table posts(
	postID int AUTO_INCREMENT,
    title varchar(1000),
	content varchar(1000),
	PRIMARY KEY(postID)
);

INSERT INTO posts (title, content) 
VALUES ("First Post here", 
"Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah.... Blah Blah Blah");



CREATE TABLE Users (
    userID int AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    hashedPassword varchar(255) NOT NULL,
    PRIMARY KEY(userID)
);


CREATE TABLE UserPosts (
    id int AUTO_INCREMENT,
    userID int NOT NULL REFERENCES Users(userID),
    postID int NOT NULL REFERENCES Posts(postID),
    PRIMARY KEY(id)
);