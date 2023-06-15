import User from "../models/User.js";
import Cart from "../models/Cart.js";

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, city, province, postalCode } = req.body
        if (!name) throw Error('El nombre no puede estar vacio')
        if (!email) throw Error('El Email no puede estar vacio')
        if (!password) throw Error('La contraseña no puede estar vacia')
        if (!address) throw Error('La dirección no puede estar vacia')
        if (!city) throw Error('La ciudad no puede estar vacia')
        if (!province) throw Error('La provincia no puede estar vacia')
        if (!postalCode) throw Error('El código postal no puede estar vacío')

        const newUser = new User({ name, email, password, address, city, province, postalCode })
        await newUser.save()

        const newCart = new Cart({ user: newUser._id })
        await newCart.save()

        newUser.cart = newCart._id
        newUser.save()

        return res.status(201).json({ newUser, newCart })

    } catch (error) {
        if (error.code === 11000) {
            if(error.keyPattern.name)
            return res.status(400).send(`Ya existe un usuario con el nombre ${error.keyValue.name}`)
            else return res.status(400).send(`Ya existe un usuario registrado con el mail ${error.keyValue.email}`)
        }
        else return res.status(400).send(error.message)
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            throw Error('Error al obtener productos');
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export {createUser, getUsers}