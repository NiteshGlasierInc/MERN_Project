const SubCategoryModel = require('../models/sub_category.model');

const FindSubcategory = async (data)=>{
    const res = await SubCategoryModel.find(data).populate({path: 'categoryid'});
    return res;
}

const FindOneSubcategory = async (data)=>{
    const res = await SubCategoryModel.findOne(data);
    return res;
}

const CreateSubCategory = async (data)=>{
    try {
        const exist = await FindSubcategory({subcategoryname: data.subcategory, categoryid: data.categoryid});
        if(exist && exist.length>0){
            return false;
        }
        var obj = new SubCategoryModel({subcategoryname: data.subcategory, categoryid: data.categoryid});
        await obj.save();
        return obj;
    } catch (error) {
        throw error
    }
}


const UpdateSubCategory = async (data)=>{
    try {
        const id = data.id;
        delete data.id;
        if(JSON.stringify(data) !== '{}'){
            const res = await SubCategoryModel.findOneAndUpdate({_id: id}, {$set: data});
            return res;
        }
        return false;
    } catch (error) {
        throw error
    }
}

const DeleteSubCategory = async (data)=>{
    try {
        const res = await SubCategoryModel.findOneAndDelete({_id: data.id});
        return res;
    } catch (error) {
        throw error
    }
}

module.exports = {FindSubcategory, FindOneSubcategory, CreateSubCategory, UpdateSubCategory, DeleteSubCategory};