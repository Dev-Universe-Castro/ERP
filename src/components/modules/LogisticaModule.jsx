import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, FileText, Package, DollarSign, 
  Plus, Search, Download, MapPin, Clock, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const LogisticaSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'romaneios', label: 'Romaneios', icon: FileText },
    { id: 'fretes', label: 'Gestão de Fretes', icon: Truck },
    { id: 'expedicao', label: 'Expedição', icon: Package },
    { id: 'analise', label: 'Análise de Custos', icon: DollarSign }
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
    'preparacao': 'status-pending',
    'em-transito': 'status-completed',
    'entregue': 'status-approved',
    'cancelado': 'status-rejected'
  };
  return statusMap[status] || 'status-pending';
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'preparacao': return <Package className="h-4 w-4 text-yellow-600" />;
    case 'em-transito': return <Truck className="h-4 w-4 text-blue-600" />;
    case 'entregue': return <MapPin className="h-4 w-4 text-green-600" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const RomaneiosTable = ({ romaneios }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Número</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cliente</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Transportadora</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Emissão</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Previsão</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Frete</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Valor</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Peso</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {romaneios.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.numero}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.cliente}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.transportadora}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.dataEmissao).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.dataPrevisao).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center space-x-1">
                  {getStatusIcon(item.status)}
                  <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.tipoFrete === 'CIF' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.tipoFrete}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorFrete)}</td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">{new Intl.NumberFormat('pt-BR').format(item.peso)} kg</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FretesContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white"><CardHeader><CardTitle className="text-gray-800 flex items-center gap-2"><Truck className="h-5 w-5" />Fretes CIF</CardTitle></CardHeader><CardContent><div className="text-center py-8"><p className="text-gray-600 mb-4">Painel de fretes CIF será implementado em breve</p><Button onClick={() => toast({ description: "🚧 Painel de fretes CIF não implementado ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerenciar Fretes CIF</Button></div></CardContent></Card>
      <Card className="bg-white"><CardHeader><CardTitle className="text-gray-800 flex items-center gap-2"><Package className="h-5 w-5" />Fretes FOB</CardTitle></CardHeader><CardContent><div className="text-center py-8"><p className="text-gray-600 mb-4">Painel de fretes FOB será implementado em breve</p><Button onClick={() => toast({ description: "🚧 Painel de fretes FOB não implementado ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerenciar Fretes FOB</Button></div></CardContent></Card>
    </div>
  </div>
);

export default function LogisticaModule({ activeSection }) {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const romaneiosComDados = useMemo(() => {
    const clientes = data.clientes || [];
    const transportadoras = data.transportadoras || [];
    return (data.romaneios || []).map(rom => ({
      ...rom,
      cliente: clientes.find(c => c.id === rom.clienteId)?.nome || 'Cliente não encontrado',
      transportadora: transportadoras.find(t => t.id === rom.transportadoraId)?.nome || 'Transportadora não encontrada'
    }));
  }, [data.romaneios, data.clientes, data.transportadoras]);

  const filteredRomaneios = useMemo(() => romaneiosComDados.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [romaneiosComDados, searchTerm]);

  const stats = useMemo(() => {
    const romaneios = data.romaneios || [];
    return {
      total: romaneios.length,
      emTransito: romaneios.filter(r => r.status === 'em-transito').length,
      entregues: romaneios.filter(r => r.status === 'entregue').length,
      valorTotalFretes: romaneios.reduce((acc, r) => acc + r.valorFrete, 0)
    };
  }, [data.romaneios]);

  const exportToExcel = () => {
    const dataToExport = romaneiosComDados.map(item => ({
      'Número': item.numero, 'Cliente': item.cliente, 'Transportadora': item.transportadora,
      'Data Emissão': item.dataEmissao, 'Data Previsão': item.dataPrevisao, 'Data Entrega': item.dataEntrega || '-',
      'Status': item.status, 'Tipo Frete': item.tipoFrete, 'Valor Frete': item.valorFrete,
      'Peso (kg)': item.peso, 'Volumes': item.volumes, 'Observações': item.observacoes
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Romaneios');
    XLSX.writeFile(wb, 'romaneios.xlsx');
    
    toast({
      title: "Exportação concluída",
      description: "Relatório de romaneios exportado com sucesso."
    });
  };

  const [showNovoRomaneioModal, setShowNovoRomaneioModal] = useState(false);

  const handleNovoRomaneio = () => setShowNovoRomaneioModal(true);

  const handleSalvarRomaneio = (dadosRomaneio) => {
    const novoRomaneio = {
      id: Date.now(),
      numero: `ROM${String(Date.now()).slice(-4)}`,
      clienteId: dadosRomaneio.clienteId,
      transportadoraId: dadosRomaneio.transportadoraId,
      dataEmissao: dadosRomaneio.dataEmissao,
      dataPrevisao: dadosRomaneio.dataPrevisao,
      dataEntrega: null,
      status: 'preparacao',
      tipoFrete: dadosRomaneio.tipoFrete,
      valorFrete: dadosRomaneio.valorFrete,
      peso: dadosRomaneio.peso,
      volumes: dadosRomaneio.volumes,
      observacoes: dadosRomaneio.observacoes
    };
    
    data.romaneios = [...(data.romaneios || []), novoRomaneio];
    
    setShowNovoRomaneioModal(false);
    toast({
      title: "Romaneio criado",
      description: `Romaneio ${novoRomaneio.numero} criado com sucesso.`
    });
  };

  const sectionTitle = {
    romaneios: 'Romaneios',
    fretes: 'Gestão de Fretes',
    expedicao: 'Expedição',
    analise: 'Análise de Custos'
  }[activeSection];

  const renderContent = () => {
    switch (activeSection) {
      case 'romaneios':
        return filteredRomaneios.length > 0 ? <RomaneiosTable romaneios={filteredRomaneios} /> : <div className="text-center py-12"><FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhum romaneio encontrado' : 'Nenhum romaneio cadastrado'}</p></div>;
      case 'fretes':
        return <FretesContent />;
      case 'expedicao':
        return <div className="text-center py-12"><Package className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Módulo de expedição será implementado em breve</p><Button onClick={() => toast({ description: "🚧 Expedição não implementada ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Acessar Expedição</Button></div>;
      case 'analise':
        return <div className="text-center py-12"><DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Análise de custos de frete será implementada em breve</p><Button onClick={() => toast({ description: "🚧 Análise de custos de frete não implementada ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerar Análise</Button></div>;
      default:
        return <RomaneiosTable romaneios={filteredRomaneios} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
          <p className="text-gray-500">Gestão de romaneios, fretes e expedição</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportToExcel} variant="outline"><Download className="h-4 w-4 mr-2" />Exportar XLSX</Button>
          <Button onClick={handleNovoRomaneio} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" />Novo Romaneio</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Romaneios</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div><FileText className="h-8 w-8 text-orange-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Em Trânsito</p><p className="text-2xl font-bold text-gray-800">{stats.emTransito}</p></div><Truck className="h-8 w-8 text-blue-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Entregues</p><p className="text-2xl font-bold text-gray-800">{stats.entregues}</p></div><MapPin className="h-8 w-8 text-green-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Valor Fretes</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotalFretes)}</p></div><DollarSign className="h-8 w-8 text-emerald-500" /></CardContent></Card>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Buscar romaneios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <Card className="bg-white">
        <CardHeader><CardTitle className="text-gray-800">{sectionTitle}</CardTitle></CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal Novo Romaneio */}
      {showNovoRomaneioModal && (
        <NovoRomaneioModal
          isOpen={showNovoRomaneioModal}
          onClose={() => setShowNovoRomaneioModal(false)}
          clientes={data.clientes || []}
          transportadoras={data.transportadoras || []}
          onSave={handleSalvarRomaneio}
        />
      )}
    </div>
  );
}

const NovoRomaneioModal = ({ isOpen, onClose, clientes, transportadoras, onSave }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    transportadoraId: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    dataPrevisao: '',
    tipoFrete: 'CIF',
    valorFrete: '',
    peso: '',
    volumes: '',
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.clienteId && formData.transportadoraId && formData.dataPrevisao) {
      onSave({
        ...formData,
        clienteId: parseInt(formData.clienteId),
        transportadoraId: parseInt(formData.transportadoraId),
        valorFrete: parseFloat(formData.valorFrete || 0),
        peso: parseFloat(formData.peso || 0),
        volumes: parseInt(formData.volumes || 1)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Novo Romaneio</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transportadora">Transportadora *</Label>
              <Select value={formData.transportadoraId} onValueChange={(value) => setFormData({...formData, transportadoraId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a transportadora" />
                </SelectTrigger>
                <SelectContent>
                  {transportadoras.map(transp => (
                    <SelectItem key={transp.id} value={transp.id.toString()}>
                      {transp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataEmissao">Data Emissão *</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) => setFormData({...formData, dataEmissao: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="dataPrevisao">Data Previsão *</Label>
              <Input
                id="dataPrevisao"
                type="date"
                value={formData.dataPrevisao}
                onChange={(e) => setFormData({...formData, dataPrevisao: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="tipoFrete">Tipo Frete</Label>
              <Select value={formData.tipoFrete} onValueChange={(value) => setFormData({...formData, tipoFrete: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="FOB">FOB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valorFrete">Valor Frete</Label>
              <Input
                id="valorFrete"
                type="number"
                step="0.01"
                value={formData.valorFrete}
                onChange={(e) => setFormData({...formData, valorFrete: e.target.value})}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="volumes">Volumes</Label>
              <Input
                id="volumes"
                type="number"
                value={formData.volumes}
                onChange={(e) => setFormData({...formData, volumes: e.target.value})}
                placeholder="1"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações sobre o romaneio"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Criar Romaneio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

LogisticaModule.Sidebar = LogisticaSidebar;
LogisticaModule.defaultSection = 'romaneios';
