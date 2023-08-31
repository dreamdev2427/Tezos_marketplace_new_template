import React, { useState } from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import { Link } from "react-router-dom";
import isEmpty from "../../../utilities/isEmpty";
import { chains } from "../../../config";
import { Modal } from "react-bootstrap";

const Bid = ({ className = "", onOk, show, onHide, nft = {} }) => {
  const [price, setPrice] = useState(0);
  const [priceIsInvalid, setPriceIsInvalid] = useState(false);
  const [warningStr, setWarningStr] = useState("");
  const regularInputTestRegExp = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/gm;

  const onChangePrice = (e) => {
    var inputedPrice = e.target.value;
    if (inputedPrice !== "") {
      setPriceIsInvalid(false);
      let m;
      let correct = false;
      while ((m = regularInputTestRegExp.exec(inputedPrice)) !== null) {
        if (m.index === regularInputTestRegExp.lastIndex) {
          regularInputTestRegExp.lastIndex++;
        }
        if (m[0] === inputedPrice) {
          correct = true;
        }
      }
      if (!correct) {
        setPriceIsInvalid(true);
        setWarningStr("Price must be a number.");
        return;
      }
    }
    if (isNaN(inputedPrice)) {
      setPriceIsInvalid(true);
      setWarningStr("Bidding price must be a valid number.");
      return;
    }
    setPriceIsInvalid(false);
    setWarningStr("");
    setPrice(inputedPrice);
  };

  const onContinue = () => {
    if (isNaN(price)) {
      setPriceIsInvalid(true);
      setWarningStr("Bidding price must be a valid number.");
      return;
    }
    if (nft && nft.bids && nft.bids.length > 0) {
      if (Number(price) <= Number(nft.bids[nft.bids.length - 1].price)) {
        setWarningStr("Bidding price must be bigger than crrent max bid.");
        setPriceIsInvalid(true);
        return;
      }
    }
    if (nft && nft.bids && nft.bids.length === 0) {
      if (Number(price) <= Number(nft.price)) {
        setWarningStr(
          "Bidding price must be bigger than auction staring price."
        );
        setPriceIsInvalid(true);
        return;
      }
    }
    setWarningStr("");
    setPriceIsInvalid(false);
    setTimeout(() => {
      onOk(Number(price));
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>
      <div className={cn(className, styles.checkout)}>
        <div className={cn("h4", styles.title)}>Place a bid</div>
        <div className={styles.info}>
          You are about to purchase <strong>{nft && nft.name}</strong>
        </div>
        <div className={styles.stage}>Your bid </div>
        {nft && nft.bids.length > 0 && (
          <div className={styles.stageBid}>{`( Current Max bid : ${Number(
            nft.bids[nft.bids.length - 1].price
          )} ${chains[nft?.chainId || 1]?.currency || "ETH"})`}</div>
        )}
        {nft && nft.bids.length === 0 && (
          <div className={styles.stageBid}>{`( Started price : ${Number(
            nft.price
          )} ${chains[nft?.chainId || 1]?.currency || "ETH"})`}</div>
        )}
        <div className={styles.table}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              name="price"
              id="priceInput"
              value={price || ""}
              onChange={(e) => onChangePrice(e)}
              placeholder="Must be bigger than current max bid."
            />
          </div>
          {priceIsInvalid === true ? (
            <span style={{ color: "red", fontSize: "15px"}}>{warningStr}</span>
          ) : (
            <span style={{ color: "green" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
        </div>
        <div className={styles.btns}>
          <Link className="sc-button fl-button pri-3" onClick={onContinue}>
            <span>Place a bid</span>
          </Link>
          <Link className="sc-button fl-button pri-3" onClick={onHide}>
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default Bid;
