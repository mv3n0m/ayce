'use client'
import Image from 'next/image'
import PrimaryButtonFull from '../../components/PrimaryButton';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import React, { useRef, useState } from "react";
import Alert from 'src/public/icons/alert.svg'
import { useRouter } from 'next/navigation';
import Logo from 'src/public/logos/color.svg'

const PayerDonationButtonPage = () => {
  const email = useRef("");
  const pass = useRef("");
  const router = useRouter();

  const [donationAmount, setDonationAmount] = useState();

  const handleContinueClick = () => {
    event?.preventDefault();
    // Navigate to the desired page, e.g., '/next-page'
    router.push('/payer/onchain-lightning');
  };

  return (
<main className='flex min-h-screen flex-col items-center relative justify-start bg-white lg:bg-background'>
        <div className='h-12 w-12 lg:h-16 lg:w-16 bg-line mt-12 mb-4 lg:mt-10 lg:mb-24 rounded-full'></div>

        <div className='flex flex-col lg:bg-white lg:rounded-3xl width-container lg:box-shadow'>
          <div className='flex flex-col justify-center items-center pt-0 pb-4 lg:py-10 border-b border-line'>
            <p className='body-lg text-title-active px-6 lg:px-0 font-bold mb-2'>Donation to BreastCancer.org</p>
            <p className='body text-body-primary px-6 lg:px-0 mb-4'>BreastCancer.org is a 501(c)(3) tax-exempt organization.</p>
            <input
              type="number"
              value={donationAmount || undefined}
              placeholder='0 USD'
              onChange={e => setDonationAmount(e.target.value)}
              className='text-title-active h3 w-full inputnoborder mx-auto text-center'
            />
          </div>

          <form className='pt-15 px-6 lg:px-10 lg:pt-10' onSubmit={handleContinueClick}>
              <div className='mb-2'>
                  <label className='hidden'>Full name</label>
                  <input className='bg-background p-4 w-full body rounded-2xl'
                      type={"text"}
                      required
                      placeholder="Full name"
                      onChange={(e) => (pass.current = e.target.value)}
                  />
              </div>
              <div className='mb-6'>
                  <label className='hidden'>Email</label>
                  <input className='bg-background p-4 w-full body rounded-2xl'
                      type={"email"}
                      required
                      placeholder="Email"
                      onChange={(e) => (email.current = e.target.value)}
                  />
              </div>

              <h6 className='display mb-4'>
                <button className='flex items-center justify-center mx-auto w-full bg-primary-button text-white px-10 py-4 font-bold primary-button'>Continue</button>
              </h6>
          </form>
          <p className='meta text-body-secondary px-10 pb-10'>By providing your information, you give explicit consent to AYCE Express to store and provide this information to the merchant. <span><Link href='' className='text-primary-default'>View Privacy Policy</Link></span></p>
        </div>

        <div className='flex items-center mt-auto mb-6 lg:mb-10'>
          <p className='body-sm text-body-secondary mr-1.5'>powered by</p>
          <Logo className='h-6'/>
        </div>

    </main>
  )
  
}

export default PayerDonationButtonPage;