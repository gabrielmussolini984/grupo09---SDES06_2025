export type UserRole = 'ATENDENTE' | 'VETERINARIO' | 'ADMINISTRADOR' | 'CLIENTE';

export interface User {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: UserRole;
  dataAdmissao?: string;
  endereco?: string;
  dataNascimento?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  atualizadoPor?: string;
}

export type PetSpecies = 'CACHORRO' | 'GATO' | 'COELHO' | 'AVE' | 'ROEDOR' | 'OUTRO';
export type PetSex = 'MACHO' | 'FEMEA' | 'INDEFINIDO';

export interface Pet {
  id: string;
  nome: string;
  especie: PetSpecies;
  raca: string;
  sexo: PetSex;
  dataNascimento: string;
  cor: string;
  pesoAtual: number;
  tutorId: string;
  tutor?: User;
  observacoes?: string;
  fotoUrl?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  atualizadoPor?: string;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
