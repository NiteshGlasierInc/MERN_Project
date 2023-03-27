const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt/bcrypt.js');
var jwt = require("jsonwebtoken");

const FindUser = async (data)=>{
    const res = await UserModel.findOne(data);
    return res;
}

const storeUserData = async (data)=>{
    try {
        let {name, email, phone, password} = data;
        let obj = new UserModel({name, email, phone, password});
        await obj.save();
        return obj;
    } catch (error) {
        throw error
    }
}

const userLogin = async (data, exist)=>{
    try {
        let ismatch = await bcrypt.compare(data.password, exist.password);
        if(ismatch){
           let token = await generateAuthToken(exist);
           console.log(token)
           return token;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

const generateAuthToken = async function (obj){
    try {
        let token = jwt.sign({_id: obj._id}, process.env.SECRETKEY);
        obj.tokens = obj.tokens.concat({token : token, time : Date()})
        await obj.save();
        console.log(token)
        return token;

    } catch (error) {
        throw error;
    }
}

const getProfile = async (exist)=>{
    try {
        const userdetails = {name: "",email: "", phone: ""};
        userdetails.name = exist.name;
        userdetails.email = exist.email;
        userdetails.phone = exist.phone;
        return userdetails;
    } catch (error) {
        throw error;
    }
}

const updateProfile = async (data)=>{
    try {
        let {name, email, phone} = data;
        let res = await UserModel.findOneAndUpdate({email: email},{
            $set : {name: name, phone : phone}
        });
        if(res){
            return res;
        }
        throw "Data not found";
    } catch (error) {
        throw error;
    }
}

const deleteProfile = async (data)=>{
    try {
        const res = await UserModel.findOneAndDelete({email: data.email});
        if(res){
            return res;
        }
        throw "Data not found";
    } catch (error) {
        throw error;
    }
}

module.exports = {storeUserData, FindUser, userLogin, getProfile, updateProfile, deleteProfile};