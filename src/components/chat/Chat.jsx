import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/useChatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/upload'
import MessageItem from './MessageItem'
import { FiPhone, FiVideo, FiInfo, FiImage, FiCamera, FiMic, FiSmile } from 'react-icons/fi'

export default function Chat() {
  const [chat,setChat]=useState()
  const [open,setOpen]=useState(false)
  const [text,setText]=useState("")
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked}=useChatStore()
  const {currentUser}=useUserStore()
  const [img,setImg]=useState({
    file:null,
    url:""
  })
  const endRef=useRef(null)
  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
  },[])
  const handleEmoji=(e)=>{
    setText((prev)=>prev+e.emoji);
    setOpen(false);
  }
  
  useEffect(()=>{
    const unSub=onSnapshot(doc(db,"chats",chatId),(res)=>{
      setChat(res.data())
    })
    return ()=>{
      unSub();
    }
  },[chatId])
  const handleImg=(e)=>{
    if(e.target.files[0]){
      setImg({
        file:e.target.files[0],
        url:URL.createObjectURL(e.target.files[0]),
      })
    }
  }

  const handleSend=async()=>{

    if(text==="")return;
    let imgUrl=null

    try {
      if(img.file){
        imgUrl=await upload(img.file);
      }


      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId:currentUser.id,
          text,
          createdAt:new Date(),
          ...(imgUrl && {img:imgUrl})
        })
      });
      const userIDs=[currentUser.id,user.id]
      userIDs.forEach(async (id)=>{
        const userChatsRef=doc(db,"userChats",id)
        const userChatsSnapshot=await getDoc(userChatsRef)

        if(userChatsSnapshot.exists()){
          const userChatsData=userChatsSnapshot.data()

          const chatIndex=userChatsData.chats.findIndex(c=>c.chatId===chatId)

          userChatsData.chats[chatIndex].lastMessage=text;
          userChatsData.chats[chatIndex].isSeen=id===currentUser.id ? true:false;
          userChatsData.chats[chatIndex].updatedAt=Date.now()

          await updateDoc(userChatsRef,{
            chats:userChatsData.chats,
          })
        }
    })
    } catch (error) {
      console.log(error);
      
    }
    setImg({
      file:null,
      url:""
    })
    setText("");
  }
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
        {img.url && <div className="message own">
          <div className="texts">
            <img src={img.url} alt="preview" />
          </div>
        </div>}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file" style={{cursor:'pointer'}}>
            <FiImage className="icon" />
          </label>
          <input type="file" id='file' style={{display:"none"}} onChange={handleImg}/>
          <FiCamera className="icon" />
          <FiMic className="icon" />
        </div>
        <input type="text" placeholder={(isCurrentUserBlocked||isReceiverBlocked)?"tu n'est pas autorise":'ecris un message...'}
        onChange={(e)=>setText(e.target.value)}
        value={text}
        disabled={isCurrentUserBlocked||isReceiverBlocked}
        />
        <div className="emoji">
          <FiSmile className="icon emojiIcon" onClick={()=>setOpen((prev =>!prev))} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div> 
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked||isReceiverBlocked}>envoyer</button>
      </div>
    </div>
  )
}
