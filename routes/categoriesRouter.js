import express from 'express';
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoriesCtrl, updateCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryFileUpload from '../config/categoryUpload.js.js';


const categoriesRouter = express.Router();
categoriesRouter.post("/",isLoggedIn, categoryFileUpload.single("file"), createCategoryCtrl);

categoriesRouter.get("/",getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoriesCtrl);
categoriesRouter.delete("/:id",isLoggedIn, deleteCategoryCtrl);
categoriesRouter.put("/:id",isLoggedIn, updateCategoryCtrl);


export default categoriesRouter;