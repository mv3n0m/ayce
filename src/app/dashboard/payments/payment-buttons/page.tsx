'use client'
import Image from 'next/image'
import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import Download from 'src/public/icons/download.svg'
import Search from 'src/public/icons/search.svg'
import SortAscend from 'src/public/icons/sort-ascend.svg'
import SortDescend from 'src/public/icons/sort-descend.svg'
import { useState, useEffect } from 'react';
import SecondaryButton from '../../../components/SecondaryButton';
import Right from 'src/public/icons/arrow-right.svg'

export default function PaymentButtonPage() {

  const [selectedButton, setSelectedButton] = useState('Payment links');

  const renderButton = () => {
    switch(selectedButton) {
      case 'Payment links':
        return (
          <Link className='body bg-primary-default font-bold text-white py-2 px-6 flex justify-center noshadow-button' href='/dashboard/payments/payment-buttons/create-payment'>Create payment</Link>
        );
      case 'Donations':
        return (
          <Link className='body bg-primary-default font-bold text-white py-2 px-6 flex justify-center noshadow-button' href='/dashboard/payments/payment-buttons/create-donation'>Create donation</Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex mx-16 mt-32 w-full relative sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='flex items-center mb-6'>
          <div className='-top-22 left-0 absolute flex items-center'>
            <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
            <Right className='h-6 w-6 text-title-active mx-2' />
            <p className='text-title-active body'>Payment Buttons</p>
          </div>
          
          <h4 className='display mb-2 mr-10 whitespace-nowrap'>Payment buttons</h4>

          <div className='flex justify-between w-full'>
            <div className='flex space-x-6'>
            <button onClick={() => setSelectedButton('Payment links')} className={`text-body-secondary body-sm font-bold ${selectedButton === 'Payment links' ? 'text-title-active' : ''}`}>Payment links</button>
        <button onClick={() => setSelectedButton('Donations')} className={`text-body-secondary body-sm font-bold ${selectedButton === 'Donations' ? 'text-title-active' : ''}`}>Donations</button>
            </div>
            {renderButton()}
          </div>

        </div>
        <div className='relative mb-6'>
          <label className='hidden'></label>
          <input className='bg-background py-4 pr-4 pl-12 w-full body rounded-2xl'
              type={"text"}
              placeholder='Search'
          />
          <Search className='h-6 w-6 text-body-primary absolute top-4 left-4' />
        </div>

        <div className=''>

          <table className="table-auto w-full">
            <thead className='border-b border-line'>
              <tr className=''>
                <th className='body-sm font-bold text-title-active text-left py-1.5'>Product</th>

                <th className='body-sm font-bold text-title-active text-left py-1.5'>Description</th>

                <th className='body-sm font-bold text-title-active text-left py-1.5'>Amount</th>
              </tr>
            </thead>
            <tbody>
              
              <tr className='border-b border-line'>
                <td><p className='body text-body-primary'>Item 1</p></td>
                <td className='flex items-center py-4'><p className='body text-body-primary'>Lorem ipsum dolor sit amet, consectetur adipiscing...</p></td>
                <td><p className='body text-body-primary'>$50.00</p></td>
              </tr>

              <tr className='border-b border-line'>
                <td><p className='body text-body-primary'>Item 2</p></td>
                <td className='flex items-center py-4'><p className='body text-body-primary'>Lorem ipsum dolor sit amet, consectetur adipiscing...</p></td>
                <td><p className='body text-body-primary'>$50.00</p></td>
              </tr>

              <tr className='border-b border-line'>
                <td><p className='body text-body-primary'>Item 3</p></td>
                <td className='flex items-center py-4'><p className='body text-body-primary'>Lorem ipsum dolor sit amet, consectetur adipiscing...</p></td>
                <td><p className='body text-body-primary'>$50.00</p></td>
              </tr>



            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
