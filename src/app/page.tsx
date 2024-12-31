import Image from 'next/image'
import PrimaryButton from './components/PrimaryButton';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col bg-background p-4'>
      <p className='body-xl mb-6 pl-4'>AYCE App Sitemap</p>

      <div className='flex w-full h-screen justify-start gap-x-6 border-t border-line'>

        <div className='mb-6 max-w-fit border-r border-line px-4 pt-4'>
          <p className='body-lg underline'>Auth</p>
          <div className='flex flex-col'>
              <Link className='' href="/login">- login</Link>
              <Link className='' href="/sign-up">- sign up</Link>
              <Link className='' href="/sign-up-email">- sign up email verification</Link>
              <Link className='' href="/forgot-password">- forgot password</Link>
              <Link className='' href="/reset-password">- reset password</Link>
              <Link className='' href="/reset-password-email">- reset password email verification</Link>

              <p className='body-lg underline pt-10'>KYC onboarding</p>
              <div className='flex flex-col'>
                  <Link className='' href="/onboard/about">- about</Link>
                  <Link className='' href="/onboard/documents">- activities</Link>
                  <Link className='' href="/onboard/settlement-billing">- settlement/billing</Link>
                  <Link className='' href="/onboard/business-rep">- authorized representative</Link>
                  <Link className='' href="/onboard/owner">- beneficial owner information</Link>
                  <Link className='' href="/onboard/review">- summary</Link>
              </div>
          </div>
        </div>


        <div className='mb-6 max-w-fit border-r border-line px-4 pt-4'>
          <p className='body-lg underline'>Dashboard</p>
          <div className='flex flex-col'>
              <Link className='' href="/dashboard/overview">- overview</Link>
              <Link className='' href="/dashboard/activities">- activities</Link>
              <div className='flex flex-col ml-4'>
                <Link className='' href="/dashboard/activities/download">- download</Link>
              </div>
              <Link className='' href="/dashboard/wallets">- wallets</Link>
              <div className='flex flex-col ml-4'>
                <Link className='' href="/dashboard/wallets/btc">- btc wallet</Link>
                <Link className='' href="/dashboard/wallets/usd">- usd wallet</Link>
              </div>
              <Link className='' href="/dashboard/payments">- payments</Link>
              <div className='flex flex-col ml-4'>
                <Link className='' href="/dashboard/payments/billing-invoice">- billing/invoice</Link>
                  <div className='flex flex-col ml-4'>
                  <Link className='' href="/dashboard/payments/billing-invoice/create-invoice">- create invoice</Link>
                  </div>
                <Link className='' href="/dashboard/payments/pos">- POS app</Link>
                <Link className='' href="/dashboard/payments/payment-buttons">- payment buttons</Link>
                  <div className='flex flex-col ml-4'>
                  <Link className='' href="/dashboard/payments/payment-buttons/create-donation">- create donation</Link>
                  <Link className='' href="/dashboard/payments/payment-buttons/create-payment">- create payment</Link>
                  </div>
                <Link className='' href="/dashboard/payments/payouts">- payouts</Link>
                  <div className='flex flex-col ml-4'>
                    <Link className='' href="/dashboard/payments/payouts/mass-payout">- mass payouts</Link>
                    <Link className='' href="/dashboard/payments/payouts/one-off-transfer">- one-off transfer</Link>
                  </div>
              </div>
              <Link className='' href="/dashboard/developers">- developers</Link>
              <Link className='' href="/dashboard/settings">- settings</Link>
                <div className='flex flex-col ml-4'>
                <Link className='' href="/dashboard/settings/profile">- profile</Link>
                <Link className='' href="/dashboard/settings/business-information">- business information</Link>
                <Link className='' href="/dashboard/settings/payment-information">- payment information</Link>
                </div>
                
          </div>
        </div>

        <div className='mb-6 max-w-fit px-4 pt-4'>
          <p className='body-lg underline'>Payment for payer</p>
          <div className='flex flex-col'>
              <Link className='' href="/payer/payment-button">- payment-button</Link>
              <Link className='' href="/payer/donation-button">- donation-button</Link>
              <Link className='' href="/payer/onchain-lightning">- On-chain / Lightning payment</Link>
              <Link className='' href="/payer/invoice">- billing/invoice payment page</Link>
          </div>
        </div>
      </div>
    </main>
  )
  
}
