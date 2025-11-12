export type CreatePetRequest = {
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthDate: string;
  color: string;
  weight: number;
  notes: string;
};

export type SearchParams = {
  name?: string;
  species?: string;
  breed?: string;
  ownerName?: string;
  ownerCpf?: string;
  orderBy?: "name" | "owner";
};

export type ListPetResponse = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  tutorName: string;
  tutorCpf: string;
  weight: number;
  notes: string;
};

export type UpdatePetRequest = {
  weight: number;
  color: string;
  notes: string;
};
