import { Socket } from "socket.io";
import { comprarTokenSocket } from "../helpers/jwt/jsonwebtok.js";
import { ChatMensaje } from "../models/chatMensaje.js";
const nuevomsj = new ChatMensaje();
export const socketController = async (socket = new Socket(), io) =>{
    //console.log(socket.handshake.headers.authorization)
    const token = socket.handshake.headers.authorization
    const usuario = await comprarTokenSocket(token);
    if(!usuario){
      return socket.disconnect()
    }
    //console.log(usuario)
    nuevomsj.agregarUsuarios(usuario)
    //console.log(mensaje.usuariosArr)
    io.emit("usuarios-activos", nuevomsj.usuariosArr);
    //console.log("Se conecto este ususario :"  + usuario.nombre)
    socket.on("disconnect", ()=>{
      nuevomsj.desconectarUsuario(usuario.id)
      io.emit("usuarios-activos", nuevomsj.usuariosArr)
    });
     
    socket.join(usuario.id)

    socket.on("enviar-mensaje",({uid, mensaje})=>{
      if(uid){
        socket.to(uid).emit("mensajes-privados",{de:usuario.nombre, mensaje})
      }else{
        nuevomsj.enviarMensaje(usuario.id,  usuario.nombre, mensaje );
        io.emit("recibir-mensajes", nuevomsj.obtenerUltimos10)
      }
    })
  };   
