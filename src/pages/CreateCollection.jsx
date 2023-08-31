import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import "react-tabs/style/react-tabs.css";
import img1 from "../assets/images/box-item/image-box-6.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import isEmpty from "../utilities/isEmpty";
import { BACKEND_URL, CATEGORIES } from "../config";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectTezosInstance,
  selectWalletStatus,
} from "../redux/reducers/auth.reducers";
import { changeConsideringCollectionId } from "../redux/reducers/collection.reducers";
import { pinFileToIPFS, pinJSONToIPFS } from "../utils/pinatasdk";
import { createTezosCollection } from "../InteractWithSmartContract/tezosInteracts";

const Create = () => {
  const categoriesOptions = CATEGORIES;

  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [logoImg, setLogoImg] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [textName, setTextName] = useState("");
  const [textDescription, setTextDescription] = useState("");
  const [categories, setCategories] = useState(categoriesOptions[0]);
  const [floorPrice, setFloorPrice] = useState(0);
  const [metaFieldInput, setMetaFieldInput] = useState("");
  const [metaFields, setMetaFields] = useState([]);
  const [metaFieldDatas, setMetaFieldDatas] = useState([]);
  const [metaArry, setMetaArray] = useState([]);
  const [removeField, setRemoveField] = useState(false);
  const [consideringField, setConsideringField] = useState("");
  const [consideringFieldIndex, setConsideringFieldIndex] = useState(0);
  const [alertParam, setAlertParam] = useState({});
  const [working, setWorking] = useState(false);
  const [constractAddress, setContractAddress] = useState("");
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUsr = useAppSelector(selectCurrentUser);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const walletStatus = useAppSelector(selectWalletStatus);
  const tezosInstance = useAppSelector(selectTezosInstance);

  useEffect(() => {
    //check the current user, if ther user is not exists or not verified, go back to the home
    if (isEmpty(currentUsr)) {
      toast.warn("Please login first.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, []);

  const changeBanner = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    console.log(file);
    setSelectedBannerFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBannerImg(reader.result);
    };
    reader.onerror = function (error) {};
  };

  const changeAvatar = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    console.log(file);
    setSelectedAvatarFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader.result);
    };
    reader.onerror = function (error) {};
  };

  const saveCollection = async (params) => {
    setWorking(true);
    let newCollectionId = 0;
    await axios({
      method: "post",
      url: `${BACKEND_URL}/api/collection/`,
      data: params,
    })
      .then(function (response) {
        if (response.data.code === 0) {
          newCollectionId = response.data._id;
          let isCreatingNewItem = localStorage.getItem("isNewItemCreating");
          if (isCreatingNewItem)
            localStorage.setItem("newCollectionId", newCollectionId);
          setWorking(false);
          dispatch(changeConsideringCollectionId(newCollectionId));
          toast.success("You 've created a new collection.");
          navigate("/collectionList");
        } else {
          setWorking(false);
          toast.success(response.message);
        }
      })
      .catch(function (error) {
        console.log("creating collection error : ", error);
        toast.error("Uploading failed");
        setWorking(false);
      });
  };

  const createCollection = async () => {
    if (currentUsr === null || currentUsr === undefined) {
      toast.warn("Please sign in and try again.");
      return;
    }
    if (selectedAvatarFile === null || selectedBannerFile === null) {
      toast.warn("You have to select banner and avatar.");
      return;
    }
    if (walletStatus === false) {
      toast.warn("Please connect your wallet and try again.");
      return;
    }
    if (textName === "") {
      toast.warn("Collection name can not be empty.");
      return;
    }
    try {
      setWorking(true);

      const collectionLogoURL = await pinFileToIPFS(selectedAvatarFile);
      const collectionBannerURL = await pinFileToIPFS(selectedBannerFile);
      console.log("collectionLogoURL >>> ", collectionLogoURL);
      console.log("collectionBannerURL >>> ", collectionBannerURL);

      let params = {
        collectionLogoURL: collectionLogoURL,
        collectionBannerURL: collectionBannerURL,
        collectionName: textName,
        collectionDescription: textDescription,
        collectionCategory: categories.value,
        price: floorPrice,
        owner: currentUsr._id,
        metaData: metaArry,
        chainId: currentChainId,
        constractAddr: "",
      };
      const metauri = await pinJSONToIPFS(params);
      let address = await dispatch(
        createTezosCollection({ Tezos: tezosInstance, metadata: metauri })
      );
      params.constractAddr = address;
      saveCollection(params);
      setWorking(false);
    } catch (error) {
      console.log(error);
      toast.error("Network error!");
    }
  };

  const setAddMetaField = () => {
    if (metaFieldInput !== "") {
      let mfs = metaFields;
      mfs.push(metaFieldInput);
      setMetaFields(mfs);
      setMetaFieldInput("");
    }
  };

  const onRemoveMetaFieldInput = (index) => {
    let socs1 = [];
    socs1 = metaFields;
    socs1.splice(index, 1);
    setMetaFields(socs1);

    let socs2 = [];
    socs2 = metaFieldDatas;
    socs2.splice(index, 1);
    setMetaFieldDatas(socs2);

    let i;
    let metaFdArry = [];
    for (i = 0; i < socs1.length; i++) {
      if (socs2[i] && socs2[i].length > 0) {
        metaFdArry.push({ key: socs1[i], value: socs2[i] });
      }
    }
    setMetaArray(metaFdArry);
  };

  const onChangeMetaFieldValue = (data, metaIndex) => {
    if (data !== "" && data !== undefined) {
      let mfds = metaFieldDatas;
      mfds[metaIndex] = data;
      setMetaFieldDatas(mfds);

      let socs1 = [];
      socs1 = metaFields;
      let socs2 = [];
      socs2 = metaFieldDatas;

      let i;
      let metaFdArry = [];
      for (i = 0; i < socs1.length; i++) {
        if (socs2[i] && socs2[i].length > 0) {
          metaFdArry.push({ key: socs1[i], value: socs2[i] });
        }
      }
      setMetaArray(metaFdArry);
    }
  };

  const onClickRemoveField = (index) => {
    setRemoveField(false);
    onRemoveMetaFieldInput(index);
  };

  const doRemovingModal = (index, field) => {
    setConsideringFieldIndex(index);
    setConsideringField(field);
    setRemoveField(true);
  };

  const handleClick = (value, index) => {
    setCategories(value, index);
    setVisible(false);
  };

  // console.log(categoriesOptions);

  return (
    <div className="create-item">
      <Header />

      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title-heading style-1 ct">
                Create a collection
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
                    <span className="filename">
                      PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                    </span>
                    <input
                      type="file"
                      className="inputfile form-control"
                      name="file"
                      onChange={changeAvatar}
                    />
                  </label>
                </form>
                <div
                  style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h4 className="title-create-item">Banner image</h4>
                  <p>
                    This image will be appear at the top of your collection
                    page. Avoid including too much text in this banner image, as
                    the dimensions change on different devices. 1400x400
                    recommend.
                  </p>
                </div>
                <div>
                  {bannerImg !== "" ? (
                    <img
                      id="BannerImg"
                      src={bannerImg}
                      alt="Banner"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <label className="uploadFile">
                      <span className="filename">PNG, JPG</span>
                      <input
                        className="inputfile form-control"
                        type="file"
                        name="file"
                        onChange={changeBanner}
                      />
                    </label>
                  )}
                </div>
                <div className="flat-tabs tab-create-item">
                  <h4 className="title-create-item">Collection details</h4>
                  <h4 className="title-create-item">Price</h4>
                  <input
                    defaultValue="0.0001 "
                    value={floorPrice}
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="Enter price for one item (ETH)"
                    onChange={(event) => {
                      setFloorPrice(event.target.value);
                    }}
                  />

                  <h4 className="title-create-item">Title</h4>
                  <input
                    type="text"
                    value={textName}
                    placeholder="Item Name"
                    onChange={(event) => {
                      setTextName(event.target.value);
                    }}
                  />

                  <h4 className="title-create-item">Description</h4>
                  <textarea
                    value={textDescription}
                    placeholder="e.g. “This is very limited item”"
                    onChange={(event) => {
                      setTextDescription(event.target.value);
                    }}
                  ></textarea>
                  <h4 className="title-create-item">Category</h4>

                  <div className="row-form style-3">
                    <div className="inner-row-form style-2">
                      <div className="seclect-box" style={{ padding: "0" }}>
                        <div id="item-create" className="dropdown">
                          <Link to="#" className="btn-selector nolink">
                            {categories.text}
                          </Link>
                          <ul>
                            {categoriesOptions?.map((cat, index) => (
                              <li
                                key={index}
                                onClick={() => handleClick(cat, index)}
                              >
                                <span>{cat.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={working}
                      onClick={() => createCollection()}
                    >
                      Create Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Create;
