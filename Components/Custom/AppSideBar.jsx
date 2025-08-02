import React from 'react'
import Image from 'next/image'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from '../ui/button'
import { MessageCircleCodeIcon } from 'lucide-react'
import WorkSpaceHist from './WorkSpaceHist'
import   Footer  from '@/Components/Custom/Footer'

function AppSideBar() {
  return (
      <Sidebar>
      
      <SidebarHeader className={'pt-1 flex flex-col gap-5 mb-2'}>
        <Image className='mt-2' src={'/logo.png'} alt='logo ' height={30} width={30} />
        <Button className={'mt-2 w-full'}><MessageCircleCodeIcon/>Start new chat</Button>
      </SidebarHeader>
      <SidebarContent>
        
        <SidebarGroup >
            <WorkSpaceHist/>
        </SidebarGroup>
        {/*<SidebarGroup />*/}
      </SidebarContent>
        <SidebarFooter >
          <Footer/>
      </SidebarFooter>

    </Sidebar>
  )
}

export default AppSideBar
