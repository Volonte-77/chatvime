import React, { useEffect, useState } from 'react'
import "./chatlist.css"
import AddUser from './addUser/AddUser'
import ChatListItem from './ChatListItem'
import { useUserStore } from '../../../lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useChatStore } from '../../../lib/useChatStore'
import { FiSearch, FiPlus, FiMinus } from 'react-icons/fi'

export default function Chatlist() {
    const [chats,setChats]=useState([])
    const [addMode,setAddmode]=useState(false)
    const [input,setInput]=useState("")

    const {currentUser}=useUserStore()
    const {chatId,changeChat}=useChatStore()
    
    useEffect(()=>{
      const unSub=onSnapshot(doc(db,"userChats",currentUser.id),async(res)=>{
        const items=res.data().chats;

        const promises=items.map(async(item)=>{
          const userDocRef=doc(db,"users",item.receiverId);
          const userDocSnap=await getDoc(userDocRef);

          const user=userDocSnap.data()

          return {...item,user};
        });
        const chatData=await Promise.all(promises)
        setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
      });
      return ()=>{
        unSub();
      }
    },[currentUser.id])

    const handleSelect=async(chat)=>{
      const userChats=chats.map(item=>{
        const {user,...rest}=item;
        return rest;
      });
      const chatIndex=userChats.findIndex(item=>item.chatId===chat.chatId)

      userChats[chatIndex].isSeen=true;
      const userChatsRef=doc(db,"userChats",currentUser.id);

      try {
        await updateDoc(userChatsRef,{
          chats:userChats,

        });
        changeChat(chat.chatId,chat.user)
      } catch (error) {
        console.log(error); 
      }  
    }
   const filiteredChat=chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()))
  return (
    <div className='chatlist'>
        <div className="search">
            <div className="searchBar">
                <FiSearch className='icon searchIcon'/>
                <input type="text" placeholder='Search' onChange={(e)=>setInput(e.target.value)}/>
            </div>
            <button className='add' onClick={()=>setAddmode((prev)=>!prev)} aria-label={addMode?"Fermer":"Ajouter"}>
              {addMode ? <FiMinus/> : <FiPlus/>}
            </button>
        </div>
        {filiteredChat.map((chat)=>(
          <ChatListItem key={chat.chatId} chat={chat} currentUser={currentUser} onSelect={handleSelect} />
        ))}
        {addMode && <AddUser/>}
    </div>
  )
}
