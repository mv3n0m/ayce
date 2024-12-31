import Image from 'next/image'
import Link from 'next/link';
import SideMenu from '../../components/SideMenu'
import BusinessInfo from 'src/public/icons/business-info.svg'
import Profile from 'src/public/icons/profile.svg'
import Pos from 'src/public/icons/pos.svg'
import Buttons from 'src/public/icons/buttons.svg'
import PaymentInfo from 'src/public/icons/payment-info.svg'
import Document from 'src/public/icons/document.svg'

export default function SettingsPage() {
  return (
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>
        <div className='flex justify-between items-center mb-14'>
          <h4 className='display'>Settings</h4>
          <div className='flex items-start justify-center'>
            <Link href='' className='text-primary-default'>Help Center</Link>
            <Document className='text-primary-default w-6 h-6' />
          </div>
        </div>
        <div className='w-full grid grid-rows-2 grid-cols-2 gap-x-4 gap-y-3'>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/settings/profile'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Profile</p>
              <p className='text-body-primary body'>Edit personal account information.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <Profile className='m-4'/>
            </div>
          </Link>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/settings/business-information'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Business Information</p>
              <p className='text-body-primary body'>Name, address, phone, email.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <BusinessInfo className='m-4'/>
            </div>
          </Link>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/settings/payment-information'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Payment Information</p>
              <p className='text-body-primary body'>Automatic conversion or split settlement.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <PaymentInfo className='m-4'/>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
