export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  barcode?: string
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

export interface DailyReport {
  date: string
  revenue: number
  expenses: number
  profit: number
  salesCount: number
}

export interface StoreState {
  products: Product[]
  cart: CartItem[]
  invoices: Invoice[]
  dailyReports: DailyReport[]
  selectedTab: string
}
