del_btn = document.getElementsByTagName('button')[1];
update_btn = document.getElementsByTagName('button')[0];


let del = () => {
    console.log("DELETE")
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/delete/${del_btn.name}`, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location = "/";
        }
    }
}

let update = () => {
    const xhttp = new XMLHttpRequest();
    let end = `/update/${update_btn.name}`;
    xhttp.open("GET", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
    console.log("UPDATE")

}
del_btn.addEventListener("click", del);
update_btn.addEventListener("click", () => {
    window.location = `/update/${update_btn.name}`;
});