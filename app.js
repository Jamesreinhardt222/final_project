require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mysql = require("mysql");
const path = require("path");
const app = express();

const api_endpoint = "/API/V1"
let user = {};


console.log(process.env.SECRET);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-length, X-Requested-With");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: '192.168.64.3',
    user: "user1",
    password: "123456",
    database: "webdev2"
});


const homeStartingContent = "Welcome to the Internet Software Architecture Blog Site!!."
const aboutContent = "This is a site designed to demonstrate superior web architecture and CRUD technology."
const contactContent = "You can contact us by emailing the dean of BCIT.  He knows our number."


let logged_in = false;


app.get("/", (req, res) => {

    if (logged_in) {
        let sql_query = `SELECT * FROM posts join UserPosts on (posts.postID = UserPosts.postID) where UserPosts.userID = ${user.userID}`;
        connection.query(sql_query, (err, result, fields) => {
            if (err) throw err;
            posts = result;
            res.render("home", {
                startingContent: homeStartingContent,
                posts: posts
            });
        })
    } else {
        res.render("login", { message: "" });
    }
});


app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post(api_endpoint + "/compose", (req, res) => {
    let sql_query = `INSERT into posts (title, content) VALUES ("${req.body.postTitle}", "${req.body.postBody}");`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
    });
    // let second_sql_query = "SELECT LAST_INSERT_ID() from posts ORDER BY postID DESC LIMIT 0,1; Set @num := LAST_INSERT_ID(); "
    let second_sql_query = `INSERT into UserPosts (userID, postID) VALUES ("${user.userID}", LAST_INSERT_ID());`;
    connection.query(second_sql_query, (err, result) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
});

app.get("/posts/:postId", (req, res) => {
    const requestedPostId = req.params.postId;
    let sql_query = `SELECT * FROM posts where postID = ${requestedPostId}`;

    connection.query(sql_query, (err, result, fields) => {
        if (err) throw err;
        let post = result[0];
        res.render("post", {
            title: post.title,
            content: post.content,
            postId: post.postID
        });
    });
});


app.get("/update/:postId", (req, res) => {
    const requestedPostId = req.params.postId;
    let sql_query = `SELECT * FROM posts where postID = ${requestedPostId}`;

    connection.query(sql_query, (err, result, fields) => {
        if (err) throw err;
        let post = result[0];
        res.render("update", {
            title: post.title,
            content: post.content,
            postId: post.postID
        });
    });
});

app.delete(api_endpoint + "/delete/:postId", (req, res) => {
    const requestedPostId = req.params.postId;

    let sql_query = `DELETE FROM posts where postID = ${requestedPostId}`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("Delete call reached with id = " + requestedPostId);
        req.method = "GET";
        res.redirect(303, "/");
    });

})

app.post(api_endpoint + "/update/:postId", (req, res) => {
    const requestedPostId = req.params.postId;

    let sql_query = `UPDATE posts set title="${req.body.postTitle}", content="${req.body.postBody}" where postID=${requestedPostId};`;
    // 'UPDATE posts set title="Dogs", content="I love Hyenas, but I love lions more" where postID = 27"'
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        req.method = "GET"
        res.redirect(303, "/")
    });
});

app.get("/logout", (req, res) => {
    logged_in = false;
    res.redirect("/");
})


app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    let sql_query = `INSERT into Users (email, hashedPassword) VALUES ("${req.body.username}", "${req.body.password}");`;

    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        logged_in = true
        res.redirect("/");
    });
});

app.post("/login", (req, res) => {
    let sql_query = `SELECT * from Users where email = "${req.body.username}";`;

    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            if (result[0]["hashedPassword"] == req.body.password) {
                logged_in = true;
                user = result[0];
                res.redirect("/");
            } else {
                res.render("login", {
                    message: "Incorrect email or password."
                })
            }
        };
    });
});


app.listen(8888, () => {
    console.log("Server started on port 8888.")
})