import React from 'react'
import { useStore } from '@/store/StoreContext'
import { ShoppingCart, Package, FileText, BarChart3, AlertCircle } from 'lucide-react'
import { LiveSummary } from './LiveSummary'

export function Dashboard() {
  const { cart, dailyReports, products, setSelectedTab, invoices } = useStore()

  const today = new Date().toISOString().split('T')[0]
  const todayReport = dailyReports.find(r => r.date === today)

  const lowStockProducts = products.filter(p => p.stock < 10)
  const totalRevenue = dailyReports.reduce((sum, r) => sum + r.revenue, 0)
  const totalProfit = dailyReports.reduce((sum, r) => sum + r.profit, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-slate-400">مرحباً بك في نظام إدارة نقاط البيع</p>
        </div>

        {/* Live Summary */}
        <div className="mb-8">
          <LiveSummary />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={ShoppingCart}
            label="نقطة البيع"
            value={cart.length}
            onClick={() => setSelectedTab('pos')}
            color="from-blue-500 to-cyan-500"
          />
          <QuickAction
            icon={Package}
            label="المخزون"
            value={products.length}
            onClick={() => setSelectedTab('inventory')}
            color="from-purple-500 to-pink-500"
          />
          <QuickAction
            icon={FileText}
            label="الفواتير"
            value={invoices.length}
            onClick={() => setSelectedTab('invoices')}
            color="from-orange-500 to-red-500"
          />
          <QuickAction
            icon={BarChart3}
            label="التقارير"
            value={dailyReports.length}
            onClick={() => setSelectedTab('reports')}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="إيرادات اليوم"
            value={`${todayReport?.revenue.toFixed(2) || '0'} ج.م`}
            icon={ShoppingCart}
            color="from-blue-500/20 to-cyan-500/20"
            borderColor="border-blue-500/30"
          />
          <StatCard
            title="الربح اليومي"
            value={`${todayReport?.profit.toFixed(2) || '0'} ج.م`}
            icon={BarChart3}
            color="from-green-500/20 to-emerald-500/20"
            borderColor="border-green-500/30"
          />
          <StatCard
            title="إجمالي الإيرادات"
            value={`${totalRevenue.toFixed(2)} ج.م`}
            icon={FileText}
            color="from-orange-500/20 to-red-500/20"
            borderColor="border-orange-500/30"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="text-red-400" size={20} />
              <h3 className="text-lg font-semibold text-red-300">تنبيهات المخزون</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="text-sm text-red-200">
                  • {product.name}: {product.stock} وحدة فقط
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Invoices */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">آخر الفواتير</h2>
          {invoices.length === 0 ? (
            <p className="text-slate-400">لا توجد فواتير بعد</p>
          ) : (
            <div className="space-y-2">
              {invoices.slice(-5).reverse().map(invoice => (
                <div key={invoice.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white font-medium">{invoice.id}</span>
                  <span className="text-green-400">{invoice.total.toFixed(2)} ج.م</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  value,
  onClick,
  color,
}: {
  icon: React.ComponentType<any>
  label: string
  value: number | string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${color} p-4 rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer group`}
    >
      <Icon className="text-white mb-2 group-hover:scale-110 transition-transform" size={24} />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
    </button>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  borderColor,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color: string
  borderColor: string
}) {
  return (
    <div className={`bg-gradient-to-br ${color} border ${borderColor} rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
        <Icon className="text-white/60" size={24} />
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
