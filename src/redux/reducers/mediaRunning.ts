import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface MediaRunningState {
  nftId?: string;
  state?: "playing" | "paused" | "ended" | null;
  // state?: "loading" | "playing" | "paused" | "ended" | null;
  listIdAudio?: string[];
  item?: any;
}

const initialState: MediaRunningState = {};

export const mediaRunningSlice = createSlice({
  name: "mediaRunning",
  initialState,
  reducers: {
    changeCurrentMediaRunning: (
      state,
      action: PayloadAction<MediaRunningState>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeStateMediaRunning: (
      state,
      action: PayloadAction<MediaRunningState["state"]>
    ) => {
      return {
        ...state,
        state: action.payload,
      };
    },
    removeMediaRunning: (state) => {
      return {
        listIdAudio: state.listIdAudio,
      };
    },
    //
    addNewIdListAudio: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        listIdAudio: [...(state.listIdAudio || []), action.payload],
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeCurrentMediaRunning,
  changeStateMediaRunning,
  removeMediaRunning,
  addNewIdListAudio,
} = mediaRunningSlice.actions;

export const selectCurrentMediaRunning = (state: RootState) =>
  state.mediaRunning;

export default mediaRunningSlice.reducer;
