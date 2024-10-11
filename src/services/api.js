import axios from "../utils/axios-customize";

export const CallRegister = function(fullName, email, password, phone){
    return axios.post('/api/v1/user/register', {fullName, email, password, phone})
};