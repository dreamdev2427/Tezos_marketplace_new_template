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
