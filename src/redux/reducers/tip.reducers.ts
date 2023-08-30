import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface TipState {
  activeTip?: any;
  userTips?: Array<any>;
}

const initialState: TipState = {
  activeTip: {},
  userTips: [],
};

export const TipSlice = createSlice({
  name: "tip",
  initialState,
  reducers: {
    changeActiveTip: (state, action: PayloadAction<TipState["activeTip"]>) => {
      return {
        ...state,
        activeTip: action.payload,
      };
    },
    changeUserTips: (state, action: PayloadAction<TipState["userTips"]>) => {
      return {
        ...state,
        userTips: action.payload,
      };
    },
  },
});

export const { changeActiveTip, changeUserTips } = TipSlice.actions;

export const selectCurrentTipState = (state: RootState) => state.tip;
export const selectCurrentActiveTip = (state: RootState) => state.tip.activeTip;
export const selectUserTips = (state: RootState) => state.tip.userTips;

export default TipSlice.reducer;
