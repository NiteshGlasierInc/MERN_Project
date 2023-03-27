var mongoose = require("mongoose");
var bcrypt = require('bcrypt/bcrypt.js');

const {Schema} = mongoose;

const UserSchema  = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required.']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Email is required.']
    },
    phone:{
        type: Number,
        required: [true, 'Phone is required.'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required.']
    },
    tokens:[
        {
            token : {
                type: String,
                required: true
            },
            time : String
        }
    ]
});

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;