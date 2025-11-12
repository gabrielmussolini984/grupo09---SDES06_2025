import axios from "axios";
import { BASE_URL } from "../utils";
import { stripUndefined } from "@/utils/object.utils";
import {
  CreateUserRequest,
  ListUserResponse,
  SearchParams,
  UpdateUserRequest,
} from "./types";

const USER_URL = `${BASE_URL}/users`;

export const createUser = async (data: CreateUserRequest) => {
  await axios.post(`${USER_URL}`, data);
};

export const showUser = async (id: string): Promise<ListUserResponse> => {
  const response = await axios.get<ListUserResponse>(`${USER_URL}/${id}`);
  return response.data;
};

export const listUsers = async (
  params: SearchParams
): Promise<ListUserResponse[]> => {
  const filteredParams = stripUndefined(params);
  const response = await axios.get<ListUserResponse[]>(`${USER_URL}/search`, {
    params: filteredParams,
  });
  return response.data;
};

export const updateUser = async (
  id: string,
  data: UpdateUserRequest,
  adminId?: string
) => {
  await axios.put(`${USER_URL}/${id}`, data, { params: { adminId } });
};

export const removeUser = async (id: string) => {
  await axios.delete(`${USER_URL}/${id}`);
};
