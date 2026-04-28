'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { Inventory } from '@/components/inventory'
import { Calculator } from '@/components/calculator'

interface Product {
  id: string
  name: string
  quantity: number
  price: number
}

interface Log {
  id: string
  type: 'in' | 'out'
  product: string
  quantity: number
  price: number
  total: number
  date: string
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [mounted, setMounted] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    const savedLogs = localStorage.getItem('logs')
    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedLogs) setLogs(JSON.parse(savedLogs))
    setMounted(true)
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('products', JSON.stringify(products))
      localStorage.setItem('logs', JSON.stringify(logs))
    }
  }, [products, logs, mounted])

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard data={{ products, logs }} />
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} />
      case 'calculator':
        return <Calculator logs={logs} setLogs={setLogs} />
      default:
        return <Dashboard data={{ products, logs }} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 md:mr-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
