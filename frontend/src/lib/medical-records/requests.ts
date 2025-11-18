import axios from "axios";
import { BASE_URL } from "../utils";
import { stripUndefined } from "@/utils/object.utils";
import {
  CreateMedicalRecordRequest,
  ListMedicalRecordResponse,
  SearchParams,
  ShowMedicalRecordResponse,
  UpdateMedicalRecordRequest,
} from "./types";

const MEDICAL_RECORD_URL = `${BASE_URL}/medical-records`;

export const listMedicalRecords = async (
  params: SearchParams
): Promise<ListMedicalRecordResponse[]> => {
  const filteredParams = stripUndefined(params);
  const response = await axios.get<ListMedicalRecordResponse[]>(
    `${MEDICAL_RECORD_URL}`,
    {
      params: filteredParams,
    }
  );
  return response.data;
};

export const showMedicalRecord = async (
  id: string
): Promise<ShowMedicalRecordResponse> => {
  const response = await axios.get<ShowMedicalRecordResponse>(
    `${MEDICAL_RECORD_URL}/${id}`
  );
  return response.data;
};

export const createMedicalRecord = async (
  data: CreateMedicalRecordRequest,
  files?: File[]
) => {
  await axios.post(`${MEDICAL_RECORD_URL}`, data);
};

export const updateMedicalRecord = async (
  id: string,
  data: UpdateMedicalRecordRequest,
  files?: File[]
) => {
  await axios.patch(`${MEDICAL_RECORD_URL}/${id}`, data);
};

export const removeMedicalRecord = async (id: string) => {
  await axios.delete(`${MEDICAL_RECORD_URL}/${id}`);
};
