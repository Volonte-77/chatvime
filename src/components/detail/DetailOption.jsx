import React from 'react'
import { FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi'

export default function DetailOption({title, children, collapsed=false, onToggle}){
  return (
    <div className="option">
      <div className="title" onClick={onToggle} role="button" tabIndex={0}>
        <span>{title}</span>
        {collapsed ? <FiChevronDown/> : <FiChevronUp/>}
      </div>
      {children}
    </div>
  )
}
