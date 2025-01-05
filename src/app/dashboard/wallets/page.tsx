'use client'
import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import InstantBitcoin from 'src/public/icons/instant-bitcoin.svg'
import OneTimeBank from 'src/public/icons/one-time-bank.svg'
import Scheduled from 'src/public/icons/scheduled.svg'
import Right from 'src/public/icons/right.svg'
import Close from 'src/public/icons/close.svg'
import Logomark from 'src/public/logos/logomark-color.svg'
import Conversion from 'src/public/icons/conversion.svg'
import SecondaryButton from '../../components/SecondaryButton';
import { useState, useEffect, useCallback } from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function WalletsPage() {
  // States for BTC
  const [btcChecked, btcIsChecked] = useState(false);
  const [modalOpenBtc, modalIsOpenBtc] = useState(false);
  const [modalStepBtc, setModalStepBtc] = useState(0);

  // States for USD
  const [usdChecked, usdIsChecked] = useState(false);
  const [modalOpenUsd, modalIsOpenUsd] = useState(false);
  const [modalStepUsd, setModalStepUsd] = useState(0);

  const [otp, setOtp] = useState('');

  // Toggle for BTC
  const toggleBtcChecked = (event) => {
    if (!btcChecked) {
      btcIsChecked(event.target.checked);
      modalIsOpenBtc(true);
    } else {
      btcIsChecked(false);
    }
  };

  // Toggle for USD
  const toggleUsdChecked = (event) => {
    if (!usdChecked) {
      usdIsChecked(event.target.checked);
      modalIsOpenUsd(true);
    } else {
      usdIsChecked(false);
    }
  };

  // Close modal for BTC
  const closeModalBtc = () => {
    btcIsChecked(false);
    modalIsOpenBtc(false);
    setModalStepBtc(0);
  };

  // Close modal for USD
  const closeModalUsd = () => {
    usdIsChecked(false);
    modalIsOpenUsd(false);
    setModalStepUsd(0);
  };

  // Next page for BTC
  const nextPageBtc = async (event) => {
    event.preventDefault();
    setModalStepBtc(modalStepBtc + 1);
  };

  // Next page for USD
  const nextPageUsd = async (event) => {
    event.preventDefault();
    setModalStepUsd(modalStepUsd + 1);
  };

  const handleSubmitBtc = useCallback((event) => {
    event?.preventDefault();
    console.log("Form submitted with OTP: " + otp);
    modalIsOpenBtc(false);
    setModalStepBtc(0);
    setOtp('');
  }, [otp, modalIsOpenBtc, setModalStepBtc, setOtp]);  // Include all dependencies here

  const handleSubmitUsd = useCallback((event) => {
    event?.preventDefault();
    console.log("Form submitted with OTP: " + otp);
    modalIsOpenUsd(false);
    setModalStepUsd(0);
    setOtp('');
  }, [otp, modalIsOpenUsd, setModalStepUsd, setOtp]);  // Include all dependencies here

  useEffect(() => {
    if (otp.length === 6) {
      handleSubmitBtc();
      handleSubmitUsd();
    }
  }, [otp, handleSubmitBtc, handleSubmitUsd]);

  const [btcData, setBtcData] = useState({ amount: 0, in_usd: 0 });
  const [usdData, setUsdData] = useState({ amount: 0, in_btc: 0 });

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-balances`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          const btcAmount = Number(response.data.btc.amount);
          setBtcData({ ...response.data.btc, amount: btcAmount });
          setUsdData(response.data.usd);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const totalAmount = (parseFloat(usdData.amount) + parseFloat(btcData.in_usd)).toLocaleString('en-US');

  return (
    <div className='flex mx-6 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>
        <h4 className='mb-1 lg:mb-2 display'>Wallets</h4>
        <p className='body text-body-secondary mb-4 lg:mb-6'>Total balance:<span className='font-bold ml-1'>${totalAmount} USD</span> </p>

        <div className='w-full mx-auto lg:hidden flex mb-6'>
          <SecondaryButton text='Exchange'/>
        </div>

        <div className='flex lg:flex-row flex-col justify-center w-full gap-x-4 relative mb-6'>

          <Link className='lg:flex hidden absolute bg-white rounded-full border-title-active border-2 p-2.5 top-14' href="/dashboard/wallets/btc?tab=exchange">
            <Conversion className='w-6 h-6 text-title-active'/>
          </Link>

          <div className='bg-secondary-keylimeLight rounded-3xl border-secondary-keylime border-2 w-full lg:w-1/2 flex flex-col justify-between items-start p-6 lg:px-10 lg:py-8 lg:mb-0 mb-4'>
            <div className='flex justify-between w-full'>
              <div className='flex flex-col justify-center'>
                <p className='text-title-active body-lg font-bold'>Bitcoin</p>
                <h3 className='text-title-active break-all block'>{btcData.amount} BTC</h3>
                <p className='text-body-secondary body-sm break-all block'>≈${btcData.in_usd.toLocaleString('en-US')} USD</p>
              </div>
              <Bitcoin/>
            </div>
            <div className='my-4 lg:my-6 w-full border-b border-title-active'></div>
            <p className='body font-bold text-title-active mb-4'>Bitcoin Transfer</p>
              <Link href="/dashboard/wallets/btc" className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
                <div className='flex items-center'>
                  <InstantBitcoin className='mr-4 h-10 w-10 lg:h-12 lg:w-12'/>
                  <div className='flex flex-col'>
                    <p className='body text-title-active mb-1'>Instant</p>
                    <p className='meta text-body-secondary'>Transfer BTC to your wallet</p>
                  </div>
                </div>
                <Right className='text-primary-default h-6 w-6'/>
              </Link>
              <div className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
                <div className='flex items-center'>
                  <Scheduled className='mr-4 h-10 w-10 lg:h-12 lg:w-12'/>
                  <div className='flex flex-col'>
                    <p className='body text-title-active mb-1'>Scheduled</p>
                    <p className='meta text-body-secondary'>Weekly transfer</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className='toggle'
                  onChange={toggleBtcChecked}
                  checked={btcChecked}
                  id="switchbtc" />
                  <label
                  htmlFor='switchbtc'
                  className='toggle'
                  >Toggle</label>

                {modalOpenBtc && (
                  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
                  <div className='bg-white modal-width lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>

                    {modalStepBtc === 0 ? (
                      <>
                        <p className='text-title-active body-lg font-bold mb-2'>Scheduled Bitcoin Transfer</p>
                        <p className='text-body-secondary body mb-4'>Sent every Sunday (00:00AM)</p>
                        <form className='w-full' onSubmit={nextPageBtc}>
                          <div className='mb-8 w-full'>
                            <p className='text-body-secondary body-sm mb-1 mr-auto text-left'>Your Address</p>
                            <label className='hidden'>Email</label>
                            <input className='wallet-modal p-4 w-full body rounded-2xl'
                                type={"text"}
                                required
                                placeholder="On-chain bitcoin address"
                                // will need to create btcAddress variable
                                // onChange={(e) => (btcAddress.current = e.target.value)}
                            />
                          </div>
                          <h6 className='display mt-10 mb-6'>
                            <PrimaryButton text="Save changes" />
                          </h6>
                        </form>
                      </>
                    ) : (
                      <>
                        <Logomark className='h-12 w-12 mb-10 hidden lg:flex' />
                        <h5 className='text-title-active font-bold mb-4'>Enter the 6-digit code from you verification email</h5>
                        <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to john@example.com</p>
                        <form className='w-full' onSubmit={handleSubmitBtc}>
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
                      </>
                    )}

                    {/* close button */}
                    <button onClick={closeModalBtc} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
                      <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                        <Close className='h-6 w-6 text-primary-default' />
                      </div>
                    </button>
                  </div>
                </div>
              )}
              </div>
          </div>

          <div className='bg-secondary-aquamarineLight rounded-3xl border-secondary-aquamarine border-2 w-full lg:w-1/2 flex flex-col justify-between items-start p-6 lg:px-10 lg:py-8'>
            <div className='flex justify-between w-full'>
              <div className='flex flex-col justify-center'>
                <p className='text-title-active body-lg font-bold'>USD</p>
                <h3 className='text-title-active break-all block'>{usdData.amount.toLocaleString('en-US')} USD</h3>
                <p className='text-body-secondary body-sm'>≈${usdData.in_btc} BTC</p>
              </div>
              <Usd/>
            </div>
            <div className='my-4 lg:my-6 w-full border-b border-title-active'></div>
            <p className='body font-bold text-title-active mb-4'>Bank Transfer</p>
              <Link href='/dashboard/wallets/usd' className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
                <div className='flex items-center'>
                  <OneTimeBank className='mr-4 h-10 w-10 lg:h-12 lg:w-12'/>
                  <div className='flex flex-col'>
                    <p className='body text-title-active mb-1'>One-time bank transfer</p>
                    <p className='meta text-body-secondary'>Transfer USD to your bank account</p>
                  </div>
                </div>
                <Right className='text-primary-default h-6 w-6'/>
              </Link>
              <div className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
                <div className='flex items-center'>
                  <Scheduled className='mr-4 h-10 w-10 lg:h-12 lg:w-12'/>
                  <div className='flex flex-col'>
                    <p className='body text-title-active mb-1'>Scheduled</p>
                    <p className='meta text-body-secondary'>Daily transfer</p>
                  </div>
                </div>
                <input
                type="checkbox"
                className='toggle'
                onChange={toggleUsdChecked}
                checked={usdChecked}
                id="switchusd" />
                <label
                htmlFor='switchusd'
                className='toggle'>Toggle
                </label>

                {modalOpenUsd && (
                  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
                  <div className='bg-white modal-width lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>

                    {modalStepUsd === 0 ? (
                      <>
                        <p className='text-title-active body-lg font-bold mb-2'>Scheduled Bank Transfer</p>
                        <p className='text-body-secondary body mb-4'>Sent daily (02:00 PM)</p>
                        <form className='w-full' onSubmit={nextPageUsd}>
                          <div className='mb-8 w-full'>
                            <p className='text-body-secondary body-sm mb-1 mr-auto text-left'>To</p>
                            <label className='hidden'>Bank account</label>
                            <input className='wallet-modal p-4 w-full body rounded-2xl mb-4'
                                type={"text"}
                                required
                                placeholder="Bank account *****1234"
                                // will need to create btcAddress variable
                                // onChange={(e) => (btcAddress.current = e.target.value)}
                            />
                            <p className='body-sm text-body-secondary'>Your full USD account balance will be automatically transferred to your bank account daily, once the minimum threshold has been reached.</p>
                          </div>
                          <h6 className='display mt-10 mb-6'>
                            <PrimaryButton text="Save changes" />
                          </h6>
                        </form>
                      </>
                    ) : (
                      <>
                        <Logomark className='h-12 w-12 mb-10 hidden lg:flex' />
                        <h5 className='text-title-active font-bold mb-4'>Enter the 6-digit code from you verification email</h5>
                        <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to john@example.com</p>
                        <form className='w-full' onSubmit={handleSubmitUsd}>
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
                      </>
                    )}

                    {/* close button */}
                    <button onClick={closeModalUsd} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
                      <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                        <Close className='h-6 w-6 text-primary-default' />
                      </div>
                    </button>
                  </div>
                </div>
              )}
              </div>
          </div>

        </div>
      <Link href="/dashboard/wallets/btc?tab=exchange" className='max-w-fit mx-auto lg:flex hidden'>
        <SecondaryButton text='Exchange'/>
      </Link>
      </div>
    </div>
  )
}
