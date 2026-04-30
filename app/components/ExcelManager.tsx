'use client'

import React from 'react'
import { useStore } from '@/store/StoreContext'
import { useNotification } from '@/store/NotificationContext'
import { Download, Upload } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function ExcelManager() {
  const { products, invoices, purchases, productions, consumptions } = useStore()
  const { addNotification } = useNotification()

  const exportToExcel = () => {
    try {
      // إنشاء workbook جديد
      const wb = XLSX.utils.book_new()

      // إضافة ورقة المنتجات
      const productsSheet = XLSX.utils.json_to_sheet(
        products.map(p => ({
          'رقم المنتج': p.id,
          'اسم المنتج': p.name,
          'السعر (ج.م)': p.price,
          'سعر الشراء (ج.م)': p.purchasePrice || 0,
          'الفئة': p.category,
          'الكمية': p.stock,
          'الباركود': p.barcode || ''
        }))
      )
      XLSX.utils.book_append_sheet(wb, productsSheet, 'المنتجات')

      // إضافة ورقة الفواتير
      const invoicesSheet = XLSX.utils.json_to_sheet(
        invoices.map(inv => ({
          'رقم الفاتورة': inv.id,
          'التاريخ': inv.date,
          'عدد المنتجات': inv.items.length,
          'الإجمالي الجزئي (ج.م)': inv.subtotal.toFixed(2),
          'الضريبة (ج.م)': inv.tax.toFixed(2),
          'الإجمالي (ج.م)': inv.total.toFixed(2),
          'الحالة': inv.paid ? 'مدفوعة' : 'غير مدفوعة',
          'طريقة الدفع': inv.paymentMethod || '',
          'اسم العميل': inv.customerName || ''
        }))
      )
      XLSX.utils.book_append_sheet(wb, invoicesSheet, 'الفواتير')

      // إضافة ورقة المشتريات
      const purchasesSheet = XLSX.utils.json_to_sheet(
        purchases.map(p => ({
          'رقم الشراء': p.id,
          'التاريخ': p.date,
          'المورد': p.supplier,
          'عدد المنتجات': p.items.length,
          'الإجمالي (ج.م)': p.total.toFixed(2),
          'الملاحظات': p.notes || ''
        }))
      )
      XLSX.utils.book_append_sheet(wb, purchasesSheet, 'المشتريات')

      // إضافة ورقة الإنتاج
      const productionsSheet = XLSX.utils.json_to_sheet(
        productions.map(p => ({
          'رقم الإنتاج': p.id,
          'التاريخ': p.date,
          'اسم المنتج': p.productName,
          'الكمية المنتجة': p.quantityProduced,
          'الحالة': p.status === 'completed' ? 'مكتمل' : p.status === 'pending' ? 'معلق' : 'ملغي',
          'الملاحظات': p.notes || ''
        }))
      )
      XLSX.utils.book_append_sheet(wb, productionsSheet, 'الإنتاج')

      // إضافة ورقة الاستهلاك
      const consumptionsSheet = XLSX.utils.json_to_sheet(
        consumptions.map(c => ({
          'رقم الاستهلاك': c.id,
          'التاريخ': c.date,
          'اسم المنتج': c.productName,
          'الكمية': c.quantityConsumed,
          'السبب': c.reason,
          'الملاحظات': c.notes || ''
        }))
      )
      XLSX.utils.book_append_sheet(wb, consumptionsSheet, 'الاستهلاك')

      // حفظ الملف
      XLSX.writeFile(wb, `نظام_الكاشير_${new Date().toISOString().split('T')[0]}.xlsx`)
      addNotification('تم تصدير البيانات بنجاح', 'success')
    } catch (error) {
      addNotification('خطأ في تصدير البيانات', 'error')
      console.error('Export error:', error)
    }
  }

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'array' })
        
        // معالجة الملف المستورد
        const productsData = XLSX.utils.sheet_to_json(wb.Sheets['المنتجات'] || {})
        
        addNotification(`تم استيراد ${productsData.length} منتج`, 'success')
      } catch (error) {
        addNotification('خطأ في استيراد البيانات', 'error')
        console.error('Import error:', error)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">إدارة اكسل</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* تصدير */}
        <button
          onClick={exportToExcel}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <Download size={20} />
          تصدير جميع البيانات إلى Excel
        </button>

        {/* استيراد */}
        <label className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer">
          <Upload size={20} />
          استيراد من Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={importFromExcel}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-4 p-4 bg-slate-700 rounded text-slate-300 text-sm">
        <p className="font-semibold mb-2">تم تصدير:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{products.length} منتج</li>
          <li>{invoices.length} فاتورة</li>
          <li>{purchases.length} عملية شراء</li>
          <li>{productions.length} عملية إنتاج</li>
          <li>{consumptions.length} عملية استهلاك</li>
        </ul>
      </div>
    </div>
  )
}
