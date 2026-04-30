import React, { useMemo } from 'react'
import { useStore } from '@/store/StoreContext'
import { TrendingUp, Package, ShoppingCart, AlertCircle } from 'lucide-react'

export function LiveSummary() {
  const { products, invoices, purchases, cart, dailyReports } = useStore()

  const stats = useMemo(() => {
    const totalProducts = products.length
    const lowStockProducts = products.filter(p => p.stock < 5).length
    const totalInvoices = invoices.length
    const todaySales = dailyReports[dailyReports.length - 1]?.revenue || 0
    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

    return {
      totalProducts,
      lowStockProducts,
      totalInvoices,
      todaySales,
      cartTotal,
      totalStock,
    }
  }, [products, invoices, cart, dailyReports])

  const summaryItems = [
    {
      label: 'المنتجات',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-900/20 border-blue-500/30',
      textColor: 'text-blue-400'
    },
    {
      label: 'المخزون',
      value: stats.totalStock,
      icon: ShoppingCart,
      color: 'bg-green-900/20 border-green-500/30',
      textColor: 'text-green-400'
    },
    {
      label: 'مبيعات اليوم',
      value: `${stats.todaySales.toFixed(2)} ريال`,
      icon: TrendingUp,
      color: 'bg-purple-900/20 border-purple-500/30',
      textColor: 'text-purple-400'
    },
    {
      label: 'منتجات قليلة',
      value: stats.lowStockProducts,
      icon: AlertCircle,
      color: 'bg-red-900/20 border-red-500/30',
      textColor: 'text-red-400',
      highlight: stats.lowStockProducts > 0
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className={`${item.color} border rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">{item.label}</div>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
            </div>
            <item.icon size={24} className={item.textColor} />
          </div>
          {item.highlight && (
            <div className="mt-2 text-xs text-red-400 bg-red-900/30 rounded px-2 py-1">
              تنبيه: منتجات قليلة الكمية
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
