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

socket.on("send users", (users) => {
    let displayName = dnt.value.trim();
    let i = 1;
    
    if(users) {
        Object.keys(users).forEach(key => {
            if (displayName === key && users[key] !== socket.id) { 
                displayName = displayName + i;  
                i++;
            }
        });
    }

    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    const day = new Date().getDay();
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    const message = tbx.value.trim();
    const formattedMessage = `[${displayName}] (${day} ${date}/${month}/${year} ${hour}:${mins}): ${message}`;
    const user = socket.id;

    socket.emit("chat message", formattedMessage);
    socket.emit("server user check", displayName, user);

    tbx.value = "";
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    const displayName = dnt.value.trim();
    const message = tbx.value.trim();
    
    if (!displayName || !message) {
        alert("Please fill out both the Displayname and Message fields.");
        return;
    }

    socket.emit("request users", {});
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

socket.on("send private users", users => {
    let displayName = dnt.value.trim();
    let userdisplay = dntp.value.trim();
    let i = 1;

    if (users) {
        Object.keys(users).forEach(key => {
            if (displayName === key && users[key] !== socket.id) {
                displayName = displayName + i;
                i++;
            }
        });
    }

    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    const day = new Date().getDay();
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    const message = tbxp.value.trim();
    const formattedMessage = `[${displayName}] (${day} ${date}/${month}/${year} ${hour}:${mins}): ${message}`;
    const user = socket.id;

    socket.emit("private chat message", formattedMessage, userdisplay);
    socket.emit("server user check", displayName, user);

    tbxp.value = "";
});

btnp.addEventListener("click", (e) => {
    e.preventDefault();

    const displayName = dnt.value.trim();
    const userdisplay = dntp.value.trim();
    const message = tbxp.value.trim();

    if (!displayName || !message || !userdisplay) {
        alert("Please fill out both the Receiver's Display Name, Message fields, and your Display Name.");
        return;
    }

    socket.emit("request private users", {});
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
                break;
            case "default":
                break;
            case "denied":
                granted = false;
                break;
            default:
                break;
            }
        })
        .catch((err) => {
            console.error(err);
        })
    });

    no.addEventListener("click", (e) => {
        e.preventDefault();
        granted = false;
    });
});
