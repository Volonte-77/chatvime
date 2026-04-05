import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/useChatStore'
import { useUserStore } from '../../lib/userStore'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import TopBar from './TopBar'

export default function Chat() {
  const [chat,setChat]=useState()
  
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked}=useChatStore()
  const {currentUser}=useUserStore()
  const endRef=useRef(null)
  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
  },[])
  
  useEffect(()=>{
    const unSub=onSnapshot(doc(db,"chats",chatId),(res)=>{
      setChat(res.data())
    })
    return ()=>{
      unSub();
    }
  },[chatId])
  
  return (
    <div className='chat'>
      <TopBar user={user} />
      <div className="center">
        {chat?.messages?.map(message => (
          <MessageItem key={message?.createdAt} message={message} currentUser={currentUser} />
        ))}
        
        <div ref={endRef}></div>
      </div>
      <MessageInput chatId={chatId} currentUser={currentUser} disabled={isCurrentUserBlocked||isReceiverBlocked} onSent={()=>endRef.current?.scrollIntoView({behavior:'smooth'})} />
    </div>
  )
}
