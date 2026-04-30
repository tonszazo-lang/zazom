import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { useNotification } from '@/store/NotificationContext'
import { Search, Trash2, Plus, Minus, Check, X } from 'lucide-react'

export function POS() {
  const { products, cart, addToCart, removeFromCart, updateCartItem, createInvoice, currency } = useStore()
  const { addNotification } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [taxPercent, setTaxPercent] = useState(currency.taxRate * 100)
  const [paymentMethod, setPaymentMethod] = useState('نقد')
  const [customerName, setCustomerName] = useState('')

  const filteredProducts = products.filter(p =>
    p.name.includes(searchTerm) && p.stock > 0
  )

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = subtotal * (taxPercent / 100)
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) {
      addNotification('السلة فارغة! أضف منتجات أولاً', 'warning')
      return
    }
    createInvoice(cart, tax, paymentMethod, customerName)
    addNotification(`تم إنشاء فاتورة جديدة بقيمة ${total.toFixed(2)} ${currency.symbol}`, 'success')
    setCustomerName('')
    setPaymentMethod('نقد')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">نقطة البيع</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 backdrop-blur-sm"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => addToCart(product, 1)}
                  inCart={cart.some(item => item.product.id === product.id)}
                />
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">السلة</h2>

            {cart.length === 0 ? (
              <p className="text-slate-400 text-center py-8">السلة فارغة</p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <CartItemComponent
                      key={item.product.id}
                      item={item}
                      onRemove={() => removeFromCart(item.product.id)}
                      onUpdateQuantity={(qty) => updateCartItem(item.product.id, qty)}
                    />
                  ))}
                </div>

                <div className="border-t border-white/20 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>الإجمالي قبل الضريبة</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>الضريبة ({taxPercent}%)</span>
                    <span>{tax.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>الإجمالي</span>
                    <span>{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="اسم العميل (اختياري)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  >
                    <option>نقد</option>
                    <option>بطاقة</option>
                    <option>تحويل</option>
                    <option>بدون دفع</option>
                  </select>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  إتمام الشراء
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({
  product,
  onAdd,
  inCart,
}: {
  product: any
  onAdd: () => void
  inCart: boolean
}) {
  return (
    <div
      onClick={onAdd}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-blue-500/50 group"
    >
      <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
        <div className="text-4xl">📦</div>
      </div>
      <h3 className="font-medium text-white text-sm truncate">{product.name}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-green-400">{product.price.toFixed(2)}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          product.stock > 10 ? 'bg-green-500/30 text-green-300' : 'bg-orange-500/30 text-orange-300'
        }`}>
          {product.stock}
        </span>
      </div>
      {inCart && (
        <div className="mt-2 text-xs text-blue-400 text-center">في السلة</div>
      )}
    </div>
  )
}

function CartItemComponent({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: any
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-white text-sm font-medium truncate">{item.product.name}</h4>
        <p className="text-slate-400 text-xs">{(item.product.price * item.quantity).toFixed(2)} ج.م</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <Minus size={14} className="text-slate-400" />
        </button>
        <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.quantity + 1)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <Plus size={14} className="text-slate-400" />
        </button>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-red-500/20 rounded transition-colors ml-2"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </div>
  )
}
