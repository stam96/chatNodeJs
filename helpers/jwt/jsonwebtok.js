import jwt from "jsonwebtoken";
import { response, request } from "express";
import { modelUsuario } from "../../models/index.js";

const tokensign = ({ uid = "" }) => {
  try {
    const expiresIn = "15min";
    const token = jwt.sign({ uid }, process.env.TOKENSECRET, {
      expiresIn,
    });
    //console.log(uid);
    return { token, expiresIn };
  } catch (error) {
    return res.status(500).json({ msg: "Error al generar token" });
  }
};

//Middleware
const tokenVerify = async (req = request, res = response, next) => {
  try {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    //console.log(token)
    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "No existe el token en la cabezera bearer" });
    }
    //Verify
    const { uid } = jwt.verify(token, process.env.TOKENSECRET);
    const usuario = await modelUsuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({ mensaje: "id no valido" });
    }
    //console.log(usuario)
    if (!uid) {
      return res
        .status(401)
        .json({ mensaje: "Token invalido - debe ser token valido" });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        mensaje: "Token no valido - usuario estado false",
      });
    }
    //console.log(uid)
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//Middleware
const rolAdminJwt = (req, res, next) => {
  try {
    const { rol } = req.usuario;
    if (rol === "administrador") {
      next();
    } else {
      return res.status(401).json({
        mensaje: "Rol no autorizado",
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

//Middleware
const listaRol = (...roles) => {
  return (req, res = response, next) => {
    const { usuario } = req;
    if (!usuario) {
      return res.status(500).json({
        msg: "Se requiere verificar el rol sin validar token primero",
      });
    }
    if (!roles.includes(usuario.rol)) {
      return res.status(401).json({
        msg: `Requiere uno de estos roles ${roles}`,
      });
    }
    next();
  };
};


//Midlleware Token socket
const comprarTokenSocket = async (token = "")=>{
  try {
    token = token.split(" ")[1];
    if(token.length <10){
      throw new Error("Token no valido")
    }
    const {uid} = jwt.verify(token, process.env.TOKENSECRET);
    const usuario = await modelUsuario.findById(uid)
    if(!usuario){
      return null
    }
    else{
      return usuario
    }
  } catch (error) {
    return null
  }
}
export {
  tokensign,
  tokenVerify,
  rolAdminJwt,
  listaRol,
  comprarTokenSocket,
};
