import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, Heart, 
  Plus, Search, Download, Calendar, UserCheck, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

const RHSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'funcionarios', label: 'Funcionários', icon: Users },
    { id: 'pagamentos', label: 'Folha de Pagamento', icon: DollarSign },
    { id: 'beneficios', label: 'Benefícios', icon: Heart },
    { id: 'relatorios', label: 'Relatórios', icon: Calendar }
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
    'ativo': 'status-approved', 'inativo': 'status-rejected',
    'ferias': 'status-pending', 'afastado': 'status-pending'
  };
  return statusMap[status] || 'status-pending';
};

const FuncionariosTable = ({ funcionarios }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cargo</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Departamento</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Admissão</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Salário</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contato</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {funcionarios.map((item, index) => (
            <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.codigo}</td>
              <td className="px-4 py-3 text-sm text-gray-800"><div><p className="font-medium">{item.nome}</p><p className="text-xs text-gray-500">{item.cpf}</p></div></td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.cargo}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.departamento}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.dataAdmissao).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.salario)}</td>
              <td className="px-4 py-3 text-center"><span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
              <td className="px-4 py-3 text-sm text-gray-600"><div><p className="text-xs">{item.email}</p><p className="text-xs">{item.telefone}</p></div></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PagamentosTable = ({ pagamentos }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Funcionário</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mês Ref.</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Salário Base</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">H. Extras</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Benefícios</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Descontos</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Líquido</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pagamentos.map((item, index) => (
            <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-800"><div><p className="font-medium">{item.funcionario}</p><p className="text-xs text-gray-500">{item.cargo}</p></div></td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.mesReferencia}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.salarioBase)}</td>
              <td className="px-4 py-3 text-sm text-green-600 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.horasExtras)}</td>
              <td className="px-4 py-3 text-sm text-blue-600 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.beneficios)}</td>
              <td className="px-4 py-3 text-sm text-red-600 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.descontos)}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.salarioLiquido)}</td>
              <td className="px-4 py-3 text-center"><span className={`status-badge ${item.status === 'pago' ? 'status-approved' : 'status-pending'}`}>{item.status}</span></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function RHModule({ activeSection }) {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const { funcionarios, pagamentos } = useMemo(() => ({
    funcionarios: data.funcionarios || [],
    pagamentos: data.pagamentos || []
  }), [data]);

  const pagamentosComFuncionarios = useMemo(() => {
    return pagamentos.map(pag => {
      const funcionario = funcionarios.find(f => f.id === pag.funcionarioId);
      return { ...pag, funcionario: funcionario?.nome || 'Funcionário não encontrado', cargo: funcionario?.cargo || '-' };
    });
  }, [pagamentos, funcionarios]);

  const filteredFuncionarios = useMemo(() => funcionarios.filter(item => Object.values(item).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))), [funcionarios, searchTerm]);
  const filteredPagamentos = useMemo(() => pagamentosComFuncionarios.filter(item => Object.values(item).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))), [pagamentosComFuncionarios, searchTerm]);

  const stats = useMemo(() => {
    const totalFuncionarios = funcionarios.length;
    const funcionariosAtivos = funcionarios.filter(f => f.status === 'ativo').length;
    const folhaPagamento = pagamentos.reduce((acc, p) => acc + p.salarioLiquido, 0);
    const mediaSalarial = totalFuncionarios > 0 ? funcionarios.reduce((acc, f) => acc + f.salario, 0) / totalFuncionarios : 0;
    return { totalFuncionarios, funcionariosAtivos, folhaPagamento, mediaSalarial };
  }, [funcionarios, pagamentos]);

  const exportToExcel = () => {
    let dataToExport, filename;
    if (activeSection === 'funcionarios') {
      dataToExport = funcionarios.map(item => ({ Código: item.codigo, Nome: item.nome, CPF: item.cpf, Cargo: item.cargo, Departamento: item.departamento, 'Data Admissão': item.dataAdmissao, Salário: item.salario, Status: item.status, Email: item.email, Telefone: item.telefone }));
      filename = 'funcionarios.xlsx';
    } else {
      dataToExport = pagamentosComFuncionarios.map(item => ({ Funcionário: item.funcionario, Cargo: item.cargo, 'Mês Referência': item.mesReferencia, 'Salário Base': item.salarioBase, 'Horas Extras': item.horasExtras, Benefícios: item.beneficios, Descontos: item.descontos, 'Salário Líquido': item.salarioLiquido, 'Data Pagamento': item.dataPagamento, Status: item.status }));
      filename = 'folha_pagamento.xlsx';
    }
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeSection);
    XLSX.writeFile(wb, filename);
    toast({ title: "Exportação concluída", description: `Relatório de ${activeSection} exportado com sucesso.` });
  };

  const [showNovoModal, setShowNovoModal] = useState(false);

  const handleNovo = () => setShowNovoModal(true);

  const handleSalvarNovo = (dados) => {
    if (activeSection === 'funcionarios') {
      const novoFuncionario = {
        id: Date.now(),
        codigo: `FUNC${String(Date.now()).slice(-3)}`,
        nome: dados.nome,
        cpf: dados.cpf,
        cargo: dados.cargo,
        departamento: dados.departamento,
        dataAdmissao: dados.dataAdmissao,
        salario: dados.salario,
        status: 'ativo',
        email: dados.email,
        telefone: dados.telefone
      };
      
      data.funcionarios = [...(data.funcionarios || []), novoFuncionario];
      
      toast({
        title: "Funcionário cadastrado",
        description: `${dados.nome} foi cadastrado com sucesso.`
      });
    } else {
      const novoPagamento = {
        id: Date.now(),
        funcionarioId: dados.funcionarioId,
        mesReferencia: dados.mesReferencia,
        salarioBase: dados.salarioBase,
        horasExtras: dados.horasExtras || 0,
        beneficios: dados.beneficios || 0,
        descontos: dados.descontos || 0,
        salarioLiquido: dados.salarioBase + (dados.horasExtras || 0) + (dados.beneficios || 0) - (dados.descontos || 0),
        dataPagamento: dados.dataPagamento,
        status: 'pendente'
      };
      
      data.pagamentos = [...(data.pagamentos || []), novoPagamento];
      
      toast({
        title: "Pagamento registrado",
        description: "Novo pagamento registrado com sucesso."
      });
    }
    
    setShowNovoModal(false);
  };

  const sectionTitle = {
    funcionarios: 'Funcionários',
    pagamentos: 'Folha de Pagamento',
    beneficios: 'Benefícios',
    relatorios: 'Relatórios'
  }[activeSection];

  const renderContent = () => {
    switch (activeSection) {
      case 'funcionarios':
        return filteredFuncionarios.length > 0 ? <FuncionariosTable funcionarios={filteredFuncionarios} /> : <div className="text-center py-12"><Users className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}</p></div>;
      case 'pagamentos':
        return filteredPagamentos.length > 0 ? <PagamentosTable pagamentos={filteredPagamentos} /> : <div className="text-center py-12"><DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">{searchTerm ? 'Nenhum pagamento encontrado' : 'Nenhum pagamento registrado'}</p></div>;
      case 'beneficios':
        return <div className="text-center py-12"><Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Gestão de benefícios será implementada em breve</p><Button onClick={() => toast({ description: "🚧 Gestão de benefícios não implementada ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerenciar Benefícios</Button></div>;
      case 'relatorios':
        return <div className="text-center py-12"><Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600 mb-4">Relatórios de RH serão implementados em breve</p><Button onClick={() => toast({ description: "🚧 Relatórios de RH não implementados ainda—mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀" })} variant="outline">Gerar Relatório</Button></div>;
      default:
        return <FuncionariosTable funcionarios={filteredFuncionarios} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2><p className="text-gray-500">Gestão de funcionários e folha de pagamento</p></div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportToExcel} variant="outline"><Download className="h-4 w-4 mr-2" />Exportar XLSX</Button>
          <Button onClick={handleNovo} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" />{activeSection === 'funcionarios' ? 'Novo Funcionário' : 'Novo Pagamento'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Funcionários</p><p className="text-2xl font-bold text-gray-800">{stats.totalFuncionarios}</p></div><Users className="h-8 w-8 text-pink-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Ativos</p><p className="text-2xl font-bold text-gray-800">{stats.funcionariosAtivos}</p></div><UserCheck className="h-8 w-8 text-green-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Folha Pagamento</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.folhaPagamento)}</p></div><DollarSign className="h-8 w-8 text-emerald-500" /></CardContent></Card>
        <Card className="metric-card"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-gray-500">Média Salarial</p><p className="text-lg font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mediaSalarial)}</p></div><Calendar className="h-8 w-8 text-blue-500" /></CardContent></Card>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder={`Buscar ${activeSection}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <Card className="bg-white">
        <CardHeader><CardTitle className="text-gray-800">{sectionTitle}</CardTitle></CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal Novo Funcionário/Pagamento */}
      {showNovoModal && (
        <NovoRHModal
          isOpen={showNovoModal}
          onClose={() => setShowNovoModal(false)}
          tipo={activeSection}
          funcionarios={funcionarios}
          onSave={handleSalvarNovo}
        />
      )}
    </div>
  );
}

const NovoRHModal = ({ isOpen, onClose, tipo, funcionarios, onSave }) => {
  const [formData, setFormData] = useState(
    tipo === 'funcionarios' 
      ? {
          nome: '',
          cpf: '',
          cargo: '',
          departamento: '',
          dataAdmissao: new Date().toISOString().split('T')[0],
          salario: '',
          email: '',
          telefone: ''
        }
      : {
          funcionarioId: '',
          mesReferencia: '',
          salarioBase: '',
          horasExtras: '',
          beneficios: '',
          descontos: '',
          dataPagamento: new Date().toISOString().split('T')[0]
        }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipo === 'funcionarios') {
      if (formData.nome && formData.cargo && formData.salario) {
        onSave({
          ...formData,
          salario: parseFloat(formData.salario)
        });
      }
    } else {
      if (formData.funcionarioId && formData.mesReferencia && formData.salarioBase) {
        onSave({
          ...formData,
          funcionarioId: parseInt(formData.funcionarioId),
          salarioBase: parseFloat(formData.salarioBase),
          horasExtras: parseFloat(formData.horasExtras || 0),
          beneficios: parseFloat(formData.beneficios || 0),
          descontos: parseFloat(formData.descontos || 0)
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{tipo === 'funcionarios' ? 'Novo Funcionário' : 'Novo Pagamento'}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tipo === 'funcionarios' ? (
              <>
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dataAdmissao">Data Admissão *</Label>
                  <Input
                    id="dataAdmissao"
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salario">Salário *</Label>
                  <Input
                    id="salario"
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) => setFormData({...formData, salario: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="funcionario">Funcionário *</Label>
                  <Select value={formData.funcionarioId} onValueChange={(value) => setFormData({...formData, funcionarioId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map(func => (
                        <SelectItem key={func.id} value={func.id.toString()}>
                          {func.nome} - {func.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mesReferencia">Mês Referência *</Label>
                  <Input
                    id="mesReferencia"
                    value={formData.mesReferencia}
                    onChange={(e) => setFormData({...formData, mesReferencia: e.target.value})}
                    placeholder="Ex: 01/2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salarioBase">Salário Base *</Label>
                  <Input
                    id="salarioBase"
                    type="number"
                    step="0.01"
                    value={formData.salarioBase}
                    onChange={(e) => setFormData({...formData, salarioBase: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horasExtras">Horas Extras</Label>
                  <Input
                    id="horasExtras"
                    type="number"
                    step="0.01"
                    value={formData.horasExtras}
                    onChange={(e) => setFormData({...formData, horasExtras: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="beneficios">Benefícios</Label>
                  <Input
                    id="beneficios"
                    type="number"
                    step="0.01"
                    value={formData.beneficios}
                    onChange={(e) => setFormData({...formData, beneficios: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="descontos">Descontos</Label>
                  <Input
                    id="descontos"
                    type="number"
                    step="0.01"
                    value={formData.descontos}
                    onChange={(e) => setFormData({...formData, descontos: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dataPagamento">Data Pagamento</Label>
                  <Input
                    id="dataPagamento"
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({...formData, dataPagamento: e.target.value})}
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

RHModule.Sidebar = RHSidebar;
RHModule.defaultSection = 'funcionarios';
