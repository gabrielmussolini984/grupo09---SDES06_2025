import { UserRole } from "@/types";

// Parameters for creating a new user
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

// Parameters for searching users
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

// Parameters for updating a user
export type UpdateUserRequest = {
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  admissionDate: string;
};
