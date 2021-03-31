

CREATE TABLE Users (
    userID varchar(255) NOT NULL PRIMARY KEY,
    hashedPassword varchar(255) NOT NULL,
    token varchar(255)
);

CREATE TABLE Posts (
    postID int NOT NULL PRIMARY KEY,
    userID varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    post varchar(65535) NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Stats (
    statID int NOT NULL PRIMARY KEY,
    method varchar(255) NOT NULL,
    endpoint varchar(255) NOT NULL,
    requests int NOT NULL
);