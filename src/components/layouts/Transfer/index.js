import React, { useState } from "react";
import cn from "classnames";
import styles from "./Transfer.module.sass";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TEZOS_CHAIN_ID } from "../../../config";

const Transfer = ({
  className = "",
  onOk,
  show,
  onHide,
  chainId = TEZOS_CHAIN_ID,
}) => {
  const regexForWallet =
    chainId === TEZOS_CHAIN_ID
      ? /^(tz1[a-zA-Z0-9]{33})$/gm
      : /^(0x[a-fA-F0-9]{40})$/gm;
  const [toAddr, setToAddr] = useState("");
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);

  const onContinue = () => {
    if (toAddr !== "") {
      let m;
      let correct = false;
      while ((m = regexForWallet.exec(toAddr)) !== null) {
        if (m.index === regexForWallet.lastIndex) {
          regexForWallet.lastIndex++;
        }
        if (m[0] === toAddr) {
          correct = true;
        }
      }
      if (!correct) {
        setAddressIsInvalid(true);
        setToAddr("");
        return;
      }
    } else {
      setAddressIsInvalid(true);
      return;
    }
    setAddressIsInvalid(false);
    onOk(toAddr);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>
      <div className={cn(className, styles.transfer)}>
        <div className={cn("h4", styles.title)}>Transfer token</div>
        <div className={styles.text}>
          You can transfer tokens from your address to another
        </div>
        <div className={styles.info}>Receiver address</div>
        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            name="address"
            value={toAddr}
            onChange={(e) => setToAddr(e.target.value)}
            placeholder="Paste address"
          />
        </div>
        {addressIsInvalid === true ? (
          <span style={{ color: "red", fontSize: "15px" }}>
            Wallet address is invalid.
          </span>
        ) : (
          <></>
        )}
        <div className={styles.btns}>
          <Link className="sc-button fl-button pri-3" onClick={onContinue}>
            <span>Continue</span>
          </Link>
          <Link className="sc-button fl-button pri-3" onClick={onHide}>
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default Transfer;
