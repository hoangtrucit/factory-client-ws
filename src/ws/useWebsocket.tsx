'use client';

import { Socket, io } from 'socket.io-client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { TMessageEvent } from './create-gop'

export const safeParseJsonType = <T extends {}>(data: string): T => {
  return JSON.parse(data)
}

type TWebsocketContextProp<T> = {
  isConnected: boolean
  event: T | null
  sendMessage: (eventName: string, message: { [key: string]: unknown }) => void
}

type TProps = {
  children?: React.ReactNode
}

const WebsocketContext = <T,>() =>
  createContext<TWebsocketContextProp<T>>({
    isConnected: false,
    event: null,
    sendMessage: () => {},
  })

const Context = WebsocketContext()

export const WebsocketProvider = <T extends keyof TMessageEvent>({
  children,
}: TProps) => {
  const [state, setState] = useState<TMessageEvent[T] | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const refSocket = useRef<Socket | null>(null)
  // implment how to get userId in real project
  const userId = 'master'

  const sendMessage = (
    eventName: string,
    message: { [key: string]: unknown }
  ) => {
    refSocket.current?.emit(eventName, {
      ...message,
    })
  }

  useEffect(() => {
    if (userId) {
      refSocket.current = io('0.0.0.0:9090', {
        transports: ['websocket'],
        secure: true,
        auth: {
          userId: 'master',
        },
      })

      refSocket?.current.on('notifications', (msg: string) => {
        const event = safeParseJsonType<TMessageEvent[T]>(msg)
        console.log('🚀🚀🚀 file: useWebsocket.tsx [line 60]', JSON.stringify(event, null, 4));
        setState(event)
        setTimeout(() => {
          setState(null)
        }, 4000)
      })
    }

    if (!userId && refSocket.current) {
      refSocket.current.disconnect()
    }

    return () => {
      refSocket.current && refSocket.current.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (refSocket.current?.active) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }, [refSocket.current?.active])

  return (
    <Context.Provider
      value={{
        isConnected,
        event: state,
        sendMessage,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useWebsocket = <T extends keyof TMessageEvent>() => {
  return useContext(Context) as TWebsocketContextProp<TMessageEvent[T]>
}
