"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PedidoModal = ({ isOpen, onClose, onSave, editingItem, selectedCotacao, cotacoes, fornecedores, produtos }) => {
  const [formData, setFormData] = useState({
    cotacaoId: "",
    fornecedorId: "",
    dataPrevisao: "",
    observacoes: "",
    condicoesPagamento: "",
    valorTotal: 0,
    frete: 0,
    itens: [],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingItem) {
      setFormData({
        cotacaoId: editingItem.cotacaoId || "",
        fornecedorId: editingItem.fornecedorId || "",
        dataPrevisao: editingItem.dataPrevisao ? new Date(editingItem.dataPrevisao).toISOString().split("T")[0] : "",
        observacoes: editingItem.observacoes || "",
        condicoesPagamento: editingItem.condicoesPagamento || "",
        valorTotal: editingItem.valorTotal || 0,
        frete: editingItem.frete || 0,
        itens: editingItem.itens || [],
      })
    } else if (selectedCotacao) {
      const fornecedorSelecionado = selectedCotacao.fornecedores.find(
        (f) => f.fornecedorId === selectedCotacao.fornecedorSelecionado,
      )
      const dataPrevisao = new Date()
      dataPrevisao.setDate(dataPrevisao.getDate() + (fornecedorSelecionado?.prazoEntrega || 15))

      setFormData({
        cotacaoId: selectedCotacao.id,
        fornecedorId: selectedCotacao.fornecedorSelecionado,
        dataPrevisao: dataPrevisao.toISOString().split("T")[0],
        observacoes: "",
        condicoesPagamento: fornecedorSelecionado?.condicoesPagamento || "30 dias",
        valorTotal: selectedCotacao.valorTotal,
        frete: fornecedorSelecionado?.frete || 0,
        itens: fornecedorSelecionado?.itens || [],
      })
    } else {
      setFormData({
        cotacaoId: "",
        fornecedorId: "",
        dataPrevisao: "",
        observacoes: "",
        condicoesPagamento: "",
        valorTotal: 0,
        frete: 0,
        itens: [],
      })
    }
    setErrors({})
  }, [editingItem, selectedCotacao, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleCotacaoChange = (cotacaoId) => {
    const cotacao = cotacoes.find((c) => c.id === Number.parseInt(cotacaoId))
    if (cotacao) {
      const fornecedorSelecionado = cotacao.fornecedores.find((f) => f.fornecedorId === cotacao.fornecedorSelecionado)
      const dataPrevisao = new Date()
      dataPrevisao.setDate(dataPrevisao.getDate() + (fornecedorSelecionado?.prazoEntrega || 15))

      setFormData((prev) => ({
        ...prev,
        cotacaoId: Number.parseInt(cotacaoId),
        fornecedorId: cotacao.fornecedorSelecionado,
        dataPrevisao: dataPrevisao.toISOString().split("T")[0],
        condicoesPagamento: fornecedorSelecionado?.condicoesPagamento || "30 dias",
        valorTotal: cotacao.valorTotal,
        frete: fornecedorSelecionado?.frete || 0,
        itens: fornecedorSelecionado?.itens || [],
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cotacaoId) {
      newErrors.cotacaoId = "Cotação é obrigatória"
    }

    if (!formData.dataPrevisao) {
      newErrors.dataPrevisao = "Data de previsão é obrigatória"
    } else {
      const dataPrevisao = new Date(formData.dataPrevisao)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      if (dataPrevisao < hoje) {
        newErrors.dataPrevisao = "Data de previsão deve ser futura"
      }
    }

    if (!formData.condicoesPagamento.trim()) {
      newErrors.condicoesPagamento = "Condições de pagamento são obrigatórias"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        cotacaoId: Number.parseInt(formData.cotacaoId),
        fornecedorId: Number.parseInt(formData.fornecedorId),
        dataPrevisao: new Date(formData.dataPrevisao).toISOString(),
      }
      onSave(dataToSave)
    }
  }

  const cotacao = cotacoes.find((c) => c.id === Number.parseInt(formData.cotacaoId)) || selectedCotacao
  const fornecedor = fornecedores.find((f) => f.id === Number.parseInt(formData.fornecedorId))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingItem ? "Editar Pedido" : "Novo Pedido de Compra"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Gerais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cotacaoId">Cotação *</Label>
                <Select
                  value={formData.cotacaoId.toString()}
                  onValueChange={handleCotacaoChange}
                  disabled={!!selectedCotacao}
                >
                  <SelectTrigger className={errors.cotacaoId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a cotação" />
                  </SelectTrigger>
                  <SelectContent>
                    {cotacoes.map((cot) => (
                      <SelectItem key={cot.id} value={cot.id.toString()}>
                        {cot.numero} - R$ {cot.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cotacaoId && <p className="text-red-500 text-sm mt-1">{errors.cotacaoId}</p>}
              </div>

              <div>
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={fornecedor?.nome || "Selecione uma cotação"}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="dataPrevisao">Data de Previsão *</Label>
                <Input
                  id="dataPrevisao"
                  type="date"
                  value={formData.dataPrevisao}
                  onChange={(e) => handleInputChange("dataPrevisao", e.target.value)}
                  className={errors.dataPrevisao ? "border-red-500" : ""}
                />
                {errors.dataPrevisao && <p className="text-red-500 text-sm mt-1">{errors.dataPrevisao}</p>}
              </div>

              <div>
                <Label htmlFor="condicoesPagamento">Condições de Pagamento *</Label>
                <Input
                  id="condicoesPagamento"
                  value={formData.condicoesPagamento}
                  onChange={(e) => handleInputChange("condicoesPagamento", e.target.value)}
                  className={errors.condicoesPagamento ? "border-red-500" : ""}
                  placeholder="Ex: 30/60/90 dias"
                />
                {errors.condicoesPagamento && <p className="text-red-500 text-sm mt-1">{errors.condicoesPagamento}</p>}
              </div>

              <div>
                <Label htmlFor="frete">Frete (R$)</Label>
                <Input id="frete" type="number" step="0.01" value={formData.frete} readOnly className="bg-gray-100" />
              </div>

              <div>
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input
                  id="valorTotal"
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  readOnly
                  className="bg-gray-100 font-bold text-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Observações do pedido..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          {formData.itens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.itens.map((item, index) => {
                    const produto = produtos.find((p) => p.id === item.produtoId)
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{produto?.descricao || "Produto não encontrado"}</p>
                          <p className="text-sm text-gray-600">Código: {produto?.codigo}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="font-medium">{item.quantidade}</p>
                          <p className="text-sm text-gray-600">{produto?.unidade}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="font-medium">
                            R$ {item.precoUnitario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-600">Preço Unit.</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            R$ {item.precoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Subtotal:</span>
                    <span className="text-lg">
                      R$ {(formData.valorTotal - formData.frete).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Frete:</span>
                    <span className="text-lg">
                      R$ {formData.frete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xl font-bold">Total Geral:</span>
                    <span className="text-xl font-bold text-blue-600">
                      R$ {formData.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Fornecedor */}
          {fornecedor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Fornecedor</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="font-medium">{fornecedor.nome}</p>
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <p className="font-medium">{fornecedor.cnpj}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{fornecedor.email}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="font-medium">{fornecedor.telefone}</p>
                </div>
                <div className="md:col-span-2">
                  <Label>Endereço</Label>
                  <p className="font-medium">
                    {fornecedor.endereco}, {fornecedor.cidade} - {fornecedor.estado}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingItem ? "Atualizar" : "Criar"} Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PedidoModal
