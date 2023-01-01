import { response, request } from "express";
import { v4 as uuidv4 } from "uuid";
//import { sendMail } from "../helpers/mail/sendgrid.js";
//import { sendMail } from "../helpers/mail/mail.js";
import { modelUsuario } from "../models/index.js";
//import bcrypt from "bcrypt";
import { hashClaves } from "../helpers/hash/bcrypts.js";

//Registrar Usuarios
const registroUsuario = async (req = request, res = response) => {
  try {
    const { nombre, correo, contrasena, repetirContrasena } = req.body;
    const [hashContrasena, hashRcontrasena] = await hashClaves(contrasena, repetirContrasena)
    //Crear modelo con hash
    const usuario = new modelUsuario({
      nombre,
      correo,
      contrasena: hashContrasena,
      repetirContrasena: hashRcontrasena,
      tokenEmail: uuidv4(),
    });
    //Grabar cambios
    await usuario.save();
    //Funcion para enviar correo beta mailtrap produccion sendgrid
    //sendMail(usuario);
    return res.status(201).json({
      usuario,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//Verificar Token Correo  
const verificarCorreoUsuario = async (req = request, res = response) => {
  try {
    const { token } = req.params;
    const data = await modelUsuario.findOne({ tokenEmail: token });
    if (!data.tokenEmail) {
      return res.status(404).json({
        msg: "Falta verificar cuenta verifique su correo e ingrese el codigo",
      });
    }
    data.tokenEmail = null;
    data.cuentaConfirmada = true;
    await data.save();
    //console.log(data);
    return res.status(200).json({
      msg: "Verificado",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Token para actualizar token
const tokenRestablecerContrasena = async (req = request, res = response) => {
  try {
    const { correo } = req.body;
    const data = await modelUsuario.findOne({ correo });
    if (!data) {
      return res.status(404).json({
        msg: "Correo no encontrado",
      });
    }
    //Generar Token
    data.cuentaConfirmada = false;
    data.tokenEmail = uuidv4();
    await data.save();
    //sendMail(data);
    return res.status(200).json({
      msg: "Correo Enviado nuevo token generado",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Editar contraseña
const actualizarCorreo = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { contrasena, repetirContrasena } = req.body;
    const buscarUsuario = await modelUsuario.findById(id);
    if (!buscarUsuario) {
      return res.status(200).json({
        msg: "Id no valido revisar correo e ingrese nuevamente el id ",
      });
    }
    if (!buscarUsuario.cuentaConfirmada) {
      return res.status(200).json({
        msg: "Debe verificar antes de actualizar correo ",
      });
    }

    /*const salt = bcrypt.genSaltSync();
    const [hashContrasena, hashRcontrasena] = await Promise.all([
      bcrypt.hash(contrasena, salt),
      bcrypt.hash(repetirContrasena, salt),
    ]);*/

    //Hash Actualizar contraseña
    const [hashContrasena, hashRcontrasena] = await hashClaves(contrasena, repetirContrasena)

    //Objeto edicion contraseña
    const data = {
      contrasena: hashContrasena,
      repetirContrasena: hashRcontrasena,
    };

    //console.log(data)
    const usuario = await modelUsuario.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.status(200).json({
      msg: "Clave actualizada",
      usuario,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export {
  registroUsuario,
  verificarCorreoUsuario,
  tokenRestablecerContrasena,
  actualizarCorreo,
};
