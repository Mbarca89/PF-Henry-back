import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Product from "../models/Product.js";
import fs from "fs-extra";

const postProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body
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
        const newProduct = new Product({ name, price, description, stock, photos:uploadPhotos });
        await newProduct.save();
        return res.status(200).json(newProduct);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export default postProduct