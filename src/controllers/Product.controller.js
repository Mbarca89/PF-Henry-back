import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import fs from "fs-extra";

const postProduct = async (req, res) => {
    try {
        const { name, price, description, stock, userId, categoryId } = req.body
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
        const newProduct = new Product({ name, price, description, stock, photos: uploadPhotos, seller:userId, category:categoryId });
        await newProduct.save();
        const category = await Category.findOne({_id:categoryId})
        if(!category) throw Error ('Categoría no encontrada')
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
        const products = await Product.find({seller:userId});
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
    const minPrice = req.body.minPrice || 0
    const maxPrice = req.body.maxPrice || Infinity
    const sort = req.body.sort || {price:{isSorted:false},relevant:{isSorted:false}}
    const sortParameters = {}
    if (sort.price.isSorted){
        sort.price.order === 'asc' ? sortParameters.price = 1:sortParameters.price = -1
    }
    if (sort.relevant.isSorted){
        sort.relevant.order === 'asc' ? sortParameters.rating = 1:sortParameters.rating = -1
    }
    const options = {
        skip: (page - 1) * productsPerPage,
        limit: productsPerPage,
        sort: sortParameters
    }
    try {
        const products = await Product.find({}, null, options);
        if (!products) {
            throw Error('Error al obtener productos');
        }
        const count = await Product.countDocuments({})
        return res.status(200).json({count,products});
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export { postProduct, getProductById, getAllProducts, getFromSeller }