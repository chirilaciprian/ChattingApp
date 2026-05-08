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
    activeConversation: Conversation | null
    setActiveConversation: (conversation: Conversation) => Promise<void>
    updateConversationLocal: (updated: Conversation) => void
    messages: Message[]
    messagesLoading: boolean
    sendMessage: (dto: CreateMessageDto) => ReturnType<typeof socketService.sendMessage>
    createConversation: typeof socketService.createConversation
    deleteConversation: typeof socketService.deleteConversation
    unreadCounts: Record<string, number>
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth()

    const [isConnected, setIsConnected] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})

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
            onUserStatusChanged: ({ userId, isOnline, lastSeen }) => {
                setConversations(prev => prev.map(conv => ({
                    ...conv,
                    participants: conv.participants?.map(p =>
                        p.user.id === userId ? { ...p, user: { ...p.user, isOnline, lastSeen } } : p
                    ) ?? conv.participants
                })))
            },
            onConnectError: (err) => {
                console.error('Socket connection error:', err.message)
            },
            onUnreadCountUpdated: ({ conversationId, unreadCount }) => {
                setUnreadCounts(prev => ({ ...prev, [conversationId]: unreadCount }))
            },
        })

        return () => {
            socketService.removeListeners()
            socketService.disconnect()
            setIsConnected(false)
        }
    }, [token, user])


    useEffect(() => {
        if (!user) return
        fetchConversationsByUserId(user.id)
            .then(convs => {
                setConversations(convs)
                // Seed unread counts from participant data
                const counts: Record<string, number> = {}
                convs.forEach(conv => {
                    const me = conv.participants?.find(p => p.user.id === user.id)
                    if (me) counts[conv.id] = me.unreadCount
                })
                setUnreadCounts(counts)
            })
            .catch(console.error)
    }, [user])

    // switch active conversation — leave old room, fetch messages, join new room
    const setActiveConversation = useCallback(async (conversation: Conversation) => {
        if (activeConversation) {
            await socketService.leaveConversation(activeConversation.id)
        }

        setActiveConversationState(conversation)
        setMessages([])
        setMessagesLoading(true)

        try {
            const [messages] = await Promise.all([
                fetchMessagesByConversationId(conversation.id),
                socketService.joinConversation(conversation.id),
            ])
            setMessages(messages)
        } catch (err) {
            console.error('Failed to load conversation:', err)
        } finally {
            setMessagesLoading(false)
        }
    }, [activeConversation])

    const updateConversationLocal = useCallback((updated: Conversation) => {
        setConversations(prev => prev.map(c => c.id === updated.id ? updated : c))
        setActiveConversationState(prev => prev?.id === updated.id ? updated : prev)
    }, [])

    const sendMessage = useCallback(async (dto: CreateMessageDto) => {
        const res = await socketService.sendMessage(dto)
        if (!res.success) console.error('Failed to send message:', res.error)
        return res
    }, [])

    return (
        <ChatContext.Provider value={{
            isConnected,
            conversations,
            activeConversation,
            setActiveConversation,
            updateConversationLocal,
            messages,
            messagesLoading,
            sendMessage,
            createConversation: socketService.createConversation,
            deleteConversation: socketService.deleteConversation,
            unreadCounts
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