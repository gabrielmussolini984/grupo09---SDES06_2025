export type CreateMedicalRecordRequest = {
  petId: string;
  veterinarianId: string;
  consultationDate: string;
  diagnosis: string;
  prescription: string;
  notes: string;
};

export type SearchParams = {
  petId?: string;
  startDate?: string;
  endDate?: string;
  veterinarianId?: string;
  diagnosisKeyword?: string;
};

export type ListMedicalRecordResponse = {
  id: string;
  consultationDate: string;
  veterinarianName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
};

export type ShowMedicalRecordResponse = {
  id: string;
  veterinarianId: string;
  petId: string;
  consultationDate: string;
  veterinarianName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
};

export type UpdateMedicalRecordRequest = {
  consultationDate: string;
  veterinarianName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
};
