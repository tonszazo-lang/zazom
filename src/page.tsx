'use client'

import { App } from '@/components/App'
import { StoreProvider } from '@/store/StoreContext'

export default function Home() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}
