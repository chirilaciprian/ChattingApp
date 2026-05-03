// src/context/chatContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as socketService from '../services/chatService'
import { fetchConversationsByUserId } from '../services/conversationService'
import { fetchMessagesByConversationId } from '../services/messageService'
import { useAuth } from './authContext'
import type { Conversation, Message, CreateMessageDto } from '../types/types'

type ChatContextType = {
    isConnected: boolean
    conversations: Conversation[]
    activeConversationId: string | null
    setActiveConversation: (id: string) => Promise<void>
    messages: Message[]
    messagesLoading: boolean
    sendMessage: (dto: CreateMessageDto) => ReturnType<typeof socketService.sendMessage>
    createConversation: typeof socketService.createConversation
    deleteConversation: typeof socketService.deleteConversation
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth()

    const [isConnected, setIsConnected] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [messagesLoading, setMessagesLoading] = useState(false)

    useEffect(() => {
        if (!token || !user) return

        const socket = socketService.connect(token)
        socket.on('connect', () => setIsConnected(true))
        socket.on('disconnect', () => setIsConnected(false))

        socketService.registerListeners({
            onMessageReceived: (message) => {
                setMessages(prev => [...prev, message])
            },
            onConversationCreated: (conversation) => {
                setConversations(prev => [...prev, conversation])
            },
            onConversationDeleted: (conversationId) => {
                setConversations(prev => prev.filter(c => c.id !== conversationId))
                setActiveConversationId(prev => prev === conversationId ? null : prev)
                setMessages(prev =>
                    activeConversationId === conversationId ? [] : prev
                )
            },
            onConnectError: (err) => {
                console.error('Socket connection error:', err.message)
            },
        })

        return () => {
            socketService.removeListeners()
            socketService.disconnect()
            setIsConnected(false)
        }
    }, [token, user])

    // initial conversations fetch
    useEffect(() => {
        if (!user) return
        fetchConversationsByUserId(user.id)
            .then(setConversations)
            .catch(console.error)
    }, [user])

    // switch active conversation — leave old room, fetch messages, join new room
    const setActiveConversation = useCallback(async (id: string) => {
        if (activeConversationId) {
            await socketService.leaveConversation(activeConversationId)
        }

        setActiveConversationId(id)
        setMessages([])
        setMessagesLoading(true)

        try {
            const [messages] = await Promise.all([
                fetchMessagesByConversationId(id),
                socketService.joinConversation(id),
            ])
            setMessages(messages)
        } catch (err) {
            console.error('Failed to load conversation:', err)
        } finally {
            setMessagesLoading(false)
        }
    }, [activeConversationId])

    const sendMessage = useCallback(async (dto: CreateMessageDto) => {
        const res = await socketService.sendMessage(dto)
        if (!res.success) console.error('Failed to send message:', res.error)
        return res
    }, [])

    return (
        <ChatContext.Provider value={{
            isConnected,
            conversations,
            activeConversationId,
            setActiveConversation,
            messages,
            messagesLoading,
            sendMessage,
            createConversation: socketService.createConversation,
            deleteConversation: socketService.deleteConversation,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const ctx = useContext(ChatContext)
    if (!ctx) throw new Error('useChat must be used within a ChatProvider')
    return ctx
}