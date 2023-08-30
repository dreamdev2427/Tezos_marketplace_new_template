import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { BACKEND_URL, chains, platformChainIds } from "../config";
import {
  changeAuthor,
  changeDetailedUserInfo,
  changeWalletStatus,
  selectGlobalProvider,
  changeChainId,
  changeWalletAddress,
  changeGlobalProvider,
  selectCurrentWallet,
  selectCurrentChainId,
} from "../redux/reducers/auth.reducers.ts";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAccount, setWalletAccount] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Process form submission
    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "" || !email) {
      toast.error("You have entered an invalid email!");
      return;
    }
    if (password === "" || !password) {
      toast.error("You have entered an invalid password!");
      return;
    }

    try {
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
            setEmail("");
            setPassword("");
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
                })
                .catch(() => {
                  console.log("Get detailed userInfo failed.");
                });
            }
            toast.success("Welcome to DAYL.");
            navigate("/");
          } else {
            toast.warning(
              <div>
                Please sign up first. You can now go to{" "}
                <span
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                  style={{ color: "#00F" }}
                >
                  Sign up page
                </span>
              </div>
            );
          }
        })
        .catch((error) => {
          toast.warn("Sign to message error : " + error);
        });
    } catch (error) {
      toast.error("Wallet connection error : " + error);
      dispatch(changeWalletStatus(false));
      dispatch(changeWalletAddress(""));
    }
  };

  return (
    <div>
      <Header />
      <section className="tf-login tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <h2 className="tf-title-heading ct style-1">Login To NFTs</h2>

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
                  <form
                    action="#"
                    id="contactform"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <input
                      id="email"
                      name="email"
                      tabIndex="2"
                      aria-required="true"
                      type="email"
                      placeholder="Your Email Address"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      tabIndex="1"
                      aria-required="true"
                      required
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="row-form style-1">
                      <label>
                        Remember me
                        <input type="checkbox" />
                        <span className="btn-checkbox"></span>
                      </label>
                      <Link to="#" className="forgot-pass">
                        Forgot Password ?
                      </Link>
                    </div>

                    <button className="submit">Login</button>
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

export default Login;
