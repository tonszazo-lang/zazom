import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { useNotification } from '@/store/NotificationContext'
import { Plus, Minus, RotateCcw, Send } from 'lucide-react'

export function SmartCalculator() {
  const { products, cart, addToCart } = useStore()
  const { addNotification } = useNotification()
  const [display, setDisplay] = useState('0')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleNumberClick = (num: string) => {
    if (display === '0') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedProductId) {
      addNotification('اختر منتج أولاً', 'warning')
      return
    }

    const product = products.find(p => p.id === selectedProductId)
    if (!product) {
      addNotification('المنتج غير موجود', 'error')
      return
    }

    const qty = parseInt(display) || quantity
    if (qty <= 0) {
      addNotification('الكمية يجب أن تكون أكبر من صفر', 'warning')
      return
    }

    if (qty > product.stock) {
      addNotification(`المخزون غير كافي! المتوفر: ${product.stock}`, 'error')
      return
    }

    addToCart(product, qty)
    addNotification(`تم إضافة ${qty} ${product.name} إلى السلة`, 'success')
    handleClear()
    setSelectedProductId('')
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const buttons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'C'],
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">الحاسبة الذكية</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculator */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            {/* Display */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-6 text-right">
              <div className="text-sm text-slate-400 mb-2">الكمية</div>
              <div className="text-4xl font-bold text-white font-mono">{display}</div>
            </div>

            {/* Number Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {buttons.map((row, i) => (
                <div key={i} className="contents">
                  {row.map(btn => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === 'C') handleClear()
                        else if (btn === '.') handleDecimal()
                        else handleNumberClick(btn)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBackspace}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <Minus size={18} />
                مسح
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                إضافة
              </button>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">اختر المنتج</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProductId(product.id)
                    setDisplay('1')
                  }}
                  className={`w-full text-right p-4 rounded-lg transition-all duration-200 ${
                    selectedProductId === product.id
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={product.stock === 0}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{product.name}</div>
                      <div className="text-xs text-slate-400">
                        السعر: {product.price} ريال | المتوفر: {product.stock}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                لا توجد منتجات متاحة
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
