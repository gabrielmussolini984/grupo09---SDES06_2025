import { z } from "zod";

// CPF validation
export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

// User schema
export const userSchema = z
  .object({
    nomeCompleto: z
      .string()
      .min(1, "Nome completo é obrigatório")
      .max(150, "Nome deve ter no máximo 150 caracteres")
      .trim(),
    usuario: z
      .string()
      .min(4, "Nome de usuário deve ter no mínimo 4 caracteres")
      .max(20, "Nome de usuário deve ter no máximo 20 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Nome de usuário pode conter apenas letras, números e underscores"
      )
      .trim(),
    cpf: z.preprocess(
      (val) => (typeof val === "string" ? val.replace(/[^\d]/g, "") : val),
      z
        .string()
        .min(11, "CPF é obrigatório")
        .max(11, "CPF inválido")
        .refine(validateCPF, "CPF inválido")
    ),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("E-mail inválido")
      .max(255, "E-mail deve ter no máximo 255 caracteres")
      .trim(),
    telefone: z.preprocess(
      (val) => (typeof val === "string" ? val.replace(/[^\d]/g, "") : val),
      z
        .string()
        .min(10, "Telefone é obrigatório")
        .regex(/^\d{10,11}$/, "Telefone deve conter apenas 10 ou 11 dígitos")
    ),
    cargo: z.enum(["ATENDENTE", "VETERINARIO", "ADMINISTRADOR"], {
      required_error: "Cargo é obrigatório",
    }),
    dataAdmissao: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;
        return new Date(date) <= new Date();
      }, "Data de admissão não pode ser futura"),
    endereco: z.string().optional(),
    dataNascimento: z.string().optional(),
    senha: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(20, "Senha deve ter no máximo 20 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Senha deve conter pelo menos um caractere especial"
      )
      .optional(),
    confirmarSenha: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.dataAdmissao) {
        return false;
      }
      return true;
    },
    {
      message: "Data de admissão é obrigatória para funcionários",
      path: ["dataAdmissao"],
    }
  )
  .refine(
    (data) => {
      if (data.senha && data.senha !== data.confirmarSenha) {
        return false;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    }
  );

// Pet schema
export const petSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome do pet é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  especie: z.enum(["CACHORRO", "GATO", "COELHO", "AVE", "ROEDOR", "OUTRO"], {
    required_error: "Espécie é obrigatória",
  }),
  raca: z
    .string()
    .min(1, "Raça é obrigatória")
    .max(100, "Raça deve ter no máximo 100 caracteres")
    .trim(),
  sexo: z.enum(["MACHO", "FEMEA", "INDEFINIDO"], {
    required_error: "Sexo é obrigatório",
  }),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((date) => {
      return new Date(date) <= new Date();
    }, "Data de nascimento não pode ser futura"),
  cor: z
    .string()
    .min(1, "Cor é obrigatória")
    .max(50, "Cor deve ter no máximo 50 caracteres")
    .trim(),
  pesoAtual: z
    .number({ invalid_type_error: "Peso deve ser um número" })
    .positive("Peso deve ser positivo")
    .max(500, "Peso deve ser menor que 500kg"),
  tutorId: z.string().min(1, "Tutor é obrigatório"),
  observacoes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
  fotoUrl: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type PetFormData = z.infer<typeof petSchema>;
