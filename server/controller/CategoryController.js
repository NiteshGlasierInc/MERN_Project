const {Formating, catchHandleHelper} = require('../Helper/ResponseFormatter.js');
const { msg, statusCode }  = require('../Helper/message');
const CategoryService = require('../services/category.service');

const CreateCategory = async function(req,res){
    try {
        const exist = await CategoryService.FindOneCategory({categoryname: req.body.categoryname});
        if(exist){
            return res.send(Formating([],false,statusCode.success, msg.categoryExist));
        }
        let result = await CategoryService.CreateCategory(req.body);
        return res.send(Formating([],true,statusCode.success,msg.created));
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DisplayCategory = async function(req,res){
    try {
        const exist = await CategoryService.FindCategory({});
        if(exist && exist.length>0){
            return res.send(Formating(exist,true,statusCode.success,msg.success));
        }
        return res.send(Formating([],false,statusCode.dataNotFound,msg.dataNotFound));
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const UpdateCategory = async function(req,res){
    try {
        const exist = await CategoryService.UpdateCategory(req.body);
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

const DeleteCategory = async function(req,res){
    try {
        const result = await CategoryService.DeleteCategory(req.body);
        if(result){
            return res.send(Formating([],true,statusCode.success,msg.delete));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}


module.exports = {CreateCategory, DisplayCategory, UpdateCategory, DeleteCategory};
