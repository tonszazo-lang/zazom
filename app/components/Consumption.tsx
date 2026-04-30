'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { Plus, Trash2, Search } from 'lucide-react'

const CONSUMPTION_REASONS = [
  'تلف وفساد',
  'استخدام في المتجر',
  'عينة مجانية',
  'رصيد جرد',
  'خسارة',
  'أخرى'
]

export function Consumption() {
  const { consumptions, products, addConsumption, deleteConsumption } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    productId: '',
    quantityConsumed: 0,
    reason: '',
    notes: ''
  })

  const filteredConsumptions = consumptions.filter(c =>
    c.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.productId && formData.quantityConsumed > 0 && formData.reason) {
      const product = products.find(p => p.id === formData.productId)
      if (product) {
        addConsumption({
          date: new Date().toISOString(),
          productId: formData.productId,
          productName: product.name,
          quantityConsumed: formData.quantityConsumed,
          reason: formData.reason,
          notes: formData.notes
        })

        setFormData({
          productId: '',
          quantityConsumed: 0,
          reason: '',
          notes: ''
        })
        setIsAdding(false)
      }
    }
  }

  const getReasonBadgeColor = (reason: string) => {
    const colorMap: Record<string, string> = {
      'تلف وفساد': 'bg-red-600/20 text-red-300',
      'استخدام في المتجر': 'bg-orange-600/20 text-orange-300',
      'عينة مجانية': 'bg-purple-600/20 text-purple-300',
      'رصيد جرد': 'bg-blue-600/20 text-blue-300',
      'خسارة': 'bg-red-600/20 text-red-300',
      'أخرى': 'bg-slate-600/20 text-slate-300'
    }
    return colorMap[reason] || 'bg-slate-600/20 text-slate-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">الاستهلاك والاهلاك</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            تسجيل استهلاك جديد
          </button>
        </div>

        {/* Add Consumption Form */}
        {isAdding && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">المنتج</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">اختر منتج</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">الكمية المستهلكة</label>
                  <input
                    type="number"
                    value={formData.quantityConsumed}
                    onChange={(e) => setFormData({ ...formData, quantityConsumed: parseInt(e.target.value) })}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="عدد الوحدات"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">السبب</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">اختر السبب</option>
                  {CONSUMPTION_REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">ملاحظات إضافية</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="ملاحظات اختيارية"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  حفظ الاستهلاك
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
            placeholder="ابحث عن منتج..."
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsumptions.map(consumption => (
            <div key={consumption.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{consumption.productName}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(consumption.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <button
                  onClick={() => deleteConsumption(consumption.id)}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">الكمية المستهلكة</p>
                  <p className="text-2xl font-bold text-red-400">{consumption.quantityConsumed} وحدة</p>
                </div>

                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getReasonBadgeColor(consumption.reason)}`}>
                    {consumption.reason}
                  </span>
                </div>

                {consumption.notes && (
                  <p className="text-sm text-slate-400 italic">{consumption.notes}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-slate-500">المعرّف: {consumption.id}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredConsumptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">لا توجد عمليات استهلاك</p>
          </div>
        )}
      </div>
    </div>
  )
}
