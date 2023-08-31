import React from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { chains } from "../../../config";

const Accept = ({ className = "", show, onOk, onHide, nft = {} }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>
      <div className={cn(className, styles.accept)}>
      <div className={cn("h4", styles.title)}>Accept a bid</div>
        <div className={styles.line}>
          <div className={styles.text} style={{marginLeft:"0px"}}>
            You are about to accept a bid for <strong>{nft && nft.name}</strong>
          </div>
        </div>
        {nft ? (
          <div className={styles.stage}>
            {Number(
              nft.bids.length > 0 && nft.bids[nft.bids.length - 1].price
            ).toFixed(4)}{" "}
            {chains[nft?.chainId || 1]?.currency || "ETH"} for 1 item
          </div>
        ) : (
          <div className={styles.stage}>
            0 {chains[nft?.chainId || 1]?.currency || "ETH"} for 1 item
          </div>
        )}
        <div className={styles.btns}>
          <Link className="sc-button fl-button pri-3" onClick={onOk}>
            <span>Accept bid</span>
          </Link>
          <Link className="sc-button fl-button pri-3" onClick={onHide}>
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default Accept;
