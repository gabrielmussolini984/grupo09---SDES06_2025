export type CreateTutorRequest = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
  address: string;
};

export type SearchParams = {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  orderBy?: "name";
};

export type ListTutorResponse = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
};

export type UpdateTutorRequest = {
  phone: string;
  email: string;
  password: string;
  address: string;
};
