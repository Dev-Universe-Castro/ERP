"use client"

import { createContext, useContext, useState, useEffect } from "react"

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    // Dados de exemplo para todos os módulos
    const mockData = {
      // Dados de Cadastros
      clientes: [
        {
          id: 1,
          codigo: "CLI001",
          nome: "Fazenda São João",
          cnpj: "12.345.678/0001-90",
          email: "contato@fazendaosaojoao.com.br",
          telefone: "(16) 3234-5678",
          endereco: "Rodovia Anhanguera, Km 315",
          cidade: "Ribeirão Preto",
          estado: "SP",
          cep: "14000-000",
          faturamento: 2500000,
          tipo: "Pessoa Jurídica",
          ativo: true,
          dataUltimaCompra: "2024-01-15",
          observacoes: "Cliente premium com histórico de pagamentos em dia",
        },
        {
          id: 2,
          codigo: "CLI002",
          nome: "Agropecuária Silva Ltda",
          cnpj: "98.765.432/0001-10",
          email: "comercial@agrosilva.com.br",
          telefone: "(34) 3456-7890",
          endereco: "Av. das Indústrias, 1500",
          cidade: "Uberlândia",
          estado: "MG",
          cep: "38400-000",
          faturamento: 1800000,
          tipo: "Pessoa Jurídica",
          ativo: true,
          dataUltimaCompra: "2024-01-18",
          observacoes: "Especializada em grãos",
        },
        {
          id: 3,
          codigo: "CLI003",
          nome: "João Carlos Santos",
          cnpj: "123.456.789-00",
          email: "joao.santos@email.com",
          telefone: "(62) 9876-5432",
          endereco: "Rua das Flores, 123",
          cidade: "Goiânia",
          estado: "GO",
          cep: "74000-000",
          faturamento: 450000,
          tipo: "Pessoa Física",
          ativo: true,
          dataUltimaCompra: "2024-01-10",
          observacoes: "Produtor rural individual",
        },
      ],

      fornecedores: [
        {
          id: 1,
          codigo: "FOR001",
          nome: "Fertilizantes Brasil S.A.",
          cnpj: "11.222.333/0001-44",
          email: "vendas@fertilizantesbrasil.com.br",
          telefone: "(11) 3333-4444",
          endereco: "Av. Paulista, 1000",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01310-000",
          termosPagamento: "30/60/90 dias",
          categoria: "Matéria Prima",
          ativo: true,
          observacoes: "Fornecedor principal de NPK",
        },
        {
          id: 2,
          codigo: "FOR002",
          nome: "Química Industrial Ltda",
          cnpj: "22.333.444/0001-55",
          email: "comercial@quimicaindustrial.com.br",
          telefone: "(21) 2222-3333",
          endereco: "Rua da Química, 500",
          cidade: "Rio de Janeiro",
          estado: "RJ",
          cep: "20000-000",
          termosPagamento: "À vista com 5% desconto",
          categoria: "Produtos Químicos",
          ativo: true,
          observacoes: "Especializada em produtos especiais",
        },
        {
          id: 3,
          codigo: "FOR003",
          nome: "Embalagens Modernas Ltda",
          cnpj: "33.444.555/0001-66",
          email: "vendas@embalagenmodernas.com.br",
          telefone: "(11) 4444-5555",
          endereco: "Rua das Embalagens, 200",
          cidade: "São Paulo",
          estado: "SP",
          cep: "08000-000",
          termosPagamento: "30 dias",
          categoria: "Embalagens",
          ativo: true,
          observacoes: "Fornecedor de sacarias e embalagens",
        },
      ],

      transportadoras: [
        {
          id: 1,
          codigo: "TRA001",
          nome: "Transportes Rápidos Ltda",
          cnpj: "33.444.555/0001-66",
          email: "operacional@transportesrapidos.com.br",
          telefone: "(16) 3555-6666",
          endereco: "Rodovia dos Bandeirantes, Km 200",
          cidade: "Campinas",
          estado: "SP",
          cep: "13000-000",
          modalidade: "Rodoviário",
          especialidade: "Cargas Secas",
          ativo: true,
          observacoes: "Cobertura nacional",
        },
        {
          id: 2,
          codigo: "TRA002",
          nome: "Logística Express",
          cnpj: "44.555.666/0001-77",
          email: "contato@logisticaexpress.com.br",
          telefone: "(11) 4444-5555",
          endereco: "Av. Marginal, 2000",
          cidade: "São Paulo",
          estado: "SP",
          cep: "05000-000",
          modalidade: "Rodoviário",
          especialidade: "Fertilizantes",
          ativo: true,
          observacoes: "Especializada em produtos agrícolas",
        },
      ],

      produtos: [
        // MATÉRIAS-PRIMAS
        {
          id: 1,
          codigo: "MP001",
          descricao: "Ureia Técnica 46%",
          tipo: "Matéria Prima",
          categoria: "Fertilizante Base",
          subcategoria: "Nitrogenado",
          unidade: "TON",
          custo: 2800.0,
          preco: 3200.0,
          estoqueMin: 50,
          estoqueAtual: 150,
          formula: "46-00-00",
          pureza: "99.5%",
          fornecedor: "Fertilizantes Brasil S.A.",
          localizacao: "Galpão A - Setor 1",
          dataValidade: "2025-12-31",
          lote: "LOT2024001",
          ativo: true,
          observacoes: "Matéria prima para produção de NPK",
        },
        {
          id: 2,
          codigo: "MP002",
          descricao: "Superfosfato Triplo",
          tipo: "Matéria Prima",
          categoria: "Fertilizante Base",
          subcategoria: "Fosfatado",
          unidade: "TON",
          custo: 3200.0,
          preco: 3600.0,
          estoqueMin: 30,
          estoqueAtual: 80,
          formula: "46-00-00",
          pureza: "98.2%",
          fornecedor: "Química Industrial Ltda",
          localizacao: "Galpão A - Setor 2",
          dataValidade: "2025-06-30",
          lote: "LOT2024002",
          ativo: true,
          observacoes: "Alta concentração de P2O5",
        },
        {
          id: 3,
          codigo: "MP003",
          descricao: "Cloreto de Potássio",
          tipo: "Matéria Prima",
          categoria: "Fertilizante Base",
          subcategoria: "Potássico",
          unidade: "TON",
          custo: 2400.0,
          preco: 2800.0,
          estoqueMin: 40,
          estoqueAtual: 120,
          formula: "00-00-60",
          pureza: "99.0%",
          fornecedor: "Fertilizantes Brasil S.A.",
          localizacao: "Galpão A - Setor 3",
          dataValidade: "2026-01-15",
          lote: "LOT2024003",
          ativo: true,
          observacoes: "Fonte de potássio solúvel",
        },
        {
          id: 17,
          codigo: "MP004",
          descricao: "MAP (Fosfato Monoamônico)",
          tipo: "Matéria Prima",
          categoria: "Fertilizante Base",
          subcategoria: "Fosfatado",
          unidade: "TON",
          custo: 3500.0,
          preco: 3900.0,
          estoqueMin: 25,
          estoqueAtual: 65,
          formula: "11-52-00",
          pureza: "98.5%",
          fornecedor: "Fertilizantes Brasil S.A.",
          localizacao: "Galpão A - Setor 4",
          dataValidade: "2025-09-30",
          lote: "LOT2024004",
          ativo: true,
          observacoes: "Fonte de fósforo e nitrogênio",
        },

        // PRODUTOS ACABADOS COM BOM
        {
          id: 4,
          codigo: "PA001",
          descricao: "Fertilizante NPK 20-05-20",
          tipo: "Produto Acabado",
          categoria: "Fertilizante Formulado",
          subcategoria: "NPK",
          unidade: "TON",
          custo: 2500.0, // Calculado automaticamente baseado no BOM
          preco: 2800.0,
          estoqueMin: 25,
          estoqueAtual: 75,
          formula: "20-05-20",
          composicao: "Ureia + Superfosfato + Cloreto de Potássio",
          bomId: "BOM001",
          localizacao: "Galpão B - Setor 1",
          dataProducao: "2024-01-10",
          lote: "PROD2024001",
          ativo: true,
          observacoes: "Produto para culturas de alta demanda nutricional",
          // BOM - Lista de matérias-primas necessárias
          bom: [
            {
              materiaPrimaId: 1, // Ureia Técnica 46%
              quantidade: 0.435, // 435 kg por tonelada
              unidade: "TON",
            },
            {
              materiaPrimaId: 2, // Superfosfato Triplo
              quantidade: 0.109, // 109 kg por tonelada
              unidade: "TON",
            },
            {
              materiaPrimaId: 3, // Cloreto de Potássio
              quantidade: 0.333, // 333 kg por tonelada
              unidade: "TON",
            },
          ],
        },
        {
          id: 5,
          codigo: "PA002",
          descricao: "Fertilizante NPK 04-14-08",
          tipo: "Produto Acabado",
          categoria: "Fertilizante Formulado",
          subcategoria: "NPK",
          unidade: "TON",
          custo: 2200.0, // Calculado automaticamente baseado no BOM
          preco: 2600.0,
          estoqueMin: 20,
          estoqueAtual: 60,
          formula: "04-14-08",
          composicao: "Ureia + MAP + Cloreto de Potássio",
          bomId: "BOM002",
          localizacao: "Galpão B - Setor 2",
          dataProducao: "2024-01-15",
          lote: "PROD2024002",
          ativo: true,
          observacoes: "Ideal para plantio de milho e soja",
          // BOM - Lista de matérias-primas necessárias
          bom: [
            {
              materiaPrimaId: 1, // Ureia Técnica 46%
              quantidade: 0.087, // 87 kg por tonelada
              unidade: "TON",
            },
            {
              materiaPrimaId: 17, // MAP
              quantidade: 0.269, // 269 kg por tonelada
              unidade: "TON",
            },
            {
              materiaPrimaId: 3, // Cloreto de Potássio
              quantidade: 0.133, // 133 kg por tonelada
              unidade: "TON",
            },
          ],
        },

        // INSUMOS
        {
          id: 6,
          codigo: "INS001",
          descricao: "Micronutrientes Quelatizados",
          tipo: "Insumo",
          categoria: "Aditivo",
          subcategoria: "Micronutriente",
          unidade: "KG",
          custo: 45.0,
          preco: 65.0,
          estoqueMin: 100,
          estoqueAtual: 500,
          composicao: "Zn, Fe, Mn, Cu, B, Mo",
          concentracao: "Mix balanceado",
          fornecedor: "Química Industrial Ltda",
          localizacao: "Almoxarifado - Prateleira A1",
          dataValidade: "2025-08-30",
          lote: "INS2024001",
          ativo: true,
          observacoes: "Para enriquecimento de formulações",
        },
        {
          id: 7,
          codigo: "INS002",
          descricao: "Condicionador de Solo",
          tipo: "Insumo",
          categoria: "Aditivo",
          subcategoria: "Condicionador",
          unidade: "KG",
          custo: 12.0,
          preco: 18.0,
          estoqueMin: 200,
          estoqueAtual: 800,
          composicao: "Polímeros hidrofílicos",
          concentracao: "100%",
          fornecedor: "Química Industrial Ltda",
          localizacao: "Almoxarifado - Prateleira A2",
          dataValidade: "2025-12-31",
          lote: "INS2024002",
          ativo: true,
          observacoes: "Melhora retenção de água no solo",
        },

        // MATERIAIS DE MARKETING
        {
          id: 8,
          codigo: "MKT001",
          descricao: "Sacaria Personalizada 50kg",
          tipo: "Material Marketing",
          categoria: "Embalagem",
          subcategoria: "Saco",
          unidade: "UN",
          custo: 2.5,
          preco: 0.0, // Não vendido
          estoqueMin: 1000,
          estoqueAtual: 5000,
          especificacao: "Polipropileno com impressão 4 cores",
          dimensoes: "90x60cm",
          fornecedor: "Gráfica Moderna",
          localizacao: "Almoxarifado - Setor Embalagens",
          dataValidade: null,
          lote: "MKT2024001",
          ativo: true,
          observacoes: "Para produtos NPK linha premium",
        },
        {
          id: 9,
          codigo: "MKT002",
          descricao: "Etiquetas Adesivas",
          tipo: "Material Marketing",
          categoria: "Identificação",
          subcategoria: "Etiqueta",
          unidade: "UN",
          custo: 0.15,
          preco: 0.0,
          estoqueMin: 5000,
          estoqueAtual: 25000,
          especificacao: "Papel couché com adesivo permanente",
          dimensoes: "10x5cm",
          fornecedor: "Gráfica Moderna",
          localizacao: "Almoxarifado - Gaveta 1",
          dataValidade: null,
          lote: "MKT2024002",
          ativo: true,
          observacoes: "Para identificação de lotes",
        },

        // ATIVOS
        {
          id: 10,
          codigo: "ATV001",
          descricao: "Misturador Industrial 5000L",
          tipo: "Ativo",
          categoria: "Equipamento",
          subcategoria: "Produção",
          unidade: "UN",
          custo: 85000.0,
          preco: 0.0, // Não vendido
          estoqueMin: 0,
          estoqueAtual: 1,
          especificacao: "Aço inox 316L, motor 50HP",
          numeroSerie: "MIX2024001",
          fornecedor: "Equipamentos Industriais Ltda",
          localizacao: "Linha de Produção 1",
          dataAquisicao: "2024-01-05",
          garantia: "24 meses",
          ativo: true,
          observacoes: "Equipamento principal para mistura de NPK",
        },
        {
          id: 11,
          codigo: "ATV002",
          descricao: "Empilhadeira Elétrica 3T",
          tipo: "Ativo",
          categoria: "Equipamento",
          subcategoria: "Movimentação",
          unidade: "UN",
          custo: 45000.0,
          preco: 0.0,
          estoqueMin: 0,
          estoqueAtual: 2,
          especificacao: "Bateria 48V, elevação 4m",
          numeroSerie: "EMP2024001",
          fornecedor: "Máquinas e Equipamentos S.A.",
          localizacao: "Galpão A",
          dataAquisicao: "2024-01-10",
          garantia: "12 meses",
          ativo: true,
          observacoes: "Para movimentação de pallets",
        },

        // ITENS DE CONSUMO
        {
          id: 12,
          codigo: "CON001",
          descricao: "EPI - Máscara PFF2",
          tipo: "Item Consumo",
          categoria: "Segurança",
          subcategoria: "EPI",
          unidade: "UN",
          custo: 3.5,
          preco: 0.0,
          estoqueMin: 100,
          estoqueAtual: 500,
          especificacao: "Proteção respiratória PFF2",
          certificacao: "CA 38.500",
          fornecedor: "Segurança Total Ltda",
          localizacao: "Almoxarifado - Setor EPI",
          dataValidade: "2025-06-30",
          lote: "EPI2024001",
          ativo: true,
          observacoes: "Uso obrigatório na produção",
        },
        {
          id: 13,
          codigo: "CON002",
          descricao: "Material de Limpeza - Detergente Industrial",
          tipo: "Item Consumo",
          categoria: "Limpeza",
          subcategoria: "Detergente",
          unidade: "L",
          custo: 8.5,
          preco: 0.0,
          estoqueMin: 50,
          estoqueAtual: 200,
          especificacao: "Biodegradável, pH neutro",
          concentracao: "Concentrado 1:10",
          fornecedor: "Produtos de Limpeza Ltda",
          localizacao: "Almoxarifado - Setor Limpeza",
          dataValidade: "2025-12-31",
          lote: "LMP2024001",
          ativo: true,
          observacoes: "Para limpeza de equipamentos",
        },

        // COMBUSTÍVEIS
        {
          id: 14,
          codigo: "CMB001",
          descricao: "Diesel S10",
          tipo: "Combustível",
          categoria: "Combustível",
          subcategoria: "Diesel",
          unidade: "L",
          custo: 5.2,
          preco: 0.0,
          estoqueMin: 1000,
          estoqueAtual: 5000,
          especificacao: "Diesel S10 - Baixo teor de enxofre",
          octanagem: null,
          fornecedor: "Distribuidora de Combustíveis",
          localizacao: "Tanque de Combustível 1",
          dataValidade: "2024-06-30",
          lote: "DSL2024001",
          ativo: true,
          observacoes: "Para empilhadeiras e geradores",
        },
        {
          id: 15,
          codigo: "CMB002",
          descricao: "Gasolina Comum",
          tipo: "Combustível",
          categoria: "Combustível",
          subcategoria: "Gasolina",
          unidade: "L",
          custo: 5.8,
          preco: 0.0,
          estoqueMin: 500,
          estoqueAtual: 2000,
          especificacao: "Gasolina comum tipo C",
          octanagem: "87",
          fornecedor: "Distribuidora de Combustíveis",
          localizacao: "Tanque de Combustível 2",
          dataValidade: "2024-05-31",
          lote: "GAS2024001",
          ativo: true,
          observacoes: "Para veículos leves e equipamentos",
        },

        // OUTROS PRODUTOS
        {
          id: 16,
          codigo: "OUT001",
          descricao: "Pallet de Madeira",
          tipo: "Outros",
          categoria: "Logística",
          subcategoria: "Pallet",
          unidade: "UN",
          custo: 35.0,
          preco: 0.0,
          estoqueMin: 50,
          estoqueAtual: 200,
          especificacao: "Madeira tratada 1,20x1,00m",
          dimensoes: "120x100x15cm",
          fornecedor: "Madeireira São Paulo",
          localizacao: "Pátio Externo",
          dataValidade: null,
          lote: "PAL2024001",
          ativo: true,
          observacoes: "Para movimentação de produtos",
        },
      ],

      // DADOS DO MÓDULO DE COMPRAS
      requisicoes: [
        {
          id: 1,
          numero: "REQ-2024-001",
          solicitante: "João Silva",
          departamento: "Produção",
          dataRequisicao: "2024-01-15T10:30:00.000Z",
          dataNecessidade: "2024-01-25T00:00:00.000Z",
          status: "aprovada",
          prioridade: "alta",
          observacoes: "Urgente para produção de NPK",
          itens: [
            {
              id: 1,
              produtoId: 1, // Ureia Técnica 46%
              quantidade: 50,
              unidade: "TON",
              justificativa: "Estoque baixo para produção",
            },
            {
              id: 2,
              produtoId: 3, // Cloreto de Potássio
              quantidade: 30,
              unidade: "TON",
              justificativa: "Reposição de estoque",
            },
          ],
          aprovacao: {
            status: "aprovada",
            aprovadoPor: "Maria Santos",
            dataAprovacao: "2024-01-16T14:20:00.000Z",
            observacoes: "Aprovado conforme necessidade de produção",
          },
        },
        {
          id: 2,
          numero: "REQ-2024-002",
          solicitante: "Carlos Oliveira",
          departamento: "Manutenção",
          dataRequisicao: "2024-01-18T08:15:00.000Z",
          dataNecessidade: "2024-02-01T00:00:00.000Z",
          status: "pendente",
          prioridade: "media",
          observacoes: "Material para manutenção preventiva",
          itens: [
            {
              id: 1,
              produtoId: 12, // EPI - Máscara PFF2
              quantidade: 100,
              unidade: "UN",
              justificativa: "Reposição de EPIs",
            },
          ],
          aprovacao: {
            status: "pendente",
            aprovadoPor: null,
            dataAprovacao: null,
            observacoes: null,
          },
        },
        {
          id: 3,
          numero: "REQ-2024-003",
          solicitante: "Ana Costa",
          departamento: "Logística",
          dataRequisicao: "2024-01-20T16:45:00.000Z",
          dataNecessidade: "2024-01-30T00:00:00.000Z",
          status: "em-cotacao",
          prioridade: "baixa",
          observacoes: "Reposição de materiais de embalagem",
          itens: [
            {
              id: 1,
              produtoId: 8, // Sacaria Personalizada 50kg
              quantidade: 2000,
              unidade: "UN",
              justificativa: "Estoque baixo de embalagens",
            },
          ],
          aprovacao: {
            status: "aprovada",
            aprovadoPor: "Maria Santos",
            dataAprovacao: "2024-01-21T09:30:00.000Z",
            observacoes: "Aprovado para cotação",
          },
        },
      ],

      cotacoes: [
        {
          id: 1,
          numero: "COT-2024-001",
          requisicaoId: 1,
          dataEmissao: "2024-01-17T09:00:00.000Z",
          dataVencimento: "2024-01-24T23:59:59.000Z",
          status: "aprovada",
          observacoes: "Cotação para materiais urgentes",
          fornecedores: [
            {
              fornecedorId: 1, // Fertilizantes Brasil S.A.
              prazoEntrega: 7,
              condicoesPagamento: "30/60/90 dias",
              frete: 1500.0,
              itens: [
                {
                  produtoId: 1, // Ureia Técnica 46%
                  quantidade: 50,
                  precoUnitario: 2750.0,
                  precoTotal: 137500.0,
                },
                {
                  produtoId: 3, // Cloreto de Potássio
                  quantidade: 30,
                  precoUnitario: 2350.0,
                  precoTotal: 70500.0,
                },
              ],
              valorTotal: 209500.0,
            },
            {
              fornecedorId: 2, // Química Industrial Ltda
              prazoEntrega: 10,
              condicoesPagamento: "À vista com 5% desconto",
              frete: 1800.0,
              itens: [
                {
                  produtoId: 1, // Ureia Técnica 46%
                  quantidade: 50,
                  precoUnitario: 2800.0,
                  precoTotal: 140000.0,
                },
                {
                  produtoId: 3, // Cloreto de Potássio
                  quantidade: 30,
                  precoUnitario: 2400.0,
                  precoTotal: 72000.0,
                },
              ],
              valorTotal: 213800.0,
            },
          ],
          fornecedorSelecionado: 1, // Fertilizantes Brasil S.A.
          valorTotal: 209500.0,
          aprovacao: {
            status: "aprovada",
            aprovadoPor: "Maria Santos",
            dataAprovacao: "2024-01-18T11:15:00.000Z",
            dataEnvio: "2024-01-17T09:00:00.000Z",
            observacoes: "Melhor proposta selecionada",
          },
        },
        {
          id: 2,
          numero: "COT-2024-002",
          requisicaoId: 3,
          dataEmissao: "2024-01-22T14:30:00.000Z",
          dataVencimento: "2024-01-29T23:59:59.000Z",
          status: "pendente",
          observacoes: "Cotação para embalagens",
          fornecedores: [
            {
              fornecedorId: 3, // Embalagens Modernas Ltda
              prazoEntrega: 15,
              condicoesPagamento: "30 dias",
              frete: 800.0,
              itens: [
                {
                  produtoId: 8, // Sacaria Personalizada 50kg
                  quantidade: 2000,
                  precoUnitario: 2.3,
                  precoTotal: 4600.0,
                },
              ],
              valorTotal: 5400.0,
            },
          ],
          fornecedorSelecionado: 3,
          valorTotal: 5400.0,
          aprovacao: {
            status: "pendente",
            aprovadoPor: null,
            dataAprovacao: null,
            dataEnvio: "2024-01-22T14:30:00.000Z",
            observacoes: null,
          },
        },
      ],

      pedidos: [
        {
          id: 1,
          numero: "PC-2024-001",
          cotacaoId: 1,
          fornecedorId: 1, // Fertilizantes Brasil S.A.
          dataEmissao: "2024-01-18T15:30:00.000Z",
          dataPrevisao: "2024-01-25T00:00:00.000Z",
          dataEntrega: null,
          status: "enviado",
          valorTotal: 209500.0,
          condicoesPagamento: "30/60/90 dias",
          observacoes: "Pedido urgente conforme cotação aprovada",
          itens: [
            {
              produtoId: 1, // Ureia Técnica 46%
              quantidade: 50,
              precoUnitario: 2750.0,
              precoTotal: 137500.0,
            },
            {
              produtoId: 3, // Cloreto de Potássio
              quantidade: 30,
              precoUnitario: 2350.0,
              precoTotal: 70500.0,
            },
          ],
          frete: 1500.0,
          recebimento: {
            status: "pendente",
            dataRecebimento: null,
            recebidoPor: null,
            observacoes: null,
            itensRecebidos: [],
          },
        },
      ],

      // DADOS DO FINANCEIRO - TÍTULOS A PAGAR (alimentados pelo módulo de compras)
      titulosPagar: [
        {
          id: 1,
          descricao: "Compra de Matérias-Primas - PC-2024-001",
          origem: "Pedido de Compra",
          pedidoId: 1,
          fornecedorId: 1,
          fornecedor: "Fertilizantes Brasil S.A.",
          valor: 69833.33, // 209500 / 3 (30/60/90 dias)
          dataVencimento: "2024-02-18T00:00:00.000Z", // 30 dias
          dataEmissao: "2024-01-18T15:30:00.000Z",
          status: "pendente",
          parcela: "1/3",
          observacoes: "Primeira parcela - 30 dias",
        },
        {
          id: 2,
          descricao: "Compra de Matérias-Primas - PC-2024-001",
          origem: "Pedido de Compra",
          pedidoId: 1,
          fornecedorId: 1,
          fornecedor: "Fertilizantes Brasil S.A.",
          valor: 69833.33, // 209500 / 3 (30/60/90 dias)
          dataVencimento: "2024-03-18T00:00:00.000Z", // 60 dias
          dataEmissao: "2024-01-18T15:30:00.000Z",
          status: "pendente",
          parcela: "2/3",
          observacoes: "Segunda parcela - 60 dias",
        },
        {
          id: 3,
          descricao: "Compra de Matérias-Primas - PC-2024-001",
          origem: "Pedido de Compra",
          pedidoId: 1,
          fornecedorId: 1,
          fornecedor: "Fertilizantes Brasil S.A.",
          valor: 69833.34, // 209500 / 3 (30/60/90 dias) + centavos
          dataVencimento: "2024-04-18T00:00:00.000Z", // 90 dias
          dataEmissao: "2024-01-18T15:30:00.000Z",
          status: "pendente",
          parcela: "3/3",
          observacoes: "Terceira parcela - 90 dias",
        },
      ],

      titulosReceber: [
        {
          id: 1,
          descricao: "Venda NPK 20-05-20 - Fazenda São João",
          origem: "Pedido de Venda",
          cliente: "Fazenda São João",
          valor: 155000,
          dataVencimento: "2024-02-15T00:00:00.000Z",
          dataEmissao: "2024-01-15T00:00:00.000Z",
          status: "pendente",
          observacoes: "Pagamento à vista",
        },
        {
          id: 2,
          descricao: "Venda Ureia 45% - Agropecuária Silva",
          origem: "Pedido de Venda",
          cliente: "Agropecuária Silva Ltda",
          valor: 103500,
          dataVencimento: "2024-02-18T00:00:00.000Z",
          dataEmissao: "2024-01-18T00:00:00.000Z",
          status: "recebido",
          dataRecebimento: "2024-01-20T00:00:00.000Z",
          observacoes: "Pagamento antecipado",
        },
      ],

      // Dados para outros módulos (mantidos)
      ordensProducao: [
        {
          id: 1,
          numero: "OP-2024-001",
          produtoId: 4, // NPK 20-05-20
          quantidade: 10, // 10 toneladas
          quantidadeProduzida: 0,
          status: "planejada",
          dataInicio: "2024-01-25",
          dataPrevisao: "2024-01-27",
          dataConclusao: null,
          prioridade: "alta",
          observacoes: "Pedido urgente cliente premium",
        },
        {
          id: 2,
          numero: "OP-2024-002",
          produtoId: 5, // NPK 04-14-08
          quantidade: 25, // 25 toneladas
          quantidadeProduzida: 15,
          status: "em-andamento",
          dataInicio: "2024-01-20",
          dataPrevisao: "2024-01-26",
          dataConclusao: null,
          prioridade: "media",
          observacoes: "Produção para estoque",
        },
      ],

      pedidosVenda: [
        {
          id: 1,
          numeroPedido: "PV-2024-001",
          cliente: "Fazenda São João",
          tipoCliente: "PJ",
          produto: "NPK 20-05-20",
          formula: "20-05-20",
          volume: 50,
          precoFOB: 2800,
          frete: 300,
          precoFinal: 3100,
          valorTotal: 155000,
          status: "confirmado",
          dataPedido: "15/01/2024",
          dataEmbarque: "20/01/2024",
          representante: "Carlos Silva",
          cidade: "Ribeirão Preto",
          estado: "SP",
        },
        {
          id: 2,
          numeroPedido: "PV-2024-002",
          cliente: "Agropecuária Silva",
          tipoCliente: "PJ",
          produto: "Ureia 45%",
          formula: "45-00-00",
          volume: 30,
          precoFOB: 3200,
          frete: 250,
          precoFinal: 3450,
          valorTotal: 103500,
          status: "faturado",
          dataPedido: "18/01/2024",
          dataEmbarque: "25/01/2024",
          representante: "Ana Costa",
          cidade: "Uberlândia",
          estado: "MG",
        },
      ],

      propostas: [
        {
          id: 1,
          numero: "PROP-2024-001",
          cliente: "Fazenda Santa Clara",
          representante: "Carlos Silva",
          produto: "NPK 20-05-20",
          volume: 100,
          valor: 280000,
          status: "aberta",
          data: "20/01/2024",
          validade: "20/02/2024",
        },
      ],

      notasFiscais: [
        {
          id: 1,
          numero: "NF-001234",
          pedido: "PV-2024-001",
          cliente: "Fazenda São João",
          valor: 155000,
          dataEmissao: "20/01/2024",
          status: "emitida",
          boleto: "sim",
        },
      ],

      embarques: [
        {
          id: 1,
          pedido: "PV-2024-001",
          cliente: "Fazenda São João",
          motorista: "José Silva",
          cnh: "12345678901",
          placaCavalo: "ABC-1234",
          placaCarreta: "DEF-5678",
          transportadora: "Transportes Rápidos",
          status: "entregue",
          dataEmbarque: "20/01/2024",
          dataEntrega: "22/01/2024",
        },
      ],
    }

    setData(mockData)
  }, [])

  const addItem = (category, item) => {
    const newId = Math.max(...(data[category]?.map((i) => i.id) || [0])) + 1
    const newItem = { ...item, id: newId }

    setData((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newItem],
    }))

    return newItem
  }

  const updateItem = (category, id, updates) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category]?.map((item) => (item.id === id ? { ...item, ...updates } : item)) || [],
    }))
  }

  const deleteItem = (category, id) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category]?.filter((item) => item.id !== id) || [],
    }))
  }

  const getItem = (category, id) => {
    return data[category]?.find((item) => item.id === id)
  }

  const searchItems = (category, searchTerm) => {
    if (!searchTerm) return data[category] || []

    return (data[category] || []).filter((item) =>
      Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  // Função para calcular custo baseado no BOM
  const calculateBOMCost = (bom, produtos) => {
    if (!bom || !Array.isArray(bom)) return 0

    return bom.reduce((total, component) => {
      const materiaPrima = produtos.find((p) => p.id === component.materiaPrimaId)
      if (materiaPrima) {
        return total + materiaPrima.custo * component.quantidade
      }
      return total
    }, 0)
  }

  // Função para gerar número sequencial
  const generateNumber = (prefix, category) => {
    const items = data[category] || []
    const currentYear = new Date().getFullYear()
    const count = items.filter((item) => item.numero && item.numero.includes(currentYear.toString())).length + 1
    return `${prefix}-${currentYear}-${count.toString().padStart(3, "0")}`
  }

  // Função para criar títulos a pagar baseado em pedido de compra
  const createTitulosPagar = (pedido, fornecedor) => {
    const condicoes = fornecedor.termosPagamento || "30 dias"
    const titulos = []

    if (condicoes.includes("/")) {
      // Parcelado (ex: 30/60/90 dias)
      const parcelas = condicoes.split("/").map((p) => Number.parseInt(p.trim().replace(" dias", "")))
      const valorParcela = pedido.valorTotal / parcelas.length

      parcelas.forEach((dias, index) => {
        const dataVencimento = new Date(pedido.dataEmissao)
        dataVencimento.setDate(dataVencimento.getDate() + dias)

        const titulo = {
          descricao: `Compra de Materiais - ${pedido.numero}`,
          origem: "Pedido de Compra",
          pedidoId: pedido.id,
          fornecedorId: fornecedor.id,
          fornecedor: fornecedor.nome,
          valor:
            index === parcelas.length - 1
              ? pedido.valorTotal - valorParcela * (parcelas.length - 1)
              : // Última parcela pega o resto
                valorParcela,
          dataVencimento: dataVencimento.toISOString(),
          dataEmissao: pedido.dataEmissao,
          status: "pendente",
          parcela: `${index + 1}/${parcelas.length}`,
          observacoes: `Parcela ${index + 1} - ${dias} dias`,
        }

        titulos.push(addItem("titulosPagar", titulo))
      })
    } else {
      // À vista ou prazo único
      const dias = Number.parseInt(condicoes.replace(/\D/g, "")) || 0
      const dataVencimento = new Date(pedido.dataEmissao)
      dataVencimento.setDate(dataVencimento.getDate() + dias)

      const titulo = {
        descricao: `Compra de Materiais - ${pedido.numero}`,
        origem: "Pedido de Compra",
        pedidoId: pedido.id,
        fornecedorId: fornecedor.id,
        fornecedor: fornecedor.nome,
        valor: pedido.valorTotal,
        dataVencimento: dataVencimento.toISOString(),
        dataEmissao: pedido.dataEmissao,
        status: "pendente",
        parcela: "1/1",
        observacoes: condicoes,
      }

      titulos.push(addItem("titulosPagar", titulo))
    }

    return titulos
  }

  const value = {
    data,
    setData,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    searchItems,
    calculateBOMCost,
    generateNumber,
    createTitulosPagar,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
