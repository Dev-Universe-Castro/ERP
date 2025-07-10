import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, TrendingUp, TrendingDown, AlertTriangle, 
  Plus, Search, Download, BarChart3, MapPin, DollarSign, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const EstoqueSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'posicao', label: 'Posição Atual', icon: Package },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'curva-abc', label: 'Curva ABC', icon: BarChart3 },
    { id: 'entradas', label: 'Entradas', icon: TrendingUp },
    { id: 'saidas', label: 'Saídas', icon: TrendingDown },
    { id: 'localizacao', label: 'Localização', icon: MapPin }
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

export default function EstoqueModule({ activeSection }) {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const getEstoqueData = () => {
    const produtos = data.produtos || [];
    const estoque = data.estoque || [];
    
    return produtos.map(produto => {
      const estoqueItem = estoque.find(e => e.produtoId === produto.id);
      const quantidade = estoqueItem?.quantidade || 0;
      const localizacao = estoqueItem?.localizacao || 'Não definida';
      
      return {
        ...produto,
        quantidade,
        localizacao,
        status: quantidade <= produto.estoqueMin ? 'baixo' : 
                quantidade >= produto.estoqueMax ? 'alto' : 'normal'
      };
    });
  };

  const estoqueData = getEstoqueData();
  
  const filteredData = estoqueData.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getEstoqueStats = () => {
    const total = estoqueData.length;
    const baixo = estoqueData.filter(item => item.status === 'baixo').length;
    const alto = estoqueData.filter(item => item.status === 'alto').length;
    const valorTotal = estoqueData.reduce((acc, item) => acc + (item.quantidade * item.custo), 0);
    
    return { total, baixo, alto, valorTotal };
  };

  const stats = getEstoqueStats();

  const exportToExcel = () => {
    const dataToExport = estoqueData.map(item => ({
      Código: item.codigo,
      Descrição: item.descricao,
      Tipo: item.tipo,
      Quantidade: item.quantidade,
      Unidade: item.unidade,
      'Custo Unitário': item.custo,
      'Valor Total': item.quantidade * item.custo,
      'Estoque Mínimo': item.estoqueMin,
      'Estoque Máximo': item.estoqueMax,
      Localização: item.localizacao,
      Status: item.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Posição Estoque');
    XLSX.writeFile(wb, 'posicao_estoque.xlsx');
    
    toast({
      title: "Exportação concluída",
      description: "Relatório de posição de estoque exportado com sucesso."
    });
  };

  const [showEntradaModal, setShowEntradaModal] = useState(false);

  const handleEntrada = () => setShowEntradaModal(true);

  const handleSalvarEntrada = (dadosEntrada) => {
    // Atualizar estoque do produto
    const produtos = data.produtos || [];
    const produto = produtos.find(p => p.id === dadosEntrada.produtoId);
    
    if (produto) {
      produto.estoqueAtual = (produto.estoqueAtual || 0) + dadosEntrada.quantidade;
      
      // Registrar movimento no estoque
      const novoMovimento = {
        id: Date.now(),
        produtoId: dadosEntrada.produtoId,
        produto: produto.descricao,
        tipo: 'entrada',
        quantidade: dadosEntrada.quantidade,
        data: dadosEntrada.data,
        observacoes: dadosEntrada.observacoes,
        usuario: 'Sistema'
      };
      
      data.movimentosEstoque = [...(data.movimentosEstoque || []), novoMovimento];
      
      setShowEntradaModal(false);
      toast({
        title: "Entrada registrada",
        description: `Entrada de ${dadosEntrada.quantidade} unidades registrada com sucesso.`
      });
    }
  };

  const renderPosicaoEstoque = () => (
    <div className="data-table rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Descrição</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantidade</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unidade</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Valor Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Localização</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.codigo}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{item.descricao}</td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.tipo}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                  {new Intl.NumberFormat('pt-BR').format(item.quantidade)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.unidade}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(item.quantidade * item.custo)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.localizacao}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`status-badge ${
                    item.status === 'baixo' ? 'status-pending' :
                    item.status === 'alto' ? 'status-approved' : 'status-completed'
                  }`}>
                    {item.status === 'baixo' ? 'Baixo' :
                     item.status === 'alto' ? 'Alto' : 'Normal'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlertas = () => {
    const alertas = estoqueData.filter(item => item.status === 'baixo');
    
    return (
      <div className="space-y-4">
        {alertas.length > 0 ? (
          alertas.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-yellow-300 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.descricao}</p>
                        <p className="text-sm text-gray-600">
                          Código: {item.codigo} • Localização: {item.localizacao}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Quantidade Atual</p>
                      <p className="text-lg font-bold text-yellow-700">
                        {item.quantidade} {item.unidade}
                      </p>
                      <p className="text-xs text-gray-500">
                        Mínimo: {item.estoqueMin} {item.unidade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum alerta de estoque no momento</p>
          </div>
        )}
      </div>
    );
  };

  const renderPlaceholder = (title, icon) => {
    const Icon = icon;
    return (
      <div className="text-center py-12">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          A seção de {title.toLowerCase()} será implementada em breve.
        </p>
        <Button
          onClick={() => toast({ description: `🚧 ${title} não implementado ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀` })}
          variant="outline"
        >
          Verificar Novidades
        </Button>
      </div>
    );
  };

  const sectionTitle = {
    posicao: 'Posição Atual do Estoque',
    alertas: 'Alertas de Estoque',
    'curva-abc': 'Análise Curva ABC',
    entradas: 'Entradas de Estoque',
    saidas: 'Saídas de Estoque',
    localizacao: 'Localização de Estoque'
  }[activeSection];

  const renderContent = () => {
    switch (activeSection) {
      case 'posicao':
        return filteredData.length > 0 ? renderPosicaoEstoque() : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto em estoque'}
            </p>
          </div>
        );
      case 'alertas':
        return renderAlertas();
      case 'curva-abc':
        return renderPlaceholder('Análise Curva ABC', BarChart3);
      case 'entradas':
        return renderPlaceholder('Entradas', TrendingUp);
      case 'saidas':
        return renderPlaceholder('Saídas', TrendingDown);
      case 'localizacao':
        return renderPlaceholder('Localização', MapPin);
      default:
        return renderPosicaoEstoque();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
          <p className="text-gray-500">Gestão em tempo real do estoque</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={exportToExcel}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar XLSX
          </Button>
          <Button
            onClick={handleEntrada}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Entrada de Produtos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Total de Itens</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div><Package className="h-8 w-8 text-blue-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Estoque Baixo</p><p className="text-2xl font-bold text-yellow-600">{stats.baixo}</p></div><AlertTriangle className="h-8 w-8 text-yellow-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Estoque Alto</p><p className="text-2xl font-bold text-green-600">{stats.alto}</p></div><TrendingUp className="h-8 w-8 text-green-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Valor Total</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotal)}</p></div><DollarSign className="h-8 w-8 text-emerald-500" /></CardContent></Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos no estoque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-800">{sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal Entrada de Produtos */}
      {showEntradaModal && (
        <EntradaProdutoModal
          isOpen={showEntradaModal}
          onClose={() => setShowEntradaModal(false)}
          produtos={data.produtos || []}
          onSave={handleSalvarEntrada}
        />
      )}
    </div>
  );
}

const EntradaProdutoModal = ({ isOpen, onClose, produtos, onSave }) => {
  const [formData, setFormData] = useState({
    produtoId: '',
    quantidade: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.produtoId && formData.quantidade && formData.data) {
      onSave({
        ...formData,
        produtoId: parseInt(formData.produtoId),
        quantidade: parseFloat(formData.quantidade)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Entrada de Produtos</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="produto">Produto *</Label>
              <Select value={formData.produtoId} onValueChange={(value) => setFormData({...formData, produtoId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.id.toString()}>
                      {produto.codigo} - {produto.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.001"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                placeholder="0"
                required
              />
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
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações sobre a entrada"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Registrar Entrada
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

EstoqueModule.Sidebar = EstoqueSidebar;
EstoqueModule.defaultSection = 'posicao';
