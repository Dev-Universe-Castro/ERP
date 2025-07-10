"use client"
import { motion } from "framer-motion"
import { FileText, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const RequisicoesTab = ({ data, getStatusBadge, getPrioridadeBadge, onEdit, onDelete, onAprovar, onRejeitar }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Nenhuma requisição encontrada</p>
      </div>
    )
  }

  return (
    <div className="data-table rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Número</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Solicitante</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Departamento</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Necessidade</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Prioridade</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.numero}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{item.solicitante}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.departamento}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(item.dataRequisicao).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(item.dataNecessidade).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`status-badge ${getPrioridadeBadge(item.prioridade)}`}>{item.prioridade}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {item.status === "pendente" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500 hover:text-green-600"
                          onClick={() => onAprovar(item.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => onRejeitar(item.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequisicoesTab
