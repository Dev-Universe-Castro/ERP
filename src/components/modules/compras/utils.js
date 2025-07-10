import * as XLSX from 'xlsx';
import { toast } from '@/components/ui/use-toast';

export const getStatusBadge = (status) => {
  const statusMap = {
    'pendente': 'status-pending',
    'aprovada': 'status-approved',
    'rejeitada': 'status-rejected',
    'em-cotacao': 'status-completed',
    'aguardando-aprovacao': 'status-pending',
    'enviado': 'status-completed',
    'recebido': 'status-approved'
  };
  return statusMap[status] || 'status-pending';
};

export const getPrioridadeBadge = (prioridade) => {
  const prioridadeMap = {
    'alta': 'status-rejected',
    'media': 'status-pending',
    'baixa': 'status-completed'
  };
  return prioridadeMap[prioridade] || 'status-pending';
};

export const exportToExcel = (activeTab, data) => {
  let dataToExport = [];
  let filename = '';
  
  switch (activeTab) {
    case 'requisicoes':
      dataToExport = data.map(item => ({
        Número: item.numero,
        Solicitante: item.solicitante,
        Departamento: item.departamento,
        'Data Requisição': item.dataRequisicao,
        Status: item.status,
        Prioridade: item.prioridade,
        Observações: item.observacoes
      }));
      filename = 'requisicoes.xlsx';
      break;
    case 'cotacoes':
      dataToExport = data.map(item => ({
        Número: item.numero,
        Requisição: item.requisicao,
        'Data Emissão': item.dataEmissao,
        'Data Vencimento': item.dataVencimento,
        Status: item.status,
        'Status Aprovação': item.aprovacao.status,
        Fornecedor: item.fornecedor,
        'Valor Total': item.valorTotal
      }));
      filename = 'cotacoes.xlsx';
      break;
    case 'pedidos':
      dataToExport = data.map(item => ({
        Número: item.numero,
        Cotação: item.cotacao,
        Fornecedor: item.fornecedor,
        'Data Emissão': item.dataEmissao,
        'Data Previsão': item.dataPrevisao,
        Status: item.status,
        'Valor Total': item.valorTotal
      }));
      filename = 'pedidos.xlsx';
      break;
    default:
      toast({ title: "Erro na exportação", description: "Tipo de dado inválido.", variant: "destructive" });
      return;
  }
  
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, activeTab);
  XLSX.writeFile(wb, filename);
  
  toast({
    title: "Exportação concluída",
    description: `Relatório de ${activeTab} exportado com sucesso.`
  });
};
