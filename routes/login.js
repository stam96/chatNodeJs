import { Router } from "express";
import {
  accederLogin,
  loginGoogle,
  renovarToken,
  rutaProtegida,
} from "../controller/controllerLogin.js";
import {
  listaRol,
  rolAdminJwt,
  tokenVerify,
} from "../helpers/jwt/jsonwebtok.js";
import {
  validarCamposLogin,
  validationResultExpress,
} from "../helpers/validator/index.js";
import { googleCampo } from "../helpers/validator/login/validarLogin.js";
const router = Router();
router.post(
  "/login",
  validarCamposLogin,
  validationResultExpress,
  accederLogin
);
router.post("/google",googleCampo, validationResultExpress, loginGoogle)
router.post("/login", tokenVerify, listaRol("usuario"));
router.get("/auth",tokenVerify, renovarToken );
router.get("/verificada", tokenVerify,  rutaProtegida)
export { router };
