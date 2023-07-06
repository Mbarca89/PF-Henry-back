import User from "../models/User.js";
import Cart from "../models/Cart.js";
import transporter from "../libs/nodemailer.js";
import { FRONT_HOST } from "../../config.js";
import bcrypt from "bcryptjs";

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
            const user = await User.findOne({email})
            if(user?.role === 'user') {
                user.commerceName = commerceName
                user.phone = phone
                user.role = 'seller'
                await user.save()
                return res.status(200).json({user})
            }
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = new User({ name, email, password: hashedPass, address, city, province, postalCode, role, phone, commerceName, activationToken: Math.random().toString(36).substring(2) })
        await newUser.save()

        const newCart = new Cart({ user: newUser._id })
        await newCart.save()

        newUser.cart = newCart._id
        newUser.save()

        const mailOptions = {
            from: 'naturessence23@gmail.com',
            to: newUser.email,
            subject: 'Activa tu cuenta',
            text: `Hola, gracias por registrarte en NaturEssence. Haz clic en el siguiente enlace para activar tu cuenta: ${FRONT_HOST}/activation/${newUser.activationToken}`,
        };

        await transporter.sendMail(mailOptions)

        return res.status(201).json({ user:newUser, newCart })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send('Ya existe un usuario con ese correo electrónico.')
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

const activateUser = async (req, res) => {
    try {
        const { token } = req.params

        const user = await User.findOne({ activationToken: token });

        if (!user) throw Error('Ha ocurrido un problema. El usuario no existe o has seguido un enlace no válido')
        if (user.active) throw Error('Tu cuenta ya esta activada, el enlace ya no es valido.')
        user.active = true
        await user.save()
        return res.status(200).send('Tu cuenta esta activada! Ahora puedes iniciar sesión')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const resendActivation = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) throw Error('El email es obligatorio!')

        const user = await User.findOne({ email })
        if (!user) throw Error('No existe un usuario con ese email')

        if (user.active) throw Error('El usuario ya esta activado')

        user.activationToken = Math.random().toString(36).substring(2)

        await user.save()

        const mailOptions = {
            from: 'naturessence23@gmail.com',
            to: user.email,
            subject: 'Activa tu cuenta',
            text: `Hola, gracias por registrarte en NaturEssence. Haz clic en el siguiente enlace para activar tu cuenta: ${FRONT_HOST}/activation/${user.activationToken}`,
        };

        await transporter.sendMail(mailOptions)

        return res.status(200).send('se ha enviado un correo electrónico!')

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getPurchasedProducts = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) throw Error('Falta la id de usuario!')

        const user = await User.findById(userId).populate({
            path: 'purchasedProducts.product',
            select: 'name photos price description reviews'
        })
        if (!user) throw Error('Usuario no encontrado!')

        return res.status(200).json(user.purchasedProducts)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getClients = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).populate('clients.product', 'name price hasDiscount discount').populate('clients.user', 'name email address city province postalCode')
        if (!user) throw Error('Usuario no encontrado!')
        const clients = user.clients.map(client => {
            const { name, price, hasDiscount, discount } = client.product;
            return {
                user: {
                    name: client.user.name,
                    email: client.user.email,
                    address: client.user.address,
                    city: client.user.city,
                    province: client.user.province,
                    postalCode: client.user.postalCode,
                },
                product: {
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
        if(active) {
            const user = await User.findByIdAndUpdate(userId,{banned:true},{new: true});
            if (!user) throw Error("Usuario no encontrado!");
        }else {
            const user = await User.findByIdAndUpdate(userId,{banned:false},{new: true});
            if (!user) throw Error("Usuario no encontrado!");
        }

        if (active === false)
            return res.status(200).send("Usuario desactivado correctamente");
        else return res.status(200).send("Usuario activado correctamente");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) throw Error('El email es obligatorio!')

        const user = await User.findOne({ email })
        if (!user) throw Error('Usuario no encontrado!')

        user.passwordToken = Math.random().toString(36).substring(2)

        await user.save()

        const mailOptions = {
            from: 'naturessence23@gmail.com',
            to: user.email,
            subject: 'Resetear contraseña',
            text: `Hola, estás recibiendo este correo porque has solicitado resetear tu contraseña. Sigue el siguiente enlace para continuar: ${FRONT_HOST}/resetpassword/${user.passwordToken}. Si no has sido tu puedes ignorar este mensaje.`,
        };

        await transporter.sendMail(mailOptions)

        return res.status(200).send('Se ha enviado un correo electrónico!')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { passwordToken } = req.params
        if (!passwordToken) throw Error('Token inválido')
        const { password } = req.body
        if (!password) throw Error('La contraseña es obligatoria!')

        const user = await User.findOne({ passwordToken })
        if (!user) throw Error('El usuario no existe o has seguido un enlace no válido.')

        const hashedPass = await bcrypt.hash(password, 10)

        user.password = hashedPass
        user.passwordToken = ''
        await user.save()

        return res.status(200).send('Contraseña actualizada con éxito!')

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const changePassword = async (req,res) => {
    try {
        const {password, newPassword, userId} = req.body
        if(!userId) throw Error('No hay id')
        if(!password || !newPassword || !userId) throw Error ('Faltan datos')

        const user = await User.findById(userId)
        if(!user) throw Error ('Usuario no encontrado!')

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw Error("Contraseña incorrecta")

        const hashedPass = await bcrypt.hash(newPassword, 10)

        user.password = hashedPass

        await user.save()

        return res.status(200).send('Contraseña actualizada con éxito!')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const updateUser = async (req,res) => {
    try {
        const {id, name, address, city, province, postalCode } = req.body
        if(!id) throw Error ('Se necesita la ID del usuario.')
        if(!name) throw Error ('El nombre no puede estar vacio')
        if(!addess) throw Error ('La direccion no puede estar vacia')
        if(!city) throw Error ('La ciudad no puede estar vacia')
        if(!province) throw Error ('La provincia no puede estar vacia')
        
        const user = await User.findByIdAndUpdate(id,
            {
                name,
                address,
                city,
                province,
                postalCode,
        },
        {new:true}
        )
        if(!user) throw Error ('Usuario no encontrado!')

        await user.save()
       
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export { createUser, getUsers, getSellers, activateUser, resendActivation, getPurchasedProducts, getClients, changeActivation, forgotPassword, resetPassword, changePassword, updateUser }