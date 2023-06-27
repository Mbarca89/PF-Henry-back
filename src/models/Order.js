import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalOrderAmount: {
      type: Number,
      required: true,
    },
    productList:{
      type:[]
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'cancelled'
    }
  },
  { timestamps: false }
);

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Order = model("Order", orderSchema);

export default Order;
