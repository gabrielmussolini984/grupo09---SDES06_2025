import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ListMedicalRecordResponse,  } from '@/lib/medical-records/types';
import { removeMedicalRecord, showMedicalRecord } from '@/lib/medical-records/requests';

export default function MedicalRecordDetails() {
  const { id, petId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [record, setRecord] = useState<ListMedicalRecordResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await showMedicalRecord(id, petId!);
      setRecord(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o registro médico',
        variant: 'destructive',
      });
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await removeMedicalRecord(id);
      toast({
        title: 'Sucesso',
        description: 'Registro médico removido com sucesso',
      });
      navigate(`/pets/${petId}`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao remover registro',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/historico-medico')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Registro Médico</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/historico-medico/${id}/${petId}/editar`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          {/* <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button> */}
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Veterinário</label>
            <p className="text-lg font-medium mt-1">{record.veterinarianName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Data da Consulta</label>
            <p className="text-lg font-medium mt-1">
              {format(new Date(record.consultationDate), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Diagnóstico</label>
          <p className="text-base mt-2 whitespace-pre-wrap">{record.diagnosis}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Prescrição</label>
          <p className="text-base mt-2 whitespace-pre-wrap">{record.prescription}</p>
        </div>

        {record.notes && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Observações</label>
            <p className="text-base mt-2 whitespace-pre-wrap">{record.notes}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Confirmar remoção"
        description="Tem certeza que deseja remover este registro médico?"
      />
    </div>
  );
}
