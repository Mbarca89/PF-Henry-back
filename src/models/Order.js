import { Schema, model } from "mongoose";

const conectionString =
  "mongodb+srv://pftestuser:dCIJSIvnkiwSUaug@cluster0.rzccgck.mongodb.net/?retryWrites=true&w=majority";

const orderSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
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
