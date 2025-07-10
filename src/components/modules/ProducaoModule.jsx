import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, Plus, Search, Download, 
  PlayCircle, PauseCircle, CheckCircle, AlertCircle,
  Package, Clock, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const ProducaoSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'ordens', label: 'Ordens de Produção', icon: Factory },
    { id: 'planejamento', label: 'Planejamento', icon: Clock },
    { id: 'apontamentos', label: 'Apontamentos', icon: CheckCircle },
    { id: 'relatorios', label: 'Relatórios', icon: TrendingUp }
  ];

  return (
    <nav className="space-y-2">
      {sections.map((section) => {
        const IconComponent = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection(section.id)}
          >
            <IconComponent className="h-4 w-4 mr-2" />
            {section.label}
          </Button>
        );
      })}
    </nav>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'em-andamento': return <PlayCircle className="h-4 w-4 text-blue-600" />;
    case 'pausada': return <PauseCircle className="h-4 w-4 text-yellow-600" />;
    case 'concluida': return <CheckCircle className="h-4 w-4 text-green-600" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status) => {
  const statusMap = {
    'em-andamento': 'status-pending', 'pausada': 'status-pending',
    'concluida': 'status-approved', 'cancelada': 'status-rejected'
  };
  return statusMap[status] || 'status-pending';
};

const getPrioridadeBadge = (prioridade) => {
  const prioridadeMap = {
    'alta': 'status-rejected', 'media': 'status-pending', 'baixa': 'status-completed'
  };
  return prioridadeMap[prioridade] || 'status-pending';
};

const OrdensTable = ({ ordens, onIniciar, onPausar, onConcluir }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">OP</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produto</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantidade</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Produzida</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Progresso</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Prioridade</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Previsão</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ordens.map((item, index) => {
            const progresso = (item.quantidadeProduzida / item.quantidade) * 100;
            return (
              <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.numero}</td>
                <td className="px-4 py-3 text-sm text-gray-800"><div><p className="font-medium">{item.produto}</p><p className="text-xs text-gray-500">{item.codigoProduto}</p></div></td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{new Intl.NumberFormat('pt-BR').format(item.quantidade)}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{new Intl.NumberFormat('pt-BR').format(item.quantidadeProduzida)}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(progresso, 100)}%` }} /></div>
                    <span className="text-xs text-gray-600">{progresso.toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center"><div className="flex items-center justify-center space-x-1">{getStatusIcon(item.status)}<span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span></div></td>
                <td className="px-4 py-3 text-center"><span className={`status-badge ${getPrioridadeBadge(item.prioridade)}`}>{item.prioridade}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.dataPrevisao).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {item.status === 'planejada' && <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600" onClick={() => onIniciar(item.id)}><PlayCircle className="h-4 w-4" /></Button>}
                    {item.status === 'em-andamento' && (<><Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500 hover:text-yellow-600" onClick={() => onPausar(item.id)}><PauseCircle className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600" onClick={() => onConcluir(item.id)}><CheckCircle className="h-4 w-4" /></Button></>)}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default function ProducaoModule({ activeSection }) {
  const { data, updateItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const ordensComProdutos = useMemo(() => {
    const produtos = data.produtos || [];
    return (data.ordensProducao || []).map(op => ({
      ...op,
      produto: produtos.find(p => p.id === op.produtoId)?.descricao || 'Produto não encontrado',
      codigoProduto: produtos.find(p => p.id === op.produtoId)?.codigo || '-'
    }));
  }, [data.ordensProducao, data.produtos]);

  const filteredOrdens = useMemo(() => ordensComProdutos.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [ordensComProdutos, searchTerm]);

  const stats = useMemo(() => {
    const ordens = data.ordensProducao || [];
    return {
      total: ordens.length,
      emAndamento: ordens.filter(op => op.status === 'em-andamento').length,
      concluidas: ordens.filter(op => op.status === 'concluida').length,
      atrasadas: ordens.filter(op => op.status === 'em-andamento' && new Date(op.dataPrevisao) < new Date()).length
    };
  }, [data.ordensProducao]);

  const exportToExcel = () => {
    const dataToExport = ordensComProdutos.map(item => ({
      'Número OP': item.numero, 'Produto': item.produto, 'Código Produto': item.codigoProduto,
      'Quantidade': item.quantidade, 'Quantidade Produzida': item.quantidadeProduzida, 'Status': item.status,
      'Data Início': item.dataInicio, 'Data Previsão': item.dataPrevisao, 'Data Conclusão': item.dataConclusao || '-',
      'Prioridade': item.prioridade, 'Observações': item.observacoes
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ordens Produção');
    XLSX.writeFile(wb, 'ordens_producao.xlsx');
    
    toast({ title: "Exportação concluída", description: "Relatório de ordens de produção exportado com sucesso." });
  };

  const handleNovaOP = () => toast({ description: "🚧 Nova ordem de produção não implementada ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" });
  const handleIniciarOP = (id) => { updateItem('ordensProducao', id, { status: 'em-andamento' }); toast({ title: "OP iniciada" }); };
  const handlePausarOP = (id) => { updateItem('ordensProducao', id, { status: 'pausada' }); toast({ title: "OP pausada" }); };
  const handleConcluirOP = (id) => { updateItem('ordensProducao', id, { status: 'concluida', dataConclusao: new Date().toISOString().split('T')[0] }); toast({ title: "OP concluída" }); };

  const sectionTitle = {
    ordens: 'Ordens de Produção',
    planejamento: 'Planejamento',
    apontamentos: 'Apontamentos',
    relatorios: 'Relatórios'
  }[activeSection];

  const renderContent = () => {
    switch (activeSection) {
      case 'ordens':
        return filteredOrdens.length > 0 ? <OrdensTable ordens={filteredOrdens} onIniciar={handleIniciarOP} onPausar={handlePausarOP} onConcluir={handleConcluirOP} /> : <div className="text-center py-12"><Factory className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhuma ordem encontrada' : 'Nenhuma ordem de produção cadastrada'}</p></div>;
      case 'planejamento':
        return <div className="text-center py-12"><Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Módulo de planejamento será implementado em breve</p><Button onClick={() => toast({ description: "🚧 Planejamento de produção não implementado ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Acessar Planejamento</Button></div>;
      case 'apontamentos':
        return <div className="text-center py-12"><CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Módulo de apontamentos será implementado em breve</p><Button onClick={() => toast({ description: "🚧 Apontamentos de produção não implementados ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Fazer Apontamento</Button></div>;
      case 'relatorios':
        return <div className="text-center py-12"><TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Relatórios de produção serão implementados em breve</p><Button onClick={() => toast({ description: "🚧 Relatórios de produção não implementados ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerar Relatório</Button></div>;
      default:
        return <OrdensTable ordens={filteredOrdens} onIniciar={handleIniciarOP} onPausar={handlePausarOP} onConcluir={handleConcluirOP} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2><p className="text-gray-500">Gestão de ordens de produção e planejamento</p></div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportToExcel} variant="outline"><Download className="h-4 w-4 mr-2" />Exportar XLSX</Button>
          <Button onClick={handleNovaOP} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" />Nova OP</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Total de OPs</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div><Factory className="h-8 w-8 text-purple-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Em Andamento</p><p className="text-2xl font-bold text-gray-800">{stats.emAndamento}</p></div><PlayCircle className="h-8 w-8 text-blue-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Concluídas</p><p className="text-2xl font-bold text-gray-800">{stats.concluidas}</p></div><CheckCircle className="h-8 w-8 text-green-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Atrasadas</p><p className="text-2xl font-bold text-gray-800">{stats.atrasadas}</p></div><AlertCircle className="h-8 w-8 text-red-500" /></CardContent></Card>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Buscar ordens de produção..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <Card className="bg-white">
        <CardHeader><CardTitle className="text-gray-800">{sectionTitle}</CardTitle></CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

ProducaoModule.Sidebar = ProducaoSidebar;
ProducaoModule.defaultSection = 'ordens';
