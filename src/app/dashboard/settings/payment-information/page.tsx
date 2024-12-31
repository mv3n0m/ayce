'use client'
import { useState, useRef } from 'react';
import Link from 'next/link';
import SideMenu from '../../../components/SideMenu'
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import Right from 'src/public/icons/right.svg'
import ArrowRight from 'src/public/icons/arrow-right.svg'
import InstantBitcoin from 'src/public/icons/instant-bitcoin.svg'
import Document from 'src/public/icons/document.svg'
import Edit from 'src/public/icons/edit.svg'

import Conversion from 'src/public/icons/conversion.svg'

export default function PaymentInformationPage() {

  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };
  
  return (
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <style jsx>{`
      .sliderbox {
        width: 46px;
      }
    `}</style>
      <div className='flex flex-col w-full relative'>

        <div className='-top-22 left-0 absolute flex items-center'>
          <Link href="/dashboard/settings/" className='text-body-secondary body hover:text-title-active'>Settings</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-2' />
          <p className='text-title-active body'>Payment Information</p>
        </div>
        <div className='flex justify-between items-center mb-14'>
          <h4 className='display'>Payment information</h4>
          <Link className='text-primary-default body flex items-center' href=''>
            Help Center
            <Document className='text-primary default h-6 w-6' />
          </Link>
        </div>

        <div className='border border-line rounded-3xl py-6 px-8 w-1/2'>
          <p className='text-title-active body-lg font-bold mb-4'>Payment</p>
          <div className='flex items-center justify-between'>
            <div>
            <p className='text-title-active body font-bold'>Automatic conversion</p>
            <p className='text-body-primary body-sm'>Auto-convert settlement funds into a specific currency</p>
            </div>
            <input 
              type="checkbox" 
              className='toggle'
              id="toggle1" /><label 
              htmlFor='toggle1' 
              className='toggle'
              >Toggle</label>
          </div>
          <div className='border-b border-line my-4'></div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-title-active body font-bold'>Split settlement</p>
              <p className='text-body-primary body-sm'>Retain a percentage of settlement funds in BTC.</p>
              </div>
              <input 
                type="checkbox" 
                className='toggle'
                onChange={handleCheckboxChange} 
                checked={isChecked}
                id="toggle2" />
                <label 
                htmlFor='toggle2' 
                className='toggle'
                >Toggle</label>
          </div>
          {isChecked && (
          <div className='mt-4'>
            <div className='flex justify-between items-center mb-4'>
              <p className='text-title-active body font-bold'>BTC settlement ratio</p>
              <div className='border border-line rounded-md'>
                <p className='text-body-primary body-sm my-0.5 sliderbox text-right mr-2'>{sliderValue}%</p>
              </div>
            </div>

            <div className='slider-container'>
              <div className='slider-track'></div>
              <div 
                className='slider-fill' 
                style={{width: `${sliderValue}%`}}
              ></div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={handleSliderChange} 
                className="slider w-full" 
                id="myRange" 
              />
            </div>
          </div>
          )}

          <div className='border-b border-line my-4'></div>
          <div className='flex items-center justify-between'>
            <div>
            <p className='text-title-active body font-bold'>Settlement account</p>
            <p className='text-body-primary body-sm'>*****1234</p>
            </div>
            <button>
              <Edit className='text-primary-default w-6 h-6' />
            </button>
          </div>
          </div>
        </div>



    
    </div>
  )
}
