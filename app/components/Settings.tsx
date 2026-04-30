'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { useNotification } from '@/store/NotificationContext'
import { AlertTriangle, Settings as SettingsIcon } from 'lucide-react'

export function Settings() {
  const { currency, resetAllData, products, invoices, purchases, productions, consumptions } = useStore()
  const { addNotification } = useNotification()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleResetData = () => {
    resetAllData()
    setShowConfirmReset(false)
    addNotification('تم مسح جميع البيانات بنجاح', 'warning')
  }

  const totalItems = products.length + invoices.length + purchases.length + productions.length + consumptions.length

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <SettingsIcon size={40} />
          الإعدادات
        </h1>
        <p className="text-slate-400">إدارة إعدادات النظام والبيانات</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Currency Setting */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">العملة</h2>
          <div className="bg-slate-700 rounded p-4">
            <p className="text-yellow-400 font-bold text-2xl mb-2">{currency.symbol}</p>
            <p className="text-white font-semibold mb-1">{currency.name}</p>
            <p className="text-slate-300 text-sm mb-3">رمز العملة: {currency.code}</p>
            <p className="text-slate-300 text-sm">ضريبة القيمة المضافة: {(currency.taxRate * 100).toFixed(0)}%</p>
          </div>
          <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-300 text-sm">
            ✓ جميع العمليات الحسابية بالجنيه المصري
          </div>
        </div>

        {/* Data Statistics */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">إحصائيات البيانات</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
              <span className="text-slate-300">المنتجات</span>
              <span className="text-blue-400 font-bold">{products.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
              <span className="text-slate-300">الفواتير</span>
              <span className="text-green-400 font-bold">{invoices.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
              <span className="text-slate-300">المشتريات</span>
              <span className="text-yellow-400 font-bold">{purchases.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
              <span className="text-slate-300">الإنتاج</span>
              <span className="text-purple-400 font-bold">{productions.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
              <span className="text-slate-300">الاستهلاك</span>
              <span className="text-red-400 font-bold">{consumptions.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-600 rounded border border-slate-500">
              <span className="text-white font-semibold">الإجمالي</span>
              <span className="text-white font-bold text-lg">{totalItems}</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">معلومات النظام</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-400">الإصدار</p>
              <p className="text-white font-semibold">4.0 - Smart Integration</p>
            </div>
            <div>
              <p className="text-slate-400">نوع التخزين</p>
              <p className="text-white font-semibold">localStorage</p>
            </div>
            <div>
              <p className="text-slate-400">اللغة</p>
              <p className="text-white font-semibold">العربية (RTL)</p>
            </div>
            <div>
              <p className="text-slate-400">الحالة</p>
              <p className="text-green-400 font-semibold">✓ جاهز للعمل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="mt-8 bg-red-900/30 border border-red-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={28} />
          <h2 className="text-2xl font-bold text-red-400">حذف جميع البيانات</h2>
        </div>

        <p className="text-slate-300 mb-6">
          هذا سيحذف جميع البيانات المحفوظة بشكل نهائي ولا يمكن استرجاعها. يرجى التأكد قبل المتابعة.
        </p>

        {!showConfirmReset && (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            حذف جميع البيانات
          </button>
        )}

        {showConfirmReset && (
          <div className="bg-slate-800 p-4 rounded-lg border border-red-500">
            <p className="text-white font-semibold mb-4">هل أنت متأكد من حذف جميع البيانات؟</p>
            <div className="flex gap-4">
              <button
                onClick={handleResetData}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                نعم، احذف الآن
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
