const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controller/UserController.js');
const CategoryController = require('../controller/CategoryController');
const SubCategoryController = require('../controller/SubCategoryController');
const ProductController = require('../controller/ProductController');
const Authenticate = require('../middleware/Authenticate.js');
const Validation = require('../validation/Validator');
const path = require('path');
require('../dbconnection/db.js');

const ImagePath = 'Images/productImages/';
const CsvFilePath = 'csvFiles/';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ImagePath);
  },

  filename: function (req, files, cb) {
    cb(null, files.fieldname + '-' + Date.now() + Math.floor(Math.random() * 100) + 1 + path.extname(files.originalname));
  }
});
const csvstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CsvFilePath);
  },

  filename: function (req, files, cb) {
    cb(null, 'data' + path.extname(files.originalname));
  }
});

const upload = multer({ storage: storage });
const csvupload = multer({storage: csvstorage});
// const upload = multer({ dest: 'uploads/' })


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', Validation.registerValidator, UserController.Register);
router.post('/login', Validation.loginValidator, UserController.Login)
router.post('/get/profile', Authenticate, Validation.getProfileValidator, UserController.GetProfile);
router.post('/update/profile', Authenticate, Validation.updateProfileValidator, UserController.UpdateProfile);
router.post('/delete/profile', Authenticate, Validation.deleteProfileValidator, UserController.DeleteProfile);
router.post('/create/category', Validation.categoryValidator, CategoryController.CreateCategory);
router.post('/display/category', CategoryController.DisplayCategory);
router.post('/update/category', Validation.updatecategoryValidator, CategoryController.UpdateCategory);
router.post('/update/category/status', Validation.updatestatusValidator, CategoryController.UpdateCategory)
router.post('/delete/category', CategoryController.DeleteCategory);
router.post('/create/subcategory', Validation.subcategoryValidator, SubCategoryController.CreateSubCategory);
router.post('/display/subcategory', Validation.displaysubcategoryValidator, SubCategoryController.DisplaySubCategory);
router.post('/update/subcategory', Validation.updatesubcategoryValidator, SubCategoryController.UpdateSubCategory);
router.post('/update/subcategory/status', Validation.updatestatusValidator, SubCategoryController.UpdateSubCategory);
router.post('/delete/subcategory', Validation.deletesubcategoryValidator, SubCategoryController.DeleteSubCategory);
router.post('/create/product', upload.array('productimage'), Validation.productValidator, ProductController.CreateProduct); // function (req, res, next) {next();}
router.post('/display/products', Validation.displayproductValidator, ProductController.DisplayProducts);
router.post('/display/products/page', Validation.displayproductpageValidator, ProductController.DisplayProductsPage);
router.post('/update/product', upload.array('productimage'), Validation.updateproductValidator, ProductController.UpdateProduct);
router.post('/update/product/status', Validation.updatestatusValidator, ProductController.UpdateProductStatus);
router.post('/delete/product', Validation.deleteproductValidator, ProductController.DeleteProduct);
router.post('/get/product', Validation.getproductValidator, ProductController.GetProduct);
router.post('/delete/image', Validation.deleteimageValidator, ProductController.DeleteProductImage);
router.post('/csv/product/details', ProductController.Json2csvProduct);
router.post('/csvtojson', csvupload.array('csvfile'), ProductController.CsvtoJson);
router.post('/logout', UserController.Logout);


module.exports = router;
