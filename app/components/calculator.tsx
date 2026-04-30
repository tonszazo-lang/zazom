'use client'

import { useState } from 'react'
import { Plus, Minus, RotateCcw, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Log {
  id: string
  type: 'in' | 'out'
  product: string
  quantity: number
  price: number
  total: number
  date: string
}

export function Calculator({
  logs,
  setLogs,
}: {
  logs: Log[]
  setLogs: (logs: Log[]) => void
}) {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [isNewValue, setIsNewValue] = useState(true)
  const [logForm, setLogForm] = useState({
    type: 'in' as 'in' | 'out',
    product: '',
    quantity: 0,
    price: 0,
  })

  const handleNumber = (num: string) => {
    if (isNewValue) {
      setDisplay(num)
      setIsNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(currentValue)
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(result.toString())
      setPrevValue(result)
    }

    setOperation(op)
    setIsNewValue(true)
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return prev / current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const result = calculate(prevValue, parseFloat(display), operation)
      setDisplay(result.toString())
      setPrevValue(null)
      setOperation(null)
      setIsNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setIsNewValue(true)
  }

  const handleSaveToLog = () => {
    if (logForm.product && logForm.quantity > 0 && logForm.price > 0) {
      const newLog: Log = {
        id: Date.now().toString(),
        ...logForm,
        total: logForm.quantity * logForm.price,
        date: new Date().toISOString(),
      }
      setLogs([...logs, newLog])
      setLogForm({ type: 'in', product: '', quantity: 0, price: 0 })
      setDisplay('0')
      handleClear()
    }
  }

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id))
  }

  const handleExport = () => {
    const csv = [
      ['النوع', 'المنتج', 'الكمية', 'السعر', 'الإجمالي', 'التاريخ'].join(','),
      ...logs.map((log) =>
        [
          log.type === 'in' ? 'إدخال' : 'إخراج',
          log.product,
          log.quantity,
          log.price,
          log.total,
          new Date(log.date).toLocaleString('ar-EG'),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `inventory-log-${new Date().toLocaleDateString('ar-EG')}.csv`)
    link.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">حاسبة</h2>
          <p className="text-muted-foreground">أداة حساب سريعة</p>
        </div>

        <div className="glass p-6 rounded-xl space-y-4">
          <div className="bg-black/40 rounded-lg p-4 text-right">
            <p className="text-4xl font-bold text-primary break-words">{display}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[7, 8, 9, '/'].map((btn) => (
              <button
                key={btn}
                onClick={() => (typeof btn === 'number' ? handleNumber(btn.toString()) : handleOperation(btn.toString()))}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
              >
                {btn}
              </button>
            ))}
            {[4, 5, 6, '*'].map((btn) => (
              <button
                key={btn}
                onClick={() => (typeof btn === 'number' ? handleNumber(btn.toString()) : handleOperation(btn.toString()))}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
              >
                {btn}
              </button>
            ))}
            {[1, 2, 3, '-'].map((btn) => (
              <button
                key={btn}
                onClick={() => (typeof btn === 'number' ? handleNumber(btn.toString()) : handleOperation(btn.toString()))}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
              >
                {btn}
              </button>
            ))}
            {[0, '.', '=', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') handleEquals()
                  else if (btn === '.') handleNumber('.')
                  else if (typeof btn === 'number') handleNumber(btn.toString())
                  else handleOperation(btn.toString())
                }}
                className={`p-3 rounded-lg font-semibold transition-colors ${
                  btn === '=' ? 'bg-primary text-primary-foreground hover:bg-primary/90 col-span-2' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          <Button onClick={handleClear} variant="destructive" className="w-full gap-2">
            <RotateCcw size={18} />
            مسح
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="glass p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold">حفظ العملية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={logForm.type}
              onChange={(e) => setLogForm({ ...logForm, type: e.target.value as 'in' | 'out' })}
              className="bg-white/10 border border-border rounded-lg px-4 py-2"
            >
              <option value="in">إدخال</option>
              <option value="out">إخراج</option>
            </select>
            <Input
              placeholder="اسم المنتج"
              value={logForm.product}
              onChange={(e) => setLogForm({ ...logForm, product: e.target.value })}
            />
            <Input
              type="number"
              placeholder="الكمية"
              value={logForm.quantity}
              onChange={(e) => setLogForm({ ...logForm, quantity: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="السعر"
              value={logForm.price}
              onChange={(e) => setLogForm({ ...logForm, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          {logForm.product && logForm.quantity > 0 && logForm.price > 0 && (
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">الإجمالي:</p>
              <p className="text-2xl font-bold text-primary">{(logForm.quantity * logForm.price).toLocaleString('ar-EG')} ج.م</p>
            </div>
          )}
          <Button onClick={handleSaveToLog} className="w-full gap-2 bg-yellow-400 text-black hover:bg-yellow-500">
            <Plus size={18} />
            حفظ العملية
          </Button>
        </div>

        <div className="glass p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">سجل العمليات</h3>
            {logs.length > 0 && (
              <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                تصدير CSV
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {log.type === 'in' ? (
                      <Plus className="text-secondary" size={18} />
                    ) : (
                      <Minus className="text-destructive" size={18} />
                    )}
                    <span className="font-semibold">{log.product}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleString('ar-EG')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.quantity} × {log.price} = {log.total.toLocaleString('ar-EG')} ج.م
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">لا توجد عمليات حتى الآن</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
