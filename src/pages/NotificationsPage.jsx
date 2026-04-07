import React from 'react'
import List from '../components/list/List'
import Notification from '../components/notification/Notification'

export default function NotificationsPage(){
  return (
    <div className='container'>
      <List />
      <Notification />
    </div>
  )
}
