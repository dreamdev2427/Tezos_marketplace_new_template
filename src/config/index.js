const IS_TEST = false;

export const INFURA_KEY = "1b4c44fdf5a0404b91ee1a85db0aed9a";
export const BACKEND_URL = "https://tokentrendingbot.org/tezosmarketplaceapi";

export const CATEGORIES = [
  { value: 1, text: "Renaissance" },
  { value: 2, text: "Impressionnisme" },
  { value: 3, text: "Cubisme" },
  { value: 4, text: "Fauvisme" },
  { value: 5, text: "Surréalisme" },
];

export const baseUrl = BACKEND_URL + "/api/";
export const socketUrl = BACKEND_URL;
export const imgUrl = BACKEND_URL + "/uploads/";
export const ipfsUrl = "https://cloudflare-ipfs.com/ipfs/";
export const platformContractAbi = require("../InteractWithSmartContract/RadioNFTFactory.json");
export const nftContractAbi = require("../InteractWithSmartContract/nftContract-abi.json");
export const erc20ContractAbi = require("../InteractWithSmartContract/TheRadio.json");
export const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYTY2NTdhMi1jYmYzLTQzOGEtODI4Yy02ZTg1Y2U3MzBiNmUiLCJlbWFpbCI6InN1cHBvcnRAcml6ZTJkYXkuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFkZWUxYTYzMDAwMzA3NTUyYjEyIiwic2NvcGVkS2V5U2VjcmV0IjoiYzMwNjg5YjViM2U1MmM1MTFlYTc5ZGRkODdhNmExODJlNzUyMWY1ZTRmMTA5ZjU5OTMxMTg0Mzk3OGY0YmUwNiIsImlhdCI6MTY3ODI3NTIxN30.N4WqxO0FsBz_m-zsAlbVzN2ZoXktiTFisFHXtgyDw38";

export const chains = {
  43113: {
    name: "Avalanche Fuji",
    id: 43113,
    rpcURL: "https://data-seed-prebsc-1-s2.binance.org:8545/",
    currency: "AVAX",
    minimumTipAmount: 200,
    platformContractAddress: "0xBdB0135aE71b526da7C1dd76AD86aec8C4410f50",
    nftContractAddress: "0xaA5E04204b176B218a7924bB38F6d136074Af047",
  },
  99999: {
    name: "Ghostnet",
    id: 99999,
    rpcURL: "https://ghostnet.smartpy.io/",
    currency: "TEZ",
    minimumTipAmount: 200,
    platformContractAddress: "KT1BHLs7CxuLAGnAmSygd1iSG4AEoioYYDd4",
    nftContractAddress: "KT1DWALB19EzvwKu7uomRsMJZBhYqFL9sEn5",
  },
};

export const TEZOS_CHAIN_ID = 99999; //let's promise like this!
export const platformChainIds = [43113, TEZOS_CHAIN_ID];

export const FILE_TYPE = {
  ALL: 0,
  IMAGE: 1,
  AUDIO: 2,
  VIDEO: 3,
  THREED: 4,
};
