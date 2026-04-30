'use client'

import { App } from '@/components/App'
import { StoreProvider } from '@/store/StoreContext'
import { NotificationProvider } from '@/store/NotificationContext'

export default function Home() {
  return (
    <StoreProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </StoreProvider>
  )
}
