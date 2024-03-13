import express from 'express';
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl } from '../controllers/brandsCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';

const brandsRouter = express.Router();
brandsRouter.post("/",isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get("/",getAllBrandsCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.delete("/:id",isLoggedIn, isAdmin, deleteBrandCtrl);
brandsRouter.put("/:id",isLoggedIn, isAdmin, updateBrandCtrl);


export default brandsRouter;