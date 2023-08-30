import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserData {
  _id?: string;
  avatar?: string;
  address?: string;
  tezosaddress?: string;
  nickname?: string;
  userBio?: string;
  websiteURL?: string;
  banner?: string;
  verified?: string;
  email?: string;
  twitter?: string;
  facebook?: string;
  telegram?: string;
  password?: string;
  follows?: string;
  createdAt?: string;
  updatedAt?: string;
  playList?: Array<any>;
  schema_version?: string;
}

export interface AuthorizingState {
  user?: UserData;
  detail?: UserData;
  currentWallet?: string;
  currentChainId?: number;
  otherUser?: UserData;
  balance?: number;
  globalProvider?: any;
  walletStatus?: Boolean;
  playList?: [];
  schema_version?: "";
  tezosInstance?: any;
  tezosContractStorage?: any;
  tezosTokenData?: any;
}

const initialState: AuthorizingState = {
  user: {},
  detail: {},
  currentWallet: "",
  currentChainId: 0,
  otherUser: {},
  balance: 0,
  globalProvider: {},
  tezosInstance: null,
  tezosContractStorage: null,
  tezosTokenData: null,
  walletStatus: false,
};

export const authorizingSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeAuthor: (state, action: PayloadAction<AuthorizingState["user"]>) => {
      return {
        ...state,
        user: action.payload,
      };
    },
    changeDetailedUserInfo: (
      state,
      action: PayloadAction<AuthorizingState["detail"]>
    ) => {
      return {
        ...state,
        detail: action.payload,
      };
    },
    changeOtherUserInfo: (
      state,
      action: PayloadAction<AuthorizingState["otherUser"]>
    ) => {
      return {
        ...state,
        otherUser: action.payload,
      };
    },
    changeWalletAddress: (
      state,
      action: PayloadAction<AuthorizingState["currentWallet"]>
    ) => {
      return {
        ...state,
        currentWallet: action.payload,
      };
    },
    changeGlobalProvider: (
      state,
      action: PayloadAction<AuthorizingState["globalProvider"]>
    ) => {
      return {
        ...state,
        globalProvider: action.payload,
      };
    },
    changeChainId: (
      state,
      action: PayloadAction<AuthorizingState["currentChainId"]>
    ) => {
      return {
        ...state,
        currentChainId: action.payload,
      };
    },
    changeUserBalance: (
      state,
      action: PayloadAction<AuthorizingState["balance"]>
    ) => {
      return {
        ...state,
        balance: action.payload,
      };
    },
    changeWalletStatus: (
      state,
      action: PayloadAction<AuthorizingState["walletStatus"]>
    ) => {
      return {
        ...state,
        walletStatus: action.payload,
      };
    },
    changeTezosInstance: (
      state,
      action: PayloadAction<AuthorizingState["tezosInstance"]>
    ) => {
      return {
        ...state,
        tezosInstance: action.payload,
      };
    },
    changeTezosContractStorage: (
      state,
      action: PayloadAction<AuthorizingState["tezosContractStorage"]>
    ) => {
      return {
        ...state,
        tezosContractStorage: action.payload,
      };
    },
    changeTezosTokenData: (
      state,
      action: PayloadAction<AuthorizingState["tezosTokenData"]>
    ) => {
      return {
        ...state,
        tezosTokenData: action.payload,
      };
    },
  },
});

export const {
  changeAuthor,
  changeDetailedUserInfo,
  changeOtherUserInfo,
  changeWalletAddress,
  changeGlobalProvider,
  changeChainId,
  changeWalletStatus,
  changeUserBalance,
  changeTezosInstance,
  changeTezosContractStorage,
  changeTezosTokenData,
} = authorizingSlice.actions;

export const selectCurrentAuthorization = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectOtherUser = (state: RootState) => state.auth.otherUser;
export const selectDetailedUser = (state: RootState) => state.auth.detail;
export const selectWalletStatus = (state: RootState) => state.auth.walletStatus;
export const selectGlobalProvider = (state: RootState) =>
  state.auth.globalProvider;
export const selectCurrentWallet = (state: RootState) =>
  state.auth.currentWallet;
export const selectCurrentChainId = (state: RootState) =>
  state.auth.currentChainId;
export const selectTezosInstance = (state: RootState) =>
  state.auth.tezosInstance;
export const selectTezosContractStorage = (state: RootState) =>
  state.auth.tezosContractStorage;
export const selectTezosTokenData = (state: RootState) =>
  state.auth.tezosTokenData;

export default authorizingSlice.reducer;
