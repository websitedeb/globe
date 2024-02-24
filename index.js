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

io.on("connection", (socket) => {

    socket.emit("previous messages", messages);

    socket.on("disconnect", () => {});

    socket.on("chat message", (msg) => {
        messages.push(msg);
        io.emit("chat message", msg);
    });
});

server.listen(3000, () => {
    console.log("Server is running at port 3000");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/main.html"));
});
