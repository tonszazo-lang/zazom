import React from 'react'
import { useStore } from '@/store/StoreContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'

export function Reports() {
  const { dailyReports, invoices } = useStore()

  const totalRevenue = dailyReports.reduce((sum, r) => sum + r.revenue, 0)
  const totalProfit = dailyReports.reduce((sum, r) => sum + r.profit, 0)
  const totalExpenses = dailyReports.reduce((sum, r) => sum + r.expenses, 0)
  const totalSales = dailyReports.reduce((sum, r) => sum + r.salesCount, 0)

  const last7Days = dailyReports.slice(-7)
  const chartData = last7Days.map(report => ({
    date: new Date(report.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
    revenue: report.revenue,
    profit: report.profit,
    expenses: report.expenses,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">التقارير والإحصائيات</h1>

        {/* Top Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            label="إجمالي الإيرادات"
            value={`${totalRevenue.toFixed(2)} ج.م`}
            color="from-blue-500/20 to-cyan-500/20"
            borderColor="border-blue-500/30"
          />
          <StatCard
            icon={TrendingUp}
            label="إجمالي الأرباح"
            value={`${totalProfit.toFixed(2)} ج.م`}
            color="from-green-500/20 to-emerald-500/20"
            borderColor="border-green-500/30"
          />
          <StatCard
            icon={ShoppingCart}
            label="عدد المبيعات"
            value={totalSales}
            color="from-orange-500/20 to-red-500/20"
            borderColor="border-orange-500/30"
          />
          <StatCard
            icon={DollarSign}
            label="إجمالي النفقات"
            value={`${totalExpenses.toFixed(2)} ج.م`}
            color="from-purple-500/20 to-pink-500/20"
            borderColor="border-purple-500/30"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">الإيرادات والأرباح</h2>
            {chartData.length === 0 ? (
              <p className="text-slate-400 text-center py-8">لا توجد بيانات</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات" />
                  <Bar dataKey="profit" fill="#10b981" name="الأرباح" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Trend Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">اتجاه النفقات</h2>
            {chartData.length === 0 ? (
              <p className="text-slate-400 text-center py-8">لا توجد بيانات</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#a855f7"
                    name="النفقات"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">ملخص الأيام</h2>
          {dailyReports.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-4 text-right text-white font-semibold">التاريخ</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">الإيرادات</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">النفقات</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">الأرباح</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">عدد المبيعات</th>
                  </tr>
                </thead>
                <tbody>
                  {[...dailyReports].reverse().map((report, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">
                        {new Date(report.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 text-blue-400 font-semibold">
                        {report.revenue.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 text-orange-400 font-semibold">
                        {report.expenses.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 text-green-400 font-semibold">
                        {report.profit.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 text-purple-400 font-semibold">
                        {report.salesCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  borderColor,
}: {
  icon: React.ComponentType<any>
  label: string
  value: string | number
  color: string
  borderColor: string
}) {
  return (
    <div className={`bg-gradient-to-br ${color} border ${borderColor} rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300 text-sm font-medium">{label}</h3>
        <Icon className="text-white/60" size={24} />
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
