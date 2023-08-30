import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BACKEND_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  changeAuthor,
  changeDetailedUserInfo,
  changeGlobalProvider,
  changeWalletStatus,
  selectGlobalProvider,
} from "../redux/reducers/auth.reducers";

import {
  changeChainId,
  changeWalletAddress,
  selectCurrentWallet,
  selectCurrentChainId,
} from "../redux/reducers/auth.reducers";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const globalAddress = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);

  const [emailIsValid, setEmailIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [compressedAccount, setCompressedAccount] = useState("");

  useEffect(() => {
    if (globalAddress && globalChainId) {
      dispatch(changeWalletStatus(true));
    } else {
      dispatch(changeWalletStatus(false));
    }
  }, [globalAddress, globalChainId]);

  useEffect(() => {
    if (globalAddress) {
      let accountStr = globalAddress.toString();
      setCompressedAccount(
        accountStr.substring(0, 5) +
          "..." +
          accountStr.substring(accountStr.length - 4, accountStr.length)
      );
    } else {
      setCompressedAccount("");
    }
  }, [globalAddress]);

  const doLogin = (email) => {
    axios({
      method: "post",
      url: `${BACKEND_URL}/api/users/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then(function (response) {
        if (response.data.code === 0) {
          //set the token to sessionStroage
          const token = response.data.token;
          localStorage.setItem("jwtToken", response.data.token);
          let decoded = { id: "", _doc: {} };
          decoded = jwt_decode(token);
          dispatch(changeAuthor(decoded._doc));
          if (decoded.id) {
            axios
              .post(
                `${BACKEND_URL}/api/users/findOne`,
                { userId: decoded.id },
                {
                  headers: {
                    "x-access-token": localStorage.getItem("jwtToken"),
                  },
                }
              )
              .then((result) => {
                dispatch(changeDetailedUserInfo(result.data.data));
                navigate("/");
              })
              .catch(() => {
                console.log("Get detailed userInfo failed.");
              });
          }
        }
      })
      .catch(function (error) {
        toast.error(error);
      });
  };

  //submit form
  const onClickSignUp = async (e) => {
    e.preventDefault();
    if (firstname === "" || !firstname) {
      toast.error("You have input invalid firstname!");
      return;
    }
    if (lastname === "" || !lastname) {
      toast.error("You have input invalid lastname!");
      return;
    }
    if (nickname === "" || !nickname) {
      toast.error("You have input invalid nickname!");
      return;
    }
    if (emailIsValid === false) {
      toast.error("You have input an invalid email!");
      return;
    }
    if (password === "" || !password) {
      toast.error("You have input invalid password!");
      return;
    }
    if (passwordConfirm === "" || !passwordConfirm) {
      toast.error("You have input invalid password confimation!");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("Please input password correctly.");
      return;
    }
    try {
      await axios
        .post(`${BACKEND_URL}/api/users/create`, {
          email: email,
          password: password,
          nickname: nickname,
          firstname: firstname,
          lastname: lastname,
        })
        .then((response) => {
          if (response.data.code === 1) {
            let errMsg = "Email is duplicated.";
            toast.warn(errMsg);
            return;
          } else if (response.status === 200) {
            doLogin(email);
            return;
          }
          toast.error("Sing up failed with network error.");
        })
        .catch((error) => {
          toast.warn("Sign to message error : " + error);
        });
    } catch (error) {
      toast.error("Wallet connection error : " + error);
    }
  };

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailIsValid(emailRegex.test(e.target.value));
  };

  return (
    <div>
      <Header />
      <section className="tf-login tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <h2 className="tf-title-heading ct style-1">Signup To DAYL</h2>

              {/* <div className="flat-form box-login-social">
                <div className="box-title-login">
                  <h5>Login with social</h5>
                </div>
                <ul>
                  <li>
                    <Link to="#" className="sc-button style-2 fl-button pri-3">
                      <i className="icon-fl-google-2"></i>
                      <span>Google</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="sc-button style-2 fl-button pri-3">
                      <i className="icon-fl-facebook"></i>
                      <span>Facebook</span>
                    </Link>
                  </li>
                </ul>
              </div> */}

              <div className="flat-form box-login-email">
                {/* <div className="box-title-login">
                  <h5>Or login with email</h5>
                </div> */}

                <div className="form-inner">
                  <form id="contactform">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <input
                          id="firstname"
                          name="firstname"
                          tabIndex="1"
                          aria-required="true"
                          required
                          type="text"
                          placeholder="First Name"
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <input
                          id="lastname"
                          name="lastname"
                          tabIndex="1"
                          aria-required="true"
                          required
                          type="text"
                          placeholder="Last Name"
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </div>
                    </div>
                    <input
                      id="nickname"
                      name="nickname"
                      tabIndex="1"
                      aria-required="true"
                      required
                      type="text"
                      placeholder="Nick Name"
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                      id="email"
                      name="email"
                      tabIndex="2"
                      aria-required="true"
                      type="email"
                      placeholder="Email Address"
                      required
                      onChange={(e) => handleEmailChange(e)}
                    />
                    <input
                      id="pass"
                      name="pass"
                      tabIndex="3"
                      aria-required="true"
                      type="text"
                      placeholder="Your Password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      id="passconfirm"
                      name="passconfirm"
                      tabIndex="3"
                      aria-required="true"
                      type="text"
                      placeholder="Password Confirmation"
                      required
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    {/* <div className="row-form style-1">
                      <label>
                        Remember me
                        <input type="checkbox" />
                        <span className="btn-checkbox"></span>
                      </label>
                      <Link to="#" className="forgot-pass">
                        Forgot Password ?
                      </Link>
                    </div> */}

                    <button
                      className="submit"
                      onClick={(e) => {
                        onClickSignUp(e);
                      }}
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignUp;
