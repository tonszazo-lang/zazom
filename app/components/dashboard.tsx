'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, AlertCircle, Package } from 'lucide-react'

interface InventoryData {
  products: Array<{ id: string; name: string; quantity: number; price: number }>
  logs: Array<{ date: string; total: number }>
}

export function Dashboard({ data }: { data: InventoryData }) {
  const [stats, setStats] = useState({
    totalValue: 0,
    todayOps: 0,
    lowStock: 0,
    totalProducts: 0,
  })

  useEffect(() => {
    const totalValue = data.products.reduce((sum, p) => sum + p.quantity * p.price, 0)
    const todayOps = data.logs.filter((log) => {
      const logDate = new Date(log.date).toLocaleDateString()
      return logDate === new Date().toLocaleDateString()
    }).length
    const lowStock = data.products.filter((p) => p.quantity < 5).length

    setStats({
      totalValue,
      todayOps,
      lowStock,
      totalProducts: data.products.length,
    })
  }, [data])

  const chartData = data.logs.slice(-7).map((log) => ({
    date: new Date(log.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
    value: log.total,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">لوحة التحكم</h2>
        <p className="text-muted-foreground">نظرة عامة على حالة مخزونك الحالية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي قيمة المخزون</p>
              <p className="text-2xl font-bold">{stats.totalValue.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <DollarSign className="text-primary" size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">عمليات اليوم</p>
              <p className="text-2xl font-bold">{stats.todayOps}</p>
            </div>
            <TrendingUp className="text-secondary" size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">منتجات بمخزون منخفض</p>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
            <AlertCircle className="text-destructive" size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="text-accent" size={32} />
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">اتجاه المبيعات (7 أيام)</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(59 100% 50%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(59 100% 50%)', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            لا توجد بيانات متاحة حتى الآن
          </div>
        )}
      </div>
    </div>
  )
}
