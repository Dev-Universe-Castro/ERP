"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/DataContext"
import { toast } from "@/components/ui/use-toast"

import ComprasSidebar from "./compras/ComprasSidebar"
import ComprasStats from "./compras/ComprasStats"
import RequisicoesTab from "./compras/RequisicoesTab"
import CotacoesTab from "./compras/CotacoesTab"
import PedidosTab from "./compras/PedidosTab"
import AprovacoesTab from "./compras/AprovacoesTab"
import RequisicaoModal from "./compras/RequisicaoModal"
import CotacaoModal from "./compras/CotacaoModal"
import PedidoModal from "./compras/PedidoModal"
import { getStatusBadge, getPrioridadeBadge, exportToExcel } from "./compras/utils"

const ComprasModule = ({ activeSection }) => {
  const { data, updateItem, addItem, deleteItem, generateNumber, createTitulosPagar } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showRequisicaoModal, setShowRequisicaoModal] = useState(false)
  const [showCotacaoModal, setShowCotacaoModal] = useState(false)
  const [showPedidoModal, setShowPedidoModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedRequisicao, setSelectedRequisicao] = useState(null)
  const [selectedCotacao, setSelectedCotacao] = useState(null)

  const { requisicoes, cotacoes, pedidos, produtos, fornecedores } = useMemo(
    () => ({
      requisicoes: data.requisicoes || [],
      cotacoes: data.cotacoes || [],
      pedidos: data.pedidos || [],
      produtos: data.produtos || [],
      fornecedores: data.fornecedores || [],
    }),
    [data],
  )

  const getRequisicoesComDados = useMemo(() => {
    return requisicoes.map((req) => ({
      ...req,
      itens: req.itens.map((item) => ({
        ...item,
        produto: produtos.find((p) => p.id === item.produtoId)?.descricao || "Produto não encontrado",
      })),
    }))
  }, [requisicoes, produtos])

  const getCotacoesComDados = useMemo(() => {
    return cotacoes.map((cot) => ({
      ...cot,
      requisicao: requisicoes.find((r) => r.id === cot.requisicaoId)?.numero || "REQ não encontrada",
      fornecedor: fornecedores.find((f) => f.id === cot.fornecedorSelecionado)?.nome || "Fornecedor não encontrado",
    }))
  }, [cotacoes, requisicoes, fornecedores])

  const getPedidosComDados = useMemo(() => {
    return pedidos.map((ped) => ({
      ...ped,
      cotacao: cotacoes.find((c) => c.id === ped.cotacaoId)?.numero || "COT não encontrada",
      fornecedor: fornecedores.find((f) => f.id === ped.fornecedorId)?.nome || "Fornecedor não encontrado",
    }))
  }, [pedidos, cotacoes, fornecedores])

  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    switch (activeSection) {
      case "requisicoes":
        return getRequisicoesComDados.filter((item) =>
          Object.values(item).some((value) => value?.toString().toLowerCase().includes(lowerSearchTerm)),
        )
      case "cotacoes":
        return getCotacoesComDados.filter((item) =>
          Object.values(item).some((value) => value?.toString().toLowerCase().includes(lowerSearchTerm)),
        )
      case "pedidos":
        return getPedidosComDados.filter((item) =>
          Object.values(item).some((value) => value?.toString().toLowerCase().includes(lowerSearchTerm)),
        )
      case "aprovacoes":
        return getCotacoesComDados.filter((c) => c.aprovacao.status === "pendente")
      default:
        return []
    }
  }, [activeSection, searchTerm, getRequisicoesComDados, getCotacoesComDados, getPedidosComDados])

  const stats = useMemo(
    () => ({
      totalRequisicoes: requisicoes.length,
      requisicoesAprovadas: requisicoes.filter((r) => r.status === "aprovada").length,
      cotacoesPendentes: cotacoes.filter((c) => c.aprovacao.status === "pendente").length,
      valorTotalPedidos: pedidos.reduce((acc, p) => acc + p.valorTotal, 0),
    }),
    [requisicoes, cotacoes, pedidos],
  )

  // HANDLERS PARA REQUISIÇÕES
  const handleNovaRequisicao = () => {
    setEditingItem(null)
    setShowRequisicaoModal(true)
  }

  const handleEditRequisicao = (requisicao) => {
    setEditingItem(requisicao)
    setShowRequisicaoModal(true)
  }

  const handleDeleteRequisicao = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta requisição?")) {
      deleteItem("requisicoes", id)
      toast({
        title: "Requisição excluída",
        description: "A requisição foi excluída com sucesso.",
      })
    }
  }

  const handleSaveRequisicao = (requisicaoData) => {
    if (editingItem) {
      updateItem("requisicoes", editingItem.id, requisicaoData)
      toast({
        title: "Requisição atualizada",
        description: "A requisição foi atualizada com sucesso.",
      })
    } else {
      const novaRequisicao = {
        ...requisicaoData,
        numero: generateNumber("REQ", "requisicoes"),
        dataRequisicao: new Date().toISOString(),
        status: "pendente",
        aprovacao: {
          status: "pendente",
          aprovadoPor: null,
          dataAprovacao: null,
          observacoes: null,
        },
      }
      addItem("requisicoes", novaRequisicao)
      toast({
        title: "Requisição criada",
        description: "A requisição foi criada com sucesso.",
      })
    }
    setShowRequisicaoModal(false)
    setEditingItem(null)
  }

  const handleAprovarRequisicao = (id) => {
    updateItem("requisicoes", id, {
      status: "aprovada",
      "aprovacao.status": "aprovada",
      "aprovacao.aprovadoPor": "Maria Santos", // Usuário logado
      "aprovacao.dataAprovacao": new Date().toISOString(),
      "aprovacao.observacoes": "Aprovado para cotação",
    })
    toast({
      title: "Requisição aprovada",
      description: "A requisição foi aprovada e pode gerar cotação.",
    })
  }

  const handleRejeitarRequisicao = (id) => {
    updateItem("requisicoes", id, {
      status: "rejeitada",
      "aprovacao.status": "rejeitada",
      "aprovacao.aprovadoPor": "Maria Santos", // Usuário logado
      "aprovacao.dataAprovacao": new Date().toISOString(),
      "aprovacao.observacoes": "Requisição rejeitada",
    })
    toast({
      title: "Requisição rejeitada",
      description: "A requisição foi rejeitada.",
    })
  }

  // HANDLERS PARA COTAÇÕES
  const handleNovaCotacao = () => {
    const requisicoesAprovadas = requisicoes.filter(
      (r) => r.status === "aprovada" && !cotacoes.some((c) => c.requisicaoId === r.id),
    )
    if (requisicoesAprovadas.length === 0) {
      toast({
        title: "Nenhuma requisição disponível",
        description: "Não há requisições aprovadas disponíveis para cotação.",
        variant: "destructive",
      })
      return
    }
    setEditingItem(null)
    setSelectedRequisicao(null)
    setShowCotacaoModal(true)
  }

  const handleEditCotacao = (cotacao) => {
    setEditingItem(cotacao)
    setSelectedRequisicao(requisicoes.find((r) => r.id === cotacao.requisicaoId))
    setShowCotacaoModal(true)
  }

  const handleDeleteCotacao = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cotação?")) {
      deleteItem("cotacoes", id)
      toast({
        title: "Cotação excluída",
        description: "A cotação foi excluída com sucesso.",
      })
    }
  }

  const handleSaveCotacao = (cotacaoData) => {
    if (editingItem) {
      updateItem("cotacoes", editingItem.id, cotacaoData)
      toast({
        title: "Cotação atualizada",
        description: "A cotação foi atualizada com sucesso.",
      })
    } else {
      const novaCotacao = {
        ...cotacaoData,
        numero: generateNumber("COT", "cotacoes"),
        dataEmissao: new Date().toISOString(),
        status: "pendente",
        aprovacao: {
          status: "pendente",
          aprovadoPor: null,
          dataAprovacao: null,
          dataEnvio: new Date().toISOString(),
          observacoes: null,
        },
      }
      addItem("cotacoes", novaCotacao)

      // Atualizar status da requisição
      updateItem("requisicoes", cotacaoData.requisicaoId, { status: "em-cotacao" })

      toast({
        title: "Cotação criada",
        description: "A cotação foi criada com sucesso.",
      })
    }
    setShowCotacaoModal(false)
    setEditingItem(null)
    setSelectedRequisicao(null)
  }

  const handleAprovarCotacao = (id) => {
    updateItem("cotacoes", id, {
      "aprovacao.status": "aprovada",
      "aprovacao.dataAprovacao": new Date().toISOString(),
      "aprovacao.aprovadoPor": "Maria Santos",
      status: "aprovada",
    })
    toast({
      title: "Cotação aprovada",
      description: "A cotação foi aprovada e pode gerar pedido de compra.",
    })
  }

  const handleRejeitarCotacao = (id) => {
    updateItem("cotacoes", id, {
      "aprovacao.status": "rejeitada",
      "aprovacao.dataRejeicao": new Date().toISOString(),
      "aprovacao.aprovadoPor": "Maria Santos",
      status: "rejeitada",
    })
    toast({
      title: "Cotação rejeitada",
      description: "A cotação foi rejeitada.",
    })
  }

  // HANDLERS PARA PEDIDOS
  const handleNovoPedido = () => {
    const cotacoesAprovadas = cotacoes.filter(
      (c) => c.aprovacao.status === "aprovada" && !pedidos.some((p) => p.cotacaoId === c.id),
    )
    if (cotacoesAprovadas.length === 0) {
      toast({
        title: "Nenhuma cotação disponível",
        description: "Não há cotações aprovadas disponíveis para pedido.",
        variant: "destructive",
      })
      return
    }
    setEditingItem(null)
    setSelectedCotacao(null)
    setShowPedidoModal(true)
  }

  const handleEditPedido = (pedido) => {
    setEditingItem(pedido)
    setSelectedCotacao(cotacoes.find((c) => c.id === pedido.cotacaoId))
    setShowPedidoModal(true)
  }

  const handleDeletePedido = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      deleteItem("pedidos", id)
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso.",
      })
    }
  }

  const handleSavePedido = (pedidoData) => {
    if (editingItem) {
      updateItem("pedidos", editingItem.id, pedidoData)
      toast({
        title: "Pedido atualizado",
        description: "O pedido foi atualizado com sucesso.",
      })
    } else {
      const cotacao = cotacoes.find((c) => c.id === pedidoData.cotacaoId)
      const fornecedor = fornecedores.find((f) => f.id === pedidoData.fornecedorId)

      const novoPedido = {
        ...pedidoData,
        numero: generateNumber("PC", "pedidos"),
        dataEmissao: new Date().toISOString(),
        status: "enviado",
        recebimento: {
          status: "pendente",
          dataRecebimento: null,
          recebidoPor: null,
          observacoes: null,
          itensRecebidos: [],
        },
      }

      const pedidoCriado = addItem("pedidos", novoPedido)

      // Criar títulos a pagar no financeiro
      createTitulosPagar(pedidoCriado, fornecedor)

      // Atualizar status da cotação
      updateItem("cotacoes", pedidoData.cotacaoId, { status: "pedido-gerado" })

      toast({
        title: "Pedido criado",
        description: "O pedido foi criado e os títulos a pagar foram gerados no financeiro.",
      })
    }
    setShowPedidoModal(false)
    setEditingItem(null)
    setSelectedCotacao(null)
  }

  const handleReceberPedido = (id) => {
    const pedido = pedidos.find((p) => p.id === id)
    if (!pedido) return

    updateItem("pedidos", id, {
      status: "recebido",
      dataEntrega: new Date().toISOString(),
      "recebimento.status": "completo",
      "recebimento.dataRecebimento": new Date().toISOString(),
      "recebimento.recebidoPor": "João Silva", // Usuário logado
    })

    // Atualizar estoque dos produtos
    pedido.itens.forEach((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)
      if (produto) {
        updateItem("produtos", item.produtoId, {
          estoqueAtual: produto.estoqueAtual + item.quantidade,
        })
      }
    })

    toast({
      title: "Pedido recebido",
      description: "O pedido foi marcado como recebido e o estoque foi atualizado.",
    })
  }

  const handleExport = () => {
    let dataToExport
    switch (activeSection) {
      case "requisicoes":
        dataToExport = getRequisicoesComDados
        break
      case "cotacoes":
        dataToExport = getCotacoesComDados
        break
      case "pedidos":
        dataToExport = getPedidosComDados
        break
      default:
        dataToExport = []
    }
    exportToExcel(activeSection, dataToExport)
  }

  const sectionTitle = {
    requisicoes: "Requisições",
    cotacoes: "Cotações",
    pedidos: "Pedidos",
    aprovacoes: "Aprovações",
  }[activeSection]

  const renderActionButtons = () => {
    switch (activeSection) {
      case "requisicoes":
        return (
          <Button onClick={handleNovaRequisicao} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Requisição
          </Button>
        )
      case "cotacoes":
        return (
          <Button onClick={handleNovaCotacao} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cotação
          </Button>
        )
      case "pedidos":
        return (
          <Button onClick={handleNovoPedido} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "requisicoes":
        return (
          <RequisicoesTab
            data={filteredData}
            getStatusBadge={getStatusBadge}
            getPrioridadeBadge={getPrioridadeBadge}
            onEdit={handleEditRequisicao}
            onDelete={handleDeleteRequisicao}
            onAprovar={handleAprovarRequisicao}
            onRejeitar={handleRejeitarRequisicao}
          />
        )
      case "cotacoes":
        return (
          <CotacoesTab
            data={filteredData}
            getStatusBadge={getStatusBadge}
            handleAprovar={handleAprovarCotacao}
            handleRejeitar={handleRejeitarCotacao}
            onEdit={handleEditCotacao}
            onDelete={handleDeleteCotacao}
          />
        )
      case "pedidos":
        return (
          <PedidosTab
            data={filteredData}
            getStatusBadge={getStatusBadge}
            onEdit={handleEditPedido}
            onDelete={handleDeletePedido}
            onReceber={handleReceberPedido}
          />
        )
      case "aprovacoes":
        return (
          <AprovacoesTab
            data={filteredData}
            handleAprovar={handleAprovarCotacao}
            handleRejeitar={handleRejeitarCotacao}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
          <p className="text-gray-500">Gestão de requisições, cotações e pedidos</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar XLSX
          </Button>
          {renderActionButtons()}
        </div>
      </div>

      <ComprasStats stats={stats} />

      {activeSection !== "aprovacoes" && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Buscar ${activeSection}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-800 capitalize">{sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      {/* Modais */}
      <RequisicaoModal
        isOpen={showRequisicaoModal}
        onClose={() => {
          setShowRequisicaoModal(false)
          setEditingItem(null)
        }}
        onSave={handleSaveRequisicao}
        editingItem={editingItem}
        produtos={produtos}
      />

      <CotacaoModal
        isOpen={showCotacaoModal}
        onClose={() => {
          setShowCotacaoModal(false)
          setEditingItem(null)
          setSelectedRequisicao(null)
        }}
        onSave={handleSaveCotacao}
        editingItem={editingItem}
        selectedRequisicao={selectedRequisicao}
        requisicoes={requisicoes.filter(
          (r) => r.status === "aprovada" && !cotacoes.some((c) => c.requisicaoId === r.id),
        )}
        fornecedores={fornecedores}
        produtos={produtos}
      />

      <PedidoModal
        isOpen={showPedidoModal}
        onClose={() => {
          setShowPedidoModal(false)
          setEditingItem(null)
          setSelectedCotacao(null)
        }}
        onSave={handleSavePedido}
        editingItem={editingItem}
        selectedCotacao={selectedCotacao}
        cotacoes={cotacoes.filter(
          (c) => c.aprovacao.status === "aprovada" && !pedidos.some((p) => p.cotacaoId === c.id),
        )}
        fornecedores={fornecedores}
        produtos={produtos}
      />
    </div>
  )
}

ComprasModule.Sidebar = ComprasSidebar
ComprasModule.defaultSection = "requisicoes"

export default ComprasModule
