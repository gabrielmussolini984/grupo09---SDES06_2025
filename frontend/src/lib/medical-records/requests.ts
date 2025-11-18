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
  params: SearchParams,
  petId: string
): Promise<ListMedicalRecordResponse[]> => {
  const filteredParams = stripUndefined(params);
  const response = await axios.get<ListMedicalRecordResponse[]>(
    `${MEDICAL_RECORD_URL}/search`,
    {
      params: {
        ...filteredParams,
        petId,
      },
    }
  );
  return response.data;
};

export const showMedicalRecord = async (
  id: string,
  petId: string
): Promise<ListMedicalRecordResponse> => {
  const allRecords = await listMedicalRecords({}, petId);
  const record = allRecords.find((record) => record.id === id);
  if (!record) {
    throw new Error("Registro médico não encontrado para o pet especificado");
  }
  return record;
};

export const createMedicalRecord = async (
  data: CreateMedicalRecordRequest,
  files?: File[]
) => {
  const formData = new FormData();

  // O segredo está aqui 👇
  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  formData.append("data", jsonBlob);

  files?.forEach((file) => {
    formData.append("files", file);
  });

  await axios.post(`${MEDICAL_RECORD_URL}`, formData, {
    headers: {
      Accept: "*/*",
    },
  });
};

export const updateMedicalRecord = async (
  id: string,
  data: UpdateMedicalRecordRequest,
  files?: File[]
) => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  formData.append("data", jsonBlob);
  files?.forEach((file) => {
    formData.append("files", file);
  });

  await axios.patch(`${MEDICAL_RECORD_URL}/${id}`, formData, {
    headers: {
      Accept: "*/*",
    },
  });
};

export const removeMedicalRecord = async (id: string) => {
  await axios.delete(`${MEDICAL_RECORD_URL}/${id}`);
};
