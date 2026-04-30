import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react'

export function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    barcode: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        barcode: formData.barcode,
      })
      setEditingId(null)
    } else {
      addProduct({
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        barcode: formData.barcode,
      })
    }
    setFormData({ name: '', price: '', category: '', stock: '', barcode: '' })
    setShowForm(false)
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      barcode: product.barcode || '',
    })
    setShowForm(true)
  }

  const lowStockProducts = products.filter(p => p.stock < 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">إدارة المخزون</h1>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({ name: '', price: '', category: '', stock: '', barcode: '' })
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            إضافة منتج
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="text-orange-400" size={20} />
              <h3 className="text-lg font-semibold text-orange-300">تنبيهات المخزون المنخفض</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="text-sm text-orange-200">
                  • {product.name}: {product.stock} وحدة فقط
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم المنتج"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                required
              />
              <input
                type="number"
                placeholder="السعر"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="الفئة"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                required
              />
              <input
                type="number"
                placeholder="الكمية"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                required
              />
              <input
                type="text"
                placeholder="الباركود (اختياري)"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="px-6 py-4 text-right text-white font-semibold">المنتج</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">الفئة</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">السعر</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">المخزون</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{product.name}</td>
                    <td className="px-6 py-4 text-slate-300">{product.category}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">{product.price.toFixed(2)} ج.م</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 10
                          ? 'bg-green-500/30 text-green-300'
                          : product.stock > 0
                          ? 'bg-orange-500/30 text-orange-300'
                          : 'bg-red-500/30 text-red-300'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
