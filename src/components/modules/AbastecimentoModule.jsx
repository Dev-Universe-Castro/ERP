import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Fuel, Truck, Plus, Search, Download, 
  Gauge, Calendar, TrendingUp, BarChart3, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const AbastecimentoSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'equipamentos', label: 'Equipamentos', icon: Truck },
    { id: 'abastecimentos', label: 'Abastecimentos', icon: Fuel },
    { id: 'consumo', label: 'Análise de Consumo', icon: Gauge },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 }
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

const EquipamentosTable = ({ equipamentos }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Medidor Atual</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unidade</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Consumo Médio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {equipamentos.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.codigo}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.nome}</td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.tipo}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                {new Intl.NumberFormat('pt-BR').format(item.medidorAtual)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.medidor}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">
                {item.consumoMedio.toFixed(1)} {item.medidor}/L
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AbastecimentosTable = ({ abastecimentos }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Equipamento</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Litros</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Medidor Anterior</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Medidor Atual</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Consumo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {abastecimentos.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800">
                {new Date(item.data).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.equipamento}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                {item.litros}L
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                {new Intl.NumberFormat('pt-BR').format(item.medidorAnterior)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                {new Intl.NumberFormat('pt-BR').format(item.medidorAtual)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">
                {item.consumo.toFixed(1)} {item.tipoMedidor}/L
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function AbastecimentoModule({ activeSection }) {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const { equipamentos, abastecimentos } = useMemo(() => ({
    equipamentos: data.equipamentos || [],
    abastecimentos: data.abastecimentos || []
  }), [data]);

  const abastecimentosComEquipamentos = useMemo(() => {
    return abastecimentos.map(abast => {
      const equipamento = equipamentos.find(eq => eq.id === abast.equipamentoId);
      return {
        ...abast,
        equipamento: equipamento?.nome || 'Equipamento não encontrado',
        tipoMedidor: equipamento?.medidor || 'km'
      };
    });
  }, [abastecimentos, equipamentos]);

  const filteredEquipamentos = useMemo(() => equipamentos.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [equipamentos, searchTerm]);

  const filteredAbastecimentos = useMemo(() => abastecimentosComEquipamentos.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [abastecimentosComEquipamentos, searchTerm]);

  const stats = useMemo(() => {
    const totalEquipamentos = equipamentos.length;
    const totalAbastecimentos = abastecimentos.length;
    const totalLitros = abastecimentos.reduce((acc, item) => acc + item.litros, 0);
    const consumoMedio = abastecimentos.length > 0 ? 
      abastecimentos.reduce((acc, item) => acc + item.consumo, 0) / abastecimentos.length : 0;
    
    return { totalEquipamentos, totalAbastecimentos, totalLitros, consumoMedio };
  }, [equipamentos, abastecimentos]);

  const exportToExcel = () => {
    let dataToExport, filename;
    
    if (activeSection === 'equipamentos') {
      dataToExport = equipamentos.map(item => ({
        Código: item.codigo, Nome: item.nome, Tipo: item.tipo,
        'Medidor Atual': item.medidorAtual, 'Unidade Medidor': item.medidor, 'Consumo Médio': item.consumoMedio
      }));
      filename = 'equipamentos.xlsx';
    } else {
      dataToExport = abastecimentosComEquipamentos.map(item => ({
        Data: item.data, Equipamento: item.equipamento, 'Litros Abastecidos': item.litros,
        'Medidor Anterior': item.medidorAnterior, 'Medidor Atual': item.medidorAtual,
        Consumo: item.consumo, Unidade: item.tipoMedidor
      }));
      filename = 'abastecimentos.xlsx';
    }
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeSection);
    XLSX.writeFile(wb, filename);
    
    toast({
      title: "Exportação concluída",
      description: `Relatório de ${activeSection} exportado com sucesso.`
    });
  };

  const [showNovoModal, setShowNovoModal] = useState(false);

  const handleNovo = () => setShowNovoModal(true);

  const handleSalvarNovo = (dados) => {
    if (activeSection === 'equipamentos') {
      const novoEquipamento = {
        id: Date.now(),
        codigo: `EQ${String(Date.now()).slice(-3)}`,
        nome: dados.nome,
        tipo: dados.tipo,
        medidorAtual: dados.medidorAtual,
        medidor: dados.medidor,
        consumoMedio: dados.consumoMedio || 0
      };
      
      data.equipamentos = [...(data.equipamentos || []), novoEquipamento];
      
      toast({
        title: "Equipamento cadastrado",
        description: `${dados.nome} foi cadastrado com sucesso.`
      });
    } else {
      const equipamento = equipamentos.find(eq => eq.id === dados.equipamentoId);
      const medidorAnterior = equipamento ? equipamento.medidorAtual : 0;
      const consumo = dados.medidorAtual - medidorAnterior;
      
      const novoAbastecimento = {
        id: Date.now(),
        equipamentoId: dados.equipamentoId,
        data: dados.data,
        litros: dados.litros,
        medidorAnterior: medidorAnterior,
        medidorAtual: dados.medidorAtual,
        consumo: consumo > 0 ? dados.litros / consumo : 0
      };
      
      data.abastecimentos = [...(data.abastecimentos || []), novoAbastecimento];
      
      // Atualizar medidor atual do equipamento
      if (equipamento) {
        equipamento.medidorAtual = dados.medidorAtual;
      }
      
      toast({
        title: "Abastecimento registrado",
        description: "Novo abastecimento registrado com sucesso."
      });
    }
    
    setShowNovoModal(false);
  };

  const sectionTitle = {
    equipamentos: 'Equipamentos',
    abastecimentos: 'Abastecimentos',
    consumo: 'Análise de Consumo',
    relatorios: 'Relatórios'
  }[activeSection];

  const renderContent = () => {
    switch (activeSection) {
      case 'equipamentos':
        return filteredEquipamentos.length > 0 ? <EquipamentosTable equipamentos={filteredEquipamentos} /> : (
          <div className="text-center py-12"><Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhum equipamento encontrado' : 'Nenhum equipamento cadastrado'}</p></div>
        );
      case 'abastecimentos':
        return filteredAbastecimentos.length > 0 ? <AbastecimentosTable abastecimentos={filteredAbastecimentos} /> : (
          <div className="text-center py-12"><Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhum abastecimento encontrado' : 'Nenhum abastecimento registrado'}</p></div>
        );
      case 'consumo':
        return <div className="text-center py-12"><BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Análise detalhada de consumo será implementada em breve</p><Button onClick={() => toast({ description: "🚧 Análise de consumo não implementada ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerar Análise</Button></div>;
      case 'relatorios':
        return <div className="text-center py-12"><BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Relatórios de abastecimento serão implementados em breve</p><Button onClick={() => toast({ description: "🚧 Relatórios não implementados ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerar Relatório</Button></div>;
      default:
        return <EquipamentosTable equipamentos={filteredEquipamentos} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
          <p className="text-gray-500">Controle de frota e equipamentos</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar XLSX
          </Button>
          <Button onClick={handleNovo} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            {activeSection === 'equipamentos' ? 'Novo Equipamento' : 'Novo Abastecimento'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Equipamentos</p><p className="text-2xl font-bold text-gray-800">{stats.totalEquipamentos}</p></div><Truck className="h-8 w-8 text-yellow-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Abastecimentos</p><p className="text-2xl font-bold text-gray-800">{stats.totalAbastecimentos}</p></div><Calendar className="h-8 w-8 text-blue-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Total de Litros</p><p className="text-2xl font-bold text-gray-800">{stats.totalLitros}L</p></div><Fuel className="h-8 w-8 text-green-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Consumo Médio</p><p className="text-2xl font-bold text-gray-800">{stats.consumoMedio.toFixed(1)}</p></div><Gauge className="h-8 w-8 text-purple-500" /></CardContent></Card>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={`Buscar ${activeSection}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-800">{sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal Novo Equipamento/Abastecimento */}
      {showNovoModal && (
        <NovoAbastecimentoModal
          isOpen={showNovoModal}
          onClose={() => setShowNovoModal(false)}
          tipo={activeSection}
          equipamentos={equipamentos}
          onSave={handleSalvarNovo}
        />
      )}
    </div>
  );
}

const NovoAbastecimentoModal = ({ isOpen, onClose, tipo, equipamentos, onSave }) => {
  const [formData, setFormData] = useState(
    tipo === 'equipamentos' 
      ? {
          nome: '',
          tipo: 'veiculo',
          medidorAtual: '',
          medidor: 'km',
          consumoMedio: ''
        }
      : {
          equipamentoId: '',
          data: new Date().toISOString().split('T')[0],
          litros: '',
          medidorAtual: ''
        }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipo === 'equipamentos') {
      if (formData.nome && formData.medidorAtual) {
        onSave({
          ...formData,
          medidorAtual: parseFloat(formData.medidorAtual),
          consumoMedio: parseFloat(formData.consumoMedio || 0)
        });
      }
    } else {
      if (formData.equipamentoId && formData.litros && formData.medidorAtual) {
        onSave({
          ...formData,
          equipamentoId: parseInt(formData.equipamentoId),
          litros: parseFloat(formData.litros),
          medidorAtual: parseFloat(formData.medidorAtual)
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{tipo === 'equipamentos' ? 'Novo Equipamento' : 'Novo Abastecimento'}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tipo === 'equipamentos' ? (
              <>
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Nome do equipamento"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veiculo">Veículo</SelectItem>
                      <SelectItem value="maquina">Máquina</SelectItem>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medidorAtual">Medidor Atual *</Label>
                  <Input
                    id="medidorAtual"
                    type="number"
                    value={formData.medidorAtual}
                    onChange={(e) => setFormData({...formData, medidorAtual: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="medidor">Unidade Medidor</Label>
                  <Select value={formData.medidor} onValueChange={(value) => setFormData({...formData, medidor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Quilômetros</SelectItem>
                      <SelectItem value="horas">Horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="consumoMedio">Consumo Médio</Label>
                  <Input
                    id="consumoMedio"
                    type="number"
                    step="0.1"
                    value={formData.consumoMedio}
                    onChange={(e) => setFormData({...formData, consumoMedio: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="equipamento">Equipamento *</Label>
                  <Select value={formData.equipamentoId} onValueChange={(value) => setFormData({...formData, equipamentoId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipamentos.map(eq => (
                        <SelectItem key={eq.id} value={eq.id.toString()}>
                          {eq.codigo} - {eq.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="litros">Litros *</Label>
                  <Input
                    id="litros"
                    type="number"
                    step="0.1"
                    value={formData.litros}
                    onChange={(e) => setFormData({...formData, litros: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="medidorAtual">Medidor Atual *</Label>
                  <Input
                    id="medidorAtual"
                    type="number"
                    value={formData.medidorAtual}
                    onChange={(e) => setFormData({...formData, medidorAtual: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

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

AbastecimentoModule.Sidebar = AbastecimentoSidebar;
AbastecimentoModule.defaultSection = 'equipamentos';
