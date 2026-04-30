import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // هذا الإعداد مهم جداً لأن مشروعك يستخدم اختصارات المسارات مثل @/
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // لضمان عمل السيرفر المحلي بشكل جيد في بيئات مثل v0 أو Termux
    host: true,
    port: 3000,
  },
  build: {
    // تحديد مجلد المخرجات ليتوافق مع إعدادات Vercel التي ضبطناها
    outDir: 'dist',
  }
});
