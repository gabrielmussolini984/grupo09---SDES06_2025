import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ListMedicalRecordResponse } from '@/lib/medical-records/types';
import { ListPetResponse } from '@/lib/pet/types';
import { listPets } from '@/lib/pet/requests';
import { listMedicalRecords, removeMedicalRecord } from '@/lib/medical-records/requests';

export default function MedicalRecordList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [records, setRecords] = useState<ListMedicalRecordResponse[]>([]);
  const [pets, setPets] = useState<ListPetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [petFilter, setPetFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [diagnosisFilter, setDiagnosisFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadPets();
    loadRecords();
  }, []);

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

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await listMedicalRecords({
        petId: petFilter && petFilter !== 'all' ? petFilter : undefined,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
        diagnosisKeyword: diagnosisFilter || undefined,
      }, '');
      setRecords(response);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os registros médicos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadRecords();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await removeMedicalRecord(deleteId);
      toast({
        title: 'Sucesso',
        description: 'Registro médico removido com sucesso',
      });
      setDeleteId(null);
      loadRecords();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao remover registro',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Histórico Médico</h1>
        <Button onClick={() => navigate('/historico-medico/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Pet</label>
            <Select value={petFilter} onValueChange={setPetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os pets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pets</SelectItem>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Data Inicial</label>
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Data Final</label>
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Diagnóstico</label>
            <Input
              placeholder="Buscar por palavra-chave"
              value={diagnosisFilter}
              onChange={(e) => setDiagnosisFilter(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Pet</TableHead> */}
              <TableHead>Veterinário</TableHead>
              <TableHead>Prescrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  {/* <TableCell className="font-medium">{record.petName}</TableCell> */}
                  <TableCell>{record.veterinarianName}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.prescription}</TableCell>
                  <TableCell>{format(new Date(record.consultationDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/historico-medico/${record.id}/editar`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Confirmar remoção"
        description="Tem certeza que deseja remover este registro médico?"
      />
    </div>
  );
}
