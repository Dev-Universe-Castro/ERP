import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, 
  Plus, Search, Download, BarChart3, CheckCircle, Clock, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const FinanceiroSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'pagar', label: 'Contas a Pagar', icon: TrendingDown },
    { id: 'receber', label: 'Contas a Receber', icon: TrendingUp },
    { id: 'fluxo', label: 'Fluxo de Caixa', icon: Calendar }
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

const getStatusBadge = (status) => {
  const statusMap = {
    'pago': 'status-approved', 'recebido': 'status-approved',
    'pendente': 'status-pending', 'vencido': 'status-rejected'
  };
  return statusMap[status] || 'status-pending';
};

const TitulosTable = ({ titulos, tipo }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Descrição</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Origem</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vencimento</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Valor</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {titulos.map((item, index) => (
            <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-800">{item.descricao}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.origem}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.dataVencimento).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</td>
              <td className="px-4 py-3 text-center"><span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OverviewContent = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">A Pagar (Pendente)</p><p className="text-lg font-bold text-red-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalPagarPendente)}</p></div><TrendingDown className="h-8 w-8 text-red-500" /></CardContent></Card>
    <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">A Receber (Pendente)</p><p className="text-lg font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalReceberPendente)}</p></div><TrendingUp className="h-8 w-8 text-green-500" /></CardContent></Card>
    <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Pagos (Mês)</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalPagoMes)}</p></div><CheckCircle className="h-8 w-8 text-blue-500" /></CardContent></Card>
    <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Recebidos (Mês)</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRecebidoMes)}</p></div><DollarSign className="h-8 w-8 text-emerald-500" /></CardContent></Card>
  </div>
);

const FluxoCaixaContent = ({ titulosPagar, titulosReceber }) => {
  const [periodoInicial, setPeriodoInicial] = useState(new Date().toISOString().split('T')[0]);
  const [periodoFinal, setPeriodoFinal] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const fluxoData = useMemo(() => {
    const dataInicial = new Date(periodoInicial);
    const dataFinal = new Date(periodoFinal);
    
    const pagamentos = titulosPagar.filter(titulo => {
      const dataVencimento = new Date(titulo.dataVencimento);
      return dataVencimento >= dataInicial && dataVencimento <= dataFinal;
    });
    
    const recebimentos = titulosReceber.filter(titulo => {
      const dataVencimento = new Date(titulo.dataVencimento);
      return dataVencimento >= dataInicial && dataVencimento <= dataFinal;
    });
    
    // Agrupar por data
    const fluxoPorData = {};
    
    pagamentos.forEach(titulo => {
      const data = titulo.dataVencimento;
      if (!fluxoPorData[data]) fluxoPorData[data] = { data, pagamentos: 0, recebimentos: 0 };
      fluxoPorData[data].pagamentos += titulo.valor;
    });
    
    recebimentos.forEach(titulo => {
      const data = titulo.dataVencimento;
      if (!fluxoPorData[data]) fluxoPorData[data] = { data, pagamentos: 0, recebimentos: 0 };
      fluxoPorData[data].recebimentos += titulo.valor;
    });
    
    return Object.values(fluxoPorData).sort((a, b) => new Date(a.data) - new Date(b.data));
  }, [titulosPagar, titulosReceber, periodoInicial, periodoFinal]);

  const totais = useMemo(() => {
    return fluxoData.reduce((acc, item) => ({
      totalPagamentos: acc.totalPagamentos + item.pagamentos,
      totalRecebimentos: acc.totalRecebimentos + item.recebimentos,
      saldo: acc.saldo + (item.recebimentos - item.pagamentos)
    }), { totalPagamentos: 0, totalRecebimentos: 0, saldo: 0 });
  }, [fluxoData]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="periodoInicial">Período Inicial</Label>
          <Input
            id="periodoInicial"
            type="date"
            value={periodoInicial}
            onChange={(e) => setPeriodoInicial(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="periodoFinal">Período Final</Label>
          <Input
            id="periodoFinal"
            type="date"
            value={periodoFinal}
            onChange={(e) => setPeriodoFinal(e.target.value)}
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pagamentos</p>
                <p className="text-xl font-bold text-red-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalPagamentos)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Recebimentos</p>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalRecebimentos)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo Projetado</p>
                <p className={`text-xl font-bold ${totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.saldo)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Fluxo */}
      <div className="data-table rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Pagamentos</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Recebimentos</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Saldo Dia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fluxoData.map((item, index) => {
                const saldoDia = item.recebimentos - item.pagamentos;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.pagamentos)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 text-right font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.recebimentos)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-bold ${saldoDia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoDia)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FinanceiroModule = ({ activeSection }) => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const { titulosPagar, titulosReceber } = useMemo(() => ({
    titulosPagar: data.titulosPagar || [],
    titulosReceber: data.titulosReceber || []
  }), [data]);

  const filteredPagar = useMemo(() => titulosPagar.filter(item => Object.values(item).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))), [titulosPagar, searchTerm]);
  const filteredReceber = useMemo(() => titulosReceber.filter(item => Object.values(item).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))), [titulosReceber, searchTerm]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const filterByMonth = (item) => {
      const itemDate = new Date(item.dataPagamento || item.dataRecebimento);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    };

    return {
      totalPagarPendente: titulosPagar.filter(t => t.status === 'pendente').reduce((acc, t) => acc + t.valor, 0),
      totalReceberPendente: titulosReceber.filter(t => t.status === 'pendente').reduce((acc, t) => acc + t.valor, 0),
      totalPagoMes: titulosPagar.filter(t => t.status === 'pago' && filterByMonth(t)).reduce((acc, t) => acc + t.valor, 0),
      totalRecebidoMes: titulosReceber.filter(t => t.status === 'recebido' && filterByMonth(t)).reduce((acc, t) => acc + t.valor, 0),
    };
  }, [titulosPagar, titulosReceber]);

  const exportToExcel = () => {
    let dataToExport, filename;
    if (activeSection === 'pagar') {
      dataToExport = titulosPagar;
      filename = 'contas_a_pagar.xlsx';
    } else if (activeSection === 'receber') {
      dataToExport = titulosReceber;
      filename = 'contas_a_receber.xlsx';
    } else {
      toast({ title: "Ação não disponível", description: "Exportação disponível apenas para Contas a Pagar/Receber." });
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeSection);
    XLSX.writeFile(wb, filename);
    toast({ title: "Exportação concluída", description: `Relatório de ${activeSection} exportado com sucesso.` });
  };

  const [showNovoLancamentoModal, setShowNovoLancamentoModal] = useState(false);
  const [tipoLancamento, setTipoLancamento] = useState('pagar');

  const handleNovoLancamento = () => setShowNovoLancamentoModal(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent stats={stats} />;
      case 'pagar':
        return filteredPagar.length > 0 ? <TitulosTable titulos={filteredPagar} tipo="pagar" /> : <div className="text-center py-12"><TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">Nenhum título a pagar encontrado</p></div>;
      case 'receber':
        return filteredReceber.length > 0 ? <TitulosTable titulos={filteredReceber} tipo="receber" /> : <div className="text-center py-12"><TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">Nenhum título a receber encontrado</p></div>;
      case 'fluxo':
        return <FluxoCaixaContent titulosPagar={titulosPagar} titulosReceber={titulosReceber} />;
      default:
        return <OverviewContent stats={stats} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Financeiro</h2><p className="text-gray-500">Controle de caixa e saúde financeira</p></div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportToExcel} variant="outline" disabled={activeSection !== 'pagar' && activeSection !== 'receber'}><Download className="h-4 w-4 mr-2" />Exportar XLSX</Button>
          <Button onClick={handleNovoLancamento} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" />Novo Lançamento</Button>
        </div>
      </div>

      {activeSection !== 'overview' && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar títulos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      )}

      <Card className="bg-white">
        <CardHeader><CardTitle className="text-gray-800 capitalize">{activeSection}</CardTitle></CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      {/* Modal Novo Lançamento */}
      {showNovoLancamentoModal && (
        <NovoLancamentoModal
          isOpen={showNovoLancamentoModal}
          onClose={() => setShowNovoLancamentoModal(false)}
          tipo={tipoLancamento}
          onSave={(dadosLancamento) => {
            if (dadosLancamento.tipo === 'pagar') {
              const novoTitulo = {
                id: Date.now(),
                descricao: dadosLancamento.descricao,
                origem: dadosLancamento.origem,
                valor: dadosLancamento.valor,
                dataVencimento: dadosLancamento.dataVencimento,
                status: 'pendente',
                dataPagamento: null,
                observacoes: dadosLancamento.observacoes
              };
              data.titulosPagar = [...(data.titulosPagar || []), novoTitulo];
            } else {
              const novoTitulo = {
                id: Date.now(),
                descricao: dadosLancamento.descricao,
                origem: dadosLancamento.origem,
                valor: dadosLancamento.valor,
                dataVencimento: dadosLancamento.dataVencimento,
                status: 'pendente',
                dataRecebimento: null,
                observacoes: dadosLancamento.observacoes
              };
              data.titulosReceber = [...(data.titulosReceber || []), novoTitulo];
            }
            setShowNovoLancamentoModal(false);
            toast({ title: "Lançamento criado", description: "Novo lançamento adicionado com sucesso." });
          }}
        />
      )}
    </div>
  );
};

const NovoLancamentoModal = ({ isOpen, onClose, tipo, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: tipo,
    descricao: '',
    origem: '',
    valor: '',
    dataVencimento: '',
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.descricao && formData.valor && formData.dataVencimento) {
      onSave({
        ...formData,
        valor: parseFloat(formData.valor)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Novo Lançamento</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagar">Conta a Pagar</SelectItem>
                  <SelectItem value="receber">Conta a Receber</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição do lançamento"
                required
              />
            </div>

            <div>
              <Label htmlFor="origem">Origem</Label>
              <Input
                id="origem"
                value={formData.origem}
                onChange={(e) => setFormData({...formData, origem: e.target.value})}
                placeholder="Origem do lançamento"
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="dataVencimento">Data Vencimento *</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

FinanceiroModule.Sidebar = FinanceiroSidebar;

export default FinanceiroModule;