var jwt = require("jsonwebtoken");
var UserModel = require('../models/user.model.js');
const {msg, statusCode} = require('../Helper/message');
const {Formating, catchHandleHelper} = require('../Helper/ResponseFormatter.js');

const Authenticate = async (req,res,next)=>{
    try {
        const token = req.cookies.testcookie;
        if(token === undefined){
            return res.send(Formating([],false,statusCode.badRequest,msg.noToken));
        }
        const verifytoken = jwt.verify(token, process.env.SECRETKEY);
        const rootUser = await UserModel.findOne({_id: verifytoken._id, 'tokens.token': token});
        if(!rootUser || rootUser.email !== req.body.email){
            res.clearCookie('testcookie',{ httpOnly: true,path: '/',secure: true})
            return res.send(Formating([],false,statusCode.badRequest,msg.unAuthorized));
        }
        req.token = token;
        req.rootEmail = rootUser.email;
        next();
    } catch (err) {
        catchHandleHelper(res, err);
    }
}

module.exports = Authenticate;