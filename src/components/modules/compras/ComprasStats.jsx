import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

const ComprasStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Requisições',
      value: stats.totalRequisicoes,
      icon: <FileText className="h-8 w-8 text-indigo-500" />,
    },
    {
      title: 'Aprovadas',
      value: stats.requisicoesAprovadas,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    },
    {
      title: 'Aguardando Aprovação',
      value: stats.cotacoesPendentes,
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: 'Valor Pedidos',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.valorTotalPedidos),
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className={`font-bold text-gray-800 ${card.title === 'Valor Pedidos' ? 'text-lg' : 'text-2xl'}`}>
                  {card.value}
                </p>
              </div>
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComprasStats;
