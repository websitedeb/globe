const tbx = document.getElementById("tbx");
const dnt = document.getElementById("dnt");
const btn = document.getElementById("btn");
const box = document.getElementById("box");

const tbxp = document.getElementById("tbx-p");
const dntp = document.getElementById("dnt-p");
const btnp = document.getElementById("btn-p");
const boxp = document.getElementById("box2");

const save = document.getElementById("save");
const no = document.getElementById("stop");

let granted;

const socket = io();

socket.on("previous messages", (previousMessages) => {
    previousMessages.forEach(msg => {
        const p = document.createElement("p");
        p.textContent = msg;
        box.appendChild(p);
    });
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    const displayName = dnt.value.trim();
    const message = tbx.value.trim();
    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    const day = new Date().getDay();
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    if (!displayName || !message) {
        alert("Please fill out both the Displayname and Message fields.");
        return;
    }
    
    const formattedMessage = `[${displayName}] (${day} ${date}/${month}/${year} ${hour}:${mins}): ${message}`;
    const user = socket.id;
    console.log(user)
    socket.emit("chat message", formattedMessage);
    socket.emit("server user check", displayName, user);
    
    tbx.value = "";
});

socket.on("chat message", (msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    box.appendChild(p);
    if(granted){
        new Notification("GyroGlobe", {
            body: msg
        })
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

btnp.addEventListener("click", (e) => {
    e.preventDefault();

    const displayName = dnt.value.trim();
    const userdisplay = dntp.value.trim();
    const message = tbxp.value.trim();
    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    const day = new Date().getDay();
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    if(!displayName && !message && !userdisplay){
        alert("Please fill out both the Recivers Display Name and Message fields and Displayname.");
        return;
    }    

    const formattedMessage = `[${displayName}] (${day} ${date}/${month}/${year} ${hour}:${mins}): ${message}`;
    const user = socket.id;
    socket.emit("private chat message", formattedMessage, userdisplay);
    socket.emit("server user check", displayName, user);
    
    tbxp.value = "";
});

socket.on("private chat message", (msg) => {
    const pp = document.createElement("p");
    pp.textContent = msg;
    boxp.appendChild(pp);
    if(granted){
        new Notification("GyroGlobe", {
            body: msg
        })
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", (e) => {
    save.addEventListener("click", async (e) => {
        e.preventDefault();

        await Notification.requestPermission().then((res) => {
           switch(res){
            case "granted":
                granted = true;
                console.log("granted");
                break;
            case "default":
                console.log("default");
                break;
            case "denied":
                granted = false;
                console.log("denied");
                break;
            default:
                console.log("none");
                break;
            }
        })
        .catch((err) => {
            console.log(err)
        })
    });

    no.addEventListener("click", (e) => {
        e.preventDefault();

        granted = false;
    });
});
