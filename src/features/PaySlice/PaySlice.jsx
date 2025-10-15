import { createSlice } from "@reduxjs/toolkit";

const PaySlice = createSlice({
  name: "pay",
  initialState: {
    showPayPopup: false,
    popupComponent: null,
    popupTitle: "",

    popups: [],
  },
  reducers: {
    setShowPopup: (state, action) => {
      state.showPayPopup = action.payload;
    },
    setPopupComponent: (state, action) => {
      state.popupComponent = action.payload;
    },
    setPopupTitle: (state, action) => {
      state.popupTitle = action.payload;
    },

    openPopup: (state, action) => {
      state.popups.push({
        title: action.payload?.title || "",
        component: action.payload?.component || null,
      });
    },
    closePopup: (state) => {
      if (state.popups.length > 0) {
        state.popups.pop();
      } else {
        state.showPayPopup = false;
        state.popupComponent = null;
        state.popupTitle = "";
      }
    },
    closeAllPopups: (state) => {
      state.popups = [];
      state.showPayPopup = false;
      state.popupComponent = null;
      state.popupTitle = "";
    },
  },
});

export const {
  setShowPopup,
  setPopupComponent,
  setPopupTitle,
  openPopup,
  closePopup,
  closeAllPopups,
} = PaySlice.actions;

export default PaySlice.reducer;
