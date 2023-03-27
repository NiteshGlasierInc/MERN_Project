const Formating = (data, flag, code, msg)=>{
    const res = {
        "status": flag,
        "status_code": code,
        "message": msg,
        "data" : data
    }
    return res;
}

const catchHandleHelper = (res, error) => {
    console.log(error)
    if (error.name == "ValidationError") {
        const errorMessage = error.errors[Object.keys(error.errors)[0]]
        return res.send(Formating([],false,400,errorMessage.message));
    } else if(error.name == "MongoServerError"){
        const errorMessage = Object.keys(error.keyPattern)[0] + " already exist";
        return res.send(Formating([],false,400,errorMessage));
    }else {
        return res.send(Formating([],false,400,"something went wrong"));
    }
}


module.exports = {Formating, catchHandleHelper};