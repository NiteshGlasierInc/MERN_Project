export const loged = (val)=>{
    return {
        type: "LOGED",
        payload: val
    }
}

export const notloged = (val)=>{
    return {
        type: "NOTLOGED",
        payload: val
    }
}
