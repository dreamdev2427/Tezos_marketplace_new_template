import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface FollowState {
  isExists?: Boolean;
  follow?: any;
  followlist?: Array<any>;
  followinglist?: Array<any>;
}

const initialState: FollowState = {
  isExists: false,
  follow: {},
  followlist: [],
  followinglist: [],
};

export const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    changeFollow: (state, action: PayloadAction<FollowState["follow"]>) => {
      return {
        ...state,
        follow: action.payload,
      };
    },
    changeFollowList: (
      state,
      action: PayloadAction<FollowState["followlist"]>
    ) => {
      return {
        ...state,
        followlist: action.payload,
      };
    },
    changeFollowingList: (
      state,
      action: PayloadAction<FollowState["followinglist"]>
    ) => {
      return {
        ...state,
        followinglist: action.payload,
      };
    },
    changeIsExists: (state, action: PayloadAction<FollowState["isExists"]>) => {
      return {
        ...state,
        isExists: action.payload,
      };
    },
  },
});

export const {
  changeFollow,
  changeFollowList,
  changeFollowingList,
  changeIsExists,
} = followSlice.actions;

export const selectFollow = (state: RootState) => state.follow.follow;
export const selectFollowList = (state: RootState) =>
  state.follow.followinglist;
export const selectFollowingList = (state: RootState) =>
  state.follow.followinglist;
export const selectIsExists = (state: RootState) => state.follow.isExists;

export default followSlice.reducer;
