import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { FRONT_HOST } from "../../config.js";
import bcrypt from "bcryptjs";

const googleLogin = async (req, res) => {
  try {
    const googleUser = req.user
    if (!googleUser[0]?.name) {
      const name = `${googleUser.googleName} ${googleUser.googleLastName}`
      res.cookie('email', googleUser.googleEmail,{
        httpOnly: false,
        sameSite: "None",
        secure: true,
      });
      res.cookie('name', name,{
        httpOnly: false,
        sameSite: "None",
        secure: true,
      })
      return res.redirect(`${FRONT_HOST}/login`)
    }
    if (googleUser[0]?.name) {
      if(googleUser[0]?.banned) throw Error ('Tu cuenta fue desactivada, Contacta a un administrador!')
      jwt.sign({ googleUser }, "secretKey", (err, token) => {
        if (err) {
          throw Error("Error al crear el token.");
        }
        res.cookie('token', token,{
          httpOnly: false,
          sameSite: "None",
          secure: true,
        });
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
        },{
          httpOnly: false,
          sameSite: "None",
          secure: true,
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

    if(user.banned) throw Error ('Tu cuenta fue desactivada, Contacta a un administrador!')

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
    console.log(error.message)
    return res.status(400).send(error.message);
  }
};

export { Login, googleLogin };