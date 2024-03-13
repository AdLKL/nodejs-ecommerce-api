import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc    Register user
// @route   POST /api/v1/users/register
// @access  Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    // check if user exists
    const userExists = await User.findOne({ email });
    if(userExists) {
        //throw
        throw new Error("User already exists");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: "success",
        message: "User Registered Successfully",
        data: user,
    });
    // res.status(201) sets the HTTP status code of the response to 201, which indicates that a new resource has been successfully created
});

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public

export const loginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    // Find the user in the db by email
    const userFound = await User.findOne({
        email,
    });
    if(userFound && await bcrypt.compare(password, userFound?.password)) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            userFound,
            token: generateToken(userFound?._id),
        })
    } else {
        throw new Error("Invalid password or email.")
    }
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
    // find the user
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        user,
    })

});

// @desc    Update user shipping address
// @route   GET /api/v1/users/update/shipping
// @access  Private

export const updateShippingAddressCtrl = asyncHandler(async(req, res) => {
    const { firstname, lastName, address, city, postalCode, province, phone }= req.body;
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        ShippingAddress: {
            firstname, lastName, address, city, postalCode, province, phone,
        },
        hasShippingAddress: true,
    },
    {
        new: true,
    }
    );
    res.json({
        status: "success",
        message: "User shipping address updated successfully",
        user,
    })
})