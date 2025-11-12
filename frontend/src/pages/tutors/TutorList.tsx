import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { listTutors, removeTutor } from '@/lib/tutor/requests';
import { ListTutorResponse } from '@/lib/tutor/types';

const TutorList = () => {
  const navigate = useNavigate();
  
  const [tutors, setTutors] = useState<ListTutorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [cpfFilter, setCpfFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadTutors();
  }, [nameFilter, cpfFilter, emailFilter]);

  const loadTutors = async () => {
    try {
      setLoading(true);
      const response = await listTutors({
        name: nameFilter,
        cpf: cpfFilter,
        email: emailFilter,
      });
      setTutors(response);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar tutores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await removeTutor(deleteId);
      toast.success('Tutor removido com sucesso');
      loadTutors();
    } catch (error) {
      toast.error(error.message || 'Erro ao inativar tutor');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutores</h1>
          <p className="text-muted-foreground">Gerencie os tutores cadastrados</p>
        </div>
        <Button onClick={() => navigate('/tutores/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Tutor
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">CPF</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="000.000.000-00"
                value={cpfFilter}
                onChange={(e) => setCpfFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="email@exemplo.com"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tutors.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum tutor encontrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell className="font-medium">{tutor.name}</TableCell>
                  <TableCell>{tutor.cpf}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/tutores/${tutor.id}/editar`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(tutor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remover tutor"
        description="Tem certeza que deseja remover este tutor? Esta ação não pode ser desfeita."
        confirmText="Remover"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default TutorList;
