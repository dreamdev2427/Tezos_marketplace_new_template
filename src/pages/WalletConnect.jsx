import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Modal } from "react-bootstrap";

import img1 from "../assets/images/icon/connect-1.png";
import img2 from "../assets/images/icon/walletlink.webp";
import img3 from "../assets/images/icon/connect-3.png";
import img4 from "../assets/images/icon/connect-4.png";
import QrCodeImg from "../assets/images/qr-code.png";

const WalletConnect = () => {
  const [showModal, setShowModal] = useState(false);

  const [data] = useState([
    {
      img: img1,
      title: "Meta Mask",
    },
    {
      img: img2,
      title: "Wallet Link",
    },
    {
      img: img3,
      title: "Fortmatic",
    },
    {
      img: img4,
      title: "Wallet Connect",
    },
  ]);
  return (
    <div>
      <Header />

      <div className="tf-connect-wallet tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12">
              <h2 className="tf-title-heading ct style-2 mg-bt-12">
                Connect Your Wallet
              </h2>
              <h5 className="sub-title ct style-1 pad-400">
                Connect with one of our available wallet providers or create a
                new one.
              </h5>
            </div>
            <div className="col-md-12">
              <div className="sc-box-icon-inner style-2">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="sc-box-icon"
                    onClick={() => setShowModal(true)}
                  >
                    <div className="img">
                      <img src={item.img} alt="Wallet" width={54} />
                    </div>
                    <h4 className="heading">
                      <Link>{item.title}</Link>{" "}
                    </h4>
                    <p className="content">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <h2>Connect Wallet </h2>
        </Modal.Header>
        <div className="modal-body space-y-20 pd-40">
          <form>
            <h3>Scan to connect</h3>
            <p>Open Coinbase Wallet on your mobile phone and scan</p>

            <div
              className="flex justify-content-center align-items-center p-5 mt-4 bg-white border "
              style={{ background: "white", borderRadius: "15px" }}
            >
              <img src={QrCodeImg} alt="QRcode" />
            </div>

            <div className="flex justify-content-center align-items-center mt-5 gap-3">
              <button type="submit">Install app</button>
              <button type="button">Cancel</button>
            </div>
          </form>
        </div>
      </Modal>
      <Footer />
    </div>
  );
};

export default WalletConnect;
