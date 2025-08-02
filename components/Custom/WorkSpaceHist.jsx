"use client"
import React, { useState } from 'react'

import { api } from '@/convex/_generated/api';
import { useContext,useEffect } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { useQuery } from 'convex/react';
function WorkSpaceHist() {

  const{userDetail,setUserDetail}=useContext(UserDetailContext);
  const convex=useConvex();
  const[workspaceList,setWorkspaceList]=useState();
  const{toggleSidebar}=useSidebar()
  
  useEffect(()=>{
     userDetail&&GetAllWorkspace();
  },[userDetail])

  const GetAllWorkspace=async ()=>{
    const result=await convex.query(api.workspace.GetAllWorkspace,{
      userid:userDetail?._id,
    })
    setWorkspaceList(result);
    console.log(result);
  }
  return (
    <div>
      <h2 className='font-medium'>Your Chat History</h2>
      <div>
        {workspaceList && workspaceList?.map((workspace,index)=>(
          <Link key={index} href={'/workspace/'+workspace?._id}>
          <h2 onClick={toggleSidebar} className='text-md text-gray-400 flex flex-col gap-3 mt-3 hover:text-white cursor-pointer'>
            {workspace?.messages[0]?.content}
          </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default WorkSpaceHist
