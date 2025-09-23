// store/slices/dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { executeProcedure } from "../../services/apiServices";

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async ({ procedureName, parameters }, { rejectWithValue }) => {
    try {
      const response = await executeProcedure(procedureName, parameters);

      if (!response.success) {
        return rejectWithValue(response.error);
      }

      // Parse JSON strings into objects
      const parsedData = {};
      Object.keys(response.decrypted).forEach((key) => {
        try {
          parsedData[key] = JSON.parse(response.decrypted[key]);
        } catch (e) {
          throw new Error("Somthing Wend Wrong ,", e);
        }
      });

      return parsedData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    newsData: [],
    projectsData: [],
    officesData: [],
    subventionsData: [],

    // Loading states
    loading: false,
    error: null,

    // Last fetch timestamp
    lastFetched: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.newsData = [];
      state.projectsData = [];
      state.officesData = [];
      state.subventionsData = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastFetched = Date.now();

        // Update individual data arrays
        if (action.payload.NewsData) {
          state.newsData = action.payload.NewsData;
        }
        if (action.payload.ProjectsData) {
          state.projectsData = action.payload.ProjectsData;
        }
        if (action.payload.OfficesData) {
          state.officesData = action.payload.OfficesData;
        }
        if (action.payload.SubventionsData) {
          state.subventionsData = action.payload.SubventionsData;
        }
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export const { clearError, clearData } = dataSlice.actions;
export default dataSlice.reducer;

// Selectors
export const selectNewsData = (state) => state.data.newsData;
export const selectProjectsData = (state) => state.data.projectsData;
export const selectOfficesData = (state) => state.data.officesData;
export const selectSubventionsData = (state) => state.data.subventionsData;
export const selectDataLoading = (state) => state.data.loading;
export const selectDataError = (state) => state.data.error;
