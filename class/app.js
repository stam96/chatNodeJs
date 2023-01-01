import express from "express";
import { createServer } from "http";
import {Server as ServidorIo} from "socket.io";
import cors from "cors"
import * as dotenv from 'dotenv'
import { dbConexion } from "../database/db.js";
import { login, registro } from "../routes/index.js";
import { socketController } from "../socket/controllerSocket.js";
dotenv.config()
export class Server {
  constructor() {
    //Express
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = new ServidorIo(this.server);
    //db
    this.db();
    //Middleware
    this.middleware();
    //ruta
    this.rutas();
    this.sockets();
  }
  middleware() {
    this.app.use(cors())
    this.app.use(express.json());
    this.app.use(express.static("public"))
  }
  async db() {
    await dbConexion();
  }
  rutas() {
    this.app.use("/api/v1", registro);
    this.app.use("/api/v1", login);
  }
  sockets(){
    this.io.on("connection",(socket)=> socketController(socket, this.io))
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log("Escuchando puerto " + this.port);
    });
  }
}
