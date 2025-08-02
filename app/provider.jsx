"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/Components/Custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSideBar from "@/Components/Custom/AppSideBar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ActionContext } from '@/context/ActionContext'
import { SigninCOntext } from '@/context/SignupContext'
import { useRouter } from 'next/navigation'


function Provider({ children }) {
 
  const[messages,setMessages]=useState([])
  const[userDetail,setUserDetail]=useState()
  const[signin,setSignin]=useState();
  const[action,setAction]=useState();
  const convex=useConvex();
  const router=useRouter();

  useEffect(()=>{
    ISAuthenticated();
  },[])
  const ISAuthenticated=async()=>{
    if(typeof window !==undefined){
      const user=JSON.parse(localStorage.getItem('user'));
      if(!user){
        router.push('/')
        return;
      }
      const result=await convex.query(api.users.GetUser,{ email: user?.email 

      });
      setUserDetail(result)
      console.log(result);
    }
  }

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
         <PayPalScriptProvider options={{ clientId:process.env.NEXT_PUBLIC_PAYPAL_CLIENT }}>
      <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
       <MessagesContext.Provider value={{messages,setMessages}}>
        <SigninCOntext.Provider value={{signin,setSignin}}>
        <ActionContext.Provider value={{action,setAction}}>
        <NextThemesProvider
          attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          
            
          <SidebarProvider defaultOpen={false}>
            <Header/>
            <AppSideBar />
            {children}
          </SidebarProvider>  
        </NextThemesProvider>
        </ActionContext.Provider>
        </SigninCOntext.Provider>
        </MessagesContext.Provider>
        </UserDetailContext.Provider>
        </PayPalScriptProvider>
        </GoogleOAuthProvider>
        
      
    </div>
  )
}

export default Provider
