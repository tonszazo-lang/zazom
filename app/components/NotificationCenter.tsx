import React from 'react'
import { useNotification } from '@/store/NotificationContext'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotification()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <XCircle size={20} className="text-red-400" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-400" />
      case 'info':
        return <Info size={20} className="text-blue-400" />
      default:
        return <Info size={20} className="text-blue-400" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border border-green-500/30'
      case 'error':
        return 'bg-red-900/20 border border-red-500/30'
      case 'warning':
        return 'bg-yellow-900/20 border border-yellow-500/30'
      case 'info':
        return 'bg-blue-900/20 border border-blue-500/30'
      default:
        return 'bg-blue-900/20 border border-blue-500/30'
    }
  }

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-100'
      case 'error':
        return 'text-red-100'
      case 'warning':
        return 'text-yellow-100'
      case 'info':
        return 'text-blue-100'
      default:
        return 'text-blue-100'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} ${getTextColor(notification.type)} rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
