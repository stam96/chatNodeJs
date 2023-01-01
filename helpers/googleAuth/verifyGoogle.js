import {OAuth2Client} from "google-auth-library"
import * as dotenv from 'dotenv'
dotenv.config()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
async function googleVerify(token =  "") {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const {email, name, picture} = ticket.getPayload();
  return {
    correo:email,
    nombre: name,
    img:picture
  }
}

export default googleVerify