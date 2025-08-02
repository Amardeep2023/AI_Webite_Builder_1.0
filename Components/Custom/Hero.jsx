"use client"
import Colors from '@/data/Colors'
import Lookup from '@/data/Lookup'
import { ArrowRight ,Key,Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import SigninDialog from './SigninDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

function Hero() {

  const[userInput,setuserInput]=useState();
  const{messages,setMessages}=useContext(MessagesContext);
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace=useMutation(api.workspace.CreateWorkspace)
  const router = useRouter();

  const onGenerate=async(input)=>{
    
    if(!userDetail?.name){
      setOpenDialog(true);
      return;
    }
     if(userDetail?.token<10){
      toast('You Dont Have Enough Token!!')
      return;
    }
    const msg={
      role:'user',
      content:input
    }
    setMessages(msg);
 
    
    const workspaceId=await CreateWorkspace({
      user:userDetail._id,
      messages:[msg]
    })
    console.log(workspaceId);
     router.push(`/workspace/${workspaceId}`);
  }


  return (
    <div className="flex flex-col items-center justify-center mt-36 xl:mt-36">
      <h2 className='text-center font-bold text-3xl'>{Lookup.HERO_HEADING}</h2>
      <p className='font-small  text-gray-500'>{Lookup.HERO_DESC}</p>
     <div className='p-5 rounded-2xl max-w-2xl w-full border-2 mt-2 relative overflow-hidden
     'style={{backgroundColor:Colors.BACKGROUND}}>

  {/* Top-left + left border cyan gradient glow */}
  <div className="absolute top-0 left-0 h-44 w-3 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent blur-md rounded-tl-xl z-10" />

  {/* Top-left horizontal bar for full corner coverage */}
  <div className="absolute top-0 left-0 w-44 h-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-transparent blur-md rounded-tl-xl z-10" />

  <div className='flex gap-2 relative z-20'>
    <textarea
      placeholder={Lookup.INPUT_PLACEHOLDER}
      onChange={(event) => setuserInput(event.target.value)}
      className="outline-none w-full h-32 bg-transparent max-h-52 resize-none p-4 pt-6"
    />
    {userInput && (
      <ArrowRight 
      onClick={() => onGenerate(userInput)}
      className='bg-blue-500 h-8 w-8 p-1 rounded-md' />
    )}
  </div>

  <div>
    <Link className='w-6 h-6' />
  </div>
     
      </div>
         <div className='flex flex-wrap gap-3 max-w-2xl justify-center mt-5 text-sm text-gray-400'>
          {Lookup?.SUGGSTIONS.map((suggestion,index)=>(
            <h2 className='hover:text-gray-300 cursor-pointer' 
            onClick={() => onGenerate(suggestion)}
            key={index}>{suggestion}</h2>
          ))}
        </div>
        <SigninDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(false)} />
    </div>
    
  )
}

export default Hero
