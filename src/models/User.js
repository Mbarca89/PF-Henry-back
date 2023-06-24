import { Schema, model } from 'mongoose'



const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  commerceName: {
    type: String,
    required: false,
  },
  purchasedProducts: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    reviewed: {
      type: Boolean,
      default: false
    }
  }],
  active:{
    type: Boolean,
    default: false
  },
  activationToken:{
    type: String
  }
}, { timestamps: false });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

  }
})

const User = model('User', userSchema);

export default User