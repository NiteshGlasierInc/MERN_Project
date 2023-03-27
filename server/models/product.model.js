var mongoose = require("mongoose");
const CategoryModel = require("./category.model");
const SubCategoryModel = require("./sub_category.model");
const {Schema} = mongoose;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    subcategoryid: {
        type: String,
        ref: SubCategoryModel,
        required : true
    },
    categoryid: {
        type: String,
        ref: CategoryModel,
        required : true
    },
    price : {
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    productimage: {
        type: Array,
        required: true
    }  
})

const ProductModel = mongoose.model('products', ProductSchema);
module.exports = ProductModel;