const CategoryModel = require('../models/category.model');

const FindOneCategory = async (data)=>{
    const res = await CategoryModel.findOne(data);
    return res;
}
const FindCategory = async (data)=>{
    const res = await CategoryModel.find(data).lean();
    return res;
}

const CreateCategory = async (data)=>{
    try {
        let obj = new CategoryModel({categoryname: data.categoryname});
        await obj.save();
        return obj;
    } catch (error) {
        throw error
    }
}


const UpdateCategory = async (data)=>{
    try {
        const id = data.id;
        delete data.id;
        if(JSON.stringify(data) !== '{}'){
            const res = await CategoryModel.findOneAndUpdate({_id: id}, {$set: data});
            return res;
        }
        return false;
    } catch (error) {
        throw error
    }
}

const DeleteCategory = async (data)=>{
    try {
        const res = await CategoryModel.findOneAndDelete({_id: data.id});
        return res;
    } catch (error) {
        throw error
    }
}

module.exports = {FindCategory, FindOneCategory, CreateCategory, UpdateCategory, DeleteCategory};