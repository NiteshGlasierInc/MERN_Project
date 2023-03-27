const { Formating, catchHandleHelper } = require('../Helper/ResponseFormatter.js');
const { FindOneCategory, FindCategory } = require('../services/category.service');
const { FindOneSubcategory, FindSubcategory } = require('../services/subcategory.service');
const { msg, statusCode } = require('../Helper/message');
const ProductService = require('../services/product.service');
const fs = require('fs');
const { AsyncParser } = require('@json2csv/node');
const csv = require('csvtojson');
const { csv2jsonValidator } = require('../validation/Validator.js');

const CreateProduct = async function (req, res) {
    try {
        const res1 = await FindOneCategory({ _id: req.body.categoryid });
        if (res1) {
            const res2 = await FindOneSubcategory({ _id: req.body.subcategoryid, categoryid: req.body.categoryid });
            if (res2) {
                if (req.files?.length === 0) {
                    return res.send(Formating([], false, statusCode.dataNotFound, msg.productimage));
                }
                const result = await ProductService.CreateProduct(req.body, req.files);
                if (result) {
                    return res.send(Formating([], true, statusCode.success, msg.created));
                }
                return res.send(Formating([], false, statusCode.success, msg.productExist));
            }
        }
        throw 404
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DisplayProducts = async function (req, res) {
    try {
        const res1 = await FindSubcategory({ _id: req.body.id, status: true });
        if (res1 && res1[0].categoryid?.status) {
            const result = await ProductService.FindProduct({ subcategoryid: req.body.id });
            if (result && result.length > 0) {
                return res.send(Formating(result, true, statusCode.success, msg.success));
            }
        }
        return res.send(Formating([], false, statusCode.dataNotFound, msg.dataNotFound));
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DisplayProductsPage = async function (req, res) {
    try {
        const products_per_page = req.body.itemsperpage;
        const current_page = req.body.currpage - 1;
        const search = req.body.search;
        const res1 = await FindSubcategory({ _id: req.body.id, status: true });
        if (res1 && res1[0].categoryid?.status) {
            let result;
            if(search){
                result = await ProductService.FindProductPage({ subcategoryid: req.body.id, productName: {$regex: search, $options: 'i'}}, current_page, products_per_page);
            }else{
                result = await ProductService.FindProductPage({ subcategoryid: req.body.id }, current_page, products_per_page);
            }
            if (result && result.length > 0) {
                return res.send(Formating(result, true, statusCode.success, msg.success));
            }
        }
        return res.send(Formating([], false, statusCode.dataNotFound, msg.dataNotFound));
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const UpdateProduct = async function (req, res) {
    try {
        if (req.files?.length === 0) {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.productimage));
        }
        const exist = await ProductService.UpdateProduct(req.body, req.files);
        if (exist) {
            req.body.path?.map((ele) => {
                let filePath = ele;
                fs.unlinkSync(filePath, function (err) { if (err) { } });
            })
            return res.send(Formating([], true, statusCode.success, msg.dataUpdated));
        } else if (exist === false) {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.fieldNotExist));
        } else {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.dataNotFound));
        }
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const UpdateProductStatus = async function (req, res) {
    try {
        const exist = await ProductService.UpdateStatus(req.body);
        if (exist) {
            return res.send(Formating([], true, statusCode.success, msg.dataUpdated));
        } else if (exist === false) {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.fieldNotExist));
        } else {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.dataNotFound));
        }
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const GetProduct = async function (req, res) {
    try {
        const exist = await ProductService.FindOneProduct({ _id: req.body.id });
        if (exist) {
            return res.send(Formating([exist], true, statusCode.success, msg.success));
        }
        return res.send(Formating([], false, statusCode.dataNotFound, msg.dataNotFound));
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DeleteProduct = async function (req, res) {
    try {
        const result = await ProductService.DeleteProduct(req.body);
        if (result) {
            return res.send(Formating([], true, statusCode.success, msg.delete));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const DeleteProductImage = async function (req, res) {
    try {
        const result = await ProductService.DeleteProductImage(req.body);
        if (result) {
            let filePath = req.body.path;
            fs.unlinkSync(filePath);
            return res.send(Formating([], true, statusCode.success, msg.delete));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

const Json2csvProduct = async function (req, res) {
    try {

        const result = await ProductService.FindProduct({});
        if (result && result.length > 0) {
            result.map((ele) => {
                ele.categoryname = ele.subcategoryid?.categoryid?.categoryname ?? "";
                ele.subcategoryname = ele.subcategoryid?.subcategoryname ?? "";
                delete ele.categoryid;
                delete ele.subcategoryid;
                delete ele._id;
                delete ele.__v;
                ele.productimage = ele.productimage ? null : "";
                delete ele.productimage;
            })
            const parser = new AsyncParser();
            const csv = await parser.parse(result).promise();
            fs.writeFileSync('./newdata.csv', csv);
            const filePath = './newdata.csv';
            return res.download(filePath);
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}


const CsvtoJson = async function (req, res) {
    try {
        const csvFilePath = './csvFiles/data.csv';
        const jsonObj = await csv().fromFile(csvFilePath);
        fs.unlinkSync('csvFiles/data.csv');
        if (!jsonObj) {
            return res.send(Formating([], false, statusCode.dataNotFound, msg.invalidFile));
        }
        const { error, value } = await csv2jsonValidator(jsonObj);
        if (error) {
            return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
        }

        let categoryNameArray = jsonObj.map(item => item.categoryName);
        let subCategoryNameArray = jsonObj.map(item => item.subCategoryName);

        const res1 = await FindCategory({ categoryname: { $in: categoryNameArray } });
        const res2 = await FindSubcategory({ subcategoryname: { $in: subCategoryNameArray } });
        
        for (let ele of jsonObj) {
            const newres = res1.find((x) => { return x.categoryname === ele.categoryName; });
            if (!newres) {
                return res.send(Formating([ele], false, statusCode.dataNotFound, msg.categoryNotFound));
            }
            ele.categoryid = newres._id;

            const newres1 = res2.find((x) => { return x.subcategoryname === ele.subCategoryName && x.categoryid.categoryname === ele.categoryName; });
            if (!newres1) {
                return res.send(Formating([ele], false, statusCode.dataNotFound, msg.subcategoryNotFound));
            }
            ele.subcategoryid = newres1._id;

            const exist = await ProductService.FindOneProduct({ productName: ele.productName, categoryid: ele.categoryid, subcategoryid: ele.subcategoryid });
            if (exist) {
                return res.send(Formating([ele], false, statusCode.conflict, msg.productExist));
            }
            ele.status = ele.status || ele.status == 'true' ? true : false;
            delete ele.categoryName;
            delete ele.subCategoryName;
        }
        const response = await ProductService.InsertProducts(jsonObj);
        if (response) {
            return res.send(Formating([], true, statusCode.success, msg.dataInserted));
        }
        throw 404;
    } catch (error) {
        catchHandleHelper(res, error);
    }
}

module.exports = { CreateProduct, DisplayProducts, UpdateProduct, DeleteProduct, GetProduct, DeleteProductImage, Json2csvProduct, CsvtoJson, UpdateProductStatus, DisplayProductsPage };
