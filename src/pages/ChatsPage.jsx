import React from 'react'
import List from '../components/list/List'
import Chat from '../components/chat/Chat'
import Detail from '../components/detail/Detail'
import Notification from '../components/notification/Notification'
import { useChatStore } from '../lib/useChatStore'

export default function ChatsPage(){
  const { chatId } = useChatStore()

  return (
    <div className='container'>
      <List />
      {chatId && <Chat />}
      {chatId && <Detail />}
      <Notification />
    </div>
  )
}
