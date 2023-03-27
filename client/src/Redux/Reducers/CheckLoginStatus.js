const initialState = false;

const CheckLoginStatus = (state = initialState, action)=>{
    switch (action.type) {
        case "LOGED": return action.payload;
        case "NOTLOGED": return action.payload;
        default: return state;
    }
}

export default CheckLoginStatus;