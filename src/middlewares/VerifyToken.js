import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) throw Error('Error de token!')

    if (typeof bearerHeader !== "undefined") {
      const token = bearerHeader.split(" ")[1];
      const payload = await jwt.verify(token, "secretKey");

      if (payload) {
        next();
      } else {
        return res.status(403).message('Necesitas iniciar sesion.')
      }
    };

  } catch (error) {
    return res.status(403).send('Necesitas iniciar sesion.')
  }
}

export default verifyToken
