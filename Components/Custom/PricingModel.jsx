'use client'

import Lookup from '@/data/Lookup'
import React, { useState, useContext, useEffect } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { UserDetailContext } from '@/context/UserDetailContext'
import Colors from '@/data/Colors'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [selectedOpt, setSeletedOpt] = useState()
  const [showSuccess, setShowSuccess] = useState(false)
  const UpdateToken = useMutation(api.users.UpdateToken)

  const OnSuccess = async () => {
    const token = Number(userDetail?.token) + Number(selectedOpt?.value)
    await UpdateToken({
      userid: userDetail?._id,
      token: token
    })

    setShowSuccess(true)

    
    
  }

  return (
    <>
      {showSuccess && (
        <div
          className='border rounded-2xl flex flex-col justify-center items-center w-full relative h-64 shadow-lg bg-green-50 z-50'
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <button
            onClick={() => setShowSuccess(false)}
            className='absolute top-2 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold'
          >
            ×
          </button>
          <h2 className='font-bold text-5xl text-green-700 mb-2'>Payment Successful!</h2>
          <p className='text-center text-2xl text-gray-700'>Continue Using Your Services</p>
        </div>
      )}

      <div className='p-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div key={index} className='border p-4 flex flex-col gap-3'>
            <h2 className='font-bold text-2xl'>{pricing.name}</h2>
            <h2 className='font-medium text-lg'>{pricing.tokens}</h2>
            <p className='text-sm text-gray-400'>{pricing.desc}</p>
            <h2 className='font-bold text-2xl text-center flex flex-col'>${pricing.price}</h2>

            <PayPalButtons
              style={{ layout: 'horizontal' }}
              onClick={() => {
                setSeletedOpt(pricing)
                console.log(pricing.value)
              }}
              disabled={!userDetail}
              onApprove={() => OnSuccess()}
              onCancel={() => console.log('Payment Cancelled')}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: pricing.price,
                        currency_code: 'USD'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default PricingModel
