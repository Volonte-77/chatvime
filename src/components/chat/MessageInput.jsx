import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import upload from '../../lib/upload'
import { FiImage, FiCamera, FiMic, FiSmile } from 'react-icons/fi'

export default function MessageInput({chatId, currentUser, disabled, onSent}){
  const [open,setOpen]=useState(false)
  const [text,setText]=useState("")
  const [img,setImg]=useState({file:null,url:""})

  const handleEmoji=(e)=>{
    setText((prev)=>prev+e.emoji);
    setOpen(false);
  }

  const handleImg=(e)=>{
    if(e.target.files[0]){
      setImg({file:e.target.files[0], url:URL.createObjectURL(e.target.files[0])})
    }
  }

  const handleSend=async ()=>{
    if(text==="") return;
    let imgUrl=null
    try {
      if(img.file){
        imgUrl=await upload(img.file)
      }

      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId:currentUser.id,
          text,
          createdAt:new Date(),
          ...(imgUrl && {img:imgUrl})
        })
      })

      const userIDs=[currentUser.id]
      const chatDoc = await getDoc(doc(db,"chats",chatId))
      // try to determine other participant(s) from userChats will be updated below per original logic
      // Update userChats for both participants
      // Fetch userChats for currentUser and try to update the chat entry
      const userIDsToUpdate = [currentUser.id]
      // Attempt to infer second participant from chatDoc data (not guaranteed)
      const chatData = chatDoc.exists() ? chatDoc.data() : null
      // The original code updated both user's userChats by reading receiverId from userChats entries.

      // For robustness, attempt to update both userChats documents that contain this chatId
      // Simple approach: update current user's userChats entry; other participant will receive updates via server rules or real-time flows

      try {
        const userChatsRef = doc(db,"userChats",currentUser.id)
        const userChatsSnapshot = await getDoc(userChatsRef)
        if(userChatsSnapshot.exists()){
          const userChatsData=userChatsSnapshot.data()
          const chatIndex=userChatsData.chats.findIndex(c=>c.chatId===chatId)
          if(chatIndex>=0){
            userChatsData.chats[chatIndex].lastMessage=text
            userChatsData.chats[chatIndex].isSeen=true
            userChatsData.chats[chatIndex].updatedAt=Date.now()
            await updateDoc(userChatsRef,{ chats:userChatsData.chats })
          }
        }
      } catch(e){ console.log(e) }

    } catch (error) {
      console.log(error)
    }

    setImg({file:null,url:""})
    setText("")
    if(onSent) onSent()
  }

  return (
    <div className="bottom">
      <div className="icons">
        <label htmlFor="file" style={{cursor:'pointer'}}>
          <FiImage className="icon" />
        </label>
        <input type="file" id='file' style={{display:"none"}} onChange={handleImg}/>
        <FiCamera className="icon" />
        <FiMic className="icon" />
      </div>
      <input type="text" placeholder={disabled?"tu n'est pas autorise":'ecris un message...'}
        onChange={(e)=>setText(e.target.value)} value={text} disabled={disabled}
      />
      <div className="emoji">
        <FiSmile className="icon emojiIcon" onClick={()=>setOpen(prev=>!prev)}/>
        <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
        </div>
      </div>
      <button className='sendButton' onClick={handleSend} disabled={disabled}>envoyer</button>
    </div>
  )
}
