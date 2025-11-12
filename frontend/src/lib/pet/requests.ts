import axios from "axios";
import { BASE_URL } from "../utils";
import { stripUndefined } from "@/utils/object.utils";
import {
  CreatePetRequest,
  ListPetResponse,
  SearchParams,
  UpdatePetRequest,
} from "./types";

const PET_URL = `${BASE_URL}/pets`;

export const listPets = async (
  params: SearchParams
): Promise<ListPetResponse[]> => {
  const filteredParams = stripUndefined(params);
  const response = await axios.get<ListPetResponse[]>(`${PET_URL}`, {
    params: filteredParams,
  });
  return response.data;
};

export const showPet = async (id: string): Promise<ListPetResponse> => {
  const response = await axios.get<ListPetResponse>(`${PET_URL}/${id}`);
  return response.data;
};

export const createPet = async (tutorId: string, data: CreatePetRequest) => {
  await axios.post(`${PET_URL}/${tutorId}`, data);
};

export const updatePet = async (id: string, data: UpdatePetRequest) => {
  await axios.patch(`${PET_URL}/${id}`, data);
};

export const removePet = async (id: string) => {
  await axios.delete(`${PET_URL}/${id}`);
};
