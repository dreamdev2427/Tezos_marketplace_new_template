import React, { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Switch from "../../Switch";
import styles from "./PutSale.module.sass";
import Icon from "../../Icon";
import { chains } from "../../../config";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentChainId } from "../../../redux/reducers/auth.reducers";

const PutSale = ({ className = "", onOk, show, onHide }) => {
  const [instant, setInstant] = useState(false);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const [period, setPeriod] = useState(7);
  const [price, setPrice] = useState(0);
  const regularInputTestRegExp = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/gm;

  const onContinue = () => {
    if (isNaN(price) || Number(price) < 0.00001) {
      setPrice(0.00001);
      return;
    }
    onOk(price, instant, period);
  };

  const onChangePrice = (e) => {
    var inputedPrice = e.target.value;
    if (inputedPrice !== "") {
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
        return;
      }
    }
    if (isNaN(inputedPrice)) {
      return;
    }
    setPrice(inputedPrice);
  };
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton></Modal.Header>

        <div className={cn(className, styles.sale)}>
          <div className={cn("h4", styles.title)}>Put on sale</div>
          <div className={styles.line}>
            <div className={styles.icon}>
              <Icon name="coin" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>
                {instant ? "Instant sale" : "Auction Sale"}
              </div>
              <div className={styles.text}>
                Enter the price for which the item will be sold
              </div>
            </div>
            <Switch
              className={styles.switch}
              value={instant}
              setValue={setInstant}
            />
          </div>
          <div className={styles.table}>
            <div className={styles.row}>
              <input
                className={styles.input}
                type="text"
                value={price || ""}
                onChange={(e) => onChangePrice(e)}
                id="priceInput"
                placeholder="Price must be bigger than 0.00001"
              />
              <div
                className={styles.col}
                style={{ display: "flex", alignItems: "center" }}
              >{`${chains[currentChainId || 1]?.currency || "ETH"}`}</div>
            </div>
            {
              //for test we chaged the value 30 to 0.005 , 0.005 days equals with 432 second, with 7.2 min
              !instant && (
                <select
                  className={styles.select}
                  value={period}
                  onChange={(event) => {
                    setPeriod(event.target.value);
                  }}
                  placeholder="Please select auction time"
                >
                  <option value={0.000694}>1min</option>
                  <option value={0.00347}>5min</option>
                  <option value={0.00694}>10min</option>
                  <option value={7}>7 days</option>
                  <option value={10}>10 days</option>
                  <option value={30}>1 month</option>
                </select>
              )
            }
            <div className={styles.bottom}>
              <Link className="sc-button fl-button pri-3" onClick={onContinue}>
                <span>Continue</span>
              </Link>
              <Link className="sc-button fl-button pri-3" onClick={onHide}>
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PutSale;
