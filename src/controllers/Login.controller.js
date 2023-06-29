import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { FRONT_HOST } from "../../config.js";
import bcrypt from "bcryptjs";

const googleLogin = async (req, res) => {
  try {
    const googleUser = req.user
    if (!googleUser[0]?.name) {
      const name = `${googleUser.googleName} ${googleUser.googleLastName}`
      res.cookie('email', googleUser.googleEmail);
      res.cookie('name', name)
      console.log(FRONT_HOST)
      return res.redirect(`${FRONT_HOST}/login`)
    }
    if (googleUser[0]?.name) {
      jwt.sign({ googleUser }, "secretKey", (err, token) => {
        if (err) {
          throw Error("Error al crear el token.");
        }
        res.cookie('token', token);
        res.cookie('user', JSON.stringify({
          id: googleUser[0].id,
          name: googleUser[0].name,
          email: googleUser[0].email,
          address: googleUser[0].address,
          city: googleUser[0].city,
          province: googleUser[0].province,
          postalCode: googleUser[0].postalCode,
          phone: googleUser[0].phone,
          commerceName: googleUser[0].commerceName,
          role: googleUser[0].role,
          cart: googleUser[0].cart,
          active:googleUser[0].active
        }))
        return res.redirect(`${FRONT_HOST}/products`)
      })
    }
  } catch (error) {
    return res.status(403).send(error.message)

  }

}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw Error("No existe un usuario con ese Email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw Error("Contraseña incorrecta")

    jwt.sign({ user }, "secretKey", (err, token) => {
      if (err) {
        throw Error("Error al crear el token");
      }

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          city: user.city,
          province: user.province,
          postalCode: user.postalCode,
          phone: user.phone,
          commerceName: user.commerceName,
          role: user.role,
          cart: user.cart,
          active: user.active
        },
      });
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export { Login, googleLogin };