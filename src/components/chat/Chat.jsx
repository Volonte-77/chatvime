import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/useChatStore'
import { useUserStore } from '../../lib/userStore'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi'

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
      <div className="top">
        <div className="user">
          <img src={user?.avatar||"./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>vous utilisez volo@chat</p>
          </div>
        </div>
        <div className="icons">
          <FiPhone className="icon" />
          <FiVideo className="icon" />
          <FiInfo className="icon" />
        </div>
      </div>
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
