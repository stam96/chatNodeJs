//const socket = io()

let usuario = null;
let socket = null;

//Refrencias chat html
//txtUid
//txtMensaje
//ulUsuarios
//ulMensajes
//btnSalir

const txtUid = document.querySelector("#txtUid")
const txtMensaje = document.querySelector("#txtMensaje")
const ulUsuarios = document.querySelector("#ulUsuarios")
const ulMensajes = document.querySelector("#ulMensajes")
const btnSalir = document.querySelector("#btnSalir")

const validarJwt = async()=>{
    const token = localStorage.getItem("token") || "";
    
    if(token.length <=10){
        window.location = "index.html";
        throw new Error("No hay token en el servidor");
    }

    //console.log(token)

    const resp = await fetch("https://chatnodejs-production-3e03.up.railway.app/api/v1/auth", {
        method:"GET",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            "Authorization": `Bearer ${token}`
        }
    })

    const {usuario:userDb, token:tokenDb} = await resp.json();
    localStorage.setItem("token", tokenDb)
    usuario = userDb
    document.title = usuario.nombre
    await conectarSocket();
}

const conectarSocket = async()=>{
    //Configuracion para enviar el token
    socket = io({
        "extraHeaders":{
            "authorization": "Bearer " + localStorage.getItem("token")
        }
    })  
    socket.on("connect", ()=>{
        console.log("online")
    })
    socket.on("disconnect", ()=>{
        console.log("offline")
    })

    socket.on("recibir-mensajes", dibujarMensaje)

    socket.on("usuarios-activos", dibujarUsuario)

    socket.on("mensajes-privados", dibujarMensajePrivado)
}

const dibujarUsuario = (usuarios = [])=>{
    let userHtml = ""
    usuarios.forEach(({nombre, uid})=>{
        userHtml +=`
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>

        `
        ulUsuarios.innerHTML = userHtml
    })
}

const dibujarMensaje = (mensajes = [])=>{
    let userHtml = ""
    console.log(mensajes)
    mensajes.forEach(({nombre, uid, mensaje})=>{
        userHtml +=`
        <li>
            <p>
                <span class="fs-6 text-muted">${nombre}</span>
                <span>${mensaje}</span>
            </p>
        </li>

        `
        ulMensajes.innerHTML = userHtml
    })
}

const dibujarMensajePrivado = (mensajes = {})=>{
    let userHtml = ""
    const arr = [];
    const nuevo = [...arr, mensajes];
    nuevo.forEach(({de, mensaje})=>{
        userHtml +=`
        <li>
            <p>
                <h5 class="text-success">${de}</h5>
                <span class="fs-6 text-muted">${mensaje}</span>
            </p>
        </li>

        `
        ulMensajes.innerHTML = userHtml
    })
    
    /*const {de, mensaje} = mensajes
    console.log(de)
        userHtml +=`
        <li>
            <p>
                <span class="fs-6 text-muted">${de}</span>
                <span>${mensaje}</span>
            </p>
        </li>

        `
        ulMensajes.innerHTML = userHtml*/
}

txtMensaje.addEventListener("keyup",({ keyCode })=>{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if( keyCode !== 13 ){ return; }
    if( mensaje.length === 0 ){ return; }
    socket.emit("enviar-mensaje",  {uid, mensaje})
    txtMensaje.value = '';
})


btnSalir.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location="index.html"
})


const main = async()=>{
    await validarJwt()
}

main()