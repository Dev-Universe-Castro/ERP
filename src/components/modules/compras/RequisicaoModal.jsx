"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const RequisicaoModal = ({ isOpen, onClose, onSave, editingItem, produtos }) => {
  const [formData, setFormData] = useState({
    solicitante: "",
    departamento: "",
    dataNecessidade: "",
    prioridade: "media",
    observacoes: "",
    itens: [{ produtoId: "", quantidade: "", unidade: "TON", justificativa: "" }],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingItem) {
      setFormData({
        solicitante: editingItem.solicitante || "",
        departamento: editingItem.departamento || "",
        dataNecessidade: editingItem.dataNecessidade
          ? new Date(editingItem.dataNecessidade).toISOString().split("T")[0]
          : "",
        prioridade: editingItem.prioridade || "media",
        observacoes: editingItem.observacoes || "",
        itens: editingItem.itens || [{ produtoId: "", quantidade: "", unidade: "TON", justificativa: "" }],
      })
    } else {
      setFormData({
        solicitante: "João Silva", // Usuário logado
        departamento: "Produção",
        dataNecessidade: "",
        prioridade: "media",
        observacoes: "",
        itens: [{ produtoId: "", quantidade: "", unidade: "TON", justificativa: "" }],
      })
    }
    setErrors({})
  }, [editingItem, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItens = [...formData.itens]
    newItens[index] = { ...newItens[index], [field]: value }
    setFormData((prev) => ({ ...prev, itens: newItens }))

    if (errors[`item_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`item_${index}_${field}`]: null }))
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      itens: [...prev.itens, { produtoId: "", quantidade: "", unidade: "TON", justificativa: "" }],
    }))
  }

  const removeItem = (index) => {
    if (formData.itens.length > 1) {
      setFormData((prev) => ({
        ...prev,
        itens: prev.itens.filter((_, i) => i !== index),
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.solicitante.trim()) {
      newErrors.solicitante = "Solicitante é obrigatório"
    }

    if (!formData.departamento.trim()) {
      newErrors.departamento = "Departamento é obrigatório"
    }

    if (!formData.dataNecessidade) {
      newErrors.dataNecessidade = "Data de necessidade é obrigatória"
    } else {
      const dataNecessidade = new Date(formData.dataNecessidade)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      if (dataNecessidade < hoje) {
        newErrors.dataNecessidade = "Data de necessidade deve ser futura"
      }
    }

    formData.itens.forEach((item, index) => {
      if (!item.produtoId) {
        newErrors[`item_${index}_produtoId`] = "Produto é obrigatório"
      }
      if (!item.quantidade || Number.parseFloat(item.quantidade) <= 0) {
        newErrors[`item_${index}_quantidade`] = "Quantidade deve ser maior que zero"
      }
      if (!item.justificativa.trim()) {
        newErrors[`item_${index}_justificativa`] = "Justificativa é obrigatória"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        dataNecessidade: new Date(formData.dataNecessidade).toISOString(),
        itens: formData.itens.map((item) => ({
          ...item,
          quantidade: Number.parseFloat(item.quantidade),
        })),
      }
      onSave(dataToSave)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingItem ? "Editar Requisição" : "Nova Requisição"}
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
                <Label htmlFor="solicitante">Solicitante *</Label>
                <Input
                  id="solicitante"
                  value={formData.solicitante}
                  onChange={(e) => handleInputChange("solicitante", e.target.value)}
                  className={errors.solicitante ? "border-red-500" : ""}
                />
                {errors.solicitante && <p className="text-red-500 text-sm mt-1">{errors.solicitante}</p>}
              </div>

              <div>
                <Label htmlFor="departamento">Departamento *</Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => handleInputChange("departamento", value)}
                >
                  <SelectTrigger className={errors.departamento ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.departamento && <p className="text-red-500 text-sm mt-1">{errors.departamento}</p>}
              </div>

              <div>
                <Label htmlFor="dataNecessidade">Data de Necessidade *</Label>
                <Input
                  id="dataNecessidade"
                  type="date"
                  value={formData.dataNecessidade}
                  onChange={(e) => handleInputChange("dataNecessidade", e.target.value)}
                  className={errors.dataNecessidade ? "border-red-500" : ""}
                />
                {errors.dataNecessidade && <p className="text-red-500 text-sm mt-1">{errors.dataNecessidade}</p>}
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value) => handleInputChange("prioridade", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Observações adicionais..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens da Requisição */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Itens da Requisição</CardTitle>
              <Button type="button" onClick={addItem} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.itens.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {formData.itens.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label>Produto *</Label>
                      <Select
                        value={item.produtoId.toString()}
                        onValueChange={(value) => handleItemChange(index, "produtoId", Number.parseInt(value))}
                      >
                        <SelectTrigger className={errors[`item_${index}_produtoId`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.codigo} - {produto.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`item_${index}_produtoId`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_produtoId`]}</p>
                      )}
                    </div>

                    <div>
                      <Label>Quantidade *</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, "quantidade", e.target.value)}
                        className={errors[`item_${index}_quantidade`] ? "border-red-500" : ""}
                      />
                      {errors[`item_${index}_quantidade`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_quantidade`]}</p>
                      )}
                    </div>

                    <div>
                      <Label>Unidade</Label>
                      <Select value={item.unidade} onValueChange={(value) => handleItemChange(index, "unidade", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TON">TON</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="UN">UN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-4">
                      <Label>Justificativa *</Label>
                      <Input
                        value={item.justificativa}
                        onChange={(e) => handleItemChange(index, "justificativa", e.target.value)}
                        placeholder="Justificativa para a solicitação..."
                        className={errors[`item_${index}_justificativa`] ? "border-red-500" : ""}
                      />
                      {errors[`item_${index}_justificativa`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_justificativa`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingItem ? "Atualizar" : "Criar"} Requisição
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequisicaoModal
