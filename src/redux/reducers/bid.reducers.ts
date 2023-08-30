import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BidState {
  bid_status?: any;
  hot_bids?: Array<any>;
  bid?: any;
  system_time?: any;
}

const initialState: BidState = {
  bid_status: false,
  hot_bids: [],
  bid: {},
  system_time: 0,
};

export const BidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    changeBidStatus: (state, action: PayloadAction<BidState["bid_status"]>) => {
      return {
        ...state,
        bid_status: action.payload,
      };
    },
    changeHotBids: (state, action: PayloadAction<BidState["hot_bids"]>) => {
      return {
        ...state,
        hot_bids: action.payload,
      };
    },
    changeBid: (state, action: PayloadAction<BidState["bid"]>) => {
      return {
        ...state,
        bid: action.payload,
      };
    },
    changeSystemTime: (
      state,
      action: PayloadAction<BidState["system_time"]>
    ) => {
      return {
        ...state,
        system_time: action.payload,
      };
    },
  },
});

export const { changeBidStatus, changeHotBids, changeBid, changeSystemTime } =
  BidSlice.actions;

export const selectBidStatus = (state: RootState) => state.bid.bid_status;
export const selectHotBids = (state: RootState) => state.bid.hot_bids;
export const selectBid = (state: RootState) => state.bid.bid;
export const selectSystemTime = (state: RootState) => state.bid.system_time;

export default BidSlice.reducer;
