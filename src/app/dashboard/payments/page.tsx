import Image from 'next/image'
import Link from 'next/link';
import SideMenu from '../../components/SideMenu'
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Billing from 'src/public/icons/billing.svg'
import Pos from 'src/public/icons/pos.svg'
import Buttons from 'src/public/icons/buttons.svg'
import Payouts from 'src/public/icons/payouts.svg'

export default function PaymentsPage() {
  return (
    <div className='flex mx-6 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>
        <h4 className='display mb-5 lg:mb-14'>Payments</h4>
        <h5 className='display mb-4 lg:mb-6'>Payment tools</h5>
        <div className='w-full flex flex-col gap-y-7 mb-7 lg:mb-0 lg:grid lg:grid-rows-2 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-3'>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/payments/billing-invoice'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Billing/Invoice</p>
              <p className='text-body-primary body'>Create, send and track invoices.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <Billing className='m-4'/>
            </div>
          </Link>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/payments/pos'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>POS App</p>
              <p className='text-body-primary body'>Process a point-of-sale transaction.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <Pos className='m-4'/>
            </div>
          </Link>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/payments/payment-buttons'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Payment Buttons</p>
              <p className='text-body-primary body'>Generate a payment link for sales or donations.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <Buttons className='m-4'/>
            </div>
          </Link>

          <Link className='flex justify-between border-line border rounded-3xl px-8 py-6' href='/dashboard/payments/payouts'>
            <div className='flex flex-col'>
              <p className='text-title-active body-lg font-bold mb-2'>Payouts</p>
              <p className='text-body-primary body'>Initiate a mass payout or one-off transfer.</p>
            </div>
            <div className='bg-primary-background h-20 w-20 flex items-center justify-center rounded-full'>
              <Payouts className='m-4'/>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
