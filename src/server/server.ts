import { config } from "dotenv";
config();
import express from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
const app = express();
const http = require("http").createServer(app);
const io = new Server(http);

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "../client/views");
app.use(express.static("../client"));

app.get("/", (_, res) => {
  res.render("index");
});

io.on("connection", (socket: Socket) => {
  console.log("User Connected");
  socket.emit("connection", socket.connected);
});

http.listen(PORT, () => console.log(`http://localhost:${PORT}`));
