import { Button } from "@/components/ui/button"
import Image from 'next/image'
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '@/context/UserDetailContext'
import { ActionContext } from "@/context/ActionContext"
import { SigninCOntext } from "@/context/SignupContext"
import { useSidebar } from "@/components/ui/sidebar";

function Header() {
  const router = useRouter();

  const { userDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const { isOpen, toggleSidebar } = useSidebar();
  const { setSignin } = useContext(SigninCOntext); // ✅ access setSignin from context

  const handleClick = () => {
    router.push('/'); // Navigate to Hero or homepage
  }

  const onActionBtn = (actionType) => {
    setAction({
      actionType,
      timeStamp: Date.now()
    });
  }

  const onSigninClick = () => {
    setSignin(true); // ✅ open dialog when Sign In or Get Started clicked
  }

  return (
    <div className="flex items-center justify-between p-4">
      <Image onClick={handleClick} src={'/logo.png'} alt='Logo' height={40} width={40} />
      
      {userDetail?.name ? (
        <div className="flex gap-5 items-center justify-between">
          <Button
            onClick={() => onActionBtn('export')}
            className="h-8 bg-transparent text-white border-amber-50 border hover:bg-transparent hover:text-blue-100">
            Export
          </Button>
          <Button
            onClick={() => onActionBtn('deploy')}
            className="h-8 bg-blue-400 text-white hover:bg-blue-300">
            Deploy
          </Button>
          <Image
            src={userDetail.picture}
            onClick={() => {
              if (!isOpen) toggleSidebar();
            }}
            alt="user"
            width={95}
            height={95}
            className="rounded-full w-11 cursor-pointer"
          />
        </div>
      ) : (
        <div className="flex gap-5">
          <Button
            onClick={onSigninClick}
            className="h-8 bg-transparent text-white border-amber-50 border hover:bg-transparent hover:text-blue-100">
            Sign In
          </Button>
          <Button
            onClick={onSigninClick}
            className="h-8 bg-blue-400 text-white hover:bg-blue-300">
            Get Started
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header;
