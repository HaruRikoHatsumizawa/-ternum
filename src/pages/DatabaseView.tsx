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
      {/* Top Header do Códice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262e40]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{database?.icon || '🐉'}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do Códice Arcano"
              className="text-2xl sm:text-3xl font-fantasy font-bold tracking-tight text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
            />
          </div>
          <p className="text-xs text-[#a39b8d] pl-8">
            Arquivo de Bestiário, Tesouros e Personagens da Mesa: filtre e edite atributos em tempo
            real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColModalOpen(true)}
            className="text-xs gap-1.5 h-8 bg-[#141923] border-[#2c3547] text-amber-200 hover:text-amber-100 hover:bg-[#1a2130] font-fantasy font-bold"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span>Novo Atributo (Coluna)</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteDatabase}
            className="h-8 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            title="Excluir códice"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Barra de Filtro e Controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121620] p-2.5 rounded-lg border border-[#262e40] shadow-md">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-amber-400/70" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Pesquisar criatura, item ou NPC..."
              className="pl-8 text-xs h-8 bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-2 text-amber-400/60 hover:text-amber-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={filterColumnId}
            onChange={(e) => setFilterColumnId(e.target.value)}
            className="text-xs h-8 px-2.5 rounded-md border border-[#262e40] bg-[#090c10] text-amber-200"
          >
            <option value="all">Todas as colunas arcanas</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                Coluna: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300/70">
          <span>
            Exibindo <strong className="text-amber-200">{filteredRows.length}</strong> de{' '}
            {rows.length} entradas no códice
          </span>

          <Button
            size="sm"
            onClick={handleAddRow}
            className="h-8 text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold gap-1 border border-amber-300/40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar Registro</span>
          </Button>
        </div>
      </div>

      {/* Grid da Tabela do Códice */}
      <div className="border border-[#262e40] rounded-xl overflow-hidden bg-[#0e121a] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#141924] border-b border-[#262e40] text-amber-200 font-fantasy font-bold select-none">
                <th className="w-10 px-3 py-2.5 text-center text-amber-400/60 border-r border-[#262e40]">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-3 py-2.5 border-r border-[#262e40] min-w-[140px] group relative"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-amber-100">{col.name}</span>
                      <span className="text-[10px] text-amber-400/50 font-mono uppercase font-normal">
                        ({col.type})
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 p-0.5 text-amber-400/60 hover:text-amber-200 rounded transition-opacity">
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="text-xs w-40 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
                        >
                          <DropdownMenuItem
                            onClick={() => handleDeleteColumn(col.id)}
                            className="text-rose-400 focus:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3 mr-1.5" /> Excluir Atributo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </th>
                ))}
                <th className="w-10 px-2 py-2.5 text-center text-amber-400/60">
                  <button
                    onClick={() => setColModalOpen(true)}
                    className="p-1 hover:text-amber-200 rounded"
                    title="Adicionar coluna"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1e2535] text-amber-100">
              {filteredRows.map((row, rIndex) => (
                <tr key={row.id} className="hover:bg-[#141a26]/80 transition-colors group">
                  <td className="px-3 py-2 text-center text-amber-400/60 font-mono text-[11px] border-r border-[#1e2535]">
                    {rIndex + 1}
                  </td>

                  {columns.map((col) => {
                    const value = row[col.id] ?? ''

                    return (
                      <td key={col.id} className="p-1.5 border-r border-[#1e2535]">
                        {col.type === 'select' ? (
                          <select
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-[#2a3346] focus:border-amber-500/50 bg-transparent text-amber-100 focus:bg-[#0c0f16]"
                          >
                            <option value="" className="bg-[#121620]">
                              (Selecione)
                            </option>
                            {col.values?.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#121620]">
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
                              className="h-4 w-4 rounded border-[#2c3547] text-amber-500 focus:ring-0 cursor-pointer bg-[#090c10]"
                            />
                          </div>
                        ) : col.type === 'date' ? (
                          <input
                            type="date"
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-[#2a3346] focus:border-amber-500/50 bg-transparent text-amber-100 focus:bg-[#0c0f16]"
                          />
                        ) : col.type === 'number' ? (
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              handleCellChange(row.id, col.id, Number(e.target.value))
                            }
                            placeholder="0"
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-[#2a3346] focus:border-amber-500/50 bg-transparent text-amber-100 focus:bg-[#0c0f16]"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                            placeholder="Vazio"
                            className="w-full text-xs h-7 px-1.5 rounded border border-transparent hover:border-[#2a3346] focus:border-amber-500/50 bg-transparent text-amber-100 focus:bg-[#0c0f16]"
                          />
                        )}
                      </td>
                    )
                  })}

                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-rose-400/60 hover:text-rose-400 rounded transition-opacity"
                      title="Excluir registro"
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
                    className="py-10 text-center text-[#7d7568] text-xs font-fantasy"
                  >
                    {filterQuery
                      ? `Nenhum encantamento ou criatura corresponde a "${filterQuery}".`
                      : 'Nenhum registro anotado neste códice ainda.'}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddRow}
                        className="text-xs h-7 border-[#2a3346] text-amber-300 hover:text-amber-200"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Criar primeira entrada
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela do Códice */}
        <div className="p-2.5 bg-[#121620] border-t border-[#262e40] flex items-center justify-between text-xs text-amber-300/70">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 font-fantasy font-bold text-amber-300 hover:text-amber-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span>Nova entrada no tomo</span>
          </button>

          <span className="text-[11px] text-[#7d7568]">
            Dica: Edite atributos e valores diretamente nas células do tomo.
          </span>
        </div>
      </div>

      {/* Modal Adicionar Coluna / Atributo */}
      <Dialog open={colModalOpen} onOpenChange={setColModalOpen}>
        <DialogContent className="max-w-sm bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="text-base font-fantasy font-bold text-amber-100">
              Adicionar Novo Atributo ao Códice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Nome do Atributo
              </label>
              <Input
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Ex: Fraqueza, Custo em PO, ND..."
                className="text-sm bg-[#090c10] border-[#2a3346] text-amber-100 placeholder:text-amber-200/40"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">Tipo de Dado</label>
              <select
                value={newColType}
                onChange={(e) => setNewColType(e.target.value as ColumnType)}
                className="w-full text-xs h-9 px-2 rounded-md border border-[#2a3346] bg-[#090c10] text-amber-100"
              >
                <option value="text">Texto simples</option>
                <option value="number">Número (HP, ND, PO)</option>
                <option value="select">Seleção / Categoria</option>
                <option value="checkbox">Checkbox (Sim/Não)</option>
                <option value="date">Data da mesa</option>
              </select>
            </div>

            {newColType === 'select' && (
              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  Opções de Seleção (separadas por vírgula)
                </label>
                <Input
                  value={newColValues}
                  onChange={(e) => setNewColValues(e.target.value)}
                  placeholder="Ex: Comum, Raro, Lendário"
                  className="text-xs bg-[#090c10] border-[#2a3346] text-amber-100 placeholder:text-amber-200/40"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-[#222938]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColModalOpen(false)}
              className="text-xs border-[#2a3346] text-amber-200/70 hover:text-amber-100 hover:bg-[#18202e]"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAddColumn}
              className="text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold border border-amber-300/40"
            >
              Forjar Atributo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
