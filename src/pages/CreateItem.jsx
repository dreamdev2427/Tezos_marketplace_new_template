import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import "react-tabs/style/react-tabs.css";
import img1 from "../assets/images/box-item/image-box-6.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import isEmpty from "../utilities/isEmpty";
import {
  BACKEND_URL,
  FILE_TYPE,
  TEZOS_CHAIN_ID,
  chains,
  ipfsUrl,
} from "../config";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectCurrentWallet,
  selectDetailedUser,
  selectGlobalProvider,
  selectTezosInstance,
  selectWalletStatus,
} from "../redux/reducers/auth.reducers";
import {
  changeTradingResult,
  selectCurrentTradingResult,
} from "../redux/reducers/nft.reducers";
import {
  changeCollectionList,
  CollectionData,
  selectConllectionList,
  selectConsideringCollectionId,
} from "../redux/reducers/collection.reducers";
import { pinFileToIPFS, pinJSONToIPFS } from "../utils/pinatasdk";
import {
  mintTezosNFT,
  tezosconfig,
} from "../InteractWithSmartContract/tezosInteracts";
import {
  batchMintOnSale,
  singleMintOnSale,
} from "../InteractWithSmartContract/interact";
import Form from "react-bootstrap/Form";
import { Backdrop, CircularProgress } from "@mui/material";

const CreateItem = () => {
  const [sale, setSale] = useState(false);
  const [colls, setColls] = useState([]);

  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selected, setSelected] = useState({
    name: "",
    _id: "",
    items: [],
    contract: "",
  });
  const [logoImg, setLogoImg] = useState("");
  const [textName, setTextName] = useState("");
  const [textDescription, setTextDescription] = useState("");
  const [period, setPeriod] = useState(0);
  const [timeLength, setTimeLength] = useState(0);
  const [auction, setAuction] = useState(false);
  const [auctionEndTime, setAuctionEndTime] = useState(new Date());

  const [stockAmount, setStockAmount] = useState(1);
  const [price, setPrice] = useState(0);
  const [processing, setProcessing] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const consideringCollectionId = useAppSelector(selectConsideringCollectionId);
  const currentUsr = useAppSelector(selectCurrentUser);
  const globalAddress = useAppSelector(selectCurrentWallet);
  const detailedUserInfo = useAppSelector(selectDetailedUser);
  const collections = useAppSelector(selectConllectionList);
  const tradingResult = useAppSelector(selectCurrentTradingResult);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const tezosInstance = useAppSelector(selectTezosInstance);

  useEffect(() => {
    if (currentUsr?._id) {
      axios
        .post(
          `${BACKEND_URL}/api/collection/getUserCollections`,
          {
            limit: 90,
            userId: currentUsr?._id,
            chainId: currentChainId,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("jwtToken"),
            },
          }
        )
        .then((result) => {
          dispatch(changeCollectionList(result.data.data));
        })
        .catch((err) => {
          console.log("error getting collections : ", err);
        });
    }
  }, [currentUsr, currentChainId, dispatch]);

  useEffect(() => {
    if (currentChainId === TEZOS_CHAIN_ID) {
      setSale(true);
    }
  }, [currentChainId]);
  useEffect(() => {
    //check the current user, if ther user is not exists or not verified, go back to the home
    if (isEmpty(currentUsr)) {
      toast.warn("Please login first.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
    if (
      !isEmpty(detailedUserInfo) &&
      !isEmpty(detailedUserInfo?.verified) &&
      !detailedUserInfo?.verified
    ) {
      toast.warn("Please contact to dev team and get verified.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (collections && collections.length >= 0) {
      let tempOptions = [];
      collections.map((coll, index) =>
        tempOptions.push({
          _id: coll?._id || "",
          name: coll?.name || "",
          bannerURL: coll?.bannerURL || "",
          items: coll?.items || [],
          contract: coll?.contract || "",
        })
      );
      setColls(tempOptions);
    }
  }, [collections]);

  useEffect(() => {
    if (tradingResult) {
      switch (tradingResult.function) {
        default:
          break;
        case "singleMintOnSale":
          dispatch(
            changeTradingResult({ function: "", success: false, message: "" })
          );
          if (tradingResult.success === false)
            toast.error(tradingResult.message);
          break;
        case "batchMintOnSale":
          dispatch(
            changeTradingResult({ function: "", success: false, message: "" })
          );
          if (tradingResult.success === false)
            toast.error(tradingResult.message);
          break;
      }
    }
  }, [tradingResult]);

  const changeAvatar = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    console.log(file);
    if (file.size > 2 * 1024 * 1024) {
      toast.warn("Image file size should be less than 2MB");
      return;
    }
    setSelectedFile(file);
    setSelectedFileName(file.name);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader?.result?.toString() || "");
    };
    reader.onerror = function (error) {
      console.log("banner file choosing error : ", error);
    };
  };

  const saveItem = (params) => {
    setProcessing(true);
    if (stockAmount > 1) {
      axios({
        method: "post",
        url: `${BACKEND_URL}/api/item/multiple_create`,
      })
        .then(async function (response) {
          if (response.status === 200) {
            if (sale === true && currentChainId !== TEZOS_CHAIN_ID) {
              var aucperiod = auction === false ? 0 : params.auctionPeriod;
              var price = params.price;
              try {
                let ret = await batchMintOnSale(
                  new Web3(globalProvider),
                  currentUsr?.address || "",
                  response.data,
                  aucperiod * 24 * 3600,
                  price,
                  0,
                  currentChainId || 1
                );
                if (ret.success === true) {
                  setProcessing(false);
                  toast.success(
                    <div>
                      {`Successfully Minted ${stockAmount} items. You can see items at `}
                      <span
                        style={{ color: "#00f" }}
                        onClick={() =>
                          navigate(`/collectionItems/${params.collectionId}`)
                        }
                      >
                        here
                      </span>
                      .
                    </div>
                  );
                } else {
                  setProcessing(false);
                  console.log(
                    "Failed in multiple put on sale : " + ret.message
                  );
                  toast.error("Failed in multiple token deployment");
                  return;
                }
              } catch (err) {
                setProcessing(false);
                console.log("Failed in multiple minting : " + err);
                toast.error("Failed in multiple minting");
                return;
              }
            }
            setProcessing(false);
            console.log(params);
            toast.success(
              <div>
                {`Successfully Created ${stockAmount} items. You can see items at `}
                <span
                  style={{ color: "#00f" }}
                  onClick={() =>
                    navigate(`/collectionItems/${params.collectionId}`)
                  }
                >
                  here
                </span>
                .
              </div>
            );
          } else {
            setProcessing(false);
            console.log(
              "Failed in multiple uploading : " + response.data.message
            );
            toast.error("Failed in multiple uploading");
            return;
          }
        })
        .catch(function (error) {
          setProcessing(false);
          console.log("Failed in multiple uploading : " + error);
          toast.error("Failed in multiple uploading");
        });
    } else {
      axios({
        method: "post",
        url: `${BACKEND_URL}/api/item/create`,
        data: params,
      })
        .then(async function (response) {
          if (response.status === 200) {
            if (sale === true && currentChainId !== TEZOS_CHAIN_ID) {
              var aucperiod =
                auction === false ? 0 : response.data.auctionPeriod;
              var price = response.data.price;
              try {
                let ret = await singleMintOnSale(
                  new Web3(globalProvider),
                  currentUsr?.address || "",
                  response.data._id,
                  aucperiod * 24 * 3600,
                  price,
                  0,
                  currentChainId || 1
                );
                if (ret.success === true) {
                  setProcessing(false);
                  toast.success(
                    <div>
                      Successfully minted an item. You can see items at{" "}
                      <span
                        style={{ color: "#00f" }}
                        onClick={() =>
                          navigate(`/collectionItems/${params.collectionId}`)
                        }
                      >
                        here
                      </span>
                    </div>
                  );
                } else {
                  setProcessing(false);
                  console.log("Failed in put on sale : " + ret.message);
                  toast.error("Failed in token deployment");
                  return;
                }
              } catch (err) {
                setProcessing(false);
                console.log("Failed in single item uploading : " + err);
                toast.error("Failed in single item uploading");
                return;
              }
            }
            setProcessing(false);
            toast.success(
              <div>
                Successfully created an item. You can see items at{" "}
                <span
                  style={{ color: "#00f" }}
                  onClick={() =>
                    navigate(`/collectionItems/${params.collectionId}`)
                  }
                >
                  here
                </span>
              </div>
            );
          } else {
            setProcessing(false);
            console.log(
              "Failed in single item uploading : " + response.data.message
            );
            toast.error("Failed in single item uploading");
          }
        })
        .catch(function (error) {
          setProcessing(false);
          console.log("Failed in single item uploading : " + error);
          toast.error("Failed in single item uploading");
        });
    }
  };

  const createNFTItem = async () => {
    setPrice(price);

    if (isEmpty(currentUsr) || isEmpty(detailedUserInfo)) {
      toast.warn("You have to sign in before doing a trading.");
      return;
    }
    // if (selectedMusicFile == null) {
    //   console.log("Invalid music file.");
    //   toast.warn("Music file is not selected.");
    //   return;
    // }
    if (selectedFile == null) {
      console.log("Invalid file.");
      toast.warn("Image is not selected.");
      return;
    }
    if (textName === "") {
      toast.error("Item name cannot be empty.");
      return;
    }
    if (isEmpty(selected) || selected.name === "") {
      toast.warn("Please select a collection and try again.");
      return;
    }
    if (stockAmount < 1) {
      toast.warn("Please input a valid stock amount.");
      return;
    }

    if (currentChainId === 0) {
      toast.warn("Please connect your wallet and try again.");
      return;
    }
    if (sale === true) {
      if (walletStatus === false) {
        toast.warn("Please connect your wallet and try again.");
        return;
      }
    }
    setProcessing(true);

    const fileHash = await pinFileToIPFS(selectedFile);
    const meta = {
      name: textName,
      description: textDescription,
      image: "ipfs://" + fileHash,
    };
    const metauri = await pinJSONToIPFS(meta);

    let paths = [],
      idx = 0;
    for (idx = 0; idx < stockAmount; idx++) paths.push(fileHash);
    const params = {
      itemName: textName,
      itemMusicURL: fileHash,
      itemLogoURL: fileHash,
      itemDescription: textDescription,
      collectionId: selected?._id || "",
      creator: currentUsr?._id || "",
      owner: currentUsr?._id || "",
      isSale: 0,
      price: !sale ? 0 : price,
      auctionPeriod: !sale ? 0 : period,
      stockAmount: stockAmount > 1 ? Math.floor(stockAmount) : 1,
      mutiPaths: paths,
      tokenId: Number(selected?.items?.length || 0) + Number(1),
      metadataURI: metauri,
      timeLength: timeLength,
      stockGroupId: new Date().getTime(),
      chainId: currentChainId || 1,
      fileType: FILE_TYPE.IMAGE,
    };
    if (currentChainId === TEZOS_CHAIN_ID) {
      setProcessing(true);
      //read token id
      const API_URL = `https://api.ghostnet.tzkt.io/v1/contracts/${selected?.contract}`;
      try {
        const tokenCount = (await axios.get(API_URL))?.data?.tokensCount;
        params.tokenId = tokenCount;
        await dispatch(
          mintTezosNFT({
            Tezos: tezosInstance,
            amount: 1,
            metadata: metauri,
            tokencontract: selected?.contract,
            saveItem,
            params,
          })
        );
        setProcessing(false);
      } catch (err) {
        console.log(err);
        setProcessing(false);
      }
    } else {
      saveItem(params);
    }
  };

  const handleCheckboxChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = colls?.find(
      (cat) => cat._id === selectedCategoryId
    );

    setSelected(selectedCategory);
  };

  return (
    <div className="create-item">
      <Header />

      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title-heading style-1 ct mt-2">
                Create New Item
              </h2>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12">
              <h4 className="title-create-item">Preview item</h4>
              <div className="sc-card-product">
                <div className="card-media">
                  <Link>
                    {logoImg !== "" ? (
                      <img id="avatarImg" src={logoImg} alt="Avatar" />
                    ) : (
                      <img src={img1} alt="Axies" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-6 col-md-12 col-12">
              <div className="form-create-item">
                <form action="#">
                  <h4 className="title-create-item">Upload file</h4>
                  <label className="uploadFile">
                    <span className="filename">PNG, JPG</span>
                    <input
                      type="file"
                      className="inputfile form-control"
                      name="file"
                      onChange={changeAvatar}
                    />
                  </label>
                </form>

                <div className="flat-tabs tab-create-item">
                  <h4 className="title-create-item">Item Name</h4>
                  <input
                    type="text"
                    value={textName}
                    placeholder="Item Name"
                    onChange={(e) => setTextName(e.target.value)}
                  />

                  <h4 className="title-create-item">Description</h4>
                  <textarea
                    value={textDescription}
                    placeholder="...."
                    onChange={(event) => {
                      setTextDescription(event.target.value);
                    }}
                  ></textarea>
                  <p className="mt-1">
                    The description will be included on the item's detail page
                    underneath its image.{" "}
                    <span style={{ color: "#5142fc" }}>Markdown</span> syntax is
                    supported.
                  </p>

                  <h4 className="title-create-item  mb-0">
                    {" "}
                    Choose collection
                  </h4>
                  <p>
                    Choose an exiting collection or create a new one. If you
                    don't have any collectio please click here to go to{" "}
                    <span
                      onClick={() => navigate("/createCollection")}
                      style={{ cursor: "pointer", color: "#5142fc" }}
                    >
                      create a collection
                    </span>
                    .
                  </p>

                  <div className="form-inner mt-4">
                    <div className="flex align-items-center flex-wrap flex-gap-2">
                      {colls?.map((cat, index) => (
                        <div className="row-form cat-wrap style-2" key={index}>
                          <div className="cat-img mb-4">
                            <img
                              src={`${ipfsUrl}${cat?.bannerURL || ""}`}
                              alt="Banner"
                              width={"100%"}
                              height={"100%"}
                            />
                          </div>

                          <label className="d-flex align-items-center p-0">
                            <input
                              type="radio"
                              name="category"
                              value={cat._id}
                              onChange={(e) => handleCheckboxChange(e)}
                            />
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {cat?.name}
                            </p>

                            {/* <span className="btn-radiobox"></span> */}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentChainId !== TEZOS_CHAIN_ID && (
                    <div className="flex align-items-center justify-content-between">
                      <div>
                        <h4 className="title-create-item mb-0"> Put on sale</h4>
                        <p>
                          Please enter the price and stock amount that shows how
                          many copies of this item you want to sell
                        </p>
                      </div>
                      <div className="form-inner">
                        <label style={{ position: "relative" }}>
                          <input type="checkbox" onChange={setSale} />
                          <span className="btn-checkbox"></span>
                        </label>
                      </div>
                    </div>
                  )}

                  {currentChainId !== TEZOS_CHAIN_ID && (
                    <div className="flex align-items-center justify-content-between">
                      <div>
                        <h4 className="title-create-item mb-0">
                          Put it on auction
                        </h4>
                        <p>Please input expiration date amd time of auction</p>
                      </div>
                      <div className="form-inner">
                        <label style={{ position: "relative" }}>
                          <input type="checkbox" onChange={setAuction} />
                          <span className="btn-checkbox"></span>
                        </label>
                      </div>
                    </div>
                  )}

                  {sale === true &&
                    auction === true &&
                    currentChainId !== TEZOS_CHAIN_ID && (
                      <div className="form-inner">
                        <h4 className="title-create-item mb-0">
                          Enter your auction end time
                        </h4>

                        <select
                          className="w-full border rounded-xl"
                          value={period}
                          onChange={(event) => {
                            setPeriod(event.target.value);
                          }}
                          placeholder="select auction time"
                        >
                          <option value={0.000694}>1 min</option>
                          <option value={0.00347}>5 min</option>
                          <option value={0.00694}>10 min</option>
                          <option value={7}>7 days</option>
                          <option value={10}>10 days</option>
                          <option value={30}>1 month</option>
                        </select>
                      </div>
                    )}

                  <div className="row-form style-3 mt-5">
                    <button onClick={() => createNFTItem()}>Create Item</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={processing}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </div>
  );
};

export default CreateItem;
