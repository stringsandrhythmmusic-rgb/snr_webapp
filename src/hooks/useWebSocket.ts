import { useEffect, useRef, useState, useCallback } from 'react'
import { WS_URL } from '@/api/client'

interface UseWebSocketOptions {
  onMessage?: (msg: Record<string, unknown>) => void
  onTyping?: (userId: string, isTyping: boolean) => void
  onRead?: (readerId: string) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const intentionalClose = useRef(false)

  const connect = useCallback(() => {
    const token = localStorage.getItem('snr_auth_token')
    if (!token) return

    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      reconnectAttempts.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'message':
            options.onMessage?.(data)
            break
          case 'typing':
            options.onTyping?.(data.user_id, data.is_typing)
            break
          case 'read':
            options.onRead?.(data.reader_id)
            break
        }
      } catch { /* ignore parse errors */ }
    }

    ws.onclose = (event) => {
      setIsConnected(false)
      if (!intentionalClose.current && event.code !== 1000 && reconnectAttempts.current < 5) {
        reconnectAttempts.current++
        setTimeout(connect, 5000 * reconnectAttempts.current)
      }
    }

    ws.onerror = () => { ws.close() }
  }, [options])

  useEffect(() => {
    connect()
    return () => {
      intentionalClose.current = true
      wsRef.current?.close(1000)
    }
  }, [connect])

  const sendMessage = useCallback((receiverId: string, content: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'message', receiver_id: receiverId, content }))
  }, [])

  const sendTypingIndicator = useCallback((receiverId: string, isTyping: boolean) => {
    wsRef.current?.send(JSON.stringify({ type: 'typing', receiver_id: receiverId, is_typing: isTyping }))
  }, [])

  const sendReadReceipt = useCallback((senderId: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'read', sender_id: senderId }))
  }, [])

  return { isConnected, sendMessage, sendTypingIndicator, sendReadReceipt }
}
