import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/login/Login'
import ChatsPage from '../pages/ChatsPage'
import ChatRoomPage from '../pages/ChatRoomPage'
import NotificationsPage from '../pages/NotificationsPage'
import ProfilePage from '../pages/ProfilePage'
import { useChatStore } from '../lib/useChatStore'
import { useUserStore } from '../lib/userStore'

export default function AppRoutes(){
  const { currentUser } = useUserStore()
  const { chatId } = useChatStore()

  if(!currentUser){
    return (
      <Routes>
        <Route path="/*" element={<Login/>} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={chatId?`/chats/${chatId}`:'/chats'} replace/>} />
      <Route path="/chats" element={<ChatsPage/>} />
      <Route path="/chats/:id" element={<ChatRoomPage/>} />
      <Route path="/notifications" element={<NotificationsPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
    </Routes>
  )
}
