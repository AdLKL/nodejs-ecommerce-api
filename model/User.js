import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            // we are going to reference the id of the document instead of the entire object
            ref: "Order",
            // which model are we going to reference
        }
    ],
    wishLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WishList",
        },
    ],
    isAdmin:{
        type: Boolean,
        default: false,
    },
    hasShippingAddress:{
        type: Boolean,
        default: false,
    },
    ShippingAddress: {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        province: {
            type: String,
        },
        phone: {
            type: String,
        }
    },
},
{
    timestamps:true,
}
);

// compile the schema to model
const User = mongoose.model("User", UserSchema);

export default User;