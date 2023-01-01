import { check, body, param } from "express-validator";

import {
  existeCorreo,
  validoId,
  verificarContrasena,
  verificarToken,
} from "../reutilizacion/reutilizar.js";

export const validarRegistro = [
  check("nombre")
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("Solo texto"),
  check("correo")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo debe ser valido")
    .custom(existeCorreo),
  body("contrasena")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Debe ser minimo 8 caracteres"),
  body("repetirContrasena").trim().custom(verificarContrasena),
];

export const verifacarTokenEmail = [
  param("token", "Token no valido").trim().notEmpty().custom(verificarToken),
];

export const verificarIdMongo = [
  param("id")
    .notEmpty()
    .isMongoId()
    .withMessage("No es un id de mongo")
    .custom(validoId),
];

export const compararContrasena = [
  body("contrasena")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Debe ser minimo 8 caracteres"),
  body("repetirContrasena").trim().custom(verificarContrasena),
];
