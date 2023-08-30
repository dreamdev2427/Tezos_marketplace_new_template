import React from 'react';
import { Modal } from "react-bootstrap";
const SuccessModal = (props) => {
  return (
    <Modal
    show={props.show}
    onHide={props.onHide}
    >
    <Modal.Header closeButton></Modal.Header>
    <div className="modal-body space-y-20 pd-40">
        <h3 className="text-center">Your Bidding
            Successfuly Added</h3>
        <p className="text-center">your bid <span className="price color-popup">(4ETH) </span> has been listing to our database</p>
        <button className="btn btn-primary"> Watch the listings</button>
    </div>
    </Modal>
  );
};

export default SuccessModal;
