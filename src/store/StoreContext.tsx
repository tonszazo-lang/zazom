import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem, Invoice, DailyReport } from './types'

interface StoreContextType {
  products: Product[]
  cart: CartItem[]
  invoices: Invoice[]
  dailyReports: DailyReport[]
  selectedTab: string
  
  // Product actions
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Invoice actions
  createInvoice: (items: CartItem[], tax: number, paymentMethod: string, customerName?: string) => Invoice
  markInvoiceAsPaid: (invoiceId: string) => void
  
  // Tab navigation
  setSelectedTab: (tab: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'ماء معدني 500مل', price: 3, category: 'مشروبات', stock: 50, barcode: '001' },
  { id: '2', name: 'عصير برتقال 1لتر', price: 12, category: 'مشروبات', stock: 30, barcode: '002' },
  { id: '3', name: 'شيبس حار 50جم', price: 5, category: 'وجبات خفيفة', stock: 100, barcode: '003' },
  { id: '4', name: 'شوكولاتة 100جم', price: 8, category: 'حلويات', stock: 60, barcode: '004' },
  { id: '5', name: 'خبز أبيض', price: 2.5, category: 'خبز', stock: 80, barcode: '005' },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [selectedTab, setSelectedTab] = useState('dashboard')

  // Load from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('pos_products')
    const savedInvoices = localStorage.getItem('pos_invoices')
    const savedReports = localStorage.getItem('pos_reports')

    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices))
    if (savedReports) setDailyReports(JSON.parse(savedReports))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('pos_invoices', JSON.stringify(invoices))
  }, [invoices])

  useEffect(() => {
    localStorage.setItem('pos_reports', JSON.stringify(dailyReports))
  }, [dailyReports])

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: Date.now().toString() }])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const addToCart = (product: Product, quantity: number) => {
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const createInvoice = (items: CartItem[], tax: number, paymentMethod: string, customerName?: string): Invoice => {
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const total = subtotal + tax

    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      subtotal,
      tax,
      total,
      paid: paymentMethod !== 'بدون دفع',
      paymentMethod,
      customerName,
    }

    setInvoices([...invoices, invoice])

    // Update products stock
    items.forEach(item => {
      updateProduct(item.product.id, {
        stock: item.product.stock - item.quantity
      })
    })

    // Update daily report
    const today = new Date().toISOString().split('T')[0]
    const existingReport = dailyReports.find(r => r.date === today)
    if (existingReport) {
      setDailyReports(dailyReports.map(r =>
        r.date === today
          ? {
            ...r,
            revenue: r.revenue + total,
            profit: r.profit + total * 0.8,
            salesCount: r.salesCount + 1
          }
          : r
      ))
    } else {
      setDailyReports([...dailyReports, {
        date: today,
        revenue: total,
        expenses: total * 0.2,
        profit: total * 0.8,
        salesCount: 1
      }])
    }

    clearCart()
    return invoice
  }

  const markInvoiceAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, paid: true } : inv
    ))
  }

  const value: StoreContextType = {
    products,
    cart,
    invoices,
    dailyReports,
    selectedTab,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    createInvoice,
    markInvoiceAsPaid,
    setSelectedTab,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
