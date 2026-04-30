import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem, Invoice, DailyReport, Purchase, Production, Consumption } from './types'

interface StoreContextType {
  products: Product[]
  cart: CartItem[]
  invoices: Invoice[]
  purchases: Purchase[]
  productions: Production[]
  consumptions: Consumption[]
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
  
  // Purchase actions
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void
  deletePurchase: (purchaseId: string) => void
  
  // Production actions
  addProduction: (production: Omit<Production, 'id'>) => void
  updateProduction: (id: string, updates: Partial<Production>) => void
  deleteProduction: (productionId: string) => void
  
  // Consumption actions
  addConsumption: (consumption: Omit<Consumption, 'id'>) => void
  deleteConsumption: (consumptionId: string) => void
  
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
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [productions, setProductions] = useState<Production[]>([])
  const [consumptions, setConsumptions] = useState<Consumption[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [selectedTab, setSelectedTab] = useState('dashboard')

  // Load from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('pos_products')
    const savedInvoices = localStorage.getItem('pos_invoices')
    const savedPurchases = localStorage.getItem('pos_purchases')
    const savedProductions = localStorage.getItem('pos_productions')
    const savedConsumptions = localStorage.getItem('pos_consumptions')
    const savedReports = localStorage.getItem('pos_reports')

    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices))
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases))
    if (savedProductions) setProductions(JSON.parse(savedProductions))
    if (savedConsumptions) setConsumptions(JSON.parse(savedConsumptions))
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
    localStorage.setItem('pos_purchases', JSON.stringify(purchases))
  }, [purchases])

  useEffect(() => {
    localStorage.setItem('pos_productions', JSON.stringify(productions))
  }, [productions])

  useEffect(() => {
    localStorage.setItem('pos_consumptions', JSON.stringify(consumptions))
  }, [consumptions])

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

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: `PUR-${Date.now()}`
    }
    setPurchases([...purchases, newPurchase])

    // Update products stock
    purchase.items.forEach(item => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        updateProduct(item.productId, {
          stock: product.stock + item.quantity,
          purchasePrice: item.unitPrice
        })
      }
    })
  }

  const deletePurchase = (purchaseId: string) => {
    setPurchases(purchases.filter(p => p.id !== purchaseId))
  }

  const addProduction = (production: Omit<Production, 'id'>) => {
    const newProduction: Production = {
      ...production,
      id: `PROD-${Date.now()}`
    }
    setProductions([...productions, newProduction])

    // Update product stock if completed
    if (production.status === 'completed') {
      const product = products.find(p => p.id === production.productId)
      if (product) {
        updateProduct(production.productId, {
          stock: product.stock + production.quantityProduced
        })
      }
    }
  }

  const updateProduction = (id: string, updates: Partial<Production>) => {
    setProductions(productions.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates }
        // If status changed to completed, update stock
        if (updates.status === 'completed' && p.status !== 'completed') {
          const product = products.find(pr => pr.id === p.productId)
          if (product) {
            updateProduct(p.productId, {
              stock: product.stock + p.quantityProduced
            })
          }
        }
        return updated
      }
      return p
    }))
  }

  const deleteProduction = (productionId: string) => {
    setProductions(productions.filter(p => p.id !== productionId))
  }

  const addConsumption = (consumption: Omit<Consumption, 'id'>) => {
    const newConsumption: Consumption = {
      ...consumption,
      id: `CONS-${Date.now()}`
    }
    setConsumptions([...consumptions, newConsumption])

    // Update product stock
    const product = products.find(p => p.id === consumption.productId)
    if (product) {
      updateProduct(consumption.productId, {
        stock: product.stock - consumption.quantityConsumed
      })
    }
  }

  const deleteConsumption = (consumptionId: string) => {
    setConsumptions(consumptions.filter(c => c.id !== consumptionId))
  }

  const value: StoreContextType = {
    products,
    cart,
    invoices,
    purchases,
    productions,
    consumptions,
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
    addPurchase,
    deletePurchase,
    addProduction,
    updateProduction,
    deleteProduction,
    addConsumption,
    deleteConsumption,
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
