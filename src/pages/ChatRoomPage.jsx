import React from 'react'
import List from '../components/list/List'
import Chat from '../components/chat/Chat'
import Detail from '../components/detail/Detail'
import Notification from '../components/notification/Notification'

export default function ChatRoomPage(){
  return (
    <div className='container'>
      <List />
      <Chat />
      <Detail />
      <Notification />
    </div>
  )
}
