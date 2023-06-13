import {Schema, model } from 'mongoose'


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
      required: true,
    },
    discount: {
        type: Number,
        default: 5,
        min: 5,
        required: true,
    },
    photos: {
        type: [],
        required: false,
    },
}, { timestamps: false });

const Product = model('Product', productSchema);

export default Product