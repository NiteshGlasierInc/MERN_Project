const ProductModel = require('../models/product.model');

const FindProduct = async (data)=>{
    const res = await ProductModel.find(data).lean().populate({path: 'subcategoryid', populate: {path: 'categoryid'}});
    return res;
}

const FindProductPage = async (data, current_page, products_per_page)=>{
    const result = await ProductModel.find(data).lean().populate({path: 'subcategoryid', populate: {path: 'categoryid'}}).skip(products_per_page * current_page).limit(products_per_page);
    return result;
}

const FindOneProduct = async (data)=>{
    const res = await ProductModel.findOne(data).populate({path: 'subcategoryid', populate: {path: 'categoryid'}});
    return res;
}

const CreateProduct = async (data, files)=>{
    try {
        const exist = await FindOneProduct({productName: data.product, categoryid: data.categoryid});
        if(exist){
          return false;
        }
        const list = new Array();
        files?.map((ele)=>{
           path = ele.destination + ele.filename;
           list.push(path);
        });
        var obj = new ProductModel({productName: data.product, subcategoryid: data.subcategoryid, categoryid: data.categoryid, price: data.price, productimage: list});
        await obj.save();
        return obj;
    } catch (error) {
        throw error
    }
}


const UpdateProduct = async (data, files)=>{
    try {
        const id = data.id;
        delete data.id;
        if(JSON.stringify(data) !== '{}'){
            const list = new Array();
            files?.map((ele)=>{
                path = ele.destination + ele.filename;
                list.push(path);
            });
            data.productimage = list;
            const res = await ProductModel.findOneAndUpdate({_id: id}, {$set: data});
            return res;
        }
        return false;
    } catch (error) {
        throw error
    }
}

const UpdateStatus = async (data)=>{
    try {
        const id = data.id;
        delete data.id;
        if(JSON.stringify(data) !== '{}'){
            const res = await ProductModel.findOneAndUpdate({_id: id}, {$set: data});
            return res;
        }
        return false;
    } catch (error) {
        throw error
    }
}


const DeleteProduct = async (data)=>{
    try {
        const res = await ProductModel.findOneAndDelete({_id: data.id});
        return res;
    } catch (error) {
        throw error
    }
}

const DeleteProductImage = async (data)=>{
    try {
        const res = await ProductModel.findOneAndUpdate({_id: data.id, productimage: data.path}, { $pull : {productimage: data.path}});
        return res;
    } catch (error) {
        throw error
    }
}

const InsertProducts = async (data)=>{
    try {
        const res = await ProductModel.insertMany(data);
        return res;
    } catch (error) {
        throw error
    }
}


module.exports = {FindProduct, FindOneProduct, CreateProduct, UpdateProduct, DeleteProduct, DeleteProductImage, InsertProducts, FindProductPage, UpdateStatus};