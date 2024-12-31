'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Logomark from 'src/public/logos/logomark-color.svg'
import Back from 'src/public/icons/back.svg'
import PrimaryButtonFull from '../../../../components/PrimaryButtonFull';
import { useState, useRef } from 'react';
import ArrowDown from 'src/public/icons/arrow-down.svg'
import Document from 'src/public/icons/document.svg'
import Upload from 'src/public/icons/upload.svg'
import Download from 'src/public/icons/download.svg'
import OtpInput from 'react-otp-input';


export default function PayoutsPage() {

  const [createStep, setCreatestep] = useState(0);
  const [currency, setCurrency] = useState('BTC');
  const [source, setSource] = useState('BTC');
  const [recipientID, setRecipientID] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');


  // Next step for transfer
  const nextStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep + 1);
  };

  // Event handlers to update state
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleRecipientIDChange = (e) => {
    setRecipientID(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  return (
    <div className='flex mx-2 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/payments'>
          <Back className='h-6 w-6 text-title-active mr-5 flex lg:hidden' />
          </Link>
          <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <Link href="/dashboard/payments/payouts" className='text-body-secondary body hover:text-title-active'>Payouts</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <p className='text-title-active body'>One-off transfer</p>
        </div>

        <h4 className='display mb-1 lg:mb-10 hidden lg:flex'>One-off transfer</h4>

        {createStep === 0 && (
          <form className='w-full flex flex-col' onSubmit={nextStep}>
              <div className='flex flex-col'>
                  <div className="rounded-4xl border-line border-2 flex flex-col payment-create p-4 lg:px-10 lg:py-10 mx-auto box-shadow">
                      <div className='flex flex-col items-center w-full'>

                      <p className='body-lg text-title-active font-bold mb-4'>One-off Transfer</p>

                      <label htmlFor="recipient-id" className='body-sm mr-auto font-bold text-body-secondary mb-1'>Recipient ID</label>
                      <input className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4'
                          id="recipient-id"
                          type="text"
                          value={recipientID}
                          onChange={handleRecipientIDChange}
                          required
                          placeholder="AYCE Express ID"
                      />

                      <label htmlFor="source" className='body-sm text-body-secondary font-bold mb-1 mr-auto'>Source</label>
                      <div className='relative w-full'>
                          <select 
                          id="source"
                          name="Source" 
                          className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 border border-line'
                          value={source}
                          onChange={handleSourceChange}
                          required
                          >
                          <option value="BTC">BTC wallet</option>
                          <option value="$">USD wallet</option>
                          </select>
                          <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                      </div>

                      <label htmlFor="currency" className='body-sm text-body-secondary font-bold mb-1 mr-auto'>Currency</label>
                      <div className='relative w-full'>
                          <select 
                          id="currency"
                          name="currency" 
                          className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 border border-line'
                          value={currency}
                          onChange={handleCurrencyChange}
                          required
                          >
                          <option value="BTC">BTC</option>
                          <option value="$">USD</option>
                          </select>
                          <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                      </div>

                      <label htmlFor="amount" className='body-sm mr-auto font-bold text-body-secondary mb-1'>Amount</label>
                      <input className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4'
                          id="amount"
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          required
                          placeholder="0"
                      />

                      <div className='flex flex-col w-full'>
                          <h6 className='display max-w-fit mx-auto mt-8' >
                          <PrimaryButtonFull text="Continue" />
                          </h6>
                      </div>
                      </div>
                  </div>
              </div>
          </form>
      )}


          {createStep === 1 && (
            <div className='rounded-4xl border-line border-2 flex flex-col payment-create p-4 lg:px-10 lg:py-10 mx-auto box-shadow'>
              <Logomark className='h-12 w-12 mb-10 mx-auto hidden lg:flex' />
              <h5 className='text-title-active font-bold mb-4'>Enter the 6-digit code from you verification email</h5>
              <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to john@example.com</p>
              <form className='w-full'>
                <div className='mb-4 w-full'>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => <input {...props} className="otp-input" />}
                  containerStyle={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                  }}
                  inputStyle={{
                    width: '56px',
                    height: '64px',
                    margin: '0 5px',
                    padding: '16px',
                    fontSize: '24px',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #ccd5da',
                  }}
                />
                </div>
                <div className='flex flex-col items-center justify-start'>
                <button className='text-primary-default body mb-4 lg:mb-10'>Resend code</button>
                <button className='text-primary-default body'>Or use authenticator app</button>
                </div>
              </form>
            </div>
          )}

        </div>
    </div>
  )
}
