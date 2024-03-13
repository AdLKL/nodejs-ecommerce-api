import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";


// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin

export const createProductCtrl = asyncHandler(async(req, res) => {

    const convertedImgs = req.files.map((file) => file.path)

    const { name, description, category, sizes, price, totalQty, brand } = req.body;
    // Product exists
    const productExists = await Product.findOne({ name });
    if(productExists) {
        throw new Error("Product already exists");
    }
    // find brand
    const brandFound = await Brand.findOne({
        name: brand?.toLowerCase(),
     });
     if(!brandFound) {
        throw new Error("Brand not found, please create brand first or check brand name");
     }
    // find category
    const categoryFound = await Category.findOne({
        name: category,
     });
     if(!categoryFound) {
        throw new Error("Category not found, please create category first or check category name");
     }
    
    // create the product
    const product = await Product.create({
        name, description, category, sizes, user: req.userAuthId, price, totalQty, brand, images: convertedImgs,
    });
    // Push the product into category
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();
    //push the product into brand
    brandFound.products.push(product._id);
    //resave
    await brandFound.save();
    // send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
});

// @desc    Get all product
// @route   POST /api/v1/products
// @access  Public

export const getProductsCtrl = asyncHandler(async(req, res) => {
    // query
    let productQuery = Product.find();
    // Search by name
    if(req.query.name) {
        productQuery = productQuery.find({
            name: {$regex: req.query.name, $options: "i"}
            // The $regex operator in MongoDB allows performing pattern matching. And options will ignore the camelcasing.
        });
    }
    // filter by origine
    if(req.query.origine) {
        productQuery = productQuery.find({
            origine: {$regex: req.query.origine, $options: "i"}
            // The $regex operator in MongoDB allows performing pattern matching. And options will ignore the camelcasing.
        });
    }
    // filter by category
    if(req.query.category) {
        productQuery = productQuery.find({
            category: {$regex: req.query.category, $options: "i"}
            // The $regex operator in MongoDB allows performing pattern matching. And options will ignore the camelcasing.
        });
    }
    // filter by size
    if(req.query.size) {
        productQuery = productQuery.find({
            sizes: {$regex: req.query.size, $options: "i"}
            // The $regex operator in MongoDB allows performing pattern matching. And options will ignore the camelcasing.
        });
    }
    // filter by price range
    if(req.query.price) {
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            price: {$gte: priceRange[0], $lte: priceRange[1]},
        });
    }

    // pagination
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    // pagination results
    const pagination = {};
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    // If there are more documents beyond the current page, it adds a next object to the pagination object, containing the page number for the next page and the limit.
    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }
    // If the current page is not the first page, it adds a prev object to the pagination object, containing the page number for the previous page and the limit.
    // await the Query
    const products = await productQuery.populate("reviews");
    // The populate method convert the reviews into real object instead of giving us just the id
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    });
});

// @desc    Get single product
// @route   POST /api/v1/products/:id
// @access  Public

export const getProductCtrl = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id).populate("reviews");
    if(!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    })
})

// @desc    Update product
// @route   POST /api/v1/products/:id/update
// @access  Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
    const { name, description, category, sizes, user, price, totalQty, brand, } = req.body;

    // update
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name, description, category, sizes, user, price, totalQty, brand,
    },
    {
        new: true,
    });
    res.json({ 
        status: "success",
        message: "Product updated successfully",
        product,
    });
});

// @desc    Delete product
// @route   POST /api/v1/products/:id/delete
// @access  Private/Admin

export const deleteProductCtrl = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
});