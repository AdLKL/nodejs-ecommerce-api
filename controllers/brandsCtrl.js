import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";


// @desc    Create new brand
// @route   POST /api/v1/categories
// @access  Private/Admin

export const createBrandCtrl = asyncHandler(async(req, res) => {
    const { name } = req.body;
    //brand exists
    const brandFound = await Brand.findOne({name});
    if(brandFound) {
        throw new Error("Category already exists");
    }
    //create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "Brand created successfully",
        brand,
    });
});

// @desc    Get all brands
// @route   POST /api/v1/brands
// @access  Public

export const getAllBrandsCtrl = asyncHandler(async(req, res) => {
    const brands = await Brand.find();

    res.json({
        status: "success",
        message: "Brands fetched successfully",
        brands,
    });
});

// @desc    Get single brand
// @route   POST /api/v1/brands/:id
// @access  Public

export const getSingleBrandCtrl = asyncHandler(async(req, res) => {
    const brand = await Brand.findById(req.params.id);

    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });
});

// @desc    Update brand
// @route   POST /api/v1/brands/:id
// @access  Private/admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // update
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name
    },
    {
        new: true,
    });
    res.json({ 
        status: "success",
        message: "Brand updated successfully",
        brand,
    });
});

// @desc    Delete brand
// @route   POST /api/v1/brands/:id
// @access  Private/admin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });

});