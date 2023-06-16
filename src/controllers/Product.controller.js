import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import fs from "fs-extra";

const postProduct = async (req, res) => {
    try {
        const { name, price, description, stock, userId, categoryId, freeShipping } = req.body
        if (!name) throw Error('El nombre no puede estar vacio')
        if (!price) throw Error('El precio no puede estar vacio')
        if (!description) throw Error('El description no puede estar vacio')
        if (!stock) throw Error('El stock no puede estar vacio')
        const photos = req.files?.photos
        let uploadPhotos = []
        if (photos) {
            if (!photos.length && photos.name) {
                const result = await uploadImage(photos.tempFilePath);
                await fs.remove(photos.tempFilePath);
                uploadPhotos = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            }
            if (photos.length > 1) {
                uploadPhotos = await Promise.all(
                    photos.map(async (photo) => {
                        const result = await uploadImage(photo.tempFilePath);
                        await fs.remove(photo.tempFilePath);
                        return {
                            url: result.secure_url,
                            public_id: result.public_id,
                        };
                    })
                );
            }
        }
        const newProduct = new Product({ name, price, description, stock, photos: uploadPhotos, seller: userId, category: categoryId, freeShipping });
        await newProduct.save();
        const category = await Category.findOne({ _id: categoryId })
        if (!category) throw Error('Categoría no encontrada')
        category.products.push(newProduct._id)
        await category.save()
        return res.status(200).json(newProduct);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            throw Error('Producto no encontrado');
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getFromSeller = async (req, res) => {
    try {
        const { userId } = req.params;
        const products = await Product.find({ seller: userId });
        if (!products) {
            throw Error('Producto no encontrado');
        }
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getAllProducts = async (req, res) => {
    const productsPerPage = 12
    const { page } = req.query

    const sort = req.body.sort || { price: { isSorted: false }, relevant: { isSorted: false }, sales: { isSorted: false } }

    const sortParameters = {}

    if (sort.price.isSorted) sort.price.order === 'asc' ? sortParameters.price = 1 : sortParameters.price = -1
    if (sort.relevant.isSorted) sort.relevant.order === 'asc' ? sortParameters.rating = 1 : sortParameters.rating = -1
    if (sort.sales.isSorted) sort.sales.order === 'asc' ? sortParameters.sales = 1 : sortParameters.sales = -1


    const options = {
        skip: (page - 1) * productsPerPage,
        limit: productsPerPage,
        sort: sortParameters
    }

    const freeShipping = req.body.freeShipping || false
    const hasDiscount = req.body.hasDiscount || false
    const category = req.body.category || false
    const minPrice = req.body.minPrice || false
    const maxPrice = req.body.maxPrice || false
    const name = req.query.name || '';
    const decodedName = name.trim().split(' ')
    const nameFilter = decodedName.map(element => {
        return { name: { $regex: element, $options: 'i' } }
    })

    const filters = {
        $or: nameFilter,
        price:{$gte:0,$lte:Infinity}
    }

    if (freeShipping) filters.freeShipping = freeShipping
    if (hasDiscount) filters.hasDiscount = hasDiscount
    if (category) filters.category = category
    if (minPrice) filters.price.$gte = Number(minPrice)
    if (maxPrice) filters.price.$lte = Number(maxPrice)


    try {
        const products = await Product.find(filters, null, options);
        if (!products) {
            throw Error('Error al obtener productos');
        }
        const totalCount = await Product.countDocuments(filters, null, null)
        return res.status(200).json({ totalCount, products });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            id,
            name,
            price,
            description,
            stock,
            hasDiscount,
            discount,
            photos,
            category,
            freeShipping,
        } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                price,
                description,
                stock,
                hasDiscount,
                discount,
                photos,
                category,
                freeShipping,
            },
            { new: true }
        );
        
        if (!updatedProduct) {
            throw Error("Producto no encontrado");
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export {
    postProduct,
    getProductById,
    getAllProducts,
    getFromSeller,
    updateProduct
}