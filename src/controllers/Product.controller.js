import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import fs from "fs-extra";

const postProduct = async (req, res) => {
  try {
    if (!req.body.data) throw Error("No hay datos!");
    const { name, price, description, stock, userId, category, freeShipping } =
      JSON.parse(req.body.data);
    if (!name) throw Error("El nombre no puede estar vacio!");
    if (!price) throw Error("El precio no puede estar vacio!");
    if (!description) throw Error("La descripción no puede estar vacia!");
    if (!stock) throw Error("El stock no puede estar vacio!");
    const photos = req.files?.photos;
    let uploadPhotos = [];
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
    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      photos: uploadPhotos,
      seller: userId,
      category,
      freeShipping,
    });
    const findCategory = await Category.findOne({ _id: category });
    if (!findCategory) throw Error("Categoría no encontrada!");
    findCategory.products.push(newProduct._id);
    await newProduct.save();
    await findCategory.save();
    return res.status(200).json(newProduct);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw Error("Producto no encontrado!");
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
      throw Error("Producto no encontrado!");
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getProducts = async (req, res) => {
  const productsPerPage = 12;
  const { page } = req.query;

  const sort = req.body.sort || {
    price: { isSorted: false },
    relevant: { isSorted: false },
    sales: { isSorted: false },
  };

  const sortParameters = {};

  if (sort.price.isSorted)
    sort.price.order === "asc"
      ? (sortParameters.price = 1)
      : (sortParameters.price = -1);
  if (sort.relevant.isSorted)
    sort.relevant.order === "asc"
      ? (sortParameters.ratingAverage = 1)
      : (sortParameters.ratingAverage = -1);
  if (sort.sales.isSorted)
    sort.sales.order === "asc"
      ? (sortParameters.sales = 1)
      : (sortParameters.sales = -1);

  const options = {
    skip: (page - 1) * productsPerPage,
    limit: productsPerPage,
    sort: sortParameters,
  };

  const freeShipping = req.body.freeShipping || false;
  const hasDiscount = req.body.hasDiscount || false;
  const category = req.body.category || false;
  const minPrice = req.body.minPrice || false;
  const maxPrice = req.body.maxPrice || false;
  const name = req.query.name || "";
  const decodedName = name.trim().split(" ");
  const nameFilter = decodedName.map((element) => {
    return { name: { $regex: element, $options: "i" } };
  });

  const filters = {
    $or: nameFilter,
    price: { $gte: 0, $lte: Infinity },
    isActive: true,
  };

  if (freeShipping) filters.freeShipping = freeShipping;
  if (hasDiscount) filters.hasDiscount = hasDiscount;
  if (category) filters.category = category;
  if (minPrice) filters.price.$gte = Number(minPrice);
  if (maxPrice) filters.price.$lte = Number(maxPrice);

  try {
    const products = await Product.aggregate([
      { $match: filters },
      {
        $addFields: {
          ratingAverage: {
            $cond: {
              if: { $eq: [{ $avg: "$rating" }, null] },
              then: 1,
              else: { $avg: "$rating" },
            },
          },
        },
      },
      { $sort: sortParameters },
      { $skip: options.skip },
      { $limit: options.limit },
    ]);

    const totalCount = await Product.countDocuments(filters);

    const transformedProducts = products.map((product) => {
      const { _id, __v, ...rest } = product;
      return { id: _id, ...rest };
    });

    return res.status(200).json({ totalCount, products: transformedProducts });
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
      sales,
      seller,
      isActive,
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
        sales,
        seller,
        isActive,
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw Error("Producto no encontrado!");
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const changeActivation = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) throw Error("Producto no encontrado!");
    product.isActive = isActive;
    await product.save();
    if (isActive === false)
      return res.status(200).send("Producto desactivado correctamente");
    else return res.status(200).send("Producto activado correctamente");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const postReview = async (req, res) => {
  try {
    const { rating, review, productId, userId } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw Error("Producto no encontrado!");
    const user = await User.findById(userId);
    if (!user) throw Error("Usuario no encontrado!");
    if (!rating) throw Error("No se recibio ninguna puntuación!");
    if (rating < 1 || rating > 5)
      throw Error("la puntuación debe ser entre 1 y 5!");
    if (!review) throw Error("La reseña no puede estar vacía!");

    const purchasedProduct = user.purchasedProducts.find(
      (purchased) => purchased.product.toString() === productId
    );
    if (!purchasedProduct) {
      throw new Error("El usuario no ha comprado este producto.");
    }

    if (purchasedProduct.reviewed) {
      throw new Error(
        "El usuario ya ha realizado una reseña para este producto."
      );
    }

    const userReview = {
      user: user.name,
      rating,
      review,
    };
    product.rating.push(Number(rating));
    product.reviews.push(userReview);
    purchasedProduct.reviewed = true;
    await product.save();
    await user.save();
    return res.status(200).send("Reseña publicada correctamente!");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getOffers = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { hasDiscount: true } },
      {
        $addFields: {
          ratingAverage: {
            $cond: {
              if: { $eq: [{ $avg: "$rating" }, null] },
              then: 1,
              else: { $avg: "$rating" },
            },
          },
        },
      },
      { $sort: { ratingAverage: -1 } },
      { $limit: 10 }
    ]);

    if (!products || products.length === 0) {
      throw Error("No hay productos en oferta!");
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getFeatured = async (req, res) => {
  try {
    let products = await Product.aggregate([
      {
        $addFields: {
          ratingAverage: {
            $cond: {
              if: { $eq: [{ $avg: "$rating" }, null] },
              then: 1,
              else: { $avg: "$rating" },
            },
          },
        },
      },
      { $sort: { ratingAverage: -1 } },
      { $limit: 1 }
    ]);

    if (!products || products.length === 0) {
      throw Error("No hay productos en oferta!");
    }

    return res.status(200).json(products[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw Error("Producto no encontrado!");
    }

    return res.status(200).json({ message: "Producto eliminado exitosamente!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllProdcuts = async (req,res) => {
  try {
    const products = await Product.find().populate('seller', 'name')
    if (!products) throw Error ('Error al obtener productos')

    return res.status(200).json(products)
  } catch (error) {
    return res.status(200).send(error.message)
  }
}

export {
  postProduct,
  getProductById,
  getProducts,
  getFromSeller,
  updateProduct,
  postReview,
  changeActivation,
  getOffers,
  deleteProduct,
  getFeatured,
  getAllProdcuts
};
