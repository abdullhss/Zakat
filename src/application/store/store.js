import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../../store/slices/fetchData";

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});
