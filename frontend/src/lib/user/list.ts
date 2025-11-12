import { UserRole } from "@/types";
import axios from "axios";
import { BASE_URL } from "../utils";
import { stripUndefined } from "@/utils/object.utils";

export type SearchParams = {
  name?: string;
  cpf?: string;
  role: UserRole;
  admissionStart?: string;
  admissionEnd?: string;
  orderBy?: "date" | "name";
};

export type ListUserResponse = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  admissionDate: string;
};

export const listUsers = async (
  params: SearchParams
): Promise<ListUserResponse[]> => {
  const filteredParams = stripUndefined(params);
  console.log(filteredParams);
  const response = await axios.get<ListUserResponse[]>(
    `${BASE_URL}/users/search`,
    {
      params: filteredParams,
    }
  );
  return response.data;
};
