import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../../store/slices/fetchData";
import PayReducer from "../../features/PaySlice/PaySlice"
import cartReducer from "../../features/CartSlice/CartSlice";
export const store = configureStore({
  reducer: {
    data: dataReducer,
    pay : PayReducer,
    cart : cartReducer,
  },
});
