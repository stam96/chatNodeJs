import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const uri = process.env.URINEW;
//const uri2= "mongodb://localhost:27017/myapp"
export const dbConexion = async () => {
  try {
    await mongoose.connect(uri);
    console.log("conectando");
  } catch (error) {
    console.log("Error al conectar la db" + error);
  }
};
