import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Loader2, User, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { removePet, showPet } from '@/lib/pet/requests';
import { ShowPetResponse } from '@/lib/pet/types';
import { ListMedicalRecordResponse } from '@/lib/medical-records/types';
import { listMedicalRecords } from '@/lib/medical-records/requests';

const PetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [pet, setPet] = useState<ShowPetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<ListMedicalRecordResponse[]>([]);

  useEffect(() => {
    if (id) {
      loadPet(id);
    }
  }, [id]);

  const loadPet = async (petId: string) => {
    try {
      setLoading(true);
      const data = await showPet(petId);
      setPet(data);
      
      // Load medical records for this pet
      const recordsResponse = await listMedicalRecords({}, petId);
      setMedicalRecords(recordsResponse);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar pet');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await removePet(id);
      toast.success('Pet inativado com sucesso');
      navigate('/pets');
    } catch (error) {
      toast.error(error.message || 'Erro ao remover pet');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months} meses`;
    } else if (years === 1) {
      return '1 ano';
    }
    return `${years} anos`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-0">
      <div className="font-medium text-muted-foreground">{label}</div>
      <div className="col-span-2 text-foreground">{value || '-'}</div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/pets')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {/* <Avatar className="h-16 w-16">
            <AvatarImage src={pet.fotoUrl} alt={pet.nome} />
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              🐾
            </AvatarFallback>
          </Avatar> */}
          <div>
            <h1 className="text-3xl font-bold">{pet.name}</h1>
            <p className="text-muted-foreground">{pet.breed} • {calculateAge(pet.birthDate)}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/pets/${id}/editar`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
        </div>
      </div>

      {/* Pet Info Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">Informações do Pet</h2>
        </div>

        <div className="space-y-0">
          <InfoRow label="Nome" value={pet.name} />
          <InfoRow label="Espécie" value={pet.species} />
          <InfoRow label="Raça" value={pet.breed} />
          <InfoRow 
            label="Sexo" 
            value={
              <Badge variant="outline">
                {pet.sex === 'MACHO' && '♂ Macho'}
                {pet.sex === 'FEMEA' && '♀ Fêmea'}
                {pet.sex === 'INDEFINIDO' && 'Indefinido'}
              </Badge>
            }
          />
          <InfoRow
            label="Data de Nascimento"
            value={`${new Date(pet.birthDate).toLocaleDateString('pt-BR')} (${pet.age})`}
          />
          <InfoRow label="Cor" value={pet.color} />
          <InfoRow label="Peso Atual" value={`${pet.weight} kg`} />
          <InfoRow 
            label="Tutor" 
            value={ 
            <span>

              <User className="h-4 w-4" />
                    {pet.tutorName}
            </span>
             
            }
          />
          {pet.notes && (
            <InfoRow label="Observações" value={pet.notes} />
          )}
        </div>
      </Card>

      {/* Metadata Card */}
      {/* <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold border-b pb-4">Informações do Sistema</h2>
        <div className="space-y-0">
          <InfoRow
            label="Cadastrado em"
            value={new Date(pet.).toLocaleString('pt-BR')}
          />
          <InfoRow
            label="Última atualização"
            value={new Date(pet.atualizadoEm).toLocaleString('pt-BR')}
          />
          {pet.atualizadoPor && (
            <InfoRow label="Atualizado por" value={pet.atualizadoPor} />
          )}
        </div>
      </Card> */}

      {/* Histórico Médico */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Histórico Médico</h2>
          </div>
          <Button onClick={() => navigate(`/historico-medico/novo?petId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        {medicalRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum registro médico encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medicalRecords.map((record) => (
              <Link
                key={record.id}
                to={`/historico-medico/${record.id}/${pet.id}`}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{record.veterinarianName}</span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(record.consultationDate).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {record.diagnosis}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/historico-medico?petId=${id}`)}
            >
              Ver Todos os Registros
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Remover pet"
        description="Tem certeza que deseja remover este pet? Esta ação não pode ser desfeita."
        confirmText="Remover"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default PetDetails;
