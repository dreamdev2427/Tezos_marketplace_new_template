import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import menus from "../../pages/menu";
import DarkMode from "./DarkMode";
import logodark from "../../assets/images/logo/wide_logo.png";
import logodark2x from "../../assets/images/logo/wide_logo.png";
import imgsun from "../../assets/images/icon/sun.png";
import avt from "../../assets/images/avatar/avt.png";
import { useAppSelector, useAppDispatch } from "../../redux/hooks.ts";
import {
  changeChainId,
  changeWalletAddress,
  changeGlobalProvider,
  selectCurrentWallet,
  selectCurrentChainId,
  changeWalletStatus,
  selectGlobalProvider,
  selectCurrentUser,
  changeAuthor,
} from "../../redux/reducers/auth.reducers.ts";
import isEmpty from "../../utilities/isEmpty";
import Web3Modal from "web3modal";
import { providerOptions } from "../../InteractWithSmartContract/providerOptions";
import {
  ipfsUrl,
  chains,
  platformChainIds,
  TEZOS_CHAIN_ID,
} from "../../config";
import { changeNetwork } from "../../InteractWithSmartContract/interact";
import { connectTezosWallet } from "../../InteractWithSmartContract/tezosInteracts";
import { toast } from "react-toastify";
import Web3 from "web3";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode,
} from "@airgap/beacon-sdk";

export const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: false,
  disableInjectedProvider: false,
  providerOptions,
});

const Header = () => {
  const dispatch = useAppDispatch();
  //wallet
  const currentChainId = useAppSelector(selectCurrentChainId);
  const globalPrivider = useAppSelector(selectGlobalProvider);

  const currentUsr = useAppSelector(selectCurrentUser);
  const globalAddress = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const { pathname } = useLocation();
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState({});
  const [compressedAccount, setCompressedAccount] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [walletDropOpen, setWalletDropOpen] = useState(false);
  const [Tezos, setTezos] = useState(
    new TezosToolkit("https://ghostnet.smartpy.io/")
  );
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (globalAddress && globalChainId) {
      setConnected(true);
      dispatch(changeWalletStatus(true));
    } else {
      setConnected(false);
      dispatch(changeWalletStatus(false));
    }
  }, [globalAddress, globalChainId, dispatch]);

  useEffect(() => {
    if (globalAddress) {
      let accountStr = globalAddress.toString();
      setCompressedAccount(
        accountStr.substring(0, 5) +
          "..." +
          accountStr.substring(accountStr.length - 5, accountStr.length)
      );
    } else {
      setCompressedAccount("");
    }
  }, [globalAddress]);

  //logout
  const handleLogout = async () => {
    try {
      if (provider && provider.close) {
        await provider.close();
        await web3Modal.clearCachedProvider();
        setProvider({});
      }
    } catch (e) {}
    setConnected(false);
    dispatch(changeChainId(0));
    dispatch(changeWalletAddress(""));
    dispatch(changeGlobalProvider({}));
    dispatch(changeWalletStatus(false));
    dispatch(changeAuthor(""));
  };

  const headerRef = useRef(null);
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });
  const isSticky = (e) => {
    const header = document.querySelector(".js-header");
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header.classList.add("is-fixed")
      : header.classList.remove("is-fixed");
    scrollTop >= 400
      ? header.classList.add("is-small")
      : header.classList.remove("is-small");
  };

  const menuLeft = useRef(null);
  const btnToggle = useRef(null);
  const btnSearch = useRef(null);

  const menuToggle = () => {
    menuLeft.current.classList.toggle("active");
    btnToggle.current.classList.toggle("active");
  };

  const searchBtn = () => {
    btnSearch.current.classList.toggle("active");
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const handleOpenDropdown = () => {
    setDropOpen(!dropOpen);
    setWalletDropOpen(false);
  };

  const handleOpenWalletDropdown = () => {
    setWalletDropOpen(!walletDropOpen);
    setDropOpen(false);
  };

  const compressWalletAddr = (defultAddr) => {
    if (!isEmpty(defultAddr))
      return (
        defultAddr.substring(0, 8) +
        "..." +
        defultAddr.substring(defultAddr.length - 6, defultAddr.length)
      );
    return "";
  };

  useEffect(() => {
    (async () => {
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
      Tezos.setWalletProvider(wallet_instance);
      setWallet(wallet_instance);
    })();
  }, [Tezos, dispatch]);

  //wallet change
  const handleConnect2Tezos = async () => {
    if (currentChainId !== TEZOS_CHAIN_ID) {
      dispatch(changeChainId(99999));
    }
    await dispatch(connectTezosWallet({ Tezos, wallet }));
  };

  const switchNetwork = async (chainId) => {
    let changed = await changeNetwork(globalPrivider, chainId);
    if (changed.success === true) {
      var provider = await web3Modal.connect();
      var web3 = new Web3(provider);
      var accounts = await web3.eth.getAccounts();

      dispatch(changeGlobalProvider(provider));
      if (accounts[0]) {
        dispatch(changeWalletAddress(accounts[0]));
        dispatch(changeWalletStatus(true));
      } else {
        dispatch(changeWalletAddress(""));
        dispatch(changeWalletStatus(false));
      }
      dispatch(changeChainId(chainId));
    } else {
      toast.error(
        `Please reconnect your wallet to ${
          chains[platformChainIds[0]].name || ""
        } or ${chains[platformChainIds[1]].name || ""} and try again.`
      );
      dispatch(changeWalletAddress(""));
      dispatch(changeWalletStatus(false));
    }
  };

  return (
    <header id="header_main" className="header_1 js-header" ref={headerRef}>
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div className="wrap-box flex">
                <div id="site-logo" className="clearfix">
                  <div id="site-logo-inner">
                    <Link to="/" rel="home" className="main-logo">
                      <img
                        id="logo_header"
                        src={logodark}
                        srcSet={`${logodark2x}`}
                        alt="nft-gaming"
                      />
                    </Link>
                  </div>
                </div>
                <div
                  className="mobile-button"
                  ref={btnToggle}
                  onClick={menuToggle}
                >
                  <span></span>
                </div>
                <nav id="main-nav" className="main-nav" ref={menuLeft}>
                  <div id="site-logo" className="clearfix d-lg-none">
                    <div className="resp-logo tex-center">
                      <Link to="/" rel="home" className="main-logo">
                        <img
                          id="logo_header"
                          src={logodark}
                          srcSet={`${logodark2x}`}
                          alt="nft-gaming"
                        />
                      </Link>
                    </div>
                  </div>
                  <ul id="menu-primary-menu" className="menu">
                    {isEmpty(currentUsr) || isEmpty(currentUsr?.email) ? (
                      <>
                        <Link
                          to="/login"
                          className="sc-button style-1 fl-button pri-1 mb-4 mb-lg-0 mr-lg-3"
                        >
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/sign-up"
                          className="sc-button style-1 fl-button pri-1"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </>
                    ) : (
                      <div className="d-lg-none">
                        {(isEmpty(currentUsr?.address) === false ||
                          isEmpty(currentUsr?.tezosaddress) === false) && (
                          <Link
                            to="/create-item"
                            className="sc-button style-1 fl-button pri-1 mb-4"
                          >
                            <span>Create</span>
                          </Link>
                        )}
                      </div>
                    )}
                    {menus.map((data, index) => (
                      <li
                        key={index}
                        onClick={() => handleOnClick(index)}
                        className={`menu-item ${
                          data.namesub ? "menu-item-has-children" : ""
                        } ${activeIndex === index ? "active" : ""} `}
                      >
                        <Link to={data.links}>{data.name}</Link>
                        {data.namesub && (
                          <ul className="sub-menu">
                            {data.namesub.map((submenu) => (
                              <li
                                key={submenu.id}
                                className={
                                  pathname === submenu.links
                                    ? "menu-item current-item"
                                    : "menu-item"
                                }
                              >
                                <Link to={submenu.links}>{submenu.sub}</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className={`flat-search-btn connect-wal flex`}>
                  {/* <div className="header-search flat-show-search" id="s1">
                    <Link
                      to="#"
                      className="show-search header-search-trigger"
                      onClick={searchBtn}
                    >
                      <i className="far fa-search"></i>
                    </Link>
                    <div className="top-search" ref={btnSearch}>
                      <form
                        action="#"
                        method="get"
                        role="search"
                        className="search-form"
                      >
                        <input
                          type="search"
                          id="s"
                          className="search-field"
                          placeholder="Search..."
                          name="s"
                          title="Search for"
                          required=""
                        />
                        <button
                          className="search search-submit"
                          type="submit"
                          title="Search"
                        >
                          <i className="icon-fl-search-filled"></i>
                        </button>
                      </form>
                    </div>
                  </div> */}
                  <div
                    className="sc-btn-top mg-r-12 admin_active"
                    id="site-header"
                  >
                    {isEmpty(currentUsr) || isEmpty(currentUsr?.email) ? (
                      <></>
                    ) : (
                      <>
                        {(isEmpty(currentUsr?.address) === false ||
                          isEmpty(currentUsr?.email) === false ||
                          isEmpty(currentUsr?.tezosaddress) === false) && (
                          <Link
                            to="/create-item"
                            className="sc-button style-1 fl-button pri-1 mr-3 d-none d-xl-block"
                          >
                            <span>Create</span>
                          </Link>
                        )}
                        <Link
                          to="#"
                          onClick={handleOpenWalletDropdown}
                          class="sc-button header-slider style style-1 wallet fl-button pri-1"
                        >
                          <span>
                            {currentChainId === 0
                              ? "Connect wallet"
                              : currentChainId === platformChainIds[0] ||
                                currentChainId === platformChainIds[1]
                              ? chains[currentChainId]?.name
                              : "Unusable network"}
                          </span>
                        </Link>
                        <div
                          className={`avatar_popup_wallet  mt-20 ${
                            walletDropOpen ? "visible" : ""
                          }`}
                        >
                          <div className="links">
                            <Link
                              onClick={() => switchNetwork(platformChainIds[0])}
                            >
                              <i class="fas fa-wallet"></i>
                              <span>{chains[platformChainIds[0]].name}</span>
                            </Link>
                            <Link
                              onClick={() => handleConnect2Tezos()}
                              className="mt-10"
                            >
                              <i class="fas fa-wallet"></i>
                              <span>{chains[platformChainIds[1]].name}</span>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {(isEmpty(currentUsr?.address) === false ||
                    isEmpty(currentUsr?.email) === false ||
                    isEmpty(currentUsr?.tezosaddress) === false) && (
                    <div className="admin_active " id="header_admin">
                      <div className="header_avatar">
                        <div className="price">
                          <span>
                            <strong>
                              {connected === false && "No wallet"}
                              {connected === true && compressedAccount}
                            </strong>
                          </span>
                        </div>
                        <img
                          className="avatar"
                          src={
                            !isEmpty(currentUsr) && !isEmpty(currentUsr?.avatar)
                              ? `${ipfsUrl}${currentUsr?.avatar}`
                              : avt
                          }
                          alt="avatar"
                          onClick={handleOpenDropdown}
                        />
                        <div
                          className={` avatar_popup  mt-20 ${
                            dropOpen ? "visible" : ""
                          }`}
                        >
                          <div className="d-none">
                            <img className="coin" src={imgsun} alt="/" />
                            <div className="info ml-10">
                              <p className="text-sm font-book text-gray-400">
                                Balance
                              </p>
                              <p className="w-full text-sm font-bold text-green-500">
                                16.58 ETH
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center ">
                            <img
                              className="avatar"
                              src={
                                !isEmpty(currentUsr) &&
                                !isEmpty(currentUsr?.avatar)
                                  ? `${ipfsUrl}${currentUsr?.avatar}`
                                  : avt
                              }
                              alt="Avatar"
                            />
                            <div className="info ml-10">
                              <p className="text-sm font-book font-weight-bold">
                                {currentUsr?.nickname}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center copy-text justify-content-between mt-10">
                            <span>
                              {/* {!isEmpty(currentUsr) &&
                              !isEmpty(currentUsr?.address)
                                ? compressWalletAddr(currentUsr?.address || "")
                                : ""}{" "} */}
                              {connected === false && "No wallet"}
                              {connected === true && compressedAccount}
                            </span>
                            <Link to="/" className="ml-2">
                              <i className="fal fa-copy"></i>
                            </Link>
                          </div>
                          <hr className="hr" />
                          <div className="links">
                            <Link to={`/author/${currentUsr?._id}`}>
                              <i class="far fa-user"></i>
                              <span> My profile</span>
                            </Link>
                            <Link className="mt-10" to={`/collectionList`}>
                              <i className="fab fa-accusoft"></i>{" "}
                              <span> My collection</span>
                            </Link>
                            <Link className="mt-10" to="/edit-profile">
                              <i className="fas fa-pencil-alt"></i>{" "}
                              <span> Edit Profile</span>
                            </Link>
                            <hr className="hr" style={{ width: "100%" }} />

                            <Link to="/login" id="logout">
                              <i className="fal fa-sign-out"></i>{" "}
                              <span onClick={handleLogout}> Logout</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DarkMode />
    </header>
  );
};

export default Header;
