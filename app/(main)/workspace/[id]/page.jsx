import ChatView from '@/components/Custom/ChatView'
import CodeView from '@/components/Custom/CodeView'
import React from 'react'

function page() {
  return (
    <div className='p-5 '>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <ChatView/>
       <div className='col-span-2'>
        <CodeView/>
        </div>

      </div>
      
    </div>
  )
}

export default page
