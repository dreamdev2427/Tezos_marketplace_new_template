import React from "react";
import cn from "classnames";
import styles from "./Burn.module.sass";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const Burn = ({ className = "", show, onOk, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton></Modal.Header>
      <div className={cn(className, styles.transfer)}>
        <div className={cn("h4", styles.title)}>Burn token</div>
        <div className={styles.text}>
          Are you sure to burn this token? This action cannot be undone. Token
          will be transfered to zero address
        </div>
        <div className={styles.btns}>
          <Link className="sc-button fl-button pri-3" onClick={onOk}>
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

export default Burn;
