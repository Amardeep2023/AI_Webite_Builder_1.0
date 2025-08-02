"use client"
import Lookup from '@/data/Lookup'
import React from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useContext } from 'react';
import PricingModel from '@/components/Custom/PricingModel';
import Colors from '@/data/Colors';

function pricing() {
  const{userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='mt-10 flex flex-col justify-center items-center w-full p-10 md:px-32 lg:px-48 gap-5 '
    
    >
        <h2 className='font-bold text-5xl text-center'>Pricing</h2>
        <p className='text-gray-400 text-center max-w-xl mt-2'>{Lookup.PRICING_DESC}</p>
      <div className='p-5 border rounded-xl w-full flex justify-between' 
      style={{backgroundColor:Colors.BACKGROUND}}>
        <h2 className='font-bold flex gap-2 items-center'><span className='text-lg'>{userDetail?.token}</span>Tokens Left</h2>
        <div>
          <h2 className='font-medium'>Need more tokens?</h2>
          <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel/>
    </div>
  )
}

export default pricing
