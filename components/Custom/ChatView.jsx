"use client";
import React, { useEffect, useContext,useState, use } from "react";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from 'react-markdown'
import { useSidebar } from '@/components/ui/sidebar';
import { toast } from "sonner";

export const countToken=(inputText)=>{
  return inputText.trim().split(/\s+/).filter(word=>word).length;
  
}

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const{userDetail,setUserDetail}=useContext(UserDetailContext);
  const [userInput, setUserInput] =useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMeassages=useMutation(api.workspace.UpdateMeassages)
  const { isOpen, toggleSidebar } = useSidebar();
  const [hasResponded, setHasResponded] = useState(false);
  const UpdateToken=useMutation(api.users.UpdateToken);

  useEffect(() => {
    if (id) {
      GetWorkspace();
    }
  }, [id]); // added id as dependency

  const GetWorkspace = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceid: id,
    });
    setMessages(Array.isArray(result?.messages) ? result.messages : []);
    console.log(result);
  };
  
  useEffect(()=>{
    if(messages?.length>0)
    {
      const role=messages[messages?.length-1].role;
      if(role=='user')
      {
        GetAiResponse();
      }
    }

  },[messages])

  const GetAiResponse=async()=>{
    setLoading(true);
    const PROMPT=JSON.stringify(messages)+Prompt.CHAT_PROMPT;
    const result=await axios.post('/api/ai-chat',{
      prompt:PROMPT
    });
    console.log(result.data.result);

    const aiResp={
      role:'ai',
      content:result.data.result
    }
    setMessages(prev=>[...prev,aiResp])
      
    
    await UpdateMeassages({
      messages:[...messages,aiResp],
      workspaceid:id
      
    })

    const token= Number(userDetail?.token)-Number( countToken(JSON.stringify(aiResp)))
    setUserDetail(prev=>({
      ...prev,
      token:token
    }))
    await UpdateToken({
      userid:userDetail?._id,
      token:token
    })

    setLoading(false);
  }
  
  const onGenerate = async () => {
    if(userDetail?.token<10){
      toast('You Dont Have Enough Token!!')
      return;
    }
    setMessages(prev => [...prev,{
      role:'user',
      content:userInput
    }])
    setUserInput("");
  }

 


  return (
    <div className={`flex gap-3 items-end m-0 p-0  ${
            isOpen ? "hidden" : "block"
          }`}>
     <div className="" >{userDetail && (
        <Image
          onClick={() => {
            if (!isOpen) toggleSidebar(); // only open if it's closed
          }}
          src={userDetail.picture}
          alt="user"
          width={95}
          height={95}
          className={`rounded-full w-16 cursor-pointer`}
        />
      )}</div>
    <div className="flex flex-col relative h-[88vh]" >
      <div className="flex-1 overflow-y-scroll ">{Array.isArray(messages) && messages?.map((msg, index) => (
        <div className="p-3 flex  gap-2 items-start rounded-lg mb-2 leading-7"
        style={{backgroundColor:Colors.CHAT_BACKGROUND}}
        key={index}>
           {msg?.role === "user" &&  (
         <Image
           src={userDetail?.picture}
           alt="userimage"
           width={35}
           height={35}
           className="rounded-full mr-2"
             />
             )}
            <ReactMarkdown className="flex flex-col">{msg.content}</ReactMarkdown>

          
        </div>
      ))}
      {loading && (
        <div className="p-3 flex gap-2 items-start rounded-lg mb-2"
        style={{backgroundColor:Colors.CHAT_BACKGROUND}}>
          <Loader2Icon className="animate-spin h-6 w-6 text-blue-500" />
          <h2>Generating...</h2>
        </div>
      )}
      </div>
      <div className='p-4 rounded-2xl max-w-2xl w-full border-2 mt-2 relative overflow-hidden 
     'style={{backgroundColor:Colors.BACKGROUND}}>

  {/* Top-left + left border cyan gradient glow */}
  <div className="absolute top-0 left-0 h-44 w-3 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent blur-md rounded-tl-xl z-10" />

  {/* Top-left horizontal bar for full corner coverage */}
  <div className="absolute top-0 left-0 w-44 h-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-transparent blur-md rounded-tl-xl z-10" />

  <div className='flex gap-2 relative z-20'>
    <textarea
      placeholder={Lookup.INPUT_PLACEHOLDER}
      value={userInput}
      onChange={(event) => setUserInput(event.target.value)}
      className="outline-none w-full h-32 bg-transparent max-h-52 resize-none p-4 pt-6"
    />
    {userInput && (
      <ArrowRight 
        onClick={onGenerate}
        className='bg-blue-500 h-8 w-8 p-1 rounded-md cursor-pointer' />
    )}
  </div>

  <div>
    <Link className='w-6 h-6' />
  </div>
     
      </div>
    </div>
    </div>
    
   
  );
}

export default ChatView;
