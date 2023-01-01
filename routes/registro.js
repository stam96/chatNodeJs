import { Router } from "express";
import {
  tokenRestablecerContrasena,
  registroUsuario,
  verificarCorreoUsuario,
  actualizarCorreo,
} from "../controller/controllerRegistro.js";
import {
  validarRegistro,
  validationResultExpress,
} from "../helpers/validator/index.js";
import {
  compararContrasena,
  verifacarTokenEmail,
  verificarIdMongo,
} from "../helpers/validator/registro/validateRegistro.js";

const router = Router();
router.post(
  "/registro",
  validarRegistro,
  validationResultExpress,
  registroUsuario
);
router.post(
  "",
  verifacarTokenEmail,
  validationResultExpress,
  verificarCorreoUsuario
);

router.post("/enviarToken", tokenRestablecerContrasena);

router.put(
  "/actualizar/:id",
  verificarIdMongo,
  compararContrasena,
  validationResultExpress,
  actualizarCorreo
);

export { router };
