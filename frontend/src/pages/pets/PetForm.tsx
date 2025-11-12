import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";
import { petSchema, type PetFormData } from "@/lib/validators";
import { mockPetsApi, getTutores } from "@/lib/mockApi";
import { User } from "@/types";
import { createPet, showPet, updatePet } from "@/lib/pet/requests";
import { listTutors } from "@/lib/tutor/requests";
import { ListTutorResponse } from "@/lib/tutor/types";

const PetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [tutores, setTutores] = useState<ListTutorResponse[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      especie: "CACHORRO",
      sexo: "MACHO",
      pesoAtual: 0,
    },
  });

  useEffect(() => {
    loadTutores();
    if (isEdit && id) {
      loadPet(id)
    }
  }, [id]);

  const loadTutores = async () => {
    try {
      const data = await listTutors();
      setTutores(data);
    } catch (error) {
      toast.error("Erro ao carregar tutores");
    }
  };

  const loadPet = async (petId: string) => {
    try {
      setInitialLoading(true);
      const pet = await showPet(petId);

      setValue("nome", pet.name);
      setValue("especie", pet.species);
      setValue("raca", pet.breed);
      setValue("sexo", pet.sex);
      setValue("dataNascimento", pet.birthDate);
      setValue("cor", pet.color);
      setValue("pesoAtual", pet.weight);
      setValue("tutorId", pet.id);
      if (pet.notes) setValue("observacoes", pet.notes);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar pet");
      navigate("/pets");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: PetFormData) => {
    try {
      setLoading(true);

      if (isEdit && id) {
        await updatePet(id, {
          color: data.cor,
          notes: data.observacoes,
          weight: data.pesoAtual,
        });
        toast.success("Pet atualizado com sucesso");
      } else {
        await createPet(data.tutorId, {
          birthDate: data.dataNascimento,
          breed: data.raca,
          color: data.cor,
          name: data.nome,
          notes: data.observacoes,
          sex: data.sexo,
          species: data.especie,
          weight: data.pesoAtual,
        });
        toast.success("Pet cadastrado com sucesso");
      }

      navigate("/pets");
    } catch (error) {
      toast.error(error.message || "Erro ao salvar pet");
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/pets")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Pet" : "Novo Pet"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Atualize as informações do pet"
              : "Preencha os dados do novo pet"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome and Espécie */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome do Pet <span className="text-destructive">*</span>
              </Label>
              <Input disabled={isEdit} id="nome" {...register("nome")} placeholder="Ex: Rex" />
              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie">
                Espécie <span className="text-destructive">*</span>
              </Label>
              <Controller
              
                name="especie"
                control={control}
                render={({ field }) => (
                  <Select disabled={isEdit} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CACHORRO">Cachorro</SelectItem>
                      <SelectItem value="GATO">Gato</SelectItem>
                      <SelectItem value="COELHO">Coelho</SelectItem>
                      <SelectItem value="AVE">Ave</SelectItem>
                      <SelectItem value="ROEDOR">Roedor</SelectItem>
                      <SelectItem value="OUTRO">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.especie && (
                <p className="text-sm text-destructive">
                  {errors.especie.message}
                </p>
              )}
            </div>
          </div>

          {/* Raça and Sexo */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="raca">
                Raça <span className="text-destructive">*</span>
              </Label>
              <Input
              disabled={isEdit}
                id="raca"
                {...register("raca")}
                placeholder="Ex: Labrador ou SRD"
              />
              {errors.raca && (
                <p className="text-sm text-destructive">
                  {errors.raca.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo">
                Sexo <span className="text-destructive">*</span>
              </Label>
              <Controller
              
                name="sexo"
                control={control}
                render={({ field }) => (
                  <Select disabled={isEdit} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MACHO">Macho</SelectItem>
                      <SelectItem value="FEMEA">Fêmea</SelectItem>
                      <SelectItem value="INDEFINIDO">Indefinido</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sexo && (
                <p className="text-sm text-destructive">
                  {errors.sexo.message}
                </p>
              )}
            </div>
          </div>

          {/* Data de Nascimento and Cor */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">
                Data de Nascimento <span className="text-destructive">*</span>
              </Label>
              <Input
              disabled={isEdit}
                id="dataNascimento"
                type="date"
                {...register("dataNascimento")}
              />
              {errors.dataNascimento && (
                <p className="text-sm text-destructive">
                  {errors.dataNascimento.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor">
                Cor <span className="text-destructive">*</span>
              </Label>
              <Input id="cor" {...register("cor")} placeholder="Ex: Dourado" />
              {errors.cor && (
                <p className="text-sm text-destructive">{errors.cor.message}</p>
              )}
            </div>
          </div>

          {/* Peso and Tutor */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pesoAtual">
                Peso Atual (kg) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pesoAtual"
                type="number"
                step="0.1"
                {...register("pesoAtual", { valueAsNumber: true })}
                placeholder="Ex: 15.5"
              />
              {errors.pesoAtual && (
                <p className="text-sm text-destructive">
                  {errors.pesoAtual.message}
                </p>
              )}
            </div>

            {!isEdit && <div className="space-y-2">
              <Label htmlFor="tutorId">
                Tutor <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="tutorId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutores.map((tutor) => (
                        <SelectItem key={tutor.id} value={tutor.id}>
                          {tutor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tutorId && (
                <p className="text-sm text-destructive">
                  {errors.tutorId.message}
                </p>
              )}
            </div>}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register("observacoes")}
              placeholder="Informações adicionais sobre o pet..."
              rows={4}
            />
            {errors.observacoes && (
              <p className="text-sm text-destructive">
                {errors.observacoes.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Máximo 500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/pets")}
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

export default PetForm;
