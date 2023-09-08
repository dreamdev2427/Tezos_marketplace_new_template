import axios from "axios";
import { BACKEND_URL } from "../config";

export async function getSystemTime(): Promise<number> {
  try {
    const resp = await axios.get(`${BACKEND_URL}/api/users/system_time`);
    return resp.data as number;
  } catch (err) {
    console.log(err);
  }
  return 0;
}

export const copyToClipboard = (data: any) => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(data);
  } else {
    var textField = document.createElement("textarea");
    textField.innerText = data;
    textField.style.position = "fixed";
    textField.style.left = "-999999px";
    textField.style.top = "-999999px";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }
};
export function isValidEthereumAddress(address: any) {
  // Ethereum address pattern (42-character hexadecimal string starting with "0x")
  const pattern = /^0x[0-9a-fA-F]{40}$/;
  return pattern.test(address);
}

export function isValidTezosAddress(address:any, networkPrefix = "tz1") {
  // Tezos address pattern (starts with the specified prefix, followed by Base58 characters)
  const pattern = new RegExp(
    `^${networkPrefix}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$`
  );
  return pattern.test(address);
}
export function timeStampToDate(ts: any) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(ts * 1000);

  var year = date.getFullYear();
  // Minutes part from the timestamp
  var month = "0" + date.getMonth();
  // Seconds part from the timestamp
  var day = "0" + date.getDay();

  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime =
    year +
    ":" +
    month +
    ":" +
    day +
    " " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);

  return formattedTime;
}
