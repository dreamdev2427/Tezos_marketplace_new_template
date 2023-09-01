import { TezosToolkit } from "@taquito/taquito";
import { NetworkType } from "@airgap/beacon-sdk";

import axios from "axios";
import {
  changeTezosContractStorage,
  changeTezosInstance,
  changeTezosTokenData,
  changeUserBalance,
  changeWalletAddress,
  changeWalletStatus,
} from "../redux/reducers/auth.reducers";

export const tezosconfig = {
  factoryAddress: "KT1DxXM4ixDoQJwWVUzP7pBoYryWoWPhijJB",
  auctionAddress: "KT19YyJYNzKWSfmjxsppVwaEee2J1Uz5f1pM", //"KT1Bd9gbaka5S5XtfET1w7DKbuNduhfFSmht",
  contractAddress: "KT1PPMX8reWbzg4QWeLx3EzMLaLRN9YgA6U7", //"KT1BHLs7CxuLAGnAmSygd1iSG4AEoioYYDd4",
  tokenAddress: "KT1E6rci16DnNv3Cjs9sVYMbPZiQnFWvtkj2", //"KT1DWALB19EzvwKu7uomRsMJZBhYqFL9sEn5",
};

export const connectTezosWallet = ({ wallet, Tezos }) => {
  return async (dispatch) => {
    try {
      Tezos.setWalletProvider(wallet);

      const activeAccount = ""; //await wallet.client.getActiveAccount();
      console.log(activeAccount);
      if (!activeAccount) {
        await wallet.requestPermissions({
          network: {
            type: NetworkType.GHOSTNET,
            rpcUrl: "https://ghostnet.smartpy.io/",
          },
        });
      }
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);

      dispatch(changeWalletAddress(userAddress));
      dispatch(changeWalletStatus(true));
      dispatch(changeUserBalance(balance));
      dispatch(changeTezosInstance(Tezos));
    } catch (error) {
      console.log(error);
      dispatch({
        type: "CONNECT_WALLET_ERROR",
      });
    }
  };
};

export const disconnectTezosWallet = ({ wallet, setTezos }) => {
  return async (dispatch) => {
    setTezos(new TezosToolkit("https://ghostnet.smartpy.io/"));

    dispatch(changeWalletAddress(""));
    dispatch(changeWalletStatus(false));
    dispatch(changeUserBalance(0));
    dispatch(changeTezosInstance(null));

    if (wallet) {
      await wallet.clearActiveAccount();
    }
  };
};

export const fetchContractData = ({ Tezos }) => {
  return async (dispatch, getState) => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.contractAddress);

      const storage = await contract.storage();
      dispatch(changeTezosContractStorage(storage.toNumber()));
    } catch (e) {
      //dispatch
      console.log(e);
    }
  };
};

export const incrementData = ({ Tezos }) => {
  return async (dispatch, getState) => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.contractAddress);

      const op = await contract.methods.increment(1).send();
      await op.confirmation();
      const newStorage = await contract.storage();
      dispatch(changeTezosContractStorage(newStorage.toNumber()));
    } catch (e) {
      console.log(e);
    }
  };
};

export const decrementData = ({ Tezos }) => {
  return async (dispatch, getState) => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.contractAddress);

      const op = await contract.methods.decrement(1).send();
      await op.confirmation();
      const newStorage = await contract.storage();
      dispatch(changeTezosContractStorage(newStorage.toNumber()));
    } catch (e) {
      console.log(e);
    }
  };
};

export const hex2buf = (hex) => {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
};

export function byte2Char(hex) {
  return Buffer.from(hex2buf(hex)).toString("utf8");
}

export const fetchData = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://api.ghostnet.tzkt.io/v1/contracts/${tezosconfig.contractAddress}/bigmaps/data/keys`
      );
      const response1 = await axios.get(
        `https://api.ghostnet.tzkt.io/v1/contracts/${tezosconfig.tokenAddress}/bigmaps/token_metadata/keys`
      );
      const d1 = response.data;
      const d2 = response1.data;
      let tokenData = [];
      for (let i = 0; i < d1.length; i++) {
        try {
          const s = byte2Char(d2[i].value.token_info[""]).split("//").at(-1);

          const res = await axios.get("https://cloudflare-ipfs.com/ipfs/" + s);

          const l1 = d1[i].value;
          const l2 = res.data;
          tokenData[i] = {
            ...l1,
            ...l2,
            token_id: d2[i].value.token_id,
          };
        } catch (error) {
          continue;
        }
      }
      console.log(tokenData);
      dispatch(changeTezosTokenData(tokenData));
    } catch (e) {
      console.log(e);
    }
  };
};

export const hex_to_ascii = (str1) => {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

export const mintTezosNFT = ({
  Tezos,
  tokencontract,
  amount,
  metadata,
  saveItem,
  params,
}) => {
  return async () => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.factoryAddress);
      let bytes = "";
      for (var i = 0; i < metadata.length; i++) {
        bytes += metadata.charCodeAt(i).toString(16).slice(-4);
      }
      const op = await contract.methods
        .mint_token(amount, tokencontract, { "": bytes }, params.tokenId)
        .send();
      await op.confirmation();
      saveItem(params);
    } catch (e) {
      console.log(e);
    }
  };
};

export const burnTezosNFT = ({ Tezos, tokencontract, amount, tokenId }) => {
  return async () => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.factoryAddress);
      const op = await contract.methods
        .burn_token(amount, tokencontract, tokenId)
        .send();
      await op.confirmation();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};

export const transferTezosNFT = ({
  Tezos,
  tokencontract,
  sender,
  receiver,
  amount,
  tokenId,
}) => {
  return async () => {
    try {
      const contract = await Tezos.wallet.at(tezosconfig.factoryAddress);
      const op = await contract.methods
        .transfer_token(tokencontract, [
          {
            from_: sender,
            txs: [{ to_: receiver, token_id: tokenId, amount: amount }],
          },
        ])
        .send();
      await op.confirmation();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};

export const createTezosCollection = ({ Tezos, metadata }) => {
  return async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const contract = await Tezos.wallet.at(tezosconfig.factoryAddress);
        let bytes = "";
        for (var i = 0; i < metadata.length; i++) {
          bytes += metadata.charCodeAt(i).toString(16).slice(-4);
        }

        const op = await contract.methods.deploy_fa2([bytes]).send();

        await op.confirmation().then((data) => {
          let operations = data.block.operations[3];
          for (var idx = 0; idx < operations.length; idx++) {
            let contents = data.block.operations[3][idx].contents;
            for (var i = 0; i < contents.length; i++) {
              let metadata = contents[i].metadata;
              if (metadata.internal_operation_results) {
                let internal_ops = metadata.internal_operation_results;
                for (var j = 0; j < internal_ops.length; j++) {
                  if (
                    internal_ops[j].kind === "event" &&
                    internal_ops[j].tag === "CONTRACT_DEPLOYED" &&
                    internal_ops[j].result.status === "applied"
                  ) {
                    let address =
                      internal_ops[j - 1].result.originated_contracts[0];
                    resolve(address);
                  }
                }
              }
            }
          }
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };
};

export const collectTezosNFT = ({ Tezos, amount, contract, id }) => {
  return async (dispatch) => {
    try {
      const auction_contract = await Tezos.wallet.at(
        tezosconfig.auctionAddress
      );
      const op = await auction_contract.methods
        .collect(contract, id)
        .send({ amount: amount });
      await op.confirmation();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};

export const bidTezosNFT = ({ Tezos, amount, contract, id }) => {
  return async (dispatch) => {
    try {
      const auction_contract = await Tezos.wallet.at(
        tezosconfig.auctionAddress
      );
      const op = await auction_contract.methods
        .bid(contract, id)
        .send({ amount: amount });
      await op.confirmation();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};

export const acceptAuctionTezosNFT = ({ Tezos, contract, id }) => {
  return async (dispatch) => {
    try {
      const auction_contract = await Tezos.wallet.at(
        tezosconfig.auctionAddress
      );
      const op = await auction_contract.methods
        .settle_auction(contract, id)
        .send();
      await op.confirmation();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};

export const delistTezosNFT = async ({ Tezos, id, contract, instant }) => {
  try {
    const auction_contract = await Tezos.wallet.at(tezosconfig.auctionAddress);
    if (instant) {
      const delistOp = await auction_contract.methods
        .cancel_sale(contract, id)
        .send();
      await delistOp.confirmation();
      return 0;
    } else {
      const delistOp = await auction_contract.methods
        .cancel_auction(contract, id)
        .send();
      await delistOp.confirmation();
    }
  } catch (e) {
    console.log(e);
    return -1;
  }
};

export const listTezosNFT = async ({
  Tezos,
  id,
  sender,
  contract,
  price,
  instant,
  auction,
}) => {
  try {
    const token_contract = await Tezos.wallet.at(contract);
    const approveOp = await token_contract.methods
      .update_operators([
        {
          add_operator: {
            owner: sender,
            operator: tezosconfig.auctionAddress,
            token_id: id,
          },
        },
      ])
      .send();
    await approveOp.confirmation();
    const auction_contract = await Tezos.wallet.at(tezosconfig.auctionAddress);
    if (!instant) {
      const listOp = await auction_contract.methods
        .create_auction(
          sender, // creator
          0, // current price
          Math.floor(Date.now() / 1000) + Math.floor(auction), //end time
          sender, // highest bidder
          Math.floor(Date.now() / 1000), // start time
          contract, // Token(address)
          id // Token(token_id)
        )
        .send();
      await listOp.confirmation();
    } else {
      const listOp = await auction_contract.methods
        .put_on_sale(sender, contract, id, price * 1000000)
        .send();
      await listOp.confirmation();
    }
    return 0;
  } catch (e) {
    console.log(e);
    return -1;
  }
};
