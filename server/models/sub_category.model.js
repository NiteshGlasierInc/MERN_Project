var mongoose = require("mongoose");
const CategoryModel = require("./category.model");
const {Schema} = mongoose;

const SubCategorySchema = new Schema({
    subcategoryname: {
        type: String,
        required: true
    },
    categoryid : {
        type: String,
        ref: CategoryModel,
        required: true
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    }
})

const SubCategoryModel = mongoose.model('subcategories', SubCategorySchema);
module.exports = SubCategoryModel;