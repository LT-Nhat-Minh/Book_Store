import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
            "email": "",
            "phone": "",
            "fullName": "",
            "role": "",
            "avatar": "",
            "id": ""
        },
  status: 'idle',
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doLoginAction: (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
    },
    doGetAccountAction: (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.user;
    },
    doLogoutAction: (state) => {
      localStorage.removeItem('access_token');
      state.isAuthenticated = false;
      state.isLoading = true;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
    }
    },
  },

  extraReducers: () => {

}});

export const {doLoginAction, doGetAccountAction, doLogoutAction} = accountSlice.actions;

export default accountSlice.reducer;
