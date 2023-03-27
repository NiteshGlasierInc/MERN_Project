const {Formating, catchHandleHelper} = require('../Helper/ResponseFormatter.js');
const { msg, statusCode }  = require('../Helper/message');
const SubCategoryService = require('../services/subcategory.service');
const {FindOneCategory} = require('../services/category.service');

const CreateSubCategory = async function(req,res){
    try {
        const exist = await FindOneCategory({_id: req.body.categoryid});
        if(exist){
           const response = await SubCategoryService.CreateSubCategory(req.body);
           if(response){
            return res.send(Formating([],true,statusCode.success,msg.created));
           }
           return res.send(Formating([],false,statusCode.success,msg.subcategoryExist));
        }
        throw 404
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DisplaySubCategory = async function(req,res){
    try {
        const exist = await FindOneCategory({_id: req.body.id, status: true});
        if(exist){
            const response = await SubCategoryService.FindSubcategory({categoryid: req.body.id});
            if(response && response.length>0){
                return res.send(Formating(response,true,statusCode.success,msg.success));
            }
            return res.send(Formating([],false,statusCode.dataNotFound,msg.dataNotFound));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const UpdateSubCategory = async function(req,res){
    try {
        const exist = await SubCategoryService.UpdateSubCategory(req.body);
        if(exist){
            return res.send(Formating([],true,statusCode.success,msg.dataUpdated));
        }else if(exist === false){
            return res.send(Formating([],false,statusCode.dataNotFound,msg.fieldNotExist));
        }else{
            return res.send(Formating([],false,statusCode.dataNotFound,msg.dataNotFound));
        }
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DeleteSubCategory = async function(req,res){
    try {
        const result = await SubCategoryService.DeleteSubCategory(req.body);
        if(result){
            return res.send(Formating([],true,statusCode.success,msg.delete));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

module.exports = {CreateSubCategory, DisplaySubCategory, UpdateSubCategory, DeleteSubCategory};