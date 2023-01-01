import bcrypt from "bcrypt";
const hashClaves = async (contrasena, repetirContrasena) => {
  const salt = bcrypt.genSaltSync();
  const [hashContrasena, hashRcontrasena] = await Promise.all([
    bcrypt.hash(contrasena, salt),
    bcrypt.hash(repetirContrasena, salt),
  ]);
  return [hashContrasena, hashRcontrasena];
};

const compararClaveHash = (contrasena, hascontrasena) => {
  return bcrypt.compareSync(contrasena, hascontrasena);
};

export { compararClaveHash, hashClaves };
