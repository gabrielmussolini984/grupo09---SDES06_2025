import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User } from '@/types';
import { mockUsersApi } from '@/lib/mockApi';
import ConfirmDialog from '@/components/ConfirmDialog';

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      const data = await mockUsersApi.getById(userId);
      setUser(data);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar usuário');
      navigate('/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await mockUsersApi.delete(id);
      toast.success('Usuário inativado com sucesso');
      navigate('/usuarios');
    } catch (error) {
      toast.error(error.message || 'Erro ao inativar usuário');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/usuarios')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{user.nomeCompleto}</h1>
            <p className="text-muted-foreground">Detalhes do usuário</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/usuarios/${id}/editar`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={!user.ativo}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Inativar
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">Informações Pessoais</h2>
          <Badge variant={user.ativo ? 'default' : 'secondary'}>
            {user.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="space-y-0">
          <InfoRow label="Nome Completo" value={user.nomeCompleto} />
          <InfoRow label="CPF" value={user.cpf} />
          <InfoRow label="E-mail" value={user.email} />
          <InfoRow label="Telefone" value={user.telefone} />
          <InfoRow 
            label="Cargo" 
            value={
              <Badge className="bg-primary text-primary-foreground">
                {user.cargo === 'VETERINARIO' && 'Veterinário'}
                {user.cargo === 'ATENDENTE' && 'Atendente'}
                {user.cargo === 'ADMINISTRADOR' && 'Administrador'}
              </Badge>
            }
          />
          
          {user.dataAdmissao && (
            <InfoRow
              label="Data de Admissão"
              value={new Date(user.dataAdmissao).toLocaleDateString('pt-BR')}
            />
          )}
          
          {user.endereco && (
            <InfoRow label="Endereço" value={user.endereco} />
          )}
          
          {user.dataNascimento && (
            <InfoRow
              label="Data de Nascimento"
              value={new Date(user.dataNascimento).toLocaleDateString('pt-BR')}
            />
          )}
        </div>
      </Card>

      {/* Metadata Card */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold border-b pb-4">Informações do Sistema</h2>
        <div className="space-y-0">
          <InfoRow
            label="Cadastrado em"
            value={new Date(user.criadoEm).toLocaleString('pt-BR')}
          />
          <InfoRow
            label="Última atualização"
            value={new Date(user.atualizadoEm).toLocaleString('pt-BR')}
          />
          {user.atualizadoPor && (
            <InfoRow label="Atualizado por" value={user.atualizadoPor} />
          )}
        </div>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Inativar usuário"
        description="Tem certeza que deseja inativar este usuário? O usuário será marcado como inativo mas seus dados serão preservados."
        confirmText="Inativar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default UserDetails;
