const {Formating, catchHandleHelper} = require('../Helper/ResponseFormatter.js');
const UserService = require('../services/user.service.js');
const { msg, statusCode }  = require('../Helper/message') 

const Register = async function(req, res){
    try {
        let result = await UserService.FindUser({email: req.body.email});
        if(result){
            return res.send(Formating([],false,statusCode.badRequest, msg.userExist));
        }
        let newresult = await UserService.storeUserData(req.body);
        return res.send(Formating([],true,statusCode.success,msg.userRegistered));

    } catch (error) {
        catchHandleHelper(res, error);
    }
}


const Login = async function(req, res){
    try {
        const exist = await UserService.FindUser({email: req.body.email});
        if(exist){
            let token = await UserService.userLogin(req.body, exist);
            if(token){
                res.cookie('testcookie', token,{expires: new Date(Date.now() + 1000 * 60 * 60), httpOnly: true, path: '/'});
                return res.send(Formating([{token: token}],true,statusCode.success,msg.userLogedIn));
            }
        }
        return res.send(Formating([],false,statusCode.dataNotFound,msg.invalidUser));
    } catch (err) {
        catchHandleHelper(res, err);
    }
    
}

const Logout = async function(req,res){
    try{
        res.clearCookie('testcookie',{path:"/", httpOnly : true});
        return res.send(Formating([],true,statusCode.success, msg.userLogout));
    } catch(err){
        catchHandleHelper(res, err);
    }
}

const GetProfile = async function(req, res){
    try {
        const exist = await UserService.FindUser({email: req.body.email});
        if(!exist){
            return res.send(Formating([],false,statusCode.dataNotFound,msg.invalidUser));
        }
        let result = await UserService.getProfile(exist);
        return res.send(Formating([result],true,statusCode.success,msg.success));
        
    } catch (err) {
        catchHandleHelper(res, err);
    }
}


const UpdateProfile = async function(req,res){
    try {
          const result = await UserService.updateProfile(req.body);
          return res.send(Formating([],true,statusCode.success,msg.updateUser));

    } catch (err) {
        catchHandleHelper(res, err);
    }
}


const DeleteProfile = async function(req,res){
    try {
        const result = await UserService.deleteProfile(req.body);
        return res.send(Formating([],true,statusCode.success,msg.userDeleted));
    } catch (err) {
        catchHandleHelper(res, err);
    }
}


module.exports = {Register, Login, GetProfile, UpdateProfile, DeleteProfile, Logout};