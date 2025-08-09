import { configureStore } from '@reduxjs/toolkit'
import loggedUserReducer  from './slices/loggeduser'
import mastercommonReducer from './slices/mastercommonrecord'


export default configureStore({
  reducer: {
    'loggeduser' : loggedUserReducer,
    'mastercommonrecord': mastercommonReducer
  }
})