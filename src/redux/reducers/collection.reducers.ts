import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";
import { RootState } from "../store";

export interface CollectionData {
  _id?: string;
  bannerURL?: string;
  logoURL?: string;
  name?: string;
  description?: string;
  items?: Array<string>;
  hotCollections?: Array<any>;
  owner?: any;
  contract?: string;
}

export interface CollectionsState {
  collection?: CollectionData;
  detail?: CollectionData;
  list?: Array<CollectionData>;
  consideringId?: string;
  owner?: {};
  hotCollections?: [];
}

const initialState: CollectionsState = {
  collection: {},
  detail: {},
  list: [],
  hotCollections: [],
  consideringId: "",
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    changeHotCollections: (
      state,
      action: PayloadAction<CollectionsState["hotCollections"]>
    ) => {
      return {
        ...state,
        hotCollections: action.payload,
      };
    },
    changeCollection: (
      state,
      action: PayloadAction<CollectionsState["collection"]>
    ) => {
      return {
        ...state,
        collection: action.payload,
      };
    },
    changeDetailedCollection: (
      state,
      action: PayloadAction<CollectionsState["detail"]>
    ) => {
      return {
        ...state,
        detail: action.payload,
      };
    },
    changeCollectionList: (
      state,
      action: PayloadAction<CollectionsState["list"]>
    ) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeConsideringCollectionId: (
      state,
      action: PayloadAction<CollectionsState["consideringId"]>
    ) => {
      return {
        ...state,
        consideringId: action.payload,
      };
    },
  },
});

export const {
  changeCollection,
  changeDetailedCollection,
  changeCollectionList,
  changeConsideringCollectionId,
  changeHotCollections,
} = collectionSlice.actions;

export const selectCurrentCollectionState = (state: RootState) =>
  state.collection;

export const selectConsideringCollection = (state: RootState) =>
  state.collection.collection;

export const selectDetailedCollection = (state: RootState) =>
  state.collection.detail;

export const selectConllectionList = (state: RootState) =>
  state.collection.list;

export const selectConsideringCollectionId = (state: RootState) =>
  state.collection.consideringId;

export const selectHotCollections = (state: RootState) =>
  state.collection.hotCollections;

export default collectionSlice.reducer;
