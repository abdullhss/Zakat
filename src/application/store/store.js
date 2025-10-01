import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../../store/slices/fetchData";
import PayReducer from "../../features/PaySlice/PaySlice"

export const store = configureStore({
  reducer: {
    data: dataReducer,
    pay : PayReducer
  },
});
