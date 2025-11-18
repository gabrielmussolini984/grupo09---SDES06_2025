import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { medicalRecordSchema } from '@/lib/validators';
import { z } from 'zod';
import { ListPetResponse } from '@/lib/pet/types';
import { ListUserResponse } from '@/lib/user/types';
import { listPets } from '@/lib/pet/requests';
import { listUsers } from '@/lib/user/requests';
import { createMedicalRecord, showMedicalRecord, updateMedicalRecord } from '@/lib/medical-records/requests';

type FormData = z.infer<typeof medicalRecordSchema>;

export default function MedicalRecordForm() {
  const { id, petId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<ListPetResponse[]>([]);
  const [veterinarians, setVeterinarians] = useState<ListUserResponse[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      petId: '',
      veterinarianId: '',
      consultationDate: '',
      diagnosis: '',
      prescription: '',
      notes: '',
    },
  });

  useEffect(() => {
    loadPets();
    loadVeterinarians();
    if (isEditing) {
      loadRecord();
    }
  }, [id]);

  const loadPets = async () => {
    try {
      const response = await listPets();
      setPets(response);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pets',
        variant: 'destructive',
      });
    }
  };

  const loadVeterinarians = async () => {
    try {
      const response = await listUsers({role: 'VETERINARIO'});
      setVeterinarians(response);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os veterinários',
        variant: 'destructive',
      });
    }
  };

  const loadRecord = async () => {
    if (!id || !petId) return;
    
    setLoading(true);
    try {
      const record = await showMedicalRecord(id, petId);
      form.reset({
        petId,
        veterinarianId: null,
        consultationDate: record.consultationDate,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        notes: record.notes,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o registro',
        variant: 'destructive',
      });
      navigate('/historico-medico');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateMedicalRecord(id!, {
          diagnosis: data.diagnosis,
          prescription: data.prescription,
          notes: data.notes,
          consultationDate: data.consultationDate,
          veterinarianName: veterinarians.find(vet => vet.id === data.veterinarianId)?.name || '',
        },files.length > 0 ? files : undefined,);
        toast({
          title: 'Sucesso',
          description: 'Registro médico atualizado com sucesso',
        });
      } else {
        await createMedicalRecord({
          petId: data.petId,
          veterinarianId: data.veterinarianId,
          consultationDate: data.consultationDate,
          diagnosis: data.diagnosis,
          prescription: data.prescription,
          notes: data.notes,
        },
         files.length > 0 ? files : undefined,
      );
        toast({
          title: 'Sucesso',
          description: 'Registro médico criado com sucesso',
        });
      }
      navigate('/pets/' + data.petId);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar registro',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/historico-medico')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Registro Médico' : 'Novo Registro Médico'}
        </h1>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um pet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="veterinarianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veterinário *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veterinário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Consulta *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o diagnóstico"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a prescrição médica"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Anexar Arquivos</FormLabel>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivos
                  </Button>
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/historico-medico')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
