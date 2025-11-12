import axios from "axios";
import { BASE_URL } from "../utils";

export const removeUser = async (id: string) => {
  await axios.delete(`${BASE_URL}/users/${id}`);
};
