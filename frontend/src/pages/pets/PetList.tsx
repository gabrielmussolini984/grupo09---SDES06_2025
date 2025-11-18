import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {  PetSpecies } from '@/types';
import { mockPetsApi } from '@/lib/mockApi';
import ConfirmDialog from '@/components/ConfirmDialog';
import { listPets, removePet } from '@/lib/pet/requests';
import { ListPetResponse } from '@/lib/pet/types';

const PetList = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<ListPetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<PetSpecies | 'ALL'>('ALL');
  const [breedFilter, setBreedFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [ownerCpfFilter, setOwnerCpfFilter] = useState('');

  useEffect(() => {
    loadPets();
  }, [nameFilter, speciesFilter, breedFilter, ownerFilter, ownerCpfFilter]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await listPets({
        name: nameFilter,
        species: speciesFilter !== 'ALL' ? speciesFilter : undefined,
        breed: breedFilter,
        ownerName: ownerFilter,
        ownerCpf: ownerCpfFilter,
      });
      setPets(response);
    } catch (error) {
      toast.error('Erro ao carregar pets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await removePet(deleteId);
      toast.success('Pet removido com sucesso');
      loadPets();
    } catch (error) {
      toast.error(error.message || 'Erro ao remover pet');
    } finally {
      setDeleteId(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pets</h1>
          <p className="text-muted-foreground">Gerencie os pets cadastrados</p>
        </div>
        <Button onClick={() => navigate('/pets/novo')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pet
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={speciesFilter} onValueChange={(value) => setSpeciesFilter(value as PetSpecies | 'ALL')}>
            <SelectTrigger>
              <SelectValue placeholder="Espécie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as espécies</SelectItem>
              <SelectItem value="CACHORRO">Cachorro</SelectItem>
              <SelectItem value="GATO">Gato</SelectItem>
              <SelectItem value="COELHO">Coelho</SelectItem>
              <SelectItem value="AVE">Ave</SelectItem>
              <SelectItem value="ROEDOR">Roedor</SelectItem>
              <SelectItem value="OUTRO">Outro</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Raça..."
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
          />
          
          <Input
            placeholder="Nome do tutor..."
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          />
          
          <Input
            placeholder="CPF do tutor..."
            value={ownerCpfFilter}
            onChange={(e) => setOwnerCpfFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pets.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum pet encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {pet.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{pet.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>{pet.weight} kg</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                         <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/pets/${pet.id}`)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/pets/${pet.id}/editar`)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(pet.id)}
                          title="Excluir"
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
        title="Remover pet"
        description="Tem certeza que deseja remover este pet? O pet será excluído permanentemente e seus dados não poderão ser recuperados."
        confirmText="Remover"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};

export default PetList;
