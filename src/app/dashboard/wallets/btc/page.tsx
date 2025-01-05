'use client'

import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Alert from 'src/public/icons/alert.svg'
import Info from 'src/public/icons/info.svg'
import ArrowRight from 'src/public/icons/arrow-right.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import Logomark from 'src/public/logos/logomark-color.svg'
import Switch from 'src/public/icons/switch.svg'
import Success from 'src/public/icons/success-emblem.svg'
import Back from 'src/public/icons/back.svg'
import SwitchAlt from 'src/public/icons/switch2.svg'
import PrimaryButtonFull from '../../../components/PrimaryButtonFull';
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import InputConversion from '@/src/app/components/wallets/InputConversion';
import { useSearchParams } from 'next/navigation';

const WalletsBtcPage: React.FC = () => {
  const { data: session, status } = useSession();
  const token = session?.token; // Extract the token from the session

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const displayEmail = session?.user?.emailaddress || 'john@examples.com';

  const [walletTabState, setWalletTabState] = useState('transfer');
  const [chainTabState, setChainTabState] = useState('onchain');

  const [inputBtcValue, setInputBtcValue] = useState('');
  const [exchangeBtcValue, setExchangeBtcValue] = useState('');
  const [inputBtcAddress, setInputBtcAddress] = useState('');

  const [transferStep, setTransferstep] = useState(0);
  const [exchangeStep, setExchangestep] = useState(0);

  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [incorrectOtp, setIncorrectOtp] = useState(false);
  const [incorrectAddress, setIncorrectAddress] = useState(false);

  const [otp, setOtp] = useState('');

  const [parentConversionRate, setParentConversionRate] = useState<number | null>(null);

  // Event handler to update state
  const handleWalletTabChange = (e) => {
    setWalletTabState(e.target.value);
  };

  const handleChainTabChange = (e) => {
    setChainTabState(e.target.value);
  };

  // Next step for transfer
  const nextTransfer = async (event) => {
    event.preventDefault();
    setTransferstep(transferStep + 1);
  };

  // Next step for transfer to confirmation page, checks if btc balance is > than inputBtcValue
  const nextTransferConfirm = async (event) => {
    event.preventDefault();

    // Validate BTC address
    if (!/^[a-zA-Z0-9]{27,34}$/.test(inputBtcAddress)) {
      console.error("Invalid BTC address");
      setIncorrectAddress(true);
      return; // Exit the function early if the BTC address is invalid
    }

    // Check if inputBtcValue is smaller than btcData.amount
    if (parseFloat(inputBtcValue) < parseFloat(btcData.amount)) {
      setTransferstep(transferStep + 1);
    } else {
      setInsufficientBalance(true);
      setIncorrectAddress(false);
    }
  };

  // Next step for exchange
  const nextExchange = async (event) => {
    event.preventDefault();
    setExchangestep(exchangeStep + 1);
  };

  const [btcData, setBtcData] = useState({ amount: 0, in_usd: 0 });
  const [usdData, setUsdData] = useState({ amount: 0, in_btc: 0 });

  // to set state to exchange from link with params of ?tab=exchange
  useEffect(() => {
    if (tab === 'exchange') {
      setWalletTabState('exchange');
    }
  }, []);

  // get wallet balance
  useEffect(() => {
    if (!token) return;  // No token, don't fetch
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

  const [apiExchangeResponse, setApiExchangeResponse] = useState(null);

  const [conversionRate, setConversionRate] = useState(null);

  const [exchangeTransferFee, setExchangeTransferFee] = useState(null);

  // first exchange API call
  const handleSubmitExchange = async (event) => {
    event.preventDefault();

    console.log(exchangeBtcValue);

    const payload = {
      "amount": parseFloat(exchangeBtcValue),
      "_from": "BTC",
      "_to": "USD"
    };

    console.log("Payload being sent:", payload, token);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/exchange/get-conversion-rate`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Server Response:", response.data);
      setApiExchangeResponse(response.data);
      setConversionRate(response.data.conversion_rate);
      setExchangeTransferFee(response.data.transfer_fee);

      nextExchange(event);
    } catch (error) {
      console.error("Error making the API call:", error.response?.data || error.message);

      if (error.response?.data?.error === 'Insufficient btc balance') {
        setInsufficientBalance(true);
      }
    }
  };

  // second API call for exchange confirmation
  const handleConfirmExchange = async (event) => {
    event.preventDefault();

    const payload = {
      "token": apiExchangeResponse.token,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/exchange/confirm`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check if the response confirms the successful exchange
      if (response.data.success) {
        console.log("Exchange confirmed:", response.data.success);
        setConversionRate(response.data.conversion_rate);
        nextExchange(event);
      } else {
        if (response.data.error && response.data.error === "Expired transaction") {
          try {
            const refreshResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/transactions/exchange/refresh-conversion-rate`,
              payload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
            );

            if (refreshResponse.data.conversion_rate) {
              setConversionRate(refreshResponse.data.conversion_rate);
            } else {
              console.warn("Couldn't fetch the updated conversion rate. Please try again later.");
            }
          } catch (error) {
            console.error("Error making the API call:", error.response?.data || error.message);
          }
        } else {
          console.warn("Error making the API call:", error.response?.data || error.message);
        }
      }
    } catch (error) {
      console.error("Error making the API call:", error.response?.data || error.message);
    }
  };

  const [transferToken, setTransferToken] = useState(null);

  // first transfer API call
  const handleSubmitTransfer = async (event) => {
    event.preventDefault();

    const payload = {
      "amount": parseFloat(inputBtcValue),
      "address": inputBtcAddress,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/transfer-btc`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Server Response:", response.data);
      if (response.data.token && response.data.success) {
        setTransferToken(response.data.token);
        setTransferstep(transferStep + 1);
      } else {
        console.error("Unexpected server response:", response.data);
      }
    } catch (error) {
      console.error("Error making the API call:", error.response?.data || error.message);

    }
  };

  const [calculatedExchangeUsd, setCalculatedExchangeUsd] = useState(0);

  useEffect(() => {
    if (exchangeBtcValue && conversionRate) {
        const value = (exchangeBtcValue * parseFloat(conversionRate.replace(/[$BTC/USD]/g, '').trim())).toFixed(2);
        setCalculatedExchangeUsd(value);
    }
  }, [exchangeBtcValue, conversionRate]);

  const [calculatedTransferUsd, setCalculatedTransferUsd] = useState(0);

  useEffect(() => {
    if (inputBtcValue && conversionRate) {
        const value = (inputBtcValue * parseFloat(conversionRate.replace(/[$BTC/USD]/g, '').trim())).toFixed(2);
        setCalculatedTransferUsd(value);
    }
  }, [inputBtcValue, conversionRate]);

  // if otp is full at 6 char, send post API request
  useEffect(() => {
    if (otp.length === 6) {
      const confirmOtp = async () => {
        const payload = {
          "token": transferToken,
          "otp": otp,
        };
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions/transfer/otp-confirm`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log("Server Response:", response.data);
          if (response.data.success) {
            setTransferstep((prevStep) => prevStep + 1);
          } else {
            console.error("Unexpected server response:", response.data);
            setIncorrectOtp(true);
          }
        } catch (error) {
          console.error("Error making the API call:", error.response?.data || error.message);
          setIncorrectOtp(true);
        }
      };
      confirmOtp();
    }
  }, [otp, transferToken, token]);


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
        <p className='body text-body-secondary mb-4 lg:mb-6 hidden lg:flex'>Total balance:<span className='font-bold ml-1'>${totalAmount} USD</span> </p>

        <div className='flex flex-col relative lg:absolute left-0 lg:top-25 mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/wallets/btc' className='font-bold body text-primary-default pl-4 pb-1 border-l-2 border-primary-default max-w-fit'>Bitcoin Wallet</Link>
          <Link href='/dashboard/wallets/usd' className='body text-body-secondary pl-4 border-l border-line pt-1 max-w-fit'>USD Wallet</Link>
        </div>

        <div className="bg-secondary-keylimeLight rounded-4xl border-secondary-keylime border-2 flex flex-col wallet-main-maxheight p-4 lg:px-10 lg:py-6 mx-auto">
          {transferStep === 0 && exchangeStep === 0 && (
            <>
            <div className="wallet-tabs flex justify-between">
                <input type="radio" id="radio-transfer" name="wallet-tabs" value='transfer' checked={walletTabState === 'transfer'} onChange={handleWalletTabChange} className='wallet' />
                <label
                    className={`z-10 wallet-tab body text-placeholder py-3 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'transfer' ? 'active' : 'text-placeholder'}`}
                    htmlFor="radio-transfer">Transfer
                </label>
                <input type="radio" id="radio-exchange" name="wallet-tabs" value='exchange' checked={walletTabState === 'exchange'} onChange={handleWalletTabChange} className='wallet' />
                <label
                    className={`z-10 wallet-tab body text-placeholder py-3 rounded-4xl w-1/2 flex items-center justify-center ${walletTabState === 'exchange' ? 'active' : 'text-placeholder'}`}
                    htmlFor="radio-exchange">Exchange
                </label>
                <span className="wallet-glider"></span>
            </div>

            <div className='flex items-center justify-center w-full'>
              {walletTabState === 'transfer' && (
                <form className='w-full' onSubmit={nextTransferConfirm}>

                  <div className='relative w-full flex justify-center'>
                    <InputConversion
                      inputBtcValue={inputBtcValue}
                      setInputBtcValue={setInputBtcValue}
                      setParentConversionRate={setParentConversionRate}
                      exchangeBtcValue={exchangeBtcValue}
                      setExchangeBtcValue={setExchangeBtcValue}
                      btcData={btcData} usdData={btcData.in_usd}
                    />

                    <div className='flex items-center absolute bottom-0 mb-4'>

                    {insufficientBalance && (
                      <div className='flex items-center'>
                        <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                        <p className='text-states-error body-xs'>Insufficient Funds. Please make a deposit to continue.</p>
                      </div>
                    )}
                    </div>
                  </div>

                  <div className="chain-tabs flex justify-between mb-6 lg:mb-10">
                    <input type="radio" id="radio-onchain" name="chain-tabs" value='onchain' checked={chainTabState === 'onchain'} onChange={handleChainTabChange} className='chain' />
                    <label
                    className={`z-10 chain-tab font-bold body py-2 w-1/2 flex items-center justify-center border-b border-line ${chainTabState === 'onchain' ? 'active' : 'z-10 chain-tab body py-2 w-1/2 flex items-center justify-center text-placeholder'}`}
                    htmlFor="radio-onchain">On-chain
                    </label>
                    <input type="radio" id="radio-lightning" name="chain-tabs" value='lightning' checked={chainTabState === 'lightning'} onChange={handleChainTabChange} className='chain' />
                    <label
                    className={`z-10 chain-tab font-bold body py-2 w-1/2 flex items-center justify-center border-b border-line ${chainTabState === 'lightning' ? 'active' : 'z-10 chain-tab body py-2 w-1/2 flex items-center justify-center text-placeholder'}`}
                    htmlFor="radio-lightning">Lightning
                    </label>
                    <span className="chain-glider"></span>
                  </div>

                  {chainTabState === 'onchain' && (
                  <div>
                    <label htmlFor="" className='body-sm font-bold text-body-secondary mb-1'>Address</label>
                    <input className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-1'
                      type={"text"}
                      required
                      placeholder="Enter on-chain bitcoin address"
                      onChange={(e) => setInputBtcAddress(e.target.value)}
                    />

                    {incorrectAddress && (
                      <div className='flex items-center'>
                        <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                        <p className='text-states-error body-xs'>Please enter a valid Address.</p>
                      </div>
                    )}

                    <h6 className='display w-full mt-6 mb-4'>
                      <PrimaryButtonFull text="Continue" />
                    </h6>
                  </div>
                  )}

                  {chainTabState === 'lightning' && (
                  <div>
                    <label htmlFor="" className='body-sm font-bold text-body-secondary mb-1'>Address</label>
                    <input className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-1'
                        type={"text"}
                        required
                        placeholder="Enter lightning bitcoin address"
                        // onChange={(e) => setInputBtcAddress(e.target.value)}
                    />

                    <h6 className='display w-full mt-6 mb-4'>
                      <PrimaryButtonFull text="Continue" />
                    </h6>
                  </div>
                  )}

                </form>
              )}
              {walletTabState === 'exchange' && (
                <form className='w-full' onSubmit={handleSubmitExchange} >
                  <div className='relative w-full flex justify-center'>
                    <InputConversion
                      inputBtcValue={inputBtcValue}
                      setInputBtcValue={setInputBtcValue}
                      setParentConversionRate={setParentConversionRate}
                      exchangeBtcValue={exchangeBtcValue}
                      setExchangeBtcValue={setExchangeBtcValue}
                      btcData={btcData} usdData={btcData.in_usd}
                    />

                    {insufficientBalance && (
                      <div className='flex items-center absolute bottom-0 mb-4'>
                        <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                        <p className='text-states-error body-xs'>Insufficient Funds. Please make a deposit to continue.</p>
                      </div>
                    )}
                  </div>

                  <div className='border-b border-line mb-6 lg:mb-10'></div>

                  <div className='flex items-center justify-between mb-6 lg:mb-10'>
                  <div className='flex flex-col'>
                    <p className='mb-2 text-body-primary'>From</p>
                    <p className='body-lg font-bold text-title-active'>BTC</p>
                    <p className='body-sm text-body-secondary'>Available: <span>{btcData.amount} BTC</span></p>
                  </div>
                  <SwitchAlt className='text-primary-default h-6 w-6'/>
                  <div className='flex flex-col items-end'>
                    <p className='mb-2 text-body-primary'>To</p>
                    <p className='body-lg font-bold text-title-active'>USD</p>
                    <p className='body-sm text-body-secondary'>Available: <span>{btcData.in_usd.toLocaleString('en-US')} USD</span></p>
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

          {transferStep === 1 && (
          <div className='flex flex-col items-center'>
            <Bitcoin className='mb-4' />
            <p className='body-lg text-title-active mb-6 lg:mb-10'>You are transferring</p>
            <p className='h3'><span>{inputBtcValue} BTC</span></p>
            <p className='body-sm text-body-secondary mb-10'>${(Number(inputBtcValue) * parentConversionRate).toFixed(2)} USD</p>
            <p className='body-sm text-body-secondary mb-1 font-bold text-left mr-auto'>To</p>
            <p className='body text-title-active border-line border rounded-3xl p-4 w-full mb-4'><span>{inputBtcAddress}</span></p>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <div className='flex items-center'>
                <p className='body-sm font-bold text-body-secondary mr-1.5'>Transfer fee</p>
                <Info className='h-6 w-6 text-body-secondary'/>
              </div>
              <p className='body text-title-active'>XX BTC</p>
            </div>
            <div className='flex items-center justify-between mb-6 lg:mb-10 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Time</p>
              <p className='body text-title-active'>Instantly</p>
            </div>
            <h6 className='display w-full' onClick={handleSubmitTransfer}>
              <PrimaryButtonFull text="Transfer now"/>
            </h6>
          </div>
          )}

          {transferStep === 2 && (
            <div>
              <Logomark className='h-12 w-12 mb-10 hidden lg:flex mx-auto' />
              <h5 className='text-title-active font-bold mb-4 mt-10 lg:mt-0'>Enter the 6-digit code from you verification email</h5>
              <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to {displayEmail}</p>
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
                {incorrectOtp && (
                  <div className='flex items-center absolute bottom-5 mb-4'>
                    <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                    <p className='text-states-error body-xs'>Incorrect 6-digit code.</p>
                  </div>
                )}
                <button className='text-primary-default body'>Or use authenticator app</button>
                </div>
              </form>
            </div>
          )}

          {transferStep === 3 && (
          <div className='flex flex-col items-center'>
            <Success className='mt-4 mb-4 lg:mb-10 h-24 w-24 lg:h-30 lg:w-30' />
            <h5 className='display mb-4'>Transfer complete</h5>
            <p className='h3'><span>{inputBtcValue} BTC</span></p>
            <p className='body-sm text-body-secondary mb-4'>${(Number(inputBtcValue) * parentConversionRate).toFixed(2)} USD</p>
            <p className='body text-body-primary mb-4 lg:mb-10'>Sent to {inputBtcAddress}</p>
            <Link href='/dashboard/activities'>
              <h6 className='display w-full mb-4'>
                <PrimaryButtonFull text="View transfer"/>
              </h6>
            </Link>
            <Link href='/dashboard/wallets' className='text-primary-default body'>Back to Wallets</Link>
          </div>
          )}

          {exchangeStep === 1 && (
          <div className='flex flex-col items-center'>
            <Bitcoin className='mb-4 hidden lg:flex' />
            <p className='body-lg text-title-active font-bold mt-10 lg:mt-0 mb-6 lg:mb-10'>You are converting</p>
            <p className='h3'><span>{exchangeBtcValue} BTC</span></p>
            <p className='body-sm text-body-secondary mb-10'>${calculatedExchangeUsd} USD</p>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <p className='body-sm font-bold text-body-secondary'>To</p>
              <p className='body text-title-active'>${calculatedExchangeUsd} USD</p>
            </div>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Conversion rate</p>
              <p className='body text-title-active'>{conversionRate}</p>
            </div>
            <div className='flex items-center justify-between mb-2.5 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Time</p>
              <p className='body text-title-active'>Instantly</p>
            </div>
            <div className='flex items-center justify-between mb-6 lg:mb-10 w-full'>
              <p className='body-sm font-bold text-body-secondary'>Transfer fee</p>
              <p className='body text-title-active'>{exchangeTransferFee}</p>
            </div>
            <h6 className='display w-full' onClick={handleConfirmExchange}>
              <PrimaryButtonFull text="Convert now"/>
            </h6>
          </div>
          )}

          {exchangeStep === 2 && (
          <div className='flex flex-col items-center'>
            <Success className='mt-4 mb-4 lg:mb-10 h-24 w-24 lg:h-30 lg:w-30' />
            <h5 className='display mb-4'>Exchange complete</h5>
            <p className='h3'><span>{exchangeBtcValue} BTC</span></p>
            <p className='body-sm text-body-secondary mb-4'>${calculatedExchangeUsd} USD</p>
            <br />
            <h6 className='display w-full mb-4'>
              <Link href="/dashboard/activities" className='flex items-center justify-center mx-auto bg-primary-button text-white px-10 py-4 font-bold primary-button'>View transfer</Link>
            </h6>
            <Link href='/dashboard/wallets' className='text-primary-default body'>Back to Wallets</Link>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletsBtcPage
