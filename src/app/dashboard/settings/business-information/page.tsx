'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Document from 'src/public/icons/document.svg'
import Close from 'src/public/icons/close.svg'
import { useState } from 'react';

export default function BusinessInformationPage() {

  const [modalOpen, modalIsOpen] = useState(false);

  const openModal = () => {
    modalIsOpen(true);
  };

  const closeModal = () => {
    modalIsOpen(false);
  };
  
  return (
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='-top-22 left-0 absolute flex items-center'>
          <Link href="/dashboard/settings/" className='text-body-secondary body hover:text-title-active'>Settings</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-2' />
          <p className='text-title-active body'>Business Information</p>
        </div>
        <div className='flex justify-between items-center mb-14'>
          <h4 className='display'>Business information</h4>
          <Link className='text-primary-default body flex items-center' href=''>
            Help Center
            <Document className='text-primary default h-6 w-6' />
          </Link>
        </div>

        <div className='border border-line rounded-3xl py-6 px-8 w-1/2 mb-4'>
          <div className='flex items-center justify-between'>
            <p className='text-title-active body-lg font-bold mb-4'>Business</p>
            <button onClick={openModal}>
              <p className='text-primary-default body'>Request to change</p>
            </button>
          </div>
          <p className='text-title-active body font-bold'>Name</p>
          <p className='text-body-primary body-sm'>ABC Company</p>
          <div className='border-b border-line my-4'></div>
          <p className='text-title-active body font-bold'>Business representative</p>
          <p className='text-body-primary body-sm'>John Doe</p>
          <div className='border-b border-line my-4'></div>
          <p className='text-title-active body font-bold'>Contact email</p>
          <p className='text-body-primary body-sm'>john@example.com</p>
          <div className='border-b border-line my-4'></div>
          <p className='text-title-active body font-bold'>Phone</p>
          <p className='text-body-primary body-sm'>+1 123-456-7890</p>
          <div className='border-b border-line my-4'></div>
          <p className='text-title-active body font-bold'>Business address</p>
          <p className='text-body-primary body-sm'>123 A Street
            <br />
            City, State
            <br />
            12345
            <br />
            Country</p>
            <div className='border-b border-line my-4'></div>
            <p className='text-title-active body font-bold'>Business registration number</p>
          <p className='text-body-primary body-sm'>*****1234</p>
          <div className='border-b border-line my-4'></div>
          <p className='text-title-active body font-bold'>Website</p>
          <p className='text-body-primary body-sm'>example.com</p>
        </div>
      </div>
      
      {modalOpen && (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
        <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>

          <p className="font-bold body-lg text-title-active">Request to change</p>
          <p className='body text-body-primary my-4'>Please contact us at support@ayce.co to make changes to your business information. We will need to validate your new business info.</p>
          <button onClick={closeModal} className='body text-primary-default'>Cancel</button>

          {/* close button */}
          <button onClick={closeModal} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
            <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
              <Close className='h-6 w-6 text-primary-default' />
            </div>
          </button>
        </div>
      </div>
      )}
    </div>
  )
}
