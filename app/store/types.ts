export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  barcode?: string
  purchasePrice?: number
}

export interface CartItem {
  product: Product
  quantity: number
  discount?: number
}

export interface Invoice {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paid: boolean
  paymentMethod?: string
  customerName?: string
}

export interface Purchase {
  id: string
  date: string
  supplier: string
  items: {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
  }[]
  total: number
  notes?: string
}

export interface Production {
  id: string
  date: string
  productId: string
  productName: string
  quantityProduced: number
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
}

export interface Consumption {
  id: string
  date: string
  productId: string
  productName: string
  quantityConsumed: number
  reason: string
  notes?: string
}

export interface DailyReport {
  date: string
  revenue: number
  expenses: number
  profit: number
  salesCount: number
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: number
  duration?: number
}

export interface CurrencyConfig {
  code: 'EGP' | 'USD' | 'SAR'
  symbol: string
  name: string
  taxRate: number
}

export interface StoreState {
  products: Product[]
  cart: CartItem[]
  invoices: Invoice[]
  purchases: Purchase[]
  productions: Production[]
  consumptions: Consumption[]
  dailyReports: DailyReport[]
  selectedTab: string
  currency: CurrencyConfig
}
