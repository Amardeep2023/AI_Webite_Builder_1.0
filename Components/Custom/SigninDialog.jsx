import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'

import { useGoogleLogin } from '@react-oauth/google'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useContext } from 'react'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import {api} from '@/convex/_generated/api';
import { v4 as uuid4 } from 'uuid';
import AuthBox from './AuthBox'
import { SigninCOntext } from '@/context/SignupContext'




export function SigninDialog({openDialog,closeDialog}) {
    const{userDetail,setUserDetail}=useContext(UserDetailContext);
   const CreateUser = useMutation(api.users.CreateUser);  
     const { signin, setSignin } = useContext(SigninCOntext);
    


const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
    );

    console.log(userInfo);
    const user = userInfo.data;
    await CreateUser({
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      uid: uuid4()
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(user));
    }

    setUserDetail(userInfo?.data);
    setSignin(false);
  },
  onError: errorResponse => console.log(errorResponse),
});

  return (
     <div>
       <Dialog open={signin} onOpenChange={setSignin}>
  <DialogTrigger></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription asChild>
  <div className='flex flex-col items-center gap-2'>
    <p className='text-white font-bold text-2xl text-center'>{Lookup.SIGNIN_HEADING}</p>
    <p className='mt-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</p>
    <Button className='mt-2 bg-blue-400 hover:bg-blue-300 text-white' onClick={googleLogin}>
      Sign In With Google
    </Button>
    <p className='mt-2 text-center'>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
  </div>
</DialogDescription>

    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default SigninDialog
