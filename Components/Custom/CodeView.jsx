"use client";
import React, { useContext, useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import axios from "axios"; // Added import
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { countToken } from "./ChatView";

import { UserDetailContext } from "@/context/UserDetailContext";
import SandpackPrev from "@/components/Custom/SandpackPrev";
import { ActionContext } from "@/context/ActionContext";


function CodeView() {
  const {id}=useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const UpdateFiles=useMutation(api.workspace.UpdateFiles)
  const convex=useConvex();
  const[loading,setLoading]=useState(false)
  const{userDetail,setUserDetail}=useContext(UserDetailContext);
  const{action,setAction}=useContext(ActionContext);
  const UpdateToken=useMutation(api.users.UpdateToken);

  useEffect(()=>{
    id&&GetFiles();
  },[id])

  useEffect(()=>{
    setActiveTab('preview')
  },[action])
  
  const GetFiles=async()=>{
    setLoading(true)
    const result=await convex.query(api.workspace.GetWorkspace,{
      workspaceid:id,
    })
    
    const mergedFiles = {
      ...Lookup.DEFAULT_FILE,
      ...result?.fileData,
    };
    setFiles(mergedFiles);
    setLoading(false)
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === "user") {
        GenrateAiCode();
      }
    }
    // eslint-disable-next-line
  }, [messages]);

const GenrateAiCode = async () => {
  setLoading(true);

  const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
  const result = await axios.post('/api/gen-ai-code', { prompt: PROMPT });
  console.log("AI response:", result.data);
  const aiResp = result.data;

  if (aiResp?.files) {
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
    setFiles(mergedFiles);

    await UpdateFiles({
      workspaceid: id,
      files: aiResp.files
    });

    const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
     setUserDetail(prev=>({
      ...prev,
      token:token
    }))
    await UpdateToken({
      userid: userDetail?._id,
      token: token
    });
    setActiveTab('code');
  } else {
    alert("AI did not return any files. Please try again or check your prompt.");
  }

  setLoading(false);
};
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2">
        <div className="flex items-center flex-wrap gap-3 shrink-0 bg-black p-2 w-[140px] justify-center rounded-full ">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab === 'code' && 'text-blue-900 bg-blue-300  p-1 px-2 rounded-full '}`}>
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab === 'preview' && 'text-blue-900 bg-blue-300  p-1 px-2 rounded-full '}`}>
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        files={files}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY
          }
        }}
        options={{
          externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
             <SandpackPrev/>
            </>
          )}
        </SandpackLayout>
        
      </SandpackProvider>
     {loading && <div className="p-10 bg-gray-900 opacity-85 absolute top-0 w-full h-full rounded-large flex items-center justify-center" >
        <Loader2Icon className="animate-spin w-10 h-10 text-blue-500"/>
        <h2 className="text-blue-500">Generating your code files...</h2>
      </div>}
    </div>
  );
}

export default CodeView;
