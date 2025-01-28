import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./slice/userSlice"
import contentSlice from "./slice/contenSlice"

const store  = configureStore({
    reducer:{
        auth: authSlice,
        content:contentSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store