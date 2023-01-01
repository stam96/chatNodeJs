import { modelUsuario } from "../../../models/usuario.js";
export const verificarContrasena = (value, { req }) => {
  if (value != req.body.contrasena) {
    throw new Error("Las contraseñas no coinciden");
  }
  return true;
};

export const existeCorreo = async (correo) => {
  const existeUsuario = await modelUsuario.findOne({ correo });
  //console.log(correo)
  if (existeUsuario) {
    throw new Error("Correo ya existente");
  }
  return true;
};

export const verificarToken = async (tokenEmail) => {
  const verificar = await modelUsuario.findOne({ tokenEmail });
  if (!verificar) {
    throw new Error("token no valido verificar de nuevo el token");
  }
  return true;
};

export const validoId = async (id) => {
  const existeId = await modelUsuario.findById(id);
  //console.log(id)
  if (!existeId) {
    throw new Error("El id no existe");
  }
  return true;
};
