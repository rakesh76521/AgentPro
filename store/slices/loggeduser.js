import { createSlice } from '@reduxjs/toolkit'


export const loggeduserslice = createSlice({
  name: "loggeduser",
  initialState: {
    user: localStorage.getItem("demologged-user") ? JSON.parse(localStorage.getItem("demologged-user")) : null,
  },
  reducers: {
    setLoggedUser :(state , action)=>{
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null; // Reset user to null
    }
  }
})

export const {setLoggedUser,clearUser} =  loggeduserslice.actions

export default loggeduserslice.reducer