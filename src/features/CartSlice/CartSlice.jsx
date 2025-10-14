import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cartData: {},
    loading: false,
    error: null,
  },
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
  },
});

export const { setCartData } = CartSlice.actions;
export default CartSlice.reducer;
