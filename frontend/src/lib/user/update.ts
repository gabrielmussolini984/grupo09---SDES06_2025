import axios from "axios";
import { UserRole } from "@/types";
import { BASE_URL } from "../utils";

export type UpdateUserRequest = {
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  admissionDate: string;
};

export const updateUser = async (id: number, data: UpdateUserRequest) => {
  await axios.put(`${BASE_URL}/users/${id}`, data);
};
