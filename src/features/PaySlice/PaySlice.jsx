import { createSlice } from "@reduxjs/toolkit";

const PaySlice = createSlice({
  name: "pay",
  initialState: {
    showPayPopup: false,
    popupComponent: null,
    popupTitle:"",
  },
  reducers: {
    setShowPopup: (state, action) => {
      state.showPayPopup = action.payload;
    },
    setPopupComponent: (state, action) => {
      state.popupComponent = action.payload;
    },
    setPopupTitle : (state , action)=>{
      state.popupTitle = action.payload
    }
  },
});

export const {setShowPopup, setPopupComponent , setPopupTitle } = PaySlice.actions;
export default PaySlice.reducer;
