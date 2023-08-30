import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface MusicItemData {
  songTitle?: string; //search
  artist?: string; //search
  category?: string; //search
  url?: string;
  duration?: number; //sec unit
}

export interface tradingResultData {
  function: string;
  success: boolean;
  message: string;
}

export interface NFTState {
  serviceFee?: number;
  tradingResult?: tradingResultData;
  buy_result?: tradingResultData;
  list?: Array<any>;
  listOfAUser?: Array<any>;
  categorySummary: Array<any>;
  detailOfAnItem?: any;
  ownHistoryOfAnItem?: Array<any>;
  bannerItemsOnAuction?: Array<any>;
  ethPrice: number;
}

const initialState: NFTState = {
  serviceFee: 1.5, //percentage value 1.5 means 1.5%,
  tradingResult: { function: "", success: false, message: "" },
  list: [],
  listOfAUser: [],
  buy_result: { function: "", success: false, message: "" },
  categorySummary: [],
  detailOfAnItem: {},
  ownHistoryOfAnItem: [],
  bannerItemsOnAuction: [],
  ethPrice: 0,
};

export const nftStateSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    changeBannerItemsOnAuction: (
      state,
      action: PayloadAction<NFTState["bannerItemsOnAuction"]>
    ) => {
      return {
        ...state,
        bannerItemsOnAuction: action.payload,
      };
    },
    changeETHPrice: (state, action: PayloadAction<NFTState["ethPrice"]>) => {
      return {
        ...state,
        ethPrice: action.payload,
      };
    },
    changeItemOwnHistory: (
      state,
      action: PayloadAction<NFTState["ownHistoryOfAnItem"]>
    ) => {
      return {
        ...state,
        ownHistoryOfAnItem: action.payload,
      };
    },
    changeItemDetail: (
      state,
      action: PayloadAction<NFTState["detailOfAnItem"]>
    ) => {
      return {
        ...state,
        detailOfAnItem: action.payload,
      };
    },
    changeCategorySummary: (
      state,
      action: PayloadAction<NFTState["categorySummary"]>
    ) => {
      return {
        ...state,
        categorySummary: action.payload,
      };
    },
    changeBuyResult: (state, action: PayloadAction<NFTState["buy_result"]>) => {
      return {
        ...state,
        buy_result: action.payload,
      };
    },
    changeItemsList: (state, action: PayloadAction<NFTState["list"]>) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeItemsListOfAUser: (
      state,
      action: PayloadAction<NFTState["listOfAUser"]>
    ) => {
      return {
        ...state,
        listOfAUser: action.payload,
      };
    },
    changeServiceFee: (
      state,
      action: PayloadAction<NFTState["serviceFee"]>
    ) => {
      return {
        ...state,
        serviceFee: action.payload,
      };
    },
    changeTradingResult: (
      state,
      action: PayloadAction<NFTState["tradingResult"]>
    ) => {
      return {
        ...state,
        tradingResult: action.payload,
      };
    },
  },
});

export const {
  changeBuyResult,
  changeItemsList,
  changeServiceFee,
  changeTradingResult,
  changeItemsListOfAUser,
  changeCategorySummary,
  changeItemDetail,
  changeItemOwnHistory,
  changeETHPrice,
  changeBannerItemsOnAuction,
} = nftStateSlice.actions;

export const selectCurrentNFTState = (state: RootState) => state.nft;
export const selectCurrentTradingResult = (state: RootState) =>
  state.nft.tradingResult;
export const selectItemsOfAUser = (state: RootState) => state.nft.listOfAUser;
export const selectItemList = (state: RootState) => state.nft.list;
export const selectCategorySummary = (state: RootState) =>
  state.nft.categorySummary;
export const selectDetailOfAnItem = (state: RootState) =>
  state.nft.detailOfAnItem;
export const selectOwnHistoryOfAnItem = (state: RootState) =>
  state.nft.ownHistoryOfAnItem;
export const selectETHPrice = (state: RootState) => state.nft.ethPrice;
export const selectBannerItemsOnAuction = (state: RootState) =>
  state.nft.bannerItemsOnAuction;

export default nftStateSlice.reducer;
