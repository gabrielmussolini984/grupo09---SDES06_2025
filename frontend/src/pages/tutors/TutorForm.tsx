import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { tutorSchema, TutorFormData } from "@/lib/validators";
import { maskCPF, maskPhone } from "@/lib/masks";
import { createTutor, showTutor, updateTutor } from "@/lib/tutor/requests";

const TutorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
  });

  const cpfValue = watch("cpf");
  const phoneValue = watch("phone");

  useEffect(() => {
    if (cpfValue) {
      setValue("cpf", maskCPF(cpfValue));
    }
  }, [cpfValue, setValue]);

  useEffect(() => {
    if (phoneValue) {
      setValue("phone", maskPhone(phoneValue));
    }
  }, [phoneValue, setValue]);

  useEffect(() => {
    if (isEditing && id) {
      loadTutor(id);
    }
  }, [id, isEditing]);

  const loadTutor = async (tutorId: string) => {
    try {
      setLoadingData(true);
      const tutor = await showTutor(tutorId);
      setValue("name", tutor.name);
      setValue("cpf", tutor.cpf);
      setValue("email", tutor.email);
      setValue("phone", tutor.phone);
      setValue("address", tutor.address);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar tutor");
      navigate("/tutores");
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: TutorFormData) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        await updateTutor(id, {
          phone: data.phone,
          email: data.email,
          password: data.password,
          address: data.address,
        });
        toast.success("Tutor atualizado com sucesso");
      } else {
        if (!data.password) {
          toast.error("Senha é obrigatória para novo cadastro");
          return;
        }
        await createTutor({
          name: data.name,
          cpf: data.cpf.replace(/\D/g, ""),
          email: data.email,
          phone: data.phone,
          password: data.password,
          birthDate: data.birthDate,
          address: data.address,
        });
        toast.success("Tutor cadastrado com sucesso");
      }

      navigate("/tutores");
    } catch (error) {
      toast.error(error.message || "Erro ao salvar tutor");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
          onClick={() => navigate("/tutores")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Editar Tutor" : "Novo Tutor"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Atualize os dados do tutor"
              : "Cadastre um novo tutor"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                disabled={isEditing}
                placeholder="Nome completo do tutor"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf">
                CPF <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cpf"
                {...register("cpf")}
                disabled={isEditing}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
             {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
             {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">
                Data de Nascimento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                disabled={isEditing}
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Endereço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Rua, número, bairro, cidade - estado"
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Senha{" "}
                {!isEditing && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder={
                  isEditing
                    ? "Deixe em branco para não alterar"
                    : "Mínimo 8 caracteres"
                }
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmar Senha{" "}
                {!isEditing && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Digite a senha novamente"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Cadastrar Tutor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tutores")}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TutorForm;
