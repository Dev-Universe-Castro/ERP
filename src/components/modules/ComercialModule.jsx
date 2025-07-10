"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  FileText,
  Receipt,
  Truck,
  BarChart3,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Package,
  User,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/contexts/DataContext"

// Sidebar Component
function ComercialSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "pedidos", label: "Pedidos de Venda", icon: ShoppingBag },
    { id: "propostas", label: "Propostas", icon: FileText },
    { id: "faturamento", label: "Faturamento", icon: Receipt },
    { id: "embarques", label: "Embarques", icon: Truck },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  ]

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const IconComponent = item.icon
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <IconComponent className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// Pedidos Tab
function PedidosTab() {
  const { data } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const pedidos = data.pedidosVenda || []

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmado: "bg-blue-100 text-blue-800 border-blue-200",
      faturado: "bg-green-100 text-green-800 border-green-200",
      entregue: "bg-purple-100 text-purple-800 border-purple-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
    }
    return statusConfig[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pedidos de Venda</h2>
          <p className="text-gray-600">Gerencie todos os pedidos de venda</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número do pedido ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="faturado">Faturado</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Nº Pedido</th>
                  <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                  <th className="text-left p-4 font-medium text-gray-700">Produto</th>
                  <th className="text-left p-4 font-medium text-gray-700">Volume</th>
                  <th className="text-left p-4 font-medium text-gray-700">Valor Total</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Data</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-blue-600">{pedido.numeroPedido}</td>
                    <td className="p-4">{pedido.cliente}</td>
                    <td className="p-4">{pedido.produto}</td>
                    <td className="p-4">{pedido.volume} t</td>
                    <td className="p-4 font-medium">R$ {pedido.valorTotal.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusBadge(pedido.status)}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{pedido.dataPedido}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Propostas Tab
function PropostasTab() {
  const { data } = useData()
  const propostas = data.propostas || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Propostas Comerciais</h2>
          <p className="text-gray-600">Gerencie propostas e cotações</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Propostas Abertas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {propostas.filter((p) => p.status === "aberta").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Propostas Aprovadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {propostas.filter((p) => p.status === "aprovada").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-600">68%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Nº Proposta</th>
                  <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                  <th className="text-left p-4 font-medium text-gray-700">Representante</th>
                  <th className="text-left p-4 font-medium text-gray-700">Valor</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Data</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {propostas.map((proposta) => (
                  <tr key={proposta.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-blue-600">{proposta.numero}</td>
                    <td className="p-4">{proposta.cliente}</td>
                    <td className="p-4">{proposta.representante}</td>
                    <td className="p-4 font-medium">R$ {proposta.valor.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${
                          proposta.status === "aprovada"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : proposta.status === "rejeitada"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {proposta.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{proposta.data}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Faturamento Tab
function FaturamentoTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Faturamento</h2>
          <p className="text-gray-600">Controle de notas fiscais e boletos</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova NF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">NFs Emitidas</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor Faturado</p>
                <p className="text-2xl font-bold text-green-600">R$ 2.8M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Boletos Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa Pagamento</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma nota fiscal encontrada</p>
            <p className="text-sm">Clique em "Nova NF" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Embarques Tab
function EmbarquesTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Embarques</h2>
          <p className="text-gray-600">Controle de entregas e transportadoras</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Embarque
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Embarques Hoje</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Em Trânsito</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Entregues</p>
                <p className="text-2xl font-bold text-green-600">145</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Motoristas Ativos</p>
                <p className="text-2xl font-bold text-purple-600">15</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Embarques Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum embarque encontrado</p>
            <p className="text-sm">Clique em "Novo Embarque" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Relatórios Tab
function RelatoriosTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatórios Comerciais</h2>
          <p className="text-gray-600">Análises e relatórios de vendas</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Vendas por Período
            </CardTitle>
            <CardDescription>Análise de vendas mensais e anuais</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Ranking de Clientes
            </CardTitle>
            <CardDescription>Clientes com maior volume de compras</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Ranking de produtos por volume</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Margem de Lucro
            </CardTitle>
            <CardDescription>Análise de rentabilidade por produto</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Vendas por Região
            </CardTitle>
            <CardDescription>Distribuição geográfica das vendas</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-500" />
              Sazonalidade
            </CardTitle>
            <CardDescription>Padrões sazonais de vendas</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

// Main Component
export default function ComercialModule({ activeSection }) {
  const renderContent = () => {
    switch (activeSection) {
      case "pedidos":
        return <PedidosTab />
      case "propostas":
        return <PropostasTab />
      case "faturamento":
        return <FaturamentoTab />
      case "embarques":
        return <EmbarquesTab />
      case "relatorios":
        return <RelatoriosTab />
      default:
        return <PedidosTab />
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      {renderContent()}
    </motion.div>
  )
}

// Attach Sidebar to main component
ComercialModule.Sidebar = ComercialSidebar
