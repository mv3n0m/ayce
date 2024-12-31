'use client'

import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import Info from 'src/public/icons/info.svg'
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Logomark from 'src/public/logos/logomark-color.svg'
import Switch from 'src/public/icons/switch.svg'
import Success from 'src/public/icons/success-emblem.svg'
import Back from 'src/public/icons/back.svg'
import SwitchAlt from 'src/public/icons/switch2.svg'
import PrimaryButtonFull from '../../../components/PrimaryButtonFull';
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';


export default function PayoutsPage() {
  const [walletTabState, setWalletTabState] = useState('transfer');

  const [inputUsdValue, setInputUsdValue] = useState('');
  const [exchangeUsdValue, setExchangeUsdValue] = useState('');
  const [inputUsdAddress, setInputUsdAddress] = useState('');

  const [transferStepUsd, setTransferstepUsd] = useState(0);
  const [exchangeStepUsd, setExchangestepUsd] = useState(0);

  const [otp, setOtp] = useState('');

  // Event handler to update state
  const handleWalletTabChange = (e) => {
    setWalletTabState(e.target.value);
  };

  // Next step for transfer
  const nextTransferUsd = async (event) => {
    event.preventDefault();
    setTransferstepUsd(transferStepUsd + 1);
  };

    // Next step for exchange
    const nextExchangeUsd = async (event) => {
      event.preventDefault();
      setExchangestepUsd(exchangeStepUsd + 1);
    };

  // if otp is full at 6 char, go to next transfer step
  useEffect(() => {
    if (otp.length === 6) {
      setTransferstepUsd((prevStep) => prevStep + 1);
    }
  }, [otp]);
  
  return (
    <div className='flex mx-2 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/wallets'>
          <Back className='h-6 w-6 text-title-active mr-5 flex lg:hidden' />
          </Link>
          <Link href="/dashboard/wallets/" className='text-body-secondary body hover:text-title-active'>Wallets</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          {walletTabState === 'transfer' && (
            <div>
              <p className='text-title-active body'>Transfer</p>
            </div>
          )}
          {walletTabState === 'exchange' && (
            <div>
              <p className='text-title-active body'>Exchange</p>
            </div>
          )}
        </div>

        <h4 className='display mb-1 lg:mb-2 hidden lg:flex'>Wallets</h4>
        <p className='body text-body-secondary mb-4 lg:mb-6 hidden lg:flex'>Total balance:<span className='font-bold ml-1'>$0 USD</span> </p>

        <div className='flex flex-col relative lg:absolute left-0 lg:top-25 mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/wallets/btc' className='body text-body-secondary pl-4 pb-1 max-w-fit border-l border-line'>Bitcoin Wallet</Link>
          <Link href='/dashboard/wallets/usd' className='body text-primary-default font-bold pl-4 border-l-2 border-primary-default pt-1 max-w-fit'>USD Wallet</Link>
        </div>

        <div className="bg-secondary-aquamarineLight rounded-4xl border-secondary-aquamarine border-2 flex flex-col wallet-main p-4 lg:px-10 lg:py-6 mx-auto">
          {transferStepUsd === 0 && exchangeStepUsd === 0 && (
            <>
            <div className="wallet-tabs flex justify-between">
                <input type="radio" id="radio-transfer" name="wallet-tabs" value='transfer' checked={walletTabState === 'transfer'} onChange={handleWalletTabChange} className='wallet' />
                <label 
                    className={`z-10 wallet-tab-usd body text-placeholder py-3 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'transfer' ? 'active' : 'text-placeholder'}`}
                    htmlFor="radio-transfer">Transfer
                </label>
                <input type="radio" id="radio-exchange" name="wallet-tabs" value='exchange' checked={walletTabState === 'exchange'} onChange={handleWalletTabChange} className='wallet' />
                <label 
                    className={`z-10 wallet-tab-usd body text-placeholder py-3 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'exchange' ? 'active' : 'text-placeholder'}`}
                    htmlFor="radio-exchange">Exchange
                </label>
                <span className="wallet-glider-usd"></span>
            </div>
            
            <div className='flex items-center justify-center w-full'>
              {walletTabState === 'transfer' && (
                <form className='' onSubmit={nextTransferUsd}>
                  <div className=' my-10 lg:my-16 flex flex-col relative w-full items-center justify-center'>
                    <input 
                    type="text"
                    placeholder='0 USD'
                    className='wallet text-placeholder bg-secondary-aquamarineLight h1 w-1/2 text-center'
                    onChange={(e) => setInputUsdValue(e.target.value)}
                    required
                    />
                    <button className='meta text-placeholder absolute right-15'>MAX</button>
                    <button className='flex'>
                        <Switch className='h-6 w-6 text-primary-default mr-2'></Switch>
                        <p className='body-sm text-body-secondary'>0 BTC</p>
                    </button>
                  </div>

                  <label htmlFor="" className='body-sm font-bold text-body-secondary mb-1'>To</label>
                  <input className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 lg:mb-6'
                      type={"text"}
                      required
                      placeholder="Bank account *****1234"
                      onChange={(e) => setInputUsdAddress(e.target.value)}
                  />

                  <h6 className='display w-full'>
                    <PrimaryButtonFull text="Continue" />
                  </h6>

                </form>
              )}
              {walletTabState === 'exchange' && (
                <form className='' onSubmit={nextExchangeUsd} >
                  <div className='my-10 lg:my-16 flex flex-col relative w-full items-center justify-center'>
                    <input 
                    type="text"
                    placeholder='0 USD'
                    className='wallet text-placeholder bg-secondary-aquamarineLight h1 w-1/2 text-center'
                    onChange={(e) => setExchangeUsdValue(e.target.value)}
                    required
                    />
                    <button className='meta text-placeholder absolute right-15'>MAX</button>
                    <button className='flex'>
                        <Switch className='h-6 w-6 text-primary-default mr-2'></Switch>
                        <p className='body-sm text-body-secondary'>0 BTC</p>
                    </button>
                  </div>
                
                  <div className='border-b border-line mb-6 lg:mb-10'></div>

                  <div className='flex items-center justify-between mb-6 lg:mb-10'>
                  <div className='flex flex-col'>
                    <p className='mb-2 text-body-primary'>From</p>
                    <p className='body-lg text-title-active'>BTC</p>
                    <p className='body-sm text-body-secondary'>Available: <span>4.990087</span> BTC</p>
                  </div>
                  <SwitchAlt className='text-primary-default h-6 w-6'/>
                  <div className='flex flex-col items-end'>
                    <p className='mb-2 text-body-primary'>To</p>
                    <p className='body-lg text-title-active'>USD</p>
                    <p className='body-sm text-body-secondary'>Available: <span>6,406.00</span> USD</p>
                  </div>

                  </div>

                  <h6 className='display w-full'>
                    <PrimaryButtonFull text="Continue" />
                  </h6>

              </form>
              )}
            </div>
            </>
          )}

          {transferStepUsd === 1 && (
          <div className='flex flex-col items-center'>
            <Usd className='mb-4' />
            <p className='body-lg text-title-active mb-6 lg:mb-10'>You are transferring</p>
            <p className='h3'><span>{inputUsdValue} USD</span></p>
            <p className='body-sm text-body-secondary mb-10'>$100 USD</p>
            <p className='body-sm text-body-secondary mb-1 font-bold text-left mr-auto'>To</p>
            <p className='body text-title-active border-line border rounded-3xl p-4 w-full mb-4'><span>{inputUsdAddress}</span></p>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <div className='flex items-center'>
                <p className='body-sm font-bold text-body-secondary mr-1.5'>Transfer fee</p>
                <Info className='h-6 w-6 text-body-secondary'/>
              </div>
              <p className='body text-title-active'>$0</p>
            </div>
            <div className='flex items-center justify-between mb-6 lg:mb-10 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Time</p>
              <p className='body text-title-active'>1-3 Business Days</p>
            </div>
            <h6 className='display w-full' onClick={nextTransferUsd}>
              <PrimaryButtonFull text="Transfer now"/>
            </h6>
          </div>
          )}

          {transferStepUsd === 2 && (
            <div>
              <Logomark className='h-12 w-12 mb-10 hidden lg:flex mx-auto' />
              <h5 className='text-title-active font-bold mb-4 mt-10 lg:mt-0'>Enter the 6-digit code from you verification email</h5>
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

          {transferStepUsd === 3 && (
          <div className='flex flex-col items-center'>
            <Success className='mt-4 mb-4 lg:mb-10 h-24 w-24 lg:h-30 lg:w-30' />
            <h5 className='display mb-4'>Transfer complete</h5>
            <p className='h3'><span>{inputUsdValue} USD</span></p>
            <p className='body-sm text-body-secondary mb-4'>0.00368030 BTC</p>
            <p className='body text-body-primary mb-4 lg:mb-10'>Sent to {inputUsdAddress}</p>
            <h6 className='display w-full mb-4'>
              <PrimaryButtonFull text="View transfer"/>
            </h6>
            <Link href='/dashboard/wallets' className='text-primary-default body'>Back to Wallets</Link>
          </div>
          )}

          {exchangeStepUsd === 1 && (
          <div className='flex flex-col items-center'>
            <Usd className='mb-4 hidden lg:flex' />
            <p className='body-lg text-title-active font-bold mt-10 lg:mt-0 mb-6 lg:mb-10'>You are converting</p>
            <p className='h3'><span>{exchangeUsdValue} USD</span></p>
            <p className='body-sm text-body-secondary mb-10'>0.00368030 BTC</p>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <p className='body-sm font-bold text-body-secondary'>To</p>
              <p className='body text-title-active'>BTC</p>
            </div>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Conversion rate</p>
              <p className='body text-title-active'>$27,000.94 USD/BTC</p>
            </div>
            <div className='flex items-center justify-between mb-6 lg:mb-10 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Time</p>
              <p className='body text-title-active'>Instantly</p>
            </div>
            <h6 className='display w-full'>
              <PrimaryButtonFull text="Convert now"/>
            </h6>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
