const URL = "https://comp4537project.herokuapp.com";
const POSTS = '/api/v1/posts/';
const USERS = '/api/v1/users/';
const LOGIN = '/api/v1/login/';
const LOGOUT = '/api/v1/logout/';
const STATS = '/api/v1/stats/';

let token;

getPosts = async () => {
    const response = await fetch(URL + POSTS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("getPosts:", await response.json());
}

createPost = async () => {
    const post = { post: "some text", token: token }
    const response = await fetch(URL + POSTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    let json = await response.json()
    console.log("createPost:", json);
    return json.postid
}

updatePost = async (postID) => {
    const post = { postID: postID, post: "updated text", token: token }
    const response = await fetch(URL + POSTS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    console.log("updatePost:", await response.json());
}

deletePost = async (postID) => {
    const post = { postID: postID, token: token }
    const response = await fetch(URL + POSTS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    console.log("deletePost:", await response.json());
}



getUsers = async () => {
    const response = await fetch(URL + USERS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("getUsers:", await response.json());
}

createUser = async () => {
    const user = { userID: "someUserID", password: "somePassword" }
    const response = await fetch(URL + USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("createUser:", await response.json());
}

updateUserPassword = async () => {
    const user = { newPassword: "somePassword", token: token }
    const response = await fetch(URL + USERS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("updateUserPassword:", await response.json());
}

deleteUser = async () => {
    const user = { token: token }
    const response = await fetch(URL + USERS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("deleteUser:", await response.json());
}

login = async () => {
    const user = { userID: "someUserID", password: "somePassword" }
    const response = await fetch(URL + LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    let json = await response.json()
    console.log("login:", json);
    return json.token;
}

logout = async () => {
    const user = { token: token }
    const response = await fetch(URL + LOGOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("logout:", await response.json());
}

getStats = async () => {
    const user = { token: token }
    const response = await fetch(URL + STATS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("getStats:", await response.json());
}

async function main() {
    await createUser();          // doesnt need a token
    await getUsers();            // doesnt need a token
    token = await login();       // doesnt need a token
    await updateUserPassword();
    await logout();

    let postID = await createPost();
    await getPosts();            // doesnt need a token
    await updatePost(postID);
    await deletePost(postID);

    await getStats();

    // await deleteUser();
    // await logout();
}

main();