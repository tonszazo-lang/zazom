import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // استدعاء ملف App.jsx الذي سيحتوي على صفحتك الرئيسية
import { Analytics } from '@vercel/analytics/react' // تعديل الاستيراد ليعمل مع React
import './globals.css'

// استهداف عنصر الـ root الموجود في ملف index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
      {/* تشغيل تحليلات فيرسل في وضع الإنتاج فقط */}
      <Analytics />
    </React.StrictMode>
  );
}
