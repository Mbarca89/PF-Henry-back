import { Schema, model } from 'mongoose'


const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: false });

cartSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

    }
})

const Cart = model('Cart', cartSchema);

export default Cart