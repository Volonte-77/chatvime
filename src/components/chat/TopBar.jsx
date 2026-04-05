import React from 'react'
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi'

export default function TopBar({user}){
  return (
    <div className="top">
      <div className="user">
        <img src={user?.avatar || './avatar.png'} alt="" />
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
  )
}
