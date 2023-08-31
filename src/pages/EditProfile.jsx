import React, { useState, useEffect } from "react";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import Web3 from "web3";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
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
  changeAuthor,
  changeDetailedUserInfo,
  selectCurrentAuthorization,
  selectCurrentUser,
  selectCurrentWallet,
  selectDetailedUser,
  selectGlobalProvider,
} from "../redux/reducers/auth.reducers";
import { pinFileToIPFS, pinJSONToIPFS } from "../utils/pinatasdk";

import { web3Modal } from "../components/header/Header";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode,
} from "@airgap/beacon-sdk";

const EditProfile = () => {
  const currentUsr = useAppSelector(selectCurrentUser);
  const globalAddress = useAppSelector(selectCurrentWallet);
  const detailedInfo = useAppSelector(selectDetailedUser);
  const currentAuthState = useAppSelector(selectCurrentAuthorization);
  const globalProvider = useAppSelector(selectGlobalProvider);

  const [logoImg, setLogoImg] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [nameText, setNameText] = useState("");
  const [firstnameText, setFirstNameText] = useState("");
  const [lastnameText, setLastNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [bioText, setBioText] = useState("");
  const [websiteText, setWebsiteText] = useState("");
  const [facebookText, setFacebookText] = useState("");
  const [twitterText, setTwitterText] = useState("");
  const [telegramText, setTelegramText] = useState("");
  const [walletAccountText, setWalletAccountText] = useState("");
  const [tezosAccountText, setTezosAccountText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getDetailsOfUser = async () => {
    if (isEmpty(currentUsr)) return;
    axios
      .post(`${BACKEND_URL}/api/users/findOne`, {
        userId: currentUsr?._id,
      })
      .then((response) => {
        if (response?.data?.code === 0) {
          const currentUsr = response?.data?.data;
          setFirstNameText(currentUsr?.firstname || "");
          setLastNameText(currentUsr?.lastname || "");
          setNameText(currentUsr?.nickname || "");
          setEmailText(currentUsr?.email?.toString() || "");
          setBioText(currentUsr?.userBio?.toString() || "");
          setEmailText(currentUsr?.email?.toString() || "");
          setWebsiteText(currentUsr?.websiteURL?.toString() || "");
          setFacebookText(currentUsr?.facebook?.toString() || "");
          setTwitterText(currentUsr?.twitter?.toString() || "");
          setTelegramText(currentUsr?.telegram?.toString() || "");
          setWalletAccountText(currentUsr?.address?.toString() || "");
          setTezosAccountText(currentUsr?.tezosaddress?.toString() || "");
          setLogoImg(`${ipfsUrl}${currentUsr?.avatar}` || "");
          dispatch(changeAuthor(currentUsr));
          dispatch(changeDetailedUserInfo(currentUsr));
          if (
            isEmpty(currentUsr?.address) === true ||
            isEmpty(currentUsr?.tezosaddress) === true
          ) {
            toast.info("Please link wallets to your account.");
          }
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    setTimeout(() => {
      getDetailsOfUser();
    }, 500);
  }, []);

  const changeAvatar = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    console.log(file);
    setSelectedAvatarFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader.result?.toString() || "");
    };
    reader.onerror = function (error) {};
  };

  function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  function ValidateWalletAccount(walletAccount) {
    if (/^0x[a-fA-F0-9]{40}$/.test(walletAccount)) {
      return true;
    }
    return false;
  }

  function ValidateWebsiteLink(weblink) {
    if (
      /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/.test(
        weblink
      )
    ) {
      return true;
    }
    return false;
  }

  const onClickUpdate = async () => {
    const params = {
      email: emailText,
      address: walletAccountText,
      tezosaddress: tezosAccountText,
      nickname: nameText,
      websiteURL: websiteText,
      userBio: bioText,
      verified: true,
      banner: "",
      twitter: twitterText,
      facebook: facebookText,
      telegram: telegramText,
      avatar: logoImg.split(`${ipfsUrl}`)[1],
    };
    if (emailText !== "") {
      let correct = ValidateEmail(emailText);
      if (!correct) {
        toast.error("Invalid email.");
        params.email = "";
        return;
      }
    }
    if (walletAccountText !== "") {
      let correct = ValidateWalletAccount(walletAccountText);
      if (!correct) {
        toast.error("Invalid wallet account.");
        params.address = "";
        return;
      }
    } else {
      toast.warn("Wallet account can not be empty.");
      return;
    }
    if (nameText === "") {
      toast.warn("Username can not be empty.");
      return;
    }
    params.nickname = nameText;
    if (websiteText !== "") {
      let correct = ValidateWebsiteLink(websiteText);
      if (!correct) {
        toast.warn("Invalid custom url.");
        params.websiteURL = "";
        return;
      }
    } else params.websiteURL = "";
    if (selectedAvatarFile == null) {
      params.avatar = logoImg.split(`${ipfsUrl}`)[1] || "";
    }
    if (selectedAvatarFile && selectedAvatarFile !== "") {
      const avatarHash = await pinFileToIPFS(selectedAvatarFile);
      params.avatar = avatarHash;
    }

    await axios
      .post(
        `${BACKEND_URL}/api/users/update`,
        {
          ...params,
          _id: detailedInfo?._id || "",
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then(function (response) {
        if (response.data.code === 0) {
          if (detailedInfo && detailedInfo._id) {
            axios
              .post(
                `${BACKEND_URL}/api/users/findOne`,
                { userId: detailedInfo._id },
                {
                  headers: {
                    "x-access-token": localStorage.getItem("jwtToken"),
                  },
                }
              )
              .then((result) => {
                toast.success("You've updated your account successfully!");
                setTimeout(() => {
                  getDetailsOfUser();
                  setTimeout(() => {
                    navigate("/");
                  }, 500);
                }, 1000);
              })
              .catch(() => {
                console.log("Get detailed userInfo failed.");
              });
          }
        } else {
          toast.warn(response.data.message);
        }
      })
      .catch(function (error) {
        toast.error(error);
      });
  };

  const handleSignWithEvmWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      var web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      if (isEmpty(accounts[0]) === false) {
        setWalletAccountText(accounts[0]);

        toast.info("EVM wallet is linked");

        axios
          .post(`${BACKEND_URL}/api/users/update`, {
            _id: currentUsr?._id,
            address: accounts[0],
          })
          .then((response) => {
            console.log("update result of tezos account >>> ", response.data);
            if (response.data?.code === 0) {
              setTimeout(() => {
                getDetailsOfUser();
              }, 1000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed in linking with an evm account.");
    }
  };

  const [Tezos, setTezos] = useState(
    new TezosToolkit("https://ghostnet.smartpy.io/")
  );

  const handleSignWithTezosWallet = async () => {
    try {
      const wallet_instance = new BeaconWallet({
        name: "Template",
        preferredNetwork: NetworkType.GHOSTNET,
        colorMode: ColorMode.LIGHT,
        disableDefaultEvents: false, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT,
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: (data) => {
              return data.publicKey;
            },
          },
        },
      });
      const activeAccount = await wallet_instance?.client.getActiveAccount();
      if (!activeAccount) {
        await wallet_instance?.requestPermissions({
          network: {
            type: NetworkType.GHOSTNET,
            rpcUrl: "https://ghostnet.smartpy.io/",
          },
        });
      }
      const userAddress = await wallet_instance?.getPKH();
      console.log("userAddress >>> ", userAddress);
      if (isEmpty(userAddress) === false) {
        setTezosAccountText(userAddress);
        toast.info("Tezos wallet is linked");
        axios
          .post(`${BACKEND_URL}/api/users/update`, {
            _id: currentUsr?._id,
            tezosaddress: userAddress,
          })
          .then((response) => {
            console.log("update result of tezos account >>> ", response.data);
            if (response.data?.code === 0) {
              setTimeout(() => {
                getDetailsOfUser();
              }, 1000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed in linking with a tezos account.");
    }
  };

  return (
    <div>
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Edit Profile</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
              <div className="sc-card-profile text-center">
                <div className="card-media">
                  <img id="profileimg" src={logoImg} alt="Axies" />
                </div>
                <div id="upload-profile">
                  <Link to="#" className="btn-upload">
                    Upload New Photo{" "}
                  </Link>
                  <input
                    id="tf-upload-img"
                    type="file"
                    name="profile"
                    required=""
                  />
                </div>
                <Link to="#" className="btn-upload style2">
                  Delete
                </Link>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 col-md-12 col-12">
              <div className="form-upload-profile">
                <form action="#" className="form-profile">
                  <div className="form-infor-profile">
                    <div className="info-account">
                      <h4 className="title-create-item">Account info</h4>
                      <fieldset>
                        <h4 className="title-infor-account">Display name</h4>
                        <input
                          type="text"
                          placeholder="Nickname"
                          value={nameText}
                          onChange={(e) => setNameText(e.target.value)}
                          required
                        />
                      </fieldset>

                      <fieldset>
                        <h4 className="title-infor-account">Email</h4>
                        <input
                          type="email"
                          placeholder="example@email.com"
                          value={emailText}
                          onChange={(e) => setEmailText(e.target.value)}
                          required
                        />
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Bio</h4>
                        <textarea
                          tabIndex="4"
                          rows="5"
                          required
                          placeholder="Something about yourself in a few words."
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                        ></textarea>
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Website</h4>
                        <input
                          type="text"
                          placeholder="yourwebsite.com"
                          value={websiteText}
                          onChange={(e) => setWebsiteText(e.target.value)}
                          required
                        />
                      </fieldset>

                      <fieldset>
                        <h4 className="title-infor-account">EVM Address</h4>
                        <div class="input-group">
                          <input
                            type="text"
                            disabled
                            value={walletAccountText}
                            onClick={() => handleSignWithEvmWallet()}
                            onChange={(e) =>
                              setWalletAccountText(e.target.value)
                            }
                          />
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleSignWithEvmWallet()}
                          >
                            Wallet
                          </button>
                        </div>
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Tezos Address</h4>
                        <div class="input-group">
                          <input
                            type="text"
                            disabled
                            placeholder="Click wallet button to link a tezos wallet account"
                            value={tezosAccountText}
                            onClick={() => handleSignWithTezosWallet()}
                            onChange={(e) =>
                              setTezosAccountText(e.target.value)
                            }
                          />

                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleSignWithTezosWallet()}
                          >
                            Wallet
                          </button>
                        </div>
                      </fieldset>
                    </div>
                    <div className="info-social">
                      <h4 className="title-create-item">Your Social media</h4>
                      <fieldset>
                        <h4 className="title-infor-account">Facebook</h4>
                        <input
                          type="text"
                          placeholder="yourfacebook"
                          value={facebookText}
                          onChange={(e) => setFacebookText(e.target.value)}
                          required
                        />
                        <Link to="#" className="connect">
                          <i className="fab fa-facebook"></i>Connect to face
                          book
                        </Link>
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Twitter</h4>
                        <input
                          type="text"
                          placeholder="yourtwitter"
                          value={twitterText}
                          onChange={(e) => setTwitterText(e.target.value)}
                          required
                        />
                        <Link to="#" className="connect">
                          <i className="fab fa-twitter"></i>Connect to Twitter
                        </Link>
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Telegram</h4>
                        <input
                          type="text"
                          placeholder="yourtelegram"
                          value={telegramText}
                          onChange={(e) => setTelegramText(e.target.value)}
                          required
                        />
                        <Link to="#" className="connect">
                          <i className="fab fa-telegram-plane"></i>Connect to
                          Telegram
                        </Link>
                      </fieldset>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClickUpdate();
                    }}
                    className="tf-button-submit mg-t-15"
                    type="submit"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
