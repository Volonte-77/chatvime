import React from 'react'

export default function ChatListItem({chat, currentUser, onSelect}){
  if(!chat) return null;

  const isSeen = chat?.isSeen;
  const avatarSrc = chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png";

  return (
    <div className='item' onClick={()=>onSelect(chat)}
      style={{ backgroundColor: isSeen ? 'transparent' : '#5183fe' }}
    >
      <img src={avatarSrc} alt="" />
      <div className="texts">
        <span>{chat.user.blocked.includes(currentUser.id) ? "user" : chat.user.username}</span>
        <p>{chat.lastMessage}</p>
      </div>
    </div>
  )
}
