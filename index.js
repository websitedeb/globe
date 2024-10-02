const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];
let user = {};
let pm = [];

io.on("connection", (socket) => {

    socket.emit("previous messages", messages);

    socket.on("chat message", (msg) => {
        messages.push(msg);
        io.emit("chat message", msg);
    });

    socket.on("server user check", (display, userData) => {
        let dn = `${display}`;
        let u = `${userData}`;
        user[dn] = u;
    });

    socket.on("request users", none => {
        let id = socket.id;
        socket.emit("send users", user);
    })

    socket.on("request private users", none => {
        let id = socket.id;
        socket.emit("send private users", user);
    })

    socket.on("private chat message", (msg, reciver) => {
        pm.push(msg);
        const reciver_decoded = user[reciver];
        io.to(reciver_decoded).emit("private chat message", msg);
    })

    socket.on("disconnect", () => {
        let keyToDelete = Object.keys(user).find(key => user[key] === socket.id);
    
        if (keyToDelete) {
            delete user[keyToDelete];
        }
    });
});

server.listen(3000, () => {
    console.log("Server is running at port 3000");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/main.html"));
});
