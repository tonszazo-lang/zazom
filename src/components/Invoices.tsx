import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { FileText, Download, CheckCircle, Clock } from 'lucide-react'

export function Invoices() {
  const { invoices, markInvoiceAsPaid } = useStore()
  const [filter, setFilter] = useState('all')

  const filteredInvoices = filter === 'paid' 
    ? invoices.filter(inv => inv.paid)
    : filter === 'unpaid'
    ? invoices.filter(inv => !inv.paid)
    : invoices

  const handlePrintInvoice = (invoice: any) => {
    const content = `
      فاتورة رقم: ${invoice.id}
      التاريخ: ${new Date(invoice.date).toLocaleDateString('ar-EG')}
      
      العميل: ${invoice.customerName || 'بدون اسم'}
      طريقة الدفع: ${invoice.paymentMethod}
      
      ${invoice.items.map(item => `
        ${item.product.name}
        الكمية: ${item.quantity}
        السعر: ${item.product.price.toFixed(2)} ج.م
        الإجمالي: ${(item.product.price * item.quantity).toFixed(2)} ج.م
      `).join('\n')}
      
      الإجمالي قبل الضريبة: ${invoice.subtotal.toFixed(2)} ج.م
      الضريبة: ${invoice.tax.toFixed(2)} ج.م
      الإجمالي: ${invoice.total.toFixed(2)} ج.م
      الحالة: ${invoice.paid ? 'مدفوعة' : 'غير مدفوعة'}
    `
    window.print()
  }

  const handleExportCSV = () => {
    let csv = 'رقم الفاتورة,التاريخ,الإجمالي,الحالة,اسم العميل\n'
    invoices.forEach(invoice => {
      csv += `${invoice.id},${new Date(invoice.date).toLocaleDateString('ar-EG')},${invoice.total.toFixed(2)},${invoice.paid ? 'مدفوعة' : 'غير مدفوعة'},${invoice.customerName || ''}\n`
    })
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'invoices.csv')
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">الفواتير</h1>
          <button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            <Download size={20} />
            تصدير CSV
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { label: 'جميع الفواتير', value: 'all' },
            { label: 'مدفوعة', value: 'paid' },
            { label: 'غير مدفوعة', value: 'unpaid' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Invoices Grid */}
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="mx-auto mb-4 opacity-50" size={48} />
              <p>لا توجد فواتير</p>
            </div>
          ) : (
            filteredInvoices.map(invoice => (
              <div
                key={invoice.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="grid md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">رقم الفاتورة</p>
                    <p className="text-white font-bold">{invoice.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">التاريخ</p>
                    <p className="text-white">{new Date(invoice.date).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">الإجمالي</p>
                    <p className="text-green-400 font-bold text-lg">{invoice.total.toFixed(2)} ج.م</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">الحالة</p>
                    <div className="flex items-center gap-2 mt-1">
                      {invoice.paid ? (
                        <>
                          <CheckCircle className="text-green-400" size={18} />
                          <span className="text-green-400 font-medium">مدفوعة</span>
                        </>
                      ) : (
                        <>
                          <Clock className="text-orange-400" size={18} />
                          <span className="text-orange-400 font-medium">معلقة</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <button
                      onClick={() => handlePrintInvoice(invoice)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors text-sm"
                    >
                      طباعة
                    </button>
                    {!invoice.paid && (
                      <button
                        onClick={() => markInvoiceAsPaid(invoice.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors text-sm"
                      >
                        تحديد مدفوعة
                      </button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">العناصر:</h4>
                  <div className="space-y-2">
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-slate-300">
                        <span>{item.product.name}</span>
                        <span>{item.quantity}x {item.product.price.toFixed(2)} = {(item.product.price * item.quantity).toFixed(2)} ج.م</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
