import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleLogin = async (req, res) => {
  try {
    const googleUser = req.user
    if (!googleUser[0]?.name) {
      return res.redirect('http://localhost:5173/')
    }
    if (googleUser[0]?.name) {
      jwt.sign({ googleUser }, "secretKey", (err, token) => {
        if (err) {
          throw new Error("Failed to create JWT");
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
        }))
       return res.redirect('http://localhost:5173/products')
      })
    }
  } catch (error) {
    return res.status(400).send(error.message)
    
  }

}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    jwt.sign({ user }, "secretKey", (err, token) => {
      if (err) {
        throw new Error("Failed to create JWT");
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
        },
      });
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export { Login, googleLogin };