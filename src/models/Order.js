import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    itemQuantity: {
      type: String,
      required: true,
    },
    itemPrice: {
      type: String,
      required: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
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
