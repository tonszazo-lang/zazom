import React, { useState } from 'react'
import { useStore } from '@/store/StoreContext'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Dashboard } from './Dashboard'
import { POS } from './POS'
import { Inventory } from './Inventory'
import { Invoices } from './Invoices'
import { Reports } from './Reports'
import { Purchases } from './Purchases'
import { Production } from './Production'
import { Consumption } from './Consumption'

export function App() {
  const { selectedTab, setSelectedTab } = useStore()
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
    { id: 'pos', label: 'نقطة البيع', icon: '🛒' },
    { id: 'inventory', label: 'المخزون', icon: '📦' },
    { id: 'purchases', label: 'المشتريات', icon: '🏪' },
    { id: 'production', label: 'الإنتاج', icon: '🏭' },
    { id: 'consumption', label: 'الاستهلاك', icon: '🗑️' },
    { id: 'invoices', label: 'الفواتير', icon: '📄' },
    { id: 'reports', label: 'التقارير', icon: '📈' },
  ]

  const handleNavClick = (tabId: string) => {
    setSelectedTab(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛍️</div>
            <h1 className="text-2xl font-bold text-white hidden md:block">نظام POS</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-slate-400" size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="text-white" size={24} /> : <Menu className="text-white" size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-slate-800/50 backdrop-blur-sm border-t border-white/10 p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {selectedTab === 'dashboard' && <Dashboard />}
        {selectedTab === 'pos' && <POS />}
        {selectedTab === 'inventory' && <Inventory />}
        {selectedTab === 'purchases' && <Purchases />}
        {selectedTab === 'production' && <Production />}
        {selectedTab === 'consumption' && <Consumption />}
        {selectedTab === 'invoices' && <Invoices />}
        {selectedTab === 'reports' && <Reports />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-4 text-center text-slate-400 text-sm">
        <p>© 2024 نظام إدارة نقاط البيع • تم التطوير بواسطة v0</p>
      </footer>
    </div>
  )
}
