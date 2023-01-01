import { check } from "express-validator";
const validarCamposLogin = [
  check("correo")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo debe ser valido"),
  check("contrasena")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Debe ser minimo 8 caracteres"),
];

const googleCampo = [
  check("id_token", "token es necesario").not().trim().isEmpty()
]
export { validarCamposLogin, googleCampo };
