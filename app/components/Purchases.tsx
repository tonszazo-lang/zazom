'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { Plus, Trash2, Search } from 'lucide-react'

export function Purchases() {
  const { purchases, products, addPurchase, deletePurchase } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    supplier: '',
    items: [{ productId: '', quantity: 0, unitPrice: 0 }],
    notes: ''
  })

  const filteredPurchases = purchases.filter(p =>
    p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 0, unitPrice: 0 }]
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.supplier && formData.items.length > 0) {
      const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      
      const itemsWithNames = formData.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          ...item,
          productName: product?.name || 'منتج غير معروف'
        }
      })

      addPurchase({
        date: new Date().toISOString(),
        supplier: formData.supplier,
        items: itemsWithNames,
        total,
        notes: formData.notes
      })

      setFormData({
        supplier: '',
        items: [{ productId: '', quantity: 0, unitPrice: 0 }],
        notes: ''
      })
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">المشتريات</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            عملية شراء جديدة
          </button>
        </div>

        {/* Add Purchase Form */}
        {isAdding && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">المورد</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="اسم المورد"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-white font-medium">المنتجات</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} />
                    إضافة منتج
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">اختر منتج</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      placeholder="الكمية"
                    />

                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                      className="bg-slate-700 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      placeholder="السعر للوحدة"
                      step="0.01"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-white mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  حفظ عملية الشراء
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن مورد..."
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{purchase.supplier}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(purchase.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <button
                  onClick={() => deletePurchase(purchase.id)}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {purchase.items.map((item, idx) => (
                  <div key={idx} className="text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>{item.productName}</span>
                      <span className="text-blue-400">{item.quantity} × {item.unitPrice}</span>
                    </div>
                  </div>
                ))}
              </div>

              {purchase.notes && (
                <p className="text-sm text-slate-400 mb-3 italic">{purchase.notes}</p>
              )}

              <div className="pt-3 border-t border-white/10">
                <p className="text-lg font-bold text-white">
                  الإجمالي: {purchase.total.toFixed(2)} ريال
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredPurchases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">لا توجد عمليات شراء</p>
          </div>
        )}
      </div>
    </div>
  )
}
