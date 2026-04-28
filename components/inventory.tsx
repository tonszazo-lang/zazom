'use client'

import { useState } from 'react'
import { Trash2, Edit2, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  quantity: number
  price: number
}

export function Inventory({
  products,
  setProducts,
}: {
  products: Product[]
  setProducts: (products: Product[]) => void
}) {
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ name: '', quantity: 0, price: 0 })

  const filtered = products.filter((p) => p.name.includes(search))

  const handleAdd = () => {
    if (formData.name && formData.quantity >= 0 && formData.price >= 0) {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
      }
      setProducts([...products, newProduct])
      setFormData({ name: '', quantity: 0, price: 0 })
      setIsAdding(false)
    }
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleUpdate = (id: string, field: string, value: any) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">إدارة المخزون</h2>
        <p className="text-muted-foreground">إضافة وتعديل المنتجات في مخزونك</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="ابحث عن المنتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
        </div>

        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2 bg-yellow-400 text-black hover:bg-yellow-500">
          <Plus size={20} />
          إضافة منتج جديد
        </Button>

        {isAdding && (
          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="font-semibold text-lg">إضافة منتج جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="اسم المنتج"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="الكمية"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="السعر"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="btn-accent">
                حفظ
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold">اسم المنتج</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">الكمية</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">السعر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">الإجمالي</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleUpdate(product.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleUpdate(product.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">
                    {(product.quantity * product.price).toLocaleString('ar-EG')} ج.م
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {products.length === 0 ? 'لا توجد منتجات حتى الآن' : 'لم يتم العثور على منتجات'}
          </div>
        )}
      </div>
    </div>
  )
}
