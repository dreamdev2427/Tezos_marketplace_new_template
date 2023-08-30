import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import {
  SET_AVAX_PRICE,
  UPDATE_POPULAR_USERS,
  SET_THEME_THEME,
} from "../actions/action.types";

export interface UsersState {
  themeMode?: string;
  popular?: Array<any>;
}

const initialState: UsersState = {
  themeMode: "light",
  popular: [],
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changePopular: (state, action: PayloadAction<UsersState["popular"]>) => {
      return {
        ...state,
        popular: action.payload,
      };
    },
    changeThemeMode: (
      state,
      action: PayloadAction<UsersState["themeMode"]>
    ) => {
      return {
        ...state,
        themeMode: action.payload,
      };
    },
  },
});

export const { changePopular, changeThemeMode } = usersSlice.actions;

export const selectPopularUsers = (state: RootState) => state.user.popular;
export const selectThemeMode = (state: RootState) => state.user.themeMode;

export default usersSlice.reducer;
