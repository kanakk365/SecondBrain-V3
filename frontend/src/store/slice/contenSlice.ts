import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentState {
  summary: string | null;
  open: boolean;
}

const initialState: ContentState = {
  summary: "",
  open: false
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSummary: (state, action: PayloadAction<string | null>) => {
      state.summary = action.payload;
    },
    clearSummary: (state) => {
      state.summary = null;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    }
  }
});

export const { setSummary, clearSummary, setOpen } = contentSlice.actions;
export default contentSlice.reducer;