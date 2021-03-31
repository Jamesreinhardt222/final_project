require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mysql = require("mysql");
const path = require("path");
const app = express();
const fetch = require("node-fetch");
const URL = "https://comp4537project.herokuapp.com";
const POSTS = '/api/v1/posts/';
const USERS = '/api/v1/users/';
const LOGIN = '/api/v1/login/';
const LOGOUT = '/api/v1/logout/';
const STATS = '/api/v1/stats/';

const api_endpoint = "/API/V1"
let user = {};
let token = ""


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
const passwordContent = "Change your password."

let logged_in = false;


app.get("/", async (req, res) => {

    if (logged_in) {
        const response = await fetch(URL + POSTS, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        let posts = []
        let res_obj = await response.json();
        for (let i = 0; i < res_obj.length; i++) {
            if (res_obj[i].userid == user.userID) {
                posts.push(res_obj[i]);
            }
        }

        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });

    } else {
        res.render("login", { message: "" });
    }
});

app.get("/compose", (req, res) => {
    res.render("compose");
});


app.post(api_endpoint + "/compose", async (req, res) => {
    const post = { title: `${req.body.postTitle}`, post: `${req.body.postBody}`, token: token }
    const response = await fetch(URL + POSTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    let json = await response.json()
    console.log("createPost:", json);
    res.redirect("/");

});

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});


app.get("/editPassword", (req, res) => {
    res.render("changePassword", { passwordContent: passwordContent })
})

app.post("/API/V1/updatePassword", async (req, res) => {
    const user = { newPassword: req.body.newPassword, token: token }
    const response = await fetch(URL + USERS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    let json = await response.json()
    console.log("updateUserPassword:", await response.json());
    if (json.result != "FAILED") {
        res.redirect("/")
    } else {
        res.send("FAILED TO UPDATE PASSWORD");
    }
})

app.get("/posts/:postId", async (req, res) => {
    const requestedPostId = req.params.postId;
    const response = await fetch(URL + POSTS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    let posts = []
    let res_obj = await response.json();
    for (let i = 0; i < res_obj.length; i++) {
        if (`${res_obj[i].postid}` == requestedPostId) {
            posts.push(res_obj[i]);
        }
    }
    post = posts[0]
    res.render("post", {
        title: post.title,
        content: post.post,
        postId: post.postid
    });
});


app.get("/update/:postId", async (req, res) => {
    const requestedPostId = req.params.postId;
    const response = await fetch(URL + POSTS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    let posts = []
    let res_obj = await response.json();
    for (let i = 0; i < res_obj.length; i++) {
        if (res_obj[i].postid == requestedPostId) {
            posts.push(res_obj[i]);
        }
    }
    post = posts[0]
    res.render("update", {
        title: post.title,
        content: post.post,
        postId: post.postid
    });
});

app.delete(api_endpoint + "/delete/:postId", async (req, res) => {
    const requestedPostId = req.params.postId;

    const post = { postID: requestedPostId, token: token }
    const response = await fetch(URL + POSTS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    console.log("deletePost:", await response.json());
    req.method = "GET";
    res.redirect(303, "/");
});

app.post(api_endpoint + "/update/:postId", async (req, res) => {
    const requestedPostId = req.params.postId;

    const post = { postID: requestedPostId, title: `${req.body.postTitle}`, post: `${req.body.postBody}`, token: token }
    const response = await fetch(URL + POSTS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    console.log("updatePost:", await response.json());
    res.redirect(303, "/");
});

app.get("/logout", (req, res) => {
    logged_in = false;
    res.redirect("/");
})


app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", async (req, res) => {
    const user = { userID: req.body.username, password: req.body.password }
    const response = await fetch(URL + USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("createUser:", await response.json());
    res.redirect("/");
});


app.post("/login", async (req, res) => {

    user = { userID: req.body.username, password: req.body.password }
    const response = await fetch(URL + LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })


    let json = await response.json()
    console.log("login:", json);

    if (json.result != "FAILED") {
        console.log("login:", json);
        logged_in = true;
        res.redirect("/");
        token = json.token;
    } else {
        res.send("Login Failed");
    }
});


app.listen(8888, () => {
    console.log("Server started on port 8888.")
})