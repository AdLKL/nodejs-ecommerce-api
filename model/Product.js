import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        ref: "Category",
        required: true,
    },
    sizes:{
        type: [String],
        enums: ["1L", "0.75L", "0.5L", "0.25L"],
        required: true,
    },
    benefits:{
        type: String,
        default: "",
    },
    usage_tips:{
        type: String,
        default: "",
    },
    composition:{
        type: String,
        default: "",
    },
    origine:{
        type: String,
        default: "",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    price:{
        type: Number,
        required: true,
    },
    totalQty:{
        type: Number,
        required: true,
    },
    totalSold:{
        type: String,
        required: true,
        default: 0,
    },
    
},
{
    timestamps:true,
    toJSON: { virtuals: true },
    // meaning that we want to populate the IDs into real objects
}
);
// Virtuals (properties that doesnt persist on the record inside our database but upon quering we can have that property on the model)
// qty left
ProductSchema.virtual("qtyLeft").get(function() {
    const product = this;
    return product.totalQty - product.totalSold;
})
// Total rating
ProductSchema.virtual("totalReviews").get(function() {
    const product = this;
    return product?.reviews?.length;
});
// Average Rating
ProductSchema.virtual("averageRating").get(function() {
    let ratingsTotal = 0;
    const product = this;
    product?.reviews?.forEach((review) => {
        ratingsTotal += review?.rating;
    });
    // calc average rating
    const averageRating = Number(ratingsTotal/product?.reviews?.length).toFixed(1);
});

// compile the schema to model
const Product = mongoose.model("Product", ProductSchema);

export default Product;