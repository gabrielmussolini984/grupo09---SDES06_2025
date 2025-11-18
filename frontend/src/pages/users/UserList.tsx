import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UserRole } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ListUserResponse,  } from "@/lib/user/types";
import { removeUser,listUsers } from "@/lib/user/requests";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ListUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [cpfFilter, setCpfFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  useEffect(() => {
    loadUsers();
  }, [nameFilter, cpfFilter, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await listUsers({
        name: nameFilter,
        cpf: cpfFilter,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
      });
      setUsers(response);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await removeUser(deleteId);
      toast.success("Usuário removido com sucesso");
      loadUsers();
    } catch (error) {
      toast.error(error.message || "Erro ao remover usuário");
    } finally {
      setDeleteId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { label: string; className: string }> = {
      VETERINARIO: {
        label: "Veterinário",
        className: "bg-primary text-primary-foreground",
      },
      ATENDENTE: {
        label: "Atendente",
        className: "bg-secondary text-secondary-foreground",
      },
      ADMINISTRADOR: {
        label: "Administrador",
        className: "bg-purple-500 text-white",
      },
    };

    return (
      <Badge className={variants[role].className}>{variants[role].label}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie funcionários e clientes
          </p>
        </div>
        <Button onClick={() => navigate("/usuarios/novo")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-9"
            />
          </div>

          <Input
            placeholder="CPF (000.000.000-00)"
            value={cpfFilter}
            onChange={(e) => setCpfFilter(e.target.value)}
          />

          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as UserRole | "ALL")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os cargos</SelectItem>
              <SelectItem value="VETERINARIO">Veterinário</SelectItem>
              <SelectItem value="ATENDENTE">Atendente</SelectItem>
              <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadUsers}>
            Aplicar Filtros
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data de Admissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.admissionDate
                        ? new Date(user.admissionDate).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/usuarios/${user.id}/editar`)
                          }
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(user.id)}
                          title="Excluir"
                          disabled={user.role === 'ADMINISTRADOR'}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remover usuário"
        description="Tem certeza que deseja remover este usuário? O usuário será excluído permanentemente e seus dados não poderão ser recuperados."
        confirmText="Remover"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default UserList;
