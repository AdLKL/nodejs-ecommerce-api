import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";


// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin

export const createCategoryCtrl = asyncHandler(async(req, res) => {
    const { name } = req.body;
    //category exists
    const categoruFound = await Category.findOne({name});
    if(categoruFound) {
        throw new Error("Category already exists");
    }
    //create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    });
    res.json({
        status: "success",
        message: "Category created successfully",
        category,
    });
});

// @desc    Get all category
// @route   POST /api/v1/categories
// @access  Public

export const getAllCategoriesCtrl = asyncHandler(async(req, res) => {
    const categories = await Category.find();

    res.json({
        status: "success",
        message: "Categories fetched successfully",
        categories,
    });
});

// @desc    Get single category
// @route   POST /api/v1/categories/:id
// @access  Public

export const getSingleCategoriesCtrl = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
    });
});

// @desc    Update category
// @route   POST /api/v1/categories/:id
// @access  Private/admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // update
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name
    },
    {
        new: true,
    });
    res.json({ 
        status: "success",
        message: "Category updated successfully",
        category,
    });
});

// @desc    Delete category
// @route   POST /api/v1/categories/:id
// @access  Private/admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Category deleted successfully",
    });

});