const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mysql = require("mysql");
const path = require("path");
const app = express();

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


const homeStartingContent = "Voluptate amet sunt cupidatat sit proident ea deserunt consectetur. Non ullamco pariatur ex ipsum occaecat ex cupidatat magna anim irure irure laborum. In consectetur Lorem consequat deserunt et nisi enim incididunt. Mollit qui culpa nisi Lorem magna qui duis non. Magna cillum proident quis velit. Et non sit eiusmod mollit consequat consectetur."
const aboutContent = "Adipisicing ea duis ad reprehenderit qui enim voluptate id ut in nulla adipisicing elit esse. Minim id ut duis cillum fugiat sit laborum officia commodo ea. Proident excepteur nostrud ad officia pariatur eiusmod excepteur duis laboris officia consequat. Cillum minim esse laborum duis. Ea aliquip tempor mollit magna. Est laborum tempor ipsum et consequat ea sit incididunt. Pariatur consectetur consequat non magna ea dolore cillum magna elit do culpa."
const contactContent = "Laborum nisi magna nisi sunt ipsum incididunt exercitation. Nostrud amet sint proident aliqua. Esse ex in ipsum dolor consequat eu ex minim aute quis. Mollit in fugiat ex mollit est. In do qui non ut elit ullamco fugiat quis."



app.get("/", (req, res) => {
    let sql_query = `SELECT * FROM posts`;

    connection.query(sql_query, (err, result, fields) => {
        if (err) throw err;
        posts = result;
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    })
});


app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    let sql_query = `INSERT into posts (title, content) VALUES ("${req.body.postTitle}", "${req.body.postBody}");`;

    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: aboutContent });
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

app.delete("/delete/:postId", (req, res) => {
    const requestedPostId = req.params.postId;

    let sql_query = `DELETE FROM posts where postID = ${requestedPostId}`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("Delete call reached with id = " + requestedPostId);
        req.method = "GET";
        res.redirect(303, "/");
    });

})

app.post("/update/:postId", (req, res) => {
    const requestedPostId = req.params.postId;


    let sql_query = `UPDATE posts set title="${req.body.postTitle}", content="${req.body.postBody}" where postID = ${requestedPostId}`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        req.method = "GET"
        res.redirect(303, "/")
    });
});





app.listen(8888, () => {
    console.log("Server started on port 8888.")
})