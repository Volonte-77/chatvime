import React, { useState } from 'react'
import "./detail.css"
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/useChatStore'
import { useUserStore } from '../../lib/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import DetailOption from './DetailOption'
import { FiDownload, FiUserX } from 'react-icons/fi'

export default function Detail() {
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore()
  const {currentUser}=useUserStore()
  const [photosCollapsed,setPhotosCollapsed]=useState(false)

  const handleBlock =async()=>{
    if(!user) return;
    const userDocRef=doc(db,"users",currentUser.id)

    try {
      await updateDoc(userDocRef,{
        blocked:isReceiverBlocked ? arrayRemove(user.id):arrayUnion(user.id),
      });
      changeBlock()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar||"./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>salut j'utilise volo@chat</p>
      </div>
      <div className="info">
        <DetailOption title="Chat Settings" collapsed={false} />

        <DetailOption title="Shared photos" collapsed={photosCollapsed} onToggle={()=>setPhotosCollapsed(p=>!p)}>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./avatar.png" alt="" />
                <span>photo_2024_2.png</span>
              </div>
              <FiDownload className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./avatar.png" alt="" />
                <span>photo_2024_2.png</span>
              </div>
              <FiDownload className='icon' />
            </div>
          </div>
        </DetailOption>

        <DetailOption title="Shared files" collapsed={false} />

        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "Vous Etes bloque" : isReceiverBlocked ? "Utilisateur bloque" : "Bloquez l'utilisateur"
        }</button>
        <button className='logout' onClick={()=>auth.signOut()}><FiUserX style={{marginRight:8}}/>Se Deconnecter</button>
      </div>
    </div>
  )
}
