import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  databasesService,
  DatabaseRecord,
  DatabaseColumn,
  DatabaseRow,
  ColumnType,
} from '@/services/databases'
import {
  Plus,
  Trash2,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Check,
  Search,
  Settings2,
  Table as TableIcon,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DatabaseView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [database, setDatabase] = useState<DatabaseRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [columns, setColumns] = useState<DatabaseColumn[]>([])
  const [rows, setRows] = useState<DatabaseRow[]>([])

  // Filtro
  const [filterQuery, setFilterQuery] = useState('')
  const [filterColumnId, setFilterColumnId] = useState<string>('all')

  // Modal para adicionar nova coluna
  const [colModalOpen, setColModalOpen] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [newColType, setNewColType] = useState<ColumnType>('text')
  const [newColValues, setNewColValues] = useState('')

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      try {
        const data = await databasesService.getById(id)
        setDatabase(data)
        setName(data.name || '')
        setColumns(data.columns || [])
        setRows(data.rows || [])
      } catch (err) {
        console.error(err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const triggerSave = async (newName = name, newCols = columns, newRows = rows) => {
    if (!id) return
    try {
      await databasesService.update(id, {
        name: newName,
        columns: newCols,
        rows: newRows,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleNameChange = (val: string) => {
    setName(val)
    triggerSave(val, columns, rows)
  }

  const handleDeleteDatabase = async () => {
    if (!id) return
    if (confirm('Tem certeza que deseja excluir esta tabela?')) {
      await databasesService.delete(id)
      navigate('/')
    }
  }

  // Adicionar Linha
  const handleAddRow = () => {
    const newRow: DatabaseRow = {
      id: 'r_' + Date.now(),
    }
    columns.forEach((c) => {
      newRow[c.id] = c.type === 'checkbox' ? false : ''
    })
    const updated = [...rows, newRow]
    setRows(updated)
    triggerSave(name, columns, updated)
  }

  // Atualizar Célula
  const handleCellChange = (rowId: string, colId: string, val: any) => {
    const updated = rows.map((r) => (r.id === rowId ? { ...r, [colId]: val } : r))
    setRows(updated)
    triggerSave(name, columns, updated)
  }

  // Excluir Linha
  const handleDeleteRow = (rowId: string) => {
    const updated = rows.filter((r) => r.id !== rowId)
    setRows(updated)
    triggerSave(name, columns, updated)
  }

  // Adicionar Coluna
  const handleAddColumn = () => {
    if (!newColName.trim()) return
    const colId = 'col_' + Date.now()
    const valuesArr =
      newColType === 'select'
        ? newColValues
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : undefined

    const newCol: DatabaseColumn = {
      id: colId,
      name: newColName.trim(),
      type: newColType,
      values: valuesArr,
    }

    const updatedCols = [...columns, newCol]
    // Inicializa valor para linhas existentes
    const updatedRows = rows.map((r) => ({
      ...r,
      [colId]: newColType === 'checkbox' ? false : '',
    }))

    setColumns(updatedCols)
    setRows(updatedRows)
    triggerSave(name, updatedCols, updatedRows)

    setNewColName('')
    setNewColType('text')
    setNewColValues('')
    setColModalOpen(false)
  }

  // Excluir Coluna
  const handleDeleteColumn = (colId: string) => {
    if (columns.length <= 1) {
      alert('A tabela deve ter pelo menos uma coluna.')
      return
    }
    if (confirm('Tem certeza que deseja excluir esta coluna?')) {
      const updatedCols = columns.filter((c) => c.id !== colId)
      const updatedRows = rows.map((r) => {
        const copy = { ...r }
        delete copy[colId]
        return copy
      })
      setColumns(updatedCols)
      setRows(updatedRows)
      triggerSave(name, updatedCols, updatedRows)
    }
  }

  // Filtros
  const filteredRows = rows.filter((row) => {
    if (!filterQuery.trim()) return true
    const q = filterQuery.toLowerCase()

    if (filterColumnId === 'all') {
      return columns.some((c) => {
        const val = row[c.id]
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q)
      })
    } else {
      const val = row[filterColumnId]
      return val !== undefined && val !== null && String(val).toLowerCase().includes(q)
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Carregando tabela...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{database?.icon || '📊'}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome da Tabela"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
            />
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Adicione colunas e linhas personalizadas com edição em tempo real e filtros.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColModalOpen(true)}
            className="text-xs gap-1.5 h-8 text-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nova Coluna</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteDatabase}
            className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Excluir tabela"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Barra de Filtro e Controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar valores na tabela..."
              className="pl-8 text-xs h-8 bg-white"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={filterColumnId}
            onChange={(e) => setFilterColumnId(e.target.value)}
            className="text-xs h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Todas as colunas</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                Coluna: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            Exibindo <strong>{filteredRows.length}</strong> de {rows.length} registros
          </span>

          <Button
            size="sm"
            onClick={handleAddRow}
            className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar Linha</span>
          </Button>
        </div>
      </div>

      {/* Grid da Tabela */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="w-10 px-3 py-2.5 text-center text-slate-400 border-r border-slate-200">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-3 py-2.5 border-r border-slate-200 min-w-[140px] group relative"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{col.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal uppercase">
                        ({col.type})
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 rounded transition-opacity">
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs w-36">
                          <DropdownMenuItem
                            onClick={() => handleDeleteColumn(col.id)}
                            className="text-rose-600 focus:text-rose-600"
                          >
                            <Trash2 className="h-3 w-3 mr-1.5" /> Excluir Coluna
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </th>
                ))}
                <th className="w-10 px-2 py-2.5 text-center text-slate-400">
                  <button
                    onClick={() => setColModalOpen(true)}
                    className="p-1 hover:text-slate-800 rounded"
                    title="Adicionar coluna"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRows.map((row, rIndex) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-3 py-2 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100">
                    {rIndex + 1}
                  </td>

                  {columns.map((col) => {
                    const value = row[col.id] ?? ''

                    return (
                      <td key={col.id} className="p-1.5 border-r border-slate-100">
                        {col.type === 'select' ? (
                          <select
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-400 bg-transparent text-slate-800 focus:bg-white"
                          >
                            <option value="">(Selecione)</option>
                            {col.values?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : col.type === 'checkbox' ? (
                          <div className="flex items-center justify-center h-7">
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={(e) => handleCellChange(row.id, col.id, e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                            />
                          </div>
                        ) : col.type === 'date' ? (
                          <input
                            type="date"
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-400 bg-transparent text-slate-800 focus:bg-white"
                          />
                        ) : col.type === 'number' ? (
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              handleCellChange(row.id, col.id, Number(e.target.value))
                            }
                            placeholder="0"
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-400 bg-transparent text-slate-800 focus:bg-white"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            placeholder="Vazio"
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-400 bg-transparent text-slate-800 focus:bg-white"
                          />
                        )}
                      </td>
                    )
                  })}

                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                      title="Excluir linha"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="py-10 text-center text-slate-400 text-xs"
                  >
                    {filterQuery
                      ? `Nenhum resultado corresponde a "${filterQuery}".`
                      : 'Nenhum registro cadastrado na tabela ainda.'}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddRow}
                        className="text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Criar primeira linha
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela */}
        <div className="p-2.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nova linha</span>
          </button>

          <span className="text-[11px] text-slate-400">
            Dica: Edite qualquer célula diretamente clicando nela.
          </span>
        </div>
      </div>

      {/* Modal Adicionar Coluna */}
      <Dialog open={colModalOpen} onOpenChange={setColModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              Adicionar Nova Coluna
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Nome da Coluna</label>
              <Input
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Ex: Categoria, Telefone..."
                className="text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tipo de Dado</label>
              <select
                value={newColType}
                onChange={(e) => setNewColType(e.target.value as ColumnType)}
                className="w-full text-xs h-9 px-2 rounded-md border border-slate-200 bg-white text-slate-800"
              >
                <option value="text">Texto simples</option>
                <option value="number">Número</option>
                <option value="select">Seleção / Status</option>
                <option value="checkbox">Checkbox (Sim/Não)</option>
                <option value="date">Data</option>
              </select>
            </div>

            {newColType === 'select' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Opções de Seleção (separadas por vírgula)
                </label>
                <Input
                  value={newColValues}
                  onChange={(e) => setNewColValues(e.target.value)}
                  placeholder="Ex: Baixa, Média, Alta"
                  className="text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColModalOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAddColumn}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              Criar Coluna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
