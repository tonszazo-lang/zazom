'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { Plus, Trash2, Check, Clock, X } from 'lucide-react'

export function Production() {
  const { productions, products, addProduction, updateProduction, deleteProduction } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantityProduced: 0,
    notes: ''
  })
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')

  const filteredProductions = productions.filter(p => {
    if (filterStatus === 'all') return true
    return p.status === filterStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.productId && formData.quantityProduced > 0) {
      const product = products.find(p => p.id === formData.productId)
      if (product) {
        addProduction({
          date: new Date().toISOString(),
          productId: formData.productId,
          productName: product.name,
          quantityProduced: formData.quantityProduced,
          status: 'pending',
          notes: formData.notes
        })

        setFormData({
          productId: '',
          quantityProduced: 0,
          notes: ''
        })
        setIsAdding(false)
      }
    }
  }

  const handleStatusChange = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    updateProduction(id, { status })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-400" size={18} />
      case 'cancelled':
        return <X className="text-red-400" size={18} />
      default:
        return <Clock className="text-yellow-400" size={18} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-300'
      case 'cancelled':
        return 'bg-red-600/20 text-red-300'
      default:
        return 'bg-yellow-600/20 text-yellow-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">الإنتاج</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            عملية إنتاج جديدة
          </button>
        </div>

        {/* Add Production Form */}
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
                  <label className="block text-white mb-2">كمية الإنتاج</label>
                  <input
                    type="number"
                    value={formData.quantityProduced}
                    onChange={(e) => setFormData({ ...formData, quantityProduced: parseInt(e.target.value) })}
                    className="w-full bg-slate-700 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="عدد الوحدات"
                  />
                </div>
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
                  حفظ عملية الإنتاج
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

        {/* Status Filter */}
        <div className="flex gap-3 mb-6">
          {['all', 'pending', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'الكل' : status === 'pending' ? 'قيد الانتظار' : status === 'completed' ? 'مكتمل' : 'ملغي'}
            </button>
          ))}
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductions.map(production => (
            <div key={production.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{production.productName}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(production.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(production.status)}`}>
                  {getStatusIcon(production.status)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">الكمية المنتجة</p>
                  <p className="text-2xl font-bold text-blue-400">{production.quantityProduced} وحدة</p>
                </div>

                {production.notes && (
                  <p className="text-sm text-slate-400 italic">{production.notes}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex gap-2">
                  {production.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(production.id, 'completed')}
                      className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      تم الانتهاء
                    </button>
                  )}
                  {production.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(production.id, 'cancelled')}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
                <button
                  onClick={() => deleteProduction(production.id)}
                  className="w-full bg-slate-700/50 hover:bg-red-600/20 text-slate-300 hover:text-red-400 px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProductions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">لا توجد عمليات إنتاج</p>
          </div>
        )}
      </div>
    </div>
  )
}
