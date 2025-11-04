import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { petSchema, type PetFormData } from '@/lib/validators';
import { mockPetsApi, getTutores } from '@/lib/mockApi';
import { User } from '@/types';

const PetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [tutores, setTutores] = useState<User[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
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
      especie: 'CACHORRO',
      sexo: 'MACHO',
      pesoAtual: 0,
    },
  });

  useEffect(() => {
    loadTutores();
    if (isEdit && id) {
      loadPet(id);
    }
  }, [id]);

  const loadTutores = async () => {
    try {
      const data = await getTutores();
      setTutores(data);
    } catch (error) {
      toast.error('Erro ao carregar tutores');
    }
  };

  const loadPet = async (petId: string) => {
    try {
      setInitialLoading(true);
      const pet = await mockPetsApi.getById(petId);
      
      setValue('nome', pet.nome);
      setValue('especie', pet.especie);
      setValue('raca', pet.raca);
      setValue('sexo', pet.sexo);
      setValue('dataNascimento', pet.dataNascimento);
      setValue('cor', pet.cor);
      setValue('pesoAtual', pet.pesoAtual);
      setValue('tutorId', pet.tutorId);
      if (pet.observacoes) setValue('observacoes', pet.observacoes);
      if (pet.fotoUrl) {
        setValue('fotoUrl', pet.fotoUrl);
        setPhotoPreview(pet.fotoUrl);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar pet');
      navigate('/pets');
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo deve ser uma imagem');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setValue('fotoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setValue('fotoUrl', undefined);
  };

  const onSubmit = async (data: PetFormData) => {
    try {
      setLoading(true);
      
      if (isEdit && id) {
        await mockPetsApi.update(id, data as any);
        toast.success('Pet atualizado com sucesso');
      } else {
        await mockPetsApi.create(data as any);
        toast.success('Pet cadastrado com sucesso');
      }
      
      navigate('/pets');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar pet');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/pets')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Editar Pet' : 'Novo Pet'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Atualize as informações do pet' : 'Preencha os dados do novo pet'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Foto do Pet</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoPreview || undefined} />
                <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                  🐾
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                <label htmlFor="photo-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Selecionar Foto
                    </span>
                  </Button>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                
                {photoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG ou WEBP. Máximo 5MB.
            </p>
          </div>

          {/* Nome and Espécie */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome do Pet <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Ex: Rex"
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                <p className="text-sm text-destructive">{errors.especie.message}</p>
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
                id="raca"
                {...register('raca')}
                placeholder="Ex: Labrador ou SRD"
              />
              {errors.raca && (
                <p className="text-sm text-destructive">{errors.raca.message}</p>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                <p className="text-sm text-destructive">{errors.sexo.message}</p>
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
                id="dataNascimento"
                type="date"
                {...register('dataNascimento')}
              />
              {errors.dataNascimento && (
                <p className="text-sm text-destructive">{errors.dataNascimento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor">
                Cor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cor"
                {...register('cor')}
                placeholder="Ex: Dourado"
              />
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
                {...register('pesoAtual', { valueAsNumber: true })}
                placeholder="Ex: 15.5"
              />
              {errors.pesoAtual && (
                <p className="text-sm text-destructive">{errors.pesoAtual.message}</p>
              )}
            </div>

            <div className="space-y-2">
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
                          {tutor.nomeCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tutorId && (
                <p className="text-sm text-destructive">{errors.tutorId.message}</p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Informações adicionais sobre o pet..."
              rows={4}
            />
            {errors.observacoes && (
              <p className="text-sm text-destructive">{errors.observacoes.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Máximo 500 caracteres</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/pets')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PetForm;
