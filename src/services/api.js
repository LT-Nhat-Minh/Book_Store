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
    return axios.get(`/api/v1/user${query}`)
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

export const callFetchBook = (query) => {
    return axios.get (`/api/v1/book${query}`)
}

export const callUploadBook = (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', file)
    return axios.post (`api/v1/file/upload`, bodyFormData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book",
        }
    })
}

export const callCreateBook = (file) => {
    return axios.post("http://localhost:8080/api/v1/book", file)
}

export const callUpdateBook = (file) => {
    return axios.put(`/api/v1/book/${file._id}`, file)
}


export const callDeleteBook = (_id) => {
    return axios.delete (`/api/v1/book/${_id}`)
}

export const callFetchCategory = () => {
    return axios.get (`/api/v1/database/category`)
}
