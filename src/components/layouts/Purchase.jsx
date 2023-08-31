import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const Checkout = ({ show, onHide, onOk, items = [], nft = {} }) => {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body space-y-20 pd-40">
          <h3>Checkout</h3>
          <h4>
            You are about to purchase <strong>{nft && nft.name}</strong>
          </h4>

          {items &&
            items.length > 0 &&
            items.map((x, index) => (
              <div key={index}>
                <p className="text-center">{x.title}</p>
                <p className="text-center">{x.value}</p>
              </div>
            ))}
          <div className="flex align-items-center">
            <Link
              to="#"
              onClick={onOk}
              className="btn btn-primary mr-3"
              data-toggle="modal"
              data-target="#popup_bid_success"
              data-dismiss="modal"
              aria-label="Close"
            >
              I understand, continue
            </Link>
            <Link
              to="#"
              onClick={onHide}
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#popup_bid_success"
              data-dismiss="modal"
              aria-label="Close"
            >
              Cancel
            </Link>
          </div>
        </div>
      </Modal>

      {/* <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
      </div>
      <div className={cn("h4", styles.title)}>Follow steps</div>
      <div className={styles.line}>
        <div className={styles.icon}>
          <LoaderCircle className={styles.loader} />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>Purchasing</div>
          <div className={styles.text}>
            Sending transaction with your wallet
          </div>
        </div>
      </div> */}
      {/* <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
        <div className={styles.avatar}>
          <img src="/images/content/avatar-3.jpg" alt="Avatar" />
        </div>
      </div> */}
    </>
  );
};

export default Checkout;
