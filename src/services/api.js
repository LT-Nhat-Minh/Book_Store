import axios from '../utils/axios-customize';

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password, delay:1000 })
}

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callFetchUser = (query) => {
    return axios.get(`/api/v1/${query}`)
}

export const callCreateAUser = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user', {fullName, password, email, phone})
}

export const callImportUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put ('/api/v1/user',{_id, fullName, phone})
}

export const callDeleteUser = (_id) => {
    return axios.delete (`/api/v1/user/${_id}`)
}