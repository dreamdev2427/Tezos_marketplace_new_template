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
