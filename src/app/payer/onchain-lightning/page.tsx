'use client'

import Link from 'next/link';
import ArrowDown from 'src/public/icons/arrow-down.svg'
import ArrowUp from 'src/public/icons/arrow-up.svg'
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import Logo from 'src/public/logos/color.svg'
import AyceLogo from 'src/public/logos/logomark-color.svg'
import Copy from 'src/public/icons/copy.svg'
import Success from 'src/public/icons/success-emblem.svg'
import Expired from 'src/public/icons/expired-emblem.svg'
import MaskGroup from 'src/public/icons/maskgroup.svg'
import QRCode from 'qrcode'
import axios from 'axios';

export default function OnchainLightningPage() {

  const searchParams = useSearchParams();
 
  const payerToken = searchParams.get('payerToken');

  const [walletTabState, setWalletTabState] = useState('onchain');

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [qrDataUrl, setQrDataUrl] = useState(null);

  const [paidState, setPaidState] = useState(false);

  // Define state to hold the payment information
  const [paymentInfo, setPaymentInfo] = useState({});


  const [expiredState, setExpiredState] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [sseError, setSseError] = useState(null);

  // Event handler to update state
  const handleWalletTabChange = (e) => {
    setWalletTabState(e.target.value);
  };

  const textToCopyRef = useRef(null);
  const textToCopyRefLightning = useRef(null);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(textToCopyRef.current.innerText)
      .then(() => { 
        // Success!
        console.error('copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  const copyToClipboardLightning = (e) => {
    navigator.clipboard.writeText(textToCopyRefLightning.current.innerText)
      .then(() => { 
        // Success!
        console.error('copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  useEffect(() => {
    if (secondsRemaining > 0) {
      const intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => Math.max(prevSeconds - 1, 0));
      }, 1000);
  
      return () => clearInterval(intervalId); // Clear the interval when the component unmounts
    }
  }, [secondsRemaining]);
  
  useEffect(() => {
    setMinutes(Math.floor(secondsRemaining / 60));
    setSeconds(secondsRemaining % 60);
  }, [secondsRemaining]);

  useEffect(() => {
    const generateQRDataUrl = async (text) => {
      try {
        const dataUrl = await QRCode.toDataURL(text);
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error(err);
      }
    };
  
    if (walletTabState === 'onchain') {
      generateQRDataUrl(address);
    } else if (walletTabState === 'lightning') {
      generateQRDataUrl(lightningAddress);
    }
  }, [walletTabState, paymentInfo]);

   // useEffect for the POST API call
   useEffect(() => {
    const fetchPaymentAddresses = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions/pos/get-payment-addresses`, {
          token: payerToken
        });
        setPaymentInfo(response.data);

        console.log("Expiry from API:", response.data.expiry);

        const currentUnixTimestamp = Math.floor(Date.now() / 1000);
        const differenceInSeconds = response.data.expiry - currentUnixTimestamp;

        setSecondsRemaining(differenceInSeconds);

      } catch (error) {
        console.error("Error fetching payment addresses:", error);
      }
    };

    fetchPaymentAddresses(); // Calling the function to initiate the POST request
  }, []); // Empty dependency array ensures this useEffect runs only once

  const {
    btc_amount: btcAmount,
    usd_amount: usdAmount,
    description: description,
    lightning: lightningAddress,
    "on-chain": address,
    transaction_label: transactionLabel,
    expiry: expiry,
  } = paymentInfo;


  useEffect(() => {
    // Check if transactionLabel is not defined or empty
    if (!transactionLabel) return;
  
    const transactionUrl = `${process.env.NEXT_PUBLIC_API_URL}/transactions/pos/payment-status/${transactionLabel}`;
    const eventSource = new EventSource(transactionUrl);
  
    eventSource.onmessage = (event) => {
      if (event.data) { 
        setPaidState(true);
      } else if (event.data === 'expired') {
        // alert('expired');
        setExpiredState(true)
      }
    };
  
    eventSource.onerror = (error) => {
      console.error(`EventSource failed: ${error}`);
      eventSource.close();
    };
  
    return () => {
      eventSource.close(); // Close the EventSource when the component unmounts or transactionLabel changes.
    };
  }, [transactionLabel]); 

  
  return (
    
    <main className='flex min-h-screen flex-col items-center justify-start relative bg-background'>
      {/* <div className='h-12 w-12 lg:h-16 lg:w-16 bg-line mt-12 mb-4 lg:mt-10 lg:mb-10 rounded-full'></div> */}
      <AyceLogo className='h-12 w-12 lg:h-16 lg:w-16 mt-12 mb-4 lg:mt-10 lg:mb-10'  />
      
    
      { paidState === false && (
        <>
        { expiredState && (
          <>
          <div className='bg-white rounded-4xl flex flex-col px-7.5 mb-6 pb-7 lg:box-shadow lg:px-10 lg:pb-20 lg:mb-10 mx-6 lg:w-full wallet-payer'>
            <div className='mx-auto text-center width-payer-success-content'>
              <Expired className='h-30 w-30 lg:h-40 lg:w-40 mx-auto mb-10 mt-20' />
              <p className='body-lg text-title-active font-bold mb-2 lg:mb-2'>Session expired</p>
              <p className='text-body-primary mb-8 lg:mb-6'>The payment timer has expired. Please generate a new QR code to complete the transaction.</p>
              <div className='border-t border-line w-full relative'>
                <div className='lg:hidden absolute h-8 w-8 rounded-full -left-11 -top-4 bg-background'></div>
                <div className='lg:hidden absolute h-8 w-8 rounded-full -right-11 -top-4 bg-background'></div>
              </div>
              <h6 className='display mt-6'>
                <Link href="/dashboard/payments/pos" className="flex items-center justify-center mx-auto bg-primary-button text-white px-10 py-4 font-bold primary-button">Try again</Link>
              </h6>
            </div>
          </div>

          </>
        )}
        { !expiredState && (
            <div className="bg-white rounded-4xl flex flex-col box-shadow wallet-payer p-4 pb-0 lg:p-10 lg:pb-0 mx-auto">
                <div className='rounded-full w-full bg-background p-2'>
                  <div className="wallet-tabs flex justify-between w-full rounded-full bg-background">
                      <input type="radio" id="radio-transfer" name="wallet-tabs" value='onchain' checked={walletTabState === 'onchain'} onChange={handleWalletTabChange} className='wallet' />
                      <label 
                          className={`z-10 wallet-tab-onchainlightning body text-placeholder py-2 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'onchain' ? 'active' : 'text-placeholder'}`}
                          htmlFor="radio-transfer">On-chain
                      </label>
                      <input 
                        type="radio" 
                        id="radio-exchange" 
                        name="wallet-tabs" value='lightning' 
                        checked={walletTabState === 'lightning'} 
                        onChange={handleWalletTabChange} 
                        // onClick={handleLightningClick}
                        className='wallet'/>
                        
                      <label 
                          className={`z-10 wallet-tab-onchainlightning body text-placeholder py-2 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'lightning' ? 'active' : 'text-placeholder'}`}
                          htmlFor="radio-exchange">Lightning
                      </label>
                      <span className="wallet-glider-onchainlightning"></span>
                  </div>
                </div>

                {walletTabState === 'onchain' && (
                <div className='flex flex-col items-center justify-center w-full relative bg-white'>
                  <p className='text-title-active body-lg font-bold pt-4 pb-2 lg:py-4 z-10'>{description}</p>
                  <div style={{ backgroundColor: '#FFF0F7'}} className='absolute top-15 rounded-2xl w-full'>
                    {/* <Image
                      src="/static/images/maskgroup.png"
                      width={384}
                      height={384}
                      alt="logo of AYCE"
                    /> */}
                    <MaskGroup className="maskgroup" />

                  </div>
                  <div className='z-10 flex flex-col items-center pt-5'>
                    <p className='body text-title-active'>${usdAmount || "Loading..."}</p>
                    <p className='body-lg font-bold text-title-active mb-2'>{btcAmount ? `${btcAmount} BTC` : "Loading..."}</p>
                    {/* <QrCode className='qrbackground' /> */}
                    {qrDataUrl ? <img src={qrDataUrl} alt="QR Code" className="qrbackground" /> : <span>Loading...</span>}

                  </div>

                  <h6 className='display pt-10 pb-4 w-full'>
                    <button className='flex items-center justify-center mx-auto w-full bg-primary-button text-white px-10 py-4 font-bold primary-button'>Open in wallet</button>
                  </h6>

                  <div className='flex justify-between w-full'>
                    <p className='body-sm font-bold text-body-primary mb-1'>Payment request</p>
                    <button onClick={copyToClipboard}>
                      <Copy className='h-6 w-6 text-body-primary' />
                    </button>
                  </div>

                  <div className='w-full flex justify-between items-start mb-4'>
                    <div className={`body-sm text-body-primary mb-1 overflow-hidden w-full ${isExpanded ? 'h-auto overflow-visible' : 'h-6 overflow-ellipsis'}`}>
                      <p ref={textToCopyRef} className={`inline-block ${isExpanded ? 'whitespace-pre-wrap break-all' : 'whitespace-nowrap'}`}>{address}</p>
                    </div>
                    <button onClick={toggleExpand}>
                      {isExpanded ? <ArrowUp className="text-primary-default h-6 w-6" /> : <ArrowDown className="text-primary-default h-6 w-6" />}
                    </button>
                  </div>

                  <div className='flex py-3 lg:py-4 border-t border-line w-full justify-center'>
                    <span className='text-primary-default body-sm mr-1'>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <p className='text-body-secondary body-sm'> until bitcoin price updates </p>
                  </div>

                </div>
                )}

                {walletTabState === 'lightning' && (
                <div className='flex flex-col items-center justify-center w-full relative'>
                  <p className='text-title-active body-lg font-bold pt-4 pb-2 lg:py-4 z-10'>{description}</p>
                

                  <div style={{ backgroundColor: '#FFF0F7'}} className='absolute top-15 rounded-2xl w-full'>
                    {/* <Image
                      src="/logos/maskgroup.png"
                      width={384}
                      height={384}
                      alt="logo of AYCE"
                    /> */}
                    <MaskGroup className="maskgroup" />
                  </div>
                  <div className='z-10 flex flex-col items-center pt-5'>
                    <p className='body text-title-active'>${usdAmount || "Loading..."}</p>
                    <p className='body-lg font-bold text-title-active mb-2'>{btcAmount ? `${btcAmount} BTC` : "Loading..."}</p>
                    {qrDataUrl ? <img src={qrDataUrl} alt="QR Code" className="qrbackground" /> : <span>Loading...</span>}

                  </div>

                  <h6 className='display pt-10 pb-4 w-full'>
                    <button className='flex items-center justify-center mx-auto w-full bg-primary-button text-white px-10 py-4 font-bold primary-button'>Open in wallet</button>
                  </h6>

                  <div className='flex justify-between w-full'>
                    <p className='body-sm font-bold text-body-primary mb-1'>Payment request</p>
                    <button onClick={copyToClipboardLightning}>
                      <Copy className='h-6 w-6 text-body-primary' />
                    </button>
                  </div>

                  <div className='w-full flex justify-between items-start mb-4'>
                    <div className={`body-sm text-body-primary mb-1 overflow-hidden w-full ${isExpanded ? 'h-auto overflow-visible' : 'h-6 overflow-ellipsis'}`}>
                      <p ref={textToCopyRefLightning} className={`inline-block ${isExpanded ? 'whitespace-pre-wrap break-all' : 'whitespace-nowrap'}`}>{lightningAddress}</p>
                    </div>
                    <button onClick={toggleExpand}>
                      {isExpanded ? <ArrowUp className="text-primary-default h-6 w-6" /> : <ArrowDown className="text-primary-default h-6 w-6" />}
                    </button>
                  </div>

                  <div className='flex py-3 lg:py-4 border-t border-line w-full justify-center'>
                    <span className='text-primary-default body-sm mr-1'>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <p className='text-body-secondary body-sm'> until bitcoin price updates </p>
                  </div>

                </div>
                )}

            </div>
        )}
        </>
      )}

      { paidState === true && (
        <>
        <div className='bg-white rounded-4xl flex flex-col px-7.5 mb-6 pb-7 lg:box-shadow lg:px-10 lg:pb-20 lg:mb-10 mx-6 lg:w-full wallet-payer'>
          <div className='mx-auto text-center width-payer-success-content'>
            <Success className='h-30 w-30 lg:h-40 lg:w-40 mx-auto mb-10 mt-20' />
            <p className='body-lg text-title-active font-bold mb-2 lg:mb-2'>Transaction completed!</p>
            <p className='text-body-primary mb-8 lg:mb-6'>Thank you for your payment. We’ve sent an email with all the details of your order. You can track the order in your order history.</p>
            <div className='border-t border-line w-full relative'>
              <div className='lg:hidden absolute h-8 w-8 rounded-full -left-11 -top-4 bg-background'></div>
              <div className='lg:hidden absolute h-8 w-8 rounded-full -right-11 -top-4 bg-background'></div>
            </div>
            <p className='mt-7 lg:mt-1 text-body-primary'>Transaction number: {transactionLabel}</p>
          </div>
        </div>

        <h6 className='display'>
          <Link href="/dashboard/overview" className="flex items-center justify-center mx-auto bg-primary-button text-white px-10 py-4 font-bold primary-button">Back to site</Link>
        </h6>
        </>
      )}
      
      <div className='flex items-center mt-auto mb-6 pt-10 lg:pt-0 lg:mb-10'>
        <p className='body-sm text-body-secondary mr-1.5'>powered by</p>
        <Logo className='h-6'/>
      </div>
    </main>
  )
}
