import React from "react";
import cn from "classnames";
import styles from "./Checkout.module.sass";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Checkout = ({
  className = "",
  onOk,
  show,
  onHide,
  items = [],
  nft = {},
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>
      <div className={cn(className, styles.checkout)}>
        <div className={cn("h4", styles.title)}>Checkout</div>
        <div className={styles.info}>
          You are about to purchase <strong>{nft && nft.name}</strong>
          {/* from{" "}<strong>PINK BANANA</strong> */}
        </div>
        <div className={styles.table}>
          {items &&
            items.length > 0 &&
            items.map((x, index) => (
              <div className={styles.row} key={index}>
                <div className={styles.col}>{x.title}</div>
                <div className={styles.col}>{x.value}</div>
              </div>
            ))}
        </div>

        <div className={styles.btns}>
          <Link className="sc-button fl-button pri-3" onClick={onOk}>
            <span>I understand, continue</span>
          </Link>
          <Link className="sc-button fl-button pri-3" onClick={onHide}>
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default Checkout;
