import { Schema } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema(
  {
    nombre: {
      type: String,
    },
    correo: {
      type: String,
      require: true,
      unique: true,
    },
    contrasena: {
      type: String,
    },
    repetirContrasena: {
      type: String,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
    },
    google: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      enum: ["usuario", "administrador"],
      default: "usuario",
    },
    cuentaConfirmada: {
      type: Boolean,
      default: false,
    },
    tokenEmail: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const {
    contrasena,
    repetirContrasena,
    createdAt,
    updatedAt,
    _id,
    ...usuario
  } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

const modelUsuario = mongoose.model("Usuario", userSchema);
export { modelUsuario };
