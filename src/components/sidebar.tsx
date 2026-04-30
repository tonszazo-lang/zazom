'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Package, Calculator, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Sidebar({ currentTab, setCurrentTab }: { currentTab: string; setCurrentTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'inventory', label: 'إدارة المخزون', icon: Package },
    { id: 'calculator', label: 'الحاسبة', icon: Calculator },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-yellow-400 text-black"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 right-0 w-64 glass p-6 transform transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Zazom
            </h1>
            <p className="text-sm text-muted-foreground mt-2">نظام إدارة المخزون المتقدم</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentTab === item.id
                      ? 'bg-yellow-400 text-black font-semibold'
                      : 'text-foreground hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="space-y-4 border-t border-border pt-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/10 transition-all duration-200"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'وضع فاتح' : 'وضع مظلم'}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="hidden md:block fixed inset-y-0 right-0 w-64" />
    </>
  )
}
