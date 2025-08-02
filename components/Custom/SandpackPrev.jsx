import React from 'react'
import { useRef,useEffect,useContext} from 'react'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { useSandpack } from '@codesandbox/sandpack-react';
import { ActionContext } from '@/context/ActionContext';
function SandpackPrev() {
    const previewRef=useRef();
    const { sandpack } = useSandpack();
     const {action,setAction}=useContext(ActionContext);
    
    useEffect(()=>{
      GetClient();
    },[sandpack && action])

    const GetClient=async()=>{
        const client=previewRef.current.getClient();
        if(client){
            console.log(client)
            const result=await client.getCodeSandboxURL();
           if(action.actionType=='deploy'){
            window.open('https://'+result?.sandboxId+'.csb.app/')
           }
           else if(action.actionType=='export'){
            window.open(result?.editorUrl)
           }
        }
    }
  return (
    <SandpackPreview 
    ref={previewRef}
    style={{ height: "80vh" }} showNavigator={true} />
  )
}

export default SandpackPrev
