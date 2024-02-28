const tbx = document.getElementById("tbx");
const dnt = document.getElementById("dnt");
const btn = document.getElementById("btn");
const box = document.getElementById("box");

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
    socket.emit("chat message", formattedMessage);
    
    tbx.value = "";
});

socket.on("chat message", (msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    box.appendChild(p);
});
