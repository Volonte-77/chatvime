import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/login/Login'
import List from '../components/list/List'
import Chat from '../components/chat/Chat'
import Detail from '../components/detail/Detail'
import Notification from '../components/notification/Notification'
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
      <Route path="/chats" element={<div className='container'><List/>{chatId && <Chat/>}{chatId && <Detail/>}<Notification/></div>} />
      <Route path="/chats/:id" element={<div className='container'><List/><Chat/><Detail/><Notification/></div>} />
      <Route path="/notifications" element={<div className='container'><List/><Notification/></div>} />
      <Route path="/profile" element={<div className='container'><List/><Detail/><Notification/></div>} />
    </Routes>
  )
}
