import { Link } from 'react-router-dom';
import { Users, PawPrint, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const stats = [
    { label: 'Usuários Cadastrados', value: '3', icon: Users, color: 'text-primary' },
    { label: 'Pets Ativos', value: '2', icon: PawPrint, color: 'text-secondary' },
    { label: 'Consultas Hoje', value: '0', icon: Calendar, color: 'text-primary' },
    { label: 'Taxa de Ocupação', value: '0%', icon: TrendingUp, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4">
          <PawPrint className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Sistema de Gestão VetClinic
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gerencie sua clínica veterinária de forma simples e eficiente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-accent ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre funcionários e clientes da clínica
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link to="/usuarios">Acessar Usuários</Link>
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
              <PawPrint className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gerenciar Pets</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre e acompanhe os pets da clínica
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/pets">Acessar Pets</Link>
          </Button>
        </Card>
      </div>

      {/* Info Section */}
      {/* <Card className="p-6 bg-accent/50 border-accent">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            ℹ️
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Sistema de Demonstração</h3>
            <p className="text-sm text-muted-foreground">
              Este é um sistema de demonstração com dados mockados. 
              Todas as operações são simuladas e não afetam um banco de dados real.
            </p>
          </div>
        </div>
      </Card> */}
    </div>
  );
};

export default Index;
