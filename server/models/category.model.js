var mongoose = require("mongoose");
const {Schema} = mongoose;

const CategorySchema = new Schema({
    categoryname: {
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    }
})

const CategoryModel = mongoose.model('categories', CategorySchema);
module.exports = CategoryModel;