import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '../ui/button'


import { Ghost, HelpCircle, LogOutIcon, Settings, Wallet } from 'lucide-react'


import { UserDetailContext } from '@/context/UserDetailContext'

import { useSidebar } from '@/components/ui/sidebar'


function Footer() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { isOpen, toggleSidebar } = useSidebar();
  const router = useRouter();

  const options = [
    { name: 'Settings', icon: Settings },
    { name: 'Help Center', icon: HelpCircle },
    { name: 'My Subscription', icon: Wallet, path: '/pricing' },
    { name: 'Sign Out', icon: LogOutIcon, path: '/' }
  ];

  const optionClick = (option) => {
    if (option.name === 'Sign Out') {
      setUserDetail(null);              // clear context
      localStorage.removeItem('user');  // clear local storage if used
      router.push('/');                 // redirect to home
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className="p-1 mb-10">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={'ghost'}
        onClick={() => {
    optionClick(option);
    if (!isOpen) toggleSidebar();
   }}
          
          className={'w-full -ml-5 mt-1 -mb-10 justify-start text-lg text-gray-300'}
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
      <div>
        {userDetail && (
          <Image
            onClick={() => {
              if (!isOpen) toggleSidebar();
            }}
            src={userDetail.picture}
            alt="user"
            width={95}
            height={95}
            className="rounded-full w-11 cursor-pointer mt-5 -mb-5"
          />
        )}
      </div>
    </div>
  );
}

export default Footer;
