import { request, response } from "express";
import { modelUsuario } from "../models/index.js";
import { compararClaveHash } from "../helpers/hash/bcrypts.js";
import {tokensign } from "../helpers/jwt/jsonwebtok.js";
import googleVerify from "../helpers/googleAuth/verifyGoogle.js";
//import jwt from "jsonwebtoken";
//Post login
const accederLogin = async (req = request, res = response) => {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await modelUsuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({
        msg: "El correo que ingresastes no es valido",
      });
    }
    //console.log(usuario.cuentaConfirmada)
    if (!usuario.cuentaConfirmada) {
      return res.status(404).json({
        msg: "Debe estar verificada su cuenta",
      });
    }
    //Comparar clave para login
    const verificarContrasena = compararClaveHash(
      contrasena,
      usuario.contrasena
    );
    if (!verificarContrasena) {
      return res.status(404).json({
        msg: "La contraseña que ingresastes no es la correcta ingrese otra vez",
      });
    }
    //generar token jwt
    const { token, expiresIn } = tokensign({ uid: usuario.id });

    //console.log(usuario)
    return res.status(200).json({
      msg: "Accediendo",
      uid: usuario.id,
      token,
      expiresIn
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const loginGoogle = async (req = request, res = response) => {
  try {
    const { id_token } = req.body;
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await modelUsuario.findOne({ correo });
    if (!usuario) {
      const data = {
        nombre,
        correo,
        contrasena: "",
        repetirContrasena: "",
        img,
      };
      usuario = new modelUsuario(data);
      await usuario.save();
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Usuario con estado en false acceso denegado hablar con admin",
      });
    }
    //generar token jwt
    const { token, expiresIn } = tokensign({ uid: usuario.id });

    return res.status(200).json({
      correo: usuario.correo,
      uid: usuario.id,
      nombre: usuario.nombre,
      token,
      expiresIn,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const renovarToken = async (req = request, res = response)=>{
try {
    const {usuario} = req
    const {token}  = tokensign({uid:usuario.id});
    res.json({
      usuario,
      token
    })
} catch (error) {
  res.status(500).json(error);
}
}

const rutaProtegida = async (req = request, res = response)=>{

}
export { accederLogin, loginGoogle, renovarToken,rutaProtegida};
