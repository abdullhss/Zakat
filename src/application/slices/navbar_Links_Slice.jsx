import { createSlice } from "@reduxjs/toolkit";

const navbar_Links_Slice = createSlice({
  name: "navbar links",
  initialState: {
    selectedMenuLink: [],
  },
  reducers: {
    setSelectedMenuLinks: (state, action) => {
      console.log(action.payload);
      state.selectedMenuLink = action.payload;
      // setLocalStorage("navMenuLinks", action.payload);
    },
  },
});

export const { setSelectedMenuLinks } = navbar_Links_Slice.actions;
export default navbar_Links_Slice.reducer;
