import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Pet } from '@/types';
import { mockPetsApi } from '@/lib/mockApi';
import ConfirmDialog from '@/components/ConfirmDialog';

const PetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadPet(id);
    }
  }, [id]);

  const loadPet = async (petId: string) => {
    try {
      setLoading(true);
      const data = await mockPetsApi.getById(petId);
      setPet(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar pet');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await mockPetsApi.delete(id);
      toast.success('Pet inativado com sucesso');
      navigate('/pets');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao inativar pet');
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
          <Avatar className="h-16 w-16">
            <AvatarImage src={pet.fotoUrl} alt={pet.nome} />
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              🐾
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{pet.nome}</h1>
            <p className="text-muted-foreground">{pet.raca} • {calculateAge(pet.dataNascimento)}</p>
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
            disabled={!pet.ativo}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Inativar
          </Button>
        </div>
      </div>

      {/* Pet Info Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">Informações do Pet</h2>
          <Badge variant={pet.ativo ? 'default' : 'secondary'}>
            {pet.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="space-y-0">
          <InfoRow label="Nome" value={pet.nome} />
          <InfoRow label="Espécie" value={pet.especie} />
          <InfoRow label="Raça" value={pet.raca} />
          <InfoRow 
            label="Sexo" 
            value={
              <Badge variant="outline">
                {pet.sexo === 'MACHO' && '♂ Macho'}
                {pet.sexo === 'FEMEA' && '♀ Fêmea'}
                {pet.sexo === 'INDEFINIDO' && 'Indefinido'}
              </Badge>
            }
          />
          <InfoRow
            label="Data de Nascimento"
            value={`${new Date(pet.dataNascimento).toLocaleDateString('pt-BR')} (${calculateAge(pet.dataNascimento)})`}
          />
          <InfoRow label="Cor" value={pet.cor} />
          <InfoRow label="Peso Atual" value={`${pet.pesoAtual} kg`} />
          <InfoRow 
            label="Tutor" 
            value={
              pet.tutor ? (
                <Link to={`/usuarios/${pet.tutor.id}`} className="flex items-center gap-2 text-primary hover:underline">
                  <User className="h-4 w-4" />
                  {pet.tutor.nomeCompleto}
                </Link>
              ) : '-'
            }
          />
          {pet.observacoes && (
            <InfoRow label="Observações" value={pet.observacoes} />
          )}
        </div>
      </Card>

      {/* Metadata Card */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold border-b pb-4">Informações do Sistema</h2>
        <div className="space-y-0">
          <InfoRow
            label="Cadastrado em"
            value={new Date(pet.criadoEm).toLocaleString('pt-BR')}
          />
          <InfoRow
            label="Última atualização"
            value={new Date(pet.atualizadoEm).toLocaleString('pt-BR')}
          />
          {pet.atualizadoPor && (
            <InfoRow label="Atualizado por" value={pet.atualizadoPor} />
          )}
        </div>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Inativar pet"
        description="Tem certeza que deseja inativar este pet? O pet será marcado como inativo mas seus dados serão preservados."
        confirmText="Inativar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default PetDetails;
