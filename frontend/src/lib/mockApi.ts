import { User, Pet, ListResponse, UserRole, PetSpecies, PetSex } from '@/types';

// Mock data storage
let users: User[] = [
  {
    id: '1',
    nomeCompleto: 'Dr. João Silva',
    cpf: '123.456.789-00',
    email: 'joao.silva@vetclinic.com',
    telefone: '(11) 98765-4321',
    cargo: 'VETERINARIO',
    dataAdmissao: '2020-01-15',
    ativo: true,
    criadoEm: '2020-01-15T10:00:00Z',
    atualizadoEm: '2020-01-15T10:00:00Z',
  },
  {
    id: '2',
    nomeCompleto: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria.santos@vetclinic.com',
    telefone: '(11) 98765-4322',
    cargo: 'ATENDENTE',
    dataAdmissao: '2021-03-20',
    ativo: true,
    criadoEm: '2021-03-20T10:00:00Z',
    atualizadoEm: '2021-03-20T10:00:00Z',
  },
  {
    id: '3',
    nomeCompleto: 'Carlos Oliveira',
    cpf: '456.789.123-00',
    email: 'carlos@email.com',
    telefone: '(11) 98765-4323',
    cargo: 'CLIENTE',
    endereco: 'Rua das Flores, 123, São Paulo - SP',
    dataNascimento: '1985-05-10',
    ativo: true,
    criadoEm: '2022-06-10T10:00:00Z',
    atualizadoEm: '2022-06-10T10:00:00Z',
  },
];

let pets: Pet[] = [
  {
    id: '1',
    nome: 'Rex',
    especie: 'CACHORRO',
    raca: 'Labrador',
    sexo: 'MACHO',
    dataNascimento: '2020-03-15',
    cor: 'Dourado',
    pesoAtual: 32.5,
    tutorId: '3',
    observacoes: 'Muito amigável e energético',
    ativo: true,
    criadoEm: '2022-06-15T10:00:00Z',
    atualizadoEm: '2022-06-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Luna',
    especie: 'GATO',
    raca: 'Siamês',
    sexo: 'FEMEA',
    dataNascimento: '2021-08-20',
    cor: 'Creme e marrom',
    pesoAtual: 4.2,
    tutorId: '3',
    observacoes: 'Precisa de medicação para ansiedade',
    ativo: true,
    criadoEm: '2022-07-10T10:00:00Z',
    atualizadoEm: '2022-07-10T10:00:00Z',
  },
];

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Users API
export const mockUsersApi = {
  list: async (filters?: {
    nome?: string;
    cpf?: string;
    cargo?: UserRole;
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<User>> => {
    await delay();
    
    let filtered = [...users];
    
    if (filters?.nome) {
      filtered = filtered.filter(u => 
        u.nomeCompleto.toLowerCase().includes(filters.nome!.toLowerCase())
      );
    }
    
    if (filters?.cpf) {
      filtered = filtered.filter(u => u.cpf.includes(filters.cpf!));
    }
    
    if (filters?.cargo) {
      filtered = filtered.filter(u => u.cargo === filters.cargo);
    }
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  getById: async (id: string): Promise<User> => {
    await delay();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },

  create: async (data: Omit<User, 'id' | 'criadoEm' | 'atualizadoEm' | 'ativo'>): Promise<User> => {
    await delay();
    
    // Validate unique CPF and email
    if (users.some(u => u.cpf === data.cpf)) {
      throw new Error('CPF já cadastrado');
    }
    if (users.some(u => u.email === data.email)) {
      throw new Error('E-mail já cadastrado');
    }
    
    const newUser: User = {
      ...data,
      id: String(users.length + 1),
      ativo: true,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    users.push(newUser);
    return newUser;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    await delay();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    
    users[index] = {
      ...users[index],
      ...data,
      id,
      atualizadoEm: new Date().toISOString(),
    };
    
    return users[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    
    users[index].ativo = false;
    users[index].atualizadoEm = new Date().toISOString();
  },
};

// Pets API
export const mockPetsApi = {
  list: async (filters?: {
    nome?: string;
    especie?: PetSpecies;
    raca?: string;
    tutorNome?: string;
    tutorCpf?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<Pet>> => {
    await delay();
    
    let filtered = [...pets];
    
    if (filters?.nome) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(filters.nome!.toLowerCase())
      );
    }
    
    if (filters?.especie) {
      filtered = filtered.filter(p => p.especie === filters.especie);
    }
    
    if (filters?.raca) {
      filtered = filtered.filter(p => 
        p.raca.toLowerCase().includes(filters.raca!.toLowerCase())
      );
    }
    
    if (filters?.tutorNome || filters?.tutorCpf) {
      const tutores = users.filter(u => {
        if (filters.tutorNome && !u.nomeCompleto.toLowerCase().includes(filters.tutorNome.toLowerCase())) {
          return false;
        }
        if (filters.tutorCpf && !u.cpf.includes(filters.tutorCpf)) {
          return false;
        }
        return true;
      });
      const tutorIds = tutores.map(t => t.id);
      filtered = filtered.filter(p => tutorIds.includes(p.tutorId));
    }
    
    // Add tutor data
    const withTutors = filtered.map(pet => ({
      ...pet,
      tutor: users.find(u => u.id === pet.tutorId),
    }));
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: withTutors.slice(start, end),
      total: withTutors.length,
      page,
      pageSize,
    };
  },

  getById: async (id: string): Promise<Pet> => {
    await delay();
    const pet = pets.find(p => p.id === id);
    if (!pet) throw new Error('Pet não encontrado');
    return {
      ...pet,
      tutor: users.find(u => u.id === pet.tutorId),
    };
  },

  create: async (data: Omit<Pet, 'id' | 'criadoEm' | 'atualizadoEm' | 'ativo'>): Promise<Pet> => {
    await delay();
    
    const newPet: Pet = {
      ...data,
      id: String(pets.length + 1),
      ativo: true,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    pets.push(newPet);
    return newPet;
  },

  update: async (id: string, data: Partial<Pet>): Promise<Pet> => {
    await delay();
    const index = pets.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pet não encontrado');
    
    pets[index] = {
      ...pets[index],
      ...data,
      id,
      atualizadoEm: new Date().toISOString(),
    };
    
    return pets[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const index = pets.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pet não encontrado');
    
    pets[index].ativo = false;
    pets[index].atualizadoEm = new Date().toISOString();
  },
};

// Get all tutores (users with CLIENTE role)
export const getTutores = async (): Promise<User[]> => {
  await delay(200);
  return users.filter(u => u.cargo === 'CLIENTE' && u.ativo);
};
