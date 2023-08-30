import {useEffect} from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ScrollToTop from "./ScrollToTop";
import routes from "./pages/index";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "./config";
import { useAppDispatch } from "./redux/hooks";
import { changeETHPrice } from "./redux/reducers/nft.reducers";
import { changeAuthor, changeDetailedUserInfo } from "./redux/reducers/auth.reducers";
import { changeSystemTime } from "./redux/reducers/bid.reducers";


import { io } from 'socket.io-client';

var socket = io(`${BACKEND_URL}`);

function App() {
  const dispatch = useAppDispatch();

  socket.on("ServerTime", (data) => {
    // dispatch(changeSystemTime(data));      
   })

  const fetchETHPrice = async () => {
    const apiForETHPrice = "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2&vs_currencies=usd";
    const response = await axios.get(apiForETHPrice);
    let ethPrice = response.data["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"].usd;
    dispatch(changeETHPrice(Number(ethPrice)));
  }

  useEffect(() => {    
    async function checkValidLogin() {

      if (localStorage.jwtToken !== undefined &&
        localStorage.jwtToken !== "" &&
        localStorage.jwtToken !== null) {
        let decoded  = {
          app: 0, _doc: { _id:""}, 
        };
        decoded = jwt_decode(localStorage.jwtToken);
        const currTime = Date.now() / 1000;
          if (decoded.app < currTime) {
            dispatch(changeAuthor({}));
            localStorage.removeItem("jwtToken");
            toast.warn("Session timeouted. Please sign in again");
          }
          else {    
            if(decoded && decoded?._doc) dispatch(changeAuthor(decoded._doc || {}));
            axios.post(`${BACKEND_URL}/api/users/findOne`, { userId: decoded._doc._id }, {
              headers:
              {
                  "x-access-token": localStorage.getItem("jwtToken")
              }
          }).then((result) => {
              dispatch(changeDetailedUserInfo(result.data.data || {}));
          }).catch(() => {
              console.log("Get latest userInfo failed.");
          });
          }
      }
    }
    
    let interval = setInterval( () => {
      fetchETHPrice();
    }, 100000);
    return () => {clearInterval(interval)}
    
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {routes.map((data, index) => (
          <Route
            onUpdate={() => window.scrollTo(0, 0)}
            exact={true}
            path={data.path}
            element={data.component}
            key={index}
          />
        ))}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
      />
    </BrowserRouter>
  );
}

export default App;
