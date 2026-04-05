import React from 'react'

export default function MessageItem({message, currentUser}){
  const isOwn = message.senderId === currentUser?.id

  return (
    <div className={isOwn?"message own":"message"} key={message?.createdAt}>
      <div className="texts">
        {message.img && <img src={message.img} alt="shared" />}
        <p>{message.text}</p>
      </div>
    </div>
  )
}
