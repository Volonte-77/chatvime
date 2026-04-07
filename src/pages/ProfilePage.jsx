import React from 'react'
import List from '../components/list/List'
import Detail from '../components/detail/Detail'
import Notification from '../components/notification/Notification'

export default function ProfilePage(){
  return (
    <div className='container'>
      <List />
      <Detail />
      <Notification />
    </div>
  )
}
