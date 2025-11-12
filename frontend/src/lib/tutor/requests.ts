import axios from "axios";
import { BASE_URL } from "../utils";
import { stripUndefined } from "@/utils/object.utils";
import {
  CreateTutorRequest,
  ListTutorResponse,
  SearchParams,
  UpdateTutorRequest,
} from "./types";

const TUTOR_URL = `${BASE_URL}/tutors`;

export const createTutor = async (data: CreateTutorRequest) => {
  await axios.post(`${TUTOR_URL}`, data);
};

export const showTutor = async (id: string): Promise<ListTutorResponse> => {
  const response = await axios.get<ListTutorResponse>(`${TUTOR_URL}/${id}`);
  return response.data;
};

export const listTutors = async (
  params?: SearchParams
): Promise<ListTutorResponse[]> => {
  const filteredParams = stripUndefined(params);
  const response = await axios.get<ListTutorResponse[]>(`${TUTOR_URL}/search`, {
    params: filteredParams,
  });
  return response.data;
};

export const updateTutor = async (
  id: string,
  data: UpdateTutorRequest,
  adminId: string = "1"
) => {
  await axios.put(`${TUTOR_URL}/${id}`, data, { params: { adminId } });
};

export const removeTutor = async (id: string) => {
  await axios.delete(`${TUTOR_URL}/${id}`);
};
