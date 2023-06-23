import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === "undefined") {
      throw new Error("No token provided"); // Throw an error if no token is present
    }

    const token = bearerHeader.split(" ")[1];
    const payload = await jwt.verify(token, "secretKey");

    if (payload) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    return res.status(403).send(error.message);
  }
};

export default verifyToken;
