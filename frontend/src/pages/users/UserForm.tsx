import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userSchema, type UserFormData } from "@/lib/validators";
import { maskCPF, maskPhone } from "@/lib/masks";
import { createUser,updateUser,showUser } from "@/lib/user/requests";
import { UserRole } from "@/types";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      cargo: "ADMINISTRADOR",
    },
  });

  const cargo = watch("cargo");

  useEffect(() => {
    if (isEdit && id) {
      loadUser(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setInitialLoading(true);
      const user = await showUser(userId);
      setValue("nomeCompleto", user.name);
      setValue("cpf", user.cpf);
      setValue("email", user.email);
      setValue("telefone", '12997012128');
      setValue("cargo", user.role);
      setValue("dataAdmissao", user.admissionDate);
      setValue("usuario", 'usuarioexemplo');
    } catch (error) {
      toast.error(error.message || "Erro ao carregar usuário");
      navigate("/usuarios");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      if (isEdit && id) {
        await updateUser(id, {
          admissionDate: data.dataAdmissao,
          email: data.email,
          password: data.senha,
          phone: data.telefone,
          role: data.cargo,
        });
        toast.success("Usuário atualizado com sucesso");
      } else {
        await createUser({
          admissionDate: data.dataAdmissao,
          cpf: data.cpf,
          email: data.email,
          name: data.nomeCompleto,
          phone: data.telefone,
          role: data.cargo,
          username: data.usuario,
          password: data.senha,
        });
        toast.success("Usuário cadastrado com sucesso");
      }

      navigate("/usuarios");
    } catch (error) {
      toast.error(error.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/usuarios")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Usuário" : "Novo Usuário"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Atualize as informações do usuário"
              : "Preencha os dados do novo usuário"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome completo e Usuário */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomeCompleto"
                {...register("nomeCompleto")}
                disabled={isEdit}
                placeholder="Ex: João da Silva"
              />
              {errors.nomeCompleto && (
                <p className="text-sm text-destructive">
                  {errors.nomeCompleto.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario">
                Usuário <span className="text-destructive">*</span>
              </Label>
              <Input
                id="usuario"
                {...register("usuario")}
                disabled={isEdit}
                placeholder="Ex: joaogome984"
              />
              {errors.usuario && (
                <p className="text-sm text-destructive">
                  {errors.usuario.message}
                </p>
              )}
            </div>
          </div>

          {/* CPF and Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">
                CPF <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cpf"
                {...register("cpf")}
                disabled={isEdit}
                placeholder="000.000.000-00"
                onChange={(e) => {
                  const masked = maskCPF(e.target.value);
                  setValue("cpf", masked);
                }}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="exemplo@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Telefone and Cargo */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefone">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telefone"
                {...register("telefone")}
                placeholder="(00) 00000-0000"
                onChange={(e) => {
                  const masked = maskPhone(e.target.value);
                  setValue("telefone", masked);
                }}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">
                Cargo <span className="text-destructive">*</span>
              </Label>
              <Select
                value={cargo}
                onValueChange={(value: UserRole) => setValue("cargo", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATENDENTE">Atendente</SelectItem>
                  <SelectItem value="VETERINARIO">Veterinário</SelectItem>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.cargo && (
                <p className="text-sm text-destructive">
                  {errors.cargo.message}
                </p>
              )}
            </div>
          </div>

          {/* Conditional: Data de Admissão (for employees) */}
          <div className="space-y-2">
            <Label htmlFor="dataAdmissao">
              Data de Admissão <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dataAdmissao"
              type="date"
              {...register("dataAdmissao")}
            />
            {errors.dataAdmissao && (
              <p className="text-sm text-destructive">
                {errors.dataAdmissao.message}
              </p>
            )}
          </div>
          {/* Password (only on create) */}
          {!isEdit && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="senha"
                  type="password"
                  {...register("senha")}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.senha && (
                  <p className="text-sm text-destructive">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  {...register("confirmarSenha")}
                  placeholder="Repita a senha"
                />
                {errors.confirmarSenha && (
                  <p className="text-sm text-destructive">
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/usuarios")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
