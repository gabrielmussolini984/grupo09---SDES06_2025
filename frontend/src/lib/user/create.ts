import axios from "axios";
import { BASE_URL } from "../utils";
import { UserRole } from "@/types";

export type CreateUserRequest = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  role: UserRole;
  admissionDate: string;
  username: string;
  password: string;
};

export const createUser = async (data: CreateUserRequest) => {
  await axios.post(`${BASE_URL}/users`, data);
};
