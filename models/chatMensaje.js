//Instancia de mensaje
class Mensaje{
    constructor(uid, nombre, mensaje){
        this.uid = uid,
        this.nombre = nombre,
        this.mensaje = mensaje
    }
}

class ChatMensaje {
    constructor(){
        this.mensaje=[];
        this.usuario={};
    }
    get obtenerUltimos10(){
        this.mensaje = this.mensaje.splice(0,10);
        return this.mensaje;
    }

    get usuariosArr(){
        return Object.values(this.usuario)
    }

    enviarMensaje(uid, nombre, mensaje){
        this.mensaje.unshift(
            new Mensaje(uid, nombre, mensaje)
        )
    }
    agregarUsuarios(usuario){
        this.usuario[usuario.id] = usuario
        return usuario
    }
    desconectarUsuario(id){ 
        delete this.usuario[id]
    }
}

export {
    ChatMensaje
}