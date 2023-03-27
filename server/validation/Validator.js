var Joi = require("joi");
const { Formating } = require("../Helper/ResponseFormatter");
const { statusCode } = require('../Helper/message');

const slashremove = { errors: { wrap: { label: '' } } };

const registerValidator = (req, res, next) => {
    let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/[0-9]/).required(),
        password: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const loginValidator = (req, res, next) => {
    let schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const getProfileValidator = (req, res, next) => {
    let schema = Joi.object({
        email: Joi.string().email().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const updateProfileValidator = (req, res, next) => {
    let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]/).required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const deleteProfileValidator = (req, res, next) => {
    let schema = Joi.object({
        email: Joi.string().email().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const categoryValidator = (req, res, next) => {
    let schema = Joi.object({
        categoryname: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const updatecategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        categoryname: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const updatestatusValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        status: Joi.boolean().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const deletecategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const subcategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        subcategory: Joi.string().required(),
        categoryid: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const displaysubcategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const updatesubcategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        subcategoryname: Joi.string().required(),
        categoryid: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const deletesubcategoryValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const productValidator = (req, res, next) => {
    let schema = Joi.object({
        subcategoryid: Joi.string().required(),
        product: Joi.string().required(),
        categoryid: Joi.string().required(),
        price: Joi.string().required(),
        //productimage: Joi.binary()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const displayproductValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const displayproductpageValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        currpage: Joi.number().required(),
        itemsperpage: Joi.number().required(),
        search: Joi.string().empty('')
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}


const updateproductValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        productname: Joi.string().required(),
        subcategoryid: Joi.string().required(),
        categoryid: Joi.string().required(),
        price: Joi.string().required(),
        path: Joi.array().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const deleteproductValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const getproductValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const deleteimageValidator = (req, res, next) => {
    let schema = Joi.object({
        id: Joi.string().required(),
        path: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body, slashremove);
    if (error) {
        return res.send(Formating([], false, statusCode.badRequest, error.details[0].message))
    }
    return next();
}

const csv2jsonValidator = (data) => {
    let schema = Joi.object({
        categoryName: Joi.string().required(),
        subCategoryName: Joi.string().required(),
        productName: Joi.string().required(),
        price: Joi.string().required(),
        status: Joi.boolean().required(),
    })

    let services = Joi.array().items(schema)

    const { error, value } = services.validate(data, slashremove);
    return { error, value };
}

module.exports = { registerValidator, loginValidator, getProfileValidator, updateProfileValidator, deleteProfileValidator, categoryValidator, subcategoryValidator, productValidator, displayproductValidator, displaysubcategoryValidator, updateproductValidator, updatecategoryValidator, updatesubcategoryValidator, deletecategoryValidator, deletesubcategoryValidator, deleteproductValidator, getproductValidator, deleteimageValidator, csv2jsonValidator, updatestatusValidator, displayproductpageValidator };
