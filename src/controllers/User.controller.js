import User from "../models/User.js";
import Cart from "../models/Cart.js";
import transporter from "../libs/nodemailer.js";
import { HOST } from "../../config.js";

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, city, province, postalCode, role, phone, commerceName } = req.body
        if (!name) throw Error('El nombre no puede estar vacio!')
        if (!email) throw Error('El Email no puede estar vacio!')
        if (!password) throw Error('La contraseña no puede estar vacia!')
        if (!address) throw Error('La dirección no puede estar vacia!')
        if (!city) throw Error('La ciudad no puede estar vacia!')
        if (!province) throw Error('La provincia no puede estar vacia!')
        if (!postalCode) throw Error('El código postal no puede estar vacío!')

        if (role === 'seller') {
            if (!commerceName) throw Error('El nombre de la tienda es obligatorio!')
            if (!phone) throw Error('El número de teléfono es obligatorio!')
        }

        const newUser = new User({ name, email, password, address, city, province, postalCode, role, phone, commerceName, activationToken: Math.random().toString(36).substring(2) })
        await newUser.save()

        const newCart = new Cart({ user: newUser._id })
        await newCart.save()

        newUser.cart = newCart._id
        newUser.save()

        const mailOptions = {
            from: 'naturessence23@gmail.com',
            to: newUser.email,
            subject: 'Activa tu cuenta',
            text: `Hola, gracias por registrarte en NaturEssence. Haz clic en el siguiente enlace para activar tu cuenta: ${HOST}/users/activate/${newUser.activationToken}`,
        };

        await transporter.sendMail(mailOptions)

        return res.status(201).json({ newUser, newCart })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send(error.message)
        }
        else return res.status(400).send(error.message)
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            throw Error('Error al obtener usuarios!');
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getSellers = async (req, res) => {
    try {
        const users = await User.find({ role: 'seller' });
        if (!users) {
            throw Error('Error al obtener vendedores!');
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const activateUser = async (req,res) => {
    try {
        const {token} = req.params

        const user = await User.findOne({ activationToken: token });

        if(!user) throw Error ('Ha ocurrido un problema. El usuario no existe o has seguido un enlace no válido')
        if(user.active) throw Error ('Tu cuenta ya esta activada, el enlace ya no es valido.')
        user.active = true
        await user.save()
        return res.status(200).send('Tu cuenta esta activada! Ahora puedes iniciar sesión')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getPurchasedProducts = async (req,res) => {
    try {
        const {userId} = req.params
        if(!userId) throw Error ('Falta la id de usuario!')

        const user = await User.findById(userId).populate({
            path:'purchasedProducts.product',
            select: 'name photos price description'
        })
        if(!user) throw Error ('Usuario no encontrado!')

        return res.status(200).json(user.purchasedProducts)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getClients = async (req,res) => {
    try {
        const {userId} = req.body
        const user = await User.findById(userId).populate('clients.product', 'name price hasDiscount discount').populate('clients.user', 'name email address city province postalCode')
        if(!user) throw Error ('Usuario no encontrado!')
        const clients = user.clients.map(client => {
            const { name, price, hasDiscount, discount } = client.product;
            return {
                user:{
                    name: client.user.name,
                    email: client.user.email,
                    address: client.user.address,
                    city: client.user.city,
                    province: client.user.province,
                    postalCode: client.user.postalCode,
                },
                product:{
                    productName: name,
                    productPrice: price,
                    productHasDiscount: hasDiscount,
                    productDiscount: discount
                },
                quantity: client.quantity
            };
        });

        return res.status(200).json(clients)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const changeActivation = async (req, res) => {
    try {
      const { active } = req.body;
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) throw Error("Producto no encontrado!");
      user.active = active;
      await user.save();
      if (active === false)
        return res.status(200).send("Usuario desactivado correctamente");
      else return res.status(200).send("Usuario activado correctamente");
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error.message);
    }
  };

export { createUser, getUsers, getSellers, activateUser, getPurchasedProducts, getClients, changeActivation }